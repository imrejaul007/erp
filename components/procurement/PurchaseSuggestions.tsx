'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  Package,
  Calendar,
  DollarSign,
  Target,
  Zap,
  Clock,
  Users,
  BarChart3,
  Lightbulb,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react'

interface PurchaseSuggestion {
  id: string
  type: 'REORDER' | 'SEASONAL' | 'TREND_BASED' | 'PROMOTIONAL' | 'EMERGENCY'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  confidence: number // 0-100
  rawMaterial: {
    id: string
    code: string
    name: string
    nameAr?: string
    category: string
    currentStock: number
    unit: string
  }
  supplier: {
    id: string
    name: string
    code: string
    leadTime: number
    rating: number
    unitPrice: number
    currency: string
  }
  suggestedQuantity: number
  estimatedCost: number
  reasoning: string[]
  metrics: {
    salesTrend: number // percentage change
    stockLevel: number // percentage of max stock
    demandForecast: number
    seasonalFactor: number
    leadTimeRisk: number
  }
  dueDate: string
  createdAt: string
  status: 'PENDING' | 'APPROVED' | 'CONVERTED' | 'REJECTED'
}

interface MarketTrend {
  id: string
  material: string
  category: string
  trend: 'RISING' | 'FALLING' | 'STABLE'
  changePercent: number
  period: string
  reason: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface SeasonalInsight {
  id: string
  season: string
  material: string
  category: string
  expectedDemandIncrease: number
  recommendedStockLevel: number
  prepareBy: string
  description: string
}

const mockSuggestions: PurchaseSuggestion[] = [
  {
    id: '1',
    type: 'EMERGENCY',
    priority: 'URGENT',
    confidence: 95,
    rawMaterial: {
      id: '1',
      code: 'RM-OUD-001',
      name: 'Premium Cambodian Oud',
      nameAr: 'عود كمبودي فاخر',
      category: 'Oud',
      currentStock: 2.5,
      unit: 'kg'
    },
    supplier: {
      id: '3',
      name: 'Cambodian Oud Traders',
      code: 'SUP-003',
      leadTime: 21,
      rating: 4.2,
      unitPrice: 1500,
      currency: 'AED'
    },
    suggestedQuantity: 10,
    estimatedCost: 15000,
    reasoning: [
      'Current stock critically low (5% of max level)',
      'High demand expected for upcoming Ramadan season',
      'Recent sales increased by 85% compared to last month',
      'Lead time of 21 days requires immediate action'
    ],
    metrics: {
      salesTrend: 85,
      stockLevel: 5,
      demandForecast: 220,
      seasonalFactor: 150,
      leadTimeRisk: 80
    },
    dueDate: '2024-03-25',
    createdAt: '2024-03-22',
    status: 'PENDING'
  },
  {
    id: '2',
    type: 'SEASONAL',
    priority: 'HIGH',
    confidence: 88,
    rawMaterial: {
      id: '2',
      code: 'RM-ROSE-001',
      name: 'Bulgarian Rose Oil',
      category: 'Essential Oils',
      currentStock: 15.2,
      unit: 'ml'
    },
    supplier: {
      id: '4',
      name: 'Rose Valley Distillery',
      code: 'SUP-004',
      leadTime: 14,
      rating: 4.7,
      unitPrice: 850,
      currency: 'AED'
    },
    suggestedQuantity: 50,
    estimatedCost: 42500,
    reasoning: [
      'Spring season approaching - rose-based perfumes in high demand',
      'Historical data shows 45% increase in sales during March-May',
      'Current stock sufficient for 2 weeks at projected demand',
      'Supplier offers 10% discount for orders above 40ml'
    ],
    metrics: {
      salesTrend: 45,
      stockLevel: 25,
      demandForecast: 180,
      seasonalFactor: 145,
      leadTimeRisk: 30
    },
    dueDate: '2024-04-01',
    createdAt: '2024-03-22',
    status: 'PENDING'
  },
  {
    id: '3',
    type: 'TREND_BASED',
    priority: 'MEDIUM',
    confidence: 72,
    rawMaterial: {
      id: '3',
      code: 'RM-SAFFRON-001',
      name: 'Kashmir Saffron',
      category: 'Spices',
      currentStock: 25.8,
      unit: 'grams'
    },
    supplier: {
      id: '5',
      name: 'Kashmir Spice Co.',
      code: 'SUP-005',
      leadTime: 18,
      rating: 4.4,
      unitPrice: 120,
      currency: 'AED'
    },
    suggestedQuantity: 100,
    estimatedCost: 12000,
    reasoning: [
      'Growing trend in saffron-based luxury perfumes',
      'Social media mentions increased by 65% this month',
      'Competitor analysis shows increased saffron product launches',
      'Current stock adequate but trending materials should be stocked'
    ],
    metrics: {
      salesTrend: 25,
      stockLevel: 60,
      demandForecast: 140,
      seasonalFactor: 105,
      leadTimeRisk: 40
    },
    dueDate: '2024-04-10',
    createdAt: '2024-03-22',
    status: 'PENDING'
  },
  {
    id: '4',
    type: 'REORDER',
    priority: 'MEDIUM',
    confidence: 82,
    rawMaterial: {
      id: '4',
      code: 'RM-SANDALWOOD-001',
      name: 'Mysore Sandalwood',
      category: 'Wood',
      currentStock: 8.5,
      unit: 'kg'
    },
    supplier: {
      id: '2',
      name: 'Mysore Sandalwood Co.',
      code: 'SUP-002',
      leadTime: 14,
      rating: 4.4,
      unitPrice: 450,
      currency: 'AED'
    },
    suggestedQuantity: 25,
    estimatedCost: 11250,
    reasoning: [
      'Stock level below reorder point (40% of max)',
      'Consistent demand pattern over last 6 months',
      'Preferred supplier with good delivery record',
      'Bulk pricing available for 25kg+ orders'
    ],
    metrics: {
      salesTrend: 12,
      stockLevel: 40,
      demandForecast: 110,
      seasonalFactor: 100,
      leadTimeRisk: 25
    },
    dueDate: '2024-04-05',
    createdAt: '2024-03-22',
    status: 'APPROVED'
  }
]

const mockMarketTrends: MarketTrend[] = [
  {
    id: '1',
    material: 'Oud',
    category: 'Premium Woods',
    trend: 'RISING',
    changePercent: 25,
    period: 'Last 30 days',
    reason: 'Increased demand due to upcoming Ramadan season',
    impact: 'HIGH'
  },
  {
    id: '2',
    material: 'Rose',
    category: 'Floral Essences',
    trend: 'RISING',
    changePercent: 18,
    period: 'Last 15 days',
    reason: 'Spring season and Valentine\'s Day effect',
    impact: 'MEDIUM'
  },
  {
    id: '3',
    material: 'Musk',
    category: 'Animal Notes',
    trend: 'FALLING',
    changePercent: -12,
    period: 'Last 60 days',
    reason: 'Shift towards synthetic alternatives',
    impact: 'MEDIUM'
  }
]

const mockSeasonalInsights: SeasonalInsight[] = [
  {
    id: '1',
    season: 'Ramadan 2024',
    material: 'Oud & Frankincense',
    category: 'Religious/Traditional',
    expectedDemandIncrease: 180,
    recommendedStockLevel: 250,
    prepareBy: '2024-03-10',
    description: 'Historical data shows dramatic increase in traditional fragrance demand during Ramadan'
  },
  {
    id: '2',
    season: 'Summer 2024',
    material: 'Citrus & Marine Notes',
    category: 'Fresh/Light',
    expectedDemandIncrease: 65,
    recommendedStockLevel: 140,
    prepareBy: '2024-04-15',
    description: 'Light, fresh fragrances preferred during hot UAE summer months'
  }
]

const PurchaseSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<PurchaseSuggestion[]>(mockSuggestions)
  const [marketTrends] = useState<MarketTrend[]>(mockMarketTrends)
  const [seasonalInsights] = useState<SeasonalInsight[]>(mockSeasonalInsights)
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterPriority, setFilterPriority] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('PENDING')

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesType = filterType === 'ALL' || suggestion.type === filterType
    const matchesPriority = filterPriority === 'ALL' || suggestion.priority === filterPriority
    const matchesStatus = filterStatus === 'ALL' || suggestion.status === filterStatus

    return matchesType && matchesPriority && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EMERGENCY': return 'bg-red-100 text-red-800'
      case 'SEASONAL': return 'bg-orange-100 text-orange-800'
      case 'TREND_BASED': return 'bg-purple-100 text-purple-800'
      case 'PROMOTIONAL': return 'bg-green-100 text-green-800'
      case 'REORDER': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'RISING': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'FALLING': return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'STABLE': return <BarChart3 className="h-4 w-4 text-gray-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const approveSuggestion = (id: string) => {
    setSuggestions(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'APPROVED' as const } : s
    ))
  }

  const rejectSuggestion = (id: string) => {
    setSuggestions(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'REJECTED' as const } : s
    ))
  }

  const convertToPO = (id: string) => {
    setSuggestions(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'CONVERTED' as const } : s
    ))
  }

  const suggestionCounts = {
    all: suggestions.length,
    pending: suggestions.filter(s => s.status === 'PENDING').length,
    approved: suggestions.filter(s => s.status === 'APPROVED').length,
    urgent: suggestions.filter(s => s.priority === 'URGENT').length,
  }

  const totalEstimatedSavings = suggestions
    .filter(s => s.status === 'PENDING')
    .reduce((sum, s) => sum + (s.estimatedCost * 0.05), 0) // Assume 5% potential savings

  const SuggestionCard: React.FC<{ suggestion: PurchaseSuggestion }> = ({ suggestion }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{suggestion.rawMaterial.name}</h3>
              {suggestion.rawMaterial.nameAr && (
                <span className="text-sm text-gray-500">({suggestion.rawMaterial.nameAr})</span>
              )}
              <Badge className={getTypeColor(suggestion.type)}>
                {suggestion.type.replace('_', ' ')}
              </Badge>
              <Badge className={getPriorityColor(suggestion.priority)}>
                {suggestion.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span>{suggestion.rawMaterial.code}</span>
              <span>•</span>
              <span>{suggestion.rawMaterial.category}</span>
              <span>•</span>
              <span>Current Stock: {suggestion.rawMaterial.currentStock} {suggestion.rawMaterial.unit}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Supplier: {suggestion.supplier.name}</span>
              <span>•</span>
              <span>Lead Time: {suggestion.supplier.leadTime} days</span>
              <span>•</span>
              <span className={getConfidenceColor(suggestion.confidence)}>
                Confidence: {suggestion.confidence}%
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {suggestion.supplier.currency} {suggestion.estimatedCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              {suggestion.suggestedQuantity} {suggestion.rawMaterial.unit}
            </div>
            <div className="text-sm text-gray-500">
              Due: {new Date(suggestion.dueDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">AI Analysis</span>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            {suggestion.reasoning.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{suggestion.metrics.salesTrend}%</div>
            <div className="text-xs text-gray-500">Sales Trend</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{suggestion.metrics.stockLevel}%</div>
            <div className="text-xs text-gray-500">Stock Level</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{suggestion.metrics.demandForecast}</div>
            <div className="text-xs text-gray-500">Demand Forecast</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{suggestion.metrics.seasonalFactor}</div>
            <div className="text-xs text-gray-500">Seasonal Factor</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{suggestion.metrics.leadTimeRisk}%</div>
            <div className="text-xs text-gray-500">Lead Time Risk</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              Lead Time: {suggestion.supplier.leadTime}d
            </Badge>
            <Badge variant="outline" className="text-xs">
              Rating: {suggestion.supplier.rating}/5
            </Badge>
          </div>
          <div className="flex gap-2">
            {suggestion.status === 'PENDING' && (
              <>
                <Button size="sm" variant="outline" onClick={() => rejectSuggestion(suggestion.id)}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm" variant="outline" onClick={() => approveSuggestion(suggestion.id)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            )}
            {suggestion.status === 'APPROVED' && (
              <Button size="sm" onClick={() => convertToPO(suggestion.id)}>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Create PO
              </Button>
            )}
            {suggestion.status === 'CONVERTED' && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Converted to PO
              </Badge>
            )}
            {suggestion.status === 'REJECTED' && (
              <Badge className="bg-red-100 text-red-800">
                <XCircle className="h-3 w-3 mr-1" />
                Rejected
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Purchase Suggestions</h1>
          <p className="text-gray-600">Smart procurement recommendations based on sales trends and inventory analytics</p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Suggestions</p>
                <p className="text-2xl font-bold text-gray-900">{suggestionCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{suggestionCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">{suggestionCounts.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Potential Savings</p>
                <p className="text-2xl font-bold text-gray-900">AED {totalEstimatedSavings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">Purchase Suggestions</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="ALL">All Types</option>
                    <option value="EMERGENCY">Emergency</option>
                    <option value="SEASONAL">Seasonal</option>
                    <option value="TREND_BASED">Trend-Based</option>
                    <option value="PROMOTIONAL">Promotional</option>
                    <option value="REORDER">Reorder</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions List */}
          <div className="space-y-4">
            {filteredSuggestions.map(suggestion => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>

          {filteredSuggestions.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions found</h3>
                <p className="text-gray-600">Try adjusting your filters or refresh the analysis.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketTrends.map(trend => (
              <Card key={trend.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{trend.material}</h3>
                    {getTrendIcon(trend.trend)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Change:</span>
                      <span className={trend.changePercent > 0 ? 'text-green-600' : 'text-red-600'}>
                        {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Period:</span>
                      <span>{trend.period}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Impact:</span>
                      <Badge variant={trend.impact === 'HIGH' ? 'destructive' : trend.impact === 'MEDIUM' ? 'secondary' : 'outline'}>
                        {trend.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mt-3">{trend.reason}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          <div className="space-y-4">
            {seasonalInsights.map(insight => (
              <Card key={insight.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{insight.season}</h3>
                      <p className="text-gray-600">{insight.material} • {insight.category}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      +{insight.expectedDemandIncrease}% Expected
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{insight.expectedDemandIncrease}%</div>
                      <div className="text-xs text-gray-500">Demand Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{insight.recommendedStockLevel}%</div>
                      <div className="text-xs text-gray-500">Recommended Stock</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{insight.prepareBy}</div>
                      <div className="text-xs text-gray-500">Prepare By</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PurchaseSuggestions