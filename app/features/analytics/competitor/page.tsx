'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  DollarSign,
  Star,
  Package,
  RefreshCw,
  Search
} from 'lucide-react';

export default function CompetitorMonitoringPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const marketSummary = {
    trackedCompetitors: 8,
    trackedProducts: 156,
    avgPriceGap: 8.2,
    marketShare: 23.4,
    priceAlerts: 12,
    lastUpdate: '2 hours ago'
  };

  const competitors = [
    {
      name: 'Arabian Scents LLC',
      market: 'UAE',
      strength: 'high',
      marketShare: 28.5,
      priceStrategy: 'Premium',
      avgPrice: 450,
      productRange: 245,
      rating: 4.6,
      locations: 12
    },
    {
      name: 'Emirates Perfumes',
      market: 'UAE',
      strength: 'high',
      marketShare: 25.2,
      priceStrategy: 'Competitive',
      avgPrice: 380,
      productRange: 189,
      rating: 4.4,
      locations: 9
    },
    {
      name: 'Dubai Fragrances',
      market: 'UAE',
      strength: 'medium',
      marketShare: 18.7,
      priceStrategy: 'Mid-range',
      avgPrice: 320,
      productRange: 156,
      rating: 4.2,
      locations: 7
    },
    {
      name: 'Desert Oud Palace',
      market: 'UAE',
      strength: 'medium',
      marketShare: 15.8,
      priceStrategy: 'Budget',
      avgPrice: 280,
      productRange: 134,
      rating: 4.0,
      locations: 6
    },
    {
      name: 'Royal Essence',
      market: 'UAE',
      strength: 'low',
      marketShare: 8.3,
      priceStrategy: 'Premium',
      avgPrice: 420,
      productRange: 98,
      rating: 4.5,
      locations: 4
    }
  ];

  const priceComparisons = [
    {
      product: 'Royal Oud Premium',
      yourPrice: 425,
      competitor: 'Arabian Scents LLC',
      theirPrice: 450,
      difference: -25,
      percentDiff: -5.6,
      status: 'advantage',
      lastChecked: '2 hours ago'
    },
    {
      product: 'Arabian Nights',
      yourPrice: 305,
      competitor: 'Emirates Perfumes',
      theirPrice: 285,
      difference: 20,
      percentDiff: 7.0,
      status: 'disadvantage',
      lastChecked: '3 hours ago'
    },
    {
      product: 'Desert Rose',
      yourPrice: 277,
      competitor: 'Dubai Fragrances',
      theirPrice: 270,
      difference: 7,
      percentDiff: 2.6,
      status: 'neutral',
      lastChecked: '1 hour ago'
    },
    {
      product: 'Sandalwood Essence',
      yourPrice: 244,
      competitor: 'Desert Oud Palace',
      theirPrice: 260,
      difference: -16,
      percentDiff: -6.2,
      status: 'advantage',
      lastChecked: '4 hours ago'
    },
    {
      product: 'Amber Collection',
      yourPrice: 291,
      competitor: 'Royal Essence',
      theirPrice: 315,
      difference: -24,
      percentDiff: -7.6,
      status: 'advantage',
      lastChecked: '2 hours ago'
    },
    {
      product: 'Musk Al Tahara',
      yourPrice: 185,
      competitor: 'Emirates Perfumes',
      theirPrice: 165,
      difference: 20,
      percentDiff: 12.1,
      status: 'disadvantage',
      lastChecked: '5 hours ago'
    }
  ];

  const priceAlerts = [
    {
      type: 'price_drop',
      severity: 'high',
      product: 'Arabian Nights',
      competitor: 'Emirates Perfumes',
      oldPrice: 305,
      newPrice: 285,
      change: -20,
      date: '2 hours ago',
      recommendation: 'Consider matching or adjusting your price'
    },
    {
      type: 'new_product',
      severity: 'medium',
      product: 'Luxury Oud Collection',
      competitor: 'Arabian Scents LLC',
      price: 580,
      date: '1 day ago',
      recommendation: 'Evaluate if you should add a similar product line'
    },
    {
      type: 'promotion',
      severity: 'high',
      product: 'Gift Sets',
      competitor: 'Dubai Fragrances',
      discount: '25% off',
      date: '3 hours ago',
      recommendation: 'Monitor impact and consider counter-promotion'
    },
    {
      type: 'stock_out',
      severity: 'low',
      product: 'Desert Rose',
      competitor: 'Desert Oud Palace',
      date: '1 day ago',
      recommendation: 'Opportunity to capture market share'
    }
  ];

  const marketTrends = [
    {
      trend: 'Premium Pricing Increase',
      impact: 'high',
      description: 'Competitors raising prices on premium Oud products by 8-12%',
      opportunity: 'Maintain current pricing for competitive advantage',
      competitors: 3
    },
    {
      trend: 'Gift Set Promotions',
      impact: 'high',
      description: 'Heavy discounting on gift sets ahead of Ramadan',
      opportunity: 'Launch targeted gift set campaign',
      competitors: 4
    },
    {
      trend: 'Online Sales Push',
      impact: 'medium',
      description: 'Competitors investing in e-commerce and online marketing',
      opportunity: 'Accelerate your digital transformation',
      competitors: 5
    },
    {
      trend: 'Loyalty Programs',
      impact: 'medium',
      description: 'Introduction of enhanced loyalty and rewards programs',
      opportunity: 'Upgrade your loyalty program features',
      competitors: 3
    },
    {
      trend: 'Sustainable Sourcing',
      impact: 'low',
      description: 'Marketing focus on sustainable and ethical sourcing',
      opportunity: 'Highlight your sustainable practices',
      competitors: 2
    }
  ];

  const strengthsWeaknesses = [
    {
      competitor: 'Arabian Scents LLC',
      strengths: ['Strong brand recognition', 'Wide product range', 'Premium locations', 'Excellent customer service'],
      weaknesses: ['Higher prices', 'Limited online presence', 'Slow to innovate'],
      yourAdvantage: ['Better pricing', 'Faster product launches', 'Modern technology']
    },
    {
      competitor: 'Emirates Perfumes',
      strengths: ['Competitive pricing', 'Good distribution', 'Strong marketing', 'Customer loyalty'],
      weaknesses: ['Limited premium products', 'Aging store designs', 'Product quality inconsistent'],
      yourAdvantage: ['Premium quality', 'Modern stores', 'Better product consistency']
    },
    {
      competitor: 'Dubai Fragrances',
      strengths: ['Budget-friendly', 'Good value', 'Frequent promotions', 'High volume sales'],
      weaknesses: ['Lower quality perception', 'Limited premium market', 'Thin margins'],
      yourAdvantage: ['Premium positioning', 'Higher margins', 'Better brand image']
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
            <Target className="h-8 w-8 text-red-600" />
            Competitor Monitoring
          </h1>
          <p className="text-muted-foreground">
            Track market prices and competitor strategies in real-time
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-6">
            <Eye className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{marketSummary.trackedCompetitors}</div>
            <div className="text-sm text-gray-600">Competitors</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Package className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{marketSummary.trackedProducts}</div>
            <div className="text-sm text-gray-600">Products</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">+{marketSummary.avgPriceGap}%</div>
            <div className="text-sm text-gray-600">Price Advantage</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Target className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{marketSummary.marketShare}%</div>
            <div className="text-sm text-gray-600">Market Share</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{marketSummary.priceAlerts}</div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <RefreshCw className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-sm">{marketSummary.lastUpdate}</div>
            <div className="text-sm text-gray-600">Last Update</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="prices">Price Comparison</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Position</CardTitle>
                <CardDescription>Your standing in the competitive landscape</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitors.slice(0, 5).map((comp, index) => {
                    const isYou = index === 2; // Positioning "You" in the middle
                    return (
                      <div key={index} className={`border rounded-lg p-3 ${isYou ? 'bg-blue-50 border-blue-300' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{isYou ? 'Your Business' : comp.name}</div>
                            {isYou && <Badge className="bg-blue-600">You</Badge>}
                          </div>
                          <Badge variant="outline">{comp.marketShare}%</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Strategy: </span>
                            <span className="font-semibold">{comp.priceStrategy}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Price: </span>
                            <span className="font-semibold">AED {comp.avgPrice}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Rating: </span>
                            <span className="font-semibold flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              {comp.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Important competitive intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {priceAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                        alert.severity === 'high' ? 'text-red-600' :
                        alert.severity === 'medium' ? 'text-amber-600' :
                        'text-gray-600'
                      }`} />
                      <div className="flex-1">
                        <div className="font-semibold">{alert.product}</div>
                        <div className="text-sm text-gray-600 mt-1">{alert.recommendation}</div>
                        <div className="text-xs text-gray-500 mt-1">{alert.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Profiles</CardTitle>
              <CardDescription>Detailed information about your competitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitors.map((comp, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{comp.name}</h3>
                        <p className="text-sm text-gray-600">{comp.market}</p>
                      </div>
                      <Badge className={
                        comp.strength === 'high' ? 'bg-red-100 text-red-800' :
                        comp.strength === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {comp.strength} threat
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Market Share</div>
                        <div className="text-lg font-bold text-blue-600">{comp.marketShare}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Avg Price</div>
                        <div className="text-lg font-bold">AED {comp.avgPrice}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Products</div>
                        <div className="text-lg font-bold">{comp.productRange}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Locations</div>
                        <div className="text-lg font-bold">{comp.locations}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="font-semibold">{comp.rating} Rating</span>
                        </div>
                        <Badge variant="outline">{comp.priceStrategy} Pricing</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prices Tab */}
        <TabsContent value="prices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Price Comparisons</CardTitle>
                  <CardDescription>Side-by-side pricing analysis</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {priceComparisons.map((comp, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">{comp.product}</div>
                      <Badge className={
                        comp.status === 'advantage' ? 'bg-green-100 text-green-800' :
                        comp.status === 'disadvantage' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {comp.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <div className="text-xs text-gray-600">Your Price</div>
                        <div className="text-lg font-bold text-blue-600">AED {comp.yourPrice}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Their Price</div>
                        <div className="text-lg font-bold">AED {comp.theirPrice}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Difference</div>
                        <div className={`text-lg font-bold flex items-center gap-1 ${
                          comp.difference < 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {comp.difference < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                          AED {Math.abs(comp.difference)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Percent Diff</div>
                        <div className={`text-lg font-bold ${
                          comp.percentDiff < 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {comp.percentDiff > 0 ? '+' : ''}{comp.percentDiff}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Competitor</div>
                        <div className="text-sm font-semibold truncate">{comp.competitor}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Last checked: {comp.lastChecked}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Price & Market Alerts</CardTitle>
              <CardDescription>Real-time notifications about competitive moves</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priceAlerts.map((alert, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        alert.severity === 'high' ? 'bg-red-100' :
                        alert.severity === 'medium' ? 'bg-amber-100' :
                        'bg-blue-100'
                      }`}>
                        <AlertTriangle className={`h-6 w-6 ${
                          alert.severity === 'high' ? 'text-red-600' :
                          alert.severity === 'medium' ? 'text-amber-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-lg">{alert.product}</div>
                          <Badge className={
                            alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {alert.severity} priority
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">{alert.competitor}</span> - {alert.type.replace('_', ' ')}
                        </div>
                        {alert.type === 'price_drop' && (
                          <div className="text-sm mb-2">
                            <span className="text-gray-600">Price changed from </span>
                            <span className="font-semibold line-through">AED {alert.oldPrice}</span>
                            <span className="text-gray-600"> to </span>
                            <span className="font-bold text-red-600">AED {alert.newPrice}</span>
                            <span className="text-red-600 font-semibold"> ({alert.change})</span>
                          </div>
                        )}
                        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm mt-2">
                          <span className="font-medium">Recommendation: </span>
                          {alert.recommendation}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">{alert.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
              <CardDescription>Emerging patterns in the competitive landscape</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketTrends.map((trend, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{trend.trend}</h3>
                        <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
                      </div>
                      <Badge className={
                        trend.impact === 'high' ? 'bg-red-100 text-red-800' :
                        trend.impact === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {trend.impact} impact
                      </Badge>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
                      <div className="text-sm font-medium text-green-900 mb-1">Opportunity</div>
                      <div className="text-sm text-green-700">{trend.opportunity}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {trend.competitors} competitor{trend.competitors > 1 ? 's' : ''} following this trend
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SWOT Tab */}
        <TabsContent value="swot">
          <Card>
            <CardHeader>
              <CardTitle>Competitive SWOT Analysis</CardTitle>
              <CardDescription>Strengths, weaknesses, and your advantages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {strengthsWeaknesses.map((analysis, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-4">{analysis.competitor}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="font-medium text-green-700 mb-2">Their Strengths</div>
                        <ul className="space-y-1">
                          {analysis.strengths.map((strength, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium text-red-700 mb-2">Their Weaknesses</div>
                        <ul className="space-y-1">
                          {analysis.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-red-600 mt-1">•</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium text-blue-700 mb-2">Your Advantages</div>
                        <ul className="space-y-1">
                          {analysis.yourAdvantage.map((advantage, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              {advantage}
                            </li>
                          ))}
                        </ul>
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
