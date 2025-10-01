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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingDown,
  Building,
  FileText,
  CreditCard,
  Banknote,
  Calculator,
  Timer,
  Phone,
  Mail
} from 'lucide-react';

export default function AccountsPayablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVendor, setFilterVendor] = useState('all');
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [selectedBills, setSelectedBills] = useState<string[]>([]);

  // Accounts Payable Data
  const payables = [
    {
      id: 'BILL-001',
      vendorName: 'Al-Taiba Suppliers',
      vendorEmail: 'orders@altaiba.ae',
      vendorPhone: '+971-4-234-5678',
      billDate: '2024-09-25',
      dueDate: '2024-10-25',
      totalAmount: 1260,
      paidAmount: 0,
      remainingAmount: 1260,
      vatAmount: 60,
      currency: 'AED',
      status: 'Outstanding',
      priority: 'Medium',
      daysPastDue: 0,
      paymentTerms: 'Net 30',
      description: 'Raw Materials - Premium Oud',
      category: 'Inventory',
      purchaseOrderNo: 'PO-023',
      approvedBy: 'Omar Hassan',
      nextPaymentDate: '2024-10-20'
    },
    {
      id: 'BILL-002',
      vendorName: 'Emirates Glass & Packaging',
      vendorEmail: 'sales@emiratesglass.ae',
      vendorPhone: '+971-6-789-0123',
      billDate: '2024-09-20',
      dueDate: '2024-10-20',
      totalAmount: 850,
      paidAmount: 0,
      remainingAmount: 850,
      vatAmount: 42.5,
      currency: 'AED',
      status: 'Due Today',
      priority: 'High',
      daysPastDue: 0,
      paymentTerms: 'Net 30',
      description: 'Perfume Bottles & Packaging',
      category: 'Packaging',
      purchaseOrderNo: 'PO-024',
      approvedBy: 'Fatima Al-Zahra',
      nextPaymentDate: '2024-10-01'
    },
    {
      id: 'BILL-003',
      vendorName: 'Dubai Electricity & Water Authority',
      vendorEmail: 'billing@dewa.gov.ae',
      vendorPhone: '+971-4-601-9999',
      billDate: '2024-08-15',
      dueDate: '2024-09-15',
      totalAmount: 2200,
      paidAmount: 0,
      remainingAmount: 2200,
      vatAmount: 110,
      currency: 'AED',
      status: 'Overdue',
      priority: 'Critical',
      daysPastDue: 15,
      paymentTerms: 'Net 30',
      description: 'Electricity & Water - August 2024',
      category: 'Utilities',
      purchaseOrderNo: 'N/A',
      approvedBy: 'Admin',
      nextPaymentDate: '2024-10-01'
    },
    {
      id: 'BILL-004',
      vendorName: 'Arabian Logistics LLC',
      vendorEmail: 'billing@arabianlogistics.ae',
      vendorPhone: '+971-4-567-8900',
      billDate: '2024-09-18',
      dueDate: '2024-10-18',
      totalAmount: 1800,
      paidAmount: 900,
      remainingAmount: 900,
      vatAmount: 90,
      currency: 'AED',
      status: 'Partial',
      priority: 'Medium',
      daysPastDue: 0,
      paymentTerms: 'Net 30',
      description: 'Shipping & Freight Services',
      category: 'Logistics',
      purchaseOrderNo: 'PO-025',
      approvedBy: 'Omar Hassan',
      nextPaymentDate: '2024-10-15'
    },
    {
      id: 'BILL-005',
      vendorName: 'Premium Office Supplies',
      vendorEmail: 'sales@premiumoffice.ae',
      vendorPhone: '+971-4-345-6789',
      billDate: '2024-09-10',
      dueDate: '2024-10-10',
      totalAmount: 420,
      paidAmount: 420,
      remainingAmount: 0,
      vatAmount: 21,
      currency: 'AED',
      status: 'Paid',
      priority: 'Low',
      daysPastDue: 0,
      paymentTerms: 'Net 30',
      description: 'Office Supplies & Stationery',
      category: 'Office Expenses',
      purchaseOrderNo: 'PO-026',
      approvedBy: 'Aisha Al-Blooshi',
      nextPaymentDate: null
    },
    {
      id: 'BILL-006',
      vendorName: 'Gulf Marketing Solutions',
      vendorEmail: 'invoices@gulfmarketing.ae',
      vendorPhone: '+971-4-456-7890',
      billDate: '2024-09-30',
      dueDate: '2024-10-30',
      totalAmount: 3150,
      paidAmount: 0,
      remainingAmount: 3150,
      vatAmount: 157.5,
      currency: 'AED',
      status: 'Outstanding',
      priority: 'High',
      daysPastDue: 0,
      paymentTerms: 'Net 30',
      description: 'Digital Marketing & Advertising',
      category: 'Marketing',
      purchaseOrderNo: 'PO-027',
      approvedBy: 'Admin',
      nextPaymentDate: '2024-10-25'
    }
  ];

  // Vendor Summary
  const vendorSummary = [
    {
      vendorName: 'Al-Taiba Suppliers',
      totalOutstanding: 1260,
      oldestBill: 'BILL-001',
      daysPastDue: 0,
      creditLimit: 10000,
      paymentHistory: 'Excellent',
      monthlySpend: 3500
    },
    {
      vendorName: 'Emirates Glass & Packaging',
      totalOutstanding: 850,
      oldestBill: 'BILL-002',
      daysPastDue: 0,
      creditLimit: 5000,
      paymentHistory: 'Good',
      monthlySpend: 1200
    },
    {
      vendorName: 'Dubai Electricity & Water Authority',
      totalOutstanding: 2200,
      oldestBill: 'BILL-003',
      daysPastDue: 15,
      creditLimit: 0,
      paymentHistory: 'Critical',
      monthlySpend: 2200
    },
    {
      vendorName: 'Arabian Logistics LLC',
      totalOutstanding: 900,
      oldestBill: 'BILL-004',
      daysPastDue: 0,
      creditLimit: 8000,
      paymentHistory: 'Good',
      monthlySpend: 2100
    },
    {
      vendorName: 'Gulf Marketing Solutions',
      totalOutstanding: 3150,
      oldestBill: 'BILL-006',
      daysPastDue: 0,
      creditLimit: 15000,
      paymentHistory: 'Good',
      monthlySpend: 3150
    }
  ];

  // Payment Schedule
  const paymentSchedule = [
    {
      date: '2024-10-01',
      bills: [
        { id: 'BILL-002', vendor: 'Emirates Glass & Packaging', amount: 850 },
        { id: 'BILL-003', vendor: 'Dubai Electricity & Water Authority', amount: 2200 }
      ],
      totalAmount: 3050
    },
    {
      date: '2024-10-15',
      bills: [
        { id: 'BILL-004', vendor: 'Arabian Logistics LLC', amount: 900 }
      ],
      totalAmount: 900
    },
    {
      date: '2024-10-20',
      bills: [
        { id: 'BILL-001', vendor: 'Al-Taiba Suppliers', amount: 1260 }
      ],
      totalAmount: 1260
    },
    {
      date: '2024-10-25',
      bills: [
        { id: 'BILL-006', vendor: 'Gulf Marketing Solutions', amount: 3150 }
      ],
      totalAmount: 3150
    }
  ];

  const formatAED = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Outstanding': 'bg-blue-100 text-blue-800',
      'Due Today': 'bg-orange-100 text-orange-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Partial': 'bg-yellow-100 text-yellow-800',
      'Paid': 'bg-green-100 text-green-800',
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
      'Poor': 'text-red-600',
      'Critical': 'text-red-600'
    };
    return colorConfig[history as keyof typeof colorConfig] || 'text-gray-600';
  };

  const filteredPayables = payables.filter(bill => {
    const matchesSearch =
      bill.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || bill.status.toLowerCase().replace(' ', '-') === filterStatus;
    const matchesVendor = filterVendor === 'all' || bill.vendorName === filterVendor;

    return matchesSearch && matchesStatus && matchesVendor;
  });

  const totalOutstanding = payables
    .filter(bill => bill.status !== 'Paid')
    .reduce((sum, bill) => sum + bill.remainingAmount, 0);

  const totalOverdue = payables
    .filter(bill => bill.status === 'Overdue')
    .reduce((sum, bill) => sum + bill.remainingAmount, 0);

  const totalDueToday = payables
    .filter(bill => bill.status === 'Due Today')
    .reduce((sum, bill) => sum + bill.remainingAmount, 0);

  const handleBillSelection = (billId: string, checked: boolean) => {
    if (checked) {
      setSelectedBills([...selectedBills, billId]);
    } else {
      setSelectedBills(selectedBills.filter(id => id !== billId));
    }
  };

  const selectedAmount = payables
    .filter(bill => selectedBills.includes(bill.id))
    .reduce((sum, bill) => sum + bill.remainingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-8 w-8 text-amber-600" />
            Accounts Payable
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage vendor bills, payment schedules, and cash flow planning
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          {selectedBills.length > 0 && (
            <Button variant="outline" className="gap-2 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4" />
              Pay Selected ({selectedBills.length})
            </Button>
          )}
          <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4" />
                New Bill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Bill</DialogTitle>
                <DialogDescription>
                  Create a new vendor bill for accounts payable
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="al-taiba">Al-Taiba Suppliers</SelectItem>
                        <SelectItem value="emirates-glass">Emirates Glass & Packaging</SelectItem>
                        <SelectItem value="dewa">Dubai Electricity & Water Authority</SelectItem>
                        <SelectItem value="arabian-logistics">Arabian Logistics LLC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bill-date">Bill Date</Label>
                    <Input id="bill-date" type="date" defaultValue="2024-09-30" />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="po-number">PO Number</Label>
                    <Input id="po-number" placeholder="PO-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="office">Office Expenses</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Bill description" />
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
                <Button variant="outline" onClick={() => setIsAddBillOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Create Bill
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
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(totalOutstanding)}
            </div>
            <p className="text-xs text-red-600 mt-1">
              {payables.filter(bill => bill.status !== 'Paid').length} outstanding bills
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Due Today
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(totalDueToday)}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              {payables.filter(bill => bill.status === 'Due Today').length} bills due today
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overdue Amount
            </CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatAED(totalOverdue)}
            </div>
            <p className="text-xs text-red-600 mt-1">
              {payables.filter(bill => bill.status === 'Overdue').length} overdue bills
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Payment Days
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              28 days
            </div>
            <p className="text-xs text-green-600 mt-1">
              -2 days from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Selection Summary */}
      {selectedBills.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-green-900">
                  {selectedBills.length} bills selected for payment
                </h3>
                <p className="text-sm text-green-700">
                  Total amount: {formatAED(selectedAmount)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedBills([])}>
                  Clear Selection
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Process Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="bills" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bills" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Outstanding Bills
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Vendor Summary
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Payment Schedule
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            Cash Flow
          </TabsTrigger>
        </TabsList>

        {/* Outstanding Bills Tab */}
        <TabsContent value="bills">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                Outstanding Bills
              </CardTitle>
              <CardDescription>
                All unpaid and partially paid vendor bills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bills or vendors..."
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
                    <SelectItem value="outstanding">Outstanding</SelectItem>
                    <SelectItem value="due-today">Due Today</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterVendor} onValueChange={setFilterVendor}>
                  <SelectTrigger className="w-[200px]">
                    <Building className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Vendors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {Array.from(new Set(payables.map(bill => bill.vendorName))).map(vendor => (
                      <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={filteredPayables.length > 0 && filteredPayables.every(bill => selectedBills.includes(bill.id))}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBills(filteredPayables.map(bill => bill.id));
                            } else {
                              setSelectedBills([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Bill</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayables.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedBills.includes(bill.id)}
                            onCheckedChange={(checked) => handleBillSelection(bill.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{bill.id}</div>
                            <div className="text-sm text-gray-500">{bill.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{bill.vendorName}</div>
                            <div className="text-sm text-gray-500">{bill.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`${
                            new Date(bill.dueDate) < new Date() && bill.status !== 'Paid'
                              ? 'text-red-600 font-medium'
                              : new Date(bill.dueDate).toDateString() === new Date().toDateString()
                              ? 'text-orange-600 font-medium'
                              : 'text-gray-900'
                          }`}>
                            {bill.dueDate}
                          </div>
                          {bill.daysPastDue > 0 && (
                            <div className="text-xs text-red-600">
                              {bill.daysPastDue} days overdue
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAED(bill.totalAmount)}
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          {formatAED(bill.remainingAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(bill.status)}>
                            {bill.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityBadge(bill.priority)}>
                            {bill.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <CheckCircle className="h-4 w-4" />
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

        {/* Vendor Summary Tab */}
        <TabsContent value="vendors">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-amber-600" />
                Vendor Summary
              </CardTitle>
              <CardDescription>
                Outstanding amounts and payment history by vendor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Total Outstanding</TableHead>
                      <TableHead>Oldest Bill</TableHead>
                      <TableHead>Days Past Due</TableHead>
                      <TableHead>Monthly Spend</TableHead>
                      <TableHead>Payment History</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorSummary.map((vendor) => (
                      <TableRow key={vendor.vendorName}>
                        <TableCell>
                          <div className="font-medium">{vendor.vendorName}</div>
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          {formatAED(vendor.totalOutstanding)}
                        </TableCell>
                        <TableCell>{vendor.oldestBill}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            vendor.daysPastDue > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {vendor.daysPastDue > 0 ? `${vendor.daysPastDue} days` : 'Current'}
                          </span>
                        </TableCell>
                        <TableCell>{formatAED(vendor.monthlySpend)}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${getPaymentHistoryColor(vendor.paymentHistory)}`}>
                            {vendor.paymentHistory}
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

        {/* Payment Schedule Tab */}
        <TabsContent value="schedule">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                Payment Schedule
              </CardTitle>
              <CardDescription>
                Upcoming payment dates and cash flow planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {paymentSchedule.map((schedule, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{schedule.date}</h3>
                        <p className="text-sm text-gray-600">
                          {schedule.bills.length} bills due
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {formatAED(schedule.totalAmount)}
                        </div>
                        <Button size="sm" className="mt-2">
                          Schedule Payment
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {schedule.bills.map((bill) => (
                        <div key={bill.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{bill.id}</span> - {bill.vendor}
                          </div>
                          <span className="font-medium">{formatAED(bill.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-amber-600" />
                  Cash Flow Forecast
                </CardTitle>
                <CardDescription>
                  Projected cash outflow for upcoming payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <div className="text-center">
                    <Calculator className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Cash Flow Chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Payment Analytics</CardTitle>
                <CardDescription>
                  Key metrics for accounts payable management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Payment Timeliness</span>
                      <span className="text-green-600 font-bold">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Early Payment Discounts</span>
                      <span className="text-blue-600 font-bold">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '12%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Vendor Satisfaction</span>
                      <span className="text-green-600 font-bold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Payment Insights</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• 3 bills are due within 7 days</li>
                      <li>• 1 bill is overdue and requires immediate attention</li>
                      <li>• AED 2,500 in early payment discounts available</li>
                      <li>• Cash flow is positive for next 30 days</li>
                    </ul>
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