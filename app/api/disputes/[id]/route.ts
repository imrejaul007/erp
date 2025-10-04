import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const DisputeUpdateSchema = z.object({
  status: z.enum(['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'ESCALATED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional().nullable(),
  resolution: z.string().optional(),
  resolutionType: z.enum(['FULL_REFUND', 'PARTIAL_REFUND', 'CREDIT_NOTE', 'DISCOUNT', 'REJECTED', 'NO_ACTION']).optional(),
  refundedAmount: z.number().positive().optional(),
  nextFollowUpAt: z.string().datetime().optional().nullable(),
});

/**
 * GET /api/disputes/[id] - Get single dispute with full details
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const dispute = await prisma.invoiceDispute.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            paidAmount: true,
            balanceDue: true,
            status: true,
            issueDate: true,
            dueDate: true,
            lineItems: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!dispute) {
      return apiError('Dispute not found', 404);
    }

    return apiResponse(dispute);
  } catch (error: any) {
    console.error('Error fetching dispute:', error);
    return apiError(error.message || 'Failed to fetch dispute', 500);
  }
});

/**
 * PATCH /api/disputes/[id] - Update dispute
 */
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = DisputeUpdateSchema.parse(body);

    // Get current dispute
    const currentDispute = await prisma.invoiceDispute.findFirst({
      where: { id, tenantId },
    });

    if (!currentDispute) {
      return apiError('Dispute not found', 404);
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    // Track status changes
    let statusChanged = false;
    if (validated.status && validated.status !== currentDispute.status) {
      updateData.status = validated.status;
      statusChanged = true;

      // Auto-set resolution date if resolved or rejected
      if (['RESOLVED', 'REJECTED'].includes(validated.status)) {
        updateData.resolvedAt = new Date();
        updateData.resolvedBy = user?.id;
      }
    }

    if (validated.priority !== undefined) updateData.priority = validated.priority;
    if (validated.resolution !== undefined) updateData.resolution = validated.resolution;
    if (validated.resolutionType !== undefined) updateData.resolutionType = validated.resolutionType;
    if (validated.refundedAmount !== undefined) updateData.refundedAmount = validated.refundedAmount;
    if (validated.nextFollowUpAt !== undefined) {
      updateData.nextFollowUpAt = validated.nextFollowUpAt ? new Date(validated.nextFollowUpAt) : null;
    }

    // Handle assignment
    if (validated.assignedTo !== undefined) {
      updateData.assignedTo = validated.assignedTo;
      if (validated.assignedTo) {
        updateData.assignedAt = new Date();
      }
    }

    // Update dispute
    const updatedDispute = await prisma.invoiceDispute.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        invoice: true,
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Create status history if status changed
    if (statusChanged) {
      await prisma.disputeStatusHistory.create({
        data: {
          disputeId: id,
          fromStatus: currentDispute.status,
          toStatus: validated.status!,
          reason: validated.resolution || 'Status updated',
          changedBy: user?.id,
          tenantId,
        },
      });
    }

    return apiResponse({
      message: 'Dispute updated successfully',
      dispute: updatedDispute,
    });
  } catch (error: any) {
    console.error('Error updating dispute:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update dispute', 500);
  }
});

/**
 * DELETE /api/disputes/[id] - Delete dispute (only if OPEN and no comments)
 */
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const dispute = await prisma.invoiceDispute.findFirst({
      where: { id, tenantId },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!dispute) {
      return apiError('Dispute not found', 404);
    }

    // Only allow deletion of new disputes with no activity
    if (dispute.status !== 'OPEN' || dispute._count.comments > 0) {
      return apiError('Can only delete open disputes with no comments', 400);
    }

    await prisma.invoiceDispute.delete({
      where: { id },
    });

    return apiResponse({ message: 'Dispute deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting dispute:', error);
    return apiError(error.message || 'Failed to delete dispute', 500);
  }
});
