// CRM Utilities for Perfume & Oud ERP System

import { LoyaltyTier, CustomerSegment, UAE_EMIRATES } from '@/types/crm';

// Loyalty Program Constants
export const LOYALTY_CONFIG = {
  // Points earning rates
  POINTS_PER_AED: 1,

  // Tier thresholds (points required)
  TIER_THRESHOLDS: {
    BRONZE: 0,
    SILVER: 1000,
    GOLD: 5000,
    PLATINUM: 15000,
    DIAMOND: 50000,
  },

  // Segment multipliers for bonus points
  SEGMENT_MULTIPLIERS: {
    VIP: 2,
    WHOLESALE: 1.5,
    EXPORT: 1.2,
    REGULAR: 1,
  },

  // Tier upgrade bonuses
  TIER_BONUSES: {
    BRONZE: 0,
    SILVER: 100,
    GOLD: 500,
    PLATINUM: 1500,
    DIAMOND: 5000,
  },

  // Points expiry (days)
  POINTS_EXPIRY_DAYS: 730, // 2 years
} as const;

// SLA Configuration for Support Tickets
export const SUPPORT_SLA = {
  CRITICAL: 2, // hours
  HIGH: 8,
  MEDIUM: 24,
  LOW: 72,
} as const;

// UAE Phone Number Validation
export const UAE_PHONE_REGEX = /^(\+971|0)?[0-9]{9}$/;

// Customer Utility Functions
export class CustomerUtils {
  /**
   * Generate next customer code
   */
  static generateCustomerCode(count: number): string {
    return `CUS-${String(count + 1).padStart(6, '0')}`;
  }

  /**
   * Validate UAE phone number
   */
  static isValidUAEPhone(phone: string): boolean {
    return UAE_PHONE_REGEX.test(phone);
  }

  /**
   * Format UAE phone number to international format
   */
  static formatUAEPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('971')) {
      return `+${cleaned}`;
    }
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return `+971${cleaned.slice(1)}`;
    }
    if (cleaned.length === 9) {
      return `+971${cleaned}`;
    }
    return phone;
  }

  /**
   * Get customer's preferred language based on name
   */
  static inferLanguagePreference(name: string, nameArabic?: string): 'en' | 'ar' {
    if (nameArabic && nameArabic.trim().length > 0) {
      return 'ar';
    }
    // Simple heuristic: if name contains Arabic characters
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(name) ? 'ar' : 'en';
  }

  /**
   * Calculate customer risk score (0-100)
   */
  static calculateRiskScore(
    daysSinceLastOrder: number,
    orderCount: number,
    hasActiveTickets: boolean,
    segment: CustomerSegment
  ): number {
    let riskScore = 0;

    // Days since last order factor
    if (daysSinceLastOrder > 365) riskScore += 60;
    else if (daysSinceLastOrder > 180) riskScore += 40;
    else if (daysSinceLastOrder > 90) riskScore += 25;
    else if (daysSinceLastOrder > 60) riskScore += 15;

    // Order frequency factor
    if (orderCount === 1) riskScore += 20;
    else if (orderCount < 3) riskScore += 10;

    // Active tickets (negative indicator for churn)
    if (hasActiveTickets) riskScore -= 10;

    // Segment factor
    if (segment === 'REGULAR') riskScore += 5;
    else if (segment === 'VIP') riskScore -= 5;

    return Math.max(0, Math.min(100, riskScore));
  }

  /**
   * Get retention strategies based on risk score
   */
  static getRetentionStrategies(riskScore: number): string[] {
    const strategies: string[] = [];

    if (riskScore > 70) {
      strategies.push('Urgent personal outreach');
      strategies.push('Special discount offer (20-30%)');
      strategies.push('VIP upgrade consideration');
      strategies.push('Personal shopper assignment');
    } else if (riskScore > 40) {
      strategies.push('Re-engagement email campaign');
      strategies.push('Product recommendations');
      strategies.push('Birthday/anniversary offers');
      strategies.push('Loyalty points bonus');
    } else if (riskScore > 20) {
      strategies.push('Regular check-in communication');
      strategies.push('New product notifications');
      strategies.push('Seasonal offers');
    }

    return strategies;
  }
}

// Loyalty Program Utilities
export class LoyaltyUtils {
  /**
   * Calculate loyalty tier from total points earned
   */
  static calculateTier(totalPoints: number): LoyaltyTier {
    const thresholds = LOYALTY_CONFIG.TIER_THRESHOLDS;

    if (totalPoints >= thresholds.DIAMOND) return 'DIAMOND';
    if (totalPoints >= thresholds.PLATINUM) return 'PLATINUM';
    if (totalPoints >= thresholds.GOLD) return 'GOLD';
    if (totalPoints >= thresholds.SILVER) return 'SILVER';
    return 'BRONZE';
  }

  /**
   * Get next tier information
   */
  static getNextTierInfo(currentPoints: number) {
    const currentTier = this.calculateTier(currentPoints);
    const tierNames: LoyaltyTier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
    const currentTierIndex = tierNames.indexOf(currentTier);

    if (currentTierIndex === tierNames.length - 1) {
      return {
        nextTier: null,
        pointsNeeded: 0,
        progress: 100,
        currentTierThreshold: LOYALTY_CONFIG.TIER_THRESHOLDS[currentTier],
        nextTierThreshold: null,
      };
    }

    const nextTier = tierNames[currentTierIndex + 1];
    const nextTierThreshold = LOYALTY_CONFIG.TIER_THRESHOLDS[nextTier];
    const currentTierThreshold = LOYALTY_CONFIG.TIER_THRESHOLDS[currentTier];

    const pointsNeeded = nextTierThreshold - currentPoints;
    const progress = Math.round(
      ((currentPoints - currentTierThreshold) / (nextTierThreshold - currentTierThreshold)) * 100
    );

    return {
      nextTier,
      pointsNeeded,
      progress: Math.max(0, progress),
      currentTierThreshold,
      nextTierThreshold,
    };
  }

  /**
   * Calculate points to earn from purchase amount
   */
  static calculatePointsFromPurchase(amount: number, segment: CustomerSegment): number {
    const basePoints = Math.floor(amount * LOYALTY_CONFIG.POINTS_PER_AED);
    const multiplier = LOYALTY_CONFIG.SEGMENT_MULTIPLIERS[segment] || 1;
    return Math.round(basePoints * multiplier);
  }

  /**
   * Get tier upgrade bonus
   */
  static getTierUpgradeBonus(tier: LoyaltyTier): number {
    return LOYALTY_CONFIG.TIER_BONUSES[tier] || 0;
  }

  /**
   * Check if points are expiring soon
   */
  static arePointsExpiring(earnedDate: Date, daysThreshold: number = 30): boolean {
    const expiryDate = new Date(earnedDate);
    expiryDate.setDate(expiryDate.getDate() + LOYALTY_CONFIG.POINTS_EXPIRY_DAYS);

    const warningDate = new Date(expiryDate);
    warningDate.setDate(warningDate.getDate() - daysThreshold);

    return new Date() >= warningDate && new Date() < expiryDate;
  }

  /**
   * Get tier color for UI
   */
  static getTierColor(tier: LoyaltyTier): string {
    const colors = {
      BRONZE: '#CD7F32',
      SILVER: '#C0C0C0',
      GOLD: '#FFD700',
      PLATINUM: '#E5E4E2',
      DIAMOND: '#B9F2FF'
    };
    return colors[tier];
  }
}

// Communication Utilities
export class CommunicationUtils {
  /**
   * Apply template variables to content
   */
  static applyTemplateVariables(
    content: string,
    variables: Record<string, string>,
    customer: {
      name: string;
      nameArabic?: string;
      email?: string;
      phone?: string;
      loyaltyPoints?: number;
      loyaltyTier?: string;
    }
  ): string {
    let result = content;

    // Default customer variables
    const defaultVariables = {
      name: customer.name || '',
      nameArabic: customer.nameArabic || '',
      email: customer.email || '',
      phone: customer.phone || '',
      loyaltyPoints: String(customer.loyaltyPoints || 0),
      loyaltyTier: customer.loyaltyTier || 'BRONZE',
      currentDate: new Date().toLocaleDateString('en-AE'),
      currentDateArabic: new Date().toLocaleDateString('ar-AE'),
    };

    // Merge with provided variables
    const allVariables = { ...defaultVariables, ...variables };

    // Replace all variables
    Object.entries(allVariables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      result = result.replace(regex, String(value));
    });

    return result;
  }

  /**
   * Get communication preferences based on customer data
   */
  static getPreferredCommunicationMethod(customer: {
    email?: string;
    phone?: string;
    language: string;
    age?: number;
    segment: CustomerSegment;
  }): 'EMAIL' | 'SMS' | 'WHATSAPP' {
    // VIP customers prefer personal touch
    if (customer.segment === 'VIP') {
      return 'WHATSAPP';
    }

    // Younger customers prefer WhatsApp/SMS
    if (customer.age && customer.age < 35) {
      return customer.phone ? 'WHATSAPP' : 'EMAIL';
    }

    // Default to email if available, otherwise SMS
    return customer.email ? 'EMAIL' : 'SMS';
  }

  /**
   * Generate personalized subject line
   */
  static generatePersonalizedSubject(
    baseSubject: string,
    customer: {
      name: string;
      loyaltyTier: string;
      language: string;
    }
  ): string {
    const firstName = customer.name.split(' ')[0];

    if (customer.language === 'ar') {
      return `مرحباً ${firstName} - ${baseSubject}`;
    }

    if (customer.loyaltyTier === 'VIP' || customer.loyaltyTier === 'DIAMOND') {
      return `Exclusive for ${firstName}: ${baseSubject}`;
    }

    return `Hi ${firstName}, ${baseSubject}`;
  }
}

// Support Utilities
export class SupportUtils {
  /**
   * Generate ticket number
   */
  static generateTicketNumber(count: number): string {
    return `TKT-${String(count + 1).padStart(6, '0')}`;
  }

  /**
   * Check if ticket is overdue based on SLA
   */
  static isTicketOverdue(
    createdAt: Date,
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  ): boolean {
    const now = new Date();
    const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    const slaHours = SUPPORT_SLA[priority];
    return diffHours > slaHours;
  }

  /**
   * Calculate time remaining for SLA
   */
  static getTimeRemainingForSLA(
    createdAt: Date,
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  ): {
    hours: number;
    minutes: number;
    isOverdue: boolean;
  } {
    const now = new Date();
    const slaHours = SUPPORT_SLA[priority];
    const slaEndTime = new Date(createdAt.getTime() + slaHours * 60 * 60 * 1000);

    const diffMs = slaEndTime.getTime() - now.getTime();
    const isOverdue = diffMs < 0;

    const absDiffMs = Math.abs(diffMs);
    const hours = Math.floor(absDiffMs / (1000 * 60 * 60));
    const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes, isOverdue };
  }

  /**
   * Get priority color for UI
   */
  static getPriorityColor(priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'): string {
    const colors = {
      CRITICAL: '#DC2626',
      HIGH: '#EA580C',
      MEDIUM: '#D97706',
      LOW: '#65A30D'
    };
    return colors[priority];
  }
}

// Analytics Utilities
export class AnalyticsUtils {
  /**
   * Calculate Customer Lifetime Value
   */
  static calculateCLV(
    totalSpent: number,
    orderCount: number,
    customerAge: number, // in months
    averageMargin: number = 0.3
  ): {
    historicalValue: number;
    predictedValue: number;
    monthlyValue: number;
  } {
    const monthlyValue = customerAge > 0 ? totalSpent / customerAge : 0;
    const historicalValue = totalSpent * averageMargin;

    // Simple CLV prediction: current monthly spend * 24 months * retention probability
    const retentionProbability = Math.min(0.9, orderCount / 10); // Max 90% retention
    const predictedValue = monthlyValue * 24 * retentionProbability * averageMargin;

    return {
      historicalValue,
      predictedValue,
      monthlyValue,
    };
  }

  /**
   * Calculate purchase frequency
   */
  static calculatePurchaseFrequency(
    orderCount: number,
    firstOrderDate: Date,
    lastOrderDate: Date
  ): number {
    if (orderCount <= 1) return 0;

    const monthsBetween = (
      lastOrderDate.getTime() - firstOrderDate.getTime()
    ) / (1000 * 60 * 60 * 24 * 30);

    return monthsBetween > 0 ? orderCount / monthsBetween : 0;
  }

  /**
   * Segment customers based on RFM analysis
   */
  static segmentCustomerRFM(
    daysSinceLastOrder: number,
    orderCount: number,
    totalSpent: number
  ): {
    segment: string;
    score: number;
    description: string;
  } {
    // Simple RFM scoring (1-5 scale)
    let recencyScore = 5;
    if (daysSinceLastOrder > 365) recencyScore = 1;
    else if (daysSinceLastOrder > 180) recencyScore = 2;
    else if (daysSinceLastOrder > 90) recencyScore = 3;
    else if (daysSinceLastOrder > 30) recencyScore = 4;

    let frequencyScore = 1;
    if (orderCount > 20) frequencyScore = 5;
    else if (orderCount > 10) frequencyScore = 4;
    else if (orderCount > 5) frequencyScore = 3;
    else if (orderCount > 2) frequencyScore = 2;

    let monetaryScore = 1;
    if (totalSpent > 10000) monetaryScore = 5;
    else if (totalSpent > 5000) monetaryScore = 4;
    else if (totalSpent > 2000) monetaryScore = 3;
    else if (totalSpent > 500) monetaryScore = 2;

    const totalScore = recencyScore + frequencyScore + monetaryScore;

    // Determine segment
    let segment: string;
    let description: string;

    if (recencyScore >= 4 && frequencyScore >= 4 && monetaryScore >= 4) {
      segment = 'Champions';
      description = 'Best customers who bought recently, buy often and spend the most';
    } else if (recencyScore >= 3 && frequencyScore >= 3 && monetaryScore >= 3) {
      segment = 'Loyal Customers';
      description = 'Consistent customers with good spending and frequency';
    } else if (recencyScore >= 4 && frequencyScore <= 2) {
      segment = 'New Customers';
      description = 'Recent customers with low frequency';
    } else if (recencyScore <= 2 && frequencyScore >= 3) {
      segment = 'At Risk';
      description = 'Were frequent customers but haven\'t bought recently';
    } else if (recencyScore <= 2 && frequencyScore <= 2 && monetaryScore >= 3) {
      segment = 'Cannot Lose Them';
      description = 'High spending customers who haven\'t bought recently';
    } else {
      segment = 'Others';
      description = 'Regular customers requiring attention';
    }

    return { segment, score: totalScore, description };
  }
}

// Formatting Utilities
export class FormatUtils {
  /**
   * Format currency in AED
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Format number with thousands separator
   */
  static formatNumber(num: number): string {
    return new Intl.NumberFormat('en-AE').format(num);
  }

  /**
   * Format date based on user preference
   */
  static formatDate(date: Date, language: 'en' | 'ar' = 'en'): string {
    const locale = language === 'ar' ? 'ar-AE' : 'en-AE';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  /**
   * Format relative time (e.g., "2 days ago")
   */
  static formatRelativeTime(date: Date, language: 'en' | 'ar' = 'en'): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const locale = language === 'ar' ? 'ar-AE' : 'en-AE';

    if (diffMinutes < 60) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
        .format(-diffMinutes, 'minute');
    } else if (diffHours < 24) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
        .format(-diffHours, 'hour');
    } else {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
        .format(-diffDays, 'day');
    }
  }
}

// Validation Utilities
export class ValidationUtils {
  /**
   * Validate Emirates ID
   */
  static isValidEmiratesID(id: string): boolean {
    const regex = /^784-[0-9]{4}-[0-9]{7}-[0-9]$/;
    return regex.test(id);
  }

  /**
   * Validate UAE trade license
   */
  static isValidTradeLicense(license: string): boolean {
    // Basic validation - starts with emirate code and has numeric part
    const regex = /^[A-Z]{2,3}[0-9]{6,}$/;
    return regex.test(license.replace(/[-\s]/g, ''));
  }

  /**
   * Validate UAE VAT number
   */
  static isValidVATNumber(vat: string): boolean {
    const regex = /^1[0-9]{14}$/;
    return regex.test(vat.replace(/[-\s]/g, ''));
  }

  /**
   * Validate email with Arabic domain support
   */
  static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

// Export all utilities
export {
  LOYALTY_CONFIG,
  SUPPORT_SLA,
  UAE_PHONE_REGEX,
  UAE_EMIRATES,
};