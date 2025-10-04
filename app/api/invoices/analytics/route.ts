import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const AnalyticsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  customerId: z.string().optional(),
  period: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
});

/**
 * GET /api/invoices/analytics
 * Get comprehensive invoice analytics and metrics
 */
export const GET = withTenant(async (
  req: NextRequest,
  { tenantId }: { tenantId: string }
) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = AnalyticsQuerySchema.parse({
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      customerId: searchParams.get('customerId'),
      period: searchParams.get('period') || 'month',
    });

    // Default date range: last 12 months
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    const startDate = query.startDate
      ? new Date(query.startDate)
      : new Date(endDate.getFullYear(), endDate.getMonth() - 12, 1);

    const whereClause: any = {
      tenantId,
      issueDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (query.customerId) {
      whereClause.customerId = query.customerId;
    }

    // Get all invoices in date range
    const invoices = await prisma.customerInvoice.findMany({
      where: whereClause,
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        issueDate: true,
        dueDate: true,
        paidAt: true,
        totalAmount: true,
        paidAmount: true,
        balanceDue: true,
        currency: true,
        customerId: true,
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Summary metrics
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + Number(inv.paidAmount), 0);
    const totalOutstanding = invoices.reduce((sum, inv) => sum + Number(inv.balanceDue), 0);

    // Status breakdown
    const statusCounts = invoices.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Overdue invoices
    const now = new Date();
    const overdueInvoices = invoices.filter(inv =>
      inv.status !== 'PAID' &&
      inv.status !== 'CANCELLED' &&
      new Date(inv.dueDate) < now
    );

    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + Number(inv.balanceDue), 0);

    // Payment performance
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID' && inv.paidAt);
    const avgDaysToPayment = paidInvoices.length > 0
      ? paidInvoices.reduce((sum, inv) => {
          const daysToPay = Math.floor(
            (new Date(inv.paidAt!).getTime() - new Date(inv.issueDate).getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + daysToPay;
        }, 0) / paidInvoices.length
      : 0;

    // Average invoice value
    const avgInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    // Time series data (by period)
    const timeSeries = generateTimeSeries(invoices, startDate, endDate, query.period);

    // Top customers
    const customerStats = invoices.reduce((acc, inv) => {
      if (!acc[inv.customerId]) {
        acc[inv.customerId] = {
          customerId: inv.customerId,
          customerName: inv.customer.name,
          invoiceCount: 0,
          totalRevenue: 0,
          totalPaid: 0,
          totalOutstanding: 0,
        };
      }
      acc[inv.customerId].invoiceCount++;
      acc[inv.customerId].totalRevenue += Number(inv.totalAmount);
      acc[inv.customerId].totalPaid += Number(inv.paidAmount);
      acc[inv.customerId].totalOutstanding += Number(inv.balanceDue);
      return acc;
    }, {} as Record<string, any>);

    const topCustomers = Object.values(customerStats)
      .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    // Aging report (AR aging)
    const agingBuckets = {
      current: 0, // Not yet due
      days1_30: 0, // 1-30 days overdue
      days31_60: 0, // 31-60 days overdue
      days61_90: 0, // 61-90 days overdue
      days90Plus: 0, // 90+ days overdue
    };

    invoices.forEach(inv => {
      if (inv.status === 'PAID' || inv.status === 'CANCELLED') return;

      const balanceDue = Number(inv.balanceDue);
      const daysOverdue = Math.floor(
        (now.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysOverdue < 0) {
        agingBuckets.current += balanceDue;
      } else if (daysOverdue <= 30) {
        agingBuckets.days1_30 += balanceDue;
      } else if (daysOverdue <= 60) {
        agingBuckets.days31_60 += balanceDue;
      } else if (daysOverdue <= 90) {
        agingBuckets.days61_90 += balanceDue;
      } else {
        agingBuckets.days90Plus += balanceDue;
      }
    });

    // Collection effectiveness index (CEI)
    const cei = totalRevenue > 0
      ? (totalPaid / (totalRevenue - totalOutstanding + totalPaid)) * 100
      : 0;

    return apiResponse({
      summary: {
        totalInvoices,
        totalRevenue,
        totalPaid,
        totalOutstanding,
        totalOverdue,
        overdueCount: overdueInvoices.length,
        avgInvoiceValue,
        avgDaysToPayment: Math.round(avgDaysToPayment),
        collectionEffectiveness: Math.round(cei * 100) / 100,
      },
      statusBreakdown: statusCounts,
      timeSeries,
      topCustomers,
      agingReport: agingBuckets,
      period: {
        startDate,
        endDate,
        granularity: query.period,
      },
    });
  } catch (error: any) {
    console.error('Error fetching invoice analytics:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to fetch invoice analytics', 500);
  }
});

function generateTimeSeries(
  invoices: any[],
  startDate: Date,
  endDate: Date,
  period: string
): any[] {
  const series: any[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const periodStart = new Date(current);
    let periodEnd: Date;

    switch (period) {
      case 'day':
        periodEnd = new Date(current);
        periodEnd.setDate(periodEnd.getDate() + 1);
        break;
      case 'week':
        periodEnd = new Date(current);
        periodEnd.setDate(periodEnd.getDate() + 7);
        break;
      case 'month':
        periodEnd = new Date(current);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        break;
      case 'quarter':
        periodEnd = new Date(current);
        periodEnd.setMonth(periodEnd.getMonth() + 3);
        break;
      case 'year':
        periodEnd = new Date(current);
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        break;
      default:
        periodEnd = new Date(current);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    const periodInvoices = invoices.filter(inv => {
      const issueDate = new Date(inv.issueDate);
      return issueDate >= periodStart && issueDate < periodEnd;
    });

    series.push({
      period: periodStart.toISOString(),
      invoiceCount: periodInvoices.length,
      totalAmount: periodInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0),
      paidAmount: periodInvoices.reduce((sum, inv) => sum + Number(inv.paidAmount), 0),
      outstandingAmount: periodInvoices.reduce((sum, inv) => sum + Number(inv.balanceDue), 0),
    });

    current.setTime(periodEnd.getTime());
  }

  return series;
}
