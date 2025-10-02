'use client';

import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';

const TransfersPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // UAE Store Locations
  const locations = [
    { id: 'LOC-001', name: 'Dubai Mall Flagship', code: 'DXB-DM', city: 'Dubai' },
    { id: 'LOC-002', name: 'Mall of Emirates', code: 'DXB-MOE', city: 'Dubai' },
    { id: 'LOC-003', name: 'Ibn Battuta Mall', code: 'DXB-IBN', city: 'Dubai' },
    { id: 'LOC-004', name: 'City Centre Mirdif', code: 'DXB-CCM', city: 'Dubai' },
    { id: 'LOC-005', name: 'Abu Dhabi Mall', code: 'AUH-ADM', city: 'Abu Dhabi' },
    { id: 'LOC-006', name: 'Sharjah City Centre', code: 'SHJ-SCC', city: 'Sharjah' },
    { id: 'LOC-007', name: 'Al Ghurair Centre', code: 'DXB-AGC', city: 'Dubai' },
    { id: 'LOC-008', name: 'Yas Mall', code: 'AUH-YAS', city: 'Abu Dhabi' }
  ];

  // Sample transfer data
  const transfers = [
    {
      id: 'TRF-001',
      requestId: 'REQ-2024-001',
      fromLocation: 'LOC-001',
      toLocation: 'LOC-003',
      requestedBy: 'Omar Hassan',
      approvedBy: 'Ahmed Al-Rashid',
      status: 'in_transit',
      priority: 'high',
      items: [
        { sku: 'ROP-100ML', name: 'Royal Oud Premium', qty: 12, unitCost: 150, totalValue: 1800 },
        { sku: 'JE-50ML', name: 'Jasmine Essence', qty: 8, unitCost: 80, totalValue: 640 }
      ],
      totalItems: 20,
      totalValue: 2440,
      requestDate: '2024-09-28T09:00:00',
      approvalDate: '2024-09-28T14:30:00',
      shipmentDate: '2024-09-29T10:00:00',
      expectedDelivery: '2024-10-01T16:00:00',
      actualDelivery: null,
      trackingNumber: 'TRK-UAE-001',
      notes: 'Urgent transfer for weekend sales event',
      attachments: ['transfer_request.pdf', 'inventory_list.xlsx']
    },
    {
      id: 'TRF-002',
      requestId: 'REQ-2024-002',
      fromLocation: 'LOC-005',
      toLocation: 'LOC-002',
      requestedBy: 'Fatima Al-Zahra',
      approvedBy: 'Khalid Al-Mansoori',
      status: 'delivered',
      priority: 'medium',
      items: [
        { sku: 'SG-75ML', name: 'Saffron Gold', qty: 6, unitCost: 200, totalValue: 1200 },
        { sku: 'RA-30ML', name: 'Rose Attar', qty: 15, unitCost: 120, totalValue: 1800 }
      ],
      totalItems: 21,
      totalValue: 3000,
      requestDate: '2024-09-26T11:30:00',
      approvalDate: '2024-09-26T15:45:00',
      shipmentDate: '2024-09-27T08:00:00',
      expectedDelivery: '2024-09-28T12:00:00',
      actualDelivery: '2024-09-28T11:45:00',
      trackingNumber: 'TRK-UAE-002',
      notes: 'Regular inventory replenishment',
      attachments: ['delivery_receipt.pdf']
    },
    {
      id: 'TRF-003',
      requestId: 'REQ-2024-003',
      fromLocation: 'LOC-002',
      toLocation: 'LOC-006',
      requestedBy: 'Mariam Al-Qasimi',
      approvedBy: null,
      status: 'pending_approval',
      priority: 'low',
      items: [
        { sku: 'JE-50ML', name: 'Jasmine Essence', qty: 10, unitCost: 80, totalValue: 800 },
        { sku: 'RA-30ML', name: 'Rose Attar', qty: 5, unitCost: 120, totalValue: 600 }
      ],
      totalItems: 15,
      totalValue: 1400,
      requestDate: '2024-09-30T14:20:00',
      approvalDate: null,
      shipmentDate: null,
      expectedDelivery: null,
      actualDelivery: null,
      trackingNumber: null,
      notes: 'Stock shortage - need replenishment',
      attachments: ['stock_report.pdf']
    },
    {
      id: 'TRF-004',
      requestId: 'REQ-2024-004',
      fromLocation: 'LOC-004',
      toLocation: 'LOC-007',
      requestedBy: 'Aisha Mohammed',
      approvedBy: 'Regional Manager',
      status: 'rejected',
      priority: 'medium',
      items: [
        { sku: 'ROP-100ML', name: 'Royal Oud Premium', qty: 25, unitCost: 150, totalValue: 3750 }
      ],
      totalItems: 25,
      totalValue: 3750,
      requestDate: '2024-09-25T16:00:00',
      approvalDate: '2024-09-26T09:30:00',
      shipmentDate: null,
      expectedDelivery: null,
      actualDelivery: null,
      trackingNumber: null,
      notes: 'Rejected - insufficient inventory at source location',
      attachments: ['rejection_notice.pdf']
    }
  ];

  // Transfer analytics
  const transferAnalytics = {
    totalTransfers: transfers.length,
    pendingApproval: transfers.filter(t => t.status === 'pending_approval').length,
    inTransit: transfers.filter(t => t.status === 'in_transit').length,
    completedThisMonth: transfers.filter(t => t.status === 'delivered').length,
    totalValue: transfers.reduce((sum, t) => sum + t.totalValue, 0),
    avgDeliveryTime: 1.5,
    successRate: 85.7,
    trends: {
      requests: +12.5,
      approvals: +8.3,
      deliveries: +15.2,
      value: +22.1
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_approval': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationName = (locationId) => {
    return locations.find(loc => loc.id === locationId)?.name || 'Unknown Location';
  };

  const getLocationCode = (locationId) => {
    return locations.find(loc => loc.id === locationId)?.code || 'UNK';
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getLocationName(transfer.fromLocation).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getLocationName(transfer.toLocation).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransferProgress = (transfer) => {
    switch (transfer.status) {
      case 'pending_approval': return 25;
      case 'approved': return 50;
      case 'in_transit': return 75;
      case 'delivered': return 100;
      case 'rejected':
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
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
                <p className="text-2xl font-bold">{transferAnalytics.totalTransfers}</p>
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
                <p className="text-2xl font-bold">{transferAnalytics.pendingApproval}</p>
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
                <p className="text-2xl font-bold">{transferAnalytics.inTransit}</p>
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
                <p className="text-2xl font-bold">AED {(transferAnalytics.totalValue / 1000).toFixed(1)}K</p>
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
                  <SelectItem value="pending_approval">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
                            <h3 className="font-semibold">{transfer.requestId}</h3>
                            <Badge className={getStatusColor(transfer.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(transfer.status)}
                                {transfer.status.replace('_', ' ')}
                              </div>
                            </Badge>
                            <Badge className={getPriorityColor(transfer.priority)}>
                              {transfer.priority} priority
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
                              <span>{transfer.requestedBy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(transfer.requestDate)}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {transfer.totalItems} items • AED {transfer.totalValue.toLocaleString()}
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
                        <span className="text-gray-500">Expected Delivery:</span>
                        <div className="font-medium">{formatDate(transfer.expectedDelivery)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Tracking:</span>
                        <div className="font-medium">{transfer.trackingNumber || 'Not assigned'}</div>
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
                {transfers.filter(t => t.status === 'pending_approval').map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{transfer.requestId}</h3>
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Pending Approval
                            </Badge>
                            <Badge className={getPriorityColor(transfer.priority)}>
                              {transfer.priority} priority
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
                              <span>{transfer.requestedBy}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Requested: {formatDate(transfer.requestDate)}
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
                      <h4 className="font-medium mb-2">Transfer Items</h4>
                      <div className="space-y-2">
                        {transfer.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500 ml-2">({item.sku})</span>
                            </div>
                            <div className="text-right">
                              <div>Qty: {item.qty}</div>
                              <div className="text-gray-500">AED {item.totalValue}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                        <span>Total: {transfer.totalItems} items</span>
                        <span>AED {transfer.totalValue.toLocaleString()}</span>
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
                {transfers.filter(t => t.status === 'in_transit').map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Truck className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{transfer.requestId}</h3>
                            <Badge className="bg-purple-100 text-purple-800">
                              In Transit
                            </Badge>
                            <Badge variant="outline">
                              <Barcode className="h-3 w-3 mr-1" />
                              {transfer.trackingNumber}
                            </Badge>
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
                              <div className="font-medium">{formatDate(transfer.shipmentDate)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Expected:</span>
                              <div className="font-medium">{formatDate(transfer.expectedDelivery)}</div>
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
                            <div className="text-xs text-gray-500">{formatDate(transfer.shipmentDate)}</div>
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
                            <div className="text-xs text-gray-400">Expected: {formatDate(transfer.expectedDelivery)}</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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