const express = require('express');
const router = express.Router();
const { SalesTransaction, Return, Promotion, Loyalty } = require('../models/sales');
const { Invoice } = require('../models/invoice');
const VATCalculatorService = require('../services/VATCalculatorService');
const PromotionsEngine = require('../services/PromotionsEngine');
const CurrencyService = require('../services/CurrencyService');
const ReceiptGenerator = require('../services/ReceiptGenerator');

const vatCalculator = new VATCalculatorService();
const promotionsEngine = new PromotionsEngine();
const currencyService = new CurrencyService();
const receiptGenerator = new ReceiptGenerator();

// Authentication middleware (placeholder)
const authenticate = (req, res, next) => {
  // Implement your authentication logic here
  req.user = { _id: 'user123', role: 'cashier' }; // Mock user
  next();
};

// Authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};

// POS Transaction Routes

// Create new transaction
router.post('/pos/transaction', authenticate, async (req, res) => {
  try {
    const {
      storeId,
      customerId,
      items,
      currency = 'AED',
      paymentMethod,
      paymentDetails,
      promotionsApplied = [],
      loyaltyPointsUsed = 0
    } = req.body;

    // Validate required fields
    if (!storeId || !items || !items.length || !paymentMethod) {
      return res.status(400).json({
        error: 'Missing required fields: storeId, items, paymentMethod'
      });
    }

    // Calculate VAT and totals
    const vatCalculation = vatCalculator.calculateTransactionVAT(items, [], currency);

    // Apply promotions
    const promotionResults = await promotionsEngine.applyPromotions(
      items,
      promotionsApplied,
      customerId ? { _id: customerId } : null
    );

    // Calculate loyalty discount
    let loyaltyDiscount = 0;
    if (loyaltyPointsUsed > 0) {
      loyaltyDiscount = loyaltyPointsUsed * 0.1; // 1 point = 0.1 AED
    }

    // Final totals
    const subtotal = vatCalculation.subtotal - promotionResults.totalDiscount - loyaltyDiscount;
    const grandTotal = subtotal + vatCalculation.totalVAT;

    // Create transaction
    const transaction = new SalesTransaction({
      storeId,
      customerId,
      cashierId: req.user._id,
      items: vatCalculation.items,
      subtotal,
      totalDiscount: promotionResults.totalDiscount + loyaltyDiscount,
      totalVat: vatCalculation.totalVAT,
      grandTotal,
      currency,
      paymentMethod,
      paymentDetails,
      promotionsApplied: promotionResults.appliedPromotions,
      loyaltyPointsUsed,
      loyaltyPointsEarned: Math.floor(grandTotal * 0.01 * 10), // 1% earning rate
      vatBreakdown: vatCalculation.vatBreakdown,
      receiptNumber: `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });

    await transaction.save();

    // Update customer loyalty points if applicable
    if (customerId) {
      await updateCustomerLoyalty(customerId, transaction);
    }

    // Update inventory (would implement inventory service)
    // await updateInventory(items);

    res.status(201).json({
      success: true,
      transaction: transaction.toObject(),
      receipt: {
        receiptNumber: transaction.receiptNumber,
        total: grandTotal,
        currency
      }
    });

  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({
      error: 'Failed to create transaction',
      details: error.message
    });
  }
});

// Get transaction by ID
router.get('/pos/transaction/:id', authenticate, async (req, res) => {
  try {
    const transaction = await SalesTransaction.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('cashierId', 'name');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to retrieve transaction' });
  }
});

// Get transactions with filters
router.get('/pos/transactions', authenticate, async (req, res) => {
  try {
    const {
      storeId,
      startDate,
      endDate,
      customerId,
      status,
      paymentMethod,
      page = 1,
      limit = 50
    } = req.query;

    const filter = {};

    if (storeId) filter.storeId = storeId;
    if (customerId) filter.customerId = customerId;
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      SalesTransaction.find(filter)
        .populate('customerId', 'name email')
        .populate('cashierId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SalesTransaction.countDocuments(filter)
    ]);

    res.json({
      transactions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

// Generate receipt
router.post('/pos/transaction/:id/receipt', authenticate, async (req, res) => {
  try {
    const { type = 'standard', format = 'pdf', email = false } = req.body;

    const transaction = await SalesTransaction.findById(req.params.id)
      .populate('customerId')
      .populate('storeId');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Mock store data (would come from store service)
    const store = {
      name: 'Oud & Perfume Palace',
      logo: null,
      address: {
        street: 'Dubai Mall',
        city: 'Dubai',
        emirate: 'Dubai',
        country: 'UAE'
      },
      phone: '+971-4-123-4567',
      email: 'info@oudpalace.ae',
      vatNumber: '100123456789012'
    };

    const receipt = await receiptGenerator.generateReceipt(
      transaction,
      store,
      transaction.customerId,
      { type, format }
    );

    if (email && transaction.customerId?.email) {
      const emailData = await receiptGenerator.generateReceiptEmail(
        transaction,
        store,
        transaction.customerId
      );
      // Send email (would implement email service)
      console.log('Email would be sent to:', emailData.to);
    }

    res.setHeader('Content-Type', receipt.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${receipt.filename}"`);
    res.send(receipt.buffer);

  } catch (error) {
    console.error('Receipt generation error:', error);
    res.status(500).json({ error: 'Failed to generate receipt' });
  }
});

// Invoice Routes

// Create invoice from transaction
router.post('/invoices/from-transaction/:transactionId', authenticate, authorize(['manager', 'admin']), async (req, res) => {
  try {
    const { invoiceType = 'tax_invoice', customDetails = {} } = req.body;

    const transaction = await SalesTransaction.findById(req.params.transactionId)
      .populate('customerId')
      .populate('storeId');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(transaction.storeId, invoiceType);

    const invoice = new Invoice({
      invoiceNumber,
      invoiceType,
      storeId: transaction.storeId,
      customerId: transaction.customerId,
      salesTransactionId: transaction._id,
      supplier: customDetails.supplier || {
        name: 'Oud & Perfume Palace',
        vatNumber: '100123456789012'
      },
      customer: {
        name: transaction.customerId?.name || 'Walk-in Customer',
        type: 'individual'
      },
      currency: transaction.currency,
      items: transaction.items.map(item => ({
        description: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: { amount: item.discount || 0 },
        lineTotal: item.totalPrice,
        vatRate: item.vatRate || 5,
        vatAmount: item.vatAmount
      })),
      subtotal: transaction.subtotal,
      totalDiscount: transaction.totalDiscount,
      taxableAmount: transaction.subtotal,
      vatBreakdown: transaction.vatBreakdown || [],
      totalVat: transaction.totalVat,
      grandTotal: transaction.grandTotal,
      paymentMethod: transaction.paymentMethod,
      paymentStatus: 'paid',
      paidAmount: transaction.grandTotal,
      createdBy: req.user._id
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      invoice: invoice.toObject()
    });

  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Get invoices
router.get('/invoices', authenticate, async (req, res) => {
  try {
    const {
      storeId,
      customerId,
      invoiceType,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const filter = {};

    if (storeId) filter.storeId = storeId;
    if (customerId) filter.customerId = customerId;
    if (invoiceType) filter.invoiceType = invoiceType;
    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.issueDate = {};
      if (startDate) filter.issueDate.$gte = new Date(startDate);
      if (endDate) filter.issueDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate('customerId', 'name email')
        .sort({ issueDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Invoice.countDocuments(filter)
    ]);

    res.json({
      invoices,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to retrieve invoices' });
  }
});

// Promotions Routes

// Get applicable promotions
router.post('/promotions/applicable', authenticate, async (req, res) => {
  try {
    const { cart, customerId, storeId } = req.body;

    if (!cart || !Array.isArray(cart)) {
      return res.status(400).json({ error: 'Cart is required and must be an array' });
    }

    const customer = customerId ? await Customer.findById(customerId) : null;
    const promotions = await promotionsEngine.getApplicablePromotions(cart, customer, storeId);

    res.json({
      success: true,
      promotions,
      count: promotions.length
    });

  } catch (error) {
    console.error('Get applicable promotions error:', error);
    res.status(500).json({ error: 'Failed to get applicable promotions' });
  }
});

// Create promotion
router.post('/promotions', authenticate, authorize(['manager', 'admin']), async (req, res) => {
  try {
    const promotionData = req.body;

    // Validate promotion
    const validation = promotionsEngine.validatePromotion(promotionData);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Invalid promotion data',
        details: validation.errors
      });
    }

    const promotion = new Promotion(promotionData);
    await promotion.save();

    // Clear promotions cache
    promotionsEngine.clearCache();

    res.status(201).json({
      success: true,
      promotion: promotion.toObject()
    });

  } catch (error) {
    console.error('Promotion creation error:', error);
    res.status(500).json({ error: 'Failed to create promotion' });
  }
});

// Returns/Refunds Routes

// Create return
router.post('/returns', authenticate, authorize(['cashier', 'manager', 'admin']), async (req, res) => {
  try {
    const {
      originalTransactionId,
      returnItems,
      reason,
      refundMethod = 'cash',
      notes
    } = req.body;

    if (!originalTransactionId || !returnItems || !returnItems.length) {
      return res.status(400).json({
        error: 'Original transaction ID and return items are required'
      });
    }

    const originalTransaction = await SalesTransaction.findById(originalTransactionId);
    if (!originalTransaction) {
      return res.status(404).json({ error: 'Original transaction not found' });
    }

    // Calculate refund amount
    const totalRefundAmount = returnItems.reduce((total, item) => {
      return total + (item.quantityReturned * item.unitPrice);
    }, 0);

    const returnRecord = new Return({
      originalTransactionId,
      storeId: originalTransaction.storeId,
      customerId: originalTransaction.customerId,
      processedBy: req.user._id,
      returnItems,
      totalRefundAmount,
      refundMethod,
      reason,
      notes,
      status: 'pending'
    });

    await returnRecord.save();

    res.status(201).json({
      success: true,
      return: returnRecord.toObject()
    });

  } catch (error) {
    console.error('Return creation error:', error);
    res.status(500).json({ error: 'Failed to create return' });
  }
});

// Approve return
router.patch('/returns/:id/approve', authenticate, authorize(['manager', 'admin']), async (req, res) => {
  try {
    const returnRecord = await Return.findById(req.params.id);
    if (!returnRecord) {
      return res.status(404).json({ error: 'Return not found' });
    }

    returnRecord.status = 'approved';
    returnRecord.approvedBy = req.user._id;
    returnRecord.approvedAt = new Date();

    await returnRecord.save();

    // Update original transaction
    await SalesTransaction.findByIdAndUpdate(
      returnRecord.originalTransactionId,
      { status: 'refunded', refundedAt: new Date() }
    );

    res.json({
      success: true,
      return: returnRecord.toObject()
    });

  } catch (error) {
    console.error('Return approval error:', error);
    res.status(500).json({ error: 'Failed to approve return' });
  }
});

// Reports Routes

// Sales report
router.get('/reports/sales', authenticate, authorize(['manager', 'admin']), async (req, res) => {
  try {
    const {
      storeId,
      startDate,
      endDate,
      groupBy = 'day' // day, week, month
    } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const filter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      status: 'completed'
    };

    if (storeId) filter.storeId = storeId;

    const transactions = await SalesTransaction.find(filter);

    // Generate report
    const report = generateSalesReport(transactions, groupBy);

    res.json({
      success: true,
      report,
      period: { startDate, endDate },
      totalTransactions: transactions.length
    });

  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
});

// VAT report
router.get('/reports/vat', authenticate, authorize(['manager', 'admin']), async (req, res) => {
  try {
    const { startDate, endDate, storeId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const filter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      status: 'completed'
    };

    if (storeId) filter.storeId = storeId;

    const transactions = await SalesTransaction.find(filter);
    const vatReport = vatCalculator.generateVATReport(transactions, new Date(startDate), new Date(endDate));

    res.json({
      success: true,
      vatReport
    });

  } catch (error) {
    console.error('VAT report error:', error);
    res.status(500).json({ error: 'Failed to generate VAT report' });
  }
});

// Helper functions

async function updateCustomerLoyalty(customerId, transaction) {
  try {
    let loyalty = await Loyalty.findOne({ customerId });

    if (!loyalty) {
      loyalty = new Loyalty({
        customerId,
        points: 0,
        totalSpent: 0,
        totalTransactions: 0
      });
    }

    // Update loyalty data
    loyalty.points += transaction.loyaltyPointsEarned - transaction.loyaltyPointsUsed;
    loyalty.totalSpent += transaction.grandTotal;
    loyalty.totalTransactions += 1;

    // Update tier based on total spent
    if (loyalty.totalSpent >= 10000) {
      loyalty.tier = 'diamond';
    } else if (loyalty.totalSpent >= 5000) {
      loyalty.tier = 'platinum';
    } else if (loyalty.totalSpent >= 2000) {
      loyalty.tier = 'gold';
    } else if (loyalty.totalSpent >= 500) {
      loyalty.tier = 'silver';
    }

    // Add points history
    loyalty.pointsHistory.push({
      transactionId: transaction._id,
      pointsEarned: transaction.loyaltyPointsEarned,
      pointsUsed: transaction.loyaltyPointsUsed,
      balance: loyalty.points,
      reason: 'Purchase transaction'
    });

    await loyalty.save();
  } catch (error) {
    console.error('Loyalty update error:', error);
  }
}

async function generateInvoiceNumber(storeId, invoiceType) {
  // Simple implementation - in production, use proper sequence management
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  const typePrefix = invoiceType === 'tax_invoice' ? 'TI' : 'SI';
  return `${typePrefix}-${timestamp}-${random}`;
}

function generateSalesReport(transactions, groupBy) {
  const report = {
    summary: {
      totalSales: 0,
      totalTransactions: transactions.length,
      averageTransaction: 0,
      totalVAT: 0
    },
    breakdown: []
  };

  // Calculate summary
  transactions.forEach(transaction => {
    report.summary.totalSales += transaction.grandTotal;
    report.summary.totalVAT += transaction.totalVat;
  });

  report.summary.averageTransaction = report.summary.totalSales / report.summary.totalTransactions;

  // Group by period
  // Implementation would depend on groupBy parameter
  // For now, return basic summary

  return report;
}

module.exports = router;