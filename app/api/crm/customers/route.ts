import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
  CustomerType,
  CustomerSegment,
  CreateCustomerRequest,
  CustomerSearchFilters,
  UAE_EMIRATES
} from '@/types/crm';

// Validation schemas
const createCustomerSchema = z.object({
  customerType: z.nativeEnum(CustomerType),
  segment: z.nativeEnum(CustomerSegment),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameArabic: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^(\+971|0)?[0-9]{9}$/, 'Invalid UAE phone number').optional(),
  alternatePhone: z.string().regex(/^(\+971|0)?[0-9]{9}$/, 'Invalid UAE phone number').optional(),
  address: z.string().optional(),
  addressArabic: z.string().optional(),
  city: z.string().optional(),
  emirate: z.enum(UAE_EMIRATES).optional(),
  area: z.string().optional(),
  postalCode: z.string().optional(),
  companyName: z.string().optional(),
  tradeLicense: z.string().optional(),
  taxId: z.string().optional(),
  vatNumber: z.string().optional(),
  dateOfBirth: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  language: z.enum(['en', 'ar']).default('en'),
  creditLimit: z.number().positive().optional(),
});

const searchFiltersSchema = z.object({
  search: z.string().optional(),
  segment: z.nativeEnum(CustomerSegment).optional(),
  customerType: z.nativeEnum(CustomerType).optional(),
  emirate: z.enum(UAE_EMIRATES).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
  dateFrom: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  dateTo: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  minLifetimeValue: z.number().optional(),
  maxLifetimeValue: z.number().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// GET - List customers with search and filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = searchFiltersSchema.parse({
      search: searchParams.get('search'),
      segment: searchParams.get('segment'),
      customerType: searchParams.get('customerType'),
      emirate: searchParams.get('emirate'),
      status: searchParams.get('status'),
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      minLifetimeValue: searchParams.get('minLifetimeValue') ? Number(searchParams.get('minLifetimeValue')) : undefined,
      maxLifetimeValue: searchParams.get('maxLifetimeValue') ? Number(searchParams.get('maxLifetimeValue')) : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    });

    // Build where clause
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { nameArabic: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.segment) where.segment = filters.segment;
    if (filters.customerType) where.customerType = filters.customerType;
    if (filters.emirate) where.emirate = filters.emirate;
    if (filters.status) where.status = filters.status;

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    if (filters.minLifetimeValue || filters.maxLifetimeValue) {
      where.totalLifetimeValue = {};
      if (filters.minLifetimeValue) where.totalLifetimeValue.gte = filters.minLifetimeValue;
      if (filters.maxLifetimeValue) where.totalLifetimeValue.lte = filters.maxLifetimeValue;
    }

    const skip = (filters.page - 1) * filters.limit;

    // Get customers with related data
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: filters.limit,
        include: {
          loyaltyAccount: {
            select: {
              points: true,
              tier: true,
            },
          },
          orders: {
            select: {
              id: true,
              totalAmount: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
          _count: {
            select: {
              orders: true,
              tickets: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.customer.count({ where }),
    ]);

    // Transform data for response
    const transformedCustomers = customers.map((customer) => ({
      ...customer,
      loyaltyPoints: customer.loyaltyAccount?.points || 0,
      loyaltyTier: customer.loyaltyAccount?.tier || 'BRONZE',
      totalOrders: customer._count.orders,
      totalTickets: customer._count.tickets,
      lastOrderDate: customer.orders[0]?.createdAt || null,
      lastOrderAmount: customer.orders[0]?.totalAmount || 0,
    }));

    return NextResponse.json({
      customers: transformedCustomers,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST - Create new customer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createCustomerSchema.parse(body);

    // Generate customer code
    const customerCount = await prisma.customer.count();
    const customerCode = `CUS-${String(customerCount + 1).padStart(6, '0')}`;

    // Check for duplicate email/phone if provided
    if (validatedData.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email: validatedData.email },
      });
      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Customer with this email already exists' },
          { status: 400 }
        );
      }
    }

    if (validatedData.phone) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { phone: validatedData.phone },
      });
      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Customer with this phone number already exists' },
          { status: 400 }
        );
      }
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        code: customerCode,
        customerType: validatedData.customerType,
        segment: validatedData.segment,
        name: validatedData.name,
        nameArabic: validatedData.nameArabic,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        alternatePhone: validatedData.alternatePhone || null,
        address: validatedData.address || null,
        addressArabic: validatedData.addressArabic || null,
        city: validatedData.city || null,
        emirate: validatedData.emirate || null,
        area: validatedData.area || null,
        postalCode: validatedData.postalCode || null,
        companyName: validatedData.companyName || null,
        tradeLicense: validatedData.tradeLicense || null,
        taxId: validatedData.taxId || null,
        vatNumber: validatedData.vatNumber || null,
        dateOfBirth: validatedData.dateOfBirth || null,
        gender: validatedData.gender || null,
        nationality: validatedData.nationality || null,
        language: validatedData.language,
        creditLimit: validatedData.creditLimit || null,
        createdById: session.user.id,
      },
      include: {
        loyaltyAccount: true,
      },
    });

    // Create loyalty account for customer
    await prisma.loyaltyAccount.create({
      data: {
        customerId: customer.id,
        points: 0,
        tier: 'BRONZE',
      },
    });

    // Log customer creation in history
    await prisma.customerHistory.create({
      data: {
        customerId: customer.id,
        eventType: 'CUSTOMER_CREATED',
        description: `Customer account created for ${customer.name}`,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}