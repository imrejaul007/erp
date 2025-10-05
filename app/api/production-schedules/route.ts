import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ScheduleCreateSchema = z.object({
  workOrderId: z.string(),
  algorithm: z.enum(['FIFO', 'LIFO', 'PRIORITY', 'EARLIEST_DUE', 'SHORTEST_JOB', 'CAPACITY_BASED', 'CRITICAL_RATIO', 'RESOURCE_LEVELING']).default('FIFO'),
  priority: z.number().int().default(0),
  requiredCapacity: z.number().positive().optional(),
  availableCapacity: z.number().positive().optional(),
  resources: z.array(z.object({
    type: z.string(),
    quantity: z.number().positive(),
    unit: z.string(),
  })).optional(),
  earliestStart: z.string().datetime(),
  latestStart: z.string().datetime(),
  buffer: z.number().min(0).optional(), // Buffer time in hours
  constraints: z.array(z.object({
    type: z.string(),
    value: z.any(),
  })).optional(),
});

/**
 * GET /api/production-schedules - List all production schedules
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const algorithm = searchParams.get('algorithm');
    const isOptimized = searchParams.get('isOptimized');
    const locked = searchParams.get('locked');

    const where: any = { tenantId };
    if (algorithm) where.algorithm = algorithm;
    if (isOptimized !== null) where.isOptimized = isOptimized === 'true';
    if (locked !== null) where.locked = locked === 'true';

    const schedules = await prisma.productionSchedule.findMany({
      where,
      include: {
        workOrder: {
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
          },
        },
      },
      orderBy: { scheduledStart: 'asc' },
    });

    return apiResponse(schedules);
  } catch (error: any) {
    console.error('Error fetching schedules:', error);
    return apiError(error.message || 'Failed to fetch schedules', 500);
  }
});

/**
 * POST /api/production-schedules - Create production schedule
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = ScheduleCreateSchema.parse(body);

    // Check if work order exists
    const workOrder = await prisma.workOrder.findFirst({
      where: { id: validated.workOrderId, tenantId },
    });

    if (!workOrder) {
      return apiError('Work order not found', 404);
    }

    // Check if schedule already exists for this work order
    const existing = await prisma.productionSchedule.findUnique({
      where: { workOrderId: validated.workOrderId },
    });

    if (existing) {
      return apiError('Schedule already exists for this work order', 400);
    }

    // Calculate scheduled dates based on algorithm
    let scheduledStart = new Date(validated.earliestStart);
    let scheduledEnd = new Date(workOrder.scheduledEnd);

    // Apply buffer time if provided
    if (validated.buffer) {
      scheduledEnd = new Date(scheduledEnd.getTime() + validated.buffer * 60 * 60 * 1000);
    }

    // Calculate utilization rate
    let utilizationRate = null;
    if (validated.requiredCapacity && validated.availableCapacity) {
      utilizationRate = (validated.requiredCapacity / validated.availableCapacity) * 100;
    }

    const schedule = await prisma.productionSchedule.create({
      data: {
        workOrderId: validated.workOrderId,
        algorithm: validated.algorithm,
        priority: validated.priority,
        requiredCapacity: validated.requiredCapacity,
        availableCapacity: validated.availableCapacity,
        utilizationRate,
        resources: validated.resources || [],
        earliestStart: new Date(validated.earliestStart),
        latestStart: new Date(validated.latestStart),
        scheduledStart,
        scheduledEnd,
        buffer: validated.buffer,
        constraints: validated.constraints || [],
        tenantId,
      },
      include: {
        workOrder: {
          include: {
            product: true,
            recipe: true,
            order: true,
            batch: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Production schedule created successfully',
      schedule,
    }, 201);
  } catch (error: any) {
    console.error('Error creating schedule:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create schedule', 500);
  }
});
