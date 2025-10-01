'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Clock,
  Play,
  Pause,
  Square,
  Calendar as CalendarIcon,
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  Upload,
  Coffee,
  BarChart3,
  Target,
  Timer,
  MapPin,
  Phone,
  Mail,
  Star,
  Settings
} from 'lucide-react'

interface Operator {
  id: string
  employeeNumber: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  skills: string[]
  certifications: string[]
  experienceYears: number
  hourlyRate: number
  shiftPreference: 'morning' | 'evening' | 'night' | 'flexible'
  availability: OperatorAvailability[]
  performance: PerformanceMetrics
  status: 'active' | 'inactive' | 'on_leave' | 'training'
  location: string
  supervisorId?: string
  hireDate: Date
  profileImage?: string
}

interface OperatorAvailability {
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface PerformanceMetrics {
  efficiency: number
  qualityScore: number
  attendance: number
  safetyRecord: number
  trainingCompleted: number
  totalHoursWorked: number
  averageTaskTime: number
}

interface TimeEntry {
  id: string
  operatorId: string
  date: Date
  clockIn: Date | null
  clockOut: Date | null
  breakStart?: Date
  breakEnd?: Date
  taskId?: string
  taskName?: string
  batchId?: string
  batchNumber?: string
  hoursWorked: number
  overtimeHours: number
  status: 'clocked_in' | 'on_break' | 'clocked_out' | 'absent'
  notes?: string
  approvedBy?: string
  approvedAt?: Date
}

interface TaskAssignment {
  id: string
  operatorId: string
  taskId: string
  taskName: string
  batchId: string
  batchNumber: string
  assignedBy: string
  assignedAt: Date
  startTime?: Date
  endTime?: Date
  estimatedDuration: number
  actualDuration?: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'assigned' | 'in_progress' | 'completed' | 'paused' | 'cancelled'
  skillsRequired: string[]
  instructions?: string
  completionNotes?: string
}

interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
  date: Date
  operatorIds: string[]
  supervisorId: string
  capacity: number
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  notes?: string
}

