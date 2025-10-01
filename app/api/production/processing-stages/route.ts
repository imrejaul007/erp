import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stages'; // 'stages', 'flows', or 'batches'

    if (type === 'flows') {
      const flows = await prisma.processingFlow.findMany({
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

      return NextResponse.json({
        success: true,
        data: { flows }
      });
    }

    if (type === 'batches') {
      const status = searchParams.get('status');
      const flowId = searchParams.get('flowId');

      const where: any = {};
      if (status) where.status = status;
      if (flowId) where.flowId = flowId;

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

      return NextResponse.json({
        success: true,
        data: { batches }
      });
    }

    // Default: return stages
    const stages = await prisma.processingStage.findMany({
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

    return NextResponse.json({
      success: true,
      data: { stages }
    });

  } catch (error) {
    console.error('Error fetching processing data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch processing data' },
      { status: 500 }
    );
  }
}

// POST /api/production/processing-stages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'stage') {
      const validatedData = createProcessingStageSchema.parse(data);

      // Check if order is already taken
      const existingStage = await prisma.processingStage.findFirst({
        where: { order: validatedData.order }
      });

      if (existingStage) {
        // Shift existing stages to make room
        await prisma.processingStage.updateMany({
          where: { order: { gte: validatedData.order } },
          data: { order: { increment: 1 } }
        });
      }

      const stage = await prisma.processingStage.create({
        data: validatedData
      });

      return NextResponse.json({
        success: true,
        data: stage,
        message: 'Processing stage created successfully'
      });
    }

    if (type === 'flow') {
      const validatedData = createProcessingFlowSchema.parse(data);

      // Verify all stages exist
      const stageIds = validatedData.stages.map(s => s.stageId);
      const stages = await prisma.processingStage.findMany({
        where: { id: { in: stageIds } }
      });

      if (stages.length !== stageIds.length) {
        return NextResponse.json(
          { success: false, error: 'One or more stages not found' },
          { status: 400 }
        );
      }

      const flow = await prisma.processingFlow.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          isActive: validatedData.isActive,
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

      return NextResponse.json({
        success: true,
        data: flow,
        message: 'Processing flow created successfully'
      });
    }

    if (type === 'batch') {
      const validatedData = createProcessingBatchSchema.parse(data);

      // Verify flow exists and get first stage
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
        return NextResponse.json(
          { success: false, error: 'Processing flow not found' },
          { status: 404 }
        );
      }

      if (flow.stages.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Processing flow has no stages' },
          { status: 400 }
        );
      }

      // Verify materials if inputs provided
      if (validatedData.inputs && validatedData.inputs.length > 0) {
        const materialIds = validatedData.inputs.map(input => input.materialId);
        const materials = await prisma.material.findMany({
          where: { id: { in: materialIds } }
        });

        if (materials.length !== materialIds.length) {
          return NextResponse.json(
            { success: false, error: 'One or more materials not found' },
            { status: 400 }
          );
        }
      }

      const batch = await prisma.processingBatch.create({
        data: {
          flowId: validatedData.flowId,
          currentStageId: flow.stages[0].stageId,
          status: 'PENDING',
          startDate: validatedData.startDate,
          notes: validatedData.notes,
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

      return NextResponse.json({
        success: true,
        data: batch,
        message: 'Processing batch created successfully'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type specified' },
      { status: 400 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating processing data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create processing data' },
      { status: 500 }
    );
  }
}

// PUT /api/production/processing-stages
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, action, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
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
        return NextResponse.json(
          { success: false, error: 'Processing batch not found' },
          { status: 404 }
        );
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
          return NextResponse.json(
            { success: false, error: 'Invalid action' },
            { status: 400 }
          );
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

      return NextResponse.json({
        success: true,
        data: updatedBatch,
        message: `Processing batch ${action} successfully`
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type or action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating processing data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update processing data' },
      { status: 500 }
    );
  }
}