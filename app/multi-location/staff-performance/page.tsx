'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/ui/progress";
import {
  Users,
  User,
  Crown,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Target,
  DollarSign,
  Clock,
  Calendar,
  MapPin,
  Building2,
  Phone,
  Mail,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  PieChart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Gift,
  ShoppingCart,
  Package,
  Percent,
  Timer,
  UserCheck,
  UserX,
  Coffee,
  Briefcase
} from 'lucide-react';

const StaffPerformancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState('thisMonth');

  // UAE Store Locations
  const locations = [
    { id: 'LOC-001', name: 'Dubai Mall Flagship', code: 'DXB-DM', type: 'flagship' },
    { id: 'LOC-002', name: 'Mall of Emirates', code: 'DXB-MOE', type: 'premium' },
    { id: 'LOC-003', name: 'Ibn Battuta Mall', code: 'DXB-IBN', type: 'standard' },
    { id: 'LOC-004', name: 'City Centre Mirdif', code: 'DXB-CCM', type: 'standard' },
    { id: 'LOC-005', name: 'Abu Dhabi Mall', code: 'AUH-ADM', type: 'premium' },
    { id: 'LOC-006', name: 'Sharjah City Centre', code: 'SHJ-SCC', type: 'standard' },
    { id: 'LOC-007', name: 'Al Ghurair Centre', code: 'DXB-AGC', type: 'standard' },
    { id: 'LOC-008', name: 'Yas Mall', code: 'AUH-YAS', type: 'premium' }
  ];

  // Sample staff performance data
  const staffMembers = [
    {
      id: 'EMP-001',
      name: 'Ahmed Al-Rashid',
      position: 'Store Manager',
      department: 'Management',
      location: 'LOC-001',
      email: 'ahmed.rashid@oudpalace.ae',
      phone: '+971-50-123-4567',
      joinDate: '2022-03-15T00:00:00',
      status: 'active',
      avatar: null,
      performance: {
        currentRating: 4.8,
        salesTarget: 85000,
        salesAchieved: 92000,
        salesPercentage: 108.2,
        customerSatisfaction: 4.9,
        attendanceRate: 98.5,
        punctualityScore: 96.0,
        teamLeadership: 4.7,
        productKnowledge: 4.8,
        communicationSkills: 4.6,
        totalOrders: 156,
        avgOrderValue: 590,
        conversionRate: 23.8,
        repeatCustomers: 68,
        revenueGenerated: 92000,
        hoursWorked: 184,
        overtimeHours: 12,
        trainingCompleted: 8,
        certifications: ['Sales Excellence', 'Customer Service', 'Leadership'],
        achievements: ['Top Performer Q3', 'Best Manager Award'],
        goals: ['Increase team sales by 15%', 'Complete advanced leadership training']
      },
      lastReview: '2024-09-15T00:00:00',
      nextReview: '2024-12-15T00:00:00'
    },
    {
      id: 'EMP-002',
      name: 'Fatima Al-Zahra',
      position: 'Senior Sales Associate',
      department: 'Sales',
      location: 'LOC-002',
      email: 'fatima.zahra@oudpalace.ae',
      phone: '+971-55-234-5678',
      joinDate: '2021-08-20T00:00:00',
      status: 'active',
      avatar: null,
      performance: {
        currentRating: 4.6,
        salesTarget: 45000,
        salesAchieved: 48500,
        salesPercentage: 107.8,
        customerSatisfaction: 4.8,
        attendanceRate: 97.2,
        punctualityScore: 94.5,
        teamLeadership: 4.2,
        productKnowledge: 4.9,
        communicationSkills: 4.7,
        totalOrders: 89,
        avgOrderValue: 545,
        conversionRate: 19.5,
        repeatCustomers: 45,
        revenueGenerated: 48500,
        hoursWorked: 176,
        overtimeHours: 8,
        trainingCompleted: 6,
        certifications: ['Product Expertise', 'Customer Service'],
        achievements: ['Sales Champion Q2', 'Customer Favorite'],
        goals: ['Achieve 110% of sales target', 'Mentor new team members']
      },
      lastReview: '2024-09-10T00:00:00',
      nextReview: '2024-12-10T00:00:00'
    },
    {
      id: 'EMP-003',
      name: 'Omar Hassan',
      position: 'Sales Associate',
      department: 'Sales',
      location: 'LOC-003',
      email: 'omar.hassan@oudpalace.ae',
      phone: '+971-56-345-6789',
      joinDate: '2023-01-10T00:00:00',
      status: 'active',
      avatar: null,
      performance: {
        currentRating: 4.2,
        salesTarget: 35000,
        salesAchieved: 33200,
        salesPercentage: 94.9,
        customerSatisfaction: 4.5,
        attendanceRate: 95.8,
        punctualityScore: 92.0,
        teamLeadership: 3.8,
        productKnowledge: 4.3,
        communicationSkills: 4.4,
        totalOrders: 67,
        avgOrderValue: 495,
        conversionRate: 16.2,
        repeatCustomers: 28,
        revenueGenerated: 33200,
        hoursWorked: 172,
        overtimeHours: 4,
        trainingCompleted: 4,
        certifications: ['Basic Sales', 'Product Knowledge'],
        achievements: ['Rising Star Award'],
        goals: ['Reach 100% sales target', 'Improve conversion rate to 18%']
      },
      lastReview: '2024-09-05T00:00:00',
      nextReview: '2024-12-05T00:00:00'
    },
    {
      id: 'EMP-004',
      name: 'Aisha Mohammed',
      position: 'Store Supervisor',
      department: 'Operations',
      location: 'LOC-004',
      email: 'aisha.mohammed@oudpalace.ae',
      phone: '+971-52-456-7890',
      joinDate: '2022-06-25T00:00:00',
      status: 'active',
      avatar: null,
      performance: {
        currentRating: 4.4,
        salesTarget: 40000,
        salesAchieved: 42800,
        salesPercentage: 107.0,
        customerSatisfaction: 4.6,
        attendanceRate: 99.1,
        punctualityScore: 98.5,
        teamLeadership: 4.5,
        productKnowledge: 4.4,
        communicationSkills: 4.3,
        totalOrders: 78,
        avgOrderValue: 549,
        conversionRate: 18.7,
        repeatCustomers: 38,
        revenueGenerated: 42800,
        hoursWorked: 180,
        overtimeHours: 6,
        trainingCompleted: 7,
        certifications: ['Operations Management', 'Team Leadership'],
        achievements: ['Perfect Attendance', 'Team Excellence Award'],
        goals: ['Optimize store operations', 'Train 3 new staff members']
      },
      lastReview: '2024-09-20T00:00:00',
      nextReview: '2024-12-20T00:00:00'
    },
    {
      id: 'EMP-005',
      name: 'Khalid Al-Mansoori',
      position: 'Regional Manager',
      department: 'Management',
      location: 'LOC-005',
      email: 'khalid.mansoori@oudpalace.ae',
      phone: '+971-50-567-8901',
      joinDate: '2020-11-01T00:00:00',
      status: 'active',
      avatar: null,
      performance: {
        currentRating: 4.9,
        salesTarget: 120000,
        salesAchieved: 135000,
        salesPercentage: 112.5,
        customerSatisfaction: 4.8,
        attendanceRate: 98.0,
        punctualityScore: 97.5,
        teamLeadership: 4.9,
        productKnowledge: 4.7,
        communicationSkills: 4.8,
        totalOrders: 198,
        avgOrderValue: 682,
        conversionRate: 26.4,
        repeatCustomers: 89,
        revenueGenerated: 135000,
        hoursWorked: 188,
        overtimeHours: 16,
        trainingCompleted: 12,
        certifications: ['Advanced Leadership', 'Strategic Management', 'Regional Operations'],
        achievements: ['Regional Excellence Award', 'Top Revenue Generator', 'Leadership Excellence'],
        goals: ['Expand to 2 new locations', 'Increase regional sales by 20%']
      },
      lastReview: '2024-09-25T00:00:00',
      nextReview: '2024-12-25T00:00:00'
    },
    {
      id: 'EMP-006',
      name: 'Mariam Al-Qasimi',
      position: 'Sales Associate',
      department: 'Sales',
      location: 'LOC-006',
      email: 'mariam.qasimi@oudpalace.ae',
      phone: '+971-55-678-9012',
      joinDate: '2023-05-15T00:00:00',
      status: 'active',
      avatar: null,
      performance: {
        currentRating: 3.8,
        salesTarget: 30000,
        salesAchieved: 26800,
        salesPercentage: 89.3,
        customerSatisfaction: 4.2,
        attendanceRate: 93.5,
        punctualityScore: 88.0,
        teamLeadership: 3.5,
        productKnowledge: 4.0,
        communicationSkills: 4.1,
        totalOrders: 52,
        avgOrderValue: 515,
        conversionRate: 14.8,
        repeatCustomers: 21,
        revenueGenerated: 26800,
        hoursWorked: 168,
        overtimeHours: 2,
        trainingCompleted: 3,
        certifications: ['Basic Sales'],
        achievements: ['Improvement Award'],
        goals: ['Reach 95% sales target', 'Complete product training', 'Improve punctuality']
      },
      lastReview: '2024-09-01T00:00:00',
      nextReview: '2024-12-01T00:00:00'
    }
  ];

  // Performance analytics
  const performanceAnalytics = {
    totalStaff: staffMembers.length,
    avgPerformanceRating: 4.45,
    topPerformers: staffMembers.filter(s => s.performance.currentRating >= 4.5).length,
    needsImprovement: staffMembers.filter(s => s.performance.currentRating < 4.0).length,
    totalRevenue: staffMembers.reduce((sum, s) => sum + s.performance.revenueGenerated, 0),
    avgAttendance: 96.8,
    trainingCompletion: 85.2,
    customerSatisfaction: 4.65,
    trends: {
      performance: +5.2,
      attendance: +2.1,
      satisfaction: +8.7,
      revenue: +18.3
    }
  };

  const getPerformanceColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (rating) => {
    if (rating >= 4.5) return { color: 'bg-green-100 text-green-800', label: 'Excellent' };
    if (rating >= 4.0) return { color: 'bg-blue-100 text-blue-800', label: 'Good' };
    if (rating >= 3.5) return { color: 'bg-yellow-100 text-yellow-800', label: 'Average' };
    return { color: 'bg-red-100 text-red-800', label: 'Needs Improvement' };
  };

  const getLocationName = (locationId) => {
    return locations.find(loc => loc.id === locationId)?.name || 'Unknown Location';
  };

  const getLocationCode = (locationId) => {
    return locations.find(loc => loc.id === locationId)?.code || 'UNK';
  };

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = locationFilter === 'all' || staff.location === locationFilter;
    const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter;

    let matchesPerformance = true;
    if (performanceFilter === 'excellent') matchesPerformance = staff.performance.currentRating >= 4.5;
    else if (performanceFilter === 'good') matchesPerformance = staff.performance.currentRating >= 4.0 && staff.performance.currentRating < 4.5;
    else if (performanceFilter === 'average') matchesPerformance = staff.performance.currentRating >= 3.5 && staff.performance.currentRating < 4.0;
    else if (performanceFilter === 'improvement') matchesPerformance = staff.performance.currentRating < 3.5;

    return matchesSearch && matchesLocation && matchesDepartment && matchesPerformance;
  });

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateTenure = (joinDate) => {
    const start = new Date(joinDate);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Performance Analytics</h1>
          <p className="text-gray-600">Monitor and analyze employee performance across all UAE store locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{performanceAnalytics.totalStaff}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(performanceAnalytics.trends.performance)}`}>
                  {getTrendIcon(performanceAnalytics.trends.performance)}
                  {Math.abs(performanceAnalytics.trends.performance)}% performance improvement
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold">{performanceAnalytics.avgPerformanceRating}/5.0</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(performanceAnalytics.trends.satisfaction)}`}>
                  <Star className="h-3 w-3" />
                  {Math.abs(performanceAnalytics.trends.satisfaction)}% satisfaction
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performers</p>
                <p className="text-2xl font-bold">{performanceAnalytics.topPerformers}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(performanceAnalytics.trends.attendance)}`}>
                  {getTrendIcon(performanceAnalytics.trends.attendance)}
                  {Math.abs(performanceAnalytics.trends.attendance)}% attendance
                </div>
              </div>
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">AED {(performanceAnalytics.totalRevenue / 1000).toFixed(0)}K</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(performanceAnalytics.trends.revenue)}`}>
                  {getTrendIcon(performanceAnalytics.trends.revenue)}
                  {Math.abs(performanceAnalytics.trends.revenue)}% vs last month
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, position, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                </SelectContent>
              </Select>

              <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Performance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Performance</SelectItem>
                  <SelectItem value="excellent">Excellent (4.5+)</SelectItem>
                  <SelectItem value="good">Good (4.0-4.4)</SelectItem>
                  <SelectItem value="average">Average (3.5-3.9)</SelectItem>
                  <SelectItem value="improvement">Needs Improvement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="detailed">Individual Analytics</TabsTrigger>
          <TabsTrigger value="rankings">Rankings & Leaderboard</TabsTrigger>
          <TabsTrigger value="reviews">Reviews & Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Staff performance rating breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Excellent (4.5+)</span>
                    </div>
                    <span className="font-medium">{performanceAnalytics.topPerformers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Good (4.0-4.4)</span>
                    </div>
                    <span className="font-medium">{staffMembers.filter(s => s.performance.currentRating >= 4.0 && s.performance.currentRating < 4.5).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Average (3.5-3.9)</span>
                    </div>
                    <span className="font-medium">{staffMembers.filter(s => s.performance.currentRating >= 3.5 && s.performance.currentRating < 4.0).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Needs Improvement</span>
                    </div>
                    <span className="font-medium">{performanceAnalytics.needsImprovement}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>Average performance by store location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locations.map((location) => {
                    const locationStaff = staffMembers.filter(s => s.location === location.id);
                    const avgRating = locationStaff.length > 0
                      ? locationStaff.reduce((sum, s) => sum + s.performance.currentRating, 0) / locationStaff.length
                      : 0;

                    return (
                      <div key={location.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{locationStaff.length} staff members</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getPerformanceColor(avgRating)}`}>
                            {avgRating.toFixed(1)}/5.0
                          </div>
                          <div className="text-sm text-gray-500">avg rating</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Performance metrics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Management', 'Sales', 'Operations', 'Customer Service'].map((department) => {
                    const deptStaff = staffMembers.filter(s => s.department === department);
                    const avgRating = deptStaff.length > 0
                      ? deptStaff.reduce((sum, s) => sum + s.performance.currentRating, 0) / deptStaff.length
                      : 0;
                    const totalRevenue = deptStaff.reduce((sum, s) => sum + s.performance.revenueGenerated, 0);

                    return (
                      <div key={department} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{department}</div>
                          <div className="text-sm text-gray-500">{deptStaff.length} members</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getPerformanceColor(avgRating)}`}>
                            {avgRating.toFixed(1)}/5.0
                          </div>
                          <div className="text-sm text-gray-500">AED {(totalRevenue / 1000).toFixed(0)}K revenue</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Latest staff accomplishments and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                    <Award className="h-6 w-6 text-yellow-600" />
                    <div>
                      <div className="font-medium">Khalid Al-Mansoori</div>
                      <div className="text-sm text-gray-600">Regional Excellence Award</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-medium">Ahmed Al-Rashid</div>
                      <div className="text-sm text-gray-600">Top Performer Q3 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                    <Star className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-medium">Fatima Al-Zahra</div>
                      <div className="text-sm text-gray-600">Customer Favorite Award</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Staff Performance</CardTitle>
              <CardDescription>
                Detailed performance analytics for each team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredStaff.map((staff) => {
                  const performanceBadge = getPerformanceBadge(staff.performance.currentRating);

                  return (
                    <div key={staff.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold">{staff.name}</h3>
                              <Badge className={performanceBadge.color}>
                                {performanceBadge.label}
                              </Badge>
                              {staff.performance.currentRating >= 4.5 && (
                                <Crown className="h-5 w-5 text-yellow-500" />
                              )}
                            </div>
                            <div className="text-gray-600 mb-2">
                              {staff.position} • {staff.department}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{getLocationName(staff.location)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{calculateTenure(staff.joinDate)} tenure</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{staff.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Performance Metrics Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <CircularProgress
                              value={staff.performance.currentRating * 20}
                              size={60}
                              showValue={false}
                              className="text-blue-600"
                            />
                          </div>
                          <div className="text-lg font-bold">{staff.performance.currentRating}/5.0</div>
                          <div className="text-xs text-gray-500">Overall Rating</div>
                        </div>

                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {staff.performance.salesPercentage.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">Sales Target</div>
                          <div className="text-xs text-gray-400">
                            AED {staff.performance.salesAchieved?.toLocaleString() || "0"} / {staff.performance.salesTarget?.toLocaleString() || "0"}
                          </div>
                        </div>

                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {staff.performance.attendanceRate.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">Attendance Rate</div>
                          <div className="text-xs text-gray-400">
                            {staff.performance.hoursWorked}h worked
                          </div>
                        </div>

                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {staff.performance.customerSatisfaction.toFixed(1)}/5.0
                          </div>
                          <div className="text-xs text-gray-500">Customer Satisfaction</div>
                          <div className="text-xs text-gray-400">
                            {staff.performance.totalOrders} orders
                          </div>
                        </div>
                      </div>

                      {/* Detailed Performance Breakdown */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Skill Assessment</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Product Knowledge</span>
                                <span>{staff.performance.productKnowledge}/5.0</span>
                              </div>
                              <Progress value={staff.performance.productKnowledge * 20} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Communication Skills</span>
                                <span>{staff.performance.communicationSkills}/5.0</span>
                              </div>
                              <Progress value={staff.performance.communicationSkills * 20} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Team Leadership</span>
                                <span>{staff.performance.teamLeadership}/5.0</span>
                              </div>
                              <Progress value={staff.performance.teamLeadership * 20} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Punctuality Score</span>
                                <span>{staff.performance.punctualityScore}%</span>
                              </div>
                              <Progress value={staff.performance.punctualityScore} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Sales Metrics</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Revenue Generated:</span>
                              <span className="font-medium">AED {staff.performance.revenueGenerated?.toLocaleString() || "0"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Average Order Value:</span>
                              <span className="font-medium">AED {staff.performance.avgOrderValue}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Conversion Rate:</span>
                              <span className="font-medium">{staff.performance.conversionRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Repeat Customers:</span>
                              <span className="font-medium">{staff.performance.repeatCustomers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Training Completed:</span>
                              <span className="font-medium">{staff.performance.trainingCompleted} courses</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Certifications and Achievements */}
                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Certifications</h4>
                          <div className="flex flex-wrap gap-2">
                            {staff.performance.certifications.map((cert, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Recent Achievements</h4>
                          <div className="flex flex-wrap gap-2">
                            {staff.performance.achievements.map((achievement, index) => (
                              <Badge key={index} className="bg-yellow-100 text-yellow-800 text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Leaderboard</CardTitle>
                <CardDescription>Top performers based on overall rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffMembers
                    .sort((a, b) => b.performance.currentRating - a.performance.currentRating)
                    .slice(0, 10)
                    .map((staff, index) => (
                      <div key={staff.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.position} • {getLocationCode(staff.location)}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getPerformanceColor(staff.performance.currentRating)}`}>
                            {staff.performance.currentRating}/5.0
                          </div>
                          <div className="text-sm text-gray-500">
                            AED {(staff.performance.revenueGenerated / 1000).toFixed(0)}K
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales Champions */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Champions</CardTitle>
                <CardDescription>Highest revenue generators this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffMembers
                    .sort((a, b) => b.performance.revenueGenerated - a.performance.revenueGenerated)
                    .slice(0, 10)
                    .map((staff, index) => (
                      <div key={staff.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index < 3 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.position} • {getLocationCode(staff.location)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            AED {staff.performance.revenueGenerated?.toLocaleString() || "0"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {staff.performance.salesPercentage.toFixed(1)}% of target
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Leaders */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Leaders</CardTitle>
                <CardDescription>Most reliable team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffMembers
                    .sort((a, b) => b.performance.attendanceRate - a.performance.attendanceRate)
                    .slice(0, 8)
                    .map((staff, index) => (
                      <div key={staff.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-sm text-gray-500">{getLocationCode(staff.location)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">
                            {staff.performance.attendanceRate.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {staff.performance.hoursWorked}h
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Satisfaction Stars */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction Stars</CardTitle>
                <CardDescription>Highest customer-rated staff members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffMembers
                    .sort((a, b) => b.performance.customerSatisfaction - a.performance.customerSatisfaction)
                    .slice(0, 8)
                    .map((staff, index) => (
                      <div key={staff.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-bold text-yellow-800">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-sm text-gray-500">{staff.position}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-yellow-600 flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {staff.performance.customerSatisfaction.toFixed(1)}/5.0
                          </div>
                          <div className="text-sm text-gray-500">
                            {staff.performance.totalOrders} orders
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews & Goals</CardTitle>
              <CardDescription>
                Staff review schedules and performance improvement goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredStaff.map((staff) => (
                  <div key={staff.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{staff.name}</h3>
                          <p className="text-sm text-gray-600">{staff.position} • {getLocationName(staff.location)}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>Last Review: {formatDate(staff.lastReview)}</span>
                            <span>Next Review: {formatDate(staff.nextReview)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Review
                        </Button>
                        <Button size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Update Goals
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Current Goals
                        </h4>
                        <div className="space-y-2">
                          {staff.performance.goals.map((goal, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded text-sm">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Recent Achievements
                        </h4>
                        <div className="space-y-2">
                          {staff.performance.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded text-sm">
                              <Award className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Review Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-lg">{staff.performance.currentRating}/5.0</div>
                          <div className="text-gray-500">Overall Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">{staff.performance.salesPercentage.toFixed(0)}%</div>
                          <div className="text-gray-500">Target Achievement</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">{staff.performance.attendanceRate.toFixed(0)}%</div>
                          <div className="text-gray-500">Attendance</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">{staff.performance.trainingCompleted}</div>
                          <div className="text-gray-500">Training Courses</div>
                        </div>
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
};

export default StaffPerformancePage;