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
  QrCode,
  Search,
  Package,
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  Thermometer,
  Droplets,
  Calendar,
  BarChart3,
  Download,
  Plus,
  Edit,
  Eye,
  History,
  Tag,
  Settings
} from 'lucide-react';

interface BatchData {
  id: string;
  batchNumber: string;
  productionOrderId: string;
  recipeId: string;
  recipeName: string;
  batchSize: number;
  unit: string;
  status: 'Created' | 'In Progress' | 'Quality Check' | 'Approved' | 'Released' | 'On Hold' | 'Rejected';
  createdDate: Date;
  startDate?: Date;
  completionDate?: Date;
  expiryDate?: Date;
  qrCode: string;
  serialNumbers: string[];
  operator: string;
  supervisor: string;
  location: string;
  notes: string;
  qualityResults?: QualityTest[];
  traceability: TraceabilityRecord[];
  environmentalConditions: EnvironmentalData[];
  costData: BatchCostData;
}

interface QualityTest {
  id: string;
  testType: string;
  parameter: string;
  expectedValue: string;
  actualValue: string;
  unit: string;
  status: 'Pass' | 'Fail' | 'Pending';
  testDate: Date;
  technician: string;
  notes: string;
}

interface TraceabilityRecord {
  id: string;
  timestamp: Date;
  action: string;
  operator: string;
  location: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

interface EnvironmentalData {
  timestamp: Date;
  temperature: number;
  humidity: number;
  pressure?: number;
  location: string;
  notes?: string;
}

interface BatchCostData {
  materialCosts: number;
  laborCosts: number;
  overheadCosts: number;
  totalCost: number;
  costPerUnit: number;
  wastage: number;
  yield: number;
}

const BatchTracking: React.FC = () => {
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  useEffect(() => {
    const mockBatches: BatchData[] = [
      {
        id: 'BTH-001',
        batchNumber: 'ROY-2024-001',
        productionOrderId: 'PO-2024-001',
        recipeId: 'RCP-001',
        recipeName: 'Royal Oud Premium - 30ml',
        batchSize: 100,
        unit: 'bottles',
        status: 'In Progress',
        createdDate: new Date('2024-01-15'),
        startDate: new Date('2024-01-16'),
        qrCode: 'QR-ROY-2024-001',
        serialNumbers: ['SN-001-001', 'SN-001-002', 'SN-001-003'],
        operator: 'Ahmed Al-Rashid',
        supervisor: 'Omar Hassan',
        location: 'Production Floor A',
        notes: 'Premium oud blend with 12-month aging requirement',
        traceability: [
          {
            id: 'TR-001',
            timestamp: new Date('2024-01-16T08:00:00'),
            action: 'Batch Started',
            operator: 'Ahmed Al-Rashid',
            location: 'Production Floor A',
            details: 'Initial batch setup and material preparation'
          },
          {
            id: 'TR-002',
            timestamp: new Date('2024-01-16T10:30:00'),
            action: 'Ingredient Addition',
            operator: 'Ahmed Al-Rashid',
            location: 'Mixing Station 1',
            details: 'Added base oud oil - 15ml',
            previousValue: '0ml',
            newValue: '15ml'
          }
        ],
        environmentalConditions: [
          {
            timestamp: new Date('2024-01-16T08:00:00'),
            temperature: 22.5,
            humidity: 45,
            pressure: 1013,
            location: 'Production Floor A'
          }
        ],
        costData: {
          materialCosts: 1250.00,
          laborCosts: 380.00,
          overheadCosts: 150.00,
          totalCost: 1780.00,
          costPerUnit: 17.80,
          wastage: 2.5,
          yield: 97.5
        }
      },
      {
        id: 'BTH-002',
        batchNumber: 'FLR-2024-001',
        productionOrderId: 'PO-2024-002',
        recipeId: 'RCP-002',
        recipeName: 'Floral Garden Attar - 12ml',
        batchSize: 50,
        unit: 'bottles',
        status: 'Quality Check',
        createdDate: new Date('2024-01-14'),
        startDate: new Date('2024-01-14'),
        completionDate: new Date('2024-01-18'),
        qrCode: 'QR-FLR-2024-001',
        serialNumbers: ['SN-002-001', 'SN-002-002'],
        operator: 'Fatima Al-Zahra',
        supervisor: 'Omar Hassan',
        location: 'Production Floor B',
        notes: 'Delicate floral blend requiring precise temperature control',
        qualityResults: [
          {
            id: 'QT-001',
            testType: 'Fragrance Intensity',
            parameter: 'Scent Throw',
            expectedValue: '8-10',
            actualValue: '9.2',
            unit: 'scale',
            status: 'Pass',
            testDate: new Date('2024-01-18'),
            technician: 'Dr. Sarah Ahmad',
            notes: 'Excellent projection and longevity'
          }
        ],
        traceability: [],
        environmentalConditions: [],
        costData: {
          materialCosts: 850.00,
          laborCosts: 280.00,
          overheadCosts: 100.00,
          totalCost: 1230.00,
          costPerUnit: 24.60,
          wastage: 1.8,
          yield: 98.2
        }
      }
    ];
    setBatches(mockBatches);
    setSelectedBatch(mockBatches[0]);
  }, []);

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.recipeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || batch.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const generateQRCode = (batchNumber: string) => {
    // In real implementation, this would generate actual QR code
    return `QR-${batchNumber}`;
  };

  const generateSerialNumber = (batchNumber: string, sequence: number) => {
    return `SN-${batchNumber.slice(-3)}-${sequence.toString().padStart(3, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Created': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Quality Check': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Released': return 'bg-purple-100 text-purple-800';
      case 'On Hold': return 'bg-orange-100 text-orange-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addTraceabilityRecord = (batchId: string, action: string, details: string) => {
    const newRecord: TraceabilityRecord = {
      id: `TR-${Date.now()}`,
      timestamp: new Date(),
      action,
      operator: 'Current User', // In real app, get from auth
      location: 'Current Location',
      details
    };

    setBatches(prev => prev.map(batch =>
      batch.id === batchId
        ? { ...batch, traceability: [...batch.traceability, newRecord] }
        : batch
    ));
  };

  const updateBatchStatus = (batchId: string, newStatus: BatchData['status']) => {
    setBatches(prev => prev.map(batch =>
      batch.id === batchId ? { ...batch, status: newStatus } : batch
    ));
    addTraceabilityRecord(batchId, `Status changed to ${newStatus}`, `Batch status updated from previous state`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Batch Tracking & Traceability
            </span>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Batch
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by batch number or recipe name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Quality Check">Quality Check</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Released">Released</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Batches ({filteredBatches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredBatches.map((batch) => (
                <div
                  key={batch.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedBatch?.id === batch.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedBatch(batch)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{batch.batchNumber}</h4>
                      <p className="text-sm text-gray-600">{batch.recipeName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <QrCode className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">{batch.qrCode}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(batch.status)}>
                      {batch.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {batch.batchSize} {batch.unit}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {batch.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Batch Details */}
        <div className="lg:col-span-2">
          {selectedBatch ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Batch Details: {selectedBatch.batchNumber}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <QrCode className="w-4 h-4 mr-2" />
                      Print QR
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="traceability">Traceability</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                    <TabsTrigger value="environment">Environment</TabsTrigger>
                    <TabsTrigger value="costs">Costs</TabsTrigger>
                    <TabsTrigger value="serials">Serials</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Basic Information</Label>
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Production Order:</span>
                              <span className="text-sm font-medium">{selectedBatch.productionOrderId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Recipe:</span>
                              <span className="text-sm font-medium">{selectedBatch.recipeName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Batch Size:</span>
                              <span className="text-sm font-medium">{selectedBatch.batchSize} {selectedBatch.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Status:</span>
                              <Badge className={getStatusColor(selectedBatch.status)}>
                                {selectedBatch.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Personnel</Label>
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Operator:</span>
                              <span className="text-sm font-medium">{selectedBatch.operator}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Supervisor:</span>
                              <span className="text-sm font-medium">{selectedBatch.supervisor}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Location:</span>
                              <span className="text-sm font-medium">{selectedBatch.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Timeline</Label>
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Created:</span>
                              <span className="text-sm font-medium">
                                {selectedBatch.createdDate.toLocaleDateString()}
                              </span>
                            </div>
                            {selectedBatch.startDate && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Started:</span>
                                <span className="text-sm font-medium">
                                  {selectedBatch.startDate.toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {selectedBatch.completionDate && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Completed:</span>
                                <span className="text-sm font-medium">
                                  {selectedBatch.completionDate.toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {selectedBatch.expiryDate && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Expiry:</span>
                                <span className="text-sm font-medium">
                                  {selectedBatch.expiryDate.toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">QR Code & Identification</Label>
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">QR Code:</span>
                              <span className="text-sm font-medium">{selectedBatch.qrCode}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Serial Numbers:</span>
                              <span className="text-sm font-medium">{selectedBatch.serialNumbers.length} generated</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Status Actions</Label>
                          <div className="flex gap-2 mt-2">
                            <Select
                              value={selectedBatch.status}
                              onValueChange={(value) => updateBatchStatus(selectedBatch.id, value as BatchData['status'])}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Created">Created</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Quality Check">Quality Check</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Released">Released</SelectItem>
                                <SelectItem value="On Hold">On Hold</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedBatch.notes && (
                      <div>
                        <Label className="text-sm font-medium">Notes</Label>
                        <p className="text-sm text-gray-600 mt-1">{selectedBatch.notes}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="traceability" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Traceability Records</h3>
                      <Button
                        size="sm"
                        onClick={() => addTraceabilityRecord(
                          selectedBatch.id,
                          'Manual Entry',
                          'Manual traceability record added'
                        )}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Record
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {selectedBatch.traceability.map((record) => (
                        <div key={record.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{record.action}</h4>
                              <p className="text-sm text-gray-600">{record.details}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {record.operator}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {record.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {record.timestamp.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          {(record.previousValue || record.newValue) && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              {record.previousValue && (
                                <span className="text-red-600">From: {record.previousValue}</span>
                              )}
                              {record.previousValue && record.newValue && (
                                <span className="mx-2">→</span>
                              )}
                              {record.newValue && (
                                <span className="text-green-600">To: {record.newValue}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="quality" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Quality Control Tests</h3>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Test
                      </Button>
                    </div>

                    {selectedBatch.qualityResults && selectedBatch.qualityResults.length > 0 ? (
                      <div className="space-y-3">
                        {selectedBatch.qualityResults.map((test) => (
                          <div key={test.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-sm">{test.testType}</h4>
                                <p className="text-sm text-gray-600">{test.parameter}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <span>Expected: {test.expectedValue} {test.unit}</span>
                                  <span>Actual: {test.actualValue} {test.unit}</span>
                                  <Badge className={
                                    test.status === 'Pass' ? 'bg-green-100 text-green-800' :
                                    test.status === 'Fail' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }>
                                    {test.status === 'Pass' && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {test.status === 'Fail' && <AlertCircle className="w-3 h-3 mr-1" />}
                                    {test.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                  <span>Technician: {test.technician}</span>
                                  <span>Date: {test.testDate.toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            {test.notes && (
                              <p className="text-sm text-gray-600 mt-2">{test.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No quality tests recorded yet</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="environment" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Environmental Conditions</h3>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Log Condition
                      </Button>
                    </div>

                    {selectedBatch.environmentalConditions.length > 0 ? (
                      <div className="space-y-3">
                        {selectedBatch.environmentalConditions.map((condition, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-red-500" />
                                <div>
                                  <p className="text-sm font-medium">{condition.temperature}°C</p>
                                  <p className="text-xs text-gray-500">Temperature</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-blue-500" />
                                <div>
                                  <p className="text-sm font-medium">{condition.humidity}%</p>
                                  <p className="text-xs text-gray-500">Humidity</p>
                                </div>
                              </div>
                              {condition.pressure && (
                                <div className="flex items-center gap-2">
                                  <BarChart3 className="w-4 h-4 text-green-500" />
                                  <div>
                                    <p className="text-sm font-medium">{condition.pressure} hPa</p>
                                    <p className="text-xs text-gray-500">Pressure</p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">
                                    {condition.timestamp.toLocaleTimeString()}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {condition.timestamp.toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Location: {condition.location}
                            </div>
                            {condition.notes && (
                              <p className="text-sm text-gray-600 mt-2">{condition.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Thermometer className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No environmental data recorded yet</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="costs" className="space-y-4">
                    <h3 className="text-lg font-medium">Cost Analysis</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Cost Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Material Costs:</span>
                            <span className="font-medium">{selectedBatch.costData.materialCosts.toFixed(2)} AED</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Labor Costs:</span>
                            <span className="font-medium">{selectedBatch.costData.laborCosts.toFixed(2)} AED</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Overhead Costs:</span>
                            <span className="font-medium">{selectedBatch.costData.overheadCosts.toFixed(2)} AED</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-medium">
                              <span>Total Cost:</span>
                              <span>{selectedBatch.costData.totalCost.toFixed(2)} AED</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Cost per Unit:</span>
                            <span className="font-medium">{selectedBatch.costData.costPerUnit.toFixed(2)} AED</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Wastage:</span>
                            <span className="font-medium text-orange-600">{selectedBatch.costData.wastage.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Yield:</span>
                            <span className="font-medium text-green-600">{selectedBatch.costData.yield.toFixed(1)}%</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-medium">
                              <span>Efficiency Score:</span>
                              <span className="text-green-600">
                                {((selectedBatch.costData.yield - selectedBatch.costData.wastage) / 100 * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="serials" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Serial Numbers & QR Codes</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <QrCode className="w-4 h-4 mr-2" />
                          Generate QR Codes
                        </Button>
                        <Button size="sm">
                          <Tag className="w-4 h-4 mr-2" />
                          Generate Serials
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Batch QR Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 mx-auto mb-4 flex items-center justify-center">
                              <QrCode className="w-16 h-16 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium">{selectedBatch.qrCode}</p>
                            <p className="text-xs text-gray-500">Batch Identifier</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Serial Numbers ({selectedBatch.serialNumbers.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="max-h-40 overflow-y-auto">
                            <div className="space-y-2">
                              {selectedBatch.serialNumbers.map((serial, index) => (
                                <div key={serial} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm font-mono">{serial}</span>
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="ghost">
                                      <QrCode className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <Button className="w-full" size="sm">
                              Generate Additional Serials
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Batch</h3>
                <p className="text-gray-500">Choose a batch from the list to view its details and tracking information</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchTracking;