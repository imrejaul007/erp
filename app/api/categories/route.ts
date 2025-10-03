import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const CategoryCreateSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  nameArabic: z.string().optional(),
  description: z.string().optional()
});

// GET /api/categories
export const GET = withTenant(async (req, { tenantId, user }) => {
  // TODO: Add tenantId filter to all Prisma queries in this handler
  try {
    const categories = await prisma.category.findMany({
      where: { tenantId },
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        nameArabic: true,
        description: true
      }
    });

    return apiResponse({ categories });

  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return apiError(error.message || 'Failed to fetch categories', 500);
  }
});

// POST /api/categories
export const POST = withTenant(async (req, { tenantId, user }) => {
  // TODO: Add tenantId filter to all Prisma queries in this handler
  try {
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(user.role)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const categoryData = CategoryCreateSchema.parse(body);

    const category = await prisma.category.create({
      data: {
        ...categoryData,
        tenantId
      }
    });

    return apiResponse(category, 201);

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error creating category:', error);
    return apiError(error.message || 'Failed to create category', 500);
  }
});
