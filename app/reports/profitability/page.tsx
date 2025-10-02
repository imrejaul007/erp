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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Printer,
  Filter,
  Percent,
  Target,
  Award
} from 'lucide-react';

export default function ProfitabilityReportPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('month');

  const profitSummary = {
    totalRevenue: 856400,
    totalCosts: 487200,
    grossProfit: 369200,
    grossMargin: 43.1,
    netProfit: 284600,
    netMargin: 33.2,
    trend: +15.8,
  };

  const categoryProfitability = [
    { category: 'Oud Oil', revenue: 425000, cost: 210000, profit: 215000, margin: 50.6 },
    { category: 'Attar', revenue: 265000, cost: 145000, profit: 120000, margin: 45.3 },
    { category: 'Oud Chips', revenue: 125000, cost: 95000, profit: 30000, margin: 24.0 },
    { category: 'Accessories', revenue: 41400, cost: 37200, profit: 4200, margin: 10.1 },
  ];

  const locationProfitability = [
    { location: 'Dubai Mall Flagship', revenue: 425000, profit: 142500, margin: 33.5 },
    { location: 'Mall of Emirates', revenue: 265000, profit: 89250, margin: 33.7 },
    { location: 'Ibn Battuta Mall', revenue: 125000, profit: 38750, margin: 31.0 },
    { location: 'City Centre Mirdif', revenue: 41400, profit: 13850, margin: 33.5 },
  ];

  const topProducts = [
    { name: 'Royal Oud Premium', sold: 145, revenue: 123250, profit: 67788, margin: 55.0 },
    { name: 'Rose Attar Deluxe', sold: 98, revenue: 88200, profit: 44100, margin: 50.0 },
    { name: 'Oud Chips - Cambodian', sold: 234, revenue: 65500, profit: 19650, margin: 30.0 },
    { name: 'Amber Musk Perfume', sold: 176, revenue: 52800, profit: 23760, margin: 45.0 },
    { name: 'Sandalwood Incense', sold: 312, revenue: 31200, profit: 9360, margin: 30.0 },
  ];

  const getMarginColor = (margin: number) => {
    if (margin >= 40) return 'text-green-600';
    if (margin >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-green-600" />
            Profitability Analysis
          </h1>
          <p className="text-muted-foreground">Detailed profit margins and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
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
            <div className="text-xl sm:text-2xl font-bold">
              AED {profitSummary.totalRevenue?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-gray-600 mt-1">Current period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Gross Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              AED {profitSummary.grossProfit?.toLocaleString() || "0"}
            </div>
            <p className="text-xs flex items-center gap-1 mt-1">
              <Badge variant="outline">{profitSummary.grossMargin}% margin</Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              AED {profitSummary.netProfit?.toLocaleString() || "0"}
            </div>
            <p className="text-xs flex items-center gap-1 mt-1">
              <Badge variant="outline">{profitSummary.netMargin}% margin</Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              +{profitSummary.trend}%
            </div>
            <p className="text-xs text-gray-600 mt-1">vs last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Profit Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Profit Trend</CardTitle>
          <CardDescription>Revenue, costs, and profit over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Interactive Profit Chart</p>
              <p className="text-sm text-gray-500">Revenue, Cost, and Profit trends visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">By Category</TabsTrigger>
          <TabsTrigger value="locations">By Location</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        {/* Category Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Profitability by Category</CardTitle>
              <CardDescription>Performance analysis across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryProfitability.map((cat) => (
                  <div key={cat.category} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{cat.category}</h3>
                        <p className="text-sm text-gray-600">Revenue: AED {cat.revenue?.toLocaleString() || "0"}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getMarginColor(cat.margin)}`}>
                          {cat.margin}%
                        </div>
                        <div className="text-sm text-gray-600">margin</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Cost</div>
                        <div className="font-semibold">AED {cat.cost?.toLocaleString() || "0"}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Profit</div>
                        <div className="font-semibold text-green-600">AED {cat.profit?.toLocaleString() || "0"}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Contribution</div>
                        <div className="font-semibold">{((cat.profit / profitSummary.grossProfit) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <Progress value={cat.margin} className="h-2 mt-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Profitability by Location</CardTitle>
              <CardDescription>Store-wise profit analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationProfitability.map((loc) => (
                  <div key={loc.location} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{loc.location}</h3>
                        <p className="text-sm text-gray-600">Revenue: AED {loc.revenue?.toLocaleString() || "0"}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getMarginColor(loc.margin)}`}>
                          {loc.margin}%
                        </div>
                        <div className="text-sm text-gray-600">margin</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Profit</div>
                        <div className="font-semibold text-green-600">AED {loc.profit?.toLocaleString() || "0"}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Contribution</div>
                        <div className="font-semibold">{((loc.profit / profitSummary.netProfit) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <Progress value={loc.margin} className="h-2 mt-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Profitable Products</CardTitle>
              <CardDescription>Best performing products by profit margin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.sold} units sold</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        AED {product.profit?.toLocaleString() || "0"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.margin}% margin
                      </div>
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
