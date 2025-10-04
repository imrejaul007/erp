import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const IngredientCreateSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  percentage: z.number().min(0).max(100, 'Percentage must be between 0-100'),
  notes: z.string().optional(),
});

const IngredientUpdateSchema = z.object({
  quantity: z.number().min(0).optional(),
  unit: z.string().min(1).optional(),
  percentage: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

// GET - Get all ingredients for a recipe
export const GET = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id: recipeId } = context.params;

    // Verify recipe exists and belongs to tenant
    const recipe = await prisma.blendingRecipe.findFirst({
      where: { id: recipeId, tenantId },
    });

    if (!recipe) {
      return apiError('Recipe not found', 404);
    }

    const ingredients = await prisma.blendingIngredient.findMany({
      where: { recipeId, tenantId },
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
      orderBy: { createdAt: 'asc' },
    });

    return apiResponse({ ingredients });
  } catch (error: any) {
    console.error('Error fetching ingredients:', error);
    return apiError(error.message || 'Failed to fetch ingredients', 500);
  }
});

// POST - Add ingredient to recipe
export const POST = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id: recipeId } = context.params;
    const body = await req.json();
    const validated = IngredientCreateSchema.parse(body);

    // Verify recipe exists and belongs to tenant
    const recipe = await prisma.blendingRecipe.findFirst({
      where: { id: recipeId, tenantId },
      include: { ingredients: true },
    });

    if (!recipe) {
      return apiError('Recipe not found', 404);
    }

    // Create ingredient and update recipe cost in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get product unit price
      const product = await tx.product.findUnique({
        where: { id: validated.productId },
        select: { unitPrice: true },
      });

      const ingredientCost = product ? Number(product.unitPrice) * validated.quantity : 0;

      // Create ingredient
      const newIngredient = await tx.blendingIngredient.create({
        data: {
          recipeId,
          productId: validated.productId,
          quantity: validated.quantity,
          unit: validated.unit,
          percentage: validated.percentage,
          cost: ingredientCost,
          notes: validated.notes,
          tenantId,
        },
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
      });

      // Recalculate total recipe cost
      const allIngredients = await tx.blendingIngredient.findMany({
        where: { recipeId, tenantId },
      });

      const totalCost = allIngredients.reduce((sum, ing) => sum + Number(ing.cost || 0), 0);

      // Update recipe with new cost
      await tx.blendingRecipe.update({
        where: { id: recipeId },
        data: {
          actualCost: totalCost,
          profitMargin: Number(recipe.targetSellingPrice || 0) - totalCost,
        },
      });

      return newIngredient;
    });

    return apiResponse({ ingredient: result }, 201);
  } catch (error: any) {
    console.error('Error adding ingredient:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to add ingredient', 500);
  }
});

// PATCH - Update ingredient
export const PATCH = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const url = new URL(req.url);
    const ingredientId = url.searchParams.get('ingredientId');

    if (!ingredientId) {
      return apiError('Ingredient ID is required', 400);
    }

    const body = await req.json();
    const validated = IngredientUpdateSchema.parse(body);

    // Verify ingredient exists and belongs to tenant
    const existingIngredient = await prisma.blendingIngredient.findFirst({
      where: { id: ingredientId, tenantId },
      include: { product: true, recipe: true },
    });

    if (!existingIngredient) {
      return apiError('Ingredient not found', 404);
    }

    // Update ingredient and recalculate recipe cost in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Calculate new cost if quantity changed
      let newCost = Number(existingIngredient.cost);
      if (validated.quantity !== undefined) {
        newCost = Number(existingIngredient.product.unitPrice) * validated.quantity;
      }

      // Update ingredient
      const updatedIngredient = await tx.blendingIngredient.update({
        where: { id: ingredientId },
        data: {
          ...validated,
          cost: newCost,
        },
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
      });

      // Recalculate total recipe cost
      const allIngredients = await tx.blendingIngredient.findMany({
        where: { recipeId: existingIngredient.recipeId, tenantId },
      });

      const totalCost = allIngredients.reduce((sum, ing) => {
        if (ing.id === ingredientId) {
          return sum + newCost;
        }
        return sum + Number(ing.cost || 0);
      }, 0);

      // Update recipe with new cost
      await tx.blendingRecipe.update({
        where: { id: existingIngredient.recipeId },
        data: {
          actualCost: totalCost,
          profitMargin: Number(existingIngredient.recipe.targetSellingPrice || 0) - totalCost,
        },
      });

      return updatedIngredient;
    });

    return apiResponse({ ingredient: result });
  } catch (error: any) {
    console.error('Error updating ingredient:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update ingredient', 500);
  }
});

// DELETE - Remove ingredient from recipe
export const DELETE = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const url = new URL(req.url);
    const ingredientId = url.searchParams.get('ingredientId');

    if (!ingredientId) {
      return apiError('Ingredient ID is required', 400);
    }

    // Verify ingredient exists and belongs to tenant
    const existingIngredient = await prisma.blendingIngredient.findFirst({
      where: { id: ingredientId, tenantId },
      include: { recipe: true },
    });

    if (!existingIngredient) {
      return apiError('Ingredient not found', 404);
    }

    // Delete ingredient and update recipe cost in transaction
    await prisma.$transaction(async (tx) => {
      // Delete ingredient
      await tx.blendingIngredient.delete({
        where: { id: ingredientId },
      });

      // Recalculate total recipe cost
      const remainingIngredients = await tx.blendingIngredient.findMany({
        where: { recipeId: existingIngredient.recipeId, tenantId },
      });

      const totalCost = remainingIngredients.reduce((sum, ing) => sum + Number(ing.cost || 0), 0);

      // Update recipe with new cost
      await tx.blendingRecipe.update({
        where: { id: existingIngredient.recipeId },
        data: {
          actualCost: totalCost,
          profitMargin: Number(existingIngredient.recipe.targetSellingPrice || 0) - totalCost,
        },
      });
    });

    return apiResponse({ message: 'Ingredient removed successfully' });
  } catch (error: any) {
    console.error('Error removing ingredient:', error);
    return apiError(error.message || 'Failed to remove ingredient', 500);
  }
});
