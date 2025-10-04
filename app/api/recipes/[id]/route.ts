import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const BlendingRecipeUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  targetQuantity: z.number().min(0).optional(),
  targetUnit: z.string().min(1).optional(),
  status: z.enum(['DRAFT', 'TESTING', 'APPROVED', 'ARCHIVED']).optional(),
  productionInstructions: z.string().optional(),
  qualityNotes: z.string().optional(),
  targetCost: z.number().min(0).optional(),
  targetSellingPrice: z.number().min(0).optional(),
});

// GET - Get single recipe
export const GET = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    const recipe = await prisma.blendingRecipe.findFirst({
      where: {
        id,
        tenantId,
      },
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
        versions: {
          select: {
            id: true,
            name: true,
            code: true,
            version: true,
            status: true,
            createdAt: true,
          },
          orderBy: { version: 'desc' },
        },
      },
    });

    if (!recipe) {
      return apiError('Recipe not found', 404);
    }

    return apiResponse({ recipe });
  } catch (error: any) {
    console.error('Error fetching recipe:', error);
    return apiError(error.message || 'Failed to fetch recipe', 500);
  }
});

// PATCH - Update recipe
export const PATCH = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const body = await req.json();
    const validated = BlendingRecipeUpdateSchema.parse(body);

    // Verify recipe exists and belongs to tenant
    const existingRecipe = await prisma.blendingRecipe.findFirst({
      where: { id, tenantId },
      include: { ingredients: true },
    });

    if (!existingRecipe) {
      return apiError('Recipe not found', 404);
    }

    // Recalculate profit margin if selling price is updated
    let updateData: any = { ...validated };

    if (validated.targetSellingPrice !== undefined) {
      const actualCost = Number(existingRecipe.actualCost || 0);
      updateData.profitMargin = validated.targetSellingPrice - actualCost;
    }

    const recipe = await prisma.blendingRecipe.update({
      where: { id },
      data: updateData,
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
        versions: {
          select: {
            id: true,
            name: true,
            code: true,
            version: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    return apiResponse({ recipe });
  } catch (error: any) {
    console.error('Error updating recipe:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update recipe', 500);
  }
});

// DELETE - Delete recipe
export const DELETE = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    // Verify recipe exists and belongs to tenant
    const existingRecipe = await prisma.blendingRecipe.findFirst({
      where: { id, tenantId },
    });

    if (!existingRecipe) {
      return apiError('Recipe not found', 404);
    }

    // Delete recipe and related ingredients (cascade)
    await prisma.blendingRecipe.delete({
      where: { id },
    });

    return apiResponse({ message: 'Recipe deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting recipe:', error);
    return apiError(error.message || 'Failed to delete recipe', 500);
  }
});