export default function OperatorTimeTracking() {
  const [operators, setOperators] = useState<Operator[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState('operators')
  const [isAddOperatorOpen, setIsAddOperatorOpen] = useState(false)
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false)
  const [isTimeEntryOpen, setIsTimeEntryOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    generateMockData()
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const generateMockData = () => {
    const mockOperators: Operator[] = [
      {
        id: 'OP001',
        employeeNumber: 'EMP001',
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@oudpms.com',
        phone: '+971-50-123-4567',
        department: 'Production',
        position: 'Senior Distillation Specialist',
        skills: ['Distillation', 'Blending', 'Quality Control', 'Equipment Maintenance'],
        certifications: ['Safety Level 3', 'Quality Control Certified', 'Distillation Expert'],
        experienceYears: 8,
        hourlyRate: 85,
        shiftPreference: 'morning',
        availability: [
          { dayOfWeek: 1, startTime: '08:00', endTime: '16:00', isAvailable: true },
          { dayOfWeek: 2, startTime: '08:00', endTime: '16:00', isAvailable: true },
          { dayOfWeek: 3, startTime: '08:00', endTime: '16:00', isAvailable: true },
          { dayOfWeek: 4, startTime: '08:00', endTime: '16:00', isAvailable: true },
          { dayOfWeek: 5, startTime: '08:00', endTime: '16:00', isAvailable: true }
        ],
        performance: {
          efficiency: 92,
          qualityScore: 96,
          attendance: 98,
          safetyRecord: 100,
          trainingCompleted: 95,
          totalHoursWorked: 1840,
          averageTaskTime: 45
        },
        status: 'active',
        location: 'Building A - Floor 2',
        hireDate: new Date(2020, 3, 15)
      },
      {
        id: 'OP002',
        employeeNumber: 'EMP002',
        name: 'Fatima Al-Zahra',
        email: 'fatima.alzahra@oudpms.com',
        phone: '+971-55-987-6543',
        department: 'Production',
        position: 'Blending Technician',
        skills: ['Blending', 'Packaging', 'Quality Testing', 'Inventory Management'],
        certifications: ['Safety Level 2', 'Blending Certified'],
        experienceYears: 5,
        hourlyRate: 65,
        shiftPreference: 'evening',
        availability: [
          { dayOfWeek: 1, startTime: '16:00', endTime: '00:00', isAvailable: true },
          { dayOfWeek: 2, startTime: '16:00', endTime: '00:00', isAvailable: true },
          { dayOfWeek: 3, startTime: '16:00', endTime: '00:00', isAvailable: true },
          { dayOfWeek: 4, startTime: '16:00', endTime: '00:00', isAvailable: true }
        ],
        performance: {
          efficiency: 88,
          qualityScore: 91,
          attendance: 95,
          safetyRecord: 98,
          trainingCompleted: 87,
          totalHoursWorked: 1600,
          averageTaskTime: 38
        },
        status: 'active',
        location: 'Building A - Floor 1',
        hireDate: new Date(2021, 8, 20)
      },
      {
        id: 'OP003',
        employeeNumber: 'EMP003',
        name: 'Omar Abdullah',
        email: 'omar.abdullah@oudpms.com',
        phone: '+971-52-456-7890',
        department: 'Production',
        position: 'Junior Operator',
        skills: ['Basic Operations', 'Packaging', 'Material Handling'],
        certifications: ['Safety Level 1'],
        experienceYears: 2,
        hourlyRate: 45,
        shiftPreference: 'flexible',
        availability: [
          { dayOfWeek: 1, startTime: '08:00', endTime: '16:00', isAvailable: true },
          { dayOfWeek: 2, startTime: '08:00', endTime: '16:00', isAvailable: true },
          { dayOfWeek: 3, startTime: '08:00', endTime: '16:00', isAvailable: true },
          { dayOfWeek: 4, startTime: '08:00', endTime: '16:00', isAvailable: true },
          { dayOfWeek: 5, startTime: '08:00', endTime: '16:00', isAvailable: true },
          { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isAvailable: true }
        ],
        performance: {
          efficiency: 78,
          qualityScore: 82,
          attendance: 92,
          safetyRecord: 95,
          trainingCompleted: 65,
          totalHoursWorked: 960,
          averageTaskTime: 52
        },
        status: 'training',
        location: 'Building B - Floor 1',
        hireDate: new Date(2023, 1, 10)
      }
    ]

    const mockTimeEntries: TimeEntry[] = [
      {
        id: 'TE001',
        operatorId: 'OP001',
        date: new Date(),
        clockIn: new Date(new Date().setHours(8, 0, 0, 0)),
        clockOut: null,
        breakStart: new Date(new Date().setHours(12, 0, 0, 0)),
        breakEnd: new Date(new Date().setHours(12, 30, 0, 0)),
        taskId: 'T001',
        taskName: 'Royal Oud Distillation',
        batchId: 'B001',
        batchNumber: 'ROB-2024-001',
        hoursWorked: 6.5,
        overtimeHours: 0,
        status: 'clocked_in',
        notes: 'Working on high-priority batch'
      },
      {
        id: 'TE002',
        operatorId: 'OP002',
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
        clockIn: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(16, 0, 0, 0) as any,
        clockOut: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(23, 45, 0, 0) as any,
        taskId: 'T002',
        taskName: 'Amber Blend Preparation',
        batchId: 'B002',
        batchNumber: 'AMB-2024-002',
        hoursWorked: 7.75,
        overtimeHours: 0,
        status: 'clocked_out',
        notes: 'Completed on schedule',
        approvedBy: 'SUP001',
        approvedAt: new Date()
      }
    ]

    const mockTaskAssignments: TaskAssignment[] = [
      {
        id: 'TA001',
        operatorId: 'OP001',
        taskId: 'T001',
        taskName: 'Royal Oud Distillation Setup',
        batchId: 'B001',
        batchNumber: 'ROB-2024-001',
        assignedBy: 'SUP001',
        assignedAt: new Date(new Date().setHours(7, 30, 0, 0)),
        startTime: new Date(new Date().setHours(8, 0, 0, 0)),
        estimatedDuration: 8,
        priority: 'high',
        status: 'in_progress',
        skillsRequired: ['Distillation', 'Quality Control'],
        instructions: 'Follow premium distillation protocol. Monitor temperature carefully.',
      },
      {
        id: 'TA002',
        operatorId: 'OP002',
        taskId: 'T002',
        taskName: 'Amber Essence Blending',
        batchId: 'B002',
        batchNumber: 'AMB-2024-002',
        assignedBy: 'SUP001',
        assignedAt: new Date(new Date().setHours(15, 30, 0, 0)),
        estimatedDuration: 6,
        priority: 'medium',
        status: 'assigned',
        skillsRequired: ['Blending', 'Quality Testing'],
        instructions: 'Use precision blending technique for consistency.',
      },
      {
        id: 'TA003',
        operatorId: 'OP003',
        taskId: 'T003',
        taskName: 'Packaging Line Setup',
        batchId: 'B003',
        batchNumber: 'PKG-2024-003',
        assignedBy: 'SUP002',
        assignedAt: new Date(new Date().setHours(9, 0, 0, 0)),
        estimatedDuration: 4,
        priority: 'low',
        status: 'assigned',
        skillsRequired: ['Packaging', 'Material Handling'],
        instructions: 'Prepare packaging line for 50ml bottles.',
      }
    ]

    const mockShifts: Shift[] = [
      {
        id: 'SH001',
        name: 'Morning Shift',
        startTime: '08:00',
        endTime: '16:00',
        date: new Date(),
        operatorIds: ['OP001', 'OP003'],
        supervisorId: 'SUP001',
        capacity: 3,
        status: 'active',
        notes: 'Focus on distillation processes'
      },
      {
        id: 'SH002',
        name: 'Evening Shift',
        startTime: '16:00',
        endTime: '00:00',
        date: new Date(),
        operatorIds: ['OP002'],
        supervisorId: 'SUP002',
        capacity: 2,
        status: 'scheduled',
        notes: 'Blending and packaging operations'
      }
    ]

    setOperators(mockOperators)
    setTimeEntries(mockTimeEntries)
    setTaskAssignments(mockTaskAssignments)
    setShifts(mockShifts)
  }

  const handleClockIn = (operatorId: string) => {
    const newEntry: TimeEntry = {
      id: `TE${Date.now()}`,
      operatorId,
      date: new Date(),
      clockIn: new Date(),
      clockOut: null,
      hoursWorked: 0,
      overtimeHours: 0,
      status: 'clocked_in'
    }
    setTimeEntries([...timeEntries, newEntry])
  }

  const handleClockOut = (operatorId: string) => {
    setTimeEntries(timeEntries.map(entry => {
      if (entry.operatorId === operatorId && entry.status === 'clocked_in') {
        const clockOut = new Date()
        const hoursWorked = clockOut.getTime() - (entry.clockIn?.getTime() || 0)
        return {
          ...entry,
          clockOut,
          hoursWorked: Math.round((hoursWorked / (1000 * 60 * 60)) * 100) / 100,
          status: 'clocked_out' as const
        }
      }
      return entry
    }))
  }

  const handleStartBreak = (operatorId: string) => {
    setTimeEntries(timeEntries.map(entry => {
      if (entry.operatorId === operatorId && entry.status === 'clocked_in') {
        return {
          ...entry,
          breakStart: new Date(),
          status: 'on_break' as const
        }
      }
      return entry
    }))
  }

  const handleEndBreak = (operatorId: string) => {
    setTimeEntries(timeEntries.map(entry => {
      if (entry.operatorId === operatorId && entry.status === 'on_break') {
        return {
          ...entry,
          breakEnd: new Date(),
          status: 'clocked_in' as const
        }
      }
      return entry
    }))
  }

  const getOperatorCurrentStatus = (operatorId: string) => {
    const todayEntry = timeEntries.find(entry =>
      entry.operatorId === operatorId &&
      entry.date.toDateString() === new Date().toDateString()
    )
    return todayEntry?.status || 'absent'
  }

  const getOperatorHoursToday = (operatorId: string) => {
    const todayEntry = timeEntries.find(entry =>
      entry.operatorId === operatorId &&
      entry.date.toDateString() === new Date().toDateString()
    )

    if (!todayEntry || !todayEntry.clockIn) return 0

    const endTime = todayEntry.clockOut || new Date()
    const hoursWorked = (endTime.getTime() - todayEntry.clockIn.getTime()) / (1000 * 60 * 60)

    // Subtract break time if applicable
    if (todayEntry.breakStart && todayEntry.breakEnd) {
      const breakTime = (todayEntry.breakEnd.getTime() - todayEntry.breakStart.getTime()) / (1000 * 60 * 60)
      return Math.max(0, hoursWorked - breakTime)
    }

    return Math.max(0, hoursWorked)
  }

  const getOperatorActiveTask = (operatorId: string) => {
    return taskAssignments.find(task =>
      task.operatorId === operatorId &&
      task.status === 'in_progress'
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clocked_in': return 'bg-green-100 text-green-800'
      case 'on_break': return 'bg-yellow-100 text-yellow-800'
      case 'clocked_out': return 'bg-gray-100 text-gray-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'training': return 'bg-blue-100 text-blue-800'
      case 'on_leave': return 'bg-orange-100 text-orange-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const formatTime = (date: Date | null | undefined) => {
    if (!date) return '--:--'
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const calculateShiftUtilization = (shift: Shift) => {
    const assignedOperators = shift.operatorIds.length
    const utilization = (assignedOperators / shift.capacity) * 100
    return Math.round(utilization)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Operator & Time Tracking</h2>
          <p className="text-muted-foreground">Manage operators, track time, and assign tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
          <Dialog open={isAddOperatorOpen} onOpenChange={setIsAddOperatorOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Operator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Operator</DialogTitle>
                <DialogDescription>Enter operator details and skills</DialogDescription>
              </DialogHeader>
              <AddOperatorForm onClose={() => setIsAddOperatorOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Current Time Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-900">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-lg text-blue-700">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="operators">Operators</TabsTrigger>
          <TabsTrigger value="time-tracking">Time Tracking</TabsTrigger>
          <TabsTrigger value="task-assignment">Task Assignment</TabsTrigger>
          <TabsTrigger value="shifts">Shift Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="operators" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operators.map((operator) => {
              const currentStatus = getOperatorCurrentStatus(operator.id)
              const hoursToday = getOperatorHoursToday(operator.id)
              const activeTask = getOperatorActiveTask(operator.id)

              return (
                <Card key={operator.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedOperator(operator)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {operator.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{operator.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{operator.position}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(currentStatus)}>
                        {currentStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Today: {hoursToday.toFixed(1)} hours</span>
                      </div>

                      {activeTask && (
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">{activeTask.taskName}</p>
                          <p className="text-xs text-blue-700">{activeTask.batchNumber}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4" />
                        <span>Performance: {operator.performance.efficiency}%</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{operator.location}</span>
                      </div>

                      <div className="flex gap-1 flex-wrap">
                        {operator.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {operator.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{operator.skills.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        {currentStatus === 'absent' && (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleClockIn(operator.id) }}>
                            <Play className="mr-1 h-3 w-3" />
                            Clock In
                          </Button>
                        )}
                        {currentStatus === 'clocked_in' && (
                          <>
                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleStartBreak(operator.id) }}>
                              <Coffee className="mr-1 h-3 w-3" />
                              Break
                            </Button>
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleClockOut(operator.id) }}>
                              <Square className="mr-1 h-3 w-3" />
                              Clock Out
                            </Button>
                          </>
                        )}
                        {currentStatus === 'on_break' && (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleEndBreak(operator.id) }}>
                            <Play className="mr-1 h-3 w-3" />
                            End Break
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="time-tracking" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate.toLocaleDateString()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="clocked_in">Clocked In</SelectItem>
                  <SelectItem value="on_break">On Break</SelectItem>
                  <SelectItem value="clocked_out">Clocked Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isTimeEntryOpen} onOpenChange={setIsTimeEntryOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Manual Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manual Time Entry</DialogTitle>
                  <DialogDescription>Add or edit time entry manually</DialogDescription>
                </DialogHeader>
                <ManualTimeEntryForm onClose={() => setIsTimeEntryOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operator</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Break</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries
                    .filter(entry => entry.date.toDateString() === selectedDate.toDateString())
                    .map((entry) => {
                      const operator = operators.find(op => op.id === entry.operatorId)
                      const breakDuration = entry.breakStart && entry.breakEnd
                        ? ((entry.breakEnd.getTime() - entry.breakStart.getTime()) / (1000 * 60))
                        : 0

                      return (
                        <TableRow key={entry.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                                {operator?.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium">{operator?.name}</p>
                                <p className="text-sm text-muted-foreground">{operator?.position}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{entry.date.toLocaleDateString()}</TableCell>
                          <TableCell>{formatTime(entry.clockIn)}</TableCell>
                          <TableCell>{formatTime(entry.clockOut)}</TableCell>
                          <TableCell>
                            {breakDuration > 0 ? `${Math.round(breakDuration)}min` : '--'}
                          </TableCell>
                          <TableCell>{entry.hoursWorked.toFixed(1)}h</TableCell>
                          <TableCell>
                            {entry.taskName ? (
                              <div>
                                <p className="font-medium">{entry.taskName}</p>
                                <p className="text-sm text-muted-foreground">{entry.batchNumber}</p>
                              </div>
                            ) : '--'}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(entry.status)}>
                              {entry.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              {!entry.approvedBy && (
                                <Button size="sm" variant="outline">
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="task-assignment" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAssignTaskOpen} onOpenChange={setIsAssignTaskOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Assign Task to Operator</DialogTitle>
                  <DialogDescription>Select operator and task details</DialogDescription>
                </DialogHeader>
                <TaskAssignmentForm onClose={() => setIsAssignTaskOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {taskAssignments.map((assignment) => {
              const operator = operators.find(op => op.id === assignment.operatorId)
              const progressPercentage = assignment.status === 'completed' ? 100 :
                assignment.status === 'in_progress' ? 60 :
                assignment.status === 'assigned' ? 0 : 30

              return (
                <Card key={assignment.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{assignment.taskName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{assignment.batchNumber}</p>
                      </div>
                      <Badge className={getPriorityColor(assignment.priority)}>
                        {assignment.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{operator?.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        <span className="text-sm">
                          {assignment.estimatedDuration}h estimated
                          {assignment.actualDuration && ` / ${assignment.actualDuration}h actual`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {assignment.assignedAt.toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {assignment.skillsRequired.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {assignment.instructions && (
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{assignment.instructions}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        {assignment.status === 'assigned' && (
                          <Button size="sm">
                            <Play className="mr-1 h-3 w-3" />
                            Start
                          </Button>
                        )}
                        {assignment.status === 'in_progress' && (
                          <Button size="sm">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shifts.map((shift) => {
              const utilization = calculateShiftUtilization(shift)
              const assignedOperators = operators.filter(op => shift.operatorIds.includes(op.id))

              return (
                <Card key={shift.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{shift.name}</CardTitle>
                      <Badge className={getStatusColor(shift.status)}>
                        {shift.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {shift.startTime} - {shift.endTime} | {shift.date.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Capacity Utilization</span>
                          <span>{utilization}%</span>
                        </div>
                        <Progress value={utilization} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {shift.operatorIds.length} / {shift.capacity} operators assigned
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Assigned Operators</Label>
                        <div className="mt-2 space-y-2">
                          {assignedOperators.map((operator) => (
                            <div key={operator.id} className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                {operator.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span>{operator.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {operator.position}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {shift.notes && (
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{shift.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="mr-1 h-3 w-3" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Operators</p>
                    <p className="text-2xl font-bold">{operators.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Currently Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {operators.filter(op => getOperatorCurrentStatus(op.id) === 'clocked_in').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">On Break</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {operators.filter(op => getOperatorCurrentStatus(op.id) === 'on_break').length}
                    </p>
                  </div>
                  <Coffee className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                    <p className="text-2xl font-bold">
                      {Math.round(operators.reduce((sum, op) => sum + op.performance.efficiency, 0) / operators.length)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operators
                    .sort((a, b) => b.performance.efficiency - a.performance.efficiency)
                    .slice(0, 5)
                    .map((operator) => (
                      <div key={operator.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                            {operator.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{operator.name}</p>
                            <p className="text-sm text-muted-foreground">{operator.position}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{operator.performance.efficiency}%</p>
                          <p className="text-sm text-muted-foreground">Efficiency</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(operators.flatMap(op => op.skills)))
                    .map(skill => {
                      const count = operators.filter(op => op.skills.includes(skill)).length
                      const percentage = (count / operators.length) * 100
                      return (
                        <div key={skill}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{skill}</span>
                            <span>{count} operators</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Operator Detail Dialog */}
      {selectedOperator && (
        <Dialog open={!!selectedOperator} onOpenChange={() => setSelectedOperator(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedOperator.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p>{selectedOperator.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOperator.position}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <OperatorDetailView operator={selectedOperator} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Component stub functions (would be implemented separately)
const AddOperatorForm = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Add Operator form would be implemented here</p>
    <Button onClick={onClose}>Close</Button>
  </div>
)

const ManualTimeEntryForm = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Manual Time Entry form would be implemented here</p>
    <Button onClick={onClose}>Close</Button>
  </div>
)

const TaskAssignmentForm = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Task Assignment form would be implemented here</p>
    <Button onClick={onClose}>Close</Button>
  </div>
)

const OperatorDetailView = ({ operator }: { operator: Operator }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Contact Information</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>{operator.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              <span>{operator.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{operator.location}</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Skills & Certifications</Label>
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-1">
              {operator.skills.map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {operator.certifications.map((cert) => (
                <Badge key={cert} className="bg-green-100 text-green-800">{cert}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Performance Metrics</Label>
          <div className="mt-2 space-y-3">
            {Object.entries(operator.performance).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span>{typeof value === 'number' ? (key.includes('Hours') || key.includes('Time') ? `${value}h` : `${value}%`) : value}</span>
                </div>
                {typeof value === 'number' && value <= 100 && (
                  <Progress value={value} className="h-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)