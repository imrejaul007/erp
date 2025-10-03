'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Scale,
  Droplets,
  Gem,
  Beaker,
  Factory,
  Truck,
  Building,
  QrCode,
  Calendar,
  MapPin,
  Star,
  Crown,
  Settings,
  Target,
  Zap,
  Archive,
  ShoppingCart,
  DollarSign,
  Percent,
  ArrowLeft} from 'lucide-react';

// Enhanced inventory data structure for raw materials, semi-finished, and finished goods
const inventoryData = {
  rawMaterials: [
    {
      id: 'RM001',
      name: 'Oud Chips - Cambodian Premium',
      nameArabic: 'عود كمبودي فاخر',
      category: 'Raw Material',
      subCategory: 'Oud Chips',
      grade: 'Super Premium',
      origin: 'Cambodia - Pursat Province',
      supplier: 'Asia Oud Trading LLC',
      currentStock: {
        'STORE001': { quantity: 2.5, reserved: 0.2, unit: 'kg' },
        'STORE002': { quantity: 1.8, reserved: 0.1, unit: 'kg' },
        'STORE003': { quantity: 3.2, reserved: 0.3, unit: 'kg' },
        'FACTORY001': { quantity: 15.7, reserved: 2.1, unit: 'kg' }
      },
      unitCost: 3200, // AED per kg
      totalValue: 75240,
      reorderLevel: 5.0,
      maxStockLevel: 50.0,
      lastReceived: '2024-01-10',
      expiryDate: null,
      qualityGrade: 'A+',
      moisture: '12%',
      oilContent: '23%',
      batchNumber: 'CAM-2024-001',
      certificates: ['Authenticity', 'Origin Certificate', 'Quality Assurance'],
      storageRequirements: {
        temperature: '15-25°C',
        humidity: '40-60%',
        ventilation: 'Required',
        lightExposure: 'Minimal'
      },
      conversionRates: {
        'tola': 85.83, // 1kg = 85.83 tola
        'gram': 1000,
        'piece': 1 // for chips counting
      },
      images: ['/oud-chips-cambodian.jpg'],
      notes: 'Premium grade chips with exceptional aroma. Suitable for high-end distillation.'
    },
    {
      id: 'RM002',
      name: 'Rose Petals - Bulgarian',
      nameArabic: 'بتلات الورد البلغاري',
      category: 'Raw Material',
      subCategory: 'Botanical Extracts',
      grade: 'Premium',
      origin: 'Bulgaria - Valley of Roses',
      supplier: 'Bulgarian Rose Co.',
      currentStock: {
        'FACTORY001': { quantity: 25.3, reserved: 3.2, unit: 'kg' },
        'STORE003': { quantity: 1.5, reserved: 0, unit: 'kg' }
      },
      unitCost: 850, // AED per kg
      totalValue: 22780,
      reorderLevel: 10.0,
      maxStockLevel: 100.0,
      lastReceived: '2024-01-15',
      expiryDate: '2026-01-15',
      qualityGrade: 'A',
      moisture: '8%',
      oilContent: '0.02%',
      batchNumber: 'BGR-2024-002',
      certificates: ['Organic Certification', 'Quality Assurance'],
      storageRequirements: {
        temperature: '10-20°C',
        humidity: '30-50%',
        ventilation: 'Required',
        lightExposure: 'None'
      },
      conversionRates: {
        'gram': 1000
      },
      images: ['/rose-petals-bulgarian.jpg'],
      notes: 'Premium dried rose petals for attar production. High oil content.'
    }
  ],
  semiFinished: [
    {
      id: 'SF001',
      name: 'Cambodian Royal Oud Oil - Distilled',
      nameArabic: 'زيت العود الكمبودي الملكي المقطر',
      category: 'Semi-Finished',
      subCategory: 'Distilled Oils',
      grade: 'Premium',
      productionBatch: 'DIST-2024-001',
      sourceRawMaterials: [
        { id: 'RM001', quantity: 5.2, unit: 'kg' }
      ],
      currentStock: {
        'FACTORY001': { quantity: 2.8, reserved: 0.5, unit: 'liter' },
        'STORE001': { quantity: 0.15, reserved: 0.02, unit: 'liter' },
        'STORE003': { quantity: 0.25, reserved: 0.05, unit: 'liter' }
      },
      unitCost: 18500, // AED per liter
      totalValue: 59050,
      distillationDate: '2024-01-05',
      agingPeriod: '6 months',
      qualityScore: 9.2,
      viscosity: 'Medium',
      color: 'Dark Amber',
      aroma: 'Sweet, Woody, Complex',
      yield: '0.54%', // from raw material
      conversionRates: {
        'ml': 1000,
        'tola': 85.83,
        'oz': 33.81
      },
      readyForBlending: true,
      agingRequirements: {
        duration: 180, // days
        temperature: '18-22°C',
        container: 'Oak Barrel'
      },
      images: ['/oud-oil-cambodian.jpg'],
      notes: 'First distillation from premium Cambodian chips. Excellent for luxury blends.'
    },
    {
      id: 'SF002',
      name: 'Rose Attar Concentrate',
      nameArabic: 'مركز عطر الورد',
      category: 'Semi-Finished',
      subCategory: 'Concentrated Attars',
      grade: 'Premium',
      productionBatch: 'CONC-2024-003',
      sourceRawMaterials: [
        { id: 'RM002', quantity: 12.5, unit: 'kg' }
      ],
      currentStock: {
        'FACTORY001': { quantity: 1.2, reserved: 0.3, unit: 'liter' },
        'STORE001': { quantity: 0.08, reserved: 0.01, unit: 'liter' }
      },
      unitCost: 12000, // AED per liter
      totalValue: 15360,
      distillationDate: '2024-01-12',
      agingPeriod: '3 months',
      qualityScore: 8.8,
      viscosity: 'Light',
      color: 'Clear to Light Pink',
      aroma: 'Fresh Rose, Floral, Delicate',
      yield: '0.096%', // from raw material
      conversionRates: {
        'ml': 1000,
        'tola': 85.83,
        'oz': 33.81
      },
      readyForBlending: true,
      agingRequirements: {
        duration: 90, // days
        temperature: '15-20°C',
        container: 'Glass'
      },
      images: ['/rose-attar-concentrate.jpg'],
      notes: 'High-quality rose concentrate suitable for premium attar blending.'
    }
  ],
  finishedGoods: [
    {
      id: 'FG001',
      name: 'Royal Collection - Signature Oud',
      nameArabic: 'المجموعة الملكية - العود المميز',
      category: 'Finished Goods',
      subCategory: 'Premium Oud Perfumes',
      grade: 'Luxury',
      formula: 'FORM-001',
      ingredients: [
        { id: 'SF001', quantity: 45, unit: 'ml', percentage: 45 },
        { id: 'SF002', quantity: 15, unit: 'ml', percentage: 15 },
        { id: 'BASE001', quantity: 40, unit: 'ml', percentage: 40 }
      ],
      currentStock: {
        'STORE001': { quantity: 25, reserved: 3, unit: 'bottle' },
        'STORE002': { quantity: 18, reserved: 2, unit: 'bottle' },
        'STORE003': { quantity: 32, reserved: 5, unit: 'bottle' },
        'STORE004': { quantity: 15, reserved: 1, unit: 'bottle' },
        'KIOSK001': { quantity: 8, reserved: 1, unit: 'bottle' }
      },
      bottleSize: '12ml',
      unitCost: 450, // AED per bottle
      sellingPrice: {
        retail: 850,
        wholesale: 680,
        vip: 765,
        corporate: 595,
        distributor: 510
      },
      locationPricing: {
        'STORE004': { retail: 950 }, // Airport premium
        'STORE002': { retail: 900 }  // Gold Souk premium
      },
      totalValue: 44100,
      productionDate: '2024-01-20',
      shelfLife: '36 months',
      expiryDate: '2027-01-20',
      qualityScore: 9.5,
      packaging: {
        bottle: 'Crystal with Gold Cap',
        box: 'Luxury Wood Box with Silk Lining',
        weight: '150g total'
      },
      barcodes: {
        primary: '8901234567890',
        batch: 'BAT-FG001-2024-001'
      },
      certificates: ['Authenticity Certificate', 'Quality Assurance'],
      marketSegment: 'Ultra Premium',
      targetCustomers: ['VIP', 'Corporate Gifts', 'Collectors'],
      salesData: {
        unitsSoldLastMonth: 45,
        revenue: 38250,
        topSellingStore: 'STORE003'
      },
      images: ['/royal-signature-oud.jpg', '/packaging-luxury.jpg'],
      notes: 'Flagship product combining finest Cambodian oud with Bulgarian rose. Limited edition.'
    },
    {
      id: 'FG002',
      name: 'Garden of Roses Attar',
      nameArabic: 'عطر حديقة الورود',
      category: 'Finished Goods',
      subCategory: 'Floral Attars',
      grade: 'Premium',
      formula: 'FORM-002',
      ingredients: [
        { id: 'SF002', quantity: 60, unit: 'ml', percentage: 60 },
        { id: 'BASE002', quantity: 40, unit: 'ml', percentage: 40 }
      ],
      currentStock: {
        'STORE001': { quantity: 35, reserved: 4, unit: 'bottle' },
        'STORE002': { quantity: 28, reserved: 3, unit: 'bottle' },
        'STORE003': { quantity: 42, reserved: 6, unit: 'bottle' },
        'STORE004': { quantity: 20, reserved: 2, unit: 'bottle' },
        'KIOSK001': { quantity: 12, reserved: 1, unit: 'bottle' }
      },
      bottleSize: '6ml',
      unitCost: 180, // AED per bottle
      sellingPrice: {
        retail: 350,
        wholesale: 280,
        vip: 315,
        corporate: 245,
        distributor: 210
      },
      locationPricing: {
        'STORE004': { retail: 390 }
      },
      totalValue: 24660,
      productionDate: '2024-01-22',
      shelfLife: '24 months',
      expiryDate: '2026-01-22',
      qualityScore: 8.9,
      packaging: {
        bottle: 'Traditional Crystal with Silver Cap',
        box: 'Elegant Cardboard with Satin Interior',
        weight: '80g total'
      },
      barcodes: {
        primary: '8901234567891',
        batch: 'BAT-FG002-2024-001'
      },
      certificates: ['Quality Assurance'],
      marketSegment: 'Premium',
      targetCustomers: ['Premium', 'Regular', 'Tourists'],
      salesData: {
        unitsSoldLastMonth: 67,
        revenue: 23450,
        topSellingStore: 'STORE001'
      },
      images: ['/garden-roses-attar.jpg'],
      notes: 'Popular floral attar with wide appeal. Strong repeat customer base.'
    }
  ]
};

