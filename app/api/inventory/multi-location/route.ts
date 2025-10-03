import { NextRequest } from 'next/server';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const InventoryFiltersSchema = z.object({
  search: z.string().optional(),
  storeId: z.string().optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.string().optional(),
  lowStock: z.string().optional().transform(val => val === 'true'),
  outOfStock: z.string().optional().transform(val => val === 'true'),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  sortBy: z.string().optional().default('product.name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
});

const StockUpdateSchema = z.object({
  storeId: z.string().min(1, 'Store ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  minLevel: z.number().min(0).optional(),
  maxLevel: z.number().min(0).optional(),
  reorderPoint: z.number().min(0).optional(),
  reason: z.string().optional(),
  notes: z.string().optional()
});

const StockMovementSchema = z.object({
  storeId: z.string().min(1, 'Store ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER', 'RETURN', 'DAMAGE', 'COUNT']),
  quantity: z.number().min(1, 'Quantity must be positive'),
  reason: z.string().min(1, 'Reason is required'),
  reference: z.string().optional(),
  notes: z.string().optional()
});

// GET /api/inventory/multi-location - Get inventory across all locations
async function getHandler(req: NextRequest, { tenantId, user }: { tenantId: string; user: any }) {
  try {
    // Check permissions
    const userRole = user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(userRole)) {
      return apiError('Insufficient permissions', 403);
    }

    // Parse query parameters
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const filters = InventoryFiltersSchema.parse(params);

    // Build where clause for database query
    const whereClause: any = {
      store: { tenantId }  // Filter by tenant
    };

    // Filter by accessible stores
    if (!['OWNER', 'ADMIN'].includes(userRole)) {
      const userStoreIds = await prisma.userStore.findMany({
        where: {
          userId: user.id,
          store: { tenantId }
        },
        select: { storeId: true }
      });
      whereClause.storeId = { in: userStoreIds.map(us => us.storeId) };
    }

    if (filters.storeId) {
      // Verify store belongs to tenant
      const store = await prisma.store.findFirst({
        where: {
          id: filters.storeId,
          tenantId
        }
      });
      if (!store) {
        return apiError('Store not found', 404);
      }
      whereClause.storeId = filters.storeId;
    }

    if (filters.productId) {
      // Verify product belongs to tenant
      const product = await prisma.product.findFirst({
        where: {
          id: filters.productId,
          tenantId
        }
      });
      if (!product) {
        return apiError('Product not found', 404);
      }
      whereClause.productId = filters.productId;
    }

    // Fetch inventory from database
    const inventories = await prisma.storeInventory.findMany({
      where: whereClause,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            emirate: true,
            tenantId: true
          }
        },
        product: {
          include: {
            category: {
              select: { id: true, name: true }
            },
            brand: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: {
        lastUpdated: 'desc'
      }
    });

    // Transform and enrich data
    let enrichedInventories = inventories.map(inv => {
      const availableQuantity = inv.quantity - inv.reservedQty;
      const minLevel = inv.product.minStock || 0;
      const maxLevel = inv.product.maxStock || null;

      // Determine stock status
      let status = 'IN_STOCK';
      if (inv.quantity === 0) {
        status = 'OUT_OF_STOCK';
      } else if (inv.quantity <= minLevel) {
        status = 'LOW_STOCK';
      } else if (maxLevel && inv.quantity >= maxLevel) {
        status = 'OVERSTOCK';
      }

      return {
        id: inv.id,
        storeId: inv.storeId,
        store: {
          id: inv.store.id,
          name: inv.store.name,
          code: inv.store.code,
          city: inv.store.city,
          emirate: inv.store.emirate
        },
        productId: inv.productId,
        product: {
          id: inv.product.id,
          name: inv.product.name,
          nameArabic: inv.product.nameArabic,
          sku: inv.product.sku,
          category: inv.product.category,
          brand: inv.product.brand,
          costPrice: Number(inv.product.costPrice || 0),
          sellingPrice: Number(inv.product.unitPrice),
          stockQuantity: inv.quantity
        },
        quantity: inv.quantity,
        reservedQuantity: inv.reservedQty,
        availableQuantity,
        minLevel,
        maxLevel,
        reorderPoint: minLevel,
        averageCost: Number(inv.product.costPrice || inv.product.unitPrice),
        lastMovementDate: inv.lastUpdated,
        lastCountDate: inv.lastUpdated,
        status
      };
    });

    // Apply additional filters
    let filteredInventories = enrichedInventories;

    if (filters.search) {
      filteredInventories = filteredInventories.filter(inv =>
        inv.product.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        inv.product.sku.toLowerCase().includes(filters.search!.toLowerCase()) ||
        inv.store.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.categoryId) {
      filteredInventories = filteredInventories.filter(inv =>
        inv.product.category?.id === filters.categoryId
      );
    }

    if (filters.status) {
      filteredInventories = filteredInventories.filter(inv => inv.status === filters.status);
    }

    if (filters.lowStock) {
      filteredInventories = filteredInventories.filter(inv => inv.status === 'LOW_STOCK');
    }

    if (filters.outOfStock) {
      filteredInventories = filteredInventories.filter(inv => inv.status === 'OUT_OF_STOCK');
    }

    // Apply sorting
    filteredInventories.sort((a, b) => {
      let aValue: any, bValue: any;

      if (filters.sortBy === 'product.name') {
        aValue = a.product.name.toLowerCase();
        bValue = b.product.name.toLowerCase();
      } else if (filters.sortBy === 'store.name') {
        aValue = a.store.name.toLowerCase();
        bValue = b.store.name.toLowerCase();
      } else if (filters.sortBy === 'quantity') {
        aValue = a.quantity;
        bValue = b.quantity;
      } else {
        aValue = a[filters.sortBy as keyof typeof a] || '';
        bValue = b[filters.sortBy as keyof typeof b] || '';
      }

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const paginatedInventories = filteredInventories.slice(startIndex, startIndex + filters.limit);

    return apiResponse({
      data: paginatedInventories,
      pagination: {
        total: filteredInventories.length,
        pages: Math.ceil(filteredInventories.length / filters.limit),
        currentPage: filters.page,
        hasNextPage: startIndex + filters.limit < filteredInventories.length,
        hasPrevPage: filters.page > 1
      },
      summary: {
        totalLocations: [...new Set(filteredInventories.map(inv => inv.storeId))].length,
        totalProducts: [...new Set(filteredInventories.map(inv => inv.productId))].length,
        totalValue: filteredInventories.reduce((sum, inv) => sum + (inv.quantity * inv.averageCost), 0),
        lowStockItems: filteredInventories.filter(inv => inv.status === 'LOW_STOCK').length,
        outOfStockItems: filteredInventories.filter(inv => inv.status === 'OUT_OF_STOCK').length
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + JSON.stringify(error.errors), 400);
    }
    console.error('Error fetching multi-location inventory:', error);
    return apiError('Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
}

// POST /api/inventory/multi-location - Update inventory across locations
async function postHandler(req: NextRequest, { tenantId, user }: { tenantId: string; user: any }) {
  try {
    // Check permissions
    const userRole = user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(userRole)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      case 'stock_movement':
        const movementData = StockMovementSchema.parse(data);

        // Verify store belongs to tenant
        const store = await prisma.store.findFirst({
          where: {
            id: movementData.storeId,
            tenantId
          }
        });

        if (!store) {
          return apiError('Store not found', 404);
        }

        // Check store access
        if (!['OWNER', 'ADMIN'].includes(userRole)) {
          const hasAccess = await prisma.userStore.findFirst({
            where: {
              userId: user.id,
              storeId: movementData.storeId,
              store: { tenantId }
            }
          });
          if (!hasAccess) {
            return apiError('Access denied to this store', 403);
          }
        }

        // Verify product belongs to tenant
        const product = await prisma.product.findFirst({
          where: {
            id: movementData.productId,
            tenantId
          }
        });

        if (!product) {
          return apiError('Product not found', 404);
        }

        // Get or create store inventory record
        const inventory = await prisma.storeInventory.findUnique({
          where: {
            storeId_productId: {
              storeId: movementData.storeId,
              productId: movementData.productId
            }
          }
        });

        if (!inventory && movementData.type === 'OUT') {
          return apiError('Product not found in store inventory', 400);
        }

        // Calculate new quantity based on movement type
        const currentQty = inventory?.quantity || 0;
        let newQty = currentQty;

        switch (movementData.type) {
          case 'IN':
          case 'RETURN':
            newQty = currentQty + movementData.quantity;
            break;
          case 'OUT':
          case 'DAMAGE':
            newQty = currentQty - movementData.quantity;
            if (newQty < 0) {
              return apiError('Insufficient stock', 400);
            }
            break;
          case 'ADJUSTMENT':
          case 'COUNT':
            newQty = movementData.quantity;
            break;
        }

        // Update inventory in transaction
        const result = await prisma.$transaction(async (tx) => {
          // Update or create store inventory
          const updatedInventory = await tx.storeInventory.upsert({
            where: {
              storeId_productId: {
                storeId: movementData.storeId,
                productId: movementData.productId
              }
            },
            update: {
              quantity: newQty,
              lastUpdated: new Date()
            },
            create: {
              storeId: movementData.storeId,
              productId: movementData.productId,
              quantity: newQty,
              reservedQty: 0
            }
          });

          // Create stock movement record
          const movement = await tx.stockMovement.create({
            data: {
              storeId: movementData.storeId,
              productId: movementData.productId,
              type: movementData.type,
              quantity: movementData.quantity,
              referenceNo: movementData.reference || `MOV-${Date.now()}`,
              reason: movementData.reason,
              notes: movementData.notes,
              createdById: user.id
            }
          });

          return { inventory: updatedInventory, movement };
        });

        return apiResponse(result, 201);

      case 'bulk_update':
        const updates = z.array(StockUpdateSchema).parse(data);

        // Check store access for all updates
        const allStoreIds = [...new Set(updates.map(u => u.storeId))];

        // Verify all stores belong to tenant
        const stores = await prisma.store.findMany({
          where: {
            id: { in: allStoreIds },
            tenantId
          }
        });

        if (stores.length !== allStoreIds.length) {
          return apiError('One or more stores not found', 404);
        }

        if (!['OWNER', 'ADMIN'].includes(userRole)) {
          const userStoreAccess = await prisma.userStore.findMany({
            where: {
              userId: user.id,
              storeId: { in: allStoreIds },
              store: { tenantId }
            },
            select: { storeId: true }
          });
          const accessibleStoreIds = userStoreAccess.map(us => us.storeId);

          if (accessibleStoreIds.length !== allStoreIds.length) {
            return apiError('Access denied to some stores', 403);
          }
        }

        // Verify all products belong to tenant
        const allProductIds = [...new Set(updates.map(u => u.productId))];
        const products = await prisma.product.findMany({
          where: {
            id: { in: allProductIds },
            tenantId
          }
        });

        if (products.length !== allProductIds.length) {
          return apiError('One or more products not found', 404);
        }

        // Bulk update inventory
        const bulkResults = await Promise.all(
          updates.map(async (update, index) => {
            try {
              await prisma.storeInventory.upsert({
                where: {
                  storeId_productId: {
                    storeId: update.storeId,
                    productId: update.productId
                  }
                },
                update: {
                  quantity: update.quantity,
                  lastUpdated: new Date()
                },
                create: {
                  storeId: update.storeId,
                  productId: update.productId,
                  quantity: update.quantity,
                  reservedQty: 0
                }
              });

              // Update product min/max stock if provided
              if (update.minLevel !== undefined || update.maxLevel !== undefined) {
                await prisma.product.update({
                  where: {
                    id: update.productId,
                    tenantId
                  },
                  data: {
                    ...(update.minLevel !== undefined && { minStock: update.minLevel }),
                    ...(update.maxLevel !== undefined && { maxStock: update.maxLevel })
                  }
                });
              }

              return {
                index,
                success: true,
                message: 'Inventory updated successfully'
              };
            } catch (error) {
              return {
                index,
                success: false,
                message: error instanceof Error ? error.message : 'Update failed'
              };
            }
          })
        );

        return apiResponse({
          message: `${bulkResults.filter(r => r.success).length}/${updates.length} inventory records updated`,
          results: bulkResults
        });

      case 'reorder_suggestions':
        // Generate reorder suggestions based on stock levels
        const lowStockItems = await prisma.storeInventory.findMany({
          where: {
            store: { tenantId },
            quantity: {
              lte: prisma.raw(`(SELECT "minStock" FROM "products" WHERE id = "store_inventory"."productId")`)
            }
          },
          include: {
            store: {
              select: {
                id: true,
                name: true,
                tenantId: true
              }
            },
            product: {
              select: {
                id: true,
                name: true,
                minStock: true,
                maxStock: true,
                costPrice: true,
                tenantId: true
              }
            }
          }
        });

        const suggestions = lowStockItems.map(item => {
          const suggestedQty = (item.product.maxStock || item.product.minStock * 2) - item.quantity;
          const estimatedCost = Number(item.product.costPrice || 0) * suggestedQty;

          return {
            storeId: item.storeId,
            storeName: item.store.name,
            productId: item.productId,
            productName: item.product.name,
            currentStock: item.quantity,
            minStock: item.product.minStock,
            suggestedQuantity: suggestedQty,
            priority: item.quantity === 0 ? 'CRITICAL' : item.quantity < item.product.minStock / 2 ? 'HIGH' : 'MEDIUM',
            reason: item.quantity === 0 ? 'Out of stock' : 'Stock below minimum level',
            estimatedCost
          };
        });

        return apiResponse({ suggestions });

      default:
        return apiError('Invalid action', 400);
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + JSON.stringify(error.errors), 400);
    }

    console.error('Error updating multi-location inventory:', error);
    return apiError('Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
}

export const GET = withTenant(getHandler);
export const POST = withTenant(postHandler);
