import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// GET - Get sales leaderboard with filters
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const period = url.searchParams.get('period') || 'all'; // all, today, week, month, year
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const type = url.searchParams.get('type') || 'sales'; // sales, orders, customers

    // Calculate date ranges
    const now = new Date();
    let startDate: Date | undefined;

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    }

    // Build where clause for date filtering
    const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

    // Get sales leaderboard
    if (type === 'sales') {
      const salesByUser = await prisma.sale.groupBy({
        by: ['createdById'],
        where: {
          tenantId,
          ...dateFilter,
        },
        _sum: {
          totalAmount: true,
          profit: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _sum: {
            totalAmount: 'desc',
          },
        },
        take: limit,
      });

      // Enrich with user details
      const leaderboard = await Promise.all(
        salesByUser.map(async (entry, index) => {
          const user = await prisma.users.findUnique({
            where: { id: entry.createdById },
            select: {
              id: true,
              name: true,
              email: true,
            },
          });

          return {
            rank: index + 1,
            user,
            totalSales: entry._sum.totalAmount || 0,
            totalProfit: entry._sum.profit || 0,
            totalOrders: entry._count.id,
            averageOrderValue: entry._count.id > 0
              ? Number(entry._sum.totalAmount || 0) / entry._count.id
              : 0,
          };
        })
      );

      return apiResponse({ leaderboard, period, type });
    }

    // Get orders leaderboard (by count)
    if (type === 'orders') {
      const ordersByUser = await prisma.sale.groupBy({
        by: ['createdById'],
        where: {
          tenantId,
          ...dateFilter,
        },
        _count: {
          id: true,
        },
        _sum: {
          totalAmount: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: limit,
      });

      const leaderboard = await Promise.all(
        ordersByUser.map(async (entry, index) => {
          const user = await prisma.users.findUnique({
            where: { id: entry.createdById },
            select: {
              id: true,
              name: true,
              email: true,
            },
          });

          return {
            rank: index + 1,
            user,
            totalOrders: entry._count.id,
            totalSales: entry._sum.totalAmount || 0,
            averageOrderValue: entry._count.id > 0
              ? Number(entry._sum.totalAmount || 0) / entry._count.id
              : 0,
          };
        })
      );

      return apiResponse({ leaderboard, period, type });
    }

    // Get customers leaderboard (unique customers served)
    if (type === 'customers') {
      const customersByUser = await prisma.sale.groupBy({
        by: ['createdById', 'customerId'],
        where: {
          tenantId,
          customerId: { not: null },
          ...dateFilter,
        },
      });

      // Count unique customers per user
      const uniqueCustomersMap = new Map<string, Set<string>>();
      customersByUser.forEach(entry => {
        if (!uniqueCustomersMap.has(entry.createdById)) {
          uniqueCustomersMap.set(entry.createdById, new Set());
        }
        if (entry.customerId) {
          uniqueCustomersMap.get(entry.createdById)!.add(entry.customerId);
        }
      });

      // Get sales data for each user
      const salesByUser = await prisma.sale.groupBy({
        by: ['createdById'],
        where: {
          tenantId,
          customerId: { not: null },
          ...dateFilter,
        },
        _sum: {
          totalAmount: true,
        },
        _count: {
          id: true,
        },
      });

      // Build leaderboard
      const leaderboardData = await Promise.all(
        Array.from(uniqueCustomersMap.entries())
          .sort((a, b) => b[1].size - a[1].size)
          .slice(0, limit)
          .map(async ([userId, customerSet], index) => {
            const user = await prisma.users.findUnique({
              where: { id: userId },
              select: {
                id: true,
                name: true,
                email: true,
              },
            });

            const salesData = salesByUser.find(s => s.createdById === userId);

            return {
              rank: index + 1,
              user,
              uniqueCustomers: customerSet.size,
              totalSales: salesData?._sum.totalAmount || 0,
              totalOrders: salesData?._count.id || 0,
            };
          })
      );

      return apiResponse({ leaderboard: leaderboardData, period, type });
    }

    return apiError('Invalid leaderboard type. Use: sales, orders, or customers', 400);
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return apiError(error.message || 'Failed to fetch leaderboard', 500);
  }
});
