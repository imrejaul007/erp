'use client'

import React, { useState, useMemo } from 'react'
import { useInventoryStore } from '@/store/inventory-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
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
import { QRCodeSVG } from 'qrcode.react'
import {
  Search,
  Filter,
  Plus,
  QrCode,
  Package2,
  Calendar,
  MapPin,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  BarChart3,
  FileText,
  RefreshCw,
  Download,
  Printer,
  Eye,
  Star,
  Flame,
  Mountain,
  Droplets,
  Trophy,
  Target,
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { ar } from 'date-fns/locale'

// UAE-specific enhancements for Oud & Perfume industry
interface EnhancedBatch {
  id: string
  batchNumber: string
  qrCode: string
  materialId: string
  material: {
    id: string
    name: string
    nameArabic: string
    category: string
    type: 'oud' | 'attar' | 'perfume_oil' | 'alcohol' | 'bottle' | 'packaging' | 'other'
    origin: string
    grade: 'Premium' | 'Royal' | 'Super' | 'Regular' | 'Commercial'
    purity: number // percentage
  }
  quantity: number
  currentStock: number
  unit: string
  costPerUnit: number
  totalValue: number
  supplierInfo: {
    name: string
    nameArabic: string
    country: string
    certification: string[]
    contactInfo: string
  }
  qualityMetrics: {
    purity: number
    density: number
    viscosity?: number
    color: string
    aroma: {
      topNotes: string[]
      middleNotes: string[]
      baseNotes: string[]
      intensity: number // 1-10
    }
    testResults: {
      testDate: Date
      testedBy: string
      gcmsReport?: string // URL to report
      allergenTest?: string
      microbiologyTest?: string
      passed: boolean
    }[]
  }
  agingInfo?: {
    startDate: Date
    targetDuration: number // days
    currentAge: number // days
    agingType: 'natural' | 'accelerated' | 'none'
    conditions: {
      temperature: number
      humidity: number
      environment: string
    }
    milestones: {
      date: Date
      notes: string
      qualityCheck: boolean
    }[]
  }
  origin: string
  grade: string
  receivedDate: Date
  expiryDate?: Date
  manufacturingDate?: Date
  location: string
  storageConditions?: string
  isExpired: boolean
  qualityNotes?: string
  certifications: string[]
  barcodes: {
    ean13?: string
    upc?: string
    custom: string
  }
  complianceInfo: {
    uaeStandards: boolean
    gccApproval: boolean
    halalCertified: boolean
    isoCertified: boolean
    msdsAvailable: boolean
    customsCode?: string
  }
}

interface EnhancedBatchTrackingProps {
  materialId?: string
  onSelectBatch?: (batch: EnhancedBatch) => void
  onAddBatch?: () => void
  showActions?: boolean
  compact?: boolean
}

const GRADE_COLORS = {
  Premium: 'bg-purple-100 text-purple-800 border-purple-200',
  Royal: 'bg-gold-100 text-gold-800 border-gold-200',
  Super: 'bg-blue-100 text-blue-800 border-blue-200',
  Regular: 'bg-green-100 text-green-800 border-green-200',
  Commercial: 'bg-gray-100 text-gray-800 border-gray-200',
}

const GRADE_ICONS = {
  Premium: Trophy,
  Royal: Star,
  Super: Target,
  Regular: Mountain,
  Commercial: Package2,
}

const UAE_EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain'
]

const OUD_ORIGINS = [
  'Assam (India)',
  'Cambodia',
  'Laos',
  'Vietnam',
  'Bangladesh',
  'Myanmar',
  'Borneo',
  'Irian Jaya',
  'Papua New Guinea'
]

const PERFUME_ORIGINS = [
  'France (Grasse)',
  'Bulgaria',
  'Turkey',
  'India (Kannauj)',
  'Morocco',
  'Egypt',
  'Iran',
  'Oman',
  'UAE'
]

export function EnhancedBatchTracking({
  materialId,
  onSelectBatch,
  onAddBatch,
  showActions = true,
  compact = false,
}: EnhancedBatchTrackingProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBatch, setSelectedBatch] = useState<EnhancedBatch | null>(null)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [filters, setFilters] = useState({
    grade: '',
    origin: '',
    emirate: '',
    expiryStatus: '',
    certificationStatus: '',
    agingStatus: '',
  })

  // Mock data - in real app, this would come from API
  const batches: EnhancedBatch[] = [
    {
      id: '1',
      batchNumber: 'OUD-2024-001',
      qrCode: 'QR-OUD-2024-001',
      materialId: 'mat_001',
      material: {
        id: 'mat_001',
        name: 'Royal Cambodian Oud',
        nameArabic: 'عود كمبودي ملكي',
        category: 'Oud Oil',
        type: 'oud',
        origin: 'Cambodia',
        grade: 'Royal',
        purity: 98.5,
      },
      quantity: 1000,
      currentStock: 850,
      unit: 'tola',
      costPerUnit: 1200,
      totalValue: 1020000,
      supplierInfo: {
        name: 'Cambodian Oud House',
        nameArabic: 'بيت العود الكمبودي',
        country: 'Cambodia',
        certification: ['ISO 9001', 'Halal Certificate', 'GCC Approval'],
        contactInfo: '+855 12 345 678',
      },
      qualityMetrics: {
        purity: 98.5,
        density: 0.87,
        viscosity: 12.5,
        color: 'Dark Brown',
        aroma: {
          topNotes: ['Honey', 'Floral'],
          middleNotes: ['Woody', 'Animalic'],
          baseNotes: ['Musky', 'Sweet'],
          intensity: 9,
        },
        testResults: [
          {
            testDate: new Date('2024-09-01'),
            testedBy: 'UAE Lab Services',
            gcmsReport: '/reports/gcms-001.pdf',
            allergenTest: '/reports/allergen-001.pdf',
            passed: true,
          }
        ],
      },
      agingInfo: {
        startDate: new Date('2024-01-15'),
        targetDuration: 365,
        currentAge: 258,
        agingType: 'natural',
        conditions: {
          temperature: 25,
          humidity: 60,
          environment: 'Climate Controlled Warehouse',
        },
        milestones: [
          {
            date: new Date('2024-04-15'),
            notes: 'Initial aging phase complete - aroma developing well',
            qualityCheck: true,
          },
          {
            date: new Date('2024-07-15'),
            notes: 'Mid-aging assessment - excellent maturation',
            qualityCheck: true,
          }
        ],
      },
      origin: 'Cambodia',
      grade: 'Royal',
      receivedDate: new Date('2024-01-10'),
      expiryDate: new Date('2029-01-10'),
      manufacturingDate: new Date('2023-12-15'),
      location: 'Dubai Warehouse A1-B2',
      storageConditions: 'Temperature: 22-25°C, Humidity: 55-65%, No Direct Light',
      isExpired: false,
      qualityNotes: 'Exceptional quality batch from premium plantation. Showing excellent aging characteristics.',
      certifications: ['Halal', 'GCC Approved', 'ISO Certified', 'Organic'],
      barcodes: {
        ean13: '6789012345678',
        custom: 'OUD-CAM-2024-001',
      },
      complianceInfo: {
        uaeStandards: true,
        gccApproval: true,
        halalCertified: true,
        isoCertified: true,
        msdsAvailable: true,
        customsCode: '33019900',
      },
    },
    {
      id: '2',
      batchNumber: 'ATR-2024-015',
      qrCode: 'QR-ATR-2024-015',
      materialId: 'mat_002',
      material: {
        id: 'mat_002',
        name: 'Rose Attar Premium',
        nameArabic: 'عطر الورد الممتاز',
        category: 'Attar',
        type: 'attar',
        origin: 'Bulgaria',
        grade: 'Premium',
        purity: 95.0,
      },
      quantity: 500,
      currentStock: 320,
      unit: 'tola',
      costPerUnit: 800,
      totalValue: 256000,
      supplierInfo: {
        name: 'Bulgarian Rose Valley',
        nameArabic: 'وادي الورد البلغاري',
        country: 'Bulgaria',
        certification: ['EU Organic', 'Halal Certificate'],
        contactInfo: '+359 88 123 4567',
      },
      qualityMetrics: {
        purity: 95.0,
        density: 0.85,
        color: 'Deep Red',
        aroma: {
          topNotes: ['Fresh Rose', 'Citrus'],
          middleNotes: ['Damask Rose', 'Floral'],
          baseNotes: ['Musky', 'Woody'],
          intensity: 8,
        },
        testResults: [
          {
            testDate: new Date('2024-09-05'),
            testedBy: 'Dubai Quality Lab',
            gcmsReport: '/reports/gcms-002.pdf',
            passed: true,
          }
        ],
      },
      origin: 'Bulgaria',
      grade: 'Premium',
      receivedDate: new Date('2024-09-01'),
      expiryDate: new Date('2027-09-01'),
      manufacturingDate: new Date('2024-08-15'),
      location: 'Abu Dhabi Warehouse C3-D4',
      storageConditions: 'Temperature: 20-23°C, Humidity: 50-60%',
      isExpired: false,
      qualityNotes: 'Premium rose attar with excellent longevity and projection.',
      certifications: ['Halal', 'EU Organic', 'GMP Certified'],
      barcodes: {
        ean13: '6789012345679',
        custom: 'ATR-BGR-2024-015',
      },
      complianceInfo: {
        uaeStandards: true,
        gccApproval: true,
        halalCertified: true,
        isoCertified: false,
        msdsAvailable: true,
        customsCode: '33019100',
      },
    },
  ]

  // Filter and sort batches
  const filteredBatches = useMemo(() => {
    return batches.filter(batch => {
      const matchesSearch = !searchTerm ||
        batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.material.nameArabic.includes(searchTerm) ||
        batch.origin.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesGrade = !filters.grade || batch.grade === filters.grade
      const matchesOrigin = !filters.origin || batch.origin === filters.origin

      return matchesSearch && matchesGrade && matchesOrigin
    })
  }, [batches, searchTerm, filters])

  // Generate QR code data
  const generateQRData = (batch: EnhancedBatch) => {
    return JSON.stringify({
      batchNumber: batch.batchNumber,
      material: batch.material.name,
      materialArabic: batch.material.nameArabic,
      grade: batch.grade,
      origin: batch.origin,
      receivedDate: batch.receivedDate.toISOString(),
      expiryDate: batch.expiryDate?.toISOString(),
      certifications: batch.certifications,
      supplier: batch.supplierInfo.name,
      url: `${window.location.origin}/batch/${batch.id}`,
    })
  }

  // Print batch label with QR code
  const printBatchLabel = (batch: EnhancedBatch) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const qrData = generateQRData(batch)

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>Batch Label - ${batch.batchNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
          .label { border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
          .arabic { font-size: 16px; font-weight: bold; margin: 10px 0; }
          .english { font-size: 14px; margin: 5px 0; }
          .qr-code { margin: 15px 0; }
          .batch-info { text-align: left; margin: 15px 0; }
          .grade { font-weight: bold; color: #8B5CF6; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="label">
          <div class="arabic">${batch.material.nameArabic}</div>
          <div class="english">${batch.material.name}</div>
          <div class="batch-info">
            <div><strong>Batch:</strong> ${batch.batchNumber}</div>
            <div><strong>Grade:</strong> <span class="grade">${batch.grade}</span></div>
            <div><strong>Origin:</strong> ${batch.origin}</div>
            <div><strong>Received:</strong> ${format(batch.receivedDate, 'dd/MM/yyyy')}</div>
            ${batch.expiryDate ? `<div><strong>Expires:</strong> ${format(batch.expiryDate, 'dd/MM/yyyy')}</div>` : ''}
            <div><strong>Stock:</strong> ${batch.currentStock} ${batch.unit}</div>
          </div>
          <div class="qr-code">
            <svg width="100" height="100" id="qr-${batch.id}"></svg>
          </div>
          <div class="english" style="font-size: 12px;">
            ${batch.certifications.join(' • ')}
          </div>
        </div>
      </body>
      </html>
    `)

    // Note: In a real implementation, you'd need to include QR code generation library
    // For now, this is a placeholder for the print functionality
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  const exportBatchData = () => {
    const csvData = [
      ['Batch Number', 'Material (English)', 'Material (Arabic)', 'Grade', 'Origin', 'Current Stock', 'Unit', 'Value (AED)', 'Received Date', 'Expiry Date', 'Location', 'Certifications'],
      ...filteredBatches.map(batch => [
        batch.batchNumber,
        batch.material.name,
        batch.material.nameArabic,
        batch.grade,
        batch.origin,
        batch.currentStock.toString(),
        batch.unit,
        batch.totalValue.toString(),
        format(batch.receivedDate, 'yyyy-MM-dd'),
        batch.expiryDate ? format(batch.expiryDate, 'yyyy-MM-dd') : 'N/A',
        batch.location,
        batch.certifications.join('; ')
      ])
    ]

    const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `batch-inventory-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enhanced Batch Tracking</h2>
          <p className="text-muted-foreground">
            Track Oud, Attar & Perfume batches with UAE compliance
          </p>
        </div>
        {showActions && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportBatchData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={onAddBatch}>
              <Plus className="h-4 w-4 mr-2" />
              Add Batch
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search batches... (English/Arabic)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <Select value={filters.grade} onValueChange={(value) => setFilters(prev => ({ ...prev, grade: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Grades</SelectItem>
                <SelectItem value="Royal">Royal</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Super">Super</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.origin} onValueChange={(value) => setFilters(prev => ({ ...prev, origin: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Origins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Origins</SelectItem>
                {[...OUD_ORIGINS, ...PERFUME_ORIGINS].map(origin => (
                  <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.certificationStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, certificationStatus: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Certification Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Certifications</SelectItem>
                <SelectItem value="halal">Halal Certified</SelectItem>
                <SelectItem value="gcc">GCC Approved</SelectItem>
                <SelectItem value="iso">ISO Certified</SelectItem>
                <SelectItem value="organic">Organic Certified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.agingStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, agingStatus: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Aging Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Aging Status</SelectItem>
                <SelectItem value="aging">Currently Aging</SelectItem>
                <SelectItem value="matured">Fully Matured</SelectItem>
                <SelectItem value="none">No Aging Required</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="batches" className="w-full">
            <TabsList>
              <TabsTrigger value="batches">All Batches</TabsTrigger>
              <TabsTrigger value="aging">Aging Process</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
            </TabsList>

            <TabsContent value="batches" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Info</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Grade & Origin</TableHead>
                      <TableHead>Stock & Value</TableHead>
                      <TableHead>Aging Status</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.map((batch) => {
                      const GradeIcon = GRADE_ICONS[batch.grade as keyof typeof GRADE_ICONS]
                      const isAging = batch.agingInfo && batch.agingInfo.currentAge < batch.agingInfo.targetDuration

                      return (
                        <TableRow key={batch.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <QrCode className="h-8 w-8 text-muted-foreground cursor-pointer hover:text-primary"
                                  onClick={() => {
                                    setSelectedBatch(batch)
                                    setShowQRDialog(true)
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">{batch.batchNumber}</div>
                                <div className="text-sm text-muted-foreground">
                                  {format(batch.receivedDate, 'MMM dd, yyyy')}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Location: {batch.location}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <div className="font-medium">{batch.material.name}</div>
                              <div className="text-sm text-muted-foreground" dir="rtl">
                                {batch.material.nameArabic}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Purity: {batch.material.purity}%
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <GradeIcon className="h-4 w-4" />
                                <Badge variant="outline" className={GRADE_COLORS[batch.grade as keyof typeof GRADE_COLORS]}>
                                  {batch.grade}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {batch.origin}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {batch.currentStock.toLocaleString()} / {batch.quantity.toLocaleString()} {batch.unit}
                              </div>
                              <Progress value={(batch.currentStock / batch.quantity) * 100} className="h-1" />
                              <div className="text-sm font-medium text-green-600">
                                AED {batch.totalValue.toLocaleString()}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            {batch.agingInfo ? (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-xs">
                                    {isAging ? 'Aging' : 'Matured'}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {batch.agingInfo.currentAge} / {batch.agingInfo.targetDuration} days
                                </div>
                                <Progress
                                  value={(batch.agingInfo.currentAge / batch.agingInfo.targetDuration) * 100}
                                  className="h-1"
                                />
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">No aging required</span>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {batch.certifications.slice(0, 2).map(cert => (
                                <Badge key={cert} variant="secondary" className="text-xs">
                                  {cert}
                                </Badge>
                              ))}
                              {batch.certifications.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{batch.certifications.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => printBatchLabel(batch)}
                              >
                                <Printer className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedBatch(batch)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="aging" className="space-y-4">
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Monitor aging progress for Oud and other materials requiring maturation.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBatches.filter(b => b.agingInfo).map(batch => (
                  <Card key={batch.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{batch.batchNumber}</CardTitle>
                      <CardDescription>{batch.material.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Aging Progress</span>
                          <span>{batch.agingInfo!.currentAge} / {batch.agingInfo!.targetDuration} days</span>
                        </div>
                        <Progress
                          value={(batch.agingInfo!.currentAge / batch.agingInfo!.targetDuration) * 100}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          <div>Type: {batch.agingInfo!.agingType}</div>
                          <div>Temperature: {batch.agingInfo!.conditions.temperature}°C</div>
                          <div>Humidity: {batch.agingInfo!.conditions.humidity}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredBatches.map(batch => (
                  <Card key={batch.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{batch.batchNumber}</CardTitle>
                      <CardDescription>{batch.material.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">UAE Standards</span>
                          <Badge variant={batch.complianceInfo.uaeStandards ? 'default' : 'destructive'}>
                            {batch.complianceInfo.uaeStandards ? 'Compliant' : 'Non-compliant'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">GCC Approval</span>
                          <Badge variant={batch.complianceInfo.gccApproval ? 'default' : 'destructive'}>
                            {batch.complianceInfo.gccApproval ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Halal Certified</span>
                          <Badge variant={batch.complianceInfo.halalCertified ? 'default' : 'secondary'}>
                            {batch.complianceInfo.halalCertified ? 'Certified' : 'Not Required'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">MSDS Available</span>
                          <Badge variant={batch.complianceInfo.msdsAvailable ? 'default' : 'destructive'}>
                            {batch.complianceInfo.msdsAvailable ? 'Available' : 'Missing'}
                          </Badge>
                        </div>
                        {batch.complianceInfo.customsCode && (
                          <div className="text-xs text-muted-foreground pt-2 border-t">
                            Customs Code: {batch.complianceInfo.customsCode}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Batch QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code for complete batch information
            </DialogDescription>
          </DialogHeader>

          {selectedBatch && (
            <div className="flex flex-col items-center space-y-4">
              <QRCodeSVG
                value={generateQRData(selectedBatch)}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                includeMargin={true}
              />

              <div className="text-center space-y-1">
                <div className="font-medium">{selectedBatch.batchNumber}</div>
                <div className="text-sm text-muted-foreground">{selectedBatch.material.name}</div>
                <div className="text-xs text-muted-foreground" dir="rtl">{selectedBatch.material.nameArabic}</div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => printBatchLabel(selectedBatch)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Label
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detailed Batch View Dialog */}
      {selectedBatch && !showQRDialog && (
        <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package2 className="h-5 w-5" />
                Batch Details: {selectedBatch.batchNumber}
              </DialogTitle>
              <DialogDescription>
                Complete information about this batch with UAE compliance details
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General Info</TabsTrigger>
                <TabsTrigger value="quality">Quality & Testing</TabsTrigger>
                <TabsTrigger value="aging">Aging Process</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Material Information</h4>
                      <p className="text-lg font-medium">{selectedBatch.material.name}</p>
                      <p className="text-sm text-muted-foreground" dir="rtl">{selectedBatch.material.nameArabic}</p>
                      <p className="text-sm text-muted-foreground">Type: {selectedBatch.material.type}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Stock Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Current Stock:</span>
                          <span className="font-medium">{selectedBatch.currentStock} {selectedBatch.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Original Quantity:</span>
                          <span>{selectedBatch.quantity} {selectedBatch.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Value:</span>
                          <span className="font-medium text-green-600">AED {selectedBatch.totalValue.toLocaleString()}</span>
                        </div>
                        <Progress value={(selectedBatch.currentStock / selectedBatch.quantity) * 100} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Supplier Information</h4>
                      <div className="space-y-1">
                        <p className="font-medium">{selectedBatch.supplierInfo.name}</p>
                        <p className="text-sm text-muted-foreground" dir="rtl">{selectedBatch.supplierInfo.nameArabic}</p>
                        <p className="text-sm">Country: {selectedBatch.supplierInfo.country}</p>
                        <p className="text-sm">Contact: {selectedBatch.supplierInfo.contactInfo}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedBatch.supplierInfo.certification.map(cert => (
                            <Badge key={cert} variant="secondary" className="text-xs">{cert}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Dates & Location</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Received: {format(selectedBatch.receivedDate, 'PPP')}</span>
                        </div>
                        {selectedBatch.manufacturingDate && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Manufactured: {format(selectedBatch.manufacturingDate, 'PPP')}</span>
                          </div>
                        )}
                        {selectedBatch.expiryDate && (
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">Expires: {format(selectedBatch.expiryDate, 'PPP')}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">Location: {selectedBatch.location}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Storage Conditions</h4>
                      <p className="text-sm">{selectedBatch.storageConditions}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Barcodes & Identifiers</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">EAN-13:</span>
                          <span className="font-mono text-sm">{selectedBatch.barcodes.ean13}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Custom Code:</span>
                          <span className="font-mono text-sm">{selectedBatch.barcodes.custom}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="quality" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Quality Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Purity:</span>
                          <span className="font-medium">{selectedBatch.qualityMetrics.purity}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Density:</span>
                          <span>{selectedBatch.qualityMetrics.density} g/ml</span>
                        </div>
                        {selectedBatch.qualityMetrics.viscosity && (
                          <div className="flex justify-between">
                            <span>Viscosity:</span>
                            <span>{selectedBatch.qualityMetrics.viscosity} cP</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Color:</span>
                          <span>{selectedBatch.qualityMetrics.color}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Aroma Profile</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-muted-foreground">Top Notes:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedBatch.qualityMetrics.aroma.topNotes.map(note => (
                              <Badge key={note} variant="outline" className="text-xs">{note}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Middle Notes:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedBatch.qualityMetrics.aroma.middleNotes.map(note => (
                              <Badge key={note} variant="outline" className="text-xs">{note}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Base Notes:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedBatch.qualityMetrics.aroma.baseNotes.map(note => (
                              <Badge key={note} variant="outline" className="text-xs">{note}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">Intensity:</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(10)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-2 w-2 rounded-full ${
                                  i < selectedBatch.qualityMetrics.aroma.intensity ? 'bg-primary' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                            <span className="text-xs ml-2">{selectedBatch.qualityMetrics.aroma.intensity}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Test Results</h4>
                      <div className="space-y-3">
                        {selectedBatch.qualityMetrics.testResults.map((test, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Test #{index + 1}</span>
                              <Badge variant={test.passed ? 'default' : 'destructive'}>
                                {test.passed ? 'Passed' : 'Failed'}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div>Date: {format(test.testDate, 'PPP')}</div>
                              <div>Tested by: {test.testedBy}</div>
                              {test.gcmsReport && (
                                <div>
                                  <Button variant="link" className="h-auto p-0 text-xs" asChild>
                                    <a href={test.gcmsReport} target="_blank">GC-MS Report</a>
                                  </Button>
                                </div>
                              )}
                              {test.allergenTest && (
                                <div>
                                  <Button variant="link" className="h-auto p-0 text-xs" asChild>
                                    <a href={test.allergenTest} target="_blank">Allergen Test</a>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="aging" className="space-y-4">
                {selectedBatch.agingInfo ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Aging Progress</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span>Progress</span>
                              <span className="font-medium">
                                {selectedBatch.agingInfo.currentAge} / {selectedBatch.agingInfo.targetDuration} days
                              </span>
                            </div>
                            <Progress
                              value={(selectedBatch.agingInfo.currentAge / selectedBatch.agingInfo.targetDuration) * 100}
                              className="h-3"
                            />
                            <div className="text-xs text-muted-foreground">
                              {((selectedBatch.agingInfo.currentAge / selectedBatch.agingInfo.targetDuration) * 100).toFixed(1)}% complete
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Aging Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <span className="capitalize">{selectedBatch.agingInfo.agingType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Started:</span>
                              <span>{format(selectedBatch.agingInfo.startDate, 'PPP')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Target Duration:</span>
                              <span>{selectedBatch.agingInfo.targetDuration} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Current Age:</span>
                              <span>{selectedBatch.agingInfo.currentAge} days</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Storage Conditions</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Temperature:</span>
                              <span>{selectedBatch.agingInfo.conditions.temperature}°C</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Humidity:</span>
                              <span>{selectedBatch.agingInfo.conditions.humidity}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Environment:</span>
                              <span className="text-right max-w-48">{selectedBatch.agingInfo.conditions.environment}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Aging Milestones</h4>
                          <div className="space-y-3">
                            {selectedBatch.agingInfo.milestones.map((milestone, index) => (
                              <div key={index} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">
                                    {format(milestone.date, 'MMM dd, yyyy')}
                                  </span>
                                  <Badge variant={milestone.qualityCheck ? 'default' : 'secondary'}>
                                    {milestone.qualityCheck ? 'Quality Checked' : 'Note Only'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{milestone.notes}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No Aging Required</p>
                    <p className="text-muted-foreground">
                      This material does not require aging or maturation process.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">UAE Compliance Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>UAE Standards</span>
                          <Badge variant={selectedBatch.complianceInfo.uaeStandards ? 'default' : 'destructive'}>
                            {selectedBatch.complianceInfo.uaeStandards ? 'Compliant' : 'Non-compliant'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>GCC Approval</span>
                          <Badge variant={selectedBatch.complianceInfo.gccApproval ? 'default' : 'destructive'}>
                            {selectedBatch.complianceInfo.gccApproval ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>Halal Certified</span>
                          <Badge variant={selectedBatch.complianceInfo.halalCertified ? 'default' : 'secondary'}>
                            {selectedBatch.complianceInfo.halalCertified ? 'Certified' : 'Not Required'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>ISO Certified</span>
                          <Badge variant={selectedBatch.complianceInfo.isoCertified ? 'default' : 'secondary'}>
                            {selectedBatch.complianceInfo.isoCertified ? 'Certified' : 'Not Required'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>MSDS Available</span>
                          <Badge variant={selectedBatch.complianceInfo.msdsAvailable ? 'default' : 'destructive'}>
                            {selectedBatch.complianceInfo.msdsAvailable ? 'Available' : 'Missing'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Trade Information</h4>
                      <div className="space-y-2">
                        {selectedBatch.complianceInfo.customsCode && (
                          <div className="flex justify-between">
                            <span>Customs Code:</span>
                            <span className="font-mono">{selectedBatch.complianceInfo.customsCode}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBatch.certifications.map(cert => (
                          <Badge key={cert} variant="outline">{cert}</Badge>
                        ))}
                      </div>
                    </div>

                    {selectedBatch.qualityNotes && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Quality Notes</h4>
                        <p className="text-sm bg-muted p-3 rounded">{selectedBatch.qualityNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}