import { NextRequest, NextResponse } from 'next/server';
import { withTenant, requireRole } from '@/lib/apiMiddleware';
import { queryAuditLogs, createAuditLog } from '@/lib/auditLog';

export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  requireRole(user, ['ADMIN', 'SUPER_ADMIN']);

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');

  const logs = await queryAuditLogs(tenantId, limit);

  return NextResponse.json({
    success: true,
    data: {
      count: logs.length,
      logs,
    },
  });
});
