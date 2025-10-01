const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

class ReceiptGenerator {
  constructor() {
    this.defaultSettings = {
      paperSize: 'A4',
      thermalWidth: 80, // mm for thermal printers
      fontSize: {
        header: 16,
        title: 14,
        normal: 10,
        small: 8
      },
      colors: {
        primary: '#1a365d',
        secondary: '#4a5568',
        accent: '#3182ce',
        success: '#38a169',
        warning: '#d69e2e',
        error: '#e53e3e'
      },
      margins: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      }
    };
  }

  async generateReceipt(transaction, store, customer = null, options = {}) {
    const receiptType = options.type || 'standard';
    const format = options.format || 'pdf';

    try {
      let receiptData;

      switch (receiptType) {
        case 'thermal':
          receiptData = await this.generateThermalReceipt(transaction, store, customer, options);
          break;
        case 'vat_invoice':
          receiptData = await this.generateVATInvoice(transaction, store, customer, options);
          break;
        case 'simplified':
          receiptData = await this.generateSimplifiedReceipt(transaction, store, customer, options);
          break;
        default:
          receiptData = await this.generateStandardReceipt(transaction, store, customer, options);
      }

      return receiptData;
    } catch (error) {
      console.error('Receipt generation error:', error);
      throw new Error('Failed to generate receipt');
    }
  }

  async generateStandardReceipt(transaction, store, customer, options) {
    const doc = new PDFDocument({
      size: 'A4',
      margin: this.defaultSettings.margins.top
    });

    // Set up the document
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {});

    // Header
    await this.addReceiptHeader(doc, store, 'RECEIPT');

    // Transaction Info
    this.addTransactionInfo(doc, transaction, customer);

    // Items Table
    this.addItemsTable(doc, transaction.items, transaction.currency);

    // Totals Section
    this.addTotalsSection(doc, transaction);

    // Payment Information
    this.addPaymentInfo(doc, transaction);

    // VAT Summary (if applicable)
    if (transaction.totalVat > 0) {
      this.addVATSummary(doc, transaction);
    }

    // QR Code for UAE compliance
    if (store.country === 'UAE' && transaction.totalVat > 0) {
      await this.addUAEQRCode(doc, transaction, store);
    }

    // Footer
    this.addReceiptFooter(doc, store, transaction);

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve({
          buffer: pdfBuffer,
          filename: `receipt_${transaction.transactionId}.pdf`,
          mimeType: 'application/pdf'
        });
      });
    });
  }

  async generateThermalReceipt(transaction, store, customer, options) {
    // Thermal receipt for 80mm printers
    const doc = new PDFDocument({
      size: [226.77, 841.89], // 80mm width, variable height
      margin: 5
    });

    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));

    // Centered store name
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text(store.name, { align: 'center' });

    if (store.arabicName) {
      doc.fontSize(12);
      doc.text(store.arabicName, { align: 'center' });
    }

    doc.moveDown(0.5);

    // Store details
    doc.fontSize(8).font('Helvetica');
    if (store.address) {
      doc.text(`${store.address.street}, ${store.address.city}`, { align: 'center' });
    }
    if (store.phone) {
      doc.text(`Tel: ${store.phone}`, { align: 'center' });
    }
    if (store.vatNumber) {
      doc.text(`VAT: ${store.vatNumber}`, { align: 'center' });
    }

    doc.moveDown(0.5);
    doc.text('--------------------------------', { align: 'center' });
    doc.moveDown(0.5);

    // Transaction details
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('RECEIPT', { align: 'center' });
    doc.moveDown(0.5);

    doc.fontSize(8).font('Helvetica');
    doc.text(`Receipt: ${transaction.receiptNumber || transaction.transactionId}`);
    doc.text(`Date: ${new Date(transaction.createdAt).toLocaleString()}`);
    doc.text(`Cashier: ${transaction.cashier?.name || 'N/A'}`);

    if (customer) {
      doc.text(`Customer: ${customer.name}`);
    }

    doc.moveDown(0.5);
    doc.text('--------------------------------', { align: 'center' });

    // Items
    transaction.items.forEach(item => {
      doc.text(`${item.name}`, { continued: false });
      doc.text(`${item.quantity} x ${transaction.currency} ${item.unitPrice.toFixed(2)}`, {
        align: 'right',
        continued: false
      });

      if (item.discount > 0) {
        doc.text(`  Discount: -${transaction.currency} ${item.discount.toFixed(2)}`, {
          align: 'right'
        });
      }

      doc.text(`  Total: ${transaction.currency} ${item.totalPrice.toFixed(2)}`, {
        align: 'right'
      });
      doc.moveDown(0.2);
    });

    doc.text('--------------------------------', { align: 'center' });

    // Totals
    doc.text(`Subtotal: ${transaction.currency} ${transaction.subtotal.toFixed(2)}`, { align: 'right' });

    if (transaction.totalDiscount > 0) {
      doc.text(`Discount: -${transaction.currency} ${transaction.totalDiscount.toFixed(2)}`, { align: 'right' });
    }

    if (transaction.totalVat > 0) {
      doc.text(`VAT (5%): ${transaction.currency} ${transaction.totalVat.toFixed(2)}`, { align: 'right' });
    }

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text(`TOTAL: ${transaction.currency} ${transaction.grandTotal.toFixed(2)}`, { align: 'right' });

    doc.fontSize(8).font('Helvetica');
    doc.moveDown(0.5);
    doc.text('--------------------------------', { align: 'center' });

    // Payment info
    doc.text(`Payment: ${transaction.paymentMethod.toUpperCase()}`);

    if (transaction.paymentMethod === 'cash' && transaction.paymentDetails?.changeGiven > 0) {
      doc.text(`Change: ${transaction.currency} ${transaction.paymentDetails.changeGiven.toFixed(2)}`);
    }

    doc.moveDown(0.5);
    doc.text('Thank you for your business!', { align: 'center' });
    doc.text('Visit us again soon!', { align: 'center' });

    if (store.website) {
      doc.moveDown(0.5);
      doc.text(store.website, { align: 'center' });
    }

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve({
          buffer: pdfBuffer,
          filename: `thermal_receipt_${transaction.transactionId}.pdf`,
          mimeType: 'application/pdf'
        });
      });
    });
  }

  async generateVATInvoice(transaction, store, customer, options) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));

    // Header
    await this.addInvoiceHeader(doc, store, 'TAX INVOICE');

    // Invoice details
    this.addInvoiceDetails(doc, transaction, customer);

    // Customer and supplier details
    this.addSupplierCustomerDetails(doc, store, customer);

    // Items table with VAT details
    this.addVATItemsTable(doc, transaction.items, transaction.currency);

    // VAT summary
    this.addDetailedVATSummary(doc, transaction);

    // Terms and conditions
    this.addTermsAndConditions(doc, store);

    // UAE QR Code for VAT compliance
    if (store.country === 'UAE') {
      await this.addUAEQRCode(doc, transaction, store);
    }

    // Invoice footer
    this.addInvoiceFooter(doc, store);

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve({
          buffer: pdfBuffer,
          filename: `vat_invoice_${transaction.vatInvoiceNumber || transaction.transactionId}.pdf`,
          mimeType: 'application/pdf'
        });
      });
    });
  }

  async addReceiptHeader(doc, store, title) {
    const logoPath = store.logo || null;

    if (logoPath && fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 50, { width: 100 });
      doc.fontSize(20).font('Helvetica-Bold');
      doc.text(title, 160, 50);
    } else {
      doc.fontSize(24).font('Helvetica-Bold');
      doc.text(store.name, 50, 50);
      doc.fontSize(16);
      doc.text(title, 50, 80);
    }

    // Store address
    doc.fontSize(10).font('Helvetica');
    const startY = logoPath ? 120 : 110;

    if (store.address) {
      doc.text(`${store.address.street}`, 50, startY);
      doc.text(`${store.address.city}, ${store.address.emirate || store.address.state}`, 50, startY + 12);
      doc.text(`${store.address.country} - ${store.address.postalCode || ''}`, 50, startY + 24);
    }

    if (store.phone) {
      doc.text(`Phone: ${store.phone}`, 50, startY + 40);
    }

    if (store.email) {
      doc.text(`Email: ${store.email}`, 50, startY + 52);
    }

    if (store.vatNumber) {
      doc.text(`VAT Number: ${store.vatNumber}`, 50, startY + 64);
    }

    return startY + 80;
  }

  addTransactionInfo(doc, transaction, customer) {
    const startY = 200;

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Transaction Details', 400, startY);

    doc.fontSize(10).font('Helvetica');
    doc.text(`Receipt No: ${transaction.receiptNumber || transaction.transactionId}`, 400, startY + 20);
    doc.text(`Date: ${new Date(transaction.createdAt).toLocaleDateString()}`, 400, startY + 32);
    doc.text(`Time: ${new Date(transaction.createdAt).toLocaleTimeString()}`, 400, startY + 44);
    doc.text(`Cashier: ${transaction.cashier?.name || 'N/A'}`, 400, startY + 56);

    if (customer) {
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('Customer Details', 50, startY);

      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${customer.name}`, 50, startY + 20);
      if (customer.phone) {
        doc.text(`Phone: ${customer.phone}`, 50, startY + 32);
      }
      if (customer.email) {
        doc.text(`Email: ${customer.email}`, 50, startY + 44);
      }
    }
  }

  addItemsTable(doc, items, currency) {
    const startY = 300;
    const tableTop = startY;
    const tableLeft = 50;

    // Table headers
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Item', tableLeft, tableTop);
    doc.text('Qty', tableLeft + 200, tableTop);
    doc.text('Price', tableLeft + 250, tableTop);
    doc.text('Discount', tableLeft + 300, tableTop);
    doc.text('Total', tableLeft + 380, tableTop, { align: 'right' });

    // Line under headers
    doc.moveTo(tableLeft, tableTop + 15)
       .lineTo(tableLeft + 400, tableTop + 15)
       .stroke();

    // Table rows
    doc.font('Helvetica');
    let currentY = tableTop + 25;

    items.forEach((item, index) => {
      doc.text(item.name, tableLeft, currentY, { width: 180 });
      doc.text(item.quantity.toString(), tableLeft + 200, currentY);
      doc.text(`${currency} ${item.unitPrice.toFixed(2)}`, tableLeft + 250, currentY);
      doc.text(`${currency} ${(item.discount || 0).toFixed(2)}`, tableLeft + 300, currentY);
      doc.text(`${currency} ${item.totalPrice.toFixed(2)}`, tableLeft + 380, currentY, { align: 'right' });

      currentY += 20;
    });

    return currentY + 10;
  }

  addTotalsSection(doc, transaction) {
    const startY = doc.y + 20;
    const rightAlign = 450;

    doc.fontSize(10).font('Helvetica');

    doc.text(`Subtotal:`, rightAlign - 100, startY);
    doc.text(`${transaction.currency} ${transaction.subtotal.toFixed(2)}`, rightAlign, startY, { align: 'right' });

    if (transaction.totalDiscount > 0) {
      doc.text(`Total Discount:`, rightAlign - 100, startY + 15);
      doc.text(`-${transaction.currency} ${transaction.totalDiscount.toFixed(2)}`, rightAlign, startY + 15, { align: 'right' });
    }

    if (transaction.totalVat > 0) {
      doc.text(`VAT (5%):`, rightAlign - 100, startY + 30);
      doc.text(`${transaction.currency} ${transaction.totalVat.toFixed(2)}`, rightAlign, startY + 30, { align: 'right' });
    }

    // Line above total
    doc.moveTo(rightAlign - 100, startY + 45)
       .lineTo(rightAlign + 50, startY + 45)
       .stroke();

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`TOTAL:`, rightAlign - 100, startY + 55);
    doc.text(`${transaction.currency} ${transaction.grandTotal.toFixed(2)}`, rightAlign, startY + 55, { align: 'right' });
  }

  addPaymentInfo(doc, transaction) {
    const startY = doc.y + 30;

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Payment Information', 50, startY);

    doc.fontSize(10).font('Helvetica');
    doc.text(`Method: ${transaction.paymentMethod.toUpperCase()}`, 50, startY + 20);

    if (transaction.paymentDetails) {
      if (transaction.paymentDetails.cardType) {
        doc.text(`Card Type: ${transaction.paymentDetails.cardType.toUpperCase()}`, 50, startY + 35);
        doc.text(`Card Number: ****${transaction.paymentDetails.lastFourDigits}`, 50, startY + 50);
      }

      if (transaction.paymentDetails.changeGiven > 0) {
        doc.text(`Change Given: ${transaction.currency} ${transaction.paymentDetails.changeGiven.toFixed(2)}`, 50, startY + 35);
      }
    }
  }

  addVATSummary(doc, transaction) {
    const startY = doc.y + 30;

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('VAT Summary', 50, startY);

    doc.fontSize(10).font('Helvetica');
    doc.text('VAT Rate', 50, startY + 25);
    doc.text('Taxable Amount', 150, startY + 25);
    doc.text('VAT Amount', 300, startY + 25);

    doc.moveTo(50, startY + 40)
       .lineTo(400, startY + 40)
       .stroke();

    // Calculate VAT breakdown
    const vatBreakdown = this.calculateVATBreakdown(transaction.items, transaction.currency);
    let currentY = startY + 50;

    vatBreakdown.forEach(vat => {
      doc.text(`${vat.rate}%`, 50, currentY);
      doc.text(`${transaction.currency} ${vat.taxableAmount.toFixed(2)}`, 150, currentY);
      doc.text(`${transaction.currency} ${vat.vatAmount.toFixed(2)}`, 300, currentY);
      currentY += 15;
    });

    doc.moveTo(50, currentY + 5)
       .lineTo(400, currentY + 5)
       .stroke();

    doc.font('Helvetica-Bold');
    doc.text('Total VAT:', 150, currentY + 15);
    doc.text(`${transaction.currency} ${transaction.totalVat.toFixed(2)}`, 300, currentY + 15);
  }

  async addUAEQRCode(doc, transaction, store) {
    try {
      // UAE VAT QR Code format
      const qrData = this.generateUAEQRData(transaction, store);
      const qrCodeDataURL = await QRCode.toDataURL(qrData);

      // Convert data URL to buffer
      const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
      const qrBuffer = Buffer.from(base64Data, 'base64');

      const startY = doc.y + 30;
      doc.image(qrBuffer, 50, startY, { width: 100 });

      doc.fontSize(8).font('Helvetica');
      doc.text('Scan for VAT verification', 50, startY + 110);
    } catch (error) {
      console.error('QR Code generation error:', error);
    }
  }

  generateUAEQRData(transaction, store) {
    // UAE ZATCA QR Code format
    const sellerName = store.name;
    const vatNumber = store.vatNumber || '';
    const timestamp = new Date(transaction.createdAt).toISOString();
    const totalAmount = transaction.grandTotal.toFixed(2);
    const vatAmount = transaction.totalVat.toFixed(2);

    // Create TLV (Tag-Length-Value) format
    const data = [
      { tag: '01', value: sellerName },
      { tag: '02', value: vatNumber },
      { tag: '03', value: timestamp },
      { tag: '04', value: totalAmount },
      { tag: '05', value: vatAmount }
    ];

    let qrString = '';
    data.forEach(item => {
      const valueLength = item.value.length.toString().padStart(2, '0');
      qrString += item.tag + valueLength + item.value;
    });

    return qrString;
  }

  addReceiptFooter(doc, store, transaction) {
    const startY = doc.page.height - 100;

    doc.fontSize(8).font('Helvetica');
    doc.text('Thank you for your business!', 50, startY, { align: 'center' });

    if (store.returnPolicy) {
      doc.text('Return Policy: Items can be returned within 30 days with receipt', 50, startY + 15, { align: 'center' });
    }

    if (store.website) {
      doc.text(`Visit us online: ${store.website}`, 50, startY + 30, { align: 'center' });
    }

    doc.text(`Receipt generated on ${new Date().toLocaleString()}`, 50, startY + 45, { align: 'center' });
  }

  calculateVATBreakdown(items, currency) {
    const vatRates = {};

    items.forEach(item => {
      const rate = item.vatRate || 0;
      if (!vatRates[rate]) {
        vatRates[rate] = {
          rate: rate,
          taxableAmount: 0,
          vatAmount: 0
        };
      }

      const itemTotal = item.totalPrice || (item.quantity * item.unitPrice - (item.discount || 0));
      vatRates[rate].taxableAmount += itemTotal;
      vatRates[rate].vatAmount += (itemTotal * rate) / 100;
    });

    return Object.values(vatRates).filter(vat => vat.taxableAmount > 0);
  }

  async generateReceiptEmail(transaction, store, customer, options = {}) {
    const receiptPDF = await this.generateReceipt(transaction, store, customer, options);

    return {
      to: customer?.email,
      subject: `Receipt for your purchase - ${store.name}`,
      html: this.generateEmailTemplate(transaction, store, customer),
      attachments: [{
        filename: receiptPDF.filename,
        content: receiptPDF.buffer,
        contentType: receiptPDF.mimeType
      }]
    };
  }

  generateEmailTemplate(transaction, store, customer) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }
          .total { font-size: 18px; font-weight: bold; color: #007bff; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${store.name}</h1>
          <h2>Purchase Receipt</h2>
        </div>
        <div class="content">
          <p>Dear ${customer?.name || 'Valued Customer'},</p>
          <p>Thank you for your purchase! Please find your receipt attached.</p>

          <h3>Transaction Summary:</h3>
          <ul>
            <li><strong>Receipt Number:</strong> ${transaction.receiptNumber || transaction.transactionId}</li>
            <li><strong>Date:</strong> ${new Date(transaction.createdAt).toLocaleDateString()}</li>
            <li><strong>Total Amount:</strong> <span class="total">${transaction.currency} ${transaction.grandTotal.toFixed(2)}</span></li>
            <li><strong>Payment Method:</strong> ${transaction.paymentMethod.toUpperCase()}</li>
          </ul>

          <p>If you have any questions about your purchase, please don't hesitate to contact us.</p>

          <p>We appreciate your business and look forward to serving you again!</p>
        </div>
        <div class="footer">
          <p>${store.name}</p>
          ${store.phone ? `<p>Phone: ${store.phone}</p>` : ''}
          ${store.email ? `<p>Email: ${store.email}</p>` : ''}
          ${store.website ? `<p>Website: ${store.website}</p>` : ''}
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = ReceiptGenerator;