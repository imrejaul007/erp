import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// VAT Report parameters schema
const vatReportSchema = z.object({
  type: z.enum(['summary', 'detailed', 'fta_format']),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  format: z.enum(['json', 'csv', 'xml']).optional().default('json'),
});

// Generate VAT reports for FTA compliance
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { searchParams } = new URL(request.url);
    const params = {
      type: searchParams.get('type') || 'summary',
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      format: searchParams.get('format') || 'json',
    };

    // Validate parameters
    if (!params.startDate || !params.endDate) {
      return apiError('Start date and end date are required', 400);
    }

    const validatedParams = vatReportSchema.parse(params);

    let reportData: any;

    switch (validatedParams.type) {
      case 'summary':
        reportData = await generateVATSummaryReport(validatedParams.startDate, validatedParams.endDate);
        break;
      case 'detailed':
        reportData = await generateVATDetailedReport(validatedParams.startDate, validatedParams.endDate);
        break;
      case 'fta_format':
        reportData = await generateFTAFormatReport(validatedParams.startDate, validatedParams.endDate);
        break;
      default:
        return apiError('Invalid report type', 400);
    }

    // Handle different output formats
    if (validatedParams.format === 'csv') {
      return generateCSVResponse(reportData, validatedParams.type);
    } else if (validatedParams.format === 'xml') {
      return generateXMLResponse(reportData, validatedParams.type);
    }

    return apiResponse({
      success: true,
      data: reportData,
      metadata: {
        reportType: validatedParams.type,
        period: {
          startDate: validatedParams.startDate,
          endDate: validatedParams.endDate,
        },
        generatedAt: new Date().toISOString(),
        generatedBy: user.email,
      },
    });
  } catch (error) {
    console.error('VAT Reports error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to generate VAT report', 500);
  }
});

// Generate VAT summary report
async function generateVATSummaryReport(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get all VAT records for the period
  const vatRecords = await prisma.vATRecord.findMany({
    where: {
      recordDate: {
        gte: start,
        lte: end,
      },
      status: 'ACTIVE',
    },
    orderBy: {
      recordDate: 'asc',
    },
  });

  // Calculate totals
  let totalStandardRatedSales = 0;
  let totalZeroRatedSales = 0;
  let totalExemptSales = 0;
  let totalOutputVAT = 0;
  let totalStandardRatedPurchases = 0;
  let totalInputVAT = 0;
  let totalReverseChargeVAT = 0;

  const monthlyBreakdown: Record<string, any> = {};

  vatRecords.forEach(record => {
    const month = record.recordDate.toISOString().substring(0, 7); // YYYY-MM

    if (!monthlyBreakdown[month]) {
      monthlyBreakdown[month] = {
        standardRatedSales: 0,
        zeroRatedSales: 0,
        exemptSales: 0,
        outputVAT: 0,
        standardRatedPurchases: 0,
        inputVAT: 0,
        reverseChargeVAT: 0,
      };
    }

    if (record.type === 'OUTPUT') {
      if (record.vatRate === 5) {
        totalStandardRatedSales += Number(record.amount);
        totalOutputVAT += Number(record.vatAmount);
        monthlyBreakdown[month].standardRatedSales += Number(record.amount);
        monthlyBreakdown[month].outputVAT += Number(record.vatAmount);
      } else if (record.vatRate === 0) {
        if (record.description.includes('exempt')) {
          totalExemptSales += Number(record.amount);
          monthlyBreakdown[month].exemptSales += Number(record.amount);
        } else {
          totalZeroRatedSales += Number(record.amount);
          monthlyBreakdown[month].zeroRatedSales += Number(record.amount);
        }
      }
    } else if (record.type === 'INPUT') {
      totalInputVAT += Number(record.vatAmount);
      monthlyBreakdown[month].inputVAT += Number(record.vatAmount);

      if (record.description.includes('reverse charge')) {
        totalReverseChargeVAT += Number(record.vatAmount);
        monthlyBreakdown[month].reverseChargeVAT += Number(record.vatAmount);
      } else {
        totalStandardRatedPurchases += Number(record.amount);
        monthlyBreakdown[month].standardRatedPurchases += Number(record.amount);
      }
    }
  });

  const netVATDue = totalOutputVAT - totalInputVAT + totalReverseChargeVAT;

  return {
    summary: {
      period: {
        startDate,
        endDate,
      },
      totals: {
        standardRatedSales: totalStandardRatedSales,
        zeroRatedSales: totalZeroRatedSales,
        exemptSales: totalExemptSales,
        totalSales: totalStandardRatedSales + totalZeroRatedSales + totalExemptSales,
        outputVAT: totalOutputVAT,
        standardRatedPurchases: totalStandardRatedPurchases,
        inputVAT: totalInputVAT,
        reverseChargeVAT: totalReverseChargeVAT,
        netVATDue,
      },
      monthlyBreakdown,
      currency: 'AED',
      vatRate: 5.0,
    },
  };
}

