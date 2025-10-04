import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

/**
 * Generate payment link for invoice
 * This is a placeholder that generates a shareable link structure
 * In production, this would integrate with actual payment gateways
 */

// POST /api/invoices/[id]/payment-link - Generate payment link
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: invoiceId } = params;
    const body = await req.json();
    const { gateway } = body; // Optional: specify gateway provider

    // Get invoice
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

    if (invoice.status === 'PAID') {
      return apiError('Invoice is already paid', 400);
    }

    if (invoice.status === 'CANCELLED') {
      return apiError('Cannot generate payment link for cancelled invoice', 400);
    }

    // Get active payment gateway
    let paymentGateway;
    if (gateway) {
      paymentGateway = await prisma.paymentGateway.findFirst({
        where: {
          tenantId,
          provider: gateway,
          isActive: true,
        },
      });
    } else {
      // Get default active gateway
      paymentGateway = await prisma.paymentGateway.findFirst({
        where: {
          tenantId,
          isActive: true,
        },
      });
    }

    if (!paymentGateway) {
      return apiError('No active payment gateway configured', 400);
    }

    // Generate unique payment token (in production, use crypto.randomBytes)
    const paymentToken = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Construct payment link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const paymentLink = `${baseUrl}/pay/${paymentToken}`;

    // In production, this would:
    // 1. Call payment gateway API to create payment session
    // 2. Store payment session details
    // 3. Return gateway-specific payment URL

    // For now, return a structured payment link
    const paymentDetails = {
      paymentLink,
      paymentToken,
      gateway: paymentGateway.provider,
      amount: Number(invoice.balanceDue),
      currency: invoice.currency,
      invoiceNumber: invoice.invoiceNumber,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      qrCodeData: invoice.qrCodeData,
    };

    return apiResponse({
      message: 'Payment link generated successfully',
      ...paymentDetails,
      instructions: {
        stripe: 'Integrate with Stripe Checkout API',
        paytabs: 'Integrate with PayTabs Payment Pages',
        paypal: 'Integrate with PayPal Smart Payment Buttons',
        razorpay: 'Integrate with Razorpay Payment Links',
      }[paymentGateway.provider.toLowerCase()] || 'Configure payment gateway integration',
    });
  } catch (error: any) {
    console.error('Error generating payment link:', error);
    return apiError(error.message || 'Failed to generate payment link', 500);
  }
});

// GET /api/invoices/[id]/payment-link - Get existing payment link
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: invoiceId } = params;

    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
      },
    });

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    const paymentGateway = await prisma.paymentGateway.findFirst({
      where: {
        tenantId,
        isActive: true,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const paymentToken = `pay_${invoiceId}`;
    const paymentLink = `${baseUrl}/pay/${paymentToken}`;

    return apiResponse({
      paymentLink,
      gateway: paymentGateway?.provider || 'Not configured',
      amount: Number(invoice.balanceDue),
      currency: invoice.currency,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
    });
  } catch (error: any) {
    console.error('Error fetching payment link:', error);
    return apiError(error.message || 'Failed to fetch payment link', 500);
  }
});
