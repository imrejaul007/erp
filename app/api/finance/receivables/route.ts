import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Get receivables aging report
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const asOfDate = searchParams.get('asOfDate') || new Date().toISOString().split('T')[0];
    const currency = searchParams.get('currency') || 'AED';
    const customerId = searchParams.get('customerId');

    const agingReport = await generateReceivablesAging(asOfDate, currency, customerId);

    return NextResponse.json({
      success: true,
      data: agingReport,
    });
  } catch (error) {
    console.error('Receivables GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch receivables' },
      { status: 500 }
    );
  }
}

// Record payment against receivable
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { saleId, amount, paymentMethod, paymentDate, reference, notes } = body;

    if (!saleId || !amount || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Sale ID, amount, and payment method are required' },
        { status: 400 }
      );
    }

    const paymentNo = await generatePaymentNumber();
    const paymentId = generateId();

    await prisma.$transaction(async (tx) => {
      // Create payment record
      await tx.payment.create({
        data: {
          id: paymentId,
          paymentNo,
          saleId,
          amount,
          currency: 'AED',
          method: paymentMethod,
          status: 'PAID',
          paymentDate: new Date(paymentDate || new Date()),
          reference: reference || null,
          notes: notes || null,
        },
      });

      // Update sale payment status
      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        include: { payments: true },
      });

      if (sale) {
        const totalPaid = sale.payments.reduce((sum, p) => sum + Number(p.amount), 0) + amount;
        let paymentStatus = 'PARTIAL';

        if (totalPaid >= Number(sale.totalAmount)) {
          paymentStatus = 'PAID';
        }

        await tx.sale.update({
          where: { id: saleId },
          data: { paymentStatus: paymentStatus as any },
        });
      }

      // Create accounting transactions
      // Debit Cash/Bank
      await tx.transaction.create({
        data: {
          transactionNo: await generateTransactionNumber(),
          type: 'DEBIT',
          accountId: paymentMethod === 'CASH'
            ? await getAccountId('1110') // Cash in Hand
            : await getAccountId('1120'), // Bank Account
          amount,
          currency: 'AED',
          description: `Payment received - ${paymentNo}`,
          referenceType: 'payment',
          referenceId: paymentId,
          transactionDate: new Date(paymentDate || new Date()),
          status: 'COMPLETED',
          createdById: session.user.id,
        },
      });

      // Credit Accounts Receivable
      await tx.transaction.create({
        data: {
          transactionNo: await generateTransactionNumber(),
          type: 'CREDIT',
          accountId: await getAccountId('1130'), // Accounts Receivable
          amount,
          currency: 'AED',
          description: `Payment received - ${paymentNo}`,
          referenceType: 'payment',
          referenceId: paymentId,
          transactionDate: new Date(paymentDate || new Date()),
          status: 'COMPLETED',
          createdById: session.user.id,
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: { id: paymentId, paymentNo },
      message: 'Payment recorded successfully',
    });
  } catch (error) {
    console.error('Payment POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}

// Generate receivables aging report
async function generateReceivablesAging(asOfDate: string, currency: string, customerId?: string) {
  const cutoffDate = new Date(asOfDate);

  let customerFilter = '';
  if (customerId) {
    customerFilter = `AND s.customer_id = '${customerId}'`;
  }

  // Get all outstanding sales
  const outstandingSales = await prisma.$queryRaw`
    SELECT
      s.id,
      s.sale_no,
      s.customer_id,
      c.customer_no,
      COALESCE(c.first_name || ' ' || c.last_name, c.company_name) as customer_name,
      s.sale_date,
      s.due_date,
      s.total_amount,
      COALESCE(SUM(p.amount), 0) as paid_amount,
      (s.total_amount - COALESCE(SUM(p.amount), 0)) as outstanding_amount,
      (${cutoffDate}::date - s.due_date::date) as days_overdue
    FROM sales s
    LEFT JOIN customers c ON s.customer_id = c.id
    LEFT JOIN payments p ON s.id = p.sale_id AND p.status = 'PAID'
    WHERE s.payment_status IN ('PENDING', 'PARTIAL')
      AND s.status = 'COMPLETED'
      AND s.currency = ${currency}
      ${customerFilter}
    GROUP BY s.id, c.customer_no, c.first_name, c.last_name, c.company_name
    HAVING (s.total_amount - COALESCE(SUM(p.amount), 0)) > 0.01
    ORDER BY s.due_date
  ` as any[];

  // Categorize by aging buckets
  const agingBuckets = {
    current: 0,
    days30: 0,
    days60: 0,
    days90: 0,
    days90Plus: 0,
  };

  const items = outstandingSales.map((sale: any) => {
    const outstandingAmount = Number(sale.outstanding_amount);
    const daysOverdue = parseInt(sale.days_overdue) || 0;

    // Categorize into aging buckets
    let current = 0, days30 = 0, days60 = 0, days90 = 0, days90Plus = 0;

    if (daysOverdue <= 0) {
      current = outstandingAmount;
      agingBuckets.current += outstandingAmount;
    } else if (daysOverdue <= 30) {
      days30 = outstandingAmount;
      agingBuckets.days30 += outstandingAmount;
    } else if (daysOverdue <= 60) {
      days60 = outstandingAmount;
      agingBuckets.days60 += outstandingAmount;
    } else if (daysOverdue <= 90) {
      days90 = outstandingAmount;
      agingBuckets.days90 += outstandingAmount;
    } else {
      days90Plus = outstandingAmount;
      agingBuckets.days90Plus += outstandingAmount;
    }

    return {
      id: sale.id,
      saleNo: sale.sale_no,
      customerId: sale.customer_id,
      customerNo: sale.customer_no,
      customerName: sale.customer_name,
      saleDate: sale.sale_date,
      dueDate: sale.due_date,
      totalAmount: Number(sale.total_amount),
      paidAmount: Number(sale.paid_amount),
      outstandingAmount,
      daysOverdue: Math.max(0, daysOverdue),
      current,
      days30,
      days60,
      days90,
      days90Plus,
    };
  });

  const totalAmount = agingBuckets.current + agingBuckets.days30 + agingBuckets.days60 + agingBuckets.days90 + agingBuckets.days90Plus;

  return {
    asOfDate,
    currency,
    summary: {
      totalAmount,
      current: agingBuckets.current,
      days30: agingBuckets.days30,
      days60: agingBuckets.days60,
      days90: agingBuckets.days90,
      days90Plus: agingBuckets.days90Plus,
      overdueAmount: agingBuckets.days30 + agingBuckets.days60 + agingBuckets.days90 + agingBuckets.days90Plus,
    },
    items,
    generatedAt: new Date().toISOString(),
  };
}

// Helper functions
async function generatePaymentNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.payment.count({
    where: { paymentNo: { startsWith: `PAY-${year}-` } },
  });

  const nextNumber = (count + 1).toString().padStart(6, '0');
  return `PAY-${year}-${nextNumber}`;
}

async function generateTransactionNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.transaction.count({
    where: { transactionNo: { startsWith: `TXN-${year}-` } },
  });

  const nextNumber = (count + 1).toString().padStart(6, '0');
  return `TXN-${year}-${nextNumber}`;
}

async function getAccountId(accountCode: string): Promise<string> {
  const account = await prisma.account.findFirst({
    where: { code: accountCode, isActive: true },
    select: { id: true },
  });

  if (!account) {
    throw new Error(`Account with code ${accountCode} not found`);
  }

  return account.id;
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}