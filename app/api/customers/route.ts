import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

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
export const GET = withTenant(async (req, { tenantId, user }) => {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const customerType = url.searchParams.get('customerType');
    const isVIP = url.searchParams.get('isVIP');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Build where clause with tenantId
    const whereClause: any = { tenantId };

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

    return apiResponse({
      customers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return apiError(error.message || 'Failed to fetch customers', 500);
  }
});

// POST /api/customers - Create new customer
export const POST = withTenant(async (req, { tenantId, user }) => {
  try {
    const body = await req.json();
    const customerData = CustomerCreateSchema.parse(body);

    // Check if email or phone already exists within tenant
    if (customerData.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email: customerData.email, tenantId }
      });

      if (existingCustomer) {
        return apiError('Customer with this email already exists', 409);
      }
    }

    if (customerData.phone) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { phone: customerData.phone, tenantId }
      });

      if (existingCustomer) {
        return apiError('Customer with this phone number already exists', 409);
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
        createdById: user.id,
        tenantId
      }
    });

    return apiResponse(customer, 201);

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error', 400, error.errors);
    }

    console.error('Error creating customer:', error);
    return apiError(error.message || 'Failed to create customer', 500);
  }
});

// PUT /api/customers - Update customer
export const PUT = withTenant(async (req, { tenantId, user }) => {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return apiError('Customer ID is required', 400);
    }

    // Check if customer exists and belongs to tenant
    const existingCustomer = await prisma.customer.findFirst({
      where: { id, tenantId }
    });

    if (!existingCustomer) {
      return apiError('Customer not found', 404);
    }

    // Update customer
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...updateData,
        dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : undefined
      }
    });

    return apiResponse(customer);

  } catch (error: any) {
    console.error('Error updating customer:', error);
    return apiError(error.message || 'Failed to update customer', 500);
  }
});

// DELETE /api/customers - Delete customer
export const DELETE = withTenant(async (req, { tenantId, user }) => {
  try {
    // Check permissions
    if (!['OWNER', 'ADMIN'].includes(user.role)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return apiError('Customer ID is required', 400);
    }

    // Delete customer (hard delete - consider soft delete if needed) with tenant check
    const result = await prisma.customer.deleteMany({
      where: { id, tenantId }
    });

    if (result.count === 0) {
      return apiError('Customer not found', 404);
    }

    return apiResponse({
      message: 'Customer deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return apiError(error.message || 'Failed to delete customer', 500);
  }
});
