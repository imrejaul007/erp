import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const StockUpdateSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  zone: z.string().optional(),
  aisle: z.string().optional(),
  rack: z.string().optional(),
  bin: z.string().optional(),
  minLevel: z.number().int().optional(),
  maxLevel: z.number().int().optional(),
  reorderPoint: z.number().int().optional(),
});

/**
 * GET /api/warehouses/[id]/stock - Get all stock in warehouse
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id: warehouseId } = params;

    // Verify warehouse exists
    const warehouse = await prisma.warehouse.findFirst({
      where: { id: warehouseId, tenantId },
    });

    if (!warehouse) {
      return apiError('Warehouse not found', 404);
    }

    const stock = await prisma.warehouseStock.findMany({
      where: {
        warehouseId,
        tenantId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unit: true,
            unitPrice: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(stock);
  } catch (error: any) {
    console.error('Error fetching warehouse stock:', error);
    return apiError(error.message || 'Failed to fetch warehouse stock', 500);
  }
});

/**
 * POST /api/warehouses/[id]/stock - Add/update stock in warehouse
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id: warehouseId } = params;
    const body = await req.json();
    const validated = StockUpdateSchema.parse(body);

    // Verify warehouse exists
    const warehouse = await prisma.warehouse.findFirst({
      where: { id: warehouseId, tenantId },
    });

    if (!warehouse) {
      return apiError('Warehouse not found', 404);
    }

    // Verify product exists
    const product = await prisma.products.findFirst({
      where: { id: validated.productId, tenantId },
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    // Check if stock already exists
    const existingStock = await prisma.warehouseStock.findFirst({
      where: {
        warehouseId,
        productId: validated.productId,
        tenantId,
      },
    });

    let stock;

    if (existingStock) {
      // Update existing stock
      stock = await prisma.warehouseStock.update({
        where: { id: existingStock.id },
        data: {
          quantity: validated.quantity,
          availableQuantity: validated.quantity - existingStock.reservedQuantity,
          zone: validated.zone,
          aisle: validated.aisle,
          rack: validated.rack,
          bin: validated.bin,
          minLevel: validated.minLevel,
          maxLevel: validated.maxLevel,
          reorderPoint: validated.reorderPoint,
          lastCountDate: new Date(),
          lastCountBy: user?.id,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
      });
    } else {
      // Create new stock entry
      stock = await prisma.warehouseStock.create({
        data: {
          warehouseId,
          productId: validated.productId,
          quantity: validated.quantity,
          reservedQuantity: 0,
          availableQuantity: validated.quantity,
          zone: validated.zone,
          aisle: validated.aisle,
          rack: validated.rack,
          bin: validated.bin,
          minLevel: validated.minLevel,
          maxLevel: validated.maxLevel,
          reorderPoint: validated.reorderPoint,
          lastCountDate: new Date(),
          lastCountBy: user?.id,
          tenantId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
      });
    }

    return apiResponse({
      message: existingStock ? 'Stock updated successfully' : 'Stock added successfully',
      stock,
    }, existingStock ? 200 : 201);
  } catch (error: any) {
    console.error('Error updating warehouse stock:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update warehouse stock', 500);
  }
});
