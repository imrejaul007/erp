import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import { generateUAEInvoiceQRCode, generateSimpleInvoiceQRCode } from '@/lib/qr-code-generator';

// GET /api/invoices/[id]/qr-code - Generate QR code for invoice
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: invoiceId } = params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'uae'; // 'uae' or 'simple'

    // Get invoice with tenant branding
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

    let qrCodeData: string;

    if (format === 'uae') {
      // Generate UAE-compliant QR code (TLV format)
      // Get tenant's VAT number from branding or use default
      const branding = await prisma.tenantBranding.findUnique({
        where: { tenantId },
      });

      const vatNumber = branding?.taxId || invoice.tenant.name; // Fallback to tenant name

      qrCodeData = generateUAEInvoiceQRCode({
        sellerName: invoice.tenant.name,
        vatNumber,
        timestamp: invoice.issueDate,
        totalAmount: Number(invoice.totalAmount),
        vatAmount: Number(invoice.taxAmount),
      });
    } else {
      // Generate simple JSON QR code
      qrCodeData = generateSimpleInvoiceQRCode(
        invoice.invoiceNumber,
        Number(invoice.totalAmount),
        invoice.currency
      );
    }

    // Update invoice with QR code data
    await prisma.customerInvoice.update({
      where: { id: invoiceId },
      data: {
        qrCodeData,
        updatedAt: new Date(),
      },
    });

    return apiResponse({
      qrCodeData,
      format,
      invoiceNumber: invoice.invoiceNumber,
    });
  } catch (error: any) {
    console.error('Error generating QR code:', error);
    return apiError(error.message || 'Failed to generate QR code', 500);
  }
});
