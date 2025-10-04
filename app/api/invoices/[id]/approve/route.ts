import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import { sendInvoiceEmail, type InvoiceEmailData } from '@/lib/email-service';

const ApproveSchema = z.object({
  approved: z.boolean(),
  notes: z.string().optional(),
  sendToCustomer: z.boolean().default(false),
});

/**
 * POST /api/invoices/[id]/approve
 * Approve or reject an invoice (changes from DRAFT to SENT or marks as rejected)
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, userId }: { params: { id: string }; tenantId: string; userId: string }
) => {
  try {
    const { id: invoiceId } = params;
    const body = await req.json();
    const validated = ApproveSchema.parse(body);

    // Get invoice
    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
      },
      include: {
        customer: true,
        tenant: true,
      },
    });

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    // Check if invoice can be approved/rejected
    if (invoice.status !== 'DRAFT') {
      return apiError(`Invoice cannot be ${validated.approved ? 'approved' : 'rejected'} - current status is ${invoice.status}`, 400);
    }

    let updatedInvoice;
    let emailSent = false;

    if (validated.approved) {
      // Approve: Change status to SENT
      updatedInvoice = await prisma.customerInvoice.update({
        where: { id: invoiceId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          notes: validated.notes
            ? `${invoice.notes || ''}\n\nApproval note: ${validated.notes}`.trim()
            : invoice.notes,
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
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payments: true,
        },
      });

      // Send email to customer if requested
      if (validated.sendToCustomer && invoice.customer.email) {
        const branding = await prisma.tenantBranding.findUnique({
          where: { tenantId },
        });

        const template = await prisma.invoiceTemplate.findFirst({
          where: {
            tenantId,
            isDefault: true,
          },
        });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const emailData: InvoiceEmailData = {
          invoiceNumber: invoice.invoiceNumber,
          customerName: invoice.customer.name,
          totalAmount: Number(invoice.totalAmount),
          dueDate: invoice.dueDate,
          currency: invoice.currency,
          invoiceUrl: `${baseUrl}/invoices/${invoice.id}`,
          pdfUrl: `${baseUrl}/api/invoices/${invoice.id}/pdf`,
          companyName: template?.companyName || branding?.businessName || invoice.tenant.name,
          companyEmail: template?.companyEmail || invoice.tenant.ownerEmail,
          paymentInstructions: template?.paymentInstructions,
        };

        emailSent = await sendInvoiceEmail(emailData);
      }
    } else {
      // Reject: Change status to CANCELLED
      updatedInvoice = await prisma.customerInvoice.update({
        where: { id: invoiceId },
        data: {
          status: 'CANCELLED',
          notes: validated.notes
            ? `${invoice.notes || ''}\n\nRejection reason: ${validated.notes}`.trim()
            : invoice.notes,
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
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payments: true,
        },
      });
    }

    return apiResponse({
      message: validated.approved
        ? 'Invoice approved and sent successfully'
        : 'Invoice rejected successfully',
      invoice: updatedInvoice,
      emailSent,
    });
  } catch (error: any) {
    console.error('Error approving/rejecting invoice:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to process approval', 500);
  }
});
