'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Download,
  Filter,
  Printer,
  Share2,
  RefreshCw,
  Eye,
  Target,
  Clock,
  Users,
  Package,
  Zap,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Percent,
  Activity,
  PieChart,
  LineChart,
  Factory,
  Gauge,
  Award,
  Star,
  ThumbsUp,
  ThumbsDown,
  Timer,
  Calculator,
  Database,
  Settings,
  FileText,
  BarChart,
  TrendingDownIcon
} from 'lucide-react'

interface ProductionMetrics {
  totalBatches: number
  completedBatches: number
  inProgressBatches: number
  delayedBatches: number
  cancelledBatches: number
  totalUnitsProduced: number
  averageBatchTime: number
  onTimeDelivery: number
  qualityPassRate: number
  equipmentEfficiency: number
  operatorEfficiency: number
  materialWastage: number
  energyConsumption: number
  totalCost: number
  averageCostPerUnit: number
  profitMargin: number
}

interface ProductionTrend {
  date: string
  batchesCompleted: number
  unitsProduced: number
  efficiency: number
  quality: number
  cost: number
}

interface QualityMetrics {
  testsPassed: number
  testsFailed: number
  defectRate: number
  reworkRate: number
  customerComplaints: number
  qualityScore: number
  topDefects: { type: string; count: number; percentage: number }[]
  qualityTrends: { date: string; score: number }[]
}

interface EquipmentMetrics {
  equipmentId: string
  name: string
  utilization: number
  efficiency: number
  downtime: number
  maintenanceCost: number
  breakdowns: number
  totalRuntime: number
  energyConsumption: number
  status: 'operational' | 'maintenance' | 'offline'
}

interface OperatorMetrics {
  operatorId: string
  name: string
  hoursWorked: number
  efficiency: number
  qualityScore: number
  tasksCompleted: number
  averageTaskTime: number
  safety: number
  training: number
  attendance: number
}

interface CostAnalysis {
  totalCost: number
  materialCost: number
  laborCost: number
  overheadCost: number
  energyCost: number
  maintenanceCost: number
  costPerUnit: number
  costTrends: { date: string; cost: number }[]
  topCostDrivers: { category: string; amount: number; percentage: number }[]
}

interface KPITarget {
  name: string
  current: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  status: 'good' | 'warning' | 'critical'
}

interface AnalyticsFilter {
  dateRange: { start: Date; end: Date }
  department: string
  equipment: string[]
  operators: string[]
  recipes: string[]
  batchStatus: string[]
}

export default function ProductionAnalytics() {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState<ProductionMetrics | null>(null)
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null)
  const [equipmentMetrics, setEquipmentMetrics] = useState<EquipmentMetrics[]>([])
  const [operatorMetrics, setOperatorMetrics] = useState<OperatorMetrics[]>([])
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null)
  const [kpiTargets, setKpiTargets] = useState<KPITarget[]>([])
  const [trends, setTrends] = useState<ProductionTrend[]>([])
  const [filters, setFilters] = useState<AnalyticsFilter>({
    dateRange: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
    department: 'all',
    equipment: [],
    operators: [],
    recipes: [],
    batchStatus: []
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    generateMockData()
  }, [filters])

  const generateMockData = () => {
    setIsLoading(true)

    const mockMetrics: ProductionMetrics = {
      totalBatches: 156,
      completedBatches: 142,
      inProgressBatches: 8,
      delayedBatches: 4,
      cancelledBatches: 2,
      totalUnitsProduced: 8420,
      averageBatchTime: 6.8,
      onTimeDelivery: 91.2,
      qualityPassRate: 96.8,
      equipmentEfficiency: 87.5,
      operatorEfficiency: 92.3,
      materialWastage: 2.8,
      energyConsumption: 2840,
      totalCost: 145680,
      averageCostPerUnit: 17.3,
      profitMargin: 23.5
    }

    const mockQualityMetrics: QualityMetrics = {
      testsPassed: 1247,
      testsFailed: 42,
      defectRate: 3.2,
      reworkRate: 1.8,
      customerComplaints: 3,
      qualityScore: 96.8,
      topDefects: [
        { type: 'Color variation', count: 15, percentage: 35.7 },
        { type: 'Fragrance intensity', count: 12, percentage: 28.6 },
        { type: 'Viscosity', count: 8, percentage: 19.0 },
        { type: 'Clarity', count: 7, percentage: 16.7 }
      ],
      qualityTrends: [
        { date: '2024-03-15', score: 94.2 },
        { date: '2024-03-16', score: 95.1 },
        { date: '2024-03-17', score: 96.8 },
        { date: '2024-03-18', score: 97.2 },
        { date: '2024-03-19', score: 96.5 },
        { date: '2024-03-20', score: 96.8 },
        { date: '2024-03-21', score: 97.5 }
      ]
    }

    const mockEquipmentMetrics: EquipmentMetrics[] = [
      {
        equipmentId: 'DIST001',
        name: 'Distillation Unit 1',
        utilization: 85.2,
        efficiency: 92.8,
        downtime: 12.5,
        maintenanceCost: 2350,
        breakdowns: 2,
        totalRuntime: 687,
        energyConsumption: 1450,
        status: 'operational'
      },
      {
        equipmentId: 'BLEND001',
        name: 'Blending Unit 1',
        utilization: 78.9,
        efficiency: 88.4,
        downtime: 18.2,
        maintenanceCost: 1890,
        breakdowns: 1,
        totalRuntime: 623,
        energyConsumption: 890,
        status: 'operational'
      },
      {
        equipmentId: 'PACK001',
        name: 'Packaging Line 1',
        utilization: 92.3,
        efficiency: 95.1,
        downtime: 5.8,
        maintenanceCost: 1200,
        breakdowns: 0,
        totalRuntime: 742,
        energyConsumption: 500,
        status: 'operational'
      }
    ]

    const mockOperatorMetrics: OperatorMetrics[] = [
      {
        operatorId: 'OP001',
        name: 'Ahmed Hassan',
        hoursWorked: 184,
        efficiency: 96.2,
        qualityScore: 98.5,
        tasksCompleted: 42,
        averageTaskTime: 4.4,
        safety: 100,
        training: 95,
        attendance: 98
      },
      {
        operatorId: 'OP002',
        name: 'Fatima Al-Zahra',
        hoursWorked: 176,
        efficiency: 91.8,
        qualityScore: 94.2,
        tasksCompleted: 38,
        averageTaskTime: 4.6,
        safety: 98,
        training: 87,
        attendance: 95
      },
      {
        operatorId: 'OP003',
        name: 'Omar Abdullah',
        hoursWorked: 168,
        efficiency: 82.4,
        qualityScore: 88.7,
        tasksCompleted: 28,
        averageTaskTime: 6.0,
        safety: 95,
        training: 65,
        attendance: 92
      }
    ]

    const mockCostAnalysis: CostAnalysis = {
      totalCost: 145680,
      materialCost: 87408,
      laborCost: 29136,
      overheadCost: 17481,
      energyCost: 7284,
      maintenanceCost: 4371,
      costPerUnit: 17.3,
      costTrends: [
        { date: '2024-03-15', cost: 16.8 },
        { date: '2024-03-16', cost: 17.2 },
        { date: '2024-03-17', cost: 16.9 },
        { date: '2024-03-18', cost: 17.5 },
        { date: '2024-03-19', cost: 17.1 },
        { date: '2024-03-20', cost: 17.3 },
        { date: '2024-03-21', cost: 16.7 }
      ],
      topCostDrivers: [
        { category: 'Raw Materials', amount: 87408, percentage: 60.0 },
        { category: 'Labor', amount: 29136, percentage: 20.0 },
        { category: 'Overhead', amount: 17481, percentage: 12.0 },
        { category: 'Energy', amount: 7284, percentage: 5.0 },
        { category: 'Maintenance', amount: 4371, percentage: 3.0 }
      ]
    }

    const mockKpiTargets: KPITarget[] = [
      { name: 'On-Time Delivery', current: 91.2, target: 95.0, unit: '%', trend: 'up', status: 'warning' },
      { name: 'Quality Pass Rate', current: 96.8, target: 98.0, unit: '%', trend: 'up', status: 'good' },
      { name: 'Equipment Efficiency', current: 87.5, target: 90.0, unit: '%', trend: 'stable', status: 'warning' },
      { name: 'Material Wastage', current: 2.8, target: 2.0, unit: '%', trend: 'down', status: 'warning' },
      { name: 'Cost per Unit', current: 17.3, target: 16.5, unit: 'AED', trend: 'down', status: 'warning' },
      { name: 'Operator Efficiency', current: 92.3, target: 95.0, unit: '%', trend: 'up', status: 'good' }
    ]

    const mockTrends: ProductionTrend[] = [
      { date: '2024-03-15', batchesCompleted: 18, unitsProduced: 1080, efficiency: 86.2, quality: 94.2, cost: 16.8 },
      { date: '2024-03-16', batchesCompleted: 16, unitsProduced: 960, efficiency: 88.1, quality: 95.1, cost: 17.2 },
      { date: '2024-03-17', batchesCompleted: 22, unitsProduced: 1320, efficiency: 90.5, quality: 96.8, cost: 16.9 },
      { date: '2024-03-18', batchesCompleted: 20, unitsProduced: 1200, efficiency: 87.8, quality: 97.2, cost: 17.5 },
      { date: '2024-03-19', batchesCompleted: 19, unitsProduced: 1140, efficiency: 89.3, quality: 96.5, cost: 17.1 },
      { date: '2024-03-20', batchesCompleted: 21, unitsProduced: 1260, efficiency: 91.7, quality: 96.8, cost: 17.3 },
      { date: '2024-03-21', batchesCompleted: 24, unitsProduced: 1440, efficiency: 93.2, quality: 97.5, cost: 16.7 }
    ]

    setTimeout(() => {
      setMetrics(mockMetrics)
      setQualityMetrics(mockQualityMetrics)
      setEquipmentMetrics(mockEquipmentMetrics)
      setOperatorMetrics(mockOperatorMetrics)
      setCostAnalysis(mockCostAnalysis)
      setKpiTargets(mockKpiTargets)
      setTrends(mockTrends)
      setIsLoading(false)
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />
      default: return <CheckCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'stable': return <Activity className="h-4 w-4 text-gray-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const calculatePerformanceScore = (current: number, target: number) => {
    return Math.min(100, Math.max(0, (current / target) * 100))
  }

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting report as ${format}`)
    // Implementation would generate and download the report
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Production Analytics & Reporting</h2>
          <p className="text-muted-foreground">Comprehensive production insights and performance analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => generateMockData()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="space-y-2">
                <Button size="sm" variant="ghost" className="w-full justify-start" onClick={() => exportReport('pdf')}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF Report
                </Button>
                <Button size="sm" variant="ghost" className="w-full justify-start" onClick={() => exportReport('excel')}>
                  <Database className="mr-2 h-4 w-4" />
                  Excel Export
                </Button>
                <Button size="sm" variant="ghost" className="w-full justify-start" onClick={() => exportReport('csv')}>
                  <BarChart className="mr-2 h-4 w-4" />
                  CSV Data
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Analytics Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.start.toLocaleDateString()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.start}
                      onSelect={(date) => date && setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.end.toLocaleDateString()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.end}
                      onSelect={(date) => date && setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label>Department</Label>
              <Select value={filters.department} onValueChange={(value) =>
                setFilters(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="distillation">Distillation</SelectItem>
                  <SelectItem value="blending">Blending</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                  <SelectItem value="quality">Quality Control</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Equipment</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Equipment</SelectItem>
                  <SelectItem value="dist001">Distillation Unit 1</SelectItem>
                  <SelectItem value="blend001">Blending Unit 1</SelectItem>
                  <SelectItem value="pack001">Packaging Line 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Recipe Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Recipes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recipes</SelectItem>
                  <SelectItem value="oud">Oud Products</SelectItem>
                  <SelectItem value="perfume">Perfumes</SelectItem>
                  <SelectItem value="oils">Essential Oils</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="operators">Operators</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Batches</p>
                      <p className="text-2xl font-bold">{metrics.totalBatches}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{metrics.completedBatches}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Units Produced</p>
                      <p className="text-2xl font-bold">{metrics.totalUnitsProduced.toLocaleString()}</p>
                    </div>
                    <Factory className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                      <p className="text-2xl font-bold">{formatPercentage(metrics.onTimeDelivery)}</p>
                    </div>
                    <Target className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Quality Pass Rate</p>
                      <p className="text-2xl font-bold text-green-600">{formatPercentage(metrics.qualityPassRate)}</p>
                    </div>
                    <Award className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Production Efficiency Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trends.slice(-7).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">{new Date(trend.date).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">{trend.batchesCompleted} batches</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatPercentage(trend.efficiency)}</div>
                          <div className="text-xs text-muted-foreground">Efficiency</div>
                        </div>
                        <div className="w-24">
                          <Progress value={trend.efficiency} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Batch Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metrics && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm">Completed</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{metrics.completedBatches}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatPercentage((metrics.completedBatches / metrics.totalBatches) * 100)}
                        </div>
                      </div>
                    </div>
                    <Progress value={(metrics.completedBatches / metrics.totalBatches) * 100} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-sm">In Progress</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{metrics.inProgressBatches}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatPercentage((metrics.inProgressBatches / metrics.totalBatches) * 100)}
                        </div>
                      </div>
                    </div>
                    <Progress value={(metrics.inProgressBatches / metrics.totalBatches) * 100} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-sm">Delayed</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{metrics.delayedBatches}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatPercentage((metrics.delayedBatches / metrics.totalBatches) * 100)}
                        </div>
                      </div>
                    </div>
                    <Progress value={(metrics.delayedBatches / metrics.totalBatches) * 100} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-sm">Cancelled</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{metrics.cancelledBatches}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatPercentage((metrics.cancelledBatches / metrics.totalBatches) * 100)}
                        </div>
                      </div>
                    </div>
                    <Progress value={(metrics.cancelledBatches / metrics.totalBatches) * 100} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          {qualityMetrics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Quality Score</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatPercentage(qualityMetrics.qualityScore)}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Tests Passed</p>
                        <p className="text-2xl font-bold">{qualityMetrics.testsPassed}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Defect Rate</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {formatPercentage(qualityMetrics.defectRate)}
                        </p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer Complaints</p>
                        <p className="text-2xl font-bold">{qualityMetrics.customerComplaints}</p>
                      </div>
                      <ThumbsDown className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Quality Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {qualityMetrics.topDefects.map((defect, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{defect.type}</span>
                            <span>{defect.count} incidents ({formatPercentage(defect.percentage)})</span>
                          </div>
                          <Progress value={defect.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quality Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {qualityMetrics.qualityTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="text-sm">{new Date(trend.date).toLocaleDateString()}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{formatPercentage(trend.score)}</span>
                            <div className="w-16">
                              <Progress value={trend.score} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {equipmentMetrics.map((equipment) => (
              <Card key={equipment.equipmentId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{equipment.name}</CardTitle>
                    <Badge className={
                      equipment.status === 'operational' ? 'bg-green-100 text-green-800' :
                      equipment.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {equipment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Utilization</span>
                        <span>{formatPercentage(equipment.utilization)}</span>
                      </div>
                      <Progress value={equipment.utilization} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Efficiency</span>
                        <span>{formatPercentage(equipment.efficiency)}</span>
                      </div>
                      <Progress value={equipment.efficiency} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Runtime</p>
                        <p className="font-medium">{equipment.totalRuntime}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Downtime</p>
                        <p className="font-medium">{equipment.downtime}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Breakdowns</p>
                        <p className="font-medium">{equipment.breakdowns}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Maintenance Cost</p>
                        <p className="font-medium">{formatCurrency(equipment.maintenanceCost)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="operators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Operator Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operator</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Avg Task Time</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Overall Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operatorMetrics.map((operator) => {
                    const overallScore = (operator.efficiency + operator.qualityScore + operator.attendance) / 3
                    return (
                      <TableRow key={operator.operatorId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{operator.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {operator.operatorId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{operator.hoursWorked}h</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{formatPercentage(operator.efficiency)}</span>
                            <div className="w-16">
                              <Progress value={operator.efficiency} className="h-2" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{formatPercentage(operator.qualityScore)}</span>
                            <div className="w-16">
                              <Progress value={operator.qualityScore} className="h-2" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{operator.tasksCompleted}</TableCell>
                        <TableCell>{operator.averageTaskTime}h</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{formatPercentage(operator.attendance)}</span>
                            <div className="w-16">
                              <Progress value={operator.attendance} className="h-2" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            overallScore >= 95 ? 'bg-green-100 text-green-800' :
                            overallScore >= 85 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {formatPercentage(overallScore)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          {costAnalysis && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                        <p className="text-2xl font-bold">{formatCurrency(costAnalysis.totalCost)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Cost per Unit</p>
                        <p className="text-2xl font-bold">{formatCurrency(costAnalysis.costPerUnit)}</p>
                      </div>
                      <Calculator className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Material Cost</p>
                        <p className="text-2xl font-bold">{formatCurrency(costAnalysis.materialCost)}</p>
                      </div>
                      <Package className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Labor Cost</p>
                        <p className="text-2xl font-bold">{formatCurrency(costAnalysis.laborCost)}</p>
                      </div>
                      <Users className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {costAnalysis.topCostDrivers.map((driver, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{driver.category}</span>
                            <span>{formatCurrency(driver.amount)} ({formatPercentage(driver.percentage)})</span>
                          </div>
                          <Progress value={driver.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cost Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {costAnalysis.costTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="text-sm">{new Date(trend.date).toLocaleDateString()}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{formatCurrency(trend.cost)}</span>
                            {index > 0 && (
                              <div className="text-xs">
                                {trend.cost > costAnalysis.costTrends[index - 1].cost ? (
                                  <TrendingUp className="h-3 w-3 text-red-500" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-green-500" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="kpis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpiTargets.map((kpi, index) => {
              const performanceScore = calculatePerformanceScore(kpi.current, kpi.target)
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{kpi.name}</CardTitle>
                      {getStatusIcon(kpi.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">
                            {kpi.unit === 'AED' ? formatCurrency(kpi.current) :
                             kpi.unit === '%' ? formatPercentage(kpi.current) :
                             `${kpi.current} ${kpi.unit}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Target: {kpi.unit === 'AED' ? formatCurrency(kpi.target) :
                                    kpi.unit === '%' ? formatPercentage(kpi.target) :
                                    `${kpi.target} ${kpi.unit}`}
                          </p>
                        </div>
                        {getTrendIcon(kpi.trend)}
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Performance</span>
                          <span>{formatPercentage(performanceScore)}</span>
                        </div>
                        <Progress value={performanceScore} className="h-2" />
                      </div>

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current</span>
                        <span>Target</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}