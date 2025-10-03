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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Plane,
  MapPin,
  Users,
  TrendingUp,
  ShoppingBag,
  Camera,
  Globe,
  Calendar as CalendarIcon,
  Star,
  Gift,
  Search,
  Filter,
  Plus,
  Eye,
  Send,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Flag,
  Compass,
  Hotel,
  Car,
  Package,
  Heart,
  CreditCard,
  RefreshCw,
  Download,
  BarChart3,
  ArrowLeft} from 'lucide-react';

interface TouristCustomer {
  id: string;
  code: string;
  name: string;
  nationality: string;
  countryFlag: string;
  email?: string;
  phone?: string;
  totalSpent: number;
  numberOfVisits: number;
  averageSpendPerVisit: number;
  firstVisitDate: string;
  lastVisitDate?: string;
  hotelStaying?: string;
  roomNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  tourGuide?: string;
  groupSize: number;
  isGroupLeader: boolean;
  preferredLanguage: string;
  visitPurpose: 'LEISURE' | 'BUSINESS' | 'TRANSIT' | 'FAMILY_VISIT' | 'SHOPPING';
  referralSource: 'HOTEL_CONCIERGE' | 'TOUR_GUIDE' | 'SOCIAL_MEDIA' | 'FRIEND_REFERRAL' | 'WALK_IN' | 'TAXI_DRIVER';
  purchaseCategories: string[];
  culturalInterests: string[];
  spendingPattern: 'LUXURY' | 'MID_RANGE' | 'BUDGET';
  satisfactionScore: number;
  willRecommend: boolean;
  returnLikelihood: 'HIGH' | 'MEDIUM' | 'LOW';
  specialRequests: string[];
  isActive: boolean;
}

interface TouristStats {
  totalTourists: number;
  activeTourists: number;
  newTouristsThisMonth: number;
  totalRevenue: number;
  averageSpendPerTourist: number;
  averageGroupSize: number;
  satisfactionScore: number;
  returnRate: number;
  topNationalities: Array<{
    nationality: string;
    count: number;
    revenue: number;
    flag: string;
  }>;
  seasonalTrends: Array<{
    month: string;
    visitors: number;
    revenue: number;
    avgSpend: number;
  }>;
  referralSources: Array<{
    source: string;
    count: number;
    conversionRate: number;
  }>;
  spendingPatterns: {
    luxury: number;
    midRange: number;
    budget: number;
  };
}

interface TouristService {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  type: 'CONCIERGE' | 'DELIVERY' | 'GUIDE' | 'TRANSLATION' | 'CULTURAL_EXPERIENCE';
  price?: number;
  isComplimentary: boolean;
  availability: 'ALWAYS' | 'BUSINESS_HOURS' | 'ON_REQUEST';
  contactInfo: string;
  rating: number;
  languages: string[];
}

interface CulturalGuide {
  id: string;
  title: string;
  titleArabic: string;
  content: string;
  contentArabic: string;
  category: 'FRAGRANCE_HISTORY' | 'APPLICATION_TIPS' | 'CULTURAL_SIGNIFICANCE' | 'BUYING_GUIDE' | 'LOCAL_CUSTOMS';
  readingTime: number;
  popularity: number;
  images: string[];
}

const TOURIST_SERVICES = [
  {
    icon: Hotel,
    name: 'Hotel Delivery',
    description: 'Free delivery to your hotel within 2 hours',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Globe,
    name: 'Multi-Language Support',
    description: 'Staff fluent in 8+ languages',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Car,
    name: 'Airport Pickup Service',
    description: 'Complimentary pickup for purchases over AED 2000',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Package,
    name: 'Duty-Free Packaging',
    description: 'VAT refund and customs-friendly packaging',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Camera,
    name: 'Cultural Experience',
    description: 'Learn about perfume traditions and history',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    icon: Gift,
    name: 'Tourist Discounts',
    description: 'Exclusive offers for international visitors',
    color: 'bg-yellow-100 text-yellow-600'
  }
];

const CULTURAL_CATEGORIES = [
  'Fragrance History',
  'Application Tips',
  'Cultural Significance',
  'Buying Guide',
  'Local Customs',
  'Gift Etiquette'
];

