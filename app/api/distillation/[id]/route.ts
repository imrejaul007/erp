import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const DistillationBatchUpdateSchema = z.object({
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
  actualYield: z.number().min(0).max(100).optional(),
  outputQuantity: z.number().min(0).optional(),
  qualityGrade: z.string().optional(),
  endDate: z.string().optional(),
  temperature: z.number().min(0).optional(),
  pressure: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  notes: z.string().optional(),
});

// GET - Get single distillation batch
export const GET = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    const batch = await prisma.distillationBatch.findFirst({
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
        outputProduct: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        },
        logs: {
          orderBy: { logDate: 'desc' },
        },
      },
    });

    if (!batch) {
      return apiError('Distillation batch not found', 404);
    }

    return apiResponse({ batch });
  } catch (error: any) {
    console.error('Error fetching distillation batch:', error);
    return apiError(error.message || 'Failed to fetch batch', 500);
  }
});

// PATCH - Update distillation batch
export const PATCH = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const body = await req.json();
    const validated = DistillationBatchUpdateSchema.parse(body);

    // Verify batch exists and belongs to tenant
    const existingBatch = await prisma.distillationBatch.findFirst({
      where: { id, tenantId },
    });

    if (!existingBatch) {
      return apiError('Distillation batch not found', 404);
    }

    // Prepare update data
    const updateData: any = { ...validated };

    // Convert endDate string to Date if provided
    if (validated.endDate) {
      updateData.endDate = new Date(validated.endDate);
    }

    const batch = await prisma.distillationBatch.update({
      where: { id },
      data: updateData,
      include: {
        rawMaterial: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        },
        outputProduct: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        },
        logs: {
          orderBy: { logDate: 'desc' },
        },
      },
    });

    return apiResponse({ batch });
  } catch (error: any) {
    console.error('Error updating distillation batch:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update batch', 500);
  }
});

// DELETE - Delete distillation batch
export const DELETE = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    // Verify batch exists and belongs to tenant
    const existingBatch = await prisma.distillationBatch.findFirst({
      where: { id, tenantId },
    });

    if (!existingBatch) {
      return apiError('Distillation batch not found', 404);
    }

    // Delete batch and related logs (cascade)
    await prisma.distillationBatch.delete({
      where: { id },
    });

    return apiResponse({ message: 'Distillation batch deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting distillation batch:', error);
    return apiError(error.message || 'Failed to delete batch', 500);
  }
});
