import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Franchise Royalty Calculation Schema
const franchiseRoyaltySchema = z.object({
  franchiseId: z.string().min(1),
  period: z.object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  royaltyType: z.enum(['percentage', 'fixed', 'tiered', 'hybrid']),
  includeDetails: z.boolean().default(true),
  currency: z.string().default('AED'),
  adjustments: z.array(z.object({
    type: z.enum(['discount', 'penalty', 'bonus', 'marketing_fund']),
    amount: z.number(),
    reason: z.string(),
  })).optional(),
});

// Franchise Agreement Schema
const franchiseAgreementSchema = z.object({
  franchiseId: z.string().min(1),
  franchiseName: z.string().min(1),
  franchiseeDetails: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    tradeLicense: z.string(),
    emirate: z.enum(['ABU_DHABI', 'DUBAI', 'SHARJAH', 'AJMAN', 'RAS_AL_KHAIMAH', 'FUJAIRAH', 'UMM_AL_QUWAIN']),
  }),
  agreementTerms: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    territoryExclusive: z.boolean().default(true),
    renewalOptions: z.number().min(0).max(5),
  }),
  financialTerms: z.object({
    initialFee: z.number().min(0),
    royaltyRate: z.number().min(0).max(50), // Percentage
    marketingFeeRate: z.number().min(0).max(10), // Percentage
    minimumRoyalty: z.number().min(0).optional(),
    royaltyStructure: z.enum(['percentage', 'fixed', 'tiered', 'hybrid']),
    paymentFrequency: z.enum(['monthly', 'quarterly', 'semi_annual', 'annual']),
    paymentDueDate: z.number().min(1).max(31), // Day of month
  }),
  performanceTargets: z.object({
    minimumAnnualSales: z.number().min(0),
    marketingSpendMinimum: z.number().min(0),
    qualityStandards: z.array(z.string()),
    trainingRequirements: z.array(z.string()),
  }),
  products: z.array(z.object({
    productId: z.string(),
    royaltyRate: z.number().optional(), // Override default rate for specific products
    exclusivity: z.boolean().default(false),
  })),
});

// Marketing Fund Contribution Schema
const marketingFundSchema = z.object({
  franchiseId: z.string().min(1),
  period: z.object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  contributionRate: z.number().min(0).max(10), // Percentage of gross sales
  campaigns: z.array(z.object({
    name: z.string(),
    budget: z.number(),
    allocation: z.number(), // Percentage of total fund
    startDate: z.string(),
    endDate: z.string(),
  })).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'calculate_royalties':
        return await calculateRoyalties(body);
      case 'create_agreement':
        return await createFranchiseAgreement(body);
      case 'update_agreement':
        return await updateFranchiseAgreement(body);
      case 'calculate_marketing_fund':
        return await calculateMarketingFund(body);
      case 'generate_statement':
        return await generateRoyaltyStatement(body);
      case 'track_performance':
        return await trackFranchisePerformance(body);
      case 'calculate_commissions':
        return await calculateFranchiseCommissions(body);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Franchise Royalty error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process franchise royalty request' },
      { status: 500 }
    );
  }
}

async function calculateRoyalties(requestData: any) {
  const validatedData = franchiseRoyaltySchema.parse(requestData);
  const { franchiseId, period, royaltyType, currency, adjustments, includeDetails } = validatedData;

  // Get franchise agreement details
  const franchise = await getFranchiseAgreement(franchiseId);
  if (!franchise) {
    return NextResponse.json({ error: 'Franchise not found' }, { status: 404 });
  }

  // Get sales data for the period
  const salesData = await getFranchiseSalesData(franchiseId, period.start, period.end);

  // Calculate base royalties
  const baseRoyalties = await calculateBaseRoyalties(salesData, franchise, royaltyType);

  // Calculate marketing fund contributions
  const marketingFund = calculateMarketingFundContribution(salesData.grossSales, franchise.marketingFeeRate);

  // Apply adjustments
  const adjustedRoyalties = applyRoyaltyAdjustments(baseRoyalties, adjustments || []);

  // Calculate penalties for performance shortfalls
  const performancePenalties = await calculatePerformancePenalties(franchise, salesData, period);

  // Calculate bonuses for exceeding targets
  const performanceBonuses = await calculatePerformanceBonuses(franchise, salesData, period);

  const totalRoyalties = adjustedRoyalties.total + marketingFund + performancePenalties - performanceBonuses;

  const royaltyCalculation = {
    franchiseId,
    franchiseName: franchise.franchiseName,
    period,
    currency,
    salesSummary: {
      grossSales: Number(salesData.grossSales.toFixed(2)),
      netSales: Number(salesData.netSales.toFixed(2)),
      transactionCount: salesData.transactionCount,
      averageTransaction: Number((salesData.grossSales / salesData.transactionCount).toFixed(2)),
    },
    royaltyBreakdown: {
      baseRoyalties: {
        rate: franchise.royaltyRate,
        structure: royaltyType,
        calculation: baseRoyalties,
      },
      marketingFund: {
        rate: franchise.marketingFeeRate,
        amount: Number(marketingFund.toFixed(2)),
      },
      adjustments: adjustments?.map(adj => ({
        ...adj,
        amount: Number(adj.amount.toFixed(2)),
      })) || [],
      performancePenalties: Number(performancePenalties.toFixed(2)),
      performanceBonuses: Number(performanceBonuses.toFixed(2)),
    },
    totals: {
      totalRoyalties: Number(totalRoyalties.toFixed(2)),
      totalDue: Number(totalRoyalties.toFixed(2)),
      dueDate: calculatePaymentDueDate(franchise.paymentDueDate),
    },
    compliance: {
      minimumRoyaltyMet: totalRoyalties >= (franchise.minimumRoyalty || 0),
      salesTargetMet: salesData.grossSales >= franchise.minimumAnnualSales / 12, // Monthly target
      qualityStandardsMet: await checkQualityStandards(franchiseId),
      trainingCompliant: await checkTrainingCompliance(franchiseId),
    },
    previousPeriod: await getPreviousPeriodComparison(franchiseId, period),
    generatedAt: new Date().toISOString(),
  };

  if (includeDetails) {
    royaltyCalculation.details = {
      salesTransactions: salesData.transactions,
      productBreakdown: salesData.productBreakdown,
      territoryPerformance: await getTerritoryPerformance(franchiseId, period),
    };
  }

  // Store calculation in database
  await prisma.royaltyCalculation.create({
    data: {
      franchise_id: franchiseId,
      period_start: new Date(period.start),
      period_end: new Date(period.end),
      gross_sales: salesData.grossSales,
      net_sales: salesData.netSales,
      base_royalties: adjustedRoyalties.total,
      marketing_fund: marketingFund,
      performance_penalties: performancePenalties,
      performance_bonuses: performanceBonuses,
      total_royalties: totalRoyalties,
      currency,
      status: 'CALCULATED',
      created_by: session?.user?.email,
    },
  });

  return NextResponse.json(royaltyCalculation);
}

async function createFranchiseAgreement(requestData: any) {
  const validatedData = franchiseAgreementSchema.parse(requestData);

  const agreement = await prisma.franchiseAgreement.create({
    data: {
      franchise_id: validatedData.franchiseId,
      franchise_name: validatedData.franchiseName,
      franchisee_name: validatedData.franchiseeDetails.name,
      franchisee_email: validatedData.franchiseeDetails.email,
      franchisee_phone: validatedData.franchiseeDetails.phone,
      franchisee_address: validatedData.franchiseeDetails.address,
      trade_license: validatedData.franchiseeDetails.tradeLicense,
      emirate: validatedData.franchiseeDetails.emirate,
      start_date: new Date(validatedData.agreementTerms.startDate),
      end_date: new Date(validatedData.agreementTerms.endDate),
      territory_exclusive: validatedData.agreementTerms.territoryExclusive,
      renewal_options: validatedData.agreementTerms.renewalOptions,
      initial_fee: validatedData.financialTerms.initialFee,
      royalty_rate: validatedData.financialTerms.royaltyRate,
      marketing_fee_rate: validatedData.financialTerms.marketingFeeRate,
      minimum_royalty: validatedData.financialTerms.minimumRoyalty,
      royalty_structure: validatedData.financialTerms.royaltyStructure,
      payment_frequency: validatedData.financialTerms.paymentFrequency,
      payment_due_date: validatedData.financialTerms.paymentDueDate,
      minimum_annual_sales: validatedData.performanceTargets.minimumAnnualSales,
      marketing_spend_minimum: validatedData.performanceTargets.marketingSpendMinimum,
      quality_standards: validatedData.performanceTargets.qualityStandards,
      training_requirements: validatedData.performanceTargets.trainingRequirements,
      status: 'ACTIVE',
      created_by: session?.user?.email,
    },
  });

  // Create product mappings
  if (validatedData.products?.length > 0) {
    await prisma.franchiseProduct.createMany({
      data: validatedData.products.map(product => ({
        franchise_agreement_id: agreement.id,
        product_id: product.productId,
        royalty_rate: product.royaltyRate,
        exclusivity: product.exclusivity,
      })),
    });
  }

  return NextResponse.json({
    agreementId: agreement.id,
    franchiseId: validatedData.franchiseId,
    status: 'created',
    initialPayment: {
      amount: validatedData.financialTerms.initialFee,
      dueDate: validatedData.agreementTerms.startDate,
    },
    nextRoyaltyDue: calculateNextRoyaltyDate(validatedData.financialTerms.paymentFrequency, validatedData.agreementTerms.startDate),
  });
}

