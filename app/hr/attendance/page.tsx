'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Calendar,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  Plus,
  Edit,
  Eye,
  Filter,
  Search,
  RefreshCw,
  Timer,
  Coffee,
  Home,
  Building,
  Smartphone,
  FileText,
  UserCheck,
  CalendarDays,
  BarChart3,
  Settings,
  Bell,
  Shield,
  Fingerprint,
  CreditCard,
  Zap,
  Activity,
  ArrowLeft} from 'lucide-react';

const AttendancePage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const [showAddShiftDialog, setShowAddShiftDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);

  // Sample attendance data with UAE compliance fields
  const attendanceMetrics = {
    totalPresent: 38,
    totalAbsent: 4,
    totalLate: 3,
    totalOnLeave: 2,
    overtimeHours: 12.5,
    attendanceRate: 90.5,
    trends: {
      attendance: +2.3,
      punctuality: -1.2,
      overtime: +8.7
    }
  };

  const todayAttendance = [
    {
      id: 'EMP001',
      name: 'Ahmed Al-Rashid',
      nameArabic: 'أحمد الراشد',
      emiratesId: '784-1990-1234567-1',
      position: 'Store Manager',
      location: 'Dubai Mall Store',
      shift: 'Morning (9:00 AM - 6:00 PM)',
      checkIn: '08:55 AM',
      checkOut: null,
      status: 'present',
      workingHours: '5h 30m',
      overtimeHours: '0h',
      biometricVerified: true,
      visaStatus: 'valid',
      laborCard: 'LC2024001',
      lastBreak: '12:30 PM - 1:00 PM'
    },
    {
      id: 'EMP002',
      name: 'Fatima Al-Zahra',
      nameArabic: 'فاطمة الزهراء',
      emiratesId: '784-1995-2345678-2',
      position: 'Sales Associate',
      location: 'Abu Dhabi Mall Store',
      shift: 'Morning (9:00 AM - 6:00 PM)',
      checkIn: '09:10 AM',
      checkOut: null,
      status: 'late',
      workingHours: '5h 20m',
      overtimeHours: '0h',
      biometricVerified: true,
      visaStatus: 'valid',
      laborCard: 'LC2024002',
      lastBreak: '1:15 PM - 1:45 PM'
    },
    {
      id: 'EMP003',
      name: 'Omar Hassan',
      nameArabic: 'عمر حسن',
      emiratesId: '784-1988-3456789-3',
      position: 'Assistant Manager',
      location: 'Sharjah City Centre',
      shift: 'Afternoon (2:00 PM - 10:00 PM)',
      checkIn: '01:55 PM',
      checkOut: null,
      status: 'present',
      workingHours: '3h 35m',
      overtimeHours: '0h',
      biometricVerified: true,
      visaStatus: 'expiring_soon',
      laborCard: 'LC2024003',
      lastBreak: null
    },
    {
      id: 'EMP004',
      name: 'Sarah Johnson',
      nameArabic: 'سارة جونسون',
      emiratesId: '784-1992-4567890-4',
      position: 'Marketing Specialist',
      location: 'Head Office',
      shift: 'Standard (9:00 AM - 5:00 PM)',
      checkIn: null,
      checkOut: null,
      status: 'absent',
      workingHours: '0h',
      overtimeHours: '0h',
      biometricVerified: false,
      visaStatus: 'valid',
      laborCard: 'LC2024004',
      lastBreak: null
    }
  ];

  const shifts = [
    {
      id: 'shift001',
      name: 'Morning Shift',
      nameArabic: 'وردية الصباح',
      startTime: '09:00',
      endTime: '18:00',
      breakDuration: 60,
      employees: 18,
      locations: ['Dubai Mall Store', 'Abu Dhabi Mall Store'],
      isActive: true,
      allowFlexible: true,
      graceTime: 15
    },
    {
      id: 'shift002',
      name: 'Afternoon Shift',
      nameArabic: 'وردية بعد الظهر',
      startTime: '14:00',
      endTime: '22:00',
      breakDuration: 45,
      employees: 12,
      locations: ['Sharjah City Centre', 'Ajman City Centre'],
      isActive: true,
      allowFlexible: false,
      graceTime: 10
    },
    {
      id: 'shift003',
      name: 'Evening Shift',
      nameArabic: 'وردية المساء',
      startTime: '15:00',
      endTime: '23:00',
      breakDuration: 60,
      employees: 8,
      locations: ['Dubai Festival City', 'Mall of the Emirates'],
      isActive: true,
      allowFlexible: true,
      graceTime: 20
    }
  ];

  const leaveRequests = [
    {
      id: 'LR001',
      employeeId: 'EMP005',
      employeeName: 'Ali Mohammed',
      type: 'Annual Leave',
      typeArabic: 'إجازة سنوية',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 6,
      status: 'pending',
      reason: 'Family vacation',
      submittedDate: '2024-01-20',
      balanceAfter: 24
    },
    {
      id: 'LR002',
      employeeId: 'EMP006',
      employeeName: 'Layla Hassan',
      type: 'Sick Leave',
      typeArabic: 'إجازة مرضية',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      days: 2,
      status: 'approved',
      reason: 'Medical appointment',
      submittedDate: '2024-01-22',
      balanceAfter: 13
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'on_leave': return 'bg-blue-100 text-blue-800';
      case 'overtime': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisaStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expiring_soon': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'on_leave': return <Calendar className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
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

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Attendance & Shift Management</h1>
          <p className="text-gray-600">UAE labor law compliant attendance tracking and shift management</p>
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
          <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserCheck className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Manual Attendance Entry</DialogTitle>
                <DialogDescription>
                  Record attendance for employees unable to use biometric system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp001">Ahmed Al-Rashid (EMP001)</SelectItem>
                      <SelectItem value="emp002">Fatima Al-Zahra (EMP002)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action">Action</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checkin">Check In</SelectItem>
                      <SelectItem value="checkout">Check Out</SelectItem>
                      <SelectItem value="break_start">Break Start</SelectItem>
                      <SelectItem value="break_end">Break End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input type="time" id="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (if manual entry)</Label>
                  <Textarea placeholder="Reason for manual entry..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAttendanceDialog(false)}>
                    Cancel
                  </Button>
                  <Button>Record Attendance</Button>
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
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-xl sm:text-2xl font-bold">{attendanceMetrics.totalPresent}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(attendanceMetrics.trends.attendance)}`}>
                  {getTrendIcon(attendanceMetrics.trends.attendance)}
                  {Math.abs(attendanceMetrics.trends.attendance)}% vs yesterday
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-xl sm:text-2xl font-bold">{attendanceMetrics.totalAbsent}</p>
                <p className="text-xs text-red-600">Including {attendanceMetrics.totalOnLeave} on leave</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-xl sm:text-2xl font-bold">{attendanceMetrics.attendanceRate}%</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(attendanceMetrics.trends.punctuality)}`}>
                  {getTrendIcon(attendanceMetrics.trends.punctuality)}
                  Punctuality {Math.abs(attendanceMetrics.trends.punctuality)}%
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overtime Hours</p>
                <p className="text-xl sm:text-2xl font-bold">{attendanceMetrics.overtimeHours}h</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(attendanceMetrics.trends.overtime)}`}>
                  {getTrendIcon(attendanceMetrics.trends.overtime)}
                  {Math.abs(attendanceMetrics.trends.overtime)}% vs last week
                </div>
              </div>
              <Timer className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Today's Attendance</TabsTrigger>
          <TabsTrigger value="shifts">Shift Management</TabsTrigger>
          <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        {/* Today's Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Today's Attendance</CardTitle>
                  <CardDescription>Real-time attendance tracking with UAE labor compliance</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="dubai_mall">Dubai Mall Store</SelectItem>
                      <SelectItem value="abu_dhabi">Abu Dhabi Mall Store</SelectItem>
                      <SelectItem value="sharjah">Sharjah City Centre</SelectItem>
                      <SelectItem value="head_office">Head Office</SelectItem>
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
                    <TableHead>Location</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Working Hours</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{record.name}</div>
                            <div className="text-sm text-gray-500">{record.nameArabic}</div>
                            <div className="text-xs text-gray-400">{record.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{record.position}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{record.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{record.shift}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {record.biometricVerified && <Fingerprint className="h-4 w-4 text-green-600" />}
                          <span className="text-sm">{record.checkIn || 'Not checked in'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <Badge className={getStatusColor(record.status)}>
                            {record.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{record.workingHours}</div>
                          {record.overtimeHours !== '0h' && (
                            <div className="text-xs text-purple-600">OT: {record.overtimeHours}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getVisaStatusColor(record.visaStatus)} variant="outline">
                            Visa: {record.visaStatus.replace('_', ' ')}
                          </Badge>
                          <div className="text-xs text-gray-500">LC: {record.laborCard}</div>
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shift Management Tab */}
        <TabsContent value="shifts" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Shift Management</CardTitle>
                  <CardDescription>Configure and manage work shifts across all locations</CardDescription>
                </div>
                <Dialog open={showAddShiftDialog} onOpenChange={setShowAddShiftDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Shift
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Shift</DialogTitle>
                      <DialogDescription>
                        Configure a new work shift following UAE labor law requirements
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shiftName">Shift Name (English)</Label>
                        <Input id="shiftName" placeholder="e.g., Morning Shift" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shiftNameArabic">Shift Name (Arabic)</Label>
                        <Input id="shiftNameArabic" placeholder="e.g., وردية الصباح" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input type="time" id="startTime" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input type="time" id="endTime" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                        <Input type="number" id="breakDuration" placeholder="60" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="graceTime">Grace Time (minutes)</Label>
                        <Input type="number" id="graceTime" placeholder="15" />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="locations">Applicable Locations</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select locations" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dubai_mall">Dubai Mall Store</SelectItem>
                            <SelectItem value="abu_dhabi">Abu Dhabi Mall Store</SelectItem>
                            <SelectItem value="sharjah">Sharjah City Centre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 flex items-center space-x-2">
                        <Switch id="flexible" />
                        <Label htmlFor="flexible">Allow flexible timing</Label>
                      </div>
                      <div className="col-span-2 flex items-center space-x-2">
                        <Switch id="overtime" />
                        <Label htmlFor="overtime">Enable overtime calculation</Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddShiftDialog(false)}>
                        Cancel
                      </Button>
                      <Button>Create Shift</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{shift.name}</div>
                        <div className="text-sm text-gray-500">{shift.nameArabic}</div>
                        <div className="text-sm text-gray-500">
                          {shift.startTime} - {shift.endTime} • {shift.employees} employees
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-center">
                        <div className="font-medium">{shift.breakDuration}min</div>
                        <div className="text-xs text-gray-500">Break</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{shift.graceTime}min</div>
                        <div className="text-xs text-gray-500">Grace</div>
                      </div>
                      <div className="text-center">
                        <Badge variant={shift.isActive ? "default" : "secondary"}>
                          {shift.isActive ? 'Active' : 'Inactive'}
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

        {/* Leave Requests Tab */}
        <TabsContent value="leaves" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Leave Requests</CardTitle>
                  <CardDescription>Manage employee leave requests according to UAE labor law</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Leave Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance After</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.employeeName}</div>
                        <div className="text-sm text-gray-500">{request.employeeId}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.type}</div>
                          <div className="text-sm text-gray-500">{request.typeArabic}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.days} days</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {request.startDate} to {request.endDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.balanceAfter} days</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button variant="outline" size="sm" className="text-green-600">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
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

        {/* Reports & Analytics Tab */}
        <TabsContent value="reports" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Analytics</CardTitle>
                <CardDescription>Weekly attendance trends and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monday</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-24 h-2" />
                      <span className="text-sm">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tuesday</span>
                    <div className="flex items-center gap-2">
                      <Progress value={88} className="w-24 h-2" />
                      <span className="text-sm">88%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Wednesday</span>
                    <div className="flex items-center gap-2">
                      <Progress value={95} className="w-24 h-2" />
                      <span className="text-sm">95%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Thursday</span>
                    <div className="flex items-center gap-2">
                      <Progress value={90} className="w-24 h-2" />
                      <span className="text-sm">90%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Friday</span>
                    <div className="flex items-center gap-2">
                      <Progress value={87} className="w-24 h-2" />
                      <span className="text-sm">87%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
                <CardDescription>UAE labor law compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Visa Status</div>
                        <div className="text-sm text-gray-500">All employees verified</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">Labor Cards</div>
                        <div className="text-sm text-gray-500">2 expiring soon</div>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Timer className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Working Hours</div>
                        <div className="text-sm text-gray-500">Within legal limits</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
              <CardDescription>Generate and download attendance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Daily Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <CalendarDays className="h-5 w-5" />
                  <span className="text-xs">Weekly Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Monthly Analytics</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Shield className="h-5 w-5" />
                  <span className="text-xs">Compliance Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendancePage;