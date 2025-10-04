/**
 * Email Service
 *
 * This library handles email sending for invoices, reminders, and notifications
 * In production, integrate with email providers like:
 * - SendGrid
 * - AWS SES
 * - Mailgun
 * - Resend
 * - Postmark
 *
 * For now, this provides the structure and templates
 */

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  from?: string;
  replyTo?: string;
}

export interface InvoiceEmailData {
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  dueDate: Date;
  currency: string;
  invoiceUrl: string;
  pdfUrl?: string;
  companyName: string;
  companyEmail?: string;
  paymentInstructions?: string;
}

/**
 * Send email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // In production, use email service provider
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send(options);

    // Example with AWS SES:
    // const ses = new AWS.SES();
    // await ses.sendEmail({ ... }).promise();

    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send(options);

    // For development, log the email
    console.log('📧 Email sent (development mode):');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Attachments:', options.attachments?.length || 0);

    // Simulate successful send
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Generate invoice email HTML template
 */
export function generateInvoiceEmailHTML(data: InvoiceEmailData): string {
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

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #FF6B35 0%, #004E89 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
      color: #374151;
    }
    .invoice-details {
      background: #f9fafb;
      border-radius: 8px;
      padding: 24px;
      margin: 30px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 500;
      color: #6b7280;
    }
    .detail-value {
      font-weight: 600;
      color: #111827;
    }
    .total-row {
      background: #fff;
      margin-top: 16px;
      padding: 16px;
      border-radius: 6px;
      border: 2px solid #FF6B35;
    }
    .total-row .detail-label,
    .total-row .detail-value {
      font-size: 18px;
      font-weight: 700;
      color: #FF6B35;
    }
    .cta-button {
      display: inline-block;
      background: #FF6B35;
      color: white !important;
      padding: 14px 32px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .cta-button:hover {
      background: #e55a2b;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .payment-instructions {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .payment-instructions h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1e40af;
    }
    .payment-instructions p {
      margin: 0;
      font-size: 13px;
      color: #1e40af;
      line-height: 1.6;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 8px 0;
      font-size: 13px;
      color: #6b7280;
    }
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${data.companyName}</h1>
      <p>Invoice ${data.invoiceNumber}</p>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Dear ${data.customerName},</p>

      <p style="margin-bottom: 20px;">
        Thank you for your business! Please find your invoice details below.
      </p>

      <!-- Invoice Details -->
      <div class="invoice-details">
        <div class="detail-row">
          <span class="detail-label">Invoice Number</span>
          <span class="detail-value">${data.invoiceNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Due Date</span>
          <span class="detail-value">${formatDate(data.dueDate)}</span>
        </div>
        <div class="total-row">
          <div class="detail-row">
            <span class="detail-label">Total Amount</span>
            <span class="detail-value">${formatCurrency(data.totalAmount)}</span>
          </div>
        </div>
      </div>

      <!-- Payment Instructions -->
      ${
        data.paymentInstructions
          ? `
      <div class="payment-instructions">
        <h3>Payment Instructions</h3>
        <p>${data.paymentInstructions}</p>
      </div>
      `
          : ''
      }

      <!-- CTA Buttons -->
      <div class="button-container">
        <a href="${data.invoiceUrl}" class="cta-button">View Invoice</a>
      </div>

      ${
        data.pdfUrl
          ? `
      <div class="button-container">
        <a href="${data.pdfUrl}" class="cta-button" style="background: #004E89;">Download PDF</a>
      </div>
      `
          : ''
      }

      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        If you have any questions about this invoice, please contact us.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>This is an automated email from ${data.companyName}</p>
      ${data.companyEmail ? `<p>Contact us: <a href="mailto:${data.companyEmail}">${data.companyEmail}</a></p>` : ''}
      <p style="margin-top: 20px; font-size: 12px;">
        Please do not reply to this email. This mailbox is not monitored.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate payment reminder email HTML template
 */
export function generatePaymentReminderEmailHTML(data: InvoiceEmailData): string {
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

  const daysUntilDue = Math.ceil(
    (new Date(data.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isOverdue = daysUntilDue < 0;
  const urgencyMessage = isOverdue
    ? `This invoice is ${Math.abs(daysUntilDue)} days overdue.`
    : `This invoice is due in ${daysUntilDue} days.`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Reminder - Invoice ${data.invoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: ${isOverdue ? '#dc2626' : '#f59e0b'};
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
    }
    .urgency-banner {
      background: ${isOverdue ? '#fee2e2' : '#fef3c7'};
      border-left: 4px solid ${isOverdue ? '#dc2626' : '#f59e0b'};
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .urgency-banner p {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: ${isOverdue ? '#991b1b' : '#92400e'};
    }
    .invoice-details {
      background: #f9fafb;
      border-radius: 8px;
      padding: 24px;
      margin: 30px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 500;
      color: #6b7280;
    }
    .detail-value {
      font-weight: 600;
      color: #111827;
    }
    .cta-button {
      display: inline-block;
      background: ${isOverdue ? '#dc2626' : '#f59e0b'};
      color: white !important;
      padding: 14px 32px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 8px 0;
      font-size: 13px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Reminder</h1>
      <p>Invoice ${data.invoiceNumber}</p>
    </div>

    <div class="content">
      <p class="greeting">Dear ${data.customerName},</p>

      <div class="urgency-banner">
        <p>${urgencyMessage}</p>
      </div>

      <p>
        This is a ${isOverdue ? 'final' : 'friendly'} reminder that payment for the following invoice is ${isOverdue ? 'overdue' : 'due soon'}.
      </p>

      <div class="invoice-details">
        <div class="detail-row">
          <span class="detail-label">Invoice Number</span>
          <span class="detail-value">${data.invoiceNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Due Date</span>
          <span class="detail-value">${formatDate(data.dueDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount Due</span>
          <span class="detail-value">${formatCurrency(data.totalAmount)}</span>
        </div>
      </div>

      <div class="button-container">
        <a href="${data.invoiceUrl}" class="cta-button">Pay Now</a>
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        If you have already made this payment, please disregard this reminder.
        If you have any questions, please contact us immediately.
      </p>
    </div>

    <div class="footer">
      <p>${data.companyName}</p>
      ${data.companyEmail ? `<p><a href="mailto:${data.companyEmail}">${data.companyEmail}</a></p>` : ''}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send invoice email to customer
 */
export async function sendInvoiceEmail(data: InvoiceEmailData): Promise<boolean> {
  const html = generateInvoiceEmailHTML(data);
  const text = `
Dear ${data.customerName},

Thank you for your business! Please find your invoice details below.

Invoice Number: ${data.invoiceNumber}
Due Date: ${new Date(data.dueDate).toLocaleDateString()}
Total Amount: ${data.currency} ${data.totalAmount.toFixed(2)}

View your invoice: ${data.invoiceUrl}

If you have any questions about this invoice, please contact us.

Best regards,
${data.companyName}
  `.trim();

  return sendEmail({
    to: data.customerName, // Should be customer email
    subject: `Invoice ${data.invoiceNumber} from ${data.companyName}`,
    html,
    text,
    from: data.companyEmail,
  });
}

/**
 * Send payment reminder email
 */
export async function sendPaymentReminderEmail(data: InvoiceEmailData): Promise<boolean> {
  const html = generatePaymentReminderEmailHTML(data);

  const daysUntilDue = Math.ceil(
    (new Date(data.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isOverdue = daysUntilDue < 0;

  return sendEmail({
    to: data.customerName, // Should be customer email
    subject: isOverdue
      ? `URGENT: Overdue Invoice ${data.invoiceNumber} - ${data.companyName}`
      : `Reminder: Invoice ${data.invoiceNumber} Due Soon - ${data.companyName}`,
    html,
    from: data.companyEmail,
  });
}
