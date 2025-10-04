import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const ReportCreateSchema = z.object({
  name: z.string().min(1, 'Report name is required'),
  reportType: z.enum(['SALES', 'INVENTORY', 'FINANCIAL', 'EXPENSE', 'VENDOR', 'CUSTOM']),
  description: z.string().optional(),
  filters: z.record(z.any()).optional(),
  schedule: z.enum(['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY']).default('ONCE'),
  recipients: z.array(z.string().email()).optional(),
  isActive: z.boolean().default(true),
});

/**
 * GET /api/reports - List all saved reports
 */
export const GET = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get('reportType');
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };

    // Regular users can only see their own reports
    if (user?.role === 'USER') {
      where.createdById = user.id;
    }

    if (reportType) where.reportType = reportType;
    if (isActive !== null) where.isActive = isActive === 'true';

    const reports = await prisma.savedReport.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(reports);
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return apiError(error.message || 'Failed to fetch reports', 500);
  }
});

/**
 * POST /api/reports - Save new report
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = ReportCreateSchema.parse(body);

    const report = await prisma.savedReport.create({
      data: {
        name: validated.name,
        reportType: validated.reportType,
        description: validated.description,
        filters: validated.filters || {},
        schedule: validated.schedule,
        recipients: validated.recipients || [],
        isActive: validated.isActive,
        tenantId,
        createdById: user?.id || 'system',
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Report saved successfully',
      report,
    }, 201);
  } catch (error: any) {
    console.error('Error saving report:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to save report', 500);
  }
});
