import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/journal-entries - List all journal entries
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.entryDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const journalEntries = await prisma.journal_entries.findMany({
      where,
      include: {
        journal_entry_lines: {
          include: {
            accounts: true,
            cost_centers: true,
          },
        },
        users_journal_entries_createdByIdTousers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        users_journal_entries_approvedByIdTousers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        entryDate: 'desc',
      },
    });

    return NextResponse.json(journalEntries);
  } catch (error: any) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/journal-entries - Create a new journal entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      entryNo,
      entryDate,
      description,
      referenceType,
      referenceId,
      notes,
      createdById,
      tenantId,
      lines,
    } = body;

    // Validate lines balance
    const totalDebit = lines.reduce((sum: number, line: any) => sum + Number(line.debit || 0), 0);
    const totalCredit = lines.reduce((sum: number, line: any) => sum + Number(line.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return NextResponse.json(
        { error: 'Journal entry is not balanced. Debits must equal credits.' },
        { status: 400 }
      );
    }

    // Create journal entry with lines
    const journalEntry = await prisma.journal_entries.create({
      data: {
        id: `je-${Date.now()}`,
        entryNo,
        entryDate: new Date(entryDate),
        description,
        referenceType,
        referenceId,
        status: 'DRAFT',
        totalDebit,
        totalCredit,
        notes,
        createdById,
        tenantId,
        updatedAt: new Date(),
        journal_entry_lines: {
          create: lines.map((line: any, index: number) => ({
            id: `jel-${Date.now()}-${index}`,
            accountId: line.accountId,
            description: line.description,
            debit: line.debit || 0,
            credit: line.credit || 0,
            costCenterId: line.costCenterId,
            lineNumber: index + 1,
          })),
        },
      },
      include: {
        journal_entry_lines: {
          include: {
            accounts: true,
          },
        },
      },
    });

    return NextResponse.json(journalEntry, { status: 201 });
  } catch (error: any) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry', details: error.message },
      { status: 500 }
    );
  }
}
