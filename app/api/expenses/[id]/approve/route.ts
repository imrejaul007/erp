import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ApproveSchema = z.object({
  notes: z.string().optional(),
});

/**
 * POST /api/expenses/[id]/approve - Approve expense
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = ApproveSchema.parse(body);

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!expense) {
      return apiError('Expense not found', 404);
    }

    if (expense.status !== 'PENDING') {
      return apiError('Can only approve pending expenses', 400);
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: user?.id,
        notes: validated.notes || expense.notes,
      },
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
      message: 'Expense approved successfully',
      expense: updatedExpense,
    });
  } catch (error: any) {
    console.error('Error approving expense:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to approve expense', 500);
  }
});
