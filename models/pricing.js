const mongoose = require('mongoose');

// Pricing Tiers Schema
const pricingTierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  type: {
    type: String,
    required: true,
    enum: ['retail', 'wholesale', 'b2b', 'export', 'vip', 'staff']
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  minimumQuantity: {
    type: Number,
    default: 1
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'AED',
    enum: ['AED', 'USD', 'EUR', 'SAR', 'QAR']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: Date,
  applicableStores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  }],
  applicableCustomerGroups: [{
    type: String,
    enum: ['all', 'vip', 'wholesale', 'retail', 'export', 'staff']
  }]
}, {
  timestamps: true
});

// Product Pricing Schema
const productPricingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  baseCurrency: {
    type: String,
    default: 'AED',
    enum: ['AED', 'USD', 'EUR', 'SAR', 'QAR']
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  tierPrices: [{
    tierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PricingTier',
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'AED'
    }
  }],
  bulkPricing: [{
    minQuantity: {
      type: Number,
      required: true,
      min: 1
    },
    maxQuantity: Number,
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  vatRate: {
    type: Number,
    default: 5, // UAE standard VAT rate
    min: 0,
    max: 100
  },
  vatIncluded: {
    type: Boolean,
    default: false
  },
  margin: {
    type: Number,
    min: 0
  },
  markupPercentage: {
    type: Number,
    min: 0
  },
  exportPricing: {
    hsCode: String,
    exportPrice: Number,
    exportCurrency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'AED']
    },
    dutyRate: Number,
    exportMargin: Number
  },
  dynamicPricing: {
    enabled: {
      type: Boolean,
      default: false
    },
    strategy: {
      type: String,
      enum: ['demand_based', 'competitor_based', 'time_based', 'inventory_based']
    },
    rules: [{
      condition: String,
      operator: {
        type: String,
        enum: ['greater_than', 'less_than', 'equals', 'between']
      },
      value: Number,
      action: {
        type: String,
        enum: ['increase_price', 'decrease_price', 'set_price']
      },
      adjustment: Number,
      adjustmentType: {
        type: String,
        enum: ['percentage', 'fixed_amount']
      }
    }]
  },
  priceHistory: [{
    price: Number,
    currency: String,
    reason: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    effectiveFrom: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Currency Exchange Rates Schema
const exchangeRateSchema = new mongoose.Schema({
  baseCurrency: {
    type: String,
    required: true,
    default: 'AED'
  },
  targetCurrency: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true,
    min: 0
  },
  source: {
    type: String,
    enum: ['manual', 'api', 'bank'],
    default: 'manual'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: Date,
  lastSync: Date
}, {
  timestamps: true
});

// Price Rules Schema
const priceRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    required: true,
    enum: ['markup', 'markdown', 'competitor_match', 'inventory_based', 'seasonal']
  },
  conditions: [{
    field: {
      type: String,
      required: true,
      enum: ['category', 'brand', 'stock_level', 'sales_velocity', 'competitor_price', 'season', 'cost_price']
    },
    operator: {
      type: String,
      required: true,
      enum: ['equals', 'not_equals', 'greater_than', 'less_than', 'between', 'in', 'not_in']
    },
    value: mongoose.Schema.Types.Mixed
  }],
  actions: [{
    type: {
      type: String,
      required: true,
      enum: ['set_price', 'adjust_price', 'set_margin', 'apply_discount']
    },
    value: Number,
    valueType: {
      type: String,
      enum: ['percentage', 'fixed_amount', 'multiplier']
    }
  }],
  priority: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  schedule: {
    startDate: Date,
    endDate: Date,
    recurring: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly']
    }
  }
}, {
  timestamps: true
});

// Competitor Pricing Schema
const competitorPricingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sku: String,
  competitorName: {
    type: String,
    required: true
  },
  competitorPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'AED'
  },
  source: {
    type: String,
    enum: ['manual', 'api', 'scraping'],
    default: 'manual'
  },
  url: String,
  lastChecked: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true
});

// Indexes for performance
pricingTierSchema.index({ type: 1, isActive: 1 });
productPricingSchema.index({ productId: 1 });
productPricingSchema.index({ sku: 1 });
exchangeRateSchema.index({ baseCurrency: 1, targetCurrency: 1, isActive: 1 });
priceRuleSchema.index({ isActive: 1, priority: -1 });
competitorPricingSchema.index({ productId: 1, competitorName: 1 });

module.exports = {
  PricingTier: mongoose.model('PricingTier', pricingTierSchema),
  ProductPricing: mongoose.model('ProductPricing', productPricingSchema),
  ExchangeRate: mongoose.model('ExchangeRate', exchangeRateSchema),
  PriceRule: mongoose.model('PriceRule', priceRuleSchema),
  CompetitorPricing: mongoose.model('CompetitorPricing', competitorPricingSchema)
};