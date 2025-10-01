import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { LoyaltyTier } from '@/types/crm';

// Loyalty tier thresholds (points required)
const TIER_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 1000,
  GOLD: 5000,
  PLATINUM: 15000,
  DIAMOND: 50000,
};

// Points earning rates
const POINTS_PER_AED = 1; // 1 point per AED spent
const BONUS_MULTIPLIERS = {
  VIP: 2,
  WHOLESALE: 1.5,
  EXPORT: 1.2,
  REGULAR: 1,
};

const addPointsSchema = z.object({
  customerId: z.string().cuid(),
  points: z.number().int().positive(),
  description: z.string(),
  type: z.enum(['EARN', 'BONUS']).default('EARN'),
  referenceId: z.string().optional(),
  orderId: z.string().cuid().optional(),
});

const redeemPointsSchema = z.object({
  customerId: z.string().cuid(),
  points: z.number().int().positive(),
  description: z.string(),
  referenceId: z.string().optional(),
  orderId: z.string().cuid().optional(),
});

// Helper function to calculate tier from points
function calculateTier(totalPoints: number): LoyaltyTier {
  if (totalPoints >= TIER_THRESHOLDS.DIAMOND) return 'DIAMOND';
  if (totalPoints >= TIER_THRESHOLDS.PLATINUM) return 'PLATINUM';
  if (totalPoints >= TIER_THRESHOLDS.GOLD) return 'GOLD';
  if (totalPoints >= TIER_THRESHOLDS.SILVER) return 'SILVER';
  return 'BRONZE';
}

// Helper function to calculate next tier requirements
function getNextTierInfo(currentPoints: number) {
  const currentTier = calculateTier(currentPoints);
  const tierNames = Object.keys(TIER_THRESHOLDS) as LoyaltyTier[];
  const currentTierIndex = tierNames.indexOf(currentTier);

  if (currentTierIndex === tierNames.length - 1) {
    // Already at highest tier
    return {
      nextTier: null,
      pointsNeeded: 0,
      progress: 100,
    };
  }

  const nextTier = tierNames[currentTierIndex + 1];
  const nextTierThreshold = TIER_THRESHOLDS[nextTier];
  const currentTierThreshold = TIER_THRESHOLDS[currentTier];

  const pointsNeeded = nextTierThreshold - currentPoints;
  const progress = Math.round(
    ((currentPoints - currentTierThreshold) / (nextTierThreshold - currentTierThreshold)) * 100
  );

  return {
    nextTier,
    pointsNeeded,
    progress: Math.max(0, progress),
  };
}

// GET - Get loyalty dashboard stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (customerId) {
      // Get specific customer's loyalty data
      const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
        where: { customerId },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              segment: true,
            },
          },
          pointsHistory: {
            orderBy: { createdAt: 'desc' },
            take: 20,
          },
          rewardsClaimed: {
            include: {
              reward: true,
            },
            orderBy: { claimedAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!loyaltyAccount) {
        return NextResponse.json({ error: 'Loyalty account not found' }, { status: 404 });
      }

      const nextTierInfo = getNextTierInfo(loyaltyAccount.totalEarned);

      return NextResponse.json({
        ...loyaltyAccount,
        nextTierInfo,
      });
    }

    // Get overall loyalty dashboard stats
    const [
      totalMembers,
      activeMembers,
      pointsIssued,
      pointsRedeemed,
      tierDistribution,
      recentTransactions,
      topRewards,
    ] = await Promise.all([
      // Total loyalty members
      prisma.loyaltyAccount.count(),

      // Active members (with activity in last 90 days)
      prisma.loyaltyAccount.count({
        where: {
          customer: {
            orders: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        },
      }),

      // Total points issued
      prisma.loyaltyAccount.aggregate({
        _sum: {
          totalEarned: true,
        },
      }),

      // Total points redeemed
      prisma.loyaltyAccount.aggregate({
        _sum: {
          totalRedeemed: true,
        },
      }),

      // Tier distribution
      prisma.loyaltyAccount.groupBy({
        by: ['tier'],
        _count: {
          tier: true,
        },
      }),

      // Recent transactions
      prisma.loyaltyTransaction.findMany({
        include: {
          account: {
            include: {
              customer: {
                select: {
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Top rewards by claim count
      prisma.reward.findMany({
        include: {
          _count: {
            select: {
              claims: true,
            },
          },
        },
        orderBy: {
          claims: {
            _count: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    const totalMembersCount = await prisma.loyaltyAccount.count();
    const tierDistributionWithPercentage = tierDistribution.map((tier) => ({
      tier: tier.tier,
      count: tier._count.tier,
      percentage: totalMembersCount > 0 ? Math.round((tier._count.tier / totalMembersCount) * 100) : 0,
    }));

    return NextResponse.json({
      totalMembers,
      activeMembers,
      pointsIssued: pointsIssued._sum.totalEarned || 0,
      pointsRedeemed: pointsRedeemed._sum.totalRedeemed || 0,
      tierDistribution: tierDistributionWithPercentage,
      recentTransactions,
      topRewards: topRewards.map((reward) => ({
        id: reward.id,
        name: reward.name,
        pointsCost: reward.pointsCost,
        claimCount: reward._count.claims,
      })),
    });
  } catch (error) {
    console.error('Error fetching loyalty data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loyalty data' },
      { status: 500 }
    );
  }
}

// POST - Add loyalty points
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action;

    if (action === 'add-points') {
      const validatedData = addPointsSchema.parse(body);

      // Get loyalty account
      const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
        where: { customerId: validatedData.customerId },
        include: {
          customer: true,
        },
      });

      if (!loyaltyAccount) {
        return NextResponse.json({ error: 'Loyalty account not found' }, { status: 404 });
      }

      // Calculate points with segment multiplier
      const multiplier = BONUS_MULTIPLIERS[loyaltyAccount.customer.segment as keyof typeof BONUS_MULTIPLIERS] || 1;
      const finalPoints = Math.round(validatedData.points * multiplier);

      // Update loyalty account
      const updatedAccount = await prisma.$transaction(async (tx) => {
        // Add transaction record
        await tx.loyaltyTransaction.create({
          data: {
            accountId: loyaltyAccount.id,
            type: validatedData.type,
            points: finalPoints,
            description: validatedData.description,
            referenceId: validatedData.referenceId,
            orderId: validatedData.orderId,
          },
        });

        // Update account totals
        const newTotalEarned = loyaltyAccount.totalEarned + finalPoints;
        const newPoints = loyaltyAccount.points + finalPoints;
        const newTier = calculateTier(newTotalEarned);
        const nextTierInfo = getNextTierInfo(newTotalEarned);

        const updatedAccount = await tx.loyaltyAccount.update({
          where: { id: loyaltyAccount.id },
          data: {
            points: newPoints,
            totalEarned: newTotalEarned,
            tier: newTier,
            tierProgress: nextTierInfo.progress,
            nextTierPoints: nextTierInfo.pointsNeeded,
          },
        });

        // Check for tier upgrade
        if (newTier !== loyaltyAccount.tier) {
          // Log tier upgrade in customer history
          await tx.customerHistory.create({
            data: {
              customerId: validatedData.customerId,
              eventType: 'LOYALTY_TIER_UPGRADE',
              description: `Loyalty tier upgraded from ${loyaltyAccount.tier} to ${newTier}`,
              createdById: session.user.id,
            },
          });

          // Add bonus points for tier upgrade
          const bonusPoints = getTierUpgradeBonus(newTier);
          if (bonusPoints > 0) {
            await tx.loyaltyTransaction.create({
              data: {
                accountId: loyaltyAccount.id,
                type: 'BONUS',
                points: bonusPoints,
                description: `Tier upgrade bonus: ${newTier}`,
              },
            });

            updatedAccount.points += bonusPoints;
            updatedAccount.totalEarned += bonusPoints;
          }
        }

        return updatedAccount;
      });

      return NextResponse.json({
        success: true,
        loyaltyAccount: updatedAccount,
        pointsAdded: finalPoints,
        multiplier,
      });
    }

    if (action === 'redeem-points') {
      const validatedData = redeemPointsSchema.parse(body);

      // Get loyalty account
      const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
        where: { customerId: validatedData.customerId },
      });

      if (!loyaltyAccount) {
        return NextResponse.json({ error: 'Loyalty account not found' }, { status: 404 });
      }

      if (loyaltyAccount.points < validatedData.points) {
        return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
      }

      // Update loyalty account
      const updatedAccount = await prisma.$transaction(async (tx) => {
        // Add transaction record
        await tx.loyaltyTransaction.create({
          data: {
            accountId: loyaltyAccount.id,
            type: 'REDEEM',
            points: -validatedData.points, // Negative for redemption
            description: validatedData.description,
            referenceId: validatedData.referenceId,
            orderId: validatedData.orderId,
          },
        });

        // Update account totals
        const updatedAccount = await tx.loyaltyAccount.update({
          where: { id: loyaltyAccount.id },
          data: {
            points: loyaltyAccount.points - validatedData.points,
            totalRedeemed: loyaltyAccount.totalRedeemed + validatedData.points,
          },
        });

        return updatedAccount;
      });

      return NextResponse.json({
        success: true,
        loyaltyAccount: updatedAccount,
        pointsRedeemed: validatedData.points,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing loyalty transaction:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process loyalty transaction' },
      { status: 500 }
    );
  }
}

// Helper function for tier upgrade bonuses
function getTierUpgradeBonus(tier: LoyaltyTier): number {
  const bonuses = {
    BRONZE: 0,
    SILVER: 100,
    GOLD: 500,
    PLATINUM: 1500,
    DIAMOND: 5000,
  };
  return bonuses[tier] || 0;
}