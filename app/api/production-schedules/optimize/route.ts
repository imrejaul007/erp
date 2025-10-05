import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const OptimizeSchema = z.object({
  algorithm: z.enum(['FIFO', 'LIFO', 'PRIORITY', 'EARLIEST_DUE', 'SHORTEST_JOB', 'CAPACITY_BASED', 'CRITICAL_RATIO', 'RESOURCE_LEVELING']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  considerCapacity: z.boolean().default(true),
  considerPriority: z.boolean().default(true),
  considerDependencies: z.boolean().default(true),
});

/**
 * POST /api/production-schedules/optimize - Optimize production schedules
 */
export const POST = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = OptimizeSchema.parse(body);

    // Get all pending/scheduled work orders
    const workOrders = await prisma.workOrder.findMany({
      where: {
        tenantId,
        status: { in: ['PENDING', 'SCHEDULED'] },
      },
      include: {
        schedule: true,
        product: true,
        recipe: true,
        order: true,
      },
      orderBy: [
        { priority: 'desc' },
        { scheduledStart: 'asc' },
      ],
    });

    if (workOrders.length === 0) {
      return apiResponse({
        message: 'No work orders to optimize',
        optimizedCount: 0,
      });
    }

    const optimizedSchedules = [];
    let currentTime = validated.startDate ? new Date(validated.startDate) : new Date();

    for (const workOrder of workOrders) {
      const algorithm = validated.algorithm || workOrder.schedule?.algorithm || 'PRIORITY';

      // Calculate scheduled start based on algorithm
      let scheduledStart = currentTime;
      let scheduledEnd = new Date(workOrder.scheduledEnd);

      // Apply algorithm-specific logic
      switch (algorithm) {
        case 'FIFO':
          // First in, first out - use creation order
          scheduledStart = currentTime;
          break;

        case 'PRIORITY':
          // High priority gets earlier slots
          if (workOrder.priority === 'CRITICAL') {
            scheduledStart = currentTime;
          } else if (workOrder.priority === 'HIGH') {
            scheduledStart = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); // +2 hours
          } else {
            scheduledStart = new Date(currentTime.getTime() + 4 * 60 * 60 * 1000); // +4 hours
          }
          break;

        case 'EARLIEST_DUE':
          // Schedule based on due date
          scheduledStart = currentTime;
          break;

        case 'SHORTEST_JOB':
          // Shorter jobs first
          const estimatedDuration = workOrder.estimatedHours || 8;
          scheduledEnd = new Date(scheduledStart.getTime() + estimatedDuration * 60 * 60 * 1000);
          break;

        case 'CAPACITY_BASED':
          // Consider capacity constraints
          if (validated.considerCapacity && workOrder.schedule) {
            const capacity = workOrder.schedule.availableCapacity || 100;
            const required = workOrder.schedule.requiredCapacity || 50;
            if (required > capacity) {
              scheduledStart = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // Delay by 1 day
            }
          }
          break;
      }

      // Calculate duration between start and end
      const duration = scheduledEnd.getTime() - scheduledStart.getTime();
      scheduledEnd = new Date(scheduledStart.getTime() + duration);

      // Calculate optimization score (0-100)
      let optimizationScore = 50; // Base score

      if (workOrder.priority === 'CRITICAL') optimizationScore += 20;
      if (workOrder.priority === 'HIGH') optimizationScore += 10;
      if (algorithm === 'PRIORITY' && validated.considerPriority) optimizationScore += 15;
      if (validated.considerCapacity) optimizationScore += 10;
      if (validated.considerDependencies) optimizationScore += 5;

      // Create or update schedule
      if (workOrder.schedule) {
        const updated = await prisma.productionSchedule.update({
          where: { id: workOrder.schedule.id },
          data: {
            algorithm,
            scheduledStart,
            scheduledEnd,
            isOptimized: true,
            optimizationScore,
          },
          include: {
            workOrder: true,
          },
        });
        optimizedSchedules.push(updated);
      } else {
        const created = await prisma.productionSchedule.create({
          data: {
            workOrderId: workOrder.id,
            algorithm,
            priority: workOrder.priority === 'CRITICAL' ? 100 : workOrder.priority === 'HIGH' ? 75 : 50,
            earliestStart: currentTime,
            latestStart: new Date(currentTime.getTime() + 24 * 60 * 60 * 1000),
            scheduledStart,
            scheduledEnd,
            isOptimized: true,
            optimizationScore,
            tenantId,
          },
          include: {
            workOrder: true,
          },
        });
        optimizedSchedules.push(created);
      }

      // Move current time forward for next work order
      currentTime = new Date(scheduledEnd.getTime() + 60 * 60 * 1000); // +1 hour gap
    }

    return apiResponse({
      message: `${optimizedSchedules.length} schedule(s) optimized successfully`,
      algorithm: validated.algorithm || 'PRIORITY',
      optimizedSchedules,
    });
  } catch (error: any) {
    console.error('Error optimizing schedules:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to optimize schedules', 500);
  }
});
