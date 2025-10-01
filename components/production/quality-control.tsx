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
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Beaker,
  Microscope,
  TestTube,
  Shield,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Camera,
  Download,
  Upload,
  Plus,
  Edit,
  Search,
  Filter,
  Calendar,
  User,
  MapPin,
  Timer,
  Thermometer,
  Droplets,
  Gauge,
  Palette,
  Nose,
  Fingerprint
} from 'lucide-react';

interface QualityTest {
  id: string;
  testName: string;
  category: 'Physical' | 'Chemical' | 'Sensory' | 'Microbiological' | 'Safety' | 'Packaging';
  subCategory: string;
  description: string;
  procedure: string;
  requiredEquipment: string[];
  estimatedDuration: number; // in minutes
  frequency: 'Per Batch' | 'Daily' | 'Weekly' | 'Monthly' | 'As Needed';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

interface QualityTestExecution {
  id: string;
  testId: string;
  batchId: string;
  productId: string;
  executionDate: Date;
  technician: string;
  supervisor?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Failed' | 'Cancelled';
  results: TestResult[];
  overallResult: 'Pass' | 'Fail' | 'Conditional' | 'Pending';
  notes: string;
  attachments: string[];
  approvedBy?: string;
  approvedAt?: Date;
  retestRequired: boolean;
  retestReason?: string;
  completedAt?: Date;
}

interface TestResult {
  parameterId: string;
  parameterName: string;
  expectedValue: string;
  actualValue: string;
  unit: string;
  tolerance: string;
  result: 'Pass' | 'Fail' | 'Warning';
  method: string;
  equipment: string;
  measuredBy: string;
  measuredAt: Date;
  notes?: string;
}

interface QualityStandard {
  id: string;
  name: string;
  description: string;
  category: string;
  applicableProducts: string[];
  parameters: QualityParameter[];
  certification: string;
  version: string;
  effectiveDate: Date;
  isActive: boolean;
}

interface QualityParameter {
  id: string;
  name: string;
  description: string;
  type: 'Numeric' | 'Text' | 'Scale' | 'Boolean' | 'Range';
  unit?: string;
  minValue?: number;
  maxValue?: number;
  targetValue?: number;
  tolerance?: number;
  acceptanceCriteria: string;
  testMethod: string;
  equipment: string;
  priority: 'Critical' | 'Major' | 'Minor';
}

interface QualityBatch {
  batchId: string;
  productName: string;
  productType: string;
  productionDate: Date;
  batchSize: number;
  status: 'In Production' | 'Testing' | 'Approved' | 'Rejected' | 'On Hold';
  qualityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Reject';
  testsRequired: number;
  testsCompleted: number;
  testsPassed: number;
  testsFailed: number;
  lastTestDate?: Date;
  approvalDate?: Date;
  releaseDate?: Date;
  qcOfficer: string;
}

interface SensoryEvaluation {
  id: string;
  batchId: string;
  evaluationDate: Date;
  panelists: string[];
  coordinator: string;
  attributes: SensoryAttribute[];
  overallScore: number;
  recommendation: 'Approve' | 'Reject' | 'Retest' | 'Conditional';
  notes: string;
}

interface SensoryAttribute {
  name: string;
  scale: 'Intensity' | 'Quality' | 'Preference';
  scoreRange: { min: number; max: number };
  scores: number[];
  averageScore: number;
  standardDeviation: number;
  comments: string[];
}

const QualityControlWorkflows: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [qualityTests, setQualityTests] = useState<QualityTest[]>([]);
  const [testExecutions, setTestExecutions] = useState<QualityTestExecution[]>([]);
  const [qualityBatches, setQualityBatches] = useState<QualityBatch[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<QualityTestExecution | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockTests: QualityTest[] = [
      {
        id: 'QT-001',
        testName: 'Fragrance Intensity Assessment',
        category: 'Sensory',
        subCategory: 'Olfactory',
        description: 'Evaluation of fragrance strength and projection',
        procedure: '1. Allow sample to reach room temperature\n2. Apply 1 drop to test strip\n3. Evaluate at 0, 15, 30, 60 minutes\n4. Rate intensity on 1-10 scale',
        requiredEquipment: ['Fragrance test strips', 'Timer', 'Evaluation forms'],
        estimatedDuration: 90,
        frequency: 'Per Batch',
        isActive: true,
        createdBy: 'Dr. Sarah Ahmad',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'QT-002',
        testName: 'Specific Gravity Test',
        category: 'Physical',
        subCategory: 'Density',
        description: 'Measurement of oil density using pycnometer',
        procedure: '1. Clean and dry pycnometer\n2. Weigh empty pycnometer\n3. Fill with sample oil\n4. Weigh filled pycnometer\n5. Calculate specific gravity',
        requiredEquipment: ['Pycnometer', 'Analytical balance', 'Thermometer'],
        estimatedDuration: 30,
        frequency: 'Per Batch',
        isActive: true,
        createdBy: 'Hassan Al-Mahmoud',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'QT-003',
        testName: 'Color Evaluation',
        category: 'Physical',
        subCategory: 'Appearance',
        description: 'Visual assessment of oil color and clarity',
        procedure: '1. Place sample in clear glass vial\n2. Observe under standard lighting\n3. Compare with color standards\n4. Check for clarity and particles',
        requiredEquipment: ['Glass vials', 'Standard lighting booth', 'Color standards'],
        estimatedDuration: 15,
        frequency: 'Per Batch',
        isActive: true,
        createdBy: 'Fatima Al-Zahra',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'QT-004',
        testName: 'pH Measurement',
        category: 'Chemical',
        subCategory: 'Acidity',
        description: 'Measurement of sample pH level',
        procedure: '1. Calibrate pH meter\n2. Clean electrode\n3. Immerse in sample\n4. Record stable reading\n5. Clean electrode',
        requiredEquipment: ['pH meter', 'Calibration solutions', 'Distilled water'],
        estimatedDuration: 10,
        frequency: 'Per Batch',
        isActive: true,
        createdBy: 'Dr. Sarah Ahmad',
        createdAt: new Date('2024-01-01')
      }
    ];

    const mockExecutions: QualityTestExecution[] = [
      {
        id: 'QE-001',
        testId: 'QT-001',
        batchId: 'BTH-001',
        productId: 'PRD-001',
        executionDate: new Date(),
        technician: 'Dr. Sarah Ahmad',
        supervisor: 'Omar Hassan',
        status: 'Completed',
        overallResult: 'Pass',
        notes: 'Excellent fragrance projection and longevity',
        attachments: ['fragrance_test_results.pdf'],
        approvedBy: 'Omar Hassan',
        approvedAt: new Date(),
        retestRequired: false,
        completedAt: new Date(),
        results: [
          {
            parameterId: 'FRAG-INT-01',
            parameterName: 'Initial Intensity',
            expectedValue: '7-9',
            actualValue: '8.5',
            unit: 'scale',
            tolerance: '±0.5',
            result: 'Pass',
            method: 'Sensory Panel',
            equipment: 'Test Strips',
            measuredBy: 'Dr. Sarah Ahmad',
            measuredAt: new Date(),
            notes: 'Strong initial projection'
          },
          {
            parameterId: 'FRAG-LON-01',
            parameterName: 'Longevity (60 min)',
            expectedValue: '6-8',
            actualValue: '7.2',
            unit: 'scale',
            tolerance: '±0.5',
            result: 'Pass',
            method: 'Sensory Panel',
            equipment: 'Test Strips',
            measuredBy: 'Dr. Sarah Ahmad',
            measuredAt: new Date(),
            notes: 'Good staying power'
          }
        ]
      },
      {
        id: 'QE-002',
        testId: 'QT-002',
        batchId: 'BTH-001',
        productId: 'PRD-001',
        executionDate: new Date(),
        technician: 'Hassan Al-Mahmoud',
        status: 'In Progress',
        overallResult: 'Pending',
        notes: 'Testing in progress',
        attachments: [],
        retestRequired: false,
        results: []
      }
    ];

    const mockBatches: QualityBatch[] = [
      {
        batchId: 'BTH-001',
        productName: 'Royal Oud Premium - 30ml',
        productType: 'Oud Oil',
        productionDate: new Date('2024-01-16'),
        batchSize: 100,
        status: 'Testing',
        qualityGrade: 'A',
        testsRequired: 6,
        testsCompleted: 3,
        testsPassed: 2,
        testsFailed: 0,
        lastTestDate: new Date(),
        qcOfficer: 'Dr. Sarah Ahmad'
      },
      {
        batchId: 'BTH-002',
        productName: 'Floral Garden Attar - 12ml',
        productType: 'Attar',
        productionDate: new Date('2024-01-14'),
        batchSize: 50,
        status: 'Approved',
        qualityGrade: 'A+',
        testsRequired: 5,
        testsCompleted: 5,
        testsPassed: 5,
        testsFailed: 0,
        approvalDate: new Date('2024-01-18'),
        releaseDate: new Date('2024-01-19'),
        qcOfficer: 'Hassan Al-Mahmoud'
      }
    ];

    setQualityTests(mockTests);
    setTestExecutions(mockExecutions);
    setQualityBatches(mockBatches);
    setSelectedExecution(mockExecutions[0]);
  }, []);

  const getStatusColor = (status: QualityTestExecution['status']) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result: 'Pass' | 'Fail' | 'Warning' | 'Pending' | 'Conditional') => {
    switch (result) {
      case 'Pass': return 'text-green-600';
      case 'Fail': return 'text-red-600';
      case 'Warning': return 'text-yellow-600';
      case 'Conditional': return 'text-orange-600';
      case 'Pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getResultIcon = (result: 'Pass' | 'Fail' | 'Warning' | 'Pending' | 'Conditional') => {
    switch (result) {
      case 'Pass': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Fail': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'Conditional': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'Pending': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: QualityTest['category']) => {
    switch (category) {
      case 'Physical': return <Eye className="w-4 h-4" />;
      case 'Chemical': return <TestTube className="w-4 h-4" />;
      case 'Sensory': return <Nose className="w-4 h-4" />;
      case 'Microbiological': return <Microscope className="w-4 h-4" />;
      case 'Safety': return <Shield className="w-4 h-4" />;
      case 'Packaging': return <FileText className="w-4 h-4" />;
      default: return <Beaker className="w-4 h-4" />;
    }
  };

  const executeTest = (testId: string, batchId: string) => {
    const newExecution: QualityTestExecution = {
      id: `QE-${Date.now()}`,
      testId,
      batchId,
      productId: 'PRD-001',
      executionDate: new Date(),
      technician: 'Current User',
      status: 'Scheduled',
      overallResult: 'Pending',
      notes: '',
      attachments: [],
      retestRequired: false,
      results: []
    };

    setTestExecutions(prev => [...prev, newExecution]);
  };

  const completeTest = (executionId: string, results: TestResult[]) => {
    const overallResult = results.every(r => r.result === 'Pass') ? 'Pass' :
                         results.some(r => r.result === 'Fail') ? 'Fail' : 'Conditional';

    setTestExecutions(prev => prev.map(exec =>
      exec.id === executionId
        ? {
            ...exec,
            status: 'Completed',
            overallResult,
            results,
            completedAt: new Date()
          }
        : exec
    ));
  };

  const filteredExecutions = testExecutions.filter(exec => {
    const matchesStatus = filterStatus === 'all' || exec.status === filterStatus;
    const test = qualityTests.find(t => t.id === exec.testId);
    const matchesCategory = filterCategory === 'all' || test?.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Beaker className="w-5 h-5" />
              Quality Control & Testing Workflows
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Test
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Tests
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tests">Test Library</TabsTrigger>
          <TabsTrigger value="executions">Test Executions</TabsTrigger>
          <TabsTrigger value="batches">Batch QC</TabsTrigger>
          <TabsTrigger value="sensory">Sensory Panel</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* QC Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TestTube className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tests Today</p>
                    <p className="text-2xl font-bold">
                      {testExecutions.filter(e =>
                        e.executionDate.toDateString() === new Date().toDateString()
                      ).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tests Passed</p>
                    <p className="text-2xl font-bold">
                      {testExecutions.filter(e => e.overallResult === 'Pass').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Tests</p>
                    <p className="text-2xl font-bold">
                      {testExecutions.filter(e => e.status === 'In Progress' || e.status === 'Scheduled').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pass Rate</p>
                    <p className="text-2xl font-bold">
                      {Math.round((testExecutions.filter(e => e.overallResult === 'Pass').length /
                        testExecutions.filter(e => e.overallResult !== 'Pending').length) * 100) || 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Test Executions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testExecutions.slice(0, 5).map((execution) => {
                  const test = qualityTests.find(t => t.id === execution.testId);
                  return (
                    <div key={execution.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded">
                          {test && getCategoryIcon(test.category)}
                        </div>
                        <div>
                          <h4 className="font-medium">{test?.testName}</h4>
                          <p className="text-sm text-gray-600">Batch: {execution.batchId}</p>
                          <p className="text-xs text-gray-500">
                            Technician: {execution.technician} • {execution.executionDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(execution.status)}>
                          {execution.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getResultIcon(execution.overallResult)}
                          <span className={`text-sm font-medium ${getResultColor(execution.overallResult)}`}>
                            {execution.overallResult}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Batch Quality Status */}
          <Card>
            <CardHeader>
              <CardTitle>Batch Quality Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {qualityBatches.map((batch) => (
                  <div key={batch.batchId} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{batch.productName}</h4>
                      <p className="text-sm text-gray-600">Batch: {batch.batchId}</p>
                      <p className="text-xs text-gray-500">
                        Production: {batch.productionDate.toLocaleDateString()} •
                        QC Officer: {batch.qcOfficer}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{batch.testsCompleted}/{batch.testsRequired}</div>
                        <div className="text-xs text-gray-500">Tests</div>
                      </div>
                      <Badge className={
                        batch.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        batch.status === 'Testing' ? 'bg-blue-100 text-blue-800' :
                        batch.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {batch.status}
                      </Badge>
                      <Badge variant="outline" className={
                        batch.qualityGrade.startsWith('A') ? 'text-green-600' :
                        batch.qualityGrade.startsWith('B') ? 'text-blue-600' :
                        'text-orange-600'
                      }>
                        Grade {batch.qualityGrade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <div className="flex gap-4">
            <Input placeholder="Search tests..." className="flex-1" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Physical">Physical</SelectItem>
                <SelectItem value="Chemical">Chemical</SelectItem>
                <SelectItem value="Sensory">Sensory</SelectItem>
                <SelectItem value="Microbiological">Microbiological</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Packaging">Packaging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qualityTests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getCategoryIcon(test.category)}
                      {test.testName}
                    </span>
                    <Badge variant="outline">{test.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{test.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <Label className="text-gray-600">Duration</Label>
                        <p>{test.estimatedDuration} minutes</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Frequency</Label>
                        <p>{test.frequency}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Required Equipment</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {test.requiredEquipment.slice(0, 2).map((equipment, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {equipment}
                          </Badge>
                        ))}
                        {test.requiredEquipment.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{test.requiredEquipment.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Plus className="w-3 h-3 mr-1" />
                        Execute Test
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Physical">Physical</SelectItem>
                <SelectItem value="Chemical">Chemical</SelectItem>
                <SelectItem value="Sensory">Sensory</SelectItem>
                <SelectItem value="Microbiological">Microbiological</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Packaging">Packaging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Execution List */}
            <Card>
              <CardHeader>
                <CardTitle>Test Executions ({filteredExecutions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredExecutions.map((execution) => {
                    const test = qualityTests.find(t => t.id === execution.testId);
                    return (
                      <div
                        key={execution.id}
                        className={`p-3 border rounded cursor-pointer transition-all ${
                          selectedExecution?.id === execution.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedExecution(execution)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{test?.testName}</h4>
                            <p className="text-xs text-gray-600">Batch: {execution.batchId}</p>
                            <p className="text-xs text-gray-500">{execution.technician}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={getStatusColor(execution.status)} size="sm">
                              {execution.status}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getResultIcon(execution.overallResult)}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {execution.executionDate.toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Execution Details */}
            <div className="lg:col-span-2">
              {selectedExecution ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Test Execution Details</span>
                      <div className="flex gap-2">
                        {selectedExecution.status === 'In Progress' && (
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete Test
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="details">
                      <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="results">Results</TabsTrigger>
                        <TabsTrigger value="attachments">Attachments</TabsTrigger>
                      </TabsList>

                      <TabsContent value="details" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Test Name</Label>
                            <p className="text-sm">{qualityTests.find(t => t.id === selectedExecution.testId)?.testName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Batch ID</Label>
                            <p className="text-sm">{selectedExecution.batchId}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Technician</Label>
                            <p className="text-sm">{selectedExecution.technician}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Supervisor</Label>
                            <p className="text-sm">{selectedExecution.supervisor || 'Not assigned'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Execution Date</Label>
                            <p className="text-sm">{selectedExecution.executionDate.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <Badge className={getStatusColor(selectedExecution.status)}>
                              {selectedExecution.status}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Overall Result</Label>
                          <div className="flex items-center gap-2 mt-1">
                            {getResultIcon(selectedExecution.overallResult)}
                            <span className={`font-medium ${getResultColor(selectedExecution.overallResult)}`}>
                              {selectedExecution.overallResult}
                            </span>
                          </div>
                        </div>

                        {selectedExecution.notes && (
                          <div>
                            <Label className="text-sm font-medium">Notes</Label>
                            <p className="text-sm text-gray-600 mt-1">{selectedExecution.notes}</p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="results" className="space-y-4">
                        {selectedExecution.results.length > 0 ? (
                          <div className="space-y-3">
                            {selectedExecution.results.map((result, index) => (
                              <Card key={index}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-medium">{result.parameterName}</h4>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                                        <div>
                                          <Label className="text-gray-600">Expected</Label>
                                          <p>{result.expectedValue} {result.unit}</p>
                                        </div>
                                        <div>
                                          <Label className="text-gray-600">Actual</Label>
                                          <p>{result.actualValue} {result.unit}</p>
                                        </div>
                                        <div>
                                          <Label className="text-gray-600">Tolerance</Label>
                                          <p>{result.tolerance}</p>
                                        </div>
                                        <div>
                                          <Label className="text-gray-600">Method</Label>
                                          <p>{result.method}</p>
                                        </div>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-2">
                                        Measured by: {result.measuredBy} • {result.measuredAt.toLocaleString()}
                                      </div>
                                      {result.notes && (
                                        <p className="text-sm text-gray-600 mt-2">{result.notes}</p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {getResultIcon(result.result)}
                                      <span className={`font-medium ${getResultColor(result.result)}`}>
                                        {result.result}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No test results recorded yet</p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="attachments" className="space-y-4">
                        {selectedExecution.attachments.length > 0 ? (
                          <div className="space-y-2">
                            {selectedExecution.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm">{attachment}</span>
                                </div>
                                <Button size="sm" variant="outline">
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No attachments uploaded</p>
                            <Button size="sm" className="mt-2">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Files
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Select Test Execution</h3>
                    <p className="text-gray-500">Choose a test execution from the list to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <div className="space-y-4">
            {qualityBatches.map((batch) => (
              <Card key={batch.batchId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{batch.productName}</span>
                    <div className="flex gap-2">
                      <Badge className={
                        batch.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        batch.status === 'Testing' ? 'bg-blue-100 text-blue-800' :
                        batch.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {batch.status}
                      </Badge>
                      <Badge variant="outline">
                        Grade {batch.qualityGrade}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-sm text-gray-600">Batch ID</Label>
                      <p className="font-medium">{batch.batchId}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Production Date</Label>
                      <p className="font-medium">{batch.productionDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Batch Size</Label>
                      <p className="font-medium">{batch.batchSize} units</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">QC Officer</Label>
                      <p className="font-medium">{batch.qcOfficer}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">{batch.testsRequired}</div>
                      <div className="text-sm text-gray-600">Required</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-2xl font-bold text-yellow-600">{batch.testsCompleted}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">{batch.testsPassed}</div>
                      <div className="text-sm text-gray-600">Passed</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-2xl font-bold text-red-600">{batch.testsFailed}</div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {batch.approvalDate && (
                        <span>Approved: {batch.approvalDate.toLocaleDateString()}</span>
                      )}
                      {batch.releaseDate && (
                        <span className="ml-4">Released: {batch.releaseDate.toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Tests
                      </Button>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sensory" className="space-y-4">
          <Card>
            <CardContent className="text-center py-12">
              <Nose className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Sensory Evaluation Panel</h3>
              <p className="text-gray-500">Sensory evaluation interface will be implemented here</p>
              <p className="text-sm text-gray-400 mt-2">Panel management, attribute scoring, and statistical analysis</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Quality trend charts will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Test performance metrics will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityControlWorkflows;