import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ShareCreateSchema = z.object({
  userId: z.string(),
  permission: z.enum(['VIEW', 'EDIT', 'ADMIN']).default('VIEW'),
});

/**
 * POST /api/dashboards/[id]/share - Share dashboard with user
 */
export const POST = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = ShareCreateSchema.parse(body);

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

    // Check if user exists in tenant
    const targetUser = await prisma.users.findFirst({
      where: {
        id: validated.userId,
        tenantId,
      },
    });

    if (!targetUser) {
      return apiError('User not found', 404);
    }

    // Check if already shared
    const existingShare = await prisma.dashboardShare.findUnique({
      where: {
        dashboardId_userId: {
          dashboardId: id,
          userId: validated.userId,
        },
      },
    });

    if (existingShare) {
      // Update permission
      const updated = await prisma.dashboardShare.update({
        where: { id: existingShare.id },
        data: { permission: validated.permission },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return apiResponse({
        message: 'Dashboard share updated successfully',
        share: updated,
      });
    }

    const share = await prisma.dashboardShare.create({
      data: {
        dashboardId: id,
        userId: validated.userId,
        permission: validated.permission,
        tenantId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return apiResponse(
      {
        message: 'Dashboard shared successfully',
        share,
      },
      201
    );
  } catch (error: any) {
    console.error('Error sharing dashboard:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to share dashboard', 500);
  }
});

/**
 * DELETE /api/dashboards/[id]/share?userId=xxx - Remove dashboard share
 */
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId, user }: { params: { id: string }; tenantId: string; user: any }
) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return apiError('userId is required', 400);
    }

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

    await prisma.dashboardShare.deleteMany({
      where: {
        dashboardId: id,
        userId,
      },
    });

    return apiResponse({
      message: 'Dashboard share removed successfully',
    });
  } catch (error: any) {
    console.error('Error removing dashboard share:', error);
    return apiError(error.message || 'Failed to remove dashboard share', 500);
  }
});
