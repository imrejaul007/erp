'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Users,
  UserPlus,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  GraduationCap,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  Settings,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Star,
  Briefcase,
  Coffee,
  Plane,
  Heart,
  Shield,
  Zap,
  Timer,
  RotateCcw,
  ChevronRight,
  Bell,
  Camera,
  CreditCard,
  Calendar as CalIcon,
  ClipboardList,
  MessageSquare
} from 'lucide-react';

const HRStaffManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample HR data
  const employees = [
    {
      id: 'EMP001',
      name: 'Ahmed Al-Rashid',
      position: 'Store Manager',
      department: 'Sales',
      location: 'Dubai Mall Store',
      email: 'ahmed.rashid@oudpms.ae',
      phone: '+971-50-123-4567',
      hireDate: '2022-03-15',
      salary: 15000,
      status: 'active',
      avatar: '/api/placeholder/40/40',
      performance: {
        rating: 4.8,
        targetAchievement: 112,
        customerSatisfaction: 4.9,
        lastReview: '2024-01-01'
      },
      attendance: {
        present: 22,
        absent: 0,
        late: 1,
        overtime: 8
      },
      skills: ['Customer Service', 'Sales Management', 'Arabic', 'Perfume Knowledge'],
      certifications: ['Perfume Specialist', 'Customer Service Excellence'],
      emergencyContact: {
        name: 'Fatima Al-Rashid',
        relationship: 'Wife',
        phone: '+971-50-987-6543'
      }
    },
    {
      id: 'EMP002',
      name: 'Fatima Al-Zahra',
      position: 'Sales Associate',
      department: 'Sales',
      location: 'Abu Dhabi Mall Store',
      email: 'fatima.zahra@oudpms.ae',
      phone: '+971-50-234-5678',
      hireDate: '2023-01-20',
      salary: 8500,
      status: 'active',
      avatar: '/api/placeholder/40/40',
      performance: {
        rating: 4.6,
        targetAchievement: 105,
        customerSatisfaction: 4.7,
        lastReview: '2024-01-01'
      },
      attendance: {
        present: 21,
        absent: 1,
        late: 2,
        overtime: 5
      },
      skills: ['Customer Service', 'Product Knowledge', 'English', 'Arabic'],
      certifications: ['Sales Excellence'],
      emergencyContact: {
        name: 'Omar Al-Zahra',
        relationship: 'Brother',
        phone: '+971-50-876-5432'
      }
    },
    {
      id: 'EMP003',
      name: 'Omar Hassan',
      position: 'Assistant Manager',
      department: 'Sales',
      location: 'Sharjah City Centre',
      email: 'omar.hassan@oudpms.ae',
      phone: '+971-50-345-6789',
      hireDate: '2022-08-10',
      salary: 12000,
      status: 'active',
      avatar: '/api/placeholder/40/40',
      performance: {
        rating: 4.7,
        targetAchievement: 108,
        customerSatisfaction: 4.8,
        lastReview: '2024-01-01'
      },
      attendance: {
        present: 23,
        absent: 0,
        late: 0,
        overtime: 12
      },
      skills: ['Team Leadership', 'Inventory Management', 'Customer Service'],
      certifications: ['Management Training', 'Oud Specialist'],
      emergencyContact: {
        name: 'Aisha Hassan',
        relationship: 'Sister',
        phone: '+971-50-765-4321'
      }
    },
    {
      id: 'EMP004',
      name: 'Sarah Johnson',
      position: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Head Office',
      email: 'sarah.johnson@oudpms.ae',
      phone: '+971-50-456-7890',
      hireDate: '2023-05-01',
      salary: 11000,
      status: 'active',
      avatar: '/api/placeholder/40/40',
      performance: {
        rating: 4.9,
        targetAchievement: 118,
        customerSatisfaction: 4.6,
        lastReview: '2024-01-01'
      },
      attendance: {
        present: 22,
        absent: 1,
        late: 0,
        overtime: 6
      },
      skills: ['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics'],
      certifications: ['Google Ads Certified', 'Social Media Marketing'],
      emergencyContact: {
        name: 'Mike Johnson',
        relationship: 'Husband',
        phone: '+971-50-654-3210'
      }
    },
    {
      id: 'EMP005',
      name: 'Khalid Mansoor',
      position: 'Warehouse Supervisor',
      department: 'Operations',
      location: 'Warehouse Dubai',
      email: 'khalid.mansoor@oudpms.ae',
      phone: '+971-50-567-8901',
      hireDate: '2021-11-30',
      salary: 9500,
      status: 'active',
      avatar: '/api/placeholder/40/40',
      performance: {
        rating: 4.5,
        targetAchievement: 102,
        customerSatisfaction: 4.4,
        lastReview: '2024-01-01'
      },
      attendance: {
        present: 24,
        absent: 0,
        late: 1,
        overtime: 15
      },
      skills: ['Inventory Management', 'Team Leadership', 'Quality Control'],
      certifications: ['Warehouse Management', 'Safety Training'],
      emergencyContact: {
        name: 'Amina Mansoor',
        relationship: 'Wife',
        phone: '+971-50-543-2109'
      }
    }
  ];

  const leaveRequests = [
    {
      id: 'LR001',
      employeeId: 'EMP002',
      employeeName: 'Fatima Al-Zahra',
      type: 'Annual Leave',
      startDate: '2024-01-25',
      endDate: '2024-01-27',
      days: 3,
      reason: 'Family vacation',
      status: 'pending',
      appliedDate: '2024-01-15',
      approver: 'Ahmed Al-Rashid'
    },
    {
      id: 'LR002',
      employeeId: 'EMP003',
      employeeName: 'Omar Hassan',
      type: 'Sick Leave',
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      days: 1,
      reason: 'Medical appointment',
      status: 'approved',
      appliedDate: '2024-01-18',
      approver: 'Ahmed Al-Rashid'
    }
  ];

  const trainingPrograms = [
    {
      id: 'TRP001',
      title: 'Advanced Perfume Knowledge',
      description: 'Deep dive into perfume composition, notes, and customer consultation',
      instructor: 'Master Perfumer Ali Al-Attar',
      duration: '3 days',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      capacity: 15,
      enrolled: 8,
      status: 'upcoming',
      location: 'Training Center Dubai',
      cost: 2500
    },
    {
      id: 'TRP002',
      title: 'Customer Service Excellence',
      description: 'Enhance customer interaction and service delivery skills',
      instructor: 'Sarah Mitchell',
      duration: '2 days',
      startDate: '2024-01-28',
      endDate: '2024-01-29',
      capacity: 20,
      enrolled: 12,
      status: 'active',
      location: 'Head Office',
      cost: 1800
    },
    {
      id: 'TRP003',
      title: 'Digital Sales Techniques',
      description: 'Modern sales approaches for omni-channel retail',
      instructor: 'Ahmed Digital Solutions',
      duration: '1 day',
      startDate: '2024-02-15',
      endDate: '2024-02-15',
      capacity: 25,
      enrolled: 5,
      status: 'upcoming',
      location: 'Virtual/Online',
      cost: 1200
    }
  ];

  const shifts = [
    {
      id: 'SH001',
      name: 'Morning Shift',
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 60,
      employees: ['EMP001', 'EMP002'],
      location: 'Dubai Mall Store'
    },
    {
      id: 'SH002',
      name: 'Evening Shift',
      startTime: '14:00',
      endTime: '22:00',
      breakDuration: 60,
      employees: ['EMP003'],
      location: 'Abu Dhabi Mall Store'
    },
    {
      id: 'SH003',
      name: 'Full Day',
      startTime: '09:00',
      endTime: '18:00',
      breakDuration: 60,
      employees: ['EMP004', 'EMP005'],
      location: 'Head Office'
    }
  ];

  const payrollSummary = {
    totalSalaries: 56000,
    totalBonuses: 8500,
    totalDeductions: 2800,
    netPayroll: 61700,
    employeeCount: 5,
    avgSalary: 11200
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR & Staff Management</h1>
          <p className="text-gray-600">Comprehensive human resource management system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter employee details and assign role
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="employee@oudpms.ae" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+971-50-XXX-XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="store_manager">Store Manager</SelectItem>
                      <SelectItem value="assistant_manager">Assistant Manager</SelectItem>
                      <SelectItem value="sales_associate">Sales Associate</SelectItem>
                      <SelectItem value="cashier">Cashier</SelectItem>
                      <SelectItem value="warehouse_staff">Warehouse Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dubai_mall">Dubai Mall Store</SelectItem>
                      <SelectItem value="abu_dhabi_mall">Abu Dhabi Mall Store</SelectItem>
                      <SelectItem value="sharjah_centre">Sharjah City Centre</SelectItem>
                      <SelectItem value="head_office">Head Office</SelectItem>
                      <SelectItem value="warehouse">Warehouse Dubai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (AED)</Label>
                  <Input id="salary" type="number" placeholder="Monthly salary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input id="hireDate" type="date" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input id="emergencyContact" placeholder="Emergency contact details" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddEmployeeOpen(false)}>
                  Add Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold">{employees.length}</p>
                <p className="text-xs text-green-600">{employees.filter(e => e.status === 'active').length} active</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Payroll</p>
                <p className="text-2xl font-bold">AED {(payrollSummary.netPayroll / 1000).toFixed(0)}K</p>
                <p className="text-xs text-blue-600">+5.2% vs last month</p>
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
                <p className="text-2xl font-bold">
                  {(employees.reduce((sum, emp) => sum + emp.performance.rating, 0) / employees.length).toFixed(1)}
                </p>
                <p className="text-xs text-purple-600">Out of 5.0</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold">
                  {((employees.reduce((sum, emp) => sum + emp.attendance.present, 0) /
                     employees.reduce((sum, emp) => sum + emp.attendance.present + emp.attendance.absent, 0)) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-orange-600">This month</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
        </TabsList>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>
                Manage employee information and profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select defaultValue="all">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input className="pl-10" placeholder="Search employees..." />
                    </div>
                  </div>
                </div>

                {/* Employee Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.map((employee) => (
                    <Card key={employee.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{employee.name}</h4>
                                <p className="text-sm text-gray-500">{employee.position}</p>
                                <p className="text-xs text-gray-400">{employee.department}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(employee.status)}>
                              {employee.status}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building className="h-3 w-3" />
                              <span>{employee.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{employee.phone}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Performance</span>
                              <div className="flex items-center gap-1">
                                {getRatingStars(employee.performance.rating)}
                                <span className="ml-1">{employee.performance.rating}</span>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Target Achievement</span>
                              <span className="font-medium text-green-600">
                                {employee.performance.targetAchievement}%
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Attendance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => {
                    const totalDays = employee.attendance.present + employee.attendance.absent;
                    const attendanceRate = (employee.attendance.present / totalDays) * 100;
                    return (
                      <div key={employee.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{employee.name}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{attendanceRate.toFixed(1)}%</div>
                            <div className="text-xs text-gray-500">
                              {employee.attendance.present}/{totalDays} days
                            </div>
                          </div>
                        </div>
                        <Progress value={attendanceRate} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Late: {employee.attendance.late}</span>
                          <span>OT: {employee.attendance.overtime}h</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Daily Attendance */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.position}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Present
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          In: 09:15 AM
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {employees.reduce((sum, emp) => sum + emp.attendance.present, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Present Days</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {employees.reduce((sum, emp) => sum + emp.attendance.absent, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Absent Days</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {employees.reduce((sum, emp) => sum + emp.attendance.late, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Late Arrivals</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {employees.reduce((sum, emp) => sum + emp.attendance.overtime, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Overtime Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Management Tab */}
        <TabsContent value="leave" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leave Requests */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.map((leave) => (
                    <div key={leave.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{leave.employeeName}</h4>
                          <p className="text-sm text-gray-500">{leave.type}</p>
                        </div>
                        <Badge className={getStatusColor(leave.status)}>
                          {leave.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Start Date:</span>
                          <div>{leave.startDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">End Date:</span>
                          <div>{leave.endDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div>{leave.days} day(s)</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Applied:</span>
                          <div>{leave.appliedDate}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-500 text-sm">Reason:</span>
                        <p className="text-sm">{leave.reason}</p>
                      </div>

                      {leave.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Leave Application */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for Leave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea placeholder="Leave reason..." />
                </div>

                <Button className="w-full">
                  Submit Request
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Leave Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Calendar</CardTitle>
              <CardDescription>
                View upcoming leaves and plan accordingly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <div className="space-y-4">
                  <h4 className="font-medium">Upcoming Leaves</h4>
                  <div className="space-y-2">
                    {leaveRequests.filter(leave => leave.status === 'approved').map((leave) => (
                      <div key={leave.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{leave.employeeName}</div>
                        <div className="text-sm text-gray-500">
                          {leave.type} • {leave.startDate} to {leave.endDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payroll Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
                <CardDescription>January 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Salaries</span>
                    <span className="font-medium">AED {payrollSummary.totalSalaries?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Bonuses</span>
                    <span className="font-medium text-green-600">+AED {payrollSummary.totalBonuses?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Deductions</span>
                    <span className="font-medium text-red-600">-AED {payrollSummary.totalDeductions?.toLocaleString() || "0"}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Net Payroll</span>
                    <span>AED {payrollSummary.netPayroll?.toLocaleString() || "0"}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Employee Count</span>
                    <span>{payrollSummary.employeeCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Salary</span>
                    <span>AED {payrollSummary.avgSalary?.toLocaleString() || "0"}</span>
                  </div>
                </div>

                <Button className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Process Payroll
                </Button>
              </CardContent>
            </Card>

            {/* Employee Payroll Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Employee Payroll Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => {
                      const bonus = Math.floor(employee.salary * 0.15);
                      const deductions = Math.floor(employee.salary * 0.05);
                      const netPay = employee.salary + bonus - deductions;
                      return (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.position}</div>
                            </div>
                          </TableCell>
                          <TableCell>AED {employee.salary?.toLocaleString() || "0"}</TableCell>
                          <TableCell className="text-green-600">+AED {bonus?.toLocaleString() || "0"}</TableCell>
                          <TableCell className="text-red-600">-AED {deductions?.toLocaleString() || "0"}</TableCell>
                          <TableCell className="font-medium">AED {netPay?.toLocaleString() || "0"}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              Processed
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Training Programs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Training Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingPrograms.map((program) => (
                    <div key={program.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{program.title}</h4>
                          <p className="text-sm text-gray-500">{program.instructor}</p>
                        </div>
                        <Badge className={getStatusColor(program.status)}>
                          {program.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600">{program.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div>{program.duration}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <div>{program.location}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Dates:</span>
                          <div>{program.startDate} - {program.endDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost:</span>
                          <div>AED {program.cost}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Enrollment</span>
                          <span>{program.enrolled} / {program.capacity}</span>
                        </div>
                        <Progress
                          value={(program.enrolled / program.capacity) * 100}
                          className="h-2"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-1" />
                          Enroll
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Employee Skills Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="border rounded-lg p-3 space-y-2">
                      <div className="font-medium">{employee.name}</div>
                      <div className="flex flex-wrap gap-1">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Certifications: {employee.certifications.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{employee.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {getRatingStars(employee.performance.rating)}
                          </div>
                          <span className="text-sm">{employee.performance.rating}</span>
                        </div>
                      </div>
                      <Progress value={employee.performance.rating * 20} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Target: {employee.performance.targetAchievement}%</span>
                        <span>CSAT: {employee.performance.customerSatisfaction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(employees.reduce((sum, emp) => sum + emp.performance.rating, 0) / employees.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Avg Rating</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(employees.reduce((sum, emp) => sum + emp.performance.targetAchievement, 0) / employees.length).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-500">Avg Target Achievement</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(employees.reduce((sum, emp) => sum + emp.performance.customerSatisfaction, 0) / employees.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Avg Customer Satisfaction</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {employees.filter(emp => emp.performance.rating >= 4.5).length}
                    </div>
                    <div className="text-sm text-gray-500">High Performers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Overall Rating</TableHead>
                    <TableHead>Target Achievement</TableHead>
                    <TableHead>Customer Satisfaction</TableHead>
                    <TableHead>Last Review</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.position}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {getRatingStars(employee.performance.rating)}
                          </div>
                          <span>{employee.performance.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={employee.performance.targetAchievement >= 100 ? "default" : "secondary"}
                        >
                          {employee.performance.targetAchievement}%
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.performance.customerSatisfaction}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {employee.performance.lastReview}
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
        </TabsContent>

        {/* Scheduling Tab */}
        <TabsContent value="scheduling" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shift Management */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Shift Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shifts.map((shift) => (
                    <div key={shift.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{shift.name}</h4>
                          <p className="text-sm text-gray-500">{shift.location}</p>
                        </div>
                        <Badge variant="outline">
                          {shift.employees.length} employees
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Start Time:</span>
                          <div className="font-medium">{shift.startTime}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">End Time:</span>
                          <div className="font-medium">{shift.endTime}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Break:</span>
                          <div className="font-medium">{shift.breakDuration} min</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-2">Assigned Employees:</div>
                        <div className="flex flex-wrap gap-2">
                          {shift.employees.map((empId) => {
                            const employee = employees.find(e => e.id === empId);
                            return (
                              <Badge key={empId} variant="outline" className="text-xs">
                                {employee?.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-sm">Today's Schedule</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Morning Shift</span>
                      <span className="text-gray-500">09:00-17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Evening Shift</span>
                      <span className="text-gray-500">14:00-22:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Night Shift</span>
                      <span className="text-gray-500">22:00-07:00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Employee</th>
                      <th className="text-center p-2">Mon</th>
                      <th className="text-center p-2">Tue</th>
                      <th className="text-center p-2">Wed</th>
                      <th className="text-center p-2">Thu</th>
                      <th className="text-center p-2">Fri</th>
                      <th className="text-center p-2">Sat</th>
                      <th className="text-center p-2">Sun</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0, 3).map((employee) => (
                      <tr key={employee.id} className="border-b">
                        <td className="p-2 font-medium">{employee.name}</td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="text-xs">
                            9-17
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="text-xs">
                            9-17
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="text-xs">
                            Off
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="text-xs">
                            14-22
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="text-xs">
                            14-22
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="text-xs">
                            9-17
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="text-xs">
                            Off
                          </Badge>
                        </td>
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
};

export default HRStaffManagement;