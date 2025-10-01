'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Building2, Eye, Edit, Trash2, Package, TrendingUp, Calendar, Users, Truck, FileText } from 'lucide-react';
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

// Mock data for wholesale orders
const wholesaleOrders = [
  {
    id: 'WHL-2024-001',
    company: 'Al Haramain Perfumes LLC',
    contact: 'Ahmad Mohammed',
    email: 'ahmad@alharamain.ae',
    phone: '+971 4 567 8901',
    trn: '100123456789012',
    address: 'Deira, Dubai',
    items: [
      { name: 'Royal Oud Premium', quantity: 50, price: 400.00, unit: 'bottle', discount: 15 },
      { name: 'Rose Garden Collection', quantity: 100, price: 250.00, unit: 'bottle', discount: 20 },
      { name: 'Amber Essence Deluxe', quantity: 75, price: 280.00, unit: 'bottle', discount: 18 }
    ],
    subtotal: 66000.00,
    discount: 11800.00,
    discountedSubtotal: 54200.00,
    vat: 2710.00,
    total: 56910.00,
    status: 'Confirmed',
    paymentMethod: 'Bank Transfer',
    paymentTerms: 'Net 30',
    date: '2024-10-01',
    deliveryDate: '2024-10-15',
    priority: 'High',
    notes: 'Bulk order for new store opening',
  },
  {
    id: 'WHL-2024-002',
    company: 'Emirates Fragrance Trading',
    contact: 'Sarah Al-Mansouri',
    email: 'sarah@emiratesfragrance.ae',
    phone: '+971 2 345 6789',
    trn: '100234567890123',
    address: 'Abu Dhabi Mall, Abu Dhabi',
    items: [
      { name: 'Sandalwood Serenity', quantity: 30, price: 350.00, unit: 'bottle', discount: 12 },
      { name: 'Musk Al-Haramain', quantity: 80, price: 200.00, unit: 'bottle', discount: 25 }
    ],
    subtotal: 26500.00,
    discount: 5260.00,
    discountedSubtotal: 21240.00,
    vat: 1062.00,
    total: 22302.00,
    status: 'Processing',
    paymentMethod: 'Letter of Credit',
    paymentTerms: 'Net 45',
    date: '2024-09-28',
    deliveryDate: '2024-10-10',
    priority: 'Medium',
    notes: 'Regular monthly order',
  },
  {
    id: 'WHL-2024-003',
    company: 'Gulf Perfume Distributors',
    contact: 'Mohammed Al-Rashid',
    email: 'mohammed@gulfperfume.ae',
    phone: '+971 6 789 0123',
    trn: '100345678901234',
    address: 'Sharjah Industrial Area',
    items: [
      { name: 'Jasmine Night', quantity: 200, price: 180.00, unit: 'bottle', discount: 30 }
    ],
    subtotal: 36000.00,
    discount: 10800.00,
    discountedSubtotal: 25200.00,
    vat: 1260.00,
    total: 26460.00,
    status: 'Shipped',
    paymentMethod: 'Cash Advance',
    paymentTerms: 'Immediate',
    date: '2024-09-25',
    deliveryDate: '2024-10-05',
    priority: 'Low',
    notes: 'Seasonal bulk order',
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
    'Confirmed': 'secondary',
    'Processing': 'default',
    'Shipped': 'outline',
    'Delivered': 'secondary',
    'Cancelled': 'destructive',
  };
  return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
};

const getPriorityBadge = (priority: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'High': 'destructive',
    'Medium': 'default',
    'Low': 'secondary',
  };
  return <Badge variant={variants[priority] || 'outline'}>{priority}</Badge>;
};

export default function WholesaleOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof wholesaleOrders[0] | null>(null);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);

  const filteredOrders = wholesaleOrders.filter(order => {
    const matchesSearch = order.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalOrderValue = wholesaleOrders.reduce((sum, order) => sum + order.total, 0);
  const totalDiscount = wholesaleOrders.reduce((sum, order) => sum + order.discount, 0);
  const pendingOrders = wholesaleOrders.filter(order => order.status === 'Processing').length;
  const activeClients = new Set(wholesaleOrders.map(order => order.company)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8 text-oud-600" />
            Wholesale Orders Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage bulk orders and business-to-business sales
          </p>
        </div>
        <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
              <Plus className="h-4 w-4" />
              New Wholesale Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Wholesale Order</DialogTitle>
              <DialogDescription>
                Create a bulk order for business clients
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Enter company name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Person</Label>
                  <Input id="contact" placeholder="Contact person name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="company@domain.ae" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+971 4 567 8901" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trn">TRN (Tax Registration Number)</Label>
                  <Input id="trn" placeholder="100123456789012" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-date">Expected Delivery Date</Label>
                  <Input id="delivery-date" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Company Address</Label>
                <Textarea id="address" placeholder="Enter full company address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="letter-of-credit">Letter of Credit</SelectItem>
                      <SelectItem value="cash-advance">Cash Advance</SelectItem>
                      <SelectItem value="check">Company Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="net-15">Net 15</SelectItem>
                      <SelectItem value="net-30">Net 30</SelectItem>
                      <SelectItem value="net-45">Net 45</SelectItem>
                      <SelectItem value="net-60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea id="notes" placeholder="Special instructions or notes" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewOrderDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-oud-600 hover:bg-oud-700">
                  Create Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discounts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDiscount)}</div>
            <p className="text-xs text-muted-foreground">
              Wholesale discounts given
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">
              Business clients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="clients">Client Management</TabsTrigger>
          <TabsTrigger value="analytics">Wholesale Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Order Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by company, contact, or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Wholesale Orders</CardTitle>
              <CardDescription>
                Manage and track all wholesale orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.company}</p>
                            <p className="text-sm text-muted-foreground">{order.trn}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.contact}</p>
                            <p className="text-sm text-muted-foreground">{order.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="text-red-600">
                          -{formatCurrency(order.discount)}
                        </TableCell>
                        <TableCell className="font-medium text-oud-600">
                          {formatCurrency(order.total)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            <span className="text-sm">{order.deliveryDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4" />
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

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wholesale Clients</CardTitle>
              <CardDescription>
                Manage business clients and their information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(new Set(wholesaleOrders.map(order => order.company))).map((company) => {
                  const clientOrders = wholesaleOrders.filter(order => order.company === company);
                  const totalValue = clientOrders.reduce((sum, order) => sum + order.total, 0);
                  const lastOrder = clientOrders[0];

                  return (
                    <Card key={company}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{company}</h3>
                          <p className="text-sm text-muted-foreground">{lastOrder.contact}</p>
                          <p className="text-sm text-muted-foreground">{lastOrder.email}</p>
                          <Separator />
                          <div className="flex justify-between text-sm">
                            <span>Total Orders:</span>
                            <span className="font-medium">{clientOrders.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total Value:</span>
                            <span className="font-medium text-oud-600">{formatCurrency(totalValue)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Payment Terms:</span>
                            <span className="font-medium">{lastOrder.paymentTerms}</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Value Distribution</CardTitle>
                <CardDescription>
                  Breakdown of orders by value ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { range: 'Under AED 25,000', count: 1, color: 'bg-green-500' },
                    { range: 'AED 25,000 - 50,000', count: 1, color: 'bg-blue-500' },
                    { range: 'Over AED 50,000', count: 1, color: 'bg-purple-500' }
                  ].map((item) => {
                    const percentage = (item.count / wholesaleOrders.length) * 100;
                    return (
                      <div key={item.range} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{item.range}</span>
                          <span>{item.count} orders ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Terms Analysis</CardTitle>
                <CardDescription>
                  Distribution of payment terms across clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Immediate', 'Net 30', 'Net 45'].map((term) => {
                    const count = wholesaleOrders.filter(order => order.paymentTerms === term).length;
                    const percentage = count > 0 ? (count / wholesaleOrders.length) * 100 : 0;
                    return (
                      <div key={term} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-oud-600" />
                          <span>{term}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{count} orders</p>
                          <p className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Wholesale Order Details - {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Complete information for this wholesale order
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="text-sm">{selectedOrder.company}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contact Person</Label>
                  <p className="text-sm">{selectedOrder.contact}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedOrder.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedOrder.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">TRN</Label>
                  <p className="text-sm">{selectedOrder.trn}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Terms</Label>
                  <p className="text-sm">{selectedOrder.paymentTerms}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium">Order Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} {item.unit} • Unit Price: {formatCurrency(item.price)} • Discount: {item.discount}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price * item.quantity * (1 - item.discount / 100))}</p>
                        <p className="text-sm text-red-600">-{formatCurrency(item.price * item.quantity * item.discount / 100)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Total Discount:</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discounted Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.discountedSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (5%):</span>
                  <span>{formatCurrency(selectedOrder.vat)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-oud-600">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
              {selectedOrder.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}