import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

/**
 * GET /api/reports/balance-sheet - Generate Balance Sheet
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const asOfDate = searchParams.get('asOfDate') || new Date().toISOString();

    const date = new Date(asOfDate);

    // ASSETS

    // Current Assets - Inventory
    const products = await prisma.product.findMany({
      where: { tenantId },
      select: {
        stockQuantity: true,
        costPrice: true,
      },
    });

    const inventoryValue = products.reduce((sum, product) => {
      const cost = product.costPrice?.toNumber() || 0;
      return sum + (product.stockQuantity * cost);
    }, 0);

    // Current Assets - Accounts Receivable (AR)
    const accountsReceivable = await prisma.customerInvoice.findMany({
      where: {
        tenantId,
        createdAt: { lte: date },
        status: { in: ['SENT', 'VIEWED', 'PARTIALLY_PAID', 'OVERDUE'] },
      },
      select: {
        balanceDue: true,
      },
    });

    const totalAR = accountsReceivable.reduce((sum, inv) => sum + inv.balanceDue.toNumber(), 0);

    // Cash - from payments received
    const paymentsReceived = await prisma.invoicePayment.findMany({
      where: {
        tenantId,
        paymentDate: { lte: date },
      },
      select: {
        amount: true,
      },
    });

    const cashFromInvoices = paymentsReceived.reduce((sum, payment) => sum + payment.amount.toNumber(), 0);

    // Order payments
    const orderPayments = await prisma.payment.findMany({
      where: {
        tenantId,
        createdAt: { lte: date },
      },
      select: {
        amount: true,
      },
    });

    const cashFromOrders = orderPayments.reduce((sum, payment) => sum + payment.amount.toNumber(), 0);

    const totalCash = cashFromInvoices + cashFromOrders;

    // Total Current Assets
    const totalCurrentAssets = totalCash + totalAR + inventoryValue;

    // LIABILITIES

    // Current Liabilities - Accounts Payable (AP)
    const accountsPayable = await prisma.vendorInvoice.findMany({
      where: {
        tenantId,
        invoiceDate: { lte: date },
        status: { in: ['PENDING', 'APPROVED', 'OVERDUE'] },
      },
      select: {
        balanceDue: true,
      },
    });

    const totalAP = accountsPayable.reduce((sum, inv) => sum + inv.balanceDue.toNumber(), 0);

    // Expenses payable
    const expensesPayable = await prisma.expense.findMany({
      where: {
        tenantId,
        expenseDate: { lte: date },
        status: 'APPROVED', // Approved but not reimbursed
      },
      select: {
        amount: true,
      },
    });

    const totalExpensesPayable = expensesPayable.reduce((sum, exp) => sum + exp.amount.toNumber(), 0);

    // Total Current Liabilities
    const totalCurrentLiabilities = totalAP + totalExpensesPayable;

    // EQUITY

    // Calculate total revenue and expenses to determine retained earnings
    const allOrders = await prisma.order.findMany({
      where: {
        tenantId,
        createdAt: { lte: date },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      select: {
        grandTotal: true,
      },
    });

    const totalRevenue = allOrders.reduce((sum, order) => sum + order.grandTotal.toNumber(), 0);

    const allExpenses = await prisma.expense.findMany({
      where: {
        tenantId,
        expenseDate: { lte: date },
        status: { in: ['APPROVED', 'REIMBURSED'] },
      },
      select: {
        amount: true,
      },
    });

    const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount.toNumber(), 0);

    const allPurchases = await prisma.purchaseOrder.findMany({
      where: {
        tenantId,
        orderDate: { lte: date },
        status: { in: ['COMPLETED', 'RECEIVED'] },
      },
      select: {
        totalAmount: true,
      },
    });

    const totalPurchases = allPurchases.reduce((sum, po) => sum + po.totalAmount.toNumber(), 0);

    const retainedEarnings = totalRevenue - totalExpenses - totalPurchases;

    // Assuming initial capital (can be configured)
    const ownerEquity = 0; // This should be from a config or initial setup

    const totalEquity = ownerEquity + retainedEarnings;

    // BALANCE CHECK
    const totalAssets = totalCurrentAssets;
    const totalLiabilities = totalCurrentLiabilities;
    const balance = totalAssets - (totalLiabilities + totalEquity);

    const report = {
      asOfDate,
      assets: {
        currentAssets: {
          cash: totalCash,
          accountsReceivable: totalAR,
          inventory: inventoryValue,
          total: totalCurrentAssets,
        },
        fixedAssets: {
          // Placeholder for future implementation
          propertyPlantEquipment: 0,
          accumulatedDepreciation: 0,
          total: 0,
        },
        totalAssets,
      },
      liabilities: {
        currentLiabilities: {
          accountsPayable: totalAP,
          expensesPayable: totalExpensesPayable,
          total: totalCurrentLiabilities,
        },
        longTermLiabilities: {
          // Placeholder for future implementation
          total: 0,
        },
        totalLiabilities,
      },
      equity: {
        ownerEquity,
        retainedEarnings,
        totalEquity,
      },
      balanceCheck: {
        totalAssets,
        totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
        difference: balance,
        balanced: Math.abs(balance) < 0.01, // Allow for rounding errors
      },
    };

    return apiResponse(report);
  } catch (error: any) {
    console.error('Error generating balance sheet:', error);
    return apiError(error.message || 'Failed to generate balance sheet', 500);
  }
});
