'use client';

import { useRouter } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Banknote,
  FileText,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft} from 'lucide-react';

export default function GeneralLedgerPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('current-month');
  const [filterAccount, setFilterAccount] = useState('all');
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Chart of Accounts
  const chartOfAccounts = [
    {
      code: '1000',
      name: 'Cash on Hand',
      type: 'Asset',
      category: 'Current Assets',
      balance: 25000,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '1010',
      name: 'Bank - Emirates NBD',
      type: 'Asset',
      category: 'Current Assets',
      balance: 185000,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '1020',
      name: 'Bank - ADCB USD',
      type: 'Asset',
      category: 'Current Assets',
      balance: 15000,
      currency: 'USD',
      status: 'Active'
    },
    {
      code: '1100',
      name: 'Accounts Receivable',
      type: 'Asset',
      category: 'Current Assets',
      balance: 45000,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '1200',
      name: 'Inventory - Finished Goods',
      type: 'Asset',
      category: 'Current Assets',
      balance: 125000,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '1300',
      name: 'Prepaid Expenses',
      type: 'Asset',
      category: 'Current Assets',
      balance: 8000,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '1500',
      name: 'Equipment',
      type: 'Asset',
      category: 'Fixed Assets',
      balance: 75000,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '2000',
      name: 'Accounts Payable',
      type: 'Liability',
      category: 'Current Liabilities',
      balance: 28000,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '2100',
      name: 'VAT Payable',
      type: 'Liability',
      category: 'Current Liabilities',
      balance: 4500,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '3000',
      name: 'Owner\'s Capital',
      type: 'Equity',
      category: 'Owner\'s Equity',
      balance: 350000,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '4000',
      name: 'Sales Revenue',
      type: 'Revenue',
      category: 'Operating Revenue',
      balance: 89230,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '5000',
      name: 'Cost of Goods Sold',
      type: 'Expense',
      category: 'Direct Expenses',
      balance: 25000,
      currency: 'AED',
      status: 'Active'
    },
    {
      code: '6000',
      name: 'Operating Expenses',
      type: 'Expense',
      category: 'Operating Expenses',
      balance: 15000,
      currency: 'AED',
      status: 'Active'
    }
  ];

  // General Ledger Entries
  const ledgerEntries = [
    {
      id: 'GL001',
      date: '2024-09-30',
      reference: 'INV-001',
      description: 'Sale of Royal Oud Premium to Ahmed Al-Rashid',
      accountCode: '4000',
      accountName: 'Sales Revenue',
      debit: 0,
      credit: 850,
      balance: 850,
      currency: 'AED',
      status: 'Posted',
      createdBy: 'Admin',
      vatAmount: 42.5
    },
    {
      id: 'GL002',
      date: '2024-09-30',
      reference: 'INV-001',
      description: 'VAT on sale - INV-001',
      accountCode: '2100',
      accountName: 'VAT Payable',
      debit: 0,
      credit: 42.5,
      balance: 42.5,
      currency: 'AED',
      status: 'Posted',
      createdBy: 'Admin',
      vatAmount: 0
    },
    {
      id: 'GL003',
      date: '2024-09-30',
      reference: 'INV-001',
      description: 'Cash received from customer',
      accountCode: '1000',
      accountName: 'Cash on Hand',
      debit: 892.5,
      credit: 0,
      balance: 892.5,
      currency: 'AED',
      status: 'Posted',
      createdBy: 'Admin',
      vatAmount: 0
    },
    {
      id: 'GL004',
      date: '2024-09-29',
      reference: 'PO-023',
      description: 'Purchase of raw materials from Al-Taiba Suppliers',
      accountCode: '1200',
      accountName: 'Inventory - Finished Goods',
      debit: 1200,
      credit: 0,
      balance: 1200,
      currency: 'AED',
      status: 'Posted',
      createdBy: 'Admin',
      vatAmount: 60
    },
    {
      id: 'GL005',
      date: '2024-09-29',
      reference: 'PO-023',
      description: 'VAT on purchase - PO-023',
      accountCode: '1300',
      accountName: 'Prepaid Expenses',
      debit: 60,
      credit: 0,
      balance: 60,
      currency: 'AED',
      status: 'Posted',
      createdBy: 'Admin',
      vatAmount: 0
    },
    {
      id: 'GL006',
      date: '2024-09-29',
      reference: 'PO-023',
      description: 'Payment to supplier',
      accountCode: '1010',
      accountName: 'Bank - Emirates NBD',
      debit: 0,
      credit: 1260,
      balance: 1260,
      currency: 'AED',
      status: 'Posted',
      createdBy: 'Admin',
      vatAmount: 0
    },
    {
      id: 'GL007',
      date: '2024-09-28',
      reference: 'SAL-001',
      description: 'Monthly salary payment',
      accountCode: '6000',
      accountName: 'Operating Expenses',
      debit: 15000,
      credit: 0,
      balance: 15000,
      currency: 'AED',
      status: 'Posted',
      createdBy: 'Admin',
      vatAmount: 0
    },
    {
      id: 'GL008',
      date: '2024-09-28',
      reference: 'SAL-001',
      description: 'Salary payment from bank',
      accountCode: '1010',
      accountName: 'Bank - Emirates NBD',
      debit: 0,
      credit: 15000,
      balance: 15000,
      currency: 'AED',
      status: 'Posted',
      createdBy: 'Admin',
      vatAmount: 0
    }
  ];

  const formatAED = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const getAccountTypeBadge = (type: string) => {
    const typeConfig = {
      'Asset': 'bg-blue-100 text-blue-800',
      'Liability': 'bg-red-100 text-red-800',
      'Equity': 'bg-purple-100 text-purple-800',
      'Revenue': 'bg-green-100 text-green-800',
      'Expense': 'bg-orange-100 text-orange-800'
    };
    return typeConfig[type as keyof typeof typeConfig] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Posted': 'bg-green-100 text-green-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Draft': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const filteredEntries = ledgerEntries.filter(entry =>
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccounts = chartOfAccounts.filter(account =>
    filterAccount === 'all' || account.type.toLowerCase() === filterAccount
  );

  // Calculate trial balance
  const trialBalance = chartOfAccounts.map(account => {
    const debits = ledgerEntries
      .filter(entry => entry.accountCode === account.code)
      .reduce((sum, entry) => sum + entry.debit, 0);

    const credits = ledgerEntries
      .filter(entry => entry.accountCode === account.code)
      .reduce((sum, entry) => sum + entry.credit, 0);

    const netBalance = debits - credits;

    return {
      ...account,
      totalDebits: debits,
      totalCredits: credits,
      netBalance: Math.abs(netBalance),
      normalSide: ['Asset', 'Expense'].includes(account.type) ? 'Debit' : 'Credit',
      balanceType: netBalance >= 0 ? 'Debit' : 'Credit'
    };
  });

  const totalDebits = trialBalance.reduce((sum, account) => sum + account.totalDebits, 0);
  const totalCredits = trialBalance.reduce((sum, account) => sum + account.totalCredits, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-amber-600" />
            General Ledger
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive double-entry bookkeeping system with chart of accounts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Journal Entry</DialogTitle>
                <DialogDescription>
                  Create a new general ledger journal entry
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" defaultValue="2024-09-30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference</Label>
                    <Input id="reference" placeholder="REF-001" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Journal entry description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="debit-account">Debit Account</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {chartOfAccounts.map((account) => (
                          <SelectItem key={account.code} value={account.code}>
                            {account.code} - {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credit-account">Credit Account</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {chartOfAccounts.map((account) => (
                          <SelectItem key={account.code} value={account.code}>
                            {account.code} - {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="AED">
                      <SelectTrigger>
                        <SelectValue />
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEntryOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Post Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Assets
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(trialBalance
                .filter(account => account.type === 'Asset')
                .reduce((sum, account) => sum + account.balance, 0)
              )}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Liabilities
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(trialBalance
                .filter(account => account.type === 'Liability')
                .reduce((sum, account) => sum + account.balance, 0)
              )}
            </div>
            <p className="text-xs text-red-600 mt-1">
              +3.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Owner's Equity
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatAED(trialBalance
                .filter(account => account.type === 'Equity')
                .reduce((sum, account) => sum + account.balance, 0)
              )}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Trial Balance Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              Balanced
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Debits = Credits: {formatAED(totalDebits)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entries" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Journal Entries
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Chart of Accounts
          </TabsTrigger>
          <TabsTrigger value="trial-balance" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Trial Balance
          </TabsTrigger>
          <TabsTrigger value="account-balances" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Account Balances
          </TabsTrigger>
        </TabsList>

        {/* Journal Entries Tab */}
        <TabsContent value="entries">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                Journal Entries
              </CardTitle>
              <CardDescription>
                All general ledger entries with double-entry bookkeeping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="current-quarter">Current Quarter</SelectItem>
                    <SelectItem value="current-year">Current Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>
                          <div className="font-medium">{entry.reference}</div>
                          <div className="text-sm text-gray-500">{entry.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium">{entry.description}</div>
                            {entry.vatAmount > 0 && (
                              <div className="text-sm text-gray-500">
                                VAT: {formatAED(entry.vatAmount)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.accountCode}</div>
                            <div className="text-sm text-gray-500">{entry.accountName}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {entry.debit > 0 ? formatCurrency(entry.debit, entry.currency) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {entry.credit > 0 ? formatCurrency(entry.credit, entry.currency) : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(entry.status)}>
                            {entry.status}
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

        {/* Chart of Accounts Tab */}
        <TabsContent value="accounts">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                Chart of Accounts
              </CardTitle>
              <CardDescription>
                Complete listing of all accounts used in the general ledger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Select value={filterAccount} onValueChange={setFilterAccount}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Account Types</SelectItem>
                    <SelectItem value="asset">Assets</SelectItem>
                    <SelectItem value="liability">Liabilities</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Account
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.code}>
                        <TableCell className="font-medium">{account.code}</TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>
                          <Badge className={getAccountTypeBadge(account.type)}>
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{account.category}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(account.balance, account.currency)}
                        </TableCell>
                        <TableCell>{account.currency}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(account.status)}>
                            {account.status}
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

        {/* Trial Balance Tab */}
        <TabsContent value="trial-balance">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-amber-600" />
                Trial Balance
              </CardTitle>
              <CardDescription>
                Verify that total debits equal total credits for all accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">Trial Balance Status: Balanced</h4>
                      <p className="text-sm text-green-700">
                        Total Debits: {formatAED(totalDebits)} | Total Credits: {formatAED(totalCredits)}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Total Debits</TableHead>
                      <TableHead className="text-right">Total Credits</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Normal Side</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trialBalance.map((account) => (
                      <TableRow key={account.code}>
                        <TableCell className="font-medium">{account.code}</TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>
                          <Badge className={getAccountTypeBadge(account.type)}>
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {account.totalDebits > 0 ? formatAED(account.totalDebits) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {account.totalCredits > 0 ? formatAED(account.totalCredits) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatAED(account.netBalance)}
                          <span className="text-sm text-gray-500 ml-1">
                            ({account.balanceType})
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm px-2 py-1 rounded ${
                            account.normalSide === 'Debit'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {account.normalSide}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableRow className="font-bold bg-gray-50">
                    <TableCell colSpan={3}>TOTALS</TableCell>
                    <TableCell className="text-right">{formatAED(totalDebits)}</TableCell>
                    <TableCell className="text-right">{formatAED(totalCredits)}</TableCell>
                    <TableCell className="text-right">
                      {totalDebits === totalCredits ? (
                        <span className="text-green-600">BALANCED</span>
                      ) : (
                        <span className="text-red-600">OUT OF BALANCE</span>
                      )}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Balances Tab */}
        <TabsContent value="account-balances">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Assets & Liabilities</CardTitle>
                <CardDescription>
                  Current balances for asset and liability accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Assets</h4>
                    <div className="space-y-2">
                      {trialBalance
                        .filter(account => account.type === 'Asset')
                        .map((account) => (
                          <div key={account.code} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <span className="font-medium">{account.name}</span>
                            <span className="text-blue-600 font-bold">
                              {formatCurrency(account.balance, account.currency)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Liabilities</h4>
                    <div className="space-y-2">
                      {trialBalance
                        .filter(account => account.type === 'Liability')
                        .map((account) => (
                          <div key={account.code} className="flex justify-between items-center p-2 bg-red-50 rounded">
                            <span className="font-medium">{account.name}</span>
                            <span className="text-red-600 font-bold">
                              {formatCurrency(account.balance, account.currency)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Revenue & Expenses</CardTitle>
                <CardDescription>
                  Current period income statement accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Revenue</h4>
                    <div className="space-y-2">
                      {trialBalance
                        .filter(account => account.type === 'Revenue')
                        .map((account) => (
                          <div key={account.code} className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span className="font-medium">{account.name}</span>
                            <span className="text-green-600 font-bold">
                              {formatCurrency(account.balance, account.currency)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Expenses</h4>
                    <div className="space-y-2">
                      {trialBalance
                        .filter(account => account.type === 'Expense')
                        .map((account) => (
                          <div key={account.code} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                            <span className="font-medium">{account.name}</span>
                            <span className="text-orange-600 font-bold">
                              {formatCurrency(account.balance, account.currency)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-100 mt-6">
            <CardHeader>
              <CardTitle>Accounting Equation</CardTitle>
              <CardDescription>
                Verify the fundamental accounting equation: Assets = Liabilities + Equity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Assets</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatAED(trialBalance
                      .filter(account => account.type === 'Asset')
                      .reduce((sum, account) => sum + account.balance, 0)
                    )}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center flex items-center justify-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-600">=</div>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm font-semibold text-red-900 mb-1">Liabilities</h3>
                    <p className="text-xl font-bold text-red-600">
                      {formatAED(trialBalance
                        .filter(account => account.type === 'Liability')
                        .reduce((sum, account) => sum + account.balance, 0)
                      )}
                    </p>
                  </div>
                  <div className="text-center text-lg font-bold text-gray-600">+</div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm font-semibold text-purple-900 mb-1">Equity</h3>
                    <p className="text-xl font-bold text-purple-600">
                      {formatAED(trialBalance
                        .filter(account => account.type === 'Equity')
                        .reduce((sum, account) => sum + account.balance, 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}