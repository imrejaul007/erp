import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

// Validation schemas
const TransferCreateSchema = z.object({
  fromStoreId: z.string().min(1, 'From store is required'),
  toStoreId: z.string().min(1, 'To store is required'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT', 'EMERGENCY']),
  notes: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantityRequested: z.number().min(1, 'Quantity must be at least 1'),
    notes: z.string().optional()
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
  priority: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  requestedById: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

// Generate transfer number
function generateTransferNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().substr(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `TRF${year}${month}${day}${random}`;
}

// GET /api/transfers - List transfers with filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const filters = TransferFiltersSchema.parse(params);

    // TODO: Replace with actual database queries
    const mockTransfers = [
      {
        id: '1',
        transferNumber: 'TRF24090001',
        fromStoreId: '1',
        toStoreId: '2',
        fromStore: {
          id: '1',
          name: 'Dubai Mall Store',
          code: 'DUBOUT001',
          city: 'Downtown Dubai',
          emirate: 'DUBAI'
        },
        toStore: {
          id: '2',
          name: 'Mall of the Emirates',
          code: 'DUBOUT002',
          city: 'Al Barsha',
          emirate: 'DUBAI'
        },
        status: 'PENDING_APPROVAL',
        priority: 'NORMAL',
        requestedById: session.user.id,
        requestedBy: {
          id: session.user.id,
          name: session.user.name || 'User',
          email: session.user.email || ''
        },
        approvedById: null,
        approvedBy: null,
        items: [
          {
            id: '1',
            transferId: '1',
            productId: 'prod1',
            product: {
              id: 'prod1',
              name: 'Oud Al Malaki',
              sku: 'OUD001',
              stockQuantity: 50
            },
            quantityRequested: 10,
            quantityApproved: null,
            quantityShipped: null,
            quantityReceived: null,
            unitCost: 500,
            notes: null
          },
          {
            id: '2',
            transferId: '1',
            productId: 'prod2',
            product: {
              id: 'prod2',
              name: 'Rose Perfume',
              sku: 'ROSE001',
              stockQuantity: 30
            },
            quantityRequested: 5,
            quantityApproved: null,
            quantityShipped: null,
            quantityReceived: null,
            unitCost: 300,
            notes: null
          }
        ],
        notes: 'Urgent restock needed for weekend sale',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        actualDelivery: null,
        trackingNumber: null,
        shippingCost: null,
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date('2024-09-15')
      },
      {
        id: '2',
        transferNumber: 'TRF24090002',
        fromStoreId: '2',
        toStoreId: '1',
        fromStore: {
          id: '2',
          name: 'Mall of the Emirates',
          code: 'DUBOUT002',
          city: 'Al Barsha',
          emirate: 'DUBAI'
        },
        toStore: {
          id: '1',
          name: 'Dubai Mall Store',
          code: 'DUBOUT001',
          city: 'Downtown Dubai',
          emirate: 'DUBAI'
        },
        status: 'IN_TRANSIT',
        priority: 'HIGH',
        requestedById: 'user2',
        requestedBy: {
          id: 'user2',
          name: 'Fatima Al Zahra',
          email: 'fatima@company.com'
        },
        approvedById: session.user.id,
        approvedBy: {
          id: session.user.id,
          name: session.user.name || 'User',
          email: session.user.email || ''
        },
        items: [
          {
            id: '3',
            transferId: '2',
            productId: 'prod3',
            product: {
              id: 'prod3',
              name: 'Arabian Nights',
              sku: 'ARAB001',
              stockQuantity: 25
            },
            quantityRequested: 8,
            quantityApproved: 8,
            quantityShipped: 8,
            quantityReceived: null,
            unitCost: 450,
            notes: null
          }
        ],
        notes: 'Rush order for VIP customer',
        estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        actualDelivery: null,
        trackingNumber: 'TRK123456789',
        shippingCost: 50,
        createdAt: new Date('2024-09-14'),
        updatedAt: new Date('2024-09-16')
      }
    ];

    // Apply filters
    let filteredTransfers = mockTransfers;

    if (filters.search) {
      filteredTransfers = filteredTransfers.filter(transfer =>
        transfer.transferNumber.toLowerCase().includes(filters.search!.toLowerCase()) ||
        transfer.fromStore.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        transfer.toStore.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.fromStoreId) {
      filteredTransfers = filteredTransfers.filter(t => t.fromStoreId === filters.fromStoreId);
    }

    if (filters.toStoreId) {
      filteredTransfers = filteredTransfers.filter(t => t.toStoreId === filters.toStoreId);
    }

    if (filters.status) {
      filteredTransfers = filteredTransfers.filter(t => t.status === filters.status);
    }

    if (filters.priority) {
      filteredTransfers = filteredTransfers.filter(t => t.priority === filters.priority);
    }

    if (filters.requestedById) {
      filteredTransfers = filteredTransfers.filter(t => t.requestedById === filters.requestedById);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredTransfers = filteredTransfers.filter(t => new Date(t.createdAt) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filteredTransfers = filteredTransfers.filter(t => new Date(t.createdAt) <= endDate);
    }

    // Apply sorting
    filteredTransfers.sort((a, b) => {
      let aValue: any = a[filters.sortBy as keyof typeof a];
      let bValue: any = b[filters.sortBy as keyof typeof b];

      if (filters.sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const paginatedTransfers = filteredTransfers.slice(startIndex, startIndex + filters.limit);

    const response = {
      data: paginatedTransfers,
      pagination: {
        total: filteredTransfers.length,
        pages: Math.ceil(filteredTransfers.length / filters.limit),
        currentPage: filters.page,
        hasNextPage: startIndex + filters.limit < filteredTransfers.length,
        hasPrevPage: filters.page > 1
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/transfers - Create new transfer request
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
    const transferData = TransferCreateSchema.parse(body);

    // Check store access permissions
    const userStores = session.user.stores || [];
    const canAccessFromStore = ['OWNER', 'ADMIN'].includes(userRole) || userStores.includes(transferData.fromStoreId);
    const canAccessToStore = ['OWNER', 'ADMIN'].includes(userRole) || userStores.includes(transferData.toStoreId);

    if (!canAccessFromStore || !canAccessToStore) {
      return NextResponse.json({ error: 'Access denied to one or both stores' }, { status: 403 });
    }

    // TODO: Check inventory availability at source store
    for (const item of transferData.items) {
      // Validate product exists and has sufficient stock
      const availableStock = 100; // Mock check
      if (item.quantityRequested > availableStock) {
        return NextResponse.json({
          error: `Insufficient stock for product ${item.productId}. Available: ${availableStock}, Requested: ${item.quantityRequested}`
        }, { status: 400 });
      }
    }

    // Create transfer in database
    const transferNumber = generateTransferNumber();
    const newTransfer = {
      id: `transfer_${Date.now()}`,
      transferNumber,
      ...transferData,
      estimatedDelivery: transferData.estimatedDelivery ? new Date(transferData.estimatedDelivery) : null,
      status: 'PENDING_APPROVAL',
      requestedById: session.user.id,
      approvedById: null,
      actualDelivery: null,
      trackingNumber: null,
      shippingCost: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // TODO: Create transfer items in database
    // TODO: Reserve inventory at source store
    // TODO: Send notification to approver
    // TODO: Create audit log entry

    return NextResponse.json(newTransfer, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating transfer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/transfers - Bulk update transfers
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { transferIds, action, data } = body;

    if (!Array.isArray(transferIds) || transferIds.length === 0) {
      return NextResponse.json(
        { error: 'Transfer IDs array is required' },
        { status: 400 }
      );
    }

    // Check permissions based on action
    const userRole = session.user.role;
    switch (action) {
      case 'approve':
        if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
          return NextResponse.json({ error: 'Insufficient permissions to approve transfers' }, { status: 403 });
        }
        break;
      case 'cancel':
        // Users can cancel their own transfers, managers/admins can cancel any
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // TODO: Implement bulk update logic
    const results = transferIds.map(id => ({
      id,
      action,
      success: true,
      message: `Transfer ${action}d successfully`
    }));

    return NextResponse.json({
      message: `${action} applied to ${transferIds.length} transfers`,
      results
    });

  } catch (error) {
    console.error('Error bulk updating transfers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}