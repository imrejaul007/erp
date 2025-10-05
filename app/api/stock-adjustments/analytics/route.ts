import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total adjustments
    const totalAdjustments = await prisma.stockAdjustment.count({
      where: { tenantId }
    });

    const thisMonthAdjustments = await prisma.stockAdjustment.count({
      where: {
        tenantId,
        createdAt: { gte: startOfMonth }
      }
    });

    const lastMonthAdjustments = await prisma.stockAdjustment.count({
      where: {
        tenantId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    });

    // Adjustments by type
    const adjustmentsByType = await prisma.stockAdjustment.groupBy({
      by: ['type'],
      where: { tenantId },
      _count: {
        type: true
      },
      _sum: {
        quantityChange: true,
        costImpact: true
      }
    });

    // Pending approvals
    const pendingApprovals = await prisma.stockAdjustment.count({
      where: {
        tenantId,
        requiresApproval: true,
        approvedAt: null
      }
    });

    // Recent adjustments with high cost impact
    const highImpactAdjustments = await prisma.stockAdjustment.count({
      where: {
        tenantId,
        costImpact: { gte: 1000 }
      }
    });

    // Total cost impact
    const costImpactData = await prisma.stockAdjustment.aggregate({
      where: { tenantId },
      _sum: {
        costImpact: true
      }
    });

    const thisMonthCostImpact = await prisma.stockAdjustment.aggregate({
      where: {
        tenantId,
        createdAt: { gte: startOfMonth }
      },
      _sum: {
        costImpact: true
      }
    });

    const lastMonthCostImpact = await prisma.stockAdjustment.aggregate({
      where: {
        tenantId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      },
      _sum: {
        costImpact: true
      }
    });

    // Adjustments by reason
    const adjustmentsByReason = await prisma.stockAdjustment.groupBy({
      by: ['reason'],
      where: { tenantId },
      _count: {
        reason: true
      }
    });

    // Calculate trends
    const adjustmentsTrend = lastMonthAdjustments > 0
      ? ((thisMonthAdjustments - lastMonthAdjustments) / lastMonthAdjustments) * 100
      : 0;

    const thisMonthCost = Number(thisMonthCostImpact._sum.costImpact || 0);
    const lastMonthCost = Number(lastMonthCostImpact._sum.costImpact || 0);
    const costImpactTrend = lastMonthCost > 0
      ? ((thisMonthCost - lastMonthCost) / lastMonthCost) * 100
      : 0;

    return apiResponse({
      analytics: {
        totalAdjustments,
        thisMonthAdjustments,
        pendingApprovals,
        highImpactAdjustments,
        totalCostImpact: Number(costImpactData._sum.costImpact || 0),
        thisMonthCostImpact: thisMonthCost,
        trends: {
          adjustments: Number(adjustmentsTrend.toFixed(1)),
          costImpact: Number(costImpactTrend.toFixed(1))
        },
        byType: adjustmentsByType.map(t => ({
          type: t.type,
          count: t._count.type,
          totalQuantityChange: t._sum.quantityChange || 0,
          totalCostImpact: Number(t._sum.costImpact || 0)
        })),
        byReason: adjustmentsByReason.map(r => ({
          reason: r.reason,
          count: r._count.reason
        }))
      }
    });
  } catch (error) {
    console.error('Stock Adjustment Analytics Error:', error);
    return apiError('Failed to fetch stock adjustment analytics', 500);
  }
});
