'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Clock,
  Calendar as CalendarIcon,
  Timer,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Bell,
  TrendingUp
} from 'lucide-react';
import { ProductionBatch, ProductionStatus } from '@/types/production';
import { format, differenceInDays, addDays, isPast, isToday, isTomorrow } from 'date-fns';

interface AgingBatch extends ProductionBatch {
  agingProgress: number;
  remainingDays: number;
  isOverdue: boolean;
  daysOverdue: number;
}

interface EnvironmentalConditions {
  temperature: number;
  humidity: number;
  timestamp: Date;
}

interface AgingTimerProps {
  batches: ProductionBatch[];
  onStartAging: (batchId: string, agingDays: number, temperature?: number, humidity?: number, notes?: string) => void;
  onCompleteAging: (batchId: string, notes?: string) => void;
  onExtendAging: (batchId: string, additionalDays: number, notes?: string) => void;
  onUpdateConditions: (batchId: string, conditions: EnvironmentalConditions) => void;
}

const AgingTimer: React.FC<AgingTimerProps> = ({
  batches,
  onStartAging,
  onCompleteAging,
  onExtendAging,
  onUpdateConditions
}) => {
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  const [isStartAgingOpen, setIsStartAgingOpen] = useState(false);
  const [agingDays, setAgingDays] = useState(30);
  const [agingNotes, setAgingNotes] = useState('');
  const [extensionDays, setExtensionDays] = useState(7);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [targetTemperature, setTargetTemperature] = useState(20);
  const [targetHumidity, setTargetHumidity] = useState(50);
  const [isConditionsDialogOpen, setIsConditionsDialogOpen] = useState(false);
  const [selectedBatchForConditions, setSelectedBatchForConditions] = useState<ProductionBatch | null>(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Calculate aging information for batches
  const agingBatches: AgingBatch[] = useMemo(() => {
    return batches
      .filter(batch =>
        batch.status === ProductionStatus.AGING ||
        batch.agingStartDate ||
        batch.agingDays
      )
      .map(batch => {
        let agingProgress = 0;
        let remainingDays = 0;
        let isOverdue = false;
        let daysOverdue = 0;

        if (batch.agingStartDate && batch.agingDays) {
          const agingStart = new Date(batch.agingStartDate);
          const agingEnd = addDays(agingStart, batch.agingDays);
          const totalDays = batch.agingDays;
          const daysPassed = differenceInDays(currentTime, agingStart);

          agingProgress = Math.min(100, (daysPassed / totalDays) * 100);
          remainingDays = Math.max(0, totalDays - daysPassed);

          if (isPast(agingEnd) && batch.status === ProductionStatus.AGING) {
            isOverdue = true;
            daysOverdue = differenceInDays(currentTime, agingEnd);
          }
        }

        return {
          ...batch,
          agingProgress,
          remainingDays,
          isOverdue,
          daysOverdue
        };
      })
      .sort((a, b) => {
        // Sort by priority: overdue first, then by remaining days
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        if (a.isOverdue && b.isOverdue) return b.daysOverdue - a.daysOverdue;
        return a.remainingDays - b.remainingDays;
      });
  }, [batches, currentTime]);

  // Group batches by aging status
  const agingStats = useMemo(() => {
    const total = agingBatches.length;
    const active = agingBatches.filter(b => b.status === ProductionStatus.AGING).length;
    const overdue = agingBatches.filter(b => b.isOverdue).length;
    const completingSoon = agingBatches.filter(b =>
      b.remainingDays <= 3 && b.remainingDays > 0 && !b.isOverdue
    ).length;
    const completed = batches.filter(b =>
      b.status === ProductionStatus.COMPLETED && b.agingEndDate
    ).length;

    return { total, active, overdue, completingSoon, completed };
  }, [agingBatches, batches]);

  const handleStartAging = (batch: ProductionBatch) => {
    setSelectedBatch(batch);
    setIsStartAgingOpen(true);
  };

  const confirmStartAging = () => {
    if (!selectedBatch || agingDays <= 0) return;

    onStartAging(selectedBatch.id, agingDays, targetTemperature, targetHumidity, agingNotes);
    setIsStartAgingOpen(false);
    setSelectedBatch(null);
    setAgingDays(30);
    setAgingNotes('');
    setTargetTemperature(20);
    setTargetHumidity(50);
  };

  const handleUpdateConditions = (temperature: number, humidity: number) => {
    if (!selectedBatchForConditions) return;

    onUpdateConditions(selectedBatchForConditions.id, {
      temperature,
      humidity,
      timestamp: new Date()
    });
    setIsConditionsDialogOpen(false);
    setSelectedBatchForConditions(null);
  };

  const getEnvironmentalStatus = (batch: AgingBatch) => {
    const currentTemp = batch.temperature || 20;
    const currentHumidity = batch.humidity || 50;

    // Ideal ranges for perfume aging
    const idealTempRange = { min: 18, max: 22 };
    const idealHumidityRange = { min: 45, max: 55 };

    const tempOk = currentTemp >= idealTempRange.min && currentTemp <= idealTempRange.max;
    const humidityOk = currentHumidity >= idealHumidityRange.min && currentHumidity <= idealHumidityRange.max;

    if (tempOk && humidityOk) return { status: 'optimal', color: 'text-green-600' };
    if ((tempOk || humidityOk)) return { status: 'acceptable', color: 'text-yellow-600' };
    return { status: 'poor', color: 'text-red-600' };
  };

  const getAgingStatusBadge = (batch: AgingBatch) => {
    if (batch.isOverdue) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Overdue ({batch.daysOverdue}d)
        </Badge>
      );
    }

    if (batch.remainingDays === 0) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Ready
        </Badge>
      );
    }

    if (batch.remainingDays <= 3) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Bell className="w-3 h-3" />
          Due Soon ({batch.remainingDays}d)
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Timer className="w-3 h-3" />
        Aging ({batch.remainingDays}d left)
      </Badge>
    );
  };

  const getProgressColor = (batch: AgingBatch) => {
    if (batch.isOverdue) return 'bg-red-500';
    if (batch.agingProgress >= 100) return 'bg-green-500';
    if (batch.agingProgress >= 80) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Aging Timer</h2>
          <p className="text-gray-600">Monitor perfume and product aging processes</p>
        </div>
        <div className="text-sm text-gray-600">
          Last updated: {format(currentTime, 'HH:mm:ss')}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Aging</p>
                <p className="text-2xl font-bold">{agingStats.total}</p>
              </div>
              <Timer className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">{agingStats.active}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{agingStats.overdue}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{agingStats.completingSoon}</p>
              </div>
              <Bell className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{agingStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aging Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Aging Batches</CardTitle>
        </CardHeader>
        <CardContent>
          {agingBatches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No batches currently aging</p>
              <p className="text-sm">Batches will appear here when aging starts</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Recipe</TableHead>
                    <TableHead>Aging Period</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agingBatches.map(batch => (
                    <TableRow key={batch.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{batch.batchNumber}</p>
                          <p className="text-sm text-gray-600">
                            {batch.plannedQuantity} {batch.unit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {batch.recipe ? (
                          <div>
                            <p className="font-medium">{batch.recipe.name}</p>
                            <p className="text-sm text-gray-600">{batch.recipe.category}</p>
                          </div>
                        ) : (
                          <span className="text-gray-500">No recipe</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {batch.agingDays ? (
                          <div>
                            <p className="font-medium">{batch.agingDays} days</p>
                            {batch.agingStartDate && (
                              <p className="text-sm text-gray-600">
                                Started: {format(new Date(batch.agingStartDate), 'MMM dd')}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={batch.agingProgress}
                              className="w-20"
                            />
                            <span className="text-sm">{batch.agingProgress.toFixed(0)}%</span>
                          </div>
                          {batch.remainingDays > 0 && (
                            <p className="text-xs text-gray-600">
                              {batch.remainingDays} days remaining
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {batch.temperature && batch.humidity ? (
                            <>
                              <div className="flex items-center gap-1 text-sm">
                                <Thermometer className="w-3 h-3 text-orange-500" />
                                <span className={getEnvironmentalStatus(batch).color}>
                                  {batch.temperature}°C
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Droplets className="w-3 h-3 text-blue-500" />
                                <span className={getEnvironmentalStatus(batch).color}>
                                  {batch.humidity}%
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getEnvironmentalStatus(batch).color}`}
                              >
                                {getEnvironmentalStatus(batch).status}
                              </Badge>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBatchForConditions(batch);
                                setIsConditionsDialogOpen(true);
                              }}
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              Set
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getAgingStatusBadge(batch)}</TableCell>
                      <TableCell>
                        {batch.agingStartDate && batch.agingDays ? (
                          <div>
                            <p className="font-medium">
                              {format(addDays(new Date(batch.agingStartDate), batch.agingDays), 'MMM dd, yyyy')}
                            </p>
                            <p className="text-sm text-gray-600">
                              {isToday(addDays(new Date(batch.agingStartDate), batch.agingDays)) ? 'Today' :
                               isTomorrow(addDays(new Date(batch.agingStartDate), batch.agingDays)) ? 'Tomorrow' :
                               format(addDays(new Date(batch.agingStartDate), batch.agingDays), 'MMM dd')}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-500">TBD</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {!batch.agingStartDate && batch.status !== ProductionStatus.AGING && (
                            <Button
                              size="sm"
                              onClick={() => handleStartAging(batch)}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}

                          {batch.status === ProductionStatus.AGING && (batch.isOverdue || batch.remainingDays === 0) && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => onCompleteAging(batch.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}

                          {batch.status === ProductionStatus.AGING && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <TrendingUp className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Extend Aging Period</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="extensionDays">Additional Days</Label>
                                    <Input
                                      id="extensionDays"
                                      type="number"
                                      min="1"
                                      value={extensionDays}
                                      onChange={(e) => setExtensionDays(parseInt(e.target.value) || 1)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="extensionNotes">Reason for Extension</Label>
                                    <Input
                                      id="extensionNotes"
                                      value={agingNotes}
                                      onChange={(e) => setAgingNotes(e.target.value)}
                                      placeholder="Why extend aging period?"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button
                                      onClick={() => {
                                        onExtendAging(batch.id, extensionDays, agingNotes);
                                        setAgingNotes('');
                                      }}
                                    >
                                      Extend
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Batches for Aging */}
      <Card>
        <CardHeader>
          <CardTitle>Ready to Start Aging</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const readyBatches = batches.filter(batch =>
              batch.status === ProductionStatus.IN_PROGRESS &&
              !batch.agingStartDate
            );

            return readyBatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No batches ready for aging</p>
                <p className="text-sm">Complete production to start aging</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {readyBatches.map(batch => (
                  <Card key={batch.id} className="border-dashed border-2 border-gray-300">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">{batch.batchNumber}</p>
                          <p className="text-sm text-gray-600">
                            {batch.recipe?.name || 'Custom batch'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="font-medium">{batch.plannedQuantity} {batch.unit}</p>
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleStartAging(batch)}
                        >
                          <Timer className="w-4 h-4 mr-2" />
                          Start Aging
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Start Aging Dialog */}
      <Dialog open={isStartAgingOpen} onOpenChange={setIsStartAgingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Aging Process</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Batch</p>
              <p className="font-medium">{selectedBatch?.batchNumber}</p>
            </div>

            <div>
              <Label htmlFor="agingDays">Aging Period (Days)</Label>
              <Select
                value={agingDays.toString()}
                onValueChange={(value) => setAgingDays(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetTemperature">Target Temperature (°C)</Label>
                <Input
                  id="targetTemperature"
                  type="number"
                  min="10"
                  max="35"
                  step="0.5"
                  value={targetTemperature}
                  onChange={(e) => setTargetTemperature(parseFloat(e.target.value) || 20)}
                />
                <p className="text-xs text-gray-600 mt-1">Ideal: 18-22°C</p>
              </div>
              <div>
                <Label htmlFor="targetHumidity">Target Humidity (%)</Label>
                <Input
                  id="targetHumidity"
                  type="number"
                  min="30"
                  max="80"
                  step="1"
                  value={targetHumidity}
                  onChange={(e) => setTargetHumidity(parseFloat(e.target.value) || 50)}
                />
                <p className="text-xs text-gray-600 mt-1">Ideal: 45-55%</p>
              </div>
            </div>

            <div>
              <Label htmlFor="agingNotes">Notes (Optional)</Label>
              <Input
                id="agingNotes"
                value={agingNotes}
                onChange={(e) => setAgingNotes(e.target.value)}
                placeholder="Add notes about aging conditions, storage location, etc."
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Expected completion: {format(addDays(new Date(), agingDays), 'PPP')}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsStartAgingOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmStartAging}>
                <Timer className="w-4 h-4 mr-2" />
                Start Aging
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Environmental Conditions Dialog */}
      <Dialog open={isConditionsDialogOpen} onOpenChange={setIsConditionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Environmental Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Batch</p>
              <p className="font-medium">{selectedBatchForConditions?.batchNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentTemperature">Current Temperature (°C)</Label>
                <Input
                  id="currentTemperature"
                  type="number"
                  min="10"
                  max="35"
                  step="0.1"
                  value={targetTemperature}
                  onChange={(e) => setTargetTemperature(parseFloat(e.target.value) || 20)}
                />
              </div>
              <div>
                <Label htmlFor="currentHumidity">Current Humidity (%)</Label>
                <Input
                  id="currentHumidity"
                  type="number"
                  min="30"
                  max="80"
                  step="1"
                  value={targetHumidity}
                  onChange={(e) => setTargetHumidity(parseFloat(e.target.value) || 50)}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Recommended Ranges</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Temperature:</p>
                  <p className="font-medium">18-22°C (Optimal)</p>
                  <p className="text-gray-600">16-25°C (Acceptable)</p>
                </div>
                <div>
                  <p className="text-gray-600">Humidity:</p>
                  <p className="font-medium">45-55% (Optimal)</p>
                  <p className="text-gray-600">40-60% (Acceptable)</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  IoT sensors can automatically monitor and alert on condition changes
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsConditionsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => handleUpdateConditions(targetTemperature, targetHumidity)}>
                <Settings className="w-4 h-4 mr-2" />
                Update Conditions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgingTimer;