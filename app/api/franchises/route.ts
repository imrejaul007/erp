import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const territory = searchParams.get('territory');

    const where: any = { tenantId };
    if (status) where.status = status;
    if (territory) where.territory = territory;

    const franchises = await prisma.franchise.findMany({
      where,
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        commissions: {
          take: 3,
          orderBy: { month: 'desc' },
        },
        performance: {
          take: 6,
          orderBy: { month: 'desc' },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ franchises });
  } catch (error) {
    console.error('Franchises Error:', error);
    return apiError('Failed to fetch franchises', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId, userId }) => {
  try {
    const body = await request.json();
    const {
      name,
      nameArabic,
      franchiseCode,
      ownerName,
      ownerEmail,
      ownerPhone,
      address,
      territory,
      type = 'STANDARD',
      royaltyPercent = 0,
      monthlyFee = 0,
    } = body;

    if (!name || !franchiseCode || !ownerName || !ownerEmail || !ownerPhone || !territory) {
      return apiError('Missing required fields', 400);
    }

    const franchise = await prisma.franchise.create({
      data: {
        name,
        nameArabic,
        franchiseCode,
        ownerName,
        ownerEmail,
        ownerPhone,
        address,
        territory,
        type,
        royaltyPercent,
        monthlyFee,
        tenantId,
        createdById: userId,
      },
    });

    return apiResponse(franchise, 201);
  } catch (error) {
    console.error('Franchise Creation Error:', error);
    return apiError('Failed to create franchise', 500);
  }
});
