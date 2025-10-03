import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schemas
const TransferCreateSchema = z.object({
  fromStoreId: z.string().min(1, 'From store is required'),
  toStoreId: z.string().min(1, 'To store is required'),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1')
  })).min(1, 'At least one item is required')
}).refine(data => data.fromStoreId !== data.toStoreId, {
  message: 'From store and to store cannot be the same',
  path: ['toStoreId']
});

const TransferFiltersSchema = z.object({
  search: z.string().optional(),
  fromStoreId: z.string().optional(),
  toStoreId: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  sortBy: z.string().optional().default('requestedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

// GET /api/transfers - List transfers with filters
export const GET = withTenant(async (req, { tenantId, user }) => {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const filters = TransferFiltersSchema.parse(params);

    // Build where clause
    const whereClause: any = { tenantId };

    // Check permissions - non-admin users can only see transfers from/to their stores
    const userRole = user.role;
    if (!['OWNER', 'ADMIN'].includes(userRole)) {
      const userStoreIds = await prisma.userStore.findMany({
        where: {
          userId: user.id,
          tenantId
        },
        select: { storeId: true }
      });
      const storeIds = userStoreIds.map(us => us.storeId);

      whereClause.OR = [
        { fromStoreId: { in: storeIds } },
        { toStoreId: { in: storeIds } }
      ];
    }

    if (filters.fromStoreId) {
      whereClause.fromStoreId = filters.fromStoreId;
    }

    if (filters.toStoreId) {
      whereClause.toStoreId = filters.toStoreId;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.startDate) {
      whereClause.requestedAt = {
        ...whereClause.requestedAt,
        gte: new Date(filters.startDate)
      };
    }

    if (filters.endDate) {
      whereClause.requestedAt = {
        ...whereClause.requestedAt,
        lte: new Date(filters.endDate)
      };
    }

    // Fetch transfers from database
    const [transfers, total] = await Promise.all([
      prisma.transfer.findMany({
        where: whereClause,
        include: {
          fromStore: {
            select: {
              id: true,
              name: true,
              code: true,
              city: true,
              emirate: true
            }
          },
          toStore: {
            select: {
              id: true,
              name: true,
              code: true,
              city: true,
              emirate: true
            }
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  stockQuantity: true
                }
              }
            }
          }
        },
        orderBy: {
          [filters.sortBy]: filters.sortOrder
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit
      }),
      prisma.transfer.count({ where: whereClause })
    ]);

    // Apply search filter (after fetching since it searches across relations)
    let filteredTransfers = transfers;
    if (filters.search) {
      filteredTransfers = transfers.filter(transfer =>
        transfer.fromStore.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        transfer.toStore.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        transfer.id.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    const response = {
      data: filteredTransfers,
      pagination: {
        total: filteredTransfers.length,
        pages: Math.ceil(total / filters.limit),
        currentPage: filters.page,
        hasNextPage: filters.page * filters.limit < total,
        hasPrevPage: filters.page > 1
      }
    };

    return apiResponse(response);

  } catch (error) {
    console.error('Error fetching transfers:', error);
    return apiError('Internal server error', 500);
  }
});

// POST /api/transfers - Create new transfer request
export const POST = withTenant(async (req, { tenantId, user }) => {
  try {
    // Check permissions
    const userRole = user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(userRole)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const transferData = TransferCreateSchema.parse(body);

    // Check store access permissions
    if (!['OWNER', 'ADMIN'].includes(userRole)) {
      const userStoreIds = await prisma.userStore.findMany({
        where: {
          userId: user.id,
          tenantId
        },
        select: { storeId: true }
      });
      const storeIds = userStoreIds.map(us => us.storeId);

      const canAccessFromStore = storeIds.includes(transferData.fromStoreId);
      const canAccessToStore = storeIds.includes(transferData.toStoreId);

      if (!canAccessFromStore || !canAccessToStore) {
        return apiError('Access denied to one or both stores', 403);
      }
    }

    // Verify stores exist and belong to tenant
    const [fromStore, toStore] = await Promise.all([
      prisma.store.findFirst({
        where: {
          id: transferData.fromStoreId,
          tenantId
        }
      }),
      prisma.store.findFirst({
        where: {
          id: transferData.toStoreId,
          tenantId
        }
      })
    ]);

    if (!fromStore || !toStore) {
      return apiError('One or both stores not found', 404);
    }

    // Check inventory availability at source store
    for (const item of transferData.items) {
      const inventory = await prisma.storeInventory.findUnique({
        where: {
          storeId_productId: {
            storeId: transferData.fromStoreId,
            productId: item.productId
          }
        }
      });

      if (!inventory || inventory.quantity < item.quantity) {
        const product = await prisma.product.findFirst({
          where: {
            id: item.productId,
            tenantId
          }
        });
        return apiError(
          `Insufficient stock for product ${product?.name || item.productId}. Available: ${inventory?.quantity || 0}, Requested: ${item.quantity}`,
          400
        );
      }
    }

    // Create transfer with items in transaction
    const newTransfer = await prisma.$transaction(async (tx) => {
      // Create transfer
      const transfer = await tx.transfer.create({
        data: {
          fromStoreId: transferData.fromStoreId,
          toStoreId: transferData.toStoreId,
          notes: transferData.notes,
          totalItems: transferData.items.length,
          createdById: user.id,
          status: 'PENDING',
          tenantId
        },
        include: {
          fromStore: { select: { id: true, name: true, code: true } },
          toStore: { select: { id: true, name: true, code: true } },
          createdBy: { select: { id: true, name: true, email: true } }
        }
      });

      // Create transfer items
      const items = await Promise.all(
        transferData.items.map(item =>
          tx.transferItem.create({
            data: {
              transferId: transfer.id,
              productId: item.productId,
              quantity: item.quantity,
              receivedQty: null
            },
            include: {
              product: {
                select: { id: true, name: true, sku: true }
              }
            }
          })
        )
      );

      // Reserve inventory at source store
      await Promise.all(
        transferData.items.map(item =>
          tx.storeInventory.update({
            where: {
              storeId_productId: {
                storeId: transferData.fromStoreId,
                productId: item.productId
              }
            },
            data: {
              reservedQty: { increment: item.quantity }
            }
          })
        )
      );

      return { ...transfer, items };
    });

    return apiResponse(newTransfer, 201);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error', 400, { details: error.errors });
    }

    console.error('Error creating transfer:', error);
    return apiError('Internal server error', 500);
  }
});

// PUT /api/transfers - Update transfer status
export const PUT = withTenant(async (req, { tenantId, user }) => {
  try {
    const body = await req.json();
    const { transferId, action, receivedQuantities } = body;

    if (!transferId || !action) {
      return apiError('Transfer ID and action are required', 400);
    }

    // Check permissions based on action
    const userRole = user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
      return apiError('Insufficient permissions', 403);
    }

    // Get transfer and verify it belongs to tenant
    const transfer = await prisma.transfer.findFirst({
      where: {
        id: transferId,
        tenantId
      },
      include: { items: true }
    });

    if (!transfer) {
      return apiError('Transfer not found', 404);
    }

    let updatedTransfer;

    switch (action) {
      case 'approve':
        if (transfer.status !== 'PENDING') {
          return apiError('Transfer must be in PENDING status', 400);
        }
        updatedTransfer = await prisma.transfer.update({
          where: { id: transferId },
          data: {
            status: 'APPROVED',
            approvedAt: new Date()
          }
        });
        break;

      case 'ship':
        if (transfer.status !== 'APPROVED') {
          return apiError('Transfer must be in APPROVED status', 400);
        }
        updatedTransfer = await prisma.$transaction(async (tx) => {
          // Update transfer status
          const updated = await tx.transfer.update({
            where: { id: transferId },
            data: {
              status: 'SHIPPED',
              shippedAt: new Date()
            }
          });

          // Deduct from source store inventory
          await Promise.all(
            transfer.items.map(item =>
              tx.storeInventory.update({
                where: {
                  storeId_productId: {
                    storeId: transfer.fromStoreId,
                    productId: item.productId
                  }
                },
                data: {
                  quantity: { decrement: item.quantity },
                  reservedQty: { decrement: item.quantity }
                }
              })
            )
          );

          return updated;
        });
        break;

      case 'receive':
        if (transfer.status !== 'SHIPPED') {
          return apiError('Transfer must be in SHIPPED status', 400);
        }
        updatedTransfer = await prisma.$transaction(async (tx) => {
          // Update transfer status
          const updated = await tx.transfer.update({
            where: { id: transferId },
            data: {
              status: 'RECEIVED',
              receivedAt: new Date()
            }
          });

          // Update received quantities and add to destination store inventory
          await Promise.all(
            transfer.items.map(async (item) => {
              const receivedQty = receivedQuantities?.[item.id] || item.quantity;

              // Update transfer item with received quantity
              await tx.transferItem.update({
                where: { id: item.id },
                data: { receivedQty }
              });

              // Add to destination store inventory
              await tx.storeInventory.upsert({
                where: {
                  storeId_productId: {
                    storeId: transfer.toStoreId,
                    productId: item.productId
                  }
                },
                update: {
                  quantity: { increment: receivedQty }
                },
                create: {
                  storeId: transfer.toStoreId,
                  productId: item.productId,
                  quantity: receivedQty,
                  reservedQty: 0
                }
              });
            })
          );

          return updated;
        });
        break;

      case 'cancel':
        if (transfer.status === 'RECEIVED') {
          return apiError('Cannot cancel a received transfer', 400);
        }
        updatedTransfer = await prisma.$transaction(async (tx) => {
          // Update transfer status
          const updated = await tx.transfer.update({
            where: { id: transferId },
            data: { status: 'CANCELLED' }
          });

          // Release reserved inventory if not yet shipped
          if (transfer.status === 'PENDING' || transfer.status === 'APPROVED') {
            await Promise.all(
              transfer.items.map(item =>
                tx.storeInventory.update({
                  where: {
                    storeId_productId: {
                      storeId: transfer.fromStoreId,
                      productId: item.productId
                    }
                  },
                  data: {
                    reservedQty: { decrement: item.quantity }
                  }
                })
              )
            );
          }

          return updated;
        });
        break;

      default:
        return apiError('Invalid action', 400);
    }

    return apiResponse({
      message: `Transfer ${action}ed successfully`,
      transfer: updatedTransfer
    });

  } catch (error) {
    console.error('Error updating transfer:', error);
    return apiError('Internal server error', 500);
  }
});
