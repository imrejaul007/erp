import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiError } from '@/lib/api-response';
import {
  generateInvoicePDF,
  generateInvoiceHTML,
  getInvoiceFilename,
  type InvoicePDFData,
} from '@/lib/pdf-generator';

/**
 * Generate and download invoice PDF
 * GET /api/invoices/[id]/pdf
 * Query params:
 * - format: 'pdf' | 'html' (default: 'pdf')
 * - download: 'true' | 'false' (default: 'true')
 */

export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: invoiceId } = params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'pdf';
    const download = searchParams.get('download') !== 'false';

    // Get invoice with all related data
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

    // Get branding/template settings
    const branding = await prisma.tenantBranding.findUnique({
      where: { tenantId },
    });

    const template = await prisma.invoiceTemplate.findFirst({
      where: {
        tenantId,
        isDefault: true,
      },
    });

    // Prepare PDF data
    const pdfData: InvoicePDFData = {
      // Invoice Info
      invoiceNumber: invoice.invoiceNumber,
      invoiceType: invoice.invoiceType,
      status: invoice.status,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      currency: invoice.currency,

      // Company Info
      companyName: template?.companyName || branding?.businessName || invoice.tenant.name,
      companyAddress: template?.companyAddress || branding?.address,
      companyPhone: template?.companyPhone || branding?.phone,
      companyEmail: template?.companyEmail || invoice.tenant.ownerEmail,
      companyWebsite: template?.companyWebsite || branding?.website,
      companyLogo: template?.logo || branding?.logoUrl,
      taxId: template?.taxId || branding?.taxId,

      // Customer Info
      customerName: invoice.customer.name,
      customerEmail: invoice.customer.email,
      customerPhone: invoice.customer.phone || undefined,
      customerAddress: invoice.customer.address || undefined,

      // Line Items
      lineItems: (invoice.lineItems as any[]).map((item) => ({
        description: item.description || item.name || 'Item',
        quantity: item.quantity || 1,
        unitPrice: Number(item.unitPrice || item.price || 0),
        amount: Number(item.amount || item.total || 0),
        taxRate: item.taxRate,
      })),

      // Totals
      subtotal: Number(invoice.subtotal),
      taxAmount: Number(invoice.taxAmount),
      discount: Number(invoice.discount),
      totalAmount: Number(invoice.totalAmount),
      balanceDue: Number(invoice.balanceDue),
      paidAmount: Number(invoice.paidAmount),

      // Additional Info
      notes: invoice.notes || template?.defaultNotes || undefined,
      terms: invoice.terms || template?.defaultTerms || undefined,
      paymentTerms: invoice.paymentTerms,
      qrCodeData: invoice.qrCodeData || undefined,

      // Branding
      primaryColor: template?.primaryColor || branding?.primaryColor,
      secondaryColor: template?.secondaryColor || branding?.secondaryColor,
      accentColor: template?.accentColor,
    };

    // Generate HTML or PDF based on format
    if (format === 'html') {
      const html = generateInvoiceHTML(pdfData);

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': download
            ? `attachment; filename="${getInvoiceFilename(invoice.invoiceNumber).replace('.pdf', '.html')}"`
            : 'inline',
        },
      });
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(pdfData);

    // Update invoice with PDF URL (in production, you'd upload to S3/storage)
    const pdfUrl = `/api/invoices/${invoice.id}/pdf`;
    await prisma.customerInvoice.update({
      where: { id: invoice.id },
      data: {
        pdfUrl,
        updatedAt: new Date(),
      },
    });

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': download
          ? `attachment; filename="${getInvoiceFilename(invoice.invoiceNumber)}"`
          : 'inline',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error generating invoice PDF:', error);
    return apiError(error.message || 'Failed to generate invoice PDF', 500);
  }
});
