'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  CreditCard,
  Banknote,
  Receipt,
  PieChart,
  BarChart3,
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function FinancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('monthly');

  // Mock financial data
  const financialStats = [
    {
      title: "Monthly Revenue",
      value: "AED 89,230",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Monthly Expenses",
      value: "AED 32,450",
      change: "+8.2%",
      trend: "up",
      icon: CreditCard,
      color: "text-red-600"
    },
    {
      title: "Net Profit",
      value: "AED 56,780",
      change: "+15.8%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "VAT Collected",
      value: "AED 4,461",
      change: "+12.5%",
      trend: "up",
      icon: Receipt,
      color: "text-blue-600"
    }
  ];

  const transactions = [
    {
      id: "TXN-001",
      date: "2024-09-30",
      description: "Sale - Royal Oud Premium",
      category: "Sales Revenue",
      type: "Income",
      amount: 850,
      vatAmount: 42.5,
      status: "Completed",
      customer: "Ahmed Al-Rashid"
    },
    {
      id: "TXN-002",
      date: "2024-09-30",
      description: "Purchase - Raw Materials",
      category: "Inventory",
      type: "Expense",
      amount: 1200,
      vatAmount: 60,
      status: "Completed",
      vendor: "Al-Taiba Suppliers"
    },
    {
      id: "TXN-003",
      date: "2024-09-29",
      description: "Salary Payment - September",
      category: "Payroll",
      type: "Expense",
      amount: 15000,
      vatAmount: 0,
      status: "Completed",
      employee: "Staff Payroll"
    },
    {
      id: "TXN-004",
      date: "2024-09-29",
      description: "Rent Payment - October",
      category: "Operating Expenses",
      type: "Expense",
      amount: 8000,
      vatAmount: 400,
      status: "Pending",
      vendor: "Property Management"
    }
  ];

  const vatReports = [
    {
      period: "September 2024",
      totalSales: 89230,
      vatCollected: 4461.5,
      totalPurchases: 32450,
      vatPaid: 1622.5,
      netVAT: 2839,
      status: "Filed",
      dueDate: "2024-10-20"
    },
    {
      period: "August 2024",
      totalSales: 78540,
      vatCollected: 3927,
      totalPurchases: 28900,
      vatPaid: 1445,
      netVAT: 2482,
      status: "Filed",
      dueDate: "2024-09-20"
    },
    {
      period: "July 2024",
      totalSales: 82340,
      vatCollected: 4117,
      totalPurchases: 31200,
      vatPaid: 1560,
      netVAT: 2557,
      status: "Filed",
      dueDate: "2024-08-20"
    }
  ];

  const expenseCategories = [
    { name: "Raw Materials", amount: 18500, percentage: 45 },
    { name: "Payroll", amount: 15000, percentage: 36 },
    { name: "Operating Expenses", amount: 8000, percentage: 19 }
  ];

  const formatAED = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const getTransactionTypeBadge = (type: string) => {
    return type === 'Income'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Filed': 'bg-blue-100 text-blue-800',
      'Overdue': 'bg-red-100 text-red-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-8 w-8 text-amber-600" />
            Financial Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track revenue, expenses, VAT compliance, and financial reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={index} className="border-amber-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <TrendIcon className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center">
            <Receipt className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="vat" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            VAT Reports
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                  Revenue vs Expenses
                </CardTitle>
                <CardDescription>
                  Monthly comparison of income and expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Revenue vs Expenses Chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-amber-600" />
                  Expense Breakdown
                </CardTitle>
                <CardDescription>
                  Distribution of expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-gray-600">
                          {formatAED(category.amount)} ({category.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-amber-600 h-2 rounded-full"
                          style={{width: `${category.percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-100 mt-6">
            <CardHeader>
              <CardTitle>Quick Financial Summary</CardTitle>
              <CardDescription>
                Key financial metrics for current period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">Cash Flow</h3>
                  <p className="text-2xl font-bold text-green-600">{formatAED(56780)}</p>
                  <p className="text-sm text-green-700">Positive this month</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Profit Margin</h3>
                  <p className="text-2xl font-bold text-blue-600">63.6%</p>
                  <p className="text-sm text-blue-700">Above industry average</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900">Tax Liability</h3>
                  <p className="text-2xl font-bold text-amber-600">{formatAED(2839)}</p>
                  <p className="text-sm text-amber-700">VAT payable this period</p>
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
                <Receipt className="h-5 w-5 mr-2 text-amber-600" />
                Financial Transactions
              </CardTitle>
              <CardDescription>
                All income and expense transactions with VAT details
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
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>VAT</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-500">{transaction.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>
                          <Badge className={getTransactionTypeBadge(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.type === 'Income' ? '+' : '-'}{formatAED(transaction.amount)}
                        </TableCell>
                        <TableCell>{formatAED(transaction.vatAmount)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.customer || transaction.vendor || transaction.employee}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAT Reports Tab */}
        <TabsContent value="vat">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                UAE VAT Reports
              </CardTitle>
              <CardDescription>
                VAT collection, payment, and compliance reports (5% UAE VAT)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>VAT Collected</TableHead>
                      <TableHead>Total Purchases</TableHead>
                      <TableHead>VAT Paid</TableHead>
                      <TableHead>Net VAT</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vatReports.map((report, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{report.period}</TableCell>
                        <TableCell>{formatAED(report.totalSales)}</TableCell>
                        <TableCell className="text-green-600">{formatAED(report.vatCollected)}</TableCell>
                        <TableCell>{formatAED(report.totalPurchases)}</TableCell>
                        <TableCell className="text-red-600">{formatAED(report.vatPaid)}</TableCell>
                        <TableCell className="font-bold text-amber-600">{formatAED(report.netVAT)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(report.status)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">UAE VAT Compliance</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      All VAT calculations are based on the UAE's 5% standard rate.
                      Next VAT return is due on 20th October 2024. Ensure all transactions
                      are properly recorded and documented for compliance.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>
                  Revenue and profit trends over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Monthly trends chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Financial Health Score</CardTitle>
                <CardDescription>
                  Overall business financial performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Liquidity Ratio</span>
                      <span className="text-green-600 font-bold">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Profit Margin</span>
                      <span className="text-green-600 font-bold">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Growth Rate</span>
                      <span className="text-amber-600 font-bold">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{width: '68%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Cash Flow</span>
                      <span className="text-green-600 font-bold">Stable</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '82%'}}></div>
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