import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ExpenseCreateSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  expenseDate: z.string().datetime(),
  merchantName: z.string().optional(),
  merchantLocation: z.string().optional(),
  receiptUrl: z.string().url().optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    name: z.string(),
    type: z.string(),
  })).optional(),
  notes: z.string().optional(),
  currency: z.string().default('AED'),
  exchangeRate: z.number().positive().optional(),
});

/**
 * GET /api/expenses - List all expenses with filters
 */
export const GET = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');
    const categoryId = searchParams.get('categoryId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = { tenantId };

    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    // If employee is viewing, only show their own expenses
    // unless they're an admin
    if (employeeId) {
      where.employeeId = employeeId;
    } else if (user?.role === 'USER') {
      where.employeeId = user.id;
    }

    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) where.expenseDate.gte = new Date(startDate);
      if (endDate) where.expenseDate.lte = new Date(endDate);
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { expenseDate: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return apiResponse(expenses);
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return apiError(error.message || 'Failed to fetch expenses', 500);
  }
});

/**
 * POST /api/expenses - Create new expense
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = ExpenseCreateSchema.parse(body);

    // Verify employee exists
    const employee = await prisma.user.findFirst({
      where: {
        id: validated.employeeId,
        tenantId,
      },
    });

    if (!employee) {
      return apiError('Employee not found', 404);
    }

    // Verify category exists
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

    // Generate expense number
    const count = await prisma.expense.count({ where: { tenantId } });
    const expenseNumber = `EXP-${String(count + 1).padStart(6, '0')}`;

    const expense = await prisma.expense.create({
      data: {
        expenseNumber,
        employeeId: validated.employeeId,
        categoryId: validated.categoryId,
        amount: validated.amount,
        description: validated.description,
        expenseDate: new Date(validated.expenseDate),
        merchantName: validated.merchantName,
        merchantLocation: validated.merchantLocation,
        receiptUrl: validated.receiptUrl,
        attachments: validated.attachments || [],
        notes: validated.notes,
        currency: validated.currency,
        exchangeRate: validated.exchangeRate,
        status: 'PENDING',
        tenantId,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Expense submitted successfully',
      expense,
    }, 201);
  } catch (error: any) {
    console.error('Error creating expense:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create expense', 500);
  }
});
