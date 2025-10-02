'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, BarChart3, TrendingUp, TrendingDown, DollarSign, Percent, Calculator, FileText, Download, Eye, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { DateRangePicker } from '@/components/ui/date-picker';

// Mock data for yield and cost analysis
const yieldReports = [
  {
    id: 'YR-001',
    batchId: 'PB001',
    product: 'Royal Oud Premium',
    recipe: 'RCP-001',
    reportDate: '2024-09-30',
    productionDate: '2024-09-25',
    targetYield: 100,
    actualYield: 97.5,
    yieldEfficiency: 97.5,
    unit: 'bottles',
    materialCosts: {
      oudOil: { planned: 2000, actual: 2000, variance: 0, unit: 'AED' },
      roseWater: { planned: 150, actual: 145, variance: -5, unit: 'AED' },
      sandalwood: { planned: 300, actual: 320, variance: 20, unit: 'AED' },
      carrierOil: { planned: 200, actual: 195, variance: -5, unit: 'AED' },
    },
    totalMaterialCost: { planned: 2650, actual: 2660, variance: 10 },
    laborCosts: { planned: 800, actual: 900, variance: 100 },
    overheadCosts: { planned: 400, actual: 380, variance: -20 },
    totalProductionCost: { planned: 3850, actual: 3940, variance: 90 },
    costPerUnit: { planned: 38.5, actual: 40.41, variance: 1.91 },
    sellingPrice: 85,
    grossMargin: { planned: 46.35, actual: 44.59, variance: -1.76 },
    grossMarginPercentage: { planned: 54.5, actual: 52.5, variance: -2.0 },
    profitability: 'Good',
    qualityGrade: 'A+',
    wastagePercentage: 2.5,
    efficiencyRating: 'Excellent',
    trends: {
      yieldTrend: 'stable',
      costTrend: 'up',
      marginTrend: 'down',
    },
  },
  {
    id: 'YR-002',
    batchId: 'PB002',
    product: 'Amber Essence Deluxe',
    recipe: 'RCP-002',
    reportDate: '2024-09-28',
    productionDate: '2024-09-20',
    targetYield: 80,
    actualYield: 82.3,
    yieldEfficiency: 102.9,
    unit: 'bottles',
    materialCosts: {
      amberResin: { planned: 800, actual: 780, variance: -20, unit: 'AED' },
      almondOil: { planned: 120, actual: 125, variance: 5, unit: 'AED' },
      benzoin: { planned: 200, actual: 190, variance: -10, unit: 'AED' },
      vanilla: { planned: 150, actual: 155, variance: 5, unit: 'AED' },
    },
    totalMaterialCost: { planned: 1270, actual: 1250, variance: -20 },
    laborCosts: { planned: 600, actual: 580, variance: -20 },
    overheadCosts: { planned: 300, actual: 290, variance: -10 },
    totalProductionCost: { planned: 2170, actual: 2120, variance: -50 },
    costPerUnit: { planned: 27.13, actual: 25.76, variance: -1.37 },
    sellingPrice: 55,
    grossMargin: { planned: 27.87, actual: 29.24, variance: 1.37 },
    grossMarginPercentage: { planned: 50.7, actual: 53.2, variance: 2.5 },
    profitability: 'Excellent',
    qualityGrade: 'B+',
    wastagePercentage: 1.8,
    efficiencyRating: 'Outstanding',
    trends: {
      yieldTrend: 'up',
      costTrend: 'down',
      marginTrend: 'up',
    },
  },
  {
    id: 'YR-003',
    batchId: 'PB003',
    product: 'Desert Rose Attar',
    recipe: 'RCP-003',
    reportDate: '2024-09-30',
    productionDate: '2024-09-15',
    targetYield: 50,
    actualYield: 48.2,
    yieldEfficiency: 96.4,
    unit: 'bottles',
    materialCosts: {
      rosePetals: { planned: 2000, actual: 2100, variance: 100, unit: 'AED' },
      sandalwoodBase: { planned: 1500, actual: 1450, variance: -50, unit: 'AED' },
      distilledWater: { planned: 10, actual: 12, variance: 2, unit: 'AED' },
    },
    totalMaterialCost: { planned: 3510, actual: 3562, variance: 52 },
    laborCosts: { planned: 1200, actual: 1350, variance: 150 },
    overheadCosts: { planned: 600, actual: 580, variance: -20 },
    totalProductionCost: { planned: 5310, actual: 5492, variance: 182 },
    costPerUnit: { planned: 106.2, actual: 113.95, variance: 7.75 },
    sellingPrice: 250,
    grossMargin: { planned: 143.8, actual: 136.05, variance: -7.75 },
    grossMarginPercentage: { planned: 57.5, actual: 54.4, variance: -3.1 },
    profitability: 'Good',
    qualityGrade: 'A+',
    wastagePercentage: 3.6,
    efficiencyRating: 'Good',
    trends: {
      yieldTrend: 'down',
      costTrend: 'up',
      marginTrend: 'down',
    },
  },
];

// Mock benchmarking data
const benchmarkData = {
  yieldEfficiency: {
    industry: 95.2,
    company: 98.9,
    target: 96.0,
  },
  costPerUnit: {
    industry: 45.20,
    company: 43.85,
    target: 42.00,
  },
  grossMargin: {
    industry: 48.5,
    company: 53.4,
    target: 55.0,
  },
  wastageRate: {
    industry: 4.2,
    company: 2.6,
    target: 2.0,
  },
};

// Mock trend data
const trendData = [
  { month: 'Jun', yield: 95.2, cost: 42.1, margin: 52.8 },
  { month: 'Jul', yield: 96.8, cost: 41.5, margin: 54.2 },
  { month: 'Aug', yield: 98.1, cost: 43.2, margin: 51.9 },
  { month: 'Sep', yield: 98.9, cost: 43.8, margin: 53.4 },
];

const getProfitabilityBadge = (profitability: string) => {
  const colors: { [key: string]: string } = {
    'Excellent': 'bg-green-500 text-white',
    'Good': 'bg-blue-500 text-white',
    'Average': 'bg-yellow-500 text-white',
    'Poor': 'bg-red-500 text-white',
  };
  return <Badge className={colors[profitability] || 'bg-gray-500 text-white'}>{profitability}</Badge>;
};

const getEfficiencyBadge = (rating: string) => {
  const colors: { [key: string]: string } = {
    'Outstanding': 'bg-emerald-500 text-white',
    'Excellent': 'bg-green-500 text-white',
    'Good': 'bg-blue-500 text-white',
    'Average': 'bg-yellow-500 text-white',
    'Poor': 'bg-red-500 text-white',
  };
  return <Badge className={colors[rating] || 'bg-gray-500 text-white'}>{rating}</Badge>;
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Target className="h-4 w-4 text-gray-500" />;
  }
};

const getVarianceColor = (variance: number) => {
  if (variance > 0) return 'text-red-500';
  if (variance < 0) return 'text-green-500';
  return 'text-gray-500';
};