// Generate detailed VAT report
async function generateVATDetailedReport(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const vatRecords = await prisma.vATRecord.findMany({
    where: {
      recordDate: {
        gte: start,
        lte: end,
      },
      status: 'ACTIVE',
    },
    orderBy: [
      { recordDate: 'asc' },
      { recordNo: 'asc' },
    ],
  });

  // Group by transaction type and category
  const salesTransactions = vatRecords.filter(r => r.type === 'OUTPUT');
  const purchaseTransactions = vatRecords.filter(r => r.type === 'INPUT');

  return {
    period: {
      startDate,
      endDate,
    },
    salesTransactions: salesTransactions.map(record => ({
      recordNo: record.recordNo,
      date: record.recordDate,
      description: record.description,
      amount: Number(record.amount),
      vatRate: Number(record.vatRate),
      vatAmount: Number(record.vatAmount),
      currency: record.currency,
      referenceType: record.referenceType,
      referenceId: record.referenceId,
    })),
    purchaseTransactions: purchaseTransactions.map(record => ({
      recordNo: record.recordNo,
      date: record.recordDate,
      description: record.description,
      amount: Number(record.amount),
      vatRate: Number(record.vatRate),
      vatAmount: Number(record.vatAmount),
      currency: record.currency,
      referenceType: record.referenceType,
      referenceId: record.referenceId,
    })),
    summary: {
      totalSalesTransactions: salesTransactions.length,
      totalPurchaseTransactions: purchaseTransactions.length,
      totalSalesAmount: salesTransactions.reduce((sum, r) => sum + Number(r.amount), 0),
      totalPurchaseAmount: purchaseTransactions.reduce((sum, r) => sum + Number(r.amount), 0),
      totalOutputVAT: salesTransactions.reduce((sum, r) => sum + Number(r.vatAmount), 0),
      totalInputVAT: purchaseTransactions.reduce((sum, r) => sum + Number(r.vatAmount), 0),
    },
  };
}

// Generate FTA format report for compliance
async function generateFTAFormatReport(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const vatRecords = await prisma.vATRecord.findMany({
    where: {
      recordDate: {
        gte: start,
        lte: end,
      },
      status: 'ACTIVE',
    },
    orderBy: {
      recordDate: 'asc',
    },
  });

  // FTA XML format structure
  const ftaReport = {
    VATReturn: {
      '@attributes': {
        xmlns: 'http://www.tax.gov.ae/VATReturn',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        version: '1.0',
      },
      Header: {
        TaxAgentTRN: '', // Tax Agent TRN if applicable
        TaxpayerTRN: process.env.COMPANY_TRN || '',
        PeriodStart: startDate,
        PeriodEnd: endDate,
        Currency: 'AED',
      },
      Body: {
        StandardRatedSupplies: {
          Amount: 0,
          VATAmount: 0,
        },
        ZeroRatedSupplies: {
          Amount: 0,
        },
        ExemptSupplies: {
          Amount: 0,
        },
        TotalValueofSupplies: 0,
        StandardRatedPurchases: {
          Amount: 0,
          VATAmount: 0,
        },
        ImportSubjecttoVAT: {
          Amount: 0,
          VATAmount: 0,
        },
        ReverseChargeVAT: {
          VATAmount: 0,
        },
        TotalInputVAT: 0,
        NetVATDue: 0,
      },
    },
  };

  // Calculate values from VAT records
  vatRecords.forEach(record => {
    if (record.type === 'OUTPUT') {
      if (record.vatRate === 5) {
        ftaReport.VATReturn.Body.StandardRatedSupplies.Amount += Number(record.amount);
        ftaReport.VATReturn.Body.StandardRatedSupplies.VATAmount += Number(record.vatAmount);
      } else if (record.vatRate === 0) {
        if (record.description.includes('exempt')) {
          ftaReport.VATReturn.Body.ExemptSupplies.Amount += Number(record.amount);
        } else {
          ftaReport.VATReturn.Body.ZeroRatedSupplies.Amount += Number(record.amount);
        }
      }
    } else if (record.type === 'INPUT') {
      if (record.description.includes('reverse charge')) {
        ftaReport.VATReturn.Body.ReverseChargeVAT.VATAmount += Number(record.vatAmount);
      } else if (record.description.includes('import')) {
        ftaReport.VATReturn.Body.ImportSubjecttoVAT.Amount += Number(record.amount);
        ftaReport.VATReturn.Body.ImportSubjecttoVAT.VATAmount += Number(record.vatAmount);
      } else {
        ftaReport.VATReturn.Body.StandardRatedPurchases.Amount += Number(record.amount);
        ftaReport.VATReturn.Body.StandardRatedPurchases.VATAmount += Number(record.vatAmount);
      }
    }
  });

  // Calculate totals
  ftaReport.VATReturn.Body.TotalValueofSupplies =
    ftaReport.VATReturn.Body.StandardRatedSupplies.Amount +
    ftaReport.VATReturn.Body.ZeroRatedSupplies.Amount +
    ftaReport.VATReturn.Body.ExemptSupplies.Amount;

  ftaReport.VATReturn.Body.TotalInputVAT =
    ftaReport.VATReturn.Body.StandardRatedPurchases.VATAmount +
    ftaReport.VATReturn.Body.ImportSubjecttoVAT.VATAmount +
    ftaReport.VATReturn.Body.ReverseChargeVAT.VATAmount;

  ftaReport.VATReturn.Body.NetVATDue =
    ftaReport.VATReturn.Body.StandardRatedSupplies.VATAmount -
    ftaReport.VATReturn.Body.TotalInputVAT;

  return ftaReport;
}

// Generate CSV response
function generateCSVResponse(data: any, reportType: string) {
  let csvContent = '';

  if (reportType === 'summary') {
    csvContent = 'Period,Standard Rated Sales,Zero Rated Sales,Exempt Sales,Output VAT,Input VAT,Net VAT Due\n';
    const summary = data.summary;
    csvContent += `${summary.period.startDate} to ${summary.period.endDate},${summary.totals.standardRatedSales},${summary.totals.zeroRatedSales},${summary.totals.exemptSales},${summary.totals.outputVAT},${summary.totals.inputVAT},${summary.totals.netVATDue}\n`;
  } else if (reportType === 'detailed') {
    csvContent = 'Record No,Date,Type,Description,Amount,VAT Rate,VAT Amount,Currency\n';
    [...data.salesTransactions, ...data.purchaseTransactions].forEach(tx => {
      csvContent += `${tx.recordNo},${tx.date},${tx.type || 'SALE/PURCHASE'},${tx.description},${tx.amount},${tx.vatRate},${tx.vatAmount},${tx.currency}\n`;
    });
  }

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="vat-report-${reportType}-${Date.now()}.csv"`,
    },
  });
}

// Generate XML response
function generateXMLResponse(data: any, reportType: string) {
  let xmlContent = '';

  if (reportType === 'fta_format') {
    xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += JSON.stringify(data, null, 2); // Simplified - would need proper XML conversion
  }

  return new NextResponse(xmlContent, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename="vat-report-${reportType}-${Date.now()}.xml"`,
    },
  });
}