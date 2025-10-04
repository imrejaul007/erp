import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const CustomerFeedbackUpdateSchema = z.object({
  actionRequired: z.boolean().optional(),
  actionNotes: z.string().optional(),
  actionTaken: z.boolean().optional(),
  actionDate: z.string().optional(),
  responseText: z.string().optional(),
});

// GET - Get single customer feedback
export const GET = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    const feedback = await prisma.customerFeedback.findFirst({
      where: {
        id,
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
            unitPrice: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderDate: true,
            totalAmount: true,
          },
        },
      },
    });

    if (!feedback) {
      return apiError('Feedback not found', 404);
    }

    return apiResponse({ feedback });
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    return apiError(error.message || 'Failed to fetch feedback', 500);
  }
});

// PATCH - Update customer feedback
export const PATCH = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const body = await req.json();
    const validated = CustomerFeedbackUpdateSchema.parse(body);

    // Verify feedback exists and belongs to tenant
    const existingFeedback = await prisma.customerFeedback.findFirst({
      where: { id, tenantId },
    });

    if (!existingFeedback) {
      return apiError('Feedback not found', 404);
    }

    // Prepare update data
    const updateData: any = { ...validated };

    // Convert actionDate string to Date if provided
    if (validated.actionDate) {
      updateData.actionDate = new Date(validated.actionDate);
    }

    const feedback = await prisma.customerFeedback.update({
      where: { id },
      data: updateData,
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
            unitPrice: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderDate: true,
            totalAmount: true,
          },
        },
      },
    });

    return apiResponse({ feedback });
  } catch (error: any) {
    console.error('Error updating feedback:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update feedback', 500);
  }
});

// DELETE - Delete customer feedback
export const DELETE = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    // Verify feedback exists and belongs to tenant
    const existingFeedback = await prisma.customerFeedback.findFirst({
      where: { id, tenantId },
    });

    if (!existingFeedback) {
      return apiError('Feedback not found', 404);
    }

    // Delete feedback
    await prisma.customerFeedback.delete({
      where: { id },
    });

    return apiResponse({ message: 'Feedback deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting feedback:', error);
    return apiError(error.message || 'Failed to delete feedback', 500);
  }
});
