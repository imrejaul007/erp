import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get specific journal entry with line items
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Get journal entry with line items and account details
    const journalEntry = await prisma.$queryRaw`
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
        je.reversed_by,
        je.reversed_at,
        je.reversal_reason,
        je.created_by,
        je.created_at,
        je.updated_at,
        u1.first_name as created_by_first_name,
        u1.last_name as created_by_last_name,
        u2.first_name as approved_by_first_name,
        u2.last_name as approved_by_last_name
      FROM journal_entries je
      LEFT JOIN users u1 ON je.created_by = u1.id
      LEFT JOIN users u2 ON je.approved_by = u2.id
      WHERE je.id = ${id}
    ` as any[];

    if (journalEntry.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    const entry = journalEntry[0];

    // Get line items
    const lineItems = await prisma.$queryRaw`
      SELECT
        jel.id,
        jel.line_number,
        jel.account_id,
        jel.description,
        jel.debit_amount,
        jel.credit_amount,
        jel.currency,
        jel.exchange_rate,
        jel.debit_amount_base,
        jel.credit_amount_base,
        jel.cost_center,
        jel.project,
        jel.dimension1,
        jel.dimension2,
        a.code as account_code,
        a.name as account_name,
        a.name_ar as account_name_ar,
        a.type as account_type
      FROM journal_entry_lines jel
      LEFT JOIN accounts a ON jel.account_id = a.id
      WHERE jel.journal_entry_id = ${id}
      ORDER BY jel.line_number
    ` as any[];

    const formattedEntry = {
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
      approvedBy: entry.approved_by ? {
        id: entry.approved_by,
        name: `${entry.approved_by_first_name} ${entry.approved_by_last_name}`,
      } : null,
      approvedAt: entry.approved_at,
      reversedBy: entry.reversed_by,
      reversedAt: entry.reversed_at,
      reversalReason: entry.reversal_reason,
      createdBy: {
        id: entry.created_by,
        name: `${entry.created_by_first_name} ${entry.created_by_last_name}`,
      },
      createdAt: entry.created_at,
      updatedAt: entry.updated_at,
      lineItems: lineItems.map((line: any) => ({
        id: line.id,
        lineNumber: line.line_number,
        accountId: line.account_id,
        description: line.description,
        debitAmount: Number(line.debit_amount),
        creditAmount: Number(line.credit_amount),
        currency: line.currency,
        exchangeRate: Number(line.exchange_rate),
        debitAmountBase: Number(line.debit_amount_base),
        creditAmountBase: Number(line.credit_amount_base),
        costCenter: line.cost_center,
        project: line.project,
        dimension1: line.dimension1,
        dimension2: line.dimension2,
        account: {
          id: line.account_id,
          code: line.account_code,
          name: line.account_name,
          nameAr: line.account_name_ar,
          type: line.account_type,
        },
      })),
    };

    return NextResponse.json({
      success: true,
      data: formattedEntry,
    });
  } catch (error) {
    console.error('Journal Entry GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journal entry' },
      { status: 500 }
    );
  }
}

// Post journal entry (approve and post to ledger)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Get current journal entry
    const journalEntry = await prisma.$queryRaw`
      SELECT * FROM journal_entries WHERE id = ${id}
    ` as any[];

    if (journalEntry.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    const entry = journalEntry[0];

    if (entry.status !== 'DRAFT' && entry.status !== 'PENDING_APPROVAL') {
      return NextResponse.json(
        { success: false, error: 'Journal entry cannot be posted in current status' },
        { status: 400 }
      );
    }

    // Post journal entry within transaction
    await prisma.$transaction(async (tx) => {
      // Update journal entry status
      await tx.$executeRaw`
        UPDATE journal_entries
        SET
          status = 'POSTED',
          approved_by = ${session.user.id},
          approved_at = ${new Date()},
          posting_date = ${new Date()},
          updated_at = ${new Date()}
        WHERE id = ${id}
      `;

      // Update all related transactions to completed
      await tx.transaction.updateMany({
        where: {
          referenceType: 'journal_entry',
          referenceId: id,
        },
        data: {
          status: 'COMPLETED',
          updatedById: session.user.id,
          updatedAt: new Date(),
        },
      });

      // Update account balances
      const lineItems = await tx.$queryRaw`
        SELECT
          jel.account_id,
          jel.debit_amount,
          jel.credit_amount,
          a.type as account_type
        FROM journal_entry_lines jel
        LEFT JOIN accounts a ON jel.account_id = a.id
        WHERE jel.journal_entry_id = ${id}
      ` as any[];

      for (const item of lineItems) {
        const debitAmount = Number(item.debit_amount);
        const creditAmount = Number(item.credit_amount);
        const accountType = item.account_type;

        // Calculate balance change based on account type
        let balanceChange = 0;
        if (['ASSET', 'EXPENSE'].includes(accountType)) {
          // Debit increases assets and expenses
          balanceChange = debitAmount - creditAmount;
        } else {
          // Credit increases liabilities, equity, and revenue
          balanceChange = creditAmount - debitAmount;
        }

        // Update account balance
        await tx.account.update({
          where: { id: item.account_id },
          data: {
            balance: {
              increment: balanceChange,
            },
            updatedAt: new Date(),
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Journal entry posted successfully',
    });
  } catch (error) {
    console.error('Journal Entry POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to post journal entry' },
      { status: 500 }
    );
  }
}

// Reverse journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { reason } = body;

    if (!reason) {
      return NextResponse.json(
        { success: false, error: 'Reversal reason is required' },
        { status: 400 }
      );
    }

    // Get current journal entry
    const journalEntry = await prisma.$queryRaw`
      SELECT * FROM journal_entries WHERE id = ${id}
    ` as any[];

    if (journalEntry.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    const entry = journalEntry[0];

    if (entry.status !== 'POSTED') {
      return NextResponse.json(
        { success: false, error: 'Only posted journal entries can be reversed' },
        { status: 400 }
      );
    }

    // Reverse journal entry within transaction
    const reversalJournalNo = await generateReversalJournalNumber(entry.journal_no);

    await prisma.$transaction(async (tx) => {
      // Mark original journal entry as reversed
      await tx.$executeRaw`
        UPDATE journal_entries
        SET
          status = 'REVERSED',
          reversed_by = ${session.user.id},
          reversed_at = ${new Date()},
          reversal_reason = ${reason},
          updated_at = ${new Date()}
        WHERE id = ${id}
      `;

      // Get original line items
      const originalLineItems = await tx.$queryRaw`
        SELECT * FROM journal_entry_lines WHERE journal_entry_id = ${id}
      ` as any[];

      // Create reversal journal entry
      const reversalId = generateId();
      await tx.$executeRaw`
        INSERT INTO journal_entries (
          id, journal_no, reference, description, transaction_date,
          currency, exchange_rate, total_debit, total_credit,
          status, source, source_id, created_by, created_at, updated_at
        ) VALUES (
          ${reversalId}, ${reversalJournalNo},
          ${`Reversal of ${entry.journal_no}`},
          ${`REVERSAL: ${entry.description} - ${reason}`},
          ${new Date()}, ${entry.currency}, ${entry.exchange_rate},
          ${entry.total_debit}, ${entry.total_credit},
          'POSTED', 'reversal', ${id}, ${session.user.id},
          ${new Date()}, ${new Date()}
        )
      `;

      // Create reversal line items (swap debits and credits)
      for (const item of originalLineItems) {
        await tx.$executeRaw`
          INSERT INTO journal_entry_lines (
            id, journal_entry_id, line_number, account_id, description,
            debit_amount, credit_amount, currency, exchange_rate,
            debit_amount_base, credit_amount_base, cost_center, project,
            dimension1, dimension2
          ) VALUES (
            ${generateId()}, ${reversalId}, ${item.line_number}, ${item.account_id},
            ${`REVERSAL: ${item.description}`},
            ${item.credit_amount}, ${item.debit_amount},
            ${item.currency}, ${item.exchange_rate},
            ${item.credit_amount_base}, ${item.debit_amount_base},
            ${item.cost_center}, ${item.project},
            ${item.dimension1}, ${item.dimension2}
          )
        `;

        // Create reversal transactions
        const transactionNo = await generateTransactionNumber();
        const reversalAmount = Number(item.debit_amount) > 0 ? Number(item.credit_amount) : Number(item.debit_amount);
        const reversalType = Number(item.debit_amount) > 0 ? 'CREDIT' : 'DEBIT';

        await tx.transaction.create({
          data: {
            transactionNo,
            type: reversalType as any,
            accountId: item.account_id,
            amount: reversalAmount,
            currency: item.currency,
            description: `REVERSAL: ${item.description}`,
            referenceType: 'journal_entry',
            referenceId: reversalId,
            transactionDate: new Date(),
            status: 'COMPLETED',
            createdById: session.user.id,
          },
        });

        // Update account balance (reverse the original effect)
        const accountType = await tx.account.findUnique({
          where: { id: item.account_id },
          select: { type: true },
        });

        let balanceChange = 0;
        if (['ASSET', 'EXPENSE'].includes(accountType?.type || '')) {
          // Reverse the original debit/credit effect
          balanceChange = Number(item.credit_amount) - Number(item.debit_amount);
        } else {
          // Reverse the original credit/debit effect
          balanceChange = Number(item.debit_amount) - Number(item.credit_amount);
        }

        await tx.account.update({
          where: { id: item.account_id },
          data: {
            balance: {
              increment: balanceChange,
            },
            updatedAt: new Date(),
          },
        });
      }

      // Mark original transactions as cancelled
      await tx.transaction.updateMany({
        where: {
          referenceType: 'journal_entry',
          referenceId: id,
        },
        data: {
          status: 'CANCELLED',
          updatedById: session.user.id,
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        reversalJournalNo,
      },
      message: 'Journal entry reversed successfully',
    });
  } catch (error) {
    console.error('Journal Entry DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reverse journal entry' },
      { status: 500 }
    );
  }
}

// Helper functions
async function generateReversalJournalNumber(originalJournalNo: string): Promise<string> {
  return `REV-${originalJournalNo}`;
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