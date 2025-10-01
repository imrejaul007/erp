const mongoose = require('mongoose');

// Sales Transaction Schema
const salesTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    default: () => `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  cashierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    sku: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    vatAmount: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  totalVat: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'AED',
    enum: ['AED', 'USD', 'EUR', 'SAR', 'QAR']
  },
  exchangeRate: {
    type: Number,
    default: 1
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'card', 'digital', 'bank_transfer', 'cheque', 'loyalty_points']
  },
  paymentDetails: {
    cardType: String,
    lastFourDigits: String,
    approvalCode: String,
    digitalWallet: String,
    bankReference: String
  },
  promotionsApplied: [{
    promotionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Promotion'
    },
    name: String,
    discountAmount: Number,
    type: String
  }],
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled', 'refunded'],
    default: 'completed'
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  vatInvoiceNumber: {
    type: String,
    unique: true
  },
  notes: String,
  refundedAt: Date,
  refundReason: String,
  originalTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesTransaction'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Returns/Refunds Schema
const returnSchema = new mongoose.Schema({
  returnId: {
    type: String,
    required: true,
    unique: true,
    default: () => `RET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  originalTransactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesTransaction',
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  returnItems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    sku: String,
    name: String,
    quantityReturned: {
      type: Number,
      required: true,
      min: 1
    },
    originalQuantity: Number,
    unitPrice: Number,
    refundAmount: Number,
    reason: {
      type: String,
      enum: ['damaged', 'defective', 'wrong_item', 'customer_change_mind', 'expired', 'other']
    },
    condition: {
      type: String,
      enum: ['new', 'used', 'damaged', 'expired']
    }
  }],
  totalRefundAmount: {
    type: Number,
    required: true
  },
  refundMethod: {
    type: String,
    enum: ['cash', 'card', 'store_credit', 'exchange'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  reason: String,
  notes: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date
}, {
  timestamps: true
});

// Promotions Schema
const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed_amount', 'buy_x_get_y', 'bundle', 'tiered', 'loyalty']
  },
  value: {
    percentage: Number,
    fixedAmount: Number,
    buyQuantity: Number,
    getQuantity: Number,
    bundlePrice: Number,
    tiers: [{
      minQuantity: Number,
      discount: Number
    }]
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  minPurchaseAmount: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: Number,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: Number,
  usageCount: {
    type: Number,
    default: 0
  },
  applicableStores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  }],
  customerGroups: [{
    type: String,
    enum: ['all', 'vip', 'wholesale', 'retail', 'export']
  }],
  priority: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Customer Loyalty Schema
const loyaltySchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  totalTransactions: {
    type: Number,
    default: 0
  },
  pointsHistory: [{
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalesTransaction'
    },
    pointsEarned: Number,
    pointsUsed: Number,
    balance: Number,
    reason: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  benefits: [{
    type: String,
    description: String,
    validUntil: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
salesTransactionSchema.index({ storeId: 1, createdAt: -1 });
salesTransactionSchema.index({ customerId: 1, createdAt: -1 });
salesTransactionSchema.index({ transactionId: 1 });
salesTransactionSchema.index({ receiptNumber: 1 });
salesTransactionSchema.index({ vatInvoiceNumber: 1 });

returnSchema.index({ originalTransactionId: 1 });
returnSchema.index({ storeId: 1, createdAt: -1 });
returnSchema.index({ returnId: 1 });

promotionSchema.index({ startDate: 1, endDate: 1 });
promotionSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

loyaltySchema.index({ customerId: 1 });

module.exports = {
  SalesTransaction: mongoose.model('SalesTransaction', salesTransactionSchema),
  Return: mongoose.model('Return', returnSchema),
  Promotion: mongoose.model('Promotion', promotionSchema),
  Loyalty: mongoose.model('Loyalty', loyaltySchema)
};