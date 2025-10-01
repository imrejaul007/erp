'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
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
  AlertTriangle,
  Bell,
  Clock,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  Settings,
  TrendingDown,
  TrendingUp,
  Package,
  Flame,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Moon,
  Shield,
  FileText,
  Download,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
  Building2,
  Users,
} from 'lucide-react'
import { format, differenceInDays, addDays, subDays, isAfter, isBefore } from 'date-fns'
import { ar } from 'date-fns/locale'

interface ExpiryAlert {
  id: string
  batchId: string
  batchNumber: string
  materialId: string
  material: {
    name: string
    nameArabic: string
    category: string
    type: 'oud' | 'attar' | 'perfume_oil' | 'alcohol' | 'bottle' | 'packaging'
    grade: string
    shelfLifeMonths: number
    storageRequirements: string[]
    temperatureSensitive: boolean
    lightSensitive: boolean
    moistureSensitive: boolean
  }
  expiryDate: Date
  daysUntilExpiry: number
  severity: 'info' | 'warning' | 'critical' | 'expired'
  alertType: 'approaching' | 'urgent' | 'expired' | 'quality_risk'
  currentStock: number
  unit: string
  estimatedValue: number
  location: string
  storeId: string
  storeName: string
  supplierInfo: {
    name: string
    contact: string
    canReturn: boolean
    returnPolicy: string
  }
  recommendedActions: string[]
  qualityImpact: {
    level: 'none' | 'low' | 'medium' | 'high' | 'severe'
    description: string
    testingRequired: boolean
  }
  notificationsSent: {
    email: boolean
    sms: boolean
    whatsapp: boolean
    inApp: boolean
    lastSent: Date
  }
  assignedTo?: string
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'critical'
  status: 'active' | 'acknowledged' | 'action_taken' | 'resolved' | 'escalated'
  createdAt: Date
  updatedAt: Date
  notes?: string
  actionHistory: {
    date: Date
    action: string
    user: string
    notes?: string
  }[]
}

interface AlertSettings {
  enabled: boolean
  thresholds: {
    info: number // days
    warning: number
    critical: number
  }
  notifications: {
    email: boolean
    sms: boolean
    whatsapp: boolean
    inApp: boolean
    dailyDigest: boolean
    weeklyReport: boolean
  }
  escalation: {
    enabled: boolean
    escalateAfterHours: number
    escalateTo: string[]
  }
  materialSpecificRules: {
    [materialType: string]: {
      customThresholds?: boolean
      infoThreshold?: number
      warningThreshold?: number
      criticalThreshold?: number
      autoActions?: string[]
    }
  }
}

interface AdvancedExpiryAlertsProps {
  onConfigureSettings?: () => void
  onTakeAction?: (alertId: string, action: string) => void
  onExportReport?: () => void
}

export function AdvancedExpiryAlerts({
  onConfigureSettings,
  onTakeAction,
  onExportReport,
}: AdvancedExpiryAlertsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAlert, setSelectedAlert] = useState<ExpiryAlert | null>(null)
  const [filters, setFilters] = useState({
    severity: '',
    location: '',
    materialType: '',
    status: '',
    priority: '',
    assignedTo: '',
  })
  const [settings, setSettings] = useState<AlertSettings>({
    enabled: true,
    thresholds: {
      info: 90,
      warning: 30,
      critical: 7,
    },
    notifications: {
      email: true,
      sms: false,
      whatsapp: true,
      inApp: true,
      dailyDigest: true,
      weeklyReport: true,
    },
    escalation: {
      enabled: true,
      escalateAfterHours: 24,
      escalateTo: ['manager@company.com', 'owner@company.com'],
    },
    materialSpecificRules: {
      oud: {
        customThresholds: true,
        infoThreshold: 365, // Oud can age well
        warningThreshold: 30,
        criticalThreshold: 7,
      },
      attar: {
        customThresholds: true,
        infoThreshold: 180,
        warningThreshold: 30,
        criticalThreshold: 14,
      },
      perfume_oil: {
        customThresholds: true,
        infoThreshold: 90,
        warningThreshold: 21,
        criticalThreshold: 7,
      },
      alcohol: {
        customThresholds: true,
        infoThreshold: 60,
        warningThreshold: 14,
        criticalThreshold: 3,
        autoActions: ['quality_test_required', 'separate_stock'],
      },
    },
  })

  // Mock data - enhanced for UAE perfume & oud business
  const alerts: ExpiryAlert[] = [
    {
      id: '1',
      batchId: 'batch_001',
      batchNumber: 'OUD-2024-001',
      materialId: 'mat_001',
      material: {
        name: 'Royal Cambodian Oud',
        nameArabic: 'عود كمبودي ملكي',
        category: 'Oud Oil',
        type: 'oud',
        grade: 'Royal',
        shelfLifeMonths: 60,
        storageRequirements: ['Cool temperature', 'No direct light', 'Sealed container'],
        temperatureSensitive: true,
        lightSensitive: true,
        moistureSensitive: false,
      },
      expiryDate: new Date('2025-01-15'),
      daysUntilExpiry: 107,
      severity: 'info',
      alertType: 'approaching',
      currentStock: 850,
      unit: 'tola',
      estimatedValue: 1020000,
      location: 'Dubai Warehouse A1-B2',
      storeId: 'store_001',
      storeName: 'Dubai Main Warehouse',
      supplierInfo: {
        name: 'Cambodian Oud House',
        contact: '+855 12 345 678',
        canReturn: false,
        returnPolicy: 'No returns on aged oud - natural product',
      },
      recommendedActions: [
        'Schedule quality assessment',
        'Consider promotional pricing',
        'Check storage conditions',
        'Update aging records',
      ],
      qualityImpact: {
        level: 'none',
        description: 'Oud typically improves with age when stored properly',
        testingRequired: false,
      },
      notificationsSent: {
        email: true,
        sms: false,
        whatsapp: false,
        inApp: true,
        lastSent: new Date('2024-09-25'),
      },
      priority: 'low',
      status: 'active',
      createdAt: new Date('2024-09-20'),
      updatedAt: new Date('2024-09-25'),
      actionHistory: [
        {
          date: new Date('2024-09-25'),
          action: 'Alert created',
          user: 'System',
          notes: 'Automatic alert generation based on expiry date',
        },
      ],
    },
    {
      id: '2',
      batchId: 'batch_002',
      batchNumber: 'ATR-2024-015',
      materialId: 'mat_002',
      material: {
        name: 'Rose Attar Premium',
        nameArabic: 'عطر الورد الممتاز',
        category: 'Attar',
        type: 'attar',
        grade: 'Premium',
        shelfLifeMonths: 36,
        storageRequirements: ['Room temperature', 'Dark storage', 'Sealed container'],
        temperatureSensitive: false,
        lightSensitive: true,
        moistureSensitive: true,
      },
      expiryDate: new Date('2024-10-15'),
      daysUntilExpiry: 15,
      severity: 'critical',
      alertType: 'urgent',
      currentStock: 320,
      unit: 'tola',
      estimatedValue: 256000,
      location: 'Abu Dhabi Warehouse C3-D4',
      storeId: 'store_002',
      storeName: 'Abu Dhabi Branch',
      supplierInfo: {
        name: 'Bulgarian Rose Valley',
        contact: '+359 88 123 4567',
        canReturn: true,
        returnPolicy: 'Can return within 30 days if unopened',
      },
      recommendedActions: [
        'Urgent: Quality test required',
        'Consider immediate sale/promotion',
        'Contact supplier for return possibility',
        'Separate potentially affected stock',
        'Document quality degradation if any',
      ],
      qualityImpact: {
        level: 'medium',
        description: 'Attar may lose fragrance intensity and develop off-notes',
        testingRequired: true,
      },
      notificationsSent: {
        email: true,
        sms: true,
        whatsapp: true,
        inApp: true,
        lastSent: new Date('2024-09-28'),
      },
      assignedTo: 'quality_manager',
      priority: 'urgent',
      status: 'acknowledged',
      createdAt: new Date('2024-09-15'),
      updatedAt: new Date('2024-09-28'),
      notes: 'Quality manager notified. Testing scheduled for tomorrow.',
      actionHistory: [
        {
          date: new Date('2024-09-15'),
          action: 'Alert created',
          user: 'System',
        },
        {
          date: new Date('2024-09-28'),
          action: 'Alert acknowledged',
          user: 'Ahmad Al-Mansoori',
          notes: 'Quality testing scheduled for tomorrow morning',
        },
      ],
    },
    {
      id: '3',
      batchId: 'batch_003',
      batchNumber: 'PERF-2024-032',
      materialId: 'mat_003',
      material: {
        name: 'Jasmine Perfume Oil',
        nameArabic: 'زيت عطر الياسمين',
        category: 'Perfume Oil',
        type: 'perfume_oil',
        grade: 'Premium',
        shelfLifeMonths: 24,
        storageRequirements: ['Cool storage', 'No direct sunlight', 'Nitrogen blanket'],
        temperatureSensitive: true,
        lightSensitive: true,
        moistureSensitive: false,
      },
      expiryDate: new Date('2024-09-20'),
      daysUntilExpiry: -10,
      severity: 'expired',
      alertType: 'expired',
      currentStock: 150,
      unit: 'ml',
      estimatedValue: 45000,
      location: 'Sharjah Warehouse B2-A5',
      storeId: 'store_003',
      storeName: 'Sharjah Distribution Center',
      supplierInfo: {
        name: 'Damascus Perfume House',
        contact: '+963 11 234 5678',
        canReturn: false,
        returnPolicy: 'No returns on expired products',
      },
      recommendedActions: [
        'IMMEDIATE: Quarantine stock',
        'Conduct comprehensive quality test',
        'Dispose if quality compromised',
        'Review storage conditions',
        'Document loss for insurance',
        'Investigate cause of oversight',
      ],
      qualityImpact: {
        level: 'high',
        description: 'Expired perfume oil may have degraded fragrance and potential safety issues',
        testingRequired: true,
      },
      notificationsSent: {
        email: true,
        sms: true,
        whatsapp: true,
        inApp: true,
        lastSent: new Date('2024-09-30'),
      },
      assignedTo: 'warehouse_manager',
      priority: 'critical',
      status: 'escalated',
      createdAt: new Date('2024-09-21'),
      updatedAt: new Date('2024-09-30'),
      notes: 'ESCALATED: Product expired 10 days ago. Immediate action required.',
      actionHistory: [
        {
          date: new Date('2024-09-21'),
          action: 'Alert created',
          user: 'System',
        },
        {
          date: new Date('2024-09-25'),
          action: 'Alert escalated',
          user: 'System',
          notes: 'No action taken within 72 hours - escalated to management',
        },
        {
          date: new Date('2024-09-30'),
          action: 'Management notified',
          user: 'Fatima Al-Zahra',
          notes: 'Stock quarantined. Quality testing in progress.',
        },
      ],
    },
  ]

  // Filter and sort alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = !searchTerm ||
        alert.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.material.nameArabic.includes(searchTerm) ||
        alert.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSeverity = !filters.severity || alert.severity === filters.severity
      const matchesLocation = !filters.location || alert.location.includes(filters.location)
      const matchesMaterialType = !filters.materialType || alert.material.type === filters.materialType
      const matchesStatus = !filters.status || alert.status === filters.status
      const matchesPriority = !filters.priority || alert.priority === filters.priority

      return matchesSearch && matchesSeverity && matchesLocation &&
             matchesMaterialType && matchesStatus && matchesPriority
    }).sort((a, b) => {
      // Sort by priority and severity
      const priorityOrder = { critical: 0, urgent: 1, high: 2, normal: 3, low: 4 }
      const severityOrder = { expired: 0, critical: 1, warning: 2, info: 3 }

      const aPriority = priorityOrder[a.priority] || 99
      const bPriority = priorityOrder[b.priority] || 99

      if (aPriority !== bPriority) return aPriority - bPriority

      const aSeverity = severityOrder[a.severity] || 99
      const bSeverity = severityOrder[b.severity] || 99

      if (aSeverity !== bSeverity) return aSeverity - bSeverity

      return a.daysUntilExpiry - b.daysUntilExpiry
    })
  }, [alerts, searchTerm, filters])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = alerts.length
    const expired = alerts.filter(a => a.severity === 'expired').length
    const critical = alerts.filter(a => a.severity === 'critical').length
    const warning = alerts.filter(a => a.severity === 'warning').length
    const totalValue = alerts.reduce((sum, a) => sum + a.estimatedValue, 0)
    const criticalValue = alerts.filter(a => a.severity === 'critical' || a.severity === 'expired')
      .reduce((sum, a) => sum + a.estimatedValue, 0)

    return { total, expired, critical, warning, totalValue, criticalValue }
  }, [alerts])

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
      case 'critical': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'urgent': return 'bg-orange-500'
      case 'high': return 'bg-yellow-500'
      case 'normal': return 'bg-blue-500'
      case 'low': return 'bg-gray-500'
      default: return 'bg-gray-300'
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'action_taken': return 'bg-blue-100 text-blue-800'
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800'
      case 'escalated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Handle action
  const handleTakeAction = (alert: ExpiryAlert, action: string) => {
    onTakeAction?.(alert.id, action)

    // Update local state (in real app, this would be handled by state management)
    console.log(`Taking action "${action}" for alert ${alert.id}`)
  }

  const exportReport = () => {
    const reportData = filteredAlerts.map(alert => [
      alert.batchNumber,
      alert.material.name,
      alert.material.nameArabic,
      alert.severity,
      alert.daysUntilExpiry.toString(),
      format(alert.expiryDate, 'yyyy-MM-dd'),
      alert.currentStock.toString(),
      alert.unit,
      alert.estimatedValue.toString(),
      alert.location,
      alert.status,
      alert.assignedTo || '',
      alert.notes || '',
    ])

    const headers = [
      'Batch Number', 'Material (EN)', 'Material (AR)', 'Severity', 'Days to Expiry',
      'Expiry Date', 'Stock', 'Unit', 'Value (AED)', 'Location', 'Status', 'Assigned To', 'Notes'
    ]

    const csvContent = [headers, ...reportData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `expiry-alerts-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Advanced Expiry Alerts</h2>
          <p className="text-muted-foreground">
            AI-powered expiry management for Oud, Attar & Perfume inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" onClick={onConfigureSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.critical}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk Value</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">
              AED {(stats.criticalValue / 1000).toLocaleString()}K
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
                  placeholder="Search alerts... (English/Arabic)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pt-4 border-t">
            <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Severities</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.materialType} onValueChange={(value) => setFilters(prev => ({ ...prev, materialType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Material Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="oud">Oud</SelectItem>
                <SelectItem value="attar">Attar</SelectItem>
                <SelectItem value="perfume_oil">Perfume Oil</SelectItem>
                <SelectItem value="alcohol">Alcohol</SelectItem>
                <SelectItem value="bottle">Bottles</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="action_taken">Action Taken</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                <SelectItem value="Dubai">Dubai</SelectItem>
                <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                <SelectItem value="Sharjah">Sharjah</SelectItem>
                <SelectItem value="Ajman">Ajman</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setFilters({
                severity: '',
                location: '',
                materialType: '',
                status: '',
                priority: '',
                assignedTo: '',
              })}
            >
              Clear Filters
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="alerts" className="w-full">
            <TabsList>
              <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableHead>Batch & Material</TableHead>
                      <TableHead>Expiry Status</TableHead>
                      <TableHead>Stock & Value</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Quality Impact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => (
                      <TableRow key={alert.id} className={alert.severity === 'expired' ? 'bg-red-50' : ''}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getPriorityColor(alert.priority)}`}
                              title={`Priority: ${alert.priority}`}
                            />
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <div className="font-medium">{alert.batchNumber}</div>
                            <div className="text-sm">{alert.material.name}</div>
                            <div className="text-xs text-muted-foreground" dir="rtl">
                              {alert.material.nameArabic}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {alert.material.grade}
                              </Badge>
                              {alert.material.temperatureSensitive && (
                                <Thermometer className="h-3 w-3 text-blue-500" title="Temperature Sensitive" />
                              )}
                              {alert.material.lightSensitive && (
                                <Sun className="h-3 w-3 text-yellow-500" title="Light Sensitive" />
                              )}
                              {alert.material.moistureSensitive && (
                                <Droplets className="h-3 w-3 text-cyan-500" title="Moisture Sensitive" />
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3" />
                              <span className="text-sm">
                                {format(alert.expiryDate, 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="text-sm font-medium">
                              {alert.daysUntilExpiry >= 0 ? (
                                <span className={alert.daysUntilExpiry <= 7 ? 'text-red-600' :
                                              alert.daysUntilExpiry <= 30 ? 'text-orange-600' : 'text-blue-600'}>
                                  {alert.daysUntilExpiry} days left
                                </span>
                              ) : (
                                <span className="text-red-600 font-bold">
                                  Expired {Math.abs(alert.daysUntilExpiry)} days ago
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {alert.currentStock.toLocaleString()} {alert.unit}
                            </div>
                            <div className="text-sm text-green-600 font-medium">
                              AED {alert.estimatedValue.toLocaleString()}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-3 w-3" />
                            <span className="text-sm">{alert.storeName}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {alert.location}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              variant="outline"
                              className={
                                alert.qualityImpact.level === 'severe' ? 'border-red-500 text-red-700' :
                                alert.qualityImpact.level === 'high' ? 'border-orange-500 text-orange-700' :
                                alert.qualityImpact.level === 'medium' ? 'border-yellow-500 text-yellow-700' :
                                'border-gray-300 text-gray-600'
                              }
                            >
                              {alert.qualityImpact.level}
                            </Badge>
                            {alert.qualityImpact.testingRequired && (
                              <div className="flex items-center space-x-1">
                                <FileText className="h-3 w-3 text-orange-500" />
                                <span className="text-xs text-orange-600">Test Required</span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className={getStatusColor(alert.status)}>
                              {alert.status.replace('_', ' ')}
                            </Badge>
                            {alert.assignedTo && (
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span className="text-xs">{alert.assignedTo}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAlert(alert)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {alert.status === 'active' && (
                              <Select onValueChange={(action) => handleTakeAction(alert, action)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Action" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="acknowledge">Acknowledge</SelectItem>
                                  <SelectItem value="quality_test">Quality Test</SelectItem>
                                  <SelectItem value="promote">Promote Sale</SelectItem>
                                  <SelectItem value="quarantine">Quarantine</SelectItem>
                                  <SelectItem value="dispose">Mark for Disposal</SelectItem>
                                  <SelectItem value="return">Return to Supplier</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredAlerts.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">No active alerts</p>
                  <p className="text-muted-foreground">
                    All your inventory is within safe expiry ranges.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Expiry Timeline</CardTitle>
                    <CardDescription>Materials expiring in the next 90 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[7, 30, 60, 90].map(days => {
                        const count = alerts.filter(a => a.daysUntilExpiry >= 0 && a.daysUntilExpiry <= days).length
                        const value = alerts.filter(a => a.daysUntilExpiry >= 0 && a.daysUntilExpiry <= days)
                          .reduce((sum, a) => sum + a.estimatedValue, 0)

                        return (
                          <div key={days} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Within {days} days</span>
                              <span className="text-sm font-medium">{count} items</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={(count / alerts.length) * 100} className="flex-1 h-2" />
                              <span className="text-xs text-muted-foreground w-20">
                                AED {(value / 1000).toFixed(0)}K
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Material Type Breakdown</CardTitle>
                    <CardDescription>Alerts by material type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['oud', 'attar', 'perfume_oil', 'alcohol'].map(type => {
                        const typeAlerts = alerts.filter(a => a.material.type === type)
                        const count = typeAlerts.length
                        const criticalCount = typeAlerts.filter(a => a.severity === 'critical' || a.severity === 'expired').length

                        return (
                          <div key={type} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                              <span className="text-sm font-medium">
                                {count} total, {criticalCount} critical
                              </span>
                            </div>
                            <div className="flex space-x-1 h-2">
                              <div
                                className="bg-blue-500 rounded-l"
                                style={{ width: `${((count - criticalCount) / alerts.length) * 100}%` }}
                              />
                              <div
                                className="bg-red-500 rounded-r"
                                style={{ width: `${(criticalCount / alerts.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Alert Thresholds</CardTitle>
                    <CardDescription>Configure when alerts are triggered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Info Alert (days before expiry)</Label>
                      <Input
                        type="number"
                        value={settings.thresholds.info}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          thresholds: { ...prev.thresholds, info: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Warning Alert (days before expiry)</Label>
                      <Input
                        type="number"
                        value={settings.thresholds.warning}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          thresholds: { ...prev.thresholds, warning: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Critical Alert (days before expiry)</Label>
                      <Input
                        type="number"
                        value={settings.thresholds.critical}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          thresholds: { ...prev.thresholds, critical: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive critical alerts via SMS</p>
                      </div>
                      <Switch
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sms: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>WhatsApp Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive alerts via WhatsApp</p>
                      </div>
                      <Switch
                        checked={settings.notifications.whatsapp}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, whatsapp: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Digest</Label>
                        <p className="text-xs text-muted-foreground">Daily summary of all alerts</p>
                      </div>
                      <Switch
                        checked={settings.notifications.dailyDigest}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, dailyDigest: checked }
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

      {/* Alert Detail Dialog */}
      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alert Details: {selectedAlert.batchNumber}
              </DialogTitle>
              <DialogDescription>
                Complete information about this expiry alert with recommended actions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Alert Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedAlert.daysUntilExpiry}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedAlert.daysUntilExpiry >= 0 ? 'Days until expiry' : 'Days past expiry'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    AED {selectedAlert.estimatedValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Estimated value at risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedAlert.currentStock}</div>
                  <div className="text-sm text-muted-foreground">{selectedAlert.unit} in stock</div>
                </div>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="quality">Quality Impact</TabsTrigger>
                  <TabsTrigger value="actions">Recommended Actions</TabsTrigger>
                  <TabsTrigger value="history">Action History</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Material Information</h4>
                        <p className="text-lg font-medium">{selectedAlert.material.name}</p>
                        <p className="text-sm text-muted-foreground" dir="rtl">{selectedAlert.material.nameArabic}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{selectedAlert.material.grade}</Badge>
                          <Badge variant="secondary">{selectedAlert.material.type}</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Storage Requirements</h4>
                        <ul className="text-sm space-y-1">
                          {selectedAlert.material.storageRequirements.map((req, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Shield className="h-3 w-3 text-blue-500" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Sensitivity Indicators</h4>
                        <div className="flex space-x-4 mt-2">
                          {selectedAlert.material.temperatureSensitive && (
                            <div className="flex items-center space-x-1">
                              <Thermometer className="h-4 w-4 text-blue-500" />
                              <span className="text-xs">Temperature</span>
                            </div>
                          )}
                          {selectedAlert.material.lightSensitive && (
                            <div className="flex items-center space-x-1">
                              <Sun className="h-4 w-4 text-yellow-500" />
                              <span className="text-xs">Light</span>
                            </div>
                          )}
                          {selectedAlert.material.moistureSensitive && (
                            <div className="flex items-center space-x-1">
                              <Droplets className="h-4 w-4 text-cyan-500" />
                              <span className="text-xs">Moisture</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Supplier Information</h4>
                        <div className="space-y-2">
                          <p className="font-medium">{selectedAlert.supplierInfo.name}</p>
                          <p className="text-sm">{selectedAlert.supplierInfo.contact}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant={selectedAlert.supplierInfo.canReturn ? 'default' : 'destructive'}>
                              {selectedAlert.supplierInfo.canReturn ? 'Returns Accepted' : 'No Returns'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{selectedAlert.supplierInfo.returnPolicy}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Location & Status</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>{selectedAlert.storeName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{selectedAlert.location}</span>
                          </div>
                          <Badge variant="outline" className={getStatusColor(selectedAlert.status)}>
                            {selectedAlert.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Notifications Sent</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">Email: {selectedAlert.notificationsSent.email ? 'Sent' : 'Not sent'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">SMS: {selectedAlert.notificationsSent.sms ? 'Sent' : 'Not sent'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-xs">WhatsApp: {selectedAlert.notificationsSent.whatsapp ? 'Sent' : 'Not sent'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Bell className="h-3 w-3" />
                            <span className="text-xs">In-App: {selectedAlert.notificationsSent.inApp ? 'Sent' : 'Not sent'}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Last sent: {format(selectedAlert.notificationsSent.lastSent, 'PPp')}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="quality" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Quality Impact Assessment</h4>
                        <div className="space-y-2">
                          <Badge
                            variant="outline"
                            className={
                              selectedAlert.qualityImpact.level === 'severe' ? 'border-red-500 text-red-700' :
                              selectedAlert.qualityImpact.level === 'high' ? 'border-orange-500 text-orange-700' :
                              selectedAlert.qualityImpact.level === 'medium' ? 'border-yellow-500 text-yellow-700' :
                              'border-gray-300 text-gray-600'
                            }
                          >
                            Impact Level: {selectedAlert.qualityImpact.level}
                          </Badge>
                          <p className="text-sm">{selectedAlert.qualityImpact.description}</p>
                          {selectedAlert.qualityImpact.testingRequired && (
                            <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
                              <FileText className="h-4 w-4 text-orange-500" />
                              <span className="text-sm font-medium text-orange-800">Quality testing required before use</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Expected Quality Changes</h4>
                        <div className="space-y-2 text-sm">
                          {selectedAlert.material.type === 'oud' && (
                            <div>
                              <strong>Oud Oil:</strong> May develop deeper, more complex notes with age.
                              Quality typically improves if stored properly.
                            </div>
                          )}
                          {selectedAlert.material.type === 'attar' && (
                            <div>
                              <strong>Attar:</strong> May lose some top notes and develop off-odors.
                              Color may darken. Fragrance intensity may decrease.
                            </div>
                          )}
                          {selectedAlert.material.type === 'perfume_oil' && (
                            <div>
                              <strong>Perfume Oil:</strong> May develop rancidity, lose fragrance balance,
                              or develop unpleasant odors. Color and clarity may be affected.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Testing Protocol</h4>
                        {selectedAlert.qualityImpact.testingRequired ? (
                          <div className="space-y-2">
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Required Tests:</h5>
                              <ul className="text-sm space-y-1 mt-2">
                                <li>• Visual inspection (color, clarity)</li>
                                <li>• Olfactory evaluation</li>
                                <li>• pH testing (if applicable)</li>
                                <li>• Viscosity measurement</li>
                                {selectedAlert.material.type === 'alcohol' && <li>• Microbiological testing</li>}
                              </ul>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Note:</strong> All testing should be performed by qualified personnel
                                following UAE standards and company protocols.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No specific testing required for this material type and expiry status.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Recommended Actions (Priority Order)</h4>
                    <div className="space-y-3">
                      {selectedAlert.recommendedActions.map((action, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            index === 0 ? 'bg-red-500 text-white' :
                            index === 1 ? 'bg-orange-500 text-white' :
                            index === 2 ? 'bg-yellow-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{action}</p>
                            {index === 0 && selectedAlert.severity === 'expired' && (
                              <p className="text-xs text-red-600 mt-1">
                                URGENT: This action must be taken immediately to prevent further loss.
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTakeAction(selectedAlert, action)}
                          >
                            Execute
                          </Button>
                        </div>
                      ))}
                    </div>

                    {selectedAlert.supplierInfo.canReturn && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-medium text-green-800">Return Option Available</h5>
                        <p className="text-sm text-green-700 mt-1">
                          This supplier accepts returns. Consider contacting them before taking other actions.
                        </p>
                        <p className="text-xs text-green-600 mt-2">
                          Policy: {selectedAlert.supplierInfo.returnPolicy}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Action History</h4>
                    <div className="space-y-3 mt-4">
                      {selectedAlert.actionHistory.map((historyItem, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border-l-2 border-blue-200">
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{historyItem.action}</p>
                              <span className="text-xs text-muted-foreground">
                                {format(historyItem.date, 'MMM dd, yyyy HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">By: {historyItem.user}</p>
                            {historyItem.notes && (
                              <p className="text-sm mt-1">{historyItem.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedAlert.notes && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-muted-foreground">Current Notes</h4>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm">{selectedAlert.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-muted-foreground">Add Note</h4>
                    <div className="mt-2 space-y-2">
                      <Textarea
                        placeholder="Add a note about actions taken or observations..."
                        rows={3}
                      />
                      <Button size="sm">
                        Add Note
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}