import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ProcessReturnSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'INSPECT', 'COMPLETE']),
  resolutionType: z.enum(['FULL_REFUND', 'PARTIAL_REFUND', 'REPLACEMENT', 'EXCHANGE', 'STORE_CREDIT', 'REPAIR', 'REJECTED']).optional(),
  refundAmount: z.number().positive().optional(),
  restockingFee: z.number().min(0).optional(),
  inspectionNotes: z.string().optional(),
  itemsAccepted: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).optional(),
  itemsRejected: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    reason: z.string(),
  })).optional(),
  internalNotes: z.string().optional(),
});

/**
 * POST /api/returns/[id]/process - Process return order (approve/reject/inspect/complete)
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = ProcessReturnSchema.parse(body);

    const returnOrder = await prisma.returnOrder.findFirst({
      where: { id, tenantId },
    });

    if (!returnOrder) {
      return apiError('Return order not found', 404);
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    switch (validated.action) {
      case 'APPROVE':
        if (returnOrder.status !== 'REQUESTED') {
          return apiError('Can only approve requested returns', 400);
        }
        updateData.status = 'APPROVED';
        updateData.approvedAt = new Date();
        updateData.approvedBy = user?.id;
        break;

      case 'REJECT':
        if (returnOrder.status !== 'REQUESTED') {
          return apiError('Can only reject requested returns', 400);
        }
        updateData.status = 'REJECTED';
        updateData.resolutionType = 'REJECTED';
        break;

      case 'INSPECT':
        if (!['APPROVED', 'RECEIVED'].includes(returnOrder.status)) {
          return apiError('Can only inspect approved or received returns', 400);
        }
        updateData.status = 'INSPECTING';
        updateData.inspectedAt = new Date();
        updateData.inspectedBy = user?.id;
        updateData.inspectionNotes = validated.inspectionNotes;
        updateData.itemsAccepted = validated.itemsAccepted || [];
        updateData.itemsRejected = validated.itemsRejected || [];
        break;

      case 'COMPLETE':
        if (returnOrder.status !== 'INSPECTING') {
          return apiError('Can only complete inspected returns', 400);
        }
        if (!validated.resolutionType) {
          return apiError('Resolution type is required to complete return', 400);
        }
        updateData.status = 'COMPLETED';
        updateData.completedAt = new Date();
        updateData.resolutionType = validated.resolutionType;
        updateData.refundAmount = validated.refundAmount;
        updateData.restockingFee = validated.restockingFee || 0;

        // Mark as restocked if refund or replacement
        if (['FULL_REFUND', 'PARTIAL_REFUND', 'REPLACEMENT'].includes(validated.resolutionType)) {
          updateData.restocked = true;
          updateData.restockedAt = new Date();
          updateData.restockedBy = user?.id;
        }
        break;
    }

    if (validated.internalNotes) {
      updateData.internalNotes = validated.internalNotes;
    }

    const updatedReturn = await prisma.returnOrder.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
    });

    return apiResponse({
      message: `Return order ${validated.action.toLowerCase()}d successfully`,
      returnOrder: updatedReturn,
    });
  } catch (error: any) {
    console.error('Error processing return order:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to process return order', 500);
  }
});
