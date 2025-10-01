import { NextRequest, NextResponse } from 'next/server';

export interface LoyaltyTier {
  id: string;
  name: string;
  nameArabic: string;
  level: number;
  color: string;
  icon: string;
  requirements: {
    minSpending: number;
    minTransactions: number;
    timeframeMonths: number;
    additionalCriteria?: {
      referrals?: number;
      reviews?: number;
      socialEngagement?: number;
    };
  };
  benefits: {
    pointsMultiplier: number; // Base points earning multiplier
    discountPercentage: number; // Automatic discount on purchases
    freeShipping: boolean;
    earlyAccess: boolean;
    exclusiveProducts: boolean;
    personalShopper: boolean;
    prioritySupport: boolean;
    birthdayBonus: number; // Bonus points for birthday month
    welcomeBonus: number; // Points for reaching tier
    renewalBonus: number; // Annual tier renewal bonus
  };
  privileges: {
    freeGiftWrapping: boolean;
    freeProductSamples: boolean;
    inviteOnlyEvents: boolean;
    vipLounge: boolean;
    conciergeService: boolean;
    customEngraving: boolean;
    extendedReturns: number; // Days for returns
    priceMatching: boolean;
  };
  seasonalBenefits: {
    ramadanBonus: number;
    eidSpecialDiscount: number;
    nationalDayPromo: number;
    blackFridayEarlyAccess: boolean;
  };
  cashback: {
    enabled: boolean;
    percentage: number;
    maxMonthly: number;
    categories?: string[]; // Specific categories for enhanced cashback
  };
  validityMonths: number;
  degradationRules: {
    warningMonths: number; // Months before tier expires
    gracePeriodMonths: number; // Grace period to maintain tier
    downgradeTo?: string; // Tier to downgrade to
  };
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  type: 'earn' | 'redeem' | 'bonus' | 'penalty' | 'transfer' | 'expire';
  points: number;
  amount?: number; // Transaction amount that generated points
  description: string;
  descriptionArabic?: string;
  source: 'purchase' | 'bonus' | 'referral' | 'review' | 'social' | 'birthday' | 'welcome' | 'manual';
  metadata: {
    transactionId?: string;
    orderId?: string;
    productIds?: string[];
    campaignId?: string;
    referralId?: string;
    expiresAt?: string;
    tierAtTime?: string;
  };
  status: 'pending' | 'approved' | 'cancelled' | 'expired';
  createdAt: string;
  processedAt?: string;
  expiresAt?: string;
}

export interface CustomerLoyaltyProfile {
  customerId: string;
  currentTier: string;
  points: {
    total: number;
    available: number;
    pending: number;
    expired: number;
    lifetime: number;
  };
  spending: {
    totalLifetime: number;
    currentPeriod: number;
    averageOrderValue: number;
    lastPurchaseDate?: string;
    transactionCount: number;
  };
  status: {
    isActive: boolean;
    nextTier?: string;
    progressToNext: {
      spendingNeeded: number;
      transactionsNeeded: number;
      percentage: number;
    };
    tierExpiry?: string;
    lastActivity: string;
  };
  achievements: Array<{
    id: string;
    name: string;
    unlockedAt: string;
    points: number;
  }>;
  referrals: {
    totalReferred: number;
    successfulReferrals: number;
    referralBonus: number;
  };
  preferences: {
    communicationMethod: 'email' | 'sms' | 'push' | 'whatsapp';
    language: 'en' | 'ar';
    marketingConsent: boolean;
    categories: string[];
  };
  engagementScore: number; // 0-100 score based on activity
  createdAt: string;
  updatedAt: string;
}

