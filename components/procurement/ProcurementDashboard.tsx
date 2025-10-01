'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Globe,
  Building,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  ArrowRight,
  Zap,
  Target,
  Shield,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react'

interface DashboardMetrics {
  totalSpend: {
    current: number
    previous: number
    change: number
    currency: string
  }
  purchaseOrders: {
    total: number
    pending: number
    approved: number
    received: number
    change: number
  }
  suppliers: {
    total: number
    active: number
    preferred: number
    newThisMonth: number
  }
  shipments: {
    inTransit: number
    delivered: number
    delayed: number
    onTimeDelivery: number
  }
  savings: {
    amount: number
    percentage: number
    currency: string
  }
}

interface SpendByCategory {
  category: string
  amount: number
  percentage: number
  change: number
  color: string
}

interface TopSupplier {
  id: string
  name: string
  totalSpend: number
  orders: number
  performance: number
  rating: number
  trend: 'up' | 'down' | 'stable'
}

interface RecentActivity {
  id: string
  type: 'PO_CREATED' | 'PO_APPROVED' | 'SHIPMENT_RECEIVED' | 'SUPPLIER_ADDED' | 'INVOICE_PAID'
  title: string
  description: string
  timestamp: string
  user: string
  amount?: number
  currency?: string
}

interface AlertItem {
  id: string
  type: 'URGENT' | 'WARNING' | 'INFO'
  title: string
  description: string
  action?: string
  timestamp: string
}

const mockMetrics: DashboardMetrics = {
  totalSpend: {
    current: 285750,
    previous: 242300,
    change: 17.9,
    currency: 'AED'
  },
  purchaseOrders: {
    total: 45,
    pending: 8,
    approved: 12,
    received: 25,
    change: 12.5
  },
  suppliers: {
    total: 28,
    active: 25,
    preferred: 8,
    newThisMonth: 3
  },
  shipments: {
    inTransit: 15,
    delivered: 32,
    delayed: 2,
    onTimeDelivery: 94.1
  },
  savings: {
    amount: 18500,
    percentage: 6.5,
    currency: 'AED'
  }
}

const mockSpendByCategory: SpendByCategory[] = [
  {
    category: 'Raw Materials - Oud',
    amount: 125000,
    percentage: 43.7,
    change: 15.2,
    color: 'bg-blue-500'
  },
  {
    category: 'Essential Oils',
    amount: 85000,
    percentage: 29.8,
    change: 8.7,
    color: 'bg-green-500'
  },
  {
    category: 'Packaging Materials',
    amount: 45000,
    percentage: 15.7,
    change: -3.2,
    color: 'bg-yellow-500'
  },
  {
    category: 'Equipment & Machinery',
    amount: 20750,
    percentage: 7.3,
    change: 45.6,
    color: 'bg-purple-500'
  },
  {
    category: 'Services',
    amount: 10000,
    percentage: 3.5,
    change: 12.1,
    color: 'bg-orange-500'
  }
]

const mockTopSuppliers: TopSupplier[] = [
  {
    id: '1',
    name: 'Al Haramain Perfumes',
    totalSpend: 85000,
    orders: 15,
    performance: 96,
    rating: 4.8,
    trend: 'up'
  },
  {
    id: '2',
    name: 'Cambodian Oud Traders',
    totalSpend: 72000,
    orders: 8,
    performance: 88,
    rating: 4.2,
    trend: 'up'
  },
  {
    id: '3',
    name: 'Mysore Sandalwood Co.',
    totalSpend: 45000,
    orders: 12,
    performance: 92,
    rating: 4.4,
    trend: 'stable'
  },
  {
    id: '4',
    name: 'Rose Valley Distillery',
    totalSpend: 38000,
    orders: 6,
    performance: 94,
    rating: 4.7,
    trend: 'up'
  },
  {
    id: '5',
    name: 'Dubai Packaging Solutions',
    totalSpend: 25000,
    orders: 18,
    performance: 90,
    rating: 4.1,
    trend: 'down'
  }
]

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'PO_APPROVED',
    title: 'Purchase Order Approved',
    description: 'PO-2024-045 for Cambodian Oud approved by Mohammed Al-Rashid',
    timestamp: '2024-03-22T14:30:00Z',
    user: 'Mohammed Al-Rashid',
    amount: 29500,
    currency: 'AED'
  },
  {
    id: '2',
    type: 'SHIPMENT_RECEIVED',
    title: 'Shipment Delivered',
    description: 'SH-2024-001 from Al Haramain Perfumes delivered successfully',
    timestamp: '2024-03-22T11:15:00Z',
    user: 'Sarah Ahmed'
  },
  {
    id: '3',
    type: 'SUPPLIER_ADDED',
    title: 'New Supplier Added',
    description: 'Kashmir Spice Co. added as a new supplier for saffron',
    timestamp: '2024-03-22T09:45:00Z',
    user: 'Ahmed Hassan'
  },
  {
    id: '4',
    type: 'PO_CREATED',
    title: 'Purchase Order Created',
    description: 'PO-2024-046 created for Rose Valley Distillery',
    timestamp: '2024-03-21T16:20:00Z',
    user: 'Sarah Ahmed',
    amount: 42500,
    currency: 'AED'
  },
  {
    id: '5',
    type: 'INVOICE_PAID',
    title: 'Invoice Paid',
    description: 'INV-2024-023 from Mysore Sandalwood Co. paid',
    timestamp: '2024-03-21T13:10:00Z',
    user: 'Finance Team',
    amount: 11250,
    currency: 'AED'
  }
]

const mockAlerts: AlertItem[] = [
  {
    id: '1',
    type: 'URGENT',
    title: 'Critical Stock Level',
    description: 'Premium Cambodian Oud stock critically low (2.5 kg remaining)',
    action: 'Create Emergency PO',
    timestamp: '2024-03-22T15:00:00Z'
  },
  {
    id: '2',
    type: 'WARNING',
    title: 'Shipment Delayed',
    description: 'SH-2024-002 from Cambodia delayed due to customs clearance',
    action: 'Contact Carrier',
    timestamp: '2024-03-22T12:30:00Z'
  },
  {
    id: '3',
    type: 'INFO',
    title: 'Seasonal Demand Alert',
    description: 'Ramadan season approaching - consider increasing oud stock',
    action: 'Review Suggestions',
    timestamp: '2024-03-22T10:00:00Z'
  },
  {
    id: '4',
    type: 'WARNING',
    title: 'Supplier Performance',
    description: 'European Oils Ltd. delivery performance dropped to 75%',
    action: 'Review Supplier',
    timestamp: '2024-03-21T14:15:00Z'
  }
]

const ProcurementDashboard: React.FC = () => {
  const [metrics] = useState<DashboardMetrics>(mockMetrics)
  const [spendByCategory] = useState<SpendByCategory[]>(mockSpendByCategory)
  const [topSuppliers] = useState<TopSupplier[]>(mockTopSuppliers)
  const [recentActivity] = useState<RecentActivity[]>(mockRecentActivity)
  const [alerts] = useState<AlertItem[]>(mockAlerts)

  const formatCurrency = (amount: number, currency: string = 'AED') => {
    return `${currency} ${amount.toLocaleString()}`
  }

  const formatPercentage = (value: number, showSign: boolean = true) => {
    const sign = showSign && value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    return change > 0 ? <TrendingUp className="h-4 w-4" /> : change < 0 ? <TrendingDown className="h-4 w-4" /> : null
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200'
      case 'WARNING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'INFO': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'URGENT': return <AlertTriangle className="h-4 w-4" />
      case 'WARNING': return <Clock className="h-4 w-4" />
      case 'INFO': return <CheckCircle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'PO_CREATED': return <FileText className="h-4 w-4 text-blue-600" />
      case 'PO_APPROVED': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'SHIPMENT_RECEIVED': return <Truck className="h-4 w-4 text-purple-600" />
      case 'SUPPLIER_ADDED': return <Building className="h-4 w-4 text-orange-600" />
      case 'INVOICE_PAID': return <DollarSign className="h-4 w-4 text-emerald-600" />
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'stable': return <BarChart3 className="h-4 w-4 text-gray-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Procurement Dashboard</h1>
          <p className="text-gray-600">Supply chain analytics and procurement performance insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.slice(0, 2).map(alert => (
            <Card key={alert.id} className={`border-l-4 ${getAlertColor(alert.type)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <p className="text-sm opacity-90">{alert.description}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {alert.action && (
                    <Button size="sm" variant="outline">
                      {alert.action}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spend (30 days)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalSpend.current, metrics.totalSpend.currency)}
                </p>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(metrics.totalSpend.change)}`}>
                  {getChangeIcon(metrics.totalSpend.change)}
                  <span>{formatPercentage(metrics.totalSpend.change)} from last month</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Purchase Orders</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.purchaseOrders.total}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-yellow-600">{metrics.purchaseOrders.pending} pending</span>
                  <span className="text-green-600">{metrics.purchaseOrders.received} received</span>
                </div>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.suppliers.active}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-600">{metrics.suppliers.preferred} preferred</span>
                  <span className="text-green-600">{metrics.suppliers.newThisMonth} new</span>
                </div>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.shipments.onTimeDelivery}%</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-600">{metrics.shipments.inTransit} in transit</span>
                  <span className="text-red-600">{metrics.shipments.delayed} delayed</span>
                </div>
              </div>
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spend by Category */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Spend by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spendByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-4 h-4 rounded ${category.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-sm text-gray-600">{category.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${category.color}`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold">{formatCurrency(category.amount)}</div>
                    <div className={`text-sm ${getChangeColor(category.change)}`}>
                      {formatPercentage(category.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Savings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(metrics.savings.amount, metrics.savings.currency)}
              </div>
              <div className="text-lg text-gray-600 mb-4">
                {formatPercentage(metrics.savings.percentage, false)} savings this month
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Bulk discounts:</span>
                  <span className="font-medium">AED 8,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Early payments:</span>
                  <span className="font-medium">AED 4,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Negotiations:</span>
                  <span className="font-medium">AED 3,800</span>
                </div>
                <div className="flex justify-between">
                  <span>Alternative suppliers:</span>
                  <span className="font-medium">AED 2,000</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Suppliers
              </div>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSuppliers.map((supplier, index) => (
                <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{supplier.orders} orders</span>
                        <span>•</span>
                        <span>{supplier.performance}% performance</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <span>{supplier.rating}/5</span>
                          {getTrendIcon(supplier.trend)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(supplier.totalSpend)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>by {activity.user}</span>
                      {activity.amount && (
                        <>
                          <span>•</span>
                          <span className="font-medium">
                            {formatCurrency(activity.amount, activity.currency)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProcurementDashboard