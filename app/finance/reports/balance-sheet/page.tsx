'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Scale,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Building,
  DollarSign,
  Percent,
  FileText,
  Eye,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart
} from 'lucide-react';

export default function BalanceSheetPage() {
  const [selectedDate, setSelectedDate] = useState('current');
  const [comparisonDate, setComparisonDate] = useState('previous-month');
  const [viewType, setViewType] = useState('detailed');

  // Balance Sheet Data
  const balanceSheetData = {
    'current': {
      date: 'September 30, 2024',
      assets: {
        currentAssets: {
          cashAndEquivalents: 125450.75,
          accountsReceivable: 45000.00,
          inventory: 185000.00,
          prepaidExpenses: 8000.00,
          otherCurrentAssets: 5250.00,
          total: 368700.75
        },
        nonCurrentAssets: {
          propertyPlantEquipment: 125000.00,
          accumulatedDepreciation: -22500.00,
          netPPE: 102500.00,
          intangibleAssets: 15000.00,
          goodwill: 25000.00,
          investments: 18500.00,
          otherAssets: 3250.00,
          total: 164250.00
        },
        totalAssets: 532950.75
      },
      liabilities: {
        currentLiabilities: {
          accountsPayable: 28000.00,
          shortTermDebt: 15000.00,
          accruedExpenses: 12500.00,
          vatPayable: 4500.00,
          otherCurrentLiabilities: 6750.00,
          total: 66750.00
        },
        nonCurrentLiabilities: {
          longTermDebt: 85000.00,
          deferredTaxLiabilities: 0,
          otherLongTermLiabilities: 8500.00,
          total: 93500.00
        },
        totalLiabilities: 160250.00
      },
      equity: {
        paidInCapital: 300000.00,
        retainedEarnings: 72700.75,
        totalEquity: 372700.75
      }
    },
    'previous-month': {
      date: 'August 31, 2024',
      assets: {
        currentAssets: {
          cashAndEquivalents: 98750.25,
          accountsReceivable: 38500.00,
          inventory: 172000.00,
          prepaidExpenses: 9500.00,
          otherCurrentAssets: 4850.00,
          total: 323600.25
        },
        nonCurrentAssets: {
          propertyPlantEquipment: 125000.00,
          accumulatedDepreciation: -20000.00,
          netPPE: 105000.00,
          intangibleAssets: 15000.00,
          goodwill: 25000.00,
          investments: 18500.00,
          otherAssets: 3250.00,
          total: 166750.00
        },
        totalAssets: 490350.25
      },
      liabilities: {
        currentLiabilities: {
          accountsPayable: 32500.00,
          shortTermDebt: 18000.00,
          accruedExpenses: 11200.00,
          vatPayable: 3950.00,
          otherCurrentLiabilities: 5980.00,
          total: 71630.00
        },
        nonCurrentLiabilities: {
          longTermDebt: 90000.00,
          deferredTaxLiabilities: 0,
          otherLongTermLiabilities: 8500.00,
          total: 98500.00
        },
        totalLiabilities: 170130.00
      },
      equity: {
        paidInCapital: 300000.00,
        retainedEarnings: 20220.25,
        totalEquity: 320220.25
      }
    }
  };

  const currentData = balanceSheetData[selectedDate as keyof typeof balanceSheetData];
  const comparisonData = balanceSheetData[comparisonDate as keyof typeof balanceSheetData];

  // Financial Ratios
  const ratios = {
    currentRatio: currentData.assets.currentAssets.total / currentData.liabilities.currentLiabilities.total,
    quickRatio: (currentData.assets.currentAssets.total - currentData.assets.currentAssets.inventory) / currentData.liabilities.currentLiabilities.total,
    debtToEquity: currentData.liabilities.totalLiabilities / currentData.equity.totalEquity,
    debtToAssets: currentData.liabilities.totalLiabilities / currentData.assets.totalAssets,
    assetTurnover: 110580 / currentData.assets.totalAssets, // Using revenue from P&L
    equityMultiplier: currentData.assets.totalAssets / currentData.equity.totalEquity,
    workingCapital: currentData.assets.currentAssets.total - currentData.liabilities.currentLiabilities.total
  };

  // Variance Analysis
  const variance = {
    totalAssets: {
      amount: currentData.assets.totalAssets - comparisonData.assets.totalAssets,
      percentage: ((currentData.assets.totalAssets - comparisonData.assets.totalAssets) / comparisonData.assets.totalAssets) * 100
    },
    totalLiabilities: {
      amount: currentData.liabilities.totalLiabilities - comparisonData.liabilities.totalLiabilities,
      percentage: ((currentData.liabilities.totalLiabilities - comparisonData.liabilities.totalLiabilities) / comparisonData.liabilities.totalLiabilities) * 100
    },
    totalEquity: {
      amount: currentData.equity.totalEquity - comparisonData.equity.totalEquity,
      percentage: ((currentData.equity.totalEquity - comparisonData.equity.totalEquity) / comparisonData.equity.totalEquity) * 100
    },
    workingCapital: {
      amount: ratios.workingCapital - (comparisonData.assets.currentAssets.total - comparisonData.liabilities.currentLiabilities.total),
      percentage: ((ratios.workingCapital - (comparisonData.assets.currentAssets.total - comparisonData.liabilities.currentLiabilities.total)) / (comparisonData.assets.currentAssets.total - comparisonData.liabilities.currentLiabilities.total)) * 100
    }
  };

  const formatAED = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const formatRatio = (ratio: number) => {
    return ratio.toFixed(2);
  };

  const getVarianceColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getVarianceIcon = (amount: number) => {
    return amount >= 0 ? TrendingUp : TrendingDown;
  };

  const getRatioHealth = (ratio: number, type: string) => {
    switch (type) {
      case 'current':
        if (ratio >= 2) return { color: 'text-green-600', status: 'Excellent' };
        if (ratio >= 1.5) return { color: 'text-blue-600', status: 'Good' };
        if (ratio >= 1) return { color: 'text-orange-600', status: 'Fair' };
        return { color: 'text-red-600', status: 'Poor' };
      case 'debt-equity':
        if (ratio <= 0.3) return { color: 'text-green-600', status: 'Excellent' };
        if (ratio <= 0.5) return { color: 'text-blue-600', status: 'Good' };
        if (ratio <= 0.7) return { color: 'text-orange-600', status: 'Fair' };
        return { color: 'text-red-600', status: 'Poor' };
      default:
        return { color: 'text-gray-600', status: 'N/A' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Scale className="h-8 w-8 text-amber-600" />
            Balance Sheet
          </h1>
          <p className="text-muted-foreground mt-1">
            Statement of financial position showing assets, liabilities, and equity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Email Report
          </Button>
          <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
            <Eye className="h-4 w-4" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Date Selection & Controls */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-amber-600" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">As of Date</label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current (Sep 30, 2024)</SelectItem>
                  <SelectItem value="previous-month">Previous Month</SelectItem>
                  <SelectItem value="previous-quarter">Previous Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Compare With</label>
              <Select value={comparisonDate} onValueChange={setComparisonDate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous-month">Previous Month</SelectItem>
                  <SelectItem value="previous-quarter">Previous Quarter</SelectItem>
                  <SelectItem value="previous-year">Previous Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">View Type</label>
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="comparative">Comparative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select defaultValue="aed">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aed">AED</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Assets
            </CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(currentData.assets.totalAssets)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getVarianceIcon(variance.totalAssets.amount), {
                className: `h-3 w-3 ${getVarianceColor(variance.totalAssets.amount)}`
              })}
              <span className={`text-xs font-medium ${getVarianceColor(variance.totalAssets.amount)}`}>
                {variance.totalAssets.amount >= 0 ? '+' : ''}{formatPercentage(variance.totalAssets.percentage)}
              </span>
              <span className="text-xs text-gray-600">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Liabilities
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(currentData.liabilities.totalLiabilities)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getVarianceIcon(variance.totalLiabilities.amount), {
                className: `h-3 w-3 ${getVarianceColor(-variance.totalLiabilities.amount)}`
              })}
              <span className={`text-xs font-medium ${getVarianceColor(-variance.totalLiabilities.amount)}`}>
                {variance.totalLiabilities.amount >= 0 ? '+' : ''}{formatPercentage(variance.totalLiabilities.percentage)}
              </span>
              <span className="text-xs text-gray-600">debt level</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Owner's Equity
            </CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(currentData.equity.totalEquity)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getVarianceIcon(variance.totalEquity.amount), {
                className: `h-3 w-3 ${getVarianceColor(variance.totalEquity.amount)}`
              })}
              <span className={`text-xs font-medium ${getVarianceColor(variance.totalEquity.amount)}`}>
                {variance.totalEquity.amount >= 0 ? '+' : ''}{formatPercentage(variance.totalEquity.percentage)}
              </span>
              <span className="text-xs text-gray-600">equity growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Working Capital
            </CardTitle>
            <Calculator className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(ratios.workingCapital)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getVarianceIcon(variance.workingCapital.amount), {
                className: `h-3 w-3 ${getVarianceColor(variance.workingCapital.amount)}`
              })}
              <span className={`text-xs font-medium ${getVarianceColor(variance.workingCapital.amount)}`}>
                {variance.workingCapital.amount >= 0 ? '+' : ''}{formatPercentage(variance.workingCapital.percentage)}
              </span>
              <span className="text-xs text-gray-600">liquidity position</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="statement" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="statement" className="flex items-center">
            <Scale className="h-4 w-4 mr-2" />
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Comparative Analysis
          </TabsTrigger>
          <TabsTrigger value="ratios" className="flex items-center">
            <Percent className="h-4 w-4 mr-2" />
            Financial Ratios
          </TabsTrigger>
          <TabsTrigger value="composition" className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            Asset Composition
          </TabsTrigger>
        </TabsList>

        {/* Balance Sheet Statement Tab */}
        <TabsContent value="statement">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2 text-amber-600" />
                Balance Sheet - As of {currentData.date}
              </CardTitle>
              <CardDescription>
                Statement of financial position showing company's assets, liabilities, and equity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Assets Section */}
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <Building className="h-6 w-6 mr-2" />
                    ASSETS
                  </h3>

                  {/* Current Assets */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-blue-700 mb-3">Current Assets</h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Cash and Cash Equivalents</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.assets.currentAssets.cashAndEquivalents)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Accounts Receivable</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.assets.currentAssets.accountsReceivable)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Inventory</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.assets.currentAssets.inventory)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Prepaid Expenses</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.assets.currentAssets.prepaidExpenses)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Other Current Assets</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.assets.currentAssets.otherCurrentAssets)}</TableCell>
                          </TableRow>
                          <TableRow className="border-t-2 border-blue-300 bg-blue-50">
                            <TableCell className="font-bold text-blue-900 pl-4">Total Current Assets</TableCell>
                            <TableCell className="text-right font-bold text-blue-900">
                              {formatAED(currentData.assets.currentAssets.total)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Non-Current Assets */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-blue-700 mb-3">Non-Current Assets</h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Property, Plant & Equipment</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.assets.nonCurrentAssets.propertyPlantEquipment)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-8 text-sm text-gray-600">Less: Accumulated Depreciation</TableCell>
                            <TableCell className="text-right text-red-600">{formatAED(currentData.assets.nonCurrentAssets.accumulatedDepreciation)}</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="font-medium pl-6">Net Property, Plant & Equipment</TableCell>
                            <TableCell className="text-right font-medium">{formatAED(currentData.assets.nonCurrentAssets.netPPE)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Intangible Assets</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.assets.nonCurrentAssets.intangibleAssets)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Goodwill</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.assets.nonCurrentAssets.goodwill)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Investments</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.assets.nonCurrentAssets.investments)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Other Assets</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.assets.nonCurrentAssets.otherAssets)}</TableCell>
                          </TableRow>
                          <TableRow className="border-t-2 border-blue-300 bg-blue-50">
                            <TableCell className="font-bold text-blue-900 pl-4">Total Non-Current Assets</TableCell>
                            <TableCell className="text-right font-bold text-blue-900">
                              {formatAED(currentData.assets.nonCurrentAssets.total)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Total Assets */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-blue-900">TOTAL ASSETS</h3>
                      <div className="text-2xl font-bold text-blue-900">
                        {formatAED(currentData.assets.totalAssets)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liabilities and Equity Section */}
                <div>
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center">
                    <DollarSign className="h-6 w-6 mr-2" />
                    LIABILITIES AND EQUITY
                  </h3>

                  {/* Current Liabilities */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-red-700 mb-3">Current Liabilities</h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Accounts Payable</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.liabilities.currentLiabilities.accountsPayable)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Short-term Debt</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.liabilities.currentLiabilities.shortTermDebt)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Accrued Expenses</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.liabilities.currentLiabilities.accruedExpenses)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">VAT Payable</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.liabilities.currentLiabilities.vatPayable)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Other Current Liabilities</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.liabilities.currentLiabilities.otherCurrentLiabilities)}</TableCell>
                          </TableRow>
                          <TableRow className="border-t-2 border-red-300 bg-red-50">
                            <TableCell className="font-bold text-red-900 pl-4">Total Current Liabilities</TableCell>
                            <TableCell className="text-right font-bold text-red-900">
                              {formatAED(currentData.liabilities.currentLiabilities.total)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Non-Current Liabilities */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-red-700 mb-3">Non-Current Liabilities</h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Long-term Debt</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.liabilities.nonCurrentLiabilities.longTermDebt)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Other Long-term Liabilities</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.liabilities.nonCurrentLiabilities.otherLongTermLiabilities)}</TableCell>
                          </TableRow>
                          <TableRow className="border-t-2 border-red-300 bg-red-50">
                            <TableCell className="font-bold text-red-900 pl-4">Total Non-Current Liabilities</TableCell>
                            <TableCell className="text-right font-bold text-red-900">
                              {formatAED(currentData.liabilities.nonCurrentLiabilities.total)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Total Liabilities */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-bold text-red-900">TOTAL LIABILITIES</h4>
                      <div className="text-xl font-bold text-red-900">
                        {formatAED(currentData.liabilities.totalLiabilities)}
                      </div>
                    </div>
                  </div>

                  {/* Equity */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-green-700 mb-3">Owner's Equity</h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Paid-in Capital</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.equity.paidInCapital)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium pl-6">Retained Earnings</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.equity.retainedEarnings)}</TableCell>
                          </TableRow>
                          <TableRow className="border-t-2 border-green-300 bg-green-50">
                            <TableCell className="font-bold text-green-900 pl-4">Total Owner's Equity</TableCell>
                            <TableCell className="text-right font-bold text-green-900">
                              {formatAED(currentData.equity.totalEquity)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Total Liabilities and Equity */}
                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-amber-900">TOTAL LIABILITIES AND EQUITY</h3>
                      <div className="text-3xl font-bold text-amber-900">
                        {formatAED(currentData.liabilities.totalLiabilities + currentData.equity.totalEquity)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparative Analysis Tab */}
        <TabsContent value="analysis">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                Comparative Analysis - {currentData.date} vs {comparisonData.date}
              </CardTitle>
              <CardDescription>
                Compare balance sheet items between current and previous periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Current Period</TableHead>
                      <TableHead className="text-right">Previous Period</TableHead>
                      <TableHead className="text-right">Change (AED)</TableHead>
                      <TableHead className="text-right">Change (%)</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-bold text-blue-900">ASSETS</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium pl-4">Cash and Cash Equivalents</TableCell>
                      <TableCell className="text-right">{formatAED(currentData.assets.currentAssets.cashAndEquivalents)}</TableCell>
                      <TableCell className="text-right">{formatAED(comparisonData.assets.currentAssets.cashAndEquivalents)}</TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(currentData.assets.currentAssets.cashAndEquivalents - comparisonData.assets.currentAssets.cashAndEquivalents)}`}>
                        {currentData.assets.currentAssets.cashAndEquivalents - comparisonData.assets.currentAssets.cashAndEquivalents >= 0 ? '+' : ''}
                        {formatAED(currentData.assets.currentAssets.cashAndEquivalents - comparisonData.assets.currentAssets.cashAndEquivalents)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(currentData.assets.currentAssets.cashAndEquivalents - comparisonData.assets.currentAssets.cashAndEquivalents)}`}>
                        {((currentData.assets.currentAssets.cashAndEquivalents - comparisonData.assets.currentAssets.cashAndEquivalents) / comparisonData.assets.currentAssets.cashAndEquivalents * 100) >= 0 ? '+' : ''}
                        {formatPercentage((currentData.assets.currentAssets.cashAndEquivalents - comparisonData.assets.currentAssets.cashAndEquivalents) / comparisonData.assets.currentAssets.cashAndEquivalents * 100)}
                      </TableCell>
                      <TableCell>
                        {React.createElement(getVarianceIcon(currentData.assets.currentAssets.cashAndEquivalents - comparisonData.assets.currentAssets.cashAndEquivalents), {
                          className: `h-4 w-4 ${getVarianceColor(currentData.assets.currentAssets.cashAndEquivalents - comparisonData.assets.currentAssets.cashAndEquivalents)}`
                        })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium pl-4">Accounts Receivable</TableCell>
                      <TableCell className="text-right">{formatAED(currentData.assets.currentAssets.accountsReceivable)}</TableCell>
                      <TableCell className="text-right">{formatAED(comparisonData.assets.currentAssets.accountsReceivable)}</TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(currentData.assets.currentAssets.accountsReceivable - comparisonData.assets.currentAssets.accountsReceivable)}`}>
                        {currentData.assets.currentAssets.accountsReceivable - comparisonData.assets.currentAssets.accountsReceivable >= 0 ? '+' : ''}
                        {formatAED(currentData.assets.currentAssets.accountsReceivable - comparisonData.assets.currentAssets.accountsReceivable)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(currentData.assets.currentAssets.accountsReceivable - comparisonData.assets.currentAssets.accountsReceivable)}`}>
                        {((currentData.assets.currentAssets.accountsReceivable - comparisonData.assets.currentAssets.accountsReceivable) / comparisonData.assets.currentAssets.accountsReceivable * 100) >= 0 ? '+' : ''}
                        {formatPercentage((currentData.assets.currentAssets.accountsReceivable - comparisonData.assets.currentAssets.accountsReceivable) / comparisonData.assets.currentAssets.accountsReceivable * 100)}
                      </TableCell>
                      <TableCell>
                        {React.createElement(getVarianceIcon(currentData.assets.currentAssets.accountsReceivable - comparisonData.assets.currentAssets.accountsReceivable), {
                          className: `h-4 w-4 ${getVarianceColor(currentData.assets.currentAssets.accountsReceivable - comparisonData.assets.currentAssets.accountsReceivable)}`
                        })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium pl-4">Inventory</TableCell>
                      <TableCell className="text-right">{formatAED(currentData.assets.currentAssets.inventory)}</TableCell>
                      <TableCell className="text-right">{formatAED(comparisonData.assets.currentAssets.inventory)}</TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(currentData.assets.currentAssets.inventory - comparisonData.assets.currentAssets.inventory)}`}>
                        {currentData.assets.currentAssets.inventory - comparisonData.assets.currentAssets.inventory >= 0 ? '+' : ''}
                        {formatAED(currentData.assets.currentAssets.inventory - comparisonData.assets.currentAssets.inventory)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(currentData.assets.currentAssets.inventory - comparisonData.assets.currentAssets.inventory)}`}>
                        {((currentData.assets.currentAssets.inventory - comparisonData.assets.currentAssets.inventory) / comparisonData.assets.currentAssets.inventory * 100) >= 0 ? '+' : ''}
                        {formatPercentage((currentData.assets.currentAssets.inventory - comparisonData.assets.currentAssets.inventory) / comparisonData.assets.currentAssets.inventory * 100)}
                      </TableCell>
                      <TableCell>
                        {React.createElement(getVarianceIcon(currentData.assets.currentAssets.inventory - comparisonData.assets.currentAssets.inventory), {
                          className: `h-4 w-4 ${getVarianceColor(currentData.assets.currentAssets.inventory - comparisonData.assets.currentAssets.inventory)}`
                        })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-t bg-blue-100">
                      <TableCell className="font-bold text-blue-900">Total Assets</TableCell>
                      <TableCell className="text-right font-bold">{formatAED(currentData.assets.totalAssets)}</TableCell>
                      <TableCell className="text-right font-bold">{formatAED(comparisonData.assets.totalAssets)}</TableCell>
                      <TableCell className={`text-right font-bold ${getVarianceColor(variance.totalAssets.amount)}`}>
                        {variance.totalAssets.amount >= 0 ? '+' : ''}{formatAED(variance.totalAssets.amount)}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${getVarianceColor(variance.totalAssets.amount)}`}>
                        {variance.totalAssets.amount >= 0 ? '+' : ''}{formatPercentage(variance.totalAssets.percentage)}
                      </TableCell>
                      <TableCell>
                        {React.createElement(getVarianceIcon(variance.totalAssets.amount), {
                          className: `h-4 w-4 ${getVarianceColor(variance.totalAssets.amount)}`
                        })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="bg-red-50">
                      <TableCell className="font-bold text-red-900">LIABILITIES</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium pl-4">Accounts Payable</TableCell>
                      <TableCell className="text-right">{formatAED(currentData.liabilities.currentLiabilities.accountsPayable)}</TableCell>
                      <TableCell className="text-right">{formatAED(comparisonData.liabilities.currentLiabilities.accountsPayable)}</TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(-(currentData.liabilities.currentLiabilities.accountsPayable - comparisonData.liabilities.currentLiabilities.accountsPayable))}`}>
                        {currentData.liabilities.currentLiabilities.accountsPayable - comparisonData.liabilities.currentLiabilities.accountsPayable >= 0 ? '+' : ''}
                        {formatAED(currentData.liabilities.currentLiabilities.accountsPayable - comparisonData.liabilities.currentLiabilities.accountsPayable)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(-(currentData.liabilities.currentLiabilities.accountsPayable - comparisonData.liabilities.currentLiabilities.accountsPayable))}`}>
                        {((currentData.liabilities.currentLiabilities.accountsPayable - comparisonData.liabilities.currentLiabilities.accountsPayable) / comparisonData.liabilities.currentLiabilities.accountsPayable * 100) >= 0 ? '+' : ''}
                        {formatPercentage((currentData.liabilities.currentLiabilities.accountsPayable - comparisonData.liabilities.currentLiabilities.accountsPayable) / comparisonData.liabilities.currentLiabilities.accountsPayable * 100)}
                      </TableCell>
                      <TableCell>
                        {React.createElement(getVarianceIcon(currentData.liabilities.currentLiabilities.accountsPayable - comparisonData.liabilities.currentLiabilities.accountsPayable), {
                          className: `h-4 w-4 ${getVarianceColor(-(currentData.liabilities.currentLiabilities.accountsPayable - comparisonData.liabilities.currentLiabilities.accountsPayable))}`
                        })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-t bg-red-100">
                      <TableCell className="font-bold text-red-900">Total Liabilities</TableCell>
                      <TableCell className="text-right font-bold">{formatAED(currentData.liabilities.totalLiabilities)}</TableCell>
                      <TableCell className="text-right font-bold">{formatAED(comparisonData.liabilities.totalLiabilities)}</TableCell>
                      <TableCell className={`text-right font-bold ${getVarianceColor(-variance.totalLiabilities.amount)}`}>
                        {variance.totalLiabilities.amount >= 0 ? '+' : ''}{formatAED(variance.totalLiabilities.amount)}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${getVarianceColor(-variance.totalLiabilities.amount)}`}>
                        {variance.totalLiabilities.amount >= 0 ? '+' : ''}{formatPercentage(variance.totalLiabilities.percentage)}
                      </TableCell>
                      <TableCell>
                        {React.createElement(getVarianceIcon(variance.totalLiabilities.amount), {
                          className: `h-4 w-4 ${getVarianceColor(-variance.totalLiabilities.amount)}`
                        })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-t bg-green-100">
                      <TableCell className="font-bold text-green-900">Total Equity</TableCell>
                      <TableCell className="text-right font-bold">{formatAED(currentData.equity.totalEquity)}</TableCell>
                      <TableCell className="text-right font-bold">{formatAED(comparisonData.equity.totalEquity)}</TableCell>
                      <TableCell className={`text-right font-bold ${getVarianceColor(variance.totalEquity.amount)}`}>
                        {variance.totalEquity.amount >= 0 ? '+' : ''}{formatAED(variance.totalEquity.amount)}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${getVarianceColor(variance.totalEquity.amount)}`}>
                        {variance.totalEquity.amount >= 0 ? '+' : ''}{formatPercentage(variance.totalEquity.percentage)}
                      </TableCell>
                      <TableCell>
                        {React.createElement(getVarianceIcon(variance.totalEquity.amount), {
                          className: `h-4 w-4 ${getVarianceColor(variance.totalEquity.amount)}`
                        })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Positive Changes</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Cash position improved by {formatPercentage(((currentData.assets.currentAssets.cashAndEquivalents - comparisonData.assets.currentAssets.cashAndEquivalents) / comparisonData.assets.currentAssets.cashAndEquivalents * 100))}</li>
                    <li>• Equity increased by {formatPercentage(variance.totalEquity.percentage)}</li>
                    <li>• Working capital strengthened</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Areas of Focus</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Inventory levels increased</li>
                    <li>• Accounts receivable growth</li>
                    <li>• Monitor debt levels</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Overall financial position improved</li>
                    <li>• Asset base expansion</li>
                    <li>• Sustainable growth pattern</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Ratios Tab */}
        <TabsContent value="ratios">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="h-5 w-5 mr-2 text-amber-600" />
                  Liquidity Ratios
                </CardTitle>
                <CardDescription>
                  Measure of company's ability to meet short-term obligations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Current Ratio</span>
                      <div className="text-right">
                        <span className={`font-bold ${getRatioHealth(ratios.currentRatio, 'current').color}`}>
                          {formatRatio(ratios.currentRatio)}
                        </span>
                        <div className="text-xs text-gray-600">
                          {getRatioHealth(ratios.currentRatio, 'current').status}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.min(ratios.currentRatio * 25, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">Target: > 2.0 (Current: {formatRatio(ratios.currentRatio)})</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Quick Ratio</span>
                      <div className="text-right">
                        <span className="font-bold text-purple-600">{formatRatio(ratios.quickRatio)}</span>
                        <div className="text-xs text-gray-600">
                          {ratios.quickRatio >= 1 ? 'Good' : 'Poor'}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: `${Math.min(ratios.quickRatio * 50, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">Target: > 1.0 (Excludes inventory)</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Working Capital</span>
                      <span className="font-bold text-green-600">{formatAED(ratios.workingCapital)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <p className="text-sm text-gray-600">Strong liquidity position</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Leverage Ratios</CardTitle>
                <CardDescription>
                  Measure of company's financial leverage and risk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Debt-to-Equity Ratio</span>
                      <div className="text-right">
                        <span className={`font-bold ${getRatioHealth(ratios.debtToEquity, 'debt-equity').color}`}>
                          {formatRatio(ratios.debtToEquity)}
                        </span>
                        <div className="text-xs text-gray-600">
                          {getRatioHealth(ratios.debtToEquity, 'debt-equity').status}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: `${Math.min(ratios.debtToEquity * 100, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">Target: < 0.5 (Lower is better)</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Debt-to-Assets Ratio</span>
                      <div className="text-right">
                        <span className="font-bold text-red-600">{formatPercentage(ratios.debtToAssets * 100)}</span>
                        <div className="text-xs text-gray-600">
                          {ratios.debtToAssets < 0.4 ? 'Good' : 'High'}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{width: `${ratios.debtToAssets * 100}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">Debt as % of total assets</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Equity Multiplier</span>
                      <span className="font-bold text-blue-600">{formatRatio(ratios.equityMultiplier)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.min(ratios.equityMultiplier * 33, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">Assets per unit of equity</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100 lg:col-span-2">
              <CardHeader>
                <CardTitle>Financial Health Summary</CardTitle>
                <CardDescription>
                  Overall assessment based on balance sheet ratios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Liquidity Assessment</h4>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Strong</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Current ratio of {formatRatio(ratios.currentRatio)} indicates excellent ability to meet short-term obligations.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Leverage Assessment</h4>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Moderate</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Debt-to-equity ratio of {formatRatio(ratios.debtToEquity)} shows balanced capital structure.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Overall Health</h4>
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-amber-600" />
                        <span className="font-medium text-amber-900">Healthy</span>
                      </div>
                      <p className="text-sm text-amber-700">
                        Strong balance sheet with good liquidity and manageable debt levels.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Key Recommendations</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <span>Maintain current liquidity levels to ensure operational flexibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <span>Monitor inventory turnover to optimize working capital</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <span>Consider debt reduction to further improve financial stability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <span>Focus on collecting accounts receivable to improve cash flow</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Asset Composition Tab */}
        <TabsContent value="composition">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-amber-600" />
                  Asset Composition
                </CardTitle>
                <CardDescription>
                  Breakdown of total assets by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Asset Composition Chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Capital Structure</CardTitle>
                <CardDescription>
                  Sources of financing and capital composition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Asset Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Current Assets</span>
                        <span className="font-medium">{formatPercentage((currentData.assets.currentAssets.total / currentData.assets.totalAssets) * 100)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(currentData.assets.currentAssets.total / currentData.assets.totalAssets) * 100}%`}}></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Non-Current Assets</span>
                        <span className="font-medium">{formatPercentage((currentData.assets.nonCurrentAssets.total / currentData.assets.totalAssets) * 100)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: `${(currentData.assets.nonCurrentAssets.total / currentData.assets.totalAssets) * 100}%`}}></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Financing Structure</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Debt Financing</span>
                        <span className="font-medium">{formatPercentage((currentData.liabilities.totalLiabilities / currentData.assets.totalAssets) * 100)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: `${(currentData.liabilities.totalLiabilities / currentData.assets.totalAssets) * 100}%`}}></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Equity Financing</span>
                        <span className="font-medium">{formatPercentage((currentData.equity.totalEquity / currentData.assets.totalAssets) * 100)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${(currentData.equity.totalEquity / currentData.assets.totalAssets) * 100}%`}}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-900 mb-2">Composition Analysis</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• {formatPercentage((currentData.assets.currentAssets.total / currentData.assets.totalAssets) * 100)} of assets are current (liquid)</li>
                      <li>• {formatPercentage((currentData.equity.totalEquity / currentData.assets.totalAssets) * 100)} equity-financed operations</li>
                      <li>• Balanced asset composition for operations</li>
                      <li>• Conservative financing structure</li>
                    </ul>
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