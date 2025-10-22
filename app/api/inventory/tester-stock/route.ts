import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const lowStockOnly = searchParams.get('lowStockOnly') === 'true';

    // Build where clause with tenantId
    const where: any = {
      tenantId,
    };

    if (productId) {
      where.productId = productId;
    }

    // Fetch tester stock
    const testerStocks = await prisma.testerStock.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            code: true,
            category: true,
            price: true
          }
        }
      },
      orderBy: {
        currentStock: 'asc'
      }
    });

    // Filter for low stock if requested
    let filteredStocks = testerStocks;
    if (lowStockOnly) {
      filteredStocks = testerStocks.filter(
        stock => parseFloat(stock.currentStock.toString()) < parseFloat(stock.minLevel.toString())
      );
    }

    // Format response
    const formattedStocks = filteredStocks.map(stock => ({
      id: stock.id,
      productId: stock.productId,
      productName: stock.product.name,
      productCode: stock.product.code,
      productCategory: stock.product.category,
      currentStock: parseFloat(stock.currentStock.toString()),
      minLevel: parseFloat(stock.minLevel.toString()),
      unit: stock.unit,
      isLowStock: parseFloat(stock.currentStock.toString()) < parseFloat(stock.minLevel.toString()),
      lastRefillDate: stock.lastRefillDate,
      lastRefillAmount: stock.lastRefillAmount ? parseFloat(stock.lastRefillAmount.toString()) : null,
      monthlyUsage: parseFloat(stock.monthlyUsage.toString()),
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt
    }));

    return apiResponse({
      testerStocks: formattedStocks,
      total: formattedStocks.length,
      lowStockCount: formattedStocks.filter(s => s.isLowStock).length
    });

  } catch (error) {
    console.error('Error fetching tester stock:', error);
    return apiError('Failed to fetch tester stock: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
});

export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const { productId, minLevel } = body;

    if (!productId || minLevel === undefined) {
      return apiError('Missing required fields: productId or minLevel', 400);
    }

    // Verify product belongs to tenant
    const product = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    if (product.tenantId !== tenantId) {
      return apiError('Product does not belong to your organization', 403);
    }

    // Update minimum level
    const updatedStock = await prisma.testerStock.update({
      where: {
        productId,
        tenantId,
      },
      data: {
        minLevel: parseFloat(minLevel)
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    return apiResponse({
      success: true,
      testerStock: {
        id: updatedStock.id,
        productId: updatedStock.productId,
        productName: updatedStock.product.name,
        currentStock: parseFloat(updatedStock.currentStock.toString()),
        minLevel: parseFloat(updatedStock.minLevel.toString()),
        unit: updatedStock.unit
      }
    });

  } catch (error) {
    console.error('Error updating tester stock:', error);
    return apiError('Failed to update tester stock: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
});
