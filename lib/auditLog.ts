import { prisma } from '@/lib/database/prisma';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'READ' | 'LOGIN' | 'LOGOUT';

export interface AuditLogEntry {
  tenantId: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  ipAddress?: string;
}

export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.$executeRaw`
      INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, ip_address, created_at)
      VALUES (gen_random_uuid(), ${entry.tenantId}, ${entry.userId}, ${entry.action}, ${entry.entityType}, ${entry.entityId || null}, ${entry.ipAddress || null}, NOW())
    `.catch(() => {});
  } catch (error) {
    console.error('Audit error:', error);
  }
}

export async function queryAuditLogs(tenantId: string, limit: number = 100) {
  try {
    return await prisma.$queryRaw<any[]>`
      SELECT * FROM audit_logs WHERE tenant_id = ${tenantId} ORDER BY created_at DESC LIMIT ${limit}
    `.catch(() => []);
  } catch {
    return [];
  }
}
