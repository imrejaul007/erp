'use client';

import React, { useState } from 'react';
import { Scale, Calculator, ArrowRightLeft, Droplets, Package, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Unit conversion rates (base unit: grams for weight, ml for volume)
const unitConversions = {
  weight: {
    'g': { name: 'Grams', factor: 1, symbol: 'g' },
    'tola': { name: 'Tola', factor: 11.6638, symbol: 'tola' },
    'oz': { name: 'Ounces', factor: 28.3495, symbol: 'oz' },
    'lb': { name: 'Pounds', factor: 453.592, symbol: 'lb' },
    'kg': { name: 'Kilograms', factor: 1000, symbol: 'kg' },
    'ct': { name: 'Carats', factor: 0.2, symbol: 'ct' },
    'grain': { name: 'Grains', factor: 0.0647989, symbol: 'gr' },
  },
  volume: {
    'ml': { name: 'Milliliters', factor: 1, symbol: 'ml' },
    'l': { name: 'Liters', factor: 1000, symbol: 'L' },
    'fl_oz': { name: 'Fluid Ounces', factor: 29.5735, symbol: 'fl oz' },
    'cup': { name: 'Cups', factor: 236.588, symbol: 'cup' },
    'pint': { name: 'Pints', factor: 473.176, symbol: 'pt' },
    'quart': { name: 'Quarts', factor: 946.353, symbol: 'qt' },
    'gallon': { name: 'Gallons', factor: 3785.41, symbol: 'gal' },
    'drop': { name: 'Drops', factor: 0.05, symbol: 'drop' },
  }
};

// Common conversions for perfume/oud industry
const commonConversions = [
  { from: 'tola', to: 'g', category: 'weight', description: 'Traditional Middle Eastern weight unit' },
  { from: 'ml', to: 'fl_oz', category: 'volume', description: 'Perfume bottle volumes' },
  { from: 'g', to: 'oz', category: 'weight', description: 'Oud and solid perfume weights' },
  { from: 'drop', to: 'ml', category: 'volume', description: 'Essential oil drops to volume' },
];

const formatNumber = (num: number): string => {
  return num.toFixed(6).replace(/\.?0+$/, '');
};

export default function UnitConversionPage() {
  const [fromUnit, setFromUnit] = useState('tola');
  const [toUnit, setToUnit] = useState('g');
  const [fromValue, setFromValue] = useState(1);
  const [category, setCategory] = useState<'weight' | 'volume'>('weight');
  const [customCalculations, setCustomCalculations] = useState<Array<{
    id: string;
    description: string;
    fromValue: number;
    fromUnit: string;
    toValue: number;
    toUnit: string;
    category: string;
  }>>([]);

  const convertUnits = (value: number, from: string, to: string, cat: 'weight' | 'volume'): number => {
    const units = unitConversions[cat];
    const fromFactor = units[from]?.factor || 1;
    const toFactor = units[to]?.factor || 1;

    // Convert to base unit first, then to target unit
    const baseValue = value * fromFactor;
    return baseValue / toFactor;
  };

  const result = convertUnits(fromValue, fromUnit, toUnit, category);

  const addToCalculations = () => {
    if (fromValue && fromUnit && toUnit) {
      const newCalculation = {
        id: Date.now().toString(),
        description: `${fromValue} ${unitConversions[category][fromUnit].symbol} to ${unitConversions[category][toUnit].symbol}`,
        fromValue,
        fromUnit,
        toValue: result,
        toUnit,
        category,
      };
      setCustomCalculations([newCalculation, ...customCalculations.slice(0, 9)]); // Keep last 10
    }
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(result);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Scale className="h-8 w-8 text-oud-600" />
            Unit Conversion Calculator
          </h1>
          <p className="text-muted-foreground mt-1">
            Convert between tola, grams, milliliters and other units used in perfume industry
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Converter */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Unit Converter
            </CardTitle>
            <CardDescription>
              Convert between different units of measurement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Selection */}
            <div className="flex justify-center">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={category === 'weight' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setCategory('weight');
                    setFromUnit('tola');
                    setToUnit('g');
                  }}
                  className="flex items-center gap-2"
                >
                  <Scale className="h-4 w-4" />
                  Weight
                </Button>
                <Button
                  variant={category === 'volume' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setCategory('volume');
                    setFromUnit('ml');
                    setToUnit('fl_oz');
                  }}
                  className="flex items-center gap-2"
                >
                  <Droplets className="h-4 w-4" />
                  Volume
                </Button>
              </div>
            </div>

            {/* Conversion Input */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="from-value">From</Label>
                <div className="flex gap-2">
                  <Input
                    id="from-value"
                    type="number"
                    step="any"
                    value={fromValue}
                    onChange={(e) => setFromValue(parseFloat(e.target.value) || 0)}
                    placeholder="Enter value"
                    className="flex-1"
                  />
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitConversions[category]).map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapUnits}
                  className="shrink-0"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="to-value">To</Label>
                <div className="flex gap-2">
                  <Input
                    id="to-value"
                    type="number"
                    value={formatNumber(result)}
                    readOnly
                    className="flex-1 bg-gray-50"
                  />
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitConversions[category]).map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Result Display */}
            <div className="bg-oud-50 p-4 rounded-lg border border-oud-200">
              <div className="text-center">
                <p className="text-lg">
                  <span className="font-bold">{fromValue}</span> {unitConversions[category][fromUnit].name} =
                </p>
                <p className="text-2xl font-bold text-oud-600 mt-1">
                  {formatNumber(result)} {unitConversions[category][toUnit].name}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={addToCalculations} variant="outline">
                Add to History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Conversions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Conversions</CardTitle>
            <CardDescription>
              Common conversions in perfume industry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {commonConversions.map((conversion, index) => {
              const converted = convertUnits(1, conversion.from, conversion.to, conversion.category);
              const fromUnit = unitConversions[conversion.category][conversion.from];
              const toUnit = unitConversions[conversion.category][conversion.to];

              return (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">
                      1 {fromUnit.symbol} = {formatNumber(converted)} {toUnit.symbol}
                    </span>
                    <Badge variant="outline">
                      {conversion.category === 'weight' ? 'Weight' : 'Volume'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{conversion.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for additional tools */}
      <Tabs defaultValue="reference" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reference">Reference Table</TabsTrigger>
          <TabsTrigger value="history">Calculation History</TabsTrigger>
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
        </TabsList>

        <TabsContent value="reference" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Weight Units
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(unitConversions.weight).map(([key, unit]) => (
                    <div key={key} className="flex justify-between items-center py-1">
                      <span>{unit.name} ({unit.symbol})</span>
                      <span className="text-sm text-muted-foreground">
                        {unit.factor !== 1 ? `${formatNumber(unit.factor)}g` : 'Base unit'}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="text-sm text-muted-foreground">
                  <p><strong>Tola:</strong> Traditional weight unit used in Middle East and South Asia for precious metals and perfumes.</p>
                  <p className="mt-1"><strong>1 Tola = 11.6638 grams</strong></p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Volume Units
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(unitConversions.volume).map(([key, unit]) => (
                    <div key={key} className="flex justify-between items-center py-1">
                      <span>{unit.name} ({unit.symbol})</span>
                      <span className="text-sm text-muted-foreground">
                        {unit.factor !== 1 ? `${formatNumber(unit.factor)}ml` : 'Base unit'}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="text-sm text-muted-foreground">
                  <p><strong>Drop:</strong> Approximate volume of a single drop, commonly used for essential oils.</p>
                  <p className="mt-1"><strong>1 Drop ≈ 0.05 ml</strong></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Calculations</CardTitle>
              <CardDescription>
                History of your recent unit conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customCalculations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No calculations yet</p>
                  <p className="text-sm">Use the converter above to start calculating</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customCalculations.map((calc) => (
                    <div key={calc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {calc.fromValue} {unitConversions[calc.category][calc.fromUnit].symbol} = {formatNumber(calc.toValue)} {unitConversions[calc.category][calc.toUnit].symbol}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {unitConversions[calc.category][calc.fromUnit].name} to {unitConversions[calc.category][calc.toUnit].name}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {calc.category === 'weight' ? 'Weight' : 'Volume'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Perfume Formulation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Essential Oil Dilution</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    To create a safe dilution percentage:
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    Essential Oil (ml) = Total Volume × (Desired % ÷ 100)
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Example: For 2% dilution in 50ml = 50 × (2 ÷ 100) = 1ml essential oil
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Perfume Concentration</h4>
                  <div className="space-y-1 text-sm">
                    <p>• Parfum/Extrait: 20-40% aromatic compounds</p>
                    <p>• Eau de Parfum: 15-20%</p>
                    <p>• Eau de Toilette: 5-15%</p>
                    <p>• Eau de Cologne: 2-4%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Oud Measurements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Traditional Oud Weights</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>1 Tola:</span>
                      <span>11.66 grams</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1 Masha:</span>
                      <span>0.97 grams (1/12 tola)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1 Ratti:</span>
                      <span>0.12 grams (1/8 masha)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Density Conversion</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For approximate volume to weight conversion:
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    Weight = Volume × Density
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Oud oil density: ~0.85-0.95 g/ml
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}