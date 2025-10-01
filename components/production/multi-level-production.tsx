'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
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
  Factory,
  ArrowRight,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  Thermometer,
  Droplets,
  Cpu,
  FlaskConical,
  Layers,
  Settings,
  Eye,
  RotateCcw,
  Timer
} from 'lucide-react';
import { ProductionBatch, ProcessingStage, ProductionStatus } from '@/types/production';
import { format, differenceInMinutes, addMinutes } from 'date-fns';

interface ProductionLevel {
  id: string;
  name: string;
  description: string;
  inputType: 'raw_oud' | 'oud_chips' | 'oud_oil' | 'fragrance_base';
  outputType: 'oud_chips' | 'oud_powder' | 'oud_oil' | 'perfume';
  stages: ProductionStageTemplate[];
  estimatedDuration: number; // in hours
  requiredTemperature?: { min: number; max: number };
  requiredHumidity?: { min: number; max: number };
}

interface ProductionStageTemplate {
  id: string;
  name: string;
  description: string;
  order: number;
  duration: number; // in minutes
  temperature?: number;
  humidity?: number;
  instructions: string;
  isRequired: boolean;
  requiresQualityCheck: boolean;
  iotSensors?: string[];
}

interface MultiLevelProductionProps {
  batches: ProductionBatch[];
  availableLevels: ProductionLevel[];
  onStartLevel: (batchId: string, levelId: string) => void;
  onUpdateStage: (stageId: string, data: Partial<ProcessingStage>) => void;
  onCompleteStage: (stageId: string, notes?: string) => void;
  onQualityCheck: (stageId: string, passed: boolean, notes?: string) => void;
}

const MultiLevelProduction: React.FC<MultiLevelProductionProps> = ({
  batches,
  availableLevels,
  onStartLevel,
  onUpdateStage,
  onCompleteStage,
  onQualityCheck
}) => {
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [viewingBatch, setViewingBatch] = useState<ProductionBatch | null>(null);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [stageNotes, setStageNotes] = useState<{ [key: string]: string }>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for real-time display
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Predefined production levels for perfume and oud manufacturing
  const defaultLevels: ProductionLevel[] = [
    {
      id: 'raw-to-chips',
      name: 'Raw Oud to Chips',
      description: 'Process raw oud wood into chips and powder',
      inputType: 'raw_oud',
      outputType: 'oud_chips',
      estimatedDuration: 8,
      stages: [
        {
          id: 'cleaning',
          name: 'Cleaning & Sorting',
          description: 'Clean and sort raw oud wood',
          order: 1,
          duration: 120,
          instructions: 'Remove impurities, sort by quality grade',
          isRequired: true,
          requiresQualityCheck: true
        },
        {
          id: 'cutting',
          name: 'Cutting & Sizing',
          description: 'Cut oud into uniform chips',
          order: 2,
          duration: 180,
          instructions: 'Cut into 2-5mm chips, maintain uniformity',
          isRequired: true,
          requiresQualityCheck: true
        },
        {
          id: 'grading',
          name: 'Quality Grading',
          description: 'Grade chips by quality',
          order: 3,
          duration: 90,
          instructions: 'Separate by color, density, and aroma intensity',
          isRequired: true,
          requiresQualityCheck: true
        },
        {
          id: 'packaging',
          name: 'Packaging & Storage',
          description: 'Package for storage or next process',
          order: 4,
          duration: 60,
          instructions: 'Vacuum seal or store in airtight containers',
          isRequired: true,
          requiresQualityCheck: false
        }
      ]
    },
    {
      id: 'chips-to-oil',
      name: 'Chips to Oil Extraction',
      description: 'Extract essential oil from oud chips',
      inputType: 'oud_chips',
      outputType: 'oud_oil',
      estimatedDuration: 72,
      requiredTemperature: { min: 60, max: 80 },
      stages: [
        {
          id: 'soaking',
          name: 'Soaking Preparation',
          description: 'Soak chips in distilled water',
          order: 1,
          duration: 1440, // 24 hours
          temperature: 25,
          instructions: 'Soak chips in distilled water for 24 hours',
          isRequired: true,
          requiresQualityCheck: false
        },
        {
          id: 'distillation',
          name: 'Steam Distillation',
          description: 'Extract oil through steam distillation',
          order: 2,
          duration: 2880, // 48 hours
          temperature: 70,
          instructions: 'Maintain consistent temperature and monitor oil separation',
          isRequired: true,
          requiresQualityCheck: true,
          iotSensors: ['temperature', 'pressure', 'flow_rate']
        },
        {
          id: 'separation',
          name: 'Oil Separation',
          description: 'Separate oil from water',
          order: 3,
          duration: 120,
          instructions: 'Use separation funnel to collect pure oil',
          isRequired: true,
          requiresQualityCheck: true
        },
        {
          id: 'filtering',
          name: 'Filtration & Purification',
          description: 'Filter and purify extracted oil',
          order: 4,
          duration: 180,
          instructions: 'Filter through activated carbon and fine mesh',
          isRequired: true,
          requiresQualityCheck: true
        }
      ]
    },
    {
      id: 'oil-to-perfume',
      name: 'Oil to Perfume Blending',
      description: 'Blend oud oil with alcohol and fixatives',
      inputType: 'oud_oil',
      outputType: 'perfume',
      estimatedDuration: 24,
      requiredTemperature: { min: 18, max: 22 },
      requiredHumidity: { min: 40, max: 60 },
      stages: [
        {
          id: 'preparation',
          name: 'Ingredient Preparation',
          description: 'Prepare all ingredients for blending',
          order: 1,
          duration: 60,
          temperature: 20,
          humidity: 50,
          instructions: 'Measure and prepare all ingredients according to recipe',
          isRequired: true,
          requiresQualityCheck: true
        },
        {
          id: 'blending',
          name: 'Initial Blending',
          description: 'Blend oud oil with carrier and alcohol',
          order: 2,
          duration: 120,
          temperature: 20,
          humidity: 50,
          instructions: 'Gradually mix ingredients in specified order',
          isRequired: true,
          requiresQualityCheck: true
        },
        {
          id: 'maturation',
          name: 'Maturation Period',
          description: 'Allow blend to mature and harmonize',
          order: 3,
          duration: 1200, // 20 hours
          temperature: 20,
          humidity: 50,
          instructions: 'Store in controlled environment for maturation',
          isRequired: true,
          requiresQualityCheck: false,
          iotSensors: ['temperature', 'humidity']
        },
        {
          id: 'final_adjustment',
          name: 'Final Adjustment',
          description: 'Make final adjustments to the blend',
          order: 4,
          duration: 90,
          temperature: 20,
          instructions: 'Adjust concentration and balance if needed',
          isRequired: false,
          requiresQualityCheck: true
        },
        {
          id: 'quality_testing',
          name: 'Quality Testing',
          description: 'Comprehensive quality assessment',
          order: 5,
          duration: 120,
          instructions: 'Test fragrance profile, stability, and compliance',
          isRequired: true,
          requiresQualityCheck: true
        },
        {
          id: 'bottling',
          name: 'Bottling & Labeling',
          description: 'Fill bottles and apply labels',
          order: 6,
          duration: 180,
          instructions: 'Fill bottles, apply labels, conduct final inspection',
          isRequired: true,
          requiresQualityCheck: true
        }
      ]
    }
  ];

  const allLevels = [...defaultLevels, ...availableLevels];

  // Group batches by their current production level
  const batchesByLevel = useMemo(() => {
    const grouped: { [key: string]: ProductionBatch[] } = {};

    batches.forEach(batch => {
      if (batch.processingStages && batch.processingStages.length > 0) {
        // Determine level based on current stage
        const currentStage = batch.processingStages.find(s => s.status === 'IN_PROGRESS') ||
                           batch.processingStages[batch.processingStages.length - 1];

        const level = allLevels.find(l =>
          l.stages.some(s => s.name === currentStage?.stageName)
        );

        const levelKey = level?.id || 'unassigned';
        grouped[levelKey] = grouped[levelKey] || [];
        grouped[levelKey].push(batch);
      } else {
        grouped['ready'] = grouped['ready'] || [];
        grouped['ready'].push(batch);
      }
    });

    return grouped;
  }, [batches, allLevels]);

  const getStageProgress = (stage: ProcessingStage): number => {
    if (!stage.startedAt) return 0;
    if (stage.completedAt) return 100;

    const elapsed = differenceInMinutes(currentTime, new Date(stage.startedAt));
    const total = stage.duration || 60;
    return Math.min(100, (elapsed / total) * 100);
  };

  const getStageStatusBadge = (stage: ProcessingStage) => {
    const progress = getStageProgress(stage);

    switch (stage.status) {
      case 'PENDING':
        return <Badge variant="outline">Pending</Badge>;
      case 'IN_PROGRESS':
        if (progress >= 100) {
          return <Badge className="bg-yellow-100 text-yellow-800">Ready for Review</Badge>;
        }
        return <Badge className="bg-blue-100 text-blue-800">In Progress ({progress.toFixed(0)}%)</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'SKIPPED':
        return <Badge variant="secondary">Skipped</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleStartLevel = () => {
    if (!selectedBatch || !selectedLevel) return;

    onStartLevel(selectedBatch.id, selectedLevel);
    setIsStartDialogOpen(false);
    setSelectedBatch(null);
    setSelectedLevel('');
  };

  const handleStageAction = (stage: ProcessingStage, action: 'start' | 'pause' | 'complete' | 'skip') => {
    const notes = stageNotes[stage.id] || '';

    switch (action) {
      case 'start':
        onUpdateStage(stage.id, {
          status: 'IN_PROGRESS',
          startedAt: new Date(),
          notes
        });
        break;
      case 'pause':
        onUpdateStage(stage.id, {
          status: 'PENDING',
          notes
        });
        break;
      case 'complete':
        onCompleteStage(stage.id, notes);
        break;
      case 'skip':
        onUpdateStage(stage.id, {
          status: 'SKIPPED',
          notes
        });
        break;
    }

    setStageNotes(prev => ({ ...prev, [stage.id]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Multi-Level Production</h2>
          <p className="text-gray-600">Manage complex perfume and oud manufacturing workflows</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isStartDialogOpen} onOpenChange={setIsStartDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Factory className="w-4 h-4 mr-2" />
                Start Production Level
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start Production Level</DialogTitle>
              </DialogHeader>
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
                      <SelectValue placeholder="Choose batch to start production" />
                    </SelectTrigger>
                    <SelectContent>
                      {batchesByLevel.ready?.map(batch => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.batchNumber} - {batch.recipe?.name || 'Custom'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Production Level</Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose production level" />
                    </SelectTrigger>
                    <SelectContent>
                      {allLevels.map(level => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name} - {level.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedLevel && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {allLevels.find(l => l.id === selectedLevel)?.description}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Estimated Duration: {allLevels.find(l => l.id === selectedLevel)?.estimatedDuration} hours
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsStartDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleStartLevel} disabled={!selectedBatch || !selectedLevel}>
                    Start Production
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Production Levels Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {allLevels.map(level => (
          <Card key={level.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                {level.name}
              </CardTitle>
              <p className="text-sm text-gray-600">{level.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Input:</p>
                    <Badge variant="outline">{level.inputType.replace('_', ' ')}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-600">Output:</p>
                    <Badge variant="outline">{level.outputType.replace('_', ' ')}</Badge>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-gray-600">Stages: {level.stages.length}</p>
                  <p className="text-gray-600">Duration: ~{level.estimatedDuration}h</p>
                </div>

                {level.requiredTemperature && (
                  <div className="flex items-center gap-1 text-sm text-orange-600">
                    <Thermometer className="w-4 h-4" />
                    {level.requiredTemperature.min}°C - {level.requiredTemperature.max}°C
                  </div>
                )}

                {level.requiredHumidity && (
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <Droplets className="w-4 h-4" />
                    {level.requiredHumidity.min}% - {level.requiredHumidity.max}% RH
                  </div>
                )}

                <div className="text-sm">
                  <p className="text-gray-600">Active Batches:</p>
                  <p className="font-medium">{batchesByLevel[level.id]?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Production Batches */}
      <Card>
        <CardHeader>
          <CardTitle>Active Production Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="ready">Ready to Start</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {Object.entries(batchesByLevel).map(([levelId, levelBatches]) => {
                const level = allLevels.find(l => l.id === levelId);
                if (!level && levelId !== 'ready' && levelId !== 'unassigned') return null;

                return (
                  <div key={levelId} className="space-y-3">
                    <h3 className="text-lg font-semibold">
                      {level?.name || (levelId === 'ready' ? 'Ready to Start' : 'Unassigned')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {levelBatches.map(batch => (
                        <Card key={batch.id} className="border">
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{batch.batchNumber}</p>
                                  <p className="text-sm text-gray-600">
                                    {batch.recipe?.name || 'Custom batch'}
                                  </p>
                                </div>
                                <Badge variant={
                                  batch.status === 'IN_PROGRESS' ? 'default' :
                                  batch.status === 'COMPLETED' ? 'secondary' :
                                  batch.status === 'AGING' ? 'outline' : 'destructive'
                                }>
                                  {batch.status.replace('_', ' ')}
                                </Badge>
                              </div>

                              <div className="text-sm">
                                <p>Quantity: {batch.plannedQuantity} {batch.unit}</p>
                                {batch.processingStages && batch.processingStages.length > 0 && (
                                  <p>
                                    Stages: {batch.processingStages.filter(s => s.status === 'COMPLETED').length}/{batch.processingStages.length} completed
                                  </p>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setViewingBatch(batch)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {batch.status === 'PLANNED' && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedBatch(batch);
                                      setIsStartDialogOpen(true);
                                    }}
                                  >
                                    <Play className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="in-progress">
              <div className="space-y-4">
                {batches
                  .filter(batch => batch.status === 'IN_PROGRESS')
                  .map(batch => (
                    <ProductionBatchDetails
                      key={batch.id}
                      batch={batch}
                      onStageAction={handleStageAction}
                      onQualityCheck={onQualityCheck}
                      stageNotes={stageNotes}
                      setStageNotes={setStageNotes}
                      getStageProgress={getStageProgress}
                      getStageStatusBadge={getStageStatusBadge}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="ready">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {batchesByLevel.ready?.map(batch => (
                  <Card key={batch.id} className="border-dashed border-2">
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
                          onClick={() => {
                            setSelectedBatch(batch);
                            setIsStartDialogOpen(true);
                          }}
                        >
                          <Factory className="w-4 h-4 mr-2" />
                          Start Production
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4">
                {batches
                  .filter(batch => batch.status === 'COMPLETED')
                  .map(batch => (
                    <Card key={batch.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{batch.batchNumber}</p>
                            <p className="text-sm text-gray-600">
                              {batch.recipe?.name || 'Custom batch'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Completed: {batch.endDate ? format(new Date(batch.endDate), 'PPP') : 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            <p className="text-sm text-gray-600 mt-1">
                              {batch.actualQuantity || batch.plannedQuantity} {batch.unit}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Batch Details Dialog */}
      {viewingBatch && (
        <Dialog open={!!viewingBatch} onOpenChange={() => setViewingBatch(null)}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Batch Details: {viewingBatch.batchNumber}</DialogTitle>
            </DialogHeader>
            <ProductionBatchDetails
              batch={viewingBatch}
              onStageAction={handleStageAction}
              onQualityCheck={onQualityCheck}
              stageNotes={stageNotes}
              setStageNotes={setStageNotes}
              getStageProgress={getStageProgress}
              getStageStatusBadge={getStageStatusBadge}
              isDialog={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Production Batch Details Component
interface ProductionBatchDetailsProps {
  batch: ProductionBatch;
  onStageAction: (stage: ProcessingStage, action: 'start' | 'pause' | 'complete' | 'skip') => void;
  onQualityCheck: (stageId: string, passed: boolean, notes?: string) => void;
  stageNotes: { [key: string]: string };
  setStageNotes: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  getStageProgress: (stage: ProcessingStage) => number;
  getStageStatusBadge: (stage: ProcessingStage) => React.ReactNode;
  isDialog?: boolean;
}

const ProductionBatchDetails: React.FC<ProductionBatchDetailsProps> = ({
  batch,
  onStageAction,
  onQualityCheck,
  stageNotes,
  setStageNotes,
  getStageProgress,
  getStageStatusBadge,
  isDialog = false
}) => {
  return (
    <Card className={isDialog ? 'border-0 shadow-none' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{batch.batchNumber}</CardTitle>
            <p className="text-gray-600">{batch.recipe?.name || 'Custom batch'}</p>
          </div>
          <div className="text-right">
            <Badge variant={
              batch.status === 'IN_PROGRESS' ? 'default' :
              batch.status === 'COMPLETED' ? 'secondary' :
              batch.status === 'AGING' ? 'outline' : 'destructive'
            }>
              {batch.status.replace('_', ' ')}
            </Badge>
            <p className="text-sm text-gray-600 mt-1">
              {batch.plannedQuantity} {batch.unit}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {batch.processingStages && batch.processingStages.length > 0 ? (
            <div className="space-y-4">
              {batch.processingStages
                .sort((a, b) => a.order - b.order)
                .map((stage, index) => (
                  <div key={stage.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{stage.stageName}</h4>
                          {stage.description && (
                            <p className="text-sm text-gray-600">{stage.description}</p>
                          )}
                        </div>
                      </div>
                      {getStageStatusBadge(stage)}
                    </div>

                    {stage.status === 'IN_PROGRESS' && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Progress value={getStageProgress(stage)} className="flex-1" />
                          <span className="text-sm text-gray-600">
                            {getStageProgress(stage).toFixed(0)}%
                          </span>
                        </div>
                        {stage.duration && (
                          <p className="text-xs text-gray-600">
                            Duration: {stage.duration} minutes
                            {stage.startedAt && (
                              <span className="ml-2">
                                (Started: {format(new Date(stage.startedAt), 'HH:mm')})
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    {(stage.temperature || stage.humidity) && (
                      <div className="flex gap-4 mb-3 text-sm">
                        {stage.temperature && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Thermometer className="w-4 h-4" />
                            {stage.temperature}°C
                          </div>
                        )}
                        {stage.humidity && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Droplets className="w-4 h-4" />
                            {stage.humidity}% RH
                          </div>
                        )}
                        {stage.isIoTEnabled && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Cpu className="w-4 h-4" />
                            IoT Enabled
                          </div>
                        )}
                      </div>
                    )}

                    {stage.instructions && (
                      <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                        <p className="text-blue-800">{stage.instructions}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add notes for this stage..."
                        value={stageNotes[stage.id] || ''}
                        onChange={(e) => setStageNotes(prev => ({
                          ...prev,
                          [stage.id]: e.target.value
                        }))}
                        rows={2}
                      />

                      <div className="flex gap-2">
                        {stage.status === 'PENDING' && (
                          <Button
                            size="sm"
                            onClick={() => onStageAction(stage, 'start')}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                        )}

                        {stage.status === 'IN_PROGRESS' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onStageAction(stage, 'pause')}
                            >
                              <Pause className="w-4 h-4 mr-1" />
                              Pause
                            </Button>
                            {getStageProgress(stage) >= 100 && (
                              <Button
                                size="sm"
                                onClick={() => onStageAction(stage, 'complete')}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Complete
                              </Button>
                            )}
                          </>
                        )}

                        {!stage.isRequired && stage.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onStageAction(stage, 'skip')}
                          >
                            Skip
                          </Button>
                        )}

                        {stage.status === 'COMPLETED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onQualityCheck(stage.id, true, stageNotes[stage.id])}
                          >
                            <FlaskConical className="w-4 h-4 mr-1" />
                            Quality Check
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Factory className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No production stages defined</p>
              <p className="text-sm">Start a production level to begin processing</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiLevelProduction;