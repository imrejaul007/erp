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
import { Textarea } from '@/components/ui/textarea';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Droplets,
  Beaker,
  Leaf,
  Import,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';

interface RawMaterial {
  id: string;
  name: string;
  nameArabic: string;
  sku: string;
  category: string;
  subcategory: string;
  currentStock: number;
  unit: string;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  costPerUnit: number;
  totalValue: number;
  supplier: string;
  grade: 'PREMIUM' | 'STANDARD' | 'ECONOMY' | 'SPECIAL' | 'ORGANIC' | 'SYNTHETIC';
  origin: string;
  lastReceived: string;
  expiryDate?: string;
  batchNumber: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';
  storageLocation: string;
  density?: number;
  purity?: number;
  moistureContent?: number;
}

export default function RawMaterialsPage() {
  const [materials, setMaterials] = useState<RawMaterial[]>([
    {
      id: '1',
      name: 'Royal Cambodian Oud Oil',
      nameArabic: 'زيت العود الكمبودي الملكي',
      sku: 'RCO-001',
      category: 'Oud Oil',
      subcategory: 'Premium Oud',
      currentStock: 125.5,
      unit: 'ml',
      minimumStock: 50,
      maximumStock: 500,
      reorderLevel: 75,
      costPerUnit: 450,
      totalValue: 56475,
      supplier: 'Cambodia Oud Traders',
      grade: 'PREMIUM',
      origin: 'Cambodia',
      lastReceived: '2024-09-15',
      expiryDate: '2027-09-15',
      batchNumber: 'RCO-2024-Q3-001',
      status: 'IN_STOCK',
      storageLocation: 'Cold Storage A-1',
      density: 0.85,
      purity: 98.5,
      moistureContent: 0.2
    },
    {
      id: '2',
      name: 'Rose Petals (Bulgarian)',
      nameArabic: 'بتلات الورد البلغارية',
      sku: 'RP-BUL-002',
      category: 'Floral Materials',
      subcategory: 'Rose',
      currentStock: 2.5,
      unit: 'kg',
      minimumStock: 5,
      maximumStock: 25,
      reorderLevel: 7.5,
      costPerUnit: 180,
      totalValue: 450,
      supplier: 'Bulgarian Rose Co.',
      grade: 'ORGANIC',
      origin: 'Bulgaria',
      lastReceived: '2024-08-20',
      expiryDate: '2025-08-20',
      batchNumber: 'RP-2024-BUL-008',
      status: 'LOW_STOCK',
      storageLocation: 'Dry Storage B-3',
      density: 0.3,
      purity: 99.2,
      moistureContent: 12.5
    },
    {
      id: '3',
      name: 'Saffron Threads',
      nameArabic: 'خيوط الزعفران',
      sku: 'SAF-KAS-003',
      category: 'Spices',
      subcategory: 'Saffron',
      currentStock: 0,
      unit: 'gram',
      minimumStock: 100,
      maximumStock: 500,
      reorderLevel: 150,
      costPerUnit: 12,
      totalValue: 0,
      supplier: 'Kashmir Saffron House',
      grade: 'PREMIUM',
      origin: 'Kashmir',
      lastReceived: '2024-07-10',
      batchNumber: 'SAF-2024-K-005',
      status: 'OUT_OF_STOCK',
      storageLocation: 'Climate Control C-2',
      purity: 95.8,
      moistureContent: 8.2
    },
    {
      id: '4',
      name: 'Sandalwood Oil (Mysore)',
      nameArabic: 'زيت خشب الصندل الميسوري',
      sku: 'SWO-MYS-004',
      category: 'Wood Oils',
      subcategory: 'Sandalwood',
      currentStock: 89.2,
      unit: 'ml',
      minimumStock: 30,
      maximumStock: 200,
      reorderLevel: 45,
      costPerUnit: 280,
      totalValue: 24976,
      supplier: 'Mysore Sandalwood Corp',
      grade: 'PREMIUM',
      origin: 'India',
      lastReceived: '2024-09-05',
      expiryDate: '2026-09-05',
      batchNumber: 'SWO-2024-M-012',
      status: 'IN_STOCK',
      storageLocation: 'Temperature Control A-3',
      density: 0.98,
      purity: 92.3,
      moistureContent: 0.1
    }
  ]);

  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const categories = ['Oud Oil', 'Floral Materials', 'Spices', 'Wood Oils', 'Synthetic Components', 'Alcohol & Carriers'];
  const statuses = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRED'];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.nameArabic.includes(searchTerm) ||
                         material.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || material.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return 'bg-green-100 text-green-800';
      case 'LOW_STOCK': return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'ECONOMY': return 'bg-gray-100 text-gray-800';
      case 'SPECIAL': return 'bg-indigo-100 text-indigo-800';
      case 'ORGANIC': return 'bg-green-100 text-green-800';
      case 'SYNTHETIC': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = materials.reduce((sum, material) => sum + material.totalValue, 0);
  const lowStockCount = materials.filter(m => m.status === 'LOW_STOCK').length;
  const outOfStockCount = materials.filter(m => m.status === 'OUT_OF_STOCK').length;
  const totalItems = materials.length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Raw Materials Management</h1>
          <p className="text-gray-600">
            Manage raw materials for perfume production - oud, oils, botanicals, and chemicals
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Import className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Raw Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Raw Material</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Material Name</Label>
                  <Input id="name" placeholder="e.g., Rose Oil" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameArabic">Arabic Name</Label>
                  <Input id="nameArabic" placeholder="الاسم بالعربية" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="RO-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit of Measure</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">Milliliters (ml)</SelectItem>
                      <SelectItem value="gram">Grams (g)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="tola">Tola</SelectItem>
                      <SelectItem value="liter">Liters (L)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="ECONOMY">Economy</SelectItem>
                      <SelectItem value="SPECIAL">Special</SelectItem>
                      <SelectItem value="ORGANIC">Organic</SelectItem>
                      <SelectItem value="SYNTHETIC">Synthetic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                  Add Material
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Active raw materials</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              AED {totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Current inventory value</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{lowStockCount}</div>
            <p className="text-xs text-gray-500 mt-1">Items need reorder</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{outOfStockCount}</div>
            <p className="text-xs text-gray-500 mt-1">Critical items</p>
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
                  placeholder="Search materials by name, SKU, or Arabic name..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
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

      {/* Materials Table */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Beaker className="h-5 w-5 mr-2 text-amber-600" />
            Raw Materials Inventory
          </CardTitle>
          <CardDescription>
            Complete list of raw materials with stock levels and specifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id} className="hover:bg-amber-50/50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{material.name}</div>
                        <div className="text-sm text-gray-500">{material.nameArabic}</div>
                        <div className="text-xs text-gray-400">SKU: {material.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{material.category}</div>
                        <div className="text-xs text-gray-500">{material.subcategory}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {material.currentStock} {material.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          Min: {material.minimumStock} | Reorder: {material.reorderLevel}
                        </div>
                        {material.status === 'LOW_STOCK' && (
                          <div className="flex items-center text-xs text-orange-600 mt-1">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Below reorder level
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">AED {material.totalValue.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          @ AED {material.costPerUnit}/{material.unit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(material.grade)}>
                        {material.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(material.status)}>
                        {material.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{material.supplier}</div>
                        <div className="text-xs text-gray-500">{material.origin}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMaterial(material)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Material Details Modal */}
      {selectedMaterial && (
        <Dialog open={!!selectedMaterial} onOpenChange={() => setSelectedMaterial(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedMaterial.name} - Material Details</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="stock">Stock History</TabsTrigger>
                <TabsTrigger value="supplier">Supplier Info</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Material Name</Label>
                      <p className="text-lg font-semibold">{selectedMaterial.name}</p>
                      <p className="text-gray-600">{selectedMaterial.nameArabic}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Category</Label>
                      <p>{selectedMaterial.category} - {selectedMaterial.subcategory}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Current Stock</Label>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedMaterial.currentStock} {selectedMaterial.unit}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Total Value</Label>
                      <p className="text-2xl font-bold text-blue-600">
                        AED {selectedMaterial.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Storage Location</Label>
                      <p>{selectedMaterial.storageLocation}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Batch Number</Label>
                      <p>{selectedMaterial.batchNumber}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {selectedMaterial.density && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Density</Label>
                        <p>{selectedMaterial.density} g/ml</p>
                      </div>
                    )}
                    {selectedMaterial.purity && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Purity</Label>
                        <p>{selectedMaterial.purity}%</p>
                      </div>
                    )}
                    {selectedMaterial.moistureContent && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Moisture Content</Label>
                        <p>{selectedMaterial.moistureContent}%</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Grade</Label>
                      <Badge className={getGradeColor(selectedMaterial.grade)}>
                        {selectedMaterial.grade}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Origin</Label>
                      <p>{selectedMaterial.origin}</p>
                    </div>
                    {selectedMaterial.expiryDate && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Expiry Date</Label>
                        <p>{new Date(selectedMaterial.expiryDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stock">
                <p className="text-gray-600">Stock movement history would be displayed here...</p>
              </TabsContent>

              <TabsContent value="supplier">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Supplier</Label>
                    <p className="text-lg font-semibold">{selectedMaterial.supplier}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Last Received</Label>
                    <p>{new Date(selectedMaterial.lastReceived).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Cost per Unit</Label>
                    <p>AED {selectedMaterial.costPerUnit}</p>
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