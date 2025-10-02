'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  Store,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MapPin,
  BarChart3,
  DollarSign,
  Boxes,
  Factory,
  ShoppingCart,
  Truck,
  Calendar,
  Clock,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  Send,
  Receive,
  Package2,
  Warehouse,
  Building,
  Users,
  Crown,
  Star,
  Percent,
  Weight,
  Droplets,
  Beaker,
  Gem,
  Sparkles
} from 'lucide-react'

interface Location {
  id: string
  name: string
  type: 'store' | 'warehouse' | 'factory' | 'distribution_center'
  address: string
  city: string
  region: string
  manager: string
  phone: string
  email: string
  isActive: boolean
  capacity: number
  currentUtilization: number
  operatingHours: {
    open: string
    close: string
    days: string[]
  }
  coordinates?: {
    lat: number
    lng: number
  }
}

interface InventoryItem {
  id: string
  name: string
  nameArabic?: string
  sku: string
  category: 'raw_material' | 'semi_finished' | 'finished_product' | 'packaging' | 'accessories'
  subcategory: string
  brand?: string
  supplier?: string
  batchNumber?: string
  manufactureDate?: Date
  expiryDate?: Date
  description: string
  specifications: {
    weight?: number
    volume?: number
    concentration?: number
    quality: 'premium' | 'standard' | 'economy'
    origin?: string
    purity?: number
  }
  units: {
    primary: 'gram' | 'ml' | 'piece' | 'tola' | 'ounce'
    conversions: {
      unit: string
      factor: number
    }[]
  }
  costPrice: number
  pricing: {
    retail: number
    wholesale: number
    vip: number
    corporate: number
    locationSpecific?: {
      locationId: string
      price: number
    }[]
  }
  stock: {
    locationId: string
    quantity: number
    reserved: number
    available: number
    reorderLevel: number
    maxLevel: number
    value: number
  }[]
  totalStock: number
  totalValue: number
  lastMovement?: {
    type: 'in' | 'out' | 'transfer' | 'adjustment'
    quantity: number
    date: Date
    reference: string
  }
  alerts: InventoryAlert[]
  images: string[]
  tags: string[]
}

interface InventoryAlert {
  id: string
  type: 'low_stock' | 'overstock' | 'expiry_warning' | 'zero_stock' | 'negative_stock'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  locationId?: string
  createdAt: Date
  isActive: boolean
}

interface StockMovement {
  id: string
  itemId: string
  itemName: string
  type: 'receipt' | 'sale' | 'transfer' | 'adjustment' | 'production_use' | 'production_output' | 'return' | 'damage' | 'expiry'
  fromLocationId?: string
  toLocationId?: string
  quantity: number
  unit: string
  costPrice?: number
  totalValue: number
  reference: string
  batchNumber?: string
  notes?: string
  createdBy: string
  createdAt: Date
  approvedBy?: string
  approvedAt?: Date
}

interface InventoryMetrics {
  totalItems: number
  totalValue: number
  totalValueAED: number
  lowStockItems: number
  zeroStockItems: number
  expiringItems: number
  totalLocations: number
  avgStockTurnover: number
  topCategories: {
    category: string
    count: number
    value: number
  }[]
  recentMovements: StockMovement[]
  alertsSummary: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

export default function InventoryDashboard() {
  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  useEffect(() => {
    fetchInventoryData()
  }, [selectedLocation, selectedCategory])

  const fetchInventoryData = async () => {
    try {
      // Fetch products from real API
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();

      // Transform products to inventory item format
      const transformedItems: InventoryItem[] = (productsData.products || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        nameArabic: product.nameArabic,
        sku: product.sku,
        category: 'finished_product',
        subcategory: product.category?.name || 'General',
        brand: product.brand?.name,
        description: product.description || '',
        specifications: {
          weight: product.weight,
          volume: product.volume,
          quality: 'standard' as const
        },
        units: {
          primary: product.unit as any || 'piece',
          conversions: []
        },
        costPrice: Number(product.costPrice || 0),
        pricing: {
          retail: Number(product.unitPrice),
          wholesale: Number(product.unitPrice) * 0.9,
          vip: Number(product.unitPrice) * 0.92,
          corporate: Number(product.unitPrice) * 0.95
        },
        stock: [],
        totalStock: product.stockQuantity || 0,
        totalValue: (product.stockQuantity || 0) * Number(product.unitPrice),
        alerts: [],
        images: product.images ? JSON.parse(product.images) : [],
        tags: product.tags ? JSON.parse(product.tags) : []
      }));

      setInventoryItems(transformedItems);

      // Also fetch stores for locations
      const storesResponse = await fetch('/api/stores');
      const storesData = await storesResponse.json();

      const transformedLocations: Location[] = (storesData.data || []).map((store: any) => ({
        id: store.id,
        name: store.name,
        type: 'store' as const,
        address: store.address || '',
        city: store.city || '',
        region: store.emirate || '',
        manager: '',
        phone: store.phone || '',
        email: store.email || '',
        isActive: store.isActive,
        capacity: 1000,
        currentUtilization: 50,
        operatingHours: {
          open: store.openingTime || '09:00',
          close: store.closingTime || '21:00',
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }
      }));

      setLocations(transformedLocations);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      // Fallback to mock data on error
      generateMockData();
    }
  }

  const generateMockData = () => {
    const mockLocations: Location[] = [
      {
        id: 'LOC001',
        name: 'Dubai Mall Flagship Store',
        type: 'store',
        address: 'Ground Floor, Dubai Mall',
        city: 'Dubai',
        region: 'Dubai',
        manager: 'Ahmed Al-Mansoori',
        phone: '+971-4-123-4567',
        email: 'dubai.mall@oudpms.com',
        isActive: true,
        capacity: 1000,
        currentUtilization: 85,
        operatingHours: {
          open: '10:00',
          close: '22:00',
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        coordinates: { lat: 25.1972, lng: 55.2796 }
      },
      {
        id: 'LOC002',
        name: 'Sharjah Heritage Store',
        type: 'store',
        address: 'Heritage Area, Sharjah',
        city: 'Sharjah',
        region: 'Sharjah',
        manager: 'Fatima Al-Zahra',
        phone: '+971-6-987-6543',
        email: 'sharjah@oudpms.com',
        isActive: true,
        capacity: 500,
        currentUtilization: 72,
        operatingHours: {
          open: '09:00',
          close: '21:00',
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }
      },
      {
        id: 'LOC003',
        name: 'Main Production Facility',
        type: 'factory',
        address: 'Industrial Area 1, Ajman',
        city: 'Ajman',
        region: 'Ajman',
        manager: 'Omar Abdullah',
        phone: '+971-6-456-7890',
        email: 'factory@oudpms.com',
        isActive: true,
        capacity: 5000,
        currentUtilization: 60,
        operatingHours: {
          open: '07:00',
          close: '19:00',
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
        }
      },
      {
        id: 'LOC004',
        name: 'Central Warehouse',
        type: 'warehouse',
        address: 'Dubai Investment Park',
        city: 'Dubai',
        region: 'Dubai',
        manager: 'Hassan Mohammed',
        phone: '+971-4-789-0123',
        email: 'warehouse@oudpms.com',
        isActive: true,
        capacity: 10000,
        currentUtilization: 45,
        operatingHours: {
          open: '06:00',
          close: '18:00',
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      }
    ]

    const mockInventoryItems: InventoryItem[] = [
      {
        id: 'INV001',
        name: 'Premium Cambodian Oud Chips',
        nameArabic: 'قطع العود الكمبودي الفاخر',
        sku: 'OUD-CAM-PREM-001',
        category: 'raw_material',
        subcategory: 'oud_chips',
        supplier: 'Cambodian Oud Traders LLC',
        batchNumber: 'CAM2024-03-15',
        manufactureDate: new Date('2024-03-15'),
        description: 'Premium grade Cambodian oud chips with intense fragrance',
        specifications: {
          weight: 1000,
          quality: 'premium',
          origin: 'Cambodia',
          purity: 95
        },
        units: {
          primary: 'gram',
          conversions: [
            { unit: 'tola', factor: 11.66 },
            { unit: 'ounce', factor: 28.35 }
          ]
        },
        costPrice: 45,
        pricing: {
          retail: 85,
          wholesale: 70,
          vip: 80,
          corporate: 65,
          locationSpecific: [
            { locationId: 'LOC001', price: 90 }
          ]
        },
        stock: [
          { locationId: 'LOC001', quantity: 50, reserved: 5, available: 45, reorderLevel: 20, maxLevel: 100, value: 4250 },
          { locationId: 'LOC002', quantity: 30, reserved: 2, available: 28, reorderLevel: 15, maxLevel: 60, value: 2550 },
          { locationId: 'LOC003', quantity: 200, reserved: 50, available: 150, reorderLevel: 100, maxLevel: 500, value: 17000 },
          { locationId: 'LOC004', quantity: 800, reserved: 100, available: 700, reorderLevel: 200, maxLevel: 1000, value: 68000 }
        ],
        totalStock: 1080,
        totalValue: 91800,
        lastMovement: {
          type: 'in',
          quantity: 50,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          reference: 'PO-2024-156'
        },
        alerts: [],
        images: ['/images/oud-chips-cambodian.jpg'],
        tags: ['premium', 'cambodian', 'oud', 'fragrance']
      },
      {
        id: 'INV002',
        name: 'Rose Essential Oil',
        nameArabic: 'زيت الورد الأساسي',
        sku: 'ESS-ROSE-001',
        category: 'raw_material',
        subcategory: 'essential_oils',
        supplier: 'Bulgarian Rose Co.',
        batchNumber: 'BGR2024-02-28',
        manufactureDate: new Date('2024-02-28'),
        expiryDate: new Date('2027-02-28'),
        description: 'Pure Bulgarian rose essential oil',
        specifications: {
          volume: 500,
          quality: 'premium',
          origin: 'Bulgaria',
          purity: 100,
          concentration: 100
        },
        units: {
          primary: 'ml',
          conversions: [
            { unit: 'ounce', factor: 29.5735 },
            { unit: 'liter', factor: 1000 }
          ]
        },
        costPrice: 12,
        pricing: {
          retail: 25,
          wholesale: 20,
          vip: 22,
          corporate: 18
        },
        stock: [
          { locationId: 'LOC001', quantity: 100, reserved: 10, available: 90, reorderLevel: 50, maxLevel: 200, value: 2500 },
          { locationId: 'LOC002', quantity: 75, reserved: 5, available: 70, reorderLevel: 30, maxLevel: 150, value: 1875 },
          { locationId: 'LOC003', quantity: 300, reserved: 75, available: 225, reorderLevel: 100, maxLevel: 500, value: 7500 },
          { locationId: 'LOC004', quantity: 150, reserved: 25, available: 125, reorderLevel: 75, maxLevel: 300, value: 3750 }
        ],
        totalStock: 625,
        totalValue: 15625,
        lastMovement: {
          type: 'out',
          quantity: 25,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          reference: 'PROD-2024-089'
        },
        alerts: [],
        images: ['/images/rose-essential-oil.jpg'],
        tags: ['essential oil', 'rose', 'bulgarian', 'premium']
      },
      {
        id: 'INV003',
        name: 'Royal Oud Perfume 50ml',
        nameArabic: 'عطر العود الملكي ٥٠ مل',
        sku: 'PERF-ROYAL-50ML',
        category: 'finished_product',
        subcategory: 'perfumes',
        batchNumber: 'ROP2024-03-20',
        manufactureDate: new Date('2024-03-20'),
        description: 'Luxury royal oud perfume in 50ml crystal bottle',
        specifications: {
          volume: 50,
          quality: 'premium',
          concentration: 20
        },
        units: {
          primary: 'piece',
          conversions: []
        },
        costPrice: 120,
        pricing: {
          retail: 280,
          wholesale: 220,
          vip: 250,
          corporate: 200,
          locationSpecific: [
            { locationId: 'LOC001', price: 320 }
          ]
        },
        stock: [
          { locationId: 'LOC001', quantity: 25, reserved: 3, available: 22, reorderLevel: 10, maxLevel: 50, value: 8000 },
          { locationId: 'LOC002', quantity: 15, reserved: 1, available: 14, reorderLevel: 5, maxLevel: 30, value: 4800 },
          { locationId: 'LOC003', quantity: 5, reserved: 0, available: 5, reorderLevel: 2, maxLevel: 10, value: 1600 },
          { locationId: 'LOC004', quantity: 35, reserved: 8, available: 27, reorderLevel: 15, maxLevel: 100, value: 11200 }
        ],
        totalStock: 80,
        totalValue: 25600,
        alerts: [
          {
            id: 'ALT001',
            type: 'low_stock',
            severity: 'medium',
            message: 'Stock below reorder level at Sharjah Heritage Store',
            locationId: 'LOC002',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
            isActive: true
          }
        ],
        images: ['/images/royal-oud-perfume.jpg'],
        tags: ['perfume', 'royal', 'oud', 'luxury', '50ml']
      },
      {
        id: 'INV004',
        name: 'Premium Glass Bottles 50ml',
        nameArabic: 'زجاجات زجاجية فاخرة ٥٠ مل',
        sku: 'PKG-GLASS-50ML',
        category: 'packaging',
        subcategory: 'bottles',
        supplier: 'Emirates Glass Manufacturing',
        description: 'Crystal clear glass bottles with gold cap',
        specifications: {
          volume: 50,
          quality: 'premium'
        },
        units: {
          primary: 'piece',
          conversions: []
        },
        costPrice: 8,
        pricing: {
          retail: 15,
          wholesale: 12,
          vip: 14,
          corporate: 10
        },
        stock: [
          { locationId: 'LOC003', quantity: 500, reserved: 100, available: 400, reorderLevel: 200, maxLevel: 1000, value: 7500 },
          { locationId: 'LOC004', quantity: 1200, reserved: 200, available: 1000, reorderLevel: 500, maxLevel: 2000, value: 18000 }
        ],
        totalStock: 1700,
        totalValue: 25500,
        alerts: [],
        images: ['/images/glass-bottles-50ml.jpg'],
        tags: ['packaging', 'bottles', 'glass', '50ml']
      }
    ]

    const mockStockMovements: StockMovement[] = [
      {
        id: 'MOV001',
        itemId: 'INV001',
        itemName: 'Premium Cambodian Oud Chips',
        type: 'receipt',
        toLocationId: 'LOC004',
        quantity: 50,
        unit: 'gram',
        costPrice: 45,
        totalValue: 2250,
        reference: 'PO-2024-156',
        batchNumber: 'CAM2024-03-15',
        createdBy: 'Hassan Mohammed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        approvedBy: 'Omar Abdullah',
        approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'MOV002',
        itemId: 'INV002',
        itemName: 'Rose Essential Oil',
        type: 'production_use',
        fromLocationId: 'LOC003',
        quantity: 25,
        unit: 'ml',
        costPrice: 12,
        totalValue: 300,
        reference: 'PROD-2024-089',
        createdBy: 'Production Team',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'MOV003',
        itemId: 'INV003',
        itemName: 'Royal Oud Perfume 50ml',
        type: 'sale',
        fromLocationId: 'LOC001',
        quantity: 2,
        unit: 'piece',
        totalValue: 640,
        reference: 'SALE-2024-1845',
        createdBy: 'Ahmed Al-Mansoori',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ]

    const mockMetrics: InventoryMetrics = {
      totalItems: 4567,
      totalValue: 1250000,
      totalValueAED: 1250000,
      lowStockItems: 23,
      zeroStockItems: 3,
      expiringItems: 8,
      totalLocations: 4,
      avgStockTurnover: 4.2,
      topCategories: [
        { category: 'raw_material', count: 1856, value: 650000 },
        { category: 'finished_product', count: 1234, value: 420000 },
        { category: 'packaging', count: 987, value: 125000 },
        { category: 'semi_finished', count: 345, value: 45000 },
        { category: 'accessories', count: 145, value: 10000 }
      ],
      recentMovements: mockStockMovements,
      alertsSummary: {
        critical: 2,
        high: 5,
        medium: 18,
        low: 34
      }
    }

    setLocations(mockLocations)
    setInventoryItems(mockInventoryItems)
    setStockMovements(mockStockMovements)
    setMetrics(mockMetrics)
  }

  const filteredItems = inventoryItems.filter(item => {
    if (selectedLocation !== 'all' && !item.stock.find(s => s.locationId === selectedLocation)) return false
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getStockLevel = (item: InventoryItem, locationId?: string) => {
    if (locationId && locationId !== 'all') {
      const locationStock = item.stock.find(s => s.locationId === locationId)
      return locationStock ? locationStock.available : 0
    }
    return item.stock.reduce((sum, s) => sum + s.available, 0)
  }

  const getStockStatus = (item: InventoryItem, locationId?: string) => {
    const stock = getStockLevel(item, locationId)
    const locationStock = locationId && locationId !== 'all'
      ? item.stock.find(s => s.locationId === locationId)
      : null
    const reorderLevel = locationStock ? locationStock.reorderLevel :
      item.stock.reduce((sum, s) => sum + s.reorderLevel, 0) / item.stock.length

    if (stock === 0) return { status: 'out_of_stock', color: 'bg-red-100 text-red-800' }
    if (stock <= reorderLevel) return { status: 'low_stock', color: 'bg-yellow-100 text-yellow-800' }
    return { status: 'in_stock', color: 'bg-green-100 text-green-800' }
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'store': return <Store className="h-4 w-4" />
      case 'warehouse': return <Warehouse className="h-4 w-4" />
      case 'factory': return <Factory className="h-4 w-4" />
      case 'distribution_center': return <Truck className="h-4 w-4" />
      default: return <Building className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'raw_material': return <Beaker className="h-4 w-4" />
      case 'semi_finished': return <Package2 className="h-4 w-4" />
      case 'finished_product': return <Sparkles className="h-4 w-4" />
      case 'packaging': return <Package className="h-4 w-4" />
      case 'accessories': return <Gem className="h-4 w-4" />
      default: return <Boxes className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatWeight = (weight: number, unit: string) => {
    return `${weight.toLocaleString()} ${unit}`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Manage luxury perfume and oud inventory across all locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/inventory/barcode')}>
            <Package className="mr-2 h-4 w-4" />
            Barcode
          </Button>
          <Button variant="outline" onClick={() => router.push('/inventory/analytics')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button variant="outline" onClick={() => router.push('/inventory/expiry')}>
            <Clock className="mr-2 h-4 w-4" />
            Expiry
          </Button>
          <Button variant="outline" onClick={() => router.push('/inventory/transfers')}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Transfers
          </Button>
          <Button onClick={() => router.push('/inventory/add-products')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalItems.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalValue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{metrics.lowStockItems}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.zeroStockItems}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Locations</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalLocations}</p>
                </div>
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Turnover Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.avgStockTurnover}x</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-600" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                <div className="flex items-center gap-2">
                  {getLocationIcon(location.type)}
                  {location.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={(val) => {
          if (val === 'raw_material') router.push('/inventory/raw-materials')
          else if (val === 'semi_finished') router.push('/inventory/semi-finished')
          else if (val === 'finished_product') router.push('/inventory/finished-goods')
          else setSelectedCategory(val)
        }}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="raw_material">Raw Materials</SelectItem>
            <SelectItem value="semi_finished">Semi-Finished</SelectItem>
            <SelectItem value="finished_product">Finished Products</SelectItem>
            <SelectItem value="packaging">Packaging</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => router.push('/inventory/comprehensive')}>
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Inventory Items</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Inventory by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metrics && (
                  <div className="space-y-4">
                    {metrics.topCategories.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-900">
                            {getCategoryIcon(category.category)}
                            <span className="capitalize">{category.category.replace('_', ' ')}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-900">{category.count} items</div>
                            <div className="text-gray-600">{formatCurrency(category.value)}</div>
                          </div>
                        </div>
                        <Progress
                          value={(category.value / metrics.totalValue) * 100}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metrics && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{metrics.alertsSummary.critical}</div>
                        <div className="text-sm font-medium text-red-700">Critical</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{metrics.alertsSummary.high}</div>
                        <div className="text-sm font-medium text-yellow-700">High</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{metrics.alertsSummary.medium}</div>
                        <div className="text-sm font-medium text-blue-700">Medium</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">{metrics.alertsSummary.low}</div>
                        <div className="text-sm font-medium text-gray-700">Low</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Clock className="h-5 w-5 text-blue-600" />
                Recent Stock Movements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900">Item</TableHead>
                    <TableHead className="text-gray-900">Type</TableHead>
                    <TableHead className="text-gray-900">Quantity</TableHead>
                    <TableHead className="text-gray-900">Location</TableHead>
                    <TableHead className="text-gray-900">Value</TableHead>
                    <TableHead className="text-gray-900">Date</TableHead>
                    <TableHead className="text-gray-900">Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.slice(0, 10).map((movement) => {
                    const location = locations.find(l =>
                      l.id === movement.fromLocationId || l.id === movement.toLocationId
                    )
                    return (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{movement.itemName}</p>
                            <p className="text-sm text-gray-600">ID: {movement.itemId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            movement.type === 'receipt' ? 'text-green-700' :
                            movement.type === 'sale' ? 'text-blue-700' :
                            movement.type === 'transfer' ? 'text-purple-700' :
                            'text-orange-700'
                          }>
                            {movement.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-900">{formatWeight(movement.quantity, movement.unit)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {location && getLocationIcon(location.type)}
                            <span className="text-sm text-gray-900">{location?.name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{formatCurrency(movement.totalValue)}</TableCell>
                        <TableCell className="text-gray-900">{movement.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell className="text-gray-900">{movement.reference}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900">Item Details</TableHead>
                    <TableHead className="text-gray-900">Category</TableHead>
                    <TableHead className="text-gray-900">Stock Level</TableHead>
                    <TableHead className="text-gray-900">Status</TableHead>
                    <TableHead className="text-gray-900">Unit Price</TableHead>
                    <TableHead className="text-gray-900">Total Value</TableHead>
                    <TableHead className="text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockLevel = getStockLevel(item, selectedLocation)
                    const stockStatus = getStockStatus(item, selectedLocation)

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              {item.specifications.quality === 'premium' && (
                                <Crown className="h-4 w-4 text-yellow-600" />
                              )}
                            </div>
                            {item.nameArabic && (
                              <p className="text-sm text-gray-600">{item.nameArabic}</p>
                            )}
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs text-gray-900">{item.sku}</Badge>
                              {item.batchNumber && (
                                <Badge variant="outline" className="text-xs text-gray-900">
                                  Batch: {item.batchNumber}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-900">
                            {getCategoryIcon(item.category)}
                            <span className="capitalize">{item.category.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatWeight(stockLevel, item.units.primary)}
                            </p>
                            {selectedLocation === 'all' && (
                              <p className="text-sm text-gray-600">
                                Across {item.stock.length} locations
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={stockStatus.color}>
                            {stockStatus.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{formatCurrency(item.pricing.retail)}</p>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs text-gray-900">
                                W: {formatCurrency(item.pricing.wholesale)}
                              </Badge>
                              <Badge variant="outline" className="text-xs text-gray-900">
                                VIP: {formatCurrency(item.pricing.vip)}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900">{formatCurrency(item.totalValue)}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => router.push('/inventory/add-products?edit=' + item.id)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => router.push('/inventory/adjustments?item=' + item.id)}>
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <Card key={location.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getLocationIcon(location.type)}
                      <CardTitle className="text-lg text-gray-900">{location.name}</CardTitle>
                    </div>
                    <Badge className={location.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {location.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-600">{location.address}, {location.city}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1 text-gray-900">
                        <span>Capacity Utilization</span>
                        <span>{location.currentUtilization}%</span>
                      </div>
                      <Progress value={location.currentUtilization} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Manager</p>
                        <p className="font-medium text-gray-900">{location.manager}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-medium capitalize text-gray-900">{location.type.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-600">Operating Hours</p>
                      <p className="font-medium text-gray-900">
                        {location.operatingHours.open} - {location.operatingHours.close}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => router.push('/inventory/comprehensive?location=' + location.id)}>
                        <Eye className="mr-1 h-3 w-3" />
                        View Stock
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => alert('Edit location: ' + location.name)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Stock Movement History</CardTitle>
              <CardDescription className="text-gray-600">Track all inventory movements across locations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900">Date & Time</TableHead>
                    <TableHead className="text-gray-900">Item</TableHead>
                    <TableHead className="text-gray-900">Movement Type</TableHead>
                    <TableHead className="text-gray-900">From/To</TableHead>
                    <TableHead className="text-gray-900">Quantity</TableHead>
                    <TableHead className="text-gray-900">Value</TableHead>
                    <TableHead className="text-gray-900">Reference</TableHead>
                    <TableHead className="text-gray-900">Created By</TableHead>
                    <TableHead className="text-gray-900">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => {
                    const fromLocation = movement.fromLocationId ?
                      locations.find(l => l.id === movement.fromLocationId) : null
                    const toLocation = movement.toLocationId ?
                      locations.find(l => l.id === movement.toLocationId) : null

                    return (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {movement.createdAt.toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {movement.createdAt.toLocaleTimeString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{movement.itemName}</p>
                            <p className="text-sm text-gray-600">ID: {movement.itemId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            movement.type === 'receipt' ? 'text-green-700' :
                            movement.type === 'sale' ? 'text-blue-700' :
                            movement.type === 'transfer' ? 'text-purple-700' :
                            movement.type === 'production_use' ? 'text-orange-700' :
                            movement.type === 'production_output' ? 'text-teal-700' :
                            'text-gray-700'
                          }>
                            {movement.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {fromLocation && (
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-600">From:</span>
                                {getLocationIcon(fromLocation.type)}
                                <span className="text-gray-900">{fromLocation.name}</span>
                              </div>
                            )}
                            {toLocation && (
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-600">To:</span>
                                {getLocationIcon(toLocation.type)}
                                <span className="text-gray-900">{toLocation.name}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900">
                            {formatWeight(movement.quantity, movement.unit)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900">{formatCurrency(movement.totalValue)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900">{movement.reference}</p>
                          {movement.batchNumber && (
                            <p className="text-sm text-gray-600">
                              Batch: {movement.batchNumber}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-900">{movement.createdBy}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            movement.approvedBy ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }>
                            {movement.approvedBy ? 'Approved' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">{metrics?.zeroStockItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">{metrics?.lowStockItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">Expiring Soon</p>
                    <p className="text-2xl font-bold text-orange-600">{metrics?.expiringItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Overstock</p>
                    <p className="text-2xl font-bold text-blue-600">7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Active Alerts</CardTitle>
              <CardDescription className="text-gray-600">Inventory alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryItems
                  .filter(item => item.alerts.length > 0)
                  .flatMap(item => item.alerts.map(alert => ({ ...alert, item })))
                  .map((alertWithItem) => (
                    <div key={alertWithItem.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          alertWithItem.severity === 'critical' ? 'bg-red-600' :
                          alertWithItem.severity === 'high' ? 'bg-orange-600' :
                          alertWithItem.severity === 'medium' ? 'bg-yellow-600' :
                          'bg-blue-600'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">{alertWithItem.item.name}</p>
                          <p className="text-sm text-gray-900">{alertWithItem.message}</p>
                          <p className="text-xs text-gray-600">
                            {alertWithItem.createdAt.toLocaleDateString()} •
                            {alertWithItem.locationId &&
                              ` ${locations.find(l => l.id === alertWithItem.locationId)?.name}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedItem(alertWithItem.item)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" onClick={() => alert('Resolving alert: ' + alertWithItem.id)}>
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Component stub functions
const StockTransferForm = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Stock Transfer form would be implemented here</p>
    <Button onClick={onClose}>Close</Button>
  </div>
)

const AddInventoryItemForm = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Add Inventory Item form would be implemented here</p>
    <Button onClick={onClose}>Close</Button>
  </div>
)