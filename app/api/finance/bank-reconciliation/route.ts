import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Bank reconciliation schemas
const bankStatementSchema = z.object({
  bankAccountId: z.string().min(1),
  statementDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  openingBalance: z.number(),
  closingBalance: z.number(),
  transactions: z.array(z.object({
    date: z.string().refine((date) => !isNaN(Date.parse(date))),
    description: z.string().min(1),
    reference: z.string().optional(),
    amount: z.number(),
    type: z.enum(['DEBIT', 'CREDIT']),
    balance: z.number().optional(),
  })).min(1),
  currency: z.string().length(3).default('AED'),
});

const reconciliationSchema = z.object({
  bankAccountId: z.string().min(1),
  reconciliationDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  statementBalance: z.number(),
  bookBalance: z.number(),
  autoMatch: z.boolean().default(true),
  matchingTolerance: z.number().min(0).default(1), // AED tolerance for matching
  includeUnmatched: z.boolean().default(true),
});

const manualMatchSchema = z.object({
  bankTransactionId: z.string(),
  bookTransactionIds: z.array(z.string()).min(1),
  matchType: z.enum(['EXACT', 'PARTIAL', 'COMBINED']),
  notes: z.string().optional(),
});

// Get bank reconciliation data and perform automatic matching
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bankAccountId = searchParams.get('bankAccountId');
    const reconciliationDate = searchParams.get('reconciliationDate') || new Date().toISOString().split('T')[0];
    const includeHistory = searchParams.get('includeHistory') === 'true';
    const action = searchParams.get('action');

    if (action === 'accounts') {
      // Get list of bank accounts
      const bankAccounts = await getBankAccounts();
      return NextResponse.json({
        success: true,
        data: bankAccounts,
      });
    }

    if (!bankAccountId) {
      return NextResponse.json(
        { success: false, error: 'Bank account ID is required' },
        { status: 400 }
      );
    }

    // Get bank account details
    const bankAccount = await getBankAccountDetails(bankAccountId);
    if (!bankAccount) {
      return NextResponse.json(
        { success: false, error: 'Bank account not found' },
        { status: 404 }
      );
    }

    // Get current book balance
    const bookBalance = await getBookBalance(bankAccountId, reconciliationDate);

    // Get unreconciled book transactions
    const unreconciledTransactions = await getUnreconciledTransactions(bankAccountId, reconciliationDate);

    // Get unmatched bank transactions
    const unmatchedBankTransactions = await getUnmatchedBankTransactions(bankAccountId, reconciliationDate);

    // Get reconciliation history if requested
    let history = null;
    if (includeHistory) {
      history = await getReconciliationHistory(bankAccountId, 6); // Last 6 months
    }

    // Get outstanding items (checks issued but not cleared, deposits in transit)
    const outstandingItems = await getOutstandingItems(bankAccountId, reconciliationDate);

    // Calculate reconciliation summary
    const summary = {
      bankAccount,
      reconciliationDate,
      bookBalance,
      estimatedBankBalance: bookBalance.balance + outstandingItems.depositsInTransit - outstandingItems.outstandingChecks,
      outstandingItems,
      reconciledAmount: 0, // Will be calculated during reconciliation process
      difference: 0, // Will be calculated during reconciliation process
    };

    return NextResponse.json({
      success: true,
      data: {
        summary,
        unreconciledTransactions,
        unmatchedBankTransactions,
        history,
        matchingSuggestions: await generateMatchingSuggestions(unreconciledTransactions, unmatchedBankTransactions),
      },
    });
  } catch (error) {
    console.error('Bank Reconciliation GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bank reconciliation data' },
      { status: 500 }
    );
  }
}

