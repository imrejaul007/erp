import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { prisma } from '@/lib/prisma';
import { AuditService } from './audit-service';

export interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete';
  module: string;
  entity: string;
  entityId: string;
  data: any;
  userId: string;
  timestamp: Date;
  version: number;
}

export interface SyncSubscription {
  userId: string;
  modules: string[];
  entities: string[];
  socketId: string;
}

export class SyncService {
  private io: SocketIOServer;
  private subscriptions: Map<string, SyncSubscription> = new Map();
  private eventQueue: Map<string, SyncEvent[]> = new Map();
  private conflictResolvers: Map<string, (events: SyncEvent[]) => SyncEvent> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      },
      transports: ['websocket', 'polling']
    });

    this.setupSocketHandlers();
    this.setupConflictResolvers();
    this.startSyncProcessor();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('subscribe', async (data: {
        userId: string;
        modules: string[];
        entities: string[];
        token: string;
      }) => {
        try {
          // Verify authentication token
          if (!await this.verifyToken(data.token, data.userId)) {
            socket.emit('error', { message: 'Invalid authentication token' });
            return;
          }

          // Create subscription
          const subscription: SyncSubscription = {
            userId: data.userId,
            modules: data.modules,
            entities: data.entities,
            socketId: socket.id
          };

          this.subscriptions.set(socket.id, subscription);
          socket.join(`user:${data.userId}`);

          // Join module-specific rooms
          data.modules.forEach(module => {
            socket.join(`module:${module}`);
          });

          // Send current state for subscribed entities
          await this.sendInitialState(socket, subscription);

          socket.emit('subscribed', {
            modules: data.modules,
            entities: data.entities,
            timestamp: new Date()
          });

          // Log subscription
          await AuditService.logActivity({
            userId: data.userId,
            action: 'sync_subscribe',
            module: 'sync',
            details: { modules: data.modules, entities: data.entities },
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Subscription error:', error);
          socket.emit('error', { message: 'Subscription failed' });
        }
      });

      socket.on('sync_event', async (event: SyncEvent) => {
        try {
          const subscription = this.subscriptions.get(socket.id);
          if (!subscription) {
            socket.emit('error', { message: 'Not subscribed' });
            return;
          }

          // Validate event
          if (!this.validateSyncEvent(event, subscription)) {
            socket.emit('error', { message: 'Invalid sync event' });
            return;
          }

          // Process the sync event
          await this.processSyncEvent(event);

          socket.emit('sync_ack', { eventId: event.id, timestamp: new Date() });
        } catch (error) {
          console.error('Sync event error:', error);
          socket.emit('sync_error', { eventId: event.id, error: error.message });
        }
      });

      socket.on('get_conflicts', async (data: { module: string; entityId: string }) => {
        try {
          const subscription = this.subscriptions.get(socket.id);
          if (!subscription) {
            socket.emit('error', { message: 'Not subscribed' });
            return;
          }

          const conflicts = await this.getConflicts(data.module, data.entityId);
          socket.emit('conflicts', conflicts);
        } catch (error) {
          console.error('Get conflicts error:', error);
          socket.emit('error', { message: 'Failed to get conflicts' });
        }
      });

      socket.on('resolve_conflict', async (data: {
        conflictId: string;
        resolution: 'local' | 'remote' | 'merge';
        mergedData?: any;
      }) => {
        try {
          const subscription = this.subscriptions.get(socket.id);
          if (!subscription) {
            socket.emit('error', { message: 'Not subscribed' });
            return;
          }

          await this.resolveConflict(data.conflictId, data.resolution, data.mergedData);
          socket.emit('conflict_resolved', { conflictId: data.conflictId });
        } catch (error) {
          console.error('Resolve conflict error:', error);
          socket.emit('error', { message: 'Failed to resolve conflict' });
        }
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.subscriptions.delete(socket.id);
      });
    });
  }

  private setupConflictResolvers() {
    // Last-write-wins resolver
    this.conflictResolvers.set('last_write_wins', (events: SyncEvent[]) => {
      return events.reduce((latest, current) =>
        current.timestamp > latest.timestamp ? current : latest
      );
    });

    // Merge resolver for specific data types
    this.conflictResolvers.set('merge', (events: SyncEvent[]) => {
      const baseEvent = events[0];
      const mergedData = { ...baseEvent.data };

      for (let i = 1; i < events.length; i++) {
        Object.assign(mergedData, events[i].data);
      }

      return {
        ...baseEvent,
        data: mergedData,
        timestamp: new Date()
      };
    });
  }

  private async sendInitialState(socket: any, subscription: SyncSubscription) {
    try {
      for (const module of subscription.modules) {
        for (const entity of subscription.entities) {
          const data = await this.getEntityData(module, entity, subscription.userId);
          socket.emit('initial_state', {
            module,
            entity,
            data,
            timestamp: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Send initial state error:', error);
    }
  }

  private async getEntityData(module: string, entity: string, userId: string): Promise<any[]> {
    // This would be implemented based on your specific data models
    // For now, return empty array
    return [];
  }

  private validateSyncEvent(event: SyncEvent, subscription: SyncSubscription): boolean {
    return (
      subscription.modules.includes(event.module) &&
      subscription.entities.includes(event.entity) &&
      event.userId === subscription.userId &&
      ['create', 'update', 'delete'].includes(event.type)
    );
  }

  private async processSyncEvent(event: SyncEvent) {
    try {
      // Store event in database for persistence
      await prisma.syncEvent.create({
        data: {
          id: event.id,
          type: event.type,
          module: event.module,
          entity: event.entity,
          entityId: event.entityId,
          data: JSON.stringify(event.data),
          userId: event.userId,
          timestamp: event.timestamp,
          version: event.version
        }
      });

      // Check for conflicts
      const conflicts = await this.checkConflicts(event);
      if (conflicts.length > 0) {
        // Queue for conflict resolution
        this.eventQueue.set(event.id, [event, ...conflicts]);
        this.notifyConflict(event, conflicts);
      } else {
        // Apply event immediately
        await this.applyEvent(event);
        this.broadcastEvent(event);
      }

      // Log sync event
      await AuditService.logActivity({
        userId: event.userId,
        action: 'sync_event_processed',
        module: 'sync',
        details: {
          eventType: event.type,
          targetModule: event.module,
          entity: event.entity,
          entityId: event.entityId
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Process sync event error:', error);
      throw error;
    }
  }

  private async checkConflicts(event: SyncEvent): Promise<SyncEvent[]> {
    try {
      // Find concurrent events for the same entity
      const conflictingEvents = await prisma.syncEvent.findMany({
        where: {
          module: event.module,
          entity: event.entity,
          entityId: event.entityId,
          timestamp: {
            gte: new Date(event.timestamp.getTime() - 5000), // 5 second window
            lte: new Date(event.timestamp.getTime() + 5000)
          },
          id: { not: event.id }
        }
      });

      return conflictingEvents.map(e => ({
        id: e.id,
        type: e.type as 'create' | 'update' | 'delete',
        module: e.module,
        entity: e.entity,
        entityId: e.entityId,
        data: JSON.parse(e.data),
        userId: e.userId,
        timestamp: e.timestamp,
        version: e.version
      }));
    } catch (error) {
      console.error('Check conflicts error:', error);
      return [];
    }
  }

  private async applyEvent(event: SyncEvent) {
    // This would implement the actual data changes
    // Based on the module and entity type
    console.log('Applying event:', event);
  }

  private broadcastEvent(event: SyncEvent) {
    // Broadcast to all subscribers of this module
    this.io.to(`module:${event.module}`).emit('sync_update', {
      type: event.type,
      module: event.module,
      entity: event.entity,
      entityId: event.entityId,
      data: event.data,
      timestamp: event.timestamp,
      userId: event.userId
    });
  }

  private notifyConflict(event: SyncEvent, conflicts: SyncEvent[]) {
    this.io.to(`user:${event.userId}`).emit('sync_conflict', {
      eventId: event.id,
      conflicts: conflicts,
      timestamp: new Date()
    });
  }

  private async verifyToken(token: string, userId: string): Promise<boolean> {
    // Implement token verification logic
    // This would typically verify JWT tokens
    return true; // Placeholder
  }

  private async getConflicts(module: string, entityId: string): Promise<SyncEvent[]> {
    try {
      const conflicts = await prisma.syncEvent.findMany({
        where: {
          module,
          entityId,
          // Add conflict detection logic
        },
        orderBy: { timestamp: 'desc' }
      });

      return conflicts.map(e => ({
        id: e.id,
        type: e.type as 'create' | 'update' | 'delete',
        module: e.module,
        entity: e.entity,
        entityId: e.entityId,
        data: JSON.parse(e.data),
        userId: e.userId,
        timestamp: e.timestamp,
        version: e.version
      }));
    } catch (error) {
      console.error('Get conflicts error:', error);
      return [];
    }
  }

  private async resolveConflict(conflictId: string, resolution: string, mergedData?: any) {
    try {
      const queuedEvents = this.eventQueue.get(conflictId);
      if (!queuedEvents) {
        throw new Error('Conflict not found');
      }

      let resolvedEvent: SyncEvent;

      switch (resolution) {
        case 'local':
          resolvedEvent = queuedEvents[0];
          break;
        case 'remote':
          resolvedEvent = queuedEvents[queuedEvents.length - 1];
          break;
        case 'merge':
          if (!mergedData) {
            const resolver = this.conflictResolvers.get('merge');
            resolvedEvent = resolver ? resolver(queuedEvents) : queuedEvents[0];
          } else {
            resolvedEvent = {
              ...queuedEvents[0],
              data: mergedData,
              timestamp: new Date()
            };
          }
          break;
        default:
          throw new Error('Invalid resolution type');
      }

      // Apply resolved event
      await this.applyEvent(resolvedEvent);
      this.broadcastEvent(resolvedEvent);

      // Remove from queue
      this.eventQueue.delete(conflictId);

      // Log resolution
      await AuditService.logActivity({
        userId: resolvedEvent.userId,
        action: 'conflict_resolved',
        module: 'sync',
        details: {
          conflictId,
          resolution,
          eventType: resolvedEvent.type,
          targetModule: resolvedEvent.module
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Resolve conflict error:', error);
      throw error;
    }
  }

  private startSyncProcessor() {
    // Process queued events periodically
    setInterval(async () => {
      for (const [eventId, events] of this.eventQueue.entries()) {
        if (events.length > 0) {
          // Auto-resolve using last-write-wins after 30 seconds
          const oldestEvent = events[0];
          const timeDiff = Date.now() - oldestEvent.timestamp.getTime();
          if (timeDiff > 30000) {
            const resolver = this.conflictResolvers.get('last_write_wins');
            if (resolver) {
              const resolvedEvent = resolver(events);
              await this.applyEvent(resolvedEvent);
              this.broadcastEvent(resolvedEvent);
              this.eventQueue.delete(eventId);
            }
          }
        }
      }
    }, 10000); // Check every 10 seconds
  }

  // Public methods for manual sync operations
  public async forceSync(userId: string, module: string, entity: string): Promise<void> {
    const userSocket = Array.from(this.subscriptions.entries()).find(
      ([_, sub]) => sub.userId === userId
    );

    if (userSocket) {
      const [socketId, subscription] = userSocket;
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        await this.sendInitialState(socket, subscription);
      }
    }
  }

  public getActiveSubscriptions(): SyncSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  public async getSyncStats(): Promise<{
    activeConnections: number;
    queuedEvents: number;
    processedEvents: number;
  }> {
    const processedEvents = await prisma.syncEvent.count();

    return {
      activeConnections: this.subscriptions.size,
      queuedEvents: this.eventQueue.size,
      processedEvents
    };
  }
}