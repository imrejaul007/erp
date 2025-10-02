'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Plus,
  Users,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  MapPin,
  Edit,
  Eye,
  Search,
  Filter,
  Download,
  UserPlus,
  Briefcase,
  Phone,
  Mail
} from 'lucide-react';

export default function StaffManagementPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('all-staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const locations = [
    { id: 'LOC-001', name: 'Dubai Mall Flagship' },
    { id: 'LOC-002', name: 'Mall of Emirates' },
    { id: 'LOC-003', name: 'Ibn Battuta Mall' },
    { id: 'LOC-004', name: 'City Centre Mirdif' },
    { id: 'LOC-005', name: 'Abu Dhabi Mall' },
  ];

  const staffMembers = [
    {
      id: 'EMP-001',
      name: 'Ahmed Al-Rashid',
      position: 'Store Manager',
      department: 'Management',
      location: 'Dubai Mall Flagship',
      locationId: 'LOC-001',
      phone: '+971-50-123-4567',
      email: 'ahmed@oudpalace.ae',
      status: 'active',
      joinDate: '2023-01-15',
      attendance: 98,
      avatar: 'AA',
    },
    {
      id: 'EMP-002',
      name: 'Fatima Al-Zahra',
      position: 'Store Manager',
      department: 'Management',
      location: 'Mall of Emirates',
      locationId: 'LOC-002',
      phone: '+971-50-234-5678',
      email: 'fatima@oudpalace.ae',
      status: 'active',
      joinDate: '2023-02-20',
      attendance: 96,
      avatar: 'FA',
    },
    {
      id: 'EMP-003',
      name: 'Mohammed Hassan',
      position: 'Sales Associate',
      department: 'Sales',
      location: 'Dubai Mall Flagship',
      locationId: 'LOC-001',
      phone: '+971-50-345-6789',
      email: 'mohammed@oudpalace.ae',
      status: 'active',
      joinDate: '2023-03-10',
      attendance: 94,
      avatar: 'MH',
    },
    {
      id: 'EMP-004',
      name: 'Aisha Mohammed',
      position: 'Sales Associate',
      department: 'Sales',
      location: 'Mall of Emirates',
      locationId: 'LOC-002',
      phone: '+971-50-456-7890',
      email: 'aisha@oudpalace.ae',
      status: 'active',
      joinDate: '2023-04-05',
      attendance: 97,
      avatar: 'AM',
    },
    {
      id: 'EMP-005',
      name: 'Khalid Al-Mansoori',
      position: 'Store Manager',
      department: 'Management',
      location: 'Abu Dhabi Mall',
      locationId: 'LOC-005',
      phone: '+971-50-567-8901',
      email: 'khalid@oudpalace.ae',
      status: 'active',
      joinDate: '2023-01-25',
      attendance: 99,
      avatar: 'KM',
    },
    {
      id: 'EMP-006',
      name: 'Sara Al-Qasimi',
      position: 'Sales Associate',
      department: 'Sales',
      location: 'Ibn Battuta Mall',
      locationId: 'LOC-003',
      phone: '+971-50-678-9012',
      email: 'sara@oudpalace.ae',
      status: 'on-leave',
      joinDate: '2023-05-15',
      attendance: 92,
      avatar: 'SQ',
    },
    {
      id: 'EMP-007',
      name: 'Omar Abdullah',
      position: 'Inventory Manager',
      department: 'Operations',
      location: 'Dubai Mall Flagship',
      locationId: 'LOC-001',
      phone: '+971-50-789-0123',
      email: 'omar@oudpalace.ae',
      status: 'active',
      joinDate: '2023-02-10',
      attendance: 95,
      avatar: 'OA',
    },
  ];

  const staffStats = {
    totalStaff: 45,
    activeStaff: 42,
    onLeave: 3,
    avgAttendance: 95.8,
  };

  const upcomingShifts = [
    { id: '1', staff: 'Ahmed Al-Rashid', location: 'Dubai Mall Flagship', date: '2024-10-02', shift: 'Morning (09:00 - 17:00)' },
    { id: '2', staff: 'Mohammed Hassan', location: 'Dubai Mall Flagship', date: '2024-10-02', shift: 'Evening (17:00 - 01:00)' },
    { id: '3', staff: 'Fatima Al-Zahra', location: 'Mall of Emirates', date: '2024-10-02', shift: 'Morning (09:00 - 17:00)' },
    { id: '4', staff: 'Aisha Mohammed', location: 'Mall of Emirates', date: '2024-10-02', shift: 'Evening (17:00 - 01:00)' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || staff.locationId === locationFilter;
    const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter;
    return matchesSearch && matchesLocation && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Staff Management
          </h1>
          <p className="text-muted-foreground">Centralized staff scheduling and management across all locations</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{staffStats.activeStaff}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Currently working
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{staffStats.onLeave}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <UserX className="h-3 w-3" />
              Today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-staff">All Staff</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        {/* All Staff Tab */}
        <TabsContent value="all-staff" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Staff Directory</CardTitle>
                  <CardDescription>All staff members across all locations</CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/multi-location/staff/add')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, position, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Staff Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                            {staff.avatar}
                          </div>
                          <div>
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-sm text-gray-500">{staff.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.position}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{staff.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {staff.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{staff.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{staff.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{staff.attendance}%</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(staff.status)}>
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => router.push(`/multi-location/staff/view/${staff.id}`)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => router.push(`/multi-location/staff/edit/${staff.id}`)}>
                            <Edit className="h-3 w-3" />
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

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Staff Schedules</CardTitle>
                  <CardDescription>Upcoming shifts and assignments</CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingShifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell className="font-medium">{shift.staff}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {shift.location}
                        </div>
                      </TableCell>
                      <TableCell>{shift.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {shift.shift}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => router.push(`/multi-location/staff/schedule/edit/${shift.id}`)}>
                            <Edit className="h-3 w-3" />
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

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Tracking</CardTitle>
              <CardDescription>Monitor staff attendance and punctuality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Attendance tracking system</p>
                <p className="text-sm text-gray-500">View daily attendance, late arrivals, and absence records</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
