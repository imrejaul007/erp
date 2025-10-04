import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const CommentCreateSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty'),
  isInternal: z.boolean().default(false),
  attachments: z.array(z.object({
    url: z.string().url(),
    name: z.string(),
    type: z.string(),
  })).optional(),
});

/**
 * GET /api/disputes/[id]/comments - Get all comments for a dispute
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: disputeId } = params;

    // Verify dispute exists
    const dispute = await prisma.invoiceDispute.findFirst({
      where: { id: disputeId, tenantId },
    });

    if (!dispute) {
      return apiError('Dispute not found', 404);
    }

    const comments = await prisma.disputeComment.findMany({
      where: {
        disputeId,
        tenantId,
      },
      orderBy: { createdAt: 'asc' },
    });

    return apiResponse(comments);
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return apiError(error.message || 'Failed to fetch comments', 500);
  }
});

/**
 * POST /api/disputes/[id]/comments - Add comment to dispute
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id: disputeId } = params;
    const body = await req.json();
    const validated = CommentCreateSchema.parse(body);

    // Verify dispute exists
    const dispute = await prisma.invoiceDispute.findFirst({
      where: { id: disputeId, tenantId },
    });

    if (!dispute) {
      return apiError('Dispute not found', 404);
    }

    // Create comment
    const comment = await prisma.disputeComment.create({
      data: {
        disputeId,
        comment: validated.comment,
        isInternal: validated.isInternal,
        attachments: validated.attachments || [],
        authorId: user?.id || 'system',
        authorType: 'USER',
        tenantId,
      },
    });

    // Update dispute's last contact time
    await prisma.invoiceDispute.update({
      where: { id: disputeId },
      data: {
        lastContactAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return apiResponse({
      message: 'Comment added successfully',
      comment,
    }, 201);
  } catch (error: any) {
    console.error('Error creating comment:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create comment', 500);
  }
});
