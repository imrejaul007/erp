'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  Users,
  DollarSign,
  Calendar,
  Sparkles,
  Target,
  Activity
} from 'lucide-react';

export default function PredictiveAnalyticsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('demand');

  const demandPredictions = [
    {
      product: 'Royal Oud Premium',
      currentStock: 82,
      predictedDemand: 145,
      daysToStockout: 7,
      confidence: 94,
      action: 'reorder_urgent',
      reorderQty: 200
    },
    {
      product: 'Arabian Nights',
      currentStock: 156,
      predictedDemand: 98,
      daysToStockout: 18,
      confidence: 91,
      action: 'monitor',
      reorderQty: 150
    },
    {
      product: 'Desert Rose',
      currentStock: 94,
      predictedDemand: 112,
      daysToStockout: 10,
      confidence: 89,
      action: 'reorder_soon',
      reorderQty: 150
    },
    {
      product: 'Sandalwood Essence',
      currentStock: 68,
      predictedDemand: 125,
      daysToStockout: 6,
      confidence: 92,
      action: 'reorder_urgent',
      reorderQty: 180
    },
    {
      product: 'Amber Collection',
      currentStock: 125,
      predictedDemand: 78,
      daysToStockout: 22,
      confidence: 87,
      action: 'optimal',
      reorderQty: 120
    }
  ];

  const trendingProducts = [
    {
      product: 'Amber Collection',
      trend: 'rising',
      growthRate: 25,
      reason: 'Social media viral post',
      confidence: 88,
      expectedIncrease: 45,
      timeframe: 'Next 14 days'
    },
    {
      product: 'Gift Sets',
      trend: 'rising',
      growthRate: 35,
      reason: 'Upcoming Ramadan season',
      confidence: 93,
      expectedIncrease: 120,
      timeframe: 'Next 30 days'
    },
    {
      product: 'Basic Incense',
      trend: 'declining',
      growthRate: -15,
      reason: 'Seasonal decline',
      confidence: 85,
      expectedIncrease: -30,
      timeframe: 'Next 30 days'
    },
    {
      product: 'Rose Water Spray',
      trend: 'stable',
      growthRate: 2,
      reason: 'Consistent demand',
      confidence: 79,
      expectedIncrease: 5,
      timeframe: 'Next 30 days'
    }
  ];

  const customerChurn = [
    {
      segment: 'VIP Elite',
      atRiskCount: 12,
      churnProbability: 18,
      estimatedLoss: 150000,
      retentionActions: ['Exclusive offer', 'Personal outreach', 'VIP event invite'],
      priority: 'critical'
    },
    {
      segment: 'Regular Loyal',
      atRiskCount: 45,
      churnProbability: 28,
      estimatedLoss: 93600,
      retentionActions: ['Loyalty bonus', 'Special discount', 'Survey feedback'],
      priority: 'high'
    },
    {
      segment: 'Occasional',
      atRiskCount: 128,
      churnProbability: 42,
      estimatedLoss: 80000,
      retentionActions: ['Win-back campaign', 'Product recommendations'],
      priority: 'medium'
    }
  ];

  const pricingInsights = [
    {
      product: 'Royal Oud Premium',
      currentPrice: 425,
      optimalPrice: 445,
      elasticity: -1.2,
      expectedImpact: '+8.5%',
      confidence: 91,
      recommendation: 'Increase price by AED 20'
    },
    {
      product: 'Arabian Nights',
      currentPrice: 305,
      optimalPrice: 295,
      elasticity: -1.8,
      expectedImpact: '+12.3%',
      confidence: 87,
      recommendation: 'Decrease price by AED 10 to boost volume'
    },
    {
      product: 'Desert Rose',
      currentPrice: 277,
      optimalPrice: 277,
      elasticity: -1.5,
      expectedImpact: '0%',
      confidence: 84,
      recommendation: 'Maintain current pricing'
    },
    {
      product: 'Sandalwood Essence',
      currentPrice: 244,
      optimalPrice: 259,
      elasticity: -1.1,
      expectedImpact: '+6.2%',
      confidence: 89,
      recommendation: 'Increase price by AED 15'
    }
  ];

  const anomalyDetection = [
    {
      type: 'sales_spike',
      severity: 'info',
      description: 'Unusual sales increase for Gift Sets (3x normal)',
      detectedAt: '2 hours ago',
      possibleCause: 'Influencer promotion',
      action: 'Ensure adequate stock',
      confidence: 92
    },
    {
      type: 'inventory_discrepancy',
      severity: 'warning',
      description: 'Stock variance detected for Royal Oud Premium',
      detectedAt: '1 day ago',
      possibleCause: 'Possible inventory error',
      action: 'Conduct physical count',
      confidence: 78
    },
    {
      type: 'revenue_drop',
      severity: 'alert',
      description: 'Revenue dropped 20% at Dubai Mall location',
      detectedAt: '3 hours ago',
      possibleCause: 'Staffing issue or system outage',
      action: 'Investigate immediately',
      confidence: 95
    },
    {
      type: 'customer_behavior',
      severity: 'info',
      description: 'Increase in evening purchases (6-9 PM)',
      detectedAt: '1 day ago',
      possibleCause: 'Changing customer habits',
      action: 'Adjust staffing schedule',
      confidence: 88
    }
  ];

  const seasonalForecasts = [
    {
      event: 'Ramadan 2025',
      startDate: 'Feb 28, 2025',
      daysAway: 120,
      predictedSales: 2850000,
      vsLastYear: 15.5,
      topProducts: ['Gift Sets', 'Premium Oud', 'Incense'],
      preparation: 'Stock up 45 days in advance'
    },
    {
      event: 'Eid Al-Fitr',
      startDate: 'Mar 30, 2025',
      daysAway: 150,
      predictedSales: 1920000,
      vsLastYear: 12.3,
      topProducts: ['Perfumes', 'Gift Sets', 'Luxury Items'],
      preparation: 'Increase inventory by 40%'
    },
    {
      event: 'UAE National Day',
      startDate: 'Dec 2, 2024',
      daysAway: 62,
      predictedSales: 950000,
      vsLastYear: 8.7,
      topProducts: ['Patriotic Gift Sets', 'Premium Perfumes'],
      preparation: 'Special packaging ready'
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
            <Brain className="h-8 w-8 text-pink-600" />
            Predictive Analytics
          </h1>
          <p className="text-muted-foreground">
            AI-powered predictions for demand, inventory, trends, and customer behavior
          </p>
        </div>
        <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI Powered
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-gray-600">Restock Alerts</div>
            <div className="text-xs text-gray-500 mt-1">Urgent action needed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">25%</div>
            <div className="text-sm text-gray-600">Demand Increase</div>
            <div className="text-xs text-gray-500 mt-1">Next 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-2xl font-bold text-amber-600">185</div>
            <div className="text-sm text-gray-600">At-Risk Customers</div>
            <div className="text-xs text-gray-500 mt-1">Retention needed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Activity className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-gray-600">Anomalies Detected</div>
            <div className="text-xs text-gray-500 mt-1">Last 24 hours</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="churn">Customer Churn</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
        </TabsList>

        {/* Demand Forecast Tab */}
        <TabsContent value="demand">
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecasting & Restock Alerts</CardTitle>
              <CardDescription>AI predictions for inventory management (next 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandPredictions.map((pred, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    pred.action === 'reorder_urgent' ? 'bg-red-50 border-red-200' :
                    pred.action === 'reorder_soon' ? 'bg-amber-50 border-amber-200' :
                    pred.action === 'optimal' ? 'bg-green-50 border-green-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{pred.product}</div>
                        <div className="text-sm text-gray-600">Current stock: {pred.currentStock} units</div>
                      </div>
                      <Badge className={
                        pred.action === 'reorder_urgent' ? 'bg-red-600' :
                        pred.action === 'reorder_soon' ? 'bg-amber-600' :
                        pred.action === 'optimal' ? 'bg-green-600' :
                        'bg-blue-600'
                      }>
                        {pred.action.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-600">Predicted Demand</div>
                        <div className="font-bold text-purple-600">{pred.predictedDemand} units</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Days to Stockout</div>
                        <div className={`font-bold ${
                          pred.daysToStockout <= 7 ? 'text-red-600' :
                          pred.daysToStockout <= 14 ? 'text-amber-600' :
                          'text-green-600'
                        }`}>
                          {pred.daysToStockout} days
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Confidence</div>
                        <div className="font-bold text-blue-600">{pred.confidence}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Reorder Qty</div>
                        <div className="font-bold text-green-600">{pred.reorderQty} units</div>
                      </div>
                    </div>
                    <Progress value={(pred.currentStock / pred.predictedDemand) * 100} className="h-2" />
                    {pred.action === 'reorder_urgent' && (
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <div className="text-sm font-medium text-red-900">
                          ⚠️ Urgent: Order {pred.reorderQty} units within 2 days to avoid stockout
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <CardTitle>Trending Products & Forecasts</CardTitle>
              <CardDescription>Products with changing demand patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingProducts.map((trend, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{trend.product}</div>
                        <div className="text-sm text-gray-600">{trend.reason}</div>
                      </div>
                      <Badge className={
                        trend.trend === 'rising' ? 'bg-green-100 text-green-800' :
                        trend.trend === 'declining' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {trend.trend === 'rising' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {trend.trend === 'declining' && <TrendingDown className="h-3 w-3 mr-1" />}
                        {trend.trend} {Math.abs(trend.growthRate)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-600">Expected Change</div>
                        <div className={`font-bold ${
                          trend.expectedIncrease > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trend.expectedIncrease > 0 ? '+' : ''}{trend.expectedIncrease}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Timeframe</div>
                        <div className="font-semibold">{trend.timeframe}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Confidence</div>
                        <div className="font-bold text-blue-600">{trend.confidence}%</div>
                      </div>
                    </div>
                    <Progress value={trend.confidence} className="h-2" />
                    {trend.trend === 'rising' && (
                      <div className="mt-3 pt-3 border-t bg-green-50 -mx-4 -mb-4 px-4 py-2 rounded-b-lg">
                        <div className="text-sm font-medium text-green-900">
                          💡 Recommendation: Increase stock and promote heavily
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Churn Tab */}
        <TabsContent value="churn">
          <Card>
            <CardHeader>
              <CardTitle>Customer Churn Prediction</CardTitle>
              <CardDescription>At-risk customers requiring retention efforts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerChurn.map((churn, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-semibold text-lg">{churn.segment}</div>
                        <div className="text-sm text-gray-600">{churn.atRiskCount} customers at risk</div>
                      </div>
                      <Badge className={
                        churn.priority === 'critical' ? 'bg-red-600' :
                        churn.priority === 'high' ? 'bg-orange-600' :
                        'bg-amber-600'
                      }>
                        {churn.priority} priority
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-600">Churn Probability</div>
                        <div className="font-bold text-red-600">{churn.churnProbability}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Estimated Loss</div>
                        <div className="font-bold text-red-600">AED {(churn.estimatedLoss / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">At Risk</div>
                        <div className="font-bold text-amber-600">{churn.atRiskCount} customers</div>
                      </div>
                    </div>
                    <Progress value={churn.churnProbability} className="h-2 mb-3" />
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <div className="text-sm font-medium text-blue-900 mb-2">Retention Actions:</div>
                      <div className="flex flex-wrap gap-2">
                        {churn.retentionActions.map((action, idx) => (
                          <Badge key={idx} variant="outline" className="bg-white">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Pricing Optimization</CardTitle>
              <CardDescription>AI-recommended pricing for maximum revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricingInsights.map((pricing, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-lg">{pricing.product}</div>
                      <Badge className="bg-purple-100 text-purple-800">
                        {pricing.confidence}% Confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-600">Current Price</div>
                        <div className="font-bold">AED {pricing.currentPrice}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Optimal Price</div>
                        <div className={`font-bold ${
                          pricing.optimalPrice > pricing.currentPrice ? 'text-green-600' :
                          pricing.optimalPrice < pricing.currentPrice ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          AED {pricing.optimalPrice}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Elasticity</div>
                        <div className="font-semibold">{pricing.elasticity}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Impact</div>
                        <div className={`font-bold ${
                          pricing.expectedImpact.includes('+') ? 'text-green-600' :
                          pricing.expectedImpact === '0%' ? 'text-gray-600' :
                          'text-red-600'
                        }`}>
                          {pricing.expectedImpact}
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <div className="text-sm font-medium text-green-900">
                        💡 {pricing.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomalies Tab */}
        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection</CardTitle>
              <CardDescription>Unusual patterns requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalyDetection.map((anomaly, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    anomaly.severity === 'alert' ? 'bg-red-50 border-red-200' :
                    anomaly.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className={`h-6 w-6 mt-1 ${
                        anomaly.severity === 'alert' ? 'text-red-600' :
                        anomaly.severity === 'warning' ? 'text-amber-600' :
                        'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-lg capitalize">
                            {anomaly.type.replace('_', ' ')}
                          </div>
                          <Badge className={
                            anomaly.severity === 'alert' ? 'bg-red-600' :
                            anomaly.severity === 'warning' ? 'bg-amber-600' :
                            'bg-blue-600'
                          }>
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">{anomaly.description}</div>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Detected: </span>
                            <span className="font-semibold">{anomaly.detectedAt}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Possible Cause: </span>
                            <span className="font-semibold">{anomaly.possibleCause}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Confidence: </span>
                            <span className="font-semibold">{anomaly.confidence}%</span>
                          </div>
                        </div>
                        <div className={`p-2 rounded ${
                          anomaly.severity === 'alert' ? 'bg-red-100' :
                          anomaly.severity === 'warning' ? 'bg-amber-100' :
                          'bg-blue-100'
                        }`}>
                          <div className="text-sm font-medium">
                            ⚡ Action Required: {anomaly.action}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Tab */}
        <TabsContent value="seasonal">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Event Forecasts</CardTitle>
              <CardDescription>Predictions for upcoming seasonal peaks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seasonalForecasts.map((forecast, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          {forecast.event}
                        </div>
                        <div className="text-sm text-gray-600">{forecast.startDate} ({forecast.daysAway} days away)</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +{forecast.vsLastYear}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Predicted Sales</div>
                        <div className="text-2xl font-bold text-green-600">
                          AED {(forecast.predictedSales / 1000000).toFixed(2)}M
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">vs Last Year</div>
                        <div className="text-2xl font-bold text-blue-600">+{forecast.vsLastYear}%</div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Top Products:</div>
                      <div className="flex flex-wrap gap-2">
                        {forecast.topProducts.map((product, idx) => (
                          <Badge key={idx} variant="outline">{product}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded p-3">
                      <div className="text-sm font-medium text-purple-900">
                        📦 Preparation: {forecast.preparation}
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
