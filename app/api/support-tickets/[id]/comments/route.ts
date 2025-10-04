import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const CommentCreateSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty'),
  isInternal: z.boolean().default(false),
  authorType: z.enum(['CUSTOMER', 'STAFF']).default('STAFF'),
  attachments: z.array(z.object({
    url: z.string().url(),
    name: z.string(),
    type: z.string(),
  })).optional(),
});

/**
 * GET /api/support-tickets/[id]/comments - Get all comments for ticket
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: ticketId } = params;

    // Verify ticket exists
    const ticket = await prisma.supportTicket.findFirst({
      where: { id: ticketId, tenantId },
    });

    if (!ticket) {
      return apiError('Ticket not found', 404);
    }

    const comments = await prisma.ticketComment.findMany({
      where: {
        ticketId,
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
 * POST /api/support-tickets/[id]/comments - Add comment to ticket
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id: ticketId } = params;
    const body = await req.json();
    const validated = CommentCreateSchema.parse(body);

    // Verify ticket exists
    const ticket = await prisma.supportTicket.findFirst({
      where: { id: ticketId, tenantId },
    });

    if (!ticket) {
      return apiError('Ticket not found', 404);
    }

    // Create comment
    const comment = await prisma.ticketComment.create({
      data: {
        ticketId,
        comment: validated.comment,
        isInternal: validated.isInternal,
        authorType: validated.authorType,
        authorId: user?.id || 'customer',
        attachments: validated.attachments || [],
        tenantId,
      },
    });

    // Update ticket's updated timestamp
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
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
