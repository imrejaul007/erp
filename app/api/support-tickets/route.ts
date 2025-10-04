import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const TicketCreateSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['TECHNICAL', 'BILLING', 'GENERAL', 'COMPLAINT', 'FEATURE_REQUEST']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  attachments: z.array(z.object({
    url: z.string().url(),
    name: z.string(),
    type: z.string(),
  })).optional(),
});

/**
 * GET /api/support-tickets - List all support tickets
 */
export const GET = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assignedTo');

    const where: any = { tenantId };

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;

    const tickets = await prisma.supportTicket.findMany({
      where,
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
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return apiResponse(tickets);
  } catch (error: any) {
    console.error('Error fetching support tickets:', error);
    return apiError(error.message || 'Failed to fetch support tickets', 500);
  }
});

/**
 * POST /api/support-tickets - Create new support ticket
 */
export const POST = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = TicketCreateSchema.parse(body);

    // Verify customer exists
    const customer = await prisma.customer.findFirst({
      where: {
        id: validated.customerId,
        tenantId,
      },
    });

    if (!customer) {
      return apiError('Customer not found', 404);
    }

    // Check if customer has portal access
    const portalAccess = await prisma.customerPortalAccess.findFirst({
      where: {
        customerId: validated.customerId,
        tenantId,
      },
    });

    // Generate ticket number
    const count = await prisma.supportTicket.count({ where: { tenantId } });
    const ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        customerId: validated.customerId,
        portalAccessId: portalAccess?.id,
        subject: validated.subject,
        description: validated.description,
        category: validated.category,
        priority: validated.priority,
        attachments: validated.attachments || [],
        status: 'OPEN',
        tenantId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Support ticket created successfully',
      ticket,
    }, 201);
  } catch (error: any) {
    console.error('Error creating support ticket:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create support ticket', 500);
  }
});
