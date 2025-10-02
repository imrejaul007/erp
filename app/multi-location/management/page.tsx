'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Store,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Plus,
  Edit,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Shield,
  Phone,
  Mail,
  Building,
  Calendar,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';

const Sync = RefreshCw; // Alias for backward compatibility

const MultiLocationManagement = () => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedTransferItem, setSelectedTransferItem] = useState(null);

  // Sample multi-location data
  const locations = [
    {
      id: 'loc001',
      name: 'Dubai Mall Store',
      type: 'flagship',
      status: 'active',
      manager: 'Ahmed Al-Rashid',
      address: 'Dubai Mall, Level 2, Dubai, UAE',
      phone: '+971-4-123-4567',
      email: 'dubaimall@oudpms.ae',
      openingHours: '10:00 AM - 11:00 PM',
      size: '500 sqm',
      staffCount: 12,
      salesTarget: 2500000,
      currentSales: 2100000,
      inventory: {
        totalItems: 1250,
        lowStock: 45,
        outOfStock: 8,
        value: 875000
      },
      performance: {
        conversion: 24.5,
        avgTransaction: 450,
        customerSatisfaction: 4.7,
        footfall: 850
      },
      coordinates: { lat: 25.1975, lng: 55.2796 }
    },
    {
      id: 'loc002',
      name: 'Abu Dhabi Mall Store',
      type: 'standard',
      status: 'active',
      manager: 'Fatima Al-Zahra',
      address: 'Abu Dhabi Mall, Ground Floor, Abu Dhabi, UAE',
      phone: '+971-2-234-5678',
      email: 'abudhabi@oudpms.ae',
      openingHours: '10:00 AM - 10:00 PM',
      size: '350 sqm',
      staffCount: 8,
      salesTarget: 1800000,
      currentSales: 1650000,
      inventory: {
        totalItems: 950,
        lowStock: 32,
        outOfStock: 5,
        value: 620000
      },
      performance: {
        conversion: 22.8,
        avgTransaction: 385,
        customerSatisfaction: 4.5,
        footfall: 680
      },
      coordinates: { lat: 24.4539, lng: 54.3773 }
    },
    {
      id: 'loc003',
      name: 'Sharjah City Centre',
      type: 'standard',
      status: 'active',
      manager: 'Omar Hassan',
      address: 'Sharjah City Centre, Level 1, Sharjah, UAE',
      phone: '+971-6-345-6789',
      email: 'sharjah@oudpms.ae',
      openingHours: '10:00 AM - 11:00 PM',
      size: '280 sqm',
      staffCount: 6,
      salesTarget: 1200000,
      currentSales: 1050000,
      inventory: {
        totalItems: 720,
        lowStock: 28,
        outOfStock: 3,
        value: 420000
      },
      performance: {
        conversion: 21.2,
        avgTransaction: 320,
        customerSatisfaction: 4.3,
        footfall: 520
      },
      coordinates: { lat: 25.3373, lng: 55.4209 }
    },
    {
      id: 'loc004',
      name: 'Al Ain Mall Store',
      type: 'mini',
      status: 'active',
      manager: 'Maryam Ahmed',
      address: 'Al Ain Mall, Ground Floor, Al Ain, UAE',
      phone: '+971-3-456-7890',
      email: 'alain@oudpms.ae',
      openingHours: '10:00 AM - 10:00 PM',
      size: '150 sqm',
      staffCount: 4,
      salesTarget: 800000,
      currentSales: 720000,
      inventory: {
        totalItems: 480,
        lowStock: 18,
        outOfStock: 2,
        value: 280000
      },
      performance: {
        conversion: 19.5,
        avgTransaction: 280,
        customerSatisfaction: 4.2,
        footfall: 380
      },
      coordinates: { lat: 24.1907, lng: 55.7464 }
    },
    {
      id: 'loc005',
      name: 'Warehouse Dubai',
      type: 'warehouse',
      status: 'active',
      manager: 'Khalid Mansoor',
      address: 'Dubai Industrial Area, Warehouse 45, Dubai, UAE',
      phone: '+971-4-567-8901',
      email: 'warehouse@oudpms.ae',
      openingHours: '7:00 AM - 7:00 PM',
      size: '2000 sqm',
      staffCount: 15,
      salesTarget: 0,
      currentSales: 0,
      inventory: {
        totalItems: 5500,
        lowStock: 120,
        outOfStock: 25,
        value: 3200000
      },
      performance: {
        conversion: 0,
        avgTransaction: 0,
        customerSatisfaction: 0,
        footfall: 0
      },
      coordinates: { lat: 25.1192, lng: 55.1907 }
    }
  ];

  const transferRequests = [
    {
      id: 'tr001',
      fromLocation: 'Dubai Mall Store',
      toLocation: 'Abu Dhabi Mall Store',
      items: [
        { product: 'Royal Oud 12ml', quantity: 10, value: 4500 },
        { product: 'Arabian Rose 6ml', quantity: 20, value: 2400 }
      ],
      requestedBy: 'Fatima Al-Zahra',
      requestDate: '2024-01-15',
      status: 'pending',
      priority: 'high',
      reason: 'Stock replenishment for weekend promotion'
    },
    {
      id: 'tr002',
      fromLocation: 'Warehouse Dubai',
      toLocation: 'Sharjah City Centre',
      items: [
        { product: 'Oud Muattar Premium', quantity: 15, value: 3750 },
        { product: 'Perfume Gift Set', quantity: 5, value: 1250 }
      ],
      requestedBy: 'Omar Hassan',
      requestDate: '2024-01-14',
      status: 'approved',
      priority: 'medium',
      reason: 'New product launch preparation'
    }
  ];

  const accessLevels = [
    {
      level: 'Super Admin',
      permissions: ['All Locations', 'User Management', 'System Settings', 'Financial Reports', 'Inventory Transfers'],
      users: ['Ahmed Al-Mansouri', 'Sarah Johnson']
    },
    {
      level: 'Regional Manager',
      permissions: ['Multiple Locations', 'Staff Management', 'Performance Reports', 'Inventory Management'],
      users: ['Mohammed Al-Rashid', 'Fatima Hassan']
    },
    {
      level: 'Store Manager',
      permissions: ['Single Location', 'Staff Scheduling', 'Daily Reports', 'Local Inventory'],
      users: ['Ahmed Al-Rashid', 'Fatima Al-Zahra', 'Omar Hassan', 'Maryam Ahmed']
    },
    {
      level: 'Staff',
      permissions: ['POS Operations', 'Customer Service', 'Basic Reporting'],
      users: ['Various Staff Members']
    }
  ];

  const getLocationStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationTypeIcon = (type) => {
    switch (type) {
      case 'flagship': return <Building className="h-4 w-4" />;
      case 'standard': return <Store className="h-4 w-4" />;
      case 'mini': return <Store className="h-4 w-4 scale-75" />;
      case 'warehouse': return <Package className="h-4 w-4" />;
      default: return <Store className="h-4 w-4" />;
    }
  };

  const calculateTotalMetrics = () => {
    const activeStores = locations.filter(loc => loc.type !== 'warehouse' && loc.status === 'active');
    return {
      totalSales: activeStores.reduce((sum, loc) => sum + loc.currentSales, 0),
      totalTarget: activeStores.reduce((sum, loc) => sum + loc.salesTarget, 0),
      totalStaff: locations.reduce((sum, loc) => sum + loc.staffCount, 0),
      totalInventoryValue: locations.reduce((sum, loc) => sum + loc.inventory.value, 0),
      avgConversion: activeStores.reduce((sum, loc) => sum + loc.performance.conversion, 0) / activeStores.length,
      totalFootfall: activeStores.reduce((sum, loc) => sum + loc.performance.footfall, 0)
    };
  };

  const totalMetrics = calculateTotalMetrics();

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Multi-Location Management</h1>
          <p className="text-gray-600">Centralized control and monitoring of all store locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Sync className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogDescription>
                  Configure a new store location or warehouse facility
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="locationName">Location Name</Label>
                  <Input id="locationName" placeholder="Enter location name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationType">Location Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flagship">Flagship Store</SelectItem>
                      <SelectItem value="standard">Standard Store</SelectItem>
                      <SelectItem value="mini">Mini Store</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Complete address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Store Manager</Label>
                  <Input id="manager" placeholder="Manager name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+971-X-XXX-XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="location@oudpms.ae" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size (sqm)</Label>
                  <Input id="size" type="number" placeholder="Store size" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddLocationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddLocationOpen(false)}>
                  Add Location
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Locations</p>
                <p className="text-xl sm:text-2xl font-bold">{locations.length}</p>
                <p className="text-xs text-gray-500">{locations.filter(l => l.status === 'active').length} active</p>
              </div>
              <Store className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-xl sm:text-2xl font-bold">AED {(totalMetrics.totalSales / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600">
                  {((totalMetrics.totalSales / totalMetrics.totalTarget) * 100).toFixed(1)}% of target
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-xl sm:text-2xl font-bold">{totalMetrics.totalStaff}</p>
                <p className="text-xs text-gray-500">Across all locations</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-xl sm:text-2xl font-bold">AED {(totalMetrics.totalInventoryValue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-500">All locations</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Real-time Performance Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.filter(loc => loc.type !== 'warehouse').map((location) => (
                    <div key={location.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{location.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {((location.currentSales / location.salesTarget) * 100).toFixed(0)}%
                          </Badge>
                          {location.currentSales >= location.salesTarget ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                      <Progress
                        value={(location.currentSales / location.salesTarget) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>AED {(location.currentSales / 1000).toFixed(0)}K</span>
                        <span>Target: AED {(location.salesTarget / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Status Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {locations.map((location) => (
                    <div key={location.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getLocationTypeIcon(location.type)}
                          <span className="text-sm font-medium">{location.name}</span>
                        </div>
                        <Badge className={getLocationStatusColor(location.status)}>
                          {location.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>Manager: {location.manager}</p>
                        <p>Staff: {location.staffCount}</p>
                        {location.type !== 'warehouse' && (
                          <p>Conversion: {location.performance.conversion}%</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Inventory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {locations.map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getLocationTypeIcon(location.type)}
                        <span className="font-medium">{location.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      {location.inventory.lowStock > 0 && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <AlertTriangle className="h-4 w-4" />
                          {location.inventory.lowStock} Low Stock
                        </div>
                      )}
                      {location.inventory.outOfStock > 0 && (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          {location.inventory.outOfStock} Out of Stock
                        </div>
                      )}
                      {location.inventory.lowStock === 0 && location.inventory.outOfStock === 0 && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          All Good
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Management</CardTitle>
              <CardDescription>
                Manage all store locations and warehouse facilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="stores">Stores Only</SelectItem>
                        <SelectItem value="warehouses">Warehouses Only</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input className="pl-10" placeholder="Search locations..." />
                    </div>
                  </div>
                </div>

                {/* Locations Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Sales Target</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {getLocationTypeIcon(location.type)}
                              {location.name}
                            </div>
                            <div className="text-sm text-gray-500">{location.address}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{location.manager}</div>
                            <div className="text-sm text-gray-500">{location.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {location.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getLocationStatusColor(location.status)}>
                            {location.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{location.staffCount}</TableCell>
                        <TableCell>
                          {location.type !== 'warehouse' ? (
                            <div>
                              <div>AED {(location.salesTarget / 1000).toFixed(0)}K</div>
                              <div className="text-sm text-gray-500">
                                Current: AED {(location.currentSales / 1000).toFixed(0)}K
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {location.type !== 'warehouse' ? (
                            <div className="space-y-1">
                              <div className="text-sm">
                                Conv: {location.performance.conversion}%
                              </div>
                              <div className="text-sm text-gray-500">
                                Sat: {location.performance.customerSatisfaction}/5
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
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

        {/* Transfers Tab */}
        <TabsContent value="transfers" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Transfer Requests */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Transfer Requests</CardTitle>
                <CardDescription>
                  Manage inventory transfers between locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transferRequests.map((transfer) => (
                    <div key={transfer.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {transfer.fromLocation} → {transfer.toLocation}
                          </div>
                          <div className="text-sm text-gray-500">
                            Requested by {transfer.requestedBy} on {transfer.requestDate}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant={transfer.priority === 'high' ? 'destructive' : 'secondary'}
                          >
                            {transfer.priority}
                          </Badge>
                          <Badge
                            className={
                              transfer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              transfer.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {transfer.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Items:</div>
                        {transfer.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.product} × {item.quantity}</span>
                            <span>AED {item.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-sm text-gray-600">
                        <strong>Reason:</strong> {transfer.reason}
                      </div>

                      {transfer.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Transfer */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Transfer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>From Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>To Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Product</Label>
                  <Input placeholder="Search products..." />
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="Enter quantity" />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea placeholder="Transfer reason..." />
                </div>

                <Button className="w-full">
                  Request Transfer
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Sales Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.filter(loc => loc.type !== 'warehouse').map((location) => {
                    const achievementRate = (location.currentSales / location.salesTarget) * 100;
                    return (
                      <div key={location.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{location.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">AED {(location.currentSales / 1000).toFixed(0)}K</span>
                            <Badge
                              variant={achievementRate >= 90 ? "default" : achievementRate >= 75 ? "secondary" : "destructive"}
                            >
                              {achievementRate.toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={achievementRate} className="h-3" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Target: AED {(location.salesTarget / 1000).toFixed(0)}K</span>
                          <span>
                            {achievementRate >= 100 ? 'Target Exceeded' :
                             `AED ${((location.salesTarget - location.currentSales) / 1000).toFixed(0)}K remaining`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {totalMetrics.avgConversion.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">Avg Conversion</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {totalMetrics.totalFootfall}
                    </div>
                    <div className="text-sm text-gray-500">Total Footfall</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">
                      AED {(locations.filter(l => l.type !== 'warehouse').reduce((sum, loc) => sum + loc.performance.avgTransaction, 0) / locations.filter(l => l.type !== 'warehouse').length).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-500">Avg Transaction</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                      {(locations.filter(l => l.type !== 'warehouse').reduce((sum, loc) => sum + loc.performance.customerSatisfaction, 0) / locations.filter(l => l.type !== 'warehouse').length).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Sales Achievement</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Avg Transaction</TableHead>
                    <TableHead>Footfall</TableHead>
                    <TableHead>Satisfaction</TableHead>
                    <TableHead>Efficiency Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.filter(loc => loc.type !== 'warehouse').map((location) => {
                    const achievementRate = (location.currentSales / location.salesTarget) * 100;
                    const efficiencyScore = (
                      (achievementRate * 0.4) +
                      (location.performance.conversion * 0.3) +
                      (location.performance.customerSatisfaction * 20 * 0.3)
                    ).toFixed(0);

                    return (
                      <TableRow key={location.id}>
                        <TableCell className="font-medium">{location.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={achievementRate} className="w-20 h-2" />
                            <span className="text-sm">{achievementRate.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{location.performance.conversion}%</TableCell>
                        <TableCell>AED {location.performance.avgTransaction}</TableCell>
                        <TableCell>{location.performance.footfall}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{location.performance.customerSatisfaction}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={efficiencyScore >= 80 ? "default" : efficiencyScore >= 60 ? "secondary" : "destructive"}
                          >
                            {efficiencyScore}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Control Tab */}
        <TabsContent value="access" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Access Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Access Level Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessLevels.map((level, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{level.level}</h4>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-600">Permissions:</div>
                        <div className="flex flex-wrap gap-1">
                          {level.permissions.map((permission, permIndex) => (
                            <Badge key={permIndex} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-600">Users:</div>
                        <div className="text-sm text-gray-500">
                          {level.users.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Access Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Location Access Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Configure which users can access which locations
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Locations</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Ahmed Al-Mansouri</TableCell>
                        <TableCell>Super Admin</TableCell>
                        <TableCell>
                          <Badge variant="outline">All Locations</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-green-600">
                            <Unlock className="h-4 w-4" />
                            Active
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Fatima Al-Zahra</TableCell>
                        <TableCell>Store Manager</TableCell>
                        <TableCell>
                          <Badge variant="outline">Abu Dhabi Mall</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-green-600">
                            <Unlock className="h-4 w-4" />
                            Active
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Omar Hassan</TableCell>
                        <TableCell>Store Manager</TableCell>
                        <TableCell>
                          <Badge variant="outline">Sharjah City Centre</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-green-600">
                            <Unlock className="h-4 w-4" />
                            Active
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security & Compliance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Authentication Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Authentication</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Session Timeout (30 min)</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">IP Restriction</span>
                      <Checkbox />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Audit & Logging</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Activity Logging</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Transaction Logging</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System Access Alerts</span>
                      <Checkbox defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Global Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Global System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="AED">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select defaultValue="uae">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uae">UAE Standard Time (GMT+4)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>VAT Rate (%)</Label>
                  <Input type="number" defaultValue="5" />
                </div>
              </CardContent>
            </Card>

            {/* Sync & Backup Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Synchronization & Backup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto Sync Every 15 Minutes</span>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real-time Inventory Updates</span>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Backup</span>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cloud Sync</span>
                    <Checkbox defaultChecked />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Inventory Alerts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Stock Alerts</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Out of Stock Alerts</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Transfer Requests</span>
                      <Checkbox defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Sales Alerts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily Sales Summary</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Target Achievement</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Large Transactions</span>
                      <Checkbox />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">System Alerts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System Errors</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Security Events</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Maintenance Updates</span>
                      <Checkbox />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiLocationManagement;