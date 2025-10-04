'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter, FileText, Users, ShoppingCart, Package, DollarSign,
  ArrowLeft} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

export default function ReportsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to?: Date | undefined}>({
    from: undefined,
    to: undefined,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data for reports
  const salesData = {
    totalRevenue: 125000.00,
    totalOrders: 85,
    averageOrderValue: 1470.59,
    growthRate: 12.5,
  };

  const topProducts = [
    { name: 'Royal Oud Premium', sales: 25, revenue: 11250.00, margin: 65 },
    { name: 'Amber Essence Deluxe', sales: 18, revenue: 5760.00, margin: 58 },
    { name: 'Rose Garden Collection', sales: 22, revenue: 6160.00, margin: 62 },
    { name: 'Sandalwood Serenity', sales: 12, revenue: 4560.00, margin: 55 },
    { name: 'Musk Al-Haramain', sales: 16, revenue: 3520.00, margin: 48 },
  ];

  const customerAnalytics = {
    totalCustomers: 245,
    newCustomers: 12,
    retentionRate: 85,
    averageLifetimeValue: 3250.00,
  };

  const inventoryStats = [
    { category: 'Oud', inStock: 45, lowStock: 3, value: 28500.00 },
    { category: 'Amber', inStock: 32, lowStock: 1, value: 18200.00 },
    { category: 'Rose', inStock: 28, lowStock: 2, value: 12400.00 },
    { category: 'Sandalwood', inStock: 18, lowStock: 4, value: 15300.00 },
    { category: 'Musk', inStock: 35, lowStock: 0, value: 9800.00 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 sm:h-8 w-6 sm:w-8 text-oud-600" />
              Business Intelligence
            </h1>
            <p className="text-muted-foreground mt-1">
              Analytics, Reports & Performance Dashboards
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            placeholder="Select period"
          />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {formatCurrency(salesData.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{salesData.growthRate}% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{salesData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(salesData.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{customerAnalytics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {customerAnalytics.retentionRate}% retention rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-oud-600">
              {formatCurrency(inventoryStats.reduce((sum, item) => sum + item.value, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {inventoryStats.length} categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Reports */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>
                  Revenue performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Sales trend chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component integration needed)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Revenue distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryStats.map((category, index) => {
                    const percentage = (category.value / inventoryStats.reduce((sum, item) => sum + item.value, 0)) * 100;
                    return (
                      <div key={category.category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{category.category}</span>
                          <span className="text-oud-600">{formatCurrency(category.value)}</span>
                        </div>
                        <Progress value={percentage} className="w-full" />
                        <p className="text-xs text-muted-foreground">
                          {percentage.toFixed(1)}% of total revenue
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Summary</CardTitle>
              <CardDescription>
                Key performance indicators for the current period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-oud-600">{formatCurrency(125000)}</div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <Badge className="mt-1 bg-green-500 text-white">+12%</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-oud-600">85</div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <Badge className="mt-1 bg-blue-500 text-white">+8%</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-oud-600">{formatCurrency(1470)}</div>
                  <p className="text-sm text-muted-foreground">Avg Order</p>
                  <Badge className="mt-1 bg-purple-500 text-white">+3%</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-oud-600">62%</div>
                  <p className="text-sm text-muted-foreground">Margin</p>
                  <Badge className="mt-1 bg-amber-500 text-white">+2%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>
                Best selling products with revenue and margin analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <Card key={product.name} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-oud-100 rounded-full flex items-center justify-center text-sm font-medium text-oud-600">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-oud-600">{formatCurrency(product.revenue)}</div>
                        <Badge variant="outline">{product.margin}% margin</Badge>
                      </div>
                    </div>
                    <Progress value={product.margin} className="w-full" />
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
                <CardDescription>
                  Customer acquisition and retention metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-oud-600">{customerAnalytics.totalCustomers}</div>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{customerAnalytics.newCustomers}</div>
                    <p className="text-sm text-muted-foreground">New This Month</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Customer Retention Rate</span>
                    <span className="font-bold text-oud-600">{customerAnalytics.retentionRate}%</span>
                  </div>
                  <Progress value={customerAnalytics.retentionRate} className="w-full" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Average Lifetime Value</span>
                    <span className="font-bold text-oud-600">{formatCurrency(customerAnalytics.averageLifetimeValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>
                  Distribution by customer status and value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Customer segmentation chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component integration needed)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analysis</CardTitle>
              <CardDescription>
                Stock levels, value, and performance by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryStats.map((category) => (
                  <Card key={category.category} className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">{category.category}</h3>
                      <div className="text-right">
                        <div className="font-bold text-oud-600">{formatCurrency(category.value)}</div>
                        <p className="text-sm text-muted-foreground">{category.inStock} in stock</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">{category.inStock} units</Badge>
                        {category.lowStock > 0 && (
                          <Badge variant="destructive">{category.lowStock} low stock</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg value: {formatCurrency(category.value / category.inStock)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>
                  Monthly financial performance summary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Gross Revenue</span>
                    <span className="font-bold text-green-600">{formatCurrency(125000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost of Goods Sold</span>
                    <span className="font-bold text-red-600">-{formatCurrency(45000)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Gross Profit</span>
                    <span className="font-bold text-oud-600">{formatCurrency(80000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operating Expenses</span>
                    <span className="font-bold text-red-600">-{formatCurrency(62000)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Net Income</span>
                    <span className="font-bold text-oud-600">{formatCurrency(18000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>
                  Operating expense distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Expense breakdown chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component integration needed)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}