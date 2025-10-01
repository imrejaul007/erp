'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  SyncEvent,
  SyncStatus,
  SyncEventType,
  WebSocketMessage,
  WebSocketEventType,
  Store
} from '@/types/store';
import {
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Wifi,
  WifiOff,
  Activity,
  Database,
  ShoppingCart,
  DollarSign,
  Package,
  Bell,
  Settings,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface InventorySyncProps {
  syncEvents: SyncEvent[];
  stores: Store[];
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onRetrySync: (eventId: string) => void;
  onToggleAutoSync: (enabled: boolean) => void;
  autoSyncEnabled: boolean;
}

const getSyncStatusColor = (status: SyncStatus) => {
  switch (status) {
    case SyncStatus.PENDING:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case SyncStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case SyncStatus.COMPLETED:
      return 'bg-green-100 text-green-800 border-green-200';
    case SyncStatus.FAILED:
      return 'bg-red-100 text-red-800 border-red-200';
    case SyncStatus.RETRY:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSyncStatusIcon = (status: SyncStatus) => {
  switch (status) {
    case SyncStatus.PENDING:
      return <Clock className="h-4 w-4" />;
    case SyncStatus.IN_PROGRESS:
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    case SyncStatus.COMPLETED:
      return <CheckCircle className="h-4 w-4" />;
    case SyncStatus.FAILED:
      return <XCircle className="h-4 w-4" />;
    case SyncStatus.RETRY:
      return <RotateCcw className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getEventTypeIcon = (type: SyncEventType) => {
  switch (type) {
    case SyncEventType.INVENTORY_UPDATE:
      return <Package className="h-4 w-4" />;
    case SyncEventType.PRICE_UPDATE:
      return <DollarSign className="h-4 w-4" />;
    case SyncEventType.PROMOTION_UPDATE:
      return <ShoppingCart className="h-4 w-4" />;
    case SyncEventType.TRANSFER_UPDATE:
      return <RefreshCw className="h-4 w-4" />;
    case SyncEventType.STORE_UPDATE:
      return <Database className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

export default function InventorySync({
  syncEvents,
  stores,
  isConnected,
  onConnect,
  onDisconnect,
  onRetrySync,
  onToggleAutoSync,
  autoSyncEnabled
}: InventorySyncProps) {
  const [realtimeEvents, setRealtimeEvents] = useState<WebSocketMessage[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SyncEvent | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    if (isConnected) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isConnected]);

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // In a real implementation, this would connect to your WebSocket server
      // For demo purposes, we'll simulate a connection
      const wsUrl = process.env.NODE_ENV === 'production'
        ? 'wss://your-domain.com/ws'
        : 'ws://localhost:3001/ws';

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setConnectionAttempts(0);
        toast.success('Real-time sync connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        handleReconnection();
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Real-time sync connection error');
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      handleReconnection();
    }
  };

  const disconnectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handleReconnection = () => {
    if (connectionAttempts < 5 && isConnected) {
      const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000);
      reconnectTimeoutRef.current = setTimeout(() => {
        setConnectionAttempts(prev => prev + 1);
        connectWebSocket();
      }, delay);
    }
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    setRealtimeEvents(prev => [message, ...prev.slice(0, 99)]); // Keep last 100 events
    setLastSyncTime(new Date());

    switch (message.type) {
      case WebSocketEventType.INVENTORY_UPDATED:
        toast.info(`Inventory updated: ${message.payload.productName} at ${message.payload.storeName}`);
        break;
      case WebSocketEventType.TRANSFER_STATUS_CHANGED:
        toast.info(`Transfer #${message.payload.transferNumber} status: ${message.payload.status}`);
        break;
      case WebSocketEventType.PRICE_UPDATED:
        toast.info(`Price updated: ${message.payload.productName}`);
        break;
      case WebSocketEventType.PROMOTION_UPDATED:
        toast.info(`Promotion updated: ${message.payload.promotionName}`);
        break;
      case WebSocketEventType.STORE_ALERT:
        toast.warning(`Store Alert: ${message.payload.message}`);
        break;
      case WebSocketEventType.SYNC_COMPLETED:
        setSyncProgress(100);
        setTimeout(() => setSyncProgress(0), 2000);
        break;
    }
  };

  const getEventSummary = () => {
    const total = syncEvents.length;
    const completed = syncEvents.filter(e => e.status === SyncStatus.COMPLETED).length;
    const failed = syncEvents.filter(e => e.status === SyncStatus.FAILED).length;
    const inProgress = syncEvents.filter(e => e.status === SyncStatus.IN_PROGRESS).length;

    return { total, completed, failed, inProgress };
  };

  const { total, completed, failed, inProgress } = getEventSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-time Sync</h1>
          <p className="text-muted-foreground">
            Monitor and manage real-time data synchronization across all stores
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={autoSyncEnabled}
              onCheckedChange={onToggleAutoSync}
            />
            <span className="text-sm">Auto-sync</span>
          </div>
          {isConnected ? (
            <Button variant="outline" onClick={onDisconnect}>
              <WifiOff className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          ) : (
            <Button onClick={onConnect}>
              <Wifi className="mr-2 h-4 w-4" />
              Connect
            </Button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <Wifi className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <WifiOff className="h-5 w-5 text-red-600" />
              </div>
            )}
            Connection Status
          </CardTitle>
          <CardDescription>
            Real-time synchronization connection status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              <p className="text-sm text-muted-foreground">
                {isConnected ? 'Real-time updates active' : 'Manual sync only'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{realtimeEvents.length}</div>
              <p className="text-sm text-muted-foreground">Real-time events</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stores.length}</div>
              <p className="text-sm text-muted-foreground">Connected stores</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {lastSyncTime.toLocaleTimeString()}
              </div>
              <p className="text-sm text-muted-foreground">Last sync</p>
            </div>
          </div>

          {syncProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Sync Progress</span>
                <span className="text-sm">{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sync Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              Across all stores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completed}</div>
            <p className="text-xs text-muted-foreground">
              {total > 0 ? ((completed / total) * 100).toFixed(1) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Currently syncing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failed}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Events Feed */}
      {realtimeEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Live Events Feed
            </CardTitle>
            <CardDescription>
              Real-time updates from across your store network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {realtimeEvents.slice(0, 10).map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <div className="flex items-center gap-2">
                    {getEventTypeIcon(event.type as any)}
                    <span className="font-medium text-sm">
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      {event.payload.message || 'Event processed successfully'}
                    </p>
                    {event.storeId && (
                      <p className="text-xs text-muted-foreground">
                        Store: {stores.find(s => s.id === event.storeId)?.name || 'Unknown'}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync Events History */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Events History</CardTitle>
          <CardDescription>
            Recent synchronization events and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncEvents.slice(0, 20).map((event) => {
                const store = event.storeId ? stores.find(s => s.id === event.storeId) : null;
                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEventTypeIcon(event.type)}
                        <span className="font-medium">
                          {event.type.replace('_', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.entityType}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.entityId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {store ? (
                        <div>
                          <div className="font-medium">{store.name}</div>
                          <div className="text-sm text-muted-foreground">{store.code}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">All Stores</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getSyncStatusColor(event.status)}>
                        {getSyncStatusIcon(event.status)}
                        <span className="ml-1">{event.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedEvent(event)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Sync Event Details</DialogTitle>
                              <DialogDescription>
                                {event.type.replace('_', ' ')} - {event.status}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Event ID</label>
                                  <p className="font-medium">{event.id}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                                  <p className="font-medium">{event.type}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                                  <p className="font-medium">{event.entityType}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Entity ID</label>
                                  <p className="font-medium">{event.entityId}</p>
                                </div>
                              </div>

                              {event.data && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Data</label>
                                  <pre className="mt-1 p-3 bg-muted rounded text-xs overflow-x-auto">
                                    {JSON.stringify(event.data, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {event.error && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Error</label>
                                  <p className="mt-1 text-red-600 text-sm">{event.error}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {event.status === SyncStatus.FAILED && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRetrySync(event.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {syncEvents.length === 0 && (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No sync events</h3>
              <p className="text-muted-foreground">
                Synchronization events will appear here once they start
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Store Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle>Store Sync Status</CardTitle>
          <CardDescription>
            Synchronization status for each store location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => {
              const storeEvents = syncEvents.filter(e => e.storeId === store.id);
              const lastSync = storeEvents.length > 0
                ? Math.max(...storeEvents.map(e => new Date(e.timestamp).getTime()))
                : null;
              const failedEvents = storeEvents.filter(e => e.status === SyncStatus.FAILED).length;

              return (
                <Card key={store.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isConnected && failedEvents === 0 ? (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      ) : failedEvents > 0 ? (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      )}
                      <span className="font-medium">{store.name}</span>
                    </div>
                    <Badge variant="outline">{store.code}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Events:</span>
                      <span className="font-medium">{storeEvents.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Failed:</span>
                      <span className={`font-medium ${failedEvents > 0 ? 'text-red-600' : ''}`}>
                        {failedEvents}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="font-medium">
                        {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}