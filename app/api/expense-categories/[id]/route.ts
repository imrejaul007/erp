import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const CategoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/expense-categories/[id] - Get single expense category
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const category = await prisma.expenseCategory.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        parent: true,
        children: true,
        expenses: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            expenses: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return apiError('Expense category not found', 404);
    }

    return apiResponse(category);
  } catch (error: any) {
    console.error('Error fetching expense category:', error);
    return apiError(error.message || 'Failed to fetch expense category', 500);
  }
});

/**
 * PATCH /api/expense-categories/[id] - Update expense category
 */
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = CategoryUpdateSchema.parse(body);

    const existing = await prisma.expenseCategory.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiError('Expense category not found', 404);
    }

    // Check for duplicate name if updating
    if (validated.name && validated.name !== existing.name) {
      const duplicate = await prisma.expenseCategory.findFirst({
        where: {
          tenantId,
          name: validated.name,
          id: { not: id },
        },
      });

      if (duplicate) {
        return apiError('Category with this name already exists', 400);
      }
    }

    // Prevent setting self as parent
    if (validated.parentId === id) {
      return apiError('Category cannot be its own parent', 400);
    }

    // Verify parent exists if updating
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

    const category = await prisma.expenseCategory.update({
      where: { id },
      data: validated,
      include: {
        parent: true,
        children: true,
      },
    });

    return apiResponse({
      message: 'Expense category updated successfully',
      category,
    });
  } catch (error: any) {
    console.error('Error updating expense category:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update expense category', 500);
  }
});

/**
 * DELETE /api/expense-categories/[id] - Delete expense category
 */
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const category = await prisma.expenseCategory.findFirst({
      where: { id, tenantId },
      include: {
        _count: {
          select: {
            expenses: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return apiError('Expense category not found', 404);
    }

    // Prevent deletion if has expenses or children
    if (category._count.expenses > 0) {
      return apiError('Cannot delete category with existing expenses', 400);
    }

    if (category._count.children > 0) {
      return apiError('Cannot delete category with subcategories', 400);
    }

    await prisma.expenseCategory.delete({
      where: { id },
    });

    return apiResponse({ message: 'Expense category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting expense category:', error);
    return apiError(error.message || 'Failed to delete expense category', 500);
  }
});
