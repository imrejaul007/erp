import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ReturnCreateSchema = z.object({
  orderId: z.string().optional(),
  shipmentId: z.string().optional(),
  customerId: z.string().min(1, 'Customer ID is required'),
  returnType: z.enum(['REFUND', 'REPLACEMENT', 'EXCHANGE', 'STORE_CREDIT']),
  returnReason: z.enum(['DEFECTIVE', 'WRONG_ITEM', 'NOT_AS_DESCRIBED', 'QUALITY_ISSUE', 'CHANGED_MIND', 'SIZE_ISSUE', 'LATE_DELIVERY', 'OTHER']),
  reasonDetails: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    reason: z.string(),
    condition: z.string(),
  })),
  totalValue: z.number().positive(),
  customerNotes: z.string().optional(),
  photos: z.array(z.string().url()).optional(),
});

/**
 * GET /api/returns - List all return orders
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const returnType = searchParams.get('returnType');

    const where: any = { tenantId };

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (returnType) where.returnType = returnType;

    const returns = await prisma.return_orders.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(returns);
  } catch (error: any) {
    console.error('Error fetching return orders:', error);
    return apiError(error.message || 'Failed to fetch return orders', 500);
  }
});

/**
 * POST /api/returns - Create new return order
 */
export const POST = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = ReturnCreateSchema.parse(body);

    // Verify customer exists
    const customer = await prisma.customers.findFirst({
      where: { id: validated.customerId, tenantId },
    });

    if (!customer) {
      return apiError('Customer not found', 404);
    }

    // Verify order if provided
    if (validated.orderId) {
      const order = await prisma.order.findFirst({
        where: { id: validated.orderId, tenantId },
      });

      if (!order) {
        return apiError('Order not found', 404);
      }
    }

    // Generate RMA number
    const count = await prisma.return_orders.count({ where: { tenantId } });
    const rmaNumber = `RMA-${String(count + 1).padStart(6, '0')}`;

    const returnOrder = await prisma.return_orders.create({
      data: {
        rmaNumber,
        orderId: validated.orderId,
        shipmentId: validated.shipmentId,
        customerId: validated.customerId,
        returnType: validated.returnType,
        returnReason: validated.returnReason,
        reasonDetails: validated.reasonDetails,
        items: validated.items,
        totalValue: validated.totalValue,
        status: 'REQUESTED',
        customerNotes: validated.customerNotes,
        photos: validated.photos || [],
        tenantId,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Return order created successfully',
      returnOrder,
    }, 201);
  } catch (error: any) {
    console.error('Error creating return order:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create return order', 500);
  }
});
