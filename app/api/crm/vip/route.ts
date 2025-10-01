import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { LoyaltyTier } from '@/types/crm';

const createBenefitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameArabic: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  descriptionArabic: z.string().optional(),
  type: z.enum(['DISCOUNT', 'FREE_SHIPPING', 'EARLY_ACCESS', 'PERSONAL_SHOPPER', 'PRIORITY_SUPPORT']),
  value: z.string().optional(), // JSON string with benefit details
  minTier: z.nativeEnum(LoyaltyTier),
});

const assignShopperSchema = z.object({
  customerId: z.string().cuid(),
  shopperId: z.string().cuid(),
});

// GET - VIP Management endpoints
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    switch (endpoint) {
      case 'dashboard':
        return await getVIPDashboard();

      case 'customers':
        return await getVIPCustomers();

      case 'benefits':
        return await getVIPBenefits();

      case 'personal-shoppers':
        return await getPersonalShoppers();

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in VIP management:', error);
    return NextResponse.json(
      { error: 'Failed to fetch VIP data' },
      { status: 500 }
    );
  }
}

// POST - VIP Management actions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action;

    switch (action) {
      case 'create-benefit':
        return await createVIPBenefit(body, session.user.id);

      case 'assign-shopper':
        return await assignPersonalShopper(body, session.user.id);

      case 'upgrade-customer':
        return await upgradeCustomerToVIP(body, session.user.id);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in VIP management action:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to perform VIP action' },
      { status: 500 }
    );
  }
}

