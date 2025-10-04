import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

/**
 * GET /api/reports/cash-flow - Generate Cash Flow Statement
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

    // OPERATING ACTIVITIES

    // Cash received from customers (invoice payments)
    const customerPayments = await prisma.invoicePayment.findMany({
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

    const cashFromCustomers = customerPayments.reduce((sum, payment) => sum + payment.amount.toNumber(), 0);

    // Cash from order payments
    const orderPayments = await prisma.payment.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        amount: true,
      },
    });

    const cashFromOrders = orderPayments.reduce((sum, payment) => sum + payment.amount.toNumber(), 0);

    const totalCashReceived = cashFromCustomers + cashFromOrders;

    // Cash paid to suppliers (vendor payments)
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

    const cashToSuppliers = vendorPayments.reduce((sum, payment) => sum + payment.amount.toNumber(), 0);

    // Cash paid for expenses
    const expensePayments = await prisma.expense.findMany({
      where: {
        tenantId,
        expenseDate: {
          gte: start,
          lte: end,
        },
        status: 'REIMBURSED',
      },
      select: {
        amount: true,
      },
    });

    const cashForExpenses = expensePayments.reduce((sum, exp) => sum + exp.amount.toNumber(), 0);

    const totalCashPaid = cashToSuppliers + cashForExpenses;

    const netCashFromOperating = totalCashReceived - totalCashPaid;

    // INVESTING ACTIVITIES

    // Placeholder for future implementation
    // - Equipment purchases
    // - Asset sales
    const cashFromInvesting = 0;

    // FINANCING ACTIVITIES

    // Placeholder for future implementation
    // - Loans received
    // - Loan repayments
    // - Equity investments
    const cashFromFinancing = 0;

    // NET CASH FLOW
    const netCashFlow = netCashFromOperating + cashFromInvesting + cashFromFinancing;

    // Calculate opening and closing cash balance
    // Opening balance - cash before the period
    const openingPayments = await prisma.invoicePayment.findMany({
      where: {
        tenantId,
        paymentDate: { lt: start },
      },
      select: {
        amount: true,
      },
    });

    const openingOrderPayments = await prisma.payment.findMany({
      where: {
        tenantId,
        createdAt: { lt: start },
      },
      select: {
        amount: true,
      },
    });

    const openingVendorPayments = await prisma.vendorPayment.findMany({
      where: {
        tenantId,
        paymentDate: { lt: start },
      },
      select: {
        amount: true,
      },
    });

    const openingExpenses = await prisma.expense.findMany({
      where: {
        tenantId,
        expenseDate: { lt: start },
        status: 'REIMBURSED',
      },
      select: {
        amount: true,
      },
    });

    const openingCashIn = openingPayments.reduce((sum, p) => sum + p.amount.toNumber(), 0) +
                          openingOrderPayments.reduce((sum, p) => sum + p.amount.toNumber(), 0);

    const openingCashOut = openingVendorPayments.reduce((sum, p) => sum + p.amount.toNumber(), 0) +
                           openingExpenses.reduce((sum, e) => sum + e.amount.toNumber(), 0);

    const openingCashBalance = openingCashIn - openingCashOut;
    const closingCashBalance = openingCashBalance + netCashFlow;

    const report = {
      period: {
        startDate,
        endDate,
      },
      operatingActivities: {
        cashReceived: {
          fromCustomers: cashFromCustomers,
          fromOrders: cashFromOrders,
          total: totalCashReceived,
        },
        cashPaid: {
          toSuppliers: cashToSuppliers,
          forExpenses: cashForExpenses,
          total: totalCashPaid,
        },
        netCashFromOperating,
      },
      investingActivities: {
        equipmentPurchases: 0, // Placeholder
        assetSales: 0, // Placeholder
        netCashFromInvesting: cashFromInvesting,
      },
      financingActivities: {
        loansReceived: 0, // Placeholder
        loanRepayments: 0, // Placeholder
        equityInvestments: 0, // Placeholder
        netCashFromFinancing: cashFromFinancing,
      },
      summary: {
        netCashFlow,
        openingCashBalance,
        closingCashBalance,
        cashFlowRatio: totalCashReceived > 0 ? (netCashFlow / totalCashReceived) * 100 : 0,
      },
    };

    return apiResponse(report);
  } catch (error: any) {
    console.error('Error generating cash flow report:', error);
    return apiError(error.message || 'Failed to generate cash flow report', 500);
  }
});
