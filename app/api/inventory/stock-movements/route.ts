import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware'

const createMovementSchema = z.object({
  materialId: z.string().min(1, 'Material ID is required'),
  batchId: z.string().optional(),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'PRODUCTION_IN', 'PRODUCTION_OUT', 'WASTE', 'TRANSFER']),
  quantity: z.number().min(0.001, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  unitCost: z.number().min(0).optional(),
  reason: z.string().optional(),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
  notes: z.string().optional(),
  fromLocation: z.string().optional(),
  toLocation: z.string().optional(),
  performedBy: z.string().optional(),
})

const adjustmentSchema = z.object({
  materialId: z.string().min(1, 'Material ID is required'),
  adjustmentType: z.enum(['increase', 'decrease', 'set']),
  quantity: z.number().min(0, 'Quantity must be non-negative'),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
})

// GET /api/inventory/stock-movements - Get stock movements with filtering
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const materialId = searchParams.get('materialId') || undefined
    const batchId = searchParams.get('batchId') || undefined
    const type = searchParams.get('type') || undefined
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause with tenantId
    const where: any = {
      tenantId,
    }

    if (materialId) {
      where.materialId = materialId
    }

    if (batchId) {
      where.batchId = batchId
    }

    if (type) {
      where.type = type
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    // Build orderBy
    let orderBy: any = {}
    switch (sortBy) {
      case 'createdAt':
        orderBy.createdAt = sortOrder
        break
      case 'quantity':
        orderBy.quantity = sortOrder
        break
      default:
        orderBy.createdAt = 'desc'
    }

    // Get movements with related data
    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          material: {
            include: {
              category: true,
            },
          },
          batch: {
            select: {
              id: true,
              batchNumber: true,
              grade: true,
              origin: true,
            },
          },
        },
      }),
      prisma.stockMovement.count({ where }),
    ])

    const pages = Math.ceil(total / limit)

    // Calculate summary statistics
    const summaryWhere: any = { tenantId }
    if (dateFrom || dateTo) {
      summaryWhere.createdAt = {
        gte: dateFrom ? new Date(dateFrom) : undefined,
        lte: dateTo ? new Date(dateTo) : undefined,
      }
    }

    const summary = await prisma.stockMovement.groupBy({
      by: ['type'],
      where: summaryWhere,
      _sum: {
        quantity: true,
      },
      _count: {
        id: true,
      },
    })

    return apiResponse({
      data: movements,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
      summary: summary.reduce((acc, item) => {
        acc[item.type] = {
          count: item._count.id,
          totalQuantity: item._sum.quantity || 0,
        }
        return acc
      }, {} as Record<string, any>),
    })
  } catch (error) {
    console.error('Error fetching stock movements:', error)
    return apiError('Failed to fetch stock movements', 500)
  }
})

// POST /api/inventory/stock-movements - Create stock movement
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json()
    const validatedData = createMovementSchema.parse(body)

    // Check if material exists and belongs to tenant
    const material = await prisma.material.findUnique({
      where: { id: validatedData.materialId },
      include: {
        batches: validatedData.batchId ? {
          where: { id: validatedData.batchId }
        } : false,
      },
    })

    if (!material) {
      return apiError('Material not found', 404)
    }

    if (material.tenantId !== tenantId) {
      return apiError('Material does not belong to your organization', 403)
    }

    // Validate batch if specified
    let selectedBatch = null
    if (validatedData.batchId) {
      selectedBatch = await prisma.materialBatch.findUnique({
        where: { id: validatedData.batchId },
      })

      if (!selectedBatch) {
        return apiError('Batch not found', 404)
      }

      if (selectedBatch.tenantId !== tenantId) {
        return apiError('Batch does not belong to your organization', 403)
      }

      if (selectedBatch.materialId !== validatedData.materialId) {
        return apiError('Batch does not belong to the specified material', 400)
      }
    }

    // Validate stock availability for OUT movements
    if (['OUT', 'PRODUCTION_OUT', 'WASTE'].includes(validatedData.type)) {
      const availableStock = selectedBatch?.currentStock || material.availableStock

      if (availableStock < validatedData.quantity) {
        return apiError(`Insufficient stock available. Requested: ${validatedData.quantity}, Available: ${availableStock}`, 400)
      }
    }

    // Create movement in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create stock movement record
      const movement = await tx.stockMovement.create({
        data: {
          ...validatedData,
          tenantId,
          performedBy: user?.email || validatedData.performedBy || 'current-user',
        },
        include: {
          material: {
            include: {
              category: true,
            },
          },
          batch: {
            select: {
              id: true,
              batchNumber: true,
              grade: true,
              origin: true,
            },
          },
        },
      })

      // Update stock levels based on movement type
      const stockChange = ['IN', 'PRODUCTION_IN'].includes(validatedData.type)
        ? validatedData.quantity
        : -validatedData.quantity

      // Update material stock
      if (validatedData.type !== 'TRANSFER') {
        await tx.material.update({
          where: {
            id: validatedData.materialId,
            tenantId,
          },
          data: {
            currentStock: {
              increment: stockChange,
            },
            availableStock: {
              increment: stockChange,
            },
          },
        })
      }

      // Update batch stock if specified
      if (validatedData.batchId && selectedBatch) {
        await tx.materialBatch.update({
          where: {
            id: validatedData.batchId,
            tenantId,
          },
          data: {
            currentStock: {
              increment: stockChange,
            },
          },
        })
      }

      // Check for alerts after stock update
      const updatedMaterial = await tx.material.findUnique({
        where: {
          id: validatedData.materialId,
          tenantId,
        },
      })

      if (updatedMaterial) {
        // Check for low stock alert
        if (updatedMaterial.currentStock <= updatedMaterial.reorderLevel &&
            updatedMaterial.currentStock > 0) {
          await tx.stockAlert.upsert({
            where: {
              materialId_type: {
                materialId: validatedData.materialId,
                type: 'LOW_STOCK',
              },
            },
            update: {
              currentLevel: updatedMaterial.currentStock,
              thresholdLevel: updatedMaterial.reorderLevel,
              isResolved: false,
            },
            create: {
              materialId: validatedData.materialId,
              tenantId,
              type: 'LOW_STOCK',
              severity: 'MEDIUM',
              title: `Low Stock: ${updatedMaterial.name}`,
              message: `Stock level (${updatedMaterial.currentStock}) has fallen below reorder level (${updatedMaterial.reorderLevel})`,
              currentLevel: updatedMaterial.currentStock,
              thresholdLevel: updatedMaterial.reorderLevel,
            },
          })
        }

        // Check for out of stock alert
        if (updatedMaterial.currentStock <= 0) {
          await tx.stockAlert.upsert({
            where: {
              materialId_type: {
                materialId: validatedData.materialId,
                type: 'OUT_OF_STOCK',
              },
            },
            update: {
              currentLevel: updatedMaterial.currentStock,
              isResolved: false,
            },
            create: {
              materialId: validatedData.materialId,
              tenantId,
              type: 'OUT_OF_STOCK',
              severity: 'HIGH',
              title: `Out of Stock: ${updatedMaterial.name}`,
              message: `Material is now out of stock`,
              currentLevel: updatedMaterial.currentStock,
              thresholdLevel: 0,
            },
          })
        }

        // Check for overstock alert
        if (updatedMaterial.maxStockLevel &&
            updatedMaterial.currentStock >= updatedMaterial.maxStockLevel) {
          await tx.stockAlert.upsert({
            where: {
              materialId_type: {
                materialId: validatedData.materialId,
                type: 'OVERSTOCK',
              },
            },
            update: {
              currentLevel: updatedMaterial.currentStock,
              thresholdLevel: updatedMaterial.maxStockLevel,
              isResolved: false,
            },
            create: {
              materialId: validatedData.materialId,
              tenantId,
              type: 'OVERSTOCK',
              severity: 'LOW',
              title: `Overstock: ${updatedMaterial.name}`,
              message: `Stock level (${updatedMaterial.currentStock}) exceeds maximum level (${updatedMaterial.maxStockLevel})`,
              currentLevel: updatedMaterial.currentStock,
              thresholdLevel: updatedMaterial.maxStockLevel,
            },
          })
        }
      }

      return movement
    })

    return apiResponse(
      { data: result, message: 'Stock movement recorded successfully' },
      201
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400)
    }

    console.error('Error creating stock movement:', error)
    return apiError('Failed to record stock movement', 500)
  }
})

// PUT /api/inventory/stock-movements/adjust - Stock adjustment
export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json()
    const validatedData = adjustmentSchema.parse(body)

    // Check if material exists and belongs to tenant
    const material = await prisma.material.findUnique({
      where: { id: validatedData.materialId },
    })

    if (!material) {
      return apiError('Material not found', 404)
    }

    if (material.tenantId !== tenantId) {
      return apiError('Material does not belong to your organization', 403)
    }

    // Calculate adjustment amount
    let adjustmentQuantity = 0
    let newStock = 0

    switch (validatedData.adjustmentType) {
      case 'increase':
        adjustmentQuantity = validatedData.quantity
        newStock = material.currentStock + validatedData.quantity
        break
      case 'decrease':
        adjustmentQuantity = -validatedData.quantity
        newStock = Math.max(0, material.currentStock - validatedData.quantity)
        break
      case 'set':
        adjustmentQuantity = validatedData.quantity - material.currentStock
        newStock = validatedData.quantity
        break
    }

    // Create adjustment in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create stock movement record
      const movement = await tx.stockMovement.create({
        data: {
          materialId: validatedData.materialId,
          tenantId,
          type: 'ADJUSTMENT',
          quantity: Math.abs(adjustmentQuantity),
          unit: material.unitOfMeasure,
          reason: `Stock adjustment: ${validatedData.reason}`,
          notes: validatedData.notes,
          performedBy: user?.email || 'current-user',
        },
        include: {
          material: {
            include: {
              category: true,
            },
          },
        },
      })

      // Update material stock
      await tx.material.update({
        where: {
          id: validatedData.materialId,
          tenantId,
        },
        data: {
          currentStock: newStock,
          availableStock: newStock,
        },
      })

      return movement
    })

    return apiResponse({
      data: result,
      message: 'Stock adjustment completed successfully',
      stockChange: {
        previous: material.currentStock,
        current: newStock,
        adjustment: adjustmentQuantity,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400)
    }

    console.error('Error adjusting stock:', error)
    return apiError('Failed to adjust stock', 500)
  }
})
