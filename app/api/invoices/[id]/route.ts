import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

// GET /api/invoices/[id] - Get single invoice details
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const invoice = await prisma.customerInvoice.findFirst({
      where: {
        id,
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
        order: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    // Calculate aging (days since issue date)
    const daysOld = Math.floor(
      (new Date().getTime() - new Date(invoice.issueDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate days until due
    const daysUntilDue = Math.floor(
      (new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return apiResponse({
      ...invoice,
      daysOld,
      daysUntilDue,
      isOverdue: daysUntilDue < 0 && invoice.status !== 'PAID',
    });
  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    return apiError(error.message || 'Failed to fetch invoice', 500);
  }
});
