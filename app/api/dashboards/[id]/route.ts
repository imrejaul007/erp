import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const DashboardUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  layout: z.record(z.any()).optional(),
  isDefault: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

/**
 * GET /api/dashboards/[id] - Get dashboard details
 */
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;

    const dashboard = await prisma.dashboard.findFirst({
      where: {
        id,
        tenantId,
        OR: [
          { isPublic: true },
          { createdById: user.id },
          { shares: { some: { userId: user.id } } },
        ],
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        widgets: {
          orderBy: { createdAt: 'asc' },
        },
        shares: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!dashboard) {
      return apiError('Dashboard not found or access denied', 404);
    }

    return apiResponse(dashboard);
  } catch (error: any) {
    console.error('Error fetching dashboard:', error);
    return apiError(error.message || 'Failed to fetch dashboard', 500);
  }
});

/**
 * PATCH /api/dashboards/[id] - Update dashboard
 */
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = DashboardUpdateSchema.parse(body);

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

    // If setting as default, unset other defaults for this type
    if (validated.isDefault) {
      await prisma.dashboard.updateMany({
        where: {
          tenantId,
          type: dashboard.type,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const updatedDashboard = await prisma.dashboard.update({
      where: { id },
      data: validated,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        widgets: true,
        shares: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    return apiResponse({
      message: 'Dashboard updated successfully',
      dashboard: updatedDashboard,
    });
  } catch (error: any) {
    console.error('Error updating dashboard:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update dashboard', 500);
  }
});

/**
 * DELETE /api/dashboards/[id] - Delete dashboard
 */
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;

    const dashboard = await prisma.dashboard.findFirst({
      where: {
        id,
        tenantId,
        createdById: user.id,
      },
    });

    if (!dashboard) {
      return apiError('Dashboard not found or access denied', 404);
    }

    // Delete all widgets and shares
    await prisma.dashboardWidget.deleteMany({
      where: { dashboardId: id },
    });

    await prisma.dashboardShare.deleteMany({
      where: { dashboardId: id },
    });

    await prisma.dashboard.delete({
      where: { id },
    });

    return apiResponse({
      message: 'Dashboard deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting dashboard:', error);
    return apiError(error.message || 'Failed to delete dashboard', 500);
  }
});
