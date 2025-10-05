import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const InsightUpdateSchema = z.object({
  isRead: z.boolean().optional(),
  isDismissed: z.boolean().optional(),
});

/**
 * GET /api/insights/[id] - Get insight details
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const insight = await prisma.dataInsight.findFirst({
      where: { id, tenantId },
    });

    if (!insight) {
      return apiError('Insight not found', 404);
    }

    return apiResponse(insight);
  } catch (error: any) {
    console.error('Error fetching insight:', error);
    return apiError(error.message || 'Failed to fetch insight', 500);
  }
});

/**
 * PATCH /api/insights/[id] - Update insight (mark as read/dismissed)
 */
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = InsightUpdateSchema.parse(body);

    const insight = await prisma.dataInsight.findFirst({
      where: { id, tenantId },
    });

    if (!insight) {
      return apiError('Insight not found', 404);
    }

    const updatedInsight = await prisma.dataInsight.update({
      where: { id },
      data: validated,
    });

    return apiResponse({
      message: 'Insight updated successfully',
      insight: updatedInsight,
    });
  } catch (error: any) {
    console.error('Error updating insight:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update insight', 500);
  }
});

/**
 * DELETE /api/insights/[id] - Delete insight
 */
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const insight = await prisma.dataInsight.findFirst({
      where: { id, tenantId },
    });

    if (!insight) {
      return apiError('Insight not found', 404);
    }

    await prisma.dataInsight.delete({
      where: { id },
    });

    return apiResponse({
      message: 'Insight deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting insight:', error);
    return apiError(error.message || 'Failed to delete insight', 500);
  }
});
