import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const convertedToSale = searchParams.get('converted');
    const storeId = searchParams.get('storeId');

    const where: any = { tenantId };
    if (convertedToSale !== null) where.convertedToSale = convertedToSale === 'true';
    if (storeId) where.storeId = storeId;

    const demos = await prisma.demoLog.findMany({
      where,
      include: {
        tester: {
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
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        sale: {
          select: {
            id: true,
            orderNumber: true,
            grandTotal: true,
          },
        },
      },
      orderBy: { demoDate: 'desc' },
    });

    return apiResponse({ demos });
  } catch (error) {
    console.error('Demo Logs Error:', error);
    return apiError('Failed to fetch demo logs', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId, userId }) => {
  try {
    const body = await request.json();
    const {
      testerId,
      productId,
      customerId,
      quantityUsed,
      convertedToSale = false,
      saleId,
      storeId,
      notes,
    } = body;

    if (!testerId || !productId || !quantityUsed || !storeId) {
      return apiError('Missing required fields', 400);
    }

    const demo = await prisma.demoLog.create({
      data: {
        testerId,
        productId,
        customerId,
        quantityUsed,
        convertedToSale,
        saleId,
        storeId,
        staffId: userId,
        notes,
        tenantId,
      },
      include: {
        tester: true,
        product: true,
        customer: true,
        staff: true,
        store: true,
      },
    });

    // Update tester totalUsed
    await prisma.testerInventory.update({
      where: { id: testerId },
      data: {
        totalUsed: {
          increment: quantityUsed,
        },
        quantity: {
          decrement: quantityUsed,
        },
      },
    });

    return apiResponse(demo, 201);
  } catch (error) {
    console.error('Demo Log Creation Error:', error);
    return apiError('Failed to create demo log', 500);
  }
});
