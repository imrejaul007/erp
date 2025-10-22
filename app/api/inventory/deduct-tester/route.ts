import { NextRequest } from 'next/server';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

async function handler(request: NextRequest, { tenantId, user }: { tenantId: string; user: any }) {
  try {
    const body = await request.json();
    const { productId, testerStock, updateType, reference } = body;

    // Validate required fields
    if (!productId || !testerStock?.deduct) {
      return apiError('Missing required fields: productId or testerStock.deduct', 400);
    }

    // Check if product exists and belongs to tenant
    const product = await prisma.products.findFirst({
      where: {
        id: productId,
        tenantId
      }
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    // Get tester stock
    const testerStockRecord = await prisma.testerStock.findFirst({
      where: {
        productId,
        product: { tenantId }
      }
    });

    if (!testerStockRecord) {
      return apiError('Tester stock not found for this product', 404);
    }

    // Check if sufficient tester stock available
    const currentStock = parseFloat(testerStockRecord.currentStock.toString());
    const deductAmount = parseFloat(testerStock.deduct);

    if (currentStock < deductAmount) {
      return apiError('Insufficient tester stock available', 400);
    }

    // Deduct from tester stock
    const updatedStock = await prisma.testerStock.update({
      where: { id: testerStockRecord.id },
      data: {
        currentStock: {
          decrement: new Prisma.Decimal(deductAmount)
        }
      }
    });

    // Create tester usage record
    await prisma.testerUsage.create({
      data: {
        productId,
        quantity: new Prisma.Decimal(deductAmount),
        unit: testerStock.unit || 'ml',
        usedBy: user.id,
        updateType: updateType || 'MANUAL',
        reference: reference || null,
        notes: `Deducted ${deductAmount} ${testerStock.unit || 'ml'}`
      }
    });

    const response = {
      success: true,
      productId,
      deductedQuantity: deductAmount,
      unit: testerStock.unit || 'ml',
      remainingStock: parseFloat(updatedStock.currentStock.toString()),
      updateType,
      reference,
      timestamp: new Date().toISOString()
    };

    return apiResponse(response);
  } catch (error) {
    console.error('Error deducting tester stock:', error);
    return apiError('Failed to deduct tester stock: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
}

export const POST = withTenant(handler);
