import { NextRequest } from 'next/server';
import { FinancialMetrics } from '@/types/analytics';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Mock financial data
const mockProfitabilityAnalysis = [
  {
    productId: 'prod_001',
    productName: 'Royal Oud - 50ml',
    revenue: 147000,
    cost: 102900,
    profit: 44100,
    margin: 30.0,
    roi: 42.8,
  },
  {
    productId: 'prod_002',
    productName: 'Rose & Amber Perfume',
    revenue: 92500,
    cost: 66600,
    profit: 25900,
    margin: 28.0,
    roi: 38.9,
  },
  {
    productId: 'prod_003',
    productName: 'Sandalwood Essence',
    revenue: 72000,
    cost: 54000,
    profit: 18000,
    margin: 25.0,
    roi: 33.3,
  },
];

const mockStoreProfitability = [
  {
    storeId: 'store_001',
    storeName: 'Dubai Mall Branch',
    revenue: 58500,
    expenses: 35100,
    profit: 23400,
    margin: 40.0,
    roi: 66.7,
  },
  {
    storeId: 'store_002',
    storeName: 'Abu Dhabi Branch',
    revenue: 42300,
    expenses: 29610,
    profit: 12690,
    margin: 30.0,
    roi: 42.9,
  },
  {
    storeId: 'store_003',
    storeName: 'Sharjah Branch',
    revenue: 35800,
    expenses: 25060,
    profit: 10740,
    margin: 30.0,
    roi: 42.9,
  },
];

const mockCostAnalysis = [
  {
    category: 'Raw Materials',
    currentMonth: 45000,
    previousMonth: 42000,
    change: 7.1,
    percentage: 45.0,
  },
  {
    category: 'Production',
    currentMonth: 18000,
    previousMonth: 17500,
    change: 2.9,
    percentage: 18.0,
  },
  {
    category: 'Labor',
    currentMonth: 15000,
    previousMonth: 15000,
    change: 0.0,
    percentage: 15.0,
  },
  {
    category: 'Marketing',
    currentMonth: 12000,
    previousMonth: 10000,
    change: 20.0,
    percentage: 12.0,
  },
  {
    category: 'Operations',
    currentMonth: 10000,
    previousMonth: 9500,
    change: 5.3,
    percentage: 10.0,
  },
];

const mockCashFlowData = [
  {
    period: '2024-01',
    inflow: 105000,
    outflow: 89000,
    netFlow: 16000,
    cumulativeFlow: 16000,
  },
  {
    period: '2024-02',
    inflow: 118000,
    outflow: 95000,
    netFlow: 23000,
    cumulativeFlow: 39000,
  },
  {
    period: '2024-03',
    inflow: 132000,
    outflow: 105000,
    netFlow: 27000,
    cumulativeFlow: 66000,
  },
  {
    period: '2024-04',
    inflow: 125000,
    outflow: 98000,
    netFlow: 27000,
    cumulativeFlow: 93000,
  },
  {
    period: '2024-05',
    inflow: 145000,
    outflow: 115000,
    netFlow: 30000,
    cumulativeFlow: 123000,
  },
  {
    period: '2024-06',
    inflow: 158000,
    outflow: 125000,
    netFlow: 33000,
    cumulativeFlow: 156000,
  },
];

const mockROIAnalysis = [
  {
    campaign: 'Eid Special Collection',
    investment: 25000,
    revenue: 95000,
    profit: 28500,
    roi: 114.0,
    duration: '30 days',
  },
  {
    campaign: 'Social Media Marketing',
    investment: 15000,
    revenue: 52000,
    profit: 15600,
    roi: 104.0,
    duration: '90 days',
  },
  {
    campaign: 'Influencer Partnerships',
    investment: 20000,
    revenue: 68000,
    profit: 20400,
    roi: 102.0,
    duration: '60 days',
  },
];

const mockBreakEvenAnalysis = [
  {
    productId: 'prod_new_001',
    productName: 'Limited Edition Oud',
    fixedCosts: 50000,
    variableCostPerUnit: 75.0,
    sellingPricePerUnit: 250.0,
    breakEvenUnits: 286,
    breakEvenRevenue: 71500,
    monthsToBreakEven: 4.2,
  },
  {
    productId: 'prod_new_002',
    productName: 'Rose Gold Collection',
    fixedCosts: 35000,
    variableCostPerUnit: 45.0,
    sellingPricePerUnit: 180.0,
    breakEvenUnits: 259,
    breakEvenRevenue: 46620,
    monthsToBreakEven: 3.1,
  },
];

