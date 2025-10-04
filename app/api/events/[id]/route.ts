import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const PopupEventUpdateSchema = z.object({
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  actualRevenue: z.number().min(0).optional(),
  setupCost: z.number().min(0).optional(),
  rentCost: z.number().min(0).optional(),
  staffCost: z.number().min(0).optional(),
  marketingCost: z.number().min(0).optional(),
  otherCosts: z.number().min(0).optional(),
  notes: z.string().optional(),
});

// GET - Get single event
export const GET = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    const event = await prisma.popupLocation.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        staff: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        inventory: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                unitPrice: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return apiError('Event not found', 404);
    }

    return apiResponse({ event });
  } catch (error: any) {
    console.error('Error fetching event:', error);
    return apiError(error.message || 'Failed to fetch event', 500);
  }
});

// PATCH - Update event
export const PATCH = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const body = await req.json();
    const validated = PopupEventUpdateSchema.parse(body);

    // Verify event exists and belongs to tenant
    const existingEvent = await prisma.popupLocation.findFirst({
      where: { id, tenantId },
    });

    if (!existingEvent) {
      return apiError('Event not found', 404);
    }

    // Prepare update data
    let updateData: any = { ...validated };

    // Recalculate total cost and profit margin if any cost fields are updated
    const costFields = ['setupCost', 'rentCost', 'staffCost', 'marketingCost', 'otherCosts'];
    const anyCostUpdated = costFields.some(field => validated[field as keyof typeof validated] !== undefined);

    if (anyCostUpdated || validated.actualRevenue !== undefined) {
      const setupCost = validated.setupCost ?? Number(existingEvent.setupCost);
      const rentCost = validated.rentCost ?? Number(existingEvent.rentCost);
      const staffCost = validated.staffCost ?? Number(existingEvent.staffCost);
      const marketingCost = validated.marketingCost ?? Number(existingEvent.marketingCost);
      const otherCosts = validated.otherCosts ?? Number(existingEvent.otherCosts);
      const actualRevenue = validated.actualRevenue ?? Number(existingEvent.actualRevenue);

      const totalCost = setupCost + rentCost + staffCost + marketingCost + otherCosts;
      const profitMargin = actualRevenue - totalCost;

      updateData.totalCost = totalCost;
      updateData.profitMargin = profitMargin;
    }

    const event = await prisma.popupLocation.update({
      where: { id },
      data: updateData,
      include: {
        staff: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        inventory: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                unitPrice: true,
              },
            },
          },
        },
      },
    });

    return apiResponse({ event });
  } catch (error: any) {
    console.error('Error updating event:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update event', 500);
  }
});

// DELETE - Delete event
export const DELETE = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    // Verify event exists and belongs to tenant
    const existingEvent = await prisma.popupLocation.findFirst({
      where: { id, tenantId },
    });

    if (!existingEvent) {
      return apiError('Event not found', 404);
    }

    // Delete event and related data (cascade)
    await prisma.popupLocation.delete({
      where: { id },
    });

    return apiResponse({ message: 'Event deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return apiError(error.message || 'Failed to delete event', 500);
  }
});
