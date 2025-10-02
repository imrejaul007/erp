'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Factory,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ArrowRightLeft,
  Beaker,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Scale,
  Droplets,
  Layers,
  TrendingUp,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Calculator,
  Timer,
  FlaskConical,
  Users,
  ShoppingCart,
  Bell,
  Calendar,
  DollarSign,
  TrendingDown,
  Zap,
  Archive,
  Workflow,
  Package,
  Target,
  Percent,
  Scissors,
  Flame,
  TestTube
} from 'lucide-react';

// Advanced production data structures
const recipes = [
  {
    id: 'RCP-001',
    name: 'Royal Oud Premium - 30ml',
    nameArabic: 'العود الملكي الفاخر - ٣٠ مل',
    category: 'Finished Perfume',
    version: '3.2',
    yield: 30, // ml
    batchSize: 100, // bottles
    costPerUnit: 85.50,
    sellingPrice: 450,
    margin: 77.8,
    ingredients: [
      { material: 'Cambodian Oud Oil', quantity: 4.5, unit: 'ml', percentage: 15, cost: 180 },
      { material: 'Ethyl Alcohol 95%', quantity: 24, unit: 'ml', percentage: 80, cost: 2.40 },
      { material: 'Rose Otto', quantity: 0.9, unit: 'ml', percentage: 3, cost: 45 },
      { material: 'Fixative Base', quantity: 0.6, unit: 'ml', percentage: 2, cost: 12 }
    ],
    instructions: [
      'Pre-chill alcohol to 5°C',
      'Add oud oil slowly while stirring',
      'Blend rose otto with fixative',
      'Combine all ingredients',
      'Macerate for 30 days at 18°C',
      'Filter and test',
      'Fill into bottles'
    ],
    macerationTime: 30, // days
    qualityChecks: ['Clarity Test', 'Scent Profile', 'Longevity Test', 'Projection Test']
  },
  {
    id: 'RCP-002',
    name: 'Oud Oil Distillation',
    nameArabic: 'تقطير زيت العود',
    category: 'Semi-Finished Oil',
    version: '2.1',
    yield: 50, // ml
    batchSize: 1, // batch
    costPerUnit: 800,
    sellingPrice: 1200,
    margin: 33.3,
    ingredients: [
      { material: 'Cambodian Oud Chips Premium', quantity: 2.5, unit: 'kg', percentage: 100, cost: 6250 }
    ],
    instructions: [
      'Soak chips in water for 24 hours',
      'Load into distillation apparatus',
      'Distill at 100°C for 72 hours',
      'Separate oil from hydrosol',
      'Age oil for 90 days',
      'Quality test and bottle'
    ],
    soakingTime: 1, // days
    distillationTime: 3, // days
    agingTime: 90, // days
    expectedYield: 2, // percentage
    qualityChecks: ['Specific Gravity', 'Refractive Index', 'GC-MS Analysis', 'Olfactory Evaluation']
  },
  {
    id: 'RCP-003',
    name: 'Raw Oud Segregation',
    nameArabic: 'فصل العود الخام',
    category: 'Multi-Output Process',
    version: '1.0',
    yield: 1000, // grams input
    batchSize: 1, // batch
    costPerUnit: 2500,
    outputs: [
      { name: 'Super Grade Chips', quantity: 300, unit: 'gram', percentage: 30, value: 15 },
      { name: 'Premium Grade Chips', quantity: 200, unit: 'gram', percentage: 20, value: 12 },
      { name: 'Standard Grade Chips', quantity: 200, unit: 'gram', percentage: 20, value: 8 },
      { name: 'Oud Powder', quantity: 250, unit: 'gram', percentage: 25, value: 5 },
      { name: 'Oud Dust', quantity: 50, unit: 'gram', percentage: 5, value: 2 }
    ],
    instructions: [
      'Clean raw oud wood',
      'Sort by color and resin content',
      'Cut super grade pieces (dark, heavy resin)',
      'Cut premium grade pieces (medium resin)',
      'Cut standard grade pieces (light resin)',
      'Grind remaining into powder',
      'Collect dust for incense'
    ],
    qualityChecks: ['Visual Inspection', 'Resin Content', 'Moisture Test', 'Weight Verification']
  }
];

