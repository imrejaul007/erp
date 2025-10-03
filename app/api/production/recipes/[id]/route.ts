import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// GET /api/production/recipes/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(async (req, { tenantId, user }) => {
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
            where: {
              isActive: true,
              recipe: { tenantId }
            },
            include: {
              items: {
                include: {
                  material: true
                }
              }
            }
          },
          productionBatches: {
            where: {
              recipe: { tenantId }
            },
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
        return apiError('Recipe not found', 404);
      }

      // Verify recipe belongs to tenant
      if (recipe.tenantId !== tenantId) {
        return apiError('Recipe does not belong to your tenant', 403);
      }

      // Calculate costs
      const totalCost = recipe.ingredients.reduce((sum, ingredient) => {
        return sum + (ingredient.quantity * ingredient.material.costPerUnit);
      }, 0);

      const costPerUnit = recipe.yieldQuantity > 0 ? totalCost / recipe.yieldQuantity : 0;

      return apiResponse({
        success: true,
        data: {
          ...recipe,
          totalCost,
          costPerUnit
        }
      });

    } catch (error) {
      console.error('Error fetching recipe:', error);
      return apiError('Failed to fetch recipe', 500);
    }
  })(request);
}

// DELETE /api/production/recipes/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(async (req, { tenantId, user }) => {
    try {
      const { id } = params;

      // Check if recipe exists and belongs to tenant
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
        return apiError('Recipe not found', 404);
      }

      // Verify recipe belongs to tenant
      if (recipe.tenantId !== tenantId) {
        return apiError('Recipe does not belong to your tenant', 403);
      }

      // Check if recipe is being used
      if (recipe._count.boms > 0 || recipe._count.productionBatches > 0) {
        return apiError(
          `Cannot delete recipe that is being used in BOMs (${recipe._count.boms}) or production batches (${recipe._count.productionBatches})`,
          409
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

      return apiResponse({
        success: true,
        message: 'Recipe deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting recipe:', error);
      return apiError('Failed to delete recipe', 500);
    }
  })(request);
}
