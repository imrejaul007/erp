import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schemas
const SyncEventSchema = z.object({
  type: z.enum(['INVENTORY_UPDATE', 'PRICE_UPDATE', 'PROMOTION_UPDATE', 'TRANSFER_UPDATE', 'STORE_UPDATE']),
  storeId: z.string().optional(),
  entityId: z.string().min(1, 'Entity ID is required'),
  entityType: z.string().min(1, 'Entity type is required'),
  data: z.record(z.any())
});

const PricingSyncSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  basePrice: z.number().min(0, 'Base price must be non-negative'),
  storeAdjustments: z.array(z.object({
    storeId: z.string().min(1, 'Store ID is required'),
    adjustmentPercentage: z.number().min(-100).max(1000, 'Adjustment percentage out of range'),
    reason: z.string().optional()
  })),
  effectiveDate: z.string().datetime().optional()
});

const PromotionSyncSchema = z.object({
  name: z.string().min(1, 'Promotion name is required'),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y', 'BULK_DISCOUNT']),
  discountValue: z.number().min(0, 'Discount value must be positive'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  applicableStores: z.array(z.string()).min(1, 'At least one store must be selected'),
  applicableProducts: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
  conditions: z.array(z.object({
    type: z.enum(['MIN_QUANTITY', 'MIN_AMOUNT', 'CUSTOMER_TYPE', 'FIRST_PURCHASE']),
    value: z.number(),
    operator: z.enum(['EQUALS', 'GREATER_THAN', 'LESS_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL'])
  })).optional()
});

// GET /api/sync - Get sync events and status
export const GET = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    // Check permissions
    const userRole = user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
      return apiError('Insufficient permissions', 403);
    }

    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const storeId = url.searchParams.get('storeId');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Filter by user's accessible stores if not admin/owner
    const userStores = user.stores || [];
    const accessibleStores = ['OWNER', 'ADMIN'].includes(userRole) ? null : userStores;

    // TODO: Replace with actual database queries
    const mockSyncEvents = [
      {
        id: '1',
        type: 'INVENTORY_UPDATE',
        storeId: '1',
        entityId: 'prod1',
        entityType: 'Product',
        data: {
          productId: 'prod1',
          productName: 'Oud Al Malaki',
          storeId: '1',
          storeName: 'Dubai Mall Store',
          oldQuantity: 48,
          newQuantity: 45,
          changeReason: 'Sale'
        },
        timestamp: new Date('2024-09-16T10:30:00Z'),
        status: 'COMPLETED',
        error: null
      },
      {
        id: '2',
        type: 'PRICE_UPDATE',
        storeId: null, // Global price update
        entityId: 'prod2',
        entityType: 'Product',
        data: {
          productId: 'prod2',
          productName: 'Rose Perfume',
          oldBasePrice: 380,
          newBasePrice: 400,
          affectedStores: ['1', '2']
        },
        timestamp: new Date('2024-09-16T09:15:00Z'),
        status: 'COMPLETED',
        error: null
      },
      {
        id: '3',
        type: 'TRANSFER_UPDATE',
        storeId: '1',
        entityId: 'transfer_1',
        entityType: 'Transfer',
        data: {
          transferId: 'transfer_1',
          transferNumber: 'TRF24090001',
          fromStoreId: '1',
          toStoreId: '2',
          oldStatus: 'PENDING_APPROVAL',
          newStatus: 'APPROVED'
        },
        timestamp: new Date('2024-09-16T08:45:00Z'),
        status: 'COMPLETED',
        error: null
      },
      {
        id: '4',
        type: 'INVENTORY_UPDATE',
        storeId: '2',
        entityId: 'prod3',
        entityType: 'Product',
        data: {
          productId: 'prod3',
          productName: 'Arabian Nights',
          storeId: '2',
          storeName: 'Mall of the Emirates',
          oldQuantity: 5,
          newQuantity: 0,
          changeReason: 'Transfer out'
        },
        timestamp: new Date('2024-09-15T16:20:00Z'),
        status: 'FAILED',
        error: 'Database connection timeout'
      }
    ];

    // Apply filters
    let filteredEvents = mockSyncEvents;

    if (accessibleStores) {
      filteredEvents = filteredEvents.filter(event =>
        !event.storeId || accessibleStores.includes(event.storeId)
      );
    }

    if (type) {
      filteredEvents = filteredEvents.filter(event => event.type === type);
    }

    if (storeId) {
      filteredEvents = filteredEvents.filter(event => event.storeId === storeId);
    }

    // Sort by timestamp (newest first) and apply limit
    filteredEvents = filteredEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    // Get sync statistics
    const stats = {
      total: filteredEvents.length,
      completed: filteredEvents.filter(e => e.status === 'COMPLETED').length,
      failed: filteredEvents.filter(e => e.status === 'FAILED').length,
      inProgress: filteredEvents.filter(e => e.status === 'IN_PROGRESS').length,
      lastSync: filteredEvents.length > 0 ? filteredEvents[0].timestamp : null
    };

    return apiResponse({
      events: filteredEvents,
      stats,
      isConnected: true, // WebSocket connection status
      autoSyncEnabled: true // Global auto-sync setting
    });

  } catch (error) {
    console.error('Error fetching sync events:', error);
    return apiError('Internal server error', 500);
  }
});

// POST /api/sync - Trigger sync operations
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    // Check permissions
    const userRole = user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const { action, data } = body;

    const userStores = user.stores || [];

    switch (action) {
      case 'manual_sync':
        const eventData = SyncEventSchema.parse(data);

        // Check store access if storeId is provided
        if (eventData.storeId && !['OWNER', 'ADMIN'].includes(userRole)) {
          if (!userStores.includes(eventData.storeId)) {
            return apiError('Access denied to this store', 403);
          }
        }

        // TODO: Create sync event and trigger sync process
        const syncEvent = {
          id: `sync_${Date.now()}`,
          ...eventData,
          timestamp: new Date(),
          status: 'IN_PROGRESS',
          error: null
        };

        // TODO: Process sync in background
        // For demo, we'll simulate immediate completion
        syncEvent.status = 'COMPLETED';

        return apiResponse(syncEvent, 201);

      case 'pricing_sync':
        const pricingData = PricingSyncSchema.parse(data);

        // Check store access
        const accessibleStores = ['OWNER', 'ADMIN'].includes(userRole) ?
          pricingData.storeAdjustments.map(adj => adj.storeId) :
          pricingData.storeAdjustments.filter(adj => userStores.includes(adj.storeId)).map(adj => adj.storeId);

        if (accessibleStores.length !== pricingData.storeAdjustments.length) {
          return apiError('Access denied to some stores', 403);
        }

        // TODO: Update pricing in database
        // TODO: Create sync events for each store
        // TODO: Broadcast price changes via WebSocket

        const pricingSyncResult = {
          productId: pricingData.productId,
          basePrice: pricingData.basePrice,
          storeAdjustments: pricingData.storeAdjustments,
          effectiveDate: pricingData.effectiveDate || new Date().toISOString(),
          syncedAt: new Date().toISOString(),
          syncedBy: user.id
        };

        return apiResponse(pricingSyncResult);

      case 'promotion_sync':
        const promotionData = PromotionSyncSchema.parse(data);

        // Check store access
        const accessiblePromotionStores = ['OWNER', 'ADMIN'].includes(userRole) ?
          promotionData.applicableStores :
          promotionData.applicableStores.filter(storeId => userStores.includes(storeId));

        if (accessiblePromotionStores.length !== promotionData.applicableStores.length) {
          return apiError('Access denied to some stores', 403);
        }

        // TODO: Create/update promotion in database
        // TODO: Create sync events for each store
        // TODO: Schedule promotion activation/deactivation

        const promotionSyncResult = {
          id: `promo_${Date.now()}`,
          ...promotionData,
          startDate: new Date(promotionData.startDate),
          endDate: new Date(promotionData.endDate),
          isActive: new Date(promotionData.startDate) <= new Date(),
          syncedAt: new Date().toISOString(),
          syncedBy: user.id
        };

        return apiResponse(promotionSyncResult);

      case 'inventory_sync':
        const { storeIds } = data;

        if (!Array.isArray(storeIds)) {
          return apiError('Store IDs array is required', 400);
        }

        // Check store access
        const accessibleInventoryStores = ['OWNER', 'ADMIN'].includes(userRole) ?
          storeIds :
          storeIds.filter((id: string) => userStores.includes(id));

        if (accessibleInventoryStores.length !== storeIds.length) {
          return apiError('Access denied to some stores', 403);
        }

        // TODO: Trigger inventory sync for specified stores
        const inventorySyncResults = accessibleInventoryStores.map((storeId: string) => ({
          storeId,
          status: 'IN_PROGRESS',
          startedAt: new Date().toISOString()
        }));

        return apiResponse({
          message: `Inventory sync started for ${accessibleInventoryStores.length} stores`,
          results: inventorySyncResults
        });

      case 'retry_failed':
        const { eventIds } = data;

        if (!Array.isArray(eventIds)) {
          return apiError('Event IDs array is required', 400);
        }

        // TODO: Retry failed sync events
        const retryResults = eventIds.map((id: string) => ({
          eventId: id,
          status: 'RETRY',
          retriedAt: new Date().toISOString()
        }));

        return apiResponse({
          message: `${eventIds.length} sync events scheduled for retry`,
          results: retryResults
        });

      case 'toggle_auto_sync':
        const { enabled } = data;

        // TODO: Update auto-sync setting in database
        // TODO: Start/stop background sync processes

        return apiResponse({
          autoSyncEnabled: enabled,
          message: `Auto-sync ${enabled ? 'enabled' : 'disabled'}`,
          updatedAt: new Date().toISOString()
        });

      default:
        return apiError('Invalid action', 400);
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error processing sync request:', error);
    return apiError('Internal server error', 500);
  }
});

// PUT /api/sync - Update sync settings
export const PUT = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    // Check permissions (only admins can change sync settings)
    const userRole = user.role;
    if (!['OWNER', 'ADMIN'].includes(userRole)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const { settings } = body;

    // TODO: Update sync settings in database
    const updatedSettings = {
      autoSyncEnabled: settings.autoSyncEnabled ?? true,
      syncInterval: settings.syncInterval ?? 300, // seconds
      retryAttempts: settings.retryAttempts ?? 3,
      timeoutDuration: settings.timeoutDuration ?? 30, // seconds
      enableWebSocket: settings.enableWebSocket ?? true,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };

    return apiResponse(updatedSettings);

  } catch (error) {
    console.error('Error updating sync settings:', error);
    return apiError('Internal server error', 500);
  }
});