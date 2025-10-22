import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const AlertCreateSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  alertType: z.enum(['LOW_STOCK', 'OUT_OF_STOCK', 'OVERSTOCK', 'EXPIRING_SOON']),
  threshold: z.number().int().positive().optional(),
  notifyEmails: z.array(z.string().email()).optional(),
  notifyUsers: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

/**
 * GET /api/stock-alerts - List all stock alerts
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const alertType = searchParams.get('alertType');
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };

    if (productId) where.productId = productId;
    if (alertType) where.alertType = alertType;
    if (isActive !== null) where.isActive = isActive === 'true';

    const alerts = await prisma.stockAlert.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            stockQuantity: true,
            minStock: true,
            maxStock: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(alerts);
  } catch (error: any) {
    console.error('Error fetching stock alerts:', error);
    return apiError(error.message || 'Failed to fetch stock alerts', 500);
  }
});

/**
 * POST /api/stock-alerts - Create stock alert
 */
export const POST = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = AlertCreateSchema.parse(body);

    // Verify product exists
    const product = await prisma.products.findFirst({
      where: {
        id: validated.productId,
        tenantId,
      },
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    // Check if alert already exists
    const existing = await prisma.stockAlert.findFirst({
      where: {
        productId: validated.productId,
        alertType: validated.alertType,
        tenantId,
      },
    });

    if (existing) {
      return apiError('Alert of this type already exists for this product', 400);
    }

    const alert = await prisma.stockAlert.create({
      data: {
        productId: validated.productId,
        alertType: validated.alertType,
        threshold: validated.threshold,
        notifyEmails: validated.notifyEmails || [],
        notifyUsers: validated.notifyUsers || [],
        isActive: validated.isActive,
        tenantId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            stockQuantity: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Stock alert created successfully',
      alert,
    }, 201);
  } catch (error: any) {
    console.error('Error creating stock alert:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create stock alert', 500);
  }
});
