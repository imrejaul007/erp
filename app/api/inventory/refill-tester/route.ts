import { NextRequest } from 'next/server';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';
import { prisma } from '@/lib/prisma';
import { Prisma, TesterSourceType } from '@prisma/client';

async function handler(request: NextRequest, { tenantId, user }: { tenantId: string; user: any }) {
  try {
    const body = await request.json();
    const { productId, quantity, sourceType, refillBy, notes, unit, costPerUnit } = body;

    // Validate required fields
    if (!productId || !quantity || !sourceType || !refillBy) {
      return apiError('Missing required fields: productId, quantity, sourceType, or refillBy', 400);
    }

    // Validate quantity is positive
    if (parseFloat(quantity) <= 0) {
      return apiError('Quantity must be greater than 0', 400);
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

    // Verify refillBy user belongs to tenant
    const refillUser = await prisma.users.findFirst({
      where: {
        id: refillBy,
        tenantId
      }
    });

    if (!refillUser) {
      return apiError('Refill user not found', 404);
    }

    // If refilling from main inventory, check stock availability
    if (sourceType === 'main_inventory') {
      const productStock = parseFloat(product.stock?.toString() || '0');
      if (productStock < parseFloat(quantity)) {
        return apiError('Insufficient stock in main inventory', 400);
      }

      // Deduct from main inventory
      await prisma.products.update({
        where: {
          id: productId,
          tenantId
        },
        data: {
          stock: {
            decrement: new Prisma.Decimal(quantity)
          }
        }
      });
    }

    // Calculate cost
    const cost = costPerUnit
      ? new Prisma.Decimal(parseFloat(quantity) * parseFloat(costPerUnit))
      : new Prisma.Decimal(0);

    // Create refill record
    const refill = await prisma.testerRefill.create({
      data: {
        productId,
        quantity: new Prisma.Decimal(quantity),
        unit: unit || 'ml',
        sourceType: sourceType === 'main_inventory' ? TesterSourceType.MAIN_INVENTORY : TesterSourceType.PURCHASE,
        cost,
        refilledBy: refillBy,
        notes: notes || null
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            code: true,
            tenantId: true
          }
        },
        refilledByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Verify the refill was created for the correct tenant
    if (refill.product.tenantId !== tenantId) {
      return apiError('Tenant mismatch', 403);
    }

    // Update or create tester stock
    const existingTesterStock = await prisma.testerStock.findFirst({
      where: {
        productId,
        product: { tenantId }
      }
    });

    let updatedTesterStock;

    if (existingTesterStock) {
      // Update existing tester stock
      updatedTesterStock = await prisma.testerStock.update({
        where: { id: existingTesterStock.id },
        data: {
          currentStock: {
            increment: new Prisma.Decimal(quantity)
          },
          lastRefillDate: new Date(),
          lastRefillAmount: new Prisma.Decimal(quantity)
        }
      });
    } else {
      // Create new tester stock entry
      updatedTesterStock = await prisma.testerStock.create({
        data: {
          productId,
          currentStock: new Prisma.Decimal(quantity),
          minLevel: new Prisma.Decimal(10), // Default minimum level
          unit: unit || 'ml',
          lastRefillDate: new Date(),
          lastRefillAmount: new Prisma.Decimal(quantity),
          monthlyUsage: new Prisma.Decimal(0)
        }
      });
    }

    return apiResponse({
      success: true,
      refill: {
        ...refill,
        product: {
          id: refill.product.id,
          name: refill.product.name,
          code: refill.product.code
        }
      },
      newTesterStock: parseFloat(updatedTesterStock.currentStock.toString()),
      deductedFromMainStock: sourceType === 'main_inventory' ? parseFloat(quantity) : 0
    });

  } catch (error) {
    console.error('Error refilling tester stock:', error);
    return apiError('Failed to refill tester stock: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
}

export const POST = withTenant(handler);
