import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const RecipeVersionCreateSchema = z.object({
  name: z.string().min(1, 'Recipe name is required'),
  description: z.string().optional(),
  productionInstructions: z.string().optional(),
  qualityNotes: z.string().optional(),
  targetCost: z.number().min(0).optional(),
  targetSellingPrice: z.number().min(0).optional(),
  ingredients: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.number().min(0, 'Quantity must be positive'),
    unit: z.string().min(1, 'Unit is required'),
    percentage: z.number().min(0).max(100, 'Percentage must be between 0-100'),
    notes: z.string().optional(),
  })).optional(),
});

// POST - Create new version of a recipe
export const POST = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id: parentRecipeId } = context.params;
    const body = await req.json();
    const validated = RecipeVersionCreateSchema.parse(body);

    // Verify parent recipe exists and belongs to tenant
    const parentRecipe = await prisma.blendingRecipe.findFirst({
      where: { id: parentRecipeId, tenantId },
      include: { ingredients: true },
    });

    if (!parentRecipe) {
      return apiError('Parent recipe not found', 404);
    }

    // Create new version with ingredients in transaction
    const newVersion = await prisma.$transaction(async (tx) => {
      // Calculate next version number
      const latestVersion = await tx.blendingRecipe.findFirst({
        where: {
          OR: [
            { id: parentRecipeId },
            { parentRecipeId: parentRecipeId },
          ],
          tenantId,
        },
        orderBy: { version: 'desc' },
        select: { version: true },
      });

      const nextVersion = (latestVersion?.version || 0) + 1;

      // Create new recipe version
      const newRecipe = await tx.blendingRecipe.create({
        data: {
          name: validated.name,
          code: parentRecipe.code, // Keep same code for versions
          description: validated.description,
          targetQuantity: parentRecipe.targetQuantity,
          targetUnit: parentRecipe.targetUnit,
          version: nextVersion,
          status: 'DRAFT', // New versions start as DRAFT
          productionInstructions: validated.productionInstructions,
          qualityNotes: validated.qualityNotes,
          targetCost: validated.targetCost || 0,
          targetSellingPrice: validated.targetSellingPrice || 0,
          parentRecipeId: parentRecipeId,
          tenantId,
        },
      });

      // Create ingredients if provided, or copy from parent if not
      let ingredientsToCreate = validated.ingredients || [];

      if (ingredientsToCreate.length === 0) {
        // Copy ingredients from parent recipe
        ingredientsToCreate = parentRecipe.ingredients.map((ing: any) => ({
          productId: ing.productId,
          quantity: Number(ing.quantity),
          unit: ing.unit,
          percentage: Number(ing.percentage),
          notes: ing.notes,
        }));
      }

      let calculatedCost = 0;

      for (const ingredient of ingredientsToCreate) {
        // Get product unit price
        const product = await tx.product.findUnique({
          where: { id: ingredient.productId },
          select: { unitPrice: true },
        });

        const ingredientCost = product ? Number(product.unitPrice) * ingredient.quantity : 0;
        calculatedCost += ingredientCost;

        await tx.blendingIngredient.create({
          data: {
            recipeId: newRecipe.id,
            productId: ingredient.productId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            percentage: ingredient.percentage,
            cost: ingredientCost,
            notes: ingredient.notes,
            tenantId,
          },
        });
      }

      // Update recipe with calculated cost
      await tx.blendingRecipe.update({
        where: { id: newRecipe.id },
        data: {
          actualCost: calculatedCost,
          profitMargin: (validated.targetSellingPrice || 0) - calculatedCost,
        },
      });

      return tx.blendingRecipe.findUnique({
        where: { id: newRecipe.id },
        include: {
          ingredients: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  unitPrice: true,
                },
              },
            },
          },
          parentRecipe: {
            select: {
              id: true,
              name: true,
              code: true,
              version: true,
            },
          },
        },
      });
    });

    return apiResponse({ recipe: newVersion }, 201);
  } catch (error: any) {
    console.error('Error creating recipe version:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create recipe version', 500);
  }
});
