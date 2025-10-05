import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

// GET /api/segregation/batches - List all segregation batches
export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }

    const [batches, total] = await Promise.all([
      prisma.segregationBatch.findMany({
        where,
        include: {
          rawMaterial: {
            select: {
              id: true,
              name: true,
              nameArabic: true,
              sku: true,
            },
          },
          outputs: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  nameArabic: true,
                  sku: true,
                },
              },
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.segregationBatch.count({ where }),
    ]);

    return apiResponse({
      batches,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Segregation Batches List Error:', error);
    return apiError('Failed to fetch segregation batches', 500);
  }
});

// POST /api/segregation/batches - Create new segregation batch
export const POST = withTenant(async (request: NextRequest, { tenantId, userId }) => {
  try {
    const body = await request.json();
    const {
      batchNumber,
      rawMaterialId,
      rawQuantity,
      rawCost,
      segregationDate,
      laborCost = 0,
      overheadCost = 0,
      wastage = 0,
      notes,
      outputs = [],
    } = body;

    // Validate required fields
    if (!batchNumber || !rawMaterialId || !rawQuantity || !rawCost || !segregationDate) {
      return apiError('Missing required fields', 400);
    }

    // Calculate total cost
    const totalOutputCost = outputs.reduce((sum: number, o: any) => sum + (o.unitCost * o.quantity), 0);
    const wastageCost = (rawCost * (wastage / 100));
    const totalCost = rawCost + laborCost + overheadCost;

    // Create segregation batch with outputs
    const batch = await prisma.segregationBatch.create({
      data: {
        batchNumber,
        rawMaterialId,
        rawQuantity,
        rawCost,
        segregationDate: new Date(segregationDate),
        laborCost,
        overheadCost,
        totalCost,
        wastage,
        wastageCost,
        notes,
        tenantId,
        createdById: userId,
        outputs: {
          create: outputs.map((output: any) => ({
            gradeName: output.gradeName,
            productId: output.productId,
            quantity: output.quantity,
            yieldPercentage: (output.quantity / rawQuantity) * 100,
            unitCost: output.unitCost || (totalCost / rawQuantity),
            sellingPrice: output.sellingPrice || 0,
            profitMargin: output.profitMargin || 0,
            notes: output.notes,
          })),
        },
      },
      include: {
        rawMaterial: {
          select: {
            id: true,
            name: true,
            nameArabic: true,
            sku: true,
          },
        },
        outputs: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                nameArabic: true,
                sku: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return apiResponse(batch, 201);
  } catch (error) {
    console.error('Segregation Batch Creation Error:', error);
    return apiError('Failed to create segregation batch', 500);
  }
});
