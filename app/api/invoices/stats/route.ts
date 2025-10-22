import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

// GET /api/invoices/stats - Get invoice analytics and statistics
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const now = new Date();

    // Get all invoices for calculations
    const allInvoices = await prisma.customerInvoice.findMany({
      where: { tenantId },
      include: {
        payments: true,
      },
    });

    // Calculate totals by status
    const totalInvoiced = allInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const totalPaid = allInvoices
      .filter((inv) => inv.status === 'PAID')
      .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

    const totalOutstanding = allInvoices
      .filter((inv) => !['PAID', 'CANCELLED', 'REFUNDED'].includes(inv.status))
      .reduce((sum, inv) => sum + Number(inv.balanceDue), 0);

    const totalOverdue = allInvoices
      .filter((inv) => {
        const dueDate = new Date(inv.dueDate);
        return dueDate < now && !['PAID', 'CANCELLED', 'REFUNDED'].includes(inv.status);
      })
      .reduce((sum, inv) => sum + Number(inv.balanceDue), 0);

    // Count invoices by status
    const statusCounts = allInvoices.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate DSO (Days Sales Outstanding)
    // DSO = (Accounts Receivable / Total Credit Sales) × Number of Days
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentInvoices = allInvoices.filter(
      (inv) => new Date(inv.issueDate) >= last30Days
    );

    const totalSales30Days = recentInvoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmount),
      0
    );

    const avgReceivables = totalOutstanding;
    const dso = totalSales30Days > 0 ? (avgReceivables / totalSales30Days) * 30 : 0;

    // Calculate aging buckets
    const agingBuckets = {
      current: 0, // 0-30 days
      days30: 0, // 31-60 days
      days60: 0, // 61-90 days
      days90Plus: 0, // 90+ days
    };

    allInvoices
      .filter((inv) => !['PAID', 'CANCELLED', 'REFUNDED'].includes(inv.status))
      .forEach((inv) => {
        const daysOld = Math.floor(
          (now.getTime() - new Date(inv.issueDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        const amount = Number(inv.balanceDue);

        if (daysOld <= 30) {
          agingBuckets.current += amount;
        } else if (daysOld <= 60) {
          agingBuckets.days30 += amount;
        } else if (daysOld <= 90) {
          agingBuckets.days60 += amount;
        } else {
          agingBuckets.days90Plus += amount;
        }
      });

    // Calculate average invoice value
    const avgInvoiceValue = allInvoices.length > 0 ? totalInvoiced / allInvoices.length : 0;

    // Calculate payment collection rate
    const collectionRate = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;

    // Calculate average days to payment for paid invoices
    const paidInvoices = allInvoices.filter((inv) => inv.status === 'PAID' && inv.paidDate);
    const avgDaysToPayment =
      paidInvoices.length > 0
        ? paidInvoices.reduce((sum, inv) => {
            const days = Math.floor(
              (new Date(inv.paidDate!).getTime() - new Date(inv.issueDate).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return sum + days;
          }, 0) / paidInvoices.length
        : 0;

    // Get top customers by outstanding amount
    const customerOutstanding = allInvoices
      .filter((inv) => !['PAID', 'CANCELLED', 'REFUNDED'].includes(inv.status))
      .reduce((acc, inv) => {
        const customerId = inv.customerId;
        if (!acc[customerId]) {
          acc[customerId] = {
            customerId,
            totalOutstanding: 0,
            invoiceCount: 0,
          };
        }
        acc[customerId].totalOutstanding += Number(inv.balanceDue);
        acc[customerId].invoiceCount += 1;
        return acc;
      }, {} as Record<string, any>);

    const topCustomers = Object.values(customerOutstanding)
      .sort((a: any, b: any) => b.totalOutstanding - a.totalOutstanding)
      .slice(0, 10);

    // Enrich with customer names
    const topCustomersWithNames = await Promise.all(
      topCustomers.map(async (item: any) => {
        const customer = await prisma.customers.findUnique({
          where: { id: item.customerId },
          select: { id: true, name: true, email: true },
        });
        return {
          ...item,
          customer,
        };
      })
    );

    // Monthly revenue trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthInvoices = allInvoices.filter((inv) => {
        const issueDate = new Date(inv.issueDate);
        return issueDate >= monthStart && issueDate <= monthEnd;
      });

      const monthTotal = monthInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
      const monthPaid = monthInvoices
        .filter((inv) => inv.status === 'PAID')
        .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

      monthlyTrend.push({
        month: monthStart.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        totalInvoiced: monthTotal,
        totalCollected: monthPaid,
        invoiceCount: monthInvoices.length,
      });
    }

    return apiResponse({
      summary: {
        totalInvoiced,
        totalPaid,
        totalOutstanding,
        totalOverdue,
        invoiceCount: allInvoices.length,
        avgInvoiceValue,
        collectionRate,
        dso: Math.round(dso * 10) / 10, // Round to 1 decimal
        avgDaysToPayment: Math.round(avgDaysToPayment * 10) / 10,
      },
      statusBreakdown: statusCounts,
      agingReport: agingBuckets,
      topCustomers: topCustomersWithNames,
      monthlyTrend,
    });
  } catch (error: any) {
    console.error('Error fetching invoice stats:', error);
    return apiError(error.message || 'Failed to fetch invoice statistics', 500);
  }
});
