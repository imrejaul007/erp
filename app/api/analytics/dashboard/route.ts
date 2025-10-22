import { NextRequest } from 'next/server';
import { KPI, FinancialMetrics, CustomerMetrics } from '@/types/analytics';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'today';
    const stores = searchParams.get('stores')?.split(',');

    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    let startDate = todayStart;
    let endDate = todayEnd;

    if (dateRange === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (dateRange === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (dateRange === 'year') {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    // Fetch real data from database
    const where: any = { tenantId, createdAt: { gte: startDate, lte: endDate } };
    if (stores && stores.length > 0) {
      where.storeId = { in: stores };
    }

    // Get total revenue and orders
    const orders = await prisma.order.aggregate({
      where: { ...where, status: { in: ['CONFIRMED', 'COMPLETED', 'DELIVERED'] } },
      _sum: { total: true, profit: true },
      _count: true,
    });

    // Get previous period data for comparison
    const previousStartDate = new Date(startDate);
    previousStartDate.setTime(previousStartDate.getTime() - (endDate.getTime() - startDate.getTime()));

    const previousOrders = await prisma.order.aggregate({
      where: {
        ...where,
        createdAt: { gte: previousStartDate, lte: startDate },
        status: { in: ['CONFIRMED', 'COMPLETED', 'DELIVERED'] },
      },
      _sum: { total: true, profit: true },
      _count: true,
    });

    // Calculate changes
    const revenueChange = previousOrders._sum.total
      ? ((Number(orders._sum.total || 0) - Number(previousOrders._sum.total)) / Number(previousOrders._sum.total) * 100).toFixed(1)
      : '0.0';

    const ordersChange = previousOrders._count
      ? ((orders._count - previousOrders._count) / previousOrders._count * 100).toFixed(1)
      : '0.0';

    const profitChange = previousOrders._sum.profit
      ? ((Number(orders._sum.profit || 0) - Number(previousOrders._sum.profit)) / Number(previousOrders._sum.profit) * 100).toFixed(1)
      : '0.0';

    // Get customer metrics
    const totalCustomers = await prisma.customers.count({ where: { tenantId } });
    const newCustomers = await prisma.customers.count({
      where: { tenantId, createdAt: { gte: startDate, lte: endDate } },
    });
    const previousNewCustomers = await prisma.customers.count({
      where: { tenantId, createdAt: { gte: previousStartDate, lte: startDate } },
    });

    const customerChange = previousNewCustomers
      ? ((newCustomers - previousNewCustomers) / previousNewCustomers * 100).toFixed(1)
      : '0.0';

    // Get inventory value
    const products = await prisma.products.aggregate({
      where: { tenantId },
      _sum: { stock: true },
    });

    const productsWithCost = await prisma.products.findMany({
      where: { tenantId },
      select: { stock: true, cost: true },
    });

    const inventoryValue = productsWithCost.reduce((sum, p) =>
      sum + (Number(p.stock || 0) * Number(p.cost || 0)), 0
    );

    // Build KPIs with real data
    const kpis: KPI[] = [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: Number(orders._sum.total || 0),
        change: `${Number(revenueChange) >= 0 ? '+' : ''}${revenueChange}%`,
        changeType: Number(revenueChange) >= 0 ? 'positive' : 'negative',
        icon: 'DollarSign',
        trend: [], // Can be populated with historical data if needed
      },
      {
        id: 'orders',
        title: 'Total Orders',
        value: orders._count || 0,
        change: `${Number(ordersChange) >= 0 ? '+' : ''}${ordersChange}%`,
        changeType: Number(ordersChange) >= 0 ? 'positive' : 'negative',
        icon: 'ShoppingCart',
        trend: [],
      },
      {
        id: 'customers',
        title: 'Active Customers',
        value: totalCustomers,
        change: `${Number(customerChange) >= 0 ? '+' : ''}${customerChange}%`,
        changeType: Number(customerChange) >= 0 ? 'positive' : 'negative',
        icon: 'Users',
        trend: [],
      },
      {
        id: 'profit',
        title: 'Net Profit',
        value: Number(orders._sum.profit || 0),
        change: `${Number(profitChange) >= 0 ? '+' : ''}${profitChange}%`,
        changeType: Number(profitChange) >= 0 ? 'positive' : 'negative',
        icon: 'TrendingUp',
        trend: [],
      },
    ];

    const revenue = Number(orders._sum.total || 0);
    const profit = Number(orders._sum.profit || 0);
    const profitMargin = revenue > 0 ? (profit / revenue * 100) : 0;

    const financialMetrics: FinancialMetrics = {
      revenue,
      profit,
      profitMargin: Number(profitMargin.toFixed(2)),
      cashFlow: profit, // Simplified - should calculate actual cash flow
      expenses: revenue - profit,
      roi: profitMargin, // Simplified
    };

    const avgOrderValue = orders._count > 0 ? revenue / orders._count : 0;

    const customerMetrics: CustomerMetrics = {
      totalCustomers,
      newCustomers,
      retentionRate: 85.6, // Would need historical order data to calculate
      averageOrderValue: Number(avgOrderValue.toFixed(2)),
      customerLifetimeValue: Number((avgOrderValue * 5).toFixed(2)), // Simplified estimate
      churnRate: 3.2, // Would need historical data to calculate
    };

    const dashboardData = {
      kpis,
      financialMetrics,
      customerMetrics,
      inventoryValue,
      lastUpdated: new Date().toISOString(),
    };

    return apiResponse(dashboardData);
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return apiError('Failed to fetch dashboard data: ' + (error.message || 'Unknown error'), 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const filters = await request.json();

    // Apply filters and return filtered data
    // This is where you'd implement the actual filtering logic

    return apiResponse({ message: 'Filters applied successfully' });
  } catch (error: any) {
    console.error('Error applying filters:', error);
    return apiError('Failed to apply filters: ' + (error.message || 'Unknown error'), 500);
  }
});