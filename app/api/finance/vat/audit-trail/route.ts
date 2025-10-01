import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// VAT Audit Trail schema
const auditTrailSchema = z.object({
  vatTransactionId: z.string(),
  action: z.string(),
  oldValue: z.any().optional(),
  newValue: z.any().optional(),
  reason: z.string().optional(),
});

// Get VAT audit trail
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const vatTransactionId = searchParams.get('vatTransactionId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const action = searchParams.get('action');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};

    if (vatTransactionId) {
      whereClause.vatTransactionId = vatTransactionId;
    }

    if (startDate && endDate) {
      whereClause.performedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (action) {
      whereClause.action = action;
    }

    // Get audit trails with related data
    const [auditTrails, total] = await Promise.all([
      prisma.$queryRaw`
        SELECT
          vat_audit.id,
          vat_audit.vat_transaction_id,
          vat_audit.action,
          vat_audit.old_value,
          vat_audit.new_value,
          vat_audit.reason,
          vat_audit.performed_by,
          vat_audit.performed_at,
          users.first_name,
          users.last_name,
          users.email,
          vat_records.record_no,
          vat_records.type,
          vat_records.amount,
          vat_records.vat_amount,
          vat_records.description
        FROM vat_audit_trail vat_audit
        LEFT JOIN users ON vat_audit.performed_by = users.id
        LEFT JOIN vat_records ON vat_audit.vat_transaction_id = vat_records.id
        WHERE 1=1
        ${vatTransactionId ? `AND vat_audit.vat_transaction_id = '${vatTransactionId}'` : ''}
        ${startDate && endDate ? `AND vat_audit.performed_at BETWEEN '${startDate}' AND '${endDate}'` : ''}
        ${action ? `AND vat_audit.action = '${action}'` : ''}
        ORDER BY vat_audit.performed_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      prisma.$queryRaw`
        SELECT COUNT(*) as count
        FROM vat_audit_trail vat_audit
        WHERE 1=1
        ${vatTransactionId ? `AND vat_audit.vat_transaction_id = '${vatTransactionId}'` : ''}
        ${startDate && endDate ? `AND vat_audit.performed_at BETWEEN '${startDate}' AND '${endDate}'` : ''}
        ${action ? `AND vat_audit.action = '${action}'` : ''}
      `,
    ]);

    // Format the response
    const formattedTrails = (auditTrails as any[]).map(trail => ({
      id: trail.id,
      vatTransactionId: trail.vat_transaction_id,
      action: trail.action,
      oldValue: trail.old_value,
      newValue: trail.new_value,
      reason: trail.reason,
      performedAt: trail.performed_at,
      performedBy: {
        id: trail.performed_by,
        name: `${trail.first_name} ${trail.last_name}`,
        email: trail.email,
      },
      vatTransaction: {
        recordNo: trail.record_no,
        type: trail.type,
        amount: trail.amount,
        vatAmount: trail.vat_amount,
        description: trail.description,
      },
    }));

    const totalCount = (total as any[])[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: formattedTrails,
      pagination: {
        page,
        limit,
        total: parseInt(totalCount),
        totalPages: Math.ceil(parseInt(totalCount) / limit),
      },
    });
  } catch (error) {
    console.error('VAT Audit Trail GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch VAT audit trail' },
      { status: 500 }
    );
  }
}

// Create VAT audit trail entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = auditTrailSchema.parse(body);

    // Verify the VAT transaction exists
    const vatTransaction = await prisma.vATRecord.findUnique({
      where: { id: validatedData.vatTransactionId },
    });

    if (!vatTransaction) {
      return NextResponse.json(
        { success: false, error: 'VAT transaction not found' },
        { status: 404 }
      );
    }

    // Create audit trail entry (using raw SQL since the table might not be in Prisma schema)
    const auditTrail = await prisma.$executeRaw`
      INSERT INTO vat_audit_trail (
        id,
        vat_transaction_id,
        action,
        old_value,
        new_value,
        reason,
        performed_by,
        performed_at
      ) VALUES (
        ${generateId()},
        ${validatedData.vatTransactionId},
        ${validatedData.action},
        ${JSON.stringify(validatedData.oldValue)},
        ${JSON.stringify(validatedData.newValue)},
        ${validatedData.reason || null},
        ${session.user.id},
        ${new Date()}
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'VAT audit trail entry created successfully',
    });
  } catch (error) {
    console.error('VAT Audit Trail POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create audit trail entry' },
      { status: 500 }
    );
  }
}

// Get audit trail summary/statistics
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || getCurrentPeriod();

    // Get audit trail statistics
    const stats = await prisma.$queryRaw`
      SELECT
        action,
        COUNT(*) as count,
        DATE_TRUNC('day', performed_at) as date
      FROM vat_audit_trail vat_audit
      LEFT JOIN vat_records ON vat_audit.vat_transaction_id = vat_records.id
      WHERE vat_records.period = ${period}
      GROUP BY action, DATE_TRUNC('day', performed_at)
      ORDER BY date DESC
    `;

    // Get most active users
    const activeUsers = await prisma.$queryRaw`
      SELECT
        users.id,
        users.first_name,
        users.last_name,
        users.email,
        COUNT(vat_audit.id) as audit_count
      FROM vat_audit_trail vat_audit
      LEFT JOIN users ON vat_audit.performed_by = users.id
      LEFT JOIN vat_records ON vat_audit.vat_transaction_id = vat_records.id
      WHERE vat_records.period = ${period}
      GROUP BY users.id, users.first_name, users.last_name, users.email
      ORDER BY audit_count DESC
      LIMIT 10
    `;

    // Get recent changes
    const recentChanges = await prisma.$queryRaw`
      SELECT
        vat_audit.id,
        vat_audit.action,
        vat_audit.performed_at,
        users.first_name,
        users.last_name,
        vat_records.record_no,
        vat_records.description
      FROM vat_audit_trail vat_audit
      LEFT JOIN users ON vat_audit.performed_by = users.id
      LEFT JOIN vat_records ON vat_audit.vat_transaction_id = vat_records.id
      WHERE vat_records.period = ${period}
      ORDER BY vat_audit.performed_at DESC
      LIMIT 20
    `;

    return NextResponse.json({
      success: true,
      data: {
        period,
        statistics: stats,
        activeUsers: activeUsers,
        recentChanges: recentChanges,
        summary: {
          totalAuditEntries: (stats as any[]).reduce((sum, stat) => sum + parseInt(stat.count), 0),
          uniqueActions: [...new Set((stats as any[]).map(stat => stat.action))],
          dateRange: {
            earliest: Math.min(...(stats as any[]).map(stat => new Date(stat.date).getTime())),
            latest: Math.max(...(stats as any[]).map(stat => new Date(stat.date).getTime())),
          },
        },
      },
    });
  } catch (error) {
    console.error('VAT Audit Trail Stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit trail statistics' },
      { status: 500 }
    );
  }
}

// Helper functions
function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function generateId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to log VAT transaction changes
export async function logVATChange(
  vatTransactionId: string,
  action: string,
  oldValue: any,
  newValue: any,
  reason: string,
  userId: string
) {
  try {
    await prisma.$executeRaw`
      INSERT INTO vat_audit_trail (
        id,
        vat_transaction_id,
        action,
        old_value,
        new_value,
        reason,
        performed_by,
        performed_at
      ) VALUES (
        ${generateId()},
        ${vatTransactionId},
        ${action},
        ${JSON.stringify(oldValue)},
        ${JSON.stringify(newValue)},
        ${reason},
        ${userId},
        ${new Date()}
      )
    `;
  } catch (error) {
    console.error('Failed to log VAT change:', error);
    // Don't throw error to avoid breaking the main operation
  }
}