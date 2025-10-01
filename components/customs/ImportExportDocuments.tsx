'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Download,
  Upload,
  Search,
  Globe,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Truck,
  Building,
  Calculator,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Copy
} from 'lucide-react'

interface HSCode {
  id: string
  code: string
  description: string
  dutyRate: number
  vatRate: number
  restrictions?: string
  documents: string[]
  isActive: boolean
  category: string
  subcategory?: string
  notes?: string
}

interface ImportDocument {
  id: string
  documentType: 'COMMERCIAL_INVOICE' | 'PACKING_LIST' | 'CERTIFICATE_ORIGIN' | 'IMPORT_LICENSE' | 'CUSTOMS_DECLARATION' | 'INSPECTION_CERTIFICATE' | 'INSURANCE_CERTIFICATE' | 'BILL_OF_LADING' | 'AIR_WAYBILL' | 'OTHER'
  shipmentId?: string
  shipmentNo?: string
  supplierName: string
  originCountry: string
  destinationCountry: string
  hsCode: string
  value: number
  currency: string
  weight: number
  quantity: number
  unit: string
  fileName: string
  fileUrl: string
  uploadedAt: string
  uploadedBy: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  validUntil?: string
  notes?: string
}

interface CustomsCalculation {
  itemValue: number
  hsCode: string
  dutyRate: number
  vatRate: number
  customsDuty: number
  vat: number
  totalTax: number
  totalValue: number
  currency: string
}

const mockHSCodes: HSCode[] = [
  {
    id: '1',
    code: '3303.00.10',
    description: 'Perfumes containing ethyl alcohol',
    dutyRate: 5,
    vatRate: 5,
    restrictions: 'Must comply with UAE standards for alcohol content',
    documents: ['COMMERCIAL_INVOICE', 'PACKING_LIST', 'CERTIFICATE_ORIGIN', 'INSPECTION_CERTIFICATE'],
    isActive: true,
    category: 'Perfumes & Cosmetics',
    subcategory: 'Alcoholic Perfumes',
    notes: 'Requires alcohol content verification'
  },
  {
    id: '2',
    code: '3303.00.90',
    description: 'Other perfumes and toilet waters',
    dutyRate: 5,
    vatRate: 5,
    documents: ['COMMERCIAL_INVOICE', 'PACKING_LIST', 'CERTIFICATE_ORIGIN'],
    isActive: true,
    category: 'Perfumes & Cosmetics',
    subcategory: 'Non-alcoholic Perfumes'
  },
  {
    id: '3',
    code: '1401.90.00',
    description: 'Vegetable materials for basketry or carving (including bamboo, rattan, oud wood)',
    dutyRate: 0,
    vatRate: 5,
    restrictions: 'CITES permit required for certain species',
    documents: ['COMMERCIAL_INVOICE', 'PACKING_LIST', 'CERTIFICATE_ORIGIN', 'IMPORT_LICENSE', 'INSPECTION_CERTIFICATE'],
    isActive: true,
    category: 'Raw Materials',
    subcategory: 'Wood & Plant Materials',
    notes: 'Requires CITES documentation for endangered species'
  },
  {
    id: '4',
    code: '4401.22.00',
    description: 'Non-coniferous wood, in chips or particles',
    dutyRate: 0,
    vatRate: 5,
    documents: ['COMMERCIAL_INVOICE', 'PACKING_LIST', 'CERTIFICATE_ORIGIN'],
    isActive: true,
    category: 'Raw Materials',
    subcategory: 'Wood Products'
  },
  {
    id: '5',
    code: '3301.90.90',
    description: 'Other essential oils',
    dutyRate: 5,
    vatRate: 5,
    documents: ['COMMERCIAL_INVOICE', 'PACKING_LIST', 'CERTIFICATE_ORIGIN', 'INSPECTION_CERTIFICATE'],
    isActive: true,
    category: 'Essential Oils',
    notes: 'Quality certification recommended'
  }
]

const mockDocuments: ImportDocument[] = [
  {
    id: '1',
    documentType: 'COMMERCIAL_INVOICE',
    shipmentId: '1',
    shipmentNo: 'SH-2024-001',
    supplierName: 'Al Haramain Perfumes',
    originCountry: 'UAE',
    destinationCountry: 'UAE',
    hsCode: '3303.00.90',
    value: 15000,
    currency: 'AED',
    weight: 25.5,
    quantity: 120,
    unit: 'bottles',
    fileName: 'Commercial_Invoice_SH-2024-001.pdf',
    fileUrl: '/documents/invoices/CI-001.pdf',
    uploadedAt: '2024-03-15T10:00:00Z',
    uploadedBy: 'Sarah Ahmed',
    status: 'APPROVED',
    validUntil: '2024-06-15'
  },
  {
    id: '2',
    documentType: 'IMPORT_LICENSE',
    shipmentId: '2',
    shipmentNo: 'SH-2024-002',
    supplierName: 'Cambodian Oud Traders',
    originCountry: 'Cambodia',
    destinationCountry: 'UAE',
    hsCode: '1401.90.00',
    value: 29500,
    currency: 'AED',
    weight: 45.2,
    quantity: 50,
    unit: 'kg',
    fileName: 'Import_License_KH-2024-001.pdf',
    fileUrl: '/documents/licenses/IL-001.pdf',
    uploadedAt: '2024-03-18T14:30:00Z',
    uploadedBy: 'Ahmed Hassan',
    status: 'SUBMITTED',
    validUntil: '2024-12-31',
    notes: 'CITES permit included for endangered wood species'
  },
  {
    id: '3',
    documentType: 'CUSTOMS_DECLARATION',
    shipmentId: '3',
    shipmentNo: 'SH-2024-003',
    supplierName: 'Mysore Sandalwood Co.',
    originCountry: 'India',
    destinationCountry: 'UAE',
    hsCode: '4401.22.00',
    value: 12000,
    currency: 'AED',
    weight: 125.5,
    quantity: 200,
    unit: 'kg',
    fileName: 'Customs_Declaration_IN-2024-001.pdf',
    fileUrl: '/documents/customs/CD-001.pdf',
    uploadedAt: '2024-03-20T09:15:00Z',
    uploadedBy: 'Mohammed Al-Rashid',
    status: 'DRAFT'
  }
]

const ImportExportDocuments: React.FC = () => {
  const [hsCodes, setHSCodes] = useState<HSCode[]>(mockHSCodes)
  const [documents, setDocuments] = useState<ImportDocument[]>(mockDocuments)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [selectedTab, setSelectedTab] = useState('hscodes')
  const [calculatorData, setCalculatorData] = useState({
    value: 0,
    hsCode: '',
    dutyRate: 0,
    vatRate: 5
  })

  const filteredHSCodes = hsCodes.filter(code => {
    const matchesSearch =
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === 'ALL' || code.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.shipmentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.hsCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'ALL' || doc.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />
      case 'SUBMITTED': return <Clock className="h-4 w-4" />
      case 'DRAFT': return <FileText className="h-4 w-4" />
      case 'REJECTED': return <AlertCircle className="h-4 w-4" />
      case 'EXPIRED': return <AlertCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'COMMERCIAL_INVOICE': 'Commercial Invoice',
      'PACKING_LIST': 'Packing List',
      'CERTIFICATE_ORIGIN': 'Certificate of Origin',
      'IMPORT_LICENSE': 'Import License',
      'CUSTOMS_DECLARATION': 'Customs Declaration',
      'INSPECTION_CERTIFICATE': 'Inspection Certificate',
      'INSURANCE_CERTIFICATE': 'Insurance Certificate',
      'BILL_OF_LADING': 'Bill of Lading',
      'AIR_WAYBILL': 'Air Waybill',
      'OTHER': 'Other Document'
    }
    return labels[type] || type
  }

  const calculateCustoms = (value: number, hsCode: string): CustomsCalculation => {
    const selectedHSCode = hsCodes.find(code => code.code === hsCode)
    const dutyRate = selectedHSCode?.dutyRate || 0
    const vatRate = selectedHSCode?.vatRate || 5

    const customsDuty = (value * dutyRate) / 100
    const dutiableValue = value + customsDuty
    const vat = (dutiableValue * vatRate) / 100
    const totalTax = customsDuty + vat
    const totalValue = value + totalTax

    return {
      itemValue: value,
      hsCode,
      dutyRate,
      vatRate,
      customsDuty,
      vat,
      totalTax,
      totalValue,
      currency: 'AED'
    }
  }

  const categories = [...new Set(hsCodes.map(code => code.category))]
  const documentCounts = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'APPROVED').length,
    submitted: documents.filter(d => d.status === 'SUBMITTED').length,
    draft: documents.filter(d => d.status === 'DRAFT').length,
  }

  const HSCodeCard: React.FC<{ hsCode: HSCode }> = ({ hsCode }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold font-mono">{hsCode.code}</h3>
              <Badge variant="outline">{hsCode.category}</Badge>
              {hsCode.restrictions && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Restricted
                </Badge>
              )}
            </div>
            <p className="text-gray-700 mb-3">{hsCode.description}</p>
            {hsCode.subcategory && (
              <p className="text-sm text-gray-600 mb-2">Subcategory: {hsCode.subcategory}</p>
            )}
            {hsCode.restrictions && (
              <div className="bg-yellow-50 p-3 rounded-md mb-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Restrictions</p>
                    <p className="text-sm text-yellow-800">{hsCode.restrictions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-gray-600">Duty:</span>
                <span className="font-semibold ml-1">{hsCode.dutyRate}%</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">VAT:</span>
                <span className="font-semibold ml-1">{hsCode.vatRate}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Required Documents:</p>
            <div className="flex flex-wrap gap-2">
              {hsCode.documents.map((doc, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {getDocumentTypeLabel(doc)}
                </Badge>
              ))}
            </div>
          </div>

          {hsCode.notes && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">{hsCode.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => {
              setCalculatorData(prev => ({ ...prev, hsCode: hsCode.code, dutyRate: hsCode.dutyRate, vatRate: hsCode.vatRate }))
              setSelectedTab('calculator')
            }}>
              <Calculator className="h-4 w-4 mr-1" />
              Calculate
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Copy className="h-4 w-4 mr-1" />
              Copy Code
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

  const DocumentCard: React.FC<{ document: ImportDocument }> = ({ document }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{getDocumentTypeLabel(document.documentType)}</h3>
              <Badge className={getStatusColor(document.status)}>
                {getStatusIcon(document.status)}
                <span className="ml-1">{document.status}</span>
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {document.shipmentNo}
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {document.supplierName}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {document.originCountry} → {document.destinationCountry}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span>HS Code: {document.hsCode}</span>
                <span>Value: {document.currency} {document.value.toLocaleString()}</span>
                <span>Weight: {document.weight} kg</span>
                <span>Qty: {document.quantity} {document.unit}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">
              By: {document.uploadedBy}
            </div>
            {document.validUntil && (
              <div className="text-sm text-gray-600">
                Valid until: {new Date(document.validUntil).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {document.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{document.notes}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            File: {document.fileName}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            {document.status === 'DRAFT' && (
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit
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
          <h1 className="text-3xl font-bold text-gray-900">Import/Export Documentation</h1>
          <p className="text-gray-600">Manage HS codes, customs documentation, and UAE compliance requirements</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{documentCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{documentCounts.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{documentCounts.submitted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">HS Codes</p>
                <p className="text-2xl font-bold text-gray-900">{hsCodes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hscodes">HS Codes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="calculator">Duty Calculator</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="hscodes" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search HS codes, descriptions, or categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HS Codes List */}
          <div className="space-y-4">
            {filteredHSCodes.map(hsCode => (
              <HSCodeCard key={hsCode.id} hsCode={hsCode} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search documents by shipment, supplier, or HS code..."
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
                    <option value="APPROVED">Approved</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="DRAFT">Draft</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.map(document => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                UAE Customs Duty Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HS Code</label>
                    <Input
                      placeholder="Enter HS code (e.g., 3303.00.90)"
                      value={calculatorData.hsCode}
                      onChange={(e) => {
                        const hsCode = e.target.value
                        const selectedHSCode = hsCodes.find(code => code.code === hsCode)
                        setCalculatorData(prev => ({
                          ...prev,
                          hsCode,
                          dutyRate: selectedHSCode?.dutyRate || 0,
                          vatRate: selectedHSCode?.vatRate || 5
                        }))
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Value (AED)</label>
                    <Input
                      type="number"
                      placeholder="Enter item value"
                      value={calculatorData.value || ''}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duty Rate (%)</label>
                      <Input
                        type="number"
                        value={calculatorData.dutyRate}
                        onChange={(e) => setCalculatorData(prev => ({ ...prev, dutyRate: parseFloat(e.target.value) || 0 }))}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">VAT Rate (%)</label>
                      <Input
                        type="number"
                        value={calculatorData.vatRate}
                        onChange={(e) => setCalculatorData(prev => ({ ...prev, vatRate: parseFloat(e.target.value) || 0 }))}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Calculation Results</h3>
                  {calculatorData.value > 0 && calculatorData.hsCode ? (
                    <div className="space-y-3">
                      {(() => {
                        const calc = calculateCustoms(calculatorData.value, calculatorData.hsCode)
                        return (
                          <>
                            <div className="flex justify-between">
                              <span>Item Value:</span>
                              <span className="font-medium">AED {calc.itemValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Customs Duty ({calc.dutyRate}%):</span>
                              <span className="font-medium">AED {calc.customsDuty.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>VAT ({calc.vatRate}%):</span>
                              <span className="font-medium">AED {calc.vat.toLocaleString()}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between">
                              <span>Total Tax:</span>
                              <span className="font-semibold">AED {calc.totalTax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg">
                              <span className="font-semibold">Total Value:</span>
                              <span className="font-bold text-blue-600">AED {calc.totalValue.toLocaleString()}</span>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  ) : (
                    <p className="text-gray-500">Enter item value and HS code to calculate duties and taxes.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  UAE Customs Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Essential Documents</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Commercial Invoice
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Packing List
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Certificate of Origin
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Bill of Lading / Air Waybill
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Special Requirements</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      CITES permit for endangered species
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      Import license for restricted items
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      Quality certificates for cosmetics
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Country-Specific Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">India</h4>
                  <p className="text-sm text-gray-700">
                    Requires additional documentation for sandalwood exports.
                    Forest clearance certificate may be required.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cambodia</h4>
                  <p className="text-sm text-gray-700">
                    CITES permit mandatory for oud wood exports.
                    Pre-approval required from UAE authorities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">France</h4>
                  <p className="text-sm text-gray-700">
                    EU origin certificates required.
                    Additional quality documentation for perfume ingredients.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Before Import</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Verify HS code classification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Check for import restrictions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Obtain required licenses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Calculate duties and taxes</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Upon Arrival</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Submit customs declaration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Pay duties and taxes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Arrange inspection if required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Obtain release order</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ImportExportDocuments