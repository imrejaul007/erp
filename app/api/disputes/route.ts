import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const DisputeCreateSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  disputeReason: z.string().min(1, 'Dispute reason is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  disputedAmount: z.number().positive().optional(),
  evidence: z.array(z.object({
    type: z.enum(['document', 'image', 'email', 'other']),
    url: z.string().url(),
    description: z.string().optional(),
  })).optional(),
  customerNotes: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

/**
 * GET /api/disputes - List all disputes with filters
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const invoiceId = searchParams.get('invoiceId');
    const assignedTo = searchParams.get('assignedTo');
    const priority = searchParams.get('priority');

    const where: any = { tenantId };

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (invoiceId) where.invoiceId = invoiceId;
    if (assignedTo) where.assignedTo = assignedTo;
    if (priority) where.priority = priority;

    const disputes = await prisma.invoiceDispute.findMany({
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
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            balanceDue: true,
            status: true,
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

    return apiResponse(disputes);
  } catch (error: any) {
    console.error('Error fetching disputes:', error);
    return apiError(error.message || 'Failed to fetch disputes', 500);
  }
});

/**
 * POST /api/disputes - Create new dispute
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = DisputeCreateSchema.parse(body);

    // Verify invoice exists and belongs to tenant
    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id: validated.invoiceId,
        tenantId,
      },
    });

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    // Check if there's already an open dispute for this invoice
    const existingDispute = await prisma.invoiceDispute.findFirst({
      where: {
        invoiceId: validated.invoiceId,
        status: { in: ['OPEN', 'UNDER_REVIEW', 'ESCALATED'] },
      },
    });

    if (existingDispute) {
      return apiError('An open dispute already exists for this invoice', 400);
    }

    // Create dispute
    const dispute = await prisma.invoiceDispute.create({
      data: {
        invoiceId: validated.invoiceId,
        customerId: invoice.customerId,
        disputeReason: validated.disputeReason,
        description: validated.description,
        disputedAmount: validated.disputedAmount,
        evidence: validated.evidence || [],
        customerNotes: validated.customerNotes,
        priority: validated.priority,
        status: 'OPEN',
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
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            balanceDue: true,
          },
        },
      },
    });

    // Create initial status history
    await prisma.disputeStatusHistory.create({
      data: {
        disputeId: dispute.id,
        fromStatus: null,
        toStatus: 'OPEN',
        reason: 'Dispute created',
        changedBy: user?.id,
        tenantId,
      },
    });

    return apiResponse(dispute, 201);
  } catch (error: any) {
    console.error('Error creating dispute:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create dispute', 500);
  }
});
