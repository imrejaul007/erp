import { prisma } from '@/lib/prisma';
import { AuditService } from './audit-service';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  module: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
  actionRequired: boolean;
  actionUrl?: string;
  actionText?: string;
  channels: NotificationChannel[];
}

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'alert'
  | 'reminder'
  | 'approval'
  | 'system';

export type NotificationChannel =
  | 'in_app'
  | 'email'
  | 'sms'
  | 'push'
  | 'webhook'
  | 'slack';

export interface NotificationPreferences {
  userId: string;
  channels: Partial<Record<NotificationChannel, boolean>>;
  categories: Partial<Record<string, boolean>>;
  priorities: Partial<Record<'low' | 'medium' | 'high' | 'urgent', boolean>>;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
  frequency: 'immediate' | 'batched' | 'digest';
  digestSchedule?: 'daily' | 'weekly';
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  category: string;
  module: string;
  title: string;
  message: string;
  channels: NotificationChannel[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  variables: string[];
  active: boolean;
}

export interface NotificationRule {
  id: string;
  name: string;
  condition: string;
  templateId: string;
  targetUsers: string[];
  targetRoles: string[];
  enabled: boolean;
  throttle?: {
    maxPerUser: number;
    timeWindow: number; // in seconds
  };
}

export class NotificationService {
  private static instance: NotificationService;
  private subscribers: Map<string, Set<(notification: Notification) => void>> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private rules: Map<string, NotificationRule> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
    this.setupNotificationProcessing();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Send notification
  async sendNotification(
    userId: string | string[],
    notification: Omit<Notification, 'id' | 'userId' | 'read' | 'readAt' | 'createdAt'>
  ): Promise<string[]> {
    const userIds = Array.isArray(userId) ? userId : [userId];
    const notificationIds: string[] = [];

    for (const uid of userIds) {
      try {
        // Check user preferences
        const preferences = await this.getUserPreferences(uid);
        if (!this.shouldSendNotification(notification, preferences)) {
          continue;
        }

        // Create notification
        const notificationId = await this.createNotification(uid, notification);
        notificationIds.push(notificationId);

        // Send via enabled channels
        await this.sendViaChannels(uid, notification, preferences);

        // Trigger real-time subscribers
        this.notifySubscribers(uid, { ...notification, id: notificationId, userId: uid, read: false, createdAt: new Date() });

        // Log notification
        await AuditService.logActivity({
          userId: uid,
          action: 'notification_sent',
          module: 'notification',
          details: {
            notificationId,
            type: notification.type,
            category: notification.category,
            priority: notification.priority,
            channels: notification.channels
          },
          timestamp: new Date()
        });
      } catch (error) {
        console.error(`Failed to send notification to user ${uid}:`, error);
      }
    }

    return notificationIds;
  }

  // Send notification from template
  async sendFromTemplate(
    templateId: string,
    userId: string | string[],
    variables: Record<string, any> = {}
  ): Promise<string[]> {
    const template = this.templates.get(templateId);
    if (!template || !template.active) {
      throw new Error(`Template ${templateId} not found or inactive`);
    }

    const notification = this.renderTemplate(template, variables);
    return await this.sendNotification(userId, notification);
  }

  // Bulk notification
  async sendBulkNotification(
    notification: Omit<Notification, 'id' | 'userId' | 'read' | 'readAt' | 'createdAt'>,
    filters?: {
      roles?: string[];
      modules?: string[];
      departments?: string[];
      customFilter?: (user: any) => boolean;
    }
  ): Promise<string[]> {
    try {
      let users = await this.getEligibleUsers(filters);

      // Batch processing to avoid overwhelming the system
      const batchSize = 100;
      const notificationIds: string[] = [];

      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        const batchIds = await this.sendNotification(
          batch.map(u => u.id),
          notification
        );
        notificationIds.push(...batchIds);

        // Small delay between batches
        if (i + batchSize < users.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return notificationIds;
    } catch (error) {
      console.error('Bulk notification error:', error);
      throw error;
    }
  }

  // System alert
  async sendSystemAlert(
    message: string,
    priority: 'high' | 'urgent' = 'high',
    targetRoles: string[] = ['admin', 'manager']
  ): Promise<string[]> {
    const admins = await this.getUsersByRoles(targetRoles);

    return await this.sendNotification(
      admins.map(u => u.id),
      {
        type: 'alert',
        title: 'System Alert',
        message,
        priority,
        category: 'system',
        module: 'system',
        actionRequired: true,
        channels: ['in_app', 'email', 'push']
      }
    );
  }

  // Subscribe to real-time notifications
  subscribe(userId: string, callback: (notification: Notification) => void): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }
    this.subscribers.get(userId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const userSubscribers = this.subscribers.get(userId);
      if (userSubscribers) {
        userSubscribers.delete(callback);
        if (userSubscribers.size === 0) {
          this.subscribers.delete(userId);
        }
      }
    };
  }

  // Get user notifications
  async getUserNotifications(
    userId: string,
    options?: {
      unreadOnly?: boolean;
      category?: string;
      type?: NotificationType;
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }> {
    try {
      const where: any = { userId };

      if (options?.unreadOnly) where.read = false;
      if (options?.category) where.category = options.category;
      if (options?.type) where.type = options.type;

      const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: options?.limit || 50,
          skip: options?.offset || 0
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({ where: { userId, read: false } })
      ]);

      const formattedNotifications = notifications.map(n => ({
        id: n.id,
        userId: n.userId,
        type: n.type as NotificationType,
        title: n.title,
        message: n.message,
        data: n.data ? JSON.parse(n.data) : undefined,
        priority: n.priority as 'low' | 'medium' | 'high' | 'urgent',
        category: n.category,
        module: n.module,
        read: n.read,
        readAt: n.readAt,
        createdAt: n.createdAt,
        expiresAt: n.expiresAt,
        actionRequired: n.actionRequired,
        actionUrl: n.actionUrl,
        actionText: n.actionText,
        channels: JSON.parse(n.channels) as NotificationChannel[]
      }));

      return {
        notifications: formattedNotifications,
        total,
        unreadCount
      };
    } catch (error) {
      console.error('Get user notifications error:', error);
      return { notifications: [], total: 0, unreadCount: 0 };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { read: true, readAt: new Date() }
      });

      await AuditService.logActivity({
        userId,
        action: 'notification_read',
        module: 'notification',
        details: { notificationId },
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return false;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true, readAt: new Date() }
      });

      await AuditService.logActivity({
        userId,
        action: 'all_notifications_read',
        module: 'notification',
        details: { count: result.count },
        timestamp: new Date()
      });

      return result.count;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      return 0;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.deleteMany({
        where: { id: notificationId, userId }
      });

      await AuditService.logActivity({
        userId,
        action: 'notification_deleted',
        module: 'notification',
        details: { notificationId },
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      console.error('Delete notification error:', error);
      return false;
    }
  }

  // User preferences management
  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const preferences = await prisma.notificationPreference.findUnique({
        where: { userId }
      });

      if (!preferences) {
        return this.getDefaultPreferences(userId);
      }

      return {
        userId,
        channels: JSON.parse(preferences.channels),
        categories: JSON.parse(preferences.categories),
        priorities: JSON.parse(preferences.priorities),
        quietHours: JSON.parse(preferences.quietHours),
        frequency: preferences.frequency as 'immediate' | 'batched' | 'digest',
        digestSchedule: preferences.digestSchedule as 'daily' | 'weekly' | undefined
      };
    } catch (error) {
      console.error('Get user preferences error:', error);
      return this.getDefaultPreferences(userId);
    }
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<boolean> {
    try {
      const current = await this.getUserPreferences(userId);
      const updated = { ...current, ...preferences };

      await prisma.notificationPreference.upsert({
        where: { userId },
        create: {
          userId,
          channels: JSON.stringify(updated.channels),
          categories: JSON.stringify(updated.categories),
          priorities: JSON.stringify(updated.priorities),
          quietHours: JSON.stringify(updated.quietHours),
          frequency: updated.frequency,
          digestSchedule: updated.digestSchedule
        },
        update: {
          channels: JSON.stringify(updated.channels),
          categories: JSON.stringify(updated.categories),
          priorities: JSON.stringify(updated.priorities),
          quietHours: JSON.stringify(updated.quietHours),
          frequency: updated.frequency,
          digestSchedule: updated.digestSchedule
        }
      });

      await AuditService.logActivity({
        userId,
        action: 'notification_preferences_updated',
        module: 'notification',
        details: { preferences: updated },
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      console.error('Update user preferences error:', error);
      return false;
    }
  }

  // Template management
  async createTemplate(template: Omit<NotificationTemplate, 'id'>): Promise<string> {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.templates.set(id, { ...template, id });
    return id;
  }

  getTemplate(id: string): NotificationTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values());
  }

  // Rule management
  async createRule(rule: Omit<NotificationRule, 'id'>): Promise<string> {
    const id = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.rules.set(id, { ...rule, id });
    return id;
  }

  // Private helper methods
  private async createNotification(
    userId: string,
    notification: Omit<Notification, 'id' | 'userId' | 'read' | 'readAt' | 'createdAt'>
  ): Promise<string> {
    const created = await prisma.notification.create({
      data: {
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data ? JSON.stringify(notification.data) : null,
        priority: notification.priority,
        category: notification.category,
        module: notification.module,
        read: false,
        expiresAt: notification.expiresAt,
        actionRequired: notification.actionRequired || false,
        actionUrl: notification.actionUrl,
        actionText: notification.actionText,
        channels: JSON.stringify(notification.channels)
      }
    });

    return created.id;
  }

  private shouldSendNotification(
    notification: Omit<Notification, 'id' | 'userId' | 'read' | 'readAt' | 'createdAt'>,
    preferences: NotificationPreferences
  ): boolean {
    // Check category preferences
    if (preferences.categories[notification.category] === false) {
      return false;
    }

    // Check priority preferences
    if (preferences.priorities[notification.priority] === false) {
      return false;
    }

    // Check quiet hours
    if (preferences.quietHours.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      if (this.isInQuietHours(currentTime, preferences.quietHours)) {
        // Allow urgent notifications during quiet hours
        return notification.priority === 'urgent';
      }
    }

    return true;
  }

  private isInQuietHours(currentTime: string, quietHours: NotificationPreferences['quietHours']): boolean {
    const current = this.timeToMinutes(currentTime);
    const start = this.timeToMinutes(quietHours.start);
    const end = this.timeToMinutes(quietHours.end);

    if (start <= end) {
      return current >= start && current <= end;
    } else {
      // Quiet hours span midnight
      return current >= start || current <= end;
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private async sendViaChannels(
    userId: string,
    notification: Omit<Notification, 'id' | 'userId' | 'read' | 'readAt' | 'createdAt'>,
    preferences: NotificationPreferences
  ): Promise<void> {
    for (const channel of notification.channels) {
      if (preferences.channels[channel] !== false) {
        try {
          await this.sendViaChannel(userId, notification, channel);
        } catch (error) {
          console.error(`Failed to send notification via ${channel}:`, error);
        }
      }
    }
  }

  private async sendViaChannel(
    userId: string,
    notification: Omit<Notification, 'id' | 'userId' | 'read' | 'readAt' | 'createdAt'>,
    channel: NotificationChannel
  ): Promise<void> {
    switch (channel) {
      case 'email':
        await this.sendEmail(userId, notification);
        break;
      case 'sms':
        await this.sendSMS(userId, notification);
        break;
      case 'push':
        await this.sendPush(userId, notification);
        break;
      case 'webhook':
        await this.sendWebhook(userId, notification);
        break;
      case 'slack':
        await this.sendSlack(userId, notification);
        break;
      case 'in_app':
        // Already handled by storing in database
        break;
    }
  }

  private async sendEmail(userId: string, notification: any): Promise<void> {
    // Email implementation would go here
    console.log('Sending email notification:', { userId, notification });
  }

  private async sendSMS(userId: string, notification: any): Promise<void> {
    // SMS implementation would go here
    console.log('Sending SMS notification:', { userId, notification });
  }

  private async sendPush(userId: string, notification: any): Promise<void> {
    // Push notification implementation would go here
    console.log('Sending push notification:', { userId, notification });
  }

  private async sendWebhook(userId: string, notification: any): Promise<void> {
    // Webhook implementation would go here
    console.log('Sending webhook notification:', { userId, notification });
  }

  private async sendSlack(userId: string, notification: any): Promise<void> {
    // Slack implementation would go here
    console.log('Sending Slack notification:', { userId, notification });
  }

  private notifySubscribers(userId: string, notification: Notification): void {
    const userSubscribers = this.subscribers.get(userId);
    if (userSubscribers) {
      userSubscribers.forEach(callback => {
        try {
          callback(notification);
        } catch (error) {
          console.error('Notification subscriber error:', error);
        }
      });
    }
  }

  private renderTemplate(
    template: NotificationTemplate,
    variables: Record<string, any>
  ): Omit<Notification, 'id' | 'userId' | 'read' | 'readAt' | 'createdAt'> {
    let title = template.title;
    let message = template.message;

    // Replace variables in title and message
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      title = title.replace(new RegExp(placeholder, 'g'), String(value));
      message = message.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return {
      type: template.type,
      title,
      message,
      priority: template.priority,
      category: template.category,
      module: template.module,
      channels: template.channels,
      actionRequired: false,
      data: variables
    };
  }

  private getDefaultPreferences(userId: string): NotificationPreferences {
    return {
      userId,
      channels: {
        in_app: true,
        email: true,
        push: true,
        sms: false,
        webhook: false,
        slack: false
      },
      categories: {},
      priorities: {
        low: true,
        medium: true,
        high: true,
        urgent: true
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
        timezone: 'UTC'
      },
      frequency: 'immediate'
    };
  }

  private async getEligibleUsers(filters?: any): Promise<any[]> {
    // This would query your user database based on filters
    // For now, return empty array
    return [];
  }

  private async getUsersByRoles(roles: string[]): Promise<any[]> {
    // This would query users by their roles
    // For now, return empty array
    return [];
  }

  private initializeDefaultTemplates(): void {
    // Initialize default notification templates
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'inventory_low_stock',
        name: 'Low Stock Alert',
        type: 'warning',
        category: 'inventory',
        module: 'inventory',
        title: 'Low Stock Alert',
        message: 'Product {{productName}} is running low. Current stock: {{currentStock}}, Minimum: {{minimumStock}}',
        channels: ['in_app', 'email'],
        priority: 'medium',
        variables: ['productName', 'currentStock', 'minimumStock'],
        active: true
      },
      {
        id: 'sale_completed',
        name: 'Sale Completed',
        type: 'success',
        category: 'sales',
        module: 'sales',
        title: 'Sale Completed',
        message: 'Sale #{{saleId}} has been completed successfully. Total: {{totalAmount}}',
        channels: ['in_app'],
        priority: 'low',
        variables: ['saleId', 'totalAmount'],
        active: true
      },
      {
        id: 'system_maintenance',
        name: 'System Maintenance',
        type: 'alert',
        category: 'system',
        module: 'system',
        title: 'Scheduled Maintenance',
        message: 'System maintenance is scheduled for {{maintenanceDate}} from {{startTime}} to {{endTime}}.',
        channels: ['in_app', 'email', 'push'],
        priority: 'high',
        variables: ['maintenanceDate', 'startTime', 'endTime'],
        active: true
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private setupNotificationProcessing(): void {
    // Clean up expired notifications every hour
    setInterval(async () => {
      try {
        await this.cleanupExpiredNotifications();
      } catch (error) {
        console.error('Cleanup expired notifications error:', error);
      }
    }, 60 * 60 * 1000);

    // Process digest notifications daily
    setInterval(async () => {
      try {
        await this.processDigestNotifications();
      } catch (error) {
        console.error('Process digest notifications error:', error);
      }
    }, 24 * 60 * 60 * 1000);
  }

  private async cleanupExpiredNotifications(): Promise<void> {
    const now = new Date();
    await prisma.notification.deleteMany({
      where: {
        expiresAt: { lte: now }
      }
    });
  }

  private async processDigestNotifications(): Promise<void> {
    // Process digest notifications for users who opted for daily/weekly digests
    // Implementation would aggregate notifications and send digests
    console.log('Processing digest notifications');
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();