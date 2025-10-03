import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

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
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const recipeId = searchParams.get('recipeId');
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;

    // Build filters with tenantId
    const where: any = { tenantId };

    if (recipeId) {
      // Verify recipe belongs to tenant
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId }
      });
      if (!recipe || recipe.tenantId !== tenantId) {
        return apiError('Recipe not found or does not belong to your tenant', 403);
      }
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

    return apiResponse({
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
    return apiError('Failed to fetch BOMs', 500);
  }
});

// POST /api/production/bom
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const validatedData = createBOMSchema.parse(body);

    // Check if recipe exists and belongs to tenant
    const recipe = await prisma.recipe.findUnique({
      where: { id: validatedData.recipeId }
    });

    if (!recipe) {
      return apiError('Recipe not found', 404);
    }

    if (recipe.tenantId !== tenantId) {
      return apiError('Recipe does not belong to your tenant', 403);
    }

    // Verify all materials exist and belong to tenant
    const materialIds = validatedData.items.map(item => item.materialId);
    const materials = await prisma.material.findMany({
      where: {
        id: { in: materialIds },
        tenantId
      }
    });

    if (materials.length !== materialIds.length) {
      return apiError('One or more materials not found or do not belong to your tenant', 400);
    }

    // Calculate total cost
    const totalCost = validatedData.items.reduce((sum, item) => sum + item.totalCost, 0);

    // Deactivate other BOMs for the same recipe if this is set as active
    const existingActiveBOM = await prisma.bom.findFirst({
      where: {
        recipeId: validatedData.recipeId,
        isActive: true,
        tenantId
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
          isActive: true,
          tenantId,
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

    return apiResponse({
      success: true,
      data: bom,
      message: 'BOM created successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error creating BOM:', error);
    return apiError('Failed to create BOM', 500);
  }
});

// PUT /api/production/bom
export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return apiError('BOM ID is required', 400);
    }

    const validatedData = updateBOMSchema.parse(updateData);

    // Check if BOM exists and belongs to tenant
    const existingBOM = await prisma.bom.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!existingBOM) {
      return apiError('BOM not found', 404);
    }

    if (existingBOM.tenantId !== tenantId) {
      return apiError('BOM does not belong to your tenant', 403);
    }

    // Update BOM in transaction
    const updatedBOM = await prisma.$transaction(async (tx) => {
      // If items are being updated, replace them
      if (validatedData.items) {
        // Verify all materials exist and belong to tenant
        const materialIds = validatedData.items.map(item => item.materialId);
        const materials = await tx.material.findMany({
          where: {
            id: { in: materialIds },
            tenantId
          }
        });

        if (materials.length !== materialIds.length) {
          throw new Error('One or more materials not found or do not belong to your tenant');
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
          id: { not: id },
          tenantId
        },
        data: { isActive: false }
      });
    }

    return apiResponse({
      success: true,
      data: updatedBOM,
      message: 'BOM updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error updating BOM:', error);
    return apiError(error instanceof Error ? error.message : 'Failed to update BOM', 500);
  }
});
