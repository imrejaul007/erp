import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const BrandCreateSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters'),
  description: z.string().optional()
});

// GET /api/brands
export const GET = withTenant(async (req, { tenantId, user }) => {
  try {
    const brands = await prisma.brand.findMany({
      where: { tenantId },
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        description: true
      }
    });

    return apiResponse({ brands });

  } catch (error: any) {
    console.error('Error fetching brands:', error);
    return apiError(error.message || 'Failed to fetch brands', 500);
  }
});

// POST /api/brands
export const POST = withTenant(async (req, { tenantId, user }) => {
  try {
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(user.role)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const brandData = BrandCreateSchema.parse(body);

    const brand = await prisma.brand.create({
      data: {
        ...brandData,
        tenantId
      }
    });

    return apiResponse(brand, 201);

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error', 400, error.errors);
    }

    console.error('Error creating brand:', error);
    return apiError(error.message || 'Failed to create brand', 500);
  }
});
