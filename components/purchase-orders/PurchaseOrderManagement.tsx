'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Plus,
  Filter,
  Calendar,
  DollarSign,
  Package,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Download,
  Send,
  Truck,
  FileText,
  User,
  Building
} from 'lucide-react'

interface PurchaseOrder {
  id: string
  poNumber: string
  supplier: {
    id: string
    name: string
    code: string
    country: string
  }
  requestedBy: {
    id: string
    name: string
  }
  approvedBy?: {
    id: string
    name: string
  }
  store?: {
    id: string
    name: string
  }
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'ACKNOWLEDGED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  type: 'REGULAR' | 'URGENT' | 'BLANKET' | 'CONTRACT'
  orderDate: string
  requestedDate: string
  expectedDate?: string
  deliveryDate?: string
  subtotal: number
  discountAmount: number
  vatAmount: number
  shippingCost: number
  totalAmount: number
  currency: string
  paymentTerms?: string
  deliveryTerms?: string
  notes?: string
  itemCount: number
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    supplier: {
      id: '1',
      name: 'Al Haramain Perfumes',
      code: 'SUP-001',
      country: 'UAE'
    },
    requestedBy: {
      id: '1',
      name: 'Sarah Ahmed'
    },
    approvedBy: {
      id: '2',
      name: 'Mohammed Al-Rashid'
    },
    store: {
      id: '1',
      name: 'Dubai Main Store'
    },
    status: 'RECEIVED',
    priority: 'HIGH',
    type: 'REGULAR',
    orderDate: '2024-03-15',
    requestedDate: '2024-03-22',
    expectedDate: '2024-03-20',
    deliveryDate: '2024-03-19',
    subtotal: 14285.71,
    discountAmount: 714.29,
    vatAmount: 678.57,
    shippingCost: 250,
    totalAmount: 14500,
    currency: 'AED',
    paymentTerms: 'Net 30',
    deliveryTerms: 'FOB Destination',
    notes: 'Premium oud collection for spring season',
    itemCount: 5
  },
  {
    id: '2',
    poNumber: 'PO-2024-002',
    supplier: {
      id: '2',
      name: 'Mysore Sandalwood Co.',
      code: 'SUP-002',
      country: 'India'
    },
    requestedBy: {
      id: '3',
      name: 'Ahmed Hassan'
    },
    status: 'PENDING_APPROVAL',
    priority: 'MEDIUM',
    type: 'REGULAR',
    orderDate: '2024-03-18',
    requestedDate: '2024-04-01',
    subtotal: 9523.81,
    discountAmount: 0,
    vatAmount: 476.19,
    shippingCost: 500,
    totalAmount: 10500,
    currency: 'AED',
    paymentTerms: 'Net 45',
    deliveryTerms: 'CIF Dubai',
    notes: 'High-grade sandalwood for premium products',
    itemCount: 3
  },
  {
    id: '3',
    poNumber: 'PO-2024-003',
    supplier: {
      id: '3',
      name: 'Cambodian Oud Traders',
      code: 'SUP-003',
      country: 'Cambodia'
    },
    requestedBy: {
      id: '1',
      name: 'Sarah Ahmed'
    },
    approvedBy: {
      id: '2',
      name: 'Mohammed Al-Rashid'
    },
    status: 'SENT',
    priority: 'URGENT',
    type: 'URGENT',
    orderDate: '2024-03-20',
    requestedDate: '2024-03-30',
    expectedDate: '2024-04-05',
    subtotal: 28571.43,
    discountAmount: 1428.57,
    vatAmount: 1357.14,
    shippingCost: 1000,
    totalAmount: 29500,
    currency: 'AED',
    paymentTerms: 'Net 60',
    deliveryTerms: 'FOB Origin',
    notes: 'Wild oud - requires special handling and documentation',
    itemCount: 8
  }
]

const PurchaseOrderManagement: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterPriority, setFilterPriority] = useState<string>('ALL')
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.requestedBy.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'ALL' || po.status === filterStatus
    const matchesPriority = filterPriority === 'ALL' || po.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'SENT': return 'bg-purple-100 text-purple-800'
      case 'ACKNOWLEDGED': return 'bg-indigo-100 text-indigo-800'
      case 'PARTIALLY_RECEIVED': return 'bg-orange-100 text-orange-800'
      case 'RECEIVED': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText className="h-4 w-4" />
      case 'PENDING_APPROVAL': return <Clock className="h-4 w-4" />
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />
      case 'SENT': return <Send className="h-4 w-4" />
      case 'ACKNOWLEDGED': return <CheckCircle className="h-4 w-4" />
      case 'PARTIALLY_RECEIVED': return <Package className="h-4 w-4" />
      case 'RECEIVED': return <CheckCircle className="h-4 w-4" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'CANCELLED': return <XCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const statusCounts = {
    all: purchaseOrders.length,
    draft: purchaseOrders.filter(po => po.status === 'DRAFT').length,
    pending: purchaseOrders.filter(po => po.status === 'PENDING_APPROVAL').length,
    approved: purchaseOrders.filter(po => po.status === 'APPROVED').length,
    sent: purchaseOrders.filter(po => po.status === 'SENT').length,
    received: purchaseOrders.filter(po => po.status === 'RECEIVED' || po.status === 'COMPLETED').length,
  }

  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0)

  const PurchaseOrderCard: React.FC<{ po: PurchaseOrder }> = ({ po }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{po.poNumber}</h3>
              <Badge className={getStatusColor(po.status)}>
                {getStatusIcon(po.status)}
                <span className="ml-1">{po.status.replace('_', ' ')}</span>
              </Badge>
              <Badge className={getPriorityColor(po.priority)}>
                {po.priority}
              </Badge>
              {po.type !== 'REGULAR' && (
                <Badge variant="outline">{po.type}</Badge>
              )}
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {po.supplier.name} ({po.supplier.code})
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Requested by {po.requestedBy.name}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Order: {po.orderDate}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Required: {po.requestedDate}
                </div>
                {po.deliveryDate && (
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    Delivered: {po.deliveryDate}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {po.currency} {po.totalAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              {po.itemCount} item{po.itemCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {po.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{po.notes}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-xs text-gray-500">
            {po.paymentTerms && <span>Payment: {po.paymentTerms}</span>}
            {po.deliveryTerms && <span>• Delivery: {po.deliveryTerms}</span>}
            {po.store && <span>• Store: {po.store.name}</span>}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedPO(po)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {po.status === 'DRAFT' && (
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {po.status !== 'DRAFT' && (
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600">Manage purchase orders and procurement workflow</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Received</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.received}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">AED {totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by PO number, supplier, or requester..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="SENT">Sent</option>
                <option value="ACKNOWLEDGED">Acknowledged</option>
                <option value="PARTIALLY_RECEIVED">Partially Received</option>
                <option value="RECEIVED">Received</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({statusCounts.draft})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({statusCounts.approved})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({statusCounts.sent})</TabsTrigger>
          <TabsTrigger value="received">Received ({statusCounts.received})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredPOs.map(po => (
            <PurchaseOrderCard key={po.id} po={po} />
          ))}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {filteredPOs.filter(po => po.status === 'DRAFT').map(po => (
            <PurchaseOrderCard key={po.id} po={po} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredPOs.filter(po => po.status === 'PENDING_APPROVAL').map(po => (
            <PurchaseOrderCard key={po.id} po={po} />
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredPOs.filter(po => po.status === 'APPROVED').map(po => (
            <PurchaseOrderCard key={po.id} po={po} />
          ))}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {filteredPOs.filter(po => po.status === 'SENT' || po.status === 'ACKNOWLEDGED').map(po => (
            <PurchaseOrderCard key={po.id} po={po} />
          ))}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {filteredPOs.filter(po => ['PARTIALLY_RECEIVED', 'RECEIVED', 'COMPLETED'].includes(po.status)).map(po => (
            <PurchaseOrderCard key={po.id} po={po} />
          ))}
        </TabsContent>
      </Tabs>

      {filteredPOs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase orders found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new purchase order.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PurchaseOrderManagement