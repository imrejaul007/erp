const { Promotion } = require('../models/sales');

class PromotionsEngine {
  constructor() {
    this.promotionTypes = {
      PERCENTAGE: 'percentage',
      FIXED_AMOUNT: 'fixed_amount',
      BUY_X_GET_Y: 'buy_x_get_y',
      BUNDLE: 'bundle',
      TIERED: 'tiered',
      LOYALTY: 'loyalty',
      CATEGORY: 'category',
      BRAND: 'brand',
      QUANTITY: 'quantity',
      SEASONAL: 'seasonal'
    };

    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async getApplicablePromotions(cart, customer, storeId) {
    try {
      const cacheKey = `promotions_${storeId}`;
      const cached = this.cache.get(cacheKey);

      let promotions;
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        promotions = cached.data;
      } else {
        promotions = await this.fetchActivePromotions(storeId);
        this.cache.set(cacheKey, { data: promotions, timestamp: Date.now() });
      }

      const applicablePromotions = [];

      for (const promotion of promotions) {
        const applicability = await this.evaluatePromotionApplicability(promotion, cart, customer);
        if (applicability.isApplicable) {
          applicablePromotions.push({
            ...promotion,
            ...applicability
          });
        }
      }

      // Sort by priority and potential discount amount
      return applicablePromotions.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.estimatedDiscount - a.estimatedDiscount;
      });

    } catch (error) {
      console.error('Error getting applicable promotions:', error);
      return [];
    }
  }

  async fetchActivePromotions(storeId) {
    const currentDate = new Date();

    return await Promotion.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      $or: [
        { applicableStores: { $in: [storeId] } },
        { applicableStores: { $size: 0 } } // No store restriction
      ],
      $or: [
        { usageLimit: { $exists: false } },
        { $expr: { $lt: ['$usageCount', '$usageLimit'] } }
      ]
    }).populate('applicableProducts applicableCategories');
  }

  async evaluatePromotionApplicability(promotion, cart, customer) {
    // Check customer eligibility
    if (!this.isCustomerEligible(promotion, customer)) {
      return { isApplicable: false, reason: 'Customer not eligible' };
    }

    // Check minimum purchase amount
    const cartTotal = this.calculateCartTotal(cart);
    if (promotion.minPurchaseAmount && cartTotal < promotion.minPurchaseAmount) {
      return { isApplicable: false, reason: 'Minimum purchase amount not met' };
    }

    // Check product/category applicability
    const eligibleItems = this.getEligibleItems(promotion, cart);
    if (eligibleItems.length === 0) {
      return { isApplicable: false, reason: 'No eligible items in cart' };
    }

    // Calculate discount based on promotion type
    const discountCalculation = this.calculatePromotion(promotion, cart, eligibleItems);

    return {
      isApplicable: true,
      eligibleItems,
      estimatedDiscount: discountCalculation.discountAmount,
      discountDetails: discountCalculation
    };
  }

  isCustomerEligible(promotion, customer) {
    if (!promotion.customerGroups || promotion.customerGroups.length === 0) {
      return true; // No customer restrictions
    }

    if (!customer) {
      return promotion.customerGroups.includes('all');
    }

    const customerGroup = customer.customerGroup || 'retail';
    return promotion.customerGroups.includes('all') ||
           promotion.customerGroups.includes(customerGroup);
  }

  getEligibleItems(promotion, cart) {
    return cart.filter(item => {
      // Check if specific products are targeted
      if (promotion.applicableProducts && promotion.applicableProducts.length > 0) {
        return promotion.applicableProducts.some(productId =>
          productId.toString() === item.productId.toString()
        );
      }

      // Check if specific categories are targeted
      if (promotion.applicableCategories && promotion.applicableCategories.length > 0) {
        return promotion.applicableCategories.some(categoryId =>
          categoryId.toString() === item.category?._id?.toString()
        );
      }

      // If no specific products or categories, all items are eligible
      return true;
    });
  }

  calculatePromotion(promotion, cart, eligibleItems) {
    switch (promotion.type) {
      case this.promotionTypes.PERCENTAGE:
        return this.calculatePercentageDiscount(promotion, eligibleItems);

      case this.promotionTypes.FIXED_AMOUNT:
        return this.calculateFixedAmountDiscount(promotion, eligibleItems);

      case this.promotionTypes.BUY_X_GET_Y:
        return this.calculateBuyXGetYDiscount(promotion, eligibleItems);

      case this.promotionTypes.BUNDLE:
        return this.calculateBundleDiscount(promotion, cart, eligibleItems);

      case this.promotionTypes.TIERED:
        return this.calculateTieredDiscount(promotion, eligibleItems);

      case this.promotionTypes.LOYALTY:
        return this.calculateLoyaltyDiscount(promotion, eligibleItems);

      case this.promotionTypes.QUANTITY:
        return this.calculateQuantityDiscount(promotion, eligibleItems);

      default:
        return { discountAmount: 0, appliedItems: [] };
    }
  }

  calculatePercentageDiscount(promotion, eligibleItems) {
    const percentage = promotion.value.percentage || 0;
    let totalDiscount = 0;
    const appliedItems = [];

    eligibleItems.forEach(item => {
      const itemTotal = item.quantity * item.unitPrice;
      const discount = (itemTotal * percentage) / 100;
      const cappedDiscount = promotion.maxDiscountAmount ?
        Math.min(discount, promotion.maxDiscountAmount) : discount;

      totalDiscount += cappedDiscount;
      appliedItems.push({
        itemId: item.id,
        discountAmount: cappedDiscount,
        discountType: 'percentage',
        discountValue: percentage
      });
    });

    return {
      discountAmount: totalDiscount,
      appliedItems,
      promotionType: this.promotionTypes.PERCENTAGE
    };
  }

  calculateFixedAmountDiscount(promotion, eligibleItems) {
    const fixedAmount = promotion.value.fixedAmount || 0;
    const eligibleTotal = this.calculateItemsTotal(eligibleItems);

    if (eligibleTotal < fixedAmount) {
      return { discountAmount: 0, appliedItems: [] };
    }

    // Distribute discount proportionally across eligible items
    const appliedItems = [];
    let remainingDiscount = fixedAmount;

    eligibleItems.forEach((item, index) => {
      const itemTotal = item.quantity * item.unitPrice;
      const proportion = itemTotal / eligibleTotal;
      let itemDiscount = fixedAmount * proportion;

      // Ensure last item gets any rounding remainder
      if (index === eligibleItems.length - 1) {
        itemDiscount = remainingDiscount;
      } else {
        remainingDiscount -= itemDiscount;
      }

      appliedItems.push({
        itemId: item.id,
        discountAmount: itemDiscount,
        discountType: 'fixed_amount',
        discountValue: fixedAmount
      });
    });

    return {
      discountAmount: fixedAmount,
      appliedItems,
      promotionType: this.promotionTypes.FIXED_AMOUNT
    };
  }

  calculateBuyXGetYDiscount(promotion, eligibleItems) {
    const buyQuantity = promotion.value.buyQuantity || 1;
    const getQuantity = promotion.value.getQuantity || 1;

    let totalDiscount = 0;
    const appliedItems = [];

    // Group items by product
    const itemGroups = this.groupItemsByProduct(eligibleItems);

    Object.values(itemGroups).forEach(items => {
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const eligibleSets = Math.floor(totalQuantity / (buyQuantity + getQuantity));

      if (eligibleSets > 0) {
        // Find cheapest items to discount
        const sortedItems = items.sort((a, b) => a.unitPrice - b.unitPrice);
        let discountQuantity = eligibleSets * getQuantity;

        sortedItems.forEach(item => {
          if (discountQuantity > 0) {
            const itemDiscountQty = Math.min(item.quantity, discountQuantity);
            const discount = itemDiscountQty * item.unitPrice;

            totalDiscount += discount;
            appliedItems.push({
              itemId: item.id,
              discountAmount: discount,
              discountQuantity: itemDiscountQty,
              discountType: 'buy_x_get_y'
            });

            discountQuantity -= itemDiscountQty;
          }
        });
      }
    });

    return {
      discountAmount: totalDiscount,
      appliedItems,
      promotionType: this.promotionTypes.BUY_X_GET_Y
    };
  }

  calculateBundleDiscount(promotion, cart, eligibleItems) {
    const bundlePrice = promotion.value.bundlePrice || 0;
    const requiredProducts = promotion.applicableProducts || [];

    if (requiredProducts.length === 0) {
      return { discountAmount: 0, appliedItems: [] };
    }

    // Check if all required products are in cart
    const availableProducts = new Set(
      eligibleItems.map(item => item.productId.toString())
    );

    const hasAllRequired = requiredProducts.every(productId =>
      availableProducts.has(productId.toString())
    );

    if (!hasAllRequired) {
      return { discountAmount: 0, appliedItems: [] };
    }

    // Calculate bundle sets available
    let maxBundles = Infinity;
    const bundleItems = [];

    requiredProducts.forEach(productId => {
      const item = eligibleItems.find(item =>
        item.productId.toString() === productId.toString()
      );
      if (item) {
        maxBundles = Math.min(maxBundles, item.quantity);
        bundleItems.push(item);
      }
    });

    if (maxBundles === 0) {
      return { discountAmount: 0, appliedItems: [] };
    }

    // Calculate regular price vs bundle price
    const regularPrice = bundleItems.reduce((sum, item) =>
      sum + (item.unitPrice * maxBundles), 0
    );

    const totalBundlePrice = bundlePrice * maxBundles;
    const discount = Math.max(0, regularPrice - totalBundlePrice);

    const appliedItems = bundleItems.map(item => ({
      itemId: item.id,
      discountAmount: discount / bundleItems.length, // Distribute evenly
      bundleQuantity: maxBundles,
      discountType: 'bundle'
    }));

    return {
      discountAmount: discount,
      appliedItems,
      promotionType: this.promotionTypes.BUNDLE
    };
  }

  calculateTieredDiscount(promotion, eligibleItems) {
    const tiers = promotion.value.tiers || [];
    const totalQuantity = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);

    // Find applicable tier
    const applicableTier = tiers
      .filter(tier => totalQuantity >= tier.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];

    if (!applicableTier) {
      return { discountAmount: 0, appliedItems: [] };
    }

    // Apply tier discount
    const tierDiscount = applicableTier.discount;
    const isPercentage = applicableTier.type === 'percentage';

    let totalDiscount = 0;
    const appliedItems = [];

    eligibleItems.forEach(item => {
      const itemTotal = item.quantity * item.unitPrice;
      let discount;

      if (isPercentage) {
        discount = (itemTotal * tierDiscount) / 100;
      } else {
        // Fixed amount distributed proportionally
        const totalValue = this.calculateItemsTotal(eligibleItems);
        discount = (itemTotal / totalValue) * tierDiscount;
      }

      totalDiscount += discount;
      appliedItems.push({
        itemId: item.id,
        discountAmount: discount,
        tier: applicableTier.minQuantity,
        discountType: 'tiered'
      });
    });

    return {
      discountAmount: totalDiscount,
      appliedItems,
      promotionType: this.promotionTypes.TIERED
    };
  }

  calculateLoyaltyDiscount(promotion, eligibleItems) {
    // This would integrate with customer loyalty points
    // For now, return a simple percentage-based calculation
    return this.calculatePercentageDiscount(promotion, eligibleItems);
  }

  calculateQuantityDiscount(promotion, eligibleItems) {
    const minQuantity = promotion.value.minQuantity || 1;
    const discountValue = promotion.value.discount || 0;
    const isPercentage = promotion.value.type === 'percentage';

    const totalQuantity = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity < minQuantity) {
      return { discountAmount: 0, appliedItems: [] };
    }

    // Apply quantity-based discount
    if (isPercentage) {
      return this.calculatePercentageDiscount({
        ...promotion,
        value: { percentage: discountValue }
      }, eligibleItems);
    } else {
      return this.calculateFixedAmountDiscount({
        ...promotion,
        value: { fixedAmount: discountValue }
      }, eligibleItems);
    }
  }

  async applyPromotions(cart, selectedPromotions, customer) {
    const appliedPromotions = [];
    let totalDiscount = 0;

    // Sort promotions by priority
    const sortedPromotions = selectedPromotions.sort((a, b) =>
      (b.priority || 1) - (a.priority || 1)
    );

    for (const promotion of sortedPromotions) {
      const eligibleItems = this.getEligibleItems(promotion, cart);
      const discountCalculation = this.calculatePromotion(promotion, cart, eligibleItems);

      if (discountCalculation.discountAmount > 0) {
        appliedPromotions.push({
          promotionId: promotion._id,
          name: promotion.name,
          type: promotion.type,
          discountAmount: discountCalculation.discountAmount,
          appliedItems: discountCalculation.appliedItems
        });

        totalDiscount += discountCalculation.discountAmount;

        // Update promotion usage count
        await this.updatePromotionUsage(promotion._id);
      }
    }

    return {
      appliedPromotions,
      totalDiscount
    };
  }

  async updatePromotionUsage(promotionId) {
    try {
      await Promotion.findByIdAndUpdate(
        promotionId,
        { $inc: { usageCount: 1 } }
      );
    } catch (error) {
      console.error('Error updating promotion usage:', error);
    }
  }

  // Helper methods
  calculateCartTotal(cart) {
    return cart.reduce((total, item) =>
      total + (item.quantity * item.unitPrice), 0
    );
  }

  calculateItemsTotal(items) {
    return items.reduce((total, item) =>
      total + (item.quantity * item.unitPrice), 0
    );
  }

  groupItemsByProduct(items) {
    return items.reduce((groups, item) => {
      const productId = item.productId.toString();
      if (!groups[productId]) {
        groups[productId] = [];
      }
      groups[productId].push(item);
      return groups;
    }, {});
  }

  // Promotion validation
  validatePromotion(promotion) {
    const errors = [];

    if (!promotion.name || promotion.name.trim() === '') {
      errors.push('Promotion name is required');
    }

    if (!promotion.type || !Object.values(this.promotionTypes).includes(promotion.type)) {
      errors.push('Valid promotion type is required');
    }

    if (!promotion.startDate || !promotion.endDate) {
      errors.push('Start date and end date are required');
    }

    if (promotion.startDate >= promotion.endDate) {
      errors.push('End date must be after start date');
    }

    if (promotion.usageLimit && promotion.usageLimit < 1) {
      errors.push('Usage limit must be greater than 0');
    }

    // Type-specific validations
    switch (promotion.type) {
      case this.promotionTypes.PERCENTAGE:
        if (!promotion.value.percentage || promotion.value.percentage <= 0 || promotion.value.percentage > 100) {
          errors.push('Percentage must be between 0 and 100');
        }
        break;

      case this.promotionTypes.FIXED_AMOUNT:
        if (!promotion.value.fixedAmount || promotion.value.fixedAmount <= 0) {
          errors.push('Fixed amount must be greater than 0');
        }
        break;

      case this.promotionTypes.BUY_X_GET_Y:
        if (!promotion.value.buyQuantity || promotion.value.buyQuantity < 1) {
          errors.push('Buy quantity must be at least 1');
        }
        if (!promotion.value.getQuantity || promotion.value.getQuantity < 1) {
          errors.push('Get quantity must be at least 1');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get promotion analytics
  async getPromotionAnalytics(promotionId, startDate, endDate) {
    try {
      // This would typically query transaction data
      // For now, return basic structure
      return {
        promotionId,
        period: { startDate, endDate },
        usage: {
          totalUsage: 0,
          totalDiscount: 0,
          averageDiscount: 0,
          uniqueCustomers: 0
        },
        performance: {
          conversionRate: 0,
          revenueImpact: 0,
          itemsSold: 0
        }
      };
    } catch (error) {
      console.error('Error getting promotion analytics:', error);
      return null;
    }
  }
}

module.exports = PromotionsEngine;