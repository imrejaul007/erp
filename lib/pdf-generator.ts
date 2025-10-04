/**
 * Invoice PDF Generator
 *
 * This library generates professional invoice PDFs using HTML templates
 * In production, you would use libraries like:
 * - puppeteer (for HTML to PDF conversion)
 * - pdfkit (for programmatic PDF generation)
 * - react-pdf (for React-based PDF generation)
 *
 * For now, this provides the template and structure
 */

export interface InvoicePDFData {
  // Invoice Info
  invoiceNumber: string;
  invoiceType: string;
  status: string;
  issueDate: Date;
  dueDate: Date;
  currency: string;

  // Company/Tenant Info
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyLogo?: string;
  taxId?: string;

  // Customer Info
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;

  // Line Items
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxRate?: number;
  }>;

  // Totals
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  balanceDue: number;
  paidAmount?: number;

  // Additional Info
  notes?: string;
  terms?: string;
  paymentTerms?: string;
  qrCodeData?: string;

  // Branding
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

/**
 * Generate invoice HTML template
 */
export function generateInvoiceHTML(data: InvoicePDFData): string {
  const primaryColor = data.primaryColor || '#FF6B35';
  const secondaryColor = data.secondaryColor || '#004E89';
  const accentColor = data.accentColor || '#0066cc';

  const formatCurrency = (amount: number) => {
    return `${data.currency} ${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const lineItemsHTML = data.lineItems
    .map(
      (item, index) => `
    <tr style="${index % 2 === 0 ? 'background-color: #f9fafb;' : ''}">
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${item.description}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatCurrency(item.unitPrice)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        ${formatCurrency(item.amount)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #ffffff;
      padding: 40px 20px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    .invoice-header {
      background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
      color: white;
      padding: 40px;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .company-info h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .company-details {
      font-size: 14px;
      opacity: 0.95;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-number {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .invoice-type {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .invoice-body {
      padding: 40px;
    }
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .info-block h3 {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
    .info-block p {
      font-size: 14px;
      color: #374151;
      margin-bottom: 4px;
    }
    .info-block .customer-name {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }
    .dates-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 40px;
    }
    .date-item {
      padding: 16px;
      background: #f9fafb;
      border-radius: 6px;
    }
    .date-label {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .date-value {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }
    .line-items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .line-items-table thead {
      background: #f3f4f6;
    }
    .line-items-table th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      border-bottom: 2px solid #e5e7eb;
    }
    .line-items-table th:nth-child(2),
    .line-items-table th:nth-child(3),
    .line-items-table th:nth-child(4) {
      text-align: right;
    }
    .line-items-table th:nth-child(2) {
      text-align: center;
    }
    .totals-section {
      margin-left: auto;
      width: 350px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 14px;
    }
    .total-row.subtotal {
      border-top: 2px solid #e5e7eb;
      padding-top: 16px;
    }
    .total-row.grand-total {
      border-top: 2px solid ${primaryColor};
      margin-top: 8px;
      padding-top: 16px;
      font-size: 18px;
      font-weight: 700;
      color: ${primaryColor};
    }
    .total-label {
      font-weight: 500;
      color: #6b7280;
    }
    .total-value {
      font-weight: 600;
      color: #111827;
    }
    .grand-total .total-label,
    .grand-total .total-value {
      color: ${primaryColor};
    }
    .notes-section {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid #e5e7eb;
    }
    .notes-section h3 {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 12px;
    }
    .notes-section p {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.8;
      white-space: pre-wrap;
    }
    .invoice-footer {
      background: #f9fafb;
      padding: 30px 40px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
    }
    .footer-text {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .qr-code-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .status-paid {
      background: #d1fae5;
      color: #065f46;
    }
    .status-overdue {
      background: #fee2e2;
      color: #991b1b;
    }
    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
    @media print {
      body {
        padding: 0;
      }
      .invoice-container {
        border: none;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="invoice-header">
      <div class="header-content">
        <div class="company-info">
          <h1>${data.companyName}</h1>
          <div class="company-details">
            ${data.companyAddress ? `<p>${data.companyAddress}</p>` : ''}
            ${data.companyPhone ? `<p>Tel: ${data.companyPhone}</p>` : ''}
            ${data.companyEmail ? `<p>Email: ${data.companyEmail}</p>` : ''}
            ${data.taxId ? `<p>Tax ID: ${data.taxId}</p>` : ''}
          </div>
        </div>
        <div class="invoice-meta">
          <div class="invoice-number">${data.invoiceNumber}</div>
          <div class="invoice-type">${data.invoiceType}</div>
          ${
            data.status === 'PAID'
              ? '<div class="status-badge status-paid">Paid</div>'
              : data.status === 'OVERDUE'
              ? '<div class="status-badge status-overdue">Overdue</div>'
              : '<div class="status-badge status-pending">Pending</div>'
          }
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="invoice-body">
      <!-- Customer and Invoice Info -->
      <div class="info-section">
        <div class="info-block">
          <h3>Bill To</h3>
          <p class="customer-name">${data.customerName}</p>
          ${data.customerEmail ? `<p>${data.customerEmail}</p>` : ''}
          ${data.customerPhone ? `<p>${data.customerPhone}</p>` : ''}
          ${data.customerAddress ? `<p>${data.customerAddress}</p>` : ''}
        </div>
        <div class="info-block">
          <h3>Payment Terms</h3>
          <p>${data.paymentTerms || 'Net 30'}</p>
        </div>
      </div>

      <!-- Dates -->
      <div class="dates-grid">
        <div class="date-item">
          <div class="date-label">Issue Date</div>
          <div class="date-value">${formatDate(data.issueDate)}</div>
        </div>
        <div class="date-item">
          <div class="date-label">Due Date</div>
          <div class="date-value">${formatDate(data.dueDate)}</div>
        </div>
      </div>

      <!-- Line Items -->
      <table class="line-items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${lineItemsHTML}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals-section">
        <div class="total-row subtotal">
          <span class="total-label">Subtotal</span>
          <span class="total-value">${formatCurrency(data.subtotal)}</span>
        </div>
        ${
          data.discount > 0
            ? `
        <div class="total-row">
          <span class="total-label">Discount</span>
          <span class="total-value">-${formatCurrency(data.discount)}</span>
        </div>
        `
            : ''
        }
        <div class="total-row">
          <span class="total-label">Tax</span>
          <span class="total-value">${formatCurrency(data.taxAmount)}</span>
        </div>
        <div class="total-row grand-total">
          <span class="total-label">Total Amount</span>
          <span class="total-value">${formatCurrency(data.totalAmount)}</span>
        </div>
        ${
          data.paidAmount && data.paidAmount > 0
            ? `
        <div class="total-row">
          <span class="total-label">Amount Paid</span>
          <span class="total-value">-${formatCurrency(data.paidAmount)}</span>
        </div>
        <div class="total-row" style="margin-top: 8px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <span class="total-label">Balance Due</span>
          <span class="total-value">${formatCurrency(data.balanceDue)}</span>
        </div>
        `
            : ''
        }
      </div>

      <!-- Notes -->
      ${
        data.notes || data.terms
          ? `
      <div class="notes-section">
        ${
          data.notes
            ? `
        <div style="margin-bottom: 20px;">
          <h3>Notes</h3>
          <p>${data.notes}</p>
        </div>
        `
            : ''
        }
        ${
          data.terms
            ? `
        <div>
          <h3>Terms & Conditions</h3>
          <p>${data.terms}</p>
        </div>
        `
            : ''
        }
      </div>
      `
          : ''
      }
    </div>

    <!-- Footer -->
    <div class="invoice-footer">
      <p class="footer-text">Thank you for your business!</p>
      ${data.companyWebsite ? `<p class="footer-text">${data.companyWebsite}</p>` : ''}

      ${
        data.qrCodeData
          ? `
      <div class="qr-code-section">
        <p class="footer-text">Scan to verify invoice authenticity</p>
        <!-- QR Code would be rendered here -->
        <p style="font-size: 10px; color: #9ca3af; margin-top: 8px;">QR Code: ${data.qrCodeData.substring(0, 50)}...</p>
      </div>
      `
          : ''
      }
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate PDF from HTML (placeholder)
 * In production, use puppeteer or similar library
 */
export async function generateInvoicePDF(
  data: InvoicePDFData
): Promise<Buffer> {
  const html = generateInvoiceHTML(data);

  // Placeholder: In production, you would use:
  // - Puppeteer: await page.pdf({ html, format: 'A4' })
  // - react-pdf: renderToBuffer(<InvoiceDocument />)
  // - PDFKit: Build PDF programmatically

  // For now, return HTML as buffer
  return Buffer.from(html, 'utf-8');
}

/**
 * Get invoice filename
 */
export function getInvoiceFilename(invoiceNumber: string): string {
  const sanitized = invoiceNumber.replace(/[^a-zA-Z0-9-]/g, '_');
  return `Invoice_${sanitized}.pdf`;
}
