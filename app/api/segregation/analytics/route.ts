import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const [totalBatches, completedBatches, inProgressBatches, cancelledBatches] = await Promise.all([
      prisma.segregationBatch.count({ where: { tenantId } }),
      prisma.segregationBatch.count({ where: { tenantId, status: 'COMPLETED' } }),
      prisma.segregationBatch.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      prisma.segregationBatch.count({ where: { tenantId, status: 'CANCELLED' } }),
    ]);

    const batchAggregates = await prisma.segregationBatch.aggregate({
      where: { tenantId },
      _sum: {
        totalCost: true,
        wastageCost: true,
      },
      _avg: {
        wastage: true,
      },
    });

    return apiResponse({
      totalBatches,
      completedBatches,
      inProgressBatches,
      cancelledBatches,
      totalCost: Number(batchAggregates._sum.totalCost || 0),
      totalWastageCost: Number(batchAggregates._sum.wastageCost || 0),
      averageWastagePercentage: Number(batchAggregates._avg.wastage || 0),
    });
  } catch (error) {
    console.error('Segregation Analytics Error:', error);
    return apiError('Failed to fetch segregation analytics', 500);
  }
});
