import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const OrderCreateSchema = z.object({
  customerId: z.string(),
  storeId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'CREDIT']).optional(),
  notes: z.string().optional(),
});

/**
 * GET /api/orders - List all orders
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { tenantId };

    if (customerId) {
      where.customerId = customerId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return apiResponse({
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return apiError(error.message || 'Failed to fetch orders', 500);
  }
});

/**
 * POST /api/orders - Create new order
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = OrderCreateSchema.parse(body);

    // Calculate totals
    let totalAmount = 0;

    for (const item of validated.items) {
      totalAmount += item.price * item.quantity;
    }

    const vatAmount = totalAmount * 0.05; // 5% VAT
    const grandTotal = totalAmount + vatAmount;

    // Generate order number
    const orderCount = await prisma.order.count({ where: { tenantId } });
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(6, '0')}`;

    // Get first store if storeId not provided
    let storeId = validated.storeId;
    if (!storeId) {
      const firstStore = await prisma.stores.findFirst({ where: { tenantId } });
      if (!firstStore) {
        return apiError('No store found. Please create a store first.', 400);
      }
      storeId = firstStore.id;
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: validated.customerId,
        storeId,
        totalAmount,
        vatAmount,
        grandTotal,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        notes: validated.notes,
        tenantId,
        createdById: user.id,
        items: {
          create: validated.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            discount: 0,
            total: item.price * item.quantity,
            tenantId,
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return apiResponse({ message: 'Order created successfully', order }, 201);
  } catch (error: any) {
    console.error('Error creating order:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create order', 500);
  }
});
