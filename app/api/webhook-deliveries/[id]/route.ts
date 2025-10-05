import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

/**
 * GET /api/webhook-deliveries/[id] - Get webhook delivery details
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const delivery = await prisma.webhookDelivery.findFirst({
      where: { id, tenantId },
      include: {
        webhook: {
          select: {
            id: true,
            name: true,
            url: true,
            events: true,
          },
        },
      },
    });

    if (!delivery) {
      return apiError('Webhook delivery not found', 404);
    }

    return apiResponse(delivery);
  } catch (error: any) {
    console.error('Error fetching webhook delivery:', error);
    return apiError(error.message || 'Failed to fetch webhook delivery', 500);
  }
});
