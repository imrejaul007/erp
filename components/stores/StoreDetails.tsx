'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Store,
  StoreStatus,
  StoreType,
  UAEEmirate,
  StoreMetrics
} from '@/types/store';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Activity,
  Calendar,
  Edit,
  Settings,
  BarChart3,
  Building2,
  Store as StoreIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StoreDetailsProps {
  store: Store;
  onRefresh: () => void;
}

const getStatusColor = (status: StoreStatus) => {
  switch (status) {
    case StoreStatus.ACTIVE:
      return 'bg-green-100 text-green-800 border-green-200';
    case StoreStatus.INACTIVE:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case StoreStatus.MAINTENANCE:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case StoreStatus.TEMPORARILY_CLOSED:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case StoreStatus.PERMANENTLY_CLOSED:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: StoreStatus) => {
  switch (status) {
    case StoreStatus.ACTIVE:
      return <CheckCircle className="h-4 w-4" />;
    case StoreStatus.INACTIVE:
    case StoreStatus.TEMPORARILY_CLOSED:
      return <XCircle className="h-4 w-4" />;
    case StoreStatus.MAINTENANCE:
      return <AlertCircle className="h-4 w-4" />;
    case StoreStatus.PERMANENTLY_CLOSED:
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getPerformanceColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
};

export default function StoreDetails({ store, onRefresh }: StoreDetailsProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: store.settings.currency || 'AED'
    }).format(amount);
  };

  const formatTime = (time?: string) => {
    if (!time) return '--';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  const metrics = store.metrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
              <Badge className={getStatusColor(store.status)}>
                {getStatusIcon(store.status)}
                <span className="ml-1">{store.status.replace('_', ' ')}</span>
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <StoreIcon className="h-4 w-4" />
                <span>{store.code}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{store.type.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{store.city}, {store.emirate.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/stores/${store.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/stores/${store.id}/settings`)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button onClick={() => router.push(`/stores/${store.id}/dashboard`)}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalSales)}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(metrics.monthlyRevenue)} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getPerformanceColor(metrics.performanceScore)}`}>
                {metrics.performanceScore.toFixed(1)}%
              </div>
              <Progress value={metrics.performanceScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.stockValue)}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.lowStockItems} items low stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {metrics.footfall} visitors today
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="hours">Operating Hours</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Store Information */}
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Store Code:</span>
                  <span className="font-medium">{store.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">{store.type.replace('_', ' ')}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getStatusColor(store.status)}>
                    {store.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emirate:</span>
                  <span className="font-medium">{store.emirate.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <span className="font-medium">{store.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {new Date(store.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="mt-1">{store.address}</p>
                </div>
                {store.coordinates && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
                    <p className="mt-1 text-sm">
                      {store.coordinates.lat}, {store.coordinates.lng}
                    </p>
                  </div>
                )}
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Store Manager */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Store Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                {store.manager ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{store.manager.name}</p>
                        <p className="text-sm text-muted-foreground">{store.manager.email}</p>
                      </div>
                    </div>
                    {store.manager.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{store.manager.phone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No manager assigned</p>
                    <Button variant="outline" className="mt-3">
                      Assign Manager
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hierarchy */}
            <Card>
              <CardHeader>
                <CardTitle>Store Hierarchy</CardTitle>
              </CardHeader>
              <CardContent>
                {store.parentStore ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Parent Store</label>
                      <p className="mt-1 font-medium">{store.parentStore.name}</p>
                      <p className="text-sm text-muted-foreground">{store.parentStore.code}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">This is a top-level store</p>
                )}

                {store.childStores && store.childStores.length > 0 && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-muted-foreground">Child Stores</label>
                    <div className="mt-2 space-y-2">
                      {store.childStores.map((child) => (
                        <div key={child.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">{child.name}</p>
                            <p className="text-sm text-muted-foreground">{child.code}</p>
                          </div>
                          <Badge variant="outline">{child.type.replace('_', ' ')}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {metrics ? (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Overall Score</span>
                      <span className={`font-bold ${getPerformanceColor(metrics.performanceScore)}`}>
                        {metrics.performanceScore.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={metrics.performanceScore} />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Revenue:</span>
                      <span className="font-medium">{formatCurrency(metrics.monthlyRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Order Value:</span>
                      <span className="font-medium">{formatCurrency(metrics.averageOrderValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion Rate:</span>
                      <span className="font-medium">{metrics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inventory Turnover:</span>
                      <span className="font-medium">{metrics.inventoryTurnover.toFixed(1)}x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {metrics.topProducts && metrics.topProducts.length > 0 ? (
                    <div className="space-y-3">
                      {metrics.topProducts.slice(0, 5).map((product) => (
                        <div key={product.productId} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                              #{product.rank}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{product.productName}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.quantitySold} sold
                              </p>
                            </div>
                          </div>
                          <span className="font-medium text-sm">
                            {formatCurrency(product.revenue)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No sales data available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Stock Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatCurrency(metrics.stockValue)}</div>
                      <p className="text-sm text-muted-foreground">Total Stock Value</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{metrics.lowStockItems}</div>
                      <p className="text-sm text-muted-foreground">Low Stock Items</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inventory Turnover:</span>
                      <span className="font-medium">{metrics.inventoryTurnover.toFixed(1)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(metrics.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.lowStockItems > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-orange-900">Low Stock Alert</p>
                          <p className="text-sm text-orange-700">
                            {metrics.lowStockItems} items are running low
                          </p>
                        </div>
                      </div>
                    )}

                    {metrics.performanceScore < 70 && (
                      <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-red-900">Performance Alert</p>
                          <p className="text-sm text-red-700">
                            Store performance is below target
                          </p>
                        </div>
                      </div>
                    )}

                    {metrics.lowStockItems === 0 && metrics.performanceScore >= 70 && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">All Good!</p>
                          <p className="text-sm text-green-700">
                            No active alerts for this store
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Performance Data</h3>
                <p className="text-muted-foreground">
                  Performance metrics will appear here once the store starts operating
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
              <CardDescription>
                Store operating schedule throughout the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {days.map((day) => {
                  const schedule = store.openingHours[day];
                  return (
                    <div key={day} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <span className="font-medium capitalize w-24">{day}</span>
                      {schedule.isOpen ? (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{formatTime(schedule.openTime)}</span>
                            <span className="text-muted-foreground">-</span>
                            <span className="text-sm">{formatTime(schedule.closeTime)}</span>
                          </div>
                          {schedule.breakStart && schedule.breakEnd && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>(Break:</span>
                              <span>{formatTime(schedule.breakStart)}</span>
                              <span>-</span>
                              <span>{formatTime(schedule.breakEnd)})</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          Closed
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {store.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{store.phone}</p>
                      <p className="text-sm text-muted-foreground">Store Phone</p>
                    </div>
                  </div>
                )}

                {store.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{store.email}</p>
                      <p className="text-sm text-muted-foreground">Store Email</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{store.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {store.city}, {store.emirate.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                {store.settings.emergencyContactEmail ? (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{store.settings.emergencyContactEmail}</p>
                      <p className="text-sm text-muted-foreground">Emergency Contact</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No emergency contact set</p>
                    <Button variant="outline" className="mt-3">
                      Set Emergency Contact
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Rate:</span>
                  <span className="font-medium">{store.settings.taxRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency:</span>
                  <span className="font-medium">{store.settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone:</span>
                  <span className="font-medium">{store.settings.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Stock Threshold:</span>
                  <span className="font-medium">{store.settings.minStockThreshold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Stock Threshold:</span>
                  <span className="font-medium">{store.settings.maxStockThreshold}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto Replenishment</span>
                  <Badge variant={store.settings.autoReplenishment ? "default" : "secondary"}>
                    {store.settings.autoReplenishment ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable Transfers</span>
                  <Badge variant={store.settings.enableTransfers ? "default" : "secondary"}>
                    {store.settings.enableTransfers ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transfer Approval Required</span>
                  <Badge variant={store.settings.requireTransferApproval ? "default" : "secondary"}>
                    {store.settings.requireTransferApproval ? "Required" : "Not Required"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Price Sync</span>
                  <Badge variant={store.settings.enablePriceSync ? "default" : "secondary"}>
                    {store.settings.enablePriceSync ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Promotion Sync</span>
                  <Badge variant={store.settings.enablePromotionSync ? "default" : "secondary"}>
                    {store.settings.enablePromotionSync ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}