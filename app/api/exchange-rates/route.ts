import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schema for exchange rate
const ExchangeRateCreateSchema = z.object({
  countryId: z.string().min(1, 'Country is required'),
  baseCurrency: z.string().min(3, 'Base currency code is required (e.g., AED)'),
  targetCurrency: z.string().min(3, 'Target currency code is required (e.g., USD)'),
  rate: z.number().min(0, 'Exchange rate must be positive'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
});

const ExchangeRateUpdateSchema = z.object({
  rate: z.number().min(0).optional(),
  effectiveDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET - List all exchange rates
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const countryId = url.searchParams.get('countryId');
    const isActive = url.searchParams.get('isActive');
    const latest = url.searchParams.get('latest'); // Get only latest rates

    const whereClause: any = { tenantId };

    if (countryId) {
      whereClause.countryId = countryId;
    }

    if (isActive !== null) {
      whereClause.isActive = isActive === 'true';
    }

    let rates;

    if (latest === 'true') {
      // Get latest rate for each country
      const countries = await prisma.countryConfig.findMany({
        where: { tenantId, isActive: true },
        include: {
          exchangeRates: {
            where: { isActive: true },
            orderBy: { effectiveDate: 'desc' },
            take: 1,
            include: {
              country: {
                select: {
                  id: true,
                  countryCode: true,
                  countryName: true,
                  currency: true,
                },
              },
            },
          },
        },
      });

      rates = countries
        .map(country => country.exchangeRates[0])
        .filter(Boolean);
    } else {
      // Get all rates with filters
      rates = await prisma.exchangeRate.findMany({
        where: whereClause,
        include: {
          country: {
            select: {
              id: true,
              countryCode: true,
              countryName: true,
              currency: true,
            },
          },
        },
        orderBy: [
          { effectiveDate: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    }

    return apiResponse({ rates });
  } catch (error: any) {
    console.error('Error fetching exchange rates:', error);
    return apiError(error.message || 'Failed to fetch exchange rates', 500);
  }
});

// POST - Create new exchange rate
export const POST = withTenant(async (req, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = ExchangeRateCreateSchema.parse(body);

    // Verify country exists and belongs to tenant
    const country = await prisma.countryConfig.findFirst({
      where: { id: validated.countryId, tenantId },
    });

    if (!country) {
      return apiError('Country not found', 404);
    }

    // Check if rate already exists for same date, base, and target currency
    const existingRate = await prisma.exchangeRate.findFirst({
      where: {
        countryId: validated.countryId,
        baseCurrency: validated.baseCurrency,
        targetCurrency: validated.targetCurrency,
        effectiveDate: new Date(validated.effectiveDate),
        tenantId,
      },
    });

    if (existingRate) {
      return apiError('Exchange rate already exists for this date and currency pair. Use PATCH to update.', 400);
    }

    const rate = await prisma.exchangeRate.create({
      data: {
        countryId: validated.countryId,
        baseCurrency: validated.baseCurrency,
        targetCurrency: validated.targetCurrency,
        rate: validated.rate,
        effectiveDate: new Date(validated.effectiveDate),
        isActive: true,
        tenantId,
      },
      include: {
        country: {
          select: {
            id: true,
            countryCode: true,
            countryName: true,
            currency: true,
          },
        },
      },
    });

    return apiResponse({ rate }, 201);
  } catch (error: any) {
    console.error('Error creating exchange rate:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create exchange rate', 500);
  }
});

// PATCH - Update exchange rate
export const PATCH = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const rateId = url.searchParams.get('rateId');

    if (!rateId) {
      return apiError('Rate ID is required', 400);
    }

    const body = await req.json();
    const validated = ExchangeRateUpdateSchema.parse(body);

    // Verify rate exists and belongs to tenant
    const existingRate = await prisma.exchangeRate.findFirst({
      where: { id: rateId, tenantId },
    });

    if (!existingRate) {
      return apiError('Exchange rate not found', 404);
    }

    // Prepare update data
    const updateData: any = {};

    if (validated.rate !== undefined) {
      updateData.rate = validated.rate;
    }

    if (validated.effectiveDate) {
      updateData.effectiveDate = new Date(validated.effectiveDate);
    }

    if (validated.isActive !== undefined) {
      updateData.isActive = validated.isActive;
    }

    const rate = await prisma.exchangeRate.update({
      where: { id: rateId },
      data: updateData,
      include: {
        country: {
          select: {
            id: true,
            countryCode: true,
            countryName: true,
            currency: true,
          },
        },
      },
    });

    return apiResponse({ rate });
  } catch (error: any) {
    console.error('Error updating exchange rate:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update exchange rate', 500);
  }
});

// DELETE - Delete exchange rate
export const DELETE = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const rateId = url.searchParams.get('rateId');

    if (!rateId) {
      return apiError('Rate ID is required', 400);
    }

    // Verify rate exists and belongs to tenant
    const existingRate = await prisma.exchangeRate.findFirst({
      where: { id: rateId, tenantId },
    });

    if (!existingRate) {
      return apiError('Exchange rate not found', 404);
    }

    await prisma.exchangeRate.delete({
      where: { id: rateId },
    });

    return apiResponse({ message: 'Exchange rate deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting exchange rate:', error);
    return apiError(error.message || 'Failed to delete exchange rate', 500);
  }
});
