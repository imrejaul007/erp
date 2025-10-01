import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const analyticsQuerySchema = z.object({
  type: z.enum([
    'dashboard',
    'customer-lifetime-value',
    'purchase-behavior',
    'seasonal-patterns',
    'churn-prediction',
    'segment-analysis',
    'loyalty-performance'
  ]),
  dateFrom: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  dateTo: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  customerId: z.string().cuid().optional(),
  segment: z.string().optional(),
  limit: z.number().min(1).max(1000).default(100),
});

// GET - Various CRM analytics endpoints
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = analyticsQuerySchema.parse({
      type: searchParams.get('type'),
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      customerId: searchParams.get('customerId'),
      segment: searchParams.get('segment'),
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 100,
    });

    const dateRange = {
      gte: query.dateFrom || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Default: last year
      lte: query.dateTo || new Date(),
    };

    switch (query.type) {
      case 'dashboard':
        return await getCRMDashboard(dateRange);

      case 'customer-lifetime-value':
        return await getCustomerLifetimeValue(query.customerId, query.limit);

      case 'purchase-behavior':
        return await getPurchaseBehaviorAnalysis(query.customerId, dateRange);

      case 'seasonal-patterns':
        return await getSeasonalPatterns(dateRange);

      case 'churn-prediction':
        return await getChurnPrediction(query.limit);

      case 'segment-analysis':
        return await getSegmentAnalysis(dateRange);

      case 'loyalty-performance':
        return await getLoyaltyPerformance(dateRange);

      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// CRM Dashboard Analytics
async function getCRMDashboard(dateRange: { gte: Date; lte: Date }) {
  const [
    totalCustomers,
    newCustomers,
    activeCustomers,
    vipCustomers,
    totalRevenue,
    totalOrders,
    customerSatisfaction,
    loyaltyStats,
    topSegments,
    recentActivity,
  ] = await Promise.all([
    // Total customers
    prisma.customer.count({
      where: { isActive: true },
    }),

    // New customers in date range
    prisma.customer.count({
      where: {
        createdAt: dateRange,
        isActive: true,
      },
    }),

    // Active customers (ordered in date range)
    prisma.customer.count({
      where: {
        orders: {
          some: {
            createdAt: dateRange,
          },
        },
        isActive: true,
      },
    }),

    // VIP customers
    prisma.customer.count({
      where: {
        segment: 'VIP',
        isActive: true,
      },
    }),

    // Total revenue
    prisma.order.aggregate({
      where: {
        createdAt: dateRange,
        status: { in: ['DELIVERED', 'COMPLETED'] },
      },
      _sum: {
        totalAmount: true,
      },
    }),

    // Total orders
    prisma.order.count({
      where: {
        createdAt: dateRange,
        status: { in: ['DELIVERED', 'COMPLETED'] },
      },
    }),

    // Customer satisfaction (average rating from feedback)
    prisma.customerFeedback.aggregate({
      where: {
        createdAt: dateRange,
      },
      _avg: {
        rating: true,
      },
    }),

    // Loyalty stats
    prisma.loyaltyAccount.aggregate({
      _sum: {
        points: true,
        totalEarned: true,
        totalRedeemed: true,
      },
      _count: true,
    }),

    // Top customer segments
    prisma.customer.groupBy({
      by: ['segment'],
      where: { isActive: true },
      _count: {
        segment: true,
      },
      _sum: {
        totalLifetimeValue: true,
      },
      orderBy: {
        _count: {
          segment: 'desc',
        },
      },
    }),

    // Recent customer activity
    prisma.customerHistory.findMany({
      where: {
        createdAt: dateRange,
      },
      include: {
        customer: {
          select: {
            name: true,
            segment: true,
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
  ]);

  const avgOrderValue = totalOrders > 0 ? (totalRevenue._sum.totalAmount || 0) / totalOrders : 0;

  return NextResponse.json({
    overview: {
      totalCustomers,
      newCustomers,
      activeCustomers,
      vipCustomers,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalOrders,
      avgOrderValue,
      customerSatisfaction: Math.round((customerSatisfaction._avg.rating || 0) * 10) / 10,
    },
    loyalty: {
      totalMembers: loyaltyStats._count,
      totalPoints: loyaltyStats._sum.points || 0,
      totalEarned: loyaltyStats._sum.totalEarned || 0,
      totalRedeemed: loyaltyStats._sum.totalRedeemed || 0,
      redemptionRate: loyaltyStats._sum.totalEarned
        ? Math.round((loyaltyStats._sum.totalRedeemed || 0) / loyaltyStats._sum.totalEarned * 100)
        : 0,
    },
    segments: topSegments,
    recentActivity,
  });
}

// Customer Lifetime Value Analysis
async function getCustomerLifetimeValue(customerId?: string, limit: number = 100) {
  const whereClause = customerId ? { id: customerId } : {};

  const customers = await prisma.customer.findMany({
    where: {
      ...whereClause,
      isActive: true,
    },
    include: {
      orders: {
        where: {
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
        select: {
          totalAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
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
    take: limit,
  });

  const cltAnalysis = customers.map((customer) => {
    const orders = customer.orders;
    const totalValue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const orderCount = orders.length;
    const avgOrderValue = orderCount > 0 ? totalValue / orderCount : 0;

    // Calculate order frequency (orders per month)
    const firstOrderDate = orders.length > 0 ? orders[orders.length - 1].createdAt : null;
    const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

    let orderFrequency = 0;
    if (firstOrderDate && lastOrderDate && orderCount > 1) {
      const monthsBetween = (lastOrderDate.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      orderFrequency = monthsBetween > 0 ? orderCount / monthsBetween : 0;
    }

    // Predict future value (simple model based on current trends)
    const daysSinceLastOrder = lastOrderDate
      ? Math.floor((new Date().getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
      : 365;

    const predictedValue = orderFrequency > 0
      ? totalValue + (avgOrderValue * orderFrequency * 12) // Next 12 months
      : totalValue;

    // Risk score (0-100, higher = more risk of churn)
    let riskScore = Math.min(100, daysSinceLastOrder / 3.65); // Base risk on days since last order
    if (orderCount === 1) riskScore += 20; // One-time customers are riskier
    if (orderFrequency < 0.5) riskScore += 15; // Low frequency customers

    return {
      customerId: customer.id,
      customerName: customer.name,
      customerCode: customer.code,
      segment: customer.segment,
      totalValue,
      orderCount,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      orderFrequency: Math.round(orderFrequency * 100) / 100,
      lastOrderDate,
      daysSinceLastOrder,
      predictedValue: Math.round(predictedValue * 100) / 100,
      riskScore: Math.round(riskScore),
    };
  });

  return NextResponse.json(cltAnalysis);
}

// Purchase Behavior Analysis
async function getPurchaseBehaviorAnalysis(customerId?: string, dateRange: { gte: Date; lte: Date }) {
  if (customerId) {
    // Individual customer analysis
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          where: {
            createdAt: dateRange,
            status: { in: ['DELIVERED', 'COMPLETED'] },
          },
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    categoryId: true,
                    brandId: true,
                    sellingPrice: true,
                    category: {
                      select: { name: true },
                    },
                    brand: {
                      select: { name: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Analyze customer's purchase behavior
    const orders = customer.orders;
    const allItems = orders.flatMap(order => order.orderItems);

    // Category preferences
    const categoryMap = new Map();
    allItems.forEach(item => {
      const category = item.product.category.name;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, revenue: 0 });
      }
      const current = categoryMap.get(category);
      categoryMap.set(category, {
        count: current.count + item.quantity,
        revenue: current.revenue + Number(item.total),
      });
    });

    const preferredCategories = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        purchaseCount: data.count,
        revenue: data.revenue,
        percentage: Math.round((data.revenue / orders.reduce((sum, o) => sum + Number(o.totalAmount), 0)) * 100),
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Brand loyalty
    const brandMap = new Map();
    allItems.forEach(item => {
      const brand = item.product.brand.name;
      if (!brandMap.has(brand)) {
        brandMap.set(brand, { count: 0, revenue: 0 });
      }
      const current = brandMap.get(brand);
      brandMap.set(brand, {
        count: current.count + item.quantity,
        revenue: current.revenue + Number(item.total),
      });
    });

    const brandLoyalty = Array.from(brandMap.entries())
      .map(([brand, data]) => ({
        brand,
        purchaseCount: data.count,
        revenue: data.revenue,
        percentage: Math.round((data.count / allItems.reduce((sum, item) => sum + item.quantity, 0)) * 100),
      }))
      .sort((a, b) => b.purchaseCount - a.purchaseCount);

    // Price range analysis
    const prices = allItems.map(item => Number(item.product.sellingPrice));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

    return NextResponse.json({
      customerId,
      customerName: customer.name,
      orderCount: orders.length,
      totalSpent: orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
      preferredCategories,
      brandLoyalty,
      priceRange: {
        min: Math.round(minPrice * 100) / 100,
        max: Math.round(maxPrice * 100) / 100,
        average: Math.round(avgPrice * 100) / 100,
      },
    });
  }

  // Global purchase behavior analysis
  const [
    categoryAnalysis,
    brandAnalysis,
    priceDistribution,
    seasonalTrends,
  ] = await Promise.all([
    // Category performance
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: dateRange,
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
      },
      _sum: {
        quantity: true,
        total: true,
      },
    }).then(items =>
      prisma.product.findMany({
        where: {
          id: { in: items.map(item => item.productId) },
        },
        include: {
          category: { select: { name: true } },
        },
      }).then(products => {
        const categoryMap = new Map();
        items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            const category = product.category.name;
            if (!categoryMap.has(category)) {
              categoryMap.set(category, { quantity: 0, revenue: 0 });
            }
            const current = categoryMap.get(category);
            categoryMap.set(category, {
              quantity: current.quantity + (item._sum.quantity || 0),
              revenue: current.revenue + Number(item._sum.total || 0),
            });
          }
        });
        return Array.from(categoryMap.entries()).map(([category, data]) => ({
          category,
          ...data,
        }));
      })
    ),

    // Brand performance
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: dateRange,
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
      },
      _sum: {
        quantity: true,
        total: true,
      },
    }).then(items =>
      prisma.product.findMany({
        where: {
          id: { in: items.map(item => item.productId) },
        },
        include: {
          brand: { select: { name: true } },
        },
      }).then(products => {
        const brandMap = new Map();
        items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            const brand = product.brand.name;
            if (!brandMap.has(brand)) {
              brandMap.set(brand, { quantity: 0, revenue: 0 });
            }
            const current = brandMap.get(brand);
            brandMap.set(brand, {
              quantity: current.quantity + (item._sum.quantity || 0),
              revenue: current.revenue + Number(item._sum.total || 0),
            });
          }
        });
        return Array.from(brandMap.entries()).map(([brand, data]) => ({
          brand,
          ...data,
        }));
      })
    ),

    // Price distribution
    prisma.order.aggregate({
      where: {
        createdAt: dateRange,
        status: { in: ['DELIVERED', 'COMPLETED'] },
      },
      _avg: { totalAmount: true },
      _min: { totalAmount: true },
      _max: { totalAmount: true },
    }),

    // Seasonal trends (by month)
    prisma.$queryRaw`
      SELECT
        EXTRACT(MONTH FROM created_at) as month,
        EXTRACT(YEAR FROM created_at) as year,
        COUNT(*) as order_count,
        SUM(total_amount) as revenue
      FROM orders
      WHERE created_at BETWEEN ${dateRange.gte} AND ${dateRange.lte}
        AND status IN ('DELIVERED', 'COMPLETED')
      GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
      ORDER BY year, month
    `,
  ]);

  return NextResponse.json({
    categories: categoryAnalysis,
    brands: brandAnalysis,
    priceDistribution,
    seasonalTrends,
  });
}

// Seasonal Patterns Analysis
async function getSeasonalPatterns(dateRange: { gte: Date; lte: Date }) {
  const monthlyData = await prisma.$queryRaw`
    SELECT
      EXTRACT(MONTH FROM created_at) as month,
      EXTRACT(YEAR FROM created_at) as year,
      COUNT(*) as order_count,
      SUM(total_amount) as revenue,
      AVG(total_amount) as avg_order_value
    FROM orders
    WHERE created_at BETWEEN ${dateRange.gte} AND ${dateRange.lte}
      AND status IN ('DELIVERED', 'COMPLETED')
    GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
    ORDER BY year, month
  `;

  // Get top products by season
  const seasonalProducts = await prisma.$queryRaw`
    SELECT
      p.name as product_name,
      p.id as product_id,
      CASE
        WHEN EXTRACT(MONTH FROM o.created_at) IN (12, 1, 2) THEN 'Winter'
        WHEN EXTRACT(MONTH FROM o.created_at) IN (3, 4, 5) THEN 'Spring'
        WHEN EXTRACT(MONTH FROM o.created_at) IN (6, 7, 8) THEN 'Summer'
        ELSE 'Autumn'
      END as season,
      SUM(oi.quantity) as total_quantity,
      SUM(oi.total) as total_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.created_at BETWEEN ${dateRange.gte} AND ${dateRange.lte}
      AND o.status IN ('DELIVERED', 'COMPLETED')
    GROUP BY p.id, p.name, season
    ORDER BY season, total_revenue DESC
  `;

  return NextResponse.json({
    monthlyTrends: monthlyData,
    seasonalProducts,
  });
}

// Churn Prediction Analysis
async function getChurnPrediction(limit: number = 100) {
  const customers = await prisma.customer.findMany({
    where: { isActive: true },
    include: {
      orders: {
        where: {
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
        select: {
          createdAt: true,
          totalAmount: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      communications: {
        select: {
          createdAt: true,
          type: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: {
          orders: true,
          tickets: {
            where: {
              status: { in: ['OPEN', 'IN_PROGRESS'] },
            },
          },
        },
      },
    },
    take: limit,
  });

  const churnAnalysis = customers.map(customer => {
    const orders = customer.orders;
    const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;
    const daysSinceLastOrder = lastOrderDate
      ? Math.floor((new Date().getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
      : 9999;

    // Calculate churn probability (0-100)
    let churnProbability = 0;

    // Days since last order factor
    if (daysSinceLastOrder > 365) churnProbability += 60;
    else if (daysSinceLastOrder > 180) churnProbability += 40;
    else if (daysSinceLastOrder > 90) churnProbability += 25;
    else if (daysSinceLastOrder > 60) churnProbability += 15;

    // Order frequency factor
    if (orders.length === 1) churnProbability += 20;
    else if (orders.length < 3) churnProbability += 10;

    // Recent communication factor
    const recentCommunication = customer.communications.length > 0
      ? customer.communications[0].createdAt
      : null;

    if (!recentCommunication) churnProbability += 15;

    // Open tickets factor (negative churn indicator)
    if (customer._count.tickets > 0) churnProbability -= 10;

    churnProbability = Math.max(0, Math.min(100, churnProbability));

    // Determine risk factors
    const riskFactors = [];
    if (daysSinceLastOrder > 180) riskFactors.push('Long time since last purchase');
    if (orders.length <= 2) riskFactors.push('Low purchase frequency');
    if (!recentCommunication) riskFactors.push('No recent communication');
    if (customer.segment === 'REGULAR') riskFactors.push('Regular segment');

    // Retention strategies
    const retentionStrategies = [];
    if (churnProbability > 70) {
      retentionStrategies.push('Urgent personal outreach');
      retentionStrategies.push('Special discount offer');
    } else if (churnProbability > 40) {
      retentionStrategies.push('Re-engagement email campaign');
      retentionStrategies.push('Product recommendations');
    } else if (churnProbability > 20) {
      retentionStrategies.push('Regular check-in communication');
    }

    return {
      customerId: customer.id,
      customerName: customer.name,
      segment: customer.segment,
      churnProbability: Math.round(churnProbability),
      riskLevel: churnProbability > 70 ? 'HIGH' : churnProbability > 40 ? 'MEDIUM' : 'LOW',
      daysSinceLastOrder,
      totalOrders: customer._count.orders,
      lastOrderDate,
      riskFactors,
      retentionStrategies,
    };
  });

  return NextResponse.json(churnAnalysis.sort((a, b) => b.churnProbability - a.churnProbability));
}

// Segment Analysis
async function getSegmentAnalysis(dateRange: { gte: Date; lte: Date }) {
  const segmentStats = await prisma.customer.groupBy({
    by: ['segment'],
    where: { isActive: true },
    _count: {
      segment: true,
    },
    _sum: {
      totalLifetimeValue: true,
    },
    _avg: {
      totalLifetimeValue: true,
    },
  });

  // Get order stats by segment
  const orderStats = await prisma.order.groupBy({
    by: ['customerId'],
    where: {
      createdAt: dateRange,
      status: { in: ['DELIVERED', 'COMPLETED'] },
    },
    _sum: {
      totalAmount: true,
    },
    _count: {
      customerId: true,
    },
  });

  // Match orders with customer segments
  const customerSegments = await prisma.customer.findMany({
    where: {
      id: { in: orderStats.map(o => o.customerId) },
    },
    select: {
      id: true,
      segment: true,
    },
  });

  const segmentOrderMap = new Map();
  orderStats.forEach(order => {
    const customer = customerSegments.find(c => c.id === order.customerId);
    if (customer) {
      if (!segmentOrderMap.has(customer.segment)) {
        segmentOrderMap.set(customer.segment, {
          orderCount: 0,
          revenue: 0,
          customerCount: 0,
        });
      }
      const current = segmentOrderMap.get(customer.segment);
      segmentOrderMap.set(customer.segment, {
        orderCount: current.orderCount + order._count.customerId,
        revenue: current.revenue + Number(order._sum.totalAmount || 0),
        customerCount: current.customerCount + 1,
      });
    }
  });

  const segmentAnalysis = segmentStats.map(segment => {
    const orderData = segmentOrderMap.get(segment.segment) || {
      orderCount: 0,
      revenue: 0,
      customerCount: 0,
    };

    return {
      segment: segment.segment,
      totalCustomers: segment._count.segment,
      avgLifetimeValue: Math.round(Number(segment._avg.totalLifetimeValue || 0) * 100) / 100,
      totalLifetimeValue: Math.round(Number(segment._sum.totalLifetimeValue || 0) * 100) / 100,
      recentRevenue: Math.round(orderData.revenue * 100) / 100,
      recentOrders: orderData.orderCount,
      activeCustomers: orderData.customerCount,
      avgOrderValue: orderData.orderCount > 0
        ? Math.round((orderData.revenue / orderData.orderCount) * 100) / 100
        : 0,
    };
  });

  return NextResponse.json(segmentAnalysis);
}

// Loyalty Performance Analysis
async function getLoyaltyPerformance(dateRange: { gte: Date; lte: Date }) {
  const [
    tierDistribution,
    pointsActivity,
    rewardPerformance,
    engagementMetrics,
  ] = await Promise.all([
    // Tier distribution
    prisma.loyaltyAccount.groupBy({
      by: ['tier'],
      _count: {
        tier: true,
      },
      _sum: {
        points: true,
        totalEarned: true,
        totalRedeemed: true,
      },
      _avg: {
        totalEarned: true,
      },
    }),

    // Points activity over time
    prisma.loyaltyTransaction.groupBy({
      by: ['type'],
      where: {
        createdAt: dateRange,
      },
      _sum: {
        points: true,
      },
      _count: {
        type: true,
      },
    }),

    // Reward performance
    prisma.reward.findMany({
      include: {
        _count: {
          select: {
            claims: {
              where: {
                claimedAt: dateRange,
              },
            },
          },
        },
      },
      orderBy: {
        claims: {
          _count: 'desc',
        },
      },
      take: 10,
    }),

    // Engagement metrics
    prisma.loyaltyAccount.count({
      where: {
        pointsHistory: {
          some: {
            createdAt: dateRange,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    tierDistribution,
    pointsActivity,
    topRewards: rewardPerformance.map(reward => ({
      id: reward.id,
      name: reward.name,
      pointsCost: reward.pointsCost,
      claimCount: reward._count.claims,
      type: reward.type,
    })),
    engagement: {
      activeMembersInPeriod: engagementMetrics,
    },
  });
}