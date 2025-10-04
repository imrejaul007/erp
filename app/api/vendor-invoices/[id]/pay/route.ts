import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const PaymentSchema = z.object({
  amount: z.number().positive('Payment amount must be positive'),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'CHECK', 'ONLINE']),
  paymentDate: z.string().datetime().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * POST /api/vendor-invoices/[id]/pay - Record payment for vendor invoice
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = PaymentSchema.parse(body);

    const invoice = await prisma.vendorInvoice.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!invoice) {
      return apiError('Vendor invoice not found', 404);
    }

    // Check if invoice is already paid
    if (invoice.status === 'PAID') {
      return apiError('Invoice is already fully paid', 400);
    }

    // Check if payment amount exceeds balance due
    if (validated.amount > invoice.balanceDue.toNumber()) {
      return apiError('Payment amount exceeds balance due', 400);
    }

    // Create payment record
    const payment = await prisma.vendorPayment.create({
      data: {
        invoiceId: id,
        amount: validated.amount,
        paymentMethod: validated.paymentMethod,
        paymentDate: validated.paymentDate ? new Date(validated.paymentDate) : new Date(),
        reference: validated.reference,
        notes: validated.notes,
        tenantId,
        createdById: user?.id || 'system',
      },
    });

    // Update invoice
    const newPaidAmount = invoice.paidAmount.toNumber() + validated.amount;
    const newBalanceDue = invoice.totalAmount.toNumber() - newPaidAmount;
    const newStatus = newBalanceDue <= 0.01 ? 'PAID' : 'PARTIAL';

    const updatedInvoice = await prisma.vendorInvoice.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        balanceDue: newBalanceDue,
        status: newStatus,
        paidDate: newStatus === 'PAID' ? new Date() : null,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: true,
      },
    });

    return apiResponse({
      message: 'Payment recorded successfully',
      invoice: updatedInvoice,
      payment,
    });
  } catch (error: any) {
    console.error('Error recording vendor payment:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to record payment', 500);
  }
});
