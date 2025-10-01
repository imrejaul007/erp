import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

// Validation schemas
const StoreCreateSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  code: z.string().min(2, 'Store code must be at least 2 characters').max(10),
  type: z.enum(['FLAGSHIP', 'OUTLET', 'KIOSK', 'ONLINE', 'WAREHOUSE', 'DISTRIBUTION_CENTER']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'TEMPORARILY_CLOSED', 'PERMANENTLY_CLOSED']).optional(),
  emirate: z.enum(['DUBAI', 'ABU_DHABI', 'SHARJAH', 'AJMAN', 'RAS_AL_KHAIMAH', 'FUJAIRAH', 'UMM_AL_QUWAIN']),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  managerId: z.string().optional(),
  parentStoreId: z.string().optional(),
  openingHours: z.object({
    monday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    tuesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    wednesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    thursday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    friday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    saturday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    sunday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    })
  }),
  settings: z.object({
    taxRate: z.number().min(0).max(100),
    currency: z.string().default('AED'),
    timezone: z.string().default('Asia/Dubai'),
    autoReplenishment: z.boolean().default(true),
    minStockThreshold: z.number().min(0).default(10),
    maxStockThreshold: z.number().min(0).default(1000),
    enableTransfers: z.boolean().default(true),
    requireTransferApproval: z.boolean().default(true),
    enablePriceSync: z.boolean().default(true),
    enablePromotionSync: z.boolean().default(true),
    emergencyContactEmail: z.string().email().optional().or(z.literal('')),
    notificationSettings: z.object({
      lowStockAlerts: z.boolean().default(true),
      transferAlerts: z.boolean().default(true),
      salesAlerts: z.boolean().default(true),
      emergencyAlerts: z.boolean().default(true),
      emailNotifications: z.boolean().default(true),
      smsNotifications: z.boolean().default(false)
    })
  })
});

const StoreFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  emirate: z.string().optional(),
  city: z.string().optional(),
  managerId: z.string().optional(),
  parentStoreId: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  sortBy: z.string().optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
});

// GET /api/stores - List stores with filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const filters = StoreFiltersSchema.parse(params);

    // TODO: Replace with actual database queries
    // This is a mock implementation
    const mockStores = [
      {
        id: '1',
        name: 'Dubai Mall Store',
        code: 'DUBOUT001',
        type: 'FLAGSHIP',
        status: 'ACTIVE',
        emirate: 'DUBAI',
        city: 'Downtown Dubai',
        address: 'The Dubai Mall, Financial Centre Road',
        coordinates: { lat: 25.1972, lng: 55.2796 },
        phone: '+971-4-123-4567',
        email: 'dubai.mall@company.com',
        managerId: 'user1',
        manager: {
          id: 'user1',
          name: 'Ahmed Al Mansouri',
          email: 'ahmed@company.com',
          phone: '+971-50-123-4567'
        },
        openingHours: {
          monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          friday: { isOpen: true, openTime: '14:00', closeTime: '22:00' },
          saturday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
          sunday: { isOpen: true, openTime: '10:00', closeTime: '22:00' }
        },
        settings: {
          taxRate: 5,
          currency: 'AED',
          timezone: 'Asia/Dubai',
          autoReplenishment: true,
          minStockThreshold: 10,
          maxStockThreshold: 1000,
          enableTransfers: true,
          requireTransferApproval: true,
          enablePriceSync: true,
          enablePromotionSync: true,
          emergencyContactEmail: 'emergency@company.com',
          notificationSettings: {
            lowStockAlerts: true,
            transferAlerts: true,
            salesAlerts: true,
            emergencyAlerts: true,
            emailNotifications: true,
            smsNotifications: false
          }
        },
        metrics: {
          totalSales: 125000,
          monthlyRevenue: 45000,
          averageOrderValue: 250,
          footfall: 1200,
          conversionRate: 15.5,
          performanceScore: 87.5,
          inventoryTurnover: 6.2,
          stockValue: 890000,
          lowStockItems: 3,
          lastUpdated: new Date()
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        createdById: session.user.id
      },
      {
        id: '2',
        name: 'Mall of the Emirates',
        code: 'DUBOUT002',
        type: 'OUTLET',
        status: 'ACTIVE',
        emirate: 'DUBAI',
        city: 'Al Barsha',
        address: 'Mall of the Emirates, Sheikh Zayed Road',
        coordinates: { lat: 25.1175, lng: 55.2003 },
        phone: '+971-4-234-5678',
        email: 'moe@company.com',
        managerId: 'user2',
        manager: {
          id: 'user2',
          name: 'Fatima Al Zahra',
          email: 'fatima@company.com',
          phone: '+971-50-234-5678'
        },
        openingHours: {
          monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          friday: { isOpen: true, openTime: '14:00', closeTime: '22:00' },
          saturday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
          sunday: { isOpen: true, openTime: '10:00', closeTime: '22:00' }
        },
        settings: {
          taxRate: 5,
          currency: 'AED',
          timezone: 'Asia/Dubai',
          autoReplenishment: true,
          minStockThreshold: 8,
          maxStockThreshold: 800,
          enableTransfers: true,
          requireTransferApproval: true,
          enablePriceSync: true,
          enablePromotionSync: true,
          emergencyContactEmail: 'emergency@company.com',
          notificationSettings: {
            lowStockAlerts: true,
            transferAlerts: true,
            salesAlerts: true,
            emergencyAlerts: true,
            emailNotifications: true,
            smsNotifications: false
          }
        },
        metrics: {
          totalSales: 95000,
          monthlyRevenue: 32000,
          averageOrderValue: 220,
          footfall: 850,
          conversionRate: 12.8,
          performanceScore: 82.3,
          inventoryTurnover: 5.8,
          stockValue: 650000,
          lowStockItems: 5,
          lastUpdated: new Date()
        },
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
        createdById: session.user.id
      }
    ];

    // Apply filters
    let filteredStores = mockStores;

    if (filters.search) {
      filteredStores = filteredStores.filter(store =>
        store.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        store.code.toLowerCase().includes(filters.search!.toLowerCase()) ||
        store.city.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.type) {
      filteredStores = filteredStores.filter(store => store.type === filters.type);
    }

    if (filters.status) {
      filteredStores = filteredStores.filter(store => store.status === filters.status);
    }

    if (filters.emirate) {
      filteredStores = filteredStores.filter(store => store.emirate === filters.emirate);
    }

    if (filters.city) {
      filteredStores = filteredStores.filter(store => store.city === filters.city);
    }

    if (filters.managerId) {
      filteredStores = filteredStores.filter(store => store.managerId === filters.managerId);
    }

    // Apply sorting
    filteredStores.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof typeof a] as string;
      const bValue = b[filters.sortBy as keyof typeof b] as string;

      const comparison = aValue.localeCompare(bValue);
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const paginatedStores = filteredStores.slice(startIndex, startIndex + filters.limit);

    const response = {
      data: paginatedStores,
      pagination: {
        total: filteredStores.length,
        pages: Math.ceil(filteredStores.length / filters.limit),
        currentPage: filters.page,
        hasNextPage: startIndex + filters.limit < filteredStores.length,
        hasPrevPage: filters.page > 1
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/stores - Create new store
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions (should be admin/manager)
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const storeData = StoreCreateSchema.parse(body);

    // Check if store code is unique
    // TODO: Replace with actual database query
    const existingStore = false; // Mock check
    if (existingStore) {
      return NextResponse.json(
        { error: 'Store code already exists' },
        { status: 409 }
      );
    }

    // Create store in database
    // TODO: Replace with actual database creation
    const newStore = {
      id: `store_${Date.now()}`,
      ...storeData,
      status: storeData.status || 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: session.user.id
    };

    // TODO: Create store settings record
    // TODO: Initialize store inventory
    // TODO: Send notification to assigned manager
    // TODO: Create audit log entry

    return NextResponse.json(newStore, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating store:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/stores - Bulk update stores
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { storeIds, updates } = body;

    if (!Array.isArray(storeIds) || storeIds.length === 0) {
      return NextResponse.json(
        { error: 'Store IDs array is required' },
        { status: 400 }
      );
    }

    // TODO: Implement bulk update logic
    const updatedStores = storeIds.map(id => ({
      id,
      ...updates,
      updatedAt: new Date()
    }));

    return NextResponse.json({
      message: `${storeIds.length} stores updated successfully`,
      updatedStores
    });

  } catch (error) {
    console.error('Error bulk updating stores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/stores - Bulk delete stores
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions (only owners/admins can delete stores)
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { storeIds } = body;

    if (!Array.isArray(storeIds) || storeIds.length === 0) {
      return NextResponse.json(
        { error: 'Store IDs array is required' },
        { status: 400 }
      );
    }

    // TODO: Check if stores can be deleted (no active transfers, etc.)
    // TODO: Archive instead of hard delete
    // TODO: Update related records
    // TODO: Create audit log entries

    return NextResponse.json({
      message: `${storeIds.length} stores deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting stores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}