'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Waves,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building,
  Factory,
  CreditCard,
  FileText,
  Eye,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
  ArrowDown,
  ArrowUp,
  Minus,
  ArrowLeft} from 'lucide-react';

export default function CashFlowStatementPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [methodType, setMethodType] = useState('indirect');
  const [viewType, setViewType] = useState('detailed');

  // Cash Flow Data (Indirect Method)
  const cashFlowData = {
    'current-month': {
      period: 'September 2024',
      operatingActivities: {
        netIncome: 35965.50,
        adjustments: {
          depreciation: 2500.00,
          amortization: 0,
          lossOnDisposal: 0,
          changeInAccountsReceivable: -6500.00,
          changeInInventory: -13000.00,
          changeInPrepaidExpenses: 1500.00,
          changeInAccountsPayable: -4500.00,
          changeInAccruedLiabilities: 1300.00,
          changeInVATPayable: 550.00,
          otherOperatingChanges: 250.00
        },
        totalAdjustments: -17900.00,
        netCashFromOperatingActivities: 18065.50
      },
      investingActivities: {
        purchaseOfEquipment: -5000.00,
        saleOfEquipment: 0,
        purchaseOfInvestments: 0,
        saleOfInvestments: 0,
        otherInvestingActivities: -500.00,
        netCashFromInvestingActivities: -5500.00
      },
      financingActivities: {
        proceedsFromDebt: 0,
        repaymentOfDebt: -3000.00,
        ownerContributions: 0,
        ownerWithdrawals: -2500.00,
        dividendsPaid: 0,
        otherFinancingActivities: 0,
        netCashFromFinancingActivities: -5500.00
      },
      netChangeInCash: 7065.50,
      cashAtBeginning: 118385.25,
      cashAtEnd: 125450.75
    },
    'previous-month': {
      period: 'August 2024',
      operatingActivities: {
        netIncome: 26238.50,
        adjustments: {
          depreciation: 2500.00,
          amortization: 0,
          lossOnDisposal: 0,
          changeInAccountsReceivable: -3500.00,
          changeInInventory: -8000.00,
          changeInPrepaidExpenses: 800.00,
          changeInAccountsPayable: 2500.00,
          changeInAccruedLiabilities: 850.00,
          changeInVATPayable: 450.00,
          otherOperatingChanges: -150.00
        },
        totalAdjustments: -4550.00,
        netCashFromOperatingActivities: 21688.50
      },
      investingActivities: {
        purchaseOfEquipment: 0,
        saleOfEquipment: 0,
        purchaseOfInvestments: 0,
        saleOfInvestments: 0,
        otherInvestingActivities: -250.00,
        netCashFromInvestingActivities: -250.00
      },
      financingActivities: {
        proceedsFromDebt: 0,
        repaymentOfDebt: -3000.00,
        ownerContributions: 0,
        ownerWithdrawals: -2000.00,
        dividendsPaid: 0,
        otherFinancingActivities: 0,
        netCashFromFinancingActivities: -5000.00
      },
      netChangeInCash: 16438.50,
      cashAtBeginning: 101946.75,
      cashAtEnd: 118385.25
    },
    'ytd': {
      period: 'Year to Date 2024',
      operatingActivities: {
        netIncome: 259995.50,
        adjustments: {
          depreciation: 22500.00,
          amortization: 0,
          lossOnDisposal: 0,
          changeInAccountsReceivable: -45000.00,
          changeInInventory: -85000.00,
          changeInPrepaidExpenses: 5500.00,
          changeInAccountsPayable: 8000.00,
          changeInAccruedLiabilities: 7500.00,
          changeInVATPayable: 4500.00,
          otherOperatingChanges: 1200.00
        },
        totalAdjustments: -80800.00,
        netCashFromOperatingActivities: 179195.50
      },
      investingActivities: {
        purchaseOfEquipment: -35000.00,
        saleOfEquipment: 2500.00,
        purchaseOfInvestments: -18500.00,
        saleOfInvestments: 0,
        otherInvestingActivities: -3500.00,
        netCashFromInvestingActivities: -54500.00
      },
      financingActivities: {
        proceedsFromDebt: 15000.00,
        repaymentOfDebt: -25000.00,
        ownerContributions: 50000.00,
        ownerWithdrawals: -20000.00,
        dividendsPaid: 0,
        otherFinancingActivities: 0,
        netCashFromFinancingActivities: 20000.00
      },
      netChangeInCash: 144695.50,
      cashAtBeginning: -19244.75,
      cashAtEnd: 125450.75
    }
  };

  // Direct Method Data (for comparison)
  const directMethodData = {
    'current-month': {
      operatingActivities: {
        cashFromCustomers: 84230.00,
        cashToSuppliers: -32650.00,
        cashToEmployees: -15000.00,
        cashForOperatingExpenses: -18514.50,
        interestPaid: -450.00,
        taxesPaid: 0,
        netCashFromOperatingActivities: 17615.50
      }
    }
  };

  const currentData = cashFlowData[selectedPeriod as keyof typeof cashFlowData];

  // Cash Flow Ratios
  const ratios = {
    operatingCashFlowRatio: currentData.operatingActivities.netCashFromOperatingActivities / 66750, // current liabilities
    freeCashFlow: currentData.operatingActivities.netCashFromOperatingActivities + currentData.investingActivities.netCashFromInvestingActivities,
    cashFlowToNetIncome: currentData.operatingActivities.netCashFromOperatingActivities / currentData.operatingActivities.netIncome,
    cashCoverage: currentData.operatingActivities.netCashFromOperatingActivities / 450, // interest expense
    operatingCashFlowMargin: currentData.operatingActivities.netCashFromOperatingActivities / 110580 // revenue
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

  const getCashFlowIcon = (amount: number) => {
    if (amount > 0) return ArrowUp;
    if (amount < 0) return ArrowDown;
    return Minus;
  };

  const getCashFlowColor = (amount: number) => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'operating': return 'text-green-600';
      case 'investing': return 'text-blue-600';
      case 'financing': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBadge = (ratio: number, type: string) => {
    switch (type) {
      case 'operating-ratio':
        if (ratio >= 0.4) return { color: 'bg-green-100 text-green-800', status: 'Excellent' };
        if (ratio >= 0.2) return { color: 'bg-blue-100 text-blue-800', status: 'Good' };
        if (ratio >= 0.1) return { color: 'bg-orange-100 text-orange-800', status: 'Fair' };
        return { color: 'bg-red-100 text-red-800', status: 'Poor' };
      case 'cash-to-income':
        if (ratio >= 1.2) return { color: 'bg-green-100 text-green-800', status: 'Excellent' };
        if (ratio >= 1.0) return { color: 'bg-blue-100 text-blue-800', status: 'Good' };
        if (ratio >= 0.8) return { color: 'bg-orange-100 text-orange-800', status: 'Fair' };
        return { color: 'bg-red-100 text-red-800', status: 'Poor' };
      default:
        return { color: 'bg-gray-100 text-gray-800', status: 'N/A' };
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Waves className="h-8 w-8 text-amber-600" />
            Cash Flow Statement
          </h1>
          <p className="text-muted-foreground mt-1">
            Statement of cash flows showing operating, investing, and financing activities
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
              <label className="text-sm font-medium">Method</label>
              <Select value={methodType} onValueChange={setMethodType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indirect">Indirect Method</SelectItem>
                  <SelectItem value="direct">Direct Method</SelectItem>
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
              Operating Cash Flow
            </CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(currentData.operatingActivities.netCashFromOperatingActivities)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getCashFlowIcon(currentData.operatingActivities.netCashFromOperatingActivities), {
                className: `h-3 w-3 ${getCashFlowColor(currentData.operatingActivities.netCashFromOperatingActivities)}`
              })}
              <span className={`text-xs font-medium ${getCashFlowColor(currentData.operatingActivities.netCashFromOperatingActivities)}`}>
                {formatPercentage(ratios.operatingCashFlowMargin * 100)} of revenue
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Investing Cash Flow
            </CardTitle>
            <Factory className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(currentData.investingActivities.netCashFromInvestingActivities)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getCashFlowIcon(currentData.investingActivities.netCashFromInvestingActivities), {
                className: `h-3 w-3 ${getCashFlowColor(currentData.investingActivities.netCashFromInvestingActivities)}`
              })}
              <span className="text-xs text-gray-600">
                Capital investments
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Financing Cash Flow
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(currentData.financingActivities.netCashFromFinancingActivities)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getCashFlowIcon(currentData.financingActivities.netCashFromFinancingActivities), {
                className: `h-3 w-3 ${getCashFlowColor(currentData.financingActivities.netCashFromFinancingActivities)}`
              })}
              <span className="text-xs text-gray-600">
                Debt and equity changes
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Change in Cash
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(currentData.netChangeInCash)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {React.createElement(getCashFlowIcon(currentData.netChangeInCash), {
                className: `h-3 w-3 ${getCashFlowColor(currentData.netChangeInCash)}`
              })}
              <span className="text-xs text-gray-600">
                Cash position change
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="statement" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="statement" className="flex items-center">
            <Waves className="h-4 w-4 mr-2" />
            Cash Flow Statement
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Cash Flow Analysis
          </TabsTrigger>
          <TabsTrigger value="ratios" className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            Cash Flow Ratios
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Cash Forecast
          </TabsTrigger>
        </TabsList>

        {/* Cash Flow Statement Tab */}
        <TabsContent value="statement">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Waves className="h-5 w-5 mr-2 text-amber-600" />
                Cash Flow Statement - {currentData.period} ({methodType === 'indirect' ? 'Indirect Method' : 'Direct Method'})
              </CardTitle>
              <CardDescription>
                Statement of cash flows showing sources and uses of cash during the period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {/* Operating Activities */}
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                    <Building className="h-6 w-6 mr-2" />
                    CASH FLOWS FROM OPERATING ACTIVITIES
                  </h3>

                  {methodType === 'indirect' ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableBody>
                          <TableRow className="bg-green-50">
                            <TableCell className="font-bold text-green-900">Net Income</TableCell>
                            <TableCell className="text-right font-bold text-green-900">
                              {formatAED(currentData.operatingActivities.netIncome)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={2} className="font-semibold text-green-700 pl-2">
                              Adjustments to reconcile net income to cash:
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Depreciation and Amortization</TableCell>
                            <TableCell className="text-right">{formatAED(currentData.operatingActivities.adjustments.depreciation)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Decrease (Increase) in Accounts Receivable</TableCell>
                            <TableCell className={`text-right ${getCashFlowColor(currentData.operatingActivities.adjustments.changeInAccountsReceivable)}`}>
                              {formatAED(currentData.operatingActivities.adjustments.changeInAccountsReceivable)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Decrease (Increase) in Inventory</TableCell>
                            <TableCell className={`text-right ${getCashFlowColor(currentData.operatingActivities.adjustments.changeInInventory)}`}>
                              {formatAED(currentData.operatingActivities.adjustments.changeInInventory)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Decrease (Increase) in Prepaid Expenses</TableCell>
                            <TableCell className={`text-right ${getCashFlowColor(currentData.operatingActivities.adjustments.changeInPrepaidExpenses)}`}>
                              {formatAED(currentData.operatingActivities.adjustments.changeInPrepaidExpenses)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Increase (Decrease) in Accounts Payable</TableCell>
                            <TableCell className={`text-right ${getCashFlowColor(currentData.operatingActivities.adjustments.changeInAccountsPayable)}`}>
                              {formatAED(currentData.operatingActivities.adjustments.changeInAccountsPayable)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Increase (Decrease) in Accrued Liabilities</TableCell>
                            <TableCell className={`text-right ${getCashFlowColor(currentData.operatingActivities.adjustments.changeInAccruedLiabilities)}`}>
                              {formatAED(currentData.operatingActivities.adjustments.changeInAccruedLiabilities)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Increase (Decrease) in VAT Payable</TableCell>
                            <TableCell className={`text-right ${getCashFlowColor(currentData.operatingActivities.adjustments.changeInVATPayable)}`}>
                              {formatAED(currentData.operatingActivities.adjustments.changeInVATPayable)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Other Operating Changes</TableCell>
                            <TableCell className={`text-right ${getCashFlowColor(currentData.operatingActivities.adjustments.otherOperatingChanges)}`}>
                              {formatAED(currentData.operatingActivities.adjustments.otherOperatingChanges)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-t-2 border-green-300 bg-green-100">
                            <TableCell className="font-bold text-green-900">Net Cash Provided by Operating Activities</TableCell>
                            <TableCell className="text-right font-bold text-green-900">
                              {formatAED(currentData.operatingActivities.netCashFromOperatingActivities)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="pl-6">Cash Received from Customers</TableCell>
                            <TableCell className="text-right text-green-600">{formatAED(directMethodData['current-month'].operatingActivities.cashFromCustomers)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Cash Paid to Suppliers</TableCell>
                            <TableCell className="text-right text-red-600">{formatAED(directMethodData['current-month'].operatingActivities.cashToSuppliers)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Cash Paid to Employees</TableCell>
                            <TableCell className="text-right text-red-600">{formatAED(directMethodData['current-month'].operatingActivities.cashToEmployees)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Cash Paid for Operating Expenses</TableCell>
                            <TableCell className="text-right text-red-600">{formatAED(directMethodData['current-month'].operatingActivities.cashForOperatingExpenses)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-6">Interest Paid</TableCell>
                            <TableCell className="text-right text-red-600">{formatAED(directMethodData['current-month'].operatingActivities.interestPaid)}</TableCell>
                          </TableRow>
                          <TableRow className="border-t-2 border-green-300 bg-green-100">
                            <TableCell className="font-bold text-green-900">Net Cash Provided by Operating Activities</TableCell>
                            <TableCell className="text-right font-bold text-green-900">
                              {formatAED(directMethodData['current-month'].operatingActivities.netCashFromOperatingActivities)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                {/* Investing Activities */}
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <Factory className="h-6 w-6 mr-2" />
                    CASH FLOWS FROM INVESTING ACTIVITIES
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="pl-6">Purchase of Equipment</TableCell>
                          <TableCell className={`text-right ${getCashFlowColor(currentData.investingActivities.purchaseOfEquipment)}`}>
                            {formatAED(currentData.investingActivities.purchaseOfEquipment)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-6">Sale of Equipment</TableCell>
                          <TableCell className={`text-right ${getCashFlowColor(currentData.investingActivities.saleOfEquipment)}`}>
                            {currentData.investingActivities.saleOfEquipment === 0 ? '-' : formatAED(currentData.investingActivities.saleOfEquipment)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-6">Purchase of Investments</TableCell>
                          <TableCell className={`text-right ${getCashFlowColor(currentData.investingActivities.purchaseOfInvestments)}`}>
                            {currentData.investingActivities.purchaseOfInvestments === 0 ? '-' : formatAED(currentData.investingActivities.purchaseOfInvestments)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-6">Other Investing Activities</TableCell>
                          <TableCell className={`text-right ${getCashFlowColor(currentData.investingActivities.otherInvestingActivities)}`}>
                            {formatAED(currentData.investingActivities.otherInvestingActivities)}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-t-2 border-blue-300 bg-blue-100">
                          <TableCell className="font-bold text-blue-900">Net Cash Used in Investing Activities</TableCell>
                          <TableCell className="text-right font-bold text-blue-900">
                            {formatAED(currentData.investingActivities.netCashFromInvestingActivities)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Financing Activities */}
                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
                    <CreditCard className="h-6 w-6 mr-2" />
                    CASH FLOWS FROM FINANCING ACTIVITIES
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="pl-6">Proceeds from Debt</TableCell>
                          <TableCell className={`text-right ${getCashFlowColor(currentData.financingActivities.proceedsFromDebt)}`}>
                            {currentData.financingActivities.proceedsFromDebt === 0 ? '-' : formatAED(currentData.financingActivities.proceedsFromDebt)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-6">Repayment of Debt</TableCell>
                          <TableCell className={`text-right ${getCashFlowColor(currentData.financingActivities.repaymentOfDebt)}`}>
                            {formatAED(currentData.financingActivities.repaymentOfDebt)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-6">Owner Contributions</TableCell>
                          <TableCell className={`text-right ${getCashFlowColor(currentData.financingActivities.ownerContributions)}`}>
                            {currentData.financingActivities.ownerContributions === 0 ? '-' : formatAED(currentData.financingActivities.ownerContributions)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-6">Owner Withdrawals</TableCell>
                          <TableCell className={`text-right ${getCashFlowColor(currentData.financingActivities.ownerWithdrawals)}`}>
                            {formatAED(currentData.financingActivities.ownerWithdrawals)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-6">Dividends Paid</TableCell>
                          <TableCell className={`text-right ${getCashFlowColor(currentData.financingActivities.dividendsPaid)}`}>
                            {currentData.financingActivities.dividendsPaid === 0 ? '-' : formatAED(currentData.financingActivities.dividendsPaid)}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-t-2 border-purple-300 bg-purple-100">
                          <TableCell className="font-bold text-purple-900">Net Cash Used in Financing Activities</TableCell>
                          <TableCell className="text-right font-bold text-purple-900">
                            {formatAED(currentData.financingActivities.netCashFromFinancingActivities)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Net Change in Cash */}
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-amber-900">Net Increase (Decrease) in Cash</span>
                      <span className={`text-xl font-bold ${getCashFlowColor(currentData.netChangeInCash)}`}>
                        {formatAED(currentData.netChangeInCash)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-amber-800">Cash at Beginning of Period</span>
                      <span className="text-lg font-medium text-amber-800">
                        {formatAED(currentData.cashAtBeginning)}
                      </span>
                    </div>
                    <div className="border-t-2 border-amber-300 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-amber-900">Cash at End of Period</span>
                        <span className="text-xl sm:text-2xl font-bold text-amber-900">
                          {formatAED(currentData.cashAtEnd)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Analysis Tab */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                  Cash Flow Summary
                </CardTitle>
                <CardDescription>
                  Analysis of cash flow components and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Operating Activities</span>
                      <div className="text-right">
                        <span className={`font-bold ${getActivityColor('operating')}`}>
                          {formatAED(currentData.operatingActivities.netCashFromOperatingActivities)}
                        </span>
                        <div className="text-xs text-gray-600">Core business operations</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Investing Activities</span>
                      <div className="text-right">
                        <span className={`font-bold ${getActivityColor('investing')}`}>
                          {formatAED(currentData.investingActivities.netCashFromInvestingActivities)}
                        </span>
                        <div className="text-xs text-gray-600">Capital investments</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Financing Activities</span>
                      <div className="text-right">
                        <span className={`font-bold ${getActivityColor('financing')}`}>
                          {formatAED(currentData.financingActivities.netCashFromFinancingActivities)}
                        </span>
                        <div className="text-xs text-gray-600">Debt and equity</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Cash Flow Pattern</h4>
                  <p className="text-sm text-blue-700">
                    Strong operating cash flow of {formatAED(currentData.operatingActivities.netCashFromOperatingActivities)}
                    indicates healthy core business operations. Investing outflows show growth investments,
                    while financing activities reflect debt management.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Free Cash Flow Analysis</CardTitle>
                <CardDescription>
                  Available cash after essential capital expenditures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-900">Free Cash Flow</span>
                      <span className="text-xl sm:text-2xl font-bold text-green-900">
                        {formatAED(ratios.freeCashFlow)}
                      </span>
                    </div>
                    <div className="text-sm text-green-700">
                      Operating Cash Flow: {formatAED(currentData.operatingActivities.netCashFromOperatingActivities)}
                      <br />
                      Less: Capital Expenditures: {formatAED(currentData.investingActivities.netCashFromInvestingActivities)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Cash Flow Quality Indicators</h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cash-to-Income Ratio</span>
                        <Badge className={getHealthBadge(ratios.cashFlowToNetIncome, 'cash-to-income').color}>
                          {formatRatio(ratios.cashFlowToNetIncome)} - {getHealthBadge(ratios.cashFlowToNetIncome, 'cash-to-income').status}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Operating Margin</span>
                        <span className="font-medium">{formatPercentage(ratios.operatingCashFlowMargin * 100)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cash Coverage Ratio</span>
                        <span className="font-medium">{formatRatio(ratios.cashCoverage)}x</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-900 mb-2">Key Insights</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Strong operating cash generation</li>
                      <li>• Positive free cash flow indicates financial flexibility</li>
                      <li>• Cash flow supports growth investments</li>
                      <li>• Good cash conversion from earnings</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cash Flow Ratios Tab */}
        <TabsContent value="ratios">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-amber-600" />
                  Liquidity Ratios
                </CardTitle>
                <CardDescription>
                  Cash-based liquidity and solvency measures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Operating Cash Flow Ratio</span>
                      <div className="text-right">
                        <span className="font-bold text-blue-600">{formatRatio(ratios.operatingCashFlowRatio)}</span>
                        <div className="text-xs text-gray-600">
                          {getHealthBadge(ratios.operatingCashFlowRatio, 'operating-ratio').status}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.min(ratios.operatingCashFlowRatio * 250, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Operating cash flow ÷ Current liabilities (Target: {'>'} 0.4)
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Cash Flow to Net Income</span>
                      <div className="text-right">
                        <span className="font-bold text-green-600">{formatRatio(ratios.cashFlowToNetIncome)}</span>
                        <div className="text-xs text-gray-600">Quality indicator</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.min(ratios.cashFlowToNetIncome * 80, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Higher ratio indicates better earnings quality
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Operating Cash Flow Margin</span>
                      <span className="font-bold text-purple-600">{formatPercentage(ratios.operatingCashFlowMargin * 100)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: `${ratios.operatingCashFlowMargin * 100 * 6}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Operating cash flow as % of revenue
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Coverage Ratios</CardTitle>
                <CardDescription>
                  Ability to service debt and financial obligations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Cash Coverage Ratio</span>
                      <span className="font-bold text-orange-600">{formatRatio(ratios.cashCoverage)}x</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: `${Math.min(ratios.cashCoverage * 2.5, 100)}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Operating cash flow ÷ Interest expense
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Free Cash Flow</span>
                      <span className="font-bold text-amber-600">{formatAED(ratios.freeCashFlow)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Cash available after capital expenditures
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Cash Position Strength</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-green-700">Current Cash:</div>
                        <div className="font-bold">{formatAED(currentData.cashAtEnd)}</div>
                      </div>
                      <div>
                        <div className="text-green-700">Monthly Burn Rate:</div>
                        <div className="font-bold">{formatAED(Math.abs(currentData.operatingActivities.netCashFromOperatingActivities - currentData.operatingActivities.netIncome))}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Ratio Analysis</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Strong operating cash flow generation</li>
                      <li>• Excellent interest coverage capability</li>
                      <li>• Positive free cash flow supports growth</li>
                      <li>• Good cash conversion efficiency</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cash Forecast Tab */}
        <TabsContent value="forecast">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-amber-600" />
                  Cash Flow Forecast
                </CardTitle>
                <CardDescription>
                  Projected cash flows for upcoming periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Cash Flow Forecast Chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Cash Management</CardTitle>
                <CardDescription>
                  Cash optimization and management recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Strong Cash Position</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Current cash balance of {formatAED(currentData.cashAtEnd)} provides
                      excellent liquidity for operations and growth opportunities.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Next 90 Days Outlook</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Projected Operating Cash Flow:</span>
                        <span className="font-medium text-green-600">+{formatAED(18000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Planned Capital Expenditures:</span>
                        <span className="font-medium text-red-600">-{formatAED(8000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Debt Service Payments:</span>
                        <span className="font-medium text-red-600">-{formatAED(9000)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-medium">Projected Cash Position:</span>
                        <span className="font-bold text-blue-600">{formatAED(currentData.cashAtEnd + 1000)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-900 mb-2">Recommendations</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Maintain cash reserves for seasonal fluctuations</li>
                      <li>• Consider investing excess cash in short-term instruments</li>
                      <li>• Monitor accounts receivable collection timing</li>
                      <li>• Optimize supplier payment terms</li>
                      <li>• Plan capital expenditures to maintain cash flow</li>
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