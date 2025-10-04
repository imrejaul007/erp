import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ProductionBatchCreateSchema = z.object({
  recipeId: z.string().optional().nullable(),
  plannedQuantity: z.number().positive('Planned quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  startDate: z.string().datetime(),
  supervisorId: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * GET /api/production-batches - List all production batches
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const recipeId = searchParams.get('recipeId');
    const supervisorId = searchParams.get('supervisorId');

    const where: any = { tenantId };

    if (status) where.status = status;
    if (recipeId) where.recipeId = recipeId;
    if (supervisorId) where.supervisorId = supervisorId;

    const batches = await prisma.productionBatch.findMany({
      where,
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            yieldQuantity: true,
            yieldUnit: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        inputs: true,
        outputs: true,
        qualityControls: true,
        _count: {
          select: {
            inputs: true,
            outputs: true,
            qualityControls: true,
            wastageRecords: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(batches);
  } catch (error: any) {
    console.error('Error fetching production batches:', error);
    return apiError(error.message || 'Failed to fetch production batches', 500);
  }
});

/**
 * POST /api/production-batches - Create new production batch
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = ProductionBatchCreateSchema.parse(body);

    // Verify recipe if provided
    if (validated.recipeId) {
      const recipe = await prisma.recipe.findFirst({
        where: {
          id: validated.recipeId,
          tenantId,
          isActive: true,
        },
      });

      if (!recipe) {
        return apiError('Recipe not found or inactive', 404);
      }
    }

    // Verify supervisor if provided
    if (validated.supervisorId) {
      const supervisor = await prisma.user.findFirst({
        where: {
          id: validated.supervisorId,
          tenantId,
        },
      });

      if (!supervisor) {
        return apiError('Supervisor not found', 404);
      }
    }

    // Generate batch number
    const count = await prisma.productionBatch.count({ where: { tenantId } });
    const batchNumber = `BATCH-${String(count + 1).padStart(6, '0')}`;

    const batch = await prisma.productionBatch.create({
      data: {
        batchNumber,
        recipeId: validated.recipeId,
        plannedQuantity: validated.plannedQuantity,
        unit: validated.unit,
        status: 'PLANNED',
        startDate: new Date(validated.startDate),
        supervisorId: validated.supervisorId,
        notes: validated.notes,
        tenantId,
      },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            yieldQuantity: true,
            yieldUnit: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Production batch created successfully',
      batch,
    }, 201);
  } catch (error: any) {
    console.error('Error creating production batch:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create production batch', 500);
  }
});
