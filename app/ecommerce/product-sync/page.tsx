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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Package,
  RefreshCw,
  Upload,
  Download,
  Sync,
  Globe,
  ShoppingCart,
  Instagram,
  Facebook,
  MessageSquare,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  TrendingUp,
  DollarSign,
  Calendar,
  Map,
  Target,
  Zap
} from 'lucide-react';

const ProductSyncPage = () => {
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Sample product sync data
  const channels = [
    {
      id: 'website',
      name: 'Official Website',
      type: 'ecommerce',
      status: 'active',
      productsCount: 1847,
      lastSync: '2024-01-15 14:30:00',
      syncStatus: 'success',
      icon: Globe
    },
    {
      id: 'instagram',
      name: 'Instagram Shop',
      type: 'social',
      status: 'active',
      productsCount: 892,
      lastSync: '2024-01-15 14:25:00',
      syncStatus: 'success',
      icon: Instagram
    },
    {
      id: 'facebook',
      name: 'Facebook Shop',
      type: 'social',
      status: 'active',
      productsCount: 756,
      lastSync: '2024-01-15 14:25:00',
      syncStatus: 'success',
      icon: Facebook
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      type: 'messaging',
      status: 'active',
      productsCount: 345,
      lastSync: '2024-01-15 14:28:00',
      syncStatus: 'success',
      icon: MessageSquare
    },
    {
      id: 'amazon',
      name: 'Amazon UAE',
      type: 'marketplace',
      status: 'active',
      productsCount: 1234,
      lastSync: '2024-01-15 14:20:00',
      syncStatus: 'warning',
      icon: Package
    },
    {
      id: 'noon',
      name: 'Noon Marketplace',
      type: 'marketplace',
      status: 'active',
      productsCount: 987,
      lastSync: '2024-01-15 14:22:00',
      syncStatus: 'success',
      icon: ShoppingCart
    },
    {
      id: 'app',
      name: 'Mobile App',
      type: 'mobile',
      status: 'development',
      productsCount: 0,
      lastSync: null,
      syncStatus: 'pending',
      icon: Smartphone
    }
  ];

  const products = [
    {
      id: 'PRD-001',
      name: 'Royal Oud Premium Collection',
      nameAr: 'مجموعة العود الملكي الفاخرة',
      sku: 'ROP-001',
      category: 'Oud',
      price: 1250,
      stock: 45,
      status: 'active',
      channels: ['website', 'instagram', 'facebook', 'amazon', 'noon'],
      lastUpdated: '2024-01-15 12:30:00',
      syncStatus: 'synced',
      variants: 3,
      image: '/images/royal-oud.jpg'
    },
    {
      id: 'PRD-002',
      name: 'Arabian Nights Perfume',
      nameAr: 'عطر ليالي العرب',
      sku: 'ANP-002',
      category: 'Perfume',
      price: 385,
      stock: 128,
      status: 'active',
      channels: ['website', 'instagram', 'facebook', 'whatsapp'],
      lastUpdated: '2024-01-15 11:45:00',
      syncStatus: 'pending',
      variants: 2,
      image: '/images/arabian-nights.jpg'
    },
    {
      id: 'PRD-003',
      name: 'Luxury Bakhoor Set',
      nameAr: 'طقم البخور الفاخر',
      sku: 'LBS-003',
      category: 'Bakhoor',
      price: 750,
      stock: 89,
      status: 'active',
      channels: ['website', 'amazon', 'noon'],
      lastUpdated: '2024-01-15 10:20:00',
      syncStatus: 'error',
      variants: 1,
      image: '/images/luxury-bakhoor.jpg'
    },
    {
      id: 'PRD-004',
      name: 'Rose Oud Essence',
      nameAr: 'خلاصة عود الورد',
      sku: 'ROE-004',
      category: 'Oud',
      price: 920,
      stock: 67,
      status: 'active',
      channels: ['website', 'instagram', 'facebook', 'amazon'],
      lastUpdated: '2024-01-14 16:15:00',
      syncStatus: 'synced',
      variants: 2,
      image: '/images/rose-oud.jpg'
    }
  ];

  const syncRules = [
    {
      id: 'rule001',
      name: 'Auto Sync Inventory',
      description: 'Automatically sync inventory levels across all channels',
      enabled: true,
      channels: ['website', 'instagram', 'facebook', 'amazon', 'noon'],
      frequency: 'real-time'
    },
    {
      id: 'rule002',
      name: 'Price Update Sync',
      description: 'Sync price changes to selected channels',
      enabled: true,
      channels: ['website', 'amazon', 'noon'],
      frequency: 'hourly'
    },
    {
      id: 'rule003',
      name: 'New Product Auto-Publish',
      description: 'Automatically publish new products to approved channels',
      enabled: false,
      channels: ['website', 'instagram', 'facebook'],
      frequency: 'immediate'
    },
    {
      id: 'rule004',
      name: 'Arabic Content Sync',
      description: 'Sync Arabic product names and descriptions',
      enabled: true,
      channels: ['website', 'whatsapp'],
      frequency: 'daily'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
      case 'success':
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'development': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleSyncAll = async () => {
    setSyncInProgress(true);
    // Simulate sync process
    setTimeout(() => {
      setSyncInProgress(false);
    }, 3000);
  };

  const handleBulkSync = () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to sync');
      return;
    }
    // Handle bulk sync logic
    console.log('Syncing products:', selectedProducts);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Synchronization</h1>
          <p className="text-gray-600">Manage product sync across all channels</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncAll}
            disabled={syncInProgress}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncInProgress ? 'animate-spin' : ''}`} />
            {syncInProgress ? 'Syncing...' : 'Sync All'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Sync Rule
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">1,847</p>
                <p className="text-xs text-green-600">+32 this week</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Channels</p>
                <p className="text-2xl font-bold">{channels.filter(ch => ch.status === 'active').length}</p>
                <p className="text-xs text-blue-600">All synced</p>
              </div>
              <Sync className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sync Success Rate</p>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-xs text-green-600">+2.1% vs last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Syncs</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-orange-600">Needs attention</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="rules">Sync Rules</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Channel Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sync className="h-5 w-5" />
                  Channel Sync Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <channel.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{channel.name}</div>
                          <div className="text-sm text-gray-500">{channel.productsCount} products</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(channel.syncStatus)}>
                          {getStatusIcon(channel.syncStatus)}
                          <span className="ml-1">{channel.syncStatus}</span>
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Sync className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sync Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Sync Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium">Instagram Shop Sync</div>
                        <div className="text-xs text-gray-500">892 products updated</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">2 min ago</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">Amazon UAE Sync</div>
                        <div className="text-xs text-gray-500">1,234 products updated</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">5 min ago</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="text-sm font-medium">WhatsApp Business</div>
                        <div className="text-xs text-gray-500">3 products failed to sync</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">12 min ago</div>
                  </div>
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
                  <span className="text-xs">Sync All Channels</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Bulk Upload</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  <span className="text-xs">Sync Settings</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Target className="h-6 w-6" />
                  <span className="text-xs">Field Mapping</span>
                </Button>
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
                Configure sync settings for each channel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {channels.map((channel) => (
                  <Card key={channel.id}>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <channel.icon className="h-5 w-5" />
                            <div>
                              <h4 className="font-medium">{channel.name}</h4>
                              <p className="text-xs text-gray-500 capitalize">{channel.type}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(channel.status)}>
                            {channel.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Products:</span>
                            <span className="font-medium">{channel.productsCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Sync:</span>
                            <span className="text-xs text-gray-500">
                              {channel.lastSync ? new Date(channel.lastSync).toLocaleString() : 'Never'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge className={getStatusColor(channel.syncStatus)}>
                              {channel.syncStatus}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Sync className="h-4 w-4 mr-1" />
                            Sync
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="h-4 w-4 mr-1" />
                            Config
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

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Product Sync Management</CardTitle>
                  <CardDescription>
                    Monitor and control product synchronization
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkSync}
                    disabled={selectedProducts.length === 0}
                  >
                    <Sync className="h-4 w-4 mr-2" />
                    Bulk Sync ({selectedProducts.length})
                  </Button>
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex gap-4 items-center mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input className="pl-10" placeholder="Search products..." />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="synced">Synced</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Products Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(products.map(p => p.id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                        checked={selectedProducts.length === products.length}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.nameAr}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">AED {product.price}</TableCell>
                      <TableCell>
                        <span className={product.stock < 50 ? 'text-orange-600' : 'text-green-600'}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.channels.slice(0, 3).map((channelId) => {
                            const channel = channels.find(ch => ch.id === channelId);
                            return channel ? (
                              <Badge key={channelId} variant="outline" className="text-xs">
                                {channel.name.split(' ')[0]}
                              </Badge>
                            ) : null;
                          })}
                          {product.channels.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.channels.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.syncStatus)}>
                          {getStatusIcon(product.syncStatus)}
                          <span className="ml-1">{product.syncStatus}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(product.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Sync className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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
        </TabsContent>

        {/* Sync Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Synchronization Rules</CardTitle>
                  <CardDescription>
                    Configure automated sync rules for different scenarios
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncRules.map((rule) => (
                  <Card key={rule.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Switch checked={rule.enabled} />
                          <div>
                            <h4 className="font-medium">{rule.name}</h4>
                            <p className="text-sm text-gray-500">{rule.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                {rule.frequency}
                              </Badge>
                              <div className="flex flex-wrap gap-1">
                                {rule.channels.slice(0, 3).map((channelId) => {
                                  const channel = channels.find(ch => ch.id === channelId);
                                  return channel ? (
                                    <Badge key={channelId} variant="outline" className="text-xs">
                                      {channel.name.split(' ')[0]}
                                    </Badge>
                                  ) : null;
                                })}
                                {rule.channels.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{rule.channels.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
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

        {/* Field Mapping Tab */}
        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping Configuration</CardTitle>
              <CardDescription>
                Map product fields between your system and external channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {channels.filter(ch => ch.status === 'active').map((channel) => (
                  <Card key={channel.id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <channel.icon className="h-5 w-5" />
                        {channel.name} Field Mapping
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Product Name</Label>
                            <Select defaultValue="name">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="name">Product Name</SelectItem>
                                <SelectItem value="name_ar">Arabic Name</SelectItem>
                                <SelectItem value="title">Title</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Select defaultValue="description">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="description">Description</SelectItem>
                                <SelectItem value="description_ar">Arabic Description</SelectItem>
                                <SelectItem value="short_desc">Short Description</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Price Field</Label>
                            <Select defaultValue="price">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="price">Regular Price</SelectItem>
                                <SelectItem value="sale_price">Sale Price</SelectItem>
                                <SelectItem value="retail_price">Retail Price</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Category Mapping</Label>
                            <Select defaultValue="category">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="category">Primary Category</SelectItem>
                                <SelectItem value="sub_category">Sub Category</SelectItem>
                                <SelectItem value="product_type">Product Type</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Inventory Field</Label>
                            <Select defaultValue="stock">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="stock">Stock Quantity</SelectItem>
                                <SelectItem value="available">Available Stock</SelectItem>
                                <SelectItem value="inventory">Inventory Count</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Image Field</Label>
                            <Select defaultValue="image">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="image">Primary Image</SelectItem>
                                <SelectItem value="images">All Images</SelectItem>
                                <SelectItem value="featured_image">Featured Image</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Button size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Save Mapping
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto Sync</div>
                    <div className="text-sm text-gray-500">Automatically sync products</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Real-time Updates</div>
                    <div className="text-sm text-gray-500">Instant sync on changes</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Inventory Sync</div>
                    <div className="text-sm text-gray-500">Sync stock levels</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Price Sync</div>
                    <div className="text-sm text-gray-500">Sync price changes</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Sync Failure Alerts</div>
                    <div className="text-sm text-gray-500">Email on sync errors</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Daily Reports</div>
                    <div className="text-sm text-gray-500">Daily sync summary</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Low Stock Alerts</div>
                    <div className="text-sm text-gray-500">Alert on low inventory</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Notification Email</Label>
                  <Input type="email" placeholder="admin@oudpms.ae" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <Select defaultValue="hourly">
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
                  <Label>Batch Size</Label>
                  <Select defaultValue="100">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50 products</SelectItem>
                      <SelectItem value="100">100 products</SelectItem>
                      <SelectItem value="200">200 products</SelectItem>
                      <SelectItem value="500">500 products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Retry Attempts</Label>
                  <Input type="number" defaultValue="3" min="1" max="10" />
                </div>
                <div className="space-y-2">
                  <Label>Timeout (seconds)</Label>
                  <Input type="number" defaultValue="30" min="10" max="300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductSyncPage;