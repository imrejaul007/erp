'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar,
  Package
} from 'lucide-react';
import { ProductionBatch, Recipe, YieldAnalysis as YieldAnalysisType } from '@/types/production';
import { format, subDays, subMonths } from 'date-fns';

interface YieldAnalysisProps {
  batches: ProductionBatch[];
  recipes: Recipe[];
}

interface AnalysisMetrics {
  averageYield: number;
  yieldVariance: number;
  totalBatches: number;
  onTargetBatches: number;
  underperformingBatches: number;
  overperformingBatches: number;
  bestPerformingRecipe?: string;
  worstPerformingRecipe?: string;
}

const YieldAnalysisComponent: React.FC<YieldAnalysisProps> = ({
  batches,
  recipes
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedRecipe, setSelectedRecipe] = useState('all');

  // Filter batches based on timeframe and recipe
  const filteredBatches = useMemo(() => {
    let filtered = batches.filter(batch =>
      batch.actualQuantity !== null &&
      batch.actualQuantity !== undefined &&
      batch.plannedQuantity > 0
    );

    // Apply time filter
    const now = new Date();
    const timeFilters = {
      '7d': subDays(now, 7),
      '30d': subDays(now, 30),
      '90d': subDays(now, 90),
      '6m': subMonths(now, 6),
      '1y': subMonths(now, 12)
    };

    if (timeFilters[selectedTimeframe as keyof typeof timeFilters]) {
      const cutoffDate = timeFilters[selectedTimeframe as keyof typeof timeFilters];
      filtered = filtered.filter(batch =>
        new Date(batch.createdAt) >= cutoffDate
      );
    }

    // Apply recipe filter
    if (selectedRecipe !== 'all') {
      filtered = filtered.filter(batch => batch.recipeId === selectedRecipe);
    }

    return filtered;
  }, [batches, selectedTimeframe, selectedRecipe]);

  // Calculate yield analysis for each batch
  const yieldAnalyses: YieldAnalysisType[] = useMemo(() => {
    return filteredBatches.map(batch => {
      const plannedYield = batch.plannedQuantity;
      const actualYield = batch.actualQuantity || 0;
      const yieldPercentage = plannedYield > 0 ? (actualYield / plannedYield) * 100 : 0;
      const variance = actualYield - plannedYield;
      const wastage = Math.max(0, plannedYield - actualYield);

      return {
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        plannedYield,
        actualYield,
        yieldPercentage,
        variance,
        wastage,
        notes: batch.notes
      };
    });
  }, [filteredBatches]);

  // Calculate overall metrics
  const metrics: AnalysisMetrics = useMemo(() => {
    if (yieldAnalyses.length === 0) {
      return {
        averageYield: 0,
        yieldVariance: 0,
        totalBatches: 0,
        onTargetBatches: 0,
        underperformingBatches: 0,
        overperformingBatches: 0
      };
    }

    const totalYieldPercentage = yieldAnalyses.reduce((sum, analysis) => sum + analysis.yieldPercentage, 0);
    const averageYield = totalYieldPercentage / yieldAnalyses.length;

    const yieldVariances = yieldAnalyses.map(a => Math.pow(a.yieldPercentage - averageYield, 2));
    const yieldVariance = Math.sqrt(yieldVariances.reduce((sum, v) => sum + v, 0) / yieldVariances.length);

    const onTargetBatches = yieldAnalyses.filter(a => a.yieldPercentage >= 95 && a.yieldPercentage <= 105).length;
    const underperformingBatches = yieldAnalyses.filter(a => a.yieldPercentage < 95).length;
    const overperformingBatches = yieldAnalyses.filter(a => a.yieldPercentage > 105).length;

    // Find best and worst performing recipes
    const recipePerformance = recipes.map(recipe => {
      const recipeBatches = filteredBatches.filter(b => b.recipeId === recipe.id);
      if (recipeBatches.length === 0) return null;

      const recipeAnalyses = yieldAnalyses.filter(a =>
        recipeBatches.some(b => b.id === a.batchId)
      );

      if (recipeAnalyses.length === 0) return null;

      const avgYield = recipeAnalyses.reduce((sum, a) => sum + a.yieldPercentage, 0) / recipeAnalyses.length;

      return {
        recipeName: recipe.name,
        averageYield: avgYield,
        batchCount: recipeAnalyses.length
      };
    }).filter(Boolean);

    const bestPerformingRecipe = recipePerformance.length > 0
      ? recipePerformance.reduce((best, current) =>
          current!.averageYield > best!.averageYield ? current : best
        )?.recipeName
      : undefined;

    const worstPerformingRecipe = recipePerformance.length > 0
      ? recipePerformance.reduce((worst, current) =>
          current!.averageYield < worst!.averageYield ? current : worst
        )?.recipeName
      : undefined;

    return {
      averageYield,
      yieldVariance,
      totalBatches: yieldAnalyses.length,
      onTargetBatches,
      underperformingBatches,
      overperformingBatches,
      bestPerformingRecipe,
      worstPerformingRecipe
    };
  }, [yieldAnalyses, recipes, filteredBatches]);

  // Get yield status badge
  const getYieldStatusBadge = (yieldPercentage: number) => {
    if (yieldPercentage >= 100) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          On Target
        </Badge>
      );
    } else if (yieldPercentage >= 95) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          Acceptable
        </Badge>
      );
    } else if (yieldPercentage >= 85) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Below Target
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          Poor
        </Badge>
      );
    }
  };

  // Export analysis data
  const exportAnalysis = () => {
    const headers = [
      'Batch Number', 'Recipe', 'Planned Yield', 'Actual Yield',
      'Yield %', 'Variance', 'Status', 'Date', 'Notes'
    ];

    const csvData = [
      headers.join(','),
      ...yieldAnalyses.map(analysis => {
        const batch = filteredBatches.find(b => b.id === analysis.batchId);
        const recipe = batch?.recipe;
        return [
          analysis.batchNumber,
          recipe?.name || 'Custom',
          analysis.plannedYield,
          analysis.actualYield,
          analysis.yieldPercentage.toFixed(2),
          analysis.variance.toFixed(2),
          analysis.yieldPercentage >= 95 ? 'On Target' : 'Below Target',
          batch ? format(new Date(batch.createdAt), 'yyyy-MM-dd') : '',
          `"${analysis.notes || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yield-analysis-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Yield Analysis</h2>
          <p className="text-gray-600">Analyze production efficiency and yield performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAnalysis}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Recipe</label>
              <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
                <SelectTrigger className="w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All recipes</SelectItem>
                  {recipes.map(recipe => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Batches</p>
                <p className="text-2xl font-bold">{metrics.totalBatches}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Yield</p>
                <p className="text-2xl font-bold">{metrics.averageYield.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Target</p>
                <p className="text-2xl font-bold text-green-600">{metrics.onTargetBatches}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Below Target</p>
                <p className="text-2xl font-bold text-red-600">{metrics.underperformingBatches}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Over Target</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.overperformingBatches}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Variance</p>
                <p className="text-2xl font-bold">±{metrics.yieldVariance.toFixed(1)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Content */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="batches" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="batches">Batch Analysis</TabsTrigger>
              <TabsTrigger value="recipes">Recipe Performance</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="batches">
              <BatchAnalysisTable
                analyses={yieldAnalyses}
                batches={filteredBatches}
                getYieldStatusBadge={getYieldStatusBadge}
              />
            </TabsContent>

            <TabsContent value="recipes">
              <RecipePerformanceAnalysis
                recipes={recipes}
                batches={filteredBatches}
                analyses={yieldAnalyses}
              />
            </TabsContent>

            <TabsContent value="insights">
              <YieldInsights
                metrics={metrics}
                analyses={yieldAnalyses}
                batches={filteredBatches}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Batch Analysis Table
interface BatchAnalysisTableProps {
  analyses: YieldAnalysisType[];
  batches: ProductionBatch[];
  getYieldStatusBadge: (yieldPercentage: number) => React.ReactNode;
}

const BatchAnalysisTable: React.FC<BatchAnalysisTableProps> = ({
  analyses,
  batches,
  getYieldStatusBadge
}) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch</TableHead>
            <TableHead>Recipe</TableHead>
            <TableHead>Planned</TableHead>
            <TableHead>Actual</TableHead>
            <TableHead>Yield %</TableHead>
            <TableHead>Variance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No batch data available for analysis
              </TableCell>
            </TableRow>
          ) : (
            analyses
              .sort((a, b) => b.yieldPercentage - a.yieldPercentage)
              .map(analysis => {
                const batch = batches.find(b => b.id === analysis.batchId);
                return (
                  <TableRow key={analysis.batchId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{analysis.batchNumber}</p>
                        <p className="text-sm text-gray-600">
                          #{analysis.batchId.slice(0, 8)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {batch?.recipe ? (
                        <div>
                          <p className="font-medium">{batch.recipe.name}</p>
                          <p className="text-sm text-gray-600">{batch.recipe.category}</p>
                        </div>
                      ) : (
                        <span className="text-gray-500">Custom batch</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {analysis.plannedYield} {batch?.unit}
                    </TableCell>
                    <TableCell>
                      {analysis.actualYield} {batch?.unit}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.min(100, analysis.yieldPercentage)}
                          className="w-16"
                        />
                        <span className="font-medium">
                          {analysis.yieldPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={analysis.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {analysis.variance >= 0 ? '+' : ''}{analysis.variance.toFixed(2)} {batch?.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getYieldStatusBadge(analysis.yieldPercentage)}
                    </TableCell>
                    <TableCell>
                      {batch && format(new Date(batch.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                  </TableRow>
                );
              })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Recipe Performance Analysis
interface RecipePerformanceAnalysisProps {
  recipes: Recipe[];
  batches: ProductionBatch[];
  analyses: YieldAnalysisType[];
}

const RecipePerformanceAnalysis: React.FC<RecipePerformanceAnalysisProps> = ({
  recipes,
  batches,
  analyses
}) => {
  const recipeStats = recipes.map(recipe => {
    const recipeBatches = batches.filter(b => b.recipeId === recipe.id);
    const recipeAnalyses = analyses.filter(a =>
      recipeBatches.some(b => b.id === a.batchId)
    );

    if (recipeAnalyses.length === 0) return null;

    const avgYield = recipeAnalyses.reduce((sum, a) => sum + a.yieldPercentage, 0) / recipeAnalyses.length;
    const totalPlanned = recipeAnalyses.reduce((sum, a) => sum + a.plannedYield, 0);
    const totalActual = recipeAnalyses.reduce((sum, a) => sum + a.actualYield, 0);
    const consistency = Math.sqrt(
      recipeAnalyses.reduce((sum, a) => sum + Math.pow(a.yieldPercentage - avgYield, 2), 0) / recipeAnalyses.length
    );

    return {
      recipe,
      batchCount: recipeAnalyses.length,
      avgYield,
      totalPlanned,
      totalActual,
      consistency
    };
  }).filter(Boolean);

  return (
    <div className="space-y-4">
      {recipeStats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No recipe performance data available</p>
          <p className="text-sm">Complete some batches to see performance analysis</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recipeStats
            .sort((a, b) => b!.avgYield - a!.avgYield)
            .map(stat => (
              <Card key={stat!.recipe.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <h3 className="font-semibold">{stat!.recipe.name}</h3>
                      <p className="text-sm text-gray-600">{stat!.recipe.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Batches</p>
                      <p className="text-lg font-bold">{stat!.batchCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Yield</p>
                      <p className="text-lg font-bold">{stat!.avgYield.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Output</p>
                      <p className="text-lg font-bold">
                        {stat!.totalActual.toFixed(1)} {stat!.recipe.yieldUnit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Consistency</p>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.max(0, 100 - stat!.consistency)} className="w-16" />
                        <span className="text-sm">
                          ±{stat!.consistency.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

// Yield Insights
interface YieldInsightsProps {
  metrics: AnalysisMetrics;
  analyses: YieldAnalysisType[];
  batches: ProductionBatch[];
}

const YieldInsights: React.FC<YieldInsightsProps> = ({
  metrics,
  analyses,
  batches
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Average Yield Efficiency:</span>
                <span className={`font-bold ${
                  metrics.averageYield >= 95 ? 'text-green-600' :
                  metrics.averageYield >= 85 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metrics.averageYield.toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Consistency Score:</span>
                <span className={`font-bold ${
                  metrics.yieldVariance <= 5 ? 'text-green-600' :
                  metrics.yieldVariance <= 10 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metrics.yieldVariance <= 5 ? 'Excellent' :
                   metrics.yieldVariance <= 10 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Target Achievement Rate:</span>
                <span className="font-bold text-blue-600">
                  {metrics.totalBatches > 0
                    ? ((metrics.onTargetBatches / metrics.totalBatches) * 100).toFixed(1)
                    : 0
                  }%
                </span>
              </div>

              {metrics.bestPerformingRecipe && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">Best Performing Recipe:</p>
                  <p className="font-medium text-green-600">{metrics.bestPerformingRecipe}</p>
                </div>
              )}

              {metrics.worstPerformingRecipe && (
                <div className="pt-2">
                  <p className="text-sm text-gray-600">Needs Attention:</p>
                  <p className="font-medium text-red-600">{metrics.worstPerformingRecipe}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.averageYield < 95 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Below Target Performance</p>
                      <p className="text-sm text-red-700">
                        Average yield is below 95%. Review production processes and material handling.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {metrics.yieldVariance > 10 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <BarChart3 className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">High Variability</p>
                      <p className="text-sm text-yellow-700">
                        Yield variance is high. Standardize processes and improve quality control.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {metrics.underperformingBatches > metrics.onTargetBatches && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingDown className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">More Failures than Successes</p>
                      <p className="text-sm text-orange-700">
                        Focus on identifying root causes of underperformance.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {metrics.averageYield >= 95 && metrics.yieldVariance <= 5 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Excellent Performance</p>
                      <p className="text-sm text-green-700">
                        Yield performance is consistent and on target. Maintain current practices.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Regular equipment calibration and operator training help maintain consistent yields.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Yield Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{metrics.onTargetBatches}</p>
                <p className="text-sm text-gray-600">On Target (95%+)</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {analyses.filter(a => a.yieldPercentage >= 85 && a.yieldPercentage < 95).length}
                </p>
                <p className="text-sm text-gray-600">Acceptable (85-94%)</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {analyses.filter(a => a.yieldPercentage < 85).length}
                </p>
                <p className="text-sm text-gray-600">Below Standard (&lt;85%)</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{metrics.overperformingBatches}</p>
                <p className="text-sm text-gray-600">Overperforming (105%+)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YieldAnalysisComponent;