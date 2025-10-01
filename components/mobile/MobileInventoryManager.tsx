'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Search,
  Filter,
  ScanLine,
  Plus,
  Minus,
  RefreshCw,
  Wifi,
  WifiOff,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Droplet,
  Weight,
  Beaker
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface InventoryItem {
  id: string
  name: string
  nameAr: string
  sku: string
  category: 'oud_oil' | 'oud_chips' | 'bakhoor' | 'perfume' | 'attar' | 'raw_material'
  grade?: 'royal' | 'premium' | 'super' | 'regular'
  currentStock: number
  unit: string
  minStock: number
  maxStock: number
  price: number
  location: string
  batchNumber?: string
  expiryDate?: string
  quality: number
  density?: number
  agingStatus?: string
  lastUpdated: string
  isOfflineModified: boolean
}

interface ConversionResult {
  originalValue: number
  convertedValue: number
  fromUnit: string
  toUnit: string
  factor: number
  method: string
  formula: string
  notes?: string
}

const MobileInventoryManager: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [items, setItems] = useState<InventoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [isScanning, setIsScanning] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [pendingChanges, setPendingChanges] = useState(0)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [showLowStock, setShowLowStock] = useState(false)
  const [showExpiringSoon, setShowExpiringSoon] = useState(false)
  const [conversionFrom, setConversionFrom] = useState('')
  const [conversionTo, setConversionTo] = useState('')
  const [conversionValue, setConversionValue] = useState('')
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockItems: InventoryItem[] = [
      {
        id: '1',
        name: 'Royal Cambodian Oud Oil',
        nameAr: 'زيت العود الكمبودي الملكي',
        sku: 'RCO-001',
        category: 'oud_oil',
        grade: 'royal',
        currentStock: 150,
        unit: 'ml',
        minStock: 50,
        maxStock: 500,
        price: 2500,
        location: 'A1-01',
        batchNumber: 'BCH-2024-001',
        expiryDate: '2027-12-31',
        quality: 95,
        density: 0.85,
        agingStatus: '2 years',
        lastUpdated: new Date().toISOString(),
        isOfflineModified: false
      },
      {
        id: '2',
        name: 'Premium Hindi Oud Chips',
        nameAr: 'رقائق العود الهندي الممتاز',
        sku: 'PHC-002',
        category: 'oud_chips',
        grade: 'premium',
        currentStock: 2.5,
        unit: 'tola',
        minStock: 1,
        maxStock: 10,
        price: 1800,
        location: 'B2-03',
        batchNumber: 'BCH-2024-002',
        quality: 88,
        lastUpdated: new Date().toISOString(),
        isOfflineModified: false
      },
      {
        id: '3',
        name: 'Rose Attar',
        nameAr: 'عطر الورد',
        sku: 'RA-003',
        category: 'attar',
        currentStock: 75,
        unit: 'ml',
        minStock: 25,
        maxStock: 200,
        price: 450,
        location: 'C1-05',
        batchNumber: 'BCH-2024-003',
        expiryDate: '2026-06-30',
        quality: 92,
        density: 0.88,
        lastUpdated: new Date().toISOString(),
        isOfflineModified: false
      }
    ]
    setItems(mockItems)
    setFilteredItems(mockItems)
  }, [])

  // Network status monitoring
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.nameAr.includes(searchTerm) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchesGrade = selectedGrade === 'all' || item.grade === selectedGrade

      const isLowStock = item.currentStock <= item.minStock
      const isExpiringSoon = item.expiryDate &&
        new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      const matchesLowStock = !showLowStock || isLowStock
      const matchesExpiring = !showExpiringSoon || isExpiringSoon

      return matchesSearch && matchesCategory && matchesGrade && matchesLowStock && matchesExpiring
    })

    setFilteredItems(filtered)
  }, [items, searchTerm, selectedCategory, selectedGrade, showLowStock, showExpiringSoon])

  const handleQuantityChange = useCallback(async (itemId: string, change: number) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const newStock = Math.max(0, item.currentStock + change)
        return {
          ...item,
          currentStock: newStock,
          lastUpdated: new Date().toISOString(),
          isOfflineModified: !isOnline
        }
      }
      return item
    })

    setItems(updatedItems)

    if (!isOnline) {
      setPendingChanges(prev => prev + 1)
    }
  }, [items, isOnline])

  const handleSync = async () => {
    if (!isOnline) return

    setSyncStatus('syncing')

    try {
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000))

      const syncedItems = items.map(item => ({
        ...item,
        isOfflineModified: false
      }))

      setItems(syncedItems)
      setPendingChanges(0)
      setSyncStatus('success')

      setTimeout(() => setSyncStatus('idle'), 3000)
    } catch (error) {
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 5000)
    }
  }

  const performUnitConversion = async () => {
    if (!conversionValue || !conversionFrom || !conversionTo) return

    try {
      const response = await fetch(
        `/api/inventory/conversions?value=${conversionValue}&fromUnit=${conversionFrom}&toUnit=${conversionTo}`
      )

      if (response.ok) {
        const result = await response.json()
        setConversionResult(result.data)
      }
    } catch (error) {
      console.error('Conversion failed:', error)
    }
  }

  const getStockLevel = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100
    if (percentage <= 20) return 'critical'
    if (percentage <= 40) return 'low'
    if (percentage <= 70) return 'medium'
    return 'good'
  }

  const getStockColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600'
      case 'low': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'oud_oil': return <Droplet className="h-4 w-4" />
      case 'oud_chips': return <Package className="h-4 w-4" />
      case 'bakhoor': return <Beaker className="h-4 w-4" />
      case 'perfume': return <Droplet className="h-4 w-4" />
      case 'attar': return <Droplet className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-bold">
              {language === 'ar' ? 'إدارة المخزون' : 'Inventory'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
            >
              {language === 'ar' ? 'EN' : 'ع'}
            </Button>

            {/* Network Status */}
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? (language === 'ar' ? 'متصل' : 'Online') : (language === 'ar' ? 'غير متصل' : 'Offline')}
              </span>
            </div>

            {/* Sync Button */}
            {pendingChanges > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={!isOnline || syncStatus === 'syncing'}
                className="bg-orange-50 border-orange-200"
              >
                {syncStatus === 'syncing' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span className="ml-1 text-xs">{pendingChanges}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Sync Status Alert */}
        {!isOnline && pendingChanges > 0 && (
          <Alert className="mx-4 mb-2 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar'
                ? `${pendingChanges} تغييرات في انتظار المزامنة`
                : `${pendingChanges} changes pending sync`}
            </AlertDescription>
          </Alert>
        )}

        {syncStatus === 'success' && (
          <Alert className="mx-4 mb-2 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar' ? 'تمت المزامنة بنجاح' : 'Sync completed successfully'}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={language === 'ar' ? 'البحث عن المنتجات...' : 'Search products...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setIsScanning(!isScanning)}
          >
            <ScanLine className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</SelectItem>
              <SelectItem value="oud_oil">{language === 'ar' ? 'زيت العود' : 'Oud Oil'}</SelectItem>
              <SelectItem value="oud_chips">{language === 'ar' ? 'رقائق العود' : 'Oud Chips'}</SelectItem>
              <SelectItem value="bakhoor">{language === 'ar' ? 'بخور' : 'Bakhoor'}</SelectItem>
              <SelectItem value="perfume">{language === 'ar' ? 'عطور' : 'Perfume'}</SelectItem>
              <SelectItem value="attar">{language === 'ar' ? 'عطر' : 'Attar'}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'ar' ? 'جميع الدرجات' : 'All Grades'}</SelectItem>
              <SelectItem value="royal">{language === 'ar' ? 'ملكي' : 'Royal'}</SelectItem>
              <SelectItem value="premium">{language === 'ar' ? 'ممتاز' : 'Premium'}</SelectItem>
              <SelectItem value="super">{language === 'ar' ? 'سوبر' : 'Super'}</SelectItem>
              <SelectItem value="regular">{language === 'ar' ? 'عادي' : 'Regular'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={showLowStock}
              onCheckedChange={setShowLowStock}
              id="low-stock"
            />
            <label htmlFor="low-stock" className="text-sm">
              {language === 'ar' ? 'مخزون منخفض' : 'Low Stock'}
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={showExpiringSoon}
              onCheckedChange={setShowExpiringSoon}
              id="expiring-soon"
            />
            <label htmlFor="expiring-soon" className="text-sm">
              {language === 'ar' ? 'تنتهي قريباً' : 'Expiring Soon'}
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="px-4">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="inventory">
            {language === 'ar' ? 'المخزون' : 'Inventory'}
          </TabsTrigger>
          <TabsTrigger value="converter">
            {language === 'ar' ? 'محول الوحدات' : 'Unit Converter'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{filteredItems.length}</div>
                  <div className="text-sm text-gray-600">
                    {language === 'ar' ? 'إجمالي العناصر' : 'Total Items'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {filteredItems.filter(item => item.currentStock <= item.minStock).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'ar' ? 'مخزون منخفض' : 'Low Stock'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Items */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <Card className={`${item.isOfflineModified ? 'border-orange-200 bg-orange-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {getCategoryIcon(item.category)}
                            <h3 className="font-semibold truncate">
                              {language === 'ar' ? item.nameAr : item.name}
                            </h3>
                            {item.grade && (
                              <Badge variant="outline" className="text-xs">
                                {language === 'ar'
                                  ? item.grade === 'royal' ? 'ملكي'
                                    : item.grade === 'premium' ? 'ممتاز'
                                    : item.grade === 'super' ? 'سوبر' : 'عادي'
                                  : item.grade}
                              </Badge>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            <div>SKU: {item.sku}</div>
                            <div>{language === 'ar' ? 'الموقع:' : 'Location:'} {item.location}</div>
                            {item.batchNumber && (
                              <div>{language === 'ar' ? 'رقم الدفعة:' : 'Batch:'} {item.batchNumber}</div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className={`text-lg font-bold ${getStockColor(getStockLevel(item))}`}>
                              {item.currentStock} {item.unit}
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                {language === 'ar' ? 'الحد الأدنى:' : 'Min:'} {item.minStock}
                              </div>
                              <div className="text-sm text-gray-600">
                                {language === 'ar' ? 'الحد الأقصى:' : 'Max:'} {item.maxStock}
                              </div>
                            </div>
                          </div>

                          <Progress
                            value={(item.currentStock / item.maxStock) * 100}
                            className="h-2 mb-3"
                          />

                          {item.quality && (
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-sm text-gray-600">
                                {language === 'ar' ? 'الجودة:' : 'Quality:'}
                              </span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                  style={{ width: `${item.quality}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold">{item.quality}%</span>
                            </div>
                          )}

                          {item.agingStatus && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{language === 'ar' ? 'التعتيق:' : 'Aging:'} {item.agingStatus}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <div className="text-lg font-bold text-purple-600">
                            {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                              style: 'currency',
                              currency: 'AED'
                            }).format(item.price)}
                          </div>

                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.currentStock <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {item.isOfflineModified && (
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                              {language === 'ar' ? 'غير متزامن' : 'Offline Modified'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="converter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'محول الوحدات للعطور والعود' : 'Perfume & Oud Unit Converter'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {language === 'ar' ? 'القيمة' : 'Value'}
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={conversionValue}
                    onChange={(e) => setConversionValue(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {language === 'ar' ? 'من' : 'From'}
                    </label>
                    <Select value={conversionFrom} onValueChange={setConversionFrom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gram">Gram (g)</SelectItem>
                        <SelectItem value="tola">Tola</SelectItem>
                        <SelectItem value="ml">Milliliter (ml)</SelectItem>
                        <SelectItem value="liter">Liter (L)</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="dozen">Dozen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {language === 'ar' ? 'إلى' : 'To'}
                    </label>
                    <Select value={conversionTo} onValueChange={setConversionTo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gram">Gram (g)</SelectItem>
                        <SelectItem value="tola">Tola</SelectItem>
                        <SelectItem value="ml">Milliliter (ml)</SelectItem>
                        <SelectItem value="liter">Liter (L)</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="dozen">Dozen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={performUnitConversion} className="w-full">
                  {language === 'ar' ? 'تحويل' : 'Convert'}
                </Button>

                {conversionResult && (
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-700 mb-2">
                          {conversionResult.convertedValue.toFixed(4)} {conversionResult.toUnit}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {conversionResult.formula}
                        </div>
                        <div className="text-xs text-gray-500">
                          Method: {conversionResult.method}
                          {conversionResult.notes && ` • ${conversionResult.notes}`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Conversion Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {language === 'ar' ? 'مرجع التحويل السريع' : 'Quick Conversion Reference'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>1 Tola =</span>
                  <span>11.66 grams</span>
                </div>
                <div className="flex justify-between">
                  <span>1 Tola ≈</span>
                  <span>13.7 ml (oud oil)</span>
                </div>
                <div className="flex justify-between">
                  <span>1 ml (oud oil) ≈</span>
                  <span>0.85 grams</span>
                </div>
                <div className="flex justify-between">
                  <span>1 dozen =</span>
                  <span>12 pieces</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MobileInventoryManager