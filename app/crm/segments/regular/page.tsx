'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  Users,
  TrendingUp,
  Star,
  ShoppingBag,
  Heart,
  Gift,
  Target,
  Calendar,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Send,
  Eye,
  ArrowUpRight,
  Percent,
  Clock,
  Package,
  Award,
  Zap,
  UserPlus,
  BarChart3,
  PieChart,
  RefreshCw,
  ArrowLeft} from 'lucide-react';
import { LoyaltyTier } from '@/types/crm';

interface RegularCustomer {
  id: string;
  code: string;
  name: string;
  nameArabic?: string;
  email?: string;
  phone?: string;
  emirate?: string;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  totalLifetimeValue: number;
  totalOrders: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  joinDate: string;
  daysSinceLastPurchase?: number;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  engagementScore: number;
  purchaseFrequency: 'HIGH' | 'MEDIUM' | 'LOW';
  riskOfChurn: 'LOW' | 'MEDIUM' | 'HIGH';
  preferredCategories: string[];
  seasonalPattern: string;
  isActive: boolean;
  upgradeEligibility: {
    toVIP: boolean;
    pointsNeeded?: number;
    spendingNeeded?: number;
  };
}

interface RegularCustomerStats {
  totalRegularCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  averageLifetimeValue: number;
  averageOrderValue: number;
  retentionRate: number;
  engagementScore: number;
  upgradeEligible: number;
  tierDistribution: {
    bronze: number;
    silver: number;
    gold: number;
  };
  churnRisk: {
    low: number;
    medium: number;
    high: number;
  };
  monthlyTrends: Array<{
    month: string;
    newCustomers: number;
    revenue: number;
    retention: number;
  }>;
}

interface EngagementCampaign {
  id: string;
  name: string;
  type: 'WELCOME' | 'RETENTION' | 'UPSELL' | 'REACTIVATION' | 'LOYALTY';
  targetSegment: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startDate: string;
  endDate?: string;
  targetCustomers: number;
  reached: number;
  converted: number;
  conversionRate: number;
  description: string;
}

interface CustomerInsight {
  customerId: string;
  customerName: string;
  insightType: 'REPEAT_PURCHASE' | 'CATEGORY_PREFERENCE' | 'SEASONAL_TREND' | 'PRICE_SENSITIVITY' | 'CHURN_RISK';
  title: string;
  description: string;
  recommendation: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  actionable: boolean;
  createdAt: string;
}

const TIER_COLORS = {
  BRONZE: '#CD7F32',
  SILVER: '#C0C0C0',
  GOLD: '#FFD700'
};

const ENGAGEMENT_PROGRAMS = [
  {
    icon: Gift,
    title: 'Welcome Series',
    description: 'Multi-step onboarding for new customers',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Star,
    title: 'Loyalty Rewards',
    description: 'Points-based engagement program',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Heart,
    title: 'Birthday Club',
    description: 'Special offers on customer birthdays',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    icon: Zap,
    title: 'Flash Sales',
    description: 'Limited-time offers to drive urgency',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Package,
    title: 'Restock Alerts',
    description: 'Notifications for favorite products',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Target,
    title: 'Personalized Offers',
    description: 'AI-driven product recommendations',
    color: 'bg-indigo-100 text-indigo-600'
  }
];

export default function RegularCustomerManagementPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<RegularCustomer[]>([]);
  const [stats, setStats] = useState<RegularCustomerStats | null>(null);
  const [campaigns, setCampaigns] = useState<EngagementCampaign[]>([]);
  const [insights, setInsights] = useState<CustomerInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<RegularCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [engagementFilter, setEngagementFilter] = useState('all');

  useEffect(() => {
    fetchRegularCustomerData();
  }, []);

  const fetchRegularCustomerData = async () => {
    try {
      setLoading(true);
      const [customersRes, statsRes, campaignsRes, insightsRes] = await Promise.all([
        fetch('/api/crm/segments/regular/customers'),
        fetch('/api/crm/segments/regular/stats'),
        fetch('/api/crm/campaigns/engagement'),
        fetch('/api/crm/customer-insights')
      ]);

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData.customers || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData.insights || []);
      }
    } catch (error) {
      console.error('Error fetching regular customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || customer.loyaltyTier === tierFilter;
    const matchesRisk = riskFilter === 'all' || customer.riskOfChurn === riskFilter;
    const matchesEngagement = engagementFilter === 'all' || customer.purchaseFrequency === engagementFilter;

    return matchesSearch && matchesTier && matchesRisk && matchesEngagement;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'default';
      case 'MEDIUM': return 'secondary';
      case 'HIGH': return 'destructive';
      default: return 'outline';
    }
  };

  const getTierIcon = (tier: LoyaltyTier) => {
    switch (tier) {
      case LoyaltyTier.BRONZE: return <Award className="w-4 h-4" style={{ color: TIER_COLORS.BRONZE }} />;
      case LoyaltyTier.SILVER: return <Star className="w-4 h-4" style={{ color: TIER_COLORS.SILVER }} />;
      case LoyaltyTier.GOLD: return <Award className="w-4 h-4" style={{ color: TIER_COLORS.GOLD }} />;
      default: return <Award className="w-4 h-4" />;
    }
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

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Regular Customer Management</h1>
            <p className="text-gray-600 mt-1">Engage and retain your core customer base</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRegularCustomerData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
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
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.totalRegularCustomers)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newCustomersThisMonth} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lifetime Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.averageLifetimeValue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg order: {formatCurrency(stats.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.retentionRate}%</div>
            <p className="text-xs text-muted-foreground">
              12-month retention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upgrade Eligible</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.upgradeEligible}</div>
            <p className="text-xs text-muted-foreground">
              Ready for VIP promotion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tier & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Tier Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" style={{ color: TIER_COLORS.BRONZE }} />
                  <span>Bronze</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Progress value={(stats.tierDistribution.bronze / stats.totalRegularCustomers) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{stats.tierDistribution.bronze}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" style={{ color: TIER_COLORS.SILVER }} />
                  <span>Silver</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Progress value={(stats.tierDistribution.silver / stats.totalRegularCustomers) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{stats.tierDistribution.silver}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" style={{ color: TIER_COLORS.GOLD }} />
                  <span>Gold</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Progress value={(stats.tierDistribution.gold / stats.totalRegularCustomers) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{stats.tierDistribution.gold}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Churn Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Low Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Progress value={(stats.churnRisk.low / stats.totalRegularCustomers) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{stats.churnRisk.low}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Progress value={(stats.churnRisk.medium / stats.totalRegularCustomers) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{stats.churnRisk.medium}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Progress value={(stats.churnRisk.high / stats.totalRegularCustomers) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{stats.churnRisk.high}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Customer Engagement Programs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ENGAGEMENT_PROGRAMS.map((program, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${program.color}`}>
                  <program.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{program.title}</div>
                  <div className="text-sm text-gray-600">{program.description}</div>
                  <Button size="sm" variant="outline" className="mt-2">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="customers" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">Customer Directory</TabsTrigger>
          <TabsTrigger value="campaigns">Engagement Campaigns</TabsTrigger>
          <TabsTrigger value="insights">Customer Insights</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Customer Directory Tab */}
        <TabsContent value="customers" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Regular Customer Directory
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="BRONZE">Bronze</SelectItem>
                      <SelectItem value="SILVER">Silver</SelectItem>
                      <SelectItem value="GOLD">Gold</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Lifetime Value</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.slice(0, 10).map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`/avatars/${customer.id}.jpg`} />
                            <AvatarFallback>
                              {customer.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            {customer.nameArabic && (
                              <div className="text-sm text-gray-600" dir="rtl">
                                {customer.nameArabic}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">{customer.code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 w-fit"
                          style={{
                            backgroundColor: `${TIER_COLORS[customer.loyaltyTier as keyof typeof TIER_COLORS]}20`,
                            color: TIER_COLORS[customer.loyaltyTier as keyof typeof TIER_COLORS]
                          }}
                        >
                          {getTierIcon(customer.loyaltyTier)}
                          {customer.loyaltyTier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{formatCurrency(customer.totalLifetimeValue)}</div>
                          <div className="text-sm text-gray-600">
                            {customer.totalOrders} orders
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <Progress value={customer.engagementScore} className="h-2" />
                          </div>
                          <span className={`text-sm font-medium ${getEngagementColor(customer.engagementScore)}`}>
                            {customer.engagementScore}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(customer.riskOfChurn)}>
                          {customer.riskOfChurn}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never'}
                          {customer.daysSinceLastPurchase && (
                            <div className="text-xs text-gray-500">
                              {customer.daysSinceLastPurchase} days ago
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          {customer.upgradeEligibility.toVIP && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                              Upgrade
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Active Engagement Campaigns
                </CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-lg">{campaign.name}</h3>
                            <Badge
                              variant={
                                campaign.status === 'ACTIVE' ? 'default' :
                                campaign.status === 'COMPLETED' ? 'secondary' :
                                campaign.status === 'PAUSED' ? 'destructive' : 'outline'
                              }
                            >
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline">{campaign.type}</Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{campaign.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-gray-600">Target</div>
                              <div className="font-semibold">{formatNumber(campaign.targetCustomers)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Reached</div>
                              <div className="font-semibold">{formatNumber(campaign.reached)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Converted</div>
                              <div className="font-semibold">{formatNumber(campaign.converted)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Conversion Rate</div>
                              <div className="font-semibold text-green-600">{campaign.conversionRate}%</div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Progress
                              value={(campaign.reached / campaign.targetCustomers) * 100}
                              className="h-2"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
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

        {/* Customer Insights Tab */}
        <TabsContent value="insights" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                AI-Powered Customer Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <Card key={insight.customerId + insight.insightType}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{insight.title}</h4>
                            <Badge
                              variant={
                                insight.priority === 'HIGH' ? 'destructive' :
                                insight.priority === 'MEDIUM' ? 'secondary' : 'outline'
                              }
                            >
                              {insight.priority} Priority
                            </Badge>
                            {insight.actionable && (
                              <Badge variant="default">Actionable</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            Customer: {insight.customerName} • {formatDate(insight.createdAt)}
                          </div>
                          <p className="text-gray-700 mb-3">{insight.description}</p>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm font-medium text-blue-800 mb-1">Recommendation:</div>
                            <div className="text-sm text-blue-700">{insight.recommendation}</div>
                          </div>
                        </div>
                        {insight.actionable && (
                          <Button size="sm">
                            <Send className="w-3 h-3 mr-1" />
                            Take Action
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monthly Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlyTrends.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium">{month.month}</div>
                      <div className="w-32">
                        <Progress
                          value={(month.newCustomers / Math.max(...stats.monthlyTrends.map(m => m.newCustomers))) * 100}
                          className="h-3"
                        />
                      </div>
                    </div>
                    <div className="flex gap-8 text-sm">
                      <div>
                        <div className="text-gray-600">New Customers</div>
                        <div className="font-semibold">{month.newCustomers}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Revenue</div>
                        <div className="font-semibold">{formatCurrency(month.revenue)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Retention</div>
                        <div className="font-semibold">{month.retention}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customer Profile Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTierIcon(selectedCustomer.loyaltyTier)}
                {selectedCustomer.name} - Customer Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6">
              {/* Customer Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Total Spent</Label>
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(selectedCustomer.totalLifetimeValue)}
                  </div>
                </div>
                <div>
                  <Label>Loyalty Points</Label>
                  <div className="text-xl font-bold text-purple-600">
                    {formatNumber(selectedCustomer.loyaltyPoints)}
                  </div>
                </div>
                <div>
                  <Label>Engagement Score</Label>
                  <div className={`text-xl font-bold ${getEngagementColor(selectedCustomer.engagementScore)}`}>
                    {selectedCustomer.engagementScore}%
                  </div>
                </div>
                <div>
                  <Label>Purchase Frequency</Label>
                  <Badge variant="secondary">{selectedCustomer.purchaseFrequency}</Badge>
                </div>
              </div>

              <Separator />

              {/* Preferences */}
              <div>
                <Label className="text-lg">Customer Preferences</Label>
                <div className="mt-3">
                  <div className="text-sm text-gray-600 mb-2">Preferred Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.preferredCategories.map((category, index) => (
                      <Badge key={index} variant="outline">{category}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Seasonal Pattern</div>
                  <Badge variant="secondary">{selectedCustomer.seasonalPattern}</Badge>
                </div>
              </div>

              {/* Upgrade Eligibility */}
              {selectedCustomer.upgradeEligibility.toVIP && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">VIP Upgrade Eligible</span>
                  </div>
                  <div className="text-sm text-purple-700">
                    This customer qualifies for VIP tier promotion based on their purchase history and engagement.
                  </div>
                  {selectedCustomer.upgradeEligibility.spendingNeeded && (
                    <div className="text-sm text-purple-600 mt-1">
                      Needs {formatCurrency(selectedCustomer.upgradeEligibility.spendingNeeded)} more spending
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <Gift className="w-4 h-4 mr-2" />
                  Send Offer
                </Button>
                {selectedCustomer.upgradeEligibility.toVIP && (
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Promote to VIP
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}