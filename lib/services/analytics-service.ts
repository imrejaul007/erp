import { prisma } from '@/lib/prisma';

export async function getDashboardMetrics(data: any, session: any) {
  const { startDate, endDate, storeId } = data;

  const dateFilter = {
    gte: startDate ? new Date(startDate) : new Date(new Date().setDate(1)),
    lte: endDate ? new Date(endDate) : new Date(),
  };

  const where: any = { createdAt: dateFilter };
  if (storeId) where.storeId = storeId;

  // Get orders
  const orders = await prisma.order.findMany({ where });
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.grandTotal), 0);
  const totalOrders = orders.length;

  // Get customers
  const newCustomers = await prisma.customer.count({
    where: { createdAt: dateFilter },
  });

  const totalCustomers = await prisma.customer.count();

  // Get low stock items
  const lowStockItems = await prisma.product.count({
    where: {
      stockQuantity: {
        lte: prisma.raw('min_stock'),
      },
    },
  });

  // Get top products
  const orderItems = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
      total: true,
    },
    orderBy: {
      _sum: {
        total: 'desc',
      },
    },
    take: 10,
  });

  const topProducts = await Promise.all(
    orderItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      return {
        product,
        quantitySold: item._sum.quantity,
        revenue: item._sum.total,
      };
    })
  );

  return {
    data: {
      summary: {
        totalRevenue,
        totalOrders,
        newCustomers,
        totalCustomers,
        lowStockItems,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      },
      topProducts,
    },
  };
}

export async function getSalesAnalytics(data: any, session: any) {
  const { startDate, endDate, storeId, groupBy = 'day' } = data;

  const dateFilter = {
    gte: startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30)),
    lte: endDate ? new Date(endDate) : new Date(),
  };

  const where: any = { createdAt: dateFilter };
  if (storeId) where.storeId = storeId;

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by time period
  const salesByPeriod: { [key: string]: { revenue: number; orders: number } } = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    let key: string;

    if (groupBy === 'day') {
      key = date.toISOString().split('T')[0];
    } else if (groupBy === 'week') {
      const week = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
      key = `${date.getFullYear()}-W${week}`;
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!salesByPeriod[key]) {
      salesByPeriod[key] = { revenue: 0, orders: 0 };
    }

    salesByPeriod[key].revenue += Number(order.grandTotal);
    salesByPeriod[key].orders += 1;
  });

  return {
    data: {
      salesByPeriod,
      totalRevenue: orders.reduce((sum, order) => sum + Number(order.grandTotal), 0),
      totalOrders: orders.length,
    },
  };
}

export async function getInventoryAnalytics(data: any, session: any) {
  const { storeId } = data;

  const where: any = {};
  if (storeId) where.storeId = storeId;

  // Get inventory summary
  const inventory = await prisma.storeInventory.findMany({
    where,
    include: {
      product: true,
    },
  });

  const totalValue = inventory.reduce(
    (sum, item) => sum + item.quantity * Number(item.product.unitPrice),
    0
  );

  const lowStock = inventory.filter((item) => item.quantity <= item.product.minStock);

  const outOfStock = inventory.filter((item) => item.quantity === 0);

  // Get stock movement trends
  const movements = await prisma.stockMovement.findMany({
    where: {
      storeId,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    include: {
      product: true,
    },
  });

  return {
    data: {
      summary: {
        totalItems: inventory.length,
        totalValue,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
      },
      lowStockItems: lowStock,
      recentMovements: movements.slice(0, 20),
    },
  };
}
