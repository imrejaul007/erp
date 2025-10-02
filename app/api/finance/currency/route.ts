import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const currencyRateSchema = z.object({
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3),
  rate: z.number().positive(),
  rateDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  source: z.enum(['central_bank', 'manual', 'api']).default('manual'),
});

// Get currency rates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const baseCurrency = searchParams.get('baseCurrency') || 'AED';
    const targetCurrency = searchParams.get('targetCurrency');
    const rateDate = searchParams.get('rateDate') || new Date().toISOString().split('T')[0];

    let whereClause: any = {
      rateDate: {
        lte: new Date(rateDate),
      },
      isActive: true,
    };

    if (baseCurrency && targetCurrency) {
      whereClause.OR = [
        { fromCurrency: baseCurrency, toCurrency: targetCurrency },
        { fromCurrency: targetCurrency, toCurrency: baseCurrency },
      ];
    } else if (baseCurrency) {
      whereClause.OR = [
        { fromCurrency: baseCurrency },
        { toCurrency: baseCurrency },
      ];
    }

    // Note: CurrencyRate model not yet implemented in schema
    // Returning mock data until finance module schema is complete
    const rates: any[] = [];
    // const rates = await prisma.currencyRate.findMany({
    //   where: whereClause,
    //   orderBy: [
    //     { rateDate: 'desc' },
    //     { createdAt: 'desc' },
    //   ],
    //   take: 50,
    // });

    // Get latest rate for each currency pair
    const latestRates = rates.reduce((acc: any, rate) => {
      const pairKey = `${rate.fromCurrency}-${rate.toCurrency}`;
      if (!acc[pairKey] || new Date(rate.rateDate) > new Date(acc[pairKey].rateDate)) {
        acc[pairKey] = rate;
      }
      return acc;
    }, {});

    // Calculate cross rates if needed
    const crossRates = calculateCrossRates(Object.values(latestRates), baseCurrency);

    return NextResponse.json({
      success: true,
      data: {
        baseCurrency,
        rateDate,
        rates: Object.values(latestRates),
        crossRates,
        supportedCurrencies: getSupportedCurrencies(),
      },
    });
  } catch (error) {
    console.error('Currency Rates GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch currency rates' },
      { status: 500 }
    );
  }
}

// Create or update currency rate
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = currencyRateSchema.parse(body);

    // Note: CurrencyRate model not yet implemented in schema
    // Mock response until finance module schema is complete
    const rate = {
      id: 'mock-id',
      fromCurrency: validatedData.fromCurrency,
      toCurrency: validatedData.toCurrency,
      rate: validatedData.rate,
      rateDate: new Date(validatedData.rateDate),
      source: validatedData.source,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // // Check if rate already exists for this date and currency pair
    // const existingRate = await prisma.currencyRate.findFirst({
    //   where: {
    //     fromCurrency: validatedData.fromCurrency,
    //     toCurrency: validatedData.toCurrency,
    //     rateDate: new Date(validatedData.rateDate),
    //   },
    // });

    // let rate;

    // if (existingRate) {
    //   // Update existing rate
    //   rate = await prisma.currencyRate.update({
    //     where: { id: existingRate.id },
    //     data: {
    //       rate: validatedData.rate,
    //       source: validatedData.source,
    //       updatedAt: new Date(),
    //     },
    //   });
    // } else {
    //   // Create new rate
    //   rate = await prisma.currencyRate.create({
    //     data: {
    //       fromCurrency: validatedData.fromCurrency,
    //       toCurrency: validatedData.toCurrency,
    //       rate: validatedData.rate,
    //       rateDate: new Date(validatedData.rateDate),
    //       source: validatedData.source,
    //       isActive: true,
    //     },
    //   });
    // }

    // // Calculate and store reverse rate
    // const reverseRate = 1 / validatedData.rate;
    // const existingReverseRate = await prisma.currencyRate.findFirst({
    //   where: {
    //     fromCurrency: validatedData.toCurrency,
    //     toCurrency: validatedData.fromCurrency,
    //     rateDate: new Date(validatedData.rateDate),
    //   },
    // });

    // if (existingReverseRate) {
    //   await prisma.currencyRate.update({
    //     where: { id: existingReverseRate.id },
    //     data: {
    //       rate: reverseRate,
    //       source: validatedData.source,
    //       updatedAt: new Date(),
    //     },
    //   });
    // } else {
    //   await prisma.currencyRate.create({
    //     data: {
    //       fromCurrency: validatedData.toCurrency,
    //       toCurrency: validatedData.fromCurrency,
    //       rate: reverseRate,
    //       rateDate: new Date(validatedData.rateDate),
    //       source: validatedData.source,
    //       isActive: true,
    //     },
    //   });
    // }

    return NextResponse.json({
      success: true,
      data: rate,
      message: 'Currency rate saved successfully',
    });
  } catch (error) {
    console.error('Currency Rate POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to save currency rate' },
      { status: 500 }
    );
  }
}

