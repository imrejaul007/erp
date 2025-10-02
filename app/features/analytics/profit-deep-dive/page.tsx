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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Target,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Minus
} from 'lucide-react';

export default function ProfitDeepDivePage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const profitSummary = {
    totalRevenue: 4325000,
    totalCosts: 2463500,
    grossProfit: 1861500,
    grossMargin: 43.1,
    operatingExpenses: 562000,
    netProfit: 1299500,
    netMargin: 30.0,
    trend: 15.3
  };

  const productProfitability = [
    {
      product: 'Royal Oud Premium',
      revenue: 845000,
      cost: 380250,
      profit: 464750,
      margin: 55.0,
      units: 1250,
      profitPerUnit: 372,
      status: 'high',
      trend: 'up'
    },
    {
      product: 'Arabian Nights',
      revenue: 625000,
      cost: 343750,
      profit: 281250,
      margin: 45.0,
      units: 2050,
      profitPerUnit: 137,
      status: 'high',
      trend: 'up'
    },
    {
      product: 'Desert Rose',
      revenue: 485000,
      cost: 315250,
      profit: 169750,
      margin: 35.0,
      units: 1750,
      profitPerUnit: 97,
      status: 'medium',
      trend: 'stable'
    },
    {
      product: 'Sandalwood Essence',
      revenue: 385000,
      cost: 250250,
      profit: 134750,
      margin: 35.0,
      units: 1580,
      profitPerUnit: 85,
      status: 'medium',
      trend: 'down'
    },
    {
      product: 'Amber Collection',
      revenue: 285000,
      cost: 199500,
      profit: 85500,
      margin: 30.0,
      units: 980,
      profitPerUnit: 87,
      status: 'medium',
      trend: 'stable'
    },
    {
      product: 'Basic Incense',
      revenue: 145000,
      cost: 116000,
      profit: 29000,
      margin: 20.0,
      units: 3450,
      profitPerUnit: 8,
      status: 'low',
      trend: 'down'
    }
  ];

  const categoryProfitability = [
    { category: 'Oud Oil', revenue: 1850000, cost: 925000, profit: 925000, margin: 50.0, contribution: 49.7 },
    { category: 'Perfumes', revenue: 1285000, cost: 770800, profit: 514200, margin: 40.0, contribution: 27.6 },
    { category: 'Gift Sets', revenue: 685000, cost: 445250, profit: 239750, margin: 35.0, contribution: 12.9 },
    { category: 'Incense', revenue: 345000, cost: 241500, profit: 103500, margin: 30.0, contribution: 5.6 },
    { category: 'Accessories', revenue: 160000, cost: 80800, profit: 79200, margin: 49.5, contribution: 4.3 }
  ];

  const locationProfitability = [
    {
      location: 'Dubai Mall',
      revenue: 1845000,
      costs: 1014750,
      profit: 830250,
      margin: 45.0,
      rentCost: 185000,
      staffCost: 95000,
      utilities: 25000
    },
    {
      location: 'Mall of Emirates',
      revenue: 1285000,
      costs: 770800,
      profit: 514200,
      margin: 40.0,
      rentCost: 145000,
      staffCost: 75000,
      utilities: 18000
    },
    {
      location: 'Ibn Battuta',
      revenue: 725000,
      costs: 507500,
      profit: 217500,
      margin: 30.0,
      rentCost: 85000,
      staffCost: 55000,
      utilities: 12000
    },
    {
      location: 'City Centre Deira',
      revenue: 470000,
      costs: 329000,
      profit: 141000,
      margin: 30.0,
      rentCost: 65000,
      staffCost: 45000,
      utilities: 10000
    }
  ];

  const costBreakdown = [
    { category: 'Raw Materials', amount: 1235000, percentage: 50.1, perUnit: 42.5, trend: 'up' },
    { category: 'Manufacturing', amount: 492000, percentage: 20.0, perUnit: 16.9, trend: 'stable' },
    { category: 'Labor', amount: 369000, percentage: 15.0, perUnit: 12.7, trend: 'up' },
    { category: 'Packaging', amount: 196800, percentage: 8.0, perUnit: 6.8, trend: 'stable' },
    { category: 'Shipping', amount: 147600, percentage: 6.0, perUnit: 5.1, trend: 'down' },
    { category: 'Other', amount: 23100, percentage: 0.9, perUnit: 0.8, trend: 'stable' }
  ];

  const profitDrivers = [
    {
      driver: 'Premium Product Mix',
      impact: '+12.5%',
      description: 'Higher sales of premium products increased overall margin',
      type: 'positive'
    },
    {
      driver: 'Bulk Purchasing',
      impact: '+8.2%',
      description: 'Reduced raw material costs through volume discounts',
      type: 'positive'
    },
    {
      driver: 'Process Efficiency',
      impact: '+5.8%',
      description: 'Improved manufacturing efficiency reduced waste',
      type: 'positive'
    },
    {
      driver: 'Seasonal Pricing',
      impact: '+4.5%',
      description: 'Premium pricing during peak seasons',
      type: 'positive'
    },
    {
      driver: 'Shipping Costs',
      impact: '-3.2%',
      description: 'Increased shipping costs due to fuel prices',
      type: 'negative'
    },
    {
      driver: 'Rent Increases',
      impact: '-2.8%',
      description: 'Higher rent at premium locations',
      type: 'negative'
    }
  ];

  const profitOpportunities = [
    {
      opportunity: 'Optimize Product Mix',
      potential: 'AED 185K',
      effort: 'Medium',
      priority: 'High',
      description: 'Focus on high-margin products, reduce low-margin items'
    },
    {
      opportunity: 'Reduce Material Waste',
      potential: 'AED 125K',
      effort: 'Low',
      priority: 'High',
      description: 'Improve production processes to minimize waste'
    },
    {
      opportunity: 'Renegotiate Supplier Contracts',
      potential: 'AED 95K',
      effort: 'High',
      priority: 'Medium',
      description: 'Better pricing through long-term contracts'
    },
    {
      opportunity: 'Energy Efficiency',
      potential: 'AED 45K',
      effort: 'Low',
      priority: 'Medium',
      description: 'Reduce utility costs through efficiency measures'
    },
    {
      opportunity: 'Staff Optimization',
      potential: 'AED 75K',
      effort: 'Medium',
      priority: 'Low',
      description: 'Better scheduling to reduce overtime costs'
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
            <PieChart className="h-8 w-8 text-green-600" />
            Profit Deep Dive Analysis
          </h1>
          <p className="text-muted-foreground">
            Comprehensive profitability analysis at product, category, and location levels
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-blue-600">
              AED {(profitSummary.totalRevenue / 1000000).toFixed(2)}M
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-green-600" />
              <Badge className="bg-green-100 text-green-800">{profitSummary.grossMargin}%</Badge>
            </div>
            <div className="text-sm text-gray-600 mb-1">Gross Profit</div>
            <div className="text-2xl font-bold text-green-600">
              AED {(profitSummary.grossProfit / 1000000).toFixed(2)}M
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-800">{profitSummary.netMargin}%</Badge>
            </div>
            <div className="text-sm text-gray-600 mb-1">Net Profit</div>
            <div className="text-2xl font-bold text-purple-600">
              AED {(profitSummary.netProfit / 1000000).toFixed(2)}M
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-amber-600" />
              <Badge className="bg-green-100 text-green-800">+{profitSummary.trend}%</Badge>
            </div>
            <div className="text-sm text-gray-600 mb-1">Growth</div>
            <div className="text-2xl font-bold text-amber-600">
              vs Last Period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">By Product</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="locations">By Location</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profit Waterfall</CardTitle>
                <CardDescription>From revenue to net profit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Total Revenue</span>
                    <span className="font-bold text-blue-600">AED {(profitSummary.totalRevenue / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <div className="border-b pb-3">
                  <div className="flex justify-between mb-1 text-red-600">
                    <span>Less: Cost of Goods</span>
                    <span>-AED {(profitSummary.totalCosts / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <div className="border-b pb-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Gross Profit</span>
                    <span className="font-bold text-green-600">
                      AED {(profitSummary.grossProfit / 1000).toFixed(0)}K ({profitSummary.grossMargin}%)
                    </span>
                  </div>
                </div>
                <div className="border-b pb-3">
                  <div className="flex justify-between mb-1 text-red-600">
                    <span>Less: Operating Expenses</span>
                    <span>-AED {(profitSummary.operatingExpenses / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Net Profit</span>
                    <span className="font-bold text-purple-600">
                      AED {(profitSummary.netProfit / 1000).toFixed(0)}K ({profitSummary.netMargin}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Profit Drivers</CardTitle>
                <CardDescription>Factors affecting profitability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {profitDrivers.map((driver, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {driver.type === 'positive' ? (
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{driver.driver}</span>
                        <span className={`font-bold ${
                          driver.type === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {driver.impact}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{driver.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product-Level Profitability</CardTitle>
              <CardDescription>Detailed profit analysis by product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productProfitability.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{product.product}</h3>
                        <p className="text-sm text-gray-600">{product.units} units sold</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={
                          product.status === 'high' ? 'bg-green-100 text-green-800' :
                          product.status === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {product.margin}% Margin
                        </Badge>
                        {product.trend === 'up' && <TrendingUp className="h-5 w-5 text-green-600" />}
                        {product.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-600" />}
                        {product.trend === 'stable' && <Minus className="h-5 w-5 text-gray-600" />}
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-600">Revenue</div>
                        <div className="font-bold text-blue-600">AED {(product.revenue / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Cost</div>
                        <div className="font-semibold text-red-600">AED {(product.cost / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Profit</div>
                        <div className="font-bold text-green-600">AED {(product.profit / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Per Unit</div>
                        <div className="font-semibold">AED {product.profitPerUnit}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Margin</div>
                        <div className="font-bold text-purple-600">{product.margin}%</div>
                      </div>
                    </div>
                    <Progress value={product.margin} className="h-2" />
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
              <CardTitle>Category Profitability</CardTitle>
              <CardDescription>Performance by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryProfitability.map((cat, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-lg">{cat.category}</div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {cat.contribution}% of Total Profit
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Revenue</div>
                        <div className="text-lg font-bold text-blue-600">
                          AED {(cat.revenue / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Cost</div>
                        <div className="text-lg font-semibold text-red-600">
                          AED {(cat.cost / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Profit</div>
                        <div className="text-lg font-bold text-green-600">
                          AED {(cat.profit / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Margin</div>
                        <div className="text-lg font-bold text-purple-600">{cat.margin}%</div>
                      </div>
                    </div>
                    <Progress value={cat.margin} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Location Profitability</CardTitle>
              <CardDescription>Performance and costs by store location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationProfitability.map((loc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-lg">{loc.location}</div>
                      <Badge className="bg-green-100 text-green-800">{loc.margin}% Margin</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Revenue</div>
                        <div className="text-lg font-bold text-blue-600">
                          AED {(loc.revenue / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Costs</div>
                        <div className="text-lg font-semibold text-red-600">
                          AED {(loc.costs / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Profit</div>
                        <div className="text-lg font-bold text-green-600">
                          AED {(loc.profit / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                      <div className="text-sm">
                        <span className="text-gray-600">Rent: </span>
                        <span className="font-semibold">AED {(loc.rentCost / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Staff: </span>
                        <span className="font-semibold">AED {(loc.staffCost / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Utilities: </span>
                        <span className="font-semibold">AED {(loc.utilities / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown Analysis</CardTitle>
              <CardDescription>Detailed breakdown of cost components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costBreakdown.map((cost, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{cost.category}</div>
                        <div className="text-sm text-gray-600">AED {cost.perUnit} per unit</div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline">{cost.percentage}% of Total</Badge>
                        {cost.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-600" />}
                        {cost.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-600" />}
                        {cost.trend === 'stable' && <Minus className="h-4 w-4 text-gray-600" />}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Total Cost</span>
                        <span className="font-bold">AED {(cost.amount / 1000).toFixed(0)}K</span>
                      </div>
                      <Progress value={cost.percentage} className="h-2" />
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
              <CardTitle>Profit Improvement Opportunities</CardTitle>
              <CardDescription>Actionable recommendations to increase profitability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profitOpportunities.map((opp, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{opp.opportunity}</h3>
                        <p className="text-sm text-gray-600 mt-1">{opp.description}</p>
                      </div>
                      <Badge className={
                        opp.priority === 'High' ? 'bg-red-100 text-red-800' :
                        opp.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {opp.priority} Priority
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                      <div>
                        <div className="text-sm text-gray-600">Potential Gain</div>
                        <div className="text-lg font-bold text-green-600">{opp.potential}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Effort Required</div>
                        <div className="text-lg font-semibold">{opp.effort}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Priority</div>
                        <div className="text-lg font-semibold">{opp.priority}</div>
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
