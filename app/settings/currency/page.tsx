'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  Globe,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Settings,
  Save,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  Calendar,
  History,
  ExternalLink
} from 'lucide-react';

const CurrencySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  // Currency Settings
  const [currencySettings, setCurrencySettings] = useState({
    baseCurrency: 'AED',
    displaySymbol: true,
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    enableMultiCurrency: true,
    autoUpdateRates: true,
    updateFrequency: 'hourly',
    exchangeRateSource: 'centralbank',
    roundingMethod: 'standard'
  });

  // Supported Currencies
  const [supportedCurrencies, setSupportedCurrencies] = useState([
    {
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      rate: 1.0000,
      isBase: true,
      isActive: true,
      lastUpdated: '2024-03-15 16:30:00',
      change24h: 0.00,
      decimalPlaces: 2
    },
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      country: 'United States',
      flag: '🇺🇸',
      rate: 0.2722,
      isBase: false,
      isActive: true,
      lastUpdated: '2024-03-15 16:30:00',
      change24h: +0.0012,
      decimalPlaces: 2
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      country: 'European Union',
      flag: '🇪🇺',
      rate: 0.2501,
      isBase: false,
      isActive: true,
      lastUpdated: '2024-03-15 16:30:00',
      change24h: -0.0008,
      decimalPlaces: 2
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      country: 'United Kingdom',
      flag: '🇬🇧',
      rate: 0.2156,
      isBase: false,
      isActive: true,
      lastUpdated: '2024-03-15 16:30:00',
      change24h: +0.0015,
      decimalPlaces: 2
    },
    {
      code: 'SAR',
      name: 'Saudi Riyal',
      symbol: 'ر.س',
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      rate: 1.0208,
      isBase: false,
      isActive: true,
      lastUpdated: '2024-03-15 16:30:00',
      change24h: +0.0002,
      decimalPlaces: 2
    },
    {
      code: 'QAR',
      name: 'Qatari Riyal',
      symbol: 'ر.ق',
      country: 'Qatar',
      flag: '🇶🇦',
      rate: 0.9911,
      isBase: false,
      isActive: false,
      lastUpdated: '2024-03-15 16:30:00',
      change24h: -0.0005,
      decimalPlaces: 2
    },
    {
      code: 'KWD',
      name: 'Kuwaiti Dinar',
      symbol: 'د.ك',
      country: 'Kuwait',
      flag: '🇰🇼',
      rate: 0.0835,
      isBase: false,
      isActive: false,
      lastUpdated: '2024-03-15 16:30:00',
      change24h: +0.0001,
      decimalPlaces: 3
    },
    {
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
      country: 'India',
      flag: '🇮🇳',
      rate: 22.6384,
      isBase: false,
      isActive: true,
      lastUpdated: '2024-03-15 16:30:00',
      change24h: +0.1250,
      decimalPlaces: 2
    }
  ]);

  // Exchange Rate History
  const [exchangeHistory, setExchangeHistory] = useState([
    {
      date: '2024-03-15',
      time: '16:30',
      currency: 'USD',
      rate: 0.2722,
      change: +0.0012,
      source: 'UAE Central Bank'
    },
    {
      date: '2024-03-15',
      time: '16:30',
      currency: 'EUR',
      rate: 0.2501,
      change: -0.0008,
      source: 'UAE Central Bank'
    },
    {
      date: '2024-03-15',
      time: '16:30',
      currency: 'GBP',
      rate: 0.2156,
      change: +0.0015,
      source: 'UAE Central Bank'
    },
    {
      date: '2024-03-15',
      time: '12:00',
      currency: 'USD',
      rate: 0.2710,
      change: -0.0005,
      source: 'UAE Central Bank'
    },
    {
      date: '2024-03-15',
      time: '08:00',
      currency: 'USD',
      rate: 0.2715,
      change: +0.0003,
      source: 'UAE Central Bank'
    }
  ]);

  // Exchange Rate Sources
  const exchangeRateSources = [
    {
      id: 'centralbank',
      name: 'UAE Central Bank',
      description: 'Official rates from the Central Bank of UAE',
      updateFrequency: 'Daily',
      reliability: 'High',
      cost: 'Free',
      status: 'active'
    },
    {
      id: 'xe',
      name: 'XE.com',
      description: 'Real-time exchange rates from XE Currency',
      updateFrequency: 'Real-time',
      reliability: 'High',
      cost: 'Paid',
      status: 'available'
    },
    {
      id: 'fixer',
      name: 'Fixer.io',
      description: 'Foreign exchange rates API service',
      updateFrequency: 'Hourly',
      reliability: 'Medium',
      cost: 'Freemium',
      status: 'available'
    },
    {
      id: 'openexchange',
      name: 'Open Exchange Rates',
      description: 'JSON-based exchange rate API',
      updateFrequency: 'Hourly',
      reliability: 'Medium',
      cost: 'Freemium',
      status: 'available'
    }
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount, currencyCode) => {
    const currency = supportedCurrencies.find(c => c.code === currencyCode);
    if (!currency) return amount.toString();

    const formatted = amount.toFixed(currency.decimalPlaces);
    if (currencySettings.symbolPosition === 'before') {
      return `${currency.symbol} ${formatted}`;
    } else {
      return `${formatted} ${currency.symbol}`;
    }
  };

  const convertCurrency = (amount, fromCode, toCode) => {
    const fromCurrency = supportedCurrencies.find(c => c.code === fromCode);
    const toCurrency = supportedCurrencies.find(c => c.code === toCode);

    if (!fromCurrency || !toCurrency) return amount;

    // Convert to base currency (AED) first, then to target currency
    const amountInBase = amount / fromCurrency.rate;
    const convertedAmount = amountInBase * toCurrency.rate;

    return convertedAmount;
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Currency & Exchange Rates</h1>
            <p className="text-gray-600">Configure currencies, exchange rates, and multi-currency support</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Rates
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Currency Status Alert */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Multi-Currency Support Active</p>
              <p className="text-sm text-blue-700">
                Base currency: AED • {supportedCurrencies.filter(c => c.isActive).length} active currencies •
                Last updated: {supportedCurrencies.find(c => c.code === 'USD')?.lastUpdated}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="currencies" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Currencies
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Exchange Rates
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Rate Sources
          </TabsTrigger>
        </TabsList>

        {/* General Currency Settings */}
        <TabsContent value="general" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Currency Configuration</CardTitle>
              <CardDescription>Configure base currency and display preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="baseCurrency">Base Currency</Label>
                  <Select
                    value={currencySettings.baseCurrency}
                    onValueChange={(value) =>
                      setCurrencySettings(prev => ({...prev, baseCurrency: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedCurrencies.filter(c => c.isActive).map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="symbolPosition">Symbol Position</Label>
                  <Select
                    value={currencySettings.symbolPosition}
                    onValueChange={(value) =>
                      setCurrencySettings(prev => ({...prev, symbolPosition: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before">Before Amount ($ 100.00)</SelectItem>
                      <SelectItem value="after">After Amount (100.00 $)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="decimalPlaces">Decimal Places</Label>
                  <Select
                    value={currencySettings.decimalPlaces.toString()}
                    onValueChange={(value) =>
                      setCurrencySettings(prev => ({...prev, decimalPlaces: parseInt(value)}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 (100)</SelectItem>
                      <SelectItem value="2">2 (100.00)</SelectItem>
                      <SelectItem value="3">3 (100.000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="roundingMethod">Rounding Method</Label>
                  <Select
                    value={currencySettings.roundingMethod}
                    onValueChange={(value) =>
                      setCurrencySettings(prev => ({...prev, roundingMethod: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Rounding</SelectItem>
                      <SelectItem value="up">Always Round Up</SelectItem>
                      <SelectItem value="down">Always Round Down</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi-Currency Options</CardTitle>
              <CardDescription>Configure multi-currency support and exchange rate updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableMultiCurrency">Enable Multi-Currency</Label>
                    <p className="text-sm text-gray-600">Allow transactions in multiple currencies</p>
                  </div>
                  <Switch
                    id="enableMultiCurrency"
                    checked={currencySettings.enableMultiCurrency}
                    onCheckedChange={(checked) =>
                      setCurrencySettings(prev => ({...prev, enableMultiCurrency: checked}))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoUpdateRates">Auto-Update Exchange Rates</Label>
                    <p className="text-sm text-gray-600">Automatically fetch latest exchange rates</p>
                  </div>
                  <Switch
                    id="autoUpdateRates"
                    checked={currencySettings.autoUpdateRates}
                    onCheckedChange={(checked) =>
                      setCurrencySettings(prev => ({...prev, autoUpdateRates: checked}))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="displaySymbol">Display Currency Symbol</Label>
                    <p className="text-sm text-gray-600">Show currency symbols in amounts</p>
                  </div>
                  <Switch
                    id="displaySymbol"
                    checked={currencySettings.displaySymbol}
                    onCheckedChange={(checked) =>
                      setCurrencySettings(prev => ({...prev, displaySymbol: checked}))
                    }
                  />
                </div>
              </div>

              {currencySettings.autoUpdateRates && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="updateFrequency">Update Frequency</Label>
                    <Select
                      value={currencySettings.updateFrequency}
                      onValueChange={(value) =>
                        setCurrencySettings(prev => ({...prev, updateFrequency: value}))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="exchangeRateSource">Exchange Rate Source</Label>
                    <Select
                      value={currencySettings.exchangeRateSource}
                      onValueChange={(value) =>
                        setCurrencySettings(prev => ({...prev, exchangeRateSource: value}))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {exchangeRateSources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            {source.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Currency Converter Tool */}
          <Card>
            <CardHeader>
              <CardTitle>Currency Converter</CardTitle>
              <CardDescription>Convert between supported currencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 items-end">
                <div>
                  <Label htmlFor="fromAmount">Amount</Label>
                  <Input
                    id="fromAmount"
                    type="number"
                    placeholder="1000"
                    defaultValue="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="fromCurrency">From</Label>
                  <Select defaultValue="AED">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedCurrencies.filter(c => c.isActive).map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor="toCurrency">To</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedCurrencies.filter(c => c.isActive).map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Result</Label>
                  <div className="p-2 bg-gray-50 rounded border font-mono text-lg">
                    $ 272.20
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supported Currencies */}
        <TabsContent value="currencies" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Supported Currencies</CardTitle>
                  <CardDescription>Manage currencies available in the system</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Currency
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportedCurrencies.map((currency) => (
                  <div key={currency.code} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{currency.flag}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{currency.code}</h3>
                            <span className="text-gray-500">({currency.symbol})</span>
                            {currency.isBase && (
                              <Badge variant="secondary">Base</Badge>
                            )}
                            {currency.isActive && (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{currency.name} • {currency.country}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>Rate: {currency.rate.toFixed(4)}</span>
                            <div className="flex items-center gap-1">
                              {getChangeIcon(currency.change24h)}
                              <span className={getChangeColor(currency.change24h)}>
                                {currency.change24h > 0 ? '+' : ''}{currency.change24h.toFixed(4)}
                              </span>
                            </div>
                            <span>Updated: {new Date(currency.lastUpdated).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <History className="h-4 w-4" />
                        </Button>
                        {!currency.isBase && (
                          <Switch
                            checked={currency.isActive}
                            onCheckedChange={(checked) => {
                              // Update currency active status
                              console.log(`Setting ${currency.code} active: ${checked}`);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exchange Rates */}
        <TabsContent value="rates" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Current Exchange Rates</CardTitle>
                  <CardDescription>Real-time exchange rates against base currency (AED)</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {supportedCurrencies.filter(c => c.isActive && !c.isBase).map((currency) => (
                  <div key={currency.code} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{currency.flag}</span>
                        <div>
                          <h4 className="font-medium">{currency.code}</h4>
                          <p className="text-xs text-gray-500">{currency.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-semibold">{currency.rate.toFixed(4)}</div>
                        <div className="flex items-center gap-1 text-xs">
                          {getChangeIcon(currency.change24h)}
                          <span className={getChangeColor(currency.change24h)}>
                            {currency.change24h > 0 ? '+' : ''}{currency.change24h.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      1 AED = {currency.rate.toFixed(4)} {currency.code}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Updated: {new Date(currency.lastUpdated)?.toLocaleString() || "0"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange Rate History</CardTitle>
              <CardDescription>Recent exchange rate updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exchangeHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">{entry.currency}</div>
                      <div className="text-sm text-gray-600">{entry.date} {entry.time}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono">{entry.rate.toFixed(4)}</div>
                      <div className="flex items-center gap-1">
                        {getChangeIcon(entry.change)}
                        <span className={`text-sm ${getChangeColor(entry.change)}`}>
                          {entry.change > 0 ? '+' : ''}{entry.change.toFixed(4)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{entry.source}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Sources */}
        <TabsContent value="sources" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Rate Sources</CardTitle>
              <CardDescription>Configure data sources for exchange rate updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exchangeRateSources.map((source) => (
                  <div key={source.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Globe className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{source.name}</h3>
                            <Badge className={getStatusColor(source.status)}>
                              {source.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>Updates: {source.updateFrequency}</span>
                            <span>Reliability: {source.reliability}</span>
                            <span>Cost: {source.cost}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={source.status === 'active'}
                          onCheckedChange={(checked) => {
                            // Update source status
                            console.log(`Setting ${source.name} active: ${checked}`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Update Schedule</CardTitle>
              <CardDescription>Configure when and how exchange rates are updated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduleType">Update Schedule</Label>
                  <Select defaultValue="automatic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                      <SelectItem value="scheduled">Custom Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="retryAttempts">Retry Attempts</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 attempt</SelectItem>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Send Alert on Update Failure</label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Log All Rate Changes</label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Validate Rate Changes ({'>'}5% change alert)</label>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurrencySettingsPage;