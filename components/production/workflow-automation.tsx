'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Pause,
  Square,
  SkipForward,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Plus,
  Edit,
  Copy,
  Trash2,
  Zap,
  GitBranch,
  Timer,
  Bell,
  Users,
  Calendar,
  BarChart3,
  Workflow,
  ArrowRight,
  ArrowDown,
  Diamond,
  Circle
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'Manual' | 'Automated' | 'Quality Check' | 'Approval' | 'Timer' | 'Condition';
  duration: number; // in minutes
  dependsOn: string[];
  assignedTo?: string;
  instructions?: string;
  qualityChecks?: QualityCheckPoint[];
  automationScript?: string;
  conditions?: WorkflowCondition[];
  approvers?: string[];
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed' | 'Skipped';
  startTime?: Date;
  endTime?: Date;
  notes?: string;
}

interface QualityCheckPoint {
  parameter: string;
  expectedValue: string;
  tolerance: string;
  unit: string;
  critical: boolean;
}

interface WorkflowCondition {
  parameter: string;
  operator: '>' | '<' | '=' | '>=' | '<=' | '!=';
  value: string;
  action: 'Continue' | 'Stop' | 'Alert' | 'Branch';
}

interface ProductionWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'Perfume' | 'Oud Oil' | 'Attar' | 'Incense' | 'General';
  version: string;
  status: 'Draft' | 'Active' | 'Archived';
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  notifications: WorkflowNotification[];
  sla: {
    targetDuration: number; // in hours
    alertThreshold: number; // percentage
  };
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
}

interface WorkflowTrigger {
  id: string;
  name: string;
  type: 'Time' | 'Event' | 'Condition' | 'Manual';
  configuration: any;
  isActive: boolean;
}

interface WorkflowNotification {
  id: string;
  event: 'Step Started' | 'Step Completed' | 'Step Failed' | 'Workflow Completed' | 'SLA Breach';
  recipients: string[];
  method: 'Email' | 'SMS' | 'Push' | 'In-App';
  template: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  batchId: string;
  productionOrderId: string;
  status: 'Running' | 'Completed' | 'Failed' | 'Paused' | 'Cancelled';
  startTime: Date;
  endTime?: Date;
  currentStep: string;
  stepStatuses: { [stepId: string]: WorkflowStep['status'] };
  logs: WorkflowLog[];
  slaStatus: 'On Track' | 'At Risk' | 'Breached';
}

interface WorkflowLog {
  timestamp: Date;
  stepId: string;
  action: string;
  operator: string;
  details: string;
  data?: any;
}

const WorkflowAutomation: React.FC = () => {
  const [workflows, setWorkflows] = useState<ProductionWorkflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ProductionWorkflow | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [activeTab, setActiveTab] = useState('workflows');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockWorkflows: ProductionWorkflow[] = [
      {
        id: 'WF-001',
        name: 'Premium Oud Oil Production',
        description: 'Complete workflow for premium oud oil distillation and aging',
        category: 'Oud Oil',
        version: '2.1',
        status: 'Active',
        createdBy: 'Omar Hassan',
        createdAt: new Date('2024-01-01'),
        lastModified: new Date('2024-01-15'),
        sla: {
          targetDuration: 168, // 7 days
          alertThreshold: 80
        },
        triggers: [
          {
            id: 'TR-001',
            name: 'Production Order Started',
            type: 'Event',
            configuration: { event: 'production_order_started' },
            isActive: true
          }
        ],
        notifications: [
          {
            id: 'NT-001',
            event: 'Step Failed',
            recipients: ['supervisor@company.com'],
            method: 'Email',
            template: 'step_failed_template'
          }
        ],
        steps: [
          {
            id: 'STEP-001',
            name: 'Material Preparation',
            description: 'Prepare and weigh oud wood chips',
            type: 'Manual',
            duration: 30,
            dependsOn: [],
            assignedTo: 'Ahmed Al-Rashid',
            instructions: 'Weigh 5kg of premium oud wood chips. Ensure moisture content is below 15%.',
            status: 'Pending'
          },
          {
            id: 'STEP-002',
            name: 'Distillation Setup',
            description: 'Set up distillation equipment',
            type: 'Manual',
            duration: 45,
            dependsOn: ['STEP-001'],
            assignedTo: 'Ahmed Al-Rashid',
            instructions: 'Clean and assemble distillation apparatus. Check all connections.',
            status: 'Pending'
          },
          {
            id: 'STEP-003',
            name: 'Temperature Control Check',
            description: 'Automated temperature validation',
            type: 'Automated',
            duration: 5,
            dependsOn: ['STEP-002'],
            automationScript: 'check_temperature_range()',
            conditions: [
              {
                parameter: 'temperature',
                operator: '>=',
                value: '80',
                action: 'Continue'
              }
            ],
            status: 'Pending'
          },
          {
            id: 'STEP-004',
            name: 'Initial Distillation',
            description: 'First phase distillation process',
            type: 'Timer',
            duration: 480, // 8 hours
            dependsOn: ['STEP-003'],
            instructions: 'Monitor temperature and pressure during distillation.',
            status: 'Pending'
          },
          {
            id: 'STEP-005',
            name: 'Quality Check - Phase 1',
            description: 'Check oil quality after first distillation',
            type: 'Quality Check',
            duration: 20,
            dependsOn: ['STEP-004'],
            assignedTo: 'Dr. Sarah Ahmad',
            qualityChecks: [
              {
                parameter: 'Color',
                expectedValue: 'Dark Amber',
                tolerance: '±1 shade',
                unit: 'visual',
                critical: true
              },
              {
                parameter: 'Specific Gravity',
                expectedValue: '0.95',
                tolerance: '±0.02',
                unit: 'g/ml',
                critical: true
              }
            ],
            status: 'Pending'
          },
          {
            id: 'STEP-006',
            name: 'Supervisor Approval',
            description: 'Supervisor approval for second distillation',
            type: 'Approval',
            duration: 15,
            dependsOn: ['STEP-005'],
            approvers: ['Omar Hassan'],
            status: 'Pending'
          }
        ]
      }
    ];

    const mockExecutions: WorkflowExecution[] = [
      {
        id: 'EX-001',
        workflowId: 'WF-001',
        batchId: 'BTH-001',
        productionOrderId: 'PO-2024-001',
        status: 'Running',
        startTime: new Date('2024-01-16T08:00:00'),
        currentStep: 'STEP-003',
        stepStatuses: {
          'STEP-001': 'Completed',
          'STEP-002': 'Completed',
          'STEP-003': 'In Progress',
          'STEP-004': 'Pending',
          'STEP-005': 'Pending',
          'STEP-006': 'Pending'
        },
        logs: [
          {
            timestamp: new Date('2024-01-16T08:00:00'),
            stepId: 'STEP-001',
            action: 'Started',
            operator: 'Ahmed Al-Rashid',
            details: 'Material preparation started'
          },
          {
            timestamp: new Date('2024-01-16T08:30:00'),
            stepId: 'STEP-001',
            action: 'Completed',
            operator: 'Ahmed Al-Rashid',
            details: 'Material preparation completed successfully',
            data: { weight: '5.2kg', moisture: '12%' }
          }
        ],
        slaStatus: 'On Track'
      }
    ];

    setWorkflows(mockWorkflows);
    setExecutions(mockExecutions);
    setSelectedWorkflow(mockWorkflows[0]);
    setSelectedExecution(mockExecutions[0]);
  }, []);

  const getStepIcon = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'Manual': return <Users className="w-4 h-4" />;
      case 'Automated': return <Zap className="w-4 h-4" />;
      case 'Quality Check': return <CheckCircle className="w-4 h-4" />;
      case 'Approval': return <CheckCircle className="w-4 h-4" />;
      case 'Timer': return <Timer className="w-4 h-4" />;
      case 'Condition': return <Diamond className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'Pending': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Skipped': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const executeStep = (executionId: string, stepId: string) => {
    setExecutions(prev => prev.map(exec => {
      if (exec.id === executionId) {
        const newStepStatuses = { ...exec.stepStatuses };
        newStepStatuses[stepId] = 'In Progress';

        const newLog: WorkflowLog = {
          timestamp: new Date(),
          stepId,
          action: 'Started',
          operator: 'Current User',
          details: `Step ${stepId} started manually`
        };

        return {
          ...exec,
          stepStatuses: newStepStatuses,
          logs: [...exec.logs, newLog],
          currentStep: stepId
        };
      }
      return exec;
    }));
  };

  const completeStep = (executionId: string, stepId: string) => {
    setExecutions(prev => prev.map(exec => {
      if (exec.id === executionId) {
        const newStepStatuses = { ...exec.stepStatuses };
        newStepStatuses[stepId] = 'Completed';

        const newLog: WorkflowLog = {
          timestamp: new Date(),
          stepId,
          action: 'Completed',
          operator: 'Current User',
          details: `Step ${stepId} completed successfully`
        };

        return {
          ...exec,
          stepStatuses: newStepStatuses,
          logs: [...exec.logs, newLog]
        };
      }
      return exec;
    }));
  };

  const pauseExecution = (executionId: string) => {
    setExecutions(prev => prev.map(exec =>
      exec.id === executionId ? { ...exec, status: 'Paused' } : exec
    ));
  };

  const resumeExecution = (executionId: string) => {
    setExecutions(prev => prev.map(exec =>
      exec.id === executionId ? { ...exec, status: 'Running' } : exec
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Workflow className="w-5 h-5" />
              Production Workflow Automation
            </span>
            <div className="flex gap-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Active Executions</TabsTrigger>
          <TabsTrigger value="designer">Workflow Designer</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workflow List */}
            <Card>
              <CardHeader>
                <CardTitle>Available Workflows ({workflows.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedWorkflow?.id === workflow.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{workflow.name}</h4>
                          <p className="text-sm text-gray-600">{workflow.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{workflow.category}</Badge>
                            <Badge className={
                              workflow.status === 'Active' ? 'bg-green-100 text-green-800' :
                              workflow.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {workflow.status}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">v{workflow.version}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>{workflow.steps.length} steps</span>
                        <span>SLA: {workflow.sla.targetDuration}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workflow Details */}
            <div className="lg:col-span-2">
              {selectedWorkflow ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedWorkflow.name}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Start Execution
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Workflow Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Category</Label>
                          <p className="text-sm">{selectedWorkflow.category}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Version</Label>
                          <p className="text-sm">{selectedWorkflow.version}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">SLA Target</Label>
                          <p className="text-sm">{selectedWorkflow.sla.targetDuration} hours</p>
                        </div>
                      </div>

                      {/* Workflow Steps */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Workflow Steps</h3>
                        <div className="space-y-4">
                          {selectedWorkflow.steps.map((step, index) => (
                            <div key={step.id} className="relative">
                              {/* Connector Line */}
                              {index < selectedWorkflow.steps.length - 1 && (
                                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300" />
                              )}

                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                                  {getStepIcon(step.type)}
                                </div>

                                <div className="flex-1 pb-6">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium">{step.name}</h4>
                                      <p className="text-sm text-gray-600">{step.description}</p>
                                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                          <Timer className="w-3 h-3" />
                                          {step.duration} min
                                        </span>
                                        {step.assignedTo && (
                                          <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {step.assignedTo}
                                          </span>
                                        )}
                                        <Badge variant="outline" className="text-xs">
                                          {step.type}
                                        </Badge>
                                      </div>
                                    </div>
                                    <Badge className={getStatusColor(step.status)}>
                                      {step.status}
                                    </Badge>
                                  </div>

                                  {step.instructions && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                      <strong>Instructions:</strong> {step.instructions}
                                    </div>
                                  )}

                                  {step.qualityChecks && step.qualityChecks.length > 0 && (
                                    <div className="mt-2">
                                      <Label className="text-xs font-medium">Quality Checks:</Label>
                                      <div className="space-y-1 mt-1">
                                        {step.qualityChecks.map((check, idx) => (
                                          <div key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                                            <CheckCircle className="w-3 h-3" />
                                            {check.parameter}: {check.expectedValue} {check.unit}
                                            {check.critical && <Badge className="text-xs bg-red-100 text-red-800">Critical</Badge>}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {step.conditions && step.conditions.length > 0 && (
                                    <div className="mt-2">
                                      <Label className="text-xs font-medium">Conditions:</Label>
                                      <div className="space-y-1 mt-1">
                                        {step.conditions.map((condition, idx) => (
                                          <div key={idx} className="text-xs text-gray-600">
                                            {condition.parameter} {condition.operator} {condition.value} → {condition.action}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Workflow className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Workflow</h3>
                    <p className="text-gray-500">Choose a workflow from the list to view its details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Execution List */}
            <Card>
              <CardHeader>
                <CardTitle>Active Executions ({executions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {executions.map((execution) => (
                    <div
                      key={execution.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedExecution?.id === execution.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedExecution(execution)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{execution.id}</h4>
                          <p className="text-sm text-gray-600">Batch: {execution.batchId}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={
                              execution.status === 'Running' ? 'bg-blue-100 text-blue-800' :
                              execution.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              execution.status === 'Failed' ? 'bg-red-100 text-red-800' :
                              execution.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {execution.status}
                            </Badge>
                            <Badge variant="outline" className={
                              execution.slaStatus === 'On Track' ? 'text-green-600' :
                              execution.slaStatus === 'At Risk' ? 'text-yellow-600' :
                              'text-red-600'
                            }>
                              {execution.slaStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>Current: {execution.currentStep}</span>
                        <span>Started: {execution.startTime.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Execution Details */}
            <div className="lg:col-span-2">
              {selectedExecution ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Execution: {selectedExecution.id}</span>
                      <div className="flex gap-2">
                        {selectedExecution.status === 'Running' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pauseExecution(selectedExecution.id)}
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </Button>
                        ) : selectedExecution.status === 'Paused' ? (
                          <Button
                            size="sm"
                            onClick={() => resumeExecution(selectedExecution.id)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </Button>
                        ) : null}
                        <Button variant="outline" size="sm">
                          <Square className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="progress">
                      <TabsList>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                        <TabsTrigger value="logs">Logs</TabsTrigger>
                        <TabsTrigger value="controls">Controls</TabsTrigger>
                      </TabsList>

                      <TabsContent value="progress" className="space-y-4">
                        {/* Execution Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Batch ID</Label>
                            <p className="text-sm">{selectedExecution.batchId}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Production Order</Label>
                            <p className="text-sm">{selectedExecution.productionOrderId}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">SLA Status</Label>
                            <Badge variant="outline" className={
                              selectedExecution.slaStatus === 'On Track' ? 'text-green-600' :
                              selectedExecution.slaStatus === 'At Risk' ? 'text-yellow-600' :
                              'text-red-600'
                            }>
                              {selectedExecution.slaStatus}
                            </Badge>
                          </div>
                        </div>

                        {/* Step Progress */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Step Progress</h3>
                          {selectedWorkflow && (
                            <div className="space-y-4">
                              {selectedWorkflow.steps.map((step, index) => {
                                const stepStatus = selectedExecution.stepStatuses[step.id];
                                const isCurrentStep = selectedExecution.currentStep === step.id;

                                return (
                                  <div key={step.id} className="relative">
                                    {/* Connector Line */}
                                    {index < selectedWorkflow.steps.length - 1 && (
                                      <div className={`absolute left-6 top-12 w-0.5 h-8 ${
                                        stepStatus === 'Completed' ? 'bg-green-300' : 'bg-gray-300'
                                      }`} />
                                    )}

                                    <div className="flex items-center gap-4">
                                      <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                                        stepStatus === 'Completed' ? 'border-green-500 bg-green-50' :
                                        stepStatus === 'In Progress' ? 'border-blue-500 bg-blue-50' :
                                        stepStatus === 'Failed' ? 'border-red-500 bg-red-50' :
                                        'border-gray-300 bg-white'
                                      }`}>
                                        {stepStatus === 'Completed' ? (
                                          <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : stepStatus === 'Failed' ? (
                                          <AlertCircle className="w-6 h-6 text-red-500" />
                                        ) : stepStatus === 'In Progress' ? (
                                          <Clock className="w-6 h-6 text-blue-500" />
                                        ) : (
                                          getStepIcon(step.type)
                                        )}
                                      </div>

                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <h4 className={`font-medium ${isCurrentStep ? 'text-blue-600' : ''}`}>
                                              {step.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">{step.description}</p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(stepStatus)}>
                                              {stepStatus}
                                            </Badge>
                                            {stepStatus === 'Pending' && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => executeStep(selectedExecution.id, step.id)}
                                              >
                                                <Play className="w-3 h-3 mr-1" />
                                                Start
                                              </Button>
                                            )}
                                            {stepStatus === 'In Progress' && (
                                              <Button
                                                size="sm"
                                                onClick={() => completeStep(selectedExecution.id, step.id)}
                                              >
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Complete
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="logs" className="space-y-4">
                        <h3 className="text-lg font-medium">Execution Logs</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {selectedExecution.logs.map((log, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-sm">{log.action}</h4>
                                  <p className="text-sm text-gray-600">{log.details}</p>
                                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                    <span>Step: {log.stepId}</span>
                                    <span>Operator: {log.operator}</span>
                                    <span>{log.timestamp.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              {log.data && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                  <pre>{JSON.stringify(log.data, null, 2)}</pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="controls" className="space-y-4">
                        <h3 className="text-lg font-medium">Execution Controls</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Manual Controls</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <Button className="w-full" variant="outline">
                                <SkipForward className="w-4 h-4 mr-2" />
                                Skip Current Step
                              </Button>
                              <Button className="w-full" variant="outline">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Restart Current Step
                              </Button>
                              <Button className="w-full" variant="outline">
                                <GitBranch className="w-4 h-4 mr-2" />
                                Branch Workflow
                              </Button>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Notifications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <Button className="w-full" variant="outline">
                                <Bell className="w-4 h-4 mr-2" />
                                Send Alert
                              </Button>
                              <Button className="w-full" variant="outline">
                                <Users className="w-4 h-4 mr-2" />
                                Notify Supervisor
                              </Button>
                              <Button className="w-full" variant="outline">
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule Reminder
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Select an Execution</h3>
                    <p className="text-gray-500">Choose an execution from the list to monitor its progress</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="designer" className="space-y-4">
          <Card>
            <CardContent className="text-center py-12">
              <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Workflow Designer</h3>
              <p className="text-gray-500">Visual workflow designer will be implemented here</p>
              <p className="text-sm text-gray-400 mt-2">Drag-and-drop interface for creating custom workflows</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Workflow Analytics</h3>
              <p className="text-gray-500">Performance metrics and analytics will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Execution times, success rates, bottlenecks, and optimization suggestions</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowAutomation;