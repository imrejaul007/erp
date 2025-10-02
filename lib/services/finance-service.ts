import { prisma } from '@/lib/prisma';

export async function getFinancialSummary(data: any, session: any) {
  const { startDate, endDate } = data;

  const dateFilter = {
    gte: startDate ? new Date(startDate) : new Date(new Date().setDate(1)),
    lte: endDate ? new Date(endDate) : new Date(),
  };

  // Get revenue from orders
  const orders = await prisma.order.findMany({
    where: {
      createdAt: dateFilter,
      paymentStatus: 'PAID',
    },
  });

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.grandTotal), 0);
  const totalVAT = orders.reduce((sum, order) => sum + Number(order.vatAmount), 0);

  // Get payments
  const payments = await prisma.payment.findMany({
    where: {
      createdAt: dateFilter,
      status: 'PAID',
    },
  });

  return {
    data: {
      totalRevenue,
      totalVAT,
      totalOrders: orders.length,
      totalPayments: payments.length,
      netRevenue: totalRevenue - totalVAT,
    },
  };
}

export async function processPayment(data: any, session: any) {
  const { orderId, amount, method, reference, notes } = data;

  const payment = await prisma.payment.create({
    data: {
      orderId,
      amount,
      method,
      reference,
      notes,
      status: 'PAID',
      processedById: session.user.id,
    },
    include: {
      order: true,
    },
  });

  // Update order payment status
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (order) {
    const totalPaid = order.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const paymentStatus =
      totalPaid >= Number(order.grandTotal)
        ? 'PAID'
        : totalPaid > 0
        ? 'PARTIAL'
        : 'PENDING';

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });
  }

  return { success: true, data: payment };
}

export async function getVATReport(data: any, session: any) {
  const { startDate, endDate } = data;

  const dateFilter = {
    gte: startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    lte: endDate ? new Date(endDate) : new Date(),
  };

  const orders = await prisma.order.findMany({
    where: { createdAt: dateFilter },
  });

  const totalSales = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const totalVAT = orders.reduce((sum, order) => sum + Number(order.vatAmount), 0);

  return {
    data: {
      period: { startDate, endDate },
      totalSales,
      totalVAT,
      vatRate: 0.05,
      transactions: orders.length,
    },
  };
}
