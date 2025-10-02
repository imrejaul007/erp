'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ShoppingCart,
  Package,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Globe,
  Instagram,
  Facebook,
  MessageSquare,
  Smartphone,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  RefreshCw,
  FileText,
  Printer,
  Send,
  ArrowUpDown,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

  // Sample order data
  const orders = [
    {
      id: 'ORD-2024-001',
      orderNumber: '#WEB-1001',
      customer: {
        name: 'Ahmed Al-Mansouri',
        nameAr: 'أحمد المنصوري',
        email: 'ahmed.mansouri@email.com',
        phone: '+971-50-123-4567',
        location: 'Dubai Marina, Dubai'
      },
      channel: {
        id: 'website',
        name: 'Official Website',
        icon: Globe
      },
      items: [
        {
          id: 'PRD-001',
          name: 'Royal Oud Premium Collection',
          nameAr: 'مجموعة العود الملكي الفاخرة',
          sku: 'ROP-001',
          quantity: 2,
          price: 1250,
          total: 2500
        },
        {
          id: 'PRD-004',
          name: 'Rose Oud Essence',
          nameAr: 'خلاصة عود الورد',
          sku: 'ROE-004',
          quantity: 1,
          price: 920,
          total: 920
        }
      ],
      subtotal: 3420,
      shipping: 50,
      tax: 171,
      discount: 0,
      total: 3641,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      shippingMethod: 'express',
      orderDate: '2024-01-15 13:45:00',
      estimatedDelivery: '2024-01-17 18:00:00',
      notes: 'Please handle with care - fragile items',
      trackingNumber: 'TR123456789AE'
    },
    {
      id: 'ORD-2024-002',
      orderNumber: '#IG-2002',
      customer: {
        name: 'Fatima Hassan',
        nameAr: 'فاطمة حسن',
        email: 'fatima.hassan@email.com',
        phone: '+971-55-987-6543',
        location: 'Al Karama, Dubai'
      },
      channel: {
        id: 'instagram',
        name: 'Instagram Shop',
        icon: Instagram
      },
      items: [
        {
          id: 'PRD-002',
          name: 'Arabian Nights Perfume',
          nameAr: 'عطر ليالي العرب',
          sku: 'ANP-002',
          quantity: 1,
          price: 385,
          total: 385
        }
      ],
      subtotal: 385,
      shipping: 25,
      tax: 19.25,
      discount: 38.5,
      total: 390.75,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'cod',
      shippingMethod: 'standard',
      orderDate: '2024-01-15 11:20:00',
      estimatedDelivery: '2024-01-18 16:00:00',
      notes: 'Gift wrapping requested',
      trackingNumber: 'TR987654321AE'
    },
    {
      id: 'ORD-2024-003',
      orderNumber: '#WA-3003',
      customer: {
        name: 'Omar Al-Rashid',
        nameAr: 'عمر الراشد',
        email: 'omar.rashid@email.com',
        phone: '+971-56-456-7890',
        location: 'Al Qusais, Dubai'
      },
      channel: {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        icon: MessageSquare
      },
      items: [
        {
          id: 'PRD-003',
          name: 'Luxury Bakhoor Set',
          nameAr: 'طقم البخور الفاخر',
          sku: 'LBS-003',
          quantity: 1,
          price: 750,
          total: 750
        }
      ],
      subtotal: 750,
      shipping: 0,
      tax: 37.5,
      discount: 75,
      total: 712.5,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'bank_transfer',
      shippingMethod: 'pickup',
      orderDate: '2024-01-14 16:30:00',
      estimatedDelivery: '2024-01-15 14:00:00',
      notes: 'Customer pickup from store',
      trackingNumber: null,
      customerRating: 5,
      customerReview: 'Excellent quality and fast service!'
    },
    {
      id: 'ORD-2024-004',
      orderNumber: '#AM-4004',
      customer: {
        name: 'Sarah Johnson',
        nameAr: 'سارة جونسون',
        email: 'sarah.johnson@email.com',
        phone: '+971-52-234-5678',
        location: 'Al Ain, Abu Dhabi'
      },
      channel: {
        id: 'amazon',
        name: 'Amazon UAE',
        icon: Package
      },
      items: [
        {
          id: 'PRD-001',
          name: 'Royal Oud Premium Collection',
          nameAr: 'مجموعة العود الملكي الفاخرة',
          sku: 'ROP-001',
          quantity: 1,
          price: 1250,
          total: 1250
        }
      ],
      subtotal: 1250,
      shipping: 30,
      tax: 62.5,
      discount: 125,
      total: 1217.5,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'credit_card',
      shippingMethod: 'standard',
      orderDate: '2024-01-15 09:15:00',
      estimatedDelivery: '2024-01-20 16:00:00',
      notes: 'Awaiting payment confirmation',
      trackingNumber: null
    }
  ];

  const orderStats = {
    totalOrders: 847,
    pendingOrders: 23,
    processingOrders: 156,
    shippedOrders: 89,
    deliveredOrders: 579,
    totalRevenue: 524750,
    averageOrderValue: 620,
    topChannel: 'Website'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <RefreshCw className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'refunded': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // Handle status update logic
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const filteredOrders = orders.filter(order => {
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    const channelMatch = channelFilter === 'all' || order.channel.id === channelFilter;
    return statusMatch && channelMatch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Online Order Management</h1>
          <p className="text-gray-600">Manage orders from all e-commerce channels</p>
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Manual Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orderStats.totalOrders}</p>
                <p className="text-xs text-green-600">+12% vs last month</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">AED {(orderStats.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600">+18.5% vs last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold">AED {orderStats.averageOrderValue}</p>
                <p className="text-xs text-blue-600">+5.2% vs last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold">{orderStats.pendingOrders}</p>
                <p className="text-xs text-orange-600">Needs attention</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* All Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>
                    View and manage orders from all channels
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input className="pl-10 w-64" placeholder="Search orders, customers..." />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={channelFilter} onValueChange={setChannelFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="noon">Noon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{order.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.customer.nameAr}</div>
                          <div className="text-xs text-gray-400">{order.customer.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <order.channel.icon className="h-4 w-4" />
                          <span className="text-sm">{order.channel.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        AED {order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOrderDetail(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Orders Tab */}
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>
                Orders awaiting processing or payment confirmation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(order => order.status === 'pending').map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <order.channel.icon className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <div className="font-medium">{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">{order.customer.name}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(order.orderDate)?.toLocaleString() || "0"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">AED {order.total.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">{order.items.length} items</div>
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'processing')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Customer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Processing Orders Tab */}
        <TabsContent value="processing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Processing Orders</CardTitle>
              <CardDescription>
                Orders being prepared for shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(order => order.status === 'processing').map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <RefreshCw className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">{order.customer.name}</div>
                            <div className="text-xs text-gray-400">
                              Processing since: {new Date(order.orderDate)?.toLocaleString() || "0"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">AED {order.total.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">
                            {order.shippingMethod} shipping
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Order Items:</div>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>AED {item.total}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'shipped')}>
                          <Truck className="h-4 w-4 mr-2" />
                          Mark as Shipped
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          Print Label
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Tab */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Delivery</CardTitle>
              <CardDescription>
                Track orders in transit and manage deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(order => order.status === 'shipped' || order.status === 'delivered').map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            order.status === 'shipped' ? 'bg-purple-100' : 'bg-green-100'
                          }`}>
                            {order.status === 'shipped' ? (
                              <Truck className="h-6 w-6 text-purple-600" />
                            ) : (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">{order.customer.name}</div>
                            <div className="text-xs text-gray-400">{order.customer.location}</div>
                            {order.trackingNumber && (
                              <div className="text-xs font-mono text-blue-600">
                                Tracking: {order.trackingNumber}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <div className="text-sm text-gray-500 mt-1">
                            ETA: {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </div>
                          {order.status === 'delivered' && order.customerRating && (
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < order.customerRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500 ml-1">
                                {order.customerRating}/5
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {order.status === 'delivered' && order.customerReview && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-sm text-green-800">
                            <strong>Customer Review:</strong> {order.customerReview}
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex gap-2">
                        {order.trackingNumber && (
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Track Package
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Customer
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Send Update
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Delivered</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{orderStats.deliveredOrders}</div>
                      <div className="text-xs text-gray-500">68.4%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Processing</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{orderStats.processingOrders}</div>
                      <div className="text-xs text-gray-500">18.4%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Shipped</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{orderStats.shippedOrders}</div>
                      <div className="text-xs text-gray-500">10.5%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{orderStats.pendingOrders}</div>
                      <div className="text-xs text-gray-500">2.7%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Website</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">342 orders</div>
                      <div className="text-xs text-gray-500">40.4%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Amazon UAE</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">189 orders</div>
                      <div className="text-xs text-gray-500">22.3%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      <span className="text-sm">Instagram</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">156 orders</div>
                      <div className="text-xs text-gray-500">18.4%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="text-sm">Noon</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">98 orders</div>
                      <div className="text-xs text-gray-500">11.6%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm">WhatsApp</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">62 orders</div>
                      <div className="text-xs text-gray-500">7.3%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-sm text-gray-500">Order Fulfillment Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2.4 days</div>
                  <div className="text-sm text-gray-500">Avg Processing Time</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4.7/5</div>
                  <div className="text-sm text-gray-500">Customer Satisfaction</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">1.2%</div>
                  <div className="text-sm text-gray-500">Return Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Detail Modal */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete order information and management options
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{selectedOrder.orderNumber}</h3>
                  <p className="text-sm text-gray-500">Order ID: {selectedOrder.id}</p>
                  <p className="text-xs text-gray-400">
                    Placed on: {new Date(selectedOrder.orderDate)?.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(selectedOrder.status)} variant="outline">
                    {selectedOrder.status}
                  </Badge>
                  <div className="mt-2">
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Name</Label>
                      <p className="font-medium">{selectedOrder.customer.name}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.customer.nameAr}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Contact</Label>
                      <p className="text-sm">{selectedOrder.customer.email}</p>
                      <p className="text-sm">{selectedOrder.customer.phone}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Delivery Address</Label>
                    <p className="text-sm">{selectedOrder.customer.location}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.nameAr}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>AED {item.price}</TableCell>
                          <TableCell className="font-medium">AED {item.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Order Summary */}
                  <div className="mt-4 border-t pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>AED {selectedOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>AED {selectedOrder.shipping}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>AED {selectedOrder.tax}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-AED {selectedOrder.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>AED {selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Payment Method</Label>
                      <p className="font-medium capitalize">{selectedOrder.paymentMethod.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Payment Status</Label>
                      <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Shipping Method</Label>
                      <p className="font-medium capitalize">{selectedOrder.shippingMethod}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Estimated Delivery</Label>
                      <p className="text-sm">{new Date(selectedOrder.estimatedDelivery)?.toLocaleString() || "0"}</p>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div>
                        <Label className="text-sm text-gray-600">Tracking Number</Label>
                        <p className="font-mono text-sm">{selectedOrder.trackingNumber}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Notes & Actions */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderDetailOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email Customer
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;