const productionOrders = [
  {
    id: 'PO-2024-001',
    recipeId: 'RCP-001',
    recipeName: 'Royal Oud Premium - 30ml',
    batchNumber: 'ROY-001-2024',
    quantity: 100,
    unit: 'bottles',
    status: 'In Maceration',
    priority: 'High',
    startDate: '2024-09-15',
    expectedCompletion: '2024-10-15',
    actualCompletion: null,
    progress: 65,
    operator: 'Ahmed Al-Rashid',
    supervisor: 'Omar Saeed',
    stage: 'Maceration',
    daysRemaining: 15,
    qualityStatus: 'Pending',
    cost: {
      materials: 7850,
      labor: 2400,
      overhead: 1200,
      total: 11450
    },
    batches: [
      {
        stage: 'Mixing',
        status: 'Completed',
        startTime: '2024-09-15 09:00',
        endTime: '2024-09-15 11:30',
        operator: 'Ahmed Al-Rashid',
        notes: 'All ingredients mixed according to recipe'
      },
      {
        stage: 'Maceration',
        status: 'In Progress',
        startTime: '2024-09-15 12:00',
        endTime: null,
        operator: 'System Automated',
        notes: 'Temperature maintained at 18°C'
      }
    ]
  },
  {
    id: 'PO-2024-002',
    recipeId: 'RCP-002',
    recipeName: 'Oud Oil Distillation',
    batchNumber: 'DIST-002-2024',
    quantity: 1,
    unit: 'batch',
    status: 'Distillation',
    priority: 'Medium',
    startDate: '2024-09-20',
    expectedCompletion: '2024-12-20',
    actualCompletion: null,
    progress: 25,
    operator: 'Fatima Hassan',
    supervisor: 'Omar Saeed',
    stage: 'Distillation',
    daysRemaining: 2,
    qualityStatus: 'Not Started',
    cost: {
      materials: 6250,
      labor: 3600,
      overhead: 1800,
      total: 11650
    },
    batches: [
      {
        stage: 'Soaking',
        status: 'Completed',
        startTime: '2024-09-20 08:00',
        endTime: '2024-09-21 08:00',
        operator: 'Fatima Hassan',
        notes: 'Chips soaked for 24 hours'
      },
      {
        stage: 'Distillation',
        status: 'In Progress',
        startTime: '2024-09-21 09:00',
        endTime: null,
        operator: 'Fatima Hassan',
        notes: 'Day 2 of 3-day distillation'
      }
    ]
  },
  {
    id: 'PO-2024-003',
    recipeId: 'RCP-003',
    recipeName: 'Raw Oud Segregation',
    batchNumber: 'SEG-003-2024',
    quantity: 5,
    unit: 'kg',
    status: 'Quality Check',
    priority: 'Low',
    startDate: '2024-09-28',
    expectedCompletion: '2024-09-29',
    actualCompletion: null,
    progress: 90,
    operator: 'Hassan Ali',
    supervisor: 'Omar Saeed',
    stage: 'Quality Control',
    daysRemaining: 0,
    qualityStatus: 'In Review',
    cost: {
      materials: 12500,
      labor: 800,
      overhead: 400,
      total: 13700
    }
  }
];

const productionSchedule = [
  {
    id: 'SCH-001',
    date: '2024-10-01',
    shift: 'Morning',
    operator: 'Ahmed Al-Rashid',
    orders: ['PO-2024-001', 'PO-2024-004'],
    capacity: 80,
    utilization: 95
  },
  {
    id: 'SCH-002',
    date: '2024-10-01',
    shift: 'Evening',
    operator: 'Fatima Hassan',
    orders: ['PO-2024-002'],
    capacity: 80,
    utilization: 60
  }
];

