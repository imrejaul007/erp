'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  ShoppingCart,
  Truck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plane,
  Ship,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
  BarChart3,
  ArrowLeft} from 'lucide-react';

const PurchasingPage = () => {
  const router = useRouter();
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');

  // Sample data
  const purchaseMetrics = {
    totalPurchases: 156780,
    pendingOrders: 12,
    activeVendors: 28,
    avgDeliveryTime: 7.5,
    trends: {
      purchases: +15.2,
      orders: -2.1,
      vendors: +8.7,
      delivery: -12.3
    }
  };

  const recentPurchaseOrders = [
    {
      id: 'PO-2024-001',
      vendor: 'Al-Rashid Oud Suppliers',
      location: 'Dubai, UAE',
      items: 15,
      total: 25600,
      status: 'delivered',
      date: '2024-01-15',
      expectedDelivery: '2024-01-20'
    },
    {
      id: 'PO-2024-002',
      vendor: 'Taif Rose Company',
      location: 'Taif, Saudi Arabia',
      items: 8,
      total: 12450,
      status: 'in_transit',
      date: '2024-01-12',
      expectedDelivery: '2024-01-18'
    },
    {
      id: 'PO-2024-003',
      vendor: 'Cambodian Oud Direct',
      location: 'Phnom Penh, Cambodia',
      items: 3,
      total: 45000,
      status: 'pending',
      date: '2024-01-10',
      expectedDelivery: '2024-01-25'
    }
  ];

  const topVendors = [
    {
      name: 'Al-Rashid Oud Suppliers',
      country: 'UAE',
      totalSpent: 156780,
      orders: 24,
      rating: 4.8,
      onTime: 95,
      category: 'Oud & Attar'
    },
    {
      name: 'Taif Rose Company',
      country: 'Saudi Arabia',
      totalSpent: 89650,
      orders: 18,
      rating: 4.6,
      onTime: 88,
      category: 'Rose & Florals'
    },
    {
      name: 'Cambodian Oud Direct',
      country: 'Cambodia',
      totalSpent: 234500,
      orders: 8,
      rating: 4.9,
      onTime: 92,
      category: 'Premium Oud'
    },
    {
      name: 'Mumbai Attar House',
      country: 'India',
      totalSpent: 67800,
      orders: 32,
      rating: 4.4,
      onTime: 78,
      category: 'Traditional Attars'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Purchasing & Vendors</h1>
          <p className="text-gray-600">Manage suppliers, purchase orders, and vendor relationships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/purchasing/reports')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/purchasing/create-order')}>
            <Plus className="h-4 w-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                <p className="text-xl sm:text-2xl font-bold">AED {(purchaseMetrics.totalPurchases / 1000).toFixed(0)}K</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(purchaseMetrics.trends.purchases)}`}>
                  {getTrendIcon(purchaseMetrics.trends.purchases)}
                  {Math.abs(purchaseMetrics.trends.purchases)}% vs last period
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-xl sm:text-2xl font-bold">{purchaseMetrics.pendingOrders}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(purchaseMetrics.trends.orders)}`}>
                  {getTrendIcon(purchaseMetrics.trends.orders)}
                  {Math.abs(purchaseMetrics.trends.orders)}% vs last period
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-xl sm:text-2xl font-bold">{purchaseMetrics.activeVendors}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(purchaseMetrics.trends.vendors)}`}>
                  {getTrendIcon(purchaseMetrics.trends.vendors)}
                  {Math.abs(purchaseMetrics.trends.vendors)}% vs last period
                </div>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Delivery Time</p>
                <p className="text-xl sm:text-2xl font-bold">{purchaseMetrics.avgDeliveryTime} days</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(purchaseMetrics.trends.delivery)}`}>
                  {getTrendIcon(purchaseMetrics.trends.delivery)}
                  {Math.abs(purchaseMetrics.trends.delivery)}% vs last period
                </div>
              </div>
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchase Orders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>Latest procurement activities and status updates</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="thisQuarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPurchaseOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.vendor}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {order.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell className="font-medium">AED {order.total?.toLocaleString() || "0"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.expectedDelivery}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => alert(`View order ${order.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/purchasing/create-order?edit=${order.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vendor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Vendor Performance</CardTitle>
          <CardDescription>Key suppliers ranked by volume and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topVendors.map((vendor, index) => (
              <div key={vendor.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{vendor.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {vendor.country}
                      <span>•</span>
                      {vendor.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="font-medium">AED {(vendor.totalSpent / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{vendor.orders}</div>
                    <div className="text-xs text-gray-500">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{vendor.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">{vendor.onTime}%</div>
                    <div className="text-xs text-gray-500">On Time</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push('/purchasing/vendor-management')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push('/purchasing/invoices')}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/purchasing/vendor-management')}>
          <CardContent className="p-4 sm:p-6 text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-medium mb-2">Vendor Management</h3>
            <p className="text-sm text-gray-600">Manage supplier database and relationships</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/purchasing/import-tracking')}>
          <CardContent className="p-4 sm:p-6 text-center">
            <Plane className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-medium mb-2">Import Tracking</h3>
            <p className="text-sm text-gray-600">Track international shipments and customs</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/purchasing/reports')}>
          <CardContent className="p-4 sm:p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-medium mb-2">Performance Reports</h3>
            <p className="text-sm text-gray-600">Analyze vendor performance and costs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchasingPage;