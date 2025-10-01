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
import { Switch } from "@/components/ui/switch";
import {
  Globe,
  ShoppingCart,
  Smartphone,
  Monitor,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  MessageSquare,
  Share2,
  Gift,
  Zap,
  Settings,
  Plus,
  Edit,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  RefreshCw,
  Filter,
  Search,
  Download,
  Upload,
  ExternalLink,
  Link,
  Wifi,
  WifiOff,
  Bell,
  Calendar,
  Tag,
  Percent
} from 'lucide-react';

const EcommerceOmnichannel = () => {
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample omnichannel data
  const channels = [
    {
      id: 'website',
      name: 'Official Website',
      type: 'ecommerce',
      status: 'active',
      platform: 'Custom Platform',
      url: 'https://oudpms.ae',
      monthlyVisitors: 25000,
      conversionRate: 3.2,
      avgOrderValue: 485,
      revenue: 387500,
      orders: 798,
      integration: 'native',
      lastSync: '2024-01-15 14:30:00'
    },
    {
      id: 'instagram',
      name: 'Instagram Shop',
      type: 'social',
      status: 'active',
      platform: 'Instagram',
      url: '@oudpms_uae',
      monthlyVisitors: 45000,
      conversionRate: 2.1,
      avgOrderValue: 320,
      revenue: 302400,
      orders: 945,
      integration: 'meta',
      lastSync: '2024-01-15 14:25:00'
    },
    {
      id: 'facebook',
      name: 'Facebook Shop',
      type: 'social',
      status: 'active',
      platform: 'Facebook',
      url: 'facebook.com/oudpms',
      monthlyVisitors: 32000,
      conversionRate: 1.8,
      avgOrderValue: 395,
      revenue: 227520,
      orders: 576,
      integration: 'meta',
      lastSync: '2024-01-15 14:25:00'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      type: 'messaging',
      status: 'active',
      platform: 'WhatsApp',
      url: '+971-50-XXX-XXXX',
      monthlyVisitors: 18000,
      conversionRate: 15.5,
      avgOrderValue: 680,
      revenue: 189720,
      orders: 279,
      integration: 'api',
      lastSync: '2024-01-15 14:28:00'
    },
    {
      id: 'noon',
      name: 'Noon Marketplace',
      type: 'marketplace',
      status: 'active',
      platform: 'Noon',
      url: 'noon.com/uae/oudpms',
      monthlyVisitors: 15000,
      conversionRate: 4.2,
      avgOrderValue: 425,
      revenue: 267750,
      orders: 630,
      integration: 'api',
      lastSync: '2024-01-15 14:22:00'
    },
    {
      id: 'amazon',
      name: 'Amazon UAE',
      type: 'marketplace',
      status: 'active',
      platform: 'Amazon',
      url: 'amazon.ae/oudpms',
      monthlyVisitors: 22000,
      conversionRate: 3.8,
      avgOrderValue: 445,
      revenue: 372260,
      orders: 836,
      integration: 'api',
      lastSync: '2024-01-15 14:20:00'
    },
    {
      id: 'app',
      name: 'Mobile App',
      type: 'mobile',
      status: 'development',
      platform: 'iOS/Android',
      url: 'Coming Soon',
      monthlyVisitors: 0,
      conversionRate: 0,
      avgOrderValue: 0,
      revenue: 0,
      orders: 0,
      integration: 'native',
      lastSync: null
    }
  ];

  const omniOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'Ahmed Al-Mansouri',
      channel: 'website',
      status: 'processing',
      total: 1250,
      items: 3,
      orderDate: '2024-01-15 13:45:00',
      shippingMethod: 'express',
      paymentMethod: 'card',
      location: 'Dubai'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Fatima Hassan',
      channel: 'instagram',
      status: 'shipped',
      total: 385,
      items: 2,
      orderDate: '2024-01-15 11:20:00',
      shippingMethod: 'standard',
      paymentMethod: 'cod',
      location: 'Abu Dhabi'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Omar Al-Rashid',
      channel: 'whatsapp',
      status: 'delivered',
      total: 750,
      items: 1,
      orderDate: '2024-01-14 16:30:00',
      shippingMethod: 'pickup',
      paymentMethod: 'transfer',
      location: 'Sharjah'
    },
    {
      id: 'ORD-2024-004',
      customer: 'Sarah Johnson',
      channel: 'noon',
      status: 'pending',
      total: 520,
      items: 4,
      orderDate: '2024-01-15 09:15:00',
      shippingMethod: 'standard',
      paymentMethod: 'card',
      location: 'Al Ain'
    }
  ];

  const socialCampaigns = [
    {
      id: 'camp001',
      name: 'Royal Oud Collection Launch',
      channels: ['instagram', 'facebook'],
      type: 'product_launch',
      status: 'active',
      budget: 15000,
      spent: 8750,
      impressions: 245000,
      clicks: 7350,
      conversions: 156,
      revenue: 62400,
      startDate: '2024-01-10',
      endDate: '2024-01-25'
    },
    {
      id: 'camp002',
      name: 'Weekend Sale - 20% Off',
      channels: ['website', 'whatsapp'],
      type: 'promotion',
      status: 'scheduled',
      budget: 8000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      startDate: '2024-01-20',
      endDate: '2024-01-22'
    }
  ];

  const customerJourney = [
    {
      stage: 'Awareness',
      channels: ['Instagram', 'Facebook', 'Google Ads'],
      touchpoints: 15200,
      conversionRate: 8.5,
      avgTime: '45 seconds'
    },
    {
      stage: 'Consideration',
      channels: ['Website', 'WhatsApp', 'Store Visit'],
      touchpoints: 1292,
      conversionRate: 35.2,
      avgTime: '8 minutes'
    },
    {
      stage: 'Purchase',
      channels: ['Website', 'Store', 'Phone'],
      touchpoints: 455,
      conversionRate: 68.1,
      avgTime: '12 minutes'
    },
    {
      stage: 'Retention',
      channels: ['Email', 'WhatsApp', 'Loyalty Program'],
      touchpoints: 310,
      conversionRate: 42.3,
      avgTime: '3 minutes'
    }
  ];

  const getChannelIcon = (type) => {
    switch (type) {
      case 'ecommerce': return <Globe className="h-4 w-4" />;
      case 'social': return <Share2 className="h-4 w-4" />;
      case 'messaging': return <MessageSquare className="h-4 w-4" />;
      case 'marketplace': return <ShoppingCart className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalMetrics = () => {
    const activeChannels = channels.filter(ch => ch.status === 'active');
    return {
      totalRevenue: activeChannels.reduce((sum, ch) => sum + ch.revenue, 0),
      totalOrders: activeChannels.reduce((sum, ch) => sum + ch.orders, 0),
      totalVisitors: activeChannels.reduce((sum, ch) => sum + ch.monthlyVisitors, 0),
      avgConversion: activeChannels.reduce((sum, ch) => sum + ch.conversionRate, 0) / activeChannels.length
    };
  };

  const totalMetrics = calculateTotalMetrics();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-commerce & Omni-channel</h1>
          <p className="text-gray-600">Unified management across all sales channels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Dialog open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Marketing Campaign</DialogTitle>
                <DialogDescription>
                  Launch a new omni-channel marketing campaign
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input id="campaignName" placeholder="Enter campaign name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignType">Campaign Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product_launch">Product Launch</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="retention">Retention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (AED)</Label>
                  <Input id="budget" type="number" placeholder="Campaign budget" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Target Channels</Label>
                  <div className="flex flex-wrap gap-2">
                    {channels.filter(ch => ch.status === 'active').map((channel) => (
                      <label key={channel.id} className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">{channel.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCampaignModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCampaignModalOpen(false)}>
                  Create Campaign
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">AED {(totalMetrics.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600">+12.5% vs last month</p>
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
                <p className="text-2xl font-bold">{totalMetrics.totalOrders}</p>
                <p className="text-xs text-blue-600">Across {channels.filter(ch => ch.status === 'active').length} channels</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold">{(totalMetrics.totalVisitors / 1000).toFixed(0)}K</p>
                <p className="text-xs text-purple-600">Monthly traffic</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
                <p className="text-2xl font-bold">{totalMetrics.avgConversion.toFixed(1)}%</p>
                <p className="text-xs text-orange-600">All channels</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Channel Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channels.filter(ch => ch.status === 'active').map((channel) => (
                    <div key={channel.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel.type)}
                          <span className="text-sm font-medium">{channel.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">AED {(channel.revenue / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-500">{channel.orders} orders</div>
                        </div>
                      </div>
                      <Progress
                        value={(channel.revenue / Math.max(...channels.map(ch => ch.revenue))) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Conversion: {channel.conversionRate}%</span>
                        <span>AOV: AED {channel.avgOrderValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {omniOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channels.find(ch => ch.id === order.channel)?.type)}
                          <div>
                            <div className="text-sm font-medium">{order.id}</div>
                            <div className="text-xs text-gray-500">{order.customer}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">AED {order.total}</div>
                        <Badge className={getStatusColor(order.status)} variant="outline">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialCampaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <div className="text-sm text-gray-500 capitalize">
                          {campaign.type.replace('_', ' ')}
                        </div>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budget Progress</span>
                        <span>AED {campaign.spent} / {campaign.budget}</span>
                      </div>
                      <Progress
                        value={(campaign.spent / campaign.budget) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-sm font-medium">{(campaign.impressions / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-gray-500">Impressions</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{campaign.clicks}</div>
                        <div className="text-xs text-gray-500">Clicks</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{campaign.conversions}</div>
                        <div className="text-xs text-gray-500">Conversions</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {campaign.channels.map((channel) => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channels.find(ch => ch.id === channel)?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Management</CardTitle>
              <CardDescription>
                Monitor and manage all sales channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Channels</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="marketplace">Marketplaces</SelectItem>
                        <SelectItem value="messaging">Messaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input className="pl-10" placeholder="Search channels..." />
                    </div>
                  </div>
                </div>

                {/* Channels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {channels.map((channel) => (
                    <Card key={channel.id} className="relative">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {getChannelIcon(channel.type)}
                              <div>
                                <h4 className="font-medium">{channel.name}</h4>
                                <p className="text-xs text-gray-500">{channel.platform}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(channel.status)}>
                              {channel.status}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Revenue</span>
                              <span className="font-medium">AED {(channel.revenue / 1000).toFixed(0)}K</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Orders</span>
                              <span className="font-medium">{channel.orders}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Conversion</span>
                              <span className="font-medium">{channel.conversionRate}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>AOV</span>
                              <span className="font-medium">AED {channel.avgOrderValue}</span>
                            </div>
                          </div>

                          {channel.status === 'active' && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Wifi className="h-3 w-3 text-green-600" />
                              Last sync: {channel.lastSync}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Settings className="h-4 w-4 mr-1" />
                              Config
                            </Button>
                          </div>

                          {channel.url !== 'Coming Soon' && (
                            <div className="text-xs text-blue-600 truncate">
                              <ExternalLink className="h-3 w-3 inline mr-1" />
                              {channel.url}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Omni-channel Orders</CardTitle>
              <CardDescription>
                Unified order management across all channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Filters */}
                <div className="flex gap-4 items-center">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      {channels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input className="pl-10" placeholder="Search orders..." />
                    </div>
                  </div>
                </div>

                {/* Orders Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {omniOrders.map((order) => {
                      const channel = channels.find(ch => ch.id === order.channel);
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer}</div>
                              <div className="text-sm text-gray-500">{order.location}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getChannelIcon(channel?.type)}
                              <span className="text-sm">{channel?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell className="font-medium">AED {order.total}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString()}
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
                                <Truck className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Campaigns */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Marketing Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <div className="text-sm text-gray-500">
                            {campaign.startDate} to {campaign.endDate}
                          </div>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">{(campaign.impressions / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-500">Impressions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{campaign.clicks}</div>
                          <div className="text-xs text-gray-500">Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{campaign.conversions}</div>
                          <div className="text-xs text-gray-500">Conversions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">AED {(campaign.revenue / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-500">Revenue</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget Utilization</span>
                          <span>AED {campaign.spent} / {campaign.budget}</span>
                        </div>
                        <Progress
                          value={(campaign.spent / campaign.budget) * 100}
                          className="h-2"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {campaign.channels.map((channelId) => {
                            const channel = channels.find(ch => ch.id === channelId);
                            return (
                              <Badge key={channelId} variant="outline" className="text-xs">
                                {channel?.name}
                              </Badge>
                            );
                          })}
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Creation */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input placeholder="Enter campaign name" />
                </div>

                <div className="space-y-2">
                  <Label>Campaign Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flash_sale">Flash Sale</SelectItem>
                      <SelectItem value="new_arrival">New Arrival</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="clearance">Clearance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Channels</Label>
                  <div className="space-y-2">
                    {channels.filter(ch => ch.status === 'active').slice(0, 4).map((channel) => (
                      <div key={channel.id} className="flex items-center space-x-2">
                        <Checkbox id={channel.id} />
                        <Label htmlFor={channel.id} className="text-sm">
                          {channel.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Budget (AED)</Label>
                  <Input type="number" placeholder="Campaign budget" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" />
                  </div>
                </div>

                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Launch Campaign
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Journey Tab */}
        <TabsContent value="journey" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Journey Analytics
              </CardTitle>
              <CardDescription>
                Track customer interactions across all touchpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Journey Stages */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {customerJourney.map((stage, index) => (
                    <div key={stage.stage} className="relative">
                      <Card className="text-center">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">{stage.stage}</h4>
                            <div className="text-2xl font-bold text-blue-600">
                              {stage.touchpoints}
                            </div>
                            <div className="text-sm text-gray-500">Touchpoints</div>
                            <div className="text-sm">
                              <span className="font-medium">{stage.conversionRate}%</span> conversion
                            </div>
                            <div className="text-xs text-gray-500">
                              Avg time: {stage.avgTime}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      {index < customerJourney.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                          <div className="w-4 h-0.5 bg-gray-300"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Channel Contribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Channel Attribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {channels.filter(ch => ch.status === 'active').map((channel) => {
                          const contribution = (channel.orders / totalMetrics.totalOrders) * 100;
                          return (
                            <div key={channel.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  {getChannelIcon(channel.type)}
                                  <span className="text-sm font-medium">{channel.name}</span>
                                </div>
                                <span className="text-sm">{contribution.toFixed(1)}%</span>
                              </div>
                              <Progress value={contribution} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Website Visitors</span>
                            <span className="text-sm font-medium">25,000</span>
                          </div>
                          <Progress value={100} className="h-3" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Product Views</span>
                            <span className="text-sm font-medium">8,750</span>
                          </div>
                          <Progress value={35} className="h-3" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Add to Cart</span>
                            <span className="text-sm font-medium">2,625</span>
                          </div>
                          <Progress value={10.5} className="h-3" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Checkout Started</span>
                            <span className="text-sm font-medium">1,050</span>
                          </div>
                          <Progress value={4.2} className="h-3" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Purchase Completed</span>
                            <span className="text-sm font-medium">798</span>
                          </div>
                          <Progress value={3.2} className="h-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue by Channel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channels.filter(ch => ch.status === 'active').map((channel) => {
                    const percentage = (channel.revenue / totalMetrics.totalRevenue) * 100;
                    return (
                      <div key={channel.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {getChannelIcon(channel.type)}
                            <span className="text-sm font-medium">{channel.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">AED {(channel.revenue / 1000).toFixed(0)}K</div>
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

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Key Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      AED {((totalMetrics.totalRevenue / totalMetrics.totalOrders) || 0).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-500">Average Order Value</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalMetrics.avgConversion.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">Overall Conversion</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(totalMetrics.totalVisitors / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-gray-500">Monthly Visitors</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {channels.filter(ch => ch.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-500">Active Channels</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Channel Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead>Visitors</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Conversion %</TableHead>
                    <TableHead>AOV</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Revenue %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channels.filter(ch => ch.status === 'active').map((channel) => {
                    const revenuePercentage = (channel.revenue / totalMetrics.totalRevenue) * 100;
                    return (
                      <TableRow key={channel.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getChannelIcon(channel.type)}
                            <span className="font-medium">{channel.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{channel.monthlyVisitors.toLocaleString()}</TableCell>
                        <TableCell>{channel.orders}</TableCell>
                        <TableCell>{channel.conversionRate}%</TableCell>
                        <TableCell>AED {channel.avgOrderValue}</TableCell>
                        <TableCell className="font-medium">
                          AED {(channel.revenue / 1000).toFixed(0)}K
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={revenuePercentage} className="w-16 h-2" />
                            <span className="text-sm">{revenuePercentage.toFixed(1)}%</span>
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

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Integration Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto Inventory Sync</div>
                      <div className="text-sm text-gray-500">Sync inventory across all channels</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Price Synchronization</div>
                      <div className="text-sm text-gray-500">Keep prices updated across channels</div>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Customer Data Sync</div>
                      <div className="text-sm text-gray-500">Unify customer profiles</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>WhatsApp Business API</Label>
                    <Input placeholder="Enter API key" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook/Instagram API</Label>
                    <Input placeholder="Enter access token" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Amazon MWS Key</Label>
                    <Input placeholder="Enter MWS key" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Noon API Credentials</Label>
                    <Input placeholder="Enter API credentials" type="password" />
                  </div>
                </div>
                <Button className="w-full">
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Automation Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>
                Configure automated actions across channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Inventory Management</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-disable out-of-stock items</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Low stock alerts</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Price adjustment sync</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Order Processing</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto order confirmation</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Shipping notifications</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Review request emails</span>
                        <Switch />
                      </div>
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

export default EcommerceOmnichannel;