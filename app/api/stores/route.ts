import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schemas matching actual database schema
const StoreCreateSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  nameArabic: z.string().optional(),
  code: z.string().min(2, 'Store code must be at least 2 characters').max(10),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  emirate: z.string().min(1, 'Emirate is required'),
  city: z.string().min(1, 'City is required'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  managerId: z.string().optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  isActive: z.boolean().default(true)
});

const StoreFiltersSchema = z.object({
  search: z.string().optional(),
  emirate: z.string().optional(),
  city: z.string().optional(),
  isActive: z.string().optional().transform(val => val === 'true'),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  sortBy: z.string().optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
});

// GET /api/stores - List stores with filters
export const GET = withTenant(async (req, { tenantId, user }) => {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const filters = StoreFiltersSchema.parse(params);

    // Build where clause with tenantId
    const whereClause: any = { tenantId };

    if (filters.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.emirate) {
      whereClause.emirate = filters.emirate;
    }

    if (filters.city) {
      whereClause.city = filters.city;
    }

    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    // Fetch stores from database
    const [stores, total] = await Promise.all([
      prisma.stores.findMany({
        where: whereClause,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              inventory: true,
              orders: true,
              userStores: true
            }
          }
        },
        orderBy: {
          [filters.sortBy]: filters.sortOrder
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit
      }),
      prisma.stores.count({ where: whereClause })
    ]);

    // Enrich with computed fields
    const enrichedStores = stores.map(store => ({
      ...store,
      productCount: store._count.inventory,
      orderCount: store._count.orders,
      staffCount: store._count.userStores
    }));

    const response = {
      data: enrichedStores,
      pagination: {
        total,
        pages: Math.ceil(total / filters.limit),
        currentPage: filters.page,
        hasNextPage: filters.page * filters.limit < total,
        hasPrevPage: filters.page > 1
      }
    };

    return apiResponse(response);

  } catch (error: any) {
    console.error('Error fetching stores:', error);
    return apiError(error.message || 'Failed to fetch stores', 500);
  }
});

// POST /api/stores - Create new store
export const POST = withTenant(async (req, { tenantId, user }) => {
  try {
    // Check permissions
    if (!['OWNER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const storeData = StoreCreateSchema.parse(body);

    // Check if store code is unique within tenant
    const existingStore = await prisma.stores.findFirst({
      where: { code: storeData.code, tenantId }
    });

    if (existingStore) {
      return apiError('Store code already exists', 409);
    }

    // Create store in database
    const newStore = await prisma.stores.create({
      data: {
        ...storeData,
        createdById: user.id,
        tenantId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return apiResponse(newStore, 201);

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error creating store:', error);
    return apiError(error.message || 'Failed to create store', 500);
  }
});

// PUT /api/stores - Bulk update stores
export const PUT = withTenant(async (req, { tenantId, user }) => {
  try {
    // Check permissions
    if (!['OWNER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const { storeIds, updates } = body;

    if (!Array.isArray(storeIds) || storeIds.length === 0) {
      return apiError('Store IDs array is required', 400);
    }

    // Bulk update stores (only within tenant)
    const result = await prisma.stores.updateMany({
      where: {
        id: { in: storeIds },
        tenantId
      },
      data: updates
    });

    return apiResponse({
      message: `${result.count} stores updated successfully`
    });

  } catch (error: any) {
    console.error('Error bulk updating stores:', error);
    return apiError(error.message || 'Failed to update stores', 500);
  }
});

// DELETE /api/stores - Bulk delete stores
export const DELETE = withTenant(async (req, { tenantId, user }) => {
  try {
    // Check permissions (only owners/admins can delete stores)
    if (!['OWNER', 'SUPER_ADMIN'].includes(user.role)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const { storeIds } = body;

    if (!Array.isArray(storeIds) || storeIds.length === 0) {
      return apiError('Store IDs array is required', 400);
    }

    // Soft delete by setting isActive to false (only within tenant)
    const result = await prisma.stores.updateMany({
      where: {
        id: { in: storeIds },
        tenantId
      },
      data: {
        isActive: false
      }
    });

    return apiResponse({
      message: `${result.count} stores deactivated successfully`
    });

  } catch (error: any) {
    console.error('Error deleting stores:', error);
    return apiError(error.message || 'Failed to delete stores', 500);
  }
});
