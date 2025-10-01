import { PrismaClient } from '@prisma/client';
import { StockMovementType, ProductionStatus } from '@/types/production';

const prisma = new PrismaClient();

export class InventoryIntegrationService {
  /**
   * Deduct materials from inventory when production starts
   */
  static async deductProductionMaterials(
    batchId: string,
    materials: Array<{
      materialId: string;
      quantity: number;
      unit: string;
      notes?: string;
    }>,
    reference: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      for (const material of materials) {
        // Check if material has sufficient stock
        const materialRecord = await tx.material.findUnique({
          where: { id: material.materialId }
        });

        if (!materialRecord) {
          throw new Error(`Material ${material.materialId} not found`);
        }

        if (materialRecord.currentStock < material.quantity) {
          throw new Error(
            `Insufficient stock for material ${materialRecord.name}. ` +
            `Required: ${material.quantity} ${material.unit}, ` +
            `Available: ${materialRecord.currentStock} ${materialRecord.unitOfMeasure}`
          );
        }

        // Deduct from current stock
        await tx.material.update({
          where: { id: material.materialId },
          data: {
            currentStock: {
              decrement: material.quantity
            }
          }
        });

        // Create stock movement record
        await tx.stockMovement.create({
          data: {
            materialId: material.materialId,
            type: StockMovementType.PRODUCTION_OUT,
            quantity: material.quantity,
            unitCost: materialRecord.costPerUnit,
            reference,
            notes: material.notes || `Production deduction for batch ${reference}`,
            createdAt: new Date()
          }
        });
      }
    });
  }

  /**
   * Add materials to inventory when production is completed
   */
  static async addProductionOutputs(
    batchId: string,
    outputs: Array<{
      materialId: string;
      quantity: number;
      unit: string;
      costPerUnit: number;
      notes?: string;
    }>,
    reference: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      for (const output of outputs) {
        // Check if material exists
        const materialRecord = await tx.material.findUnique({
          where: { id: output.materialId }
        });

        if (!materialRecord) {
          throw new Error(`Output material ${output.materialId} not found`);
        }

        // Add to current stock
        await tx.material.update({
          where: { id: output.materialId },
          data: {
            currentStock: {
              increment: output.quantity
            }
          }
        });

        // Create stock movement record
        await tx.stockMovement.create({
          data: {
            materialId: output.materialId,
            type: StockMovementType.PRODUCTION_IN,
            quantity: output.quantity,
            unitCost: output.costPerUnit,
            reference,
            notes: output.notes || `Production output from batch ${reference}`,
            createdAt: new Date()
          }
        });
      }
    });
  }

  /**
   * Reverse stock deductions when production is cancelled
   */
  static async reverseProductionDeductions(
    batchId: string,
    reference: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Find all deduction movements for this batch
      const deductionMovements = await tx.stockMovement.findMany({
        where: {
          reference,
          type: StockMovementType.PRODUCTION_OUT
        }
      });

      for (const movement of deductionMovements) {
        // Add stock back
        await tx.material.update({
          where: { id: movement.materialId },
          data: {
            currentStock: {
              increment: movement.quantity
            }
          }
        });

        // Create reversal stock movement
        await tx.stockMovement.create({
          data: {
            materialId: movement.materialId,
            type: StockMovementType.IN,
            quantity: movement.quantity,
            unitCost: movement.unitCost,
            reference: `REVERSAL-${reference}`,
            notes: `Reversal of production deduction for cancelled batch ${reference}`,
            createdAt: new Date()
          }
        });
      }
    });
  }

  /**
   * Record wastage and reduce inventory
   */
  static async recordWastage(
    materialId: string,
    quantity: number,
    unit: string,
    reason: string,
    cost: number,
    batchId?: string,
    notes?: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Check if material exists
      const material = await tx.material.findUnique({
        where: { id: materialId }
      });

      if (!material) {
        throw new Error(`Material ${materialId} not found`);
      }

      // Create wastage record
      await tx.wastageRecord.create({
        data: {
          batchId,
          materialId,
          quantity,
          unit,
          reason,
          cost,
          recordedAt: new Date(),
          notes
        }
      });

      // Deduct from current stock if there's sufficient stock
      if (material.currentStock >= quantity) {
        await tx.material.update({
          where: { id: materialId },
          data: {
            currentStock: {
              decrement: quantity
            }
          }
        });

        // Create stock movement record
        await tx.stockMovement.create({
          data: {
            materialId,
            type: StockMovementType.WASTE,
            quantity,
            unitCost: material.costPerUnit,
            reference: batchId || 'GENERAL-WASTE',
            notes: `Wastage: ${reason}${notes ? ` - ${notes}` : ''}`,
            createdAt: new Date()
          }
        });
      }
    });
  }

  /**
   * Check material availability for production batch
   */
  static async checkMaterialAvailability(
    materials: Array<{
      materialId: string;
      requiredQuantity: number;
      unit: string;
    }>
  ): Promise<Array<{
    materialId: string;
    materialName: string;
    required: number;
    available: number;
    sufficient: boolean;
    shortfall: number;
  }>> {
    const availabilityStatus = [];

    for (const material of materials) {
      const materialRecord = await prisma.material.findUnique({
        where: { id: material.materialId },
        select: {
          id: true,
          name: true,
          currentStock: true,
          unitOfMeasure: true
        }
      });

      if (!materialRecord) {
        throw new Error(`Material ${material.materialId} not found`);
      }

      const sufficient = materialRecord.currentStock >= material.requiredQuantity;
      const shortfall = Math.max(0, material.requiredQuantity - materialRecord.currentStock);

      availabilityStatus.push({
        materialId: material.materialId,
        materialName: materialRecord.name,
        required: material.requiredQuantity,
        available: materialRecord.currentStock,
        sufficient,
        shortfall
      });
    }

    return availabilityStatus;
  }

  /**
   * Reserve materials for production (decrease available stock without moving from current stock)
   */
  static async reserveMaterials(
    batchId: string,
    materials: Array<{
      materialId: string;
      quantity: number;
    }>
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      for (const material of materials) {
        const materialRecord = await tx.material.findUnique({
          where: { id: material.materialId }
        });

        if (!materialRecord) {
          throw new Error(`Material ${material.materialId} not found`);
        }

        // Check if there's sufficient available stock
        const availableStock = materialRecord.currentStock - materialRecord.reservedStock;
        if (availableStock < material.quantity) {
          throw new Error(
            `Insufficient available stock for material ${materialRecord.name}. ` +
            `Required: ${material.quantity}, Available: ${availableStock}`
          );
        }

        // Increase reserved stock
        await tx.material.update({
          where: { id: material.materialId },
          data: {
            reservedStock: {
              increment: material.quantity
            }
          }
        });
      }
    });
  }

  /**
   * Release reserved materials (when batch is cancelled or modified)
   */
  static async releaseReservedMaterials(
    batchId: string,
    materials: Array<{
      materialId: string;
      quantity: number;
    }>
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      for (const material of materials) {
        await tx.material.update({
          where: { id: material.materialId },
          data: {
            reservedStock: {
              decrement: material.quantity
            }
          }
        });
      }
    });
  }

  /**
   * Update material costs based on production batches
   */
  static async updateMaterialCosts(
    materialId: string,
    newCostPerUnit: number,
    notes?: string
  ): Promise<void> {
    await prisma.material.update({
      where: { id: materialId },
      data: {
        costPerUnit: newCostPerUnit,
        updatedAt: new Date()
      }
    });

    // Create stock movement record for cost adjustment
    await prisma.stockMovement.create({
      data: {
        materialId,
        type: StockMovementType.ADJUSTMENT,
        quantity: 0, // No quantity change, just cost adjustment
        unitCost: newCostPerUnit,
        reference: 'COST-UPDATE',
        notes: notes || `Cost updated to ${newCostPerUnit}`,
        createdAt: new Date()
      }
    });
  }

  /**
   * Generate low stock alerts
   */
  static async generateLowStockAlerts(): Promise<void> {
    const lowStockMaterials = await prisma.material.findMany({
      where: {
        OR: [
          { currentStock: { lte: prisma.material.fields.minimumStock } },
          { currentStock: { lte: prisma.material.fields.reorderLevel } }
        ]
      }
    });

    for (const material of lowStockMaterials) {
      const existingAlert = await prisma.stockAlert.findFirst({
        where: {
          materialId: material.id,
          type: material.currentStock <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
          isResolved: false
        }
      });

      if (!existingAlert) {
        const alertType = material.currentStock <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK';
        const severity = material.currentStock <= 0 ? 'CRITICAL' :
                        material.currentStock <= material.reorderLevel ? 'HIGH' : 'MEDIUM';

        await prisma.stockAlert.create({
          data: {
            materialId: material.id,
            type: alertType,
            severity,
            title: `${alertType === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Low Stock'}: ${material.name}`,
            message: `Material ${material.name} (${material.sku}) has ${material.currentStock} ${material.unitOfMeasure} remaining.`,
            currentLevel: material.currentStock,
            thresholdLevel: material.minimumStock
          }
        });
      }
    }
  }

  /**
   * Get material consumption analytics
   */
  static async getMaterialConsumptionAnalytics(
    materialId: string,
    dateFrom: Date,
    dateTo: Date
  ) {
    const movements = await prisma.stockMovement.findMany({
      where: {
        materialId,
        createdAt: {
          gte: dateFrom,
          lte: dateTo
        },
        type: StockMovementType.PRODUCTION_OUT
      },
      orderBy: { createdAt: 'asc' }
    });

    const totalConsumed = movements.reduce((sum, movement) => sum + movement.quantity, 0);
    const averageDaily = totalConsumed / Math.max(1, Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      totalConsumed,
      averageDaily,
      movements: movements.length,
      totalCost: movements.reduce((sum, movement) => sum + (movement.quantity * (movement.unitCost || 0)), 0)
    };
  }
}

export default InventoryIntegrationService;