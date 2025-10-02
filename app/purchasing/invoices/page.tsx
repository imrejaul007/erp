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
import {
  FileText,
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
  CreditCard,
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
  ShoppingCart,
  Users,
  Globe
} from 'lucide-react';
import { format } from 'date-fns';

const SupplierInvoicesPage = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample invoice data
  const invoices = [
    {
      id: 'INV-2024-001',
      invoiceNumber: 'ALR-INV-2024-001',
      poNumber: 'PO-2024-001',
      vendor: {
        name: 'Al-Rashid Oud Suppliers',
        country: 'UAE',
        email: 'billing@alrashidoud.ae',
        phone: '+971-4-123-4567',
        address: 'Al Ras Area, Deira, Dubai, UAE'
      },
      issueDate: '2024-01-15',
      dueDate: '2024-02-14',
      amount: 25600,
      currency: 'AED',
      status: 'paid',
      paymentMethod: 'Wire Transfer',
      paymentDate: '2024-01-20',
      items: [
        { description: 'Premium Oud Oil 50ml', qty: 10, unitPrice: 1200, total: 12000 },
        { description: 'Rose Attar 30ml', qty: 20, unitPrice: 680, total: 13600 }
      ],
      taxes: {
        vat: 1280,
        customsDuty: 0
      },
      discounts: 0,
      attachments: ['invoice.pdf', 'receipt.pdf']
    },
    {
      id: 'INV-2024-002',
      invoiceNumber: 'TRC-INV-2024-007',
      poNumber: 'PO-2024-002',
      vendor: {
        name: 'Taif Rose Company',
        country: 'Saudi Arabia',
        email: 'accounts@taifrose.sa',
        phone: '+966-12-987-6543',
        address: 'Taif Industrial Area, Taif, Saudi Arabia'
      },
      issueDate: '2024-01-18',
      dueDate: '2024-02-17',
      amount: 12450,
      currency: 'SAR',
      status: 'pending',
      paymentMethod: 'Letter of Credit',
      paymentDate: null,
      items: [
        { description: 'Taif Rose Oil Premium 25ml', qty: 15, unitPrice: 450, total: 6750 },
        { description: 'Rose Water 1L', qty: 12, unitPrice: 475, total: 5700 }
      ],
      taxes: {
        vat: 622.5,
        customsDuty: 0
      },
      discounts: 200,
      attachments: ['invoice.pdf']
    },
    {
      id: 'INV-2024-003',
      invoiceNumber: 'COD-INV-2024-003',
      poNumber: 'PO-2024-003',
      vendor: {
        name: 'Cambodian Oud Direct',
        country: 'Cambodia',
        email: 'billing@cambodianoud.com',
        phone: '+855-23-456-789',
        address: 'Phnom Penh Industrial Zone, Cambodia'
      },
      issueDate: '2024-01-22',
      dueDate: '2024-02-21',
      amount: 45000,
      currency: 'USD',
      status: 'overdue',
      paymentMethod: 'Wire Transfer',
      paymentDate: null,
      items: [
        { description: 'Wild Oud Oil Grade A+ 10ml', qty: 5, unitPrice: 8000, total: 40000 },
        { description: 'Oud Wood Chips Premium 100g', qty: 10, unitPrice: 500, total: 5000 }
      ],
      taxes: {
        vat: 2250,
        customsDuty: 1125
      },
      discounts: 1000,
      attachments: ['invoice.pdf', 'cites_permit.pdf']
    },
    {
      id: 'INV-2024-004',
      invoiceNumber: 'MAH-INV-2024-012',
      poNumber: 'PO-2024-004',
      vendor: {
        name: 'Mumbai Attar House',
        country: 'India',
        email: 'finance@mumbaiattars.in',
        phone: '+91-22-1234-5678',
        address: 'Mohammed Ali Road, Mumbai, India'
      },
      issueDate: '2024-01-25',
      dueDate: '2024-02-24',
      amount: 18750,
      currency: 'USD',
      status: 'processing',
      paymentMethod: 'Wire Transfer',
      paymentDate: null,
      items: [
        { description: 'Sandalwood Attar 25ml', qty: 25, unitPrice: 320, total: 8000 },
        { description: 'White Musk Oil 50ml', qty: 15, unitPrice: 450, total: 6750 },
        { description: 'Traditional Blend Attar 30ml', qty: 20, unitPrice: 200, total: 4000 }
      ],
      taxes: {
        vat: 937.5,
        customsDuty: 468.75
      },
      discounts: 500,
      attachments: ['invoice.pdf', 'packing_list.pdf']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const calculateInvoiceTotal = (invoice) => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    const totalTaxes = invoice.taxes.vat + invoice.taxes.customsDuty;
    return subtotal + totalTaxes - invoice.discounts;
  };

  const getTotalsByStatus = () => {
    const paid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0);
    const pending = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0);
    const overdue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0);
    const processing = invoices.filter(inv => inv.status === 'processing').reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0);

    return { paid, pending, overdue, processing };
  };

  const totals = getTotalsByStatus();

  const filteredInvoices = selectedStatus === 'all'
    ? invoices
    : invoices.filter(invoice => invoice.status === selectedStatus);

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Invoices</h1>
          <p className="text-gray-600">Manage supplier bills and invoice processing</p>
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
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Invoice
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
                <p className="text-xl sm:text-2xl font-bold">AED {(totals.pending + totals.overdue + totals.processing)?.toLocaleString() || "0"}</p>
                <div className="text-xs text-red-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% from last month
                </div>
              </div>
              <Receipt className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                <p className="text-xl sm:text-2xl font-bold">AED {totals.paid?.toLocaleString() || "0"}</p>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.2% from last month
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
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-xl sm:text-2xl font-bold">USD {totals.overdue?.toLocaleString() || "0"}</p>
                <div className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Requires attention
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-xl sm:text-2xl font-bold">USD {totals.processing?.toLocaleString() || "0"}</p>
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  In review
                </div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input placeholder="Search invoices..." className="w-64" />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisQuarter">This Quarter</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Invoices</CardTitle>
          <CardDescription>
            Manage and track all supplier bills and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setShowInvoiceDetails(true);
                  }}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">{invoice.poNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.vendor.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {invoice.vendor.country}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.issueDate}</TableCell>
                  <TableCell>
                    <div className={
                      new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid'
                        ? 'text-red-600 font-medium'
                        : ''
                    }>
                      {invoice.dueDate}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {invoice.currency} {calculateInvoiceTotal(invoice)?.toLocaleString() || "0"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(invoice.status)}
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvoice(invoice);
                          setShowInvoiceDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Details Dialog */}
      <Dialog open={showInvoiceDetails} onOpenChange={setShowInvoiceDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Details - {selectedInvoice?.invoiceNumber}
            </DialogTitle>
            <DialogDescription>
              Complete invoice information and payment processing
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Invoice Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Invoice Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice Number:</span>
                        <span className="font-medium">{selectedInvoice.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PO Number:</span>
                        <span className="font-medium">{selectedInvoice.poNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issue Date:</span>
                        <span className="font-medium">{selectedInvoice.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className={`font-medium ${
                          new Date(selectedInvoice.dueDate) < new Date() && selectedInvoice.status !== 'paid'
                            ? 'text-red-600'
                            : ''
                        }`}>
                          {selectedInvoice.dueDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedInvoice.status)}
                          <Badge className={getStatusColor(selectedInvoice.status)}>
                            {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Currency:</span>
                        <span className="font-medium">{selectedInvoice.currency}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vendor Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Vendor Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-gray-600 text-sm">Vendor Name</div>
                        <div className="font-medium">{selectedInvoice.vendor.name}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-sm">Address</div>
                        <div className="font-medium">{selectedInvoice.vendor.address}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedInvoice.vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedInvoice.vendor.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedInvoice.vendor.country}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Amount Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Amount Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">
                          {selectedInvoice.currency} {selectedInvoice.items.reduce((sum, item) => sum + item.total, 0)?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT ({((selectedInvoice.taxes.vat / selectedInvoice.items.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(1)}%):</span>
                        <span className="font-medium">{selectedInvoice.currency} {selectedInvoice.taxes.vat?.toLocaleString() || "0"}</span>
                      </div>
                      {selectedInvoice.taxes.customsDuty > 0 && (
                        <div className="flex justify-between">
                          <span>Customs Duty:</span>
                          <span className="font-medium">{selectedInvoice.currency} {selectedInvoice.taxes.customsDuty?.toLocaleString() || "0"}</span>
                        </div>
                      )}
                      {selectedInvoice.discounts > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span className="font-medium">-{selectedInvoice.currency} {selectedInvoice.discounts?.toLocaleString() || "0"}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span>{selectedInvoice.currency} {calculateInvoiceTotal(selectedInvoice)?.toLocaleString() || "0"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedInvoice.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell>{item.qty}</TableCell>
                            <TableCell>{selectedInvoice.currency} {item.unitPrice?.toLocaleString() || "0"}</TableCell>
                            <TableCell className="font-medium">{selectedInvoice.currency} {item.total?.toLocaleString() || "0"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-4 text-right space-y-2">
                      <div className="flex justify-between items-center min-w-64 ml-auto">
                        <span>Subtotal:</span>
                        <span className="font-medium">
                          {selectedInvoice.currency} {selectedInvoice.items.reduce((sum, item) => sum + item.total, 0)?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>VAT:</span>
                        <span className="font-medium">{selectedInvoice.currency} {selectedInvoice.taxes.vat?.toLocaleString() || "0"}</span>
                      </div>
                      {selectedInvoice.taxes.customsDuty > 0 && (
                        <div className="flex justify-between items-center">
                          <span>Customs Duty:</span>
                          <span className="font-medium">{selectedInvoice.currency} {selectedInvoice.taxes.customsDuty?.toLocaleString() || "0"}</span>
                        </div>
                      )}
                      {selectedInvoice.discounts > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                          <span>Discount:</span>
                          <span className="font-medium">-{selectedInvoice.currency} {selectedInvoice.discounts?.toLocaleString() || "0"}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span>{selectedInvoice.currency} {calculateInvoiceTotal(selectedInvoice)?.toLocaleString() || "0"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">{selectedInvoice.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedInvoice.status)}
                          <Badge className={getStatusColor(selectedInvoice.status)}>
                            {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      {selectedInvoice.paymentDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Date:</span>
                          <span className="font-medium">{selectedInvoice.paymentDate}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Due:</span>
                        <span className="font-medium text-lg">
                          {selectedInvoice.currency} {calculateInvoiceTotal(selectedInvoice)?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedInvoice.status !== 'paid' && (
                        <>
                          <Button className="w-full">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Process Payment
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Payment
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Flag className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </Button>
                        </>
                      )}
                      <Button variant="outline" className="w-full">
                        <Receipt className="h-4 w-4 mr-2" />
                        Generate Receipt
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Send Reminder
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {selectedInvoice.status === 'overdue' && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-800 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Overdue Payment Alert
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-red-700 space-y-2">
                        <p>This invoice is overdue by {Math.floor((new Date() - new Date(selectedInvoice.dueDate)) / (1000 * 60 * 60 * 24))} days.</p>
                        <p>Please contact the vendor to resolve payment or update the status.</p>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="destructive">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Vendor
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedInvoice.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{attachment}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Additional Documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Commercial Invoice - Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>VAT Registration Certificate - Valid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>UAE Import License - Active</span>
                      </div>
                      {selectedInvoice.vendor.country !== 'UAE' && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Certificate of Origin - Submitted</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierInvoicesPage;