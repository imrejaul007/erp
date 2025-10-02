'use client';

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
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Crown,
  Star,
  Gift,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  User,
  Users,
  ShoppingBag,
  Heart,
  Sparkles,
  Trophy,
  Gem,
  MapPin,
  Clock,
  TrendingUp,
  Target,
  Search,
  Filter,
  Plus,
  Send,
  Eye,
  Settings,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Coffee,
  Scissors,
  Palette
} from 'lucide-react';
import { LoyaltyTier } from '@/types/crm';

interface VIPCustomer {
  id: string;
  code: string;
  name: string;
  nameArabic?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  emirate?: string;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  totalLifetimeValue: number;
  totalOrders: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  joinDate: string;
  personalShopperId?: string;
  personalShopperName?: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  vipSince: string;
  birthDate?: string;
  preferences: {
    fragranceTypes: string[];
    preferredBrands: string[];
    occasions: string[];
    priceRange: { min: number; max: number };
  };
  vipBenefits: string[];
  upcomingEvents: VIPEvent[];
  recentActivity: VIPActivity[];
  satisfactionScore: number;
  isActive: boolean;
}

interface VIPEvent {
  id: string;
  type: 'PRIVATE_SHOPPING' | 'PRODUCT_LAUNCH' | 'TASTING_SESSION' | 'CULTURAL_EVENT' | 'BIRTHDAY_CELEBRATION';
  title: string;
  description: string;
  date: string;
  location: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  attendees: number;
  maxAttendees?: number;
}

interface VIPActivity {
  id: string;
  type: 'PURCHASE' | 'EVENT_ATTENDANCE' | 'CONSULTATION' | 'COMPLAINT' | 'FEEDBACK' | 'REFERRAL';
  description: string;
  amount?: number;
  date: string;
  notes?: string;
}

interface PersonalShopper {
  id: string;
  name: string;
  nameArabic?: string;
  email: string;
  phone: string;
  languages: string[];
  specialties: string[];
  vipClients: number;
  rating: number;
  image?: string;
  isAvailable: boolean;
}

interface VIPStats {
  totalVIPCustomers: number;
  activeVIPs: number;
  diamondTier: number;
  platinumTier: number;
  goldTier: number;
  totalVIPRevenue: number;
  averageVIPSpend: number;
  vipRetentionRate: number;
  satisfactionScore: number;
  upcomingEvents: number;
  personalShoppers: number;
}

const TIER_COLORS = {
  GOLD: '#FFD700',
  PLATINUM: '#E5E4E2',
  DIAMOND: '#B9F2FF'
};

const VIP_SERVICES = [
  { icon: Coffee, name: 'Personal Concierge', description: 'Dedicated assistant for all needs' },
  { icon: Scissors, name: 'Private Shopping', description: 'Exclusive shopping appointments' },
  { icon: Palette, name: 'Custom Blending', description: 'Personalized fragrance creation' },
  { icon: Gift, name: 'Exclusive Previews', description: 'First access to new collections' },
  { icon: Calendar, name: 'VIP Events', description: 'Invitation-only experiences' },
  { icon: Trophy, name: 'Priority Support', description: '24/7 dedicated support line' }
];