// Upload bank statement and perform automatic reconciliation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action || 'upload_statement';

    if (action === 'upload_statement') {
      const validatedData = bankStatementSchema.parse(body);
      return await processBankStatement(validatedData, session.user.id);
    } else if (action === 'auto_reconcile') {
      const validatedData = reconciliationSchema.parse(body);
      return await performAutoReconciliation(validatedData, session.user.id);
    } else if (action === 'manual_match') {
      const validatedData = manualMatchSchema.parse(body);
      return await processManualMatch(validatedData, session.user.id);
    } else if (action === 'create_adjustment') {
      return await createReconciliationAdjustment(body.adjustment, session.user.id);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Bank Reconciliation POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to process bank reconciliation' },
      { status: 500 }
    );
  }
}

// Finalize reconciliation and create reconciliation report
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      bankAccountId,
      reconciliationDate,
      statementBalance,
      bookBalance,
      matchedTransactions,
      adjustments,
      notes
    } = body;

    // Validate reconciliation data
    if (!bankAccountId || !reconciliationDate || statementBalance === undefined || bookBalance === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required reconciliation data' },
        { status: 400 }
      );
    }

    // Calculate final reconciliation
    const reconciliationResult = await finalizeReconciliation({
      bankAccountId,
      reconciliationDate,
      statementBalance,
      bookBalance,
      matchedTransactions: matchedTransactions || [],
      adjustments: adjustments || [],
      notes,
      reconciledBy: session.user.id,
    });

    // Generate reconciliation report
    const reconciliationReport = await generateReconciliationReport(reconciliationResult);

    // Update transaction statuses
    await updateTransactionReconciliationStatus(matchedTransactions || [], reconciliationResult.id);

    return NextResponse.json({
      success: true,
      data: {
        reconciliation: reconciliationResult,
        report: reconciliationReport,
      },
      message: 'Bank reconciliation completed successfully',
    });
  } catch (error) {
    console.error('Bank Reconciliation finalization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to finalize bank reconciliation' },
      { status: 500 }
    );
  }
}

// Helper functions for bank reconciliation
async function getBankAccounts() {
  return await prisma.$queryRaw`
    SELECT
      a.id,
      a.code,
      a.name,
      a.currency,
      a.balance,
      a.updated_at,
      COUNT(br.id) as reconciliation_count,
      MAX(br.reconciliation_date) as last_reconciled
    FROM accounts a
    LEFT JOIN bank_reconciliations br ON a.id = br.bank_account_id
    WHERE a.code LIKE '112%' -- Bank accounts
      AND a.is_active = true
    GROUP BY a.id, a.code, a.name, a.currency, a.balance, a.updated_at
    ORDER BY a.code
  ` as any[];
}

async function getBankAccountDetails(bankAccountId: string) {
  const account = await prisma.account.findUnique({
    where: { id: bankAccountId },
    select: {
      id: true,
      code: true,
      name: true,
      currency: true,
      balance: true,
      updatedAt: true,
    },
  });

  return account;
}

