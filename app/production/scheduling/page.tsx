'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Calendar, Clock, Users, AlertTriangle, CheckCircle, RotateCcw, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Play, Pause, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { DatePicker, DateRangePicker } from '@/components/ui/date-picker';

// Mock data for production schedule
const productionSchedule = [
  {
    id: 'PS-001',
    batchId: 'PB001',
    product: 'Royal Oud Premium',
    recipe: 'RCP-001',
    quantity: 100,
    unit: 'bottles',
    priority: 'High',
    status: 'In Progress',
    progress: 65,
    startDate: '2024-10-01',
    endDate: '2024-10-05',
    estimatedDuration: 96, // hours
    actualDuration: 62, // hours so far
    operator: 'Ahmed Al-Rashid',
    equipment: ['Distillation Unit A', 'Mixing Tank 1'],
    stage: 'Distillation',
    nextStage: 'Aging',
    materialsReady: true,
    equipmentAvailable: true,
    operatorAssigned: true,
    dependencies: [],
    notes: 'Premium batch for export order. Quality checks required at each stage.',
  },
  {
    id: 'PS-002',
    batchId: 'PB002',
    product: 'Amber Essence Deluxe',
    recipe: 'RCP-002',
    quantity: 75,
    unit: 'bottles',
    priority: 'Medium',
    status: 'Scheduled',
    progress: 0,
    startDate: '2024-10-03',
    endDate: '2024-10-06',
    estimatedDuration: 72,
    actualDuration: 0,
    operator: 'Fatima Hassan',
    equipment: ['Mixing Tank 2', 'Filtration Unit B'],
    stage: 'Material Preparation',
    nextStage: 'Mixing',
    materialsReady: true,
    equipmentAvailable: false,
    operatorAssigned: true,
    dependencies: ['Equipment maintenance completion'],
    notes: 'Waiting for filtration unit maintenance to complete.',
  },
  {
    id: 'PS-003',
    batchId: 'PB003',
    product: 'Desert Rose Attar',
    recipe: 'RCP-003',
    quantity: 50,
    unit: 'bottles',
    priority: 'High',
    status: 'Aging',
    progress: 25,
    startDate: '2024-09-15',
    endDate: '2024-11-15',
    estimatedDuration: 1440, // 60 days
    actualDuration: 360, // 15 days
    operator: 'Mohammed Saeed',
    equipment: ['Traditional Clay Pots', 'Aging Chamber C'],
    stage: 'Aging Process',
    nextStage: 'Quality Testing',
    materialsReady: true,
    equipmentAvailable: true,
    operatorAssigned: true,
    dependencies: [],
    notes: 'Traditional 60-day aging process. Daily monitoring required.',
  },
  {
    id: 'PS-004',
    batchId: 'PB004',
    product: 'Sandalwood Blend',
    recipe: 'RCP-004',
    quantity: 120,
    unit: 'bottles',
    priority: 'Low',
    status: 'Planned',
    progress: 0,
    startDate: '2024-10-08',
    endDate: '2024-10-12',
    estimatedDuration: 80,
    actualDuration: 0,
    operator: 'Layla Ahmed',
    equipment: ['Distillation Unit B', 'Mixing Tank 3'],
    stage: 'Planning',
    nextStage: 'Material Preparation',
    materialsReady: false,
    equipmentAvailable: true,
    operatorAssigned: false,
    dependencies: ['Material procurement', 'Operator assignment'],
    notes: 'Pending material delivery and operator availability.',
  },
];

// Mock data for equipment and operators
const equipment = [
  { id: 'EQ-001', name: 'Distillation Unit A', status: 'In Use', maintenance: '2024-10-15', capacity: '200L' },
  { id: 'EQ-002', name: 'Distillation Unit B', status: 'Available', maintenance: '2024-11-01', capacity: '150L' },
  { id: 'EQ-003', name: 'Mixing Tank 1', status: 'In Use', maintenance: '2024-10-20', capacity: '300L' },
  { id: 'EQ-004', name: 'Mixing Tank 2', status: 'Maintenance', maintenance: '2024-10-03', capacity: '250L' },
  { id: 'EQ-005', name: 'Filtration Unit A', status: 'Available', maintenance: '2024-10-10', capacity: '100L/h' },
  { id: 'EQ-006', name: 'Filtration Unit B', status: 'Maintenance', maintenance: '2024-10-02', capacity: '150L/h' },
];

