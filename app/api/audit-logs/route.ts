import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '100');

    const where: any = { tenantId };
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (userId) where.userId = userId;

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return apiResponse({ logs });
  } catch (error) {
    console.error('Audit Logs Error:', error);
    return apiError('Failed to fetch audit logs', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId, userId }) => {
  try {
    const body = await request.json();
    const {
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      changes,
      userEmail,
      userIp,
      userAgent,
      metadata,
      status = 'SUCCESS',
      errorMessage,
    } = body;

    if (!action || !entityType) {
      return apiError('Missing required fields', 400);
    }

    const log = await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        oldValue,
        newValue,
        changes,
        userId,
        userEmail,
        userIp,
        userAgent,
        metadata,
        status,
        errorMessage,
        tenantId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return apiResponse(log, 201);
  } catch (error) {
    console.error('Audit Log Creation Error:', error);
    return apiError('Failed to create audit log', 500);
  }
});