const wastageLog = [
  {
    id: 'WST-001',
    date: '2024-09-29',
    batchNumber: 'ROY-001-2024',
    material: 'Cambodian Oud Oil',
    plannedQty: 450,
    actualQty: 435,
    wastage: 15,
    unit: 'ml',
    percentage: 3.3,
    reason: 'Spillage during transfer',
    cost: 60,
    operator: 'Ahmed Al-Rashid'
  },
  {
    id: 'WST-002',
    date: '2024-09-28',
    batchNumber: 'DIST-002-2024',
    material: 'Oud Chips',
    plannedQty: 2500,
    actualQty: 2450,
    wastage: 50,
    unit: 'gram',
    percentage: 2.0,
    reason: 'Cleaning loss',
    cost: 125,
    operator: 'Fatima Hassan'
  }
];

export default function AdvancedProductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isWastageDialogOpen, setIsWastageDialogOpen] = useState(false);

  // Filter production orders
  const filteredOrders = productionOrders.filter(order => {
    const matchesSearch = order.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate production metrics
  const totalOrders = productionOrders.length;
  const activeOrders = productionOrders.filter(order =>
    !['Completed', 'Cancelled'].includes(order.status)
  ).length;
  const completedToday = productionOrders.filter(order =>
    order.actualCompletion === new Date().toISOString().split('T')[0]
  ).length;
  const totalValue = productionOrders.reduce((sum, order) => sum + order.cost.total, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': case 'In Maceration': case 'Distillation': return 'bg-blue-100 text-blue-800';
      case 'Quality Check': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Factory className="h-8 w-8 text-amber-600" />
            Advanced Production Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Multi-level production, recipe management, and batch tracking for perfume & oud
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4" />
            New Production Order
          </Button>
        </div>
      </div>

      {/* Production Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-muted-foreground">
              of {totalOrders} total orders
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
            <p className="text-xs text-muted-foreground">
              Production batches
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Active batches value
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              Current utilization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="orders">Production Orders</TabsTrigger>
          <TabsTrigger value="recipes">Recipes & BOM</TabsTrigger>
          <TabsTrigger value="schedule">Planning & Schedule</TabsTrigger>
          <TabsTrigger value="costing">Costing & Wastage</TabsTrigger>
          <TabsTrigger value="distillation">Distillation Lab</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Production Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <CardTitle>Production Orders</CardTitle>
                  <CardDescription>
                    Track multi-level production with batch and lot management
                  </CardDescription>
                </div>
                <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Production Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Production Order</DialogTitle>
                      <DialogDescription>
                        Start a new production batch with recipe and scheduling
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Recipe</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select recipe" />
                            </SelectTrigger>
                            <SelectContent>
                              {recipes.map((recipe) => (
                                <SelectItem key={recipe.id} value={recipe.id}>
                                  {recipe.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Batch Size</Label>
                          <Input type="number" placeholder="Quantity" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Priority</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Operator</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ahmed">Ahmed Al-Rashid</SelectItem>
                              <SelectItem value="fatima">Fatima Hassan</SelectItem>
                              <SelectItem value="hassan">Hassan Ali</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Textarea placeholder="Production notes and special instructions" />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsOrderDialogOpen(false)}>
                          Create Order
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by recipe name or batch number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="In Maceration">In Maceration</SelectItem>
                    <SelectItem value="Distillation">Distillation</SelectItem>
                    <SelectItem value="Quality Check">Quality Check</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Production Orders Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Details</TableHead>
                      <TableHead>Recipe & Batch</TableHead>
                      <TableHead>Progress & Status</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-gray-600">{order.recipeName}</div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(order.priority)}>
                                {order.priority}
                              </Badge>
                              <Badge variant="outline">
                                {order.operator}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div><strong>Batch:</strong> {order.batchNumber}</div>
                            <div><strong>Quantity:</strong> {order.quantity} {order.unit}</div>
                            <div><strong>Stage:</strong> {order.stage}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="w-full">
                              <Progress value={order.progress} className="h-2" />
                              <span className="text-xs text-gray-500">{order.progress}% complete</span>
                            </div>
                            <div className="text-xs">
                              QC: <span className={`font-medium ${
                                order.qualityStatus === 'Passed' ? 'text-green-600' :
                                order.qualityStatus === 'Failed' ? 'text-red-600' :
                                'text-orange-600'
                              }`}>
                                {order.qualityStatus}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div><strong>Started:</strong> {order.startDate}</div>
                            <div><strong>Expected:</strong> {order.expectedCompletion}</div>
                            {order.daysRemaining > 0 && (
                              <div className="text-orange-600">
                                <strong>{order.daysRemaining} days remaining</strong>
                              </div>
                            )}
                            {order.actualCompletion && (
                              <div className="text-green-600">
                                <strong>Completed:</strong> {order.actualCompletion}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="font-medium">AED {order.cost.total.toLocaleString()}</div>
                            <div className="text-gray-600">
                              Materials: {order.cost.materials.toLocaleString()}
                            </div>
                            <div className="text-gray-600">
                              Labor: {order.cost.labor.toLocaleString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <FlaskConical className="h-3 w-3" />
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

        {/* Recipes & BOM Tab */}
        <TabsContent value="recipes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-amber-600" />
                    Recipes & Bill of Materials
                  </CardTitle>
                  <CardDescription>
                    Manage formulas, ingredient ratios, and production instructions
                  </CardDescription>
                </div>
                <Dialog open={isRecipeDialogOpen} onOpenChange={setIsRecipeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Recipe
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Create New Recipe</DialogTitle>
                      <DialogDescription>
                        Define ingredients, ratios, and production instructions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Recipe Name</Label>
                          <Input placeholder="Enter recipe name" />
                        </div>
                        <div>
                          <Label>Arabic Name</Label>
                          <Input placeholder="الاسم بالعربية" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="perfume">Finished Perfume</SelectItem>
                              <SelectItem value="oil">Semi-Finished Oil</SelectItem>
                              <SelectItem value="segregation">Multi-Output Process</SelectItem>
                              <SelectItem value="distillation">Distillation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Batch Size</Label>
                          <Input type="number" placeholder="Quantity" />
                        </div>
                        <div>
                          <Label>Unit</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bottles">Bottles</SelectItem>
                              <SelectItem value="ml">Milliliters</SelectItem>
                              <SelectItem value="kg">Kilograms</SelectItem>
                              <SelectItem value="batch">Batch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Production Instructions</Label>
                        <Textarea placeholder="Step-by-step production instructions" rows={4} />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsRecipeDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsRecipeDialogOpen(false)}>
                          Create Recipe
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{recipe.name}</h3>
                        <p className="text-sm text-gray-600">{recipe.nameArabic}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className="bg-amber-100 text-amber-800">
                            {recipe.category}
                          </Badge>
                          <Badge variant="outline">
                            v{recipe.version}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Batch: {recipe.batchSize} units
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {recipe.margin}% margin
                        </div>
                        <div className="text-sm text-gray-600">
                          Cost: AED {recipe.costPerUnit}
                        </div>
                        <div className="text-sm text-gray-600">
                          Price: AED {recipe.sellingPrice}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Ingredients */}
                      <div>
                        <h4 className="font-medium mb-3">Bill of Materials</h4>
                        <div className="space-y-2">
                          {recipe.ingredients?.map((ingredient, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{ingredient.material}</span>
                                <div className="text-sm text-gray-600">
                                  {ingredient.quantity} {ingredient.unit} ({ingredient.percentage}%)
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-medium">AED {ingredient.cost}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Instructions */}
                      <div>
                        <h4 className="font-medium mb-3">Production Instructions</h4>
                        <div className="space-y-2">
                          {recipe.instructions.map((instruction, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-800 rounded-full text-xs flex items-center justify-center font-medium">
                                {idx + 1}
                              </span>
                              <span className="text-sm">{instruction}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Multi-output for segregation */}
                    {recipe.outputs && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">Expected Outputs</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {recipe.outputs.map((output, idx) => (
                            <div key={idx} className="p-3 border rounded">
                              <div className="font-medium">{output.name}</div>
                              <div className="text-sm text-gray-600">
                                {output.quantity} {output.unit} ({output.percentage}%)
                              </div>
                              <div className="text-sm text-green-600">
                                Value: AED {output.value}/unit
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timing Information */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {recipe.macerationTime && (
                          <div>
                            <span className="text-gray-600">Maceration:</span>
                            <div className="font-medium">{recipe.macerationTime} days</div>
                          </div>
                        )}
                        {recipe.distillationTime && (
                          <div>
                            <span className="text-gray-600">Distillation:</span>
                            <div className="font-medium">{recipe.distillationTime} days</div>
                          </div>
                        )}
                        {recipe.agingTime && (
                          <div>
                            <span className="text-gray-600">Aging:</span>
                            <div className="font-medium">{recipe.agingTime} days</div>
                          </div>
                        )}
                        {recipe.expectedYield && (
                          <div>
                            <span className="text-gray-600">Expected Yield:</span>
                            <div className="font-medium">{recipe.expectedYield}%</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit Recipe
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calculator className="h-3 w-3 mr-1" />
                        Scale Recipe
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Planning & Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  Production Schedule
                </CardTitle>
                <CardDescription>
                  Plan and schedule production orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productionSchedule.map((schedule) => (
                    <div key={schedule.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{schedule.date}</h4>
                          <p className="text-sm text-gray-600">{schedule.shift} Shift</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Utilization</div>
                          <div className="font-medium">{schedule.utilization}%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Operator:</strong> {schedule.operator}
                        </div>
                        <div className="text-sm">
                          <strong>Orders:</strong> {schedule.orders.join(', ')}
                        </div>
                        <Progress value={schedule.utilization} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Capacity Planning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                  Capacity Planning
                </CardTitle>
                <CardDescription>
                  Monitor production capacity and utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="text-sm text-gray-600">Daily Capacity</div>
                      <div className="text-2xl font-bold">160 units</div>
                      <div className="text-sm text-green-600">Available</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600">Current Load</div>
                      <div className="text-2xl font-bold">131 units</div>
                      <div className="text-sm text-orange-600">82% utilized</div>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Weekly Forecast</h4>
                    <div className="space-y-3">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => {
                        const utilization = [85, 92, 78, 88, 75][idx];
                        return (
                          <div key={day} className="flex items-center justify-between">
                            <span className="text-sm font-medium w-20">{day}</span>
                            <div className="flex-1 mx-4">
                              <Progress value={utilization} className="h-2" />
                            </div>
                            <span className="text-sm w-12 text-right">{utilization}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Resource Allocation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Operators Available:</span>
                        <span className="font-medium">6/8</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equipment Utilization:</span>
                        <span className="font-medium">4/6 stations</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Raw Materials:</span>
                        <span className="font-medium text-green-600">Sufficient</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Costing & Wastage Tab */}
        <TabsContent value="costing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Costing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-amber-600" />
                  Production Costing
                </CardTitle>
                <CardDescription>
                  Track costs and profitability by batch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productionOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{order.batchNumber}</h4>
                          <p className="text-sm text-gray-600">{order.recipeName}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Materials:</span>
                            <div className="font-medium">AED {order.cost.materials.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Labor:</span>
                            <div className="font-medium">AED {order.cost.labor.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Overhead:</span>
                            <div className="font-medium">AED {order.cost.overhead.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Cost:</span>
                            <div className="font-medium text-red-600">AED {order.cost.total.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Cost per Unit:</span>
                              <div className="font-medium">AED {(order.cost.total / order.quantity).toFixed(2)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Expected Revenue:</span>
                              <div className="font-medium text-green-600">AED {(order.quantity * 450).toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wastage Control */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Wastage Control
                    </CardTitle>
                    <CardDescription>
                      Monitor and control production wastage
                    </CardDescription>
                  </div>
                  <Dialog open={isWastageDialogOpen} onOpenChange={setIsWastageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Log Wastage
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Log Production Wastage</DialogTitle>
                        <DialogDescription>
                          Record material wastage for cost control
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Batch Number</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select batch" />
                              </SelectTrigger>
                              <SelectContent>
                                {productionOrders.map((order) => (
                                  <SelectItem key={order.id} value={order.batchNumber}>
                                    {order.batchNumber}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Material</Label>
                            <Input placeholder="Material name" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Planned Qty</Label>
                            <Input type="number" placeholder="0.00" />
                          </div>
                          <div>
                            <Label>Actual Qty</Label>
                            <Input type="number" placeholder="0.00" />
                          </div>
                          <div>
                            <Label>Unit</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ml">Milliliter</SelectItem>
                                <SelectItem value="gram">Gram</SelectItem>
                                <SelectItem value="kg">Kilogram</SelectItem>
                                <SelectItem value="piece">Piece</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Reason for Wastage</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="spillage">Spillage</SelectItem>
                              <SelectItem value="cleaning">Cleaning Loss</SelectItem>
                              <SelectItem value="evaporation">Evaporation</SelectItem>
                              <SelectItem value="quality">Quality Issues</SelectItem>
                              <SelectItem value="equipment">Equipment Malfunction</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Textarea placeholder="Additional details about the wastage" />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsWastageDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsWastageDialogOpen(false)}>
                            Log Wastage
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-3">
                      <div className="text-sm text-gray-600">Today's Wastage</div>
                      <div className="text-lg font-bold text-red-600">AED 185</div>
                      <div className="text-xs text-gray-500">2.1% of production</div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-sm text-gray-600">This Week</div>
                      <div className="text-lg font-bold text-orange-600">AED 1,240</div>
                      <div className="text-xs text-gray-500">1.8% average</div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-sm text-gray-600">This Month</div>
                      <div className="text-lg font-bold text-green-600">AED 4,890</div>
                      <div className="text-xs text-gray-500">1.5% - Improved!</div>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recent Wastage Log</h4>
                    <div className="space-y-2">
                      {wastageLog.map((waste) => (
                        <div key={waste.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <div className="font-medium">{waste.material}</div>
                            <div className="text-sm text-gray-600">
                              {waste.batchNumber} • {waste.date}
                            </div>
                            <div className="text-sm text-gray-600">
                              Reason: {waste.reason}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-red-600">
                              -{waste.wastage} {waste.unit}
                            </div>
                            <div className="text-sm text-gray-600">
                              {waste.percentage}% • AED {waste.cost}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Distillation Lab Tab */}
        <TabsContent value="distillation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-amber-600" />
                Distillation & Extraction Lab
              </CardTitle>
              <CardDescription>
                Specialized management for oud distillation and oil extraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Active Distillation Processes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Active Distillation Processes</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">Batch: DIST-002-2024</h4>
                          <p className="text-sm text-gray-600">Cambodian Oud Oil</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Day 2 of 3</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Input Material:</span>
                            <div className="font-medium">2.5 kg Oud Chips</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Temperature:</span>
                            <div className="font-medium">100°C</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Pressure:</span>
                            <div className="font-medium">1.2 atm</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Current Yield:</span>
                            <div className="font-medium">15 ml</div>
                          </div>
                        </div>
                        <Progress value={66} className="h-2" />
                        <div className="text-xs text-gray-500">Expected completion: 2024-09-23</div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">Batch: DIST-003-2024</h4>
                          <p className="text-sm text-gray-600">Indian Oud Oil</p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">Soaking</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Input Material:</span>
                            <div className="font-medium">3.0 kg Oud Chips</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Soaking Time:</span>
                            <div className="font-medium">18 hours</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Water Level:</span>
                            <div className="font-medium">Optimal</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <div className="font-medium">Ready Soon</div>
                          </div>
                        </div>
                        <Progress value={75} className="h-2" />
                        <div className="text-xs text-gray-500">Distillation starts: Tomorrow 8:00 AM</div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Distillation Equipment */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Equipment Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Distillation Unit 1</h4>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Capacity: 5 kg</div>
                        <div>Current Batch: DIST-002-2024</div>
                        <div>Operator: Fatima Hassan</div>
                        <div>Next Service: 2024-10-15</div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Distillation Unit 2</h4>
                        <Badge className="bg-yellow-100 text-yellow-800">Available</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Capacity: 3 kg</div>
                        <div>Status: Ready for use</div>
                        <div>Last cleaned: Today</div>
                        <div>Next Service: 2024-11-01</div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Distillation Unit 3</h4>
                        <Badge className="bg-red-100 text-red-800">Maintenance</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Capacity: 7 kg</div>
                        <div>Issue: Temperature sensor</div>
                        <div>ETA Repair: 2024-10-05</div>
                        <div>Technician: Omar Saeed</div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Quality Control */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quality Control Lab</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Pending Tests</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">ROY-001-2024</div>
                            <div className="text-sm text-gray-600">Longevity Test</div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">DIST-002-2024</div>
                            <div className="text-sm text-gray-600">GC-MS Analysis</div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">SEG-003-2024</div>
                            <div className="text-sm text-gray-600">Moisture Content</div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Test Results Summary</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Tests Completed:</span>
                            <div className="font-medium">24</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Pass Rate:</span>
                            <div className="font-medium text-green-600">92%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Failed Tests:</span>
                            <div className="font-medium text-red-600">2</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Test Time:</span>
                            <div className="font-medium">2.5 hours</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="text-sm text-gray-600 mb-1">Most Common Issues:</div>
                          <div className="text-sm">• Clarity below standard (2 cases)</div>
                          <div className="text-sm">• Scent profile deviation (1 case)</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  Production Efficiency
                </CardTitle>
                <CardDescription>
                  Monitor yields, efficiency, and profitability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-3">
                      <div className="text-sm text-gray-600">Avg Oil Yield</div>
                      <div className="text-2xl font-bold">2.3%</div>
                      <div className="text-xs text-green-600">+0.3% vs target</div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-sm text-gray-600">Production Efficiency</div>
                      <div className="text-2xl font-bold">94%</div>
                      <div className="text-xs text-blue-600">Above target</div>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Batch Profitability</h4>
                    <div className="space-y-2">
                      {[
                        { batch: 'ROY-001-2024', margin: 77.8, revenue: 45000 },
                        { batch: 'AMB-002-2024', margin: 65.2, revenue: 32500 },
                        { batch: 'DIST-002-2024', margin: 33.3, revenue: 60000 }
                      ].map((batch, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{batch.batch}</span>
                          <div className="text-right">
                            <div className="font-medium text-green-600">{batch.margin}%</div>
                            <div className="text-sm text-gray-600">AED {batch.revenue.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Material Consumption Trends</h4>
                    <div className="space-y-3">
                      {['Oud Chips', 'Ethyl Alcohol', 'Rose Otto'].map((material, idx) => {
                        const consumption = [85, 92, 78][idx];
                        return (
                          <div key={material} className="flex items-center justify-between">
                            <span className="text-sm font-medium w-24">{material}</span>
                            <div className="flex-1 mx-4">
                              <Progress value={consumption} className="h-2" />
                            </div>
                            <span className="text-sm w-12 text-right">{consumption}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Performance Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-600" />
                  Production KPIs
                </CardTitle>
                <CardDescription>
                  Track key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">On-Time Delivery</span>
                        <span className="text-lg font-bold text-green-600">96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">Target: 95%</div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Quality Pass Rate</span>
                        <span className="text-lg font-bold text-green-600">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">Target: 90%</div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Equipment Utilization</span>
                        <span className="text-lg font-bold text-orange-600">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">Target: 80%</div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Wastage Control</span>
                        <span className="text-lg font-bold text-green-600">1.5%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">Target: < 2%</div>
                    </Card>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Production Forecast</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Next Week Capacity:</span>
                        <span className="font-medium">800 units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scheduled Orders:</span>
                        <span className="font-medium">720 units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available Capacity:</span>
                        <span className="font-medium text-green-600">80 units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Raw Material Needs:</span>
                        <span className="font-medium">AED 125,400</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}