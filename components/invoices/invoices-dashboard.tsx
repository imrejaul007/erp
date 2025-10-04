'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Plus,
  Search,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Send,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
}

interface InvoicePayment {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  reference?: string | null;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: Customer;
  order?: Order | null;
  invoiceType: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string | null;
  paymentTerms: string;
  currency: string;
  notes?: string | null;
  payments?: InvoicePayment[];
  convertedToInvoiceId?: string | null;
  createdAt: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export default function InvoicesDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    invoiceType: 'STANDARD',
    dueDate: '',
    paymentTerms: 'Net 30',
    subtotal: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 0,
    notes: '',
    terms: '',
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 },
  ]);

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'CASH',
    reference: '',
    notes: '',
  });

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (!response.ok) throw new Error('Failed to fetch invoices');
      const data = await response.json();
      setInvoices(data.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data.data || []);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].amount = updated[index].quantity * updated[index].unitPrice;
    }

    setLineItems(updated);

    // Recalculate totals
    const subtotal = updated.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * 0.05; // 5% VAT
    const totalAmount = subtotal + taxAmount - formData.discount;

    setFormData({
      ...formData,
      subtotal,
      taxAmount,
      totalAmount,
    });
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const handleCreate = async () => {
    try {
      if (!formData.customerId) {
        toast.error('Please select a customer');
        return;
      }

      if (!formData.dueDate) {
        toast.error('Please select a due date');
        return;
      }

      if (lineItems.length === 0 || !lineItems[0].description) {
        toast.error('Please add at least one line item');
        return;
      }

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          lineItems,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create invoice');
      }

      toast.success('Invoice created successfully');
      setShowCreateDialog(false);
      resetForm();
      fetchInvoices();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create invoice');
    }
  };

  const handleRecordPayment = async () => {
    try {
      if (!selectedInvoice) return;

      if (paymentForm.amount <= 0) {
        toast.error('Payment amount must be positive');
        return;
      }

      const response = await fetch(`/api/invoices/${selectedInvoice.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to record payment');
      }

      toast.success('Payment recorded successfully');
      setShowPaymentDialog(false);
      setPaymentForm({ amount: 0, paymentMethod: 'CASH', reference: '', notes: '' });
      fetchInvoices();
    } catch (error: any) {
      toast.error(error.message || 'Failed to record payment');
    }
  };

  const handleCancelInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this invoice?')) return;

    try {
      const response = await fetch(`/api/invoices?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel invoice');
      }

      toast.success('Invoice cancelled successfully');
      fetchInvoices();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel invoice');
    }
  };

  const handleSendInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}/send`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send invoice');
      }

      toast.success('Invoice marked as sent');
      fetchInvoices();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invoice');
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      dueDate: '',
      paymentTerms: 'Net 30',
      subtotal: 0,
      taxAmount: 0,
      discount: 0,
      totalAmount: 0,
      notes: '',
      terms: '',
    });
    setLineItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const openPaymentDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      amount: Number(invoice.balanceDue),
      paymentMethod: 'CASH',
      reference: '',
      notes: '',
    });
    setShowPaymentDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      DRAFT: { variant: 'secondary', icon: FileText, label: 'Draft' },
      SENT: { variant: 'default', icon: Send, label: 'Sent' },
      VIEWED: { variant: 'default', icon: Eye, label: 'Viewed' },
      PARTIALLY_PAID: { variant: 'default', icon: Clock, label: 'Partially Paid' },
      PAID: { variant: 'default', icon: CheckCircle, label: 'Paid' },
      OVERDUE: { variant: 'destructive', icon: AlertCircle, label: 'Overdue' },
      CANCELLED: { variant: 'destructive', icon: X, label: 'Cancelled' },
    };

    const config = variants[status] || variants.DRAFT;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const types: Record<string, { variant: any; label: string }> = {
      STANDARD: { variant: 'default', label: 'Standard' },
      PROFORMA: { variant: 'outline', label: 'Proforma' },
      RECURRING: { variant: 'secondary', label: 'Recurring' },
      PARTIAL: { variant: 'outline', label: 'Partial' },
      CREDIT_NOTE: { variant: 'destructive', label: 'Credit Note' },
      DEBIT_NOTE: { variant: 'default', label: 'Debit Note' },
    };

    const config = types[type] || types.STANDARD;

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalOutstanding = invoices
    .filter((i) => i.status !== 'PAID' && i.status !== 'CANCELLED')
    .reduce((sum, i) => sum + Number(i.balanceDue), 0);

  const totalOverdue = invoices
    .filter((i) => {
      const dueDate = new Date(i.dueDate);
      const now = new Date();
      return dueDate < now && i.status !== 'PAID' && i.status !== 'CANCELLED';
    })
    .reduce((sum, i) => sum + Number(i.balanceDue), 0);

  const totalPaid = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + Number(i.totalAmount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading invoices...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Invoices</h1>
          <p className="text-muted-foreground">Manage and track customer invoices</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>Generate a new invoice for a customer</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer *</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Invoice Type *</Label>
                  <Select
                    value={formData.invoiceType}
                    onValueChange={(value) => setFormData({ ...formData, invoiceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard Invoice</SelectItem>
                      <SelectItem value="PROFORMA">Proforma Invoice</SelectItem>
                      <SelectItem value="PARTIAL">Partial/Advance Payment</SelectItem>
                      <SelectItem value="CREDIT_NOTE">Credit Note</SelectItem>
                      <SelectItem value="DEBIT_NOTE">Debit Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Due Date *</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                      <SelectItem value="Net 7">Net 7</SelectItem>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Line Items</Label>
                  <Button type="button" size="sm" onClick={addLineItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                {lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-5">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Unit Price"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(index, 'unitPrice', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={item.amount}
                        disabled
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeLineItem(index)}
                        disabled={lineItems.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">AED {formData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%):</span>
                    <span className="font-semibold">AED {formData.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-lg font-bold">AED {formData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create Invoice</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalOutstanding.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Unpaid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalOverdue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid (Total)</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="VIEWED">Viewed</SelectItem>
                <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.customer.name}</TableCell>
                    <TableCell>{getTypeBadge(invoice.invoiceType)}</TableCell>
                    <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>AED {Number(invoice.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>AED {Number(invoice.paidAmount).toFixed(2)}</TableCell>
                    <TableCell>AED {Number(invoice.balanceDue).toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {invoice.status === 'DRAFT' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendInvoice(invoice.id)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        )}
                        {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
                          <Button
                            size="sm"
                            onClick={() => openPaymentDialog(invoice)}
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Pay
                          </Button>
                        )}
                        {invoice.status === 'DRAFT' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelInvoice(invoice.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              {selectedInvoice && `Invoice: ${selectedInvoice.invoiceNumber}`}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Total Amount:</span>
                  <span className="font-semibold">AED {Number(selectedInvoice.totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Paid Amount:</span>
                  <span className="font-semibold">AED {Number(selectedInvoice.paidAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Balance Due:</span>
                  <span>AED {Number(selectedInvoice.balanceDue).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <Label>Payment Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label>Payment Method *</Label>
                <Select
                  value={paymentForm.paymentMethod}
                  onValueChange={(value) => setPaymentForm({ ...paymentForm, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="DIGITAL_WALLET">Digital Wallet</SelectItem>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Reference</Label>
                <Input
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  placeholder="Transaction ID, cheque number, etc."
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRecordPayment}>Record Payment</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
