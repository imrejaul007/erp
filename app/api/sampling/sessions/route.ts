import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, SamplingOutcome } from '@prisma/client';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const sessionData = await request.json();

    // Validate required fields
    if (!sessionData.storeId || !sessionData.staffId || !sessionData.testedProducts?.length) {
      return apiError('Missing required fields: storeId, staffId, or testedProducts', 400);
    }

    // Verify store belongs to tenant
    const store = await prisma.store.findFirst({
      where: {
        id: sessionData.storeId,
        tenantId
      }
    });

    if (!store) {
      return apiError('Store not found', 404);
    }

    // Verify staff belongs to tenant
    const staff = await prisma.user.findFirst({
      where: {
        id: sessionData.staffId,
        tenantId
      }
    });

    if (!staff) {
      return apiError('Staff not found', 404);
    }

    // Verify products belong to tenant
    for (const product of sessionData.testedProducts) {
      if (product.productId) {
        const productExists = await prisma.product.findFirst({
          where: {
            id: product.productId,
            tenantId
          }
        });

        if (!productExists) {
          return apiError(`Product not found: ${product.productId}`, 404);
        }
      }
    }

    // Generate session number
    const sessionNumber = `SMP-${Date.now()}`;

    // Calculate total tester cost
    const totalTesterCost = sessionData.testedProducts.reduce(
      (sum: number, product: any) => sum + parseFloat(product.totalCost || 0),
      0
    );

    // Create sampling session with related products
    const session = await prisma.samplingSession.create({
      data: {
        tenantId,
        sessionNumber,
        customerId: sessionData.customer?.id || null,
        customerName: sessionData.customer?.name || sessionData.customer?.anonymous ? 'Anonymous' : null,
        customerPhone: sessionData.customer?.phone || null,
        customerEmail: sessionData.customer?.email || null,
        customerType: sessionData.customer?.type || 'walk-in',
        isAnonymous: sessionData.customer?.anonymous || false,
        storeId: sessionData.storeId,
        staffId: sessionData.staffId,
        outcome: sessionData.outcome === 'purchased' ? SamplingOutcome.PURCHASED : SamplingOutcome.NOT_PURCHASED,
        saleAmount: sessionData.outcome === 'purchased' ? new Prisma.Decimal(sessionData.saleAmount || 0) : null,
        notPurchaseReason: sessionData.outcome === 'not_purchased' ? sessionData.notPurchaseReason : null,
        notes: sessionData.notes || null,
        totalTesterCost: new Prisma.Decimal(totalTesterCost),
        testedProducts: {
          create: sessionData.testedProducts.map((product: any) => ({
            productId: product.productId,
            productName: product.productName,
            productCode: product.productCode,
            productType: product.productType,
            quantityUsed: new Prisma.Decimal(product.quantityUsed),
            unit: product.unit,
            costPerUnit: new Prisma.Decimal(product.costPerUnit),
            totalCost: new Prisma.Decimal(product.totalCost)
          }))
        }
      },
      include: {
        testedProducts: true,
        customer: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        store: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Deduct tester stock for each product
    for (const product of sessionData.testedProducts) {
      await deductTesterStock(tenantId, product.productId, parseFloat(product.quantityUsed));
    }

    return apiResponse({
      success: true,
      session
    }, 201);

  } catch (error) {
    console.error('Error creating sampling session:', error);
    return apiError('Failed to create sampling session: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
})

export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const storeId = searchParams.get('storeId');
    const staffId = searchParams.get('staffId');

    // Build where clause
    const where: any = { tenantId };

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    if (status) {
      where.outcome = status === 'purchased' ? SamplingOutcome.PURCHASED : SamplingOutcome.NOT_PURCHASED;
    }

    if (storeId) {
      where.storeId = storeId;
    }

    if (staffId) {
      where.staffId = staffId;
    }

    // Fetch sessions from database
    const sessions = await prisma.samplingSession.findMany({
      where,
      include: {
        testedProducts: true,
        customer: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        store: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return apiResponse({ sessions });

  } catch (error) {
    console.error('Error fetching sampling sessions:', error);
    return apiError('Failed to fetch sessions: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
})

// Helper function to deduct tester stock
async function deductTesterStock(tenantId: string, productId: string, quantityUsed: number) {
  try {
    // Check if tester stock exists for this product
    const testerStock = await prisma.testerStock.findFirst({
      where: {
        productId,
        product: {
          tenantId
        }
      }
    });

    if (testerStock) {
      // Update existing tester stock
      const newStock = parseFloat(testerStock.currentStock.toString()) - quantityUsed;

      await prisma.testerStock.update({
        where: { id: testerStock.id },
        data: {
          currentStock: new Prisma.Decimal(Math.max(0, newStock)),
          monthlyUsage: {
            increment: new Prisma.Decimal(quantityUsed)
          }
        }
      });
    } else {
      // Verify product belongs to tenant before creating tester stock
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          tenantId
        }
      });

      if (!product) {
        throw new Error(`Product ${productId} not found or does not belong to tenant`);
      }

      // Create tester stock entry with negative balance to track usage
      await prisma.testerStock.create({
        data: {
          productId,
          currentStock: new Prisma.Decimal(-quantityUsed),
          minLevel: new Prisma.Decimal(10),
          unit: 'ml',
          monthlyUsage: new Prisma.Decimal(quantityUsed)
        }
      });
    }
  } catch (error) {
    console.error('Error deducting tester stock:', error);
    throw error;
  }
}
