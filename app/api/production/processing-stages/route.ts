import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// Validation schemas
const createProcessingStageSchema = z.object({
  name: z.string().min(1, 'Stage name is required'),
  description: z.string().optional(),
  order: z.number().min(0, 'Order must be non-negative'),
  duration: z.number().min(0, 'Duration must be positive').optional(),
  temperature: z.number().optional(),
  instructions: z.string().optional()
});

const createProcessingFlowSchema = z.object({
  name: z.string().min(1, 'Flow name is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  stages: z.array(z.object({
    stageId: z.string(),
    order: z.number().min(0),
    isRequired: z.boolean().default(true)
  }))
});

const createProcessingBatchSchema = z.object({
  flowId: z.string(),
  startDate: z.string().transform(str => new Date(str)),
  notes: z.string().optional(),
  inputs: z.array(z.object({
    materialId: z.string(),
    quantity: z.number().min(0, 'Quantity must be positive'),
    unit: z.string(),
    notes: z.string().optional()
  })).optional()
});

// GET /api/production/processing-stages
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stages'; // 'stages', 'flows', or 'batches'

    if (type === 'flows') {
      const flows = await prisma.processingFlow.findMany({
        where: { tenantId },
        include: {
          stages: {
            include: {
              stage: true
            },
            orderBy: { order: 'asc' }
          },
          batches: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        },
        orderBy: [
          { isActive: 'desc' },
          { name: 'asc' }
        ]
      });

      return apiResponse({
        success: true,
        data: { flows }
      });
    }

    if (type === 'batches') {
      const status = searchParams.get('status');
      const flowId = searchParams.get('flowId');

      const where: any = { tenantId };
      if (status) where.status = status;
      if (flowId) {
        // Verify flow belongs to tenant
        const flow = await prisma.processingFlow.findUnique({
          where: { id: flowId }
        });
        if (!flow || flow.tenantId !== tenantId) {
          return apiError('Flow not found or does not belong to your tenant', 403);
        }
        where.flowId = flowId;
      }

      const batches = await prisma.processingBatch.findMany({
        where,
        include: {
          flow: {
            include: {
              stages: {
                include: {
                  stage: true
                },
                orderBy: { order: 'asc' }
              }
            }
          },
          currentStage: true,
          inputs: {
            include: {
              material: true
            }
          },
          outputs: {
            include: {
              material: true
            }
          }
        },
        orderBy: [
          { status: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      return apiResponse({
        success: true,
        data: { batches }
      });
    }

    // Default: return stages
    const stages = await prisma.processingStage.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: {
            flows: true,
            batches: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return apiResponse({
      success: true,
      data: { stages }
    });

  } catch (error) {
    console.error('Error fetching processing data:', error);
    return apiError('Failed to fetch processing data', 500);
  }
});

// POST /api/production/processing-stages
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'stage') {
      const validatedData = createProcessingStageSchema.parse(data);

      // Check if order is already taken within tenant
      const existingStage = await prisma.processingStage.findFirst({
        where: {
          order: validatedData.order,
          tenantId
        }
      });

      if (existingStage) {
        // Shift existing stages to make room
        await prisma.processingStage.updateMany({
          where: {
            order: { gte: validatedData.order },
            tenantId
          },
          data: { order: { increment: 1 } }
        });
      }

      const stage = await prisma.processingStage.create({
        data: {
          ...validatedData,
          tenantId
        }
      });

      return apiResponse({
        success: true,
        data: stage,
        message: 'Processing stage created successfully'
      });
    }

    if (type === 'flow') {
      const validatedData = createProcessingFlowSchema.parse(data);

      // Verify all stages exist and belong to tenant
      const stageIds = validatedData.stages.map(s => s.stageId);
      const stages = await prisma.processingStage.findMany({
        where: {
          id: { in: stageIds },
          tenantId
        }
      });

      if (stages.length !== stageIds.length) {
        return apiError('One or more stages not found or do not belong to your tenant', 400);
      }

      const flow = await prisma.processingFlow.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          isActive: validatedData.isActive,
          tenantId,
          stages: {
            create: validatedData.stages.map(stage => ({
              stageId: stage.stageId,
              order: stage.order,
              isRequired: stage.isRequired
            }))
          }
        },
        include: {
          stages: {
            include: {
              stage: true
            },
            orderBy: { order: 'asc' }
          }
        }
      });

      return apiResponse({
        success: true,
        data: flow,
        message: 'Processing flow created successfully'
      });
    }

    if (type === 'batch') {
      const validatedData = createProcessingBatchSchema.parse(data);

      // Verify flow exists and belongs to tenant, get first stage
      const flow = await prisma.processingFlow.findUnique({
        where: { id: validatedData.flowId },
        include: {
          stages: {
            include: {
              stage: true
            },
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!flow) {
        return apiError('Processing flow not found', 404);
      }

      if (flow.tenantId !== tenantId) {
        return apiError('Processing flow does not belong to your tenant', 403);
      }

      if (flow.stages.length === 0) {
        return apiError('Processing flow has no stages', 400);
      }

      // Verify materials if inputs provided
      if (validatedData.inputs && validatedData.inputs.length > 0) {
        const materialIds = validatedData.inputs.map(input => input.materialId);
        const materials = await prisma.material.findMany({
          where: {
            id: { in: materialIds },
            tenantId
          }
        });

        if (materials.length !== materialIds.length) {
          return apiError('One or more materials not found or do not belong to your tenant', 400);
        }
      }

      const batch = await prisma.processingBatch.create({
        data: {
          flowId: validatedData.flowId,
          currentStageId: flow.stages[0].stageId,
          status: 'PENDING',
          startDate: validatedData.startDate,
          notes: validatedData.notes,
          tenantId,
          inputs: validatedData.inputs ? {
            create: validatedData.inputs.map(input => ({
              materialId: input.materialId,
              quantity: input.quantity,
              unit: input.unit,
              notes: input.notes
            }))
          } : undefined
        },
        include: {
          flow: {
            include: {
              stages: {
                include: {
                  stage: true
                },
                orderBy: { order: 'asc' }
              }
            }
          },
          currentStage: true,
          inputs: {
            include: {
              material: true
            }
          }
        }
      });

      return apiResponse({
        success: true,
        data: batch,
        message: 'Processing batch created successfully'
      });
    }

    return apiError('Invalid type specified', 400);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error creating processing data:', error);
    return apiError('Failed to create processing data', 500);
  }
});

