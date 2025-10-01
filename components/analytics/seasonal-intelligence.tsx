'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Star,
  Moon,
  Sun,
  Gift,
  Heart,
  Crown,
  Sparkles,
  Target,
  DollarSign,
  Package,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface SeasonalEvent {
  id: string;
  name: string;
  arabicName: string;
  type: 'religious' | 'national' | 'cultural' | 'commercial';
  startDate: Date;
  endDate: Date;
  duration: number;
  demandMultiplier: number;
  priorityCategories: string[];
  description: string;
  preparationTime: number;
  marketImpact: 'high' | 'medium' | 'low';
}

interface SeasonalForecast {
  event: string;
  month: string;
  predictedDemand: number;
  confidence: number;
  recommendedStockIncrease: number;
  investmentRequired: number;
  expectedROI: number;
  riskFactors: string[];
}

interface CategoryPerformance {
  category: string;
  seasonalIndex: number;
  peakMonths: string[];
  demandVariation: number;
  profitability: number;
  stockoutRisk: number;
}

interface CulturalInsight {
  event: string;
  insight: string;
  impact: number;
  actionable: string;
  confidence: number;
  historicalData: any[];
}

interface SeasonalIntelligenceProps {
  year?: number;
  region?: string;
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F', '#A0522D', '#D2691E'];
const EVENT_COLORS = {
  religious: '#10b981',
  national: '#3b82f6',
  cultural: '#8b5cf6',
  commercial: '#f59e0b',
};

export default function SeasonalIntelligence({ year = new Date().getFullYear(), region = 'UAE' }: SeasonalIntelligenceProps) {
  const [seasonalEvents, setSeasonalEvents] = useState<SeasonalEvent[]>([]);
  const [forecasts, setForecasts] = useState<SeasonalForecast[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([]);
  const [culturalInsights, setCulturalInsights] = useState<CulturalInsight[]>([]);
  const [demandTrends, setDemandTrends] = useState<any[]>([]);
  const [preparationPlan, setPreparationPlan] = useState<any[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeasonalData();
  }, [year, region]);

  const fetchSeasonalData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('year', year.toString());
      params.append('region', region);

      const [
        eventsRes,
        forecastsRes,
        categoryRes,
        insightsRes,
        trendsRes,
        planRes,
        riskRes,
      ] = await Promise.all([
        fetch(`/api/analytics/seasonal?type=events&${params.toString()}`),
        fetch(`/api/analytics/seasonal?type=forecasts&${params.toString()}`),
        fetch(`/api/analytics/seasonal?type=category&${params.toString()}`),
        fetch(`/api/analytics/seasonal?type=insights&${params.toString()}`),
        fetch(`/api/analytics/seasonal?type=trends&${params.toString()}`),
        fetch(`/api/analytics/seasonal?type=plan&${params.toString()}`),
        fetch(`/api/analytics/seasonal?type=risk&${params.toString()}`),
      ]);

      const [
        eventsData,
        forecastsData,
        categoryData,
        insightsData,
        trendsData,
        planData,
        riskData,
      ] = await Promise.all([
        eventsRes.json(),
        forecastsRes.json(),
        categoryRes.json(),
        insightsRes.json(),
        trendsRes.json(),
        planRes.json(),
        riskRes.json(),
      ]);

      setSeasonalEvents(eventsData.events || []);
      setForecasts(forecastsData.forecasts || []);
      setCategoryPerformance(categoryData.performance || []);
      setCulturalInsights(insightsData.insights || []);
      setDemandTrends(trendsData.trends || []);
      setPreparationPlan(planData.plan || []);
      setRiskAssessment(riskData.risk || {});

    } catch (error) {
      console.error('Error fetching seasonal analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'religious':
        return <Moon className="h-5 w-5 text-green-500" />;
      case 'national':
        return <Crown className="h-5 w-5 text-blue-500" />;
      case 'cultural':
        return <Heart className="h-5 w-5 text-purple-500" />;
      case 'commercial':
        return <Gift className="h-5 w-5 text-orange-500" />;
      default:
        return <Calendar className="h-5 w-5 text-oud-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDaysUntilEvent = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div className="text-center py-8">Loading seasonal intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-oud-800">Seasonal Intelligence</h2>
          <p className="text-oud-600">Cultural events and seasonal demand forecasting for {region} {year}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={fetchSeasonalData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Upcoming Events Alert */}
      {seasonalEvents
        .filter(event => getDaysUntilEvent(event.startDate) <= 60 && getDaysUntilEvent(event.startDate) > 0)
        .length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium text-blue-800">Upcoming Seasonal Events</h3>
                <p className="text-sm text-blue-600">
                  {seasonalEvents
                    .filter(event => getDaysUntilEvent(event.startDate) <= 60 && getDaysUntilEvent(event.startDate) > 0)
                    .map(event => `${event.name} (${getDaysUntilEvent(event.startDate)} days)`)
                    .join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Major Events This Year</p>
                <p className="text-xl font-bold text-oud-800">
                  {seasonalEvents.filter(e => e.marketImpact === 'high').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Peak Demand Increase</p>
                <p className="text-xl font-bold text-oud-800">
                  {Math.max(...forecasts.map(f => f.predictedDemand)).toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Investment Required</p>
                <p className="text-xl font-bold text-oud-800">
                  {formatCurrency(forecasts.reduce((sum, f) => sum + f.investmentRequired, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Expected ROI</p>
                <p className="text-xl font-bold text-green-600">
                  {(forecasts.reduce((sum, f) => sum + f.expectedROI, 0) / forecasts.length || 0).toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="events">Events Calendar</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="insights">Cultural Insights</TabsTrigger>
          <TabsTrigger value="preparation">Preparation</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        {/* Events Calendar Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events Timeline */}
            <Card className="card-luxury lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-oud-500" />
                  Cultural Events Calendar {year}
                </CardTitle>
                <CardDescription>Major cultural and seasonal events affecting demand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seasonalEvents.map((event) => {
                    const daysUntil = getDaysUntilEvent(event.startDate);
                    return (
                      <div key={event.id} className="border border-oud-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            {getEventIcon(event.type)}
                            <div>
                              <h4 className="font-medium text-oud-800">{event.name}</h4>
                              <p className="text-sm text-oud-600">{event.arabicName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`mb-1 ${getImpactColor(event.marketImpact)}`}
                            >
                              {event.marketImpact.toUpperCase()} IMPACT
                            </Badge>
                            <p className="text-xs text-oud-500">
                              {daysUntil > 0 ? `${daysUntil} days` : daysUntil === 0 ? 'Today' : 'Past'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-oud-800">{event.duration}</p>
                            <p className="text-xs text-oud-600">Days Duration</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-oud-800">{event.demandMultiplier}x</p>
                            <p className="text-xs text-oud-600">Demand Multiplier</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-oud-800">{event.preparationTime}</p>
                            <p className="text-xs text-oud-600">Prep Days</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-oud-600 mb-2">{event.description}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-oud-800 mb-1">Priority Categories:</p>
                          <div className="flex flex-wrap gap-1">
                            {event.priorityCategories.map((category, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs rounded"
                                style={{
                                  backgroundColor: EVENT_COLORS[event.type as keyof typeof EVENT_COLORS] + '20',
                                  color: EVENT_COLORS[event.type as keyof typeof EVENT_COLORS],
                                }}
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Event Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 border border-oud-200 rounded">
                    <h5 className="font-medium text-oud-800 mb-2">Events by Type</h5>
                    <ResponsiveContainer width="100%" height={150}>
                      <RechartsPieChart>
                        <Tooltip />
                        <RechartsPieChart
                          data={Object.entries(
                            seasonalEvents.reduce((acc: any, event) => {
                              acc[event.type] = (acc[event.type] || 0) + 1;
                              return acc;
                            }, {})
                          ).map(([type, count]) => ({ type, count }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="count"
                          nameKey="type"
                        >
                          {Object.keys(EVENT_COLORS).map((type, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={EVENT_COLORS[type as keyof typeof EVENT_COLORS]}
                            />
                          ))}
                        </RechartsPieChart>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(EVENT_COLORS).map(([type, color]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm capitalize text-oud-700">{type}</span>
                        </div>
                        <span className="text-sm font-medium text-oud-800">
                          {seasonalEvents.filter(e => e.type === type).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forecasts Tab */}
        <TabsContent value="forecasts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demand Forecast Chart */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-oud-500" />
                  Seasonal Demand Forecast
                </CardTitle>
                <CardDescription>Predicted demand increases by event</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={forecasts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="event" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'predictedDemand' ? formatPercentage(value) : formatCurrency(value),
                        name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      ]}
                    />
                    <Bar dataKey="predictedDemand" fill="#8B4513" name="Predicted Demand %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Investment vs ROI */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Investment vs Expected ROI</CardTitle>
                <CardDescription>Investment required and expected returns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={forecasts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="event" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name.includes('ROI') ? formatPercentage(value) : formatCurrency(value),
                        name.replace(/([A-Z])/g, ' $1').replace /^./, str => str.toUpperCase())
                      ]}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="investmentRequired"
                      fill="#D2B48C"
                      name="Investment Required"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="expectedROI"
                      stroke="#22c55e"
                      strokeWidth={3}
                      name="Expected ROI %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Forecasts */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Detailed Seasonal Forecasts</CardTitle>
              <CardDescription>Comprehensive forecast analysis for each major event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {forecasts.map((forecast, index) => (
                  <div key={index} className="border border-oud-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-oud-800">{forecast.event}</h4>
                        <p className="text-sm text-oud-600">{forecast.month}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">
                            {formatPercentage(forecast.confidence)} Confidence
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xl font-bold text-blue-600">
                          +{formatPercentage(forecast.predictedDemand)}
                        </p>
                        <p className="text-xs text-blue-600">Demand Increase</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-xl font-bold text-orange-600">
                          +{formatPercentage(forecast.recommendedStockIncrease)}
                        </p>
                        <p className="text-xs text-orange-600">Stock Increase</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded">
                        <p className="text-xl font-bold text-purple-600">
                          {formatCurrency(forecast.investmentRequired)}
                        </p>
                        <p className="text-xs text-purple-600">Investment</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-xl font-bold text-green-600">
                          {formatPercentage(forecast.expectedROI)}
                        </p>
                        <p className="text-xs text-green-600">Expected ROI</p>
                      </div>
                    </div>

                    {forecast.riskFactors.length > 0 && (
                      <div>
                        <h5 className="font-medium text-oud-800 mb-2">Risk Factors:</h5>
                        <div className="flex flex-wrap gap-2">
                          {forecast.riskFactors.map((risk, i) => (
                            <span key={i} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              {risk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Performance Radar */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-oud-500" />
                  Category Seasonal Performance
                </CardTitle>
                <CardDescription>How different product categories perform seasonally</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={categoryPerformance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      dataKey="seasonalIndex"
                      stroke="#8B4513"
                      fill="#8B4513"
                      fillOpacity={0.3}
                      strokeWidth={2}
                      name="Seasonal Index"
                    />
                    <Radar
                      dataKey="profitability"
                      stroke="#D2B48C"
                      fill="#D2B48C"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Profitability"
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk vs Profitability */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Risk vs Profitability Matrix</CardTitle>
                <CardDescription>Category risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={categoryPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatPercentage(value),
                        name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      ]}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="profitability"
                      fill="#22c55e"
                      name="Profitability %"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="stockoutRisk"
                      stroke="#ef4444"
                      strokeWidth={3}
                      name="Stockout Risk %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Details */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Category Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Category</th>
                      <th className="text-right py-2 px-4 text-oud-700">Seasonal Index</th>
                      <th className="text-left py-2 px-4 text-oud-700">Peak Months</th>
                      <th className="text-right py-2 px-4 text-oud-700">Demand Variation</th>
                      <th className="text-right py-2 px-4 text-oud-700">Profitability</th>
                      <th className="text-right py-2 px-4 text-oud-700">Stockout Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryPerformance.map((category, index) => (
                      <tr key={index} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4 font-medium text-oud-800">{category.category}</td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {category.seasonalIndex.toFixed(1)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {category.peakMonths.map((month, i) => (
                              <span key={i} className="px-2 py-1 bg-oud-100 text-oud-800 text-xs rounded">
                                {month}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatPercentage(category.demandVariation)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={`font-medium ${
                            category.profitability > 20 ? 'text-green-600' :
                            category.profitability > 10 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(category.profitability)}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={`font-medium ${
                            category.stockoutRisk > 30 ? 'text-red-600' :
                            category.stockoutRisk > 15 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {formatPercentage(category.stockoutRisk)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cultural Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-oud-500" />
                Cultural Intelligence & Market Insights
              </CardTitle>
              <CardDescription>Deep cultural insights for strategic planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {culturalInsights.map((insight, index) => (
                  <div key={index} className="border border-oud-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-medium text-oud-800">{insight.event}</h4>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-oud-600">
                          {formatPercentage(insight.confidence)} Confidence
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-oud-700 mb-2">{insight.insight}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <h5 className="font-medium text-blue-800 mb-1">Market Impact</h5>
                        <p className="text-2xl font-bold text-blue-600">
                          +{formatPercentage(insight.impact)}
                        </p>
                        <p className="text-xs text-blue-600">Revenue Impact</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <h5 className="font-medium text-green-800 mb-1">Actionable Strategy</h5>
                        <p className="text-sm text-green-700">{insight.actionable}</p>
                      </div>
                    </div>

                    {insight.historicalData && insight.historicalData.length > 0 && (
                      <div>
                        <h5 className="font-medium text-oud-800 mb-2">Historical Performance</h5>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={insight.historicalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="performance"
                              stroke="#8B4513"
                              strokeWidth={2}
                              name="Performance"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preparation Tab */}
        <TabsContent value="preparation" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-oud-500" />
                Seasonal Preparation Timeline
              </CardTitle>
              <CardDescription>Strategic preparation plan for upcoming seasonal events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {preparationPlan.map((plan, index) => (
                  <div key={index} className="border border-oud-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-oud-800">{plan.event}</h4>
                        <p className="text-sm text-oud-600">
                          Preparation starts: {new Date(plan.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${
                        plan.urgency === 'high' ? 'bg-red-100 text-red-600' :
                        plan.urgency === 'medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {plan.urgency?.toUpperCase()} URGENCY
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xl font-bold text-blue-600">{plan.daysToStart}</p>
                        <p className="text-xs text-blue-600">Days to Start Prep</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-xl font-bold text-orange-600">{plan.preparationDays}</p>
                        <p className="text-xs text-orange-600">Preparation Days</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-xl font-bold text-green-600">{formatCurrency(plan.budget)}</p>
                        <p className="text-xs text-green-600">Allocated Budget</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-oud-800 mb-2">Key Actions:</h5>
                        <ul className="space-y-1">
                          {plan.actions?.map((action: string, i: number) => (
                            <li key={i} className="text-sm text-oud-600 flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {action}
                            </li>
                          )) || []}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-oud-800 mb-2">Key Milestones:</h5>
                        <ul className="space-y-1">
                          {plan.milestones?.map((milestone: string, i: number) => (
                            <li key={i} className="text-sm text-oud-600 flex items-start gap-2">
                              <Clock className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              {milestone}
                            </li>
                          )) || []}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Assessment */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Risk Assessment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-2xl font-bold text-red-600">
                      {riskAssessment.overallRiskScore || 0}/100
                    </p>
                    <p className="text-sm text-red-600">Overall Risk Score</p>
                  </div>

                  <div className="space-y-3">
                    {riskAssessment.categories?.map((category: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-oud-200 rounded">
                        <span className="text-oud-700">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                category.score > 70 ? 'bg-red-500' :
                                category.score > 40 ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${category.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-oud-800">{category.score}/100</span>
                        </div>
                      </div>
                    )) || []}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mitigation Strategies */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Risk Mitigation Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAssessment.mitigationStrategies?.map((strategy: any, index: number) => (
                    <div key={index} className="border border-oud-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-oud-800">{strategy.title}</h5>
                        <Badge className={`text-xs ${
                          strategy.priority === 'high' ? 'bg-red-100 text-red-600' :
                          strategy.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {strategy.priority?.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-oud-600 mb-2">{strategy.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-oud-500">Impact: {strategy.impact}</span>
                        <span className="text-oud-500">Cost: {formatCurrency(strategy.cost || 0)}</span>
                      </div>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Trends */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Risk Trends Over Time</CardTitle>
              <CardDescription>Historical risk patterns and future projections</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={riskAssessment.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="supplyRisk"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                    name="Supply Risk"
                  />
                  <Area
                    type="monotone"
                    dataKey="demandRisk"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    name="Demand Risk"
                  />
                  <Area
                    type="monotone"
                    dataKey="operationalRisk"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Operational Risk"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}