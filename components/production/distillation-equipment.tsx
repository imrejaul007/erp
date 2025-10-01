'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Thermometer,
  Droplets,
  Gauge,
  Timer,
  Beaker,
  Flask,
  Activity,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  Wrench,
  Shield,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  Square,
  RotateCcw,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  MapPin,
  Users,
  Zap,
  Flame,
  Snowflake,
  Wind
} from 'lucide-react';

interface DistillationEquipment {
  id: string;
  name: string;
  type: 'Traditional Copper' | 'Modern Steel' | 'Glass Reactor' | 'Fractional Column' | 'Steam Distillation';
  location: string;
  capacity: number;
  capacityUnit: string;
  status: 'Running' | 'Idle' | 'Maintenance' | 'Error' | 'Offline';
  currentBatch?: string;
  operator?: string;
  installDate: Date;
  lastMaintenance: Date;
  nextMaintenance: Date;
  specifications: EquipmentSpecs;
  sensors: SensorReading[];
  maintenanceHistory: MaintenanceRecord[];
  processParameters: ProcessParameter[];
  safetyProtocols: SafetyProtocol[];
  performance: PerformanceMetrics;
}

interface EquipmentSpecs {
  maxTemperature: number;
  maxPressure: number;
  materialOfConstruction: string;
  heatingMethod: 'Direct Fire' | 'Steam' | 'Electric' | 'Gas';
  coolingSystem: 'Water' | 'Air' | 'Refrigerated';
  automationLevel: 'Manual' | 'Semi-Auto' | 'Fully Auto';
  certifications: string[];
}

interface SensorReading {
  id: string;
  parameter: string;
  currentValue: number;
  unit: string;
  normalRange: { min: number; max: number };
  status: 'Normal' | 'Warning' | 'Critical';
  lastReading: Date;
  trend: 'up' | 'down' | 'stable';
}

interface MaintenanceRecord {
  id: string;
  type: 'Preventive' | 'Corrective' | 'Emergency' | 'Calibration';
  description: string;
  technician: string;
  date: Date;
  duration: number; // in hours
  cost: number;
  partsReplaced: string[];
  nextAction?: string;
  notes: string;
}

interface ProcessParameter {
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  tolerance: number;
  controlType: 'Manual' | 'Auto';
  lastAdjusted: Date;
  adjustedBy: string;
}

interface SafetyProtocol {
  id: string;
  name: string;
  description: string;
  triggerCondition: string;
  action: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  isActive: boolean;
}

interface PerformanceMetrics {
  efficiency: number; // percentage
  utilization: number; // percentage
  uptime: number; // percentage
  throughput: number; // units per hour
  energyConsumption: number; // kW
  qualityScore: number; // percentage
  costPerUnit: number;
}

interface DistillationProcess {
  id: string;
  equipmentId: string;
  batchId: string;
  materialType: string;
  startTime: Date;
  endTime?: Date;
  phase: 'Preparation' | 'Heating' | 'Distillation' | 'Collection' | 'Cooling' | 'Completed';
  progress: number;
  currentTemperature: number;
  targetTemperature: number;
  pressureReading: number;
  flowRate: number;
  yieldToDate: number;
  expectedYield: number;
  qualityGrade: 'A' | 'B' | 'C' | 'D';
  notes: string;
}

