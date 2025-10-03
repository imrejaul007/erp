'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle, Star, Microscope, FlaskConical, Shield, FileCheck, Eye, Edit, Download, RotateCcw,
  ArrowLeft} from 'lucide-react';
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
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';

// Mock data for quality control records
const qualityRecords = [
  {
    id: 'QC-001',
    batchId: 'PB001',
    product: 'Royal Oud Premium',
    recipe: 'RCP-001',
    testDate: '2024-09-29',
    testTime: '14:30',
    inspector: 'Dr. Amina Al-Zahra',
    status: 'Passed',
    overallGrade: 'A+',
    stage: 'Final Product',
    sampleId: 'SP-001-001',
    testPhase: 'Pre-Release',
    expiryTestDate: '2024-10-15',
    certificateNumber: 'QC-2024-001',
    tests: [
      { name: 'Aroma Intensity', result: 'Excellent', score: 9.5, unit: '/10', status: 'Pass', standard: '≥8.0' },
      { name: 'Color Consistency', result: 'Perfect', score: 10, unit: '/10', status: 'Pass', standard: '≥8.5' },
      { name: 'Viscosity', result: '42.5', score: 9.2, unit: 'cP', status: 'Pass', standard: '40-45 cP' },
      { name: 'pH Level', result: '6.8', score: 9.0, unit: 'pH', status: 'Pass', standard: '6.5-7.2' },
      { name: 'Purity Test', result: '99.8%', score: 10, unit: '%', status: 'Pass', standard: '≥99%' },
      { name: 'Microbial Test', result: 'Negative', score: 10, unit: '', status: 'Pass', standard: 'Negative' },
    ],
    overallScore: 9.58,
    notes: 'Exceptional quality batch. Premium aroma profile matches traditional Cambodian oud characteristics.',
    compliance: {
      halal: true,
      gccStandards: true,
      iso: true,
      emirates: true,
    },
    retestRequired: false,
    quarantineStatus: false,
  },
  {
    id: 'QC-002',
    batchId: 'PB002',
    product: 'Amber Essence Deluxe',
    recipe: 'RCP-002',
    testDate: '2024-09-27',
    testTime: '11:15',
    inspector: 'Khalid Mohammed',
    status: 'Conditional Pass',
    overallGrade: 'B+',
    stage: 'Mid-Production',
    sampleId: 'SP-002-001',
    testPhase: 'In-Process',
    expiryTestDate: '2024-10-12',
    certificateNumber: 'QC-2024-002',
    tests: [
      { name: 'Resin Dissolution', result: 'Good', score: 8.2, unit: '/10', status: 'Pass', standard: '≥7.5' },
      { name: 'Clarity', result: 'Slight Haze', score: 7.8, unit: '/10', status: 'Conditional', standard: '≥8.0' },
      { name: 'Scent Profile', result: 'Acceptable', score: 8.5, unit: '/10', status: 'Pass', standard: '≥7.5' },
      { name: 'Stability Test', result: 'Stable', score: 9.0, unit: '/10', status: 'Pass', standard: '≥8.0' },
      { name: 'Heavy Metals', result: 'Within Limits', score: 10, unit: '', status: 'Pass', standard: '<10ppm' },
    ],
    overallScore: 8.7,
    notes: 'Minor clarity issue detected. Recommend additional filtration step before final packaging.',
    compliance: {
      halal: true,
      gccStandards: true,
      iso: true,
      emirates: true,
    },
    retestRequired: true,
    quarantineStatus: true,
  },
  {
    id: 'QC-003',
    batchId: 'PB003',
    product: 'Desert Rose Attar',
    recipe: 'RCP-003',
    testDate: '2024-09-30',
    testTime: '09:45',
    inspector: 'Fatima Al-Rashid',
    status: 'In Progress',
    overallGrade: 'Pending',
    stage: 'Aging Process',
    sampleId: 'SP-003-001',
    testPhase: 'In-Process',
    expiryTestDate: '2024-10-05',
    certificateNumber: 'Pending',
    tests: [
      { name: 'Traditional Aroma', result: 'Testing', score: 0, unit: '/10', status: 'Pending', standard: '≥9.0' },
      { name: 'Oil Separation', result: 'Testing', score: 0, unit: '/10', status: 'Pending', standard: '≥8.5' },
      { name: 'Aging Progress', result: 'Day 15/60', score: 0, unit: 'days', status: 'In Progress', standard: '60 days' },
      { name: 'Clay Pot Integrity', result: 'Excellent', score: 10, unit: '/10', status: 'Pass', standard: '≥9.0' },
    ],
    overallScore: 0,
    notes: 'Attar aging in progress. Traditional buried clay pot method. Sample extraction scheduled for day 30.',
    compliance: {
      halal: true,
      gccStandards: true,
      iso: false,
      emirates: true,
    },
    retestRequired: false,
    quarantineStatus: false,
  },
];

// Mock data for quality standards and thresholds
const qualityStandards = {
  'Royal Oud Premium': {
    aromaIntensity: { min: 8.0, target: 9.5 },
    colorConsistency: { min: 8.5, target: 10 },
    viscosity: { min: 40, max: 45, unit: 'cP' },
    pHLevel: { min: 6.5, max: 7.2, unit: 'pH' },
    purity: { min: 99, unit: '%' },
  },
  'Amber Essence Deluxe': {
    resinDissolution: { min: 7.5, target: 9.0 },
    clarity: { min: 8.0, target: 9.5 },
    scentProfile: { min: 7.5, target: 9.0 },
    stability: { min: 8.0, target: 9.5 },
  },
  'Desert Rose Attar': {
    traditionalAroma: { min: 9.0, target: 10 },
    oilSeparation: { min: 8.5, target: 9.5 },
    agingProgress: { min: 60, unit: 'days' },
    clayPotIntegrity: { min: 9.0, target: 10 },
  },
};

// Mock data for inspectors and their certifications
const inspectors = [
  {
    id: 'INS-001',
    name: 'Dr. Amina Al-Zahra',
    title: 'Chief Quality Inspector',
    certifications: ['GCC Quality Standards', 'Perfume Analysis', 'Traditional Oud Assessment'],
    experience: '15 years',
    specializations: ['Oud Quality', 'Traditional Methods'],
  },
  {
    id: 'INS-002',
    name: 'Khalid Mohammed',
    title: 'Senior Quality Analyst',
    certifications: ['Chemical Analysis', 'Halal Certification', 'ISO 9001'],
    experience: '12 years',
    specializations: ['Chemical Testing', 'Compliance'],
  },
  {
    id: 'INS-003',
    name: 'Fatima Al-Rashid',
    title: 'Traditional Methods Specialist',
    certifications: ['Arabic Perfumery', 'Attar Expertise', 'Heritage Methods'],
    experience: '20 years',
    specializations: ['Attar Production', 'Traditional Assessment'],
  },
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode } } = {
    'Passed': { variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
    'Conditional Pass': { variant: 'secondary', icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
    'Failed': { variant: 'destructive', icon: <XCircle className="w-3 h-3 mr-1" /> },
    'In Progress': { variant: 'outline', icon: <Clock className="w-3 h-3 mr-1" /> },
    'Pending': { variant: 'outline', icon: <Clock className="w-3 h-3 mr-1" /> },
  };
  const config = variants[status] || { variant: 'outline', icon: null };
  return (
    <Badge variant={config.variant} className="flex items-center">
      {config.icon}
      {status}
    </Badge>
  );
};

const getTestStatusBadge = (status: string) => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode } } = {
    'Pass': { variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
    'Conditional': { variant: 'secondary', icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
    'Fail': { variant: 'destructive', icon: <XCircle className="w-3 h-3 mr-1" /> },
    'Pending': { variant: 'outline', icon: <Clock className="w-3 h-3 mr-1" /> },
    'In Progress': { variant: 'outline', icon: <RotateCcw className="w-3 h-3 mr-1" /> },
  };
  const config = variants[status] || { variant: 'outline', icon: null };
  return (
    <Badge variant={config.variant} className="flex items-center">
      {config.icon}
      {status}
    </Badge>
  );
};

const getGradeBadge = (grade: string) => {
  const colors: { [key: string]: string } = {
    'A+': 'bg-emerald-500 text-white',
    'A': 'bg-green-500 text-white',
    'B+': 'bg-yellow-500 text-white',
    'B': 'bg-orange-500 text-white',
    'C': 'bg-red-500 text-white',
    'Pending': 'bg-gray-500 text-white',
  };
  return <Badge className={colors[grade] || 'bg-gray-500 text-white'}>{grade}</Badge>;
};

export default function QualityControlPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterInspector, setFilterInspector] = useState('all');
  const [isNewTestDialogOpen, setIsNewTestDialogOpen] = useState(false);
  const [selectedQualityRecord, setSelectedQualityRecord] = useState<typeof qualityRecords[0] | null>(null);
  const [isViewQualityDialogOpen, setIsViewQualityDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const filteredQualityRecords = qualityRecords.filter(record => {
    const matchesSearch = record.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesInspector = filterInspector === 'all' || record.inspector.toLowerCase().includes(filterInspector.toLowerCase());
    return matchesSearch && matchesStatus && matchesInspector;
  });

  const handleViewQualityRecord = (record: typeof qualityRecords[0]) => {
    setSelectedQualityRecord(record);
    setIsViewQualityDialogOpen(true);
  };

  const totalTests = qualityRecords.reduce((acc, record) => acc + record.tests.length, 0);
  const passedTests = qualityRecords.reduce((acc, record) =>
    acc + record.tests.filter(test => test.status === 'Pass').length, 0);
  const avgScore = qualityRecords.reduce((acc, record) =>
    acc + (record.overallScore || 0), 0) / qualityRecords.filter(r => r.overallScore > 0).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-oud-600" />
            Quality Control & Testing
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive quality assurance for perfume and oud production
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
          <Dialog open={isNewTestDialogOpen} onOpenChange={setIsNewTestDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
                <Plus className="h-4 w-4" />
                New Quality Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Quality Test</DialogTitle>
                <DialogDescription>
                  Set up comprehensive quality control testing for production batch
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:gap-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Test Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="test-batch">Production Batch</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PB001">PB001 - Royal Oud Premium</SelectItem>
                          <SelectItem value="PB002">PB002 - Amber Essence Deluxe</SelectItem>
                          <SelectItem value="PB003">PB003 - Desert Rose Attar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-stage">Production Stage</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="raw-materials">Raw Materials</SelectItem>
                          <SelectItem value="in-process">In-Process</SelectItem>
                          <SelectItem value="pre-aging">Pre-Aging</SelectItem>
                          <SelectItem value="post-aging">Post-Aging</SelectItem>
                          <SelectItem value="final-product">Final Product</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-inspector">Quality Inspector</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inspector" />
                        </SelectTrigger>
                        <SelectContent>
                          {inspectors.map((inspector) => (
                            <SelectItem key={inspector.id} value={inspector.id}>
                              {inspector.name} - {inspector.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Test Date</Label>
                      <DatePicker
                        date={selectedDate}
                        setDate={setSelectedDate}
                        placeholder="Select test date"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Test Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Test Configuration</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sample-id">Sample ID</Label>
                        <Input id="sample-id" placeholder="e.g., SP-001-001" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="test-phase">Test Phase</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select phase" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="incoming">Incoming Materials</SelectItem>
                            <SelectItem value="in-process">In-Process Control</SelectItem>
                            <SelectItem value="pre-release">Pre-Release</SelectItem>
                            <SelectItem value="stability">Stability Testing</SelectItem>
                            <SelectItem value="shelf-life">Shelf Life</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Test Categories */}
                    <div className="space-y-3">
                      <Label>Test Categories</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch id="aroma-test" />
                            <Label htmlFor="aroma-test">Aroma & Fragrance Profile</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="physical-test" />
                            <Label htmlFor="physical-test">Physical Properties</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="chemical-test" />
                            <Label htmlFor="chemical-test">Chemical Analysis</Label>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch id="microbial-test" />
                            <Label htmlFor="microbial-test">Microbial Testing</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="stability-test" />
                            <Label htmlFor="stability-test">Stability Assessment</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="compliance-test" />
                            <Label htmlFor="compliance-test">Regulatory Compliance</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Special Instructions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Special Instructions</h3>
                  <Textarea
                    placeholder="Enter any special testing requirements, handling instructions, or specific parameters..."
                    className="min-h-24"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsNewTestDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline">
                    Save as Template
                  </Button>
                  <Button onClick={() => setIsNewTestDialogOpen(false)} className="bg-oud-600 hover:bg-oud-700">
                    Schedule Test
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{((passedTests / totalTests) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {passedTests}/{totalTests} tests passed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{avgScore.toFixed(1)}/10</div>
            <p className="text-xs text-muted-foreground">
              Based on completed tests
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {qualityRecords.filter(r => r.status === 'In Progress' || r.status === 'Pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A+ Grade</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {qualityRecords.filter(r => r.overallGrade === 'A+').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Premium quality batches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tests">Quality Tests</TabsTrigger>
          <TabsTrigger value="standards">Quality Standards</TabsTrigger>
          <TabsTrigger value="inspectors">Inspectors</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Tests</CardTitle>
              <CardDescription>
                Monitor and manage quality testing for all production batches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search quality tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="conditional pass">Conditional Pass</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterInspector} onValueChange={setFilterInspector}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Inspectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Inspectors</SelectItem>
                    {inspectors.map((inspector) => (
                      <SelectItem key={inspector.id} value={inspector.name.toLowerCase()}>
                        {inspector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quality Tests Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test ID</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Test Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQualityRecords.map((record) => (
                      <TableRow
                        key={record.id}
                        className="cursor-pointer hover:bg-blue-50 transition-colors group"
                        onClick={() => handleViewQualityRecord(record)}
                      >
                        <TableCell className="font-medium text-gray-900 group-hover:text-gray-900">{record.id}</TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">{record.batchId}</TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">{record.product}</TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">{record.stage}</TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">{record.inspector}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>{getGradeBadge(record.overallGrade)}</TableCell>
                        <TableCell>
                          {record.overallScore > 0 ? (
                            <div className="flex items-center gap-2">
                              <Progress value={record.overallScore * 10} className="w-16" />
                              <span className="text-sm text-gray-900 group-hover:text-gray-900">{record.overallScore.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-600 group-hover:text-gray-700">Pending</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-900 group-hover:text-gray-900">{record.testDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewQualityRecord(record);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileCheck className="h-4 w-4" />
                            </Button>
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

        <TabsContent value="standards" className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(qualityStandards).map(([product, standards]) => (
              <Card key={product}>
                <CardHeader>
                  <CardTitle>{product}</CardTitle>
                  <CardDescription>Quality standards and acceptance criteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(standards).map(([test, criteria]) => (
                      <div key={test} className="p-3 border rounded-lg">
                        <h4 className="font-semibold mb-2 capitalize">
                          {test.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="space-y-1 text-sm">
                          {criteria.min && (
                            <div className="flex justify-between">
                              <span>Minimum:</span>
                              <span>{criteria.min} {criteria.unit || ''}</span>
                            </div>
                          )}
                          {criteria.max && (
                            <div className="flex justify-between">
                              <span>Maximum:</span>
                              <span>{criteria.max} {criteria.unit || ''}</span>
                            </div>
                          )}
                          {criteria.target && (
                            <div className="flex justify-between">
                              <span>Target:</span>
                              <span>{criteria.target} {criteria.unit || ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inspectors" className="space-y-4">
          <div className="grid gap-4">
            {inspectors.map((inspector) => (
              <Card key={inspector.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{inspector.name}</span>
                    <Badge variant="outline">{inspector.title}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {inspector.experience} experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {inspector.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {inspector.specializations.map((spec, index) => (
                          <Badge key={index} className="bg-oud-600 text-white">{spec}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Compliance Status</CardTitle>
                <CardDescription>
                  Track compliance with UAE and GCC standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Halal Certification</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Compliant
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>GCC Standards</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Compliant
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ISO 9001:2015</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Certified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Emirates Authority Standards</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificate Status</CardTitle>
                <CardDescription>
                  Active quality certificates and renewals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">QC-2024-001</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Royal Oud Premium • Expires: Dec 2024
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">QC-2024-002</span>
                      <Badge variant="secondary">Conditional</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Amber Essence Deluxe • Retest Required
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quality Record Details Dialog */}
      <Dialog open={isViewQualityDialogOpen} onOpenChange={setIsViewQualityDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedQualityRecord && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-oud-600" />
                  Quality Test Report {selectedQualityRecord.id}
                </DialogTitle>
                <DialogDescription>
                  {selectedQualityRecord.batchId} • {selectedQualityRecord.product} • {selectedQualityRecord.testDate}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 sm:space-y-6">
                {/* Test Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedQualityRecord.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Grade</Label>
                    <div className="mt-1">{getGradeBadge(selectedQualityRecord.overallGrade)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Inspector</Label>
                    <p className="text-sm mt-1">{selectedQualityRecord.inspector}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Overall Score</Label>
                    <p className="text-sm mt-1 font-semibold">
                      {selectedQualityRecord.overallScore > 0 ? `${selectedQualityRecord.overallScore.toFixed(2)}/10` : 'Pending'}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Test Results */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Test Results</h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test Parameter</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Standard</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedQualityRecord.tests.map((test, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{test.name}</TableCell>
                            <TableCell>{test.result} {test.unit}</TableCell>
                            <TableCell>
                              {test.score > 0 ? (
                                <div className="flex items-center gap-2">
                                  <Progress value={test.score * 10} className="w-16" />
                                  <span className="text-sm">{test.score.toFixed(1)}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>{test.standard}</TableCell>
                            <TableCell>{getTestStatusBadge(test.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Separator />

                {/* Compliance Status */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Halal Certification</span>
                        <Badge variant={selectedQualityRecord.compliance.halal ? "default" : "destructive"}>
                          {selectedQualityRecord.compliance.halal ? "Compliant" : "Non-Compliant"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>GCC Standards</span>
                        <Badge variant={selectedQualityRecord.compliance.gccStandards ? "default" : "destructive"}>
                          {selectedQualityRecord.compliance.gccStandards ? "Compliant" : "Non-Compliant"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>ISO Certification</span>
                        <Badge variant={selectedQualityRecord.compliance.iso ? "default" : "destructive"}>
                          {selectedQualityRecord.compliance.iso ? "Certified" : "Not Certified"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Emirates Authority</span>
                        <Badge variant={selectedQualityRecord.compliance.emirates ? "default" : "destructive"}>
                          {selectedQualityRecord.compliance.emirates ? "Approved" : "Not Approved"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <Label className="font-medium">Sample ID</Label>
                        <p className="text-muted-foreground">{selectedQualityRecord.sampleId}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Test Phase</Label>
                        <p className="text-muted-foreground">{selectedQualityRecord.testPhase}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Certificate Number</Label>
                        <p className="text-muted-foreground">{selectedQualityRecord.certificateNumber}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Retest Required</Label>
                        <p className="text-muted-foreground">{selectedQualityRecord.retestRequired ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Inspector Notes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Inspector Notes</h3>
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                    {selectedQualityRecord.notes}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Results
                  </Button>
                  {selectedQualityRecord.retestRequired && (
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Schedule Retest
                    </Button>
                  )}
                  <Button className="bg-oud-600 hover:bg-oud-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Batch
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