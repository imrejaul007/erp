import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schema for creating an aging batch
const AgingBatchCreateSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  containerType: z.string().min(1, 'Container type is required'),
  containerNumber: z.string().min(1, 'Container number is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string(),
  targetDuration: z.number().min(0, 'Target duration must be positive'),
  qualityBefore: z.string().optional(),
  notes: z.string().optional(),
});

// GET - List all aging batches
export const GET = withTenant(async (req, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const whereClause: any = { tenantId };

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { batchNumber: { contains: search, mode: 'insensitive' } },
        { containerNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const batches = await prisma.agingBatch.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ batches });
  } catch (error: any) {
    console.error('Error fetching aging batches:', error);
    return apiError(error.message || 'Failed to fetch batches', 500);
  }
});

// POST - Create new aging batch
export const POST = withTenant(async (req, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = AgingBatchCreateSchema.parse(body);

    const {
      productId,
      quantity,
      containerType,
      containerNumber,
      location,
      startDate,
      targetDuration,
      qualityBefore,
      notes,
    } = validated;

    // Generate batch number
    const count = await prisma.agingBatch.count({ where: { tenantId } });
    const batchNumber = `AGE-${String(count + 1).padStart(4, '0')}`;

    // Calculate expected ready date
    const start = new Date(startDate);
    const expectedReadyDate = new Date(start);
    expectedReadyDate.setDate(expectedReadyDate.getDate() + targetDuration);

    // Create aging batch
    const batch = await prisma.agingBatch.create({
      data: {
        batchNumber,
        productId,
        quantity,
        containerType,
        containerNumber,
        location,
        startDate: start,
        targetDuration,
        expectedReadyDate,
        qualityBefore,
        status: 'AGING',
        notes,
        tenantId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        },
      },
    });

    return apiResponse({ batch }, 201);
  } catch (error: any) {
    console.error('Error creating aging batch:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create batch', 500);
  }
});
