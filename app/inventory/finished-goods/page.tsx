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
  Sparkles,
  ShoppingCart,
  BarChart3,
  Gift,
  Star,
  Eye,
  Copy,
  Calendar,
  MapPin,
  Tag,
  DollarSign
} from 'lucide-react';

interface FinishedProduct {
  id: string;
  name: string;
  nameArabic: string;
  sku: string;
  barcode: string;
  category: string;
  subcategory: string;
  productType: 'PERFUME' | 'ATTAR' | 'OUD' | 'INCENSE' | 'GIFT_SET' | 'ACCESSORY';
  brand: string;
  collection?: string;
  size: number;
  unit: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  costPerUnit: number;
  retailPrice: number;
  wholesalePrice: number;
  vipPrice: number;
  totalValue: number;
  currency: string;
  status: 'ACTIVE' | 'DISCONTINUED' | 'SEASONAL' | 'OUT_OF_STOCK' | 'COMING_SOON';
  qualityGrade: 'PREMIUM' | 'LUXURY' | 'STANDARD' | 'ECONOMY';
  storageLocation: string;
  shelfLife: number; // in months
  manufacturedDate: string;
  expiryDate: string;
  batchNumber: string;
  formula: {
    id: string;
    name: string;
    version: string;
  };
  packaging: {
    type: string;
    material: string;
    color: string;
    weight: number;
  };
  ingredients: string[];
  allergens: string[];
  certifications: string[];
  salesData: {
    totalSold: number;
    monthlyAverage: number;
    lastSaleDate: string;
    topMarkets: string[];
  };
  supplier?: string;
  manufacturingCost: number;
  margin: number;
  taxRate: number; // VAT rate in UAE
  tags: string[];
}

export default function FinishedGoodsPage() {
  const [products, setProducts] = useState<FinishedProduct[]>([
    {
      id: '1',
      name: 'Royal Oud Supreme',
      nameArabic: 'العود الملكي الفاخر',
      sku: 'ROS-100ML-001',
      barcode: '8901234567890',
      category: 'Perfume',
      subcategory: 'Oud Perfume',
      productType: 'PERFUME',
      brand: 'Oud Palace',
      collection: 'Royal Collection',
      size: 100,
      unit: 'ml',
      currentStock: 245,
      reservedStock: 15,
      availableStock: 230,
      minimumStock: 50,
      maximumStock: 500,
      reorderLevel: 75,
      costPerUnit: 180,
      retailPrice: 450,
      wholesalePrice: 350,
      vipPrice: 400,
      totalValue: 44100,
      currency: 'AED',
      status: 'ACTIVE',
      qualityGrade: 'PREMIUM',
      storageLocation: 'Warehouse A-1-B',
      shelfLife: 36,
      manufacturedDate: '2024-08-15',
      expiryDate: '2027-08-15',
      batchNumber: 'ROS-2024-08-001',
      formula: {
        id: 'F-ROS-001',
        name: 'Royal Oud Supreme Formula',
        version: 'v3.2'
      },
      packaging: {
        type: 'Luxury Bottle',
        material: 'Crystal Glass',
        color: 'Gold',
        weight: 350
      },
      ingredients: ['Cambodian Oud', 'Bulgarian Rose', 'Sandalwood', 'Amber', 'Musk'],
      allergens: ['Linalool', 'Geraniol', 'Citronellol'],
      certifications: ['Halal Certified', 'UAE Quality Mark', 'ISO 9001'],
      salesData: {
        totalSold: 450,
        monthlyAverage: 35,
        lastSaleDate: '2024-09-30',
        topMarkets: ['UAE', 'Saudi Arabia', 'Qatar']
      },
      supplier: 'In-House Production',
      manufacturingCost: 180,
      margin: 60,
      taxRate: 5,
      tags: ['Premium', 'Bestseller', 'Luxury', 'Royal Collection']
    },
    {
      id: '2',
      name: 'Jasmine Nights Attar',
      nameArabic: 'عطر ليالي الياسمين',
      sku: 'JNA-12ML-002',
      barcode: '8901234567891',
      category: 'Attar',
      subcategory: 'Floral Attar',
      productType: 'ATTAR',
      brand: 'Oud Palace',
      collection: 'Garden Series',
      size: 12,
      unit: 'ml',
      currentStock: 89,
      reservedStock: 8,
      availableStock: 81,
      minimumStock: 25,
      maximumStock: 200,
      reorderLevel: 40,
      costPerUnit: 95,
      retailPrice: 220,
      wholesalePrice: 170,
      vipPrice: 200,
      totalValue: 8455,
      currency: 'AED',
      status: 'ACTIVE',
      qualityGrade: 'LUXURY',
      storageLocation: 'Warehouse A-2-C',
      shelfLife: 24,
      manufacturedDate: '2024-09-01',
      expiryDate: '2026-09-01',
      batchNumber: 'JNA-2024-09-003',
      formula: {
        id: 'F-JNA-002',
        name: 'Jasmine Nights Traditional',
        version: 'v2.1'
      },
      packaging: {
        type: 'Traditional Bottle',
        material: 'Colored Glass',
        color: 'Purple',
        weight: 85
      },
      ingredients: ['Jasmine Sambac', 'Rose Damask', 'Sandalwood Base', 'White Musk'],
      allergens: ['Benzyl Benzoate', 'Linalool'],
      certifications: ['Halal Certified', 'Natural Product'],
      salesData: {
        totalSold: 280,
        monthlyAverage: 22,
        lastSaleDate: '2024-09-29',
        topMarkets: ['UAE', 'Oman', 'Kuwait']
      },
      supplier: 'In-House Production',
      manufacturingCost: 95,
      margin: 57,
      taxRate: 5,
      tags: ['Natural', 'Traditional', 'Floral', 'Bestseller']
    },
    {
      id: '3',
      name: 'Amber Musk Classic',
      nameArabic: 'العنبر والمسك الكلاسيكي',
      sku: 'AMC-50ML-003',
      barcode: '8901234567892',
      category: 'Perfume',
      subcategory: 'Oriental Perfume',
      productType: 'PERFUME',
      brand: 'Oud Palace',
      collection: 'Classic Collection',
      size: 50,
      unit: 'ml',
      currentStock: 12,
      reservedStock: 5,
      availableStock: 7,
      minimumStock: 30,
      maximumStock: 150,
      reorderLevel: 35,
      costPerUnit: 120,
      retailPrice: 280,
      wholesalePrice: 220,
      vipPrice: 250,
      totalValue: 1440,
      currency: 'AED',
      status: 'ACTIVE',
      qualityGrade: 'STANDARD',
      storageLocation: 'Warehouse B-1-A',
      shelfLife: 30,
      manufacturedDate: '2024-07-20',
      expiryDate: '2027-01-20',
      batchNumber: 'AMC-2024-07-008',
      formula: {
        id: 'F-AMC-003',
        name: 'Amber Musk Classic Blend',
        version: 'v1.8'
      },
      packaging: {
        type: 'Standard Bottle',
        material: 'Glass',
        color: 'Amber',
        weight: 180
      },
      ingredients: ['Amber Essence', 'White Musk', 'Cedarwood', 'Vanilla'],
      allergens: ['Coumarin', 'Eugenol'],
      certifications: ['UAE Quality Mark'],
      salesData: {
        totalSold: 520,
        monthlyAverage: 45,
        lastSaleDate: '2024-09-28',
        topMarkets: ['UAE', 'Bahrain', 'Saudi Arabia']
      },
      supplier: 'In-House Production',
      manufacturingCost: 120,
      margin: 57,
      taxRate: 5,
      tags: ['Classic', 'Oriental', 'Popular']
    },
    {
      id: '4',
      name: 'Luxury Oud Gift Set',
      nameArabic: 'طقم هدايا العود الفاخر',
      sku: 'LOGS-SET-004',
      barcode: '8901234567893',
      category: 'Gift Set',
      subcategory: 'Oud Set',
      productType: 'GIFT_SET',
      brand: 'Oud Palace',
      collection: 'Gift Collection',
      size: 1,
      unit: 'set',
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      minimumStock: 10,
      maximumStock: 50,
      reorderLevel: 15,
      costPerUnit: 450,
      retailPrice: 950,
      wholesalePrice: 750,
      vipPrice: 850,
      totalValue: 0,
      currency: 'AED',
      status: 'OUT_OF_STOCK',
      qualityGrade: 'LUXURY',
      storageLocation: 'Warehouse C-1-A',
      shelfLife: 36,
      manufacturedDate: '2024-06-10',
      expiryDate: '2027-06-10',
      batchNumber: 'LOGS-2024-06-002',
      formula: {
        id: 'F-LOGS-004',
        name: 'Luxury Gift Set Combination',
        version: 'v1.0'
      },
      packaging: {
        type: 'Luxury Gift Box',
        material: 'Velvet Box',
        color: 'Royal Blue',
        weight: 850
      },
      ingredients: ['Premium Oud Oil', 'Rose Attar', 'Sandalwood Attar', 'Musk Oil'],
      allergens: ['Multiple - See Individual Products'],
      certifications: ['Halal Certified', 'Luxury Collection'],
      salesData: {
        totalSold: 85,
        monthlyAverage: 8,
        lastSaleDate: '2024-09-15',
        topMarkets: ['UAE', 'Qatar', 'Kuwait']
      },
      supplier: 'In-House Assembly',
      manufacturingCost: 450,
      margin: 53,
      taxRate: 5,
      tags: ['Gift Set', 'Luxury', 'Premium', 'Special Occasion']
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<FinishedProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');

  const categories = ['Perfume', 'Attar', 'Oud', 'Incense', 'Gift Set', 'Accessory'];
  const statuses = ['ACTIVE', 'DISCONTINUED', 'SEASONAL', 'OUT_OF_STOCK', 'COMING_SOON'];
  const grades = ['PREMIUM', 'LUXURY', 'STANDARD', 'ECONOMY'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.nameArabic.includes(searchTerm) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' || product.qualityGrade === gradeFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesGrade;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DISCONTINUED': return 'bg-gray-100 text-gray-800';
      case 'SEASONAL': return 'bg-blue-100 text-blue-800';
      case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800';
      case 'COMING_SOON': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'LUXURY': return 'bg-gold-100 text-gold-800';
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'ECONOMY': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (current: number, minimum: number) => {
    if (current === 0) return { status: 'Out of Stock', color: 'text-red-600' };
    if (current <= minimum) return { status: 'Low Stock', color: 'text-orange-600' };
    return { status: 'In Stock', color: 'text-green-600' };
  };

  const totalValue = products.reduce((sum, product) => sum + product.totalValue, 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minimumStock && p.currentStock > 0).length;
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;
  const activeProducts = products.filter(p => p.status === 'ACTIVE').length;

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finished Goods Inventory</h1>
          <p className="text-gray-600">
            Manage final products ready for sale - perfumes, attars, oud, and gift sets
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Sales Report
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Batch Operations
          </Button>
          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{activeProducts}</div>
            <p className="text-xs text-gray-500 mt-1">Ready for sale</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              AED {totalValue?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Inventory value</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{lowStockCount}</div>
            <p className="text-xs text-gray-500 mt-1">Need reordering</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{outOfStockCount}</div>
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
                  placeholder="Search by name, SKU, barcode, or Arabic name..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-40">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-40">
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-600" />
            Finished Products
          </CardTitle>
          <CardDescription>
            Complete inventory of ready-to-sell perfume products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.currentStock, product.minimumStock);
                  return (
                    <TableRow key={product.id} className="hover:bg-amber-50/50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.nameArabic}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-2">
                            <span>SKU: {product.sku}</span>
                            <span>•</span>
                            <span>{product.size} {product.unit}</span>
                          </div>
                          {product.collection && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {product.collection}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{product.category}</div>
                          <div className="text-xs text-gray-500">{product.subcategory}</div>
                          <div className="text-xs text-gray-400">{product.brand}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {product.currentStock} {product.unit}
                          </div>
                          <div className="text-xs text-gray-500">
                            Available: {product.availableStock}
                          </div>
                          <div className={`text-xs ${stockStatus.color} font-medium`}>
                            {stockStatus.status}
                          </div>
                          {product.currentStock <= product.minimumStock && product.currentStock > 0 && (
                            <div className="flex items-center text-xs text-orange-600 mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Below minimum
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-green-600">
                            AED {product.retailPrice}
                          </div>
                          <div className="text-xs text-gray-500">
                            Wholesale: AED {product.wholesalePrice}
                          </div>
                          <div className="text-xs text-blue-600">
                            VIP: AED {product.vipPrice}
                          </div>
                          <div className="text-xs text-gray-400">
                            Margin: {product.margin}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(product.qualityGrade)}>
                          {product.qualityGrade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">
                            {product.salesData.totalSold} sold
                          </div>
                          <div className="text-xs text-gray-500">
                            Avg: {product.salesData.monthlyAverage}/month
                          </div>
                          <div className="text-xs text-gray-400">
                            Last: {new Date(product.salesData.lastSaleDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Modal */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedProduct.name}
                <Badge className={getGradeColor(selectedProduct.qualityGrade)}>
                  {selectedProduct.qualityGrade}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="sales">Sales Data</TabsTrigger>
                <TabsTrigger value="formula">Formula</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Product Information</Label>
                      <div className="mt-2 space-y-1">
                        <p className="text-lg font-semibold">{selectedProduct.name}</p>
                        <p className="text-gray-600">{selectedProduct.nameArabic}</p>
                        <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
                        <p className="text-sm text-gray-500">Barcode: {selectedProduct.barcode}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Category</Label>
                      <p>{selectedProduct.category} - {selectedProduct.subcategory}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Brand & Collection</Label>
                      <p>{selectedProduct.brand}</p>
                      {selectedProduct.collection && (
                        <p className="text-sm text-gray-500">{selectedProduct.collection}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Size & Packaging</Label>
                      <div className="mt-2 space-y-1">
                        <p>{selectedProduct.size} {selectedProduct.unit}</p>
                        <p className="text-sm text-gray-500">
                          {selectedProduct.packaging.type} - {selectedProduct.packaging.material}
                        </p>
                        <p className="text-sm text-gray-500">
                          Color: {selectedProduct.packaging.color}
                        </p>
                        <p className="text-sm text-gray-500">
                          Weight: {selectedProduct.packaging.weight}g
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Storage</Label>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{selectedProduct.storageLocation}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <Badge className={getStatusColor(selectedProduct.status)}>
                        {selectedProduct.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Shelf Life</Label>
                      <p>{selectedProduct.shelfLife} months</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Expiry Date</Label>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(selectedProduct.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProduct.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <Label className="text-sm font-medium text-gray-600">Retail Price</Label>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {selectedProduct.currency} {selectedProduct.retailPrice}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Label className="text-sm font-medium text-gray-600">Wholesale Price</Label>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        {selectedProduct.currency} {selectedProduct.wholesalePrice}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <Label className="text-sm font-medium text-gray-600">VIP Price</Label>
                      <p className="text-xl sm:text-2xl font-bold text-purple-600">
                        {selectedProduct.currency} {selectedProduct.vipPrice}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Cost Analysis</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span>Manufacturing Cost:</span>
                          <span>{selectedProduct.currency} {selectedProduct.manufacturingCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Profit Margin:</span>
                          <span className="text-green-600">{selectedProduct.margin}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>VAT Rate:</span>
                          <span>{selectedProduct.taxRate}%</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold">
                          <span>Total Value in Stock:</span>
                          <span>{selectedProduct.currency} {selectedProduct.totalValue?.toLocaleString() || "0"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Label className="text-sm font-medium text-gray-600">Current Stock</Label>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        {selectedProduct.currentStock} {selectedProduct.unit}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Reserved Stock</Label>
                      <p className="text-lg font-semibold">{selectedProduct.reservedStock} {selectedProduct.unit}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <Label className="text-sm font-medium text-gray-600">Available Stock</Label>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {selectedProduct.availableStock} {selectedProduct.unit}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Minimum Stock</Label>
                      <p className="text-lg font-semibold">{selectedProduct.minimumStock} {selectedProduct.unit}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Maximum Stock</Label>
                      <p className="text-lg font-semibold">{selectedProduct.maximumStock} {selectedProduct.unit}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Reorder Level</Label>
                      <p className="text-lg font-semibold">{selectedProduct.reorderLevel} {selectedProduct.unit}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Batch Information</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p><strong>Batch Number:</strong> {selectedProduct.batchNumber}</p>
                    <p><strong>Manufactured:</strong> {new Date(selectedProduct.manufacturedDate).toLocaleDateString()}</p>
                    <p><strong>Expires:</strong> {new Date(selectedProduct.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sales" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <Label className="text-sm font-medium text-gray-600">Total Units Sold</Label>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {selectedProduct.salesData.totalSold}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Monthly Average</Label>
                      <p className="text-lg font-semibold">{selectedProduct.salesData.monthlyAverage} units</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Last Sale Date</Label>
                      <p>{new Date(selectedProduct.salesData.lastSaleDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Top Markets</Label>
                      <div className="mt-2 space-y-1">
                        {selectedProduct.salesData.topMarkets.map((market, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{market}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="formula" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Formula Details</Label>
                      <div className="mt-2 space-y-1">
                        <p><strong>Name:</strong> {selectedProduct.formula.name}</p>
                        <p><strong>Version:</strong> {selectedProduct.formula.version}</p>
                        <p><strong>Formula ID:</strong> {selectedProduct.formula.id}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Main Ingredients</Label>
                      <div className="mt-2 space-y-1">
                        {selectedProduct.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <span>{ingredient}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Allergens</Label>
                      <div className="mt-2 space-y-1">
                        {selectedProduct.allergens.map((allergen, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span>{allergen}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Certifications</Label>
                  <div className="mt-2 space-y-2">
                    {selectedProduct.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Compliance Information</Label>
                  <div className="mt-2 space-y-2">
                    <p><strong>UAE VAT Rate:</strong> {selectedProduct.taxRate}%</p>
                    <p><strong>Product Type:</strong> {selectedProduct.productType}</p>
                    <p><strong>Quality Grade:</strong> {selectedProduct.qualityGrade}</p>
                    {selectedProduct.supplier && (
                      <p><strong>Supplier:</strong> {selectedProduct.supplier}</p>
                    )}
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