async function calculateMarketingFund(requestData: any) {
  const validatedData = marketingFundSchema.parse(requestData);
  const { franchiseId, period, contributionRate, campaigns } = validatedData;

  const salesData = await getFranchiseSalesData(franchiseId, period.start, period.end);
  const totalContribution = salesData.grossSales * (contributionRate / 100);

  const fundCalculation = {
    franchiseId,
    period,
    grossSales: Number(salesData.grossSales.toFixed(2)),
    contributionRate,
    totalContribution: Number(totalContribution.toFixed(2)),
    campaigns: campaigns || [],
    allocation: {
      nationalAdvertising: Number((totalContribution * 0.6).toFixed(2)), // 60%
      localMarketing: Number((totalContribution * 0.3).toFixed(2)), // 30%
      digitalMarketing: Number((totalContribution * 0.1).toFixed(2)), // 10%
    },
    previousFunds: await getPreviousMarketingFunds(franchiseId),
    utilizationReport: await getMarketingFundUtilization(franchiseId, period),
  };

  return NextResponse.json(fundCalculation);
}

async function generateRoyaltyStatement(requestData: any) {
  const { franchiseId, period } = requestData;

  const royaltyData = await prisma.royaltyCalculation.findFirst({
    where: {
      franchise_id: franchiseId,
      period_start: new Date(period.start),
      period_end: new Date(period.end),
    },
    include: {
      franchise_agreement: true,
    },
  });

  if (!royaltyData) {
    return NextResponse.json({ error: 'Royalty calculation not found' }, { status: 404 });
  }

  const statement = {
    statementNumber: `ROY-${royaltyData.id}-${Date.now()}`,
    franchiseInfo: {
      id: franchiseId,
      name: royaltyData.franchise_agreement.franchise_name,
      franchisee: royaltyData.franchise_agreement.franchisee_name,
    },
    period,
    financialSummary: {
      grossSales: Number(royaltyData.gross_sales),
      netSales: Number(royaltyData.net_sales),
      baseRoyalties: Number(royaltyData.base_royalties),
      marketingFund: Number(royaltyData.marketing_fund),
      performancePenalties: Number(royaltyData.performance_penalties),
      performanceBonuses: Number(royaltyData.performance_bonuses),
      totalDue: Number(royaltyData.total_royalties),
    },
    paymentInstructions: {
      bankDetails: {
        accountName: 'Oud PMS Franchise Royalties',
        accountNumber: 'AE12 0123 4567 8901 2345 678',
        bankName: 'Emirates NBD',
        swiftCode: 'EBILAEAD',
      },
      referenceNumber: `ROY-${franchiseId}-${period.start}`,
      dueDate: calculatePaymentDueDate(royaltyData.franchise_agreement.payment_due_date),
    },
    complianceStatus: {
      currentStatus: 'COMPLIANT',
      outstandingItems: await getOutstandingComplianceItems(franchiseId),
      nextReview: calculateNextReviewDate(),
    },
    generatedAt: new Date().toISOString(),
  };

  // Update statement status
  await prisma.royaltyCalculation.update({
    where: { id: royaltyData.id },
    data: { status: 'STATEMENT_GENERATED' },
  });

  return NextResponse.json(statement);
}