// VIP Dashboard
async function getVIPDashboard() {
  const [
    vipCount,
    totalVIPRevenue,
    vipLoyaltyDistribution,
    recentVIPActivity,
    personalShopperStats,
  ] = await Promise.all([
    // Total VIP customers
    prisma.customer.count({
      where: {
        segment: 'VIP',
        isActive: true,
      },
    }),

    // VIP revenue (last 12 months)
    prisma.order.aggregate({
      where: {
        customer: { segment: 'VIP' },
        createdAt: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        },
        status: { in: ['DELIVERED', 'COMPLETED'] },
      },
      _sum: {
        totalAmount: true,
      },
      _count: true,
    }),


    // VIP loyalty tier distribution
    prisma.customer.findMany({
      where: {
        segment: 'VIP',
        isActive: true,
      },
      include: {
        loyaltyAccount: {
          select: {
            tier: true,
            points: true,
          },
        },
      },
    }).then(customers => {
      const tierMap = new Map();
      customers.forEach(customer => {
        const tier = customer.loyaltyAccount?.tier || 'BRONZE';
        tierMap.set(tier, (tierMap.get(tier) || 0) + 1);
      });
      return Array.from(tierMap.entries()).map(([tier, count]) => ({ tier, count }));
    }),

    // Recent VIP activity
    prisma.customerHistory.findMany({
      where: {
        customer: { segment: 'VIP' },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      include: {
        customer: {
          select: {
            name: true,
            code: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),

    // Personal shopper statistics
    prisma.personalShopper.findMany({
      where: { isActive: true },
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            customer: {
              select: {
                name: true,
                orders: {
                  where: {
                    createdAt: {
                      gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
                    },
                    status: { in: ['DELIVERED', 'COMPLETED'] },
                  },
                  select: {
                    totalAmount: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            assignments: {
              where: { isActive: true },
            },
          },
        },
      },
    }),
  ]);

  const avgVIPOrderValue = totalVIPRevenue._count > 0
    ? Number(totalVIPRevenue._sum.totalAmount || 0) / totalVIPRevenue._count
    : 0;

  // Process personal shopper stats
  const personalShopperMetrics = personalShopperStats.map(shopper => {
    const totalRevenue = shopper.assignments.reduce((sum, assignment) => {
      const customerRevenue = assignment.customer.orders.reduce(
        (customerSum, order) => customerSum + Number(order.totalAmount),
        0
      );
      return sum + customerRevenue;
    }, 0);

    return {
      id: shopper.id,
      name: shopper.name,
      nameArabic: shopper.nameArabic,
      activeCustomers: shopper._count.assignments,
      totalRevenue,
      languages: shopper.languages,
      specialties: shopper.specialties,
    };
  });

  return NextResponse.json({
    overview: {
      totalVIPCustomers: vipCount,
      totalRevenue: Number(totalVIPRevenue._sum.totalAmount || 0),
      avgOrderValue: Math.round(avgVIPOrderValue * 100) / 100,
      totalOrders: totalVIPRevenue._count,
    },
    loyaltyDistribution: vipLoyaltyDistribution,
    recentActivity: recentVIPActivity,
    personalShoppers: personalShopperMetrics,
  });
}

// Get VIP Customers
async function getVIPCustomers() {
  const vipCustomers = await prisma.customer.findMany({
    where: {
      segment: 'VIP',
      isActive: true,
    },
    include: {
      loyaltyAccount: {
        select: {
          points: true,
          tier: true,
          totalEarned: true,
        },
      },
      orders: {
        where: {
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: {
          orders: {
            where: {
              status: { in: ['DELIVERED', 'COMPLETED'] },
            },
          },
        },
      },
    },
    orderBy: { totalLifetimeValue: 'desc' },
  });

  // Get personal shopper assignments
  const customerIds = vipCustomers.map(c => c.id);
  const personalShopperAssignments = await prisma.personalShopperAssignment.findMany({
    where: {
      customerId: { in: customerIds },
      isActive: true,
    },
    include: {
      shopper: {
        select: {
          id: true,
          name: true,
          nameArabic: true,
        },
      },
    },
  });

  const vipCustomersWithDetails = vipCustomers.map(customer => {
    const assignment = personalShopperAssignments.find(a => a.customerId === customer.id);
    const lastOrder = customer.orders[0];
    const daysSinceLastOrder = lastOrder
      ? Math.floor((new Date().getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      ...customer,
      personalShopper: assignment?.shopper || null,
      lastOrderDate: lastOrder?.createdAt || null,
      lastOrderAmount: lastOrder?.totalAmount || 0,
      daysSinceLastOrder,
      totalOrders: customer._count.orders,
      loyaltyPoints: customer.loyaltyAccount?.points || 0,
      loyaltyTier: customer.loyaltyAccount?.tier || 'BRONZE',
      totalEarned: customer.loyaltyAccount?.totalEarned || 0,
    };
  });

  return NextResponse.json(vipCustomersWithDetails);
}

// Get VIP Benefits
async function getVIPBenefits() {
  const benefits = await prisma.vipBenefit.findMany({
    where: { isActive: true },
    orderBy: { minTier: 'asc' },
  });

  return NextResponse.json(benefits);
}

// Get Personal Shoppers
async function getPersonalShoppers() {
  const shoppers = await prisma.personalShopper.findMany({
    where: { isActive: true },
    include: {
      assignments: {
        where: { isActive: true },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              nameArabic: true,
              segment: true,
              totalLifetimeValue: true,
            },
          },
        },
      },
      user: {
        select: {
          email: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(shoppers);
}

// Create VIP Benefit
async function createVIPBenefit(body: any, userId: string) {
  const validatedData = createBenefitSchema.parse(body);

  const benefit = await prisma.vipBenefit.create({
    data: {
      name: validatedData.name,
      nameArabic: validatedData.nameArabic,
      description: validatedData.description,
      descriptionArabic: validatedData.descriptionArabic,
      type: validatedData.type,
      value: validatedData.value,
      minTier: validatedData.minTier,
    },
  });

  return NextResponse.json(benefit, { status: 201 });
}

// Assign Personal Shopper
async function assignPersonalShopper(body: any, userId: string) {
  const validatedData = assignShopperSchema.parse(body);

  // Check if customer exists and is VIP
  const customer = await prisma.customer.findUnique({
    where: { id: validatedData.customerId },
    select: { id: true, segment: true, name: true },
  });

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  if (customer.segment !== 'VIP') {
    return NextResponse.json(
      { error: 'Personal shoppers can only be assigned to VIP customers' },
      { status: 400 }
    );
  }

  // Check if shopper exists
  const shopper = await prisma.personalShopper.findUnique({
    where: { id: validatedData.shopperId },
    select: { id: true, name: true },
  });

  if (!shopper) {
    return NextResponse.json({ error: 'Personal shopper not found' }, { status: 404 });
  }

  // Check if customer already has an active assignment
  const existingAssignment = await prisma.personalShopperAssignment.findFirst({
    where: {
      customerId: validatedData.customerId,
      isActive: true,
    },
  });

  if (existingAssignment) {
    // Deactivate existing assignment
    await prisma.personalShopperAssignment.update({
      where: { id: existingAssignment.id },
      data: { isActive: false },
    });
  }

  // Create new assignment
  const assignment = await prisma.personalShopperAssignment.create({
    data: {
      customerId: validatedData.customerId,
      shopperId: validatedData.shopperId,
    },
    include: {
      customer: {
        select: { name: true, code: true },
      },
      shopper: {
        select: { name: true, nameArabic: true },
      },
    },
  });

  // Log in customer history
  await prisma.customerHistory.create({
    data: {
      customerId: validatedData.customerId,
      eventType: 'PERSONAL_SHOPPER_ASSIGNED',
      description: `Personal shopper assigned: ${shopper.name}`,
      referenceId: assignment.id,
      createdById: userId,
    },
  });

  return NextResponse.json({
    success: true,
    assignment,
    message: 'Personal shopper assigned successfully',
  });
}

// Upgrade Customer to VIP
async function upgradeCustomerToVIP(body: any, userId: string) {
  const { customerId } = body;

  if (!customerId) {
    return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
  }

  // Get customer
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      name: true,
      segment: true,
      totalLifetimeValue: true,
    },
  });

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  if (customer.segment === 'VIP') {
    return NextResponse.json(
      { error: 'Customer is already VIP' },
      { status: 400 }
    );
  }

  // Upgrade customer to VIP
  const updatedCustomer = await prisma.customer.update({
    where: { id: customerId },
    data: { segment: 'VIP' },
  });

  // Create loyalty account if not exists
  let loyaltyAccount = await prisma.loyaltyAccount.findUnique({
    where: { customerId },
  });

  if (!loyaltyAccount) {
    loyaltyAccount = await prisma.loyaltyAccount.create({
      data: {
        customerId,
        points: 500, // Welcome bonus for VIP upgrade
        tier: 'SILVER', // Start VIP customers at Silver tier
      },
    });

    // Add welcome bonus transaction
    await prisma.loyaltyTransaction.create({
      data: {
        accountId: loyaltyAccount.id,
        type: 'BONUS',
        points: 500,
        description: 'VIP upgrade welcome bonus',
      },
    });
  } else {
    // Add VIP upgrade bonus
    await prisma.loyaltyTransaction.create({
      data: {
        accountId: loyaltyAccount.id,
        type: 'BONUS',
        points: 500,
        description: 'VIP upgrade bonus',
      },
    });

    await prisma.loyaltyAccount.update({
      where: { id: loyaltyAccount.id },
      data: {
        points: loyaltyAccount.points + 500,
        totalEarned: loyaltyAccount.totalEarned + 500,
      },
    });
  }

  // Log in customer history
  await prisma.customerHistory.create({
    data: {
      customerId,
      eventType: 'VIP_UPGRADE',
      description: `Customer upgraded to VIP segment with 500 bonus points`,
      amount: 500,
      createdById: userId,
    },
  });

  return NextResponse.json({
    success: true,
    customer: updatedCustomer,
    loyaltyAccount,
    message: 'Customer successfully upgraded to VIP',
  });
}