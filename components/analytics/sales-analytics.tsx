'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Star,
  Users,
  Calendar,
  Store,
  Target,
  Award,
  BarChart3,
  PieChart,
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
import { ProductPerformance, SeasonalTrend, StorePerformance, SalesData } from '@/types/analytics';

interface SalesAnalyticsProps {
  dateRange?: { start: Date; end: Date };
  storeId?: string;
  category?: string;
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F'];

export default function SalesAnalytics({ dateRange, storeId, category }: SalesAnalyticsProps) {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [seasonalTrends, setSeasonalTrends] = useState<SeasonalTrend[]>([]);
  const [storePerformance, setStorePerformance] = useState<StorePerformance[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    fetchSalesData();
  }, [dateRange, storeId, category]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (storeId) params.append('storeId', storeId);
      if (category) params.append('category', category);

      // Fetch different types of sales data
      const [overviewRes, productsRes, seasonalRes, storesRes, staffRes] = await Promise.all([
        fetch(`/api/analytics/sales?type=overview&${params.toString()}`),
        fetch(`/api/analytics/sales?type=products&${params.toString()}`),
        fetch(`/api/analytics/sales?type=seasonal&${params.toString()}`),
        fetch(`/api/analytics/sales?type=stores&${params.toString()}`),
        fetch(`/api/analytics/sales?type=staff&${params.toString()}`),
      ]);

      const [overviewData, productsData, seasonalData, storesData, staffData] = await Promise.all([
        overviewRes.json(),
        productsRes.json(),
        seasonalRes.json(),
        storesRes.json(),
        staffRes.json(),
      ]);

      setSalesData(overviewData.salesData || []);
      setProductPerformance(productsData.products || []);
      setSeasonalTrends(seasonalData.trends || []);
      setStorePerformance(storesData.stores || []);
      setStaffPerformance(staffData.staffPerformance || []);

    } catch (error) {
      console.error('Error fetching sales analytics:', error);
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

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : trend === 'down' ? (
      <TrendingDown className="h-4 w-4 text-red-500" />
    ) : (
      <div className="h-4 w-4 bg-gray-400 rounded-full" />
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading sales analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-oud-800">Sales Analytics</h2>
          <p className="text-oud-600">Comprehensive sales performance and insights</p>
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
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-oud-500" />
                  Sales Trend
                </CardTitle>
                <CardDescription>Revenue and order trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'revenue' || name === 'profit' ? formatCurrency(value) : value,
                        name.charAt(0).toUpperCase() + name.slice(1),
                      ]}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      fill="#8B4513"
                      fillOpacity={0.1}
                      stroke="#8B4513"
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Bar yAxisId="left" dataKey="profit" fill="#D2B48C" name="Profit" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#CD853F"
                      strokeWidth={2}
                      name="Orders"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Performing Products */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-oud-500" />
                  Top Products
                </CardTitle>
                <CardDescription>Best selling products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productPerformance.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-oud-100 text-oud-700 text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-oud-800">{product.name}</p>
                          <p className="text-xs text-oud-600">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(product.trend)}
                          <span className="font-bold text-oud-800">
                            {formatCurrency(product.revenue)}
                          </span>
                        </div>
                        <p className="text-xs text-oud-600">
                          {formatPercentage(product.margin)} margin
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="card-luxury">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-oud-600">Total Revenue</p>
                    <p className="text-xl font-bold text-oud-800">
                      {formatCurrency(salesData.reduce((sum, data) => sum + data.revenue, 0))}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-oud-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-oud-600">Total Orders</p>
                    <p className="text-xl font-bold text-oud-800">
                      {salesData.reduce((sum, data) => sum + data.orders, 0).toLocaleString()}
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
                    <p className="text-sm text-oud-600">Avg Order Value</p>
                    <p className="text-xl font-bold text-oud-800">
                      {formatCurrency(
                        salesData.reduce((sum, data) => sum + data.revenue, 0) /
                        salesData.reduce((sum, data) => sum + data.orders, 0)
                      )}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-oud-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-oud-600">Active Customers</p>
                    <p className="text-xl font-bold text-oud-800">
                      {salesData.reduce((sum, data) => sum + data.customers, 0).toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-oud-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Performance Chart */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Revenue comparison by product</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productPerformance.slice(0, 8)} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#8B4513" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Category Mix</CardTitle>
                <CardDescription>Sales distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <RechartsPieChart
                      data={productPerformance.reduce((acc: any[], product) => {
                        const existing = acc.find(item => item.name === product.category);
                        if (existing) {
                          existing.value += product.revenue;
                        } else {
                          acc.push({ name: product.category, value: product.revenue });
                        }
                        return acc;
                      }, [])}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Product Table */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Comprehensive product performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Product</th>
                      <th className="text-right py-2 px-4 text-oud-700">Sales</th>
                      <th className="text-right py-2 px-4 text-oud-700">Revenue</th>
                      <th className="text-right py-2 px-4 text-oud-700">Profit</th>
                      <th className="text-right py-2 px-4 text-oud-700">Margin</th>
                      <th className="text-center py-2 px-4 text-oud-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productPerformance.map((product) => (
                      <tr key={product.id} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-oud-800">{product.name}</p>
                            <p className="text-sm text-oud-600">{product.category}</p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {product.sales.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatCurrency(product.revenue)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatCurrency(product.profit)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatPercentage(product.margin)}
                        </td>
                        <td className="text-center py-3 px-4">
                          {getTrendIcon(product.trend)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Tab */}
        <TabsContent value="seasonal" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-oud-500" />
                Seasonal Trends & Forecasting
              </CardTitle>
              <CardDescription>
                Sales patterns throughout the year with predictive insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={seasonalTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    fill="#8B4513"
                    fillOpacity={0.3}
                    stroke="#8B4513"
                    strokeWidth={2}
                    name="Actual Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#D2B48C"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Forecast"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Store Performance Chart */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-oud-500" />
                  Store Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={storePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="storeName" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#8B4513" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Store Metrics */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Store Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storePerformance.map((store) => (
                    <div key={store.storeId} className="border-b border-oud-100 pb-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-oud-800">{store.storeName}</h4>
                        <span className="text-sm text-oud-600">
                          {formatPercentage(store.conversionRate)} conversion
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-oud-600">Revenue: </span>
                          <span className="font-medium text-oud-800">
                            {formatCurrency(store.revenue)}
                          </span>
                        </div>
                        <div>
                          <span className="text-oud-600">Orders: </span>
                          <span className="font-medium text-oud-800">
                            {store.salesVolume.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-oud-600">AOV: </span>
                          <span className="font-medium text-oud-800">
                            {formatCurrency(store.averageTransactionValue)}
                          </span>
                        </div>
                        <div>
                          <span className="text-oud-600">Footfall: </span>
                          <span className="font-medium text-oud-800">
                            {store.customerFootfall.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-oud-500" />
                Staff Performance
              </CardTitle>
              <CardDescription>Individual staff sales performance and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffPerformance.map((staff, index) => (
                  <div key={staff.id} className="flex items-center justify-between p-4 border border-oud-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-oud-100 text-oud-700 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-oud-800">{staff.name}</h4>
                        <p className="text-sm text-oud-600">{staff.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-oud-800">{formatCurrency(staff.sales)}</p>
                      <p className="text-sm text-oud-600">
                        {formatPercentage(staff.conversion)} conversion
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}