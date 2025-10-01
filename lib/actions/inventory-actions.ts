'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { CreateMaterialForm, CreateMaterialBatchForm, StockMovementForm } from '@/types/inventory'

// Material Actions
export async function createMaterial(data: CreateMaterialForm) {
  try {
    // Check for duplicate SKU
    const existingMaterial = await prisma.material.findUnique({
      where: { sku: data.sku },
    })

    if (existingMaterial) {
      return {
        success: false,
        error: 'SKU already exists',
      }
    }

    // Create material
    const material = await prisma.material.create({
      data: {
        ...data,
        alternateUnits: data.alternateUnits ? JSON.stringify(data.alternateUnits) : null,
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
        performedBy: 'system',
      },
    })

    revalidatePath('/inventory')
    revalidatePath('/inventory/materials')

    return {
      success: true,
      data: material,
    }
  } catch (error) {
    console.error('Error creating material:', error)
    return {
      success: false,
      error: 'Failed to create material',
    }
  }
}

export async function updateMaterial(id: string, data: Partial<CreateMaterialForm>) {
  try {
    const material = await prisma.material.update({
      where: { id },
      data: {
        ...data,
        alternateUnits: data.alternateUnits ? JSON.stringify(data.alternateUnits) : undefined,
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
    const hasSignificantChanges = Object.keys(data).some(key =>
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
          performedBy: 'current-user',
        },
      })
    }

    revalidatePath('/inventory')
    revalidatePath('/inventory/materials')
    revalidatePath(`/inventory/materials/${id}`)

    return {
      success: true,
      data: material,
    }
  } catch (error) {
    console.error('Error updating material:', error)
    return {
      success: false,
      error: 'Failed to update material',
    }
  }
}

export async function deleteMaterial(id: string) {
  try {
    // Check if material has active stock
    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        batches: {
          where: { currentStock: { gt: 0 } }
        },
      },
    })

    if (!material) {
      return {
        success: false,
        error: 'Material not found',
      }
    }

    if (material.currentStock > 0 || material.batches.length > 0) {
      return {
        success: false,
        error: 'Cannot delete material with active stock',
      }
    }

    // Soft delete
    await prisma.material.update({
      where: { id },
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
        performedBy: 'current-user',
      },
    })

    revalidatePath('/inventory')
    revalidatePath('/inventory/materials')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting material:', error)
    return {
      success: false,
      error: 'Failed to delete material',
    }
  }
}

// Batch Actions
export async function createMaterialBatch(data: CreateMaterialBatchForm) {
  try {
    // Check if batch number exists
    const existingBatch = await prisma.materialBatch.findUnique({
      where: { batchNumber: data.batchNumber },
    })

    if (existingBatch) {
      return {
        success: false,
        error: 'Batch number already exists',
      }
    }

    // Calculate total cost
    const totalCost = data.quantity * data.costPerUnit

    // Create batch in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create batch
      const batch = await tx.materialBatch.create({
        data: {
          ...data,
          totalCost,
          currentStock: data.quantity,
          isExpired: data.expiryDate ? data.expiryDate < new Date() : false,
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
        where: { id: data.materialId },
        data: {
          currentStock: {
            increment: data.quantity,
          },
          availableStock: {
            increment: data.quantity,
          },
        },
      })

      // Create stock movement record
      await tx.stockMovement.create({
        data: {
          materialId: data.materialId,
          batchId: batch.id,
          type: 'IN',
          quantity: data.quantity,
          unit: data.unit,
          reason: `Batch ${data.batchNumber} received`,
          performedBy: 'current-user',
        },
      })

      return batch
    })

    revalidatePath('/inventory')
    revalidatePath('/inventory/batches')
    revalidatePath(`/inventory/materials/${data.materialId}`)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error creating batch:', error)
    return {
      success: false,
      error: 'Failed to create batch',
    }
  }
}

export async function updateMaterialBatch(id: string, data: Partial<CreateMaterialBatchForm>) {
  try {
    const batch = await prisma.materialBatch.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
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
    })

    revalidatePath('/inventory')
    revalidatePath('/inventory/batches')
    revalidatePath(`/inventory/materials/${batch.materialId}`)

    return {
      success: true,
      data: batch,
    }
  } catch (error) {
    console.error('Error updating batch:', error)
    return {
      success: false,
      error: 'Failed to update batch',
    }
  }
}

