import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const EventInventoryCreateSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  soldQuantity: z.number().min(0).optional().default(0),
});

const EventInventoryUpdateSchema = z.object({
  quantity: z.number().min(0).optional(),
  soldQuantity: z.number().min(0).optional(),
  returnedQuantity: z.number().min(0).optional(),
});

// GET - Get all inventory for an event
export const GET = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id: locationId } = context.params;

    // Verify event exists and belongs to tenant
    const event = await prisma.popupLocation.findFirst({
      where: { id: locationId, tenantId },
    });

    if (!event) {
      return apiError('Event not found', 404);
    }

    const inventory = await prisma.eventInventory.findMany({
      where: { locationId, tenantId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
            cost: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return apiResponse({ inventory });
  } catch (error: any) {
    console.error('Error fetching event inventory:', error);
    return apiError(error.message || 'Failed to fetch inventory', 500);
  }
});

// POST - Add inventory to event
export const POST = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const { id: locationId } = context.params;
    const body = await req.json();
    const validated = EventInventoryCreateSchema.parse(body);

    // Verify event exists and belongs to tenant
    const event = await prisma.popupLocation.findFirst({
      where: { id: locationId, tenantId },
    });

    if (!event) {
      return apiError('Event not found', 404);
    }

    // Check if product already in event inventory
    const existingInventory = await prisma.eventInventory.findFirst({
      where: {
        locationId,
        productId: validated.productId,
        tenantId,
      },
    });

    if (existingInventory) {
      return apiError('Product already in event inventory. Use PATCH to update quantity.', 400);
    }

    // Create inventory item
    const inventory = await prisma.eventInventory.create({
      data: {
        locationId,
        productId: validated.productId,
        quantity: validated.quantity,
        soldQuantity: validated.soldQuantity || 0,
        returnedQuantity: 0,
        tenantId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
            cost: true,
          },
        },
      },
    });

    return apiResponse({ inventory }, 201);
  } catch (error: any) {
    console.error('Error adding event inventory:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to add inventory', 500);
  }
});

// PATCH - Update event inventory
export const PATCH = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const url = new URL(req.url);
    const inventoryId = url.searchParams.get('inventoryId');

    if (!inventoryId) {
      return apiError('Inventory ID is required', 400);
    }

    const body = await req.json();
    const validated = EventInventoryUpdateSchema.parse(body);

    // Verify inventory exists and belongs to tenant
    const existingInventory = await prisma.eventInventory.findFirst({
      where: { id: inventoryId, tenantId },
    });

    if (!existingInventory) {
      return apiError('Inventory item not found', 404);
    }

    const inventory = await prisma.eventInventory.update({
      where: { id: inventoryId },
      data: validated,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
            cost: true,
          },
        },
      },
    });

    return apiResponse({ inventory });
  } catch (error: any) {
    console.error('Error updating event inventory:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update inventory', 500);
  }
});

// DELETE - Remove inventory from event
export const DELETE = withTenant(async (req, { tenantId }, context: { params: { id: string } }) => {
  try {
    const url = new URL(req.url);
    const inventoryId = url.searchParams.get('inventoryId');

    if (!inventoryId) {
      return apiError('Inventory ID is required', 400);
    }

    // Verify inventory exists and belongs to tenant
    const existingInventory = await prisma.eventInventory.findFirst({
      where: { id: inventoryId, tenantId },
    });

    if (!existingInventory) {
      return apiError('Inventory item not found', 404);
    }

    await prisma.eventInventory.delete({
      where: { id: inventoryId },
    });

    return apiResponse({ message: 'Inventory item removed from event successfully' });
  } catch (error: any) {
    console.error('Error removing event inventory:', error);
    return apiError(error.message || 'Failed to remove inventory', 500);
  }
});
