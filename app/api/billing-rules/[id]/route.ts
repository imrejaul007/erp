import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const UpdateBillingRuleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  ruleType: z.enum(['AUTO_INVOICE', 'LATE_FEE', 'PAYMENT_REMINDER', 'DUNNING', 'AUTO_CREDIT_NOTE', 'SUBSCRIPTION_BILLING']).optional(),
  triggerEvent: z.string().min(1).optional(),
  triggerConditions: z.record(z.any()).optional(),
  actionType: z.string().min(1).optional(),
  actionConfig: z.record(z.any()).optional(),
  lateFeeType: z.enum(['FIXED', 'PERCENTAGE', 'TIERED']).optional().nullable(),
  lateFeeAmount: z.number().nonnegative().optional().nullable(),
  lateFeePercent: z.number().nonnegative().optional().nullable(),
  lateFeeMax: z.number().nonnegative().optional().nullable(),
  priority: z.number().int().optional(),
  maxExecutions: z.number().int().positive().optional().nullable(),
});

// GET /api/billing-rules/[id] - Get single billing rule
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const rule = await prisma.billingRule.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        executions: {
          take: 10,
          orderBy: { executedAt: 'desc' },
        },
        _count: {
          select: {
            executions: true,
          },
        },
      },
    });

    if (!rule) {
      return apiError('Billing rule not found', 404);
    }

    return apiResponse({ rule });
  } catch (error: any) {
    console.error('Error fetching billing rule:', error);
    return apiError(error.message || 'Failed to fetch billing rule', 500);
  }
});

// PATCH /api/billing-rules/[id] - Update billing rule
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = UpdateBillingRuleSchema.parse(body);

    const existing = await prisma.billingRule.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existing) {
      return apiError('Billing rule not found', 404);
    }

    // Validate late fee settings if updating to LATE_FEE type
    const newRuleType = validated.ruleType || existing.ruleType;
    if (newRuleType === 'LATE_FEE') {
      const lateFeeType = validated.lateFeeType !== undefined ? validated.lateFeeType : existing.lateFeeType;
      if (!lateFeeType) {
        return apiError('Late fee type is required for LATE_FEE rules', 400);
      }
    }

    const rule = await prisma.billingRule.update({
      where: { id },
      data: validated,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Billing rule updated successfully',
      rule,
    });
  } catch (error: any) {
    console.error('Error updating billing rule:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update billing rule', 500);
  }
});

// DELETE /api/billing-rules/[id] - Delete billing rule
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const existing = await prisma.billingRule.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existing) {
      return apiError('Billing rule not found', 404);
    }

    await prisma.billingRule.delete({
      where: { id },
    });

    return apiResponse({
      message: 'Billing rule deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting billing rule:', error);
    return apiError(error.message || 'Failed to delete billing rule', 500);
  }
});
