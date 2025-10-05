import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

/**
 * GET /api/analytics/inventory - Get inventory analytics
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const totalProducts = await prisma.product.count({ where: { tenantId } });

    const inventoryValue = await prisma.product.aggregate({
      where: { tenantId },
      _sum: { stock: true },
    });

    const lowStockProducts = await prisma.product.count({
      where: {
        tenantId,
        stock: { lte: prisma.product.fields.lowStockThreshold },
      },
    });

    const outOfStockProducts = await prisma.product.count({
      where: { tenantId, stock: { lte: 0 } },
    });

    const stockByCategory = await prisma.product.groupBy({
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
