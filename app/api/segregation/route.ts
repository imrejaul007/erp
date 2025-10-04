import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schema
const SegregationBatchCreateSchema = z.object({
  rawMaterialId: z.string().min(1, 'Raw material is required'),
  rawQuantity: z.number().min(0, 'Quantity must be positive'),
  rawCost: z.number().min(0, 'Cost must be positive'),
  laborCost: z.number().min(0).optional().default(0),
  overheadCost: z.number().min(0).optional().default(0),
  segregationDate: z.string(),
  outputs: z.array(z.object({
    gradeName: z.string().min(1, 'Grade name is required'),
    productId: z.string().min(1, 'Product is required'),
    quantity: z.number().min(0, 'Quantity must be positive'),
    yieldPercentage: z.number().min(0).max(100),
    sellingPrice: z.number().min(0, 'Selling price must be positive'),
  })).optional(),
});

// GET - List all segregation batches
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

    const batches = await prisma.segregationBatch.findMany({
      where: whereClause,
      include: {
        rawMaterial: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        outputs: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ batches });
  } catch (error: any) {
    console.error('Error fetching segregation batches:', error);
    return apiError(error.message || 'Failed to fetch batches', 500);
  }
});

// POST - Create new segregation batch
export const POST = withTenant(async (req, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = SegregationBatchCreateSchema.parse(body);

    const {
      rawMaterialId,
      rawQuantity,
      rawCost,
      laborCost,
      overheadCost,
      segregationDate,
      outputs,
    } = validated;

    // Calculate total cost
    const totalCost = rawCost + laborCost + overheadCost;

    // Generate batch number
    const count = await prisma.segregationBatch.count({ where: { tenantId } });
    const batchNumber = `SEG-${String(count + 1).padStart(4, '0')}`;

    // Create batch with outputs in transaction
    const batch = await prisma.$transaction(async (tx) => {
      const newBatch = await tx.segregationBatch.create({
        data: {
          batchNumber,
          rawMaterialId,
          rawQuantity,
          rawCost,
          laborCost,
          overheadCost,
          totalCost,
          segregationDate: new Date(segregationDate),
          status: 'IN_PROGRESS',
          tenantId,
        },
      });

      // Create outputs if provided
      if (outputs && outputs.length > 0) {
        for (const output of outputs) {
          const unitCost = (totalCost * (output.yieldPercentage / 100)) / output.quantity;
          const profitMargin = output.sellingPrice - unitCost;

          await tx.segregationOutput.create({
            data: {
              batchId: newBatch.id,
              gradeName: output.gradeName,
              productId: output.productId,
              quantity: output.quantity,
              yieldPercentage: output.yieldPercentage,
              unitCost,
              sellingPrice: output.sellingPrice,
              profitMargin,
              tenantId,
            },
          });
        }
      }

      return tx.segregationBatch.findUnique({
        where: { id: newBatch.id },
        include: {
          rawMaterial: true,
          outputs: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return apiResponse({ batch }, 201);
  } catch (error: any) {
    console.error('Error creating segregation batch:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create batch', 500);
  }
});
