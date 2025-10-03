'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingBag,
  TrendingUp,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Eye,
  Download,
  BarChart3,
  Users,
  Star,
  Heart,
  DollarSign,
  Package,
  MapPin,
  Clock,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
  ArrowLeft} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Customer {
  id: string;
  code: string;
  name: string;
  nameArabic?: string;
  email?: string;
  phone?: string;
  segment: string;
  emirate?: string;
  totalLifetimeValue: number;
  totalOrders: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  firstOrderDate: string;
  loyaltyPoints: number;
  loyaltyTier: string;
  isActive: boolean;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerSegment: string;
  orderDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  paymentMethod: string;
  deliveryMethod: string;
  shippingAddress?: string;
  emirate?: string;
  items: OrderItem[];
  notes?: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  totalPrice: number;
  image?: string;
}

interface PurchaseAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalSpent: number;
    orderCount: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    category: string;
    totalSold: number;
    revenue: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    orders: number;
    avgOrderValue: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  seasonalPatterns: Array<{
    season: string;
    revenue: number;
    topProducts: string[];
  }>;
}

const ORDER_STATUS_COLORS = {
  PENDING: '#F59E0B',
  CONFIRMED: '#3B82F6',
  SHIPPED: '#8B5CF6',
  DELIVERED: '#10B981',
  CANCELLED: '#EF4444',
  RETURNED: '#F97316'
};

const SEGMENT_COLORS = {
  VIP: '#9333EA',
  REGULAR: '#3B82F6',
  WHOLESALE: '#059669',
  EXPORT: '#DC2626'
};

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [analytics, setAnalytics] = useState<PurchaseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchPurchaseData();
  }, []);

  const fetchPurchaseData = async () => {
    try {
      setLoading(true);
      const [customersRes, ordersRes, analyticsRes] = await Promise.all([
        fetch('/api/crm/customers/purchase-summary'),
        fetch('/api/crm/purchase-history'),
        fetch('/api/crm/purchase-analytics')
      ]);

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData.customers || []);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching purchase data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter;

    return matchesSearch && matchesSegment;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDateFrom = !dateFrom || new Date(order.orderDate) >= dateFrom;
    const matchesDateTo = !dateTo || new Date(order.orderDate) <= dateTo;

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'orderDate':
        aValue = new Date(a.orderDate).getTime();
        bValue = new Date(b.orderDate).getTime();
        break;
      case 'amount':
        aValue = a.finalAmount;
        bValue = b.finalAmount;
        break;
      case 'customer':
        aValue = a.customerName.toLowerCase();
        bValue = b.customerName.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-AE').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOrderStatusBadge = (status: string) => {
    return (
      <Badge
        style={{
          backgroundColor: `${ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS]}20`,
          color: ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS]
        }}
      >
        {status}
      </Badge>
    );
  };

  if (loading || !analytics) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase History & Analytics</h1>
          <p className="text-gray-600 mt-1">Track customer purchase patterns and behavior</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPurchaseData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {formatNumber(analytics.totalOrders)} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(analytics.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{customers.filter(c => c.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              With recent purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {customers.filter(c => c.totalOrders > 1).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Multiple purchases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="customers" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">Customer Analysis</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="products">Product Insights</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
        </TabsList>

        {/* Customer Analysis Tab */}
        <TabsContent value="customers" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Customer Purchase Summary
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Segments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Segments</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="REGULAR">Regular</SelectItem>
                      <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                      <SelectItem value="EXPORT">Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Avg Order</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.slice(0, 10).map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          {customer.nameArabic && (
                            <div className="text-sm text-gray-600" dir="rtl">
                              {customer.nameArabic}
                            </div>
                          )}
                          <div className="text-sm text-gray-500">{customer.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: `${SEGMENT_COLORS[customer.segment as keyof typeof SEGMENT_COLORS]}20`,
                            color: SEGMENT_COLORS[customer.segment as keyof typeof SEGMENT_COLORS]
                          }}
                        >
                          {customer.segment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          {formatCurrency(customer.totalLifetimeValue)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-gray-400" />
                          {customer.totalOrders}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{formatCurrency(customer.averageOrderValue)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View History
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Top Customers by Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCustomers.slice(0, 5).map((customer, index) => (
                  <div key={customer.customerId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{customer.customerName}</div>
                        <div className="text-sm text-gray-600">{customer.orderCount} orders</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(customer.totalSpent)}</div>
                      <div className="text-sm text-gray-600">
                        Avg: {formatCurrency(customer.totalSpent / customer.orderCount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order History Tab */}
        <TabsContent value="orders" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order History
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="RETURNED">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-40">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Date Range
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{ from: dateFrom, to: dateTo }}
                        onSelect={(range) => {
                          setDateFrom(range?.from);
                          setDateTo(range?.to);
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => {
                        setSortBy('orderDate');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}>
                        Order Date <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Order Number</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => {
                        setSortBy('customer');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}>
                        Customer <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => {
                        setSortBy('amount');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}>
                        Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.slice(0, 15).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {formatDate(order.orderDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">{order.orderNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: SEGMENT_COLORS[order.customerSegment as keyof typeof SEGMENT_COLORS],
                              color: SEGMENT_COLORS[order.customerSegment as keyof typeof SEGMENT_COLORS]
                            }}
                          >
                            {order.customerSegment}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{formatCurrency(order.finalAmount)}</div>
                          {order.discountAmount > 0 && (
                            <div className="text-sm text-green-600">
                              -{formatCurrency(order.discountAmount)} discount
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getOrderStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{order.paymentMethod}</div>
                        <div className="text-xs text-gray-500">{order.deliveryMethod}</div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Insights Tab */}
        <TabsContent value="products" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Top Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProducts.slice(0, 8).map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{product.productName}</div>
                          <div className="text-sm text-gray-600">{product.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                        <div className="text-sm text-gray-600">{product.totalSold} sold</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.categoryBreakdown.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{category.category}</span>
                        <span>{formatCurrency(category.revenue)} ({category.percentage}%)</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seasonal Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Seasonal Buying Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.seasonalPatterns.map((season) => (
                  <div key={season.season} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{season.season}</h4>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(season.revenue)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">Top Products:</div>
                      {season.topProducts.slice(0, 3).map((product, index) => (
                        <div key={index} className="text-xs text-gray-500">
                          • {product}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends & Patterns Tab */}
        <TabsContent value="trends" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Revenue Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyTrends.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium">{month.month}</div>
                      <div className="w-32">
                        <Progress
                          value={(month.revenue / Math.max(...analytics.monthlyTrends.map(m => m.revenue))) * 100}
                          className="h-3"
                        />
                      </div>
                    </div>
                    <div className="flex gap-8 text-sm">
                      <div>
                        <div className="text-gray-600">Revenue</div>
                        <div className="font-semibold">{formatCurrency(month.revenue)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Orders</div>
                        <div className="font-semibold">{month.orders}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Avg Order</div>
                        <div className="font-semibold">{formatCurrency(month.avgOrderValue)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order {selectedOrder.orderNumber}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <div className="font-semibold">{selectedOrder.customerName}</div>
                </div>
                <div>
                  <Label>Order Date</Label>
                  <div className="font-semibold">{formatDate(selectedOrder.orderDate)}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getOrderStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <div className="font-semibold">{selectedOrder.paymentMethod}</div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <Label>Shipping Address</Label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <div>{selectedOrder.shippingAddress}</div>
                      {selectedOrder.emirate && (
                        <div className="text-sm text-gray-600">{selectedOrder.emirate}, UAE</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Order Items */}
              <div>
                <Label>Order Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-gray-600">{item.brand} • {item.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>
                          {item.discountPercent > 0 && (
                            <span className="text-green-600">{item.discountPercent}%</span>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              {/* Order Total */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Final Total:</span>
                    <span>{formatCurrency(selectedOrder.finalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <Label>Notes</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedOrder.notes}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}