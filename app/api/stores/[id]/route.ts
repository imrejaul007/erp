import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const StoreUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().min(2).max(10).optional(),
  type: z.enum(['FLAGSHIP', 'OUTLET', 'KIOSK', 'ONLINE', 'WAREHOUSE', 'DISTRIBUTION_CENTER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'TEMPORARILY_CLOSED', 'PERMANENTLY_CLOSED']).optional(),
  emirate: z.enum(['DUBAI', 'ABU_DHABI', 'SHARJAH', 'AJMAN', 'RAS_AL_KHAIMAH', 'FUJAIRAH', 'UMM_AL_QUWAIN']).optional(),
  city: z.string().min(1).optional(),
  address: z.string().min(5).optional(),
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
  }).optional(),
  settings: z.object({
    taxRate: z.number().min(0).max(100).optional(),
    currency: z.string().optional(),
    timezone: z.string().optional(),
    autoReplenishment: z.boolean().optional(),
    minStockThreshold: z.number().min(0).optional(),
    maxStockThreshold: z.number().min(0).optional(),
    enableTransfers: z.boolean().optional(),
    requireTransferApproval: z.boolean().optional(),
    enablePriceSync: z.boolean().optional(),
    enablePromotionSync: z.boolean().optional(),
    emergencyContactEmail: z.string().email().optional().or(z.literal('')),
    notificationSettings: z.object({
      lowStockAlerts: z.boolean().optional(),
      transferAlerts: z.boolean().optional(),
      salesAlerts: z.boolean().optional(),
      emergencyAlerts: z.boolean().optional(),
      emailNotifications: z.boolean().optional(),
      smsNotifications: z.boolean().optional()
    }).optional()
  }).optional()
});

// GET /api/stores/[id] - Get store by ID
export const GET = withTenant(async (req: NextRequest, context: { tenantId: string; user: any; params: { id: string } }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { params, user } = context;
    const { id: storeId } = params;

    // TODO: Replace with actual database query
    const mockStore = {
      id: storeId,
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
      parentStoreId: null,
      parentStore: null,
      childStores: [],
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
        id: 'settings1',
        storeId: storeId,
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
        topProducts: [
          {
            productId: 'prod1',
            productName: 'Oud Al Malaki',
            quantitySold: 25,
            revenue: 12500,
            rank: 1
          },
          {
            productId: 'prod2',
            productName: 'Rose Perfume',
            quantitySold: 18,
            revenue: 9000,
            rank: 2
          }
        ],
        performanceScore: 87.5,
        inventoryTurnover: 6.2,
        stockValue: 890000,
        lowStockItems: 3,
        lastUpdated: new Date()
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      createdById: user.id
    };

    // Check if user has access to this store
    // TODO: Implement proper access control
    const userStores = user.stores || [];
    if (!['OWNER', 'ADMIN'].includes(user.role) && !userStores.includes(storeId)) {
      return apiError('Access denied to this store', 403);
    }

    return apiResponse(mockStore);

  } catch (error) {
    console.error('Error fetching store:', error);
    return apiError('Internal server error', 500);
  }
});

// PUT /api/stores/[id] - Update store
export const PUT = withTenant(async (req: NextRequest, context: { tenantId: string; user: any; params: { id: string } }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { params, user } = context;
    const { id: storeId } = params;
    const body = await req.json();
    const updates = StoreUpdateSchema.parse(body);

    // Check permissions
    const userRole = user.role;
    const userStores = user.stores || [];

    if (!['OWNER', 'ADMIN'].includes(userRole) && !userStores.includes(storeId)) {
      return apiError('Access denied to this store', 403);
    }

    // If updating store code, check uniqueness
    if (updates.code) {
      // TODO: Check if code is unique (excluding current store)
    }

    // TODO: Update store in database
    const updatedStore = {
      id: storeId,
      ...updates,
      updatedAt: new Date()
    };

    // TODO: Update settings if provided
    // TODO: Log the changes
    // TODO: Notify relevant users
    // TODO: Sync changes across the system

    return apiResponse(updatedStore);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error updating store:', error);
    return apiError('Internal server error', 500);
  }
});

// DELETE /api/stores/[id] - Delete store
export const DELETE = withTenant(async (req: NextRequest, context: { tenantId: string; user: any; params: { id: string } }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { params, user } = context;
    const { id: storeId } = params;

    // Check permissions (only owners/admins can delete stores)
    const userRole = user.role;
    if (!['OWNER', 'ADMIN'].includes(userRole)) {
      return apiError('Insufficient permissions', 403);
    }

    // TODO: Check if store can be deleted
    // - No active transfers
    // - No pending orders
    // - No inventory (or confirm archive/transfer)

    // TODO: Archive store instead of hard delete
    // TODO: Update related records
    // TODO: Create audit log entry

    return apiResponse({
      message: 'Store deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting store:', error);
    return apiError('Internal server error', 500);
  }
});