import { prisma } from '@/lib/prisma';

export async function getInventory(data: any, session: any) {
  const { storeId, productType, search, limit = 50, offset = 0 } = data;

  const where: any = {};

  if (storeId) {
    where.storeId = storeId;
  }

  if (productType) {
    where.product = {
      type: productType,
    };
  }

  if (search) {
    where.product = {
      ...where.product,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ],
    };
  }

  const inventory = await prisma.storeInventory.findMany({
    where,
    include: {
      product: true,
      store: true,
    },
    take: limit,
    skip: offset,
    orderBy: { lastUpdated: 'desc' },
  });

  const total = await prisma.storeInventory.count({ where });

  return {
    data: inventory,
    pagination: {
      total,
      limit,
      offset,
      hasMore: total > offset + limit,
    },
  };
}

export async function updateStock(data: any, session: any) {
  const { productId, storeId, quantity, type } = data;

  const inventory = await prisma.storeInventory.findUnique({
    where: {
      storeId_productId: {
        storeId,
        productId,
      },
    },
  });

  if (!inventory) {
    throw new Error('Inventory item not found');
  }

  const updatedQuantity =
    type === 'add'
      ? inventory.quantity + quantity
      : type === 'remove'
      ? inventory.quantity - quantity
      : quantity;

  const updated = await prisma.storeInventory.update({
    where: {
      storeId_productId: {
        storeId,
        productId,
      },
    },
    data: {
      quantity: updatedQuantity,
      lastUpdated: new Date(),
    },
    include: {
      product: true,
      store: true,
    },
  });

  // Create stock movement record
  await prisma.stockMovement.create({
    data: {
      productId,
      storeId,
      movementType: type === 'add' ? 'IN' : 'OUT',
      quantity: Math.abs(quantity),
      referenceType: 'ADJUSTMENT',
      createdById: session.user.id,
    },
  });

  return { success: true, data: updated };
}

export async function getLowStock(data: any, session: any) {
  const { storeId } = data;

  const where: any = {};
  if (storeId) {
    where.storeId = storeId;
  }

  const lowStock = await prisma.storeInventory.findMany({
    where: {
      ...where,
      product: {
        stockQuantity: {
          lte: prisma.raw('products.min_stock'),
        },
      },
    },
    include: {
      product: true,
      store: true,
    },
    orderBy: { quantity: 'asc' },
  });

  return { data: lowStock };
}

export async function transferStock(data: any, session: any) {
  const { fromStoreId, toStoreId, productId, quantity, notes } = data;

  // Start transaction
  const result = await prisma.$transaction(async (tx) => {
    // Reduce from source store
    const fromInventory = await tx.storeInventory.findUnique({
      where: {
        storeId_productId: {
          storeId: fromStoreId,
          productId,
        },
      },
    });

    if (!fromInventory || fromInventory.quantity < quantity) {
      throw new Error('Insufficient stock for transfer');
    }

    await tx.storeInventory.update({
      where: {
        storeId_productId: {
          storeId: fromStoreId,
          productId,
        },
      },
      data: {
        quantity: fromInventory.quantity - quantity,
        lastUpdated: new Date(),
      },
    });

    // Add to destination store
    const toInventory = await tx.storeInventory.findUnique({
      where: {
        storeId_productId: {
          storeId: toStoreId,
          productId,
        },
      },
    });

    if (toInventory) {
      await tx.storeInventory.update({
        where: {
          storeId_productId: {
            storeId: toStoreId,
            productId,
          },
        },
        data: {
          quantity: toInventory.quantity + quantity,
          lastUpdated: new Date(),
        },
      });
    } else {
      await tx.storeInventory.create({
        data: {
          storeId: toStoreId,
          productId,
          quantity,
        },
      });
    }

    // Create transfer record
    const transfer = await tx.transfer.create({
      data: {
        fromStoreId,
        toStoreId,
        status: 'RECEIVED',
        notes,
        totalItems: 1,
        receivedAt: new Date(),
        createdById: session.user.id,
        items: {
          create: {
            productId,
            quantity,
            receivedQty: quantity,
          },
        },
      },
      include: {
        items: true,
      },
    });

    return transfer;
  });

  return { success: true, data: result };
}
