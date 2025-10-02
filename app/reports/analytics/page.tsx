'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Calendar as CalendarIcon,
  Download,
  Upload,
  Filter,
  Search,
  Eye,
  Share,
  Settings,
  Plus,
  RefreshCw,
  Printer,
  FileText,
  Mail,
  Zap,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Building,
  Store,
  Globe,
  Smartphone,
  Star,
  RotateCcw,
  Heart,
  ThumbsUp,
  Activity,
  Percent,
  ArrowUp,
  ArrowDown,
  Minus,
  ExternalLink,
  Info,
  BookOpen,
  CreditCard,
  Truck,
  UserCheck,
  ShoppingBag,
  Gift,
  Tag
} from 'lucide-react';

const ReportsAnalytics = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [isCustomReportOpen, setIsCustomReportOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample analytics data
  const kpiMetrics = {
    totalRevenue: 2456780,
    totalOrders: 8945,
    totalCustomers: 3254,
    avgOrderValue: 475,
    conversionRate: 3.2,
    customerRetention: 68.5,
    inventoryTurnover: 4.2,
    grossMargin: 65.3,
    trends: {
      revenue: +12.5,
      orders: +8.3,
      customers: +15.2,
      aov: -2.1,
      conversion: +0.8,
      retention: +5.3,
      turnover: +0.5,
      margin: -1.2
    }
  };

  const salesAnalytics = {
    monthlySales: [
      { month: 'Jan', revenue: 185000, orders: 642, target: 200000 },
      { month: 'Feb', revenue: 195000, orders: 698, target: 210000 },
      { month: 'Mar', revenue: 225000, orders: 756, target: 220000 },
      { month: 'Apr', revenue: 218000, orders: 723, target: 225000 },
      { month: 'May', revenue: 242000, orders: 812, target: 240000 },
      { month: 'Jun', revenue: 265000, orders: 889, target: 250000 },
      { month: 'Jul', revenue: 278000, orders: 934, target: 270000 },
      { month: 'Aug', revenue: 295000, orders: 978, target: 280000 },
      { month: 'Sep', revenue: 312000, orders: 1045, target: 300000 },
      { month: 'Oct', revenue: 325000, orders: 1123, target: 320000 },
      { month: 'Nov', revenue: 348000, orders: 1234, target: 340000 },
      { month: 'Dec', revenue: 385000, orders: 1389, target: 380000 }
    ],
    topProducts: [
      { name: 'Royal Oud 12ml', revenue: 125000, units: 520, margin: 68.5 },
      { name: 'Arabian Rose 6ml', revenue: 98000, units: 815, margin: 62.3 },
      { name: 'Oud Muattar Premium', revenue: 87000, units: 348, margin: 71.2 },
      { name: 'Perfume Gift Set', revenue: 76000, units: 304, margin: 55.8 },
      { name: 'Attar Al Banat', revenue: 65000, units: 542, margin: 59.4 }
    ],
    channelPerformance: [
      { channel: 'Website', revenue: 387500, orders: 798, conversion: 3.2 },
      { channel: 'Instagram', revenue: 302400, orders: 945, conversion: 2.1 },
      { channel: 'WhatsApp', revenue: 189720, orders: 279, conversion: 15.5 },
      { channel: 'Amazon UAE', revenue: 372260, orders: 836, conversion: 3.8 },
      { channel: 'Noon', revenue: 267750, orders: 630, conversion: 4.2 }
    ]
  };

  const customerAnalytics = {
    segmentation: [
      { segment: 'VIP', count: 245, revenue: 486750, avgSpend: 1987 },
      { segment: 'Premium', count: 567, revenue: 634890, avgSpend: 1120 },
      { segment: 'Regular', count: 1842, revenue: 756342, avgSpend: 411 },
      { segment: 'Tourist', count: 600, revenue: 234000, avgSpend: 390 }
    ],
    demographics: {
      age: [
        { range: '18-25', percentage: 15.2 },
        { range: '26-35', percentage: 34.8 },
        { range: '36-45', percentage: 28.5 },
        { range: '46-55', percentage: 16.7 },
        { range: '55+', percentage: 4.8 }
      ],
      gender: [
        { type: 'Female', percentage: 62.3 },
        { type: 'Male', percentage: 37.7 }
      ],
      location: [
        { city: 'Dubai', percentage: 45.2 },
        { city: 'Abu Dhabi', percentage: 28.5 },
        { city: 'Sharjah', percentage: 15.8 },
        { city: 'Other Emirates', percentage: 10.5 }
      ]
    },
    loyaltyMetrics: {
      totalMembers: 2156,
      activeMembers: 1847,
      pointsRedeemed: 145650,
      pointsEarned: 189420,
      avgPointsPerMember: 127
    }
  };

  const inventoryAnalytics = {
    turnoverRates: [
      { category: 'Oud Products', rate: 6.2, status: 'excellent' },
      { category: 'Perfumes', rate: 4.8, status: 'good' },
      { category: 'Attar', rate: 3.5, status: 'average' },
      { category: 'Accessories', rate: 2.1, status: 'slow' }
    ],
    stockLevels: {
      inStock: 2845,
      lowStock: 156,
      outOfStock: 23,
      overStock: 67
    },
    wasteage: {
      expired: 12,
      damaged: 8,
      lost: 3,
      total: 23,
      value: 15600
    },
    fastMoving: [
      { product: 'Royal Oud 3ml', velocity: 8.5 },
      { product: 'Rose Attar 6ml', velocity: 7.2 },
      { product: 'Oud Muattar', velocity: 6.8 },
      { product: 'Amber Perfume', velocity: 6.3 },
      { product: 'Jasmine Oil', velocity: 5.9 }
    ]
  };

  const financialReports = {
    profitLoss: {
      revenue: 2456780,
      cogs: 852371,
      grossProfit: 1604409,
      expenses: 567234,
      netProfit: 1037175,
      margin: 42.2
    },
    vatSummary: {
      sales: 2456780,
      purchases: 852371,
      vatOnSales: 122839,
      vatOnPurchases: 42619,
      netVatPayable: 80220
    },
    cashFlow: {
      opening: 156780,
      receipts: 2456780,
      payments: 1987650,
      closing: 625910
    }
  };

  const locationAnalytics = [
    {
      name: 'Dubai Mall Store',
      revenue: 856750,
      orders: 2834,
      footfall: 8520,
      conversion: 33.3,
      performance: 112.5
    },
    {
      name: 'Abu Dhabi Mall Store',
      revenue: 634500,
      orders: 2156,
      footfall: 6780,
      conversion: 31.8,
      performance: 108.2
    },
    {
      name: 'Sharjah City Centre',
      revenue: 425600,
      orders: 1567,
      footfall: 5240,
      conversion: 29.9,
      performance: 95.8
    },
    {
      name: 'Al Ain Mall Store',
      revenue: 298450,
      orders: 1123,
      footfall: 3890,
      conversion: 28.9,
      performance: 89.7
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 100) return 'text-green-600';
    if (performance >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount) => {
    return `AED ${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive business intelligence and reporting dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCustomReportOpen} onOpenChange={setIsCustomReportOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Custom Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Custom Report</DialogTitle>
                <DialogDescription>
                  Configure a custom report with specific metrics and filters
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input id="reportName" placeholder="Enter report name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="customer">Customer Report</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="performance">Performance Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="last7days">Last 7 Days</SelectItem>
                      <SelectItem value="last30days">Last 30 Days</SelectItem>
                      <SelectItem value="thismonth">This Month</SelectItem>
                      <SelectItem value="lastmonth">Last Month</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="dubai">Dubai Mall Store</SelectItem>
                      <SelectItem value="abudhabi">Abu Dhabi Mall Store</SelectItem>
                      <SelectItem value="sharjah">Sharjah City Centre</SelectItem>
                      <SelectItem value="alain">Al Ain Mall Store</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCustomReportOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCustomReportOpen(false)}>
                  Generate Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="thismonth">This Month</SelectItem>
                  <SelectItem value="lastmonth">Last Month</SelectItem>
                  <SelectItem value="thisyear">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="dubai">Dubai Mall Store</SelectItem>
                  <SelectItem value="abudhabi">Abu Dhabi Mall Store</SelectItem>
                  <SelectItem value="sharjah">Sharjah City Centre</SelectItem>
                  <SelectItem value="alain">Al Ain Mall Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(kpiMetrics.totalRevenue)}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(kpiMetrics.trends.revenue)}`}>
                  {getTrendIcon(kpiMetrics.trends.revenue)}
                  {Math.abs(kpiMetrics.trends.revenue)}% vs last period
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold">{kpiMetrics.totalOrders?.toLocaleString() || "0"}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(kpiMetrics.trends.orders)}`}>
                  {getTrendIcon(kpiMetrics.trends.orders)}
                  {Math.abs(kpiMetrics.trends.orders)}% vs last period
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-xl sm:text-2xl font-bold">{kpiMetrics.totalCustomers?.toLocaleString() || "0"}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(kpiMetrics.trends.customers)}`}>
                  {getTrendIcon(kpiMetrics.trends.customers)}
                  {Math.abs(kpiMetrics.trends.customers)}% vs last period
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-xl sm:text-2xl font-bold">AED {kpiMetrics.avgOrderValue}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(kpiMetrics.trends.aov)}`}>
                  {getTrendIcon(kpiMetrics.trends.aov)}
                  {Math.abs(kpiMetrics.trends.aov)}% vs last period
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Sales Trend (12 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesAnalytics.monthlySales.slice(-6).map((month) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{month.month}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatCurrency(month.revenue)}</div>
                          <div className="text-xs text-gray-500">{month.orders} orders</div>
                        </div>
                      </div>
                      <Progress
                        value={(month.revenue / month.target) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Target: {formatCurrency(month.target)}</span>
                        <span>
                          {((month.revenue / month.target) * 100).toFixed(1)}% achieved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performing Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salesAnalytics.topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.units} units • {product.margin}% margin
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(product.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{kpiMetrics.conversionRate}%</div>
                <div className="text-sm text-gray-500">Conversion Rate</div>
                <div className={`text-xs flex items-center justify-center gap-1 ${getTrendColor(kpiMetrics.trends.conversion)}`}>
                  {getTrendIcon(kpiMetrics.trends.conversion)}
                  {Math.abs(kpiMetrics.trends.conversion)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">{kpiMetrics.customerRetention}%</div>
                <div className="text-sm text-gray-500">Customer Retention</div>
                <div className={`text-xs flex items-center justify-center gap-1 ${getTrendColor(kpiMetrics.trends.retention)}`}>
                  {getTrendIcon(kpiMetrics.trends.retention)}
                  {Math.abs(kpiMetrics.trends.retention)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{kpiMetrics.inventoryTurnover}</div>
                <div className="text-sm text-gray-500">Inventory Turnover</div>
                <div className={`text-xs flex items-center justify-center gap-1 ${getTrendColor(kpiMetrics.trends.turnover)}`}>
                  {getTrendIcon(kpiMetrics.trends.turnover)}
                  {Math.abs(kpiMetrics.trends.turnover)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">{kpiMetrics.grossMargin}%</div>
                <div className="text-sm text-gray-500">Gross Margin</div>
                <div className={`text-xs flex items-center justify-center gap-1 ${getTrendColor(kpiMetrics.trends.margin)}`}>
                  {getTrendIcon(kpiMetrics.trends.margin)}
                  {Math.abs(kpiMetrics.trends.margin)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Channel Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesAnalytics.channelPerformance.map((channel) => (
                  <div key={channel.channel} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{channel.channel}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(channel.revenue)}</div>
                        <div className="text-xs text-gray-500">
                          {channel.orders} orders • {channel.conversion}% conv.
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={(channel.revenue / Math.max(...salesAnalytics.channelPerformance.map(c => c.revenue))) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Monthly Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesAnalytics.monthlySales.map((month) => {
                    const achievement = (month.revenue / month.target) * 100;
                    return (
                      <div key={month.month} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{month.month} 2024</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatCurrency(month.revenue)}</div>
                            <Badge
                              variant={achievement >= 100 ? "default" : achievement >= 90 ? "secondary" : "destructive"}
                            >
                              {achievement.toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={achievement} className="h-3" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{month.orders} orders</span>
                          <span>Target: {formatCurrency(month.target)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Oud Products', revenue: 856750, percentage: 34.9 },
                    { category: 'Perfumes', revenue: 736350, percentage: 30.0 },
                    { category: 'Attar', revenue: 491356, percentage: 20.0 },
                    { category: 'Gift Sets', revenue: 245678, percentage: 10.0 },
                    { category: 'Accessories', revenue: 122834, percentage: 5.1 }
                  ].map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.category}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatCurrency(category.revenue)}</div>
                          <div className="text-xs text-gray-500">{category.percentage}%</div>
                        </div>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Sales Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Sales Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Avg Price</TableHead>
                    <TableHead>Margin %</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesAnalytics.topProducts.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{formatCurrency(product.revenue)}</TableCell>
                      <TableCell>{product.units}</TableCell>
                      <TableCell>AED {(product.revenue / product.units).toFixed(0)}</TableCell>
                      <TableCell>
                        <Badge variant={product.margin >= 65 ? "default" : product.margin >= 55 ? "secondary" : "destructive"}>
                          {product.margin}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowUp className="h-4 w-4" />
                          12.5%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Customer Segmentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Segmentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerAnalytics.segmentation.map((segment) => (
                    <div key={segment.segment} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{segment.segment}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{segment.count} customers</div>
                          <div className="text-xs text-gray-500">
                            Avg: AED {segment.avgSpend}
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={(segment.revenue / Math.max(...customerAnalytics.segmentation.map(s => s.revenue))) * 100}
                        className="h-2"
                      />
                      <div className="text-xs text-gray-500">
                        Revenue: {formatCurrency(segment.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Age Distribution</h4>
                    <div className="space-y-2">
                      {customerAnalytics.demographics.age.map((age) => (
                        <div key={age.range} className="flex justify-between items-center">
                          <span className="text-sm">{age.range}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={age.percentage} className="w-20 h-2" />
                            <span className="text-sm w-10">{age.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Gender Split</h4>
                    <div className="space-y-2">
                      {customerAnalytics.demographics.gender.map((gender) => (
                        <div key={gender.type} className="flex justify-between items-center">
                          <span className="text-sm">{gender.type}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={gender.percentage} className="w-20 h-2" />
                            <span className="text-sm w-10">{gender.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Location Distribution</h4>
                    <div className="space-y-2">
                      {customerAnalytics.demographics.location.map((location) => (
                        <div key={location.city} className="flex justify-between items-center">
                          <span className="text-sm">{location.city}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={location.percentage} className="w-20 h-2" />
                            <span className="text-sm w-10">{location.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loyalty Program Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Loyalty Program Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {customerAnalytics.loyaltyMetrics.totalMembers?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-gray-500">Total Members</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {customerAnalytics.loyaltyMetrics.activeMembers?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-gray-500">Active Members</div>
                  <div className="text-xs text-gray-400">
                    {((customerAnalytics.loyaltyMetrics.activeMembers / customerAnalytics.loyaltyMetrics.totalMembers) * 100).toFixed(1)}% active
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">
                    {customerAnalytics.loyaltyMetrics.pointsEarned?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-gray-500">Points Earned</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">
                    {customerAnalytics.loyaltyMetrics.pointsRedeemed?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-gray-500">Points Redeemed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">
                    {customerAnalytics.loyaltyMetrics.avgPointsPerMember}
                  </div>
                  <div className="text-sm text-gray-500">Avg Points/Member</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Inventory Turnover */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Inventory Turnover Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryAnalytics.turnoverRates.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.category}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{category.rate}x</div>
                          <Badge
                            variant={
                              category.status === 'excellent' ? 'default' :
                              category.status === 'good' ? 'secondary' :
                              category.status === 'average' ? 'outline' : 'destructive'
                            }
                          >
                            {category.status}
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={category.rate * 10}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stock Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Current Stock Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {inventoryAnalytics.stockLevels.inStock}
                    </div>
                    <div className="text-sm text-gray-500">In Stock</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                      {inventoryAnalytics.stockLevels.lowStock}
                    </div>
                    <div className="text-sm text-gray-500">Low Stock</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-red-600">
                      {inventoryAnalytics.stockLevels.outOfStock}
                    </div>
                    <div className="text-sm text-gray-500">Out of Stock</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">
                      {inventoryAnalytics.stockLevels.overStock}
                    </div>
                    <div className="text-sm text-gray-500">Overstock</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Wastage Summary</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{inventoryAnalytics.wasteage.expired}</div>
                      <div className="text-gray-600">Expired</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{inventoryAnalytics.wasteage.damaged}</div>
                      <div className="text-gray-600">Damaged</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{inventoryAnalytics.wasteage.lost}</div>
                      <div className="text-gray-600">Lost</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-medium text-red-600">
                      Total Loss: AED {inventoryAnalytics.wasteage.value?.toLocaleString() || "0"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fast Moving Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Fast Moving Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Velocity (units/day)</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Days to Stockout</TableHead>
                    <TableHead>Reorder Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryAnalytics.fastMoving.map((product, index) => {
                    const currentStock = Math.floor(Math.random() * 100) + 50;
                    const daysToStockout = Math.floor(currentStock / product.velocity);
                    return (
                      <TableRow key={product.product}>
                        <TableCell className="font-medium">{product.product}</TableCell>
                        <TableCell>{product.velocity}</TableCell>
                        <TableCell>{currentStock} units</TableCell>
                        <TableCell>
                          <Badge
                            variant={daysToStockout <= 7 ? "destructive" : daysToStockout <= 14 ? "secondary" : "default"}
                          >
                            {daysToStockout} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {daysToStockout <= 7 ? (
                            <Badge variant="destructive">Urgent Reorder</Badge>
                          ) : daysToStockout <= 14 ? (
                            <Badge variant="secondary">Reorder Soon</Badge>
                          ) : (
                            <Badge variant="outline">Normal</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Profit & Loss */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Profit & Loss Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-medium">{formatCurrency(financialReports.profitLoss.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cost of Goods Sold</span>
                    <span className="font-medium text-red-600">-{formatCurrency(financialReports.profitLoss.cogs)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Gross Profit</span>
                    <span className="font-medium text-green-600">{formatCurrency(financialReports.profitLoss.grossProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Operating Expenses</span>
                    <span className="font-medium text-red-600">-{formatCurrency(financialReports.profitLoss.expenses)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Net Profit</span>
                    <span className="font-bold text-green-600">{formatCurrency(financialReports.profitLoss.netProfit)}</span>
                  </div>
                  <div className="text-center">
                    <Badge variant="default" className="text-sm">
                      {financialReports.profitLoss.margin}% Net Margin
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VAT Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  UAE VAT Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Sales (Incl. VAT)</span>
                    <span className="font-medium">{formatCurrency(financialReports.vatSummary.sales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">VAT on Sales (5%)</span>
                    <span className="font-medium text-green-600">{formatCurrency(financialReports.vatSummary.vatOnSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Purchases (Incl. VAT)</span>
                    <span className="font-medium">{formatCurrency(financialReports.vatSummary.purchases)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">VAT on Purchases</span>
                    <span className="font-medium text-red-600">{formatCurrency(financialReports.vatSummary.vatOnPurchases)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Net VAT Payable</span>
                    <span className="font-bold text-blue-600">{formatCurrency(financialReports.vatSummary.netVatPayable)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Cash Flow Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Opening Balance</span>
                    <span className="font-medium">{formatCurrency(financialReports.cashFlow.opening)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cash Receipts</span>
                    <span className="font-medium text-green-600">+{formatCurrency(financialReports.cashFlow.receipts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cash Payments</span>
                    <span className="font-medium text-red-600">-{formatCurrency(financialReports.cashFlow.payments)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Closing Balance</span>
                    <span className="font-bold text-blue-600">{formatCurrency(financialReports.cashFlow.closing)}</span>
                  </div>
                  <div className="text-center">
                    <Badge variant="default" className="text-sm">
                      Healthy Cash Position
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Ratios */}
          <Card>
            <CardHeader>
              <CardTitle>Key Financial Ratios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">65.3%</div>
                  <div className="text-sm text-gray-500">Gross Margin</div>
                  <div className="text-xs text-green-600">+2.1% vs target</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">42.2%</div>
                  <div className="text-sm text-gray-500">Net Margin</div>
                  <div className="text-xs text-blue-600">+1.8% vs target</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">4.2x</div>
                  <div className="text-sm text-gray-500">Inventory Turnover</div>
                  <div className="text-xs text-purple-600">+0.3x vs target</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">1.8x</div>
                  <div className="text-sm text-gray-500">Current Ratio</div>
                  <div className="text-xs text-orange-600">Healthy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Footfall</TableHead>
                    <TableHead>Conversion %</TableHead>
                    <TableHead>Performance vs Target</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locationAnalytics.map((location) => (
                    <TableRow key={location.name}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{formatCurrency(location.revenue)}</TableCell>
                      <TableCell>{location.orders?.toLocaleString() || "0"}</TableCell>
                      <TableCell>{location.footfall?.toLocaleString() || "0"}</TableCell>
                      <TableCell>{location.conversion}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={location.performance} className="w-16 h-2" />
                          <span className={`text-sm ${getPerformanceColor(location.performance)}`}>
                            {location.performance}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={location.performance >= 100 ? "default" : location.performance >= 90 ? "secondary" : "destructive"}
                        >
                          {location.performance >= 100 ? "Exceeding" : location.performance >= 90 ? "Meeting" : "Below"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Location Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {locationAnalytics.map((location) => (
              <Card key={location.name}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="text-center">
                      <h4 className="font-medium">{location.name}</h4>
                      <Badge
                        variant={location.performance >= 100 ? "default" : location.performance >= 90 ? "secondary" : "destructive"}
                      >
                        {location.performance}% Target
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Revenue</span>
                        <span className="font-medium">{formatCurrency(location.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Orders</span>
                        <span className="font-medium">{location.orders?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Footfall</span>
                        <span className="font-medium">{location.footfall?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion</span>
                        <span className="font-medium">{location.conversion}%</span>
                      </div>
                    </div>

                    <Progress value={location.performance} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom Reports Tab */}
        <TabsContent value="custom" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create customized reports based on your specific requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Analysis</SelectItem>
                        <SelectItem value="inventory">Inventory Analysis</SelectItem>
                        <SelectItem value="customer">Customer Analysis</SelectItem>
                        <SelectItem value="financial">Financial Analysis</SelectItem>
                        <SelectItem value="employee">Employee Performance</SelectItem>
                        <SelectItem value="product">Product Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Start Date
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            End Date
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Filters</Label>
                    <div className="space-y-2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="dubai">Dubai Mall Store</SelectItem>
                          <SelectItem value="abudhabi">Abu Dhabi Mall Store</SelectItem>
                          <SelectItem value="sharjah">Sharjah City Centre</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Product Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="oud">Oud Products</SelectItem>
                          <SelectItem value="perfume">Perfumes</SelectItem>
                          <SelectItem value="attar">Attar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                        <SelectItem value="dashboard">Dashboard View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Saved Reports</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Monthly Sales Summary', type: 'Sales', lastRun: '2024-01-15' },
                      { name: 'Inventory Turnover Analysis', type: 'Inventory', lastRun: '2024-01-14' },
                      { name: 'Customer Segmentation Report', type: 'Customer', lastRun: '2024-01-13' },
                      { name: 'Location Performance Comparison', type: 'Performance', lastRun: '2024-01-12' }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-gray-500">
                            {report.type} • Last run: {report.lastRun}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;