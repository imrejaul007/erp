import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware'

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
export const GET = withTenant(async (
  request: NextRequest,
  { params, tenantId, user }: { params: { id: string }, tenantId: string, user: any }
) => {
  try {
    const material = await prisma.material.findUnique({
      where: {
        id: params.id,
        tenantId,
      },
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
      return apiError('Material not found', 404)
    }

    return apiResponse({
      data: material,
    })
  } catch (error) {
    console.error('Error fetching material:', error)
    return apiError('Failed to fetch material', 500)
  }
})

// PUT /api/inventory/raw-materials/[id] - Update material
export const PUT = withTenant(async (
  request: NextRequest,
  { params, tenantId, user }: { params: { id: string }, tenantId: string, user: any }
) => {
  try {
    const body = await request.json()
    const validatedData = updateMaterialSchema.parse(body)

    // Check if material exists and belongs to tenant
    const existingMaterial = await prisma.material.findUnique({
      where: { id: params.id },
    })

    if (!existingMaterial) {
      return apiError('Material not found', 404)
    }

    if (existingMaterial.tenantId !== tenantId) {
      return apiError('Material does not belong to your organization', 403)
    }

    // Check for duplicate SKU if updating
    if (validatedData.sku && validatedData.sku !== existingMaterial.sku) {
      const duplicateMaterial = await prisma.material.findFirst({
        where: {
          sku: validatedData.sku,
          tenantId,
        },
      })

      if (duplicateMaterial) {
        return apiError('SKU already exists', 400)
      }
    }

    // If updating category, verify it belongs to tenant
    if (validatedData.categoryId) {
      const category = await prisma.categories.findUnique({
        where: { id: validatedData.categoryId },
      })

      if (!category) {
        return apiError('Category not found', 404)
      }

      if (category.tenantId !== tenantId) {
        return apiError('Category does not belong to your organization', 403)
      }
    }

    // Update material
    const material = await prisma.material.update({
      where: {
        id: params.id,
        tenantId,
      },
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
          tenantId,
          type: 'ADJUSTMENT',
          quantity: 0,
          unit: material.unitOfMeasure,
          reason: 'Material settings updated',
          performedBy: user?.email || 'current-user',
        },
      })
    }

    return apiResponse({
      data: material,
      message: 'Material updated successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400)
    }

    console.error('Error updating material:', error)
    return apiError('Failed to update material', 500)
  }
})

// DELETE /api/inventory/raw-materials/[id] - Delete material
export const DELETE = withTenant(async (
  request: NextRequest,
  { params, tenantId, user }: { params: { id: string }, tenantId: string, user: any }
) => {
  try {
    // Check if material exists and belongs to tenant
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: {
        batches: {
          where: { currentStock: { gt: 0 } }
        },
      },
    })

    if (!material) {
      return apiError('Material not found', 404)
    }

    if (material.tenantId !== tenantId) {
      return apiError('Material does not belong to your organization', 403)
    }

    // Check if material has active stock
    if (material.currentStock > 0 || material.batches.length > 0) {
      return apiError(`Cannot delete material with active stock. Current stock: ${material.currentStock}, Active batches: ${material.batches.length}`, 400)
    }

    // Soft delete by setting isActive to false
    const updatedMaterial = await prisma.material.update({
      where: {
        id: params.id,
        tenantId,
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    })

    // Create stock movement record
    await prisma.stockMovement.create({
      data: {
        materialId: material.id,
        tenantId,
        type: 'ADJUSTMENT',
        quantity: 0,
        unit: material.unitOfMeasure,
        reason: 'Material deleted',
        performedBy: user?.email || 'current-user',
      },
    })

    return apiResponse({
      message: 'Material deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting material:', error)
    return apiError('Failed to delete material', 500)
  }
})
