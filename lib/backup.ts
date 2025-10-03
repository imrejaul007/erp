import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Simple Database Backup System
 * Production-ready backup and restore for PostgreSQL
 */

export interface BackupResult {
  success: boolean;
  filename?: string;
  size?: number;
  error?: string;
  timestamp: Date;
}

/**
 * Parse Postgres URL for connection details
 */
function parseDbUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parsed.port || '5432',
    database: parsed.pathname.slice(1),
    user: parsed.username,
    password: parsed.password,
  };
}

/**
 * Create database backup
 */
export async function createDatabaseBackup(): Promise<BackupResult> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return {
      success: false,
      error: 'DATABASE_URL not configured',
      timestamp: new Date(),
    };
  }

  try {
    const db = parseDbUrl(dbUrl);
    const timestamp = Date.now();
    const filename = `backup-${timestamp}.sql`;
    const backupDir = process.env.BACKUP_DIR || './backups';

    // Create backup directory
    await execAsync(`mkdir -p ${backupDir}`);

    // Execute pg_dump
    const cmd = `PGPASSWORD="${db.password}" pg_dump -h ${db.host} -p ${db.port} -U ${db.user} -d ${db.database} -f ${backupDir}/${filename}`;
    
    await execAsync(cmd, { maxBuffer: 1024 * 1024 * 100 });

    // Get file size
    const sizeCmd = `wc -c < ${backupDir}/${filename}`;
    const { stdout } = await execAsync(sizeCmd);
    const size = parseInt(stdout.trim());

    return {
      success: true,
      filename,
      size,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Backup failed',
      timestamp: new Date(),
    };
  }
}

/**
 * List available backups
 */
export async function listBackupFiles(): Promise<string[]> {
  try {
    const backupDir = process.env.BACKUP_DIR || './backups';
    const { stdout } = await execAsync(`ls -1 ${backupDir}/backup-*.sql 2>/dev/null || echo ""`);
    return stdout.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Get backup file info
 */
export async function getBackupInfo(filename: string) {
  try {
    const backupDir = process.env.BACKUP_DIR || './backups';
    const { stdout } = await execAsync(`ls -lh ${backupDir}/${filename}`);
    return stdout.trim();
  } catch {
    return null;
  }
}
