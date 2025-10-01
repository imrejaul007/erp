class VATCalculatorService {
  constructor() {
    this.defaultVATRate = 5; // UAE standard VAT rate
    this.vatRates = {
      'UAE': {
        standard: 5,
        zero: 0,
        exempt: 0
      },
      'KSA': {
        standard: 15,
        zero: 0,
        exempt: 0
      },
      'Qatar': {
        standard: 0,
        zero: 0,
        exempt: 0
      },
      'Kuwait': {
        standard: 0,
        zero: 0,
        exempt: 0
      },
      'Bahrain': {
        standard: 10,
        zero: 0,
        exempt: 0
      },
      'Oman': {
        standard: 5,
        zero: 0,
        exempt: 0
      }
    };

    // VAT exempt categories in UAE
    this.exemptCategories = [
      'education',
      'healthcare',
      'financial_services',
      'residential_rent',
      'bare_land',
      'local_transport'
    ];

    // Zero-rated categories in UAE
    this.zeroRatedCategories = [
      'exports',
      'international_transport',
      'precious_metals',
      'medical_equipment',
      'baby_products'
    ];
  }

  calculateVAT(amount, vatRate = null, isVATInclusive = false) {
    const rate = vatRate !== null ? vatRate : this.defaultVATRate;

    if (rate === 0) {
      return {
        netAmount: amount,
        vatAmount: 0,
        grossAmount: amount,
        vatRate: 0,
        isVATInclusive
      };
    }

    let netAmount, vatAmount, grossAmount;

    if (isVATInclusive) {
      // Amount includes VAT - extract VAT amount
      grossAmount = amount;
      netAmount = amount / (1 + rate / 100);
      vatAmount = amount - netAmount;
    } else {
      // Amount is net - add VAT
      netAmount = amount;
      vatAmount = amount * (rate / 100);
      grossAmount = amount + vatAmount;
    }

    return {
      netAmount: this.roundAmount(netAmount),
      vatAmount: this.roundAmount(vatAmount),
      grossAmount: this.roundAmount(grossAmount),
      vatRate: rate,
      isVATInclusive
    };
  }

  calculateLineItemVAT(lineItem) {
    const { quantity, unitPrice, discount = 0, vatRate = this.defaultVATRate, isVATInclusive = false } = lineItem;

    // Calculate line total before VAT
    const lineTotal = (quantity * unitPrice) - discount;

    // Calculate VAT for the line
    const vatCalculation = this.calculateVAT(lineTotal, vatRate, isVATInclusive);

    return {
      ...lineItem,
      lineTotal: vatCalculation.netAmount,
      vatAmount: vatCalculation.vatAmount,
      grossTotal: vatCalculation.grossAmount,
      vatCalculation
    };
  }

  calculateTransactionVAT(items, discounts = [], currency = 'AED') {
    let totalNet = 0;
    let totalVAT = 0;
    let totalGross = 0;
    const vatBreakdown = new Map();
    const processedItems = [];

    // Process each line item
    items.forEach(item => {
      const processedItem = this.calculateLineItemVAT(item);
      processedItems.push(processedItem);

      totalNet += processedItem.lineTotal;
      totalVAT += processedItem.vatAmount;
      totalGross += processedItem.grossTotal;

      // Group by VAT rate for breakdown
      const vatRate = processedItem.vatRate || 0;
      if (!vatBreakdown.has(vatRate)) {
        vatBreakdown.set(vatRate, {
          rate: vatRate,
          netAmount: 0,
          vatAmount: 0,
          grossAmount: 0
        });
      }

      const breakdown = vatBreakdown.get(vatRate);
      breakdown.netAmount += processedItem.lineTotal;
      breakdown.vatAmount += processedItem.vatAmount;
      breakdown.grossAmount += processedItem.grossTotal;
    });

    // Apply transaction-level discounts
    const discountAmount = this.calculateDiscounts(discounts, totalNet);
    totalNet -= discountAmount;
    totalGross = totalNet + totalVAT;

    // Recalculate VAT if discounts affect VAT calculation
    if (discountAmount > 0) {
      const vatAdjustment = this.calculateVATAdjustmentForDiscounts(discounts, vatBreakdown, discountAmount);
      totalVAT += vatAdjustment;
      totalGross = totalNet + totalVAT;
    }

    return {
      items: processedItems,
      subtotal: this.roundAmount(totalNet),
      totalDiscount: this.roundAmount(discountAmount),
      totalVAT: this.roundAmount(totalVAT),
      grandTotal: this.roundAmount(totalGross),
      vatBreakdown: Array.from(vatBreakdown.values()).map(vat => ({
        ...vat,
        netAmount: this.roundAmount(vat.netAmount),
        vatAmount: this.roundAmount(vat.vatAmount),
        grossAmount: this.roundAmount(vat.grossAmount)
      })),
      currency
    };
  }

  calculateDiscounts(discounts, subtotal) {
    let totalDiscount = 0;

    discounts.forEach(discount => {
      switch (discount.type) {
        case 'percentage':
          totalDiscount += (subtotal * discount.value) / 100;
          break;
        case 'fixed':
          totalDiscount += discount.value;
          break;
        case 'tiered':
          totalDiscount += this.calculateTieredDiscount(discount, subtotal);
          break;
      }
    });

    return Math.min(totalDiscount, subtotal); // Discount cannot exceed subtotal
  }

  calculateTieredDiscount(tieredDiscount, amount) {
    const tiers = tieredDiscount.tiers || [];

    for (const tier of tiers.sort((a, b) => b.minAmount - a.minAmount)) {
      if (amount >= tier.minAmount) {
        if (tier.type === 'percentage') {
          return (amount * tier.value) / 100;
        } else {
          return tier.value;
        }
      }
    }

    return 0;
  }

  calculateVATAdjustmentForDiscounts(discounts, vatBreakdown, totalDiscount) {
    // For UAE VAT compliance, discounts typically reduce the VAT base
    let vatAdjustment = 0;

    vatBreakdown.forEach((breakdown, rate) => {
      if (rate > 0) {
        const proportionalDiscount = (breakdown.netAmount / vatBreakdown.get(rate).netAmount) * totalDiscount;
        const vatReduction = proportionalDiscount * (rate / 100);
        vatAdjustment -= vatReduction;
      }
    });

    return vatAdjustment;
  }

  getVATRate(product, customerType = 'individual', country = 'UAE') {
    // Determine VAT rate based on product category and customer type
    if (this.exemptCategories.includes(product.category?.slug)) {
      return 0; // Exempt
    }

    if (this.zeroRatedCategories.includes(product.category?.slug)) {
      return 0; // Zero-rated
    }

    if (customerType === 'export' || product.isExport) {
      return 0; // Exports are zero-rated
    }

    // Return standard rate for the country
    const countryRates = this.vatRates[country] || this.vatRates['UAE'];
    return countryRates.standard;
  }

  validateVATNumber(vatNumber, country = 'UAE') {
    const patterns = {
      'UAE': /^100\d{12}3$/, // UAE VAT number format
      'KSA': /^3\d{14}$/, // Saudi Arabia VAT number format
      'Bahrain': /^BH\d{8}$/, // Bahrain VAT number format
      'Oman': /^OM\d{9}$/ // Oman VAT number format
    };

    const pattern = patterns[country];
    return pattern ? pattern.test(vatNumber) : false;
  }

  generateVATReport(transactions, startDate, endDate) {
    const report = {
      period: {
        startDate,
        endDate
      },
      summary: {
        totalSales: 0,
        totalVAT: 0,
        totalNet: 0,
        transactionCount: 0
      },
      vatBreakdown: new Map(),
      exemptSales: 0,
      zeroRatedSales: 0,
      standardRatedSales: 0
    };

    transactions.forEach(transaction => {
      report.summary.totalSales += transaction.grandTotal;
      report.summary.totalVAT += transaction.totalVat;
      report.summary.totalNet += transaction.subtotal;
      report.summary.transactionCount++;

      // Process VAT breakdown
      if (transaction.vatBreakdown) {
        transaction.vatBreakdown.forEach(vat => {
          if (!report.vatBreakdown.has(vat.rate)) {
            report.vatBreakdown.set(vat.rate, {
              rate: vat.rate,
              netAmount: 0,
              vatAmount: 0,
              grossAmount: 0,
              transactionCount: 0
            });
          }

          const breakdown = report.vatBreakdown.get(vat.rate);
          breakdown.netAmount += vat.netAmount;
          breakdown.vatAmount += vat.vatAmount;
          breakdown.grossAmount += vat.grossAmount;
          breakdown.transactionCount++;

          // Categorize by VAT rate
          if (vat.rate === 0) {
            report.exemptSales += vat.netAmount;
          } else if (vat.rate === this.defaultVATRate) {
            report.standardRatedSales += vat.netAmount;
          }
        });
      }
    });

    // Convert Map to Array and round amounts
    report.vatBreakdown = Array.from(report.vatBreakdown.values()).map(vat => ({
      ...vat,
      netAmount: this.roundAmount(vat.netAmount),
      vatAmount: this.roundAmount(vat.vatAmount),
      grossAmount: this.roundAmount(vat.grossAmount)
    }));

    // Round summary amounts
    Object.keys(report.summary).forEach(key => {
      if (typeof report.summary[key] === 'number' && key !== 'transactionCount') {
        report.summary[key] = this.roundAmount(report.summary[key]);
      }
    });

    report.exemptSales = this.roundAmount(report.exemptSales);
    report.zeroRatedSales = this.roundAmount(report.zeroRatedSales);
    report.standardRatedSales = this.roundAmount(report.standardRatedSales);

    return report;
  }

  generateVATReturn(transactions, period) {
    const report = this.generateVATReport(transactions, period.startDate, period.endDate);

    // UAE VAT Return format
    return {
      returnPeriod: period,
      standardRatedSupplies: {
        totalValue: report.standardRatedSales,
        vatAmount: report.vatBreakdown.find(v => v.rate === this.defaultVATRate)?.vatAmount || 0
      },
      zeroRatedSupplies: {
        totalValue: report.zeroRatedSales,
        vatAmount: 0
      },
      exemptSupplies: {
        totalValue: report.exemptSales,
        vatAmount: 0
      },
      totalOutputTax: report.summary.totalVAT,
      totalInputTax: 0, // Would need to calculate from purchases
      netVATDue: report.summary.totalVAT, // Output tax minus input tax
      adjustments: 0,
      totalVATDue: report.summary.totalVAT,
      declaration: {
        generatedAt: new Date(),
        generatedBy: 'ERP System'
      }
    };
  }

  roundAmount(amount, decimals = 2) {
    return Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  // Calculate VAT for reverse charge scenarios (B2B international)
  calculateReverseChargeVAT(amount, supplierCountry, customerCountry) {
    if (supplierCountry !== customerCountry && customerCountry === 'UAE') {
      // Customer in UAE needs to account for VAT on imported services
      return this.calculateVAT(amount, this.defaultVATRate, false);
    }

    return {
      netAmount: amount,
      vatAmount: 0,
      grossAmount: amount,
      vatRate: 0,
      isReverseCharge: false
    };
  }

  // Generate QR code data for UAE VAT compliance
  generateVATQRData(invoice, supplier) {
    const qrData = {
      sellerName: supplier.name,
      vatNumber: supplier.vatNumber,
      timestamp: invoice.issueDate.toISOString(),
      totalAmount: invoice.grandTotal.toFixed(2),
      vatAmount: invoice.totalVat.toFixed(2)
    };

    // Convert to TLV format for UAE ZATCA compliance
    let tlvString = '';
    Object.entries(qrData).forEach(([key, value], index) => {
      const tag = (index + 1).toString().padStart(2, '0');
      const length = value.length.toString().padStart(2, '0');
      tlvString += tag + length + value;
    });

    return tlvString;
  }

  // Validate VAT calculation for compliance
  validateVATCalculation(calculation) {
    const tolerance = 0.01; // 1 cent tolerance for rounding
    const errors = [];

    // Check if net + VAT = gross (within tolerance)
    const calculatedGross = calculation.netAmount + calculation.vatAmount;
    if (Math.abs(calculatedGross - calculation.grossAmount) > tolerance) {
      errors.push('Net amount plus VAT amount does not equal gross amount');
    }

    // Check VAT calculation
    const expectedVAT = calculation.netAmount * (calculation.vatRate / 100);
    if (Math.abs(expectedVAT - calculation.vatAmount) > tolerance) {
      errors.push('VAT amount calculation is incorrect');
    }

    // Check for negative amounts
    if (calculation.netAmount < 0 || calculation.vatAmount < 0 || calculation.grossAmount < 0) {
      errors.push('Negative amounts are not allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = VATCalculatorService;