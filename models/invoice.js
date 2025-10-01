const mongoose = require('mongoose');

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  invoiceType: {
    type: String,
    required: true,
    enum: ['tax_invoice', 'simplified_invoice', 'export_invoice', 'proforma_invoice', 'credit_note', 'debit_note']
  },
  series: {
    type: String,
    required: true,
    default: 'INV'
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  salesTransactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesTransaction'
  },

  // Supplier Information (for the store)
  supplier: {
    name: {
      type: String,
      required: true
    },
    arabicName: String,
    vatNumber: String,
    crNumber: String, // Commercial Registration Number
    address: {
      street: String,
      area: String,
      city: String,
      emirate: String,
      country: {
        type: String,
        default: 'UAE'
      },
      poBox: String,
      postalCode: String
    },
    contact: {
      phone: String,
      mobile: String,
      email: String,
      website: String
    }
  },

  // Customer Information
  customer: {
    name: {
      type: String,
      required: true
    },
    arabicName: String,
    vatNumber: String,
    crNumber: String,
    type: {
      type: String,
      enum: ['individual', 'business'],
      default: 'individual'
    },
    address: {
      street: String,
      area: String,
      city: String,
      emirate: String,
      country: String,
      poBox: String,
      postalCode: String
    },
    contact: {
      phone: String,
      mobile: String,
      email: String
    }
  },

  // Invoice Details
  issueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: Date,
  supplyDate: Date, // Date of supply for VAT purposes
  supplyPlace: String, // Place of supply for VAT purposes

  // Currency Information
  currency: {
    type: String,
    required: true,
    default: 'AED',
    enum: ['AED', 'USD', 'EUR', 'SAR', 'QAR']
  },
  exchangeRate: {
    type: Number,
    default: 1
  },

  // Line Items
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    sku: String,
    description: {
      type: String,
      required: true
    },
    arabicDescription: String,
    hsCode: String, // Harmonized System Code for exports
    unitOfMeasure: {
      type: String,
      default: 'PCS'
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      amount: {
        type: Number,
        default: 0
      },
      percentage: {
        type: Number,
        default: 0
      }
    },
    lineTotal: {
      type: Number,
      required: true
    },
    vatRate: {
      type: Number,
      required: true,
      default: 5
    },
    vatAmount: {
      type: Number,
      required: true
    },
    exemptionReason: String, // For zero-rated or exempt items
    countryOfOrigin: String // For export invoices
  }],

  // Totals
  subtotal: {
    type: Number,
    required: true
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  taxableAmount: {
    type: Number,
    required: true
  },
  vatBreakdown: [{
    rate: Number,
    taxableAmount: Number,
    vatAmount: Number
  }],
  totalVat: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },

  // Payment Information
  paymentTerms: String,
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'cheque', 'credit', 'digital_wallet']
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'partial', 'unpaid', 'overdue'],
    default: 'unpaid'
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  outstandingAmount: {
    type: Number,
    default: 0
  },

  // Export Invoice Specific
  exportDetails: {
    portOfLoading: String,
    portOfDischarge: String,
    countryOfDestination: String,
    shippingTerms: String, // FOB, CIF, etc.
    packageDetails: {
      numberOfPackages: Number,
      packageType: String,
      grossWeight: Number,
      netWeight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
          type: String,
          default: 'cm'
        }
      }
    },
    lcNumber: String, // Letter of Credit Number
    exportLicenseNumber: String
  },

  // Document References
  references: {
    purchaseOrderNumber: String,
    deliveryNoteNumber: String,
    quotationNumber: String,
    contractNumber: String,
    originalInvoiceNumber: String // For credit/debit notes
  },

  // Status and Control
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'cancelled', 'overdue'],
    default: 'draft'
  },
  isVoidable: {
    type: Boolean,
    default: true
  },
  voidedAt: Date,
  voidReason: String,

  // Template and Customization
  template: {
    type: String,
    default: 'standard'
  },
  customFields: [{
    fieldName: String,
    fieldValue: String,
    fieldType: {
      type: String,
      enum: ['text', 'number', 'date', 'boolean']
    }
  }],

  // Notes and Terms
  notes: String,
  termsAndConditions: String,
  footer: String,

  // Approval Workflow
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,

  // QR Code for UAE VAT compliance
  qrCodeData: String,

  // Generated Files
  pdfPath: String,
  pdfGenerated: {
    type: Boolean,
    default: false
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date,

  // Audit Trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Invoice Sequence Schema for auto-numbering
const invoiceSequenceSchema = new mongoose.Schema({
  series: {
    type: String,
    required: true,
    unique: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  invoiceType: {
    type: String,
    required: true,
    enum: ['tax_invoice', 'simplified_invoice', 'export_invoice', 'proforma_invoice', 'credit_note', 'debit_note']
  },
  currentNumber: {
    type: Number,
    default: 0
  },
  prefix: String,
  suffix: String,
  resetPeriod: {
    type: String,
    enum: ['never', 'yearly', 'monthly', 'daily'],
    default: 'never'
  },
  lastResetDate: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Invoice Template Schema
const invoiceTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  templateType: {
    type: String,
    required: true,
    enum: ['tax_invoice', 'simplified_invoice', 'export_invoice', 'proforma_invoice', 'credit_note', 'debit_note']
  },
  layout: {
    headerHeight: Number,
    footerHeight: Number,
    marginTop: Number,
    marginBottom: Number,
    marginLeft: Number,
    marginRight: Number,
    fontSize: Number,
    fontFamily: String
  },
  branding: {
    logo: String,
    logoPosition: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'left'
    },
    primaryColor: String,
    secondaryColor: String
  },
  sections: {
    showCustomerInfo: {
      type: Boolean,
      default: true
    },
    showSupplierInfo: {
      type: Boolean,
      default: true
    },
    showItemDetails: {
      type: Boolean,
      default: true
    },
    showTotals: {
      type: Boolean,
      default: true
    },
    showVatBreakdown: {
      type: Boolean,
      default: true
    },
    showQrCode: {
      type: Boolean,
      default: true
    },
    showTerms: {
      type: Boolean,
      default: true
    },
    showNotes: {
      type: Boolean,
      default: true
    }
  },
  fields: [{
    fieldName: String,
    displayName: String,
    isVisible: {
      type: Boolean,
      default: true
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    order: Number
  }],
  languages: {
    primary: {
      type: String,
      default: 'en'
    },
    secondary: String,
    rtlSupport: {
      type: Boolean,
      default: false
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  }
}, {
  timestamps: true
});

// Indexes for better performance
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ storeId: 1, issueDate: -1 });
invoiceSchema.index({ customerId: 1, issueDate: -1 });
invoiceSchema.index({ status: 1, dueDate: 1 });
invoiceSchema.index({ invoiceType: 1, issueDate: -1 });

invoiceSequenceSchema.index({ series: 1, storeId: 1 }, { unique: true });
invoiceTemplateSchema.index({ templateType: 1, isActive: 1 });

// Pre-save middleware to calculate outstanding amount
invoiceSchema.pre('save', function(next) {
  this.outstandingAmount = this.grandTotal - this.paidAmount;
  next();
});

module.exports = {
  Invoice: mongoose.model('Invoice', invoiceSchema),
  InvoiceSequence: mongoose.model('InvoiceSequence', invoiceSequenceSchema),
  InvoiceTemplate: mongoose.model('InvoiceTemplate', invoiceTemplateSchema)
};