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
  Star,
  Globe,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Clock,
  Shield,
  Package,
  Edit,
  Trash2,
  Eye,
  Filter
} from 'lucide-react'

interface Supplier {
  id: string
  code: string
  name: string
  nameAr?: string
  type: 'LOCAL' | 'REGIONAL' | 'INTERNATIONAL' | 'MANUFACTURER' | 'DISTRIBUTOR' | 'AGENT'
  category: string
  contactPerson?: string
  email?: string
  phone?: string
  country: string
  city?: string
  performanceScore: number
  rating: number
  totalOrders: number
  onTimeDeliveries: number
  qualityScore: number
  responseTime: number
  paymentTerms?: string
  creditLimit: number
  currency: string
  leadTime: number
  isPreferred: boolean
  isActive: boolean
  complianceStatus: 'PENDING' | 'APPROVED' | 'CONDITIONAL' | 'REJECTED' | 'EXPIRED'
  tags: string[]
  createdAt: string
  updatedAt: string
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    code: 'SUP-001',
    name: 'Al Haramain Perfumes',
    nameAr: 'الحرمين للعطور',
    type: 'LOCAL',
    category: 'Raw Materials - Oud',
    contactPerson: 'Ahmed Al Mansoori',
    email: 'ahmed@alharamain.ae',
    phone: '+971-4-123-4567',
    country: 'UAE',
    city: 'Dubai',
    performanceScore: 92,
    rating: 4.6,
    totalOrders: 45,
    onTimeDeliveries: 42,
    qualityScore: 95,
    responseTime: 2,
    paymentTerms: 'Net 30',
    creditLimit: 50000,
    currency: 'AED',
    leadTime: 7,
    isPreferred: true,
    isActive: true,
    complianceStatus: 'APPROVED',
    tags: ['Oud', 'Premium', 'Local'],
    createdAt: '2024-01-15',
    updatedAt: '2024-03-15'
  },
  {
    id: '2',
    code: 'SUP-002',
    name: 'Mysore Sandalwood Co.',
    type: 'INTERNATIONAL',
    category: 'Raw Materials - Sandalwood',
    contactPerson: 'Raj Kumar',
    email: 'raj@mysoresandalwood.in',
    phone: '+91-80-2345-6789',
    country: 'India',
    city: 'Mysore',
    performanceScore: 88,
    rating: 4.4,
    totalOrders: 23,
    onTimeDeliveries: 20,
    qualityScore: 92,
    responseTime: 4,
    paymentTerms: 'Net 45',
    creditLimit: 75000,
    currency: 'AED',
    leadTime: 14,
    isPreferred: true,
    isActive: true,
    complianceStatus: 'APPROVED',
    tags: ['Sandalwood', 'International', 'Certified'],
    createdAt: '2024-02-01',
    updatedAt: '2024-03-10'
  },
  {
    id: '3',
    code: 'SUP-003',
    name: 'Cambodian Oud Traders',
    type: 'INTERNATIONAL',
    category: 'Raw Materials - Oud',
    contactPerson: 'Sok Phally',
    email: 'phally@cambodianoud.com',
    phone: '+855-23-456-789',
    country: 'Cambodia',
    city: 'Phnom Penh',
    performanceScore: 85,
    rating: 4.2,
    totalOrders: 18,
    onTimeDeliveries: 15,
    qualityScore: 89,
    responseTime: 6,
    paymentTerms: 'Net 60',
    creditLimit: 100000,
    currency: 'AED',
    leadTime: 21,
    isPreferred: false,
    isActive: true,
    complianceStatus: 'CONDITIONAL',
    tags: ['Oud', 'Wild', 'Premium'],
    createdAt: '2024-01-20',
    updatedAt: '2024-03-05'
  }
]

const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterCompliance, setFilterCompliance] = useState<string>('ALL')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.country.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'ALL' || supplier.type === filterType
    const matchesCompliance = filterCompliance === 'ALL' || supplier.complianceStatus === filterCompliance

    return matchesSearch && matchesType && matchesCompliance
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LOCAL': return 'bg-green-100 text-green-800'
      case 'REGIONAL': return 'bg-blue-100 text-blue-800'
      case 'INTERNATIONAL': return 'bg-purple-100 text-purple-800'
      case 'MANUFACTURER': return 'bg-orange-100 text-orange-800'
      case 'DISTRIBUTOR': return 'bg-yellow-100 text-yellow-800'
      case 'AGENT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'CONDITIONAL': return 'bg-yellow-100 text-yellow-800'
      case 'PENDING': return 'bg-blue-100 text-blue-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const SupplierCard: React.FC<{ supplier: Supplier }> = ({ supplier }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{supplier.name}</h3>
              {supplier.nameAr && (
                <span className="text-sm text-gray-500 font-arabic">({supplier.nameAr})</span>
              )}
              {supplier.isPreferred && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Preferred
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{supplier.code} • {supplier.category}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {supplier.city}, {supplier.country}
              </div>
              {supplier.contactPerson && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {supplier.contactPerson}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Badge className={getTypeColor(supplier.type)}>
                {supplier.type}
              </Badge>
              <Badge className={getComplianceColor(supplier.complianceStatus)}>
                {supplier.complianceStatus}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(Math.floor(supplier.rating))}
              <span className="text-sm text-gray-600 ml-1">{supplier.rating}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{supplier.performanceScore}</div>
            <div className="text-xs text-gray-500">Performance Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{supplier.qualityScore}</div>
            <div className="text-xs text-gray-500">Quality Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{supplier.leadTime}d</div>
            <div className="text-xs text-gray-500">Lead Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {supplier.totalOrders > 0 ? Math.round((supplier.onTimeDeliveries / supplier.totalOrders) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500">On-Time Delivery</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {supplier.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {supplier.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{supplier.tags.length - 3} more
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedSupplier(supplier)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
          <p className="text-gray-600">Manage suppliers for perfume and oud raw materials</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Preferred Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {suppliers.filter(s => s.isPreferred).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">International</p>
                <p className="text-2xl font-bold text-gray-900">
                  {suppliers.filter(s => s.type === 'INTERNATIONAL').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(suppliers.reduce((acc, s) => acc + s.performanceScore, 0) / suppliers.length)}
                </p>
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
                  placeholder="Search suppliers by name, code, category, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="LOCAL">Local</option>
                <option value="REGIONAL">Regional</option>
                <option value="INTERNATIONAL">International</option>
                <option value="MANUFACTURER">Manufacturer</option>
                <option value="DISTRIBUTOR">Distributor</option>
                <option value="AGENT">Agent</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filterCompliance}
                onChange={(e) => setFilterCompliance(e.target.value)}
              >
                <option value="ALL">All Compliance</option>
                <option value="APPROVED">Approved</option>
                <option value="CONDITIONAL">Conditional</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Suppliers ({filteredSuppliers.length})
          </h2>
        </div>
        <div className="space-y-4">
          {filteredSuppliers.map(supplier => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      </div>

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new supplier.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SupplierManagement