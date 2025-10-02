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
  Users,
  ShoppingCart,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  Heart,
  Target,
  Star,
  Gift,
  MapPin
} from 'lucide-react';

export default function CustomerBehaviorPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const behaviorSummary = {
    totalCustomers: 2847,
    activeCustomers: 1923,
    repeatRate: 68.2,
    avgLifetimeValue: 12450,
    avgPurchaseFrequency: 3.4,
    churnRate: 12.3
  };

  const purchasePatterns = [
    {
      pattern: 'Evening Shoppers',
      percentage: 45,
      description: 'Peak purchases between 6 PM - 9 PM',
      avgSpend: 3850,
      count: 1281,
      color: 'bg-blue-600'
    },
    {
      pattern: 'Weekend Buyers',
      percentage: 32,
      description: 'Prefer Friday-Saturday shopping',
      avgSpend: 4200,
      count: 911,
      color: 'bg-purple-600'
    },
    {
      pattern: 'Premium Seekers',
      percentage: 18,
      description: 'Always purchase high-end products',
      avgSpend: 8500,
      count: 512,
      color: 'bg-amber-600'
    },
    {
      pattern: 'Bulk Buyers',
      percentage: 15,
      description: 'Buy multiple items per transaction',
      avgSpend: 5200,
      count: 427,
      color: 'bg-green-600'
    }
  ];

  const seasonalTrends = [
    { season: 'Ramadan', sales: 340, revenue: 1850000, growth: 45.2, icon: Calendar },
    { season: 'Eid Al-Fitr', sales: 285, revenue: 1620000, growth: 38.5, icon: Gift },
    { season: 'National Day', sales: 165, revenue: 920000, growth: 22.1, icon: Star },
    { season: 'New Year', sales: 142, revenue: 780000, growth: 18.8, icon: TrendingUp },
    { season: 'Regular', sales: 95, revenue: 520000, growth: 0, icon: ShoppingCart }
  ];

  const preferenceCategories = [
    { category: 'Oud Oil', buyers: 1245, percentage: 43.7, avgSpend: 4850, loyalty: 85 },
    { category: 'Perfumes', buyers: 1023, percentage: 35.9, avgSpend: 3200, loyalty: 72 },
    { category: 'Gift Sets', buyers: 687, percentage: 24.1, avgSpend: 5400, loyalty: 68 },
    { category: 'Incense', buyers: 512, percentage: 18.0, avgSpend: 950, loyalty: 61 },
    { category: 'Accessories', buyers: 389, percentage: 13.7, avgSpend: 1200, loyalty: 55 }
  ];

  const locationPreferences = [
    { location: 'Dubai Mall', visits: 8450, revenue: 4250000, avgTransaction: 3420, peakDay: 'Friday' },
    { location: 'Mall of Emirates', visits: 6820, revenue: 3180000, avgTransaction: 2950, peakDay: 'Saturday' },
    { location: 'Ibn Battuta', visits: 4250, revenue: 1920000, avgTransaction: 2680, peakDay: 'Friday' },
    { location: 'City Centre Deira', visits: 3890, revenue: 1650000, avgTransaction: 2420, peakDay: 'Thursday' }
  ];

  const customerSegments = [
    {
      segment: 'VIP Elite',
      count: 156,
      percentage: 5.5,
      revenue: 1950000,
      revenueShare: 45,
      avgSpend: 12500,
      frequency: 8.2,
      characteristics: ['High spenders', 'Frequent buyers', 'Brand loyal', 'Prefer premium']
    },
    {
      segment: 'Regular Loyal',
      count: 684,
      percentage: 24.0,
      revenue: 1420000,
      revenueShare: 33,
      avgSpend: 2076,
      frequency: 4.5,
      characteristics: ['Consistent buyers', 'Good retention', 'Moderate spend', 'Seasonal purchases']
    },
    {
      segment: 'Occasional',
      count: 1083,
      percentage: 38.0,
      revenue: 680000,
      revenueShare: 16,
      avgSpend: 628,
      frequency: 2.1,
      characteristics: ['Infrequent buyers', 'Price sensitive', 'Special occasions', 'Gift buyers']
    },
    {
      segment: 'New Customers',
      count: 924,
      percentage: 32.5,
      revenue: 270000,
      revenueShare: 6,
      avgSpend: 292,
      frequency: 1.2,
      characteristics: ['First-time buyers', 'Trial purchases', 'Testing products', 'Need nurturing']
    }
  ];

  const engagementMetrics = [
    { metric: 'Loyalty Program', enrolled: 1847, rate: 64.9, engagement: 82 },
    { metric: 'Email Marketing', subscribers: 2156, rate: 75.8, engagement: 45 },
    { metric: 'SMS Campaigns', opted: 1523, rate: 53.5, engagement: 68 },
    { metric: 'Social Media', followers: 3420, rate: 120.1, engagement: 38 },
    { metric: 'WhatsApp', connected: 1689, rate: 59.3, engagement: 71 }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-purple-600" />
            Customer Behavior Analytics
          </h1>
          <p className="text-muted-foreground">
            Deep insights into purchase patterns, preferences, and seasonal trends
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{behaviorSummary.totalCustomers?.toLocaleString() || "0"}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Heart className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{behaviorSummary.activeCustomers?.toLocaleString() || "0"}</div>
            <div className="text-sm text-gray-600">Active Customers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{behaviorSummary.repeatRate}%</div>
            <div className="text-sm text-gray-600">Repeat Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">AED {(behaviorSummary.avgLifetimeValue / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Avg LTV</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{behaviorSummary.avgPurchaseFrequency.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Frequency</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Target className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{behaviorSummary.churnRate}%</div>
            <div className="text-sm text-gray-600">Churn Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Purchase Patterns</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Trends</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Purchase Patterns</CardTitle>
                <CardDescription>How customers prefer to shop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {purchasePatterns.map((pattern, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold">{pattern.pattern}</div>
                        <div className="text-sm text-gray-600">{pattern.description}</div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{pattern.percentage}%</Badge>
                    </div>
                    <Progress value={pattern.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>{pattern.count} customers</span>
                      <span>Avg: AED {pattern.avgSpend?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Distribution by customer value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{segment.segment}</div>
                      <Badge variant="outline">{segment.count} customers</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-gray-600">Revenue Share: </span>
                        <span className="font-semibold text-green-600">{segment.revenueShare}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Spend: </span>
                        <span className="font-semibold">AED {segment.avgSpend?.toLocaleString() || "0"}</span>
                      </div>
                    </div>
                    <Progress value={segment.revenueShare} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Patterns Tab */}
        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Purchase Patterns</CardTitle>
              <CardDescription>In-depth analysis of customer shopping behaviors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {purchasePatterns.map((pattern, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{pattern.pattern}</h3>
                        <p className="text-sm text-gray-600 mt-1">{pattern.description}</p>
                      </div>
                      <Badge className="bg-blue-600">{pattern.percentage}%</Badge>
                    </div>
                    <div className={`h-2 rounded-full mb-4 ${pattern.color}`} style={{ width: `${pattern.percentage}%` }}></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Customers</div>
                        <div className="text-xl font-bold">{pattern.count}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Avg Spend</div>
                        <div className="text-xl font-bold text-green-600">AED {pattern.avgSpend?.toLocaleString() || "0"}</div>
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
              <CardTitle>Seasonal Trends</CardTitle>
              <CardDescription>Sales performance during special occasions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seasonalTrends.map((trend, index) => {
                  const Icon = trend.icon;
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <Icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-lg">{trend.season}</div>
                            {trend.growth > 0 && (
                              <Badge className="bg-green-100 text-green-800">
                                +{trend.growth}% Growth
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-gray-600">Sales</div>
                              <div className="text-lg font-bold">{trend.sales}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Revenue</div>
                              <div className="text-lg font-bold text-green-600">
                                AED {(trend.revenue / 1000).toFixed(0)}K
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">vs Regular</div>
                              <div className="text-lg font-bold text-blue-600">
                                {trend.growth > 0 ? `+${trend.growth}%` : 'Baseline'}
                              </div>
                            </div>
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

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Preferences</CardTitle>
                <CardDescription>What customers love to buy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {preferenceCategories.map((pref, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{pref.category}</div>
                      <Badge variant="outline">{pref.buyers} buyers</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                      <div>
                        <div className="text-xs text-gray-600">Market Share</div>
                        <div className="font-semibold">{pref.percentage}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Avg Spend</div>
                        <div className="font-semibold">AED {pref.avgSpend?.toLocaleString() || "0"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Loyalty</div>
                        <div className="font-semibold text-green-600">{pref.loyalty}%</div>
                      </div>
                    </div>
                    <Progress value={pref.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Preferences</CardTitle>
                <CardDescription>Performance by store location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {locationPreferences.map((loc, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div className="font-semibold">{loc.location}</div>
                      <Badge className="ml-auto bg-purple-100 text-purple-800">
                        Peak: {loc.peakDay}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-xs text-gray-600">Visits</div>
                        <div className="font-semibold">{loc.visits?.toLocaleString() || "0"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Revenue</div>
                        <div className="font-semibold text-green-600">
                          AED {(loc.revenue / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Avg Transaction</div>
                        <div className="font-semibold">AED {loc.avgTransaction?.toLocaleString() || "0"}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segmentation Analysis</CardTitle>
              <CardDescription>Detailed breakdown of customer segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{segment.segment}</h3>
                        <p className="text-sm text-gray-600">
                          {segment.count} customers ({segment.percentage}% of total)
                        </p>
                      </div>
                      <Badge className="text-lg px-4 py-2 bg-blue-600">
                        {segment.revenueShare}% Revenue
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600">Total Revenue</div>
                        <div className="text-xl font-bold text-green-600">
                          AED {(segment.revenue / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Avg Spend</div>
                        <div className="text-xl font-bold">
                          AED {segment.avgSpend?.toLocaleString() || "0"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Purchase Frequency</div>
                        <div className="text-xl font-bold text-purple-600">
                          {segment.frequency}x
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Customers</div>
                        <div className="text-xl font-bold">{segment.count}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Key Characteristics:</div>
                      <div className="flex flex-wrap gap-2">
                        {segment.characteristics.map((char, idx) => (
                          <Badge key={idx} variant="outline">{char}</Badge>
                        ))}
                      </div>
                    </div>
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
              <CardTitle>Customer Engagement Metrics</CardTitle>
              <CardDescription>How customers interact with your channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementMetrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-lg">{metric.metric}</div>
                      <Badge className="bg-purple-100 text-purple-800">
                        {metric.engagement}% Engagement
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-xl font-bold">{metric.enrolled?.toLocaleString() || "0"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Penetration Rate</div>
                        <div className="text-xl font-bold text-blue-600">{metric.rate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Engagement</div>
                        <div className="text-xl font-bold text-green-600">{metric.engagement}%</div>
                      </div>
                    </div>
                    <Progress value={metric.engagement} className="h-2" />
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
