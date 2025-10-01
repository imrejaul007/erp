import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Cash Flow Statement schema
const cashFlowSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  currency: z.string().default('AED'),
  method: z.enum(['direct', 'indirect']).default('indirect'),
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
});

// Generate Cash Flow Statement
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
      method: searchParams.get('method') || 'indirect',
      format: searchParams.get('format') || 'json',
    };

    if (!params.startDate || !params.endDate) {
      return NextResponse.json(
        { success: false, error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const validatedParams = cashFlowSchema.parse(params);

    // Generate cash flow statement
    const cashFlowStatement = await generateCashFlowStatement(
      validatedParams.startDate,
      validatedParams.endDate,
      validatedParams.currency,
      validatedParams.method
    );

    // Handle different output formats
    if (validatedParams.format === 'csv') {
      return generateCSVResponse(cashFlowStatement);
    } else if (validatedParams.format === 'pdf') {
      return generatePDFResponse(cashFlowStatement);
    }

    return NextResponse.json({
      success: true,
      data: cashFlowStatement,
      metadata: {
        period: {
          startDate: validatedParams.startDate,
          endDate: validatedParams.endDate,
        },
        currency: validatedParams.currency,
        method: validatedParams.method,
        generatedAt: new Date().toISOString(),
        generatedBy: session.user?.email,
      },
    });
  } catch (error) {
    console.error('Cash Flow Statement error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to generate cash flow statement' },
      { status: 500 }
    );
  }
}

// Save Cash Flow Statement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { startDate, endDate, currency = 'AED', method = 'indirect' } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Generate cash flow statement
    const cashFlowStatement = await generateCashFlowStatement(startDate, endDate, currency, method);

    // Save to database
    const cfId = generateId();
    const period = `${new Date(startDate).toISOString().substring(0, 7)}_${new Date(endDate).toISOString().substring(0, 7)}`;

    await prisma.$executeRaw`
      INSERT INTO cash_flow_statements (
        id, period, start_date, end_date, currency, operating_activities,
        investing_activities, financing_activities, net_cash_flow,
        opening_cash_balance, closing_cash_balance, generated_at, generated_by
      ) VALUES (
        ${cfId}, ${period}, ${new Date(startDate)}, ${new Date(endDate)}, ${currency},
        ${JSON.stringify(cashFlowStatement.operatingActivities)},
        ${JSON.stringify(cashFlowStatement.investingActivities)},
        ${JSON.stringify(cashFlowStatement.financingActivities)},
        ${cashFlowStatement.summary.netCashFlow}, ${cashFlowStatement.summary.openingCashBalance},
        ${cashFlowStatement.summary.closingCashBalance}, ${new Date()}, ${session.user.id}
      )
    `;

    return NextResponse.json({
      success: true,
      data: {
        id: cfId,
        ...cashFlowStatement,
      },
      message: 'Cash flow statement saved successfully',
    });
  } catch (error) {
    console.error('Cash Flow Statement POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save cash flow statement' },
      { status: 500 }
    );
  }
}

// Generate Cash Flow Statement data
async function generateCashFlowStatement(startDate: string, endDate: string, currency: string, method: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // Get opening and closing cash balances
  const openingCashBalance = await getCashBalance(start, currency, false);
  const closingCashBalance = await getCashBalance(end, currency, true);

  let operatingActivities: any;

  if (method === 'direct') {
    operatingActivities = await generateDirectCashFlow(start, end, currency);
  } else {
    operatingActivities = await generateIndirectCashFlow(start, end, currency);
  }

  // Generate investing activities
  const investingActivities = await generateInvestingActivities(start, end, currency);

  // Generate financing activities
  const financingActivities = await generateFinancingActivities(start, end, currency);

  // Calculate net cash flow
  const netCashFlow = operatingActivities.total + investingActivities.total + financingActivities.total;

  return {
    period: {
      startDate,
      endDate,
    },
    currency,
    method,
    operatingActivities,
    investingActivities,
    financingActivities,
    summary: {
      netCashFlow,
      openingCashBalance,
      closingCashBalance,
      calculatedClosingBalance: openingCashBalance + netCashFlow,
      reconciliation: Math.abs(closingCashBalance - (openingCashBalance + netCashFlow)) < 0.01,
    },
  };
}

// Get cash balance at a specific date
async function getCashBalance(date: Date, currency: string, inclusive: boolean = true) {
  const operator = inclusive ? '<=' : '<';

  const cashAccounts = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as balance
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date ${operator} ${date}
      AND t.currency = ${currency}
    WHERE a.code IN ('1110', '1120') -- Cash in Hand and Bank Accounts
      AND a.is_active = true
  ` as any[];

  return Number(cashAccounts[0]?.balance || 0);
}

// Generate operating activities using indirect method
async function generateIndirectCashFlow(start: Date, end: Date, currency: string) {
  // Start with net income
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
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
    WHERE a.type IN ('REVENUE', 'EXPENSE') AND a.is_active = true
  ` as any[];

  // Get depreciation expense
  const depreciation = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as depreciation
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id
      AND t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
    WHERE a.name ILIKE '%depreciation%' AND a.type = 'EXPENSE' AND a.is_active = true
  ` as any[];

  // Calculate changes in working capital
  const workingCapitalChanges = await calculateWorkingCapitalChanges(start, end, currency);

  const items = [
    {
      description: 'Net Income',
      amount: Number(netIncome[0]?.net_income || 0),
      category: 'net_income',
    },
    {
      description: 'Depreciation and Amortization',
      amount: Number(depreciation[0]?.depreciation || 0),
      category: 'non_cash_expenses',
    },
    ...workingCapitalChanges,
  ];

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return {
    total,
    items,
  };
}

// Generate operating activities using direct method
async function generateDirectCashFlow(start: Date, end: Date, currency: string) {
  // Cash receipts from customers
  const cashFromCustomers = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(t.amount), 0) as amount
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
      AND a.code IN ('1110', '1120') -- Cash accounts
      AND t.type = 'DEBIT'
      AND t.reference_type = 'sale'
  ` as any[];

  // Cash payments to suppliers
  const cashToSuppliers = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(t.amount), 0) as amount
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
      AND a.code IN ('1110', '1120') -- Cash accounts
      AND t.type = 'CREDIT'
      AND t.reference_type = 'purchase'
  ` as any[];

  // Cash payments for operating expenses
  const cashForExpenses = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(t.amount), 0) as amount
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
      AND a.code IN ('1110', '1120') -- Cash accounts
      AND t.type = 'CREDIT'
      AND t.reference_type = 'expense'
  ` as any[];

  const items = [
    {
      description: 'Cash receipts from customers',
      amount: Number(cashFromCustomers[0]?.amount || 0),
      category: 'receipts',
    },
    {
      description: 'Cash payments to suppliers',
      amount: -Number(cashToSuppliers[0]?.amount || 0),
      category: 'payments',
    },
    {
      description: 'Cash payments for operating expenses',
      amount: -Number(cashForExpenses[0]?.amount || 0),
      category: 'payments',
    },
  ];

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return {
    total,
    items,
  };
}

// Generate investing activities
async function generateInvestingActivities(start: Date, end: Date, currency: string) {
  // Purchase of property, plant, and equipment
  const assetPurchases = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE 0 END), 0) as amount
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
      AND a.code LIKE '121%' -- Fixed assets
      AND t.type = 'DEBIT'
  ` as any[];

  // Sale of property, plant, and equipment
  const assetSales = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE 0 END), 0) as amount
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
      AND a.code LIKE '121%' -- Fixed assets
      AND t.type = 'CREDIT'
  ` as any[];

  const items = [];

  if (Number(assetPurchases[0]?.amount || 0) > 0.01) {
    items.push({
      description: 'Purchase of property, plant and equipment',
      amount: -Number(assetPurchases[0].amount),
      category: 'asset_purchase',
    });
  }

  if (Number(assetSales[0]?.amount || 0) > 0.01) {
    items.push({
      description: 'Proceeds from sale of property, plant and equipment',
      amount: Number(assetSales[0].amount),
      category: 'asset_sale',
    });
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return {
    total,
    items,
  };
}

// Generate financing activities
async function generateFinancingActivities(start: Date, end: Date, currency: string) {
  // Proceeds from loans
  const loanProceeds = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE 0 END), 0) as amount
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
      AND (a.code LIKE '214%' OR a.code LIKE '221%') -- Loans
      AND t.type = 'CREDIT'
  ` as any[];

  // Loan repayments
  const loanRepayments = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE 0 END), 0) as amount
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
      AND (a.code LIKE '214%' OR a.code LIKE '221%') -- Loans
      AND t.type = 'DEBIT'
  ` as any[];

  // Capital contributions
  const capitalContributions = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE 0 END), 0) as amount
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE t.status = 'COMPLETED'
      AND t.transaction_date >= ${start}
      AND t.transaction_date <= ${end}
      AND t.currency = ${currency}
      AND a.code LIKE '310%' -- Share capital
      AND t.type = 'CREDIT'
  ` as any[];

  const items = [];

  if (Number(loanProceeds[0]?.amount || 0) > 0.01) {
    items.push({
      description: 'Proceeds from loans',
      amount: Number(loanProceeds[0].amount),
      category: 'financing',
    });
  }

  if (Number(loanRepayments[0]?.amount || 0) > 0.01) {
    items.push({
      description: 'Repayment of loans',
      amount: -Number(loanRepayments[0].amount),
      category: 'financing',
    });
  }

  if (Number(capitalContributions[0]?.amount || 0) > 0.01) {
    items.push({
      description: 'Capital contributions',
      amount: Number(capitalContributions[0].amount),
      category: 'equity',
    });
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return {
    total,
    items,
  };
}

// Calculate changes in working capital
async function calculateWorkingCapitalChanges(start: Date, end: Date, currency: string) {
  const startDate = new Date(start);
  startDate.setDate(startDate.getDate() - 1); // Previous day

  // Calculate changes in current assets and liabilities
  const workingCapitalAccounts = ['1130', '1140', '1150', '2110']; // Receivables, Inventory, Payables

  const changes = [];

  for (const accountCode of workingCapitalAccounts) {
    const startBalance = await prisma.$queryRaw`
      SELECT
        COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as balance
      FROM accounts a
      LEFT JOIN transactions t ON a.id = t.account_id
        AND t.status = 'COMPLETED'
        AND t.transaction_date <= ${startDate}
        AND t.currency = ${currency}
      WHERE a.code = ${accountCode} AND a.is_active = true
    ` as any[];

    const endBalance = await prisma.$queryRaw`
      SELECT
        COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as balance
      FROM accounts a
      LEFT JOIN transactions t ON a.id = t.account_id
        AND t.status = 'COMPLETED'
        AND t.transaction_date <= ${end}
        AND t.currency = ${currency}
      WHERE a.code = ${accountCode} AND a.is_active = true
    ` as any[];

    const change = Number(endBalance[0]?.balance || 0) - Number(startBalance[0]?.balance || 0);

    if (Math.abs(change) > 0.01) {
      let description = '';
      let adjustedChange = change;

      switch (accountCode) {
        case '1130':
          description = 'Increase in accounts receivable';
          adjustedChange = -change; // Increase in receivables reduces cash
          break;
        case '1140':
        case '1150':
          description = 'Increase in inventory';
          adjustedChange = -change; // Increase in inventory reduces cash
          break;
        case '2110':
          description = 'Increase in accounts payable';
          adjustedChange = change; // Increase in payables increases cash
          break;
      }

      if (change < 0) {
        description = description.replace('Increase', 'Decrease');
        adjustedChange = -adjustedChange;
      }

      changes.push({
        description,
        amount: adjustedChange,
        category: 'working_capital',
      });
    }
  }

  return changes;
}

// Generate CSV export
function generateCSVResponse(cashFlowStatement: any) {
  let csvContent = 'CASH FLOW STATEMENT\n';
  csvContent += `Period: ${cashFlowStatement.period.startDate} to ${cashFlowStatement.period.endDate}\n`;
  csvContent += `Currency: ${cashFlowStatement.currency}\n`;
  csvContent += `Method: ${cashFlowStatement.method}\n\n`;

  csvContent += 'Activity,Amount\n';

  // Operating Activities
  csvContent += 'OPERATING ACTIVITIES\n';
  cashFlowStatement.operatingActivities.items.forEach((item: any) => {
    csvContent += `${item.description},${item.amount}\n`;
  });
  csvContent += `Net cash from operating activities,${cashFlowStatement.operatingActivities.total}\n\n`;

  // Investing Activities
  csvContent += 'INVESTING ACTIVITIES\n';
  cashFlowStatement.investingActivities.items.forEach((item: any) => {
    csvContent += `${item.description},${item.amount}\n`;
  });
  csvContent += `Net cash from investing activities,${cashFlowStatement.investingActivities.total}\n\n`;

  // Financing Activities
  csvContent += 'FINANCING ACTIVITIES\n';
  cashFlowStatement.financingActivities.items.forEach((item: any) => {
    csvContent += `${item.description},${item.amount}\n`;
  });
  csvContent += `Net cash from financing activities,${cashFlowStatement.financingActivities.total}\n\n`;

  csvContent += `Net increase in cash,${cashFlowStatement.summary.netCashFlow}\n`;
  csvContent += `Cash at beginning of period,${cashFlowStatement.summary.openingCashBalance}\n`;
  csvContent += `Cash at end of period,${cashFlowStatement.summary.closingCashBalance}\n`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="cash-flow-${cashFlowStatement.period.startDate}-to-${cashFlowStatement.period.endDate}.csv"`,
    },
  });
}

// Generate PDF export (placeholder)
function generatePDFResponse(cashFlowStatement: any) {
  return NextResponse.json({
    success: false,
    error: 'PDF export not implemented yet',
    message: 'Please use CSV export or implement PDF generation library',
  });
}

function generateId(): string {
  return `cf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}