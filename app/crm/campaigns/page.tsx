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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Send,
  MessageSquare,
  Mail,
  Phone,
  Globe,
  Target,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  Clock,
  BarChart3,
  PieChart,
  Settings,
  Plus,
  Eye,
  Edit,
  Play,
  Pause,
  Stop,
  Copy,
  Search,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Heart,
  Gift,
  Tag,
  Percent,
  Star,
  MapPin,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  ArrowLeft} from 'lucide-react';
import { CommunicationType } from '@/types/crm';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MarketingCampaign {
  id: string;
  name: string;
  nameArabic?: string;
  description: string;
  type: 'PROMOTIONAL' | 'SEASONAL' | 'LOYALTY' | 'WELCOME' | 'RETENTION' | 'REACTIVATION' | 'PRODUCT_LAUNCH';
  channel: CommunicationType;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  targetAudience: {
    segments: string[];
    tiers: string[];
    emirates: string[];
    ageGroups: string[];
    totalSize: number;
  };
  schedule: {
    startDate: string;
    endDate?: string;
    sendTime?: string;
    timezone: string;
    frequency?: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  };
  content: {
    subject?: string;
    message: string;
    messageArabic?: string;
    mediaUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
  metrics: {
    targetCount: number;
    sentCount: number;
    deliveredCount: number;
    openedCount: number;
    clickedCount: number;
    convertedCount: number;
    unsubscribedCount: number;
    revenue: number;
  };
  budget: {
    allocated: number;
    spent: number;
    costPerLead: number;
    roi: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface CampaignTemplate {
  id: string;
  name: string;
  nameArabic?: string;
  type: string;
  channel: CommunicationType;
  subject?: string;
  content: string;
  contentArabic?: string;
  variables: string[];
  category: string;
  isActive: boolean;
  usageCount: number;
  lastUsed?: string;
}

interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageConversionRate: number;
  totalRevenue: number;
  totalROI: number;
  channelPerformance: Array<{
    channel: CommunicationType;
    campaigns: number;
    sent: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    revenue: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    campaigns: number;
    sent: number;
    revenue: number;
    roi: number;
  }>;
  topPerformingCampaigns: Array<{
    id: string;
    name: string;
    type: string;
    channel: string;
    conversionRate: number;
    revenue: number;
  }>;
}

interface CustomerSegmentStats {
  segment: string;
  totalCustomers: number;
  activeCustomers: number;
  averageEngagement: number;
  preferredChannel: CommunicationType;
  bestTime: string;
  responseRate: number;
}

const CAMPAIGN_TYPES = [
  { value: 'PROMOTIONAL', label: 'Promotional Offers', icon: Percent, color: 'bg-green-100 text-green-600' },
  { value: 'SEASONAL', label: 'Seasonal Campaigns', icon: CalendarIcon, color: 'bg-blue-100 text-blue-600' },
  { value: 'LOYALTY', label: 'Loyalty Programs', icon: Heart, color: 'bg-purple-100 text-purple-600' },
  { value: 'WELCOME', label: 'Welcome Series', icon: Gift, color: 'bg-yellow-100 text-yellow-600' },
  { value: 'RETENTION', label: 'Customer Retention', icon: Target, color: 'bg-indigo-100 text-indigo-600' },
  { value: 'REACTIVATION', label: 'Reactivation', icon: Zap, color: 'bg-orange-100 text-orange-600' },
  { value: 'PRODUCT_LAUNCH', label: 'Product Launch', icon: Star, color: 'bg-pink-100 text-pink-600' }
];

const CHANNEL_CONFIGS = {
  SMS: { icon: Phone, color: 'text-green-600', name: 'SMS' },
  EMAIL: { icon: Mail, color: 'text-blue-600', name: 'Email' },
  WHATSAPP: { icon: MessageSquare, color: 'text-green-500', name: 'WhatsApp' },
  PHONE_CALL: { icon: Phone, color: 'text-purple-600', name: 'Phone Call' },
  IN_PERSON: { icon: Users, color: 'text-gray-600', name: 'In Person' }
};

export default function MarketingCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [segmentStats, setSegmentStats] = useState<CustomerSegmentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);

  useEffect(() => {
    fetchCampaignData();
  }, []);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      const [campaignsRes, templatesRes, statsRes, segmentsRes] = await Promise.all([
        fetch('/api/crm/campaigns'),
        fetch('/api/crm/campaign-templates'),
        fetch('/api/crm/campaigns/stats'),
        fetch('/api/crm/customer-segments/stats')
      ]);

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.templates || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (segmentsRes.ok) {
        const segmentsData = await segmentsRes.json();
        setSegmentStats(segmentsData.segments || []);
      }
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || campaign.channel === channelFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;

    return matchesSearch && matchesStatus && matchesChannel && matchesType;
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

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: 'outline' as const, color: 'text-gray-600' },
      SCHEDULED: { variant: 'secondary' as const, color: 'text-blue-600' },
      ACTIVE: { variant: 'default' as const, color: 'text-green-600' },
      PAUSED: { variant: 'secondary' as const, color: 'text-yellow-600' },
      COMPLETED: { variant: 'secondary' as const, color: 'text-purple-600' },
      CANCELLED: { variant: 'destructive' as const, color: 'text-red-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

    return (
      <Badge variant={config.variant} className={config.color}>
        {status.toLowerCase()}
      </Badge>
    );
  };

  const getChannelIcon = (channel: CommunicationType) => {
    const config = CHANNEL_CONFIGS[channel];
    if (config) {
      const IconComponent = config.icon;
      return <IconComponent className={`w-4 h-4 ${config.color}`} />;
    }
    return <MessageSquare className="w-4 h-4" />;
  };

  const getCampaignTypeIcon = (type: string) => {
    const campaignType = CAMPAIGN_TYPES.find(ct => ct.value === type);
    if (campaignType) {
      const IconComponent = campaignType.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <Target className="w-4 h-4" />;
  };

  const calculateEngagementRate = (campaign: MarketingCampaign) => {
    if (campaign.metrics.sentCount === 0) return 0;
    return ((campaign.metrics.openedCount + campaign.metrics.clickedCount) / campaign.metrics.sentCount) * 100;
  };

  const calculateConversionRate = (campaign: MarketingCampaign) => {
    if (campaign.metrics.sentCount === 0) return 0;
    return (campaign.metrics.convertedCount / campaign.metrics.sentCount) * 100;
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
            <Send className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Campaigns</h1>
            <p className="text-gray-600 mt-1">Create and manage multi-channel marketing campaigns</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCampaignData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setShowCreateTemplate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
          <Button onClick={() => setShowCreateCampaign(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.totalCampaigns)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCampaigns} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.totalSent)}</div>
            <p className="text-xs text-muted-foreground">
              Across all channels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatPercentage(stats.averageConversionRate)}</div>
            <p className="text-xs text-muted-foreground">
              Open: {formatPercentage(stats.averageOpenRate)} • Click: {formatPercentage(stats.averageClickRate)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              ROI: {formatPercentage(stats.totalROI)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Channel Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {stats.channelPerformance.map((channel) => (
              <div key={channel.channel} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  {getChannelIcon(channel.channel)}
                  <div>
                    <div className="font-semibold">{CHANNEL_CONFIGS[channel.channel]?.name || channel.channel}</div>
                    <div className="text-sm text-gray-600">{channel.campaigns} campaigns</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Messages Sent:</span>
                    <span className="font-medium">{formatNumber(channel.sent)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Open Rate:</span>
                    <span className="font-medium">{formatPercentage(channel.openRate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Click Rate:</span>
                    <span className="font-medium">{formatPercentage(channel.clickRate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conversion:</span>
                    <span className="font-medium">{formatPercentage(channel.conversionRate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Revenue:</span>
                    <span className="font-medium">{formatCurrency(channel.revenue)}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={channel.conversionRate} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Campaign Types & Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAMPAIGN_TYPES.map((type) => (
              <div key={type.value} className="flex items-center gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type.color}`}>
                  <type.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{type.label}</div>
                  <div className="text-sm text-gray-600">
                    {campaigns.filter(c => c.type === type.value).length} campaigns
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="audience">Audience Insights</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Active Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Marketing Campaigns
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={channelFilter} onValueChange={setChannelFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              {getCampaignTypeIcon(campaign.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{campaign.name}</h3>
                              {campaign.nameArabic && (
                                <p className="text-sm text-gray-600" dir="rtl">{campaign.nameArabic}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(campaign.status)}
                              <Badge variant="outline" className="flex items-center gap-1">
                                {getChannelIcon(campaign.channel)}
                                {CHANNEL_CONFIGS[campaign.channel]?.name || campaign.channel}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4">{campaign.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-600">Target Audience</div>
                              <div className="font-semibold">{formatNumber(campaign.targetAudience.totalSize)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Messages Sent</div>
                              <div className="font-semibold">{formatNumber(campaign.metrics.sentCount)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Conversion Rate</div>
                              <div className="font-semibold text-green-600">
                                {formatPercentage(calculateConversionRate(campaign))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Revenue Generated</div>
                              <div className="font-semibold">{formatCurrency(campaign.metrics.revenue)}</div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Campaign Progress</span>
                              <span>{Math.round((campaign.metrics.sentCount / campaign.metrics.targetCount) * 100)}%</span>
                            </div>
                            <Progress
                              value={(campaign.metrics.sentCount / campaign.metrics.targetCount) * 100}
                              className="h-2"
                            />
                          </div>

                          {/* Detailed Metrics */}
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="font-semibold text-blue-600">
                                {formatPercentage((campaign.metrics.deliveredCount / campaign.metrics.sentCount) * 100)}
                              </div>
                              <div className="text-blue-700">Delivered</div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                              <div className="font-semibold text-green-600">
                                {formatPercentage((campaign.metrics.openedCount / campaign.metrics.sentCount) * 100)}
                              </div>
                              <div className="text-green-700">Opened</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <div className="font-semibold text-purple-600">
                                {formatPercentage((campaign.metrics.clickedCount / campaign.metrics.sentCount) * 100)}
                              </div>
                              <div className="text-purple-700">Clicked</div>
                            </div>
                            <div className="text-center p-2 bg-orange-50 rounded">
                              <div className="font-semibold text-orange-600">
                                {formatCurrency(campaign.budget.roi)}
                              </div>
                              <div className="text-orange-700">ROI</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          {campaign.status === 'ACTIVE' ? (
                            <Button size="sm" variant="outline">
                              <Pause className="w-3 h-3 mr-1" />
                              Pause
                            </Button>
                          ) : campaign.status === 'PAUSED' ? (
                            <Button size="sm" variant="outline">
                              <Play className="w-3 h-3 mr-1" />
                              Resume
                            </Button>
                          ) : campaign.status === 'DRAFT' || campaign.status === 'SCHEDULED' ? (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Play className="w-3 h-3 mr-1" />
                              Launch
                            </Button>
                          ) : null}
                          <Button size="sm" variant="outline">
                            <Copy className="w-3 h-3 mr-1" />
                            Duplicate
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

        {/* Message Templates Tab */}
        <TabsContent value="templates" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Message Templates
                </CardTitle>
                <Button onClick={() => setShowCreateTemplate(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{template.name}</h3>
                          {template.nameArabic && (
                            <p className="text-sm text-gray-600" dir="rtl">{template.nameArabic}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {template.type}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                              {getChannelIcon(template.channel)}
                              {CHANNEL_CONFIGS[template.channel]?.name}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      {template.subject && (
                        <div className="mb-3">
                          <div className="text-sm text-gray-600">Subject:</div>
                          <div className="text-sm font-medium">{template.subject}</div>
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="text-sm text-gray-600">Content Preview:</div>
                        <div className="text-sm bg-gray-50 p-3 rounded-lg line-clamp-3">
                          {template.content}
                        </div>
                      </div>

                      {template.variables.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-600 mb-1">Variables:</div>
                          <div className="flex flex-wrap gap-1">
                            {template.variables.map((variable, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                        <span>Used {template.usageCount} times</span>
                        {template.lastUsed && (
                          <span>Last: {formatDate(template.lastUsed)}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Copy className="w-3 h-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Insights Tab */}
        <TabsContent value="audience" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Segment Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {segmentStats.map((segment) => (
                  <Card key={segment.segment}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{segment.segment} Customers</h3>
                          <div className="text-sm text-gray-600">
                            {formatNumber(segment.totalCustomers)} total • {formatNumber(segment.activeCustomers)} active
                          </div>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getChannelIcon(segment.preferredChannel)}
                          Preferred: {CHANNEL_CONFIGS[segment.preferredChannel]?.name}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Engagement Rate</div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatPercentage(segment.averageEngagement)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Response Rate</div>
                          <div className="text-xl font-bold text-green-600">
                            {formatPercentage(segment.responseRate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Best Time</div>
                          <div className="text-lg font-semibold">{segment.bestTime}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Activity Level</div>
                          <div className="w-full">
                            <Progress value={segment.averageEngagement} className="h-2" />
                          </div>
                        </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.monthlyTrends.map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 text-sm font-medium">{month.month}</div>
                        <div className="w-24">
                          <Progress
                            value={(month.campaigns / Math.max(...stats.monthlyTrends.map(m => m.campaigns))) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 sm:gap-6 text-sm">
                        <div>
                          <div className="text-gray-600">Campaigns</div>
                          <div className="font-semibold">{month.campaigns}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Messages</div>
                          <div className="font-semibold">{formatNumber(month.sent)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Revenue</div>
                          <div className="font-semibold">{formatCurrency(month.revenue)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">ROI</div>
                          <div className="font-semibold">{formatPercentage(month.roi)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Top Performing Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topPerformingCampaigns.map((campaign, index) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{campaign.type}</span>
                            <span>•</span>
                            <span>{campaign.channel}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {formatPercentage(campaign.conversionRate)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(campaign.revenue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Campaign Details Dialog */}
      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                {selectedCampaign.name} - Campaign Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6">
              {/* Campaign Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedCampaign.status)}</div>
                </div>
                <div>
                  <Label>Channel</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getChannelIcon(selectedCampaign.channel)}
                    <span>{CHANNEL_CONFIGS[selectedCampaign.channel]?.name}</span>
                  </div>
                </div>
                <div>
                  <Label>Target Audience</Label>
                  <div className="text-lg font-bold text-blue-600">
                    {formatNumber(selectedCampaign.targetAudience.totalSize)}
                  </div>
                </div>
                <div>
                  <Label>Total Revenue</Label>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedCampaign.metrics.revenue)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Campaign Content */}
              <div>
                <Label className="text-lg">Campaign Content</Label>
                <div className="mt-3 space-y-3">
                  {selectedCampaign.content.subject && (
                    <div>
                      <div className="text-sm text-gray-600">Subject:</div>
                      <div className="font-medium">{selectedCampaign.content.subject}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-600">Message:</div>
                    <div className="p-4 bg-gray-50 rounded-lg">{selectedCampaign.content.message}</div>
                  </div>
                  {selectedCampaign.content.messageArabic && (
                    <div>
                      <div className="text-sm text-gray-600">Message (Arabic):</div>
                      <div className="p-4 bg-gray-50 rounded-lg" dir="rtl">
                        {selectedCampaign.content.messageArabic}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Performance Metrics */}
              <div>
                <Label className="text-lg">Performance Metrics</Label>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {formatNumber(selectedCampaign.metrics.sentCount)}
                    </div>
                    <div className="text-sm text-blue-700">Messages Sent</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {formatNumber(selectedCampaign.metrics.deliveredCount)}
                    </div>
                    <div className="text-sm text-green-700">Delivered</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">
                      {formatNumber(selectedCampaign.metrics.openedCount)}
                    </div>
                    <div className="text-sm text-purple-700">Opened</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">
                      {formatNumber(selectedCampaign.metrics.convertedCount)}
                    </div>
                    <div className="text-sm text-orange-700">Converted</div>
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <Label className="text-lg">Target Audience</Label>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Segments:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedCampaign.targetAudience.segments.map((segment, index) => (
                        <Badge key={index} variant="outline">{segment}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Emirates:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedCampaign.targetAudience.emirates.map((emirate, index) => (
                        <Badge key={index} variant="outline">{emirate}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Campaign
                </Button>
                <Button variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Campaign
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}