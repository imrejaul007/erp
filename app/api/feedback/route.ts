import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schema for creating customer feedback
const CustomerFeedbackCreateSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  productId: z.string().min(1, 'Product is required'),
  orderId: z.string().optional(),
  rating: z.number().min(1).max(5, 'Rating must be between 1-5'),
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
  feedbackText: z.string().min(1, 'Feedback text is required'),
  category: z.enum(['QUALITY', 'SERVICE', 'DELIVERY', 'PRICING', 'PACKAGING', 'OTHER']),
  isRejection: z.boolean().optional().default(false),
  rejectionReason: z.string().optional(),
  actionRequired: z.boolean().optional().default(false),
  actionNotes: z.string().optional(),
});

// GET - List all customer feedback
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const sentiment = url.searchParams.get('sentiment');
    const category = url.searchParams.get('category');
    const isRejection = url.searchParams.get('isRejection');
    const actionRequired = url.searchParams.get('actionRequired');
    const search = url.searchParams.get('search');

    const whereClause: any = { tenantId };

    if (sentiment) {
      whereClause.sentiment = sentiment;
    }

    if (category) {
      whereClause.category = category;
    }

    if (isRejection) {
      whereClause.isRejection = isRejection === 'true';
    }

    if (actionRequired) {
      whereClause.actionRequired = actionRequired === 'true';
    }

    if (search) {
      whereClause.OR = [
        { feedbackText: { contains: search, mode: 'insensitive' } },
        { rejectionReason: { contains: search, mode: 'insensitive' } },
      ];
    }

    const feedbacks = await prisma.customerFeedback.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ feedbacks });
  } catch (error: any) {
    console.error('Error fetching customer feedback:', error);
    return apiError(error.message || 'Failed to fetch feedback', 500);
  }
});

// POST - Create new customer feedback
export const POST = withTenant(async (req, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = CustomerFeedbackCreateSchema.parse(body);

    const {
      customerId,
      productId,
      orderId,
      rating,
      sentiment,
      feedbackText,
      category,
      isRejection,
      rejectionReason,
      actionRequired,
      actionNotes,
    } = validated;

    // Create feedback
    const feedback = await prisma.customerFeedback.create({
      data: {
        customerId,
        productId,
        orderId,
        rating,
        sentiment,
        feedbackText,
        category,
        isRejection: isRejection || false,
        rejectionReason,
        actionRequired: actionRequired || false,
        actionNotes,
        actionTaken: false,
        tenantId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderDate: true,
          },
        },
      },
    });

    return apiResponse({ feedback }, 201);
  } catch (error: any) {
    console.error('Error creating customer feedback:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create feedback', 500);
  }
});
