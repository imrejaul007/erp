import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const UpdatePlanSchema = z.object({
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'DEFAULTED']).optional(),
  isActive: z.boolean().optional(),
  autoPayEnabled: z.boolean().optional(),
  paymentMethod: z.string().optional().nullable(),
});

/**
 * GET /api/installment-plans/[id]
 * Get a specific installment plan with all details
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: planId } = params;

    const plan = await prisma.installmentPlan.findFirst({
      where: {
        id: planId,
        tenantId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            balanceDue: true,
            currency: true,
            status: true,
            issueDate: true,
            dueDate: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        installments: {
          orderBy: {
            installmentNumber: 'asc',
          },
        },
      },
    });

    if (!plan) {
      return apiError('Installment plan not found', 404);
    }

    return apiResponse({ plan });
  } catch (error: any) {
    console.error('Error fetching installment plan:', error);
    return apiError(error.message || 'Failed to fetch installment plan', 500);
  }
});

/**
 * PATCH /api/installment-plans/[id]
 * Update installment plan status or settings
 */
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: planId } = params;
    const body = await req.json();
    const validated = UpdatePlanSchema.parse(body);

    // Verify plan exists
    const existingPlan = await prisma.installmentPlan.findFirst({
      where: {
        id: planId,
        tenantId,
      },
      include: {
        invoice: true,
        installments: true,
      },
    });

    if (!existingPlan) {
      return apiError('Installment plan not found', 404);
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (validated.status !== undefined) {
      updateData.status = validated.status;

      // Update invoice status based on plan status
      if (validated.status === 'CANCELLED') {
        await prisma.customerInvoice.update({
          where: { id: existingPlan.invoiceId },
          data: {
            status: 'SENT', // Revert to SENT status
            updatedAt: new Date(),
          },
        });
      } else if (validated.status === 'COMPLETED') {
        await prisma.customerInvoice.update({
          where: { id: existingPlan.invoiceId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }

    if (validated.isActive !== undefined) {
      updateData.isActive = validated.isActive;
    }

    if (validated.autoPayEnabled !== undefined) {
      updateData.autoPayEnabled = validated.autoPayEnabled;
    }

    if (validated.paymentMethod !== undefined) {
      updateData.paymentMethod = validated.paymentMethod;
    }

    const plan = await prisma.installmentPlan.update({
      where: { id: planId },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            currency: true,
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
        installments: {
          orderBy: {
            installmentNumber: 'asc',
          },
        },
      },
    });

    return apiResponse({
      message: 'Installment plan updated successfully',
      plan,
    });
  } catch (error: any) {
    console.error('Error updating installment plan:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update installment plan', 500);
  }
});

/**
 * DELETE /api/installment-plans/[id]
 * Cancel/delete an installment plan
 */
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: planId } = params;

    // Verify plan exists
    const plan = await prisma.installmentPlan.findFirst({
      where: {
        id: planId,
        tenantId,
      },
      include: {
        installments: true,
        invoice: true,
      },
    });

    if (!plan) {
      return apiError('Installment plan not found', 404);
    }

    // Check if any installments have been paid
    const paidInstallments = plan.installments.filter(
      (inst) => inst.status === 'PAID'
    );

    if (paidInstallments.length > 0) {
      return apiError(
        `Cannot delete installment plan with ${paidInstallments.length} paid installment(s). Cancel the plan instead.`,
        400
      );
    }

    // Delete all pending installments
    await prisma.installment.deleteMany({
      where: {
        planId: plan.id,
      },
    });

    // Delete the plan
    await prisma.installmentPlan.delete({
      where: { id: plan.id },
    });

    // Update invoice status back to original
    await prisma.customerInvoice.update({
      where: { id: plan.invoiceId },
      data: {
        status: 'SENT',
        updatedAt: new Date(),
      },
    });

    return apiResponse({
      message: 'Installment plan deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting installment plan:', error);
    return apiError(error.message || 'Failed to delete installment plan', 500);
  }
});
