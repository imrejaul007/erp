import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// UAE Tax Reporting Schema
const uaeTaxReportingSchema = z.object({
  reportType: z.enum(['vat', 'corporate', 'excise', 'economic_substance']),
  taxPeriod: z.object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  entityInfo: z.object({
    tradeLicenseNumber: z.string().min(1),
    taxRegistrationNumber: z.string().optional(),
    corporateTaxNumber: z.string().optional(),
    emirate: z.enum(['ABU_DHABI', 'DUBAI', 'SHARJAH', 'AJMAN', 'RAS_AL_KHAIMAH', 'FUJAIRAH', 'UMM_AL_QUWAIN']),
    businessActivity: z.string(),
    freezone: z.boolean().default(false),
    freezoneName: z.string().optional(),
  }),
  currency: z.string().default('AED'),
  includeDetails: z.boolean().default(true),
  format: z.enum(['json', 'xml', 'pdf']).default('json'),
});

// Corporate Tax Rate Calculations (9% from June 1, 2023)
const CORPORATE_TAX_RATE = 0.09;
const CORPORATE_TAX_THRESHOLD = 375000; // AED threshold for small business relief
const SMALL_BUSINESS_TAX_RATE = 0.0; // 0% for qualifying small businesses

// VAT Rates in UAE
const VAT_RATES = {
  standard: 0.05, // 5% standard rate
  zero: 0.0,      // Zero-rated supplies
  exempt: null,   // Exempt supplies
};

export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const validatedData = uaeTaxReportingSchema.parse(body);

    const { reportType, taxPeriod, entityInfo, currency, includeDetails, format } = validatedData;

    let reportData;

    switch (reportType) {
      case 'vat':
        reportData = await generateVATReport(taxPeriod, entityInfo, currency, includeDetails);
        break;
      case 'corporate':
        reportData = await generateCorporateTaxReport(taxPeriod, entityInfo, currency, includeDetails);
        break;
      case 'excise':
        reportData = await generateExciseTaxReport(taxPeriod, entityInfo, currency, includeDetails);
        break;
      case 'economic_substance':
        reportData = await generateEconomicSubstanceReport(taxPeriod, entityInfo, currency, includeDetails);
        break;
      default:
        return apiError('Invalid report type', 400);
    }

    // Format the response based on requested format
    if (format === 'xml') {
      const xmlContent = await generateXMLReport(reportData, reportType);
      return new NextResponse(xmlContent, {
        headers: {
          'Content-Type': 'application/xml',
          'Content-Disposition': `attachment; filename="${reportType}_report_${taxPeriod.start}_${taxPeriod.end}.xml"`,
        },
      });
    }

    if (format === 'pdf') {
      // In a real implementation, you would generate a PDF here
      // For now, returning JSON with PDF generation status
      return NextResponse.json({
        ...reportData,
        pdfGeneration: {
          status: 'ready',
          downloadUrl: `/api/finance/tax/uae-reporting/pdf/${reportData.reportId}`,
        },
      });
    }

    return apiResponse(reportData);
  } catch (error) {
    console.error('UAE Tax Reporting error:', error);

    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    return apiError('Failed to generate tax report', 500);
  }
});

async function generateVATReport(taxPeriod: any, entityInfo: any, currency: string, includeDetails: boolean) {
  const { start, end } = taxPeriod;

  // Get all sales transactions for the period
  const salesTransactions = await prisma.invoice.findMany({
    where: {
      invoice_date: {
        gte: new Date(start),
        lte: new Date(end),
      },
      status: 'PAID',
    },
    include: {
      invoice_items: {
        include: {
          product: true,
        },
      },
      customer: true,
    },
  });

  // Get all purchase transactions for the period
  const purchaseTransactions = await prisma.purchaseOrder.findMany({
    where: {
      order_date: {
        gte: new Date(start),
        lte: new Date(end),
      },
      status: 'COMPLETED',
    },
    include: {
      purchase_order_items: {
        include: {
          product: true,
        },
      },
      supplier: true,
    },
  });

  // Calculate VAT figures
  let totalSales = 0;
  let totalSalesVAT = 0;
  let zeroRatedSales = 0;
  let exemptSales = 0;

  let totalPurchases = 0;
  let totalPurchaseVAT = 0;
  let nonRecoverableVAT = 0;

  // Process sales transactions
  for (const invoice of salesTransactions) {
    const invoiceTotal = Number(invoice.total_amount);
    const vatAmount = Number(invoice.vat_amount || 0);

    totalSales += invoiceTotal;
    totalSalesVAT += vatAmount;

    // Categorize based on VAT rate applied
    const vatRate = vatAmount / (invoiceTotal - vatAmount);
    if (vatRate === 0) {
      zeroRatedSales += invoiceTotal;
    }
    // Add logic for exempt sales based on product categories
  }

  // Process purchase transactions
  for (const po of purchaseTransactions) {
    const poTotal = Number(po.total_amount);
    const vatAmount = Number(po.vat_amount || 0);

    totalPurchases += poTotal;
    totalPurchaseVAT += vatAmount;
  }

  const netVAT = totalSalesVAT - totalPurchaseVAT;

  const vatReport = {
    reportId: `VAT_${Date.now()}`,
    reportType: 'vat',
    period: taxPeriod,
    entityInfo,
    currency,
    summary: {
      totalSales: Number(totalSales.toFixed(2)),
      totalSalesVAT: Number(totalSalesVAT.toFixed(2)),
      zeroRatedSales: Number(zeroRatedSales.toFixed(2)),
      exemptSales: Number(exemptSales.toFixed(2)),
      totalPurchases: Number(totalPurchases.toFixed(2)),
      totalPurchaseVAT: Number(totalPurchaseVAT.toFixed(2)),
      nonRecoverableVAT: Number(nonRecoverableVAT.toFixed(2)),
      netVATPayable: Number(Math.max(0, netVAT).toFixed(2)),
      netVATRefund: Number(Math.max(0, -netVAT).toFixed(2)),
    },
    compliance: {
      filingDeadline: calculateVATFilingDeadline(end),
      paymentDeadline: calculateVATPaymentDeadline(end),
      ftaSubmissionRequired: true,
      penaltyRisk: assessVATPenaltyRisk(netVAT, end),
    },
    generatedAt: new Date().toISOString(),
  };

  if (includeDetails) {
    vatReport.details = {
      salesTransactions: salesTransactions.map(formatTransactionForReport),
      purchaseTransactions: purchaseTransactions.map(formatPurchaseForReport),
    };
  }

  return vatReport;
}

async function generateCorporateTaxReport(taxPeriod: any, entityInfo: any, currency: string, includeDetails: boolean) {
  const { start, end } = taxPeriod;

  // Get profit and loss data
  const revenue = await calculateTotalRevenue(start, end);
  const expenses = await calculateTotalExpenses(start, end);
  const grossProfit = revenue - expenses;

  // Calculate taxable income (simplified)
  const taxableIncome = Math.max(0, grossProfit);

  // Determine tax rate based on income threshold
  const isSmallBusiness = taxableIncome <= CORPORATE_TAX_THRESHOLD;
  const applicableTaxRate = isSmallBusiness ? SMALL_BUSINESS_TAX_RATE : CORPORATE_TAX_RATE;

  const corporateTax = taxableIncome * applicableTaxRate;

  // Get previous year data for comparison
  const previousYearStart = new Date(start);
  previousYearStart.setFullYear(previousYearStart.getFullYear() - 1);
  const previousYearEnd = new Date(end);
  previousYearEnd.setFullYear(previousYearEnd.getFullYear() - 1);

  const previousYearRevenue = await calculateTotalRevenue(
    previousYearStart.toISOString().split('T')[0],
    previousYearEnd.toISOString().split('T')[0]
  );

  const corporateTaxReport = {
    reportId: `CT_${Date.now()}`,
    reportType: 'corporate',
    period: taxPeriod,
    entityInfo,
    currency,
    summary: {
      totalRevenue: Number(revenue.toFixed(2)),
      totalExpenses: Number(expenses.toFixed(2)),
      grossProfit: Number(grossProfit.toFixed(2)),
      taxableIncome: Number(taxableIncome.toFixed(2)),
      applicableTaxRate: applicableTaxRate,
      corporateTax: Number(corporateTax.toFixed(2)),
      isSmallBusiness,
      previousYearRevenue: Number(previousYearRevenue.toFixed(2)),
      growthRate: previousYearRevenue > 0 ? Number(((revenue - previousYearRevenue) / previousYearRevenue * 100).toFixed(2)) : 0,
    },
    compliance: {
      filingDeadline: calculateCorporateTaxFilingDeadline(end),
      paymentDeadline: calculateCorporateTaxPaymentDeadline(end),
      quarterlYPaymentsRequired: taxableIncome > 500000, // AED 500k threshold
      transferPricingRequired: await checkTransferPricingRequirement(entityInfo),
      economicSubstanceRequired: await checkEconomicSubstanceRequirement(entityInfo),
    },
    generatedAt: new Date().toISOString(),
  };

  if (includeDetails) {
    corporateTaxReport.details = {
      revenueBreakdown: await getRevenueBreakdown(start, end),
      expenseBreakdown: await getExpenseBreakdown(start, end),
      taxDeductions: await calculateTaxDeductions(start, end),
      depreciation: await calculateDepreciation(start, end),
    };
  }

  return corporateTaxReport;
}

async function generateExciseTaxReport(taxPeriod: any, entityInfo: any, currency: string, includeDetails: boolean) {
  // Excise tax applies to specific goods like tobacco, energy drinks, carbonated drinks
  const excisableProducts = await prisma.products.findMany({
    where: {
      category: {
        name: {
          in: ['Tobacco', 'Energy Drinks', 'Carbonated Drinks', 'Electronic Smoking Devices'],
        },
      },
    },
  });

  // For perfume/oud business, excise tax typically doesn't apply
  // But we'll include the framework for completeness
  const exciseTaxReport = {
    reportId: `ET_${Date.now()}`,
    reportType: 'excise',
    period: taxPeriod,
    entityInfo,
    currency,
    summary: {
      excisableSales: 0,
      totalExciseTax: 0,
      applicableProducts: excisableProducts.length,
    },
    compliance: {
      registrationRequired: excisableProducts.length > 0,
      filingDeadline: calculateExciseTaxDeadline(taxPeriod.end),
      applicableRates: {
        tobacco: 1.0, // AED 1 per pack
        energyDrinks: 1.0, // AED 1 per liter
        carbonatedDrinks: 0.5, // AED 0.5 per liter
        electronicSmoking: 1.0, // AED 1 per device + liquid
      },
    },
    generatedAt: new Date().toISOString(),
  };

  return exciseTaxReport;
}

async function generateEconomicSubstanceReport(taxPeriod: any, entityInfo: any, currency: string, includeDetails: boolean) {
  // Economic Substance Regulations (ESR) for UAE entities
  const relevantActivities = [
    'Banking business',
    'Insurance business',
    'Investment fund management business',
    'Lease-finance business',
    'Headquarters business',
    'Shipping business',
    'Holding company business',
    'Intellectual property business',
    'Distribution and service centre business',
  ];

  const esReport = {
    reportId: `ES_${Date.now()}`,
    reportType: 'economic_substance',
    period: taxPeriod,
    entityInfo,
    currency,
    summary: {
      relevantActivity: entityInfo.businessActivity,
      isRelevantActivity: relevantActivities.includes(entityInfo.businessActivity),
      substantiveRequirements: {
        coreIncomeGeneratingActivities: false,
        directedAndManaged: true,
        adequateEmployees: true,
        adequateExpenditures: true,
        adequatePhysicalAssets: true,
      },
      complianceStatus: 'COMPLIANT', // This would be calculated based on actual requirements
    },
    compliance: {
      filingDeadline: calculateESRDeadline(taxPeriod.end),
      penaltyForNonCompliance: 'AED 50,000 - 300,000',
      notificationRequired: true,
    },
    generatedAt: new Date().toISOString(),
  };

  return esReport;
}

// Helper functions for deadline calculations
function calculateVATFilingDeadline(periodEnd: string): string {
  const deadline = new Date(periodEnd);
  deadline.setMonth(deadline.getMonth() + 1);
  deadline.setDate(28); // 28th of following month
  return deadline.toISOString().split('T')[0];
}

function calculateVATPaymentDeadline(periodEnd: string): string {
  return calculateVATFilingDeadline(periodEnd); // Same as filing deadline
}

function calculateCorporateTaxFilingDeadline(periodEnd: string): string {
  const deadline = new Date(periodEnd);
  deadline.setMonth(deadline.getMonth() + 9); // 9 months after year end
  return deadline.toISOString().split('T')[0];
}

function calculateCorporateTaxPaymentDeadline(periodEnd: string): string {
  return calculateCorporateTaxFilingDeadline(periodEnd); // Same as filing deadline
}

function calculateExciseTaxDeadline(periodEnd: string): string {
  const deadline = new Date(periodEnd);
  deadline.setMonth(deadline.getMonth() + 1);
  deadline.setDate(15); // 15th of following month
  return deadline.toISOString().split('T')[0];
}

function calculateESRDeadline(periodEnd: string): string {
  const deadline = new Date(periodEnd);
  deadline.setMonth(deadline.getMonth() + 12); // 12 months after financial year end
  return deadline.toISOString().split('T')[0];
}

// Assessment functions
function assessVATPenaltyRisk(netVAT: number, periodEnd: string): string {
  const today = new Date();
  const deadline = new Date(calculateVATFilingDeadline(periodEnd));

  if (today > deadline) {
    return 'HIGH - Past deadline';
  }

  const daysToDeadline = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysToDeadline <= 5) {
    return 'MEDIUM - Close to deadline';
  }

  return 'LOW - Within deadline';
}

// Revenue and expense calculation functions
async function calculateTotalRevenue(start: string, end: string): Promise<number> {
  const result = await prisma.invoice.aggregate({
    where: {
      invoice_date: {
        gte: new Date(start),
        lte: new Date(end),
      },
      status: 'PAID',
    },
    _sum: {
      total_amount: true,
    },
  });

  return Number(result._sum.total_amount || 0);
}

async function calculateTotalExpenses(start: string, end: string): Promise<number> {
  const purchaseExpenses = await prisma.purchaseOrder.aggregate({
    where: {
      order_date: {
        gte: new Date(start),
        lte: new Date(end),
      },
      status: 'COMPLETED',
    },
    _sum: {
      total_amount: true,
    },
  });

  // Add other expense categories (salaries, rent, utilities, etc.)
  // This would require additional tables in your schema

  return Number(purchaseExpenses._sum.total_amount || 0);
}

// Transfer pricing and economic substance checks
async function checkTransferPricingRequirement(entityInfo: any): Promise<boolean> {
  // Transfer pricing documentation required for controlled transactions
  // This would involve checking related party transactions
  return entityInfo.freezone || false; // Simplified logic
}

async function checkEconomicSubstanceRequirement(entityInfo: any): Promise<boolean> {
  // ESR applies to certain business activities
  const relevantActivities = [
    'Holding company business',
    'Intellectual property business',
    'Headquarters business',
  ];

  return relevantActivities.includes(entityInfo.businessActivity);
}

// Data formatting functions
function formatTransactionForReport(transaction: any) {
  return {
    id: transaction.id,
    date: transaction.invoice_date,
    customer: transaction.customer?.name || 'Unknown',
    amount: Number(transaction.total_amount),
    vatAmount: Number(transaction.vat_amount || 0),
    vatRate: transaction.vat_amount ? Number(transaction.vat_amount) / (Number(transaction.total_amount) - Number(transaction.vat_amount)) : 0,
  };
}

function formatPurchaseForReport(transaction: any) {
  return {
    id: transaction.id,
    date: transaction.order_date,
    supplier: transaction.supplier?.name || 'Unknown',
    amount: Number(transaction.total_amount),
    vatAmount: Number(transaction.vat_amount || 0),
    vatRate: transaction.vat_amount ? Number(transaction.vat_amount) / (Number(transaction.total_amount) - Number(transaction.vat_amount)) : 0,
  };
}

// XML generation for official submissions
async function generateXMLReport(reportData: any, reportType: string): Promise<string> {
  // This would generate FTA-compliant XML for official submissions
  // Implementation would depend on specific FTA XML schema requirements

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const xmlContent = `
<TaxReport xmlns="urn:fta:uae:tax:${reportType}" version="1.0">
  <Header>
    <ReportID>${reportData.reportId}</ReportID>
    <ReportType>${reportType.toUpperCase()}</ReportType>
    <Period>
      <Start>${reportData.period.start}</Start>
      <End>${reportData.period.end}</End>
    </Period>
    <EntityInfo>
      <TradeLicenseNumber>${reportData.entityInfo.tradeLicenseNumber}</TradeLicenseNumber>
      <Emirates>${reportData.entityInfo.emirate}</Emirates>
    </EntityInfo>
    <GeneratedAt>${reportData.generatedAt}</GeneratedAt>
  </Header>
  <Summary>
    ${generateXMLSummary(reportData.summary, reportType)}
  </Summary>
</TaxReport>`;

  return xmlHeader + xmlContent;
}

function generateXMLSummary(summary: any, reportType: string): string {
  if (reportType === 'vat') {
    return `
    <TotalSales>${summary.totalSales}</TotalSales>
    <TotalSalesVAT>${summary.totalSalesVAT}</TotalSalesVAT>
    <TotalPurchases>${summary.totalPurchases}</TotalPurchases>
    <TotalPurchaseVAT>${summary.totalPurchaseVAT}</TotalPurchaseVAT>
    <NetVATPayable>${summary.netVATPayable}</NetVATPayable>`;
  }

  if (reportType === 'corporate') {
    return `
    <TotalRevenue>${summary.totalRevenue}</TotalRevenue>
    <TaxableIncome>${summary.taxableIncome}</TaxableIncome>
    <CorporateTax>${summary.corporateTax}</CorporateTax>
    <TaxRate>${summary.applicableTaxRate}</TaxRate>`;
  }

  return '<Summary>Not available</Summary>';
}

// Additional helper functions for detailed breakdowns
async function getRevenueBreakdown(start: string, end: string) {
  // Implement revenue breakdown by category, product, customer segment
  return {
    byCategory: [],
    byProduct: [],
    byCustomerSegment: [],
  };
}

async function getExpenseBreakdown(start: string, end: string) {
  // Implement expense breakdown by category
  return {
    costOfGoodsSold: 0,
    operatingExpenses: 0,
    administrativeExpenses: 0,
    financialExpenses: 0,
  };
}

async function calculateTaxDeductions(start: string, end: string) {
  // Calculate allowable tax deductions
  return {
    depreciation: 0,
    businessExpenses: 0,
    losses: 0,
    other: 0,
  };
}

async function calculateDepreciation(start: string, end: string) {
  // Calculate depreciation for tax purposes
  return {
    buildings: 0,
    equipment: 0,
    vehicles: 0,
    intangibleAssets: 0,
  };
}

export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'compliance-calendar') {
      const complianceCalendar = generateComplianceCalendar();
      return apiResponse(complianceCalendar);
    }

    if (action === 'tax-rates') {
      const currentTaxRates = getCurrentTaxRates();
      return apiResponse(currentTaxRates);
    }

    if (action === 'deadlines') {
      const upcomingDeadlines = await getUpcomingDeadlines();
      return apiResponse(upcomingDeadlines);
    }

    return apiResponse({
      message: 'UAE Tax Reporting API',
      availableReports: ['vat', 'corporate', 'excise', 'economic_substance'],
      supportedFormats: ['json', 'xml', 'pdf'],
    });
  } catch (error) {
    console.error('UAE Tax Reporting GET error:', error);
    return apiError('Failed to process request', 500);
  }
});

function generateComplianceCalendar() {
  const currentYear = new Date().getFullYear();
  return {
    year: currentYear,
    deadlines: [
      {
        type: 'VAT Filing',
        frequency: 'Monthly/Quarterly',
        deadline: '28th of following month',
        description: 'VAT return filing and payment',
      },
      {
        type: 'Corporate Tax Filing',
        frequency: 'Annual',
        deadline: '9 months after year-end',
        description: 'Corporate tax return filing',
      },
      {
        type: 'Excise Tax Filing',
        frequency: 'Monthly',
        deadline: '15th of following month',
        description: 'Excise tax return (if applicable)',
      },
      {
        type: 'Economic Substance Report',
        frequency: 'Annual',
        deadline: '12 months after year-end',
        description: 'ESR filing for relevant activities',
      },
    ],
  };
}

function getCurrentTaxRates() {
  return {
    vat: {
      standard: 5,
      zero: 0,
      exempt: 'N/A',
    },
    corporateTax: {
      standard: 9,
      smallBusiness: 0,
      threshold: 375000,
    },
    exciseTax: {
      tobacco: 'AED 1 per pack',
      energyDrinks: 'AED 1 per liter',
      carbonatedDrinks: 'AED 0.5 per liter',
    },
  };
}

async function getUpcomingDeadlines() {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  return {
    immediate: [
      {
        type: 'VAT Filing',
        deadline: calculateVATFilingDeadline(today.toISOString().split('T')[0]),
        daysRemaining: Math.ceil((new Date(calculateVATFilingDeadline(today.toISOString().split('T')[0])).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        priority: 'HIGH',
      },
    ],
    upcoming: [
      {
        type: 'Corporate Tax Planning',
        deadline: calculateCorporateTaxFilingDeadline(today.toISOString().split('T')[0]),
        daysRemaining: Math.ceil((new Date(calculateCorporateTaxFilingDeadline(today.toISOString().split('T')[0])).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        priority: 'MEDIUM',
      },
    ],
  };
}