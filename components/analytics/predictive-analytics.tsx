'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  AlertTriangle,
  Target,
  DollarSign,
  Calendar,
  Users,
  Brain,
  Zap,
  TrendingDown,
  Activity,
  Clock,
  Star,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  ForecastData,
  StockOutAlert,
  SeasonalRecommendation,
  PriceOptimization,
  ChurnPrediction,
} from '@/types/analytics';

interface PredictiveAnalyticsProps {
  horizon?: number; // forecasting horizon in months
  category?: string;
  confidence?: number; // minimum confidence level
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F'];

export default function PredictiveAnalytics({ horizon = 6, category, confidence = 80 }: PredictiveAnalyticsProps) {
  const [demandForecast, setDemandForecast] = useState<ForecastData[]>([]);
  const [stockOutAlerts, setStockOutAlerts] = useState<StockOutAlert[]>([]);
  const [seasonalRecommendations, setSeasonalRecommendations] = useState<SeasonalRecommendation[]>([]);
  const [priceOptimization, setPriceOptimization] = useState<PriceOptimization[]>([]);
  const [churnPrediction, setChurnPrediction] = useState<ChurnPrediction[]>([]);
  const [marketTrends, setMarketTrends] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictiveData();
  }, [horizon, category, confidence]);

  const fetchPredictiveData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('horizon', horizon.toString());
      if (category) params.append('category', category);

      const [demandRes, stockoutRes, seasonalRes, pricingRes, churnRes, trendsRes] = await Promise.all([
        fetch(`/api/analytics/predictive?type=demand&${params.toString()}`),
        fetch(`/api/analytics/predictive?type=stockout&${params.toString()}`),
        fetch(`/api/analytics/predictive?type=seasonal&${params.toString()}`),
        fetch(`/api/analytics/predictive?type=pricing&${params.toString()}`),
        fetch(`/api/analytics/predictive?type=churn&${params.toString()}`),
        fetch(`/api/analytics/predictive?type=trends&${params.toString()}`),
      ]);

      const [demandData, stockoutData, seasonalData, pricingData, churnData, trendsData] = await Promise.all([
        demandRes.json(),
        stockoutRes.json(),
        seasonalRes.json(),
        pricingRes.json(),
        churnRes.json(),
        trendsRes.json(),
      ]);

      setDemandForecast(demandData.forecast || []);
      setStockOutAlerts(stockoutData.alerts || []);
      setSeasonalRecommendations(seasonalData.recommendations || []);
      setPriceOptimization(pricingData.optimizations || []);
      setChurnPrediction(churnData.predictions || []);
      setMarketTrends(trendsData || {});

    } catch (error) {
      console.error('Error fetching predictive analytics:', error);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getRiskColor = (probability: number) => {
    if (probability > 0.7) return 'text-red-600 bg-red-100';
    if (probability > 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  if (loading) {
    return <div className="text-center py-8">Loading predictive analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-oud-800">Predictive Analytics</h2>
          <p className="text-oud-600">AI-powered insights and forecasting for strategic decision making</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-oud-600">
          <Brain className="h-4 w-4" />
          <span>AI Model v1.2.3 • High Confidence</span>
        </div>
      </div>

      {/* Quick Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Critical Alerts</p>
                <p className="text-xl font-bold text-red-600">
                  {stockOutAlerts.filter(alert => alert.severity === 'high').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">High Churn Risk</p>
                <p className="text-xl font-bold text-orange-600">
                  {churnPrediction.filter(pred => pred.churnProbability > 0.7).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Price Optimizations</p>
                <p className="text-xl font-bold text-green-600">
                  {priceOptimization.length}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Avg Forecast Confidence</p>
                <p className="text-xl font-bold text-oud-800">
                  {formatPercentage(demandForecast.reduce((sum, f) => sum + f.confidence, 0) / demandForecast.length || 0)}
                </p>
              </div>
              <Target className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="demand" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
          <TabsTrigger value="stockout">Stock Alerts</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="pricing">Price Optimization</TabsTrigger>
          <TabsTrigger value="churn">Customer Churn</TabsTrigger>
        </TabsList>

        {/* Demand Forecasting Tab */}
        <TabsContent value="demand" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demand Forecast Chart */}
            <Card className="card-luxury lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-oud-500" />
                  Demand Forecasting
                </CardTitle>
                <CardDescription>
                  AI-powered demand predictions with confidence intervals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={demandForecast}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'confidence' ? formatPercentage(value) : formatCurrency(value),
                        name === 'predicted' ? 'Predicted Demand' : 'Confidence Level'
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      fill="#8B4513"
                      fillOpacity={0.3}
                      stroke="#8B4513"
                      strokeWidth={3}
                      name="Predicted Demand"
                    />
                    <Line
                      type="monotone"
                      dataKey="confidence"
                      stroke="#D2B48C"
                      strokeWidth={2}
                      yAxisId="right"
                      name="Confidence %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Accuracy & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Forecast Accuracy</CardTitle>
                <CardDescription>Model performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-oud-600">Overall Accuracy:</span>
                  <span className="font-bold text-oud-800">85.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-oud-600">MAPE (Mean Absolute % Error):</span>
                  <span className="font-bold text-oud-800">14.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-oud-600">Trend Accuracy:</span>
                  <span className="font-bold text-oud-800">91.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-oud-600">Seasonal Factor:</span>
                  <span className="font-bold text-oud-800">Strong</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-oud-800">Peak Season Alert</p>
                    <p className="text-xs text-oud-600">December shows 27% increase in demand</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-oud-800">Growth Trend</p>
                    <p className="text-xs text-oud-600">Consistent 12% monthly growth expected</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-oud-800">Category Leader</p>
                    <p className="text-xs text-oud-600">Premium Oud showing strongest forecast</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stock Out Alerts Tab */}
        <TabsContent value="stockout" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Stock Out Predictions
              </CardTitle>
              <CardDescription>
                Advanced algorithms predict when you'll run out of stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockOutAlerts
                  .sort((a, b) => a.daysRemaining - b.daysRemaining)
                  .map((alert) => (
                  <div key={alert.productId} className="border border-oud-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-oud-800">{alert.productName}</h4>
                        <p className="text-sm text-oud-600">
                          Current stock: {alert.currentStock} units
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-oud-800">{alert.daysRemaining}</p>
                        <p className="text-xs text-oud-600">Days remaining</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-oud-800">{alert.dailyConsumption.toFixed(1)}</p>
                        <p className="text-xs text-oud-600">Daily consumption</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-oud-800">{alert.currentStock}</p>
                        <p className="text-xs text-oud-600">Current stock</p>
                      </div>
                    </div>

                    {/* Stock depletion timeline */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          alert.daysRemaining <= 7
                            ? 'bg-red-500'
                            : alert.daysRemaining <= 14
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.max(10, Math.min((alert.daysRemaining / 30) * 100, 100))}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-oud-600 text-center">
                      Stock depletion timeline
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Planning Tab */}
        <TabsContent value="seasonal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seasonal Recommendations */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-oud-500" />
                  Seasonal Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seasonalRecommendations.map((rec, index) => (
                    <div key={index} className="border border-oud-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-oud-800">{rec.season}</h4>
                        <span className="text-sm font-bold text-green-600">
                          +{formatPercentage(rec.expectedImpact)} impact
                        </span>
                      </div>
                      <p className="text-sm text-oud-600 mb-2">{rec.category}</p>
                      <p className="text-sm text-oud-800">{rec.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Trends */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Emerging Market Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketTrends.emergingTrends?.map((trend: any, index: number) => (
                    <div key={index} className="border border-oud-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-oud-800">{trend.trend}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trend.impact === 'High' ? 'bg-red-100 text-red-600' :
                          trend.impact === 'Medium' ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {trend.impact}
                        </span>
                      </div>
                      <p className="text-sm text-oud-600">
                        Expected timeframe: {trend.timeframe}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Price Optimization Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Optimization Chart */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-oud-500" />
                  Price Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={priceOptimization}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="currentPrice"
                      name="Current Price"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                    />
                    <YAxis
                      dataKey="expectedImpact"
                      name="Expected Impact"
                      type="number"
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => [
                        name === 'currentPrice' || name === 'suggestedPrice'
                          ? formatCurrency(value)
                          : formatPercentage(value),
                        name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')
                      ]}
                    />
                    <Scatter dataKey="suggestedPrice" fill="#8B4513" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Opportunity */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Revenue Opportunity</CardTitle>
                <CardDescription>Potential revenue increase from optimizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    +{formatCurrency(priceOptimization.reduce((sum, opt) => sum + opt.expectedImpact * 1000, 0))}
                  </p>
                  <p className="text-sm text-oud-600">Potential monthly increase</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-oud-600">Products to optimize:</span>
                    <span className="font-bold text-oud-800">{priceOptimization.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-oud-600">Avg price change:</span>
                    <span className="font-bold text-oud-800">
                      {formatPercentage(
                        priceOptimization.reduce((sum, opt) =>
                          sum + ((opt.suggestedPrice - opt.currentPrice) / opt.currentPrice * 100), 0
                        ) / priceOptimization.length
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Optimization Table */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Price Optimization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Product</th>
                      <th className="text-right py-2 px-4 text-oud-700">Current Price</th>
                      <th className="text-right py-2 px-4 text-oud-700">Suggested Price</th>
                      <th className="text-right py-2 px-4 text-oud-700">Expected Impact</th>
                      <th className="text-left py-2 px-4 text-oud-700">Reasoning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceOptimization.map((opt) => (
                      <tr key={opt.productId} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4 font-medium text-oud-800">{opt.productName}</td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatCurrency(opt.currentPrice)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={`font-bold ${
                            opt.suggestedPrice > opt.currentPrice
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {formatCurrency(opt.suggestedPrice)}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4 font-bold text-green-600">
                          +{formatPercentage(opt.expectedImpact)}
                        </td>
                        <td className="py-3 px-4 text-sm text-oud-600 max-w-xs">
                          {opt.reasoning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Churn Tab */}
        <TabsContent value="churn" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Churn Risk Distribution */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-oud-500" />
                  Churn Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { risk: 'Low (0-30%)', count: churnPrediction.filter(p => p.churnProbability <= 0.3).length },
                      { risk: 'Medium (30-70%)', count: churnPrediction.filter(p => p.churnProbability > 0.3 && p.churnProbability <= 0.7).length },
                      { risk: 'High (70%+)', count: churnPrediction.filter(p => p.churnProbability > 0.7).length },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="risk" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B4513" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Retention Opportunity */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Retention Opportunity</CardTitle>
                <CardDescription>Revenue at risk and recovery potential</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">15.3%</p>
                  <p className="text-sm text-oud-600">Revenue at risk</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-oud-600">High risk customers:</span>
                    <span className="font-bold text-red-600">
                      {churnPrediction.filter(p => p.churnProbability > 0.7).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-oud-600">Recovery potential:</span>
                    <span className="font-bold text-green-600">
                      {formatPercentage(65)} success rate
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* High Risk Customers */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>High Risk Customers</CardTitle>
              <CardDescription>Customers with 70%+ churn probability requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {churnPrediction
                  .filter(pred => pred.churnProbability > 0.7)
                  .sort((a, b) => b.churnProbability - a.churnProbability)
                  .map((customer) => (
                  <div key={customer.customerId} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-oud-800">{customer.customerName}</h4>
                        <p className="text-sm text-oud-600">Customer ID: {customer.customerId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(customer.churnProbability)}`}>
                        {formatPercentage(customer.churnProbability * 100)} Risk
                      </span>
                    </div>

                    <div className="mb-3">
                      <h5 className="font-medium text-oud-800 mb-1">Risk Factors:</h5>
                      <div className="flex flex-wrap gap-1">
                        {customer.riskFactors.map((factor, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-oud-800 mb-1">Recommended Actions:</h5>
                      <ul className="list-disc list-inside text-sm text-oud-600">
                        {customer.recommendedActions.map((action, index) => (
                          <li key={index}>{action}</li>
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