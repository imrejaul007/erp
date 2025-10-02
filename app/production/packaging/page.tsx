'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Package, ArrowLeft, PackageCheck, Sparkles, TestTube2, Gift,
  Barcode, Box, DollarSign, Layers, Tag
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PackagingPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('active');
  const [isNewPackagingDialogOpen, setIsNewPackagingDialogOpen] = useState(false);
  const [selectedPackaging, setSelectedPackaging] = useState<any>(null);
  const [isPackagingDetailOpen, setIsPackagingDetailOpen] = useState(false);

  const packagingSummary = {
    activePackaging: 15,
    completedToday: 42,
    pendingOrders: 128,
    bundlesCreated: 24,
    packagingCost: 12500,
    bottlesUsed: 450
  };

  const activePackaging = [
    {
      id: 'PKG-2024-0412',
      batchNo: 'BATCH-PP-2024-0412',
      product: 'Royal Oud Blend',
      sourceBatch: 'LOT-2024-0412',
      totalQuantity: 100,
      status: 'in-progress',
      progress: 65,
      variants: [
        {
          packagingType: 'Luxury 50ml',
          sku: 'ROB-LUX-50ML',
          quantity: 60,
          priceRetail: 1850,
          priceWholesale: 1480,
          priceExport: 1295,
          bottleCost: 25,
          boxCost: 35,
          labelCost: 5,
          completed: 39
        },
        {
          packagingType: 'Regular 50ml',
          sku: 'ROB-REG-50ML',
          quantity: 30,
          priceRetail: 1250,
          priceWholesale: 1000,
          priceExport: 875,
          bottleCost: 15,
          boxCost: 12,
          labelCost: 3,
          completed: 20
        },
        {
          packagingType: 'Tester 10ml',
          sku: 'ROB-TST-10ML',
          quantity: 10,
          priceRetail: 300,
          priceWholesale: 240,
          priceExport: 210,
          bottleCost: 5,
          boxCost: 0,
          labelCost: 1,
          completed: 6
        }
      ]
    },
    {
      id: 'PKG-2024-0398',
      batchNo: 'BATCH-OE-2024-0398',
      product: 'Premium Oud Oil',
      sourceBatch: 'LOT-2024-0398',
      totalQuantity: 50,
      status: 'quality-check',
      progress: 100,
      variants: [
        {
          packagingType: 'Luxury 3ml',
          sku: 'POO-LUX-3ML',
          quantity: 40,
          priceRetail: 850,
          priceWholesale: 680,
          priceExport: 595,
          bottleCost: 15,
          boxCost: 25,
          labelCost: 5,
          completed: 40
        },
        {
          packagingType: 'Sample 1ml',
          sku: 'POO-SMP-1ML',
          quantity: 10,
          priceRetail: 200,
          priceWholesale: 160,
          priceExport: 140,
          bottleCost: 3,
          boxCost: 0,
          labelCost: 1,
          completed: 10
        }
      ]
    }
  ];

  const bundlesGiftSets = [
    {
      id: 'BUNDLE-001',
      name: 'Royal Oud Discovery Set',
      sku: 'GIFT-ROY-DS',
      components: [
        { product: 'Royal Oud Blend 10ml', sku: 'ROB-REG-10ML', quantity: 1 },
        { product: 'Premium Oud Oil 1ml', sku: 'POO-SMP-1ML', quantity: 1 },
        { product: 'Amber Rose Attar 5ml', sku: 'ARA-REG-5ML', quantity: 1 }
      ],
      packagingType: 'Premium Gift Box',
      componentCost: 485,
      packagingCost: 45,
      totalCost: 530,
      priceRetail: 1500,
      priceWholesale: 1200,
      margin: 64.7,
      stockQty: 45,
      status: 'active'
    },
    {
      id: 'BUNDLE-002',
      name: 'Oud Lovers Trio',
      sku: 'GIFT-OUD-TRIO',
      components: [
        { product: 'Royal Oud Blend 50ml', sku: 'ROB-LUX-50ML', quantity: 1 },
        { product: 'Premium Oud Oil 3ml', sku: 'POO-LUX-3ML', quantity: 1 },
        { product: 'Oud Wood Chips 50g', sku: 'OWC-PREM-50G', quantity: 1 }
      ],
      packagingType: 'Luxury Gift Set',
      componentCost: 1850,
      packagingCost: 95,
      totalCost: 1945,
      priceRetail: 5200,
      priceWholesale: 4160,
      margin: 62.6,
      stockQty: 12,
      status: 'active'
    }
  ];

  const packagingMaterials = [
    {
      id: 'PM-001',
      material: '50ml Luxury Glass Bottle',
      sku: 'PKG-BTL-LUX-50',
      stockQty: 2400,
      reorderPoint: 500,
      unitCost: 25,
      supplier: 'Premium Glass UAE',
      status: 'in-stock'
    },
    {
      id: 'PM-002',
      material: '50ml Regular Glass Bottle',
      sku: 'PKG-BTL-REG-50',
      stockQty: 1200,
      reorderPoint: 300,
      unitCost: 15,
      supplier: 'Emirates Packaging',
      status: 'in-stock'
    },
    {
      id: 'PM-003',
      material: 'Luxury Gift Box (Medium)',
      sku: 'PKG-BOX-LUX-M',
      stockQty: 180,
      reorderPoint: 200,
      unitCost: 35,
      supplier: 'Dubai Luxury Packaging',
      status: 'low-stock'
    },
    {
      id: 'PM-004',
      material: '10ml Tester Bottle',
      sku: 'PKG-BTL-TST-10',
      stockQty: 850,
      reorderPoint: 200,
      unitCost: 5,
      supplier: 'Emirates Packaging',
      status: 'in-stock'
    },
    {
      id: 'PM-005',
      material: 'Barcode Labels (Roll)',
      sku: 'PKG-LBL-BAR',
      stockQty: 45,
      reorderPoint: 50,
      unitCost: 85,
      supplier: 'Label Solutions LLC',
      status: 'low-stock'
    }
  ];

  const packagingTypes = [
    {
      type: 'Luxury Packaging',
      icon: Sparkles,
      description: 'Premium glass bottles with luxury boxes, gold foil labels',
      costRange: 'AED 60-95 per unit',
      priceMultiplier: '3.5x-4x material cost',
      useCases: ['High-end retail', 'Export markets', 'Gift sets', 'VIP customers']
    },
    {
      type: 'Regular Packaging',
      icon: Package,
      description: 'Standard glass bottles with branded boxes',
      costRange: 'AED 25-40 per unit',
      priceMultiplier: '2.5x-3x material cost',
      useCases: ['Regular retail', 'Wholesale orders', 'General customers']
    },
    {
      type: 'Tester Bottles',
      icon: TestTube2,
      description: 'Small bottles (5-10ml) for samples and testing',
      costRange: 'AED 5-12 per unit',
      priceMultiplier: '2x-2.5x material cost',
      useCases: ['Store testers', 'Customer samples', 'Marketing']
    },
    {
      type: 'Sample Vials',
      icon: PackageCheck,
      description: 'Mini 1-2ml vials with basic labels',
      costRange: 'AED 2-5 per unit',
      priceMultiplier: '1.5x-2x material cost',
      useCases: ['Free samples', 'Trade shows', 'Online orders bonus']
    }
  ];

  const completedPackaging = [
    {
      id: 'PKG-2024-0385',
      product: 'Amber Rose Attar',
      completedDate: '2024-10-01',
      totalUnits: 250,
      variants: [
        { type: 'Luxury 30ml', qty: 150, sku: 'ARA-LUX-30ML' },
        { type: 'Regular 30ml', qty: 80, sku: 'ARA-REG-30ML' },
        { type: 'Tester 10ml', qty: 20, sku: 'ARA-TST-10ML' }
      ],
      totalCost: 8750,
      avgCostPerUnit: 35,
      status: 'shipped-to-warehouse'
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
            <h1 className="text-3xl font-bold">Packaging & Segregation</h1>
            <p className="text-muted-foreground">
              Multi-packaging types, bundle creation, SKU management & barcode generation
            </p>
          </div>
        </div>
        <Dialog open={isNewPackagingDialogOpen} onOpenChange={setIsNewPackagingDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Package className="h-4 w-4" />
              Start New Packaging
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Start New Packaging Process</DialogTitle>
              <DialogDescription>
                Create multi-packaging variants from production batch with different pricing tiers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Source Batch</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-batch">Production Batch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PP-2024-0412">BATCH-PP-2024-0412 - Royal Oud Blend (100 units)</SelectItem>
                        <SelectItem value="OE-2024-0398">BATCH-OE-2024-0398 - Premium Oud Oil (50ml)</SelectItem>
                        <SelectItem value="PP-2024-0405">BATCH-PP-2024-0405 - Amber Rose Attar (150 units)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total-quantity">Total Quantity Available</Label>
                    <Input id="total-quantity" placeholder="100 units" disabled />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Packaging Variants</h3>
                <p className="text-sm text-muted-foreground">
                  Create multiple SKUs from same batch with different packaging types
                </p>

                <div className="space-y-4 p-4 border rounded-lg bg-amber-50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <h4 className="font-semibold">Luxury Packaging</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="luxury-qty">Quantity</Label>
                      <Input id="luxury-qty" type="number" placeholder="60" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="luxury-sku">Auto SKU</Label>
                      <Input id="luxury-sku" placeholder="ROB-LUX-50ML" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="luxury-price">Retail Price (AED)</Label>
                      <Input id="luxury-price" type="number" placeholder="1850" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Regular Packaging</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="regular-qty">Quantity</Label>
                      <Input id="regular-qty" type="number" placeholder="30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regular-sku">Auto SKU</Label>
                      <Input id="regular-sku" placeholder="ROB-REG-50ML" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regular-price">Retail Price (AED)</Label>
                      <Input id="regular-price" type="number" placeholder="1250" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-2">
                    <TestTube2 className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">Tester Bottles (10ml)</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="tester-qty">Quantity</Label>
                      <Input id="tester-qty" type="number" placeholder="10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tester-sku">Auto SKU</Label>
                      <Input id="tester-sku" placeholder="ROB-TST-10ML" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tester-price">Retail Price (AED)</Label>
                      <Input id="tester-price" type="number" placeholder="300" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing Tiers (Auto-calculated)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <Label className="text-xs text-muted-foreground">Wholesale (20% off)</Label>
                    <p className="text-sm font-semibold mt-1">Auto-calculated</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Label className="text-xs text-muted-foreground">Export (30% off)</Label>
                    <p className="text-sm font-semibold mt-1">Auto-calculated</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Label className="text-xs text-muted-foreground">Total SKUs</Label>
                    <p className="text-sm font-semibold mt-1">3 variants</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode-gen">Generate Barcodes</Label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="barcode-gen" className="rounded" defaultChecked />
                  <span className="text-sm">Auto-generate barcodes for all variants</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsNewPackagingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setIsNewPackagingDialogOpen(false);
                  // Handle form submission
                }}>
                  Start Packaging
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
            <CardDescription>Active Packaging</CardDescription>
            <CardTitle className="text-3xl">{packagingSummary.activePackaging}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600">
              {packagingSummary.completedToday} completed today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Orders</CardDescription>
            <CardTitle className="text-3xl">{packagingSummary.pendingOrders}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-600">
              {packagingSummary.bundlesCreated} bundles created
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Packaging Cost (Today)</CardDescription>
            <CardTitle className="text-3xl">AED {packagingSummary.packagingCost?.toLocaleString() || "0"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Materials & labor
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Bottles Used (Month)</CardDescription>
            <CardTitle className="text-3xl">{packagingSummary.bottlesUsed}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={75} className="mb-2" />
            <p className="text-xs text-green-600">
              Good inventory flow
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="active">Active Packaging</TabsTrigger>
          <TabsTrigger value="bundles">Bundles & Gift Sets</TabsTrigger>
          <TabsTrigger value="materials">Packaging Materials</TabsTrigger>
          <TabsTrigger value="types">Packaging Types</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activePackaging.map((pkg) => (
            <Card
              key={pkg.id}
              className="cursor-pointer hover:bg-blue-50 transition-colors group"
              onClick={() => {
                setSelectedPackaging(pkg);
                setIsPackagingDetailOpen(true);
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-gray-900 group-hover:text-gray-900">{pkg.id}</CardTitle>
                      <Badge variant="outline">{pkg.batchNo}</Badge>
                      <Badge variant={pkg.status === 'in-progress' ? 'default' : 'secondary'}
                             className={pkg.status === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-amber-600 text-white'}>
                        {pkg.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1 text-gray-700 group-hover:text-gray-800">
                      {pkg.product} • Source: {pkg.sourceBatch}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary group-hover:text-primary">{pkg.progress}%</p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700">Progress</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={pkg.progress} className="h-3" />

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Packaging Variants (Multi-SKU from same batch):</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Retail Price</TableHead>
                        <TableHead>Wholesale</TableHead>
                        <TableHead>Export</TableHead>
                        <TableHead>Pkg Cost</TableHead>
                        <TableHead>Done</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pkg.variants.map((variant, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {variant.packagingType.includes('Luxury') ? (
                                <Sparkles className="h-4 w-4 text-amber-600" />
                              ) : variant.packagingType.includes('Tester') ? (
                                <TestTube2 className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Package className="h-4 w-4 text-gray-600" />
                              )}
                              {variant.packagingType}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{variant.sku}</Badge>
                          </TableCell>
                          <TableCell>{variant.quantity}</TableCell>
                          <TableCell>AED {variant.priceRetail}</TableCell>
                          <TableCell>AED {variant.priceWholesale}</TableCell>
                          <TableCell>AED {variant.priceExport}</TableCell>
                          <TableCell>
                            AED {variant.bottleCost + variant.boxCost + variant.labelCost}
                          </TableCell>
                          <TableCell>
                            <Badge variant={variant.completed === variant.quantity ? 'default' : 'secondary'}>
                              {variant.completed}/{variant.quantity}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="gap-2" onClick={(e) => e.stopPropagation()}>
                    <Barcode className="h-4 w-4" />
                    Generate Barcodes
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={(e) => e.stopPropagation()}>
                    <Tag className="h-4 w-4" />
                    Print Labels
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={(e) => e.stopPropagation()}>
                    <Box className="h-4 w-4" />
                    Box & Carton Packing
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bundles" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Gift Sets & Product Bundles</h3>
              <p className="text-sm text-muted-foreground">
                Create multi-product bundles with custom pricing
              </p>
            </div>
            <Button className="gap-2">
              <Gift className="h-4 w-4" />
              Create New Bundle
            </Button>
          </div>

          {bundlesGiftSets.map((bundle) => (
            <Card key={bundle.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-purple-600" />
                      <CardTitle>{bundle.name}</CardTitle>
                      <Badge variant="outline">{bundle.sku}</Badge>
                      <Badge variant="default" className="bg-purple-600">
                        {bundle.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {bundle.packagingType}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {bundle.margin.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Margin</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-sm mb-3">Bundle Components:</h4>
                  <div className="space-y-2">
                    {bundle.components.map((component, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-purple-600" />
                          <span>{component.product}</span>
                          <Badge variant="outline" className="text-xs">{component.sku}</Badge>
                        </div>
                        <span className="text-muted-foreground">Qty: {component.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Component Cost</p>
                    <p className="font-semibold">AED {bundle.componentCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Packaging Cost</p>
                    <p className="font-semibold">AED {bundle.packagingCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className="font-semibold">AED {bundle.totalCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Retail Price</p>
                    <p className="font-semibold text-green-600">AED {bundle.priceRetail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Stock Qty</p>
                    <p className="font-semibold">{bundle.stockQty} units</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Packaging Material Inventory</CardTitle>
                  <CardDescription>Bottles, boxes, labels & packaging supplies</CardDescription>
                </div>
                <Button className="gap-2">
                  <Package className="h-4 w-4" />
                  Add New Material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock Qty</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packagingMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.material}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{material.sku}</Badge>
                      </TableCell>
                      <TableCell>{material.stockQty}</TableCell>
                      <TableCell>{material.reorderPoint}</TableCell>
                      <TableCell>AED {material.unitCost}</TableCell>
                      <TableCell className="text-sm">{material.supplier}</TableCell>
                      <TableCell>
                        <Badge
                          variant={material.status === 'in-stock' ? 'default' : 'destructive'}
                          className={material.status === 'in-stock' ? 'bg-green-600' : ''}
                        >
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

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Packaging Type Definitions</CardTitle>
              <CardDescription>
                Different packaging variants with cost structure & pricing tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packagingTypes.map((pkgType, idx) => {
                  const Icon = pkgType.icon;
                  return (
                    <div key={idx} className="p-4 border-2 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{pkgType.type}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pkgType.description}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Cost Range:</span>
                          <span className="font-semibold">{pkgType.costRange}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price Multiplier:</span>
                          <span className="font-semibold text-green-600">{pkgType.priceMultiplier}</span>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Use Cases:</p>
                          <div className="flex flex-wrap gap-1">
                            {pkgType.useCases.map((useCase, ucIdx) => (
                              <Badge key={ucIdx} variant="outline" className="text-xs">
                                {useCase}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Tier Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Retail Pricing</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Full price for direct customers
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold">Markup:</span> 3x-4x cost
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                    <h4 className="font-semibold">Wholesale Pricing</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Bulk orders (min 50 units)
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold">Markup:</span> 2.5x-3x cost (20% discount)
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">Export Pricing</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    International distributors
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold">Markup:</span> 2x-2.5x cost (30% discount)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Packaging & Segregation Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Multi-SKU Creation</h3>
                <p className="text-xs text-muted-foreground">
                  Create multiple packaging variants from single batch
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">3-Tier Pricing</h3>
                <p className="text-xs text-muted-foreground">
                  Retail, wholesale & export prices auto-linked
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Bundle Creation</h3>
                <p className="text-xs text-muted-foreground">
                  Gift sets & combos with custom pricing
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Barcode className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Barcode & QR Labels</h3>
                <p className="text-xs text-muted-foreground">
                  Auto-generate labels for inventory tracking
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Packaging Detail Dialog */}
      <Dialog open={isPackagingDetailOpen} onOpenChange={setIsPackagingDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Packaging Batch - {selectedPackaging?.id}</DialogTitle>
            <DialogDescription>
              Complete packaging process information and variant details
            </DialogDescription>
          </DialogHeader>
          {selectedPackaging && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <Package className="h-4 w-4 text-primary" />
                    Packaging Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Packaging ID:</span>
                      <span className="font-semibold text-gray-900">{selectedPackaging.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batch No:</span>
                      <span className="font-semibold text-gray-900">{selectedPackaging.batchNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-semibold text-gray-900">{selectedPackaging.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source Batch:</span>
                      <span className="font-semibold text-gray-900">{selectedPackaging.sourceBatch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={selectedPackaging.status === 'in-progress' ? 'default' : 'secondary'}
                             className={selectedPackaging.status === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}>
                        {selectedPackaging.status}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <PackageCheck className="h-4 w-4 text-primary" />
                    Progress Status
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Quantity:</span>
                      <span className="font-bold text-gray-900">{selectedPackaging.totalQuantity} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-bold text-primary">{selectedPackaging.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Variants:</span>
                      <span className="font-semibold text-gray-900">{selectedPackaging.variants.length} SKUs</span>
                    </div>
                    <Progress value={selectedPackaging.progress} className="w-full mt-2" />
                  </div>
                </Card>
              </div>

              {/* Packaging Variants Table */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Packaging Variants & Pricing</h3>
                <Table className="table-modern">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Retail Price</TableHead>
                      <TableHead>Wholesale</TableHead>
                      <TableHead>Export</TableHead>
                      <TableHead>Pkg Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPackaging.variants.map((variant: any, index: number) => (
                      <TableRow key={index} className="group">
                        <TableCell className="font-medium text-gray-900 group-hover:text-gray-900">
                          <div className="flex items-center gap-2">
                            {variant.packagingType.includes('Luxury') ? (
                              <Sparkles className="h-4 w-4 text-amber-600" />
                            ) : variant.packagingType.includes('Tester') ? (
                              <TestTube2 className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Package className="h-4 w-4 text-gray-600" />
                            )}
                            {variant.packagingType}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">
                          <Badge variant="outline">{variant.sku}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">{variant.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={variant.completed === variant.quantity ? 'default' : 'secondary'}
                                 className={variant.completed === variant.quantity ? 'bg-green-600 text-white' : ''}>
                            {variant.completed}/{variant.quantity}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900 group-hover:text-gray-900">
                          AED {variant.priceRetail}
                        </TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">
                          AED {variant.priceWholesale}
                        </TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">
                          AED {variant.priceExport}
                        </TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">
                          AED {variant.bottleCost + variant.boxCost + variant.labelCost}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Cost Breakdown */}
              <div className="grid grid-cols-3 gap-4">
                {selectedPackaging.variants.map((variant: any, index: number) => (
                  <Card key={index} className="p-4 bg-gray-50">
                    <p className="text-xs text-gray-700 mb-1">{variant.packagingType} Cost</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bottle:</span>
                        <span className="text-gray-900">AED {variant.bottleCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Box:</span>
                        <span className="text-gray-900">AED {variant.boxCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Label:</span>
                        <span className="text-gray-900">AED {variant.labelCost}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="font-semibold text-primary">
                          AED {variant.bottleCost + variant.boxCost + variant.labelCost}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline">
                  <Barcode className="h-4 w-4 mr-2" />
                  Generate Barcodes
                </Button>
                <Button variant="outline">
                  <Tag className="h-4 w-4 mr-2" />
                  Print Labels
                </Button>
                <Button>
                  Mark Complete
                </Button>
                <Button variant="outline" onClick={() => setIsPackagingDetailOpen(false)}>
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
