import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

/**
 * GET /api/analytics/sales - Get sales analytics
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const groupBy = searchParams.get('groupBy') || 'day';

    const where: any = { tenantId };

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const totalSales = await prisma.order.aggregate({
      where: { ...where, status: { in: ['CONFIRMED', 'COMPLETED', 'DELIVERED'] } },
      _sum: { total: true },
      _count: true,
    });

    const salesByStatus = await prisma.order.groupBy({
      by: ['status'],
      where,
      _sum: { total: true },
      _count: true,
    });

    return apiResponse({
      totalRevenue: totalSales._sum.total || 0,
      totalOrders: totalSales._count || 0,
      averageOrderValue: totalSales._count > 0
        ? Number(totalSales._sum.total || 0) / totalSales._count
        : 0,
      salesByStatus,
    });
  } catch (error: any) {
    console.error('Error fetching sales analytics:', error);
    return apiError(error.message || 'Failed to fetch sales analytics', 500);
  }
});