// Loyalty tier definitions
const loyaltyTiers: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Member',
    nameArabic: 'عضو برونزي',
    level: 1,
    color: '#CD7F32',
    icon: '🥉',
    requirements: {
      minSpending: 0,
      minTransactions: 0,
      timeframeMonths: 12
    },
    benefits: {
      pointsMultiplier: 1.0,
      discountPercentage: 0,
      freeShipping: false,
      earlyAccess: false,
      exclusiveProducts: false,
      personalShopper: false,
      prioritySupport: false,
      birthdayBonus: 50,
      welcomeBonus: 100,
      renewalBonus: 0
    },
    privileges: {
      freeGiftWrapping: false,
      freeProductSamples: true,
      inviteOnlyEvents: false,
      vipLounge: false,
      conciergeService: false,
      customEngraving: false,
      extendedReturns: 7,
      priceMatching: false
    },
    seasonalBenefits: {
      ramadanBonus: 100,
      eidSpecialDiscount: 5,
      nationalDayPromo: 5,
      blackFridayEarlyAccess: false
    },
    cashback: {
      enabled: false,
      percentage: 0,
      maxMonthly: 0
    },
    validityMonths: 12,
    degradationRules: {
      warningMonths: 2,
      gracePeriodMonths: 1
    }
  },
  {
    id: 'silver',
    name: 'Silver Member',
    nameArabic: 'عضو فضي',
    level: 2,
    color: '#C0C0C0',
    icon: '🥈',
    requirements: {
      minSpending: 2500,
      minTransactions: 10,
      timeframeMonths: 12
    },
    benefits: {
      pointsMultiplier: 1.2,
      discountPercentage: 3,
      freeShipping: true,
      earlyAccess: false,
      exclusiveProducts: false,
      personalShopper: false,
      prioritySupport: true,
      birthdayBonus: 150,
      welcomeBonus: 300,
      renewalBonus: 200
    },
    privileges: {
      freeGiftWrapping: true,
      freeProductSamples: true,
      inviteOnlyEvents: false,
      vipLounge: false,
      conciergeService: false,
      customEngraving: false,
      extendedReturns: 14,
      priceMatching: true
    },
    seasonalBenefits: {
      ramadanBonus: 250,
      eidSpecialDiscount: 8,
      nationalDayPromo: 8,
      blackFridayEarlyAccess: true
    },
    cashback: {
      enabled: true,
      percentage: 1,
      maxMonthly: 50
    },
    validityMonths: 12,
    degradationRules: {
      warningMonths: 2,
      gracePeriodMonths: 1,
      downgradeTo: 'bronze'
    }
  },
  {
    id: 'gold',
    name: 'Gold Member',
    nameArabic: 'عضو ذهبي',
    level: 3,
    color: '#FFD700',
    icon: '🥇',
    requirements: {
      minSpending: 7500,
      minTransactions: 25,
      timeframeMonths: 12,
      additionalCriteria: {
        referrals: 2
      }
    },
    benefits: {
      pointsMultiplier: 1.5,
      discountPercentage: 6,
      freeShipping: true,
      earlyAccess: true,
      exclusiveProducts: true,
      personalShopper: false,
      prioritySupport: true,
      birthdayBonus: 300,
      welcomeBonus: 600,
      renewalBonus: 500
    },
    privileges: {
      freeGiftWrapping: true,
      freeProductSamples: true,
      inviteOnlyEvents: true,
      vipLounge: false,
      conciergeService: false,
      customEngraving: true,
      extendedReturns: 30,
      priceMatching: true
    },
    seasonalBenefits: {
      ramadanBonus: 500,
      eidSpecialDiscount: 12,
      nationalDayPromo: 12,
      blackFridayEarlyAccess: true
    },
    cashback: {
      enabled: true,
      percentage: 2,
      maxMonthly: 150,
      categories: ['Premium Oud', 'Luxury Perfumes']
    },
    validityMonths: 12,
    degradationRules: {
      warningMonths: 2,
      gracePeriodMonths: 1,
      downgradeTo: 'silver'
    }
  },
  {
    id: 'platinum',
    name: 'Platinum Member',
    nameArabic: 'عضو بلاتيني',
    level: 4,
    color: '#E5E4E2',
    icon: '💎',
    requirements: {
      minSpending: 20000,
      minTransactions: 50,
      timeframeMonths: 12,
      additionalCriteria: {
        referrals: 5,
        reviews: 10
      }
    },
    benefits: {
      pointsMultiplier: 2.0,
      discountPercentage: 10,
      freeShipping: true,
      earlyAccess: true,
      exclusiveProducts: true,
      personalShopper: true,
      prioritySupport: true,
      birthdayBonus: 500,
      welcomeBonus: 1200,
      renewalBonus: 1000
    },
    privileges: {
      freeGiftWrapping: true,
      freeProductSamples: true,
      inviteOnlyEvents: true,
      vipLounge: true,
      conciergeService: true,
      customEngraving: true,
      extendedReturns: 60,
      priceMatching: true
    },
    seasonalBenefits: {
      ramadanBonus: 1000,
      eidSpecialDiscount: 15,
      nationalDayPromo: 15,
      blackFridayEarlyAccess: true
    },
    cashback: {
      enabled: true,
      percentage: 3,
      maxMonthly: 500,
      categories: ['Premium Oud', 'Luxury Perfumes', 'Accessories']
    },
    validityMonths: 12,
    degradationRules: {
      warningMonths: 3,
      gracePeriodMonths: 2,
      downgradeTo: 'gold'
    }
  },
  {
    id: 'diamond',
    name: 'Diamond Elite',
    nameArabic: 'النخبة الماسية',
    level: 5,
    color: '#B9F2FF',
    icon: '💎✨',
    requirements: {
      minSpending: 50000,
      minTransactions: 100,
      timeframeMonths: 12,
      additionalCriteria: {
        referrals: 10,
        reviews: 25,
        socialEngagement: 100
      }
    },
    benefits: {
      pointsMultiplier: 3.0,
      discountPercentage: 15,
      freeShipping: true,
      earlyAccess: true,
      exclusiveProducts: true,
      personalShopper: true,
      prioritySupport: true,
      birthdayBonus: 1000,
      welcomeBonus: 2500,
      renewalBonus: 2000
    },
    privileges: {
      freeGiftWrapping: true,
      freeProductSamples: true,
      inviteOnlyEvents: true,
      vipLounge: true,
      conciergeService: true,
      customEngraving: true,
      extendedReturns: 90,
      priceMatching: true
    },
    seasonalBenefits: {
      ramadanBonus: 2000,
      eidSpecialDiscount: 20,
      nationalDayPromo: 20,
      blackFridayEarlyAccess: true
    },
    cashback: {
      enabled: true,
      percentage: 5,
      maxMonthly: 1000
    },
    validityMonths: 24, // Longer validity for top tier
    degradationRules: {
      warningMonths: 6,
      gracePeriodMonths: 3,
      downgradeTo: 'platinum'
    }
  }
];

// Mock customer loyalty profiles
const mockLoyaltyProfiles: CustomerLoyaltyProfile[] = [
  {
    customerId: 'cust_001',
    currentTier: 'gold',
    points: {
      total: 12500,
      available: 12000,
      pending: 300,
      expired: 200,
      lifetime: 25000
    },
    spending: {
      totalLifetime: 15000,
      currentPeriod: 8500,
      averageOrderValue: 425,
      lastPurchaseDate: '2024-06-25T00:00:00Z',
      transactionCount: 35
    },
    status: {
      isActive: true,
      nextTier: 'platinum',
      progressToNext: {
        spendingNeeded: 11500,
        transactionsNeeded: 15,
        percentage: 42.5
      },
      tierExpiry: '2025-01-15T00:00:00Z',
      lastActivity: '2024-06-25T10:30:00Z'
    },
    achievements: [
      {
        id: 'first_purchase',
        name: 'First Purchase',
        unlockedAt: '2024-01-15T00:00:00Z',
        points: 100
      },
      {
        id: 'tier_gold',
        name: 'Gold Member',
        unlockedAt: '2024-05-01T00:00:00Z',
        points: 600
      }
    ],
    referrals: {
      totalReferred: 3,
      successfulReferrals: 2,
      referralBonus: 600
    },
    preferences: {
      communicationMethod: 'email',
      language: 'en',
      marketingConsent: true,
      categories: ['Premium Oud', 'Floral']
    },
    engagementScore: 85,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-25T10:30:00Z'
  }
];

// Calculate points earned from purchase
function calculatePointsEarned(amount: number, tier: string, isSpecialCategory = false): number {
  const tierData = loyaltyTiers.find(t => t.id === tier);
  if (!tierData) return Math.floor(amount * 0.01 * 10); // Default 1% = 10 points per AED

  let basePoints = Math.floor(amount * 0.01 * 10); // 1% base rate
  let multipliedPoints = basePoints * tierData.benefits.pointsMultiplier;

  // Special category bonus
  if (isSpecialCategory && tierData.cashback.categories) {
    multipliedPoints *= 1.5;
  }

  return Math.floor(multipliedPoints);
}

// Check tier eligibility
function checkTierEligibility(profile: CustomerLoyaltyProfile): {
  eligible: boolean;
  nextTier?: LoyaltyTier;
  requirements: any;
} {
  const currentTierData = loyaltyTiers.find(t => t.id === profile.currentTier);
  if (!currentTierData) {
    return { eligible: false, requirements: {} };
  }

  const nextTierLevel = currentTierData.level + 1;
  const nextTier = loyaltyTiers.find(t => t.level === nextTierLevel);

  if (!nextTier) {
    return { eligible: false, requirements: {} };
  }

  const meetsSpending = profile.spending.currentPeriod >= nextTier.requirements.minSpending;
  const meetsTransactions = profile.spending.transactionCount >= nextTier.requirements.minTransactions;

  let meetsAdditional = true;
  const additionalRequirements: any = {};

  if (nextTier.requirements.additionalCriteria) {
    const criteria = nextTier.requirements.additionalCriteria;

    if (criteria.referrals) {
      const meetsReferrals = profile.referrals.successfulReferrals >= criteria.referrals;
      meetsAdditional = meetsAdditional && meetsReferrals;
      additionalRequirements.referrals = {
        required: criteria.referrals,
        current: profile.referrals.successfulReferrals,
        met: meetsReferrals
      };
    }

    // Add other criteria checks here
  }

  const eligible = meetsSpending && meetsTransactions && meetsAdditional;

  return {
    eligible,
    nextTier: eligible ? nextTier : undefined,
    requirements: {
      spending: {
        required: nextTier.requirements.minSpending,
        current: profile.spending.currentPeriod,
        met: meetsSpending
      },
      transactions: {
        required: nextTier.requirements.minTransactions,
        current: profile.spending.transactionCount,
        met: meetsTransactions
      },
      ...additionalRequirements
    }
  };
}

// Process tier upgrade
function processTierUpgrade(profile: CustomerLoyaltyProfile, newTier: LoyaltyTier): LoyaltyTransaction {
  return {
    id: `upgrade_${Date.now()}`,
    customerId: profile.customerId,
    type: 'bonus',
    points: newTier.benefits.welcomeBonus,
    description: `Tier upgrade to ${newTier.name}`,
    descriptionArabic: `ترقية المستوى إلى ${newTier.nameArabic}`,
    source: 'welcome',
    metadata: {
      tierAtTime: newTier.id
    },
    status: 'approved',
    createdAt: new Date().toISOString(),
    processedAt: new Date().toISOString()
  };
}

// Calculate cashback
function calculateCashback(amount: number, tier: string, categories: string[]): number {
  const tierData = loyaltyTiers.find(t => t.id === tier);
  if (!tierData || !tierData.cashback.enabled) return 0;

  let cashbackRate = tierData.cashback.percentage / 100;

  // Enhanced cashback for specific categories
  if (tierData.cashback.categories) {
    const hasSpecialCategory = categories.some(cat =>
      tierData.cashback.categories!.includes(cat)
    );
    if (hasSpecialCategory) {
      cashbackRate *= 1.5; // 1.5x multiplier for special categories
    }
  }

  const cashback = amount * cashbackRate;
  return Math.min(cashback, tierData.cashback.maxMonthly);
}

// GET endpoint - Get loyalty program information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const action = searchParams.get('action');

    if (action === 'tiers') {
      // Return tier information
      const tierInfo = loyaltyTiers.map(tier => ({
        id: tier.id,
        name: tier.name,
        nameArabic: tier.nameArabic,
        level: tier.level,
        color: tier.color,
        icon: tier.icon,
        requirements: tier.requirements,
        benefits: tier.benefits,
        privileges: tier.privileges,
        seasonalBenefits: tier.seasonalBenefits,
        cashback: tier.cashback
      }));

      return NextResponse.json({
        tiers: tierInfo,
        program: {
          name: 'Oud Premium Loyalty',
          nameArabic: 'برنامج ولاء العود المميز',
          currency: 'AED',
          pointsPerAED: 10, // 10 points per 1 AED spent
          redemptionRate: 0.1 // 1 point = 0.1 AED
        }
      });
    }

    if (customerId) {
      // Get customer loyalty profile
      const profile = mockLoyaltyProfiles.find(p => p.customerId === customerId);

      if (!profile) {
        return NextResponse.json(
          { error: 'Customer loyalty profile not found' },
          { status: 404 }
        );
      }

      // Check tier eligibility
      const eligibility = checkTierEligibility(profile);

      // Get tier benefits
      const currentTierData = loyaltyTiers.find(t => t.id === profile.currentTier);

      return NextResponse.json({
        profile,
        tierData: currentTierData,
        eligibility,
        nextMilestones: {
          nextTier: eligibility.nextTier?.name,
          spendingNeeded: Math.max(0, (eligibility.nextTier?.requirements.minSpending || 0) - profile.spending.currentPeriod),
          transactionsNeeded: Math.max(0, (eligibility.nextTier?.requirements.minTransactions || 0) - profile.spending.transactionCount)
        }
      });
    }

    // Return general program information
    return NextResponse.json({
      program: {
        name: 'Oud Premium Loyalty Program',
        nameArabic: 'برنامج ولاء العود المميز',
        description: 'Earn points, unlock tiers, and enjoy exclusive benefits',
        currency: 'AED',
        pointsPerAED: 10,
        redemptionRate: 0.1,
        features: [
          'Tier-based benefits',
          'Points earning and redemption',
          'Cashback rewards',
          'Exclusive access',
          'Seasonal bonuses',
          'Referral rewards'
        ]
      },
      tiers: loyaltyTiers.length,
      totalMembers: 15000, // Mock data
      pointsIssued: 2500000, // Mock data
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get loyalty program error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve loyalty program information' },
      { status: 500 }
    );
  }
}

// POST endpoint - Process loyalty transactions
export async function POST(request: NextRequest) {
  try {
    const { action, customerId, ...data } = await request.json();

    const profile = mockLoyaltyProfiles.find(p => p.customerId === customerId);
    if (!profile) {
      return NextResponse.json(
        { error: 'Customer loyalty profile not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'earn_points': {
        const { amount, categories = [], transactionId, specialEvent } = data;

        // Calculate points earned
        const pointsEarned = calculatePointsEarned(
          amount,
          profile.currentTier,
          categories.some(cat => ['Premium Oud', 'Luxury Perfumes'].includes(cat))
        );

        // Apply seasonal bonuses
        let bonusPoints = 0;
        const currentMonth = new Date().getMonth() + 1;
        const tierData = loyaltyTiers.find(t => t.id === profile.currentTier);

        if (specialEvent === 'ramadan' && tierData) {
          bonusPoints += tierData.seasonalBenefits.ramadanBonus;
        }

        // Calculate cashback
        const cashback = calculateCashback(amount, profile.currentTier, categories);

        const transaction: LoyaltyTransaction = {
          id: `earn_${Date.now()}`,
          customerId,
          type: 'earn',
          points: pointsEarned + bonusPoints,
          amount,
          description: `Points earned from purchase`,
          source: 'purchase',
          metadata: {
            transactionId,
            tierAtTime: profile.currentTier,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
          },
          status: 'approved',
          createdAt: new Date().toISOString(),
          processedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        };

        // Update profile
        profile.points.total += transaction.points;
        profile.points.available += transaction.points;
        profile.points.lifetime += transaction.points;
        profile.spending.totalLifetime += amount;
        profile.spending.currentPeriod += amount;
        profile.spending.transactionCount += 1;
        profile.spending.lastPurchaseDate = new Date().toISOString();

        // Check for tier upgrade
        const eligibility = checkTierEligibility(profile);
        let upgradeTransaction;

        if (eligibility.eligible && eligibility.nextTier) {
          profile.currentTier = eligibility.nextTier.id;
          upgradeTransaction = processTierUpgrade(profile, eligibility.nextTier);
          profile.points.total += upgradeTransaction.points;
          profile.points.available += upgradeTransaction.points;
        }

        return NextResponse.json({
          success: true,
          transaction,
          upgradeTransaction,
          pointsEarned: transaction.points,
          cashback,
          newTier: upgradeTransaction ? profile.currentTier : null,
          profile: {
            points: profile.points,
            currentTier: profile.currentTier,
            nextTier: eligibility.nextTier?.id
          }
        });
      }

      case 'redeem_points': {
        const { points, redemptionType = 'discount', metadata = {} } = data;

        if (points > profile.points.available) {
          return NextResponse.json(
            { error: 'Insufficient points' },
            { status: 400 }
          );
        }

        const redemptionValue = points * 0.1; // 1 point = 0.1 AED

        const transaction: LoyaltyTransaction = {
          id: `redeem_${Date.now()}`,
          customerId,
          type: 'redeem',
          points: -points,
          description: `Points redeemed for ${redemptionType}`,
          source: 'manual',
          metadata: {
            redemptionType,
            redemptionValue,
            ...metadata
          },
          status: 'approved',
          createdAt: new Date().toISOString(),
          processedAt: new Date().toISOString()
        };

        // Update profile
        profile.points.available -= points;
        profile.status.lastActivity = new Date().toISOString();

        return NextResponse.json({
          success: true,
          transaction,
          redemptionValue,
          pointsRedeemed: points,
          remainingPoints: profile.points.available
        });
      }

      case 'birthday_bonus': {
        const tierData = loyaltyTiers.find(t => t.id === profile.currentTier);
        if (!tierData) {
          return NextResponse.json(
            { error: 'Invalid tier' },
            { status: 400 }
          );
        }

        const bonusPoints = tierData.benefits.birthdayBonus;

        const transaction: LoyaltyTransaction = {
          id: `birthday_${Date.now()}`,
          customerId,
          type: 'bonus',
          points: bonusPoints,
          description: 'Birthday bonus points',
          descriptionArabic: 'نقاط مكافأة عيد الميلاد',
          source: 'birthday',
          metadata: {
            tierAtTime: profile.currentTier
          },
          status: 'approved',
          createdAt: new Date().toISOString(),
          processedAt: new Date().toISOString()
        };

        // Update profile
        profile.points.total += bonusPoints;
        profile.points.available += bonusPoints;

        return NextResponse.json({
          success: true,
          transaction,
          bonusPoints,
          message: 'Happy Birthday! Bonus points added to your account.'
        });
      }

      case 'referral_bonus': {
        const { referralCustomerId } = data;
        const referralBonus = 500; // Fixed referral bonus

        const transaction: LoyaltyTransaction = {
          id: `referral_${Date.now()}`,
          customerId,
          type: 'bonus',
          points: referralBonus,
          description: 'Referral bonus points',
          source: 'referral',
          metadata: {
            referralId: referralCustomerId
          },
          status: 'approved',
          createdAt: new Date().toISOString(),
          processedAt: new Date().toISOString()
        };

        // Update profile
        profile.points.total += referralBonus;
        profile.points.available += referralBonus;
        profile.referrals.totalReferred += 1;
        profile.referrals.successfulReferrals += 1;
        profile.referrals.referralBonus += referralBonus;

        return NextResponse.json({
          success: true,
          transaction,
          referralBonus,
          message: 'Referral bonus added successfully!'
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Loyalty program processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process loyalty transaction' },
      { status: 500 }
    );
  }
}

// PUT endpoint - Update loyalty profile
export async function PUT(request: NextRequest) {
  try {
    const { customerId, ...updates } = await request.json();

    const profileIndex = mockLoyaltyProfiles.findIndex(p => p.customerId === customerId);
    if (profileIndex === -1) {
      return NextResponse.json(
        { error: 'Customer loyalty profile not found' },
        { status: 404 }
      );
    }

    // Update profile
    mockLoyaltyProfiles[profileIndex] = {
      ...mockLoyaltyProfiles[profileIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      profile: mockLoyaltyProfiles[profileIndex],
      message: 'Loyalty profile updated successfully'
    });

  } catch (error) {
    console.error('Update loyalty profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update loyalty profile' },
      { status: 500 }
    );
  }
}