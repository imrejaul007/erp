import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

/**
 * Execute a billing rule manually
 * This endpoint allows manual triggering of billing rules for testing or one-time execution
 */

// POST /api/billing-rules/[id]/execute - Execute billing rule
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, userId }: { params: { id: string }; tenantId: string; userId: string }
) => {
  try {
    const { id: ruleId } = params;
    const body = await req.json();
    const { triggerData = {} } = body;

    // Get the rule
    const rule = await prisma.billingRule.findFirst({
      where: {
        id: ruleId,
        tenantId,
      },
    });

    if (!rule) {
      return apiError('Billing rule not found', 404);
    }

    if (!rule.isActive) {
      return apiError('Billing rule is not active', 400);
    }

    // Check max executions
    if (rule.maxExecutions && rule.executionCount >= rule.maxExecutions) {
      return apiError('Billing rule has reached maximum executions', 400);
    }

    // Execute the rule based on type
    let result: any = {};
    let status = 'SUCCESS';
    let errorMessage: string | null = null;

    try {
      switch (rule.ruleType) {
        case 'LATE_FEE':
          result = await executeLateFeRule(rule, triggerData, tenantId, userId);
          break;

        case 'PAYMENT_REMINDER':
          result = await executePaymentReminderRule(rule, triggerData, tenantId);
          break;

        case 'AUTO_INVOICE':
          result = await executeAutoInvoiceRule(rule, triggerData, tenantId, userId);
          break;

        case 'DUNNING':
          result = await executeDunningRule(rule, triggerData, tenantId);
          break;

        default:
          result = { message: 'Rule type not implemented yet' };
          status = 'SKIPPED';
      }
    } catch (error: any) {
      status = 'FAILED';
      errorMessage = error.message;
      result = { error: error.message };
    }

    // Log execution
    const execution = await prisma.billingRuleExecution.create({
      data: {
        ruleId: rule.id,
        status,
        triggerData,
        resultData: result,
        errorMessage,
        invoiceId: result.invoiceId || null,
        customerId: triggerData.customerId || null,
        orderId: triggerData.orderId || null,
        tenantId,
      },
    });

    // Update rule execution count and timestamp
    await prisma.billingRule.update({
      where: { id: rule.id },
      data: {
        executionCount: rule.executionCount + 1,
        lastExecutedAt: new Date(),
      },
    });

    return apiResponse({
      message: 'Billing rule executed successfully',
      execution,
      result,
    });
  } catch (error: any) {
    console.error('Error executing billing rule:', error);
    return apiError(error.message || 'Failed to execute billing rule', 500);
  }
});

// Helper function to execute late fee rule
async function executeLateFeRule(
  rule: any,
  triggerData: any,
  tenantId: string,
  userId: string
): Promise<any> {
  const { invoiceId } = triggerData;

  if (!invoiceId) {
    throw new Error('Invoice ID is required for late fee rule');
  }

  // Get invoice
  const invoice = await prisma.customerInvoice.findFirst({
    where: {
      id: invoiceId,
      tenantId,
    },
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
    return { message: 'Invoice is already paid or cancelled', invoiceId };
  }

  // Calculate days overdue
  const now = new Date();
  const daysOverdue = Math.floor((now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysOverdue <= 0) {
    return { message: 'Invoice is not overdue', invoiceId, daysOverdue };
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

  // Create late fee charge
  const lateFee = await prisma.lateFeeCharge.create({
    data: {
      invoiceId: invoice.id,
      feeAmount,
      feeType: rule.lateFeeType || 'FIXED',
      calculationBase: rule.lateFeeType === 'PERCENTAGE' ? balanceDue : null,
      daysOverdue,
      ruleId: rule.id,
      status: 'APPLIED',
      tenantId,
      createdById: userId,
    },
  });

  // Update invoice balance
  await prisma.customerInvoice.update({
    where: { id: invoice.id },
    data: {
      balanceDue: Number(invoice.balanceDue) + feeAmount,
      totalAmount: Number(invoice.totalAmount) + feeAmount,
      status: 'OVERDUE',
    },
  });

  return {
    message: 'Late fee applied successfully',
    invoiceId: invoice.id,
    lateFeeId: lateFee.id,
    feeAmount,
    daysOverdue,
  };
}

// Helper function to execute payment reminder rule
async function executePaymentReminderRule(
  rule: any,
  triggerData: any,
  tenantId: string
): Promise<any> {
  const { invoiceId } = triggerData;

  if (!invoiceId) {
    throw new Error('Invoice ID is required for payment reminder');
  }

  const invoice = await prisma.customerInvoice.findFirst({
    where: {
      id: invoiceId,
      tenantId,
    },
    include: {
      customer: true,
    },
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
    return { message: 'Invoice is already paid or cancelled', invoiceId };
  }

  // Update reminder count
  await prisma.customerInvoice.update({
    where: { id: invoice.id },
    data: {
      lastReminder: new Date(),
      reminderCount: invoice.reminderCount + 1,
    },
  });

  // In production, this would send an actual email
  return {
    message: 'Payment reminder sent',
    invoiceId: invoice.id,
    customerEmail: invoice.customer.email,
    reminderCount: invoice.reminderCount + 1,
    note: 'Email sending not implemented - this is a placeholder',
  };
}

// Helper function to execute auto-invoice rule
async function executeAutoInvoiceRule(
  rule: any,
  triggerData: any,
  tenantId: string,
  userId: string
): Promise<any> {
  // This would create an invoice based on the trigger data
  // For now, just return a placeholder
  return {
    message: 'Auto-invoice creation not fully implemented',
    triggerData,
    note: 'This would create an invoice based on order completion or other triggers',
  };
}

// Helper function to execute dunning rule
async function executeDunningRule(
  rule: any,
  triggerData: any,
  tenantId: string
): Promise<any> {
  // Dunning is a progressive collection process
  return {
    message: 'Dunning process not fully implemented',
    triggerData,
    note: 'This would execute escalating collection actions',
  };
}
