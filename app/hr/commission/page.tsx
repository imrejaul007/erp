'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Building,
  MapPin,
  Star,
  Crown,
  Trophy,
  Plus,
  Edit,
  Eye,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  Calculator,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Wallet,
  CreditCard,
  Receipt,
  FileText,
  ShoppingBag,
  Gift,
  Package,
  ArrowLeft} from 'lucide-react';

const CommissionPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [showSchemeDialog, setShowSchemeDialog] = useState(false);
  const [showCalculateDialog, setShowCalculateDialog] = useState(false);

  // Sample commission data
  const commissionMetrics = {
    totalCommissions: 89750,
    avgCommissionRate: 2.8,
    topPerformer: 'Ahmed Al-Rashid',
    totalSalesForCommission: 3205357,
    pendingApprovals: 5,
    paidCommissions: 67200,
    trends: {
      commissions: +15.8,
      salesVolume: +12.3,
      participants: +8.2
    }
  };

  const commissionData = [
    {
      id: 'COM001',
      employeeId: 'EMP001',
      employeeName: 'Ahmed Al-Rashid',
      employeeNameArabic: 'أحمد الراشد',
      position: 'Store Manager',
      location: 'Dubai Mall Store',
      period: '2024-01',
      salesTarget: 180000,
      actualSales: 205340,
      achievementRate: 114.1,
      baseCommissionRate: 2.5,
      bonusRate: 0.5, // Additional for exceeding target
      totalCommissionRate: 3.0,
      commissionEarned: 6160,
      productCategories: {
        'Oud Premium': { sales: 89500, commission: 2685, rate: 3.0 },
        'Oud Classic': { sales: 67200, commission: 1344, rate: 2.0 },
        'Perfumes': { sales: 48640, commission: 2136, rate: 2.5 }
      },
      specialIncentives: [
        { name: 'Target Exceeded Bonus', amount: 1000 },
        { name: 'Customer Satisfaction Bonus', amount: 500 }
      ],
      status: 'approved',
      approvedBy: 'HR001',
      approvedDate: '2024-02-01',
      paymentStatus: 'paid',
      paymentDate: '2024-02-01'
    },
    {
      id: 'COM002',
      employeeId: 'EMP002',
      employeeName: 'Fatima Al-Zahra',
      employeeNameArabic: 'فاطمة الزهراء',
      position: 'Sales Associate',
      location: 'Abu Dhabi Mall Store',
      period: '2024-01',
      salesTarget: 120000,
      actualSales: 134580,
      achievementRate: 112.2,
      baseCommissionRate: 1.5,
      bonusRate: 0.3,
      totalCommissionRate: 1.8,
      commissionEarned: 2422,
      productCategories: {
        'Oud Premium': { sales: 52300, commission: 1569, rate: 3.0 },
        'Oud Classic': { sales: 45800, commission: 458, rate: 1.0 },
        'Perfumes': { sales: 36480, commission: 395, rate: 1.5 }
      },
      specialIncentives: [
        { name: 'New Customer Acquisition', amount: 300 }
      ],
      status: 'pending_approval',
      approvedBy: null,
      approvedDate: null,
      paymentStatus: 'pending',
      paymentDate: null
    },
    {
      id: 'COM003',
      employeeId: 'EMP003',
      employeeName: 'Omar Hassan',
      employeeNameArabic: 'عمر حسن',
      position: 'Assistant Manager',
      location: 'Sharjah City Centre',
      period: '2024-01',
      salesTarget: 150000,
      actualSales: 167890,
      achievementRate: 111.9,
      baseCommissionRate: 2.0,
      bonusRate: 0.4,
      totalCommissionRate: 2.4,
      commissionEarned: 4029,
      productCategories: {
        'Oud Premium': { sales: 78900, commission: 2367, rate: 3.0 },
        'Oud Classic': { sales: 56780, commission: 851, rate: 1.5 },
        'Perfumes': { sales: 32210, commission: 811, rate: 2.5 }
      },
      specialIncentives: [
        { name: 'Team Performance Bonus', amount: 600 }
      ],
      status: 'approved',
      approvedBy: 'HR001',
      approvedDate: '2024-02-01',
      paymentStatus: 'pending',
      paymentDate: null
    }
  ];

  const commissionSchemes = [
    {
      id: 'scheme001',
      name: 'Store Manager Commission',
      nameArabic: 'عمولة مدير المتجر',
      type: 'tiered',
      positions: ['Store Manager'],
      locations: ['All Locations'],
      isActive: true,
      structure: {
        base: 2.5,
        tiers: [
          { threshold: 100, rate: 2.5 },
          { threshold: 110, rate: 3.0 },
          { threshold: 120, rate: 3.5 }
        ]
      },
      productRates: {
        'Oud Premium': 3.0,
        'Oud Classic': 2.0,
        'Perfumes': 2.5,
        'Accessories': 2.0
      },
      bonuses: [
        { name: 'Target Achievement', threshold: 100, amount: 1000 },
        { name: 'Excellence Bonus', threshold: 120, amount: 2000 }
      ],
      effectiveFrom: '2024-01-01',
      effectiveTo: null
    },
    {
      id: 'scheme002',
      name: 'Sales Associate Commission',
      nameArabic: 'عمولة مندوب المبيعات',
      type: 'flat_rate',
      positions: ['Sales Associate'],
      locations: ['All Locations'],
      isActive: true,
      structure: {
        base: 1.5,
        tiers: [
          { threshold: 100, rate: 1.5 },
          { threshold: 110, rate: 1.8 },
          { threshold: 115, rate: 2.0 }
        ]
      },
      productRates: {
        'Oud Premium': 3.0,
        'Oud Classic': 1.0,
        'Perfumes': 1.5,
        'Accessories': 1.2
      },
      bonuses: [
        { name: 'New Customer Bonus', threshold: 0, amount: 50 }
      ],
      effectiveFrom: '2024-01-01',
      effectiveTo: null
    },
    {
      id: 'scheme003',
      name: 'Assistant Manager Commission',
      nameArabic: 'عمولة مساعد المدير',
      type: 'hybrid',
      positions: ['Assistant Manager'],
      locations: ['All Locations'],
      isActive: true,
      structure: {
        base: 2.0,
        tiers: [
          { threshold: 100, rate: 2.0 },
          { threshold: 110, rate: 2.4 },
          { threshold: 115, rate: 2.8 }
        ]
      },
      productRates: {
        'Oud Premium': 3.0,
        'Oud Classic': 1.5,
        'Perfumes': 2.5,
        'Accessories': 1.8
      },
      bonuses: [
        { name: 'Team Performance', threshold: 105, amount: 600 }
      ],
      effectiveFrom: '2024-01-01',
      effectiveTo: null
    }
  ];

  const topPerformers = [
    {
      rank: 1,
      employeeId: 'EMP001',
      name: 'Ahmed Al-Rashid',
      nameArabic: 'أحمد الراشد',
      location: 'Dubai Mall Store',
      sales: 205340,
      commission: 6160,
      achievement: 114.1
    },
    {
      rank: 2,
      employeeId: 'EMP003',
      name: 'Omar Hassan',
      nameArabic: 'عمر حسن',
      location: 'Sharjah City Centre',
      sales: 167890,
      commission: 4029,
      achievement: 111.9
    },
    {
      rank: 3,
      employeeId: 'EMP002',
      name: 'Fatima Al-Zahra',
      nameArabic: 'فاطمة الزهراء',
      location: 'Abu Dhabi Mall Store',
      sales: 134580,
      commission: 2422,
      achievement: 112.2
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAchievementColor = (rate) => {
    if (rate >= 120) return 'text-purple-600';
    if (rate >= 110) return 'text-green-600';
    if (rate >= 100) return 'text-blue-600';
    if (rate >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Award className="h-5 w-5 text-gray-400" />;
      case 3: return <Trophy className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Sales Commission Tracking</h1>
          <p className="text-gray-600">Track and manage sales commissions across all locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={showCalculateDialog} onOpenChange={setShowCalculateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Commissions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Calculate Monthly Commissions</DialogTitle>
                <DialogDescription>
                  Process commission calculations for the selected period and criteria
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calcPeriod">Period</Label>
                    <Input type="month" id="calcPeriod" defaultValue="2024-02" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calcLocation">Location</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="dubai_mall">Dubai Mall Store</SelectItem>
                        <SelectItem value="abu_dhabi">Abu Dhabi Mall Store</SelectItem>
                        <SelectItem value="sharjah">Sharjah City Centre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cutoffDate">Sales Cutoff Date</Label>
                  <Input type="date" id="cutoffDate" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="includeReturns" />
                  <Label htmlFor="includeReturns">Include returns and refunds</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="applyBonuses" />
                  <Label htmlFor="applyBonuses">Apply performance bonuses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autoApprove" />
                  <Label htmlFor="autoApprove">Auto-approve qualifying commissions</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCalculateDialog(false)}>
                    Cancel
                  </Button>
                  <Button>Calculate Commissions</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                <p className="text-xl sm:text-2xl font-bold">AED {commissionMetrics.totalCommissions?.toLocaleString() || "0"}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(commissionMetrics.trends.commissions)}`}>
                  {getTrendIcon(commissionMetrics.trends.commissions)}
                  {Math.abs(commissionMetrics.trends.commissions)}% vs last month
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
                <p className="text-sm font-medium text-gray-600">Avg Commission Rate</p>
                <p className="text-xl sm:text-2xl font-bold">{commissionMetrics.avgCommissionRate}%</p>
                <p className="text-xs text-blue-600">Across all positions</p>
              </div>
              <Percent className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Sales</p>
                <p className="text-xl sm:text-2xl font-bold">AED {(commissionMetrics.totalSalesForCommission / 1000000).toFixed(1)}M</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(commissionMetrics.trends.salesVolume)}`}>
                  {getTrendIcon(commissionMetrics.trends.salesVolume)}
                  {Math.abs(commissionMetrics.trends.salesVolume)}% vs last month
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-xl sm:text-2xl font-bold">{commissionMetrics.pendingApprovals}</p>
                <p className="text-xs text-orange-600">Require review</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="commissions" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="commissions">Commission Tracking</TabsTrigger>
          <TabsTrigger value="schemes">Commission Schemes</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports & Payouts</TabsTrigger>
        </TabsList>

        {/* Commission Tracking Tab */}
        <TabsContent value="commissions" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>January 2024 Commissions</CardTitle>
                  <CardDescription>Track individual commission calculations and status</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current_month">Current Month</SelectItem>
                      <SelectItem value="previous_month">Previous Month</SelectItem>
                      <SelectItem value="2024-01">January 2024</SelectItem>
                      <SelectItem value="2023-12">December 2023</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Sales Target</TableHead>
                    <TableHead>Actual Sales</TableHead>
                    <TableHead>Achievement</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Earned Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissionData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{record.employeeName}</div>
                            <div className="text-sm text-gray-500">{record.employeeNameArabic}</div>
                            <div className="text-xs text-gray-400">{record.position} • {record.location}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">AED {record.salesTarget?.toLocaleString() || "0"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">AED {record.actualSales?.toLocaleString() || "0"}</div>
                        <div className="text-xs text-gray-500">
                          {record.actualSales > record.salesTarget ? '+' : ''}
                          {((record.actualSales - record.salesTarget) / record.salesTarget * 100).toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`font-medium ${getAchievementColor(record.achievementRate)}`}>
                            {record.achievementRate.toFixed(1)}%
                          </div>
                          <Progress
                            value={Math.min(record.achievementRate, 150)}
                            className="w-16 h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{record.totalCommissionRate.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">
                          Base: {record.baseCommissionRate}% + Bonus: {record.bonusRate}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-green-600">
                          AED {record.commissionEarned?.toLocaleString() || "0"}
                        </div>
                        {record.specialIncentives.length > 0 && (
                          <div className="text-xs text-purple-600">
                            + {record.specialIncentives.reduce((sum, inc) => sum + inc.amount, 0)} incentives
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPaymentStatusColor(record.paymentStatus)} variant="outline">
                            {record.paymentStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {record.status === 'pending_approval' && (
                            <Button variant="outline" size="sm" className="text-green-600">
                              <CheckCircle className="h-4 w-4" />
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

        {/* Commission Schemes Tab */}
        <TabsContent value="schemes" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Commission Schemes</CardTitle>
                  <CardDescription>Configure commission structures for different positions</CardDescription>
                </div>
                <Dialog open={showSchemeDialog} onOpenChange={setShowSchemeDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Scheme
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Commission Scheme</DialogTitle>
                      <DialogDescription>
                        Define a new commission structure with rates and bonuses
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="schemeName">Scheme Name (English)</Label>
                          <Input id="schemeName" placeholder="e.g., Senior Sales Associate" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="schemeNameArabic">Scheme Name (Arabic)</Label>
                          <Input id="schemeNameArabic" placeholder="e.g., مندوب مبيعات أول" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="schemeType">Scheme Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flat_rate">Flat Rate</SelectItem>
                              <SelectItem value="tiered">Tiered</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="baseRate">Base Commission Rate (%)</Label>
                          <Input type="number" id="baseRate" placeholder="2.5" step="0.1" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Applicable Positions</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="store_manager" />
                            <Label htmlFor="store_manager">Store Manager</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="assistant_manager" />
                            <Label htmlFor="assistant_manager">Assistant Manager</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="sales_associate" />
                            <Label htmlFor="sales_associate">Sales Associate</Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label>Product Category Rates</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="oudPremiumRate">Oud Premium (%)</Label>
                            <Input type="number" id="oudPremiumRate" placeholder="3.0" step="0.1" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="oudClassicRate">Oud Classic (%)</Label>
                            <Input type="number" id="oudClassicRate" placeholder="2.0" step="0.1" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="perfumesRate">Perfumes (%)</Label>
                            <Input type="number" id="perfumesRate" placeholder="2.5" step="0.1" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accessoriesRate">Accessories (%)</Label>
                            <Input type="number" id="accessoriesRate" placeholder="2.0" step="0.1" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="effectiveFrom">Effective From</Label>
                        <Input type="date" id="effectiveFrom" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowSchemeDialog(false)}>
                          Cancel
                        </Button>
                        <Button>Create Scheme</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissionSchemes.map((scheme) => (
                  <div key={scheme.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{scheme.name}</div>
                        <div className="text-sm text-gray-500">{scheme.nameArabic}</div>
                        <div className="text-sm text-gray-600">
                          {scheme.positions.join(', ')} • {scheme.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-center">
                        <div className="font-medium">{scheme.structure.base}%</div>
                        <div className="text-xs text-gray-500">Base Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{scheme.structure.tiers.length}</div>
                        <div className="text-xs text-gray-500">Tiers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{scheme.bonuses.length}</div>
                        <div className="text-xs text-gray-500">Bonuses</div>
                      </div>
                      <div className="text-center">
                        <Badge variant={scheme.isActive ? "default" : "secondary"}>
                          {scheme.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="performance" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Highest commission earners this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer) => (
                    <div key={performer.employeeId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getRankIcon(performer.rank)}
                          <span className="font-bold text-lg">#{performer.rank}</span>
                        </div>
                        <div>
                          <div className="font-medium">{performer.name}</div>
                          <div className="text-sm text-gray-500">{performer.nameArabic}</div>
                          <div className="text-xs text-gray-400">{performer.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          AED {performer.commission?.toLocaleString() || "0"}
                        </div>
                        <div className="text-sm text-gray-600">
                          AED {performer.sales?.toLocaleString() || "0"} sales
                        </div>
                        <div className={`text-xs ${getAchievementColor(performer.achievement)}`}>
                          {performer.achievement}% achievement
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission by Category</CardTitle>
                <CardDescription>Product category commission breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Oud Premium</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-24 h-2" />
                      <span className="text-sm font-medium">AED 8,621</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Perfumes</span>
                    <div className="flex items-center gap-2">
                      <Progress value={28} className="w-24 h-2" />
                      <span className="text-sm font-medium">AED 3,342</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Oud Classic</span>
                    <div className="flex items-center gap-2">
                      <Progress value={22} className="w-24 h-2" />
                      <span className="text-sm font-medium">AED 2,653</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Accessories</span>
                    <div className="flex items-center gap-2">
                      <Progress value={5} className="w-24 h-2" />
                      <span className="text-sm font-medium">AED 1,134</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Commission and sales performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">+15.8%</div>
                  <div className="text-sm text-gray-600">Commission Growth</div>
                  <div className="text-xs text-gray-500">vs last month</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">+12.3%</div>
                  <div className="text-sm text-gray-600">Sales Volume</div>
                  <div className="text-xs text-gray-500">vs last month</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">+8.2%</div>
                  <div className="text-sm text-gray-600">Active Participants</div>
                  <div className="text-xs text-gray-500">vs last month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports & Payouts Tab */}
        <TabsContent value="reports" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Reports & Payouts</CardTitle>
              <CardDescription>Generate reports and process commission payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Commission Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Performance Analytics</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Target className="h-5 w-5" />
                  <span className="text-xs">Target Achievement</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Award className="h-5 w-5" />
                  <span className="text-xs">Top Performers</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <PieChart className="h-5 w-5" />
                  <span className="text-xs">Category Breakdown</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Wallet className="h-5 w-5" />
                  <span className="text-xs">Payout Summary</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Monthly Summary</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Receipt className="h-5 w-5" />
                  <span className="text-xs">Payment Receipts</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Payouts</CardTitle>
              <CardDescription>Commission payments requiring processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Omar Hassan - January 2024</div>
                      <div className="text-sm text-gray-500">Commission: AED 4,029 • Approved</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Process Payment</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Fatima Al-Zahra - January 2024</div>
                      <div className="text-sm text-gray-500">Commission: AED 2,422 • Pending Approval</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Review</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommissionPage;