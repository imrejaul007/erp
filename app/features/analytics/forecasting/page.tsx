'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  Sparkles
} from 'lucide-react';

export default function SalesForecastingPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [forecastPeriod, setForecastPeriod] = useState('3-months');

  const forecastSummary = {
    nextMonth: {
      predicted: 1245000,
      confidence: 92,
      trend: 'up',
      change: 15.3,
      low: 1180000,
      high: 1310000
    },
    quarter: {
      predicted: 3650000,
      confidence: 88,
      trend: 'up',
      change: 12.8
    },
    year: {
      predicted: 14200000,
      confidence: 78,
      trend: 'up',
      change: 18.5
    }
  };

  const monthlyForecasts = [
    { month: 'Nov 2024', predicted: 1245000, low: 1180000, high: 1310000, confidence: 92, actual: null },
    { month: 'Dec 2024', predicted: 1380000, low: 1300000, high: 1460000, confidence: 89, actual: null },
    { month: 'Jan 2025', predicted: 1025000, low: 970000, high: 1080000, confidence: 87, actual: null },
    { month: 'Feb 2025', predicted: 1150000, low: 1090000, high: 1210000, confidence: 85, actual: null },
    { month: 'Mar 2025', predicted: 1320000, low: 1250000, high: 1390000, confidence: 83, actual: null },
    { month: 'Apr 2025', predicted: 1420000, low: 1340000, high: 1500000, confidence: 80, actual: null },
  ];

  const categoryForecasts = [
    { category: 'Oud Oil', current: 425000, predicted: 495000, change: 16.5, trend: 'up', confidence: 94 },
    { category: 'Perfumes', current: 285000, predicted: 315000, change: 10.5, trend: 'up', confidence: 91 },
    { category: 'Incense', current: 95000, predicted: 102000, change: 7.4, trend: 'up', confidence: 88 },
    { category: 'Gift Sets', current: 145000, predicted: 185000, change: 27.6, trend: 'up', confidence: 85 },
    { category: 'Accessories', current: 35000, predicted: 38000, change: 8.6, trend: 'up', confidence: 82 }
  ];

  const keyDrivers = [
    {
      driver: 'Seasonal Demand',
      impact: 'high',
      description: 'Ramadan season approaching - historically increases sales by 40%',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      driver: 'Marketing Campaigns',
      impact: 'medium',
      description: 'Planned social media campaigns expected to drive 15% more traffic',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      driver: 'Inventory Levels',
      impact: 'medium',
      description: 'Current stock levels support projected demand with 95% fulfillment',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      driver: 'Economic Trends',
      impact: 'low',
      description: 'Stable economic conditions with positive consumer sentiment',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  const risks = [
    {
      risk: 'Supply Chain Delays',
      probability: 'medium',
      impact: 'AED -150K',
      description: 'Potential delays in raw material imports',
      status: 'monitoring'
    },
    {
      risk: 'Competitor Pricing',
      probability: 'low',
      impact: 'AED -80K',
      description: 'Aggressive pricing by major competitor',
      status: 'low-priority'
    },
    {
      risk: 'Currency Fluctuation',
      probability: 'low',
      impact: 'AED -50K',
      description: 'Import costs may increase with currency changes',
      status: 'low-priority'
    }
  ];

  const recommendations = [
    {
      title: 'Increase Inventory',
      description: 'Stock up on Oud Oil and Gift Sets ahead of peak season',
      priority: 'high',
      impact: '+AED 200K revenue potential',
      icon: CheckCircle
    },
    {
      title: 'Launch Pre-Season Campaign',
      description: 'Start marketing 3 weeks before Ramadan for early buyers',
      priority: 'high',
      impact: '+15% early sales',
      icon: Target
    },
    {
      title: 'Optimize Pricing',
      description: 'Adjust prices for Gift Sets to maximize margin',
      priority: 'medium',
      impact: '+3% margin improvement',
      icon: DollarSign
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            Sales Forecasting
          </h1>
          <p className="text-muted-foreground">
            AI-powered sales predictions based on historical data and market trends
          </p>
        </div>
        <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-month">Next Month</SelectItem>
            <SelectItem value="3-months">Next 3 Months</SelectItem>
            <SelectItem value="6-months">Next 6 Months</SelectItem>
            <SelectItem value="12-months">Next 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Next Month Forecast</div>
              <Badge className="bg-green-100 text-green-800">
                {forecastSummary.nextMonth.confidence}% Confidence
              </Badge>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              AED {(forecastSummary.nextMonth.predicted / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">
                +{forecastSummary.nextMonth.change}%
              </span>
              <span className="text-gray-600">vs last month</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Range: AED {(forecastSummary.nextMonth.low / 1000).toFixed(0)}K - {(forecastSummary.nextMonth.high / 1000).toFixed(0)}K
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Quarterly Forecast</div>
              <Badge className="bg-green-100 text-green-800">
                {forecastSummary.quarter.confidence}% Confidence
              </Badge>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              AED {(forecastSummary.quarter.predicted / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">
                +{forecastSummary.quarter.change}%
              </span>
              <span className="text-gray-600">vs last quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Annual Forecast</div>
              <Badge className="bg-amber-100 text-amber-800">
                {forecastSummary.year.confidence}% Confidence
              </Badge>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              AED {(forecastSummary.year.predicted / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">
                +{forecastSummary.year.change}%
              </span>
              <span className="text-gray-600">vs last year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="drivers">Key Drivers</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Forecast Breakdown</CardTitle>
              <CardDescription>Predicted sales for the next 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyForecasts.map((forecast, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{forecast.month}</div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {forecast.confidence}% Confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-gray-600">Predicted</div>
                        <div className="text-lg font-bold text-blue-600">
                          AED {(forecast.predicted / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Low Estimate</div>
                        <div className="text-lg font-semibold text-gray-700">
                          AED {(forecast.low / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">High Estimate</div>
                        <div className="text-lg font-semibold text-gray-700">
                          AED {(forecast.high / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Forecasts</CardTitle>
              <CardDescription>Predicted sales by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryForecasts.map((cat, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">{cat.category}</div>
                      <Badge className="bg-green-100 text-green-800">
                        {cat.confidence}% Confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-600">Current</div>
                        <div className="text-lg font-semibold text-gray-700">
                          AED {(cat.current / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Predicted</div>
                        <div className="text-lg font-bold text-blue-600">
                          AED {(cat.predicted / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Change</div>
                        <div className="text-lg font-semibold text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          +{cat.change}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Key Forecast Drivers</CardTitle>
              <CardDescription>Factors influencing the sales forecast</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keyDrivers.map((driver, index) => {
                  const Icon = driver.icon;
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${driver.bgColor}`}>
                          <Icon className={`h-6 w-6 ${driver.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold">{driver.driver}</div>
                            <Badge className={
                              driver.impact === 'high' ? 'bg-red-100 text-red-800' :
                              driver.impact === 'medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-green-100 text-green-800'
                            }>
                              {driver.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{driver.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Risks</CardTitle>
              <CardDescription>Potential risks that may impact the forecast</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {risks.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className={`h-5 w-5 mt-1 ${
                        risk.probability === 'high' ? 'text-red-600' :
                        risk.probability === 'medium' ? 'text-amber-600' :
                        'text-gray-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">{risk.risk}</div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{risk.probability} probability</Badge>
                            <Badge className={
                              risk.status === 'monitoring' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {risk.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                        <div className="text-sm font-medium text-red-600">
                          Potential Impact: {risk.impact}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Actions to optimize your forecasted results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          rec.priority === 'high' ? 'bg-red-100' :
                          rec.priority === 'medium' ? 'bg-amber-100' :
                          'bg-green-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            rec.priority === 'high' ? 'text-red-600' :
                            rec.priority === 'medium' ? 'text-amber-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold">{rec.title}</div>
                            <Badge className={
                              rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                              rec.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-green-100 text-green-800'
                            }>
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          <div className="text-sm font-medium text-green-600">
                            Expected Impact: {rec.impact}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
