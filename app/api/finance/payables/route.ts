import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const purchaseSchema = z.object({
  supplierId: z.string(),
  invoiceNo: z.string().optional(),
  invoiceDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  currency: z.string().default('AED'),
  exchangeRate: z.number().positive().default(1),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    vatRate: z.number().min(0).max(100).default(5),
    rawMaterialId: z.string().optional(),
    assetId: z.string().optional(),
  })).min(1),
  notes: z.string().optional(),
});

// Get purchases/payables
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const status = searchParams.get('status');
    const supplierId = searchParams.get('supplierId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const whereClause: any = {};

    if (status) whereClause.status = status;
    if (supplierId) whereClause.supplierId = supplierId;
    if (startDate && endDate) {
      whereClause.invoiceDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [purchases, total] = await Promise.all([
      prisma.$queryRaw`
        SELECT
          p.*,
          s.name as supplier_name,
          s.supplier_no,
          COUNT(pl.id) as line_count
        FROM purchases p
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        LEFT JOIN purchase_line_items pl ON p.id = pl.purchase_id
        ${buildWhereClause(whereClause)}
        GROUP BY p.id, s.name, s.supplier_no
        ORDER BY p.invoice_date DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      prisma.$queryRaw`
        SELECT COUNT(DISTINCT p.id) as count
        FROM purchases p
        ${buildWhereClause(whereClause)}
      `,
    ]);

    return NextResponse.json({
      success: true,
      data: purchases,
      pagination: {
        page,
        limit,
        total: parseInt((total as any[])[0]?.count || '0'),
        totalPages: Math.ceil(parseInt((total as any[])[0]?.count || '0') / limit),
      },
    });
  } catch (error) {
    console.error('Payables GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payables' },
      { status: 500 }
    );
  }
}

// Create purchase
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = purchaseSchema.parse(body);

    const purchaseNo = await generatePurchaseNumber();
    const purchaseId = generateId();

    // Calculate totals
    let subtotal = 0;
    let vatAmount = 0;

    validatedData.lineItems.forEach(item => {
      const lineTotal = item.quantity * item.unitPrice;
      const lineVat = lineTotal * (item.vatRate / 100);
      subtotal += lineTotal;
      vatAmount += lineVat;
    });

    const totalAmount = subtotal + vatAmount;

    await prisma.$transaction(async (tx) => {
      // Create purchase record
      await tx.$executeRaw`
        INSERT INTO purchases (
          id, purchase_no, supplier_id, invoice_no, invoice_date, due_date,
          currency, exchange_rate, subtotal, vat_amount, total_amount,
          status, payment_status, notes, created_at, updated_at
        ) VALUES (
          ${purchaseId}, ${purchaseNo}, ${validatedData.supplierId},
          ${validatedData.invoiceNo || null}, ${new Date(validatedData.invoiceDate)},
          ${new Date(validatedData.dueDate)}, ${validatedData.currency},
          ${validatedData.exchangeRate}, ${subtotal}, ${vatAmount}, ${totalAmount},
          'PENDING', 'PENDING', ${validatedData.notes || null},
          ${new Date()}, ${new Date()}
        )
      `;

      // Create line items
      for (const item of validatedData.lineItems) {
        const lineTotal = item.quantity * item.unitPrice;
        const lineVat = lineTotal * (item.vatRate / 100);
        const lineTotalWithVat = lineTotal + lineVat;

        await tx.$executeRaw`
          INSERT INTO purchase_line_items (
            id, purchase_id, description, quantity, unit_price, vat_rate,
            vat_amount, total_amount, raw_material_id, asset_id
          ) VALUES (
            ${generateId()}, ${purchaseId}, ${item.description}, ${item.quantity},
            ${item.unitPrice}, ${item.vatRate}, ${lineVat}, ${lineTotalWithVat},
            ${item.rawMaterialId || null}, ${item.assetId || null}
          )
        `;
      }

      // Create accounts payable transaction
      const transactionNo = await generateTransactionNumber();
      await tx.transaction.create({
        data: {
          transactionNo,
          type: 'CREDIT',
          accountId: await getAccountId('2110'), // Accounts Payable
          amount: totalAmount,
          currency: validatedData.currency,
          description: `Purchase from supplier - ${purchaseNo}`,
          referenceType: 'purchase',
          referenceId: purchaseId,
          transactionDate: new Date(validatedData.invoiceDate),
          status: 'COMPLETED',
          createdById: session.user.id,
        },
      });

      // Create expense/asset transactions for line items
      for (const item of validatedData.lineItems) {
        const lineTotal = item.quantity * item.unitPrice;
        const accountId = item.assetId
          ? await getAccountId('1210') // Fixed Assets
          : await getAccountId('5100'); // Raw Material Costs

        await tx.transaction.create({
          data: {
            transactionNo: await generateTransactionNumber(),
            type: 'DEBIT',
            accountId,
            amount: lineTotal,
            currency: validatedData.currency,
            description: item.description,
            referenceType: 'purchase',
            referenceId: purchaseId,
            transactionDate: new Date(validatedData.invoiceDate),
            status: 'COMPLETED',
            createdById: session.user.id,
          },
        });
      }

      // Create VAT transaction if applicable
      if (vatAmount > 0) {
        await tx.transaction.create({
          data: {
            transactionNo: await generateTransactionNumber(),
            type: 'DEBIT',
            accountId: await getAccountId('1170'), // VAT Recoverable
            amount: vatAmount,
            currency: validatedData.currency,
            description: `VAT on purchase - ${purchaseNo}`,
            referenceType: 'purchase',
            referenceId: purchaseId,
            transactionDate: new Date(validatedData.invoiceDate),
            status: 'COMPLETED',
            createdById: session.user.id,
          },
        });

        // Create VAT record
        await tx.vATRecord.create({
          data: {
            recordNo: `VAT-${purchaseNo}`,
            type: 'INPUT',
            amount: subtotal,
            vatAmount,
            vatRate: 5,
            currency: validatedData.currency,
            description: `Purchase VAT - ${purchaseNo}`,
            referenceType: 'purchase',
            referenceId: purchaseId,
            period: new Date(validatedData.invoiceDate).toISOString().substring(0, 7),
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: { id: purchaseId, purchaseNo, totalAmount },
      message: 'Purchase created successfully',
    });
  } catch (error) {
    console.error('Purchase POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create purchase' },
      { status: 500 }
    );
  }
}

// Helper functions
function buildWhereClause(whereClause: any): string {
  let sql = 'WHERE 1=1';

  if (whereClause.status) {
    sql += ` AND p.status = '${whereClause.status}'`;
  }
  if (whereClause.supplierId) {
    sql += ` AND p.supplier_id = '${whereClause.supplierId}'`;
  }
  if (whereClause.invoiceDate) {
    sql += ` AND p.invoice_date >= '${whereClause.invoiceDate.gte.toISOString()}'`;
    sql += ` AND p.invoice_date <= '${whereClause.invoiceDate.lte.toISOString()}'`;
  }

  return sql;
}

async function generatePurchaseNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.$queryRaw`
    SELECT COUNT(*) as count FROM purchases WHERE purchase_no LIKE 'PO-${year}-%'
  ` as any[];

  const nextNumber = (parseInt(count[0]?.count || '0') + 1).toString().padStart(6, '0');
  return `PO-${year}-${nextNumber}`;
}

async function generateTransactionNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.transaction.count({
    where: { transactionNo: { startsWith: `TXN-${year}-` } },
  });

  const nextNumber = (count + 1).toString().padStart(6, '0');
  return `TXN-${year}-${nextNumber}`;
}

async function getAccountId(accountCode: string): Promise<string> {
  const account = await prisma.account.findFirst({
    where: { code: accountCode, isActive: true },
    select: { id: true },
  });

  if (!account) {
    throw new Error(`Account with code ${accountCode} not found`);
  }

  return account.id;
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}