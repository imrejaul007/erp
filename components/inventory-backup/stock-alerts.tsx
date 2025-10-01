'use client'

import React, { useState, useMemo } from 'react'
import { useInventoryStore } from '@/store/inventory-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  Clock,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Search,
  Trash2,
  X,
  CheckCheck,
  AlertCircle,
  TrendingDown,
  Calendar,
} from 'lucide-react'
import { format, formatDistanceToNow, differenceInDays } from 'date-fns'
import type { StockAlertWithMaterial, StockAlertType, AlertSeverity } from '@/types/inventory'

interface StockAlertsProps {
  onViewMaterial?: (materialId: string) => void
  onCreatePurchaseOrder?: (materialId: string) => void
  compact?: boolean
}

const ALERT_TYPE_CONFIG = {
  LOW_STOCK: {
    icon: TrendingDown,
    color: 'warning',
    label: 'Low Stock',
    description: 'Stock level below reorder point',
  },
  OUT_OF_STOCK: {
    icon: AlertTriangle,
    color: 'destructive',
    label: 'Out of Stock',
    description: 'No stock available',
  },
  OVERSTOCK: {
    icon: Package,
    color: 'secondary',
    label: 'Overstock',
    description: 'Stock level above maximum',
  },
  EXPIRY_WARNING: {
    icon: Clock,
    color: 'warning',
    label: 'Expiring Soon',
    description: 'Materials expiring within 30 days',
  },
  EXPIRY_URGENT: {
    icon: AlertCircle,
    color: 'destructive',
    label: 'Expires Soon',
    description: 'Materials expiring within 7 days',
  },
  QUALITY_ISSUE: {
    icon: AlertTriangle,
    color: 'destructive',
    label: 'Quality Issue',
    description: 'Quality concerns reported',
  },
  BATCH_RECALL: {
    icon: X,
    color: 'destructive',
    label: 'Batch Recall',
    description: 'Batch recall initiated',
  },
}

const SEVERITY_COLORS = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
}

export function StockAlerts({
  onViewMaterial,
  onCreatePurchaseOrder,
  compact = false,
}: StockAlertsProps) {
  const {
    stockAlerts,
    alertsLoading,
    unreadAlertsCount,
    markAlertAsRead,
    markAllAlertsAsRead,
    updateStockAlert,
    deleteStockAlert,
  } = useInventoryStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<StockAlertType | ''>('')
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | ''>('')
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)
  const [bulkSelection, setBulkSelection] = useState<string[]>([])

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    let filtered = stockAlerts

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(search) ||
        alert.message.toLowerCase().includes(search) ||
        alert.material.name.toLowerCase().includes(search) ||
        alert.material.sku.toLowerCase().includes(search)
      )
    }

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(alert => alert.type === selectedType)
    }

    // Apply severity filter
    if (selectedSeverity) {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity)
    }

    // Apply read status filter
    if (showOnlyUnread) {
      filtered = filtered.filter(alert => !alert.isRead)
    }

    // Sort by severity (critical first) and creation date (newest first)
    return filtered.sort((a, b) => {
      const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity]
      if (severityDiff !== 0) return severityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [stockAlerts, searchTerm, selectedType, selectedSeverity, showOnlyUnread])

  // Group alerts by type
  const alertsByType = useMemo(() => {
    return filteredAlerts.reduce((acc, alert) => {
      if (!acc[alert.type]) {
        acc[alert.type] = []
      }
      acc[alert.type].push(alert)
      return acc
    }, {} as Record<StockAlertType, StockAlertWithMaterial[]>)
  }, [filteredAlerts])

  // Handle bulk actions
  const handleBulkMarkAsRead = () => {
    bulkSelection.forEach(alertId => {
      markAlertAsRead(alertId)
    })
    setBulkSelection([])
  }

  const handleBulkDelete = () => {
    bulkSelection.forEach(alertId => {
      deleteStockAlert(alertId)
    })
    setBulkSelection([])
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setBulkSelection(filteredAlerts.map(alert => alert.id))
    } else {
      setBulkSelection([])
    }
  }

  const handleSelectAlert = (alertId: string, checked: boolean) => {
    if (checked) {
      setBulkSelection(prev => [...prev, alertId])
    } else {
      setBulkSelection(prev => prev.filter(id => id !== alertId))
    }
  }

  // Handle alert actions
  const handleMarkAsRead = (alert: StockAlertWithMaterial) => {
    if (!alert.isRead) {
      markAlertAsRead(alert.id)
    }
  }

  const handleResolveAlert = (alert: StockAlertWithMaterial) => {
    updateStockAlert(alert.id, {
      isResolved: true,
      resolvedAt: new Date(),
      resolvedBy: 'current-user', // In real app, get from auth context
    })
  }

  // Get alert icon
  const getAlertIcon = (type: StockAlertType) => {
    const config = ALERT_TYPE_CONFIG[type]
    const Icon = config.icon
    return <Icon className="h-4 w-4" />
  }

  // Get time display
  const getTimeDisplay = (date: string) => {
    const alertDate = new Date(date)
    const now = new Date()
    const diffInHours = (now.getTime() - alertDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return formatDistanceToNow(alertDate, { addSuffix: true })
    } else {
      return format(alertDate, 'MMM dd, HH:mm')
    }
  }

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Stock Alerts</CardTitle>
            <Badge variant="outline" className="bg-red-50">
              {unreadAlertsCount} unread
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {filteredAlerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                    !alert.isRead ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => {
                    handleMarkAsRead(alert)
                    onViewMaterial?.(alert.materialId)
                  }}
                >
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{alert.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {alert.material.name}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getTimeDisplay(alert.createdAt.toString())}
                  </div>
                </div>
              ))}
              {filteredAlerts.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No alerts</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and manage inventory alerts and notifications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadAlertsCount > 0 && (
            <Button variant="outline" onClick={markAllAlertsAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Badge variant="outline" className={unreadAlertsCount > 0 ? 'bg-red-50' : ''}>
            {unreadAlertsCount} unread
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(ALERT_TYPE_CONFIG).map(([type, config]) => {
          const count = alertsByType[type as StockAlertType]?.length || 0
          const Icon = config.icon
          return (
            <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedType(selectedType === type ? '' : type as StockAlertType)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                  {config.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadAlertsCount})</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <Select value={selectedType} onValueChange={(value) => setSelectedType(value as StockAlertType)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      {Object.entries(ALERT_TYPE_CONFIG).map(([type, config]) => (
                        <SelectItem key={type} value={type}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSeverity} onValueChange={(value) => setSelectedSeverity(value as AlertSeverity)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Severity</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unread-only"
                      checked={showOnlyUnread}
                      onCheckedChange={setShowOnlyUnread}
                    />
                    <label htmlFor="unread-only" className="text-sm">
                      Unread only
                    </label>
                  </div>
                </div>

                {/* Bulk Actions */}
                {bulkSelection.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {bulkSelection.length} selected
                    </span>
                    <Button size="sm" onClick={handleBulkMarkAsRead}>
                      Mark Read
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No alerts found</p>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedType || selectedSeverity
                      ? 'Try adjusting your filters'
                      : 'Your inventory is looking good!'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Select All */}
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Checkbox
                      checked={bulkSelection.length === filteredAlerts.length && filteredAlerts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">
                      Select all ({filteredAlerts.length})
                    </span>
                  </div>

                  {/* Alert List */}
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                        !alert.isRead ? 'bg-blue-50 border-blue-200' : ''
                      } ${bulkSelection.includes(alert.id) ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <Checkbox
                        checked={bulkSelection.includes(alert.id)}
                        onCheckedChange={(checked) => handleSelectAlert(alert.id, !!checked)}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="mt-1">
                              {getAlertIcon(alert.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className={`text-sm font-medium ${!alert.isRead ? 'font-semibold' : ''}`}>
                                  {alert.title}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={SEVERITY_COLORS[alert.severity]}
                                >
                                  {alert.severity}
                                </Badge>
                                {!alert.isRead && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {alert.message}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Package className="h-3 w-3 mr-1" />
                                  {alert.material.name} (SKU: {alert.material.sku})
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {getTimeDisplay(alert.createdAt.toString())}
                                </span>
                                {alert.currentLevel !== null && alert.thresholdLevel !== null && (
                                  <span>
                                    Current: {alert.currentLevel} / Threshold: {alert.thresholdLevel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => onViewMaterial?.(alert.materialId)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Material
                              </DropdownMenuItem>
                              {!alert.isRead && (
                                <DropdownMenuItem onClick={() => handleMarkAsRead(alert)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Mark as Read
                                </DropdownMenuItem>
                              )}
                              {!alert.isResolved && (
                                <DropdownMenuItem onClick={() => handleResolveAlert(alert)}>
                                  <CheckCheck className="mr-2 h-4 w-4" />
                                  Mark as Resolved
                                </DropdownMenuItem>
                              )}
                              {(alert.type === 'LOW_STOCK' || alert.type === 'OUT_OF_STOCK') && (
                                <DropdownMenuItem onClick={() => onCreatePurchaseOrder?.(alert.materialId)}>
                                  <Package className="mr-2 h-4 w-4" />
                                  Create Purchase Order
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteStockAlert(alert.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Alert
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          {/* Similar structure but filtered for unread alerts */}
        </TabsContent>

        <TabsContent value="critical">
          {/* Similar structure but filtered for critical severity */}
        </TabsContent>

        <TabsContent value="resolved">
          {/* Similar structure but filtered for resolved alerts */}
        </TabsContent>
      </Tabs>
    </div>
  )
}