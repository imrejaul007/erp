import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { TicketStatus, TicketPriority } from '@/types/crm';

const createTicketSchema = z.object({
  customerId: z.string().cuid('Invalid customer ID'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.nativeEnum(TicketPriority),
  category: z.string().optional(),
  orderId: z.string().cuid().optional(),
});

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

const searchTicketsSchema = z.object({
  search: z.string().optional(),
  customerId: z.string().cuid().optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  category: z.string().optional(),
  assignedToId: z.string().cuid().optional(),
  dateFrom: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  dateTo: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// GET - List support tickets
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = searchTicketsSchema.parse({
      search: searchParams.get('search'),
      customerId: searchParams.get('customerId'),
      status: searchParams.get('status'),
      priority: searchParams.get('priority'),
      category: searchParams.get('category'),
      assignedToId: searchParams.get('assignedToId'),
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    });

    // Build where clause
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { ticketNumber: { contains: filters.search, mode: 'insensitive' } },
        {
          customer: {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { email: { contains: filters.search, mode: 'insensitive' } },
              { phone: { contains: filters.search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.category) where.category = filters.category;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    const skip = (filters.page - 1) * filters.limit;

    // Get tickets with related data
    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        skip,
        take: filters.limit,
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
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          responses: {
            include: {
              createdBy: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
            take: 3, // Latest 3 responses for summary
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.supportTicket.count({ where }),
    ]);

    // Add computed fields
    const ticketsWithMetrics = tickets.map((ticket) => ({
      ...ticket,
      responseCount: ticket._count.responses,
      lastResponseAt: ticket.responses.length > 0
        ? ticket.responses[ticket.responses.length - 1].createdAt
        : null,
      isOverdue: ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' &&
        isTicketOverdue(ticket.createdAt, ticket.priority),
    }));

    return NextResponse.json({
      tickets: ticketsWithMetrics,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST - Create support ticket
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createTicketSchema.parse(body);

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: validatedData.customerId },
      select: { id: true, name: true, code: true },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Generate ticket number
    const ticketCount = await prisma.supportTicket.count();
    const ticketNumber = `TKT-${String(ticketCount + 1).padStart(6, '0')}`;

    // Create ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        customerId: validatedData.customerId,
        ticketNumber,
        subject: validatedData.subject,
        description: validatedData.description,
        priority: validatedData.priority,
        category: validatedData.category || 'GENERAL',
        status: 'OPEN',
      },
      include: {
        customer: {
          select: {
            id: true,
            code: true,
            name: true,
            email: true,
            phone: true,
            segment: true,
          },
        },
      },
    });

    // Add initial response/description
    await prisma.ticketResponse.create({
      data: {
        ticketId: ticket.id,
        content: validatedData.description,
        isInternal: false,
        createdById: session.user.id,
      },
    });

    // Log in customer history
    await prisma.customerHistory.create({
      data: {
        customerId: validatedData.customerId,
        eventType: 'SUPPORT_TICKET_CREATED',
        description: `Support ticket created: ${validatedData.subject}`,
        referenceId: ticket.id,
        createdById: session.user.id,
      },
    });

    // Auto-assign based on category and priority
    const assignedAgent = await getAutoAssignedAgent(validatedData.category, validatedData.priority);
    if (assignedAgent) {
      await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: { assignedToId: assignedAgent.id },
      });
    }

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

// Helper functions
function isTicketOverdue(createdAt: Date, priority: TicketPriority): boolean {
  const now = new Date();
  const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  const slaHours = {
    CRITICAL: 2,
    HIGH: 8,
    MEDIUM: 24,
    LOW: 72,
  };

  return diffHours > slaHours[priority];
}

async function getAutoAssignedAgent(category?: string, priority?: TicketPriority) {
  // Simple round-robin assignment for now
  // In a real implementation, you'd consider:
  // - Agent workload
  // - Category specialization
  // - Current availability
  // - Priority handling capabilities

  const agents = await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'MANAGER'] },
      isActive: true,
    },
    include: {
      _count: {
        select: {
          assignedTickets: {
            where: {
              status: { in: ['OPEN', 'IN_PROGRESS'] },
            },
          },
        },
      },
    },
    orderBy: {
      assignedTickets: {
        _count: 'asc',
      },
    },
    take: 1,
  });

  return agents[0] || null;
}