import { prisma } from '@/lib/prisma';

export async function getCustomers(data: any, session: any) {
  const { search, customerType, isVIP, limit = 50, offset = 0 } = data;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (customerType) {
    where.customerType = customerType;
  }

  if (isVIP !== undefined) {
    where.isVIP = isVIP;
  }

  const customers = await prisma.customer.findMany({
    where,
    include: {
      orders: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          orders: true,
          payments: true,
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: { totalSpent: 'desc' },
  });

  const total = await prisma.customer.count({ where });

  return {
    data: customers,
    pagination: {
      total,
      limit,
      offset,
      hasMore: total > offset + limit,
    },
  };
}

export async function createCustomer(data: any, session: any) {
  const {
    name,
    nameArabic,
    email,
    phone,
    customerType,
    isVIP,
    dateOfBirth,
    address,
    emirate,
    city,
    notes,
  } = data;

  const customer = await prisma.customer.create({
    data: {
      name,
      nameArabic,
      email,
      phone,
      customerType: customerType || 'INDIVIDUAL',
      isVIP: isVIP || false,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      address,
      emirate,
      city,
      notes,
      createdById: session.user.id,
    },
  });

  return { success: true, data: customer };
}

export async function updateCustomer(data: any, session: any) {
  const { customerId, ...updateData } = data;

  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: updateData,
  });

  return { success: true, data: customer };
}

export async function getCustomerDetails(data: any, session: any) {
  const { customerId } = data;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  // Calculate customer stats
  const totalOrders = customer.orders.length;
  const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.grandTotal), 0);
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const lastPurchase = customer.orders[0]?.createdAt || null;

  // Get favorite products
  const productFrequency: { [key: string]: number } = {};
  customer.orders.forEach((order) => {
    order.items.forEach((item) => {
      productFrequency[item.productId] = (productFrequency[item.productId] || 0) + item.quantity;
    });
  });

  const favoriteProducts = Object.entries(productFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([productId]) =>
      customer.orders
        .flatMap((o) => o.items)
        .find((i) => i.productId === productId)?.product
    );

  return {
    data: {
      ...customer,
      stats: {
        totalOrders,
        totalSpent,
        averageOrderValue,
        lastPurchase,
        loyaltyPoints: customer.loyaltyPoints,
      },
      favoriteProducts,
    },
  };
}

export async function updateLoyaltyPoints(data: any, session: any) {
  const { customerId, points, action } = data;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  const newPoints =
    action === 'add'
      ? customer.loyaltyPoints + points
      : action === 'subtract'
      ? customer.loyaltyPoints - points
      : points;

  const updated = await prisma.customer.update({
    where: { id: customerId },
    data: {
      loyaltyPoints: Math.max(0, newPoints),
    },
  });

  return { success: true, data: updated };
}

export async function getCustomerSegments(data: any, session: any) {
  const vipCustomers = await prisma.customer.count({
    where: { isVIP: true },
  });

  const regularCustomers = await prisma.customer.count({
    where: {
      isVIP: false,
      customerType: 'INDIVIDUAL',
    },
  });

  const corporateCustomers = await prisma.customer.count({
    where: { customerType: 'CORPORATE' },
  });

  const totalCustomers = await prisma.customer.count();

  const topSpenders = await prisma.customer.findMany({
    where: { totalSpent: { gt: 0 } },
    orderBy: { totalSpent: 'desc' },
    take: 20,
  });

  return {
    data: {
      segments: {
        vip: vipCustomers,
        regular: regularCustomers,
        corporate: corporateCustomers,
        total: totalCustomers,
      },
      topSpenders,
    },
  };
}

export async function searchCustomers(data: any, session: any) {
  const { query } = data;

  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        { nameArabic: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 10,
  });

  return { data: customers };
}
