import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const SegregationBatchUpdateSchema = z.object({
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  wastageQty: z.number().min(0).optional(),
  wastagePercent: z.number().min(0).max(100).optional(),
  wastageCost: z.number().min(0).optional(),
  notes: z.string().optional(),
});

// GET - Get single batch
export const GET = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    const batch = await prisma.segregationBatch.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        rawMaterial: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        },
        outputs: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                unitPrice: true,
              },
            },
          },
        },
      },
    });

    if (!batch) {
      return apiError('Batch not found', 404);
    }

    return apiResponse({ batch });
  } catch (error: any) {
    console.error('Error fetching batch:', error);
    return apiError(error.message || 'Failed to fetch batch', 500);
  }
});

// PATCH - Update batch
export const PATCH = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const body = await req.json();
    const validated = SegregationBatchUpdateSchema.parse(body);

    // Verify batch exists and belongs to tenant
    const existingBatch = await prisma.segregationBatch.findFirst({
      where: { id, tenantId },
    });

    if (!existingBatch) {
      return apiError('Batch not found', 404);
    }

    const batch = await prisma.segregationBatch.update({
      where: { id },
      data: validated,
      include: {
        rawMaterial: true,
        outputs: {
          include: {
            product: true,
          },
        },
      },
    });

    return apiResponse({ batch });
  } catch (error: any) {
    console.error('Error updating batch:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update batch', 500);
  }
});

// DELETE - Delete batch
export const DELETE = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    // Verify batch exists and belongs to tenant
    const existingBatch = await prisma.segregationBatch.findFirst({
      where: { id, tenantId },
    });

    if (!existingBatch) {
      return apiError('Batch not found', 404);
    }

    // Delete batch and related outputs (cascade)
    await prisma.segregationBatch.delete({
      where: { id },
    });

    return apiResponse({ message: 'Batch deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting batch:', error);
    return apiError(error.message || 'Failed to delete batch', 500);
  }
});
