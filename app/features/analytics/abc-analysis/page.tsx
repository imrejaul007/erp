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
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Target,
  DollarSign,
  BarChart3
} from 'lucide-react';

export default function ABCAnalysisPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const summary = {
    totalItems: 287,
    totalValue: 4325000,
    aItems: { count: 57, percentage: 20, value: 3460000, valuePercentage: 80 },
    bItems: { count: 86, percentage: 30, value: 649500, valuePercentage: 15 },
    cItems: { count: 144, percentage: 50, value: 216250, valuePercentage: 5 }
  };

  const aItems = [
    {
      product: 'Royal Oud Premium',
      sku: 'OUD-001',
      category: 'Oud Oil',
      annualValue: 845000,
      units: 1250,
      unitPrice: 676,
      contribution: 19.5,
      turnover: 8.2,
      status: 'optimal'
    },
    {
      product: 'Arabian Nights',
      sku: 'PERF-002',
      category: 'Perfumes',
      annualValue: 625000,
      units: 2050,
      unitPrice: 305,
      contribution: 14.5,
      turnover: 12.1,
      status: 'optimal'
    },
    {
      product: 'Desert Rose',
      sku: 'PERF-005',
      category: 'Perfumes',
      annualValue: 485000,
      units: 1750,
      unitPrice: 277,
      contribution: 11.2,
      turnover: 9.8,
      status: 'optimal'
    },
    {
      product: 'Sandalwood Essence',
      sku: 'OUD-008',
      category: 'Oud Oil',
      annualValue: 385000,
      units: 1580,
      unitPrice: 244,
      contribution: 8.9,
      turnover: 7.5,
      status: 'review'
    },
    {
      product: 'Amber Collection',
      sku: 'PERF-012',
      category: 'Perfumes',
      annualValue: 285000,
      units: 980,
      unitPrice: 291,
      contribution: 6.6,
      turnover: 6.2,
      status: 'optimal'
    }
  ];

  const bItems = [
    {
      product: 'Musk Al Tahara',
      sku: 'PERF-015',
      category: 'Perfumes',
      annualValue: 145000,
      units: 785,
      unitPrice: 185,
      contribution: 3.4,
      turnover: 5.8,
      status: 'optimal'
    },
    {
      product: 'Luxury Gift Set',
      sku: 'GIFT-003',
      category: 'Gift Sets',
      annualValue: 125000,
      units: 420,
      unitPrice: 298,
      contribution: 2.9,
      turnover: 4.2,
      status: 'optimal'
    },
    {
      product: 'Oud Incense Premium',
      sku: 'INC-001',
      category: 'Incense',
      annualValue: 95000,
      units: 1450,
      unitPrice: 66,
      contribution: 2.2,
      turnover: 6.5,
      status: 'review'
    },
    {
      product: 'Rose Water Spray',
      sku: 'ACC-008',
      category: 'Accessories',
      annualValue: 75000,
      units: 1250,
      unitPrice: 60,
      contribution: 1.7,
      turnover: 8.1,
      status: 'optimal'
    }
  ];

  const cItems = [
    {
      product: 'Basic Incense Sticks',
      sku: 'INC-015',
      category: 'Incense',
      annualValue: 35000,
      units: 3450,
      unitPrice: 10,
      contribution: 0.8,
      turnover: 12.5,
      status: 'consider_removing'
    },
    {
      product: 'Sample Vials',
      sku: 'ACC-025',
      category: 'Accessories',
      annualValue: 28000,
      units: 5600,
      unitPrice: 5,
      contribution: 0.6,
      turnover: 15.2,
      status: 'keep'
    },
    {
      product: 'Gift Wrapping',
      sku: 'ACC-030',
      category: 'Accessories',
      annualValue: 15000,
      units: 3000,
      unitPrice: 5,
      contribution: 0.3,
      turnover: 18.5,
      status: 'keep'
    }
  ];

  const recommendations = {
    aItems: [
      {
        title: 'Maintain High Stock Levels',
        description: 'Never run out of A-items. Keep safety stock of at least 30 days',
        priority: 'critical',
        impact: 'Prevents revenue loss from stockouts'
      },
      {
        title: 'Negotiate Better Terms',
        description: 'Focus on volume discounts and payment terms for top items',
        priority: 'high',
        impact: 'Potential 5-8% cost reduction'
      },
      {
        title: 'Monitor Daily',
        description: 'Track sales and inventory levels daily for all A-items',
        priority: 'high',
        impact: 'Early warning system for issues'
      },
      {
        title: 'Premium Display',
        description: 'Give A-items prime shelf space and visibility',
        priority: 'medium',
        impact: 'Increased sales opportunities'
      }
    ],
    bItems: [
      {
        title: 'Moderate Stock Levels',
        description: 'Maintain 15-20 days of inventory for B-items',
        priority: 'medium',
        impact: 'Balanced inventory investment'
      },
      {
        title: 'Weekly Review',
        description: 'Review B-item performance weekly to catch trends',
        priority: 'medium',
        impact: 'Timely response to changes'
      },
      {
        title: 'Promotion Opportunities',
        description: 'B-items are good candidates for upselling and promotions',
        priority: 'medium',
        impact: 'Move items to A category'
      }
    ],
    cItems: [
      {
        title: 'Minimize Investment',
        description: 'Keep minimal stock, order only as needed',
        priority: 'low',
        impact: 'Free up working capital'
      },
      {
        title: 'Evaluate Discontinuation',
        description: 'Consider removing very low performers',
        priority: 'low',
        impact: 'Reduce complexity and costs'
      },
      {
        title: 'Bundle with A-items',
        description: 'Include C-items as free gifts or bundle deals',
        priority: 'low',
        impact: 'Clear inventory without markdowns'
      }
    ]
  };

  const insights = [
    {
      type: 'critical',
      title: 'A-Item Concentration Risk',
      description: 'Top 5 products account for 60% of revenue. Consider diversifying product portfolio.',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      type: 'opportunity',
      title: 'B-Item Promotion Potential',
      description: '8 B-items are trending upward and could move to A category with targeted marketing.',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      type: 'warning',
      title: 'C-Item Inventory Cost',
      description: 'C-items occupy 35% of warehouse space but generate only 5% of revenue.',
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      type: 'success',
      title: 'Optimal A-Item Performance',
      description: 'All A-items have healthy turnover rates and minimal stockout incidents.',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
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
            <BarChart3 className="h-8 w-8 text-amber-600" />
            ABC Inventory Analysis
          </h1>
          <p className="text-muted-foreground">
            Classify inventory by value and optimize stock management
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold">{summary.totalItems}</div>
            <div className="text-sm text-gray-600">Total Products</div>
            <div className="text-xs text-gray-500 mt-1">
              Value: AED {(summary.totalValue / 1000000).toFixed(2)}M
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-8 w-8 text-green-600" />
              <Badge className="bg-green-600">A</Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{summary.aItems.count}</div>
            <div className="text-sm text-gray-700">{summary.aItems.percentage}% of items</div>
            <div className="text-xs text-gray-600 mt-1">
              {summary.aItems.valuePercentage}% of value (AED {(summary.aItems.value / 1000000).toFixed(2)}M)
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-amber-600" />
              <Badge className="bg-amber-600">B</Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{summary.bItems.count}</div>
            <div className="text-sm text-gray-700">{summary.bItems.percentage}% of items</div>
            <div className="text-xs text-gray-600 mt-1">
              {summary.bItems.valuePercentage}% of value (AED {(summary.bItems.value / 1000).toFixed(0)}K)
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-8 w-8 text-gray-600" />
              <Badge className="bg-gray-600">C</Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-600">{summary.cItems.count}</div>
            <div className="text-sm text-gray-700">{summary.cItems.percentage}% of items</div>
            <div className="text-xs text-gray-600 mt-1">
              {summary.cItems.valuePercentage}% of value (AED {(summary.cItems.value / 1000).toFixed(0)}K)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Representation */}
      <Card>
        <CardHeader>
          <CardTitle>ABC Distribution</CardTitle>
          <CardDescription>Pareto principle: 20% of items = 80% of value</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">A Items (High Value)</span>
                <span className="text-sm text-gray-600">
                  {summary.aItems.count} items • {summary.aItems.valuePercentage}% of value
                </span>
              </div>
              <div className="h-12 flex rounded-lg overflow-hidden">
                <div className="bg-green-500 flex items-center justify-center text-white font-bold" style={{ width: '80%' }}>
                  80% Value
                </div>
                <div className="bg-green-200" style={{ width: '20%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>20% of products</span>
                <span>→</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">B Items (Medium Value)</span>
                <span className="text-sm text-gray-600">
                  {summary.bItems.count} items • {summary.bItems.valuePercentage}% of value
                </span>
              </div>
              <div className="h-10 flex rounded-lg overflow-hidden">
                <div className="bg-amber-500 flex items-center justify-center text-white font-semibold" style={{ width: '15%' }}>
                  15% Value
                </div>
                <div className="bg-amber-200" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>30% of products</span>
                <span>→</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">C Items (Low Value)</span>
                <span className="text-sm text-gray-600">
                  {summary.cItems.count} items • {summary.cItems.valuePercentage}% of value
                </span>
              </div>
              <div className="h-8 flex rounded-lg overflow-hidden">
                <div className="bg-gray-500 flex items-center justify-center text-white text-sm" style={{ width: '5%' }}>
                  5%
                </div>
                <div className="bg-gray-200" style={{ width: '95%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>50% of products</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Important findings from ABC analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                    <Icon className={`h-5 w-5 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{insight.title}</div>
                    <div className="text-sm text-gray-600">{insight.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="a-items">A Items</TabsTrigger>
          <TabsTrigger value="b-items">B Items</TabsTrigger>
          <TabsTrigger value="c-items">C Items</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-600" />
                  A Items
                </CardTitle>
                <CardDescription>High-value items requiring close attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-green-600">{summary.aItems.count}</div>
                  <Progress value={summary.aItems.valuePercentage} className="h-3" />
                  <div className="text-sm text-gray-600">
                    {summary.aItems.valuePercentage}% of total inventory value
                  </div>
                  <div className="pt-3 border-t space-y-2">
                    <div className="text-xs text-gray-600">Management Priority</div>
                    <Badge className="bg-red-600">Critical</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-600" />
                  B Items
                </CardTitle>
                <CardDescription>Medium-value items with moderate control</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-amber-600">{summary.bItems.count}</div>
                  <Progress value={summary.bItems.valuePercentage} className="h-3" />
                  <div className="text-sm text-gray-600">
                    {summary.bItems.valuePercentage}% of total inventory value
                  </div>
                  <div className="pt-3 border-t space-y-2">
                    <div className="text-xs text-gray-600">Management Priority</div>
                    <Badge className="bg-amber-600">Medium</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-600" />
                  C Items
                </CardTitle>
                <CardDescription>Low-value items with minimal control</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-gray-600">{summary.cItems.count}</div>
                  <Progress value={summary.cItems.valuePercentage} className="h-3" />
                  <div className="text-sm text-gray-600">
                    {summary.cItems.valuePercentage}% of total inventory value
                  </div>
                  <div className="pt-3 border-t space-y-2">
                    <div className="text-xs text-gray-600">Management Priority</div>
                    <Badge className="bg-gray-600">Low</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* A Items Tab */}
        <TabsContent value="a-items">
          <Card>
            <CardHeader>
              <CardTitle>A Items - High Value Products</CardTitle>
              <CardDescription>Top 20% of products generating 80% of revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aItems.map((item, index) => (
                  <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{item.product}</div>
                        <div className="text-sm text-gray-600">{item.sku} • {item.category}</div>
                      </div>
                      <Badge className={
                        item.status === 'optimal' ? 'bg-green-600' : 'bg-amber-600'
                      }>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <div className="text-xs text-gray-600">Annual Value</div>
                        <div className="font-bold text-green-600">AED {(item.annualValue / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Units Sold</div>
                        <div className="font-semibold">{item.units?.toLocaleString() || "0"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Unit Price</div>
                        <div className="font-semibold">AED {item.unitPrice}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Contribution</div>
                        <div className="font-semibold text-purple-600">{item.contribution}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Turnover</div>
                        <div className="font-semibold">{item.turnover}x/year</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* B Items Tab */}
        <TabsContent value="b-items">
          <Card>
            <CardHeader>
              <CardTitle>B Items - Medium Value Products</CardTitle>
              <CardDescription>30% of products generating 15% of revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bItems.map((item, index) => (
                  <div key={index} className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{item.product}</div>
                        <div className="text-sm text-gray-600">{item.sku} • {item.category}</div>
                      </div>
                      <Badge className={
                        item.status === 'optimal' ? 'bg-green-600' : 'bg-amber-600'
                      }>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <div className="text-xs text-gray-600">Annual Value</div>
                        <div className="font-bold text-amber-600">AED {(item.annualValue / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Units Sold</div>
                        <div className="font-semibold">{item.units?.toLocaleString() || "0"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Unit Price</div>
                        <div className="font-semibold">AED {item.unitPrice}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Contribution</div>
                        <div className="font-semibold text-purple-600">{item.contribution}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Turnover</div>
                        <div className="font-semibold">{item.turnover}x/year</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* C Items Tab */}
        <TabsContent value="c-items">
          <Card>
            <CardHeader>
              <CardTitle>C Items - Low Value Products</CardTitle>
              <CardDescription>50% of products generating only 5% of revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{item.product}</div>
                        <div className="text-sm text-gray-600">{item.sku} • {item.category}</div>
                      </div>
                      <Badge className={
                        item.status === 'keep' ? 'bg-blue-600' :
                        item.status === 'consider_removing' ? 'bg-red-600' :
                        'bg-gray-600'
                      }>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <div className="text-xs text-gray-600">Annual Value</div>
                        <div className="font-bold text-gray-600">AED {(item.annualValue / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Units Sold</div>
                        <div className="font-semibold">{item.units?.toLocaleString() || "0"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Unit Price</div>
                        <div className="font-semibold">AED {item.unitPrice}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Contribution</div>
                        <div className="font-semibold text-purple-600">{item.contribution}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Turnover</div>
                        <div className="font-semibold">{item.turnover}x/year</div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">A Items Strategy</CardTitle>
                <CardDescription>Critical management focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.aItems.map((rec, index) => (
                    <div key={index} className="border-b pb-3 last:border-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold text-sm">{rec.title}</div>
                        <Badge className={
                          rec.priority === 'critical' ? 'bg-red-600 text-xs' :
                          rec.priority === 'high' ? 'bg-orange-600 text-xs' :
                          'bg-blue-600 text-xs'
                        }>
                          {rec.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{rec.description}</div>
                      <div className="text-xs text-green-700 font-medium">{rec.impact}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-700">B Items Strategy</CardTitle>
                <CardDescription>Moderate management focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.bItems.map((rec, index) => (
                    <div key={index} className="border-b pb-3 last:border-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold text-sm">{rec.title}</div>
                        <Badge className="bg-amber-600 text-xs">{rec.priority}</Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{rec.description}</div>
                      <div className="text-xs text-amber-700 font-medium">{rec.impact}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-700">C Items Strategy</CardTitle>
                <CardDescription>Minimal management focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.cItems.map((rec, index) => (
                    <div key={index} className="border-b pb-3 last:border-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold text-sm">{rec.title}</div>
                        <Badge className="bg-gray-600 text-xs">{rec.priority}</Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{rec.description}</div>
                      <div className="text-xs text-gray-700 font-medium">{rec.impact}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