const mockFinancialKPIs = {
  grossMargin: 31.2,
  netMargin: 18.5,
  currentRatio: 2.4,
  quickRatio: 1.8,
  debtToEquity: 0.3,
  returnOnAssets: 15.2,
  returnOnEquity: 22.8,
  inventoryTurnover: 4.2,
  receivablesTurnover: 8.5,
  workingCapital: 125000,
};

export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const period = searchParams.get('period') || 'monthly';
    const storeId = searchParams.get('storeId');

    let responseData: any = {};

    switch (type) {
      case 'profitability':
        responseData = {
          productProfitability: mockProfitabilityAnalysis,
          storeProfitability: mockStoreProfitability.filter(store =>
            !storeId || store.storeId === storeId
          ),
          overallMargin: 29.3,
          topPerformingProduct: mockProfitabilityAnalysis[0],
          topPerformingStore: mockStoreProfitability[0],
        };
        break;

      case 'costs':
        responseData = {
          costBreakdown: mockCostAnalysis,
          totalCosts: mockCostAnalysis.reduce((sum, cost) => sum + cost.currentMonth, 0),
          monthlyChange: mockCostAnalysis.reduce((sum, cost) => sum + cost.change, 0) / mockCostAnalysis.length,
          optimizationOpportunities: [
            'Negotiate better rates with raw material suppliers',
            'Optimize production scheduling to reduce labor costs',
            'Review marketing spend efficiency',
          ],
        };
        break;

      case 'cashflow':
        responseData = {
          cashFlowData: mockCashFlowData,
          currentBalance: mockCashFlowData[mockCashFlowData.length - 1].cumulativeFlow,
          averageMonthlyInflow: mockCashFlowData.reduce((sum, cf) => sum + cf.inflow, 0) / mockCashFlowData.length,
          averageMonthlyOutflow: mockCashFlowData.reduce((sum, cf) => sum + cf.outflow, 0) / mockCashFlowData.length,
          forecast: [
            { period: '2024-07', predicted: 35000, confidence: 85.2 },
            { period: '2024-08', predicted: 38000, confidence: 83.7 },
            { period: '2024-09', predicted: 32000, confidence: 82.1 },
          ],
        };
        break;

      case 'roi':
        responseData = {
          campaigns: mockROIAnalysis,
          averageROI: mockROIAnalysis.reduce((sum, campaign) => sum + campaign.roi, 0) / mockROIAnalysis.length,
          bestPerformingCampaign: mockROIAnalysis[0],
          totalInvestment: mockROIAnalysis.reduce((sum, campaign) => sum + campaign.investment, 0),
          totalReturn: mockROIAnalysis.reduce((sum, campaign) => sum + campaign.profit, 0),
        };
        break;

      case 'breakeven':
        responseData = {
          analysis: mockBreakEvenAnalysis,
          quickestBreakEven: mockBreakEvenAnalysis.reduce((min, product) =>
            product.monthsToBreakEven < min.monthsToBreakEven ? product : min
          ),
          totalProjectedRevenue: mockBreakEvenAnalysis.reduce((sum, product) => sum + product.breakEvenRevenue, 0),
        };
        break;

      case 'kpis':
        responseData = {
          kpis: mockFinancialKPIs,
          benchmarks: {
            grossMargin: 35.0, // Industry benchmark
            netMargin: 20.0,
            currentRatio: 2.0,
            quickRatio: 1.5,
            debtToEquity: 0.4,
            returnOnAssets: 12.0,
            returnOnEquity: 18.0,
          },
          performance: {
            grossMargin: mockFinancialKPIs.grossMargin > 35.0 ? 'above' : 'below',
            netMargin: mockFinancialKPIs.netMargin > 20.0 ? 'above' : 'below',
            currentRatio: mockFinancialKPIs.currentRatio > 2.0 ? 'above' : 'below',
          },
        };
        break;

      default:
        responseData = {
          profitability: mockProfitabilityAnalysis,
          costs: mockCostAnalysis,
          cashFlow: mockCashFlowData,
          roi: mockROIAnalysis,
          breakEven: mockBreakEvenAnalysis,
          kpis: mockFinancialKPIs,
        };
    }

    return apiResponse({
      ...responseData,
      lastUpdated: new Date().toISOString(),
      currency: 'AED',
    });
  } catch (error: any) {
    console.error('Error fetching financial analytics:', error);
    return apiError('Failed to fetch financial analytics: ' + (error.message || 'Unknown error'), 500);
  }
});