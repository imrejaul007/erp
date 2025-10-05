import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import { triggerWebhook } from '@/lib/webhook-trigger';

/**
 * POST /api/webhooks/[id]/test - Test webhook delivery
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const webhook = await prisma.webhook.findFirst({
      where: { id, tenantId },
    });

    if (!webhook) {
      return apiError('Webhook not found', 404);
    }

    // Create test payload
    const testPayload = {
      event: 'WEBHOOK_TEST',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook delivery',
        webhookId: webhook.id,
        webhookName: webhook.name,
      },
    };

    // Trigger webhook
    const delivery = await triggerWebhook(
      webhook,
      'WEBHOOK_TEST' as any,
      testPayload,
      tenantId
    );

    return apiResponse({
      message: 'Test webhook triggered successfully',
      delivery,
    });
  } catch (error: any) {
    console.error('Error testing webhook:', error);
    return apiError(error.message || 'Failed to test webhook', 500);
  }
});
