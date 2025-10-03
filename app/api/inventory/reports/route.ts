import { NextRequest } from 'next/server'
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { differenceInDays, subDays, subMonths, format } from 'date-fns'

const generateReportSchema = z.object({
  reportType: z.enum([
    'STOCK_LEVELS',
    'LOW_STOCK',
    'AGING_ANALYSIS',
    'COST_ANALYSIS',
    'BATCH_TRACKING',
    'MOVEMENT_HISTORY',
    'CONSUMPTION_TRENDS',
    'SUPPLIER_PERFORMANCE'
  ]),
  filters: z.object({
    dateFrom: z.string().transform(str => new Date(str)).optional(),
    dateTo: z.string().transform(str => new Date(str)).optional(),
    categoryIds: z.array(z.string()).optional(),
    materialIds: z.array(z.string()).optional(),
    supplierIds: z.array(z.string()).optional(),
    grades: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
  }).optional(),
  format: z.enum(['JSON', 'CSV', 'PDF']).default('JSON'),
})

// GET /api/inventory/reports - Get saved reports
async function getHandler(request: NextRequest, { tenantId, user }: { tenantId: string; user: any }) {
  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('reportType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      tenantId
    }
    if (reportType) {
      where.reportType = reportType
    }

    const [reports, total] = await Promise.all([
      prisma.inventoryReport.findMany({
        where,
        orderBy: { generatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inventoryReport.count({ where }),
    ])

    const pages = Math.ceil(total / limit)

    return apiResponse({
      data: reports,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return apiError('Failed to fetch reports: ' + (error instanceof Error ? error.message : 'Unknown error'), 500)
  }
}

// POST /api/inventory/reports - Generate new report
async function postHandler(request: NextRequest, { tenantId, user }: { tenantId: string; user: any }) {
  try {
    const body = await request.json()
    const validatedData = generateReportSchema.parse(body)

    let reportData: any = {}
    let title = ''
    let description = ''

    const filters = validatedData.filters || {}
    const dateFrom = filters.dateFrom || subMonths(new Date(), 3)
    const dateTo = filters.dateTo || new Date()

    switch (validatedData.reportType) {
      case 'STOCK_LEVELS':
        reportData = await generateStockLevelsReport(filters, tenantId)
        title = 'Current Stock Levels Report'
        description = 'Overview of all material stock levels and statuses'
        break

      case 'LOW_STOCK':
        reportData = await generateLowStockReport(filters, tenantId)
        title = 'Low Stock Alert Report'
        description = 'Materials requiring immediate attention due to low stock'
        break

      case 'AGING_ANALYSIS':
        reportData = await generateAgingAnalysisReport(filters, tenantId)
        title = 'Inventory Aging Analysis'
        description = 'Analysis of inventory age and expiry status'
        break

      case 'COST_ANALYSIS':
        reportData = await generateCostAnalysisReport(filters, dateFrom, dateTo, tenantId)
        title = 'Inventory Cost Analysis'
        description = 'Financial analysis of inventory value and costs'
        break

      case 'BATCH_TRACKING':
        reportData = await generateBatchTrackingReport(filters, tenantId)
        title = 'Batch Tracking Report'
        description = 'Detailed batch information and movement history'
        break

      case 'MOVEMENT_HISTORY':
        reportData = await generateMovementHistoryReport(filters, dateFrom, dateTo, tenantId)
        title = 'Stock Movement History'
        description = 'Historical analysis of stock movements and transactions'
        break

      case 'CONSUMPTION_TRENDS':
        reportData = await generateConsumptionTrendsReport(filters, dateFrom, dateTo, tenantId)
        title = 'Material Consumption Trends'
        description = 'Analysis of material usage patterns and forecasting'
        break

      case 'SUPPLIER_PERFORMANCE':
        reportData = await generateSupplierPerformanceReport(filters, dateFrom, dateTo, tenantId)
        title = 'Supplier Performance Analysis'
        description = 'Evaluation of supplier reliability and cost performance'
        break

      default:
        return apiError('Invalid report type', 400)
    }

    // Save report to database
    const savedReport = await prisma.inventoryReport.create({
      data: {
        tenantId,
        reportType: validatedData.reportType,
        title,
        description,
        data: reportData,
        filters: validatedData.filters || {},
        generatedBy: user.id,
      },
    })

    return apiResponse({
      report: savedReport,
      ...(validatedData.format === 'JSON' ? { reportData } : {}),
    }, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + JSON.stringify(error.errors), 400)
    }

    console.error('Error generating report:', error)
    return apiError('Failed to generate report: ' + (error instanceof Error ? error.message : 'Unknown error'), 500)
  }
}

// Report generation functions
async function generateStockLevelsReport(filters: any, tenantId: string) {
  const where: any = {
    isActive: true,
    tenantId
  }

  if (filters.categoryIds?.length) {
    where.categoryId = { in: filters.categoryIds }
  }
  if (filters.materialIds?.length) {
    where.id = { in: filters.materialIds }
  }
  if (filters.grades?.length) {
    where.grade = { in: filters.grades }
  }

  const materials = await prisma.material.findMany({
    where,
    include: {
      category: true,
      batches: {
        where: { currentStock: { gt: 0 } },
        select: {
          id: true,
          batchNumber: true,
          currentStock: true,
          expiryDate: true,
          location: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  const summary = {
    totalMaterials: materials.length,
    totalValue: materials.reduce((sum, m) => sum + (m.currentStock * m.costPerUnit), 0),
    lowStockCount: materials.filter(m => m.currentStock <= m.reorderLevel).length,
    outOfStockCount: materials.filter(m => m.currentStock <= 0).length,
    overstockCount: materials.filter(m => m.maxStockLevel && m.currentStock >= m.maxStockLevel).length,
  }

  const stockLevels = materials.map(material => {
    const stockStatus = material.currentStock <= 0 ? 'OUT_OF_STOCK' :
                       material.currentStock <= material.reorderLevel ? 'LOW' :
                       material.maxStockLevel && material.currentStock >= material.maxStockLevel ? 'OVERSTOCK' :
                       'NORMAL'

    return {
      materialId: material.id,
      name: material.name,
      sku: material.sku,
      category: material.category?.name,
      currentStock: material.currentStock,
      availableStock: material.availableStock,
      reservedStock: material.reservedStock,
      reorderLevel: material.reorderLevel,
      maxStockLevel: material.maxStockLevel,
      unit: material.unitOfMeasure,
      costPerUnit: material.costPerUnit,
      totalValue: material.currentStock * material.costPerUnit,
      status: stockStatus,
      activeBatches: material.batches.length,
      supplier: material.supplier,
      grade: material.grade,
    }
  })

  return {
    summary,
    stockLevels,
    categories: materials.reduce((acc, m) => {
      const catName = m.category?.name || 'Uncategorized'
      if (!acc[catName]) {
        acc[catName] = { count: 0, value: 0 }
      }
      acc[catName].count++
      acc[catName].value += m.currentStock * m.costPerUnit
      return acc
    }, {} as Record<string, any>),
  }
}

async function generateLowStockReport(filters: any, tenantId: string) {
  const where: any = {
    isActive: true,
    tenantId,
    OR: [
      { currentStock: { lte: 0 } },
      { currentStock: { lte: { reorderLevel: true } } },
    ],
  }

  if (filters.categoryIds?.length) {
    where.categoryId = { in: filters.categoryIds }
  }

  const materials = await prisma.material.findMany({
    where,
    include: {
      category: true,
      stockAlerts: {
        where: {
          type: { in: ['LOW_STOCK', 'OUT_OF_STOCK'] },
          isResolved: false,
        },
      },
    },
    orderBy: [
      { currentStock: 'asc' },
      { name: 'asc' },
    ],
  })

  return {
    summary: {
      totalAffectedMaterials: materials.length,
      outOfStock: materials.filter(m => m.currentStock <= 0).length,
      lowStock: materials.filter(m => m.currentStock > 0 && m.currentStock <= m.reorderLevel).length,
      totalValueAtRisk: materials.reduce((sum, m) => sum + (m.reorderLevel * m.costPerUnit), 0),
    },
    materials: materials.map(material => ({
      materialId: material.id,
      name: material.name,
      sku: material.sku,
      category: material.category?.name,
      currentStock: material.currentStock,
      reorderLevel: material.reorderLevel,
      shortfall: Math.max(0, material.reorderLevel - material.currentStock),
      unit: material.unitOfMeasure,
      costPerUnit: material.costPerUnit,
      reorderCost: Math.max(0, material.reorderLevel - material.currentStock) * material.costPerUnit,
      supplier: material.supplier,
      lastAlert: material.stockAlerts[0]?.createdAt,
      priority: material.currentStock <= 0 ? 'CRITICAL' : 'HIGH',
    })),
  }
}

async function generateAgingAnalysisReport(filters: any, tenantId: string) {
  const where: any = {
    material: { tenantId }
  }

  if (filters.materialIds?.length) {
    where.materialId = { in: filters.materialIds }
  }
  if (filters.locations?.length) {
    where.location = { in: filters.locations }
  }

  const batches = await prisma.materialBatch.findMany({
    where,
    include: {
      material: {
        include: { category: true },
      },
    },
    orderBy: { receivedDate: 'asc' },
  })

  const now = new Date()
  const agingAnalysis = batches.map(batch => {
    const ageInDays = differenceInDays(now, new Date(batch.receivedDate))
    const daysUntilExpiry = batch.expiryDate ? differenceInDays(new Date(batch.expiryDate), now) : null

    let agingCategory = 'FRESH'
    if (ageInDays > 365) agingCategory = 'OLD'
    else if (ageInDays > 180) agingCategory = 'AGING'
    else if (ageInDays > 90) agingCategory = 'MATURE'

    let expiryStatus = 'NO_EXPIRY'
    if (daysUntilExpiry !== null) {
      if (daysUntilExpiry <= 0) expiryStatus = 'EXPIRED'
      else if (daysUntilExpiry <= 7) expiryStatus = 'EXPIRES_SOON'
      else if (daysUntilExpiry <= 30) expiryStatus = 'EXPIRING'
      else expiryStatus = 'FRESH'
    }

    return {
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      materialName: batch.material.name,
      category: batch.material.category?.name,
      receivedDate: batch.receivedDate,
      expiryDate: batch.expiryDate,
      ageInDays,
      daysUntilExpiry,
      agingCategory,
      expiryStatus,
      currentStock: batch.currentStock,
      originalQuantity: batch.quantity,
      unit: batch.unit,
      currentValue: batch.currentStock * batch.costPerUnit,
      location: batch.location,
      grade: batch.grade,
    }
  })

  const summary = {
    totalBatches: batches.length,
    totalValue: agingAnalysis.reduce((sum, b) => sum + b.currentValue, 0),
    agingBreakdown: agingAnalysis.reduce((acc, b) => {
      acc[b.agingCategory] = (acc[b.agingCategory] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    expiryBreakdown: agingAnalysis.reduce((acc, b) => {
      acc[b.expiryStatus] = (acc[b.expiryStatus] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    averageAge: agingAnalysis.length > 0 ?
      agingAnalysis.reduce((sum, b) => sum + b.ageInDays, 0) / agingAnalysis.length : 0,
  }

  return { summary, batches: agingAnalysis }
}

async function generateCostAnalysisReport(filters: any, dateFrom: Date, dateTo: Date, tenantId: string) {
  // Get materials with cost information
  const materials = await prisma.material.findMany({
    where: {
      isActive: true,
      tenantId,
      ...(filters.categoryIds?.length && { categoryId: { in: filters.categoryIds } }),
    },
    include: { category: true },
  })

  // Get stock movements in date range for cost tracking
  const movements = await prisma.stockMovement.findMany({
    where: {
      createdAt: { gte: dateFrom, lte: dateTo },
      type: { in: ['IN', 'OUT', 'PRODUCTION_OUT'] },
      material: { tenantId },
      ...(filters.materialIds?.length && { materialId: { in: filters.materialIds } }),
    },
    include: {
      material: {
        include: { category: true },
      },
    },
  })

  const totalCurrentValue = materials.reduce((sum, m) => sum + (m.currentStock * m.costPerUnit), 0)
  const totalInValue = movements.filter(m => m.type === 'IN').reduce((sum, m) => sum + (m.quantity * (m.unitCost || m.material.costPerUnit)), 0)
  const totalOutValue = movements.filter(m => ['OUT', 'PRODUCTION_OUT'].includes(m.type)).reduce((sum, m) => sum + (m.quantity * (m.unitCost || m.material.costPerUnit)), 0)

  return {
    summary: {
      totalCurrentValue,
      totalInValue,
      totalOutValue,
      netValueChange: totalInValue - totalOutValue,
      turnoverRate: totalCurrentValue > 0 ? totalOutValue / totalCurrentValue : 0,
    },
    materials: materials.map(m => ({
      materialId: m.id,
      name: m.name,
      category: m.category?.name,
      currentStock: m.currentStock,
      costPerUnit: m.costPerUnit,
      totalValue: m.currentStock * m.costPerUnit,
      supplier: m.supplier,
      supplierPrice: m.supplierPrice,
      costVariance: m.supplierPrice ? ((m.costPerUnit - m.supplierPrice) / m.supplierPrice) * 100 : null,
    })),
    movements: movements.map(m => ({
      id: m.id,
      materialName: m.material.name,
      type: m.type,
      quantity: m.quantity,
      unitCost: m.unitCost || m.material.costPerUnit,
      totalCost: m.quantity * (m.unitCost || m.material.costPerUnit),
      createdAt: m.createdAt,
    })),
  }
}

async function generateBatchTrackingReport(filters: any, tenantId: string) {
  const where: any = {
    material: { tenantId }
  }

  if (filters.materialIds?.length) {
    where.materialId = { in: filters.materialIds }
  }
  if (filters.locations?.length) {
    where.location = { in: filters.locations }
  }

  const batches = await prisma.materialBatch.findMany({
    where,
    include: {
      material: {
        include: { category: true },
      },
      stockMovements: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
    orderBy: { receivedDate: 'desc' },
  })

  return {
    summary: {
      totalBatches: batches.length,
      activeBatches: batches.filter(b => b.currentStock > 0).length,
      expiredBatches: batches.filter(b => b.isExpired).length,
      totalValue: batches.reduce((sum, b) => sum + (b.currentStock * b.costPerUnit), 0),
    },
    batches: batches.map(batch => ({
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      materialName: batch.material.name,
      category: batch.material.category?.name,
      originalQuantity: batch.quantity,
      currentStock: batch.currentStock,
      unit: batch.unit,
      grade: batch.grade,
      origin: batch.origin,
      receivedDate: batch.receivedDate,
      expiryDate: batch.expiryDate,
      isExpired: batch.isExpired,
      location: batch.location,
      storageConditions: batch.storageConditions,
      costPerUnit: batch.costPerUnit,
      totalCost: batch.totalCost,
      currentValue: batch.currentStock * batch.costPerUnit,
      utilization: ((batch.quantity - batch.currentStock) / batch.quantity) * 100,
      recentMovements: batch.stockMovements.map(m => ({
        type: m.type,
        quantity: m.quantity,
        createdAt: m.createdAt,
        reason: m.reason,
      })),
    })),
  }
}

async function generateMovementHistoryReport(filters: any, dateFrom: Date, dateTo: Date, tenantId: string) {
  const where: any = {
    createdAt: { gte: dateFrom, lte: dateTo },
    material: { tenantId }
  }

  if (filters.materialIds?.length) {
    where.materialId = { in: filters.materialIds }
  }

  const movements = await prisma.stockMovement.findMany({
    where,
    include: {
      material: {
        include: { category: true },
      },
      batch: {
        select: { batchNumber: true, grade: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const summary = movements.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + m.quantity
    return acc
  }, {} as Record<string, number>)

  return {
    summary: {
      totalMovements: movements.length,
      dateRange: { from: dateFrom, to: dateTo },
      movementTypes: summary,
      totalInbound: (summary.IN || 0) + (summary.PRODUCTION_IN || 0) + (summary.ADJUSTMENT || 0),
      totalOutbound: (summary.OUT || 0) + (summary.PRODUCTION_OUT || 0) + (summary.WASTE || 0),
    },
    movements: movements.map(m => ({
      id: m.id,
      materialName: m.material.name,
      category: m.material.category?.name,
      batchNumber: m.batch?.batchNumber,
      type: m.type,
      quantity: m.quantity,
      unit: m.unit,
      reason: m.reason,
      reference: m.referenceType && m.referenceId ? `${m.referenceType}:${m.referenceId}` : null,
      performedBy: m.performedBy,
      createdAt: m.createdAt,
    })),
  }
}

async function generateConsumptionTrendsReport(filters: any, dateFrom: Date, dateTo: Date, tenantId: string) {
  const movements = await prisma.stockMovement.findMany({
    where: {
      type: { in: ['OUT', 'PRODUCTION_OUT', 'WASTE'] },
      createdAt: { gte: dateFrom, lte: dateTo },
      material: { tenantId },
      ...(filters.materialIds?.length && { materialId: { in: filters.materialIds } }),
    },
    include: {
      material: {
        include: { category: true },
      },
    },
  })

  // Group by material and calculate consumption patterns
  const consumptionByMaterial = movements.reduce((acc, m) => {
    if (!acc[m.materialId]) {
      acc[m.materialId] = {
        materialId: m.materialId,
        materialName: m.material.name,
        category: m.material.category?.name,
        totalConsumption: 0,
        movementCount: 0,
        unit: m.unit,
      }
    }
    acc[m.materialId].totalConsumption += m.quantity
    acc[m.materialId].movementCount += 1
    return acc
  }, {} as Record<string, any>)

  const consumptionData = Object.values(consumptionByMaterial)
    .sort((a: any, b: any) => b.totalConsumption - a.totalConsumption)

  return {
    summary: {
      totalConsumption: movements.reduce((sum, m) => sum + m.quantity, 0),
      materialCount: Object.keys(consumptionByMaterial).length,
      dateRange: { from: dateFrom, to: dateTo },
      topConsumers: consumptionData.slice(0, 10),
    },
    trends: consumptionData.map((item: any) => ({
      ...item,
      averageConsumption: item.totalConsumption / item.movementCount,
      frequency: item.movementCount,
      trend: 'STABLE', // In real app, calculate trend from historical data
    })),
  }
}

async function generateSupplierPerformanceReport(filters: any, dateFrom: Date, dateTo: Date, tenantId: string) {
  // Get materials grouped by supplier
  const materials = await prisma.material.findMany({
    where: {
      isActive: true,
      tenantId,
      supplier: { not: null },
      ...(filters.materialIds?.length && { id: { in: filters.materialIds } }),
    },
    include: {
      category: true,
      batches: {
        where: {
          receivedDate: { gte: dateFrom, lte: dateTo },
        },
      },
    },
  })

  // Group by supplier
  const supplierData = materials.reduce((acc, material) => {
    const supplier = material.supplier!
    if (!acc[supplier]) {
      acc[supplier] = {
        supplier,
        materialCount: 0,
        batchCount: 0,
        totalValue: 0,
        averageCost: 0,
        materials: [],
      }
    }

    acc[supplier].materialCount += 1
    acc[supplier].batchCount += material.batches.length
    acc[supplier].totalValue += material.currentStock * material.costPerUnit

    acc[supplier].materials.push({
      name: material.name,
      sku: material.sku,
      currentStock: material.currentStock,
      costPerUnit: material.costPerUnit,
      supplierPrice: material.supplierPrice,
      batchesReceived: material.batches.length,
    })

    return acc
  }, {} as Record<string, any>)

  // Calculate averages
  Object.values(supplierData).forEach((data: any) => {
    data.averageCost = data.totalValue / Math.max(1, data.materials.reduce((sum: number, m: any) => sum + m.currentStock, 0))
  })

  return {
    summary: {
      totalSuppliers: Object.keys(supplierData).length,
      totalMaterials: materials.length,
      totalValue: Object.values(supplierData).reduce((sum: number, data: any) => sum + data.totalValue, 0),
      dateRange: { from: dateFrom, to: dateTo },
    },
    suppliers: Object.values(supplierData).sort((a: any, b: any) => b.totalValue - a.totalValue),
  }
}

export const GET = withTenant(getHandler);
export const POST = withTenant(postHandler);
