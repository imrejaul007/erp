'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  PieChart,
  BarChart3,
  Calculator,
  Activity,
  ArrowUpDown,
  Percent,
  CreditCard,
  Banknote,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar,
} from 'recharts';

interface FinancialIntelligenceProps {
  period?: 'monthly' | 'quarterly' | 'yearly';
  storeId?: string;
  dateRange?: { start: Date; end: Date };
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F'];

export default function FinancialIntelligence({ period = 'monthly', storeId, dateRange }: FinancialIntelligenceProps) {
  const [profitabilityData, setProfitabilityData] = useState<any>({});
  const [costAnalysis, setCostAnalysis] = useState<any[]>([]);
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [roiAnalysis, setRoiAnalysis] = useState<any[]>([]);
  const [breakEvenAnalysis, setBreakEvenAnalysis] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, [period, storeId, dateRange]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('period', period);
      if (storeId) params.append('storeId', storeId);

      const [profitRes, costRes, cashflowRes, roiRes, breakEvenRes, kpisRes] = await Promise.all([
        fetch(`/api/analytics/financial?type=profitability&${params.toString()}`),
        fetch(`/api/analytics/financial?type=costs&${params.toString()}`),
        fetch(`/api/analytics/financial?type=cashflow&${params.toString()}`),
        fetch(`/api/analytics/financial?type=roi&${params.toString()}`),
        fetch(`/api/analytics/financial?type=breakeven&${params.toString()}`),
        fetch(`/api/analytics/financial?type=kpis&${params.toString()}`),
      ]);

      const [profitData, costData, cashflowData, roiData, breakEvenData, kpisData] = await Promise.all([
        profitRes.json(),
        costRes.json(),
        cashflowRes.json(),
        roiRes.json(),
        breakEvenRes.json(),
        kpisRes.json(),
      ]);

      setProfitabilityData(profitData);
      setCostAnalysis(costData.costBreakdown);
      setCashFlowData(cashflowData.cashFlowData);
      setRoiAnalysis(roiData.campaigns);
      setBreakEvenAnalysis(breakEvenData.analysis);
      setKpis(kpisData.kpis);

    } catch (error) {
      console.error('Error fetching financial analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getBenchmarkColor = (value: number, benchmark: number, higherIsBetter: boolean = true) => {
    const isAbove = value > benchmark;
    if (higherIsBetter) {
      return isAbove ? 'text-green-600' : 'text-red-600';
    } else {
      return isAbove ? 'text-red-600' : 'text-green-600';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading financial intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-oud-800">Financial Intelligence</h2>
          <p className="text-oud-600">Comprehensive financial analysis and business performance insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Gross Margin</p>
                <p className="text-xl font-bold text-oud-800">
                  {formatPercentage(kpis.grossMargin || 0)}
                </p>
              </div>
              <Percent className="h-8 w-8 text-oud-500" />
            </div>
            <div className="mt-2 text-xs">
              <span className={getBenchmarkColor(kpis.grossMargin || 0, 35)}>
                vs 35% benchmark
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Current Ratio</p>
                <p className="text-xl font-bold text-oud-800">
                  {(kpis.currentRatio || 0).toFixed(1)}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-oud-500" />
            </div>
            <div className="mt-2 text-xs">
              <span className={getBenchmarkColor(kpis.currentRatio || 0, 2)}>
                vs 2.0 benchmark
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">ROE</p>
                <p className="text-xl font-bold text-oud-800">
                  {formatPercentage(kpis.returnOnEquity || 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-oud-500" />
            </div>
            <div className="mt-2 text-xs">
              <span className={getBenchmarkColor(kpis.returnOnEquity || 0, 18)}>
                vs 18% benchmark
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Working Capital</p>
                <p className="text-xl font-bold text-oud-800">
                  {formatCurrency(kpis.workingCapital || 0)}
                </p>
              </div>
              <Banknote className="h-8 w-8 text-oud-500" />
            </div>
            <div className="mt-2 text-xs text-green-600">
              Healthy liquidity
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profitability" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
          <TabsTrigger value="breakeven">Break Even</TabsTrigger>
        </TabsList>

        {/* Profitability Analysis Tab */}
        <TabsContent value="profitability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Profitability */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-oud-500" />
                  Product Profitability
                </CardTitle>
                <CardDescription>Revenue vs profit by product</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={profitabilityData.productProfitability || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8B4513" name="Revenue" />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#D2B48C"
                      strokeWidth={3}
                      name="Profit"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Store Profitability */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Store Performance</CardTitle>
                <CardDescription>Profitability by location</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitabilityData.storeProfitability || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="storeName" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Profit']}
                    />
                    <Bar dataKey="profit" fill="#CD853F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Profitability Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Margin Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-oud-600">Gross Margin:</span>
                    <span className="font-bold text-oud-800">{formatPercentage(kpis.grossMargin || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-oud-600">Net Margin:</span>
                    <span className="font-bold text-oud-800">{formatPercentage(kpis.netMargin || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-oud-600">Operating Margin:</span>
                    <span className="font-bold text-oud-800">24.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Returns Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-oud-600">ROA:</span>
                    <span className="font-bold text-oud-800">{formatPercentage(kpis.returnOnAssets || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-oud-600">ROE:</span>
                    <span className="font-bold text-oud-800">{formatPercentage(kpis.returnOnEquity || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-oud-600">ROIC:</span>
                    <span className="font-bold text-oud-800">19.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Efficiency Ratios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-oud-600">Inventory Turnover:</span>
                    <span className="font-bold text-oud-800">{(kpis.inventoryTurnover || 0).toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-oud-600">Receivables Turnover:</span>
                    <span className="font-bold text-oud-800">{(kpis.receivablesTurnover || 0).toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-oud-600">Asset Utilization:</span>
                    <span className="font-bold text-oud-800">1.8x</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cost Analysis Tab */}
        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-oud-500" />
                  Cost Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Cost']}
                    />
                    <Legend />
                    <RechartsPieChart
                      data={costAnalysis.map(cost => ({
                        name: cost.category,
                        value: cost.currentMonth
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {costAnalysis.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost Trend */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Cost Trend Analysis</CardTitle>
                <CardDescription>Month-over-month cost changes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'change' ? formatPercentage(value) : formatCurrency(value),
                        name === 'change' ? 'Change %' : 'Current Month'
                      ]}
                    />
                    <Bar dataKey="currentMonth" fill="#8B4513" name="Current Month" />
                    <Line
                      type="monotone"
                      dataKey="change"
                      stroke="#D2B48C"
                      strokeWidth={3}
                      name="Change %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Cost Details Table */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Detailed Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Category</th>
                      <th className="text-right py-2 px-4 text-oud-700">Current Month</th>
                      <th className="text-right py-2 px-4 text-oud-700">Previous Month</th>
                      <th className="text-right py-2 px-4 text-oud-700">Change</th>
                      <th className="text-right py-2 px-4 text-oud-700">% of Total</th>
                      <th className="text-center py-2 px-4 text-oud-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costAnalysis.map((cost, index) => (
                      <tr key={index} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4 font-medium text-oud-800">{cost.category}</td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatCurrency(cost.currentMonth)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-600">
                          {formatCurrency(cost.previousMonth)}
                        </td>
                        <td className={`text-right py-3 px-4 font-medium ${
                          cost.change > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {cost.change > 0 ? '+' : ''}{formatPercentage(cost.change)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatPercentage(cost.percentage)}
                        </td>
                        <td className="text-center py-3 px-4">
                          {getTrendIcon(cost.currentMonth, cost.previousMonth)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cash Flow Chart */}
            <Card className="card-luxury lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5 text-oud-500" />
                  Cash Flow Analysis
                </CardTitle>
                <CardDescription>Monthly cash inflows, outflows, and net position</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Legend />
                    <Bar dataKey="inflow" fill="#22c55e" name="Cash Inflow" />
                    <Bar dataKey="outflow" fill="#ef4444" name="Cash Outflow" />
                    <Line
                      type="monotone"
                      dataKey="netFlow"
                      stroke="#8B4513"
                      strokeWidth={3}
                      name="Net Cash Flow"
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeFlow"
                      fill="#D2B48C"
                      fillOpacity={0.3}
                      stroke="#CD853F"
                      name="Cumulative Flow"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="card-luxury">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-oud-600">Current Cash Position</p>
                  <p className="text-2xl font-bold text-oud-800">
                    {formatCurrency(cashFlowData[cashFlowData.length - 1]?.cumulativeFlow || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-oud-600">Average Monthly Inflow</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      cashFlowData.reduce((sum, cf) => sum + cf.inflow, 0) / cashFlowData.length || 0
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-oud-600">Cash Conversion Cycle</p>
                  <p className="text-2xl font-bold text-oud-800">32 days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ROI Analysis Tab */}
        <TabsContent value="roi" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign ROI */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-oud-500" />
                  Marketing Campaign ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roiAnalysis} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="campaign" type="category" width={120} />
                    <Tooltip
                      formatter={(value: number) => [formatPercentage(value), 'ROI']}
                    />
                    <Bar dataKey="roi" fill="#8B4513" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Investment Summary */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Investment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-oud-600">Total Investment</p>
                    <p className="text-2xl font-bold text-oud-800">
                      {formatCurrency(roiAnalysis.reduce((sum, campaign) => sum + campaign.investment, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-oud-600">Total Return</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(roiAnalysis.reduce((sum, campaign) => sum + campaign.profit, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-oud-600">Average ROI</p>
                    <p className="text-2xl font-bold text-oud-800">
                      {formatPercentage(roiAnalysis.reduce((sum, campaign) => sum + campaign.roi, 0) / roiAnalysis.length || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI Details Table */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Campaign Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Campaign</th>
                      <th className="text-right py-2 px-4 text-oud-700">Investment</th>
                      <th className="text-right py-2 px-4 text-oud-700">Revenue</th>
                      <th className="text-right py-2 px-4 text-oud-700">Profit</th>
                      <th className="text-right py-2 px-4 text-oud-700">ROI</th>
                      <th className="text-center py-2 px-4 text-oud-700">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roiAnalysis.map((campaign, index) => (
                      <tr key={index} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4 font-medium text-oud-800">{campaign.campaign}</td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatCurrency(campaign.investment)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatCurrency(campaign.revenue)}
                        </td>
                        <td className="text-right py-3 px-4 text-green-600">
                          {formatCurrency(campaign.profit)}
                        </td>
                        <td className="text-right py-3 px-4 font-bold text-oud-800">
                          {formatPercentage(campaign.roi)}
                        </td>
                        <td className="text-center py-3 px-4 text-oud-600">{campaign.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Break Even Analysis Tab */}
        <TabsContent value="breakeven" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-oud-500" />
                Break Even Analysis
              </CardTitle>
              <CardDescription>New product break-even calculations and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {breakEvenAnalysis.map((product, index) => (
                  <div key={index} className="border border-oud-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-oud-800 mb-4">{product.productName}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-oud-700 mb-3">Cost Structure</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-oud-600">Fixed Costs:</span>
                            <span className="font-medium">{formatCurrency(product.fixedCosts)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-oud-600">Variable Cost/Unit:</span>
                            <span className="font-medium">{formatCurrency(product.variableCostPerUnit)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-oud-600">Selling Price/Unit:</span>
                            <span className="font-medium">{formatCurrency(product.sellingPricePerUnit)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-oud-700 mb-3">Break Even Point</h4>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-oud-800">{product.breakEvenUnits}</p>
                          <p className="text-sm text-oud-600">Units to break even</p>
                        </div>
                        <div className="text-center mt-3">
                          <p className="text-xl font-bold text-green-600">{formatCurrency(product.breakEvenRevenue)}</p>
                          <p className="text-sm text-oud-600">Revenue to break even</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-oud-700 mb-3">Timeline</h4>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-600">{product.monthsToBreakEven.toFixed(1)}</p>
                          <p className="text-sm text-oud-600">Months to break even</p>
                        </div>
                      </div>
                    </div>

                    {/* Break Even Visualization */}
                    <div className="mt-6">
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart
                          data={Array.from({ length: Math.ceil(product.breakEvenUnits * 1.5) }, (_, i) => {
                            const units = i * 10;
                            const revenue = units * product.sellingPricePerUnit;
                            const totalCost = product.fixedCosts + (units * product.variableCostPerUnit);
                            return {
                              units,
                              revenue,
                              totalCost,
                              profit: revenue - totalCost,
                            };
                          })}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="units" />
                          <YAxis />
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Line type="monotone" dataKey="revenue" stroke="#22c55e" name="Revenue" />
                          <Line type="monotone" dataKey="totalCost" stroke="#ef4444" name="Total Cost" />
                          <Line type="monotone" dataKey="profit" stroke="#8B4513" name="Profit" strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}