import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Profit & Loss Report schema
const profitLossSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  currency: z.string().default('AED'),
  comparison: z.boolean().default(false),
  comparisonStartDate: z.string().optional(),
  comparisonEndDate: z.string().optional(),
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
});

// Generate Profit & Loss Statement
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = {
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      currency: searchParams.get('currency') || 'AED',
      comparison: searchParams.get('comparison') === 'true',
      comparisonStartDate: searchParams.get('comparisonStartDate'),
      comparisonEndDate: searchParams.get('comparisonEndDate'),
      format: searchParams.get('format') || 'json',
    };

    if (!params.startDate || !params.endDate) {
      return NextResponse.json(
        { success: false, error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const validatedParams = profitLossSchema.parse(params);

    // Generate P&L statement
    const profitLossStatement = await generateProfitLossStatement(
      validatedParams.startDate,
      validatedParams.endDate,
      validatedParams.currency
    );

    let comparisonStatement = null;
    if (validatedParams.comparison && validatedParams.comparisonStartDate && validatedParams.comparisonEndDate) {
      comparisonStatement = await generateProfitLossStatement(
        validatedParams.comparisonStartDate,
        validatedParams.comparisonEndDate,
        validatedParams.currency
      );
    }

    const reportData = {
      current: profitLossStatement,
      comparison: comparisonStatement,
      variance: comparisonStatement ? calculateVariance(profitLossStatement, comparisonStatement) : null,
    };

    // Handle different output formats
    if (validatedParams.format === 'csv') {
      return generateCSVResponse(reportData);
    } else if (validatedParams.format === 'pdf') {
      return generatePDFResponse(reportData);
    }

    return NextResponse.json({
      success: true,
      data: reportData,
      metadata: {
        period: {
          startDate: validatedParams.startDate,
          endDate: validatedParams.endDate,
        },
        comparisonPeriod: validatedParams.comparison ? {
          startDate: validatedParams.comparisonStartDate,
          endDate: validatedParams.comparisonEndDate,
        } : null,
        currency: validatedParams.currency,
        generatedAt: new Date().toISOString(),
        generatedBy: session.user?.email,
      },
    });
  } catch (error) {
    console.error('Profit & Loss Report error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to generate profit & loss statement' },
      { status: 500 }
    );
  }
}

// Save Profit & Loss Statement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { startDate, endDate, currency = 'AED' } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Generate P&L statement
    const profitLossStatement = await generateProfitLossStatement(startDate, endDate, currency);

    // Save to database
    const plId = generateId();
    const period = `${new Date(startDate).toISOString().substring(0, 7)}_${new Date(endDate).toISOString().substring(0, 7)}`;

    await prisma.$executeRaw`
      INSERT INTO profit_loss_statements (
        id, period, period_type, start_date, end_date, currency,
        revenue, cost_of_goods_sold, gross_profit, operating_expenses,
        operating_income, other_income, other_expenses, net_profit_before_tax,
        tax_expense, net_profit_after_tax, generated_at, generated_by
      ) VALUES (
        ${plId}, ${period}, 'CUSTOM', ${new Date(startDate)}, ${new Date(endDate)},
        ${currency}, ${profitLossStatement.summary.totalRevenue},
        ${profitLossStatement.summary.totalCOGS}, ${profitLossStatement.summary.grossProfit},
        ${profitLossStatement.summary.totalOperatingExpenses}, ${profitLossStatement.summary.operatingIncome},
        ${profitLossStatement.summary.totalOtherIncome}, ${profitLossStatement.summary.totalOtherExpenses},
        ${profitLossStatement.summary.netProfitBeforeTax}, ${profitLossStatement.summary.taxExpense},
        ${profitLossStatement.summary.netProfitAfterTax}, ${new Date()}, ${session.user.id}
      )
    `;

    return NextResponse.json({
      success: true,
      data: {
        id: plId,
        ...profitLossStatement,
      },
      message: 'Profit & Loss statement saved successfully',
    });
  } catch (error) {
    console.error('Profit & Loss POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save profit & loss statement' },
      { status: 500 }
    );
  }
}

// Generate Profit & Loss Statement data
async function generateProfitLossStatement(startDate: string, endDate: string, currency: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // Get all revenue accounts
  const revenueAccounts = await prisma.$queryRaw`
    SELECT
      a.id,
      a.code,
      a.name,
      a.name_ar,
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END), 0) as amount
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
    WHERE a.type = 'REVENUE' AND a.is_active = true
    GROUP BY a.id, a.code, a.name, a.name_ar
    ORDER BY a.code
  ` as any[];

  // Get Cost of Goods Sold accounts
  const cogsAccounts = await prisma.$queryRaw`
    SELECT
      a.id,
      a.code,
      a.name,
      a.name_ar,
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as amount
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
    WHERE a.type = 'EXPENSE' AND a.code LIKE '5%' AND a.is_active = true
    GROUP BY a.id, a.code, a.name, a.name_ar
    ORDER BY a.code
  ` as any[];

  // Get Operating Expense accounts
  const operatingExpenseAccounts = await prisma.$queryRaw`
    SELECT
      a.id,
      a.code,
      a.name,
      a.name_ar,
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as amount
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
    WHERE a.type = 'EXPENSE' AND a.code LIKE '6%' AND a.is_active = true
    GROUP BY a.id, a.code, a.name, a.name_ar
    ORDER BY a.code
  ` as any[];

  // Get Other Income/Expense accounts
  const otherIncomeAccounts = await prisma.$queryRaw`
    SELECT
      a.id,
      a.code,
      a.name,
      a.name_ar,
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END), 0) as amount
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
    WHERE a.type = 'REVENUE' AND a.code LIKE '42%' AND a.is_active = true
    GROUP BY a.id, a.code, a.name, a.name_ar
    ORDER BY a.code
  ` as any[];

  const otherExpenseAccounts = await prisma.$queryRaw`
    SELECT
      a.id,
      a.code,
      a.name,
      a.name_ar,
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as amount
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
    WHERE a.type = 'EXPENSE' AND a.code LIKE '7%' AND a.is_active = true
    GROUP BY a.id, a.code, a.name, a.name_ar
    ORDER BY a.code
  ` as any[];

  // Format account data
  const formatAccounts = (accounts: any[]) =>
    accounts.map(acc => ({
      accountId: acc.id,
      accountCode: acc.code,
      accountName: acc.name,
      accountNameAr: acc.name_ar,
      amount: Number(acc.amount),
    }));

  const revenue = formatAccounts(revenueAccounts);
  const cogs = formatAccounts(cogsAccounts);
  const operatingExpenses = formatAccounts(operatingExpenseAccounts);
  const otherIncome = formatAccounts(otherIncomeAccounts);
  const otherExpenses = formatAccounts(otherExpenseAccounts);

  // Calculate totals
  const totalRevenue = revenue.reduce((sum, acc) => sum + acc.amount, 0);
  const totalCOGS = cogs.reduce((sum, acc) => sum + acc.amount, 0);
  const grossProfit = totalRevenue - totalCOGS;
  const totalOperatingExpenses = operatingExpenses.reduce((sum, acc) => sum + acc.amount, 0);
  const operatingIncome = grossProfit - totalOperatingExpenses;
  const totalOtherIncome = otherIncome.reduce((sum, acc) => sum + acc.amount, 0);
  const totalOtherExpenses = otherExpenses.reduce((sum, acc) => sum + acc.amount, 0);
  const netProfitBeforeTax = operatingIncome + totalOtherIncome - totalOtherExpenses;

  // Calculate tax (simplified - would need proper tax calculation)
  const taxRate = 0.0; // UAE typically has 0% corporate tax for most businesses
  const taxExpense = netProfitBeforeTax > 0 ? netProfitBeforeTax * taxRate : 0;
  const netProfitAfterTax = netProfitBeforeTax - taxExpense;

  // Calculate percentages
  const calculatePercentage = (amount: number, base: number) =>
    base !== 0 ? (amount / base) * 100 : 0;

  return {
    period: {
      startDate,
      endDate,
    },
    currency,
    revenue: {
      total: totalRevenue,
      items: revenue.map(item => ({
        ...item,
        percentage: calculatePercentage(item.amount, totalRevenue),
      })),
    },
    costOfGoodsSold: {
      total: totalCOGS,
      items: cogs.map(item => ({
        ...item,
        percentage: calculatePercentage(item.amount, totalRevenue),
      })),
    },
    operatingExpenses: {
      total: totalOperatingExpenses,
      items: operatingExpenses.map(item => ({
        ...item,
        percentage: calculatePercentage(item.amount, totalRevenue),
      })),
    },
    otherIncome: {
      total: totalOtherIncome,
      items: otherIncome.map(item => ({
        ...item,
        percentage: calculatePercentage(item.amount, totalRevenue),
      })),
    },
    otherExpenses: {
      total: totalOtherExpenses,
      items: otherExpenses.map(item => ({
        ...item,
        percentage: calculatePercentage(item.amount, totalRevenue),
      })),
    },
    summary: {
      totalRevenue,
      totalCOGS,
      grossProfit,
      grossProfitMargin: calculatePercentage(grossProfit, totalRevenue),
      totalOperatingExpenses,
      operatingIncome,
      operatingMargin: calculatePercentage(operatingIncome, totalRevenue),
      totalOtherIncome,
      totalOtherExpenses,
      netProfitBeforeTax,
      netMarginBeforeTax: calculatePercentage(netProfitBeforeTax, totalRevenue),
      taxExpense,
      netProfitAfterTax,
      netMarginAfterTax: calculatePercentage(netProfitAfterTax, totalRevenue),
    },
  };
}

// Calculate variance between two P&L statements
function calculateVariance(current: any, comparison: any) {
  const calculateVarianceAmount = (current: number, comparison: number) => current - comparison;
  const calculateVariancePercent = (current: number, comparison: number) =>
    comparison !== 0 ? ((current - comparison) / comparison) * 100 : 0;

  return {
    revenue: {
      amount: calculateVarianceAmount(current.summary.totalRevenue, comparison.summary.totalRevenue),
      percent: calculateVariancePercent(current.summary.totalRevenue, comparison.summary.totalRevenue),
    },
    grossProfit: {
      amount: calculateVarianceAmount(current.summary.grossProfit, comparison.summary.grossProfit),
      percent: calculateVariancePercent(current.summary.grossProfit, comparison.summary.grossProfit),
    },
    operatingIncome: {
      amount: calculateVarianceAmount(current.summary.operatingIncome, comparison.summary.operatingIncome),
      percent: calculateVariancePercent(current.summary.operatingIncome, comparison.summary.operatingIncome),
    },
    netProfitAfterTax: {
      amount: calculateVarianceAmount(current.summary.netProfitAfterTax, comparison.summary.netProfitAfterTax),
      percent: calculateVariancePercent(current.summary.netProfitAfterTax, comparison.summary.netProfitAfterTax),
    },
  };
}

// Generate CSV export
function generateCSVResponse(reportData: any) {
  const current = reportData.current;
  let csvContent = 'PROFIT & LOSS STATEMENT\n';
  csvContent += `Period: ${current.period.startDate} to ${current.period.endDate}\n`;
  csvContent += `Currency: ${current.currency}\n\n`;

  csvContent += 'Account,Amount,Percentage\n';

  // Revenue
  csvContent += 'REVENUE\n';
  current.revenue.items.forEach((item: any) => {
    csvContent += `${item.accountName},${item.amount},${item.percentage.toFixed(2)}%\n`;
  });
  csvContent += `Total Revenue,${current.revenue.total},100.00%\n\n`;

  // COGS
  csvContent += 'COST OF GOODS SOLD\n';
  current.costOfGoodsSold.items.forEach((item: any) => {
    csvContent += `${item.accountName},${item.amount},${item.percentage.toFixed(2)}%\n`;
  });
  csvContent += `Total COGS,${current.costOfGoodsSold.total},${current.summary.totalCOGS > 0 ? ((current.summary.totalCOGS / current.summary.totalRevenue) * 100).toFixed(2) : '0.00'}%\n\n`;

  csvContent += `Gross Profit,${current.summary.grossProfit},${current.summary.grossProfitMargin.toFixed(2)}%\n\n`;

  // Operating Expenses
  csvContent += 'OPERATING EXPENSES\n';
  current.operatingExpenses.items.forEach((item: any) => {
    csvContent += `${item.accountName},${item.amount},${item.percentage.toFixed(2)}%\n`;
  });
  csvContent += `Total Operating Expenses,${current.operatingExpenses.total}\n\n`;

  csvContent += `Operating Income,${current.summary.operatingIncome},${current.summary.operatingMargin.toFixed(2)}%\n`;
  csvContent += `Net Profit After Tax,${current.summary.netProfitAfterTax},${current.summary.netMarginAfterTax.toFixed(2)}%\n`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="profit-loss-${current.period.startDate}-to-${current.period.endDate}.csv"`,
    },
  });
}

// Generate PDF export (placeholder)
function generatePDFResponse(reportData: any) {
  return NextResponse.json({
    success: false,
    error: 'PDF export not implemented yet',
    message: 'Please use CSV export or implement PDF generation library',
  });
}

function generateId(): string {
  return `pl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}