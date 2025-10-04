import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const StatusUpdateSchema = z.object({
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'AGING', 'QUALITY_CHECK', 'COMPLETED', 'CANCELLED']),
  actualQuantity: z.number().positive().optional(),
  agingStartDate: z.string().datetime().optional(),
  agingDays: z.number().int().positive().optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  notes: z.string().optional(),
});

/**
 * POST /api/production-batches/[id]/status - Update batch status
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = StatusUpdateSchema.parse(body);

    const batch = await prisma.productionBatch.findFirst({
      where: { id, tenantId },
    });

    if (!batch) {
      return apiError('Production batch not found', 404);
    }

    const updateData: any = {
      status: validated.status,
      updatedAt: new Date(),
    };

    // Set endDate when completed or cancelled
    if (['COMPLETED', 'CANCELLED'].includes(validated.status)) {
      updateData.endDate = new Date();
    }

    if (validated.actualQuantity) {
      updateData.actualQuantity = validated.actualQuantity;
    }

    if (validated.status === 'AGING') {
      if (validated.agingStartDate) {
        updateData.agingStartDate = new Date(validated.agingStartDate);
      }
      if (validated.agingDays) {
        updateData.agingDays = validated.agingDays;
        if (updateData.agingStartDate || batch.agingStartDate) {
          const startDate = updateData.agingStartDate || batch.agingStartDate;
          updateData.agingEndDate = new Date(startDate);
          updateData.agingEndDate.setDate(updateData.agingEndDate.getDate() + validated.agingDays);
        }
      }
    }

    if (validated.temperature !== undefined) {
      updateData.temperature = validated.temperature;
    }

    if (validated.humidity !== undefined) {
      updateData.humidity = validated.humidity;
    }

    if (validated.notes) {
      updateData.notes = validated.notes;
    }

    const updatedBatch = await prisma.productionBatch.update({
      where: { id },
      data: updateData,
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return apiResponse({
      message: `Batch status updated to ${validated.status}`,
      batch: updatedBatch,
    });
  } catch (error: any) {
    console.error('Error updating batch status:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update batch status', 500);
  }
});
