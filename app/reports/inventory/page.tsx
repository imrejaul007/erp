'use client';

import { useState, useMemo } from 'react';
import {
  Package,
  TrendingDown,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Building,
  FileSpreadsheet,
  FileImage,
  Boxes,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export default function InventoryReportsPage() {
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to?: Date | undefined}>({
    from: undefined,
    to: undefined,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for inventory analytics
  const inventoryOverview = {
    totalValue: 2850000.00,
    totalItems: 1475,
    averageValue: 1932.20,
    turnoverRate: 4.2,
    deadStock: 125000.00,
    fastMoving: 65,
    slowMoving: 25,
    outOfStock: 15
  };

  const categoryAnalysis = [
    {
      category: 'Oud',
      totalValue: 1140000,
      units: 285,
      averageValue: 4000,
      turnover: 3.8,
      margin: 72.5,
      growthRate: 12.3,
      stockDays: 95,
      status: 'healthy'
    },
    {
      category: 'Amber',
      totalValue: 684000,
      units: 380,
      averageValue: 1800,
      turnover: 5.2,
      margin: 65.8,
      growthRate: 18.7,
      stockDays: 70,
      status: 'healthy'
    },
    {
      category: 'Rose',
      totalValue: 456000,
      units: 320,
      averageValue: 1425,
      turnover: 4.5,
      margin: 58.3,
      growthRate: -2.1,
      stockDays: 81,
      status: 'caution'
    },
    {
      category: 'Sandalwood',
      totalValue: 342000,
      units: 285,
      averageValue: 1200,
      turnover: 3.2,
      margin: 54.2,
      growthRate: 8.4,
      stockDays: 114,
      status: 'slow'
    },
    {
      category: 'Musk',
      totalValue: 228000,
      units: 205,
      averageValue: 1112,
      turnover: 4.8,
      margin: 49.1,
      growthRate: 6.9,
      stockDays: 76,
      status: 'healthy'
    }
  ];

  const locationInventory = [
    {
      location: 'Dubai Mall',
      totalValue: 1140000,
      items: 590,
      utilization: 85,
      turnover: 4.5,
      lowStock: 8,
      overstock: 12
    },
    {
      location: 'Mall of Emirates',
      totalValue: 855000,
      items: 442,
      utilization: 78,
      turnover: 4.1,
      lowStock: 6,
      overstock: 15
    },
    {
      location: 'City Walk',
      totalValue: 570000,
      items: 295,
      utilization: 72,
      turnover: 3.8,
      lowStock: 4,
      overstock: 8
    },
    {
      location: 'Warehouse',
      totalValue: 285000,
      items: 148,
      utilization: 65,
      turnover: 2.1,
      lowStock: 2,
      overstock: 25
    }
  ];

  const stockAlerts = [
    {
      product: 'Royal Oud Premium 50ml',
      category: 'Oud',
      currentStock: 5,
      minStock: 20,
      maxStock: 100,
      value: 22500,
      status: 'critical',
      lastRestocked: '2024-09-15',
      location: 'Dubai Mall'
    },
    {
      product: 'Amber Essence Deluxe 30ml',
      category: 'Amber',
      currentStock: 12,
      minStock: 25,
      maxStock: 80,
      value: 9360,
      status: 'low',
      lastRestocked: '2024-09-28',
      location: 'Mall of Emirates'
    },
    {
      product: 'Rose Garden Collection Set',
      category: 'Rose',
      currentStock: 85,
      minStock: 15,
      maxStock: 60,
      value: 68000,
      status: 'overstock',
      lastRestocked: '2024-08-20',
      location: 'Warehouse'
    },
    {
      product: 'Sandalwood Serenity 25ml',
      category: 'Sandalwood',
      currentStock: 8,
      minStock: 18,
      maxStock: 75,
      value: 4000,
      status: 'low',
      lastRestocked: '2024-09-25',
      location: 'City Walk'
    }
  ];

  const valuationHistory = [
    { month: 'Jan 2024', value: 2650000, change: 2.1 },
    { month: 'Feb 2024', value: 2720000, change: 2.6 },
    { month: 'Mar 2024', value: 2780000, change: 2.2 },
    { month: 'Apr 2024', value: 2830000, change: 1.8 },
    { month: 'May 2024', value: 2865000, change: 1.2 },
    { month: 'Jun 2024', value: 2845000, change: -0.7 },
    { month: 'Jul 2024', value: 2870000, change: 0.9 },
    { month: 'Aug 2024', value: 2825000, change: -1.6 },
    { month: 'Sep 2024', value: 2850000, change: 0.9 },
    { month: 'Oct 2024', value: 2850000, change: 0.0 }
  ];

  const abcAnalysis = useMemo(() => {
    const totalValue = categoryAnalysis.reduce((sum, cat) => sum + cat.totalValue, 0);

    const categoriesWithPercentage = categoryAnalysis.map(cat => ({
      ...cat,
      valuePercentage: (cat.totalValue / totalValue) * 100
    })).sort((a, b) => b.valuePercentage - a.valuePercentage);

    let cumulativePercentage = 0;
    return categoriesWithPercentage.map(cat => {
      cumulativePercentage += cat.valuePercentage;
      let classification = 'C';
      if (cumulativePercentage <= 80) classification = 'A';
      else if (cumulativePercentage <= 95) classification = 'B';

      return {
        ...cat,
        classification,
        cumulativePercentage
      };
    });
  }, [categoryAnalysis]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'low': return 'text-orange-600 bg-orange-50';
      case 'overstock': return 'text-blue-600 bg-blue-50';
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'slow': return 'text-yellow-600 bg-yellow-50';
      case 'caution': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`Exporting inventory report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-8 w-8 text-oud-600" />
            Inventory Reports & Valuation
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive inventory analysis with stock valuation and performance metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[160px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="dubai-mall">Dubai Mall</SelectItem>
              <SelectItem value="mall-emirates">Mall of Emirates</SelectItem>
              <SelectItem value="city-walk">City Walk</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="oud">Oud</SelectItem>
              <SelectItem value="amber">Amber</SelectItem>
              <SelectItem value="rose">Rose</SelectItem>
              <SelectItem value="sandalwood">Sandalwood</SelectItem>
              <SelectItem value="musk">Musk</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            placeholder="Select period"
          />

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportReport('pdf')}
              className="gap-1"
            >
              <FileImage className="h-4 w-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportReport('excel')}
              className="gap-1"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Key Inventory Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {formatCurrency(inventoryOverview.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventoryOverview.totalItems?.toLocaleString() || "0"} total items
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Avg Value: {formatCurrency(inventoryOverview.averageValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{inventoryOverview.turnoverRate}x</div>
            <p className="text-xs text-muted-foreground">
              Annual inventory turnover
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Target: 5.0x annually
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{inventoryOverview.outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              Items requiring attention
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {inventoryOverview.slowMoving} slow-moving items
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dead Stock Value</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {formatCurrency(inventoryOverview.deadStock)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((inventoryOverview.deadStock / inventoryOverview.totalValue) * 100).toFixed(1)}% of total value
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Requires action
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Inventory Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="abc">ABC Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Health Dashboard</CardTitle>
                <CardDescription>
                  Overall inventory performance and health indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                      <div className="text-lg font-bold text-green-600">{inventoryOverview.fastMoving}%</div>
                      <p className="text-sm text-muted-foreground">Fast Moving</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                      <div className="text-lg font-bold text-yellow-600">{inventoryOverview.slowMoving}%</div>
                      <p className="text-sm text-muted-foreground">Slow Moving</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-red-50 to-red-100">
                      <div className="text-lg font-bold text-red-600">{inventoryOverview.outOfStock}</div>
                      <p className="text-sm text-muted-foreground">Out of Stock</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Inventory Turnover</span>
                      <span className="text-oud-600 font-bold">{inventoryOverview.turnoverRate}x</span>
                    </div>
                    <Progress value={(inventoryOverview.turnoverRate / 5) * 100} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Stock Accuracy</span>
                      <span className="text-oud-600 font-bold">98.5%</span>
                    </div>
                    <Progress value={98.5} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Distribution</CardTitle>
                <CardDescription>
                  Value distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Inventory distribution chart</p>
                    <p className="text-sm text-muted-foreground">(Interactive chart will be displayed here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>Inventory Insight:</strong> Your inventory turnover is currently at {inventoryOverview.turnoverRate}x annually, which is below the target of 5.0x.
              Consider optimizing slow-moving categories and improving demand forecasting.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Analysis</CardTitle>
              <CardDescription>
                Detailed analysis of inventory performance by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Avg Value</TableHead>
                      <TableHead>Turnover</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Stock Days</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryAnalysis.map((category) => (
                      <TableRow key={category.category}>
                        <TableCell className="font-medium">{category.category}</TableCell>
                        <TableCell className="font-bold text-oud-600">{formatCurrency(category.totalValue)}</TableCell>
                        <TableCell>{category.units}</TableCell>
                        <TableCell>{formatCurrency(category.averageValue)}</TableCell>
                        <TableCell>{category.turnover}x</TableCell>
                        <TableCell>{category.margin}%</TableCell>
                        <TableCell>{category.stockDays} days</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(category.status)}>
                            {category.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryAnalysis.map((category) => (
              <Card key={category.category} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">{category.category}</h3>
                  <Badge className={getStatusColor(category.status)}>
                    {category.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Value</span>
                    <span className="font-bold text-oud-600">{formatCurrency(category.totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Turnover</span>
                    <span className="font-medium">{category.turnover}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Growth</span>
                    <Badge variant={category.growthRate >= 0 ? "default" : "destructive"}>
                      {formatPercentage(category.growthRate)}
                    </Badge>
                  </div>
                  <Progress value={category.margin} className="w-full mt-2" />
                  <p className="text-xs text-muted-foreground">Margin: {category.margin}%</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Location Inventory Analysis</CardTitle>
              <CardDescription>
                Inventory distribution and performance across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Turnover</TableHead>
                      <TableHead>Low Stock</TableHead>
                      <TableHead>Overstock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locationInventory.map((location) => (
                      <TableRow key={location.location}>
                        <TableCell className="font-medium">{location.location}</TableCell>
                        <TableCell className="font-bold text-oud-600">{formatCurrency(location.totalValue)}</TableCell>
                        <TableCell>{location.items}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={location.utilization} className="w-16 h-2" />
                            <span className="text-sm">{location.utilization}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{location.turnover}x</TableCell>
                        <TableCell>
                          <Badge variant={location.lowStock > 5 ? "destructive" : "secondary"}>
                            {location.lowStock}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={location.overstock > 20 ? "destructive" : "secondary"}>
                            {location.overstock}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Level Alerts</CardTitle>
              <CardDescription>
                Critical stock levels requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockAlerts.map((alert, index) => (
                  <Card key={index} className={`p-4 border-l-4 ${
                    alert.status === 'critical' ? 'border-l-red-500 bg-red-50' :
                    alert.status === 'low' ? 'border-l-orange-500 bg-orange-50' :
                    'border-l-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{alert.product}</h3>
                        <p className="text-sm text-muted-foreground">{alert.category} • {alert.location}</p>
                      </div>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Stock</span>
                        <div className="font-bold">{alert.currentStock} units</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Min Stock</span>
                        <div className="font-medium">{alert.minStock} units</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stock Value</span>
                        <div className="font-bold text-oud-600">{formatCurrency(alert.value)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Restocked</span>
                        <div className="font-medium">{alert.lastRestocked}</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress
                        value={(alert.currentStock / alert.maxStock) * 100}
                        className="w-full h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0</span>
                        <span>Min: {alert.minStock}</span>
                        <span>Max: {alert.maxStock}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valuation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Valuation Trend</CardTitle>
                <CardDescription>
                  Monthly inventory value changes and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg mb-4">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Valuation trend chart</p>
                    <p className="text-sm text-muted-foreground">(Interactive chart will be displayed here)</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {valuationHistory.slice(-6).map((month) => (
                        <TableRow key={month.month}>
                          <TableCell className="font-medium">{month.month}</TableCell>
                          <TableCell className="font-bold text-oud-600">{formatCurrency(month.value)}</TableCell>
                          <TableCell>
                            <Badge variant={month.change >= 0 ? "default" : "destructive"}>
                              {formatPercentage(month.change)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valuation Breakdown</CardTitle>
                <CardDescription>
                  Current inventory valuation by method and category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                    <div className="text-xl font-bold text-green-600">{formatCurrency(2850000)}</div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="text-xl font-bold text-blue-600">{formatCurrency(2750000)}</div>
                    <p className="text-sm text-muted-foreground">Cost Basis</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>FIFO Valuation</span>
                    <span className="font-bold">{formatCurrency(2850000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weighted Average</span>
                    <span className="font-bold">{formatCurrency(2830000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Value</span>
                    <span className="font-bold text-green-600">{formatCurrency(3420000)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Unrealized Gain</span>
                    <span className="font-bold text-green-600">{formatCurrency(570000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="abc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ABC Analysis</CardTitle>
              <CardDescription>
                Inventory classification based on value contribution (Pareto Analysis)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>% of Total</TableHead>
                      <TableHead>Cumulative %</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Recommendation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {abcAnalysis.map((item) => (
                      <TableRow key={item.category}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell>
                          <Badge variant={
                            item.classification === 'A' ? 'default' :
                            item.classification === 'B' ? 'secondary' : 'outline'
                          }>
                            Class {item.classification}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-oud-600">{formatCurrency(item.totalValue)}</TableCell>
                        <TableCell>{item.valuePercentage.toFixed(1)}%</TableCell>
                        <TableCell>{item.cumulativePercentage.toFixed(1)}%</TableCell>
                        <TableCell>{item.units}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {item.classification === 'A' ? 'High Priority - Tight Control' :
                             item.classification === 'B' ? 'Medium Priority - Regular Review' :
                             'Low Priority - Basic Control'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border-2 border-green-200 bg-green-50">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {abcAnalysis.filter(item => item.classification === 'A').length}
                    </div>
                    <p className="text-sm font-medium">Class A Categories</p>
                    <p className="text-xs text-muted-foreground">80% of value, tight control needed</p>
                  </div>
                </Card>

                <Card className="p-4 border-2 border-yellow-200 bg-yellow-50">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                      {abcAnalysis.filter(item => item.classification === 'B').length}
                    </div>
                    <p className="text-sm font-medium">Class B Categories</p>
                    <p className="text-xs text-muted-foreground">15% of value, moderate control</p>
                  </div>
                </Card>

                <Card className="p-4 border-2 border-blue-200 bg-blue-50">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {abcAnalysis.filter(item => item.classification === 'C').length}
                    </div>
                    <p className="text-sm font-medium">Class C Categories</p>
                    <p className="text-xs text-muted-foreground">5% of value, basic control</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}