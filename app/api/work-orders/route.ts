import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const WorkOrderCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['PRODUCTION', 'MAINTENANCE', 'QUALITY_CHECK', 'REWORK', 'ASSEMBLY', 'PACKAGING', 'TESTING', 'CUSTOM']).default('PRODUCTION'),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'SCHEDULED']).default('MEDIUM'),
  productId: z.string().optional(),
  recipeId: z.string().optional(),
  orderId: z.string().optional(),
  batchId: z.string().optional(),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  quantity: z.number().positive(),
  unit: z.string(),
  assignedTo: z.string().optional(),
  department: z.string().optional(),
  workstation: z.string().optional(),
  estimatedHours: z.number().positive().optional(),
  estimatedCost: z.number().positive().optional(),
  materials: z.array(z.object({
    materialId: z.string(),
    quantity: z.number().positive(),
    unit: z.string(),
  })).optional(),
  notes: z.string().optional(),
});

/**
 * GET /api/work-orders - List all work orders
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assignedTo');

    const where: any = { tenantId };
    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;

    const workOrders = await prisma.workOrder.findMany({
      where,
      include: {
        product: {
          select: { id: true, name: true, sku: true },
        },
        recipe: {
          select: { id: true, name: true },
        },
        order: {
          select: { id: true, orderNumber: true },
        },
        batch: {
          select: { id: true, batchNumber: true },
        },
        assignedUser: {
          select: { id: true, name: true },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            sequence: true,
          },
          orderBy: { sequence: 'asc' },
        },
        schedule: true,
      },
      orderBy: [
        { priority: 'desc' },
        { scheduledStart: 'asc' },
      ],
    });

    return apiResponse(workOrders);
  } catch (error: any) {
    console.error('Error fetching work orders:', error);
    return apiError(error.message || 'Failed to fetch work orders', 500);
  }
});

/**
 * POST /api/work-orders - Create new work order
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = WorkOrderCreateSchema.parse(body);

    // Generate work order number
    const count = await prisma.workOrder.count({ where: { tenantId } });
    const workOrderNumber = `WO-${String(count + 1).padStart(6, '0')}`;

    const workOrder = await prisma.workOrder.create({
      data: {
        workOrderNumber,
        title: validated.title,
        description: validated.description,
        type: validated.type,
        priority: validated.priority,
        productId: validated.productId,
        recipeId: validated.recipeId,
        orderId: validated.orderId,
        batchId: validated.batchId,
        scheduledStart: new Date(validated.scheduledStart),
        scheduledEnd: new Date(validated.scheduledEnd),
        quantity: validated.quantity,
        unit: validated.unit,
        assignedTo: validated.assignedTo,
        department: validated.department,
        workstation: validated.workstation,
        estimatedHours: validated.estimatedHours,
        estimatedCost: validated.estimatedCost,
        materials: validated.materials || [],
        notes: validated.notes,
        tenantId,
      },
      include: {
        product: true,
        recipe: true,
        order: true,
        batch: true,
        assignedUser: true,
      },
    });

    return apiResponse({
      message: 'Work order created successfully',
      workOrder,
    }, 201);
  } catch (error: any) {
    console.error('Error creating work order:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create work order', 500);
  }
});
