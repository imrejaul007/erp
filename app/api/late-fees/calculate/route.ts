import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const CalculateLateFeeSchema = z.object({
  invoiceId: z.string().min(1),
  ruleId: z.string().optional().nullable(),
});

/**
 * Calculate late fee for an invoice without applying it
 * This helps preview the late fee amount before actually applying it
 */

// POST /api/late-fees/calculate - Calculate late fee
export const POST = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const body = await req.json();
    const { invoiceId, ruleId } = CalculateLateFeeSchema.parse(body);

    // Get invoice
    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    // Calculate days overdue
    const now = new Date();
    const daysOverdue = Math.floor(
      (now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysOverdue <= 0) {
      return apiResponse({
        message: 'Invoice is not overdue',
        invoiceId,
        daysOverdue,
        lateFee: 0,
        canApply: false,
      });
    }

    // Get billing rule if specified, otherwise find applicable rule
    let rule;
    if (ruleId) {
      rule = await prisma.billingRule.findFirst({
        where: {
          id: ruleId,
          tenantId,
          ruleType: 'LATE_FEE',
          isActive: true,
        },
      });
    } else {
      // Find the first applicable late fee rule
      const rules = await prisma.billingRule.findMany({
        where: {
          tenantId,
          ruleType: 'LATE_FEE',
          isActive: true,
        },
        orderBy: { priority: 'desc' },
      });

      // Find rule with matching conditions
      for (const r of rules) {
        const conditions = r.triggerConditions as any;
        const daysOverdueThreshold = conditions.daysOverdue || 0;

        if (daysOverdue >= daysOverdueThreshold) {
          rule = r;
          break;
        }
      }
    }

    if (!rule) {
      return apiResponse({
        message: 'No applicable late fee rule found',
        invoiceId,
        daysOverdue,
        lateFee: 0,
        canApply: false,
      });
    }

    // Calculate late fee
    let feeAmount = 0;
    const balanceDue = Number(invoice.balanceDue);

    if (rule.lateFeeType === 'FIXED') {
      feeAmount = Number(rule.lateFeeAmount || 0);
    } else if (rule.lateFeeType === 'PERCENTAGE') {
      feeAmount = balanceDue * (Number(rule.lateFeePercent || 0) / 100);
      if (rule.lateFeeMax) {
        feeAmount = Math.min(feeAmount, Number(rule.lateFeeMax));
      }
    }

    // Check if late fee already exists
    const existingFee = await prisma.lateFeeCharge.findFirst({
      where: {
        invoiceId,
        status: {
          in: ['PENDING', 'APPLIED'],
        },
      },
    });

    return apiResponse({
      message: 'Late fee calculated successfully',
      calculation: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customer.name,
        balanceDue,
        dueDate: invoice.dueDate,
        daysOverdue,
        lateFeeType: rule.lateFeeType,
        lateFeeAmount: rule.lateFeeType === 'FIXED' ? Number(rule.lateFeeAmount) : null,
        lateFeePercent: rule.lateFeeType === 'PERCENTAGE' ? Number(rule.lateFeePercent) : null,
        lateFeeMax: rule.lateFeeMax ? Number(rule.lateFeeMax) : null,
        calculatedFee: feeAmount,
        newTotalAmount: Number(invoice.totalAmount) + feeAmount,
        newBalanceDue: balanceDue + feeAmount,
        ruleId: rule.id,
        ruleName: rule.name,
        alreadyApplied: !!existingFee,
        canApply: !existingFee && invoice.status !== 'PAID' && invoice.status !== 'CANCELLED',
      },
    });
  } catch (error: any) {
    console.error('Error calculating late fee:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to calculate late fee', 500);
  }
});
