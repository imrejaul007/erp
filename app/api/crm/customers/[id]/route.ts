import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
  CustomerType,
  CustomerSegment,
  UAE_EMIRATES
} from '@/types/crm';

const updateCustomerSchema = z.object({
  customerType: z.nativeEnum(CustomerType).optional(),
  segment: z.nativeEnum(CustomerSegment).optional(),
  name: z.string().min(2).optional(),
  nameArabic: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^(\+971|0)?[0-9]{9}$/).optional().or(z.literal('')),
  alternatePhone: z.string().regex(/^(\+971|0)?[0-9]{9}$/).optional().or(z.literal('')),
  address: z.string().optional(),
  addressArabic: z.string().optional(),
  city: z.string().optional(),
  emirate: z.enum(UAE_EMIRATES).optional().or(z.literal('')),
  area: z.string().optional(),
  postalCode: z.string().optional(),
  companyName: z.string().optional(),
  tradeLicense: z.string().optional(),
  taxId: z.string().optional(),
  vatNumber: z.string().optional(),
  dateOfBirth: z.string().transform((str) => str ? new Date(str) : null).optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  language: z.enum(['en', 'ar']).optional(),
  creditLimit: z.number().positive().optional().or(z.literal(null)),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Get customer by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        contacts: {
          orderBy: { isPrimary: 'desc' },
        },
        loyaltyAccount: {
          include: {
            pointsHistory: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
            rewardsClaimed: {
              include: {
                reward: true,
              },
              orderBy: { claimedAt: 'desc' },
              take: 5,
            },
          },
        },
        preferences: true,
        history: {
          include: {
            createdBy: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        tickets: {
          select: {
            id: true,
            ticketNumber: true,
            subject: true,
            status: true,
            priority: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        feedbacks: {
          select: {
            id: true,
            type: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            orders: true,
            tickets: true,
            communications: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Calculate additional metrics
    const totalSpent = await prisma.order.aggregate({
      where: {
        customerId: params.id,
        status: { in: ['DELIVERED', 'COMPLETED'] },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const averageOrderValue = customer._count.orders > 0
      ? Number(totalSpent._sum.totalAmount || 0) / customer._count.orders
      : 0;

    const lastOrder = customer.orders[0];
    const daysSinceLastOrder = lastOrder
      ? Math.floor((new Date().getTime() - lastOrder.createdAt.getTime()) / (1000 * 3600 * 24))
      : null;

    // Transform response
    const customerData = {
      ...customer,
      loyaltyPoints: customer.loyaltyAccount?.points || 0,
      loyaltyTier: customer.loyaltyAccount?.tier || 'BRONZE',
      totalSpent: Number(totalSpent._sum.totalAmount || 0),
      averageOrderValue,
      daysSinceLastOrder,
      totalOrders: customer._count.orders,
      totalTickets: customer._count.tickets,
      totalCommunications: customer._count.communications,
    };

    return NextResponse.json(customerData);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT - Update customer
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateCustomerSchema.parse(body);

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: params.id },
    });

    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Check for duplicate email/phone if being updated
    if (validatedData.email && validatedData.email !== existingCustomer.email) {
      const duplicateEmail = await prisma.customer.findFirst({
        where: {
          email: validatedData.email,
          id: { not: params.id },
        },
      });
      if (duplicateEmail) {
        return NextResponse.json(
          { error: 'Customer with this email already exists' },
          { status: 400 }
        );
      }
    }

    if (validatedData.phone && validatedData.phone !== existingCustomer.phone) {
      const duplicatePhone = await prisma.customer.findFirst({
        where: {
          phone: validatedData.phone,
          id: { not: params.id },
        },
      });
      if (duplicatePhone) {
        return NextResponse.json(
          { error: 'Customer with this phone number already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare update data - convert empty strings to null
    const updateData: any = {};
    Object.keys(validatedData).forEach((key) => {
      const value = (validatedData as any)[key];
      updateData[key] = value === '' ? null : value;
    });

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id: params.id },
      data: updateData,
      include: {
        loyaltyAccount: true,
        contacts: true,
        preferences: true,
      },
    });

    // Log the update in customer history
    const changedFields = Object.keys(validatedData).filter(
      (key) => (validatedData as any)[key] !== (existingCustomer as any)[key]
    );

    if (changedFields.length > 0) {
      await prisma.customerHistory.create({
        data: {
          customerId: params.id,
          eventType: 'CUSTOMER_UPDATED',
          description: `Customer information updated: ${changedFields.join(', ')}`,
          createdById: session.user.id,
        },
      });
    }

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE - Delete customer (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          select: { id: true },
        },
        tickets: {
          select: { id: true },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Check if customer has orders or tickets - prevent deletion
    if (customer.orders.length > 0 || customer.tickets.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete customer with existing orders or support tickets. Please deactivate instead.'
        },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    const deletedCustomer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        isActive: false,
        status: 'INACTIVE',
      },
    });

    // Log the deletion
    await prisma.customerHistory.create({
      data: {
        customerId: params.id,
        eventType: 'CUSTOMER_DEACTIVATED',
        description: `Customer account deactivated by ${session.user.name || session.user.email}`,
        createdById: session.user.id,
      },
    });

    return NextResponse.json({
      message: 'Customer deactivated successfully',
      customer: deletedCustomer
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}