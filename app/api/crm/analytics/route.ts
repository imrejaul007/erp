import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'dashboard';

    if (type === 'dashboard') {
      // Calculate date ranges
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Overview Statistics
      const totalCustomers = await prisma.customers.count({
        where: { tenantId }
      });

      const activeCustomers = await prisma.customers.count({
        where: {
          tenantId,
          lastOrderDate: {
            gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
          }
        }
      });

      const newCustomers = await prisma.customers.count({
        where: {
          tenantId,
          createdAt: {
            gte: startOfMonth
          }
        }
      });

      const vipCustomers = await prisma.customers.count({
        where: {
          tenantId,
          isVIP: true
        }
      });

      // Revenue and Order Statistics
      const orderStats = await prisma.order.aggregate({
        where: {
          tenantId,
          status: { in: ['CONFIRMED', 'COMPLETED', 'DELIVERED'] }
        },
        _sum: {
          grandTotal: true
        },
        _count: true,
        _avg: {
          grandTotal: true
        }
      });

      // Loyalty Program Statistics
      const loyaltyStats = await prisma.customers.aggregate({
        where: {
          tenantId,
          loyaltyPoints: { gt: 0 }
        },
        _sum: {
          loyaltyPoints: true,
          totalPointsEarned: true,
          totalPointsRedeemed: true
        },
        _count: true
      });

      const totalEarned = Number(loyaltyStats._sum.totalPointsEarned || 0);
      const totalRedeemed = Number(loyaltyStats._sum.totalPointsRedeemed || 0);
      const redemptionRate = totalEarned > 0 ? Math.round((totalRedeemed / totalEarned) * 100) : 0;

      // Customer Segmentation
      const segments = await prisma.customers.groupBy({
        by: ['segment'],
        where: { tenantId },
        _count: {
          segment: true
        },
        _sum: {
          totalLifetimeValue: true
        }
      });

      // Customer Satisfaction (mock for now - would come from feedback/reviews)
      const customerSatisfactionScore = 4.2;

      return apiResponse({
        overview: {
          totalCustomers,
          activeCustomers,
          newCustomers,
          vipCustomers,
          totalRevenue: Number(orderStats._sum.grandTotal || 0),
          totalOrders: orderStats._count,
          avgOrderValue: Number(orderStats._avg.grandTotal || 0),
          customerSatisfactionScore
        },
        loyalty: {
          totalMembers: loyaltyStats._count,
          totalPoints: Number(loyaltyStats._sum.loyaltyPoints || 0),
          totalEarned,
          totalRedeemed,
          redemptionRate
        },
        segments
      });
    }

    return apiError('Invalid analytics type', 400);
  } catch (error) {
    console.error('CRM Analytics Error:', error);
    return apiError('Failed to fetch CRM analytics', 500);
  }
});
