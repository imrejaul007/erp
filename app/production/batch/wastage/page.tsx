'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, AlertTriangle, TrendingUp, TrendingDown, Target, BarChart3, PieChart, Eye, Edit, Trash2, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { DatePicker, DateRangePicker } from '@/components/ui/date-picker';

// Mock data for wastage records
const wastageRecords = [
  {
    id: 'WST-001',
    batchId: 'PB001',
    product: 'Royal Oud Premium',
    date: '2024-09-28',
    operator: 'Ahmed Al-Rashid',
    stage: 'Distillation',
    materialName: 'Cambodian Oud Oil',
    plannedQuantity: 15,
    actualQuantity: 13.2,
    wastageQuantity: 1.8,
    wastagePercentage: 12,
    unit: 'ml',
    category: 'Process Loss',
    reason: 'Evaporation during heating process',
    costImpact: 216,
    currency: 'AED',
    severity: 'Medium',
    preventable: true,
    reportedBy: 'Production Supervisor',
    investigationStatus: 'Completed',
    correctedActions: 'Reduced heating temperature, improved vessel sealing',
  },
  {
    id: 'WST-002',
    batchId: 'PB001',
    product: 'Royal Oud Premium',
    date: '2024-09-29',
    operator: 'Ahmed Al-Rashid',
    stage: 'Filtration',
    materialName: 'Rose Water',
    plannedQuantity: 5,
    actualQuantity: 4.8,
    wastageQuantity: 0.2,
    wastagePercentage: 4,
    unit: 'ml',
    category: 'Equipment Loss',
    reason: 'Filter residue retention',
    costImpact: 5,
    currency: 'AED',
    severity: 'Low',
    preventable: false,
    reportedBy: 'Quality Control',
    investigationStatus: 'Not Required',
    correctedActions: 'Standard filtration loss - within acceptable limits',
  },
  {
    id: 'WST-003',
    batchId: 'PB002',
    product: 'Amber Essence Deluxe',
    date: '2024-09-25',
    operator: 'Fatima Hassan',
    stage: 'Mixing',
    materialName: 'Baltic Amber Resin',
    plannedQuantity: 25,
    actualQuantity: 22.5,
    wastageQuantity: 2.5,
    wastagePercentage: 10,
    unit: 'g',
    category: 'Material Spillage',
    reason: 'Container tipped during transfer',
    costImpact: 80,
    currency: 'AED',
    severity: 'High',
    preventable: true,
    reportedBy: 'Operator',
    investigationStatus: 'In Progress',
    correctedActions: 'Operator training scheduled, improved transfer procedures',
  },
  {
    id: 'WST-004',
    batchId: 'PB003',
    product: 'Desert Rose Attar',
    date: '2024-09-30',
    operator: 'Mohammed Saeed',
    stage: 'Distillation',
    materialName: 'Taif Rose Petals',
    plannedQuantity: 500,
    actualQuantity: 485,
    wastageQuantity: 15,
    wastagePercentage: 3,
    unit: 'g',
    category: 'Process Loss',
    reason: 'Normal distillation loss',
    costImpact: 60,
    currency: 'AED',
    severity: 'Low',
    preventable: false,
    reportedBy: 'Master Perfumer',
    investigationStatus: 'Not Required',
    correctedActions: 'Within acceptable traditional attar distillation parameters',
  },
];

// Mock data for wastage targets and KPIs
const wastageTargets = {
  monthly: {
    target: 5, // percentage
    actual: 7.2,
    variance: 2.2,
  },
  quarterly: {
    target: 4.5,
    actual: 6.8,
    variance: 2.3,
  },
  byCategory: {
    'Process Loss': { target: 3, actual: 4.2 },
    'Material Spillage': { target: 1, actual: 2.1 },
    'Equipment Loss': { target: 1.5, actual: 0.8 },
    'Quality Rejection': { target: 2, actual: 1.5 },
  },
};

// Mock data for category analysis
const categoryAnalysis = [
  { category: 'Process Loss', count: 15, percentage: 45, cost: 1250, trend: 'up' },
  { category: 'Material Spillage', count: 8, percentage: 24, cost: 850, trend: 'down' },
  { category: 'Equipment Loss', count: 6, percentage: 18, cost: 320, trend: 'stable' },
  { category: 'Quality Rejection', count: 4, percentage: 12, cost: 680, trend: 'down' },
];

const getSeverityBadge = (severity: string) => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline', className?: string } } = {
    'Low': { variant: 'outline', className: 'border-green-500 text-green-700' },
    'Medium': { variant: 'outline', className: 'border-yellow-500 text-yellow-700' },
    'High': { variant: 'destructive' },
    'Critical': { variant: 'destructive', className: 'bg-red-600' },
  };
  const config = variants[severity] || { variant: 'outline' };
  return <Badge variant={config.variant} className={config.className}>{severity}</Badge>;
};