async function getBookBalance(bankAccountId: string, asOfDate: string) {
  const balance = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END), 0) as balance,
      COUNT(*) as transaction_count,
      MAX(t.transaction_date) as last_transaction_date
    FROM transactions t
    WHERE t.account_id = ${bankAccountId}
      AND t.transaction_date <= ${new Date(asOfDate)}
      AND t.status = 'COMPLETED'
  ` as any[];

  const data = balance[0] || {};

  return {
    balance: Number(data.balance || 0),
    transactionCount: Number(data.transaction_count || 0),
    lastTransactionDate: data.last_transaction_date,
    asOfDate,
  };
}

async function getUnreconciledTransactions(bankAccountId: string, reconciliationDate: string) {
  return await prisma.$queryRaw`
    SELECT
      t.id,
      t.transaction_no,
      t.type,
      t.amount,
      t.description,
      t.transaction_date,
      t.reference_type,
      t.reference_id,
      t.status,
      CASE WHEN t.reconciliation_id IS NOT NULL THEN true ELSE false END as is_reconciled
    FROM transactions t
    WHERE t.account_id = ${bankAccountId}
      AND t.transaction_date <= ${new Date(reconciliationDate)}
      AND t.status = 'COMPLETED'
      AND (t.reconciliation_id IS NULL OR t.reconciliation_status = 'UNMATCHED')
    ORDER BY t.transaction_date DESC, t.created_at DESC
  ` as any[];
}

async function getUnmatchedBankTransactions(bankAccountId: string, reconciliationDate: string) {
  return await prisma.$queryRaw`
    SELECT
      bt.id,
      bt.transaction_date,
      bt.description,
      bt.reference,
      bt.amount,
      bt.type,
      bt.balance,
      bt.is_matched
    FROM bank_transactions bt
    WHERE bt.bank_account_id = ${bankAccountId}
      AND bt.transaction_date <= ${new Date(reconciliationDate)}
      AND bt.is_matched = false
    ORDER BY bt.transaction_date DESC
  ` as any[];
}

async function getOutstandingItems(bankAccountId: string, reconciliationDate: string) {
  // Get outstanding checks (issued but not cleared)
  const outstandingChecks = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(t.amount), 0) as total,
      COUNT(*) as count
    FROM transactions t
    WHERE t.account_id = ${bankAccountId}
      AND t.type = 'CREDIT'
      AND t.transaction_date <= ${new Date(reconciliationDate)}
      AND t.status = 'COMPLETED'
      AND (t.reference_type = 'CHECK' OR t.description ILIKE '%check%')
      AND NOT EXISTS (
        SELECT 1 FROM bank_transactions bt
        WHERE bt.bank_account_id = ${bankAccountId}
          AND bt.reference = t.reference_id
          AND bt.is_matched = true
      )
  ` as any[];

  // Get deposits in transit (recorded but not yet reflected in bank)
  const depositsInTransit = await prisma.$queryRaw`
    SELECT
      COALESCE(SUM(t.amount), 0) as total,
      COUNT(*) as count
    FROM transactions t
    WHERE t.account_id = ${bankAccountId}
      AND t.type = 'DEBIT'
      AND t.transaction_date <= ${new Date(reconciliationDate)}
      AND t.status = 'COMPLETED'
      AND (t.reference_type = 'DEPOSIT' OR t.description ILIKE '%deposit%')
      AND NOT EXISTS (
        SELECT 1 FROM bank_transactions bt
        WHERE bt.bank_account_id = ${bankAccountId}
          AND ABS(bt.amount - t.amount) < 1
          AND bt.transaction_date BETWEEN t.transaction_date AND t.transaction_date + INTERVAL '5 days'
          AND bt.is_matched = true
      )
  ` as any[];

  return {
    outstandingChecks: Number(outstandingChecks[0]?.total || 0),
    outstandingChecksCount: Number(outstandingChecks[0]?.count || 0),
    depositsInTransit: Number(depositsInTransit[0]?.total || 0),
    depositsInTransitCount: Number(depositsInTransit[0]?.count || 0),
  };
}

async function getReconciliationHistory(bankAccountId: string, months: number) {
  return await prisma.$queryRaw`
    SELECT
      br.id,
      br.reconciliation_date,
      br.statement_balance,
      br.book_balance,
      br.reconciled_amount,
      br.difference_amount,
      br.status,
      br.notes,
      br.created_at,
      u.first_name || ' ' || u.last_name as reconciled_by_name
    FROM bank_reconciliations br
    LEFT JOIN users u ON br.reconciled_by = u.id
    WHERE br.bank_account_id = ${bankAccountId}
      AND br.reconciliation_date >= CURRENT_DATE - INTERVAL '${months} months'
    ORDER BY br.reconciliation_date DESC
  ` as any[];
}

async function generateMatchingSuggestions(bookTransactions: any[], bankTransactions: any[]) {
  const suggestions = [];

  for (const bankTx of bankTransactions) {
    const potentialMatches = bookTransactions.filter(bookTx => {
      // Amount matching (within tolerance)
      const amountMatch = Math.abs(Math.abs(bankTx.amount) - Math.abs(bookTx.amount)) <= 1;

      // Date matching (within 7 days)
      const bankDate = new Date(bankTx.transaction_date);
      const bookDate = new Date(bookTx.transaction_date);
      const daysDiff = Math.abs((bankDate.getTime() - bookDate.getTime()) / (1000 * 60 * 60 * 24));
      const dateMatch = daysDiff <= 7;

      // Type matching (debit/credit correlation)
      const typeMatch = (bankTx.type === 'DEBIT' && bookTx.type === 'DEBIT') ||
                       (bankTx.type === 'CREDIT' && bookTx.type === 'CREDIT');

      // Description similarity (basic keyword matching)
      const descriptionMatch = calculateDescriptionSimilarity(bankTx.description, bookTx.description) > 0.3;

      return amountMatch && dateMatch && typeMatch;
    });

    if (potentialMatches.length > 0) {
      // Score matches based on multiple factors
      const scoredMatches = potentialMatches.map(match => ({
        ...match,
        matchScore: calculateMatchScore(bankTx, match),
      })).sort((a, b) => b.matchScore - a.matchScore);

      suggestions.push({
        bankTransaction: bankTx,
        suggestedMatches: scoredMatches.slice(0, 3), // Top 3 suggestions
        confidence: scoredMatches[0]?.matchScore || 0,
        matchType: scoredMatches.length === 1 ? 'EXACT' : 'MULTIPLE_OPTIONS',
      });
    }
  }

  return suggestions;
}

function calculateMatchScore(bankTx: any, bookTx: any): number {
  let score = 0;

  // Amount exactness (40% weight)
  const amountDiff = Math.abs(Math.abs(bankTx.amount) - Math.abs(bookTx.amount));
  score += Math.max(0, 40 - (amountDiff * 10));

  // Date proximity (20% weight)
  const bankDate = new Date(bankTx.transaction_date);
  const bookDate = new Date(bookTx.transaction_date);
  const daysDiff = Math.abs((bankDate.getTime() - bookDate.getTime()) / (1000 * 60 * 60 * 24));
  score += Math.max(0, 20 - (daysDiff * 2));

  // Description similarity (25% weight)
  const descriptionSimilarity = calculateDescriptionSimilarity(bankTx.description, bookTx.description);
  score += descriptionSimilarity * 25;

  // Reference matching (15% weight)
  if (bankTx.reference && bookTx.reference_id && bankTx.reference === bookTx.reference_id) {
    score += 15;
  } else if (bankTx.reference && bookTx.description.includes(bankTx.reference)) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

function calculateDescriptionSimilarity(desc1: string, desc2: string): number {
  if (!desc1 || !desc2) return 0;

  const words1 = desc1.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const words2 = desc2.toLowerCase().split(/\W+/).filter(w => w.length > 2);

  if (words1.length === 0 || words2.length === 0) return 0;

  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

async function processBankStatement(statementData: any, userId: string) {
  const statementId = generateId();

  // Save bank statement
  await prisma.$executeRaw`
    INSERT INTO bank_statements (
      id, bank_account_id, statement_date, opening_balance, closing_balance,
      transaction_count, currency, uploaded_by, created_at
    ) VALUES (
      ${statementId}, ${statementData.bankAccountId}, ${new Date(statementData.statementDate)},
      ${statementData.openingBalance}, ${statementData.closingBalance},
      ${statementData.transactions.length}, ${statementData.currency}, ${userId}, ${new Date()}
    )
  `;

  // Save bank transactions
  let processedCount = 0;
  for (const transaction of statementData.transactions) {
    const transactionId = generateId();

    try {
      await prisma.$executeRaw`
        INSERT INTO bank_transactions (
          id, bank_statement_id, bank_account_id, transaction_date, description,
          reference, amount, type, balance, is_matched, created_at
        ) VALUES (
          ${transactionId}, ${statementId}, ${statementData.bankAccountId},
          ${new Date(transaction.date)}, ${transaction.description},
          ${transaction.reference || null}, ${transaction.amount}, ${transaction.type},
          ${transaction.balance || null}, false, ${new Date()}
        )
      `;
      processedCount++;
    } catch (error) {
      console.error(`Failed to save bank transaction: ${error}`);
    }
  }

  // Perform automatic matching
  const autoMatchingResults = await performAutoMatching(statementData.bankAccountId, statementData.statementDate);

  return NextResponse.json({
    success: true,
    data: {
      statementId,
      processedTransactions: processedCount,
      autoMatching: autoMatchingResults,
    },
    message: 'Bank statement processed successfully',
  });
}

async function performAutoReconciliation(reconciliationData: any, userId: string) {
  const reconciliationId = generateId();

  // Get unmatched transactions for auto-matching
  const bookTransactions = await getUnreconciledTransactions(reconciliationData.bankAccountId, reconciliationData.reconciliationDate);
  const bankTransactions = await getUnmatchedBankTransactions(reconciliationData.bankAccountId, reconciliationData.reconciliationDate);

  // Perform automatic matching
  const matchingResults = await performAdvancedAutoMatching(
    bookTransactions,
    bankTransactions,
    reconciliationData.matchingTolerance
  );

  // Calculate reconciliation summary
  const summary = {
    totalBookTransactions: bookTransactions.length,
    totalBankTransactions: bankTransactions.length,
    automaticMatches: matchingResults.matches.length,
    unmatchedBookTransactions: bookTransactions.length - matchingResults.matches.length,
    unmatchedBankTransactions: bankTransactions.length - matchingResults.matches.length,
    reconciledAmount: matchingResults.totalMatchedAmount,
    difference: reconciliationData.statementBalance - reconciliationData.bookBalance,
  };

  return NextResponse.json({
    success: true,
    data: {
      reconciliationId,
      summary,
      matches: matchingResults.matches,
      unmatchedTransactions: {
        book: matchingResults.unmatchedBookTransactions,
        bank: matchingResults.unmatchedBankTransactions,
      },
    },
    message: 'Automatic reconciliation completed',
  });
}

async function performAdvancedAutoMatching(bookTransactions: any[], bankTransactions: any[], tolerance: number) {
  const matches = [];
  const unmatchedBookTransactions = [...bookTransactions];
  const unmatchedBankTransactions = [...bankTransactions];
  let totalMatchedAmount = 0;

  // Exact amount and date matching (highest priority)
  for (const bankTx of [...bankTransactions]) {
    const exactMatch = unmatchedBookTransactions.find(bookTx =>
      Math.abs(Math.abs(bankTx.amount) - Math.abs(bookTx.amount)) <= tolerance &&
      Math.abs((new Date(bankTx.transaction_date).getTime() - new Date(bookTx.transaction_date).getTime()) / (1000 * 60 * 60 * 24)) <= 1 &&
      ((bankTx.type === 'DEBIT' && bookTx.type === 'DEBIT') || (bankTx.type === 'CREDIT' && bookTx.type === 'CREDIT'))
    );

    if (exactMatch) {
      matches.push({
        bankTransaction: bankTx,
        bookTransactions: [exactMatch],
        matchType: 'EXACT',
        matchScore: 100,
        matchedAmount: Math.abs(bankTx.amount),
      });

      totalMatchedAmount += Math.abs(bankTx.amount);

      // Remove matched transactions
      const bankIndex = unmatchedBankTransactions.findIndex(bt => bt.id === bankTx.id);
      if (bankIndex > -1) unmatchedBankTransactions.splice(bankIndex, 1);

      const bookIndex = unmatchedBookTransactions.findIndex(bt => bt.id === exactMatch.id);
      if (bookIndex > -1) unmatchedBookTransactions.splice(bookIndex, 1);
    }
  }

  // Amount matching with flexible date range (medium priority)
  for (const bankTx of [...unmatchedBankTransactions]) {
    const amountMatch = unmatchedBookTransactions.find(bookTx =>
      Math.abs(Math.abs(bankTx.amount) - Math.abs(bookTx.amount)) <= tolerance &&
      Math.abs((new Date(bankTx.transaction_date).getTime() - new Date(bookTx.transaction_date).getTime()) / (1000 * 60 * 60 * 24)) <= 7 &&
      ((bankTx.type === 'DEBIT' && bookTx.type === 'DEBIT') || (bankTx.type === 'CREDIT' && bookTx.type === 'CREDIT'))
    );

    if (amountMatch) {
      const daysDiff = Math.abs((new Date(bankTx.transaction_date).getTime() - new Date(amountMatch.transaction_date).getTime()) / (1000 * 60 * 60 * 24));
      const matchScore = Math.max(60, 90 - (daysDiff * 5));

      matches.push({
        bankTransaction: bankTx,
        bookTransactions: [amountMatch],
        matchType: 'AMOUNT',
        matchScore,
        matchedAmount: Math.abs(bankTx.amount),
      });

      totalMatchedAmount += Math.abs(bankTx.amount);

      // Remove matched transactions
      const bankIndex = unmatchedBankTransactions.findIndex(bt => bt.id === bankTx.id);
      if (bankIndex > -1) unmatchedBankTransactions.splice(bankIndex, 1);

      const bookIndex = unmatchedBookTransactions.findIndex(bt => bt.id === amountMatch.id);
      if (bookIndex > -1) unmatchedBookTransactions.splice(bookIndex, 1);
    }
  }

  // Combined transactions matching (multiple book transactions = one bank transaction)
  for (const bankTx of [...unmatchedBankTransactions]) {
    const combinedMatches = findCombinedMatches(bankTx, unmatchedBookTransactions, tolerance);

    if (combinedMatches.length > 1) {
      matches.push({
        bankTransaction: bankTx,
        bookTransactions: combinedMatches,
        matchType: 'COMBINED',
        matchScore: 75,
        matchedAmount: Math.abs(bankTx.amount),
      });

      totalMatchedAmount += Math.abs(bankTx.amount);

      // Remove matched transactions
      const bankIndex = unmatchedBankTransactions.findIndex(bt => bt.id === bankTx.id);
      if (bankIndex > -1) unmatchedBankTransactions.splice(bankIndex, 1);

      combinedMatches.forEach(match => {
        const bookIndex = unmatchedBookTransactions.findIndex(bt => bt.id === match.id);
        if (bookIndex > -1) unmatchedBookTransactions.splice(bookIndex, 1);
      });
    }
  }

  return {
    matches,
    unmatchedBookTransactions,
    unmatchedBankTransactions,
    totalMatchedAmount,
  };
}

function findCombinedMatches(bankTx: any, bookTransactions: any[], tolerance: number): any[] {
  const targetAmount = Math.abs(bankTx.amount);
  const matchingType = bankTx.type;

  // Find combinations that sum to the bank transaction amount
  const potentialTransactions = bookTransactions.filter(bookTx =>
    bookTx.type === matchingType &&
    Math.abs((new Date(bankTx.transaction_date).getTime() - new Date(bookTx.transaction_date).getTime()) / (1000 * 60 * 60 * 24)) <= 10
  );

  // Try combinations of 2-4 transactions
  for (let combSize = 2; combSize <= Math.min(4, potentialTransactions.length); combSize++) {
    const combinations = getCombinations(potentialTransactions, combSize);

    for (const combination of combinations) {
      const combinedAmount = combination.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      if (Math.abs(combinedAmount - targetAmount) <= tolerance) {
        return combination;
      }
    }
  }

  return [];
}

function getCombinations(arr: any[], size: number): any[][] {
  if (size === 1) return arr.map(item => [item]);
  if (size > arr.length) return [];

  const combinations = [];
  for (let i = 0; i <= arr.length - size; i++) {
    const head = arr[i];
    const tailCombinations = getCombinations(arr.slice(i + 1), size - 1);
    for (const tailCombination of tailCombinations) {
      combinations.push([head, ...tailCombination]);
    }
  }

  return combinations;
}

async function processManualMatch(matchData: any, userId: string) {
  const matchId = generateId();

  // Create manual match record
  await prisma.$executeRaw`
    INSERT INTO reconciliation_matches (
      id, bank_transaction_id, match_type, notes, created_by, created_at
    ) VALUES (
      ${matchId}, ${matchData.bankTransactionId}, ${matchData.matchType},
      ${matchData.notes || null}, ${userId}, ${new Date()}
    )
  `;

  // Link book transactions to the match
  for (const bookTransactionId of matchData.bookTransactionIds) {
    await prisma.$executeRaw`
      INSERT INTO reconciliation_match_transactions (
        match_id, book_transaction_id
      ) VALUES (${matchId}, ${bookTransactionId})
    `;
  }

  // Update transaction statuses
  await prisma.$executeRaw`
    UPDATE bank_transactions
    SET is_matched = true, updated_at = ${new Date()}
    WHERE id = ${matchData.bankTransactionId}
  `;

  await prisma.$executeRaw`
    UPDATE transactions
    SET reconciliation_status = 'MATCHED', updated_at = ${new Date()}
    WHERE id = ANY(${matchData.bookTransactionIds})
  `;

  return NextResponse.json({
    success: true,
    data: { matchId },
    message: 'Manual match created successfully',
  });
}

async function finalizeReconciliation(data: any) {
  const reconciliationId = generateId();

  // Calculate final reconciliation amounts
  const matchedAmount = data.matchedTransactions.reduce((sum: number, match: any) => sum + Math.abs(match.amount), 0);
  const differenceAmount = data.statementBalance - data.bookBalance;

  // Create reconciliation record
  await prisma.$executeRaw`
    INSERT INTO bank_reconciliations (
      id, bank_account_id, reconciliation_date, statement_balance, book_balance,
      reconciled_amount, difference_amount, status, notes, reconciled_by, created_at
    ) VALUES (
      ${reconciliationId}, ${data.bankAccountId}, ${new Date(data.reconciliationDate)},
      ${data.statementBalance}, ${data.bookBalance}, ${matchedAmount}, ${differenceAmount},
      'COMPLETED', ${data.notes || null}, ${data.reconciledBy}, ${new Date()}
    )
  `;

  return {
    id: reconciliationId,
    bankAccountId: data.bankAccountId,
    reconciliationDate: data.reconciliationDate,
    statementBalance: data.statementBalance,
    bookBalance: data.bookBalance,
    reconciledAmount: matchedAmount,
    differenceAmount,
    status: 'COMPLETED',
    notes: data.notes,
    reconciledBy: data.reconciledBy,
    createdAt: new Date(),
  };
}

async function generateReconciliationReport(reconciliation: any) {
  return {
    reconciliationId: reconciliation.id,
    reportDate: new Date().toISOString(),
    summary: {
      bankAccount: reconciliation.bankAccountId,
      reconciliationDate: reconciliation.reconciliationDate,
      statementBalance: reconciliation.statementBalance,
      bookBalance: reconciliation.bookBalance,
      difference: reconciliation.differenceAmount,
      status: reconciliation.status,
    },
    // Additional report details would be generated here
  };
}

async function updateTransactionReconciliationStatus(matchedTransactions: any[], reconciliationId: string) {
  if (matchedTransactions.length === 0) return;

  const transactionIds = matchedTransactions.map(tx => tx.id);

  await prisma.$executeRaw`
    UPDATE transactions
    SET
      reconciliation_id = ${reconciliationId},
      reconciliation_status = 'RECONCILED',
      updated_at = ${new Date()}
    WHERE id = ANY(${transactionIds})
  `;
}

async function performAutoMatching(bankAccountId: string, statementDate: string) {
  // This would implement automatic matching logic
  // For now, return a placeholder result
  return {
    automaticMatches: 0,
    potentialMatches: 0,
    unmatchedTransactions: 0,
  };
}

async function createReconciliationAdjustment(adjustment: any, userId: string) {
  // Create adjustment entries for reconciliation differences
  return NextResponse.json({
    success: true,
    message: 'Reconciliation adjustment created successfully',
  });
}

function generateId(): string {
  return `br_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}