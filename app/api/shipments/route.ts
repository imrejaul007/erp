import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ShipmentCreateSchema = z.object({
  shipmentType: z.enum(['OUTBOUND', 'INBOUND', 'TRANSFER', 'RETURN']),
  orderId: z.string().optional(),
  purchaseOrderId: z.string().optional(),
  fromWarehouseId: z.string().optional(),
  toWarehouseId: z.string().optional(),
  customerId: z.string().optional(),
  supplierId: z.string().optional(),
  carrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  shippingMethod: z.string().optional(),
  fromAddress: z.object({
    street: z.string(),
    city: z.string(),
    country: z.string(),
    zip: z.string().optional(),
  }),
  toAddress: z.object({
    street: z.string(),
    city: z.string(),
    country: z.string(),
    zip: z.string().optional(),
  }),
  packages: z.array(z.object({
    weight: z.number().positive(),
    dimensions: z.object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    }),
    contents: z.string(),
  })),
  totalWeight: z.number().positive().optional(),
  weightUnit: z.string().default('kg'),
  shippingCost: z.number().min(0).default(0),
  insuranceCost: z.number().min(0).default(0),
  customsDuty: z.number().min(0).default(0),
  pickupDate: z.string().datetime().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  notes: z.string().optional(),
  specialInstructions: z.string().optional(),
});

/**
 * GET /api/shipments - List all shipments
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const shipmentType = searchParams.get('shipmentType');
    const trackingNumber = searchParams.get('trackingNumber');

    const where: any = { tenantId };

    if (status) where.status = status;
    if (shipmentType) where.shipmentType = shipmentType;
    if (trackingNumber) where.trackingNumber = { contains: trackingNumber, mode: 'insensitive' };

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        fromWarehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        toWarehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
        purchaseOrder: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(shipments);
  } catch (error: any) {
    console.error('Error fetching shipments:', error);
    return apiError(error.message || 'Failed to fetch shipments', 500);
  }
});

/**
 * POST /api/shipments - Create new shipment
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = ShipmentCreateSchema.parse(body);

    // Calculate total cost
    const totalCost = validated.shippingCost + validated.insuranceCost + validated.customsDuty;

    // Calculate total weight if not provided
    const totalWeight = validated.totalWeight ||
      validated.packages.reduce((sum, pkg) => sum + pkg.weight, 0);

    // Generate shipment number
    const count = await prisma.shipment.count({ where: { tenantId } });
    const shipmentNumber = `SHIP-${String(count + 1).padStart(6, '0')}`;

    const shipment = await prisma.shipment.create({
      data: {
        shipmentNumber,
        shipmentType: validated.shipmentType,
        orderId: validated.orderId,
        purchaseOrderId: validated.purchaseOrderId,
        fromWarehouseId: validated.fromWarehouseId,
        toWarehouseId: validated.toWarehouseId,
        customerId: validated.customerId,
        supplierId: validated.supplierId,
        carrier: validated.carrier,
        trackingNumber: validated.trackingNumber,
        shippingMethod: validated.shippingMethod,
        fromAddress: validated.fromAddress,
        toAddress: validated.toAddress,
        packages: validated.packages,
        totalWeight,
        weightUnit: validated.weightUnit,
        shippingCost: validated.shippingCost,
        insuranceCost: validated.insuranceCost,
        customsDuty: validated.customsDuty,
        totalCost,
        status: 'PENDING',
        pickupDate: validated.pickupDate ? new Date(validated.pickupDate) : null,
        estimatedDelivery: validated.estimatedDelivery ? new Date(validated.estimatedDelivery) : null,
        notes: validated.notes,
        specialInstructions: validated.specialInstructions,
        tenantId,
        createdById: user?.id || 'system',
      },
      include: {
        fromWarehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        toWarehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Shipment created successfully',
      shipment,
    }, 201);
  } catch (error: any) {
    console.error('Error creating shipment:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create shipment', 500);
  }
});
