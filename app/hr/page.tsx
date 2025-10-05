'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
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
  Briefcase,
  ArrowLeft} from 'lucide-react';

interface HRMetrics {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  newHires: number;
  avgSalary: number;
  attendanceRate: number;
  performanceScore: number;
}

interface Employee {
  id: string;
  employeeCode: string;
  user: {
    name: string;
    email?: string;
  };
  position?: string;
  department?: string;
  hireDate: string;
  isActive: boolean;
  salary: {
    totalSalary: number;
  };
  performance: {
    score: number;
  };
  attendance: {
    rate: number;
  };
}

interface DepartmentStat {
  department: string;
  employeeCount: number;
  avgSalary: number;
  totalSalary: number;
}

const HRPage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');
  const [loading, setLoading] = useState(true);
  const [hrMetrics, setHrMetrics] = useState<HRMetrics>({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    newHires: 0,
    avgSalary: 0,
    attendanceRate: 0,
    performanceScore: 0
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);

  useEffect(() => {
    fetchHRData();
  }, []);

  const fetchHRData = async () => {
    try {
      const [analyticsRes, employeesRes] = await Promise.all([
        fetch('/api/hr/analytics'),
        fetch('/api/hr/employees?limit=10')
      ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setHrMetrics({
          totalEmployees: analyticsData.overview?.totalEmployees || 0,
          activeEmployees: analyticsData.overview?.activeEmployees || 0,
          inactiveEmployees: analyticsData.overview?.inactiveEmployees || 0,
          newHires: analyticsData.overview?.newHires || 0,
          avgSalary: analyticsData.salaryMetrics?.avgSalary || 0,
          attendanceRate: analyticsData.attendanceMetrics?.attendanceRate || 0,
          performanceScore: analyticsData.performanceMetrics?.avgScore || 0
        });

        setDepartmentStats(analyticsData.departmentStats || []);
      }

      if (employeesRes.ok) {
        const employeesData = await employeesRes.json();
        setEmployees(employeesData.employees || []);
      }
    } catch (error) {
      console.error('Error fetching HR data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const router = useRouter();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">HR & Staff Management</h1>
          <p className="text-gray-600">Human resources management and employee analytics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Manage and view employee information</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="thisMonth">New This Month</SelectItem>
                  <SelectItem value="highPerformers">High Performers</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="min-h-[44px]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{employee.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{employee.employeeCode}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.position || 'N/A'}</div>
                      <div className="text-sm text-gray-500">Since {new Date(employee.hireDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={employee.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(employee.performance?.score || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(employee.performance?.score || 0)}`}>
                        {employee.performance?.score?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={employee.attendance?.rate || 0} className="w-16 h-2" />
                      <span className="text-sm">{employee.attendance?.rate?.toFixed(1) || '0'}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    AED {employee.salary?.totalSalary?.toLocaleString() || "0"}
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
          </div>
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
              <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{dept.department || 'Unassigned'}</div>
                    <div className="text-sm text-gray-500">
                      {dept.employeeCount} employees
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="font-medium">AED {dept.avgSalary?.toLocaleString() || "0"}</div>
                    <div className="text-xs text-gray-500">Avg Salary</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">AED {(dept.totalSalary / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Total</div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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