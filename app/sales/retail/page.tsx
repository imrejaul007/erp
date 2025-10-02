'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, ShoppingCart, Eye, Edit, Trash2, Package, Users, TrendingUp, Calendar, MapPin, Phone, CreditCard } from 'lucide-react';
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

// Mock data for retail orders
const retailOrders = [
  {
    id: 'RTL-2024-001',
    customer: 'Aisha Al-Zahra',
    phone: '+971 50 123 4567',
    address: 'Dubai Marina, Dubai',
    items: [
      { name: 'Royal Oud Premium', quantity: 1, price: 450.00, unit: 'bottle' },
      { name: 'Rose Garden Collection', quantity: 2, price: 280.00, unit: 'bottle' }
    ],
    subtotal: 1010.00,
    vat: 50.50,
    total: 1060.50,
    status: 'Processing',
    paymentMethod: 'Credit Card',
    date: '2024-10-01',
    priority: 'High',
    notes: 'Gift wrapping requested',
  },
  {
    id: 'RTL-2024-002',
    customer: 'Omar Al-Rashid',
    phone: '+971 55 987 6543',
    address: 'Jumeirah, Dubai',
    items: [
      { name: 'Amber Essence Deluxe', quantity: 1, price: 320.00, unit: 'bottle' },
      { name: 'Musk Al-Haramain', quantity: 1, price: 220.00, unit: 'bottle' }
    ],
    subtotal: 540.00,
    vat: 27.00,
    total: 567.00,
    status: 'Shipped',
    paymentMethod: 'Cash on Delivery',
    date: '2024-09-30',
    priority: 'Medium',
    notes: '',
  },
  {
    id: 'RTL-2024-003',
    customer: 'Fatima Hassan',
    phone: '+971 52 456 7890',
    address: 'Abu Dhabi Mall, Abu Dhabi',
    items: [
      { name: 'Sandalwood Serenity', quantity: 3, price: 380.00, unit: 'bottle' }
    ],
    subtotal: 1140.00,
    vat: 57.00,
    total: 1197.00,
    status: 'Delivered',
    paymentMethod: 'Bank Transfer',
    date: '2024-09-29',
    priority: 'Low',
    notes: 'Customer requested specific delivery time',
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

export default function RetailOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof retailOrders[0] | null>(null);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);

  const filteredOrders = retailOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const todayOrders = retailOrders.filter(order => order.date === '2024-10-01').length;
  const totalRevenue = retailOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = retailOrders.filter(order => order.status === 'Processing').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-oud-600" />
            Retail Orders Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage individual customer orders and retail sales
          </p>
        </div>
        <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
              <Plus className="h-4 w-4" />
              New Retail Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Retail Order</DialogTitle>
              <DialogDescription>
                Create a new order for a retail customer
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer Name</Label>
                  <Input id="customer" placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+971 50 123 4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea id="address" placeholder="Enter full delivery address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea id="notes" placeholder="Special instructions or notes" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit Card</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              Retail customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="analytics">Retail Analytics</TabsTrigger>
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
                      placeholder="Search by customer name or order ID..."
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
              <CardTitle>Retail Orders</CardTitle>
              <CardDescription>
                Manage and track all retail customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {order.address.split(',')[0]}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm">{order.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="font-medium text-oud-600">
                          {formatCurrency(order.total)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell>{order.date}</TableCell>
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>
                  Breakdown of orders by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => {
                    const count = retailOrders.filter(order => order.status === status).length;
                    const percentage = (count / retailOrders.length) * 100;
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{status}</span>
                          <span>{count} orders ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-oud-600 h-2 rounded-full"
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
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Popular payment methods for retail orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Credit Card', 'Cash on Delivery', 'Bank Transfer', 'Cash'].map((method) => {
                    const count = retailOrders.filter(order => order.paymentMethod === method).length;
                    const percentage = count > 0 ? (count / retailOrders.length) * 100 : 0;
                    return (
                      <div key={method} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-oud-600" />
                          <span>{method}</span>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Complete information for this retail order
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm">{selectedOrder.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedOrder.phone}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Delivery Address</Label>
                <p className="text-sm">{selectedOrder.address}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium">Order Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity} {item.unit}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
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
                <div className="flex justify-between">
                  <span>VAT (5%):</span>
                  <span>{formatCurrency(selectedOrder.vat)}</span>
                </div>
                <div className="flex justify-between font-bold">
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