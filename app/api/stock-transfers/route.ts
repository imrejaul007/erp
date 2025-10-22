import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const TransferCreateSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  fromLocation: z.string().min(1, 'From location is required'),
  toLocation: z.string().min(1, 'To location is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  notes: z.string().optional(),
  shippingReference: z.string().optional(),
});

/**
 * GET /api/stock-transfers - List all stock transfers
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status');
    const fromLocation = searchParams.get('fromLocation');
    const toLocation = searchParams.get('toLocation');

    const where: any = { tenantId };

    if (productId) where.productId = productId;
    if (status) where.status = status;
    if (fromLocation) where.fromLocation = fromLocation;
    if (toLocation) where.toLocation = toLocation;

    const transfers = await prisma.stockTransfer.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unit: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(transfers);
  } catch (error: any) {
    console.error('Error fetching stock transfers:', error);
    return apiError(error.message || 'Failed to fetch stock transfers', 500);
  }
});

/**
 * POST /api/stock-transfers - Create stock transfer
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = TransferCreateSchema.parse(body);

    // Validate locations are different
    if (validated.fromLocation === validated.toLocation) {
      return apiError('From and to locations must be different', 400);
    }

    // Verify product exists
    const product = await prisma.products.findFirst({
      where: {
        id: validated.productId,
        tenantId,
      },
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    // Generate transfer number
    const count = await prisma.stockTransfer.count({ where: { tenantId } });
    const transferNumber = `TRF-${String(count + 1).padStart(6, '0')}`;

    const transfer = await prisma.stockTransfer.create({
      data: {
        transferNumber,
        productId: validated.productId,
        fromLocation: validated.fromLocation,
        toLocation: validated.toLocation,
        quantity: validated.quantity,
        status: 'PENDING',
        notes: validated.notes,
        shippingReference: validated.shippingReference,
        tenantId,
        createdById: user?.id || 'system',
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
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

    return apiResponse({
      message: 'Stock transfer created successfully',
      transfer,
    }, 201);
  } catch (error: any) {
    console.error('Error creating stock transfer:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create stock transfer', 500);
  }
});
