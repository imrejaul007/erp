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
import { Progress } from "@/components/ui/progress";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Settings,
  RefreshCw,
  Upload,
  BarChart3,
  PieChart,
  ExternalLink,
  MapPin,
  CreditCard,
  Truck,
  Bell,
  Calendar,
  FileText,
  Target,
  Zap,
  Globe,
  Shield,
  Award
} from 'lucide-react';

const MarketplacePage = () => {
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedMarketplaceDetail, setSelectedMarketplaceDetail] = useState(null);

  // Sample marketplace data
  const marketplaces = [
    {
      id: 'amazon-uae',
      name: 'Amazon UAE',
      logo: '/logos/amazon.png',
      description: 'Leading e-commerce marketplace in the UAE',
      status: 'connected',
      region: 'UAE',
      category: 'General Marketplace',
      integrationDate: '2024-01-10',
      lastSync: '2024-01-15 14:20:00',
      commission: 15,
      products: 1234,
      activeProducts: 1187,
      orders: 836,
      revenue: 372260,
      fees: 55839,
      rating: 4.3,
      reviews: 2847,
      fulfillmentType: 'FBA',
      currency: 'AED',
      features: ['FBA', 'Prime', 'A+ Content', 'Sponsored Products'],
      requirements: ['Business License', 'VAT Registration', 'Bank Account'],
      apiStatus: 'healthy',
      compliance: 95
    },
    {
      id: 'noon',
      name: 'Noon.com',
      logo: '/logos/noon.png',
      description: 'Middle East\'s leading online marketplace',
      status: 'connected',
      region: 'MENA',
      category: 'Regional Marketplace',
      integrationDate: '2024-01-12',
      lastSync: '2024-01-15 14:22:00',
      commission: 12,
      products: 987,
      activeProducts: 945,
      orders: 630,
      revenue: 267750,
      fees: 32130,
      rating: 4.5,
      reviews: 1876,
      fulfillmentType: 'Seller',
      currency: 'AED',
      features: ['Express Delivery', 'Noon Minutes', 'Noon East', 'Flash Sales'],
      requirements: ['Trade License', 'VAT Certificate', 'Product Catalog'],
      apiStatus: 'healthy',
      compliance: 98
    },
    {
      id: 'dubizzle',
      name: 'Dubizzle Market',
      logo: '/logos/dubizzle.png',
      description: 'UAE\'s largest classified marketplace',
      status: 'pending',
      region: 'UAE',
      category: 'Classified Marketplace',
      integrationDate: null,
      lastSync: null,
      commission: 8,
      products: 0,
      activeProducts: 0,
      orders: 0,
      revenue: 0,
      fees: 0,
      rating: 0,
      reviews: 0,
      fulfillmentType: 'Seller',
      currency: 'AED',
      features: ['Buy Now', 'Secure Payment', 'Delivery', 'Warranty'],
      requirements: ['Business Account', 'Product Photos', 'Description'],
      apiStatus: 'pending',
      compliance: 0
    },
    {
      id: 'carrefour',
      name: 'Carrefour Marketplace',
      logo: '/logos/carrefour.png',
      description: 'Leading retail marketplace in the region',
      status: 'review',
      region: 'MENA',
      category: 'Retail Marketplace',
      integrationDate: '2024-01-14',
      lastSync: '2024-01-15 13:45:00',
      commission: 10,
      products: 456,
      activeProducts: 423,
      orders: 234,
      revenue: 89560,
      fees: 8956,
      rating: 4.1,
      reviews: 567,
      fulfillmentType: 'Hybrid',
      currency: 'AED',
      features: ['Carrefour Delivery', 'Click & Collect', 'My Club', 'Offers'],
      requirements: ['Vendor Agreement', 'Product Certification', 'Quality Standards'],
      apiStatus: 'warning',
      compliance: 85
    },
    {
      id: 'talabat-mart',
      name: 'Talabat Mart',
      logo: '/logos/talabat.png',
      description: 'Quick commerce and grocery marketplace',
      status: 'inactive',
      region: 'MENA',
      category: 'Quick Commerce',
      integrationDate: '2024-01-05',
      lastSync: '2024-01-13 10:30:00',
      commission: 18,
      products: 123,
      activeProducts: 89,
      orders: 45,
      revenue: 12340,
      fees: 2221,
      rating: 3.8,
      reviews: 156,
      fulfillmentType: 'Platform',
      currency: 'AED',
      features: ['Quick Delivery', 'Fresh Products', 'Bulk Orders', '24/7 Support'],
      requirements: ['Food License', 'Cold Chain', 'Fresh Products'],
      apiStatus: 'error',
      compliance: 65
    },
    {
      id: 'awok',
      name: 'Awok.com',
      logo: '/logos/awok.png',
      description: 'Premium lifestyle marketplace',
      status: 'available',
      region: 'UAE',
      category: 'Luxury Marketplace',
      integrationDate: null,
      lastSync: null,
      commission: 20,
      products: 0,
      activeProducts: 0,
      orders: 0,
      revenue: 0,
      fees: 0,
      rating: 0,
      reviews: 0,
      fulfillmentType: 'Concierge',
      currency: 'AED',
      features: ['White Glove Service', 'Premium Packaging', 'Personal Shopper', 'VIP Support'],
      requirements: ['Premium Brand', 'High-End Products', 'Luxury Standards'],
      apiStatus: 'available',
      compliance: 0
    }
  ];

  const ordersByMarketplace = [
    {
      marketplace: 'amazon-uae',
      orders: [
        {
          id: 'AMZ-001',
          orderId: 'AMZ-2024-001',
          customer: 'Ahmed Al-Mansouri',
          items: 2,
          total: 1450,
          status: 'shipped',
          date: '2024-01-15 10:30:00',
          fulfillment: 'FBA'
        },
        {
          id: 'AMZ-002',
          orderId: 'AMZ-2024-002',
          customer: 'Sarah Johnson',
          items: 1,
          total: 920,
          status: 'processing',
          date: '2024-01-15 14:20:00',
          fulfillment: 'FBM'
        }
      ]
    },
    {
      marketplace: 'noon',
      orders: [
        {
          id: 'NOON-001',
          orderId: 'NOON-2024-001',
          customer: 'Fatima Hassan',
          items: 3,
          total: 2100,
          status: 'delivered',
          date: '2024-01-14 16:45:00',
          fulfillment: 'Seller'
        }
      ]
    }
  ];

  const marketplaceMetrics = {
    totalRevenue: 741570,
    totalOrders: 1745,
    totalFees: 96925,
    averageCommission: 13.2,
    topPerformer: 'Amazon UAE',
    growthRate: 18.5
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'available': return 'bg-purple-100 text-purple-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
      case 'inactive': return <WifiOff className="h-4 w-4" />;
      case 'available': return <Plus className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getApiStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleConnect = (marketplace: any) => {
    setSelectedMarketplaceDetail(marketplace);
    setConnectDialogOpen(true);
  };

  const connectedMarketplaces = marketplaces.filter(m => m.status === 'connected');
  const availableMarketplaces = marketplaces.filter(m => m.status === 'available');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Integration</h1>
          <p className="text-gray-600">Connect and manage multiple marketplace channels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Connect New
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">AED {(marketplaceMetrics.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600">+{marketplaceMetrics.growthRate}% vs last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{marketplaceMetrics.totalOrders}</p>
                <p className="text-xs text-blue-600">Across all platforms</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected Platforms</p>
                <p className="text-2xl font-bold">{connectedMarketplaces.length}</p>
                <p className="text-xs text-purple-600">Active integrations</p>
              </div>
              <Wifi className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Commission</p>
                <p className="text-2xl font-bold">{marketplaceMetrics.averageCommission}%</p>
                <p className="text-xs text-orange-600">Platform fees</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Connected Marketplaces Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Connected Marketplaces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedMarketplaces.map((marketplace) => (
                    <div key={marketplace.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{marketplace.name}</div>
                          <div className="text-sm text-gray-500">{marketplace.products} products</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">AED {(marketplace.revenue / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-gray-500">{marketplace.orders} orders</div>
                        <div className={`text-xs flex items-center gap-1 ${getApiStatusColor(marketplace.apiStatus)}`}>
                          <Wifi className="h-3 w-3" />
                          {marketplace.apiStatus}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedMarketplaces.map((marketplace) => {
                    const revenuePercentage = (marketplace.revenue / marketplaceMetrics.totalRevenue) * 100;
                    return (
                      <div key={marketplace.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{marketplace.name}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{revenuePercentage.toFixed(1)}%</div>
                            <div className="text-xs text-gray-500">
                              <Star className="h-3 w-3 inline mr-1" />
                              {marketplace.rating}/5
                            </div>
                          </div>
                        </div>
                        <Progress value={revenuePercentage} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Commission: {marketplace.commission}%</span>
                          <span>Compliance: {marketplace.compliance}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <RefreshCw className="h-6 w-6" />
                  <span className="text-xs">Sync Products</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Bulk Upload</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-xs">Performance</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  <span className="text-xs">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connected Tab */}
        <TabsContent value="connected" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Marketplaces</CardTitle>
              <CardDescription>
                Manage your active marketplace integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectedMarketplaces.map((marketplace) => (
                  <Card key={marketplace.id}>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{marketplace.name}</h4>
                              <p className="text-xs text-gray-500">{marketplace.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {marketplace.region}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {marketplace.fulfillmentType}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(marketplace.status)}>
                            {getStatusIcon(marketplace.status)}
                            <span className="ml-1">{marketplace.status}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Products:</span>
                              <span className="font-medium">{marketplace.products}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Orders:</span>
                              <span className="font-medium">{marketplace.orders}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Commission:</span>
                              <span className="font-medium">{marketplace.commission}%</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Revenue:</span>
                              <span className="font-medium">AED {(marketplace.revenue / 1000).toFixed(0)}K</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Rating:</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="font-medium">{marketplace.rating}/5</span>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Compliance:</span>
                              <span className="font-medium">{marketplace.compliance}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">API Status:</div>
                          <div className={`flex items-center gap-2 text-sm ${getApiStatusColor(marketplace.apiStatus)}`}>
                            <Wifi className="h-4 w-4" />
                            <span>{marketplace.apiStatus}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              Last sync: {marketplace.lastSync}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {marketplace.features.slice(0, 3).map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {marketplace.features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{marketplace.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Sync
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

        {/* Available Tab */}
        <TabsContent value="available" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Marketplaces</CardTitle>
              <CardDescription>
                Discover and connect to new marketplace opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableMarketplaces.map((marketplace) => (
                  <Card key={marketplace.id} className="relative">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{marketplace.name}</h4>
                              <p className="text-xs text-gray-500">{marketplace.description}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(marketplace.status)}>
                            Available
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Commission:</span>
                            <span className="font-medium">{marketplace.commission}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Region:</span>
                            <span className="font-medium">{marketplace.region}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Category:</span>
                            <span className="font-medium">{marketplace.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Fulfillment:</span>
                            <span className="font-medium">{marketplace.fulfillmentType}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Key Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {marketplace.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Requirements:</div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {marketplace.requirements.map((req, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => handleConnect(marketplace)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Connect Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Marketplace Orders</CardTitle>
                  <CardDescription>
                    Orders from all connected marketplaces
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Marketplaces</SelectItem>
                      {connectedMarketplaces.map((marketplace) => (
                        <SelectItem key={marketplace.id} value={marketplace.id}>
                          {marketplace.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input className="pl-10 w-64" placeholder="Search orders..." />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Marketplace</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersByMarketplace.flatMap(mp =>
                    mp.orders.map(order => {
                      const marketplace = marketplaces.find(m => m.id === mp.marketplace);
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderId}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              <span className="text-sm">{marketplace?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell className="font-medium">AED {order.total}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {order.fulfillment}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Marketplace */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Revenue by Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedMarketplaces.map((marketplace) => {
                    const percentage = (marketplace.revenue / marketplaceMetrics.totalRevenue) * 100;
                    return (
                      <div key={marketplace.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{marketplace.name}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">AED {(marketplace.revenue / 1000).toFixed(0)}K</div>
                            <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-3" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Commission Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Commission Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedMarketplaces.map((marketplace) => {
                    const commissionAmount = (marketplace.revenue * marketplace.commission) / 100;
                    const netRevenue = marketplace.revenue - commissionAmount;
                    return (
                      <div key={marketplace.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{marketplace.name}</span>
                          <span className="text-sm text-gray-500">{marketplace.commission}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-gray-500">Gross Revenue</div>
                            <div className="font-medium">AED {marketplace.revenue.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Commission</div>
                            <div className="font-medium text-red-600">-AED {commissionAmount.toLocaleString()}</div>
                          </div>
                          <div className="col-span-2 pt-2 border-t">
                            <div className="text-gray-500">Net Revenue</div>
                            <div className="font-medium text-green-600">AED {netRevenue.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    AED {((marketplaceMetrics.totalRevenue - marketplaceMetrics.totalFees) / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-gray-500">Net Revenue</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    AED {(marketplaceMetrics.totalFees / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-gray-500">Total Fees</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    AED {Math.round(marketplaceMetrics.totalRevenue / marketplaceMetrics.totalOrders)}
                  </div>
                  <div className="text-sm text-gray-500">Avg Order Value</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {((marketplaceMetrics.totalRevenue - marketplaceMetrics.totalFees) / marketplaceMetrics.totalRevenue * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">Profit Margin</div>
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
                <CardTitle>Global Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto Sync Products</div>
                    <div className="text-sm text-gray-500">Automatically sync product changes</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Inventory Sync</div>
                    <div className="text-sm text-gray-500">Real-time inventory updates</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Price Sync</div>
                    <div className="text-sm text-gray-500">Sync price changes across platforms</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Order Notifications</div>
                    <div className="text-sm text-gray-500">Real-time order alerts</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectedMarketplaces.map((marketplace) => (
                  <div key={marketplace.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        marketplace.apiStatus === 'healthy' ? 'bg-green-500' :
                        marketplace.apiStatus === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium">{marketplace.name}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${getApiStatusColor(marketplace.apiStatus)}`}>
                        {marketplace.apiStatus}
                      </div>
                      <div className="text-xs text-gray-500">
                        {marketplace.compliance}% compliant
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Marketplace Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="AED">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <Select defaultValue="15min">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real-time">Real-time</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Order Processing Time (hours)</Label>
                  <Input type="number" defaultValue="2" min="1" max="24" />
                </div>
                <div className="space-y-2">
                  <Label>Low Stock Threshold</Label>
                  <Input type="number" defaultValue="10" min="1" max="100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Connect Marketplace Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Connect to {selectedMarketplaceDetail?.name}</DialogTitle>
            <DialogDescription>
              Set up integration with {selectedMarketplaceDetail?.name} marketplace
            </DialogDescription>
          </DialogHeader>
          {selectedMarketplaceDetail && (
            <div className="space-y-6">
              {/* Marketplace Info */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedMarketplaceDetail.name}</h4>
                    <p className="text-sm text-gray-500">{selectedMarketplaceDetail.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Commission:</span>
                    <span className="font-medium ml-2">{selectedMarketplaceDetail.commission}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Region:</span>
                    <span className="font-medium ml-2">{selectedMarketplaceDetail.region}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium ml-2">{selectedMarketplaceDetail.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Fulfillment:</span>
                    <span className="font-medium ml-2">{selectedMarketplaceDetail.fulfillmentType}</span>
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div>
                <h4 className="font-medium mb-3">Requirements Checklist</h4>
                <div className="space-y-2">
                  {selectedMarketplaceDetail.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 border rounded">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium">API Configuration</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter your API key" />
                  </div>
                  <div className="space-y-2">
                    <Label>Secret Key</Label>
                    <Input type="password" placeholder="Enter your secret key" />
                  </div>
                  <div className="space-y-2">
                    <Label>Seller ID</Label>
                    <Input placeholder="Enter your seller ID" />
                  </div>
                  <div className="space-y-2">
                    <Label>Store Name</Label>
                    <Input placeholder="Enter your store name" />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-medium mb-3">Available Features</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMarketplaceDetail.features.map((feature) => (
                    <Badge key={feature} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button>
              <Wifi className="h-4 w-4 mr-2" />
              Connect Marketplace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketplacePage;