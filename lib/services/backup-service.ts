import { prisma } from '@/lib/prisma';
import { AuditService } from './audit-service';
import { notificationService } from './notification-service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createWriteStream, createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import * as zlib from 'zlib';
import * as crypto from 'crypto';

export interface BackupConfig {
  id: string;
  name: string;
  description: string;
  schedule: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:MM format
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
  };
  includedModules: string[];
  includedTables: string[];
  excludedTables: string[];
  compression: boolean;
  encryption: boolean;
  retentionDays: number;
  destination: {
    type: 'local' | 's3' | 'azure' | 'gcp';
    path: string;
    credentials?: Record<string, any>;
  };
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BackupJob {
  id: string;
  configId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  totalRecords: number;
  processedRecords: number;
  fileSize: number;
  filePath: string;
  checksum: string;
  errorMessage?: string;
  triggeredBy: 'schedule' | 'manual' | 'api';
  userId?: string;
  metadata: {
    version: string;
    schema: string;
    modules: string[];
    compressed: boolean;
    encrypted: boolean;
  };
}

export interface RestoreJob {
  id: string;
  backupJobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  totalRecords: number;
  processedRecords: number;
  restoreType: 'full' | 'partial' | 'selective';
  selectedTables?: string[];
  selectedModules?: string[];
  targetDatabase?: string;
  overwriteExisting: boolean;
  createBackupBefore: boolean;
  errorMessage?: string;
  userId: string;
  progress: {
    currentTable: string;
    tablesCompleted: number;
    totalTables: number;
    recordsCompleted: number;
    totalRecords: number;
  };
}

export interface BackupStats {
  totalBackups: number;
  successfulBackups: number;
  failedBackups: number;
  totalSize: number;
  averageSize: number;
  averageDuration: number;
  lastBackup?: Date;
  nextScheduledBackup?: Date;
  retentionStatus: {
    totalExpired: number;
    totalActive: number;
    oldestBackup: Date;
    newestBackup: Date;
  };
}