// Sync rates from external API
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { source = 'api', baseCurrency = 'AED' } = body;

    // Fetch rates from external source (e.g., Central Bank of UAE, Fixer.io, etc.)
    const externalRates = await fetchExternalRates(baseCurrency, source);

    if (!externalRates.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch external rates', details: externalRates.error },
        { status: 400 }
      );
    }

    let updatedCount = 0;

    // Save rates to database
    // Note: CurrencyRate model not yet implemented - mock response
    updatedCount = externalRates.rates?.length || 0;
    // for (const rateData of externalRates.rates) {
    //   try {
    //     await prisma.currencyRate.upsert({
    //       where: {
    //         fromCurrency_toCurrency_rateDate: {
    //           fromCurrency: rateData.fromCurrency,
    //           toCurrency: rateData.toCurrency,
    //           rateDate: new Date(rateData.rateDate),
    //         },
    //       },
    //       update: {
    //         rate: rateData.rate,
    //         source: 'api',
    //         updatedAt: new Date(),
    //       },
    //       create: {
    //         fromCurrency: rateData.fromCurrency,
    //         toCurrency: rateData.toCurrency,
    //         rate: rateData.rate,
    //         rateDate: new Date(rateData.rateDate),
    //         source: 'api',
    //         isActive: true,
    //       },
    //     });
    //     updatedCount++;
    //   } catch (error) {
    //     console.error(`Failed to save rate ${rateData.fromCurrency}/${rateData.toCurrency}:`, error);
    //   }
    // }

    return NextResponse.json({
      success: true,
      data: {
        updatedCount,
        totalRates: externalRates.rates?.length || 0,
        source: externalRates.source,
        lastUpdate: new Date().toISOString(),
      },
      message: `${updatedCount} currency rates synchronized successfully`,
    });
  } catch (error) {
    console.error('Currency Sync error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync currency rates' },
      { status: 500 }
    );
  }
}

// Calculate unrealized gains/losses
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const asOfDate = searchParams.get('asOfDate') || new Date().toISOString().split('T')[0];
    const baseCurrency = searchParams.get('baseCurrency') || 'AED';

    const unrealizedGainLoss = await calculateUnrealizedGainLoss(asOfDate, baseCurrency);

    return NextResponse.json({
      success: true,
      data: unrealizedGainLoss,
    });
  } catch (error) {
    console.error('Unrealized Gain/Loss calculation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate unrealized gain/loss' },
      { status: 500 }
    );
  }
}

// Helper functions
function getSupportedCurrencies() {
  return [
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق' },
    { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  ];
}

function calculateCrossRates(rates: any[], baseCurrency: string) {
  const crossRates = [];

  for (let i = 0; i < rates.length; i++) {
    for (let j = i + 1; j < rates.length; j++) {
      const rate1 = rates[i];
      const rate2 = rates[j];

      // Calculate cross rate between two non-base currencies
      if (rate1.fromCurrency === baseCurrency && rate2.fromCurrency === baseCurrency) {
        const crossRate = Number(rate1.rate) / Number(rate2.rate);
        crossRates.push({
          fromCurrency: rate1.toCurrency,
          toCurrency: rate2.toCurrency,
          rate: crossRate,
          calculatedFrom: `${rate1.fromCurrency}/${rate1.toCurrency} ÷ ${rate2.fromCurrency}/${rate2.toCurrency}`,
        });
      }
    }
  }

  return crossRates;
}

async function fetchExternalRates(baseCurrency: string, source: string) {
  try {
    // This would integrate with actual API services like:
    // - Central Bank of UAE: https://www.centralbank.ae/
    // - Fixer.io API
    // - ExchangeRate-API
    // - Currency Layer API

    // Mock implementation for demonstration
    const mockRates = [
      { fromCurrency: 'AED', toCurrency: 'USD', rate: 0.272, rateDate: new Date().toISOString().split('T')[0] },
      { fromCurrency: 'AED', toCurrency: 'EUR', rate: 0.245, rateDate: new Date().toISOString().split('T')[0] },
      { fromCurrency: 'AED', toCurrency: 'GBP', rate: 0.214, rateDate: new Date().toISOString().split('T')[0] },
      { fromCurrency: 'AED', toCurrency: 'SAR', rate: 1.02, rateDate: new Date().toISOString().split('T')[0] },
      { fromCurrency: 'AED', toCurrency: 'INR', rate: 22.65, rateDate: new Date().toISOString().split('T')[0] },
    ];

    return {
      success: true,
      rates: mockRates,
      source: 'Central Bank of UAE (Mock)',
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

async function calculateUnrealizedGainLoss(asOfDate: string, baseCurrency: string) {
  // Get all foreign currency balances
  const foreignCurrencyBalances = await prisma.$queryRaw`
    SELECT
      t.currency,
      SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END) as balance
    FROM transactions t
    WHERE t.status = 'COMPLETED'
      AND t.currency != ${baseCurrency}
      AND t.transaction_date <= ${new Date(asOfDate)}
    GROUP BY t.currency
    HAVING SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE -t.amount END) != 0
  ` as any[];

  const gainLossItems = [];
  let totalGainLoss = 0;

  for (const balance of foreignCurrencyBalances) {
    // Get current exchange rate
    // Note: CurrencyRate model not yet implemented - using mock data
    const currentRate: any = null;
    // const currentRate = await prisma.currencyRate.findFirst({
    //   where: {
    //     fromCurrency: balance.currency,
    //     toCurrency: baseCurrency,
    //     rateDate: { lte: new Date(asOfDate) },
    //     isActive: true,
    //   },
    //   orderBy: { rateDate: 'desc' },
    // });

    if (currentRate) {
      const balanceAmount = Number(balance.balance);
      const currentValue = balanceAmount * Number(currentRate.rate);

      // For simplicity, assume original rate was different
      // In real implementation, you'd track the original exchange rates
      const originalRate = Number(currentRate.rate) * 1.02; // Mock 2% difference
      const originalValue = balanceAmount * originalRate;

      const gainLoss = currentValue - originalValue;

      gainLossItems.push({
        currency: balance.currency,
        balance: balanceAmount,
        originalRate,
        currentRate: Number(currentRate.rate),
        originalValue,
        currentValue,
        gainLoss,
      });

      totalGainLoss += gainLoss;
    }
  }

  return {
    asOfDate,
    baseCurrency,
    totalGainLoss,
    items: gainLossItems,
    calculatedAt: new Date().toISOString(),
  };
}