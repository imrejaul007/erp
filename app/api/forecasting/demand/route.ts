import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const storeId = searchParams.get('storeId');
    const month = searchParams.get('month'); // YYYY-MM format

    const where: any = { tenantId };
    if (productId) where.productId = productId;
    if (storeId) where.storeId = storeId;
    if (month) {
      const monthDate = new Date(month + '-01');
      where.forecastMonth = monthDate;
    }

    const forecasts = await prisma.demandForecast.findMany({
      where,
      orderBy: { forecastDate: 'desc' },
      take: 100,
    });

    // Calculate accuracy stats
    const accuracyStats = await prisma.demandForecast.aggregate({
      where: {
        ...where,
        accuracy: { not: null },
      },
      _avg: {
        accuracy: true,
        confidence: true,
      },
    });

    return apiResponse({
      forecasts,
      stats: {
        avgAccuracy: accuracyStats._avg.accuracy || 0,
        avgConfidence: accuracyStats._avg.confidence || 0,
      },
    });
  } catch (error) {
    console.error('Demand Forecast Error:', error);
    return apiError('Failed to fetch demand forecasts', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const body = await request.json();
    const {
      productId,
      storeId,
      forecastDate,
      forecastMonth,
      historicalSales,
      historicalDays,
      predictedDemand,
      confidence = 0,
      minDemand,
      maxDemand,
      seasonality = 0,
      trend = 0,
      externalFactors,
    } = body;

    if (!productId || !forecastDate || !forecastMonth || !predictedDemand) {
      return apiError('Missing required fields', 400);
    }

    const forecast = await prisma.demandForecast.create({
      data: {
        productId,
        storeId,
        forecastDate: new Date(forecastDate),
        forecastMonth: new Date(forecastMonth),
        historicalSales,
        historicalDays,
        predictedDemand,
        confidence,
        minDemand,
        maxDemand,
        seasonality,
        trend,
        externalFactors,
        tenantId,
      },
    });

    return apiResponse(forecast, 201);
  } catch (error) {
    console.error('Demand Forecast Creation Error:', error);
    return apiError('Failed to create demand forecast', 500);
  }
});
