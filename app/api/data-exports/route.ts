import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = { tenantId };
    if (status) where.status = status;

    const exports = await prisma.dataExport.findMany({
      where,
      include: {
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return apiResponse({ exports });
  } catch (error) {
    console.error('Data Exports Error:', error);
    return apiError('Failed to fetch data exports', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId, userId }) => {
  try {
    const body = await request.json();
    const {
      exportType,
      format,
      filters,
      includeRelations = false,
    } = body;

    if (!exportType || !format) {
      return apiError('Missing required fields', 400);
    }

    const dataExport = await prisma.dataExport.create({
      data: {
        exportType,
        format,
        filters,
        includeRelations,
        requestedById: userId,
        tenantId,
      },
      include: {
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return apiResponse(dataExport, 201);
  } catch (error) {
    console.error('Data Export Creation Error:', error);
    return apiError('Failed to create data export', 500);
  }
});
