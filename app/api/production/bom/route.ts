import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createBOMSchema = z.object({
  recipeId: z.string(),
  name: z.string().min(1, 'BOM name is required'),
  version: z.string().default('1.0'),
  items: z.array(z.object({
    materialId: z.string(),
    quantity: z.number().min(0, 'Quantity must be positive'),
    unit: z.string(),
    unitCost: z.number().min(0, 'Unit cost must be positive'),
    totalCost: z.number().min(0, 'Total cost must be positive'),
    notes: z.string().optional()
  }))
});

const updateBOMSchema = createBOMSchema.partial().extend({
  isActive: z.boolean().optional()
});

// GET /api/production/bom
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const recipeId = searchParams.get('recipeId');
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;

    // Build filters
    const where: any = {};

    if (recipeId) {
      where.recipeId = recipeId;
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    // Get total count
    const total = await prisma.bom.count({ where });

    // Get BOMs with items and related data
    const boms = await prisma.bom.findMany({
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
        items: {
          include: {
            material: {
              include: {
                category: true
              }
            }
          },
          orderBy: { material: { name: 'asc' } }
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Calculate availability status for each BOM
    const bomsWithAvailability = boms.map(bom => {
      const availabilityStatus = bom.items.map(item => ({
        materialId: item.materialId,
        materialName: item.material.name,
        required: item.quantity,
        available: item.material.currentStock,
        sufficient: item.material.currentStock >= item.quantity
      }));

      const canProduce = availabilityStatus.every(status => status.sufficient);
      const insufficientItems = availabilityStatus.filter(status => !status.sufficient).length;

      return {
        ...bom,
        availabilityStatus,
        canProduce,
        insufficientItems
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        boms: bomsWithAvailability,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching BOMs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch BOMs' },
      { status: 500 }
    );
  }
}

// POST /api/production/bom
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createBOMSchema.parse(body);

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: validatedData.recipeId }
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Verify all materials exist
    const materialIds = validatedData.items.map(item => item.materialId);
    const materials = await prisma.material.findMany({
      where: { id: { in: materialIds } }
    });

    if (materials.length !== materialIds.length) {
      return NextResponse.json(
        { success: false, error: 'One or more materials not found' },
        { status: 400 }
      );
    }

    // Calculate total cost
    const totalCost = validatedData.items.reduce((sum, item) => sum + item.totalCost, 0);

    // Deactivate other BOMs for the same recipe if this is set as active
    const existingActiveBOM = await prisma.bom.findFirst({
      where: {
        recipeId: validatedData.recipeId,
        isActive: true
      }
    });

    // Create BOM with items in transaction
    const bom = await prisma.$transaction(async (tx) => {
      // If there's an existing active BOM, deactivate it
      if (existingActiveBOM) {
        await tx.bom.update({
          where: { id: existingActiveBOM.id },
          data: { isActive: false }
        });
      }

      return await tx.bom.create({
        data: {
          recipeId: validatedData.recipeId,
          name: validatedData.name,
          version: validatedData.version,
          totalCost,
          isActive: true, // New BOM is always active
          items: {
            create: validatedData.items.map(item => ({
              materialId: item.materialId,
              quantity: item.quantity,
              unit: item.unit,
              unitCost: item.unitCost,
              totalCost: item.totalCost,
              notes: item.notes
            }))
          }
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
          items: {
            include: {
              material: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      });
    });

    return NextResponse.json({
      success: true,
      data: bom,
      message: 'BOM created successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating BOM:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create BOM' },
      { status: 500 }
    );
  }
}

// PUT /api/production/bom
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'BOM ID is required' },
        { status: 400 }
      );
    }

    const validatedData = updateBOMSchema.parse(updateData);

    // Check if BOM exists
    const existingBOM = await prisma.bom.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!existingBOM) {
      return NextResponse.json(
        { success: false, error: 'BOM not found' },
        { status: 404 }
      );
    }

    // Update BOM in transaction
    const updatedBOM = await prisma.$transaction(async (tx) => {
      // If items are being updated, replace them
      if (validatedData.items) {
        // Verify all materials exist
        const materialIds = validatedData.items.map(item => item.materialId);
        const materials = await tx.material.findMany({
          where: { id: { in: materialIds } }
        });

        if (materials.length !== materialIds.length) {
          throw new Error('One or more materials not found');
        }

        // Calculate new total cost
        const totalCost = validatedData.items.reduce((sum, item) => sum + item.totalCost, 0);

        // Delete existing items
        await tx.bomItem.deleteMany({
          where: { bomId: id }
        });

        // Update BOM with new items
        return await tx.bom.update({
          where: { id },
          data: {
            ...validatedData,
            totalCost,
            items: {
              create: validatedData.items.map(item => ({
                materialId: item.materialId,
                quantity: item.quantity,
                unit: item.unit,
                unitCost: item.unitCost,
                totalCost: item.totalCost,
                notes: item.notes
              }))
            }
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
            items: {
              include: {
                material: {
                  include: {
                    category: true
                  }
                }
              }
            }
          }
        });
      } else {
        // Just update BOM metadata
        return await tx.bom.update({
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
            items: {
              include: {
                material: {
                  include: {
                    category: true
                  }
                }
              }
            }
          }
        });
      }
    });

    // If this BOM is being activated, deactivate others for the same recipe
    if (validatedData.isActive === true && existingBOM.recipeId) {
      await prisma.bom.updateMany({
        where: {
          recipeId: existingBOM.recipeId,
          id: { not: id }
        },
        data: { isActive: false }
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedBOM,
      message: 'BOM updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating BOM:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update BOM' },
      { status: 500 }
    );
  }
}