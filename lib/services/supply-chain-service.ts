import { prisma } from '@/lib/prisma';

export async function getPurchaseOrders(data: any, session: any) {
  const { supplierId, status, limit = 50, offset = 0 } = data;

  const where: any = {};
  if (supplierId) where.supplierId = supplierId;
  if (status) where.status = status;

  const orders = await prisma.purchaseOrder.findMany({
    where,
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.purchaseOrder.count({ where });

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

export async function createPurchaseOrder(data: any, session: any) {
  const { supplierId, items, expectedDate, notes } = data;

  // Calculate total
  const totalAmount = items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0);

  // Generate order number
  const orderCount = await prisma.purchaseOrder.count();
  const orderNumber = `PO-${new Date().getFullYear()}-${String(orderCount + 1).padStart(6, '0')}`;

  const purchaseOrder = await prisma.purchaseOrder.create({
    data: {
      orderNumber,
      supplierId,
      status: 'PENDING',
      totalAmount,
      expectedDate: expectedDate ? new Date(expectedDate) : null,
      notes,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return { success: true, data: purchaseOrder };
}

export async function updatePurchaseOrderStatus(data: any, session: any) {
  const { orderId, status, receivedDate } = data;

  const order = await prisma.purchaseOrder.update({
    where: { id: orderId },
    data: {
      status,
      receivedDate: receivedDate ? new Date(receivedDate) : undefined,
    },
    include: {
      supplier: true,
      items: true,
    },
  });

  return { success: true, data: order };
}

export async function receiveItems(data: any, session: any) {
  const { orderId, items } = data;

  const result = await prisma.$transaction(async (tx) => {
    // Update purchase order items
    for (const item of items) {
      await tx.purchaseOrderItem.update({
        where: { id: item.itemId },
        data: {
          receivedQty: item.receivedQuantity,
        },
      });

      // Update product stock
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            increment: item.receivedQuantity,
          },
        },
      });
    }

    // Check if all items received
    const poItems = await tx.purchaseOrderItem.findMany({
      where: { purchaseOrderId: orderId },
    });

    const allReceived = poItems.every((item) => item.receivedQty >= item.quantity);
    const partiallyReceived = poItems.some(
      (item) => item.receivedQty > 0 && item.receivedQty < item.quantity
    );

    const newStatus = allReceived
      ? 'RECEIVED'
      : partiallyReceived
      ? 'PARTIALLY_RECEIVED'
      : 'CONFIRMED';

    // Update PO status
    await tx.purchaseOrder.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    return { status: newStatus };
  });

  return { success: true, data: result };
}
