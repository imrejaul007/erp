'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Target,
  Heart,
  TrendingUp,
  TrendingDown,
  Clock,
  Gift,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Filter,
  Download,
  Zap,
  Award,
  UserX,
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
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  count: number;
  percentage: number;
  averageOrderValue: number;
  totalRevenue: number;
  frequency: number;
  churnRate: number;
  characteristics: string[];
  color: string;
}

interface CustomerJourney {
  stage: string;
  customers: number;
  conversionRate: number;
  averageTime: number;
  dropoffRate: number;
}

interface CustomerLifecycle {
  phase: string;
  duration: number;
  revenue: number;
  customers: number;
  characteristics: string[];
}

interface PerfumePreference {
  category: string;
  preference: number;
  volume: number;
  growth: number;
  seasonality: string;
}

interface RegionalData {
  region: string;
  customers: number;
  revenue: number;
  averageOrderValue: number;
  preferredCategories: string[];
  culturalFactors: string[];
}

interface CustomerIntelligenceProps {
  dateRange?: { start: Date; end: Date };
  storeId?: string;
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F', '#A0522D', '#D2691E'];
const SEGMENT_COLORS = {
  vip: '#8B4513',
  loyal: '#D2B48C',
  regular: '#CD853F',
  occasional: '#F4A460',
  new: '#DEB887',
  dormant: '#BC8F8F',
  churned: '#A0522D'
};

export default function CustomerIntelligence({ dateRange, storeId }: CustomerIntelligenceProps) {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [customerJourney, setCustomerJourney] = useState<CustomerJourney[]>([]);
  const [lifecycle, setLifecycle] = useState<CustomerLifecycle[]>([]);
  const [perfumePreferences, setPerfumePreferences] = useState<PerfumePreference[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [cohortData, setCohortData] = useState<any[]>([]);
  const [rfmData, setRfmData] = useState<any[]>([]);
  const [behaviorPatterns, setBehaviorPatterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomerData();
  }, [dateRange, storeId]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (storeId) params.append('storeId', storeId);
      if (dateRange) {
        params.append('startDate', dateRange.start.toISOString());
        params.append('endDate', dateRange.end.toISOString());
      }

      const [
        segmentsRes,
        journeyRes,
        lifecycleRes,
        preferencesRes,
        regionalRes,
        cohortRes,
        rfmRes,
        behaviorRes,
      ] = await Promise.all([
        fetch(`/api/analytics/customers?type=segments&${params.toString()}`),
        fetch(`/api/analytics/customers?type=journey&${params.toString()}`),
        fetch(`/api/analytics/customers?type=lifecycle&${params.toString()}`),
        fetch(`/api/analytics/customers?type=preferences&${params.toString()}`),
        fetch(`/api/analytics/customers?type=regional&${params.toString()}`),
        fetch(`/api/analytics/customers?type=cohort&${params.toString()}`),
        fetch(`/api/analytics/customers?type=rfm&${params.toString()}`),
        fetch(`/api/analytics/customers?type=behavior&${params.toString()}`),
      ]);

      const [
        segmentsData,
        journeyData,
        lifecycleData,
        preferencesData,
        regionalResponse,
        cohortResponse,
        rfmResponse,
        behaviorResponse,
      ] = await Promise.all([
        segmentsRes.json(),
        journeyRes.json(),
        lifecycleRes.json(),
        preferencesRes.json(),
        regionalRes.json(),
        cohortRes.json(),
        rfmRes.json(),
        behaviorRes.json(),
      ]);

      setSegments(segmentsData.segments || []);
      setCustomerJourney(journeyData.journey || []);
      setLifecycle(lifecycleData.lifecycle || []);
      setPerfumePreferences(preferencesData.preferences || []);
      setRegionalData(regionalResponse.regional || []);
      setCohortData(cohortResponse.cohort || []);
      setRfmData(rfmResponse.rfm || []);
      setBehaviorPatterns(behaviorResponse.patterns || []);

    } catch (error) {
      console.error('Error fetching customer analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getSegmentIcon = (segmentId: string) => {
    switch (segmentId) {
      case 'vip': return <Award className="h-5 w-5 text-yellow-500" />;
      case 'loyal': return <Heart className="h-5 w-5 text-red-500" />;
      case 'regular': return <Users className="h-5 w-5 text-blue-500" />;
      case 'occasional': return <Clock className="h-5 w-5 text-orange-500" />;
      case 'new': return <Zap className="h-5 w-5 text-green-500" />;
      case 'dormant': return <Clock className="h-5 w-5 text-gray-500" />;
      case 'churned': return <UserX className="h-5 w-5 text-red-600" />;
      default: return <Users className="h-5 w-5 text-oud-500" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading customer intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-oud-800">Customer Intelligence</h2>
          <p className="text-oud-600">Advanced customer behavior analytics and segmentation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Total Customers</p>
                <p className="text-xl font-bold text-oud-800">
                  {segments.reduce((sum, seg) => sum + seg.count, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Avg Customer LTV</p>
                <p className="text-xl font-bold text-oud-800">
                  {formatCurrency(
                    segments.reduce((sum, seg) => sum + (seg.totalRevenue / seg.count), 0) / segments.length || 0
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Retention Rate</p>
                <p className="text-xl font-bold text-oud-800">
                  {formatPercentage(
                    segments.reduce((sum, seg) => sum + (100 - seg.churnRate), 0) / segments.length || 0
                  )}
                </p>
              </div>
              <Heart className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Active Segments</p>
                <p className="text-xl font-bold text-oud-800">
                  {segments.filter(seg => seg.id !== 'churned' && seg.id !== 'dormant').length}
                </p>
              </div>
              <Target className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="segments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="segments">Segmentation</TabsTrigger>
          <TabsTrigger value="journey">Customer Journey</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="rfm">RFM Analysis</TabsTrigger>
        </TabsList>

        {/* Customer Segmentation Tab */}
        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Segment Distribution */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-oud-500" />
                  Customer Segments
                </CardTitle>
                <CardDescription>Distribution by customer value and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value} customers`,
                        name
                      ]}
                    />
                    <Legend />
                    <RechartsPieChart
                      data={segments}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      nameKey="name"
                    >
                      {segments.map((segment, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SEGMENT_COLORS[segment.id as keyof typeof SEGMENT_COLORS] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Segment Value Analysis */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Revenue by Segment</CardTitle>
                <CardDescription>Average order value and total revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={segments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name.includes('Revenue') ? formatCurrency(value) : formatCurrency(value),
                        name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      ]}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="totalRevenue"
                      fill="#8B4513"
                      name="Total Revenue"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="averageOrderValue"
                      stroke="#D2B48C"
                      strokeWidth={3}
                      name="AOV"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Segment Analysis */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Segment Details</CardTitle>
              <CardDescription>Comprehensive analysis of each customer segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {segments.map((segment) => (
                  <div
                    key={segment.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSegment === segment.id
                        ? 'border-oud-500 bg-oud-50'
                        : 'border-oud-200 hover:border-oud-300'
                    }`}
                    onClick={() => setSelectedSegment(selectedSegment === segment.id ? null : segment.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getSegmentIcon(segment.id)}
                        <h4 className="font-medium text-oud-800">{segment.name}</h4>
                      </div>
                      <Badge style={{ backgroundColor: segment.color, color: 'white' }}>
                        {formatPercentage(segment.percentage)}
                      </Badge>
                    </div>

                    <p className="text-sm text-oud-600 mb-3">{segment.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <span className="text-oud-600">Customers: </span>
                        <span className="font-medium text-oud-800">{segment.count.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-oud-600">AOV: </span>
                        <span className="font-medium text-oud-800">{formatCurrency(segment.averageOrderValue)}</span>
                      </div>
                      <div>
                        <span className="text-oud-600">Revenue: </span>
                        <span className="font-medium text-oud-800">{formatCurrency(segment.totalRevenue)}</span>
                      </div>
                      <div>
                        <span className="text-oud-600">Frequency: </span>
                        <span className="font-medium text-oud-800">{segment.frequency.toFixed(1)}/month</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-oud-600">Churn Risk:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              segment.churnRate > 20 ? 'bg-red-500' : segment.churnRate > 10 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(segment.churnRate, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-oud-800">{formatPercentage(segment.churnRate)}</span>
                      </div>
                    </div>

                    {selectedSegment === segment.id && (
                      <div className="border-t border-oud-200 pt-3">
                        <h5 className="font-medium text-oud-800 mb-2">Key Characteristics:</h5>
                        <div className="flex flex-wrap gap-1">
                          {segment.characteristics.map((char, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Journey Tab */}
        <TabsContent value="journey" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Journey Funnel */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-oud-500" />
                  Customer Journey Funnel
                </CardTitle>
                <CardDescription>Conversion rates through each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerJourney} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={120} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name.includes('Rate') ? formatPercentage(value) : value.toLocaleString(),
                        name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      ]}
                    />
                    <Bar dataKey="customers" fill="#8B4513" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion Analysis */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Conversion Analysis</CardTitle>
                <CardDescription>Stage-by-stage conversion performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customerJourney.map((stage, index) => (
                  <div key={stage.stage} className="flex items-center justify-between p-3 border border-oud-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-oud-100 text-oud-700 text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-oud-800">{stage.stage}</p>
                        <p className="text-sm text-oud-600">{stage.customers.toLocaleString()} customers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-oud-800">{formatPercentage(stage.conversionRate)}</p>
                      <p className="text-sm text-oud-600">{stage.averageTime}d avg time</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Journey Metrics */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Journey Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-oud-800">
                    {formatPercentage(customerJourney.reduce((sum, stage) => sum + stage.conversionRate, 0) / customerJourney.length)}
                  </p>
                  <p className="text-sm text-oud-600">Overall Conversion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-oud-800">
                    {Math.round(customerJourney.reduce((sum, stage) => sum + stage.averageTime, 0))}d
                  </p>
                  <p className="text-sm text-oud-600">Total Journey Time</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {formatPercentage(customerJourney.reduce((sum, stage) => sum + stage.dropoffRate, 0) / customerJourney.length)}
                  </p>
                  <p className="text-sm text-oud-600">Average Dropoff Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Lifecycle Tab */}
        <TabsContent value="lifecycle" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-oud-500" />
                Customer Lifecycle Analysis
              </CardTitle>
              <CardDescription>Customer behavior and value across lifecycle phases</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={lifecycle}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="phase" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name.includes('Revenue') || name.includes('Value') ? formatCurrency(value) : value,
                      name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                    ]}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    fill="#8B4513"
                    fillOpacity={0.3}
                    stroke="#8B4513"
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Bar yAxisId="right" dataKey="customers" fill="#D2B48C" name="Customers" />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="duration"
                    stroke="#CD853F"
                    strokeWidth={3}
                    name="Duration (days)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Perfume Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preference Radar */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-oud-500" />
                  Fragrance Preferences
                </CardTitle>
                <CardDescription>Customer preferences by fragrance category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={perfumePreferences}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      dataKey="preference"
                      stroke="#8B4513"
                      fill="#8B4513"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Preference Score']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Seasonal Preferences */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Seasonal Trends</CardTitle>
                <CardDescription>Preference changes throughout the year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {perfumePreferences.map((pref) => (
                    <div key={pref.category} className="border border-oud-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-oud-800">{pref.category}</h4>
                        <div className="flex items-center gap-2">
                          {pref.growth > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${pref.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercentage(Math.abs(pref.growth))}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-oud-600">Volume: </span>
                          <span className="font-medium text-oud-800">{pref.volume.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-oud-600">Seasonality: </span>
                          <span className="font-medium text-oud-800">{pref.seasonality}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="h-2 rounded-full bg-oud-500"
                          style={{ width: `${pref.preference}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Regional Analysis Tab */}
        <TabsContent value="regional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Revenue */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-oud-500" />
                  Regional Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#8B4513" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Customer Distribution */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Customer Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value} customers`,
                        name
                      ]}
                    />
                    <Legend />
                    <RechartsPieChart
                      data={regionalData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="customers"
                      nameKey="region"
                    >
                      {regionalData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Regional Details */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Regional Analysis Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Region</th>
                      <th className="text-right py-2 px-4 text-oud-700">Customers</th>
                      <th className="text-right py-2 px-4 text-oud-700">Revenue</th>
                      <th className="text-right py-2 px-4 text-oud-700">AOV</th>
                      <th className="text-left py-2 px-4 text-oud-700">Preferred Categories</th>
                      <th className="text-left py-2 px-4 text-oud-700">Cultural Factors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((region) => (
                      <tr key={region.region} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4 font-medium text-oud-800">{region.region}</td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {region.customers.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatCurrency(region.revenue)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatCurrency(region.averageOrderValue)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {region.preferredCategories.slice(0, 3).map((cat, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {region.culturalFactors.slice(0, 2).map((factor, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RFM Analysis Tab */}
        <TabsContent value="rfm" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RFM Score Distribution */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-oud-500" />
                  RFM Score Distribution
                </CardTitle>
                <CardDescription>Recency, Frequency, Monetary analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={rfmData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="frequency" name="Frequency" />
                    <YAxis dataKey="monetary" name="Monetary" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => [
                        name === 'monetary' ? formatCurrency(value) : value,
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Scatter dataKey="recency" fill="#8B4513" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* RFM Segments */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>RFM Segments</CardTitle>
                <CardDescription>Customer classification based on RFM scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rfmData.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-oud-200 rounded-lg">
                      <div>
                        <p className="font-medium text-oud-800">{customer.segment}</p>
                        <p className="text-sm text-oud-600">{customer.count} customers</p>
                      </div>
                      <div className="text-right">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <p className="font-bold text-oud-800">{customer.recency}</p>
                            <p className="text-oud-600">R</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-oud-800">{customer.frequency}</p>
                            <p className="text-oud-600">F</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-oud-800">{customer.monetary}</p>
                            <p className="text-oud-600">M</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cohort Analysis */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Cohort Retention Analysis</CardTitle>
              <CardDescription>Customer retention by acquisition cohort</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-3 text-oud-700">Cohort</th>
                      {[...Array(12)].map((_, i) => (
                        <th key={i} className="text-center py-2 px-3 text-oud-700">M{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((cohort, index) => (
                      <tr key={index} className="border-b border-oud-100">
                        <td className="py-2 px-3 font-medium text-oud-800">{cohort.period}</td>
                        {cohort.retention.map((rate: number, i: number) => (
                          <td
                            key={i}
                            className="text-center py-2 px-3"
                            style={{
                              backgroundColor: `rgba(139, 69, 19, ${rate / 100})`,
                              color: rate > 50 ? 'white' : 'inherit'
                            }}
                          >
                            {rate ? `${rate}%` : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}