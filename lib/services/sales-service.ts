import { prisma } from '@/lib/prisma';

export async function createOrder(data: any, session: any) {
  const { customerId, storeId, items, notes, paymentMethod } = data;

  // Calculate totals
  const totalAmount = items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0);
  const vatAmount = totalAmount * 0.05; // 5% UAE VAT
  const grandTotal = totalAmount + vatAmount;

  // Generate order number
  const orderCount = await prisma.order.count();
  const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(6, '0')}`;

  // Create order with transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        customerId,
        storeId,
        status: 'CONFIRMED',
        totalAmount,
        vatAmount,
        grandTotal,
        paymentStatus: 'PENDING',
        notes,
        createdById: session.user.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
        store: true,
      },
    });

    // Create payment if method provided
    if (paymentMethod) {
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          customerId,
          amount: grandTotal,
          method: paymentMethod,
          status: 'PENDING',
          processedById: session.user.id,
        },
      });
    }

    // Update inventory
    for (const item of items) {
      await tx.storeInventory.updateMany({
        where: {
          storeId,
          productId: item.productId,
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });

      // Create stock movement
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          storeId,
          movementType: 'OUT',
          quantity: item.quantity,
          referenceType: 'ORDER',
          referenceId: newOrder.id,
          createdById: session.user.id,
        },
      });
    }

    return newOrder;
  });

  return { success: true, data: order };
}

export async function getOrders(data: any, session: any) {
  const { storeId, customerId, status, startDate, endDate, limit = 50, offset = 0 } = data;

  const where: any = {};

  if (storeId) where.storeId = storeId;
  if (customerId) where.customerId = customerId;
  if (status) where.status = status;

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customer: true,
      store: true,
      payments: true,
    },
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.order.count({ where });

  return {
    data: orders,
    pagination: {
      total,
      limit,
      offset,
      hasMore: total > offset + limit,
    },
  };
}

export async function updateOrderStatus(data: any, session: any) {
  const { orderId, status } = data;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customer: true,
      store: true,
    },
  });

  return { success: true, data: order };
}

export async function getSalesReport(data: any, session: any) {
  const { storeId, startDate, endDate } = data;

  const where: any = {
    createdAt: {
      gte: startDate ? new Date(startDate) : new Date(new Date().setDate(1)),
      lte: endDate ? new Date(endDate) : new Date(),
    },
  };

  if (storeId) {
    where.storeId = storeId;
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
      payments: true,
    },
  });

  const totalSales = orders.reduce((sum, order) => sum + Number(order.grandTotal), 0);
  const totalOrders = orders.length;
  const totalVAT = orders.reduce((sum, order) => sum + Number(order.vatAmount), 0);
  const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID').length;
  const pendingPayments = orders.filter((o) => o.paymentStatus === 'PENDING').length;

  return {
    data: {
      totalSales,
      totalOrders,
      totalVAT,
      paidOrders,
      pendingPayments,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      orders,
    },
  };
}

export async function processReturn(data: any, session: any) {
  const { orderId, items, reason, refundAmount } = data;

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'RETURNED' },
    });

    // Return stock
    for (const item of items) {
      await tx.storeInventory.updateMany({
        where: {
          storeId: order.storeId,
          productId: item.productId,
        },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      });

      // Create stock movement
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          storeId: order.storeId,
          movementType: 'IN',
          quantity: item.quantity,
          referenceType: 'RETURN',
          referenceId: orderId,
          notes: reason,
          createdById: session.user.id,
        },
      });
    }

    // Create refund payment
    if (refundAmount > 0) {
      await tx.payment.create({
        data: {
          orderId,
          customerId: order.customerId,
          amount: -refundAmount,
          method: 'CASH',
          status: 'REFUNDED',
          notes: `Refund for return: ${reason}`,
          processedById: session.user.id,
        },
      });
    }

    return order;
  });

  return { success: true, data: result };
}
