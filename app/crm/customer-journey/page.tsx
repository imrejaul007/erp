'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  MousePointer,
  ShoppingCart,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Download,
  BarChart3,
  ArrowLeft} from 'lucide-react';

interface JourneyStage {
  stage: 'sampling' | 'trial' | 'purchase' | 'repeat';
  count: number;
  conversionRate: number;
  avgTime: string;
  dropOffRate: number;
}

interface CustomerJourney {
  id: string;
  customer: {
    name: string;
    email: string;
    type: 'new' | 'returning';
  };
  currentStage: 'sampling' | 'trial' | 'purchase' | 'repeat' | 'churned';
  stages: {
    sampling?: { date: string; product: string; source: string };
    trial?: { date: string; product: string; amount: number };
    purchase?: { date: string; orderNumber: string; amount: number };
    repeat?: { date: string; totalOrders: number; totalSpent: number };
  };
  touchpoints: number;
  daysSinceSampling: number;
  conversionProbability: number;
  recommendedAction: string;
  status: 'progressing' | 'stalled' | 'at_risk' | 'converted';
}

export default function CustomerJourneyPage() {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Mock funnel data
  const funnelStages: JourneyStage[] = [
    {
      stage: 'sampling',
      count: 1000,
      conversionRate: 100,
      avgTime: '0 days',
      dropOffRate: 0,
    },
    {
      stage: 'trial',
      count: 450,
      conversionRate: 45,
      avgTime: '7 days',
      dropOffRate: 55,
    },
    {
      stage: 'purchase',
      count: 180,
      conversionRate: 40,
      avgTime: '14 days',
      dropOffRate: 60,
    },
    {
      stage: 'repeat',
      count: 95,
      conversionRate: 52.8,
      avgTime: '45 days',
      dropOffRate: 47.2,
    },
  ];

  // Mock customer journey data
  const customerJourneys: CustomerJourney[] = [
    {
      id: '1',
      customer: {
        name: 'Ahmed Al Mansoori',
        email: 'ahmed@example.com',
        type: 'returning',
      },
      currentStage: 'repeat',
      stages: {
        sampling: { date: '2023-10-01', product: 'Royal Oud Sample 5ml', source: 'Exhibition' },
        trial: { date: '2023-10-10', product: 'Royal Oud 30ml', amount: 350 },
        purchase: { date: '2023-10-25', orderNumber: 'ORD-2023-234', amount: 850 },
        repeat: { date: '2024-01-15', totalOrders: 3, totalSpent: 2500 },
      },
      touchpoints: 8,
      daysSinceSampling: 106,
      conversionProbability: 95,
      recommendedAction: 'Offer VIP membership upgrade',
      status: 'converted',
    },
    {
      id: '2',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        type: 'new',
      },
      currentStage: 'trial',
      stages: {
        sampling: { date: '2024-01-10', product: 'Attar Discovery Box', source: 'Website' },
        trial: { date: '2024-01-18', product: 'Rose Attar 30ml', amount: 280 },
      },
      touchpoints: 3,
      daysSinceSampling: 10,
      conversionProbability: 68,
      recommendedAction: 'Send follow-up email with 15% discount on first purchase',
      status: 'progressing',
    },
    {
      id: '3',
      customer: {
        name: 'Fatima Hassan',
        email: 'fatima@example.com',
        type: 'new',
      },
      currentStage: 'sampling',
      stages: {
        sampling: { date: '2024-01-05', product: 'Sample Pack (3 scents)', source: 'Mall Kiosk' },
      },
      touchpoints: 1,
      daysSinceSampling: 15,
      conversionProbability: 35,
      recommendedAction: 'Call customer to gather feedback and offer personalized recommendation',
      status: 'stalled',
    },
    {
      id: '4',
      customer: {
        name: 'Mohammed Ali',
        email: 'mohammed@example.com',
        type: 'new',
      },
      currentStage: 'purchase',
      stages: {
        sampling: { date: '2023-12-20', product: 'Oud Chips Sample', source: 'Social Media' },
        trial: { date: '2024-01-05', product: 'Oud Chips 100g', amount: 180 },
        purchase: { date: '2024-01-12', orderNumber: 'ORD-2024-045', amount: 450 },
      },
      touchpoints: 5,
      daysSinceSampling: 31,
      conversionProbability: 72,
      recommendedAction: 'Enroll in subscription program for regular delivery',
      status: 'progressing',
    },
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'sampling':
        return 'bg-blue-100 text-blue-800';
      case 'trial':
        return 'bg-yellow-100 text-yellow-800';
      case 'purchase':
        return 'bg-green-100 text-green-800';
      case 'repeat':
        return 'bg-purple-100 text-purple-800';
      case 'churned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'progressing':
        return 'bg-green-100 text-green-800';
      case 'stalled':
        return 'bg-yellow-100 text-yellow-800';
      case 'at_risk':
        return 'bg-red-100 text-red-800';
      case 'converted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'sampling':
        return <MousePointer className="h-5 w-5" />;
      case 'trial':
        return <Target className="h-5 w-5" />;
      case 'purchase':
        return <ShoppingCart className="h-5 w-5" />;
      case 'repeat':
        return <RefreshCw className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Customer Journey Mapping
          </h1>
          <p className="text-gray-600 mt-2">
            Track the path from sampling to repeat purchase
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>Customer progression through purchase stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelStages.map((stage, index) => {
              const width = (stage.count / funnelStages[0].count) * 100;
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStageColor(stage.stage)}`}>
                        {getStageIcon(stage.stage)}
                      </div>
                      <div>
                        <p className="font-semibold capitalize">{stage.stage}</p>
                        <p className="text-sm text-gray-600">Avg time: {stage.avgTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stage.count}</p>
                      <p className="text-sm text-gray-600">
                        {stage.conversionRate.toFixed(1)}% conversion
                      </p>
                    </div>
                  </div>
                  <div className="h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        stage.stage === 'sampling'
                          ? 'from-blue-500 to-blue-600'
                          : stage.stage === 'trial'
                          ? 'from-yellow-500 to-yellow-600'
                          : stage.stage === 'purchase'
                          ? 'from-green-500 to-green-600'
                          : 'from-purple-500 to-purple-600'
                      } transition-all duration-500 flex items-center justify-center`}
                      style={{ width: `${width}%` }}
                    >
                      <span className="text-white font-medium">{stage.count} customers</span>
                    </div>
                  </div>
                  {index < funnelStages.length - 1 && (
                    <div className="flex items-center justify-center my-2">
                      <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          {stage.dropOffRate.toFixed(1)}% drop-off
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Journeys</CardTitle>
            <Users className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerJourneys.length}</div>
            <p className="text-xs text-gray-600 mt-1">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sample to Purchase</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18%</div>
            <p className="text-xs text-gray-600 mt-1">Overall conversion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Journey Time</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21 days</div>
            <p className="text-xs text-gray-600 mt-1">From sample to purchase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
            <RefreshCw className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52.8%</div>
            <p className="text-xs text-gray-600 mt-1">Purchase to repeat</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Journeys */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Customer Journeys</CardTitle>
          <CardDescription>Track each customer's progression and engagement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {customerJourneys.map((journey) => (
            <Card key={journey.id} className="border-l-4 border-l-cyan-500">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{journey.customer.name}</h3>
                      <Badge className={getStageColor(journey.currentStage)}>
                        {journey.currentStage.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(journey.status)}>
                        {journey.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {journey.customer.type === 'new' ? '🆕 New' : '🔄 Returning'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{journey.customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Conversion Probability</p>
                    <p className="text-2xl font-bold text-cyan-600">
                      {journey.conversionProbability}%
                    </p>
                  </div>
                </div>

                {/* Journey Timeline */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    {['sampling', 'trial', 'purchase', 'repeat'].map((stage, idx) => {
                      const stageData = journey.stages[stage as keyof typeof journey.stages];
                      const isActive = stageData !== undefined;
                      const isCurrent = journey.currentStage === stage;

                      return (
                        <div key={stage} className="flex items-center flex-1">
                          <div className="flex flex-col items-center flex-1">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                isActive
                                  ? isCurrent
                                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                                    : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              {isActive ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : (
                                getStageIcon(stage)
                              )}
                            </div>
                            <p className="text-xs font-medium mt-2 capitalize">{stage}</p>
                            {stageData && (
                              <p className="text-xs text-gray-600">
                                {new Date(stageData.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {idx < 3 && (
                            <div
                              className={`h-1 flex-1 mx-2 ${
                                journey.stages[(
                                  ['sampling', 'trial', 'purchase', 'repeat'][idx + 1]
                                ) as keyof typeof journey.stages]
                                  ? 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Journey Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Touchpoints</p>
                    <p className="font-semibold">{journey.touchpoints} interactions</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Time in Journey</p>
                    <p className="font-semibold">{journey.daysSinceSampling} days</p>
                  </div>
                  {journey.stages.repeat && (
                    <>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="font-semibold">{journey.stages.repeat.totalOrders}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="font-semibold">
                          AED {journey.stages.repeat.totalSpent.toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Recommended Action */}
                <div
                  className={`rounded-lg p-4 mb-4 ${
                    journey.status === 'progressing'
                      ? 'bg-green-50 border border-green-200'
                      : journey.status === 'stalled'
                      ? 'bg-yellow-50 border border-yellow-200'
                      : journey.status === 'at_risk'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-purple-50 border border-purple-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {journey.status === 'progressing' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : journey.status === 'stalled' ? (
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    ) : journey.status === 'at_risk' ? (
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={`font-medium ${
                          journey.status === 'progressing'
                            ? 'text-green-900'
                            : journey.status === 'stalled'
                            ? 'text-yellow-900'
                            : journey.status === 'at_risk'
                            ? 'text-red-900'
                            : 'text-purple-900'
                        }`}
                      >
                        Recommended Action
                      </p>
                      <p
                        className={`text-sm ${
                          journey.status === 'progressing'
                            ? 'text-green-700'
                            : journey.status === 'stalled'
                            ? 'text-yellow-700'
                            : journey.status === 'at_risk'
                            ? 'text-red-700'
                            : 'text-purple-700'
                        }`}
                      >
                        {journey.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                    Execute Action
                  </Button>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Full History
                  </Button>
                  <Button size="sm" variant="outline">
                    Contact Customer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Insights</CardTitle>
          <CardDescription>AI-powered observations and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">High Drop-off at Trial Stage</p>
              <p className="text-sm text-red-700">
                55% of samplers don't convert to trial. Consider reducing trial product pricing
                or offering time-limited discounts.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Strong Repeat Purchase Rate</p>
              <p className="text-sm text-green-700">
                52.8% of first-time buyers become repeat customers. Focus on customer retention
                programs and loyalty rewards.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Optimal Follow-up Window</p>
              <p className="text-sm text-blue-700">
                Customers who receive follow-up within 7-10 days of sampling have 2.3x higher
                conversion rate. Automate timely outreach.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
