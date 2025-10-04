import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const WaiveFeeSchema = z.object({
  reason: z.string().min(1),
});

// GET /api/late-fees/[id] - Get single late fee
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const lateFee = await prisma.lateFeeCharge.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        invoice: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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
    });

    if (!lateFee) {
      return apiError('Late fee not found', 404);
    }

    return apiResponse({ lateFee });
  } catch (error: any) {
    console.error('Error fetching late fee:', error);
    return apiError(error.message || 'Failed to fetch late fee', 500);
  }
});

// PATCH /api/late-fees/[id] - Waive late fee
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId, userId }: { params: { id: string }; tenantId: string; userId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const { reason } = WaiveFeeSchema.parse(body);

    const lateFee = await prisma.lateFeeCharge.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        invoice: true,
      },
    });

    if (!lateFee) {
      return apiError('Late fee not found', 404);
    }

    if (lateFee.status === 'WAIVED') {
      return apiError('Late fee is already waived', 400);
    }

    // Update late fee
    const updatedFee = await prisma.lateFeeCharge.update({
      where: { id },
      data: {
        status: 'WAIVED',
        waivedAt: new Date(),
        waivedBy: userId,
        waivedReason: reason,
      },
    });

    // Reverse the fee from invoice if it was applied
    if (lateFee.status === 'APPLIED') {
      await prisma.customerInvoice.update({
        where: { id: lateFee.invoiceId },
        data: {
          balanceDue: Number(lateFee.invoice.balanceDue) - Number(lateFee.feeAmount),
          totalAmount: Number(lateFee.invoice.totalAmount) - Number(lateFee.feeAmount),
        },
      });
    }

    return apiResponse({
      message: 'Late fee waived successfully',
      lateFee: updatedFee,
    });
  } catch (error: any) {
    console.error('Error waiving late fee:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to waive late fee', 500);
  }
});

// DELETE /api/late-fees/[id] - Delete late fee
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const lateFee = await prisma.lateFeeCharge.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        invoice: true,
      },
    });

    if (!lateFee) {
      return apiError('Late fee not found', 404);
    }

    // Reverse the fee from invoice if it was applied
    if (lateFee.status === 'APPLIED') {
      await prisma.customerInvoice.update({
        where: { id: lateFee.invoiceId },
        data: {
          balanceDue: Number(lateFee.invoice.balanceDue) - Number(lateFee.feeAmount),
          totalAmount: Number(lateFee.invoice.totalAmount) - Number(lateFee.feeAmount),
        },
      });
    }

    await prisma.lateFeeCharge.delete({
      where: { id },
    });

    return apiResponse({
      message: 'Late fee deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting late fee:', error);
    return apiError(error.message || 'Failed to delete late fee', 500);
  }
});
