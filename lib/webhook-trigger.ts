import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export type WebhookEvent =
  | 'ORDER_CREATED' | 'ORDER_UPDATED' | 'ORDER_COMPLETED' | 'ORDER_CANCELLED'
  | 'INVOICE_CREATED' | 'INVOICE_PAID' | 'INVOICE_OVERDUE'
  | 'PAYMENT_RECEIVED' | 'PAYMENT_FAILED'
  | 'PRODUCT_CREATED' | 'PRODUCT_UPDATED' | 'PRODUCT_LOW_STOCK'
  | 'BATCH_CREATED' | 'BATCH_STARTED' | 'BATCH_COMPLETED'
  | 'WORK_ORDER_CREATED' | 'WORK_ORDER_STARTED' | 'WORK_ORDER_COMPLETED'
  | 'SHIPMENT_CREATED' | 'SHIPMENT_SHIPPED' | 'SHIPMENT_DELIVERED'
  | 'CUSTOMER_CREATED' | 'CUSTOMER_UPDATED'
  | 'VENDOR_CREATED' | 'VENDOR_UPDATED'
  | 'WAREHOUSE_STOCK_LOW' | 'WAREHOUSE_TRANSFER_COMPLETED'
  | 'USER_CREATED' | 'USER_DEACTIVATED'
  | 'WEBHOOK_TEST';

interface Webhook {
  id: string;
  url: string;
  secret?: string | null;
  headers?: any;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

/**
 * Generate HMAC signature for webhook payload
 */
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Deliver webhook with retry logic
 */
async function deliverWebhook(
  webhook: Webhook,
  deliveryId: string,
  event: WebhookEvent,
  payload: any,
  attempt: number = 1
): Promise<void> {
  try {
    const payloadString = JSON.stringify(payload);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Webhook-Event': event,
      'X-Webhook-Delivery-ID': deliveryId,
      'X-Webhook-Attempt': attempt.toString(),
      ...(webhook.headers || {}),
    };

    // Add HMAC signature if secret is configured
    if (webhook.secret) {
      headers['X-Webhook-Signature'] = generateSignature(payloadString, webhook.secret);
    }

    // Update delivery status to SENDING
    await prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status: 'SENDING',
        attempts: attempt,
      },
    });

    // Send webhook
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), webhook.timeout);

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: payloadString,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseBody = await response.text().catch(() => null);

    // Update delivery with response
    await prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status: response.ok ? 'DELIVERED' : 'FAILED',
        responseStatus: response.status,
        responseBody: responseBody?.substring(0, 5000), // Limit response size
        responseHeaders: Object.fromEntries(response.headers.entries()),
        sentAt: new Date(),
        error: response.ok ? null : `HTTP ${response.status}: ${response.statusText}`,
      },
    });

    // Retry on failure if attempts remaining
    if (!response.ok && attempt < webhook.retryAttempts) {
      setTimeout(() => {
        deliverWebhook(webhook, deliveryId, event, payload, attempt + 1);
      }, webhook.retryDelay * attempt); // Exponential backoff
    }
  } catch (error: any) {
    console.error(`Webhook delivery error (attempt ${attempt}):`, error);

    const errorMessage = error.name === 'AbortError'
      ? 'Request timeout'
      : error.message || 'Unknown error';

    // Update delivery with error
    await prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status: attempt < webhook.retryAttempts ? 'RETRYING' : 'FAILED',
        error: errorMessage,
        attempts: attempt,
      },
    });

    // Retry on failure if attempts remaining
    if (attempt < webhook.retryAttempts) {
      setTimeout(() => {
        deliverWebhook(webhook, deliveryId, event, payload, attempt + 1);
      }, webhook.retryDelay * attempt); // Exponential backoff
    }
  }
}

/**
 * Trigger webhook for a specific event
 */
export async function triggerWebhook(
  webhook: Webhook,
  event: WebhookEvent,
  payload: any,
  tenantId: string
): Promise<any> {
  // Create delivery record
  const delivery = await prisma.webhookDelivery.create({
    data: {
      webhookId: webhook.id,
      event,
      payload,
      status: 'PENDING',
      attempts: 0,
      tenantId,
      createdAt: new Date(),
    },
  });

  // Trigger delivery asynchronously (don't wait for completion)
  setImmediate(() => {
    deliverWebhook(webhook, delivery.id, event, payload);
  });

  return delivery;
}

/**
 * Trigger all webhooks for a specific event and tenant
 */
export async function triggerWebhooks(
  event: WebhookEvent,
  payload: any,
  tenantId: string
): Promise<void> {
  try {
    // Find all active webhooks subscribed to this event
    const webhooks = await prisma.webhook.findMany({
      where: {
        tenantId,
        isActive: true,
        events: {
          has: event,
        },
      },
    });

    // Trigger each webhook
    for (const webhook of webhooks) {
      await triggerWebhook(webhook, event, payload, tenantId);
    }
  } catch (error) {
    console.error('Error triggering webhooks:', error);
    // Don't throw - webhook failures shouldn't break main flow
  }
}

/**
 * Retry a failed webhook delivery
 */
export async function retryWebhookDelivery(deliveryId: string): Promise<void> {
  const delivery = await prisma.webhookDelivery.findUnique({
    where: { id: deliveryId },
    include: {
      webhook: true,
    },
  });

  if (!delivery || !delivery.webhook) {
    throw new Error('Delivery or webhook not found');
  }

  if (delivery.status === 'DELIVERED') {
    throw new Error('Delivery already succeeded');
  }

  // Reset delivery and retry
  await prisma.webhookDelivery.update({
    where: { id: deliveryId },
    data: {
      status: 'PENDING',
      attempts: 0,
      error: null,
    },
  });

  await deliverWebhook(
    delivery.webhook,
    deliveryId,
    delivery.event as WebhookEvent,
    delivery.payload
  );
}
