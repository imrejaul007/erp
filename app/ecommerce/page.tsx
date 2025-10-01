'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  ShoppingCart,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Package,
  Eye,
  RefreshCw,
  Plus,
  Settings,
  BarChart3,
  Share2,
  MessageSquare,
  Instagram,
  Facebook,
  ExternalLink,
  Truck,
  CreditCard,
  Star,
  Heart,
  Download,
  Upload,
  Filter,
  Search,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const EcommercePage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');

  // Sample e-commerce metrics
  const ecommerceMetrics = {
    totalRevenue: 1847650,
    totalOrders: 4063,
    onlineVisitors: 135000,
    conversionRate: 3.8,
    trends: {
      revenue: +18.5,
      orders: +12.3,
      visitors: +25.4,
      conversion: +5.2
    }
  };

  const channelPerformance = [
    {
      id: 'website',
      name: 'Official Website',
      platform: 'Custom Platform',
      revenue: 387500,
      orders: 798,
      visitors: 25000,
      conversion: 3.2,
      status: 'active',
      icon: Globe
    },
    {
      id: 'instagram',
      name: 'Instagram Shop',
      platform: 'Instagram Business',
      revenue: 302400,
      orders: 945,
      visitors: 45000,
      conversion: 2.1,
      status: 'active',
      icon: Instagram
    },
    {
      id: 'facebook',
      name: 'Facebook Shop',
      platform: 'Facebook Commerce',
      revenue: 227520,
      orders: 576,
      visitors: 32000,
      conversion: 1.8,
      status: 'active',
      icon: Facebook
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      platform: 'WhatsApp API',
      revenue: 189720,
      orders: 279,
      visitors: 18000,
      conversion: 15.5,
      status: 'active',
      icon: MessageSquare
    },
    {
      id: 'amazon',
      name: 'Amazon UAE',
      platform: 'Amazon Marketplace',
      revenue: 372260,
      orders: 836,
      visitors: 22000,
      conversion: 3.8,
      status: 'active',
      icon: Package
    },
    {
      id: 'noon',
      name: 'Noon Marketplace',
      platform: 'Noon.com',
      revenue: 267750,
      orders: 630,
      visitors: 15000,
      conversion: 4.2,
      status: 'active',
      icon: ShoppingCart
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'Ahmed Al-Mansouri',
      channel: 'Website',
      total: 1250,
      status: 'processing',
      date: '2024-01-15 13:45:00',
      items: 3
    },
    {
      id: 'ORD-2024-002',
      customer: 'Fatima Hassan',
      channel: 'Instagram',
      total: 385,
      status: 'shipped',
      date: '2024-01-15 11:20:00',
      items: 2
    },
    {
      id: 'ORD-2024-003',
      customer: 'Omar Al-Rashid',
      channel: 'WhatsApp',
      total: 750,
      status: 'delivered',
      date: '2024-01-14 16:30:00',
      items: 1
    },
    {
      id: 'ORD-2024-004',
      customer: 'Sarah Johnson',
      channel: 'Amazon UAE',
      total: 520,
      status: 'pending',
      date: '2024-01-15 09:15:00',
      items: 4
    }
  ];

  const integrationStatus = [
    {
      service: 'Payment Gateway',
      provider: 'PayTabs',
      status: 'connected',
      lastSync: '2024-01-15 14:30:00'
    },
    {
      service: 'Shipping',
      provider: 'Aramex',
      status: 'connected',
      lastSync: '2024-01-15 14:25:00'
    },
    {
      service: 'WhatsApp API',
      provider: 'Twilio',
      status: 'connected',
      lastSync: '2024-01-15 14:28:00'
    },
    {
      service: 'Instagram API',
      provider: 'Meta Business',
      status: 'warning',
      lastSync: '2024-01-14 10:15:00'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing':
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'processing':
      case 'shipped': return <Clock className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-commerce & Omni-channel</h1>
          <p className="text-gray-600">Manage online sales channels and digital commerce</p>
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
            Add Channel
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
                <p className="text-2xl font-bold">AED {(ecommerceMetrics.totalRevenue / 1000).toFixed(0)}K</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(ecommerceMetrics.trends.revenue)}`}>
                  {getTrendIcon(ecommerceMetrics.trends.revenue)}
                  {Math.abs(ecommerceMetrics.trends.revenue)}% vs last period
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
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{ecommerceMetrics.totalOrders.toLocaleString()}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(ecommerceMetrics.trends.orders)}`}>
                  {getTrendIcon(ecommerceMetrics.trends.orders)}
                  {Math.abs(ecommerceMetrics.trends.orders)}% vs last period
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
                <p className="text-sm font-medium text-gray-600">Online Visitors</p>
                <p className="text-2xl font-bold">{(ecommerceMetrics.onlineVisitors / 1000).toFixed(0)}K</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(ecommerceMetrics.trends.visitors)}`}>
                  {getTrendIcon(ecommerceMetrics.trends.visitors)}
                  {Math.abs(ecommerceMetrics.trends.visitors)}% vs last period
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{ecommerceMetrics.conversionRate}%</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(ecommerceMetrics.trends.conversion)}`}>
                  {getTrendIcon(ecommerceMetrics.trends.conversion)}
                  {Math.abs(ecommerceMetrics.trends.conversion)}% vs last period
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>Revenue and metrics across all sales channels</CardDescription>
            </div>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channelPerformance.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <channel.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{channel.name}</div>
                    <div className="text-sm text-gray-500">{channel.platform}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="font-medium">AED {(channel.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{channel.orders}</div>
                    <div className="text-xs text-gray-500">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{(channel.visitors / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Visitors</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{channel.conversion}%</div>
                    <div className="text-xs text-gray-500">Conversion</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(channel.status)}>
                      {channel.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders & Integration Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Online Orders</CardTitle>
            <CardDescription>Latest orders from all channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-gray-500">
                        {order.customer} • {order.channel}
                      </div>
                      <div className="text-xs text-gray-400">{order.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">AED {order.total}</div>
                    <div className="text-sm text-gray-500">{order.items} items</div>
                    <Badge className={getStatusColor(order.status)} variant="outline">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>Connected services and APIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {integrationStatus.map((integration) => (
                <div key={integration.service} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(integration.status)}
                    </div>
                    <div>
                      <div className="font-medium">{integration.service}</div>
                      <div className="text-sm text-gray-500">{integration.provider}</div>
                      <div className="text-xs text-gray-400">
                        Last sync: {integration.lastSync}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used e-commerce functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              <span className="text-xs">Product Sync</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Truck className="h-6 w-6" />
              <span className="text-xs">Order Fulfillment</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <CreditCard className="h-6 w-6" />
              <span className="text-xs">Payment Settings</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-xs">Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Bell className="h-6 w-6" />
              <span className="text-xs">Notifications</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Share2 className="h-6 w-6" />
              <span className="text-xs">Social Media</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcommercePage;