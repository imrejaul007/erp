'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Target,
  Clock,
  Activity,
  RefreshCw
} from 'lucide-react';

export default function PerformanceDashboardPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('realtime');

  const realtimeMetrics = {
    todaySales: 45250,
    todayOrders: 28,
    avgOrderValue: 1616,
    activeSessions: 142,
    conversionRate: 3.8,
    cartAbandonment: 28.5,
    lastUpdated: 'Just now'
  };

  const kpis = [
    {
      name: 'Sales Today',
      value: 'AED 45,250',
      target: 'AED 50,000',
      progress: 90.5,
      trend: 'up',
      change: 12.5,
      status: 'on-track',
      icon: DollarSign
    },
    {
      name: 'Orders Today',
      value: '28',
      target: '35',
      progress: 80.0,
      trend: 'up',
      change: 8.2,
      status: 'on-track',
      icon: ShoppingCart
    },
    {
      name: 'New Customers',
      value: '12',
      target: '15',
      progress: 80.0,
      trend: 'stable',
      change: 0,
      status: 'on-track',
      icon: Users
    },
    {
      name: 'Items Sold',
      value: '156',
      target: '200',
      progress: 78.0,
      trend: 'up',
      change: 15.3,
      status: 'on-track',
      icon: Package
    },
    {
      name: 'Avg Order Value',
      value: 'AED 1,616',
      target: 'AED 1,500',
      progress: 107.7,
      trend: 'up',
      change: 7.7,
      status: 'exceeding',
      icon: Target
    },
    {
      name: 'Customer Satisfaction',
      value: '4.8/5',
      target: '4.5/5',
      progress: 106.7,
      trend: 'up',
      change: 2.1,
      status: 'exceeding',
      icon: Activity
    }
  ];

  const hourlyData = [
    { hour: '09:00', sales: 2850, orders: 3, customers: 8 },
    { hour: '10:00', sales: 4250, orders: 4, customers: 12 },
    { hour: '11:00', sales: 3850, orders: 3, customers: 10 },
    { hour: '12:00', sales: 5420, orders: 5, customers: 15 },
    { hour: '13:00', sales: 4850, orders: 4, customers: 11 },
    { hour: '14:00', sales: 3250, orders: 2, customers: 7 },
    { hour: '15:00', sales: 6850, orders: 6, customers: 18 },
    { hour: '16:00', sales: 7250, orders: 5, customers: 14 },
    { hour: '17:00', sales: 6730, orders: 4, customers: 12 }
  ];

  const topProducts = [
    { name: 'Royal Oud Premium', sold: 18, revenue: 7650, trend: 'up', stock: 82 },
    { name: 'Arabian Nights', sold: 24, revenue: 7320, trend: 'up', stock: 156 },
    { name: 'Desert Rose', sold: 16, revenue: 4432, trend: 'stable', stock: 94 },
    { name: 'Sandalwood Essence', sold: 22, revenue: 5368, trend: 'up', stock: 68 },
    { name: 'Amber Collection', sold: 14, revenue: 4074, trend: 'down', stock: 125 }
  ];

  const locationPerformance = [
    { location: 'Dubai Mall', sales: 18450, orders: 12, avgOrder: 1538, performance: 95 },
    { location: 'Mall of Emirates', sales: 12850, orders: 8, avgOrder: 1606, performance: 88 },
    { location: 'Ibn Battuta', sales: 8250, orders: 5, avgOrder: 1650, performance: 82 },
    { location: 'City Centre Deira', sales: 5700, orders: 3, avgOrder: 1900, performance: 78 }
  ];

  const staffPerformance = [
    { name: 'Ahmed Al-Rashid', sales: 12450, orders: 8, avgOrder: 1556, rating: 4.9 },
    { name: 'Fatima Hassan', sales: 9850, orders: 7, avgOrder: 1407, rating: 4.8 },
    { name: 'Mohammed Ali', sales: 8250, orders: 5, avgOrder: 1650, rating: 4.7 },
    { name: 'Sara Ahmed', sales: 7450, orders: 6, avgOrder: 1242, rating: 4.6 },
    { name: 'Omar Ibrahim', sales: 7250, orders: 4, avgOrder: 1813, rating: 4.8 }
  ];

  const alerts = [
    {
      type: 'success',
      message: 'Dubai Mall exceeded daily target by 15%',
      time: '10 mins ago',
      icon: TrendingUp
    },
    {
      type: 'warning',
      message: 'Royal Oud Premium stock below 100 units',
      time: '25 mins ago',
      icon: Package
    },
    {
      type: 'info',
      message: '12 new customers registered today',
      time: '1 hour ago',
      icon: Users
    },
    {
      type: 'warning',
      message: 'Conversion rate dropped by 0.5%',
      time: '2 hours ago',
      icon: TrendingDown
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-cyan-600" />
            Real-Time Performance Dashboard
          </h1>
          <p className="text-muted-foreground">
            Live KPIs and business metrics updated every minute
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live
          </Badge>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">AED {realtimeMetrics.todaySales.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Sales Today</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% vs yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">{realtimeMetrics.todayOrders}</div>
            <div className="text-sm text-gray-600">Orders</div>
            <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
              <Clock className="h-3 w-3" />
              Last order: 5 mins ago
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Target className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-purple-600">AED {realtimeMetrics.avgOrderValue}</div>
            <div className="text-sm text-gray-600">Avg Order Value</div>
            <div className="flex items-center gap-1 text-xs text-purple-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              +7.7% vs target
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-2xl font-bold text-amber-600">{realtimeMetrics.activeSessions}</div>
            <div className="text-sm text-gray-600">Active Sessions</div>
            <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
              <Activity className="h-3 w-3" />
              Online now
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Real-time Tab */}
        <TabsContent value="realtime">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Hourly Performance</CardTitle>
                <CardDescription>Sales trend throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hourlyData.map((data, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">{data.hour}</div>
                        <Badge variant="outline">{data.orders} orders</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-gray-600">Sales</div>
                          <div className="font-bold text-green-600">AED {data.sales.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Customers</div>
                          <div className="font-semibold">{data.customers}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Avg Order</div>
                          <div className="font-semibold">AED {Math.round(data.sales / data.orders)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Metrics</CardTitle>
                <CardDescription>Current performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <span className="text-sm font-bold text-green-600">{realtimeMetrics.conversionRate}%</span>
                  </div>
                  <Progress value={realtimeMetrics.conversionRate * 10} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">142 visitors, 5 conversions</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Cart Abandonment</span>
                    <span className="text-sm font-bold text-red-600">{realtimeMetrics.cartAbandonment}%</span>
                  </div>
                  <Progress value={realtimeMetrics.cartAbandonment} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">8 abandoned carts</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <span className="text-sm font-bold text-blue-600">2.3 mins</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">Target: &lt;3 mins</div>
                </div>

                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="text-sm font-medium text-green-900 mb-1">Peak Hour</div>
                  <div className="text-2xl font-bold text-green-600">4:00 PM - 5:00 PM</div>
                  <div className="text-xs text-green-700 mt-1">Average peak sales: AED 7,250</div>
                </div>

                <div className="text-xs text-gray-500 text-right">
                  Last updated: {realtimeMetrics.lastUpdated}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${
                          kpi.status === 'exceeding' ? 'bg-green-100' :
                          kpi.status === 'on-track' ? 'bg-blue-100' :
                          'bg-red-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            kpi.status === 'exceeding' ? 'text-green-600' :
                            kpi.status === 'on-track' ? 'text-blue-600' :
                            'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">{kpi.name}</div>
                          <div className="text-2xl font-bold">{kpi.value}</div>
                        </div>
                      </div>
                      <Badge className={
                        kpi.status === 'exceeding' ? 'bg-green-100 text-green-800' :
                        kpi.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {kpi.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress to Target</span>
                        <span className="font-semibold">{kpi.progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={kpi.progress} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Target: {kpi.target}</span>
                        {kpi.change !== 0 && (
                          <span className={`flex items-center gap-1 ${
                            kpi.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> :
                             kpi.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                            {kpi.change > 0 ? '+' : ''}{kpi.change}%
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products Today</CardTitle>
              <CardDescription>Best sellers by revenue and units</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.sold} units sold</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">AED {product.revenue.toLocaleString()}</div>
                        <Badge variant="outline" className="mt-1">
                          Stock: {product.stock}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.trend === 'up' && (
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trending Up
                        </Badge>
                      )}
                      {product.trend === 'down' && (
                        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          Trending Down
                        </Badge>
                      )}
                      {product.trend === 'stable' && (
                        <Badge className="bg-gray-100 text-gray-800">
                          Stable
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Location Performance</CardTitle>
              <CardDescription>Sales by store location today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationPerformance.map((loc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-lg">{loc.location}</div>
                      <Badge className={
                        loc.performance >= 90 ? 'bg-green-100 text-green-800' :
                        loc.performance >= 80 ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }>
                        {loc.performance}% Performance
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Sales</div>
                        <div className="text-lg font-bold text-green-600">AED {loc.sales.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Orders</div>
                        <div className="text-lg font-bold">{loc.orders}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Avg Order</div>
                        <div className="text-lg font-bold text-purple-600">AED {loc.avgOrder}</div>
                      </div>
                    </div>
                    <Progress value={loc.performance} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>Top performing sales staff today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffPerformance.map((staff, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{staff.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className={`h-3 w-3 rounded-full ${
                                i < Math.floor(staff.rating) ? 'bg-amber-500' : 'bg-gray-300'
                              }`}></div>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{staff.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">AED {staff.sales.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{staff.orders} orders</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div>
                        <div className="text-xs text-gray-600">Avg Order Value</div>
                        <div className="font-semibold text-purple-600">AED {staff.avgOrder}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Conversion Rate</div>
                        <div className="font-semibold text-blue-600">
                          {((staff.orders / 20) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Performance Alerts</CardTitle>
              <CardDescription>Real-time notifications and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, index) => {
                  const Icon = alert.icon;
                  return (
                    <div key={index} className={`flex items-start gap-3 p-4 border rounded-lg ${
                      alert.type === 'success' ? 'bg-green-50 border-green-200' :
                      alert.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <Icon className={`h-5 w-5 mt-0.5 ${
                        alert.type === 'success' ? 'text-green-600' :
                        alert.type === 'warning' ? 'text-amber-600' :
                        'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <div className={`font-medium ${
                          alert.type === 'success' ? 'text-green-900' :
                          alert.type === 'warning' ? 'text-amber-900' :
                          'text-blue-900'
                        }`}>
                          {alert.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{alert.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
