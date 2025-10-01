'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';
import {
  CalendarIcon,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle,
  Factory,
  Users,
  Package,
  TrendingUp,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ZapOff,
  Zap,
  MapPin,
  Timer,
  Calendar as CalendarDays
} from 'lucide-react';
import {
  ProductionBatch,
  Recipe,
  Material,
  ProductionStatus
} from '@/types/production';
import {
  format,
  addDays,
  addHours,
  differenceInDays,
  differenceInHours,
  isToday,
  isTomorrow,
  isThisWeek,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO
} from 'date-fns';

interface ProductionResource {
  id: string;
  name: string;
  type: 'equipment' | 'person' | 'facility';
  capacity: number;
  availability: ResourceAvailability[];
  maintenanceSchedule?: MaintenanceWindow[];
  skills?: string[];
  location?: string;
}

interface ResourceAvailability {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  reason?: string;
}

interface MaintenanceWindow {
  startDate: Date;
  endDate: Date;
  type: 'preventive' | 'corrective' | 'upgrade';
  description: string;
}

interface ScheduledBatch extends ProductionBatch {
  scheduledStart: Date;
  scheduledEnd: Date;
  assignedResources: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dependencies: string[];
  estimatedDuration: number; // in hours
  bufferTime: number; // in hours
}

interface ProductionSchedulerProps {
  batches: ProductionBatch[];
  recipes: Recipe[];
  materials: Material[];
  resources: ProductionResource[];
  onScheduleBatch: (batchId: string, schedule: {
    startDate: Date;
    endDate: Date;
    resources: string[];
    priority: string;
  }) => void;
  onUpdateSchedule: (batchId: string, updates: Partial<ScheduledBatch>) => void;
  onReschedule: (batchId: string, newStart: Date) => void;
}

const ProductionScheduler: React.FC<ProductionSchedulerProps> = ({
  batches,
  recipes,
  materials,
  resources,
  onScheduleBatch,
  onUpdateSchedule,
  onReschedule
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProductionStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');

  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    startDate: new Date(),
    estimatedDuration: 8,
    priority: 'medium' as const,
    assignedResources: [] as string[],
    dependencies: [] as string[],
    bufferTime: 2
  });

  // Convert batches to scheduled batches (mock data - in real app this would come from backend)
  const scheduledBatches: ScheduledBatch[] = useMemo(() => {
    return batches.map((batch, index) => ({
      ...batch,
      scheduledStart: addHours(new Date(), index * 24),
      scheduledEnd: addHours(new Date(), (index * 24) + 8),
      assignedResources: resources.slice(0, 2).map(r => r.id),
      priority: ['low', 'medium', 'high', 'urgent'][index % 4] as any,
      dependencies: index > 0 ? [batches[index - 1].id] : [],
      estimatedDuration: 8 + (index % 4) * 2,
      bufferTime: 2
    }));
  }, [batches, resources]);

  // Get date range for current view
  const getDateRange = () => {
    switch (viewMode) {
      case 'day':
        return {
          start: selectedDate,
          end: selectedDate
        };
      case 'week':
        return {
          start: startOfWeek(selectedDate),
          end: endOfWeek(selectedDate)
        };
      case 'month':
        return {
          start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
          end: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
        };
    }
  };

  const dateRange = getDateRange();
  const daysInRange = eachDayOfInterval(dateRange);

  // Filter batches based on current filters
  const filteredBatches = scheduledBatches.filter(batch => {
    if (filterStatus !== 'all' && batch.status !== filterStatus) return false;
    if (filterPriority !== 'all' && batch.priority !== filterPriority) return false;
    return true;
  });

  // Get batches for a specific date
  const getBatchesForDate = (date: Date) => {
    return filteredBatches.filter(batch => {
      const batchDate = new Date(batch.scheduledStart);
      return format(batchDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  // Calculate resource utilization
  const getResourceUtilization = (resourceId: string, date: Date) => {
    const dayBatches = getBatchesForDate(date);
    const resourceBatches = dayBatches.filter(batch =>
      batch.assignedResources.includes(resourceId)
    );

    const totalHours = resourceBatches.reduce((sum, batch) => sum + batch.estimatedDuration, 0);
    const maxHours = 8; // 8-hour workday
    return Math.min(100, (totalHours / maxHours) * 100);
  };

  // Get schedule conflicts
  const getScheduleConflicts = () => {
    const conflicts: Array<{
      type: 'resource_overbooked' | 'dependency_violation' | 'material_shortage';
      batch: ScheduledBatch;
      details: string;
    }> = [];

    scheduledBatches.forEach(batch => {
      // Check resource overbooking
      batch.assignedResources.forEach(resourceId => {
        const utilization = getResourceUtilization(resourceId, batch.scheduledStart);
        if (utilization > 100) {
          conflicts.push({
            type: 'resource_overbooked',
            batch,
            details: `Resource ${resourceId} is overbooked (${utilization.toFixed(0)}%)`
          });
        }
      });

      // Check dependencies
      batch.dependencies.forEach(depId => {
        const dependency = scheduledBatches.find(b => b.id === depId);
        if (dependency && dependency.scheduledEnd > batch.scheduledStart) {
          conflicts.push({
            type: 'dependency_violation',
            batch,
            details: `Depends on batch ${dependency.batchNumber} which ends later`
          });
        }
      });

      // Check material availability (simplified)
      if (batch.recipe?.ingredients) {
        batch.recipe.ingredients.forEach(ingredient => {
          const material = materials.find(m => m.id === ingredient.materialId);
          if (material && material.currentStock < ingredient.quantity) {
            conflicts.push({
              type: 'material_shortage',
              batch,
              details: `Insufficient ${material.name} (need ${ingredient.quantity}, have ${material.currentStock})`
            });
          }
        });
      }
    });

    return conflicts;
  };

  const conflicts = getScheduleConflicts();

  // Calculate schedule metrics
  const scheduleMetrics = useMemo(() => {
    const totalBatches = scheduledBatches.length;
    const completedBatches = scheduledBatches.filter(b => b.status === ProductionStatus.COMPLETED).length;
    const inProgressBatches = scheduledBatches.filter(b => b.status === ProductionStatus.IN_PROGRESS).length;
    const delayedBatches = scheduledBatches.filter(b =>
      b.status !== ProductionStatus.COMPLETED && b.scheduledEnd < new Date()
    ).length;

    const averageUtilization = resources.reduce((sum, resource) => {
      const utilization = getResourceUtilization(resource.id, new Date());
      return sum + utilization;
    }, 0) / resources.length;

    return {
      totalBatches,
      completedBatches,
      inProgressBatches,
      delayedBatches,
      averageUtilization,
      conflictCount: conflicts.length
    };
  }, [scheduledBatches, resources, conflicts]);

  const handleScheduleBatch = () => {
    if (!selectedBatch) return;

    const endDate = addHours(scheduleForm.startDate, scheduleForm.estimatedDuration + scheduleForm.bufferTime);

    onScheduleBatch(selectedBatch.id, {
      startDate: scheduleForm.startDate,
      endDate,
      resources: scheduleForm.assignedResources,
      priority: scheduleForm.priority
    });

    setIsScheduleDialogOpen(false);
    setSelectedBatch(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: ProductionStatus) => {
    switch (status) {
      case ProductionStatus.COMPLETED: return 'bg-green-100 text-green-800';
      case ProductionStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      case ProductionStatus.AGING: return 'bg-purple-100 text-purple-800';
      case ProductionStatus.ON_HOLD: return 'bg-orange-100 text-orange-800';
      case ProductionStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Production Scheduler</h2>
          <p className="text-gray-600">Manage and optimize production schedules</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Auto-schedule logic
              alert('Auto-scheduling feature would optimize the entire schedule');
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Auto Schedule
          </Button>
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule Production Batch</DialogTitle>
              </DialogHeader>
              <ScheduleBatchForm
                batches={batches.filter(b => !scheduledBatches.find(sb => sb.id === b.id))}
                resources={resources}
                scheduleForm={scheduleForm}
                setScheduleForm={setScheduleForm}
                selectedBatch={selectedBatch}
                setSelectedBatch={setSelectedBatch}
                onSchedule={handleScheduleBatch}
                onCancel={() => setIsScheduleDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Batches</p>
                <p className="text-2xl font-bold">{scheduleMetrics.totalBatches}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{scheduleMetrics.inProgressBatches}</p>
              </div>
              <Play className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{scheduleMetrics.completedBatches}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delayed</p>
                <p className="text-2xl font-bold text-red-600">{scheduleMetrics.delayedBatches}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Utilization</p>
                <p className="text-2xl font-bold">{scheduleMetrics.averageUtilization.toFixed(0)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conflicts</p>
                <p className="text-2xl font-bold text-orange-600">{scheduleMetrics.conflictCount}</p>
              </div>
              <ZapOff className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-red-800">
                {conflicts.length} scheduling conflict(s) detected:
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                {conflicts.slice(0, 3).map((conflict, index) => (
                  <li key={index}>
                    • {conflict.batch.batchNumber}: {conflict.details}
                  </li>
                ))}
                {conflicts.length > 3 && (
                  <li>• And {conflicts.length - 3} more conflicts...</li>
                )}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and View Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex gap-2">
            {(['day', 'week', 'month'] as const).map(mode => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {format(selectedDate, 'MMM dd, yyyy')}
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
        </div>

        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={ProductionStatus.PLANNED}>Planned</SelectItem>
              <SelectItem value={ProductionStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={ProductionStatus.AGING}>Aging</SelectItem>
              <SelectItem value={ProductionStatus.COMPLETED}>Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
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
      </div>

      {/* Schedule View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Production Schedule - {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {viewMode === 'day' ? (
              <DayView
                date={selectedDate}
                batches={getBatchesForDate(selectedDate)}
                resources={resources}
                getResourceUtilization={getResourceUtilization}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                onReschedule={onReschedule}
              />
            ) : viewMode === 'week' ? (
              <WeekView
                dateRange={dateRange}
                scheduledBatches={filteredBatches}
                resources={resources}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                onReschedule={onReschedule}
              />
            ) : (
              <MonthView
                dateRange={dateRange}
                scheduledBatches={filteredBatches}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resource Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map(resource => (
              <div key={resource.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{resource.name}</span>
                    <Badge variant="outline">{resource.type}</Badge>
                    {resource.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {resource.location}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {getResourceUtilization(resource.id, selectedDate).toFixed(0)}% utilized
                  </span>
                </div>
                <Progress value={getResourceUtilization(resource.id, selectedDate)} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Schedule Batch Form Component
interface ScheduleBatchFormProps {
  batches: ProductionBatch[];
  resources: ProductionResource[];
  scheduleForm: any;
  setScheduleForm: (form: any) => void;
  selectedBatch: ProductionBatch | null;
  setSelectedBatch: (batch: ProductionBatch | null) => void;
  onSchedule: () => void;
  onCancel: () => void;
}

const ScheduleBatchForm: React.FC<ScheduleBatchFormProps> = ({
  batches,
  resources,
  scheduleForm,
  setScheduleForm,
  selectedBatch,
  setSelectedBatch,
  onSchedule,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Select Batch</Label>
        <Select
          value={selectedBatch?.id || ''}
          onValueChange={(value) => {
            const batch = batches.find(b => b.id === value);
            setSelectedBatch(batch || null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose batch to schedule" />
          </SelectTrigger>
          <SelectContent>
            {batches.map(batch => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.batchNumber} - {batch.recipe?.name || 'Custom'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedBatch && (
        <>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Quantity:</p>
                <p className="font-medium">{selectedBatch.plannedQuantity} {selectedBatch.unit}</p>
              </div>
              <div>
                <p className="text-gray-600">Recipe:</p>
                <p className="font-medium">{selectedBatch.recipe?.name || 'Custom'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(scheduleForm.startDate, 'PPP HH:mm')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduleForm.startDate}
                    onSelect={(date) =>
                      date && setScheduleForm(prev => ({ ...prev, startDate: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Estimated Duration (hours)</Label>
              <Input
                type="number"
                min="1"
                step="0.5"
                value={scheduleForm.estimatedDuration}
                onChange={(e) =>
                  setScheduleForm(prev => ({
                    ...prev,
                    estimatedDuration: parseFloat(e.target.value) || 8
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select
                value={scheduleForm.priority}
                onValueChange={(value) =>
                  setScheduleForm(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Buffer Time (hours)</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={scheduleForm.bufferTime}
                onChange={(e) =>
                  setScheduleForm(prev => ({
                    ...prev,
                    bufferTime: parseFloat(e.target.value) || 0
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label>Assign Resources</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {resources.map(resource => (
                <label key={resource.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={scheduleForm.assignedResources.includes(resource.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setScheduleForm(prev => ({
                          ...prev,
                          assignedResources: [...prev.assignedResources, resource.id]
                        }));
                      } else {
                        setScheduleForm(prev => ({
                          ...prev,
                          assignedResources: prev.assignedResources.filter(id => id !== resource.id)
                        }));
                      }
                    }}
                  />
                  <span className="text-sm">
                    {resource.name} ({resource.type})
                    {resource.location && ` - ${resource.location}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Scheduled end: {format(
                addHours(scheduleForm.startDate, scheduleForm.estimatedDuration + scheduleForm.bufferTime),
                'PPP HH:mm'
              )}
            </p>
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSchedule} disabled={!selectedBatch}>
          Schedule Batch
        </Button>
      </div>
    </div>
  );
};

// Day View Component
const DayView: React.FC<any> = ({
  date,
  batches,
  resources,
  getResourceUtilization,
  getPriorityColor,
  getStatusColor,
  onReschedule
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">
        {format(date, 'EEEE, MMMM do, yyyy')}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Scheduled Batches</h4>
          <div className="space-y-2">
            {batches.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No batches scheduled for this day</p>
            ) : (
              batches.map(batch => (
                <Card key={batch.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{batch.batchNumber}</p>
                        <p className="text-sm text-gray-600">{batch.recipe?.name || 'Custom'}</p>
                      </div>
                      <div className="flex gap-1">
                        <Badge className={getPriorityColor(batch.priority)}>
                          {batch.priority}
                        </Badge>
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>⏰ {format(batch.scheduledStart, 'HH:mm')} - {format(batch.scheduledEnd, 'HH:mm')}</p>
                      <p>📦 {batch.plannedQuantity} {batch.unit}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Resource Utilization</h4>
          <div className="space-y-3">
            {resources.map(resource => {
              const utilization = getResourceUtilization(resource.id, date);
              return (
                <div key={resource.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{resource.name}</span>
                    <span>{utilization.toFixed(0)}%</span>
                  </div>
                  <Progress value={utilization} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Week View Component
const WeekView: React.FC<any> = ({
  dateRange,
  scheduledBatches,
  resources,
  getPriorityColor,
  getStatusColor,
  onReschedule
}) => {
  const days = eachDayOfInterval(dateRange);

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 min-w-[800px]">
        {days.map(day => (
          <div key={day.toISOString()} className="space-y-2">
            <div className="text-center">
              <h4 className="font-medium">{format(day, 'EEE')}</h4>
              <p className="text-sm text-gray-600">{format(day, 'MMM d')}</p>
            </div>
            <div className="space-y-1">
              {scheduledBatches
                .filter(batch => {
                  const batchDate = new Date(batch.scheduledStart);
                  return format(batchDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
                })
                .map(batch => (
                  <div
                    key={batch.id}
                    className={`p-2 rounded text-xs border ${getPriorityColor(batch.priority)}`}
                  >
                    <p className="font-medium truncate">{batch.batchNumber}</p>
                    <p className="text-gray-600 truncate">
                      {format(batch.scheduledStart, 'HH:mm')}
                    </p>
                    <Badge size="sm" className={getStatusColor(batch.status)}>
                      {batch.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Month View Component
const MonthView: React.FC<any> = ({
  dateRange,
  scheduledBatches,
  getPriorityColor,
  getStatusColor
}) => {
  const days = eachDayOfInterval(dateRange);
  const weeks = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="space-y-2">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 gap-1">
          {week.map(day => {
            const dayBatches = scheduledBatches.filter(batch => {
              const batchDate = new Date(batch.scheduledStart);
              return format(batchDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
            });

            return (
              <div key={day.toISOString()} className="border rounded p-1 min-h-[80px]">
                <p className="text-xs font-medium">{format(day, 'd')}</p>
                <div className="space-y-1">
                  {dayBatches.slice(0, 2).map(batch => (
                    <div
                      key={batch.id}
                      className={`text-xs p-1 rounded ${getPriorityColor(batch.priority)}`}
                    >
                      {batch.batchNumber}
                    </div>
                  ))}
                  {dayBatches.length > 2 && (
                    <p className="text-xs text-gray-500">+{dayBatches.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ProductionScheduler;