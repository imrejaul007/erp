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
import { Switch } from "@/components/ui/switch";
import {
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Store,
  Car,
  QrCode,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Bell,
  FileText,
  Printer,
  Send,
  UserCheck,
  ShoppingBag,
  Smartphone,
  MessageSquare,
  Navigation,
  Timer,
  BarChart3,
  Star
} from 'lucide-react';

const ClickCollectPage = () => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);

  // Sample click & collect data
  const locations = [
    {
      id: 'dubai-mall',
      name: 'Dubai Mall Store',
      nameAr: 'متجر دبي مول',
      address: 'Level 2, Dubai Mall, Downtown Dubai',
      phone: '+971-4-123-4567',
      hours: '10:00 AM - 12:00 AM',
      manager: 'Ali Hassan',
      capacity: 50,
      currentOrders: 23,
      todayPickups: 15,
      status: 'active'
    },
    {
      id: 'moe',
      name: 'Mall of Emirates Store',
      nameAr: 'متجر مول الإمارات',
      address: 'Level 1, Mall of Emirates, Al Barsha',
      phone: '+971-4-987-6543',
      hours: '10:00 AM - 12:00 AM',
      manager: 'Fatima Al-Zahra',
      capacity: 35,
      currentOrders: 18,
      todayPickups: 12,
      status: 'active'
    },
    {
      id: 'ibn-battuta',
      name: 'Ibn Battuta Mall Store',
      nameAr: 'متجر ابن بطوطة مول',
      address: 'China Court, Ibn Battuta Mall, Jebel Ali',
      phone: '+971-4-456-7890',
      hours: '10:00 AM - 11:00 PM',
      manager: 'Omar Al-Rashid',
      capacity: 25,
      currentOrders: 8,
      todayPickups: 6,
      status: 'active'
    }
  ];

  const clickCollectOrders = [
    {
      id: 'CC-2024-001',
      orderNumber: '#CC-1001',
      customer: {
        name: 'Ahmed Al-Mansouri',
        nameAr: 'أحمد المنصوري',
        email: 'ahmed.mansouri@email.com',
        phone: '+971-50-123-4567',
        emiratesId: '784-1990-1234567-8'
      },
      location: 'dubai-mall',
      items: [
        {
          id: 'PRD-001',
          name: 'Royal Oud Premium Collection',
          nameAr: 'مجموعة العود الملكي الفاخرة',
          sku: 'ROP-001',
          quantity: 1,
          price: 1250
        }
      ],
      total: 1250,
      status: 'ready',
      paymentStatus: 'paid',
      orderDate: '2024-01-15 14:30:00',
      readyDate: '2024-01-16 11:00:00',
      expiryDate: '2024-01-19 23:59:59',
      pickupCode: 'CC1001',
      notes: 'Customer prefers morning pickup',
      remindersSent: 1
    },
    {
      id: 'CC-2024-002',
      orderNumber: '#CC-1002',
      customer: {
        name: 'Fatima Hassan',
        nameAr: 'فاطمة حسن',
        email: 'fatima.hassan@email.com',
        phone: '+971-55-987-6543',
        emiratesId: '784-1985-9876543-2'
      },
      location: 'moe',
      items: [
        {
          id: 'PRD-002',
          name: 'Arabian Nights Perfume',
          nameAr: 'عطر ليالي العرب',
          sku: 'ANP-002',
          quantity: 2,
          price: 385
        },
        {
          id: 'PRD-003',
          name: 'Luxury Bakhoor Set',
          nameAr: 'طقم البخور الفاخر',
          sku: 'LBS-003',
          quantity: 1,
          price: 750
        }
      ],
      total: 1520,
      status: 'preparing',
      paymentStatus: 'paid',
      orderDate: '2024-01-15 16:45:00',
      readyDate: null,
      expiryDate: '2024-01-22 23:59:59',
      pickupCode: 'CC1002',
      notes: 'Gift wrapping requested',
      remindersSent: 0
    },
    {
      id: 'CC-2024-003',
      orderNumber: '#CC-1003',
      customer: {
        name: 'Omar Al-Rashid',
        nameAr: 'عمر الراشد',
        email: 'omar.rashid@email.com',
        phone: '+971-56-456-7890',
        emiratesId: '784-1992-4567890-1'
      },
      location: 'ibn-battuta',
      items: [
        {
          id: 'PRD-004',
          name: 'Rose Oud Essence',
          nameAr: 'خلاصة عود الورد',
          sku: 'ROE-004',
          quantity: 1,
          price: 920
        }
      ],
      total: 920,
      status: 'collected',
      paymentStatus: 'paid',
      orderDate: '2024-01-14 12:20:00',
      readyDate: '2024-01-15 10:00:00',
      collectedDate: '2024-01-15 15:30:00',
      expiryDate: '2024-01-18 23:59:59',
      pickupCode: 'CC1003',
      notes: 'Collected by customer',
      remindersSent: 0,
      collectedBy: 'Customer',
      staffMember: 'Ali Hassan'
    },
    {
      id: 'CC-2024-004',
      orderNumber: '#CC-1004',
      customer: {
        name: 'Sarah Johnson',
        nameAr: 'سارة جونسون',
        email: 'sarah.johnson@email.com',
        phone: '+971-52-234-5678',
        emiratesId: '784-1988-2345678-9'
      },
      location: 'dubai-mall',
      items: [
        {
          id: 'PRD-001',
          name: 'Royal Oud Premium Collection',
          nameAr: 'مجموعة العود الملكي الفاخرة',
          sku: 'ROP-001',
          quantity: 1,
          price: 1250
        }
      ],
      total: 1250,
      status: 'expired',
      paymentStatus: 'paid',
      orderDate: '2024-01-10 09:15:00',
      readyDate: '2024-01-11 14:00:00',
      expiryDate: '2024-01-14 23:59:59',
      pickupCode: 'CC1004',
      notes: 'Order expired - customer contacted',
      remindersSent: 3
    }
  ];

  const stats = {
    totalOrders: 156,
    readyForPickup: 23,
    todayPickups: 15,
    expiringSoon: 4,
    averagePickupTime: '2.3 days',
    customerSatisfaction: 4.8
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'collected': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return <Clock className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'collected': return <UserCheck className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const handleSendReminder = (orderId: string) => {
    console.log(`Sending reminder for order: ${orderId}`);
  };

  const filteredOrders = clickCollectOrders.filter(order => {
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    const locationMatch = selectedLocation === 'all' || order.location === selectedLocation;
    return statusMatch && locationMatch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Click & Collect Management</h1>
          <p className="text-gray-600">Manage in-store pickup orders and customer collections</p>
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
            New Order
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
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-xs text-green-600">+8% vs last week</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready for Pickup</p>
                <p className="text-2xl font-bold">{stats.readyForPickup}</p>
                <p className="text-xs text-blue-600">Awaiting collection</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Pickups</p>
                <p className="text-2xl font-bold">{stats.todayPickups}</p>
                <p className="text-xs text-purple-600">Completed today</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiringSoon}</p>
                <p className="text-xs text-orange-600">Within 24 hours</p>
              </div>
              <Timer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="ready">Ready for Pickup</TabsTrigger>
          <TabsTrigger value="locations">Store Locations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* All Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Click & Collect Orders</CardTitle>
                  <CardDescription>
                    Manage all click & collect orders across locations
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
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="collected">Collected</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
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
                    <TableHead>Location</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pickup Code</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const location = locations.find(loc => loc.id === order.location);
                    const daysUntilExpiry = getDaysUntilExpiry(order.expiryDate);
                    return (
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
                            <div className="text-xs text-gray-400">{order.customer.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            <div>
                              <div className="text-sm font-medium">{location?.name}</div>
                              <div className="text-xs text-gray-500">{location?.nameAr}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          AED {order.total}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4" />
                            <span className="font-mono text-sm">{order.pickupCode}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`text-sm ${
                            daysUntilExpiry <= 1 ? 'text-red-600' :
                            daysUntilExpiry <= 2 ? 'text-orange-600' : 'text-gray-600'
                          }`}>
                            {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                          </div>
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
                            {order.status === 'ready' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, 'collected')}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(order.id)}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ready for Pickup Tab */}
        <TabsContent value="ready" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ready for Pickup</CardTitle>
              <CardDescription>
                Orders ready for customer collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clickCollectOrders.filter(order => order.status === 'ready').map((order) => {
                  const location = locations.find(loc => loc.id === order.location);
                  const daysUntilExpiry = getDaysUntilExpiry(order.expiryDate);
                  return (
                    <Card key={order.id} className={`${
                      daysUntilExpiry <= 1 ? 'border-red-200 bg-red-50' :
                      daysUntilExpiry <= 2 ? 'border-orange-200 bg-orange-50' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium">{order.orderNumber}</div>
                              <div className="text-sm text-gray-600">{order.customer.name}</div>
                              <div className="text-xs text-gray-400">{order.customer.nameAr}</div>
                              <div className="text-xs text-blue-600 font-mono">
                                Pickup Code: {order.pickupCode}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">AED {order.total}</div>
                            <div className="text-sm text-gray-500">{location?.name}</div>
                            <div className={`text-xs ${
                              daysUntilExpiry <= 1 ? 'text-red-600' :
                              daysUntilExpiry <= 2 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="text-sm font-medium mb-2">Order Items:</div>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} x{item.quantity}</span>
                                <span>AED {item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'collected')}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Mark as Collected
                          </Button>
                          <Button variant="outline" size="sm">
                            <QrCode className="h-4 w-4 mr-2" />
                            View QR Code
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Customer
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send SMS
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

        {/* Store Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Store Locations</CardTitle>
                  <CardDescription>
                    Manage click & collect enabled store locations
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <Card key={location.id}>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Store className="h-5 w-5" />
                            <div>
                              <h4 className="font-medium">{location.name}</h4>
                              <p className="text-xs text-gray-500">{location.nameAr}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {location.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{location.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{location.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{location.hours}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Manager: {location.manager}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{location.currentOrders}</div>
                            <div className="text-xs text-gray-500">Current Orders</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{location.todayPickups}</div>
                            <div className="text-xs text-gray-500">Today's Pickups</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Capacity Utilization</span>
                            <span>{Math.round((location.currentOrders / location.capacity) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min((location.currentOrders / location.capacity) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Navigation className="h-4 w-4 mr-1" />
                            Map
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.averagePickupTime}</div>
                    <div className="text-sm text-gray-500">Avg Pickup Time</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">96.5%</div>
                    <div className="text-sm text-gray-500">Collection Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.customerSatisfaction}/5</div>
                    <div className="text-sm text-gray-500">Customer Rating</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3.5%</div>
                    <div className="text-sm text-gray-500">Expiry Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((location) => {
                    const utilizationRate = (location.currentOrders / location.capacity) * 100;
                    return (
                      <div key={location.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{location.name}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{location.todayPickups} pickups</div>
                            <div className="text-xs text-gray-500">{utilizationRate.toFixed(1)}% capacity</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Click & Collect Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-sm text-gray-500">Total Orders</div>
                  <div className="text-xs text-green-600">+12% vs last week</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">AED 84.2K</div>
                  <div className="text-sm text-gray-500">Total Value</div>
                  <div className="text-xs text-green-600">+18% vs last week</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">AED 540</div>
                  <div className="text-sm text-gray-500">Avg Order Value</div>
                  <div className="text-xs text-blue-600">+5% vs last week</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">2.1 hrs</div>
                  <div className="text-sm text-gray-500">Avg Prep Time</div>
                  <div className="text-xs text-green-600">-15% vs last week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Click & Collect Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Enable Click & Collect</div>
                    <div className="text-sm text-gray-500">Allow customers to order online and pickup in-store</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto SMS Notifications</div>
                    <div className="text-sm text-gray-500">Send automatic SMS when order is ready</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-500">Send email updates to customers</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">QR Code Pickup</div>
                    <div className="text-sm text-gray-500">Enable QR code scanning for pickup</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pickup Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Pickup Window (days)</Label>
                  <Select defaultValue="7">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reminder Schedule</Label>
                  <Select defaultValue="24,72">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 hours before expiry</SelectItem>
                      <SelectItem value="24,72">24 & 72 hours before</SelectItem>
                      <SelectItem value="24,48,72">24, 48 & 72 hours before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Maximum Order Hold Time</Label>
                  <Select defaultValue="14">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="21">21 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Preparation Time (hours)</Label>
                  <Input type="number" defaultValue="2" min="1" max="24" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Order Ready SMS Template</Label>
                <Textarea
                  defaultValue="Your order #{orderNumber} is ready for pickup at {storeName}. Pickup code: {pickupCode}. Valid until {expiryDate}."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Reminder SMS Template</Label>
                <Textarea
                  defaultValue="Reminder: Your order #{orderNumber} expires in {daysLeft} days. Please collect from {storeName} using code {pickupCode}."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Order Ready Email Subject</Label>
                <Input defaultValue="Your Order is Ready for Pickup - {orderNumber}" />
              </div>
              <Button>
                Save Templates
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Detail Modal */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Click & Collect Order Details</DialogTitle>
            <DialogDescription>
              Complete order information and pickup management
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{selectedOrder.orderNumber}</h3>
                  <p className="text-sm text-gray-500">Order ID: {selectedOrder.id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <QrCode className="h-4 w-4" />
                    <span className="font-mono text-sm">Pickup Code: {selectedOrder.pickupCode}</span>
                  </div>
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
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="collected">Collected</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Customer & Pickup Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                    <div>
                      <Label className="text-sm text-gray-600">Emirates ID</Label>
                      <p className="text-sm font-mono">{selectedOrder.customer.emiratesId}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Pickup Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Pickup Location</Label>
                      <p className="font-medium">
                        {locations.find(loc => loc.id === selectedOrder.location)?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {locations.find(loc => loc.id === selectedOrder.location)?.address}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Order Date</Label>
                      <p className="text-sm">{new Date(selectedOrder.orderDate)?.toLocaleString() || "0"}</p>
                    </div>
                    {selectedOrder.readyDate && (
                      <div>
                        <Label className="text-sm text-gray-600">Ready Date</Label>
                        <p className="text-sm">{new Date(selectedOrder.readyDate)?.toLocaleString() || "0"}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm text-gray-600">Expires</Label>
                      <p className={`text-sm ${
                        getDaysUntilExpiry(selectedOrder.expiryDate) <= 1 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {new Date(selectedOrder.expiryDate)?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 pt-4 border-t text-right">
                    <div className="text-lg font-bold">Total: AED {selectedOrder.total}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes & Collection Info */}
              {(selectedOrder.notes || selectedOrder.collectedDate) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedOrder.notes && (
                      <div>
                        <Label className="text-sm text-gray-600">Notes</Label>
                        <p className="text-sm">{selectedOrder.notes}</p>
                      </div>
                    )}
                    {selectedOrder.collectedDate && (
                      <div>
                        <Label className="text-sm text-gray-600">Collection Details</Label>
                        <p className="text-sm">
                          Collected on: {new Date(selectedOrder.collectedDate)?.toLocaleString() || "0"}
                        </p>
                        <p className="text-sm">Collected by: {selectedOrder.collectedBy}</p>
                        <p className="text-sm">Staff member: {selectedOrder.staffMember}</p>
                      </div>
                    )}
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
              <QrCode className="h-4 w-4 mr-2" />
              Show QR Code
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            {selectedOrder?.status === 'ready' && (
              <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'collected')}>
                <UserCheck className="h-4 w-4 mr-2" />
                Mark as Collected
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClickCollectPage;