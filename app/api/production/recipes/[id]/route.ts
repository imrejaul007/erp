import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/production/recipes/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            material: {
              include: {
                category: true
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        versions: {
          orderBy: { createdAt: 'desc' }
        },
        boms: {
          where: { isActive: true },
          include: {
            items: {
              include: {
                material: true
              }
            }
          }
        },
        productionBatches: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
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
        }
      }
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Calculate costs
    const totalCost = recipe.ingredients.reduce((sum, ingredient) => {
      return sum + (ingredient.quantity * ingredient.material.costPerUnit);
    }, 0);

    const costPerUnit = recipe.yieldQuantity > 0 ? totalCost / recipe.yieldQuantity : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...recipe,
        totalCost,
        costPerUnit
      }
    });

  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}

// DELETE /api/production/recipes/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            boms: true,
            productionBatches: true
          }
        }
      }
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check if recipe is being used
    if (recipe._count.boms > 0 || recipe._count.productionBatches > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete recipe that is being used in BOMs or production batches',
          details: {
            boms: recipe._count.boms,
            batches: recipe._count.productionBatches
          }
        },
        { status: 409 }
      );
    }

    // Delete recipe and related data in transaction
    await prisma.$transaction(async (tx) => {
      // Delete ingredients
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: id }
      });

      // Delete versions
      await tx.recipeVersion.deleteMany({
        where: { recipeId: id }
      });

      // Delete recipe
      await tx.recipe.delete({
        where: { id }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Recipe deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}