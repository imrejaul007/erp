import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const WorkOrderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'SCHEDULED', 'READY', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED', 'FAILED']).optional(),
  completedQty: z.number().min(0).optional(),
  actualHours: z.number().positive().optional(),
  actualCost: z.number().positive().optional(),
  completionNotes: z.string().optional(),
  qualityCheck: z.boolean().optional(),
});

/**
 * GET /api/work-orders/[id] - Get work order details
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const workOrder = await prisma.workOrder.findFirst({
      where: { id, tenantId },
      include: {
        product: true,
        recipe: true,
        order: true,
        batch: true,
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
        tasks: {
          include: {
            assignedUser: {
              select: { id: true, name: true },
            },
          },
          orderBy: { sequence: 'asc' },
        },
        schedule: true,
      },
    });

    if (!workOrder) {
      return apiError('Work order not found', 404);
    }

    return apiResponse(workOrder);
  } catch (error: any) {
    console.error('Error fetching work order:', error);
    return apiError(error.message || 'Failed to fetch work order', 500);
  }
});

/**
 * PATCH /api/work-orders/[id] - Update work order
 */
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = WorkOrderUpdateSchema.parse(body);

    const workOrder = await prisma.workOrder.findFirst({
      where: { id, tenantId },
    });

    if (!workOrder) {
      return apiError('Work order not found', 404);
    }

    const updateData: any = { ...validated };

    // Track status changes
    if (validated.status === 'IN_PROGRESS' && !workOrder.actualStart) {
      updateData.actualStart = new Date();
    }

    if (validated.status === 'COMPLETED' && !workOrder.actualEnd) {
      updateData.actualEnd = new Date();
    }

    const updatedWorkOrder = await prisma.workOrder.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
        recipe: true,
        order: true,
        batch: true,
        assignedUser: true,
        tasks: true,
        schedule: true,
      },
    });

    return apiResponse({
      message: 'Work order updated successfully',
      workOrder: updatedWorkOrder,
    });
  } catch (error: any) {
    console.error('Error updating work order:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update work order', 500);
  }
});

/**
 * DELETE /api/work-orders/[id] - Delete work order
 */
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const workOrder = await prisma.workOrder.findFirst({
      where: { id, tenantId },
    });

    if (!workOrder) {
      return apiError('Work order not found', 404);
    }

    // Only allow deletion of pending/scheduled work orders
    if (!['PENDING', 'SCHEDULED', 'CANCELLED'].includes(workOrder.status)) {
      return apiError('Cannot delete work order in current status', 400);
    }

    await prisma.workOrder.delete({
      where: { id },
    });

    return apiResponse({
      message: 'Work order deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting work order:', error);
    return apiError(error.message || 'Failed to delete work order', 500);
  }
});
