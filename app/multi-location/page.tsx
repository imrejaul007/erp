'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  MapPin,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  Zap,
  Activity,
  ArrowLeft} from 'lucide-react';

interface LocationData {
  id: string;
  name: string;
  address?: string;
  city?: string;
  storeType?: string;
  isActive: boolean;
  manager?: {
    name: string;
  };
  _count?: {
    products: number;
  };
}

const MultiLocationPage = () => {
  const router = useRouter();
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationMetrics, setLocationMetrics] = useState({
    totalLocations: 0,
    activeStores: 0,
    totalRevenue: 0,
    avgPerformance: 0,
    trends: {
      revenue: 0,
      performance: 0,
      stores: 0,
      efficiency: 0
    }
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/stores?limit=100');
      if (response.ok) {
        const data = await response.json();
        const storesData = (data.stores || []).map((store: LocationData) => ({
          id: store.id,
          name: store.name,
          address: store.address || `${store.city || 'N/A'}`,
          type: store.storeType?.toLowerCase() || 'standard',
          status: store.isActive ? 'active' : 'maintenance',
          manager: store.manager?.name || 'Not Assigned',
          revenue: 0, // Would come from orders API
          target: 0,
          performance: 0,
          staff: 0, // Would come from staff API
          inventory: store._count?.products || 0,
          lastUpdate: 'Recently',
          alerts: 0
        }));

        setLocations(storesData);

        // Calculate metrics
        const activeCount = storesData.filter((s: any) => s.status === 'active').length;
        setLocationMetrics({
          totalLocations: storesData.length,
          activeStores: activeCount,
          totalRevenue: 0, // Would be calculated from orders
          avgPerformance: activeCount > 0 ? (activeCount / storesData.length * 100) : 0,
          trends: {
            revenue: 0,
            performance: 0,
            stores: 0,
            efficiency: 0
          }
        });
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      title: 'Total Revenue',
      value: `AED ${(locationMetrics.totalRevenue / 1000000).toFixed(1)}M`,
      change: locationMetrics.trends.revenue,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Locations',
      value: `${locationMetrics.activeStores}/${locationMetrics.totalLocations}`,
      change: locationMetrics.trends.stores,
      icon: Store,
      color: 'text-blue-600'
    },
    {
      title: 'Avg Performance',
      value: `${locationMetrics.avgPerformance}%`,
      change: locationMetrics.trends.performance,
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      title: 'Operational Efficiency',
      value: '94.2%',
      change: locationMetrics.trends.efficiency,
      icon: Zap,
      color: 'text-orange-600'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'flagship': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'standard': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 100) return 'text-green-600';
    if (performance >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Multi-Location Management</h1>
            <p className="text-gray-600">Monitor and manage all store locations from a centralized dashboard</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={() => router.push('/multi-location/settings')} className="w-full sm:w-auto">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => router.push('/multi-location/add-location')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  <div className={`text-xs flex items-center gap-1 ${getTrendColor(stat.change)}`}>
                    {getTrendIcon(stat.change)}
                    {Math.abs(stat.change)}% vs last period
                  </div>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Location Overview Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Location Overview</CardTitle>
          <CardDescription>Real-time status and performance of all store locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Interactive Map View</p>
              <p className="text-sm text-gray-500">Showing all UAE locations with real-time status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations List */}
      <Card>
        <CardHeader>
          <CardTitle>Store Locations</CardTitle>
          <CardDescription>Detailed view of all retail locations with performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locations.map((location) => (
              <div key={location.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{location.name}</h3>
                        <Badge className={getTypeColor(location.type)}>
                          {location.type}
                        </Badge>
                        <Badge className={getStatusColor(location.status)}>
                          {location.status}
                        </Badge>
                        {location.alerts > 0 && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {location.alerts}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <MapPin className="h-3 w-3" />
                        {location.address}
                      </div>
                      <div className="text-sm text-gray-600">
                        Manager: {location.manager} • Last updated: {location.lastUpdate}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/multi-location/view/${location.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/multi-location/edit/${location.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">AED {(location.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                    <div className={`text-xs ${getPerformanceColor(location.performance)}`}>
                      {location.performance}% of target
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{location.staff}</div>
                    <div className="text-xs text-gray-500">Staff Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{location.inventory}</div>
                    <div className="text-xs text-gray-500">Inventory Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{location.performance}%</div>
                    <div className="text-xs text-gray-500">Performance</div>
                    <Progress value={location.performance} className="w-full h-2 mt-1" />
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${location.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {location.status === 'active' ? <CheckCircle className="h-5 w-5 mx-auto" /> : <Clock className="h-5 w-5 mx-auto" />}
                    </div>
                    <div className="text-xs text-gray-500">Status</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/multi-location/transfers')}>
          <CardContent className="p-4 sm:p-6 text-center">
            <Truck className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-medium mb-2">Inter-Store Transfers</h3>
            <p className="text-sm text-gray-600">Manage inventory transfers between locations</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/multi-location/staff')}>
          <CardContent className="p-4 sm:p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-medium mb-2">Staff Management</h3>
            <p className="text-sm text-gray-600">Centralized staff scheduling and management</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/multi-location/analytics')}>
          <CardContent className="p-4 sm:p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-medium mb-2">Performance Analytics</h3>
            <p className="text-sm text-gray-600">Compare and analyze location performance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiLocationPage;