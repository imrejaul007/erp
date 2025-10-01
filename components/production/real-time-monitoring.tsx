'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Thermometer,
  Droplets,
  Gauge,
  Zap,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Settings,
  BarChart3,
  LineChart,
  PieChart,
  Monitor,
  Wifi,
  WifiOff,
  Camera,
  Pause,
  Play,
  RotateCcw,
  Download,
  Upload,
  MapPin,
  Users,
  Package
} from 'lucide-react';

interface SensorData {
  id: string;
  name: string;
  type: 'Temperature' | 'Humidity' | 'Pressure' | 'pH' | 'Flow Rate' | 'Weight' | 'Speed' | 'Vibration';
  location: string;
  equipmentId: string;
  currentValue: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  status: 'Normal' | 'Warning' | 'Critical' | 'Offline';
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
  history: { timestamp: Date; value: number }[];
}

interface EquipmentStatus {
  id: string;
  name: string;
  type: 'Distillation Unit' | 'Mixer' | 'Reactor' | 'Filtration' | 'Packaging' | 'Storage Tank';
  location: string;
  status: 'Running' | 'Idle' | 'Maintenance' | 'Error' | 'Offline';
  operator: string;
  currentBatch?: string;
  utilization: number; // percentage
  efficiency: number; // percentage
  lastMaintenance: Date;
  nextMaintenance: Date;
  sensors: string[]; // sensor IDs
  alerts: ProductionAlert[];
}

interface ProductionAlert {
  id: string;
  type: 'Equipment' | 'Quality' | 'Safety' | 'Process' | 'Maintenance';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  location: string;
  equipmentId?: string;
  timestamp: Date;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  status: 'Active' | 'Acknowledged' | 'Resolved';
}

interface BatchMonitoring {
  batchId: string;
  recipeName: string;
  currentStep: string;
  progress: number;
  startTime: Date;
  estimatedCompletion: Date;
  operator: string;
  equipment: string[];
  status: 'Starting' | 'In Progress' | 'Quality Check' | 'Completed' | 'Paused' | 'Error';
  kpis: {
    efficiency: number;
    quality: number;
    yield: number;
    cost: number;
  };
  deviations: {
    parameter: string;
    expected: number;
    actual: number;
    severity: 'Low' | 'Medium' | 'High';
  }[];
}

const RealTimeMonitoring: React.FC = () => {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [equipment, setEquipment] = useState<EquipmentStatus[]>([]);
  const [alerts, setAlerts] = useState<ProductionAlert[]>([]);
  const [batches, setBatches] = useState<BatchMonitoring[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [alertFilter, setAlertFilter] = useState<string>('all');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock data for demonstration
  useEffect(() => {
    const mockSensors: SensorData[] = [
      {
        id: 'TEMP-001',
        name: 'Distillation Temperature',
        type: 'Temperature',
        location: 'Production Floor A',
        equipmentId: 'DIST-001',
        currentValue: 85.2,
        unit: '°C',
        minThreshold: 80,
        maxThreshold: 90,
        status: 'Normal',
        lastUpdated: new Date(),
        trend: 'stable',
        history: generateMockHistory(85.2, 24)
      },
      {
        id: 'HUM-001',
        name: 'Storage Humidity',
        type: 'Humidity',
        location: 'Warehouse A',
        equipmentId: 'STOR-001',
        currentValue: 68.5,
        unit: '%',
        minThreshold: 45,
        maxThreshold: 65,
        status: 'Warning',
        lastUpdated: new Date(),
        trend: 'up',
        history: generateMockHistory(68.5, 24)
      },
      {
        id: 'PRES-001',
        name: 'Reactor Pressure',
        type: 'Pressure',
        location: 'Production Floor B',
        equipmentId: 'REACT-001',
        currentValue: 2.8,
        unit: 'bar',
        minThreshold: 2.0,
        maxThreshold: 3.5,
        status: 'Normal',
        lastUpdated: new Date(),
        trend: 'down',
        history: generateMockHistory(2.8, 24)
      },
      {
        id: 'FLOW-001',
        name: 'Oil Flow Rate',
        type: 'Flow Rate',
        location: 'Production Floor A',
        equipmentId: 'DIST-001',
        currentValue: 15.7,
        unit: 'ml/min',
        minThreshold: 10,
        maxThreshold: 20,
        status: 'Normal',
        lastUpdated: new Date(),
        trend: 'stable',
        history: generateMockHistory(15.7, 24)
      }
    ];

    const mockEquipment: EquipmentStatus[] = [
      {
        id: 'DIST-001',
        name: 'Primary Distillation Unit',
        type: 'Distillation Unit',
        location: 'Production Floor A',
        status: 'Running',
        operator: 'Ahmed Al-Rashid',
        currentBatch: 'BTH-001',
        utilization: 85,
        efficiency: 92,
        lastMaintenance: new Date('2024-01-10'),
        nextMaintenance: new Date('2024-02-10'),
        sensors: ['TEMP-001', 'FLOW-001'],
        alerts: []
      },
      {
        id: 'MIX-001',
        name: 'High-Speed Mixer',
        type: 'Mixer',
        location: 'Production Floor B',
        status: 'Idle',
        operator: 'Fatima Al-Zahra',
        utilization: 45,
        efficiency: 88,
        lastMaintenance: new Date('2024-01-05'),
        nextMaintenance: new Date('2024-02-05'),
        sensors: ['TEMP-002'],
        alerts: []
      },
      {
        id: 'STOR-001',
        name: 'Climate Controlled Storage',
        type: 'Storage Tank',
        location: 'Warehouse A',
        status: 'Running',
        operator: 'Omar Hassan',
        utilization: 70,
        efficiency: 95,
        lastMaintenance: new Date('2024-01-08'),
        nextMaintenance: new Date('2024-02-08'),
        sensors: ['HUM-001', 'TEMP-003'],
        alerts: []
      }
    ];

    const mockAlerts: ProductionAlert[] = [
      {
        id: 'ALT-001',
        type: 'Equipment',
        severity: 'Medium',
        title: 'High Humidity in Storage',
        description: 'Storage humidity level is above recommended threshold',
        location: 'Warehouse A',
        equipmentId: 'STOR-001',
        timestamp: new Date(),
        status: 'Active'
      },
      {
        id: 'ALT-002',
        type: 'Process',
        severity: 'Low',
        title: 'Batch ROY-2024-001 Behind Schedule',
        description: 'Current batch is running 30 minutes behind expected schedule',
        location: 'Production Floor A',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'Active'
      }
    ];

    const mockBatches: BatchMonitoring[] = [
      {
        batchId: 'BTH-001',
        recipeName: 'Royal Oud Premium - 30ml',
        currentStep: 'Distillation Phase 1',
        progress: 65,
        startTime: new Date('2024-01-16T08:00:00'),
        estimatedCompletion: new Date('2024-01-18T16:00:00'),
        operator: 'Ahmed Al-Rashid',
        equipment: ['DIST-001'],
        status: 'In Progress',
        kpis: {
          efficiency: 92,
          quality: 88,
          yield: 96,
          cost: 1850
        },
        deviations: [
          {
            parameter: 'Temperature',
            expected: 85,
            actual: 85.2,
            severity: 'Low'
          }
        ]
      }
    ];

    setSensors(mockSensors);
    setEquipment(mockEquipment);
    setAlerts(mockAlerts);
    setBatches(mockBatches);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => ({
        ...sensor,
        currentValue: sensor.currentValue + (Math.random() - 0.5) * 2,
        lastUpdated: new Date(),
        history: [
          ...sensor.history.slice(-23),
          { timestamp: new Date(), value: sensor.currentValue }
        ]
      })));
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  function generateMockHistory(currentValue: number, hours: number) {
    const history = [];
    for (let i = hours; i > 0; i--) {
      history.push({
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
        value: currentValue + (Math.random() - 0.5) * 10
      });
    }
    return history;
  }

  const getSensorStatusColor = (status: SensorData['status']) => {
    switch (status) {
      case 'Normal': return 'text-green-600';
      case 'Warning': return 'text-yellow-600';
      case 'Critical': return 'text-red-600';
      case 'Offline': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getSensorIcon = (type: SensorData['type']) => {
    switch (type) {
      case 'Temperature': return <Thermometer className="w-4 h-4" />;
      case 'Humidity': return <Droplets className="w-4 h-4" />;
      case 'Pressure': return <Gauge className="w-4 h-4" />;
      case 'Flow Rate': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getEquipmentStatusColor = (status: EquipmentStatus['status']) => {
    switch (status) {
      case 'Running': return 'bg-green-100 text-green-800';
      case 'Idle': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Error': return 'bg-red-100 text-red-800';
      case 'Offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertSeverityColor = (severity: ProductionAlert['severity']) => {
    switch (severity) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            status: 'Acknowledged',
            acknowledgedBy: 'Current User',
            acknowledgedAt: new Date()
          }
        : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            status: 'Resolved',
            resolvedBy: 'Current User',
            resolvedAt: new Date()
          }
        : alert
    ));
  };

  const filteredSensors = selectedLocation === 'all'
    ? sensors
    : sensors.filter(sensor => sensor.location === selectedLocation);

  const filteredAlerts = alertFilter === 'all'
    ? alerts
    : alerts.filter(alert => alert.severity === alertFilter);

  const locations = Array.from(new Set(sensors.map(s => s.location)));

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Real-Time Production Monitoring
              {isMonitoring ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
            </span>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isMonitoring ? 'Pause' : 'Resume'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={alertFilter} onValueChange={setAlertFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter alerts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Equipment</p>
                <p className="text-2xl font-bold">
                  {equipment.filter(e => e.status === 'Running').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold">
                  {alerts.filter(a => a.status === 'Active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Running Batches</p>
                <p className="text-2xl font-bold">
                  {batches.filter(b => b.status === 'In Progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Efficiency</p>
                <p className="text-2xl font-bold">
                  {Math.round(equipment.reduce((acc, e) => acc + e.efficiency, 0) / equipment.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sensors">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSensors.map((sensor) => (
              <Card key={sensor.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getSensorIcon(sensor.type)}
                      {sensor.name}
                    </span>
                    <Badge
                      className={`${
                        sensor.status === 'Normal' ? 'bg-green-100 text-green-800' :
                        sensor.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                        sensor.status === 'Critical' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {sensor.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold flex items-center justify-center gap-2">
                        <span className={getSensorStatusColor(sensor.status)}>
                          {sensor.currentValue.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">{sensor.unit}</span>
                        {sensor.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {sensor.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                        {sensor.trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Range:</span>
                        <span>{sensor.minThreshold} - {sensor.maxThreshold} {sensor.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span>{sensor.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Equipment:</span>
                        <span>{sensor.equipmentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Updated:</span>
                        <span>{sensor.lastUpdated.toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {/* Mini chart placeholder */}
                    <div className="h-16 bg-gray-50 rounded flex items-center justify-center">
                      <LineChart className="w-8 h-8 text-gray-400" />
                      <span className="text-xs text-gray-500 ml-2">24h trend</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {equipment.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <Badge className={getEquipmentStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-600">Type</Label>
                        <p>{item.type}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Location</Label>
                        <p>{item.location}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Operator</Label>
                        <p>{item.operator}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Current Batch</Label>
                        <p>{item.currentBatch || 'None'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilization</span>
                        <span>{item.utilization}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.utilization}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Efficiency</span>
                        <span>{item.efficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${item.efficiency}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span>Last Maintenance:</span>
                        <p>{item.lastMaintenance.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span>Next Maintenance:</span>
                        <p>{item.nextMaintenance.toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Monitor
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          {batches.map((batch) => (
            <Card key={batch.batchId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{batch.batchId} - {batch.recipeName}</span>
                  <Badge className={
                    batch.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    batch.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    batch.status === 'Error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {batch.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Current Step</Label>
                      <p className="font-medium">{batch.currentStep}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Operator</Label>
                      <p className="font-medium">{batch.operator}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Started</Label>
                      <p className="font-medium">{batch.startTime.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Est. Completion</Label>
                      <p className="font-medium">{batch.estimatedCompletion.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{batch.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${batch.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">{batch.kpis.efficiency}%</div>
                      <div className="text-xs text-gray-600">Efficiency</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">{batch.kpis.quality}%</div>
                      <div className="text-xs text-gray-600">Quality</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-2xl font-bold text-purple-600">{batch.kpis.yield}%</div>
                      <div className="text-xs text-gray-600">Yield</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <div className="text-2xl font-bold text-orange-600">{batch.kpis.cost}</div>
                      <div className="text-xs text-gray-600">Cost (AED)</div>
                    </div>
                  </div>

                  {batch.deviations.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Process Deviations</Label>
                      <div className="mt-2 space-y-2">
                        {batch.deviations.map((deviation, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                            <div>
                              <span className="font-medium">{deviation.parameter}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                Expected: {deviation.expected}, Actual: {deviation.actual}
                              </span>
                            </div>
                            <Badge className={
                              deviation.severity === 'Low' ? 'bg-blue-100 text-blue-800' :
                              deviation.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {deviation.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded">
                        {alert.type === 'Equipment' && <Settings className="w-4 h-4" />}
                        {alert.type === 'Quality' && <CheckCircle className="w-4 h-4" />}
                        {alert.type === 'Safety' && <AlertTriangle className="w-4 h-4" />}
                        {alert.type === 'Process' && <Activity className="w-4 h-4" />}
                        {alert.type === 'Maintenance' && <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.timestamp.toLocaleString()}
                          </span>
                          {alert.equipmentId && (
                            <span>Equipment: {alert.equipmentId}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getAlertSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className={
                        alert.status === 'Active' ? 'text-red-600' :
                        alert.status === 'Acknowledged' ? 'text-yellow-600' :
                        'text-green-600'
                      }>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {alert.status === 'Active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                    {alert.status === 'Acknowledged' && (
                      <Button
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Performance charts will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sensor Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Sensor trend analysis will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Alert distribution charts will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Efficiency metrics will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeMonitoring;