import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import InventoryIntegrationService from '@/services/inventory-integration';

// Validation schemas
const deductMaterialsSchema = z.object({
  batchId: z.string(),
  materials: z.array(z.object({
    materialId: z.string(),
    quantity: z.number().min(0),
    unit: z.string(),
    notes: z.string().optional()
  })),
  reference: z.string()
});

const addOutputsSchema = z.object({
  batchId: z.string(),
  outputs: z.array(z.object({
    materialId: z.string(),
    quantity: z.number().min(0),
    unit: z.string(),
    costPerUnit: z.number().min(0),
    notes: z.string().optional()
  })),
  reference: z.string()
});

const recordWastageSchema = z.object({
  materialId: z.string(),
  quantity: z.number().min(0),
  unit: z.string(),
  reason: z.string(),
  cost: z.number().min(0),
  batchId: z.string().optional(),
  notes: z.string().optional()
});

const reserveMaterialsSchema = z.object({
  batchId: z.string(),
  materials: z.array(z.object({
    materialId: z.string(),
    quantity: z.number().min(0)
  }))
});

const checkAvailabilitySchema = z.object({
  materials: z.array(z.object({
    materialId: z.string(),
    requiredQuantity: z.number().min(0),
    unit: z.string()
  }))
});

// POST /api/production/inventory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'deduct_materials':
        const deductData = deductMaterialsSchema.parse(data);
        await InventoryIntegrationService.deductProductionMaterials(
          deductData.batchId,
          deductData.materials,
          deductData.reference
        );
        return NextResponse.json({
          success: true,
          message: 'Materials deducted successfully'
        });

      case 'add_outputs':
        const outputData = addOutputsSchema.parse(data);
        await InventoryIntegrationService.addProductionOutputs(
          outputData.batchId,
          outputData.outputs,
          outputData.reference
        );
        return NextResponse.json({
          success: true,
          message: 'Production outputs added to inventory successfully'
        });

      case 'reverse_deductions':
        const { batchId, reference } = data;
        if (!batchId || !reference) {
          return NextResponse.json(
            { success: false, error: 'Batch ID and reference are required' },
            { status: 400 }
          );
        }
        await InventoryIntegrationService.reverseProductionDeductions(batchId, reference);
        return NextResponse.json({
          success: true,
          message: 'Production deductions reversed successfully'
        });

      case 'record_wastage':
        const wastageData = recordWastageSchema.parse(data);
        await InventoryIntegrationService.recordWastage(
          wastageData.materialId,
          wastageData.quantity,
          wastageData.unit,
          wastageData.reason,
          wastageData.cost,
          wastageData.batchId,
          wastageData.notes
        );
        return NextResponse.json({
          success: true,
          message: 'Wastage recorded successfully'
        });

      case 'check_availability':
        const availabilityData = checkAvailabilitySchema.parse(data);
        const availability = await InventoryIntegrationService.checkMaterialAvailability(
          availabilityData.materials
        );
        return NextResponse.json({
          success: true,
          data: availability
        });

      case 'reserve_materials':
        const reserveData = reserveMaterialsSchema.parse(data);
        await InventoryIntegrationService.reserveMaterials(
          reserveData.batchId,
          reserveData.materials
        );
        return NextResponse.json({
          success: true,
          message: 'Materials reserved successfully'
        });

      case 'release_reserved':
        const releaseData = reserveMaterialsSchema.parse(data);
        await InventoryIntegrationService.releaseReservedMaterials(
          releaseData.batchId,
          releaseData.materials
        );
        return NextResponse.json({
          success: true,
          message: 'Reserved materials released successfully'
        });

      case 'update_cost':
        const { materialId, newCostPerUnit, notes } = data;
        if (!materialId || typeof newCostPerUnit !== 'number') {
          return NextResponse.json(
            { success: false, error: 'Material ID and new cost per unit are required' },
            { status: 400 }
          );
        }
        await InventoryIntegrationService.updateMaterialCosts(materialId, newCostPerUnit, notes);
        return NextResponse.json({
          success: true,
          message: 'Material cost updated successfully'
        });

      case 'generate_alerts':
        await InventoryIntegrationService.generateLowStockAlerts();
        return NextResponse.json({
          success: true,
          message: 'Low stock alerts generated successfully'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Inventory integration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process inventory operation'
      },
      { status: 500 }
    );
  }
}

// GET /api/production/inventory
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'consumption_analytics') {
      const materialId = searchParams.get('materialId');
      const dateFrom = searchParams.get('dateFrom');
      const dateTo = searchParams.get('dateTo');

      if (!materialId || !dateFrom || !dateTo) {
        return NextResponse.json(
          { success: false, error: 'Material ID, dateFrom, and dateTo are required' },
          { status: 400 }
        );
      }

      const analytics = await InventoryIntegrationService.getMaterialConsumptionAnalytics(
        materialId,
        new Date(dateFrom),
        new Date(dateTo)
      );

      return NextResponse.json({
        success: true,
        data: analytics
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid or missing action parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Inventory integration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve inventory data'
      },
      { status: 500 }
    );
  }
}