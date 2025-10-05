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

    // Total transfers
    const totalTransfers = await prisma.stockTransfer.count({
      where: { tenantId }
    });

    const thisMonthTransfers = await prisma.stockTransfer.count({
      where: {
        tenantId,
        requestedAt: { gte: startOfMonth }
      }
    });

    const lastMonthTransfers = await prisma.stockTransfer.count({
      where: {
        tenantId,
        requestedAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    });

    // Status counts
    const pendingApproval = await prisma.stockTransfer.count({
      where: {
        tenantId,
        status: 'PENDING'
      }
    });

    const inTransit = await prisma.stockTransfer.count({
      where: {
        tenantId,
        status: 'IN_TRANSIT'
      }
    });

    const completedThisMonth = await prisma.stockTransfer.count({
      where: {
        tenantId,
        status: 'COMPLETED',
        receivedAt: { gte: startOfMonth }
      }
    });

    // Get all transfers with product info for value calculation
    const transfers = await prisma.stockTransfer.findMany({
      where: { tenantId },
      include: {
        product: {
          select: {
            price: true,
            cost: true
          }
        }
      }
    });

    // Calculate total value (using product cost * quantity)
    const totalValue = transfers.reduce((sum, t) => {
      const productCost = Number(t.product?.cost || t.product?.price || 0);
      return sum + (productCost * t.quantity);
    }, 0);

    const thisMonthValue = transfers
      .filter(t => t.requestedAt >= startOfMonth)
      .reduce((sum, t) => {
        const productCost = Number(t.product?.cost || t.product?.price || 0);
        return sum + (productCost * t.quantity);
      }, 0);

    const lastMonthValue = transfers
      .filter(t => t.requestedAt >= startOfLastMonth && t.requestedAt <= endOfLastMonth)
      .reduce((sum, t) => {
        const productCost = Number(t.product?.cost || t.product?.price || 0);
        return sum + (productCost * t.quantity);
      }, 0);

    // Calculate delivery times for completed transfers
    const completedTransfers = transfers.filter(t =>
      t.status === 'COMPLETED' && t.shippedAt && t.receivedAt
    );

    const avgDeliveryTime = completedTransfers.length > 0
      ? completedTransfers.reduce((sum, t) => {
          const shipped = t.shippedAt!.getTime();
          const received = t.receivedAt!.getTime();
          const days = (received - shipped) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / completedTransfers.length
      : 0;

    // Success rate
    const totalCompleted = transfers.filter(t =>
      t.status === 'COMPLETED' || t.status === 'CANCELLED'
    ).length;

    const successfulTransfers = transfers.filter(t => t.status === 'COMPLETED').length;
    const successRate = totalCompleted > 0
      ? (successfulTransfers / totalCompleted) * 100
      : 0;

    // Calculate trends
    const requestsTrend = lastMonthTransfers > 0
      ? ((thisMonthTransfers - lastMonthTransfers) / lastMonthTransfers) * 100
      : 0;

    const valueTrend = lastMonthValue > 0
      ? ((thisMonthValue - lastMonthValue) / lastMonthValue) * 100
      : 0;

    return apiResponse({
      analytics: {
        totalTransfers,
        pendingApproval,
        inTransit,
        completedThisMonth,
        totalValue,
        avgDeliveryTime: Number(avgDeliveryTime.toFixed(1)),
        successRate: Number(successRate.toFixed(1)),
        trends: {
          requests: Number(requestsTrend.toFixed(1)),
          approvals: 0, // Would need approval history table
          deliveries: 0, // Would need historical delivery data
          value: Number(valueTrend.toFixed(1))
        }
      }
    });
  } catch (error) {
    console.error('Stock Transfer Analytics Error:', error);
    return apiError('Failed to fetch stock transfer analytics', 500);
  }
});
