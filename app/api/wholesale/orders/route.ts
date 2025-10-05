import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = { tenantId };
    if (status) where.status = status;

    const orders = await prisma.wholesaleOrder.findMany({
      where,
      include: {
        wholesaleCustomer: {
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
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ orders });
  } catch (error) {
    console.error('Wholesale Orders Error:', error);
    return apiError('Failed to fetch wholesale orders', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const body = await request.json();
    const {
      wholesaleCustomerId,
      items = [],
      discountAmount = 0,
      taxAmount = 0,
      notes,
    } = body;

    if (!wholesaleCustomerId || items.length === 0) {
      return apiError('Missing required fields', 400);
    }

    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity * (1 - item.discount / 100)), 0);
    const grandTotal = totalAmount - discountAmount + taxAmount;

    const orderNumber = `WO-${Date.now()}`;

    const order = await prisma.wholesaleOrder.create({
      data: {
        orderNumber,
        wholesaleCustomerId,
        totalAmount,
        discountAmount,
        taxAmount,
        grandTotal,
        notes,
        tenantId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            total: item.unitPrice * item.quantity * (1 - (item.discount || 0) / 100),
          })),
        },
      },
      include: {
        wholesaleCustomer: {
          include: {
            customer: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return apiResponse(order, 201);
  } catch (error) {
    console.error('Wholesale Order Creation Error:', error);
    return apiError('Failed to create wholesale order', 500);
  }
});
