'use client';

import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  Workflow,
  Plus,
  ArrowRight,
  Clock,
  Thermometer,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import {
  ProcessingFlow,
  ProcessingStage,
  ProcessingFlowStage,
  ProcessingBatch,
  ProcessingStatus
} from '@/types/production';

interface ProcessingFlowProps {
  flows: ProcessingFlow[];
  stages: ProcessingStage[];
  batches: ProcessingBatch[];
  onCreateFlow: (flow: Partial<ProcessingFlow>) => void;
  onUpdateFlow: (flowId: string, flow: Partial<ProcessingFlow>) => void;
  onDeleteFlow: (flowId: string) => void;
  onStartBatch: (flowId: string, batchData: any) => void;
}

const ProcessingFlowComponent: React.FC<ProcessingFlowProps> = ({
  flows,
  stages,
  batches,
  onCreateFlow,
  onUpdateFlow,
  onDeleteFlow,
  onStartBatch
}) => {
  const [selectedFlow, setSelectedFlow] = useState<ProcessingFlow | null>(null);
  const [isCreateFlowOpen, setIsCreateFlowOpen] = useState(false);
  const [isEditFlowOpen, setIsEditFlowOpen] = useState(false);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [flowStages, setFlowStages] = useState<ProcessingFlowStage[]>([]);
  const [editingFlow, setEditingFlow] = useState<ProcessingFlow | null>(null);

  // Handle drag and drop for stage ordering
  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === 'available-stages' && destination.droppableId === 'flow-stages') {
      // Adding stage to flow
      const stage = stages.find(s => s.id === draggableId);
      if (stage && !flowStages.find(fs => fs.stageId === stage.id)) {
        const newFlowStage: ProcessingFlowStage = {
          id: `temp-${Date.now()}`,
          flowId: '',
          stageId: stage.id,
          order: flowStages.length + 1,
          isRequired: true,
          stage
        };
        setFlowStages(prev => [...prev, newFlowStage]);
      }
    } else if (source.droppableId === 'flow-stages' && destination.droppableId === 'flow-stages') {
      // Reordering stages in flow
      const newStages = Array.from(flowStages);
      const [reorderedStage] = newStages.splice(source.index, 1);
      newStages.splice(destination.index, 0, reorderedStage);

      // Update order
      const updatedStages = newStages.map((stage, index) => ({
        ...stage,
        order: index + 1
      }));

      setFlowStages(updatedStages);
    }
  }, [flowStages, stages]);

  const handleCreateFlow = () => {
    if (!flowName.trim()) return;

    const flowData: Partial<ProcessingFlow> = {
      name: flowName,
      description: flowDescription,
      isActive: true,
      stages: flowStages.map(fs => ({
        ...fs,
        id: undefined // Let backend generate
      }))
    };

    onCreateFlow(flowData);
    resetForm();
    setIsCreateFlowOpen(false);
  };

  const handleEditFlow = () => {
    if (!editingFlow || !flowName.trim()) return;

    const flowData: Partial<ProcessingFlow> = {
      name: flowName,
      description: flowDescription,
      stages: flowStages
    };

    onUpdateFlow(editingFlow.id, flowData);
    resetForm();
    setIsEditFlowOpen(false);
  };

  const resetForm = () => {
    setFlowName('');
    setFlowDescription('');
    setFlowStages([]);
    setEditingFlow(null);
  };

  const openEditFlow = (flow: ProcessingFlow) => {
    setEditingFlow(flow);
    setFlowName(flow.name);
    setFlowDescription(flow.description || '');
    setFlowStages(flow.stages || []);
    setIsEditFlowOpen(true);
  };

  const removeStageFromFlow = (stageId: string) => {
    setFlowStages(prev => prev.filter(fs => fs.stageId !== stageId));
  };

  const getBatchesForFlow = (flowId: string) => {
    return batches.filter(batch => batch.flowId === flowId);
  };

  const getStatusBadge = (status: ProcessingStatus) => {
    const variants = {
      [ProcessingStatus.PENDING]: { variant: 'outline' as const, label: 'Pending' },
      [ProcessingStatus.IN_PROGRESS]: { variant: 'default' as const, label: 'In Progress' },
      [ProcessingStatus.COMPLETED]: { variant: 'default' as const, label: 'Completed' },
      [ProcessingStatus.PAUSED]: { variant: 'secondary' as const, label: 'Paused' },
      [ProcessingStatus.CANCELLED]: { variant: 'destructive' as const, label: 'Cancelled' }
    };

    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Processing Flows</h2>
          <p className="text-gray-600">Multi-level processing workflows</p>
        </div>
        <Dialog open={isCreateFlowOpen} onOpenChange={setIsCreateFlowOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Flow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Create Processing Flow</DialogTitle>
            </DialogHeader>
            <CreateFlowContent
              flowName={flowName}
              setFlowName={setFlowName}
              flowDescription={flowDescription}
              setFlowDescription={setFlowDescription}
              flowStages={flowStages}
              stages={stages}
              onDragEnd={onDragEnd}
              removeStageFromFlow={removeStageFromFlow}
              onSave={handleCreateFlow}
              onCancel={() => setIsCreateFlowOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Processing Flows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {flows.map(flow => (
          <Card key={flow.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workflow className="w-5 h-5" />
                  {flow.name}
                </div>
                <div className="flex gap-2">
                  <Badge variant={flow.isActive ? "default" : "secondary"}>
                    {flow.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditFlow(flow)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Processing Flow</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{flow.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteFlow(flow.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {flow.description && (
                <p className="text-gray-600 mb-4">{flow.description}</p>
              )}

              {/* Flow Stages */}
              <div className="space-y-3 mb-4">
                <h4 className="font-medium">Stages ({flow.stages?.length || 0})</h4>
                <div className="flex flex-wrap gap-2">
                  {flow.stages?.map((flowStage, index) => (
                    <div key={flowStage.id} className="flex items-center">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <span>{flowStage.stage.name}</span>
                        {flowStage.stage.duration && (
                          <Clock className="w-3 h-3" />
                        )}
                        {flowStage.stage.temperature && (
                          <Thermometer className="w-3 h-3" />
                        )}
                      </Badge>
                      {index < (flow.stages?.length || 0) - 1 && (
                        <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Batches */}
              <div className="space-y-2">
                <h4 className="font-medium">Active Batches</h4>
                {getBatchesForFlow(flow.id).length === 0 ? (
                  <p className="text-sm text-gray-500">No active batches</p>
                ) : (
                  <div className="space-y-2">
                    {getBatchesForFlow(flow.id)
                      .filter(batch => batch.status !== ProcessingStatus.COMPLETED)
                      .slice(0, 3)
                      .map(batch => (
                        <div
                          key={batch.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="text-sm font-medium">Batch #{batch.id.slice(0, 8)}</p>
                            <p className="text-xs text-gray-600">
                              Current: {batch.currentStage?.name || 'Starting'}
                            </p>
                          </div>
                          {getStatusBadge(batch.status)}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Flow Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => setSelectedFlow(flow)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Batch
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedFlow(flow)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {flows.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <Workflow className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No processing flows created yet</p>
            <p className="text-sm">Create your first processing flow to get started</p>
          </div>
        )}
      </div>

      {/* Edit Flow Dialog */}
      <Dialog open={isEditFlowOpen} onOpenChange={setIsEditFlowOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Edit Processing Flow</DialogTitle>
          </DialogHeader>
          <CreateFlowContent
            flowName={flowName}
            setFlowName={setFlowName}
            flowDescription={flowDescription}
            setFlowDescription={setFlowDescription}
            flowStages={flowStages}
            stages={stages}
            onDragEnd={onDragEnd}
            removeStageFromFlow={removeStageFromFlow}
            onSave={handleEditFlow}
            onCancel={() => setIsEditFlowOpen(false)}
            isEditing
          />
        </DialogContent>
      </Dialog>

      {/* Flow Details Dialog */}
      {selectedFlow && (
        <Dialog open={!!selectedFlow} onOpenChange={() => setSelectedFlow(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedFlow.name} - Details</DialogTitle>
            </DialogHeader>
            <FlowDetailsContent
              flow={selectedFlow}
              batches={getBatchesForFlow(selectedFlow.id)}
              onStartBatch={onStartBatch}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Create Flow Content Component
interface CreateFlowContentProps {
  flowName: string;
  setFlowName: (name: string) => void;
  flowDescription: string;
  setFlowDescription: (desc: string) => void;
  flowStages: ProcessingFlowStage[];
  stages: ProcessingStage[];
  onDragEnd: (result: DropResult) => void;
  removeStageFromFlow: (stageId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const CreateFlowContent: React.FC<CreateFlowContentProps> = ({
  flowName,
  setFlowName,
  flowDescription,
  setFlowDescription,
  flowStages,
  stages,
  onDragEnd,
  removeStageFromFlow,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const availableStages = stages.filter(
    stage => !flowStages.find(fs => fs.stageId === stage.id)
  );

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="flowName">Flow Name *</Label>
          <Input
            id="flowName"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            placeholder="Enter flow name"
          />
        </div>
        <div>
          <Label htmlFor="flowDescription">Description</Label>
          <Input
            id="flowDescription"
            value={flowDescription}
            onChange={(e) => setFlowDescription(e.target.value)}
            placeholder="Enter description (optional)"
          />
        </div>
      </div>

      {/* Drag and Drop Interface */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Stages */}
          <Card>
            <CardHeader>
              <CardTitle>Available Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="available-stages" isDropDisabled>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[200px]"
                  >
                    {availableStages.map((stage, index) => (
                      <Draggable key={stage.id} draggableId={stage.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 border rounded-lg cursor-grab ${
                              snapshot.isDragging ? 'shadow-lg bg-blue-50' : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{stage.name}</h4>
                                {stage.description && (
                                  <p className="text-sm text-gray-600">{stage.description}</p>
                                )}
                                <div className="flex gap-2 mt-2">
                                  {stage.duration && (
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {stage.duration}min
                                    </Badge>
                                  )}
                                  {stage.temperature && (
                                    <Badge variant="outline" className="text-xs">
                                      <Thermometer className="w-3 h-3 mr-1" />
                                      {stage.temperature}°C
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          {/* Flow Stages */}
          <Card>
            <CardHeader>
              <CardTitle>Flow Stages ({flowStages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="flow-stages">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-[200px] p-4 border-2 border-dashed rounded-lg ${
                      snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    {flowStages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        Drag stages here to build your flow
                      </div>
                    )}
                    {flowStages.map((flowStage, index) => (
                      <Draggable key={flowStage.id} draggableId={flowStage.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="p-3 border rounded-lg bg-white"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab"
                                >
                                  ⋮⋮
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{flowStage.stage.name}</h4>
                                  <p className="text-sm text-gray-600">Step {flowStage.order}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeStageFromFlow(flowStage.stageId)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
      </DragDropContext>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!flowName.trim() || flowStages.length === 0}>
          {isEditing ? 'Update Flow' : 'Create Flow'}
        </Button>
      </div>
    </div>
  );
};

// Flow Details Component
interface FlowDetailsContentProps {
  flow: ProcessingFlow;
  batches: ProcessingBatch[];
  onStartBatch: (flowId: string, batchData: any) => void;
}

const FlowDetailsContent: React.FC<FlowDetailsContentProps> = ({
  flow,
  batches,
  onStartBatch
}) => {
  return (
    <div className="space-y-6">
      {/* Flow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600">Stages</p>
          <p className="text-2xl font-bold">{flow.stages?.length || 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Active Batches</p>
          <p className="text-2xl font-bold">
            {batches.filter(b => b.status === ProcessingStatus.IN_PROGRESS).length}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Completed Batches</p>
          <p className="text-2xl font-bold">
            {batches.filter(b => b.status === ProcessingStatus.COMPLETED).length}
          </p>
        </div>
      </div>

      {/* Recent Batches */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Recent Batches</h3>
        <div className="space-y-2">
          {batches.slice(0, 5).map(batch => (
            <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Batch #{batch.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-600">
                  Started: {new Date(batch.startDate).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline">{batch.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingFlowComponent;