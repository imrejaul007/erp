import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const EventStaffCreateSchema = z.object({
  userId: z.string().min(1, 'User/staff is required'),
  role: z.string().min(1, 'Role is required'),
  shiftStart: z.string().optional(),
  shiftEnd: z.string().optional(),
  salesTarget: z.number().min(0).optional(),
});

const EventStaffUpdateSchema = z.object({
  role: z.string().optional(),
  shiftStart: z.string().optional(),
  shiftEnd: z.string().optional(),
  salesTarget: z.number().min(0).optional(),
  actualSales: z.number().min(0).optional(),
});

// GET - Get all staff for an event
export const GET = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id: locationId } = context.params;

    // Verify event exists and belongs to tenant
    const event = await prisma.popupLocation.findFirst({
      where: { id: locationId, tenantId },
    });

    if (!event) {
      return apiError('Event not found', 404);
    }

    const staff = await prisma.eventStaff.findMany({
      where: { locationId, tenantId },
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
      orderBy: { createdAt: 'asc' },
    });

    return apiResponse({ staff });
  } catch (error: any) {
    console.error('Error fetching event staff:', error);
    return apiError(error.message || 'Failed to fetch staff', 500);
  }
});

// POST - Add staff to event
export const POST = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id: locationId } = context.params;
    const body = await req.json();
    const validated = EventStaffCreateSchema.parse(body);

    // Verify event exists and belongs to tenant
    const event = await prisma.popupLocation.findFirst({
      where: { id: locationId, tenantId },
    });

    if (!event) {
      return apiError('Event not found', 404);
    }

    // Check if staff already assigned to this event
    const existingStaff = await prisma.eventStaff.findFirst({
      where: {
        locationId,
        userId: validated.userId,
        tenantId,
      },
    });

    if (existingStaff) {
      return apiError('Staff already assigned to this event', 400);
    }

    // Create staff assignment
    const staff = await prisma.eventStaff.create({
      data: {
        locationId,
        userId: validated.userId,
        role: validated.role,
        shiftStart: validated.shiftStart ? new Date(validated.shiftStart) : null,
        shiftEnd: validated.shiftEnd ? new Date(validated.shiftEnd) : null,
        salesTarget: validated.salesTarget || 0,
        actualSales: 0,
        tenantId,
      },
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
    });

    return apiResponse({ staff }, 201);
  } catch (error: any) {
    console.error('Error adding event staff:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to add staff', 500);
  }
});

// PATCH - Update staff assignment
export const PATCH = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const url = new URL(req.url);
    const staffId = url.searchParams.get('staffId');

    if (!staffId) {
      return apiError('Staff ID is required', 400);
    }

    const body = await req.json();
    const validated = EventStaffUpdateSchema.parse(body);

    // Verify staff exists and belongs to tenant
    const existingStaff = await prisma.eventStaff.findFirst({
      where: { id: staffId, tenantId },
    });

    if (!existingStaff) {
      return apiError('Staff assignment not found', 404);
    }

    // Prepare update data
    const updateData: any = { ...validated };

    if (validated.shiftStart) {
      updateData.shiftStart = new Date(validated.shiftStart);
    }
    if (validated.shiftEnd) {
      updateData.shiftEnd = new Date(validated.shiftEnd);
    }

    const staff = await prisma.eventStaff.update({
      where: { id: staffId },
      data: updateData,
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
    });

    return apiResponse({ staff });
  } catch (error: any) {
    console.error('Error updating event staff:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update staff', 500);
  }
});

// DELETE - Remove staff from event
export const DELETE = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const url = new URL(req.url);
    const staffId = url.searchParams.get('staffId');

    if (!staffId) {
      return apiError('Staff ID is required', 400);
    }

    // Verify staff exists and belongs to tenant
    const existingStaff = await prisma.eventStaff.findFirst({
      where: { id: staffId, tenantId },
    });

    if (!existingStaff) {
      return apiError('Staff assignment not found', 404);
    }

    await prisma.eventStaff.delete({
      where: { id: staffId },
    });

    return apiResponse({ message: 'Staff removed from event successfully' });
  } catch (error: any) {
    console.error('Error removing event staff:', error);
    return apiError(error.message || 'Failed to remove staff', 500);
  }
});
