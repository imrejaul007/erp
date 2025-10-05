import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import crypto from 'crypto';

const WebhookCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  url: z.string().url('Valid URL is required'),
  events: z.array(z.enum([
    'ORDER_CREATED', 'ORDER_UPDATED', 'ORDER_COMPLETED', 'ORDER_CANCELLED',
    'INVOICE_CREATED', 'INVOICE_PAID', 'INVOICE_OVERDUE',
    'PAYMENT_RECEIVED', 'PAYMENT_FAILED',
    'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_LOW_STOCK',
    'BATCH_CREATED', 'BATCH_STARTED', 'BATCH_COMPLETED',
    'WORK_ORDER_CREATED', 'WORK_ORDER_STARTED', 'WORK_ORDER_COMPLETED',
    'SHIPMENT_CREATED', 'SHIPMENT_SHIPPED', 'SHIPMENT_DELIVERED',
    'CUSTOMER_CREATED', 'CUSTOMER_UPDATED',
    'VENDOR_CREATED', 'VENDOR_UPDATED',
    'WAREHOUSE_STOCK_LOW', 'WAREHOUSE_TRANSFER_COMPLETED',
    'USER_CREATED', 'USER_DEACTIVATED'
  ])).min(1, 'At least one event is required'),
  secret: z.string().optional(),
  headers: z.record(z.string()).optional(),
  isActive: z.boolean().default(true),
  retryAttempts: z.number().int().min(0).max(10).default(3),
  retryDelay: z.number().int().min(1000).max(60000).default(5000),
  timeout: z.number().int().min(5000).max(120000).default(30000),
});

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
 * GET /api/webhooks - List all webhooks for tenant
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get('isActive');
    const event = searchParams.get('event');

    const where: any = { tenantId };
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    if (event) {
      where.events = { has: event };
    }

    const webhooks = await prisma.webhook.findMany({
      where,
      include: {
        _count: {
          select: { deliveries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(webhooks);
  } catch (error: any) {
    console.error('Error fetching webhooks:', error);
    return apiError(error.message || 'Failed to fetch webhooks', 500);
  }
});

/**
 * POST /api/webhooks - Create a new webhook
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = WebhookCreateSchema.parse(body);

    // Generate secret if not provided
    const secret = validated.secret || crypto.randomBytes(32).toString('hex');

    const webhook = await prisma.webhook.create({
      data: {
        name: validated.name,
        description: validated.description,
        url: validated.url,
        events: validated.events,
        secret,
        headers: validated.headers || {},
        isActive: validated.isActive,
        retryAttempts: validated.retryAttempts,
        retryDelay: validated.retryDelay,
        timeout: validated.timeout,
        tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return apiResponse(
      {
        message: 'Webhook created successfully',
        webhook,
      },
      201
    );
  } catch (error: any) {
    console.error('Error creating webhook:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create webhook', 500);
  }
});
