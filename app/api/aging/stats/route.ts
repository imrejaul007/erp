import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// GET - Get aging statistics
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const [
      totalBatches,
      agingBatches,
      readyBatches,
      completedBatches,
      cancelledBatches,
    ] = await Promise.all([
      prisma.agingBatch.count({ where: { tenantId } }),
      prisma.agingBatch.count({ where: { tenantId, status: 'AGING' } }),
      prisma.agingBatch.count({ where: { tenantId, status: 'READY' } }),
      prisma.agingBatch.count({ where: { tenantId, status: 'COMPLETED' } }),
      prisma.agingBatch.count({ where: { tenantId, status: 'CANCELLED' } }),
    ]);

    // Calculate average duration for completed batches
    const avgDurationResult = await prisma.agingBatch.aggregate({
      where: { tenantId, status: 'COMPLETED', actualDuration: { not: null } },
      _avg: {
        actualDuration: true,
        targetDuration: true,
      },
    });

    // Calculate total quantity aging
    const totalQuantityResult = await prisma.agingBatch.aggregate({
      where: { tenantId },
      _sum: {
        quantity: true,
      },
    });

    // Get batches by container type
    const batchesByContainer = await prisma.agingBatch.groupBy({
      by: ['containerType'],
      where: { tenantId },
      _count: {
        containerType: true,
      },
      _sum: {
        quantity: true,
      },
    });

    // Get batches by location
    const batchesByLocation = await prisma.agingBatch.groupBy({
      by: ['location'],
      where: { tenantId },
      _count: {
        location: true,
      },
      _sum: {
        quantity: true,
      },
    });

    // Get batches ready soon (within next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const readySoon = await prisma.agingBatch.findMany({
      where: {
        tenantId,
        status: 'AGING',
        expectedReadyDate: {
          gte: today,
          lte: nextWeek,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        expectedReadyDate: 'asc',
      },
    });

    // Get overdue batches (expected ready date passed but still aging)
    const overdueBatches = await prisma.agingBatch.findMany({
      where: {
        tenantId,
        status: 'AGING',
        expectedReadyDate: {
          lt: today,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        expectedReadyDate: 'asc',
      },
    });

    // Get longest aging batches (currently aging)
    const longestAging = await prisma.agingBatch.findMany({
      where: { tenantId, status: 'AGING' },
      select: {
        id: true,
        batchNumber: true,
        containerNumber: true,
        startDate: true,
        expectedReadyDate: true,
        quantity: true,
        product: {
          select: {
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 5,
    });

    // Add days aging to longest aging batches
    const enrichedLongestAging = longestAging.map(batch => {
      const daysAging = Math.ceil((today.getTime() - new Date(batch.startDate).getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = batch.expectedReadyDate
        ? Math.ceil((new Date(batch.expectedReadyDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : null;
      return {
        ...batch,
        daysAging,
        daysRemaining,
      };
    });

    // Get batches by status for chart
    const batchesByStatus = [
      { status: 'AGING', count: agingBatches, color: '#3b82f6' },
      { status: 'READY', count: readyBatches, color: '#10b981' },
      { status: 'COMPLETED', count: completedBatches, color: '#6b7280' },
      { status: 'CANCELLED', count: cancelledBatches, color: '#ef4444' },
    ];

    // Calculate completion rate
    const completionRate = totalBatches > 0
      ? ((completedBatches / totalBatches) * 100).toFixed(2)
      : 0;

    return apiResponse({
      stats: {
        totalBatches,
        agingBatches,
        readyBatches,
        completedBatches,
        cancelledBatches,
        avgActualDuration: avgDurationResult._avg.actualDuration || 0,
        avgTargetDuration: avgDurationResult._avg.targetDuration || 0,
        totalQuantity: totalQuantityResult._sum.quantity || 0,
        completionRate: parseFloat(completionRate as string),
        readySoonCount: readySoon.length,
        overdueCount: overdueBatches.length,
      },
      batchesByContainer: batchesByContainer.map(item => ({
        containerType: item.containerType,
        count: item._count.containerType,
        totalQuantity: item._sum.quantity || 0,
      })),
      batchesByLocation: batchesByLocation.map(item => ({
        location: item.location,
        count: item._count.location,
        totalQuantity: item._sum.quantity || 0,
      })),
      readySoon,
      overdueBatches,
      longestAging: enrichedLongestAging,
      batchesByStatus,
    });
  } catch (error: any) {
    console.error('Error fetching aging stats:', error);
    return apiError(error.message || 'Failed to fetch stats', 500);
  }
});
