'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Star,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Shield,
  Package,
  TrendingUp,
  FileText,
  Truck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Archive
} from 'lucide-react'

interface SupplierDetailsProps {
  supplierId: string
  onClose: () => void
}

interface SupplierDetail {
  id: string
  code: string
  name: string
  nameAr?: string
  type: string
  category: string
  contactPerson?: string
  email?: string
  phone?: string
  whatsapp?: string
  website?: string
  address?: string
  city?: string
  country: string
  vatNumber?: string
  tradeNumber?: string
  licenseNumber?: string
  establishedYear?: number
  performanceScore: number
  rating: number
  totalOrders: number
  onTimeDeliveries: number
  qualityScore: number
  responseTime: number
  paymentTerms?: string
  creditLimit: number
  currency: string
  discountPercent: number
  certifications?: string[]
  complianceStatus: string
  leadTime: number
  minOrderValue: number
  isPreferred: boolean
  isActive: boolean
  tags: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

interface PerformanceMetric {
  month: string
  orders: number
  onTimeDelivery: number
  qualityScore: number
  responseTime: number
}

interface RecentOrder {
  id: string
  poNumber: string
  date: string
  amount: number
  status: string
  deliveryDate?: string
}

const mockSupplierDetail: SupplierDetail = {
  id: '1',
  code: 'SUP-001',
  name: 'Al Haramain Perfumes',
  nameAr: 'الحرمين للعطور',
  type: 'LOCAL',
  category: 'Raw Materials - Oud',
  contactPerson: 'Ahmed Al Mansoori',
  email: 'ahmed@alharamain.ae',
  phone: '+971-4-123-4567',
  whatsapp: '+971-50-123-4567',
  website: 'https://alharamain.ae',
  address: 'Al Ras Area, Deira',
  city: 'Dubai',
  country: 'UAE',
  vatNumber: '100123456700003',
  tradeNumber: 'CN-1234567',
  licenseNumber: 'DED-789456123',
  establishedYear: 1985,
  performanceScore: 92,
  rating: 4.6,
  totalOrders: 45,
  onTimeDeliveries: 42,
  qualityScore: 95,
  responseTime: 2,
  paymentTerms: 'Net 30',
  creditLimit: 50000,
  currency: 'AED',
  discountPercent: 5,
  certifications: ['ISO 9001:2015', 'UAE Quality Mark', 'Halal Certification'],
  complianceStatus: 'APPROVED',
  leadTime: 7,
  minOrderValue: 1000,
  isPreferred: true,
  isActive: true,
  tags: ['Oud', 'Premium', 'Local', 'Certified'],
  notes: 'Reliable supplier with excellent quality oud from various origins. Strong relationship since 2020.',
  createdAt: '2024-01-15',
  updatedAt: '2024-03-15'
}

const mockPerformanceData: PerformanceMetric[] = [
  { month: 'Jan 2024', orders: 8, onTimeDelivery: 95, qualityScore: 92, responseTime: 2 },
  { month: 'Feb 2024', orders: 12, onTimeDelivery: 88, qualityScore: 94, responseTime: 3 },
  { month: 'Mar 2024', orders: 10, onTimeDelivery: 100, qualityScore: 96, responseTime: 1 },
]

const mockRecentOrders: RecentOrder[] = [
  { id: '1', poNumber: 'PO-2024-001', date: '2024-03-15', amount: 15000, status: 'DELIVERED', deliveryDate: '2024-03-22' },
  { id: '2', poNumber: 'PO-2024-002', date: '2024-03-10', amount: 8500, status: 'IN_TRANSIT' },
  { id: '3', poNumber: 'PO-2024-003', date: '2024-03-05', amount: 22000, status: 'DELIVERED', deliveryDate: '2024-03-12' },
  { id: '4', poNumber: 'PO-2024-004', date: '2024-02-28', amount: 12500, status: 'DELIVERED', deliveryDate: '2024-03-07' },
]

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ supplierId, onClose }) => {
  const [supplier] = useState<SupplierDetail>(mockSupplierDetail)
  const [performanceData] = useState<PerformanceMetric[]>(mockPerformanceData)
  const [recentOrders] = useState<RecentOrder[]>(mockRecentOrders)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'CONDITIONAL': return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'PENDING': return <Clock className="h-5 w-5 text-blue-600" />
      case 'REJECTED': return <XCircle className="h-5 w-5 text-red-600" />
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{supplier.name}</h1>
            {supplier.nameAr && (
              <span className="text-lg text-gray-600 font-arabic">({supplier.nameAr})</span>
            )}
            {supplier.isPreferred && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Preferred
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <span>{supplier.code}</span>
            <span>•</span>
            <span>{supplier.category}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {supplier.city}, {supplier.country}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance Score</p>
                <p className="text-2xl font-bold text-blue-600">{supplier.performanceScore}/100</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-600">{supplier.rating}</span>
                  <div className="flex">{renderStars(Math.floor(supplier.rating))}</div>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-green-600">{supplier.totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lead Time</p>
                <p className="text-2xl font-bold text-purple-600">{supplier.leadTime} days</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supplier.contactPerson && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Person</label>
                    <p className="text-sm">{supplier.contactPerson}</p>
                  </div>
                )}
                {supplier.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {supplier.email}
                    </p>
                  </div>
                )}
                {supplier.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {supplier.phone}
                    </p>
                  </div>
                )}
                {supplier.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Website</label>
                    <p className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {supplier.website}
                      </a>
                    </p>
                  </div>
                )}
                {supplier.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-sm flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      {supplier.address}, {supplier.city}, {supplier.country}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="text-sm">{supplier.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-sm">{supplier.category}</p>
                </div>
                {supplier.establishedYear && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Established</label>
                    <p className="text-sm">{supplier.establishedYear}</p>
                  </div>
                )}
                {supplier.vatNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">VAT Number</label>
                    <p className="text-sm">{supplier.vatNumber}</p>
                  </div>
                )}
                {supplier.tradeNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Trade License</label>
                    <p className="text-sm">{supplier.tradeNumber}</p>
                  </div>
                )}
                {supplier.licenseNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">License Number</label>
                    <p className="text-sm">{supplier.licenseNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tags and Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {supplier.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {supplier.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Notes</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                    {supplier.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceData.map((data, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-3">{data.month}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{data.orders}</div>
                        <div className="text-xs text-gray-500">Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{data.onTimeDelivery}%</div>
                        <div className="text-xs text-gray-500">On-Time Delivery</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{data.qualityScore}</div>
                        <div className="text-xs text-gray-500">Quality Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">{data.responseTime}h</div>
                        <div className="text-xs text-gray-500">Response Time</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{order.poNumber}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">AED {order.amount.toLocaleString()}</p>
                      {order.deliveryDate && (
                        <p className="text-sm text-gray-600">Delivered: {order.deliveryDate}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {getComplianceIcon(supplier.complianceStatus)}
                <div>
                  <p className="font-medium">Status: {supplier.complianceStatus}</p>
                  <p className="text-sm text-gray-600">Last updated: {supplier.updatedAt}</p>
                </div>
              </div>

              {supplier.certifications && supplier.certifications.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Certifications</label>
                  <div className="space-y-2">
                    {supplier.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          {/* Financial Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Terms</label>
                  <p className="text-sm">{supplier.paymentTerms || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Credit Limit</label>
                  <p className="text-sm">{supplier.currency} {supplier.creditLimit.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Currency</label>
                  <p className="text-sm">{supplier.currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Discount</label>
                  <p className="text-sm">{supplier.discountPercent}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Minimum Order Value</label>
                  <p className="text-sm">{supplier.currency} {supplier.minOrderValue.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Lead Time</label>
                  <p className="text-sm">{supplier.leadTime} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SupplierDetails