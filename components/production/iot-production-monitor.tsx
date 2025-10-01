'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RechartsTooltip
} from 'recharts';
import {
  Cpu,
  Thermometer,
  Droplets,
  Gauge,
  Zap,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Radio,
  Settings,
  Bell,
  BarChart3,
  Eye,
  Shield,
  Database,
  Cloud,
  Smartphone
} from 'lucide-react';
import { ProductionBatch, ProcessingStage } from '@/types/production';
import { format, subHours, differenceInMinutes } from 'date-fns';

interface IoTSensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'ph' | 'flow_rate' | 'weight' | 'vibration' | 'level';
  location: string;
  batchId?: string;
  stageId?: string;
  isOnline: boolean;
  lastReading: SensorReading;
  thresholds: {
    min: number;
    max: number;
    optimal: { min: number; max: number };
  };
  calibrationDate: Date;
  maintenanceSchedule?: Date;
  batteryLevel?: number;
  signalStrength?: number;
}

interface SensorReading {
  timestamp: Date;
  value: number;
  unit: string;
  quality: 'excellent' | 'good' | 'poor' | 'critical';
  isAlert?: boolean;
  alertMessage?: string;
}

interface IoTAlert {
  id: string;
  sensorId: string;
  type: 'threshold_exceeded' | 'sensor_offline' | 'low_battery' | 'calibration_due' | 'data_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

interface IoTProductionMonitorProps {
  batches: ProductionBatch[];
  onUpdateBatchConditions: (batchId: string, conditions: any) => void;
  onAcknowledgeAlert: (alertId: string, acknowledgedBy: string) => void;
  onConfigureSensor: (sensorId: string, config: any) => void;
}

const IoTProductionMonitor: React.FC<IoTProductionMonitorProps> = ({
  batches,
  onUpdateBatchConditions,
  onAcknowledgeAlert,
  onConfigureSensor
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [selectedSensor, setSelectedSensor] = useState<IoTSensor | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [alertFilter, setAlertFilter] = useState<'all' | 'unacknowledged' | 'critical'>('unacknowledged');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock IoT sensors data - in real implementation this would come from your IoT platform
  const [sensors, setSensors] = useState<IoTSensor[]>([
    {
      id: 'temp-001',
      name: 'Aging Chamber 1 - Temperature',
      type: 'temperature',
      location: 'Aging Room A',
      batchId: batches[0]?.id,
      isOnline: true,
      lastReading: {
        timestamp: new Date(),
        value: 20.5,
        unit: '°C',
        quality: 'excellent'
      },
      thresholds: {
        min: 16,
        max: 25,
        optimal: { min: 18, max: 22 }
      },
      calibrationDate: subHours(new Date(), 720), // 30 days ago
      batteryLevel: 85,
      signalStrength: 92
    },
    {
      id: 'hum-001',
      name: 'Aging Chamber 1 - Humidity',
      type: 'humidity',
      location: 'Aging Room A',
      batchId: batches[0]?.id,
      isOnline: true,
      lastReading: {
        timestamp: new Date(),
        value: 52,
        unit: '%',
        quality: 'good'
      },
      thresholds: {
        min: 40,
        max: 70,
        optimal: { min: 45, max: 55 }
      },
      calibrationDate: subHours(new Date(), 720),
      batteryLevel: 78,
      signalStrength: 89
    },
    {
      id: 'temp-002',
      name: 'Distillation Unit - Temperature',
      type: 'temperature',
      location: 'Production Floor',
      isOnline: true,
      lastReading: {
        timestamp: new Date(),
        value: 75.2,
        unit: '°C',
        quality: 'excellent'
      },
      thresholds: {
        min: 60,
        max: 85,
        optimal: { min: 68, max: 78 }
      },
      calibrationDate: subHours(new Date(), 360),
      batteryLevel: 92,
      signalStrength: 95
    },
    {
      id: 'pressure-001',
      name: 'Distillation Unit - Pressure',
      type: 'pressure',
      location: 'Production Floor',
      isOnline: false,
      lastReading: {
        timestamp: subHours(new Date(), 2),
        value: 1.2,
        unit: 'bar',
        quality: 'critical',
        isAlert: true,
        alertMessage: 'Sensor offline for 2 hours'
      },
      thresholds: {
        min: 0.8,
        max: 2.0,
        optimal: { min: 1.0, max: 1.5 }
      },
      calibrationDate: subHours(new Date(), 720),
      batteryLevel: 15,
      signalStrength: 0
    },
    {
      id: 'ph-001',
      name: 'Quality Lab - pH Meter',
      type: 'ph',
      location: 'Quality Lab',
      isOnline: true,
      lastReading: {
        timestamp: new Date(),
        value: 6.8,
        unit: 'pH',
        quality: 'good'
      },
      thresholds: {
        min: 5.5,
        max: 8.5,
        optimal: { min: 6.0, max: 7.5 }
      },
      calibrationDate: subHours(new Date(), 168), // 7 days ago
      batteryLevel: 65,
      signalStrength: 88
    }
  ]);

  // Mock alerts data
  const [alerts, setAlerts] = useState<IoTAlert[]>([
    {
      id: 'alert-001',
      sensorId: 'pressure-001',
      type: 'sensor_offline',
      severity: 'critical',
      message: 'Distillation pressure sensor has been offline for 2 hours',
      timestamp: subHours(new Date(), 2),
      isAcknowledged: false
    },
    {
      id: 'alert-002',
      sensorId: 'pressure-001',
      type: 'low_battery',
      severity: 'high',
      message: 'Battery level critical (15%) - replacement needed',
      timestamp: subHours(new Date(), 3),
      isAcknowledged: false
    },
    {
      id: 'alert-003',
      sensorId: 'temp-001',
      type: 'calibration_due',
      severity: 'medium',
      message: 'Sensor calibration overdue by 5 days',
      timestamp: subHours(new Date(), 120),
      isAcknowledged: true,
      acknowledgedBy: 'John Doe',
      acknowledgedAt: subHours(new Date(), 24)
    }
  ]);

  // Generate mock historical data
  const generateHistoricalData = (sensor: IoTSensor, timeRange: string) => {
    const hours = timeRange === '1h' ? 1 : timeRange === '6h' ? 6 : timeRange === '24h' ? 24 : 168;
    const points = timeRange === '1h' ? 12 : timeRange === '6h' ? 36 : timeRange === '24h' ? 48 : 168;
    const interval = (hours * 60) / points; // minutes between points

    return Array.from({ length: points }, (_, i) => {
      const timestamp = subHours(new Date(), hours - (i * interval / 60));
      const baseValue = sensor.lastReading.value;
      const variation = baseValue * 0.1; // 10% variation
      const value = baseValue + (Math.random() - 0.5) * variation;

      return {
        timestamp: timestamp.toISOString(),
        value: parseFloat(value.toFixed(1)),
        formattedTime: format(timestamp, timeRange === '1h' ? 'HH:mm' : timeRange === '24h' ? 'HH:mm' : 'MMM dd HH:mm')
      };
    });
  };

  // Auto-refresh sensor data
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => {
        if (!sensor.isOnline) return sensor;

        // Simulate small variations in readings
        const variation = sensor.lastReading.value * 0.02; // 2% variation
        const newValue = sensor.lastReading.value + (Math.random() - 0.5) * variation;

        // Check if reading is within thresholds
        let quality: SensorReading['quality'] = 'excellent';
        let isAlert = false;
        let alertMessage = '';

        if (newValue < sensor.thresholds.min || newValue > sensor.thresholds.max) {
          quality = 'critical';
          isAlert = true;
          alertMessage = `Value ${newValue.toFixed(1)} ${sensor.lastReading.unit} outside safe range`;
        } else if (newValue < sensor.thresholds.optimal.min || newValue > sensor.thresholds.optimal.max) {
          quality = 'poor';
        } else {
          quality = 'excellent';
        }

        return {
          ...sensor,
          lastReading: {
            ...sensor.lastReading,
            timestamp: new Date(),
            value: parseFloat(newValue.toFixed(1)),
            quality,
            isAlert,
            alertMessage
          }
        };
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'unacknowledged') return !alert.isAcknowledged;
    if (alertFilter === 'critical') return alert.severity === 'critical';
    return true;
  });

  // Calculate sensor statistics
  const sensorStats = useMemo(() => {
    const online = sensors.filter(s => s.isOnline).length;
    const offline = sensors.filter(s => !s.isOnline).length;
    const alerting = sensors.filter(s => s.lastReading.isAlert).length;
    const lowBattery = sensors.filter(s => s.batteryLevel && s.batteryLevel < 30).length;

    return { online, offline, alerting, lowBattery, total: sensors.length };
  }, [sensors]);

  const getSensorIcon = (type: IoTSensor['type']) => {
    switch (type) {
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      case 'humidity': return <Droplets className="w-5 h-5" />;
      case 'pressure': return <Gauge className="w-5 h-5" />;
      case 'ph': return <Activity className="w-5 h-5" />;
      case 'flow_rate': return <Activity className="w-5 h-5" />;
      case 'weight': return <BarChart3 className="w-5 h-5" />;
      case 'vibration': return <Radio className="w-5 h-5" />;
      case 'level': return <BarChart3 className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const getQualityColor = (quality: SensorReading['quality']) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'poor': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: IoTAlert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const acknowledgeAlert = (alert: IoTAlert) => {
    setAlerts(prev => prev.map(a =>
      a.id === alert.id
        ? {
            ...a,
            isAcknowledged: true,
            acknowledgedBy: 'Current User', // In real app, get from auth context
            acknowledgedAt: new Date()
          }
        : a
    ));
    onAcknowledgeAlert(alert.id, 'Current User');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">IoT Production Monitor</h2>
          <p className="text-gray-600">Real-time monitoring of production environment and equipment</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600">
              {autoRefresh ? 'Live' : 'Paused'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online Sensors</p>
                <p className="text-2xl font-bold text-green-600">{sensorStats.online}</p>
              </div>
              <Wifi className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-red-600">{sensorStats.offline}</p>
              </div>
              <WifiOff className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerting</p>
                <p className="text-2xl font-bold text-orange-600">{sensorStats.alerting}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Battery</p>
                <p className="text-2xl font-bold text-yellow-600">{sensorStats.lowBattery}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sensors</p>
                <p className="text-2xl font-bold">{sensorStats.total}</p>
              </div>
              <Cpu className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {filteredAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Active Alerts ({filteredAlerts.length})
              </CardTitle>
              <Select value={alertFilter} onValueChange={(value: any) => setAlertFilter(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                  <SelectItem value="critical">Critical Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAlerts.slice(0, 5).map(alert => (
                <Alert key={alert.id} className={`border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-red-500' :
                  alert.severity === 'high' ? 'border-l-orange-500' :
                  alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {format(alert.timestamp, 'MMM dd, HH:mm')}
                          </span>
                          {alert.isAcknowledged && (
                            <Badge variant="outline" className="text-green-600">
                              Acknowledged
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-gray-600">
                          Sensor: {sensors.find(s => s.id === alert.sensorId)?.name}
                        </p>
                      </div>
                      {!alert.isAcknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sensor Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map(sensor => (
              <Card
                key={sensor.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  sensor.lastReading.isAlert ? 'border-red-200 bg-red-50' :
                  !sensor.isOnline ? 'border-gray-200 bg-gray-50' : ''
                }`}
                onClick={() => setSelectedSensor(sensor)}
              >
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getSensorIcon(sensor.type)}
                        <div>
                          <p className="font-medium text-sm">{sensor.name}</p>
                          <p className="text-xs text-gray-600">{sensor.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {sensor.isOnline ? (
                          <Wifi className="w-4 h-4 text-green-500" />
                        ) : (
                          <WifiOff className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Reading:</span>
                        <span className={`font-medium ${getQualityColor(sensor.lastReading.quality)}`}>
                          {sensor.lastReading.value} {sensor.lastReading.unit}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Optimal Range</span>
                          <span>
                            {sensor.thresholds.optimal.min} - {sensor.thresholds.optimal.max}
                          </span>
                        </div>
                        <Progress
                          value={
                            ((sensor.lastReading.value - sensor.thresholds.min) /
                            (sensor.thresholds.max - sensor.thresholds.min)) * 100
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span className={
                            sensor.batteryLevel && sensor.batteryLevel < 30 ? 'text-red-600' : 'text-gray-600'
                          }>
                            {sensor.batteryLevel || 'N/A'}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Radio className="w-3 h-3" />
                          <span className="text-gray-600">{sensor.signalStrength || 0}%</span>
                        </div>
                        <span className="text-gray-600">
                          {format(sensor.lastReading.timestamp, 'HH:mm')}
                        </span>
                      </div>

                      {sensor.lastReading.isAlert && (
                        <Alert className="p-2 border-red-200 bg-red-50">
                          <AlertDescription className="text-xs">
                            {sensor.lastReading.alertMessage}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Batch Environment Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Environment Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batches.filter(batch => batch.status === 'AGING' || batch.status === 'IN_PROGRESS').map(batch => {
              const batchSensors = sensors.filter(s => s.batchId === batch.id);

              return (
                <Card key={batch.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{batch.batchNumber}</p>
                          <p className="text-sm text-gray-600">{batch.recipe?.name || 'Custom batch'}</p>
                          <Badge variant="outline">{batch.status}</Badge>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-gray-600">Sensors: {batchSensors.length}</p>
                          <p className="text-gray-600">
                            Online: {batchSensors.filter(s => s.isOnline).length}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {batchSensors.map(sensor => (
                          <div key={sensor.id} className="space-y-1">
                            <div className="flex items-center gap-1">
                              {getSensorIcon(sensor.type)}
                              <span className="text-sm font-medium">{sensor.type}</span>
                            </div>
                            <div className="text-lg font-bold">
                              {sensor.lastReading.value} {sensor.lastReading.unit}
                            </div>
                            <div className="text-xs text-gray-600">
                              Optimal: {sensor.thresholds.optimal.min}-{sensor.thresholds.optimal.max}
                            </div>
                            <Progress
                              value={
                                sensor.lastReading.value >= sensor.thresholds.optimal.min &&
                                sensor.lastReading.value <= sensor.thresholds.optimal.max ? 100 : 50
                              }
                              className="h-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sensor Detail Dialog */}
      {selectedSensor && (
        <Dialog open={!!selectedSensor} onOpenChange={() => setSelectedSensor(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getSensorIcon(selectedSensor.type)}
                {selectedSensor.name}
              </DialogTitle>
            </DialogHeader>
            <SensorDetailView
              sensor={selectedSensor}
              timeRange={selectedTimeRange}
              onTimeRangeChange={setSelectedTimeRange}
              historicalData={generateHistoricalData(selectedSensor, selectedTimeRange)}
              onConfigureSensor={onConfigureSensor}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Sensor Detail View Component
interface SensorDetailViewProps {
  sensor: IoTSensor;
  timeRange: string;
  onTimeRangeChange: (range: '1h' | '6h' | '24h' | '7d') => void;
  historicalData: any[];
  onConfigureSensor: (sensorId: string, config: any) => void;
}

const SensorDetailView: React.FC<SensorDetailViewProps> = ({
  sensor,
  timeRange,
  onTimeRangeChange,
  historicalData,
  onConfigureSensor
}) => {
  return (
    <div className="space-y-6">
      {/* Sensor Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600">Current Reading</p>
          <p className="text-2xl font-bold">
            {sensor.lastReading.value} {sensor.lastReading.unit}
          </p>
          <Badge className={
            sensor.lastReading.quality === 'excellent' ? 'bg-green-100 text-green-800' :
            sensor.lastReading.quality === 'good' ? 'bg-blue-100 text-blue-800' :
            sensor.lastReading.quality === 'poor' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }>
            {sensor.lastReading.quality}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <div className="flex items-center gap-2">
            {sensor.isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-red-600">Offline</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Signal: {sensor.signalStrength}% | Battery: {sensor.batteryLevel}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Location</p>
          <p className="font-medium">{sensor.location}</p>
          <p className="text-xs text-gray-600 mt-1">
            Last calibration: {format(sensor.calibrationDate, 'MMM dd, yyyy')}
          </p>
        </div>
      </div>

      {/* Historical Chart */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Historical Data</h3>
          <div className="flex gap-2">
            {(['1h', '6h', '24h', '7d'] as const).map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeRangeChange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedTime" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              {/* Threshold lines */}
              <Line
                type="monotone"
                data={historicalData.map(d => ({ ...d, value: sensor.thresholds.optimal.min }))}
                dataKey="value"
                stroke="#10b981"
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                data={historicalData.map(d => ({ ...d, value: sensor.thresholds.optimal.max }))}
                dataKey="value"
                stroke="#10b981"
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Threshold Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Optimal Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={sensor.thresholds.optimal.min}
                onChange={(e) => {
                  // In real app, this would update the sensor configuration
                  console.log('Update min threshold:', e.target.value);
                }}
              />
              <Input
                type="number"
                placeholder="Max"
                value={sensor.thresholds.optimal.max}
                onChange={(e) => {
                  console.log('Update max threshold:', e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <Label>Alert Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={sensor.thresholds.min}
                onChange={(e) => {
                  console.log('Update min alert threshold:', e.target.value);
                }}
              />
              <Input
                type="number"
                placeholder="Max"
                value={sensor.thresholds.max}
                onChange={(e) => {
                  console.log('Update max alert threshold:', e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <Button onClick={() => onConfigureSensor(sensor.id, sensor.thresholds)}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default IoTProductionMonitor;