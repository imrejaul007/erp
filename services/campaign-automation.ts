// Automated Campaign System for Perfume & Oud ERP
// Supports culturally-aware campaigns for the UAE market

import { prisma } from '@/lib/prisma';
import { WhatsAppBusinessService } from './whatsapp-business';
import { SMSGatewayService } from './sms-gateway';
import {
  CampaignType,
  CampaignTriggerType,
  CampaignStatus,
  CustomerSegment,
  CommunicationType,
} from '@/types/crm';

export interface CampaignTemplate {
  name: string;
  nameArabic: string;
  type: CampaignType;
  triggerType: CampaignTriggerType;
  subject?: {
    en: string;
    ar: string;
  };
  content: {
    en: string;
    ar: string;
  };
  segmentFilter?: {
    segments?: CustomerSegment[];
    minLifetimeValue?: number;
    maxLifetimeValue?: number;
    loyaltyTier?: string[];
    emirate?: string[];
  };
}

export interface CampaignExecution {
  campaignId: string;
  customerId: string;
  channel: CommunicationType;
  scheduledAt: Date;
  content: string;
  contentArabic?: string;
  subject?: string;
}

export class CampaignAutomationService {
  private whatsappService?: WhatsAppBusinessService;
  private smsService?: SMSGatewayService;

  constructor(whatsappService?: WhatsAppBusinessService, smsService?: SMSGatewayService) {
    this.whatsappService = whatsappService;
    this.smsService = smsService;
  }

  // Create a new campaign
  async createCampaign(template: CampaignTemplate, createdById: string) {
    const campaign = await prisma.campaign.create({
      data: {
        name: template.name,
        nameArabic: template.nameArabic,
        type: template.type,
        triggerType: template.triggerType,
        segmentFilter: template.segmentFilter || {},
        subject: template.subject?.en || '',
        content: template.content.en,
        contentArabic: template.content.ar,
        status: CampaignStatus.DRAFT,
        createdById,
      },
    });

    return campaign;
  }

  // Execute triggered campaigns (run daily)
  async executeCampaigns() {
    try {
      // Get all active campaigns with trigger types
      const campaigns = await prisma.campaign.findMany({
        where: {
          status: CampaignStatus.RUNNING,
          triggerType: {
            in: [
              CampaignTriggerType.BIRTHDAY,
              CampaignTriggerType.ANNIVERSARY,
              CampaignTriggerType.RESTOCK_ALERT,
              CampaignTriggerType.WIN_BACK,
              CampaignTriggerType.SEASONAL,
            ],
          },
        },
      });

      for (const campaign of campaigns) {
        await this.processCampaignTrigger(campaign);
      }
    } catch (error) {
      console.error('Error executing campaigns:', error);
    }
  }

  private async processCampaignTrigger(campaign: any) {
    switch (campaign.triggerType) {
      case CampaignTriggerType.BIRTHDAY:
        await this.processBirthdayCampaign(campaign);
        break;
      case CampaignTriggerType.ANNIVERSARY:
        await this.processAnniversaryCampaign(campaign);
        break;
      case CampaignTriggerType.WIN_BACK:
        await this.processWinBackCampaign(campaign);
        break;
      case CampaignTriggerType.SEASONAL:
        await this.processSeasonalCampaign(campaign);
        break;
    }
  }

  private async processBirthdayCampaign(campaign: any) {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Find customers with birthdays today
    const customers = await prisma.customer.findMany({
      where: {
        dateOfBirth: {
          not: null,
        },
        status: 'ACTIVE',
        isActive: true,
        AND: [
          {
            dateOfBirth: {
              not: null,
            },
          },
        ],
      },
      include: {
        loyaltyAccount: true,
      },
    });

    const birthdayCustomers = customers.filter((customer) => {
      if (!customer.dateOfBirth) return false;
      const birthDate = new Date(customer.dateOfBirth);
      return (
        birthDate.getMonth() + 1 === todayMonth &&
        birthDate.getDate() === todayDay
      );
    });

    for (const customer of birthdayCustomers) {
      if (this.matchesSegmentFilter(customer, campaign.segmentFilter)) {
        await this.executeCustomerCampaign(campaign, customer, {
          customerName: customer.name,
          loyaltyPoints: customer.loyaltyAccount?.points || 0,
        });
      }
    }
  }

  private async processAnniversaryCampaign(campaign: any) {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Find customers with first purchase anniversary
    const customers = await prisma.customer.findMany({
      where: {
        status: 'ACTIVE',
        isActive: true,
        createdAt: {
          gte: new Date(oneYearAgo.getFullYear(), oneYearAgo.getMonth(), oneYearAgo.getDate()),
          lt: new Date(oneYearAgo.getFullYear(), oneYearAgo.getMonth(), oneYearAgo.getDate() + 1),
        },
      },
      include: {
        loyaltyAccount: true,
      },
    });

    for (const customer of customers) {
      if (this.matchesSegmentFilter(customer, campaign.segmentFilter)) {
        await this.executeCustomerCampaign(campaign, customer, {
          customerName: customer.name,
          anniversaryYear: Math.floor((today.getTime() - customer.createdAt.getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
        });
      }
    }
  }

  private async processWinBackCampaign(campaign: any) {
    const cutoffDate = new Date();
    cutoffDate.setDays(cutoffDate.getDate() - 90); // 90 days inactive

    const inactiveCustomers = await prisma.customer.findMany({
      where: {
        status: 'ACTIVE',
        isActive: true,
        lastInteraction: {
          lt: cutoffDate,
        },
        orders: {
          some: {
            orderDate: {
              lt: cutoffDate,
            },
          },
        },
      },
      include: {
        loyaltyAccount: true,
        orders: {
          orderBy: { orderDate: 'desc' },
          take: 1,
        },
      },
    });

    for (const customer of inactiveCustomers) {
      if (this.matchesSegmentFilter(customer, campaign.segmentFilter)) {
        await this.executeCustomerCampaign(campaign, customer, {
          customerName: customer.name,
          daysSinceLastOrder: Math.floor(
            (new Date().getTime() - (customer.orders[0]?.orderDate?.getTime() || 0)) / (24 * 60 * 60 * 1000)
          ),
        });
      }
    }
  }

  private async processSeasonalCampaign(campaign: any) {
    const today = new Date();
    const triggerValue = campaign.triggerValue as any;

    // Check if today matches the seasonal trigger
    if (this.isSeasonalMatch(today, triggerValue)) {
      const customers = await prisma.customer.findMany({
        where: {
          status: 'ACTIVE',
          isActive: true,
        },
        include: {
          loyaltyAccount: true,
        },
      });

      for (const customer of customers) {
        if (this.matchesSegmentFilter(customer, campaign.segmentFilter)) {
          await this.executeCustomerCampaign(campaign, customer, {
            customerName: customer.name,
            seasonalOccasion: triggerValue.occasion || 'Special Season',
          });
        }
      }
    }
  }

  private isSeasonalMatch(date: Date, triggerValue: any): boolean {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // UAE cultural and religious events
    const seasonalEvents = {
      ramadan: { months: [3, 4] }, // Varies each year
      eid_fitr: { months: [4, 5] },
      eid_adha: { months: [7, 8] },
      national_day: { month: 12, day: 2 },
      mothers_day: { month: 3, day: 21 },
      summer_sale: { months: [6, 7, 8] },
      winter_collection: { months: [11, 12, 1] },
    };

    if (triggerValue.eventType && seasonalEvents[triggerValue.eventType]) {
      const event = seasonalEvents[triggerValue.eventType];
      if (event.months) {
        return event.months.includes(month);
      }
      if (event.month && event.day) {
        return month === event.month && day === event.day;
      }
    }

    return false;
  }

  private matchesSegmentFilter(customer: any, segmentFilter: any): boolean {
    if (!segmentFilter) return true;

    // Check segment
    if (segmentFilter.segments && !segmentFilter.segments.includes(customer.segment)) {
      return false;
    }

    // Check lifetime value
    if (segmentFilter.minLifetimeValue && customer.totalLifetimeValue < segmentFilter.minLifetimeValue) {
      return false;
    }

    if (segmentFilter.maxLifetimeValue && customer.totalLifetimeValue > segmentFilter.maxLifetimeValue) {
      return false;
    }

    // Check loyalty tier
    if (segmentFilter.loyaltyTier && customer.loyaltyAccount) {
      if (!segmentFilter.loyaltyTier.includes(customer.loyaltyAccount.tier)) {
        return false;
      }
    }

    // Check emirate
    if (segmentFilter.emirate && !segmentFilter.emirate.includes(customer.emirate)) {
      return false;
    }

    return true;
  }

  private async executeCustomerCampaign(campaign: any, customer: any, variables: Record<string, any>) {
    try {
      // Replace variables in content
      const content = this.replaceVariables(campaign.content, variables);
      const contentArabic = this.replaceVariables(campaign.contentArabic || '', variables);

      // Determine the best communication channel
      const channel = this.selectBestChannel(customer, campaign.type);

      // Create campaign execution record
      const execution = await prisma.campaignExecution.create({
        data: {
          campaignId: campaign.id,
          customerId: customer.id,
          status: 'PENDING',
        },
      });

      // Send the message
      await this.sendCampaignMessage(customer, channel, {
        subject: campaign.subject,
        content,
        contentArabic,
        language: customer.language || 'en',
      });

      // Update execution status
      await prisma.campaignExecution.update({
        where: { id: execution.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      // Update campaign statistics
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          sentCount: { increment: 1 },
        },
      });

    } catch (error) {
      console.error(`Error executing campaign for customer ${customer.id}:`, error);

      // Log the failure
      await prisma.campaignExecution.updateMany({
        where: {
          campaignId: campaign.id,
          customerId: customer.id,
          status: 'PENDING',
        },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  private replaceVariables(content: string, variables: Record<string, any>): string {
    let result = content;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(value));
    });

    return result;
  }

  private selectBestChannel(customer: any, campaignType: CampaignType): CommunicationType {
    // Priority: WhatsApp > SMS > Email
    if (campaignType === CampaignType.WHATSAPP && customer.phone) {
      return CommunicationType.WHATSAPP;
    }

    if (campaignType === CampaignType.SMS && customer.phone) {
      return CommunicationType.SMS;
    }

    if (campaignType === CampaignType.EMAIL && customer.email) {
      return CommunicationType.EMAIL;
    }

    // Fallback to available channel
    if (customer.phone) {
      return CommunicationType.WHATSAPP;
    }

    if (customer.email) {
      return CommunicationType.EMAIL;
    }

    throw new Error('No available communication channel for customer');
  }

  private async sendCampaignMessage(
    customer: any,
    channel: CommunicationType,
    message: {
      subject?: string;
      content: string;
      contentArabic?: string;
      language: 'en' | 'ar';
    }
  ) {
    const finalContent = message.language === 'ar' && message.contentArabic
      ? message.contentArabic
      : message.content;

    switch (channel) {
      case CommunicationType.WHATSAPP:
        if (this.whatsappService) {
          await this.whatsappService.sendTextMessage(
            WhatsAppBusinessService.formatUAEPhoneNumber(customer.phone),
            finalContent
          );
        }
        break;

      case CommunicationType.SMS:
        if (this.smsService) {
          await this.smsService.sendSMS({
            to: SMSGatewayService.formatUAEPhoneNumber(customer.phone),
            message: message.content,
            messageArabic: message.contentArabic,
            language: message.language,
          });
        }
        break;

      case CommunicationType.EMAIL:
        // Email sending would be implemented here
        console.log('Email sending not implemented yet');
        break;

      default:
        throw new Error(`Unsupported communication channel: ${channel}`);
    }
  }

  // Get predefined UAE-specific campaign templates
  static getUAECampaignTemplates(): CampaignTemplate[] {
    return [
      {
        name: 'Birthday Wishes',
        nameArabic: 'تهنئة عيد الميلاد',
        type: CampaignType.MIXED,
        triggerType: CampaignTriggerType.BIRTHDAY,
        subject: {
          en: '🎉 Happy Birthday from Perfume & Oud!',
          ar: '🎉 عيد ميلاد سعيد من عطور وعود!',
        },
        content: {
          en: '🎂 Happy Birthday, {{customerName}}!\n\nOn your special day, we want to celebrate with you! Enjoy a complimentary gift with your next purchase.\n\nVisit us today and discover our latest fragrance collections.\n\nWith warm wishes,\nPerfume & Oud Team',
          ar: '🎂 عيد ميلاد سعيد، {{customerName}}!\n\nفي يومك المميز، نريد أن نحتفل معك! استمتع بهدية مجانية مع عملية الشراء التالية.\n\nزرنا اليوم واكتشف أحدث مجموعات العطور لدينا.\n\nمع أطيب التمنيات،\nفريق عطور وعود',
        },
      },
      {
        name: 'Customer Anniversary',
        nameArabic: 'ذكرى العميل',
        type: CampaignType.WHATSAPP,
        triggerType: CampaignTriggerType.ANNIVERSARY,
        content: {
          en: '🎊 It\'s been {{anniversaryYear}} year(s) since you joined our Perfume & Oud family, {{customerName}}!\n\nThank you for your continued trust and loyalty. As a token of appreciation, enjoy 15% off your next purchase.\n\nCode: ANNIVERSARY{{anniversaryYear}}',
          ar: '🎊 لقد مر {{anniversaryYear}} سنة منذ انضمامك إلى عائلة عطور وعود، {{customerName}}!\n\nشكراً لك على ثقتك ووفائك المستمر. كرمز للتقدير، استمتع بخصم 15% على عملية الشراء التالية.\n\nالرمز: ANNIVERSARY{{anniversaryYear}}',
        },
      },
      {
        name: 'Win Back Campaign',
        nameArabic: 'حملة استعادة العملاء',
        type: CampaignType.SMS,
        triggerType: CampaignTriggerType.WIN_BACK,
        content: {
          en: 'We miss you, {{customerName}}! 💔\n\nIt\'s been {{daysSinceLastOrder}} days since your last visit. Come back and discover our new arrivals with 20% off!\n\nValid for 7 days. Use: COMEBACK20',
          ar: 'نشتاق إليك، {{customerName}}! 💔\n\nلقد مر {{daysSinceLastOrder}} يوماً منذ زيارتك الأخيرة. عد واكتشف وصولاتنا الجديدة مع خصم 20%!\n\nساري لمدة 7 أيام. استخدم: COMEBACK20',
        },
      },
      {
        name: 'Ramadan Greetings',
        nameArabic: 'تهنئة رمضان',
        type: CampaignType.WHATSAPP,
        triggerType: CampaignTriggerType.SEASONAL,
        content: {
          en: '🌙 Ramadan Mubarak, {{customerName}}!\n\nMay this holy month bring you peace, joy, and countless blessings. Discover our special Ramadan collection featuring traditional Oud and Oriental fragrances.\n\nSpecial Ramadan offer: 25% off\nCode: RAMADAN2024',
          ar: '🌙 رمضان مبارك، {{customerName}}!\n\nعسى أن يجلب لك هذا الشهر الكريم السلام والفرح والبركات التي لا تعد ولا تحصى. اكتشف مجموعة رمضان الخاصة بنا التي تضم عطور العود والعطور الشرقية التقليدية.\n\nعرض رمضان الخاص: خصم 25%\nالرمز: RAMADAN2024',
        },
      },
      {
        name: 'UAE National Day',
        nameArabic: 'اليوم الوطني للإمارات',
        type: CampaignType.MIXED,
        triggerType: CampaignTriggerType.SEASONAL,
        content: {
          en: '🇦🇪 Happy UAE National Day, {{customerName}}!\n\nCelebrating 53 years of unity, progress, and pride! Join us in honoring our beautiful nation with our exclusive UAE National Day collection.\n\nSpecial patriotic discount: 53% off selected items\nCode: UAE53',
          ar: '🇦🇪 عيد وطني سعيد، {{customerName}}!\n\nنحتفل بـ 53 عاماً من الوحدة والتقدم والفخر! انضم إلينا في تكريم وطننا الجميل مع مجموعة اليوم الوطني الحصرية.\n\nخصم وطني خاص: 53% على مواد مختارة\nالرمز: UAE53',
        },
      },
      {
        name: 'Summer Collection Launch',
        nameArabic: 'إطلاق مجموعة الصيف',
        type: CampaignType.EMAIL,
        triggerType: CampaignTriggerType.SEASONAL,
        subject: {
          en: '☀️ Beat the Heat with Our Summer Collection',
          ar: '☀️ تغلب على الحر مع مجموعة الصيف',
        },
        content: {
          en: '☀️ Summer is here, {{customerName}}!\n\nBeat the UAE heat with our refreshing summer fragrance collection. Light, fresh, and perfect for the season.\n\nEarly access for loyal customers: 30% off\nShop now and stay fresh all summer!',
          ar: '☀️ الصيف هنا، {{customerName}}!\n\nتغلب على حر الإمارات مع مجموعة عطور الصيف المنعشة. خفيفة ومنعشة ومثالية للموسم.\n\nوصول مبكر للعملاء المخلصين: خصم 30%\nتسوق الآن وابق منتعشاً طوال الصيف!',
        },
        segmentFilter: {
          segments: [CustomerSegment.VIP, CustomerSegment.REGULAR],
        },
      },
    ];
  }

  // Schedule campaigns for specific dates
  async scheduleCampaign(campaignId: string, scheduledAt: Date) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: CampaignStatus.SCHEDULED,
        scheduledAt,
      },
    });
  }

  // Get campaign performance
  async getCampaignPerformance(campaignId: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        executions: {
          include: {
            customer: {
              select: {
                segment: true,
                emirate: true,
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const stats = {
      totalSent: campaign.sentCount,
      totalDelivered: campaign.deliveredCount,
      totalOpened: campaign.openedCount,
      totalClicked: campaign.clickedCount,
      deliveryRate: campaign.sentCount > 0 ? (campaign.deliveredCount / campaign.sentCount) * 100 : 0,
      openRate: campaign.deliveredCount > 0 ? (campaign.openedCount / campaign.deliveredCount) * 100 : 0,
      clickRate: campaign.openedCount > 0 ? (campaign.clickedCount / campaign.openedCount) * 100 : 0,
      segmentBreakdown: {} as Record<string, number>,
      emirateBreakdown: {} as Record<string, number>,
    };

    // Calculate segment and emirate breakdowns
    campaign.executions.forEach((execution) => {
      const segment = execution.customer.segment;
      const emirate = execution.customer.emirate || 'Unknown';

      stats.segmentBreakdown[segment] = (stats.segmentBreakdown[segment] || 0) + 1;
      stats.emirateBreakdown[emirate] = (stats.emirateBreakdown[emirate] || 0) + 1;
    });

    return stats;
  }
}