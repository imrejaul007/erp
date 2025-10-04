import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

/**
 * GET /api/reports/profit-loss - Generate Profit & Loss statement
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return apiError('Start date and end date are required', 400);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Revenue - Sales from orders
    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: start,
          lte: end,
        },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      select: {
        totalAmount: true,
        vatAmount: true,
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount.toNumber(), 0);
    const totalVAT = orders.reduce((sum, order) => sum + order.vatAmount.toNumber(), 0);
    const netRevenue = totalRevenue - totalVAT;

    // Cost of Goods Sold - Purchase orders
    const purchases = await prisma.purchaseOrder.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: start,
          lte: end,
        },
        status: { in: ['COMPLETED', 'RECEIVED'] },
      },
      select: {
        totalAmount: true,
      },
    });

    const costOfGoodsSold = purchases.reduce((sum, po) => sum + po.totalAmount.toNumber(), 0);

    // Operating Expenses
    const expenses = await prisma.expense.findMany({
      where: {
        tenantId,
        expenseDate: {
          gte: start,
          lte: end,
        },
        status: { in: ['APPROVED', 'REIMBURSED'] },
      },
      select: {
        amount: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const expensesByCategory = expenses.reduce((acc, exp) => {
      const category = exp.category.name;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += exp.amount.toNumber();
      return acc;
    }, {} as Record<string, number>);

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount.toNumber(), 0);

    // Vendor Invoice Payments
    const vendorPayments = await prisma.vendorPayment.findMany({
      where: {
        tenantId,
        paymentDate: {
          gte: start,
          lte: end,
        },
      },
      select: {
        amount: true,
      },
    });

    const totalVendorPayments = vendorPayments.reduce((sum, payment) => sum + payment.amount.toNumber(), 0);

    // Calculate P&L metrics
    const grossProfit = netRevenue - costOfGoodsSold;
    const grossProfitMargin = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;

    const operatingIncome = grossProfit - totalExpenses;
    const operatingMargin = netRevenue > 0 ? (operatingIncome / netRevenue) * 100 : 0;

    const netIncome = operatingIncome;
    const netProfitMargin = netRevenue > 0 ? (netIncome / netRevenue) * 100 : 0;

    const report = {
      period: {
        startDate,
        endDate,
      },
      revenue: {
        totalRevenue,
        vat: totalVAT,
        netRevenue,
      },
      costOfGoodsSold: {
        total: costOfGoodsSold,
        percentage: netRevenue > 0 ? (costOfGoodsSold / netRevenue) * 100 : 0,
      },
      grossProfit: {
        amount: grossProfit,
        margin: grossProfitMargin,
      },
      operatingExpenses: {
        byCategory: expensesByCategory,
        total: totalExpenses,
        percentage: netRevenue > 0 ? (totalExpenses / netRevenue) * 100 : 0,
      },
      vendorPayments: {
        total: totalVendorPayments,
      },
      operatingIncome: {
        amount: operatingIncome,
        margin: operatingMargin,
      },
      netIncome: {
        amount: netIncome,
        margin: netProfitMargin,
      },
      summary: {
        totalRevenue: netRevenue,
        totalCosts: costOfGoodsSold + totalExpenses,
        netProfit: netIncome,
        profitMargin: netProfitMargin,
      },
    };

    return apiResponse(report);
  } catch (error: any) {
    console.error('Error generating P&L report:', error);
    return apiError(error.message || 'Failed to generate P&L report', 500);
  }
});
