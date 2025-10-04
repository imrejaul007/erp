import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Cron endpoint for automated billing tasks
 * This should be called periodically (e.g., daily) by a cron job service
 *
 * Tasks performed:
 * 1. Generate recurring invoices that are due
 * 2. Apply late fees to overdue invoices
 * 3. Send payment reminders
 * 4. Update invoice statuses
 *
 * Security: In production, protect this endpoint with a secret token
 * Example: Vercel Cron, GitHub Actions, or any cron service
 */

export async function POST(req: NextRequest) {
  try {
    // Verify authorization (check for cron secret)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const results = {
      recurringInvoicesGenerated: 0,
      lateFeesApplied: 0,
      remindersSent: 0,
      statusesUpdated: 0,
      errors: [] as string[],
    };

    // Task 1: Generate recurring invoices
    try {
      const recurringResult = await generateRecurringInvoices();
      results.recurringInvoicesGenerated = recurringResult.count;
    } catch (error: any) {
      results.errors.push(`Recurring invoices: ${error.message}`);
    }

    // Task 2: Apply late fees based on active billing rules
    try {
      const lateFeeResult = await applyAutomaticLateFees();
      results.lateFeesApplied = lateFeeResult.count;
    } catch (error: any) {
      results.errors.push(`Late fees: ${error.message}`);
    }

    // Task 3: Send payment reminders
    try {
      const reminderResult = await sendPaymentReminders();
      results.remindersSent = reminderResult.count;
    } catch (error: any) {
      results.errors.push(`Reminders: ${error.message}`);
    }

    // Task 4: Update invoice statuses
    try {
      const statusResult = await updateInvoiceStatuses();
      results.statusesUpdated = statusResult.count;
    } catch (error: any) {
      results.errors.push(`Status updates: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Billing automation tasks completed',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in billing automation cron:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Billing automation failed',
      },
      { status: 500 }
    );
  }
}

// Generate recurring invoices that are due
async function generateRecurringInvoices(): Promise<{ count: number }> {
  const now = new Date();
  let count = 0;

  // Get all active recurring invoice templates that are due
  const dueTemplates = await prisma.recurringInvoice.findMany({
    where: {
      isActive: true,
      nextInvoiceDate: {
        lte: now,
      },
      OR: [
        { endDate: null },
        { endDate: { gte: now } },
      ],
    },
    include: {
      customer: true,
      tenant: true,
    },
  });

  for (const template of dueTemplates) {
    try {
      // Generate invoice number
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const lastInvoice = await prisma.customerInvoice.findFirst({
        where: { tenantId: template.tenantId },
        orderBy: { createdAt: 'desc' },
      });
      const sequence = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split('-').pop() || '0') + 1 : 1;
      const invoiceNumber = `INV-${year}-${month}-${String(sequence).padStart(5, '0')}`;

      const issueDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + template.daysDue);

      // Create invoice
      await prisma.customerInvoice.create({
        data: {
          invoiceNumber,
          customerId: template.customerId,
          invoiceType: 'RECURRING',
          recurringInvoiceId: template.id,
          subtotal: template.subtotal,
          taxAmount: template.taxAmount,
          discount: template.discount,
          totalAmount: template.totalAmount,
          balanceDue: template.totalAmount,
          status: template.autoSend ? 'SENT' : 'DRAFT',
          issueDate,
          dueDate,
          sentAt: template.autoSend ? new Date() : null,
          paymentTerms: template.paymentTerms,
          notes: template.notes || undefined,
          terms: template.terms || undefined,
          lineItems: template.lineItems,
          currency: template.currency,
          tenantId: template.tenantId,
          createdById: template.createdById,
        },
      });

      // Calculate next invoice date
      const nextDate = new Date(template.nextInvoiceDate);
      switch (template.frequency) {
        case 'DAILY':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'WEEKLY':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'BIWEEKLY':
          nextDate.setDate(nextDate.getDate() + 14);
          break;
        case 'MONTHLY':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'QUARTERLY':
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case 'SEMI_ANNUAL':
          nextDate.setMonth(nextDate.getMonth() + 6);
          break;
        case 'ANNUAL':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }

      // Update template
      await prisma.recurringInvoice.update({
        where: { id: template.id },
        data: {
          lastGeneratedAt: now,
          generatedCount: template.generatedCount + 1,
          nextInvoiceDate: nextDate,
        },
      });

      count++;
    } catch (error) {
      console.error(`Error generating invoice for template ${template.id}:`, error);
    }
  }

  return { count };
}

// Apply late fees based on billing rules
async function applyAutomaticLateFees(): Promise<{ count: number }> {
  let count = 0;

  // Get all active late fee rules
  const lateFeeRules = await prisma.billingRule.findMany({
    where: {
      isActive: true,
      ruleType: 'LATE_FEE',
    },
  });

  for (const rule of lateFeeRules) {
    try {
      // Get trigger conditions
      const conditions = rule.triggerConditions as any;
      const daysOverdueThreshold = conditions.daysOverdue || 30;

      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - daysOverdueThreshold);

      // Find overdue invoices that match conditions
      const overdueInvoices = await prisma.customerInvoice.findMany({
        where: {
          tenantId: rule.tenantId,
          status: {
            in: ['SENT', 'VIEWED', 'PARTIALLY_PAID', 'OVERDUE'],
          },
          dueDate: {
            lte: thresholdDate,
          },
          balanceDue: {
            gt: 0,
          },
        },
      });

      for (const invoice of overdueInvoices) {
        // Check if late fee already applied
        const existingFee = await prisma.lateFeeCharge.findFirst({
          where: {
            invoiceId: invoice.id,
            status: {
              in: ['PENDING', 'APPLIED'],
            },
          },
        });

        if (existingFee) continue;

        // Calculate days overdue
        const now = new Date();
        const daysOverdue = Math.floor(
          (now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );

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
        await prisma.lateFeeCharge.create({
          data: {
            invoiceId: invoice.id,
            feeAmount,
            feeType: rule.lateFeeType || 'FIXED',
            calculationBase: rule.lateFeeType === 'PERCENTAGE' ? balanceDue : null,
            daysOverdue,
            ruleId: rule.id,
            status: 'APPLIED',
            tenantId: rule.tenantId,
            createdById: rule.createdById,
          },
        });

        // Update invoice
        await prisma.customerInvoice.update({
          where: { id: invoice.id },
          data: {
            balanceDue: Number(invoice.balanceDue) + feeAmount,
            totalAmount: Number(invoice.totalAmount) + feeAmount,
            status: 'OVERDUE',
          },
        });

        // Log execution
        await prisma.billingRuleExecution.create({
          data: {
            ruleId: rule.id,
            status: 'SUCCESS',
            triggerData: { invoiceId: invoice.id, daysOverdue },
            resultData: { feeAmount, daysOverdue },
            invoiceId: invoice.id,
            customerId: invoice.customerId,
            tenantId: rule.tenantId,
          },
        });

        // Update rule
        await prisma.billingRule.update({
          where: { id: rule.id },
          data: {
            executionCount: rule.executionCount + 1,
            lastExecutedAt: new Date(),
          },
        });

        count++;
      }
    } catch (error) {
      console.error(`Error applying late fees for rule ${rule.id}:`, error);
    }
  }

  return { count };
}

// Send payment reminders
async function sendPaymentReminders(): Promise<{ count: number }> {
  let count = 0;

  // Get active payment reminder rules
  const reminderRules = await prisma.billingRule.findMany({
    where: {
      isActive: true,
      ruleType: 'PAYMENT_REMINDER',
    },
  });

  for (const rule of reminderRules) {
    try {
      const conditions = rule.triggerConditions as any;
      const daysBefore = conditions.daysBefore || 7;

      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + daysBefore);

      // Find invoices due soon
      const upcomingInvoices = await prisma.customerInvoice.findMany({
        where: {
          tenantId: rule.tenantId,
          status: {
            in: ['SENT', 'VIEWED'],
          },
          dueDate: {
            lte: reminderDate,
            gte: new Date(),
          },
          balanceDue: {
            gt: 0,
          },
        },
      });

      for (const invoice of upcomingInvoices) {
        // Update reminder count
        await prisma.customerInvoice.update({
          where: { id: invoice.id },
          data: {
            lastReminder: new Date(),
            reminderCount: invoice.reminderCount + 1,
          },
        });

        // In production, send actual email here

        count++;
      }
    } catch (error) {
      console.error(`Error sending reminders for rule ${rule.id}:`, error);
    }
  }

  return { count };
}

// Update invoice statuses
async function updateInvoiceStatuses(): Promise<{ count: number }> {
  let count = 0;

  // Mark sent invoices as overdue if past due date
  const overdueResult = await prisma.customerInvoice.updateMany({
    where: {
      status: {
        in: ['SENT', 'VIEWED', 'PARTIALLY_PAID'],
      },
      dueDate: {
        lt: new Date(),
      },
      balanceDue: {
        gt: 0,
      },
    },
    data: {
      status: 'OVERDUE',
    },
  });

  count += overdueResult.count;

  return { count };
}
