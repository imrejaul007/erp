import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// Trial Balance parameters schema
const trialBalanceSchema = z.object({
  asOfDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  currency: z.string().default('AED'),
  includeZeroBalances: z.boolean().default(false),
  accountType: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']).optional(),
});

// Generate Trial Balance
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { searchParams } = new URL(request.url);
    const params = {
      asOfDate: searchParams.get('asOfDate') || new Date().toISOString().split('T')[0],
      currency: searchParams.get('currency') || 'AED',
      includeZeroBalances: searchParams.get('includeZeroBalances') === 'true',
      accountType: searchParams.get('accountType'),
    };

    const validatedParams = trialBalanceSchema.parse(params);

    // Generate trial balance
    const trialBalance = await generateTrialBalance(
      validatedParams.asOfDate,
      validatedParams.currency,
      validatedParams.includeZeroBalances,
      validatedParams.accountType
    );

    return apiResponse({
      success: true,
      data: trialBalance,
      metadata: {
        asOfDate: validatedParams.asOfDate,
        currency: validatedParams.currency,
        generatedAt: new Date().toISOString(),
        generatedBy: user?.email,
      },
    });
  } catch (error) {
    console.error('Trial Balance error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to generate trial balance', 500);
  }
});

// Save/Export Trial Balance
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const body = await request.json();
    const { asOfDate, currency = 'AED', format = 'json' } = body;

    if (!asOfDate) {
      return apiError('As of date is required', 400);
    }

    // Generate trial balance
    const trialBalance = await generateTrialBalance(asOfDate, currency, true);

    // Save trial balance record
    const trialBalanceId = generateId();
    const period = new Date(asOfDate).toISOString().substring(0, 7); // YYYY-MM

    await prisma.$executeRaw`
      INSERT INTO trial_balance (
        id, period, as_of_date, currency, total_debits, total_credits,
        is_balanced, generated_by, generated_at
      ) VALUES (
        ${trialBalanceId}, ${period}, ${new Date(asOfDate)}, ${currency},
        ${trialBalance.summary.totalDebits}, ${trialBalance.summary.totalCredits},
        ${trialBalance.summary.isBalanced}, ${user.id}, ${new Date()}
      )
    `;

    // Save trial balance items
    for (const item of trialBalance.accounts) {
      await prisma.$executeRaw`
        INSERT INTO trial_balance_items (
          id, trial_balance_id, account_id, account_code, account_name,
          account_name_ar, account_type, opening_balance, debit_movements,
          credit_movements, closing_balance
        ) VALUES (
          ${generateId()}, ${trialBalanceId}, ${item.accountId}, ${item.accountCode},
          ${item.accountName}, ${item.accountNameAr || null}, ${item.accountType},
          ${item.openingBalance}, ${item.debitMovements}, ${item.creditMovements},
          ${item.closingBalance}
        )
      `;
    }

    // Handle different export formats
    if (format === 'csv') {
      return generateCSVResponse(trialBalance);
    } else if (format === 'pdf') {
      return generatePDFResponse(trialBalance);
    }

    return apiResponse({
      success: true,
      data: {
        id: trialBalanceId,
        ...trialBalance,
      },
      message: 'Trial balance saved successfully',
    });
  } catch (error) {
    console.error('Trial Balance POST error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to save trial balance', 500);
  }
});

// Generate trial balance data
async function generateTrialBalance(
  asOfDate: string,
  currency: string,
  includeZeroBalances: boolean = false,
  accountType?: string
) {
  const cutoffDate = new Date(asOfDate);
  cutoffDate.setHours(23, 59, 59, 999); // End of day

  // Build account filter
  let accountFilter = 'WHERE a.is_active = true';
  if (accountType) {
    accountFilter += ` AND a.type = '${accountType}'`;
  }

  // Get all accounts with their transactions up to the cutoff date
  const accountsWithBalances = await prisma.$queryRaw`
    SELECT
      a.id as account_id,
      a.code as account_code,
      a.name as account_name,
      a.name_ar as account_name_ar,
      a.type as account_type,
      a.balance as current_balance,
      COALESCE(opening.opening_balance, 0) as opening_balance,
      COALESCE(movements.debit_movements, 0) as debit_movements,
      COALESCE(movements.credit_movements, 0) as credit_movements,
      COALESCE(closing.closing_balance, 0) as closing_balance
    FROM accounts a
    LEFT JOIN (
      -- Calculate opening balance (transactions before start of period)
      SELECT
        t.account_id,
        SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END) as opening_balance
      FROM transactions t
      WHERE t.status = 'COMPLETED'
        AND t.transaction_date < '${cutoffDate.toISOString()}'
        AND t.currency = '${currency}'
      GROUP BY t.account_id
    ) opening ON a.id = opening.account_id
    LEFT JOIN (
      -- Calculate movements for the period
      SELECT
        t.account_id,
        SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE 0 END) as debit_movements,
        SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE 0 END) as credit_movements
      FROM transactions t
      WHERE t.status = 'COMPLETED'
        AND t.transaction_date <= '${cutoffDate.toISOString()}'
        AND t.currency = '${currency}'
      GROUP BY t.account_id
    ) movements ON a.id = movements.account_id
    LEFT JOIN (
      -- Calculate closing balance
      SELECT
        t.account_id,
        SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END) as closing_balance
      FROM transactions t
      WHERE t.status = 'COMPLETED'
        AND t.transaction_date <= '${cutoffDate.toISOString()}'
        AND t.currency = '${currency}'
      GROUP BY t.account_id
    ) closing ON a.id = closing.account_id
    ${accountFilter}
    ORDER BY a.type, a.code
  ` as any[];

  // Process and format the results
  const processedAccounts = accountsWithBalances.map((account: any) => {
    const openingBalance = Number(account.opening_balance) || 0;
    const debitMovements = Number(account.debit_movements) || 0;
    const creditMovements = Number(account.credit_movements) || 0;
    let closingBalance = Number(account.closing_balance) || 0;

    // Adjust closing balance based on account type normal balance
    if (['ASSET', 'EXPENSE'].includes(account.account_type)) {
      // Normal debit balance accounts
      closingBalance = openingBalance + debitMovements - creditMovements;
    } else {
      // Normal credit balance accounts (LIABILITY, EQUITY, REVENUE)
      closingBalance = openingBalance + creditMovements - debitMovements;
    }

    return {
      accountId: account.account_id,
      accountCode: account.account_code,
      accountName: account.account_name,
      accountNameAr: account.account_name_ar,
      accountType: account.account_type,
      openingBalance,
      debitMovements,
      creditMovements,
      closingBalance,
      debitBalance: closingBalance > 0 ? closingBalance : 0,
      creditBalance: closingBalance < 0 ? Math.abs(closingBalance) : 0,
    };
  });

  // Filter out zero balances if requested
  const filteredAccounts = includeZeroBalances
    ? processedAccounts
    : processedAccounts.filter(account =>
        Math.abs(account.closingBalance) > 0.01 ||
        Math.abs(account.debitMovements) > 0.01 ||
        Math.abs(account.creditMovements) > 0.01
      );

  // Calculate totals
  const totalDebits = filteredAccounts.reduce((sum, account) => sum + account.debitBalance, 0);
  const totalCredits = filteredAccounts.reduce((sum, account) => sum + account.creditBalance, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  // Group by account type
  const accountsByType = filteredAccounts.reduce((groups: any, account) => {
    if (!groups[account.accountType]) {
      groups[account.accountType] = [];
    }
    groups[account.accountType].push(account);
    return groups;
  }, {});

  // Calculate totals by type
  const totalsByType = Object.keys(accountsByType).reduce((totals: any, type) => {
    const accounts = accountsByType[type];
    totals[type] = {
      debitBalance: accounts.reduce((sum: number, acc: any) => sum + acc.debitBalance, 0),
      creditBalance: accounts.reduce((sum: number, acc: any) => sum + acc.creditBalance, 0),
      count: accounts.length,
    };
    return totals;
  }, {});

  return {
    summary: {
      asOfDate,
      currency,
      totalDebits,
      totalCredits,
      difference: totalDebits - totalCredits,
      isBalanced,
      accountCount: filteredAccounts.length,
      totalsByType,
    },
    accounts: filteredAccounts,
    accountsByType,
  };
}

// Generate CSV export
function generateCSVResponse(trialBalance: any) {
  let csvContent = 'Account Code,Account Name,Account Name (Arabic),Account Type,Opening Balance,Debit Movements,Credit Movements,Debit Balance,Credit Balance\n';

  trialBalance.accounts.forEach((account: any) => {
    csvContent += `${account.accountCode},"${account.accountName}","${account.accountNameAr || ''}",${account.accountType},${account.openingBalance},${account.debitMovements},${account.creditMovements},${account.debitBalance},${account.creditBalance}\n`;
  });

  // Add summary
  csvContent += '\n--- SUMMARY ---\n';
  csvContent += `Total Debits,${trialBalance.summary.totalDebits}\n`;
  csvContent += `Total Credits,${trialBalance.summary.totalCredits}\n`;
  csvContent += `Difference,${trialBalance.summary.difference}\n`;
  csvContent += `Balanced,${trialBalance.summary.isBalanced ? 'Yes' : 'No'}\n`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="trial-balance-${trialBalance.summary.asOfDate}.csv"`,
    },
  });
}

// Generate PDF export (placeholder - would need PDF library)
function generatePDFResponse(trialBalance: any) {
  // This would require a PDF generation library like puppeteer or jsPDF
  // For now, return JSON with instructions
  return NextResponse.json({
    success: false,
    error: 'PDF export not implemented yet',
    message: 'Please use CSV export or implement PDF generation library',
  });
}

function generateId(): string {
  return `tb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}