'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, FileText, BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function FinancialReportsPage() {
  const router = useRouter();
  const [reportType, setReportType] = useState('profit-loss');
  const [period, setPeriod] = useState('monthly');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleGenerateReport = () => {
    toast.success('Report generated successfully');
  };

  const handleDownloadPDF = () => {
    toast.success('Downloading report as PDF...');
  };

  const handleDownloadExcel = () => {
    toast.success('Downloading report as Excel...');
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
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={handleGenerateReport}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
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
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={handleGenerateReport}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
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
