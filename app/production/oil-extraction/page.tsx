'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Droplets, ArrowLeft, Plus, CheckCircle2, Clock, Thermometer,
  Beaker, FlaskRound, TrendingUp, DollarSign, GitBranch
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OilExtractionPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('active');
  const [isNewExtractionDialogOpen, setIsNewExtractionDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [isBatchDetailOpen, setIsBatchDetailOpen] = useState(false);

  const extractionSummary = {
    activeBatches: 5,
    monthlyYield: 145, // ml
    avgYieldRate: 1.2, // ml per kg
    qcPassRate: 98.0,
    totalInputThisMonth: 120.5, // kg
    completedBatches: 28,
    equipmentUtilization: 78.5
  };

  const activeBatches = [
    {
      id: 'OE-2024-0285',
      batchNo: 'CAMOD-2024-085',
      rawMaterial: 'Cambodian Oud Wood - Premium Chips',
      inputWeight: 15.5, // kg
      method: 'Hydro Distillation',
      startDate: '2024-10-01',
      startTime: '09:00',
      currentStage: 'Distillation',
      progress: 65,
      temperature: 98,
      targetTemp: 100,
      distillationHours: 26,
      totalHours: 40,
      equipment: 'Still-01',
      operator: 'Ahmed Al-Rashid',
      expectedOilYield: 18.6, // ml
      currentYield: 12.1, // ml
      expectedHydrosol: 850, // ml
      expectedResidue: 14.2, // kg
      estimatedCompletion: '2024-10-05',
      status: 'on-track'
    },
    {
      id: 'OE-2024-0286',
      batchNo: 'HINDI-2024-092',
      rawMaterial: 'Hindi Oud Wood - Grade A Chips',
      inputWeight: 22.0,
      method: 'Steam Distillation',
      startDate: '2024-10-01',
      startTime: '14:00',
      currentStage: 'Pre-heating',
      progress: 15,
      temperature: 65,
      targetTemp: 100,
      distillationHours: 6,
      totalHours: 48,
      equipment: 'Still-02',
      operator: 'Fatima Hassan',
      expectedOilYield: 24.2,
      currentYield: 0,
      expectedHydrosol: 1200,
      expectedResidue: 20.5,
      estimatedCompletion: '2024-10-06',
      status: 'on-track'
    }
  ];

  const completedBatches = [
    {
      id: 'OE-2024-0280',
      batchNo: 'INDO-2024-088',
      rawMaterial: 'Indonesian Oud Wood - Premium Chips',
      inputWeight: 18.5,
      method: 'Hydro Distillation',
      completedDate: '2024-09-30',
      distillationHours: 42,
      operator: 'Mohammed Saeed',
      equipment: 'Still-01',
      outputs: [
        { type: 'Oud Oil', quantity: 22.8, unit: 'ml', sku: 'OIL-INDO-PREM-001', quality: 98.5, value: 228000 },
        { type: 'Hydrosol (Oud Water)', quantity: 950, unit: 'ml', sku: 'HYD-INDO-001', quality: 95.0, value: 9500 },
        { type: 'Wood Residue', quantity: 17.2, unit: 'kg', sku: 'RES-INDO-001', quality: 85.0, value: 5160 }
      ],
      yieldRate: 1.23, // ml/kg
      totalValue: 242660,
      qcStatus: 'passed',
      qcTests: {
        purity: 98.5,
        viscosity: 'Normal',
        color: 'Dark Amber',
        aroma: 'Excellent',
        specificGravity: 0.98
      }
    },
    {
      id: 'OE-2024-0278',
      batchNo: 'CAMOD-2024-082',
      rawMaterial: 'Cambodian Oud Wood - Grade A Chips',
      inputWeight: 12.0,
      method: 'Steam Distillation',
      completedDate: '2024-09-28',
      distillationHours: 38,
      operator: 'Ahmed Al-Rashid',
      equipment: 'Still-02',
      outputs: [
        { type: 'Oud Oil', quantity: 13.2, unit: 'ml', sku: 'OIL-CAMOD-A-002', quality: 96.8, value: 118800 },
        { type: 'Hydrosol (Oud Water)', quantity: 720, unit: 'ml', sku: 'HYD-CAMOD-002', quality: 92.0, value: 7200 },
        { type: 'Wood Residue', quantity: 11.3, unit: 'kg', sku: 'RES-CAMOD-002', quality: 82.0, value: 3390 }
      ],
      yieldRate: 1.1,
      totalValue: 129390,
      qcStatus: 'passed',
      qcTests: {
        purity: 96.8,
        viscosity: 'Normal',
        color: 'Medium Amber',
        aroma: 'Very Good',
        specificGravity: 0.96
      }
    }
  ];

  const distillationMethods = [
    {
      method: 'Hydro Distillation',
      description: 'Wood submerged in water, heated to boiling',
      duration: '36-48 hours',
      yieldRate: '1.1-1.4 ml/kg',
      bestFor: 'Premium & Grade A chips',
      pros: ['Higher oil yield', 'Better aroma extraction', 'Consistent quality'],
      cons: ['Longer processing time', 'Higher energy cost']
    },
    {
      method: 'Steam Distillation',
      description: 'Steam passed through wood material',
      duration: '24-36 hours',
      yieldRate: '0.8-1.2 ml/kg',
      bestFor: 'Grade B & C chips',
      pros: ['Faster processing', 'Lower energy usage', 'Cleaner oil'],
      cons: ['Slightly lower yield', 'Requires precise temperature control']
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/production')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Oud Oil Extraction</h1>
            <p className="text-muted-foreground">
              Distillation tracking, yield recording & multi-output management
            </p>
          </div>
        </div>
        <Dialog open={isNewExtractionDialogOpen} onOpenChange={setIsNewExtractionDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Start New Extraction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Start New Oil Extraction</DialogTitle>
              <DialogDescription>
                Begin distillation process to extract oud oil from wood chips
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:gap-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Input Material</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material-batch">Oud Chips Batch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OUD-PREM-CH-001">Premium Cambodian Chips (8.5kg)</SelectItem>
                        <SelectItem value="OUD-A-CH-002">Grade A Vietnamese Chips (15.2kg)</SelectItem>
                        <SelectItem value="OUD-PREM-CH-003">Premium Hindi Chips (6.8kg)</SelectItem>
                        <SelectItem value="OUD-A-CH-004">Grade A Indonesian Chips (12.5kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="input-weight">Input Weight (kg)</Label>
                    <Input id="input-weight" type="number" placeholder="15.5" step="0.1" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Distillation Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="method">Extraction Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hydro">Hydro Distillation</SelectItem>
                        <SelectItem value="steam">Steam Distillation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="still">Distillation Still</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select still" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="still-1">Still #1 (500L) - Available</SelectItem>
                        <SelectItem value="still-2">Still #2 (750L) - Available</SelectItem>
                        <SelectItem value="still-3">Still #3 (1000L) - In Use</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Process Parameters</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-temp">Target Temperature (°C)</Label>
                    <Input id="target-temp" type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated-hours">Estimated Duration (hours)</Label>
                    <Input id="estimated-hours" type="number" placeholder="40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected-yield">Expected Oil Yield (ml)</Label>
                    <Input id="expected-yield" type="number" placeholder="18.6" step="0.1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected-hydrosol">Expected Hydrosol (ml)</Label>
                    <Input id="expected-hydrosol" type="number" placeholder="850" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Operator Assignment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operator">Primary Operator</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hamza">Hamza Al-Dhaheri (Master Distiller)</SelectItem>
                        <SelectItem value="yasmin">Yasmin Ibrahim (Senior Operator)</SelectItem>
                        <SelectItem value="khalid">Khalid Rashid (Expert)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shift">Shift Assignment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6AM - 2PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (2PM - 10PM)</SelectItem>
                        <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
                        <SelectItem value="continuous">Continuous (24hr)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Process Notes (Optional)</Label>
                <Input id="notes" placeholder="Special instructions or observations..." />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsNewExtractionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setIsNewExtractionDialogOpen(false);
                  // Handle form submission
                }}>
                  Start Extraction
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Batches</CardDescription>
            <CardTitle className="text-3xl">{extractionSummary.activeBatches}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              In distillation process
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Yield</CardDescription>
            <CardTitle className="text-3xl">{extractionSummary.monthlyYield} ml</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              From {extractionSummary.totalInputThisMonth} kg input
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Yield Rate</CardDescription>
            <CardTitle className="text-3xl">{extractionSummary.avgYieldRate} ml/kg</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(extractionSummary.avgYieldRate / 1.5) * 100} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              Industry avg: 1.0-1.5 ml/kg
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>QC Pass Rate</CardDescription>
            <CardTitle className="text-3xl">{extractionSummary.qcPassRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={extractionSummary.qcPassRate} className="mb-2" />
            <p className="text-xs text-green-600">
              {extractionSummary.completedBatches} batches completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="active">Active Distillation</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="methods">Distillation Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeBatches.map((batch) => (
            <Card
              key={batch.id}
              className="cursor-pointer hover:bg-blue-50 transition-colors group"
              onClick={() => {
                setSelectedBatch(batch);
                setIsBatchDetailOpen(true);
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-gray-900 group-hover:text-gray-900">{batch.id}</CardTitle>
                      <Badge variant="outline">{batch.batchNo}</Badge>
                      <Badge variant="default" className="bg-blue-600 text-white">
                        {batch.currentStage}
                      </Badge>
                      <Badge
                        variant={batch.status === 'on-track' ? 'default' : 'secondary'}
                        className={batch.status === 'on-track' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}
                      >
                        {batch.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1 text-gray-700 group-hover:text-gray-800">
                      {batch.rawMaterial} • {batch.method}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-primary group-hover:text-primary">{batch.progress}%</p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700">Complete</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <Progress value={batch.progress} className="h-3" />

                {/* Real-time Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <p className="text-xs text-muted-foreground">Temperature</p>
                    </div>
                    <p className="text-xl font-bold">{batch.temperature}°C</p>
                    <p className="text-xs text-muted-foreground">Target: {batch.targetTemp}°C</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <p className="text-xs text-muted-foreground">Distillation Time</p>
                    </div>
                    <p className="text-xl font-bold">{batch.distillationHours}h</p>
                    <p className="text-xs text-muted-foreground">Total: {batch.totalHours}h</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="h-4 w-4 text-amber-500" />
                      <p className="text-xs text-muted-foreground">Oil Collected</p>
                    </div>
                    <p className="text-xl font-bold text-green-600">{batch.currentYield} ml</p>
                    <p className="text-xs text-muted-foreground">Expected: {batch.expectedOilYield} ml</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Beaker className="h-4 w-4 text-purple-500" />
                      <p className="text-xs text-muted-foreground">Equipment</p>
                    </div>
                    <p className="text-xl font-bold">{batch.equipment}</p>
                    <p className="text-xs text-muted-foreground">{batch.operator}</p>
                  </div>
                </div>

                {/* Expected Outputs */}
                <div>
                  <h4 className="font-semibold mb-2">Expected Outputs:</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Oud Oil</p>
                      <p className="text-lg font-bold text-amber-600">{batch.expectedOilYield} ml</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Hydrosol</p>
                      <p className="text-lg font-bold text-blue-600">{batch.expectedHydrosol} ml</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Residue</p>
                      <p className="text-lg font-bold text-gray-600">{batch.expectedResidue} kg</p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                  <span>Started: {batch.startDate} {batch.startTime}</span>
                  <span>ETA: {batch.estimatedCompletion}</span>
                  <span>Input: {batch.inputWeight} kg</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBatches.map((batch) => (
            <Card
              key={batch.id}
              className="cursor-pointer hover:bg-blue-50 transition-colors group"
              onClick={() => {
                setSelectedBatch(batch);
                setIsBatchDetailOpen(true);
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-gray-900 group-hover:text-gray-900">{batch.id}</CardTitle>
                      <Badge variant="outline">{batch.batchNo}</Badge>
                      <Badge variant="default" className="bg-green-600 text-white">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-700">
                        QC {batch.qcStatus}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1 text-gray-700 group-hover:text-gray-800">
                      {batch.rawMaterial} • {batch.method} • {batch.completedDate}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-green-600 group-hover:text-green-700">AED {batch.totalValue?.toLocaleString() || "0"}</p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700">Total value</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Batch Summary */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Input Weight</p>
                    <p className="text-xl font-bold">{batch.inputWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Yield Rate</p>
                    <p className="text-xl font-bold text-green-600">{batch.yieldRate} ml/kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Distillation Time</p>
                    <p className="text-xl font-bold">{batch.distillationHours}h</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Equipment</p>
                    <p className="text-xl font-bold">{batch.equipment}</p>
                  </div>
                </div>

                {/* Output Products */}
                <div>
                  <h4 className="font-semibold mb-3">Output Products:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Type</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Quality Score</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batch.outputs.map((output, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{output.type}</TableCell>
                          <TableCell className="font-mono text-sm">{output.sku}</TableCell>
                          <TableCell className="font-semibold">
                            {output.quantity} {output.unit}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{output.quality}%</span>
                              <Progress value={output.quality} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            AED {output.value?.toLocaleString() || "0"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* QC Test Results */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FlaskRound className="h-5 w-5 text-green-600" />
                    Quality Control Test Results
                  </h4>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(batch.qcTests).map(([test, value]) => (
                      <div key={test}>
                        <p className="text-xs text-muted-foreground capitalize mb-1">
                          {test.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p className="font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distillation Methods Comparison</CardTitle>
              <CardDescription>Choose the right method for your raw material</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {distillationMethods.map((method) => (
                  <Card key={method.method} className="border-2">
                    <CardHeader>
                      <CardTitle className="text-primary">{method.method}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="font-semibold">{method.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Yield Rate</p>
                          <p className="font-semibold text-green-600">{method.yieldRate}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2">Best For:</p>
                        <Badge variant="outline">{method.bestFor}</Badge>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2 text-green-600">Advantages:</p>
                        <ul className="space-y-1">
                          {method.pros.map((pro, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2 text-amber-600">Considerations:</p>
                        <ul className="space-y-1">
                          {method.cons.map((con, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-amber-600 flex-shrink-0">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Oil Extraction Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Droplets className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Real-time Tracking</h3>
                <p className="text-xs text-muted-foreground">
                  Monitor temperature, time, and oil yield during distillation
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Yield Recording</h3>
                <p className="text-xs text-muted-foreground">
                  Track ml of oil per kg of wood with historical comparison
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Multi-Output Management</h3>
                <p className="text-xs text-muted-foreground">
                  Auto-create SKUs for oil, hydrosol, and residue
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Cost per ml Calculation</h3>
                <p className="text-xs text-muted-foreground">
                  Automatic cost tracking for raw material, energy & labor
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Detail Dialog */}
      <Dialog open={isBatchDetailOpen} onOpenChange={setIsBatchDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Oil Extraction Batch - {selectedBatch?.id}</DialogTitle>
            <DialogDescription>
              Complete distillation process information
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <Droplets className="h-4 w-4 text-primary" />
                    Batch Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extraction ID:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source Batch:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.batchNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Raw Material:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.rawMaterial}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equipment:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.equipment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operator:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.operator}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <Beaker className="h-4 w-4 text-primary" />
                    Process Status
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={selectedBatch.status === 'on-track' ? 'default' : 'secondary'}
                             className={selectedBatch.status ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}>
                        {selectedBatch.currentStage || 'Completed'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Input Weight:</span>
                      <span className="font-bold text-gray-900">{selectedBatch.inputWeight} kg</span>
                    </div>
                    {selectedBatch.progress !== undefined && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Progress:</span>
                          <span className="font-bold text-primary">{selectedBatch.progress}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temperature:</span>
                          <span className="font-semibold text-gray-900">{selectedBatch.temperature}°C / {selectedBatch.targetTemp}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distillation Hours:</span>
                          <span className="font-semibold text-gray-900">{selectedBatch.distillationHours}h / {selectedBatch.totalHours}h</span>
                        </div>
                      </>
                    )}
                    {selectedBatch.yieldRate && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Yield Rate:</span>
                          <span className="font-bold text-green-600">{selectedBatch.yieldRate} ml/kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distillation Time:</span>
                          <span className="font-semibold text-gray-900">{selectedBatch.distillationHours}h</span>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>

              {/* Expected/Actual Outputs */}
              {selectedBatch.expectedOilYield && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 text-gray-900">Expected Outputs</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-gray-700 mb-1">Oud Oil</p>
                      <p className="text-xl sm:text-2xl font-bold text-amber-600">{selectedBatch.currentYield || 0} ml</p>
                      <p className="text-xs text-gray-600">Expected: {selectedBatch.expectedOilYield} ml</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-700 mb-1">Hydrosol</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">{selectedBatch.expectedHydrosol} ml</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-700 mb-1">Wood Residue</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-600">{selectedBatch.expectedResidue} kg</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Completed Outputs Table */}
              {selectedBatch.outputs && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 text-gray-900">Output Products</h3>
                  <Table className="table-modern">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Type</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Quality Score</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBatch.outputs.map((output: any, index: number) => (
                        <TableRow key={index} className="group">
                          <TableCell className="font-medium text-gray-900 group-hover:text-gray-900">{output.type}</TableCell>
                          <TableCell className="font-mono text-sm text-gray-900 group-hover:text-gray-900">{output.sku}</TableCell>
                          <TableCell className="font-semibold text-gray-900 group-hover:text-gray-900">
                            {output.quantity} {output.unit}
                          </TableCell>
                          <TableCell className="text-gray-900 group-hover:text-gray-900">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{output.quality}%</span>
                              <Progress value={output.quality} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600 group-hover:text-green-700">
                            AED {output.value?.toLocaleString() || "0"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total Value:</span>
                      <span className="text-xl font-bold text-green-600">AED {selectedBatch.totalValue?.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* QC Tests (for completed) */}
              {selectedBatch.qcTests && (
                <Card className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <FlaskRound className="h-5 w-5 text-green-600" />
                    Quality Control Test Results
                  </h3>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(selectedBatch.qcTests).map(([test, value]) => (
                      <div key={test}>
                        <p className="text-xs text-gray-700 capitalize mb-1">
                          {test.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p className="font-semibold text-gray-900">{value as string}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Timeline (for active) */}
              {selectedBatch.startDate && selectedBatch.currentStage && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 text-gray-900">Process Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Started</p>
                        <p className="text-xs text-gray-600">{selectedBatch.startDate} {selectedBatch.startTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Current: {selectedBatch.currentStage}</p>
                        <Progress value={selectedBatch.progress} className="w-full mt-2" />
                        <p className="text-xs text-gray-600 mt-1">
                          {selectedBatch.distillationHours}h / {selectedBatch.totalHours}h • {selectedBatch.progress}% complete
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-500">Expected Completion</p>
                        <p className="text-xs text-gray-600">{selectedBatch.estimatedCompletion}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                {selectedBatch.currentStage && (
                  <>
                    <Button variant="outline">
                      Update Parameters
                    </Button>
                    <Button>
                      Record Collection
                    </Button>
                  </>
                )}
                {selectedBatch.outputs && (
                  <>
                    <Button variant="outline">
                      Print QC Report
                    </Button>
                    <Button variant="outline">
                      View Inventory Impact
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setIsBatchDetailOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