// PUT /api/production/processing-stages
export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const { type, id, action, ...data } = body;

    if (!id) {
      return apiError('ID is required', 400);
    }

    if (type === 'batch' && action) {
      // Handle batch actions
      const batch = await prisma.processingBatch.findUnique({
        where: { id },
        include: {
          flow: {
            include: {
              stages: {
                include: {
                  stage: true
                },
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      if (!batch) {
        return apiError('Processing batch not found', 404);
      }

      if (batch.tenantId !== tenantId) {
        return apiError('Processing batch does not belong to your tenant', 403);
      }

      let updateData: any = {};

      switch (action) {
        case 'start':
          updateData = { status: 'IN_PROGRESS' };
          break;

        case 'pause':
          updateData = { status: 'PAUSED' };
          break;

        case 'resume':
          updateData = { status: 'IN_PROGRESS' };
          break;

        case 'next_stage':
          const currentStageIndex = batch.flow.stages.findIndex(
            s => s.stageId === batch.currentStageId
          );
          const nextStageIndex = currentStageIndex + 1;

          if (nextStageIndex >= batch.flow.stages.length) {
            updateData = {
              status: 'COMPLETED',
              endDate: new Date(),
              currentStageId: null
            };
          } else {
            updateData = {
              currentStageId: batch.flow.stages[nextStageIndex].stageId
            };
          }
          break;

        case 'complete':
          updateData = {
            status: 'COMPLETED',
            endDate: new Date()
          };
          break;

        case 'cancel':
          updateData = { status: 'CANCELLED' };
          break;

        default:
          return apiError('Invalid action', 400);
      }

      if (data.notes) {
        updateData.notes = data.notes;
      }

      const updatedBatch = await prisma.processingBatch.update({
        where: { id },
        data: updateData,
        include: {
          flow: {
            include: {
              stages: {
                include: {
                  stage: true
                },
                orderBy: { order: 'asc' }
              }
            }
          },
          currentStage: true,
          inputs: {
            include: {
              material: true
            }
          },
          outputs: {
            include: {
              material: true
            }
          }
        }
      });

      return apiResponse({
        success: true,
        data: updatedBatch,
        message: `Processing batch ${action} successfully`
      });
    }

    return apiError('Invalid type or action', 400);

  } catch (error) {
    console.error('Error updating processing data:', error);
    return apiError('Failed to update processing data', 500);
  }
});