// Stock Movement Actions
export async function createStockMovement(data: StockMovementForm) {
  try {
    // Check if material exists
    const material = await prisma.material.findUnique({
      where: { id: data.materialId },
    })

    if (!material) {
      return {
        success: false,
        error: 'Material not found',
      }
    }

    // Validate stock availability for OUT movements
    if (['OUT', 'PRODUCTION_OUT', 'WASTE'].includes(data.type)) {
      if (material.availableStock < data.quantity) {
        return {
          success: false,
          error: 'Insufficient stock available',
        }
      }
    }

    // Create movement in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create stock movement record
      const movement = await tx.stockMovement.create({
        data: {
          ...data,
          performedBy: 'current-user',
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

      // Update stock levels
      const stockChange = ['IN', 'PRODUCTION_IN'].includes(data.type)
        ? data.quantity
        : -data.quantity

      // Update material stock
      if (data.type !== 'TRANSFER') {
        await tx.material.update({
          where: { id: data.materialId },
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
      if (data.batchId) {
        await tx.materialBatch.update({
          where: { id: data.batchId },
          data: {
            currentStock: {
              increment: stockChange,
            },
          },
        })
      }

      return movement
    })

    revalidatePath('/inventory')
    revalidatePath('/inventory/stock-movements')
    revalidatePath(`/inventory/materials/${data.materialId}`)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error creating stock movement:', error)
    return {
      success: false,
      error: 'Failed to record stock movement',
    }
  }
}

export async function adjustStock(materialId: string, adjustmentType: 'increase' | 'decrease' | 'set', quantity: number, reason: string) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: materialId },
    })

    if (!material) {
      return {
        success: false,
        error: 'Material not found',
      }
    }

    // Calculate adjustment amount
    let adjustmentQuantity = 0
    let newStock = 0

    switch (adjustmentType) {
      case 'increase':
        adjustmentQuantity = quantity
        newStock = material.currentStock + quantity
        break
      case 'decrease':
        adjustmentQuantity = -quantity
        newStock = Math.max(0, material.currentStock - quantity)
        break
      case 'set':
        adjustmentQuantity = quantity - material.currentStock
        newStock = quantity
        break
    }

    // Create adjustment in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create stock movement record
      const movement = await tx.stockMovement.create({
        data: {
          materialId,
          type: 'ADJUSTMENT',
          quantity: Math.abs(adjustmentQuantity),
          unit: material.unitOfMeasure,
          reason: `Stock adjustment: ${reason}`,
          performedBy: 'current-user',
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
        where: { id: materialId },
        data: {
          currentStock: newStock,
          availableStock: newStock,
        },
      })

      return movement
    })

    revalidatePath('/inventory')
    revalidatePath('/inventory/stock-movements')
    revalidatePath(`/inventory/materials/${materialId}`)

    return {
      success: true,
      data: result,
      stockChange: {
        previous: material.currentStock,
        current: newStock,
        adjustment: adjustmentQuantity,
      },
    }
  } catch (error) {
    console.error('Error adjusting stock:', error)
    return {
      success: false,
      error: 'Failed to adjust stock',
    }
  }
}

// Alert Actions
export async function markAlertAsRead(alertId: string) {
  try {
    await prisma.stockAlert.update({
      where: { id: alertId },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/inventory')
    revalidatePath('/inventory/alerts')

    return { success: true }
  } catch (error) {
    console.error('Error marking alert as read:', error)
    return {
      success: false,
      error: 'Failed to mark alert as read',
    }
  }
}

export async function markAllAlertsAsRead() {
  try {
    await prisma.stockAlert.updateMany({
      where: {
        isRead: false,
      },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/inventory')
    revalidatePath('/inventory/alerts')

    return { success: true }
  } catch (error) {
    console.error('Error marking all alerts as read:', error)
    return {
      success: false,
      error: 'Failed to mark all alerts as read',
    }
  }
}

export async function resolveAlert(alertId: string) {
  try {
    await prisma.stockAlert.update({
      where: { id: alertId },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy: 'current-user',
        updatedAt: new Date(),
      },
    })

    revalidatePath('/inventory')
    revalidatePath('/inventory/alerts')

    return { success: true }
  } catch (error) {
    console.error('Error resolving alert:', error)
    return {
      success: false,
      error: 'Failed to resolve alert',
    }
  }
}

// Utility Actions
export async function refreshInventoryData() {
  try {
    // This would typically trigger background jobs to:
    // 1. Update stock levels
    // 2. Check for expiring batches
    // 3. Generate alerts
    // 4. Calculate inventory metrics

    // For now, just revalidate paths
    revalidatePath('/inventory')
    revalidatePath('/inventory/materials')
    revalidatePath('/inventory/batches')
    revalidatePath('/inventory/alerts')
    revalidatePath('/inventory/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error refreshing inventory data:', error)
    return {
      success: false,
      error: 'Failed to refresh inventory data',
    }
  }
}