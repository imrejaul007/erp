'use client';

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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Banknote,
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  X,
  Check,
  RefreshCw,
  FileText,
  Building,
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock,
  Link
} from 'lucide-react';

export default function BankReconciliationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('emirates-nbd');
  const [isAddStatementOpen, setIsAddStatementOpen] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

  // Bank Accounts
  const bankAccounts = [
    {
      id: 'emirates-nbd',
      bankName: 'Emirates NBD',
      accountNumber: '****1234',
      accountType: 'Current Account',
      currency: 'AED',
      bookBalance: 185250.75,
      bankBalance: 187450.25,
      difference: 2199.50,
      lastReconciled: '2024-09-25',
      status: 'Pending'
    },
    {
      id: 'adcb-usd',
      bankName: 'Abu Dhabi Commercial Bank',
      accountNumber: '****5678',
      accountType: 'USD Account',
      currency: 'USD',
      bookBalance: 15250.00,
      bankBalance: 15250.00,
      difference: 0,
      lastReconciled: '2024-09-30',
      status: 'Reconciled'
    },
    {
      id: 'fab-current',
      bankName: 'First Abu Dhabi Bank',
      accountNumber: '****9012',
      accountType: 'Current Account',
      currency: 'AED',
      bookBalance: 45678.90,
      bankBalance: 46128.40,
      difference: 449.50,
      lastReconciled: '2024-09-28',
      status: 'Pending'
    },
    {
      id: 'hsbc-eur',
      bankName: 'HSBC Bank Middle East',
      accountNumber: '****3456',
      accountType: 'EUR Account',
      currency: 'EUR',
      bookBalance: 8750.50,
      bankBalance: 8750.50,
      difference: 0,
      lastReconciled: '2024-09-29',
      status: 'Reconciled'
    }
  ];

  // Bank Statement Transactions
  const bankTransactions = [
    {
      id: 'STMT-001',
      date: '2024-09-30',
      description: 'Customer Payment - Ahmed Al-Rashid',
      reference: 'TXN123456789',
      debit: 0,
      credit: 850.00,
      balance: 187450.25,
      status: 'Unmatched',
      bookEntry: null,
      reconciled: false
    },
    {
      id: 'STMT-002',
      date: '2024-09-29',
      description: 'Salary Transfer',
      reference: 'SAL092024',
      debit: 15000.00,
      credit: 0,
      balance: 186600.25,
      status: 'Matched',
      bookEntry: 'JE-001',
      reconciled: true
    },
    {
      id: 'STMT-003',
      date: '2024-09-28',
      description: 'Supplier Payment - Al-Taiba',
      reference: 'PO023PAY',
      debit: 1260.00,
      credit: 0,
      balance: 185340.25,
      status: 'Matched',
      bookEntry: 'JE-002',
      reconciled: true
    },
    {
      id: 'STMT-004',
      date: '2024-09-27',
      description: 'Bank Charges',
      reference: 'CHGQ32024',
      debit: 25.00,
      credit: 0,
      balance: 186315.25,
      status: 'Unmatched',
      bookEntry: null,
      reconciled: false
    },
    {
      id: 'STMT-005',
      date: '2024-09-26',
      description: 'Deposit - Cash Sales',
      reference: 'DEP092624',
      debit: 0,
      credit: 2850.00,
      balance: 186340.25,
      status: 'Matched',
      bookEntry: 'JE-003',
      reconciled: true
    },
    {
      id: 'STMT-006',
      date: '2024-09-25',
      description: 'Interest Credit',
      reference: 'INT092024',
      debit: 0,
      credit: 125.50,
      balance: 183490.25,
      status: 'Unmatched',
      bookEntry: null,
      reconciled: false
    }
  ];

  // Book Transactions (Ledger)
  const bookTransactions = [
    {
      id: 'JE-001',
      date: '2024-09-29',
      description: 'Salary Payment - September',
      reference: 'SAL-092024',
      debit: 0,
      credit: 15000.00,
      status: 'Matched',
      bankEntry: 'STMT-002',
      reconciled: true
    },
    {
      id: 'JE-002',
      date: '2024-09-28',
      description: 'Payment to Al-Taiba Suppliers',
      reference: 'PO-023',
      debit: 0,
      credit: 1260.00,
      status: 'Matched',
      bankEntry: 'STMT-003',
      reconciled: true
    },
    {
      id: 'JE-003',
      date: '2024-09-26',
      description: 'Cash Sales Deposit',
      reference: 'DEP-092624',
      debit: 2850.00,
      credit: 0,
      status: 'Matched',
      bankEntry: 'STMT-005',
      reconciled: true
    },
    {
      id: 'JE-004',
      date: '2024-09-24',
      description: 'Customer Payment - Sarah Johnson',
      reference: 'INV-002',
      debit: 625.00,
      credit: 0,
      status: 'Unmatched',
      bankEntry: null,
      reconciled: false
    },
    {
      id: 'JE-005',
      date: '2024-09-23',
      description: 'Office Rent Payment',
      reference: 'RENT-092024',
      debit: 0,
      credit: 8000.00,
      status: 'Unmatched',
      bankEntry: null,
      reconciled: false
    }
  ];

  // Reconciliation Items
  const reconciliationItems = [
    {
      id: 'REC-001',
      type: 'Outstanding Deposit',
      date: '2024-09-30',
      description: 'Customer payment in transit',
      amount: 850.00,
      reference: 'INV-001',
      status: 'Outstanding'
    },
    {
      id: 'REC-002',
      type: 'Outstanding Withdrawal',
      date: '2024-09-24',
      description: 'Cheque not yet cleared',
      amount: -625.00,
      reference: 'CHQ-001',
      status: 'Outstanding'
    },
    {
      id: 'REC-003',
      type: 'Bank Charges',
      date: '2024-09-27',
      description: 'Quarterly bank charges',
      amount: -25.00,
      reference: 'CHGQ32024',
      status: 'To Record'
    },
    {
      id: 'REC-004',
      type: 'Interest Income',
      date: '2024-09-25',
      description: 'Monthly interest credit',
      amount: 125.50,
      reference: 'INT092024',
      status: 'To Record'
    },
    {
      id: 'REC-005',
      type: 'Rent Payment',
      date: '2024-09-23',
      description: 'Office rent payment pending',
      amount: -8000.00,
      reference: 'RENT-092024',
      status: 'Outstanding'
    }
  ];

  const currentAccount = bankAccounts.find(acc => acc.id === selectedAccount);

  const formatAED = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Matched': 'bg-green-100 text-green-800',
      'Unmatched': 'bg-orange-100 text-orange-800',
      'Reconciled': 'bg-green-100 text-green-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Outstanding': 'bg-blue-100 text-blue-800',
      'To Record': 'bg-purple-100 text-purple-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getItemTypeBadge = (type: string) => {
    const typeConfig = {
      'Outstanding Deposit': 'bg-blue-100 text-blue-800',
      'Outstanding Withdrawal': 'bg-red-100 text-red-800',
      'Bank Charges': 'bg-purple-100 text-purple-800',
      'Interest Income': 'bg-green-100 text-green-800'
    };
    return typeConfig[type as keyof typeof typeConfig] || 'bg-gray-100 text-gray-800';
  };

  const filteredBankTransactions = bankTransactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unmatchedBankTransactions = bankTransactions.filter(t => t.status === 'Unmatched');
  const unmatchedBookTransactions = bookTransactions.filter(t => t.status === 'Unmatched');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Banknote className="h-8 w-8 text-amber-600" />
            Bank Reconciliation
          </h1>
          <p className="text-muted-foreground mt-1">
            Match bank statements with book entries and manage cash positions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Statement
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isAddStatementOpen} onOpenChange={setIsAddStatementOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4" />
                Manual Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Manual Bank Entry</DialogTitle>
                <DialogDescription>
                  Manually add a bank statement transaction for reconciliation
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-account">Bank Account</Label>
                    <Select defaultValue={selectedAccount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.bankName} - {account.accountNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transaction-date">Date</Label>
                    <Input id="transaction-date" type="date" defaultValue="2024-09-30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Transaction description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference</Label>
                    <Input id="reference" placeholder="TXN123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transaction-type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debit">Debit (Withdrawal)</SelectItem>
                        <SelectItem value="credit">Credit (Deposit)</SelectItem>
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
                    <Label htmlFor="balance">Balance After</Label>
                    <Input id="balance" type="number" placeholder="0.00" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddStatementOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Add Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Account Selection */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2 text-amber-600" />
            Bank Account Selection
          </CardTitle>
          <CardDescription>
            Select a bank account to view and reconcile transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bankAccounts.map((account) => (
              <Card
                key={account.id}
                className={`cursor-pointer transition-all ${
                  selectedAccount === account.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
                onClick={() => setSelectedAccount(account.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{account.bankName}</h3>
                    <Badge className={getStatusBadge(account.status)}>
                      {account.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{account.accountNumber}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Book Balance:</span>
                      <span className="font-medium">
                        {formatCurrency(account.bookBalance, account.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bank Balance:</span>
                      <span className="font-medium">
                        {formatCurrency(account.bankBalance, account.currency)}
                      </span>
                    </div>
                    {account.difference !== 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Difference:</span>
                        <span className={`font-medium ${
                          account.difference > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {account.difference > 0 ? '+' : ''}
                          {formatCurrency(account.difference, account.currency)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Account Summary */}
      {currentAccount && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Book Balance
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(currentAccount.bookBalance, currentAccount.currency)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                As per general ledger
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Bank Balance
              </CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(currentAccount.bankBalance, currentAccount.currency)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                As per bank statement
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Difference
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                currentAccount.difference === 0
                  ? 'text-green-600'
                  : currentAccount.difference > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {currentAccount.difference === 0
                  ? 'Balanced'
                  : `${currentAccount.difference > 0 ? '+' : ''}${formatCurrency(currentAccount.difference, currentAccount.currency)}`
                }
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {currentAccount.difference === 0 ? 'Account reconciled' : 'Needs reconciliation'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Last Reconciled
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {new Date(currentAccount.lastReconciled).toLocaleDateString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {Math.ceil((new Date().getTime() - new Date(currentAccount.lastReconciled).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="reconcile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reconcile" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Reconcile
          </TabsTrigger>
          <TabsTrigger value="bank-statement" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Bank Statement
          </TabsTrigger>
          <TabsTrigger value="book-entries" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Book Entries
          </TabsTrigger>
          <TabsTrigger value="adjustments" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Adjustments
          </TabsTrigger>
        </TabsList>

        {/* Reconciliation Tab */}
        <TabsContent value="reconcile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                  Unmatched Bank Transactions
                </CardTitle>
                <CardDescription>
                  Bank statement entries that need to be matched
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unmatchedBankTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{transaction.description}</h4>
                          <p className="text-sm text-gray-600">{transaction.reference}</p>
                        </div>
                        <Badge className={getStatusBadge(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">{transaction.date}</div>
                        <div className={`font-bold ${
                          transaction.credit > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.credit > 0
                            ? `+${formatAED(transaction.credit)}`
                            : `-${formatAED(transaction.debit)}`
                          }
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Link className="h-3 w-3 mr-1" />
                          Match
                        </Button>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3 mr-1" />
                          Create Entry
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-amber-600" />
                  Unmatched Book Entries
                </CardTitle>
                <CardDescription>
                  General ledger entries that need to be matched
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unmatchedBookTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{transaction.description}</h4>
                          <p className="text-sm text-gray-600">{transaction.reference}</p>
                        </div>
                        <Badge className={getStatusBadge(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">{transaction.date}</div>
                        <div className={`font-bold ${
                          transaction.debit > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.debit > 0
                            ? `+${formatAED(transaction.debit)}`
                            : `-${formatAED(transaction.credit)}`
                          }
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Link className="h-3 w-3 mr-1" />
                          Match
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-100 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-amber-600" />
                Reconciliation Items
              </CardTitle>
              <CardDescription>
                Outstanding items and adjustments needed for reconciliation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciliationItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge className={getItemTypeBadge(item.type)}>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.reference}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            item.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.amount > 0 ? '+' : ''}{formatAED(Math.abs(item.amount))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.status === 'To Record' ? (
                              <Button variant="outline" size="icon">
                                <Plus className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button variant="outline" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-900 mb-2">Reconciliation Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-amber-700">Outstanding Deposits:</span>
                    <span className="font-medium ml-2 text-green-600">+{formatAED(850)}</span>
                  </div>
                  <div>
                    <span className="text-amber-700">Outstanding Withdrawals:</span>
                    <span className="font-medium ml-2 text-red-600">-{formatAED(8625)}</span>
                  </div>
                  <div>
                    <span className="text-amber-700">Adjustments Needed:</span>
                    <span className="font-medium ml-2 text-blue-600">{formatAED(100.50)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Statement Tab */}
        <TabsContent value="bank-statement">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                Bank Statement Transactions
              </CardTitle>
              <CardDescription>
                All transactions from the bank statement for {currentAccount?.bankName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bank transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="unmatched">Unmatched</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Debit</TableHead>
                      <TableHead>Credit</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Book Entry</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBankTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium">{transaction.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {transaction.reference}
                        </TableCell>
                        <TableCell>
                          {transaction.debit > 0 ? (
                            <span className="text-red-600 font-medium">
                              -{formatAED(transaction.debit)}
                            </span>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {transaction.credit > 0 ? (
                            <span className="text-green-600 font-medium">
                              +{formatAED(transaction.credit)}
                            </span>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAED(transaction.balance)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.bookEntry ? (
                            <Badge variant="outline">{transaction.bookEntry}</Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {transaction.status === 'Unmatched' ? (
                              <Button variant="outline" size="icon">
                                <Link className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button variant="outline" size="icon">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
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

        {/* Book Entries Tab */}
        <TabsContent value="book-entries">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                Book Entries (General Ledger)
              </CardTitle>
              <CardDescription>
                All general ledger transactions for {currentAccount?.bankName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Debit</TableHead>
                      <TableHead>Credit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bank Entry</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium">{transaction.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {transaction.reference}
                        </TableCell>
                        <TableCell>
                          {transaction.debit > 0 ? (
                            <span className="text-green-600 font-medium">
                              +{formatAED(transaction.debit)}
                            </span>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {transaction.credit > 0 ? (
                            <span className="text-red-600 font-medium">
                              -{formatAED(transaction.credit)}
                            </span>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.bankEntry ? (
                            <Badge variant="outline">{transaction.bankEntry}</Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {transaction.status === 'Unmatched' ? (
                              <Button variant="outline" size="icon">
                                <Link className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button variant="outline" size="icon">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
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

        {/* Adjustments Tab */}
        <TabsContent value="adjustments">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-amber-600" />
                Reconciliation Adjustments
              </CardTitle>
              <CardDescription>
                Create journal entries for bank charges, interest, and other adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Adjustments Needed</h3>

                  <div className="p-4 border rounded-lg bg-purple-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Bank Charges</h4>
                        <p className="text-sm text-gray-600">Quarterly bank charges</p>
                      </div>
                      <span className="text-red-600 font-bold">-{formatAED(25)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Reference: CHGQ32024</span>
                      <Button size="sm">Create Entry</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Interest Income</h4>
                        <p className="text-sm text-gray-600">Monthly interest credit</p>
                      </div>
                      <span className="text-green-600 font-bold">+{formatAED(125.50)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Reference: INT092024</span>
                      <Button size="sm">Create Entry</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>

                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="justify-start gap-2">
                      <Plus className="h-4 w-4" />
                      Record Bank Charges
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <Plus className="h-4 w-4" />
                      Record Interest Income
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Mark as Reconciled
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <Download className="h-4 w-4" />
                      Export Reconciliation
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Reconciliation Status</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex justify-between">
                        <span>Transactions Matched:</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adjustments Pending:</span>
                        <span className="font-medium">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Variance Remaining:</span>
                        <span className="font-medium">{formatAED(currentAccount?.difference || 0)}</span>
                      </div>
                    </div>
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