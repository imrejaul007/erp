import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

/**
 * GET /api/analytics/inventory - Get inventory analytics
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const totalProducts = await prisma.products.count({ where: { tenantId } });

    const inventoryValue = await prisma.products.aggregate({
      where: { tenantId },
      _sum: { stock: true },
    });

    const lowStockProducts = await prisma.products.count({
      where: {
        tenantId,
        stock: { lte: prisma.products.fields.lowStockThreshold },
      },
    });

    const outOfStockProducts = await prisma.products.count({
      where: { tenantId, stock: { lte: 0 } },
    });

    const stockByCategory = await prisma.products.groupBy({
      by: ['categoryId'],
      where: { tenantId },
      _sum: { stock: true },
      _count: true,
    });

    return apiResponse({
      totalProducts,
      totalStock: inventoryValue._sum.stock || 0,
      lowStockCount: lowStockProducts,
      outOfStockCount: outOfStockProducts,
      stockByCategory,
    });
  } catch (error: any) {
    console.error('Error fetching inventory analytics:', error);
    return apiError(error.message || 'Failed to fetch inventory analytics', 500);
  }
});