const DistillationEquipmentManagement: React.FC = () => {
  const [equipment, setEquipment] = useState<DistillationEquipment[]>([]);
  const [processes, setProcesses] = useState<DistillationProcess[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<DistillationEquipment | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<DistillationProcess | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockEquipment: DistillationEquipment[] = [
      {
        id: 'DIST-001',
        name: 'Traditional Copper Alembic #1',
        type: 'Traditional Copper',
        location: 'Distillation Lab A',
        capacity: 50,
        capacityUnit: 'kg',
        status: 'Running',
        currentBatch: 'BTH-001',
        operator: 'Ahmed Al-Rashid',
        installDate: new Date('2023-06-15'),
        lastMaintenance: new Date('2024-01-10'),
        nextMaintenance: new Date('2024-04-10'),
        specifications: {
          maxTemperature: 200,
          maxPressure: 2.5,
          materialOfConstruction: 'Pure Copper',
          heatingMethod: 'Direct Fire',
          coolingSystem: 'Water',
          automationLevel: 'Semi-Auto',
          certifications: ['CE', 'FDA', 'GMP']
        },
        sensors: [
          {
            id: 'TEMP-DIST-001',
            parameter: 'Temperature',
            currentValue: 85.2,
            unit: '°C',
            normalRange: { min: 80, max: 95 },
            status: 'Normal',
            lastReading: new Date(),
            trend: 'stable'
          },
          {
            id: 'PRES-DIST-001',
            parameter: 'Pressure',
            currentValue: 1.8,
            unit: 'bar',
            normalRange: { min: 1.0, max: 2.0 },
            status: 'Normal',
            lastReading: new Date(),
            trend: 'stable'
          }
        ],
        maintenanceHistory: [
          {
            id: 'MAINT-001',
            type: 'Preventive',
            description: 'Monthly cleaning and calibration',
            technician: 'Hassan Al-Mahmoud',
            date: new Date('2024-01-10'),
            duration: 4,
            cost: 250,
            partsReplaced: ['Temperature sensor', 'Pressure gauge gasket'],
            notes: 'All systems operating within normal parameters'
          }
        ],
        processParameters: [
          {
            name: 'Heating Rate',
            currentValue: 2.5,
            targetValue: 2.5,
            unit: '°C/min',
            tolerance: 0.5,
            controlType: 'Auto',
            lastAdjusted: new Date(),
            adjustedBy: 'System'
          }
        ],
        safetyProtocols: [
          {
            id: 'SAFE-001',
            name: 'Overpressure Protection',
            description: 'Automatic shutdown if pressure exceeds 2.2 bar',
            triggerCondition: 'Pressure > 2.2 bar',
            action: 'Stop heating, open relief valve',
            priority: 'Critical',
            isActive: true
          }
        ],
        performance: {
          efficiency: 92,
          utilization: 85,
          uptime: 98,
          throughput: 12.5,
          energyConsumption: 15.2,
          qualityScore: 95,
          costPerUnit: 28.50
        }
      },
      {
        id: 'DIST-002',
        name: 'Modern Steam Distillation Unit',
        type: 'Steam Distillation',
        location: 'Distillation Lab B',
        capacity: 100,
        capacityUnit: 'kg',
        status: 'Idle',
        installDate: new Date('2023-09-20'),
        lastMaintenance: new Date('2024-01-05'),
        nextMaintenance: new Date('2024-04-05'),
        specifications: {
          maxTemperature: 150,
          maxPressure: 3.0,
          materialOfConstruction: 'Stainless Steel 316L',
          heatingMethod: 'Steam',
          coolingSystem: 'Refrigerated',
          automationLevel: 'Fully Auto',
          certifications: ['CE', 'FDA', 'GMP', 'ISO 9001']
        },
        sensors: [
          {
            id: 'TEMP-DIST-002',
            parameter: 'Temperature',
            currentValue: 25.0,
            unit: '°C',
            normalRange: { min: 20, max: 30 },
            status: 'Normal',
            lastReading: new Date(),
            trend: 'stable'
          }
        ],
        maintenanceHistory: [],
        processParameters: [],
        safetyProtocols: [],
        performance: {
          efficiency: 88,
          utilization: 60,
          uptime: 95,
          throughput: 18.2,
          energyConsumption: 22.1,
          qualityScore: 92,
          costPerUnit: 32.20
        }
      }
    ];

    const mockProcesses: DistillationProcess[] = [
      {
        id: 'PROC-001',
        equipmentId: 'DIST-001',
        batchId: 'BTH-001',
        materialType: 'Oud Wood Chips',
        startTime: new Date('2024-01-16T08:00:00'),
        phase: 'Distillation',
        progress: 65,
        currentTemperature: 85.2,
        targetTemperature: 85.0,
        pressureReading: 1.8,
        flowRate: 12.5,
        yieldToDate: 580,
        expectedYield: 900,
        qualityGrade: 'A',
        notes: 'Process running smoothly, excellent oil quality'
      }
    ];

    setEquipment(mockEquipment);
    setProcesses(mockProcesses);
    setSelectedEquipment(mockEquipment[0]);
    setSelectedProcess(mockProcesses[0]);
  }, []);

  const getStatusColor = (status: DistillationEquipment['status']) => {
    switch (status) {
      case 'Running': return 'bg-green-100 text-green-800';
      case 'Idle': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Error': return 'bg-red-100 text-red-800';
      case 'Offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSensorStatusIcon = (status: SensorReading['status']) => {
    switch (status) {
      case 'Normal': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'Critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEquipmentIcon = (type: DistillationEquipment['type']) => {
    switch (type) {
      case 'Traditional Copper': return <Flask className="w-5 h-5" />;
      case 'Modern Steel': return <Beaker className="w-5 h-5" />;
      case 'Steam Distillation': return <Wind className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const startProcess = (equipmentId: string) => {
    setEquipment(prev => prev.map(eq =>
      eq.id === equipmentId ? { ...eq, status: 'Running' } : eq
    ));
  };

  const stopProcess = (equipmentId: string) => {
    setEquipment(prev => prev.map(eq =>
      eq.id === equipmentId ? { ...eq, status: 'Idle', currentBatch: undefined } : eq
    ));
  };

  const pauseProcess = (equipmentId: string) => {
    // In real implementation, this would pause the equipment
    console.log(`Pausing equipment ${equipmentId}`);
  };

  const filteredEquipment = equipment.filter(eq => {
    const matchesLocation = filterLocation === 'all' || eq.location === filterLocation;
    const matchesStatus = filterStatus === 'all' || eq.status === filterStatus;
    return matchesLocation && matchesStatus;
  });

  const locations = Array.from(new Set(equipment.map(eq => eq.location)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Flask className="w-5 h-5" />
              Distillation Equipment Management
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Maintenance Schedule
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filterLocation} onValueChange={setFilterLocation}>
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Idle">Idle</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Error">Error</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Running</p>
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
              <div className="p-3 bg-blue-100 rounded-full">
                <Pause className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Idle</p>
                <p className="text-2xl font-bold">
                  {equipment.filter(e => e.status === 'Idle').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Wrench className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold">
                  {equipment.filter(e => e.status === 'Maintenance').length}
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
                  {Math.round(equipment.reduce((acc, e) => acc + e.performance.efficiency, 0) / equipment.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="processes">Active Processes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipment List */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment List ({filteredEquipment.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredEquipment.map((eq) => (
                    <div
                      key={eq.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedEquipment?.id === eq.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedEquipment(eq)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded">
                            {getEquipmentIcon(eq.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{eq.name}</h4>
                            <p className="text-sm text-gray-600">{eq.type}</p>
                            <p className="text-xs text-gray-500">{eq.location}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(eq.status)}>
                          {eq.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>Capacity: {eq.capacity} {eq.capacityUnit}</span>
                        <span>Efficiency: {eq.performance.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Equipment Details */}
            <div className="lg:col-span-2">
              {selectedEquipment ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedEquipment.name}</span>
                      <div className="flex gap-2">
                        {selectedEquipment.status === 'Idle' && (
                          <Button
                            size="sm"
                            onClick={() => startProcess(selectedEquipment.id)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </Button>
                        )}
                        {selectedEquipment.status === 'Running' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => pauseProcess(selectedEquipment.id)}
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => stopProcess(selectedEquipment.id)}
                            >
                              <Square className="w-4 h-4 mr-2" />
                              Stop
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="info">
                      <TabsList>
                        <TabsTrigger value="info">Information</TabsTrigger>
                        <TabsTrigger value="sensors">Sensors</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="safety">Safety</TabsTrigger>
                      </TabsList>

                      <TabsContent value="info" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Equipment Type</Label>
                            <p className="text-sm">{selectedEquipment.type}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Location</Label>
                            <p className="text-sm">{selectedEquipment.location}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Capacity</Label>
                            <p className="text-sm">{selectedEquipment.capacity} {selectedEquipment.capacityUnit}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Current Operator</Label>
                            <p className="text-sm">{selectedEquipment.operator || 'None assigned'}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Specifications</Label>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Max Temperature:</span>
                              <span>{selectedEquipment.specifications.maxTemperature}°C</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Max Pressure:</span>
                              <span>{selectedEquipment.specifications.maxPressure} bar</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Material:</span>
                              <span>{selectedEquipment.specifications.materialOfConstruction}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Heating:</span>
                              <span>{selectedEquipment.specifications.heatingMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cooling:</span>
                              <span>{selectedEquipment.specifications.coolingSystem}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Automation:</span>
                              <span>{selectedEquipment.specifications.automationLevel}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Certifications</Label>
                          <div className="flex gap-2 mt-2">
                            {selectedEquipment.specifications.certifications.map((cert) => (
                              <Badge key={cert} variant="outline">{cert}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-600">Install Date</Label>
                            <p>{selectedEquipment.installDate.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Last Maintenance</Label>
                            <p>{selectedEquipment.lastMaintenance.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Next Maintenance</Label>
                            <p>{selectedEquipment.nextMaintenance.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="sensors" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedEquipment.sensors.map((sensor) => (
                            <Card key={sensor.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{sensor.parameter}</h4>
                                  {getSensorStatusIcon(sensor.status)}
                                </div>
                                <div className="text-2xl font-bold text-center mb-2">
                                  {sensor.currentValue} {sensor.unit}
                                </div>
                                <div className="text-sm text-gray-600 text-center">
                                  Normal: {sensor.normalRange.min} - {sensor.normalRange.max} {sensor.unit}
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                  {sensor.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                                  {sensor.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                                  {sensor.trend === 'stable' && <Activity className="w-4 h-4 text-gray-500" />}
                                  <span className="text-xs text-gray-500">
                                    {sensor.lastReading.toLocaleTimeString()}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="performance" className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {selectedEquipment.performance.efficiency}%
                            </div>
                            <div className="text-sm text-gray-600">Efficiency</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {selectedEquipment.performance.utilization}%
                            </div>
                            <div className="text-sm text-gray-600">Utilization</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {selectedEquipment.performance.uptime}%
                            </div>
                            <div className="text-sm text-gray-600">Uptime</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                              {selectedEquipment.performance.throughput}
                            </div>
                            <div className="text-sm text-gray-600">Units/Hour</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Energy Consumption:</span>
                            <span>{selectedEquipment.performance.energyConsumption} kW</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Quality Score:</span>
                            <span>{selectedEquipment.performance.qualityScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost per Unit:</span>
                            <span>{selectedEquipment.performance.costPerUnit} AED</span>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="safety" className="space-y-4">
                        <div className="space-y-3">
                          {selectedEquipment.safetyProtocols.map((protocol) => (
                            <Card key={protocol.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium">{protocol.name}</h4>
                                    <p className="text-sm text-gray-600">{protocol.description}</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                      <div>Trigger: {protocol.triggerCondition}</div>
                                      <div>Action: {protocol.action}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={
                                      protocol.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                      protocol.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                      protocol.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-blue-100 text-blue-800'
                                    }>
                                      {protocol.priority}
                                    </Badge>
                                    <Badge variant={protocol.isActive ? 'default' : 'secondary'}>
                                      {protocol.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Flask className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Select Equipment</h3>
                    <p className="text-gray-500">Choose equipment from the list to view its details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.filter(eq => eq.status === 'Running').map((eq) => (
              <Card key={eq.id}>
                <CardHeader>
                  <CardTitle className="text-base">{eq.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eq.sensors.map((sensor) => (
                      <div key={sensor.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {sensor.parameter === 'Temperature' && <Thermometer className="w-4 h-4" />}
                          {sensor.parameter === 'Pressure' && <Gauge className="w-4 h-4" />}
                          {sensor.parameter === 'Flow Rate' && <Droplets className="w-4 h-4" />}
                          <span className="text-sm">{sensor.parameter}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{sensor.currentValue} {sensor.unit}</div>
                          <div className="text-xs text-gray-500">{sensor.status}</div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Efficiency</span>
                        <span>{eq.performance.efficiency}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {equipment.filter(eq => eq.status === 'Running').length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Equipment</h3>
                <p className="text-gray-500">No equipment is currently running</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {equipment.map((eq) => (
                    <div key={eq.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{eq.name}</h4>
                        <p className="text-sm text-gray-600">Due: {eq.nextMaintenance.toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline">
                        {Math.ceil((eq.nextMaintenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Maintenance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {equipment.flatMap(eq =>
                    eq.maintenanceHistory.map(record => ({
                      ...record,
                      equipmentName: eq.name
                    }))
                  ).slice(0, 5).map((record, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{record.equipmentName}</h4>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            <span>Technician: {record.technician}</span>
                            <span className="ml-4">Duration: {record.duration}h</span>
                            <span className="ml-4">Cost: {record.cost} AED</span>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {record.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processes" className="space-y-4">
          {processes.map((process) => (
            <Card key={process.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Process {process.id} - {process.materialType}</span>
                  <Badge className={
                    process.phase === 'Completed' ? 'bg-green-100 text-green-800' :
                    process.phase === 'Distillation' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {process.phase}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label className="text-sm text-gray-600">Equipment</Label>
                    <p className="font-medium">{equipment.find(eq => eq.id === process.equipmentId)?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Batch ID</Label>
                    <p className="font-medium">{process.batchId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Start Time</Label>
                    <p className="font-medium">{process.startTime.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Quality Grade</Label>
                    <Badge variant="outline">{process.qualityGrade}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{process.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${process.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Thermometer className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-gray-600">Temperature</span>
                      </div>
                      <div className="text-lg font-bold">{process.currentTemperature}°C</div>
                      <div className="text-xs text-gray-500">Target: {process.targetTemperature}°C</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Gauge className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-600">Pressure</span>
                      </div>
                      <div className="text-lg font-bold">{process.pressureReading} bar</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Droplets className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-600">Flow Rate</span>
                      </div>
                      <div className="text-lg font-bold">{process.flowRate} ml/min</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Flask className="w-4 h-4 text-purple-500" />
                        <span className="text-xs text-gray-600">Yield</span>
                      </div>
                      <div className="text-lg font-bold">{process.yieldToDate}ml</div>
                      <div className="text-xs text-gray-500">Target: {process.expectedYield}ml</div>
                    </div>
                  </div>

                  {process.notes && (
                    <div className="p-3 bg-gray-50 rounded">
                      <Label className="text-sm font-medium">Notes</Label>
                      <p className="text-sm text-gray-600 mt-1">{process.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {processes.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Beaker className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Processes</h3>
                <p className="text-gray-500">No distillation processes are currently running</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Efficiency Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Efficiency trend charts will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilization Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Utilization analysis will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <Wrench className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Maintenance cost trends will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Quality metrics dashboard will be displayed here</p>
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

export default DistillationEquipmentManagement;