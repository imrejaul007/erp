import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// GET - Get distillation statistics
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const [
      totalBatches,
      inProgressBatches,
      completedBatches,
      failedBatches,
      cancelledBatches,
      totalLogs,
    ] = await Promise.all([
      prisma.distillationBatch.count({ where: { tenantId } }),
      prisma.distillationBatch.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      prisma.distillationBatch.count({ where: { tenantId, status: 'COMPLETED' } }),
      prisma.distillationBatch.count({ where: { tenantId, status: 'FAILED' } }),
      prisma.distillationBatch.count({ where: { tenantId, status: 'CANCELLED' } }),
      prisma.distillationLog.count({ where: { tenantId } }),
    ]);

    // Calculate average yield
    const avgYieldResult = await prisma.distillationBatch.aggregate({
      where: { tenantId, status: 'COMPLETED' },
      _avg: {
        actualYield: true,
      },
    });

    // Calculate total raw material cost
    const totalCostResult = await prisma.distillationBatch.aggregate({
      where: { tenantId },
      _sum: {
        rawCost: true,
      },
    });

    // Calculate total output quantity
    const totalOutputResult = await prisma.distillationBatch.aggregate({
      where: { tenantId, status: 'COMPLETED' },
      _sum: {
        outputQuantity: true,
      },
    });

    // Get batches by method
    const batchesByMethod = await prisma.distillationBatch.groupBy({
      by: ['method'],
      where: { tenantId },
      _count: {
        method: true,
      },
    });

    // Get batches by quality grade for completed batches
    const batchesByGrade = await prisma.distillationBatch.groupBy({
      by: ['qualityGrade'],
      where: { tenantId, status: 'COMPLETED', qualityGrade: { not: null } },
      _count: {
        qualityGrade: true,
      },
      _avg: {
        actualYield: true,
      },
    });

    // Get average temperature and pressure from logs
    const avgConditionsResult = await prisma.distillationLog.aggregate({
      where: { tenantId },
      _avg: {
        temperature: true,
        pressure: true,
        phLevel: true,
      },
    });

    // Get most productive batches (top 5 by output quantity)
    const topBatches = await prisma.distillationBatch.findMany({
      where: { tenantId, status: 'COMPLETED' },
      select: {
        id: true,
        batchNumber: true,
        outputQuantity: true,
        actualYield: true,
        qualityGrade: true,
        rawMaterial: {
          select: {
            name: true,
            sku: true,
          },
        },
        outputProduct: {
          select: {
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        outputQuantity: 'desc',
      },
      take: 5,
    });

    // Get batches by status for chart
    const batchesByStatus = [
      { status: 'IN_PROGRESS', count: inProgressBatches, color: '#3b82f6' },
      { status: 'COMPLETED', count: completedBatches, color: '#10b981' },
      { status: 'FAILED', count: failedBatches, color: '#ef4444' },
      { status: 'CANCELLED', count: cancelledBatches, color: '#6b7280' },
    ];

    // Calculate success rate
    const successRate = totalBatches > 0
      ? ((completedBatches / totalBatches) * 100).toFixed(2)
      : 0;

    return apiResponse({
      stats: {
        totalBatches,
        inProgressBatches,
        completedBatches,
        failedBatches,
        cancelledBatches,
        totalLogs,
        avgYield: avgYieldResult._avg.actualYield || 0,
        totalRawCost: totalCostResult._sum.rawCost || 0,
        totalOutput: totalOutputResult._sum.outputQuantity || 0,
        successRate: parseFloat(successRate as string),
        avgTemperature: avgConditionsResult._avg.temperature || 0,
        avgPressure: avgConditionsResult._avg.pressure || 0,
        avgPhLevel: avgConditionsResult._avg.phLevel || 0,
      },
      batchesByMethod: batchesByMethod.map(item => ({
        method: item.method,
        count: item._count.method,
      })),
      batchesByGrade: batchesByGrade.map(item => ({
        grade: item.qualityGrade,
        count: item._count.qualityGrade,
        avgYield: item._avg.actualYield || 0,
      })),
      topBatches,
      batchesByStatus,
    });
  } catch (error: any) {
    console.error('Error fetching distillation stats:', error);
    return apiError(error.message || 'Failed to fetch stats', 500);
  }
});
