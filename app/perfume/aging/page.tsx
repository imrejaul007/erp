'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  Clock,
  Timer,
  Thermometer,
  Droplets,
  Wind,
  Building,
  MapPin,
  Award,
  Star,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Eye,
  Save,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Calendar as CalendarIcon,
  BarChart3,
  LineChart,
  Target,
  Settings,
  Archive,
  History,
  TestTube,
  Beaker,
  FlaskConical,
  Crown,
  FileText,
  Diamond,
  Layers,
  Package,
  Warehouse,
  Mountain,
  TreePine,
  Leaf,
  Sun,
  Moon,
  Cloud,
  Zap,
  ArrowLeft} from 'lucide-react';

const AgingProgramPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isNewProgramDialogOpen, setIsNewProgramDialogOpen] = useState(false);
  const [isQualityCheckDialogOpen, setIsQualityCheckDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agingPrograms, setAgingPrograms] = useState<any[]>([]);
  const [agingStats, setAgingStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch aging batches and stats from backend
  useEffect(() => {
    const fetchAgingData = async () => {
      try {
        setLoading(true);
        const [batchesRes, statsRes] = await Promise.all([
          fetch('/api/aging'),
          fetch('/api/aging/stats')
        ]);

        if (batchesRes.ok && statsRes.ok) {
          const batchesData = await batchesRes.json();
          const statsData = await statsRes.json();

          const programs = (batchesData.batches || []).map((b: any) => {
            const startDate = new Date(b.startDate);
            const today = new Date();
            const daysAging = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const currentAge = Math.floor(daysAging / 365);

            return {
              id: b.batchNumber || b.id,
              productName: b.product?.name || 'Unknown',
              arabicName: b.product?.nameArabic || b.product?.name || 'Unknown',
              batchId: b.batchNumber,
              startDate: b.startDate,
              currentAge,
              targetAge: Math.floor((b.targetDuration || 0) / 365),
              agingMethod: b.containerType || 'Traditional',
              location: b.location || 'Unknown',
              container: b.containerNumber || 'N/A',
              volume: `${b.quantity || 0} units`,
              initialGrade: b.qualityBefore || 'N/A',
              currentGrade: b.qualityAfter || b.qualityBefore || 'N/A',
              status: b.status?.toLowerCase() || 'active',
              nextCheck: b.expectedReadyDate,
              conditions: {
                temperature: 20,
                targetTemp: '18-22°C',
                humidity: 60,
                targetHumidity: '55-65%',
                airFlow: 'Controlled',
                lighting: 'None'
              },
              qualityChecks: [],
              milestones: []
            };
          });

          setAgingPrograms(programs);
          setAgingStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching aging data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgingData();
  }, []);

  // Fallback aging programs data
  const mockAgingPrograms = [
    {
      id: 'AGE-001',
      productName: 'Royal Cambodian Oud',
      arabicName: 'عود كمبودي ملكي',
      batchId: 'CAM-2009-A15',
      startDate: '2012-04-20',
      currentAge: 12,
      targetAge: 20,
      agingMethod: 'Underground Cellar',
      location: 'Climate Controlled Vault A',
      container: 'Traditional Clay Pot #15',
      volume: '2.5 tola',
      initialGrade: 'A+',
      currentGrade: 'Super A+',
      conditions: {
        temperature: 19,
        targetTemp: '18-22°C',
        humidity: 62,
        targetHumidity: '60-65%',
        airFlow: 'Minimal',
        lighting: 'None'
      },
      qualityChecks: [
        { date: '2022-04-20', grade: 'A+', score: 90, notes: '10-year mark - Excellent development', inspector: 'Master Hassan' },
        { date: '2023-04-20', grade: 'Super A+', score: 96, notes: '11-year mark - Outstanding complexity', inspector: 'Master Hassan' },
        { date: '2024-01-15', grade: 'Super A+', score: 97, notes: '12-year mark - Premium quality maintained', inspector: 'Senior Khalid' }
      ],
      nextCheck: '2024-04-20',
      status: 'active',
      milestones: [
        { age: 5, achieved: true, grade: 'A', date: '2017-04-20' },
        { age: 10, achieved: true, grade: 'A+', date: '2022-04-20' },
        { age: 15, achieved: false, targetGrade: 'Super A+', targetDate: '2027-04-20' },
        { age: 20, achieved: false, targetGrade: 'Museum Quality', targetDate: '2032-04-20' }
      ]
    },
    {
      id: 'AGE-002',
      productName: 'Hindi Assam Vintage',
      arabicName: 'عود آسام هندي قديم',
      batchId: 'IND-1999-V25',
      startDate: '1999-11-15',
      currentAge: 25,
      targetAge: 30,
      agingMethod: 'Natural Cave Aging',
      location: 'Heritage Cave B-7',
      container: 'Aged Oak Barrel #3',
      volume: '1.8 tola',
      initialGrade: 'A',
      currentGrade: 'A+',
      conditions: {
        temperature: 18,
        targetTemp: '16-20°C',
        humidity: 58,
        targetHumidity: '55-60%',
        airFlow: 'Natural',
        lighting: 'None'
      },
      qualityChecks: [
        { date: '2019-11-15', grade: 'A+', score: 89, notes: '20-year mark - Magnificent transformation', inspector: 'Master Omar' },
        { date: '2022-11-15', grade: 'A+', score: 92, notes: '23-year mark - Legendary status achieved', inspector: 'Master Omar' },
        { date: '2024-01-15', grade: 'A+', score: 94, notes: '25-year mark - Museum quality specimen', inspector: 'Master Hassan' }
      ],
      nextCheck: '2024-11-15',
      status: 'active',
      milestones: [
        { age: 10, achieved: true, grade: 'A', date: '2009-11-15' },
        { age: 20, achieved: true, grade: 'A+', date: '2019-11-15' },
        { age: 25, achieved: true, grade: 'A+', date: '2024-01-15' },
        { age: 30, achieved: false, targetGrade: 'Super A+', targetDate: '2029-11-15' }
      ]
    },
    {
      id: 'AGE-003',
      productName: 'Taif Rose Superior',
      arabicName: 'ورد طائفي فاخر',
      batchId: 'TAF-2019-S3',
      startDate: '2019-05-01',
      currentAge: 5,
      targetAge: 10,
      agingMethod: 'Climate Controlled Vault',
      location: 'Temperature Controlled Room C',
      container: 'Crystal Glass Bottle #22',
      volume: '3.2 tola',
      initialGrade: 'A',
      currentGrade: 'A+',
      conditions: {
        temperature: 22,
        targetTemp: '20-24°C',
        humidity: 52,
        targetHumidity: '50-55%',
        airFlow: 'Controlled',
        lighting: 'UV Protected'
      },
      qualityChecks: [
        { date: '2021-05-01', grade: 'A', score: 85, notes: '2-year mark - Good development', inspector: 'Master Fatima' },
        { date: '2023-05-01', grade: 'A+', score: 88, notes: '4-year mark - Excellent floral complexity', inspector: 'Master Fatima' },
        { date: '2024-01-15', grade: 'A+', score: 89, notes: '5-year mark - Outstanding rose characteristics', inspector: 'Senior Aisha' }
      ],
      nextCheck: '2024-05-01',
      status: 'active',
      milestones: [
        { age: 2, achieved: true, grade: 'A', date: '2021-05-01' },
        { age: 5, achieved: true, grade: 'A+', date: '2024-01-15' },
        { age: 10, achieved: false, targetGrade: 'Super A+', targetDate: '2029-05-01' }
      ]
    },
    {
      id: 'AGE-004',
      productName: 'Burma Wild Oud',
      arabicName: 'عود بورمي بري',
      batchId: 'MYN-2018-W6',
      startDate: '2018-09-10',
      currentAge: 6,
      targetAge: 15,
      agingMethod: 'Traditional Buried Aging',
      location: 'Underground Burial Site D',
      container: 'Sealed Clay Urn #8',
      volume: '1.5 tola',
      initialGrade: 'B+',
      currentGrade: 'A',
      conditions: {
        temperature: 16,
        targetTemp: '15-18°C',
        humidity: 68,
        targetHumidity: '65-70%',
        airFlow: 'None',
        lighting: 'None'
      },
      qualityChecks: [
        { date: '2021-09-10', grade: 'A', score: 82, notes: '3-year mark - Significant improvement', inspector: 'Master Omar' },
        { date: '2023-09-10', grade: 'A', score: 86, notes: '5-year mark - Wild character developing', inspector: 'Senior Khalid' }
      ],
      nextCheck: '2024-09-10',
      status: 'active',
      milestones: [
        { age: 3, achieved: true, grade: 'A', date: '2021-09-10' },
        { age: 5, achieved: true, grade: 'A', date: '2023-09-10' },
        { age: 10, achieved: false, targetGrade: 'A+', targetDate: '2028-09-10' },
        { age: 15, achieved: false, targetGrade: 'Super A+', targetDate: '2033-09-10' }
      ]
    }
  ];

  // Use real data if available, otherwise fallback to mock
  const displayPrograms = agingPrograms.length > 0 ? agingPrograms : mockAgingPrograms;

  // Aging facilities
  const agingFacilities = [
    {
      id: 'FAC-001',
      name: 'Climate Controlled Vault A',
      type: 'Underground Cellar',
      capacity: 50,
      currentOccupancy: 12,
      conditions: { temp: '18-22°C', humidity: '60-65%', airflow: 'Minimal' },
      status: 'operational',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10'
    },
    {
      id: 'FAC-002',
      name: 'Heritage Cave B-7',
      type: 'Natural Cave',
      capacity: 25,
      currentOccupancy: 8,
      conditions: { temp: '16-20°C', humidity: '55-60%', airflow: 'Natural' },
      status: 'operational',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-07-05'
    },
    {
      id: 'FAC-003',
      name: 'Temperature Controlled Room C',
      type: 'Modern Vault',
      capacity: 100,
      currentOccupancy: 35,
      conditions: { temp: '20-24°C', humidity: '50-55%', airflow: 'Controlled' },
      status: 'operational',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15'
    },
    {
      id: 'FAC-004',
      name: 'Underground Burial Site D',
      type: 'Traditional Buried',
      capacity: 30,
      currentOccupancy: 15,
      conditions: { temp: '15-18°C', humidity: '65-70%', airflow: 'None' },
      status: 'operational',
      lastMaintenance: '2023-12-20',
      nextMaintenance: '2024-06-20'
    }
  ];

  // Aging methods
  const agingMethods = [
    {
      method: 'Underground Cellar',
      description: 'Climate-controlled underground storage with minimal air circulation',
      optimalTemp: '18-22°C',
      optimalHumidity: '60-65%',
      bestFor: ['Cambodian Oud', 'Malaysian Oud', 'Premium Collections'],
      duration: '5-20 years',
      containers: ['Clay Pots', 'Glass Bottles'],
      advantages: ['Stable conditions', 'Excellent for long-term aging', 'Traditional method']
    },
    {
      method: 'Natural Cave Aging',
      description: 'Traditional aging in natural limestone caves with constant temperature',
      optimalTemp: '16-20°C',
      optimalHumidity: '55-60%',
      bestFor: ['Hindi Assam', 'Vintage Collections', 'Rare Specimens'],
      duration: '10-30 years',
      containers: ['Oak Barrels', 'Stone Vessels', 'Clay Urns'],
      advantages: ['Natural environment', 'Unique mineral interactions', 'Heritage method']
    },
    {
      method: 'Climate Controlled Vault',
      description: 'Modern facility with precise temperature and humidity control',
      optimalTemp: '20-24°C',
      optimalHumidity: '50-55%',
      bestFor: ['Floral Attars', 'Blended Oils', 'Sensitive Products'],
      duration: '3-15 years',
      containers: ['Glass Bottles', 'Crystal Containers'],
      advantages: ['Precise control', 'Consistent conditions', 'Monitoring systems']
    },
    {
      method: 'Traditional Buried Aging',
      description: 'Ancient technique of underground burial in sealed containers',
      optimalTemp: '15-18°C',
      optimalHumidity: '65-70%',
      bestFor: ['Wild Oud', 'Raw Materials', 'Experimental Batches'],
      duration: '15-50 years',
      containers: ['Sealed Clay Urns', 'Ceramic Vessels'],
      advantages: ['Earth interaction', 'Extreme long-term aging', 'Historical authenticity']
    }
  ];

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'Super A+': return 'bg-purple-100 text-purple-800';
      case 'A+': return 'bg-blue-100 text-blue-800';
      case 'A': return 'bg-green-100 text-green-800';
      case 'B+': return 'bg-yellow-100 text-yellow-800';
      case 'B': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeIcon = (grade) => {
    switch (grade) {
      case 'Super A+': return <Crown className="h-4 w-4" />;
      case 'A+': return <Diamond className="h-4 w-4" />;
      case 'A': return <Star className="h-4 w-4" />;
      case 'B+': return <Award className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'transferred': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (currentAge, targetAge) => {
    return Math.min((currentAge / targetAge) * 100, 100);
  };

  const getNextMilestone = (program) => {
    return program.milestones.find(m => !m.achieved);
  };

  const isCheckDue = (nextCheckDate) => {
    const today = new Date();
    const checkDate = new Date(nextCheckDate);
    const daysUntil = Math.ceil((checkDate - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30;
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Aging Program Management</h1>
          <p className="text-gray-600">Long-term quality development and maturation tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Sensors
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isNewProgramDialogOpen} onOpenChange={setIsNewProgramDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Aging Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Start New Aging Program</DialogTitle>
                <DialogDescription>
                  Configure long-term aging and maturation program
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input id="productName" placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Input id="batchId" placeholder="Batch identifier" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume</Label>
                  <Input id="volume" placeholder="Volume in tola" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAge">Target Age (years)</Label>
                  <Input id="targetAge" type="number" placeholder="Target aging period" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agingMethod">Aging Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {agingMethods.map(method => (
                        <SelectItem key={method.method} value={method.method}>
                          {method.method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facility">Aging Facility</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      {agingFacilities.filter(f => f.currentOccupancy < f.capacity).map(facility => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name} ({facility.currentOccupancy}/{facility.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="initialNotes">Initial Assessment Notes</Label>
                  <Textarea id="initialNotes" placeholder="Initial quality assessment and aging goals..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewProgramDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewProgramDialogOpen(false)}>
                  Start Program
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-xl sm:text-2xl font-bold">{agingPrograms.filter(p => p.status === 'active').length}</p>
                <p className="text-xs text-green-600">Currently aging</p>
              </div>
              <Timer className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Age</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {Math.round(agingPrograms.reduce((acc, p) => acc + p.currentAge, 0) / agingPrograms.length)}
                </p>
                <p className="text-xs text-purple-600">years</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quality Checks Due</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {agingPrograms.filter(p => isCheckDue(p.nextCheck)).length}
                </p>
                <p className="text-xs text-orange-600">Within 30 days</p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium Grade</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {agingPrograms.filter(p => p.currentGrade === 'Super A+' || p.currentGrade === 'A+').length}
                </p>
                <p className="text-xs text-yellow-600">A+ and above</p>
              </div>
              <Crown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="programs" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="programs">Active Programs</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="methods">Aging Methods</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {agingPrograms.map((program) => {
              const progress = calculateProgress(program.currentAge, program.targetAge);
              const nextMilestone = getNextMilestone(program);
              const isCheckOverdue = isCheckDue(program.nextCheck);

              return (
                <Card key={program.id} className={isCheckOverdue ? 'border-orange-200 bg-orange-50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{program.productName}</CardTitle>
                        <p className="text-sm text-gray-500">{program.arabicName}</p>
                        <p className="text-xs text-gray-500">{program.batchId}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getGradeColor(program.currentGrade)}>
                          {getGradeIcon(program.currentGrade)}
                          {program.currentGrade}
                        </Badge>
                        <div className="text-sm font-medium mt-1">{program.currentAge} years</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Aging Progress</span>
                        <span>{program.currentAge}/{program.targetAge} years ({progress.toFixed(0)}%)</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Conditions */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <Thermometer className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                        <div className="text-xs font-medium">{program.conditions.temperature}°C</div>
                        <div className="text-xs text-gray-500">Temp</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <Droplets className="h-4 w-4 mx-auto mb-1 text-green-600" />
                        <div className="text-xs font-medium">{program.conditions.humidity}%</div>
                        <div className="text-xs text-gray-500">Humidity</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <Wind className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                        <div className="text-xs font-medium">{program.conditions.airFlow}</div>
                        <div className="text-xs text-gray-500">Air Flow</div>
                      </div>
                    </div>

                    {/* Location & Container */}
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{program.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>{program.container} • {program.volume}</span>
                      </div>
                    </div>

                    {/* Next Milestone */}
                    {nextMilestone && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium">Next Milestone</div>
                        <div className="text-sm text-gray-600">
                          {nextMilestone.age} years • Target: {nextMilestone.targetGrade}
                        </div>
                        <div className="text-xs text-gray-500">{nextMilestone.targetDate}</div>
                      </div>
                    )}

                    {/* Quality Check Status */}
                    <div className={`p-3 rounded-lg ${isCheckOverdue ? 'bg-orange-100' : 'bg-green-50'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">
                            {isCheckOverdue ? 'Quality Check Due' : 'Next Quality Check'}
                          </div>
                          <div className="text-sm text-gray-600">{program.nextCheck}</div>
                        </div>
                        {isCheckOverdue && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <TestTube className="h-4 w-4 mr-1" />
                        Quality Check
                      </Button>
                      <Button variant="outline" size="sm">
                        <History className="h-4 w-4 mr-1" />
                        History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {agingFacilities.map((facility) => {
              const occupancyPercentage = (facility.currentOccupancy / facility.capacity) * 100;

              return (
                <Card key={facility.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{facility.name}</CardTitle>
                        <p className="text-sm text-gray-500">{facility.type}</p>
                      </div>
                      <Badge className={getStatusColor(facility.status)}>
                        {facility.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Occupancy */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Occupancy</span>
                        <span>{facility.currentOccupancy}/{facility.capacity} ({occupancyPercentage.toFixed(0)}%)</span>
                      </div>
                      <Progress value={occupancyPercentage} className="h-2" />
                    </div>

                    {/* Conditions */}
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 border rounded">
                        <div className="font-medium">{facility.conditions.temp}</div>
                        <div className="text-gray-500">Temperature</div>
                      </div>
                      <div className="text-center p-2 border rounded">
                        <div className="font-medium">{facility.conditions.humidity}</div>
                        <div className="text-gray-500">Humidity</div>
                      </div>
                      <div className="text-center p-2 border rounded">
                        <div className="font-medium">{facility.conditions.airflow}</div>
                        <div className="text-gray-500">Air Flow</div>
                      </div>
                    </div>

                    {/* Maintenance */}
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Last Maintenance:</span>
                        <span>{facility.lastMaintenance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Maintenance:</span>
                        <span>{facility.nextMaintenance}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Monitoring
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Methods Tab */}
        <TabsContent value="methods" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {agingMethods.map((method, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{method.method}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Optimal Conditions */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Temperature:</span>
                      <div className="text-gray-600">{method.optimalTemp}</div>
                    </div>
                    <div>
                      <span className="font-medium">Humidity:</span>
                      <div className="text-gray-600">{method.optimalHumidity}</div>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <div className="text-gray-600">{method.duration}</div>
                    </div>
                    <div>
                      <span className="font-medium">Containers:</span>
                      <div className="text-gray-600">{method.containers.join(', ')}</div>
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

                  {/* Advantages */}
                  <div>
                    <div className="font-medium text-sm mb-2">Advantages:</div>
                    <ul className="text-sm space-y-1">
                      {method.advantages.map((advantage, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Environmental Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle>Environmental Monitoring</CardTitle>
                <CardDescription>Real-time conditions across all facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agingPrograms.map((program) => (
                    <div key={program.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{program.productName}</div>
                        <Badge variant="outline">{program.location}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span>{program.conditions.temperature}°C</span>
                          <span className="text-gray-500">({program.conditions.targetTemp})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span>{program.conditions.humidity}%</span>
                          <span className="text-gray-500">({program.conditions.targetHumidity})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Progression */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Progression Tracking</CardTitle>
                <CardDescription>Grade improvements over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agingPrograms.map((program) => {
                    const latestCheck = program.qualityChecks[program.qualityChecks.length - 1];
                    const previousCheck = program.qualityChecks[program.qualityChecks.length - 2];
                    const improvement = previousCheck ? latestCheck.score - previousCheck.score : 0;

                    return (
                      <div key={program.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{program.productName}</div>
                          <div className="flex items-center gap-2">
                            <Badge className={getGradeColor(latestCheck.grade)}>
                              {latestCheck.grade}
                            </Badge>
                            {improvement > 0 && (
                              <div className="text-green-600 text-xs flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                +{improvement}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          Score: {latestCheck.score}/100 • {latestCheck.date}
                        </div>
                        <Progress value={latestCheck.score} className="h-2 mt-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert System */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts & Notifications</CardTitle>
              <CardDescription>Important updates and required actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agingPrograms.filter(p => isCheckDue(p.nextCheck)).map(program => (
                  <div key={program.id} className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div className="flex-1">
                      <div className="font-medium">Quality Check Due</div>
                      <div className="text-sm text-gray-600">
                        {program.productName} requires quality assessment by {program.nextCheck}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Schedule Check
                    </Button>
                  </div>
                ))}

                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">Facility Maintenance Complete</div>
                    <div className="text-sm text-gray-600">
                      Climate Controlled Vault A maintenance completed successfully
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Grade Improvement</div>
                    <div className="text-sm text-gray-600">
                      Royal Cambodian Oud achieved new quality milestone
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Program Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Aging Program Summary</CardTitle>
                <CardDescription>Overall performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-bold text-purple-600">{agingPrograms.filter(p => p.currentGrade === 'Super A+').length}</div>
                      <div className="text-sm text-purple-600">Museum Quality</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-bold text-blue-600">{agingPrograms.filter(p => p.currentGrade === 'A+').length}</div>
                      <div className="text-sm text-blue-600">Premium Grade</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Improvement:</span>
                      <span className="font-medium text-green-600">+8.2 points</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Success Rate:</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Investment:</span>
                      <span className="font-medium">AED 2.8M</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Reports & Documentation</CardTitle>
                <CardDescription>Generate comprehensive reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Aging Progress Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Quality Analysis Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Environmental Data Export
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Archive className="h-4 w-4 mr-2" />
                  Historical Records
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgingProgramPage;