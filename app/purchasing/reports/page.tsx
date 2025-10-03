'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Building,
  MapPin,
  Star,
  Clock,
  Package,
  DollarSign,
  Truck,
  AlertTriangle,
  CheckCircle,
  Target,
  Award,
  Users,
  Globe,
  Activity,
  PieChart,
  LineChart,
  Eye,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Timer,
  Zap,
  Shield,
  ThumbsUp,
  ThumbsDown,
  Calculator,
  CreditCard,
  Receipt,
  ArrowLeft} from 'lucide-react';
import { format } from 'date-fns';

const SupplierReportsPage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisQuarter');
  const [selectedMetric, setSelectedMetric] = useState('performance');

  // Sample vendor performance data
  const vendorPerformance = [
    {
      id: 1,
      name: 'Al-Rashid Oud Suppliers',
      country: 'UAE',
      category: 'Oud & Attar',
      totalSpent: 456780,
      totalOrders: 24,
      onTimeDelivery: 95.8,
      qualityRating: 4.8,
      priceCompetitiveness: 4.6,
      responseTime: 2.3,
      defectRate: 0.5,
      leadTime: 5.2,
      paymentTerms: 30,
      riskScore: 'Low',
      performanceScore: 94.2,
      trend: 'up',
      lastOrder: '2024-01-20'
    },
    {
      id: 2,
      name: 'Taif Rose Company',
      country: 'Saudi Arabia',
      category: 'Rose & Florals',
      totalSpent: 289650,
      totalOrders: 18,
      onTimeDelivery: 88.9,
      qualityRating: 4.6,
      priceCompetitiveness: 4.4,
      responseTime: 3.1,
      defectRate: 1.2,
      leadTime: 7.8,
      paymentTerms: 45,
      riskScore: 'Low',
      performanceScore: 87.4,
      trend: 'up',
      lastOrder: '2024-01-18'
    },
    {
      id: 3,
      name: 'Cambodian Oud Direct',
      country: 'Cambodia',
      category: 'Premium Oud',
      totalSpent: 634500,
      totalOrders: 8,
      onTimeDelivery: 92.1,
      qualityRating: 4.9,
      priceCompetitiveness: 4.2,
      responseTime: 4.2,
      defectRate: 0.3,
      leadTime: 12.5,
      paymentTerms: 60,
      riskScore: 'Medium',
      performanceScore: 89.8,
      trend: 'up',
      lastOrder: '2024-01-24'
    },
    {
      id: 4,
      name: 'Mumbai Attar House',
      country: 'India',
      category: 'Traditional Attars',
      totalSpent: 178900,
      totalOrders: 32,
      onTimeDelivery: 78.1,
      qualityRating: 4.4,
      priceCompetitiveness: 4.8,
      responseTime: 2.8,
      defectRate: 2.1,
      leadTime: 9.2,
      paymentTerms: 30,
      riskScore: 'Medium',
      performanceScore: 81.3,
      trend: 'down',
      lastOrder: '2024-01-25'
    },
    {
      id: 5,
      name: 'Omani Frankincense Co.',
      country: 'Oman',
      category: 'Frankincense',
      totalSpent: 124300,
      totalOrders: 12,
      onTimeDelivery: 91.7,
      qualityRating: 4.7,
      priceCompetitiveness: 4.3,
      responseTime: 3.5,
      defectRate: 0.8,
      leadTime: 6.8,
      paymentTerms: 30,
      riskScore: 'Low',
      performanceScore: 88.9,
      trend: 'stable',
      lastOrder: '2024-01-22'
    }
  ];

  // Sample spending analysis
  const spendingAnalysis = {
    totalSpend: 1684130,
    categories: [
      { name: 'Premium Oud', spend: 634500, percentage: 37.7, change: 15.2 },
      { name: 'Oud & Attar', spend: 456780, percentage: 27.1, change: 8.9 },
      { name: 'Rose & Florals', spend: 289650, percentage: 17.2, change: -2.1 },
      { name: 'Traditional Attars', spend: 178900, percentage: 10.6, change: -5.3 },
      { name: 'Frankincense', spend: 124300, percentage: 7.4, change: 12.8 }
    ],
    byCountry: [
      { name: 'Cambodia', spend: 634500, percentage: 37.7, orders: 8 },
      { name: 'UAE', spend: 456780, percentage: 27.1, orders: 24 },
      { name: 'Saudi Arabia', spend: 289650, percentage: 17.2, orders: 18 },
      { name: 'India', spend: 178900, percentage: 10.6, orders: 32 },
      { name: 'Oman', spend: 124300, percentage: 7.4, orders: 12 }
    ]
  };

  // Sample delivery performance
  const deliveryMetrics = {
    averageLeadTime: 8.3,
    onTimeDeliveryRate: 89.1,
    totalShipments: 94,
    delayedShipments: 10,
    byMethod: [
      { method: 'Sea Freight', shipments: 35, onTime: 91.4, avgDays: 18.2 },
      { method: 'Air Freight', shipments: 28, onTime: 96.4, avgDays: 4.1 },
      { method: 'Land Transport', shipments: 31, onTime: 80.6, avgDays: 7.8 }
    ]
  };

  // Sample quality metrics
  const qualityMetrics = {
    overallRating: 4.65,
    totalDefects: 23,
    defectRate: 1.2,
    returnsRate: 0.8,
    byCategory: [
      { category: 'Premium Oud', rating: 4.9, defects: 2, returns: 0 },
      { category: 'Oud & Attar', rating: 4.8, defects: 4, returns: 1 },
      { category: 'Rose & Florals', rating: 4.6, defects: 6, returns: 2 },
      { category: 'Traditional Attars', rating: 4.4, defects: 9, returns: 3 },
      { category: 'Frankincense', rating: 4.7, defects: 2, returns: 1 }
    ]
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Supplier Performance Reports</h1>
          <p className="text-gray-600">Analyze vendor performance and purchasing analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisQuarter">This Quarter</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spend</p>
                <p className="text-xl sm:text-2xl font-bold">USD ${(spendingAnalysis.totalSpend / 1000).toFixed(0)}K</p>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% from last quarter
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-xl sm:text-2xl font-bold">88.3</p>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +3.2% improvement
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
                <p className="text-xl sm:text-2xl font-bold">{deliveryMetrics.onTimeDeliveryRate}%</p>
                <div className="text-xs text-yellow-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -1.5% from target
                </div>
              </div>
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quality Rating</p>
                <p className="text-xl sm:text-2xl font-bold">{qualityMetrics.overallRating}</p>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Excellent standard
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Vendor Performance Table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Performance Scorecard</CardTitle>
                  <CardDescription>
                    Comprehensive performance metrics for all suppliers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>On-Time %</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Lead Time</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorPerformance.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{vendor.name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {vendor.country}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`font-bold ${getPerformanceColor(vendor.performanceScore)}`}>
                                {vendor.performanceScore}
                              </div>
                              <Progress value={vendor.performanceScore} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={vendor.onTimeDelivery >= 90 ? 'text-green-600' : vendor.onTimeDelivery >= 80 ? 'text-yellow-600' : 'text-red-600'}>
                              {vendor.onTimeDelivery}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{vendor.qualityRating}</span>
                            </div>
                          </TableCell>
                          <TableCell>{vendor.leadTime} days</TableCell>
                          <TableCell>
                            {getTrendIcon(vendor.trend)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vendorPerformance
                    .sort((a, b) => b.performanceScore - a.performanceScore)
                    .slice(0, 3)
                    .map((vendor, index) => (
                      <div key={vendor.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{vendor.name}</div>
                          <div className="text-xs text-gray-500">{vendor.category}</div>
                        </div>
                        <div className={`font-bold ${getPerformanceColor(vendor.performanceScore)}`}>
                          {vendor.performanceScore}
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Score</span>
                    <span className="font-medium">88.3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top Performer</span>
                    <span className="font-medium">94.2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Improvement Rate</span>
                    <span className="font-medium text-green-600">+3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Vendors</span>
                    <span className="font-medium">{vendorPerformance.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Spending by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>
                  Total spend: USD ${spendingAnalysis.totalSpend?.toLocaleString() || "0"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spendingAnalysis.categories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{category.percentage}%</span>
                          <div className={`text-xs flex items-center gap-1 ${
                            category.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {category.change > 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {Math.abs(category.change)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={category.percentage} className="flex-1" />
                        <span className="text-sm font-medium">
                          ${(category.spend / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Spending by Country */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Country</CardTitle>
                <CardDescription>
                  Geographic distribution of supplier spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spendingAnalysis.byCountry.map((country, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{country.name}</div>
                          <div className="text-sm text-gray-500">{country.orders} orders</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(country.spend / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-gray-500">{country.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Spending Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
              <CardDescription>
                Purchasing volume and trend analysis over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto mb-2" />
                  <p>Interactive spending trend chart would be displayed here</p>
                  <p className="text-sm">Connected to real-time purchasing data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Delivery Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{deliveryMetrics.averageLeadTime}</div>
                    <div className="text-sm text-blue-800">Avg Lead Time (days)</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{deliveryMetrics.onTimeDeliveryRate}%</div>
                    <div className="text-sm text-green-800">On-Time Delivery</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Shipments</span>
                    <span className="font-medium">{deliveryMetrics.totalShipments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delayed Shipments</span>
                    <span className="font-medium text-red-600">{deliveryMetrics.delayedShipments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-medium text-green-600">
                      {((deliveryMetrics.totalShipments - deliveryMetrics.delayedShipments) / deliveryMetrics.totalShipments * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery by Method */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Shipping Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryMetrics.byMethod.map((method, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {method.method === 'Sea Freight' && <Package className="h-4 w-4" />}
                          {method.method === 'Air Freight' && <Activity className="h-4 w-4" />}
                          {method.method === 'Land Transport' && <Truck className="h-4 w-4" />}
                          <span className="font-medium">{method.method}</span>
                        </div>
                        <span className="text-sm text-gray-500">{method.shipments} shipments</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">On-Time Rate</div>
                          <div className={`font-medium ${method.onTime >= 90 ? 'text-green-600' : method.onTime >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {method.onTime}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Avg Lead Time</div>
                          <div className="font-medium">{method.avgDays} days</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Delivery Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Delivery Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>On-Time Rate</TableHead>
                    <TableHead>Avg Lead Time</TableHead>
                    <TableHead>Last Delivery</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPerformance.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>{vendor.totalOrders}</TableCell>
                      <TableCell>
                        <div className={vendor.onTimeDelivery >= 90 ? 'text-green-600' : vendor.onTimeDelivery >= 80 ? 'text-yellow-600' : 'text-red-600'}>
                          {vendor.onTimeDelivery}%
                        </div>
                      </TableCell>
                      <TableCell>{vendor.leadTime} days</TableCell>
                      <TableCell>{vendor.lastOrder}</TableCell>
                      <TableCell>
                        {vendor.onTimeDelivery >= 90 ? (
                          <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                        ) : vendor.onTimeDelivery >= 80 ? (
                          <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Quality Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                      <Star className="h-6 w-6 fill-current" />
                      {qualityMetrics.overallRating}
                    </div>
                    <div className="text-sm text-yellow-800">Overall Rating</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-red-600">{qualityMetrics.defectRate}%</div>
                    <div className="text-sm text-red-800">Defect Rate</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Defects</span>
                    <span className="font-medium">{qualityMetrics.totalDefects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Returns Rate</span>
                    <span className="font-medium">{qualityMetrics.returnsRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Target</span>
                    <span className="font-medium">≥ 4.5 ⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Quality by Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityMetrics.byCategory.map((category, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{category.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{category.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Defects</div>
                          <div className={`font-medium ${category.defects === 0 ? 'text-green-600' : category.defects <= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {category.defects}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Returns</div>
                          <div className={`font-medium ${category.returns === 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {category.returns}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Quality Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Quality Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Quality Rating</TableHead>
                    <TableHead>Defect Rate</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Quality Trend</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPerformance.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{vendor.qualityRating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={vendor.defectRate <= 1 ? 'text-green-600' : vendor.defectRate <= 2 ? 'text-yellow-600' : 'text-red-600'}>
                          {vendor.defectRate}%
                        </span>
                      </TableCell>
                      <TableCell>{vendor.totalOrders}</TableCell>
                      <TableCell>
                        {getTrendIcon(vendor.trend)}
                      </TableCell>
                      <TableCell>
                        {vendor.qualityRating >= 4.5 ? (
                          <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                        ) : vendor.qualityRating >= 4.0 ? (
                          <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Poor</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Risk Assessment */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Risk Assessment</CardTitle>
                  <CardDescription>
                    Comprehensive risk analysis for all suppliers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Financial</TableHead>
                        <TableHead>Operational</TableHead>
                        <TableHead>Geographic</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorPerformance.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{vendor.name}</div>
                              <div className="text-sm text-gray-500">{vendor.country}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRiskColor(vendor.riskScore)}>
                              {vendor.riskScore}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {vendor.riskScore === 'Low' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              )}
                              <span className="text-sm">
                                {vendor.riskScore === 'Low' ? 'Stable' : 'Monitor'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {vendor.onTimeDelivery >= 90 ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              )}
                              <span className="text-sm">
                                {vendor.onTimeDelivery >= 90 ? 'Low' : 'Medium'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {vendor.country === 'UAE' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              )}
                              <span className="text-sm">
                                {vendor.country === 'UAE' ? 'Low' : 'Medium'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Risk Summary */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Low Risk</span>
                    <Badge className="bg-green-100 text-green-800">
                      {vendorPerformance.filter(v => v.riskScore === 'Low').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medium Risk</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {vendorPerformance.filter(v => v.riskScore === 'Medium').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High Risk</span>
                    <Badge className="bg-red-100 text-red-800">
                      {vendorPerformance.filter(v => v.riskScore === 'High').length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Factors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-800 text-sm">Geographic Risk</div>
                    <div className="text-yellow-700 text-xs">
                      85% suppliers in high-risk regions
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-800 text-sm">Currency Risk</div>
                    <div className="text-blue-700 text-xs">
                      Multi-currency exposure monitoring
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-800 text-sm">Quality Risk</div>
                    <div className="text-green-700 text-xs">
                      All suppliers meet quality standards
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Diversify supplier base to reduce geographic concentration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Implement regular financial health checks</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Monitor delivery performance trends closely</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierReportsPage;