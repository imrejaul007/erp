'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserPlus,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  BookOpen,
  Shield,
  Heart,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Star,
  Building,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
  BarChart3,
  UserCheck,
  Target,
  Briefcase
} from 'lucide-react';

const HRPage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');

  // Sample HR metrics
  const hrMetrics = {
    totalEmployees: 45,
    activeEmployees: 42,
    newHires: 3,
    avgSalary: 11200,
    attendanceRate: 94.5,
    performanceScore: 4.2,
    trends: {
      employees: +6.7,
      attendance: +2.1,
      performance: +8.3,
      satisfaction: +5.4
    }
  };

  const recentEmployees = [
    {
      id: 'EMP001',
      name: 'Ahmed Al-Rashid',
      position: 'Store Manager',
      department: 'Sales',
      location: 'Dubai Mall Store',
      status: 'active',
      joinDate: '2022-03-15',
      salary: 15000,
      performance: 4.8,
      attendance: 96.5
    },
    {
      id: 'EMP002',
      name: 'Fatima Al-Zahra',
      position: 'Sales Associate',
      department: 'Sales',
      location: 'Abu Dhabi Mall Store',
      status: 'active',
      joinDate: '2023-01-20',
      salary: 8500,
      performance: 4.6,
      attendance: 94.2
    },
    {
      id: 'EMP003',
      name: 'Omar Hassan',
      position: 'Assistant Manager',
      department: 'Sales',
      location: 'Sharjah City Centre',
      status: 'active',
      joinDate: '2022-08-10',
      salary: 12000,
      performance: 4.7,
      attendance: 98.1
    },
    {
      id: 'EMP004',
      name: 'Sarah Johnson',
      position: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Head Office',
      status: 'active',
      joinDate: '2023-05-01',
      salary: 11000,
      performance: 4.9,
      attendance: 95.8
    }
  ];

  const departmentStats = [
    {
      name: 'Sales',
      employees: 28,
      avgSalary: 10500,
      performance: 4.3,
      openPositions: 2,
      budget: 294000
    },
    {
      name: 'Marketing',
      employees: 6,
      avgSalary: 12800,
      performance: 4.6,
      openPositions: 1,
      budget: 76800
    },
    {
      name: 'Operations',
      employees: 8,
      avgSalary: 9200,
      performance: 4.1,
      openPositions: 0,
      budget: 73600
    },
    {
      name: 'Finance',
      employees: 3,
      avgSalary: 14500,
      performance: 4.5,
      openPositions: 1,
      budget: 43500
    }
  ];

  const upcomingEvents = [
    {
      type: 'Training',
      title: 'Advanced Perfume Knowledge',
      date: '2024-02-01',
      participants: 15,
      status: 'scheduled'
    },
    {
      type: 'Review',
      title: 'Q1 Performance Reviews',
      date: '2024-02-15',
      participants: 45,
      status: 'upcoming'
    },
    {
      type: 'Meeting',
      title: 'Department Heads Meeting',
      date: '2024-01-25',
      participants: 8,
      status: 'confirmed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const getPerformanceColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR & Staff Management</h1>
          <p className="text-gray-600">Human resources management and employee analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-xl sm:text-2xl font-bold">{hrMetrics.totalEmployees}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(hrMetrics.trends.employees)}`}>
                  {getTrendIcon(hrMetrics.trends.employees)}
                  {Math.abs(hrMetrics.trends.employees)}% vs last period
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Salary</p>
                <p className="text-xl sm:text-2xl font-bold">AED {hrMetrics.avgSalary?.toLocaleString() || "0"}</p>
                <p className="text-xs text-green-600">Competitive package</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-xl sm:text-2xl font-bold">{hrMetrics.attendanceRate}%</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(hrMetrics.trends.attendance)}`}>
                  {getTrendIcon(hrMetrics.trends.attendance)}
                  {Math.abs(hrMetrics.trends.attendance)}% vs last period
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-xl sm:text-2xl font-bold">{hrMetrics.performanceScore}/5.0</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(hrMetrics.trends.performance)}`}>
                  {getTrendIcon(hrMetrics.trends.performance)}
                  {Math.abs(hrMetrics.trends.performance)}% vs last period
                </div>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Manage and view employee information</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="thisMonth">New This Month</SelectItem>
                  <SelectItem value="highPerformers">High Performers</SelectItem>
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
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.position}</div>
                      <div className="text-sm text-gray-500">Since {employee.joinDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{employee.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(employee.performance)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(employee.performance)}`}>
                        {employee.performance}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={employee.attendance} className="w-16 h-2" />
                      <span className="text-sm">{employee.attendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    AED {employee.salary?.toLocaleString() || "0"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>Performance and budget breakdown by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-sm text-gray-500">
                      {dept.employees} employees • {dept.openPositions} open positions
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="font-medium">AED {dept.avgSalary?.toLocaleString() || "0"}</div>
                    <div className="text-xs text-gray-500">Avg Salary</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{dept.performance}</span>
                    </div>
                    <div className="text-xs text-gray-500">Performance</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">AED {(dept.budget / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Budget</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming HR Events</CardTitle>
            <CardDescription>Training, reviews, and meetings scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      {event.type === 'Training' && <BookOpen className="h-4 w-4 text-purple-600" />}
                      {event.type === 'Review' && <Award className="h-4 w-4 text-purple-600" />}
                      {event.type === 'Meeting' && <Users className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">
                        {event.date} • {event.participants} participants
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{event.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used HR functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <UserCheck className="h-5 w-5" />
                <span className="text-xs">Attendance</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <DollarSign className="h-5 w-5" />
                <span className="text-xs">Payroll</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Leave</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <Target className="h-5 w-5" />
                <span className="text-xs">Performance</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <BookOpen className="h-5 w-5" />
                <span className="text-xs">Training</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <Shield className="h-5 w-5" />
                <span className="text-xs">Roles</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRPage;