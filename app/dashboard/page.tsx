'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Bell,
  Globe,
  Settings,
  User,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Receipt,
  Beaker,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Building2,
  CreditCard,
  Calendar,
  Clock,
  Star,
  Gift,
  Truck,
  MapPin,
  Download,
  Eye,
  Crown,
  Heart,
  PiggyBank,
  Zap,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  Activity,
  Target,
  Percent,
  Ship,
  CheckCircle,
  AlertCircle,
  Timer
} from 'lucide-react';

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  // Sample KPI data
  const kpiData = {
    todaysSales: {
      amount: 15420,
      orders: 28,
      change: +12.5
    },
    inventoryValue: {
      amount: 2450000,
      change: +3.2
    },
    newCustomers: {
      count: 7,
      change: +40.0
    },
    dailyProfit: {
      amount: 4830,
      margin: 31.3,
      change: +8.7
    },
    alerts: {
      lowStock: 12,
      expiring: 3,
      pendingOrders: 5
    }
  };

  // Sales chart data (simplified)
  const salesChartData = [
    { period: 'Mon', sales: 12500, target: 15000 },
    { period: 'Tue', sales: 18200, target: 15000 },
    { period: 'Wed', sales: 15800, target: 15000 },
    { period: 'Thu', sales: 22100, target: 15000 },
    { period: 'Fri', sales: 19500, target: 15000 },
    { period: 'Sat', sales: 25300, target: 15000 },
    { period: 'Sun', sales: 16900, target: 15000 }
  ];

  // Store performance data
  const storePerformance = [
    { name: 'Dubai Mall', sales: 45200, target: 40000, status: 'excellent' },
    { name: 'Mall of Emirates', sales: 32800, target: 35000, status: 'good' },
    { name: 'Ibn Battuta', sales: 28500, target: 30000, status: 'average' },
    { name: 'Abu Dhabi Mall', sales: 38900, target: 35000, status: 'excellent' }
  ];

  // Production batches
  const productionBatches = [
    { id: 'BATCH-001', product: 'Royal Cambodian Oud', progress: 85, eta: '2 days' },
    { id: 'BATCH-002', product: 'Taif Rose Attar', progress: 65, eta: '5 days' },
    { id: 'BATCH-003', product: 'Hindi Black Oud', progress: 30, eta: '12 days' }
  ];

  // Top customers
  const topCustomers = [
    { name: 'Ahmed Al-Rashid', type: 'VIP', spent: 15600, points: 2340 },
    { name: 'Fatima Al-Zahra', type: 'Premium', spent: 12800, points: 1920 },
    { name: 'Omar Hassan', type: 'VIP', spent: 11200, points: 1680 },
    { name: 'Luxury Hotel Group', type: 'Corporate', spent: 28500, points: 4275 }
  ];

  // Recent alerts
  const recentAlerts = [
    { type: 'warning', message: 'Royal Oud stock below 5 units', time: '2h ago' },
    { type: 'info', message: 'New import shipment arrived', time: '4h ago' },
    { type: 'urgent', message: 'VAT filing due in 3 days', time: '1d ago' }
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getStoreStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Search */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                O
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Oud Palace</h1>
                <p className="text-xs text-gray-500">ERP + POS System</p>
              </div>
            </div>

            <div className="relative ml-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products, customers, invoices..."
                className="pl-10 w-80"
              />
            </div>
          </div>

          {/* Right: Controls & Profile */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="arabic">العربية</SelectItem>
              </SelectContent>
            </Select>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>

            {/* Quick Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
              <div className="text-sm">
                <div className="font-medium">Admin User</div>
                <div className="text-gray-500">HQ Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
          <p className="opacity-90">Here's what's happening with your business today</p>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Today's Sales */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                  <p className="text-2xl font-bold">AED {kpiData.todaysSales.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{kpiData.todaysSales.orders} orders</p>
                  <div className={`text-xs flex items-center gap-1 ${getChangeColor(kpiData.todaysSales.change)}`}>
                    {getChangeIcon(kpiData.todaysSales.change)}
                    {Math.abs(kpiData.todaysSales.change)}% vs yesterday
                  </div>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Inventory Value */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                  <p className="text-2xl font-bold">AED {(kpiData.inventoryValue.amount / 1000000).toFixed(1)}M</p>
                  <div className={`text-xs flex items-center gap-1 ${getChangeColor(kpiData.inventoryValue.change)}`}>
                    {getChangeIcon(kpiData.inventoryValue.change)}
                    {Math.abs(kpiData.inventoryValue.change)}% this month
                  </div>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* New Customers */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Customers</p>
                  <p className="text-2xl font-bold">{kpiData.newCustomers.count}</p>
                  <p className="text-sm text-gray-500">today</p>
                  <div className={`text-xs flex items-center gap-1 ${getChangeColor(kpiData.newCustomers.change)}`}>
                    {getChangeIcon(kpiData.newCustomers.change)}
                    {Math.abs(kpiData.newCustomers.change)}% vs yesterday
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          {/* Daily Profit */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Daily Profit</p>
                  <p className="text-2xl font-bold">AED {kpiData.dailyProfit.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{kpiData.dailyProfit.margin}% margin</p>
                  <div className={`text-xs flex items-center gap-1 ${getChangeColor(kpiData.dailyProfit.change)}`}>
                    {getChangeIcon(kpiData.dailyProfit.change)}
                    {Math.abs(kpiData.dailyProfit.change)}% vs yesterday
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold">{kpiData.alerts.lowStock + kpiData.alerts.expiring + kpiData.alerts.pendingOrders}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>{kpiData.alerts.lowStock} low stock</div>
                    <div>{kpiData.alerts.expiring} expiring</div>
                    <div>{kpiData.alerts.pendingOrders} pending</div>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Row */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>One-click access to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Link href="/pos/terminal">
                <Button className="h-20 w-full flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm">New Sale</span>
                </Button>
              </Link>

              <Link href="/inventory/add-products">
                <Button variant="outline" className="h-20 w-full flex flex-col space-y-2">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Add Product</span>
                </Button>
              </Link>

              <Link href="/purchasing/create-order">
                <Button variant="outline" className="h-20 w-full flex flex-col space-y-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Purchase Order</span>
                </Button>
              </Link>

              <Link href="/production/batch">
                <Button variant="outline" className="h-20 w-full flex flex-col space-y-2">
                  <Beaker className="h-6 w-6" />
                  <span className="text-sm">Start Batch</span>
                </Button>
              </Link>

              <Link href="/crm/add-customer">
                <Button variant="outline" className="h-20 w-full flex flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Add Customer</span>
                </Button>
              </Link>

              <Link href="/reports">
                <Button variant="outline" className="h-20 w-full flex flex-col space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Generate Report</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sales & Inventory Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Performance Chart */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Daily sales vs targets (This Week)</CardDescription>
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesChartData.map((day) => (
                  <div key={day.period} className="flex items-center justify-between">
                    <div className="w-12 text-sm font-medium">{day.period}</div>
                    <div className="flex-1 mx-4">
                      <div className="relative">
                        <Progress
                          value={(day.sales / day.target) * 100}
                          className="h-6"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {((day.sales / day.target) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium w-20 text-right">
                      AED {(day.sales / 1000).toFixed(0)}K
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Store Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Store Performance</CardTitle>
              <CardDescription>Sales by location (Today)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storePerformance.map((store) => (
                  <div key={store.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium">{store.name}</div>
                        <div className="text-sm text-gray-500">
                          Target: AED {(store.target / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">AED {(store.sales / 1000).toFixed(0)}K</div>
                      <div className={`text-sm ${getStoreStatusColor(store.status)}`}>
                        {((store.sales / store.target) * 100).toFixed(0)}% of target
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Production & Customer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Production Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-purple-600" />
                Production Batches
              </CardTitle>
              <CardDescription>Ongoing production processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productionBatches.map((batch) => (
                  <div key={batch.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{batch.product}</div>
                        <div className="text-sm text-gray-500">{batch.id}</div>
                      </div>
                      <Badge variant={batch.progress > 80 ? "default" : "secondary"}>
                        {batch.progress}%
                      </Badge>
                    </div>
                    <Progress value={batch.progress} className="mb-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>ETA: {batch.eta}</span>
                      <span>{batch.progress > 80 ? 'Nearly Complete' : 'In Progress'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                Top Customers
              </CardTitle>
              <CardDescription>Highest spenders this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.map((customer) => (
                  <div key={customer.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Badge variant={customer.type === 'VIP' ? 'default' : 'secondary'} className="text-xs">
                            {customer.type}
                          </Badge>
                          <span>{customer.points} points</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">AED {customer.spent.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">this month</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Finance & Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Finance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-green-600" />
                Finance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sales Revenue</span>
                <span className="font-medium">AED 125,600</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expenses</span>
                <span className="font-medium">AED 78,400</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-medium">Net Profit</span>
                <span className="font-bold text-green-600">AED 47,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">VAT Due</span>
                <span className="font-medium text-orange-600">AED 6,280</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="text-sm">{alert.message}</div>
                      <div className="text-xs text-gray-500">{alert.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Quick Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/reports/sales">
                <Button variant="outline" className="w-full justify-between">
                  <span>Sales Report</span>
                  <Download className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/reports/inventory">
                <Button variant="outline" className="w-full justify-between">
                  <span>Inventory Report</span>
                  <Download className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/reports/profitability">
                <Button variant="outline" className="w-full justify-between">
                  <span>Profit Analysis</span>
                  <Download className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/finance/vat">
                <Button variant="outline" className="w-full justify-between">
                  <span>VAT Report</span>
                  <Percent className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Module Navigation Cards */}
        <Card>
          <CardHeader>
            <CardTitle>System Modules</CardTitle>
            <CardDescription>Access all ERP + POS features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Sales & POS', icon: CreditCard, href: '/pos/terminal', color: 'text-blue-600' },
                { name: 'Inventory', icon: Package, href: '/inventory', color: 'text-green-600' },
                { name: 'Production', icon: Beaker, href: '/production', color: 'text-purple-600' },
                { name: 'Customers', icon: Users, href: '/crm', color: 'text-orange-600' },
                { name: 'Purchasing', icon: ShoppingCart, href: '/purchasing', color: 'text-red-600' },
                { name: 'Finance', icon: DollarSign, href: '/finance', color: 'text-yellow-600' },
                { name: 'Multi-Location', icon: Building2, href: '/multi-location', color: 'text-indigo-600' },
                { name: 'E-commerce', icon: Globe, href: '/ecommerce', color: 'text-pink-600' },
                { name: 'HR & Staff', icon: User, href: '/hr', color: 'text-teal-600' },
                { name: 'Reports', icon: BarChart3, href: '/reports', color: 'text-cyan-600' },
                { name: 'Perfume & Oud', icon: Star, href: '/perfume', color: 'text-amber-600' },
                { name: 'Settings', icon: Settings, href: '/settings', color: 'text-gray-600' }
              ].map((module) => (
                <Link key={module.name} href={module.href}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <module.icon className={`h-8 w-8 mx-auto mb-2 ${module.color}`} />
                      <div className="text-sm font-medium">{module.name}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 py-4">
          <div className="flex justify-center items-center space-x-6">
            <span>Oud Palace ERP v1.0</span>
            <span>Last Backup: Today 3:00 AM</span>
            <span>Support: +971-4-XXX-XXXX</span>
          </div>
        </div>
      </div>
    </div>
  );
}