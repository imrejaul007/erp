import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const PayInstallmentSchema = z.object({
  installmentId: z.string().min(1, 'Installment ID is required'),
  amount: z.number().positive('Payment amount must be positive'),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'CHECK', 'OTHER']),
  transactionId: z.string().optional().nullable(),
  paymentReference: z.string().optional().nullable(),
  paymentDate: z.string().datetime().optional(),
});

/**
 * POST /api/installment-plans/[id]/pay
 * Record a payment for an installment
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: planId } = params;
    const body = await req.json();
    const validated = PayInstallmentSchema.parse(body);

    // Verify plan exists and is active
    const plan = await prisma.installmentPlan.findFirst({
      where: {
        id: planId,
        tenantId,
      },
      include: {
        invoice: true,
        installments: {
          orderBy: {
            installmentNumber: 'asc',
          },
        },
      },
    });

    if (!plan) {
      return apiError('Installment plan not found', 404);
    }

    if (!plan.isActive) {
      return apiError('Installment plan is not active', 400);
    }

    if (plan.status === 'CANCELLED') {
      return apiError('Cannot pay a cancelled installment plan', 400);
    }

    if (plan.status === 'COMPLETED') {
      return apiError('Installment plan is already completed', 400);
    }

    // Verify installment exists and belongs to this plan
    const installment = await prisma.installment.findFirst({
      where: {
        id: validated.installmentId,
        planId: plan.id,
        tenantId,
      },
    });

    if (!installment) {
      return apiError('Installment not found', 404);
    }

    // Check if already paid
    if (installment.status === 'PAID') {
      return apiError('Installment has already been paid', 400);
    }

    // Validate payment amount
    const installmentAmount = Number(installment.amount);
    if (validated.amount < installmentAmount) {
      return apiError(
        `Payment amount (${validated.amount}) is less than installment amount (${installmentAmount})`,
        400
      );
    }

    const paymentDate = validated.paymentDate
      ? new Date(validated.paymentDate)
      : new Date();

    // Calculate days overdue
    const daysOverdue = Math.max(
      0,
      Math.floor(
        (paymentDate.getTime() - installment.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    // Update installment
    const updatedInstallment = await prisma.installment.update({
      where: { id: installment.id },
      data: {
        status: 'PAID',
        paidDate: paymentDate,
        paidAmount: validated.amount,
        paymentMethod: validated.paymentMethod,
        transactionId: validated.transactionId,
        paymentReference: validated.paymentReference,
        daysOverdue,
        updatedAt: new Date(),
      },
    });

    // Update plan totals
    const newTotalPaid = Number(plan.totalPaid) + validated.amount;
    const newPaidInstallments = plan.paidInstallments + 1;
    const newRemainingBalance = Number(plan.totalAmount) - newTotalPaid;

    // Determine new plan status
    let newPlanStatus = plan.status;
    if (newPaidInstallments === plan.numberOfInstallments) {
      newPlanStatus = 'COMPLETED';
    }

    await prisma.installmentPlan.update({
      where: { id: plan.id },
      data: {
        totalPaid: newTotalPaid,
        paidInstallments: newPaidInstallments,
        remainingBalance: newRemainingBalance,
        status: newPlanStatus,
        updatedAt: new Date(),
      },
    });

    // Create payment record for the invoice
    const payment = await prisma.payment.create({
      data: {
        invoiceId: plan.invoiceId,
        amount: validated.amount,
        currency: plan.invoice.currency,
        paymentMethod: validated.paymentMethod,
        paymentDate,
        transactionId: validated.transactionId,
        reference: validated.paymentReference,
        notes: `Installment payment ${installment.installmentNumber} of ${plan.numberOfInstallments}`,
        status: 'COMPLETED',
        tenantId,
      },
    });

    // Update invoice paid amount and status
    const newInvoicePaidAmount = Number(plan.invoice.paidAmount) + validated.amount;
    const newInvoiceBalanceDue = Number(plan.invoice.totalAmount) - newInvoicePaidAmount;

    let invoiceStatus = plan.invoice.status;
    if (newPlanStatus === 'COMPLETED' && newInvoiceBalanceDue <= 0) {
      invoiceStatus = 'PAID';
    } else if (newInvoicePaidAmount > 0) {
      invoiceStatus = 'PARTIALLY_PAID';
    }

    await prisma.customerInvoice.update({
      where: { id: plan.invoiceId },
      data: {
        paidAmount: newInvoicePaidAmount,
        balanceDue: newInvoiceBalanceDue,
        status: invoiceStatus,
        paidAt: invoiceStatus === 'PAID' ? new Date() : plan.invoice.paidAt,
        updatedAt: new Date(),
      },
    });

    return apiResponse({
      message: 'Installment payment recorded successfully',
      installment: updatedInstallment,
      payment,
      plan: {
        id: plan.id,
        totalPaid: newTotalPaid,
        paidInstallments: newPaidInstallments,
        remainingBalance: newRemainingBalance,
        status: newPlanStatus,
      },
    });
  } catch (error: any) {
    console.error('Error processing installment payment:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to process installment payment', 500);
  }
});
