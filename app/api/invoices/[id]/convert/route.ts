import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

// POST /api/invoices/[id]/convert - Convert proforma to standard invoice
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, userId }: { params: { id: string }; tenantId: string; userId: string }
) => {
  try {
    const { id: proformaId } = params;

    // Get the proforma invoice
    const proforma = await prisma.customerInvoice.findFirst({
      where: {
        id: proformaId,
        tenantId,
      },
    });

    if (!proforma) {
      return apiError('Proforma invoice not found', 404);
    }

    if (proforma.invoiceType !== 'PROFORMA') {
      return apiError('Invoice is not a proforma invoice', 400);
    }

    if (proforma.convertedToInvoiceId) {
      return apiError('Proforma invoice has already been converted', 400);
    }

    // Generate new invoice number
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const lastInvoice = await prisma.customerInvoice.findFirst({
      where: {
        tenantId,
        invoiceNumber: {
          startsWith: `INV-${year}-${month}-`,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[3]);
      sequence = lastSequence + 1;
    }

    const invoiceNumber = `INV-${year}-${month}-${String(sequence).padStart(5, '0')}`;

    // Create standard invoice from proforma
    const standardInvoice = await prisma.customerInvoice.create({
      data: {
        invoiceNumber,
        customerId: proforma.customerId,
        orderId: proforma.orderId || undefined,
        invoiceType: 'STANDARD',
        subtotal: proforma.subtotal,
        taxAmount: proforma.taxAmount,
        discount: proforma.discount,
        totalAmount: proforma.totalAmount,
        balanceDue: proforma.totalAmount, // Start with full balance
        status: 'DRAFT',
        dueDate: proforma.dueDate,
        paymentTerms: proforma.paymentTerms,
        lineItems: proforma.lineItems,
        notes: proforma.notes || undefined,
        terms: proforma.terms || undefined,
        currency: proforma.currency,
        tenantId,
        createdById: userId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update proforma to mark it as converted
    await prisma.customerInvoice.update({
      where: { id: proformaId },
      data: {
        convertedToInvoiceId: standardInvoice.id,
        status: 'CANCELLED', // Mark proforma as cancelled
        updatedAt: new Date(),
      },
    });

    return apiResponse({
      message: 'Proforma invoice converted to standard invoice successfully',
      invoice: standardInvoice,
      proformaId,
    }, 201);
  } catch (error: any) {
    console.error('Error converting proforma invoice:', error);
    return apiError(error.message || 'Failed to convert proforma invoice', 500);
  }
});
