'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Camera,
  Package,
  FileText,
  Star,
  Thermometer,
  Beaker,
  Microscope,
  Clipboard,
  Download,
  Upload,
  Edit,
  Plus,
  Filter,
  Calendar,
  User,
  Building
} from 'lucide-react'

interface QualityCheck {
  id: string
  goodsReceiptId: string
  goodsReceiptNo: string
  purchaseOrder: {
    poNumber: string
    supplier: {
      name: string
      code: string
    }
  }
  checkedBy: {
    id: string
    name: string
  }
  checkType: 'VISUAL' | 'FRAGRANCE' | 'CHEMICAL' | 'PACKAGING' | 'DOCUMENTATION' | 'COMPLETE'
  result: 'PASSED' | 'FAILED' | 'CONDITIONAL' | 'PENDING'

  // Specific Checks
  visualInspection?: string
  fragranceProfile?: string
  alcoholContent?: number
  purityTest?: string
  packagingCondition?: string

  // Results
  passed: boolean
  grade?: 'A_PREMIUM' | 'B_STANDARD' | 'C_BASIC' | 'REJECTED'

  notes?: string
  recommendations?: string

  checkDate: string
  createdAt: string

  // Related data
  material: {
    id: string
    code: string
    name: string
    category: string
  }
  quantity: {
    ordered: number
    received: number
    accepted: number
    rejected: number
    unit: string
  }
  batchInfo?: {
    batchNo: string
    expiryDate?: string
    origin: string
  }
}

interface QualityMetrics {
  totalChecks: number
  passRate: number
  pendingChecks: number
  failedChecks: number
  averageGrade: string
  topDefects: Array<{
    defect: string
    count: number
    percentage: number
  }>
}

interface QualityStandard {
  id: string
  materialCategory: string
  checkType: string
  criteria: string[]
  passingScore: number
  isActive: boolean
}

const mockQualityChecks: QualityCheck[] = [
  {
    id: '1',
    goodsReceiptId: 'GR-001',
    goodsReceiptNo: 'GR-2024-001',
    purchaseOrder: {
      poNumber: 'PO-2024-001',
      supplier: {
        name: 'Al Haramain Perfumes',
        code: 'SUP-001'
      }
    },
    checkedBy: {
      id: '1',
      name: 'Ahmed Hassan'
    },
    checkType: 'COMPLETE',
    result: 'PASSED',
    visualInspection: 'Excellent condition, no visible defects or contamination',
    fragranceProfile: 'Rich, complex oud aroma with woody undertones. Matches expected profile.',
    alcoholContent: 85.5,
    purityTest: 'High purity confirmed through GC-MS analysis',
    packagingCondition: 'Packaging intact, proper labeling, no damage',
    passed: true,
    grade: 'A_PREMIUM',
    notes: 'Exceptional quality batch from trusted supplier. Recommended for premium product line.',
    recommendations: 'Consider increasing order quantity for next batch',
    checkDate: '2024-03-17T10:30:00Z',
    createdAt: '2024-03-17T10:30:00Z',
    material: {
      id: '1',
      code: 'RM-OUD-001',
      name: 'Premium Cambodian Oud',
      category: 'Oud'
    },
    quantity: {
      ordered: 10,
      received: 10,
      accepted: 10,
      rejected: 0,
      unit: 'kg'
    },
    batchInfo: {
      batchNo: 'AH-OUD-240315',
      expiryDate: '2027-03-15',
      origin: 'Cambodia'
    }
  },
  {
    id: '2',
    goodsReceiptId: 'GR-002',
    goodsReceiptNo: 'GR-2024-002',
    purchaseOrder: {
      poNumber: 'PO-2024-003',
      supplier: {
        name: 'Cambodian Oud Traders',
        code: 'SUP-003'
      }
    },
    checkedBy: {
      id: '2',
      name: 'Sarah Ahmed'
    },
    checkType: 'DOCUMENTATION',
    result: 'CONDITIONAL',
    visualInspection: 'Good overall condition, minor packaging wear during transport',
    fragranceProfile: 'Strong oud scent, slightly different from previous batches',
    packagingCondition: 'Minor damage to outer packaging, inner packaging intact',
    passed: false,
    grade: 'B_STANDARD',
    notes: 'CITES documentation incomplete. Requires additional certification before acceptance.',
    recommendations: 'Request complete CITES documentation from supplier',
    checkDate: '2024-03-20T14:15:00Z',
    createdAt: '2024-03-20T14:15:00Z',
    material: {
      id: '3',
      code: 'RM-OUD-003',
      name: 'Wild Cambodian Oud',
      category: 'Oud'
    },
    quantity: {
      ordered: 50,
      received: 50,
      accepted: 0,
      rejected: 0,
      unit: 'kg'
    },
    batchInfo: {
      batchNo: 'COT-WILD-240318',
      origin: 'Cambodia'
    }
  },
  {
    id: '3',
    goodsReceiptId: 'GR-003',
    goodsReceiptNo: 'GR-2024-003',
    purchaseOrder: {
      poNumber: 'PO-2024-002',
      supplier: {
        name: 'Mysore Sandalwood Co.',
        code: 'SUP-002'
      }
    },
    checkedBy: {
      id: '1',
      name: 'Ahmed Hassan'
    },
    checkType: 'FRAGRANCE',
    result: 'PENDING',
    visualInspection: 'Good visual quality, consistent color and texture',
    fragranceProfile: 'Testing in progress - initial assessment shows good sandalwood characteristics',
    passed: false,
    checkDate: '2024-03-22T09:00:00Z',
    createdAt: '2024-03-22T09:00:00Z',
    material: {
      id: '4',
      code: 'RM-SANDAL-001',
      name: 'Mysore Sandalwood',
      category: 'Wood'
    },
    quantity: {
      ordered: 25,
      received: 25,
      accepted: 0,
      rejected: 0,
      unit: 'kg'
    },
    batchInfo: {
      batchNo: 'MSC-SAND-240320',
      origin: 'India'
    }
  }
]

const mockQualityMetrics: QualityMetrics = {
  totalChecks: 25,
  passRate: 88,
  pendingChecks: 3,
  failedChecks: 2,
  averageGrade: 'A-',
  topDefects: [
    { defect: 'Incomplete Documentation', count: 3, percentage: 30 },
    { defect: 'Packaging Damage', count: 2, percentage: 20 },
    { defect: 'Fragrance Deviation', count: 2, percentage: 20 },
    { defect: 'Moisture Content', count: 1, percentage: 10 },
    { defect: 'Color Variation', count: 1, percentage: 10 }
  ]
}

const mockQualityStandards: QualityStandard[] = [
  {
    id: '1',
    materialCategory: 'Oud',
    checkType: 'VISUAL',
    criteria: [
      'No visible mold or fungal growth',
      'Consistent color and texture',
      'No foreign particles or contamination',
      'Proper moisture content (8-12%)'
    ],
    passingScore: 85,
    isActive: true
  },
  {
    id: '2',
    materialCategory: 'Oud',
    checkType: 'FRAGRANCE',
    criteria: [
      'Characteristic oud aroma profile',
      'No off-odors or rancidity',
      'Intensity matches specification',
      'Consistency with previous batches'
    ],
    passingScore: 80,
    isActive: true
  },
  {
    id: '3',
    materialCategory: 'Essential Oils',
    checkType: 'CHEMICAL',
    criteria: [
      'Purity analysis via GC-MS',
      'Alcohol content within specifications',
      'No harmful contaminants',
      'Density and refractive index verification'
    ],
    passingScore: 95,
    isActive: true
  }
]

const QualityControl: React.FC = () => {
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>(mockQualityChecks)
  const [qualityMetrics] = useState<QualityMetrics>(mockQualityMetrics)
  const [qualityStandards] = useState<QualityStandard[]>(mockQualityStandards)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterResult, setFilterResult] = useState<string>('ALL')
  const [filterCheckType, setFilterCheckType] = useState<string>('ALL')
  const [selectedCheck, setSelectedCheck] = useState<QualityCheck | null>(null)

  const filteredChecks = qualityChecks.filter(check => {
    const matchesSearch =
      check.goodsReceiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.purchaseOrder.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.purchaseOrder.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.material.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesResult = filterResult === 'ALL' || check.result === filterResult
    const matchesCheckType = filterCheckType === 'ALL' || check.checkType === filterCheckType

    return matchesSearch && matchesResult && matchesCheckType
  })

  const getResultColor = (result: string) => {
    switch (result) {
      case 'PASSED': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'CONDITIONAL': return 'bg-yellow-100 text-yellow-800'
      case 'PENDING': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'PASSED': return <CheckCircle className="h-4 w-4" />
      case 'FAILED': return <XCircle className="h-4 w-4" />
      case 'CONDITIONAL': return <AlertTriangle className="h-4 w-4" />
      case 'PENDING': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'A_PREMIUM': return 'bg-green-100 text-green-800'
      case 'B_STANDARD': return 'bg-blue-100 text-blue-800'
      case 'C_BASIC': return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCheckTypeIcon = (checkType: string) => {
    switch (checkType) {
      case 'VISUAL': return <Eye className="h-4 w-4" />
      case 'FRAGRANCE': return <Thermometer className="h-4 w-4" />
      case 'CHEMICAL': return <Beaker className="h-4 w-4" />
      case 'PACKAGING': return <Package className="h-4 w-4" />
      case 'DOCUMENTATION': return <FileText className="h-4 w-4" />
      case 'COMPLETE': return <Clipboard className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const updateCheckResult = (id: string, result: QualityCheck['result']) => {
    setQualityChecks(prev => prev.map(check =>
      check.id === id ? { ...check, result, passed: result === 'PASSED' } : check
    ))
  }

  const QualityCheckCard: React.FC<{ check: QualityCheck }> = ({ check }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{check.goodsReceiptNo}</h3>
              <Badge className={getResultColor(check.result)}>
                {getResultIcon(check.result)}
                <span className="ml-1">{check.result}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {getCheckTypeIcon(check.checkType)}
                {check.checkType.replace('_', ' ')}
              </Badge>
              {check.grade && (
                <Badge className={getGradeColor(check.grade)}>
                  Grade {check.grade.split('_')[0]}
                </Badge>
              )}
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {check.purchaseOrder.poNumber}
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {check.purchaseOrder.supplier.name}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Checked by {check.checkedBy.name}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span>{check.material.name} ({check.material.code})</span>
                <span>•</span>
                <span>Received: {check.quantity.received} {check.quantity.unit}</span>
                <span>•</span>
                <span>Accepted: {check.quantity.accepted} {check.quantity.unit}</span>
                {check.quantity.rejected > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-red-600">Rejected: {check.quantity.rejected} {check.quantity.unit}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {new Date(check.checkDate).toLocaleDateString()}
            </div>
            {check.batchInfo && (
              <div className="text-sm text-gray-600">
                Batch: {check.batchInfo.batchNo}
              </div>
            )}
          </div>
        </div>

        {/* Quality Assessment Details */}
        {(check.visualInspection || check.fragranceProfile || check.packagingCondition) && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Quality Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {check.visualInspection && (
                <div>
                  <span className="font-medium text-gray-700">Visual:</span>
                  <p className="text-gray-600">{check.visualInspection}</p>
                </div>
              )}
              {check.fragranceProfile && (
                <div>
                  <span className="font-medium text-gray-700">Fragrance:</span>
                  <p className="text-gray-600">{check.fragranceProfile}</p>
                </div>
              )}
              {check.packagingCondition && (
                <div>
                  <span className="font-medium text-gray-700">Packaging:</span>
                  <p className="text-gray-600">{check.packagingCondition}</p>
                </div>
              )}
            </div>
            {check.alcoholContent && (
              <div className="mt-2 text-sm">
                <span className="font-medium text-gray-700">Alcohol Content:</span>
                <span className="ml-2">{check.alcoholContent}%</span>
              </div>
            )}
          </div>
        )}

        {/* Notes and Recommendations */}
        {(check.notes || check.recommendations) && (
          <div className="mb-4 space-y-2">
            {check.notes && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">{check.notes}</p>
              </div>
            )}
            {check.recommendations && (
              <div className="p-3 bg-green-50 rounded-md">
                <p className="text-sm text-green-800">
                  <strong>Recommendation:</strong> {check.recommendations}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {check.batchInfo && (
              <Badge variant="outline" className="text-xs">
                Origin: {check.batchInfo.origin}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedCheck(check)}>
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            {check.result === 'PENDING' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => updateCheckResult(check.id, 'PASSED')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => updateCheckResult(check.id, 'FAILED')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Report
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
          <h1 className="text-3xl font-bold text-gray-900">Quality Control</h1>
          <p className="text-gray-600">Incoming shipment quality inspection and compliance management</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Quality Check
        </Button>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Checks</p>
                <p className="text-2xl font-bold text-gray-900">{qualityMetrics.totalChecks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900">{qualityMetrics.passRate}%</p>
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
                <p className="text-2xl font-bold text-gray-900">{qualityMetrics.pendingChecks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Grade</p>
                <p className="text-2xl font-bold text-gray-900">{qualityMetrics.averageGrade}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="checks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checks">Quality Checks</TabsTrigger>
          <TabsTrigger value="standards">Quality Standards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="checks" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by receipt number, PO, supplier, or material..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={filterResult}
                    onChange={(e) => setFilterResult(e.target.value)}
                  >
                    <option value="ALL">All Results</option>
                    <option value="PASSED">Passed</option>
                    <option value="FAILED">Failed</option>
                    <option value="CONDITIONAL">Conditional</option>
                    <option value="PENDING">Pending</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={filterCheckType}
                    onChange={(e) => setFilterCheckType(e.target.value)}
                  >
                    <option value="ALL">All Check Types</option>
                    <option value="VISUAL">Visual</option>
                    <option value="FRAGRANCE">Fragrance</option>
                    <option value="CHEMICAL">Chemical</option>
                    <option value="PACKAGING">Packaging</option>
                    <option value="DOCUMENTATION">Documentation</option>
                    <option value="COMPLETE">Complete</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Checks List */}
          <div className="space-y-4">
            {filteredChecks.map(check => (
              <QualityCheckCard key={check.id} check={check} />
            ))}
          </div>

          {filteredChecks.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quality checks found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or create a new quality check.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="standards" className="space-y-6">
          <div className="space-y-4">
            {qualityStandards.map(standard => (
              <Card key={standard.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{standard.materialCategory} - {standard.checkType}</h3>
                      <p className="text-sm text-gray-600">Passing Score: {standard.passingScore}%</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={standard.isActive ? 'default' : 'secondary'}>
                        {standard.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Quality Criteria:</h4>
                    <ul className="space-y-1">
                      {standard.criteria.map((criterion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Defects */}
            <Card>
              <CardHeader>
                <CardTitle>Top Quality Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {qualityMetrics.topDefects.map((defect, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{defect.defect}</span>
                          <span className="text-sm text-gray-600">{defect.count} cases</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 bg-red-500 rounded-full"
                            style={{ width: `${defect.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{qualityMetrics.passRate}%</div>
                    <div className="text-gray-600">Overall Pass Rate</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{qualityMetrics.totalChecks}</div>
                      <div className="text-gray-600">Total Checks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">{qualityMetrics.failedChecks}</div>
                      <div className="text-gray-600">Failed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default QualityControl