import { NextRequest, NextResponse } from 'next/server';
import { withTenant, requireRole } from '@/lib/apiMiddleware';
import { createDatabaseBackup, listBackupFiles, getBackupInfo } from '@/lib/backup';

/**
 * Database Backup Management API
 * Requires ADMIN or SUPER_ADMIN role
 */

// List all backups
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  // Only admins can access backups
  requireRole(user, ['ADMIN', 'SUPER_ADMIN']);

  const backups = await listBackupFiles();
  
  const backupDetails = await Promise.all(
    backups.map(async (filename) => {
      const info = await getBackupInfo(filename);
      return {
        filename,
        info,
      };
    })
  );

  return NextResponse.json({
    success: true,
    data: {
      count: backups.length,
      backups: backupDetails,
    },
  });
});

// Create new backup
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  // Only admins can create backups
  requireRole(user, ['ADMIN', 'SUPER_ADMIN']);

  const result = await createDatabaseBackup();

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      filename: result.filename,
      size: result.size,
      timestamp: result.timestamp,
    },
    message: 'Backup created successfully',
  });
});
