const axios = require('axios');
const { ExchangeRate } = require('../models/pricing');

class CurrencyService {
  constructor() {
    this.baseCurrency = 'AED'; // UAE Dirham as base currency
    this.supportedCurrencies = [
      'AED', 'USD', 'EUR', 'GBP', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JPY', 'CNY', 'INR'
    ];
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
    this.fallbackRates = {
      'USD': 3.67, // AED to USD fixed rate
      'EUR': 4.00,
      'GBP': 4.60,
      'SAR': 0.98,
      'QAR': 1.01,
      'KWD': 12.05,
      'BHD': 9.75,
      'OMR': 9.55,
      'JPY': 0.025,
      'CNY': 0.51,
      'INR': 0.044
    };
  }

  async getExchangeRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const cacheKey = `${fromCurrency}_${toCurrency}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.rate;
    }

    try {
      // Try to get from database first
      const dbRate = await this.getFromDatabase(fromCurrency, toCurrency);
      if (dbRate) {
        this.cache.set(cacheKey, { rate: dbRate, timestamp: Date.now() });
        return dbRate;
      }

      // Fetch from external API
      const apiRate = await this.fetchFromAPI(fromCurrency, toCurrency);
      if (apiRate) {
        // Save to database
        await this.saveToDatabase(fromCurrency, toCurrency, apiRate);
        this.cache.set(cacheKey, { rate: apiRate, timestamp: Date.now() });
        return apiRate;
      }

      // Use fallback rates
      return this.getFallbackRate(fromCurrency, toCurrency);

    } catch (error) {
      console.error('Exchange rate fetch error:', error);
      return this.getFallbackRate(fromCurrency, toCurrency);
    }
  }

  async getFromDatabase(fromCurrency, toCurrency) {
    try {
      const exchangeRate = await ExchangeRate.findOne({
        baseCurrency: fromCurrency,
        targetCurrency: toCurrency,
        isActive: true,
        validUntil: { $gt: new Date() }
      }).sort({ createdAt: -1 });

      return exchangeRate ? exchangeRate.rate : null;
    } catch (error) {
      console.error('Database exchange rate error:', error);
      return null;
    }
  }

  async saveToDatabase(fromCurrency, toCurrency, rate) {
    try {
      const exchangeRate = new ExchangeRate({
        baseCurrency: fromCurrency,
        targetCurrency: toCurrency,
        rate: rate,
        source: 'api',
        isActive: true,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // Valid for 24 hours
      });

      await exchangeRate.save();
    } catch (error) {
      console.error('Save exchange rate error:', error);
    }
  }

  async fetchFromAPI(fromCurrency, toCurrency) {
    try {
      // Using multiple APIs for redundancy
      const apis = [
        {
          name: 'exchangerate-api',
          url: `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
          extractRate: (data) => data.rates[toCurrency]
        },
        {
          name: 'fixer',
          url: `https://api.fixer.io/latest?base=${fromCurrency}&symbols=${toCurrency}`,
          extractRate: (data) => data.rates[toCurrency]
        },
        {
          name: 'currencylayer',
          url: `http://api.currencylayer.com/live?access_key=${process.env.CURRENCYLAYER_API_KEY}&source=${fromCurrency}&currencies=${toCurrency}`,
          extractRate: (data) => data.quotes[`${fromCurrency}${toCurrency}`]
        }
      ];

      for (const api of apis) {
        try {
          const response = await axios.get(api.url, { timeout: 5000 });
          const rate = api.extractRate(response.data);
          if (rate && rate > 0) {
            return rate;
          }
        } catch (apiError) {
          console.error(`${api.name} API error:`, apiError.message);
        }
      }

      return null;
    } catch (error) {
      console.error('API fetch error:', error);
      return null;
    }
  }

  getFallbackRate(fromCurrency, toCurrency) {
    if (fromCurrency === 'AED') {
      return this.fallbackRates[toCurrency] || 1;
    } else if (toCurrency === 'AED') {
      return 1 / (this.fallbackRates[fromCurrency] || 1);
    } else {
      // Convert via AED
      const fromToAED = 1 / (this.fallbackRates[fromCurrency] || 1);
      const aedToTarget = this.fallbackRates[toCurrency] || 1;
      return fromToAED * aedToTarget;
    }
  }

  async convertAmount(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  }

  async convertPriceList(prices, targetCurrency) {
    const convertedPrices = {};

    for (const [currency, amount] of Object.entries(prices)) {
      if (currency === targetCurrency) {
        convertedPrices[currency] = amount;
      } else {
        convertedPrices[currency] = await this.convertAmount(amount, currency, targetCurrency);
      }
    }

    return convertedPrices;
  }

  formatCurrency(amount, currency = 'AED', locale = 'en-AE') {
    const formatters = {
      'AED': new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      'USD': new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      'EUR': new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      'GBP': new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      'SAR': new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    };

    const formatter = formatters[currency] || formatters['AED'];
    return formatter.format(amount);
  }

  getCurrencySymbol(currency) {
    const symbols = {
      'AED': 'د.إ',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'SAR': 'ر.س',
      'QAR': 'ر.ق',
      'KWD': 'د.ك',
      'BHD': 'د.ب',
      'OMR': 'ر.ع',
      'JPY': '¥',
      'CNY': '¥',
      'INR': '₹'
    };

    return symbols[currency] || currency;
  }

  getCurrencyInfo(currency) {
    const currencyInfo = {
      'AED': {
        name: 'UAE Dirham',
        arabicName: 'درهم إماراتي',
        symbol: 'د.إ',
        code: 'AED',
        decimals: 2,
        subunit: 'Fils',
        arabicSubunit: 'فلس'
      },
      'USD': {
        name: 'US Dollar',
        arabicName: 'دولار أمريكي',
        symbol: '$',
        code: 'USD',
        decimals: 2,
        subunit: 'Cent',
        arabicSubunit: 'سنت'
      },
      'EUR': {
        name: 'Euro',
        arabicName: 'يورو',
        symbol: '€',
        code: 'EUR',
        decimals: 2,
        subunit: 'Cent',
        arabicSubunit: 'سنت'
      },
      'SAR': {
        name: 'Saudi Riyal',
        arabicName: 'ريال سعودي',
        symbol: 'ر.س',
        code: 'SAR',
        decimals: 2,
        subunit: 'Halala',
        arabicSubunit: 'هللة'
      },
      'QAR': {
        name: 'Qatari Riyal',
        arabicName: 'ريال قطري',
        symbol: 'ر.ق',
        code: 'QAR',
        decimals: 2,
        subunit: 'Dirham',
        arabicSubunit: 'درهم'
      }
    };

    return currencyInfo[currency] || {
      name: currency,
      arabicName: currency,
      symbol: currency,
      code: currency,
      decimals: 2,
      subunit: '',
      arabicSubunit: ''
    };
  }

  async updateExchangeRates() {
    console.log('Updating exchange rates...');

    for (const targetCurrency of this.supportedCurrencies) {
      if (targetCurrency === this.baseCurrency) continue;

      try {
        const rate = await this.fetchFromAPI(this.baseCurrency, targetCurrency);
        if (rate) {
          await this.saveToDatabase(this.baseCurrency, targetCurrency, rate);
          console.log(`Updated ${this.baseCurrency}/${targetCurrency}: ${rate}`);
        }
      } catch (error) {
        console.error(`Failed to update ${this.baseCurrency}/${targetCurrency}:`, error);
      }
    }

    console.log('Exchange rates update completed');
  }

  async getMultiCurrencyPricing(basePrice, baseCurrency = 'AED') {
    const pricing = {};

    for (const currency of this.supportedCurrencies) {
      if (currency === baseCurrency) {
        pricing[currency] = {
          amount: basePrice,
          formatted: this.formatCurrency(basePrice, currency),
          symbol: this.getCurrencySymbol(currency)
        };
      } else {
        const convertedAmount = await this.convertAmount(basePrice, baseCurrency, currency);
        pricing[currency] = {
          amount: convertedAmount,
          formatted: this.formatCurrency(convertedAmount, currency),
          symbol: this.getCurrencySymbol(currency)
        };
      }
    }

    return pricing;
  }

  async calculateDynamicPricing(basePrice, targetCurrency, customerType = 'retail') {
    let finalPrice = basePrice;

    // Apply customer type adjustments
    const adjustments = {
      'retail': 1.0,
      'wholesale': 0.85,
      'vip': 0.90,
      'export': 0.80,
      'staff': 0.70
    };

    finalPrice *= (adjustments[customerType] || 1.0);

    // Convert to target currency
    const convertedPrice = await this.convertAmount(finalPrice, this.baseCurrency, targetCurrency);

    // Apply currency-specific rounding
    return this.roundByCurrency(convertedPrice, targetCurrency);
  }

  roundByCurrency(amount, currency) {
    const roundingRules = {
      'AED': 0.05, // Round to nearest 5 fils
      'USD': 0.01,
      'EUR': 0.01,
      'SAR': 0.05,
      'QAR': 0.05,
      'KWD': 0.005, // Round to nearest 5 fils
      'BHD': 0.005,
      'OMR': 0.005,
      'JPY': 1, // Round to nearest yen
      'CNY': 0.01,
      'INR': 0.50 // Round to nearest 50 paisa
    };

    const roundTo = roundingRules[currency] || 0.01;
    return Math.round(amount / roundTo) * roundTo;
  }

  async getPriceHistory(productId, currency, days = 30) {
    try {
      // This would typically fetch from a price history table
      // For now, return mock data structure
      const endDate = new Date();
      const startDate = new Date(endDate - days * 24 * 60 * 60 * 1000);

      return {
        productId,
        currency,
        period: `${days} days`,
        startDate,
        endDate,
        data: [] // Would contain historical price points
      };
    } catch (error) {
      console.error('Price history error:', error);
      return null;
    }
  }

  // Scheduled job to update rates
  startRateUpdateScheduler() {
    // Update rates every 6 hours
    setInterval(() => {
      this.updateExchangeRates();
    }, 6 * 60 * 60 * 1000);

    // Initial update
    this.updateExchangeRates();
  }

  // Get real-time rate for critical transactions
  async getRealTimeRate(fromCurrency, toCurrency) {
    try {
      // Force fresh API call for critical transactions
      const rate = await this.fetchFromAPI(fromCurrency, toCurrency);
      return rate || this.getFallbackRate(fromCurrency, toCurrency);
    } catch (error) {
      console.error('Real-time rate error:', error);
      return this.getFallbackRate(fromCurrency, toCurrency);
    }
  }

  // Currency validation
  isValidCurrency(currency) {
    return this.supportedCurrencies.includes(currency);
  }

  // Get preferred currency for a region
  getRegionalCurrency(country) {
    const regionalCurrencies = {
      'UAE': 'AED',
      'US': 'USD',
      'United States': 'USD',
      'Saudi Arabia': 'SAR',
      'Qatar': 'QAR',
      'Kuwait': 'KWD',
      'Bahrain': 'BHD',
      'Oman': 'OMR',
      'Germany': 'EUR',
      'France': 'EUR',
      'UK': 'GBP',
      'United Kingdom': 'GBP',
      'Japan': 'JPY',
      'China': 'CNY',
      'India': 'INR'
    };

    return regionalCurrencies[country] || 'AED';
  }
}

module.exports = CurrencyService;