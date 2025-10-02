'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Weight, ArrowLeft, Package, TrendingUp, DollarSign, AlertCircle,
  CheckCircle2, Plus, Search, Filter, ArrowUpDown, MapPin, Users
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function RawMaterialPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isNewLotDialogOpen, setIsNewLotDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [isBatchDetailOpen, setIsBatchDetailOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [isPODetailOpen, setIsPODetailOpen] = useState(false);

  // Cost tracking state
  const [purchasePrice, setPurchasePrice] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [segregationCost, setSegregationCost] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [miscCost, setMiscCost] = useState('');
  const [overheadPercent, setOverheadPercent] = useState('');

  // Calculate total landed cost
  const calculateLandedCost = () => {
    const purchase = parseFloat(purchasePrice) || 0;
    const segregation = parseFloat(segregationCost) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const misc = parseFloat(miscCost) || 0;
    const overhead = (purchase * (parseFloat(overheadPercent) || 0)) / 100;
    return purchase + segregation + shipping + misc + overhead;
  };

  const calculateCostPerKg = () => {
    const weight = parseFloat(totalWeight) || 1;
    return calculateLandedCost() / weight;
  };

  const materialSummary = {
    totalStock: 2450, // kg
    activeBatches: 48,
    suppliers: 12,
    avgQuality: 8.5,
    pendingReceiving: 8,
    thisMonthIntake: 456,
    warehouseLocations: 5,
    valueAED: 1245000
  };

  const rawMaterials = [
    {
      id: 'RM-001',
      batchNo: 'CAMOD-2024-085',
      material: 'Cambodian Oud Wood',
      supplier: 'Premium Oud Traders LLC',
      grade: 'Premium',
      grossWeight: 125.5,
      moistureLoss: 8.2,
      dustLoss: 2.3,
      netWeight: 115.0,
      unit: 'kg',
      receivedDate: '2024-09-28',
      expiryDate: 'N/A',
      poNumber: 'PO-2024-0245',
      location: 'Warehouse A - Rack 3',
      quality: 9.2,
      aromaNotes: ['Woody', 'Sweet', 'Resinous'],
      size: 'Large Chips',
      density: 'High',
      resinContent: 'Excellent',
      costPerKg: 8500,
      status: 'in-stock'
    },
    {
      id: 'RM-002',
      batchNo: 'HINDI-2024-092',
      material: 'Hindi Oud Wood',
      supplier: 'Arabian Essence Imports',
      grade: 'Grade A',
      grossWeight: 85.0,
      moistureLoss: 6.5,
      dustLoss: 1.8,
      netWeight: 76.7,
      unit: 'kg',
      receivedDate: '2024-09-30',
      expiryDate: 'N/A',
      poNumber: 'PO-2024-0248',
      location: 'Warehouse A - Rack 2',
      quality: 8.8,
      aromaNotes: ['Earthy', 'Smoky', 'Deep'],
      size: 'Medium Chips',
      density: 'Medium-High',
      resinContent: 'Very Good',
      costPerKg: 7200,
      status: 'in-stock'
    },
    {
      id: 'RM-003',
      batchNo: 'VIET-2024-075',
      material: 'Vietnamese Oud Wood',
      supplier: 'Global Agarwood Traders',
      grade: 'Grade B',
      grossWeight: 65.0,
      moistureLoss: 12.5,
      dustLoss: 3.2,
      netWeight: 54.3,
      unit: 'kg',
      receivedDate: '2024-09-25',
      expiryDate: 'N/A',
      poNumber: 'PO-2024-0242',
      location: 'Warehouse B - Rack 1',
      quality: 7.5,
      aromaNotes: ['Floral', 'Light', 'Fresh'],
      size: 'Small Chips',
      density: 'Medium',
      resinContent: 'Good',
      costPerKg: 5500,
      status: 'in-stock'
    },
    {
      id: 'RM-004',
      batchNo: 'INDO-2024-098',
      material: 'Indonesian Oud Wood',
      supplier: 'Premium Oud Traders LLC',
      grossWeight: 150.0,
      moistureLoss: 0,
      dustLoss: 0,
      netWeight: 150.0,
      unit: 'kg',
      grade: 'Premium',
      receivedDate: '2024-10-02',
      expiryDate: 'N/A',
      poNumber: 'PO-2024-0251',
      location: 'Receiving Bay',
      quality: 0,
      aromaNotes: [],
      size: 'Pending Inspection',
      density: 'Unknown',
      resinContent: 'Pending',
      costPerKg: 9200,
      status: 'pending-inspection'
    }
  ];

  const pendingIntake = [
    {
      poNumber: 'PO-2024-0252',
      supplier: 'Arabian Essence Imports',
      material: 'Cambodian Oud Wood',
      expectedWeight: 200,
      expectedDate: '2024-10-05',
      grade: 'Premium',
      estimatedCost: 1700000,
      status: 'in-transit'
    },
    {
      poNumber: 'PO-2024-0253',
      supplier: 'Global Agarwood Traders',
      material: 'Laotian Oud Wood',
      expectedWeight: 120,
      expectedDate: '2024-10-08',
      grade: 'Grade A',
      estimatedCost: 840000,
      status: 'confirmed'
    }
  ];

  const conversionTable = [
    { from: '1 kg', to: '1000 g', factor: 1000 },
    { from: '1 kg', to: '85.74 tola', factor: 85.74 },
    { from: '1 tola', to: '11.66 g', factor: 11.66 },
    { from: '1 oz', to: '28.35 g', factor: 28.35 },
    { from: '1 lb', to: '453.59 g', factor: 453.59 }
  ];

  const supplierPerformance = [
    {
      supplier: 'Premium Oud Traders LLC',
      totalBatches: 18,
      totalWeight: 2245,
      avgQuality: 9.1,
      onTimeDelivery: 94.4,
      avgMoistureLoss: 7.2,
      reliability: 'excellent'
    },
    {
      supplier: 'Arabian Essence Imports',
      totalBatches: 15,
      totalWeight: 1850,
      avgQuality: 8.7,
      onTimeDelivery: 86.7,
      avgMoistureLoss: 8.5,
      reliability: 'good'
    },
    {
      supplier: 'Global Agarwood Traders',
      totalBatches: 12,
      totalWeight: 1420,
      avgQuality: 7.8,
      onTimeDelivery: 91.7,
      avgMoistureLoss: 11.2,
      reliability: 'good'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/production')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Raw Material Handling</h1>
            <p className="text-muted-foreground">
              Oud wood intake, weight tracking, moisture adjustment & supplier batch management
            </p>
          </div>
        </div>
        <Dialog open={isNewLotDialogOpen} onOpenChange={setIsNewLotDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Lot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Raw Material Lot</DialogTitle>
              <DialogDescription>
                Complete lot registration with purchase details, costs, and landed cost calculation
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Basic Lot Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lot Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lot-id">Lot ID / Batch Number *</Label>
                    <Input id="lot-id" placeholder="HINDI-2024-095" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material-type">Material Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindi">Hindi Oud</SelectItem>
                        <SelectItem value="cambodian">Cambodian Oud</SelectItem>
                        <SelectItem value="vietnamese">Vietnamese Oud</SelectItem>
                        <SelectItem value="indonesian">Indonesian Oud</SelectItem>
                        <SelectItem value="burmese">Burmese Oud</SelectItem>
                        <SelectItem value="other">Other (Custom)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrival-date">Arrival Date *</Label>
                    <Input id="arrival-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse">Storage Location *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wh1">Main Warehouse - Dubai</SelectItem>
                        <SelectItem value="wh2">Warehouse 2 - Sharjah</SelectItem>
                        <SelectItem value="wh3">Cold Storage - Abu Dhabi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Supplier & Purchase Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Supplier & Purchase Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sup1">Premium Oud Traders LLC</SelectItem>
                        <SelectItem value="sup2">Emirates Oud Supply</SelectItem>
                        <SelectItem value="sup3">Global Agarwood Trading</SelectItem>
                        <SelectItem value="sup4">Al-Mansoori Oud House</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice">Invoice Number</Label>
                    <Input id="invoice" placeholder="INV-2024-12345" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="po-number">PO Number</Label>
                    <Input id="po-number" placeholder="PO-2024-00856" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advance">Advance Payment</SelectItem>
                        <SelectItem value="net30">Net 30 Days</SelectItem>
                        <SelectItem value="net60">Net 60 Days</SelectItem>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Weight & Purchase Price */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Weight & Purchase Cost</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total-weight">Total Weight Received *</Label>
                    <Input
                      id="total-weight"
                      type="number"
                      step="0.01"
                      placeholder="100"
                      value={totalWeight}
                      onChange={(e) => setTotalWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Select defaultValue="kg">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="tola">Tola</SelectItem>
                        <SelectItem value="gram">Grams</SelectItem>
                        <SelectItem value="oz">Ounces (oz)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchase-price">Total Purchase Price (AED) *</Label>
                    <Input
                      id="purchase-price"
                      type="number"
                      step="0.01"
                      placeholder="500000"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold">
                    Price per kg: AED {totalWeight && purchasePrice ? (parseFloat(purchasePrice) / parseFloat(totalWeight)).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Additional Costs */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Costs (for True Landed Cost)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="segregation-cost">Segregation Cost (AED)</Label>
                    <Input
                      id="segregation-cost"
                      type="number"
                      step="0.01"
                      placeholder="20000"
                      value={segregationCost}
                      onChange={(e) => setSegregationCost(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Labor, cleaning, grading</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping-cost">Shipping & Logistics (AED)</Label>
                    <Input
                      id="shipping-cost"
                      type="number"
                      step="0.01"
                      placeholder="10000"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Import duty, customs, local transfers</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="misc-cost">Miscellaneous Costs (AED)</Label>
                    <Input
                      id="misc-cost"
                      type="number"
                      step="0.01"
                      placeholder="5000"
                      value={miscCost}
                      onChange={(e) => setMiscCost(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Permits, fuel, electricity, other</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overhead">Overhead Allocation (%)</Label>
                    <Input
                      id="overhead"
                      type="number"
                      step="0.1"
                      placeholder="5"
                      value={overheadPercent}
                      onChange={(e) => setOverheadPercent(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">General company costs allocation</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cost Summary */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                <h3 className="text-lg font-semibold text-green-900">Total Landed Cost Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-muted-foreground">Purchase Price</p>
                    <p className="text-lg font-bold">AED {parseFloat(purchasePrice || 0)?.toLocaleString() || "0"}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-muted-foreground">Segregation Cost</p>
                    <p className="text-lg font-bold">AED {parseFloat(segregationCost || 0)?.toLocaleString() || "0"}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-muted-foreground">Shipping & Logistics</p>
                    <p className="text-lg font-bold">AED {parseFloat(shippingCost || 0)?.toLocaleString() || "0"}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-muted-foreground">Miscellaneous</p>
                    <p className="text-lg font-bold">AED {parseFloat(miscCost || 0)?.toLocaleString() || "0"}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-muted-foreground">Overhead ({overheadPercent || 0}%)</p>
                    <p className="text-lg font-bold">
                      AED {((parseFloat(purchasePrice || 0) * (parseFloat(overheadPercent || 0) / 100)))?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="p-3 bg-green-600 text-white rounded-lg">
                    <p className="text-xs opacity-90">TOTAL LANDED COST</p>
                    <p className="text-xl font-bold">AED {calculateLandedCost()?.toLocaleString() || "0"}</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border-2 border-green-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Cost per kg (True Landed)</p>
                      <p className="text-2xl font-bold text-green-600">
                        AED {calculateCostPerKg().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </p>
                    </div>
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Quality & Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quality & Additional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quality-grade">Initial Quality Grade</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium">Premium (9-10/10)</SelectItem>
                        <SelectItem value="grade-a">Grade A (7-8/10)</SelectItem>
                        <SelectItem value="grade-b">Grade B (5-6/10)</SelectItem>
                        <SelectItem value="grade-c">Grade C (3-4/10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moisture">Moisture Content (%)</Label>
                    <Input id="moisture" type="number" placeholder="8.5" step="0.1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes / Special Instructions</Label>
                  <Input id="notes" placeholder="Any special handling, storage, or quality notes..." />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsNewLotDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setIsNewLotDialogOpen(false);
                  // Handle form submission - save lot with all costs
                }}>
                  Add Lot to Inventory
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
            <CardDescription>Total Stock</CardDescription>
            <CardTitle className="text-3xl">{materialSummary.totalStock?.toLocaleString() || "0"} kg</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              +{materialSummary.thisMonthIntake} kg this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Batches</CardDescription>
            <CardTitle className="text-3xl">{materialSummary.activeBatches}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-600">
              {materialSummary.pendingReceiving} pending inspection
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Quality Score</CardDescription>
            <CardTitle className="text-3xl">{materialSummary.avgQuality}/10</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={materialSummary.avgQuality * 10} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              Across all batches
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Stock Value</CardDescription>
            <CardTitle className="text-3xl">AED {(materialSummary.valueAED / 1000).toFixed(0)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {materialSummary.suppliers} active suppliers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Stock Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Intake</TabsTrigger>
          <TabsTrigger value="conversion">Unit Conversion</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Raw Material Inventory</CardTitle>
                  <CardDescription>All raw oud batches with net weight after moisture/dust adjustment</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search batches..." className="pl-8 w-64" />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => {
                    // Add filter functionality
                    console.log('Filter clicked');
                  }}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch No</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Gross Weight</TableHead>
                    <TableHead>Moisture Loss</TableHead>
                    <TableHead>Net Weight</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawMaterials.map((material) => (
                    <TableRow
                      key={material.id}
                      className="cursor-pointer hover:bg-blue-50 transition-colors group"
                      onClick={() => {
                        setSelectedBatch(material);
                        setIsBatchDetailOpen(true);
                      }}
                    >
                      <TableCell className="font-medium text-gray-900 group-hover:text-gray-900">{material.batchNo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-gray-900">{material.material}</p>
                          <p className="text-xs text-gray-600 group-hover:text-gray-700">{material.supplier}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={material.grade === 'Premium' ? 'default' : 'secondary'}>
                          {material.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 group-hover:text-gray-900">{material.grossWeight} kg</TableCell>
                      <TableCell>
                        <span className="text-red-600 font-semibold group-hover:text-red-700">-{material.moistureLoss + material.dustLoss}%</span>
                      </TableCell>
                      <TableCell className="font-bold text-gray-900 group-hover:text-gray-900">{material.netWeight} kg</TableCell>
                      <TableCell>
                        {material.quality > 0 ? (
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-gray-900">{material.quality}/10</p>
                            <Progress value={material.quality * 10} className="w-16 h-1" />
                          </div>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-500 group-hover:text-gray-600" />
                          <span className="text-sm text-gray-900 group-hover:text-gray-900">{material.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={material.status === 'in-stock' ? 'default' : 'secondary'}
                          className={material.status === 'in-stock' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}
                        >
                          {material.status === 'in-stock' ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {material.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Material Intake</CardTitle>
              <CardDescription>Expected arrivals and pending inspection batches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingIntake.map((intake) => (
                  <div
                    key={intake.poNumber}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors group"
                    onClick={() => {
                      setSelectedPO(intake);
                      setIsPODetailOpen(true);
                    }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-gray-900">{intake.poNumber}</h3>
                        <Badge variant={intake.status === 'in-transit' ? 'default' : 'secondary'}>
                          {intake.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-gray-900">{intake.material} - {intake.grade}</p>
                      <p className="text-xs text-gray-700 group-hover:text-gray-800">
                        {intake.supplier} • Expected: {intake.expectedWeight} kg • ETA: {intake.expectedDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 group-hover:text-gray-900">AED {intake.estimatedCost?.toLocaleString() || "0"}</p>
                      <p className="text-xs text-gray-600 group-hover:text-gray-700">Estimated cost</p>
                    </div>
                  </div>
                ))}
                {rawMaterials
                  .filter(m => m.status === 'pending-inspection')
                  .map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-4 border-2 rounded-lg bg-amber-50 hover:bg-amber-100 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedBatch(material);
                        setIsBatchDetailOpen(true);
                      }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{material.batchNo}</h3>
                          <Badge variant="secondary" className="bg-amber-600 text-white">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Pending Inspection
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{material.material}</p>
                        <p className="text-xs text-gray-700">
                          {material.supplier} • Received: {material.receivedDate} • {material.grossWeight} kg
                        </p>
                      </div>
                      <div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to inspection page or open inspection dialog
                            console.log('Start inspection for:', material.batchNo);
                          }}
                        >
                          Start Inspection
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unit Conversion Reference</CardTitle>
              <CardDescription>Automatic conversion between kg, grams, tola, oz, and ml</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-primary/5">
                    <h3 className="font-semibold mb-3">Weight Conversions</h3>
                    <div className="space-y-2 text-sm">
                      {conversionTable.map((conversion, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="font-medium">{conversion.from}</span>
                          <span className="text-muted-foreground">=</span>
                          <span className="font-semibold text-primary">{conversion.to}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4 bg-blue-50">
                    <h3 className="font-semibold mb-3">Quick Calculator</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Enter Value</label>
                        <Input type="number" placeholder="100" className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium">From</label>
                          <select className="w-full mt-1 border rounded px-3 py-2">
                            <option>kg</option>
                            <option>g</option>
                            <option>tola</option>
                            <option>oz</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">To</label>
                          <select className="w-full mt-1 border rounded px-3 py-2">
                            <option>g</option>
                            <option>kg</option>
                            <option>tola</option>
                            <option>oz</option>
                          </select>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => {
                        // Add conversion calculation logic
                        console.log('Calculate conversion');
                      }}>
                        Calculate
                      </Button>
                      <div className="p-3 bg-white rounded border-2 border-primary">
                        <p className="text-sm text-muted-foreground">Result:</p>
                        <p className="text-2xl font-bold text-primary">-</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-4 bg-green-50">
                  <h3 className="font-semibold mb-2">Moisture & Dust Loss Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-4">Calculate net weight after losses</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium">Gross Weight (kg)</label>
                      <Input type="number" placeholder="100" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Moisture Loss (%)</label>
                      <Input type="number" placeholder="8.5" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Dust Loss (%)</label>
                      <Input type="number" placeholder="2.3" className="mt-1" />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded border-2 border-green-600">
                    <p className="text-sm text-muted-foreground">Net Weight:</p>
                    <p className="text-3xl font-bold text-green-600">- kg</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Loss: - %</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance Analysis</CardTitle>
              <CardDescription>Compare yield, quality, and reliability across suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierPerformance.map((supplier) => (
                  <Card key={supplier.supplier} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">{supplier.supplier}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {supplier.totalBatches} batches • {supplier.totalWeight?.toLocaleString() || "0"} kg total
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          supplier.reliability === 'excellent'
                            ? 'bg-green-100 text-green-700 border-green-700'
                            : 'bg-blue-100 text-blue-700 border-blue-700'
                        }
                      >
                        {supplier.reliability}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Avg Quality</p>
                        <p className="text-2xl font-bold text-primary">{supplier.avgQuality}/10</p>
                        <Progress value={supplier.avgQuality * 10} className="mt-2" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">On-Time Delivery</p>
                        <p className="text-2xl font-bold text-green-600">{supplier.onTimeDelivery}%</p>
                        <Progress value={supplier.onTimeDelivery} className="mt-2" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Avg Moisture Loss</p>
                        <p className="text-2xl font-bold text-amber-600">{supplier.avgMoistureLoss}%</p>
                        <Progress value={supplier.avgMoistureLoss} className="mt-2" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Net Yield</p>
                        <p className="text-2xl font-bold text-blue-600">{(100 - supplier.avgMoistureLoss).toFixed(1)}%</p>
                        <Progress value={100 - supplier.avgMoistureLoss} className="mt-2" />
                      </div>
                    </div>
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
          <CardTitle>Raw Material Handling Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Weight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Auto Weight Conversion</h3>
                <p className="text-xs text-muted-foreground">
                  Automatic conversion between kg, tola, grams with real-time calculations
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Moisture Adjustment</h3>
                <p className="text-xs text-muted-foreground">
                  Track moisture & dust loss to calculate accurate net weight
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Supplier Batch Tagging</h3>
                <p className="text-xs text-muted-foreground">
                  Link every batch to supplier & PO for full traceability
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Quality Inspection</h3>
                <p className="text-xs text-muted-foreground">
                  Initial segregation by size, density, resin quality & aroma
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Detail Dialog */}
      <Dialog open={isBatchDetailOpen} onOpenChange={setIsBatchDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Batch Details - {selectedBatch?.batchNo}</DialogTitle>
            <DialogDescription>
              Complete information for raw material batch
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Material Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Batch No:</span>
                      <span className="font-semibold">{selectedBatch.batchNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="font-semibold">{selectedBatch.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grade:</span>
                      <Badge variant={selectedBatch.grade === 'Premium' ? 'default' : 'secondary'}>
                        {selectedBatch.grade}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span className="font-semibold">{selectedBatch.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PO Number:</span>
                      <span className="font-semibold">{selectedBatch.poNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Received:</span>
                      <span className="font-semibold">{selectedBatch.receivedDate}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Weight className="h-4 w-4 text-primary" />
                    Weight Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Weight:</span>
                      <span className="font-semibold">{selectedBatch.grossWeight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Moisture Loss:</span>
                      <span className="font-semibold text-red-600">-{selectedBatch.moistureLoss}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dust Loss:</span>
                      <span className="font-semibold text-red-600">-{selectedBatch.dustLoss}%</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-semibold">Net Weight:</span>
                      <span className="text-xl font-bold text-green-600">{selectedBatch.netWeight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Loss:</span>
                      <span className="font-semibold">{(selectedBatch.moistureLoss + selectedBatch.dustLoss).toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quality Information */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Quality Assessment
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-2">Quality Score</p>
                    {selectedBatch.quality > 0 ? (
                      <div>
                        <p className="text-3xl font-bold text-primary">{selectedBatch.quality}/10</p>
                        <Progress value={selectedBatch.quality * 10} className="mt-2" />
                      </div>
                    ) : (
                      <Badge variant="outline">Pending Inspection</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">Aroma Profile</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedBatch.aromaNotes && selectedBatch.aromaNotes.length > 0 ? (
                        selectedBatch.aromaNotes.map((note: string, index: number) => (
                          <Badge key={index} variant="secondary">{note}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Not assessed</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Size Classification</p>
                    <p className="font-semibold">{selectedBatch.size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Density</p>
                    <p className="font-semibold">{selectedBatch.density}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Resin Content</p>
                    <p className="font-semibold">{selectedBatch.resinContent}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Storage Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="font-semibold">{selectedBatch.location}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Cost Information */}
              <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Cost Analysis
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Cost per kg</p>
                    <p className="text-2xl font-bold text-primary">AED {selectedBatch.costPerKg?.toLocaleString() || "0"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Total Cost (Net Weight)</p>
                    <p className="text-2xl font-bold text-green-600">
                      AED {(selectedBatch.costPerKg * selectedBatch.netWeight)?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Status</p>
                    <Badge
                      variant={selectedBatch.status === 'in-stock' ? 'default' : 'secondary'}
                      className={selectedBatch.status === 'in-stock' ? 'bg-green-600' : 'bg-amber-600'}
                    >
                      {selectedBatch.status === 'in-stock' ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {selectedBatch.status}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                {selectedBatch.status === 'pending-inspection' && (
                  <Button>
                    Start Quality Inspection
                  </Button>
                )}
                <Button variant="outline">
                  Print Label
                </Button>
                <Button variant="outline">
                  View History
                </Button>
                <Button variant="outline" onClick={() => setIsBatchDetailOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PO Detail Dialog */}
      <Dialog open={isPODetailOpen} onOpenChange={setIsPODetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Order Details - {selectedPO?.poNumber}</DialogTitle>
            <DialogDescription>
              Complete information for pending material intake
            </DialogDescription>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-6">
              {/* PO Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Order Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">PO Number:</span>
                      <span className="font-semibold text-gray-900">{selectedPO.poNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={selectedPO.status === 'in-transit' ? 'default' : 'secondary'}>
                        {selectedPO.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Material:</span>
                      <span className="font-semibold text-gray-900">{selectedPO.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade:</span>
                      <span className="font-semibold text-gray-900">{selectedPO.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Supplier:</span>
                      <span className="font-semibold text-gray-900">{selectedPO.supplier}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Weight className="h-4 w-4 text-primary" />
                    Delivery Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Weight:</span>
                      <span className="font-bold text-gray-900">{selectedPO.expectedWeight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Date:</span>
                      <span className="font-semibold text-gray-900">{selectedPO.expectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Cost:</span>
                      <span className="font-bold text-primary">AED {selectedPO.estimatedCost?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost per kg:</span>
                      <span className="font-semibold text-gray-900">
                        AED {(selectedPO.estimatedCost / selectedPO.expectedWeight).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              <Separator />

              {/* Timeline */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Order Placed</p>
                      <p className="text-xs text-gray-600">Purchase order created and sent to supplier</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {selectedPO.status === 'in-transit' ? 'In Transit' : 'Order Confirmed'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedPO.status === 'in-transit'
                          ? 'Material is currently being shipped'
                          : 'Awaiting shipment from supplier'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-500">Expected Arrival</p>
                      <p className="text-xs text-gray-600">ETA: {selectedPO.expectedDate}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline">
                  Track Shipment
                </Button>
                <Button variant="outline">
                  Contact Supplier
                </Button>
                <Button variant="outline">
                  Edit PO
                </Button>
                <Button variant="outline" onClick={() => setIsPODetailOpen(false)}>
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
