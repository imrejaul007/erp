import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schema for creating a pop-up event
const PopupEventCreateSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  location: z.string().min(1, 'Location is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  startDate: z.string(),
  endDate: z.string(),
  setupCost: z.number().min(0).optional().default(0),
  rentCost: z.number().min(0).optional().default(0),
  staffCost: z.number().min(0).optional().default(0),
  marketingCost: z.number().min(0).optional().default(0),
  otherCosts: z.number().min(0).optional().default(0),
  targetRevenue: z.number().min(0).optional(),
  notes: z.string().optional(),
});

// GET - List all pop-up events
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const whereClause: any = { tenantId };

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const events = await prisma.popupLocation.findMany({
      where: whereClause,
      include: {
        staff: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return apiError(error.message || 'Failed to fetch events', 500);
  }
});

// POST - Create new pop-up event
export const POST = withTenant(async (req, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = PopupEventCreateSchema.parse(body);

    const {
      name,
      location,
      address,
      city,
      country,
      startDate,
      endDate,
      setupCost,
      rentCost,
      staffCost,
      marketingCost,
      otherCosts,
      targetRevenue,
      notes,
    } = validated;

    // Calculate total cost
    const totalCost = setupCost + rentCost + staffCost + marketingCost + otherCosts;

    // Create event
    const event = await prisma.popupLocation.create({
      data: {
        name,
        location,
        address,
        city,
        country,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        setupCost,
        rentCost,
        staffCost,
        marketingCost,
        otherCosts,
        totalCost,
        targetRevenue: targetRevenue || 0,
        actualRevenue: 0,
        profitMargin: 0 - totalCost, // Initially negative (costs only)
        status: 'PLANNED',
        notes,
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

    return apiResponse({ event }, 201);
  } catch (error: any) {
    console.error('Error creating event:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create event', 500);
  }
});
