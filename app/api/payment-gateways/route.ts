import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const PaymentGatewaySchema = z.object({
  name: z.string().min(1),
  provider: z.enum(['STRIPE', 'PAYTABS', 'PAYPAL', 'RAZORPAY']),
  isActive: z.boolean().default(false),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  merchantId: z.string().optional(),
  profileId: z.string().optional(),
  serverKey: z.string().optional(),
  mode: z.enum(['sandbox', 'live']).default('sandbox'),
  currency: z.string().default('AED'),
  returnUrl: z.string().url().optional(),
  callbackUrl: z.string().url().optional(),
  supportsRefunds: z.boolean().default(true),
  supportsRecurring: z.boolean().default(false),
});

// GET /api/payment-gateways - List all payment gateways
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const gateways = await prisma.paymentGateway.findMany({
      where,
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        mode: true,
        currency: true,
        supportsRefunds: true,
        supportsRecurring: true,
        createdAt: true,
        updatedAt: true,
        // Exclude sensitive fields
        apiKey: false,
        apiSecret: false,
        merchantId: false,
        profileId: false,
        serverKey: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ gateways });
  } catch (error: any) {
    console.error('Error fetching payment gateways:', error);
    return apiError(error.message || 'Failed to fetch payment gateways', 500);
  }
});

// POST /api/payment-gateways - Create payment gateway configuration
export const POST = withTenant(async (req: NextRequest, { tenantId, userId }) => {
  try {
    const body = await req.json();
    const validated = PaymentGatewaySchema.parse(body);

    // Check if gateway already exists for this provider
    const existing = await prisma.paymentGateway.findUnique({
      where: {
        tenantId_provider: {
          tenantId,
          provider: validated.provider,
        },
      },
    });

    if (existing) {
      return apiError(`Payment gateway for ${validated.provider} already exists`, 400);
    }

    // If setting as active, deactivate all other gateways for this tenant
    if (validated.isActive) {
      await prisma.paymentGateway.updateMany({
        where: { tenantId },
        data: { isActive: false },
      });
    }

    const gateway = await prisma.paymentGateway.create({
      data: {
        ...validated,
        tenantId,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        mode: true,
        currency: true,
        supportsRefunds: true,
        supportsRecurring: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return apiResponse({
      message: 'Payment gateway created successfully',
      gateway,
    }, 201);
  } catch (error: any) {
    console.error('Error creating payment gateway:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create payment gateway', 500);
  }
});
