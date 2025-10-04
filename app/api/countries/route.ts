import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schema for country config
const CountryConfigCreateSchema = z.object({
  countryCode: z.string().min(2, 'Country code is required (e.g., AE, SA)'),
  countryName: z.string().min(1, 'Country name is required'),
  currency: z.string().min(3, 'Currency code is required (e.g., AED, SAR)'),
  taxRate: z.number().min(0).max(100, 'Tax rate must be between 0-100'),
  vatNumber: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

const CountryConfigUpdateSchema = z.object({
  countryName: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(),
  vatNumber: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET - List all country configurations
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const isActive = url.searchParams.get('isActive');

    const whereClause: any = { tenantId };

    if (isActive !== null) {
      whereClause.isActive = isActive === 'true';
    }

    const countries = await prisma.countryConfig.findMany({
      where: whereClause,
      include: {
        exchangeRates: {
          orderBy: { effectiveDate: 'desc' },
          take: 1,
        },
      },
      orderBy: { countryName: 'asc' },
    });

    return apiResponse({ countries });
  } catch (error: any) {
    console.error('Error fetching countries:', error);
    return apiError(error.message || 'Failed to fetch countries', 500);
  }
});

// POST - Create new country configuration
export const POST = withTenant(async (req, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = CountryConfigCreateSchema.parse(body);

    // Check if country already exists for this tenant
    const existingCountry = await prisma.countryConfig.findFirst({
      where: {
        countryCode: validated.countryCode,
        tenantId,
      },
    });

    if (existingCountry) {
      return apiError('Country configuration already exists for this tenant', 400);
    }

    const country = await prisma.countryConfig.create({
      data: {
        ...validated,
        tenantId,
      },
      include: {
        exchangeRates: true,
      },
    });

    return apiResponse({ country }, 201);
  } catch (error: any) {
    console.error('Error creating country:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create country', 500);
  }
});

// PATCH - Update country configuration
export const PATCH = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const countryId = url.searchParams.get('countryId');

    if (!countryId) {
      return apiError('Country ID is required', 400);
    }

    const body = await req.json();
    const validated = CountryConfigUpdateSchema.parse(body);

    // Verify country exists and belongs to tenant
    const existingCountry = await prisma.countryConfig.findFirst({
      where: { id: countryId, tenantId },
    });

    if (!existingCountry) {
      return apiError('Country configuration not found', 404);
    }

    const country = await prisma.countryConfig.update({
      where: { id: countryId },
      data: validated,
      include: {
        exchangeRates: {
          orderBy: { effectiveDate: 'desc' },
          take: 5,
        },
      },
    });

    return apiResponse({ country });
  } catch (error: any) {
    console.error('Error updating country:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update country', 500);
  }
});

// DELETE - Delete country configuration
export const DELETE = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const countryId = url.searchParams.get('countryId');

    if (!countryId) {
      return apiError('Country ID is required', 400);
    }

    // Verify country exists and belongs to tenant
    const existingCountry = await prisma.countryConfig.findFirst({
      where: { id: countryId, tenantId },
    });

    if (!existingCountry) {
      return apiError('Country configuration not found', 404);
    }

    await prisma.countryConfig.delete({
      where: { id: countryId },
    });

    return apiResponse({ message: 'Country configuration deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting country:', error);
    return apiError(error.message || 'Failed to delete country', 500);
  }
});
