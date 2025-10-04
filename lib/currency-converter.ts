/**
 * Currency Conversion Utilities
 *
 * Provides currency conversion functionality with support for:
 * - Real-time exchange rate fetching
 * - Cached exchange rates
 * - Multi-currency calculations
 * - Currency formatting
 */

import prisma from './prisma';

export interface ExchangeRateData {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: Date;
}

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  targetCurrency: string;
  exchangeRate: number;
  conversionDate: Date;
}

/**
 * Common currencies supported
 */
export const CURRENCIES = {
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', decimals: 2 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  SAR: { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', decimals: 2 },
  QAR: { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', decimals: 2 },
  KWD: { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', decimals: 3 },
  OMR: { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial', decimals: 3 },
  BHD: { code: 'BHD', symbol: 'د.ب', name: 'Bahraini Dinar', decimals: 3 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 2 },
  PKR: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', decimals: 2 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
};

/**
 * Get exchange rate from database or fetch from API
 */
export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  tenantId: string,
  effectiveDate?: Date
): Promise<number> {
  // Same currency - return 1
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const targetDate = effectiveDate || new Date();

  // Try to get from database first
  const storedRate = await prisma.exchangeRate.findFirst({
    where: {
      tenantId,
      fromCurrency,
      toCurrency,
      effectiveDate: {
        lte: targetDate,
      },
    },
    orderBy: {
      effectiveDate: 'desc',
    },
  });

  if (storedRate) {
    return Number(storedRate.rate);
  }

  // If not found, try reverse rate
  const reverseRate = await prisma.exchangeRate.findFirst({
    where: {
      tenantId,
      fromCurrency: toCurrency,
      toCurrency: fromCurrency,
      effectiveDate: {
        lte: targetDate,
      },
    },
    orderBy: {
      effectiveDate: 'desc',
    },
  });

  if (reverseRate) {
    return 1 / Number(reverseRate.rate);
  }

  // If still not found, fetch from external API or use default rates
  const rate = await fetchExchangeRateFromAPI(fromCurrency, toCurrency);

  // Store for future use
  await prisma.exchangeRate.create({
    data: {
      fromCurrency,
      toCurrency,
      rate,
      effectiveDate: new Date(),
      tenantId,
    },
  });

  return rate;
}

/**
 * Fetch exchange rate from external API
 * In production, integrate with services like:
 * - exchangerate-api.com
 * - openexchangerates.org
 * - fixer.io
 * - currencylayer.com
 */
async function fetchExchangeRateFromAPI(
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  // Placeholder implementation
  // In production, call actual API:
  // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
  // const data = await response.json();
  // return data.rates[toCurrency];

  // Default rates (for development)
  const defaultRates: Record<string, Record<string, number>> = {
    AED: {
      USD: 0.272,
      EUR: 0.25,
      GBP: 0.22,
      SAR: 1.02,
      QAR: 0.99,
      KWD: 0.084,
      OMR: 0.105,
      BHD: 0.103,
      INR: 22.68,
      PKR: 75.5,
      CNY: 1.97,
      JPY: 40.5,
    },
    USD: {
      AED: 3.67,
      EUR: 0.92,
      GBP: 0.79,
      SAR: 3.75,
      QAR: 3.64,
      KWD: 0.31,
      OMR: 0.38,
      BHD: 0.38,
      INR: 83.12,
      PKR: 277.5,
      CNY: 7.24,
      JPY: 149.5,
    },
  };

  if (defaultRates[fromCurrency]?.[toCurrency]) {
    return defaultRates[fromCurrency][toCurrency];
  }

  // If not in default rates, try reverse
  if (defaultRates[toCurrency]?.[fromCurrency]) {
    return 1 / defaultRates[toCurrency][fromCurrency];
  }

  // Default to 1 if no rate found
  console.warn(`No exchange rate found for ${fromCurrency} to ${toCurrency}, using 1.0`);
  return 1;
}

/**
 * Convert amount between currencies
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  tenantId: string,
  effectiveDate?: Date
): Promise<ConversionResult> {
  const exchangeRate = await getExchangeRate(
    fromCurrency,
    toCurrency,
    tenantId,
    effectiveDate
  );

  const convertedAmount = amount * exchangeRate;

  return {
    originalAmount: amount,
    originalCurrency: fromCurrency,
    convertedAmount: Number(convertedAmount.toFixed(getCurrencyDecimals(toCurrency))),
    targetCurrency: toCurrency,
    exchangeRate,
    conversionDate: effectiveDate || new Date(),
  };
}

/**
 * Get currency decimals
 */
export function getCurrencyDecimals(currencyCode: string): number {
  return CURRENCIES[currencyCode as keyof typeof CURRENCIES]?.decimals || 2;
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currencyCode: string,
  includeSymbol: boolean = true
): string {
  const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
  const decimals = currency?.decimals || 2;
  const formatted = amount.toFixed(decimals);

  if (includeSymbol && currency) {
    return `${currency.symbol} ${formatted}`;
  }

  return `${currencyCode} ${formatted}`;
}

/**
 * Update exchange rates in bulk
 */
export async function updateExchangeRates(
  tenantId: string,
  rates: Array<{
    fromCurrency: string;
    toCurrency: string;
    rate: number;
  }>,
  effectiveDate?: Date
): Promise<number> {
  const date = effectiveDate || new Date();
  let count = 0;

  for (const rateData of rates) {
    await prisma.exchangeRate.create({
      data: {
        fromCurrency: rateData.fromCurrency,
        toCurrency: rateData.toCurrency,
        rate: rateData.rate,
        effectiveDate: date,
        tenantId,
      },
    });
    count++;
  }

  return count;
}

/**
 * Get all exchange rates for a currency
 */
export async function getCurrencyRates(
  baseCurrency: string,
  tenantId: string
): Promise<ExchangeRateData[]> {
  const rates = await prisma.exchangeRate.findMany({
    where: {
      tenantId,
      fromCurrency: baseCurrency,
    },
    orderBy: {
      effectiveDate: 'desc',
    },
    distinct: ['toCurrency'],
  });

  return rates.map((rate) => ({
    fromCurrency: rate.fromCurrency,
    toCurrency: rate.toCurrency,
    rate: Number(rate.rate),
    effectiveDate: rate.effectiveDate,
  }));
}

/**
 * Calculate multi-currency invoice total
 */
export async function calculateMultiCurrencyTotal(
  lineItems: Array<{
    amount: number;
    currency: string;
  }>,
  targetCurrency: string,
  tenantId: string
): Promise<{
  total: number;
  breakdown: Array<{
    originalAmount: number;
    currency: string;
    convertedAmount: number;
    rate: number;
  }>;
}> {
  let total = 0;
  const breakdown = [];

  for (const item of lineItems) {
    const conversion = await convertCurrency(
      item.amount,
      item.currency,
      targetCurrency,
      tenantId
    );

    total += conversion.convertedAmount;
    breakdown.push({
      originalAmount: item.amount,
      currency: item.currency,
      convertedAmount: conversion.convertedAmount,
      rate: conversion.exchangeRate,
    });
  }

  return {
    total: Number(total.toFixed(getCurrencyDecimals(targetCurrency))),
    breakdown,
  };
}
