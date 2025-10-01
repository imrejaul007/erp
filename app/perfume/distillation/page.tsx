'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  FlaskConical,
  Beaker,
  TestTube,
  Thermometer,
  Droplets,
  Clock,
  Timer,
  Flame,
  Wind,
  Scale,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  RotateCcw,
  Plus,
  Edit,
  Eye,
  Save,
  Download,
  Upload,
  RefreshCw,
  Settings,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  MapPin,
  Building,
  User,
  Award,
  Star,
  Crown,
  Diamond,
  Package,
  Layers,
  Activity,
  Zap,
  Sun,
  Moon,
  Cloud
} from 'lucide-react';

const DistillationPage = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isNewBatchDialogOpen, setIsNewBatchDialogOpen] = useState(false);
  const [isMonitoringDialogOpen, setIsMonitoringDialogOpen] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    temperature: 85,
    pressure: 1.2,
    flowRate: 2.5,
    steamLevel: 78
  });

  // Distillation batches data
  const distillationBatches = [
    {
      id: 'DIST-2024-001',
      batchName: 'Cambodian Supreme Collection A',
      woodSource: 'Cambodia - Pursat Province Grade A+',
      woodType: 'Aquilaria Crassna',
      woodWeight: 45,
      woodGrade: 'Super A+',
      startDate: '2024-01-15',
      expectedEndDate: '2024-02-05',
      actualEndDate: null,
      duration: 21,
      currentDay: 18,
      method: 'Traditional Steam Distillation',
      distiller: 'Master Ahmad Al-Attar',
      assistant: 'Khalid Rahman',
      expectedYield: '180-220ml',
      currentYield: 165,
      finalYield: null,
      yieldEfficiency: 85.7,
      status: 'in_progress',
      qualityGrade: 'TBD',
      currentStage: 'Third Distillation',
      conditions: {
        temperature: 85,
        targetTemp: '80-90°C',
        pressure: 1.2,
        steamFlow: 2.5,
        waterLevel: 78
      },
      stages: [
        { stage: 'Wood Preparation', duration: 2, status: 'completed', startDate: '2024-01-15', endDate: '2024-01-17', notes: 'Wood chopped and soaked perfectly' },
        { stage: 'First Distillation', duration: 6, status: 'completed', startDate: '2024-01-17', endDate: '2024-01-23', notes: 'Strong initial notes, excellent start' },
        { stage: 'Second Distillation', duration: 5, status: 'completed', startDate: '2024-01-23', endDate: '2024-01-28', notes: 'Sweetness developing, maintaining quality' },
        { stage: 'Third Distillation', duration: 4, status: 'in_progress', startDate: '2024-01-28', endDate: null, notes: 'Complex profile emerging' },
        { stage: 'Final Collection', duration: 2, status: 'pending', startDate: null, endDate: null, notes: 'Awaiting completion' },
        { stage: 'Quality Assessment', duration: 1, status: 'pending', startDate: null, endDate: null, notes: 'Final grading pending' }
      ],
      dailyLogs: [
        { day: 1, date: '2024-01-15', temp: 75, pressure: 1.0, yield: 0, notes: 'Setup complete, wood preparation started' },
        { day: 5, date: '2024-01-19', temp: 82, pressure: 1.1, yield: 15, notes: 'First oil appearance, strong barnyard notes' },
        { day: 10, date: '2024-01-24', temp: 85, pressure: 1.2, yield: 85, notes: 'Second phase excellent, honey sweetness emerging' },
        { day: 15, date: '2024-01-29', temp: 88, pressure: 1.3, yield: 135, notes: 'Complex development, maintaining consistency' },
        { day: 18, date: '2024-02-01', temp: 85, pressure: 1.2, yield: 165, notes: 'Third phase progressing well, deep woody notes' }
      ],
      equipment: {
        distillationVessel: 'Traditional Copper Deg #3',
        condensationSystem: 'Spiral Copper Condenser',
        steamGenerator: 'Wood-fired Boiler A',
        collectionVessels: 'Crystal Collection Bottles'
      },
      costs: {
        woodCost: 25000,
        laborCost: 8000,
        fuelCost: 1200,
        equipmentCost: 500,
        totalCost: 34700
      }
    },
    {
      id: 'DIST-2024-002',
      batchName: 'Hindi Assam Heritage B',
      woodSource: 'India - Assam Premium Grade',
      woodType: 'Aquilaria Malaccensis',
      woodWeight: 38,
      woodGrade: 'A+',
      startDate: '2024-02-01',
      expectedEndDate: '2024-02-25',
      actualEndDate: null,
      duration: 24,
      currentDay: 8,
      method: 'Clay Pot Hydro Distillation',
      distiller: 'Ustad Rahman Ali',
      assistant: 'Omar Farooq',
      expectedYield: '140-180ml',
      currentYield: 28,
      finalYield: null,
      yieldEfficiency: 35.2,
      status: 'in_progress',
      qualityGrade: 'TBD',
      currentStage: 'First Distillation',
      conditions: {
        temperature: 75,
        targetTemp: '70-80°C',
        pressure: 0.9,
        steamFlow: 1.8,
        waterLevel: 85
      },
      stages: [
        { stage: 'Wood Preparation', duration: 3, status: 'completed', startDate: '2024-02-01', endDate: '2024-02-04', notes: 'Assam wood properly aged and prepared' },
        { stage: 'First Distillation', duration: 8, status: 'in_progress', startDate: '2024-02-04', endDate: null, notes: 'Slow traditional method, building complexity' },
        { stage: 'Second Distillation', duration: 6, status: 'pending', startDate: null, endDate: null, notes: 'Awaiting first phase completion' },
        { stage: 'Third Distillation', duration: 4, status: 'pending', startDate: null, endDate: null, notes: 'Final refinement stage' },
        { stage: 'Final Collection', duration: 2, status: 'pending', startDate: null, endDate: null, notes: 'Collection and filtering' },
        { stage: 'Quality Assessment', duration: 1, status: 'pending', startDate: null, endDate: null, notes: 'Professional grading' }
      ],
      dailyLogs: [
        { day: 1, date: '2024-02-01', temp: 65, pressure: 0.8, yield: 0, notes: 'Clay pot setup, traditional method initialized' },
        { day: 4, date: '2024-02-04', temp: 72, pressure: 0.9, yield: 5, notes: 'First drops collected, typical Assam character' },
        { day: 8, date: '2024-02-08', temp: 75, pressure: 0.9, yield: 28, notes: 'Slow but steady progress, excellent quality indicators' }
      ],
      equipment: {
        distillationVessel: 'Traditional Clay Deg #2',
        condensationSystem: 'Bamboo Cooling System',
        steamGenerator: 'Clay Furnace B',
        collectionVessels: 'Traditional Copper Vessels'
      },
      costs: {
        woodCost: 18000,
        laborCost: 9600,
        fuelCost: 800,
        equipmentCost: 300,
        totalCost: 28700
      }
    },
    {
      id: 'DIST-2024-003',
      batchName: 'Burma Wild Experimental C',
      woodSource: 'Myanmar - Wild Forest Grade',
      woodType: 'Aquilaria Sinensis',
      woodWeight: 28,
      woodGrade: 'A',
      startDate: '2024-01-20',
      expectedEndDate: '2024-02-15',
      actualEndDate: '2024-02-12',
      duration: 23,
      currentDay: 23,
      method: 'Modern Vacuum Distillation',
      distiller: 'Technical Expert Sarah',
      assistant: 'Lab Assistant Jake',
      expectedYield: '90-120ml',
      currentYield: 0,
      finalYield: 108,
      yieldEfficiency: 96.4,
      status: 'completed',
      qualityGrade: 'A+',
      currentStage: 'Completed',
      conditions: {
        temperature: 65,
        targetTemp: '60-70°C',
        pressure: 0.5,
        steamFlow: 1.2,
        waterLevel: 0
      },
      stages: [
        { stage: 'Wood Preparation', duration: 2, status: 'completed', startDate: '2024-01-20', endDate: '2024-01-22', notes: 'Wild wood properly processed' },
        { stage: 'Vacuum Distillation Phase 1', duration: 8, status: 'completed', startDate: '2024-01-22', endDate: '2024-01-30', notes: 'Low temperature extraction successful' },
        { stage: 'Vacuum Distillation Phase 2', duration: 7, status: 'completed', startDate: '2024-01-30', endDate: '2024-02-06', notes: 'Maintaining wild character perfectly' },
        { stage: 'Final Collection', duration: 4, status: 'completed', startDate: '2024-02-06', endDate: '2024-02-10', notes: 'Excellent yield achieved' },
        { stage: 'Quality Assessment', duration: 2, status: 'completed', startDate: '2024-02-10', endDate: '2024-02-12', notes: 'Graded A+ premium quality' }
      ],
      dailyLogs: [
        { day: 23, date: '2024-02-12', temp: 65, pressure: 0.5, yield: 108, notes: 'Final collection completed, exceptional quality achieved' }
      ],
      equipment: {
        distillationVessel: 'Modern Vacuum Chamber #1',
        condensationSystem: 'Advanced Condenser Unit',
        steamGenerator: 'Electric Steam Unit',
        collectionVessels: 'Laboratory Grade Glassware'
      },
      costs: {
        woodCost: 12000,
        laborCost: 11500,
        fuelCost: 2000,
        equipmentCost: 1500,
        totalCost: 27000
      }
    }
  ];

  // Distillation methods
  const distillationMethods = [
    {
      id: 'steam',
      name: 'Traditional Steam Distillation',
      description: 'Classic method using wood-fired steam generation',
      tempRange: '80-90°C',
      duration: '15-25 days',
      yieldEfficiency: '85-95%',
      qualityGrade: 'Excellent',
      bestFor: ['Cambodian Oud', 'Malaysian Oud', 'Premium Collections'],
      equipment: ['Copper Deg', 'Steam Generator', 'Spiral Condenser'],
      advantages: ['Traditional authenticity', 'High yield', 'Complex development'],
      disadvantages: ['Higher fuel cost', 'Requires skilled operator', 'Weather dependent']
    },
    {
      id: 'hydro',
      name: 'Clay Pot Hydro Distillation',
      description: 'Ancient technique using clay vessels and water',
      tempRange: '70-80°C',
      duration: '20-30 days',
      yieldEfficiency: '75-85%',
      qualityGrade: 'Superior',
      bestFor: ['Hindi Assam', 'Vintage Wood', 'Heritage Collections'],
      equipment: ['Clay Deg', 'Bamboo Condenser', 'Clay Furnace'],
      advantages: ['Superior quality', 'Historical authenticity', 'Unique character'],
      disadvantages: ['Lower yield', 'Longer duration', 'Skilled craftsman required']
    },
    {
      id: 'vacuum',
      name: 'Modern Vacuum Distillation',
      description: 'Low-temperature vacuum extraction method',
      tempRange: '60-70°C',
      duration: '18-25 days',
      yieldEfficiency: '90-98%',
      qualityGrade: 'Excellent',
      bestFor: ['Delicate Woods', 'Experimental Batches', 'Modern Production'],
      equipment: ['Vacuum Chamber', 'Electric Heating', 'Advanced Condenser'],
      advantages: ['Precise control', 'Preserves delicate notes', 'High efficiency'],
      disadvantages: ['Modern method', 'Higher setup cost', 'Requires technical expertise']
    },
    {
      id: 'copper',
      name: 'Copper Vessel Traditional',
      description: 'Traditional method using copper vessels',
      tempRange: '75-85°C',
      duration: '12-20 days',
      yieldEfficiency: '80-90%',
      qualityGrade: 'Good to Excellent',
      bestFor: ['Commercial Production', 'Consistent Quality', 'Volume Production'],
      equipment: ['Copper Vessel', 'Steam Unit', 'Copper Condenser'],
      advantages: ['Fast production', 'Consistent results', 'Commercial viability'],
      disadvantages: ['Less traditional', 'May lack complexity', 'Copper taste possible']
    }
  ];

  // Master distillers
  const masterDistillers = [
    {
      id: 'ahmad',
      name: 'Master Ahmad Al-Attar',
      title: 'Traditional Oud Master',
      experience: '35 years',
      specialization: 'Cambodian & Malaysian Oud',
      certifications: ['UNESCO Heritage Craftsman', 'Master Distiller Guild'],
      signature: 'Royal Cambodian Collection',
      currentBatches: 1,
      completedBatches: 127,
      averageGrade: 'A+',
      expertise: ['Steam Distillation', 'Quality Assessment', 'Wood Selection']
    },
    {
      id: 'rahman',
      name: 'Ustad Rahman Ali',
      title: 'Heritage Distillation Expert',
      experience: '42 years',
      specialization: 'Hindi Assam Traditional Methods',
      certifications: ['Cultural Heritage Keeper', 'Traditional Craft Master'],
      signature: 'Vintage Hindi Collection',
      currentBatches: 1,
      completedBatches: 89,
      averageGrade: 'Super A+',
      expertise: ['Clay Pot Method', 'Hydro Distillation', 'Ancient Techniques']
    },
    {
      id: 'sarah',
      name: 'Technical Expert Sarah Mitchell',
      title: 'Modern Distillation Specialist',
      experience: '18 years',
      specialization: 'Modern Vacuum & Scientific Methods',
      certifications: ['Chemical Engineering PhD', 'Modern Distillation Expert'],
      signature: 'Precision Extraction Series',
      currentBatches: 1,
      completedBatches: 156,
      averageGrade: 'A+',
      expertise: ['Vacuum Distillation', 'Scientific Analysis', 'Process Optimization']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'Super A+': return 'bg-purple-100 text-purple-800';
      case 'A+': return 'bg-blue-100 text-blue-800';
      case 'A': return 'bg-green-100 text-green-800';
      case 'B+': return 'bg-yellow-100 text-yellow-800';
      case 'TBD': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageProgress = (batch) => {
    const completedStages = batch.stages.filter(s => s.status === 'completed').length;
    return (completedStages / batch.stages.length) * 100;
  };

  const getDayProgress = (batch) => {
    if (batch.status === 'completed') return 100;
    return (batch.currentDay / batch.duration) * 100;
  };

  const getCurrentStageInfo = (batch) => {
    return batch.stages.find(s => s.status === 'in_progress') || batch.stages[0];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Distillation Tracking & Monitoring</h1>
          <p className="text-gray-600">Traditional and modern distillation process management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Real-time Sync
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Dialog open={isNewBatchDialogOpen} onOpenChange={setIsNewBatchDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Start New Distillation Batch</DialogTitle>
                <DialogDescription>
                  Configure a new traditional or modern distillation process
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchName">Batch Name</Label>
                  <Input id="batchName" placeholder="Enter batch identifier" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="woodSource">Wood Source</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wood origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cambodia_a">Cambodia - Grade A+ Aquilaria Crassna</SelectItem>
                      <SelectItem value="india_assam">India - Assam Premium Malaccensis</SelectItem>
                      <SelectItem value="myanmar_wild">Myanmar - Wild Forest Sinensis</SelectItem>
                      <SelectItem value="laos_cultivated">Laos - Cultivated Grade A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="woodWeight">Wood Weight (kg)</Label>
                  <Input id="woodWeight" type="number" placeholder="Enter wood weight" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="woodGrade">Wood Grade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_a">Super A+</SelectItem>
                      <SelectItem value="a_plus">A+</SelectItem>
                      <SelectItem value="a">A</SelectItem>
                      <SelectItem value="b_plus">B+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Distillation Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {distillationMethods.map(method => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distiller">Master Distiller</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select distiller" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterDistillers.map(distiller => (
                        <SelectItem key={distiller.id} value={distiller.id}>
                          {distiller.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedYield">Expected Yield (ml)</Label>
                  <Input id="expectedYield" placeholder="Estimated output range" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input id="duration" type="number" placeholder="Estimated duration" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Initial Setup Notes</Label>
                  <Textarea id="notes" placeholder="Wood preparation, setup details, initial observations..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewBatchDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewBatchDialogOpen(false)}>
                  <FlaskConical className="h-4 w-4 mr-2" />
                  Start Distillation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Batches</p>
                <p className="text-2xl font-bold">{distillationBatches.filter(b => b.status === 'in_progress').length}</p>
                <p className="text-xs text-blue-600">Currently distilling</p>
              </div>
              <FlaskConical className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Yield</p>
                <p className="text-2xl font-bold">273ml</p>
                <p className="text-xs text-green-600">This month</p>
              </div>
              <Droplets className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
                <p className="text-2xl font-bold">89.1%</p>
                <p className="text-xs text-purple-600">Yield vs expected</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quality Grade</p>
                <p className="text-2xl font-bold">A+</p>
                <p className="text-xs text-yellow-600">Average output</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="batches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="batches">Active Batches</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitor</TabsTrigger>
          <TabsTrigger value="methods">Methods</TabsTrigger>
          <TabsTrigger value="distillers">Master Distillers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Batches Tab */}
        <TabsContent value="batches" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {distillationBatches.map((batch) => {
              const stageProgress = getStageProgress(batch);
              const dayProgress = getDayProgress(batch);
              const currentStage = getCurrentStageInfo(batch);

              return (
                <Card key={batch.id} className={batch.status === 'in_progress' ? 'border-blue-200 bg-blue-50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{batch.batchName}</CardTitle>
                        <p className="text-sm text-gray-500">{batch.woodSource}</p>
                        <p className="text-xs text-gray-500">{batch.id}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status.replace('_', ' ')}
                        </Badge>
                        {batch.qualityGrade !== 'TBD' && (
                          <Badge className={`${getGradeColor(batch.qualityGrade)} mt-1`}>
                            {batch.qualityGrade}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Indicators */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Time Progress</span>
                          <span>{batch.currentDay}/{batch.duration} days ({dayProgress.toFixed(0)}%)</span>
                        </div>
                        <Progress value={dayProgress} className="h-2" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Stage Progress</span>
                          <span>{batch.stages.filter(s => s.status === 'completed').length}/{batch.stages.length} stages</span>
                        </div>
                        <Progress value={stageProgress} className="h-2" />
                      </div>
                    </div>

                    {/* Current Stage */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">Current Stage: {batch.currentStage}</div>
                      <div className="text-sm text-gray-600">{currentStage?.notes || 'In progress'}</div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Wood Weight:</span>
                        <span className="ml-1 font-medium">{batch.woodWeight}kg</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Method:</span>
                        <span className="ml-1 font-medium">{batch.method}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Distiller:</span>
                        <span className="ml-1 font-medium">{batch.distiller}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Expected Yield:</span>
                        <span className="ml-1 font-medium">{batch.expectedYield}</span>
                      </div>
                    </div>

                    {/* Current Conditions (for active batches) */}
                    {batch.status === 'in_progress' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 bg-red-50 rounded">
                          <Thermometer className="h-4 w-4 mx-auto mb-1 text-red-600" />
                          <div className="text-xs font-medium">{batch.conditions.temperature}°C</div>
                          <div className="text-xs text-gray-500">Temp</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                          <div className="text-xs font-medium">{batch.conditions.pressure} bar</div>
                          <div className="text-xs text-gray-500">Pressure</div>
                        </div>
                      </div>
                    )}

                    {/* Yield Information */}
                    {batch.status === 'completed' ? (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="font-medium text-sm text-green-800">
                          Final Yield: {batch.finalYield}ml ({batch.yieldEfficiency}% efficiency)
                        </div>
                        <div className="text-sm text-green-600">
                          Quality Grade: {batch.qualityGrade}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium text-sm text-blue-800">
                          Current Yield: {batch.currentYield}ml
                        </div>
                        <div className="text-sm text-blue-600">
                          Efficiency: {batch.yieldEfficiency}%
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      {batch.status === 'in_progress' && (
                        <Button variant="outline" size="sm">
                          <Activity className="h-4 w-4 mr-1" />
                          Monitor
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Real-time Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Monitoring
                </CardTitle>
                <CardDescription>Live conditions for active distillation batches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {distillationBatches.filter(b => b.status === 'in_progress').map(batch => (
                    <div key={batch.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{batch.batchName}</h4>
                        <Badge variant="outline">{batch.currentStage}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-red-500" />
                            <span className="text-sm">Temperature</span>
                          </div>
                          <div className="text-2xl font-bold">{batch.conditions.temperature}°C</div>
                          <div className="text-sm text-gray-500">Target: {batch.conditions.targetTemp}</div>
                          <Progress value={(batch.conditions.temperature / 100) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Pressure</span>
                          </div>
                          <div className="text-2xl font-bold">{batch.conditions.pressure} bar</div>
                          <div className="text-sm text-gray-500">Normal range</div>
                          <Progress value={(batch.conditions.pressure / 2) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Steam Flow</span>
                          </div>
                          <div className="text-2xl font-bold">{batch.conditions.steamFlow} L/min</div>
                          <div className="text-sm text-gray-500">Optimal flow</div>
                          <Progress value={(batch.conditions.steamFlow / 5) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Water Level</span>
                          </div>
                          <div className="text-2xl font-bold">{batch.conditions.waterLevel}%</div>
                          <div className="text-sm text-gray-500">Tank capacity</div>
                          <Progress value={batch.conditions.waterLevel} className="h-2" />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Adjust
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export Data
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Control Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Distillation Control Panel</CardTitle>
                <CardDescription>Manual controls and automation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Temperature Control */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Temperature Control</Label>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target Temperature</span>
                      <span>85°C</span>
                    </div>
                    <Slider defaultValue={[85]} max={100} step={1} className="w-full" />
                  </div>
                </div>

                {/* Pressure Control */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Pressure Control</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target Pressure</span>
                      <span>1.2 bar</span>
                    </div>
                    <Slider defaultValue={[1.2]} max={2} step={0.1} className="w-full" />
                  </div>
                </div>

                {/* Steam Flow Control */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Steam Flow Rate</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Flow Rate</span>
                      <span>2.5 L/min</span>
                    </div>
                    <Slider defaultValue={[2.5]} max={5} step={0.1} className="w-full" />
                  </div>
                </div>

                {/* Safety Controls */}
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Emergency Controls</h4>
                  <div className="flex gap-2">
                    <Button variant="destructive" size="sm">
                      <Pause className="h-4 w-4 mr-1" />
                      Emergency Stop
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Alert Team
                    </Button>
                  </div>
                </div>

                {/* Automation Settings */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Automation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Auto Temperature Control</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pressure Safety Cutoff</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Yield Collection Alert</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert System */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts & Notifications</CardTitle>
              <CardDescription>Real-time alerts and monitoring notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Temperature Stable</div>
                    <div className="text-sm text-gray-600">
                      Cambodian Supreme Collection A maintaining optimal temperature
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">2 min ago</div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">Collection Phase Started</div>
                    <div className="text-sm text-gray-600">
                      Hindi Assam Heritage B entering collection phase
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">15 min ago</div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <div className="font-medium">Water Level Low</div>
                    <div className="text-sm text-gray-600">
                      Steam generator water level below 20% - refill required
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">1 hour ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Methods Tab */}
        <TabsContent value="methods" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {distillationMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{method.name}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Method Specifications */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Temperature:</span>
                      <div className="text-gray-600">{method.tempRange}</div>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <div className="text-gray-600">{method.duration}</div>
                    </div>
                    <div>
                      <span className="font-medium">Efficiency:</span>
                      <div className="text-gray-600">{method.yieldEfficiency}</div>
                    </div>
                    <div>
                      <span className="font-medium">Quality:</span>
                      <div className="text-gray-600">{method.qualityGrade}</div>
                    </div>
                  </div>

                  {/* Best For */}
                  <div>
                    <div className="font-medium text-sm mb-2">Best For:</div>
                    <div className="flex flex-wrap gap-1">
                      {method.bestFor.map((item, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Equipment */}
                  <div>
                    <div className="font-medium text-sm mb-2">Required Equipment:</div>
                    <div className="flex flex-wrap gap-1">
                      {method.equipment.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Advantages & Disadvantages */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="font-medium text-sm mb-2 text-green-700">Advantages:</div>
                      <ul className="text-sm space-y-1">
                        {method.advantages.map((advantage, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-medium text-sm mb-2 text-orange-700">Considerations:</div>
                      <ul className="text-sm space-y-1">
                        {method.disadvantages.map((disadvantage, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            {disadvantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Master Distillers Tab */}
        <TabsContent value="distillers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {masterDistillers.map((distiller) => (
              <Card key={distiller.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{distiller.name}</CardTitle>
                      <p className="text-sm text-gray-500">{distiller.title}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Experience & Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Experience:</span>
                      <div className="text-gray-600">{distiller.experience}</div>
                    </div>
                    <div>
                      <span className="font-medium">Avg Grade:</span>
                      <div className="text-gray-600">{distiller.averageGrade}</div>
                    </div>
                    <div>
                      <span className="font-medium">Current:</span>
                      <div className="text-gray-600">{distiller.currentBatches} batches</div>
                    </div>
                    <div>
                      <span className="font-medium">Completed:</span>
                      <div className="text-gray-600">{distiller.completedBatches} batches</div>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <div className="font-medium text-sm mb-1">Specialization:</div>
                    <p className="text-sm text-gray-600">{distiller.specialization}</p>
                  </div>

                  {/* Expertise */}
                  <div>
                    <div className="font-medium text-sm mb-2">Expertise:</div>
                    <div className="flex flex-wrap gap-1">
                      {distiller.expertise.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <div className="font-medium text-sm mb-2">Certifications:</div>
                    {distiller.certifications.map((cert, idx) => (
                      <div key={idx} className="text-xs text-blue-600">{cert}</div>
                    ))}
                  </div>

                  {/* Signature Work */}
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="font-medium text-sm text-amber-800">Signature Collection</div>
                    <div className="text-sm text-amber-600">{distiller.signature}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Performance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Production Analytics</CardTitle>
                <CardDescription>Performance metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-bold text-blue-600">89.1%</div>
                      <div className="text-sm text-blue-600">Avg Efficiency</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-600">21.5</div>
                      <div className="text-sm text-green-600">Avg Duration (days)</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quality Distribution:</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Super A+</span>
                        <span>0 batches</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>A+</span>
                        <span>2 batches</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>A</span>
                        <span>1 batch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Financial performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-bold text-purple-600">AED 90,400</div>
                      <div className="text-sm text-purple-600">Total Investment</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-600">AED 331/ml</div>
                      <div className="text-sm text-green-600">Cost per ml</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Wood Costs:</span>
                      <span>AED 55,000 (61%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Labor Costs:</span>
                      <span>AED 29,100 (32%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Equipment:</span>
                      <span>AED 2,300 (3%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fuel/Energy:</span>
                      <span>AED 4,000 (4%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Reports & Export</CardTitle>
              <CardDescription>Generate detailed reports and analytics</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Batch Reports
              </Button>
              <Button variant="outline" className="justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics Export
              </Button>
              <Button variant="outline" className="justify-start">
                <LineChart className="h-4 w-4 mr-2" />
                Trend Analysis
              </Button>
              <Button variant="outline" className="justify-start">
                <PieChart className="h-4 w-4 mr-2" />
                Cost Breakdown
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistillationPage;