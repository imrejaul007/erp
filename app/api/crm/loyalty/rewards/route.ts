import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { LoyaltyTier } from '@/types/crm';

const createRewardSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameArabic: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  descriptionArabic: z.string().optional(),
  type: z.enum(['DISCOUNT', 'FREE_PRODUCT', 'EXCLUSIVE_ACCESS']),
  pointsCost: z.number().int().positive('Points cost must be positive'),
  discountPercent: z.number().min(0).max(100).optional(),
  freeProductId: z.string().cuid().optional(),
  minTier: z.nativeEnum(LoyaltyTier),
  validFrom: z.string().transform((str) => new Date(str)),
  validUntil: z.string().transform((str) => new Date(str)).optional(),
  usageLimit: z.number().int().positive().optional(),
});

const claimRewardSchema = z.object({
  customerId: z.string().cuid(),
  rewardId: z.string().cuid(),
  orderId: z.string().cuid().optional(),
});

// GET - List rewards
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let where: any = {};

    if (activeOnly) {
      where = {
        isActive: true,
        validFrom: { lte: new Date() },
        OR: [
          { validUntil: null },
          { validUntil: { gte: new Date() } },
        ],
      };
    }

    if (customerId) {
      // Get rewards available for specific customer
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          loyaltyAccount: true,
        },
      });

      if (!customer?.loyaltyAccount) {
        return NextResponse.json({ error: 'Customer loyalty account not found' }, { status: 404 });
      }

      const customerTierIndex = getTierIndex(customer.loyaltyAccount.tier);

      const rewards = await prisma.reward.findMany({
        where: {
          ...where,
          // Only show rewards for customer's tier or lower
          minTier: {
            in: getTiersUpToLevel(customerTierIndex),
          },
        },
        include: {
          claims: {
            where: { accountId: customer.loyaltyAccount.id },
            select: {
              id: true,
              status: true,
              claimedAt: true,
              usedAt: true,
              expiresAt: true,
            },
          },
          _count: {
            select: {
              claims: true,
            },
          },
        },
        orderBy: [
          { pointsCost: 'asc' },
          { createdAt: 'desc' },
        ],
      });

      // Add availability information for each reward
      const rewardsWithAvailability = rewards.map((reward) => {
        const customerClaims = reward.claims;
        const canAfford = customer.loyaltyAccount!.points >= reward.pointsCost;
        const hasUsageLimit = reward.usageLimit !== null;
        const usageRemaining = hasUsageLimit
          ? reward.usageLimit! - reward._count.claims
          : null;
        const isUsageLimitReached = hasUsageLimit && usageRemaining! <= 0;

        // Check if customer has already claimed this reward (and it's still active)
        const activeClaim = customerClaims.find(
          (claim) => claim.status === 'ACTIVE' &&
          (!claim.expiresAt || claim.expiresAt > new Date())
        );

        return {
          ...reward,
          canAfford,
          canClaim: canAfford && !isUsageLimitReached && !activeClaim,
          usageRemaining,
          activeClaim,
          totalClaims: reward._count.claims,
        };
      });

      return NextResponse.json(rewardsWithAvailability);
    }

    // Get all rewards (admin view)
    const rewards = await prisma.reward.findMany({
      where,
      include: {
        _count: {
          select: {
            claims: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}

// POST - Create reward or claim reward
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action;

    if (action === 'create') {
      const validatedData = createRewardSchema.parse(body);

      // Validate reward configuration
      if (validatedData.type === 'DISCOUNT' && !validatedData.discountPercent) {
        return NextResponse.json(
          { error: 'Discount percentage is required for discount rewards' },
          { status: 400 }
        );
      }

      if (validatedData.type === 'FREE_PRODUCT' && !validatedData.freeProductId) {
        return NextResponse.json(
          { error: 'Product ID is required for free product rewards' },
          { status: 400 }
        );
      }

      if (validatedData.freeProductId) {
        // Verify product exists
        const product = await prisma.product.findUnique({
          where: { id: validatedData.freeProductId },
        });

        if (!product) {
          return NextResponse.json(
            { error: 'Selected product does not exist' },
            { status: 400 }
          );
        }
      }

      // Create reward
      const reward = await prisma.reward.create({
        data: {
          name: validatedData.name,
          nameArabic: validatedData.nameArabic,
          description: validatedData.description,
          descriptionArabic: validatedData.descriptionArabic,
          type: validatedData.type,
          pointsCost: validatedData.pointsCost,
          discountPercent: validatedData.discountPercent,
          freeProductId: validatedData.freeProductId,
          minTier: validatedData.minTier,
          validFrom: validatedData.validFrom,
          validUntil: validatedData.validUntil,
          usageLimit: validatedData.usageLimit,
        },
      });

      return NextResponse.json(reward, { status: 201 });
    }

    if (action === 'claim') {
      const validatedData = claimRewardSchema.parse(body);

      // Get customer loyalty account
      const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
        where: { customerId: validatedData.customerId },
        include: {
          customer: true,
        },
      });

      if (!loyaltyAccount) {
        return NextResponse.json({ error: 'Loyalty account not found' }, { status: 404 });
      }

      // Get reward
      const reward = await prisma.reward.findUnique({
        where: { id: validatedData.rewardId },
        include: {
          _count: {
            select: {
              claims: true,
            },
          },
          claims: {
            where: { accountId: loyaltyAccount.id },
          },
        },
      });

      if (!reward) {
        return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
      }

      // Validate reward can be claimed
      if (!reward.isActive) {
        return NextResponse.json({ error: 'Reward is not active' }, { status: 400 });
      }

      if (reward.validFrom > new Date()) {
        return NextResponse.json({ error: 'Reward is not yet available' }, { status: 400 });
      }

      if (reward.validUntil && reward.validUntil < new Date()) {
        return NextResponse.json({ error: 'Reward has expired' }, { status: 400 });
      }

      // Check tier requirement
      const customerTierIndex = getTierIndex(loyaltyAccount.tier);
      const rewardTierIndex = getTierIndex(reward.minTier);

      if (customerTierIndex < rewardTierIndex) {
        return NextResponse.json(
          { error: `This reward requires ${reward.minTier} tier or higher` },
          { status: 400 }
        );
      }

      // Check points balance
      if (loyaltyAccount.points < reward.pointsCost) {
        return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
      }

      // Check usage limit
      if (reward.usageLimit && reward._count.claims >= reward.usageLimit) {
        return NextResponse.json({ error: 'Reward usage limit reached' }, { status: 400 });
      }

      // Check if customer already has active claim
      const activeClaim = reward.claims.find(
        (claim) => claim.status === 'ACTIVE' &&
        (!claim.expiresAt || claim.expiresAt > new Date())
      );

      if (activeClaim) {
        return NextResponse.json(
          { error: 'You already have an active claim for this reward' },
          { status: 400 }
        );
      }

      // Process claim
      const result = await prisma.$transaction(async (tx) => {
        // Deduct points
        await tx.loyaltyTransaction.create({
          data: {
            accountId: loyaltyAccount.id,
            type: 'REDEEM',
            points: -reward.pointsCost,
            description: `Redeemed reward: ${reward.name}`,
            referenceId: reward.id,
            orderId: validatedData.orderId,
          },
        });

        await tx.loyaltyAccount.update({
          where: { id: loyaltyAccount.id },
          data: {
            points: loyaltyAccount.points - reward.pointsCost,
            totalRedeemed: loyaltyAccount.totalRedeemed + reward.pointsCost,
          },
        });

        // Create reward claim
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30); // 30 days expiration

        const claim = await tx.rewardClaim.create({
          data: {
            accountId: loyaltyAccount.id,
            rewardId: reward.id,
            pointsUsed: reward.pointsCost,
            orderId: validatedData.orderId,
            expiresAt: expirationDate,
          },
        });

        // Update reward usage count
        await tx.reward.update({
          where: { id: reward.id },
          data: {
            timesUsed: reward.timesUsed + 1,
          },
        });

        // Log in customer history
        await tx.customerHistory.create({
          data: {
            customerId: validatedData.customerId,
            eventType: 'REWARD_CLAIMED',
            description: `Claimed reward: ${reward.name} (${reward.pointsCost} points)`,
            amount: reward.pointsCost,
            referenceId: claim.id,
            createdById: session.user.id,
          },
        });

        return { claim, updatedLoyaltyAccount: loyaltyAccount };
      });

      return NextResponse.json({
        success: true,
        claim: result.claim,
        pointsUsed: reward.pointsCost,
        message: 'Reward claimed successfully',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing reward:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process reward' },
      { status: 500 }
    );
  }
}

// Helper functions
function getTierIndex(tier: LoyaltyTier): number {
  const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
  return tiers.indexOf(tier);
}

function getTiersUpToLevel(level: number): LoyaltyTier[] {
  const tiers: LoyaltyTier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
  return tiers.slice(0, level + 1);
}