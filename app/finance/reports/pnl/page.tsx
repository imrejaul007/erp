'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  FileText,
  Eye,
  Filter,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function PnLStatementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous-month');
  const [viewType, setViewType] = useState('detailed');

  // P&L Data Structure
  const pnlData = {
    'current-month': {
      period: 'September 2024',
      revenue: {
        salesRevenue: 89230.00,
        exportSales: 18500.00,
        otherRevenue: 2850.00,
        total: 110580.00
      },
      costOfGoodsSold: {
        rawMaterials: 25000.00,
        directLabor: 8500.00,
        manufacturingOverhead: 5200.00,
        total: 38700.00
      },
      grossProfit: 71880.00,
      operatingExpenses: {
        salariesAndWages: 15000.00,
        rent: 8000.00,
        utilities: 2200.00,
        marketing: 3150.00,
        insurance: 1200.00,
        depreciation: 2500.00,
        officeExpenses: 850.00,
        professionalFees: 1500.00,
        other: 1250.00,
        total: 35650.00
      },
      operatingIncome: 36230.00,
      otherIncomeExpenses: {
        interestIncome: 125.50,
        interestExpense: -450.00,
        foreignExchangeGain: 85.00,
        other: -25.00,
        total: -264.50
      },
      incomeBeforeTax: 35965.50,
      incomeTax: 0, // UAE has no corporate income tax for most businesses
      netIncome: 35965.50
    },
    'previous-month': {
      period: 'August 2024',
      revenue: {
        salesRevenue: 78540.00,
        exportSales: 15200.00,
        otherRevenue: 1890.00,
        total: 95630.00
      },
      costOfGoodsSold: {
        rawMaterials: 22000.00,
        directLabor: 7800.00,
        manufacturingOverhead: 4850.00,
        total: 34650.00
      },
      grossProfit: 60980.00,
      operatingExpenses: {
        salariesAndWages: 15000.00,
        rent: 8000.00,
        utilities: 1950.00,
        marketing: 2800.00,
        insurance: 1200.00,
        depreciation: 2500.00,
        officeExpenses: 650.00,
        professionalFees: 1200.00,
        other: 980.00,
        total: 34280.00
      },
      operatingIncome: 26700.00,
      otherIncomeExpenses: {
        interestIncome: 98.50,
        interestExpense: -450.00,
        foreignExchangeGain: -125.00,
        other: 15.00,
        total: -461.50
      },
      incomeBeforeTax: 26238.50,
      incomeTax: 0,
      netIncome: 26238.50
    },
    'ytd': {
      period: 'Year to Date 2024',
      revenue: {
        salesRevenue: 785400.00,
        exportSales: 156800.00,
        otherRevenue: 18950.00,
        total: 961150.00
      },
      costOfGoodsSold: {
        rawMaterials: 245000.00,
        directLabor: 82500.00,
        manufacturingOverhead: 51200.00,
        total: 378700.00
      },
      grossProfit: 582450.00,
      operatingExpenses: {
        salariesAndWages: 135000.00,
        rent: 72000.00,
        utilities: 18500.00,
        marketing: 28150.00,
        insurance: 10800.00,
        depreciation: 22500.00,
        officeExpenses: 7850.00,
        professionalFees: 13500.00,
        other: 11250.00,
        total: 319550.00
      },
      operatingIncome: 262900.00,
      otherIncomeExpenses: {
        interestIncome: 985.50,
        interestExpense: -4050.00,
        foreignExchangeGain: 285.00,
        other: -125.00,
        total: -2904.50
      },
      incomeBeforeTax: 259995.50,
      incomeTax: 0,
      netIncome: 259995.50
    }
  };

  const currentData = pnlData[selectedPeriod as keyof typeof pnlData];
  const comparisonData = pnlData[comparisonPeriod as keyof typeof pnlData];

  // Financial Ratios
  const ratios = {
    grossProfitMargin: (currentData.grossProfit / currentData.revenue.total) * 100,
    operatingMargin: (currentData.operatingIncome / currentData.revenue.total) * 100,
    netProfitMargin: (currentData.netIncome / currentData.revenue.total) * 100,
    operatingRatio: (currentData.operatingExpenses.total / currentData.revenue.total) * 100
  };

  // Variance Analysis
  const variance = {
    revenue: {
      amount: currentData.revenue.total - comparisonData.revenue.total,
      percentage: ((currentData.revenue.total - comparisonData.revenue.total) / comparisonData.revenue.total) * 100
    },
    grossProfit: {
      amount: currentData.grossProfit - comparisonData.grossProfit,
      percentage: ((currentData.grossProfit - comparisonData.grossProfit) / comparisonData.grossProfit) * 100
    },
    operatingIncome: {
      amount: currentData.operatingIncome - comparisonData.operatingIncome,
      percentage: ((currentData.operatingIncome - comparisonData.operatingIncome) / comparisonData.operatingIncome) * 100
    },
    netIncome: {
      amount: currentData.netIncome - comparisonData.netIncome,
      percentage: ((currentData.netIncome - comparisonData.netIncome) / comparisonData.netIncome) * 100
    }
  };

  const formatAED = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const getVarianceColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getVarianceIcon = (amount: number) => {
    return amount >= 0 ? TrendingUp : TrendingDown;
  };

  const getPerformanceBadge = (percentage: number, isReverse = false) => {
    const threshold = isReverse ? -5 : 5;
    const good = isReverse ? percentage <= threshold : percentage >= threshold;
    const moderate = isReverse
      ? percentage > threshold && percentage <= 0
      : percentage >= 0 && percentage < threshold;

    if (good) return 'bg-green-100 text-green-800';
    if (moderate) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-amber-600" />
            Profit & Loss Statement
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive income statement with revenue, expenses, and profitability analysis
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

      {/* Period Selection & Controls */}
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
              <label className="text-sm font-medium">Reporting Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="previous-month">Previous Month</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Compare With</label>
              <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous-month">Previous Month</SelectItem>
                  <SelectItem value="previous-year">Previous Year</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(currentData.revenue.total)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getVarianceIcon(variance.revenue.amount), {
                className: `h-3 w-3 ${getVarianceColor(variance.revenue.amount)}`
              })}
              <span className={`text-xs font-medium ${getVarianceColor(variance.revenue.amount)}`}>
                {variance.revenue.amount >= 0 ? '+' : ''}{formatPercentage(variance.revenue.percentage)}
              </span>
              <span className="text-xs text-gray-600">vs {comparisonData.period}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gross Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(currentData.grossProfit)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getVarianceIcon(variance.grossProfit.amount), {
                className: `h-3 w-3 ${getVarianceColor(variance.grossProfit.amount)}`
              })}
              <span className={`text-xs font-medium ${getVarianceColor(variance.grossProfit.amount)}`}>
                {variance.grossProfit.amount >= 0 ? '+' : ''}{formatPercentage(variance.grossProfit.percentage)}
              </span>
              <span className="text-xs text-gray-600">({formatPercentage(ratios.grossProfitMargin)} margin)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Operating Income
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(currentData.operatingIncome)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getVarianceIcon(variance.operatingIncome.amount), {
                className: `h-3 w-3 ${getVarianceColor(variance.operatingIncome.amount)}`
              })}
              <span className={`text-xs font-medium ${getVarianceColor(variance.operatingIncome.amount)}`}>
                {variance.operatingIncome.amount >= 0 ? '+' : ''}{formatPercentage(variance.operatingIncome.percentage)}
              </span>
              <span className="text-xs text-gray-600">({formatPercentage(ratios.operatingMargin)} margin)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Income
            </CardTitle>
            <Calculator className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(currentData.netIncome)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getVarianceIcon(variance.netIncome.amount), {
                className: `h-3 w-3 ${getVarianceColor(variance.netIncome.amount)}`
              })}
              <span className={`text-xs font-medium ${getVarianceColor(variance.netIncome.amount)}`}>
                {variance.netIncome.amount >= 0 ? '+' : ''}{formatPercentage(variance.netIncome.percentage)}
              </span>
              <span className="text-xs text-gray-600">({formatPercentage(ratios.netProfitMargin)} margin)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="statement" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="statement" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            P&L Statement
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Variance Analysis
          </TabsTrigger>
          <TabsTrigger value="ratios" className="flex items-center">
            <Percent className="h-4 w-4 mr-2" />
            Financial Ratios
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        {/* P&L Statement Tab */}
        <TabsContent value="statement">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                Profit & Loss Statement - {currentData.period}
              </CardTitle>
              <CardDescription>
                Detailed income statement showing revenue, expenses, and profitability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {/* Revenue Section */}
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Revenue
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Sales Revenue</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.revenue.salesRevenue)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Export Sales</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.revenue.exportSales)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Other Revenue</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.revenue.otherRevenue)}</TableCell>
                        </TableRow>
                        <TableRow className="border-t-2 border-gray-300 bg-green-50">
                          <TableCell className="font-bold text-green-900">Total Revenue</TableCell>
                          <TableCell className="text-right font-bold text-green-900">
                            {formatAED(currentData.revenue.total)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Cost of Goods Sold Section */}
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Cost of Goods Sold
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Raw Materials</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.costOfGoodsSold.rawMaterials)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Direct Labor</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.costOfGoodsSold.directLabor)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Manufacturing Overhead</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.costOfGoodsSold.manufacturingOverhead)}</TableCell>
                        </TableRow>
                        <TableRow className="border-t-2 border-gray-300 bg-red-50">
                          <TableCell className="font-bold text-red-900">Total Cost of Goods Sold</TableCell>
                          <TableCell className="text-right font-bold text-red-900">
                            {formatAED(currentData.costOfGoodsSold.total)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Gross Profit */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-blue-900">Gross Profit</h3>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-blue-900">
                        {formatAED(currentData.grossProfit)}
                      </div>
                      <div className="text-sm text-blue-700">
                        {formatPercentage(ratios.grossProfitMargin)} of revenue
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operating Expenses Section */}
                <div>
                  <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Operating Expenses
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Salaries and Wages</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.operatingExpenses.salariesAndWages)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Rent</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.operatingExpenses.rent)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Utilities</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.operatingExpenses.utilities)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Marketing</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.operatingExpenses.marketing)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Insurance</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.operatingExpenses.insurance)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Depreciation</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.operatingExpenses.depreciation)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Office Expenses</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.operatingExpenses.officeExpenses)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Professional Fees</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.operatingExpenses.professionalFees)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Other Expenses</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.operatingExpenses.other)}</TableCell>
                        </TableRow>
                        <TableRow className="border-t-2 border-gray-300 bg-orange-50">
                          <TableCell className="font-bold text-orange-900">Total Operating Expenses</TableCell>
                          <TableCell className="text-right font-bold text-orange-900">
                            {formatAED(currentData.operatingExpenses.total)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Operating Income */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-purple-900">Operating Income</h3>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-purple-900">
                        {formatAED(currentData.operatingIncome)}
                      </div>
                      <div className="text-sm text-purple-700">
                        {formatPercentage(ratios.operatingMargin)} operating margin
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Income/Expenses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Income & Expenses</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Interest Income</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.otherIncomeExpenses.interestIncome)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Interest Expense</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.otherIncomeExpenses.interestExpense)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Foreign Exchange Gain/Loss</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.otherIncomeExpenses.foreignExchangeGain)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium pl-6">Other</TableCell>
                          <TableCell className="text-right">{formatAED(currentData.otherIncomeExpenses.other)}</TableCell>
                        </TableRow>
                        <TableRow className="border-t-2 border-gray-300 bg-gray-50">
                          <TableCell className="font-bold">Total Other Income/Expenses</TableCell>
                          <TableCell className="text-right font-bold">
                            {formatAED(currentData.otherIncomeExpenses.total)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Net Income */}
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-amber-900">Net Income</h3>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-amber-900">
                        {formatAED(currentData.netIncome)}
                      </div>
                      <div className="text-lg text-amber-700">
                        {formatPercentage(ratios.netProfitMargin)} net margin
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variance Analysis Tab */}
        <TabsContent value="analysis">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                Variance Analysis - {currentData.period} vs {comparisonData.period}
              </CardTitle>
              <CardDescription>
                Compare current period performance against previous period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">{currentData.period}</TableHead>
                      <TableHead className="text-right">{comparisonData.period}</TableHead>
                      <TableHead className="text-right">Variance (AED)</TableHead>
                      <TableHead className="text-right">Variance (%)</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-green-50">
                      <TableCell className="font-bold text-green-900">Total Revenue</TableCell>
                      <TableCell className="text-right font-medium">{formatAED(currentData.revenue.total)}</TableCell>
                      <TableCell className="text-right">{formatAED(comparisonData.revenue.total)}</TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(variance.revenue.amount)}`}>
                        {variance.revenue.amount >= 0 ? '+' : ''}{formatAED(variance.revenue.amount)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(variance.revenue.amount)}`}>
                        {variance.revenue.amount >= 0 ? '+' : ''}{formatPercentage(variance.revenue.percentage)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPerformanceBadge(variance.revenue.percentage)}>
                          {variance.revenue.percentage >= 5 ? 'Excellent' : variance.revenue.percentage >= 0 ? 'Good' : 'Poor'}
                        </Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Sales Revenue</TableCell>
                      <TableCell className="text-right">{formatAED(currentData.revenue.salesRevenue)}</TableCell>
                      <TableCell className="text-right">{formatAED(comparisonData.revenue.salesRevenue)}</TableCell>
                      <TableCell className={`text-right ${getVarianceColor(currentData.revenue.salesRevenue - comparisonData.revenue.salesRevenue)}`}>
                        {currentData.revenue.salesRevenue - comparisonData.revenue.salesRevenue >= 0 ? '+' : ''}
                        {formatAED(currentData.revenue.salesRevenue - comparisonData.revenue.salesRevenue)}
                      </TableCell>
                      <TableCell className={`text-right ${getVarianceColor(currentData.revenue.salesRevenue - comparisonData.revenue.salesRevenue)}`}>
                        {((currentData.revenue.salesRevenue - comparisonData.revenue.salesRevenue) / comparisonData.revenue.salesRevenue * 100) >= 0 ? '+' : ''}
                        {formatPercentage((currentData.revenue.salesRevenue - comparisonData.revenue.salesRevenue) / comparisonData.revenue.salesRevenue * 100)}
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>

                    <TableRow className="bg-red-50">
                      <TableCell className="font-bold text-red-900">Cost of Goods Sold</TableCell>
                      <TableCell className="text-right font-medium">{formatAED(currentData.costOfGoodsSold.total)}</TableCell>
                      <TableCell className="text-right">{formatAED(comparisonData.costOfGoodsSold.total)}</TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(-(currentData.costOfGoodsSold.total - comparisonData.costOfGoodsSold.total))}`}>
                        {currentData.costOfGoodsSold.total - comparisonData.costOfGoodsSold.total >= 0 ? '+' : ''}
                        {formatAED(currentData.costOfGoodsSold.total - comparisonData.costOfGoodsSold.total)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(-(currentData.costOfGoodsSold.total - comparisonData.costOfGoodsSold.total))}`}>
                        {((currentData.costOfGoodsSold.total - comparisonData.costOfGoodsSold.total) / comparisonData.costOfGoodsSold.total * 100) >= 0 ? '+' : ''}
                        {formatPercentage((currentData.costOfGoodsSold.total - comparisonData.costOfGoodsSold.total) / comparisonData.costOfGoodsSold.total * 100)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPerformanceBadge((currentData.costOfGoodsSold.total - comparisonData.costOfGoodsSold.total) / comparisonData.costOfGoodsSold.total * 100, true)}>
                          {((currentData.costOfGoodsSold.total - comparisonData.costOfGoodsSold.total) / comparisonData.costOfGoodsSold.total * 100) <= -5 ? 'Excellent' :
                           ((currentData.costOfGoodsSold.total - comparisonData.costOfGoodsSold.total) / comparisonData.costOfGoodsSold.total * 100) <= 0 ? 'Good' : 'Poor'}
                        </Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow className="bg-blue-50">
                      <TableCell className="font-bold text-blue-900">Gross Profit</TableCell>
                      <TableCell className="text-right font-medium">{formatAED(currentData.grossProfit)}</TableCell>
                      <TableCell className="text-right">{formatAED(comparisonData.grossProfit)}</TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(variance.grossProfit.amount)}`}>
                        {variance.grossProfit.amount >= 0 ? '+' : ''}{formatAED(variance.grossProfit.amount)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(variance.grossProfit.amount)}`}>
                        {variance.grossProfit.amount >= 0 ? '+' : ''}{formatPercentage(variance.grossProfit.percentage)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPerformanceBadge(variance.grossProfit.percentage)}>
                          {variance.grossProfit.percentage >= 5 ? 'Excellent' : variance.grossProfit.percentage >= 0 ? 'Good' : 'Poor'}
                        </Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow className="bg-orange-50">
                      <TableCell className="font-bold text-orange-900">Operating Expenses</TableCell>
                      <TableCell className="text-right font-medium">{formatAED(currentData.operatingExpenses.total)}</TableCell>
                      <TableCell className="text-right">{formatAED(comparisonData.operatingExpenses.total)}</TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(-(currentData.operatingExpenses.total - comparisonData.operatingExpenses.total))}`}>
                        {currentData.operatingExpenses.total - comparisonData.operatingExpenses.total >= 0 ? '+' : ''}
                        {formatAED(currentData.operatingExpenses.total - comparisonData.operatingExpenses.total)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(-(currentData.operatingExpenses.total - comparisonData.operatingExpenses.total))}`}>
                        {((currentData.operatingExpenses.total - comparisonData.operatingExpenses.total) / comparisonData.operatingExpenses.total * 100) >= 0 ? '+' : ''}
                        {formatPercentage((currentData.operatingExpenses.total - comparisonData.operatingExpenses.total) / comparisonData.operatingExpenses.total * 100)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPerformanceBadge((currentData.operatingExpenses.total - comparisonData.operatingExpenses.total) / comparisonData.operatingExpenses.total * 100, true)}>
                          {((currentData.operatingExpenses.total - comparisonData.operatingExpenses.total) / comparisonData.operatingExpenses.total * 100) <= -5 ? 'Excellent' :
                           ((currentData.operatingExpenses.total - comparisonData.operatingExpenses.total) / comparisonData.operatingExpenses.total * 100) <= 0 ? 'Good' : 'Poor'}
                        </Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow className="bg-purple-50">
                      <TableCell className="font-bold text-purple-900">Operating Income</TableCell>
                      <TableCell className="text-right font-medium">{formatAED(currentData.operatingIncome)}</TableCell>
                      <TableCell className="text-right">{formatAED(comparisonData.operatingIncome)}</TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(variance.operatingIncome.amount)}`}>
                        {variance.operatingIncome.amount >= 0 ? '+' : ''}{formatAED(variance.operatingIncome.amount)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(variance.operatingIncome.amount)}`}>
                        {variance.operatingIncome.amount >= 0 ? '+' : ''}{formatPercentage(variance.operatingIncome.percentage)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPerformanceBadge(variance.operatingIncome.percentage)}>
                          {variance.operatingIncome.percentage >= 5 ? 'Excellent' : variance.operatingIncome.percentage >= 0 ? 'Good' : 'Poor'}
                        </Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow className="bg-amber-50 border-t-2 border-amber-300">
                      <TableCell className="font-bold text-amber-900">Net Income</TableCell>
                      <TableCell className="text-right font-bold">{formatAED(currentData.netIncome)}</TableCell>
                      <TableCell className="text-right font-bold">{formatAED(comparisonData.netIncome)}</TableCell>
                      <TableCell className={`text-right font-bold ${getVarianceColor(variance.netIncome.amount)}`}>
                        {variance.netIncome.amount >= 0 ? '+' : ''}{formatAED(variance.netIncome.amount)}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${getVarianceColor(variance.netIncome.amount)}`}>
                        {variance.netIncome.amount >= 0 ? '+' : ''}{formatPercentage(variance.netIncome.percentage)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPerformanceBadge(variance.netIncome.percentage)}>
                          {variance.netIncome.percentage >= 5 ? 'Excellent' : variance.netIncome.percentage >= 0 ? 'Good' : 'Poor'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Strong Performance</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Revenue increased by {formatPercentage(variance.revenue.percentage)}</li>
                    <li>• Gross profit margin improved</li>
                    <li>• Export sales grew significantly</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Areas for Attention</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Operating expenses increased</li>
                    <li>• Marketing costs rose 12.5%</li>
                    <li>• Utility expenses higher than expected</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Overall profitability improved</li>
                    <li>• Cost control opportunities exist</li>
                    <li>• Strong operational performance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Ratios Tab */}
        <TabsContent value="ratios">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="h-5 w-5 mr-2 text-amber-600" />
                  Profitability Ratios
                </CardTitle>
                <CardDescription>
                  Key profitability metrics and margin analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Gross Profit Margin</span>
                      <span className="text-blue-600 font-bold">{formatPercentage(ratios.grossProfitMargin)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.min(ratios.grossProfitMargin, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">Industry benchmark: 60-70%</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Operating Margin</span>
                      <span className="text-purple-600 font-bold">{formatPercentage(ratios.operatingMargin)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: `${Math.min(ratios.operatingMargin, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">Industry benchmark: 25-35%</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Net Profit Margin</span>
                      <span className="text-amber-600 font-bold">{formatPercentage(ratios.netProfitMargin)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{width: `${Math.min(ratios.netProfitMargin, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">Industry benchmark: 20-30%</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Operating Ratio</span>
                      <span className="text-red-600 font-bold">{formatPercentage(ratios.operatingRatio)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{width: `${Math.min(ratios.operatingRatio, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">Lower is better (Target: &lt;70%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Ratio Analysis Summary</CardTitle>
                <CardDescription>
                  Performance assessment and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Strong Profitability</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Net profit margin of {formatPercentage(ratios.netProfitMargin)} is above industry average,
                      indicating efficient operations and good cost control.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Healthy Gross Margin</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Gross profit margin of {formatPercentage(ratios.grossProfitMargin)} demonstrates
                      good pricing strategy and effective cost of goods management.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h4 className="font-medium text-orange-900">Operating Efficiency</h4>
                    </div>
                    <p className="text-sm text-orange-700">
                      Operating ratio of {formatPercentage(ratios.operatingRatio)} indicates room for
                      improvement in operational efficiency and expense management.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Recommendations</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                        <span>Continue focus on high-margin products to maintain gross profit levels</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                        <span>Review operating expenses for potential cost reduction opportunities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                        <span>Implement cost control measures without compromising quality</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                        <span>Monitor ratios monthly to track performance trends</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-amber-600" />
                  Performance Trends
                </CardTitle>
                <CardDescription>
                  Historical profit and loss trends analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">P&L Trends Chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>
                  Key insights from historical performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Revenue Growth</h4>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">+15.6%</span>
                      <span className="text-sm text-gray-600">month-over-month</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Expense Control</h4>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <span className="text-orange-600 font-medium">+4.0%</span>
                      <span className="text-sm text-gray-600">expense growth</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Profitability</h4>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">+37.1%</span>
                      <span className="text-sm text-gray-600">net income growth</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-900 mb-2">Key Trends</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Consistent revenue growth over last 6 months</li>
                      <li>• Improving operational efficiency</li>
                      <li>• Export sales trending upward</li>
                      <li>• Cost of goods sold ratio decreasing</li>
                      <li>• Strong seasonal performance patterns</li>
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