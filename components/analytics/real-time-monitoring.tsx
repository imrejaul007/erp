'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Settings,
  Bell,
  BellOff,
  Monitor,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TimeSeriesData } from '@/types/analytics';

interface RealTimeMonitoringProps {
  wsUrl?: string;
  refreshInterval?: number;
  maxDataPoints?: number;
}

interface LiveMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change?: number;
  status: 'normal' | 'warning' | 'critical';
  timestamp: Date;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface LiveEvent {
  id: string;
  event: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export default function RealTimeMonitoring({
  wsUrl = 'ws://localhost:3001/ws',
  refreshInterval = 5000,
  maxDataPoints = 50
}: RealTimeMonitoringProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Live metrics
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);

  // Time series data for charts
  const [salesData, setSalesData] = useState<TimeSeriesData[]>([]);
  const [inventoryData, setInventoryData] = useState<TimeSeriesData[]>([]);
  const [userActivityData, setUserActivityData] = useState<TimeSeriesData[]>([]);

  // WebSocket and polling refs
  const wsRef = useRef<WebSocket | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize metrics with default values
  const initializeMetrics = useCallback(() => {
    const initialMetrics: LiveMetric[] = [
      {
        id: 'active_users',
        name: 'Active Users',
        value: 0,
        unit: 'users',
        status: 'normal',
        timestamp: new Date(),
      },
      {
        id: 'live_orders',
        name: 'Live Orders',
        value: 0,
        unit: 'orders/min',
        status: 'normal',
        timestamp: new Date(),
      },
      {
        id: 'system_load',
        name: 'System Load',
        value: 0,
        unit: '%',
        status: 'normal',
        timestamp: new Date(),
      },
      {
        id: 'inventory_alerts',
        name: 'Inventory Alerts',
        value: 0,
        unit: 'alerts',
        status: 'normal',
        timestamp: new Date(),
      },
    ];
    setLiveMetrics(initialMetrics);
  }, []);

  // Mock data generator (replace with actual WebSocket data)
  const generateMockData = useCallback(() => {
    const now = new Date();

    // Update live metrics
    setLiveMetrics(prev => prev.map(metric => {
      let newValue: number;
      let status: 'normal' | 'warning' | 'critical' = 'normal';

      switch (metric.id) {
        case 'active_users':
          newValue = Math.floor(Math.random() * 50) + 100;
          break;
        case 'live_orders':
          newValue = Math.floor(Math.random() * 20) + 10;
          break;
        case 'system_load':
          newValue = Math.random() * 100;
          status = newValue > 90 ? 'critical' : newValue > 70 ? 'warning' : 'normal';
          break;
        case 'inventory_alerts':
          newValue = Math.floor(Math.random() * 10);
          status = newValue > 5 ? 'warning' : 'normal';
          break;
        default:
          newValue = metric.value + (Math.random() - 0.5) * 10;
      }

      const change = metric.value !== 0 ? ((newValue - metric.value) / metric.value) * 100 : 0;

      return {
        ...metric,
        value: Math.max(0, newValue),
        change,
        status,
        timestamp: now,
      };
    }));

    // Update time series data
    const timestamp = now.toISOString();

    setSalesData(prev => {
      const newData = [...prev, {
        timestamp,
        value: Math.floor(Math.random() * 1000) + 2000,
      }].slice(-maxDataPoints);
      return newData;
    });

    setInventoryData(prev => {
      const newData = [...prev, {
        timestamp,
        value: Math.floor(Math.random() * 50) + 200,
      }].slice(-maxDataPoints);
      return newData;
    });

    setUserActivityData(prev => {
      const newData = [...prev, {
        timestamp,
        value: Math.floor(Math.random() * 30) + 80,
      }].slice(-maxDataPoints);
      return newData;
    });

    // Generate random events
    if (Math.random() < 0.1) { // 10% chance of new event
      const events = [
        'New order placed',
        'Inventory updated',
        'User logged in',
        'Payment processed',
        'Stock alert triggered',
        'Quality check completed',
      ];

      const newEvent: LiveEvent = {
        id: `event_${Date.now()}_${Math.random()}`,
        event: events[Math.floor(Math.random() * events.length)],
        description: 'System generated event',
        timestamp: now,
        metadata: { source: 'system' },
      };

      setLiveEvents(prev => [newEvent, ...prev.slice(0, 19)]); // Keep last 20 events
    }

    // Generate alerts for critical metrics
    liveMetrics.forEach(metric => {
      if (metric.status === 'critical' && Math.random() < 0.3) {
        const newAlert: SystemAlert = {
          id: `alert_${Date.now()}_${metric.id}`,
          type: 'error',
          message: `${metric.name} is critically high: ${metric.value.toFixed(1)}${metric.unit}`,
          timestamp: now,
          acknowledged: false,
        };

        setSystemAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts

        if (notificationsEnabled && 'Notification' in window) {
          new Notification('System Alert', {
            body: newAlert.message,
            icon: '/favicon.ico',
          });
        }
      }
    });
  }, [liveMetrics, maxDataPoints, notificationsEnabled]);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Handle different types of WebSocket messages
          switch (data.type) {
            case 'metrics':
              if (!isPaused) {
                setLiveMetrics(data.metrics);
              }
              break;
            case 'alert':
              setSystemAlerts(prev => [data.alert, ...prev.slice(0, 9)]);
              break;
            case 'event':
              setLiveEvents(prev => [data.event, ...prev.slice(0, 19)]);
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
      // Fall back to polling
      startPolling();
    }
  }, [wsUrl, isPaused]);

  // Polling fallback
  const startPolling = useCallback(() => {
    if (pollingRef.current) return;

    pollingRef.current = setInterval(() => {
      if (!isPaused) {
        generateMockData();
      }
    }, refreshInterval);
  }, [generateMockData, refreshInterval, isPaused]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Component lifecycle
  useEffect(() => {
    initializeMetrics();

    // Try WebSocket first, fall back to polling
    connectWebSocket();

    // Request notification permission
    if ('Notification' in window && notificationsEnabled) {
      Notification.requestPermission();
    }

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      stopPolling();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Start polling if WebSocket fails
  useEffect(() => {
    if (!isConnected) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [isConnected, startPolling, stopPolling]);

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit.includes('/')) return `${value.toFixed(0)} ${unit}`;
    return `${value.toFixed(0)} ${unit}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setSystemAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-oud-800">Real-time Monitoring</h2>
          <div className="flex items-center gap-2 mt-1">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Live Connection</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600">Polling Mode</span>
              </>
            )}
            <span className="text-xs text-oud-500">
              • Last update: {liveMetrics[0]?.timestamp.toLocaleTimeString() || 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            {notificationsEnabled ? (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Alerts On
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Alerts Off
              </>
            )}
          </Button>

          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Live Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveMetrics.map((metric) => (
          <Card key={metric.id} className={`card-luxury ${isPaused ? 'opacity-75' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-oud-600">{metric.name}</p>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-oud-800">
                  {formatValue(metric.value, metric.unit)}
                </p>

                {metric.change !== undefined && (
                  <div className={`flex items-center text-sm ${
                    metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : metric.change < 0 ? (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    ) : (
                      <Activity className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(metric.change).toFixed(1)}%
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Activity */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-oud-500" />
              Sales Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={salesData}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString().slice(0, 5)}
                />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <Tooltip
                  labelFormatter={(time) => new Date(time).toLocaleTimeString()}
                  formatter={(value: number) => [`${value}`, 'Sales']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8B4513"
                  fill="#8B4513"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Movement */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-oud-500" />
              Inventory Movement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={inventoryData}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString().slice(0, 5)}
                />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <Tooltip
                  labelFormatter={(time) => new Date(time).toLocaleTimeString()}
                  formatter={(value: number) => [`${value}`, 'Items']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#D2B48C"
                  strokeWidth={3}
                  dot={{ fill: '#D2B48C', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-oud-500" />
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={userActivityData}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString().slice(0, 5)}
                />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <Tooltip
                  labelFormatter={(time) => new Date(time).toLocaleTimeString()}
                  formatter={(value: number) => [`${value}`, 'Active Users']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#CD853F"
                  fill="#CD853F"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              System Alerts
              {systemAlerts.filter(alert => !alert.acknowledged).length > 0 && (
                <Badge className="bg-red-100 text-red-600">
                  {systemAlerts.filter(alert => !alert.acknowledged).length} new
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {systemAlerts.length === 0 ? (
                <p className="text-sm text-oud-600 text-center py-4">No alerts</p>
              ) : (
                systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      alert.acknowledged
                        ? 'bg-gray-50 border-gray-200 opacity-75'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-oud-800">{alert.message}</p>
                      <p className="text-xs text-oud-500">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-xs"
                      >
                        Ack
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Events */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-oud-500" />
              Live Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {liveEvents.length === 0 ? (
                <p className="text-sm text-oud-600 text-center py-4">No recent events</p>
              ) : (
                liveEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-oud-50 border border-oud-200"
                  >
                    <Activity className="h-4 w-4 text-oud-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-oud-800">{event.event}</p>
                      <p className="text-xs text-oud-600">{event.description}</p>
                      <p className="text-xs text-oud-500">
                        {event.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}