'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Forecast {
  id: string
  productId: string
  productName: string
  category: string
  currentStock: number
  forecastedDemand: number
  forecastedSales: number
  forecastedRevenue: number
  period: 'week' | 'month' | 'quarter' | 'year'
  confidence: number
  trend: 'up' | 'down' | 'stable'
  recommendation: string
  stockStatus: 'overstocked' | 'adequate' | 'low' | 'critical'
  createdAt: string
}

export default function ForecastingDashboard() {
  const [forecasts, setForecasts] = useState<Forecast[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    fetchForecasts()
  }, [period, category])

  const fetchForecasts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('period', period)
      if (category !== 'all') params.append('category', category)

      const response = await fetch(`/api/forecasting?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setForecasts(data.forecasts || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch forecasts'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load forecasts'
      })
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />
    return <BarChart3 className="h-4 w-4 text-gray-600" />
  }

  const getStockStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "success" | "warning", icon: React.ReactNode }> = {
      overstocked: { variant: 'secondary', icon: <AlertTriangle className="h-3 w-3" /> },
      adequate: { variant: 'success', icon: <CheckCircle className="h-3 w-3" /> },
      low: { variant: 'warning', icon: <AlertTriangle className="h-3 w-3" /> },
      critical: { variant: 'default', icon: <AlertTriangle className="h-3 w-3" /> }
    }
    const config = variants[status] || variants.adequate
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const stats = {
    total: forecasts.length,
    critical: forecasts.filter(f => f.stockStatus === 'critical').length,
    low: forecasts.filter(f => f.stockStatus === 'low').length,
    totalForecastedRevenue: forecasts.reduce((sum, f) => sum + f.forecastedRevenue, 0)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            Sales Forecasting
          </h1>
          <p className="text-muted-foreground">AI-powered demand and sales predictions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchForecasts}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Tracked</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.low}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecasted Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">AED {stats.totalForecastedRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Next Week</SelectItem>
                  <SelectItem value="month">Next Month</SelectItem>
                  <SelectItem value="quarter">Next Quarter</SelectItem>
                  <SelectItem value="year">Next Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="perfumes">Perfumes</SelectItem>
                  <SelectItem value="oils">Oils</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="gift-sets">Gift Sets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecasts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Demand Forecasts</CardTitle>
          <CardDescription>AI-generated predictions based on historical data</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          ) : forecasts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No forecasts available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Forecasted Demand</TableHead>
                  <TableHead>Forecasted Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecasts.map((forecast) => (
                  <TableRow key={forecast.id}>
                    <TableCell className="font-medium">{forecast.productName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{forecast.category}</Badge>
                    </TableCell>
                    <TableCell>{forecast.currentStock}</TableCell>
                    <TableCell className="font-medium">{forecast.forecastedDemand}</TableCell>
                    <TableCell>{forecast.forecastedSales}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {forecast.forecastedRevenue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{forecast.confidence}%</span>
                        </div>
                        <Progress value={forecast.confidence} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(forecast.trend)}
                        <span className="capitalize">{forecast.trend}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStockStatusBadge(forecast.stockStatus)}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm text-muted-foreground">{forecast.recommendation}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
