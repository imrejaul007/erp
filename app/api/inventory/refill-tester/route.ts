import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, TesterSourceType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, sourceType, refillBy, notes, unit, costPerUnit } = body;

    // Validate required fields
    if (!productId || !quantity || !sourceType || !refillBy) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, quantity, sourceType, or refillBy' },
        { status: 400 }
      );
    }

    // Validate quantity is positive
    if (parseFloat(quantity) <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // If refilling from main inventory, check stock availability
    if (sourceType === 'main_inventory') {
      const productStock = parseFloat(product.stock?.toString() || '0');
      if (productStock < parseFloat(quantity)) {
        return NextResponse.json(
          { error: 'Insufficient stock in main inventory' },
          { status: 400 }
        );
      }

      // Deduct from main inventory
      await prisma.product.update({
        where: { id: productId },
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
            code: true
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

    // Update or create tester stock
    const existingTesterStock = await prisma.testerStock.findUnique({
      where: { productId }
    });

    let updatedTesterStock;

    if (existingTesterStock) {
      // Update existing tester stock
      updatedTesterStock = await prisma.testerStock.update({
        where: { productId },
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

    return NextResponse.json({
      success: true,
      refill,
      newTesterStock: parseFloat(updatedTesterStock.currentStock.toString()),
      deductedFromMainStock: sourceType === 'main_inventory' ? parseFloat(quantity) : 0
    }, { status: 200 });

  } catch (error) {
    console.error('Error refilling tester stock:', error);
    return NextResponse.json(
      {
        error: 'Failed to refill tester stock',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
