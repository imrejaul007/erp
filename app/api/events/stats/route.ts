import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// GET - Get event statistics and ROI
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const [
      totalEvents,
      plannedEvents,
      activeEvents,
      completedEvents,
      cancelledEvents,
    ] = await Promise.all([
      prisma.popupLocation.count({ where: { tenantId } }),
      prisma.popupLocation.count({ where: { tenantId, status: 'PLANNED' } }),
      prisma.popupLocation.count({ where: { tenantId, status: 'ACTIVE' } }),
      prisma.popupLocation.count({ where: { tenantId, status: 'COMPLETED' } }),
      prisma.popupLocation.count({ where: { tenantId, status: 'CANCELLED' } }),
    ]);

    // Calculate total costs and revenue for completed events
    const completedEventsData = await prisma.popupLocation.aggregate({
      where: { tenantId, status: 'COMPLETED' },
      _sum: {
        totalCost: true,
        actualRevenue: true,
        profitMargin: true,
      },
    });

    // Calculate average ROI
    const completedEventsWithROI = await prisma.popupLocation.findMany({
      where: {
        tenantId,
        status: 'COMPLETED',
        totalCost: { gt: 0 },
      },
      select: {
        id: true,
        totalCost: true,
        actualRevenue: true,
        profitMargin: true,
      },
    });

    const avgROI = completedEventsWithROI.length > 0
      ? completedEventsWithROI.reduce((sum, event) => {
          const roi = (Number(event.profitMargin) / Number(event.totalCost)) * 100;
          return sum + roi;
        }, 0) / completedEventsWithROI.length
      : 0;

    // Get events by location (city)
    const eventsByCity = await prisma.popupLocation.groupBy({
      by: ['city'],
      where: { tenantId },
      _count: {
        city: true,
      },
      _sum: {
        actualRevenue: true,
        profitMargin: true,
      },
      orderBy: {
        _count: {
          city: 'desc',
        },
      },
      take: 5,
    });

    // Get most profitable events
    const mostProfitableEvents = await prisma.popupLocation.findMany({
      where: { tenantId, status: 'COMPLETED' },
      select: {
        id: true,
        name: true,
        location: true,
        city: true,
        startDate: true,
        endDate: true,
        totalCost: true,
        actualRevenue: true,
        profitMargin: true,
      },
      orderBy: {
        profitMargin: 'desc',
      },
      take: 5,
    });

    // Enrich with ROI percentage
    const enrichedProfitableEvents = mostProfitableEvents.map(event => ({
      ...event,
      roi: Number(event.totalCost) > 0
        ? ((Number(event.profitMargin) / Number(event.totalCost)) * 100).toFixed(2)
        : '0',
    }));

    // Get top staff performers
    const topStaff = await prisma.eventStaff.groupBy({
      by: ['userId'],
      where: { tenantId },
      _sum: {
        actualSales: true,
        salesTarget: true,
      },
      _count: {
        userId: true,
      },
      orderBy: {
        _sum: {
          actualSales: 'desc',
        },
      },
      take: 5,
    });

    // Enrich top staff with user details
    const enrichedTopStaff = await Promise.all(
      topStaff.map(async (staff) => {
        const user = await prisma.user.findUnique({
          where: { id: staff.userId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        return {
          user,
          totalSales: staff._sum.actualSales || 0,
          totalTarget: staff._sum.salesTarget || 0,
          eventsWorked: staff._count.userId,
        };
      })
    );

    // Get most sold products across all events
    const topProducts = await prisma.eventInventory.groupBy({
      by: ['productId'],
      where: { tenantId },
      _sum: {
        soldQuantity: true,
      },
      orderBy: {
        _sum: {
          soldQuantity: 'desc',
        },
      },
      take: 5,
    });

    // Enrich top products with product details
    const enrichedTopProducts = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        });
        return {
          product,
          totalSold: item._sum.soldQuantity || 0,
        };
      })
    );

    // Get events by status for chart
    const eventsByStatus = [
      { status: 'PLANNED', count: plannedEvents, color: '#6b7280' },
      { status: 'ACTIVE', count: activeEvents, color: '#3b82f6' },
      { status: 'COMPLETED', count: completedEvents, color: '#10b981' },
      { status: 'CANCELLED', count: cancelledEvents, color: '#ef4444' },
    ];

    return apiResponse({
      stats: {
        totalEvents,
        plannedEvents,
        activeEvents,
        completedEvents,
        cancelledEvents,
        totalCosts: completedEventsData._sum.totalCost || 0,
        totalRevenue: completedEventsData._sum.actualRevenue || 0,
        totalProfit: completedEventsData._sum.profitMargin || 0,
        avgROI: parseFloat(avgROI.toFixed(2)),
      },
      eventsByCity: eventsByCity.map(item => ({
        city: item.city,
        count: item._count.city,
        totalRevenue: item._sum.actualRevenue || 0,
        totalProfit: item._sum.profitMargin || 0,
      })),
      mostProfitableEvents: enrichedProfitableEvents,
      topStaff: enrichedTopStaff,
      topProducts: enrichedTopProducts,
      eventsByStatus,
    });
  } catch (error: any) {
    console.error('Error fetching event stats:', error);
    return apiError(error.message || 'Failed to fetch stats', 500);
  }
});
