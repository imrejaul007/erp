import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ReimburseSchema = z.object({
  reimbursementReference: z.string().min(1, 'Reimbursement reference is required'),
  notes: z.string().optional(),
});

/**
 * POST /api/expenses/[id]/reimburse - Mark expense as reimbursed
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = ReimburseSchema.parse(body);

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!expense) {
      return apiError('Expense not found', 404);
    }

    if (expense.status !== 'APPROVED') {
      return apiError('Can only reimburse approved expenses', 400);
    }

    if (expense.reimbursedAt) {
      return apiError('Expense already reimbursed', 400);
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        status: 'REIMBURSED',
        reimbursedAt: new Date(),
        reimbursedBy: user?.id,
        reimbursementReference: validated.reimbursementReference,
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
      message: 'Expense marked as reimbursed successfully',
      expense: updatedExpense,
    });
  } catch (error: any) {
    console.error('Error reimbursing expense:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to reimburse expense', 500);
  }
});
