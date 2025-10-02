import { prisma } from '@/lib/prisma';

export async function syncOnlineOrders(data: any, session: any) {
  const { source, orders } = data;

  const synced = [];

  for (const onlineOrder of orders) {
    try {
      // Check if order already synced
      const existing = await prisma.order.findFirst({
        where: {
          orderNumber: onlineOrder.externalOrderId,
        },
      });

      if (existing) {
        synced.push({ orderId: onlineOrder.externalOrderId, status: 'already_synced' });
        continue;
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber: onlineOrder.externalOrderId,
          customerId: onlineOrder.customerId,
          storeId: onlineOrder.storeId || data.defaultStoreId,
          status: 'CONFIRMED',
          totalAmount: onlineOrder.totalAmount,
          vatAmount: onlineOrder.vatAmount || onlineOrder.totalAmount * 0.05,
          grandTotal: onlineOrder.grandTotal,
          paymentStatus: onlineOrder.paymentStatus || 'PENDING',
          notes: `Synced from ${source}: ${onlineOrder.externalOrderId}`,
          createdById: session.user.id,
          items: {
            create: onlineOrder.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      synced.push({ orderId: order.orderNumber, status: 'synced', internalId: order.id });
    } catch (error) {
      synced.push({
        orderId: onlineOrder.externalOrderId,
        status: 'error',
        error: error.message,
      });
    }
  }

  return { success: true, data: synced };
}

export async function syncProducts(data: any, session: any) {
  const { platform, productIds } = data;

  const where: any = {};
  if (productIds && productIds.length > 0) {
    where.id = { in: productIds };
  }

  const products = await prisma.product.findMany({
    where: {
      ...where,
      isActive: true,
    },
    include: {
      category: true,
      brand: true,
    },
  });

  // Format for e-commerce platform
  const formattedProducts = products.map((product) => ({
    sku: product.sku,
    name: product.name,
    nameArabic: product.nameArabic,
    description: product.description,
    price: Number(product.unitPrice),
    stock: product.stockQuantity,
    category: product.category.name,
    brand: product.brand?.name,
    image: product.imageUrl,
    isActive: product.isActive,
  }));

  return {
    success: true,
    data: {
      platform,
      productsCount: formattedProducts.length,
      products: formattedProducts,
    },
  };
}

export async function getOnlineOrdersStatus(data: any, session: any) {
  const { startDate, endDate } = data;

  const dateFilter = {
    gte: startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 7)),
    lte: endDate ? new Date(endDate) : new Date(),
  };

  const orders = await prisma.order.findMany({
    where: {
      createdAt: dateFilter,
      notes: {
        contains: 'Synced from',
      },
    },
    include: {
      items: true,
      customer: true,
    },
  });

  const byStatus = orders.reduce((acc: any, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  return {
    data: {
      totalOrders: orders.length,
      ordersByStatus: byStatus,
      orders,
    },
  };
}

export async function updateInventorySync(data: any, session: any) {
  const { platform } = data;

  // Get all active products with low stock warnings
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      stockQuantity: {
        lte: prisma.raw('min_stock * 2'), // Warn when below 2x min stock
      },
    },
  });

  return {
    success: true,
    data: {
      platform,
      lowStockProducts: products.map((p) => ({
        sku: p.sku,
        name: p.name,
        currentStock: p.stockQuantity,
        minStock: p.minStock,
      })),
    },
  };
}
