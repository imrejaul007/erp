'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  Globe,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Maximize2,
  Bell,
  BellOff,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar,
} from 'recharts';

interface ExecutiveKPI {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  icon: string;
  description: string;
}

interface BusinessMetric {
  category: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
  trend: number;
}

interface RegionalPerformance {
  region: string;
  revenue: number;
  growth: number;
  marketShare: number;
  customers: number;
  stores: number;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  category: string;
  actionRequired: boolean;
}

interface ExecutiveDashboardProps {
  refreshInterval?: number;
  realTime?: boolean;
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F'];
const KPI_COLORS = {
  excellent: '#22c55e',
  good: '#3b82f6',
  warning: '#f59e0b',
  critical: '#ef4444',
};

export default function ExecutiveDashboard({ refreshInterval = 30000, realTime = true }: ExecutiveDashboardProps) {
  const [kpis, setKPIs] = useState<ExecutiveKPI[]>([]);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetric[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalPerformance[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [operationalData, setOperationalData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [
        kpiRes,
        metricsRes,
        regionalRes,
        alertsRes,
        revenueRes,
        performanceRes,
        marketRes,
        operationalRes,
      ] = await Promise.all([
        fetch('/api/analytics/executive?type=kpis'),
        fetch('/api/analytics/executive?type=metrics'),
        fetch('/api/analytics/executive?type=regional'),
        fetch('/api/analytics/executive?type=alerts'),
        fetch('/api/analytics/executive?type=revenue'),
        fetch('/api/analytics/executive?type=performance'),
        fetch('/api/analytics/executive?type=market'),
        fetch('/api/analytics/executive?type=operational'),
      ]);

      const [
        kpiData,
        metricsData,
        regionalData,
        alertsData,
        revenueData,
        performanceData,
        marketData,
        operationalData,
      ] = await Promise.all([
        kpiRes.json(),
        metricsRes.json(),
        regionalRes.json(),
        alertsRes.json(),
        revenueRes.json(),
        performanceRes.json(),
        marketRes.json(),
        operationalRes.json(),
      ]);

      setKPIs(kpiData.kpis || []);
      setBusinessMetrics(metricsData.metrics || []);
      setRegionalData(regionalData.regional || []);
      setAlerts(alertsData.alerts || []);
      setRevenueData(revenueData.revenue || []);
      setPerformanceData(performanceData.performance || []);
      setMarketData(marketData.market || []);
      setOperationalData(operationalData.operational || {});
      setLastUpdated(new Date());

      // Show notifications for critical alerts
      if (notificationsEnabled && alertsData.alerts) {
        const criticalAlerts = alertsData.alerts.filter((alert: Alert) =>
          alert.type === 'critical' && alert.actionRequired
        );

        criticalAlerts.forEach((alert: Alert) => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Critical Alert: ${alert.title}`, {
              body: alert.message,
              icon: '/favicon.ico',
            });
          }
        });
      }

    } catch (error) {
      console.error('Error fetching executive dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    fetchDashboardData();

    // Request notification permission
    if (notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }

    let interval: NodeJS.Timeout;
    if (realTime && refreshInterval > 0) {
      interval = setInterval(fetchDashboardData, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchDashboardData, realTime, refreshInterval]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'AED') return formatCurrency(value);
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const getKPIStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'excellent';
    if (percentage >= 85) return 'good';
    if (percentage >= 70) return 'warning';
    return 'critical';
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up' || change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend === 'down' || change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  };

  const getKPIIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      revenue: <DollarSign className="h-6 w-6" />,
      customers: <Users className="h-6 w-6" />,
      orders: <ShoppingCart className="h-6 w-6" />,
      inventory: <Package className="h-6 w-6" />,
      target: <Target className="h-6 w-6" />,
      activity: <Activity className="h-6 w-6" />,
      award: <Award className="h-6 w-6" />,
      globe: <Globe className="h-6 w-6" />,
    };
    return iconMap[iconName] || <BarChart3 className="h-6 w-6" />;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading executive dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-oud-800">Executive Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-sm text-oud-600">
              Live • Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            {notificationsEnabled ? (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Notifications On
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Notifications Off
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {alerts.filter(a => a.type === 'critical').length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="font-medium text-red-800">
                  {alerts.filter(a => a.type === 'critical').length} Critical Alert(s) Require Attention
                </h3>
                <p className="text-sm text-red-600">
                  {alerts.filter(a => a.type === 'critical')[0]?.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.slice(0, 8).map((kpi) => {
          const status = getKPIStatus(kpi.value, kpi.target);
          return (
            <Card key={kpi.id} className="card-luxury relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-1 h-full"
                style={{ backgroundColor: KPI_COLORS[status] }}
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${KPI_COLORS[status]}20` }}
                  >
                    <div style={{ color: KPI_COLORS[status] }}>
                      {getKPIIcon(kpi.icon)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(kpi.trend, kpi.change)}
                    <span className={`text-sm font-medium ${
                      kpi.change > 0 ? 'text-green-600' : kpi.change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <h3 className="text-sm font-medium text-oud-600">{kpi.title}</h3>
                  <p className="text-2xl font-bold text-oud-800">
                    {formatNumber(kpi.value, kpi.unit)}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-oud-500">
                    Target: {formatNumber(kpi.target, kpi.unit)}
                  </span>
                  <Badge
                    className={`text-xs`}
                    style={{
                      backgroundColor: KPI_COLORS[status],
                      color: 'white',
                    }}
                  >
                    {Math.round((kpi.value / kpi.target) * 100)}%
                  </Badge>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div
                    className="h-1 rounded-full transition-all"
                    style={{
                      backgroundColor: KPI_COLORS[status],
                      width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend */}
            <Card className="card-luxury lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-oud-500" />
                  Revenue Performance
                </CardTitle>
                <CardDescription>Monthly revenue vs targets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      fill="#8B4513"
                      fillOpacity={0.3}
                      stroke="#8B4513"
                      strokeWidth={3}
                      name="Actual Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#D2B48C"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target"
                    />
                    <Bar dataKey="profit" fill="#CD853F" name="Profit" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Business Metrics */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Business Metrics</CardTitle>
                <CardDescription>Key business indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessMetrics.slice(0, 6).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-oud-200 rounded">
                      <div>
                        <p className="font-medium text-oud-800">{metric.category}</p>
                        <p className="text-sm text-oud-600">
                          vs Previous: {formatNumber(metric.previous, metric.unit)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-oud-800">
                          {formatNumber(metric.current, metric.unit)}
                        </p>
                        <div className="flex items-center gap-1">
                          {getTrendIcon('', metric.trend)}
                          <span className={`text-sm ${
                            metric.trend > 0 ? 'text-green-600' : metric.trend < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Performance */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-oud-500" />
                  Sales Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart data={performanceData.slice(0, 6)}>
                    <RadialBar
                      dataKey="performance"
                      cornerRadius={10}
                      fill="#8B4513"
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Performance']}
                    />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Share */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-oud-500" />
                  Market Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value}%`,
                        name
                      ]}
                    />
                    <Legend />
                    <RechartsPieChart
                      data={marketData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="share"
                      nameKey="category"
                    >
                      {marketData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Overview */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Key financial metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(operationalData.grossRevenue || 0)}
                    </p>
                    <p className="text-sm text-green-600">Gross Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(operationalData.netProfit || 0)}
                    </p>
                    <p className="text-sm text-blue-600">Net Profit</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-2xl font-bold text-orange-600">
                      {operationalData.profitMargin || 0}%
                    </p>
                    <p className="text-sm text-orange-600">Profit Margin</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded">
                    <p className="text-2xl font-bold text-purple-600">
                      {operationalData.roi || 0}%
                    </p>
                    <p className="text-sm text-purple-600">ROI</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="cashInflow"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                      name="Cash Inflow"
                    />
                    <Area
                      type="monotone"
                      dataKey="cashOutflow"
                      stackId="2"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Cash Outflow"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operational Tab */}
        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <Package className="h-8 w-8 text-oud-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-oud-800">
                  {operationalData.inventoryTurnover || 0}x
                </p>
                <p className="text-sm text-oud-600">Inventory Turnover</p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-oud-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-oud-800">
                  {operationalData.customerSatisfaction || 0}%
                </p>
                <p className="text-sm text-oud-600">Customer Satisfaction</p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-oud-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-oud-800">
                  {operationalData.orderFulfillment || 0}h
                </p>
                <p className="text-sm text-oud-600">Avg Fulfillment Time</p>
              </CardContent>
            </Card>
          </div>

          {/* Operational Efficiency */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Operational Efficiency Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-oud-800">Production Efficiency</h5>
                  <div className="space-y-3">
                    {['Quality Score', 'Production Speed', 'Resource Utilization', 'Waste Reduction'].map((metric, index) => (
                      <div key={metric} className="flex items-center justify-between">
                        <span className="text-oud-600">{metric}:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-oud-500"
                              style={{ width: `${85 + index * 3}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-oud-800">{85 + index * 3}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-oud-800">Customer Operations</h5>
                  <div className="space-y-3">
                    {['Order Accuracy', 'Delivery Speed', 'Customer Response', 'Return Rate'].map((metric, index) => (
                      <div key={metric} className="flex items-center justify-between">
                        <span className="text-oud-600">{metric}:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{ width: `${90 - index * 2}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-oud-800">{90 - index * 2}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Tab */}
        <TabsContent value="regional" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-oud-500" />
                Regional Performance
              </CardTitle>
              <CardDescription>Performance breakdown by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Region</th>
                      <th className="text-right py-2 px-4 text-oud-700">Revenue</th>
                      <th className="text-right py-2 px-4 text-oud-700">Growth</th>
                      <th className="text-right py-2 px-4 text-oud-700">Market Share</th>
                      <th className="text-right py-2 px-4 text-oud-700">Customers</th>
                      <th className="text-right py-2 px-4 text-oud-700">Stores</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((region) => (
                      <tr key={region.region} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4 font-medium text-oud-800">{region.region}</td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatCurrency(region.revenue)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            {getTrendIcon('', region.growth)}
                            <span className={`${
                              region.growth > 0 ? 'text-green-600' : region.growth < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {region.growth > 0 ? '+' : ''}{region.growth.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {region.marketShare.toFixed(1)}%
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {region.customers.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {region.stores}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-oud-500" />
                System Alerts & Notifications
              </CardTitle>
              <CardDescription>Critical alerts requiring executive attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <p className="text-center text-oud-600 py-8">No active alerts</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-4 ${
                        alert.type === 'critical'
                          ? 'border-red-200 bg-red-50'
                          : alert.type === 'warning'
                          ? 'border-orange-200 bg-orange-50'
                          : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-oud-800">{alert.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`text-xs ${
                                  alert.type === 'critical'
                                    ? 'bg-red-100 text-red-600'
                                    : alert.type === 'warning'
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'bg-blue-100 text-blue-600'
                                }`}
                              >
                                {alert.type.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-oud-500">
                                {alert.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-oud-600 mb-2">{alert.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-oud-500">Category: {alert.category}</span>
                            {alert.actionRequired && (
                              <Button size="sm" variant="outline">
                                Take Action
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}