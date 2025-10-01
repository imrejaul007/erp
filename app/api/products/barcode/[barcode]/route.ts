import { NextRequest, NextResponse } from 'next/server';

// Mock product database - in real implementation, this would query your database
const mockProducts = [
  {
    _id: 'prod_001',
    sku: 'OUD-ROYAL-001',
    barcode: '1234567890123',
    name: 'Royal Oud Collection - Premium',
    arabicName: 'مجموعة العود الملكي - فاخر',
    description: 'Premium oud fragrance with notes of rose and amber',
    category: {
      _id: 'cat_001',
      name: 'Premium Oud',
      slug: 'premium-oud'
    },
    brand: {
      _id: 'brand_001',
      name: 'Royal Heritage',
      slug: 'royal-heritage'
    },
    basePrice: 500.00,
    retailPrice: 650.00,
    wholesalePrice: 450.00,
    vipPrice: 600.00,
    exportPrice: 520.00,
    vatRate: 5,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
      'https://images.unsplash.com/photo-1594736797933-d0d83a8dd74c?w=400'
    ],
    stock: {
      quantity: 45,
      minLevel: 10,
      maxLevel: 100,
      lastUpdated: new Date()
    },
    specifications: {
      volume: '12ml',
      concentration: 'Parfum',
      longevity: '8-12 hours',
      sillage: 'Strong',
      season: 'All seasons',
      occasion: 'Evening, Special occasions'
    },
    ingredients: [
      'Agarwood (Oud)',
      'Rose',
      'Amber',
      'Sandalwood',
      'Musk'
    ],
    featured: true,
    active: true,
    salesCount: 156,
    rating: 4.8,
    reviews: 23,
    tags: ['premium', 'oud', 'royal', 'luxury'],
    metadata: {
      weight: 50, // grams
      dimensions: { length: 5, width: 5, height: 10 }, // cm
      origin: 'UAE',
      ageRestriction: false,
      giftWrappable: true
    },
    pricing: {
      costPrice: 350.00,
      profitMargin: 46.15, // percentage
      discountAllowed: true,
      maxDiscountPercent: 15,
      loyaltyPointsEarned: 65, // points per purchase
      bulkPricing: [
        { minQuantity: 5, price: 620.00 },
        { minQuantity: 10, price: 590.00 },
        { minQuantity: 25, price: 550.00 }
      ]
    },
    compliance: {
      halalCertified: true,
      crueltyFree: true,
      vegan: false,
      organic: true,
      certifications: ['Halal', 'IFRA Compliant']
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-01')
  },
  {
    _id: 'prod_002',
    sku: 'ROSE-AMB-002',
    barcode: '2345678901234',
    name: 'Rose & Amber Perfume',
    arabicName: 'عطر الورد والعنبر',
    description: 'Elegant floral fragrance with rich amber base',
    category: {
      _id: 'cat_002',
      name: 'Floral',
      slug: 'floral'
    },
    brand: {
      _id: 'brand_002',
      name: 'Desert Bloom',
      slug: 'desert-bloom'
    },
    basePrice: 280.00,
    retailPrice: 380.00,
    wholesalePrice: 250.00,
    vipPrice: 350.00,
    exportPrice: 300.00,
    vatRate: 5,
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400'
    ],
    stock: {
      quantity: 28,
      minLevel: 5,
      maxLevel: 50,
      lastUpdated: new Date()
    },
    specifications: {
      volume: '10ml',
      concentration: 'Eau de Parfum',
      longevity: '6-8 hours',
      sillage: 'Moderate',
      season: 'Spring, Summer',
      occasion: 'Daily wear, Office'
    },
    ingredients: [
      'Rose',
      'Amber',
      'Jasmine',
      'Bergamot',
      'White Musk'
    ],
    featured: false,
    active: true,
    salesCount: 89,
    rating: 4.5,
    reviews: 12,
    tags: ['floral', 'rose', 'amber', 'elegant'],
    metadata: {
      weight: 35,
      dimensions: { length: 4, width: 4, height: 8 },
      origin: 'UAE',
      ageRestriction: false,
      giftWrappable: true
    },
    pricing: {
      costPrice: 200.00,
      profitMargin: 47.37,
      discountAllowed: true,
      maxDiscountPercent: 20,
      loyaltyPointsEarned: 38,
      bulkPricing: [
        { minQuantity: 5, price: 360.00 },
        { minQuantity: 10, price: 340.00 }
      ]
    },
    compliance: {
      halalCertified: true,
      crueltyFree: true,
      vegan: true,
      organic: false,
      certifications: ['Halal', 'IFRA Compliant', 'Vegan']
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-06-15')
  }
];

// Function to calculate appropriate price based on customer type and bulk quantity
function calculatePrice(product: any, customerType: string = 'retail', quantity: number = 1): number {
  let basePrice: number;

  // Determine base price by customer type
  switch (customerType.toLowerCase()) {
    case 'wholesale':
      basePrice = product.wholesalePrice || product.basePrice;
      break;
    case 'vip':
      basePrice = product.vipPrice || product.retailPrice || product.basePrice;
      break;
    case 'export':
      basePrice = product.exportPrice || product.retailPrice || product.basePrice;
      break;
    case 'retail':
    default:
      basePrice = product.retailPrice || product.basePrice;
      break;
  }

  // Apply bulk pricing if applicable
  if (product.pricing?.bulkPricing && quantity > 1) {
    const applicableBulkPrice = product.pricing.bulkPricing
      .filter((tier: any) => quantity >= tier.minQuantity)
      .sort((a: any, b: any) => b.minQuantity - a.minQuantity)[0];

    if (applicableBulkPrice) {
      basePrice = applicableBulkPrice.price;
    }
  }

  return basePrice;
}

// Enhanced product enrichment with pricing tiers and availability
function enrichProductData(product: any, customerType?: string, quantity: number = 1) {
  const enrichedProduct = {
    ...product,
    // Current price based on customer type and quantity
    currentPrice: calculatePrice(product, customerType, quantity),

    // All pricing tiers for reference
    pricingTiers: {
      retail: product.retailPrice || product.basePrice,
      wholesale: product.wholesalePrice || product.basePrice,
      vip: product.vipPrice || product.retailPrice || product.basePrice,
      export: product.exportPrice || product.retailPrice || product.basePrice
    },

    // Stock availability
    availability: {
      inStock: product.stock.quantity > 0,
      lowStock: product.stock.quantity <= product.stock.minLevel,
      stockLevel: product.stock.quantity,
      canBackorder: false, // Can be configured per product
      estimatedRestockDate: product.stock.quantity <= 0 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null
    },

    // Bulk pricing information
    bulkPricing: product.pricing?.bulkPricing || [],

    // Calculated fields
    profitMargin: product.pricing?.profitMargin || 0,
    loyaltyPointsEarned: Math.floor((calculatePrice(product, customerType, quantity) * 0.01) * 10), // 1% earning rate, 10 points per AED

    // Compliance and certifications
    certifications: product.compliance?.certifications || [],

    // SEO and display
    displayName: product.name,
    displayNameArabic: product.arabicName,
    shortDescription: product.description?.substring(0, 100) + (product.description?.length > 100 ? '...' : ''),

    // Promotional flags
    isOnSale: false, // Can be enhanced with promotion logic
    isNewArrival: new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isFeatured: product.featured,
    isPopular: product.salesCount > 100,

    // Category and brand info for filtering
    categoryInfo: product.category,
    brandInfo: product.brand,

    // Images with fallbacks
    primaryImage: product.images?.[0] || '/images/placeholder-product.jpg',
    allImages: product.images || ['/images/placeholder-product.jpg'],

    // Meta information
    lastUpdated: product.updatedAt,
    searchTags: [
      product.sku.toLowerCase(),
      product.name.toLowerCase(),
      ...(product.tags || []),
      product.brand?.name.toLowerCase(),
      product.category?.name.toLowerCase()
    ].filter(Boolean)
  };

  return enrichedProduct;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { barcode: string } }
) {
  try {
    const barcode = params.barcode;
    const { searchParams } = new URL(request.url);

    // Query parameters for enhanced functionality
    const customerType = searchParams.get('customerType') || 'retail';
    const quantity = parseInt(searchParams.get('quantity') || '1');
    const storeId = searchParams.get('storeId');
    const includeAlternatives = searchParams.get('includeAlternatives') === 'true';

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode parameter is required' },
        { status: 400 }
      );
    }

    // Search for product by barcode
    const product = mockProducts.find(p => p.barcode === barcode);

    if (!product) {
      // If barcode not found, try searching by SKU as fallback
      const productBySku = mockProducts.find(p =>
        p.sku.toLowerCase() === barcode.toLowerCase()
      );

      if (!productBySku) {
        return NextResponse.json(
          {
            error: 'Product not found',
            message: `No product found with barcode: ${barcode}`,
            suggestions: [
              'Check if the barcode is correct',
              'Try scanning again',
              'Search manually by product name or SKU'
            ]
          },
          { status: 404 }
        );
      }

      // Return product found by SKU
      const enrichedProduct = enrichProductData(productBySku, customerType, quantity);

      return NextResponse.json({
        product: enrichedProduct,
        foundBy: 'sku',
        message: 'Product found by SKU instead of barcode'
      });
    }

    // Check if product is active
    if (!product.active) {
      return NextResponse.json(
        {
          error: 'Product not available',
          message: 'This product is currently not available for sale'
        },
        { status: 410 }
      );
    }

    // Enrich product data with pricing and availability
    const enrichedProduct = enrichProductData(product, customerType, quantity);

    // Prepare response
    const response: any = {
      product: enrichedProduct,
      foundBy: 'barcode',
      scannedAt: new Date().toISOString(),
      storeId: storeId || null
    };

    // Include alternative/related products if requested
    if (includeAlternatives) {
      const alternatives = mockProducts
        .filter(p =>
          p._id !== product._id &&
          p.active &&
          (p.category._id === product.category._id || p.brand._id === product.brand._id)
        )
        .slice(0, 5)
        .map(p => enrichProductData(p, customerType, 1));

      response.alternatives = alternatives;
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

    // Log the scan for analytics (in real implementation)
    console.log(`Product scanned: ${product.sku} - ${product.name} by ${customerType} customer`);

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

    const results = barcodes.map(barcode => {
      const product = mockProducts.find(p => p.barcode === barcode);

      if (!product || !product.active) {
        return {
          barcode,
          found: false,
          error: 'Product not found or inactive'
        };
      }

      return {
        barcode,
        found: true,
        product: enrichProductData(product, customerType, 1)
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