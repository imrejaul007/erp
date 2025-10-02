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
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Shield,
  Building,
  Calculator,
  DollarSign,
  TrendingUp,
  Clock,
  Flag,
  Mail,
  Phone
} from 'lucide-react';

export default function VATPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('current');
  const [filterType, setFilterType] = useState('all');
  const [isVATReturnOpen, setIsVATReturnOpen] = useState(false);

  // VAT Configuration
  const vatConfig = {
    businessTRN: '100123456789012',
    businessName: 'Oud Palace Trading LLC',
    businessAddress: 'Dubai, United Arab Emirates',
    standardRate: 5,
    registrationDate: '2024-01-01',
    filingFrequency: 'Quarterly',
    nextDueDate: '2024-10-28'
  };

  // VAT Transactions
  const vatTransactions = [
    {
      id: 'VAT-001',
      date: '2024-09-30',
      type: 'Output VAT',
      description: 'Sale - Royal Oud Premium',
      customerSupplier: 'Ahmed Al-Rashid',
      invoiceNumber: 'INV-001',
      netAmount: 850.00,
      vatAmount: 42.50,
      totalAmount: 892.50,
      vatRate: 5,
      category: 'Standard Rated Sales',
      status: 'Recorded',
      period: '2024-Q3'
    },
    {
      id: 'VAT-002',
      date: '2024-09-29',
      type: 'Input VAT',
      description: 'Purchase - Raw Materials',
      customerSupplier: 'Al-Taiba Suppliers',
      invoiceNumber: 'BILL-001',
      netAmount: 1200.00,
      vatAmount: 60.00,
      totalAmount: 1260.00,
      vatRate: 5,
      category: 'Standard Rated Purchases',
      status: 'Recorded',
      period: '2024-Q3'
    },
    {
      id: 'VAT-003',
      date: '2024-09-28',
      type: 'Output VAT',
      description: 'Export Sale - International',
      customerSupplier: 'Luxury Perfumes USA',
      invoiceNumber: 'EXP-001',
      netAmount: 5000.00,
      vatAmount: 0.00,
      totalAmount: 5000.00,
      vatRate: 0,
      category: 'Zero Rated Exports',
      status: 'Recorded',
      period: '2024-Q3'
    },
    {
      id: 'VAT-004',
      date: '2024-09-27',
      type: 'Input VAT',
      description: 'Office Rent',
      customerSupplier: 'Property Management LLC',
      invoiceNumber: 'RENT-09',
      netAmount: 8000.00,
      vatAmount: 400.00,
      totalAmount: 8400.00,
      vatRate: 5,
      category: 'Standard Rated Purchases',
      status: 'Recorded',
      period: '2024-Q3'
    },
    {
      id: 'VAT-005',
      date: '2024-09-26',
      type: 'Output VAT',
      description: 'Retail Sale - Walk-in Customer',
      customerSupplier: 'Cash Customer',
      invoiceNumber: 'POS-145',
      netAmount: 320.00,
      vatAmount: 16.00,
      totalAmount: 336.00,
      vatRate: 5,
      category: 'Standard Rated Sales',
      status: 'Recorded',
      period: '2024-Q3'
    },
    {
      id: 'VAT-006',
      date: '2024-09-25',
      type: 'Input VAT',
      description: 'Marketing Services',
      customerSupplier: 'Gulf Marketing Solutions',
      invoiceNumber: 'MKT-001',
      netAmount: 3000.00,
      vatAmount: 150.00,
      totalAmount: 3150.00,
      vatRate: 5,
      category: 'Standard Rated Purchases',
      status: 'Recorded',
      period: '2024-Q3'
    }
  ];

  // VAT Returns
  const vatReturns = [
    {
      id: 'VAT-RET-003',
      period: '2024-Q3',
      periodStart: '2024-07-01',
      periodEnd: '2024-09-30',
      totalSales: 127500.00,
      standardRatedSales: 95000.00,
      zeroRatedSales: 32500.00,
      outputVAT: 4750.00,
      totalPurchases: 45600.00,
      standardRatedPurchases: 45600.00,
      inputVAT: 2280.00,
      netVAT: 2470.00,
      status: 'Draft',
      dueDate: '2024-10-28',
      submissionDate: null,
      penalties: 0,
      filed: false
    },
    {
      id: 'VAT-RET-002',
      period: '2024-Q2',
      periodStart: '2024-04-01',
      periodEnd: '2024-06-30',
      totalSales: 98750.00,
      standardRatedSales: 78750.00,
      zeroRatedSales: 20000.00,
      outputVAT: 3937.50,
      totalPurchases: 38900.00,
      standardRatedPurchases: 38900.00,
      inputVAT: 1945.00,
      netVAT: 1992.50,
      status: 'Filed',
      dueDate: '2024-07-28',
      submissionDate: '2024-07-25',
      penalties: 0,
      filed: true
    },
    {
      id: 'VAT-RET-001',
      period: '2024-Q1',
      periodStart: '2024-01-01',
      periodEnd: '2024-03-31',
      totalSales: 85600.00,
      standardRatedSales: 70600.00,
      zeroRatedSales: 15000.00,
      outputVAT: 3530.00,
      totalPurchases: 32200.00,
      standardRatedPurchases: 32200.00,
      inputVAT: 1610.00,
      netVAT: 1920.00,
      status: 'Filed',
      dueDate: '2024-04-28',
      submissionDate: '2024-04-20',
      penalties: 0,
      filed: true
    }
  ];

  // VAT Categories
  const vatCategories = [
    {
      category: 'Standard Rated Sales',
      rate: 5,
      totalNet: 95320.00,
      totalVAT: 4766.00,
      transactions: 18
    },
    {
      category: 'Zero Rated Exports',
      rate: 0,
      totalNet: 32500.00,
      totalVAT: 0.00,
      transactions: 5
    },
    {
      category: 'Standard Rated Purchases',
      rate: 5,
      totalNet: 45600.00,
      totalVAT: 2280.00,
      transactions: 12
    },
    {
      category: 'Exempt Supplies',
      rate: 0,
      totalNet: 0.00,
      totalVAT: 0.00,
      transactions: 0
    }
  ];

  // VAT Analysis
  const vatAnalysis = {
    currentQuarter: {
      outputVAT: 4766.00,
      inputVAT: 2280.00,
      netVAT: 2486.00,
      effectiveRate: 3.74
    },
    previousQuarter: {
      outputVAT: 3937.50,
      inputVAT: 1945.00,
      netVAT: 1992.50,
      effectiveRate: 3.98
    },
    yearToDate: {
      outputVAT: 12233.50,
      inputVAT: 5835.00,
      netVAT: 6398.50,
      effectiveRate: 3.89
    }
  };

  const formatAED = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Filed': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Recorded': 'bg-green-100 text-green-800',
      'Pending': 'bg-orange-100 text-orange-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getVATTypeBadge = (type: string) => {
    const typeConfig = {
      'Output VAT': 'bg-green-100 text-green-800',
      'Input VAT': 'bg-blue-100 text-blue-800'
    };
    return typeConfig[type as keyof typeof typeConfig] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'Standard Rated Sales': 'bg-green-100 text-green-800',
      'Zero Rated Exports': 'bg-blue-100 text-blue-800',
      'Standard Rated Purchases': 'bg-purple-100 text-purple-800',
      'Exempt Supplies': 'bg-gray-100 text-gray-800'
    };
    return categoryConfig[category as keyof typeof categoryConfig] || 'bg-gray-100 text-gray-800';
  };

  const filteredTransactions = vatTransactions.filter(transaction => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerSupplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || transaction.type.toLowerCase().replace(' ', '-') === filterType;

    return matchesSearch && matchesType;
  });

  const currentReturn = vatReturns.find(ret => ret.status === 'Draft');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-8 w-8 text-amber-600" />
            UAE VAT Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive VAT compliance, reporting, and filing for UAE businesses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export VAT Report
          </Button>
          <Dialog open={isVATReturnOpen} onOpenChange={setIsVATReturnOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Send className="h-4 w-4" />
                File VAT Return
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>File VAT Return - Q3 2024</DialogTitle>
                <DialogDescription>
                  Review and submit your quarterly VAT return to UAE Tax Authority
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>TRN</Label>
                    <Input value={vatConfig.businessTRN} readonly />
                  </div>
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Input value="Q3 2024 (Jul 1 - Sep 30)" readonly />
                  </div>
                </div>

                {currentReturn && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-green-50 p-3 rounded">
                        <Label className="text-green-700">Total Sales</Label>
                        <div className="font-bold text-green-900">
                          {formatAED(currentReturn.totalSales)}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <Label className="text-blue-700">Output VAT</Label>
                        <div className="font-bold text-blue-900">
                          {formatAED(currentReturn.outputVAT)}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded">
                        <Label className="text-purple-700">Input VAT</Label>
                        <div className="font-bold text-purple-900">
                          {formatAED(currentReturn.inputVAT)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <Label className="text-amber-700">Net VAT Payable</Label>
                          <div className="text-2xl font-bold text-amber-900">
                            {formatAED(currentReturn.netVAT)}
                          </div>
                        </div>
                        <div className="text-right">
                          <Label className="text-amber-700">Due Date</Label>
                          <div className="font-bold text-amber-900">
                            {currentReturn.dueDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="declaration">Declaration</Label>
                  <Textarea
                    id="declaration"
                    value="I declare that the information provided in this return is true and complete to the best of my knowledge and belief."
                    readonly
                    className="h-20"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsVATReturnOpen(false)}>
                  Save as Draft
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Submit to Tax Authority
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4" />
            Add VAT Transaction
          </Button>
        </div>
      </div>

      {/* VAT Registration Info */}
      <Card className="border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-amber-600" />
            VAT Registration Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm text-gray-600">TRN</Label>
              <div className="font-mono font-bold">{vatConfig.businessTRN}</div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Business Name</Label>
              <div className="font-medium">{vatConfig.businessName}</div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Standard Rate</Label>
              <div className="font-bold text-amber-600">{vatConfig.standardRate}%</div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Next Filing Due</Label>
              <div className="font-bold text-red-600">{vatConfig.nextDueDate}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Output VAT (Current Quarter)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(vatAnalysis.currentQuarter.outputVAT)}
            </div>
            <p className="text-xs text-green-600 mt-1">
              VAT collected on sales
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Input VAT (Current Quarter)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(vatAnalysis.currentQuarter.inputVAT)}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              VAT paid on purchases
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net VAT Payable
            </CardTitle>
            <Calculator className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(vatAnalysis.currentQuarter.netVAT)}
            </div>
            <p className="text-xs text-amber-600 mt-1">
              Due {vatConfig.nextDueDate}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Effective VAT Rate
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {vatAnalysis.currentQuarter.effectiveRate.toFixed(2)}%
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Net rate on turnover
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactions" className="flex items-center">
            <Receipt className="h-4 w-4 mr-2" />
            VAT Transactions
          </TabsTrigger>
          <TabsTrigger value="returns" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            VAT Returns
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <Flag className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* VAT Transactions Tab */}
        <TabsContent value="transactions">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-amber-600" />
                VAT Transactions
              </CardTitle>
              <CardDescription>
                All VAT transactions with detailed input and output VAT tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search VAT transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="output-vat">Output VAT</SelectItem>
                    <SelectItem value="input-vat">Input VAT</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[150px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Quarter</SelectItem>
                    <SelectItem value="previous">Previous Quarter</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
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
                      <TableHead>Customer/Supplier</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>VAT Amount</TableHead>
                      <TableHead>VAT Rate</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Badge className={getVATTypeBadge(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium">{transaction.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.customerSupplier}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {transaction.invoiceNumber}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAED(transaction.netAmount)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            transaction.type === 'Output VAT' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {formatAED(transaction.vatAmount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {transaction.vatRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryBadge(transaction.category)}>
                            {transaction.category}
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

        {/* VAT Returns Tab */}
        <TabsContent value="returns">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                VAT Returns
              </CardTitle>
              <CardDescription>
                Quarterly VAT returns and filing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Output VAT</TableHead>
                      <TableHead>Input VAT</TableHead>
                      <TableHead>Net VAT</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vatReturns.map((vatReturn) => (
                      <TableRow key={vatReturn.id}>
                        <TableCell className="font-medium">
                          {vatReturn.period}
                          <div className="text-sm text-gray-500">
                            {vatReturn.periodStart} to {vatReturn.periodEnd}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAED(vatReturn.totalSales)}
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {formatAED(vatReturn.outputVAT)}
                        </TableCell>
                        <TableCell className="text-blue-600 font-medium">
                          {formatAED(vatReturn.inputVAT)}
                        </TableCell>
                        <TableCell className="font-bold text-amber-600">
                          {formatAED(vatReturn.netVAT)}
                        </TableCell>
                        <TableCell>
                          <div className={`${
                            new Date(vatReturn.dueDate) < new Date() && !vatReturn.filed
                              ? 'text-red-600 font-medium'
                              : 'text-gray-900'
                          }`}>
                            {vatReturn.dueDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(vatReturn.status)}>
                            {vatReturn.filed ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {vatReturn.status}
                              </div>
                            ) : vatReturn.status === 'Draft' ? (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {vatReturn.status}
                              </div>
                            ) : (
                              vatReturn.status
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {!vatReturn.filed && (
                              <Button variant="outline" size="sm">
                                <Send className="h-3 w-3 mr-1" />
                                File
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Filing Reminder</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Q3 2024 VAT return is due on {vatConfig.nextDueDate}. Please review and file before the deadline
                      to avoid penalties. Late filing may result in fines of up to AED 20,000.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAT Categories Tab */}
        <TabsContent value="categories">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flag className="h-5 w-5 mr-2 text-amber-600" />
                VAT Categories Analysis
              </CardTitle>
              <CardDescription>
                Breakdown of transactions by VAT category and rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>VAT Rate</TableHead>
                      <TableHead>Total Net Amount</TableHead>
                      <TableHead>Total VAT Amount</TableHead>
                      <TableHead>Number of Transactions</TableHead>
                      <TableHead>Percentage of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vatCategories.map((category) => {
                      const totalNet = vatCategories.reduce((sum, cat) => sum + cat.totalNet, 0);
                      const percentage = totalNet > 0 ? (category.totalNet / totalNet * 100) : 0;

                      return (
                        <TableRow key={category.category}>
                          <TableCell>
                            <Badge className={getCategoryBadge(category.category)}>
                              {category.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {category.rate}%
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatAED(category.totalNet)}
                          </TableCell>
                          <TableCell className="font-medium text-amber-600">
                            {formatAED(category.totalVAT)}
                          </TableCell>
                          <TableCell>{category.transactions}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2 flex-1">
                                <div
                                  className="bg-amber-600 h-2 rounded-full"
                                  style={{width: `${percentage}%`}}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-12">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-4">Standard Rated Transactions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">Sales (5% VAT):</span>
                      <span className="font-medium">{formatAED(95320)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Purchases (5% VAT):</span>
                      <span className="font-medium">{formatAED(45600)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-green-900">Net VAT Position:</span>
                      <span className="text-green-900">{formatAED(2486)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-4">Zero Rated & Exempt</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Export Sales (0% VAT):</span>
                      <span className="font-medium">{formatAED(32500)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Exempt Supplies (0% VAT):</span>
                      <span className="font-medium">{formatAED(0)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-blue-900">Total Zero/Exempt:</span>
                      <span className="text-blue-900">{formatAED(32500)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-amber-600" />
                  Compliance Status
                </CardTitle>
                <CardDescription>
                  VAT compliance checklist and requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">VAT Registration</div>
                      <div className="text-sm text-green-700">Active - TRN: {vatConfig.businessTRN}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Record Keeping</div>
                      <div className="text-sm text-green-700">All transactions recorded with VAT details</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-orange-900">Quarterly Filing</div>
                      <div className="text-sm text-orange-700">Q3 2024 return due {vatConfig.nextDueDate}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Tax Invoice Compliance</div>
                      <div className="text-sm text-green-700">All invoices contain required VAT information</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Import/Export Documentation</div>
                      <div className="text-sm text-green-700">Proper documentation for zero-rated exports</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Compliance Score</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-blue-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{width: '95%'}}></div>
                    </div>
                    <span className="font-bold text-blue-900">95%</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Excellent compliance status. File Q3 return on time to maintain perfect score.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>UAE VAT Requirements</CardTitle>
                <CardDescription>
                  Key UAE VAT rules and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-amber-400 pl-4">
                    <h4 className="font-medium">Standard Rate</h4>
                    <p className="text-sm text-gray-600">5% VAT on most goods and services</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-medium">Zero Rate</h4>
                    <p className="text-sm text-gray-600">0% VAT on exports, international transport, and specific supplies</p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <h4 className="font-medium">Registration Threshold</h4>
                    <p className="text-sm text-gray-600">AED 375,000 annual taxable supplies (mandatory)</p>
                  </div>

                  <div className="border-l-4 border-orange-400 pl-4">
                    <h4 className="font-medium">Filing Frequency</h4>
                    <p className="text-sm text-gray-600">Quarterly returns due 28 days after period end</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <h4 className="font-medium">Penalties</h4>
                    <p className="text-sm text-gray-600">Late filing: AED 500-20,000 depending on delay</p>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-4">
                    <h4 className="font-medium">Record Keeping</h4>
                    <p className="text-sm text-gray-600">Maintain records for 5 years with proper VAT invoices</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">Important Contacts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-amber-600" />
                      <span>UAE Tax Authority: 600-567-567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-amber-600" />
                      <span>Email: info@tax.gov.ae</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-amber-600" />
                      <span>Website: www.tax.gov.ae</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-amber-600" />
                  VAT Analysis
                </CardTitle>
                <CardDescription>
                  Quarterly VAT performance and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <div className="text-center">
                    <Calculator className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">VAT Trends Chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Quick Reports</CardTitle>
                <CardDescription>
                  Generate VAT reports for different periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    VAT Summary Report - Q3 2024
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    Export VAT Transactions
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Receipt className="h-4 w-4" />
                    Tax Invoice Register
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Building className="h-4 w-4" />
                    Supplier VAT Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Flag className="h-4 w-4" />
                    Zero/Exempt Sales Report
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Year to Date Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Total Output VAT:</span>
                      <span className="font-medium">{formatAED(vatAnalysis.yearToDate.outputVAT)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Total Input VAT:</span>
                      <span className="font-medium">{formatAED(vatAnalysis.yearToDate.inputVAT)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-green-900">Net VAT Paid:</span>
                      <span className="text-green-900">{formatAED(vatAnalysis.yearToDate.netVAT)}</span>
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