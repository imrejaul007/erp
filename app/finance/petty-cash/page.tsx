'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Wallet,
  Plus,
  Minus,
  Search,
  Filter,
  Calendar,
  Download,
  Upload,
  Receipt,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  User,
  Building,
  Coffee,
  Car,
  Fuel,
  FileText,
  Calculator
} from 'lucide-react';

export default function PettyCashPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('current-month');
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isReplenishOpen, setIsReplenishOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Petty Cash Fund Setup
  const pettyCashFund = {
    fundName: 'Main Petty Cash Fund',
    location: 'Dubai Office',
    custodian: 'Fatima Al-Zahra',
    authorizedLimit: 2000,
    currentBalance: 435.75,
    lastReplenishment: '2024-09-20',
    replenishmentAmount: 1564.25,
    status: 'Active'
  };

  // Petty Cash Transactions
  const transactions = [
    {
      id: 'PC-001',
      date: '2024-09-30',
      type: 'Expense',
      description: 'Office supplies - printer paper and pens',
      category: 'Office Supplies',
      amount: 45.50,
      balance: 435.75,
      employee: 'Omar Hassan',
      approvedBy: 'Fatima Al-Zahra',
      receipt: 'REC-001',
      status: 'Approved',
      vatAmount: 2.28
    },
    {
      id: 'PC-002',
      date: '2024-09-29',
      type: 'Expense',
      description: 'Taxi fare for client meeting',
      category: 'Transportation',
      amount: 35.00,
      balance: 481.25,
      employee: 'Aisha Al-Blooshi',
      approvedBy: 'Fatima Al-Zahra',
      receipt: 'REC-002',
      status: 'Approved',
      vatAmount: 1.75
    },
    {
      id: 'PC-003',
      date: '2024-09-28',
      type: 'Expense',
      description: 'Coffee and refreshments for meeting',
      category: 'Refreshments',
      amount: 85.75,
      balance: 516.25,
      employee: 'Omar Hassan',
      approvedBy: 'Fatima Al-Zahra',
      receipt: 'REC-003',
      status: 'Approved',
      vatAmount: 4.29
    },
    {
      id: 'PC-004',
      date: '2024-09-27',
      type: 'Expense',
      description: 'Parking fees - business district',
      category: 'Transportation',
      amount: 25.00,
      balance: 602.00,
      employee: 'Fatima Al-Zahra',
      approvedBy: 'Admin',
      receipt: 'REC-004',
      status: 'Approved',
      vatAmount: 1.25
    },
    {
      id: 'PC-005',
      date: '2024-09-26',
      type: 'Expense',
      description: 'Emergency repair - office lock',
      category: 'Maintenance',
      amount: 120.00,
      balance: 627.00,
      employee: 'Building Management',
      approvedBy: 'Fatima Al-Zahra',
      receipt: 'REC-005',
      status: 'Approved',
      vatAmount: 6.00
    },
    {
      id: 'PC-006',
      date: '2024-09-25',
      type: 'Expense',
      description: 'Cleaning supplies for office',
      category: 'Office Supplies',
      amount: 65.25,
      balance: 747.00,
      employee: 'Omar Hassan',
      approvedBy: 'Fatima Al-Zahra',
      receipt: 'REC-006',
      status: 'Approved',
      vatAmount: 3.26
    },
    {
      id: 'PC-007',
      date: '2024-09-20',
      type: 'Replenishment',
      description: 'Petty cash fund replenishment',
      category: 'Fund Management',
      amount: 1564.25,
      balance: 2000.00,
      employee: 'Bank Transfer',
      approvedBy: 'Admin',
      receipt: 'BANK-001',
      status: 'Completed',
      vatAmount: 0
    },
    {
      id: 'PC-008',
      date: '2024-09-18',
      type: 'Expense',
      description: 'Courier service - urgent delivery',
      category: 'Transportation',
      amount: 48.00,
      balance: 435.75,
      employee: 'Aisha Al-Blooshi',
      approvedBy: 'Fatima Al-Zahra',
      receipt: 'REC-007',
      status: 'Pending',
      vatAmount: 2.40
    }
  ];

  // Expense Categories
  const expenseCategories = [
    {
      category: 'Office Supplies',
      monthlyBudget: 300,
      monthlySpent: 110.75,
      transactions: 2,
      percentage: 36.9
    },
    {
      category: 'Transportation',
      monthlyBudget: 250,
      monthlySpent: 108.00,
      transactions: 3,
      percentage: 43.2
    },
    {
      category: 'Refreshments',
      monthlyBudget: 200,
      monthlySpent: 85.75,
      transactions: 1,
      percentage: 42.9
    },
    {
      category: 'Maintenance',
      monthlyBudget: 150,
      monthlySpent: 120.00,
      transactions: 1,
      percentage: 80.0
    },
    {
      category: 'Miscellaneous',
      monthlyBudget: 100,
      monthlySpent: 0,
      transactions: 0,
      percentage: 0
    }
  ];

  // Fund Analysis
  const fundAnalysis = {
    totalSpentThisMonth: 424.25,
    averageDailySpend: 14.14,
    totalTransactions: 8,
    averageTransactionSize: 53.03,
    daysUntilEmpty: Math.floor(pettyCashFund.currentBalance / 14.14),
    topCategory: 'Transportation',
    utilizationRate: (pettyCashFund.authorizedLimit - pettyCashFund.currentBalance) / pettyCashFund.authorizedLimit * 100
  };

  const formatAED = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Approved': 'bg-green-100 text-green-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getTransactionTypeBadge = (type: string) => {
    const typeConfig = {
      'Expense': 'bg-red-100 text-red-800',
      'Replenishment': 'bg-green-100 text-green-800',
      'Adjustment': 'bg-purple-100 text-purple-800'
    };
    return typeConfig[type as keyof typeof typeConfig] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const iconConfig = {
      'Office Supplies': FileText,
      'Transportation': Car,
      'Refreshments': Coffee,
      'Maintenance': Building,
      'Fuel': Fuel,
      'Miscellaneous': DollarSign
    };
    return iconConfig[category as keyof typeof iconConfig] || DollarSign;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const currentMonthExpenses = transactions
    .filter(t => t.type === 'Expense' && t.date.startsWith('2024-09'))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Wallet className="h-8 w-8 text-amber-600" />
            Petty Cash Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track small cash expenses, manage fund balances, and monitor spending limits
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isReplenishOpen} onOpenChange={setIsReplenishOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Replenish Fund
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Replenish Petty Cash Fund</DialogTitle>
                <DialogDescription>
                  Add money to the petty cash fund to restore it to the authorized limit
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Balance</Label>
                    <Input value={formatAED(pettyCashFund.currentBalance)} readonly />
                  </div>
                  <div className="space-y-2">
                    <Label>Authorized Limit</Label>
                    <Input value={formatAED(pettyCashFund.authorizedLimit)} readonly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replenish-amount">Replenishment Amount</Label>
                  <Input
                    id="replenish-amount"
                    type="number"
                    placeholder="0.00"
                    defaultValue={(pettyCashFund.authorizedLimit - pettyCashFund.currentBalance).toFixed(2)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Funding Source</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select funding source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash-withdrawal">Cash Withdrawal</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference</Label>
                  <Input id="reference" placeholder="Bank reference or check number" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReplenishOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Replenish Fund
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
                <Minus className="h-4 w-4" />
                Record Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record Petty Cash Expense</DialogTitle>
                <DialogDescription>
                  Record a new expense from the petty cash fund
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Date</Label>
                    <Input id="expense-date" type="date" defaultValue="2024-09-30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee">Employee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="omar">Omar Hassan</SelectItem>
                        <SelectItem value="aisha">Aisha Al-Blooshi</SelectItem>
                        <SelectItem value="fatima">Fatima Al-Zahra</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Detailed description of the expense" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office-supplies">Office Supplies</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="refreshments">Refreshments</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (AED)</Label>
                    <Input id="amount" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receipt-number">Receipt Number</Label>
                    <Input id="receipt-number" placeholder="REC-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vat-amount">VAT Amount (5%)</Label>
                    <Input id="vat-amount" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Receipt Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Button variant="outline">Upload Receipt</Button>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExpenseOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Record Expense
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Fund Status Card */}
      <Card className="border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-amber-600" />
            {pettyCashFund.fundName}
          </CardTitle>
          <CardDescription>
            Managed by {pettyCashFund.custodian} • {pettyCashFund.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm text-gray-600">Current Balance</Label>
              <div className="text-3xl font-bold text-amber-600">
                {formatAED(pettyCashFund.currentBalance)}
              </div>
              <div className="text-sm text-gray-600">
                of {formatAED(pettyCashFund.authorizedLimit)} limit
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Utilization Rate</Label>
              <div className="text-2xl font-bold text-gray-900">
                {fundAnalysis.utilizationRate.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-amber-600 h-2 rounded-full"
                  style={{width: `${fundAnalysis.utilizationRate}%`}}
                ></div>
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Last Replenishment</Label>
              <div className="text-lg font-bold text-gray-900">
                {pettyCashFund.lastReplenishment}
              </div>
              <div className="text-sm text-gray-600">
                {formatAED(pettyCashFund.replenishmentAmount)}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Status</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusBadge(pettyCashFund.status)}>
                  {pettyCashFund.status}
                </Badge>
                {pettyCashFund.currentBalance < (pettyCashFund.authorizedLimit * 0.2) && (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Monthly Spending
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(currentMonthExpenses)}
            </div>
            <p className="text-xs text-red-600 mt-1">
              {fundAnalysis.totalTransactions} transactions this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Transaction
            </CardTitle>
            <Calculator className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(fundAnalysis.averageTransactionSize)}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {formatAED(fundAnalysis.averageDailySpend)} daily average
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Top Category
            </CardTitle>
            <Car className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {fundAnalysis.topCategory}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              {formatAED(108)} spent this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Days Until Empty
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {fundAnalysis.daysUntilEmpty}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              At current spending rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions" className="flex items-center">
            <Receipt className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Fund Settings
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-amber-600" />
                Petty Cash Transactions
              </CardTitle>
              <CardDescription>
                All petty cash expenses, replenishments, and adjustments
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
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Refreshments">Refreshments</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[150px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="current-quarter">Current Quarter</SelectItem>
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
                      <TableHead>Category</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Receipt</TableHead>
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
                          <div className="max-w-xs">
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-500">{transaction.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {React.createElement(getCategoryIcon(transaction.category), {
                              className: "h-4 w-4 text-gray-500"
                            })}
                            {transaction.category}
                          </div>
                        </TableCell>
                        <TableCell>{transaction.employee}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            transaction.type === 'Expense' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.type === 'Expense' ? '-' : '+'}
                            {formatAED(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAED(transaction.balance)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Receipt className="h-3 w-3 text-gray-400" />
                            <span className="text-sm font-mono">{transaction.receipt}</span>
                          </div>
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

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                Expense Categories
              </CardTitle>
              <CardDescription>
                Monthly budget tracking and spending analysis by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Monthly Budget</TableHead>
                      <TableHead>Amount Spent</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Usage %</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseCategories.map((category) => {
                      const remaining = category.monthlyBudget - category.monthlySpent;
                      const usagePercent = (category.monthlySpent / category.monthlyBudget) * 100;
                      const Icon = getCategoryIcon(category.category);

                      return (
                        <TableRow key={category.category}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{category.category}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatAED(category.monthlyBudget)}
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              usagePercent > 80 ? 'text-red-600' : usagePercent > 60 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {formatAED(category.monthlySpent)}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatAED(remaining)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {category.transactions}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              usagePercent > 80 ? 'text-red-600' : usagePercent > 60 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {usagePercent.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  usagePercent > 80 ? 'bg-red-500' : usagePercent > 60 ? 'bg-orange-500' : 'bg-green-500'
                                }`}
                                style={{width: `${Math.min(usagePercent, 100)}%`}}
                              ></div>
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
                  <h3 className="font-semibold text-green-900">Within Budget</h3>
                  <p className="text-2xl font-bold text-green-600">3</p>
                  <p className="text-sm text-green-700">categories on track</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900">Approaching Limit</h3>
                  <p className="text-2xl font-bold text-orange-600">1</p>
                  <p className="text-sm text-orange-700">category over 60%</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900">Over Budget</h3>
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-sm text-red-700">category exceeded limit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-amber-600" />
                  Spending Trends
                </CardTitle>
                <CardDescription>
                  Monthly petty cash usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <div className="text-center">
                    <Calculator className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Spending Trends Chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Fund Performance</CardTitle>
                <CardDescription>
                  Key metrics and fund utilization analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Fund Utilization</span>
                      <span className="text-amber-600 font-bold">
                        {fundAnalysis.utilizationRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full"
                        style={{width: `${fundAnalysis.utilizationRate}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Monthly Budget Usage</span>
                      <span className="text-blue-600 font-bold">72.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '72.5%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Transaction Frequency</span>
                      <span className="text-green-600 font-bold">Normal</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Insights</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Transportation expenses are trending higher this month</li>
                      <li>• Maintenance category exceeded budget by 80%</li>
                      <li>• Average transaction size increased by 15%</li>
                      <li>• Fund replenishment recommended within 30 days</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fund Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-amber-600" />
                  Fund Configuration
                </CardTitle>
                <CardDescription>
                  Manage petty cash fund settings and limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fund-name">Fund Name</Label>
                    <Input id="fund-name" defaultValue={pettyCashFund.fundName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={pettyCashFund.location} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custodian">Fund Custodian</Label>
                    <Select defaultValue="fatima">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fatima">Fatima Al-Zahra</SelectItem>
                        <SelectItem value="omar">Omar Hassan</SelectItem>
                        <SelectItem value="aisha">Aisha Al-Blooshi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorized-limit">Authorized Limit (AED)</Label>
                    <Input
                      id="authorized-limit"
                      type="number"
                      defaultValue={pettyCashFund.authorizedLimit}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="replenishment-threshold">Replenishment Threshold (%)</Label>
                    <Input id="replenishment-threshold" type="number" defaultValue="20" />
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Update Settings
                  </Button>
                  <Button variant="outline">
                    Reset to Default
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Approval Workflow</CardTitle>
                <CardDescription>
                  Configure approval limits and workflow rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="auto-approve-limit">Auto-approve limit (AED)</Label>
                    <Input id="auto-approve-limit" type="number" defaultValue="50" />
                    <p className="text-sm text-gray-600">
                      Expenses below this amount are auto-approved
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manager-approval-limit">Manager approval limit (AED)</Label>
                    <Input id="manager-approval-limit" type="number" defaultValue="200" />
                    <p className="text-sm text-gray-600">
                      Expenses above this amount require manager approval
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Required Documentation</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="receipt-required" defaultChecked />
                        <Label htmlFor="receipt-required">Receipt required for all expenses</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="photo-receipt" defaultChecked />
                        <Label htmlFor="photo-receipt">Photo receipt for expenses {'>'}  AED 25</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="justification" />
                        <Label htmlFor="justification">Written justification for expenses {'>'} AED 100</Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-900 mb-2">Current Workflow</h4>
                    <div className="space-y-2 text-sm text-amber-700">
                      <div>1. Employee submits expense with receipt</div>
                      <div>2. Auto-approve if ≤ AED 50</div>
                      <div>3. Custodian approval if AED 51-200</div>
                      <div>4. Manager approval if {'>'} AED 200</div>
                      <div>5. Record in general ledger</div>
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