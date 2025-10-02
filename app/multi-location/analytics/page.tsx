'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Activity,
  Building2,
  Award,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('revenue');
  const [timeRange, setTimeRange] = useState('month');
  const [compareMode, setCompareMode] = useState('locations');

  const locationPerformance = [
    {
      id: 'LOC-001',
      name: 'Dubai Mall Flagship',
      revenue: 850000,
      target: 800000,
      performance: 106.3,
      growth: 12.5,
      staff: 12,
      inventory: 2450,
      footfall: 15600,
      conversionRate: 8.2,
      avgTransaction: 3450,
      trend: 'up',
    },
    {
      id: 'LOC-002',
      name: 'Mall of Emirates',
      revenue: 620000,
      target: 600000,
      performance: 103.3,
      growth: 8.1,
      staff: 8,
      inventory: 1890,
      footfall: 12400,
      conversionRate: 7.8,
      avgTransaction: 3200,
      trend: 'up',
    },
    {
      id: 'LOC-003',
      name: 'Ibn Battuta Mall',
      revenue: 380000,
      target: 400000,
      performance: 95.0,
      growth: -2.3,
      staff: 6,
      inventory: 1250,
      footfall: 8900,
      conversionRate: 6.5,
      avgTransaction: 2850,
      trend: 'down',
    },
    {
      id: 'LOC-004',
      name: 'City Centre Mirdif',
      revenue: 290000,
      target: 320000,
      performance: 90.6,
      growth: -4.2,
      staff: 5,
      inventory: 980,
      footfall: 7200,
      conversionRate: 6.1,
      avgTransaction: 2650,
      trend: 'down',
    },
    {
      id: 'LOC-005',
      name: 'Abu Dhabi Mall',
      revenue: 520000,
      target: 500000,
      performance: 104.0,
      growth: 10.3,
      staff: 7,
      inventory: 1650,
      footfall: 11800,
      conversionRate: 7.5,
      avgTransaction: 3100,
      trend: 'up',
    },
  ];

  const topPerformers = [...locationPerformance]
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 3);

  const bottomPerformers = [...locationPerformance]
    .sort((a, b) => a.performance - b.performance)
    .slice(0, 3);

  const totalRevenue = locationPerformance.reduce((sum, loc) => sum + loc.revenue, 0);
  const totalTarget = locationPerformance.reduce((sum, loc) => sum + loc.target, 0);
  const avgPerformance = (totalRevenue / totalTarget) * 100;
  const avgGrowth = locationPerformance.reduce((sum, loc) => sum + loc.growth, 0) / locationPerformance.length;

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 100) return 'text-green-600';
    if (performance >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            Performance Analytics
          </h1>
          <p className="text-muted-foreground">Compare and analyze location performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">AED {(totalRevenue / 1000000).toFixed(2)}M</div>
            <p className={`text-xs flex items-center gap-1 ${getTrendColor(avgGrowth)}`}>
              {avgGrowth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(avgGrowth).toFixed(1)}% vs last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold ${getPerformanceColor(avgPerformance)}`}>
              {avgPerformance.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Of target achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Top Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{topPerformers[0]?.name}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Award className="h-3 w-3" />
              {topPerformers[0]?.performance}% of target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{bottomPerformers[0]?.name}</div>
            <p className="text-xs text-red-600 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              {bottomPerformers[0]?.performance}% of target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Comparison</CardTitle>
          <CardDescription>Compare revenue performance across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Interactive Revenue Chart</p>
              <p className="text-sm text-gray-500">Showing revenue trends and comparisons</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Performance Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Performance by Location</CardTitle>
              <CardDescription>Detailed revenue metrics and target achievement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {locationPerformance.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Building2 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{location.name}</h3>
                          <p className="text-sm text-gray-500">{location.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl sm:text-2xl font-bold ${getPerformanceColor(location.performance)}`}>
                          {location.performance}%
                        </div>
                        <div className={`text-sm flex items-center gap-1 justify-end ${getTrendColor(location.growth)}`}>
                          {getTrendIcon(location.trend)}
                          {Math.abs(location.growth)}% growth
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Revenue vs Target</span>
                          <span className="font-semibold">
                            AED {(location.revenue / 1000).toFixed(0)}K / {(location.target / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <Progress value={location.performance} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{location.footfall?.toLocaleString() || "0"}</div>
                          <div className="text-xs text-gray-500">Footfall</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{location.conversionRate}%</div>
                          <div className="text-xs text-gray-500">Conversion</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">AED {location.avgTransaction}</div>
                          <div className="text-xs text-gray-500">Avg Transaction</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Efficiency Tab */}
        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Efficiency</CardTitle>
              <CardDescription>Staff productivity and conversion metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationPerformance.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">{location.name}</div>
                      <Badge variant="outline">{location.id}</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{location.staff}</div>
                        <div className="text-xs text-gray-500">Staff Count</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          AED {((location.revenue / location.staff) / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-500">Revenue/Staff</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{location.conversionRate}%</div>
                        <div className="text-xs text-gray-500">Conversion Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {(location.footfall / 30).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">Daily Footfall</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Performance</CardTitle>
              <CardDescription>Stock levels and turnover rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationPerformance.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">{location.name}</div>
                      <Badge variant="outline">{location.id}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{location.inventory}</div>
                        <div className="text-xs text-gray-500">Total Items</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          AED {((location.revenue / location.inventory)).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">Revenue/Item</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {((location.inventory / location.revenue) * 100000).toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">Stock/Revenue Ratio</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>Productivity and efficiency metrics per staff member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationPerformance.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">{location.name}</div>
                      <Badge variant="outline">{location.staff} Staff</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          AED {((location.revenue / location.staff) / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-500">Avg Revenue/Staff</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {(location.footfall / location.staff).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">Customers/Staff</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {(location.inventory / location.staff).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">Items/Staff</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top and Bottom Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Top Performers
            </CardTitle>
            <CardDescription>Best performing locations this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((location, index) => (
                <div key={location.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{location.name}</div>
                      <div className="text-sm text-gray-600">AED {(location.revenue / 1000).toFixed(0)}K</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{location.performance}%</div>
                    <div className="text-xs text-gray-600">of target</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Needs Attention
            </CardTitle>
            <CardDescription>Locations requiring improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bottomPerformers.map((location, index) => (
                <div key={location.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{location.name}</div>
                      <div className="text-sm text-gray-600">AED {(location.revenue / 1000).toFixed(0)}K</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">{location.performance}%</div>
                    <div className="text-xs text-gray-600">of target</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
