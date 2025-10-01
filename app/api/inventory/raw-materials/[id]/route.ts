import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateMaterialSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  sku: z.string().min(1).optional(),
  categoryId: z.string().optional(),
  unitOfMeasure: z.string().optional(),
  density: z.number().optional(),
  alternateUnits: z.array(z.object({
    unit: z.string(),
    factor: z.number(),
    isDefault: z.boolean().optional(),
  })).optional(),
  costPerUnit: z.number().min(0).optional(),
  currency: z.string().optional(),
  minimumStock: z.number().min(0).optional(),
  maximumStock: z.number().optional(),
  reorderLevel: z.number().min(0).optional(),
  supplier: z.string().optional(),
  supplierCode: z.string().optional(),
  supplierPrice: z.number().optional(),
  grade: z.enum(['PREMIUM', 'STANDARD', 'ECONOMY', 'SPECIAL', 'ORGANIC', 'SYNTHETIC']).optional(),
  origin: z.string().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/inventory/raw-materials/[id] - Get material by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        batches: {
          orderBy: { receivedDate: 'desc' },
          include: {
            stockMovements: {
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
          },
        },
        stockAlerts: {
          where: { isResolved: false },
          orderBy: { createdAt: 'desc' },
        },
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        unitConversions: true,
      },
    })

    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: material,
    })
  } catch (error) {
    console.error('Error fetching material:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch material' },
      { status: 500 }
    )
  }
}

// PUT /api/inventory/raw-materials/[id] - Update material
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateMaterialSchema.parse(body)

    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id: params.id },
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      )
    }

    // Check for duplicate SKU if updating
    if (validatedData.sku && validatedData.sku !== existingMaterial.sku) {
      const duplicateMaterial = await prisma.material.findUnique({
        where: { sku: validatedData.sku },
      })

      if (duplicateMaterial) {
        return NextResponse.json(
          { success: false, error: 'SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Update material
    const material = await prisma.material.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        alternateUnits: validatedData.alternateUnits
          ? JSON.stringify(validatedData.alternateUnits)
          : undefined,
        updatedAt: new Date(),
      },
      include: {
        category: true,
        batches: {
          orderBy: { receivedDate: 'desc' },
        },
        stockAlerts: {
          where: { isResolved: false },
        },
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    // Create stock movement record for significant changes
    const significantFields = ['costPerUnit', 'minimumStock', 'maximumStock', 'reorderLevel']
    const hasSignificantChanges = Object.keys(validatedData).some(key =>
      significantFields.includes(key)
    )

    if (hasSignificantChanges) {
      await prisma.stockMovement.create({
        data: {
          materialId: material.id,
          type: 'ADJUSTMENT',
          quantity: 0,
          unit: material.unitOfMeasure,
          reason: 'Material settings updated',
          performedBy: 'current-user', // In real app, get from auth context
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: material,
      message: 'Material updated successfully',
    })
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

    console.error('Error updating material:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update material' },
      { status: 500 }
    )
  }
}

// DELETE /api/inventory/raw-materials/[id] - Delete material
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if material exists
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: {
        batches: {
          where: { currentStock: { gt: 0 } }
        },
      },
    })

    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      )
    }

    // Check if material has active stock
    if (material.currentStock > 0 || material.batches.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete material with active stock',
          details: {
            currentStock: material.currentStock,
            activeBatches: material.batches.length,
          },
        },
        { status: 400 }
      )
    }

    // Soft delete by setting isActive to false
    const updatedMaterial = await prisma.material.update({
      where: { id: params.id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    })

    // Create stock movement record
    await prisma.stockMovement.create({
      data: {
        materialId: material.id,
        type: 'ADJUSTMENT',
        quantity: 0,
        unit: material.unitOfMeasure,
        reason: 'Material deleted',
        performedBy: 'current-user', // In real app, get from auth context
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete material' },
      { status: 500 }
    )
  }
}