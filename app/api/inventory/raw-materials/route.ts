import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import type { MaterialFilters } from '@/types/inventory'

// Validation schemas
const createMaterialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  categoryId: z.string().min(1, 'Category is required'),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  density: z.number().optional(),
  alternateUnits: z.array(z.object({
    unit: z.string(),
    factor: z.number(),
    isDefault: z.boolean().optional(),
  })).optional(),
  costPerUnit: z.number().min(0, 'Cost must be non-negative'),
  currency: z.string().default('USD'),
  minimumStock: z.number().min(0, 'Minimum stock must be non-negative'),
  maximumStock: z.number().optional(),
  reorderLevel: z.number().min(0, 'Reorder level must be non-negative'),
  supplier: z.string().optional(),
  supplierCode: z.string().optional(),
  supplierPrice: z.number().optional(),
  grade: z.enum(['PREMIUM', 'STANDARD', 'ECONOMY', 'SPECIAL', 'ORGANIC', 'SYNTHETIC']),
  origin: z.string().optional(),
})

// GET /api/inventory/raw-materials - Get all materials with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const categoryId = searchParams.get('categoryId') || undefined
    const grade = searchParams.get('grade') || undefined
    const supplier = searchParams.get('supplier') || undefined
    const stockStatus = searchParams.get('stockStatus') || undefined
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { supplier: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (grade) {
      where.grade = grade
    }

    if (supplier) {
      where.supplier = supplier
    }

    // Handle stock status filtering
    if (stockStatus) {
      switch (stockStatus) {
        case 'OUT_OF_STOCK':
          where.currentStock = { lte: 0 }
          break
        case 'LOW':
          where.AND = [
            { currentStock: { gt: 0 } },
            { currentStock: { lte: { reorderLevel: true } } }
          ]
          break
        case 'OVERSTOCK':
          where.AND = [
            { maxStockLevel: { not: null } },
            { currentStock: { gte: { maxStockLevel: true } } }
          ]
          break
        case 'NORMAL':
          where.AND = [
            { currentStock: { gt: { reorderLevel: true } } },
            { OR: [
              { maxStockLevel: null },
              { currentStock: { lt: { maxStockLevel: true } } }
            ]}
          ]
          break
      }
    }

    // Build orderBy
    let orderBy: any = {}
    switch (sortBy) {
      case 'name':
        orderBy.name = sortOrder
        break
      case 'stock':
        orderBy.currentStock = sortOrder
        break
      case 'lastUpdated':
        orderBy.updatedAt = sortOrder
        break
      case 'cost':
        orderBy.costPerUnit = sortOrder
        break
      default:
        orderBy.name = 'asc'
    }

    // Get materials with related data
    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          batches: {
            orderBy: { receivedDate: 'desc' },
            take: 5,
          },
          stockAlerts: {
            where: { isResolved: false },
            orderBy: { createdAt: 'desc' },
          },
          stockMovements: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      }),
      prisma.material.count({ where }),
    ])

    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: materials,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    })
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}

// POST /api/inventory/raw-materials - Create new material
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createMaterialSchema.parse(body)

    // Check for duplicate SKU
    const existingMaterial = await prisma.material.findUnique({
      where: { sku: validatedData.sku },
    })

    if (existingMaterial) {
      return NextResponse.json(
        { success: false, error: 'SKU already exists' },
        { status: 400 }
      )
    }

    // Create material
    const material = await prisma.material.create({
      data: {
        ...validatedData,
        alternateUnits: validatedData.alternateUnits ? JSON.stringify(validatedData.alternateUnits) : null,
        availableStock: 0,
        reservedStock: 0,
      },
      include: {
        category: true,
        batches: true,
        stockAlerts: true,
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    // Create initial stock movement record
    await prisma.stockMovement.create({
      data: {
        materialId: material.id,
        type: 'ADJUSTMENT',
        quantity: 0,
        unit: material.unitOfMeasure,
        reason: 'Initial material setup',
        performedBy: 'system', // In real app, get from auth context
      },
    })

    return NextResponse.json({
      success: true,
      data: material,
      message: 'Material created successfully',
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Error creating material:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create material' },
      { status: 500 }
    )
  }
}

// PUT /api/inventory/raw-materials - Bulk update materials
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, updates } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Material IDs are required' },
        { status: 400 }
      )
    }

    // Validate updates
    const allowedUpdates = [
      'supplier', 'supplierPrice', 'costPerUnit', 'minimumStock',
      'maximumStock', 'reorderLevel', 'isActive', 'grade'
    ]
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid updates provided' },
        { status: 400 }
      )
    }

    // Perform bulk update
    const result = await prisma.material.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        ...filteredUpdates,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: { count: result.count },
      message: `Updated ${result.count} materials`,
    })
  } catch (error) {
    console.error('Error bulk updating materials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update materials' },
      { status: 500 }
    )
  }
}

// DELETE /api/inventory/raw-materials - Bulk delete materials
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Material IDs are required' },
        { status: 400 }
      )
    }

    // Check for materials with stock or active batches
    const materialsWithStock = await prisma.material.findMany({
      where: {
        id: { in: ids },
        OR: [
          { currentStock: { gt: 0 } },
          {
            batches: {
              some: { currentStock: { gt: 0 } }
            }
          }
        ],
      },
      select: { id: true, name: true, sku: true },
    })

    if (materialsWithStock.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete materials with active stock',
          details: materialsWithStock,
        },
        { status: 400 }
      )
    }

    // Soft delete by setting isActive to false
    const result = await prisma.material.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: { count: result.count },
      message: `Deleted ${result.count} materials`,
    })
  } catch (error) {
    console.error('Error bulk deleting materials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete materials' },
      { status: 500 }
    )
  }
}