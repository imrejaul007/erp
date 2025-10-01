'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Package, AlertTriangle, CheckCircle, Clock, QrCode, Truck, RotateCcw, Eye, Edit, Trash2 } from 'lucide-react';
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
import { DatePicker } from '@/components/ui/date-picker';

// Mock data for production batches requiring materials
const productionBatches = [
  {
    id: 'PB001',
    product: 'Royal Oud Premium',
    recipe: 'RCP-001',
    quantity: 100,
    unit: 'bottles',
    status: 'Materials Pending',
    priority: 'High',
    startDate: '2024-10-02',
    operator: 'Ahmed Al-Rashid',
    materialsAssigned: 65,
    materialsTotal: 100,
  },
  {
    id: 'PB002',
    product: 'Amber Essence Deluxe',
    recipe: 'RCP-002',
    quantity: 75,
    unit: 'bottles',
    status: 'Ready to Start',
    priority: 'Medium',
    startDate: '2024-10-03',
    operator: 'Fatima Hassan',
    materialsAssigned: 100,
    materialsTotal: 100,
  },
  {
    id: 'PB003',
    product: 'Desert Rose Attar',
    recipe: 'RCP-003',
    quantity: 50,
    unit: 'bottles',
    status: 'In Progress',
    priority: 'High',
    startDate: '2024-10-01',
    operator: 'Mohammed Saeed',
    materialsAssigned: 100,
    materialsTotal: 100,
  },
];

// Mock data for materials inventory
const materials = [
  {
    id: 'MAT-001',
    name: 'Cambodian Oud Oil',
    category: 'Essential Oils',
    grade: 'Premium',
    supplier: 'Al-Khaleej Trading',
    currentStock: 250,
    unit: 'ml',
    minStock: 50,
    maxStock: 500,
    costPerUnit: 120,
    currency: 'AED',
    location: 'Cold Storage A-1',
    batchNumber: 'KH-2024-001',
    expiryDate: '2026-12-31',
    receivedDate: '2024-09-15',
    qualityGrade: 'A+',
    certifications: ['Organic', 'Halal', 'GCC Approved'],
  },
  {
    id: 'MAT-002',
    name: 'Damask Rose Water',
    category: 'Hydrosols',
    grade: 'Premium',
    supplier: 'Rose Valley Co.',
    currentStock: 180,
    unit: 'ml',
    minStock: 30,
    maxStock: 300,
    costPerUnit: 25,
    currency: 'AED',
    location: 'Ambient Storage B-2',
    batchNumber: 'RV-2024-008',
    expiryDate: '2025-06-30',
    receivedDate: '2024-09-20',
    qualityGrade: 'A+',
    certifications: ['Natural', 'Steam Distilled'],
  },
  {
    id: 'MAT-003',
    name: 'Sandalwood Extract',
    category: 'Extracts',
    grade: 'Premium',
    supplier: 'Mysore Sandalwood',
    currentStock: 95,
    unit: 'ml',
    minStock: 20,
    maxStock: 200,
    costPerUnit: 45,
    currency: 'AED',
    location: 'Temperature Controlled C-3',
    batchNumber: 'MS-2024-012',
    expiryDate: '2027-03-15',
    receivedDate: '2024-08-10',
    qualityGrade: 'Premium',
    certifications: ['Sustainable', 'CITES Compliant'],
  },
  {
    id: 'MAT-004',
    name: 'Jojoba Carrier Oil',
    category: 'Carrier Oils',
    grade: 'Organic',
    supplier: 'Natural Oils UAE',
    currentStock: 45,
    unit: 'ml',
    minStock: 100,
    maxStock: 500,
    costPerUnit: 8,
    currency: 'AED',
    location: 'Ambient Storage B-1',
    batchNumber: 'NO-2024-025',
    expiryDate: '2025-12-31',
    receivedDate: '2024-09-05',
    qualityGrade: 'Organic',
    certifications: ['Organic', 'Cold Pressed'],
  },
];

