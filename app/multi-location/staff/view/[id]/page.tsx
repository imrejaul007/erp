'use client';

import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';

export default function ViewStaffPage() {
  const router = useRouter();
  const params = useParams();
  const staffId = params.id as string;

  // Mock data - in production this would be fetched based on staffId
  const staff = {
    id: staffId,
    firstName: 'Ahmed',
    lastName: 'Al-Rashid',
    email: 'ahmed@oudpalace.ae',
    phone: '+971-50-123-4567',
    location: 'Dubai Mall Flagship',
    locationId: 'LOC-001',
    department: 'Management',
    position: 'Store Manager',
    employmentType: 'Full Time',
    status: 'active',
    startDate: '2023-01-15',
    salary: 15000,
    attendance: 98,
    nationality: 'UAE',
    passportNumber: 'N1234567',
    visaExpiry: '2025-12-31',
    address: 'Building 23, Street 45, Dubai Marina, Dubai',
    emergencyContact: 'Fatima Al-Rashid',
    emergencyPhone: '+971-50-999-8888',
    notes: 'Excellent performance. Highly recommended for promotion.',
  };

  const attendanceRecords = [
    { date: '2024-10-01', checkIn: '08:55', checkOut: '17:05', status: 'present', hours: 8.17 },
    { date: '2024-09-30', checkIn: '09:02', checkOut: '17:10', status: 'present', hours: 8.13 },
    { date: '2024-09-29', checkIn: '08:58', checkOut: '17:00', status: 'present', hours: 8.03 },
    { date: '2024-09-28', checkIn: '-', checkOut: '-', status: 'leave', hours: 0 },
    { date: '2024-09-27', checkIn: '09:10', checkOut: '17:15', status: 'late', hours: 8.08 },
  ];

  const performanceMetrics = [
    { metric: 'Sales Target Achievement', value: 112, target: 100 },
    { metric: 'Customer Satisfaction', value: 4.8, target: 4.5 },
    { metric: 'Attendance Rate', value: 98, target: 95 },
    { metric: 'Team Leadership Score', value: 92, target: 85 },
  ];

  const upcomingShifts = [
    { date: '2024-10-02', shift: 'Morning (09:00 - 17:00)', location: 'Dubai Mall Flagship' },
    { date: '2024-10-03', shift: 'Morning (09:00 - 17:00)', location: 'Dubai Mall Flagship' },
    { date: '2024-10-04', shift: 'Morning (09:00 - 17:00)', location: 'Dubai Mall Flagship' },
    { date: '2024-10-05', shift: 'Day Off', location: '-' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'leave': return 'bg-blue-100 text-blue-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            {staff.firstName} {staff.lastName}
          </h1>
          <p className="text-muted-foreground">{staff.position} - {staff.location}</p>
        </div>
        <Button onClick={() => router.push(`/multi-location/staff/edit/${staffId}`)} className="bg-blue-600 hover:bg-blue-700">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Employee Info Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Employee Details</CardTitle>
              <CardDescription>Personal and employment information</CardDescription>
            </div>
            <Badge className={getStatusColor(staff.status)}>{staff.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-600">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Employee ID</div>
                    <div className="font-medium">{staff.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{staff.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{staff.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-600">Address</div>
                    <div className="font-medium">{staff.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-600">Employment Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Position</div>
                    <div className="font-medium">{staff.position}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Department</div>
                    <div className="font-medium">{staff.department}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-medium">{staff.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Start Date</div>
                    <div className="font-medium">{staff.startDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Salary</div>
                    <div className="font-medium">AED {staff.salary.toLocaleString()}/month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents & Emergency */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-600">Documents & Emergency</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Nationality</div>
                  <div className="font-medium">{staff.nationality}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Passport Number</div>
                  <div className="font-medium">{staff.passportNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Visa Expiry</div>
                  <div className="font-medium">{staff.visaExpiry}</div>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-600 mb-2">Emergency Contact</div>
                  <div className="font-medium">{staff.emergencyContact}</div>
                  <div className="text-sm text-gray-600">{staff.emergencyPhone}</div>
                </div>
              </div>
            </div>
          </div>

          {staff.notes && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm font-medium text-gray-600 mb-1">Notes</div>
              <p className="text-gray-700">{staff.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{staff.attendance}%</div>
            <Progress value={staff.attendance} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </CardContent>
        </Card>

        {performanceMetrics.slice(0, 3).map((metric) => (
          <Card key={metric.metric}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.metric.includes('Satisfaction') ? metric.value.toFixed(1) : `${metric.value}%`}
              </div>
              <Progress value={(metric.value / metric.target) * 100} className="h-2 mt-2" />
              <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3" />
                Above target
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{record.date}</div>
                        <div className="text-sm text-gray-600">
                          {record.checkIn} - {record.checkOut}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {record.status === 'present' || record.status === 'late' ? (
                        <div className="text-right mr-3">
                          <div className="text-sm font-semibold">{record.hours.toFixed(2)} hrs</div>
                        </div>
                      ) : null}
                      <Badge className={getAttendanceStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>Next week's shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingShifts.map((shift, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{shift.date}</div>
                        <div className="text-sm text-gray-600">{shift.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{shift.shift}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.metric} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{metric.metric}</span>
                      <span className="text-lg font-bold text-green-600">
                        {metric.metric.includes('Satisfaction') ? metric.value.toFixed(1) : `${metric.value}%`}
                      </span>
                    </div>
                    <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                    <div className="text-xs text-gray-600 mt-1">
                      Target: {metric.metric.includes('Satisfaction') ? metric.target.toFixed(1) : `${metric.target}%`}
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
