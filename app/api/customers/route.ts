import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CustomerCreateSchema = z.object({
  name: z.string().min(2, 'Customer name must be at least 2 characters'),
  nameArabic: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  customerType: z.enum(['INDIVIDUAL', 'CORPORATE', 'GOVERNMENT']).default('INDIVIDUAL'),
  isVIP: z.boolean().default(false),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  emirate: z.string().optional(),
  city: z.string().optional(),
  loyaltyPoints: z.number().default(0),
  notes: z.string().optional()
});

// GET /api/customers - List all customers
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const customerType = url.searchParams.get('customerType');
    const isVIP = url.searchParams.get('isVIP');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Build where clause
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameArabic: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (customerType) {
      whereClause.customerType = customerType;
    }

    if (isVIP !== null && isVIP !== undefined) {
      whereClause.isVIP = isVIP === 'true';
    }

    // Fetch customers with relations
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: whereClause,
        include: {
          orders: {
            select: { id: true, totalAmount: true, status: true }
          },
          payments: {
            select: { id: true, amount: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.customer.count({ where: whereClause })
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create new customer
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const customerData = CustomerCreateSchema.parse(body);

    // Check if email or phone already exists
    if (customerData.email) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { email: customerData.email }
      });

      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Customer with this email already exists' },
          { status: 409 }
        );
      }
    }

    if (customerData.phone) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { phone: customerData.phone }
      });

      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Customer with this phone number already exists' },
          { status: 409 }
        );
      }
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        name: customerData.name,
        nameArabic: customerData.nameArabic,
        email: customerData.email,
        phone: customerData.phone,
        customerType: customerData.customerType,
        isVIP: customerData.isVIP,
        dateOfBirth: customerData.dateOfBirth ? new Date(customerData.dateOfBirth) : null,
        address: customerData.address,
        emirate: customerData.emirate,
        city: customerData.city,
        loyaltyPoints: customerData.loyaltyPoints,
        notes: customerData.notes,
        createdById: session.user.id
      }
    });

    return NextResponse.json(customer, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/customers - Update customer
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Update customer
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...updateData,
        dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : undefined
      }
    });

    return NextResponse.json(customer);

  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers - Delete customer
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Delete customer (hard delete - consider soft delete if needed)
    await prisma.customer.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
