import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const CategoryCreateSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

/**
 * GET /api/expense-categories - List all expense categories
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const parentId = searchParams.get('parentId');

    const where: any = { tenantId };

    if (!includeInactive) {
      where.isActive = true;
    }

    if (parentId === 'null' || parentId === '') {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    const categories = await prisma.expenseCategory.findMany({
      where,
      include: {
        parent: true,
        children: {
          where: includeInactive ? {} : { isActive: true },
        },
        _count: {
          select: {
            expenses: true,
            children: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return apiResponse(categories);
  } catch (error: any) {
    console.error('Error fetching expense categories:', error);
    return apiError(error.message || 'Failed to fetch expense categories', 500);
  }
});

/**
 * POST /api/expense-categories - Create new expense category
 */
export const POST = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = CategoryCreateSchema.parse(body);

    // Check for duplicate category name
    const existing = await prisma.expenseCategory.findFirst({
      where: {
        tenantId,
        name: validated.name,
      },
    });

    if (existing) {
      return apiError('Category with this name already exists', 400);
    }

    // If parentId provided, verify it exists
    if (validated.parentId) {
      const parent = await prisma.expenseCategory.findFirst({
        where: {
          id: validated.parentId,
          tenantId,
        },
      });

      if (!parent) {
        return apiError('Parent category not found', 404);
      }
    }

    const category = await prisma.expenseCategory.create({
      data: {
        ...validated,
        tenantId,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return apiResponse({
      message: 'Expense category created successfully',
      category,
    }, 201);
  } catch (error: any) {
    console.error('Error creating expense category:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create expense category', 500);
  }
});