async function trackFranchisePerformance(requestData: any) {
  const { franchiseId, period } = requestData;

  const franchise = await getFranchiseAgreement(franchiseId);
  const salesData = await getFranchiseSalesData(franchiseId, period.start, period.end);
  const previousYearData = await getPreviousYearSalesData(franchiseId, period);

  const performance = {
    franchiseId,
    period,
    kpis: {
      salesGrowth: {
        current: Number(salesData.grossSales.toFixed(2)),
        previous: Number(previousYearData.grossSales.toFixed(2)),
        growth: Number((((salesData.grossSales - previousYearData.grossSales) / previousYearData.grossSales) * 100).toFixed(2)),
        trend: salesData.grossSales > previousYearData.grossSales ? 'INCREASING' : 'DECREASING',
      },
      targetAchievement: {
        salesTarget: franchise.minimumAnnualSales / 12, // Monthly target
        actualSales: salesData.grossSales,
        achievement: Number(((salesData.grossSales / (franchise.minimumAnnualSales / 12)) * 100).toFixed(2)),
        status: salesData.grossSales >= (franchise.minimumAnnualSales / 12) ? 'MET' : 'BELOW_TARGET',
      },
      customerMetrics: {
        totalCustomers: salesData.uniqueCustomers,
        newCustomers: salesData.newCustomers,
        repeatCustomers: salesData.repeatCustomers,
        averageOrderValue: Number((salesData.grossSales / salesData.transactionCount).toFixed(2)),
        customerRetention: Number(((salesData.repeatCustomers / salesData.uniqueCustomers) * 100).toFixed(2)),
      },
      productPerformance: {
        topProducts: salesData.productBreakdown.slice(0, 5),
        categoryDistribution: await getCategoryDistribution(franchiseId, period),
        slowMovingProducts: await getSlowMovingProducts(franchiseId, period),
      },
    },
    benchmarking: {
      industryAverage: {
        salesPerSqFt: 1500, // Industry benchmark
        conversionRate: 15, // Industry benchmark
        averageTransaction: 250, // Industry benchmark
      },
      franchiseNetwork: await getNetworkBenchmarks(franchiseId, period),
      ranking: await getFranchiseRanking(franchiseId, period),
    },
    recommendations: generatePerformanceRecommendations(salesData, franchise),
    alerts: await getPerformanceAlerts(franchiseId, salesData, franchise),
  };

  return NextResponse.json(performance);
}

async function calculateFranchiseCommissions(requestData: any) {
  const { franchiseId, period, commissionStructure } = requestData;

  const salesData = await getFranchiseSalesData(franchiseId, period.start, period.end);

  const commissionCalculation = {
    franchiseId,
    period,
    structure: commissionStructure || 'standard',
    calculations: {
      baseSales: Number(salesData.grossSales.toFixed(2)),
      commissionableRevenue: Number((salesData.grossSales * 0.8).toFixed(2)), // 80% of gross sales
      commissionRate: 0.05, // 5% of commissionable revenue
      baseCommission: Number((salesData.grossSales * 0.8 * 0.05).toFixed(2)),
    },
    bonuses: {
      volumeBonus: calculateVolumeBonus(salesData.grossSales),
      growthBonus: await calculateGrowthBonus(franchiseId, salesData.grossSales),
      qualityBonus: await calculateQualityBonus(franchiseId),
    },
    deductions: {
      chargebacks: 0,
      penalties: 0,
      advancesRecovery: 0,
    },
    totalCommission: 0,
  };

  commissionCalculation.totalCommission =
    commissionCalculation.calculations.baseCommission +
    commissionCalculation.bonuses.volumeBonus +
    commissionCalculation.bonuses.growthBonus +
    commissionCalculation.bonuses.qualityBonus -
    commissionCalculation.deductions.chargebacks -
    commissionCalculation.deductions.penalties -
    commissionCalculation.deductions.advancesRecovery;

  return NextResponse.json(commissionCalculation);
}

// Helper Functions

async function getFranchiseAgreement(franchiseId: string) {
  const agreement = await prisma.franchiseAgreement.findFirst({
    where: { franchise_id: franchiseId, status: 'ACTIVE' },
  });

  return agreement ? {
    franchiseName: agreement.franchise_name,
    royaltyRate: Number(agreement.royalty_rate),
    marketingFeeRate: Number(agreement.marketing_fee_rate),
    minimumRoyalty: Number(agreement.minimum_royalty || 0),
    minimumAnnualSales: Number(agreement.minimum_annual_sales),
    paymentDueDate: agreement.payment_due_date,
    paymentFrequency: agreement.payment_frequency,
  } : null;
}

async function getFranchiseSalesData(franchiseId: string, start: string, end: string) {
  // In a real implementation, this would query franchise-specific sales data
  // For now, returning mock data structure
  const mockSalesData = {
    grossSales: 125000,
    netSales: 115000,
    transactionCount: 450,
    uniqueCustomers: 320,
    newCustomers: 85,
    repeatCustomers: 235,
    productBreakdown: [
      { productId: '1', name: 'Royal Oud Collection', sales: 45000, quantity: 180 },
      { productId: '2', name: 'Premium Perfumes', sales: 35000, quantity: 140 },
      { productId: '3', name: 'Traditional Oud', sales: 25000, quantity: 100 },
    ],
    transactions: [], // Detailed transaction data
  };

  return mockSalesData;
}

async function calculateBaseRoyalties(salesData: any, franchise: any, royaltyType: string) {
  let calculation;

  switch (royaltyType) {
    case 'percentage':
      calculation = {
        baseSales: salesData.grossSales,
        rate: franchise.royaltyRate,
        total: salesData.grossSales * (franchise.royaltyRate / 100),
      };
      break;
    case 'tiered':
      calculation = calculateTieredRoyalties(salesData.grossSales, franchise.royaltyRate);
      break;
    case 'fixed':
      calculation = {
        fixedAmount: franchise.minimumRoyalty || 5000,
        total: franchise.minimumRoyalty || 5000,
      };
      break;
    case 'hybrid':
      const percentageAmount = salesData.grossSales * (franchise.royaltyRate / 100);
      const minimumAmount = franchise.minimumRoyalty || 5000;
      calculation = {
        percentageAmount,
        minimumAmount,
        total: Math.max(percentageAmount, minimumAmount),
      };
      break;
    default:
      calculation = {
        baseSales: salesData.grossSales,
        rate: franchise.royaltyRate,
        total: salesData.grossSales * (franchise.royaltyRate / 100),
      };
  }

  return calculation;
}

function calculateTieredRoyalties(grossSales: number, baseRate: number) {
  const tiers = [
    { threshold: 0, rate: baseRate },
    { threshold: 100000, rate: baseRate + 1 },
    { threshold: 200000, rate: baseRate + 2 },
    { threshold: 500000, rate: baseRate + 3 },
  ];

  let totalRoyalty = 0;
  let remainingSales = grossSales;

  for (let i = 0; i < tiers.length; i++) {
    const currentTier = tiers[i];
    const nextTier = tiers[i + 1];
    const tierLimit = nextTier ? nextTier.threshold - currentTier.threshold : remainingSales;
    const tierSales = Math.min(remainingSales, tierLimit);

    if (tierSales > 0) {
      totalRoyalty += tierSales * (currentTier.rate / 100);
      remainingSales -= tierSales;
    }

    if (remainingSales <= 0) break;
  }

  return {
    tiers,
    grossSales,
    total: totalRoyalty,
  };
}

function calculateMarketingFundContribution(grossSales: number, rate: number): number {
  return grossSales * (rate / 100);
}

function applyRoyaltyAdjustments(baseRoyalties: any, adjustments: any[]): any {
  let adjustedTotal = baseRoyalties.total;

  adjustments.forEach(adjustment => {
    if (adjustment.type === 'discount' || adjustment.type === 'penalty') {
      adjustedTotal += adjustment.amount; // Amount should be negative for discounts
    } else if (adjustment.type === 'bonus') {
      adjustedTotal += adjustment.amount;
    }
  });

  return {
    ...baseRoyalties,
    adjustments,
    total: adjustedTotal,
  };
}

async function calculatePerformancePenalties(franchise: any, salesData: any, period: any): Promise<number> {
  let penalties = 0;

  // Sales target penalty
  const monthlyTarget = franchise.minimumAnnualSales / 12;
  if (salesData.grossSales < monthlyTarget) {
    const shortfall = monthlyTarget - salesData.grossSales;
    penalties += shortfall * 0.1; // 10% penalty on shortfall
  }

  return penalties;
}

async function calculatePerformanceBonuses(franchise: any, salesData: any, period: any): Promise<number> {
  let bonuses = 0;

  // Sales target bonus
  const monthlyTarget = franchise.minimumAnnualSales / 12;
  if (salesData.grossSales > monthlyTarget * 1.2) { // 20% above target
    const excess = salesData.grossSales - monthlyTarget;
    bonuses += excess * 0.05; // 5% bonus on excess
  }

  return bonuses;
}

function calculatePaymentDueDate(dueDay: number): string {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, dueDay);
  return nextMonth.toISOString().split('T')[0];
}

function calculateNextRoyaltyDate(frequency: string, startDate: string): string {
  const start = new Date(startDate);
  const next = new Date(start);

  switch (frequency) {
    case 'monthly':
      next.setMonth(start.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(start.getMonth() + 3);
      break;
    case 'semi_annual':
      next.setMonth(start.getMonth() + 6);
      break;
    case 'annual':
      next.setFullYear(start.getFullYear() + 1);
      break;
  }

  return next.toISOString().split('T')[0];
}

function calculateVolumeBonus(grossSales: number): number {
  if (grossSales > 500000) return 2500; // High volume bonus
  if (grossSales > 300000) return 1500; // Medium volume bonus
  if (grossSales > 150000) return 750;  // Low volume bonus
  return 0;
}

async function calculateGrowthBonus(franchiseId: string, currentSales: number): Promise<number> {
  // Compare with previous period
  const previousSales = 100000; // Mock previous period sales
  const growthRate = ((currentSales - previousSales) / previousSales) * 100;

  if (growthRate > 20) return 1000; // High growth bonus
  if (growthRate > 10) return 500;  // Medium growth bonus
  if (growthRate > 5) return 250;   // Low growth bonus
  return 0;
}

async function calculateQualityBonus(franchiseId: string): Promise<number> {
  // Quality score based on customer feedback, mystery shopper scores, etc.
  const qualityScore = 85; // Mock quality score

  if (qualityScore >= 90) return 500; // Excellence bonus
  if (qualityScore >= 80) return 250; // Good performance bonus
  return 0;
}

// Additional helper functions
async function checkQualityStandards(franchiseId: string): Promise<boolean> {
  // Check quality compliance
  return true;
}

async function checkTrainingCompliance(franchiseId: string): Promise<boolean> {
  // Check training requirements
  return true;
}

async function getPreviousPeriodComparison(franchiseId: string, period: any) {
  return {
    sales: 110000,
    royalties: 5500,
    growth: 13.6,
  };
}

async function getTerritoryPerformance(franchiseId: string, period: any) {
  return {
    totalTerritory: '5 Emirates',
    activeLocations: 3,
    performance: 'Above Average',
  };
}

function generatePerformanceRecommendations(salesData: any, franchise: any) {
  const recommendations = [];

  if (salesData.grossSales < franchise.minimumAnnualSales / 12) {
    recommendations.push('Increase marketing efforts to meet sales targets');
  }

  if (salesData.repeatCustomers / salesData.uniqueCustomers < 0.6) {
    recommendations.push('Implement customer loyalty programs to improve retention');
  }

  return recommendations;
}

async function getPerformanceAlerts(franchiseId: string, salesData: any, franchise: any) {
  const alerts = [];

  if (salesData.grossSales < franchise.minimumAnnualSales / 12 * 0.8) {
    alerts.push({
      type: 'CRITICAL',
      message: 'Sales significantly below target',
      action: 'Immediate intervention required',
    });
  }

  return alerts;
}

// GET endpoint for franchise information and reports
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const franchiseId = searchParams.get('franchiseId');

    if (action === 'franchise-list') {
      const franchises = await prisma.franchiseAgreement.findMany({
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          franchise_id: true,
          franchise_name: true,
          franchisee_name: true,
          royalty_rate: true,
          status: true,
        },
      });

      return NextResponse.json({ franchises });
    }

    if (action === 'royalty-structure-templates') {
      return NextResponse.json(getRoyaltyStructureTemplates());
    }

    if (action === 'performance-benchmarks') {
      return NextResponse.json(getPerformanceBenchmarks());
    }

    if (action === 'compliance-checklist' && franchiseId) {
      const checklist = await getComplianceChecklist(franchiseId);
      return NextResponse.json(checklist);
    }

    return NextResponse.json({
      message: 'Franchise Royalty Management API',
      availableActions: [
        'calculate_royalties',
        'create_agreement',
        'calculate_marketing_fund',
        'generate_statement',
        'track_performance',
        'calculate_commissions',
      ],
      royaltyStructures: ['percentage', 'fixed', 'tiered', 'hybrid'],
      paymentFrequencies: ['monthly', 'quarterly', 'semi_annual', 'annual'],
    });
  } catch (error) {
    console.error('Franchise Royalty GET error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

function getRoyaltyStructureTemplates() {
  return {
    percentage: {
      description: 'Fixed percentage of gross sales',
      typical_range: '3-8%',
      pros: ['Simple to calculate', 'Aligns with franchise performance'],
      cons: ['Can be high burden in low-margin periods'],
    },
    tiered: {
      description: 'Increasing percentage based on sales tiers',
      structure: [
        { range: '0-100k', rate: '3%' },
        { range: '100k-200k', rate: '4%' },
        { range: '200k+', rate: '5%' },
      ],
      pros: ['Incentivizes growth', 'Progressive structure'],
      cons: ['More complex to calculate'],
    },
    hybrid: {
      description: 'Greater of percentage or minimum fixed amount',
      typical_structure: 'Greater of 4% or AED 5,000',
      pros: ['Provides minimum revenue certainty', 'Fair for both parties'],
      cons: ['Can be complex for franchisees to understand'],
    },
  };
}

function getPerformanceBenchmarks() {
  return {
    retail_perfume: {
      sales_per_sqft: '1200-1800 AED',
      conversion_rate: '12-18%',
      average_transaction: '200-350 AED',
      customer_retention: '60-75%',
    },
    luxury_oud: {
      sales_per_sqft: '2000-3500 AED',
      conversion_rate: '8-15%',
      average_transaction: '400-800 AED',
      customer_retention: '70-85%',
    },
  };
}

async function getComplianceChecklist(franchiseId: string) {
  return {
    franchiseId,
    checklist: [
      { item: 'Current trade license', status: 'COMPLIANT', lastCheck: '2024-01-15' },
      { item: 'Staff training certificates', status: 'PENDING', lastCheck: '2024-01-10' },
      { item: 'Quality standards audit', status: 'COMPLIANT', lastCheck: '2024-01-20' },
      { item: 'Marketing fund contributions', status: 'COMPLIANT', lastCheck: '2024-01-25' },
      { item: 'Financial reporting', status: 'OVERDUE', lastCheck: '2023-12-30' },
    ],
    overallCompliance: '80%',
    nextReview: '2024-02-15',
  };
}

// Additional helper functions would be implemented here
async function getPreviousMarketingFunds(franchiseId: string) {
  return { totalContributed: 25000, totalSpent: 22000, balance: 3000 };
}

async function getMarketingFundUtilization(franchiseId: string, period: any) {
  return { utilized: 85, pending: 15, effectiveness: 'High' };
}

async function getPreviousYearSalesData(franchiseId: string, period: any) {
  return { grossSales: 110000, netSales: 102000 };
}

async function getCategoryDistribution(franchiseId: string, period: any) {
  return [
    { category: 'Oud', percentage: 45 },
    { category: 'Perfumes', percentage: 35 },
    { category: 'Accessories', percentage: 20 },
  ];
}

async function getSlowMovingProducts(franchiseId: string, period: any) {
  return [
    { productId: '5', name: 'Vintage Collection', daysInInventory: 90 },
  ];
}

async function getNetworkBenchmarks(franchiseId: string, period: any) {
  return { networkAverage: 115000, ranking: 3, totalFranchises: 15 };
}

async function getFranchiseRanking(franchiseId: string, period: any) {
  return { current: 3, previous: 5, trend: 'IMPROVING' };
}

async function getOutstandingComplianceItems(franchiseId: string) {
  return ['Financial reporting overdue'];
}

function calculateNextReviewDate(): string {
  const nextReview = new Date();
  nextReview.setMonth(nextReview.getMonth() + 3);
  return nextReview.toISOString().split('T')[0];
}