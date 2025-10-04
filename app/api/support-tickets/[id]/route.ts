import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const TicketUpdateSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional().nullable(),
  resolution: z.string().optional(),
});

/**
 * GET /api/support-tickets/[id] - Get single ticket with comments
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const ticket = await prisma.supportTicket.findFirst({
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
          },
        },
        portalAccess: {
          select: {
            id: true,
            email: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      return apiError('Support ticket not found', 404);
    }

    return apiResponse(ticket);
  } catch (error: any) {
    console.error('Error fetching ticket:', error);
    return apiError(error.message || 'Failed to fetch ticket', 500);
  }
});

/**
 * PATCH /api/support-tickets/[id] - Update ticket
 */
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = TicketUpdateSchema.parse(body);

    const existing = await prisma.supportTicket.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiError('Support ticket not found', 404);
    }

    const updateData: any = { updatedAt: new Date() };

    if (validated.status) {
      updateData.status = validated.status;
      if (validated.status === 'RESOLVED') {
        updateData.resolvedAt = new Date();
        updateData.resolvedBy = user?.id;
      }
    }

    if (validated.priority) updateData.priority = validated.priority;
    if (validated.assignedTo !== undefined) updateData.assignedTo = validated.assignedTo;
    if (validated.resolution) updateData.resolution = validated.resolution;

    const ticket = await prisma.supportTicket.update({
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
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return apiResponse({
      message: 'Ticket updated successfully',
      ticket,
    });
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update ticket', 500);
  }
});
