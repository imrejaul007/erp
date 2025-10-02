import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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

    // Build where clause
    const whereClause: any = {};

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
      prisma.store.findMany({
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
      prisma.store.count({ where: whereClause })
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

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const storeData = StoreCreateSchema.parse(body);

    // Check if store code is unique
    const existingStore = await prisma.store.findUnique({
      where: { code: storeData.code }
    });

    if (existingStore) {
      return NextResponse.json(
        { error: 'Store code already exists' },
        { status: 409 }
      );
    }

    // Create store in database
    const newStore = await prisma.store.create({
      data: {
        ...storeData,
        createdById: session.user.id
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
    if (!['OWNER', 'ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
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

    // Bulk update stores
    await prisma.store.updateMany({
      where: {
        id: { in: storeIds }
      },
      data: updates
    });

    return NextResponse.json({
      message: `${storeIds.length} stores updated successfully`
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
    if (!['OWNER', 'SUPER_ADMIN'].includes(userRole)) {
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

    // Soft delete by setting isActive to false
    await prisma.store.updateMany({
      where: {
        id: { in: storeIds }
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({
      message: `${storeIds.length} stores deactivated successfully`
    });

  } catch (error) {
    console.error('Error deleting stores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
