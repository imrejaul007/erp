'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Truck,
  Package,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  Hash,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  Upload,
  RotateCcw,
  Send,
  Check,
  X,
  FileText,
  Barcode,
  Users,
  DollarSign,
  BarChart3,
  ArrowLeft} from 'lucide-react';

interface StockTransfer {
  id: string;
  transferNumber: string;
  productId: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  status: string;
  requestedAt: string;
  shippedAt?: string | null;
  receivedAt?: string | null;
  cancelledAt?: string | null;
  notes?: string | null;
  shippingReference?: string | null;
  product: {
    id: string;
    name: string;
    sku: string;
    unit?: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

interface TransferAnalytics {
  totalTransfers: number;
  pendingApproval: number;
  inTransit: number;
  completedThisMonth: number;
  totalValue: number;
  avgDeliveryTime: number;
  successRate: number;
  trends: {
    requests: number;
    approvals: number;
    deliveries: number;
    value: number;
  };
}

interface Location {
  id: string;
  name: string;
  code: string;
  city: string;
}

const TransfersPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [transferAnalytics, setTransferAnalytics] = useState<TransferAnalytics>({
    totalTransfers: 0,
    pendingApproval: 0,
    inTransit: 0,
    completedThisMonth: 0,
    totalValue: 0,
    avgDeliveryTime: 0,
    successRate: 0,
    trends: {
      requests: 0,
      approvals: 0,
      deliveries: 0,
      value: 0
    }
  });

  useEffect(() => {
    fetchTransferData();
  }, []);

  const fetchTransferData = async () => {
    try {
      const [analyticsRes, transfersRes, storesRes] = await Promise.all([
        fetch('/api/stock-transfers/analytics'),
        fetch('/api/stock-transfers'),
        fetch('/api/stores?limit=100')
      ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setTransferAnalytics(analyticsData.analytics || transferAnalytics);
      }

      if (transfersRes.ok) {
        const transfersData = await transfersRes.json();
        setTransfers(transfersData || []);
      }

      if (storesRes.ok) {
        const storesData = await storesRes.json();
        const storesArray = (storesData.stores || []).map((store: any) => ({
          id: store.id,
          name: store.name,
          code: store.storeCode || store.id.substring(0, 8),
          city: store.city || 'UAE'
        }));
        setLocations(storesArray);
      }
    } catch (error) {
      console.error('Error fetching transfer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_TRANSIT': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'IN_TRANSIT': return <Truck className="h-4 w-4" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.toLowerCase().replace('_', ' ');
  };

  const getLocationName = (locationId: string) => {
    return locations.find(loc => loc.id === locationId)?.name || locationId;
  };

  const getLocationCode = (locationId: string) => {
    return locations.find(loc => loc.id === locationId)?.code || locationId.substring(0, 8);
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.transferNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getLocationName(transfer.fromLocation).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getLocationName(transfer.toLocation).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || transfer.status.toUpperCase() === statusFilter.toUpperCase();
    const matchesLocation = locationFilter === 'all' ||
                           transfer.fromLocation === locationFilter ||
                           transfer.toLocation === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransferProgress = (transfer: StockTransfer) => {
    switch (transfer.status.toUpperCase()) {
      case 'PENDING': return 25;
      case 'IN_TRANSIT': return 75;
      case 'COMPLETED': return 100;
      case 'CANCELLED': return 0;
      default: return 0;
    }
  };

  if (loading) {
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Transfer Management</h1>
          <p className="text-gray-600">Manage inventory transfers and approvals across all UAE locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Transfer Request
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transfers</p>
                <p className="text-xl sm:text-2xl font-bold">{transferAnalytics.totalTransfers}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(transferAnalytics.trends.requests)}`}>
                  {getTrendIcon(transferAnalytics.trends.requests)}
                  {Math.abs(transferAnalytics.trends.requests)}% vs last month
                </div>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-xl sm:text-2xl font-bold">{transferAnalytics.pendingApproval}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(transferAnalytics.trends.approvals)}`}>
                  {getTrendIcon(transferAnalytics.trends.approvals)}
                  {Math.abs(transferAnalytics.trends.approvals)}% vs last month
                </div>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-xl sm:text-2xl font-bold">{transferAnalytics.inTransit}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(transferAnalytics.trends.deliveries)}`}>
                  {getTrendIcon(transferAnalytics.trends.deliveries)}
                  {Math.abs(transferAnalytics.trends.deliveries)}% vs last month
                </div>
              </div>
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-xl sm:text-2xl font-bold">AED {(transferAnalytics.totalValue / 1000).toFixed(1)}K</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(transferAnalytics.trends.value)}`}>
                  {getTrendIcon(transferAnalytics.trends.value)}
                  {Math.abs(transferAnalytics.trends.value)}% vs last month
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by request ID, location, or requester..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Management Tabs */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Transfer Requests</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="tracking">Shipment Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Transfer Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transfer Requests</CardTitle>
              <CardDescription>
                Complete list of inventory transfer requests across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransfers.map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Truck className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{transfer.transferNumber}</h3>
                            <Badge className={getStatusColor(transfer.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(transfer.status)}
                                {getStatusLabel(transfer.status)}
                              </div>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{getLocationCode(transfer.fromLocation)}</span>
                              <ArrowRight className="h-3 w-3" />
                              <span>{getLocationCode(transfer.toLocation)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{transfer.createdBy.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(transfer.requestedAt)}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {transfer.quantity}x {transfer.product.name} ({transfer.product.sku})
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Transfer Progress</span>
                        <span>{getTransferProgress(transfer)}%</span>
                      </div>
                      <Progress value={getTransferProgress(transfer)} className="h-2" />
                    </div>

                    {/* Transfer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">From:</span>
                        <div className="font-medium">{getLocationName(transfer.fromLocation)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">To:</span>
                        <div className="font-medium">{getLocationName(transfer.toLocation)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Shipped:</span>
                        <div className="font-medium">{formatDate(transfer.shippedAt)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Tracking:</span>
                        <div className="font-medium">{transfer.shippingReference || 'Not assigned'}</div>
                      </div>
                    </div>

                    {transfer.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">Notes: </span>
                        {transfer.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Transfer requests awaiting management approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transfers.filter(t => t.status.toUpperCase() === 'PENDING').map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{transfer.transferNumber}</h3>
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Pending
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{getLocationName(transfer.fromLocation)}</span>
                              <ArrowRight className="h-3 w-3" />
                              <span>{getLocationName(transfer.toLocation)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{transfer.createdBy.name}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Requested: {formatDate(transfer.requestedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive">
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <h4 className="font-medium mb-2">Transfer Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium">{transfer.product.name}</span>
                            <span className="text-gray-500 ml-2">({transfer.product.sku})</span>
                          </div>
                          <div className="text-right">
                            <div>Qty: {transfer.quantity}</div>
                            <div className="text-gray-500">{transfer.product.unit || 'units'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {transfer.notes && (
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">Request Notes: </span>
                        {transfer.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Tracking</CardTitle>
              <CardDescription>
                Real-time tracking of transfers in transit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transfers.filter(t => t.status.toUpperCase() === 'IN_TRANSIT').map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Truck className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{transfer.transferNumber}</h3>
                            <Badge className="bg-purple-100 text-purple-800">
                              In Transit
                            </Badge>
                            {transfer.shippingReference && (
                              <Badge variant="outline">
                                <Barcode className="h-3 w-3 mr-1" />
                                {transfer.shippingReference}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{getLocationName(transfer.fromLocation)}</span>
                              <ArrowRight className="h-3 w-3" />
                              <span>{getLocationName(transfer.toLocation)}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Shipped:</span>
                              <div className="font-medium">{formatDate(transfer.shippedAt)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Product:</span>
                              <div className="font-medium">{transfer.product.name} x{transfer.quantity}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">ETA</div>
                        <div className="font-semibold">2 hours</div>
                      </div>
                    </div>

                    {/* Tracking Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Shipment Progress</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>

                    {/* Tracking Timeline */}
                    <div className="bg-white rounded-lg p-3">
                      <h4 className="font-medium mb-3">Tracking History</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Package shipped from {getLocationName(transfer.fromLocation)}</div>
                            <div className="text-xs text-gray-500">{formatDate(transfer.shippedAt)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">In transit - Dubai Logistics Hub</div>
                            <div className="text-xs text-gray-500">29 Sep, 14:30</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Out for delivery</div>
                            <div className="text-xs text-gray-500">01 Oct, 12:15 (Current)</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-500">Delivery to {getLocationName(transfer.toLocation)}</div>
                            <div className="text-xs text-gray-400">Awaiting delivery confirmation</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Transfer Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Transfer Volume Trends</CardTitle>
                <CardDescription>Monthly transfer requests and completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Transfer Volume Chart</p>
                    <p className="text-sm text-gray-500">Integration with charting library</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>Transfer activity by store location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locations.slice(0, 6).map((location) => {
                    const locationTransfers = transfers.filter(t =>
                      t.fromLocation === location.id || t.toLocation === location.id
                    );
                    const transferCount = locationTransfers.length;

                    return (
                      <div key={location.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.code}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{transferCount} transfers</div>
                          <div className="text-sm text-gray-500">This month</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key transfer performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Delivery Time</span>
                    <span className="text-lg font-bold">{transferAnalytics.avgDeliveryTime} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-lg font-bold text-green-600">{transferAnalytics.successRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">On-time Delivery</span>
                    <span className="text-lg font-bold text-blue-600">92.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Value Transferred</span>
                    <span className="text-lg font-bold">AED {(transferAnalytics.totalValue / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common transfer management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Transfer Request
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Transfer Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Bulk Approve Transfers
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Sync Transfer Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransfersPage;