'use client';

import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  DollarSign,
  Package,
  Droplet,
  Clock,
  Building,
  FileSpreadsheet,
  FileImage,
  Activity,
  BarChart3,
  PieChart,
  XCircle,
  AlertCircle,
  Target,
  Percent,
  Thermometer,
  Beaker
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

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function WastageReportsPage() {
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to?: Date | undefined}>({
    from: undefined,
    to: undefined,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for wastage analytics
  const wastageOverview = {
    totalWastageValue: 125000.00,
    totalWastageUnits: 847,
    averageWastageRate: 4.2,
    targetWastageRate: 2.5,
    costImpact: 185000.00,
    preventableWastage: 35000.00,
    criticalIncidents: 12,
    improvementPotential: 28.5
  };

  const wastageByCategory = [
    {
      category: 'Oud',
      totalValue: 45000,
      units: 125,
      wastageRate: 3.8,
      targetRate: 2.0,
      trend: 'up',
      growth: 12.3,
      causes: ['Evaporation', 'Spillage', 'Quality Issues'],
      preventable: 15000,
      status: 'concern'
    },
    {
      category: 'Amber',
      totalValue: 28000,
      units: 180,
      wastageRate: 4.2,
      targetRate: 2.5,
      trend: 'down',
      growth: -8.7,
      causes: ['Temperature', 'Handling', 'Storage'],
      preventable: 8500,
      status: 'improving'
    },
    {
      category: 'Rose',
      totalValue: 22000,
      units: 245,
      wastageRate: 5.1,
      targetRate: 3.0,
      trend: 'up',
      growth: 18.2,
      causes: ['Oxidation', 'Light Exposure', 'Contamination'],
      preventable: 7200,
      status: 'critical'
    },
    {
      category: 'Sandalwood',
      totalValue: 18500,
      units: 198,
      wastageRate: 3.2,
      targetRate: 2.0,
      trend: 'down',
      growth: -5.4,
      causes: ['Aging', 'Storage', 'Handling'],
      preventable: 3800,
      status: 'good'
    },
    {
      category: 'Musk',
      totalValue: 11500,
      units: 99,
      wastageRate: 2.8,
      targetRate: 2.0,
      trend: 'stable',
      growth: 1.2,
      causes: ['Natural Loss', 'Processing'],
      preventable: 500,
      status: 'good'
    }
  ];

  const wasteageByCause = [
    {
      cause: 'Evaporation',
      value: 35000,
      percentage: 28.0,
      preventability: 'medium',
      solutions: ['Better sealing', 'Climate control', 'Storage optimization'],
      trend: 'up'
    },
    {
      cause: 'Quality Issues',
      value: 28000,
      percentage: 22.4,
      preventability: 'high',
      solutions: ['Supplier audits', 'Incoming QC', 'Batch testing'],
      trend: 'down'
    },
    {
      cause: 'Spillage',
      value: 22000,
      percentage: 17.6,
      preventability: 'high',
      solutions: ['Staff training', 'Better equipment', 'Procedures'],
      trend: 'stable'
    },
    {
      cause: 'Expiration',
      value: 18000,
      percentage: 14.4,
      preventability: 'medium',
      solutions: ['FIFO management', 'Demand forecasting', 'Inventory rotation'],
      trend: 'down'
    },
    {
      cause: 'Contamination',
      value: 15000,
      percentage: 12.0,
      preventability: 'high',
      solutions: ['Hygiene protocols', 'Separate storage', 'Clean procedures'],
      trend: 'up'
    },
    {
      cause: 'Damage',
      value: 7000,
      percentage: 5.6,
      preventability: 'medium',
      solutions: ['Better packaging', 'Careful handling', 'Storage design'],
      trend: 'stable'
    }
  ];

  const locationWastage = [
    {
      location: 'Production Facility',
      totalValue: 58000,
      units: 385,
      wastageRate: 6.2,
      targetRate: 4.0,
      efficiency: 72,
      incidents: 8,
      mainCause: 'Production Loss'
    },
    {
      location: 'Dubai Mall',
      totalValue: 25000,
      units: 168,
      wastageRate: 3.5,
      targetRate: 2.0,
      efficiency: 85,
      incidents: 2,
      mainCause: 'Customer Handling'
    },
    {
      location: 'Warehouse',
      totalValue: 22000,
      units: 147,
      wastageRate: 2.8,
      targetRate: 2.0,
      efficiency: 89,
      incidents: 1,
      mainCause: 'Storage Conditions'
    },
    {
      location: 'Mall of Emirates',
      totalValue: 15000,
      units: 98,
      wastageRate: 3.2,
      targetRate: 2.0,
      efficiency: 82,
      incidents: 1,
      mainCause: 'Display Issues'
    },
    {
      location: 'City Walk',
      totalValue: 5000,
      units: 49,
      wastageRate: 2.1,
      targetRate: 2.0,
      efficiency: 95,
      incidents: 0,
      mainCause: 'Minimal Issues'
    }
  ];

  const recentIncidents = [
    {
      id: 'WAS-2024-0087',
      date: '2024-10-01T09:30:00',
      location: 'Production Facility',
      product: 'Royal Oud Premium 50ml',
      cause: 'Equipment Malfunction',
      quantity: 25,
      value: 11250.00,
      severity: 'high',
      status: 'investigating',
      preventable: true,
      reportedBy: 'Production Manager'
    },
    {
      id: 'WAS-2024-0086',
      date: '2024-09-30T16:45:00',
      location: 'Dubai Mall',
      product: 'Amber Essence Deluxe 30ml',
      cause: 'Customer Spillage',
      quantity: 8,
      value: 1440.00,
      severity: 'low',
      status: 'closed',
      preventable: false,
      reportedBy: 'Store Manager'
    },
    {
      id: 'WAS-2024-0085',
      date: '2024-09-29T11:20:00',
      location: 'Warehouse',
      product: 'Rose Garden Collection Set',
      cause: 'Storage Temperature',
      quantity: 15,
      value: 4800.00,
      severity: 'medium',
      status: 'resolved',
      preventable: true,
      reportedBy: 'Warehouse Supervisor'
    },
    {
      id: 'WAS-2024-0084',
      date: '2024-09-28T14:15:00',
      location: 'Production Facility',
      product: 'Sandalwood Serenity 25ml',
      cause: 'Quality Control Rejection',
      quantity: 42,
      value: 3990.00,
      severity: 'medium',
      status: 'closed',
      preventable: true,
      reportedBy: 'QC Inspector'
    }
  ];

  const costAnalysis = useMemo(() => {
    const totalCost = wastageOverview.totalWastageValue + wastageOverview.costImpact;
    const preventableAmount = wastageOverview.preventableWastage;
    const savingsPotential = (preventableAmount / totalCost) * 100;

    return {
      totalCost,
      directCost: wastageOverview.totalWastageValue,
      indirectCost: wastageOverview.costImpact,
      preventableAmount,
      savingsPotential,
      monthlyImpact: totalCost / 12
    };
  }, [wastageOverview]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'concern': return 'text-orange-600 bg-orange-50';
      case 'improving': return 'text-blue-600 bg-blue-50';
      case 'good': return 'text-green-600 bg-green-50';
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Clock className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`Exporting wastage report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-oud-600" />
            Wastage & Shrinkage Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive analysis of inventory wastage, shrinkage, and loss prevention
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
              <SelectItem value="production">Production Facility</SelectItem>
              <SelectItem value="dubai-mall">Dubai Mall</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="mall-emirates">Mall of Emirates</SelectItem>
              <SelectItem value="city-walk">City Walk</SelectItem>
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

      {/* Key Wastage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wastage Value</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(wastageOverview.totalWastageValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {wastageOverview.totalWastageUnits.toLocaleString()} units lost
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Rate: {wastageOverview.averageWastageRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(wastageOverview.costImpact)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total financial impact
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {((wastageOverview.costImpact / (wastageOverview.totalWastageValue + wastageOverview.costImpact)) * 100).toFixed(1)}% indirect costs
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preventable Wastage</CardTitle>
            <Target className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(wastageOverview.preventableWastage)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((wastageOverview.preventableWastage / wastageOverview.totalWastageValue) * 100).toFixed(1)}% of total wastage
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Improvement potential: {wastageOverview.improvementPotential}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{wastageOverview.criticalIncidents}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate action
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Target: <2 per month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance vs Target */}
      <Card>
        <CardHeader>
          <CardTitle>Wastage Rate vs Target</CardTitle>
          <CardDescription>
            Current performance compared to target wastage rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Overall Wastage Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Target: {wastageOverview.targetWastageRate}%</span>
                <span className="font-bold text-red-600">{wastageOverview.averageWastageRate}%</span>
              </div>
            </div>
            <Progress value={(wastageOverview.averageWastageRate / 10) * 100} className="w-full h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>Target: {wastageOverview.targetWastageRate}%</span>
              <span>10%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Wastage Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="causes">Root Causes</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Wastage Distribution</CardTitle>
                <CardDescription>
                  Breakdown of wastage by value and impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Wastage distribution chart</p>
                    <p className="text-sm text-muted-foreground">(Interactive chart will be displayed here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wastage Trends</CardTitle>
                <CardDescription>
                  Monthly wastage trends and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Wastage trends chart</p>
                    <p className="text-sm text-muted-foreground">(Interactive trend analysis will be displayed here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Wastage Alert:</strong> Current wastage rate of {wastageOverview.averageWastageRate}% exceeds target of {wastageOverview.targetWastageRate}%.
              {formatCurrency(wastageOverview.preventableWastage)} in preventable losses identified.
              Focus on Rose category (5.1% rate) and production facility improvements.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wastage by Product Category</CardTitle>
              <CardDescription>
                Detailed analysis of wastage across different product categories
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
                      <TableHead>Wastage Rate</TableHead>
                      <TableHead>Target Rate</TableHead>
                      <TableHead>Preventable</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wastageByCategory.map((category) => (
                      <TableRow key={category.category}>
                        <TableCell className="font-medium">{category.category}</TableCell>
                        <TableCell className="font-bold text-red-600">{formatCurrency(category.totalValue)}</TableCell>
                        <TableCell>{category.units}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{category.wastageRate}%</span>
                            <Progress value={(category.wastageRate / 10) * 100} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>{category.targetRate}%</TableCell>
                        <TableCell className="font-bold text-yellow-600">{formatCurrency(category.preventable)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(category.status)}>
                            {category.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {category.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-red-600" />
                            ) : category.trend === 'down' ? (
                              <TrendingDown className="h-4 w-4 text-green-600" />
                            ) : (
                              <Activity className="h-4 w-4 text-gray-600" />
                            )}
                            <Badge variant={category.growth >= 0 ? "destructive" : "default"}>
                              {formatPercentage(category.growth)}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wastageByCategory.map((category) => (
              <Card key={category.category} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">{category.category}</h3>
                  <Badge className={getStatusColor(category.status)}>
                    {category.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Wastage Value</span>
                    <span className="font-bold text-red-600">{formatCurrency(category.totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rate vs Target</span>
                    <span className="font-medium">{category.wastageRate}% / {category.targetRate}%</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Main Causes</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {category.causes.slice(0, 2).map((cause, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cause}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="causes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Root Cause Analysis</CardTitle>
              <CardDescription>
                Identification and analysis of wastage root causes with prevention strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wasteageByCause.map((cause, index) => (
                  <Card key={cause.cause} className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-oud-100 rounded-full flex items-center justify-center text-sm font-medium text-oud-600">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{cause.cause}</h3>
                          <p className="text-sm text-muted-foreground">{cause.percentage}% of total wastage</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">{formatCurrency(cause.value)}</div>
                        <Badge className={getStatusColor(cause.preventability)}>
                          {cause.preventability} preventability
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Progress value={cause.percentage} className="w-full" />

                      <div>
                        <h4 className="font-medium text-sm mb-2">Prevention Solutions:</h4>
                        <div className="flex flex-wrap gap-1">
                          {cause.solutions.map((solution, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {solution}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Trend:</span>
                        <div className="flex items-center gap-1">
                          {cause.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-red-600" />
                          ) : cause.trend === 'down' ? (
                            <TrendingDown className="h-4 w-4 text-green-600" />
                          ) : (
                            <Activity className="h-4 w-4 text-gray-600" />
                          )}
                          <span className="font-medium">{cause.trend}</span>
                        </div>
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
              <CardTitle>Wastage by Location</CardTitle>
              <CardDescription>
                Location-specific wastage analysis and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Wastage Rate</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Incidents</TableHead>
                      <TableHead>Main Cause</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locationWastage.map((location) => (
                      <TableRow key={location.location}>
                        <TableCell className="font-medium">{location.location}</TableCell>
                        <TableCell className="font-bold text-red-600">{formatCurrency(location.totalValue)}</TableCell>
                        <TableCell>{location.units}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{location.wastageRate}%</span>
                            <Badge variant={location.wastageRate <= location.targetRate ? "default" : "destructive"}>
                              Target: {location.targetRate}%
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={location.efficiency} className="w-16 h-2" />
                            <span className="text-sm font-medium">{location.efficiency}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={location.incidents === 0 ? "default" : location.incidents <= 2 ? "secondary" : "destructive"}>
                            {location.incidents}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{location.mainCause}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Wastage Incidents</CardTitle>
              <CardDescription>
                Detailed tracking of recent wastage incidents and investigations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <Card key={incident.id} className="p-4 border-l-4 border-l-red-500">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(incident.severity)}
                        <div>
                          <h3 className="font-semibold">{incident.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(incident.date)} • {incident.location}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(incident.severity)}>
                        {incident.severity} severity
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Product</span>
                        <div className="font-medium">{incident.product}</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Cause</span>
                        <div className="font-medium">{incident.cause}</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Quantity Lost</span>
                        <div className="font-bold text-red-600">{incident.quantity} units</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Value</span>
                        <div className="font-bold text-red-600">{formatCurrency(incident.value)}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant={incident.preventable ? "destructive" : "secondary"}>
                          {incident.preventable ? 'Preventable' : 'Non-preventable'}
                        </Badge>
                        <Badge variant="outline">{incident.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Reported by: {incident.reportedBy}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>
                  Detailed analysis of wastage-related costs and impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-red-50 to-red-100">
                    <div className="text-xl font-bold text-red-600">{formatCurrency(costAnalysis.directCost)}</div>
                    <p className="text-sm text-muted-foreground">Direct Wastage Cost</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                    <div className="text-xl font-bold text-orange-600">{formatCurrency(costAnalysis.indirectCost)}</div>
                    <p className="text-sm text-muted-foreground">Indirect Impact</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Cost Impact</span>
                    <span className="font-bold text-red-600">{formatCurrency(costAnalysis.totalCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preventable Amount</span>
                    <span className="font-bold text-yellow-600">{formatCurrency(costAnalysis.preventableAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Impact</span>
                    <span className="font-bold">{formatCurrency(costAnalysis.monthlyImpact)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Savings Potential</span>
                    <span className="font-bold text-green-600">{costAnalysis.savingsPotential.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Opportunities</CardTitle>
                <CardDescription>
                  Identified opportunities for wastage reduction and cost savings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Process Optimization</span>
                    </div>
                    <span className="font-bold text-green-600">{formatCurrency(15000)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Storage Improvements</span>
                    </div>
                    <span className="font-bold text-blue-600">{formatCurrency(12000)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50">
                    <div className="flex items-center gap-2">
                      <Beaker className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Quality Control</span>
                    </div>
                    <span className="font-bold text-purple-600">{formatCurrency(8000)}</span>
                  </div>
                </div>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quick Win:</strong> Implementing better storage controls could save
                    {formatCurrency(12000)} monthly. Focus on temperature and humidity management
                    in the production facility and warehouse.
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