const operators = [
  { id: 'OP-001', name: 'Ahmed Al-Rashid', status: 'Busy', shift: 'Morning', specialization: 'Oud Distillation' },
  { id: 'OP-002', name: 'Fatima Hassan', status: 'Available', shift: 'Afternoon', specialization: 'Amber Processing' },
  { id: 'OP-003', name: 'Mohammed Saeed', status: 'Busy', shift: 'Morning', specialization: 'Traditional Attar' },
  { id: 'OP-004', name: 'Layla Ahmed', status: 'Available', shift: 'Evening', specialization: 'Blending' },
  { id: 'OP-005', name: 'Omar Hassan', status: 'Off Duty', shift: 'Night', specialization: 'Quality Control' },
];

// Mock calendar data
const calendarData = [
  { date: '2024-10-01', events: [{ id: 'PS-001', title: 'Royal Oud Premium - Start', type: 'start' }] },
  { date: '2024-10-03', events: [{ id: 'PS-002', title: 'Amber Essence - Start', type: 'start' }] },
  { date: '2024-10-05', events: [{ id: 'PS-001', title: 'Royal Oud Premium - End', type: 'end' }] },
  { date: '2024-10-08', events: [{ id: 'PS-004', title: 'Sandalwood Blend - Start', type: 'start' }] },
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode } } = {
    'Planned': { variant: 'outline', icon: <Calendar className="w-3 h-3 mr-1" /> },
    'Scheduled': { variant: 'secondary', icon: <Clock className="w-3 h-3 mr-1" /> },
    'In Progress': { variant: 'default', icon: <RotateCcw className="w-3 h-3 mr-1" /> },
    'Aging': { variant: 'secondary', icon: <Clock className="w-3 h-3 mr-1" /> },
    'Completed': { variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
    'Delayed': { variant: 'destructive', icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
  };
  const config = variants[status] || { variant: 'outline', icon: null };
  return (
    <Badge variant={config.variant} className="flex items-center">
      {config.icon}
      {status}
    </Badge>
  );
};

const getPriorityBadge = (priority: string) => {
  const colors: { [key: string]: string } = {
    'High': 'bg-red-500 text-white',
    'Medium': 'bg-yellow-500 text-white',
    'Low': 'bg-green-500 text-white',
  };
  return <Badge className={colors[priority] || 'bg-gray-500 text-white'}>{priority}</Badge>;
};

const getEquipmentStatusBadge = (status: string) => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline' } } = {
    'Available': { variant: 'default' },
    'In Use': { variant: 'secondary' },
    'Maintenance': { variant: 'destructive' },
    'Out of Order': { variant: 'destructive' },
  };
  return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
};

const getOperatorStatusBadge = (status: string) => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline' } } = {
    'Available': { variant: 'default' },
    'Busy': { variant: 'secondary' },
    'Off Duty': { variant: 'outline' },
    'On Leave': { variant: 'destructive' },
  };
  return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
};

