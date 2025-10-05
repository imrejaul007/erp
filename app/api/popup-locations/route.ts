import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: any = { tenantId };
    if (status) where.status = status;
    if (type) where.type = type;

    const locations = await prisma.popupLocation.findMany({
      where,
      include: {
        assignedStaff: {
          include: {
            staff: {
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
              },
            },
          },
        },
        sales: {
          select: {
            id: true,
            orderNumber: true,
            grandTotal: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return apiResponse({ locations });
  } catch (error) {
    console.error('Popup Locations Error:', error);
    return apiError('Failed to fetch popup locations', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId, userId }) => {
  try {
    const body = await request.json();
    const {
      name,
      nameArabic,
      type,
      location,
      locationArabic,
      startDate,
      endDate,
      setupCost = 0,
      rentalCost = 0,
      otherCosts = 0,
      notes,
    } = body;

    if (!name || !type || !location || !startDate || !endDate) {
      return apiError('Missing required fields', 400);
    }

    const totalCost = setupCost + rentalCost + otherCosts;

    const popupLocation = await prisma.popupLocation.create({
      data: {
        name,
        nameArabic,
        type,
        location,
        locationArabic,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        setupCost,
        rentalCost,
        otherCosts,
        totalCost,
        notes,
        tenantId,
        createdById: userId,
      },
    });

    return apiResponse(popupLocation, 201);
  } catch (error) {
    console.error('Popup Location Creation Error:', error);
    return apiError('Failed to create popup location', 500);
  }
});
