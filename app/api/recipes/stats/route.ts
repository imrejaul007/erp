import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// GET - Get recipe statistics
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const [
      totalRecipes,
      draftRecipes,
      testingRecipes,
      approvedRecipes,
      archivedRecipes,
      totalIngredients,
    ] = await Promise.all([
      prisma.blendingRecipe.count({ where: { tenantId } }),
      prisma.blendingRecipe.count({ where: { tenantId, status: 'DRAFT' } }),
      prisma.blendingRecipe.count({ where: { tenantId, status: 'TESTING' } }),
      prisma.blendingRecipe.count({ where: { tenantId, status: 'APPROVED' } }),
      prisma.blendingRecipe.count({ where: { tenantId, status: 'ARCHIVED' } }),
      prisma.blendingIngredient.count({ where: { tenantId } }),
    ]);

    // Calculate average cost
    const avgCostResult = await prisma.blendingRecipe.aggregate({
      where: { tenantId },
      _avg: {
        actualCost: true,
      },
    });

    // Calculate total profit margin
    const totalProfitResult = await prisma.blendingRecipe.aggregate({
      where: { tenantId },
      _sum: {
        profitMargin: true,
      },
    });

    // Get most used ingredients
    const topIngredients = await prisma.blendingIngredient.groupBy({
      by: ['productId'],
      where: { tenantId },
      _count: {
        productId: true,
      },
      _sum: {
        quantity: true,
        cost: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: 10,
    });

    // Enrich top ingredients with product details
    const enrichedTopIngredients = await Promise.all(
      topIngredients.map(async (ing) => {
        const product = await prisma.product.findUnique({
          where: { id: ing.productId },
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        });
        return {
          product,
          usageCount: ing._count.productId,
          totalQuantity: ing._sum.quantity,
          totalCost: ing._sum.cost,
        };
      })
    );

    // Get recipes by profit margin (top 5 most profitable)
    const mostProfitableRecipes = await prisma.blendingRecipe.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        code: true,
        status: true,
        actualCost: true,
        targetSellingPrice: true,
        profitMargin: true,
      },
      orderBy: {
        profitMargin: 'desc',
      },
      take: 5,
    });

    // Get recipes by status for chart data
    const recipesByStatus = [
      { status: 'DRAFT', count: draftRecipes, color: '#94a3b8' },
      { status: 'TESTING', count: testingRecipes, color: '#fbbf24' },
      { status: 'APPROVED', count: approvedRecipes, color: '#10b981' },
      { status: 'ARCHIVED', count: archivedRecipes, color: '#6b7280' },
    ];

    return apiResponse({
      stats: {
        totalRecipes,
        draftRecipes,
        testingRecipes,
        approvedRecipes,
        archivedRecipes,
        totalIngredients,
        avgCost: avgCostResult._avg.actualCost || 0,
        totalProfitMargin: totalProfitResult._sum.profitMargin || 0,
      },
      topIngredients: enrichedTopIngredients,
      mostProfitableRecipes,
      recipesByStatus,
    });
  } catch (error: any) {
    console.error('Error fetching recipe stats:', error);
    return apiError(error.message || 'Failed to fetch stats', 500);
  }
});
