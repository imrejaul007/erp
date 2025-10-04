import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const UpdatePaymentGatewaySchema = z.object({
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  merchantId: z.string().optional(),
  profileId: z.string().optional(),
  serverKey: z.string().optional(),
  mode: z.enum(['sandbox', 'live']).optional(),
  currency: z.string().optional(),
  returnUrl: z.string().url().optional(),
  callbackUrl: z.string().url().optional(),
  supportsRefunds: z.boolean().optional(),
  supportsRecurring: z.boolean().optional(),
});

// GET /api/payment-gateways/[id] - Get single payment gateway
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const gateway = await prisma.paymentGateway.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!gateway) {
      return apiError('Payment gateway not found', 404);
    }

    return apiResponse({ gateway });
  } catch (error: any) {
    console.error('Error fetching payment gateway:', error);
    return apiError(error.message || 'Failed to fetch payment gateway', 500);
  }
});

// PATCH /api/payment-gateways/[id] - Update payment gateway
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = UpdatePaymentGatewaySchema.parse(body);

    const existing = await prisma.paymentGateway.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existing) {
      return apiError('Payment gateway not found', 404);
    }

    // If setting as active, deactivate all other gateways
    if (validated.isActive === true) {
      await prisma.paymentGateway.updateMany({
        where: {
          tenantId,
          id: { not: id },
        },
        data: { isActive: false },
      });
    }

    const gateway = await prisma.paymentGateway.update({
      where: { id },
      data: validated,
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
      message: 'Payment gateway updated successfully',
      gateway,
    });
  } catch (error: any) {
    console.error('Error updating payment gateway:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update payment gateway', 500);
  }
});

// DELETE /api/payment-gateways/[id] - Delete payment gateway
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const existing = await prisma.paymentGateway.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existing) {
      return apiError('Payment gateway not found', 404);
    }

    await prisma.paymentGateway.delete({
      where: { id },
    });

    return apiResponse({
      message: 'Payment gateway deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting payment gateway:', error);
    return apiError(error.message || 'Failed to delete payment gateway', 500);
  }
});
