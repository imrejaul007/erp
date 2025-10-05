import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const SnapshotCreateSchema = z.object({
  value: z.number(),
  target: z.number().optional(),
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * POST /api/kpis/[id]/snapshot - Create KPI snapshot
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = SnapshotCreateSchema.parse(body);

    const kpi = await prisma.kPI.findFirst({
      where: { id, tenantId },
    });

    if (!kpi) {
      return apiError('KPI not found', 404);
    }

    const target = validated.target || kpi.target || 0;
    const variance = validated.value - target;
    const variancePercent = target !== 0 ? (variance / target) * 100 : 0;

    const snapshot = await prisma.kPISnapshot.create({
      data: {
        kpiId: id,
        value: validated.value,
        target,
        variance,
        variancePercent,
        periodStart: validated.periodStart ? new Date(validated.periodStart) : kpi.periodStart,
        periodEnd: validated.periodEnd ? new Date(validated.periodEnd) : kpi.periodEnd,
        metadata: validated.metadata,
        tenantId,
      },
    });

    // Update KPI with latest values
    await prisma.kPI.update({
      where: { id },
      data: {
        previousValue: kpi.actualValue,
        actualValue: validated.value,
      },
    });

    return apiResponse(
      {
        message: 'KPI snapshot created successfully',
        snapshot,
      },
      201
    );
  } catch (error: any) {
    console.error('Error creating KPI snapshot:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create KPI snapshot', 500);
  }
});
