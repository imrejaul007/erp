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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRightLeft,
  Package,
  ShoppingCart,
  Truck,
  RefreshCw,
  Sync,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Database,
  Link,
  Unlink,
  Settings,
  Activity,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Zap,
  Target,
  Workflow,
  Calendar,
  Timer,
  Factory,
  Store,
  Boxes,
  ClipboardList,
  FileText,
  Send,
  Receive,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Globe,
  Shield,
  Key,
  AlertCircle,
  Info,
  Check,
  X
} from 'lucide-react'

interface IntegrationModule {
  id: string
  name: string
  type: 'inventory' | 'sales' | 'procurement' | 'finance' | 'quality' | 'shipping'
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  lastSync: Date
  syncFrequency: 'real-time' | '5min' | '15min' | '1hour' | 'daily'
  endpoint: string
  version: string
  health: number
  dataFlows: DataFlow[]
  config: IntegrationConfig
}

interface DataFlow {
  id: string
  name: string
  direction: 'inbound' | 'outbound' | 'bidirectional'
  dataType: string
  lastTransfer: Date
  recordsTransferred: number
  status: 'active' | 'paused' | 'error'
  mapping: FieldMapping[]
}

interface FieldMapping {
  sourceField: string
  targetField: string
  transformation?: string
  required: boolean
}

interface IntegrationConfig {
  apiKey?: string
  baseUrl?: string
  timeout: number
  retryAttempts: number
  batchSize: number
  enableLogging: boolean
  encryptData: boolean
  customHeaders: Record<string, string>
}

interface SyncStatus {
  moduleId: string
  totalRecords: number
  processedRecords: number
  failedRecords: number
  startTime: Date
  endTime?: Date
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  errors: SyncError[]
}

interface SyncError {
  record: string
  error: string
  timestamp: Date
  resolved: boolean
}

interface InventoryIntegration {
  materialId: string
  materialName: string
  currentStock: number
  reservedStock: number
  availableStock: number
  minimumStock: number
  lastUpdated: Date
  productionDemand: number
  salesDemand: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order'
}

interface SalesIntegration {
  orderId: string
  customerName: string
  products: SalesProduct[]
  quantity: number
  value: number
  status: 'pending' | 'confirmed' | 'in_production' | 'ready' | 'shipped' | 'delivered'
  orderDate: Date
  deliveryDate: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  productionBatchId?: string
}

interface SalesProduct {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  specifications: Record<string, any>
}

interface ProductionDemand {
  productId: string
  productName: string
  totalDemand: number
  scheduledProduction: number
  availableStock: number
  shortfall: number
  recommendedAction: 'produce' | 'purchase' | 'substitute' | 'backorder'
  priority: number
  dueDate: Date
}

interface IntegrationMetrics {
  totalIntegrations: number
  activeIntegrations: number
  syncSuccessRate: number
  avgSyncTime: number
  dataTransferred: number
  errorsToday: number
  uptime: number
  lastSyncTime: Date
}

export default function ProductionIntegration() {
  const [modules, setModules] = useState<IntegrationModule[]>([])
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([])
  const [inventoryData, setInventoryData] = useState<InventoryIntegration[]>([])
  const [salesData, setSalesData] = useState<SalesIntegration[]>([])
  const [productionDemand, setProductionDemand] = useState<ProductionDemand[]>([])
  const [metrics, setMetrics] = useState<IntegrationMetrics | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedModule, setSelectedModule] = useState<IntegrationModule | null>(null)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    generateMockData()
    const interval = setInterval(() => {
      updateSyncStatuses()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const generateMockData = () => {
    const mockModules: IntegrationModule[] = [
      {
        id: 'INV001',
        name: 'Inventory Management System',
        type: 'inventory',
        status: 'connected',
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        syncFrequency: '15min',
        endpoint: 'https://api.inventory.oudpms.com',
        version: '2.1.0',
        health: 98,
        dataFlows: [
          {
            id: 'DF001',
            name: 'Material Stock Levels',
            direction: 'inbound',
            dataType: 'inventory',
            lastTransfer: new Date(Date.now() - 5 * 60 * 1000),
            recordsTransferred: 156,
            status: 'active',
            mapping: [
              { sourceField: 'material_id', targetField: 'materialId', required: true },
              { sourceField: 'current_stock', targetField: 'currentStock', required: true },
              { sourceField: 'min_stock', targetField: 'minimumStock', required: true }
            ]
          },
          {
            id: 'DF002',
            name: 'Production Consumption',
            direction: 'outbound',
            dataType: 'consumption',
            lastTransfer: new Date(Date.now() - 3 * 60 * 1000),
            recordsTransferred: 42,
            status: 'active',
            mapping: [
              { sourceField: 'batchId', targetField: 'batch_id', required: true },
              { sourceField: 'materialId', targetField: 'material_id', required: true },
              { sourceField: 'quantityUsed', targetField: 'quantity_consumed', required: true }
            ]
          }
        ],
        config: {
          timeout: 30000,
          retryAttempts: 3,
          batchSize: 100,
          enableLogging: true,
          encryptData: true,
          customHeaders: { 'X-API-Version': '2.1' }
        }
      },
      {
        id: 'SALES001',
        name: 'Sales Order Management',
        type: 'sales',
        status: 'connected',
        lastSync: new Date(Date.now() - 2 * 60 * 1000),
        syncFrequency: '5min',
        endpoint: 'https://api.sales.oudpms.com',
        version: '1.8.2',
        health: 95,
        dataFlows: [
          {
            id: 'DF003',
            name: 'Sales Orders',
            direction: 'inbound',
            dataType: 'orders',
            lastTransfer: new Date(Date.now() - 2 * 60 * 1000),
            recordsTransferred: 28,
            status: 'active',
            mapping: [
              { sourceField: 'order_id', targetField: 'orderId', required: true },
              { sourceField: 'customer', targetField: 'customerName', required: true },
              { sourceField: 'items', targetField: 'products', transformation: 'parseJSON', required: true }
            ]
          },
          {
            id: 'DF004',
            name: 'Production Status Updates',
            direction: 'outbound',
            dataType: 'status',
            lastTransfer: new Date(Date.now() - 1 * 60 * 1000),
            recordsTransferred: 15,
            status: 'active',
            mapping: [
              { sourceField: 'orderId', targetField: 'order_id', required: true },
              { sourceField: 'status', targetField: 'production_status', required: true },
              { sourceField: 'estimatedCompletion', targetField: 'eta', required: false }
            ]
          }
        ],
        config: {
          timeout: 45000,
          retryAttempts: 2,
          batchSize: 50,
          enableLogging: true,
          encryptData: true,
          customHeaders: { 'Authorization': 'Bearer ***' }
        }
      },
      {
        id: 'SHIP001',
        name: 'Shipping & Logistics',
        type: 'shipping',
        status: 'error',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        syncFrequency: '1hour',
        endpoint: 'https://api.shipping.oudpms.com',
        version: '1.5.0',
        health: 72,
        dataFlows: [
          {
            id: 'DF005',
            name: 'Shipment Tracking',
            direction: 'bidirectional',
            dataType: 'shipments',
            lastTransfer: new Date(Date.now() - 2 * 60 * 60 * 1000),
            recordsTransferred: 0,
            status: 'error',
            mapping: [
              { sourceField: 'shipment_id', targetField: 'shipmentId', required: true },
              { sourceField: 'tracking_number', targetField: 'trackingNumber', required: true }
            ]
          }
        ],
        config: {
          timeout: 60000,
          retryAttempts: 5,
          batchSize: 25,
          enableLogging: true,
          encryptData: false,
          customHeaders: {}
        }
      }
    ]

    const mockSyncStatuses: SyncStatus[] = [
      {
        moduleId: 'INV001',
        totalRecords: 156,
        processedRecords: 156,
        failedRecords: 0,
        startTime: new Date(Date.now() - 5 * 60 * 1000),
        endTime: new Date(Date.now() - 4 * 60 * 1000),
        status: 'completed',
        errors: []
      },
      {
        moduleId: 'SALES001',
        totalRecords: 28,
        processedRecords: 26,
        failedRecords: 2,
        startTime: new Date(Date.now() - 3 * 60 * 1000),
        endTime: new Date(Date.now() - 2 * 60 * 1000),
        status: 'completed',
        errors: [
          {
            record: 'ORD-2024-158',
            error: 'Invalid customer ID',
            timestamp: new Date(Date.now() - 2 * 60 * 1000),
            resolved: false
          },
          {
            record: 'ORD-2024-159',
            error: 'Missing product specifications',
            timestamp: new Date(Date.now() - 2 * 60 * 1000),
            resolved: false
          }
        ]
      }
    ]

    const mockInventoryData: InventoryIntegration[] = [
      {
        materialId: 'MAT001',
        materialName: 'Rose Essential Oil',
        currentStock: 45.5,
        reservedStock: 12.0,
        availableStock: 33.5,
        minimumStock: 20.0,
        lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
        productionDemand: 8.5,
        salesDemand: 15.0,
        status: 'in_stock'
      },
      {
        materialId: 'MAT002',
        materialName: 'Oud Wood Chips',
        currentStock: 8.2,
        reservedStock: 5.0,
        availableStock: 3.2,
        minimumStock: 10.0,
        lastUpdated: new Date(Date.now() - 3 * 60 * 1000),
        productionDemand: 12.0,
        salesDemand: 8.0,
        status: 'low_stock'
      },
      {
        materialId: 'MAT003',
        materialName: 'Amber Resin',
        currentStock: 0,
        reservedStock: 0,
        availableStock: 0,
        minimumStock: 5.0,
        lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
        productionDemand: 6.0,
        salesDemand: 4.0,
        status: 'out_of_stock'
      }
    ]

    const mockSalesData: SalesIntegration[] = [
      {
        orderId: 'ORD-2024-156',
        customerName: 'Luxury Perfumes LLC',
        products: [
          { productId: 'PROD001', productName: 'Royal Oud 50ml', quantity: 50, unitPrice: 250, specifications: { concentration: '20%' } }
        ],
        quantity: 50,
        value: 12500,
        status: 'in_production',
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        priority: 'high',
        productionBatchId: 'BATCH-2024-023'
      },
      {
        orderId: 'ORD-2024-157',
        customerName: 'Emirates Fragrance Co.',
        products: [
          { productId: 'PROD002', productName: 'Amber Essence 30ml', quantity: 100, unitPrice: 180, specifications: { concentration: '15%' } }
        ],
        quantity: 100,
        value: 18000,
        status: 'confirmed',
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'medium'
      }
    ]

    const mockProductionDemand: ProductionDemand[] = [
      {
        productId: 'PROD001',
        productName: 'Royal Oud 50ml',
        totalDemand: 120,
        scheduledProduction: 80,
        availableStock: 25,
        shortfall: 15,
        recommendedAction: 'produce',
        priority: 1,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        productId: 'PROD002',
        productName: 'Amber Essence 30ml',
        totalDemand: 200,
        scheduledProduction: 150,
        availableStock: 30,
        shortfall: 20,
        recommendedAction: 'produce',
        priority: 2,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ]

    const mockMetrics: IntegrationMetrics = {
      totalIntegrations: 3,
      activeIntegrations: 2,
      syncSuccessRate: 96.4,
      avgSyncTime: 45,
      dataTransferred: 1247,
      errorsToday: 2,
      uptime: 99.1,
      lastSyncTime: new Date(Date.now() - 2 * 60 * 1000)
    }

    setModules(mockModules)
    setSyncStatuses(mockSyncStatuses)
    setInventoryData(mockInventoryData)
    setSalesData(mockSalesData)
    setProductionDemand(mockProductionDemand)
    setMetrics(mockMetrics)
  }

  const updateSyncStatuses = () => {
    // Simulate real-time sync status updates
    setSyncStatuses(prev => prev.map(status => ({
      ...status,
      processedRecords: Math.min(status.totalRecords, status.processedRecords + Math.floor(Math.random() * 3))
    })))
  }

  const handleSync = async (moduleId: string) => {
    setIsSyncing(true)
    // Simulate sync operation
    setTimeout(() => {
      setModules(modules.map(module =>
        module.id === moduleId
          ? { ...module, lastSync: new Date(), status: 'connected' as const }
          : module
      ))
      setIsSyncing(false)
    }, 3000)
  }

  const handleSyncAll = async () => {
    setIsSyncing(true)
    // Simulate sync all operation
    setTimeout(() => {
      setModules(modules.map(module => ({
        ...module,
        lastSync: new Date(),
        status: module.status === 'error' ? 'connected' as const : module.status
      })))
      setIsSyncing(false)
    }, 5000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'disconnected': return <X className="h-5 w-5 text-gray-500" />
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'syncing': return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      default: return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800'
      case 'disconnected': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'syncing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inventory': return <Package className="h-4 w-4" />
      case 'sales': return <ShoppingCart className="h-4 w-4" />
      case 'shipping': return <Truck className="h-4 w-4" />
      case 'finance': return <BarChart3 className="h-4 w-4" />
      case 'quality': return <Shield className="h-4 w-4" />
      case 'procurement': return <Boxes className="h-4 w-4" />
      default: return <Database className="h-4 w-4" />
    }
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'inbound': return <ArrowDown className="h-4 w-4 text-green-500" />
      case 'outbound': return <ArrowUp className="h-4 w-4 text-blue-500" />
      case 'bidirectional': return <ArrowRightLeft className="h-4 w-4 text-purple-500" />
      default: return <Activity className="h-4 w-4" />
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

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      case 'on_order': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in_production': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Production System Integration</h2>
          <p className="text-muted-foreground">Manage connections between production and other business systems</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSyncAll} disabled={isSyncing}>
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Sync className="mr-2 h-4 w-4" />
                Sync All
              </>
            )}
          </Button>
          <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
                <DialogDescription>Connect a new system to production management</DialogDescription>
              </DialogHeader>
              <AddIntegrationForm onClose={() => setIsAddModuleOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Integration Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Integrations</p>
                  <p className="text-2xl font-bold">{metrics.totalIntegrations}</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.activeIntegrations}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{metrics.syncSuccessRate.toFixed(1)}%</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Data Transferred</p>
                  <p className="text-2xl font-bold">{metrics.dataTransferred.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="text-2xl font-bold">{metrics.uptime.toFixed(1)}%</p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Integrations</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales Orders</TabsTrigger>
          <TabsTrigger value="demand">Demand Planning</TabsTrigger>
          <TabsTrigger value="sync">Sync Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Integration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(module.type)}
                        <div>
                          <p className="font-medium">{module.name}</p>
                          <p className="text-sm text-muted-foreground">Last sync: {formatTimeAgo(module.lastSync)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">{module.health}%</p>
                          <p className="text-xs text-muted-foreground">Health</p>
                        </div>
                        <Badge className={getStatusColor(module.status)}>
                          {module.status}
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
                  <BarChart3 className="h-5 w-5" />
                  Data Flow Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.flatMap(module => module.dataFlows).map((flow) => (
                    <div key={flow.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getDirectionIcon(flow.direction)}
                        <div>
                          <p className="font-medium">{flow.name}</p>
                          <p className="text-sm text-muted-foreground">{flow.dataType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{flow.recordsTransferred}</p>
                        <p className="text-xs text-muted-foreground">Records</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedModule(module)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(module.type)}
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                    </div>
                    {getStatusIcon(module.status)}
                  </div>
                  <CardDescription>Version {module.version}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Health</span>
                        <span>{module.health}%</span>
                      </div>
                      <Progress value={module.health} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Last Sync</p>
                        <p className="font-medium">{formatTimeAgo(module.lastSync)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-medium">{module.syncFrequency}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Data Flows</p>
                      <div className="space-y-1">
                        {module.dataFlows.map((flow) => (
                          <div key={flow.id} className="flex items-center gap-2 text-xs">
                            {getDirectionIcon(flow.direction)}
                            <span>{flow.name}</span>
                            <Badge size="sm" variant="outline" className={
                              flow.status === 'active' ? 'text-green-700' :
                              flow.status === 'paused' ? 'text-yellow-700' : 'text-red-700'
                            }>
                              {flow.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); handleSync(module.id) }}>
                        <Sync className="mr-1 h-3 w-3" />
                        Sync
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setIsConfigDialogOpen(true) }}>
                        <Settings className="mr-1 h-3 w-3" />
                        Config
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Integration Status
              </CardTitle>
              <CardDescription>Real-time inventory levels and production impact</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Production Demand</TableHead>
                    <TableHead>Sales Demand</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((item) => (
                    <TableRow key={item.materialId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.materialName}</p>
                          <p className="text-sm text-muted-foreground">{item.materialId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.currentStock}L</p>
                          <p className="text-sm text-muted-foreground">Min: {item.minimumStock}L</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.availableStock}L</p>
                          <p className="text-sm text-muted-foreground">Reserved: {item.reservedStock}L</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.productionDemand}L</TableCell>
                      <TableCell>{item.salesDemand}L</TableCell>
                      <TableCell>
                        <Badge className={getStockStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatTimeAgo(item.lastUpdated)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Sales Order Integration
              </CardTitle>
              <CardDescription>Orders requiring production and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.orderId}</p>
                          {order.productionBatchId && (
                            <p className="text-sm text-muted-foreground">Batch: {order.productionBatchId}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        <div>
                          {order.products.map((product, index) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium">{product.productName}</p>
                              <p className="text-muted-foreground">{product.quantity} units × AED {product.unitPrice}</p>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>AED {order.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.deliveryDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          {order.status === 'confirmed' && (
                            <Button size="sm">
                              <Factory className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demand" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Production Demand Planning
              </CardTitle>
              <CardDescription>Integrated demand analysis across sales and inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Total Demand</TableHead>
                    <TableHead>Scheduled Production</TableHead>
                    <TableHead>Available Stock</TableHead>
                    <TableHead>Shortfall</TableHead>
                    <TableHead>Recommended Action</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionDemand.map((demand) => (
                    <TableRow key={demand.productId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{demand.productName}</p>
                          <p className="text-sm text-muted-foreground">{demand.productId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{demand.totalDemand}</TableCell>
                      <TableCell>{demand.scheduledProduction}</TableCell>
                      <TableCell>{demand.availableStock}</TableCell>
                      <TableCell>
                        <span className={demand.shortfall > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {demand.shortfall > 0 ? demand.shortfall : '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          demand.recommendedAction === 'produce' ? 'bg-blue-100 text-blue-800' :
                          demand.recommendedAction === 'purchase' ? 'bg-green-100 text-green-800' :
                          demand.recommendedAction === 'substitute' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {demand.recommendedAction}
                        </Badge>
                      </TableCell>
                      <TableCell>{demand.dueDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          demand.priority === 1 ? 'border-red-500 text-red-700' :
                          demand.priority === 2 ? 'border-yellow-500 text-yellow-700' :
                          'border-green-500 text-green-700'
                        }>
                          P{demand.priority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {syncStatuses.map((status) => {
              const module = modules.find(m => m.id === status.moduleId)
              const progress = (status.processedRecords / status.totalRecords) * 100

              return (
                <Card key={status.moduleId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{module?.name}</CardTitle>
                      <Badge className={
                        status.status === 'completed' ? 'bg-green-100 text-green-800' :
                        status.status === 'running' ? 'bg-blue-100 text-blue-800' :
                        status.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {status.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{status.processedRecords} / {status.totalRecords} records</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Start Time</p>
                          <p className="font-medium">{status.startTime.toLocaleTimeString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-medium">
                            {status.endTime
                              ? `${Math.round((status.endTime.getTime() - status.startTime.getTime()) / 1000)}s`
                              : `${Math.round((new Date().getTime() - status.startTime.getTime()) / 1000)}s`}
                          </p>
                        </div>
                      </div>

                      {status.failedRecords > 0 && (
                        <div>
                          <p className="text-sm font-medium text-red-600 mb-2">
                            {status.failedRecords} failed records
                          </p>
                          <div className="space-y-1">
                            {status.errors.slice(0, 3).map((error, index) => (
                              <div key={index} className="text-xs p-2 bg-red-50 rounded border border-red-200">
                                <p className="font-medium">{error.record}</p>
                                <p className="text-red-600">{error.error}</p>
                              </div>
                            ))}
                            {status.errors.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{status.errors.length - 3} more errors
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Module Detail Dialog */}
      {selectedModule && (
        <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTypeIcon(selectedModule.type)}
                {selectedModule.name}
              </DialogTitle>
              <DialogDescription>Integration details and configuration</DialogDescription>
            </DialogHeader>
            <ModuleDetailView module={selectedModule} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Component stub functions
const AddIntegrationForm = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Add Integration form would be implemented here</p>
    <Button onClick={onClose}>Close</Button>
  </div>
)

const ModuleDetailView = ({ module }: { module: IntegrationModule }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Connection Details</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" />
              <span>{module.endpoint}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Key className="h-4 w-4" />
              <span>Version {module.version}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4" />
              <span>Sync every {module.syncFrequency}</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Configuration</Label>
          <div className="mt-2 space-y-1 text-sm">
            <p>Timeout: {module.config.timeout}ms</p>
            <p>Retry attempts: {module.config.retryAttempts}</p>
            <p>Batch size: {module.config.batchSize}</p>
            <p>Logging: {module.config.enableLogging ? 'Enabled' : 'Disabled'}</p>
            <p>Encryption: {module.config.encryptData ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Data Flows</Label>
          <div className="mt-2 space-y-2">
            {module.dataFlows.map((flow) => (
              <div key={flow.id} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getDirectionIcon(flow.direction)}
                  <span className="font-medium">{flow.name}</span>
                  <Badge size="sm" variant="outline">
                    {flow.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {flow.recordsTransferred} records transferred
                </p>
                <p className="text-sm text-muted-foreground">
                  Last transfer: {formatTimeAgo(flow.lastTransfer)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

function getDirectionIcon(direction: string) {
  switch (direction) {
    case 'inbound': return <ArrowDown className="h-4 w-4 text-green-500" />
    case 'outbound': return <ArrowUp className="h-4 w-4 text-blue-500" />
    case 'bidirectional': return <ArrowRightLeft className="h-4 w-4 text-purple-500" />
    default: return <Activity className="h-4 w-4" />
  }
}