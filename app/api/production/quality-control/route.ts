import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// Validation schemas
const createQualityControlSchema = z.object({
  batchId: z.string(),
  testType: z.string().min(1, 'Test type is required'),
  testDate: z.string().transform(str => new Date(str)),
  result: z.enum(['PASS', 'FAIL', 'PENDING', 'RETEST_REQUIRED']),
  score: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  testedBy: z.string().optional()
});

const updateQualityControlSchema = createQualityControlSchema.partial();

// GET /api/production/quality-control
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const batchId = searchParams.get('batchId');
    const result = searchParams.get('result');
    const testType = searchParams.get('testType');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const skip = (page - 1) * limit;

    // Build filters with tenantId
    const where: any = { tenantId };

    if (batchId) {
      // Verify batch belongs to tenant
      const batch = await prisma.productionBatch.findUnique({
        where: { id: batchId }
      });
      if (!batch || batch.tenantId !== tenantId) {
        return apiError('Batch not found or does not belong to your tenant', 403);
      }
      where.batchId = batchId;
    }

    if (result) {
      where.result = result;
    }

    if (testType) {
      where.testType = { contains: testType, mode: 'insensitive' };
    }

    if (dateFrom || dateTo) {
      where.testDate = {};
      if (dateFrom) where.testDate.gte = new Date(dateFrom);
      if (dateTo) where.testDate.lte = new Date(dateTo);
    }

    // Get total count
    const total = await prisma.qualityControl.count({ where });

    // Get quality control records
    const qualityControls = await prisma.qualityControl.findMany({
      where,
      skip,
      take: limit,
      include: {
        batch: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: [
        { testDate: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Get summary statistics
    const stats = await prisma.qualityControl.aggregate({
      _count: {
        id: true
      },
      _avg: {
        score: true
      },
      where
    });

    const resultCounts = await prisma.qualityControl.groupBy({
      by: ['result'],
      _count: {
        id: true
      },
      where
    });

    const testTypeCounts = await prisma.qualityControl.groupBy({
      by: ['testType'],
      _count: {
        id: true
      },
      where,
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    });

    const statistics = {
      total: stats._count.id,
      averageScore: stats._avg.score || 0,
      resultBreakdown: resultCounts.reduce((acc, item) => {
        acc[item.result] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      topTestTypes: testTypeCounts
    };

    return apiResponse({
      success: true,
      data: {
        qualityControls,
        statistics,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching quality control records:', error);
    return apiError('Failed to fetch quality control records', 500);
  }
});

// POST /api/production/quality-control
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const validatedData = createQualityControlSchema.parse(body);

    // Verify batch exists and belongs to tenant
    const batch = await prisma.productionBatch.findUnique({
      where: { id: validatedData.batchId },
      include: {
        recipe: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!batch) {
      return apiError('Production batch not found', 404);
    }

    if (batch.tenantId !== tenantId) {
      return apiError('Production batch does not belong to your tenant', 403);
    }

    // Create quality control record
    const qualityControl = await prisma.qualityControl.create({
      data: {
        ...validatedData,
        tenantId
      },
      include: {
        batch: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                category: true
              }
            }
          }
        }
      }
    });

    return apiResponse({
      success: true,
      data: qualityControl,
      message: 'Quality control record created successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error creating quality control record:', error);
    return apiError('Failed to create quality control record', 500);
  }
});

// PUT /api/production/quality-control
export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return apiError('Quality control ID is required', 400);
    }

    const validatedData = updateQualityControlSchema.parse(updateData);

    // Check if quality control record exists and belongs to tenant
    const existingQC = await prisma.qualityControl.findUnique({
      where: { id }
    });

    if (!existingQC) {
      return apiError('Quality control record not found', 404);
    }

    if (existingQC.tenantId !== tenantId) {
      return apiError('Quality control record does not belong to your tenant', 403);
    }

    // Update quality control record
    const updatedQC = await prisma.qualityControl.update({
      where: { id },
      data: validatedData,
      include: {
        batch: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                category: true
              }
            }
          }
        }
      }
    });

    return apiResponse({
      success: true,
      data: updatedQC,
      message: 'Quality control record updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error updating quality control record:', error);
    return apiError('Failed to update quality control record', 500);
  }
});
