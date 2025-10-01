// CRM Integration Services for External Providers
// Supports WhatsApp Business, SMS Gateways, and Email Services

import { CommunicationType } from '@/types/crm';

// Configuration interfaces
interface WhatsAppBusinessConfig {
  phoneNumberId: string;
  accessToken: string;
  webhookVerifyToken: string;
  businessAccountId: string;
}

interface SMSGatewayConfig {
  provider: 'TWILIO' | 'AWS_SNS' | 'VONAGE' | 'UNIFONIC';
  apiKey: string;
  apiSecret?: string;
  senderId: string;
  accountSid?: string; // For Twilio
}

interface EmailServiceConfig {
  provider: 'SENDGRID' | 'MAILGUN' | 'AWS_SES' | 'MAILCHIMP';
  apiKey: string;
  fromEmail: string;
  fromName: string;
  domain?: string; // For Mailgun
  region?: string; // For AWS SES
}

// Communication result interface
interface CommunicationResult {
  success: boolean;
  messageId?: string;
  status: 'SENT' | 'FAILED';
  error?: string;
  deliveryStatus?: 'DELIVERED' | 'READ' | 'FAILED';
  cost?: number; // in fils (1 AED = 100 fils)
}

// WhatsApp Business API Integration
export class WhatsAppBusinessService {
  private config: WhatsAppBusinessConfig;

  constructor(config: WhatsAppBusinessConfig) {
    this.config = config;
  }

  async sendMessage(
    to: string,
    message: string,
    messageArabic?: string,
    templateName?: string
  ): Promise<CommunicationResult> {
    try {
      const phoneNumber = this.formatPhoneNumber(to);
      const url = `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`;

      let body: any;

      if (templateName) {
        // Use WhatsApp template
        body = {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: messageArabic ? 'ar' : 'en'
            }
          }
        };
      } else {
        // Send text message
        body = {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: {
            body: messageArabic || message
          }
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok && result.messages?.[0]) {
        return {
          success: true,
          messageId: result.messages[0].id,
          status: 'SENT',
          cost: 0.25, // Approximate cost per message in AED
        };
      } else {
        return {
          success: false,
          status: 'FAILED',
          error: result.error?.message || 'Failed to send WhatsApp message',
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendTemplate(
    to: string,
    templateName: string,
    parameters: string[],
    language: 'en' | 'ar' = 'en'
  ): Promise<CommunicationResult> {
    try {
      const phoneNumber = this.formatPhoneNumber(to);
      const url = `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`;

      const body = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: { code: language },
          components: [{
            type: 'body',
            parameters: parameters.map(param => ({ type: 'text', text: param }))
          }]
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok && result.messages?.[0]) {
        return {
          success: true,
          messageId: result.messages[0].id,
          status: 'SENT',
          cost: 0.25,
        };
      } else {
        return {
          success: false,
          status: 'FAILED',
          error: result.error?.message || 'Failed to send template',
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // Add +971 if not present
    if (digits.startsWith('971')) {
      return digits;
    } else if (digits.startsWith('0') && digits.length === 10) {
      return '971' + digits.slice(1);
    } else if (digits.length === 9) {
      return '971' + digits;
    }

    return digits;
  }
}

// SMS Gateway Services
export class SMSService {
  private config: SMSGatewayConfig;

  constructor(config: SMSGatewayConfig) {
    this.config = config;
  }

  async sendSMS(
    to: string,
    message: string,
    messageArabic?: string
  ): Promise<CommunicationResult> {
    switch (this.config.provider) {
      case 'TWILIO':
        return this.sendViaTwilio(to, messageArabic || message);
      case 'UNIFONIC':
        return this.sendViaUNIFONIC(to, messageArabic || message);
      case 'AWS_SNS':
        return this.sendViaAWSSNS(to, messageArabic || message);
      default:
        return {
          success: false,
          status: 'FAILED',
          error: 'Unsupported SMS provider',
        };
    }
  }

  private async sendViaTwilio(to: string, message: string): Promise<CommunicationResult> {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`;

      const params = new URLSearchParams({
        To: this.formatPhoneNumber(to),
        From: this.config.senderId,
        Body: message,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${this.config.accountSid}:${this.config.apiSecret}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: result.sid,
          status: 'SENT',
          cost: 0.15, // Approximate cost per SMS in AED
        };
      } else {
        return {
          success: false,
          status: 'FAILED',
          error: result.message || 'Failed to send SMS via Twilio',
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async sendViaUNIFONIC(to: string, message: string): Promise<CommunicationResult> {
    try {
      const url = 'https://el.cloud.unifonic.com/rest/SMS/messages';

      const body = {
        AppSid: this.config.apiKey,
        Recipient: this.formatPhoneNumber(to),
        Body: message,
        SenderID: this.config.senderId,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success === 'true' || result.success === true) {
        return {
          success: true,
          messageId: result.data?.MessageID,
          status: 'SENT',
          cost: 0.12, // UNIFONIC is typically cheaper in UAE
        };
      } else {
        return {
          success: false,
          status: 'FAILED',
          error: result.message || 'Failed to send SMS via UNIFONIC',
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async sendViaAWSSNS(to: string, message: string): Promise<CommunicationResult> {
    // AWS SNS implementation would require AWS SDK
    // This is a placeholder for the implementation
    return {
      success: false,
      status: 'FAILED',
      error: 'AWS SNS integration not implemented',
    };
  }

  private formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.startsWith('971')) {
      return '+' + digits;
    } else if (digits.startsWith('0') && digits.length === 10) {
      return '+971' + digits.slice(1);
    } else if (digits.length === 9) {
      return '+971' + digits;
    }

    return '+' + digits;
  }
}

// Email Service Integration
export class EmailService {
  private config: EmailServiceConfig;

  constructor(config: EmailServiceConfig) {
    this.config = config;
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
    attachments?: Array<{
      filename: string;
      content: string;
      type: string;
    }>
  ): Promise<CommunicationResult> {
    switch (this.config.provider) {
      case 'SENDGRID':
        return this.sendViaSendGrid(to, subject, htmlContent, textContent, attachments);
      case 'MAILGUN':
        return this.sendViaMailgun(to, subject, htmlContent, textContent);
      default:
        return {
          success: false,
          status: 'FAILED',
          error: 'Unsupported email provider',
        };
    }
  }

  private async sendViaSendGrid(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
    attachments?: Array<{
      filename: string;
      content: string;
      type: string;
    }>
  ): Promise<CommunicationResult> {
    try {
      const url = 'https://api.sendgrid.com/v3/mail/send';

      const body = {
        personalizations: [{
          to: [{ email: to }],
          subject: subject,
        }],
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName,
        },
        content: [
          {
            type: 'text/html',
            value: htmlContent,
          },
          ...(textContent ? [{
            type: 'text/plain',
            value: textContent,
          }] : []),
        ],
        ...(attachments ? {
          attachments: attachments.map(att => ({
            content: att.content,
            filename: att.filename,
            type: att.type,
          }))
        } : {}),
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.status === 202) {
        const messageId = response.headers.get('X-Message-Id');
        return {
          success: true,
          messageId: messageId || undefined,
          status: 'SENT',
          cost: 0.05, // Approximate cost per email in AED
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          status: 'FAILED',
          error: errorText || 'Failed to send email via SendGrid',
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async sendViaMailgun(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<CommunicationResult> {
    try {
      const url = `https://api.mailgun.net/v3/${this.config.domain}/messages`;

      const formData = new FormData();
      formData.append('from', `${this.config.fromName} <${this.config.fromEmail}>`);
      formData.append('to', to);
      formData.append('subject', subject);
      formData.append('html', htmlContent);
      if (textContent) {
        formData.append('text', textContent);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`api:${this.config.apiKey}`),
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: result.id,
          status: 'SENT',
          cost: 0.04, // Mailgun is typically cheaper
        };
      } else {
        return {
          success: false,
          status: 'FAILED',
          error: result.message || 'Failed to send email via Mailgun',
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Unified Communication Manager
export class CommunicationManager {
  private whatsapp?: WhatsAppBusinessService;
  private sms?: SMSService;
  private email?: EmailService;

  constructor(
    whatsappConfig?: WhatsAppBusinessConfig,
    smsConfig?: SMSGatewayConfig,
    emailConfig?: EmailServiceConfig
  ) {
    if (whatsappConfig) {
      this.whatsapp = new WhatsAppBusinessService(whatsappConfig);
    }
    if (smsConfig) {
      this.sms = new SMSService(smsConfig);
    }
    if (emailConfig) {
      this.email = new EmailService(emailConfig);
    }
  }

  async sendCommunication(
    type: CommunicationType,
    to: string,
    content: string,
    options: {
      subject?: string;
      contentArabic?: string;
      templateName?: string;
      templateParams?: string[];
      language?: 'en' | 'ar';
      attachments?: Array<{
        filename: string;
        content: string;
        type: string;
      }>;
    } = {}
  ): Promise<CommunicationResult> {
    try {
      switch (type) {
        case 'WHATSAPP':
          if (!this.whatsapp) {
            throw new Error('WhatsApp service not configured');
          }
          if (options.templateName) {
            return await this.whatsapp.sendTemplate(
              to,
              options.templateName,
              options.templateParams || [],
              options.language
            );
          } else {
            return await this.whatsapp.sendMessage(
              to,
              content,
              options.contentArabic,
              options.templateName
            );
          }

        case 'SMS':
          if (!this.sms) {
            throw new Error('SMS service not configured');
          }
          return await this.sms.sendSMS(to, content, options.contentArabic);

        case 'EMAIL':
          if (!this.email) {
            throw new Error('Email service not configured');
          }
          return await this.email.sendEmail(
            to,
            options.subject || 'Message from Perfume & Oud Store',
            content,
            options.contentArabic,
            options.attachments
          );

        default:
          return {
            success: false,
            status: 'FAILED',
            error: 'Unsupported communication type',
          };
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Bulk communication methods
  async sendBulkCommunication(
    type: CommunicationType,
    recipients: Array<{
      to: string;
      content: string;
      contentArabic?: string;
      subject?: string;
      templateParams?: string[];
    }>,
    options: {
      templateName?: string;
      language?: 'en' | 'ar';
      batchSize?: number;
      delayMs?: number; // Delay between batches
    } = {}
  ): Promise<{
    successful: number;
    failed: number;
    results: CommunicationResult[];
    totalCost: number;
  }> {
    const batchSize = options.batchSize || 10;
    const delayMs = options.delayMs || 1000;

    let successful = 0;
    let failed = 0;
    let totalCost = 0;
    const results: CommunicationResult[] = [];

    // Process in batches to avoid rate limiting
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      const batchPromises = batch.map(recipient =>
        this.sendCommunication(type, recipient.to, recipient.content, {
          subject: recipient.subject,
          contentArabic: recipient.contentArabic,
          templateName: options.templateName,
          templateParams: recipient.templateParams,
          language: options.language,
        })
      );

      const batchResults = await Promise.all(batchPromises);

      batchResults.forEach(result => {
        if (result.success) {
          successful++;
          totalCost += result.cost || 0;
        } else {
          failed++;
        }
        results.push(result);
      });

      // Delay between batches (except for last batch)
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return {
      successful,
      failed,
      results,
      totalCost,
    };
  }

  // Check service availability
  getAvailableServices(): CommunicationType[] {
    const available: CommunicationType[] = [];

    if (this.whatsapp) available.push('WHATSAPP');
    if (this.sms) available.push('SMS');
    if (this.email) available.push('EMAIL');

    return available;
  }
}

// Pre-built message templates for common scenarios
export const MESSAGE_TEMPLATES = {
  WELCOME: {
    en: {
      subject: 'Welcome to Perfume & Oud Store',
      content: 'Dear {name}, welcome to our exclusive perfume collection. Your loyalty points: {loyaltyPoints}',
      whatsapp: 'Welcome {name}! 🌟 Discover our exquisite perfumes and earn loyalty points with every purchase.',
    },
    ar: {
      subject: 'أهلاً بك في متجر العطور والعود',
      content: 'عزيزي {name}، أهلاً بك في مجموعة العطور الحصرية لدينا. نقاط الولاء الخاصة بك: {loyaltyPoints}',
      whatsapp: 'أهلاً {name}! 🌟 اكتشف عطورنا الفاخرة واكسب نقاط الولاء مع كل عملية شراء.',
    },
  },
  BIRTHDAY: {
    en: {
      subject: 'Happy Birthday from Perfume & Oud Store',
      content: 'Happy Birthday {name}! Enjoy a special 20% discount on your favorite fragrances.',
      whatsapp: '🎉 Happy Birthday {name}! Treat yourself to 20% off our premium collection.',
    },
    ar: {
      subject: 'عيد ميلاد سعيد من متجر العطور والعود',
      content: 'عيد ميلاد سعيد {name}! استمتع بخصم خاص 20% على عطورك المفضلة.',
      whatsapp: '🎉 عيد ميلاد سعيد {name}! دلل نفسك بخصم 20% على مجموعتنا الفاخرة.',
    },
  },
  ORDER_CONFIRMATION: {
    en: {
      subject: 'Order Confirmed - {orderNumber}',
      content: 'Thank you {name}! Your order {orderNumber} for {totalAmount} has been confirmed.',
      whatsapp: '✅ Order confirmed! {orderNumber} - {totalAmount}. We\'ll notify you about shipping.',
    },
    ar: {
      subject: 'تأكيد الطلب - {orderNumber}',
      content: 'شكراً لك {name}! تم تأكيد طلبك {orderNumber} بقيمة {totalAmount}.',
      whatsapp: '✅ تم تأكيد الطلب! {orderNumber} - {totalAmount}. سنخبرك عن حالة الشحن.',
    },
  },
  LOYALTY_UPGRADE: {
    en: {
      subject: 'Congratulations! Tier Upgraded to {tier}',
      content: 'Congratulations {name}! You\'ve been upgraded to {tier} tier with {bonusPoints} bonus points.',
      whatsapp: '🏆 Congratulations {name}! Welcome to {tier} tier. Enjoy exclusive benefits!',
    },
    ar: {
      subject: 'تهانينا! ترقية المستوى إلى {tier}',
      content: 'تهانينا {name}! تم ترقيتك إلى مستوى {tier} مع {bonusPoints} نقطة إضافية.',
      whatsapp: '🏆 تهانينا {name}! أهلاً بك في مستوى {tier}. استمتع بالمزايا الحصرية!',
    },
  },
};