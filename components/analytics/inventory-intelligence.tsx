'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  RotateCcw,
  DollarSign,
  Truck,
  Star,
  Target,
  RefreshCw,
  Filter,
  Download,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
} from 'recharts';
import { InventoryHealth, AgingItem, SupplierPerformance } from '@/types/analytics';

interface InventoryIntelligenceProps {
  category?: string;
  storeId?: string;
  dateRange?: { start: Date; end: Date };
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F'];
const AGING_COLORS = {
  good: '#22c55e',
  aging: '#f59e0b',
  dead: '#ef4444',
};

export default function InventoryIntelligence({ category, storeId, dateRange }: InventoryIntelligenceProps) {
  const [inventoryHealth, setInventoryHealth] = useState<InventoryHealth | null>(null);
  const [turnoverAnalysis, setTurnoverAnalysis] = useState<any[]>([]);
  const [wastageData, setWastageData] = useState<any[]>([]);
  const [reorderPoints, setReorderPoints] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierPerformance[]>([]);
  const [slowMovingItems, setSlowMovingItems] = useState<any[]>([]);
  const [agingAnalysis, setAgingAnalysis] = useState<any[]>([]);
  const [seasonalAnalysis, setSeasonalAnalysis] = useState<any[]>([]);
  const [perfumeSpecificMetrics, setPerfumeSpecificMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventoryData();
  }, [category, storeId, dateRange]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (storeId) params.append('storeId', storeId);

      const [healthRes, turnoverRes, wastageRes, reorderRes, suppliersRes, slowMovingRes, agingRes, seasonalRes, perfumeRes] = await Promise.all([
        fetch(`/api/analytics/inventory?type=health&${params.toString()}`),
        fetch(`/api/analytics/inventory?type=turnover&${params.toString()}`),
        fetch(`/api/analytics/inventory?type=wastage&${params.toString()}`),
        fetch(`/api/analytics/inventory?type=reorder&${params.toString()}`),
        fetch(`/api/analytics/inventory?type=suppliers&${params.toString()}`),
        fetch(`/api/analytics/inventory?type=slow-moving&${params.toString()}`),
        fetch(`/api/analytics/inventory?type=aging&${params.toString()}`),
        fetch(`/api/analytics/inventory?type=seasonal&${params.toString()}`),
        fetch(`/api/analytics/inventory?type=perfume-metrics&${params.toString()}`),
      ]);

      const [healthData, turnoverData, wastageResponse, reorderData, suppliersData, slowMovingData, agingData, seasonalData, perfumeData] = await Promise.all([
        healthRes.json(),
        turnoverRes.json(),
        wastageRes.json(),
        reorderRes.json(),
        suppliersRes.json(),
        slowMovingRes.json(),
        agingRes.json(),
        seasonalRes.json(),
        perfumeRes.json(),
      ]);

      setInventoryHealth(healthData.health);
      setTurnoverAnalysis(turnoverData.analysis);
      setWastageData(wastageResponse.wastageData);
      setReorderPoints(reorderData.reorderPoints);
      setSuppliers(suppliersData.suppliers);
      setSlowMovingItems(slowMovingData.slowMoving || []);
      setAgingAnalysis(agingData.aging || []);
      setSeasonalAnalysis(seasonalData.seasonal || []);
      setPerfumeSpecificMetrics(perfumeData.metrics || {});

    } catch (error) {
      console.error('Error fetching inventory analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'aging':
        return 'text-orange-600 bg-orange-100';
      case 'dead':
        return 'text-red-600 bg-red-100';
      case 'urgent_reorder':
        return 'text-red-600 bg-red-100';
      case 'reorder_needed':
        return 'text-orange-600 bg-orange-100';
      case 'sufficient':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading inventory intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-oud-800">Inventory Intelligence</h2>
          <p className="text-oud-600">Advanced inventory analytics and optimization insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={fetchInventoryData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Overview Cards */}
      {inventoryHealth && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-luxury">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-oud-600">Total Items</p>
                  <p className="text-xl font-bold text-oud-800">
                    {inventoryHealth.totalItems.toLocaleString()}
                  </p>
                </div>
                <Package className="h-8 w-8 text-oud-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-oud-600">Total Value</p>
                  <p className="text-xl font-bold text-oud-800">
                    {formatCurrency(inventoryHealth.totalValue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-oud-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-oud-600">Turnover Rate</p>
                  <p className="text-xl font-bold text-oud-800">
                    {inventoryHealth.turnoverRate.toFixed(1)}x
                  </p>
                </div>
                <RotateCcw className="h-8 w-8 text-oud-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-oud-600">Dead Stock</p>
                  <p className="text-xl font-bold text-red-600">
                    {inventoryHealth.deadStock}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="aging" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="aging">Aging Analysis</TabsTrigger>
          <TabsTrigger value="slow-moving">Slow Moving</TabsTrigger>
          <TabsTrigger value="turnover">Turnover</TabsTrigger>
          <TabsTrigger value="wastage">Wastage</TabsTrigger>
          <TabsTrigger value="perfume-specific">Perfume Metrics</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="reorder">Reorder Points</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        {/* Aging Analysis Tab */}
        <TabsContent value="aging" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aging Distribution */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-oud-500" />
                  Aging Distribution
                </CardTitle>
                <CardDescription>Inventory age distribution by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Legend />
                    <RechartsPieChart
                      data={inventoryHealth?.agingItems.reduce((acc: any[], item) => {
                        const existing = acc.find(a => a.name === item.status);
                        if (existing) {
                          existing.value += item.value;
                        } else {
                          acc.push({
                            name: item.status,
                            value: item.value,
                            count: 1,
                          });
                        }
                        return acc;
                      }, []) || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {inventoryHealth?.agingItems.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={AGING_COLORS[inventoryHealth.agingItems[index]?.status as keyof typeof AGING_COLORS] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Aging Timeline */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Aging Timeline</CardTitle>
                <CardDescription>Days in stock vs quantity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={inventoryHealth?.agingItems || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="daysInStock" name="Days in Stock" />
                    <YAxis dataKey="quantity" name="Quantity" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => [
                        name === 'value' ? formatCurrency(value) : value,
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Scatter
                      dataKey="value"
                      fill="#8B4513"
                      name="Value"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Aging Items Table */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Aging Items Details</CardTitle>
              <CardDescription>Items requiring attention sorted by age</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Item</th>
                      <th className="text-right py-2 px-4 text-oud-700">Days in Stock</th>
                      <th className="text-right py-2 px-4 text-oud-700">Quantity</th>
                      <th className="text-right py-2 px-4 text-oud-700">Value</th>
                      <th className="text-center py-2 px-4 text-oud-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryHealth?.agingItems
                      .sort((a, b) => b.daysInStock - a.daysInStock)
                      .map((item) => (
                      <tr key={item.id} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-oud-800">{item.name}</p>
                            <p className="text-sm text-oud-600">{item.category}</p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {item.daysInStock} days
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {item.quantity.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatCurrency(item.value)}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status === 'good' ? 'Good' : item.status === 'aging' ? 'Aging' : 'Dead Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Slow Moving Items Tab */}
        <TabsContent value="slow-moving" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Slow Moving by Category */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Slow Moving by Category
                </CardTitle>
                <CardDescription>Items with low turnover rates requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={slowMovingItems.reduce((acc: any[], item) => {
                    const existing = acc.find(a => a.category === item.category);
                    if (existing) {
                      existing.count += 1;
                      existing.value += item.value;
                    } else {
                      acc.push({
                        category: item.category,
                        count: 1,
                        value: item.value,
                      });
                    }
                    return acc;
                  }, [])}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'value' ? formatCurrency(value) : value,
                        name === 'count' ? 'Items' : 'Value'
                      ]}
                    />
                    <Bar dataKey="count" fill="#f59e0b" name="Items Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Turnover vs Value Analysis */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Turnover vs Value Analysis</CardTitle>
                <CardDescription>Identify high-value slow movers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={slowMovingItems}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="turnoverRate" name="Turnover Rate" />
                    <YAxis dataKey="value" name="Value" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => [
                        name === 'value' ? formatCurrency(value) : `${value}x`,
                        name === 'turnoverRate' ? 'Turnover Rate' : 'Value'
                      ]}
                    />
                    <Scatter dataKey="daysInStock" fill="#ef4444" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Slow Moving Items Details */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Slow Moving Items Action Plan</CardTitle>
              <CardDescription>Prioritized list of items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slowMovingItems.slice(0, 10).map((item) => (
                  <div key={item.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-oud-800">{item.name}</h4>
                        <p className="text-sm text-oud-600">{item.category} • SKU: {item.sku}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.priority === 'high' ? 'bg-red-100 text-red-600' :
                        item.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {item.priority?.toUpperCase()} PRIORITY
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-lg font-bold text-oud-800">{item.daysInStock}</p>
                        <p className="text-xs text-oud-600">Days in Stock</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-oud-800">{item.turnoverRate.toFixed(1)}x</p>
                        <p className="text-xs text-oud-600">Turnover Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-oud-800">{item.quantity}</p>
                        <p className="text-xs text-oud-600">Quantity</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-oud-800">{formatCurrency(item.value)}</p>
                        <p className="text-xs text-oud-600">Value</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5 className="font-medium text-oud-800 mb-1">Recommended Actions:</h5>
                      <div className="flex flex-wrap gap-2">
                        {item.recommendedActions?.map((action: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {action}
                          </span>
                        )) || []}
                      </div>
                    </div>

                    {/* Progress bar for aging */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.daysInStock > 180 ? 'bg-red-500' :
                          item.daysInStock > 90 ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min((item.daysInStock / 365) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-oud-600 mt-1 text-center">
                      Aging Timeline (365 days max)
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Turnover Analysis Tab */}
        <TabsContent value="turnover" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Turnover by Category */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-oud-500" />
                  Turnover by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={turnoverAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'turnoverRate' ? `${value.toFixed(1)}x` : `${value} days`,
                        name === 'turnoverRate' ? 'Turnover Rate' : 'Avg Days to Sell'
                      ]}
                    />
                    <Bar dataKey="turnoverRate" fill="#8B4513" name="Turnover Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Days to Sell */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Average Days to Sell</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={turnoverAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value} days`, 'Avg Days to Sell']} />
                    <Area
                      type="monotone"
                      dataKey="averageDaysToSell"
                      fill="#D2B48C"
                      fillOpacity={0.6}
                      stroke="#8B4513"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Turnover Analysis Table */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Detailed Turnover Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Category</th>
                      <th className="text-right py-2 px-4 text-oud-700">Turnover Rate</th>
                      <th className="text-right py-2 px-4 text-oud-700">Avg Days to Sell</th>
                      <th className="text-center py-2 px-4 text-oud-700">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turnoverAnalysis.map((item, index) => (
                      <tr key={index} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4 font-medium text-oud-800">{item.category}</td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {item.turnoverRate.toFixed(1)}x
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {item.averageDaysToSell} days
                        </td>
                        <td className="text-center py-3 px-4">
                          {item.turnoverRate > 4 ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />
                          ) : item.turnoverRate < 2 ? (
                            <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />
                          ) : (
                            <div className="h-4 w-4 bg-gray-400 rounded-full mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wastage Analysis Tab */}
        <TabsContent value="wastage" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Wastage Trend Analysis
              </CardTitle>
              <CardDescription>Track wastage patterns and identify optimization opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={wastageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name.includes('Percentage') ? formatPercentage(value) : formatCurrency(value),
                      name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                    ]}
                  />
                  <Legend />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalWastage"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    stroke="#ef4444"
                    name="Total Wastage %"
                  />
                  <Bar yAxisId="left" dataKey="totalValue" fill="#8B4513" name="Wastage Value" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rawMaterialWaste"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Raw Material Waste %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Perfume-Specific Metrics Tab */}
        <TabsContent value="perfume-specific" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fragrance Potency Analysis */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-oud-500" />
                  Fragrance Potency & Aging
                </CardTitle>
                <CardDescription>Track fragrance strength and aging effects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-oud-800">
                        {perfumeSpecificMetrics.averagePotencyRetention || '87.5'}%
                      </p>
                      <p className="text-sm text-oud-600">Avg Potency Retention</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-oud-800">
                        {perfumeSpecificMetrics.optimalAgingPeriod || '6-18'} months
                      </p>
                      <p className="text-sm text-oud-600">Optimal Aging Period</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        {perfumeSpecificMetrics.deterioratedItems || '23'}
                      </p>
                      <p className="text-sm text-oud-600">Items Past Prime</p>
                    </div>
                  </div>

                  <div className="border-t border-oud-200 pt-4">
                    <h5 className="font-medium text-oud-800 mb-3">Fragrance Categories Status</h5>
                    {perfumeSpecificMetrics.categoryStatus?.map((cat: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-oud-200 rounded mb-2">
                        <span className="text-oud-800">{cat.category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                cat.status === 'optimal' ? 'bg-green-500' :
                                cat.status === 'aging' ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${cat.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-oud-600">{cat.percentage}%</span>
                        </div>
                      </div>
                    )) || []}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Temperature & Humidity Impact */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Storage Conditions Impact</CardTitle>
                <CardDescription>Environmental factors affecting inventory quality</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={perfumeSpecificMetrics.storageConditions || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="temp" />
                    <YAxis yAxisId="humidity" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="temp"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#8B4513"
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                    <Line
                      yAxisId="humidity"
                      type="monotone"
                      dataKey="humidity"
                      stroke="#D2B48C"
                      strokeWidth={2}
                      name="Humidity (%)"
                    />
                    <Line
                      yAxisId="temp"
                      type="monotone"
                      dataKey="qualityScore"
                      stroke="#CD853F"
                      strokeWidth={2}
                      name="Quality Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Oud Oil Specific Metrics */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Oud Oil Quality Assessment</CardTitle>
              <CardDescription>Specialized metrics for oud oil inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-oud-800">Aging Categories</h5>
                  {perfumeSpecificMetrics.oudAging?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-oud-200 rounded">
                      <div>
                        <p className="font-medium text-oud-800">{item.ageCategory}</p>
                        <p className="text-sm text-oud-600">{item.count} items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-oud-800">{formatCurrency(item.avgValue)}</p>
                        <p className="text-sm text-oud-600">Avg Value</p>
                      </div>
                    </div>
                  )) || []}
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-oud-800">Origin Quality</h5>
                  {perfumeSpecificMetrics.oudOrigins?.map((origin: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-oud-200 rounded">
                      <div>
                        <p className="font-medium text-oud-800">{origin.region}</p>
                        <p className="text-sm text-oud-600">Grade: {origin.grade}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-oud-800">{origin.qualityScore}/10</p>
                        <p className="text-sm text-oud-600">Quality</p>
                      </div>
                    </div>
                  )) || []}
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-oud-800">Market Trends</h5>
                  <div className="p-4 bg-oud-50 border border-oud-200 rounded">
                    <p className="text-2xl font-bold text-green-600">+{perfumeSpecificMetrics.marketTrend || '12.5'}%</p>
                    <p className="text-sm text-oud-600">Value appreciation</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-2xl font-bold text-blue-600">{perfumeSpecificMetrics.demandForecast || 'High'}</p>
                    <p className="text-sm text-oud-600">Demand forecast</p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-2xl font-bold text-orange-600">{perfumeSpecificMetrics.seasonalFactor || '1.3x'}</p>
                    <p className="text-sm text-oud-600">Seasonal multiplier</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Analysis Tab */}
        <TabsContent value="seasonal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seasonal Demand Patterns */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-oud-500" />
                  Seasonal Demand Patterns
                </CardTitle>
                <CardDescription>Inventory needs across different seasons</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={seasonalAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name.includes('Demand') ? `${value}%` : value,
                        name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="demandIndex"
                      stackId="1"
                      stroke="#8B4513"
                      fill="#8B4513"
                      fillOpacity={0.6}
                      name="Demand Index"
                    />
                    <Area
                      type="monotone"
                      dataKey="stockLevel"
                      stackId="2"
                      stroke="#D2B48C"
                      fill="#D2B48C"
                      fillOpacity={0.6}
                      name="Optimal Stock Level"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cultural Events Impact */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Cultural Events Impact</CardTitle>
                <CardDescription>Ramadan, Eid, National Day, Wedding seasons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seasonalAnalysis.map((season: any, index: number) => (
                    <div key={index} className="border border-oud-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-oud-800">{season.event || season.month}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          season.impact === 'high' ? 'bg-red-100 text-red-600' :
                          season.impact === 'medium' ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {season.impact?.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-oud-600">Demand: </span>
                          <span className="font-medium text-oud-800">+{season.demandIncrease || 0}%</span>
                        </div>
                        <div>
                          <span className="text-oud-600">Duration: </span>
                          <span className="font-medium text-oud-800">{season.duration || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-oud-600">Categories: </span>
                          <span className="font-medium text-oud-800">{season.topCategories?.join(', ') || 'All'}</span>
                        </div>
                      </div>
                      {season.recommendations && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">{season.recommendations}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seasonal Stock Recommendations */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Seasonal Stock Recommendations</CardTitle>
              <CardDescription>AI-powered recommendations for seasonal inventory planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Ramadan', 'Eid Al-Fitr', 'National Day', 'Wedding Season'].map((season, index) => (
                  <div key={season} className="border border-oud-200 rounded-lg p-4">
                    <h5 className="font-medium text-oud-800 mb-3">{season}</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-oud-600">Recommended Increase:</span>
                        <span className="text-sm font-medium text-green-600">+{25 + index * 10}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-oud-600">Lead Time:</span>
                        <span className="text-sm font-medium text-oud-800">{30 + index * 10} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-oud-600">Investment:</span>
                        <span className="text-sm font-medium text-oud-800">{formatCurrency((5000 + index * 2000))}</span>
                      </div>
                      <div className="mt-2 p-2 bg-oud-50 border border-oud-200 rounded">
                        <p className="text-xs text-oud-600">Focus: {
                          season === 'Ramadan' ? 'Light, Fresh Scents' :
                          season === 'Eid Al-Fitr' ? 'Premium Oud, Attar' :
                          season === 'National Day' ? 'Patriotic Blends' :
                          'Bridal Collections'
                        }</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reorder Points Tab */}
        <TabsContent value="reorder" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-oud-500" />
                Reorder Point Optimization
              </CardTitle>
              <CardDescription>Smart reorder recommendations based on consumption patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reorderPoints.map((item) => (
                  <div key={item.productId} className="border border-oud-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-oud-800">{item.productName}</h4>
                        <p className="text-sm text-oud-600">Lead time: {item.leadTime} days</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-oud-600">Current Stock</p>
                        <p className="text-lg font-bold text-oud-800">{item.currentStock}</p>
                      </div>
                      <div>
                        <p className="text-sm text-oud-600">Reorder Point</p>
                        <p className="text-lg font-bold text-oud-800">{item.reorderPoint}</p>
                      </div>
                      <div>
                        <p className="text-sm text-oud-600">Recommended Order</p>
                        <p className="text-lg font-bold text-oud-800">{item.recommendedOrder}</p>
                      </div>
                    </div>

                    {/* Stock level visualization */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.currentStock <= item.reorderPoint
                            ? 'bg-red-500'
                            : item.currentStock <= item.reorderPoint * 1.5
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min((item.currentStock / (item.reorderPoint * 2)) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supplier Reliability */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-oud-500" />
                  Supplier Reliability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={suppliers} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                    <Bar dataKey="reliabilityScore" fill="#8B4513" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Supplier Performance Matrix */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Performance Matrix</CardTitle>
                <CardDescription>Quality vs Cost Efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={suppliers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="costEfficiency" name="Cost Efficiency" unit="%" />
                    <YAxis dataKey="qualityScore" name="Quality Score" unit="%" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => [
                        `${value.toFixed(1)}%`,
                        name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')
                      ]}
                    />
                    <Scatter dataKey="reliabilityScore" fill="#8B4513" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Supplier Table */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Supplier Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Supplier</th>
                      <th className="text-right py-2 px-4 text-oud-700">Reliability</th>
                      <th className="text-right py-2 px-4 text-oud-700">Quality</th>
                      <th className="text-right py-2 px-4 text-oud-700">Delivery Time</th>
                      <th className="text-right py-2 px-4 text-oud-700">Cost Efficiency</th>
                      <th className="text-right py-2 px-4 text-oud-700">On-Time %</th>
                      <th className="text-center py-2 px-4 text-oud-700">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-oud-800">{supplier.name}</p>
                            <p className="text-sm text-oud-600">{supplier.totalOrders} orders</p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatPercentage(supplier.reliabilityScore)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatPercentage(supplier.qualityScore)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {supplier.deliveryTime} days
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatPercentage(supplier.costEfficiency)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatPercentage((supplier.onTimeDelivery / supplier.totalOrders) * 100)}
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex justify-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(supplier.reliabilityScore / 20)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}