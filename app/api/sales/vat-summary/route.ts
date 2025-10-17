import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-simple';

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

    // Get current month start and end
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get total sales for this month
    const salesSummary = await prisma.$queryRaw<any[]>`
      SELECT
        COALESCE(SUM("totalAmount"), 0) as "totalSales",
        COALESCE(SUM("vatAmount"), 0) as "totalVat",
        COALESCE(SUM("subtotal"), 0) as "totalSubtotal",
        COUNT(*) as "totalCount"
      FROM sales
      WHERE "tenantId" = ${tenantId}
      AND "saleDate" >= ${startOfMonth}
      AND "saleDate" <= ${endOfMonth}
    `;

    // Get sales by source
    const salesBySource = await prisma.$queryRaw<any[]>`
      SELECT
        source,
        COUNT(*) as count,
        COALESCE(SUM("totalAmount"), 0) as total
      FROM sales
      WHERE "tenantId" = ${tenantId}
      AND "saleDate" >= ${startOfMonth}
      AND "saleDate" <= ${endOfMonth}
      GROUP BY source
    `;

    // Get VAT records summary
    const vatRecords = await prisma.$queryRaw<any[]>`
      SELECT
        type,
        COALESCE(SUM("vatAmount"), 0) as "totalVat",
        COUNT(*) as count
      FROM vat_records
      WHERE "tenantId" = ${tenantId}
      AND "recordDate" >= ${startOfMonth}
      AND "recordDate" <= ${endOfMonth}
      GROUP BY type
    `;

    const summary = salesSummary[0] || {
      totalSales: 0,
      totalVat: 0,
      totalSubtotal: 0,
      totalCount: 0
    };

    // Calculate manual vs marketplace counts
    const manualCount = salesBySource.find(s => s.source === 'MANUAL')?.count || 0;
    const marketplaceCount = salesBySource
      .filter(s => s.source !== 'MANUAL')
      .reduce((sum, s) => sum + parseInt(s.count), 0);

    return NextResponse.json({
      totalSales: parseFloat(summary.totalSales),
      totalVat: parseFloat(summary.totalVat),
      totalSubtotal: parseFloat(summary.totalSubtotal),
      totalCount: parseInt(summary.totalCount),
      manualCount,
      marketplaceCount,
      bySource: salesBySource.map(s => ({
        source: s.source,
        count: parseInt(s.count),
        total: parseFloat(s.total)
      })),
      vatRecords: vatRecords.map(v => ({
        type: v.type,
        totalVat: parseFloat(v.totalVat),
        count: parseInt(v.count)
      })),
      period: {
        start: startOfMonth.toISOString(),
        end: endOfMonth.toISOString()
      }
    });

  } catch (error: any) {
    console.error('GET /api/sales/vat-summary error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch VAT summary', details: error.message },
      { status: 500 }
    );
  }
}
