import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const TrackingUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY', 'RETURNED', 'CANCELLED']),
  location: z.string().optional(),
  notes: z.string().optional(),
  actualDelivery: z.string().datetime().optional(),
});

/**
 * POST /api/shipments/[id]/track - Update shipment tracking status
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = TrackingUpdateSchema.parse(body);

    const shipment = await prisma.shipment.findFirst({
      where: { id, tenantId },
    });

    if (!shipment) {
      return apiError('Shipment not found', 404);
    }

    // Get existing tracking events
    const existingEvents = (shipment.trackingEvents as any[]) || [];

    // Add new tracking event
    const newEvent = {
      timestamp: new Date().toISOString(),
      location: validated.location || 'Unknown',
      status: validated.status,
      notes: validated.notes,
    };

    const trackingEvents = [...existingEvents, newEvent];

    // Prepare update data
    const updateData: any = {
      status: validated.status,
      trackingEvents,
      updatedAt: new Date(),
    };

    // Update shipDate when picked up
    if (validated.status === 'PICKED_UP' && !shipment.shipDate) {
      updateData.shipDate = new Date();
    }

    // Update actualDelivery when delivered
    if (validated.status === 'DELIVERED') {
      updateData.actualDelivery = validated.actualDelivery ?
        new Date(validated.actualDelivery) : new Date();
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: updateData,
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
      message: `Shipment status updated to ${validated.status}`,
      shipment: updatedShipment,
    });
  } catch (error: any) {
    console.error('Error updating shipment tracking:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update shipment tracking', 500);
  }
});
