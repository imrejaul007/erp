// Gift Card System with QR Code Support
// Optimized for UAE market with Arabic support

import { prisma } from '@/lib/prisma';
import { GiftCardStatus, GiftCardTransactionType } from '@/types/crm';
import QRCode from 'qrcode';
import crypto from 'crypto';

export interface CreateGiftCardRequest {
  amount: number;
  currency?: string;
  customerId?: string;
  purchasedById: string;
  expiresAt?: Date;
  notes?: string;
  recipientName?: string;
  recipientNameArabic?: string;
  message?: string;
  messageArabic?: string;
}

export interface RedeemGiftCardRequest {
  code: string;
  amount: number;
  orderId?: string;
  notes?: string;
}

export interface GiftCardValidation {
  valid: boolean;
  giftCard?: any;
  error?: string;
  availableBalance?: number;
}

export class GiftCardSystem {
  private static readonly CODE_LENGTH = 16;
  private static readonly CODE_PREFIX = 'PO'; // Perfume & Oud

  // Generate a unique gift card code
  static generateGiftCardCode(): string {
    const randomBytes = crypto.randomBytes(8);
    const code = randomBytes.toString('hex').toUpperCase();

    // Format: PO-XXXX-XXXX-XXXX
    const formattedCode = `${this.CODE_PREFIX}-${code.substring(0, 4)}-${code.substring(4, 8)}-${code.substring(8, 12)}`;
    return formattedCode;
  }

  // Generate QR code for gift card
  static async generateQRCode(giftCardCode: string, amount: number, currency: string = 'AED'): Promise<string> {
    const qrData = {
      type: 'gift_card',
      code: giftCardCode,
      amount,
      currency,
      issuer: 'Perfume & Oud',
      timestamp: new Date().toISOString(),
    };

    const qrCodeData = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#2D1810', // Dark brown for Oud theme
        light: '#F8F6F0', // Cream background
      },
      width: 200,
    });

    return qrCodeData;
  }

  // Create a new gift card
  async createGiftCard(request: CreateGiftCardRequest) {
    const code = GiftCardSystem.generateGiftCardCode();
    const qrCode = await GiftCardSystem.generateQRCode(code, request.amount, request.currency);

    // Set default expiry to 2 years if not specified
    const defaultExpiry = new Date();
    defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 2);

    const giftCard = await prisma.giftCard.create({
      data: {
        code,
        qrCode,
        amount: request.amount,
        balance: request.amount,
        currency: request.currency || 'AED',
        customerId: request.customerId,
        purchasedById: request.purchasedById,
        expiresAt: request.expiresAt || defaultExpiry,
        notes: request.notes,
        status: GiftCardStatus.ACTIVE,
      },
      include: {
        customer: true,
        purchasedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create initial transaction record
    await this.createTransaction(giftCard.id, {
      type: GiftCardTransactionType.ISSUED,
      amount: request.amount,
      notes: `Gift card issued${request.customerId ? ' to customer' : ''}`,
      createdById: request.purchasedById,
    });

    return giftCard;
  }

  // Validate gift card
  async validateGiftCard(code: string): Promise<GiftCardValidation> {
    try {
      const giftCard = await prisma.giftCard.findUnique({
        where: { code },
        include: {
          customer: {
            select: {
              name: true,
              nameArabic: true,
              email: true,
              phone: true,
            },
          },
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!giftCard) {
        return {
          valid: false,
          error: 'Gift card not found',
        };
      }

      if (giftCard.status !== GiftCardStatus.ACTIVE) {
        return {
          valid: false,
          error: `Gift card is ${giftCard.status.toLowerCase()}`,
          giftCard,
        };
      }

      if (giftCard.expiresAt && new Date() > giftCard.expiresAt) {
        await prisma.giftCard.update({
          where: { id: giftCard.id },
          data: { status: GiftCardStatus.EXPIRED },
        });

        return {
          valid: false,
          error: 'Gift card has expired',
          giftCard,
        };
      }

      if (giftCard.balance <= 0) {
        await prisma.giftCard.update({
          where: { id: giftCard.id },
          data: { status: GiftCardStatus.USED },
        });

        return {
          valid: false,
          error: 'Gift card has no remaining balance',
          giftCard,
          availableBalance: 0,
        };
      }

      return {
        valid: true,
        giftCard,
        availableBalance: Number(giftCard.balance),
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Error validating gift card',
      };
    }
  }

  // Redeem gift card
  async redeemGiftCard(request: RedeemGiftCardRequest) {
    const validation = await this.validateGiftCard(request.code);

    if (!validation.valid || !validation.giftCard) {
      throw new Error(validation.error || 'Invalid gift card');
    }

    const giftCard = validation.giftCard;
    const availableBalance = Number(giftCard.balance);

    if (request.amount > availableBalance) {
      throw new Error(`Insufficient balance. Available: ${availableBalance} AED`);
    }

    const newBalance = availableBalance - request.amount;

    // Update gift card balance
    const updatedGiftCard = await prisma.giftCard.update({
      where: { id: giftCard.id },
      data: {
        balance: newBalance,
        status: newBalance <= 0 ? GiftCardStatus.USED : GiftCardStatus.ACTIVE,
      },
    });

    // Create transaction record
    await this.createTransaction(giftCard.id, {
      type: GiftCardTransactionType.REDEEMED,
      amount: -request.amount, // Negative for redemption
      orderId: request.orderId,
      notes: request.notes || `Gift card redeemed for ${request.amount} AED`,
      createdById: giftCard.purchasedById || 'system',
    });

    return {
      success: true,
      giftCard: updatedGiftCard,
      redeemedAmount: request.amount,
      remainingBalance: newBalance,
      transactionId: await this.getLastTransactionId(giftCard.id),
    };
  }

  // Add balance to gift card (for refunds, bonuses, etc.)
  async addBalance(code: string, amount: number, type: GiftCardTransactionType, createdById: string, notes?: string) {
    const giftCard = await prisma.giftCard.findUnique({
      where: { code },
    });

    if (!giftCard) {
      throw new Error('Gift card not found');
    }

    const newBalance = Number(giftCard.balance) + amount;

    const updatedGiftCard = await prisma.giftCard.update({
      where: { id: giftCard.id },
      data: {
        balance: newBalance,
        status: GiftCardStatus.ACTIVE, // Reactivate if it was used
      },
    });

    await this.createTransaction(giftCard.id, {
      type,
      amount,
      notes: notes || `Balance added: ${amount} AED`,
      createdById,
    });

    return updatedGiftCard;
  }

  // Check gift card balance
  async checkBalance(code: string) {
    const validation = await this.validateGiftCard(code);

    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid gift card');
    }

    return {
      code,
      balance: validation.availableBalance,
      currency: validation.giftCard?.currency || 'AED',
      status: validation.giftCard?.status,
      expiresAt: validation.giftCard?.expiresAt,
    };
  }

  // Get gift card transaction history
  async getTransactionHistory(code: string) {
    const giftCard = await prisma.giftCard.findUnique({
      where: { code },
      include: {
        transactions: {
          include: {
            createdBy: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!giftCard) {
      throw new Error('Gift card not found');
    }

    return {
      giftCard: {
        code: giftCard.code,
        amount: giftCard.amount,
        balance: giftCard.balance,
        status: giftCard.status,
        issuedAt: giftCard.issuedAt,
        expiresAt: giftCard.expiresAt,
      },
      transactions: giftCard.transactions,
    };
  }

  // Get gift cards for a customer
  async getCustomerGiftCards(customerId: string, includeUsed: boolean = false) {
    const whereClause = includeUsed
      ? { customerId }
      : {
          customerId,
          status: {
            in: [GiftCardStatus.ACTIVE],
          },
          balance: { gt: 0 },
        };

    const giftCards = await prisma.giftCard.findMany({
      where: whereClause,
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    return giftCards;
  }

  // Expire old gift cards
  async expireOldGiftCards() {
    const today = new Date();

    const expiredCards = await prisma.giftCard.updateMany({
      where: {
        expiresAt: {
          lt: today,
        },
        status: GiftCardStatus.ACTIVE,
      },
      data: {
        status: GiftCardStatus.EXPIRED,
      },
    });

    // Create expiry transactions
    const expiredGiftCards = await prisma.giftCard.findMany({
      where: {
        expiresAt: {
          lt: today,
        },
        status: GiftCardStatus.EXPIRED,
        transactions: {
          none: {
            type: GiftCardTransactionType.EXPIRED,
          },
        },
      },
    });

    for (const giftCard of expiredGiftCards) {
      await this.createTransaction(giftCard.id, {
        type: GiftCardTransactionType.EXPIRED,
        amount: -Number(giftCard.balance),
        notes: 'Gift card expired - balance forfeited',
        createdById: 'system',
      });
    }

    return expiredCards.count;
  }

  // Cancel gift card
  async cancelGiftCard(code: string, reason: string, createdById: string) {
    const giftCard = await prisma.giftCard.findUnique({
      where: { code },
    });

    if (!giftCard) {
      throw new Error('Gift card not found');
    }

    if (giftCard.status === GiftCardStatus.CANCELLED) {
      throw new Error('Gift card is already cancelled');
    }

    const updatedGiftCard = await prisma.giftCard.update({
      where: { id: giftCard.id },
      data: {
        status: GiftCardStatus.CANCELLED,
      },
    });

    await this.createTransaction(giftCard.id, {
      type: GiftCardTransactionType.REFUNDED,
      amount: -Number(giftCard.balance),
      notes: `Gift card cancelled: ${reason}`,
      createdById,
    });

    return updatedGiftCard;
  }

  // Generate gift card report
  async generateReport(startDate: Date, endDate: Date) {
    const [issued, redeemed, expired, active] = await Promise.all([
      // Total issued
      prisma.giftCard.aggregate({
        where: {
          issuedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { amount: true },
        _count: true,
      }),

      // Total redeemed
      prisma.giftCardTransaction.aggregate({
        where: {
          type: GiftCardTransactionType.REDEEMED,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { amount: true },
        _count: true,
      }),

      // Expired in period
      prisma.giftCard.aggregate({
        where: {
          status: GiftCardStatus.EXPIRED,
          expiresAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { balance: true },
        _count: true,
      }),

      // Currently active
      prisma.giftCard.aggregate({
        where: {
          status: GiftCardStatus.ACTIVE,
          balance: { gt: 0 },
        },
        _sum: { balance: true },
        _count: true,
      }),
    ]);

    return {
      period: {
        startDate,
        endDate,
      },
      issued: {
        count: issued._count,
        totalValue: Number(issued._sum.amount || 0),
      },
      redeemed: {
        count: Math.abs(redeemed._count),
        totalValue: Math.abs(Number(redeemed._sum.amount || 0)),
      },
      expired: {
        count: expired._count,
        totalValue: Number(expired._sum.balance || 0),
      },
      active: {
        count: active._count,
        totalOutstanding: Number(active._sum.balance || 0),
      },
      redemptionRate: issued._count > 0 ? (Math.abs(redeemed._count) / issued._count) * 100 : 0,
    };
  }

  // Create gift card transaction
  private async createTransaction(giftCardId: string, transaction: {
    type: GiftCardTransactionType;
    amount: number;
    orderId?: string;
    notes?: string;
    createdById: string;
  }) {
    return prisma.giftCardTransaction.create({
      data: {
        giftCardId,
        type: transaction.type,
        amount: transaction.amount,
        orderId: transaction.orderId,
        notes: transaction.notes,
        createdById: transaction.createdById,
      },
    });
  }

  // Get last transaction ID
  private async getLastTransactionId(giftCardId: string): Promise<string> {
    const transaction = await prisma.giftCardTransaction.findFirst({
      where: { giftCardId },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    return transaction?.id || '';
  }

  // UAE-specific gift card templates
  static getUAEGiftCardTemplates() {
    return {
      birthday: {
        en: {
          title: '🎂 Happy Birthday!',
          message: 'Wishing you a wonderful birthday filled with beautiful fragrances and memorable moments!',
        },
        ar: {
          title: '🎂 عيد ميلاد سعيد!',
          message: 'نتمنى لك عيد ميلاد رائع مليء بالعطور الجميلة واللحظات التي لا تُنسى!',
        },
      },
      wedding: {
        en: {
          title: '💍 Congratulations on Your Wedding!',
          message: 'May your love story be as beautiful and lasting as our finest fragrances. Congratulations!',
        },
        ar: {
          title: '💍 مبروك الزواج!',
          message: 'عسى أن تكون قصة حبكم جميلة ودائمة مثل أجود عطورنا. مبروك!',
        },
      },
      eid: {
        en: {
          title: '🌙 Eid Mubarak!',
          message: 'May this blessed Eid bring you joy, peace, and the finest fragrances to celebrate with!',
        },
        ar: {
          title: '🌙 عيد مبارك!',
          message: 'عسى أن يجلب لك هذا العيد المبارك الفرح والسلام وأجود العطور للاحتفال!',
        },
      },
      ramadan: {
        en: {
          title: '🌙 Ramadan Kareem!',
          message: 'Wishing you a blessed Ramadan filled with spiritual reflection and beautiful moments.',
        },
        ar: {
          title: '🌙 رمضان كريم!',
          message: 'نتمنى لك رمضان مبارك مليء بالتأمل الروحي واللحظات الجميلة.',
        },
      },
      graduation: {
        en: {
          title: '🎓 Congratulations Graduate!',
          message: 'Your achievement deserves to be celebrated with the finest fragrances. Congratulations!',
        },
        ar: {
          title: '🎓 مبروك التخرج!',
          message: 'إنجازك يستحق الاحتفال بأجود العطور. مبروك!',
        },
      },
      corporate: {
        en: {
          title: '🏢 Thank You for Your Business',
          message: 'We appreciate your partnership and look forward to serving you with excellence.',
        },
        ar: {
          title: '🏢 شكراً لتعاملكم معنا',
          message: 'نقدر شراكتكم ونتطلع لخدمتكم بامتياز.',
        },
      },
    };
  }

  // Validate QR code data
  static validateQRCode(qrData: string): { valid: boolean; code?: string; error?: string } {
    try {
      const data = JSON.parse(qrData);

      if (data.type !== 'gift_card') {
        return { valid: false, error: 'Invalid QR code type' };
      }

      if (!data.code || !data.code.startsWith(this.CODE_PREFIX)) {
        return { valid: false, error: 'Invalid gift card code format' };
      }

      if (data.issuer !== 'Perfume & Oud') {
        return { valid: false, error: 'QR code not issued by Perfume & Oud' };
      }

      return { valid: true, code: data.code };
    } catch (error) {
      return { valid: false, error: 'Invalid QR code format' };
    }
  }
}