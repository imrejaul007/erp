'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  Info,
  Download,
  RefreshCcw
} from 'lucide-react';
import { RecipeIngredient, RecipeCalculation, IngredientCost } from '@/types/production';

interface RecipeCalculatorProps {
  ingredients: RecipeIngredient[];
  yieldQuantity: number;
  yieldUnit: string;
  batchMultiplier?: number;
  onCalculationUpdate?: (calculation: RecipeCalculation) => void;
}

const RecipeCalculator: React.FC<RecipeCalculatorProps> = ({
  ingredients,
  yieldQuantity,
  yieldUnit,
  batchMultiplier = 1,
  onCalculationUpdate
}) => {
  const [customBatchSize, setCustomBatchSize] = useState(batchMultiplier);
  const [profitMargin, setProfitMargin] = useState(30); // 30% default margin
  const [overheadPercentage, setOverheadPercentage] = useState(15); // 15% overhead

  // Calculate ingredient costs
  const ingredientCosts: IngredientCost[] = useMemo(() => {
    return ingredients.map(ingredient => {
      const quantity = ingredient.quantity * customBatchSize;
      const unitCost = ingredient.material.costPerUnit;
      const totalCost = quantity * unitCost;
      const totalQuantityAllIngredients = ingredients.reduce((sum, ing) =>
        sum + (ing.quantity * customBatchSize), 0
      );
      const percentage = totalQuantityAllIngredients > 0 ? (quantity / totalQuantityAllIngredients) * 100 : 0;

      return {
        materialId: ingredient.materialId,
        materialName: ingredient.material.name,
        quantity,
        unit: ingredient.unit,
        unitCost,
        totalCost,
        percentage
      };
    });
  }, [ingredients, customBatchSize]);

  // Calculate totals
  const calculations: RecipeCalculation = useMemo(() => {
    const totalCost = ingredientCosts.reduce((sum, cost) => sum + cost.totalCost, 0);
    const totalYield = yieldQuantity * customBatchSize;
    const costPerUnit = totalYield > 0 ? totalCost / totalYield : 0;

    return {
      totalCost,
      costPerUnit,
      ingredientCosts,
      yield: {
        quantity: totalYield,
        unit: yieldUnit
      }
    };
  }, [ingredientCosts, yieldQuantity, yieldUnit, customBatchSize]);

  // Calculate pricing with margins
  const pricingCalculations = useMemo(() => {
    const materialCost = calculations.totalCost;
    const overheadCost = materialCost * (overheadPercentage / 100);
    const totalCostWithOverhead = materialCost + overheadCost;
    const sellingPrice = totalCostWithOverhead * (1 + profitMargin / 100);
    const sellingPricePerUnit = calculations.yield.quantity > 0
      ? sellingPrice / calculations.yield.quantity
      : 0;

    return {
      materialCost,
      overheadCost,
      totalCostWithOverhead,
      sellingPrice,
      sellingPricePerUnit,
      profitAmount: sellingPrice - totalCostWithOverhead,
      profitPerUnit: sellingPricePerUnit - (totalCostWithOverhead / calculations.yield.quantity)
    };
  }, [calculations, profitMargin, overheadPercentage]);

  // Update parent component when calculations change
  useEffect(() => {
    if (onCalculationUpdate) {
      onCalculationUpdate(calculations);
    }
  }, [calculations, onCalculationUpdate]);

  // Check ingredient availability
  const availabilityIssues = useMemo(() => {
    return ingredientCosts.filter(cost => {
      const material = ingredients.find(ing => ing.materialId === cost.materialId)?.material;
      return material && material.currentStock < cost.quantity;
    });
  }, [ingredientCosts, ingredients]);

  const exportCalculation = () => {
    const data = {
      calculations,
      pricingCalculations,
      settings: {
        batchSize: customBatchSize,
        profitMargin,
        overheadPercentage
      },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipe-calculation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (ingredients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Calculator className="w-12 h-12 mb-4 opacity-50" />
          <p>Add ingredients to see cost calculations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calculation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculation Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="batchSize">Batch Multiplier</Label>
              <Input
                id="batchSize"
                type="number"
                step="0.1"
                min="0.1"
                value={customBatchSize}
                onChange={(e) => setCustomBatchSize(parseFloat(e.target.value) || 1)}
              />
              <p className="text-sm text-gray-500 mt-1">
                1.0 = single batch, 2.0 = double batch
              </p>
            </div>
            <div>
              <Label htmlFor="profitMargin">Profit Margin (%)</Label>
              <Input
                id="profitMargin"
                type="number"
                step="1"
                min="0"
                max="100"
                value={profitMargin}
                onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="overhead">Overhead (%)</Label>
              <Input
                id="overhead"
                type="number"
                step="1"
                min="0"
                max="100"
                value={overheadPercentage}
                onChange={(e) => setOverheadPercentage(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Warnings */}
      {availabilityIssues.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              Stock Availability Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availabilityIssues.map(issue => {
                const material = ingredients.find(ing => ing.materialId === issue.materialId)?.material;
                return (
                  <div key={issue.materialId} className="flex items-center justify-between p-3 bg-white rounded-md">
                    <div>
                      <p className="font-medium">{issue.materialName}</p>
                      <p className="text-sm text-gray-600">
                        Required: {issue.quantity} {issue.unit} |
                        Available: {material?.currentStock || 0} {material?.unitOfMeasure || issue.unit}
                      </p>
                    </div>
                    <Badge variant="destructive">Insufficient Stock</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingredient Costs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Ingredient Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ingredientCosts.map(cost => (
                <div key={cost.materialId} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{cost.materialName}</h4>
                    <Badge variant="outline">
                      ${cost.totalCost.toFixed(2)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                    <div>Qty: {cost.quantity} {cost.unit}</div>
                    <div>Unit: ${cost.unitCost.toFixed(2)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Progress value={cost.percentage} className="flex-1" />
                    <span className="text-sm font-medium">
                      {cost.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total Material Cost:</span>
                <span>${calculations.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Cost Summary & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Yield Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Expected Yield</h4>
                <div className="text-2xl font-bold text-blue-700">
                  {calculations.yield.quantity} {calculations.yield.unit}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Material Cost:</span>
                  <span className="font-medium">${pricingCalculations.materialCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overhead ({overheadPercentage}%):</span>
                  <span className="font-medium">${pricingCalculations.overheadCost.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Cost:</span>
                  <span>${pricingCalculations.totalCostWithOverhead.toFixed(2)}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-green-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-green-800">Suggested Pricing</h4>
                <div className="flex justify-between">
                  <span>Selling Price (Total):</span>
                  <span className="font-bold text-green-700">
                    ${pricingCalculations.sellingPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Price per {yieldUnit}:</span>
                  <span className="font-bold text-green-700">
                    ${pricingCalculations.sellingPricePerUnit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Profit ({profitMargin}%):</span>
                  <span className="font-medium">
                    ${pricingCalculations.profitAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Per Unit Costs */}
              <div className="border rounded-lg p-3 bg-gray-50">
                <h4 className="font-medium mb-2">Per Unit Breakdown</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Cost per {yieldUnit}:</span>
                    <span>${calculations.costPerUnit.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit per {yieldUnit}:</span>
                    <span>${pricingCalculations.profitPerUnit.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <Info className="w-4 h-4 inline mr-1" />
              Calculations are based on current material costs and stock levels
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" onClick={exportCalculation}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingredients</p>
                <p className="text-2xl font-bold">{ingredients.length}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Material Cost</p>
                <p className="text-2xl font-bold">${calculations.totalCost.toFixed(0)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold">{profitMargin}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Yield</p>
                <p className="text-lg font-bold">
                  {calculations.yield.quantity} {calculations.yield.unit}
                </p>
              </div>
              <Calculator className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeCalculator;