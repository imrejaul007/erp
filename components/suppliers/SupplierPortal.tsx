'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Building,
  Package,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Send,
  MessageSquare,
  Bell,
  Star,
  TrendingUp,
  Truck,
  Shield,
  Phone,
  Mail,
  Globe,
  MapPin,
  User,
  Search,
  Filter
} from 'lucide-react'

interface SupplierPortalData {
  supplier: {
    id: string
    code: string
    name: string
    nameAr?: string
    contactPerson: string
    email: string
    phone: string
    rating: number
    performanceScore: number
    totalOrders: number
    onTimeDelivery: number
  }
  purchaseOrders: Array<{
    id: string
    poNumber: string
    status: string
    orderDate: string
    requestedDate: string
    deliveryDate?: string
    totalAmount: number
    currency: string
    itemCount: number
    notes?: string
  }>
  invoices: Array<{
    id: string
    invoiceNo: string
    poNumber: string
    invoiceDate: string
    dueDate: string
    amount: number
    paidAmount: number
    status: string
    currency: string
  }>
  shipments: Array<{
    id: string
    shipmentNo: string
    poNumber: string
    status: string
    carrier: string
    trackingNumber?: string
    shipDate?: string
    estimatedArrival?: string
    actualArrival?: string
    packages: number
  }>
  communications: Array<{
    id: string
    type: 'MESSAGE' | 'NOTIFICATION' | 'ALERT'
    subject: string
    content: string
    from: string
    timestamp: string
    isRead: boolean
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
  }>
  performance: {
    deliveryPerformance: number
    qualityScore: number
    responseTime: number
    overallRating: number
    monthlyTrend: Array<{
      month: string
      orders: number
      onTimeDelivery: number
      qualityScore: number
    }>
  }
}

const mockSupplierData: SupplierPortalData = {
  supplier: {
    id: '1',
    code: 'SUP-001',
    name: 'Al Haramain Perfumes',
    nameAr: 'الحرمين للعطور',
    contactPerson: 'Ahmed Al Mansoori',
    email: 'ahmed@alharamain.ae',
    phone: '+971-4-123-4567',
    rating: 4.6,
    performanceScore: 92,
    totalOrders: 45,
    onTimeDelivery: 94
  },
  purchaseOrders: [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      status: 'COMPLETED',
      orderDate: '2024-03-15',
      requestedDate: '2024-03-22',
      deliveryDate: '2024-03-19',
      totalAmount: 15000,
      currency: 'AED',
      itemCount: 5,
      notes: 'Premium oud collection for spring season'
    },
    {
      id: '2',
      poNumber: 'PO-2024-008',
      status: 'SENT',
      orderDate: '2024-03-20',
      requestedDate: '2024-03-27',
      totalAmount: 22000,
      currency: 'AED',
      itemCount: 8,
      notes: 'Urgent order for new product launch'
    },
    {
      id: '3',
      poNumber: 'PO-2024-012',
      status: 'APPROVED',
      orderDate: '2024-03-22',
      requestedDate: '2024-03-29',
      totalAmount: 18500,
      currency: 'AED',
      itemCount: 6
    }
  ],
  invoices: [
    {
      id: '1',
      invoiceNo: 'INV-AH-2024-001',
      poNumber: 'PO-2024-001',
      invoiceDate: '2024-03-19',
      dueDate: '2024-04-18',
      amount: 15000,
      paidAmount: 15000,
      status: 'PAID',
      currency: 'AED'
    },
    {
      id: '2',
      invoiceNo: 'INV-AH-2024-002',
      poNumber: 'PO-2024-005',
      invoiceDate: '2024-03-10',
      dueDate: '2024-04-09',
      amount: 12500,
      paidAmount: 0,
      status: 'PENDING',
      currency: 'AED'
    }
  ],
  shipments: [
    {
      id: '1',
      shipmentNo: 'SH-2024-001',
      poNumber: 'PO-2024-001',
      status: 'DELIVERED',
      carrier: 'ARAMEX',
      trackingNumber: 'ARX123456789AE',
      shipDate: '2024-03-16',
      estimatedArrival: '2024-03-18',
      actualArrival: '2024-03-17',
      packages: 3
    },
    {
      id: '2',
      shipmentNo: 'SH-2024-005',
      poNumber: 'PO-2024-008',
      status: 'IN_TRANSIT',
      carrier: 'DHL',
      trackingNumber: 'DHL987654321AE',
      shipDate: '2024-03-21',
      estimatedArrival: '2024-03-24',
      packages: 5
    }
  ],
  communications: [
    {
      id: '1',
      type: 'NOTIFICATION',
      subject: 'New Purchase Order - PO-2024-012',
      content: 'You have received a new purchase order worth AED 18,500. Please review and confirm.',
      from: 'Procurement Team',
      timestamp: '2024-03-22T14:30:00Z',
      isRead: false,
      priority: 'HIGH'
    },
    {
      id: '2',
      type: 'MESSAGE',
      subject: 'Quality Feedback - Excellent batch',
      content: 'The recent batch of Premium Cambodian Oud received excellent quality ratings. Thank you for maintaining high standards.',
      from: 'Quality Control Team',
      timestamp: '2024-03-20T11:15:00Z',
      isRead: true,
      priority: 'MEDIUM'
    },
    {
      id: '3',
      type: 'ALERT',
      subject: 'Payment Processed - INV-AH-2024-001',
      content: 'Payment of AED 15,000 has been processed for invoice INV-AH-2024-001.',
      from: 'Finance Team',
      timestamp: '2024-03-19T16:45:00Z',
      isRead: true,
      priority: 'LOW'
    }
  ],
  performance: {
    deliveryPerformance: 94,
    qualityScore: 96,
    responseTime: 2,
    overallRating: 4.6,
    monthlyTrend: [
      { month: 'Jan 2024', orders: 8, onTimeDelivery: 95, qualityScore: 92 },
      { month: 'Feb 2024', orders: 12, onTimeDelivery: 88, qualityScore: 94 },
      { month: 'Mar 2024', orders: 10, onTimeDelivery: 100, qualityScore: 96 }
    ]
  }
}

const SupplierPortal: React.FC = () => {
  const [data] = useState<SupplierPortalData>(mockSupplierData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [selectedTab, setSelectedTab] = useState('dashboard')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'SENT':
      case 'IN_TRANSIT':
      case 'PENDING': return 'bg-blue-100 text-blue-800'
      case 'APPROVED': return 'bg-purple-100 text-purple-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
      case 'PAID': return <CheckCircle className="h-4 w-4" />
      case 'SENT':
      case 'IN_TRANSIT':
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />
      case 'OVERDUE': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE': return <MessageSquare className="h-4 w-4 text-blue-600" />
      case 'NOTIFICATION': return <Bell className="h-4 w-4 text-purple-600" />
      case 'ALERT': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'border-l-red-500'
      case 'MEDIUM': return 'border-l-yellow-500'
      case 'LOW': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  const unreadCount = data.communications.filter(comm => !comm.isRead).length
  const pendingOrders = data.purchaseOrders.filter(po => ['SENT', 'APPROVED'].includes(po.status)).length
  const overdueInvoices = data.invoices.filter(inv =>
    inv.status === 'PENDING' && new Date(inv.dueDate) < new Date()
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{data.supplier.name}</h1>
                {data.supplier.nameAr && (
                  <p className="text-gray-600">{data.supplier.nameAr}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold">{data.supplier.contactPerson}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < data.supplier.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{data.supplier.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Quick Alerts */}
        {(unreadCount > 0 || pendingOrders > 0 || overdueInvoices > 0) && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {unreadCount > 0 && (
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">New Messages</p>
                      <p className="text-sm text-gray-600">{unreadCount} unread communication{unreadCount !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {pendingOrders > 0 && (
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-semibold">Pending Orders</p>
                      <p className="text-sm text-gray-600">{pendingOrders} order{pendingOrders !== 1 ? 's' : ''} awaiting response</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {overdueInvoices > 0 && (
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold">Overdue Invoices</p>
                      <p className="text-sm text-gray-600">{overdueInvoices} invoice{overdueInvoices !== 1 ? 's' : ''} past due</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{data.supplier.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Performance Score</p>
                      <p className="text-2xl font-bold text-gray-900">{data.supplier.performanceScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Truck className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
                      <p className="text-2xl font-bold text-gray-900">{data.supplier.onTimeDelivery}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Quality Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{data.performance.qualityScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Purchase Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.purchaseOrders.slice(0, 3).map((po) => (
                      <div key={po.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{po.poNumber}</p>
                          <p className="text-sm text-gray-600">{po.orderDate}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(po.status)}>
                            {getStatusIcon(po.status)}
                            <span className="ml-1">{po.status}</span>
                          </Badge>
                          <p className="text-sm font-medium mt-1">AED {po.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.performance.monthlyTrend.map((trend, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <h4 className="font-medium text-gray-900 mb-2">{trend.month}</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{trend.orders}</div>
                            <div className="text-gray-500">Orders</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{trend.onTimeDelivery}%</div>
                            <div className="text-gray-500">On-Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{trend.qualityScore}</div>
                            <div className="text-gray-500">Quality</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {/* Orders List */}
            <div className="space-y-4">
              {data.purchaseOrders.map((po) => (
                <Card key={po.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{po.poNumber}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Order Date: {po.orderDate}
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
                      <div className="text-right">
                        <Badge className={getStatusColor(po.status)}>
                          {getStatusIcon(po.status)}
                          <span className="ml-1">{po.status}</span>
                        </Badge>
                        <p className="text-lg font-bold mt-2">AED {po.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{po.itemCount} items</p>
                      </div>
                    </div>

                    {po.notes && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">{po.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                      {po.status === 'SENT' && (
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            {/* Invoices List */}
            <div className="space-y-4">
              {data.invoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{invoice.invoiceNo}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>PO: {invoice.poNumber}</span>
                          <span>•</span>
                          <span>Invoice Date: {invoice.invoiceDate}</span>
                          <span>•</span>
                          <span>Due: {invoice.dueDate}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1">{invoice.status}</span>
                        </Badge>
                        <p className="text-lg font-bold mt-2">AED {invoice.amount.toLocaleString()}</p>
                        {invoice.paidAmount > 0 && (
                          <p className="text-sm text-green-600">Paid: AED {invoice.paidAmount.toLocaleString()}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Invoice
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                      {invoice.status === 'PENDING' && (
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload Invoice
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            {/* Shipments List */}
            <div className="space-y-4">
              {data.shipments.map((shipment) => (
                <Card key={shipment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{shipment.shipmentNo}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>PO: {shipment.poNumber}</span>
                          <span>•</span>
                          <span>Carrier: {shipment.carrier}</span>
                          {shipment.trackingNumber && (
                            <>
                              <span>•</span>
                              <span>Tracking: {shipment.trackingNumber}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          {shipment.shipDate && <span>Shipped: {shipment.shipDate}</span>}
                          {shipment.estimatedArrival && (
                            <>
                              <span>•</span>
                              <span>ETA: {shipment.estimatedArrival}</span>
                            </>
                          )}
                          {shipment.actualArrival && (
                            <>
                              <span>•</span>
                              <span>Delivered: {shipment.actualArrival}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(shipment.status)}>
                          {getStatusIcon(shipment.status)}
                          <span className="ml-1">{shipment.status.replace('_', ' ')}</span>
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">{shipment.packages} packages</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Track Shipment
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            {/* Communications List */}
            <div className="space-y-4">
              {data.communications.map((comm) => (
                <Card key={comm.id} className={`border-l-4 ${getPriorityColor(comm.priority)} ${!comm.isRead ? 'bg-blue-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        {getCommunicationIcon(comm.type)}
                        <div>
                          <h3 className={`font-semibold ${!comm.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                            {comm.subject}
                          </h3>
                          <p className="text-sm text-gray-600">From: {comm.from}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {!comm.isRead && (
                          <Badge className="bg-blue-100 text-blue-800 mb-2">New</Badge>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(comm.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{comm.content}</p>
                    <div className="flex gap-2">
                      {!comm.isRead && (
                        <Button size="sm" variant="outline">
                          Mark as Read
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Send className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SupplierPortal