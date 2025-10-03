import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// Journal Entry schema
const journalEntryLineSchema = z.object({
  accountId: z.string(),
  description: z.string(),
  debitAmount: z.number().min(0),
  creditAmount: z.number().min(0),
  costCenter: z.string().optional(),
  project: z.string().optional(),
  dimension1: z.string().optional(),
  dimension2: z.string().optional(),
});

const journalEntrySchema = z.object({
  reference: z.string().optional(),
  description: z.string().min(1),
  transactionDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  currency: z.string().default('AED'),
  exchangeRate: z.number().positive().default(1),
  source: z.string().default('manual'),
  sourceId: z.string().optional(),
  lineItems: z.array(journalEntryLineSchema).min(2),
}).refine(
  (data) => {
    // Validate that debits equal credits
    const totalDebits = data.lineItems.reduce((sum, item) => sum + item.debitAmount, 0);
    const totalCredits = data.lineItems.reduce((sum, item) => sum + item.creditAmount, 0);
    return Math.abs(totalDebits - totalCredits) < 0.01; // Allow for small rounding differences
  },
  {
    message: "Total debits must equal total credits",
    path: ["lineItems"],
  }
).refine(
  (data) => {
    // Validate that each line has either debit or credit (not both)
    return data.lineItems.every(item =>
      (item.debitAmount > 0 && item.creditAmount === 0) ||
      (item.creditAmount > 0 && item.debitAmount === 0)
    );
  },
  {
    message: "Each line item must have either debit or credit amount, not both",
    path: ["lineItems"],
  }
);

// Get journal entries
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.transactionDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (source) {
      whereClause.source = source;
    }

    if (search) {
      whereClause.OR = [
        { journalNo: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [journalEntries, total] = await Promise.all([
      prisma.$queryRaw`
        SELECT
          je.id,
          je.journal_no,
          je.reference,
          je.description,
          je.transaction_date,
          je.posting_date,
          je.currency,
          je.exchange_rate,
          je.total_debit,
          je.total_credit,
          je.status,
          je.source,
          je.source_id,
          je.approved_by,
          je.approved_at,
          je.created_by,
          je.created_at,
          u.first_name,
          u.last_name,
          COUNT(jel.id) as line_count
        FROM journal_entries je
        LEFT JOIN users u ON je.created_by = u.id
        LEFT JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
        ${buildWhereClause(whereClause)}
        GROUP BY je.id, u.first_name, u.last_name
        ORDER BY je.transaction_date DESC, je.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      prisma.$queryRaw`
        SELECT COUNT(DISTINCT je.id) as count
        FROM journal_entries je
        ${buildWhereClause(whereClause)}
      `,
    ]);

    const formattedEntries = (journalEntries as any[]).map(entry => ({
      id: entry.id,
      journalNo: entry.journal_no,
      reference: entry.reference,
      description: entry.description,
      transactionDate: entry.transaction_date,
      postingDate: entry.posting_date,
      currency: entry.currency,
      exchangeRate: Number(entry.exchange_rate),
      totalDebit: Number(entry.total_debit),
      totalCredit: Number(entry.total_credit),
      status: entry.status,
      source: entry.source,
      sourceId: entry.source_id,
      approvedBy: entry.approved_by,
      approvedAt: entry.approved_at,
      createdBy: {
        id: entry.created_by,
        name: `${entry.first_name} ${entry.last_name}`,
      },
      createdAt: entry.created_at,
      lineCount: parseInt(entry.line_count),
    }));

    const totalCount = (total as any[])[0]?.count || 0;

    return apiResponse({
      success: true,
      data: formattedEntries,
      pagination: {
        page,
        limit,
        total: parseInt(totalCount),
        totalPages: Math.ceil(parseInt(totalCount) / limit),
      },
    });
  } catch (error) {
    console.error('Journal Entries GET error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to fetch journal entries', 500);
  }
});

// Create journal entry
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const body = await request.json();
    const validatedData = journalEntrySchema.parse(body);

    // Validate all accounts exist and can be posted to
    // Note: Account validation temporarily disabled until finance module schema is complete
    // const accountIds = validatedData.lineItems.map(item => item.accountId);
    // const accounts = await prisma.account.findMany({
    //   where: {
    //     id: { in: accountIds },
    //     isActive: true,
    //   },
    // });

    // if (accounts.length !== accountIds.length) {
    //   return NextResponse.json(
    //     { success: false, error: 'One or more accounts not found or inactive' },
    //     { status: 400 }
    //   );
    // }

    // Check if accounts allow posting
    // const nonPostingAccounts = accounts.filter(acc => !acc.allowPosting);
    // if (nonPostingAccounts.length > 0) {
    //   return NextResponse.json(
    //     { success: false, error: `Accounts ${nonPostingAccounts.map(acc => acc.code).join(', ')} do not allow direct posting` },
    //     { status: 400 }
    //   );
    // }

    // Generate journal number
    const journalNo = await generateJournalNumber();

    // Calculate totals
    const totalDebit = validatedData.lineItems.reduce((sum, item) => sum + item.debitAmount, 0);
    const totalCredit = validatedData.lineItems.reduce((sum, item) => sum + item.creditAmount, 0);

    // Create journal entry with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create journal entry
      const journalEntry = await tx.$executeRaw`
        INSERT INTO journal_entries (
          id, journal_no, reference, description, transaction_date,
          currency, exchange_rate, total_debit, total_credit,
          status, source, source_id, created_by, created_at, updated_at
        ) VALUES (
          ${generateId()}, ${journalNo}, ${validatedData.reference || null},
          ${validatedData.description}, ${new Date(validatedData.transactionDate)},
          ${validatedData.currency}, ${validatedData.exchangeRate},
          ${totalDebit}, ${totalCredit}, 'DRAFT', ${validatedData.source},
          ${validatedData.sourceId || null}, ${user.id},
          ${new Date()}, ${new Date()}
        )
      `;

      const journalEntryId = await tx.$queryRaw`
        SELECT id FROM journal_entries WHERE journal_no = ${journalNo}
      ` as any[];

      const entryId = journalEntryId[0].id;

      // Create journal entry lines
      for (let i = 0; i < validatedData.lineItems.length; i++) {
        const item = validatedData.lineItems[i];
        await tx.$executeRaw`
          INSERT INTO journal_entry_lines (
            id, journal_entry_id, line_number, account_id, description,
            debit_amount, credit_amount, currency, exchange_rate,
            debit_amount_base, credit_amount_base, cost_center, project,
            dimension1, dimension2
          ) VALUES (
            ${generateId()}, ${entryId}, ${i + 1}, ${item.accountId},
            ${item.description}, ${item.debitAmount}, ${item.creditAmount},
            ${validatedData.currency}, ${validatedData.exchangeRate},
            ${item.debitAmount * validatedData.exchangeRate},
            ${item.creditAmount * validatedData.exchangeRate},
            ${item.costCenter || null}, ${item.project || null},
            ${item.dimension1 || null}, ${item.dimension2 || null}
          )
        `;

        // Create individual transactions for each line
        const transactionNo = await generateTransactionNumber();
        await tx.transaction.create({
          data: {
            transactionNo,
            type: item.debitAmount > 0 ? 'DEBIT' : 'CREDIT',
            accountId: item.accountId,
            amount: item.debitAmount > 0 ? item.debitAmount : item.creditAmount,
            currency: validatedData.currency,
            description: item.description,
            referenceType: 'journal_entry',
            referenceId: entryId,
            transactionDate: new Date(validatedData.transactionDate),
            status: 'PENDING', // Will be completed when journal is posted
            createdById: user.id,
          },
        });
      }

      return entryId;
    });

    return apiResponse({
      success: true,
      data: {
        id: result,
        journalNo,
        totalDebit,
        totalCredit,
        status: 'DRAFT',
      },
      message: 'Journal entry created successfully',
    });
  } catch (error) {
    console.error('Journal Entry POST error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to create journal entry', 500);
  }
});

// Helper functions
function buildWhereClause(whereClause: any): string {
  let sql = 'WHERE 1=1';

  if (whereClause.status) {
    sql += ` AND je.status = '${whereClause.status}'`;
  }

  if (whereClause.transactionDate) {
    sql += ` AND je.transaction_date >= '${whereClause.transactionDate.gte.toISOString()}'`;
    sql += ` AND je.transaction_date <= '${whereClause.transactionDate.lte.toISOString()}'`;
  }

  if (whereClause.source) {
    sql += ` AND je.source = '${whereClause.source}'`;
  }

  if (whereClause.OR) {
    const orConditions = whereClause.OR.map((condition: any) => {
      const field = Object.keys(condition)[0];
      const value = condition[field].contains;
      return `je.${field} ILIKE '%${value}%'`;
    }).join(' OR ');
    sql += ` AND (${orConditions})`;
  }

  return sql;
}

async function generateJournalNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM journal_entries
    WHERE journal_no LIKE 'JE-${year}-%'
  ` as any[];

  const nextNumber = (parseInt(count[0]?.count || '0') + 1).toString().padStart(6, '0');
  return `JE-${year}-${nextNumber}`;
}

async function generateTransactionNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.transaction.count({
    where: {
      transactionNo: {
        startsWith: `TXN-${year}-`,
      },
    },
  });

  const nextNumber = (count + 1).toString().padStart(6, '0');
  return `TXN-${year}-${nextNumber}`;
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}