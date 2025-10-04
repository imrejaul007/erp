import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ExpenseUpdateSchema = z.object({
  categoryId: z.string().optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(10).optional(),
  expenseDate: z.string().datetime().optional(),
  merchantName: z.string().optional().nullable(),
  merchantLocation: z.string().optional().nullable(),
  receiptUrl: z.string().url().optional().nullable(),
  attachments: z.array(z.object({
    url: z.string().url(),
    name: z.string(),
    type: z.string(),
  })).optional(),
  notes: z.string().optional().nullable(),
});

/**
 * GET /api/expenses/[id] - Get single expense
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        category: true,
      },
    });

    if (!expense) {
      return apiError('Expense not found', 404);
    }

    return apiResponse(expense);
  } catch (error: any) {
    console.error('Error fetching expense:', error);
    return apiError(error.message || 'Failed to fetch expense', 500);
  }
});

/**
 * PATCH /api/expenses/[id] - Update expense (only if PENDING)
 */
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = ExpenseUpdateSchema.parse(body);

    const existing = await prisma.expense.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiError('Expense not found', 404);
    }

    // Only allow updates if status is PENDING
    if (existing.status !== 'PENDING') {
      return apiError('Can only update pending expenses', 400);
    }

    // Verify category if updating
    if (validated.categoryId) {
      const category = await prisma.expenseCategory.findFirst({
        where: {
          id: validated.categoryId,
          tenantId,
          isActive: true,
        },
      });

      if (!category) {
        return apiError('Category not found or inactive', 404);
      }
    }

    const updateData: any = {};
    if (validated.categoryId) updateData.categoryId = validated.categoryId;
    if (validated.amount) updateData.amount = validated.amount;
    if (validated.description) updateData.description = validated.description;
    if (validated.expenseDate) updateData.expenseDate = new Date(validated.expenseDate);
    if (validated.merchantName !== undefined) updateData.merchantName = validated.merchantName;
    if (validated.merchantLocation !== undefined) updateData.merchantLocation = validated.merchantLocation;
    if (validated.receiptUrl !== undefined) updateData.receiptUrl = validated.receiptUrl;
    if (validated.attachments) updateData.attachments = validated.attachments;
    if (validated.notes !== undefined) updateData.notes = validated.notes;

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });

    return apiResponse({
      message: 'Expense updated successfully',
      expense,
    });
  } catch (error: any) {
    console.error('Error updating expense:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update expense', 500);
  }
});

/**
 * DELETE /api/expenses/[id] - Delete expense (only if PENDING)
 */
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const expense = await prisma.expense.findFirst({
      where: { id, tenantId },
    });

    if (!expense) {
      return apiError('Expense not found', 404);
    }

    // Only allow deletion if status is PENDING
    if (expense.status !== 'PENDING') {
      return apiError('Can only delete pending expenses', 400);
    }

    await prisma.expense.delete({
      where: { id },
    });

    return apiResponse({ message: 'Expense deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    return apiError(error.message || 'Failed to delete expense', 500);
  }
});
