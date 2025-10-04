import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const CreditNoteSchema = z.object({
  amount: z.number().positive('Credit amount must be positive'),
  reason: z.string().min(1, 'Reason is required'),
  lineItems: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    amount: z.number().nonnegative(),
  })).optional(),
  refundMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'CREDIT_BALANCE']).default('CREDIT_BALANCE'),
  refundReference: z.string().optional(),
});

/**
 * POST /api/invoices/[id]/credit-note
 * Issue a credit note / refund against an invoice
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, userId }: { params: { id: string }; tenantId: string; userId: string }
) => {
  try {
    const { id: invoiceId } = params;
    const body = await req.json();
    const validated = CreditNoteSchema.parse(body);

    // Get original invoice
    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
      },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    // Validate credit amount
    const paidAmount = Number(invoice.paidAmount);
    if (validated.amount > paidAmount) {
      return apiError(
        `Credit amount (${validated.amount}) cannot exceed paid amount (${paidAmount})`,
        400
      );
    }

    // Generate credit note number
    const lastCreditNote = await prisma.customerInvoice.findFirst({
      where: {
        tenantId,
        invoiceType: 'CREDIT_NOTE',
      },
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true },
    });

    let creditNoteNumber = 'CN-0001';
    if (lastCreditNote) {
      const lastNumber = parseInt(lastCreditNote.invoiceNumber.split('-')[1]);
      creditNoteNumber = `CN-${String(lastNumber + 1).padStart(4, '0')}`;
    }

    // Create credit note (as a negative invoice)
    const creditNote = await prisma.customerInvoice.create({
      data: {
        invoiceNumber: creditNoteNumber,
        customerId: invoice.customerId,
        invoiceType: 'CREDIT_NOTE',
        status: 'PAID', // Credit notes are considered "paid" immediately
        issueDate: new Date(),
        dueDate: new Date(),
        paymentTerms: 'Credit Note',
        lineItems: validated.lineItems || [
          {
            description: `Credit note for invoice ${invoice.invoiceNumber} - ${validated.reason}`,
            quantity: 1,
            unitPrice: validated.amount,
            amount: validated.amount,
          },
        ],
        subtotal: validated.amount,
        taxAmount: 0,
        discount: 0,
        totalAmount: validated.amount,
        balanceDue: 0,
        paidAmount: validated.amount,
        paidAt: new Date(),
        currency: invoice.currency,
        notes: `Credit note for invoice ${invoice.invoiceNumber}\nReason: ${validated.reason}\nRefund method: ${validated.refundMethod}${validated.refundReference ? `\nReference: ${validated.refundReference}` : ''}`,
        relatedInvoiceId: invoice.id,
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
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create payment record for the credit
    await prisma.invoicePayment.create({
      data: {
        invoiceId: creditNote.id,
        amount: validated.amount,
        paymentMethod: validated.refundMethod,
        reference: validated.refundReference,
        notes: `Credit note refund - ${validated.reason}`,
        tenantId,
        createdById: userId,
      },
    });

    // Update original invoice
    const newPaidAmount = Number(invoice.paidAmount) - validated.amount;
    const newBalanceDue = Number(invoice.totalAmount) - newPaidAmount;

    let newStatus = invoice.status;
    if (newBalanceDue > 0 && newPaidAmount > 0) {
      newStatus = 'PARTIALLY_PAID';
    } else if (newBalanceDue > 0 && newPaidAmount === 0) {
      newStatus = 'SENT';
    }

    const updatedInvoice = await prisma.customerInvoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount: newPaidAmount,
        balanceDue: newBalanceDue,
        status: newStatus,
        paidAt: newPaidAmount === 0 ? null : invoice.paidAt,
        notes: `${invoice.notes || ''}\n\nCredit note ${creditNoteNumber} issued: ${validated.amount} ${invoice.currency}`.trim(),
        updatedAt: new Date(),
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
        payments: true,
      },
    });

    // If refund method is CREDIT_BALANCE, add to customer credit
    if (validated.refundMethod === 'CREDIT_BALANCE') {
      const customerCredit = await prisma.customerCredit.findUnique({
        where: { customerId: invoice.customerId },
      });

      if (customerCredit) {
        await prisma.customerCredit.update({
          where: { customerId: invoice.customerId },
          data: {
            creditAvailable: Number(customerCredit.creditAvailable) + validated.amount,
            updatedAt: new Date(),
          },
        });
      }
    }

    return apiResponse({
      message: 'Credit note issued successfully',
      creditNote,
      originalInvoice: updatedInvoice,
      refundMethod: validated.refundMethod,
      refundAmount: validated.amount,
    }, 201);
  } catch (error: any) {
    console.error('Error issuing credit note:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to issue credit note', 500);
  }
});
