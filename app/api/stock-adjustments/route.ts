import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const AdjustmentCreateSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  type: z.enum(['INCREASE', 'DECREASE', 'RECOUNT', 'DAMAGE', 'LOSS', 'FOUND']),
  quantityChange: z.number().int().refine((val) => val !== 0, 'Quantity change cannot be zero'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  description: z.string().optional(),
  costImpact: z.number().optional(),
  requiresApproval: z.boolean().default(false),
});

/**
 * GET /api/stock-adjustments - List all stock adjustments
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = { tenantId };

    if (productId) where.productId = productId;
    if (type) where.type = type;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const adjustments = await prisma.stockAdjustment.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unit: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(adjustments);
  } catch (error: any) {
    console.error('Error fetching stock adjustments:', error);
    return apiError(error.message || 'Failed to fetch stock adjustments', 500);
  }
});

/**
 * POST /api/stock-adjustments - Create stock adjustment
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = AdjustmentCreateSchema.parse(body);

    // Verify product exists
    const product = await prisma.product.findFirst({
      where: {
        id: validated.productId,
        tenantId,
      },
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    const quantityBefore = product.stockQuantity;
    let quantityAfter = quantityBefore;

    // Calculate new quantity based on adjustment type
    if (['INCREASE', 'FOUND'].includes(validated.type)) {
      quantityAfter = quantityBefore + Math.abs(validated.quantityChange);
    } else if (['DECREASE', 'DAMAGE', 'LOSS'].includes(validated.type)) {
      quantityAfter = quantityBefore - Math.abs(validated.quantityChange);
      if (quantityAfter < 0) {
        return apiError('Adjustment would result in negative stock', 400);
      }
    } else if (validated.type === 'RECOUNT') {
      quantityAfter = validated.quantityChange;
    }

    // Generate adjustment number
    const count = await prisma.stockAdjustment.count({ where: { tenantId } });
    const adjustmentNumber = `ADJ-${String(count + 1).padStart(6, '0')}`;

    // Create adjustment and update product stock in transaction
    const [adjustment] = await prisma.$transaction([
      prisma.stockAdjustment.create({
        data: {
          adjustmentNumber,
          productId: validated.productId,
          type: validated.type,
          quantityBefore,
          quantityAfter,
          quantityChange: validated.quantityChange,
          reason: validated.reason,
          description: validated.description,
          costImpact: validated.costImpact,
          requiresApproval: validated.requiresApproval,
          tenantId,
          createdById: user?.id || 'system',
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      // Update product stock if doesn't require approval
      ...(!validated.requiresApproval ? [
        prisma.product.update({
          where: { id: validated.productId },
          data: { stockQuantity: quantityAfter },
        }),
      ] : []),
    ]);

    return apiResponse({
      message: validated.requiresApproval
        ? 'Stock adjustment created and pending approval'
        : 'Stock adjustment created successfully',
      adjustment,
    }, 201);
  } catch (error: any) {
    console.error('Error creating stock adjustment:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create stock adjustment', 500);
  }
});
