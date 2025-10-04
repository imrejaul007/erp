import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schema for creating a distillation batch
const DistillationBatchCreateSchema = z.object({
  rawMaterialId: z.string().min(1, 'Raw material is required'),
  rawQuantity: z.number().min(0, 'Raw quantity must be positive'),
  rawCost: z.number().min(0, 'Raw cost must be positive'),
  outputProductId: z.string().min(1, 'Output product is required'),
  expectedYield: z.number().min(0).max(100).optional(),
  startDate: z.string(),
  expectedEndDate: z.string().optional(),
  method: z.enum(['STEAM', 'HYDRO', 'CO2', 'SOLVENT']).optional().default('STEAM'),
  temperature: z.number().min(0).optional(),
  pressure: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  notes: z.string().optional(),
});

// GET - List all distillation batches
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
      ];
    }

    const batches = await prisma.distillationBatch.findMany({
      where: whereClause,
      include: {
        rawMaterial: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        },
        outputProduct: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        },
        logs: {
          select: {
            id: true,
            logDate: true,
            temperature: true,
            pressure: true,
            notes: true,
          },
          orderBy: { logDate: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ batches });
  } catch (error: any) {
    console.error('Error fetching distillation batches:', error);
    return apiError(error.message || 'Failed to fetch batches', 500);
  }
});

// POST - Create new distillation batch
export const POST = withTenant(async (req, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = DistillationBatchCreateSchema.parse(body);

    const {
      rawMaterialId,
      rawQuantity,
      rawCost,
      outputProductId,
      expectedYield,
      startDate,
      expectedEndDate,
      method,
      temperature,
      pressure,
      duration,
      notes,
    } = validated;

    // Generate batch number
    const count = await prisma.distillationBatch.count({ where: { tenantId } });
    const batchNumber = `DIST-${String(count + 1).padStart(4, '0')}`;

    // Create batch
    const batch = await prisma.distillationBatch.create({
      data: {
        batchNumber,
        rawMaterialId,
        rawQuantity,
        rawCost,
        outputProductId,
        expectedYield: expectedYield || 0,
        startDate: new Date(startDate),
        expectedEndDate: expectedEndDate ? new Date(expectedEndDate) : null,
        method: method || 'STEAM',
        temperature: temperature || 0,
        pressure: pressure || 0,
        duration: duration || 0,
        status: 'IN_PROGRESS',
        notes,
        tenantId,
      },
      include: {
        rawMaterial: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
          },
        },
        outputProduct: {
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
    console.error('Error creating distillation batch:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create batch', 500);
  }
});
