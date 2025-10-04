import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// GET - Get customer feedback statistics
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const [
      totalFeedbacks,
      positiveFeedbacks,
      neutralFeedbacks,
      negativeFeedbacks,
      rejections,
      actionRequired,
      actionTaken,
    ] = await Promise.all([
      prisma.customerFeedback.count({ where: { tenantId } }),
      prisma.customerFeedback.count({ where: { tenantId, sentiment: 'POSITIVE' } }),
      prisma.customerFeedback.count({ where: { tenantId, sentiment: 'NEUTRAL' } }),
      prisma.customerFeedback.count({ where: { tenantId, sentiment: 'NEGATIVE' } }),
      prisma.customerFeedback.count({ where: { tenantId, isRejection: true } }),
      prisma.customerFeedback.count({ where: { tenantId, actionRequired: true, actionTaken: false } }),
      prisma.customerFeedback.count({ where: { tenantId, actionTaken: true } }),
    ]);

    // Calculate average rating
    const avgRatingResult = await prisma.customerFeedback.aggregate({
      where: { tenantId },
      _avg: {
        rating: true,
      },
    });

    // Get feedbacks by category
    const feedbacksByCategory = await prisma.customerFeedback.groupBy({
      by: ['category'],
      where: { tenantId },
      _count: {
        category: true,
      },
      _avg: {
        rating: true,
      },
    });

    // Get feedbacks by rating
    const feedbacksByRating = await prisma.customerFeedback.groupBy({
      by: ['rating'],
      where: { tenantId },
      _count: {
        rating: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });

    // Get top rejection reasons
    const rejectionReasons = await prisma.customerFeedback.groupBy({
      by: ['rejectionReason'],
      where: {
        tenantId,
        isRejection: true,
        rejectionReason: { not: null },
      },
      _count: {
        rejectionReason: true,
      },
      orderBy: {
        _count: {
          rejectionReason: 'desc',
        },
      },
      take: 5,
    });

    // Get products with most negative feedback
    const productsWithNegativeFeedback = await prisma.customerFeedback.groupBy({
      by: ['productId'],
      where: {
        tenantId,
        sentiment: 'NEGATIVE',
      },
      _count: {
        productId: true,
      },
      _avg: {
        rating: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: 5,
    });

    // Enrich products with negative feedback
    const enrichedNegativeProducts = await Promise.all(
      productsWithNegativeFeedback.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            sku: true,
          },
        });
        return {
          product,
          negativeCount: item._count.productId,
          avgRating: item._avg.rating || 0,
        };
      })
    );

    // Get recent feedbacks requiring action
    const pendingActions = await prisma.customerFeedback.findMany({
      where: {
        tenantId,
        actionRequired: true,
        actionTaken: false,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Get feedbacks by sentiment for chart
    const feedbacksBySentiment = [
      { sentiment: 'POSITIVE', count: positiveFeedbacks, color: '#10b981' },
      { sentiment: 'NEUTRAL', count: neutralFeedbacks, color: '#6b7280' },
      { sentiment: 'NEGATIVE', count: negativeFeedbacks, color: '#ef4444' },
    ];

    // Calculate satisfaction rate (positive / total)
    const satisfactionRate = totalFeedbacks > 0
      ? ((positiveFeedbacks / totalFeedbacks) * 100).toFixed(2)
      : 0;

    // Calculate rejection rate
    const rejectionRate = totalFeedbacks > 0
      ? ((rejections / totalFeedbacks) * 100).toFixed(2)
      : 0;

    // Calculate action completion rate
    const totalActions = actionRequired + actionTaken;
    const actionCompletionRate = totalActions > 0
      ? ((actionTaken / totalActions) * 100).toFixed(2)
      : 0;

    return apiResponse({
      stats: {
        totalFeedbacks,
        positiveFeedbacks,
        neutralFeedbacks,
        negativeFeedbacks,
        rejections,
        pendingActions: actionRequired,
        completedActions: actionTaken,
        avgRating: avgRatingResult._avg.rating || 0,
        satisfactionRate: parseFloat(satisfactionRate as string),
        rejectionRate: parseFloat(rejectionRate as string),
        actionCompletionRate: parseFloat(actionCompletionRate as string),
      },
      feedbacksByCategory: feedbacksByCategory.map(item => ({
        category: item.category,
        count: item._count.category,
        avgRating: item._avg.rating || 0,
      })),
      feedbacksByRating: feedbacksByRating.map(item => ({
        rating: item.rating,
        count: item._count.rating,
      })),
      topRejectionReasons: rejectionReasons.map(item => ({
        reason: item.rejectionReason,
        count: item._count.rejectionReason,
      })),
      productsWithMostNegativeFeedback: enrichedNegativeProducts,
      pendingActions,
      feedbacksBySentiment,
    });
  } catch (error: any) {
    console.error('Error fetching feedback stats:', error);
    return apiError(error.message || 'Failed to fetch stats', 500);
  }
});
