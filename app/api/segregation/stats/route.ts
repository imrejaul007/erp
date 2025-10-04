import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// GET - Get segregation statistics
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const [totalBatches, activeBatches, completedBatches, totalOutputs] = await Promise.all([
      prisma.segregationBatch.count({ where: { tenantId } }),
      prisma.segregationBatch.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      prisma.segregationBatch.count({ where: { tenantId, status: 'COMPLETED' } }),
      prisma.segregationOutput.count({ where: { tenantId } }),
    ]);

    const avgYield = await prisma.segregationOutput.aggregate({
      where: { tenantId },
      _avg: {
        yieldPercentage: true,
      },
    });

    const totalCost = await prisma.segregationBatch.aggregate({
      where: { tenantId },
      _sum: {
        totalCost: true,
      },
    });

    const totalRevenue = await prisma.segregationOutput.aggregate({
      where: { tenantId },
      _sum: {
        profitMargin: true,
      },
    });

    return apiResponse({
      stats: {
        totalBatches,
        activeBatches,
        completedBatches,
        totalOutputs,
        avgYield: avgYield._avg.yieldPercentage || 0,
        totalCost: totalCost._sum.totalCost || 0,
        totalProfit: totalRevenue._sum.profitMargin || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching segregation stats:', error);
    return apiError(error.message || 'Failed to fetch stats', 500);
  }
});
