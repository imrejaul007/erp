import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-simple';
import { randomUUID } from 'crypto';

// Helper to calculate VAT
function calculateVAT(amount: number, vatRate: number) {
  return Number((amount * (vatRate / 100)).toFixed(2));
}

// Helper to generate sale number
async function generateSaleNumber(tenantId: string) {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  const lastSale = await prisma.$queryRaw<any[]>`
    SELECT "saleNo" FROM sales
    WHERE "tenantId" = ${tenantId}
    ORDER BY "createdAt" DESC
    LIMIT 1
  `;

  let sequence = 1;
  if (lastSale.length > 0) {
    const lastNo = lastSale[0].saleNo;
    const lastSeq = parseInt(lastNo.split('-').pop() || '0');
    sequence = lastSeq + 1;
  }

  return `SAL-${year}${month}-${sequence.toString().padStart(5, '0')}`;
}

// GET - List all sales
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant context' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const source = searchParams.get('source'); // MANUAL, NOON, AMAZON, etc.
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    // Build where clause
    let whereConditions: string[] = [`"tenantId" = '${tenantId}'`];
    if (source) {
      whereConditions.push(`source = '${source}'`);
    }
    if (status) {
      whereConditions.push(`status = '${status}'`);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Get sales with items
    const sales = await prisma.$queryRawUnsafe<any[]>(`
      SELECT
        s.*,
        c.name as "customerName",
        st.name as "storeName",
        COUNT(si.id) as "itemCount"
      FROM sales s
      LEFT JOIN customers c ON s."customerId" = c.id
      LEFT JOIN stores st ON s."storeId" = st.id
      LEFT JOIN sale_items si ON s.id = si."saleId"
      ${whereClause}
      GROUP BY s.id, c.name, st.name
      ORDER BY s."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    // Get total count
    const totalResult = await prisma.$queryRawUnsafe<any[]>(`
      SELECT COUNT(*) as count FROM sales ${whereClause}
    `);

    const total = parseInt(totalResult[0].count);

    return NextResponse.json({
      data: sales,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('GET /api/sales error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new sale
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    const userId = session.user.id;

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant context' }, { status: 400 });
    }

    const body = await req.json();
    const {
      storeId,
      customerId,
      items,  // Array of { productId, quantity, unitPrice, vatRate?, discountPercent? }
      notes,
      paymentMethod,
      paymentStatus = 'PENDING',
      status = 'COMPLETED',
      source = 'MANUAL',
      marketplaceOrderId,
      saleDate
    } = body;

    // Validation
    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 });
    }

    // Validate items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.productId) {
        return NextResponse.json({ error: `Item ${i + 1}: Product ID is required` }, { status: 400 });
      }

      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json({ error: `Item ${i + 1}: Quantity must be greater than 0` }, { status: 400 });
      }

      if (item.unitPrice === undefined || item.unitPrice < 0) {
        return NextResponse.json({ error: `Item ${i + 1}: Unit price cannot be negative` }, { status: 400 });
      }

      if (item.vatRate !== undefined && (item.vatRate < 0 || item.vatRate > 100)) {
        return NextResponse.json({ error: `Item ${i + 1}: VAT rate must be between 0 and 100` }, { status: 400 });
      }

      if (item.discountPercent !== undefined && (item.discountPercent < 0 || item.discountPercent > 100)) {
        return NextResponse.json({ error: `Item ${i + 1}: Discount must be between 0 and 100` }, { status: 400 });
      }
    }

    // Generate sale number
    const saleNo = await generateSaleNumber(tenantId);
    const saleId = randomUUID();

    // Calculate totals
    let subtotal = 0;
    let totalVat = 0;
    let totalDiscount = 0;

    const processedItems = items.map(item => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      const vatRate = Number(item.vatRate || 5); // Default 5% VAT for UAE
      const discountPercent = Number(item.discountPercent || 0);

      const itemSubtotal = quantity * unitPrice;
      const discountAmount = itemSubtotal * (discountPercent / 100);
      const amountAfterDiscount = itemSubtotal - discountAmount;
      const vatAmount = calculateVAT(amountAfterDiscount, vatRate);
      const totalAmount = amountAfterDiscount + vatAmount;

      subtotal += itemSubtotal;
      totalDiscount += discountAmount;
      totalVat += vatAmount;

      return {
        id: randomUUID(),
        saleId,
        productId: item.productId,
        quantity,
        unit: item.unit || 'PIECE',
        unitPrice,
        discountPercent,
        discountAmount,
        vatRate,
        vatAmount,
        totalAmount,
        notes: item.notes || null,
        tenantId
      };
    });

    const totalAmount = subtotal - totalDiscount + totalVat;

    // Create sale
    await prisma.$executeRaw`
      INSERT INTO sales (
        id, "saleNo", "storeId", "customerId", status, "saleDate", "dueDate",
        subtotal, "discountAmount", "vatAmount", "totalAmount", currency,
        "paymentStatus", "paymentMethod", notes, source, "marketplaceOrderId",
        "importedAt", "createdById", "updatedById", "tenantId", "createdAt", "updatedAt"
      )
      VALUES (
        ${saleId}, ${saleNo}, ${storeId}, ${customerId || null}, ${status},
        ${saleDate ? new Date(saleDate) : new Date()}, NULL,
        ${subtotal}, ${totalDiscount}, ${totalVat}, ${totalAmount}, 'AED',
        ${paymentStatus}, ${paymentMethod || null}, ${notes || null},
        ${source}, ${marketplaceOrderId || null},
        ${source !== 'MANUAL' ? new Date() : null},
        ${userId}, ${userId}, ${tenantId}, NOW(), NOW()
      )
    `;

    // Create sale items
    for (const item of processedItems) {
      await prisma.$executeRaw`
        INSERT INTO sale_items (
          id, "saleId", "productId", quantity, unit, "unitPrice",
          "discountPercent", "discountAmount", "vatRate", "vatAmount",
          "totalAmount", notes, "tenantId"
        )
        VALUES (
          ${item.id}, ${item.saleId}, ${item.productId}, ${item.quantity},
          ${item.unit}, ${item.unitPrice}, ${item.discountPercent},
          ${item.discountAmount}, ${item.vatRate}, ${item.vatAmount},
          ${item.totalAmount}, ${item.notes}, ${item.tenantId}
        )
      `;
    }

    // Create VAT record for reporting
    const vatRecordId = randomUUID();
    const vatRecordNo = `VAT-${Date.now()}`;

    await prisma.$executeRaw`
      INSERT INTO vat_records (
        id, "recordNo", type, amount, "vatAmount", "vatRate",
        currency, description, "referenceType", "referenceId",
        "recordDate", period, status, "tenantId", "createdAt", "updatedAt"
      )
      VALUES (
        ${vatRecordId}, ${vatRecordNo}, 'OUTPUT',
        ${subtotal - totalDiscount}, ${totalVat}, 5.0,
        'AED', ${`Sales Invoice ${saleNo}`}, 'SALE', ${saleId},
        ${new Date()}, ${new Date().toISOString().slice(0, 7)}, 'ACTIVE',
        ${tenantId}, NOW(), NOW()
      )
    `;

    // Fetch created sale with details
    const createdSale = await prisma.$queryRaw<any[]>`
      SELECT * FROM sales WHERE id = ${saleId}
    `;

    return NextResponse.json({
      message: 'Sale created successfully',
      data: {
        ...createdSale[0],
        items: processedItems
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/sales error:', error);
    return NextResponse.json(
      { error: 'Failed to create sale', details: error.message },
      { status: 500 }
    );
  }
}
