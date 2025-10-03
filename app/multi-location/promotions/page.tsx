'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Tags,
  Gift,
  Percent,
  Target,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Edit,
  Copy,
  Play,
  Pause,
  Square,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Zap,
  Crown,
  Building2,
  Package,
  ShoppingCart,
  Megaphone,
  ArrowLeft} from 'lucide-react';

const PromotionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // UAE Store Locations
  const locations = [
    { id: 'LOC-001', name: 'Dubai Mall Flagship', code: 'DXB-DM', type: 'flagship' },
    { id: 'LOC-002', name: 'Mall of Emirates', code: 'DXB-MOE', type: 'premium' },
    { id: 'LOC-003', name: 'Ibn Battuta Mall', code: 'DXB-IBN', type: 'standard' },
    { id: 'LOC-004', name: 'City Centre Mirdif', code: 'DXB-CCM', type: 'standard' },
    { id: 'LOC-005', name: 'Abu Dhabi Mall', code: 'AUH-ADM', type: 'premium' },
    { id: 'LOC-006', name: 'Sharjah City Centre', code: 'SHJ-SCC', type: 'standard' },
    { id: 'LOC-007', name: 'Al Ghurair Centre', code: 'DXB-AGC', type: 'standard' },
    { id: 'LOC-008', name: 'Yas Mall', code: 'AUH-YAS', type: 'premium' }
  ];

  // Sample promotion data
  const promotions = [
    {
      id: 'PROMO-001',
      name: 'Ramadan Special - Royal Collection',
      description: 'Buy 2 Premium Oud bottles, get 1 Attar free',
      type: 'bogo',
      category: 'seasonal',
      status: 'active',
      priority: 'high',
      locations: ['LOC-001', 'LOC-002', 'LOC-005', 'LOC-008'],
      startDate: '2024-09-15T00:00:00',
      endDate: '2024-10-15T23:59:59',
      discountType: 'bogo',
      discountValue: 0,
      minimumPurchase: 1000,
      maximumDiscount: null,
      usageLimit: 500,
      usageCount: 234,
      revenue: 125000,
      orders: 156,
      createdBy: 'Sarah Al-Maktoum',
      approvedBy: 'Regional Manager',
      targetProducts: ['ROP-100ML', 'SG-75ML'],
      targetCategories: ['Premium Fragrances', 'Luxury Line'],
      customerSegments: ['VIP', 'Premium'],
      termsConditions: 'Valid on selected premium products only. Cannot be combined with other offers.',
      bannerImage: 'ramadan-special-banner.jpg',
      createdAt: '2024-09-10T10:00:00',
      updatedAt: '2024-09-28T15:30:00'
    },
    {
      id: 'PROMO-002',
      name: 'Weekend Flash Sale',
      description: '30% off on all Floral Collection items',
      type: 'percentage',
      category: 'flash_sale',
      status: 'active',
      priority: 'medium',
      locations: ['LOC-003', 'LOC-004', 'LOC-006', 'LOC-007'],
      startDate: '2024-09-28T00:00:00',
      endDate: '2024-09-30T23:59:59',
      discountType: 'percentage',
      discountValue: 30,
      minimumPurchase: 200,
      maximumDiscount: 500,
      usageLimit: 200,
      usageCount: 89,
      revenue: 45000,
      orders: 67,
      createdBy: 'Omar Hassan',
      approvedBy: 'Store Manager',
      targetProducts: ['JE-50ML', 'RA-30ML'],
      targetCategories: ['Floral Collection', 'Traditional Attars'],
      customerSegments: ['Regular', 'New'],
      termsConditions: 'Valid for weekend only. Minimum purchase of AED 200 required.',
      bannerImage: 'weekend-flash-sale.jpg',
      createdAt: '2024-09-25T09:00:00',
      updatedAt: '2024-09-28T12:00:00'
    },
    {
      id: 'PROMO-003',
      name: 'New Customer Welcome Offer',
      description: 'AED 100 off on first purchase above AED 500',
      type: 'fixed_amount',
      category: 'customer_acquisition',
      status: 'active',
      priority: 'medium',
      locations: ['LOC-001', 'LOC-002', 'LOC-003', 'LOC-004', 'LOC-005', 'LOC-006', 'LOC-007', 'LOC-008'],
      startDate: '2024-09-01T00:00:00',
      endDate: '2024-12-31T23:59:59',
      discountType: 'fixed_amount',
      discountValue: 100,
      minimumPurchase: 500,
      maximumDiscount: 100,
      usageLimit: 1000,
      usageCount: 342,
      revenue: 89000,
      orders: 342,
      createdBy: 'Marketing Team',
      approvedBy: 'Regional Manager',
      targetProducts: [],
      targetCategories: ['All Categories'],
      customerSegments: ['New'],
      termsConditions: 'Valid for new customers only. One-time use per customer.',
      bannerImage: 'welcome-offer-banner.jpg',
      createdAt: '2024-08-28T14:00:00',
      updatedAt: '2024-09-15T11:20:00'
    },
    {
      id: 'PROMO-004',
      name: 'VIP Loyalty Reward',
      description: '20% off + Free gift wrapping for VIP members',
      type: 'loyalty',
      category: 'loyalty_program',
      status: 'scheduled',
      priority: 'high',
      locations: ['LOC-001', 'LOC-002', 'LOC-005'],
      startDate: '2024-10-05T00:00:00',
      endDate: '2024-10-25T23:59:59',
      discountType: 'percentage',
      discountValue: 20,
      minimumPurchase: 300,
      maximumDiscount: null,
      usageLimit: 150,
      usageCount: 0,
      revenue: 0,
      orders: 0,
      createdBy: 'Fatima Al-Zahra',
      approvedBy: 'Pending',
      targetProducts: [],
      targetCategories: ['All Categories'],
      customerSegments: ['VIP'],
      termsConditions: 'Valid for VIP members only. Includes complimentary gift wrapping.',
      bannerImage: 'vip-loyalty-banner.jpg',
      createdAt: '2024-09-30T16:00:00',
      updatedAt: '2024-09-30T16:00:00'
    },
    {
      id: 'PROMO-005',
      name: 'Back to School Special',
      description: '15% off on all mini fragrances',
      type: 'percentage',
      category: 'seasonal',
      status: 'expired',
      priority: 'low',
      locations: ['LOC-003', 'LOC-004', 'LOC-007'],
      startDate: '2024-08-15T00:00:00',
      endDate: '2024-09-15T23:59:59',
      discountType: 'percentage',
      discountValue: 15,
      minimumPurchase: 150,
      maximumDiscount: 200,
      usageLimit: 300,
      usageCount: 287,
      revenue: 32000,
      orders: 198,
      createdBy: 'Aisha Mohammed',
      approvedBy: 'Store Manager',
      targetProducts: ['JE-30ML', 'RA-15ML'],
      targetCategories: ['Mini Collection'],
      customerSegments: ['Student', 'Regular'],
      termsConditions: 'Valid on mini fragrances only. Student ID required for additional 5% off.',
      bannerImage: 'back-to-school-banner.jpg',
      createdAt: '2024-08-10T11:00:00',
      updatedAt: '2024-09-15T23:59:59'
    }
  ];

  // Promotion analytics
  const promotionAnalytics = {
    totalPromotions: promotions.length,
    activePromotions: promotions.filter(p => p.status === 'active').length,
    scheduledPromotions: promotions.filter(p => p.status === 'scheduled').length,
    totalRevenue: promotions.reduce((sum, p) => sum + p.revenue, 0),
    totalOrders: promotions.reduce((sum, p) => sum + p.orders, 0),
    avgOrderValue: 284,
    conversionRate: 12.8,
    trends: {
      revenue: +18.5,
      orders: +15.2,
      conversion: +8.7,
      engagement: +22.3
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'expired': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <Square className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'seasonal': return 'bg-orange-100 text-orange-800';
      case 'flash_sale': return 'bg-red-100 text-red-800';
      case 'loyalty_program': return 'bg-purple-100 text-purple-800';
      case 'customer_acquisition': return 'bg-blue-100 text-blue-800';
      case 'clearance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'seasonal': return <Star className="h-4 w-4" />;
      case 'flash_sale': return <Zap className="h-4 w-4" />;
      case 'loyalty_program': return <Crown className="h-4 w-4" />;
      case 'customer_acquisition': return <Users className="h-4 w-4" />;
      case 'clearance': return <Package className="h-4 w-4" />;
      default: return <Tags className="h-4 w-4" />;
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

  const getLocationNames = (locationIds) => {
    return locationIds.map(id => {
      const location = locations.find(loc => loc.id === id);
      return location ? location.code : 'UNK';
    }).join(', ');
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || promotion.locations.includes(locationFilter);
    const matchesCategory = categoryFilter === 'all' || promotion.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesLocation && matchesCategory;
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
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getUsagePercentage = (used, limit) => {
    return limit ? (used / limit) * 100 : 0;
  };

  const getDiscountDisplay = (promotion) => {
    switch (promotion.discountType) {
      case 'percentage':
        return `${promotion.discountValue}% OFF`;
      case 'fixed_amount':
        return `AED ${promotion.discountValue} OFF`;
      case 'bogo':
        return 'Buy 2 Get 1 FREE';
      default:
        return 'Special Offer';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Branch Promotions Management</h1>
          <p className="text-gray-600">Create and manage promotional campaigns across all UAE store locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                <p className="text-xl sm:text-2xl font-bold">{promotionAnalytics.activePromotions}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(promotionAnalytics.trends.engagement)}`}>
                  {getTrendIcon(promotionAnalytics.trends.engagement)}
                  {Math.abs(promotionAnalytics.trends.engagement)}% engagement
                </div>
              </div>
              <Megaphone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promotion Revenue</p>
                <p className="text-xl sm:text-2xl font-bold">AED {(promotionAnalytics.totalRevenue / 1000).toFixed(0)}K</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(promotionAnalytics.trends.revenue)}`}>
                  {getTrendIcon(promotionAnalytics.trends.revenue)}
                  {Math.abs(promotionAnalytics.trends.revenue)}% vs last month
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold">{promotionAnalytics.totalOrders}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(promotionAnalytics.trends.orders)}`}>
                  {getTrendIcon(promotionAnalytics.trends.orders)}
                  {Math.abs(promotionAnalytics.trends.orders)}% vs last month
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-xl sm:text-2xl font-bold">{promotionAnalytics.conversionRate}%</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(promotionAnalytics.trends.conversion)}`}>
                  {getTrendIcon(promotionAnalytics.trends.conversion)}
                  {Math.abs(promotionAnalytics.trends.conversion)}% vs last month
                </div>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
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
                  placeholder="Search promotions by name, description, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="flash_sale">Flash Sale</SelectItem>
                  <SelectItem value="loyalty_program">Loyalty</SelectItem>
                  <SelectItem value="customer_acquisition">Acquisition</SelectItem>
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

      {/* Promotions Management Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Promotion Campaigns</CardTitle>
              <CardDescription>
                Currently running promotional campaigns across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {filteredPromotions.filter(p => p.status === 'active').map((promotion) => (
                  <div key={promotion.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                          <Gift className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{promotion.name}</h3>
                            <Badge className={getStatusColor(promotion.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(promotion.status)}
                                {promotion.status}
                              </div>
                            </Badge>
                            <Badge className={getCategoryColor(promotion.category)}>
                              <div className="flex items-center gap-1">
                                {getCategoryIcon(promotion.category)}
                                {promotion.category.replace('_', ' ')}
                              </div>
                            </Badge>
                            <Badge className={getPriorityColor(promotion.priority)}>
                              {promotion.priority} priority
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{promotion.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{getLocationNames(promotion.locations)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{promotion.customerSegments.join(', ')}</span>
                            </div>
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
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Promotion Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{getDiscountDisplay(promotion)}</div>
                        <div className="text-xs text-gray-500">Discount</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold">AED {promotion.revenue?.toLocaleString() || "0"}</div>
                        <div className="text-xs text-gray-500">Revenue Generated</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold">{promotion.orders}</div>
                        <div className="text-xs text-gray-500">Orders</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold">{promotion.usageCount}</div>
                        <div className="text-xs text-gray-500">Uses</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold">AED {Math.round(promotion.revenue / promotion.orders) || 0}</div>
                        <div className="text-xs text-gray-500">Avg Order Value</div>
                      </div>
                    </div>

                    {/* Usage Progress */}
                    {promotion.usageLimit && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Usage Progress</span>
                          <span>{promotion.usageCount} / {promotion.usageLimit}</span>
                        </div>
                        <Progress value={getUsagePercentage(promotion.usageCount, promotion.usageLimit)} className="h-2" />
                      </div>
                    )}

                    {/* Location Coverage */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Active Locations</h4>
                      <div className="flex flex-wrap gap-2">
                        {promotion.locations.map(locationId => {
                          const location = locations.find(loc => loc.id === locationId);
                          return (
                            <Badge key={locationId} variant="outline" className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {location?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Promotions</CardTitle>
              <CardDescription>
                Upcoming promotional campaigns ready to launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promotions.filter(p => p.status === 'scheduled').map((promotion) => (
                  <div key={promotion.id} className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{promotion.name}</h3>
                            <Badge className="bg-blue-100 text-blue-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Scheduled
                            </Badge>
                            <Badge className={getCategoryColor(promotion.category)}>
                              {promotion.category.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{promotion.description}</p>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Starts:</span> {formatDate(promotion.startDate)} |
                            <span className="font-medium ml-2">Ends:</span> {formatDate(promotion.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Start Now
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded p-3">
                        <div className="text-lg font-bold text-center">{getDiscountDisplay(promotion)}</div>
                        <div className="text-sm text-gray-500 text-center">Discount Offer</div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <div className="text-lg font-bold text-center">{promotion.locations.length}</div>
                        <div className="text-sm text-gray-500 text-center">Target Locations</div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <div className="text-lg font-bold text-center">AED {promotion.minimumPurchase}</div>
                        <div className="text-sm text-gray-500 text-center">Min Purchase</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Top Performing Promotions */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Promotions</CardTitle>
                <CardDescription>Highest revenue-generating campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {promotions
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map((promotion, index) => (
                      <div key={promotion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{promotion.name}</div>
                            <div className="text-sm text-gray-500">{promotion.category.replace('_', ' ')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">AED {promotion.revenue?.toLocaleString() || "0"}</div>
                          <div className="text-sm text-gray-500">{promotion.orders} orders</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>Promotion effectiveness by store location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locations.slice(0, 6).map((location) => {
                    const locationPromotions = promotions.filter(p =>
                      p.locations.includes(location.id) && p.status === 'active'
                    );
                    const totalRevenue = locationPromotions.reduce((sum, p) => sum + p.revenue, 0);
                    const totalOrders = locationPromotions.reduce((sum, p) => sum + p.orders, 0);

                    return (
                      <div key={location.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{locationPromotions.length} active promotions</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">AED {totalRevenue?.toLocaleString() || "0"}</div>
                          <div className="text-sm text-gray-500">{totalOrders} orders</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Monthly promotion performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Performance Trends Chart</p>
                    <p className="text-sm text-gray-500">Integration with charting library</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common promotion management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Flash Sale
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Best Performer
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Launch Location-Specific Offer
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Performance Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotion Templates</CardTitle>
              <CardDescription>
                Pre-built templates for common promotional campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="h-8 w-8 text-orange-500" />
                    <h3 className="font-semibold">Seasonal Sale</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Perfect for holiday and seasonal promotions with time-limited offers</p>
                  <Button size="sm" className="w-full">Use Template</Button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-8 w-8 text-red-500" />
                    <h3 className="font-semibold">Flash Sale</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Short-duration high-impact sales for inventory clearance</p>
                  <Button size="sm" className="w-full">Use Template</Button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Crown className="h-8 w-8 text-purple-500" />
                    <h3 className="font-semibold">VIP Exclusive</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Special offers for loyalty program members and VIP customers</p>
                  <Button size="sm" className="w-full">Use Template</Button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-8 w-8 text-blue-500" />
                    <h3 className="font-semibold">New Customer</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Welcome offers and incentives for first-time customers</p>
                  <Button size="sm" className="w-full">Use Template</Button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Gift className="h-8 w-8 text-green-500" />
                    <h3 className="font-semibold">BOGO Offer</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Buy one get one free promotions for volume sales</p>
                  <Button size="sm" className="w-full">Use Template</Button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="h-8 w-8 text-yellow-500" />
                    <h3 className="font-semibold">Bundle Deal</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Package deals and product bundles at discounted rates</p>
                  <Button size="sm" className="w-full">Use Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromotionsPage;