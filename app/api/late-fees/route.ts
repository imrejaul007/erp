import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const LateFeeSchema = z.object({
  invoiceId: z.string().min(1),
  feeAmount: z.number().positive(),
  feeType: z.enum(['FIXED', 'PERCENTAGE']),
  calculationBase: z.number().nonnegative().optional().nullable(),
  daysOverdue: z.number().int().nonnegative(),
  ruleId: z.string().optional().nullable(),
});

// GET /api/late-fees - List all late fees
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const invoiceId = searchParams.get('invoiceId');

    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }
    if (invoiceId) {
      where.invoiceId = invoiceId;
    }

    const lateFees = await prisma.lateFeeCharge.findMany({
      where,
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            customerId: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            totalAmount: true,
            balanceDue: true,
            dueDate: true,
            status: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    // Calculate total fees
    const totalFees = lateFees.reduce(
      (sum, fee) => sum + Number(fee.feeAmount),
      0
    );

    const appliedFees = lateFees.filter(f => f.status === 'APPLIED');
    const totalApplied = appliedFees.reduce(
      (sum, fee) => sum + Number(fee.feeAmount),
      0
    );

    return apiResponse({
      lateFees,
      summary: {
        total: lateFees.length,
        totalFees,
        appliedCount: appliedFees.length,
        totalApplied,
      },
    });
  } catch (error: any) {
    console.error('Error fetching late fees:', error);
    return apiError(error.message || 'Failed to fetch late fees', 500);
  }
});

// POST /api/late-fees - Create/apply late fee
export const POST = withTenant(async (req: NextRequest, { tenantId, userId }) => {
  try {
    const body = await req.json();
    const validated = LateFeeSchema.parse(body);

    // Get invoice
    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id: validated.invoiceId,
        tenantId,
      },
    });

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
      return apiError('Cannot apply late fee to paid or cancelled invoice', 400);
    }

    // Check if invoice is actually overdue
    const now = new Date();
    if (invoice.dueDate >= now) {
      return apiError('Invoice is not overdue', 400);
    }

    // Create late fee charge
    const lateFee = await prisma.lateFeeCharge.create({
      data: {
        ...validated,
        status: 'APPLIED',
        tenantId,
        createdById: userId,
      },
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            customer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Update invoice balance
    await prisma.customerInvoice.update({
      where: { id: invoice.id },
      data: {
        balanceDue: Number(invoice.balanceDue) + validated.feeAmount,
        totalAmount: Number(invoice.totalAmount) + validated.feeAmount,
        status: 'OVERDUE',
      },
    });

    return apiResponse({
      message: 'Late fee applied successfully',
      lateFee,
    }, 201);
  } catch (error: any) {
    console.error('Error applying late fee:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to apply late fee', 500);
  }
});
