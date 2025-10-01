'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Star,
  TrendingUp,
  TrendingDown,
  Gauge,
  Target,
  Award,
  Zap,
  BarChart3,
  PieChart,
  Shield,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { ProductionMetrics, SupplierPerformance } from '@/types/analytics';

interface OperationalDashboardProps {
  dateRange?: { start: Date; end: Date };
  productionLine?: string;
  department?: string;
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F'];

export default function OperationalDashboard({ dateRange, productionLine, department }: OperationalDashboardProps) {
  const [productionMetrics, setProductionMetrics] = useState<ProductionMetrics | null>(null);
  const [qualityData, setQualityData] = useState<any[]>([]);
  const [staffProductivity, setStaffProductivity] = useState<any[]>([]);
  const [customerSatisfaction, setCustomerSatisfaction] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>({});
  const [realTimeData, setRealTimeData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperationalData();

    // Set up real-time updates
    const interval = setInterval(fetchRealTimeData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [dateRange, productionLine, department]);

  const fetchOperationalData = async () => {
    try {
      setLoading(true);

      // Mock data - replace with actual API calls
      setProductionMetrics({
        efficiency: 87.5,
        qualityScore: 94.2,
        wastagePercentage: 2.8,
        yieldRate: 92.3,
        cycleTime: 45.2,
        defectRate: 1.5,
      });

      setQualityData([
        { month: 'Jan', defectRate: 2.1, customerComplaints: 5, qualityScore: 92.5 },
        { month: 'Feb', defectRate: 1.8, customerComplaints: 3, qualityScore: 94.1 },
        { month: 'Mar', defectRate: 1.9, customerComplaints: 4, qualityScore: 93.8 },
        { month: 'Apr', defectRate: 1.6, customerComplaints: 2, qualityScore: 95.2 },
        { month: 'May', defectRate: 1.4, customerComplaints: 3, qualityScore: 95.8 },
        { month: 'Jun', defectRate: 1.5, customerComplaints: 2, qualityScore: 94.2 },
      ]);

      setStaffProductivity([
        { name: 'Ahmed Hassan', department: 'Production', efficiency: 92.5, quality: 96.8, output: 145 },
        { name: 'Fatima Ali', department: 'Quality Control', efficiency: 88.7, quality: 98.2, output: 120 },
        { name: 'Omar Mohammed', department: 'Packaging', efficiency: 90.3, quality: 94.5, output: 160 },
        { name: 'Sarah Khalil', department: 'Raw Materials', efficiency: 85.9, quality: 93.7, output: 110 },
        { name: 'Youssef Ahmad', department: 'Production', efficiency: 89.1, quality: 95.3, output: 135 },
      ]);

      setCustomerSatisfaction([
        { period: 'Jan', satisfaction: 4.2, reviews: 85, nps: 45 },
        { period: 'Feb', satisfaction: 4.3, reviews: 92, nps: 48 },
        { period: 'Mar', satisfaction: 4.4, reviews: 98, nps: 52 },
        { period: 'Apr', satisfaction: 4.5, reviews: 105, nps: 55 },
        { period: 'May', satisfaction: 4.6, reviews: 112, nps: 58 },
        { period: 'Jun', satisfaction: 4.4, reviews: 108, nps: 54 },
      ]);

      setSystemHealth({
        uptime: 99.2,
        avgResponseTime: 245,
        errorRate: 0.3,
        throughput: 1250,
        memoryUsage: 68.5,
        cpuUsage: 45.2,
      });

    } catch (error) {
      console.error('Error fetching operational data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    // Mock real-time data updates
    setRealTimeData({
      currentProduction: Math.floor(Math.random() * 50) + 150,
      activeWorkers: Math.floor(Math.random() * 5) + 25,
      qualityChecks: Math.floor(Math.random() * 10) + 40,
      completedOrders: Math.floor(Math.random() * 20) + 180,
      lastUpdated: new Date().toISOString(),
    });
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600 bg-green-100';
    if (value >= thresholds.warning) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  if (loading) {
    return <div className="text-center py-8">Loading operational dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-oud-800">Operational Dashboard</h2>
          <p className="text-oud-600">Real-time production, quality, and performance monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-oud-600">
          <Activity className="h-4 w-4 animate-pulse text-green-500" />
          <span>Live • Last updated: {new Date(realTimeData.lastUpdated || Date.now()).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-luxury border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Current Production</p>
                <p className="text-xl font-bold text-green-800">
                  {realTimeData.currentProduction || 0} units/hr
                </p>
              </div>
              <Settings className="h-8 w-8 text-green-600 animate-spin" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Active Workers</p>
                <p className="text-xl font-bold text-oud-800">
                  {realTimeData.activeWorkers || 0}
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
                <p className="text-sm text-oud-600">Quality Checks</p>
                <p className="text-xl font-bold text-oud-800">
                  {realTimeData.qualityChecks || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Completed Orders</p>
                <p className="text-xl font-bold text-oud-800">
                  {realTimeData.completedOrders || 0}
                </p>
              </div>
              <Target className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="production" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="satisfaction">Customer</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Production Efficiency Tab */}
        <TabsContent value="production" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Metrics Gauge */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-oud-500" />
                  Production Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width={250} height={250}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="90%"
                      data={[{ value: productionMetrics?.efficiency || 0 }]}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={10}
                        fill="#8B4513"
                      />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-2xl font-bold fill-oud-800"
                      >
                        {formatPercentage(productionMetrics?.efficiency || 0)}
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Key Production Metrics */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border border-oud-200 rounded-lg">
                    <p className="text-sm text-oud-600">Yield Rate</p>
                    <p className="text-xl font-bold text-oud-800">
                      {formatPercentage(productionMetrics?.yieldRate || 0)}
                    </p>
                  </div>
                  <div className="text-center p-3 border border-oud-200 rounded-lg">
                    <p className="text-sm text-oud-600">Cycle Time</p>
                    <p className="text-xl font-bold text-oud-800">
                      {productionMetrics?.cycleTime.toFixed(1) || 0} min
                    </p>
                  </div>
                  <div className="text-center p-3 border border-oud-200 rounded-lg">
                    <p className="text-sm text-oud-600">Wastage</p>
                    <p className="text-xl font-bold text-red-600">
                      {formatPercentage(productionMetrics?.wastagePercentage || 0)}
                    </p>
                  </div>
                  <div className="text-center p-3 border border-oud-200 rounded-lg">
                    <p className="text-sm text-oud-600">Defect Rate</p>
                    <p className="text-xl font-bold text-orange-600">
                      {formatPercentage(productionMetrics?.defectRate || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Production Performance Chart */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-oud-500" />
                Production Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="qualityScore"
                    fill="#8B4513"
                    fillOpacity={0.3}
                    stroke="#8B4513"
                    name="Quality Score"
                  />
                  <Bar yAxisId="right" dataKey="defectRate" fill="#ef4444" name="Defect Rate %" />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="qualityScore"
                    stroke="#D2B48C"
                    strokeWidth={3}
                    name="Quality Trend"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Control Tab */}
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-oud-600">Overall Quality Score</p>
                <p className="text-2xl font-bold text-oud-800">
                  {formatPercentage(productionMetrics?.qualityScore || 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-oud-600">Defect Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatPercentage(productionMetrics?.defectRate || 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-oud-600">Customer Complaints</p>
                <p className="text-2xl font-bold text-oud-800">
                  {qualityData[qualityData.length - 1]?.customerComplaints || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quality Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={qualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="qualityScore"
                      stroke="#22c55e"
                      strokeWidth={3}
                      name="Quality Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="defectRate"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Defect Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quality Control Process */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>QC Process Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Incoming Inspection</span>
                    </div>
                    <span className="text-green-600 font-bold">98.5%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">In-Process Testing</span>
                    </div>
                    <span className="text-green-600 font-bold">96.2%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-orange-800">Final Inspection</span>
                    </div>
                    <span className="text-orange-600 font-bold">94.8%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Packaging QC</span>
                    </div>
                    <span className="text-green-600 font-bold">99.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staff Productivity Tab */}
        <TabsContent value="staff" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Staff Performance Chart */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-oud-500" />
                  Staff Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={staffProductivity} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value: number) => formatPercentage(value)} />
                    <Bar dataKey="efficiency" fill="#8B4513" name="Efficiency" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip />
                    <Legend />
                    <RechartsPieChart
                      data={staffProductivity.reduce((acc: any[], staff) => {
                        const existing = acc.find(item => item.name === staff.department);
                        if (existing) {
                          existing.value += staff.efficiency;
                          existing.count += 1;
                        } else {
                          acc.push({ name: staff.department, value: staff.efficiency, count: 1 });
                        }
                        return acc;
                      }, []).map(dept => ({ ...dept, value: dept.value / dept.count }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Staff Performance Table */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Individual Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className="text-left py-2 px-4 text-oud-700">Name</th>
                      <th className="text-left py-2 px-4 text-oud-700">Department</th>
                      <th className="text-right py-2 px-4 text-oud-700">Efficiency</th>
                      <th className="text-right py-2 px-4 text-oud-700">Quality Score</th>
                      <th className="text-right py-2 px-4 text-oud-700">Output</th>
                      <th className="text-center py-2 px-4 text-oud-700">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffProductivity.map((staff, index) => (
                      <tr key={index} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4 font-medium text-oud-800">{staff.name}</td>
                        <td className="py-3 px-4 text-oud-600">{staff.department}</td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatPercentage(staff.efficiency)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {formatPercentage(staff.quality)}
                        </td>
                        <td className="text-right py-3 px-4 text-oud-800">
                          {staff.output} units
                        </td>
                        <td className="text-center py-3 px-4">
                          {staff.efficiency >= 90 ? (
                            <Award className="h-5 w-5 text-yellow-500 mx-auto" />
                          ) : staff.efficiency >= 85 ? (
                            <Star className="h-5 w-5 text-blue-500 mx-auto" />
                          ) : (
                            <Target className="h-5 w-5 text-gray-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Satisfaction Tab */}
        <TabsContent value="satisfaction" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-oud-600">Avg Rating</p>
                <p className="text-2xl font-bold text-oud-800">
                  {customerSatisfaction[customerSatisfaction.length - 1]?.satisfaction.toFixed(1) || 0}/5.0
                </p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-oud-600">Total Reviews</p>
                <p className="text-2xl font-bold text-oud-800">
                  {customerSatisfaction.reduce((sum, data) => sum + data.reviews, 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-oud-600">NPS Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {customerSatisfaction[customerSatisfaction.length - 1]?.nps || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Satisfaction Trends */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-oud-500" />
                Customer Satisfaction Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={customerSatisfaction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" domain={[0, 5]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="satisfaction"
                    fill="#8B4513"
                    fillOpacity={0.3}
                    stroke="#8B4513"
                    name="Satisfaction Rating"
                  />
                  <Bar yAxisId="right" dataKey="reviews" fill="#D2B48C" name="Number of Reviews" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="nps"
                    stroke="#22c55e"
                    strokeWidth={3}
                    name="NPS Score"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <Activity className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-oud-600">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPercentage(systemHealth.uptime)}
                </p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <Zap className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-oud-600">Response Time</p>
                <p className="text-2xl font-bold text-oud-800">
                  {systemHealth.avgResponseTime}ms
                </p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-oud-600">Error Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatPercentage(systemHealth.errorRate)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Performance Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>System Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { metric: 'Uptime', value: systemHealth.uptime },
                    { metric: 'Throughput', value: (systemHealth.throughput / 15) }, // Normalized to 100
                    { metric: 'Memory', value: 100 - systemHealth.memoryUsage }, // Inverted for better visualization
                    { metric: 'CPU', value: 100 - systemHealth.cpuUsage }, // Inverted
                    { metric: 'Reliability', value: 100 - systemHealth.errorRate * 10 }, // Scaled and inverted
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#8B4513"
                      fill="#8B4513"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Resource Usage */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-oud-600">Memory Usage</span>
                    <span className="text-sm font-medium text-oud-800">
                      {formatPercentage(systemHealth.memoryUsage)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        systemHealth.memoryUsage > 80 ? 'bg-red-500' :
                        systemHealth.memoryUsage > 60 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${systemHealth.memoryUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-oud-600">CPU Usage</span>
                    <span className="text-sm font-medium text-oud-800">
                      {formatPercentage(systemHealth.cpuUsage)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        systemHealth.cpuUsage > 80 ? 'bg-red-500' :
                        systemHealth.cpuUsage > 60 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${systemHealth.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-oud-200">
                  <div className="flex justify-between">
                    <span className="text-sm text-oud-600">Throughput:</span>
                    <span className="font-bold text-oud-800">{systemHealth.throughput} req/min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}