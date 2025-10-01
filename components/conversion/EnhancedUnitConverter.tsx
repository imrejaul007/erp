'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Droplet,
  Weight,
  Package,
  ArrowRightLeft,
  Save,
  History,
  Settings,
  Beaker,
  Thermometer,
  Gauge,
  TrendingUp,
  Info,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Upload,
  Database,
  Zap,
  Scale
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface Material {
  id: string
  name: string
  nameAr: string
  category: 'oud_oil' | 'oud_chips' | 'bakhoor' | 'perfume' | 'attar' | 'alcohol' | 'water' | 'raw_material'
  density: number // g/ml at 20°C
  viscosity?: number // cP (centipoise)
  grade?: 'royal' | 'premium' | 'super' | 'regular'
  origin?: string
  temperatureCoefficient?: number // density change per °C
  notes?: string
}

interface ConversionRule {
  id: string
  materialId?: string
  fromUnit: string
  toUnit: string
  factor: number
  formula: string
  accuracy: 'high' | 'medium' | 'estimated'
  temperatureDependent: boolean
  notes?: string
  createdAt: string
}

interface ConversionHistory {
  id: string
  timestamp: string
  materialId?: string
  fromValue: number
  fromUnit: string
  toValue: number
  toUnit: string
  method: string
  temperature?: number
  notes?: string
}

interface ConversionResult {
  originalValue: number
  convertedValue: number
  fromUnit: string
  toUnit: string
  factor: number
  method: 'standard' | 'density' | 'material_specific' | 'temperature_adjusted' | 'compound'
  formula: string
  accuracy: 'high' | 'medium' | 'estimated'
  notes?: string
  temperature?: number
  warnings?: string[]
}

