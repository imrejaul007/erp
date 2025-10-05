import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const productId = searchParams.get('productId');
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };
    if (customerId) where.customerId = customerId;
    if (productId) where.productId = productId;
    if (isActive !== null) where.isActive = isActive === 'true';

    const recommendations = await prisma.customerRecommendation.findMany({
      where,
      orderBy: { score: 'desc' },
      take: 50,
    });

    return apiResponse({ recommendations });
  } catch (error) {
    console.error('Recommendations Error:', error);
    return apiError('Failed to fetch recommendations', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const body = await request.json();
    const {
      customerId,
      productId,
      score = 0,
      reason,
      basedOn,
      confidence = 0,
      validUntil,
      isActive = true,
    } = body;

    if (!customerId || !productId || !reason || !validUntil) {
      return apiError('Missing required fields', 400);
    }

    const recommendation = await prisma.customerRecommendation.create({
      data: {
        customerId,
        productId,
        score,
        reason,
        basedOn,
        confidence,
        validUntil: new Date(validUntil),
        isActive,
        tenantId,
      },
    });

    return apiResponse(recommendation, 201);
  } catch (error) {
    console.error('Recommendation Creation Error:', error);
    return apiError('Failed to create recommendation', 500);
  }
});
