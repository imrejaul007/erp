import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const BillingRuleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  ruleType: z.enum(['AUTO_INVOICE', 'LATE_FEE', 'PAYMENT_REMINDER', 'DUNNING', 'AUTO_CREDIT_NOTE', 'SUBSCRIPTION_BILLING']),
  triggerEvent: z.string().min(1),
  triggerConditions: z.record(z.any()).default({}),
  actionType: z.string().min(1),
  actionConfig: z.record(z.any()).default({}),
  lateFeeType: z.enum(['FIXED', 'PERCENTAGE', 'TIERED']).optional().nullable(),
  lateFeeAmount: z.number().nonnegative().optional().nullable(),
  lateFeePercent: z.number().nonnegative().optional().nullable(),
  lateFeeMax: z.number().nonnegative().optional().nullable(),
  priority: z.number().int().default(0),
  maxExecutions: z.number().int().positive().optional().nullable(),
});

// GET /api/billing-rules - List all billing rules
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get('isActive');
    const ruleType = searchParams.get('ruleType');

    const where: any = { tenantId };
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    if (ruleType) {
      where.ruleType = ruleType;
    }

    const rules = await prisma.billingRule.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            executions: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return apiResponse({ rules });
  } catch (error: any) {
    console.error('Error fetching billing rules:', error);
    return apiError(error.message || 'Failed to fetch billing rules', 500);
  }
});

// POST /api/billing-rules - Create billing rule
export const POST = withTenant(async (req: NextRequest, { tenantId, userId }) => {
  try {
    const body = await req.json();
    const validated = BillingRuleSchema.parse(body);

    // Validate late fee settings if rule type is LATE_FEE
    if (validated.ruleType === 'LATE_FEE') {
      if (!validated.lateFeeType) {
        return apiError('Late fee type is required for LATE_FEE rules', 400);
      }
      if (validated.lateFeeType === 'FIXED' && !validated.lateFeeAmount) {
        return apiError('Late fee amount is required for FIXED late fee type', 400);
      }
      if (validated.lateFeeType === 'PERCENTAGE' && !validated.lateFeePercent) {
        return apiError('Late fee percentage is required for PERCENTAGE late fee type', 400);
      }
    }

    const rule = await prisma.billingRule.create({
      data: {
        ...validated,
        tenantId,
        createdById: userId,
      },
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
      message: 'Billing rule created successfully',
      rule,
    }, 201);
  } catch (error: any) {
    console.error('Error creating billing rule:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create billing rule', 500);
  }
});
