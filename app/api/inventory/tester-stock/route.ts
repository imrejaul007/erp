import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const lowStockOnly = searchParams.get('lowStockOnly') === 'true';

    // Build where clause
    const where: any = {};

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

    return NextResponse.json({
      testerStocks: formattedStocks,
      total: formattedStocks.length,
      lowStockCount: formattedStocks.filter(s => s.isLowStock).length
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching tester stock:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch tester stock',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, minLevel } = body;

    if (!productId || minLevel === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: productId or minLevel' },
        { status: 400 }
      );
    }

    // Update minimum level
    const updatedStock = await prisma.testerStock.update({
      where: { productId },
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

    return NextResponse.json({
      success: true,
      testerStock: {
        id: updatedStock.id,
        productId: updatedStock.productId,
        productName: updatedStock.product.name,
        currentStock: parseFloat(updatedStock.currentStock.toString()),
        minLevel: parseFloat(updatedStock.minLevel.toString()),
        unit: updatedStock.unit
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating tester stock:', error);
    return NextResponse.json(
      {
        error: 'Failed to update tester stock',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
