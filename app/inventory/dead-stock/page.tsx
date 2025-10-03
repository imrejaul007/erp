'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Package,
  Calendar,
  Tag,
  BarChart3,
  Download,
  ArrowLeft} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DeadStockItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lastSaleDate: string | null;
  daysUnsold: number;
  agingCategory: '30-60' | '60-90' | '90-180' | '180+';
  holdingCost: number;
  suggestedDiscount: number;
  totalValue: number;
}

export default function DeadStockPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('daysUnsold');

  // Mock data - replace with API call
  const deadStockItems: DeadStockItem[] = [
    {
      id: '1',
      sku: 'PERF-ROSE-50ML',
      name: 'Rose Attar Perfume 50ml',
      category: 'Perfumes',
      quantity: 45,
      costPrice: 80.00,
      sellingPrice: 150.00,
      lastSaleDate: '2024-05-15',
      daysUnsold: 195,
      agingCategory: '180+',
      holdingCost: 12.50,
      suggestedDiscount: 40,
      totalValue: 3600.00,
    },
    {
      id: '2',
      sku: 'OUD-CHIPS-GRADE-B',
      name: 'Oud Chips Grade B 100g',
      category: 'Raw Materials',
      quantity: 120,
      costPrice: 45.00,
      sellingPrice: 90.00,
      lastSaleDate: '2024-08-20',
      daysUnsold: 98,
      agingCategory: '90-180',
      holdingCost: 18.00,
      suggestedDiscount: 25,
      totalValue: 5400.00,
    },
    {
      id: '3',
      sku: 'BOTTLE-GLASS-30ML',
      name: 'Glass Bottle 30ml (Old Design)',
      category: 'Packaging',
      quantity: 350,
      costPrice: 2.50,
      sellingPrice: 5.00,
      lastSaleDate: '2024-09-10',
      daysUnsold: 78,
      agingCategory: '60-90',
      holdingCost: 8.75,
      suggestedDiscount: 20,
      totalValue: 875.00,
    },
    {
      id: '4',
      sku: 'MUSK-BLEND-OLD',
      name: 'Musk Blend (Old Formula)',
      category: 'Semi-Finished',
      quantity: 25,
      costPrice: 120.00,
      sellingPrice: 200.00,
      lastSaleDate: '2024-06-30',
      daysUnsold: 148,
      agingCategory: '90-180',
      holdingCost: 15.00,
      suggestedDiscount: 35,
      totalValue: 3000.00,
    },
    {
      id: '5',
      sku: 'SAFFRON-OIL-10ML',
      name: 'Saffron Essential Oil 10ml',
      category: 'Raw Materials',
      quantity: 60,
      costPrice: 35.00,
      sellingPrice: 70.00,
      lastSaleDate: '2024-10-01',
      daysUnsold: 55,
      agingCategory: '30-60',
      holdingCost: 5.25,
      suggestedDiscount: 15,
      totalValue: 2100.00,
    },
  ];

  const getAgingColor = (category: string) => {
    switch (category) {
      case '30-60':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case '60-90':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case '90-180':
        return 'bg-red-100 text-red-800 border-red-300';
      case '180+':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredItems = deadStockItems.filter((item) => {
    if (activeTab === 'all') return true;
    return item.agingCategory === activeTab;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'daysUnsold':
        return b.daysUnsold - a.daysUnsold;
      case 'value':
        return b.totalValue - a.totalValue;
      case 'quantity':
        return b.quantity - a.quantity;
      case 'holdingCost':
        return b.holdingCost - a.holdingCost;
      default:
        return 0;
    }
  });

  const totalDeadStock = deadStockItems.length;
  const totalValue = deadStockItems.reduce((sum, item) => sum + item.totalValue, 0);
  const totalHoldingCost = deadStockItems.reduce((sum, item) => sum + item.holdingCost, 0);
  const criticalItems = deadStockItems.filter((item) => item.agingCategory === '180+').length;

  return (
    <div className="space-y-6">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Dead Stock Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Identify slow-moving inventory and optimize stock levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-orange-600">
            <Tag className="mr-2 h-4 w-4" />
            Create Clearance Sale
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dead Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalDeadStock}</div>
            <p className="text-xs text-gray-600 mt-1">Items not sold recently</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalValue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">Capital tied in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holding Cost</CardTitle>
            <TrendingDown className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              AED {totalHoldingCost.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Monthly storage cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{criticalItems}</div>
            <p className="text-xs text-gray-600 mt-1">180+ days unsold</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aging Analysis</CardTitle>
              <CardDescription>Products categorized by days without sales</CardDescription>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daysUnsold">Days Unsold</SelectItem>
                <SelectItem value="value">Total Value</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
                <SelectItem value="holdingCost">Holding Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="30-60">30-60 Days</TabsTrigger>
              <TabsTrigger value="60-90">60-90 Days</TabsTrigger>
              <TabsTrigger value="90-180">90-180 Days</TabsTrigger>
              <TabsTrigger value="180+">180+ Days</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {sortedItems.map((item) => (
                <Card key={item.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <Badge className={getAgingColor(item.agingCategory)}>
                            {item.agingCategory} days
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">
                          {item.daysUnsold} days
                        </p>
                        <p className="text-sm text-gray-600">Without sales</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="text-lg font-semibold">{item.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-lg font-semibold">AED {item.totalValue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Holding Cost</p>
                        <p className="text-lg font-semibold text-amber-600">
                          AED {item.holdingCost.toFixed(2)}/mo
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Sale</p>
                        <p className="text-lg font-semibold">
                          {item.lastSaleDate
                            ? new Date(item.lastSaleDate).toLocaleDateString()
                            : 'Never'}
                        </p>
                      </div>
                    </div>

                    {/* Pricing Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Cost Price</p>
                          <p className="text-sm font-medium">AED {item.costPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Current Price</p>
                          <p className="text-sm font-medium">AED {item.sellingPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Suggested Discount</p>
                          <p className="text-sm font-bold text-green-600">{item.suggestedDiscount}% OFF</p>
                        </div>
                      </div>
                    </div>

                    {/* Discount Preview */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-900">
                            Discounted Price: AED {(item.sellingPrice * (1 - item.suggestedDiscount / 100)).toFixed(2)}
                          </p>
                          <p className="text-xs text-green-700">
                            Potential revenue: AED {(item.quantity * item.sellingPrice * (1 - item.suggestedDiscount / 100)).toFixed(2)}
                          </p>
                        </div>
                        <Tag className="h-5 w-5 text-green-600" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600">
                        <Tag className="mr-2 h-4 w-4" />
                        Apply Discount
                      </Button>
                      <Button size="sm" variant="outline">
                        <Package className="mr-2 h-4 w-4" />
                        Create Bundle
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sortedItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No dead stock items found in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Recommendations</CardTitle>
          <CardDescription>AI-powered suggestions to clear dead stock</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Bundle Opportunity</p>
              <p className="text-sm text-blue-700">
                Create a "Discovery Set" combining Rose Attar Perfume with Saffron Oil at 30% discount
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <TrendingDown className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">Liquidation Alert</p>
              <p className="text-sm text-amber-700">
                5 items are 180+ days old. Consider 40-50% clearance sale to recover capital
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Bulk Deal Opportunity</p>
              <p className="text-sm text-green-700">
                Offer Old Design Glass Bottles to corporate clients at wholesale price (350 units)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
