import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/replenishment - Get replenishment suggestions based on real inventory
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const url = new URL(req.url);
    const storeId = url.searchParams.get('storeId');
    const priority = url.searchParams.get('priority');

    // Build where clause
    const whereClause: any = {};

    // Filter by accessible stores if not admin/owner
    if (!['OWNER', 'ADMIN'].includes(userRole)) {
      const userStoreIds = await prisma.userStore.findMany({
        where: { userId: session.user.id },
        select: { storeId: true }
      });
      const storeIds = userStoreIds.map(us => us.storeId);
      whereClause.storeId = { in: storeIds };
    }

    if (storeId) {
      whereClause.storeId = storeId;
    }

    // Get inventory data with product info
    const inventoryData = await prisma.storeInventory.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            nameArabic: true,
            sku: true,
            minStock: true,
            maxStock: true,
            category: {
              select: { id: true, name: true }
            }
          }
        },
        store: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    // Generate replenishment alerts based on stock levels
    const alerts = [];

    for (const inventory of inventoryData) {
      const currentStock = inventory.quantity;
      const minStock = inventory.product.minStock || 0;
      const maxStock = inventory.product.maxStock || 100;
      const reservedQty = inventory.reservedQty || 0;
      const availableStock = currentStock - reservedQty;

      let alertType = null;
      let priority = null;
      let suggestedOrder = 0;
      let message = '';

      // Determine alert type and priority
      if (currentStock === 0) {
        alertType = 'OUT_OF_STOCK';
        priority = 'CRITICAL';
        suggestedOrder = maxStock;
        message = `${inventory.product.name} is out of stock at ${inventory.store.name}. Immediate replenishment required.`;
      } else if (availableStock <= 0) {
        alertType = 'NO_AVAILABLE_STOCK';
        priority = 'HIGH';
        suggestedOrder = maxStock - currentStock;
        message = `${inventory.product.name} has no available stock at ${inventory.store.name} (all reserved). Current: ${currentStock}, Reserved: ${reservedQty}.`;
      } else if (currentStock <= minStock * 0.5) {
        alertType = 'CRITICALLY_LOW';
        priority = 'HIGH';
        suggestedOrder = maxStock - currentStock;
        message = `${inventory.product.name} is critically low at ${inventory.store.name}. Current stock (${currentStock}) is 50% below minimum level (${minStock}).`;
      } else if (currentStock <= minStock) {
        alertType = 'LOW_STOCK';
        priority = 'MEDIUM';
        suggestedOrder = maxStock - currentStock;
        message = `${inventory.product.name} is running low at ${inventory.store.name}. Current stock (${currentStock}) is below minimum level (${minStock}).`;
      }

      // Only create alert if there's an issue
      if (alertType) {
        alerts.push({
          id: `alert_${inventory.id}`,
          storeId: inventory.storeId,
          storeName: inventory.store.name,
          productId: inventory.productId,
          productName: inventory.product.name,
          productSku: inventory.product.sku,
          categoryId: inventory.product.category?.id,
          categoryName: inventory.product.category?.name,
          alertType,
          priority,
          currentStock,
          reservedStock: reservedQty,
          availableStock,
          minLevel: minStock,
          maxLevel: maxStock,
          suggestedOrder,
          message,
          isResolved: false,
          createdAt: inventory.lastUpdated || new Date()
        });
      }
    }

    // Apply priority filter if requested
    let filteredAlerts = alerts;
    if (priority) {
      filteredAlerts = alerts.filter(alert => alert.priority === priority.toUpperCase());
    }

    // Sort by priority (CRITICAL > HIGH > MEDIUM > LOW)
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    filteredAlerts.sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]);

    // Calculate summary statistics
    const summary = {
      totalAlerts: filteredAlerts.length,
      criticalAlerts: filteredAlerts.filter(a => a.priority === 'CRITICAL').length,
      highPriorityAlerts: filteredAlerts.filter(a => a.priority === 'HIGH').length,
      mediumPriorityAlerts: filteredAlerts.filter(a => a.priority === 'MEDIUM').length,
      outOfStockItems: filteredAlerts.filter(a => a.alertType === 'OUT_OF_STOCK').length,
      lowStockItems: filteredAlerts.filter(a => a.alertType === 'LOW_STOCK').length,
      totalSuggestedOrderValue: filteredAlerts.reduce((sum, alert) => sum + alert.suggestedOrder, 0)
    };

    return NextResponse.json({
      alerts: filteredAlerts,
      summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching replenishment data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/replenishment - Create replenishment order or update inventory settings
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { action, productId, storeId, minStock, maxStock, createTransfer } = body;

    if (action === 'update_levels') {
      // Update product min/max stock levels
      if (!productId || minStock === undefined || maxStock === undefined) {
        return NextResponse.json(
          { error: 'Product ID, minStock, and maxStock are required' },
          { status: 400 }
        );
      }

      if (minStock < 0 || maxStock <= minStock) {
        return NextResponse.json(
          { error: 'Invalid stock levels. Max must be greater than min, and both must be non-negative.' },
          { status: 400 }
        );
      }

      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          minStock,
          maxStock
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Stock levels updated successfully',
        product: {
          id: product.id,
          name: product.name,
          minStock: product.minStock,
          maxStock: product.maxStock
        }
      });
    }

    if (action === 'create_replenishment') {
      // Create a transfer order for replenishment
      if (!createTransfer || !createTransfer.fromStoreId || !createTransfer.toStoreId || !createTransfer.items) {
        return NextResponse.json(
          { error: 'Transfer details (fromStoreId, toStoreId, items) are required' },
          { status: 400 }
        );
      }

      // Verify stores exist
      const [fromStore, toStore] = await Promise.all([
        prisma.store.findUnique({ where: { id: createTransfer.fromStoreId } }),
        prisma.store.findUnique({ where: { id: createTransfer.toStoreId } })
      ]);

      if (!fromStore || !toStore) {
        return NextResponse.json({ error: 'One or both stores not found' }, { status: 404 });
      }

      // Check inventory availability at source store
      for (const item of createTransfer.items) {
        const inventory = await prisma.storeInventory.findUnique({
          where: {
            storeId_productId: {
              storeId: createTransfer.fromStoreId,
              productId: item.productId
            }
          }
        });

        if (!inventory || inventory.quantity < item.quantity) {
          const product = await prisma.product.findUnique({ where: { id: item.productId } });
          return NextResponse.json({
            error: `Insufficient stock for product ${product?.name || item.productId}. Available: ${inventory?.quantity || 0}, Requested: ${item.quantity}`
          }, { status: 400 });
        }
      }

      // Create transfer for replenishment
      const transfer = await prisma.$transaction(async (tx) => {
        const newTransfer = await tx.transfer.create({
          data: {
            fromStoreId: createTransfer.fromStoreId,
            toStoreId: createTransfer.toStoreId,
            notes: createTransfer.notes || 'Automated replenishment order',
            totalItems: createTransfer.items.length,
            createdById: session.user.id,
            status: 'PENDING'
          }
        });

        // Create transfer items
        await Promise.all(
          createTransfer.items.map((item: any) =>
            tx.transferItem.create({
              data: {
                transferId: newTransfer.id,
                productId: item.productId,
                quantity: item.quantity,
                receivedQty: null
              }
            })
          )
        );

        // Reserve inventory at source store
        await Promise.all(
          createTransfer.items.map((item: any) =>
            tx.storeInventory.update({
              where: {
                storeId_productId: {
                  storeId: createTransfer.fromStoreId,
                  productId: item.productId
                }
              },
              data: {
                reservedQty: { increment: item.quantity }
              }
            })
          )
        );

        return newTransfer;
      });

      return NextResponse.json({
        success: true,
        message: 'Replenishment transfer created successfully',
        transfer: {
          id: transfer.id,
          fromStoreId: transfer.fromStoreId,
          toStoreId: transfer.toStoreId,
          status: transfer.status,
          totalItems: transfer.totalItems
        }
      }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error processing replenishment action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
