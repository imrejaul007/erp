'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign, ArrowLeft, TrendingUp, TrendingDown, BarChart3, PieChart,
  Activity, Target, AlertCircle, CheckCircle2, Sparkles, Brain
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function CostingReportsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('batch-costing');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [isBatchDetailOpen, setIsBatchDetailOpen] = useState(false);

  const costingSummary = {
    totalProductionCost: 425800,
    avgCostPerBatch: 15208,
    avgYieldRate: 94.5,
    totalWastageCost: 8950,
    profitMargin: 68.3,
    targetMargin: 65
  };

  const batchCostings = [
    {
      id: 'BATCH-PP-2024-0412',
      product: 'Royal Oud Blend',
      batchDate: '2024-09-25',
      outputQty: 100,
      outputUnit: 'bottles (50ml)',
      costs: {
        rawMaterials: 15500,
        packaging: 3500,
        labor: 2800,
        utilities: 450,
        overhead: 1250,
        qcTesting: 300,
        total: 23800
      },
      costPerUnit: 238,
      sellingPricePerUnit: 1850,
      profitPerUnit: 1612,
      profitMargin: 87.1,
      totalRevenue: 185000,
      totalProfit: 161200
    },
    {
      id: 'BATCH-OE-2024-0285',
      product: 'Premium Oud Oil',
      batchDate: '2024-10-01',
      outputQty: 18.6,
      outputUnit: 'ml',
      costs: {
        rawMaterials: 45000,
        packaging: 0,
        labor: 4200,
        utilities: 1250,
        overhead: 1800,
        qcTesting: 450,
        total: 52700
      },
      costPerUnit: 2833.33,
      sellingPricePerUnit: 8500,
      profitPerUnit: 5666.67,
      profitMargin: 66.7,
      totalRevenue: 158100,
      totalProfit: 105400
    }
  ];

  const yieldAnalysis = [
    {
      process: 'Oil Extraction',
      inputMaterial: 'Premium Oud Chips',
      avgInput: 15.5,
      inputUnit: 'kg',
      avgOutput: 18.6,
      outputUnit: 'ml',
      yieldRate: 1.2,
      yieldMetric: 'ml/kg',
      wastage: 14.2,
      wastageUnit: 'kg (residue)',
      wastagePercent: 91.6,
      bestYield: 1.5,
      targetYield: 1.3,
      status: 'below-target'
    },
    {
      process: 'Segregation',
      inputMaterial: 'Raw Oud Wood',
      avgInput: 54.3,
      inputUnit: 'kg',
      avgOutput: 52.6,
      outputUnit: 'kg',
      yieldRate: 96.9,
      yieldMetric: '%',
      wastage: 1.7,
      wastageUnit: 'kg',
      wastagePercent: 3.1,
      bestYield: 98.5,
      targetYield: 97.0,
      status: 'on-target'
    },
    {
      process: 'Perfume Blending',
      inputMaterial: 'Oud Oil + Components',
      avgInput: 2500,
      inputUnit: 'ml',
      avgOutput: 2450,
      outputUnit: 'ml',
      yieldRate: 98.0,
      yieldMetric: '%',
      wastage: 50,
      wastageUnit: 'ml',
      wastagePercent: 2.0,
      bestYield: 99.2,
      targetYield: 98.5,
      status: 'on-target'
    }
  ];

  const supplierComparison = [
    {
      supplier: 'Premium Oud Traders LLC',
      material: 'Cambodian Oud Wood',
      totalPurchased: 450,
      unit: 'kg',
      avgCostPerKg: 8500,
      totalCost: 3825000,
      avgYield: 1.3,
      yieldMetric: 'ml oil/kg',
      avgQuality: 9.2,
      effectiveCostPerMl: 6538.46,
      ranking: 1,
      recommendation: 'Best value - high yield & quality'
    },
    {
      supplier: 'Emirates Oud Supply',
      material: 'Vietnamese Oud Wood',
      totalPurchased: 380,
      unit: 'kg',
      avgCostPerKg: 7200,
      totalCost: 2736000,
      avgYield: 1.0,
      yieldMetric: 'ml oil/kg',
      avgQuality: 8.5,
      effectiveCostPerMl: 7200,
      ranking: 2,
      recommendation: 'Good quality but lower yield'
    },
    {
      supplier: 'Global Agarwood Trading',
      material: 'Indian Oud Wood',
      totalPurchased: 220,
      unit: 'kg',
      avgCostPerKg: 6800,
      totalCost: 1496000,
      avgYield: 0.8,
      yieldMetric: 'ml oil/kg',
      avgQuality: 7.8,
      effectiveCostPerMl: 8500,
      ranking: 3,
      recommendation: 'Lower cost but poor yield - not recommended'
    }
  ];

  const productLineProfitability = [
    {
      productLine: 'Premium Oud Oils',
      totalBatches: 28,
      totalUnits: 850,
      unit: 'ml',
      avgCostPerUnit: 2850,
      avgSellingPrice: 8500,
      profitMargin: 66.5,
      totalRevenue: 7225000,
      totalCost: 2422500,
      totalProfit: 4802500,
      performanceRating: 'excellent'
    },
    {
      productLine: 'Luxury Perfumes',
      totalBatches: 42,
      totalUnits: 4250,
      unit: 'bottles',
      avgCostPerUnit: 625,
      avgSellingPrice: 1850,
      profitMargin: 66.2,
      totalRevenue: 7862500,
      totalCost: 2656250,
      totalProfit: 5206250,
      performanceRating: 'excellent'
    },
    {
      productLine: 'Regular Attars',
      totalBatches: 35,
      totalUnits: 2800,
      unit: 'bottles',
      avgCostPerUnit: 385,
      avgSellingPrice: 950,
      profitMargin: 59.5,
      totalRevenue: 2660000,
      totalCost: 1078000,
      totalProfit: 1582000,
      performanceRating: 'good'
    },
    {
      productLine: 'Oud Wood Chips',
      totalBatches: 18,
      totalUnits: 1250,
      unit: 'kg',
      avgCostPerUnit: 4200,
      avgSellingPrice: 9500,
      profitMargin: 55.8,
      totalRevenue: 11875000,
      totalCost: 5250000,
      totalProfit: 6625000,
      performanceRating: 'good'
    }
  ];

  const wastageAnalysis = [
    {
      process: 'Segregation',
      material: 'Oud Wood',
      totalWastage: 85.4,
      unit: 'kg',
      wastagePercent: 3.2,
      wastageCost: 6850,
      cause: 'Dust & damaged pieces',
      improvement: 'Improve handling & storage'
    },
    {
      process: 'Oil Extraction',
      material: 'Wood Residue',
      totalWastage: 425.8,
      unit: 'kg',
      wastagePercent: 91.5,
      wastageCost: 850,
      cause: 'Natural residue (can be sold)',
      improvement: 'Sell as incense material'
    },
    {
      process: 'Perfume Blending',
      material: 'Mixed Components',
      totalWastage: 2.5,
      unit: 'liters',
      wastagePercent: 1.8,
      wastageCost: 1250,
      cause: 'Spills & QC rejections',
      improvement: 'Better quality control'
    }
  ];

  const aiYieldForecast = {
    nextMonth: {
      oilExtraction: {
        predicted: 1.25,
        current: 1.2,
        confidence: 87,
        recommendation: 'Source from Premium Oud Traders for better yield'
      },
      segregation: {
        predicted: 97.2,
        current: 96.9,
        confidence: 92,
        recommendation: 'Improve pre-sorting process'
      },
      perfumeBlending: {
        predicted: 98.3,
        current: 98.0,
        confidence: 95,
        recommendation: 'Continue current process - performing well'
      }
    },
    trendAnalysis: 'Yield rates improving by 0.5% monthly. Oil extraction has most room for improvement.',
    costSaving: 'Predicted savings: AED 15,000/month if yield targets met'
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/production')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Production Costing & Yield Reports</h1>
            <p className="text-muted-foreground">
              Cost analysis, yield tracking, profitability reports & AI-based forecasting
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Production Cost</CardDescription>
            <CardTitle className="text-3xl">AED {(costingSummary.totalProductionCost / 1000).toFixed(0)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Avg: AED {costingSummary.avgCostPerBatch.toLocaleString()}/batch
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Yield Rate</CardDescription>
            <CardTitle className="text-3xl">{costingSummary.avgYieldRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={costingSummary.avgYieldRate} className="mb-2" />
            <p className="text-xs text-green-600">
              Above industry average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Wastage Cost</CardDescription>
            <CardTitle className="text-3xl">AED {costingSummary.totalWastageCost.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-600">
              2.1% of total cost
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Profit Margin</CardDescription>
            <CardTitle className="text-3xl">{costingSummary.profitMargin}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Progress value={(costingSummary.profitMargin / costingSummary.targetMargin) * 100} className="flex-1" />
            </div>
            <p className="text-xs text-green-600">
              Exceeding target ({costingSummary.targetMargin}%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="batch-costing">Batch Costing</TabsTrigger>
          <TabsTrigger value="yield">Yield Analysis</TabsTrigger>
          <TabsTrigger value="profitability">Product Profitability</TabsTrigger>
          <TabsTrigger value="supplier">Supplier Comparison</TabsTrigger>
          <TabsTrigger value="ai-forecast">AI Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="batch-costing" className="space-y-4">
          {batchCostings.map((batch) => (
            <Card
              key={batch.id}
              className="cursor-pointer hover:bg-blue-50 transition-colors group"
              onClick={() => {
                setSelectedBatch(batch);
                setIsBatchDetailOpen(true);
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-gray-900 group-hover:text-gray-900">{batch.id}</CardTitle>
                      <Badge variant="outline">{batch.product}</Badge>
                    </div>
                    <CardDescription className="mt-1 text-gray-700 group-hover:text-gray-800">
                      {batch.outputQty} {batch.outputUnit} • Batch Date: {batch.batchDate}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 group-hover:text-green-700">
                      {batch.profitMargin.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700">Profit Margin</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Raw Materials</p>
                    <p className="font-semibold">AED {batch.costs.rawMaterials.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Packaging</p>
                    <p className="font-semibold">AED {batch.costs.packaging.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Labor</p>
                    <p className="font-semibold">AED {batch.costs.labor.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Utilities</p>
                    <p className="font-semibold">AED {batch.costs.utilities.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Overhead</p>
                    <p className="font-semibold">AED {batch.costs.overhead.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">QC Testing</p>
                    <p className="font-semibold">AED {batch.costs.qcTesting.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className="font-semibold text-lg">AED {batch.costs.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cost Per Unit</p>
                    <p className="font-semibold text-lg">AED {batch.costPerUnit.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Selling Price</p>
                    <p className="font-semibold text-lg text-green-600">AED {batch.sellingPricePerUnit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                    <p className="font-semibold text-lg text-green-600">AED {batch.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Profit</p>
                    <p className="font-semibold text-lg text-green-600">AED {batch.totalProfit.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-semibold">
                      Profit per unit: AED {batch.profitPerUnit.toFixed(2)} ({batch.profitMargin.toFixed(1)}% margin)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="yield" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yield Analysis by Process</CardTitle>
              <CardDescription>
                Input vs output tracking with wastage analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Process</TableHead>
                    <TableHead>Input Material</TableHead>
                    <TableHead>Avg Input</TableHead>
                    <TableHead>Avg Output</TableHead>
                    <TableHead>Yield Rate</TableHead>
                    <TableHead>Wastage</TableHead>
                    <TableHead>Best Yield</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yieldAnalysis.map((process, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{process.process}</TableCell>
                      <TableCell>{process.inputMaterial}</TableCell>
                      <TableCell>{process.avgInput} {process.inputUnit}</TableCell>
                      <TableCell>{process.avgOutput} {process.outputUnit}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{process.yieldRate} {process.yieldMetric}</span>
                          {process.status === 'on-target' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{process.wastage} {process.wastageUnit}</p>
                          <p className="text-xs text-muted-foreground">({process.wastagePercent}%)</p>
                        </div>
                      </TableCell>
                      <TableCell>{process.bestYield} {process.yieldMetric}</TableCell>
                      <TableCell>{process.targetYield} {process.yieldMetric}</TableCell>
                      <TableCell>
                        <Badge
                          variant={process.status === 'on-target' ? 'default' : 'secondary'}
                          className={process.status === 'on-target' ? 'bg-green-600' : 'bg-amber-600'}
                        >
                          {process.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wastage Analysis & Cost Impact</CardTitle>
              <CardDescription>Material loss tracking with improvement recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Process</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Total Wastage</TableHead>
                    <TableHead>Wastage %</TableHead>
                    <TableHead>Cost Impact</TableHead>
                    <TableHead>Cause</TableHead>
                    <TableHead>Improvement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wastageAnalysis.map((waste, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{waste.process}</TableCell>
                      <TableCell>{waste.material}</TableCell>
                      <TableCell>{waste.totalWastage} {waste.unit}</TableCell>
                      <TableCell>{waste.wastagePercent}%</TableCell>
                      <TableCell>AED {waste.wastageCost.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{waste.cause}</TableCell>
                      <TableCell className="text-sm text-blue-600">{waste.improvement}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Line Profitability</CardTitle>
              <CardDescription>
                Revenue, cost & profit analysis by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Line</TableHead>
                    <TableHead>Batches</TableHead>
                    <TableHead>Total Units</TableHead>
                    <TableHead>Avg Cost/Unit</TableHead>
                    <TableHead>Avg Price</TableHead>
                    <TableHead>Margin %</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Total Profit</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productLineProfitability.map((product, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{product.productLine}</TableCell>
                      <TableCell>{product.totalBatches}</TableCell>
                      <TableCell>{product.totalUnits.toLocaleString()} {product.unit}</TableCell>
                      <TableCell>AED {product.avgCostPerUnit.toLocaleString()}</TableCell>
                      <TableCell>AED {product.avgSellingPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">{product.profitMargin.toFixed(1)}%</span>
                          <Progress value={product.profitMargin} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        AED {(product.totalRevenue / 1000).toFixed(0)}K
                      </TableCell>
                      <TableCell>AED {(product.totalCost / 1000).toFixed(0)}K</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        AED {(product.totalProfit / 1000).toFixed(0)}K
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.performanceRating === 'excellent' ? 'default' : 'secondary'}
                          className={product.performanceRating === 'excellent' ? 'bg-green-600' : 'bg-blue-600'}
                        >
                          {product.performanceRating}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {productLineProfitability
                  .sort((a, b) => b.totalProfit - a.totalProfit)
                  .slice(0, 3)
                  .map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{product.productLine}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.profitMargin.toFixed(1)}% margin
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          AED {(product.totalProfit / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-muted-foreground">profit</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Raw Materials</span>
                      <span className="font-semibold">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Packaging</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Labor</span>
                      <span className="font-semibold">12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Utilities & Overhead</span>
                      <span className="font-semibold">8%</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">QC & Testing</span>
                      <span className="font-semibold">3%</span>
                    </div>
                    <Progress value={3} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="supplier" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Comparison & Yield Analysis</CardTitle>
              <CardDescription>
                Compare suppliers based on cost, yield & quality to find best value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Total Purchased</TableHead>
                    <TableHead>Cost/kg</TableHead>
                    <TableHead>Avg Yield</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Effective Cost/ml</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierComparison.map((supplier) => (
                    <TableRow key={supplier.supplier}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">
                          {supplier.ranking}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{supplier.supplier}</TableCell>
                      <TableCell>{supplier.material}</TableCell>
                      <TableCell>{supplier.totalPurchased} {supplier.unit}</TableCell>
                      <TableCell>AED {supplier.avgCostPerKg.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{supplier.avgYield} {supplier.yieldMetric}</span>
                          {supplier.ranking === 1 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{supplier.avgQuality}/10</span>
                          <Progress value={supplier.avgQuality * 10} className="w-12 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={supplier.ranking === 1 ? 'font-bold text-green-600' : ''}>
                          AED {supplier.effectiveCostPerMl.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          {supplier.ranking === 1 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                          )}
                          <span>{supplier.recommendation}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Key Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Best Value Supplier</h4>
                  </div>
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Premium Oud Traders LLC</span> offers best effective cost per ml (AED 6,538) despite higher upfront cost
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Superior yield (1.3 ml/kg) and quality (9.2/10) justify premium pricing
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border-2 border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-800">Avoid Low-Yield Suppliers</h4>
                  </div>
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Global Agarwood Trading</span> has lowest upfront cost but highest effective cost (AED 8,500/ml)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Poor yield (0.8 ml/kg) makes this 30% more expensive than best supplier
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-forecast" className="space-y-4">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <div>
                  <CardTitle>AI-Based Yield Forecasting</CardTitle>
                  <CardDescription>
                    Machine learning predictions based on historical data & trends
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Oil Extraction</h4>
                    <Badge variant="outline" className="text-xs">
                      {aiYieldForecast.nextMonth.oilExtraction.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Yield:</span>
                      <span className="font-semibold">{aiYieldForecast.nextMonth.oilExtraction.current} ml/kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Predicted:</span>
                      <span className="font-semibold text-green-600 flex items-center gap-1">
                        {aiYieldForecast.nextMonth.oilExtraction.predicted} ml/kg
                        <TrendingUp className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-blue-600">
                      <Sparkles className="h-3 w-3 inline mr-1" />
                      {aiYieldForecast.nextMonth.oilExtraction.recommendation}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Segregation</h4>
                    <Badge variant="outline" className="text-xs">
                      {aiYieldForecast.nextMonth.segregation.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Yield:</span>
                      <span className="font-semibold">{aiYieldForecast.nextMonth.segregation.current}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Predicted:</span>
                      <span className="font-semibold text-green-600 flex items-center gap-1">
                        {aiYieldForecast.nextMonth.segregation.predicted}%
                        <TrendingUp className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-blue-600">
                      <Sparkles className="h-3 w-3 inline mr-1" />
                      {aiYieldForecast.nextMonth.segregation.recommendation}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Perfume Blending</h4>
                    <Badge variant="outline" className="text-xs">
                      {aiYieldForecast.nextMonth.perfumeBlending.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Yield:</span>
                      <span className="font-semibold">{aiYieldForecast.nextMonth.perfumeBlending.current}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Predicted:</span>
                      <span className="font-semibold text-green-600 flex items-center gap-1">
                        {aiYieldForecast.nextMonth.perfumeBlending.predicted}%
                        <TrendingUp className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3 inline mr-1" />
                      {aiYieldForecast.nextMonth.perfumeBlending.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Trend Analysis</h4>
                  </div>
                  <p className="text-sm">{aiYieldForecast.trendAnalysis}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">Cost Saving Potential</h4>
                  </div>
                  <p className="text-sm">{aiYieldForecast.costSaving}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Model Training Data</CardTitle>
              <CardDescription>
                Historical data used for yield predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">2,450</p>
                  <p className="text-sm text-muted-foreground mt-1">Batch records</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">18</p>
                  <p className="text-sm text-muted-foreground mt-1">Months data</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">95%</p>
                  <p className="text-sm text-muted-foreground mt-1">Model accuracy</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <p className="text-3xl font-bold text-amber-600">12</p>
                  <p className="text-sm text-muted-foreground mt-1">Data variables</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Costing & Yield Analysis Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Complete Cost Breakdown</h3>
                <p className="text-xs text-muted-foreground">
                  Materials, labor, utilities, overhead & QC costs per batch
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Yield % Tracking</h3>
                <p className="text-xs text-muted-foreground">
                  Input vs output analysis with wastage monitoring
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <PieChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Profitability Reports</h3>
                <p className="text-xs text-muted-foreground">
                  Product line performance & margin analysis
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">AI-Based Forecasting</h3>
                <p className="text-xs text-muted-foreground">
                  Predictive yield analysis & cost optimization
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Costing Detail Dialog */}
      <Dialog open={isBatchDetailOpen} onOpenChange={setIsBatchDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Batch Costing Analysis - {selectedBatch?.id}</DialogTitle>
            <DialogDescription>
              Complete cost breakdown and profitability analysis
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Batch Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batch ID:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batch Date:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.batchDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Output Quantity:</span>
                      <span className="font-bold text-gray-900">{selectedBatch.outputQty} {selectedBatch.outputUnit}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Profitability
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost Per Unit:</span>
                      <span className="font-semibold text-gray-900">AED {selectedBatch.costPerUnit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selling Price:</span>
                      <span className="font-bold text-green-600">AED {selectedBatch.sellingPricePerUnit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit Per Unit:</span>
                      <span className="font-bold text-green-600">AED {selectedBatch.profitPerUnit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Profit Margin:</span>
                      <span className="font-bold text-green-600 text-lg">{selectedBatch.profitMargin.toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Cost Breakdown */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Cost Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Raw Materials</p>
                    <p className="text-xl font-bold text-gray-900">AED {selectedBatch.costs.rawMaterials.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {((selectedBatch.costs.rawMaterials / selectedBatch.costs.total) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Packaging</p>
                    <p className="text-xl font-bold text-gray-900">AED {selectedBatch.costs.packaging.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {((selectedBatch.costs.packaging / selectedBatch.costs.total) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Labor</p>
                    <p className="text-xl font-bold text-gray-900">AED {selectedBatch.costs.labor.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {((selectedBatch.costs.labor / selectedBatch.costs.total) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Utilities</p>
                    <p className="text-xl font-bold text-gray-900">AED {selectedBatch.costs.utilities.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {((selectedBatch.costs.utilities / selectedBatch.costs.total) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Overhead</p>
                    <p className="text-xl font-bold text-gray-900">AED {selectedBatch.costs.overhead.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {((selectedBatch.costs.overhead / selectedBatch.costs.total) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">QC Testing</p>
                    <p className="text-xl font-bold text-gray-900">AED {selectedBatch.costs.qcTesting.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {((selectedBatch.costs.qcTesting / selectedBatch.costs.total) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total Production Cost:</span>
                    <span className="text-2xl font-bold text-primary">AED {selectedBatch.costs.total.toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              {/* Revenue & Profit */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-blue-50 border border-blue-200">
                  <h3 className="font-semibold mb-2 text-gray-900">Total Revenue</h3>
                  <p className="text-3xl font-bold text-blue-600">AED {selectedBatch.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 mt-1">{selectedBatch.outputQty} units @ AED {selectedBatch.sellingPricePerUnit.toLocaleString()}</p>
                </Card>

                <Card className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-semibold mb-2 text-gray-900">Total Profit</h3>
                  <p className="text-3xl font-bold text-green-600">AED {selectedBatch.totalProfit.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 mt-1">Margin: {selectedBatch.profitMargin.toFixed(1)}% above target</p>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline">
                  Export Report
                </Button>
                <Button variant="outline">
                  Compare Batches
                </Button>
                <Button variant="outline" onClick={() => setIsBatchDetailOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
