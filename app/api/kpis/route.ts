import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const KPICreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum(['SALES', 'REVENUE', 'PROFITABILITY', 'INVENTORY', 'PRODUCTION', 'CUSTOMER', 'VENDOR', 'FINANCIAL', 'OPERATIONAL', 'QUALITY', 'HR', 'CUSTOM']),
  metric: z.string().min(1, 'Metric is required'),
  formula: z.string().optional(),
  unit: z.string().optional(),
  target: z.number().optional(),
  actualValue: z.number().optional(),
  previousValue: z.number().optional(),
  periodType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM']).default('MONTHLY'),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  status: z.enum(['EXCEEDING', 'ON_TRACK', 'AT_RISK', 'CRITICAL', 'NO_DATA']).default('NO_DATA'),
  alertThreshold: z.number().min(0).max(100).optional(),
  isActive: z.boolean().default(true),
});

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
 * GET /api/kpis - List all KPIs for tenant
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const periodType = searchParams.get('periodType');
    const status = searchParams.get('status');
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };
    if (category) where.category = category;
    if (periodType) where.periodType = periodType;
    if (status) where.status = status;
    if (isActive !== null) where.isActive = isActive === 'true';

    const kpis = await prisma.kPI.findMany({
      where,
      include: {
        snapshots: {
          orderBy: { snapshotDate: 'desc' },
          take: 5,
        },
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    return apiResponse(kpis);
  } catch (error: any) {
    console.error('Error fetching KPIs:', error);
    return apiError(error.message || 'Failed to fetch KPIs', 500);
  }
});

/**
 * POST /api/kpis - Create a new KPI
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = KPICreateSchema.parse(body);

    const kpi = await prisma.kPI.create({
      data: {
        name: validated.name,
        description: validated.description,
        category: validated.category,
        metric: validated.metric,
        formula: validated.formula,
        unit: validated.unit,
        target: validated.target,
        actualValue: validated.actualValue,
        previousValue: validated.previousValue,
        periodType: validated.periodType,
        periodStart: new Date(validated.periodStart),
        periodEnd: new Date(validated.periodEnd),
        status: validated.status,
        alertThreshold: validated.alertThreshold,
        isActive: validated.isActive,
        tenantId,
      },
      include: {
        snapshots: true,
      },
    });

    return apiResponse(
      {
        message: 'KPI created successfully',
        kpi,
      },
      201
    );
  } catch (error: any) {
    console.error('Error creating KPI:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create KPI', 500);
  }
});
