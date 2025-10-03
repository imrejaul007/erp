import { NextRequest } from 'next/server';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Mock exchange rates - in production, these would come from a real forex API
const baseCurrency = 'AED';
const exchangeRates = {
  // Base currency AED to other currencies
  'USD': 0.27,    // 1 AED = 0.27 USD
  'EUR': 0.25,    // 1 AED = 0.25 EUR
  'GBP': 0.22,    // 1 AED = 0.22 GBP
  'SAR': 1.02,    // 1 AED = 1.02 SAR
  'KWD': 0.08,    // 1 AED = 0.08 KWD
  'BHD': 0.10,    // 1 AED = 0.10 BHD
  'OMR': 0.10,    // 1 AED = 0.10 OMR
  'QAR': 0.99,    // 1 AED = 0.99 QAR
  'JPY': 40.50,   // 1 AED = 40.50 JPY
  'CNY': 1.95,    // 1 AED = 1.95 CNY
  'INR': 22.70,   // 1 AED = 22.70 INR
  'PKR': 75.80,   // 1 AED = 75.80 PKR
  'BDT': 29.90,   // 1 AED = 29.90 BDT
  'LKR': 79.50,   // 1 AED = 79.50 LKR
  'PHP': 15.20,   // 1 AED = 15.20 PHP
  'THB': 9.70,    // 1 AED = 9.70 THB
  'MYR': 1.28,    // 1 AED = 1.28 MYR
  'SGD': 0.37,    // 1 AED = 0.37 SGD
  'CAD': 0.37,    // 1 AED = 0.37 CAD
  'AUD': 0.41,    // 1 AED = 0.41 AUD
  'CHF': 0.24,    // 1 AED = 0.24 CHF
  'SEK': 2.95,    // 1 AED = 2.95 SEK
  'NOK': 2.90,    // 1 AED = 2.90 NOK
  'DKK': 1.87,    // 1 AED = 1.87 DKK
  'RUB': 25.20,   // 1 AED = 25.20 RUB
  'TRY': 7.80,    // 1 AED = 7.80 TRY
  'ZAR': 5.10,    // 1 AED = 5.10 ZAR
  'EGP': 13.40,   // 1 AED = 13.40 EGP
  'NGN': 420.50,  // 1 AED = 420.50 NGN
  'GHS': 3.25,    // 1 AED = 3.25 GHS
  'KES': 40.20,   // 1 AED = 40.20 KES
  'UGX': 1015.50, // 1 AED = 1015.50 UGX
  'AED': 1.00     // Base currency
};

// Currency information including symbols, names, and formatting
const currencyInfo: Record<string, any> = {
  'AED': { name: 'UAE Dirham', symbol: 'د.إ', symbolPosition: 'before', decimals: 2, popular: true },
  'USD': { name: 'US Dollar', symbol: '$', symbolPosition: 'before', decimals: 2, popular: true },
  'EUR': { name: 'Euro', symbol: '€', symbolPosition: 'before', decimals: 2, popular: true },
  'GBP': { name: 'British Pound', symbol: '£', symbolPosition: 'before', decimals: 2, popular: true },
  'SAR': { name: 'Saudi Riyal', symbol: 'ر.س', symbolPosition: 'after', decimals: 2, popular: true },
  'KWD': { name: 'Kuwaiti Dinar', symbol: 'د.ك', symbolPosition: 'after', decimals: 3, popular: true },
  'BHD': { name: 'Bahraini Dinar', symbol: '.د.ب', symbolPosition: 'after', decimals: 3, popular: true },
  'OMR': { name: 'Omani Rial', symbol: 'ر.ع.', symbolPosition: 'after', decimals: 3, popular: true },
  'QAR': { name: 'Qatari Riyal', symbol: 'ر.ق', symbolPosition: 'after', decimals: 2, popular: true },
  'JPY': { name: 'Japanese Yen', symbol: '¥', symbolPosition: 'before', decimals: 0, popular: true },
  'CNY': { name: 'Chinese Yuan', symbol: '¥', symbolPosition: 'before', decimals: 2, popular: true },
  'INR': { name: 'Indian Rupee', symbol: '₹', symbolPosition: 'before', decimals: 2, popular: true },
  'PKR': { name: 'Pakistani Rupee', symbol: '₨', symbolPosition: 'before', decimals: 2, popular: false },
  'BDT': { name: 'Bangladeshi Taka', symbol: '৳', symbolPosition: 'before', decimals: 2, popular: false },
  'LKR': { name: 'Sri Lankan Rupee', symbol: 'Rs', symbolPosition: 'before', decimals: 2, popular: false },
  'PHP': { name: 'Philippine Peso', symbol: '₱', symbolPosition: 'before', decimals: 2, popular: false },
  'THB': { name: 'Thai Baht', symbol: '฿', symbolPosition: 'before', decimals: 2, popular: false },
  'MYR': { name: 'Malaysian Ringgit', symbol: 'RM', symbolPosition: 'before', decimals: 2, popular: false },
  'SGD': { name: 'Singapore Dollar', symbol: 'S$', symbolPosition: 'before', decimals: 2, popular: true },
  'CAD': { name: 'Canadian Dollar', symbol: 'C$', symbolPosition: 'before', decimals: 2, popular: false },
  'AUD': { name: 'Australian Dollar', symbol: 'A$', symbolPosition: 'before', decimals: 2, popular: false },
  'CHF': { name: 'Swiss Franc', symbol: 'CHF', symbolPosition: 'after', decimals: 2, popular: false },
  'SEK': { name: 'Swedish Krona', symbol: 'kr', symbolPosition: 'after', decimals: 2, popular: false },
  'NOK': { name: 'Norwegian Krone', symbol: 'kr', symbolPosition: 'after', decimals: 2, popular: false },
  'DKK': { name: 'Danish Krone', symbol: 'kr', symbolPosition: 'after', decimals: 2, popular: false },
  'RUB': { name: 'Russian Ruble', symbol: '₽', symbolPosition: 'after', decimals: 2, popular: false },
  'TRY': { name: 'Turkish Lira', symbol: '₺', symbolPosition: 'before', decimals: 2, popular: false },
  'ZAR': { name: 'South African Rand', symbol: 'R', symbolPosition: 'before', decimals: 2, popular: false },
  'EGP': { name: 'Egyptian Pound', symbol: 'ج.م', symbolPosition: 'after', decimals: 2, popular: false },
  'NGN': { name: 'Nigerian Naira', symbol: '₦', symbolPosition: 'before', decimals: 2, popular: false },
  'GHS': { name: 'Ghanaian Cedi', symbol: 'GH₵', symbolPosition: 'before', decimals: 2, popular: false },
  'KES': { name: 'Kenyan Shilling', symbol: 'KSh', symbolPosition: 'before', decimals: 2, popular: false },
  'UGX': { name: 'Ugandan Shilling', symbol: 'USh', symbolPosition: 'before', decimals: 0, popular: false }
};

