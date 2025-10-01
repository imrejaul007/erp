import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createProductionBatchSchema = z.object({
  recipeId: z.string().optional(),
  plannedQuantity: z.number().min(0.01, 'Planned quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  startDate: z.string().transform(str => new Date(str)),
  notes: z.string().optional(),
  inputs: z.array(z.object({
    materialId: z.string(),
    plannedQuantity: z.number().min(0, 'Planned quantity must be positive'),
    actualQuantity: z.number().optional(),
    unit: z.string(),
    costPerUnit: z.number().min(0, 'Cost per unit must be positive'),
    notes: z.string().optional()
  })).optional()
});

const updateProductionBatchSchema = z.object({
  plannedQuantity: z.number().min(0.01).optional(),
  actualQuantity: z.number().min(0).optional(),
  unit: z.string().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'AGING', 'COMPLETED', 'CANCELLED', 'ON_HOLD']).optional(),
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
  agingStartDate: z.string().transform(str => new Date(str)).optional(),
  agingEndDate: z.string().transform(str => new Date(str)).optional(),
  agingDays: z.number().min(0).optional(),
  notes: z.string().optional()
});

// Generate batch number
function generateBatchNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const time = now.toTimeString().slice(0, 5).replace(':', '');
  return `B${year}${month}${day}${time}`;
}

// GET /api/production/batches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const recipeId = searchParams.get('recipeId');
    const search = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const skip = (page - 1) * limit;

    // Build filters
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (recipeId) {
      where.recipeId = recipeId;
    }

    if (search) {
      where.OR = [
        { batchNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { recipe: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (dateFrom || dateTo) {
      where.startDate = {};
      if (dateFrom) where.startDate.gte = new Date(dateFrom);
      if (dateTo) where.startDate.lte = new Date(dateTo);
    }

    // Get total count
    const total = await prisma.productionBatch.count({ where });

    // Get batches with related data
    const batches = await prisma.productionBatch.findMany({
      where,
      skip,
      take: limit,
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            category: true,
            yieldQuantity: true,
            yieldUnit: true
          }
        },
        inputs: {
          include: {
            material: {
              select: {
                id: true,
                name: true,
                sku: true,
                unitOfMeasure: true,
                currentStock: true
              }
            }
          }
        },
        outputs: {
          include: {
            material: {
              select: {
                id: true,
                name: true,
                sku: true,
                unitOfMeasure: true
              }
            }
          }
        },
        qualityControls: {
          orderBy: { testDate: 'desc' },
          take: 3
        },
        wastageRecords: {
          orderBy: { recordedAt: 'desc' }
        }
      },
      orderBy: [
        { status: 'asc' }, // Show active batches first
        { createdAt: 'desc' }
      ]
    });

    // Calculate batch statistics
    const batchesWithStats = batches.map(batch => {
      const totalInputCost = batch.inputs.reduce((sum, input) => sum + input.totalCost, 0);
      const totalOutputValue = batch.outputs.reduce((sum, output) => sum + output.totalCost, 0);
      const totalWastageCost = batch.wastageRecords.reduce((sum, record) => sum + record.cost, 0);

      const yieldPercentage = batch.plannedQuantity > 0 && batch.actualQuantity
        ? (batch.actualQuantity / batch.plannedQuantity) * 100
        : 0;

      const profitLoss = totalOutputValue - totalInputCost - totalWastageCost;

      const lastQC = batch.qualityControls[0];

      return {
        ...batch,
        stats: {
          totalInputCost,
          totalOutputValue,
          totalWastageCost,
          yieldPercentage,
          profitLoss,
          lastQCResult: lastQC?.result,
          lastQCDate: lastQC?.testDate
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        batches: batchesWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching production batches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch production batches' },
      { status: 500 }
    );
  }
}

// POST /api/production/batches
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createProductionBatchSchema.parse(body);

    // Verify recipe exists if provided
    if (validatedData.recipeId) {
      const recipe = await prisma.recipe.findUnique({
        where: { id: validatedData.recipeId }
      });

      if (!recipe) {
        return NextResponse.json(
          { success: false, error: 'Recipe not found' },
          { status: 404 }
        );
      }
    }

    // Verify materials exist if inputs provided
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

      // Check material availability
      const insufficientMaterials = validatedData.inputs.filter(input => {
        const material = materials.find(m => m.id === input.materialId);
        return material && material.currentStock < input.plannedQuantity;
      });

      if (insufficientMaterials.length > 0) {
        const materialNames = insufficientMaterials.map(input => {
          const material = materials.find(m => m.id === input.materialId);
          return material?.name;
        });

        return NextResponse.json(
          {
            success: false,
            error: 'Insufficient stock for materials',
            details: {
              insufficientMaterials: materialNames
            }
          },
          { status: 400 }
        );
      }
    }

    // Generate unique batch number
    let batchNumber = generateBatchNumber();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.productionBatch.findUnique({
        where: { batchNumber }
      });
      if (!existing) break;
      batchNumber = generateBatchNumber();
      attempts++;
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique batch number' },
        { status: 500 }
      );
    }

    // Create production batch with inputs in transaction
    const batch = await prisma.$transaction(async (tx) => {
      const newBatch = await tx.productionBatch.create({
        data: {
          batchNumber,
          recipeId: validatedData.recipeId,
          plannedQuantity: validatedData.plannedQuantity,
          unit: validatedData.unit,
          status: 'PLANNED',
          startDate: validatedData.startDate,
          notes: validatedData.notes,
          inputs: validatedData.inputs ? {
            create: validatedData.inputs.map(input => ({
              materialId: input.materialId,
              plannedQuantity: input.plannedQuantity,
              actualQuantity: input.actualQuantity,
              unit: input.unit,
              costPerUnit: input.costPerUnit,
              totalCost: input.plannedQuantity * input.costPerUnit,
              notes: input.notes
            }))
          } : undefined
        },
        include: {
          recipe: {
            select: {
              id: true,
              name: true,
              category: true,
              yieldQuantity: true,
              yieldUnit: true
            }
          },
          inputs: {
            include: {
              material: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  unitOfMeasure: true,
                  currentStock: true
                }
              }
            }
          }
        }
      });

      return newBatch;
    });

    return NextResponse.json({
      success: true,
      data: batch,
      message: 'Production batch created successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating production batch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create production batch' },
      { status: 500 }
    );
  }
}

// PUT /api/production/batches
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    const validatedData = updateProductionBatchSchema.parse(updateData);

    // Check if batch exists
    const existingBatch = await prisma.productionBatch.findUnique({
      where: { id }
    });

    if (!existingBatch) {
      return NextResponse.json(
        { success: false, error: 'Production batch not found' },
        { status: 404 }
      );
    }

    // Update batch
    const updatedBatch = await prisma.productionBatch.update({
      where: { id },
      data: validatedData,
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            category: true,
            yieldQuantity: true,
            yieldUnit: true
          }
        },
        inputs: {
          include: {
            material: {
              select: {
                id: true,
                name: true,
                sku: true,
                unitOfMeasure: true,
                currentStock: true
              }
            }
          }
        },
        outputs: {
          include: {
            material: {
              select: {
                id: true,
                name: true,
                sku: true,
                unitOfMeasure: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedBatch,
      message: 'Production batch updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating production batch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update production batch' },
      { status: 500 }
    );
  }
}