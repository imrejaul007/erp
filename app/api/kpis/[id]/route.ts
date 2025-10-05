import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const KPIUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  target: z.number().optional(),
  actualValue: z.number().optional(),
  status: z.enum(['EXCEEDING', 'ON_TRACK', 'AT_RISK', 'CRITICAL', 'NO_DATA']).optional(),
  alertThreshold: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/kpis/[id] - Get KPI details
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const kpi = await prisma.kPI.findFirst({
      where: { id, tenantId },
      include: {
        snapshots: {
          orderBy: { snapshotDate: 'desc' },
          take: 30,
        },
      },
    });

    if (!kpi) {
      return apiError('KPI not found', 404);
    }

    return apiResponse(kpi);
  } catch (error: any) {
    console.error('Error fetching KPI:', error);
    return apiError(error.message || 'Failed to fetch KPI', 500);
  }
});

/**
 * PATCH /api/kpis/[id] - Update KPI
 */
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = KPIUpdateSchema.parse(body);

    const kpi = await prisma.kPI.findFirst({
      where: { id, tenantId },
    });

    if (!kpi) {
      return apiError('KPI not found', 404);
    }

    // Create snapshot before updating if actual value changed
    if (validated.actualValue !== undefined && validated.actualValue !== kpi.actualValue) {
      await prisma.kPISnapshot.create({
        data: {
          kpiId: id,
          value: validated.actualValue,
          target: validated.target || kpi.target || 0,
          variance: validated.target
            ? validated.actualValue - (validated.target || 0)
            : kpi.target
            ? validated.actualValue - kpi.target
            : null,
          variancePercent: validated.target
            ? ((validated.actualValue - (validated.target || 0)) / (validated.target || 1)) * 100
            : kpi.target
            ? ((validated.actualValue - kpi.target) / kpi.target) * 100
            : null,
          periodStart: kpi.periodStart,
          periodEnd: kpi.periodEnd,
          tenantId,
        },
      });
    }

    const updatedKPI = await prisma.kPI.update({
      where: { id },
      data: {
        ...validated,
        previousValue: validated.actualValue !== undefined ? kpi.actualValue : kpi.previousValue,
      },
      include: {
        snapshots: {
          orderBy: { snapshotDate: 'desc' },
          take: 10,
        },
      },
    });

    return apiResponse({
      message: 'KPI updated successfully',
      kpi: updatedKPI,
    });
  } catch (error: any) {
    console.error('Error updating KPI:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update KPI', 500);
  }
});

/**
 * DELETE /api/kpis/[id] - Delete KPI
 */
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const kpi = await prisma.kPI.findFirst({
      where: { id, tenantId },
    });

    if (!kpi) {
      return apiError('KPI not found', 404);
    }

    // Delete all snapshots first
    await prisma.kPISnapshot.deleteMany({
      where: { kpiId: id },
    });

    await prisma.kPI.delete({
      where: { id },
    });

    return apiResponse({
      message: 'KPI deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting KPI:', error);
    return apiError(error.message || 'Failed to delete KPI', 500);
  }
});
