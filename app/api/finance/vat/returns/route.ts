import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// VAT Returns schema for validation
const vatReturnSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/),
  standardRatedSupplies: z.number().min(0),
  zeroRatedSupplies: z.number().min(0),
  exemptSupplies: z.number().min(0),
  standardRatedPurchases: z.number().min(0),
  reverseChargeVAT: z.number().min(0),
});

// Get VAT returns
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const whereClause: any = {};
    if (period) {
      whereClause.period = period;
    }

    // Get VAT returns with pagination
    const [vatReturns, total] = await Promise.all([
      prisma.vATRecord.findMany({
        where: {
          ...whereClause,
          description: 'VAT Return',
        },
        skip: offset,
        take: limit,
        orderBy: {
          recordDate: 'desc',
        },
      }),
      prisma.vATRecord.count({
        where: {
          ...whereClause,
          description: 'VAT Return',
        },
      }),
    ]);

    // Calculate VAT return details for each period
    const vatReturnDetails = await Promise.all(
      vatReturns.map(async (vatReturn) => {
        const periodTransactions = await getVATTransactionsForPeriod(vatReturn.period);
        return {
          id: vatReturn.id,
          period: vatReturn.period,
          ...periodTransactions,
          status: vatReturn.status,
          filedDate: vatReturn.recordDate,
          createdAt: vatReturn.createdAt,
        };
      })
    );

    return apiResponse({
      success: true,
      data: vatReturnDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('VAT Returns GET error:', error);
    return apiError('Failed to fetch VAT returns', 500);
  }
});

// Create/Submit VAT return
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const body = await request.json();
    const validatedData = vatReturnSchema.parse(body);

    // Check if VAT return already exists for this period
    const existingReturn = await prisma.vATRecord.findFirst({
      where: {
        period: validatedData.period,
        description: 'VAT Return',
      },
    });

    if (existingReturn) {
      return apiError('VAT return already exists for this period', 400);
    }

    // Calculate VAT amounts
    const outputVAT = validatedData.standardRatedSupplies * 0.05; // 5% UAE VAT
    const inputVAT = validatedData.standardRatedPurchases * 0.05;
    const netVATDue = outputVAT - inputVAT + validatedData.reverseChargeVAT;

    // Generate VAT return number
    const vatReturnNo = await generateVATReturnNumber(validatedData.period);

    // Create VAT return record
    const vatReturn = await prisma.vATRecord.create({
      data: {
        recordNo: vatReturnNo,
        type: 'OUTPUT',
        amount: validatedData.standardRatedSupplies + validatedData.zeroRatedSupplies + validatedData.exemptSupplies,
        vatAmount: netVATDue,
        vatRate: 5,
        currency: 'AED',
        description: 'VAT Return',
        referenceType: 'VAT_RETURN',
        referenceId: vatReturnNo,
        period: validatedData.period,
        status: 'ACTIVE',
      },
    });

    // Create detailed VAT return breakdown
    await createVATReturnBreakdown(vatReturnNo, validatedData, outputVAT, inputVAT);

    // Update VAT filing status for all transactions in the period
    await prisma.vATRecord.updateMany({
      where: {
        period: validatedData.period,
        status: 'ACTIVE',
      },
      data: {
        status: 'ACTIVE', // Keep as active but mark as filed in a separate field if needed
      },
    });

    return apiResponse({
      success: true,
      data: {
        id: vatReturn.id,
        vatReturnNo,
        period: validatedData.period,
        netVATDue,
        outputVAT,
        inputVAT,
        reverseChargeVAT: validatedData.reverseChargeVAT,
        filedDate: vatReturn.recordDate,
      },
      message: 'VAT return created successfully',
    });
  } catch (error) {
    console.error('VAT Return POST error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to create VAT return', 500);
  }
});

// Helper functions
async function getVATTransactionsForPeriod(period: string) {
  const vatRecords = await prisma.vATRecord.findMany({
    where: {
      period,
      status: 'ACTIVE',
      description: { not: 'VAT Return' },
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
        if (record.description.includes('exempt')) {
          exemptSupplies += Number(record.amount);
        } else {
          zeroRatedSupplies += Number(record.amount);
        }
      }
    } else if (record.type === 'INPUT') {
      inputVAT += Number(record.vatAmount);
      if (record.description.includes('reverse charge')) {
        reverseChargeVAT += Number(record.vatAmount);
      }
    }
  });

  const netVATDue = outputVAT - inputVAT + reverseChargeVAT;

  return {
    standardRatedSupplies,
    zeroRatedSupplies,
    exemptSupplies,
    outputVAT,
    inputVAT,
    reverseChargeVAT,
    netVATDue,
    totalSupplies: standardRatedSupplies + zeroRatedSupplies + exemptSupplies,
  };
}

async function generateVATReturnNumber(period: string): Promise<string> {
  const count = await prisma.vATRecord.count({
    where: {
      description: 'VAT Return',
    },
  });

  return `VAT-${period}-${String(count + 1).padStart(4, '0')}`;
}

async function createVATReturnBreakdown(
  vatReturnNo: string,
  data: z.infer<typeof vatReturnSchema>,
  outputVAT: number,
  inputVAT: number
) {
  const breakdown = [
    {
      recordNo: `${vatReturnNo}-SALES`,
      type: 'OUTPUT' as const,
      amount: data.standardRatedSupplies,
      vatAmount: outputVAT,
      vatRate: 5,
      currency: 'AED',
      description: 'Standard Rated Sales',
      referenceType: 'VAT_RETURN_BREAKDOWN',
      referenceId: vatReturnNo,
      period: data.period,
      status: 'ACTIVE' as const,
    },
    {
      recordNo: `${vatReturnNo}-ZERO`,
      type: 'OUTPUT' as const,
      amount: data.zeroRatedSupplies,
      vatAmount: 0,
      vatRate: 0,
      currency: 'AED',
      description: 'Zero Rated Sales',
      referenceType: 'VAT_RETURN_BREAKDOWN',
      referenceId: vatReturnNo,
      period: data.period,
      status: 'ACTIVE' as const,
    },
    {
      recordNo: `${vatReturnNo}-EXEMPT`,
      type: 'OUTPUT' as const,
      amount: data.exemptSupplies,
      vatAmount: 0,
      vatRate: 0,
      currency: 'AED',
      description: 'Exempt Sales',
      referenceType: 'VAT_RETURN_BREAKDOWN',
      referenceId: vatReturnNo,
      period: data.period,
      status: 'ACTIVE' as const,
    },
    {
      recordNo: `${vatReturnNo}-PURCHASES`,
      type: 'INPUT' as const,
      amount: data.standardRatedPurchases,
      vatAmount: inputVAT,
      vatRate: 5,
      currency: 'AED',
      description: 'Standard Rated Purchases',
      referenceType: 'VAT_RETURN_BREAKDOWN',
      referenceId: vatReturnNo,
      period: data.period,
      status: 'ACTIVE' as const,
    },
    {
      recordNo: `${vatReturnNo}-REVERSE`,
      type: 'INPUT' as const,
      amount: 0,
      vatAmount: data.reverseChargeVAT,
      vatRate: 5,
      currency: 'AED',
      description: 'Reverse Charge VAT',
      referenceType: 'VAT_RETURN_BREAKDOWN',
      referenceId: vatReturnNo,
      period: data.period,
      status: 'ACTIVE' as const,
    },
  ];

  await prisma.vATRecord.createMany({
    data: breakdown,
  });
}