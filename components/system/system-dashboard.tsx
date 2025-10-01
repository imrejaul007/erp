'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  Network,
  RefreshCw,
  Server,
  Wifi,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { systemMonitor, SystemHealth, PerformanceMetrics, SystemStats, SystemAlert } from '@/lib/services/system-monitor';

interface SystemDashboardProps {
  refreshInterval?: number;
  userId?: string;
}

export function SystemDashboard({ refreshInterval = 30000, userId }: SystemDashboardProps) {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load system data
  const loadSystemData = useCallback(async () => {
    try {
      setLoading(true);

      const [healthData, metricsData, statsData, alertsData] = await Promise.all([
        systemMonitor.getSystemHealth(),
        systemMonitor.getPerformanceMetrics(),
        systemMonitor.getSystemStats(),
        systemMonitor.getSystemAlerts({ unacknowledged: true })
      ]);

      setHealth(healthData);
      setMetrics(metricsData);
      setStats(statsData);
      setAlerts(alertsData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load system data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadSystemData();
  }, [loadSystemData]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadSystemData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadSystemData]);

  // Handle alert acknowledgment
  const handleAcknowledgeAlert = async (alertId: string) => {
    if (!userId) return;

    try {
      await systemMonitor.acknowledgeAlert(alertId, userId);
      setAlerts(prev => prev.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true, acknowledgedBy: userId, acknowledgedAt: new Date() }
          : alert
      ));
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  // Handle alert resolution
  const handleResolveAlert = async (alertId: string) => {
    if (!userId) return;

    try {
      await systemMonitor.resolveAlert(alertId, userId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'offline':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  if (loading && !health) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading system data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time system monitoring and health status
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSystemData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      {health && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(health.overall)}
              <span>System Health</span>
              <Badge variant={health.overall === 'healthy' ? 'default' : 'destructive'}>
                {health.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(health.components).map(([name, component]) => {
                if (name === 'modules') return null;

                return (
                  <div
                    key={name}
                    className={`p-4 rounded-lg border ${getStatusColor(component.status)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {name === 'database' && <Database className="h-4 w-4" />}
                        {name === 'api' && <Server className="h-4 w-4" />}
                        {name === 'storage' && <HardDrive className="h-4 w-4" />}
                        {name === 'memory' && <MemoryStick className="h-4 w-4" />}
                        {name === 'cpu' && <Cpu className="h-4 w-4" />}
                        {name === 'network' && <Network className="h-4 w-4" />}
                        <span className="font-medium capitalize">{name}</span>
                      </div>
                      {getStatusIcon(component.status)}
                    </div>
                    <Progress value={component.score} className="mb-2" />
                    <div className="text-xs text-muted-foreground">
                      {component.responseTime && `${component.responseTime}ms`}
                      {component.errorRate && ` • ${component.errorRate}% errors`}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Active Alerts ({alerts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.slice(0, 5).map((alert) => (
              <Alert key={alert.id} className="border-l-4 border-l-red-500">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>{alert.title}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline">
                      {alert.component}
                    </Badge>
                  </div>
                </AlertTitle>
                <AlertDescription>
                  <p className="mb-2">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString()}
                    </span>
                    {userId && (
                      <div className="flex space-x-2">
                        {!alert.acknowledged && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatUptime(stats.uptime)}</div>
                  <p className="text-xs text-muted-foreground">
                    Since {stats.startTime.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    of {stats.totalUsers} total users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Data Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatBytes(stats.dataSize)}</div>
                  <p className="text-xs text-muted-foreground">
                    Backup: {formatBytes(stats.backupSize)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.errorCount} errors (24h)
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {metrics.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={metrics.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value) => [`${value}%`, 'CPU Usage']}
                      />
                      <Area
                        type="monotone"
                        dataKey="cpu.usage"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={metrics.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value) => [`${value}%`, 'Memory Usage']}
                      />
                      <Area
                        type="monotone"
                        dataKey="memory.percentage"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={metrics.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value) => [`${value}ms`, 'Response Time']}
                      />
                      <Line
                        type="monotone"
                        dataKey="api.averageResponseTime"
                        stroke="#ffc658"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={metrics.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value) => [value, 'Connections']}
                      />
                      <Line
                        type="monotone"
                        dataKey="database.connections"
                        stroke="#ff7300"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          {health?.components.modules && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(health.components.modules).map(([name, module]) => (
                <Card key={name}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{name}</span>
                      {getStatusIcon(module.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Health Score</span>
                          <span>{module.score}/100</span>
                        </div>
                        <Progress value={module.score} />
                      </div>

                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Error Rate:</span>
                          <span>{module.errorRate || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Check:</span>
                          <span>{module.lastCheck.toLocaleTimeString()}</span>
                        </div>
                        {module.metrics.recentActivity !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Activity (24h):</span>
                            <span>{module.metrics.recentActivity}</span>
                          </div>
                        )}
                      </div>

                      {module.message && (
                        <Alert>
                          <AlertDescription className="text-sm">
                            {module.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span className="font-mono">{stats.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment:</span>
                    <Badge variant="outline">{stats.environment}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started:</span>
                    <span>{stats.startTime.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span>{formatUptime(stats.uptime)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Module Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(stats.moduleStatus).map(([module, status]) => (
                    <div key={module} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="capitalize">{module}</span>
                        {status.status === 'healthy' ?
                          <CheckCircle className="h-4 w-4 text-green-500" /> :
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {status.activeUsers} users • {status.errorCount} errors
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}