'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
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
  LineChart,
  Line
} from 'recharts';
import {
  Factory,
  Package,
  Beaker,
  ClipboardList,
  Timer,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

// Import all production components
import RecipeBuilder from './recipe-builder';
import RecipeVersionControl from './recipe-version-control';
import RecipeCalculator from './recipe-calculator';
import BOMGenerator from './bom-generator';
import MaterialRequirementPlanning from './material-requirement-planning';
import AutoDeduction from './auto-deduction';
import ProcessingFlowComponent from './processing-flow';
import ProcessingTracker from './processing-tracker';
import ProductionBatchComponent from './production-batch';
import AgingTimer from './aging-timer';
import QualityControlComponent from './quality-control';
import WastageTracking from './wastage-tracking';
import YieldAnalysisComponent from './yield-analysis';

interface ProductionDashboardProps {
  // All the data would come from props or hooks
  recipes?: any[];
  materials?: any[];
  batches?: any[];
  boms?: any[];
  flows?: any[];
  stages?: any[];
  qualityControls?: any[];
  wastageRecords?: any[];
  // Event handlers
  onCreateRecipe?: (recipe: any) => void;
  onCreateBOM?: (bom: any) => void;
  onCreateBatch?: (batch: any) => void;
}

const ProductionDashboard: React.FC<ProductionDashboardProps> = ({
  recipes = [],
  materials = [],
  batches = [],
  boms = [],
  flows = [],
  stages = [],
  qualityControls = [],
  wastageRecords = [],
  onCreateRecipe = () => {},
  onCreateBOM = () => {},
  onCreateBatch = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate dashboard statistics
  const stats = {
    recipes: {
      total: recipes.length,
      active: recipes.filter(r => r.isActive).length,
      categories: [...new Set(recipes.map(r => r.category))].length
    },
    batches: {
      total: batches.length,
      inProgress: batches.filter(b => b.status === 'IN_PROGRESS').length,
      aging: batches.filter(b => b.status === 'AGING').length,
      completed: batches.filter(b => b.status === 'COMPLETED').length
    },
    quality: {
      total: qualityControls.length,
      passed: qualityControls.filter(qc => qc.result === 'PASS').length,
      failed: qualityControls.filter(qc => qc.result === 'FAIL').length,
      pending: qualityControls.filter(qc => qc.result === 'PENDING').length
    },
    wastage: {
      totalCost: wastageRecords.reduce((sum, record) => sum + record.cost, 0),
      totalRecords: wastageRecords.length
    }
  };

  // Sample chart data
  const productionTrendData = [
    { month: 'Jan', batches: 12, output: 450 },
    { month: 'Feb', batches: 15, output: 520 },
    { month: 'Mar', batches: 18, output: 680 },
    { month: 'Apr', batches: 14, output: 590 },
    { month: 'May', batches: 20, output: 750 },
    { month: 'Jun', batches: 22, output: 820 }
  ];

  const qualityDistribution = [
    { name: 'Pass', value: stats.quality.passed, color: '#10B981' },
    { name: 'Fail', value: stats.quality.failed, color: '#EF4444' },
    { name: 'Pending', value: stats.quality.pending, color: '#F59E0B' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Production & Recipe Management</h1>
          <p className="text-gray-600">Comprehensive production system for Perfume & Oud ERP</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button>
            <Factory className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="bom">BOM</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Recipes</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.recipes.active}</p>
                    <p className="text-sm text-gray-500">of {stats.recipes.total} total</p>
                  </div>
                  <Beaker className="w-10 h-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Production Batches</p>
                    <p className="text-3xl font-bold text-green-600">{stats.batches.inProgress}</p>
                    <p className="text-sm text-gray-500">in progress</p>
                  </div>
                  <Factory className="w-10 h-10 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Quality Pass Rate</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {stats.quality.total > 0
                        ? Math.round((stats.quality.passed / stats.quality.total) * 100)
                        : 0}%
                    </p>
                    <p className="text-sm text-gray-500">{stats.quality.passed} passed</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Wastage Cost</p>
                    <p className="text-3xl font-bold text-red-600">
                      ${stats.wastage.totalCost.toFixed(0)}
                    </p>
                    <p className="text-sm text-gray-500">{stats.wastage.totalRecords} records</p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Production Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="batches"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Batches"
                    />
                    <Line
                      type="monotone"
                      dataKey="output"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Output (L)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Control Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={qualityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {qualityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {batches.slice(0, 5).map(batch => (
                    <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{batch.batchNumber}</p>
                        <p className="text-sm text-gray-600">{batch.recipe?.name || 'Custom'}</p>
                      </div>
                      <Badge
                        variant={batch.status === 'COMPLETED' ? 'default' : 'outline'}
                      >
                        {batch.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aging Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {batches
                    .filter(batch => batch.status === 'AGING')
                    .slice(0, 5)
                    .map(batch => (
                      <div key={batch.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium">{batch.batchNumber}</p>
                          <p className="text-sm text-gray-600">
                            {batch.agingDays ? `${batch.agingDays} days aging` : 'Aging period not set'}
                          </p>
                        </div>
                        <Timer className="w-5 h-5 text-purple-500" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recipe Management Tab */}
        <TabsContent value="recipes" className="space-y-6">
          <Tabs defaultValue="builder" className="w-full">
            <TabsList>
              <TabsTrigger value="builder">Recipe Builder</TabsTrigger>
              <TabsTrigger value="versions">Version Control</TabsTrigger>
              <TabsTrigger value="calculator">Cost Calculator</TabsTrigger>
            </TabsList>

            <TabsContent value="builder">
              <RecipeBuilder
                availableMaterials={materials}
                onSave={onCreateRecipe}
                onCalculate={() => {}}
              />
            </TabsContent>

            <TabsContent value="versions">
              {recipes.length > 0 && (
                <RecipeVersionControl
                  recipe={recipes[0]}
                  versions={recipes[0]?.versions || []}
                  onCreateVersion={() => {}}
                  onActivateVersion={() => {}}
                  onCompareVersions={() => {}}
                />
              )}
            </TabsContent>

            <TabsContent value="calculator">
              {recipes.length > 0 && (
                <RecipeCalculator
                  ingredients={recipes[0]?.ingredients || []}
                  yieldQuantity={recipes[0]?.yieldQuantity || 0}
                  yieldUnit={recipes[0]?.yieldUnit || 'ml'}
                />
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* BOM Tab */}
        <TabsContent value="bom" className="space-y-6">
          <Tabs defaultValue="generator" className="w-full">
            <TabsList>
              <TabsTrigger value="generator">BOM Generator</TabsTrigger>
              <TabsTrigger value="mrp">Material Planning</TabsTrigger>
              <TabsTrigger value="deduction">Auto Deduction</TabsTrigger>
            </TabsList>

            <TabsContent value="generator">
              {recipes.length > 0 && (
                <BOMGenerator
                  recipe={recipes[0]}
                  existingBOMs={boms}
                  onGenerateBOM={onCreateBOM}
                  onUpdateBOM={() => {}}
                  onDeleteBOM={() => {}}
                />
              )}
            </TabsContent>

            <TabsContent value="mrp">
              <MaterialRequirementPlanning
                boms={boms}
                materials={materials}
                productionPlan={batches}
                onGeneratePurchaseOrder={() => {}}
              />
            </TabsContent>

            <TabsContent value="deduction">
              {batches.length > 0 && (
                <AutoDeduction
                  productionBatch={batches[0]}
                  materials={materials}
                  stockMovements={[]}
                  onDeductStock={() => Promise.resolve()}
                  onReverseDeduction={() => Promise.resolve()}
                />
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Processing Tab */}
        <TabsContent value="processing" className="space-y-6">
          <Tabs defaultValue="flows" className="w-full">
            <TabsList>
              <TabsTrigger value="flows">Processing Flows</TabsTrigger>
              <TabsTrigger value="tracker">Process Tracker</TabsTrigger>
            </TabsList>

            <TabsContent value="flows">
              <ProcessingFlowComponent
                flows={flows}
                stages={stages}
                batches={[]}
                onCreateFlow={() => {}}
                onUpdateFlow={() => {}}
                onDeleteFlow={() => {}}
                onStartBatch={() => {}}
              />
            </TabsContent>

            <TabsContent value="tracker">
              <ProcessingTracker
                batches={[]}
                flows={flows}
                stages={stages}
                onUpdateBatchStatus={() => {}}
                onMoveBatchToNextStage={() => {}}
                onCompleteBatch={() => {}}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Production Tab */}
        <TabsContent value="production" className="space-y-6">
          <Tabs defaultValue="batches" className="w-full">
            <TabsList>
              <TabsTrigger value="batches">Production Batches</TabsTrigger>
              <TabsTrigger value="aging">Aging Timer</TabsTrigger>
            </TabsList>

            <TabsContent value="batches">
              <ProductionBatchComponent
                batches={batches}
                recipes={recipes}
                materials={materials}
                onCreateBatch={onCreateBatch}
                onUpdateBatch={() => {}}
                onDeleteBatch={() => {}}
                onStartBatch={() => {}}
              />
            </TabsContent>

            <TabsContent value="aging">
              <AgingTimer
                batches={batches}
                onStartAging={() => {}}
                onCompleteAging={() => {}}
                onExtendAging={() => {}}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-6">
          <QualityControlComponent
            batches={batches}
            qualityControls={qualityControls}
            onCreateQualityControl={() => {}}
            onUpdateQualityControl={() => {}}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Tabs defaultValue="wastage" className="w-full">
            <TabsList>
              <TabsTrigger value="wastage">Wastage Analysis</TabsTrigger>
              <TabsTrigger value="yield">Yield Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="wastage">
              <WastageTracking
                wastageRecords={wastageRecords}
                batches={batches}
                onCreateWastageRecord={() => {}}
                onDeleteWastageRecord={() => {}}
              />
            </TabsContent>

            <TabsContent value="yield">
              <YieldAnalysisComponent
                batches={batches}
                recipes={recipes}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto Stock Deduction</h4>
                    <p className="text-sm text-gray-600">
                      Automatically deduct materials when production starts
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Quality Control Alerts</h4>
                    <p className="text-sm text-gray-600">
                      Send notifications for pending QC tests
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Low Stock Alerts</h4>
                    <p className="text-sm text-gray-600">
                      Generate alerts when materials fall below minimum stock
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionDashboard;