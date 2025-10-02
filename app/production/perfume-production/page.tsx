'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  FlaskConical, ArrowLeft, Plus, CheckCircle2, Clock, Droplets,
  Package, TrendingUp, DollarSign, Beaker, Calendar, Activity
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PerfumeProductionPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [isBatchDetailOpen, setIsBatchDetailOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [isRecipeDetailOpen, setIsRecipeDetailOpen] = useState(false);

  const productionSummary = {
    activeRecipes: 85,
    batchesThisMonth: 42,
    agingBatches: 15,
    bottledUnits: 850,
    avgYield: 96.5,
    totalValue: 1245000
  };

  const activeBatches = [
    {
      id: 'PP-2024-0412',
      recipe: 'Royal Oud Blend',
      recipeCode: 'RCP-OUD-001',
      stage: 'Aging',
      progress: 80,
      startDate: '2024-09-25',
      agingDays: 7,
      totalAgingDays: 14,
      targetQuantity: 100,
      currentQuantity: 100,
      unit: 'bottles (50ml)',
      ingredients: [
        { name: 'Premium Oud Oil', required: 500, used: 500, unit: 'ml' },
        { name: 'Rose Absolute', required: 150, used: 150, unit: 'ml' },
        { name: 'Sandalwood Extract', required: 200, used: 200, unit: 'ml' },
        { name: 'Alcohol (95%)', required: 4150, used: 4150, unit: 'ml' }
      ],
      estimatedCompletion: '2024-10-03',
      operator: 'Ahmed Al-Rashid',
      status: 'on-track'
    },
    {
      id: 'PP-2024-0415',
      recipe: 'Amber Rose Attar',
      recipeCode: 'RCP-ATT-005',
      stage: 'Blending',
      progress: 30,
      startDate: '2024-10-02',
      agingDays: 0,
      totalAgingDays: 21,
      targetQuantity: 75,
      currentQuantity: 75,
      unit: 'bottles (100ml)',
      ingredients: [
        { name: 'Amber Resin Extract', required: 1500, used: 1500, unit: 'ml' },
        { name: 'Rose Oil', required: 750, used: 750, unit: 'ml' },
        { name: 'Musk Tincture', required: 250, used: 250, unit: 'ml' },
        { name: 'Carrier Oil (Jojoba)', required: 5000, used: 5000, unit: 'ml' }
      ],
      estimatedCompletion: '2024-10-25',
      operator: 'Fatima Hassan',
      status: 'on-track'
    }
  ];

  const recipes = [
    {
      id: 'RCP-OUD-001',
      name: 'Royal Oud Blend',
      category: 'Oud Perfume',
      type: 'EDP (Eau de Parfum)',
      version: '2.3',
      status: 'active',
      bom: [
        { ingredient: 'Premium Oud Oil', quantity: 5, unit: 'ml', cost: 500 },
        { ingredient: 'Rose Absolute', quantity: 1.5, unit: 'ml', cost: 45 },
        { ingredient: 'Sandalwood Extract', quantity: 2, unit: 'ml', cost: 30 },
        { ingredient: 'Alcohol (95%)', quantity: 41.5, unit: 'ml', cost: 8.3 },
        { ingredient: '50ml Bottle', quantity: 1, unit: 'piece', cost: 15 },
        { ingredient: 'Luxury Box', quantity: 1, unit: 'piece', cost: 25 }
      ],
      outputSize: 50,
      outputUnit: 'ml',
      agingTime: 14,
      agingUnit: 'days',
      yieldPerBatch: 100,
      costPerUnit: 623.3,
      sellingPrice: 1850,
      margin: 66.3,
      totalBatches: 28,
      lastProduced: '2024-09-25'
    },
    {
      id: 'RCP-ATT-005',
      name: 'Amber Rose Attar',
      category: 'Attar',
      type: 'Oil-based',
      version: '1.8',
      status: 'active',
      bom: [
        { ingredient: 'Amber Resin Extract', quantity: 20, unit: 'ml', cost: 120 },
        { ingredient: 'Rose Oil', quantity: 10, unit: 'ml', cost: 150 },
        { ingredient: 'Musk Tincture', quantity: 3.3, unit: 'ml', cost: 66 },
        { ingredient: 'Carrier Oil (Jojoba)', quantity: 66.7, unit: 'ml', cost: 20 },
        { ingredient: '100ml Bottle', quantity: 1, unit: 'piece', cost: 12 },
        { ingredient: 'Standard Box', quantity: 1, unit: 'piece', cost: 8 }
      ],
      outputSize: 100,
      outputUnit: 'ml',
      agingTime: 21,
      agingUnit: 'days',
      yieldPerBatch: 50,
      costPerUnit: 376,
      sellingPrice: 950,
      margin: 60.4,
      totalBatches: 15,
      lastProduced: '2024-10-02'
    }
  ];

  const completedBatches = [
    {
      id: 'PP-2024-0405',
      recipe: 'Musk & Amber Collection',
      recipeCode: 'RCP-MSK-003',
      completedDate: '2024-09-30',
      startDate: '2024-09-18',
      agingDays: 12,
      operator: 'Mohammed Saeed',
      outputs: [
        { size: '50ml', quantity: 85, sku: 'PERF-MSK-50ML-001', value: 127500 },
        { size: '100ml', quantity: 42, sku: 'PERF-MSK-100ML-001', value: 84000 },
        { size: '10ml Sample', quantity: 120, sku: 'PERF-MSK-10ML-SAMP', value: 12000 }
      ],
      totalUnits: 247,
      totalValue: 223500,
      yieldRate: 98.2,
      qualityScore: 96.5,
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/production')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Perfume & Attar Production</h1>
            <p className="text-muted-foreground">
              Recipe management, blending, aging, filling & packaging workflow
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Beaker className="h-4 w-4" />
            New Recipe
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Start Production Batch
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Recipes</CardDescription>
            <CardTitle className="text-3xl">{productionSummary.activeRecipes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Ready for production
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Batches This Month</CardDescription>
            <CardTitle className="text-3xl">{productionSummary.batchesThisMonth}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-600">
              {productionSummary.agingBatches} currently aging
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Units Bottled</CardDescription>
            <CardTitle className="text-3xl">{productionSummary.bottledUnits}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={productionSummary.avgYield} className="mb-2" />
            <p className="text-xs text-green-600">
              {productionSummary.avgYield}% avg yield
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Production Value</CardDescription>
            <CardTitle className="text-3xl">AED {(productionSummary.totalValue / 1000).toFixed(0)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="active">Active Batches</TabsTrigger>
          <TabsTrigger value="recipes">Recipe Library</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeBatches.map((batch) => (
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
                      <Badge variant="outline">{batch.recipeCode}</Badge>
                      <Badge variant="default" className="bg-blue-600 text-white">
                        {batch.stage}
                      </Badge>
                      <Badge
                        variant={batch.status === 'on-track' ? 'default' : 'secondary'}
                        className={batch.status === 'on-track' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}
                      >
                        {batch.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1 text-gray-700 group-hover:text-gray-800">
                      {batch.recipe} • {batch.targetQuantity} {batch.unit}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary group-hover:text-primary">{batch.progress}%</p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700">Complete</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <Progress value={batch.progress} className="h-3" />

                {/* Aging Progress */}
                {batch.stage === 'Aging' && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-600" />
                        <h4 className="font-semibold">Aging/Maturation Progress</h4>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-700">
                        Day {batch.agingDays} of {batch.totalAgingDays}
                      </Badge>
                    </div>
                    <Progress value={(batch.agingDays / batch.totalAgingDays) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Ready for bottling on {batch.estimatedCompletion}
                    </p>
                  </div>
                )}

                {/* Ingredients Used */}
                <div>
                  <h4 className="font-semibold mb-3">Ingredients Used (BOM):</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingredient</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Used</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batch.ingredients.map((ingredient, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{ingredient.name}</TableCell>
                          <TableCell>{ingredient.required} {ingredient.unit}</TableCell>
                          <TableCell className="font-semibold">{ingredient.used} {ingredient.unit}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Complete
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                  <span>Started: {batch.startDate}</span>
                  <span>Operator: {batch.operator}</span>
                  <span>ETA: {batch.estimatedCompletion}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="cursor-pointer hover:bg-blue-50 transition-colors group"
              onClick={() => {
                setSelectedRecipe(recipe);
                setIsRecipeDetailOpen(true);
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-gray-900 group-hover:text-gray-900">{recipe.name}</CardTitle>
                      <Badge variant="outline">{recipe.id}</Badge>
                      <Badge variant="secondary">v{recipe.version}</Badge>
                      <Badge variant="default" className="bg-green-600 text-white">{recipe.status}</Badge>
                    </div>
                    <CardDescription className="mt-1 text-gray-700 group-hover:text-gray-800">
                      {recipe.category} • {recipe.type} • {recipe.outputSize}{recipe.outputUnit} per unit
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 group-hover:text-green-700">{recipe.margin}%</p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700">Margin</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recipe Summary */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cost per Unit</p>
                    <p className="text-xl font-bold">AED {recipe.costPerUnit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Selling Price</p>
                    <p className="text-xl font-bold text-green-600">AED {recipe.sellingPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Aging Time</p>
                    <p className="text-xl font-bold">{recipe.agingTime} {recipe.agingUnit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Batches Produced</p>
                    <p className="text-xl font-bold">{recipe.totalBatches}</p>
                  </div>
                </div>

                {/* Bill of Materials */}
                <div>
                  <h4 className="font-semibold mb-3">Bill of Materials (BOM) - Per Unit:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingredient/Component</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipe.bom.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.ingredient}</TableCell>
                          <TableCell>{item.quantity} {item.unit}</TableCell>
                          <TableCell>AED {item.cost}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{((item.cost / recipe.costPerUnit) * 100).toFixed(1)}%</span>
                              <Progress value={(item.cost / recipe.costPerUnit) * 100} className="w-16 h-2" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm text-muted-foreground">
                    Last produced: {recipe.lastProduced}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit Recipe</Button>
                    <Button size="sm">Start Production</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBatches.map((batch) => (
            <Card key={batch.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>{batch.id}</CardTitle>
                      <Badge variant="outline">{batch.recipeCode}</Badge>
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {batch.recipe} • {batch.completedDate}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">AED {batch.totalValue?.toLocaleString() || "0"}</p>
                    <p className="text-xs text-muted-foreground">Total value</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Batch Summary */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Units</p>
                    <p className="text-xl font-bold">{batch.totalUnits}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Yield Rate</p>
                    <p className="text-xl font-bold text-green-600">{batch.yieldRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Quality Score</p>
                    <p className="text-xl font-bold text-blue-600">{batch.qualityScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Aging Days</p>
                    <p className="text-xl font-bold">{batch.agingDays}</p>
                  </div>
                </div>

                {/* Multi-Size Bottling Output */}
                <div>
                  <h4 className="font-semibold mb-3">Bottled Output (Multi-Size):</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Size/Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batch.outputs.map((output, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{output.size}</TableCell>
                          <TableCell className="font-semibold">{output.quantity} units</TableCell>
                          <TableCell className="font-mono text-sm">{output.sku}</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            AED {output.value?.toLocaleString() || "0"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Success Badge */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Batch completed and added to inventory</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {batch.totalUnits} units • {batch.outputs.length} SKUs created
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Perfume Production Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Beaker className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Recipe & BOM Management</h3>
                <p className="text-xs text-muted-foreground">
                  Define precise formulas with ingredient quantities and costs
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Aging/Maturation Tracking</h3>
                <p className="text-xs text-muted-foreground">
                  Track aging cycles with automatic completion alerts
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Multi-Size Bottling</h3>
                <p className="text-xs text-muted-foreground">
                  Create multiple SKUs from single batch (50ml, 100ml, samples)
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Auto Cost Calculation</h3>
                <p className="text-xs text-muted-foreground">
                  Automatic cost-per-unit including materials, packaging & labor
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Detail Dialog */}
      <Dialog open={isBatchDetailOpen} onOpenChange={setIsBatchDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Production Batch - {selectedBatch?.id}</DialogTitle>
            <DialogDescription>
              Complete perfume production batch information
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    Batch Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batch ID:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recipe:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.recipe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recipe Code:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.recipeCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Stage:</span>
                      <Badge variant="default" className="bg-blue-600 text-white">{selectedBatch.stage}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operator:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.operator}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <Package className="h-4 w-4 text-primary" />
                    Production Status
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-bold text-primary">{selectedBatch.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Quantity:</span>
                      <span className="font-bold text-gray-900">{selectedBatch.targetQuantity} {selectedBatch.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Quantity:</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.currentQuantity} {selectedBatch.unit}</span>
                    </div>
                    {selectedBatch.stage === 'Aging' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aging Progress:</span>
                          <span className="font-semibold text-amber-600">Day {selectedBatch.agingDays} / {selectedBatch.totalAgingDays}</span>
                        </div>
                        <Progress value={(selectedBatch.agingDays / selectedBatch.totalAgingDays) * 100} className="w-full" />
                      </>
                    )}
                  </div>
                </Card>
              </div>

              {/* Ingredients Table */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Ingredients Used (BOM)</h3>
                <Table className="table-modern">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingredient</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBatch.ingredients.map((ingredient: any, index: number) => (
                      <TableRow key={index} className="group">
                        <TableCell className="font-medium text-gray-900 group-hover:text-gray-900">{ingredient.name}</TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">{ingredient.required} {ingredient.unit}</TableCell>
                        <TableCell className="font-semibold text-gray-900 group-hover:text-gray-900">{ingredient.used} {ingredient.unit}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Timeline */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Production Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Started</p>
                      <p className="text-xs text-gray-600">{selectedBatch.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Current: {selectedBatch.stage}</p>
                      <Progress value={selectedBatch.progress} className="w-full mt-2" />
                      <p className="text-xs text-gray-600 mt-1">{selectedBatch.progress}% complete</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-500">Expected Completion</p>
                      <p className="text-xs text-gray-600">{selectedBatch.estimatedCompletion}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline">
                  Update Stage
                </Button>
                <Button>
                  {selectedBatch.stage === 'Aging' ? 'Complete Aging' : 'Mark Complete'}
                </Button>
                <Button variant="outline" onClick={() => setIsBatchDetailOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recipe Detail Dialog */}
      <Dialog open={isRecipeDetailOpen} onOpenChange={setIsRecipeDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recipe - {selectedRecipe?.name}</DialogTitle>
            <DialogDescription>
              Complete recipe formulation and costing
            </DialogDescription>
          </DialogHeader>
          {selectedRecipe && (
            <div className="space-y-6">
              {/* Recipe Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    Recipe Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recipe ID:</span>
                      <span className="font-semibold text-gray-900">{selectedRecipe.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold text-gray-900">{selectedRecipe.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold text-gray-900">{selectedRecipe.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold text-gray-900">{selectedRecipe.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <Badge variant="secondary">v{selectedRecipe.version}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="default" className="bg-green-600 text-white">{selectedRecipe.status}</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Costing & Profitability
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Output Size:</span>
                      <span className="font-bold text-gray-900">{selectedRecipe.outputSize}{selectedRecipe.outputUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost per Unit:</span>
                      <span className="font-semibold text-gray-900">AED {selectedRecipe.costPerUnit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selling Price:</span>
                      <span className="font-bold text-green-600">AED {selectedRecipe.sellingPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Margin:</span>
                      <span className="font-bold text-green-600">{selectedRecipe.margin}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yield per Batch:</span>
                      <span className="font-semibold text-gray-900">{selectedRecipe.yieldPerBatch} units</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Bill of Materials */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Bill of Materials (BOM)</h3>
                <Table className="table-modern">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingredient</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRecipe.bom.map((item: any, index: number) => (
                      <TableRow key={index} className="group">
                        <TableCell className="font-medium text-gray-900 group-hover:text-gray-900">{item.ingredient}</TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">{item.quantity} {item.unit}</TableCell>
                        <TableCell className="font-semibold text-gray-900 group-hover:text-gray-900">AED {item.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Production Info */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 bg-blue-50 border border-blue-200">
                  <p className="text-xs text-gray-700 mb-1">Aging Time</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedRecipe.agingTime} {selectedRecipe.agingUnit}</p>
                </Card>
                <Card className="p-4 bg-green-50 border border-green-200">
                  <p className="text-xs text-gray-700 mb-1">Total Batches</p>
                  <p className="text-2xl font-bold text-green-600">{selectedRecipe.totalBatches}</p>
                </Card>
                <Card className="p-4 bg-purple-50 border border-purple-200">
                  <p className="text-xs text-gray-700 mb-1">Last Used</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedRecipe.lastUsed}</p>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline">
                  Clone Recipe
                </Button>
                <Button variant="outline">
                  Edit Recipe
                </Button>
                <Button>
                  Start New Batch
                </Button>
                <Button variant="outline" onClick={() => setIsRecipeDetailOpen(false)}>
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
