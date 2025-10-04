import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import {
  sendInvoiceEmail,
  sendPaymentReminderEmail,
  type InvoiceEmailData,
} from '@/lib/email-service';

const SendInvoiceSchema = z.object({
  emailType: z.enum(['invoice', 'reminder']).default('invoice'),
  recipientEmail: z.string().email().optional(),
  cc: z.array(z.string().email()).optional(),
  customMessage: z.string().optional(),
});

// POST /api/invoices/[id]/send - Send invoice email to customer
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: invoiceId } = params;
    const body = await req.json();
    const validated = SendInvoiceSchema.parse(body);

    // Get invoice with all related data
    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
      },
      include: {
        customer: true,
        tenant: true,
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

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    // Check if invoice can be sent
    if (invoice.status === 'PAID' && validated.emailType !== 'reminder') {
      return apiError('Cannot send a paid invoice', 400);
    }

    if (invoice.status === 'CANCELLED') {
      return apiError('Cannot send a cancelled invoice', 400);
    }

    // Get branding for company info
    const branding = await prisma.tenantBranding.findUnique({
      where: { tenantId },
    });

    const template = await prisma.invoiceTemplate.findFirst({
      where: {
        tenantId,
        isDefault: true,
      },
    });

    // Determine recipient email
    const recipientEmail = validated.recipientEmail || invoice.customer.email;

    if (!recipientEmail) {
      return apiError('Customer email not found. Please provide a recipient email.', 400);
    }

    // Prepare email data
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const invoiceUrl = `${baseUrl}/invoices/${invoice.id}`;
    const pdfUrl = invoice.pdfUrl || `${baseUrl}/api/invoices/${invoice.id}/pdf`;

    const emailData: InvoiceEmailData = {
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customer.name,
      totalAmount: Number(invoice.balanceDue),
      dueDate: invoice.dueDate,
      currency: invoice.currency,
      invoiceUrl,
      pdfUrl,
      companyName: template?.companyName || branding?.businessName || invoice.tenant.name,
      companyEmail: template?.companyEmail || invoice.tenant.ownerEmail,
      paymentInstructions: template?.paymentInstructions || undefined,
    };

    // Send email based on type
    let emailSent = false;
    if (validated.emailType === 'reminder') {
      emailSent = await sendPaymentReminderEmail(emailData);
    } else {
      emailSent = await sendInvoiceEmail(emailData);
    }

    if (!emailSent) {
      return apiError('Failed to send email', 500);
    }

    // Update invoice
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (validated.emailType === 'invoice') {
      // First send - mark as sent
      if (!invoice.sentAt) {
        updateData.sentAt = new Date();
        updateData.status = 'SENT';
      }
    } else if (validated.emailType === 'reminder') {
      // Payment reminder
      updateData.lastReminder = new Date();
      updateData.reminderCount = invoice.reminderCount + 1;
    }

    const updatedInvoice = await prisma.customerInvoice.update({
      where: { id: invoice.id },
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
      message: `${validated.emailType === 'reminder' ? 'Payment reminder' : 'Invoice'} sent successfully`,
      invoice: updatedInvoice,
      sentTo: recipientEmail,
      emailType: validated.emailType,
    });
  } catch (error: any) {
    console.error('Error sending invoice:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to send invoice', 500);
  }
});