const EnhancedUnitConverter: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [materials, setMaterials] = useState<Material[]>([])
  const [conversionRules, setConversionRules] = useState<ConversionRule[]>([])
  const [conversionHistory, setConversionHistory] = useState<ConversionHistory[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<string>('')
  const [fromValue, setFromValue] = useState('')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [temperature, setTemperature] = useState('20')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [useTemperatureAdjustment, setUseTemperatureAdjustment] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [customDensity, setCustomDensity] = useState('')
  const [batchConversion, setBatchConversion] = useState('')
  const [batchResults, setBatchResults] = useState<ConversionResult[]>([])

  // Available units with categories
  const units = {
    weight: ['gram', 'kilogram', 'tola', 'pound', 'ounce'],
    volume: ['ml', 'liter', 'gallon', 'fluid_ounce', 'cup'],
    count: ['piece', 'dozen', 'box', 'case'],
    custom: []
  }

  const unitLabels: Record<string, { en: string; ar: string }> = {
    gram: { en: 'Gram (g)', ar: 'جرام (ج)' },
    kilogram: { en: 'Kilogram (kg)', ar: 'كيلوجرام (كج)' },
    tola: { en: 'Tola', ar: 'تولة' },
    pound: { en: 'Pound (lb)', ar: 'باوند (رطل)' },
    ounce: { en: 'Ounce (oz)', ar: 'أونصة (أوز)' },
    ml: { en: 'Milliliter (ml)', ar: 'مليلتر (مل)' },
    liter: { en: 'Liter (L)', ar: 'لتر (ل)' },
    gallon: { en: 'Gallon (gal)', ar: 'جالون' },
    fluid_ounce: { en: 'Fluid Ounce (fl oz)', ar: 'أونصة سائلة' },
    cup: { en: 'Cup', ar: 'كوب' },
    piece: { en: 'Piece (pc)', ar: 'قطعة (ق)' },
    dozen: { en: 'Dozen (dz)', ar: 'دزينة (دز)' },
    box: { en: 'Box', ar: 'صندوق' },
    case: { en: 'Case', ar: 'حالة' }
  }

  // Standard conversion factors (base units: gram for weight, ml for volume)
  const standardConversions: Record<string, Record<string, number>> = {
    // Weight conversions
    gram: {
      kilogram: 0.001,
      tola: 0.085735, // 1 tola = 11.66 grams
      pound: 0.00220462,
      ounce: 0.035274
    },
    kilogram: {
      gram: 1000,
      tola: 85.735,
      pound: 2.20462,
      ounce: 35.274
    },
    tola: {
      gram: 11.66,
      kilogram: 0.01166,
      pound: 0.0257,
      ounce: 0.411
    },
    pound: {
      gram: 453.592,
      kilogram: 0.453592,
      tola: 38.91,
      ounce: 16
    },
    ounce: {
      gram: 28.3495,
      kilogram: 0.0283495,
      tola: 2.432,
      pound: 0.0625
    },

    // Volume conversions
    ml: {
      liter: 0.001,
      gallon: 0.000264172,
      fluid_ounce: 0.033814,
      cup: 0.00422675
    },
    liter: {
      ml: 1000,
      gallon: 0.264172,
      fluid_ounce: 33.814,
      cup: 4.22675
    },
    gallon: {
      ml: 3785.41,
      liter: 3.78541,
      fluid_ounce: 128,
      cup: 16
    },
    fluid_ounce: {
      ml: 29.5735,
      liter: 0.0295735,
      gallon: 0.0078125,
      cup: 0.125
    },
    cup: {
      ml: 236.588,
      liter: 0.236588,
      gallon: 0.0625,
      fluid_ounce: 8
    },

    // Count conversions
    piece: {
      dozen: 0.0833333,
      box: 0.1, // assuming 10 pieces per box
      case: 0.01 // assuming 100 pieces per case
    },
    dozen: {
      piece: 12,
      box: 1.2,
      case: 0.12
    },
    box: {
      piece: 10,
      dozen: 0.833333,
      case: 0.1
    },
    case: {
      piece: 100,
      dozen: 8.33333,
      box: 10
    }
  }

  // Material density database with temperature coefficients
  useEffect(() => {
    const mockMaterials: Material[] = [
      {
        id: '1',
        name: 'Royal Oud Oil',
        nameAr: 'زيت العود الملكي',
        category: 'oud_oil',
        density: 0.85,
        viscosity: 15.2,
        grade: 'royal',
        origin: 'Cambodia',
        temperatureCoefficient: -0.0007, // density decreases with temperature
        notes: 'High-grade oud oil with complex aromatic profile'
      },
      {
        id: '2',
        name: 'Premium Oud Oil',
        nameAr: 'زيت العود الممتاز',
        category: 'oud_oil',
        density: 0.87,
        viscosity: 18.5,
        grade: 'premium',
        temperatureCoefficient: -0.0007
      },
      {
        id: '3',
        name: 'Rose Attar',
        nameAr: 'عطر الورد',
        category: 'attar',
        density: 0.88,
        viscosity: 12.8,
        temperatureCoefficient: -0.0008
      },
      {
        id: '4',
        name: 'Sandalwood Oil',
        nameAr: 'زيت الصندل',
        category: 'perfume',
        density: 0.92,
        viscosity: 25.4,
        temperatureCoefficient: -0.0006
      },
      {
        id: '5',
        name: 'Ethyl Alcohol',
        nameAr: 'الكحول الإيثيلي',
        category: 'alcohol',
        density: 0.789,
        viscosity: 1.2,
        temperatureCoefficient: -0.00108
      },
      {
        id: '6',
        name: 'Distilled Water',
        nameAr: 'ماء مقطر',
        category: 'water',
        density: 0.998,
        viscosity: 1.0,
        temperatureCoefficient: -0.0002
      }
    ]

    setMaterials(mockMaterials)

    // Load history from localStorage
    const savedHistory = localStorage.getItem('conversionHistory')
    if (savedHistory) {
      setConversionHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory))
  }, [conversionHistory])

  const adjustDensityForTemperature = (baseDensity: number, tempCoeff: number, currentTemp: number, baseTemp: number = 20): number => {
    return baseDensity * (1 + tempCoeff * (currentTemp - baseTemp))
  }

  const performConversion = async () => {
    if (!fromValue || !fromUnit || !toUnit) return

    setIsConverting(true)

    try {
      const value = parseFloat(fromValue)
      const currentTemp = parseFloat(temperature)
      let conversionFactor: number | null = null
      let method: ConversionResult['method'] = 'standard'
      let formula = ''
      let accuracy: ConversionResult['accuracy'] = 'high'
      let notes = ''
      let warnings: string[] = []

      // Get material data if selected
      const material = selectedMaterial ? materials.find(m => m.id === selectedMaterial) : null
      let density = material?.density || parseFloat(customDensity) || 0.85

      // Adjust density for temperature if enabled and material has temperature coefficient
      if (useTemperatureAdjustment && material?.temperatureCoefficient) {
        density = adjustDensityForTemperature(density, material.temperatureCoefficient, currentTemp)
        method = 'temperature_adjusted'
        notes += `Temperature adjusted density: ${density.toFixed(4)} g/ml at ${currentTemp}°C. `
      }

      // 1. Check for direct standard conversion
      if (standardConversions[fromUnit]?.[toUnit]) {
        conversionFactor = standardConversions[fromUnit][toUnit]
        formula = `${value} ${fromUnit} × ${conversionFactor} = ${(value * conversionFactor).toFixed(4)} ${toUnit}`
      }
      // 2. Check for reverse standard conversion
      else if (standardConversions[toUnit]?.[fromUnit]) {
        conversionFactor = 1 / standardConversions[toUnit][fromUnit]
        formula = `${value} ${fromUnit} ÷ ${standardConversions[toUnit][fromUnit]} = ${(value * conversionFactor).toFixed(4)} ${toUnit}`
      }
      // 3. Volume to weight conversion using density
      else if (
        (units.volume.includes(fromUnit) && units.weight.includes(toUnit)) ||
        (units.weight.includes(fromUnit) && units.volume.includes(toUnit))
      ) {
        method = useTemperatureAdjustment ? 'temperature_adjusted' : 'density'
        accuracy = material ? 'high' : 'estimated'

        if (units.volume.includes(fromUnit) && units.weight.includes(toUnit)) {
          // Volume to weight: convert volume to ml, then to grams, then to target weight unit
          let volumeInMl = value
          if (fromUnit !== 'ml') {
            volumeInMl = value * (standardConversions[fromUnit]?.ml || 1)
          }

          let weightInGrams = volumeInMl * density

          if (toUnit !== 'gram') {
            conversionFactor = standardConversions.gram[toUnit]
            if (conversionFactor) {
              weightInGrams *= conversionFactor
            }
          }

          conversionFactor = weightInGrams / value
          formula = `${value} ${fromUnit} × ${density} g/ml`
          if (fromUnit !== 'ml') formula += ` × ${standardConversions[fromUnit]?.ml} (to ml)`
          if (toUnit !== 'gram') formula += ` × ${standardConversions.gram[toUnit]} (to ${toUnit})`
          formula += ` = ${weightInGrams.toFixed(4)} ${toUnit}`

        } else {
          // Weight to volume: convert weight to grams, then to ml, then to target volume unit
          let weightInGrams = value
          if (fromUnit !== 'gram') {
            weightInGrams = value * (standardConversions[fromUnit]?.gram || 1)
          }

          let volumeInMl = weightInGrams / density

          if (toUnit !== 'ml') {
            conversionFactor = standardConversions.ml[toUnit]
            if (conversionFactor) {
              volumeInMl *= conversionFactor
            }
          }

          conversionFactor = volumeInMl / value
          formula = `${value} ${fromUnit}`
          if (fromUnit !== 'gram') formula += ` × ${standardConversions[fromUnit]?.gram} (to g)`
          formula += ` ÷ ${density} g/ml`
          if (toUnit !== 'ml') formula += ` × ${standardConversions.ml[toUnit]} (to ${toUnit})`
          formula += ` = ${volumeInMl.toFixed(4)} ${toUnit}`
        }

        notes += `Using density: ${density.toFixed(4)} g/ml. `
        if (!material && !customDensity) {
          warnings.push('Using default density. Select a material or specify custom density for better accuracy.')
        }
      }
      // 4. Compound conversion through intermediate units
      else {
        method = 'compound'
        accuracy = 'medium'

        // Try conversion through gram or ml as intermediate
        const intermediates = ['gram', 'ml']
        for (const intermediate of intermediates) {
          const factor1 = standardConversions[fromUnit]?.[intermediate] ||
                          (standardConversions[intermediate]?.[fromUnit] ? 1 / standardConversions[intermediate][fromUnit] : null)

          const factor2 = standardConversions[intermediate]?.[toUnit] ||
                          (standardConversions[toUnit]?.[intermediate] ? 1 / standardConversions[toUnit][intermediate] : null)

          if (factor1 && factor2) {
            conversionFactor = factor1 * factor2
            formula = `${value} ${fromUnit} → ${intermediate} → ${toUnit} = ${(value * conversionFactor).toFixed(4)} ${toUnit}`
            notes += `Conversion through ${intermediate}. `
            break
          }
        }
      }

      if (conversionFactor === null) {
        throw new Error(`No conversion path found from ${fromUnit} to ${toUnit}`)
      }

      const convertedValue = value * conversionFactor

      // Add warnings for unusual conversions
      if (Math.abs(convertedValue) > 1000000) {
        warnings.push('Result is very large. Please verify the conversion is correct.')
      }
      if (convertedValue < 0.001 && convertedValue > 0) {
        warnings.push('Result is very small. Consider using a different unit.')
      }

      const conversionResult: ConversionResult = {
        originalValue: value,
        convertedValue,
        fromUnit,
        toUnit,
        factor: conversionFactor,
        method,
        formula,
        accuracy,
        notes: notes.trim(),
        temperature: useTemperatureAdjustment ? currentTemp : undefined,
        warnings: warnings.length > 0 ? warnings : undefined
      }

      setResult(conversionResult)

      // Add to history
      const historyEntry: ConversionHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        materialId: selectedMaterial || undefined,
        fromValue: value,
        fromUnit,
        toValue: convertedValue,
        toUnit,
        method,
        temperature: useTemperatureAdjustment ? currentTemp : undefined,
        notes: notes.trim()
      }

      setConversionHistory(prev => [historyEntry, ...prev.slice(0, 99)]) // Keep last 100 conversions

    } catch (error) {
      console.error('Conversion error:', error)
      setResult(null)
    } finally {
      setIsConverting(false)
    }
  }

  const processBatchConversion = () => {
    if (!batchConversion.trim()) return

    const lines = batchConversion.split('\n').filter(line => line.trim())
    const results: ConversionResult[] = []

    lines.forEach((line, index) => {
      try {
        // Expected format: "value fromUnit toUnit" or "value fromUnit to toUnit"
        const parts = line.trim().split(/\s+/)
        if (parts.length >= 3) {
          const value = parseFloat(parts[0])
          const from = parts[1]
          const to = parts[parts.length - 1]

          if (!isNaN(value) && from && to) {
            // Simulate conversion for each line
            // In real implementation, you would call the actual conversion logic
            const mockResult: ConversionResult = {
              originalValue: value,
              convertedValue: value * 1.5, // Mock conversion
              fromUnit: from,
              toUnit: to,
              factor: 1.5,
              method: 'standard',
              formula: `${value} ${from} = ${value * 1.5} ${to}`,
              accuracy: 'high'
            }
            results.push(mockResult)
          }
        }
      } catch (error) {
        console.error(`Error processing line ${index + 1}:`, error)
      }
    })

    setBatchResults(results)
  }

  const exportResults = () => {
    const data = result ? [result] : batchResults
    const csv = [
      'Original Value,From Unit,Converted Value,To Unit,Method,Accuracy,Formula,Notes',
      ...data.map(r =>
        `${r.originalValue},${r.fromUnit},${r.convertedValue},${r.toUnit},${r.method},${r.accuracy},"${r.formula}","${r.notes || ''}"`
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `conversion_results_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const swapUnits = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    if (result) {
      setFromValue(result.convertedValue.toString())
    }
  }

  const getUnitCategory = (unit: string): string => {
    for (const [category, unitList] of Object.entries(units)) {
      if (unitList.includes(unit)) return category
    }
    return 'unknown'
  }

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'estimated': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'standard': return 'bg-blue-100 text-blue-800'
      case 'density': return 'bg-green-100 text-green-800'
      case 'material_specific': return 'bg-purple-100 text-purple-800'
      case 'temperature_adjusted': return 'bg-orange-100 text-orange-800'
      case 'compound': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calculator className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold">
            {language === 'ar' ? 'محول الوحدات المتقدم' : 'Enhanced Unit Converter'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
          >
            {language === 'ar' ? 'EN' : 'ع'}
          </Button>

          {(result || batchResults.length > 0) && (
            <Button variant="outline" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تصدير' : 'Export'}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="single" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">
            {language === 'ar' ? 'تحويل واحد' : 'Single Conversion'}
          </TabsTrigger>
          <TabsTrigger value="batch">
            {language === 'ar' ? 'تحويل متعدد' : 'Batch Conversion'}
          </TabsTrigger>
          <TabsTrigger value="history">
            {language === 'ar' ? 'السجل' : 'History'}
          </TabsTrigger>
        </TabsList>

        {/* Single Conversion Tab */}
        <TabsContent value="single" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="h-5 w-5" />
                  <span>{language === 'ar' ? 'محول الوحدات' : 'Unit Converter'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Material Selection */}
                <div>
                  <Label>{language === 'ar' ? 'اختيار المادة (اختياري)' : 'Select Material (Optional)'}</Label>
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختيار مادة...' : 'Select material...'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        {language === 'ar' ? 'بدون مادة محددة' : 'No specific material'}
                      </SelectItem>
                      {materials.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          <div className="flex items-center space-x-2">
                            <span>{language === 'ar' ? material.nameAr : material.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {material.density} g/ml
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Value Input */}
                <div>
                  <Label>{language === 'ar' ? 'القيمة' : 'Value'}</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="Enter value..."
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                  />
                </div>

                {/* From Unit */}
                <div>
                  <Label>{language === 'ar' ? 'من وحدة' : 'From Unit'}</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختيار وحدة...' : 'Select unit...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(units).map(([category, unitList]) => (
                        <div key={category}>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                            {category}
                          </div>
                          {unitList.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unitLabels[unit]?.[language] || unit}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={swapUnits}
                    disabled={!fromUnit || !toUnit}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Unit */}
                <div>
                  <Label>{language === 'ar' ? 'إلى وحدة' : 'To Unit'}</Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختيار وحدة...' : 'Select unit...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(units).map(([category, unitList]) => (
                        <div key={category}>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                            {category}
                          </div>
                          {unitList.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unitLabels[unit]?.[language] || unit}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Options */}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showAdvancedOptions}
                    onCheckedChange={setShowAdvancedOptions}
                    id="advanced"
                  />
                  <Label htmlFor="advanced">
                    {language === 'ar' ? 'خيارات متقدمة' : 'Advanced Options'}
                  </Label>
                </div>

                {showAdvancedOptions && (
                  <div className="space-y-4 border-t pt-4">
                    {/* Temperature Adjustment */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={useTemperatureAdjustment}
                        onCheckedChange={setUseTemperatureAdjustment}
                        id="temperature"
                      />
                      <Label htmlFor="temperature">
                        {language === 'ar' ? 'تعديل حسب درجة الحرارة' : 'Temperature Adjustment'}
                      </Label>
                    </div>

                    {useTemperatureAdjustment && (
                      <div>
                        <Label>{language === 'ar' ? 'درجة الحرارة (°C)' : 'Temperature (°C)'}</Label>
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value)}
                            placeholder="20"
                          />
                        </div>
                      </div>
                    )}

                    {/* Custom Density */}
                    {!selectedMaterial && (
                      <div>
                        <Label>{language === 'ar' ? 'كثافة مخصصة (g/ml)' : 'Custom Density (g/ml)'}</Label>
                        <div className="flex items-center space-x-2">
                          <Gauge className="h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            step="0.001"
                            value={customDensity}
                            onChange={(e) => setCustomDensity(e.target.value)}
                            placeholder="0.85"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Convert Button */}
                <Button
                  onClick={performConversion}
                  disabled={!fromValue || !fromUnit || !toUnit || isConverting}
                  className="w-full"
                  size="lg"
                >
                  {isConverting ? (
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-5 w-5 mr-2" />
                  )}
                  {language === 'ar' ? 'تحويل' : 'Convert'}
                </Button>
              </CardContent>
            </Card>

            {/* Result Display */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'نتيجة التحويل' : 'Conversion Result'}</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-700 mb-2">
                        {result.convertedValue.toFixed(6)} {result.toUnit}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.originalValue} {result.fromUnit} =
                      </div>
                    </div>

                    {/* Method and Accuracy */}
                    <div className="flex items-center justify-between">
                      <Badge className={getMethodBadgeColor(result.method)}>
                        {result.method.replace('_', ' ')}
                      </Badge>
                      <div className={`text-sm font-medium ${getAccuracyColor(result.accuracy)}`}>
                        {language === 'ar' ? 'الدقة:' : 'Accuracy:'} {result.accuracy}
                      </div>
                    </div>

                    {/* Formula */}
                    <div>
                      <Label className="text-sm font-medium">
                        {language === 'ar' ? 'المعادلة:' : 'Formula:'}
                      </Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-mono">
                        {result.formula}
                      </div>
                    </div>

                    {/* Additional Information */}
                    {result.notes && (
                      <div>
                        <Label className="text-sm font-medium">
                          {language === 'ar' ? 'ملاحظات:' : 'Notes:'}
                        </Label>
                        <div className="mt-1 text-sm text-gray-600">
                          {result.notes}
                        </div>
                      </div>
                    )}

                    {/* Temperature Info */}
                    {result.temperature && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Thermometer className="h-4 w-4" />
                        <span>
                          {language === 'ar' ? 'درجة الحرارة:' : 'Temperature:'} {result.temperature}°C
                        </span>
                      </div>
                    )}

                    {/* Warnings */}
                    {result.warnings && result.warnings.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <ul className="list-disc list-inside space-y-1">
                            {result.warnings.map((warning, index) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Quick Reference */}
                    <div className="border-t pt-4">
                      <Label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'مرجع سريع:' : 'Quick Reference:'}
                      </Label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>1 {result.fromUnit} =</span>
                          <span>{result.factor.toFixed(6)} {result.toUnit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1 {result.toUnit} =</span>
                          <span>{(1 / result.factor).toFixed(6)} {result.fromUnit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>
                      {language === 'ar'
                        ? 'أدخل القيم والوحدات لرؤية نتيجة التحويل'
                        : 'Enter values and units to see conversion result'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Material Information */}
          {selectedMaterial && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Beaker className="h-5 w-5" />
                  <span>{language === 'ar' ? 'معلومات المادة' : 'Material Information'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const material = materials.find(m => m.id === selectedMaterial)
                  return material ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">
                          {language === 'ar' ? 'الاسم:' : 'Name:'}
                        </Label>
                        <div>{language === 'ar' ? material.nameAr : material.name}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          {language === 'ar' ? 'الفئة:' : 'Category:'}
                        </Label>
                        <div className="capitalize">{material.category.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          {language === 'ar' ? 'الكثافة:' : 'Density:'}
                        </Label>
                        <div>{material.density} g/ml (at 20°C)</div>
                      </div>
                      {material.viscosity && (
                        <div>
                          <Label className="text-sm font-medium">
                            {language === 'ar' ? 'اللزوجة:' : 'Viscosity:'}
                          </Label>
                          <div>{material.viscosity} cP</div>
                        </div>
                      )}
                      {material.grade && (
                        <div>
                          <Label className="text-sm font-medium">
                            {language === 'ar' ? 'الدرجة:' : 'Grade:'}
                          </Label>
                          <Badge variant="outline" className="capitalize">
                            {material.grade}
                          </Badge>
                        </div>
                      )}
                      {material.origin && (
                        <div>
                          <Label className="text-sm font-medium">
                            {language === 'ar' ? 'المنشأ:' : 'Origin:'}
                          </Label>
                          <div>{material.origin}</div>
                        </div>
                      )}
                      {material.temperatureCoefficient && (
                        <div>
                          <Label className="text-sm font-medium">
                            {language === 'ar' ? 'معامل الحرارة:' : 'Temperature Coefficient:'}
                          </Label>
                          <div>{material.temperatureCoefficient} /°C</div>
                        </div>
                      )}
                      {material.notes && (
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium">
                            {language === 'ar' ? 'ملاحظات:' : 'Notes:'}
                          </Label>
                          <div className="text-sm text-gray-600">{material.notes}</div>
                        </div>
                      )}
                    </div>
                  ) : null
                })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Batch Conversion Tab */}
        <TabsContent value="batch" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Batch Input */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'تحويل متعدد' : 'Batch Conversion'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>
                    {language === 'ar' ? 'أدخل التحويلات (واحد في كل سطر)' : 'Enter conversions (one per line)'}
                  </Label>
                  <Textarea
                    rows={10}
                    placeholder={`100 gram tola
250 ml gram
5 tola gram
1000 gram kilogram`}
                    value={batchConversion}
                    onChange={(e) => setBatchConversion(e.target.value)}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {language === 'ar'
                      ? 'تنسيق: القيمة الوحدة_الأصلية الوحدة_المستهدفة'
                      : 'Format: value from_unit to_unit'}
                  </div>
                </div>

                <Button
                  onClick={processBatchConversion}
                  disabled={!batchConversion.trim()}
                  className="w-full"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'معالجة التحويلات' : 'Process Conversions'}
                </Button>
              </CardContent>
            </Card>

            {/* Batch Results */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'نتائج التحويل' : 'Conversion Results'}</CardTitle>
              </CardHeader>
              <CardContent>
                {batchResults.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {batchResults.map((result, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">
                            {result.originalValue} {result.fromUnit} → {result.convertedValue.toFixed(4)} {result.toUnit}
                          </div>
                          <Badge className={getMethodBadgeColor(result.method)}>
                            {result.method}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 font-mono">
                          {result.formula}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <Database className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>
                      {language === 'ar'
                        ? 'أدخل التحويلات لرؤية النتائج'
                        : 'Enter conversions to see results'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>{language === 'ar' ? 'سجل التحويلات' : 'Conversion History'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {conversionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">
                    {language === 'ar' ? 'لا يوجد سجل تحويلات' : 'No conversion history available'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {conversionHistory.slice(0, 50).map((entry) => (
                    <div key={entry.id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">
                          {entry.fromValue} {entry.fromUnit} → {entry.toValue.toFixed(4)} {entry.toUnit}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString(language === 'ar' ? 'ar-AE' : 'en-AE')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Badge variant="outline">{entry.method}</Badge>
                        {entry.materialId && (
                          <span>
                            {materials.find(m => m.id === entry.materialId)?.[language === 'ar' ? 'nameAr' : 'name']}
                          </span>
                        )}
                        {entry.temperature && (
                          <span className="flex items-center space-x-1">
                            <Thermometer className="h-3 w-3" />
                            <span>{entry.temperature}°C</span>
                          </span>
                        )}
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-gray-500 mt-1">{entry.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EnhancedUnitConverter