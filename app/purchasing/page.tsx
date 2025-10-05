'use client';

import React, { useState, useEffect } from 'react';
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

// TypeScript Interfaces
interface PurchaseOrderItem {
  id: string;
  rawMaterial?: {
    id: string;
    code: string;
    name: string;
    category: string;
  };
  product?: {
    id: string;
    code: string;
    name: string;
    category: string;
  };
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: {
    id: string;
    name: string;
    code: string;
    country: string;
    rating?: number;
  };
  status: string;
  priority: string;
  totalAmount: number;
  orderDate: string;
  requestedDate: string;
  expectedDate?: string;
  items: PurchaseOrderItem[];
  itemCount: number;
}

interface Supplier {
  id: string;
  code: string;
  name: string;
  country: string;
  category: string;
  rating?: number;
  performanceScore?: number;
  totalOrders: number;
  onTimeDeliveryRate: number;
  isPreferred: boolean;
}

interface PurchaseMetrics {
  totalPurchases: number;
  pendingOrders: number;
  activeVendors: number;
  avgDeliveryTime: number;
  trends: {
    purchases: number;
    orders: number;
    vendors: number;
    delivery: number;
  };
}

const PurchasingPage = () => {
  const router = useRouter();
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseMetrics, setPurchaseMetrics] = useState<PurchaseMetrics>({
    totalPurchases: 0,
    pendingOrders: 0,
    activeVendors: 0,
    avgDeliveryTime: 0,
    trends: {
      purchases: 0,
      orders: 0,
      vendors: 0,
      delivery: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch purchase orders and suppliers in parallel
      const [ordersResponse, suppliersResponse] = await Promise.all([
        fetch('/api/purchase-orders?limit=10'),
        fetch('/api/suppliers?limit=10')
      ]);

      if (!ordersResponse.ok || !suppliersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const ordersData = await ordersResponse.json();
      const suppliersData = await suppliersResponse.json();

      setPurchaseOrders(ordersData.data?.purchaseOrders || []);
      setSuppliers(suppliersData.data?.suppliers || []);

      // Calculate metrics from real data
      const orders = ordersData.data?.purchaseOrders || [];
      const suppliersArr = suppliersData.data?.suppliers || [];

      const totalPurchases = orders.reduce((sum: number, order: PurchaseOrder) => sum + order.totalAmount, 0);
      const pendingOrders = orders.filter((order: PurchaseOrder) =>
        order.status === 'PENDING' || order.status === 'DRAFT'
      ).length;

      // Calculate average delivery time for completed orders
      const completedOrders = orders.filter((order: PurchaseOrder) =>
        order.status === 'COMPLETED' && order.expectedDate && order.orderDate
      );
      const avgDeliveryTime = completedOrders.length > 0
        ? completedOrders.reduce((sum: number, order: PurchaseOrder) => {
            const orderDate = new Date(order.orderDate);
            const deliveryDate = new Date(order.expectedDate!);
            const days = Math.ceil((deliveryDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
            return sum + days;
          }, 0) / completedOrders.length
        : 0;

      setPurchaseMetrics({
        totalPurchases,
        pendingOrders,
        activeVendors: suppliersArr.length,
        avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
        trends: {
          purchases: 0, // TODO: Calculate trends from historical data
          orders: 0,
          vendors: 0,
          delivery: 0
        }
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load purchasing data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'ACKNOWLEDGED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Purchasing & Vendors</h1>
            <p className="text-gray-600">Manage suppliers, purchase orders, and vendor relationships</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="w-full sm:w-auto">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/purchasing/reports')} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/purchasing/create-order')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="ml-3 text-gray-600">Loading purchasing data...</p>
        </div>
      )}

      {!loading && !error && (
        <>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>Latest procurement activities and status updates</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="thisQuarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
              {purchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No purchase orders found. Create your first purchase order to get started.
                  </TableCell>
                </TableRow>
              ) : (
                purchaseOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.poNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.supplier.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {order.supplier.country}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.itemCount} items</TableCell>
                    <TableCell className="font-medium">AED {order.totalAmount?.toLocaleString() || "0"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {order.expectedDate
                        ? new Date(order.expectedDate).toLocaleDateString()
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => alert(`View order ${order.poNumber}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/purchasing/create-order?edit=${order.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
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
            {suppliers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No suppliers found. Add suppliers to track vendor performance.
              </div>
            ) : (
              suppliers.slice(0, 5).map((supplier, index) => (
                <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {supplier.name}
                        {supplier.isPreferred && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Preferred</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {supplier.country}
                        <span>•</span>
                        {supplier.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="font-medium">{supplier.totalOrders}</div>
                      <div className="text-xs text-gray-500">Orders</div>
                    </div>
                    {supplier.rating && (
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{supplier.rating.toFixed(1)}</span>
                        </div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="font-medium text-green-600">{supplier.onTimeDeliveryRate}%</div>
                      <div className="text-xs text-gray-500">On Time</div>
                    </div>
                    {supplier.performanceScore && (
                      <div className="text-center">
                        <div className="font-medium">{supplier.performanceScore.toFixed(0)}</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    )}
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
              ))
            )}
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
      </>
      )}
    </div>
  );
};

export default PurchasingPage;