import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const AgingBatchUpdateSchema = z.object({
  status: z.enum(['AGING', 'READY', 'COMPLETED', 'CANCELLED']).optional(),
  actualDuration: z.number().min(0).optional(),
  qualityAfter: z.string().optional(),
  completionDate: z.string().optional(),
  notes: z.string().optional(),
});

// GET - Get single aging batch
export const GET = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    const batch = await prisma.agingBatch.findFirst({
      where: {
        id,
        tenantId,
      },
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
    });

    if (!batch) {
      return apiError('Aging batch not found', 404);
    }

    // Calculate days remaining if still aging
    let daysRemaining = null;
    if (batch.status === 'AGING' && batch.expectedReadyDate) {
      const today = new Date();
      const readyDate = new Date(batch.expectedReadyDate);
      daysRemaining = Math.ceil((readyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }

    return apiResponse({
      batch: {
        ...batch,
        daysRemaining,
      }
    });
  } catch (error: any) {
    console.error('Error fetching aging batch:', error);
    return apiError(error.message || 'Failed to fetch batch', 500);
  }
});

// PATCH - Update aging batch
export const PATCH = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const body = await req.json();
    const validated = AgingBatchUpdateSchema.parse(body);

    // Verify batch exists and belongs to tenant
    const existingBatch = await prisma.agingBatch.findFirst({
      where: { id, tenantId },
    });

    if (!existingBatch) {
      return apiError('Aging batch not found', 404);
    }

    // Prepare update data
    const updateData: any = { ...validated };

    // Convert completionDate string to Date if provided
    if (validated.completionDate) {
      updateData.completionDate = new Date(validated.completionDate);
    }

    // If status changed to COMPLETED and actualDuration is not set, calculate it
    if (validated.status === 'COMPLETED' && !validated.actualDuration) {
      const startDate = new Date(existingBatch.startDate);
      const completionDate = validated.completionDate
        ? new Date(validated.completionDate)
        : new Date();
      const duration = Math.ceil((completionDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      updateData.actualDuration = duration;
      if (!validated.completionDate) {
        updateData.completionDate = new Date();
      }
    }

    const batch = await prisma.agingBatch.update({
      where: { id },
      data: updateData,
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
    });

    return apiResponse({ batch });
  } catch (error: any) {
    console.error('Error updating aging batch:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update batch', 500);
  }
});

// DELETE - Delete aging batch
export const DELETE = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    // Verify batch exists and belongs to tenant
    const existingBatch = await prisma.agingBatch.findFirst({
      where: { id, tenantId },
    });

    if (!existingBatch) {
      return apiError('Aging batch not found', 404);
    }

    // Delete aging batch
    await prisma.agingBatch.delete({
      where: { id },
    });

    return apiResponse({ message: 'Aging batch deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting aging batch:', error);
    return apiError(error.message || 'Failed to delete batch', 500);
  }
});
