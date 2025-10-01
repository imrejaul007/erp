// SMS Gateway Integration Service
// Supports UAE SMS providers: Twilio, AWS SNS, Vonage, and UNIFONIC (UAE-based)

import { SMSGatewayConfig } from '@/types/crm';

export interface SMSMessage {
  to: string;
  message: string;
  messageArabic?: string;
  from?: string;
  language?: 'en' | 'ar';
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  cost?: number;
  segments?: number;
  error?: string;
}

export interface SMSStatus {
  messageId: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered';
  error?: string;
  deliveredAt?: string;
}

export abstract class SMSProvider {
  protected config: SMSGatewayConfig;

  constructor(config: SMSGatewayConfig) {
    this.config = config;
  }

  abstract sendSMS(message: SMSMessage): Promise<SMSResponse>;
  abstract getStatus(messageId: string): Promise<SMSStatus>;
  abstract validatePhoneNumber(phoneNumber: string): boolean;
}

// Twilio SMS Provider
export class TwilioSMSProvider extends SMSProvider {
  private baseUrl = 'https://api.twilio.com/2010-04-01';

  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    try {
      const auth = Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64');

      const formData = new URLSearchParams({
        To: this.formatPhoneNumber(message.to),
        From: message.from || this.config.senderId,
        Body: message.language === 'ar' && message.messageArabic ? message.messageArabic : message.message,
      });

      const response = await fetch(
        `${this.baseUrl}/Accounts/${this.config.apiKey}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: data.sid,
          cost: parseFloat(data.price || '0'),
          segments: data.num_segments || 1,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to send SMS',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getStatus(messageId: string): Promise<SMSStatus> {
    try {
      const auth = Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64');

      const response = await fetch(
        `${this.baseUrl}/Accounts/${this.config.apiKey}/Messages/${messageId}.json`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
          },
        }
      );

      const data = await response.json();

      return {
        messageId,
        status: this.mapTwilioStatus(data.status),
        error: data.error_message,
        deliveredAt: data.date_sent,
      };
    } catch (error) {
      return {
        messageId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private mapTwilioStatus(status: string): SMSStatus['status'] {
    switch (status) {
      case 'queued':
      case 'accepted':
        return 'queued';
      case 'sent':
        return 'sent';
      case 'delivered':
        return 'delivered';
      case 'failed':
      case 'undelivered':
        return 'failed';
      default:
        return 'queued';
    }
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  private formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  }
}

// AWS SNS SMS Provider
export class AWSSNSProvider extends SMSProvider {
  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    try {
      // This would typically use AWS SDK
      // For now, we'll simulate the API call
      const awsResponse = await this.callAWSAPI('PublishSMS', {
        PhoneNumber: this.formatPhoneNumber(message.to),
        Message: message.language === 'ar' && message.messageArabic ? message.messageArabic : message.message,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: this.config.senderId,
          },
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional',
          },
        },
      });

      return {
        success: true,
        messageId: awsResponse.MessageId,
        segments: 1,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send SMS via AWS SNS',
      };
    }
  }

  async getStatus(messageId: string): Promise<SMSStatus> {
    // AWS SNS doesn't provide direct status checking for SMS
    // Status would typically come via delivery receipts or CloudWatch
    return {
      messageId,
      status: 'sent', // Default status
    };
  }

  private async callAWSAPI(action: string, params: any): Promise<any> {
    // Simulated AWS API call
    // In production, use AWS SDK
    return {
      MessageId: `aws-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  private formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  }
}

// UNIFONIC SMS Provider (UAE-based)
export class UnifonicSMSProvider extends SMSProvider {
  private baseUrl = 'https://el.cloud.unifonic.com/rest';

  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    try {
      const requestBody = {
        AppSid: this.config.apiKey,
        SenderID: this.config.senderId,
        Body: message.language === 'ar' && message.messageArabic ? message.messageArabic : message.message,
        Recipients: this.formatPhoneNumber(message.to),
        encoding: message.language === 'ar' ? 'UCS2' : 'GSM7', // Arabic requires UCS2 encoding
      };

      const response = await fetch(`${this.baseUrl}/Messages/Send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success && data.data) {
        return {
          success: true,
          messageId: data.data.MessageID,
          cost: parseFloat(data.data.Cost || '0'),
          segments: data.data.NumberOfUnits || 1,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to send SMS via UNIFONIC',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getStatus(messageId: string): Promise<SMSStatus> {
    try {
      const response = await fetch(
        `${this.baseUrl}/Messages/GetMessageIDStatus?AppSid=${this.config.apiKey}&MessageID=${messageId}`
      );

      const data = await response.json();

      if (data.success && data.data) {
        return {
          messageId,
          status: this.mapUnifonicStatus(data.data.Status),
          deliveredAt: data.data.DateCreated,
        };
      } else {
        return {
          messageId,
          status: 'failed',
          error: data.message,
        };
      }
    } catch (error) {
      return {
        messageId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private mapUnifonicStatus(status: string): SMSStatus['status'] {
    switch (status.toLowerCase()) {
      case 'queued':
        return 'queued';
      case 'sent':
        return 'sent';
      case 'delivered':
        return 'delivered';
      case 'failed':
      case 'rejected':
        return 'failed';
      default:
        return 'queued';
    }
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, '');
    // UAE numbers are 9 digits after country code
    return (cleaned.startsWith('971') && cleaned.length === 12) ||
           (cleaned.length === 9 && /^[5][0-9]{8}$/.test(cleaned));
  }

  private formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.startsWith('971')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return `971${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      return `971${cleaned}`;
    }

    return cleaned;
  }
}

// Main SMS Gateway Service
export class SMSGatewayService {
  private provider: SMSProvider;

