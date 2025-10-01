'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Factory,
  Droplets,
  Thermometer,
  Zap,
  DollarSign,
  Clock,
  ShieldAlert,
  Target,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Eye,
  BarChart3,
  PieChart,
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
  Treemap,
} from 'recharts';

interface WastageCategory {
  id: string;
  name: string;
  category: string;
  wastagePercentage: number;
  wastageValue: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  rootCause: string;
  priority: 'high' | 'medium' | 'low';
  recommendations: string[];
}

interface ProductionWastage {
  stage: string;
  wastagePercentage: number;
  wastageValue: number;
  commonCauses: string[];
  preventionMeasures: string[];
  efficiency: number;
}

interface QualityIssue {
  issueType: string;
  frequency: number;
  impact: number;
  affectedProducts: string[];
  timeToResolve: number;
  status: 'open' | 'in_progress' | 'resolved';
}

interface StorageWastage {
  location: string;
  environmentalFactors: {
    temperature: number;
    humidity: number;
    light: number;
    airQuality: number;
  };
  wastageRate: number;
  affectedCategories: string[];
  corrections: string[];
}

interface WastageIntelligenceProps {
  dateRange?: { start: Date; end: Date };
  storeId?: string;
  department?: string;
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F', '#A0522D', '#D2691E'];
const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

export default function WastageIntelligence({ dateRange, storeId, department }: WastageIntelligenceProps) {
  const [wastageCategories, setWastageCategories] = useState<WastageCategory[]>([]);
  const [productionWastage, setProductionWastage] = useState<ProductionWastage[]>([]);
  const [qualityIssues, setQualityIssues] = useState<QualityIssue[]>([]);
  const [storageWastage, setStorageWastage] = useState<StorageWastage[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [costAnalysis, setCostAnalysis] = useState<any>({});
  const [rootCauseAnalysis, setRootCauseAnalysis] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWastageData();
  }, [dateRange, storeId, department]);

  const fetchWastageData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (storeId) params.append('storeId', storeId);
      if (department) params.append('department', department);
      if (dateRange) {
        params.append('startDate', dateRange.start.toISOString());
        params.append('endDate', dateRange.end.toISOString());
      }

      const [
        categoriesRes,
        productionRes,
        qualityRes,
        storageRes,
        trendRes,
        costRes,
        rootCauseRes,
        recommendationsRes,
      ] = await Promise.all([
        fetch(`/api/analytics/wastage?type=categories&${params.toString()}`),
        fetch(`/api/analytics/wastage?type=production&${params.toString()}`),
        fetch(`/api/analytics/wastage?type=quality&${params.toString()}`),
        fetch(`/api/analytics/wastage?type=storage&${params.toString()}`),
        fetch(`/api/analytics/wastage?type=trends&${params.toString()}`),
        fetch(`/api/analytics/wastage?type=cost&${params.toString()}`),
        fetch(`/api/analytics/wastage?type=root-cause&${params.toString()}`),
        fetch(`/api/analytics/wastage?type=recommendations&${params.toString()}`),
      ]);

      const [
        categoriesData,
        productionData,
        qualityData,
        storageData,
        trendData,
        costData,
        rootCauseData,
        recommendationsData,
      ] = await Promise.all([
        categoriesRes.json(),
        productionRes.json(),
        qualityRes.json(),
        storageRes.json(),
        trendRes.json(),
        costRes.json(),
        rootCauseRes.json(),
        recommendationsRes.json(),
      ]);

      setWastageCategories(categoriesData.categories || []);
      setProductionWastage(productionData.production || []);
      setQualityIssues(qualityData.quality || []);
      setStorageWastage(storageData.storage || []);
      setTrendData(trendData.trends || []);
      setCostAnalysis(costData.cost || {});
      setRootCauseAnalysis(rootCauseData.rootCause || []);
      setRecommendations(recommendationsData.recommendations || []);

    } catch (error) {
      console.error('Error fetching wastage analytics:', error);
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || '#6b7280';
  };

  if (loading) {
    return <div className="text-center py-8">Loading wastage intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-oud-800">Wastage Intelligence</h2>
          <p className="text-oud-600">Advanced loss point identification and reduction analytics</p>
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
          <Button variant="outline" size="sm" onClick={fetchWastageData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Total Wastage Value</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(costAnalysis.totalWastageValue || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Overall Wastage %</p>
                <p className="text-xl font-bold text-oud-800">
                  {formatPercentage(costAnalysis.overallWastagePercentage || 0)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">High Priority Issues</p>
                <p className="text-xl font-bold text-orange-600">
                  {wastageCategories.filter(w => w.priority === 'high').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Potential Savings</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(costAnalysis.potentialSavings || 0)}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="analysis">Root Cause</TabsTrigger>
          <TabsTrigger value="actions">Action Plan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wastage Categories */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-oud-500" />
                  Wastage by Category
                </CardTitle>
                <CardDescription>Distribution of wastage across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name
                      ]}
                    />
                    <Legend />
                    <RechartsPieChart
                      data={wastageCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="wastageValue"
                      nameKey="category"
                    >
                      {wastageCategories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Wastage Trends */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-oud-500" />
                  Wastage Trends
                </CardTitle>
                <CardDescription>Wastage patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name.includes('Percentage') ? formatPercentage(value) : formatCurrency(value),
                        name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      ]}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="wastageValue"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Wastage Value"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="wastagePercentage"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      name="Wastage Percentage"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Priority Items */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Priority Wastage Items</CardTitle>
              <CardDescription>Items requiring immediate attention based on impact and trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wastageCategories
                  .sort((a, b) => b.wastageValue - a.wastageValue)
                  .slice(0, 8)
                  .map((item) => (
                  <div key={item.id} className="border border-oud-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-oud-800">{item.name}</h4>
                        <p className="text-sm text-oud-600">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getPriorityColor(item.priority) }}
                        >
                          {item.priority.toUpperCase()}
                        </span>
                        {getTrendIcon(item.trend)}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-600">{formatPercentage(item.wastagePercentage)}</p>
                        <p className="text-xs text-oud-600">Wastage Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-oud-800">{formatCurrency(item.wastageValue)}</p>
                        <p className="text-xs text-oud-600">Value Lost</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-oud-800">{item.trend}</p>
                        <p className="text-xs text-oud-600">Trend</p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm font-medium text-oud-800 mb-1">Root Cause:</p>
                      <p className="text-sm text-oud-600">{item.rootCause}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-oud-800 mb-1">Quick Actions:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.recommendations.slice(0, 3).map((rec, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Production Wastage Tab */}
        <TabsContent value="production" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Stage Analysis */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-oud-500" />
                  Production Stage Wastage
                </CardTitle>
                <CardDescription>Wastage at each production stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productionWastage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name.includes('Percentage') ? formatPercentage(value) : formatCurrency(value),
                        name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      ]}
                    />
                    <Bar dataKey="wastagePercentage" fill="#ef4444" name="Wastage Percentage" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Efficiency Analysis */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Production Efficiency</CardTitle>
                <CardDescription>Efficiency vs wastage correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={productionWastage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="efficiency" name="Efficiency" unit="%" />
                    <YAxis dataKey="wastagePercentage" name="Wastage" unit="%" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => [
                        formatPercentage(value),
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Scatter dataKey="wastageValue" fill="#8B4513" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Production Stage Details */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Production Stage Analysis</CardTitle>
              <CardDescription>Detailed breakdown of each production stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {productionWastage.map((stage, index) => (
                  <div key={index} className="border border-oud-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-medium text-oud-800">{stage.stage}</h4>
                      <div className="text-right">
                        <p className="text-xl font-bold text-red-600">{formatPercentage(stage.wastagePercentage)}</p>
                        <p className="text-sm text-oud-600">Wastage Rate</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-oud-800 mb-2">Common Causes</h5>
                        <ul className="space-y-1">
                          {stage.commonCauses.map((cause, i) => (
                            <li key={i} className="text-sm text-oud-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-oud-500 rounded-full mt-2 flex-shrink-0"></span>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-oud-800 mb-2">Prevention Measures</h5>
                        <ul className="space-y-1">
                          {stage.preventionMeasures.map((measure, i) => (
                            <li key={i} className="text-sm text-oud-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                              {measure}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div className="text-center p-3 bg-oud-50 border border-oud-200 rounded">
                          <p className="text-2xl font-bold text-oud-800">{formatPercentage(stage.efficiency)}</p>
                          <p className="text-sm text-oud-600">Efficiency Rate</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-2xl font-bold text-red-600">{formatCurrency(stage.wastageValue)}</p>
                          <p className="text-sm text-red-600">Value Lost</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Wastage Tab */}
        <TabsContent value="storage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Environmental Factors */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-oud-500" />
                  Environmental Impact on Wastage
                </CardTitle>
                <CardDescription>How storage conditions affect wastage rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={storageWastage.map(s => ({
                    location: s.location,
                    temperature: s.environmentalFactors.temperature,
                    humidity: s.environmentalFactors.humidity,
                    wastageRate: s.wastageRate,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Humidity (%)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="wastageRate"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      name="Wastage Rate (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Storage Location Performance */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Storage Location Performance</CardTitle>
                <CardDescription>Wastage rates by storage location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storageWastage.map((location, index) => (
                    <div key={index} className="border border-oud-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-oud-800">{location.location}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          location.wastageRate > 5 ? 'bg-red-100 text-red-600' :
                          location.wastageRate > 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {formatPercentage(location.wastageRate)} Wastage
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Thermometer className="h-3 w-3 text-red-500" />
                            <span className="text-oud-800">{location.environmentalFactors.temperature}°C</span>
                          </div>
                          <p className="text-xs text-oud-600">Temperature</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Droplets className="h-3 w-3 text-blue-500" />
                            <span className="text-oud-800">{location.environmentalFactors.humidity}%</span>
                          </div>
                          <p className="text-xs text-oud-600">Humidity</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="h-3 w-3 text-yellow-500" />
                            <span className="text-oud-800">{location.environmentalFactors.light}%</span>
                          </div>
                          <p className="text-xs text-oud-600">Light</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Zap className="h-3 w-3 text-green-500" />
                            <span className="text-oud-800">{location.environmentalFactors.airQuality}%</span>
                          </div>
                          <p className="text-xs text-oud-600">Air Quality</p>
                        </div>
                      </div>

                      <div className="mb-2">
                        <p className="text-sm font-medium text-oud-800 mb-1">Affected Categories:</p>
                        <div className="flex flex-wrap gap-1">
                          {location.affectedCategories.map((cat, i) => (
                            <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-oud-800 mb-1">Recommended Corrections:</p>
                        <div className="flex flex-wrap gap-1">
                          {location.corrections.map((correction, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {correction}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quality Issues Tab */}
        <TabsContent value="quality" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-oud-500" />
                Quality Control Issues
              </CardTitle>
              <CardDescription>Quality-related wastage and defect analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Issue Frequency Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={qualityIssues}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="issueType" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="frequency" fill="#ef4444" name="Frequency" />
                  </BarChart>
                </ResponsiveContainer>

                {/* Issue Impact vs Time */}
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={qualityIssues}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeToResolve" name="Time to Resolve" unit=" hrs" />
                    <YAxis dataKey="impact" name="Impact" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => [
                        name === 'timeToResolve' ? `${value} hrs` : `${value}`,
                        name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      ]}
                    />
                    <Scatter dataKey="frequency" fill="#8B4513" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Quality Issues Details */}
              <div className="space-y-4">
                {qualityIssues.map((issue, index) => (
                  <div key={index} className="border border-oud-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-oud-800">{issue.issueType}</h4>
                        <p className="text-sm text-oud-600">Frequency: {issue.frequency} occurrences</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.status === 'open' ? 'bg-red-100 text-red-600' :
                        issue.status === 'in_progress' ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {issue.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-600">{issue.impact}</p>
                        <p className="text-xs text-oud-600">Impact Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-oud-800">{issue.timeToResolve}h</p>
                        <p className="text-xs text-oud-600">Avg Resolution Time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-oud-800">{issue.affectedProducts.length}</p>
                        <p className="text-xs text-oud-600">Affected Products</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-oud-800 mb-1">Affected Products:</p>
                      <div className="flex flex-wrap gap-1">
                        {issue.affectedProducts.slice(0, 5).map((product, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            {product}
                          </span>
                        ))}
                        {issue.affectedProducts.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            +{issue.affectedProducts.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Root Cause Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-oud-500" />
                Root Cause Analysis
              </CardTitle>
              <CardDescription>Deep dive into the underlying causes of wastage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <Treemap
                  data={rootCauseAnalysis}
                  dataKey="impact"
                  ratio={4/3}
                  stroke="#fff"
                  fill="#8B4513"
                >
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value}%`,
                      'Impact'
                    ]}
                  />
                </Treemap>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Root Cause Details */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Detailed Root Cause Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rootCauseAnalysis.map((cause, index) => (
                  <div key={index} className="border border-oud-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-oud-800">{cause.category}</h4>
                      <span className="text-lg font-bold text-oud-800">{cause.impact}%</span>
                    </div>
                    <p className="text-sm text-oud-600 mb-3">{cause.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-oud-800 mb-2">Contributing Factors:</h5>
                        <ul className="space-y-1">
                          {cause.factors?.map((factor: string, i: number) => (
                            <li key={i} className="text-sm text-oud-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              {factor}
                            </li>
                          )) || []}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-oud-800 mb-2">Mitigation Strategies:</h5>
                        <ul className="space-y-1">
                          {cause.mitigations?.map((mitigation: string, i: number) => (
                            <li key={i} className="text-sm text-oud-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                              {mitigation}
                            </li>
                          )) || []}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Plan Tab */}
        <TabsContent value="actions" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-oud-500" />
                Recommended Action Plan
              </CardTitle>
              <CardDescription>Prioritized recommendations to reduce wastage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border border-oud-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-oud-800">{rec.title}</h4>
                        <p className="text-sm text-oud-600">{rec.description}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getPriorityColor(rec.priority) }}
                        >
                          {rec.priority?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-xl font-bold text-green-600">{formatCurrency(rec.estimatedSavings || 0)}</p>
                        <p className="text-xs text-green-600">Est. Savings</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xl font-bold text-blue-600">{rec.implementationTime || 'N/A'}</p>
                        <p className="text-xs text-blue-600">Implementation Time</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-xl font-bold text-orange-600">{formatCurrency(rec.investmentRequired || 0)}</p>
                        <p className="text-xs text-orange-600">Investment Required</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded">
                        <p className="text-xl font-bold text-purple-600">{rec.roi || 'N/A'}%</p>
                        <p className="text-xs text-purple-600">Expected ROI</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-oud-800 mb-2">Implementation Steps:</h5>
                        <ol className="space-y-1">
                          {rec.steps?.map((step: string, i: number) => (
                            <li key={i} className="text-sm text-oud-600 flex items-start gap-2">
                              <span className="flex items-center justify-center w-4 h-4 bg-oud-100 text-oud-700 text-xs rounded-full flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          )) || []}
                        </ol>
                      </div>
                      <div>
                        <h5 className="font-medium text-oud-800 mb-2">Success Metrics:</h5>
                        <ul className="space-y-1">
                          {rec.metrics?.map((metric: string, i: number) => (
                            <li key={i} className="text-sm text-oud-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-oud-500 rounded-full mt-2 flex-shrink-0"></span>
                              {metric}
                            </li>
                          )) || []}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}