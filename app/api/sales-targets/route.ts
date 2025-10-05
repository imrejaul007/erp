import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // YYYY-MM format
    const userId = searchParams.get('userId');

    const where: any = { tenantId };
    if (month) {
      const monthDate = new Date(month + '-01');
      where.month = monthDate;
    }
    if (userId) where.userId = userId;

    const targets = await prisma.salesTarget.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { month: 'desc' },
    });

    return apiResponse({ targets });
  } catch (error) {
    console.error('Sales Targets Error:', error);
    return apiError('Failed to fetch sales targets', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const body = await request.json();
    const {
      month, // YYYY-MM-DD format
      targetAmount,
      userId,
      productId,
      categoryId,
    } = body;

    if (!month || !targetAmount) {
      return apiError('Missing required fields', 400);
    }

    const monthDate = new Date(month);
    const year = monthDate.getFullYear();

    const target = await prisma.salesTarget.create({
      data: {
        month: monthDate,
        year,
        targetAmount,
        userId,
        productId,
        categoryId,
        tenantId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return apiResponse(target, 201);
  } catch (error) {
    console.error('Sales Target Creation Error:', error);
    return apiError('Failed to create sales target', 500);
  }
});
