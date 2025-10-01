import { NextRequest, NextResponse } from 'next/server';

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Customer {
  id: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  totalSpent: number;
  loyaltyPoints: number;
  purchaseHistory: number;
  birthMonth?: number;
  registrationDate: string;
}

export interface PromotionRule {
  id: string;
  name: string;
  nameArabic?: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'bogo' | 'bundle' | 'tier_discount' | 'volume_discount' | 'category_discount' | 'brand_discount';
  active: boolean;
  priority: number; // Higher numbers = higher priority
  startDate: string;
  endDate: string;
  conditions: {
    minAmount?: number;
    maxAmount?: number;
    minQuantity?: number;
    categories?: string[];
    brands?: string[];
    skus?: string[];
    customerTiers?: string[];
    firstTimeCustomer?: boolean;
    birthdayMonth?: boolean;
    timeRestrictions?: {
      days?: number[]; // 0-6 (Sunday-Saturday)
      hours?: { start: string; end: string };
    };
    locationRestrictions?: string[];
    maxUsagePerCustomer?: number;
    maxUsageTotal?: number;
  };
  discount: {
    value: number; // Percentage or fixed amount
    maxDiscount?: number; // Maximum discount amount for percentage-based
    applyTo?: 'cart' | 'item' | 'cheapest' | 'most_expensive' | 'category';
    bogoConfig?: {
      buyQuantity: number;
      getQuantity: number;
      maxFreeItems?: number;
      applyToSameSku?: boolean;
    };
    bundleConfig?: {
      requiredItems: { sku?: string; category?: string; brand?: string; quantity: number }[];
      bundlePrice?: number;
      bundleDiscount?: number;
    };
  };
  stackable: boolean; // Can be combined with other promotions
  autoApply: boolean; // Automatically apply when conditions are met
  promotionCode?: string; // Manual promo code
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppliedPromotion {
  promotionId: string;
  name: string;
  type: string;
  discountAmount: number;
  appliedToItems: string[]; // Item IDs that received the discount
  description: string;
  savings: number;
}

// Mock promotions database
const activePromotions: PromotionRule[] = [
  {
    id: 'promo_001',
    name: 'Oud Lovers Special',
    nameArabic: 'عرض خاص لعشاق العود',
    description: '20% off on all Premium Oud products',
    type: 'category_discount',
    active: true,
    priority: 5,
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    conditions: {
      categories: ['Premium Oud', 'Royal Oud'],
      minAmount: 200
    },
    discount: {
      value: 20,
      applyTo: 'category',
      maxDiscount: 500
    },
    stackable: true,
    autoApply: true,
    usageCount: 156,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z'
  },
  {
    id: 'promo_002',
    name: 'Buy 2 Get 1 Free - Floral Collection',
    nameArabic: 'اشتري اثنين واحصل على واحد مجاناً - مجموعة الزهور',
    description: 'Buy any 2 floral perfumes, get the cheapest one free',
    type: 'bogo',
    active: true,
    priority: 8,
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-07-31T23:59:59Z',
    conditions: {
      categories: ['Floral'],
      minQuantity: 2
    },
    discount: {
      value: 100,
      applyTo: 'cheapest',
      bogoConfig: {
        buyQuantity: 2,
        getQuantity: 1,
        maxFreeItems: 3
      }
    },
    stackable: false,
    autoApply: true,
    usageCount: 89,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z'
  },
  {
    id: 'promo_003',
    name: 'VIP Tier Exclusive',
    nameArabic: 'حصري لفئة كبار الشخصيات',
    description: 'Additional 15% discount for Platinum and Diamond members',
    type: 'tier_discount',
    active: true,
    priority: 10,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    conditions: {
      customerTiers: ['platinum', 'diamond'],
      minAmount: 100
    },
    discount: {
      value: 15,
      applyTo: 'cart',
      maxDiscount: 1000
    },
    stackable: true,
    autoApply: true,
    usageCount: 234,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'promo_004',
    name: 'Ramadan Special Bundle',
    nameArabic: 'باقة رمضان الخاصة',
    description: 'Oud + Attar + Rose Water bundle for AED 299',
    type: 'bundle',
    active: true,
    priority: 9,
    startDate: '2024-03-01T00:00:00Z',
    endDate: '2024-04-30T23:59:59Z',
    conditions: {
      categories: ['Premium Oud', 'Attar', 'Accessories']
    },
    discount: {
      value: 150,
      applyTo: 'cart',
      bundleConfig: {
        requiredItems: [
          { category: 'Premium Oud', quantity: 1 },
          { category: 'Attar', quantity: 1 },
          { category: 'Accessories', quantity: 1 }
        ],
        bundlePrice: 299,
        bundleDiscount: 150
      }
    },
    stackable: false,
    autoApply: true,
    usageCount: 45,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'promo_005',
    name: 'Birthday Month Special',
    nameArabic: 'عرض شهر الميلاد الخاص',
    description: '25% off for birthday month customers',
    type: 'percentage',
    active: true,
    priority: 12,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    conditions: {
      birthdayMonth: true,
      maxUsagePerCustomer: 1
    },
    discount: {
      value: 25,
      applyTo: 'cart',
      maxDiscount: 200
    },
    stackable: false,
    autoApply: true,
    usageCount: 67,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'promo_006',
    name: 'Volume Discount',
    nameArabic: 'خصم الكمية',
    description: 'Buy 5+ items and get 10% off, 10+ items get 15% off',
    type: 'volume_discount',
    active: true,
    priority: 6,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    conditions: {
      minQuantity: 5
    },
    discount: {
      value: 10,
      applyTo: 'cart',
      maxDiscount: 500
    },
    stackable: true,
    autoApply: true,
    usageCount: 123,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'promo_007',
    name: 'SUMMER20',
    nameArabic: 'صيف20',
    description: '20% off with promo code SUMMER20',
    type: 'percentage',
    active: true,
    priority: 7,
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-08-31T23:59:59Z',
    conditions: {
      minAmount: 150
    },
    discount: {
      value: 20,
      applyTo: 'cart',
      maxDiscount: 300
    },
    stackable: false,
    autoApply: false,
    promotionCode: 'SUMMER20',
    usageCount: 78,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z'
  }
];

// Check if promotion conditions are met
function checkPromotionConditions(promotion: PromotionRule, cart: CartItem[], customer?: Customer, promoCode?: string): boolean {
  const now = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);

  // Check if promotion is active and within date range
  if (!promotion.active || now < startDate || now > endDate) {
    return false;
  }

  // Check promo code requirement
  if (promotion.promotionCode && (!promoCode || promoCode !== promotion.promotionCode)) {
    return false;
  }

  // If requires promo code but auto-apply is true, skip
  if (promotion.promotionCode && promotion.autoApply) {
    return false;
  }

  const conditions = promotion.conditions;

  // Check cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  if (conditions.minAmount && cartTotal < conditions.minAmount) {
    return false;
  }
  if (conditions.maxAmount && cartTotal > conditions.maxAmount) {
    return false;
  }

  // Check cart quantity
  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (conditions.minQuantity && cartQuantity < conditions.minQuantity) {
    return false;
  }

  // Check categories
  if (conditions.categories && conditions.categories.length > 0) {
    const hasRequiredCategory = cart.some(item => conditions.categories!.includes(item.category));
    if (!hasRequiredCategory) {
      return false;
    }
  }

  // Check brands
  if (conditions.brands && conditions.brands.length > 0) {
    const hasRequiredBrand = cart.some(item => conditions.brands!.includes(item.brand));
    if (!hasRequiredBrand) {
      return false;
    }
  }

  // Check SKUs
  if (conditions.skus && conditions.skus.length > 0) {
    const hasRequiredSku = cart.some(item => conditions.skus!.includes(item.sku));
    if (!hasRequiredSku) {
      return false;
    }
  }

  // Check customer tier
  if (customer && conditions.customerTiers && conditions.customerTiers.length > 0) {
    if (!conditions.customerTiers.includes(customer.tier)) {
      return false;
    }
  }

  // Check first time customer
  if (conditions.firstTimeCustomer && customer && customer.purchaseHistory > 0) {
    return false;
  }

  // Check birthday month
  if (conditions.birthdayMonth && customer) {
    const currentMonth = now.getMonth() + 1;
    if (!customer.birthMonth || customer.birthMonth !== currentMonth) {
      return false;
    }
  }

  // Check time restrictions
  if (conditions.timeRestrictions) {
    const currentDay = now.getDay();
    const currentHour = now.getHours();

    if (conditions.timeRestrictions.days && !conditions.timeRestrictions.days.includes(currentDay)) {
      return false;
    }

    if (conditions.timeRestrictions.hours) {
      const startHour = parseInt(conditions.timeRestrictions.hours.start.split(':')[0]);
      const endHour = parseInt(conditions.timeRestrictions.hours.end.split(':')[0]);
      if (currentHour < startHour || currentHour > endHour) {
        return false;
      }
    }
  }

  return true;
}

// Calculate discount for a specific promotion
function calculatePromotionDiscount(promotion: PromotionRule, cart: CartItem[], customer?: Customer): AppliedPromotion | null {
  const discount = promotion.discount;
  let discountAmount = 0;
  let appliedToItems: string[] = [];
  let description = promotion.description;

  switch (promotion.type) {
    case 'percentage':
      const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
      discountAmount = (cartTotal * discount.value) / 100;
      if (discount.maxDiscount) {
        discountAmount = Math.min(discountAmount, discount.maxDiscount);
      }
      appliedToItems = cart.map(item => item.id);
      break;

    case 'fixed_amount':
      discountAmount = discount.value;
      appliedToItems = cart.map(item => item.id);
      break;

    case 'category_discount':
      const categoryItems = cart.filter(item =>
        promotion.conditions.categories?.includes(item.category)
      );
      const categoryTotal = categoryItems.reduce((sum, item) => sum + item.totalPrice, 0);
      discountAmount = (categoryTotal * discount.value) / 100;
      if (discount.maxDiscount) {
        discountAmount = Math.min(discountAmount, discount.maxDiscount);
      }
      appliedToItems = categoryItems.map(item => item.id);
      break;

    case 'brand_discount':
      const brandItems = cart.filter(item =>
        promotion.conditions.brands?.includes(item.brand)
      );
      const brandTotal = brandItems.reduce((sum, item) => sum + item.totalPrice, 0);
      discountAmount = (brandTotal * discount.value) / 100;
      if (discount.maxDiscount) {
        discountAmount = Math.min(discountAmount, discount.maxDiscount);
      }
      appliedToItems = brandItems.map(item => item.id);
      break;

    case 'bogo':
      if (discount.bogoConfig) {
        const eligibleItems = cart.filter(item =>
          !promotion.conditions.categories ||
          promotion.conditions.categories.includes(item.category)
        ).sort((a, b) => a.unitPrice - b.unitPrice); // Sort by price (cheapest first)

        const { buyQuantity, getQuantity, maxFreeItems = 999 } = discount.bogoConfig;
        let freeItemsCount = 0;
        let totalEligibleQty = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);

        while (totalEligibleQty >= buyQuantity && freeItemsCount < maxFreeItems) {
          // Find cheapest items to make free
          for (const item of eligibleItems) {
            if (freeItemsCount >= maxFreeItems) break;
            const freeQty = Math.min(getQuantity, item.quantity, maxFreeItems - freeItemsCount);
            discountAmount += item.unitPrice * freeQty;
            appliedToItems.push(item.id);
            freeItemsCount += freeQty;
            totalEligibleQty -= buyQuantity;
            break;
          }
        }
      }
      break;

    case 'bundle':
      if (discount.bundleConfig) {
        const { requiredItems, bundleDiscount = 0 } = discount.bundleConfig;
        let canApplyBundle = true;

        // Check if all required items are in cart
        for (const required of requiredItems) {
          let found = false;
          if (required.sku) {
            found = cart.some(item => item.sku === required.sku && item.quantity >= required.quantity);
          } else if (required.category) {
            const categoryItems = cart.filter(item => item.category === required.category);
            const totalQty = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
            found = totalQty >= required.quantity;
          } else if (required.brand) {
            const brandItems = cart.filter(item => item.brand === required.brand);
            const totalQty = brandItems.reduce((sum, item) => sum + item.quantity, 0);
            found = totalQty >= required.quantity;
          }

          if (!found) {
            canApplyBundle = false;
            break;
          }
        }

        if (canApplyBundle) {
          discountAmount = bundleDiscount;
          appliedToItems = cart.map(item => item.id);
        }
      }
      break;

    case 'volume_discount':
      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
      let volumeDiscountPercent = discount.value;

      // Enhanced volume discount tiers
      if (totalQuantity >= 10) {
        volumeDiscountPercent = 15;
      } else if (totalQuantity >= 5) {
        volumeDiscountPercent = 10;
      }

      const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);
      discountAmount = (totalAmount * volumeDiscountPercent) / 100;
      if (discount.maxDiscount) {
        discountAmount = Math.min(discountAmount, discount.maxDiscount);
      }
      appliedToItems = cart.map(item => item.id);
      description = `${volumeDiscountPercent}% off for ${totalQuantity} items`;
      break;

    case 'tier_discount':
      if (customer) {
        const tierTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        discountAmount = (tierTotal * discount.value) / 100;
        if (discount.maxDiscount) {
          discountAmount = Math.min(discountAmount, discount.maxDiscount);
        }
        appliedToItems = cart.map(item => item.id);
        description = `${discount.value}% ${customer.tier.toUpperCase()} member discount`;
      }
      break;
  }

  if (discountAmount <= 0) {
    return null;
  }

  return {
    promotionId: promotion.id,
    name: promotion.name,
    type: promotion.type,
    discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
    appliedToItems,
    description,
    savings: Math.round(discountAmount * 100) / 100
  };
}

// Calculate all applicable promotions
function calculatePromotions(cart: CartItem[], customer?: Customer, promoCodes: string[] = []): {
  appliedPromotions: AppliedPromotion[];
  totalDiscount: number;
  originalTotal: number;
  finalTotal: number;
} {
  const applicablePromotions = activePromotions
    .filter(promo => {
      // Check auto-apply promotions
      if (promo.autoApply) {
        return checkPromotionConditions(promo, cart, customer);
      }
      // Check promo code promotions
      if (promo.promotionCode) {
        return promoCodes.includes(promo.promotionCode) &&
               checkPromotionConditions(promo, cart, customer, promo.promotionCode);
      }
      return false;
    })
    .sort((a, b) => b.priority - a.priority); // Sort by priority (highest first)

  const appliedPromotions: AppliedPromotion[] = [];
  let remainingCart = [...cart];
  let totalDiscount = 0;

  for (const promotion of applicablePromotions) {
    // Check if promotion can stack
    if (!promotion.stackable && appliedPromotions.length > 0) {
      continue;
    }

    const promotionResult = calculatePromotionDiscount(promotion, remainingCart, customer);
    if (promotionResult) {
      appliedPromotions.push(promotionResult);
      totalDiscount += promotionResult.discountAmount;

      // If promotion is not stackable, break
      if (!promotion.stackable) {
        break;
      }
    }
  }

  const originalTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const finalTotal = Math.max(0, originalTotal - totalDiscount);

  return {
    appliedPromotions,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    originalTotal: Math.round(originalTotal * 100) / 100,
    finalTotal: Math.round(finalTotal * 100) / 100
  };
}

// POST endpoint for calculating promotions
export async function POST(request: NextRequest) {
  try {
    const { cart, customer, promoCodes = [] } = await request.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: 'Cart is required and must contain items' },
        { status: 400 }
      );
    }

    // Validate cart items
    for (const item of cart) {
      if (!item.id || !item.sku || !item.name || item.quantity <= 0 || item.unitPrice < 0) {
        return NextResponse.json(
          { error: 'Invalid cart item format' },
          { status: 400 }
        );
      }
    }

    const result = calculatePromotions(cart, customer, promoCodes);

    // Add recommendations for additional promotions
    const recommendations = [];

    // Check for upsell opportunities
    for (const promotion of activePromotions) {
      if (promotion.active && promotion.autoApply) {
        const conditions = promotion.conditions;

        // Check if customer is close to qualifying
        if (conditions.minAmount) {
          const currentTotal = result.originalTotal;
          if (currentTotal >= conditions.minAmount * 0.8 && currentTotal < conditions.minAmount) {
            const amountNeeded = conditions.minAmount - currentTotal;
            recommendations.push({
              type: 'spend_more',
              promotion: promotion.name,
              message: `Spend AED ${amountNeeded.toFixed(2)} more to get ${promotion.description}`,
              amountNeeded
            });
          }
        }

        if (conditions.minQuantity) {
          const currentQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
          if (currentQuantity >= conditions.minQuantity * 0.8 && currentQuantity < conditions.minQuantity) {
            const qtyNeeded = conditions.minQuantity - currentQuantity;
            recommendations.push({
              type: 'add_items',
              promotion: promotion.name,
              message: `Add ${qtyNeeded} more item${qtyNeeded > 1 ? 's' : ''} to get ${promotion.description}`,
              quantityNeeded: qtyNeeded
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      promotions: result,
      recommendations: recommendations.slice(0, 3), // Limit to top 3 recommendations
      availablePromoCodes: activePromotions
        .filter(p => p.promotionCode && p.active && !promoCodes.includes(p.promotionCode))
        .map(p => ({
          code: p.promotionCode,
          name: p.name,
          description: p.description,
          minAmount: p.conditions.minAmount
        })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Promotion calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate promotions' },
      { status: 500 }
    );
  }
}

// GET endpoint for available promotions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerTier = searchParams.get('customerTier');
    const category = searchParams.get('category');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    let filteredPromotions = activePromotions;

    if (activeOnly) {
      const now = new Date();
      filteredPromotions = filteredPromotions.filter(p =>
        p.active &&
        new Date(p.startDate) <= now &&
        new Date(p.endDate) >= now
      );
    }

    if (customerTier) {
      filteredPromotions = filteredPromotions.filter(p =>
        !p.conditions.customerTiers ||
        p.conditions.customerTiers.includes(customerTier.toLowerCase())
      );
    }

    if (category) {
      filteredPromotions = filteredPromotions.filter(p =>
        !p.conditions.categories ||
        p.conditions.categories.includes(category)
      );
    }

    const promotionsResponse = filteredPromotions.map(p => ({
      id: p.id,
      name: p.name,
      nameArabic: p.nameArabic,
      description: p.description,
      type: p.type,
      priority: p.priority,
      startDate: p.startDate,
      endDate: p.endDate,
      autoApply: p.autoApply,
      promotionCode: p.promotionCode,
      stackable: p.stackable,
      conditions: p.conditions,
      discount: {
        value: p.discount.value,
        maxDiscount: p.discount.maxDiscount,
        applyTo: p.discount.applyTo
      },
      usageCount: p.usageCount
    }));

    return NextResponse.json({
      promotions: promotionsResponse,
      total: promotionsResponse.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get promotions error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve promotions' },
      { status: 500 }
    );
  }
}