import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

    // Parse query parameters
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const filters = InventoryFiltersSchema.parse(params);

    // Filter by user's accessible stores if not admin/owner
    const userStores = session.user.stores || [];
    const accessibleStores = ['OWNER', 'ADMIN'].includes(userRole) ? null : userStores;

    // TODO: Replace with actual database queries
    const mockInventories = [
      {
        id: '1',
        storeId: '1',
        store: {
          id: '1',
          name: 'Dubai Mall Store',
          code: 'DUBOUT001',
          city: 'Downtown Dubai',
          emirate: 'DUBAI'
        },
        productId: 'prod1',
        product: {
          id: 'prod1',
          name: 'Oud Al Malaki',
          sku: 'OUD001',
          category: { id: 'cat1', name: 'Oud' },
          brand: { id: 'brand1', name: 'Royal Essence' },
          costPrice: 400,
          sellingPrice: 600,
          stockQuantity: 45
        },
        quantity: 45,
        reservedQuantity: 5,
        availableQuantity: 40,
        minLevel: 10,
        maxLevel: 100,
        reorderPoint: 15,
        averageCost: 420,
        lastMovementDate: new Date('2024-09-15'),
        lastCountDate: new Date('2024-09-01'),
        status: 'IN_STOCK'
      },
      {
        id: '2',
        storeId: '1',
        store: {
          id: '1',
          name: 'Dubai Mall Store',
          code: 'DUBOUT001',
          city: 'Downtown Dubai',
          emirate: 'DUBAI'
        },
        productId: 'prod2',
        product: {
          id: 'prod2',
          name: 'Rose Perfume',
          sku: 'ROSE001',
          category: { id: 'cat2', name: 'Floral' },
          brand: { id: 'brand1', name: 'Royal Essence' },
          costPrice: 250,
          sellingPrice: 400,
          stockQuantity: 8
        },
        quantity: 8,
        reservedQuantity: 2,
        availableQuantity: 6,
        minLevel: 15,
        maxLevel: 80,
        reorderPoint: 20,
        averageCost: 260,
        lastMovementDate: new Date('2024-09-14'),
        lastCountDate: new Date('2024-09-01'),
        status: 'LOW_STOCK'
      },
      {
        id: '3',
        storeId: '2',
        store: {
          id: '2',
          name: 'Mall of the Emirates',
          code: 'DUBOUT002',
          city: 'Al Barsha',
          emirate: 'DUBAI'
        },
        productId: 'prod1',
        product: {
          id: 'prod1',
          name: 'Oud Al Malaki',
          sku: 'OUD001',
          category: { id: 'cat1', name: 'Oud' },
          brand: { id: 'brand1', name: 'Royal Essence' },
          costPrice: 400,
          sellingPrice: 600,
          stockQuantity: 62
        },
        quantity: 62,
        reservedQuantity: 0,
        availableQuantity: 62,
        minLevel: 8,
        maxLevel: 80,
        reorderPoint: 12,
        averageCost: 415,
        lastMovementDate: new Date('2024-09-16'),
        lastCountDate: new Date('2024-09-01'),
        status: 'IN_STOCK'
      },
      {
        id: '4',
        storeId: '2',
        store: {
          id: '2',
          name: 'Mall of the Emirates',
          code: 'DUBOUT002',
          city: 'Al Barsha',
          emirate: 'DUBAI'
        },
        productId: 'prod3',
        product: {
          id: 'prod3',
          name: 'Arabian Nights',
          sku: 'ARAB001',
          category: { id: 'cat1', name: 'Oud' },
          brand: { id: 'brand2', name: 'Desert Dreams' },
          costPrice: 350,
          sellingPrice: 550,
          stockQuantity: 0
        },
        quantity: 0,
        reservedQuantity: 0,
        availableQuantity: 0,
        minLevel: 5,
        maxLevel: 50,
        reorderPoint: 10,
        averageCost: 365,
        lastMovementDate: new Date('2024-09-12'),
        lastCountDate: new Date('2024-09-01'),
        status: 'OUT_OF_STOCK'
      }
    ];

    // Apply filters
    let filteredInventories = mockInventories;

    // Filter by accessible stores
    if (accessibleStores) {
      filteredInventories = filteredInventories.filter(inv =>
        accessibleStores.includes(inv.storeId)
      );
    }

    if (filters.search) {
      filteredInventories = filteredInventories.filter(inv =>
        inv.product.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        inv.product.sku.toLowerCase().includes(filters.search!.toLowerCase()) ||
        inv.store.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.storeId) {
      filteredInventories = filteredInventories.filter(inv => inv.storeId === filters.storeId);
    }

    if (filters.productId) {
      filteredInventories = filteredInventories.filter(inv => inv.productId === filters.productId);
    }

    if (filters.categoryId) {
      filteredInventories = filteredInventories.filter(inv =>
        inv.product.category.id === filters.categoryId
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

    const response = {
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
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching multi-location inventory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/inventory/multi-location - Update inventory across locations
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
    const { action, data } = body;

    switch (action) {
      case 'stock_movement':
        const movementData = StockMovementSchema.parse(data);

        // Check store access
        const userStores = session.user.stores || [];
        if (!['OWNER', 'ADMIN'].includes(userRole) && !userStores.includes(movementData.storeId)) {
          return NextResponse.json({ error: 'Access denied to this store' }, { status: 403 });
        }

        // TODO: Create stock movement record
        // TODO: Update inventory quantity
        // TODO: Create audit log
        // TODO: Check if reorder is needed
        // TODO: Send notifications if thresholds are crossed

        const movementResult = {
          id: `movement_${Date.now()}`,
          ...movementData,
          userId: session.user.id,
          createdAt: new Date()
        };

        return NextResponse.json(movementResult, { status: 201 });

      case 'bulk_update':
        const updates = z.array(StockUpdateSchema).parse(data);

        // Check store access for all updates
        const allStoreIds = [...new Set(updates.map(u => u.storeId))];
        const accessibleStores = ['OWNER', 'ADMIN'].includes(userRole) ?
          allStoreIds :
          allStoreIds.filter(id => userStores.includes(id));

        if (accessibleStores.length !== allStoreIds.length) {
          return NextResponse.json({ error: 'Access denied to some stores' }, { status: 403 });
        }

        // TODO: Implement bulk update logic
        const bulkResults = updates.map((update, index) => ({
          index,
          success: true,
          message: 'Inventory updated successfully'
        }));

        return NextResponse.json({
          message: `${updates.length} inventory records updated`,
          results: bulkResults
        });

      case 'reorder_suggestions':
        // TODO: Generate reorder suggestions based on stock levels
        const suggestions = [
          {
            storeId: '1',
            storeName: 'Dubai Mall Store',
            productId: 'prod2',
            productName: 'Rose Perfume',
            currentStock: 8,
            suggestedQuantity: 25,
            priority: 'HIGH',
            reason: 'Stock below reorder point',
            estimatedCost: 6250
          }
        ];

        return NextResponse.json({ suggestions });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating multi-location inventory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}