import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import { retryWebhookDelivery } from '@/lib/webhook-trigger';

/**
 * POST /api/webhook-deliveries/[id]/retry - Retry a failed webhook delivery
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const delivery = await prisma.webhookDelivery.findFirst({
      where: { id, tenantId },
    });

    if (!delivery) {
      return apiError('Webhook delivery not found', 404);
    }

    if (delivery.status === 'DELIVERED') {
      return apiError('Cannot retry a successful delivery', 400);
    }

    if (delivery.status === 'SENDING' || delivery.status === 'RETRYING') {
      return apiError('Delivery is already in progress', 400);
    }

    // Retry the delivery
    await retryWebhookDelivery(id);

    return apiResponse({
      message: 'Webhook delivery retry initiated',
      deliveryId: id,
    });
  } catch (error: any) {
    console.error('Error retrying webhook delivery:', error);
    return apiError(error.message || 'Failed to retry webhook delivery', 500);
  }
});