// Store locations for inventory tracking
const storeLocations = [
  { id: 'STORE001', name: 'Mall of Emirates', type: 'retail' },
  { id: 'STORE002', name: 'Gold Souk Branch', type: 'traditional' },
  { id: 'STORE003', name: 'Abu Dhabi Central', type: 'flagship' },
  { id: 'STORE004', name: 'Airport Duty Free', type: 'duty_free' },
  { id: 'KIOSK001', name: 'City Walk Kiosk', type: 'kiosk' },
  { id: 'FACTORY001', name: 'Production Facility', type: 'factory' }
];

export default function ComprehensiveInventoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Calculate inventory statistics
  const calculateInventoryStats = () => {
    const allItems = [
      ...inventoryData.rawMaterials,
      ...inventoryData.semiFinished,
      ...inventoryData.finishedGoods
    ];

    const totalValue = allItems.reduce((sum, item) => sum + item.totalValue, 0);
    const totalItems = allItems.length;

    // Calculate stock levels
    const lowStockItems = allItems.filter(item => {
      const totalStock = Object.values(item.currentStock).reduce((sum: number, stock: any) => sum + stock.quantity, 0);
      return totalStock <= (item.reorderLevel || 10);
    });

    const outOfStockItems = allItems.filter(item => {
      const totalStock = Object.values(item.currentStock).reduce((sum: number, stock: any) => sum + stock.quantity, 0);
      return totalStock === 0;
    });

    return {
      totalValue,
      totalItems,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      rawMaterialsCount: inventoryData.rawMaterials.length,
      semiFinishedCount: inventoryData.semiFinished.length,
      finishedGoodsCount: inventoryData.finishedGoods.length
    };
  };

  const stats = calculateInventoryStats();

  // Filter items based on search and category
  const getFilteredItems = (category: string) => {
    let items: any[] = [];

    switch (category) {
      case 'raw':
        items = inventoryData.rawMaterials;
        break;
      case 'semi':
        items = inventoryData.semiFinished;
        break;
      case 'finished':
        items = inventoryData.finishedGoods;
        break;
      default:
        items = [
          ...inventoryData.rawMaterials,
          ...inventoryData.semiFinished,
          ...inventoryData.finishedGoods
        ];
    }

    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameArabic.includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get total stock for an item across all locations
  const getTotalStock = (item: any) => {
    return Object.values(item.currentStock).reduce((sum: number, stock: any) => sum + stock.quantity, 0);
  };

  // Get available stock (total - reserved)
  const getAvailableStock = (item: any) => {
    return Object.values(item.currentStock).reduce((sum: number, stock: any) => sum + (stock.quantity - stock.reserved), 0);
  };

  // Render inventory item card
  const renderInventoryItem = (item: any) => {
    const totalStock = getTotalStock(item);
    const availableStock = getAvailableStock(item);
    const isLowStock = totalStock <= (item.reorderLevel || 10);
    const isOutOfStock = totalStock === 0;

    return (
      <Card key={item.id} className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-sm">{item.name}</h3>
                {item.grade && (
                  <Badge variant={item.grade === 'Luxury' ? 'default' : 'secondary'} className="text-xs">
                    {item.grade === 'Luxury' && <Crown className="h-3 w-3 mr-1" />}
                    {item.grade === 'Premium' && <Star className="h-3 w-3 mr-1" />}
                    {item.grade}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-1">{item.nameArabic}</p>
              <p className="text-xs text-gray-500">{item.subCategory}</p>
            </div>
            <div className="text-right">
              <Badge
                variant={isOutOfStock ? 'destructive' : isLowStock ? 'outline' : 'secondary'}
                className="text-xs mb-1"
              >
                {isOutOfStock ? (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                ) : isLowStock ? (
                  <Clock className="h-3 w-3 mr-1" />
                ) : (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {totalStock.toFixed(2)} {Object.values(item.currentStock)[0]?.unit}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">Available:</span>
              <span className="font-medium">{availableStock.toFixed(2)} {Object.values(item.currentStock)[0]?.unit}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">Value:</span>
              <span className="font-medium text-green-600">AED {item.totalValue?.toLocaleString() || "0"}</span>
            </div>
            {item.unitCost && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Unit Cost:</span>
                <span className="font-medium">AED {item.unitCost}</span>
              </div>
            )}
            {item.sellingPrice && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Selling Price:</span>
                <span className="font-medium text-amber-600">AED {item.sellingPrice.retail}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t">
            <div className="flex items-center space-x-1">
              {item.category === 'Raw Material' && <Beaker className="h-3 w-3 text-blue-500" />}
              {item.category === 'Semi-Finished' && <Factory className="h-3 w-3 text-orange-500" />}
              {item.category === 'Finished Goods' && <Package className="h-3 w-3 text-green-500" />}
              <span className="text-xs text-gray-500">{item.id}</span>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setSelectedItem(item)}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Package className="h-6 w-6 mr-2 text-blue-600" />
              Comprehensive Inventory Management
            </h1>
            <Badge className="bg-blue-100 text-blue-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Real-time Tracking
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
            <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>
                    Create a new inventory item for raw materials, semi-finished, or finished goods.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Item Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raw">Raw Material</SelectItem>
                        <SelectItem value="semi">Semi-Finished</SelectItem>
                        <SelectItem value="finished">Finished Goods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Item Name</Label>
                      <Input placeholder="Product name" />
                    </div>
                    <div>
                      <Label>Arabic Name</Label>
                      <Input placeholder="الاسم بالعربية" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddItemDialogOpen(false)}>
                      Create Item
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Inventory Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">AED {stats.totalValue?.toLocaleString() || "0"}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalItems}</p>
                  <p className="text-xs text-gray-500">
                    {stats.rawMaterialsCount} Raw, {stats.semiFinishedCount} Semi, {stats.finishedGoodsCount} Finished
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock Alerts</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.lowStockCount}</p>
                  <p className="text-xs text-gray-500">Items need reordering</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.outOfStockCount}</p>
                  <p className="text-xs text-gray-500">Items unavailable</p>
                </div>
                <Truck className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="raw">Raw Materials</SelectItem>
                  <SelectItem value="semi">Semi-Finished</SelectItem>
                  <SelectItem value="finished">Finished Goods</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {storeLocations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="raw">Raw Materials ({inventoryData.rawMaterials.length})</TabsTrigger>
            <TabsTrigger value="semi">Semi-Finished ({inventoryData.semiFinished.length})</TabsTrigger>
            <TabsTrigger value="finished">Finished Goods ({inventoryData.finishedGoods.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFilteredItems('all').map(renderInventoryItem)}
            </div>
          </TabsContent>

          <TabsContent value="raw" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFilteredItems('raw').map(renderInventoryItem)}
            </div>
          </TabsContent>

          <TabsContent value="semi" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFilteredItems('semi').map(renderInventoryItem)}
            </div>
          </TabsContent>

          <TabsContent value="finished" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFilteredItems('finished').map(renderInventoryItem)}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Item Detail Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                {selectedItem.name}
              </DialogTitle>
              <DialogDescription>
                {selectedItem.nameArabic} • {selectedItem.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="font-semibold mb-3">Item Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{selectedItem.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sub-category:</span>
                    <span>{selectedItem.subCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grade:</span>
                    <Badge variant="outline">{selectedItem.grade}</Badge>
                  </div>
                  {selectedItem.origin && (
                    <div className="flex justify-between">
                      <span>Origin:</span>
                      <span>{selectedItem.origin}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <span className="font-medium text-green-600">AED {selectedItem.totalValue?.toLocaleString() || "0"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Stock by Location</h4>
                <div className="space-y-2">
                  {Object.entries(selectedItem.currentStock).map(([locationId, stock]: [string, any]) => {
                    const location = storeLocations.find(l => l.id === locationId);
                    return (
                      <div key={locationId} className="flex justify-between items-center text-sm">
                        <span>{location?.name || locationId}:</span>
                        <div className="text-right">
                          <span className="font-medium">{stock.quantity} {stock.unit}</span>
                          {stock.reserved > 0 && (
                            <span className="text-xs text-orange-600 block">({stock.reserved} reserved)</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              <Button>
                Edit Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}