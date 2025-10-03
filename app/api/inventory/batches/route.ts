import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware'

const createBatchSchema = z.object({
  materialId: z.string().min(1, 'Material ID is required'),
  batchNumber: z.string().min(1, 'Batch number is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  costPerUnit: z.number().min(0, 'Cost per unit must be non-negative'),
  grade: z.enum(['PREMIUM', 'STANDARD', 'ECONOMY', 'SPECIAL', 'ORGANIC', 'SYNTHETIC']),
  origin: z.string().optional(),
  qualityNotes: z.string().optional(),
  receivedDate: z.string().transform(str => new Date(str)),
  expiryDate: z.string().transform(str => new Date(str)).optional(),
  manufacturingDate: z.string().transform(str => new Date(str)).optional(),
  location: z.string().optional(),
  storageConditions: z.string().optional(),
})

// GET /api/inventory/batches - Get all batches with filtering
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const materialId = searchParams.get('materialId') || undefined
    const grade = searchParams.get('grade') || undefined
    const origin = searchParams.get('origin') || undefined
    const location = searchParams.get('location') || undefined
    const expiryStatus = searchParams.get('expiryStatus') || undefined
    const sortBy = searchParams.get('sortBy') || 'receivedDate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause with tenantId
    const where: any = {
      tenantId,
    }

    if (search) {
      where.OR = [
        { batchNumber: { contains: search, mode: 'insensitive' } },
        { origin: { contains: search, mode: 'insensitive' } },
        { qualityNotes: { contains: search, mode: 'insensitive' } },
        {
          material: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } },
            ]
          }
        },
      ]
    }

    if (materialId) {
      where.materialId = materialId
    }

    if (grade) {
      where.grade = grade
    }

    if (origin) {
      where.origin = origin
    }

    if (location) {
      where.location = location
    }

    // Handle expiry status filtering
    if (expiryStatus) {
      const now = new Date()
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(now.getDate() + 30)

      switch (expiryStatus) {
        case 'FRESH':
          where.OR = [
            { expiryDate: null },
            { expiryDate: { gt: thirtyDaysFromNow } },
          ]
          break
        case 'EXPIRING_SOON':
          where.expiryDate = {
            gte: now,
            lte: thirtyDaysFromNow,
          }
          break
        case 'EXPIRED':
          where.expiryDate = { lt: now }
          break
      }
    }

    // Build orderBy
    let orderBy: any = {}
    switch (sortBy) {
      case 'receivedDate':
        orderBy.receivedDate = sortOrder
        break
      case 'expiryDate':
        orderBy.expiryDate = sortOrder
        break
      case 'quantity':
        orderBy.currentStock = sortOrder
        break
      default:
        orderBy.receivedDate = 'desc'
    }

    // Get batches with related data
    const [batches, total] = await Promise.all([
      prisma.materialBatch.findMany({
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
          stockMovements: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      }),
      prisma.materialBatch.count({ where }),
    ])

    const pages = Math.ceil(total / limit)

    return apiResponse({
      data: batches,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    })
  } catch (error) {
    console.error('Error fetching batches:', error)
    return apiError('Failed to fetch batches', 500)
  }
})

// POST /api/inventory/batches - Create new batch
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json()
    const validatedData = createBatchSchema.parse(body)

    // Check if batch number exists for this tenant
    const existingBatch = await prisma.materialBatch.findFirst({
      where: {
        batchNumber: validatedData.batchNumber,
        tenantId,
      },
    })

    if (existingBatch) {
      return apiError('Batch number already exists', 400)
    }

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

    // Calculate total cost
    const totalCost = validatedData.quantity * validatedData.costPerUnit

    // Create batch in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create batch
      const batch = await tx.materialBatch.create({
        data: {
          ...validatedData,
          tenantId,
          totalCost,
          currentStock: validatedData.quantity,
          isExpired: validatedData.expiryDate ? validatedData.expiryDate < new Date() : false,
        },
        include: {
          material: {
            include: {
              category: true,
            },
          },
          stockMovements: true,
        },
      })

      // Update material stock
      await tx.material.update({
        where: {
          id: validatedData.materialId,
          tenantId,
        },
        data: {
          currentStock: {
            increment: validatedData.quantity,
          },
          availableStock: {
            increment: validatedData.quantity,
          },
        },
      })

      // Create stock movement record
      await tx.stockMovement.create({
        data: {
          materialId: validatedData.materialId,
          batchId: batch.id,
          tenantId,
          type: 'IN',
          quantity: validatedData.quantity,
          unit: validatedData.unit,
          reason: `Batch ${validatedData.batchNumber} received`,
          performedBy: user?.email || 'current-user',
        },
      })

      return batch
    })

    return apiResponse(
      { data: result, message: 'Batch created successfully' },
      201
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400)
    }

    console.error('Error creating batch:', error)
    return apiError('Failed to create batch', 500)
  }
})

// PUT /api/inventory/batches - Bulk update batches
export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json()
    const { ids, updates } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return apiError('Batch IDs are required', 400)
    }

    // Validate updates
    const allowedUpdates = [
      'location', 'storageConditions', 'qualityNotes', 'grade',
      'expiryDate', 'isExpired'
    ]
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredUpdates).length === 0) {
      return apiError('No valid updates provided', 400)
    }

    // Verify all batches belong to tenant
    const batchCount = await prisma.materialBatch.count({
      where: {
        id: { in: ids },
        tenantId,
      },
    })

    if (batchCount !== ids.length) {
      return apiError('Some batches do not belong to your organization', 403)
    }

    // Perform bulk update
    const result = await prisma.materialBatch.updateMany({
      where: {
        id: { in: ids },
        tenantId,
      },
      data: {
        ...filteredUpdates,
        updatedAt: new Date(),
      },
    })

    return apiResponse({
      data: { count: result.count },
      message: `Updated ${result.count} batches`,
    })
  } catch (error) {
    console.error('Error bulk updating batches:', error)
    return apiError('Failed to update batches', 500)
  }
})
