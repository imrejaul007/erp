'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  CreditCard,
  DollarSign,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Building,
  MapPin,
  Phone,
  Mail,
  Calculator,
  Receipt,
  Banknote,
  TrendingUp,
  TrendingDown,
  Archive,
  Send,
  Flag,
  Package,
  Truck,
  Users,
  Globe,
  Lock,
  Shield,
  Zap,
  FileText,
  Copy,
  ExternalLink,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Target,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';

const VendorPaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Sample payment data
  const payments = [
    {
      id: 'PAY-2024-001',
      invoiceId: 'INV-2024-001',
      invoiceNumber: 'ALR-INV-2024-001',
      vendor: {
        name: 'Al-Rashid Oud Suppliers',
        country: 'UAE',
        bankName: 'Emirates NBD',
        accountNumber: 'AE07 0331 2345 6789 0123 456',
        swiftCode: 'EBILAEAD',
        currency: 'AED'
      },
      amount: 25600,
      currency: 'AED',
      exchangeRate: 1.0,
      amountUSD: 6972.46,
      paymentMethod: 'wire_transfer',
      status: 'completed',
      processedDate: '2024-01-20',
      scheduledDate: '2024-01-20',
      reference: 'WT240120001',
      fees: 25,
      description: 'Payment for Premium Oud Oil and Rose Attar',
      approvedBy: 'Finance Manager'
    },
    {
      id: 'PAY-2024-002',
      invoiceId: 'INV-2024-002',
      invoiceNumber: 'TRC-INV-2024-007',
      vendor: {
        name: 'Taif Rose Company',
        country: 'Saudi Arabia',
        bankName: 'Al Rajhi Bank',
        accountNumber: 'SA03 8000 0000 6080 1016 7519',
        swiftCode: 'RJHISARI',
        currency: 'SAR'
      },
      amount: 12450,
      currency: 'SAR',
      exchangeRate: 0.9775,
      amountUSD: 3325.85,
      paymentMethod: 'letter_of_credit',
      status: 'processing',
      processedDate: null,
      scheduledDate: '2024-01-28',
      reference: 'LC240125001',
      fees: 150,
      description: 'LC Payment for Taif Rose Oil Premium',
      approvedBy: 'Pending Approval'
    },
    {
      id: 'PAY-2024-003',
      invoiceId: 'INV-2024-003',
      invoiceNumber: 'COD-INV-2024-003',
      vendor: {
        name: 'Cambodian Oud Direct',
        country: 'Cambodia',
        bankName: 'ACLEDA Bank',
        accountNumber: 'KH23 1234 5678 9012 3456 789',
        swiftCode: 'ACLBKHPP',
        currency: 'USD'
      },
      amount: 45000,
      currency: 'USD',
      exchangeRate: 3.6725,
      amountUSD: 45000,
      paymentMethod: 'wire_transfer',
      status: 'pending_approval',
      processedDate: null,
      scheduledDate: '2024-01-30',
      reference: 'WT240128002',
      fees: 45,
      description: 'Payment for Wild Oud Oil Grade A+',
      approvedBy: 'Pending Approval'
    },
    {
      id: 'PAY-2024-004',
      invoiceId: 'INV-2024-004',
      invoiceNumber: 'MAH-INV-2024-012',
      vendor: {
        name: 'Mumbai Attar House',
        country: 'India',
        bankName: 'State Bank of India',
        accountNumber: 'IN21 SBIN 5611 2345 6789 123',
        swiftCode: 'SBININBB104',
        currency: 'USD'
      },
      amount: 18750,
      currency: 'USD',
      exchangeRate: 3.6725,
      amountUSD: 18750,
      paymentMethod: 'wire_transfer',
      status: 'scheduled',
      processedDate: null,
      scheduledDate: '2024-02-05',
      reference: 'WT240202001',
      fees: 35,
      description: 'Payment for Traditional Attars and Oils',
      approvedBy: 'Finance Manager'
    }
  ];

  // Sample bank accounts
  const bankAccounts = [
    {
      id: 'ACC-001',
      name: 'Emirates NBD Business Account',
      accountNumber: 'AE07 0331 1234 5678 9012 345',
      currency: 'AED',
      balance: 2850000,
      bank: 'Emirates NBD',
      type: 'Current'
    },
    {
      id: 'ACC-002',
      name: 'ADCB USD Account',
      accountNumber: 'AE07 0030 4567 8901 2345 678',
      currency: 'USD',
      balance: 850000,
      bank: 'Abu Dhabi Commercial Bank',
      type: 'Current'
    },
    {
      id: 'ACC-003',
      name: 'HSBC EUR Account',
      accountNumber: 'AE07 0200 2345 6789 0123 456',
      currency: 'EUR',
      balance: 450000,
      bank: 'HSBC UAE',
      type: 'Current'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-purple-600" />;
      case 'pending_approval': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'wire_transfer': return <Banknote className="h-4 w-4" />;
      case 'letter_of_credit': return <FileText className="h-4 w-4" />;
      case 'check': return <Receipt className="h-4 w-4" />;
      case 'cash': return <Wallet className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getTotalsByStatus = () => {
    const completed = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amountUSD, 0);
    const processing = payments.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amountUSD, 0);
    const scheduled = payments.filter(p => p.status === 'scheduled').reduce((sum, p) => sum + p.amountUSD, 0);
    const pending = payments.filter(p => p.status === 'pending_approval').reduce((sum, p) => sum + p.amountUSD, 0);

    return { completed, processing, scheduled, pending };
  };

  const totals = getTotalsByStatus();

  const filteredPayments = selectedStatus === 'all'
    ? payments
    : payments.filter(payment => payment.status === selectedStatus);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Payments</h1>
          <p className="text-gray-600">Process and manage international vendor payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowNewPayment(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold">USD ${(totals.pending + totals.scheduled).toLocaleString()}</p>
                <div className="text-xs text-yellow-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {payments.filter(p => p.status === 'pending_approval' || p.status === 'scheduled').length} payments
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold">USD ${totals.processing.toLocaleString()}</p>
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  In progress
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold">USD ${totals.completed.toLocaleString()}</p>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15.2% from yesterday
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold">AED 2.85M</p>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <Wallet className="h-3 w-3" />
                  Multiple currencies
                </div>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Payments Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment Transactions</CardTitle>
                  <CardDescription>Track and manage vendor payment processing</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending_approval">Pending Approval</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowPaymentDetails(true);
                      }}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.id}</div>
                          <div className="text-sm text-gray-500">{payment.invoiceNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.vendor.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {payment.vendor.country}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.currency} {payment.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">~USD ${payment.amountUSD.toLocaleString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMethodIcon(payment.paymentMethod)}
                          <span className="capitalize text-sm">
                            {payment.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">
                            {payment.processedDate || payment.scheduledDate}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.processedDate ? 'Processed' : 'Scheduled'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPayment(payment);
                              setShowPaymentDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payment.status === 'pending_approval' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Bank Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Bank Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bankAccounts.map((account) => (
                <div key={account.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-sm">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.bank}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {account.currency}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold mb-1">
                    {account.currency} {account.balance.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {account.accountNumber}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="h-4 w-4 mr-2" />
                Currency Exchange
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Payment Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                SWIFT Lookup
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Receipt className="h-4 w-4 mr-2" />
                Payment Reports
              </Button>
            </CardContent>
          </Card>

          {/* Payment Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Payment Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-medium text-yellow-800 text-sm">High Value Payment</div>
                <div className="text-yellow-700 text-xs">PAY-2024-003 requires additional approval</div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-800 text-sm">LC Processing</div>
                <div className="text-blue-700 text-xs">Letter of Credit for TRC being processed</div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-medium text-green-800 text-sm">Exchange Rate Alert</div>
                <div className="text-green-700 text-xs">Favorable USD rate available for payments</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details - {selectedPayment?.id}
            </DialogTitle>
            <DialogDescription>
              Complete payment transaction information and processing status
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="vendor">Vendor Info</TabsTrigger>
                <TabsTrigger value="banking">Banking</TabsTrigger>
                <TabsTrigger value="approvals">Approvals</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-medium">{selectedPayment.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice:</span>
                        <span className="font-medium">{selectedPayment.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium">{selectedPayment.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <div className="flex items-center gap-2">
                          {getMethodIcon(selectedPayment.paymentMethod)}
                          <span className="capitalize">
                            {selectedPayment.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedPayment.status)}
                          <Badge className={getStatusColor(selectedPayment.status)}>
                            {selectedPayment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Amount Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium text-lg">
                          {selectedPayment.currency} {selectedPayment.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Exchange Rate:</span>
                        <span className="font-medium">{selectedPayment.exchangeRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">USD Equivalent:</span>
                        <span className="font-medium">USD ${selectedPayment.amountUSD.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Fees:</span>
                        <span className="font-medium">USD ${selectedPayment.fees}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Cost:</span>
                        <span>USD ${(selectedPayment.amountUSD + selectedPayment.fees).toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Payment Created</div>
                          <div className="text-sm text-gray-600">Payment request submitted</div>
                        </div>
                      </div>

                      {selectedPayment.status !== 'pending_approval' && (
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">Approved</div>
                            <div className="text-sm text-gray-600">Payment approved by {selectedPayment.approvedBy}</div>
                          </div>
                        </div>
                      )}

                      {selectedPayment.status === 'processing' || selectedPayment.status === 'completed' ? (
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Processing</div>
                            <div className="text-sm text-gray-600">Payment being processed by bank</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-500">Processing</div>
                            <div className="text-sm text-gray-500">Scheduled for {selectedPayment.scheduledDate}</div>
                          </div>
                        </div>
                      )}

                      {selectedPayment.status === 'completed' ? (
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">Completed</div>
                            <div className="text-sm text-gray-600">Payment successfully transferred on {selectedPayment.processedDate}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-500">Completion</div>
                            <div className="text-sm text-gray-500">Pending processing</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vendor" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendor Name:</span>
                      <span className="font-medium">{selectedPayment.vendor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span className="font-medium">{selectedPayment.vendor.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preferred Currency:</span>
                      <span className="font-medium">{selectedPayment.vendor.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Description:</span>
                      <span className="font-medium">{selectedPayment.description}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="banking" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Banking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Name:</span>
                      <span className="font-medium">{selectedPayment.vendor.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium font-mono">{selectedPayment.vendor.accountNumber}</span>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">SWIFT Code:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium font-mono">{selectedPayment.vendor.swiftCode}</span>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transfer Reference:</span>
                      <span className="font-medium font-mono">{selectedPayment.reference}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compliance & Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm">AML/KYC verification completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Sanctions screening passed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">UAE Central Bank approved route</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-green-600" />
                      <span className="text-sm">SWIFT network verified</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approvals" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Approval Workflow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Amount:</span>
                      <span className="font-medium">USD ${selectedPayment.amountUSD.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approval Required:</span>
                      <span className="font-medium">
                        {selectedPayment.amountUSD > 10000 ? 'Senior Management' : 'Finance Manager'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Status:</span>
                      <span className="font-medium">{selectedPayment.approvedBy}</span>
                    </div>
                  </CardContent>
                </Card>

                {selectedPayment.status === 'pending_approval' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Approval Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Payment
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Request Changes
                      </Button>
                      <Button variant="destructive" className="w-full">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Payment
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* New Payment Dialog */}
      <Dialog open={showNewPayment} onOpenChange={setShowNewPayment}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Payment
            </DialogTitle>
            <DialogDescription>
              Process a new vendor payment transaction
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor">Select Vendor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rashid">Al-Rashid Oud Suppliers</SelectItem>
                    <SelectItem value="taif">Taif Rose Company</SelectItem>
                    <SelectItem value="cambodian">Cambodian Oud Direct</SelectItem>
                    <SelectItem value="mumbai">Mumbai Attar House</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="invoice">Related Invoice</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inv1">INV-2024-005</SelectItem>
                    <SelectItem value="inv2">INV-2024-006</SelectItem>
                    <SelectItem value="inv3">INV-2024-007</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                    <SelectItem value="letter_of_credit">Letter of Credit</SelectItem>
                    <SelectItem value="check">Company Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Payment Description</Label>
              <Textarea
                id="description"
                placeholder="Enter payment description or reference..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="highPriority" />
              <Label htmlFor="highPriority">High Priority Payment (requires additional approval)</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Submit Payment
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorPaymentPage;