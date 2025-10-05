import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const WebhookUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  events: z.array(z.string()).optional(),
  secret: z.string().optional(),
  headers: z.record(z.string()).optional(),
  isActive: z.boolean().optional(),
  retryAttempts: z.number().int().min(0).max(10).optional(),
  retryDelay: z.number().int().min(1000).max(60000).optional(),
  timeout: z.number().int().min(5000).max(120000).optional(),
});

/**
 * GET /api/webhooks/[id] - Get webhook details
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const webhook = await prisma.webhook.findFirst({
      where: { id, tenantId },
      include: {
        deliveries: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { deliveries: true },
        },
      },
    });

    if (!webhook) {
      return apiError('Webhook not found', 404);
    }

    return apiResponse(webhook);
  } catch (error: any) {
    console.error('Error fetching webhook:', error);
    return apiError(error.message || 'Failed to fetch webhook', 500);
  }
});

/**
 * PATCH /api/webhooks/[id] - Update webhook
 */
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = WebhookUpdateSchema.parse(body);

    const webhook = await prisma.webhook.findFirst({
      where: { id, tenantId },
    });

    if (!webhook) {
      return apiError('Webhook not found', 404);
    }

    const updatedWebhook = await prisma.webhook.update({
      where: { id },
      data: {
        ...validated,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: { deliveries: true },
        },
      },
    });

    return apiResponse({
      message: 'Webhook updated successfully',
      webhook: updatedWebhook,
    });
  } catch (error: any) {
    console.error('Error updating webhook:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update webhook', 500);
  }
});

/**
 * DELETE /api/webhooks/[id] - Delete webhook
 */
export const DELETE = withTenant(async (
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

    // Delete all associated deliveries first
    await prisma.webhookDelivery.deleteMany({
      where: { webhookId: id },
    });

    await prisma.webhook.delete({
      where: { id },
    });

    return apiResponse({
      message: 'Webhook deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting webhook:', error);
    return apiError(error.message || 'Failed to delete webhook', 500);
  }
});
