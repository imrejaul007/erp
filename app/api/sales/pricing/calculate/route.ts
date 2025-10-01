import { NextRequest, NextResponse } from 'next/server';

export interface PricingTier {
  id: string;
  name: string;
  nameArabic?: string;
  description: string;
  priority: number;
  active: boolean;
  conditions: {
    customerTypes?: ('retail' | 'wholesale' | 'vip' | 'export' | 'staff')[];
    customerTiers?: ('bronze' | 'silver' | 'gold' | 'platinum' | 'diamond')[];
    minQuantity?: number;
    maxQuantity?: number;
    minOrderValue?: number;
    categories?: string[];
    brands?: string[];
    skus?: string[];
    countries?: string[]; // For export pricing
    currencies?: string[];
    timeRestrictions?: {
      validFrom?: string;
      validTo?: string;
      daysOfWeek?: number[];
      hoursOfDay?: { start: string; end: string };
    };
    seasonality?: {
      months?: number[];
      quarters?: number[];
      events?: string[]; // 'ramadan', 'eid', 'national-day', etc.
    };
  };
  pricing: {
    type: 'fixed' | 'percentage_off' | 'percentage_markup' | 'tiered' | 'dynamic';
    basePrice?: number;
    percentageOff?: number;
    percentageMarkup?: number;
    fixedPrice?: number;
    tieredPricing?: {
      minQuantity: number;
      price: number;
      percentageOff?: number;
    }[];
    dynamicFactors?: {
      demandMultiplier?: number;
      seasonalMultiplier?: number;
      inventoryMultiplier?: number;
    };
  };
  margins: {
    minMargin?: number; // Minimum profit margin percentage
    maxDiscount?: number; // Maximum discount allowed
  };
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  baseCost: number;
  basePrice: number;
  retailPrice?: number;
  wholesalePrice?: number;
  vipPrice?: number;
  exportPrice?: number;
  currentStock: number;
  minimumStock: number;
  averageSalesVelocity: number; // units per day
  seasonality: {
    highSeason: number[]; // months 1-12
    lowSeason: number[];
  };
  compliance: {
    vatRate: number;
    exportRestricted: boolean;
    luxuryTax: boolean;
  };
}

export interface Customer {
  id: string;
  type: 'retail' | 'wholesale' | 'vip' | 'export' | 'staff';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  country: string;
  currency: string;
  totalLifetimeValue: number;
  loyaltyPoints: number;
  registrationDate: string;
  lastPurchaseDate?: string;
  averageOrderValue: number;
  purchaseFrequency: number;
  preferredCategories: string[];
}

export interface PricingRequest {
  product: Product;
  customer?: Customer;
  quantity: number;
  currency?: string;
  channel: 'pos' | 'online' | 'wholesale' | 'export';
  location?: {
    country: string;
    state?: string;
    city?: string;
  };
  contextData?: {
    currentDate?: string;
    specialEvent?: string;
    isUrgentOrder?: boolean;
    paymentTerms?: string;
  };
}

export interface PricingResult {
  productId: string;
  sku: string;
  basePrice: number;
  finalPrice: number;
  currency: string;
  quantity: number;
  totalAmount: number;
  appliedTiers: {
    tierId: string;
    name: string;
    type: string;
    adjustment: number;
    description: string;
  }[];
  margins: {
    costPrice: number;
    profitAmount: number;
    profitMargin: number; // percentage
  };
  taxes: {
    vatRate: number;
    vatAmount: number;
    luxuryTax?: number;
    totalTaxes: number;
  };
  discounts: {
    volumeDiscount: number;
    loyaltyDiscount: number;
    tierDiscount: number;
    totalDiscount: number;
  };
  priceBreakdown: {
    component: string;
    amount: number;
    description: string;
  }[];
  recommendations?: {
    type: 'upsell' | 'cross-sell' | 'volume-incentive';
    message: string;
    savingsAmount?: number;
  }[];
  validity: {
    validUntil: string;
    priceGuarantee: boolean;
  };
}

// Mock pricing tiers
const pricingTiers: PricingTier[] = [
  {
    id: 'tier_001',
    name: 'VIP Customer Pricing',
    nameArabic: 'أسعار العملاء المميزين',
    description: 'Special pricing for VIP customers',
    priority: 10,
    active: true,
    conditions: {
      customerTypes: ['vip'],
      customerTiers: ['platinum', 'diamond'],
      minOrderValue: 200
    },
    pricing: {
      type: 'percentage_off',
      percentageOff: 15
    },
    margins: {
      minMargin: 25,
      maxDiscount: 20
    }
  },
  {
    id: 'tier_002',
    name: 'Wholesale Pricing',
    nameArabic: 'أسعار الجملة',
    description: 'Bulk purchase pricing for wholesale customers',
    priority: 8,
    active: true,
    conditions: {
      customerTypes: ['wholesale'],
      minQuantity: 10
    },
    pricing: {
      type: 'tiered',
      tieredPricing: [
        { minQuantity: 10, percentageOff: 12 },
        { minQuantity: 25, percentageOff: 18 },
        { minQuantity: 50, percentageOff: 25 },
        { minQuantity: 100, percentageOff: 30 }
      ]
    },
    margins: {
      minMargin: 20,
      maxDiscount: 35
    }
  },
  {
    id: 'tier_003',
    name: 'Export Pricing',
    nameArabic: 'أسعار التصدير',
    description: 'Special pricing for export customers',
    priority: 9,
    active: true,
    conditions: {
      customerTypes: ['export'],
      countries: ['SA', 'KW', 'BH', 'OM', 'QA'],
      minQuantity: 5
    },
    pricing: {
      type: 'percentage_off',
      percentageOff: 10
    },
    margins: {
      minMargin: 22,
      maxDiscount: 15
    }
  },
  {
    id: 'tier_004',
    name: 'Volume Discount',
    nameArabic: 'خصم الكمية',
    description: 'Volume-based pricing for large orders',
    priority: 6,
    active: true,
    conditions: {
      minQuantity: 5
    },
    pricing: {
      type: 'tiered',
      tieredPricing: [
        { minQuantity: 5, percentageOff: 5 },
        { minQuantity: 10, percentageOff: 8 },
        { minQuantity: 20, percentageOff: 12 }
      ]
    },
    margins: {
      minMargin: 25,
      maxDiscount: 15
    }
  },
  {
    id: 'tier_005',
    name: 'Seasonal Pricing',
    nameArabic: 'الأسعار الموسمية',
    description: 'Seasonal adjustments for perfumes',
    priority: 5,
    active: true,
    conditions: {
      categories: ['Premium Oud', 'Floral'],
      seasonality: {
        months: [11, 12, 1, 2], // High season months
        events: ['ramadan', 'eid']
      }
    },
    pricing: {
      type: 'dynamic',
      dynamicFactors: {
        seasonalMultiplier: 1.1,
        demandMultiplier: 1.05
      }
    },
    margins: {
      minMargin: 30
    }
  },
  {
    id: 'tier_006',
    name: 'Staff Discount',
    nameArabic: 'خصم الموظفين',
    description: 'Employee discount pricing',
    priority: 12,
    active: true,
    conditions: {
      customerTypes: ['staff']
    },
    pricing: {
      type: 'percentage_off',
      percentageOff: 30
    },
    margins: {
      minMargin: 15,
      maxDiscount: 35
    }
  }
];

// Check if pricing tier conditions are met
function checkTierConditions(tier: PricingTier, request: PricingRequest): boolean {
  const { product, customer, quantity, currency, channel, location, contextData } = request;
  const conditions = tier.conditions;

  // Check customer type
  if (conditions.customerTypes && customer) {
    if (!conditions.customerTypes.includes(customer.type)) {
      return false;
    }
  }

  // Check customer tier
  if (conditions.customerTiers && customer) {
    if (!conditions.customerTiers.includes(customer.tier)) {
      return false;
    }
  }

  // Check quantity
  if (conditions.minQuantity && quantity < conditions.minQuantity) {
    return false;
  }
  if (conditions.maxQuantity && quantity > conditions.maxQuantity) {
    return false;
  }

  // Check order value (estimated)
  if (conditions.minOrderValue) {
    const estimatedValue = quantity * product.basePrice;
    if (estimatedValue < conditions.minOrderValue) {
      return false;
    }
  }

  // Check categories
  if (conditions.categories && !conditions.categories.includes(product.category)) {
    return false;
  }

  // Check brands
  if (conditions.brands && !conditions.brands.includes(product.brand)) {
    return false;
  }

  // Check SKUs
  if (conditions.skus && !conditions.skus.includes(product.sku)) {
    return false;
  }

  // Check countries
  if (conditions.countries && location) {
    if (!conditions.countries.includes(location.country)) {
      return false;
    }
  }

  // Check currencies
  if (conditions.currencies && currency) {
    if (!conditions.currencies.includes(currency)) {
      return false;
    }
  }

  // Check time restrictions
  if (conditions.timeRestrictions) {
    const now = new Date(contextData?.currentDate || new Date());

    if (conditions.timeRestrictions.validFrom && now < new Date(conditions.timeRestrictions.validFrom)) {
      return false;
    }
    if (conditions.timeRestrictions.validTo && now > new Date(conditions.timeRestrictions.validTo)) {
      return false;
    }

    if (conditions.timeRestrictions.daysOfWeek) {
      const dayOfWeek = now.getDay();
      if (!conditions.timeRestrictions.daysOfWeek.includes(dayOfWeek)) {
        return false;
      }
    }

    if (conditions.timeRestrictions.hoursOfDay) {
      const hour = now.getHours();
      const start = parseInt(conditions.timeRestrictions.hoursOfDay.start.split(':')[0]);
      const end = parseInt(conditions.timeRestrictions.hoursOfDay.end.split(':')[0]);
      if (hour < start || hour > end) {
        return false;
      }
    }
  }

  // Check seasonality
  if (conditions.seasonality) {
    const now = new Date(contextData?.currentDate || new Date());
    const currentMonth = now.getMonth() + 1;

    if (conditions.seasonality.months && !conditions.seasonality.months.includes(currentMonth)) {
      return false;
    }

    if (conditions.seasonality.events && contextData?.specialEvent) {
      if (!conditions.seasonality.events.includes(contextData.specialEvent)) {
        return false;
      }
    }
  }

  return true;
}

// Calculate price adjustment for a tier
function calculateTierAdjustment(tier: PricingTier, basePrice: number, quantity: number, product: Product): number {
  const pricing = tier.pricing;
  let adjustment = 0;

  switch (pricing.type) {
    case 'fixed':
      adjustment = (pricing.fixedPrice || 0) - basePrice;
      break;

    case 'percentage_off':
      adjustment = -(basePrice * (pricing.percentageOff || 0)) / 100;
      break;

    case 'percentage_markup':
      adjustment = (basePrice * (pricing.percentageMarkup || 0)) / 100;
      break;

    case 'tiered':
      if (pricing.tieredPricing) {
        const applicableTier = pricing.tieredPricing
          .filter(t => quantity >= t.minQuantity)
          .sort((a, b) => b.minQuantity - a.minQuantity)[0];

        if (applicableTier) {
          if (applicableTier.price) {
            adjustment = applicableTier.price - basePrice;
          } else if (applicableTier.percentageOff) {
            adjustment = -(basePrice * applicableTier.percentageOff) / 100;
          }
        }
      }
      break;

    case 'dynamic':
      if (pricing.dynamicFactors) {
        let multiplier = 1;

        // Apply demand multiplier
        if (pricing.dynamicFactors.demandMultiplier) {
          multiplier *= pricing.dynamicFactors.demandMultiplier;
        }

        // Apply seasonal multiplier
        if (pricing.dynamicFactors.seasonalMultiplier) {
          const currentMonth = new Date().getMonth() + 1;
          if (product.seasonality.highSeason.includes(currentMonth)) {
            multiplier *= pricing.dynamicFactors.seasonalMultiplier;
          }
        }

        // Apply inventory multiplier (scarcity pricing)
        if (pricing.dynamicFactors.inventoryMultiplier && product.currentStock < product.minimumStock) {
          multiplier *= pricing.dynamicFactors.inventoryMultiplier || 1.1;
        }

        adjustment = (basePrice * multiplier) - basePrice;
      }
      break;
  }

  // Apply margin constraints
  const finalPrice = basePrice + adjustment;
  const costPrice = product.baseCost;
  const proposedMargin = ((finalPrice - costPrice) / finalPrice) * 100;

  // Ensure minimum margin
  if (tier.margins.minMargin && proposedMargin < tier.margins.minMargin) {
    const requiredPrice = costPrice / (1 - tier.margins.minMargin / 100);
    adjustment = requiredPrice - basePrice;
  }

  // Ensure maximum discount limit
  if (tier.margins.maxDiscount) {
    const maxDiscountAmount = (basePrice * tier.margins.maxDiscount) / 100;
    if (adjustment < -maxDiscountAmount) {
      adjustment = -maxDiscountAmount;
    }
  }

  return adjustment;
}

