'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  Bell,
  BellRing,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Settings,
  Smartphone,
  Users,
  Volume2,
  VolumeX,
  Zap,
  X,
  Plus,
  Filter,
  Search,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Send,
  Pause,
  Play,
  RotateCcw,
  Archive,
  Star,
  Thermometer,
  Gauge,
  Timer,
  Package,
  TrendingDown,
  TrendingUp,
  Wifi,
  WifiOff,
  Shield,
  ShieldAlert
} from 'lucide-react'

interface ProductionAlert {
  id: string
  title: string
  message: string
  type: 'critical' | 'warning' | 'info' | 'success'
  category: 'equipment' | 'quality' | 'schedule' | 'safety' | 'inventory' | 'system'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  batchId?: string
  equipmentId?: string
  operatorId?: string
  timestamp: Date
  acknowledgedBy?: string
  acknowledgedAt?: Date
  resolvedBy?: string
  resolvedAt?: Date
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed'
  priority: number
  escalationLevel: number
  autoResolve: boolean
  tags: string[]
  relatedAlerts: string[]
  actions: AlertAction[]
}

interface AlertAction {
  id: string
  label: string
  type: 'acknowledge' | 'resolve' | 'escalate' | 'custom'
  autoAction: boolean
  requiresConfirmation: boolean
  action: () => void
}

interface NotificationRule {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: NotificationCondition[]
  channels: NotificationChannel[]
  recipients: string[]
  frequency: 'immediate' | 'batch_5min' | 'batch_15min' | 'batch_1hour' | 'daily_digest'
  escalationEnabled: boolean
  escalationDelay: number
  escalationRecipients: string[]
  quietHours: { start: string; end: string; enabled: boolean }
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdBy: string
  createdAt: Date
  lastModified: Date
}

interface NotificationCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in_range'
  value: string | number
  logicalOperator?: 'AND' | 'OR'
}

interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'webhook' | 'slack' | 'teams'
  enabled: boolean
  config: Record<string, any>
}

interface AlertMetrics {
  totalAlerts: number
  activeAlerts: number
  criticalAlerts: number
  resolvedToday: number
  avgResolutionTime: number
  topCategories: { category: string; count: number }[]
  alertTrends: { date: string; count: number }[]
  responseEfficiency: number
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  lastUpdate: Date
  sensors: {
    id: string
    name: string
    status: 'online' | 'offline' | 'warning'
    lastReading: Date
    value?: number
    unit?: string
  }[]
  equipment: {
    id: string
    name: string
    status: 'operational' | 'maintenance' | 'offline' | 'error'
    lastUpdate: Date
    alerts: number
  }[]
}

export default function ProductionAlerts() {
  const [alerts, setAlerts] = useState<ProductionAlert[]>([])
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([])
  const [alertMetrics, setAlertMetrics] = useState<AlertMetrics | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [activeTab, setActiveTab] = useState('alerts')
  const [selectedAlert, setSelectedAlert] = useState<ProductionAlert | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    generateMockData()
    if (autoRefresh) {
      const interval = setInterval(() => {
        generateMockData()
      }, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const generateMockData = () => {
    const mockAlerts: ProductionAlert[] = [
      {
        id: 'ALT001',
        title: 'Critical Temperature Alert',
        message: 'Distillation Unit 1 temperature exceeded maximum threshold (95°C)',
        type: 'critical',
        category: 'equipment',
        severity: 'critical',
        source: 'Temperature Sensor TS-001',
        batchId: 'B001',
        equipmentId: 'DIST001',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'active',
        priority: 1,
        escalationLevel: 0,
        autoResolve: false,
        tags: ['temperature', 'safety', 'distillation'],
        relatedAlerts: [],
        actions: [
          { id: 'A1', label: 'Acknowledge', type: 'acknowledge', autoAction: false, requiresConfirmation: false, action: () => {} },
          { id: 'A2', label: 'Emergency Shutdown', type: 'custom', autoAction: false, requiresConfirmation: true, action: () => {} }
        ]
      },
      {
        id: 'ALT002',
        title: 'Quality Control Warning',
        message: 'Batch ROB-2024-001 pH levels outside acceptable range (7.2, target: 6.8-7.0)',
        type: 'warning',
        category: 'quality',
        severity: 'high',
        source: 'QC Station 2',
        batchId: 'B001',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'acknowledged',
        acknowledgedBy: 'Ahmed Hassan',
        acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000),
        priority: 2,
        escalationLevel: 0,
        autoResolve: false,
        tags: ['quality', 'ph', 'batch'],
        relatedAlerts: [],
        actions: [
          { id: 'A3', label: 'Adjust pH', type: 'custom', autoAction: false, requiresConfirmation: false, action: () => {} },
          { id: 'A4', label: 'Resolve', type: 'resolve', autoAction: false, requiresConfirmation: false, action: () => {} }
        ]
      },
      {
        id: 'ALT003',
        title: 'Production Schedule Delay',
        message: 'Batch AMB-2024-002 is running 2 hours behind schedule',
        type: 'warning',
        category: 'schedule',
        severity: 'medium',
        source: 'Production Scheduler',
        batchId: 'B002',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'active',
        priority: 3,
        escalationLevel: 0,
        autoResolve: false,
        tags: ['schedule', 'delay', 'production'],
        relatedAlerts: [],
        actions: [
          { id: 'A5', label: 'Reschedule', type: 'custom', autoAction: false, requiresConfirmation: false, action: () => {} },
          { id: 'A6', label: 'Acknowledge', type: 'acknowledge', autoAction: false, requiresConfirmation: false, action: () => {} }
        ]
      },
      {
        id: 'ALT004',
        title: 'Low Inventory Warning',
        message: 'Rose essence stock below minimum threshold (5L remaining, minimum: 10L)',
        type: 'warning',
        category: 'inventory',
        severity: 'medium',
        source: 'Inventory Management System',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'resolved',
        resolvedBy: 'Fatima Al-Zahra',
        resolvedAt: new Date(Date.now() - 30 * 60 * 1000),
        priority: 3,
        escalationLevel: 0,
        autoResolve: false,
        tags: ['inventory', 'stock', 'materials'],
        relatedAlerts: [],
        actions: []
      },
      {
        id: 'ALT005',
        title: 'Equipment Maintenance Due',
        message: 'Blending Unit 2 scheduled maintenance is overdue by 3 days',
        type: 'info',
        category: 'equipment',
        severity: 'low',
        source: 'Maintenance Scheduler',
        equipmentId: 'BLEND002',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'active',
        priority: 4,
        escalationLevel: 0,
        autoResolve: false,
        tags: ['maintenance', 'schedule', 'equipment'],
        relatedAlerts: [],
        actions: [
          { id: 'A7', label: 'Schedule Maintenance', type: 'custom', autoAction: false, requiresConfirmation: false, action: () => {} },
          { id: 'A8', label: 'Dismiss', type: 'custom', autoAction: false, requiresConfirmation: false, action: () => {} }
        ]
      }
    ]

    const mockRules: NotificationRule[] = [
      {
        id: 'NR001',
        name: 'Critical Equipment Alerts',
        description: 'Immediate notification for critical equipment failures',
        enabled: true,
        conditions: [
          { field: 'severity', operator: 'equals', value: 'critical' },
          { field: 'category', operator: 'equals', value: 'equipment', logicalOperator: 'AND' }
        ],
        channels: [
          { type: 'email', enabled: true, config: {} },
          { type: 'sms', enabled: true, config: {} },
          { type: 'push', enabled: true, config: {} }
        ],
        recipients: ['supervisor@oudpms.com', 'maintenance@oudpms.com'],
        frequency: 'immediate',
        escalationEnabled: true,
        escalationDelay: 15,
        escalationRecipients: ['manager@oudpms.com'],
        quietHours: { start: '22:00', end: '06:00', enabled: false },
        priority: 'critical',
        createdBy: 'System Administrator',
        createdAt: new Date(2024, 0, 1),
        lastModified: new Date()
      },
      {
        id: 'NR002',
        name: 'Quality Control Notifications',
        description: 'Notifications for quality control issues',
        enabled: true,
        conditions: [
          { field: 'category', operator: 'equals', value: 'quality' }
        ],
        channels: [
          { type: 'email', enabled: true, config: {} },
          { type: 'slack', enabled: true, config: { channel: '#quality-control' } }
        ],
        recipients: ['qc@oudpms.com'],
        frequency: 'immediate',
        escalationEnabled: false,
        escalationDelay: 0,
        escalationRecipients: [],
        quietHours: { start: '20:00', end: '08:00', enabled: true },
        priority: 'high',
        createdBy: 'QC Manager',
        createdAt: new Date(2024, 0, 15),
        lastModified: new Date()
      }
    ]

    const mockMetrics: AlertMetrics = {
      totalAlerts: 127,
      activeAlerts: 3,
      criticalAlerts: 1,
      resolvedToday: 8,
      avgResolutionTime: 45,
      topCategories: [
        { category: 'equipment', count: 45 },
        { category: 'quality', count: 32 },
        { category: 'schedule', count: 28 },
        { category: 'inventory', count: 22 }
      ],
      alertTrends: [
        { date: '2024-03-15', count: 12 },
        { date: '2024-03-16', count: 8 },
        { date: '2024-03-17', count: 15 },
        { date: '2024-03-18', count: 10 },
        { date: '2024-03-19', count: 9 },
        { date: '2024-03-20', count: 13 },
        { date: '2024-03-21', count: 7 }
      ],
      responseEfficiency: 87
    }

    const mockSystemHealth: SystemHealth = {
      status: 'warning',
      uptime: 99.2,
      lastUpdate: new Date(),
      sensors: [
        { id: 'TS001', name: 'Temperature Sensor 1', status: 'online', lastReading: new Date(), value: 85, unit: '°C' },
        { id: 'PS001', name: 'Pressure Sensor 1', status: 'online', lastReading: new Date(), value: 2.3, unit: 'bar' },
        { id: 'HS001', name: 'Humidity Sensor 1', status: 'warning', lastReading: new Date(Date.now() - 5 * 60 * 1000), value: 65, unit: '%' },
        { id: 'FS001', name: 'Flow Sensor 1', status: 'offline', lastReading: new Date(Date.now() - 2 * 60 * 60 * 1000) }
      ],
      equipment: [
        { id: 'DIST001', name: 'Distillation Unit 1', status: 'error', lastUpdate: new Date(), alerts: 1 },
        { id: 'BLEND001', name: 'Blending Unit 1', status: 'operational', lastUpdate: new Date(), alerts: 0 },
        { id: 'PACK001', name: 'Packaging Line 1', status: 'operational', lastUpdate: new Date(), alerts: 0 },
        { id: 'BLEND002', name: 'Blending Unit 2', status: 'maintenance', lastUpdate: new Date(), alerts: 1 }
      ]
    }

    setAlerts(mockAlerts)
    setNotificationRules(mockRules)
    setAlertMetrics(mockMetrics)
    setSystemHealth(mockSystemHealth)
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filterCategory !== 'all' && alert.category !== filterCategory) return false
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false
    if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.message.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, status: 'acknowledged', acknowledgedBy: 'Current User', acknowledgedAt: new Date() }
        : alert
    ))
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, status: 'resolved', resolvedBy: 'Current User', resolvedAt: new Date() }
        : alert
    ))
  }

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, status: 'dismissed' }
        : alert
    ))
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info': return <Bell className="h-5 w-5 text-blue-500" />
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getAlertTypeColor = (type: string, severity: string) => {
    if (severity === 'critical') return 'bg-red-100 text-red-800 border-red-200'
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'success': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800'
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'dismissed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'equipment': return <Settings className="h-4 w-4" />
      case 'quality': return <Shield className="h-4 w-4" />
      case 'schedule': return <Clock className="h-4 w-4" />
      case 'safety': return <ShieldAlert className="h-4 w-4" />
      case 'inventory': return <Package className="h-4 w-4" />
      case 'system': return <Zap className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Production Alerts & Notifications</h2>
          <p className="text-muted-foreground">Monitor and manage production alerts and notification rules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
            Sound {soundEnabled ? 'On' : 'Off'}
          </Button>
          <Button variant="outline" onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            Auto Refresh
          </Button>
          <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Notification Rule</DialogTitle>
                <DialogDescription>Set up automated notification rules for production alerts</DialogDescription>
              </DialogHeader>
              <NotificationRuleForm onClose={() => setIsRuleDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* System Health Status */}
      {systemHealth && (
        <Card className={`border-2 ${
          systemHealth.status === 'critical' ? 'border-red-200 bg-red-50' :
          systemHealth.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
          'border-green-200 bg-green-50'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  systemHealth.status === 'critical' ? 'bg-red-500' :
                  systemHealth.status === 'warning' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <div>
                  <h3 className="text-lg font-semibold">System Health: {systemHealth.status.toUpperCase()}</h3>
                  <p className="text-sm text-muted-foreground">
                    Uptime: {systemHealth.uptime}% | Last updated: {formatTimeAgo(systemHealth.lastUpdate)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium">{systemHealth.sensors.filter(s => s.status === 'online').length}/{systemHealth.sensors.length}</p>
                  <p className="text-muted-foreground">Sensors Online</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">{systemHealth.equipment.filter(e => e.status === 'operational').length}/{systemHealth.equipment.length}</p>
                  <p className="text-muted-foreground">Equipment OK</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Metrics */}
      {alertMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Alerts</p>
                  <p className="text-2xl font-bold">{alertMetrics.totalAlerts}</p>
                </div>
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{alertMetrics.activeAlerts}</p>
                </div>
                <BellRing className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{alertMetrics.criticalAlerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">{alertMetrics.resolvedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Resolution</p>
                  <p className="text-2xl font-bold">{alertMetrics.avgResolutionTime}m</p>
                </div>
                <Timer className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="rules">Notification Rules</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="schedule">Schedule</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Alerts Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterCategory !== 'all' || filterSeverity !== 'all' || filterStatus !== 'all'
                      ? 'No alerts match your current filters.'
                      : 'All systems are operating normally.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts
                .sort((a, b) => {
                  if (a.status === 'active' && b.status !== 'active') return -1
                  if (a.status !== 'active' && b.status === 'active') return 1
                  return a.priority - b.priority
                })
                .map((alert) => (
                  <Card key={alert.id} className={`transition-all hover:shadow-md ${
                    alert.status === 'active' ? 'border-l-4 border-l-red-500' :
                    alert.status === 'acknowledged' ? 'border-l-4 border-l-yellow-500' :
                    alert.status === 'resolved' ? 'border-l-4 border-l-green-500' :
                    'border-l-4 border-l-gray-300'
                  }`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getAlertTypeIcon(alert.type)}
                            <h3 className="text-lg font-semibold">{alert.title}</h3>
                            <Badge className={getAlertTypeColor(alert.type, alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getCategoryIcon(alert.category)}
                              {alert.category}
                            </Badge>
                            <Badge className={getStatusColor(alert.status)}>
                              {alert.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{alert.message}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(alert.timestamp)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {alert.source}
                            </div>
                            {alert.batchId && (
                              <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                Batch {alert.batchId}
                              </div>
                            )}
                          </div>
                          {alert.tags.length > 0 && (
                            <div className="flex gap-1 mt-3">
                              {alert.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedAlert(alert)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          {alert.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Acknowledge
                            </Button>
                          )}
                          {(alert.status === 'active' || alert.status === 'acknowledged') && (
                            <Button
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Resolve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDismissAlert(alert.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notificationRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <Switch checked={rule.enabled} />
                  </div>
                  <CardDescription>{rule.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Frequency</Label>
                      <p className="text-sm text-muted-foreground">{rule.frequency.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Channels</Label>
                      <div className="flex gap-1 mt-1">
                        {rule.channels.filter(c => c.enabled).map((channel) => (
                          <Badge key={channel.type} variant="outline" className="text-xs">
                            {channel.type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Recipients</Label>
                      <p className="text-sm text-muted-foreground">
                        {rule.recipients.length} recipient(s)
                      </p>
                    </div>
                    {rule.escalationEnabled && (
                      <div>
                        <Label className="text-sm font-medium">Escalation</Label>
                        <p className="text-sm text-muted-foreground">
                          After {rule.escalationDelay} minutes
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>View and analyze historical alert data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Resolved</TableHead>
                    <TableHead>Resolution Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.filter(alert => alert.status === 'resolved').map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          {getCategoryIcon(alert.category)}
                          {alert.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAlertTypeColor(alert.type, alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{alert.timestamp.toLocaleString()}</TableCell>
                      <TableCell>{alert.resolvedAt?.toLocaleString()}</TableCell>
                      <TableCell>
                        {alert.resolvedAt && alert.timestamp
                          ? `${Math.round((alert.resolvedAt.getTime() - alert.timestamp.getTime()) / (1000 * 60))}m`
                          : '--'}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {systemHealth && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5" />
                      Sensors Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {systemHealth.sensors.map((sensor) => (
                        <div key={sensor.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              sensor.status === 'online' ? 'bg-green-500' :
                              sensor.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium">{sensor.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Last reading: {formatTimeAgo(sensor.lastReading)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {sensor.value && (
                              <p className="font-medium">{sensor.value}{sensor.unit}</p>
                            )}
                            <Badge className={
                              sensor.status === 'online' ? 'bg-green-100 text-green-800' :
                              sensor.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {sensor.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Equipment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {systemHealth.equipment.map((equipment) => (
                        <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              equipment.status === 'operational' ? 'bg-green-500' :
                              equipment.status === 'maintenance' ? 'bg-yellow-500' :
                              equipment.status === 'offline' ? 'bg-gray-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium">{equipment.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Updated: {formatTimeAgo(equipment.lastUpdate)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {equipment.alerts > 0 && (
                              <p className="text-sm text-red-600 font-medium">
                                {equipment.alerts} alert(s)
                              </p>
                            )}
                            <Badge className={
                              equipment.status === 'operational' ? 'bg-green-100 text-green-800' :
                              equipment.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                              equipment.status === 'offline' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {equipment.status}
                            </Badge>
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

        <TabsContent value="analytics" className="space-y-6">
          {alertMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alertMetrics.topCategories.map((category) => {
                      const percentage = (category.count / alertMetrics.totalAlerts) * 100
                      return (
                        <div key={category.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{category.category}</span>
                            <span>{category.count} alerts</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">
                        {alertMetrics.responseEfficiency}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Overall response efficiency
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{alertMetrics.avgResolutionTime}m</div>
                        <p className="text-xs text-muted-foreground">Avg Resolution Time</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{alertMetrics.resolvedToday}</div>
                        <p className="text-xs text-muted-foreground">Resolved Today</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Alert Detail Dialog */}
      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getAlertTypeIcon(selectedAlert.type)}
                {selectedAlert.title}
              </DialogTitle>
              <DialogDescription>Alert ID: {selectedAlert.id}</DialogDescription>
            </DialogHeader>
            <AlertDetailView alert={selectedAlert} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Component stub functions
const NotificationRuleForm = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Notification Rule form would be implemented here</p>
    <Button onClick={onClose}>Close</Button>
  </div>
)

const AlertDetailView = ({ alert }: { alert: ProductionAlert }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Category</Label>
        <p className="text-sm">{alert.category}</p>
      </div>
      <div>
        <Label>Severity</Label>
        <p className="text-sm">{alert.severity}</p>
      </div>
      <div>
        <Label>Source</Label>
        <p className="text-sm">{alert.source}</p>
      </div>
      <div>
        <Label>Timestamp</Label>
        <p className="text-sm">{alert.timestamp.toLocaleString()}</p>
      </div>
    </div>
    <div>
      <Label>Message</Label>
      <p className="text-sm text-muted-foreground">{alert.message}</p>
    </div>
    {alert.acknowledgedBy && (
      <div>
        <Label>Acknowledged by</Label>
        <p className="text-sm">{alert.acknowledgedBy} at {alert.acknowledgedAt?.toLocaleString()}</p>
      </div>
    )}
    {alert.resolvedBy && (
      <div>
        <Label>Resolved by</Label>
        <p className="text-sm">{alert.resolvedBy} at {alert.resolvedAt?.toLocaleString()}</p>
      </div>
    )}
  </div>
)