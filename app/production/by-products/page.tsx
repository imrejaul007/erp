'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Recycle,
  DollarSign,
  TrendingUp,
  Package,
  Droplet,
  Trees,
  Flame,
  Plus,
  Download,
  BarChart3,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface ByProduct {
  id: string;
  name: string;
  category: 'resin' | 'wood_chips' | 'sawdust' | 'oil_residue' | 'other';
  source: string;
  collectedQuantity: number;
  unit: string;
  usablePercentage: number;
  wastagePercentage: number;
  marketValue: number;
  soldQuantity: number;
  revenue: number;
  potentialRevenue: number;
  status: 'collected' | 'processed' | 'listed' | 'sold';
  collectionDate: string;
  uses: string[];
  notes: string;
}

interface ProductionBatch {
  id: string;
  batchNumber: string;
  product: string;
  productionDate: string;
  byProducts: {
    name: string;
    quantity: number;
    recovered: number;
    monetized: number;
  }[];
  totalByProductValue: number;
  wastageReduction: number;
}

export default function ByProductsPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data
  const byProducts: ByProduct[] = [
    {
      id: '1',
      name: 'Premium Resin Collected During Distillation',
      category: 'resin',
      source: 'Oud Oil Distillation - Batch #2024-045',
      collectedQuantity: 2.5,
      unit: 'kg',
      usablePercentage: 95,
      wastagePercentage: 5,
      marketValue: 450,
      soldQuantity: 2.0,
      revenue: 360,
      potentialRevenue: 90,
      status: 'sold',
      collectionDate: '2024-01-15',
      uses: ['Incense production', 'Traditional medicine', 'Craft projects'],
      notes: 'High-quality resin suitable for premium incense. Market demand is strong.',
    },
    {
      id: '2',
      name: 'Oud Wood Chips - Grade C',
      category: 'wood_chips',
      source: 'Wood Processing - Various batches',
      collectedQuantity: 15.0,
      unit: 'kg',
      usablePercentage: 80,
      wastagePercentage: 20,
      marketValue: 120,
      soldQuantity: 10.0,
      revenue: 80,
      potentialRevenue: 40,
      status: 'listed',
      collectionDate: '2024-01-18',
      uses: ['Budget incense', 'Potpourri filler', 'Craft material'],
      notes: 'Lower grade chips from trimming. Good for budget-conscious customers.',
    },
    {
      id: '3',
      name: 'Sandalwood Sawdust',
      category: 'sawdust',
      source: 'Sandalwood Carving Workshop',
      collectedQuantity: 8.0,
      unit: 'kg',
      usablePercentage: 100,
      wastagePercentage: 0,
      marketValue: 180,
      soldQuantity: 0,
      revenue: 0,
      potentialRevenue: 180,
      status: 'processed',
      collectionDate: '2024-01-20',
      uses: ['Incense powder base', 'Compressed incense cones', 'Aromatic sachets'],
      notes: 'Pure sandalwood sawdust. High aromatic value. Process into incense powder.',
    },
    {
      id: '4',
      name: 'Distillation Residue Oil',
      category: 'oil_residue',
      source: 'Rose Attar Distillation',
      collectedQuantity: 0.5,
      unit: 'liters',
      usablePercentage: 60,
      wastagePercentage: 40,
      marketValue: 80,
      soldQuantity: 0.3,
      revenue: 48,
      potentialRevenue: 32,
      status: 'sold',
      collectionDate: '2024-01-12',
      uses: ['Soap making', 'Candle scenting', 'Room fresheners'],
      notes: 'Lower concentration rose oil. Suitable for non-premium applications.',
    },
  ];

  const productionBatches: ProductionBatch[] = [
    {
      id: 'B1',
      batchNumber: 'BATCH-2024-045',
      product: 'Royal Oud Oil 100ml',
      productionDate: '2024-01-15',
      byProducts: [
        { name: 'Premium Resin', quantity: 2.5, recovered: 2.5, monetized: 2.0 },
        { name: 'Wood Chips Grade C', quantity: 5.0, recovered: 4.0, monetized: 3.0 },
      ],
      totalByProductValue: 580,
      wastageReduction: 85,
    },
    {
      id: 'B2',
      batchNumber: 'BATCH-2024-048',
      product: 'Rose Attar 50ml',
      productionDate: '2024-01-12',
      byProducts: [
        { name: 'Distillation Residue Oil', quantity: 0.5, recovered: 0.5, monetized: 0.3 },
      ],
      totalByProductValue: 48,
      wastageReduction: 60,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'resin':
        return 'bg-amber-100 text-amber-800';
      case 'wood_chips':
        return 'bg-brown-100 text-brown-800';
      case 'sawdust':
        return 'bg-yellow-100 text-yellow-800';
      case 'oil_residue':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'resin':
        return <Droplet className="h-4 w-4" />;
      case 'wood_chips':
        return <Trees className="h-4 w-4" />;
      case 'sawdust':
        return <Package className="h-4 w-4" />;
      case 'oil_residue':
        return <Flame className="h-4 w-4" />;
      default:
        return <Recycle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'collected':
        return 'bg-blue-100 text-blue-800';
      case 'processed':
        return 'bg-yellow-100 text-yellow-800';
      case 'listed':
        return 'bg-purple-100 text-purple-800';
      case 'sold':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredByProducts = byProducts.filter((bp) => {
    if (activeTab === 'all') return true;
    return bp.category === activeTab;
  });

  const totalRevenue = byProducts.reduce((sum, bp) => sum + bp.revenue, 0);
  const potentialRevenue = byProducts.reduce((sum, bp) => sum + bp.potentialRevenue, 0);
  const totalCollected = byProducts.reduce((sum, bp) => sum + bp.collectedQuantity, 0);
  const monetizationRate =
    ((totalRevenue / (totalRevenue + potentialRevenue)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            By-Product Tracking
          </h1>
          <p className="text-gray-600 mt-2">
            Track and monetize production by-products and secondary materials
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600">
            <Plus className="mr-2 h-4 w-4" />
            Record Collection
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              AED {totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600 mt-1">From by-products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {potentialRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">Unlisted inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monetization Rate</CardTitle>
            <Recycle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{monetizationRate}%</div>
            <p className="text-xs text-gray-600 mt-1">Of collected material</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCollected.toFixed(1)}</div>
            <p className="text-xs text-gray-600 mt-1">kg/liters</p>
          </CardContent>
        </Card>
      </div>

      {/* By-Products List */}
      <Card>
        <CardHeader>
          <CardTitle>By-Product Inventory</CardTitle>
          <CardDescription>Secondary products from production processes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="resin">Resin</TabsTrigger>
              <TabsTrigger value="wood_chips">Wood Chips</TabsTrigger>
              <TabsTrigger value="sawdust">Sawdust</TabsTrigger>
              <TabsTrigger value="oil_residue">Oil Residue</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredByProducts.map((byProduct) => {
                const monetizedPercent =
                  ((byProduct.revenue / (byProduct.revenue + byProduct.potentialRevenue)) *
                    100).toFixed(0);

                return (
                  <Card key={byProduct.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{byProduct.name}</h3>
                            <Badge className={getCategoryColor(byProduct.category)}>
                              {getCategoryIcon(byProduct.category)}
                              <span className="ml-1">
                                {byProduct.category.replace('_', ' ').toUpperCase()}
                              </span>
                            </Badge>
                            <Badge className={getStatusColor(byProduct.status)}>
                              {byProduct.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">Source: {byProduct.source}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Market Value</p>
                          <p className="text-2xl font-bold text-green-600">
                            AED {byProduct.marketValue.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Collected</p>
                          <p className="font-semibold">
                            {byProduct.collectedQuantity} {byProduct.unit}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Sold</p>
                          <p className="font-semibold">
                            {byProduct.soldQuantity} {byProduct.unit}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Revenue Earned</p>
                          <p className="font-semibold text-green-600">
                            AED {byProduct.revenue.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Potential</p>
                          <p className="font-semibold text-amber-600">
                            AED {byProduct.potentialRevenue.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Monetization Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Monetization Progress</span>
                          <span className="font-medium">{monetizedPercent}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                            style={{ width: `${monetizedPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Quality Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-900 font-medium">Usable</p>
                          </div>
                          <p className="text-2xl font-bold text-green-900">
                            {byProduct.usablePercentage}%
                          </p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <p className="text-sm text-red-900 font-medium">Wastage</p>
                          </div>
                          <p className="text-2xl font-bold text-red-900">
                            {byProduct.wastagePercentage}%
                          </p>
                        </div>
                      </div>

                      {/* Uses */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Common Uses</p>
                        <div className="flex flex-wrap gap-2">
                          {byProduct.uses.map((use, idx) => (
                            <Badge key={idx} variant="outline">
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-1">Notes</p>
                        <p className="text-sm text-blue-700">{byProduct.notes}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {byProduct.status !== 'sold' && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-emerald-600"
                          >
                            <DollarSign className="mr-2 h-4 w-4" />
                            List for Sale
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Analytics
                        </Button>
                        <Button size="sm" variant="outline">
                          Update Stock
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredByProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Recycle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No by-products found in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Production Batches */}
      <Card>
        <CardHeader>
          <CardTitle>By-Products by Production Batch</CardTitle>
          <CardDescription>Track secondary materials from each production run</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {productionBatches.map((batch) => (
            <Card key={batch.id} className="border-l-4 border-l-emerald-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{batch.product}</p>
                      <Badge variant="outline">{batch.batchNumber}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(batch.productionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">By-Product Value</p>
                    <p className="text-xl font-bold text-green-600">
                      AED {batch.totalByProductValue.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {batch.byProducts.map((bp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{bp.name}</p>
                        <p className="text-xs text-gray-600">
                          Collected: {bp.quantity}kg · Recovered: {bp.recovered}kg · Monetized:{' '}
                          {bp.monetized}kg
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {((bp.monetized / bp.quantity) * 100).toFixed(0)}% monetized
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-900">
                    <span className="font-medium">Wastage Reduction:</span>{' '}
                    {batch.wastageReduction}% of materials recovered as by-products
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Wastage Monetization Insights</CardTitle>
          <CardDescription>Opportunities to maximize by-product revenue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Strong By-Product Recovery</p>
              <p className="text-sm text-green-700">
                Currently recovering AED {totalRevenue.toFixed(2)} from materials that would
                otherwise be waste. Excellent sustainability practice!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">Monetization Opportunity</p>
              <p className="text-sm text-amber-700">
                You have AED {potentialRevenue.toFixed(2)} worth of unlisted by-products. List
                them for sale to recover additional revenue.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Recycle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Sustainability Impact</p>
              <p className="text-sm text-blue-700">
                By monetizing by-products, you're reducing waste by an average of 75% across all
                production batches. Great for environmental compliance!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
