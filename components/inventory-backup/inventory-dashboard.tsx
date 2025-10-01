'use client'

import React, { useMemo, useState } from 'react'
import { useInventoryStore } from '@/store/inventory-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Clock,
  Boxes,
  Eye,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Target,
} from 'lucide-react'
import { format, subDays, subMonths } from 'date-fns'
import type { InventoryStats, MaterialWithBatches, StockLevel, ConsumptionPattern } from '@/types/inventory'
import { STOCK_STATUS_COLORS, GRADE_COLORS } from '@/types/inventory'

interface InventoryDashboardProps {
  onViewMaterial?: (material: MaterialWithBatches) => void
  onViewAlerts?: () => void
  onViewReports?: () => void
}

const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
  '#ff0000', '#00ffff', '#ff00ff', '#ffff00', '#0000ff'
]

export function InventoryDashboard({
  onViewMaterial,
  onViewAlerts,
  onViewReports,
}: InventoryDashboardProps) {
  const {
    materials,
    batches,
    stockAlerts,
    inventoryStats,
    statsLoading,
    materialsLoading,
    unreadAlertsCount,
  } = useInventoryStore()

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Calculate comprehensive stats
  const stats = useMemo(() => {
    if (materialsLoading || materials.length === 0) return null

    const totalMaterials = materials.length
    const activeMaterials = materials.filter(m => m.isActive).length
    const totalBatches = batches.length

    // Stock analysis
    const outOfStockItems = materials.filter(m => m.currentStock <= 0).length
    const lowStockItems = materials.filter(m =>
      m.currentStock > 0 && m.currentStock <= m.reorderLevel
    ).length
    const overstockItems = materials.filter(m =>
      m.maxStockLevel && m.currentStock >= m.maxStockLevel
    ).length
    const normalStockItems = totalMaterials - outOfStockItems - lowStockItems - overstockItems

    // Financial analysis
    const totalValue = materials.reduce((sum, m) =>
      sum + (m.currentStock * m.costPerUnit), 0
    )
    const avgStockLevel = materials.reduce((sum, m) => sum + m.currentStock, 0) / totalMaterials

    // Category breakdown
    const categoryStats = materials.reduce((acc, material) => {
      const categoryName = material.category?.name || 'Uncategorized'
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          count: 0,
          value: 0,
          stock: 0,
        }
      }
      acc[categoryName].count++
      acc[categoryName].value += material.currentStock * material.costPerUnit
      acc[categoryName].stock += material.currentStock
      return acc
    }, {} as Record<string, { name: string; count: number; value: number; stock: number }>)

    const topCategories = Object.values(categoryStats)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    // Grade distribution
    const gradeDistribution = materials.reduce((acc, material) => {
      acc[material.grade] = (acc[material.grade] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Stock status distribution
    const stockStatusDistribution = {
      NORMAL: normalStockItems,
      LOW_STOCK: lowStockItems,
      OUT_OF_STOCK: outOfStockItems,
      OVERSTOCK: overstockItems,
    }

    return {
      totalMaterials,
      activeMaterials,
      totalBatches,
      outOfStockItems,
      lowStockItems,
      overstockItems,
      normalStockItems,
      totalValue,
      avgStockLevel,
      topCategories,
      gradeDistribution,
      stockStatusDistribution,
    }
  }, [materials, batches, materialsLoading])

  // Generate mock trend data (in real app, this would come from API)
  const trendData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const data = []

    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'MMM dd')
      data.push({
        date,
        totalStock: Math.floor(Math.random() * 1000) + 5000,
        totalValue: Math.floor(Math.random() * 50000) + 100000,
        movements: Math.floor(Math.random() * 50) + 10,
        alerts: Math.floor(Math.random() * 5),
      })
    }

    return data
  }, [timeRange])

  // Get consumption patterns (mock data)
  const consumptionPatterns: ConsumptionPattern[] = useMemo(() => {
    return materials.slice(0, 10).map(material => ({
      materialId: material.id,
      materialName: material.name,
      totalConsumption: Math.floor(Math.random() * 500) + 100,
      unit: material.unitOfMeasure,
      trend: Math.random() > 0.5 ? 'INCREASING' : Math.random() > 0.5 ? 'DECREASING' : 'STABLE',
      periodComparison: (Math.random() - 0.5) * 50, // -25% to +25%
    }))
  }, [materials])

  // Filter materials by category if selected
  const filteredMaterials = useMemo(() => {
    if (!selectedCategory) return materials
    return materials.filter(m => m.category?.name === selectedCategory)
  }, [materials, selectedCategory])

  if (statsLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your raw materials, stock levels, and key metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onViewReports}>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMaterials}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeMaterials} active materials
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.lowStockItems + stats.outOfStockItems}
            </div>
            <p className="text-xs text-muted-foreground">
              {unreadAlertsCount} unread alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBatches}</div>
            <p className="text-xs text-muted-foreground">
              Active material batches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {(stats.outOfStockItems > 0 || stats.lowStockItems > 0) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              You have {stats.outOfStockItems} out-of-stock and {stats.lowStockItems} low-stock materials requiring attention.
            </span>
            <Button variant="link" className="p-0 h-auto" onClick={onViewAlerts}>
              View Alerts
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stock Status Distribution</CardTitle>
                <CardDescription>
                  Overview of current stock levels across all materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.stockStatusDistribution).map(([status, count], index) => {
                    const percentage = (count / stats.totalMaterials) * 100
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {status.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Material Grades</CardTitle>
                <CardDescription>
                  Distribution of materials by quality grade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(stats.gradeDistribution).map(([grade, count], index) => ({
                          name: grade,
                          value: count,
                          fill: CHART_COLORS[index % CHART_COLORS.length]
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Categories by Value</CardTitle>
              <CardDescription>
                Most valuable inventory categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCategories.map((category, index) => (
                  <div key={category.name} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ${category.value.toLocaleString()} ({category.count} items)
                        </span>
                      </div>
                      <Progress
                        value={(category.value / stats.totalValue) * 100}
                        className="h-2 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Critical Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Out of Stock */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-destructive">
                  Out of Stock Items
                </CardTitle>
                <CardDescription>
                  Materials that need immediate restocking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {materials
                    .filter(m => m.currentStock <= 0)
                    .slice(0, 5)
                    .map(material => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg cursor-pointer hover:bg-destructive/10 transition-colors"
                        onClick={() => onViewMaterial?.(material)}
                      >
                        <div>
                          <div className="font-medium">{material.name}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {material.sku}
                          </div>
                        </div>
                        <Badge variant="destructive">
                          Out of Stock
                        </Badge>
                      </div>
                    ))}
                  {materials.filter(m => m.currentStock <= 0).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No out-of-stock items
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-warning">
                  Low Stock Items
                </CardTitle>
                <CardDescription>
                  Materials approaching reorder level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {materials
                    .filter(m => m.currentStock > 0 && m.currentStock <= m.reorderLevel)
                    .slice(0, 5)
                    .map(material => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 bg-warning/5 rounded-lg cursor-pointer hover:bg-warning/10 transition-colors"
                        onClick={() => onViewMaterial?.(material)}
                      >
                        <div>
                          <div className="font-medium">{material.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {material.currentStock} {material.unitOfMeasure} left
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          Low Stock
                        </Badge>
                      </div>
                    ))}
                  {materials.filter(m => m.currentStock > 0 && m.currentStock <= m.reorderLevel).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No low-stock items
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Stock Level Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stock Level Trends</CardTitle>
                <CardDescription>
                  Total stock levels over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="totalStock"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                        name="Total Stock"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Value and Movements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inventory Value</CardTitle>
                  <CardDescription>
                    Total inventory value over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="totalValue"
                          stroke="#82ca9d"
                          strokeWidth={2}
                          name="Total Value ($)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stock Movements</CardTitle>
                  <CardDescription>
                    Daily stock movement activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="movements" fill="#ffc658" name="Movements" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consumption Patterns</CardTitle>
              <CardDescription>
                Material usage trends and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consumptionPatterns.map((pattern) => (
                  <div key={pattern.materialId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{pattern.materialName}</div>
                      <div className="text-sm text-muted-foreground">
                        Total consumption: {pattern.totalConsumption.toLocaleString()} {pattern.unit}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          pattern.trend === 'INCREASING' ? 'destructive' :
                          pattern.trend === 'DECREASING' ? 'default' : 'secondary'
                        }
                      >
                        {pattern.trend === 'INCREASING' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {pattern.trend === 'DECREASING' && <TrendingDown className="h-3 w-3 mr-1" />}
                        {pattern.trend}
                      </Badge>
                      <div className="text-sm font-medium">
                        {pattern.periodComparison > 0 ? '+' : ''}{pattern.periodComparison.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {stats.topCategories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSelectedCategory('')}>
              Clear Filter
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topCategories} margin={{ bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Value ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}