export default function YieldReportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [selectedReport, setSelectedReport] = useState<typeof yieldReports[0] | null>(null);
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{from: Date | undefined, to?: Date | undefined}>();

  const filteredReports = yieldReports.filter(report => {
    const matchesSearch = report.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct = filterProduct === 'all' || report.product.toLowerCase().includes(filterProduct.toLowerCase());
    return matchesSearch && matchesProduct;
  });

  const handleViewReport = (report: typeof yieldReports[0]) => {
    setSelectedReport(report);
    setIsViewReportDialogOpen(true);
  };

  // Calculate aggregate statistics
  const avgYieldEfficiency = yieldReports.reduce((acc, r) => acc + r.yieldEfficiency, 0) / yieldReports.length;
  const avgCostPerUnit = yieldReports.reduce((acc, r) => acc + r.costPerUnit.actual, 0) / yieldReports.length;
  const avgGrossMargin = yieldReports.reduce((acc, r) => acc + r.grossMarginPercentage.actual, 0) / yieldReports.length;
  const avgWastage = yieldReports.reduce((acc, r) => acc + r.wastagePercentage, 0) / yieldReports.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-oud-600" />
            Yield & Cost Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive production yield analysis and cost optimization reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
          <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Yield Efficiency</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{avgYieldEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Target: {benchmarkData.yieldEfficiency.target}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost Per Unit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">AED {avgCostPerUnit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Target: AED {benchmarkData.costPerUnit.target}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Gross Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{avgGrossMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Target: {benchmarkData.grossMargin.target}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wastage Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{avgWastage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Target: {benchmarkData.wastageRate.target}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Yield Reports</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarking</TabsTrigger>
          <TabsTrigger value="optimization">Cost Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Yield Reports</CardTitle>
              <CardDescription>
                Detailed yield analysis and cost breakdown for each production batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterProduct} onValueChange={setFilterProduct}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="royal oud">Royal Oud Premium</SelectItem>
                    <SelectItem value="amber essence">Amber Essence Deluxe</SelectItem>
                    <SelectItem value="desert rose">Desert Rose Attar</SelectItem>
                  </SelectContent>
                </Select>
                <DateRangePicker
                  dateRange={selectedDateRange}
                  setDateRange={setSelectedDateRange}
                  placeholder="Select date range"
                  className="w-[200px]"
                />
              </div>

              {/* Reports Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Yield Efficiency</TableHead>
                      <TableHead>Cost/Unit</TableHead>
                      <TableHead>Gross Margin</TableHead>
                      <TableHead>Profitability</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.batchId}</TableCell>
                        <TableCell>{report.product}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={report.yieldEfficiency} className="w-16" />
                            <span className="text-sm">{report.yieldEfficiency.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>AED {report.costPerUnit.actual.toFixed(2)}</TableCell>
                        <TableCell>{report.grossMarginPercentage.actual.toFixed(1)}%</TableCell>
                        <TableCell>{getProfitabilityBadge(report.profitability)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.qualityGrade}</Badge>
                        </TableCell>
                        <TableCell>{report.reportDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewReport(report)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends (Last 4 Months)</CardTitle>
                <CardDescription>
                  Track key performance indicators over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendData.map((data, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                      <div className="text-center">
                        <div className="text-sm font-medium">{data.month}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{data.yield}%</div>
                        <div className="text-xs text-muted-foreground">Yield</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">AED {data.cost}</div>
                        <div className="text-xs text-muted-foreground">Cost/Unit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{data.margin}%</div>
                        <div className="text-xs text-muted-foreground">Margin</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>
                  Key insights and trend directions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTrendIcon('up')}
                      <div>
                        <div className="font-medium">Yield Efficiency</div>
                        <div className="text-sm text-muted-foreground">Improving trend</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">+3.7%</div>
                      <div className="text-sm text-muted-foreground">vs last quarter</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTrendIcon('up')}
                      <div>
                        <div className="font-medium">Production Costs</div>
                        <div className="text-sm text-muted-foreground">Slight increase</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">+4.1%</div>
                      <div className="text-sm text-muted-foreground">vs last quarter</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTrendIcon('stable')}
                      <div>
                        <div className="font-medium">Gross Margin</div>
                        <div className="text-sm text-muted-foreground">Stable performance</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">+0.6%</div>
                      <div className="text-sm text-muted-foreground">vs last quarter</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTrendIcon('down')}
                      <div>
                        <div className="font-medium">Wastage Rate</div>
                        <div className="text-sm text-muted-foreground">Decreasing trend</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">-1.6%</div>
                      <div className="text-sm text-muted-foreground">vs last quarter</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Industry Benchmarking</CardTitle>
                <CardDescription>
                  Compare performance against industry standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Yield Efficiency</span>
                      <span>Company: {benchmarkData.yieldEfficiency.company}% | Industry: {benchmarkData.yieldEfficiency.industry}%</span>
                    </div>
                    <Progress
                      value={(benchmarkData.yieldEfficiency.company / 100) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Target: {benchmarkData.yieldEfficiency.target}%
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Cost Per Unit (AED)</span>
                      <span>Company: {benchmarkData.costPerUnit.company} | Industry: {benchmarkData.costPerUnit.industry}</span>
                    </div>
                    <Progress
                      value={((benchmarkData.costPerUnit.industry - benchmarkData.costPerUnit.company) / benchmarkData.costPerUnit.industry) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Target: AED {benchmarkData.costPerUnit.target}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Gross Margin (%)</span>
                      <span>Company: {benchmarkData.grossMargin.company}% | Industry: {benchmarkData.grossMargin.industry}%</span>
                    </div>
                    <Progress
                      value={(benchmarkData.grossMargin.company / benchmarkData.grossMargin.target) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Target: {benchmarkData.grossMargin.target}%
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Wastage Rate (%)</span>
                      <span>Company: {benchmarkData.wastageRate.company}% | Industry: {benchmarkData.wastageRate.industry}%</span>
                    </div>
                    <Progress
                      value={((benchmarkData.wastageRate.industry - benchmarkData.wastageRate.company) / benchmarkData.wastageRate.industry) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Target: {benchmarkData.wastageRate.target}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>
                  Overall performance assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Strong Performance Areas</span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Yield efficiency above industry average</li>
                      <li>• Lower wastage rates than competitors</li>
                      <li>• Strong gross margin performance</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Improvement Opportunities</span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Cost per unit slightly above target</li>
                      <li>• Gross margin gap to target: 1.6%</li>
                      <li>• Production efficiency optimization</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Recommendations</span>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Focus on material cost optimization</li>
                      <li>• Improve labor efficiency</li>
                      <li>• Reduce overhead allocation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization Opportunities</CardTitle>
                <CardDescription>
                  Identify areas for cost reduction and efficiency improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">Material Cost Optimization</div>
                      <Badge className="bg-red-500 text-white">High Impact</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Potential savings: AED 150-200 per batch
                    </div>
                    <ul className="text-xs space-y-1">
                      <li>• Negotiate better supplier rates</li>
                      <li>• Bulk purchasing agreements</li>
                      <li>• Alternative material sourcing</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">Labor Efficiency</div>
                      <Badge className="bg-yellow-500 text-white">Medium Impact</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Potential savings: AED 50-100 per batch
                    </div>
                    <ul className="text-xs space-y-1">
                      <li>• Process optimization training</li>
                      <li>• Automated mixing systems</li>
                      <li>• Better production scheduling</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">Waste Reduction</div>
                      <Badge className="bg-green-500 text-white">Medium Impact</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Potential savings: AED 75-125 per batch
                    </div>
                    <ul className="text-xs space-y-1">
                      <li>• Improved process controls</li>
                      <li>• Better material handling</li>
                      <li>• Equipment maintenance</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">Overhead Allocation</div>
                      <Badge className="bg-blue-500 text-white">Low Impact</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Potential savings: AED 25-50 per batch
                    </div>
                    <ul className="text-xs space-y-1">
                      <li>• Energy efficiency measures</li>
                      <li>• Facility optimization</li>
                      <li>• Utility cost management</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>
                  Return on investment for optimization initiatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-oud-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-oud-600">AED 425,000</div>
                    <div className="text-sm text-muted-foreground">Annual Savings Potential</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Material Optimization</div>
                        <div className="text-sm text-muted-foreground">Annual potential</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">AED 210,000</div>
                        <div className="text-sm text-muted-foreground">Investment: AED 50,000</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Process Efficiency</div>
                        <div className="text-sm text-muted-foreground">Annual potential</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">AED 135,000</div>
                        <div className="text-sm text-muted-foreground">Investment: AED 80,000</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Waste Reduction</div>
                        <div className="text-sm text-muted-foreground">Annual potential</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">AED 80,000</div>
                        <div className="text-sm text-muted-foreground">Investment: AED 25,000</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <div className="text-lg font-semibold">Total ROI: 273%</div>
                    <div className="text-sm text-muted-foreground">Payback period: 4.4 months</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detailed Report Dialog */}
      <Dialog open={isViewReportDialogOpen} onOpenChange={setIsViewReportDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-oud-600" />
                  Yield Analysis Report {selectedReport.id}
                </DialogTitle>
                <DialogDescription>
                  {selectedReport.batchId} • {selectedReport.product} • {selectedReport.reportDate}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 sm:space-y-6">
                {/* Summary Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{selectedReport.yieldEfficiency}%</div>
                    <div className="text-sm text-muted-foreground">Yield Efficiency</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      AED {selectedReport.costPerUnit.actual.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Cost per Unit</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                      {selectedReport.grossMarginPercentage.actual.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Gross Margin</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-red-600">{selectedReport.wastagePercentage}%</div>
                    <div className="text-sm text-muted-foreground">Wastage Rate</div>
                  </div>
                </div>

                <Separator />

                {/* Cost Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Material Costs</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedReport.materialCosts).map(([material, costs]) => (
                          <div key={material} className="flex justify-between items-center p-2 border rounded">
                            <span className="capitalize">{material.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="text-right">
                              <div className="font-medium">AED {costs.actual}</div>
                              <div className={`text-xs ${getVarianceColor(costs.variance)}`}>
                                {costs.variance > 0 ? '+' : ''}{costs.variance}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Cost Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span>Total Materials</span>
                          <div className="text-right">
                            <div className="font-medium">AED {selectedReport.totalMaterialCost.actual}</div>
                            <div className={`text-xs ${getVarianceColor(selectedReport.totalMaterialCost.variance)}`}>
                              {selectedReport.totalMaterialCost.variance > 0 ? '+' : ''}{selectedReport.totalMaterialCost.variance}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span>Labor Costs</span>
                          <div className="text-right">
                            <div className="font-medium">AED {selectedReport.laborCosts.actual}</div>
                            <div className={`text-xs ${getVarianceColor(selectedReport.laborCosts.variance)}`}>
                              {selectedReport.laborCosts.variance > 0 ? '+' : ''}{selectedReport.laborCosts.variance}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span>Overhead</span>
                          <div className="text-right">
                            <div className="font-medium">AED {selectedReport.overheadCosts.actual}</div>
                            <div className={`text-xs ${getVarianceColor(selectedReport.overheadCosts.variance)}`}>
                              {selectedReport.overheadCosts.variance > 0 ? '+' : ''}{selectedReport.overheadCosts.variance}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Performance Summary */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Target Yield:</span>
                        <span className="font-medium">{selectedReport.targetYield} {selectedReport.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actual Yield:</span>
                        <span className="font-medium">{selectedReport.actualYield} {selectedReport.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Selling Price:</span>
                        <span className="font-medium">AED {selectedReport.sellingPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency Rating:</span>
                        {getEfficiencyBadge(selectedReport.efficiencyRating)}
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Grade:</span>
                        <Badge variant="outline">{selectedReport.qualityGrade}</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Trend Indicators</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Yield Trend:</span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(selectedReport.trends.yieldTrend)}
                          <span className="capitalize">{selectedReport.trends.yieldTrend}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Cost Trend:</span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(selectedReport.trends.costTrend)}
                          <span className="capitalize">{selectedReport.trends.costTrend}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Margin Trend:</span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(selectedReport.trends.marginTrend)}
                          <span className="capitalize">{selectedReport.trends.marginTrend}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Full Report
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button className="bg-oud-600 hover:bg-oud-700">
                    <Calculator className="h-4 w-4 mr-2" />
                    Create Optimization Plan
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}