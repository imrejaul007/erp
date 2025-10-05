import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const integrations = await prisma.paymentIntegration.findMany({
      where: { tenantId },
      select: {
        id: true,
        provider: true,
        name: true,
        isActive: true,
        isTest: true,
        supportedCurrencies: true,
        supportedMethods: true,
        createdAt: true,
        updatedAt: true,
        // Exclude sensitive credentials
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ integrations });
  } catch (error) {
    console.error('Payment Integrations Error:', error);
    return apiError('Failed to fetch payment integrations', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const body = await request.json();
    const {
      provider,
      name,
      isActive = false,
      isTest = true,
      apiKey,
      apiSecret,
      merchantId,
      webhookSecret,
      supportedCurrencies = [],
      supportedMethods = [],
    } = body;

    if (!provider || !name) {
      return apiError('Missing required fields', 400);
    }

    const integration = await prisma.paymentIntegration.create({
      data: {
        provider,
        name,
        isActive,
        isTest,
        apiKey,
        apiSecret,
        merchantId,
        webhookSecret,
        supportedCurrencies,
        supportedMethods,
        tenantId,
      },
      select: {
        id: true,
        provider: true,
        name: true,
        isActive: true,
        isTest: true,
        supportedCurrencies: true,
        supportedMethods: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return apiResponse(integration, 201);
  } catch (error) {
    console.error('Payment Integration Creation Error:', error);
    return apiError('Failed to create payment integration', 500);
  }
});
