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
  Crown,
  DollarSign,
  TrendingUp,
  Heart,
  Star,
  Gift,
  Calendar,
  Phone,
  Mail,
  ShoppingCart,
  Award,
  Target
} from 'lucide-react';

export default function VIPCustomerAnalyticsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const vipSummary = {
    totalVIPs: 156,
    percentOfCustomers: 5.5,
    totalRevenue: 1950000,
    revenueShare: 45.1,
    avgLifetimeValue: 45280,
    avgPurchaseFrequency: 8.2,
    retentionRate: 94.2,
    churnRisk: 12
  };

  const vipTiers = [
    {
      tier: 'Diamond',
      count: 18,
      minSpend: 100000,
      avgLTV: 125000,
      revenue: 2250000,
      benefits: ['Personal shopper', 'Free delivery', '25% discount', 'Exclusive events', 'First access'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      tier: 'Platinum',
      count: 45,
      minSpend: 50000,
      avgLTV: 68500,
      revenue: 3082500,
      benefits: ['Priority service', 'Free delivery', '20% discount', 'Birthday gifts', 'VIP lounge'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      tier: 'Gold',
      count: 93,
      minSpend: 25000,
      avgLTV: 32800,
      revenue: 3050400,
      benefits: ['Express checkout', '15% discount', 'Points 2x', 'Free samples', 'Special offers'],
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  const topVIPCustomers = [
    {
      name: 'Sheikh Abdullah Al-Maktoum',
      tier: 'Diamond',
      totalSpent: 285000,
      visits: 42,
      lastVisit: '2 days ago',
      avgOrder: 6786,
      favoriteCategory: 'Premium Oud',
      satisfaction: 5.0,
      status: 'active'
    },
    {
      name: 'Fatima Al-Qasimi',
      tier: 'Diamond',
      totalSpent: 245000,
      visits: 38,
      lastVisit: '1 week ago',
      avgOrder: 6447,
      favoriteCategory: 'Luxury Perfumes',
      satisfaction: 4.9,
      status: 'active'
    },
    {
      name: 'Mohammed bin Rashid',
      tier: 'Platinum',
      totalSpent: 185000,
      visits: 52,
      lastVisit: '3 days ago',
      avgOrder: 3558,
      favoriteCategory: 'Gift Sets',
      satisfaction: 4.8,
      status: 'active'
    },
    {
      name: 'Sara Al-Nahyan',
      tier: 'Platinum',
      totalSpent: 165000,
      visits: 45,
      lastVisit: '5 days ago',
      avgOrder: 3667,
      favoriteCategory: 'Premium Oud',
      satisfaction: 4.9,
      status: 'active'
    },
    {
      name: 'Ahmed Al-Falasi',
      tier: 'Gold',
      totalSpent: 95000,
      visits: 68,
      lastVisit: '1 day ago',
      avgOrder: 1397,
      favoriteCategory: 'Incense',
      satisfaction: 4.7,
      status: 'active'
    }
  ];

  const purchasePreferences = [
    { category: 'Premium Oud', vipPurchases: 485, percentage: 42.5, avgSpend: 8500, frequency: 3.2 },
    { category: 'Luxury Perfumes', vipPurchases: 342, percentage: 29.9, avgSpend: 6200, frequency: 2.8 },
    { category: 'Gift Sets', vipPurchases: 198, percentage: 17.3, avgSpend: 4850, frequency: 1.9 },
    { category: 'Exclusive Collections', vipPurchases: 85, percentage: 7.4, avgSpend: 12500, frequency: 1.2 },
    { category: 'Accessories', vipPurchases: 32, percentage: 2.8, avgSpend: 1850, frequency: 0.8 }
  ];

  const engagementMetrics = [
    {
      metric: 'Email Open Rate',
      vipRate: 68.5,
      regularRate: 32.1,
      difference: 36.4,
      status: 'excellent'
    },
    {
      metric: 'Event Attendance',
      vipRate: 82.3,
      regularRate: 15.8,
      difference: 66.5,
      status: 'excellent'
    },
    {
      metric: 'Loyalty Program Engagement',
      vipRate: 94.2,
      regularRate: 45.6,
      difference: 48.6,
      status: 'excellent'
    },
    {
      metric: 'Social Media Interaction',
      vipRate: 45.8,
      regularRate: 18.2,
      difference: 27.6,
      status: 'good'
    },
    {
      metric: 'Referral Rate',
      vipRate: 38.5,
      regularRate: 8.3,
      difference: 30.2,
      status: 'good'
    }
  ];

  const atRiskVIPs = [
    {
      name: 'Khalid Al-Suwaidi',
      tier: 'Platinum',
      totalSpent: 125000,
      daysSinceLastVisit: 45,
      churnProbability: 68,
      estimatedLoss: 125000,
      reason: 'No purchase in 45 days',
      actions: ['Personal call', 'Exclusive offer', 'Private event invite']
    },
    {
      name: 'Noura Al-Mazrouei',
      tier: 'Gold',
      totalSpent: 68000,
      daysSinceLastVisit: 32,
      churnProbability: 52,
      estimatedLoss: 68000,
      reason: 'Declining purchase frequency',
      actions: ['Email campaign', 'Special discount', 'Product recommendations']
    },
    {
      name: 'Hassan Al-Kaabi',
      tier: 'Gold',
      totalSpent: 58000,
      daysSinceLastVisit: 28,
      churnProbability: 45,
      estimatedLoss: 58000,
      reason: 'Reduced order values',
      actions: ['Survey feedback', 'Loyalty bonus', 'Personal outreach']
    }
  ];

  const vipInsights = [
    {
      insight: 'VIP Concentration',
      description: '5.5% of customers generate 45% of revenue',
      impact: 'critical',
      recommendation: 'Maintain exceptional service quality for VIPs'
    },
    {
      insight: 'Premium Product Preference',
      description: 'VIPs spend 6.2x more on premium products than regular customers',
      impact: 'high',
      recommendation: 'Expand premium product line and create VIP-exclusive items'
    },
    {
      insight: 'High Retention',
      description: '94.2% VIP retention rate vs 68% for regular customers',
      impact: 'high',
      recommendation: 'Study VIP retention strategies to apply to other segments'
    },
    {
      insight: 'Event Engagement',
      description: 'VIPs attend 82% of exclusive events',
      impact: 'medium',
      recommendation: 'Increase frequency of VIP-only events'
    },
    {
      insight: 'Referral Power',
      description: 'Each VIP refers average of 2.8 new customers annually',
      impact: 'medium',
      recommendation: 'Launch VIP referral rewards program'
    }
  ];

  const upcomingEngagement = [
    {
      event: 'VIP Ramadan Preview',
      date: 'Jan 15, 2025',
      invites: 156,
      confirmed: 98,
      expectedRevenue: 'AED 250K',
      type: 'exclusive_event'
    },
    {
      event: 'Diamond Tier Appreciation Dinner',
      date: 'Dec 20, 2024',
      invites: 18,
      confirmed: 16,
      expectedRevenue: 'AED 180K',
      type: 'exclusive_event'
    },
    {
      event: 'New Collection Launch',
      date: 'Nov 15, 2024',
      invites: 156,
      confirmed: 124,
      expectedRevenue: 'AED 320K',
      type: 'product_launch'
    },
    {
      event: 'Personalized Consultation Week',
      date: 'Nov 1-7, 2024',
      invites: 93,
      confirmed: 78,
      expectedRevenue: 'AED 150K',
      type: 'service'
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
            <Crown className="h-8 w-8 text-yellow-600" />
            VIP Customer Analytics
          </h1>
          <p className="text-muted-foreground">
            Deep insights into your most valuable customers
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Crown className="h-8 w-8 text-yellow-600 mb-2" />
            <div className="text-2xl font-bold">{vipSummary.totalVIPs}</div>
            <div className="text-sm text-gray-600">VIP Customers</div>
            <div className="text-xs text-gray-500 mt-1">{vipSummary.percentOfCustomers}% of total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">AED {(vipSummary.totalRevenue / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-gray-600">VIP Revenue</div>
            <div className="text-xs text-gray-500 mt-1">{vipSummary.revenueShare}% of total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Star className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-purple-600">AED {(vipSummary.avgLifetimeValue / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Avg Lifetime Value</div>
            <div className="text-xs text-gray-500 mt-1">{vipSummary.avgPurchaseFrequency}x purchases/year</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Heart className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold text-red-600">{vipSummary.retentionRate}%</div>
            <div className="text-sm text-gray-600">Retention Rate</div>
            <div className="text-xs text-gray-500 mt-1">{vipSummary.churnRisk} at risk</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tiers">VIP Tiers</TabsTrigger>
          <TabsTrigger value="customers">Top Customers</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="at-risk">At Risk</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>VIP Impact Analysis</CardTitle>
                <CardDescription>The power of your top customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Revenue Contribution</div>
                  <div className="text-3xl font-bold text-purple-600">{vipSummary.revenueShare}%</div>
                  <Progress value={vipSummary.revenueShare} className="h-2 mt-2" />
                  <div className="text-xs text-gray-600 mt-2">
                    From just {vipSummary.percentOfCustomers}% of customers
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <div className="text-xs text-gray-600">Avg Order Value</div>
                    <div className="text-xl font-bold text-green-600">AED 5,520</div>
                    <div className="text-xs text-gray-600">6.2x higher than regular</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-xs text-gray-600">Purchase Frequency</div>
                    <div className="text-xl font-bold text-blue-600">{vipSummary.avgPurchaseFrequency}x/year</div>
                    <div className="text-xs text-gray-600">vs 2.4x regular</div>
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-xs text-gray-600">Total Lifetime Value</div>
                  <div className="text-xl font-bold text-purple-600">
                    AED {(vipSummary.avgLifetimeValue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-600">Average per VIP customer</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Strategic findings about VIP customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vipInsights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-sm">{insight.insight}</div>
                        <Badge className={
                          insight.impact === 'critical' ? 'bg-red-600' :
                          insight.impact === 'high' ? 'bg-orange-600' :
                          'bg-blue-600'
                        }>
                          {insight.impact}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">{insight.description}</div>
                      <div className="text-xs bg-blue-50 border border-blue-200 rounded p-2">
                        💡 {insight.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tiers Tab */}
        <TabsContent value="tiers">
          <div className="space-y-4">
            {vipTiers.map((tier, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-lg ${tier.bgColor}`}>
                      <Crown className={`h-8 w-8 ${tier.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-2xl">{tier.tier} Tier</div>
                          <div className="text-sm text-gray-600">{tier.count} customers</div>
                        </div>
                        <Badge className="text-lg px-4 py-2 bg-green-100 text-green-800">
                          AED {(tier.revenue / 1000000).toFixed(2)}M Revenue
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Min Annual Spend</div>
                          <div className="text-lg font-bold">AED {(tier.minSpend / 1000).toFixed(0)}K</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Avg Lifetime Value</div>
                          <div className="text-lg font-bold text-purple-600">
                            AED {(tier.avgLTV / 1000).toFixed(0)}K
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Customers</div>
                          <div className="text-lg font-bold">{tier.count}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Benefits:</div>
                        <div className="flex flex-wrap gap-2">
                          {tier.benefits.map((benefit, idx) => (
                            <Badge key={idx} variant="outline">{benefit}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Top VIP Customers</CardTitle>
              <CardDescription>Your highest value customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topVIPCustomers.map((customer, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{customer.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={
                            customer.tier === 'Diamond' ? 'bg-purple-600' :
                            customer.tier === 'Platinum' ? 'bg-blue-600' :
                            'bg-amber-600'
                          }>
                            {customer.tier}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {customer.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">AED {customer.totalSpent.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Total Spent</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <div className="text-xs text-gray-600">Visits</div>
                        <div className="font-semibold">{customer.visits}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Avg Order</div>
                        <div className="font-semibold">AED {customer.avgOrder.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Last Visit</div>
                        <div className="font-semibold">{customer.lastVisit}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Favorite</div>
                        <div className="font-semibold text-purple-600">{customer.favoriteCategory}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Satisfaction</div>
                        <div className="font-semibold text-amber-600 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-500" />
                          {customer.satisfaction}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>VIP Purchase Preferences</CardTitle>
              <CardDescription>What VIP customers buy most</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchasePreferences.map((pref, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-lg">{pref.category}</div>
                      <Badge className="bg-purple-100 text-purple-800">
                        {pref.percentage}% of purchases
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Total Purchases</div>
                        <div className="text-lg font-bold">{pref.vipPurchases}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Avg Spend</div>
                        <div className="text-lg font-bold text-green-600">AED {pref.avgSpend.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Frequency</div>
                        <div className="text-lg font-bold text-blue-600">{pref.frequency}x/year</div>
                      </div>
                    </div>
                    <Progress value={pref.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>VIP Engagement Metrics</CardTitle>
              <CardDescription>VIP vs regular customer engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementMetrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-lg">{metric.metric}</div>
                      <Badge className={
                        metric.status === 'excellent' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {metric.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">VIP Rate</div>
                        <div className="text-2xl font-bold text-green-600">{metric.vipRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Regular Rate</div>
                        <div className="text-2xl font-bold text-gray-600">{metric.regularRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Difference</div>
                        <div className="text-2xl font-bold text-purple-600">+{metric.difference}%</div>
                      </div>
                    </div>
                    <Progress value={metric.vipRate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* At Risk Tab */}
        <TabsContent value="at-risk">
          <Card>
            <CardHeader>
              <CardTitle>VIPs At Risk</CardTitle>
              <CardDescription>High-value customers requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atRiskVIPs.map((vip, index) => (
                  <div key={index} className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{vip.name}</div>
                        <Badge className={
                          vip.tier === 'Platinum' ? 'bg-blue-600' : 'bg-amber-600'
                        }>
                          {vip.tier}
                        </Badge>
                      </div>
                      <Badge className="bg-red-600">
                        {vip.churnProbability}% churn risk
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Total Spent</div>
                        <div className="font-bold">AED {vip.totalSpent.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Days Inactive</div>
                        <div className="font-bold text-red-600">{vip.daysSinceLastVisit} days</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Potential Loss</div>
                        <div className="font-bold text-red-600">AED {(vip.estimatedLoss / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                    <div className="bg-white border border-red-200 rounded p-3 mb-3">
                      <div className="text-sm font-medium text-red-900 mb-1">Reason:</div>
                      <div className="text-sm text-red-700">{vip.reason}</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <div className="text-sm font-medium text-blue-900 mb-2">Retention Actions:</div>
                      <div className="flex flex-wrap gap-2">
                        {vip.actions.map((action, idx) => (
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

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming VIP Events</CardTitle>
              <CardDescription>Engagement opportunities for VIP customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEngagement.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{event.event}</div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 capitalize">
                        {event.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Invites Sent</div>
                        <div className="text-lg font-bold">{event.invites}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Confirmed</div>
                        <div className="text-lg font-bold text-green-600">{event.confirmed}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Response Rate</div>
                        <div className="text-lg font-bold text-blue-600">
                          {((event.confirmed / event.invites) * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Expected Revenue</div>
                        <div className="text-lg font-bold text-purple-600">{event.expectedRevenue}</div>
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