export default function VIPCustomerManagementPage() {
  const [vipCustomers, setVipCustomers] = useState<VIPCustomer[]>([]);
  const [personalShoppers, setPersonalShoppers] = useState<PersonalShopper[]>([]);
  const [vipEvents, setVipEvents] = useState<VIPEvent[]>([]);
  const [stats, setStats] = useState<VIPStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<VIPCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAssignShopper, setShowAssignShopper] = useState(false);

  useEffect(() => {
    fetchVIPData();
  }, []);

  const fetchVIPData = async () => {
    try {
      setLoading(true);
      const [customersRes, shoppersRes, eventsRes, statsRes] = await Promise.all([
        fetch('/api/crm/segments/vip/customers'),
        fetch('/api/crm/personal-shoppers'),
        fetch('/api/crm/vip/events'),
        fetch('/api/crm/segments/vip/stats')
      ]);

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setVipCustomers(customersData.customers || []);
      }

      if (shoppersRes.ok) {
        const shoppersData = await shoppersRes.json();
        setPersonalShoppers(shoppersData.shoppers || []);
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setVipEvents(eventsData.events || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching VIP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = vipCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || customer.loyaltyTier === tierFilter;

    return matchesSearch && matchesTier;
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

  const getTierIcon = (tier: LoyaltyTier) => {
    switch (tier) {
      case LoyaltyTier.GOLD: return <Trophy className="w-4 h-4" style={{ color: TIER_COLORS.GOLD }} />;
      case LoyaltyTier.PLATINUM: return <Crown className="w-4 h-4" style={{ color: TIER_COLORS.PLATINUM }} />;
      case LoyaltyTier.DIAMOND: return <Gem className="w-4 h-4" style={{ color: TIER_COLORS.DIAMOND }} />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PRIVATE_SHOPPING': return <ShoppingBag className="w-4 h-4" />;
      case 'PRODUCT_LAUNCH': return <Sparkles className="w-4 h-4" />;
      case 'TASTING_SESSION': return <Coffee className="w-4 h-4" />;
      case 'CULTURAL_EVENT': return <Calendar className="w-4 h-4" />;
      case 'BIRTHDAY_CELEBRATION': return <Gift className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  if (loading || !stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">VIP Customer Management</h1>
            <p className="text-gray-600 mt-1">Exclusive services and personalized experiences</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddEvent(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Event
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Promote to VIP
          </Button>
        </div>
      </div>

      {/* VIP Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total VIP Customers</CardTitle>
            <Crown className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{formatNumber(stats.totalVIPCustomers)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeVIPs} active ({Math.round((stats.activeVIPs / stats.totalVIPCustomers) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalVIPRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(stats.averageVIPSpend)} per VIP
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Star className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.satisfactionScore}/5</div>
            <p className="text-xs text-muted-foreground">
              VIP customer satisfaction
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.vipRetentionRate}%</div>
            <p className="text-xs text-muted-foreground">
              VIP customer retention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            VIP Tier Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-6 border rounded-lg" style={{ borderColor: TIER_COLORS.GOLD }}>
              <div className="flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8" style={{ color: TIER_COLORS.GOLD }} />
              </div>
              <div className="text-xl sm:text-2xl font-bold" style={{ color: TIER_COLORS.GOLD }}>
                {stats.goldTier}
              </div>
              <div className="text-sm text-gray-600">Gold Tier Members</div>
              <div className="mt-2">
                <Progress
                  value={(stats.goldTier / stats.totalVIPCustomers) * 100}
                  className="h-2"
                />
              </div>
            </div>

            <div className="text-center p-6 border rounded-lg" style={{ borderColor: TIER_COLORS.PLATINUM }}>
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-8 h-8" style={{ color: TIER_COLORS.PLATINUM }} />
              </div>
              <div className="text-xl sm:text-2xl font-bold" style={{ color: TIER_COLORS.PLATINUM }}>
                {stats.platinumTier}
              </div>
              <div className="text-sm text-gray-600">Platinum Tier Members</div>
              <div className="mt-2">
                <Progress
                  value={(stats.platinumTier / stats.totalVIPCustomers) * 100}
                  className="h-2"
                />
              </div>
            </div>

            <div className="text-center p-6 border rounded-lg" style={{ borderColor: TIER_COLORS.DIAMOND }}>
              <div className="flex items-center justify-center mb-4">
                <Gem className="w-8 h-8" style={{ color: TIER_COLORS.DIAMOND }} />
              </div>
              <div className="text-xl sm:text-2xl font-bold" style={{ color: TIER_COLORS.DIAMOND }}>
                {stats.diamondTier}
              </div>
              <div className="text-sm text-gray-600">Diamond Tier Members</div>
              <div className="mt-2">
                <Progress
                  value={(stats.diamondTier / stats.totalVIPCustomers) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VIP Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Exclusive VIP Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VIP_SERVICES.map((service, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <service.icon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="customers" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">VIP Customers</TabsTrigger>
          <TabsTrigger value="shoppers">Personal Shoppers</TabsTrigger>
          <TabsTrigger value="events">Exclusive Events</TabsTrigger>
          <TabsTrigger value="benefits">Benefits Management</TabsTrigger>
        </TabsList>

        {/* VIP Customers Tab */}
        <TabsContent value="customers" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  VIP Customer Directory
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search VIP customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="GOLD">Gold</SelectItem>
                      <SelectItem value="PLATINUM">Platinum</SelectItem>
                      <SelectItem value="DIAMOND">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.id} className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500 to-purple-700 rounded-bl-3xl"></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={`/avatars/${customer.id}.jpg`} />
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                              {customer.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{customer.name}</div>
                            {customer.nameArabic && (
                              <div className="text-sm text-gray-600" dir="rtl">
                                {customer.nameArabic}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">{customer.code}</div>
                          </div>
                        </div>
                        <Badge
                          className="flex items-center gap-1"
                          style={{
                            backgroundColor: `${TIER_COLORS[customer.loyaltyTier as keyof typeof TIER_COLORS]}20`,
                            color: TIER_COLORS[customer.loyaltyTier as keyof typeof TIER_COLORS]
                          }}
                        >
                          {getTierIcon(customer.loyaltyTier)}
                          {customer.loyaltyTier}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Total Spent</div>
                          <div className="font-semibold">{formatCurrency(customer.totalLifetimeValue)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Orders</div>
                          <div className="font-semibold">{customer.totalOrders}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Loyalty Points</div>
                          <div className="font-semibold text-purple-600">{formatNumber(customer.loyaltyPoints)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Satisfaction</div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{customer.satisfactionScore}</span>
                          </div>
                        </div>
                      </div>

                      {customer.personalShopperName && (
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                          <User className="w-4 h-4 text-purple-600" />
                          <div className="text-sm">
                            <div className="text-gray-600">Personal Shopper</div>
                            <div className="font-medium">{customer.personalShopperName}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Profile
                        </Button>
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Shoppers Tab */}
        <TabsContent value="shoppers" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Shoppers Team
                </CardTitle>
                <Button onClick={() => setShowAssignShopper(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Shopper
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {personalShoppers.map((shopper) => (
                  <Card key={shopper.id}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={shopper.image} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {shopper.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{shopper.name}</div>
                          {shopper.nameArabic && (
                            <div className="text-sm text-gray-600" dir="rtl">
                              {shopper.nameArabic}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{shopper.rating}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">VIP Clients</div>
                          <div className="font-semibold">{shopper.vipClients}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Status</div>
                          <Badge variant={shopper.isAvailable ? "default" : "secondary"}>
                            {shopper.isAvailable ? "Available" : "Busy"}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 mb-2">Languages</div>
                        <div className="flex flex-wrap gap-1">
                          {shopper.languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 mb-2">Specialties</div>
                        <div className="flex flex-wrap gap-1">
                          {shopper.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="w-3 h-3 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exclusive Events Tab */}
        <TabsContent value="events" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Exclusive VIP Events
                </CardTitle>
                <Button onClick={() => setShowAddEvent(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vipEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <Badge
                                variant={
                                  event.status === 'CONFIRMED' ? 'default' :
                                  event.status === 'COMPLETED' ? 'secondary' :
                                  event.status === 'CANCELLED' ? 'destructive' : 'outline'
                                }
                              >
                                {event.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{event.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {formatDate(event.date)}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {event.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                {event.attendees}{event.maxAttendees && `/${event.maxAttendees}`} attendees
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {event.type.replace('_', ' ').toLowerCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-3 h-3 mr-1" />
                            Manage
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

        {/* Benefits Management Tab */}
        <TabsContent value="benefits" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>VIP Benefits Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Free Shipping on All Orders</div>
                      <div className="text-sm text-gray-600">No minimum order requirement</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">24/7 Priority Support</div>
                      <div className="text-sm text-gray-600">Dedicated support line</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Early Access to New Products</div>
                      <div className="text-sm text-gray-600">48 hours before general release</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Birthday Bonus Points</div>
                      <div className="text-sm text-gray-600">Double points on birthday month</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Complimentary Gift Wrapping</div>
                      <div className="text-sm text-gray-600">Premium packaging included</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tier Upgrade Thresholds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg" style={{ borderColor: TIER_COLORS.GOLD }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5" style={{ color: TIER_COLORS.GOLD }} />
                      <span className="font-semibold">Gold Tier</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Minimum annual spend: AED 15,000</div>
                    <div className="text-sm text-gray-600">Points multiplier: 1.5x</div>
                  </div>

                  <div className="p-4 border rounded-lg" style={{ borderColor: TIER_COLORS.PLATINUM }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5" style={{ color: TIER_COLORS.PLATINUM }} />
                      <span className="font-semibold">Platinum Tier</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Minimum annual spend: AED 50,000</div>
                    <div className="text-sm text-gray-600">Points multiplier: 2x</div>
                  </div>

                  <div className="p-4 border rounded-lg" style={{ borderColor: TIER_COLORS.DIAMOND }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Gem className="w-5 h-5" style={{ color: TIER_COLORS.DIAMOND }} />
                      <span className="font-semibold">Diamond Tier</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Minimum annual spend: AED 100,000</div>
                    <div className="text-sm text-gray-600">Points multiplier: 2.5x</div>
                  </div>
                </div>

                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Thresholds
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Customer Profile Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTierIcon(selectedCustomer.loyaltyTier)}
                {selectedCustomer.name} - VIP Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6">
              {/* Customer Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Total Spent</Label>
                  <div className="text-xl font-bold text-purple-600">
                    {formatCurrency(selectedCustomer.totalLifetimeValue)}
                  </div>
                </div>
                <div>
                  <Label>Loyalty Points</Label>
                  <div className="text-xl font-bold text-blue-600">
                    {formatNumber(selectedCustomer.loyaltyPoints)}
                  </div>
                </div>
                <div>
                  <Label>Total Orders</Label>
                  <div className="text-xl font-bold">{selectedCustomer.totalOrders}</div>
                </div>
                <div>
                  <Label>VIP Since</Label>
                  <div className="text-lg font-semibold">{formatDate(selectedCustomer.vipSince)}</div>
                </div>
              </div>

              <Separator />

              {/* Preferences */}
              <div>
                <Label className="text-lg">Fragrance Preferences</Label>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Preferred Types</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCustomer.preferences.fragranceTypes.map((type, index) => (
                        <Badge key={index} variant="secondary">{type}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Preferred Brands</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCustomer.preferences.preferredBrands.map((brand, index) => (
                        <Badge key={index} variant="outline">{brand}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Price Range</div>
                    <div className="text-sm">
                      {formatCurrency(selectedCustomer.preferences.priceRange.min)} - {formatCurrency(selectedCustomer.preferences.priceRange.max)}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Recent Activity */}
              <div>
                <Label className="text-lg">Recent Activity</Label>
                <div className="mt-3 space-y-2">
                  {selectedCustomer.recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{activity.description}</div>
                          <div className="text-sm text-gray-600">{formatDate(activity.date)}</div>
                        </div>
                      </div>
                      {activity.amount && (
                        <div className="font-semibold">{formatCurrency(activity.amount)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="flex-1">
                  <Gift className="w-4 h-4 mr-2" />
                  Send Gift
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}