import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createRecipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  yieldQuantity: z.number().min(0, 'Yield quantity must be positive'),
  yieldUnit: z.string().min(1, 'Yield unit is required'),
  instructions: z.string().optional(),
  notes: z.string().optional(),
  ingredients: z.array(z.object({
    materialId: z.string(),
    quantity: z.number().min(0, 'Quantity must be positive'),
    unit: z.string(),
    percentage: z.number().optional(),
    isOptional: z.boolean().default(false),
    notes: z.string().optional(),
    order: z.number().default(0)
  }))
});

const updateRecipeSchema = createRecipeSchema.partial().omit({ ingredients: true }).extend({
  ingredients: z.array(z.object({
    id: z.string().optional(),
    materialId: z.string(),
    quantity: z.number().min(0),
    unit: z.string(),
    percentage: z.number().optional(),
    isOptional: z.boolean().default(false),
    notes: z.string().optional(),
    order: z.number().default(0)
  })).optional()
});

// GET /api/production/recipes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;

    // Build filters
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = category;
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    // Get total count for pagination
    const total = await prisma.recipe.count({ where });

    // Get recipes with ingredients and materials
    const recipes = await prisma.recipe.findMany({
      where,
      skip,
      take: limit,
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
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            boms: true,
            productionBatches: true
          }
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { updatedAt: 'desc' }
      ]
    });

    // Calculate recipe costs
    const recipesWithCosts = recipes.map(recipe => {
      const totalCost = recipe.ingredients.reduce((sum, ingredient) => {
        return sum + (ingredient.quantity * ingredient.material.costPerUnit);
      }, 0);

      const costPerUnit = recipe.yieldQuantity > 0 ? totalCost / recipe.yieldQuantity : 0;

      return {
        ...recipe,
        totalCost,
        costPerUnit
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        recipes: recipesWithCosts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

// POST /api/production/recipes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createRecipeSchema.parse(body);

    // Check if recipe name already exists
    const existingRecipe = await prisma.recipe.findFirst({
      where: { name: validatedData.name }
    });

    if (existingRecipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe name already exists' },
        { status: 400 }
      );
    }

    // Verify all materials exist
    const materialIds = validatedData.ingredients.map(ing => ing.materialId);
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
    const totalCost = validatedData.ingredients.reduce((sum, ingredient) => {
      const material = materials.find(m => m.id === ingredient.materialId);
      return sum + (ingredient.quantity * (material?.costPerUnit || 0));
    }, 0);

    const costPerUnit = validatedData.yieldQuantity > 0 ? totalCost / validatedData.yieldQuantity : 0;

    // Create recipe with ingredients in a transaction
    const recipe = await prisma.$transaction(async (tx) => {
      const newRecipe = await tx.recipe.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          category: validatedData.category,
          yieldQuantity: validatedData.yieldQuantity,
          yieldUnit: validatedData.yieldUnit,
          costPerUnit,
          instructions: validatedData.instructions,
          notes: validatedData.notes,
          ingredients: {
            create: validatedData.ingredients.map((ingredient, index) => ({
              materialId: ingredient.materialId,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              percentage: ingredient.percentage,
              isOptional: ingredient.isOptional,
              notes: ingredient.notes,
              order: ingredient.order || index
            }))
          }
        },
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
          }
        }
      });

      // Create initial version
      await tx.recipeVersion.create({
        data: {
          recipeId: newRecipe.id,
          version: '1.0',
          changes: 'Initial recipe creation',
          createdBy: 'System' // TODO: Get from auth context
        }
      });

      return newRecipe;
    });

    return NextResponse.json({
      success: true,
      data: { ...recipe, totalCost, costPerUnit },
      message: 'Recipe created successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}

// PUT /api/production/recipes
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    const validatedData = updateRecipeSchema.parse(updateData);

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: true,
        versions: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    if (!existingRecipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check if name is being changed and if it conflicts
    if (validatedData.name && validatedData.name !== existingRecipe.name) {
      const nameExists = await prisma.recipe.findFirst({
        where: {
          name: validatedData.name,
          id: { not: id }
        }
      });

      if (nameExists) {
        return NextResponse.json(
          { success: false, error: 'Recipe name already exists' },
          { status: 400 }
        );
      }
    }

    // Update recipe in transaction
    const updatedRecipe = await prisma.$transaction(async (tx) => {
      // If ingredients are being updated, replace them
      if (validatedData.ingredients) {
        // Verify all materials exist
        const materialIds = validatedData.ingredients.map(ing => ing.materialId);
        const materials = await tx.material.findMany({
          where: { id: { in: materialIds } }
        });

        if (materials.length !== materialIds.length) {
          throw new Error('One or more materials not found');
        }

        // Delete existing ingredients
        await tx.recipeIngredient.deleteMany({
          where: { recipeId: id }
        });

        // Calculate new cost
        const totalCost = validatedData.ingredients.reduce((sum, ingredient) => {
          const material = materials.find(m => m.id === ingredient.materialId);
          return sum + (ingredient.quantity * (material?.costPerUnit || 0));
        }, 0);

        const yieldQuantity = validatedData.yieldQuantity || existingRecipe.yieldQuantity;
        const costPerUnit = yieldQuantity > 0 ? totalCost / yieldQuantity : 0;

        // Update recipe with new cost and ingredients
        const recipe = await tx.recipe.update({
          where: { id },
          data: {
            ...validatedData,
            costPerUnit,
            ingredients: {
              create: validatedData.ingredients.map((ingredient, index) => ({
                materialId: ingredient.materialId,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                percentage: ingredient.percentage,
                isOptional: ingredient.isOptional,
                notes: ingredient.notes,
                order: ingredient.order || index
              }))
            }
          },
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
            }
          }
        });

        return recipe;
      } else {
        // Just update recipe metadata
        return await tx.recipe.update({
          where: { id },
          data: validatedData,
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
            }
          }
        });
      }
    });

    // Create new version if significant changes
    if (validatedData.ingredients || validatedData.name || validatedData.yieldQuantity) {
      const currentVersion = existingRecipe.versions[0]?.version || '1.0';
      const [major, minor] = currentVersion.split('.').map(Number);
      const newVersion = validatedData.ingredients ? `${major + 1}.0` : `${major}.${minor + 1}`;

      await prisma.recipeVersion.create({
        data: {
          recipeId: id,
          version: newVersion,
          changes: 'Recipe updated', // TODO: Generate detailed change log
          createdBy: 'System' // TODO: Get from auth context
        }
      });

      // Update recipe version
      await prisma.recipe.update({
        where: { id },
        data: { version: newVersion }
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedRecipe,
      message: 'Recipe updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}