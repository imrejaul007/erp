import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import { convertCurrency } from '@/lib/currency-converter';

// Payment validation schema
const PaymentSchema = z.object({
  amount: z.number().min(0.01, 'Payment amount must be positive'),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'CHEQUE']),
  reference: z.string().optional(),
  notes: z.string().optional(),
  currency: z.string().length(3).optional(), // Currency code if different from invoice
  transactionId: z.string().optional(),
  paymentDate: z.string().datetime().optional(),
  applyToLateFees: z.boolean().default(false), // Apply to late fees first
});

// POST /api/invoices/[id]/payment - Record payment against invoice
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, userId }: { params: { id: string }; tenantId: string; userId: string }
) => {
  try {
    const { id: invoiceId } = params;
    const body = await req.json();
    const validated = PaymentSchema.parse(body);

    // Get invoice
    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
      },
    });

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    // Check if invoice is already paid
    if (invoice.status === 'PAID') {
      return apiError('Invoice is already paid in full', 400);
    }

    // Handle currency conversion if payment is in different currency
    let paymentAmount = validated.amount;
    let exchangeRate = 1;
    const paymentCurrency = validated.currency || invoice.currency;

    if (paymentCurrency !== invoice.currency) {
      const conversion = await convertCurrency(
        validated.amount,
        paymentCurrency,
        invoice.currency,
        tenantId
      );
      paymentAmount = conversion.convertedAmount;
      exchangeRate = conversion.exchangeRate;
    }

    // Get any pending late fees
    const pendingLateFees = await prisma.lateFeeCharge.findMany({
      where: {
        invoiceId,
        tenantId,
        status: { in: ['PENDING', 'APPLIED'] },
      },
    });

    const totalLateFees = pendingLateFees.reduce(
      (sum, fee) => sum + Number(fee.feeAmount),
      0
    );

    // Check if payment amount exceeds balance due
    if (paymentAmount > Number(invoice.balanceDue)) {
      return apiError(
        `Payment amount (${paymentAmount.toFixed(2)} ${invoice.currency}) exceeds balance due (${Number(invoice.balanceDue).toFixed(2)} ${invoice.currency})`,
        400
      );
    }

    // Allocate payment
    let remainingPayment = paymentAmount;
    let lateFeesPaid = 0;

    // Apply to late fees first if requested
    if (validated.applyToLateFees && totalLateFees > 0) {
      lateFeesPaid = Math.min(remainingPayment, totalLateFees);
      remainingPayment -= lateFeesPaid;
    }

    // Calculate new amounts
    const newPaidAmount = Number(invoice.paidAmount) + paymentAmount;
    const newBalanceDue = Number(invoice.totalAmount) - newPaidAmount;

    // Determine new status
    let newStatus = invoice.status;
    let paidDate = invoice.paidAt;

    if (newBalanceDue <= 0) {
      newStatus = 'PAID';
      paidDate = new Date();
    } else if (newPaidAmount > 0) {
      newStatus = 'PARTIALLY_PAID';
    }

    // Create payment and update invoice in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create payment record
      const paymentData: any = {
        invoiceId,
        amount: validated.amount,
        paymentMethod: validated.paymentMethod,
        reference: validated.reference,
        notes: validated.notes,
        tenantId,
        createdById: userId,
      };

      // Add optional fields if provided
      if (validated.transactionId) {
        paymentData.transactionId = validated.transactionId;
      }

      if (validated.paymentDate) {
        paymentData.paymentDate = new Date(validated.paymentDate);
      }

      // Add currency conversion info if applicable
      if (paymentCurrency !== invoice.currency) {
        const conversionNote = `Payment received in ${paymentCurrency} ${validated.amount.toFixed(2)} at rate ${exchangeRate.toFixed(4)}. Converted to ${invoice.currency} ${paymentAmount.toFixed(2)}`;
        paymentData.notes = paymentData.notes
          ? `${paymentData.notes}\n\n${conversionNote}`
          : conversionNote;
      }

      // Add late fee allocation info if applicable
      if (lateFeesPaid > 0) {
        const lateFeeNote = `${lateFeesPaid.toFixed(2)} ${invoice.currency} applied to late fees`;
        paymentData.notes = paymentData.notes
          ? `${paymentData.notes}\n${lateFeeNote}`
          : lateFeeNote;
      }

      const payment = await tx.invoicePayment.create({
        data: paymentData,
      });

      // Waive late fees if they were paid
      if (lateFeesPaid > 0) {
        let remainingLateFeePayment = lateFeesPaid;
        for (const lateFee of pendingLateFees) {
          if (remainingLateFeePayment <= 0) break;

          const feeAmount = Number(lateFee.feeAmount);
          const amountToApply = Math.min(remainingLateFeePayment, feeAmount);

          await tx.lateFeeCharge.update({
            where: { id: lateFee.id },
            data: {
              status: 'WAIVED',
              waivedAt: new Date(),
              waivedBy: userId,
              waivedReason: `Paid via payment ${payment.id}`,
              updatedAt: new Date(),
            },
          });

          remainingLateFeePayment -= amountToApply;
        }
      }

      // Update invoice
      const updatedInvoice = await tx.customerInvoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaidAmount,
          balanceDue: newBalanceDue,
          status: newStatus,
          paidAt: paidDate,
          updatedAt: new Date(),
        },
        include: {
          customer: true,
          order: true,
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          payments: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      return { payment, invoice: updatedInvoice };
    });

    return apiResponse({
      message: 'Payment recorded successfully',
      payment: result.payment,
      invoice: result.invoice,
      paymentAllocation: {
        totalPaid: paymentAmount,
        currency: invoice.currency,
        originalAmount: validated.amount,
        originalCurrency: paymentCurrency,
        exchangeRate: paymentCurrency !== invoice.currency ? exchangeRate : undefined,
        lateFeesPaid,
        invoicePrincipalPaid: paymentAmount - lateFeesPaid,
      },
    });
  } catch (error: any) {
    console.error('Error recording payment:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to record payment', 500);
  }
});

// GET /api/invoices/[id]/payment - Get payment history for invoice
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: invoiceId } = params;

    // Verify invoice exists and belongs to tenant
    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
      },
    });

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    // Get all payments for this invoice
    const payments = await prisma.invoicePayment.findMany({
      where: {
        invoiceId,
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return apiResponse(payments);
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return apiError(error.message || 'Failed to fetch payments', 500);
  }
});
