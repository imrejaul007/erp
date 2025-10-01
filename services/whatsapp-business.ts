// WhatsApp Business API Integration Service
// Optimized for UAE market with Arabic language support

import { WhatsAppBusinessConfig } from '@/types/crm';

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'interactive' | 'image' | 'document';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string; // 'en' or 'ar'
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
  interactive?: {
    type: 'button' | 'list';
    body: {
      text: string;
    };
    action: {
      buttons?: Array<{
        type: 'reply';
        reply: {
          id: string;
          title: string;
        };
      }>;
      sections?: Array<{
        title: string;
        rows: Array<{
          id: string;
          title: string;
          description?: string;
        }>;
      }>;
    };
  };
  image?: {
    link: string;
    caption?: string;
  };
}

export interface WhatsAppTemplate {
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: 'en' | 'ar';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  components: Array<{
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    text?: string;
    example?: {
      header_text?: string[];
      body_text?: string[][];
    };
    buttons?: Array<{
      type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
      text: string;
      url?: string;
      phone_number?: string;
    }>;
  }>;
}

export class WhatsAppBusinessService {
  private config: WhatsAppBusinessConfig;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(config: WhatsAppBusinessConfig) {
    this.config = config;
  }

  // Send WhatsApp message
  async sendMessage(message: WhatsAppMessage): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            ...message,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  // Send text message
  async sendTextMessage(to: string, text: string): Promise<any> {
    const message: WhatsAppMessage = {
      to,
      type: 'text',
      text: { body: text },
    };

    return this.sendMessage(message);
  }

  // Send template message
  async sendTemplateMessage(
    to: string,
    templateName: string,
    language: 'en' | 'ar' = 'en',
    parameters?: Array<{ type: string; text: string }>
  ): Promise<any> {
    const message: WhatsAppMessage = {
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: language },
        ...(parameters && {
          components: [
            {
              type: 'body',
              parameters,
            },
          ],
        }),
      },
    };

    return this.sendMessage(message);
  }

  // Send interactive button message
  async sendButtonMessage(
    to: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<any> {
    if (buttons.length > 3) {
      throw new Error('WhatsApp supports maximum 3 buttons');
    }

    const message: WhatsAppMessage = {
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: buttons.map((btn) => ({
            type: 'reply',
            reply: {
              id: btn.id,
              title: btn.title,
            },
          })),
        },
      },
    };

    return this.sendMessage(message);
  }

  // Send list message
  async sendListMessage(
    to: string,
    bodyText: string,
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{
        id: string;
        title: string;
        description?: string;
      }>;
    }>
  ): Promise<any> {
    const message: WhatsAppMessage = {
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: { text: bodyText },
        action: {
          sections,
        },
      },
    };

    return this.sendMessage(message);
  }

  // Get message templates
  async getMessageTemplates(): Promise<WhatsAppTemplate[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.businessAccountId}/message_templates`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch WhatsApp templates');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching WhatsApp templates:', error);
      throw error;
    }
  }

  // Create message template
  async createMessageTemplate(template: Omit<WhatsAppTemplate, 'status'>): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.businessAccountId}/message_templates`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(template),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Template creation failed: ${JSON.stringify(error)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating WhatsApp template:', error);
      throw error;
    }
  }

  // Verify webhook
  static verifyWebhook(
    mode: string,
    token: string,
    challenge: string,
    verifyToken: string
  ): string | null {
    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }
    return null;
  }

  // Process incoming webhook
  static processWebhook(body: any): Array<{
    from: string;
    timestamp: string;
    type: string;
    text?: string;
    button?: { payload: string; text: string };
    list?: { id: string; title: string; description?: string };
    image?: { id: string; mime_type: string; sha256: string };
  }> {
    const messages: Array<any> = [];

    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach((entry: any) => {
        entry.changes?.forEach((change: any) => {
          if (change.field === 'messages') {
            change.value?.messages?.forEach((message: any) => {
              messages.push({
                from: message.from,
                timestamp: message.timestamp,
                type: message.type,
                text: message.text?.body,
                button: message.button,
                list: message.list_reply,
                image: message.image,
              });
            });
          }
        });
      });
    }

    return messages;
  }

  // UAE-specific template helpers
  async sendWelcomeMessage(to: string, customerName: string, language: 'en' | 'ar' = 'en'): Promise<any> {
    const templates = {
      en: {
        text: `Welcome to Perfume & Oud, ${customerName}! 🌹\n\nDiscover our exquisite collection of premium fragrances. Reply with:\n• CATALOG - View our products\n• OFFERS - Current promotions\n• SUPPORT - Get help`,
      },
      ar: {
        text: `مرحباً بك في عطور وعود، ${customerName}! 🌹\n\nاكتشف مجموعتنا الرائعة من العطور الفاخرة. رد بـ:\n• كتالوج - عرض منتجاتنا\n• عروض - العروض الحالية\n• دعم - الحصول على مساعدة`,
      },
    };

    return this.sendTextMessage(to, templates[language].text);
  }

  async sendOrderConfirmation(
    to: string,
    orderNo: string,
    amount: number,
    language: 'en' | 'ar' = 'en'
  ): Promise<any> {
    const templates = {
      en: {
        text: `✅ Order Confirmed!\n\nOrder #${orderNo}\nAmount: ${amount} AED\n\nYour order will be prepared shortly. We'll notify you when it's ready for pickup/delivery.\n\nThank you for choosing Perfume & Oud!`,
      },
      ar: {
        text: `✅ تم تأكيد الطلب!\n\nالطلب #${orderNo}\nالمبلغ: ${amount} درهم\n\nسيتم تحضير طلبك قريباً. سنخبرك عندما يكون جاهزاً للاستلام/التوصيل.\n\nشكراً لاختيارك عطور وعود!`,
      },
    };

    return this.sendTextMessage(to, templates[language].text);
  }

  async sendRamadanGreeting(to: string, customerName: string, language: 'en' | 'ar' = 'en'): Promise<any> {
    const templates = {
      en: {
        text: `🌙 Ramadan Mubarak, ${customerName}!\n\nMay this holy month bring you peace and blessings. Discover our special Ramadan collection with 20% off on premium Oud fragrances.\n\nUse code: RAMADAN20\nValid until Eid Al-Fitr`,
      },
      ar: {
        text: `🌙 رمضان مبارك، ${customerName}!\n\nعسى أن يجلب لك هذا الشهر الكريم السلام والبركات. اكتشف مجموعة رمضان الخاصة بنا مع خصم 20% على عطور العود الفاخرة.\n\nاستخدم الرمز: RAMADAN20\nساري حتى عيد الفطر`,
      },
    };

    return this.sendTextMessage(to, templates[language].text);
  }

  async sendBirthdayWish(to: string, customerName: string, language: 'en' | 'ar' = 'en'): Promise<any> {
    const buttons = language === 'en'
      ? [
          { id: 'view_gift', title: '🎁 View Gift' },
          { id: 'browse_catalog', title: '🛍️ Browse' },
          { id: 'contact_us', title: '📞 Call Us' },
        ]
      : [
          { id: 'view_gift', title: '🎁 شاهد الهدية' },
          { id: 'browse_catalog', title: '🛍️ تصفح' },
          { id: 'contact_us', title: '📞 اتصل بنا' },
        ];

    const bodyText = language === 'en'
      ? `🎉 Happy Birthday, ${customerName}!\n\nWishing you a year filled with joy and beautiful fragrances. We have a special birthday gift waiting for you!`
      : `🎉 عيد ميلاد سعيد، ${customerName}!\n\nنتمنى لك سنة مليئة بالفرح والعطور الجميلة. لدينا هدية عيد ميلاد خاصة تنتظرك!`;

    return this.sendButtonMessage(to, bodyText, buttons);
  }

  async sendRestockAlert(
    to: string,
    productName: string,
    customerName: string,
    language: 'en' | 'ar' = 'en'
  ): Promise<any> {
    const buttons = language === 'en'
      ? [
          { id: 'buy_now', title: '🛒 Buy Now' },
          { id: 'view_details', title: '👁️ View Details' },
          { id: 'remove_alert', title: '🔕 Remove Alert' },
        ]
      : [
          { id: 'buy_now', title: '🛒 اشتري الآن' },
          { id: 'view_details', title: '👁️ عرض التفاصيل' },
          { id: 'remove_alert', title: '🔕 إزالة التنبيه' },
        ];

    const bodyText = language === 'en'
      ? `🔔 Good News, ${customerName}!\n\n"${productName}" is back in stock! Don't miss out on your favorite fragrance.`
      : `🔔 أخبار سارة، ${customerName}!\n\n"${productName}" متوفر مرة أخرى! لا تفوت عطرك المفضل.`;

    return this.sendButtonMessage(to, bodyText, buttons);
  }

  // Utility method to format phone number for UAE
  static formatUAEPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Handle UAE numbers
    if (cleaned.startsWith('971')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+971${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      return `+971${cleaned}`;
    }

    return `+${cleaned}`;
  }

  // Get delivery status templates
  getDeliveryStatusTemplates() {
    return {
      en: {
        preparing: (orderNo: string) =>
          `🧪 Your order #${orderNo} is being prepared with love and care. We'll notify you once it's ready!`,
        ready: (orderNo: string) =>
          `✅ Great news! Your order #${orderNo} is ready for pickup. Please visit us at your convenience.`,
        shipped: (orderNo: string, trackingNo: string) =>
          `🚚 Your order #${orderNo} has been shipped! Track it with: ${trackingNo}`,
        delivered: (orderNo: string) =>
          `🎉 Your order #${orderNo} has been delivered! We hope you love your new fragrance. Please rate your experience.`,
      },
      ar: {
        preparing: (orderNo: string) =>
          `🧪 طلبك #${orderNo} يتم تحضيره بحب وعناية. سنخبرك بمجرد أن يكون جاهزاً!`,
        ready: (orderNo: string) =>
          `✅ أخبار رائعة! طلبك #${orderNo} جاهز للاستلام. يرجى زيارتنا في الوقت المناسب لك.`,
        shipped: (orderNo: string, trackingNo: string) =>
          `🚚 تم شحن طلبك #${orderNo}! تتبعه برقم: ${trackingNo}`,
        delivered: (orderNo: string) =>
          `🎉 تم تسليم طلبك #${orderNo}! نأمل أن تحب عطرك الجديد. يرجى تقييم تجربتك.`,
      },
    };
  }
}