export class BackupService {
  private static instance: BackupService;
  private backupConfigs: Map<string, BackupConfig> = new Map();
  private activeJobs: Map<string, BackupJob | RestoreJob> = new Map();
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.loadConfigurations();
    this.setupScheduler();
    this.setupCleanupJob();
  }

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  // Create backup configuration
  async createBackupConfig(config: Omit<BackupConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `backup_config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const backupConfig: BackupConfig = {
      ...config,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.backupConfigs.set(id, backupConfig);
    await this.persistConfig(backupConfig);

    if (config.schedule.enabled) {
      this.scheduleBackup(backupConfig);
    }

    await AuditService.logActivity({
      userId: config.createdBy,
      action: 'backup_config_created',
      module: 'backup',
      details: { configId: id, name: config.name },
      timestamp: new Date()
    });

    return id;
  }

  // Update backup configuration
  async updateBackupConfig(id: string, updates: Partial<BackupConfig>): Promise<boolean> {
    const existing = this.backupConfigs.get(id);
    if (!existing) return false;

    const updated: BackupConfig = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.backupConfigs.set(id, updated);
    await this.persistConfig(updated);

    // Reschedule if schedule changed
    if (updates.schedule) {
      this.unscheduleBackup(id);
      if (updated.schedule.enabled) {
        this.scheduleBackup(updated);
      }
    }

    await AuditService.logActivity({
      userId: updates.createdBy || 'system',
      action: 'backup_config_updated',
      module: 'backup',
      details: { configId: id, updates },
      timestamp: new Date()
    });

    return true;
  }

  // Start manual backup
  async startBackup(configId: string, userId?: string): Promise<string> {
    const config = this.backupConfigs.get(configId);
    if (!config) {
      throw new Error(`Backup configuration ${configId} not found`);
    }

    const jobId = `backup_job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job: BackupJob = {
      id: jobId,
      configId,
      status: 'pending',
      startTime: new Date(),
      totalRecords: 0,
      processedRecords: 0,
      fileSize: 0,
      filePath: '',
      checksum: '',
      triggeredBy: userId ? 'manual' : 'schedule',
      userId,
      metadata: {
        version: process.env.APP_VERSION || '1.0.0',
        schema: 'latest',
        modules: config.includedModules,
        compressed: config.compression,
        encrypted: config.encryption
      }
    };

    this.activeJobs.set(jobId, job);

    // Start backup process asynchronously
    this.executeBackup(job, config).catch(error => {
      console.error('Backup execution error:', error);
    });

    await AuditService.logActivity({
      userId: userId || 'system',
      action: 'backup_started',
      module: 'backup',
      details: { jobId, configId, triggeredBy: job.triggeredBy },
      timestamp: new Date()
    });

    return jobId;
  }

  // Start restore
  async startRestore(
    backupJobId: string,
    options: {
      restoreType: 'full' | 'partial' | 'selective';
      selectedTables?: string[];
      selectedModules?: string[];
      targetDatabase?: string;
      overwriteExisting: boolean;
      createBackupBefore: boolean;
    },
    userId: string
  ): Promise<string> {
    const backupJob = await this.getBackupJob(backupJobId);
    if (!backupJob || backupJob.status !== 'completed') {
      throw new Error('Invalid or incomplete backup job');
    }

    // Create backup before restore if requested
    if (options.createBackupBefore) {
      const preRestoreConfig = await this.createPreRestoreBackup(userId);
      await this.startBackup(preRestoreConfig, userId);
    }

    const restoreJobId = `restore_job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const restoreJob: RestoreJob = {
      id: restoreJobId,
      backupJobId,
      status: 'pending',
      startTime: new Date(),
      totalRecords: backupJob.totalRecords,
      processedRecords: 0,
      restoreType: options.restoreType,
      selectedTables: options.selectedTables,
      selectedModules: options.selectedModules,
      targetDatabase: options.targetDatabase,
      overwriteExisting: options.overwriteExisting,
      createBackupBefore: options.createBackupBefore,
      userId,
      progress: {
        currentTable: '',
        tablesCompleted: 0,
        totalTables: 0,
        recordsCompleted: 0,
        totalRecords: backupJob.totalRecords
      }
    };

    this.activeJobs.set(restoreJobId, restoreJob);

    // Start restore process asynchronously
    this.executeRestore(restoreJob, backupJob).catch(error => {
      console.error('Restore execution error:', error);
    });

    await AuditService.logActivity({
      userId,
      action: 'restore_started',
      module: 'backup',
      details: { restoreJobId, backupJobId, restoreType: options.restoreType },
      timestamp: new Date()
    });

    return restoreJobId;
  }

  // Get backup statistics
  async getBackupStats(configId?: string): Promise<BackupStats> {
    try {
      const where = configId ? { configId } : {};

      const [jobs, totalSize] = await Promise.all([
        prisma.backupJob.findMany({
          where,
          select: {
            status: true,
            fileSize: true,
            duration: true,
            startTime: true
          }
        }),
        prisma.backupJob.aggregate({
          where: { ...where, status: 'completed' },
          _sum: { fileSize: true }
        })
      ]);

      const successful = jobs.filter(j => j.status === 'completed');
      const failed = jobs.filter(j => j.status === 'failed');

      const averageSize = successful.length > 0
        ? successful.reduce((sum, j) => sum + j.fileSize, 0) / successful.length
        : 0;

      const averageDuration = successful.length > 0
        ? successful.reduce((sum, j) => sum + (j.duration || 0), 0) / successful.length
        : 0;

      const lastBackup = successful.length > 0
        ? new Date(Math.max(...successful.map(j => j.startTime.getTime())))
        : undefined;

      // Calculate next scheduled backup
      const nextScheduledBackup = this.getNextScheduledBackup(configId);

      // Get retention status
      const retentionCutoff = new Date();
      retentionCutoff.setDate(retentionCutoff.getDate() - 30); // Default 30 days

      const [expiredJobs, activeJobs, oldestJob, newestJob] = await Promise.all([
        prisma.backupJob.count({
          where: { ...where, startTime: { lt: retentionCutoff } }
        }),
        prisma.backupJob.count({
          where: { ...where, startTime: { gte: retentionCutoff } }
        }),
        prisma.backupJob.findFirst({
          where,
          orderBy: { startTime: 'asc' },
          select: { startTime: true }
        }),
        prisma.backupJob.findFirst({
          where,
          orderBy: { startTime: 'desc' },
          select: { startTime: true }
        })
      ]);

      return {
        totalBackups: jobs.length,
        successfulBackups: successful.length,
        failedBackups: failed.length,
        totalSize: totalSize._sum.fileSize || 0,
        averageSize,
        averageDuration,
        lastBackup,
        nextScheduledBackup,
        retentionStatus: {
          totalExpired: expiredJobs,
          totalActive: activeJobs,
          oldestBackup: oldestJob?.startTime || new Date(),
          newestBackup: newestJob?.startTime || new Date()
        }
      };
    } catch (error) {
      console.error('Get backup stats error:', error);
      return {
        totalBackups: 0,
        successfulBackups: 0,
        failedBackups: 0,
        totalSize: 0,
        averageSize: 0,
        averageDuration: 0,
        retentionStatus: {
          totalExpired: 0,
          totalActive: 0,
          oldestBackup: new Date(),
          newestBackup: new Date()
        }
      };
    }
  }

  // Private methods
  private async executeBackup(job: BackupJob, config: BackupConfig): Promise<void> {
    try {
      // Update job status
      job.status = 'running';
      await this.updateJobStatus(job);

      // Generate file path
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `backup-${config.name}-${timestamp}.sql${config.compression ? '.gz' : ''}${config.encryption ? '.enc' : ''}`;
      job.filePath = path.join(config.destination.path, fileName);

      // Ensure backup directory exists
      await fs.mkdir(path.dirname(job.filePath), { recursive: true });

      // Get data to backup
      const backupData = await this.generateBackupData(config);
      job.totalRecords = backupData.totalRecords;

      // Write backup file
      await this.writeBackupFile(job, backupData, config);

      // Calculate checksum
      job.checksum = await this.calculateChecksum(job.filePath);

      // Get file size
      const stats = await fs.stat(job.filePath);
      job.fileSize = stats.size;

      // Update job completion
      job.status = 'completed';
      job.endTime = new Date();
      job.duration = job.endTime.getTime() - job.startTime.getTime();

      await this.updateJobStatus(job);

      // Send notification
      if (job.userId) {
        await notificationService.sendNotification(job.userId, {
          type: 'success',
          title: 'Backup Completed',
          message: `Backup "${config.name}" completed successfully. File size: ${this.formatFileSize(job.fileSize)}`,
          category: 'backup',
          module: 'backup',
          priority: 'medium',
          channels: ['in_app', 'email']
        });
      }

      await AuditService.logActivity({
        userId: job.userId || 'system',
        action: 'backup_completed',
        module: 'backup',
        details: {
          jobId: job.id,
          fileSize: job.fileSize,
          duration: job.duration,
          totalRecords: job.totalRecords
        },
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Backup execution error:', error);
      job.status = 'failed';
      job.errorMessage = error.message;
      job.endTime = new Date();
      job.duration = job.endTime.getTime() - job.startTime.getTime();

      await this.updateJobStatus(job);

      // Send error notification
      if (job.userId) {
        await notificationService.sendNotification(job.userId, {
          type: 'error',
          title: 'Backup Failed',
          message: `Backup "${config.name}" failed: ${error.message}`,
          category: 'backup',
          module: 'backup',
          priority: 'high',
          channels: ['in_app', 'email']
        });
      }

      await AuditService.logActivity({
        userId: job.userId || 'system',
        action: 'backup_failed',
        module: 'backup',
        details: { jobId: job.id, error: error.message },
        timestamp: new Date(),
        outcome: 'failure'
      });
    } finally {
      this.activeJobs.delete(job.id);
    }
  }

  private async executeRestore(restoreJob: RestoreJob, backupJob: BackupJob): Promise<void> {
    try {
      restoreJob.status = 'running';
      await this.updateJobStatus(restoreJob);

      // Read and decrypt backup file if needed
      const backupData = await this.readBackupFile(backupJob);

      // Validate backup integrity
      const isValid = await this.validateBackupIntegrity(backupJob, backupData);
      if (!isValid) {
        throw new Error('Backup file integrity check failed');
      }

      // Execute restore based on type
      await this.performRestore(restoreJob, backupData);

      restoreJob.status = 'completed';
      restoreJob.endTime = new Date();
      restoreJob.duration = restoreJob.endTime.getTime() - restoreJob.startTime.getTime();

      await this.updateJobStatus(restoreJob);

      // Send notification
      await notificationService.sendNotification(restoreJob.userId, {
        type: 'success',
        title: 'Restore Completed',
        message: `Database restore completed successfully. ${restoreJob.processedRecords} records restored.`,
        category: 'backup',
        module: 'backup',
        priority: 'high',
        channels: ['in_app', 'email']
      });

      await AuditService.logActivity({
        userId: restoreJob.userId,
        action: 'restore_completed',
        module: 'backup',
        details: {
          restoreJobId: restoreJob.id,
          backupJobId: backupJob.id,
          duration: restoreJob.duration,
          processedRecords: restoreJob.processedRecords
        },
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Restore execution error:', error);
      restoreJob.status = 'failed';
      restoreJob.errorMessage = error.message;
      restoreJob.endTime = new Date();
      restoreJob.duration = restoreJob.endTime.getTime() - restoreJob.startTime.getTime();

      await this.updateJobStatus(restoreJob);

      await notificationService.sendNotification(restoreJob.userId, {
        type: 'error',
        title: 'Restore Failed',
        message: `Database restore failed: ${error.message}`,
        category: 'backup',
        module: 'backup',
        priority: 'urgent',
        channels: ['in_app', 'email']
      });

      await AuditService.logActivity({
        userId: restoreJob.userId,
        action: 'restore_failed',
        module: 'backup',
        details: { restoreJobId: restoreJob.id, error: error.message },
        timestamp: new Date(),
        outcome: 'failure'
      });
    } finally {
      this.activeJobs.delete(restoreJob.id);
    }
  }

  private async generateBackupData(config: BackupConfig): Promise<{
    data: string;
    totalRecords: number;
  }> {
    let sqlDump = '';
    let totalRecords = 0;

    // Add header
    sqlDump += `-- Backup created at ${new Date().toISOString()}\n`;
    sqlDump += `-- Configuration: ${config.name}\n`;
    sqlDump += `-- Modules: ${config.includedModules.join(', ')}\n\n`;

    // Export schema
    sqlDump += await this.exportSchema();

    // Export data for each included table
    for (const table of config.includedTables) {
      if (config.excludedTables.includes(table)) continue;

      const tableData = await this.exportTableData(table);
      sqlDump += tableData.sql;
      totalRecords += tableData.recordCount;
    }

    return { data: sqlDump, totalRecords };
  }

  private async exportSchema(): Promise<string> {
    // This would export the database schema
    // Implementation depends on your database system
    return '-- Schema export not implemented\n\n';
  }

  private async exportTableData(tableName: string): Promise<{
    sql: string;
    recordCount: number;
  }> {
    try {
      // Get table data using Prisma raw queries
      const records = await prisma.$queryRawUnsafe(`SELECT * FROM "${tableName}"`);

      if (!Array.isArray(records) || records.length === 0) {
        return { sql: `-- Table ${tableName} is empty\n\n`, recordCount: 0 };
      }

      let sql = `-- Data for table ${tableName}\n`;

      // Generate INSERT statements
      for (const record of records) {
        const columns = Object.keys(record);
        const values = Object.values(record).map(value => {
          if (value === null) return 'NULL';
          if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
          if (value instanceof Date) return `'${value.toISOString()}'`;
          return String(value);
        });

        sql += `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`;
      }

      sql += '\n';
      return { sql, recordCount: records.length };
    } catch (error) {
      console.error(`Failed to export table ${tableName}:`, error);
      return { sql: `-- Failed to export table ${tableName}: ${error.message}\n\n`, recordCount: 0 };
    }
  }

  private async writeBackupFile(
    job: BackupJob,
    backupData: { data: string; totalRecords: number },
    config: BackupConfig
  ): Promise<void> {
    const writeStream = createWriteStream(job.filePath);
    let dataStream = writeStream;

    // Add compression if enabled
    if (config.compression) {
      const gzipStream = zlib.createGzip();
      gzipStream.pipe(writeStream);
      dataStream = gzipStream;
    }

    // Add encryption if enabled
    if (config.encryption) {
      const encryptionKey = this.getEncryptionKey();
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);

      cipher.pipe(dataStream);
      dataStream = cipher;
    }

    // Write data
    dataStream.write(backupData.data);
    dataStream.end();

    // Wait for completion
    await pipeline(dataStream, writeStream);
  }

  private async readBackupFile(backupJob: BackupJob): Promise<string> {
    const readStream = createReadStream(backupJob.filePath);
    let dataStream = readStream;

    // Add decryption if needed
    if (backupJob.metadata.encrypted) {
      const encryptionKey = this.getEncryptionKey();
      const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
      readStream.pipe(decipher);
      dataStream = decipher;
    }

    // Add decompression if needed
    if (backupJob.metadata.compressed) {
      const gunzipStream = zlib.createGunzip();
      dataStream.pipe(gunzipStream);
      dataStream = gunzipStream;
    }

    // Read data
    const chunks: Buffer[] = [];
    for await (const chunk of dataStream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks).toString('utf8');
  }

  private async performRestore(restoreJob: RestoreJob, backupData: string): Promise<void> {
    const statements = backupData.split(';').filter(stmt => stmt.trim());
    restoreJob.progress.totalTables = statements.length;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;

      try {
        // Execute SQL statement
        await prisma.$executeRawUnsafe(statement);

        restoreJob.processedRecords++;
        restoreJob.progress.recordsCompleted++;

        // Update progress periodically
        if (i % 100 === 0) {
          await this.updateJobStatus(restoreJob);
        }
      } catch (error) {
        if (!restoreJob.overwriteExisting && error.message.includes('already exists')) {
          // Skip if not overwriting existing data
          continue;
        }
        throw error;
      }
    }
  }

  private async validateBackupIntegrity(backupJob: BackupJob, data: string): Promise<boolean> {
    try {
      // Calculate checksum of current data
      const currentChecksum = crypto.createHash('sha256').update(data).digest('hex');

      // Compare with stored checksum
      return currentChecksum === backupJob.checksum;
    } catch (error) {
      console.error('Integrity check error:', error);
      return false;
    }
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const readStream = createReadStream(filePath);
    const hash = crypto.createHash('sha256');

    for await (const chunk of readStream) {
      hash.update(chunk);
    }

    return hash.digest('hex');
  }

  private getEncryptionKey(): string {
    return process.env.BACKUP_ENCRYPTION_KEY || 'default-encryption-key';
  }

  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  private async loadConfigurations(): Promise<void> {
    try {
      const configs = await prisma.backupConfig.findMany();

      for (const config of configs) {
        const backupConfig: BackupConfig = {
          id: config.id,
          name: config.name,
          description: config.description,
          schedule: JSON.parse(config.schedule),
          includedModules: JSON.parse(config.includedModules),
          includedTables: JSON.parse(config.includedTables),
          excludedTables: JSON.parse(config.excludedTables),
          compression: config.compression,
          encryption: config.encryption,
          retentionDays: config.retentionDays,
          destination: JSON.parse(config.destination),
          active: config.active,
          createdBy: config.createdBy,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt
        };

        this.backupConfigs.set(config.id, backupConfig);

        if (backupConfig.schedule.enabled && backupConfig.active) {
          this.scheduleBackup(backupConfig);
        }
      }
    } catch (error) {
      console.error('Failed to load backup configurations:', error);
    }
  }

  private setupScheduler(): void {
    // Check and trigger scheduled backups every minute
    setInterval(() => {
      this.checkScheduledBackups();
    }, 60000);
  }

  private setupCleanupJob(): void {
    // Run cleanup every day at 2 AM
    setInterval(() => {
      this.cleanupOldBackups();
    }, 24 * 60 * 60 * 1000);
  }

  private async checkScheduledBackups(): Promise<void> {
    const now = new Date();

    for (const config of this.backupConfigs.values()) {
      if (!config.schedule.enabled || !config.active) continue;

      if (this.shouldTriggerBackup(config, now)) {
        try {
          await this.startBackup(config.id);
        } catch (error) {
          console.error(`Failed to start scheduled backup ${config.id}:`, error);
        }
      }
    }
  }

  private shouldTriggerBackup(config: BackupConfig, now: Date): boolean {
    const schedule = config.schedule;
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Check if it's the right time
    if (currentTime !== schedule.time) return false;

    switch (schedule.frequency) {
      case 'daily':
        return true;
      case 'weekly':
        return now.getDay() === schedule.dayOfWeek;
      case 'monthly':
        return now.getDate() === schedule.dayOfMonth;
      default:
        return false;
    }
  }

  private scheduleBackup(config: BackupConfig): void {
    // This is a simplified scheduler
    // In production, you might want to use a more robust solution like node-cron
    const timeout = setTimeout(() => {
      this.startBackup(config.id);
      this.scheduleBackup(config); // Reschedule
    }, this.getNextScheduleTime(config));

    this.scheduledJobs.set(config.id, timeout);
  }

  private unscheduleBackup(configId: string): void {
    const timeout = this.scheduledJobs.get(configId);
    if (timeout) {
      clearTimeout(timeout);
      this.scheduledJobs.delete(configId);
    }
  }

  private getNextScheduleTime(config: BackupConfig): number {
    // Calculate next schedule time in milliseconds
    // This is a simplified implementation
    return 24 * 60 * 60 * 1000; // Default to 24 hours
  }

  private getNextScheduledBackup(configId?: string): Date | undefined {
    if (configId) {
      const config = this.backupConfigs.get(configId);
      if (config && config.schedule.enabled) {
        // Calculate next scheduled time based on frequency
        const now = new Date();
        const next = new Date(now);

        switch (config.schedule.frequency) {
          case 'daily':
            next.setDate(next.getDate() + 1);
            break;
          case 'weekly':
            next.setDate(next.getDate() + 7);
            break;
          case 'monthly':
            next.setMonth(next.getMonth() + 1);
            break;
        }

        return next;
      }
    }

    return undefined;
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      for (const config of this.backupConfigs.values()) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays);

        // Get old backup jobs
        const oldJobs = await prisma.backupJob.findMany({
          where: {
            configId: config.id,
            startTime: { lt: cutoffDate }
          }
        });

        // Delete backup files and database records
        for (const job of oldJobs) {
          try {
            if (job.filePath) {
              await fs.unlink(job.filePath);
            }
            await prisma.backupJob.delete({ where: { id: job.id } });
          } catch (error) {
            console.error(`Failed to cleanup backup ${job.id}:`, error);
          }
        }

        if (oldJobs.length > 0) {
          await AuditService.logActivity({
            userId: 'system',
            action: 'backup_cleanup',
            module: 'backup',
            details: { configId: config.id, deletedCount: oldJobs.length },
            timestamp: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Backup cleanup error:', error);
    }
  }

  private async createPreRestoreBackup(userId: string): Promise<string> {
    const config: Omit<BackupConfig, 'id' | 'createdAt' | 'updatedAt'> = {
      name: `Pre-restore backup ${new Date().toISOString()}`,
      description: 'Automatic backup created before restore operation',
      schedule: { enabled: false, frequency: 'daily', time: '02:00' },
      includedModules: ['all'],
      includedTables: [],
      excludedTables: [],
      compression: true,
      encryption: false,
      retentionDays: 30,
      destination: {
        type: 'local',
        path: process.env.BACKUP_PATH || './backups'
      },
      active: true,
      createdBy: userId
    };

    return await this.createBackupConfig(config);
  }

  // Public utility methods
  public async getBackupJob(jobId: string): Promise<BackupJob | null> {
    try {
      const job = await prisma.backupJob.findUnique({ where: { id: jobId } });
      if (!job) return null;

      return {
        id: job.id,
        configId: job.configId,
        status: job.status as any,
        startTime: job.startTime,
        endTime: job.endTime,
        duration: job.duration,
        totalRecords: job.totalRecords,
        processedRecords: job.processedRecords,
        fileSize: job.fileSize,
        filePath: job.filePath,
        checksum: job.checksum,
        errorMessage: job.errorMessage,
        triggeredBy: job.triggeredBy as any,
        userId: job.userId,
        metadata: JSON.parse(job.metadata)
      };
    } catch (error) {
      console.error('Get backup job error:', error);
      return null;
    }
  }

  public getActiveJobs(): (BackupJob | RestoreJob)[] {
    return Array.from(this.activeJobs.values());
  }

  public async cancelJob(jobId: string): Promise<boolean> {
    const job = this.activeJobs.get(jobId);
    if (!job) return false;

    job.status = 'cancelled';
    await this.updateJobStatus(job);
    this.activeJobs.delete(jobId);

    return true;
  }

  private async updateJobStatus(job: BackupJob | RestoreJob): Promise<void> {
    if ('configId' in job) {
      // BackupJob
      await prisma.backupJob.upsert({
        where: { id: job.id },
        create: {
          id: job.id,
          configId: job.configId,
          status: job.status,
          startTime: job.startTime,
          endTime: job.endTime,
          duration: job.duration,
          totalRecords: job.totalRecords,
          processedRecords: job.processedRecords,
          fileSize: job.fileSize,
          filePath: job.filePath,
          checksum: job.checksum,
          errorMessage: job.errorMessage,
          triggeredBy: job.triggeredBy,
          userId: job.userId,
          metadata: JSON.stringify(job.metadata)
        },
        update: {
          status: job.status,
          endTime: job.endTime,
          duration: job.duration,
          processedRecords: job.processedRecords,
          fileSize: job.fileSize,
          checksum: job.checksum,
          errorMessage: job.errorMessage
        }
      });
    } else {
      // RestoreJob
      await prisma.restoreJob.upsert({
        where: { id: job.id },
        create: {
          id: job.id,
          backupJobId: job.backupJobId,
          status: job.status,
          startTime: job.startTime,
          endTime: job.endTime,
          duration: job.duration,
          totalRecords: job.totalRecords,
          processedRecords: job.processedRecords,
          restoreType: job.restoreType,
          selectedTables: job.selectedTables ? JSON.stringify(job.selectedTables) : null,
          selectedModules: job.selectedModules ? JSON.stringify(job.selectedModules) : null,
          targetDatabase: job.targetDatabase,
          overwriteExisting: job.overwriteExisting,
          createBackupBefore: job.createBackupBefore,
          errorMessage: job.errorMessage,
          userId: job.userId,
          progress: JSON.stringify(job.progress)
        },
        update: {
          status: job.status,
          endTime: job.endTime,
          duration: job.duration,
          processedRecords: job.processedRecords,
          errorMessage: job.errorMessage,
          progress: JSON.stringify(job.progress)
        }
      });
    }
  }

  private async persistConfig(config: BackupConfig): Promise<void> {
    await prisma.backupConfig.upsert({
      where: { id: config.id },
      create: {
        id: config.id,
        name: config.name,
        description: config.description,
        schedule: JSON.stringify(config.schedule),
        includedModules: JSON.stringify(config.includedModules),
        includedTables: JSON.stringify(config.includedTables),
        excludedTables: JSON.stringify(config.excludedTables),
        compression: config.compression,
        encryption: config.encryption,
        retentionDays: config.retentionDays,
        destination: JSON.stringify(config.destination),
        active: config.active,
        createdBy: config.createdBy,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt
      },
      update: {
        name: config.name,
        description: config.description,
        schedule: JSON.stringify(config.schedule),
        includedModules: JSON.stringify(config.includedModules),
        includedTables: JSON.stringify(config.includedTables),
        excludedTables: JSON.stringify(config.excludedTables),
        compression: config.compression,
        encryption: config.encryption,
        retentionDays: config.retentionDays,
        destination: JSON.stringify(config.destination),
        active: config.active,
        updatedAt: config.updatedAt
      }
    });
  }
}

// Export singleton instance
export const backupService = BackupService.getInstance();