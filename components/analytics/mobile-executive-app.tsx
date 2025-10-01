'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Bell,
  BellOff,
  RefreshCw,
  Share2,
  Download,
  Menu,
  X,
  Home,
  PieChart,
  Target,
  Calendar,
  Settings,
  LogOut,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Star,
  Eye,
  EyeOff,
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
  ResponsiveContainer,
} from 'recharts';

interface MobileKPI {
  id: string;
  title: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
}

interface MobileExecutiveAppProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F'];

export default function MobileExecutiveApp({ user }: MobileExecutiveAppProps) {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kpis, setKPIs] = useState<MobileKPI[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const quickActions: QuickAction[] = [
    {
      id: 'sales-report',
      title: 'Sales Report',
      description: 'View today\'s sales performance',
      icon: 'chart',
      color: '#22c55e',
      action: () => setActiveView('sales'),
    },
    {
      id: 'inventory-alert',
      title: 'Inventory Alerts',
      description: 'Check stock levels',
      icon: 'package',
      color: '#f59e0b',
      action: () => setActiveView('inventory'),
    },
    {
      id: 'customer-insights',
      title: 'Customer Insights',
      description: 'Latest customer analytics',
      icon: 'users',
      color: '#3b82f6',
      action: () => setActiveView('customers'),
    },
    {
      id: 'financial-summary',
      title: 'Financial Summary',
      description: 'Revenue and profit overview',
      icon: 'dollar',
      color: '#8b5cf6',
      action: () => setActiveView('finance'),
    },
  ];

  const fetchMobileData = useCallback(async () => {
    try {
      setLoading(true);

      const [kpiRes, notificationsRes, activityRes, chartsRes] = await Promise.all([
        fetch('/api/analytics/mobile?type=kpis'),
        fetch('/api/analytics/mobile?type=notifications'),
        fetch('/api/analytics/mobile?type=activity'),
        fetch('/api/analytics/mobile?type=charts'),
      ]);

      const [kpiData, notificationsData, activityData, chartsData] = await Promise.all([
        kpiRes.json(),
        notificationsRes.json(),
        activityRes.json(),
        chartsRes.json(),
      ]);

      setKPIs(kpiData.kpis || []);
      setNotifications(notificationsData.notifications || []);
      setRecentActivity(activityData.activity || []);
      setChartData(chartsData.charts || []);

    } catch (error) {
      console.error('Error fetching mobile data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMobileData();
    const interval = setInterval(fetchMobileData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchMobileData]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M AED`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K AED`;
    return `${value.toFixed(0)} AED`;
  };

  const formatNumber = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'AED') return formatCurrency(value);
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up' || change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend === 'down' || change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  };

  const getQuickActionIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      chart: <BarChart3 className="h-6 w-6" />,
      package: <Package className="h-6 w-6" />,
      users: <Users className="h-6 w-6" />,
      dollar: <DollarSign className="h-6 w-6" />,
    };
    return iconMap[iconName] || <Activity className="h-6 w-6" />;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'sales', label: 'Sales', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-oud-500 mx-auto mb-4" />
          <p className="text-oud-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-oud-800">Oud PMS</h1>
              <p className="text-xs text-oud-600">Executive Mobile</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              {notificationsEnabled ? (
                <Bell className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={fetchMobileData}>
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-oud-100 rounded-full flex items-center justify-center">
                    <span className="text-oud-700 font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-oud-800">{user?.name || 'Executive'}</p>
                    <p className="text-sm text-oud-600">{user?.role || 'Manager'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {activeView === 'dashboard' && (
          <>
            {/* Critical Alerts */}
            {notifications.filter(n => n.priority === 'high' && !n.read).length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="font-medium text-red-800">Critical Alerts</h3>
                      <p className="text-sm text-red-600">
                        {notifications.filter(n => n.priority === 'high' && !n.read).length} alerts require attention
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {kpis.slice(0, 4).map((kpi) => (
                <Card key={kpi.id} className="card-luxury">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${kpi.color}20` }}
                      >
                        <div style={{ color: kpi.color }}>
                          {kpi.icon === 'revenue' && <DollarSign className="h-4 w-4" />}
                          {kpi.icon === 'customers' && <Users className="h-4 w-4" />}
                          {kpi.icon === 'orders' && <ShoppingCart className="h-4 w-4" />}
                          {kpi.icon === 'inventory' && <Package className="h-4 w-4" />}
                        </div>
                      </div>
                      {getTrendIcon(kpi.trend, kpi.change)}
                    </div>
                    <h3 className="text-xs font-medium text-oud-600 mb-1">{kpi.title}</h3>
                    <p className="text-lg font-bold text-oud-800">
                      {formatNumber(kpi.value, kpi.unit)}
                    </p>
                    <p className={`text-xs ${
                      kpi.change > 0 ? 'text-green-600' : kpi.change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={action.action}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${action.color}20` }}
                      >
                        <div style={{ color: action.color }}>
                          {getQuickActionIcon(action.icon)}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-oud-800 text-sm">{action.title}</p>
                        <p className="text-xs text-oud-600">{action.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chart Overview */}
            <Card className="card-luxury">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Revenue Trend</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCardExpansion('chart')}
                  >
                    {expandedCards.has('chart') ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer
                  width="100%"
                  height={expandedCards.has('chart') ? 250 : 150}
                >
                  <AreaChart data={chartData}>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8B4513"
                      fill="#8B4513"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                {expandedCards.has('chart') && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-oud-600">This Month</p>
                      <p className="text-lg font-bold text-oud-800">
                        {formatCurrency(chartData[chartData.length - 1]?.revenue || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-oud-600">Growth</p>
                      <p className="text-lg font-bold text-green-600">+12.5%</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card className="card-luxury">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Alerts</CardTitle>
                  <Badge className="bg-red-100 text-red-600">
                    {notifications.filter(n => !n.read).length} New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                        notification.read
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-white border-oud-200'
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-oud-800">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-oud-600 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-oud-500 mt-1">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-oud-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-oud-800">{activity.description}</p>
                        <p className="text-xs text-oud-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Sales View */}
        {activeView === 'sales' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-oud-800">Sales Performance</h2>

            <div className="grid grid-cols-2 gap-4">
              <Card className="card-luxury">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-oud-800">2.1M AED</p>
                  <p className="text-sm text-oud-600">Today's Sales</p>
                </CardContent>
              </Card>

              <Card className="card-luxury">
                <CardContent className="p-4 text-center">
                  <ShoppingCart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-oud-800">142</p>
                  <p className="text-sm text-oud-600">Orders Today</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Sales Trend (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData.slice(-7)}>
                    <XAxis dataKey="day" />
                    <YAxis hide />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Line
                      type="monotone"
                      dataKey="dailySales"
                      stroke="#8B4513"
                      strokeWidth={3}
                      dot={{ fill: '#8B4513', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other views would be implemented similarly */}
        {activeView !== 'dashboard' && activeView !== 'sales' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-oud-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-oud-500" />
            </div>
            <h3 className="text-lg font-medium text-oud-800 mb-2">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)} View
            </h3>
            <p className="text-oud-600">This section is under development</p>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="grid grid-cols-4 gap-1 p-2">
          {sidebarItems.slice(0, 4).map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              size="sm"
              className="flex flex-col gap-1 h-auto py-2"
              onClick={() => setActiveView(item.id)}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20 md:hidden" />
    </div>
  );
}