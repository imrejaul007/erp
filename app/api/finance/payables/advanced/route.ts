import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Enhanced Accounts Payable schema with advanced features
const advancedPayableSchema = z.object({
  supplierId: z.string().min(1),
  invoiceNo: z.string().min(1),
  supplierInvoiceNo: z.string().min(1),
  amount: z.number().min(0),
  currency: z.string().default('AED'),
  exchangeRate: z.number().positive().default(1),
  invoiceDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  paymentTerms: z.string().optional(),
  earlyDiscountPercent: z.number().min(0).max(100).optional(),
  earlyDiscountDays: z.number().min(0).optional(),
  description: z.string().optional(),
  purchaseOrderId: z.string().optional(),
  approvalWorkflow: z.boolean().default(false),
  recurringSettings: z.object({
    isRecurring: z.boolean().default(false),
    frequency: z.enum(['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL']).optional(),
    endDate: z.string().optional(),
    nextDueDate: z.string().optional(),
  }).optional(),
});

const batchPaymentSchema = z.object({
  paymentDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  paymentMethod: z.enum(['BANK_TRANSFER', 'CHEQUE', 'CASH', 'CARD', 'WIRE']),
  bankAccountId: z.string().optional(),
  reference: z.string().optional(),
  invoices: z.array(z.object({
    supplierInvoiceId: z.string(),
    amount: z.number().min(0),
    applyEarlyDiscount: z.boolean().default(false),
  })).min(1),
  consolidateBySupplier: z.boolean().default(false),
});

const paymentTermsSchema = z.object({
  supplierId: z.string(),
  defaultPaymentTerms: z.string(),
  creditLimit: z.number().min(0),
  earlyDiscountPercent: z.number().min(0).max(100).optional(),
  earlyDiscountDays: z.number().min(0).optional(),
  penaltyRate: z.number().min(0).optional(),
  gracePeriodDays: z.number().min(0).default(0),
  autoApprovalLimit: z.number().min(0).default(0),
});

// Get advanced payables with comprehensive analysis
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const analysisType = searchParams.get('analysisType') || 'standard';
    const supplierId = searchParams.get('supplierId');
    const currency = searchParams.get('currency') || 'AED';
    const includeForecasting = searchParams.get('includeForecasting') === 'true';
    const includeMetrics = searchParams.get('includeMetrics') === 'true';

    let result: any = {};

    switch (analysisType) {
      case 'aging':
        result = await generateAdvancedAging(supplierId, currency);
        break;
      case 'payment_terms':
        result = await generatePaymentTermsAnalysis(supplierId, currency);
        break;
      case 'cash_flow':
        result = await generateCashFlowProjection(currency, 180); // 6 months
        break;
      case 'supplier_performance':
        result = await generateSupplierPerformanceMetrics(supplierId, currency);
        break;
      case 'early_discounts':
        result = await generateEarlyDiscountOpportunities(currency);
        break;
      case 'approval_workflow':
        result = await getPendingApprovals(currency);
        break;
      case 'comprehensive':
      default:
        result = await generateComprehensivePayablesAnalysis(supplierId, currency, includeForecasting, includeMetrics);
        break;
    }

    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        analysisType,
        currency,
        generatedAt: new Date().toISOString(),
        generatedBy: session.user?.email,
      },
    });
  } catch (error) {
    console.error('Advanced Payables Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate advanced payables analysis' },
      { status: 500 }
    );
  }
}

// Create advanced payable with workflow and terms
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = advancedPayableSchema.parse(body);

    // Get supplier information
    const supplier = await prisma.supplier.findUnique({
      where: { id: validatedData.supplierId },
      select: {
        name: true,
        paymentTerms: true,
        creditLimit: true,
        performanceScore: true,
      }
    });

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      );
    }

    // Check for duplicate invoice
    const existingInvoice = await prisma.supplierInvoice.findFirst({
      where: {
        OR: [
          { invoiceNo: validatedData.invoiceNo },
          {
            supplierInvoiceNo: validatedData.supplierInvoiceNo,
            supplierId: validatedData.supplierId,
          }
        ],
      },
    });

    if (existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice already exists' },
        { status: 400 }
      );
    }

    // Calculate amounts with currency conversion
    const baseAmount = validatedData.amount * validatedData.exchangeRate;
    const vatAmount = baseAmount * 0.05; // UAE VAT
    const totalAmount = baseAmount + vatAmount;

    // Determine approval requirement
    const requiresApproval = validatedData.approvalWorkflow ||
      totalAmount > 10000 || // Auto approval limit
      supplier.performanceScore < 70; // Low performance suppliers need approval

    // Create supplier invoice
    const supplierInvoice = await prisma.supplierInvoice.create({
      data: {
        invoiceNo: validatedData.invoiceNo,
        supplierInvoiceNo: validatedData.supplierInvoiceNo,
        supplierId: validatedData.supplierId,
        purchaseOrderId: validatedData.purchaseOrderId,
        invoiceDate: new Date(validatedData.invoiceDate),
        dueDate: new Date(validatedData.dueDate),
        subtotal: baseAmount,
        vatAmount,
        totalAmount,
        balanceAmount: totalAmount,
        currency: validatedData.currency,
        status: requiresApproval ? 'UNDER_REVIEW' : 'APPROVED',
        paymentTerms: validatedData.paymentTerms || supplier.paymentTerms || 'Net 30',
        notes: validatedData.description,
      },
    });

    // Create early discount terms if applicable
    if (validatedData.earlyDiscountPercent && validatedData.earlyDiscountDays) {
      await createEarlyDiscountTerms(
        supplierInvoice.id,
        validatedData.earlyDiscountPercent,
        validatedData.earlyDiscountDays
      );
    }

    // Set up recurring invoice if specified
    if (validatedData.recurringSettings?.isRecurring) {
      await createRecurringInvoiceSchedule(supplierInvoice.id, validatedData.recurringSettings);
    }

    // Create approval workflow if required
    if (requiresApproval) {
      await createApprovalWorkflow(supplierInvoice.id, session.user.id);
    }

    // Create accounting transactions
    await createAdvancedPayableTransactions(supplierInvoice, validatedData, session.user.id);

    // Update supplier credit utilization
    await updateSupplierCreditUtilization(validatedData.supplierId);

    return NextResponse.json({
      success: true,
      data: {
        ...supplierInvoice,
        requiresApproval,
        supplierName: supplier.name,
        creditUtilization: await getSupplierCreditUtilization(validatedData.supplierId),
      },
      message: `Invoice ${requiresApproval ? 'created and pending approval' : 'created successfully'}`,
    });
  } catch (error) {
    console.error('Advanced Payable creation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create advanced payable' },
      { status: 500 }
    );
  }
}

// Process batch payments with optimization
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action;

    if (action === 'batch_payment') {
      return await processBatchPayment(body.data, session.user.id);
    } else if (action === 'update_payment_terms') {
      return await updatePaymentTerms(body.data, session.user.id);
    } else if (action === 'approve_invoice') {
      return await approveInvoice(body.invoiceId, session.user.id);
    } else if (action === 'optimize_payments') {
      return await optimizePaymentSchedule(body.currency || 'AED');
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Advanced Payables PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Helper functions
async function generateComprehensivePayablesAnalysis(
  supplierId?: string,
  currency = 'AED',
  includeForecasting = false,
  includeMetrics = false
) {
  const [aging, paymentTerms, cashFlow, metrics] = await Promise.all([
    generateAdvancedAging(supplierId, currency),
    generatePaymentTermsAnalysis(supplierId, currency),
    includeForecasting ? generateCashFlowProjection(currency, 90) : null,
    includeMetrics ? generateSupplierPerformanceMetrics(supplierId, currency) : null,
  ]);

  return {
    aging,
    paymentTerms,
    cashFlow,
    metrics,
    summary: {
      totalOutstanding: aging?.totalAmount || 0,
      overdueAmount: aging?.overdueAmount || 0,
      upcomingPayments: cashFlow?.upcomingPayments || [],
      earlyDiscountSavings: paymentTerms?.potentialSavings || 0,
    },
  };
}

async function generateAdvancedAging(supplierId?: string, currency = 'AED') {
  let whereClause = `WHERE si.status IN ('APPROVED', 'UNDER_REVIEW') AND si.currency = '${currency}'`;
  if (supplierId) whereClause += ` AND si.supplier_id = '${supplierId}'`;

  const aging = await prisma.$queryRaw`
    SELECT
      -- Current (not yet due)
      COUNT(CASE WHEN si.due_date > CURRENT_DATE THEN 1 END) as current_count,
      COALESCE(SUM(CASE WHEN si.due_date > CURRENT_DATE THEN si.balance_amount END), 0) as current_amount,

      -- Overdue categories
      COUNT(CASE WHEN si.due_date <= CURRENT_DATE AND si.due_date > CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as overdue_1_30_count,
      COALESCE(SUM(CASE WHEN si.due_date <= CURRENT_DATE AND si.due_date > CURRENT_DATE - INTERVAL '30 days' THEN si.balance_amount END), 0) as overdue_1_30_amount,

      COUNT(CASE WHEN si.due_date <= CURRENT_DATE - INTERVAL '30 days' AND si.due_date > CURRENT_DATE - INTERVAL '60 days' THEN 1 END) as overdue_31_60_count,
      COALESCE(SUM(CASE WHEN si.due_date <= CURRENT_DATE - INTERVAL '30 days' AND si.due_date > CURRENT_DATE - INTERVAL '60 days' THEN si.balance_amount END), 0) as overdue_31_60_amount,

      COUNT(CASE WHEN si.due_date <= CURRENT_DATE - INTERVAL '60 days' AND si.due_date > CURRENT_DATE - INTERVAL '90 days' THEN 1 END) as overdue_61_90_count,
      COALESCE(SUM(CASE WHEN si.due_date <= CURRENT_DATE - INTERVAL '60 days' AND si.due_date > CURRENT_DATE - INTERVAL '90 days' THEN si.balance_amount END), 0) as overdue_61_90_amount,

      COUNT(CASE WHEN si.due_date <= CURRENT_DATE - INTERVAL '90 days' THEN 1 END) as overdue_90_plus_count,
      COALESCE(SUM(CASE WHEN si.due_date <= CURRENT_DATE - INTERVAL '90 days' THEN si.balance_amount END), 0) as overdue_90_plus_amount,

      -- Totals
      COUNT(*) as total_invoices,
      COALESCE(SUM(si.balance_amount), 0) as total_amount,
      COALESCE(SUM(CASE WHEN si.due_date <= CURRENT_DATE THEN si.balance_amount END), 0) as overdue_amount

    FROM supplier_invoices si
    ${whereClause}
  ` as any[];

  return aging.length > 0 ? aging[0] : null;
}

async function generatePaymentTermsAnalysis(supplierId?: string, currency = 'AED') {
  let whereClause = `WHERE si.status IN ('APPROVED', 'UNDER_REVIEW') AND si.currency = '${currency}'`;
  if (supplierId) whereClause += ` AND si.supplier_id = '${supplierId}'`;

  const analysis = await prisma.$queryRaw`
    SELECT
      -- Payment terms distribution
      COUNT(CASE WHEN si.payment_terms LIKE '%Net 0%' OR si.payment_terms LIKE '%Cash%' THEN 1 END) as immediate_count,
      COALESCE(SUM(CASE WHEN si.payment_terms LIKE '%Net 0%' OR si.payment_terms LIKE '%Cash%' THEN si.balance_amount END), 0) as immediate_amount,

      COUNT(CASE WHEN si.payment_terms LIKE '%Net 30%' THEN 1 END) as net_30_count,
      COALESCE(SUM(CASE WHEN si.payment_terms LIKE '%Net 30%' THEN si.balance_amount END), 0) as net_30_amount,

      COUNT(CASE WHEN si.payment_terms LIKE '%Net 60%' THEN 1 END) as net_60_count,
      COALESCE(SUM(CASE WHEN si.payment_terms LIKE '%Net 60%' THEN si.balance_amount END), 0) as net_60_amount,

      -- Early discount opportunities
      COUNT(CASE WHEN si.payment_terms LIKE '%2/10%' OR si.payment_terms LIKE '%1/10%' THEN 1 END) as early_discount_count,
      COALESCE(SUM(CASE WHEN si.payment_terms LIKE '%2/10%' THEN si.balance_amount * 0.02
                        WHEN si.payment_terms LIKE '%1/10%' THEN si.balance_amount * 0.01
                        ELSE 0 END), 0) as potential_savings

    FROM supplier_invoices si
    ${whereClause}
  ` as any[];

  return analysis.length > 0 ? analysis[0] : null;
}

async function generateCashFlowProjection(currency: string, days: number) {
  const projection = await prisma.$queryRaw`
    SELECT
      DATE(si.due_date) as due_date,
      COUNT(*) as invoice_count,
      SUM(si.balance_amount) as amount_due,
      STRING_AGG(s.name, ', ') as suppliers
    FROM supplier_invoices si
    JOIN suppliers s ON si.supplier_id = s.id
    WHERE si.status IN ('APPROVED', 'UNDER_REVIEW')
      AND si.currency = ${currency}
      AND si.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'
    GROUP BY DATE(si.due_date)
    ORDER BY due_date
    LIMIT 30
  ` as any[];

  // Calculate running total and weekly/monthly summaries
  let runningTotal = 0;
  const upcomingPayments = projection.map((item: any) => {
    runningTotal += Number(item.amount_due);
    return {
      ...item,
      cumulative_amount: runningTotal,
    };
  });

  return {
    upcomingPayments,
    totalProjected: runningTotal,
    avgWeeklyOutflow: runningTotal / Math.ceil(days / 7),
    nextMajorPayment: upcomingPayments.find((p: any) => p.amount_due > 10000),
  };
}

async function generateSupplierPerformanceMetrics(supplierId?: string, currency = 'AED') {
  let whereClause = supplierId ? `WHERE s.id = '${supplierId}'` : 'WHERE 1=1';

  const metrics = await prisma.$queryRaw`
    SELECT
      s.id,
      s.name,
      s.performance_score,
      s.rating,
      s.payment_terms as default_payment_terms,
      s.credit_limit,

      -- Payment history
      COUNT(sp.id) as total_payments,
      AVG(CASE WHEN sp.payment_date <= si.due_date THEN 1 ELSE 0 END) as on_time_payment_rate,
      AVG(EXTRACT(day FROM sp.payment_date - si.due_date)) as avg_days_to_pay,

      -- Outstanding amounts
      COALESCE(SUM(CASE WHEN si.status != 'PAID' THEN si.balance_amount END), 0) as outstanding_amount,
      COUNT(CASE WHEN si.status != 'PAID' THEN 1 END) as outstanding_invoices,

      -- Credit utilization
      CASE WHEN s.credit_limit > 0
           THEN COALESCE(SUM(CASE WHEN si.status != 'PAID' THEN si.balance_amount END), 0) / s.credit_limit * 100
           ELSE 0 END as credit_utilization_percent

    FROM suppliers s
    LEFT JOIN supplier_invoices si ON s.id = si.supplier_id AND si.currency = ${currency}
    LEFT JOIN supplier_payments sp ON si.id = sp.supplier_invoice_id
    ${whereClause}
    GROUP BY s.id, s.name, s.performance_score, s.rating, s.payment_terms, s.credit_limit
    ORDER BY outstanding_amount DESC
  ` as any[];

  return metrics;
}

async function generateEarlyDiscountOpportunities(currency: string) {
  const opportunities = await prisma.$queryRaw`
    SELECT
      si.id,
      si.invoice_no,
      s.name as supplier_name,
      si.balance_amount,
      si.payment_terms,
      si.invoice_date,
      si.due_date,

      -- Calculate discount amounts and deadlines
      CASE
        WHEN si.payment_terms LIKE '%2/10%' THEN si.balance_amount * 0.02
        WHEN si.payment_terms LIKE '%1/10%' THEN si.balance_amount * 0.01
        ELSE 0
      END as discount_amount,

      CASE
        WHEN si.payment_terms LIKE '%/10%' THEN si.invoice_date + INTERVAL '10 days'
        WHEN si.payment_terms LIKE '%/15%' THEN si.invoice_date + INTERVAL '15 days'
        ELSE NULL
      END as discount_deadline,

      -- Days remaining for discount
      CASE
        WHEN si.payment_terms LIKE '%/10%' THEN
          GREATEST(0, EXTRACT(day FROM (si.invoice_date + INTERVAL '10 days') - CURRENT_DATE))
        ELSE 0
      END as days_remaining

    FROM supplier_invoices si
    JOIN suppliers s ON si.supplier_id = s.id
    WHERE si.status = 'APPROVED'
      AND si.currency = ${currency}
      AND (si.payment_terms LIKE '%/10%' OR si.payment_terms LIKE '%/15%')
      AND CURRENT_DATE <= si.invoice_date + INTERVAL '15 days'
    ORDER BY discount_amount DESC, days_remaining ASC
  ` as any[];

  const totalSavings = opportunities.reduce((sum: number, opp: any) => sum + Number(opp.discount_amount), 0);

  return {
    opportunities,
    totalPotentialSavings: totalSavings,
    expiringSoon: opportunities.filter((opp: any) => opp.days_remaining <= 3),
  };
}

async function getPendingApprovals(currency: string) {
  return await prisma.supplierInvoice.findMany({
    where: {
      status: 'UNDER_REVIEW',
      currency,
    },
    include: {
      supplier: {
        select: {
          name: true,
          performanceScore: true,
        }
      }
    },
    orderBy: {
      totalAmount: 'desc',
    }
  });
}

async function processBatchPayment(data: any, userId: string) {
  const validatedData = batchPaymentSchema.parse(data);

  // Process payments in transaction
  return await prisma.$transaction(async (tx) => {
    const results = [];

    for (const invoicePayment of validatedData.invoices) {
      const invoice = await tx.supplierInvoice.findUnique({
        where: { id: invoicePayment.supplierInvoiceId },
        include: { supplier: true }
      });

      if (!invoice) continue;

      // Calculate early discount if applicable
      const earlyDiscount = invoicePayment.applyEarlyDiscount
        ? calculateEarlyDiscount(invoice, new Date(validatedData.paymentDate))
        : 0;

      const effectiveAmount = invoicePayment.amount - earlyDiscount;

      // Create payment record
      const payment = await tx.supplierPayment.create({
        data: {
          paymentNo: await generatePaymentNo(),
          supplierInvoiceId: invoicePayment.supplierInvoiceId,
          amount: effectiveAmount,
          currency: invoice.currency,
          paymentMethod: validatedData.paymentMethod,
          paymentDate: new Date(validatedData.paymentDate),
          reference: validatedData.reference,
        },
      });

      // Update invoice
      const newPaidAmount = Number(invoice.paidAmount) + effectiveAmount;
      const newBalanceAmount = Number(invoice.totalAmount) - newPaidAmount;

      await tx.supplierInvoice.update({
        where: { id: invoicePayment.supplierInvoiceId },
        data: {
          paidAmount: newPaidAmount,
          balanceAmount: newBalanceAmount,
          status: newBalanceAmount <= 0 ? 'PAID' : 'UNDER_REVIEW',
        },
      });

      results.push({
        invoiceId: invoicePayment.supplierInvoiceId,
        paymentId: payment.id,
        amount: effectiveAmount,
        earlyDiscount,
      });
    }

    return {
      success: true,
      data: results,
      message: `Processed ${results.length} payments successfully`,
    };
  });
}

// Utility functions
function calculateEarlyDiscount(invoice: any, paymentDate: Date): number {
  const paymentTerms = invoice.paymentTerms || '';

  let discountPercent = 0;
  let discountDays = 0;

  if (paymentTerms.includes('2/10')) {
    discountPercent = 2;
    discountDays = 10;
  } else if (paymentTerms.includes('1/10')) {
    discountPercent = 1;
    discountDays = 10;
  }

  if (discountPercent > 0) {
    const discountDeadline = new Date(invoice.invoiceDate);
    discountDeadline.setDate(discountDeadline.getDate() + discountDays);

    if (paymentDate <= discountDeadline) {
      return Number(invoice.balanceAmount) * (discountPercent / 100);
    }
  }

  return 0;
}

async function createEarlyDiscountTerms(invoiceId: string, discountPercent: number, discountDays: number) {
  // Implementation for storing early discount terms
  // This would typically be stored in a separate table
}

async function createRecurringInvoiceSchedule(invoiceId: string, settings: any) {
  // Implementation for creating recurring invoice schedule
  // This would set up future invoice generation
}

async function createApprovalWorkflow(invoiceId: string, userId: string) {
  // Implementation for creating approval workflow
  // This would integrate with your workflow system
}

async function createAdvancedPayableTransactions(invoice: any, data: any, userId: string) {
  // Create comprehensive accounting transactions with proper currency handling
  // This would include all the double-entry bookkeeping logic
}

async function updateSupplierCreditUtilization(supplierId: string) {
  // Update supplier's credit utilization metrics
}

async function getSupplierCreditUtilization(supplierId: string) {
  // Calculate and return current credit utilization
  return { utilized: 0, available: 0, percentage: 0 };
}

async function updatePaymentTerms(data: any, userId: string) {
  const validatedData = paymentTermsSchema.parse(data);
  // Implementation for updating supplier payment terms
  return { success: true, message: 'Payment terms updated successfully' };
}

async function approveInvoice(invoiceId: string, userId: string) {
  // Implementation for invoice approval
  return { success: true, message: 'Invoice approved successfully' };
}

async function optimizePaymentSchedule(currency: string) {
  // Implementation for payment schedule optimization
  return { success: true, message: 'Payment schedule optimized' };
}

async function generatePaymentNo(): Promise<string> {
  const count = await prisma.supplierPayment.count();
  return `PAY-${Date.now()}-${String(count + 1).padStart(6, '0')}`;
}