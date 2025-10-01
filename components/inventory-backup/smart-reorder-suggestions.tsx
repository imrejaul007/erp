'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Package,
  DollarSign,
  Calendar,
  Brain,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShoppingCart,
  Truck,
  Star,
  Trophy,
  Flame,
  Building2,
  Users,
  Globe,
  PieChart,
  RefreshCw,
  Download,
  Settings,
  Eye,
  Plus,
  Filter,
  Search,
} from 'lucide-react'
import { format, addDays, differenceInDays } from 'date-fns'

interface ReorderSuggestion {
  id: string
  materialId: string
  material: {
    name: string
    nameArabic: string
    category: string
    type: 'oud' | 'attar' | 'perfume_oil' | 'alcohol' | 'bottle' | 'packaging'
    grade: string
    currentStock: number
    unit: string
    costPerUnit: number
    supplier: {
      name: string
      leadTime: number // days
      minimumOrderQty: number
      priceBreaks: { qty: number; price: number }[]
      reliability: number // 1-100
      country: string
    }
  }
  aiAnalysis: {
    confidence: number // 0-100
    algorithm: string
    factors: string[]
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
  }
  demandAnalysis: {
    avgDaily: number
    trend: 'increasing' | 'stable' | 'decreasing'
    seasonality: {
      isSeasonalItem: boolean
      peakMonths?: string[]
      lowMonths?: string[]
      seasonalMultiplier?: number
    }
    volatility: 'low' | 'medium' | 'high'
  }
  stockAnalysis: {
    currentStock: number
    reservedStock: number
    availableStock: number
    stockoutDate: Date
    daysUntilStockout: number
    safetyStock: number
    reorderPoint: number
  }
  suggestion: {
    recommendedQty: number
    urgency: 'low' | 'medium' | 'high' | 'critical'
    priority: number // 1-10
    reason: string
    costImpact: number
    estimatedDelivery: Date
    suggestedSupplier: string
    alternativeSuppliers: string[]
  }
  marketFactors: {
    priceVolatility: 'stable' | 'rising' | 'falling'
    availability: 'abundant' | 'normal' | 'limited' | 'scarce'
    uaeImportTrends: string
    gccDemandForecast: string
    seasonalPricing: boolean
  }
  businessRules: {
    minimumStockDays: number
    maximumStockDays: number
    budgetConstraint?: number
    qualityRequirement: string
    complianceNotes: string[]
  }
  generatedAt: Date
  lastUpdated: Date
  status: 'pending' | 'approved' | 'ordered' | 'rejected' | 'expired'
}

interface SmartReorderSettings {
  enabled: boolean
  autoApproval: {
    enabled: boolean
    maxAmount: number
    trustedSuppliers: string[]
  }
  algorithms: {
    arima: { enabled: boolean; weight: number }
    exponentialSmoothing: { enabled: boolean; weight: number }
    linearRegression: { enabled: boolean; weight: number }
    seasonalDecomposition: { enabled: boolean; weight: number }
  }
  businessRules: {
    minStockDays: number
    maxStockDays: number
    safetyStockPercent: number
    leadTimeBuffer: number
  }
  notifications: {
    email: boolean
    sms: boolean
    inApp: boolean
  }
}

interface SmartReorderSuggestionsProps {
  onGeneratePurchaseOrder?: (suggestionId: string) => void
  onConfigureSettings?: () => void
}

