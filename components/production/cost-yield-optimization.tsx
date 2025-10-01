'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Calculator,
  Lightbulb,
  Zap,
  ArrowUp,
  ArrowDown,
  Equal,
  Percent,
  Package,
  Clock,
  Users,
  Factory
} from 'lucide-react';
import {
  ProductionBatch,
  Recipe,
  Material,
  BOM,
  YieldAnalysis
} from '@/types/production';
import { format, subDays, subMonths } from 'date-fns';

interface CostBreakdown {
  materialCosts: number;
  laborCosts: number;
  overheadCosts: number;
  equipmentCosts: number;
  qualityCosts: number;
  totalCost: number;
}

interface YieldMetrics {
  plannedYield: number;
  actualYield: number;
  yieldEfficiency: number;
  wastagePercentage: number;
  recoveryRate: number;
}

interface OptimizationSuggestion {
  id: string;
  type: 'cost_reduction' | 'yield_improvement' | 'process_optimization' | 'material_substitution';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  potentialSavings: number;
  implementationCost: number;
  paybackPeriod: number; // in months
  impact: 'low' | 'medium' | 'high';
  feasibility: 'low' | 'medium' | 'high';
  category: string;
}

interface BatchProfitability {
  batchId: string;
  batchNumber: string;
  revenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  costPerUnit: number;
  revenuePerUnit: number;
  breakdownCosts: CostBreakdown;
}

interface CostYieldOptimizationProps {
  batches: ProductionBatch[];
  recipes: Recipe[];
  materials: Material[];
  boms: BOM[];
  onImplementOptimization: (suggestionId: string) => void;
  onUpdateTargets: (targets: any) => void;
}

