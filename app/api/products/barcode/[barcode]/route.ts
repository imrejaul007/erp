import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Function to calculate appropriate price based on customer type
function calculatePrice(product: any, customerType: string = 'retail'): number {
  // For now, using unitPrice as base price
  // Can be extended with customer-specific pricing later
  const basePrice = Number(product.unitPrice);

  switch (customerType.toLowerCase()) {
    case 'wholesale':
      return basePrice * 0.9; // 10% discount for wholesale
    case 'vip':
      return basePrice * 0.92; // 8% discount for VIP
    case 'export':
      return basePrice * 0.95; // 5% discount for export
    case 'retail':
    default:
      return basePrice;
  }
}

// Enhanced product enrichment with pricing tiers and availability
function enrichProductData(product: any, customerType?: string) {
  const currentPrice = calculatePrice(product, customerType);
  const costPrice = Number(product.costPrice || 0);
  const profitMargin = costPrice > 0 ? ((currentPrice - costPrice) / currentPrice) * 100 : 0;

  return {
    _id: product.id,
    sku: product.sku,
    barcode: product.sku, // Using SKU as barcode since no barcode field
    name: product.name,
    arabicName: product.nameArabic || '',
    description: product.description || '',
    category: product.category ? {
      _id: product.category.id,
      name: product.category.name,
      slug: product.category.name.toLowerCase().replace(/\s+/g, '-')
    } : null,
    brand: product.brand ? {
      _id: product.brand.id,
      name: product.brand.name,
      slug: product.brand.name.toLowerCase().replace(/\s+/g, '-')
    } : null,
    basePrice: Number(product.unitPrice),
    currentPrice: currentPrice,
    retailPrice: Number(product.unitPrice),
    wholesalePrice: Number(product.unitPrice) * 0.9,
    vipPrice: Number(product.unitPrice) * 0.92,
    exportPrice: Number(product.unitPrice) * 0.95,
    vatRate: 5,
    images: product.images ? JSON.parse(product.images) : [],
    stock: {
      quantity: product.stockQuantity || 0,
      minLevel: product.minStock || 0,
      maxLevel: product.maxStock || 100,
      lastUpdated: product.updatedAt
    },
    specifications: {
      unit: product.unit || 'piece',
      weight: product.weight || null,
      volume: product.volume || null
    },
    featured: product.isFeatured || false,
    active: product.isActive,
    pricingTiers: {
      retail: Number(product.unitPrice),
      wholesale: Number(product.unitPrice) * 0.9,
      vip: Number(product.unitPrice) * 0.92,
      export: Number(product.unitPrice) * 0.95
    },
    availability: {
      inStock: (product.stockQuantity || 0) > 0,
      lowStock: (product.stockQuantity || 0) <= (product.minStock || 0),
      stockLevel: product.stockQuantity || 0,
      canBackorder: false,
      estimatedRestockDate: (product.stockQuantity || 0) <= 0 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null
    },
    profitMargin: profitMargin.toFixed(2),
    loyaltyPointsEarned: Math.floor(currentPrice * 0.01 * 10),
    displayName: product.name,
    displayNameArabic: product.nameArabic || '',
    shortDescription: product.description?.substring(0, 100) + (product.description?.length > 100 ? '...' : ''),
    isNewArrival: new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isFeatured: product.isFeatured || false,
    categoryInfo: product.category,
    brandInfo: product.brand,
    primaryImage: product.images ? JSON.parse(product.images)[0] || '/images/placeholder-product.jpg' : '/images/placeholder-product.jpg',
    allImages: product.images ? JSON.parse(product.images) : ['/images/placeholder-product.jpg'],
    lastUpdated: product.updatedAt,
    pricing: {
      costPrice: Number(product.costPrice || 0),
      profitMargin: profitMargin,
      discountAllowed: true,
      maxDiscountPercent: 15
    }
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { barcode: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const barcode = params.barcode;
    const { searchParams } = new URL(request.url);

    // Query parameters for enhanced functionality
    const customerType = searchParams.get('customerType') || 'retail';
    const storeId = searchParams.get('storeId');
    const includeAlternatives = searchParams.get('includeAlternatives') === 'true';

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode parameter is required' },
        { status: 400 }
      );
    }

    // Search for product by SKU (using as barcode)
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { sku: barcode },
          { sku: { contains: barcode, mode: 'insensitive' } }
        ],
        isActive: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        {
          error: 'Product not found',
          message: `No product found with barcode/SKU: ${barcode}`,
          suggestions: [
            'Check if the barcode is correct',
            'Try scanning again',
            'Search manually by product name or SKU'
          ]
        },
        { status: 404 }
      );
    }

    // Enrich product data with pricing and availability
    const enrichedProduct = enrichProductData(product, customerType);

    // Prepare response
    const response: any = {
      product: enrichedProduct,
      foundBy: 'sku',
      scannedAt: new Date().toISOString(),
      storeId: storeId || null
    };

    // Include alternative/related products if requested
    if (includeAlternatives) {
      const alternatives = await prisma.product.findMany({
        where: {
          id: { not: product.id },
          isActive: true,
          OR: [
            { categoryId: product.categoryId },
            { brandId: product.brandId }
          ]
        },
        include: {
          category: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } }
        },
        take: 5
      });

      response.alternatives = alternatives.map(p => enrichProductData(p, customerType));
    }

    // Add stock warning if applicable
    if (enrichedProduct.availability.lowStock) {
      response.warning = {
        type: 'low_stock',
        message: `Only ${enrichedProduct.availability.stockLevel} units remaining`,
        action: 'Consider restocking soon'
      };
    }

    if (!enrichedProduct.availability.inStock) {
      response.warning = {
        type: 'out_of_stock',
        message: 'Product is currently out of stock',
        action: 'Check estimated restock date'
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Barcode lookup error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to process barcode lookup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST endpoint for bulk barcode lookup
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { barcodes, customerType = 'retail' } = await request.json();

    if (!Array.isArray(barcodes) || barcodes.length === 0) {
      return NextResponse.json(
        { error: 'Barcodes array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (barcodes.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 barcodes allowed per request' },
        { status: 400 }
      );
    }

    // Fetch all products matching the barcodes/SKUs
    const products = await prisma.product.findMany({
      where: {
        sku: { in: barcodes },
        isActive: true
      },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } }
      }
    });

    const results = barcodes.map(barcode => {
      const product = products.find(p => p.sku === barcode);

      if (!product) {
        return {
          barcode,
          found: false,
          error: 'Product not found or inactive'
        };
      }

      return {
        barcode,
        found: true,
        product: enrichProductData(product, customerType)
      };
    });

    return NextResponse.json({
      results,
      summary: {
        total: barcodes.length,
        found: results.filter(r => r.found).length,
        notFound: results.filter(r => !r.found).length
      }
    });

  } catch (error) {
    console.error('Bulk barcode lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk barcode lookup' },
      { status: 500 }
    );
  }
}
