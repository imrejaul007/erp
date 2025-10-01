'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Package,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Filter,
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
} from 'recharts';
import { KPI, FinancialMetrics, CustomerMetrics, SalesData, InventoryHealth } from '@/types/analytics';

interface OwnerDashboardProps {
  dateRange?: { start: Date; end: Date };
  stores?: string[];
  realTime?: boolean;
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887'];

export default function OwnerDashboard({ dateRange, stores, realTime = false }: OwnerDashboardProps) {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);
  const [customerMetrics, setCustomerMetrics] = useState<CustomerMetrics | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [inventoryHealth, setInventoryHealth] = useState<InventoryHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch main dashboard data
      const dashboardResponse = await fetch('/api/analytics/dashboard');
      const dashboardData = await dashboardResponse.json();

      setKpis(dashboardData.kpis);
      setFinancialMetrics(dashboardData.financialMetrics);
      setCustomerMetrics(dashboardData.customerMetrics);
      setLastUpdated(dashboardData.lastUpdated);

      // Fetch sales data
      const salesResponse = await fetch('/api/analytics/sales?type=overview');
      const salesData = await salesResponse.json();
      setSalesData(salesData.salesData);

      // Fetch inventory data
      const inventoryResponse = await fetch('/api/analytics/inventory?type=health');
      const inventoryData = await inventoryResponse.json();
      setInventoryHealth(inventoryData.health);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    if (realTime) {
      const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [realTime, dateRange, stores]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getKPIIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      DollarSign,
      ShoppingCart,
      Users,
      TrendingUp,
      Package,
    };
    return icons[iconName] || DollarSign;
  };

  const getTrendIcon = (changeType: string) => {
    return changeType === 'positive' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : changeType === 'negative' ? (
      <TrendingDown className="h-4 w-4 text-red-500" />
    ) : (
      <Activity className="h-4 w-4 text-gray-500" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-oud-500" />
        <span className="ml-2 text-oud-700">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-oud-800">Executive Dashboard</h1>
          <p className="text-oud-600 mt-1">
            Comprehensive business intelligence and performance metrics
          </p>
          <p className="text-xs text-oud-500 mt-1">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const IconComponent = getKPIIcon(kpi.icon);
          return (
            <Card key={kpi.id} className="card-luxury">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-oud-600">
                  {kpi.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getTrendIcon(kpi.changeType)}
                  <IconComponent className="h-4 w-4 text-oud-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-oud-800">
                  {typeof kpi.value === 'number' ? formatCurrency(kpi.value) : kpi.value}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs font-medium ${
                    kpi.changeType === 'positive'
                      ? 'text-green-600'
                      : kpi.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {kpi.change} from last month
                  </p>
                </div>
                {kpi.trend && (
                  <div className="mt-3 h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={kpi.trend.map((value, idx) => ({ value, index: idx }))}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={kpi.changeType === 'positive' ? '#16a34a' : '#dc2626'}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-oud-500" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue and growth trajectory</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), '']}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      fill="#8B4513"
                      fillOpacity={0.1}
                      stroke="#8B4513"
                      strokeWidth={2}
                    />
                    <Bar dataKey="profit" fill="#D2B48C" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Financial Health */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-oud-500" />
                  Financial Health
                </CardTitle>
                <CardDescription>Key financial metrics and ratios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {financialMetrics && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-oud-600">Profit Margin</p>
                        <p className="text-2xl font-bold text-oud-800">
                          {formatPercentage(financialMetrics.profitMargin)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-oud-600">ROI</p>
                        <p className="text-2xl font-bold text-oud-800">
                          {formatPercentage(financialMetrics.roi)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-oud-600">Cash Flow</p>
                        <p className="text-2xl font-bold text-oud-800">
                          {formatCurrency(financialMetrics.cashFlow)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-oud-600">Expenses</p>
                        <p className="text-2xl font-bold text-oud-800">
                          {formatCurrency(financialMetrics.expenses)}
                        </p>
                      </div>
                    </div>

                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <RechartsPieChart
                            data={[
                              { name: 'Revenue', value: financialMetrics.revenue },
                              { name: 'Expenses', value: financialMetrics.expenses },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </RechartsPieChart>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Metrics */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-oud-500" />
                  Customer Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {customerMetrics && (
                  <>
                    <div>
                      <p className="text-sm text-oud-600">Total Customers</p>
                      <p className="text-xl font-bold text-oud-800">
                        {customerMetrics.totalCustomers.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-oud-600">Retention Rate</p>
                      <p className="text-xl font-bold text-oud-800">
                        {formatPercentage(customerMetrics.retentionRate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-oud-600">Avg Order Value</p>
                      <p className="text-xl font-bold text-oud-800">
                        {formatCurrency(customerMetrics.averageOrderValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-oud-600">Customer LTV</p>
                      <p className="text-xl font-bold text-oud-800">
                        {formatCurrency(customerMetrics.customerLifetimeValue)}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Inventory Status */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-oud-500" />
                  Inventory Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inventoryHealth && (
                  <>
                    <div>
                      <p className="text-sm text-oud-600">Total Items</p>
                      <p className="text-xl font-bold text-oud-800">
                        {inventoryHealth.totalItems.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-oud-600">Total Value</p>
                      <p className="text-xl font-bold text-oud-800">
                        {formatCurrency(inventoryHealth.totalValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-oud-600">Turnover Rate</p>
                      <p className="text-xl font-bold text-oud-800">
                        {inventoryHealth.turnoverRate.toFixed(1)}x
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-oud-600">Dead Stock Items</span>
                      <span className="flex items-center text-orange-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {inventoryHealth.deadStock}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Sales Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <PieChart className="h-4 w-4 mr-2" />
                  Financial Analysis
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Inventory Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Customer Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs content will be implemented in separate components */}
        <TabsContent value="sales">
          <Card className="card-luxury">
            <CardContent className="p-6">
              <p className="text-center text-oud-600">Sales Analytics Dashboard - Coming in next component</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card className="card-luxury">
            <CardContent className="p-6">
              <p className="text-center text-oud-600">Financial Intelligence Dashboard - Coming in next component</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="card-luxury">
            <CardContent className="p-6">
              <p className="text-center text-oud-600">Inventory Intelligence Dashboard - Coming in next component</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card className="card-luxury">
            <CardContent className="p-6">
              <p className="text-center text-oud-600">Customer Analytics Dashboard - Coming in next component</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}