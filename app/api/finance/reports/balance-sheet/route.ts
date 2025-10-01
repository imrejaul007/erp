import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Balance Sheet schema
const balanceSheetSchema = z.object({
  asOfDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  currency: z.string().default('AED'),
  comparison: z.boolean().default(false),
  comparisonDate: z.string().optional(),
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
  includeZeroBalances: z.boolean().default(false),
});

// Generate Balance Sheet
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = {
      asOfDate: searchParams.get('asOfDate') || new Date().toISOString().split('T')[0],
      currency: searchParams.get('currency') || 'AED',
      comparison: searchParams.get('comparison') === 'true',
      comparisonDate: searchParams.get('comparisonDate'),
      format: searchParams.get('format') || 'json',
      includeZeroBalances: searchParams.get('includeZeroBalances') === 'true',
    };

    const validatedParams = balanceSheetSchema.parse(params);

    // Generate balance sheet
    const balanceSheet = await generateBalanceSheet(
      validatedParams.asOfDate,
      validatedParams.currency,
      validatedParams.includeZeroBalances
    );

    let comparisonBalanceSheet = null;
    if (validatedParams.comparison && validatedParams.comparisonDate) {
      comparisonBalanceSheet = await generateBalanceSheet(
        validatedParams.comparisonDate,
        validatedParams.currency,
        validatedParams.includeZeroBalances
      );
    }

    const reportData = {
      current: balanceSheet,
      comparison: comparisonBalanceSheet,
      variance: comparisonBalanceSheet ? calculateVariance(balanceSheet, comparisonBalanceSheet) : null,
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
        asOfDate: validatedParams.asOfDate,
        comparisonDate: validatedParams.comparisonDate,
        currency: validatedParams.currency,
        generatedAt: new Date().toISOString(),
        generatedBy: session.user?.email,
      },
    });
  } catch (error) {
    console.error('Balance Sheet Report error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to generate balance sheet' },
      { status: 500 }
    );
  }
}

// Save Balance Sheet
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { asOfDate, currency = 'AED' } = body;

    if (!asOfDate) {
      return NextResponse.json(
        { success: false, error: 'As of date is required' },
        { status: 400 }
      );
    }

    // Generate balance sheet
    const balanceSheet = await generateBalanceSheet(asOfDate, currency, true);

    // Save to database
    const bsId = generateId();

    await prisma.$executeRaw`
      INSERT INTO balance_sheets (
        id, as_of_date, currency, assets, liabilities, equity,
        total_assets, total_liabilities_and_equity, is_balanced,
        generated_at, generated_by
      ) VALUES (
        ${bsId}, ${new Date(asOfDate)}, ${currency},
        ${JSON.stringify(balanceSheet.assets)}, ${JSON.stringify(balanceSheet.liabilities)},
        ${JSON.stringify(balanceSheet.equity)}, ${balanceSheet.summary.totalAssets},
        ${balanceSheet.summary.totalLiabilitiesAndEquity}, ${balanceSheet.summary.isBalanced},
        ${new Date()}, ${session.user.id}
      )
    `;

    return NextResponse.json({
      success: true,
      data: {
        id: bsId,
        ...balanceSheet,
      },
      message: 'Balance sheet saved successfully',
    });
  } catch (error) {
    console.error('Balance Sheet POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save balance sheet' },
      { status: 500 }
    );
  }
}

// Generate Balance Sheet data
async function generateBalanceSheet(asOfDate: string, currency: string, includeZeroBalances: boolean = false) {
  const cutoffDate = new Date(asOfDate);
  cutoffDate.setHours(23, 59, 59, 999);

  // Get ASSET accounts
  const assetAccounts = await prisma.$queryRaw`
    SELECT
      a.id,
      a.code,
      a.name,
      a.name_ar,
      a.parent_id,
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as balance
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date <= ${cutoffDate}
      AND t.currency = ${currency}
    WHERE a.type = 'ASSET' AND a.is_active = true
    GROUP BY a.id, a.code, a.name, a.name_ar, a.parent_id
    ORDER BY a.code
  ` as any[];

  // Get LIABILITY accounts
  const liabilityAccounts = await prisma.$queryRaw`
    SELECT
      a.id,
      a.code,
      a.name,
      a.name_ar,
      a.parent_id,
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END), 0) as balance
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date <= ${cutoffDate}
      AND t.currency = ${currency}
    WHERE a.type = 'LIABILITY' AND a.is_active = true
    GROUP BY a.id, a.code, a.name, a.name_ar, a.parent_id
    ORDER BY a.code
  ` as any[];

  // Get EQUITY accounts
  const equityAccounts = await prisma.$queryRaw`
    SELECT
      a.id,
      a.code,
      a.name,
      a.name_ar,
      a.parent_id,
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END), 0) as balance
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date <= ${cutoffDate}
      AND t.currency = ${currency}
    WHERE a.type = 'EQUITY' AND a.is_active = true
    GROUP BY a.id, a.code, a.name, a.name_ar, a.parent_id
    ORDER BY a.code
  ` as any[];

  // Calculate retained earnings (Net Income from previous periods)
  const retainedEarnings = await calculateRetainedEarnings(cutoffDate, currency);

  // Format account data
  const formatAccounts = (accounts: any[]) => {
    const filtered = includeZeroBalances ? accounts : accounts.filter(acc => Math.abs(Number(acc.balance)) > 0.01);
    return filtered.map(acc => ({
      accountId: acc.id,
      accountCode: acc.code,
      accountName: acc.name,
      accountNameAr: acc.name_ar,
      parentId: acc.parent_id,
      amount: Number(acc.balance),
    }));
  };

  const assets = formatAccounts(assetAccounts);
  const liabilities = formatAccounts(liabilityAccounts);
  const equity = formatAccounts(equityAccounts);

  // Organize assets into subsections
  const currentAssets = assets.filter(acc => acc.accountCode.startsWith('11'));
  const fixedAssets = assets.filter(acc => acc.accountCode.startsWith('12'));
  const otherAssets = assets.filter(acc => !acc.accountCode.startsWith('11') && !acc.accountCode.startsWith('12'));

  // Organize liabilities into subsections
  const currentLiabilities = liabilities.filter(acc => acc.accountCode.startsWith('21'));
  const longTermLiabilities = liabilities.filter(acc => acc.accountCode.startsWith('22'));
  const otherLiabilities = liabilities.filter(acc => !acc.accountCode.startsWith('21') && !acc.accountCode.startsWith('22'));

  // Calculate totals
  const totalCurrentAssets = currentAssets.reduce((sum, acc) => sum + acc.amount, 0);
  const totalFixedAssets = fixedAssets.reduce((sum, acc) => sum + acc.amount, 0);
  const totalOtherAssets = otherAssets.reduce((sum, acc) => sum + acc.amount, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets + totalOtherAssets;

  const totalCurrentLiabilities = currentLiabilities.reduce((sum, acc) => sum + acc.amount, 0);
  const totalLongTermLiabilities = longTermLiabilities.reduce((sum, acc) => sum + acc.amount, 0);
  const totalOtherLiabilities = otherLiabilities.reduce((sum, acc) => sum + acc.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities + totalOtherLiabilities;

  const totalEquity = equity.reduce((sum, acc) => sum + acc.amount, 0) + retainedEarnings;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  // Check if balance sheet balances
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

  return {
    asOfDate,
    currency,
    assets: {
      total: totalAssets,
      subsections: [
        {
          name: 'Current Assets',
          nameAr: 'الأصول المتداولة',
          total: totalCurrentAssets,
          items: currentAssets,
        },
        {
          name: 'Fixed Assets',
          nameAr: 'الأصول الثابتة',
          total: totalFixedAssets,
          items: fixedAssets,
        },
        ...(totalOtherAssets > 0.01 ? [{
          name: 'Other Assets',
          nameAr: 'أصول أخرى',
          total: totalOtherAssets,
          items: otherAssets,
        }] : []),
      ],
    },
    liabilities: {
      total: totalLiabilities,
      subsections: [
        {
          name: 'Current Liabilities',
          nameAr: 'الخصوم المتداولة',
          total: totalCurrentLiabilities,
          items: currentLiabilities,
        },
        {
          name: 'Long-term Liabilities',
          nameAr: 'الخصوم طويلة الأجل',
          total: totalLongTermLiabilities,
          items: longTermLiabilities,
        },
        ...(totalOtherLiabilities > 0.01 ? [{
          name: 'Other Liabilities',
          nameAr: 'خصوم أخرى',
          total: totalOtherLiabilities,
          items: otherLiabilities,
        }] : []),
      ],
    },
    equity: {
      total: totalEquity,
      subsections: [
        {
          name: 'Share Capital & Reserves',
          nameAr: 'رأس المال والاحتياطيات',
          total: equity.reduce((sum, acc) => sum + acc.amount, 0),
          items: equity,
        },
        ...(Math.abs(retainedEarnings) > 0.01 ? [{
          name: 'Retained Earnings',
          nameAr: 'الأرباح المحتجزة',
          total: retainedEarnings,
          items: [{
            accountId: 'retained_earnings',
            accountCode: 'RE',
            accountName: 'Retained Earnings',
            accountNameAr: 'الأرباح المحتجزة',
            parentId: null,
            amount: retainedEarnings,
          }],
        }] : []),
      ],
    },
    summary: {
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalLiabilitiesAndEquity,
      difference: totalAssets - totalLiabilitiesAndEquity,
      isBalanced,
      workingCapital: totalCurrentAssets - totalCurrentLiabilities,
    },
  };
}

// Calculate retained earnings
async function calculateRetainedEarnings(cutoffDate: Date, currency: string): Promise<number> {
  // Calculate net income from revenue and expense accounts up to cutoff date
  const netIncome = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(
        CASE
          WHEN a.type = 'REVENUE' THEN
            CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END
          WHEN a.type = 'EXPENSE' THEN
            CASE WHEN t.type = 'DEBIT' THEN -t.amount ELSE t.amount END
          ELSE 0
        END
      ), 0) as net_income
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date <= ${cutoffDate}
      AND t.currency = ${currency}
    WHERE a.type IN ('REVENUE', 'EXPENSE') AND a.is_active = true
  ` as any[];

  return Number(netIncome[0]?.net_income || 0);
}

// Calculate variance between two balance sheets
function calculateVariance(current: any, comparison: any) {
  const calculateVarianceAmount = (current: number, comparison: number) => current - comparison;
  const calculateVariancePercent = (current: number, comparison: number) =>
    comparison !== 0 ? ((current - comparison) / comparison) * 100 : 0;

  return {
    assets: {
      amount: calculateVarianceAmount(current.summary.totalAssets, comparison.summary.totalAssets),
      percent: calculateVariancePercent(current.summary.totalAssets, comparison.summary.totalAssets),
    },
    liabilities: {
      amount: calculateVarianceAmount(current.summary.totalLiabilities, comparison.summary.totalLiabilities),
      percent: calculateVariancePercent(current.summary.totalLiabilities, comparison.summary.totalLiabilities),
    },
    equity: {
      amount: calculateVarianceAmount(current.summary.totalEquity, comparison.summary.totalEquity),
      percent: calculateVariancePercent(current.summary.totalEquity, comparison.summary.totalEquity),
    },
    workingCapital: {
      amount: calculateVarianceAmount(current.summary.workingCapital, comparison.summary.workingCapital),
      percent: calculateVariancePercent(current.summary.workingCapital, comparison.summary.workingCapital),
    },
  };
}

// Generate CSV export
function generateCSVResponse(reportData: any) {
  const current = reportData.current;
  let csvContent = 'BALANCE SHEET\n';
  csvContent += `As of: ${current.asOfDate}\n`;
  csvContent += `Currency: ${current.currency}\n\n`;

  csvContent += 'Account,Amount\n';

  // Assets
  csvContent += 'ASSETS\n';
  current.assets.subsections.forEach((subsection: any) => {
    csvContent += `${subsection.name}\n`;
    subsection.items.forEach((item: any) => {
      csvContent += `  ${item.accountName},${item.amount}\n`;
    });
    csvContent += `Total ${subsection.name},${subsection.total}\n\n`;
  });
  csvContent += `TOTAL ASSETS,${current.summary.totalAssets}\n\n`;

  // Liabilities
  csvContent += 'LIABILITIES\n';
  current.liabilities.subsections.forEach((subsection: any) => {
    csvContent += `${subsection.name}\n`;
    subsection.items.forEach((item: any) => {
      csvContent += `  ${item.accountName},${item.amount}\n`;
    });
    csvContent += `Total ${subsection.name},${subsection.total}\n\n`;
  });
  csvContent += `TOTAL LIABILITIES,${current.summary.totalLiabilities}\n\n`;

  // Equity
  csvContent += 'EQUITY\n';
  current.equity.subsections.forEach((subsection: any) => {
    csvContent += `${subsection.name}\n`;
    subsection.items.forEach((item: any) => {
      csvContent += `  ${item.accountName},${item.amount}\n`;
    });
    csvContent += `Total ${subsection.name},${subsection.total}\n\n`;
  });
  csvContent += `TOTAL EQUITY,${current.summary.totalEquity}\n\n`;

  csvContent += `TOTAL LIABILITIES & EQUITY,${current.summary.totalLiabilitiesAndEquity}\n`;
  csvContent += `BALANCED,${current.summary.isBalanced ? 'Yes' : 'No'}\n`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="balance-sheet-${current.asOfDate}.csv"`,
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
  return `bs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}