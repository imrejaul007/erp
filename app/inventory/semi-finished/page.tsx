'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Beaker,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  AlertTriangle,
  Clock,
  Factory,
  TrendingUp,
  Package2,
  Calendar,
  Thermometer,
  Droplets,
  FlaskConical,
  Target,
  BarChart3,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';

interface SemiFinishedGood {
  id: string;
  name: string;
  nameArabic: string;
  sku: string;
  productionBatch: string;
  stage: 'MIXING' | 'AGING' | 'FILTERING' | 'TESTING' | 'READY_FOR_PACKAGING' | 'ON_HOLD';
  currentQuantity: number;
  targetQuantity: number;
  unit: string;
  productionStartDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  responsibleTechnician: string;
  qualityStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  storageLocation: string;
  storageTemperature: number;
  humidity: number;
  agingDuration?: number; // in days
  targetAgingDuration?: number; // in days
  formula: {
    id: string;
    name: string;
    version: string;
  };
  rawMaterialsUsed: Array<{
    materialId: string;
    materialName: string;
    quantityUsed: number;
    unit: string;
    batchNumber: string;
  }>;
  qualityChecks: Array<{
    id: string;
    checkDate: string;
    parameter: string;
    expectedValue: string;
    actualValue: string;
    status: 'PASS' | 'FAIL' | 'PENDING';
    notes?: string;
  }>;
  productionNotes: string;
  estimatedCost: number;
  currency: string;
}

export default function SemiFinishedGoodsPage() {
  const [semiFinishedGoods, setSemiFinishedGoods] = useState<SemiFinishedGood[]>([
    {
      id: '1',
      name: 'Royal Oud Blend #1',
      nameArabic: 'خليط العود الملكي رقم ١',
      sku: 'ROB-001-SF',
      productionBatch: 'ROB-2024-001',
      stage: 'AGING',
      currentQuantity: 2.5,
      targetQuantity: 3.0,
      unit: 'liter',
      productionStartDate: '2024-09-01',
      expectedCompletionDate: '2024-10-15',
      responsibleTechnician: 'Ahmad Hassan',
      qualityStatus: 'APPROVED',
      storageLocation: 'Aging Chamber A-1',
      storageTemperature: 22,
      humidity: 45,
      agingDuration: 30,
      targetAgingDuration: 45,
      formula: {
        id: 'F-001',
        name: 'Royal Oud Premium Formula',
        version: 'v2.1'
      },
      rawMaterialsUsed: [
        {
          materialId: '1',
          materialName: 'Royal Cambodian Oud Oil',
          quantityUsed: 150,
          unit: 'ml',
          batchNumber: 'RCO-2024-Q3-001'
        },
        {
          materialId: '2',
          materialName: 'Rose Oil Bulgarian',
          quantityUsed: 50,
          unit: 'ml',
          batchNumber: 'RO-2024-BUL-008'
        }
      ],
      qualityChecks: [
        {
          id: 'QC-001',
          checkDate: '2024-09-15',
          parameter: 'Scent Profile',
          expectedValue: 'Deep, woody, floral',
          actualValue: 'Deep, woody, floral',
          status: 'PASS'
        },
        {
          id: 'QC-002',
          checkDate: '2024-09-15',
          parameter: 'Color',
          expectedValue: 'Dark amber',
          actualValue: 'Dark amber',
          status: 'PASS'
        }
      ],
      productionNotes: 'Excellent blend quality. Aging process progressing well.',
      estimatedCost: 8500,
      currency: 'AED'
    },
    {
      id: '2',
      name: 'Jasmine Attar Base',
      nameArabic: 'قاعدة عطر الياسمين',
      sku: 'JAB-002-SF',
      productionBatch: 'JAB-2024-007',
      stage: 'TESTING',
      currentQuantity: 1.8,
      targetQuantity: 2.0,
      unit: 'liter',
      productionStartDate: '2024-09-10',
      expectedCompletionDate: '2024-10-05',
      responsibleTechnician: 'Fatima Al-Zahra',
      qualityStatus: 'UNDER_REVIEW',
      storageLocation: 'Quality Lab B-2',
      storageTemperature: 20,
      humidity: 40,
      agingDuration: 7,
      targetAgingDuration: 14,
      formula: {
        id: 'F-012',
        name: 'Jasmine Attar Traditional',
        version: 'v1.3'
      },
      rawMaterialsUsed: [
        {
          materialId: '3',
          materialName: 'Jasmine Absolute',
          quantityUsed: 200,
          unit: 'ml',
          batchNumber: 'JA-2024-IND-015'
        },
        {
          materialId: '4',
          materialName: 'Sandalwood Oil Base',
          quantityUsed: 1600,
          unit: 'ml',
          batchNumber: 'SWO-2024-M-012'
        }
      ],
      qualityChecks: [
        {
          id: 'QC-003',
          checkDate: '2024-09-20',
          parameter: 'Fragrance Intensity',
          expectedValue: '85-90%',
          actualValue: '87%',
          status: 'PASS'
        },
        {
          id: 'QC-004',
          checkDate: '2024-09-20',
          parameter: 'Clarity',
          expectedValue: 'Clear to slightly cloudy',
          actualValue: 'Slightly cloudy',
          status: 'PENDING'
        }
      ],
      productionNotes: 'Awaiting final quality approval. Minor clarity issue being investigated.',
      estimatedCost: 4200,
      currency: 'AED'
    },
    {
      id: '3',
      name: 'Amber Musk Concentrate',
      nameArabic: 'مركز العنبر والمسك',
      sku: 'AMC-003-SF',
      productionBatch: 'AMC-2024-003',
      stage: 'READY_FOR_PACKAGING',
      currentQuantity: 5.0,
      targetQuantity: 5.0,
      unit: 'liter',
      productionStartDate: '2024-08-15',
      expectedCompletionDate: '2024-09-30',
      actualCompletionDate: '2024-09-28',
      responsibleTechnician: 'Omar Abdullah',
      qualityStatus: 'APPROVED',
      storageLocation: 'Finished Goods A-3',
      storageTemperature: 18,
      humidity: 35,
      agingDuration: 42,
      targetAgingDuration: 42,
      formula: {
        id: 'F-025',
        name: 'Amber Musk Premium',
        version: 'v3.0'
      },
      rawMaterialsUsed: [
        {
          materialId: '5',
          materialName: 'Amber Oil Synthetic',
          quantityUsed: 800,
          unit: 'ml',
          batchNumber: 'AOS-2024-FR-022'
        },
        {
          materialId: '6',
          materialName: 'White Musk',
          quantityUsed: 300,
          unit: 'ml',
          batchNumber: 'WM-2024-IND-018'
        }
      ],
      qualityChecks: [
        {
          id: 'QC-005',
          checkDate: '2024-09-25',
          parameter: 'Final Scent Approval',
          expectedValue: 'Warm, musky, amber',
          actualValue: 'Warm, musky, amber',
          status: 'PASS'
        },
        {
          id: 'QC-006',
          checkDate: '2024-09-25',
          parameter: 'Stability Test',
          expectedValue: '90+ days stable',
          actualValue: '95 days stable',
          status: 'PASS'
        }
      ],
      productionNotes: 'Completed successfully. Ready for packaging into final products.',
      estimatedCost: 6750,
      currency: 'AED'
    }
  ]);

  const [selectedGood, setSelectedGood] = useState<SemiFinishedGood | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');

  const stages = ['MIXING', 'AGING', 'FILTERING', 'TESTING', 'READY_FOR_PACKAGING', 'ON_HOLD'];
  const qualityStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'];

  const filteredGoods = semiFinishedGoods.filter(good => {
    const matchesSearch = good.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         good.nameArabic.includes(searchTerm) ||
                         good.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         good.productionBatch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || good.stage === stageFilter;
    const matchesQuality = qualityFilter === 'all' || good.qualityStatus === qualityFilter;

    return matchesSearch && matchesStage && matchesQuality;
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'MIXING': return 'bg-blue-100 text-blue-800';
      case 'AGING': return 'bg-amber-100 text-amber-800';
      case 'FILTERING': return 'bg-purple-100 text-purple-800';
      case 'TESTING': return 'bg-orange-100 text-orange-800';
      case 'READY_FOR_PACKAGING': return 'bg-green-100 text-green-800';
      case 'ON_HOLD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getAgingProgress = (agingDuration: number, targetDuration: number) => {
    return Math.min((agingDuration / targetDuration) * 100, 100);
  };

  const totalValue = semiFinishedGoods.reduce((sum, good) => sum + good.estimatedCost, 0);
  const readyForPackaging = semiFinishedGoods.filter(g => g.stage === 'READY_FOR_PACKAGING').length;
  const underTesting = semiFinishedGoods.filter(g => g.stage === 'TESTING').length;
  const totalBatches = semiFinishedGoods.length;

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Semi-Finished Goods</h1>
          <p className="text-gray-600">
            Track production stages, quality control, and aging processes for perfume intermediates
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Production Report
          </Button>
          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Production Batch
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Batches</CardTitle>
            <Factory className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalBatches}</div>
            <p className="text-xs text-gray-500 mt-1">Active production batches</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              AED {totalValue?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Work-in-progress value</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ready for Packaging</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{readyForPackaging}</div>
            <p className="text-xs text-gray-500 mt-1">Completed batches</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Under Testing</CardTitle>
            <FlaskConical className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{underTesting}</div>
            <p className="text-xs text-gray-500 mt-1">Quality control phase</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-amber-600" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, SKU, or batch number..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stages.map(stage => (
                    <SelectItem key={stage} value={stage}>
                      {stage.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-48">
              <Select value={qualityFilter} onValueChange={setQualityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Quality Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quality Status</SelectItem>
                  {qualityStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Batches Table */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Beaker className="h-5 w-5 mr-2 text-amber-600" />
            Production Batches
          </CardTitle>
          <CardDescription>
            Monitor production stages, quality control, and aging processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Batch Info</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGoods.map((good) => (
                  <TableRow key={good.id} className="hover:bg-amber-50/50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{good.name}</div>
                        <div className="text-sm text-gray-500">{good.nameArabic}</div>
                        <div className="text-xs text-gray-400">SKU: {good.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{good.productionBatch}</div>
                        <div className="text-xs text-gray-500">
                          Started: {new Date(good.productionStartDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Expected: {new Date(good.expectedCompletionDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStageColor(good.stage)}>
                        {good.stage.replace('_', ' ')}
                      </Badge>
                      {good.stage === 'AGING' && good.agingDuration && good.targetAgingDuration && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">
                            Aging: {good.agingDuration}/{good.targetAgingDuration} days
                          </div>
                          <Progress
                            value={getAgingProgress(good.agingDuration, good.targetAgingDuration)}
                            className="h-2"
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">
                          {good.currentQuantity}/{good.targetQuantity} {good.unit}
                        </div>
                        <Progress
                          value={getProgressPercentage(good.currentQuantity, good.targetQuantity)}
                          className="h-2 mt-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getQualityColor(good.qualityStatus)}>
                        {good.qualityStatus.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{good.responsibleTechnician}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{good.storageLocation}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Thermometer className="h-3 w-3" />
                          {good.storageTemperature}°C
                          <Droplets className="h-3 w-3 ml-1" />
                          {good.humidity}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedGood(good)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Clock className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      {selectedGood && (
        <Dialog open={!!selectedGood} onOpenChange={() => setSelectedGood(null)}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>{selectedGood.name} - Production Details</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="formula">Formula</TabsTrigger>
                <TabsTrigger value="quality">Quality Control</TabsTrigger>
                <TabsTrigger value="materials">Raw Materials</TabsTrigger>
                <TabsTrigger value="storage">Storage Conditions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Production Batch</Label>
                      <p className="text-lg font-semibold">{selectedGood.productionBatch}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Current Stage</Label>
                      <Badge className={getStageColor(selectedGood.stage)}>
                        {selectedGood.stage.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Responsible Technician</Label>
                      <p>{selectedGood.responsibleTechnician}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Production Progress</Label>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>{selectedGood.currentQuantity} {selectedGood.unit}</span>
                          <span>{selectedGood.targetQuantity} {selectedGood.unit}</span>
                        </div>
                        <Progress
                          value={getProgressPercentage(selectedGood.currentQuantity, selectedGood.targetQuantity)}
                          className="h-3 mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Estimated Cost</Label>
                      <p className="text-lg font-semibold text-green-600">
                        {selectedGood.currency} {selectedGood.estimatedCost?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Timeline</Label>
                      <div className="space-y-1">
                        <p className="text-sm">Started: {new Date(selectedGood.productionStartDate).toLocaleDateString()}</p>
                        <p className="text-sm">Expected: {new Date(selectedGood.expectedCompletionDate).toLocaleDateString()}</p>
                        {selectedGood.actualCompletionDate && (
                          <p className="text-sm text-green-600">
                            Completed: {new Date(selectedGood.actualCompletionDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Production Notes</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedGood.productionNotes}</p>
                </div>
              </TabsContent>

              <TabsContent value="formula" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Formula Details</Label>
                    <div className="mt-2 space-y-2">
                      <p><strong>Name:</strong> {selectedGood.formula.name}</p>
                      <p><strong>Version:</strong> {selectedGood.formula.version}</p>
                      <p><strong>ID:</strong> {selectedGood.formula.id}</p>
                    </div>
                  </div>
                  {selectedGood.agingDuration && selectedGood.targetAgingDuration && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Aging Progress</Label>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>{selectedGood.agingDuration} days</span>
                          <span>{selectedGood.targetAgingDuration} days</span>
                        </div>
                        <Progress
                          value={getAgingProgress(selectedGood.agingDuration, selectedGood.targetAgingDuration)}
                          className="h-3 mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedGood.targetAgingDuration - selectedGood.agingDuration} days remaining
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="quality" className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg font-medium">Quality Control Checks</Label>
                    <Badge className={getQualityColor(selectedGood.qualityStatus)}>
                      {selectedGood.qualityStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {selectedGood.qualityChecks.map((check) => (
                      <div key={check.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{check.parameter}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              check.status === 'PASS' ? 'bg-green-100 text-green-800' :
                              check.status === 'FAIL' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {check.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(check.checkDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-xs text-gray-600">Expected</Label>
                            <p>{check.expectedValue}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">Actual</Label>
                            <p>{check.actualValue}</p>
                          </div>
                        </div>
                        {check.notes && (
                          <div className="mt-2">
                            <Label className="text-xs text-gray-600">Notes</Label>
                            <p className="text-sm">{check.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="materials" className="space-y-4">
                <div>
                  <Label className="text-lg font-medium">Raw Materials Used</Label>
                  <div className="mt-4 space-y-3">
                    {selectedGood.rawMaterialsUsed.map((material, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{material.materialName}</h4>
                            <p className="text-sm text-gray-600">Batch: {material.batchNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{material.quantityUsed} {material.unit}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="storage" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Storage Location</Label>
                      <p className="text-lg font-semibold">{selectedGood.storageLocation}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Temperature</Label>
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span className="text-lg font-semibold">{selectedGood.storageTemperature}°C</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Humidity</Label>
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-lg font-semibold">{selectedGood.humidity}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}