import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SamplingOutcome } from '@prisma/client';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const storeId = searchParams.get('storeId');

    // Build where clause
    const where: any = { tenantId };

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    if (storeId) {
      where.storeId = storeId;
    }

    // Fetch all sessions for the period
    const sessions = await prisma.samplingSession.findMany({
      where,
      include: {
        testedProducts: true
      }
    });

    // Calculate metrics
    const totalSessions = sessions.length;
    const purchasedSessions = sessions.filter(s => s.outcome === SamplingOutcome.PURCHASED);
    const notPurchasedSessions = sessions.filter(s => s.outcome === SamplingOutcome.NOT_PURCHASED);

    const totalPurchased = purchasedSessions.length;
    const totalNotPurchased = notPurchasedSessions.length;
    const conversionRate = totalSessions > 0 ? (totalPurchased / totalSessions) * 100 : 0;

    const totalRevenue = purchasedSessions.reduce(
      (sum, session) => sum + parseFloat(session.saleAmount?.toString() || '0'),
      0
    );

    const totalTesterCost = sessions.reduce(
      (sum, session) => sum + parseFloat(session.totalTesterCost.toString()),
      0
    );

    const roi = totalTesterCost > 0 ? ((totalRevenue - totalTesterCost) / totalTesterCost) * 100 : 0;

    // Lost sale reasons breakdown
    const lostSaleReasons: Record<string, number> = {};
    notPurchasedSessions.forEach(session => {
      if (session.notPurchaseReason) {
        lostSaleReasons[session.notPurchaseReason] = (lostSaleReasons[session.notPurchaseReason] || 0) + 1;
      }
    });

    // Staff performance
    const staffPerformance = await calculateStaffPerformance(where);

    // Product popularity
    const productPopularity = await calculateProductPopularity(where);

    return apiResponse({
      overview: {
        totalSessions,
        totalPurchased,
        totalNotPurchased,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalTesterCost: parseFloat(totalTesterCost.toFixed(2)),
        roi: parseFloat(roi.toFixed(2))
      },
      lostSaleReasons,
      staffPerformance,
      productPopularity
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return apiError('Failed to fetch analytics: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
})

async function calculateStaffPerformance(where: any) {
  const sessions = await prisma.samplingSession.findMany({
    where,
    include: {
      staff: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  const staffStats: Record<string, any> = {};

  sessions.forEach(session => {
    const staffId = session.staffId;
    if (!staffStats[staffId]) {
      staffStats[staffId] = {
        staffId,
        staffName: session.staff.name,
        totalSessions: 0,
        purchased: 0,
        notPurchased: 0,
        totalRevenue: 0,
        conversionRate: 0
      };
    }

    staffStats[staffId].totalSessions++;
    if (session.outcome === SamplingOutcome.PURCHASED) {
      staffStats[staffId].purchased++;
      staffStats[staffId].totalRevenue += parseFloat(session.saleAmount?.toString() || '0');
    } else {
      staffStats[staffId].notPurchased++;
    }
  });

  // Calculate conversion rates
  Object.values(staffStats).forEach((staff: any) => {
    staff.conversionRate = staff.totalSessions > 0
      ? parseFloat(((staff.purchased / staff.totalSessions) * 100).toFixed(2))
      : 0;
    staff.totalRevenue = parseFloat(staff.totalRevenue.toFixed(2));
  });

  return Object.values(staffStats);
}

async function calculateProductPopularity(where: any) {
  const sessions = await prisma.samplingSession.findMany({
    where,
    include: {
      testedProducts: true
    }
  });

  const productStats: Record<string, any> = {};

  sessions.forEach(session => {
    session.testedProducts.forEach(product => {
      const productId = product.productId;
      if (!productStats[productId]) {
        productStats[productId] = {
          productId,
          productName: product.productName,
          productCode: product.productCode,
          productType: product.productType,
          timesTested: 0,
          totalQuantityUsed: 0,
          totalCost: 0,
          conversions: 0
        };
      }

      productStats[productId].timesTested++;
      productStats[productId].totalQuantityUsed += parseFloat(product.quantityUsed.toString());
      productStats[productId].totalCost += parseFloat(product.totalCost.toString());

      if (session.outcome === SamplingOutcome.PURCHASED) {
        productStats[productId].conversions++;
      }
    });
  });

  // Calculate conversion rates and format numbers
  Object.values(productStats).forEach((product: any) => {
    product.conversionRate = product.timesTested > 0
      ? parseFloat(((product.conversions / product.timesTested) * 100).toFixed(2))
      : 0;
    product.totalQuantityUsed = parseFloat(product.totalQuantityUsed.toFixed(3));
    product.totalCost = parseFloat(product.totalCost.toFixed(2));
  });

  return Object.values(productStats);
}