  constructor(config: SMSGatewayConfig) {
    switch (config.provider) {
      case 'TWILIO':
        this.provider = new TwilioSMSProvider(config);
        break;
      case 'AWS_SNS':
        this.provider = new AWSSNSProvider(config);
        break;
      case 'VONAGE':
        // You could add Vonage provider here
        throw new Error('Vonage provider not implemented yet');
      case 'UNIFONIC':
        this.provider = new UnifonicSMSProvider(config);
        break;
      default:
        throw new Error(`Unsupported SMS provider: ${config.provider}`);
    }
  }

  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    // Validate phone number
    if (!this.provider.validatePhoneNumber(message.to)) {
      return {
        success: false,
        error: 'Invalid phone number format',
      };
    }

    return this.provider.sendSMS(message);
  }

  async getStatus(messageId: string): Promise<SMSStatus> {
    return this.provider.getStatus(messageId);
  }

  // UAE-specific message templates
  static getUAETemplates() {
    return {
      welcome: {
        en: (customerName: string) =>
          `Welcome to Perfume & Oud, ${customerName}! Discover our premium fragrance collection. Visit us or call +971-XX-XXXX-XXX`,
        ar: (customerName: string) =>
          `مرحباً بك في عطور وعود، ${customerName}! اكتشف مجموعة العطور الفاخرة لدينا. قم بزيارتنا أو اتصل على +971-XX-XXXX-XXX`,
      },
      orderConfirmation: {
        en: (orderNo: string, amount: number) =>
          `Order confirmed! #${orderNo} - ${amount} AED. We'll notify you when ready. Perfume & Oud`,
        ar: (orderNo: string, amount: number) =>
          `تم تأكيد الطلب! #${orderNo} - ${amount} درهم. سنخبرك عندما يكون جاهزاً. عطور وعود`,
      },
      deliveryUpdate: {
        en: (orderNo: string, status: string) =>
          `Order #${orderNo} update: ${status}. Track your delivery or call us for assistance.`,
        ar: (orderNo: string, status: string) =>
          `تحديث الطلب #${orderNo}: ${status}. تتبع التوصيل أو اتصل بنا للمساعدة.`,
      },
      promotion: {
        en: (discount: number, validUntil: string) =>
          `🌟 Special Offer: ${discount}% OFF on premium fragrances! Valid until ${validUntil}. Terms apply.`,
        ar: (discount: number, validUntil: string) =>
          `🌟 عرض خاص: خصم ${discount}% على العطور الفاخرة! ساري حتى ${validUntil}. تطبق الشروط.`,
      },
      birthday: {
        en: (customerName: string) =>
          `🎉 Happy Birthday, ${customerName}! Enjoy a special gift on your next visit. Perfume & Oud`,
        ar: (customerName: string) =>
          `🎉 عيد ميلاد سعيد، ${customerName}! استمتع بهدية خاصة في زيارتك القادمة. عطور وعود`,
      },
      appointment: {
        en: (date: string, time: string) =>
          `Appointment confirmed for ${date} at ${time}. Our fragrance expert will be ready to assist you.`,
        ar: (date: string, time: string) =>
          `تم تأكيد الموعد لـ ${date} في ${time}. خبير العطور سيكون مستعداً لمساعدتك.`,
      },
      ramadan: {
        en: (customerName: string) =>
          `🌙 Ramadan Mubarak, ${customerName}! Special Ramadan collection now available with exclusive discounts.`,
        ar: (customerName: string) =>
          `🌙 رمضان مبارك، ${customerName}! مجموعة رمضان الخاصة متوفرة الآن مع خصومات حصرية.`,
      },
      eid: {
        en: (customerName: string) =>
          `🎊 Eid Mubarak, ${customerName}! Celebrate with our exclusive Eid fragrance collection. Limited time offers!`,
        ar: (customerName: string) =>
          `🎊 عيد مبارك، ${customerName}! احتفل مع مجموعة عطور العيد الحصرية. عروض لفترة محدودة!`,
      },
      stockAlert: {
        en: (productName: string) =>
          `✨ Good news! "${productName}" is back in stock. Order now before it sells out again!`,
        ar: (productName: string) =>
          `✨ أخبار سارة! "${productName}" متوفر مرة أخرى. اطلب الآن قبل نفاده!`,
      },
    };
  }

  // Utility methods
  static formatUAEPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.startsWith('971')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+971${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      return `+971${cleaned}`;
    }

    return `+${cleaned}`;
  }

  static calculateSMSSegments(message: string, encoding: 'GSM7' | 'UCS2' = 'GSM7'): number {
    const maxLength = encoding === 'GSM7' ? 160 : 70;
    const multiPartLength = encoding === 'GSM7' ? 153 : 67;

    if (message.length <= maxLength) {
      return 1;
    }

    return Math.ceil(message.length / multiPartLength);
  }

  static estimateSMSCost(segments: number, provider: 'TWILIO' | 'AWS_SNS' | 'UNIFONIC' = 'UNIFONIC'): number {
    // Approximate costs in AED (as of 2024)
    const costPerSegment = {
      TWILIO: 0.25,    // ~$0.068 USD
      AWS_SNS: 0.22,   // ~$0.06 USD
      UNIFONIC: 0.18,  // Local UAE provider, typically cheaper
    };

    return segments * costPerSegment[provider];
  }
}