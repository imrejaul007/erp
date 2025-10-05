import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const DashboardCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: z.enum(['EXECUTIVE', 'SALES', 'INVENTORY', 'PRODUCTION', 'FINANCIAL', 'CUSTOMER', 'OPERATIONAL', 'CUSTOM']).default('CUSTOM'),
  layout: z.record(z.any()),
  isDefault: z.boolean().default(false),
  isPublic: z.boolean().default(false),
});

/**
 * GET /api/dashboards - List all dashboards for tenant
 */
export const GET = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const isDefault = searchParams.get('isDefault');

    const where: any = {
      OR: [
        { tenantId, isPublic: true },
        { tenantId, createdById: user.id },
        { tenantId, shares: { some: { userId: user.id } } },
      ],
    };

    if (type) where.type = type;
    if (isDefault !== null) where.isDefault = isDefault === 'true';

    const dashboards = await prisma.dashboard.findMany({
      where,
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
        _count: {
          select: { widgets: true, shares: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(dashboards);
  } catch (error: any) {
    console.error('Error fetching dashboards:', error);
    return apiError(error.message || 'Failed to fetch dashboards', 500);
  }
});

/**
 * POST /api/dashboards - Create a new dashboard
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = DashboardCreateSchema.parse(body);

    // If setting as default, unset other defaults for this type
    if (validated.isDefault) {
      await prisma.dashboard.updateMany({
        where: {
          tenantId,
          type: validated.type,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const dashboard = await prisma.dashboard.create({
      data: {
        name: validated.name,
        description: validated.description,
        type: validated.type,
        layout: validated.layout,
        isDefault: validated.isDefault,
        isPublic: validated.isPublic,
        createdById: user.id,
        tenantId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        widgets: true,
      },
    });

    return apiResponse(
      {
        message: 'Dashboard created successfully',
        dashboard,
      },
      201
    );
  } catch (error: any) {
    console.error('Error creating dashboard:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create dashboard', 500);
  }
});
