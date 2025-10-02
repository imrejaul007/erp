import { prisma } from '@/lib/prisma';

export async function getProductionBatches(data: any, session: any) {
  const { status, limit = 50, offset = 0 } = data;

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const batches = await prisma.productionBatch.findMany({
    where,
    include: {
      recipe: true,
      inputs: {
        include: {
          material: true,
        },
      },
      outputs: {
        include: {
          material: true,
        },
      },
      qualityControls: true,
      wastageRecords: true,
    },
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.productionBatch.count({ where });

  return {
    data: batches,
    pagination: {
      total,
      limit,
      offset,
      hasMore: total > offset + limit,
    },
  };
}

export async function createProductionBatch(data: any, session: any) {
  const {
    recipeId,
    plannedQuantity,
    unit,
    startDate,
    inputs,
    notes,
  } = data;

  // Generate batch number
  const batchCount = await prisma.productionBatch.count();
  const batchNumber = `BATCH-${new Date().getFullYear()}-${String(batchCount + 1).padStart(6, '0')}`;

  const batch = await prisma.productionBatch.create({
    data: {
      batchNumber,
      recipeId,
      plannedQuantity,
      unit,
      status: 'PLANNED',
      startDate: new Date(startDate),
      notes,
      supervisorId: session.user.id,
      inputs: {
        create: inputs.map((input: any) => ({
          materialId: input.materialId,
          plannedQuantity: input.quantity,
          unit: input.unit,
          costPerUnit: input.costPerUnit,
          totalCost: input.quantity * input.costPerUnit,
        })),
      },
    },
    include: {
      recipe: true,
      inputs: {
        include: {
          material: true,
        },
      },
    },
  });

  return { success: true, data: batch };
}

export async function updateBatchStatus(data: any, session: any) {
  const { batchId, status, actualQuantity } = data;

  const batch = await prisma.productionBatch.update({
    where: { id: batchId },
    data: {
      status,
      actualQuantity,
      endDate: status === 'COMPLETED' ? new Date() : undefined,
    },
    include: {
      recipe: true,
      inputs: true,
      outputs: true,
    },
  });

  return { success: true, data: batch };
}

export async function recordWastage(data: any, session: any) {
  const { batchId, materialId, quantity, unit, reason, cost } = data;

  const wastage = await prisma.wastageRecord.create({
    data: {
      batchId,
      materialId,
      quantity,
      unit,
      reason,
      cost,
      recordedAt: new Date(),
    },
  });

  return { success: true, data: wastage };
}
