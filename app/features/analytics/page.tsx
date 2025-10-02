'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Zap,
  Brain,
  Calendar,
  Package,
  Crown
} from 'lucide-react';

export default function AdvancedAnalyticsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const analyticsFeatures = [
    {
      title: 'Sales Forecasting',
      description: 'AI-powered predictions based on historical sales data',
      icon: TrendingUp,
      path: '/features/analytics/forecasting',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      metrics: ['Next Month: AED 1.2M', 'Growth: +15%', 'Confidence: 92%']
    },
    {
      title: 'Customer Behavior',
      description: 'Purchase patterns, preferences, and seasonal trends',
      icon: Users,
      path: '/features/analytics/customer-behavior',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      metrics: ['Avg Spend: AED 3,450', 'Repeat Rate: 68%', 'Churn: 12%']
    },
    {
      title: 'Profit Analysis',
      description: 'Deep dive into product-level profitability',
      icon: DollarSign,
      path: '/features/analytics/profit-deep-dive',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      metrics: ['Gross Margin: 43%', 'Net Margin: 33%', 'Best Product: Royal Oud']
    },
    {
      title: 'Competitor Monitoring',
      description: 'Track market prices and competitor strategies',
      icon: Target,
      path: '/features/analytics/competitor',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      metrics: ['Tracked: 15 Products', 'Price Gap: +8%', 'Market Share: 23%']
    },
    {
      title: 'ABC Analysis',
      description: 'Classify inventory by value and volume',
      icon: Package,
      path: '/features/analytics/abc-analysis',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      metrics: ['A Items: 20%', 'B Items: 30%', 'C Items: 50%']
    },
    {
      title: 'Performance Dashboard',
      description: 'Real-time KPIs and business metrics',
      icon: Zap,
      path: '/features/analytics/performance',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      metrics: ['Sales Today: AED 45K', 'Orders: 28', 'Avg Order: AED 1,607']
    },
    {
      title: 'Predictive Analytics',
      description: 'AI predictions for demand, inventory, and trends',
      icon: Brain,
      path: '/features/analytics/predictive',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      metrics: ['Demand ↑ 25%', 'Restock Alert: 12', 'Trending: Amber']
    },
    {
      title: 'Seasonal Analysis',
      description: 'Identify seasonal patterns and opportunities',
      icon: Calendar,
      path: '/features/analytics/seasonal',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      metrics: ['Peak: Ramadan', 'Low: Summer', 'Growth Opp: 34%']
    },
    {
      title: 'VIP Customer Analytics',
      description: 'Deep insights on high-value customers',
      icon: Crown,
      path: '/features/analytics/vip',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      metrics: ['VIP Count: 156', 'Revenue: 45%', 'LTV: AED 45K']
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            Advanced Analytics & Business Intelligence
          </h1>
          <p className="text-muted-foreground">
            Powerful insights and AI-driven analytics for data-driven decisions
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">24</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Points</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">1.2M+</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">94%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Insights/Day</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600">45</p>
              </div>
              <Zap className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {analyticsFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => router.push(feature.path)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Key Metrics:</div>
                  {feature.metrics.map((metric, idx) => (
                    <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      {metric}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Quick Insights</CardTitle>
          <CardDescription>AI-generated insights based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-900">Sales Trending Up</div>
                <div className="text-sm text-green-700">
                  Your sales are 25% higher than last week. Royal Oud Premium is driving growth.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <Package className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <div className="font-medium text-amber-900">Restock Recommendation</div>
                <div className="text-sm text-amber-700">
                  12 products predicted to run out in next 7 days based on current sales velocity.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <Users className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium text-purple-900">Customer Behavior Pattern</div>
                <div className="text-sm text-purple-700">
                  VIP customers are purchasing 40% more during evening hours (6-9 PM).
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