const CostYieldOptimization: React.FC<CostYieldOptimizationProps> = ({
  batches,
  recipes,
  materials,
  boms,
  onImplementOptimization,
  onUpdateTargets
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'perfume' | 'oud_oil' | 'attar'>('all');
  const [isOptimizationDialogOpen, setIsOptimizationDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<OptimizationSuggestion | null>(null);

  // Calculate cost breakdowns for batches
  const batchProfitability: BatchProfitability[] = useMemo(() => {
    return batches.map(batch => {
      const recipe = recipes.find(r => r.id === batch.recipeId);
      const bom = boms.find(b => b.recipeId === batch.recipeId && b.isActive);

      // Material costs
      const materialCosts = bom ? bom.totalCost * (batch.actualQuantity || batch.plannedQuantity) / (recipe?.yieldQuantity || 1) : 0;

      // Labor costs (estimated based on production time)
      const laborHours = 8; // Average hours per batch
      const laborRate = 25; // AED per hour
      const laborCosts = laborHours * laborRate;

      // Overhead costs (20% of material + labor)
      const overheadCosts = (materialCosts + laborCosts) * 0.2;

      // Equipment costs (depreciation and maintenance)
      const equipmentCosts = 50; // Fixed cost per batch

      // Quality costs (testing and inspection)
      const qualityCosts = 30;

      const totalCost = materialCosts + laborCosts + overheadCosts + equipmentCosts + qualityCosts;

      // Revenue calculation (mock pricing)
      const basePrice = recipe?.category === 'Perfume' ? 200 : recipe?.category === 'Oud Oil' ? 500 : 150;
      const quantity = batch.actualQuantity || batch.plannedQuantity;
      const revenue = quantity * basePrice;

      const grossProfit = revenue - totalCost;
      const profitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

      return {
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        revenue,
        totalCost,
        grossProfit,
        profitMargin,
        costPerUnit: quantity > 0 ? totalCost / quantity : 0,
        revenuePerUnit: quantity > 0 ? revenue / quantity : 0,
        breakdownCosts: {
          materialCosts,
          laborCosts,
          overheadCosts,
          equipmentCosts,
          qualityCosts,
          totalCost
        }
      };
    });
  }, [batches, recipes, boms]);

  // Calculate yield metrics
  const yieldMetrics: YieldMetrics[] = useMemo(() => {
    return batches.map(batch => {
      const planned = batch.plannedQuantity;
      const actual = batch.actualQuantity || batch.plannedQuantity;
      const yieldEfficiency = planned > 0 ? (actual / planned) * 100 : 0;
      const wastagePercentage = planned > 0 ? ((planned - actual) / planned) * 100 : 0;
      const recoveryRate = 95; // Mock recovery rate

      return {
        plannedYield: planned,
        actualYield: actual,
        yieldEfficiency,
        wastagePercentage,
        recoveryRate
      };
    });
  }, [batches]);

  // Generate optimization suggestions using AI-like analysis
  const optimizationSuggestions: OptimizationSuggestion[] = useMemo(() => {
    const suggestions: OptimizationSuggestion[] = [];

    // Analyze high-cost materials
    const materialCostAnalysis = materials
      .sort((a, b) => b.costPerUnit - a.costPerUnit)
      .slice(0, 5);

    materialCostAnalysis.forEach(material => {
      if (material.costPerUnit > 100) {
        suggestions.push({
          id: `material-${material.id}`,
          type: 'material_substitution',
          priority: 'high',
          title: `Consider Alternative to ${material.name}`,
          description: `${material.name} costs ${material.costPerUnit} AED per ${material.unitOfMeasure}. Research lower-cost alternatives or negotiate better supplier rates.`,
          potentialSavings: material.costPerUnit * 0.15, // 15% potential savings
          implementationCost: 500,
          paybackPeriod: 2,
          impact: 'high',
          feasibility: 'medium',
          category: 'Material Optimization'
        });
      }
    });

    // Analyze yield efficiency
    const lowYieldBatches = batches.filter(batch => {
      const actual = batch.actualQuantity || batch.plannedQuantity;
      const efficiency = (actual / batch.plannedQuantity) * 100;
      return efficiency < 85;
    });

    if (lowYieldBatches.length > 0) {
      suggestions.push({
        id: 'yield-improvement',
        type: 'yield_improvement',
        priority: 'critical',
        title: 'Improve Production Yield Efficiency',
        description: `${lowYieldBatches.length} batches have yield efficiency below 85%. Implement process controls and training to reduce waste.`,
        potentialSavings: 2000,
        implementationCost: 800,
        paybackPeriod: 3,
        impact: 'high',
        feasibility: 'high',
        category: 'Process Improvement'
      });
    }

    // Analyze overhead costs
    const avgOverheadPercentage = batchProfitability.reduce((sum, batch) => {
      return sum + (batch.breakdownCosts.overheadCosts / batch.totalCost) * 100;
    }, 0) / batchProfitability.length;

    if (avgOverheadPercentage > 25) {
      suggestions.push({
        id: 'overhead-reduction',
        type: 'cost_reduction',
        priority: 'medium',
        title: 'Optimize Overhead Costs',
        description: `Overhead costs are ${avgOverheadPercentage.toFixed(1)}% of total costs. Consider automation and process improvements.`,
        potentialSavings: 1500,
        implementationCost: 3000,
        paybackPeriod: 6,
        impact: 'medium',
        feasibility: 'medium',
        category: 'Operational Efficiency'
      });
    }

    // Energy optimization
    suggestions.push({
      id: 'energy-optimization',
      type: 'process_optimization',
      priority: 'medium',
      title: 'Implement Energy Management System',
      description: 'Install smart energy monitoring to reduce utility costs by 20-30% in aging and distillation processes.',
      potentialSavings: 1200,
      implementationCost: 2500,
      paybackPeriod: 8,
      impact: 'medium',
      feasibility: 'high',
      category: 'Sustainability'
    });

    // Batch size optimization
    const avgBatchSize = batches.reduce((sum, batch) => sum + batch.plannedQuantity, 0) / batches.length;
    if (avgBatchSize < 50) {
      suggestions.push({
        id: 'batch-size-optimization',
        type: 'process_optimization',
        priority: 'high',
        title: 'Optimize Batch Sizes',
        description: 'Current average batch size is small. Increasing batch sizes can reduce per-unit costs by improving economies of scale.',
        potentialSavings: 800,
        implementationCost: 200,
        paybackPeriod: 1,
        impact: 'high',
        feasibility: 'high',
        category: 'Scale Optimization'
      });
    }

    return suggestions.sort((a, b) => {
      const priorityScore = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityScore[b.priority] - priorityScore[a.priority];
    });
  }, [batches, materials, batchProfitability]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalRevenue = batchProfitability.reduce((sum, batch) => sum + batch.revenue, 0);
    const totalCosts = batchProfitability.reduce((sum, batch) => sum + batch.totalCost, 0);
    const totalProfit = totalRevenue - totalCosts;
    const avgProfitMargin = batchProfitability.length > 0
      ? batchProfitability.reduce((sum, batch) => sum + batch.profitMargin, 0) / batchProfitability.length
      : 0;

    const avgYieldEfficiency = yieldMetrics.length > 0
      ? yieldMetrics.reduce((sum, metric) => sum + metric.yieldEfficiency, 0) / yieldMetrics.length
      : 0;

    const totalWastage = yieldMetrics.reduce((sum, metric) =>
      sum + (metric.plannedYield - metric.actualYield), 0
    );

    const potentialSavings = optimizationSuggestions
      .filter(s => s.feasibility === 'high')
      .reduce((sum, s) => sum + s.potentialSavings, 0);

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      avgProfitMargin,
      avgYieldEfficiency,
      totalWastage,
      potentialSavings,
      batchCount: batches.length
    };
  }, [batchProfitability, yieldMetrics, optimizationSuggestions, batches.length]);

  // Generate cost trend data
  const costTrendData = useMemo(() => {
    const days = 30;
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - i - 1);
      const batchesOnDay = batches.filter(batch => {
        const batchDate = new Date(batch.startDate);
        return format(batchDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      const dayProfitability = batchesOnDay.map(batch =>
        batchProfitability.find(bp => bp.batchId === batch.id)
      ).filter(Boolean);

      const totalCost = dayProfitability.reduce((sum, bp) => sum + (bp?.totalCost || 0), 0);
      const totalRevenue = dayProfitability.reduce((sum, bp) => sum + (bp?.revenue || 0), 0);

      return {
        date: format(date, 'MMM dd'),
        cost: totalCost,
        revenue: totalRevenue,
        profit: totalRevenue - totalCost
      };
    });
  }, [batches, batchProfitability]);

  // Cost breakdown pie chart data
  const costBreakdownData = useMemo(() => {
    const totals = batchProfitability.reduce(
      (acc, batch) => ({
        materialCosts: acc.materialCosts + batch.breakdownCosts.materialCosts,
        laborCosts: acc.laborCosts + batch.breakdownCosts.laborCosts,
        overheadCosts: acc.overheadCosts + batch.breakdownCosts.overheadCosts,
        equipmentCosts: acc.equipmentCosts + batch.breakdownCosts.equipmentCosts,
        qualityCosts: acc.qualityCosts + batch.breakdownCosts.qualityCosts
      }),
      { materialCosts: 0, laborCosts: 0, overheadCosts: 0, equipmentCosts: 0, qualityCosts: 0 }
    );

    return [
      { name: 'Materials', value: totals.materialCosts, color: '#3b82f6' },
      { name: 'Labor', value: totals.laborCosts, color: '#10b981' },
      { name: 'Overhead', value: totals.overheadCosts, color: '#f59e0b' },
      { name: 'Equipment', value: totals.equipmentCosts, color: '#ef4444' },
      { name: 'Quality', value: totals.qualityCosts, color: '#8b5cf6' }
    ];
  }, [batchProfitability]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'medium': return <Equal className="w-4 h-4 text-yellow-600" />;
      case 'low': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cost Analysis & Yield Optimization</h2>
          <p className="text-gray-600">Analyze costs, optimize yields, and improve profitability</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Calculator className="w-4 h-4 mr-2" />
            Run Analysis
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  {summaryMetrics.totalProfit.toLocaleString()} AED
                </p>
                <p className="text-xs text-gray-600">
                  {summaryMetrics.avgProfitMargin.toFixed(1)}% margin
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Yield Efficiency</p>
                <p className="text-2xl font-bold text-blue-600">
                  {summaryMetrics.avgYieldEfficiency.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600">
                  {summaryMetrics.totalWastage.toFixed(1)} units wasted
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Potential Savings</p>
                <p className="text-2xl font-bold text-orange-600">
                  {summaryMetrics.potentialSavings.toLocaleString()} AED
                </p>
                <p className="text-xs text-gray-600">
                  From {optimizationSuggestions.length} suggestions
                </p>
              </div>
              <Lightbulb className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Batches Analyzed</p>
                <p className="text-2xl font-bold">{summaryMetrics.batchCount}</p>
                <p className="text-xs text-gray-600">
                  Avg cost: {(summaryMetrics.totalCosts / summaryMetrics.batchCount).toFixed(0)} AED
                </p>
              </div>
              <Package className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI-Powered Optimization Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationSuggestions.slice(0, 5).map(suggestion => (
              <Card key={suggestion.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{suggestion.category}</Badge>
                        </div>
                        <h3 className="font-semibold">{suggestion.title}</h3>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                      </div>
                      <div className="text-right">
                        {getImpactIcon(suggestion.impact)}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Potential Savings</p>
                        <p className="font-semibold text-green-600">
                          {suggestion.potentialSavings.toLocaleString()} AED
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Implementation Cost</p>
                        <p className="font-semibold">
                          {suggestion.implementationCost.toLocaleString()} AED
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Payback Period</p>
                        <p className="font-semibold">{suggestion.paybackPeriod} months</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Feasibility</p>
                        <Badge variant="outline" className={
                          suggestion.feasibility === 'high' ? 'text-green-600' :
                          suggestion.feasibility === 'medium' ? 'text-yellow-600' : 'text-red-600'
                        }>
                          {suggestion.feasibility}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedSuggestion(suggestion);
                          setIsOptimizationDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onImplementOptimization(suggestion.id)}
                      >
                        Implement
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="cost-trends" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cost-trends">Cost Trends</TabsTrigger>
              <TabsTrigger value="cost-breakdown">Cost Breakdown</TabsTrigger>
              <TabsTrigger value="yield-analysis">Yield Analysis</TabsTrigger>
              <TabsTrigger value="profitability">Profitability</TabsTrigger>
            </TabsList>

            <TabsContent value="cost-trends" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Cost & Revenue Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={costTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="cost"
                        fill="#ef4444"
                        stroke="#ef4444"
                        fillOpacity={0.3}
                        name="Cost"
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        fill="#10b981"
                        stroke="#10b981"
                        fillOpacity={0.3}
                        name="Revenue"
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Profit"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cost-breakdown" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cost Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Cost Breakdown Details</h3>
                  <div className="space-y-3">
                    {costBreakdownData.map(item => (
                      <div key={item.name} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.value.toLocaleString()} AED</p>
                          <p className="text-xs text-gray-600">
                            {((item.value / costBreakdownData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="yield-analysis" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Yield Efficiency by Batch</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={batches.map((batch, index) => ({
                        batchNumber: batch.batchNumber,
                        planned: batch.plannedQuantity,
                        actual: batch.actualQuantity || batch.plannedQuantity,
                        efficiency: yieldMetrics[index]?.yieldEfficiency || 0
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="batchNumber" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="planned" fill="#e5e7eb" name="Planned Yield" />
                      <Bar dataKey="actual" fill="#3b82f6" name="Actual Yield" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profitability" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Batch Profitability Analysis</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Cost/Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batchProfitability.slice(0, 10).map(batch => (
                      <TableRow key={batch.batchId}>
                        <TableCell className="font-medium">
                          {batch.batchNumber}
                        </TableCell>
                        <TableCell>
                          {batch.revenue.toLocaleString()} AED
                        </TableCell>
                        <TableCell>
                          {batch.totalCost.toLocaleString()} AED
                        </TableCell>
                        <TableCell className={
                          batch.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }>
                          {batch.grossProfit.toLocaleString()} AED
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            batch.profitMargin >= 20 ? 'default' :
                            batch.profitMargin >= 10 ? 'secondary' : 'destructive'
                          }>
                            {batch.profitMargin.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {batch.costPerUnit.toFixed(2)} AED
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Optimization Detail Dialog */}
      {selectedSuggestion && (
        <Dialog open={isOptimizationDialogOpen} onOpenChange={setIsOptimizationDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedSuggestion.title}</DialogTitle>
            </DialogHeader>
            <OptimizationDetailView
              suggestion={selectedSuggestion}
              onImplement={() => {
                onImplementOptimization(selectedSuggestion.id);
                setIsOptimizationDialogOpen(false);
              }}
              onCancel={() => setIsOptimizationDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Optimization Detail View Component
interface OptimizationDetailViewProps {
  suggestion: OptimizationSuggestion;
  onImplement: () => void;
  onCancel: () => void;
}

const OptimizationDetailView: React.FC<OptimizationDetailViewProps> = ({
  suggestion,
  onImplement,
  onCancel
}) => {
  const roi = suggestion.potentialSavings / suggestion.implementationCost;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={
            suggestion.priority === 'critical' ? 'bg-red-100 text-red-800' :
            suggestion.priority === 'high' ? 'bg-orange-100 text-orange-800' :
            suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }>
            {suggestion.priority.toUpperCase()} PRIORITY
          </Badge>
          <Badge variant="outline">{suggestion.category}</Badge>
        </div>

        <p className="text-gray-700">{suggestion.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Potential Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  {suggestion.potentialSavings.toLocaleString()} AED
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Implementation Cost</p>
                <p className="text-2xl font-bold">
                  {suggestion.implementationCost.toLocaleString()} AED
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">ROI</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(roi * 100).toFixed(0)}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Payback Period</p>
                <p className="text-2xl font-bold">
                  {suggestion.paybackPeriod} months
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Impact Level</p>
            <Badge variant="outline" className={
              suggestion.impact === 'high' ? 'text-green-600' :
              suggestion.impact === 'medium' ? 'text-yellow-600' : 'text-red-600'
            }>
              {suggestion.impact.toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600">Feasibility</p>
            <Badge variant="outline" className={
              suggestion.feasibility === 'high' ? 'text-green-600' :
              suggestion.feasibility === 'medium' ? 'text-yellow-600' : 'text-red-600'
            }>
              {suggestion.feasibility.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Implementation Steps (Mock) */}
        <div>
          <h4 className="font-semibold mb-2">Implementation Steps</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                1
              </div>
              <span className="text-sm">Analyze current process and identify improvement areas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                2
              </div>
              <span className="text-sm">Develop implementation plan and timeline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                3
              </div>
              <span className="text-sm">Execute changes and monitor results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                4
              </div>
              <span className="text-sm">Measure impact and adjust as needed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onImplement}>
          <Zap className="w-4 h-4 mr-2" />
          Implement Optimization
        </Button>
      </div>
    </div>
  );
};

export default CostYieldOptimization;