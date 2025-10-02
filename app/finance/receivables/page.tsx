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
  CreditCard,
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  Send,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Phone,
  Mail,
  MapPin,
  Timer
} from 'lucide-react';

export default function AccountsReceivablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Accounts Receivable Data
  const receivables = [
    {
      id: 'INV-001',
      customerName: 'Ahmed Al-Rashid',
      customerEmail: 'ahmed@example.com',
      customerPhone: '+971-50-123-4567',
      invoiceDate: '2024-09-15',
      dueDate: '2024-10-15',
      totalAmount: 850,
      paidAmount: 0,
      remainingAmount: 850,
      vatAmount: 42.5,
      currency: 'AED',
      status: 'Outstanding',
      priority: 'Medium',
      daysPastDue: 0,
      paymentTerms: 'Net 30',
      description: 'Royal Oud Premium Collection',
      salesPerson: 'Fatima Al-Zahra',
      lastFollowUp: '2024-09-20',
      nextFollowUp: '2024-10-01'
    },
    {
      id: 'INV-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      customerPhone: '+971-55-987-6543',
      invoiceDate: '2024-08-20',
      dueDate: '2024-09-20',
      totalAmount: 1250,
      paidAmount: 625,
      remainingAmount: 625,
      vatAmount: 62.5,
      currency: 'AED',
      status: 'Partial',
      priority: 'High',
      daysPastDue: 10,
      paymentTerms: 'Net 30',
      description: 'Luxury Perfume Set',
      salesPerson: 'Omar Hassan',
      lastFollowUp: '2024-09-25',
      nextFollowUp: '2024-10-02'
    },
    {
      id: 'INV-003',
      customerName: 'Mohammad Al-Mansoori',
      customerEmail: 'mohammad@example.com',
      customerPhone: '+971-52-456-7890',
      invoiceDate: '2024-07-10',
      dueDate: '2024-08-10',
      totalAmount: 2100,
      paidAmount: 2100,
      remainingAmount: 0,
      vatAmount: 105,
      currency: 'AED',
      status: 'Paid',
      priority: 'Low',
      daysPastDue: 0,
      paymentTerms: 'Net 30',
      description: 'Corporate Gift Order',
      salesPerson: 'Aisha Al-Blooshi',
      lastFollowUp: '2024-08-15',
      nextFollowUp: null
    },
    {
      id: 'INV-004',
      customerName: 'Khalid Al-Rashid',
      customerEmail: 'khalid@example.com',
      customerPhone: '+971-56-789-0123',
      invoiceDate: '2024-06-15',
      dueDate: '2024-07-15',
      totalAmount: 3200,
      paidAmount: 0,
      remainingAmount: 3200,
      vatAmount: 160,
      currency: 'AED',
      status: 'Overdue',
      priority: 'Critical',
      daysPastDue: 75,
      paymentTerms: 'Net 30',
      description: 'Wholesale Order - Premium Oud',
      salesPerson: 'Fatima Al-Zahra',
      lastFollowUp: '2024-09-15',
      nextFollowUp: '2024-10-01'
    },
    {
      id: 'INV-005',
      customerName: 'Emirates Luxury Hotels',
      customerEmail: 'procurement@emirateshotels.ae',
      customerPhone: '+971-4-567-8901',
      invoiceDate: '2024-09-25',
      dueDate: '2024-10-25',
      totalAmount: 5500,
      paidAmount: 0,
      remainingAmount: 5500,
      vatAmount: 275,
      currency: 'AED',
      status: 'Outstanding',
      priority: 'High',
      daysPastDue: 0,
      paymentTerms: 'Net 30',
      description: 'Hotel Amenity Perfumes',
      salesPerson: 'Omar Hassan',
      lastFollowUp: '2024-09-28',
      nextFollowUp: '2024-10-05'
    }
  ];

  // Customer Summary
  const customerSummary = [
    {
      customerName: 'Ahmed Al-Rashid',
      totalOutstanding: 850,
      oldestInvoice: 'INV-001',
      daysPastDue: 0,
      creditLimit: 5000,
      paymentHistory: 'Good'
    },
    {
      customerName: 'Sarah Johnson',
      totalOutstanding: 625,
      oldestInvoice: 'INV-002',
      daysPastDue: 10,
      creditLimit: 3000,
      paymentHistory: 'Average'
    },
    {
      customerName: 'Khalid Al-Rashid',
      totalOutstanding: 3200,
      oldestInvoice: 'INV-004',
      daysPastDue: 75,
      creditLimit: 10000,
      paymentHistory: 'Poor'
    },
    {
      customerName: 'Emirates Luxury Hotels',
      totalOutstanding: 5500,
      oldestInvoice: 'INV-005',
      daysPastDue: 0,
      creditLimit: 20000,
      paymentHistory: 'Excellent'
    }
  ];

  // Aging Report
  const agingBuckets = [
    { label: 'Current (0-30 days)', amount: 6350, count: 2, percentage: 63.5 },
    { label: '31-60 days', amount: 625, count: 1, percentage: 6.25 },
    { label: '61-90 days', amount: 3200, count: 1, percentage: 32 },
    { label: '90+ days', amount: 0, count: 0, percentage: 0 }
  ];

  const formatAED = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Outstanding': 'bg-blue-100 text-blue-800',
      'Partial': 'bg-orange-100 text-orange-800',
      'Paid': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Cancelled': 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'Critical': 'bg-red-100 text-red-800',
      'High': 'bg-orange-100 text-orange-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return priorityConfig[priority as keyof typeof priorityConfig] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentHistoryColor = (history: string) => {
    const colorConfig = {
      'Excellent': 'text-green-600',
      'Good': 'text-blue-600',
      'Average': 'text-orange-600',
      'Poor': 'text-red-600'
    };
    return colorConfig[history as keyof typeof colorConfig] || 'text-gray-600';
  };

  const filteredReceivables = receivables.filter(invoice => {
    const matchesSearch =
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || invoice.status.toLowerCase() === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = receivables
    .filter(inv => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.remainingAmount, 0);

  const totalOverdue = receivables
    .filter(inv => inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.remainingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-amber-600" />
            Accounts Receivable
          </h1>
          <p className="text-muted-foreground mt-1">
            Track outstanding invoices, customer payments, and aging reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <Send className="h-4 w-4" />
            Send Reminders
          </Button>
          <Dialog open={isAddInvoiceOpen} onOpenChange={setIsAddInvoiceOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Generate a new invoice for accounts receivable
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahmed">Ahmed Al-Rashid</SelectItem>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="mohammad">Mohammad Al-Mansoori</SelectItem>
                        <SelectItem value="khalid">Khalid Al-Rashid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-date">Invoice Date</Label>
                    <Input id="invoice-date" type="date" defaultValue="2024-09-30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input id="due-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Select defaultValue="net30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Invoice description" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (Excl. VAT)</Label>
                    <Input id="amount" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vat">VAT (5%)</Label>
                    <Input id="vat" type="number" placeholder="0.00" readonly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total">Total Amount</Label>
                    <Input id="total" type="number" placeholder="0.00" readonly />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddInvoiceOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Create Invoice
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Outstanding
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(totalOutstanding)}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {receivables.filter(inv => inv.status !== 'Paid').length} outstanding invoices
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overdue Amount
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(totalOverdue)}
            </div>
            <p className="text-xs text-red-600 mt-1">
              {receivables.filter(inv => inv.status === 'Overdue').length} overdue invoices
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Days to Pay
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              24 days
            </div>
            <p className="text-xs text-green-600 mt-1">
              +2 days from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Collection Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              92.3%
            </div>
            <p className="text-xs text-green-600 mt-1">
              +3.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Outstanding Invoices
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Customer Summary
          </TabsTrigger>
          <TabsTrigger value="aging" className="flex items-center">
            <Timer className="h-4 w-4 mr-2" />
            Aging Report
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Collections
          </TabsTrigger>
        </TabsList>

        {/* Outstanding Invoices Tab */}
        <TabsContent value="invoices">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                Outstanding Invoices
              </CardTitle>
              <CardDescription>
                All unpaid and partially paid customer invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices or customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="outstanding">Outstanding</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Days Past Due</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReceivables.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.id}</div>
                            <div className="text-sm text-gray-500">{invoice.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.customerName}</div>
                            <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`${
                            new Date(invoice.dueDate) < new Date() && invoice.status !== 'Paid'
                              ? 'text-red-600 font-medium'
                              : 'text-gray-900'
                          }`}>
                            {invoice.dueDate}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAED(invoice.totalAmount)}
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          {formatAED(invoice.remainingAmount)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            invoice.daysPastDue > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {invoice.daysPastDue > 0 ? `${invoice.daysPastDue} days` : 'Current'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityBadge(invoice.priority)}>
                            {invoice.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Send className="h-4 w-4" />
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

        {/* Customer Summary Tab */}
        <TabsContent value="customers">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-amber-600" />
                Customer Summary
              </CardTitle>
              <CardDescription>
                Overview of outstanding amounts by customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Outstanding</TableHead>
                      <TableHead>Oldest Invoice</TableHead>
                      <TableHead>Days Past Due</TableHead>
                      <TableHead>Credit Limit</TableHead>
                      <TableHead>Payment History</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerSummary.map((customer) => (
                      <TableRow key={customer.customerName}>
                        <TableCell>
                          <div className="font-medium">{customer.customerName}</div>
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          {formatAED(customer.totalOutstanding)}
                        </TableCell>
                        <TableCell>{customer.oldestInvoice}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            customer.daysPastDue > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {customer.daysPastDue > 0 ? `${customer.daysPastDue} days` : 'Current'}
                          </span>
                        </TableCell>
                        <TableCell>{formatAED(customer.creditLimit)}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${getPaymentHistoryColor(customer.paymentHistory)}`}>
                            {customer.paymentHistory}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Mail className="h-4 w-4" />
                            </Button>
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

        {/* Aging Report Tab */}
        <TabsContent value="aging">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="h-5 w-5 mr-2 text-amber-600" />
                  Aging Summary
                </CardTitle>
                <CardDescription>
                  Outstanding amounts by aging buckets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agingBuckets.map((bucket, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{bucket.label}</span>
                        <div className="text-right">
                          <div className="font-bold">{formatAED(bucket.amount)}</div>
                          <div className="text-sm text-gray-500">{bucket.count} invoices</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-green-500' :
                            index === 1 ? 'bg-yellow-500' :
                            index === 2 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{width: `${bucket.percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Aging Distribution</CardTitle>
                <CardDescription>
                  Visual representation of receivables aging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <div className="text-center">
                    <Timer className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Aging Chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-100 mt-6">
            <CardHeader>
              <CardTitle>Detailed Aging Report</CardTitle>
              <CardDescription>
                Complete breakdown of receivables by customer and aging period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>31-60 Days</TableHead>
                      <TableHead>61-90 Days</TableHead>
                      <TableHead>90+ Days</TableHead>
                      <TableHead>Total Outstanding</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Ahmed Al-Rashid</TableCell>
                      <TableCell>{formatAED(850)}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="font-bold">{formatAED(850)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Sarah Johnson</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{formatAED(625)}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="font-bold">{formatAED(625)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Khalid Al-Rashid</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{formatAED(3200)}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="font-bold">{formatAED(3200)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Emirates Luxury Hotels</TableCell>
                      <TableCell>{formatAED(5500)}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="font-bold">{formatAED(5500)}</TableCell>
                    </TableRow>
                    <TableRow className="font-bold bg-gray-50">
                      <TableCell>TOTALS</TableCell>
                      <TableCell>{formatAED(6350)}</TableCell>
                      <TableCell>{formatAED(625)}</TableCell>
                      <TableCell>{formatAED(3200)}</TableCell>
                      <TableCell>{formatAED(0)}</TableCell>
                      <TableCell>{formatAED(10175)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collections Tab */}
        <TabsContent value="collections">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-amber-600" />
                  Collection Activities
                </CardTitle>
                <CardDescription>
                  Recent collection efforts and follow-ups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Khalid Al-Rashid - INV-004</h4>
                        <p className="text-sm text-gray-600">Last follow-up: Sept 15, 2024</p>
                        <p className="text-sm text-red-600">75 days overdue - {formatAED(3200)}</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Critical</Badge>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        Legal Notice
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Sarah Johnson - INV-002</h4>
                        <p className="text-sm text-gray-600">Last follow-up: Sept 25, 2024</p>
                        <p className="text-sm text-orange-600">10 days overdue - {formatAED(625)}</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">High</Badge>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Emirates Luxury Hotels - INV-005</h4>
                        <p className="text-sm text-gray-600">Last follow-up: Sept 28, 2024</p>
                        <p className="text-sm text-blue-600">Current - {formatAED(5500)}</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">High</Badge>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Collection Statistics</CardTitle>
                <CardDescription>
                  Performance metrics for accounts receivable collections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Collection Effectiveness</span>
                      <span className="text-green-600 font-bold">92.3%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '92.3%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Days Sales Outstanding</span>
                      <span className="text-orange-600 font-bold">24 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Bad Debt Rate</span>
                      <span className="text-green-600 font-bold">0.8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Upcoming Follow-ups</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Oct 1 - Khalid Al-Rashid</span>
                        <span className="text-red-600">Critical</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Oct 2 - Sarah Johnson</span>
                        <span className="text-orange-600">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Oct 5 - Emirates Hotels</span>
                        <span className="text-orange-600">High</span>
                      </div>
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