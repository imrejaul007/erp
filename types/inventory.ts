import type { Prisma } from '@prisma/client'

// ===== BASIC TYPES =====

export type Unit = 'GRAM' | 'KILOGRAM' | 'TOLA' | 'ML' | 'LITER' | 'PIECE' | 'BOTTLE' | 'VIAL'

export type MaterialGrade = 'PREMIUM' | 'STANDARD' | 'ECONOMY' | 'SPECIAL' | 'ORGANIC' | 'SYNTHETIC'

export type StockMovementType =
  | 'IN'
  | 'OUT'
  | 'ADJUSTMENT'
  | 'PRODUCTION_IN'
  | 'PRODUCTION_OUT'
  | 'WASTE'
  | 'TRANSFER'

export type StockAlertType =
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'OVERSTOCK'
  | 'EXPIRY_WARNING'
  | 'EXPIRY_URGENT'
  | 'QUALITY_ISSUE'
  | 'BATCH_RECALL'

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type InventoryReportType =
  | 'STOCK_LEVELS'
  | 'LOW_STOCK'
  | 'AGING_ANALYSIS'
  | 'COST_ANALYSIS'
  | 'BATCH_TRACKING'
  | 'MOVEMENT_HISTORY'
  | 'CONSUMPTION_TRENDS'
  | 'SUPPLIER_PERFORMANCE'

// ===== EXTENDED TYPES =====

export type MaterialWithBatches = Prisma.MaterialGetPayload<{
  include: {
    category: true
    batches: true
    stockAlerts: true
    stockMovements: {
      orderBy: { createdAt: 'desc' }
      take: 10
    }
  }
}>

export type MaterialBatchWithMaterial = Prisma.MaterialBatchGetPayload<{
  include: {
    material: {
      include: {
        category: true
      }
    }
    stockMovements: true
  }
}>

export type StockMovementWithMaterial = Prisma.StockMovementGetPayload<{
  include: {
    material: {
      include: {
        category: true
      }
    }
  }
}>

export type StockAlertWithMaterial = Prisma.StockAlertGetPayload<{
  include: {
    material: {
      include: {
        category: true
      }
    }
  }
}>

// ===== FORM TYPES =====

export interface CreateMaterialForm {
  name: string
  description?: string
  sku: string
  categoryId: string
  unitOfMeasure: string
  density?: number
  alternateUnits?: AlternateUnit[]
  costPerUnit: number
  currency: string
  minimumStock: number
  maximumStock?: number
  reorderLevel: number
  supplier?: string
  supplierCode?: string
  supplierPrice?: number
  grade: MaterialGrade
  origin?: string
}

export interface CreateMaterialBatchForm {
  materialId: string
  batchNumber: string
  quantity: number
  unit: string
  costPerUnit: number
  grade: MaterialGrade
  origin?: string
  qualityNotes?: string
  receivedDate: Date
  expiryDate?: Date
  manufacturingDate?: Date
  location?: string
  storageConditions?: string
}

export interface StockMovementForm {
  materialId: string
  batchId?: string
  type: StockMovementType
  quantity: number
  unit: string
  unitCost?: number
  reference?: string
  notes?: string
  fromLocation?: string
  toLocation?: string
}

// ===== UTILITY TYPES =====

export interface AlternateUnit {
  unit: string
  factor: number
  isDefault?: boolean
}

export interface UnitConversionRule {
  fromUnit: string
  toUnit: string
  factor: number
  materialId?: string
  notes?: string
}

export interface StockLevel {
  materialId: string
  materialName: string
  currentStock: number
  availableStock: number
  reservedStock: number
  unit: string
  reorderLevel: number
  status: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK' | 'OVERSTOCK'
}

export interface BatchInfo {
  id: string
  batchNumber: string
  materialName: string
  quantity: number
  currentStock: number
  unit: string
  grade: MaterialGrade
  origin?: string
  receivedDate: Date
  expiryDate?: Date
  daysUntilExpiry?: number
  isExpired: boolean
  location?: string
}

// ===== SEARCH & FILTER TYPES =====

export interface MaterialFilters {
  categoryId?: string
  grade?: MaterialGrade
  supplier?: string
  stockStatus?: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK' | 'OVERSTOCK'
  search?: string
  sortBy?: 'name' | 'stock' | 'lastUpdated' | 'cost'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface BatchFilters {
  materialId?: string
  grade?: MaterialGrade
  origin?: string
  expiryStatus?: 'FRESH' | 'EXPIRING_SOON' | 'EXPIRED'
  location?: string
  search?: string
  sortBy?: 'receivedDate' | 'expiryDate' | 'quantity'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface StockMovementFilters {
  materialId?: string
  type?: StockMovementType
  dateFrom?: Date
  dateTo?: Date
  search?: string
  sortBy?: 'createdAt' | 'quantity'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// ===== DASHBOARD TYPES =====

export interface InventoryStats {
  totalMaterials: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  expiringItems: number
  totalBatches: number
  avgStockLevel: number
  topCategories: Array<{
    name: string
    count: number
    value: number
  }>
}

export interface StockTrend {
  date: string
  totalStock: number
  totalValue: number
  movements: number
}

export interface ConsumptionPattern {
  materialId: string
  materialName: string
  totalConsumption: number
  unit: string
  trend: 'INCREASING' | 'DECREASING' | 'STABLE'
  periodComparison: number // percentage change
}

// ===== REPORT TYPES =====

export interface InventoryReportData {
  reportType: InventoryReportType
  generatedAt: Date
  filters?: Record<string, any>
  summary: Record<string, any>
  details: Record<string, any>[]
  charts?: Record<string, any>[]
}

export interface AgingAnalysisReport {
  materialId: string
  materialName: string
  batches: Array<{
    batchNumber: string
    ageInDays: number
    quantity: number
    value: number
    status: 'FRESH' | 'AGING' | 'OLD' | 'EXPIRED'
  }>
  totalValue: number
  averageAge: number
}

// ===== API RESPONSE TYPES =====

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ===== CONSTANTS =====

export const UNIT_CONVERSIONS = {
  // Weight conversions (base: grams)
  GRAM_TO_KILOGRAM: 0.001,
  KILOGRAM_TO_GRAM: 1000,
  GRAM_TO_TOLA: 0.085735, // 1 tola = 11.66 grams
  TOLA_TO_GRAM: 11.66,

  // Volume conversions (base: ml)
  ML_TO_LITER: 0.001,
  LITER_TO_ML: 1000,
} as const

export const PERFUME_DENSITY = {
  // Common perfume densities (g/ml)
  ALCOHOL_BASE: 0.8, // Typical alcohol-based perfume
  OIL_BASE: 0.9,     // Typical oil-based perfume
  WATER_BASE: 1.0,   // Water-based solutions
  PURE_OUD: 0.85,    // Pure oud oil
  ATTAR: 0.85,       // Traditional attar
} as const

export const STOCK_STATUS_COLORS = {
  NORMAL: 'bg-green-100 text-green-800',
  LOW: 'bg-yellow-100 text-yellow-800',
  OUT_OF_STOCK: 'bg-red-100 text-red-800',
  OVERSTOCK: 'bg-blue-100 text-blue-800',
} as const

export const GRADE_COLORS = {
  PREMIUM: 'bg-purple-100 text-purple-800',
  STANDARD: 'bg-blue-100 text-blue-800',
  ECONOMY: 'bg-gray-100 text-gray-800',
  SPECIAL: 'bg-indigo-100 text-indigo-800',
  ORGANIC: 'bg-green-100 text-green-800',
  SYNTHETIC: 'bg-orange-100 text-orange-800',
} as const