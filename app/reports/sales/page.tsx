'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  Filter,
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Percent,
  Clock,
  FileSpreadsheet,
  FileImage,
  Building,
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

export default function SalesReportsPage() {
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to?: Date | undefined}>({
    from: undefined,
    to: undefined,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');

  // Mock data for sales analytics
  const salesOverview = {
    totalRevenue: 2450000.00,
    totalOrders: 1250,
    averageOrderValue: 1960.00,
    grossMargin: 68.5,
    netMargin: 42.3,
    growthRate: 15.8,
    vatCollected: 122500.00,
    conversionRate: 3.2
  };

  const salesByChannel = [
    { channel: 'Retail Store', revenue: 1470000, orders: 750, percentage: 60, growth: 12.5 },
    { channel: 'Online Store', revenue: 612500, orders: 350, percentage: 25, growth: 28.3 },
    { channel: 'Wholesale', revenue: 245000, orders: 100, percentage: 10, growth: 8.7 },
    { channel: 'Corporate Sales', revenue: 122500, orders: 50, percentage: 5, growth: 22.1 }
  ];

  const salesByLocation = [
    { location: 'Dubai Mall', revenue: 980000, orders: 500, percentage: 40, vatRate: 5 },
    { location: 'Mall of Emirates', revenue: 735000, orders: 375, percentage: 30, vatRate: 5 },
    { location: 'City Walk', revenue: 490000, orders: 250, percentage: 20, vatRate: 5 },
    { location: 'Online', revenue: 245000, orders: 125, percentage: 10, vatRate: 5 }
  ];

  const topProducts = [
    {
      product: 'Royal Oud Premium 50ml',
      revenue: 187500,
      units: 125,
      margin: 72.5,
      category: 'Oud',
      growth: 18.2
    },
    {
      product: 'Amber Essence Deluxe 30ml',
      revenue: 156000,
      units: 200,
      margin: 65.8,
      category: 'Amber',
      growth: 22.7
    },
    {
      product: 'Rose Garden Collection Set',
      revenue: 144000,
      units: 180,
      margin: 58.3,
      category: 'Rose',
      growth: -3.2
    },
    {
      product: 'Sandalwood Serenity 25ml',
      revenue: 128500,
      units: 257,
      margin: 54.2,
      category: 'Sandalwood',
      growth: 11.8
    },
    {
      product: 'Musk Al-Haramain 100ml',
      revenue: 96750,
      units: 129,
      margin: 49.1,
      category: 'Musk',
      growth: 7.9
    }
  ];

  const salesTrends = [
    { period: 'Jan 2024', revenue: 185000, orders: 95, growth: 8.2 },
    { period: 'Feb 2024', revenue: 198000, orders: 102, growth: 7.0 },
    { period: 'Mar 2024', revenue: 225000, orders: 118, growth: 13.6 },
    { period: 'Apr 2024', revenue: 242000, orders: 125, growth: 7.6 },
    { period: 'May 2024', revenue: 267000, orders: 138, growth: 10.3 },
    { period: 'Jun 2024', revenue: 278000, orders: 142, growth: 4.1 },
    { period: 'Jul 2024', revenue: 295000, orders: 155, growth: 6.1 },
    { period: 'Aug 2024', revenue: 315000, orders: 168, growth: 6.8 },
    { period: 'Sep 2024', revenue: 342000, orders: 182, growth: 8.6 },
    { period: 'Oct 2024', revenue: 365000, orders: 195, growth: 6.7 }
  ];

  const vatAnalysis = useMemo(() => {
    const totalVAT = salesOverview.vatCollected;
    const vatRate = 0.05; // 5% VAT rate in UAE
    const netSales = salesOverview.totalRevenue / (1 + vatRate);

    return {
      totalVAT,
      netSales,
      vatRate: vatRate * 100,
      monthlyVAT: totalVAT / 12,
      quarterlyVAT: totalVAT / 4
    };
  }, [salesOverview]);

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Mock export functionality
    alert(`Exporting sales report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-oud-600" />
            Sales Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive sales performance analysis with UAE compliance
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
              <SelectItem value="online">Online Store</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            placeholder="Select period"
          />

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportReport('csv')}
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(salesOverview.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(salesOverview.growthRate)} from last period
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              VAT Collected: {formatCurrency(salesOverview.vatCollected)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{salesOverview.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              AOV: {formatCurrency(salesOverview.averageOrderValue)}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Conversion Rate: {salesOverview.conversionRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{salesOverview.grossMargin}%</div>
            <p className="text-xs text-muted-foreground">
              Net Margin: {salesOverview.netMargin}%
            </p>
            <Progress value={salesOverview.grossMargin} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oud-600">92.5</div>
            <p className="text-xs text-muted-foreground">
              Above target by 12.5%
            </p>
            <Badge className="mt-2 bg-green-500 text-white">Excellent</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="vat">VAT Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance Summary</CardTitle>
                <CardDescription>
                  Key metrics for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(salesOverview.totalRevenue)}</div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <Badge className="mt-1 bg-green-500 text-white">{formatPercentage(salesOverview.growthRate)}</Badge>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="text-2xl font-bold text-blue-600">{salesOverview.totalOrders}</div>
                      <p className="text-sm text-muted-foreground">Orders Processed</p>
                      <Badge className="mt-1 bg-blue-500 text-white">+8.2%</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Average Order Value</span>
                      <span className="text-oud-600 font-bold">{formatCurrency(salesOverview.averageOrderValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Gross Margin</span>
                      <span className="text-oud-600 font-bold">{salesOverview.grossMargin}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Conversion Rate</span>
                      <span className="text-oud-600 font-bold">{salesOverview.conversionRate}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>
                  Sales breakdown by revenue sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Revenue distribution chart</p>
                    <p className="text-sm text-muted-foreground">(Interactive chart will be displayed here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>Performance Insight:</strong> Your sales are performing {formatPercentage(salesOverview.growthRate)} above target this period.
              The luxury perfume segment is showing exceptional growth with online channels contributing significantly to overall performance.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trends Analysis</CardTitle>
              <CardDescription>
                Monthly revenue and order trends with growth analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg mb-6">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                  <p className="text-muted-foreground">Sales trend line chart</p>
                  <p className="text-sm text-muted-foreground">(Interactive trend analysis will be displayed here)</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>AOV</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesTrends.slice(-6).map((trend) => (
                      <TableRow key={trend.period}>
                        <TableCell className="font-medium">{trend.period}</TableCell>
                        <TableCell>{formatCurrency(trend.revenue)}</TableCell>
                        <TableCell>{trend.orders}</TableCell>
                        <TableCell>{formatCurrency(trend.revenue / trend.orders)}</TableCell>
                        <TableCell>
                          <Badge variant={trend.growth >= 0 ? "default" : "destructive"}>
                            {formatPercentage(trend.growth)}
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

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Channel</CardTitle>
              <CardDescription>
                Performance analysis across different sales channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByChannel.map((channel) => (
                  <Card key={channel.channel} className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-oud-600 rounded-full"></div>
                        <div>
                          <h3 className="font-semibold">{channel.channel}</h3>
                          <p className="text-sm text-muted-foreground">{channel.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-oud-600">{formatCurrency(channel.revenue)}</div>
                        <Badge variant="outline">{channel.percentage}% of total</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Progress value={channel.percentage} className="w-full" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Growth: {formatPercentage(channel.growth)}</span>
                        <span className="text-muted-foreground">AOV: {formatCurrency(channel.revenue / channel.orders)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Location Performance</CardTitle>
              <CardDescription>
                Sales performance across all store locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Share</TableHead>
                      <TableHead>AOV</TableHead>
                      <TableHead>VAT Collected</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesByLocation.map((location) => (
                      <TableRow key={location.location}>
                        <TableCell className="font-medium">{location.location}</TableCell>
                        <TableCell>{formatCurrency(location.revenue)}</TableCell>
                        <TableCell>{location.orders}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={location.percentage} className="w-16 h-2" />
                            <span className="text-sm">{location.percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(location.revenue / location.orders)}</TableCell>
                        <TableCell>{formatCurrency(location.revenue * location.vatRate / 100)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>
                Best selling products with detailed performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Units Sold</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={product.product}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-oud-100 rounded-full flex items-center justify-center text-xs font-medium text-oud-600">
                              {index + 1}
                            </div>
                            <span className="font-medium">{product.product}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="font-bold text-oud-600">{formatCurrency(product.revenue)}</TableCell>
                        <TableCell>{product.units}</TableCell>
                        <TableCell>{product.margin}%</TableCell>
                        <TableCell>
                          <Badge variant={product.growth >= 0 ? "default" : "destructive"}>
                            {formatPercentage(product.growth)}
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

        <TabsContent value="vat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>UAE VAT Summary</CardTitle>
                <CardDescription>
                  VAT collection and compliance reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-red-50 to-red-100">
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(vatAnalysis.totalVAT)}</div>
                    <p className="text-sm text-muted-foreground">Total VAT Collected</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                    <div className="text-2xl font-bold text-green-600">{vatAnalysis.vatRate}%</div>
                    <p className="text-sm text-muted-foreground">VAT Rate Applied</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Net Sales (excluding VAT)</span>
                    <span className="font-bold">{formatCurrency(vatAnalysis.netSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly VAT Average</span>
                    <span className="font-bold text-red-600">{formatCurrency(vatAnalysis.monthlyVAT)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quarterly VAT Total</span>
                    <span className="font-bold text-red-600">{formatCurrency(vatAnalysis.quarterlyVAT)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>VAT Compliance Status</CardTitle>
                <CardDescription>
                  Current compliance status and filing requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>VAT Registration</span>
                  </div>
                  <Badge className="bg-green-500 text-white">Compliant</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Monthly Filing</span>
                  </div>
                  <Badge className="bg-green-500 text-white">Up to Date</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Next Filing Due</span>
                  </div>
                  <Badge className="bg-yellow-500 text-white">15 Days</Badge>
                </div>

                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Next VAT return is due on November 28, 2024. Ensure all sales data is finalized before filing.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}