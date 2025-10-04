import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schema for creating a blending recipe
const BlendingRecipeCreateSchema = z.object({
  name: z.string().min(1, 'Recipe name is required'),
  code: z.string().min(1, 'Recipe code is required'),
  description: z.string().optional(),
  targetQuantity: z.number().min(0, 'Target quantity must be positive'),
  targetUnit: z.string().min(1, 'Target unit is required'),
  status: z.enum(['DRAFT', 'TESTING', 'APPROVED', 'ARCHIVED']).optional().default('DRAFT'),
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

// GET - List all blending recipes
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const whereClause: any = { tenantId };

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const recipes = await prisma.blendingRecipe.findMany({
      where: whereClause,
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
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ recipes });
  } catch (error: any) {
    console.error('Error fetching blending recipes:', error);
    return apiError(error.message || 'Failed to fetch recipes', 500);
  }
});

// POST - Create new blending recipe
export const POST = withTenant(async (req, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = BlendingRecipeCreateSchema.parse(body);

    const {
      name,
      code,
      description,
      targetQuantity,
      targetUnit,
      status,
      productionInstructions,
      qualityNotes,
      targetCost,
      targetSellingPrice,
      ingredients,
    } = validated;

    // Check if recipe code already exists for this tenant
    const existingRecipe = await prisma.blendingRecipe.findFirst({
      where: { code, tenantId },
    });

    if (existingRecipe) {
      return apiError('Recipe code already exists', 400);
    }

    // Create recipe with ingredients in transaction
    const recipe = await prisma.$transaction(async (tx) => {
      // Calculate version number (if it's a new recipe, version is 1)
      const version = 1;

      const newRecipe = await tx.blendingRecipe.create({
        data: {
          name,
          code,
          description,
          targetQuantity,
          targetUnit,
          version,
          status: status || 'DRAFT',
          productionInstructions,
          qualityNotes,
          targetCost: targetCost || 0,
          targetSellingPrice: targetSellingPrice || 0,
          tenantId,
        },
      });

      // Create ingredients if provided
      if (ingredients && ingredients.length > 0) {
        let calculatedCost = 0;

        for (const ingredient of ingredients) {
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
            profitMargin: (targetSellingPrice || 0) - calculatedCost,
          },
        });
      }

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
        },
      });
    });

    return apiResponse({ recipe }, 201);
  } catch (error: any) {
    console.error('Error creating blending recipe:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create recipe', 500);
  }
});
