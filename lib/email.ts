/**
 * Email notification system
 * Supports transactional emails for orders, invoices, alerts, etc.
 */

import nodemailer from 'nodemailer';
import { logger } from './logger';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
  }>;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private from: string;

  constructor() {
    this.from = process.env.EMAIL_FROM || 'noreply@oud-erp.com';
    this.initialize();
  }

  /**
   * Initialize email transporter
   */
  private initialize() {
    try {
      // Configure based on environment variables
      if (process.env.SMTP_HOST) {
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      } else if (process.env.NODE_ENV === 'development') {
        // Use ethereal for development
        this.createTestAccount();
      }
    } catch (error) {
      logger.error('Failed to initialize email service', error);
    }
  }

  /**
   * Create test account for development
   */
  private async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info('Using Ethereal test account for emails');
    } catch (error) {
      logger.error('Failed to create test account', error);
    }
  }

  /**
   * Send email
   */
  async send(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      logger.warn('Email transporter not configured');
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: options.from || this.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc.join(', ')
            : options.cc
          : undefined,
        bcc: options.bcc
          ? Array.isArray(options.bcc)
            ? options.bcc.join(', ')
            : options.bcc
          : undefined,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });

      // Log preview URL for development
      if (process.env.NODE_ENV === 'development') {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          logger.info(`Preview URL: ${previewUrl}`);
        }
      }

      return true;
    } catch (error) {
      logger.error('Failed to send email', error, {
        to: options.to,
        subject: options.subject,
      });
      return false;
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(data: {
    to: string;
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
  }): Promise<boolean> {
    const itemsHtml = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">AED ${item.price.toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #f59e0b, #ea580c); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            table { width: 100%; border-collapse: collapse; background: white; margin: 20px 0; }
            th { background: #f3f4f6; padding: 12px; text-align: left; }
            .total { font-size: 18px; font-weight: bold; text-align: right; padding: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmation</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>Thank you for your order! We're pleased to confirm that we've received your order #${data.orderNumber}.</p>

              <h3>Order Details:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div class="total">
                Total: AED ${data.total.toFixed(2)}
              </div>

              <p>We'll notify you when your order is ready.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Oud & Perfume ERP. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.send({
      to: data.to,
      subject: `Order Confirmation #${data.orderNumber}`,
      html,
    });
  }

  /**
   * Send low stock alert
   */
  async sendLowStockAlert(data: {
    to: string | string[];
    products: Array<{ name: string; sku: string; currentStock: number; minStock: number }>;
  }): Promise<boolean> {
    const productsHtml = data.products
      .map(
        (product) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${product.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${product.sku}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; color: #dc2626; font-weight: bold;">${product.currentStock}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${product.minStock}</td>
      </tr>
    `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            table { width: 100%; border-collapse: collapse; background: white; margin: 20px 0; }
            th { background: #fee2e2; padding: 12px; text-align: left; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Low Stock Alert</h1>
            </div>
            <div class="content">
              <p>The following products are running low on stock and need to be reordered:</p>

              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Current Stock</th>
                    <th>Minimum Stock</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsHtml}
                </tbody>
              </table>

              <p>Please review and take necessary action to restock these items.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Oud & Perfume ERP. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.send({
      to: data.to,
      subject: '⚠️ Low Stock Alert - Action Required',
      html,
    });
  }

  /**
   * Send invoice email
   */
  async sendInvoice(data: {
    to: string;
    invoiceNumber: string;
    customerName: string;
    amount: number;
    dueDate: string;
    pdfPath?: string;
  }): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #f59e0b, #ea580c); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .amount { font-size: 24px; font-weight: bold; color: #ea580c; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invoice</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>Please find attached invoice #${data.invoiceNumber}.</p>

              <div class="amount">
                Amount Due: AED ${data.amount.toFixed(2)}
              </div>

              <p><strong>Due Date:</strong> ${data.dueDate}</p>

              <p>Please make payment by the due date to avoid any late fees.</p>
              <p>Thank you for your business!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Oud & Perfume ERP. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const attachments = data.pdfPath
      ? [{ filename: `invoice-${data.invoiceNumber}.pdf`, path: data.pdfPath }]
      : undefined;

    return this.send({
      to: data.to,
      subject: `Invoice #${data.invoiceNumber}`,
      html,
      attachments,
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();
