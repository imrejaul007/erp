'use client';

import React from 'react';
import QRCode from 'qrcode';

export interface ReceiptData {
  receiptNo: string;
  date: string;
  time: string;
  cashier: string;
  customer?: {
    name: string;
    phone?: string;
    loyaltyPoints?: number;
  };
  items: Array<{
    name: string;
    nameArabic?: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
  }>;
  subtotal: number;
  discount?: number;
  vat: number;
  total: number;
  paymentMethod: string;
  amountPaid?: number;
  change?: number;
  loyaltyPointsEarned?: number;
}

export async function generateReceiptHTML(data: ReceiptData): Promise<string> {
  const qrCodeDataUrl = await QRCode.toDataURL(
    JSON.stringify({
      receipt: data.receiptNo,
      total: data.total,
      date: data.date,
    }),
    { width: 150 }
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt - ${data.receiptNo}</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 2mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Courier New', monospace;
      width: 76mm;
      padding: 2mm;
      font-size: 10pt;
      line-height: 1.4;
    }
    .rtl {
      direction: rtl;
      text-align: right;
    }
    .header {
      text-align: center;
      margin-bottom: 10px;
      border-bottom: 2px dashed #000;
      padding-bottom: 10px;
    }
    .company-name {
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 3px;
    }
    .company-name-ar {
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .company-info {
      font-size: 8pt;
      margin: 2px 0;
    }
    .section {
      margin: 8px 0;
      padding: 5px 0;
    }
    .section-border {
      border-top: 1px dashed #000;
      border-bottom: 1px dashed #000;
      padding: 5px 0;
      margin: 8px 0;
    }
    .row {
      display: flex;
      justify-between;
      margin: 3px 0;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 5px 0;
    }
    .items-table td {
      padding: 3px 0;
      border-bottom: 1px dotted #ccc;
    }
    .item-name {
      font-weight: bold;
    }
    .item-name-ar {
      font-size: 9pt;
      color: #666;
    }
    .item-qty {
      text-align: center;
    }
    .item-price {
      text-align: right;
    }
    .totals {
      margin-top: 10px;
      font-size: 11pt;
    }
    .total-line {
      display: flex;
      justify-between;
      margin: 4px 0;
      padding: 2px 0;
    }
    .grand-total {
      font-size: 14pt;
      font-weight: bold;
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      padding: 5px 0;
      margin-top: 5px;
    }
    .payment-info {
      margin-top: 8px;
      font-size: 10pt;
    }
    .footer {
      text-align: center;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 2px dashed #000;
      font-size: 9pt;
    }
    .qr-code {
      text-align: center;
      margin: 10px 0;
    }
    .qr-code img {
      width: 120px;
      height: 120px;
    }
    .loyalty-box {
      background: #f5f5f5;
      border: 1px solid #000;
      padding: 5px;
      margin: 8px 0;
      text-align: center;
    }
    .bold {
      font-weight: bold;
    }
    .center {
      text-align: center;
    }
    @media print {
      body {
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="company-name">OUD PALACE UAE</div>
    <div class="company-name-ar rtl">قصر العود الإماراتي</div>
    <div class="company-info">Premium Perfumes & Oud</div>
    <div class="company-info">Dubai Mall, Ground Floor</div>
    <div class="company-info">Tel: +971-4-123-4567</div>
    <div class="company-info">TRN: 100123456789</div>
  </div>

  <!-- Receipt Info -->
  <div class="section">
    <div class="row">
      <span>Receipt No:</span>
      <span class="bold">${data.receiptNo}</span>
    </div>
    <div class="row">
      <span>Date:</span>
      <span>${data.date}</span>
    </div>
    <div class="row">
      <span>Time:</span>
      <span>${data.time}</span>
    </div>
    <div class="row">
      <span>Cashier:</span>
      <span>${data.cashier}</span>
    </div>
    ${data.customer ? `
    <div class="row">
      <span>Customer:</span>
      <span>${data.customer.name}</span>
    </div>
    ${data.customer.phone ? `
    <div class="row">
      <span>Phone:</span>
      <span>${data.customer.phone}</span>
    </div>
    ` : ''}
    ` : ''}
  </div>

  <!-- Items -->
  <div class="section-border">
    <table class="items-table">
      <thead>
        <tr>
          <td class="bold">Item</td>
          <td class="bold item-qty">Qty</td>
          <td class="bold item-price">Amount</td>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
        <tr>
          <td>
            <div class="item-name">${item.name}</div>
            ${item.nameArabic ? `<div class="item-name-ar rtl">${item.nameArabic}</div>` : ''}
            <div style="font-size: 9pt; color: #666;">
              ${item.quantity} ${item.unit} × AED ${item.price.toFixed(2)}
            </div>
          </td>
          <td class="item-qty">${item.quantity}</td>
          <td class="item-price bold">AED ${item.total.toFixed(2)}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- Totals -->
  <div class="totals">
    <div class="total-line">
      <span>Subtotal:</span>
      <span>AED ${data.subtotal.toFixed(2)}</span>
    </div>
    ${data.discount && data.discount > 0 ? `
    <div class="total-line" style="color: #d00;">
      <span>Discount:</span>
      <span>-AED ${data.discount.toFixed(2)}</span>
    </div>
    ` : ''}
    <div class="total-line">
      <span>VAT (5%):</span>
      <span>AED ${data.vat.toFixed(2)}</span>
    </div>
    <div class="total-line grand-total">
      <span>TOTAL:</span>
      <span>AED ${data.total.toFixed(2)}</span>
    </div>
  </div>

  <!-- Payment Info -->
  <div class="payment-info section-border">
    <div class="row">
      <span>Payment Method:</span>
      <span class="bold">${data.paymentMethod.toUpperCase()}</span>
    </div>
    ${data.amountPaid ? `
    <div class="row">
      <span>Amount Paid:</span>
      <span>AED ${data.amountPaid.toFixed(2)}</span>
    </div>
    ` : ''}
    ${data.change && data.change > 0 ? `
    <div class="row">
      <span>Change:</span>
      <span class="bold">AED ${data.change.toFixed(2)}</span>
    </div>
    ` : ''}
  </div>

  <!-- Loyalty Points -->
  ${data.customer && data.loyaltyPointsEarned ? `
  <div class="loyalty-box">
    <div class="bold">🎁 Loyalty Points Earned: ${data.loyaltyPointsEarned}</div>
    ${data.customer.loyaltyPoints ? `
    <div>Total Points: ${data.customer.loyaltyPoints + data.loyaltyPointsEarned}</div>
    ` : ''}
  </div>
  ` : ''}

  <!-- QR Code -->
  <div class="qr-code">
    <img src="${qrCodeDataUrl}" alt="Receipt QR Code" />
    <div style="font-size: 8pt; margin-top: 5px;">Scan for digital receipt</div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="bold">THANK YOU FOR YOUR PURCHASE</div>
    <div class="bold rtl">شكراً لتسوقكم معنا</div>
    <div style="margin-top: 8px;">
      <div>Exchange within 7 days with receipt</div>
      <div class="rtl">إمكانية الاستبدال خلال ٧ أيام بالفاتورة</div>
    </div>
    <div style="margin-top: 8px; font-size: 8pt;">
      <div>www.oudpalace.ae</div>
      <div>Email: info@oudpalace.ae</div>
    </div>
    <div style="margin-top: 8px; font-size: 8pt;">
      <div>This is a TAX INVOICE</div>
      <div class="rtl">هذه فاتورة ضريبية</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() {
        window.close();
      }
    }
  </script>
</body>
</html>
  `;
}

export function printReceipt(data: ReceiptData) {
  generateReceiptHTML(data).then(html => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  });
}