// Calculate loyalty discount
function calculateLoyaltyDiscount(customer: Customer, baseAmount: number): number {
  if (!customer) return 0;

  const tierDiscounts = {
    'bronze': 0.02,   // 2%
    'silver': 0.03,   // 3%
    'gold': 0.05,     // 5%
    'platinum': 0.08, // 8%
    'diamond': 0.12   // 12%
  };

  const discountRate = tierDiscounts[customer.tier] || 0;
  return baseAmount * discountRate;
}

// Calculate taxes
function calculateTaxes(amount: number, product: Product): {
  vatRate: number;
  vatAmount: number;
  luxuryTax?: number;
  totalTaxes: number;
} {
  const vatRate = product.compliance.vatRate || 5; // UAE standard VAT
  const vatAmount = (amount * vatRate) / 100;

  let luxuryTax = 0;
  if (product.compliance.luxuryTax) {
    luxuryTax = amount * 0.05; // 5% luxury tax on high-end items
  }

  return {
    vatRate,
    vatAmount,
    luxuryTax: luxuryTax > 0 ? luxuryTax : undefined,
    totalTaxes: vatAmount + luxuryTax
  };
}

// Generate pricing recommendations
function generateRecommendations(request: PricingRequest, result: PricingResult): any[] {
  const recommendations = [];
  const { product, quantity, customer } = request;

  // Volume incentive recommendations
  const nextVolumeThreshold = [5, 10, 20, 50].find(threshold => quantity < threshold);
  if (nextVolumeThreshold) {
    const potentialSavings = (result.finalPrice * nextVolumeThreshold * 0.05); // Estimate 5% savings
    recommendations.push({
      type: 'volume-incentive',
      message: `Order ${nextVolumeThreshold - quantity} more items to unlock volume pricing`,
      savingsAmount: potentialSavings
    });
  }

  // Customer tier upgrade recommendation
  if (customer && customer.tier === 'bronze' && customer.totalLifetimeValue > 2000) {
    recommendations.push({
      type: 'upsell',
      message: 'You\'re eligible for Silver tier benefits! Contact us to upgrade.',
      savingsAmount: result.finalPrice * 0.01 // 1% additional savings
    });
  }

  return recommendations;
}

