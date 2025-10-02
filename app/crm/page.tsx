'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users,
  Star,
  TrendingUp,
  Award,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Gift,
  Crown,
  Target,
  BarChart3,
  UserCheck,
  Headphones
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface CRMStats {
  overview: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    vipCustomers: number;
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    customerSatisfactionScore: number;
  };
  loyalty: {
    totalMembers: number;
    totalPoints: number;
    totalEarned: number;
    totalRedeemed: number;
    redemptionRate: number;
  };
  segments: Array<{
    segment: string;
    _count: { segment: number };
    _sum: { totalLifetimeValue: number };
  }>;
}

interface Customer {
  id: string;
  code: string;
  name: string;
  nameArabic?: string;
  email?: string;
  phone?: string;
  segment: string;
  emirate?: string;
  loyaltyPoints: number;
  loyaltyTier: string;
  totalLifetimeValue: number;
  totalOrders: number;
  daysSinceLastOrder?: number;
  createdAt: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TIER_COLORS = {
  BRONZE: '#CD7F32',
  SILVER: '#C0C0C0',
  GOLD: '#FFD700',
  PLATINUM: '#E5E4E2',
  DIAMOND: '#B9F2FF'
};

const SEGMENT_COLORS = {
  VIP: '#9333EA',
  REGULAR: '#3B82F6',
  WHOLESALE: '#059669',
  EXPORT: '#DC2626'
};

export default function CRMDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
    fetchCustomers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/crm/analytics?type=dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/crm/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone?.includes(searchTerm);

    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter;
    const matchesTier = tierFilter === 'all' || customer.loyaltyTier === tierFilter;

    return matchesSearch && matchesSegment && matchesTier;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-AE').format(num);
  };

  if (loading || !stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const segmentData = stats.segments.map(segment => ({
    name: segment.segment,
    value: segment._count.segment,
    revenue: Number(segment._sum.totalLifetimeValue || 0)
  }));

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Relationship Management</h1>
          <p className="text-gray-600 mt-1">Manage customers, loyalty, and communications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/crm/comprehensive')}>
            <Users className="w-4 h-4 mr-2" />
            View All Customers
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/crm/add-customer')}>
            <Users className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
          <Button variant="outline" onClick={() => router.push('/crm/campaigns')}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Campaign
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.overview.totalCustomers)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overview.newCustomers} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.overview.activeCustomers)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.overview.activeCustomers / stats.overview.totalCustomers) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.overview.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(stats.overview.avgOrderValue)} per order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.overview.customerSatisfactionScore}/5</div>
            <p className="text-xs text-muted-foreground">
              Based on recent feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loyalty Program Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Members</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.loyalty.totalMembers)}</div>
            <p className="text-xs text-muted-foreground">
              Active loyalty accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.loyalty.totalPoints)}</div>
            <p className="text-xs text-muted-foreground">
              Available for redemption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.loyalty.totalEarned)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime points earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redemption Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.loyalty.redemptionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Points redeemed vs earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="customers" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="vip">VIP Portal</TabsTrigger>
        </TabsList>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Customer Database
                </CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Segments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Segments</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="REGULAR">Regular</SelectItem>
                      <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                      <SelectItem value="EXPORT">Export</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="BRONZE">Bronze</SelectItem>
                      <SelectItem value="SILVER">Silver</SelectItem>
                      <SelectItem value="GOLD">Gold</SelectItem>
                      <SelectItem value="PLATINUM">Platinum</SelectItem>
                      <SelectItem value="DIAMOND">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.slice(0, 10).map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {customer.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        {customer.nameArabic && (
                          <div className="text-sm text-gray-600" dir="rtl">{customer.nameArabic}</div>
                        )}
                        <div className="text-sm text-gray-500">
                          {customer.code} • {customer.email || customer.phone}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: `${SEGMENT_COLORS[customer.segment as keyof typeof SEGMENT_COLORS]}20`,
                              color: SEGMENT_COLORS[customer.segment as keyof typeof SEGMENT_COLORS]
                            }}
                          >
                            {customer.segment}
                          </Badge>
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: `${TIER_COLORS[customer.loyaltyTier as keyof typeof TIER_COLORS]}20`,
                              color: TIER_COLORS[customer.loyaltyTier as keyof typeof TIER_COLORS]
                            }}
                          >
                            {customer.loyaltyTier}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(customer.totalLifetimeValue)}</div>
                      <div className="text-sm text-gray-600">{customer.loyaltyPoints} points</div>
                      <div className="text-sm text-gray-500">{customer.totalOrders} orders</div>
                      {customer.daysSinceLastOrder && (
                        <div className="text-sm text-orange-600">
                          {customer.daysSinceLastOrder} days ago
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredCustomers.length > 10 && (
                  <div className="text-center py-4">
                    <Button variant="outline">
                      Load More ({filteredCustomers.length - 10} remaining)
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loyalty Tab */}
        <TabsContent value="loyalty" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {segmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segment Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={segmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Communication Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button className="h-20 flex-col" onClick={() => router.push('/crm/campaigns?type=email')}>
                  <Mail className="w-6 h-6 mb-2" />
                  Email Campaign
                </Button>
                <Button className="h-20 flex-col" variant="outline" onClick={() => router.push('/crm/campaigns?type=whatsapp')}>
                  <MessageSquare className="w-6 h-6 mb-2" />
                  WhatsApp Broadcast
                </Button>
                <Button className="h-20 flex-col" variant="outline" onClick={() => router.push('/crm/campaigns?type=sms')}>
                  <Phone className="w-6 h-6 mb-2" />
                  SMS Campaign
                </Button>
              </div>
              <div className="text-center text-gray-500">
                Communication history and templates will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Customer Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                Advanced analytics and reporting features will be available here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Customer Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                Support ticket management and customer service tools
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VIP Portal Tab */}
        <TabsContent value="vip" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                VIP Customer Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold">{stats.overview.vipCustomers}</div>
                  <div className="text-sm opacity-90">VIP Customers</div>
                </div>
                <div className="bg-gradient-to-br from-gold-500 to-yellow-600 text-white p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold">12</div>
                  <div className="text-sm opacity-90">Personal Shoppers</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold">98%</div>
                  <div className="text-sm opacity-90">Satisfaction Rate</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold">24/7</div>
                  <div className="text-sm opacity-90">Priority Support</div>
                </div>
              </div>
              <div className="text-center text-gray-500">
                VIP customer management and exclusive services
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}