import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// VAT Dashboard API endpoint for UAE compliance
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || getCurrentPeriod();

    // Get VAT summary for the period
    const vatSummary = await getVATSummaryForPeriod(period);

    // Get current VAT liability
    const vatLiability = await getCurrentVATLiability();

    // Get VAT compliance status
    const complianceStatus = await getVATComplianceStatus(period);

    // Get recent VAT transactions
    const recentTransactions = await getRecentVATTransactions(10);

    const dashboardData = {
      period,
      summary: {
        standardRatedSupplies: vatSummary.standardRatedSupplies,
        zeroRatedSupplies: vatSummary.zeroRatedSupplies,
        exemptSupplies: vatSummary.exemptSupplies,
        outputVAT: vatSummary.outputVAT,
        inputVAT: vatSummary.inputVAT,
        reverseChargeVAT: vatSummary.reverseChargeVAT,
        netVATDue: vatSummary.outputVAT - vatSummary.inputVAT + vatSummary.reverseChargeVAT,
        vatRate: 5.0, // UAE standard rate
      },
      liability: vatLiability,
      compliance: complianceStatus,
      recentTransactions,
      filingDueDate: getFilingDueDate(period),
      nextFilingPeriod: getNextFilingPeriod(period),
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('VAT Dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch VAT dashboard data' },
      { status: 500 }
    );
  }
}

// Helper functions
function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getFilingDueDate(period: string): Date {
  const [year, month] = period.split('-').map(Number);
  // UAE VAT return is due by the 28th of the following month
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return new Date(nextYear, nextMonth - 1, 28);
}

function getNextFilingPeriod(period: string): string {
  const [year, month] = period.split('-').map(Number);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
}

async function getVATSummaryForPeriod(period: string) {
  // Get VAT records for the period
  const vatRecords = await prisma.vATRecord.findMany({
    where: {
      period,
      status: 'ACTIVE',
    },
  });

  let standardRatedSupplies = 0;
  let zeroRatedSupplies = 0;
  let exemptSupplies = 0;
  let outputVAT = 0;
  let inputVAT = 0;
  let reverseChargeVAT = 0;

  vatRecords.forEach(record => {
    if (record.type === 'OUTPUT') {
      if (record.vatRate === 5) {
        standardRatedSupplies += Number(record.amount);
        outputVAT += Number(record.vatAmount);
      } else if (record.vatRate === 0) {
        zeroRatedSupplies += Number(record.amount);
      }
    } else if (record.type === 'INPUT') {
      inputVAT += Number(record.vatAmount);
      if (record.description.includes('reverse charge')) {
        reverseChargeVAT += Number(record.vatAmount);
      }
    }
  });

  return {
    standardRatedSupplies,
    zeroRatedSupplies,
    exemptSupplies,
    outputVAT,
    inputVAT,
    reverseChargeVAT,
  };
}

async function getCurrentVATLiability() {
  // Calculate total VAT liability
  const vatRecords = await prisma.vATRecord.findMany({
    where: {
      status: 'ACTIVE',
    },
  });

  let totalLiability = 0;
  vatRecords.forEach(record => {
    if (record.type === 'OUTPUT') {
      totalLiability += Number(record.vatAmount);
    } else {
      totalLiability -= Number(record.vatAmount);
    }
  });

  return {
    totalLiability,
    lastUpdated: new Date(),
  };
}

async function getVATComplianceStatus(period: string) {
  // Check if VAT return has been filed for the period
  const vatReturn = await prisma.vATRecord.findFirst({
    where: {
      period,
      description: 'VAT Return Filed',
    },
  });

  const filingDueDate = getFilingDueDate(period);
  const isOverdue = new Date() > filingDueDate && !vatReturn;

  return {
    isFiled: !!vatReturn,
    filingDate: vatReturn?.recordDate,
    isOverdue,
    daysUntilDue: Math.ceil((filingDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    status: vatReturn ? 'FILED' : (isOverdue ? 'OVERDUE' : 'PENDING'),
  };
}

async function getRecentVATTransactions(limit: number) {
  return await prisma.vATRecord.findMany({
    take: limit,
    orderBy: {
      recordDate: 'desc',
    },
    select: {
      id: true,
      recordNo: true,
      type: true,
      amount: true,
      vatAmount: true,
      vatRate: true,
      description: true,
      recordDate: true,
      status: true,
    },
  });
}