export default function ProductionSchedulingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isNewScheduleDialogOpen, setIsNewScheduleDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<typeof productionSchedule[0] | null>(null);
  const [isViewScheduleDialogOpen, setIsViewScheduleDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDateRange, setSelectedDateRange] = useState<{from: Date | undefined, to?: Date | undefined}>();
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredSchedule = productionSchedule.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.operator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesPriority = filterPriority === 'all' || item.priority.toLowerCase() === filterPriority.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewSchedule = (schedule: typeof productionSchedule[0]) => {
    setSelectedSchedule(schedule);
    setIsViewScheduleDialogOpen(true);
  };

  // Calculate statistics
  const totalBatches = productionSchedule.length;
  const inProgressBatches = productionSchedule.filter(s => s.status === 'In Progress').length;
  const delayedBatches = productionSchedule.filter(s => s.status === 'Delayed').length;
  const avgProgress = productionSchedule.reduce((acc, s) => acc + s.progress, 0) / totalBatches;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-8 w-8 text-oud-600" />
            Production Scheduling
          </h1>
          <p className="text-muted-foreground mt-1">
            Plan, schedule, and monitor production workflows and resource allocation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Schedule Settings
          </Button>
          <Dialog open={isNewScheduleDialogOpen} onOpenChange={setIsNewScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
                <Plus className="h-4 w-4" />
                Schedule Production
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Production Batch</DialogTitle>
                <DialogDescription>
                  Create a new production schedule with resource allocation
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Production Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-recipe">Recipe</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RCP-001">RCP-001 - Royal Oud Premium</SelectItem>
                          <SelectItem value="RCP-002">RCP-002 - Amber Essence Deluxe</SelectItem>
                          <SelectItem value="RCP-003">RCP-003 - Desert Rose Attar</SelectItem>
                          <SelectItem value="RCP-004">RCP-004 - Sandalwood Blend</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-quantity">Quantity</Label>
                      <Input id="schedule-quantity" type="number" placeholder="100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-priority">Priority Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimated-duration">Estimated Duration (hours)</Label>
                      <Input id="estimated-duration" type="number" placeholder="96" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Scheduling */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Schedule & Timeline</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <DatePicker
                        date={selectedDate}
                        setDate={setSelectedDate}
                        placeholder="Select start date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expected End Date</Label>
                      <DatePicker
                        date={selectedDate}
                        setDate={setSelectedDate}
                        placeholder="Auto-calculated"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Resource Allocation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Resource Allocation</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>Assign Operator</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.filter(op => op.status === 'Available').map((operator) => (
                            <SelectItem key={operator.id} value={operator.id}>
                              {operator.name} - {operator.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label>Required Equipment</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {equipment.filter(eq => eq.status === 'Available').map((eq) => (
                          <div key={eq.id} className="flex items-center space-x-2">
                            <input type="checkbox" id={eq.id} className="rounded" />
                            <Label htmlFor={eq.id} className="text-sm">
                              {eq.name} ({eq.capacity})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Dependencies & Notes */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-dependencies">Dependencies</Label>
                    <Textarea
                      id="schedule-dependencies"
                      placeholder="List any dependencies or prerequisites..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-notes">Production Notes</Label>
                    <Textarea
                      id="schedule-notes"
                      placeholder="Special instructions, quality requirements, etc..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsNewScheduleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button onClick={() => setIsNewScheduleDialogOpen(false)} className="bg-oud-600 hover:bg-oud-700">
                    Schedule Production
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressBatches}</div>
            <p className="text-xs text-muted-foreground">
              Currently in production
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all active batches
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed Batches</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delayedBatches}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Operators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operators.filter(op => op.status === 'Available').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for assignment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Schedule</CardTitle>
              <CardDescription>
                Manage and monitor all scheduled production activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search schedule..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="aging">Aging</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Schedule Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedule.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.batchId}</TableCell>
                        <TableCell>{item.product}</TableCell>
                        <TableCell>{item.quantity} {item.unit}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={item.progress} className="w-16" />
                            <span className="text-sm text-muted-foreground">{item.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.operator}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{item.startDate}</div>
                            <div className="text-muted-foreground">to {item.endDate}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewSchedule(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {item.status === 'Scheduled' && (
                              <Button variant="ghost" size="sm">
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Production Calendar</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">October 2024</span>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Visual timeline of production schedules and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6 + 1; // Adjust for month start
                  const isCurrentMonth = day > 0 && day <= 31;
                  const dateStr = isCurrentMonth ? `2024-10-${day.toString().padStart(2, '0')}` : '';
                  const dayEvents = calendarData.filter(d => d.date === dateStr);

                  return (
                    <div
                      key={i}
                      className={`min-h-24 p-2 border rounded-lg ${
                        isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                      }`}
                    >
                      {isCurrentMonth && (
                        <>
                          <div className="text-sm font-medium mb-1">{day}</div>
                          {dayEvents.map((event, idx) => (
                            <div
                              key={idx}
                              className={`text-xs p-1 rounded mb-1 ${
                                event.events[0].type === 'start'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {event.events[0].title}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Status</CardTitle>
                <CardDescription>
                  Monitor equipment availability and maintenance schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {equipment.map((eq) => (
                    <div key={eq.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{eq.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Capacity: {eq.capacity} • Next Maintenance: {eq.maintenance}
                        </div>
                      </div>
                      {getEquipmentStatusBadge(eq.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operator Availability</CardTitle>
                <CardDescription>
                  Track operator schedules and specializations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operators.map((op) => (
                    <div key={op.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{op.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {op.shift} Shift • {op.specialization}
                        </div>
                      </div>
                      {getOperatorStatusBadge(op.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Capacity Utilization</CardTitle>
                <CardDescription>
                  Equipment and operator utilization rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Equipment Utilization</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Operator Utilization</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Capacity</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Bottlenecks</CardTitle>
                <CardDescription>
                  Identify constraints and optimization opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium">Filtration Unit B</div>
                      <div className="text-sm text-muted-foreground">Maintenance delaying 2 batches</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Night Shift Coverage</div>
                      <div className="text-sm text-muted-foreground">Limited operator availability</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Material Supply</div>
                      <div className="text-sm text-muted-foreground">All materials in stock</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Schedule Details Dialog */}
      <Dialog open={isViewScheduleDialogOpen} onOpenChange={setIsViewScheduleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedSchedule && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-oud-600" />
                  Production Schedule {selectedSchedule.id}
                </DialogTitle>
                <DialogDescription>
                  {selectedSchedule.batchId} • {selectedSchedule.product}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Schedule Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedSchedule.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <div className="mt-1">{getPriorityBadge(selectedSchedule.priority)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Progress</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={selectedSchedule.progress} className="w-16" />
                      <span className="text-sm">{selectedSchedule.progress}%</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Current Stage</Label>
                    <p className="text-sm mt-1">{selectedSchedule.stage}</p>
                  </div>
                </div>

                <Separator />

                {/* Timeline Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span className="font-medium">{selectedSchedule.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span className="font-medium">{selectedSchedule.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Duration:</span>
                        <span className="font-medium">{selectedSchedule.estimatedDuration}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actual Duration:</span>
                        <span className="font-medium">{selectedSchedule.actualDuration}h</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Resource Allocation</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="font-medium">Assigned Operator</Label>
                        <p className="text-sm text-muted-foreground">{selectedSchedule.operator}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Equipment Required</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedSchedule.equipment.map((eq, index) => (
                            <Badge key={index} variant="outline">{eq}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Readiness Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Readiness Status</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      {selectedSchedule.materialsReady ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <span>Materials Ready</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedSchedule.equipmentAvailable ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <span>Equipment Available</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedSchedule.operatorAssigned ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <span>Operator Assigned</span>
                    </div>
                  </div>
                </div>

                {/* Dependencies */}
                {selectedSchedule.dependencies.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Dependencies</h3>
                      <ul className="space-y-2">
                        {selectedSchedule.dependencies.map((dep, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{dep}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Production Notes</h3>
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                    {selectedSchedule.notes}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Schedule
                  </Button>
                  {selectedSchedule.status === 'Scheduled' && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      Start Production
                    </Button>
                  )}
                  {selectedSchedule.status === 'In Progress' && (
                    <Button variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Production
                    </Button>
                  )}
                  <Button className="bg-oud-600 hover:bg-oud-700">
                    Update Progress
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}