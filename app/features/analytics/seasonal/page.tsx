'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Gift,
  Star,
  Sun,
  Cloud,
  Snowflake,
  Sparkles,
  Target,
  DollarSign
} from 'lucide-react';

export default function SeasonalAnalysisPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const seasonalEvents = [
    {
      event: 'Ramadan',
      period: 'Feb 28 - Mar 29, 2025',
      avgSalesIncrease: 145,
      revenue2024: 2850000,
      forecast2025: 3285000,
      growth: 15.3,
      topProducts: ['Gift Sets', 'Premium Oud', 'Incense', 'Dates & Oud Combo'],
      prepWeeks: 6,
      peakDays: ['First 3 days', 'Last 10 days'],
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      event: 'Eid Al-Fitr',
      period: 'Mar 30 - Apr 1, 2025',
      avgSalesIncrease: 120,
      revenue2024: 1850000,
      forecast2025: 2072500,
      growth: 12.0,
      topProducts: ['Premium Perfumes', 'Gift Sets', 'Luxury Packaging'],
      prepWeeks: 4,
      peakDays: ['Day before Eid', 'Eid day 1'],
      icon: Gift,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      event: 'Summer Season',
      period: 'Jun 1 - Aug 31, 2025',
      avgSalesIncrease: -25,
      revenue2024: 1450000,
      forecast2025: 1305000,
      growth: -10.0,
      topProducts: ['Light Fragrances', 'Travel Sizes', 'Rose Water'],
      prepWeeks: 2,
      peakDays: ['Weekends only'],
      icon: Sun,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      event: 'Eid Al-Adha',
      period: 'Jun 6-8, 2025',
      avgSalesIncrease: 85,
      revenue2024: 1250000,
      forecast2025: 1400000,
      growth: 12.0,
      topProducts: ['Traditional Oud', 'Gift Sets', 'Incense'],
      prepWeeks: 3,
      peakDays: ['Week before', 'Eid days'],
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      event: 'UAE National Day',
      period: 'Dec 2-3, 2024',
      avgSalesIncrease: 65,
      revenue2024: 920000,
      forecast2025: 1000000,
      growth: 8.7,
      topProducts: ['Patriotic Packaging', 'Premium Oud', 'Gift Sets'],
      prepWeeks: 3,
      peakDays: ['National Day', 'Day before'],
      icon: Star,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      event: 'New Year',
      period: 'Dec 31 - Jan 2, 2025',
      avgSalesIncrease: 55,
      revenue2024: 780000,
      forecast2025: 850000,
      growth: 9.0,
      topProducts: ['Celebration Gift Sets', 'Premium Perfumes', 'Party Accessories'],
      prepWeeks: 2,
      peakDays: ['Dec 30-31'],
      icon: Sparkles,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const monthlyPatterns = [
    { month: 'January', avgSales: 285000, trend: 'stable', index: 95, seasonality: 'Low', bestDays: 'Weekends' },
    { month: 'February', avgSales: 320000, trend: 'up', index: 107, seasonality: 'Pre-Ramadan', bestDays: 'All week' },
    { month: 'March', avgSales: 485000, trend: 'up', index: 162, seasonality: 'Ramadan Peak', bestDays: 'Evenings' },
    { month: 'April', avgSales: 375000, trend: 'down', index: 125, seasonality: 'Post-Eid', bestDays: 'Weekends' },
    { month: 'May', avgSales: 295000, trend: 'down', index: 98, seasonality: 'Low', bestDays: 'Weekends' },
    { month: 'June', avgSales: 250000, trend: 'down', index: 83, seasonality: 'Summer Low', bestDays: 'Malls only' },
    { month: 'July', avgSales: 235000, trend: 'stable', index: 78, seasonality: 'Summer Low', bestDays: 'Malls only' },
    { month: 'August', avgSales: 245000, trend: 'stable', index: 82, seasonality: 'Summer Low', bestDays: 'Malls only' },
    { month: 'September', avgSales: 295000, trend: 'up', index: 98, seasonality: 'Recovery', bestDays: 'All week' },
    { month: 'October', avgSales: 325000, trend: 'up', index: 108, seasonality: 'Growing', bestDays: 'All week' },
    { month: 'November', avgSales: 345000, trend: 'up', index: 115, seasonality: 'High', bestDays: 'All week' },
    { month: 'December', avgSales: 385000, trend: 'up', index: 128, seasonality: 'Year End Peak', bestDays: 'All week' }
  ];

  const weekdayPatterns = [
    { day: 'Sunday', avgSales: 45000, traffic: 850, conversion: 4.2, peak: 'Low' },
    { day: 'Monday', avgSales: 42000, traffic: 780, conversion: 4.1, peak: 'Low' },
    { day: 'Tuesday', avgSales: 48000, traffic: 920, conversion: 4.3, peak: 'Medium' },
    { day: 'Wednesday', avgSales: 52000, traffic: 1020, conversion: 4.5, peak: 'Medium' },
    { day: 'Thursday', avgSales: 68000, traffic: 1350, conversion: 4.8, peak: 'High' },
    { day: 'Friday', avgSales: 95000, traffic: 1850, conversion: 5.2, peak: 'Peak' },
    { day: 'Saturday', avgSales: 85000, traffic: 1680, conversion: 5.0, peak: 'High' }
  ];

  const opportunityWindows = [
    {
      window: 'Ramadan Prep Period',
      startDate: 'Jan 15, 2025',
      endDate: 'Feb 27, 2025',
      daysLeft: 106,
      opportunity: 'AED 450K',
      priority: 'critical',
      actions: ['Stock premium products', 'Launch pre-Ramadan campaign', 'Train staff', 'Prepare gift packaging']
    },
    {
      window: 'Wedding Season',
      startDate: 'Oct 1, 2024',
      endDate: 'Dec 15, 2024',
      daysLeft: 0,
      opportunity: 'AED 280K',
      priority: 'high',
      actions: ['Create wedding gift packages', 'Corporate bulk deals', 'Luxury packaging options']
    },
    {
      window: 'Back to Normal (Post-Summer)',
      startDate: 'Sep 1, 2024',
      endDate: 'Sep 30, 2024',
      daysLeft: -31,
      opportunity: 'AED 180K',
      priority: 'medium',
      actions: ['Welcome back promotions', 'Refresh product displays', 'Re-engage dormant customers']
    }
  ];

  const productSeasonality = [
    { category: 'Gift Sets', peakSeason: 'Ramadan/Eid', peakMultiplier: 3.5, offSeason: 'Summer', minStock: 200, maxStock: 850 },
    { category: 'Premium Oud', peakSeason: 'Religious Events', peakMultiplier: 2.8, offSeason: 'Summer', minStock: 100, maxStock: 450 },
    { category: 'Light Fragrances', peakSeason: 'Summer', peakMultiplier: 1.8, offSeason: 'Winter', minStock: 80, maxStock: 180 },
    { category: 'Incense', peakSeason: 'Ramadan', peakMultiplier: 4.2, offSeason: 'Summer', minStock: 300, maxStock: 1500 },
    { category: 'Accessories', peakSeason: 'Year Round', peakMultiplier: 1.2, offSeason: 'None', minStock: 150, maxStock: 200 }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-indigo-600" />
            Seasonal Analysis
          </h1>
          <p className="text-muted-foreground">
            Identify seasonal patterns and optimize for peak opportunities
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Star className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-purple-600">Ramadan</div>
            <div className="text-sm text-gray-600">Next Peak Event</div>
            <div className="text-xs text-gray-500 mt-1">120 days away</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">+145%</div>
            <div className="text-sm text-gray-600">Peak Increase</div>
            <div className="text-xs text-gray-500 mt-1">During Ramadan</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">AED 3.3M</div>
            <div className="text-sm text-gray-600">Ramadan Forecast</div>
            <div className="text-xs text-gray-500 mt-1">+15.3% vs 2024</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Target className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-2xl font-bold text-amber-600">6</div>
            <div className="text-sm text-gray-600">Seasonal Events</div>
            <div className="text-xs text-gray-500 mt-1">This year</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Seasonal Events</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Patterns</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Patterns</TabsTrigger>
          <TabsTrigger value="products">Product Seasonality</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Revenue Distribution</CardTitle>
                <CardDescription>Revenue breakdown by season</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Religious Events (40%)</span>
                      <span className="font-bold text-purple-600">AED 5.9M</span>
                    </div>
                    <Progress value={40} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Regular Season (35%)</span>
                      <span className="font-bold text-blue-600">AED 5.2M</span>
                    </div>
                    <Progress value={35} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">National Events (15%)</span>
                      <span className="font-bold text-green-600">AED 2.2M</span>
                    </div>
                    <Progress value={15} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Summer (10%)</span>
                      <span className="font-bold text-amber-600">AED 1.5M</span>
                    </div>
                    <Progress value={10} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Year-Round Performance</CardTitle>
                <CardDescription>Highs and lows throughout the year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div className="font-semibold text-green-900">Peak Months</div>
                    </div>
                    <div className="text-sm text-green-700">
                      March (Ramadan), December (Year End), November
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Average 120%+ of baseline sales
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="h-5 w-5 text-amber-600" />
                      <div className="font-semibold text-amber-900">Low Months</div>
                    </div>
                    <div className="text-sm text-amber-700">
                      June, July, August (Summer season)
                    </div>
                    <div className="text-xs text-amber-600 mt-1">
                      Average 75% of baseline sales
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <div className="font-semibold text-blue-900">Growth Opportunities</div>
                    </div>
                    <div className="text-sm text-blue-700">
                      September-October recovery period
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Potential for +20% with right campaigns
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <div className="space-y-4">
            {seasonalEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-lg ${event.bgColor}`}>
                        <Icon className={`h-6 w-6 ${event.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-xl">{event.event}</div>
                            <div className="text-sm text-gray-600">{event.period}</div>
                          </div>
                          <Badge className={
                            event.growth > 10 ? 'bg-green-100 text-green-800' :
                            event.growth > 0 ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {event.growth > 0 ? '+' : ''}{event.growth}% Growth
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-600">2024 Revenue</div>
                            <div className="font-bold">AED {(event.revenue2024 / 1000000).toFixed(2)}M</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">2025 Forecast</div>
                            <div className="font-bold text-green-600">AED {(event.forecast2025 / 1000000).toFixed(2)}M</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Sales Increase</div>
                            <div className="font-bold text-purple-600">+{event.avgSalesIncrease}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Prep Time</div>
                            <div className="font-bold text-blue-600">{event.prepWeeks} weeks</div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">Top Products:</div>
                          <div className="flex flex-wrap gap-2">
                            {event.topProducts.map((product, idx) => (
                              <Badge key={idx} variant="outline">{product}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <div className="text-sm">
                            <span className="font-medium">Peak Days: </span>
                            {event.peakDays.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Monthly Tab */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Patterns</CardTitle>
              <CardDescription>Average performance by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyPatterns.map((month, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{month.month}</div>
                        <div className="text-sm text-gray-600">{month.seasonality}</div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline">Index: {month.index}</Badge>
                        {month.trend === 'up' && <TrendingUp className="h-5 w-5 text-green-600" />}
                        {month.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-600" />}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Avg Sales</div>
                        <div className="font-bold text-green-600">AED {(month.avgSales / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Best Days</div>
                        <div className="font-semibold">{month.bestDays}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Trend</div>
                        <div className={`font-semibold capitalize ${
                          month.trend === 'up' ? 'text-green-600' :
                          month.trend === 'down' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {month.trend}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly Tab */}
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sales Patterns</CardTitle>
              <CardDescription>Performance by day of week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekdayPatterns.map((day, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    day.peak === 'Peak' ? 'bg-green-50 border-green-200' :
                    day.peak === 'High' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-lg">{day.day}</div>
                      <Badge className={
                        day.peak === 'Peak' ? 'bg-green-600' :
                        day.peak === 'High' ? 'bg-blue-600' :
                        day.peak === 'Medium' ? 'bg-amber-600' :
                        'bg-gray-600'
                      }>
                        {day.peak}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Avg Sales</div>
                        <div className="font-bold text-green-600">AED {(day.avgSales / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Traffic</div>
                        <div className="font-semibold">{day.traffic} visitors</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Conversion</div>
                        <div className="font-semibold text-purple-600">{day.conversion}%</div>
                      </div>
                    </div>
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
              <CardTitle>Product Category Seasonality</CardTitle>
              <CardDescription>Peak and off-season patterns by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productSeasonality.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-lg">{product.category}</div>
                      <Badge className="bg-purple-100 text-purple-800">
                        {product.peakMultiplier}x multiplier
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Peak Season</div>
                        <div className="font-semibold text-green-600">{product.peakSeason}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Off Season</div>
                        <div className="font-semibold text-red-600">{product.offSeason}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Min Stock</div>
                        <div className="font-semibold">{product.minStock} units</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Peak Stock</div>
                        <div className="font-semibold text-blue-600">{product.maxStock} units</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm">
                      💡 Stock up to {product.maxStock} units before {product.peakSeason}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Opportunity Windows</CardTitle>
              <CardDescription>Upcoming opportunities and preparation timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunityWindows.map((opp, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{opp.window}</div>
                        <div className="text-sm text-gray-600">{opp.startDate} - {opp.endDate}</div>
                      </div>
                      <Badge className={
                        opp.priority === 'critical' ? 'bg-red-600' :
                        opp.priority === 'high' ? 'bg-orange-600' :
                        'bg-amber-600'
                      }>
                        {opp.priority}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Revenue Opportunity</div>
                        <div className="text-2xl font-bold text-green-600">{opp.opportunity}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Days Left</div>
                        <div className={`text-2xl font-bold ${
                          opp.daysLeft > 60 ? 'text-green-600' :
                          opp.daysLeft > 30 ? 'text-amber-600' :
                          opp.daysLeft > 0 ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {opp.daysLeft > 0 ? opp.daysLeft : 'Started'}
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded p-3">
                      <div className="text-sm font-medium text-purple-900 mb-2">Action Items:</div>
                      <ul className="space-y-1">
                        {opp.actions.map((action, idx) => (
                          <li key={idx} className="text-sm text-purple-700 flex items-start gap-2">
                            <span className="text-purple-600">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
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
