'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScanLine,
  QrCode,
  Download,
  Upload,
  Camera,
  FileImage,
  Settings,
  Package,
  Beaker,
  Droplet,
  Calendar,
  MapPin,
  Hash,
  Printer,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  EyeOff,
  Zap,
  Database,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'

interface BarcodeData {
  id: string
  type: 'product' | 'batch' | 'location' | 'customer' | 'transaction'
  code: string
  format: 'CODE128' | 'CODE39' | 'EAN13' | 'QR' | 'DataMatrix' | 'PDF417'
  data: {
    // Product specific
    productId?: string
    sku?: string
    name?: string
    nameAr?: string
    category?: string
    grade?: string
    price?: number
    unit?: string

    // Batch specific
    batchNumber?: string
    productionDate?: string
    expiryDate?: string
    quality?: number
    origin?: string

    // Location specific
    locationId?: string
    warehouse?: string
    zone?: string
    shelf?: string

    // General
    createdAt: string
    updatedAt: string
    metadata?: Record<string, any>
  }
  isActive: boolean
  printCount: number
  scanCount: number
}

interface ScanResult {
  code: string
  format: string
  data: any
  timestamp: string
  location?: {
    latitude: number
    longitude: number
  }
  device?: string
  user?: string
}

interface BarcodeTemplate {
  id: string
  name: string
  type: 'product' | 'batch' | 'location'
  format: string
  template: string
  fields: string[]
  isDefault: boolean
}

const AdvancedBarcodeSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generate')
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([])
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([])
  const [templates, setTemplates] = useState<BarcodeTemplate[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [generatedBarcode, setGeneratedBarcode] = useState<BarcodeData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedFormat, setSelectedFormat] = useState<string>('CODE128')
  const [batchSize, setBatchSize] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copiedCode, setCopiedCode] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states for barcode generation
  const [formData, setFormData] = useState({
    type: 'product' as const,
    format: 'CODE128' as const,
    productId: '',
    sku: '',
    name: '',
    nameAr: '',
    category: '',
    grade: '',
    price: '',
    unit: '',
    batchNumber: '',
    productionDate: '',
    expiryDate: '',
    quality: '',
    origin: '',
    locationId: '',
    warehouse: '',
    zone: '',
    shelf: '',
    metadata: ''
  })

  // Mock data initialization
  useEffect(() => {
    const mockBarcodes: BarcodeData[] = [
      {
        id: '1',
        type: 'product',
        code: '1234567890123',
        format: 'EAN13',
        data: {
          productId: 'RCO-001',
          sku: 'RCO-001',
          name: 'Royal Cambodian Oud Oil',
          nameAr: 'زيت العود الكمبودي الملكي',
          category: 'oud_oil',
          grade: 'royal',
          price: 2500,
          unit: 'ml',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        isActive: true,
        printCount: 15,
        scanCount: 42
      },
      {
        id: '2',
        type: 'batch',
        code: 'BCH2024001',
        format: 'CODE128',
        data: {
          batchNumber: 'BCH-2024-001',
          productionDate: '2024-01-15',
          expiryDate: '2027-01-15',
          quality: 95,
          origin: 'Cambodia',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        isActive: true,
        printCount: 8,
        scanCount: 23
      }
    ]

    const mockTemplates: BarcodeTemplate[] = [
      {
        id: '1',
        name: 'Standard Product',
        type: 'product',
        format: 'EAN13',
        template: '{productId}-{category}-{grade}',
        fields: ['productId', 'category', 'grade'],
        isDefault: true
      },
      {
        id: '2',
        name: 'Batch Tracking',
        type: 'batch',
        format: 'CODE128',
        template: 'BCH{productionDate}{batchNumber}',
        fields: ['productionDate', 'batchNumber'],
        isDefault: false
      }
    ]

    setBarcodes(mockBarcodes)
    setTemplates(mockTemplates)

    // Load scan history from localStorage
    const savedHistory = localStorage.getItem('scanHistory')
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save scan history to localStorage
  useEffect(() => {
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory))
  }, [scanHistory])

  const generateBarcodeCode = (data: any, template?: BarcodeTemplate) => {
    if (template) {
      let code = template.template
      template.fields.forEach(field => {
        const value = data[field] || ''
        code = code.replace(`{${field}}`, value)
      })
      return code
    }

    // Default generation logic
    switch (data.type) {
      case 'product':
        return `${data.sku || 'PRD'}-${Date.now().toString().slice(-6)}`
      case 'batch':
        return `BCH${data.batchNumber || Date.now().toString().slice(-8)}`
      case 'location':
        return `LOC${data.warehouse || 'W1'}${data.zone || 'Z1'}${data.shelf || 'S1'}`
      default:
        return `GEN${Date.now().toString().slice(-8)}`
    }
  }

  const generateBarcode = async () => {
    setIsGenerating(true)

    try {
      const barcodeData: BarcodeData = {
        id: Date.now().toString(),
        type: formData.type,
        code: generateBarcodeCode(formData),
        format: formData.format,
        data: {
          ...formData,
          metadata: formData.metadata ? JSON.parse(formData.metadata) : {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        isActive: true,
        printCount: 0,
        scanCount: 0
      }

      // Generate batch if requested
      const newBarcodes: BarcodeData[] = []
      for (let i = 0; i < batchSize; i++) {
        const batchBarcode = {
          ...barcodeData,
          id: `${Date.now()}-${i}`,
          code: batchSize > 1 ? `${barcodeData.code}-${(i + 1).toString().padStart(3, '0')}` : barcodeData.code
        }
        newBarcodes.push(batchBarcode)
      }

      setBarcodes(prev => [...prev, ...newBarcodes])
      setGeneratedBarcode(newBarcodes[0])

      // Reset form
      setFormData({
        type: 'product',
        format: 'CODE128',
        productId: '',
        sku: '',
        name: '',
        nameAr: '',
        category: '',
        grade: '',
        price: '',
        unit: '',
        batchNumber: '',
        productionDate: '',
        expiryDate: '',
        quality: '',
        origin: '',
        locationId: '',
        warehouse: '',
        zone: '',
        shelf: '',
        metadata: ''
      })

    } catch (error) {
      console.error('Error generating barcode:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
        setIsScanning(true)
      }
    } catch (error) {
      console.error('Error starting camera:', error)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
    setIsCameraActive(false)
    setIsScanning(false)
  }

  const scanFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      // Simulate barcode detection from image
      // In a real implementation, you would use a library like QuaggaJS or ZXing
      const mockScanResult: ScanResult = {
        code: '1234567890123',
        format: 'EAN13',
        data: { scannedFromFile: true },
        timestamp: new Date().toISOString(),
        device: 'file_upload'
      }

      processScanResult(mockScanResult)
    }
    reader.readAsDataURL(file)
  }

  const processScanResult = (result: ScanResult) => {
    setScanResult(result)
    setScanHistory(prev => [result, ...prev.slice(0, 99)]) // Keep last 100 scans

    // Look up barcode data
    const barcodeData = barcodes.find(b => b.code === result.code)
    if (barcodeData) {
      // Update scan count
      setBarcodes(prev => prev.map(b =>
        b.id === barcodeData.id
          ? { ...b, scanCount: b.scanCount + 1 }
          : b
      ))
    }

    // Stop scanning
    stopCamera()
  }

  const printBarcode = async (barcode: BarcodeData) => {
    // Simulate printing
    setBarcodes(prev => prev.map(b =>
      b.id === barcode.id
        ? { ...b, printCount: b.printCount + 1 }
        : b
    ))

    // In a real implementation, you would send to printer
    console.log('Printing barcode:', barcode.code)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(text)
      setTimeout(() => setCopiedCode(''), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const exportBarcodes = () => {
    const dataStr = JSON.stringify(barcodes, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `barcodes_${new Date().toISOString().split('T')[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const filteredBarcodes = barcodes.filter(barcode => {
    const matchesSearch = barcode.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         barcode.data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         barcode.data.sku?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === 'all' || barcode.type === selectedType

    return matchesSearch && matchesType
  })

  const getBarcodeIcon = (type: string) => {
    switch (type) {
      case 'product': return <Package className="h-4 w-4" />
      case 'batch': return <Beaker className="h-4 w-4" />
      case 'location': return <MapPin className="h-4 w-4" />
      default: return <QrCode className="h-4 w-4" />
    }
  }

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'EAN13': return 'bg-blue-100 text-blue-800'
      case 'CODE128': return 'bg-green-100 text-green-800'
      case 'QR': return 'bg-purple-100 text-purple-800'
      case 'DataMatrix': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <QrCode className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold">
            {language === 'ar' ? 'نظام الباركود المتقدم' : 'Advanced Barcode System'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
          >
            {language === 'ar' ? 'EN' : 'ع'}
          </Button>

          <Button variant="outline" onClick={exportBarcodes}>
            <Download className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">
            {language === 'ar' ? 'إنشاء' : 'Generate'}
          </TabsTrigger>
          <TabsTrigger value="scan">
            {language === 'ar' ? 'مسح' : 'Scan'}
          </TabsTrigger>
          <TabsTrigger value="manage">
            {language === 'ar' ? 'إدارة' : 'Manage'}
          </TabsTrigger>
          <TabsTrigger value="history">
            {language === 'ar' ? 'التاريخ' : 'History'}
          </TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Generation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>{language === 'ar' ? 'إنشاء باركود' : 'Generate Barcode'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Barcode Type */}
                <div>
                  <Label>{language === 'ar' ? 'نوع الباركود' : 'Barcode Type'}</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">{language === 'ar' ? 'منتج' : 'Product'}</SelectItem>
                      <SelectItem value="batch">{language === 'ar' ? 'دفعة' : 'Batch'}</SelectItem>
                      <SelectItem value="location">{language === 'ar' ? 'موقع' : 'Location'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Barcode Format */}
                <div>
                  <Label>{language === 'ar' ? 'تنسيق الباركود' : 'Barcode Format'}</Label>
                  <Select value={formData.format} onValueChange={(value: any) => setFormData(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CODE128">CODE 128</SelectItem>
                      <SelectItem value="CODE39">CODE 39</SelectItem>
                      <SelectItem value="EAN13">EAN-13</SelectItem>
                      <SelectItem value="QR">QR Code</SelectItem>
                      <SelectItem value="DataMatrix">Data Matrix</SelectItem>
                      <SelectItem value="PDF417">PDF 417</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Fields Based on Type */}
                {formData.type === 'product' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{language === 'ar' ? 'رمز المنتج' : 'Product ID'}</Label>
                        <Input
                          value={formData.productId}
                          onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
                          placeholder="PRD-001"
                        />
                      </div>
                      <div>
                        <Label>SKU</Label>
                        <Input
                          value={formData.sku}
                          onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                          placeholder="SKU-001"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{language === 'ar' ? 'اسم المنتج' : 'Product Name'}</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>{language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}</Label>
                        <Input
                          value={formData.nameAr}
                          onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>{language === 'ar' ? 'الفئة' : 'Category'}</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oud_oil">Oud Oil</SelectItem>
                            <SelectItem value="oud_chips">Oud Chips</SelectItem>
                            <SelectItem value="bakhoor">Bakhoor</SelectItem>
                            <SelectItem value="perfume">Perfume</SelectItem>
                            <SelectItem value="attar">Attar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{language === 'ar' ? 'الدرجة' : 'Grade'}</Label>
                        <Select value={formData.grade} onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="royal">Royal</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="super">Super</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{language === 'ar' ? 'الوحدة' : 'Unit'}</Label>
                        <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ml">ML</SelectItem>
                            <SelectItem value="gram">Gram</SelectItem>
                            <SelectItem value="tola">Tola</SelectItem>
                            <SelectItem value="piece">Piece</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>{language === 'ar' ? 'السعر' : 'Price (AED)'}</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  </>
                )}

                {formData.type === 'batch' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{language === 'ar' ? 'رقم الدفعة' : 'Batch Number'}</Label>
                        <Input
                          value={formData.batchNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                          placeholder="BCH-2024-001"
                        />
                      </div>
                      <div>
                        <Label>{language === 'ar' ? 'المنشأ' : 'Origin'}</Label>
                        <Input
                          value={formData.origin}
                          onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                          placeholder="Cambodia"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{language === 'ar' ? 'تاريخ الإنتاج' : 'Production Date'}</Label>
                        <Input
                          type="date"
                          value={formData.productionDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, productionDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</Label>
                        <Input
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>{language === 'ar' ? 'الجودة (%)' : 'Quality (%)'}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.quality}
                        onChange={(e) => setFormData(prev => ({ ...prev, quality: e.target.value }))}
                        placeholder="95"
                      />
                    </div>
                  </>
                )}

                {formData.type === 'location' && (
                  <>
                    <div>
                      <Label>{language === 'ar' ? 'معرف الموقع' : 'Location ID'}</Label>
                      <Input
                        value={formData.locationId}
                        onChange={(e) => setFormData(prev => ({ ...prev, locationId: e.target.value }))}
                        placeholder="LOC-001"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>{language === 'ar' ? 'المستودع' : 'Warehouse'}</Label>
                        <Input
                          value={formData.warehouse}
                          onChange={(e) => setFormData(prev => ({ ...prev, warehouse: e.target.value }))}
                          placeholder="W1"
                        />
                      </div>
                      <div>
                        <Label>{language === 'ar' ? 'المنطقة' : 'Zone'}</Label>
                        <Input
                          value={formData.zone}
                          onChange={(e) => setFormData(prev => ({ ...prev, zone: e.target.value }))}
                          placeholder="Z1"
                        />
                      </div>
                      <div>
                        <Label>{language === 'ar' ? 'الرف' : 'Shelf'}</Label>
                        <Input
                          value={formData.shelf}
                          onChange={(e) => setFormData(prev => ({ ...prev, shelf: e.target.value }))}
                          placeholder="S1"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Advanced Options */}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showAdvanced}
                    onCheckedChange={setShowAdvanced}
                    id="advanced"
                  />
                  <Label htmlFor="advanced">
                    {language === 'ar' ? 'خيارات متقدمة' : 'Advanced Options'}
                  </Label>
                </div>

                {showAdvanced && (
                  <>
                    <div>
                      <Label>{language === 'ar' ? 'حجم الدفعة' : 'Batch Size'}</Label>
                      <Input
                        type="number"
                        min="1"
                        max="1000"
                        value={batchSize}
                        onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div>
                      <Label>{language === 'ar' ? 'بيانات إضافية (JSON)' : 'Additional Data (JSON)'}</Label>
                      <Textarea
                        value={formData.metadata}
                        onChange={(e) => setFormData(prev => ({ ...prev, metadata: e.target.value }))}
                        placeholder='{"customField": "value"}'
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <Button
                  onClick={generateBarcode}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <QrCode className="h-5 w-5 mr-2" />
                  )}
                  {language === 'ar' ? 'إنشاء باركود' : 'Generate Barcode'}
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'معاينة الباركود' : 'Barcode Preview'}</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedBarcode ? (
                  <div className="space-y-4">
                    {/* Barcode Visualization */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="mb-4">
                        {/* Simulated barcode - in real implementation, use a barcode generation library */}
                        <div className="mx-auto w-48 h-16 bg-gradient-to-r from-black via-white to-black opacity-80 flex items-center justify-center">
                          <span className="text-xs font-mono">{generatedBarcode.format}</span>
                        </div>
                      </div>
                      <div className="font-mono text-sm font-bold">
                        {generatedBarcode.code}
                      </div>
                      <Badge className={`mt-2 ${getFormatColor(generatedBarcode.format)}`}>
                        {generatedBarcode.format}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedBarcode.code)}
                        className="flex-1"
                      >
                        {copiedCode === generatedBarcode.code ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {language === 'ar' ? 'نسخ' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => printBarcode(generatedBarcode)}
                        className="flex-1"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'طباعة' : 'Print'}
                      </Button>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === 'ar' ? 'النوع:' : 'Type:'}</span>
                        <span className="capitalize">{generatedBarcode.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === 'ar' ? 'تم الإنشاء:' : 'Created:'}</span>
                        <span>{new Date(generatedBarcode.data.createdAt).toLocaleString(language === 'ar' ? 'ar-AE' : 'en-AE')}</span>
                      </div>
                      {generatedBarcode.data.name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'ar' ? 'الاسم:' : 'Name:'}</span>
                          <span>{language === 'ar' ? generatedBarcode.data.nameAr : generatedBarcode.data.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>{language === 'ar' ? 'قم بإنشاء باركود لمعاينته هنا' : 'Generate a barcode to preview it here'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scan Tab */}
        <TabsContent value="scan" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ScanLine className="h-5 w-5" />
                  <span>{language === 'ar' ? 'ماسح الباركود' : 'Barcode Scanner'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isCameraActive ? (
                  <div className="space-y-4">
                    <Button
                      onClick={startCamera}
                      className="w-full"
                      size="lg"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      {language === 'ar' ? 'بدء المسح بالكاميرا' : 'Start Camera Scan'}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          {language === 'ar' ? 'أو' : 'or'}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                      size="lg"
                    >
                      <FileImage className="h-5 w-5 mr-2" />
                      {language === 'ar' ? 'رفع صورة' : 'Upload Image'}
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={scanFromFile}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg"
                      />
                      <div className="absolute inset-0 border-2 border-purple-500 rounded-lg pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-red-500 rounded">
                          <div className="absolute inset-0 border border-red-300 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={stopCamera}
                      className="w-full"
                    >
                      {language === 'ar' ? 'إيقاف المسح' : 'Stop Scanning'}
                    </Button>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            {/* Scan Result */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'نتيجة المسح' : 'Scan Result'}</CardTitle>
              </CardHeader>
              <CardContent>
                {scanResult ? (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        {language === 'ar' ? 'تم مسح الباركود بنجاح' : 'Barcode scanned successfully'}
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg font-mono font-bold mb-2">
                        {scanResult.code}
                      </div>
                      <Badge className={getFormatColor(scanResult.format)}>
                        {scanResult.format}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === 'ar' ? 'الوقت:' : 'Time:'}</span>
                        <span>{new Date(scanResult.timestamp).toLocaleString(language === 'ar' ? 'ar-AE' : 'en-AE')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === 'ar' ? 'الجهاز:' : 'Device:'}</span>
                        <span>{scanResult.device || 'camera'}</span>
                      </div>
                    </div>

                    {/* Look up product info if available */}
                    {(() => {
                      const productInfo = barcodes.find(b => b.code === scanResult.code)
                      return productInfo ? (
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">
                            {language === 'ar' ? 'معلومات المنتج' : 'Product Information'}
                          </h4>
                          <div className="space-y-1 text-sm">
                            {productInfo.data.name && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">{language === 'ar' ? 'الاسم:' : 'Name:'}</span>
                                <span>{language === 'ar' ? productInfo.data.nameAr : productInfo.data.name}</span>
                              </div>
                            )}
                            {productInfo.data.sku && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">SKU:</span>
                                <span>{productInfo.data.sku}</span>
                              </div>
                            )}
                            {productInfo.data.price && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">{language === 'ar' ? 'السعر:' : 'Price:'}</span>
                                <span className="font-semibold text-purple-600">
                                  {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                                    style: 'currency',
                                    currency: 'AED'
                                  }).format(productInfo.data.price)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {language === 'ar' ? 'لا توجد معلومات منتج لهذا الباركود' : 'No product information found for this barcode'}
                          </AlertDescription>
                        </Alert>
                      )
                    })()}

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(scanResult.code)}
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'نسخ' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setScanResult(null)}
                        className="flex-1"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'مسح جديد' : 'New Scan'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <ScanLine className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>{language === 'ar' ? 'ابدأ مسح الباركود لرؤية النتائج هنا' : 'Start scanning to see results here'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="manage" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={language === 'ar' ? 'البحث عن الباركود...' : 'Search barcodes...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                      <SelectItem value="product">{language === 'ar' ? 'منتج' : 'Product'}</SelectItem>
                      <SelectItem value="batch">{language === 'ar' ? 'دفعة' : 'Batch'}</SelectItem>
                      <SelectItem value="location">{language === 'ar' ? 'موقع' : 'Location'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Barcodes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBarcodes.map((barcode) => (
              <Card key={barcode.id} className={!barcode.isActive ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getBarcodeIcon(barcode.type)}
                      <Badge variant="outline" className="text-xs capitalize">
                        {barcode.type}
                      </Badge>
                    </div>
                    <Badge className={`text-xs ${getFormatColor(barcode.format)}`}>
                      {barcode.format}
                    </Badge>
                  </div>

                  <div className="font-mono font-bold text-lg mb-2">
                    {barcode.code}
                  </div>

                  {barcode.data.name && (
                    <div className="text-sm text-gray-600 mb-2">
                      {language === 'ar' ? barcode.data.nameAr : barcode.data.name}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Printer className="h-3 w-3" />
                      <span>{barcode.printCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ScanLine className="h-3 w-3" />
                      <span>{barcode.scanCount}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(barcode.code)}
                      className="flex-1"
                    >
                      {copiedCode === barcode.code ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => printBarcode(barcode)}
                      className="flex-1"
                    >
                      <Printer className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBarcodes.length === 0 && (
            <div className="text-center py-12">
              <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">
                {language === 'ar' ? 'لا توجد باركودات' : 'No barcodes found'}
              </p>
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>{language === 'ar' ? 'سجل المسح' : 'Scan History'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scanHistory.length === 0 ? (
                <div className="text-center py-12">
                  <ScanLine className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">
                    {language === 'ar' ? 'لا يوجد سجل مسح' : 'No scan history available'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scanHistory.slice(0, 50).map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-mono font-semibold">{scan.code}</div>
                        <div className="text-sm text-gray-600 flex items-center space-x-4">
                          <span>{new Date(scan.timestamp).toLocaleString(language === 'ar' ? 'ar-AE' : 'en-AE')}</span>
                          <Badge className={`text-xs ${getFormatColor(scan.format)}`}>
                            {scan.format}
                          </Badge>
                          {scan.device && (
                            <span className="text-xs text-gray-500">{scan.device}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(scan.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvancedBarcodeSystem