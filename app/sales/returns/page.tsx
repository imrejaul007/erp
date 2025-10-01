'use client';

import { useState } from 'react';
import { Plus, Search, Filter, RotateCcw, Eye, Edit, Trash2, Package, ArrowLeftRight, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Mock data for returns and exchanges
const returnsData = [
  {
    id: 'RET-2024-001',
    type: 'Return',
    originalOrder: 'ORD-2024-045',
    customer: 'Aisha Al-Zahra',
    phone: '+971 50 123 4567',
    items: [
      { name: 'Royal Oud Premium', quantity: 1, price: 450.00, reason: 'Product defect', condition: 'Unopened' },
    ],
    totalAmount: 450.00,
    refundAmount: 450.00,
    status: 'Processed',
    date: '2024-10-01',
    processedBy: 'Sarah Ahmad',
    refundMethod: 'Original Payment Method',
    notes: 'Bottle had manufacturing defect in spray mechanism',
    approvedBy: 'Manager',
  },
  {
    id: 'EXC-2024-001',
    type: 'Exchange',
    originalOrder: 'ORD-2024-033',
    customer: 'Mohammed Saeed',
    phone: '+971 55 987 6543',
    items: [
      { name: 'Rose Garden Collection', quantity: 1, price: 280.00, reason: 'Wrong fragrance', condition: 'Unopened' },
    ],
    exchangeItems: [
      { name: 'Amber Essence Deluxe', quantity: 1, price: 320.00 },
    ],
    totalAmount: 280.00,
    exchangeAmount: 320.00,
    additionalPayment: 40.00,
    status: 'Completed',
    date: '2024-09-30',
    processedBy: 'Omar Hassan',
    notes: 'Customer preferred amber over rose fragrance',
    approvedBy: 'Manager',
  },
  {
    id: 'RET-2024-002',
    type: 'Return',
    originalOrder: 'ORD-2024-038',
    customer: 'Fatima Hassan',
    phone: '+971 52 456 7890',
    items: [
      { name: 'Sandalwood Serenity', quantity: 2, price: 380.00, reason: 'Customer dissatisfaction', condition: 'Opened' },
    ],
    totalAmount: 760.00,
    refundAmount: 532.00,
    status: 'Pending Approval',
    date: '2024-09-29',
    processedBy: 'Layla Al-Rashid',
    refundMethod: 'Store Credit',
    notes: 'Customer found fragrance too strong. 30% restocking fee applied for opened items.',
    approvedBy: 'Pending',
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Processed': 'secondary',
    'Completed': 'secondary',
    'Pending Approval': 'default',
    'Rejected': 'destructive',
    'In Progress': 'outline',
  };

  const icons = {
    'Processed': CheckCircle,
    'Completed': CheckCircle,
    'Pending Approval': Clock,
    'Rejected': AlertTriangle,
    'In Progress': RefreshCw,
  };

  const Icon = icons[status as keyof typeof icons] || Clock;

  return (
    <Badge variant={variants[status] || 'outline'} className="gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
};

const getTypeBadge = (type: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Return': 'destructive',
    'Exchange': 'default',
  };

  const icons = {
    'Return': RotateCcw,
    'Exchange': ArrowLeftRight,
  };

  const Icon = icons[type as keyof typeof icons] || RotateCcw;

  return (
    <Badge variant={variants[type] || 'outline'} className="gap-1">
      <Icon className="h-3 w-3" />
      {type}
    </Badge>
  );
};

export default function ReturnsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReturn, setSelectedReturn] = useState<typeof returnsData[0] | null>(null);
  const [isNewReturnDialogOpen, setIsNewReturnDialogOpen] = useState(false);

  const filteredReturns = returnsData.filter(returnItem => {
    const matchesSearch = returnItem.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.originalOrder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || returnItem.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesType = typeFilter === 'all' || returnItem.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalReturns = returnsData.filter(item => item.type === 'Return').length;
  const totalExchanges = returnsData.filter(item => item.type === 'Exchange').length;
  const pendingApprovals = returnsData.filter(item => item.status === 'Pending Approval').length;
  const totalRefundAmount = returnsData
    .filter(item => item.type === 'Return' && item.status === 'Processed')
    .reduce((sum, item) => sum + item.refundAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <RotateCcw className="h-8 w-8 text-oud-600" />
            Returns & Exchanges
          </h1>
          <p className="text-muted-foreground mt-1">
            Process customer returns, exchanges, and refunds
          </p>
        </div>
        <Dialog open={isNewReturnDialogOpen} onOpenChange={setIsNewReturnDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
              <Plus className="h-4 w-4" />
              New Return/Exchange
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Process Return/Exchange</DialogTitle>
              <DialogDescription>
                Create a new return or exchange request
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="original-order">Original Order ID</Label>
                  <Input id="original-order" placeholder="ORD-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Return/Exchange Type</Label>
                  <RadioGroup defaultValue="return" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="return" id="return" />
                      <Label htmlFor="return">Return</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exchange" id="exchange" />
                      <Label htmlFor="exchange">Exchange</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer Name</Label>
                  <Input id="customer" placeholder="Customer name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+971 50 123 4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Return/Exchange</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defect">Product defect</SelectItem>
                    <SelectItem value="wrong-item">Wrong item received</SelectItem>
                    <SelectItem value="dissatisfaction">Customer dissatisfaction</SelectItem>
                    <SelectItem value="wrong-fragrance">Wrong fragrance</SelectItem>
                    <SelectItem value="damaged">Damaged in shipping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Product Condition</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unopened">Unopened/Original packaging</SelectItem>
                    <SelectItem value="opened">Opened but unused</SelectItem>
                    <SelectItem value="used">Partially used</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="refund-method">Refund Method (for returns)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select refund method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original Payment Method</SelectItem>
                    <SelectItem value="store-credit">Store Credit</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional notes or comments" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewReturnDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-oud-600 hover:bg-oud-700">
                  Process Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReturns}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exchanges</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExchanges}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunds Processed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRefundAmount)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          <TabsTrigger value="policies">Return Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Request Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by customer, request ID, or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="return">Returns</SelectItem>
                    <SelectItem value="exchange">Exchanges</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Returns/Exchanges Table */}
          <Card>
            <CardHeader>
              <CardTitle>Returns & Exchanges</CardTitle>
              <CardDescription>
                Manage all return and exchange requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Original Order</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Processed By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReturns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell className="font-medium">{returnItem.id}</TableCell>
                        <TableCell>{getTypeBadge(returnItem.type)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{returnItem.customer}</p>
                            <p className="text-sm text-muted-foreground">{returnItem.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{returnItem.originalOrder}</TableCell>
                        <TableCell>{returnItem.items.length} items</TableCell>
                        <TableCell className="font-medium">
                          {returnItem.type === 'Return' ? (
                            <span className="text-red-600">{formatCurrency(returnItem.refundAmount)}</span>
                          ) : (
                            <span className="text-blue-600">
                              {returnItem.additionalPayment > 0
                                ? `+${formatCurrency(returnItem.additionalPayment)}`
                                : formatCurrency(0)
                              }
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                        <TableCell>{returnItem.date}</TableCell>
                        <TableCell>{returnItem.processedBy}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedReturn(returnItem)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {returnItem.status === 'Pending Approval' && (
                              <Button variant="outline" size="icon">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
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

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Return Requests</CardTitle>
              <CardDescription>
                View and manage customer return requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnsData.filter(item => item.type === 'Return').map((returnItem) => (
                  <Card key={returnItem.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{returnItem.id}</h3>
                            {getStatusBadge(returnItem.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Customer: {returnItem.customer} • Order: {returnItem.originalOrder}
                          </p>
                          <p className="text-sm">
                            Items: {returnItem.items.map(item => item.name).join(', ')}
                          </p>
                          <p className="text-sm">
                            Reason: {returnItem.items[0]?.reason}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">{formatCurrency(returnItem.refundAmount)}</p>
                          <p className="text-sm text-muted-foreground">{returnItem.refundMethod}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setSelectedReturn(returnItem)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchanges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Requests</CardTitle>
              <CardDescription>
                View and manage customer exchange requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnsData.filter(item => item.type === 'Exchange').map((exchangeItem) => (
                  <Card key={exchangeItem.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{exchangeItem.id}</h3>
                            {getStatusBadge(exchangeItem.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Customer: {exchangeItem.customer} • Order: {exchangeItem.originalOrder}
                          </p>
                          <div className="text-sm">
                            <p><strong>From:</strong> {exchangeItem.items.map(item => item.name).join(', ')}</p>
                            <p><strong>To:</strong> {exchangeItem.exchangeItems?.map(item => item.name).join(', ')}</p>
                          </div>
                          <p className="text-sm">
                            Reason: {exchangeItem.items[0]?.reason}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            {exchangeItem.additionalPayment > 0
                              ? `+${formatCurrency(exchangeItem.additionalPayment)}`
                              : 'Even Exchange'
                            }
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setSelectedReturn(exchangeItem)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Return Policy</CardTitle>
                <CardDescription>
                  Current return policy guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Time Limits</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• 30 days for unopened items</li>
                      <li>• 14 days for opened items</li>
                      <li>• 7 days for used items</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Condition Requirements</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Original packaging required</li>
                      <li>• Receipt or proof of purchase</li>
                      <li>• No damage to product or packaging</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Restocking Fees</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Unopened items: 0%</li>
                      <li>• Opened but unused: 15%</li>
                      <li>• Partially used: 30%</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exchange Policy</CardTitle>
                <CardDescription>
                  Current exchange policy guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Eligibility</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Same or higher value items</li>
                      <li>• Within 30 days of purchase</li>
                      <li>• Item must be in sellable condition</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Exchange Process</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Customer brings item and receipt</li>
                      <li>• Staff verifies condition</li>
                      <li>• Customer selects replacement</li>
                      <li>• Price difference collected if applicable</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Exceptions</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Custom blends cannot be exchanged</li>
                      <li>• Gift sets must be complete</li>
                      <li>• Sale items are final sale</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Return/Exchange Details Dialog */}
      {selectedReturn && (
        <Dialog open={!!selectedReturn} onOpenChange={() => setSelectedReturn(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTypeBadge(selectedReturn.type)} Details - {selectedReturn.id}
              </DialogTitle>
              <DialogDescription>
                Complete information for this {selectedReturn.type.toLowerCase()} request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm">{selectedReturn.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedReturn.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Original Order</Label>
                  <p className="text-sm font-mono">{selectedReturn.originalOrder}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date Processed</Label>
                  <p className="text-sm">{selectedReturn.date}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium">Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedReturn.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} • Condition: {item.condition}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Reason: {item.reason}
                          </p>
                        </div>
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedReturn.type === 'Exchange' && selectedReturn.exchangeItems && (
                <div>
                  <Label className="text-sm font-medium">Exchange Items</Label>
                  <div className="mt-2 space-y-2">
                    {selectedReturn.exchangeItems.map((item, index) => (
                      <div key={index} className="bg-green-50 p-3 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {selectedReturn.type === 'Return' ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Original Amount:</span>
                    <span>{formatCurrency(selectedReturn.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-red-600">
                    <span>Refund Amount:</span>
                    <span>{formatCurrency(selectedReturn.refundAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refund Method:</span>
                    <span>{selectedReturn.refundMethod}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Original Value:</span>
                    <span>{formatCurrency(selectedReturn.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exchange Value:</span>
                    <span>{formatCurrency(selectedReturn.exchangeAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-blue-600">
                    <span>Additional Payment:</span>
                    <span>
                      {selectedReturn.additionalPayment > 0
                        ? `+${formatCurrency(selectedReturn.additionalPayment)}`
                        : formatCurrency(0)
                      }
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Processed By</Label>
                  <p className="text-sm">{selectedReturn.processedBy}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Approved By</Label>
                  <p className="text-sm">{selectedReturn.approvedBy}</p>
                </div>
              </div>

              {selectedReturn.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedReturn.notes}</p>
                </div>
              )}

              {selectedReturn.status === 'Pending Approval' && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">
                    Reject
                  </Button>
                  <Button className="bg-oud-600 hover:bg-oud-700">
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}