const getCategoryBadge = (category: string) => {
  const colors: { [key: string]: string } = {
    'Process Loss': 'bg-blue-500 text-white',
    'Material Spillage': 'bg-orange-500 text-white',
    'Equipment Loss': 'bg-purple-500 text-white',
    'Quality Rejection': 'bg-red-500 text-white',
  };
  return <Badge className={colors[category] || 'bg-gray-500 text-white'}>{category}</Badge>;
};

const getInvestigationBadge = (status: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Completed': 'default',
    'In Progress': 'secondary',
    'Pending': 'outline',
    'Not Required': 'outline',
  };
  return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    default:
      return <Target className="h-4 w-4 text-gray-500" />;
  }
};

export default function WastageTrackingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState<{from: Date | undefined, to?: Date | undefined}>();
  const [isNewWastageDialogOpen, setIsNewWastageDialogOpen] = useState(false);
  const [selectedWastage, setSelectedWastage] = useState<typeof wastageRecords[0] | null>(null);
  const [isViewWastageDialogOpen, setIsViewWastageDialogOpen] = useState(false);

  const filteredWastageRecords = wastageRecords.filter(record => {
    const matchesSearch = record.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.materialName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || record.severity.toLowerCase() === filterSeverity.toLowerCase();
    const matchesCategory = filterCategory === 'all' || record.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const handleViewWastage = (record: typeof wastageRecords[0]) => {
    setSelectedWastage(record);
    setIsViewWastageDialogOpen(true);
  };

  const totalWastageCost = wastageRecords.reduce((acc, record) => acc + record.costImpact, 0);
  const avgWastagePercentage = wastageRecords.reduce((acc, record) => acc + record.wastagePercentage, 0) / wastageRecords.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-oud-600" />
            Wastage Tracking System
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor, analyze, and reduce production wastage across all batches
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isNewWastageDialogOpen} onOpenChange={setIsNewWastageDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
                <Plus className="h-4 w-4" />
                Record Wastage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Record Wastage Incident</DialogTitle>
                <DialogDescription>
                  Document material wastage during production process
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wastage-batch">Production Batch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PB001">PB001 - Royal Oud Premium</SelectItem>
                        <SelectItem value="PB002">PB002 - Amber Essence Deluxe</SelectItem>
                        <SelectItem value="PB003">PB003 - Desert Rose Attar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wastage-stage">Production Stage</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preparation">Material Preparation</SelectItem>
                        <SelectItem value="distillation">Distillation</SelectItem>
                        <SelectItem value="mixing">Mixing & Blending</SelectItem>
                        <SelectItem value="filtration">Filtration</SelectItem>
                        <SelectItem value="aging">Aging Process</SelectItem>
                        <SelectItem value="bottling">Bottling & Packaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wastage-material">Material Affected</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oud-oil">Cambodian Oud Oil</SelectItem>
                        <SelectItem value="rose-water">Damask Rose Water</SelectItem>
                        <SelectItem value="sandalwood">Sandalwood Extract</SelectItem>
                        <SelectItem value="carrier-oil">Jojoba Carrier Oil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wastage-category">Wastage Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="process-loss">Process Loss</SelectItem>
                        <SelectItem value="spillage">Material Spillage</SelectItem>
                        <SelectItem value="equipment">Equipment Loss</SelectItem>
                        <SelectItem value="quality">Quality Rejection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planned-qty">Planned Quantity</Label>
                    <Input id="planned-qty" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actual-qty">Actual Quantity</Label>
                    <Input id="actual-qty" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wastage-qty">Wastage Amount</Label>
                    <Input id="wastage-qty" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost-impact">Cost Impact (AED)</Label>
                    <Input id="cost-impact" type="number" placeholder="0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wastage-reason">Reason for Wastage</Label>
                  <Textarea
                    id="wastage-reason"
                    placeholder="Describe the cause of wastage..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corrective-actions">Proposed Corrective Actions</Label>
                  <Textarea
                    id="corrective-actions"
                    placeholder="What actions will be taken to prevent similar wastage..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewWastageDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewWastageDialogOpen(false)}>
                    Record Wastage
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wastage Cost</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalWastageCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wastage %</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWastagePercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Target: {wastageTargets.monthly.target}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wastageRecords.filter(r => r.severity === 'High' || r.severity === 'Critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Incidents requiring action
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preventable Cases</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wastageRecords.filter(r => r.preventable).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Improvement opportunities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">Wastage Records</TabsTrigger>
          <TabsTrigger value="analysis">Category Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends & KPIs</TabsTrigger>
          <TabsTrigger value="actions">Corrective Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wastage Records</CardTitle>
              <CardDescription>
                Track all material wastage incidents across production batches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search wastage records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="process loss">Process Loss</SelectItem>
                    <SelectItem value="material spillage">Material Spillage</SelectItem>
                    <SelectItem value="equipment loss">Equipment Loss</SelectItem>
                    <SelectItem value="quality rejection">Quality Rejection</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Wastage Records Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Wastage</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Cost Impact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWastageRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.batchId}</div>
                            <div className="text-sm text-muted-foreground">{record.product}</div>
                          </div>
                        </TableCell>
                        <TableCell>{record.materialName}</TableCell>
                        <TableCell>{record.stage}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.wastageQuantity} {record.unit}</div>
                            <div className="text-sm text-muted-foreground">{record.wastagePercentage}%</div>
                          </div>
                        </TableCell>
                        <TableCell>{getCategoryBadge(record.category)}</TableCell>
                        <TableCell>{getSeverityBadge(record.severity)}</TableCell>
                        <TableCell>AED {record.costImpact}</TableCell>
                        <TableCell>{getInvestigationBadge(record.investigationStatus)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewWastage(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Wastage by Category</CardTitle>
                <CardDescription>
                  Breakdown of wastage incidents by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryAnalysis.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTrendIcon(category.trend)}
                        <div>
                          <div className="font-medium">{category.category}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.count} incidents • {category.percentage}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">AED {category.cost}</div>
                        <div className="text-sm text-muted-foreground">Total cost</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance vs Targets</CardTitle>
                <CardDescription>
                  Compare actual wastage against set targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(wastageTargets.byCategory).map(([category, data]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span>{data.actual}% (Target: {data.target}%)</span>
                      </div>
                      <Progress
                        value={(data.actual / data.target) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Target</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Target:</span>
                    <span className="font-medium">{wastageTargets.monthly.target}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual:</span>
                    <span className="font-medium">{wastageTargets.monthly.actual}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variance:</span>
                    <span className={`font-medium ${wastageTargets.monthly.variance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {wastageTargets.monthly.variance > 0 ? '+' : ''}{wastageTargets.monthly.variance}%
                    </span>
                  </div>
                  <Progress
                    value={(wastageTargets.monthly.actual / (wastageTargets.monthly.target * 2)) * 100}
                    className="mt-4"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quarterly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Target:</span>
                    <span className="font-medium">{wastageTargets.quarterly.target}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual:</span>
                    <span className="font-medium">{wastageTargets.quarterly.actual}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variance:</span>
                    <span className={`font-medium ${wastageTargets.quarterly.variance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {wastageTargets.quarterly.variance > 0 ? '+' : ''}{wastageTargets.quarterly.variance}%
                    </span>
                  </div>
                  <Progress
                    value={(wastageTargets.quarterly.actual / (wastageTargets.quarterly.target * 2)) * 100}
                    className="mt-4"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">AED {totalWastageCost.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total wastage cost</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">+12% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Corrective Actions Tracking</CardTitle>
              <CardDescription>
                Monitor implementation of corrective measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wastageRecords.filter(r => r.preventable).map((record) => (
                  <Card key={record.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{record.id} - {record.product}</h3>
                        <p className="text-sm text-muted-foreground">
                          {record.stage} • {record.materialName} • AED {record.costImpact}
                        </p>
                      </div>
                      {getSeverityBadge(record.severity)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Root Cause</h4>
                        <p className="text-sm text-muted-foreground">{record.reason}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Corrective Actions</h4>
                        <p className="text-sm text-muted-foreground">{record.correctedActions}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Investigation: {record.investigationStatus}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Wastage Details Dialog */}
      <Dialog open={isViewWastageDialogOpen} onOpenChange={setIsViewWastageDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedWastage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-oud-600" />
                  Wastage Record {selectedWastage.id}
                </DialogTitle>
                <DialogDescription>
                  {selectedWastage.batchId} • {selectedWastage.product} • {selectedWastage.date}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Material</Label>
                    <p className="text-sm mt-1">{selectedWastage.materialName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Stage</Label>
                    <p className="text-sm mt-1">{selectedWastage.stage}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Operator</Label>
                    <p className="text-sm mt-1">{selectedWastage.operator}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Reported By</Label>
                    <p className="text-sm mt-1">{selectedWastage.reportedBy}</p>
                  </div>
                </div>

                <Separator />

                {/* Quantity Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quantity Analysis</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedWastage.plannedQuantity} {selectedWastage.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">Planned</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedWastage.actualQuantity} {selectedWastage.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">Actual</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg border-red-200">
                      <div className="text-2xl font-bold text-red-600">
                        {selectedWastage.wastageQuantity} {selectedWastage.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Wastage ({selectedWastage.wastagePercentage}%)
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Classification */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Classification</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        {getCategoryBadge(selectedWastage.category)}
                      </div>
                      <div className="flex justify-between">
                        <span>Severity:</span>
                        {getSeverityBadge(selectedWastage.severity)}
                      </div>
                      <div className="flex justify-between">
                        <span>Preventable:</span>
                        <Badge variant={selectedWastage.preventable ? "destructive" : "outline"}>
                          {selectedWastage.preventable ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost Impact:</span>
                        <span className="font-medium">{selectedWastage.currency} {selectedWastage.costImpact}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Investigation</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        {getInvestigationBadge(selectedWastage.investigationStatus)}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Root Cause & Actions */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Root Cause Analysis</h3>
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                      {selectedWastage.reason}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Corrective Actions</h3>
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                      {selectedWastage.correctedActions}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Record
                  </Button>
                  <Button className="bg-oud-600 hover:bg-oud-700">
                    Mark Resolved
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}