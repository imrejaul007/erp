import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get comprehensive finance dashboard data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'AED';
    const period = searchParams.get('period') || getCurrentPeriod();

    // Get cash position
    const cashPosition = await getCashPosition(currency);

    // Get VAT summary
    const vatSummary = await getVATSummary(period);

    // Get profit & loss summary
    const profitLoss = await getProfitLossSummary(period, currency);

    // Get receivables summary
    const receivables = await getReceivablesSummary(currency);

    // Get payables summary
    const payables = await getPayablesSummary(currency);

    // Get recent transactions
    const recentTransactions = await getRecentTransactions(10, currency);

    // Get financial KPIs
    const kpis = await getFinancialKPIs(period, currency);

    const dashboardData = {
      period,
      currency,
      cashPosition,
      vatSummary,
      profitLoss,
      receivables,
      payables,
      recentTransactions,
      kpis,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Finance Dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch finance dashboard data' },
      { status: 500 }
    );
  }
}

// Get cash position
async function getCashPosition(currency: string) {
  const cashAccounts = await prisma.$queryRaw`
    SELECT
      a.id,
      a.code,
      a.name,
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as balance
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.currency = ${currency}
    WHERE a.code IN ('1110', '1120') -- Cash in Hand and Bank Accounts
      AND a.is_active = true
    GROUP BY a.id, a.code, a.name
    ORDER BY a.code
  ` as any[];

  const totalCash = cashAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  return {
    totalCash,
    bankAccounts: cashAccounts.map(acc => ({
      accountId: acc.id,
      accountCode: acc.code,
      accountName: acc.name,
      balance: Number(acc.balance),
      currency,
    })),
  };
}

// Get VAT summary
async function getVATSummary(period: string) {
  const vatRecords = await prisma.vATRecord.findMany({
    where: {
      period,
      status: 'ACTIVE',
    },
  });

  let outputVAT = 0;
  let inputVAT = 0;

  vatRecords.forEach(record => {
    if (record.type === 'OUTPUT') {
      outputVAT += Number(record.vatAmount);
    } else {
      inputVAT += Number(record.vatAmount);
    }
  });

  const netVATDue = outputVAT - inputVAT;
  const filingDueDate = getFilingDueDate(period);

  return {
    currentPeriod: period,
    outputVAT,
    inputVAT,
    netVATDue,
    filingDueDate,
    isOverdue: new Date() > filingDueDate,
    daysUntilDue: Math.ceil((filingDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  };
}

// Get profit & loss summary
async function getProfitLossSummary(period: string, currency: string) {
  const [year, month] = period.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // Get revenue
  const revenue = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END), 0) as total
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date >= ${startDate}
      AND t.transaction_date <= ${endDate}
      AND t.currency = ${currency}
    WHERE a.type = 'REVENUE' AND a.is_active = true
  ` as any[];

  // Get expenses
  const expenses = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as total
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date >= ${startDate}
      AND t.transaction_date <= ${endDate}
      AND t.currency = ${currency}
    WHERE a.type = 'EXPENSE' AND a.is_active = true
  ` as any[];

  const totalRevenue = Number(revenue[0]?.total || 0);
  const totalExpenses = Number(expenses[0]?.total || 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return {
    revenue: totalRevenue,
    expenses: totalExpenses,
    netProfit,
    profitMargin,
  };
}

// Get receivables summary
async function getReceivablesSummary(currency: string) {
  const receivables = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as total
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.currency = ${currency}
    WHERE a.code = '1130' -- Accounts Receivable
      AND a.is_active = true
  ` as any[];

  // Get overdue receivables (simplified - assumes 30 days payment terms)
  const overdueDate = new Date();
  overdueDate.setDate(overdueDate.getDate() - 30);

  const overdue = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as total
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date <= ${overdueDate}
      AND t.currency = ${currency}
    WHERE a.code = '1130' -- Accounts Receivable
      AND a.is_active = true
  ` as any[];

  const totalReceivables = Number(receivables[0]?.total || 0);
  const overdueAmount = Number(overdue[0]?.total || 0);
  const currentAmount = totalReceivables - overdueAmount;

  return {
    total: totalReceivables,
    current: currentAmount,
    overdue: overdueAmount,
  };
}

// Get payables summary
async function getPayablesSummary(currency: string) {
  const payables = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END), 0) as total
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.currency = ${currency}
    WHERE a.code = '2110' -- Accounts Payable
      AND a.is_active = true
  ` as any[];

  // Get overdue payables (simplified - assumes 30 days payment terms)
  const overdueDate = new Date();
  overdueDate.setDate(overdueDate.getDate() - 30);

  const overdue = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END), 0) as total
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date <= ${overdueDate}
      AND t.currency = ${currency}
    WHERE a.code = '2110' -- Accounts Payable
      AND a.is_active = true
  ` as any[];

  const totalPayables = Number(payables[0]?.total || 0);
  const overdueAmount = Number(overdue[0]?.total || 0);
  const currentAmount = totalPayables - overdueAmount;

  return {
    total: totalPayables,
    current: currentAmount,
    overdue: overdueAmount,
  };
}

// Get recent transactions
async function getRecentTransactions(limit: number, currency: string) {
  const transactions = await prisma.$queryRaw`
    SELECT
      t.id,
      t.transaction_no,
      t.type,
      t.amount,
      t.currency,
      t.description,
      t.transaction_date,
      t.reference_type,
      t.reference_id,
      a.code as account_code,
      a.name as account_name
    FROM transactions t
    LEFT JOIN accounts a ON t.account_id = a.id
    WHERE t.status = 'COMPLETED'
      AND t.currency = ${currency}
    ORDER BY t.transaction_date DESC, t.created_at DESC
    LIMIT ${limit}
  ` as any[];

  return transactions.map(tx => ({
    id: tx.id,
    transactionNo: tx.transaction_no,
    type: tx.type,
    amount: Number(tx.amount),
    currency: tx.currency,
    description: tx.description,
    transactionDate: tx.transaction_date,
    referenceType: tx.reference_type,
    referenceId: tx.reference_id,
    account: {
      code: tx.account_code,
      name: tx.account_name,
    },
  }));
}

// Get financial KPIs
async function getFinancialKPIs(period: string, currency: string) {
  const [year, month] = period.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // Current ratio (Current Assets / Current Liabilities)
  const currentAssets = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as total
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.currency = ${currency}
    WHERE a.code LIKE '11%' AND a.is_active = true
  ` as any[];

  const currentLiabilities = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END), 0) as total
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.currency = ${currency}
    WHERE a.code LIKE '21%' AND a.is_active = true
  ` as any[];

  const currentAssetsTotal = Number(currentAssets[0]?.total || 0);
  const currentLiabilitiesTotal = Number(currentLiabilities[0]?.total || 0);
  const currentRatio = currentLiabilitiesTotal > 0 ? currentAssetsTotal / currentLiabilitiesTotal : 0;

  // Quick ratio (Quick Assets / Current Liabilities)
  const quickAssets = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as total
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.currency = ${currency}
    WHERE a.code IN ('1110', '1120', '1130') AND a.is_active = true
  ` as any[];

  const quickAssetsTotal = Number(quickAssets[0]?.total || 0);
  const quickRatio = currentLiabilitiesTotal > 0 ? quickAssetsTotal / currentLiabilitiesTotal : 0;

  return {
    currentRatio: Math.round(currentRatio * 100) / 100,
    quickRatio: Math.round(quickRatio * 100) / 100,
    workingCapital: currentAssetsTotal - currentLiabilitiesTotal,
  };
}

// Helper functions
function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getFilingDueDate(period: string): Date {
  const [year, month] = period.split('-').map(Number);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return new Date(nextYear, nextMonth - 1, 28); // 28th of following month
}