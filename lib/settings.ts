/**
 * Global System Settings
 * Unit conversions and currency exchange rates
 * These can be edited and will affect the entire application
 */

export interface UnitConversion {
  id: string;
  from: string;
  to: string;
  factor: number;
  category: 'weight' | 'volume' | 'length';
  editable: boolean;
}

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateToAED: number;
  lastUpdated: string;
}

// Unit Conversion Rates (editable)
export const unitConversions: UnitConversion[] = [
  // Weight conversions
  { id: 'kg-to-g', from: '1 kg', to: '1000 g', factor: 1000, category: 'weight', editable: false },
  { id: 'kg-to-tola', from: '1 kg', to: '85.74 tola', factor: 85.74, category: 'weight', editable: true },
  { id: 'tola-to-g', from: '1 tola', to: '11.66 g', factor: 11.66, category: 'weight', editable: true },
  { id: 'oz-to-g', from: '1 oz', to: '28.35 g', factor: 28.35, category: 'weight', editable: false },
  { id: 'lb-to-g', from: '1 lb', to: '453.59 g', factor: 453.59, category: 'weight', editable: false },
  { id: 'kg-to-oz', from: '1 kg', to: '35.27 oz', factor: 35.27, category: 'weight', editable: false },
  { id: 'kg-to-lb', from: '1 kg', to: '2.20 lb', factor: 2.20, category: 'weight', editable: false },

  // Volume conversions
  { id: 'l-to-ml', from: '1 L', to: '1000 ml', factor: 1000, category: 'volume', editable: false },
  { id: 'gal-to-l', from: '1 gal', to: '3.785 L', factor: 3.785, category: 'volume', editable: false },
  { id: 'oz-fl-to-ml', from: '1 fl oz', to: '29.57 ml', factor: 29.57, category: 'volume', editable: false },
];

// Currency Exchange Rates (editable, relative to AED)
export const currencyRates: CurrencyRate[] = [
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    rateToAED: 1.0,
    lastUpdated: new Date().toISOString()
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rateToAED: 3.67,
    lastUpdated: new Date().toISOString()
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rateToAED: 4.02,
    lastUpdated: new Date().toISOString()
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rateToAED: 4.68,
    lastUpdated: new Date().toISOString()
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: 'SAR',
    rateToAED: 0.98,
    lastUpdated: new Date().toISOString()
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    rateToAED: 0.044,
    lastUpdated: new Date().toISOString()
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    rateToAED: 0.51,
    lastUpdated: new Date().toISOString()
  }
];

// Conversion helper functions
export const convertWeight = (value: number, fromUnit: string, toUnit: string): number => {
  // First convert to grams (base unit)
  let valueInGrams = value;

  switch(fromUnit.toLowerCase()) {
    case 'kg':
      valueInGrams = value * 1000;
      break;
    case 'tola':
      valueInGrams = value * 11.66;
      break;
    case 'oz':
      valueInGrams = value * 28.35;
      break;
    case 'lb':
      valueInGrams = value * 453.59;
      break;
    case 'g':
      valueInGrams = value;
      break;
  }

  // Then convert from grams to target unit
  switch(toUnit.toLowerCase()) {
    case 'kg':
      return valueInGrams / 1000;
    case 'tola':
      return valueInGrams / 11.66;
    case 'oz':
      return valueInGrams / 28.35;
    case 'lb':
      return valueInGrams / 453.59;
    case 'g':
      return valueInGrams;
    default:
      return valueInGrams;
  }
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const fromRate = currencyRates.find(r => r.code === fromCurrency)?.rateToAED || 1;
  const toRate = currencyRates.find(r => r.code === toCurrency)?.rateToAED || 1;

  // Convert to AED first, then to target currency
  const amountInAED = amount * fromRate;
  return amountInAED / toRate;
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = currencyRates.find(r => r.code === currencyCode);
  if (!currency) return `${amount.toFixed(2)}`;

  return `${currency.symbol} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
