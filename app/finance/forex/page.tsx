'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Filter,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ForexGainLossPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const transactions = [
    {
      id: 1,
      date: '2025-10-01',
      type: 'Purchase',
      reference: 'PO-2025-1234',
      baseCurrency: 'AED',
      foreignCurrency: 'USD',
      foreignAmount: 10000,
      exchangeRateBooked: 3.67,
      exchangeRateSettled: 3.69,
      aedBooked: 36700,
      aedSettled: 36900,
      gainLoss: -200,
      status: 'Settled',
    },
    {
      id: 2,
      date: '2025-10-02',
      type: 'Sale',
      reference: 'INV-2025-5678',
      baseCurrency: 'AED',
      foreignCurrency: 'EUR',
      foreignAmount: 5000,
      exchangeRateBooked: 4.02,
      exchangeRateSettled: 4.05,
      aedBooked: 20100,
      aedSettled: 20250,
      gainLoss: 150,
      status: 'Settled',
    },
    {
      id: 3,
      date: '2025-09-28',
      type: 'Purchase',
      reference: 'PO-2025-1200',
      baseCurrency: 'AED',
      foreignCurrency: 'INR',
      foreignAmount: 500000,
      exchangeRateBooked: 0.044,
      exchangeRateSettled: 0.043,
      aedBooked: 22000,
      aedSettled: 21500,
      gainLoss: 500,
      status: 'Settled',
    },
    {
      id: 4,
      date: '2025-09-25',
      type: 'Sale',
      reference: 'INV-2025-5600',
      baseCurrency: 'AED',
      foreignCurrency: 'GBP',
      foreignAmount: 8000,
      exchangeRateBooked: 4.68,
      exchangeRateSettled: 4.70,
      aedBooked: 37440,
      aedSettled: 37600,
      gainLoss: 160,
      status: 'Settled',
    },
    {
      id: 5,
      date: '2025-10-03',
      type: 'Purchase',
      reference: 'PO-2025-1250',
      baseCurrency: 'AED',
      foreignCurrency: 'SAR',
      foreignAmount: 15000,
      exchangeRateBooked: 1.02,
      exchangeRateSettled: null,
      aedBooked: 15300,
      aedSettled: null,
      gainLoss: null,
      status: 'Pending',
    },
  ];

  const summary = {
    totalGain: 810,
    totalLoss: -200,
    netGainLoss: 610,
    unrealizedGainLoss: 0,
    transactionsCount: transactions.filter(t => t.status === 'Settled').length,
  };

  const currencySummary = [
    { currency: 'USD', transactions: 12, realized: -450, unrealized: 0, net: -450 },
    { currency: 'EUR', transactions: 8, realized: 320, unrealized: 0, net: 320 },
    { currency: 'GBP', transactions: 5, realized: 280, unrealized: 0, net: 280 },
    { currency: 'INR', transactions: 15, realized: 460, unrealized: 0, net: 460 },
    { currency: 'SAR', transactions: 6, realized: 0, unrealized: 0, net: 0 },
  ];

  const stats = [
    {
      label: 'Net Gain/Loss (YTD)',
      value: `AED ${summary.netGainLoss.toLocaleString()}`,
      icon: summary.netGainLoss >= 0 ? TrendingUp : TrendingDown,
      color: summary.netGainLoss >= 0 ? 'text-green-600' : 'text-red-600',
      bg: summary.netGainLoss >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: 'Total Gain',
      value: `AED ${summary.totalGain.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Loss',
      value: `AED ${Math.abs(summary.totalLoss).toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Settled Transactions',
      value: summary.transactionsCount,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-orange-600" />
              Forex Gain/Loss Tracking
            </h1>
            <p className="text-muted-foreground">
              Track foreign exchange gains and losses on multi-currency transactions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="luxury">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="by-currency">By Currency</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Foreign Exchange Transactions</CardTitle>
              <CardDescription>
                Detailed view of forex gains and losses on all transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Date</th>
                      <th className="text-left p-3 font-semibold">Type</th>
                      <th className="text-left p-3 font-semibold">Reference</th>
                      <th className="text-right p-3 font-semibold">Foreign Amount</th>
                      <th className="text-right p-3 font-semibold">Rate (Booked)</th>
                      <th className="text-right p-3 font-semibold">Rate (Settled)</th>
                      <th className="text-right p-3 font-semibold">AED (Booked)</th>
                      <th className="text-right p-3 font-semibold">AED (Settled)</th>
                      <th className="text-right p-3 font-semibold">Gain/Loss</th>
                      <th className="text-center p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">
                          {new Date(txn.date).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{txn.type}</Badge>
                        </td>
                        <td className="p-3 font-mono text-sm">{txn.reference}</td>
                        <td className="p-3 text-right font-mono">
                          {txn.foreignCurrency} {txn.foreignAmount.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono text-sm">
                          {txn.exchangeRateBooked.toFixed(4)}
                        </td>
                        <td className="p-3 text-right font-mono text-sm">
                          {txn.exchangeRateSettled
                            ? txn.exchangeRateSettled.toFixed(4)
                            : '-'}
                        </td>
                        <td className="p-3 text-right font-mono">
                          {txn.aedBooked.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono">
                          {txn.aedSettled ? txn.aedSettled.toLocaleString() : '-'}
                        </td>
                        <td className="p-3 text-right font-mono">
                          {txn.gainLoss !== null ? (
                            <span
                              className={
                                txn.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                              }
                            >
                              {txn.gainLoss >= 0 ? '+' : ''}
                              {txn.gainLoss.toLocaleString()}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {txn.status === 'Settled' ? (
                            <Badge className="bg-green-100 text-green-800">Settled</Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Currency Tab */}
        <TabsContent value="by-currency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Forex Summary by Currency</CardTitle>
              <CardDescription>
                Aggregated gains and losses for each foreign currency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Currency</th>
                      <th className="text-right p-3 font-semibold">Transactions</th>
                      <th className="text-right p-3 font-semibold">Realized Gain/Loss</th>
                      <th className="text-right p-3 font-semibold">Unrealized Gain/Loss</th>
                      <th className="text-right p-3 font-semibold">Net Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currencySummary.map((curr, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                              {curr.currency}
                            </div>
                            <span className="font-semibold">{curr.currency}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">{curr.transactions}</td>
                        <td className="p-3 text-right font-mono">
                          <span
                            className={
                              curr.realized >= 0 ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            AED {curr.realized >= 0 ? '+' : ''}
                            {curr.realized.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono">
                          AED {curr.unrealized.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono font-semibold">
                          <span
                            className={curr.net >= 0 ? 'text-green-600' : 'text-red-600'}
                          >
                            AED {curr.net >= 0 ? '+' : ''}
                            {curr.net.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 bg-gray-50">
                      <td className="p-3 font-semibold">Total</td>
                      <td className="p-3 text-right font-semibold">
                        {currencySummary.reduce((sum, c) => sum + c.transactions, 0)}
                      </td>
                      <td className="p-3 text-right font-mono font-semibold">
                        <span
                          className={
                            summary.netGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          AED {summary.netGainLoss >= 0 ? '+' : ''}
                          {summary.netGainLoss.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-semibold">AED 0</td>
                      <td className="p-3 text-right font-mono font-semibold">
                        <span
                          className={
                            summary.netGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          AED {summary.netGainLoss >= 0 ? '+' : ''}
                          {summary.netGainLoss.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trend</CardTitle>
                <CardDescription>Forex gain/loss over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { month: 'October 2025', gain: 610, loss: -200 },
                    { month: 'September 2025', gain: 1200, loss: -450 },
                    { month: 'August 2025', gain: 890, loss: -320 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{item.month}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.gain + item.loss >= 0 ? 'Net Gain' : 'Net Loss'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            item.gain + item.loss >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          AED {(item.gain + item.loss).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          +{item.gain} / {item.loss}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Analysis</CardTitle>
                <CardDescription>Forex impact on profitability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Total Revenue Impact</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    +AED 2,090
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Year to Date</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">Cost Variance</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    -AED 970
                  </p>
                  <p className="text-xs text-purple-700 mt-1">On Purchases</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Net Profitability Impact</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    +0.18%
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Forex contributed AED 1,120 to bottom line
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Optimize your forex exposure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-orange-500 bg-orange-50 rounded">
                  <p className="font-medium text-orange-900">High Volatility: USD</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Consider hedging USD purchases above AED 50,000 to minimize risk
                  </p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50 rounded">
                  <p className="font-medium text-green-900">Favorable Trend: INR</p>
                  <p className="text-sm text-green-700 mt-1">
                    Current INR weakness provides good opportunity for Indian supplier purchases
                  </p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <p className="font-medium text-blue-900">Forward Contract Opportunity</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Lock in EUR rates for Q4 European perfume imports
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
