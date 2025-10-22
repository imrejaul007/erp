import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const InstallmentPlanSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  planName: z.string().min(1, 'Plan name is required'),
  numberOfInstallments: z.number().int().min(2, 'Must have at least 2 installments').max(24, 'Maximum 24 installments'),
  frequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY'], {
    errorMap: () => ({ message: 'Frequency must be WEEKLY, BIWEEKLY, or MONTHLY' }),
  }),
  startDate: z.string().datetime(),
  processingFee: z.number().nonnegative().default(0),
  interestRate: z.number().nonnegative().optional().nullable(),
  autoPayEnabled: z.boolean().default(false),
  paymentMethod: z.string().optional().nullable(),
});

const InstallmentPlanQuerySchema = z.object({
  invoiceId: z.string().optional(),
  customerId: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'DEFAULTED']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
});

/**
 * GET /api/installment-plans
 * List installment plans with optional filters
 */
export const GET = withTenant(async (
  req: NextRequest,
  { tenantId }: { tenantId: string }
) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = InstallmentPlanQuerySchema.parse({
      invoiceId: searchParams.get('invoiceId'),
      customerId: searchParams.get('customerId'),
      status: searchParams.get('status'),
      isActive: searchParams.get('isActive'),
    });

    const whereClause: any = { tenantId };

    if (query.invoiceId) {
      whereClause.invoiceId = query.invoiceId;
    }

    if (query.customerId) {
      whereClause.customerId = query.customerId;
    }

    if (query.status) {
      whereClause.status = query.status;
    }

    if (query.isActive) {
      whereClause.isActive = query.isActive === 'true';
    }

    const plans = await prisma.installmentPlan.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            currency: true,
            status: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        installments: {
          orderBy: {
            installmentNumber: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return apiResponse({ plans, total: plans.length });
  } catch (error: any) {
    console.error('Error fetching installment plans:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to fetch installment plans', 500);
  }
});

/**
 * POST /api/installment-plans
 * Create a new installment plan for an invoice
 */
export const POST = withTenant(async (
  req: NextRequest,
  { tenantId, userId }: { tenantId: string; userId: string }
) => {
  try {
    const body = await req.json();
    const validated = InstallmentPlanSchema.parse(body);

    // Verify invoice exists and belongs to tenant
    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id: validated.invoiceId,
        tenantId,
      },
    });

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    // Check if invoice already has an installment plan
    const existingPlan = await prisma.installmentPlan.findFirst({
      where: {
        invoiceId: validated.invoiceId,
        tenantId,
      },
    });

    if (existingPlan) {
      return apiError('Invoice already has an installment plan', 400);
    }

    // Verify customer exists and belongs to tenant
    const customer = await prisma.customers.findFirst({
      where: {
        id: validated.customerId,
        tenantId,
      },
    });

    if (!customer) {
      return apiError('Customer not found', 404);
    }

    // Check invoice status
    if (invoice.status === 'PAID') {
      return apiError('Cannot create installment plan for a paid invoice', 400);
    }

    if (invoice.status === 'CANCELLED') {
      return apiError('Cannot create installment plan for a cancelled invoice', 400);
    }

    // Calculate plan details
    const totalAmount = Number(invoice.balanceDue) + validated.processingFee;
    const baseInstallmentAmount = totalAmount / validated.numberOfInstallments;

    // Apply interest if specified
    let installmentAmount = baseInstallmentAmount;
    if (validated.interestRate && validated.interestRate > 0) {
      const monthlyRate = validated.interestRate / 100 / 12;
      const months = validated.frequency === 'WEEKLY'
        ? validated.numberOfInstallments / 4
        : validated.frequency === 'BIWEEKLY'
        ? validated.numberOfInstallments / 2
        : validated.numberOfInstallments;

      // Simple interest calculation
      const interestAmount = totalAmount * monthlyRate * months;
      installmentAmount = (totalAmount + interestAmount) / validated.numberOfInstallments;
    }

    const startDate = new Date(validated.startDate);

    // Calculate end date based on frequency
    const endDate = new Date(startDate);
    switch (validated.frequency) {
      case 'WEEKLY':
        endDate.setDate(endDate.getDate() + (validated.numberOfInstallments * 7));
        break;
      case 'BIWEEKLY':
        endDate.setDate(endDate.getDate() + (validated.numberOfInstallments * 14));
        break;
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + validated.numberOfInstallments);
        break;
    }

    // Create installment plan
    const plan = await prisma.installmentPlan.create({
      data: {
        invoiceId: validated.invoiceId,
        customerId: validated.customerId,
        planName: validated.planName,
        numberOfInstallments: validated.numberOfInstallments,
        frequency: validated.frequency,
        totalAmount,
        installmentAmount,
        processingFee: validated.processingFee,
        interestRate: validated.interestRate,
        startDate,
        endDate,
        remainingBalance: totalAmount,
        autoPayEnabled: validated.autoPayEnabled,
        paymentMethod: validated.paymentMethod,
        tenantId,
        createdById: userId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            currency: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create individual installments
    const installments = [];
    let currentDueDate = new Date(startDate);

    for (let i = 1; i <= validated.numberOfInstallments; i++) {
      const installment = await prisma.installment.create({
        data: {
          planId: plan.id,
          installmentNumber: i,
          dueDate: new Date(currentDueDate),
          amount: installmentAmount,
          tenantId,
        },
      });

      installments.push(installment);

      // Calculate next due date
      switch (validated.frequency) {
        case 'WEEKLY':
          currentDueDate.setDate(currentDueDate.getDate() + 7);
          break;
        case 'BIWEEKLY':
          currentDueDate.setDate(currentDueDate.getDate() + 14);
          break;
        case 'MONTHLY':
          currentDueDate.setMonth(currentDueDate.getMonth() + 1);
          break;
      }
    }

    // Update invoice status
    await prisma.customerInvoice.update({
      where: { id: invoice.id },
      data: {
        status: 'INSTALLMENT_PLAN',
        updatedAt: new Date(),
      },
    });

    return apiResponse(
      {
        message: 'Installment plan created successfully',
        plan: {
          ...plan,
          installments,
        },
      },
      201
    );
  } catch (error: any) {
    console.error('Error creating installment plan:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create installment plan', 500);
  }
});
