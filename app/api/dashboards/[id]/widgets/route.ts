import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const WidgetCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['LINE_CHART', 'BAR_CHART', 'PIE_CHART', 'AREA_CHART', 'SCATTER_CHART', 'GAUGE', 'KPI_CARD', 'TABLE', 'HEATMAP', 'FUNNEL', 'PROGRESS', 'STAT', 'MAP', 'CUSTOM']),
  dataSource: z.string().min(1, 'Data source is required'),
  config: z.record(z.any()),
  position: z.record(z.any()),
  refreshInterval: z.number().positive().optional(),
  isVisible: z.boolean().default(true),
});

/**
 * POST /api/dashboards/[id]/widgets - Add widget to dashboard
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = WidgetCreateSchema.parse(body);

    const dashboard = await prisma.dashboard.findFirst({
      where: {
        id,
        tenantId,
        OR: [
          { createdById: user.id },
          { shares: { some: { userId: user.id, permission: { in: ['EDIT', 'ADMIN'] } } } },
        ],
      },
    });

    if (!dashboard) {
      return apiError('Dashboard not found or access denied', 404);
    }

    const widget = await prisma.dashboardWidget.create({
      data: {
        dashboardId: id,
        title: validated.title,
        type: validated.type,
        dataSource: validated.dataSource,
        config: validated.config,
        position: validated.position,
        refreshInterval: validated.refreshInterval,
        isVisible: validated.isVisible,
        tenantId,
      },
    });

    return apiResponse(
      {
        message: 'Widget added successfully',
        widget,
      },
      201
    );
  } catch (error: any) {
    console.error('Error adding widget:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to add widget', 500);
  }
});