// Main pricing calculation function
function calculatePricing(request: PricingRequest): PricingResult {
  const { product, customer, quantity, currency = 'AED' } = request;

  // Start with base price or customer-specific base price
  let basePrice = product.basePrice;
  if (customer) {
    switch (customer.type) {
      case 'wholesale':
        basePrice = product.wholesalePrice || product.basePrice;
        break;
      case 'vip':
        basePrice = product.vipPrice || product.retailPrice || product.basePrice;
        break;
      case 'export':
        basePrice = product.exportPrice || product.basePrice;
        break;
      case 'retail':
      default:
        basePrice = product.retailPrice || product.basePrice;
        break;
    }
  }

  // Find applicable pricing tiers
  const applicableTiers = pricingTiers
    .filter(tier => tier.active && checkTierConditions(tier, request))
    .sort((a, b) => b.priority - a.priority);

  // Apply tier adjustments
  let finalPrice = basePrice;
  const appliedTiers = [];
  let totalVolumeDiscount = 0;

  for (const tier of applicableTiers) {
    const adjustment = calculateTierAdjustment(tier, basePrice, quantity, product);
    if (adjustment !== 0) {
      finalPrice += adjustment;
      appliedTiers.push({
        tierId: tier.id,
        name: tier.name,
        type: tier.pricing.type,
        adjustment,
        description: tier.description
      });

      // Track volume discounts separately
      if (tier.name.toLowerCase().includes('volume') || tier.name.toLowerCase().includes('bulk')) {
        totalVolumeDiscount += Math.abs(adjustment);
      }
    }
  }

  // Calculate loyalty discount
  const loyaltyDiscount = customer ? calculateLoyaltyDiscount(customer, finalPrice) : 0;
  finalPrice -= loyaltyDiscount;

  // Ensure price doesn't go below cost
  finalPrice = Math.max(finalPrice, product.baseCost * 1.1); // Minimum 10% margin

  // Calculate totals
  const totalAmount = finalPrice * quantity;

  // Calculate margins
  const profitAmount = (finalPrice - product.baseCost) * quantity;
  const profitMargin = ((finalPrice - product.baseCost) / finalPrice) * 100;

  // Calculate taxes
  const taxes = calculateTaxes(totalAmount, product);

  // Calculate tier discount
  const tierDiscount = basePrice - finalPrice - loyaltyDiscount;

  // Create price breakdown
  const priceBreakdown = [
    { component: 'Base Price', amount: basePrice, description: 'Original product price' },
    ...appliedTiers.map(tier => ({
      component: tier.name,
      amount: tier.adjustment,
      description: tier.description
    })),
    ...(loyaltyDiscount > 0 ? [{
      component: 'Loyalty Discount',
      amount: -loyaltyDiscount,
      description: `${customer?.tier.toUpperCase()} member discount`
    }] : []),
    { component: 'Final Price', amount: finalPrice, description: 'Price per unit after all adjustments' }
  ];

  const result: PricingResult = {
    productId: product.id,
    sku: product.sku,
    basePrice,
    finalPrice: Math.round(finalPrice * 100) / 100,
    currency,
    quantity,
    totalAmount: Math.round(totalAmount * 100) / 100,
    appliedTiers,
    margins: {
      costPrice: product.baseCost,
      profitAmount: Math.round(profitAmount * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100
    },
    taxes,
    discounts: {
      volumeDiscount: Math.round(totalVolumeDiscount * 100) / 100,
      loyaltyDiscount: Math.round(loyaltyDiscount * 100) / 100,
      tierDiscount: Math.round(tierDiscount * 100) / 100,
      totalDiscount: Math.round((totalVolumeDiscount + loyaltyDiscount + tierDiscount) * 100) / 100
    },
    priceBreakdown,
    validity: {
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      priceGuarantee: appliedTiers.some(tier => tier.type === 'fixed')
    }
  };

  result.recommendations = generateRecommendations(request, result);

  return result;
}

// POST endpoint for pricing calculation
export async function POST(request: NextRequest) {
  try {
    const pricingRequest: PricingRequest = await request.json();

    // Validate request
    if (!pricingRequest.product || !pricingRequest.quantity || pricingRequest.quantity <= 0) {
      return NextResponse.json(
        { error: 'Product and valid quantity are required' },
        { status: 400 }
      );
    }

    const result = calculatePricing(pricingRequest);

    return NextResponse.json({
      success: true,
      pricing: result,
      calculatedAt: new Date().toISOString(),
      requestId: `pricing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error('Pricing calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate pricing' },
      { status: 500 }
    );
  }
}

// GET endpoint for pricing tiers and configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerType = searchParams.get('customerType');
    const category = searchParams.get('category');

    let filteredTiers = pricingTiers.filter(tier => tier.active);

    if (customerType) {
      filteredTiers = filteredTiers.filter(tier =>
        !tier.conditions.customerTypes ||
        tier.conditions.customerTypes.includes(customerType as any)
      );
    }

    if (category) {
      filteredTiers = filteredTiers.filter(tier =>
        !tier.conditions.categories ||
        tier.conditions.categories.includes(category)
      );
    }

    return NextResponse.json({
      pricingTiers: filteredTiers.map(tier => ({
        id: tier.id,
        name: tier.name,
        nameArabic: tier.nameArabic,
        description: tier.description,
        priority: tier.priority,
        conditions: tier.conditions,
        pricing: {
          type: tier.pricing.type,
          ...(tier.pricing.type === 'percentage_off' && { percentageOff: tier.pricing.percentageOff }),
          ...(tier.pricing.type === 'tiered' && { tieredPricing: tier.pricing.tieredPricing })
        }
      })),
      baseCurrency: 'AED',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get pricing tiers error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve pricing tiers' },
      { status: 500 }
    );
  }
}