export default function TouristCustomerManagementPage() {
  const router = useRouter();
  const [tourists, setTourists] = useState<TouristCustomer[]>([]);
  const [stats, setStats] = useState<TouristStats | null>(null);
  const [services, setServices] = useState<TouristService[]>([]);
  const [culturalGuides, setCulturalGuides] = useState<CulturalGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTourist, setSelectedTourist] = useState<TouristCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('all');
  const [spendingFilter, setSpendingFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  useEffect(() => {
    fetchTouristData();
  }, []);

  const fetchTouristData = async () => {
    try {
      setLoading(true);
      const [touristsRes, statsRes, servicesRes, guidesRes] = await Promise.all([
        fetch('/api/crm/segments/tourist/customers'),
        fetch('/api/crm/segments/tourist/stats'),
        fetch('/api/crm/tourist-services'),
        fetch('/api/crm/cultural-guides')
      ]);

      if (touristsRes.ok) {
        const touristsData = await touristsRes.json();
        setTourists(touristsData.tourists || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData.services || []);
      }

      if (guidesRes.ok) {
        const guidesData = await guidesRes.json();
        setCulturalGuides(guidesData.guides || []);
      }
    } catch (error) {
      console.error('Error fetching tourist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTourists = tourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNationality = nationalityFilter === 'all' || tourist.nationality === nationalityFilter;
    const matchesSpending = spendingFilter === 'all' || tourist.spendingPattern === spendingFilter;
    const matchesDateFrom = !dateFrom || new Date(tourist.firstVisitDate) >= dateFrom;
    const matchesDateTo = !dateTo || new Date(tourist.firstVisitDate) <= dateTo;

    return matchesSearch && matchesNationality && matchesSpending && matchesDateFrom && matchesDateTo;
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

  const getSpendingBadgeVariant = (pattern: string) => {
    switch (pattern) {
      case 'LUXURY': return 'default';
      case 'MID_RANGE': return 'secondary';
      case 'BUDGET': return 'outline';
      default: return 'outline';
    }
  };

  const getReturnLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'HIGH': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-red-600';
      default: return 'text-gray-600';
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
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tourist Customer Management</h1>
            <p className="text-gray-600 mt-1">Enhance experiences for international visitors</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTouristData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Tourist
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tourists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.totalTourists)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newTouristsThisMonth} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tourist Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(stats.averageSpendPerTourist)} per tourist
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.satisfactionScore}/5</div>
            <p className="text-xs text-muted-foreground">
              Tourist feedback rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.returnRate}%</div>
            <p className="text-xs text-muted-foreground">
              Tourists who return
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Nationalities & Spending Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5" />
              Top Visitor Nationalities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topNationalities.slice(0, 5).map((country, index) => (
                <div key={country.nationality} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="font-medium">{country.nationality}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{country.count} visitors</div>
                    <div className="text-sm text-gray-600">{formatCurrency(country.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Spending Pattern Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Luxury Shoppers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Progress value={(stats.spendingPatterns.luxury / stats.totalTourists) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{stats.spendingPatterns.luxury}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Mid-Range</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Progress value={(stats.spendingPatterns.midRange / stats.totalTourists) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{stats.spendingPatterns.midRange}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Budget Conscious</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Progress value={(stats.spendingPatterns.budget / stats.totalTourists) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{stats.spendingPatterns.budget}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tourist Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Tourist Services & Amenities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOURIST_SERVICES.map((service, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${service.color}`}>
                  <service.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tourists" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tourists">Tourist Directory</TabsTrigger>
          <TabsTrigger value="services">Services & Support</TabsTrigger>
          <TabsTrigger value="cultural">Cultural Guides</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
        </TabsList>

        {/* Tourist Directory Tab */}
        <TabsContent value="tourists" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Tourist Customer Directory
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tourists..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {stats.topNationalities.map((country) => (
                        <SelectItem key={country.nationality} value={country.nationality}>
                          {country.flag} {country.nationality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={spendingFilter} onValueChange={setSpendingFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Spending" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="LUXURY">Luxury</SelectItem>
                      <SelectItem value="MID_RANGE">Mid-Range</SelectItem>
                      <SelectItem value="BUDGET">Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tourist</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Visits</TableHead>
                    <TableHead>Hotel Info</TableHead>
                    <TableHead>Satisfaction</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTourists.slice(0, 10).map((tourist) => (
                    <TableRow key={tourist.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`/avatars/${tourist.id}.jpg`} />
                            <AvatarFallback>
                              {tourist.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{tourist.name}</div>
                            <div className="text-xs text-gray-500">{tourist.code}</div>
                            {tourist.isGroupLeader && (
                              <Badge variant="outline" className="text-xs">
                                Group Leader ({tourist.groupSize})
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{tourist.countryFlag}</span>
                          <span className="text-sm">{tourist.nationality}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{formatCurrency(tourist.totalSpent)}</div>
                          <Badge variant={getSpendingBadgeVariant(tourist.spendingPattern)} className="text-xs">
                            {tourist.spendingPattern.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tourist.numberOfVisits}</div>
                          <div className="text-xs text-gray-600">
                            Avg: {formatCurrency(tourist.averageSpendPerVisit)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {tourist.hotelStaying && (
                            <>
                              <div className="font-medium">{tourist.hotelStaying}</div>
                              {tourist.roomNumber && (
                                <div className="text-xs text-gray-600">Room: {tourist.roomNumber}</div>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{tourist.satisfactionScore}</span>
                          <div className={`text-xs ${getReturnLikelihoodColor(tourist.returnLikelihood)}`}>
                            ({tourist.returnLikelihood} return)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTourist(tourist)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services & Support Tab */}
        <TabsContent value="services" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-5 h-5" />
                  Tourist Support Services
                </CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          <p className="text-sm text-gray-600" dir="rtl">{service.nameArabic}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{service.rating}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{service.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Type:</span>
                          <Badge variant="outline">{service.type.replace('_', ' ')}</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="font-semibold">
                            {service.isComplimentary ? 'Complimentary' : formatCurrency(service.price || 0)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Availability:</span>
                          <Badge variant="secondary">{service.availability.replace('_', ' ')}</Badge>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">Languages:</div>
                          <div className="flex flex-wrap gap-1">
                            {service.languages.map((lang, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cultural Guides Tab */}
        <TabsContent value="cultural" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Cultural Education & Guides
                </CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Guide
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {culturalGuides.map((guide) => (
                  <Card key={guide.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-1">{guide.title}</h3>
                        <p className="text-sm text-gray-600" dir="rtl">{guide.titleArabic}</p>
                        <Badge variant="outline" className="mt-2">
                          {guide.category.replace('_', ' ')}
                        </Badge>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{guide.content}</p>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {guide.readingTime} min read
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {guide.popularity} views
                        </div>
                      </div>

                      {guide.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {guide.images.slice(0, 3).map((image, index) => (
                            <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`${guide.title} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Send className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics & Insights Tab */}
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Seasonal Trends & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.seasonalTrends.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium">{month.month}</div>
                      <div className="w-32">
                        <Progress
                          value={(month.visitors / Math.max(...stats.seasonalTrends.map(m => m.visitors))) * 100}
                          className="h-3"
                        />
                      </div>
                    </div>
                    <div className="flex gap-8 text-sm">
                      <div>
                        <div className="text-gray-600">Visitors</div>
                        <div className="font-semibold">{month.visitors}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Revenue</div>
                        <div className="font-semibold">{formatCurrency(month.revenue)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Avg Spend</div>
                        <div className="font-semibold">{formatCurrency(month.avgSpend)}</div>
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
                <MapPin className="w-5 h-5" />
                Referral Source Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.referralSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Compass className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium">{source.source.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{source.count} referrals</div>
                        <div className="text-sm text-gray-600">{source.conversionRate}% conversion</div>
                      </div>
                      <div className="w-24">
                        <Progress value={source.conversionRate} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tourist Profile Dialog */}
      {selectedTourist && (
        <Dialog open={!!selectedTourist} onOpenChange={() => setSelectedTourist(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-lg">{selectedTourist.countryFlag}</span>
                {selectedTourist.name} - Tourist Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6">
              {/* Tourist Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Total Spent</Label>
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(selectedTourist.totalSpent)}
                  </div>
                </div>
                <div>
                  <Label>Number of Visits</Label>
                  <div className="text-xl font-bold">{selectedTourist.numberOfVisits}</div>
                </div>
                <div>
                  <Label>Group Size</Label>
                  <div className="text-xl font-bold">{selectedTourist.groupSize}</div>
                </div>
                <div>
                  <Label>Satisfaction</Label>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{selectedTourist.satisfactionScore}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Hotel Information */}
              {selectedTourist.hotelStaying && (
                <div>
                  <Label className="text-lg">Accommodation Details</Label>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Hotel</div>
                      <div className="font-semibold">{selectedTourist.hotelStaying}</div>
                    </div>
                    {selectedTourist.roomNumber && (
                      <div>
                        <div className="text-sm text-gray-600">Room Number</div>
                        <div className="font-semibold">{selectedTourist.roomNumber}</div>
                      </div>
                    )}
                    {selectedTourist.checkInDate && (
                      <div>
                        <div className="text-sm text-gray-600">Check-in</div>
                        <div className="font-semibold">{formatDate(selectedTourist.checkInDate)}</div>
                      </div>
                    )}
                    {selectedTourist.checkOutDate && (
                      <div>
                        <div className="text-sm text-gray-600">Check-out</div>
                        <div className="font-semibold">{formatDate(selectedTourist.checkOutDate)}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Preferences */}
              <div>
                <Label className="text-lg">Preferences & Interests</Label>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Purchase Categories</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTourist.purchaseCategories.map((category, index) => (
                        <Badge key={index} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Cultural Interests</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTourist.culturalInterests.map((interest, index) => (
                        <Badge key={index} variant="outline">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Visit Purpose</div>
                    <Badge variant="default">{selectedTourist.visitPurpose.replace('_', ' ')}</Badge>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedTourist.specialRequests.length > 0 && (
                <div>
                  <Label className="text-lg">Special Requests</Label>
                  <div className="mt-3">
                    {selectedTourist.specialRequests.map((request, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2">
                        {request}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <Gift className="w-4 h-4 mr-2" />
                  Special Offer
                </Button>
                <Button variant="outline" className="flex-1">
                  <Hotel className="w-4 h-4 mr-2" />
                  Hotel Delivery
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}