// Tourist-friendly currency groups
const currencyGroups: Record<string, string[]> = {
  'gulf': ['AED', 'SAR', 'KWD', 'BHD', 'OMR', 'QAR'],
  'major': ['USD', 'EUR', 'GBP', 'JPY'],
  'asian': ['CNY', 'INR', 'PKR', 'BDT', 'LKR', 'PHP', 'THB', 'MYR', 'SGD'],
  'african': ['ZAR', 'EGP', 'NGN', 'GHS', 'KES', 'UGX'],
  'european': ['EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'RUB', 'TRY'],
  'american': ['USD', 'CAD', 'AUD']
};

// Convert amount from AED to target currency
function convertFromAED(amountAED: number, targetCurrency: string): number {
  const rate = exchangeRates[targetCurrency];
  if (!rate) {
    throw new Error(`Exchange rate not available for ${targetCurrency}`);
  }
  return amountAED * rate;
}

// Convert amount from source currency to AED
function convertToAED(amount: number, sourceCurrency: string): number {
  if (sourceCurrency === 'AED') {
    return amount;
  }
  const rate = exchangeRates[sourceCurrency];
  if (!rate) {
    throw new Error(`Exchange rate not available for ${sourceCurrency}`);
  }
  return amount / rate;
}

// Convert between any two currencies
function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Convert to AED first, then to target currency
  const aedAmount = convertToAED(amount, fromCurrency);
  return convertFromAED(aedAmount, toCurrency);
}

// Format currency amount according to currency rules
function formatCurrency(amount: number, currency: string): string {
  const info = currencyInfo[currency];
  if (!info) {
    return `${amount.toFixed(2)} ${currency}`;
  }

  const formattedAmount = amount.toFixed(info.decimals);
  const symbol = info.symbol;

  if (info.symbolPosition === 'before') {
    return `${symbol} ${formattedAmount}`;
  } else {
    return `${formattedAmount} ${symbol}`;
  }
}

// Calculate exchange rate with margin for business
function calculateExchangeRateWithMargin(baseCurrency: string, targetCurrency: string, margin: number = 0.02): number {
  const baseRate = convertCurrency(1, baseCurrency, targetCurrency);
  // Apply margin (default 2% for tourism)
  return baseRate * (1 - margin);
}

// Get popular currencies for POS interface
function getPopularCurrencies(): any[] {
  return Object.entries(currencyInfo)
    .filter(([_, info]) => info.popular)
    .map(([code, info]) => ({
      code,
      name: info.name,
      symbol: info.symbol,
      rate: exchangeRates[code],
      formatted: formatCurrency(100, code) // Example amount
    }))
    .sort((a, b) => {
      // Sort by Gulf currencies first, then major currencies
      const gulfOrder = ['AED', 'SAR', 'KWD', 'BHD', 'OMR', 'QAR'];
      const majorOrder = ['USD', 'EUR', 'GBP', 'JPY'];

      const aIndex = gulfOrder.indexOf(a.code);
      const bIndex = gulfOrder.indexOf(b.code);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      const aMajorIndex = majorOrder.indexOf(a.code);
      const bMajorIndex = majorOrder.indexOf(b.code);

      if (aMajorIndex !== -1 && bMajorIndex !== -1) return aMajorIndex - bMajorIndex;
      if (aMajorIndex !== -1) return -1;
      if (bMajorIndex !== -1) return 1;

      return a.name.localeCompare(b.name);
    });
}

// GET endpoint for exchange rates and currency information
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from')?.toUpperCase();
    const to = searchParams.get('to')?.toUpperCase();
    const amount = parseFloat(searchParams.get('amount') || '1');
    const group = searchParams.get('group')?.toLowerCase();
    const popular = searchParams.get('popular') === 'true';

    // If specific conversion requested
    if (from && to) {
      if (!exchangeRates.hasOwnProperty(from) || !exchangeRates.hasOwnProperty(to)) {
        return apiError('Currency not supported', 400);
      }

      const convertedAmount = convertCurrency(amount, from, to);
      const rate = convertCurrency(1, from, to);

      return apiResponse({
        conversion: {
          from: {
            currency: from,
            amount: amount,
            formatted: formatCurrency(amount, from)
          },
          to: {
            currency: to,
            amount: convertedAmount,
            formatted: formatCurrency(convertedAmount, to)
          },
          rate: rate,
          margin: 0.02, // 2% margin for tourism
          effectiveRate: calculateExchangeRateWithMargin(from, to),
          timestamp: new Date().toISOString()
        }
      });
    }

    // If currency group requested
    if (group && currencyGroups[group]) {
      const groupCurrencies = currencyGroups[group].map(code => ({
        code,
        name: currencyInfo[code]?.name,
        symbol: currencyInfo[code]?.symbol,
        rate: exchangeRates[code],
        formatted: formatCurrency(amount, code)
      }));

      return apiResponse({
        group,
        currencies: groupCurrencies,
        baseCurrency,
        baseAmount: amount
      });
    }

    // If popular currencies requested
    if (popular) {
      return apiResponse({
        popularCurrencies: getPopularCurrencies(),
        baseCurrency,
        lastUpdated: new Date().toISOString()
      });
    }

    // Return all exchange rates
    const allRates = Object.entries(exchangeRates).map(([code, rate]) => ({
      currency: code,
      name: currencyInfo[code]?.name || code,
      symbol: currencyInfo[code]?.symbol || code,
      rate: rate,
      formatted: formatCurrency(amount, code),
      popular: currencyInfo[code]?.popular || false,
      decimals: currencyInfo[code]?.decimals || 2
    }));

    return apiResponse({
      baseCurrency,
      baseAmount: amount,
      rates: allRates,
      groups: Object.keys(currencyGroups),
      lastUpdated: new Date().toISOString(),
      disclaimer: 'Rates are indicative and include a margin for retail transactions'
    });

  } catch (error) {
    console.error('Currency exchange error:', error);
    return apiError('Failed to process currency exchange request', 500);
  }
})

// POST endpoint for bulk currency conversion (for cart totals)
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { items, fromCurrency, toCurrency, customerType = 'tourist' } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return apiError('Items array is required', 400);
    }

    if (!exchangeRates.hasOwnProperty(fromCurrency) || !exchangeRates.hasOwnProperty(toCurrency)) {
      return apiError('Currency not supported', 400);
    }

    // Apply margin based on customer type
    let margin = 0.02; // Default 2% for tourists
    if (customerType === 'wholesale') margin = 0.005; // 0.5% for wholesale
    if (customerType === 'vip') margin = 0.01; // 1% for VIP

    const effectiveRate = calculateExchangeRateWithMargin(fromCurrency, toCurrency, margin);

    // Convert each item
    const convertedItems = items.map(item => {
      const originalAmount = item.amount || 0;
      const convertedAmount = originalAmount * effectiveRate;

      return {
        ...item,
        originalAmount,
        originalCurrency: fromCurrency,
        convertedAmount,
        convertedCurrency: toCurrency,
        originalFormatted: formatCurrency(originalAmount, fromCurrency),
        convertedFormatted: formatCurrency(convertedAmount, toCurrency),
        exchangeRate: effectiveRate
      };
    });

    // Calculate totals
    const originalTotal = convertedItems.reduce((sum, item) => sum + item.originalAmount, 0);
    const convertedTotal = convertedItems.reduce((sum, item) => sum + item.convertedAmount, 0);

    return apiResponse({
      conversion: {
        fromCurrency,
        toCurrency,
        exchangeRate: effectiveRate,
        margin,
        customerType,
        originalTotal,
        convertedTotal,
        originalTotalFormatted: formatCurrency(originalTotal, fromCurrency),
        convertedTotalFormatted: formatCurrency(convertedTotal, toCurrency),
        items: convertedItems,
        timestamp: new Date().toISOString(),
        disclaimer: `Rate includes ${(margin * 100).toFixed(1)}% margin for ${customerType} customers`
      }
    });

  } catch (error) {
    console.error('Bulk currency conversion error:', error);
    return apiError('Failed to process bulk currency conversion', 500);
  }
})