// Mock data for material assignments
const materialAssignments = [
  {
    id: 'MA-001',
    batchId: 'PB001',
    materialId: 'MAT-001',
    materialName: 'Cambodian Oud Oil',
    requiredQuantity: 15,
    assignedQuantity: 15,
    unit: 'ml',
    status: 'Allocated',
    assignedDate: '2024-09-28',
    assignedBy: 'Material Manager',
    location: 'Cold Storage A-1',
    batchNumber: 'KH-2024-001',
    reservationId: 'RSV-001',
  },
  {
    id: 'MA-002',
    batchId: 'PB001',
    materialId: 'MAT-002',
    materialName: 'Damask Rose Water',
    requiredQuantity: 5,
    assignedQuantity: 0,
    unit: 'ml',
    status: 'Pending',
    assignedDate: null,
    assignedBy: null,
    location: 'Ambient Storage B-2',
    batchNumber: 'RV-2024-008',
    reservationId: null,
  },
  {
    id: 'MA-003',
    batchId: 'PB001',
    materialId: 'MAT-004',
    materialName: 'Jojoba Carrier Oil',
    requiredQuantity: 70,
    assignedQuantity: 0,
    unit: 'ml',
    status: 'Insufficient Stock',
    assignedDate: null,
    assignedBy: null,
    location: 'Ambient Storage B-1',
    batchNumber: 'NO-2024-025',
    reservationId: null,
  },
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode } } = {
    'Materials Pending': { variant: 'outline', icon: <Clock className="w-3 h-3 mr-1" /> },
    'Ready to Start': { variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
    'In Progress': { variant: 'secondary', icon: <RotateCcw className="w-3 h-3 mr-1" /> },
    'Completed': { variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
  };
  const config = variants[status] || { variant: 'outline', icon: null };
  return (
    <Badge variant={config.variant} className="flex items-center">
      {config.icon}
      {status}
    </Badge>
  );
};

const getMaterialStatusBadge = (status: string) => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode } } = {
    'Allocated': { variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
    'Pending': { variant: 'outline', icon: <Clock className="w-3 h-3 mr-1" /> },
    'Insufficient Stock': { variant: 'destructive', icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
    'Reserved': { variant: 'secondary', icon: <Package className="w-3 h-3 mr-1" /> },
  };
  const config = variants[status] || { variant: 'outline', icon: null };
  return (
    <Badge variant={config.variant} className="flex items-center">
      {config.icon}
      {status}
    </Badge>
  );
};

const getStockStatusBadge = (current: number, min: number, max: number) => {
  const percentage = (current / max) * 100;
  if (current <= min) {
    return <Badge variant="destructive" className="flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</Badge>;
  } else if (percentage < 30) {
    return <Badge className="bg-yellow-500 text-white flex items-center"><Clock className="w-3 h-3 mr-1" />Running Low</Badge>;
  } else {
    return <Badge variant="default" className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" />In Stock</Badge>;
  }
};

export default function BatchMaterialsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [isAssignMaterialDialogOpen, setIsAssignMaterialDialogOpen] = useState(false);
  const [isMaterialDetailsDialogOpen, setIsMaterialDetailsDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<typeof materials[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const filteredBatches = productionBatches.filter(batch => {
    const matchesSearch = batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || batch.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleViewMaterial = (material: typeof materials[0]) => {
    setSelectedMaterial(material);
    setIsMaterialDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-8 w-8 text-oud-600" />
            Batch Materials Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Assign and track raw materials for production batches
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <QrCode className="h-4 w-4" />
            Scan Material
          </Button>
          <Dialog open={isAssignMaterialDialogOpen} onOpenChange={setIsAssignMaterialDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
                <Plus className="h-4 w-4" />
                Assign Materials
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Assign Materials to Batch</DialogTitle>
                <DialogDescription>
                  Select materials and quantities for production batch
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assign-batch">Select Batch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {productionBatches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.id} - {batch.product}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assign-material">Select Material</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name} - {material.currentStock} {material.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="required-qty">Required Quantity</Label>
                    <Input id="required-qty" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assign-qty">Assign Quantity</Label>
                    <Input id="assign-qty" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input value="ml" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Expected Usage Date</Label>
                  <DatePicker
                    date={selectedDate}
                    setDate={setSelectedDate}
                    placeholder="Select usage date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignment-notes">Assignment Notes</Label>
                  <Textarea
                    id="assignment-notes"
                    placeholder="Special instructions or notes for material handling..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAssignMaterialDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAssignMaterialDialogOpen(false)}>
                    Assign Material
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materialAssignments.filter(ma => ma.status === 'Pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Materials awaiting assignment
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materials.filter(m => m.currentStock <= m.minStock).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need immediate reorder
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials Allocated</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materialAssignments.filter(ma => ma.status === 'Allocated').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for production
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {materials.reduce((acc, m) => acc + (m.currentStock * m.costPerUnit), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="batches" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="batches">Production Batches</TabsTrigger>
          <TabsTrigger value="assignments">Material Assignments</TabsTrigger>
          <TabsTrigger value="inventory">Materials Inventory</TabsTrigger>
          <TabsTrigger value="requests">Material Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Batches Requiring Materials</CardTitle>
              <CardDescription>
                Track material assignment progress for active production batches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search batches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="materials pending">Materials Pending</SelectItem>
                    <SelectItem value="ready to start">Ready to Start</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Batches Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Material Progress</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.id}</TableCell>
                        <TableCell>{batch.product}</TableCell>
                        <TableCell>{batch.quantity} {batch.unit}</TableCell>
                        <TableCell>{getStatusBadge(batch.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={(batch.materialsAssigned / batch.materialsTotal) * 100} className="w-20" />
                            <span className="text-sm text-muted-foreground">
                              {batch.materialsAssigned}/{batch.materialsTotal}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{batch.startDate}</TableCell>
                        <TableCell>{batch.operator}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Package className="h-4 w-4" />
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

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Assignments</CardTitle>
              <CardDescription>
                Track material allocation status for production batches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment ID</TableHead>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materialAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.id}</TableCell>
                        <TableCell>{assignment.batchId}</TableCell>
                        <TableCell>{assignment.materialName}</TableCell>
                        <TableCell>{assignment.requiredQuantity} {assignment.unit}</TableCell>
                        <TableCell>{assignment.assignedQuantity} {assignment.unit}</TableCell>
                        <TableCell>{getMaterialStatusBadge(assignment.status)}</TableCell>
                        <TableCell>{assignment.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <QrCode className="h-4 w-4" />
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

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Materials Inventory</CardTitle>
              <CardDescription>
                Monitor raw material stock levels and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search materials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              {/* Materials Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{material.name}</div>
                            <div className="text-sm text-muted-foreground">{material.grade}</div>
                          </div>
                        </TableCell>
                        <TableCell>{material.category}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{material.currentStock} {material.unit}</div>
                            <div className="text-sm text-muted-foreground">
                              Min: {material.minStock} | Max: {material.maxStock}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStockStatusBadge(material.currentStock, material.minStock, material.maxStock)}
                        </TableCell>
                        <TableCell>{material.supplier}</TableCell>
                        <TableCell>{material.currency} {material.costPerUnit}</TableCell>
                        <TableCell>{material.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewMaterial(material)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Truck className="h-4 w-4" />
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

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Requests</CardTitle>
              <CardDescription>
                Track material purchase requests and procurement status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Requests</h3>
                <p className="text-muted-foreground mb-4">
                  Material requests will appear here when low stock alerts are triggered
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Purchase Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Material Details Dialog */}
      <Dialog open={isMaterialDetailsDialogOpen} onOpenChange={setIsMaterialDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedMaterial && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-oud-600" />
                  {selectedMaterial.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedMaterial.id} • {selectedMaterial.category} • {selectedMaterial.grade}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Stock Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Current Stock</Label>
                    <p className="text-lg font-semibold">{selectedMaterial.currentStock} {selectedMaterial.unit}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Min Stock</Label>
                    <p className="text-sm">{selectedMaterial.minStock} {selectedMaterial.unit}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Max Stock</Label>
                    <p className="text-sm">{selectedMaterial.maxStock} {selectedMaterial.unit}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Unit Cost</Label>
                    <p className="text-sm">{selectedMaterial.currency} {selectedMaterial.costPerUnit}</p>
                  </div>
                </div>

                <Separator />

                {/* Supplier & Location */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Supplier Information</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">Supplier</Label>
                        <p className="text-sm">{selectedMaterial.supplier}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Batch Number</Label>
                        <p className="text-sm">{selectedMaterial.batchNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Received Date</Label>
                        <p className="text-sm">{selectedMaterial.receivedDate}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Storage & Quality</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">Location</Label>
                        <p className="text-sm">{selectedMaterial.location}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Quality Grade</Label>
                        <Badge variant="outline">{selectedMaterial.qualityGrade}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Expiry Date</Label>
                        <p className="text-sm">{selectedMaterial.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMaterial.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline">{cert}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    Print QR Code
                  </Button>
                  <Button variant="outline">
                    <Truck className="h-4 w-4 mr-2" />
                    Reorder
                  </Button>
                  <Button className="bg-oud-600 hover:bg-oud-700">
                    <Package className="h-4 w-4 mr-2" />
                    Assign to Batch
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