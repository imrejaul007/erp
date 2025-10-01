'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowRightLeft, Calculator, Info, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ConversionRule {
  fromUnit: string
  toUnit: string
  factor: number
  label: string
  category: 'weight' | 'volume' | 'count'
}

interface UnitConverterProps {
  materialId?: string
  materialName?: string
  density?: number // g/ml for volume to weight conversions
  onConversionChange?: (result: ConversionResult) => void
  showMaterialSpecific?: boolean
  defaultFromUnit?: string
  defaultToUnit?: string
  defaultValue?: number
}

interface ConversionResult {
  originalValue: number
  convertedValue: number
  fromUnit: string
  toUnit: string
  factor: number
  formula: string
}

const STANDARD_CONVERSIONS: ConversionRule[] = [
  // Weight conversions
  { fromUnit: 'gram', toUnit: 'kilogram', factor: 0.001, label: 'g → kg', category: 'weight' },
  { fromUnit: 'kilogram', toUnit: 'gram', factor: 1000, label: 'kg → g', category: 'weight' },
  { fromUnit: 'gram', toUnit: 'tola', factor: 0.085735, label: 'g → tola', category: 'weight' },
  { fromUnit: 'tola', toUnit: 'gram', factor: 11.66, label: 'tola → g', category: 'weight' },
  { fromUnit: 'kilogram', toUnit: 'tola', factor: 85.735, label: 'kg → tola', category: 'weight' },
  { fromUnit: 'tola', toUnit: 'kilogram', factor: 0.01166, label: 'tola → kg', category: 'weight' },

  // Volume conversions
  { fromUnit: 'ml', toUnit: 'liter', factor: 0.001, label: 'ml → L', category: 'volume' },
  { fromUnit: 'liter', toUnit: 'ml', factor: 1000, label: 'L → ml', category: 'volume' },

  // Count conversions
  { fromUnit: 'piece', toUnit: 'dozen', factor: 0.0833, label: 'pc → dozen', category: 'count' },
  { fromUnit: 'dozen', toUnit: 'piece', factor: 12, label: 'dozen → pc', category: 'count' },
]

const UNIT_CATEGORIES = {
  weight: ['gram', 'kilogram', 'tola'],
  volume: ['ml', 'liter'],
  count: ['piece', 'dozen', 'bottle', 'vial'],
}

const UNIT_SYMBOLS = {
  gram: 'g',
  kilogram: 'kg',
  tola: 'tola',
  ml: 'ml',
  liter: 'L',
  piece: 'pc',
  dozen: 'dz',
  bottle: 'btl',
  vial: 'vial',
}

export function UnitConverter({
  materialId,
  materialName,
  density = 1.0, // Default density for oil-based perfumes
  onConversionChange,
  showMaterialSpecific = true,
  defaultFromUnit = 'gram',
  defaultToUnit = 'tola',
  defaultValue = 100,
}: UnitConverterProps) {
  const [inputValue, setInputValue] = useState(defaultValue.toString())
  const [fromUnit, setFromUnit] = useState(defaultFromUnit)
  const [toUnit, setToUnit] = useState(defaultToUnit)
  const [conversionHistory, setConversionHistory] = useState<ConversionResult[]>([])

  // Get all available units
  const allUnits = useMemo(() => {
    return Object.values(UNIT_CATEGORIES).flat()
  }, [])

  // Get conversion factor between two units
  const getConversionFactor = useCallback((from: string, to: string): number | null => {
    if (from === to) return 1

    // Check standard conversions
    const directConversion = STANDARD_CONVERSIONS.find(
      rule => rule.fromUnit === from && rule.toUnit === to
    )
    if (directConversion) return directConversion.factor

    // Check reverse conversion
    const reverseConversion = STANDARD_CONVERSIONS.find(
      rule => rule.fromUnit === to && rule.toUnit === from
    )
    if (reverseConversion) return 1 / reverseConversion.factor

    // Volume to weight conversion using density
    if ((from === 'ml' && to === 'gram') || (from === 'liter' && to === 'kilogram')) {
      return density
    }
    if ((from === 'gram' && to === 'ml') || (from === 'kilogram' && to === 'liter')) {
      return 1 / density
    }

    // Complex conversions (ml to tola through grams)
    if (from === 'ml' && to === 'tola') {
      return (density * 0.085735) // ml → g → tola
    }
    if (from === 'tola' && to === 'ml') {
      return (11.66 / density) // tola → g → ml
    }

    return null
  }, [density])

  // Perform conversion
  const performConversion = useCallback(() => {
    const value = parseFloat(inputValue)
    if (isNaN(value) || value < 0) return null

    const factor = getConversionFactor(fromUnit, toUnit)
    if (factor === null) return null

    const convertedValue = value * factor
    const formula = `${value} ${UNIT_SYMBOLS[fromUnit as keyof typeof UNIT_SYMBOLS]} × ${factor} = ${convertedValue.toFixed(4)} ${UNIT_SYMBOLS[toUnit as keyof typeof UNIT_SYMBOLS]}`

    const result: ConversionResult = {
      originalValue: value,
      convertedValue,
      fromUnit,
      toUnit,
      factor,
      formula,
    }

    onConversionChange?.(result)
    return result
  }, [inputValue, fromUnit, toUnit, getConversionFactor, onConversionChange])

  // Convert and update result
  const conversionResult = useMemo(() => {
    return performConversion()
  }, [performConversion])

  // Add to history
  const addToHistory = () => {
    const result = performConversion()
    if (result) {
      setConversionHistory(prev => [result, ...prev.slice(0, 4)]) // Keep last 5
    }
  }

  // Swap units
  const swapUnits = () => {
    const tempUnit = fromUnit
    setFromUnit(toUnit)
    setToUnit(tempUnit)
  }

  // Get unit category
  const getUnitCategory = (unit: string): 'weight' | 'volume' | 'count' => {
    for (const [category, units] of Object.entries(UNIT_CATEGORIES)) {
      if (units.includes(unit)) {
        return category as 'weight' | 'volume' | 'count'
      }
    }
    return 'count'
  }

  // Check if conversion is possible
  const isConversionPossible = getConversionFactor(fromUnit, toUnit) !== null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Unit Converter
            {materialName && (
              <Badge variant="outline" className="ml-2">
                {materialName}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Convert between different units with automatic factor calculation
            {density !== 1.0 && (
              <span className="block text-sm text-muted-foreground mt-1">
                Using density: {density} g/ml
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="input-value">Value</Label>
              <Input
                id="input-value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                min="0"
                step="any"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="from-unit">From Unit</Label>
              <div className="flex gap-2">
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(UNIT_CATEGORIES).map(([category, units]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                          {category}
                        </div>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit} ({UNIT_SYMBOLS[unit as keyof typeof UNIT_SYMBOLS]})
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapUnits}
                  className="shrink-0"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-unit">To Unit</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(UNIT_CATEGORIES).map(([category, units]) => (
                    <div key={category}>
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                        {category}
                      </div>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit} ({UNIT_SYMBOLS[unit as keyof typeof UNIT_SYMBOLS]})
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversion Warning */}
          {!isConversionPossible && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Direct conversion between {fromUnit} and {toUnit} is not available.
                {getUnitCategory(fromUnit) !== getUnitCategory(toUnit) && (
                  <span>
                    {' '}Converting between different categories may require material-specific properties.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Result Section */}
          {conversionResult && isConversionPossible && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  {conversionResult.convertedValue.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })}{' '}
                  <span className="text-muted-foreground">
                    {UNIT_SYMBOLS[toUnit as keyof typeof UNIT_SYMBOLS]}
                  </span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addToHistory}
                >
                  Save to History
                </Button>
              </div>

              <div className="text-sm text-muted-foreground font-mono">
                {conversionResult.formula}
              </div>

              {/* Quick Reference */}
              <div className="flex gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">
                  1 {UNIT_SYMBOLS[fromUnit as keyof typeof UNIT_SYMBOLS]} = {conversionResult.factor} {UNIT_SYMBOLS[toUnit as keyof typeof UNIT_SYMBOLS]}
                </Badge>
                <Badge variant="secondary">
                  1 {UNIT_SYMBOLS[toUnit as keyof typeof UNIT_SYMBOLS]} = {(1/conversionResult.factor).toFixed(4)} {UNIT_SYMBOLS[fromUnit as keyof typeof UNIT_SYMBOLS]}
                </Badge>
              </div>
            </div>
          )}

          {/* Common Conversions Quick Reference */}
          {showMaterialSpecific && (
            <div className="space-y-3">
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Quick Reference - Perfume & Oud Units
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="bg-muted/30 p-2 rounded">
                    <div className="font-medium">1 Tola</div>
                    <div className="text-muted-foreground">= 11.66 grams</div>
                  </div>
                  <div className="bg-muted/30 p-2 rounded">
                    <div className="font-medium">1 Gram Oil</div>
                    <div className="text-muted-foreground">≈ {(1/density).toFixed(2)} ml</div>
                  </div>
                  <div className="bg-muted/30 p-2 rounded">
                    <div className="font-medium">1 Tola Oil</div>
                    <div className="text-muted-foreground">≈ {(11.66/density).toFixed(1)} ml</div>
                  </div>
                  <div className="bg-muted/30 p-2 rounded">
                    <div className="font-medium">1 ml Oil</div>
                    <div className="text-muted-foreground">≈ {density} grams</div>
                  </div>
                  <div className="bg-muted/30 p-2 rounded">
                    <div className="font-medium">12 Tola</div>
                    <div className="text-muted-foreground">= 139.9 grams</div>
                  </div>
                  <div className="bg-muted/30 p-2 rounded">
                    <div className="font-medium">1 kg</div>
                    <div className="text-muted-foreground">= 85.7 tola</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conversion History */}
          {conversionHistory.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Recent Conversions</h4>
                <div className="space-y-2">
                  {conversionHistory.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm bg-muted/30 p-2 rounded"
                    >
                      <span className="font-mono text-xs">
                        {item.formula}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setInputValue(item.originalValue.toString())
                          setFromUnit(item.fromUnit)
                          setToUnit(item.toUnit)
                        }}
                      >
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}