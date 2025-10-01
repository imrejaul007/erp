'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
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
  Activity,
  Clock,
  Thermometer,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  ArrowRight,
  AlertTriangle,
  FileText,
  Timer
} from 'lucide-react';
import {
  ProcessingBatch,
  ProcessingFlow,
  ProcessingStage,
  ProcessingStatus,
  ProcessingInput,
  ProcessingOutput
} from '@/types/production';
import { format } from 'date-fns';

interface ProcessingTrackerProps {
  batches: ProcessingBatch[];
  flows: ProcessingFlow[];
  stages: ProcessingStage[];
  onUpdateBatchStatus: (batchId: string, status: ProcessingStatus, notes?: string) => void;
  onMoveBatchToNextStage: (batchId: string, notes?: string) => void;
  onCompleteBatch: (batchId: string, outputs: ProcessingOutput[]) => void;
}

const ProcessingTracker: React.FC<ProcessingTrackerProps> = ({
  batches,
  flows,
  stages,
  onUpdateBatchStatus,
  onMoveBatchToNextStage,
  onCompleteBatch
}) => {
  const [selectedBatch, setSelectedBatch] = useState<ProcessingBatch | null>(null);
  const [statusUpdateNotes, setStatusUpdateNotes] = useState('');
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    batchId: string;
    status: ProcessingStatus;
  } | null>(null);

  // Group batches by status
  const batchesByStatus = useMemo(() => {
    return {
      [ProcessingStatus.PENDING]: batches.filter(b => b.status === ProcessingStatus.PENDING),
      [ProcessingStatus.IN_PROGRESS]: batches.filter(b => b.status === ProcessingStatus.IN_PROGRESS),
      [ProcessingStatus.PAUSED]: batches.filter(b => b.status === ProcessingStatus.PAUSED),
      [ProcessingStatus.COMPLETED]: batches.filter(b => b.status === ProcessingStatus.COMPLETED),
      [ProcessingStatus.CANCELLED]: batches.filter(b => b.status === ProcessingStatus.CANCELLED)
    };
  }, [batches]);

  // Calculate batch progress
  const getBatchProgress = (batch: ProcessingBatch) => {
    if (!batch.flow.stages || batch.flow.stages.length === 0) return 0;

    if (batch.status === ProcessingStatus.COMPLETED) return 100;
    if (batch.status === ProcessingStatus.CANCELLED) return 0;

    const currentStageIndex = batch.currentStage
      ? batch.flow.stages.findIndex(fs => fs.stageId === batch.currentStageId)
      : -1;

    if (currentStageIndex === -1) return 0;

    return ((currentStageIndex + 1) / batch.flow.stages.length) * 100;
  };

  // Get status badge variant
  const getStatusBadge = (status: ProcessingStatus) => {
    const variants = {
      [ProcessingStatus.PENDING]: { variant: 'outline' as const, label: 'Pending', icon: Clock },
      [ProcessingStatus.IN_PROGRESS]: { variant: 'default' as const, label: 'In Progress', icon: Activity },
      [ProcessingStatus.PAUSED]: { variant: 'secondary' as const, label: 'Paused', icon: Pause },
      [ProcessingStatus.COMPLETED]: { variant: 'default' as const, label: 'Completed', icon: CheckCircle },
      [ProcessingStatus.CANCELLED]: { variant: 'destructive' as const, label: 'Cancelled', icon: XCircle }
    };

    const { variant, label, icon: Icon } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  // Handle status update with notes
  const handleStatusUpdate = (batchId: string, newStatus: ProcessingStatus) => {
    setPendingStatusUpdate({ batchId, status: newStatus });
    setIsStatusDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (!pendingStatusUpdate) return;

    onUpdateBatchStatus(
      pendingStatusUpdate.batchId,
      pendingStatusUpdate.status,
      statusUpdateNotes
    );

    setIsStatusDialogOpen(false);
    setPendingStatusUpdate(null);
    setStatusUpdateNotes('');
  };

  // Get next stage for a batch
  const getNextStage = (batch: ProcessingBatch) => {
    if (!batch.currentStage || !batch.flow.stages) return null;

    const currentIndex = batch.flow.stages.findIndex(fs => fs.stageId === batch.currentStageId);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= batch.flow.stages.length) return null;

    return batch.flow.stages[nextIndex];
  };

  // Calculate stage duration if completed
  const getStageDuration = (batch: ProcessingBatch) => {
    if (!batch.startDate || !batch.endDate) return null;

    const duration = new Date(batch.endDate).getTime() - new Date(batch.startDate).getTime();
    return Math.round(duration / (1000 * 60)); // minutes
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Processing Tracker</h2>
          <p className="text-gray-600">Monitor and manage processing batches</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {batchesByStatus[ProcessingStatus.IN_PROGRESS].length} Active
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {batchesByStatus[ProcessingStatus.PENDING].length} Pending
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(batchesByStatus).map(([status, statusBatches]) => {
          const statusConfig = {
            [ProcessingStatus.PENDING]: { color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Clock },
            [ProcessingStatus.IN_PROGRESS]: { color: 'text-green-600', bgColor: 'bg-green-50', icon: Activity },
            [ProcessingStatus.PAUSED]: { color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Pause },
            [ProcessingStatus.COMPLETED]: { color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: CheckCircle },
            [ProcessingStatus.CANCELLED]: { color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle }
          };

          const config = statusConfig[status as ProcessingStatus];
          const Icon = config.icon;

          return (
            <Card key={status}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 capitalize">{status.toLowerCase().replace('_', ' ')}</p>
                    <p className={`text-2xl font-bold ${config.color}`}>{statusBatches.length}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Batch Tracking Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="in-progress" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pending">
                Pending ({batchesByStatus[ProcessingStatus.PENDING].length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress ({batchesByStatus[ProcessingStatus.IN_PROGRESS].length})
              </TabsTrigger>
              <TabsTrigger value="paused">
                Paused ({batchesByStatus[ProcessingStatus.PAUSED].length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({batchesByStatus[ProcessingStatus.COMPLETED].length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({batchesByStatus[ProcessingStatus.CANCELLED].length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <BatchTable
                batches={batchesByStatus[ProcessingStatus.PENDING]}
                onUpdateStatus={handleStatusUpdate}
                onMoveToNext={onMoveBatchToNextStage}
                onViewDetails={setSelectedBatch}
                getBatchProgress={getBatchProgress}
                getNextStage={getNextStage}
              />
            </TabsContent>

            <TabsContent value="in-progress">
              <BatchTable
                batches={batchesByStatus[ProcessingStatus.IN_PROGRESS]}
                onUpdateStatus={handleStatusUpdate}
                onMoveToNext={onMoveBatchToNextStage}
                onViewDetails={setSelectedBatch}
                getBatchProgress={getBatchProgress}
                getNextStage={getNextStage}
              />
            </TabsContent>

            <TabsContent value="paused">
              <BatchTable
                batches={batchesByStatus[ProcessingStatus.PAUSED]}
                onUpdateStatus={handleStatusUpdate}
                onMoveToNext={onMoveBatchToNextStage}
                onViewDetails={setSelectedBatch}
                getBatchProgress={getBatchProgress}
                getNextStage={getNextStage}
              />
            </TabsContent>

            <TabsContent value="completed">
              <BatchTable
                batches={batchesByStatus[ProcessingStatus.COMPLETED]}
                onUpdateStatus={handleStatusUpdate}
                onMoveToNext={onMoveBatchToNextStage}
                onViewDetails={setSelectedBatch}
                getBatchProgress={getBatchProgress}
                getNextStage={getNextStage}
              />
            </TabsContent>

            <TabsContent value="cancelled">
              <BatchTable
                batches={batchesByStatus[ProcessingStatus.CANCELLED]}
                onUpdateStatus={handleStatusUpdate}
                onMoveToNext={onMoveBatchToNextStage}
                onViewDetails={setSelectedBatch}
                getBatchProgress={getBatchProgress}
                getNextStage={getNextStage}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Batch Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>New Status</Label>
              <p className="font-medium">
                {pendingStatusUpdate?.status.replace('_', ' ')}
              </p>
            </div>
            <div>
              <Label htmlFor="statusNotes">Notes (Optional)</Label>
              <Textarea
                id="statusNotes"
                value={statusUpdateNotes}
                onChange={(e) => setStatusUpdateNotes(e.target.value)}
                placeholder="Add notes about this status change..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmStatusUpdate}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Batch Details Dialog */}
      {selectedBatch && (
        <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Batch Details</DialogTitle>
            </DialogHeader>
            <BatchDetailsContent
              batch={selectedBatch}
              getStageDuration={getStageDuration}
              getBatchProgress={getBatchProgress}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Batch Table Component
interface BatchTableProps {
  batches: ProcessingBatch[];
  onUpdateStatus: (batchId: string, status: ProcessingStatus) => void;
  onMoveToNext: (batchId: string, notes?: string) => void;
  onViewDetails: (batch: ProcessingBatch) => void;
  getBatchProgress: (batch: ProcessingBatch) => number;
  getNextStage: (batch: ProcessingBatch) => any;
}

const BatchTable: React.FC<BatchTableProps> = ({
  batches,
  onUpdateStatus,
  onMoveToNext,
  onViewDetails,
  getBatchProgress,
  getNextStage
}) => {
  const getStatusBadge = (status: ProcessingStatus) => {
    const variants = {
      [ProcessingStatus.PENDING]: { variant: 'outline' as const, label: 'Pending' },
      [ProcessingStatus.IN_PROGRESS]: { variant: 'default' as const, label: 'In Progress' },
      [ProcessingStatus.PAUSED]: { variant: 'secondary' as const, label: 'Paused' },
      [ProcessingStatus.COMPLETED]: { variant: 'default' as const, label: 'Completed' },
      [ProcessingStatus.CANCELLED]: { variant: 'destructive' as const, label: 'Cancelled' }
    };

    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch ID</TableHead>
            <TableHead>Flow</TableHead>
            <TableHead>Current Stage</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No batches found
              </TableCell>
            </TableRow>
          ) : (
            batches.map(batch => {
              const progress = getBatchProgress(batch);
              const nextStage = getNextStage(batch);

              return (
                <TableRow key={batch.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">#{batch.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(batch.startDate), 'MMM dd')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{batch.flow.name}</p>
                    <p className="text-sm text-gray-600">
                      {batch.flow.stages?.length || 0} stages
                    </p>
                  </TableCell>
                  <TableCell>
                    {batch.currentStage ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{batch.currentStage.name}</Badge>
                        {batch.currentStage.duration && (
                          <Badge variant="outline" className="text-xs">
                            <Timer className="w-3 h-3 mr-1" />
                            {batch.currentStage.duration}min
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">Not started</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="w-20" />
                      <span className="text-sm">{progress.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(batch.startDate), 'MMM dd, HH:mm')}
                  </TableCell>
                  <TableCell>{getStatusBadge(batch.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {batch.status === ProcessingStatus.PENDING && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateStatus(batch.id, ProcessingStatus.IN_PROGRESS)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}

                      {batch.status === ProcessingStatus.IN_PROGRESS && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateStatus(batch.id, ProcessingStatus.PAUSED)}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                          {nextStage && (
                            <Button
                              size="sm"
                              onClick={() => onMoveToNext(batch.id)}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}

                      {batch.status === ProcessingStatus.PAUSED && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateStatus(batch.id, ProcessingStatus.IN_PROGRESS)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(batch)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Batch Details Content Component
interface BatchDetailsContentProps {
  batch: ProcessingBatch;
  getStageDuration: (batch: ProcessingBatch) => number | null;
  getBatchProgress: (batch: ProcessingBatch) => number;
}

const BatchDetailsContent: React.FC<BatchDetailsContentProps> = ({
  batch,
  getStageDuration,
  getBatchProgress
}) => {
  const progress = getBatchProgress(batch);
  const duration = getStageDuration(batch);

  return (
    <div className="space-y-6">
      {/* Batch Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Batch ID</p>
          <p className="font-semibold">#{batch.id.slice(0, 8)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Progress</p>
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-20" />
            <span>{progress.toFixed(0)}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <Badge variant="outline">{batch.status}</Badge>
        </div>
        <div>
          <p className="text-sm text-gray-600">Duration</p>
          <p className="font-semibold">
            {duration ? `${duration} min` : 'In progress...'}
          </p>
        </div>
      </div>

      {/* Flow Stages Progress */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Processing Stages</h3>
        <div className="space-y-3">
          {batch.flow.stages?.map((flowStage, index) => {
            const isCurrentStage = batch.currentStageId === flowStage.stageId;
            const isCompleted = batch.currentStage
              ? batch.flow.stages!.findIndex(fs => fs.stageId === batch.currentStageId!) > index
              : false;

            return (
              <div key={flowStage.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isCurrentStage ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : isCurrentStage ? (
                    <Activity className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium">{flowStage.stage.name}</h4>
                  {flowStage.stage.description && (
                    <p className="text-sm text-gray-600">{flowStage.stage.description}</p>
                  )}
                  <div className="flex gap-2 mt-1">
                    {flowStage.stage.duration && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {flowStage.stage.duration}min
                      </Badge>
                    )}
                    {flowStage.stage.temperature && (
                      <Badge variant="outline" className="text-xs">
                        <Thermometer className="w-3 h-3 mr-1" />
                        {flowStage.stage.temperature}°C
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  {isCompleted && (
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  )}
                  {isCurrentStage && (
                    <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                  )}
                  {!isCompleted && !isCurrentStage && (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inputs and Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Inputs</h3>
          {batch.inputs?.length === 0 ? (
            <p className="text-gray-500">No inputs recorded</p>
          ) : (
            <div className="space-y-2">
              {batch.inputs?.map(input => (
                <div key={input.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{input.material.name}</p>
                  <p className="text-sm text-gray-600">
                    {input.quantity} {input.unit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Outputs</h3>
          {batch.outputs?.length === 0 ? (
            <p className="text-gray-500">No outputs recorded</p>
          ) : (
            <div className="space-y-2">
              {batch.outputs?.map(output => (
                <div key={output.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{output.material.name}</p>
                  <p className="text-sm text-gray-600">
                    {output.quantity} {output.unit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {batch.notes && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Notes</h3>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p>{batch.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingTracker;