import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { TicketStatus, TicketPriority } from '@/types/crm';

const updateTicketSchema = z.object({
  subject: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  category: z.string().optional(),
  assignedToId: z.string().cuid().optional().or(z.literal(null)),
  satisfaction: z.number().int().min(1).max(5).optional(),
});

const addResponseSchema = z.object({
  content: z.string().min(1, 'Response content is required'),
  isInternal: z.boolean().default(false),
});

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Get ticket by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: {
            id: true,
            code: true,
            name: true,
            nameArabic: true,
            email: true,
            phone: true,
            segment: true,
            loyaltyAccount: {
              select: {
                tier: true,
                points: true,
              },
            },
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        responses: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Calculate metrics
    const now = new Date();
    const createdAt = ticket.createdAt;
    const ageInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    const ageInDays = Math.floor(ageInHours / 24);

    const slaHours = {
      CRITICAL: 2,
      HIGH: 8,
      MEDIUM: 24,
      LOW: 72,
    };

    const isOverdue = ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' &&
      ageInHours > slaHours[ticket.priority];

    const timeToResolution = ticket.resolvedAt
      ? (ticket.resolvedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
      : null;

    // Get related customer tickets for context
    const relatedTickets = await prisma.supportTicket.findMany({
      where: {
        customerId: ticket.customerId,
        id: { not: ticket.id },
      },
      select: {
        id: true,
        ticketNumber: true,
        subject: true,
        status: true,
        priority: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const ticketData = {
      ...ticket,
      metrics: {
        ageInHours: Math.round(ageInHours * 100) / 100,
        ageInDays,
        isOverdue,
        timeToResolution,
        slaDeadline: new Date(createdAt.getTime() + slaHours[ticket.priority] * 60 * 60 * 1000),
      },
      relatedTickets,
    };

    return NextResponse.json(ticketData);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

// PUT - Update ticket
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateTicketSchema.parse(body);

    // Get existing ticket
    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: { id: true, name: true },
        },
      },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = { ...validatedData };

    // Handle status changes
    if (validatedData.status && validatedData.status !== existingTicket.status) {
      if (validatedData.status === 'RESOLVED') {
        updateData.resolvedAt = new Date();
        if (existingTicket.createdAt) {
          updateData.resolutionTime = Math.round(
            (new Date().getTime() - existingTicket.createdAt.getTime()) / (1000 * 60)
          );
        }
      } else if (validatedData.status === 'CLOSED') {
        updateData.closedAt = new Date();
        if (!updateData.resolvedAt && !existingTicket.resolvedAt) {
          updateData.resolvedAt = new Date();
          updateData.resolutionTime = Math.round(
            (new Date().getTime() - existingTicket.createdAt.getTime()) / (1000 * 60)
          );
        }
      }
    }

    // Update ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log changes in ticket responses
    const changes = [];
    if (validatedData.status && validatedData.status !== existingTicket.status) {
      changes.push(`Status changed from ${existingTicket.status} to ${validatedData.status}`);
    }
    if (validatedData.priority && validatedData.priority !== existingTicket.priority) {
      changes.push(`Priority changed from ${existingTicket.priority} to ${validatedData.priority}`);
    }
    if (validatedData.assignedToId !== undefined && validatedData.assignedToId !== existingTicket.assignedToId) {
      if (validatedData.assignedToId) {
        const assignedUser = await prisma.user.findUnique({
          where: { id: validatedData.assignedToId },
          select: { name: true },
        });
        changes.push(`Assigned to ${assignedUser?.name || 'Unknown User'}`);
      } else {
        changes.push('Unassigned');
      }
    }

    if (changes.length > 0) {
      await prisma.ticketResponse.create({
        data: {
          ticketId: params.id,
          content: `System: ${changes.join(', ')}`,
          isInternal: true,
          createdById: session.user.id,
        },
      });

      // Log in customer history
      await prisma.customerHistory.create({
        data: {
          customerId: existingTicket.customerId,
          eventType: 'SUPPORT_TICKET_UPDATED',
          description: `Ticket ${existingTicket.ticketNumber} updated: ${changes.join(', ')}`,
          referenceId: params.id,
          createdById: session.user.id,
        },
      });
    }

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

// POST - Add response to ticket
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = addResponseSchema.parse(body);

    // Verify ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        ticketNumber: true,
        customerId: true,
        status: true,
        customer: {
          select: { name: true },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Create response
    const response = await prisma.ticketResponse.create({
      data: {
        ticketId: params.id,
        content: validatedData.content,
        isInternal: validatedData.isInternal,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Update ticket status if it was closed/resolved and this is a customer response
    if (!validatedData.isInternal && ['RESOLVED', 'CLOSED'].includes(ticket.status)) {
      await prisma.supportTicket.update({
        where: { id: params.id },
        data: {
          status: 'IN_PROGRESS',
          resolvedAt: null,
          closedAt: null,
        },
      });

      // Add system response about status change
      await prisma.ticketResponse.create({
        data: {
          ticketId: params.id,
          content: 'System: Ticket reopened due to new customer response',
          isInternal: true,
          createdById: session.user.id,
        },
      });
    }

    // Log in customer history if not internal
    if (!validatedData.isInternal) {
      await prisma.customerHistory.create({
        data: {
          customerId: ticket.customerId,
          eventType: 'SUPPORT_TICKET_RESPONSE',
          description: `Response added to ticket ${ticket.ticketNumber}`,
          referenceId: response.id,
          createdById: session.user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      response,
      message: 'Response added successfully',
    });
  } catch (error) {
    console.error('Error adding ticket response:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to add response' },
      { status: 500 }
    );
  }
}