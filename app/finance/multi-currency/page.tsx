'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Globe,
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  RefreshCw,
  DollarSign,
  Euro,
  PoundSterling,
  Banknote,
  ArrowLeftRight,
  Calculator,
  LineChart,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function MultiCurrencyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('all');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isExchangeRateOpen, setIsExchangeRateOpen] = useState(false);

  // Exchange Rates (against AED)
  const exchangeRates = [
    {
      currency: 'USD',
      name: 'US Dollar',
      symbol: '$',
      buyRate: 3.6725,
      sellRate: 3.6775,
      midRate: 3.675,
      change: 0.0025,
      changePercent: 0.068,
      lastUpdated: '2024-09-30 14:30:00',
      source: 'Central Bank UAE',
      trend: 'up'
    },
    {
      currency: 'EUR',
      name: 'Euro',
      symbol: '€',
      buyRate: 4.0150,
      sellRate: 4.0250,
      midRate: 4.02,
      change: -0.0180,
      changePercent: -0.447,
      lastUpdated: '2024-09-30 14:30:00',
      source: 'Central Bank UAE',
      trend: 'down'
    },
    {
      currency: 'GBP',
      name: 'British Pound',
      symbol: '£',
      buyRate: 4.8950,
      sellRate: 4.9150,
      midRate: 4.905,
      change: 0.0125,
      changePercent: 0.255,
      lastUpdated: '2024-09-30 14:30:00',
      source: 'Central Bank UAE',
      trend: 'up'
    },
    {
      currency: 'SAR',
      name: 'Saudi Riyal',
      symbol: 'SR',
      buyRate: 0.9790,
      sellRate: 0.9810,
      midRate: 0.98,
      change: 0.0002,
      changePercent: 0.020,
      lastUpdated: '2024-09-30 14:30:00',
      source: 'Central Bank UAE',
      trend: 'up'
    },
    {
      currency: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      buyRate: 0.0245,
      sellRate: 0.0248,
      midRate: 0.02465,
      change: -0.0003,
      changePercent: -1.203,
      lastUpdated: '2024-09-30 14:30:00',
      source: 'Central Bank UAE',
      trend: 'down'
    }
  ];

  // Multi-Currency Transactions
  const transactions = [
    {
      id: 'MCT-001',
      date: '2024-09-30',
      type: 'Sale',
      description: 'Export Sale - Premium Oud Collection',
      fromCurrency: 'AED',
      toCurrency: 'USD',
      fromAmount: 18375,
      toAmount: 5000,
      exchangeRate: 3.675,
      realizedGainLoss: 0,
      unrealizedGainLoss: 125,
      customer: 'Luxury Perfumes USA',
      status: 'Completed',
      reference: 'INV-USD-001'
    },
    {
      id: 'MCT-002',
      date: '2024-09-28',
      type: 'Purchase',
      description: 'Import - Raw Materials from France',
      fromCurrency: 'EUR',
      toCurrency: 'AED',
      fromAmount: 2500,
      toAmount: 10050,
      exchangeRate: 4.02,
      realizedGainLoss: -50,
      unrealizedGainLoss: 0,
      vendor: 'Grasse Fragrances SARL',
      status: 'Completed',
      reference: 'PO-EUR-012'
    },
    {
      id: 'MCT-003',
      date: '2024-09-25',
      type: 'Sale',
      description: 'Online Store - UK Customer',
      fromCurrency: 'GBP',
      toCurrency: 'AED',
      fromAmount: 850,
      toAmount: 4169.25,
      exchangeRate: 4.905,
      realizedGainLoss: 25,
      unrealizedGainLoss: 0,
      customer: 'Elizabeth Windsor',
      status: 'Completed',
      reference: 'INV-GBP-008'
    },
    {
      id: 'MCT-004',
      date: '2024-09-20',
      type: 'Transfer',
      description: 'Inter-company Transfer',
      fromCurrency: 'AED',
      toCurrency: 'USD',
      fromAmount: 36750,
      toAmount: 10000,
      exchangeRate: 3.675,
      realizedGainLoss: 0,
      unrealizedGainLoss: -200,
      status: 'Pending',
      reference: 'TRF-001'
    },
    {
      id: 'MCT-005',
      date: '2024-09-15',
      type: 'Purchase',
      description: 'Machinery Import from Germany',
      fromCurrency: 'EUR',
      toCurrency: 'AED',
      fromAmount: 15000,
      toAmount: 60300,
      exchangeRate: 4.02,
      realizedGainLoss: -300,
      unrealizedGainLoss: 0,
      vendor: 'Deutsche Maschinen GmbH',
      status: 'Completed',
      reference: 'PO-EUR-015'
    }
  ];

  // Multi-Currency Balances
  const currencyBalances = [
    {
      currency: 'AED',
      name: 'UAE Dirham',
      symbol: 'AED',
      balance: 125450.75,
      equivalentAED: 125450.75,
      accountType: 'Operating',
      lastTransaction: '2024-09-30'
    },
    {
      currency: 'USD',
      name: 'US Dollar',
      symbol: '$',
      balance: 15250.00,
      equivalentAED: 56043.75,
      accountType: 'Operating',
      lastTransaction: '2024-09-30'
    },
    {
      currency: 'EUR',
      name: 'Euro',
      symbol: '€',
      balance: 8750.50,
      equivalentAED: 35175.01,
      accountType: 'Operating',
      lastTransaction: '2024-09-28'
    },
    {
      currency: 'GBP',
      name: 'British Pound',
      symbol: '£',
      balance: 3250.75,
      equivalentAED: 15943.93,
      accountType: 'Operating',
      lastTransaction: '2024-09-25'
    },
    {
      currency: 'SAR',
      name: 'Saudi Riyal',
      symbol: 'SR',
      balance: 12500.00,
      equivalentAED: 12250.00,
      accountType: 'Operating',
      lastTransaction: '2024-09-22'
    }
  ];

  // Currency Exposure Analysis
  const exposureAnalysis = [
    {
      currency: 'USD',
      totalAssets: 56043.75,
      totalLiabilities: 18375.00,
      netExposure: 37668.75,
      riskLevel: 'Medium',
      hedgeRatio: 0.65
    },
    {
      currency: 'EUR',
      totalAssets: 35175.01,
      totalLiabilities: 60300.00,
      netExposure: -25124.99,
      riskLevel: 'High',
      hedgeRatio: 0.30
    },
    {
      currency: 'GBP',
      totalAssets: 15943.93,
      totalLiabilities: 0,
      netExposure: 15943.93,
      riskLevel: 'Low',
      hedgeRatio: 0.80
    },
    {
      currency: 'SAR',
      totalAssets: 12250.00,
      totalLiabilities: 0,
      netExposure: 12250.00,
      riskLevel: 'Low',
      hedgeRatio: 0.90
    }
  ];

  const formatCurrency = (amount: number, currency: string, symbol: string) => {
    return `${symbol} ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const formatAED = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const getTransactionTypeBadge = (type: string) => {
    const typeConfig = {
      'Sale': 'bg-green-100 text-green-800',
      'Purchase': 'bg-blue-100 text-blue-800',
      'Transfer': 'bg-purple-100 text-purple-800',
      'Exchange': 'bg-orange-100 text-orange-800'
    };
    return typeConfig[type as keyof typeof typeConfig] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getRiskLevelBadge = (level: string) => {
    const riskConfig = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };
    return riskConfig[level as keyof typeof riskConfig] || 'bg-gray-100 text-gray-800';
  };

  const getCurrencyIcon = (currency: string) => {
    const iconConfig = {
      'USD': DollarSign,
      'EUR': Euro,
      'GBP': PoundSterling,
      'AED': Banknote,
      'SAR': Banknote,
      'JPY': Banknote
    };
    return iconConfig[currency as keyof typeof iconConfig] || Banknote;
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEquivalentAED = currencyBalances.reduce((sum, balance) => sum + balance.equivalentAED, 0);
  const totalUnrealizedGainLoss = transactions.reduce((sum, transaction) => sum + transaction.unrealizedGainLoss, 0);
  const totalRealizedGainLoss = transactions.reduce((sum, transaction) => sum + transaction.realizedGainLoss, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Globe className="h-8 w-8 text-amber-600" />
            Multi-Currency Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage foreign exchange, currency exposures, and international transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Rates
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isExchangeRateOpen} onOpenChange={setIsExchangeRateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calculator className="h-4 w-4" />
                Currency Calculator
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Currency Calculator</DialogTitle>
                <DialogDescription>
                  Convert between different currencies using current exchange rates
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-currency">From Currency</Label>
                    <Select defaultValue="AED">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-currency">To Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="1000" defaultValue="1000" />
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center">
                    <ArrowLeftRight className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-2xl font-bold">USD 272.11</div>
                    <div className="text-sm text-gray-600">Exchange Rate: 1 AED = 0.2721 USD</div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExchangeRateOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Multi-Currency Transaction</DialogTitle>
                <DialogDescription>
                  Record a new foreign exchange transaction
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transaction-type">Transaction Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="exchange">Exchange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transaction-date">Date</Label>
                    <Input id="transaction-date" type="date" defaultValue="2024-09-30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Transaction description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-currency">From Currency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-currency">To Currency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-amount">From Amount</Label>
                    <Input id="from-amount" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exchange-rate">Exchange Rate</Label>
                    <Input id="exchange-rate" type="number" placeholder="3.675" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-amount">To Amount</Label>
                    <Input id="to-amount" type="number" placeholder="0.00" readonly />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddTransactionOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Create Transaction
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Balance (AED Equivalent)
            </CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(totalEquivalentAED)}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Across {currencyBalances.length} currencies
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Unrealized Gain/Loss
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalUnrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalUnrealizedGainLoss >= 0 ? '+' : ''}{formatAED(totalUnrealizedGainLoss)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Mark-to-market valuation
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Realized Gain/Loss
            </CardTitle>
            <Calculator className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalRealizedGainLoss >= 0 ? '+' : ''}{formatAED(totalRealizedGainLoss)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Exchange Rate Variance
            </CardTitle>
            <LineChart className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ±2.4%
            </div>
            <p className="text-xs text-orange-600 mt-1">
              30-day volatility average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="rates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rates" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Exchange Rates
          </TabsTrigger>
          <TabsTrigger value="balances" className="flex items-center">
            <Banknote className="h-4 w-4 mr-2" />
            Currency Balances
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="exposure" className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Exposure Analysis
          </TabsTrigger>
          <TabsTrigger value="reporting" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            FX Reporting
          </TabsTrigger>
        </TabsList>

        {/* Exchange Rates Tab */}
        <TabsContent value="rates">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-amber-600" />
                Current Exchange Rates
              </CardTitle>
              <CardDescription>
                Real-time exchange rates from Central Bank UAE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Currency</TableHead>
                      <TableHead>Buy Rate</TableHead>
                      <TableHead>Sell Rate</TableHead>
                      <TableHead>Mid Rate</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Change %</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exchangeRates.map((rate) => {
                      const Icon = getCurrencyIcon(rate.currency);
                      return (
                        <TableRow key={rate.currency}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{rate.currency}</div>
                                <div className="text-sm text-gray-500">{rate.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{rate.buyRate.toFixed(4)}</TableCell>
                          <TableCell className="font-medium">{rate.sellRate.toFixed(4)}</TableCell>
                          <TableCell className="font-medium">{rate.midRate.toFixed(4)}</TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-1 ${
                              rate.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {rate.trend === 'up' ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(4)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              rate.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {rate.changePercent >= 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {rate.lastUpdated}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Calculator className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Exchange Rate Information</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Rates are updated every 30 minutes during business hours and sourced from Central Bank UAE.
                      All rates are quoted against AED. Use the currency calculator for quick conversions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Currency Balances Tab */}
        <TabsContent value="balances">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Banknote className="h-5 w-5 mr-2 text-amber-600" />
                Multi-Currency Balances
              </CardTitle>
              <CardDescription>
                Current balances across all currency accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Currency</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>AED Equivalent</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Last Transaction</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currencyBalances.map((balance) => {
                      const Icon = getCurrencyIcon(balance.currency);
                      return (
                        <TableRow key={balance.currency}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{balance.currency}</div>
                                <div className="text-sm text-gray-500">{balance.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(balance.balance, balance.currency, balance.symbol)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatAED(balance.equivalentAED)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{balance.accountType}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {balance.lastTransaction}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <ArrowLeftRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">Strongest Currency</h3>
                  <p className="text-2xl font-bold text-green-600">USD</p>
                  <p className="text-sm text-green-700">+0.068% today</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900">Weakest Currency</h3>
                  <p className="text-2xl font-bold text-red-600">JPY</p>
                  <p className="text-sm text-red-700">-1.203% today</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Largest Exposure</h3>
                  <p className="text-2xl font-bold text-blue-600">AED</p>
                  <p className="text-sm text-blue-700">54.1% of total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowLeftRight className="h-5 w-5 mr-2 text-amber-600" />
                Multi-Currency Transactions
              </CardTitle>
              <CardDescription>
                Foreign exchange transactions and currency conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterCurrency} onValueChange={setFilterCurrency}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Currencies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="SAR">SAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>From → To</TableHead>
                      <TableHead>Exchange Rate</TableHead>
                      <TableHead>Realized G/L</TableHead>
                      <TableHead>Unrealized G/L</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Badge className={getTransactionTypeBadge(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-500">{transaction.reference}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {transaction.fromCurrency} {transaction.fromAmount?.toLocaleString() || "0"}
                            </div>
                            <ArrowLeftRight className="h-3 w-3 text-gray-400" />
                            <div className="text-sm">
                              {transaction.toCurrency} {transaction.toAmount?.toLocaleString() || "0"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.exchangeRate.toFixed(4)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            transaction.realizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.realizedGainLoss >= 0 ? '+' : ''}
                            {formatAED(transaction.realizedGainLoss)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            transaction.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.unrealizedGainLoss >= 0 ? '+' : ''}
                            {formatAED(transaction.unrealizedGainLoss)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exposure Analysis Tab */}
        <TabsContent value="exposure">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                Currency Exposure Analysis
              </CardTitle>
              <CardDescription>
                Risk assessment and exposure management across currencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Currency</TableHead>
                      <TableHead>Total Assets</TableHead>
                      <TableHead>Total Liabilities</TableHead>
                      <TableHead>Net Exposure</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Hedge Ratio</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exposureAnalysis.map((exposure) => (
                      <TableRow key={exposure.currency}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{exposure.currency}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatAED(exposure.totalAssets)}
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          {formatAED(exposure.totalLiabilities)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            exposure.netExposure >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatAED(Math.abs(exposure.netExposure))}
                            {exposure.netExposure < 0 ? ' (Liability)' : ' (Asset)'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskLevelBadge(exposure.riskLevel)}>
                            {exposure.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {(exposure.hedgeRatio * 100).toFixed(0)}%
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-blue-500 h-1 rounded-full"
                                style={{width: `${exposure.hedgeRatio * 100}%`}}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Hedge
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-4">Risk Management Recommendations</h3>
                  <ul className="space-y-2 text-sm text-amber-700">
                    <li>• Consider hedging EUR exposure due to high liability position</li>
                    <li>• USD exposure is well-balanced with good hedge ratio</li>
                    <li>• Monitor GBP volatility for potential hedge adjustment</li>
                    <li>• SAR exposure is minimal due to currency peg stability</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-4">Hedging Strategies</h3>
                  <div className="space-y-3 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>Forward Contracts:</span>
                      <span className="font-medium">65% Coverage</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currency Options:</span>
                      <span className="font-medium">15% Coverage</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Natural Hedging:</span>
                      <span className="font-medium">20% Coverage</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FX Reporting Tab */}
        <TabsContent value="reporting">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-amber-600" />
                  FX Performance
                </CardTitle>
                <CardDescription>
                  Foreign exchange gains and losses analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">FX Performance Chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Currency Statistics</CardTitle>
                <CardDescription>
                  Key metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">FX Efficiency Ratio</span>
                      <span className="text-green-600 font-bold">94.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '94.2%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Hedge Effectiveness</span>
                      <span className="text-blue-600 font-bold">87.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '87.5%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Volatility Index</span>
                      <span className="text-orange-600 font-bold">2.4%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '24%'}}></div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Monthly Summary</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Total FX Transactions:</span>
                        <span className="font-medium">43</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Realized Gains:</span>
                        <span className="font-medium">{formatAED(Math.abs(totalRealizedGainLoss))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Spread:</span>
                        <span className="font-medium">0.15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}