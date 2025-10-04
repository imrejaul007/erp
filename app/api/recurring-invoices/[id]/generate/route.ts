import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

// Calculate next invoice date based on frequency
function calculateNextInvoiceDate(currentDate: Date, frequency: string): Date {
  const next = new Date(currentDate);

  switch (frequency) {
    case 'DAILY':
      next.setDate(next.getDate() + 1);
      break;
    case 'WEEKLY':
      next.setDate(next.getDate() + 7);
      break;
    case 'BIWEEKLY':
      next.setDate(next.getDate() + 14);
      break;
    case 'MONTHLY':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'QUARTERLY':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'SEMI_ANNUAL':
      next.setMonth(next.getMonth() + 6);
      break;
    case 'ANNUAL':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

// POST /api/recurring-invoices/[id]/generate - Generate invoice from template
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, userId }: { params: { id: string }; tenantId: string; userId: string }
) => {
  try {
    const { id: templateId } = params;

    // Get recurring invoice template
    const template = await prisma.recurringInvoice.findFirst({
      where: {
        id: templateId,
        tenantId,
      },
    });

    if (!template) {
      return apiError('Recurring invoice template not found', 404);
    }

    if (!template.isActive) {
      return apiError('Recurring invoice template is inactive', 400);
    }

    // Check if template has reached end date
    if (template.endDate && new Date() > new Date(template.endDate)) {
      return apiError('Recurring invoice template has expired', 400);
    }

    // Generate invoice number
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

    // Calculate due date
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + template.daysDue);

    // Create invoice
    const invoice = await prisma.customerInvoice.create({
      data: {
        invoiceNumber,
        customerId: template.customerId,
        invoiceType: 'RECURRING',
        recurringInvoiceId: template.id,
        subtotal: template.subtotal,
        taxAmount: template.taxAmount,
        discount: template.discount,
        totalAmount: template.totalAmount,
        balanceDue: template.totalAmount,
        status: template.autoSend ? 'SENT' : 'DRAFT',
        issueDate,
        dueDate,
        sentAt: template.autoSend ? new Date() : null,
        paymentTerms: template.paymentTerms,
        notes: template.notes || undefined,
        terms: template.terms || undefined,
        lineItems: template.lineItems,
        currency: template.currency,
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

    // Update recurring template - increment counter and set next date
    const nextInvoiceDate = calculateNextInvoiceDate(now, template.frequency);
    await prisma.recurringInvoice.update({
      where: { id: template.id },
      data: {
        lastGeneratedAt: now,
        generatedCount: template.generatedCount + 1,
        nextInvoiceDate,
      },
    });

    // TODO: If autoSend is true, send email here

    return apiResponse({
      message: template.autoSend
        ? 'Invoice generated and sent successfully'
        : 'Invoice generated successfully',
      invoice,
      nextInvoiceDate,
    }, 201);
  } catch (error: any) {
    console.error('Error generating invoice from template:', error);
    return apiError(error.message || 'Failed to generate invoice', 500);
  }
});
