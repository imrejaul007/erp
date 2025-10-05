import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };
    if (productId) where.productId = productId;
    if (isActive !== null) where.isActive = isActive === 'true';

    const rules = await prisma.autoReorderRule.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ rules });
  } catch (error) {
    console.error('Reorder Rules Error:', error);
    return apiError('Failed to fetch reorder rules', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const body = await request.json();
    const {
      productId,
      storeId,
      reorderPoint,
      reorderQuantity,
      maxStock,
      useAiForecasting = false,
      leadTimeDays = 7,
      safetyStockDays = 3,
      isActive = true,
      autoCreate = false,
      supplierId,
    } = body;

    if (!productId || !reorderPoint || !reorderQuantity) {
      return apiError('Missing required fields', 400);
    }

    const rule = await prisma.autoReorderRule.create({
      data: {
        productId,
        storeId,
        reorderPoint,
        reorderQuantity,
        maxStock,
        useAiForecasting,
        leadTimeDays,
        safetyStockDays,
        isActive,
        autoCreate,
        supplierId,
        tenantId,
      },
    });

    return apiResponse(rule, 201);
  } catch (error) {
    console.error('Reorder Rule Creation Error:', error);
    return apiError('Failed to create reorder rule', 500);
  }
});