export function SmartReorderSuggestions({
  onGeneratePurchaseOrder,
  onConfigureSettings,
}: SmartReorderSuggestionsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSuggestion, setSelectedSuggestion] = useState<ReorderSuggestion | null>(null)
  const [filters, setFilters] = useState({
    urgency: '',
    category: '',
    supplier: '',
    riskLevel: '',
    status: '',
  })
  const [settings, setSettings] = useState<SmartReorderSettings>({
    enabled: true,
    autoApproval: {
      enabled: false,
      maxAmount: 10000,
      trustedSuppliers: ['Cambodian Oud House', 'Bulgarian Rose Valley'],
    },
    algorithms: {
      arima: { enabled: true, weight: 30 },
      exponentialSmoothing: { enabled: true, weight: 25 },
      linearRegression: { enabled: true, weight: 20 },
      seasonalDecomposition: { enabled: true, weight: 25 },
    },
    businessRules: {
      minStockDays: 30,
      maxStockDays: 180,
      safetyStockPercent: 20,
      leadTimeBuffer: 5,
    },
    notifications: {
      email: true,
      sms: false,
      inApp: true,
    },
  })

  // Mock data with AI-generated suggestions for UAE perfume business
  const suggestions: ReorderSuggestion[] = [
    {
      id: '1',
      materialId: 'mat_001',
      material: {
        name: 'Royal Cambodian Oud',
        nameArabic: 'عود كمبودي ملكي',
        category: 'Oud Oil',
        type: 'oud',
        grade: 'Royal',
        currentStock: 850,
        unit: 'tola',
        costPerUnit: 1200,
        supplier: {
          name: 'Cambodian Oud House',
          leadTime: 21,
          minimumOrderQty: 100,
          priceBreaks: [
            { qty: 100, price: 1200 },
            { qty: 500, price: 1150 },
            { qty: 1000, price: 1100 },
          ],
          reliability: 95,
          country: 'Cambodia',
        },
      },
      aiAnalysis: {
        confidence: 87,
        algorithm: 'Ensemble (ARIMA + Seasonal)',
        factors: [
          'Historical demand pattern',
          'Seasonal peak approaching (Ramadan)',
          'Supplier reliability',
          'Market price volatility',
          'Current stock velocity',
        ],
        riskLevel: 'medium',
      },
      demandAnalysis: {
        avgDaily: 12.5,
        trend: 'increasing',
        seasonality: {
          isSeasonalItem: true,
          peakMonths: ['March', 'April', 'November', 'December'],
          lowMonths: ['June', 'July', 'August'],
          seasonalMultiplier: 1.8,
        },
        volatility: 'medium',
      },
      stockAnalysis: {
        currentStock: 850,
        reservedStock: 150,
        availableStock: 700,
        stockoutDate: new Date('2024-11-25'),
        daysUntilStockout: 56,
        safetyStock: 375, // 30 days * 12.5 daily usage
        reorderPoint: 600,
      },
      suggestion: {
        recommendedQty: 800,
        urgency: 'high',
        priority: 8,
        reason: 'Approaching Ramadan peak season with increasing demand trend. Current stock will deplete before next shipment arrival.',
        costImpact: 880000, // 800 * 1100 (bulk pricing)
        estimatedDelivery: new Date('2024-11-15'),
        suggestedSupplier: 'Cambodian Oud House',
        alternativeSuppliers: ['Assam Oud Traders', 'Premium Oud Direct'],
      },
      marketFactors: {
        priceVolatility: 'rising',
        availability: 'limited',
        uaeImportTrends: 'Increasing demand for premium oud during religious seasons',
        gccDemandForecast: 'Expected 25% increase in Q4 2024',
        seasonalPricing: true,
      },
      businessRules: {
        minimumStockDays: 45,
        maximumStockDays: 180,
        budgetConstraint: 1000000,
        qualityRequirement: 'Royal grade only, GCC certification required',
        complianceNotes: ['Halal certified', 'UAE customs code: 33019900', 'MSDS required'],
      },
      generatedAt: new Date('2024-09-30T08:00:00'),
      lastUpdated: new Date('2024-09-30T14:30:00'),
      status: 'pending',
    },
    {
      id: '2',
      materialId: 'mat_003',
      material: {
        name: 'French Lavender Oil',
        nameArabic: 'زيت الخزامى الفرنسي',
        category: 'Essential Oil',
        type: 'perfume_oil',
        grade: 'Premium',
        currentStock: 45,
        unit: 'ml',
        costPerUnit: 85,
        supplier: {
          name: 'Provence Aromatics',
          leadTime: 14,
          minimumOrderQty: 500,
          priceBreaks: [
            { qty: 500, price: 85 },
            { qty: 1000, price: 78 },
            { qty: 2500, price: 72 },
          ],
          reliability: 92,
          country: 'France',
        },
      },
      aiAnalysis: {
        confidence: 94,
        algorithm: 'ARIMA with External Regressors',
        factors: [
          'Critical stock level reached',
          'Consistent daily usage pattern',
          'Supplier lead time constraints',
          'Import documentation lead time',
          'EU supply chain stability',
        ],
        riskLevel: 'critical',
      },
      demandAnalysis: {
        avgDaily: 8.2,
        trend: 'stable',
        seasonality: {
          isSeasonalItem: false,
          seasonalMultiplier: 1.0,
        },
        volatility: 'low',
      },
      stockAnalysis: {
        currentStock: 45,
        reservedStock: 25,
        availableStock: 20,
        stockoutDate: new Date('2024-10-05'),
        daysUntilStockout: 5,
        safetyStock: 164, // 20 days * 8.2 daily usage
        reorderPoint: 279,
      },
      suggestion: {
        recommendedQty: 1000,
        urgency: 'critical',
        priority: 10,
        reason: 'URGENT: Stock will run out in 5 days. Must order immediately to avoid production disruption.',
        costImpact: 78000, // 1000 * 78 (bulk pricing)
        estimatedDelivery: new Date('2024-10-14'),
        suggestedSupplier: 'Provence Aromatics',
        alternativeSuppliers: ['Bulgarian Lavender Co.', 'Turkish Essential Oils'],
      },
      marketFactors: {
        priceVolatility: 'stable',
        availability: 'normal',
        uaeImportTrends: 'Steady demand for premium European oils',
        gccDemandForecast: 'Stable growth expected',
        seasonalPricing: false,
      },
      businessRules: {
        minimumStockDays: 20,
        maximumStockDays: 120,
        budgetConstraint: 100000,
        qualityRequirement: 'French origin preferred, organic certification',
        complianceNotes: ['EU organic certified', 'IFRA compliant', 'COA required'],
      },
      generatedAt: new Date('2024-09-30T08:00:00'),
      lastUpdated: new Date('2024-09-30T16:45:00'),
      status: 'pending',
    },
    {
      id: '3',
      materialId: 'mat_005',
      material: {
        name: 'Amber Glass Bottles 30ml',
        nameArabic: 'زجاجات عنبرية 30 مل',
        category: 'Packaging',
        type: 'bottle',
        grade: 'Standard',
        currentStock: 2500,
        unit: 'pieces',
        costPerUnit: 1.2,
        supplier: {
          name: 'UAE Glass Industries',
          leadTime: 7,
          minimumOrderQty: 10000,
          priceBreaks: [
            { qty: 10000, price: 1.2 },
            { qty: 50000, price: 1.0 },
            { qty: 100000, price: 0.85 },
          ],
          reliability: 98,
          country: 'UAE',
        },
      },
      aiAnalysis: {
        confidence: 76,
        algorithm: 'Linear Regression with Trend',
        factors: [
          'Seasonal production increase',
          'Local supplier advantage',
          'Packaging demand correlation',
          'Bulk pricing optimization',
          'Storage capacity constraints',
        ],
        riskLevel: 'low',
      },
      demandAnalysis: {
        avgDaily: 180,
        trend: 'increasing',
        seasonality: {
          isSeasonalItem: true,
          peakMonths: ['October', 'November', 'December', 'January'],
          lowMonths: ['May', 'June', 'July'],
          seasonalMultiplier: 1.4,
        },
        volatility: 'low',
      },
      stockAnalysis: {
        currentStock: 2500,
        reservedStock: 800,
        availableStock: 1700,
        stockoutDate: new Date('2024-10-18'),
        daysUntilStockout: 18,
        safetyStock: 3600, // 20 days * 180 daily usage
        reorderPoint: 4860,
      },
      suggestion: {
        recommendedQty: 50000,
        urgency: 'medium',
        priority: 6,
        reason: 'Bulk order opportunity with local supplier. Seasonal demand increase expected. Significant cost savings with volume pricing.',
        costImpact: 50000, // 50000 * 1.0 (bulk pricing)
        estimatedDelivery: new Date('2024-10-07'),
        suggestedSupplier: 'UAE Glass Industries',
        alternativeSuppliers: ['Dubai Packaging Solutions', 'Sharjah Glass Factory'],
      },
      marketFactors: {
        priceVolatility: 'stable',
        availability: 'abundant',
        uaeImportTrends: 'Growing local manufacturing capacity',
        gccDemandForecast: 'Increasing demand for premium packaging',
        seasonalPricing: false,
      },
      businessRules: {
        minimumStockDays: 20,
        maximumStockDays: 90,
        budgetConstraint: 60000,
        qualityRequirement: 'UV protection, food-grade glass',
        complianceNotes: ['UAE quality standards', 'Recyclable materials'],
      },
      generatedAt: new Date('2024-09-30T08:00:00'),
      lastUpdated: new Date('2024-09-30T12:15:00'),
      status: 'pending',
    },
  ]

  // Filter and sort suggestions
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(suggestion => {
      const matchesSearch = !searchTerm ||
        suggestion.material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suggestion.material.nameArabic.includes(searchTerm) ||
        suggestion.material.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesUrgency = !filters.urgency || suggestion.suggestion.urgency === filters.urgency
      const matchesCategory = !filters.category || suggestion.material.category === filters.category
      const matchesSupplier = !filters.supplier || suggestion.material.supplier.name === filters.supplier
      const matchesRiskLevel = !filters.riskLevel || suggestion.aiAnalysis.riskLevel === filters.riskLevel
      const matchesStatus = !filters.status || suggestion.status === filters.status

      return matchesSearch && matchesUrgency && matchesCategory &&
             matchesSupplier && matchesRiskLevel && matchesStatus
    }).sort((a, b) => b.suggestion.priority - a.suggestion.priority)
  }, [suggestions, searchTerm, filters])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = suggestions.length
    const critical = suggestions.filter(s => s.suggestion.urgency === 'critical').length
    const high = suggestions.filter(s => s.suggestion.urgency === 'high').length
    const totalValue = suggestions.reduce((sum, s) => sum + s.suggestion.costImpact, 0)
    const avgConfidence = suggestions.reduce((sum, s) => sum + s.aiAnalysis.confidence, 0) / total

    return { total, critical, high, totalValue, avgConfidence }
  }, [suggestions])

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get risk level color
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  // Generate purchase order
  const handleGeneratePO = (suggestion: ReorderSuggestion) => {
    onGeneratePurchaseOrder?.(suggestion.id)
    console.log(`Generating PO for ${suggestion.material.name}: ${suggestion.suggestion.recommendedQty} ${suggestion.material.unit}`)
  }

  const exportSuggestions = () => {
    const reportData = filteredSuggestions.map(suggestion => [
      suggestion.material.name,
      suggestion.material.nameArabic,
      suggestion.material.category,
      suggestion.suggestion.urgency,
      suggestion.aiAnalysis.confidence.toString(),
      suggestion.suggestion.recommendedQty.toString(),
      suggestion.material.unit,
      suggestion.suggestion.costImpact.toString(),
      suggestion.stockAnalysis.daysUntilStockout.toString(),
      suggestion.material.supplier.name,
      format(suggestion.suggestion.estimatedDelivery, 'yyyy-MM-dd'),
      suggestion.suggestion.reason,
    ])

    const headers = [
      'Material (EN)', 'Material (AR)', 'Category', 'Urgency', 'AI Confidence',
      'Recommended Qty', 'Unit', 'Cost Impact (AED)', 'Days to Stockout',
      'Supplier', 'Est. Delivery', 'Reason'
    ]

    const csvContent = [headers, ...reportData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `reorder-suggestions-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Smart Reorder Suggestions
          </h2>
          <p className="text-muted-foreground">
            AI-powered inventory optimization for UAE perfume & oud business
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSuggestions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={onConfigureSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Configure AI
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suggestions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              AED {(stats.totalValue / 1000).toLocaleString()}K
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.avgConfidence.toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suggestions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t">
            <Select value={filters.urgency} onValueChange={(value) => setFilters(prev => ({ ...prev, urgency: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Urgencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Urgencies</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Oud Oil">Oud Oil</SelectItem>
                <SelectItem value="Attar">Attar</SelectItem>
                <SelectItem value="Essential Oil">Essential Oil</SelectItem>
                <SelectItem value="Packaging">Packaging</SelectItem>
                <SelectItem value="Alcohol">Alcohol</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.riskLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, riskLevel: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Risk Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setFilters({
                urgency: '',
                category: '',
                supplier: '',
                riskLevel: '',
                status: '',
              })}
            >
              Clear Filters
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList>
              <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
              <TabsTrigger value="analytics">Demand Analytics</TabsTrigger>
              <TabsTrigger value="settings">AI Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority & AI</TableHead>
                      <TableHead>Material & Category</TableHead>
                      <TableHead>Stock Analysis</TableHead>
                      <TableHead>Demand Forecast</TableHead>
                      <TableHead>Supplier & Cost</TableHead>
                      <TableHead>Recommendation</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuggestions.map((suggestion) => (
                      <TableRow key={suggestion.id}>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                suggestion.suggestion.urgency === 'critical' ? 'bg-red-500' :
                                suggestion.suggestion.urgency === 'high' ? 'bg-orange-500' :
                                suggestion.suggestion.urgency === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`} />
                              <span className="text-sm font-medium">Priority {suggestion.suggestion.priority}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Brain className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-blue-600">{suggestion.aiAnalysis.confidence}% confident</span>
                            </div>
                            <Badge variant="outline" className={getUrgencyColor(suggestion.suggestion.urgency)}>
                              {suggestion.suggestion.urgency}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <div className="font-medium">{suggestion.material.name}</div>
                            <div className="text-sm text-muted-foreground" dir="rtl">
                              {suggestion.material.nameArabic}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.material.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {suggestion.material.grade}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">{suggestion.stockAnalysis.availableStock}</span>
                              <span className="text-muted-foreground"> / {suggestion.stockAnalysis.currentStock} {suggestion.material.unit}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Reserved: {suggestion.stockAnalysis.reservedStock}
                            </div>
                            <div className={`text-xs font-medium ${
                              suggestion.stockAnalysis.daysUntilStockout <= 7 ? 'text-red-600' :
                              suggestion.stockAnalysis.daysUntilStockout <= 30 ? 'text-orange-600' : 'text-blue-600'
                            }`}>
                              {suggestion.stockAnalysis.daysUntilStockout} days left
                            </div>
                            <Progress
                              value={(suggestion.stockAnalysis.availableStock / suggestion.stockAnalysis.reorderPoint) * 100}
                              className="h-1"
                            />
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              {suggestion.demandAnalysis.trend === 'increasing' ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : suggestion.demandAnalysis.trend === 'decreasing' ? (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              ) : (
                                <BarChart3 className="h-3 w-3 text-blue-600" />
                              )}
                              <span className="text-xs capitalize">{suggestion.demandAnalysis.trend}</span>
                            </div>
                            <div className="text-sm">
                              {suggestion.demandAnalysis.avgDaily.toFixed(1)} {suggestion.material.unit}/day
                            </div>
                            {suggestion.demandAnalysis.seasonality.isSeasonalItem && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3 text-orange-500" />
                                <span className="text-xs text-orange-600">Seasonal</span>
                              </div>
                            )}
                            <Badge variant="outline" className={`text-xs ${
                              suggestion.demandAnalysis.volatility === 'high' ? 'border-red-300 text-red-700' :
                              suggestion.demandAnalysis.volatility === 'medium' ? 'border-yellow-300 text-yellow-700' :
                              'border-green-300 text-green-700'
                            }`}>
                              {suggestion.demandAnalysis.volatility} volatility
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">{suggestion.material.supplier.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {suggestion.material.supplier.country} • {suggestion.material.supplier.leadTime} days
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs">{suggestion.material.supplier.reliability}% reliable</span>
                            </div>
                            <div className="text-sm font-medium text-green-600">
                              AED {suggestion.suggestion.costImpact.toLocaleString()}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              Order {suggestion.suggestion.recommendedQty.toLocaleString()} {suggestion.material.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Delivery: {format(suggestion.suggestion.estimatedDelivery, 'MMM dd')}
                            </div>
                            <div className="text-xs max-w-xs">
                              {suggestion.suggestion.reason.substring(0, 80)}...
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSuggestion(suggestion)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleGeneratePO(suggestion)}
                              disabled={suggestion.status === 'ordered'}
                            >
                              {suggestion.status === 'ordered' ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <ShoppingCart className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredSuggestions.length === 0 && (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No suggestions available</p>
                  <p className="text-muted-foreground">
                    AI analysis is up to date. All inventory levels are optimal.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Demand Trends by Category</CardTitle>
                    <CardDescription>AI-predicted demand patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Oud Oil', 'Attar', 'Essential Oil', 'Packaging'].map(category => {
                        const categoryItems = suggestions.filter(s => s.material.category === category)
                        const avgTrend = categoryItems.length > 0 ? categoryItems[0].demandAnalysis.trend : 'stable'

                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">{category}</span>
                              <div className="flex items-center space-x-1">
                                {avgTrend === 'increasing' ? (
                                  <TrendingUp className="h-3 w-3 text-green-600" />
                                ) : avgTrend === 'decreasing' ? (
                                  <TrendingDown className="h-3 w-3 text-red-600" />
                                ) : (
                                  <BarChart3 className="h-3 w-3 text-blue-600" />
                                )}
                                <span className="text-xs capitalize">{avgTrend}</span>
                              </div>
                            </div>
                            <Progress
                              value={
                                avgTrend === 'increasing' ? 75 :
                                avgTrend === 'decreasing' ? 25 : 50
                              }
                              className="h-2"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Performance</CardTitle>
                    <CardDescription>Reliability and lead time analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from(new Set(suggestions.map(s => s.material.supplier.name))).map(supplierName => {
                        const supplierSuggestions = suggestions.filter(s => s.material.supplier.name === supplierName)
                        const supplier = supplierSuggestions[0].material.supplier
                        const avgLeadTime = supplier.leadTime

                        return (
                          <div key={supplierName} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm font-medium">{supplierName}</span>
                                <div className="text-xs text-muted-foreground">{supplier.country}</div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs">{supplier.reliability}%</span>
                                </div>
                                <div className="text-xs text-muted-foreground">{avgLeadTime} days</div>
                              </div>
                            </div>
                            <Progress value={supplier.reliability} className="h-1" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seasonal Patterns</CardTitle>
                    <CardDescription>UAE market seasonality analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Peak Season Approaching</span>
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          Ramadan and wedding season demand increase expected in Q4 2024
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">UAE Market Trends</span>
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                          Premium oud demand increasing 15% YoY, attar demand stable
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Model Performance</CardTitle>
                    <CardDescription>Algorithm accuracy and confidence</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(settings.algorithms).map(([algorithm, config]) => (
                        <div key={algorithm} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm capitalize">{algorithm.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-xs text-muted-foreground">{config.weight}% weight</span>
                          </div>
                          <Progress value={config.weight} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Algorithm Configuration</CardTitle>
                    <CardDescription>Adjust algorithm weights for suggestions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(settings.algorithms).map(([algorithm, config]) => (
                      <div key={algorithm} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="capitalize">{algorithm.replace(/([A-Z])/g, ' $1')}</Label>
                            <p className="text-xs text-muted-foreground">
                              {algorithm === 'arima' ? 'Time series forecasting' :
                               algorithm === 'exponentialSmoothing' ? 'Trend smoothing' :
                               algorithm === 'linearRegression' ? 'Linear trend analysis' :
                               'Seasonal pattern recognition'}
                            </p>
                          </div>
                          <Switch
                            checked={config.enabled}
                            onCheckedChange={(checked) => setSettings(prev => ({
                              ...prev,
                              algorithms: {
                                ...prev.algorithms,
                                [algorithm]: { ...config, enabled: checked }
                              }
                            }))}
                          />
                        </div>
                        {config.enabled && (
                          <div className="space-y-1">
                            <Label>Weight: {config.weight}%</Label>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              step="5"
                              value={config.weight}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                algorithms: {
                                  ...prev.algorithms,
                                  [algorithm]: { ...config, weight: parseInt(e.target.value) }
                                }
                              }))}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Rules</CardTitle>
                    <CardDescription>Configure inventory management rules</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Minimum Stock Days</Label>
                      <Input
                        type="number"
                        value={settings.businessRules.minStockDays}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          businessRules: {
                            ...prev.businessRules,
                            minStockDays: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Maximum Stock Days</Label>
                      <Input
                        type="number"
                        value={settings.businessRules.maxStockDays}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          businessRules: {
                            ...prev.businessRules,
                            maxStockDays: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Safety Stock Percentage</Label>
                      <Input
                        type="number"
                        value={settings.businessRules.safetyStockPercent}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          businessRules: {
                            ...prev.businessRules,
                            safetyStockPercent: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lead Time Buffer (days)</Label>
                      <Input
                        type="number"
                        value={settings.businessRules.leadTimeBuffer}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          businessRules: {
                            ...prev.businessRules,
                            leadTimeBuffer: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detailed Suggestion Dialog */}
      {selectedSuggestion && (
        <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Reorder Analysis: {selectedSuggestion.material.name}
              </DialogTitle>
              <DialogDescription>
                Comprehensive AI-driven inventory analysis and recommendation
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
                <TabsTrigger value="supplier">Supplier Analysis</TabsTrigger>
                <TabsTrigger value="market">Market Factors</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{selectedSuggestion.suggestion.recommendedQty}</div>
                    <div className="text-sm text-muted-foreground">Recommended Order</div>
                    <div className="text-xs">{selectedSuggestion.material.unit}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {selectedSuggestion.aiAnalysis.confidence}%
                    </div>
                    <div className="text-sm text-muted-foreground">AI Confidence</div>
                    <div className="text-xs">{selectedSuggestion.aiAnalysis.algorithm}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {selectedSuggestion.stockAnalysis.daysUntilStockout}
                    </div>
                    <div className="text-sm text-muted-foreground">Days Until Stockout</div>
                    <div className="text-xs">Based on current usage</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Current Stock Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Available Stock:</span>
                          <span className="font-medium">{selectedSuggestion.stockAnalysis.availableStock} {selectedSuggestion.material.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reserved Stock:</span>
                          <span>{selectedSuggestion.stockAnalysis.reservedStock} {selectedSuggestion.material.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Safety Stock:</span>
                          <span>{selectedSuggestion.stockAnalysis.safetyStock} {selectedSuggestion.material.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reorder Point:</span>
                          <span className="font-medium text-orange-600">{selectedSuggestion.stockAnalysis.reorderPoint} {selectedSuggestion.material.unit}</span>
                        </div>
                        <Progress
                          value={(selectedSuggestion.stockAnalysis.availableStock / selectedSuggestion.stockAnalysis.reorderPoint) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Financial Impact</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Cost per Unit:</span>
                          <span>AED {selectedSuggestion.material.costPerUnit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Investment:</span>
                          <span className="font-medium text-green-600">AED {selectedSuggestion.suggestion.costImpact.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Budget Constraint:</span>
                          <span className={selectedSuggestion.suggestion.costImpact > (selectedSuggestion.businessRules.budgetConstraint || Infinity) ? 'text-red-600' : 'text-green-600'}>
                            {selectedSuggestion.businessRules.budgetConstraint ? `AED ${selectedSuggestion.businessRules.budgetConstraint.toLocaleString()}` : 'No limit'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Recommendation Summary</h4>
                      <div className="p-4 border rounded-lg">
                        <Badge variant="outline" className={getUrgencyColor(selectedSuggestion.suggestion.urgency)}>
                          {selectedSuggestion.suggestion.urgency} urgency
                        </Badge>
                        <p className="text-sm mt-2">{selectedSuggestion.suggestion.reason}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-muted-foreground">Expected Delivery:</span>
                          <span className="font-medium">{format(selectedSuggestion.suggestion.estimatedDelivery, 'PPP')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Compliance Requirements</h4>
                      <div className="space-y-1">
                        {selectedSuggestion.businessRules.complianceNotes.map((note, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs">{note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-analysis" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">AI Confidence Analysis</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Overall Confidence</span>
                          <span className="font-medium">{selectedSuggestion.aiAnalysis.confidence}%</span>
                        </div>
                        <Progress value={selectedSuggestion.aiAnalysis.confidence} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          Algorithm: {selectedSuggestion.aiAnalysis.algorithm}
                        </div>
                        <Badge variant="outline" className={getRiskColor(selectedSuggestion.aiAnalysis.riskLevel)}>
                          {selectedSuggestion.aiAnalysis.riskLevel} risk
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Key Factors Analyzed</h4>
                      <div className="space-y-2">
                        {selectedSuggestion.aiAnalysis.factors.map((factor, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Model Performance</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">High Accuracy</span>
                          </div>
                          <p className="text-xs text-green-700 mt-1">
                            This model has shown 92% accuracy in similar predictions over the past 6 months.
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Learning Status</span>
                          </div>
                          <p className="text-xs text-blue-700 mt-1">
                            Model is continuously learning from actual vs predicted outcomes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="demand" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Demand Pattern Analysis</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Average Daily Demand</span>
                          <span className="font-medium">{selectedSuggestion.demandAnalysis.avgDaily} {selectedSuggestion.material.unit}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Trend Direction</span>
                          <div className="flex items-center space-x-1">
                            {selectedSuggestion.demandAnalysis.trend === 'increasing' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : selectedSuggestion.demandAnalysis.trend === 'decreasing' ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : (
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="font-medium capitalize">{selectedSuggestion.demandAnalysis.trend}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Volatility</span>
                          <Badge variant="outline" className={
                            selectedSuggestion.demandAnalysis.volatility === 'high' ? 'border-red-300 text-red-700' :
                            selectedSuggestion.demandAnalysis.volatility === 'medium' ? 'border-yellow-300 text-yellow-700' :
                            'border-green-300 text-green-700'
                          }>
                            {selectedSuggestion.demandAnalysis.volatility}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {selectedSuggestion.demandAnalysis.seasonality.isSeasonalItem && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Seasonality Pattern</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-800">Seasonal Item</span>
                            </div>
                            <div className="mt-2 space-y-1">
                              {selectedSuggestion.demandAnalysis.seasonality.peakMonths && (
                                <div className="text-xs text-orange-700">
                                  <strong>Peak:</strong> {selectedSuggestion.demandAnalysis.seasonality.peakMonths.join(', ')}
                                </div>
                              )}
                              {selectedSuggestion.demandAnalysis.seasonality.lowMonths && (
                                <div className="text-xs text-orange-700">
                                  <strong>Low:</strong> {selectedSuggestion.demandAnalysis.seasonality.lowMonths.join(', ')}
                                </div>
                              )}
                              {selectedSuggestion.demandAnalysis.seasonality.seasonalMultiplier && (
                                <div className="text-xs text-orange-700">
                                  <strong>Peak Multiplier:</strong> {selectedSuggestion.demandAnalysis.seasonality.seasonalMultiplier}x
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Forecast Summary</h4>
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="text-sm">
                          <strong>Next 30 Days:</strong> Expected usage of {(selectedSuggestion.demandAnalysis.avgDaily * 30).toFixed(0)} {selectedSuggestion.material.unit}
                        </div>
                        <div className="text-sm">
                          <strong>Next 60 Days:</strong> Expected usage of {(selectedSuggestion.demandAnalysis.avgDaily * 60).toFixed(0)} {selectedSuggestion.material.unit}
                        </div>
                        <div className="text-sm">
                          <strong>Next 90 Days:</strong> Expected usage of {(selectedSuggestion.demandAnalysis.avgDaily * 90).toFixed(0)} {selectedSuggestion.material.unit}
                        </div>
                        <Progress
                          value={(selectedSuggestion.stockAnalysis.availableStock / (selectedSuggestion.demandAnalysis.avgDaily * 90)) * 100}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          Current stock covers {(selectedSuggestion.stockAnalysis.availableStock / selectedSuggestion.demandAnalysis.avgDaily).toFixed(1)} days
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="supplier" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Primary Supplier</h4>
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{selectedSuggestion.material.supplier.name}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{selectedSuggestion.material.supplier.reliability}%</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Country:</span>
                            <span>{selectedSuggestion.material.supplier.country}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lead Time:</span>
                            <span>{selectedSuggestion.material.supplier.leadTime} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Minimum Order:</span>
                            <span>{selectedSuggestion.material.supplier.minimumOrderQty.toLocaleString()} {selectedSuggestion.material.unit}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Price Breaks</h4>
                      <div className="space-y-2">
                        {selectedSuggestion.material.supplier.priceBreaks.map((priceBreak, index) => (
                          <div key={index} className="flex justify-between items-center p-2 border rounded">
                            <span className="text-sm">{priceBreak.qty.toLocaleString()}+ {selectedSuggestion.material.unit}</span>
                            <span className="font-medium">AED {priceBreak.price.toLocaleString()}</span>
                            {selectedSuggestion.suggestion.recommendedQty >= priceBreak.qty && (
                              <Badge variant="default" className="text-xs">Best Price</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Alternative Suppliers</h4>
                      <div className="space-y-2">
                        {selectedSuggestion.suggestion.alternativeSuppliers.map((supplier, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="font-medium text-sm">{supplier}</div>
                            <div className="text-xs text-muted-foreground">Alternative option</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Delivery Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">Order Today</div>
                            <div className="text-xs text-muted-foreground">Order placement and confirmation</div>
                          </div>
                          <div className="text-xs">Day 0</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">Processing</div>
                            <div className="text-xs text-muted-foreground">Supplier processing and preparation</div>
                          </div>
                          <div className="text-xs">Days 1-7</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">Expected Delivery</div>
                            <div className="text-xs text-muted-foreground">
                              {format(selectedSuggestion.suggestion.estimatedDelivery, 'PPP')}
                            </div>
                          </div>
                          <div className="text-xs">Day {selectedSuggestion.material.supplier.leadTime}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="market" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Market Conditions</h4>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Price Volatility</span>
                            <Badge variant="outline" className={
                              selectedSuggestion.marketFactors.priceVolatility === 'rising' ? 'border-red-300 text-red-700' :
                              selectedSuggestion.marketFactors.priceVolatility === 'falling' ? 'border-green-300 text-green-700' :
                              'border-blue-300 text-blue-700'
                            }>
                              {selectedSuggestion.marketFactors.priceVolatility}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Availability</span>
                            <Badge variant="outline" className={
                              selectedSuggestion.marketFactors.availability === 'scarce' ? 'border-red-300 text-red-700' :
                              selectedSuggestion.marketFactors.availability === 'limited' ? 'border-orange-300 text-orange-700' :
                              selectedSuggestion.marketFactors.availability === 'abundant' ? 'border-green-300 text-green-700' :
                              'border-blue-300 text-blue-700'
                            }>
                              {selectedSuggestion.marketFactors.availability}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">UAE Import Trends</h4>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{selectedSuggestion.marketFactors.uaeImportTrends}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">GCC Demand Forecast</h4>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">{selectedSuggestion.marketFactors.gccDemandForecast}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Pricing Strategy</h4>
                      <div className="space-y-2">
                        {selectedSuggestion.marketFactors.seasonalPricing ? (
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-800">Seasonal Pricing Active</span>
                            </div>
                            <p className="text-xs text-orange-700 mt-1">
                              Prices may vary based on seasonal demand patterns
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <span className="text-sm font-medium text-blue-800">Stable Pricing</span>
                            <p className="text-xs text-blue-700 mt-1">No seasonal price variations expected</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Business Rules Applied</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Min Stock Days:</span>
                          <span>{selectedSuggestion.businessRules.minimumStockDays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Stock Days:</span>
                          <span>{selectedSuggestion.businessRules.maximumStockDays}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <strong>Quality Requirement:</strong> {selectedSuggestion.businessRules.qualityRequirement}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedSuggestion(null)}>
                Close
              </Button>
              <Button onClick={() => handleGeneratePO(selectedSuggestion)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Generate Purchase Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}