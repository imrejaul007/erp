import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const productId = searchParams.get('productId');

    const where: any = { tenantId };
    if (storeId) where.storeId = storeId;
    if (productId) where.productId = productId;

    const testers = await prisma.testerInventory.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            nameArabic: true,
            sku: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { lastRefill: 'desc' },
    });

    return apiResponse({ testers });
  } catch (error) {
    console.error('Tester Inventory Error:', error);
    return apiError('Failed to fetch tester inventory', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const body = await request.json();
    const { productId, storeId, staffId, quantity, unit = 'ml', lastRefill, notes } = body;

    if (!productId || !quantity || !lastRefill) {
      return apiError('Missing required fields', 400);
    }

    const tester = await prisma.testerInventory.create({
      data: {
        productId,
        storeId,
        staffId,
        quantity,
        unit,
        lastRefill: new Date(lastRefill),
        notes,
        tenantId,
      },
      include: {
        product: true,
        store: true,
        staff: true,
      },
    });

    return apiResponse(tester, 201);
  } catch (error) {
    console.error('Tester Creation Error:', error);
    return apiError('Failed to create tester', 500);
  }
});
