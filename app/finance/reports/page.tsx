'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, FileText, BarChart3, PieChart, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReportData {
  profitLoss?: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    vatCollected: number;
    vatPaid: number;
  };
  balanceSheet?: {
    totalAssets: number;
    totalLiabilities: number;
    equity: number;
  };
  cashFlow?: {
    operatingActivities: number;
    investingActivities: number;
    financingActivities: number;
    netCashFlow: number;
  };
}

export default function FinancialReportsPage() {
  const router = useRouter();
  const [reportType, setReportType] = useState('profit-loss');
  const [period, setPeriod] = useState('monthly');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const [year, monthNum] = month.split('-');

      let apiUrl = '';

      switch (reportType) {
        case 'profit-loss':
          apiUrl = `/api/reports/profit-loss?year=${year}&month=${monthNum}`;
          break;
        case 'balance-sheet':
          apiUrl = `/api/reports/balance-sheet?year=${year}&month=${monthNum}`;
          break;
        case 'cash-flow':
          apiUrl = `/api/reports/cash-flow?year=${year}&month=${monthNum}`;
          break;
        default:
          toast.info('This report type is coming soon');
          setLoading(false);
          return;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();

      // Store report data based on type
      const newReportData: ReportData = {};
      if (reportType === 'profit-loss') {
        newReportData.profitLoss = data.data;
      } else if (reportType === 'balance-sheet') {
        newReportData.balanceSheet = data.data;
      } else if (reportType === 'cash-flow') {
        newReportData.cashFlow = data.data;
      }

      setReportData(newReportData);
      toast.success('Report generated successfully');
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast.error(error.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    toast.info('PDF export coming soon');
  };

  const handleDownloadExcel = () => {
    toast.info('Excel export coming soon');
  };

  const reportTypes = [
    {
      value: 'profit-loss',
      label: 'Profit & Loss Statement',
      description: 'Income and expenses summary',
      icon: TrendingUp,
    },
    {
      value: 'balance-sheet',
      label: 'Balance Sheet',
      description: 'Assets, liabilities, and equity',
      icon: BarChart3,
    },
    {
      value: 'cash-flow',
      label: 'Cash Flow Statement',
      description: 'Cash inflows and outflows',
      icon: FileText,
    },
    {
      value: 'vat-report',
      label: 'VAT Report',
      description: 'VAT collection and compliance',
      icon: FileText,
    },
    {
      value: 'expense-breakdown',
      label: 'Expense Breakdown',
      description: 'Detailed expense analysis',
      icon: PieChart,
    },
    {
      value: 'revenue-analysis',
      label: 'Revenue Analysis',
      description: 'Revenue trends and sources',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-amber-600" />
            Financial Reports
          </h1>
          <p className="text-muted-foreground">Generate and export financial reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Select report type and period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="month">Month/Year</Label>
                <Input
                  id="month"
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Export Options:</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleDownloadExcel}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Types Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Select a report type to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card
                      key={type.value}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        reportType === type.value ? 'border-amber-500 bg-amber-50' : ''
                      }`}
                      onClick={() => setReportType(type.value)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 p-2 rounded-lg">
                            <Icon className="h-6 w-6 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{type.label}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>
                {reportTypes.find((t) => t.value === reportType)?.label} - {period.charAt(0).toUpperCase() + period.slice(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!reportData ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                  <FileText className="h-16 w-16 text-amber-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Report Preview</h3>
                  <p className="text-muted-foreground mb-4">
                    Click "Generate Report" to view the {reportTypes.find((t) => t.value === reportType)?.label}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Change Period
                    </Button>
                    <Button
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700"
                      onClick={handleGenerateReport}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {reportData.profitLoss && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Profit & Loss Statement</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-600">
                            AED {reportData.profitLoss.totalRevenue.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Total Expenses</p>
                          <p className="text-2xl font-bold text-red-600">
                            AED {reportData.profitLoss.totalExpenses.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Net Profit</p>
                          <p className="text-2xl font-bold text-blue-600">
                            AED {reportData.profitLoss.netProfit.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Profit Margin</p>
                          <p className="text-2xl font-bold text-amber-600">
                            {reportData.profitLoss.profitMargin.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">VAT Summary</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">VAT Collected</p>
                            <p className="text-lg font-semibold">
                              AED {reportData.profitLoss.vatCollected.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">VAT Paid</p>
                            <p className="text-lg font-semibold">
                              AED {reportData.profitLoss.vatPaid.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {reportData.balanceSheet && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Balance Sheet</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Total Assets</p>
                          <p className="text-2xl font-bold text-green-600">
                            AED {reportData.balanceSheet.totalAssets.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Total Liabilities</p>
                          <p className="text-2xl font-bold text-red-600">
                            AED {reportData.balanceSheet.totalLiabilities.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Equity</p>
                          <p className="text-2xl font-bold text-blue-600">
                            AED {reportData.balanceSheet.equity.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {reportData.cashFlow && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Cash Flow Statement</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Operating Activities</p>
                          <p className="text-2xl font-bold">
                            AED {reportData.cashFlow.operatingActivities.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Investing Activities</p>
                          <p className="text-2xl font-bold">
                            AED {reportData.cashFlow.investingActivities.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Financing Activities</p>
                          <p className="text-2xl font-bold">
                            AED {reportData.cashFlow.financingActivities.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="border rounded-lg p-4 bg-amber-50">
                          <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                          <p className="text-2xl font-bold text-amber-600">
                            AED {reportData.cashFlow.netCashFlow.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Input({ id, type, value, onChange }: any) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
