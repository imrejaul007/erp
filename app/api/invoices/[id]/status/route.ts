import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const StatusUpdateSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'VIEWED', 'OVERDUE', 'CANCELLED']),
});

// PATCH /api/invoices/[id]/status - Update invoice status
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: invoiceId } = params;
    const body = await req.json();
    const validated = StatusUpdateSchema.parse(body);

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

    // Validation rules for status transitions
    if (invoice.status === 'PAID' && validated.status !== 'REFUNDED') {
      return apiError('Cannot change status of a paid invoice (except to REFUNDED)', 400);
    }

    if (invoice.status === 'CANCELLED') {
      return apiError('Cannot change status of a cancelled invoice', 400);
    }

    // Update invoice with appropriate timestamp
    const updateData: any = {
      status: validated.status,
      updatedAt: new Date(),
    };

    if (validated.status === 'SENT' && !invoice.sentAt) {
      updateData.sentAt = new Date();
    }

    if (validated.status === 'VIEWED' && !invoice.viewedAt) {
      updateData.viewedAt = new Date();
    }

    const updatedInvoice = await prisma.customerInvoice.update({
      where: { id: invoiceId },
      data: updateData,
      include: {
        customer: true,
        order: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        payments: true,
      },
    });

    return apiResponse({
      message: 'Invoice status updated successfully',
      invoice: updatedInvoice,
    });
  } catch (error: any) {
    console.error('Error updating invoice status:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update invoice status', 500);
  }
});
