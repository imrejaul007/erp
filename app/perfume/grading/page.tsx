'use client';

import { useRouter } from 'next/navigation';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Star,
  Award,
  Crown,
  Diamond,
  Zap,
  Eye,
  Flower2,
  Thermometer,
  Droplets,
  Clock,
  Scale,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Edit,
  Save,
  FileText,
  Camera,
  BarChart3,
  TrendingUp,
  Flower2 as Nose,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Users,
  Calendar,
  MapPin,
  Building,
  FlaskConical,
  TestTube,
  Beaker,
  Layers,
  Palette,
  Wind,
  Sun,
  Moon,
  Sparkles,
  ArrowLeft} from 'lucide-react';

const PerfumeGradingPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [gradingMode, setGradingMode] = useState('new');
  const [currentGrading, setCurrentGrading] = useState({
    aroma: { score: 0, notes: '' },
    authenticity: { score: 0, notes: '' },
    physical: { score: 0, notes: '' },
    performance: { score: 0, notes: '' },
    rarity: { score: 0, notes: '' }
  });
  const [isGradingDialogOpen, setIsGradingDialogOpen] = useState(false);

  // Professional grading criteria with detailed sub-factors
  const gradingCriteria = [
    {
      category: 'Aroma Quality',
      weight: 30,
      maxScore: 30,
      icon: Nose,
      color: 'text-purple-600',
      subFactors: [
        { name: 'Complexity', description: 'Depth and layers of scent notes', maxPoints: 8 },
        { name: 'Uniqueness', description: 'Distinctive character and rarity', maxPoints: 7 },
        { name: 'Balance', description: 'Harmony between note transitions', maxPoints: 8 },
        { name: 'Projection', description: 'Sillage and scent throw strength', maxPoints: 7 }
      ]
    },
    {
      category: 'Authenticity',
      weight: 25,
      maxScore: 25,
      icon: CheckCircle,
      color: 'text-green-600',
      subFactors: [
        { name: 'Origin Verification', description: 'Confirmed geographical source', maxPoints: 7 },
        { name: 'Age Verification', description: 'Authenticated aging period', maxPoints: 6 },
        { name: 'Purity Assessment', description: 'No synthetic adulterants', maxPoints: 6 },
        { name: 'Documentation', description: 'Complete provenance records', maxPoints: 6 }
      ]
    },
    {
      category: 'Physical Properties',
      weight: 20,
      maxScore: 20,
      icon: Droplets,
      color: 'text-blue-600',
      subFactors: [
        { name: 'Viscosity', description: 'Appropriate consistency for type', maxPoints: 5 },
        { name: 'Color', description: 'Natural color for origin/age', maxPoints: 5 },
        { name: 'Clarity', description: 'Transparency and sediment', maxPoints: 5 },
        { name: 'Consistency', description: 'Uniform throughout sample', maxPoints: 5 }
      ]
    },
    {
      category: 'Performance',
      weight: 15,
      maxScore: 15,
      icon: Clock,
      color: 'text-orange-600',
      subFactors: [
        { name: 'Longevity', description: 'Duration of scent on skin', maxPoints: 4 },
        { name: 'Sillage', description: 'Scent trail and projection', maxPoints: 4 },
        { name: 'Development', description: 'Note evolution over time', maxPoints: 4 },
        { name: 'Dry-down', description: 'Final stage characteristics', maxPoints: 3 }
      ]
    },
    {
      category: 'Rarity & Heritage',
      weight: 10,
      maxScore: 10,
      icon: Crown,
      color: 'text-yellow-600',
      subFactors: [
        { name: 'Scarcity', description: 'Availability and rarity', maxPoints: 3 },
        { name: 'Historical Significance', description: 'Cultural/historical importance', maxPoints: 3 },
        { name: 'Distiller Reputation', description: 'Master craftsman credentials', maxPoints: 2 },
        { name: 'Wood Source Quality', description: 'Grade of agarwood used', maxPoints: 2 }
      ]
    }
  ];

  // Sample products for grading
  const sampleProducts = [
    {
      id: 'GRADE-001',
      name: 'Royal Cambodian Oud',
      arabicName: 'عود كمبودي ملكي',
      type: 'Premium Oud',
      origin: 'Cambodia - Pursat Province',
      age: '15 years',
      distiller: 'Master Ahmad Al-Attar',
      currentGrade: 'Super A+',
      gradeScore: 96,
      lastGraded: '2024-01-15',
      grader: 'Master Evaluator Hassan',
      status: 'certified',
      batchId: 'CAM-2009-A15',
      woodType: 'Aquilaria Crassna'
    },
    {
      id: 'GRADE-002',
      name: 'Hindi Assam Vintage',
      arabicName: 'عود آسام هندي قديم',
      type: 'Vintage Oud',
      origin: 'India - Assam Region',
      age: '25 years',
      distiller: 'Ustad Naseer Ali',
      currentGrade: 'A+',
      gradeScore: 92,
      lastGraded: '2024-01-10',
      grader: 'Senior Evaluator Khalid',
      status: 'certified',
      batchId: 'IND-1999-V25',
      woodType: 'Aquilaria Malaccensis'
    },
    {
      id: 'GRADE-003',
      name: 'Taif Rose Supreme',
      arabicName: 'ورد طائفي ممتاز',
      type: 'Rose Attar',
      origin: 'Saudi Arabia - Taif',
      age: '5 years',
      distiller: 'Al-Taif Rose Masters',
      currentGrade: 'A+',
      gradeScore: 89,
      lastGraded: '2024-01-08',
      grader: 'Master Evaluator Fatima',
      status: 'pending_review',
      batchId: 'TAF-2019-R5',
      woodType: 'N/A (Floral)'
    },
    {
      id: 'GRADE-004',
      name: 'Burma Wild Oud',
      arabicName: 'عود بورمي بري',
      type: 'Wild Oud',
      origin: 'Myanmar - Wild Harvest',
      age: '8 years',
      distiller: 'Traditional Cooperative',
      currentGrade: 'TBD',
      gradeScore: 0,
      lastGraded: null,
      grader: null,
      status: 'awaiting_grading',
      batchId: 'MYN-2016-W8',
      woodType: 'Aquilaria Sinensis'
    }
  ];

  // Grading scale definitions
  const gradingScale = [
    { grade: 'Super A+', range: '95-100', color: 'bg-purple-100 text-purple-800', description: 'Museum Quality - Exceptional specimens of historical significance' },
    { grade: 'A+', range: '90-94', color: 'bg-blue-100 text-blue-800', description: 'Premium Collection - Outstanding quality for collectors' },
    { grade: 'A', range: '85-89', color: 'bg-green-100 text-green-800', description: 'High Quality - Excellent for regular premium use' },
    { grade: 'B+', range: '80-84', color: 'bg-yellow-100 text-yellow-800', description: 'Good Quality - Solid commercial grade' },
    { grade: 'B', range: '75-79', color: 'bg-orange-100 text-orange-800', description: 'Standard Quality - Basic commercial grade' },
    { grade: 'C', range: '70-74', color: 'bg-red-100 text-red-800', description: 'Below Standard - Requires improvement' }
  ];

  // Professional graders
  const certifiedGraders = [
    { id: 'GR001', name: 'Master Evaluator Hassan Al-Attar', certification: 'International Oud Expert', experience: '25 years', specialization: 'Cambodian & Malaysian Oud' },
    { id: 'GR002', name: 'Senior Evaluator Khalid Rahman', certification: 'Traditional Attar Specialist', experience: '18 years', specialization: 'Indian Subcontinent Products' },
    { id: 'GR003', name: 'Master Evaluator Fatima Al-Zahra', certification: 'Floral Attar Expert', experience: '22 years', specialization: 'Rose & Floral Attars' },
    { id: 'GR004', name: 'Expert Evaluator Omar Baghdadi', certification: 'Heritage Oud Specialist', experience: '30 years', specialization: 'Vintage & Rare Collections' }
  ];

  const getGradeColor = (grade) => {
    const gradeInfo = gradingScale.find(g => g.grade === grade);
    return gradeInfo ? gradeInfo.color : 'bg-gray-100 text-gray-800';
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
      case 'certified': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_grading': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalScore = () => {
    return Object.values(currentGrading).reduce((total, criteria) => total + (criteria.score || 0), 0);
  };

  const getGradeFromScore = (score) => {
    if (score >= 95) return 'Super A+';
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    return 'C';
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Professional Perfume Grading System</h1>
          <p className="text-gray-600">International standard quality assessment for premium oud and attars</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isGradingDialogOpen} onOpenChange={setIsGradingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Grading
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Professional Quality Grading</DialogTitle>
                <DialogDescription>
                  Comprehensive assessment following international standards
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 sm:space-y-6">
                {/* Product Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product to Grade</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleProducts.filter(p => p.status === 'awaiting_grading').map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {product.batchId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Certified Grader</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grader" />
                      </SelectTrigger>
                      <SelectContent>
                        {certifiedGraders.map(grader => (
                          <SelectItem key={grader.id} value={grader.id}>
                            {grader.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Grading Criteria */}
                <div className="space-y-4">
                  {gradingCriteria.map((criteria) => {
                    const CriteriaIcon = criteria.icon;
                    return (
                      <Card key={criteria.category}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CriteriaIcon className={`h-5 w-5 ${criteria.color}`} />
                              <CardTitle className="text-lg">{criteria.category}</CardTitle>
                            </div>
                            <Badge variant="outline">{criteria.weight}% weight</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Main Score */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Overall Score (0-{criteria.maxScore})</Label>
                              <span className="text-sm font-medium">
                                {currentGrading[criteria.category.toLowerCase().replace(' ', '')]?.score || 0}/{criteria.maxScore}
                              </span>
                            </div>
                            <Slider
                              value={[currentGrading[criteria.category.toLowerCase().replace(' ', '')]?.score || 0]}
                              onValueChange={(value) => {
                                const key = criteria.category.toLowerCase().replace(' ', '');
                                setCurrentGrading(prev => ({
                                  ...prev,
                                  [key]: { ...prev[key], score: value[0] }
                                }));
                              }}
                              max={criteria.maxScore}
                              step={0.5}
                              className="w-full"
                            />
                          </div>

                          {/* Sub-factors breakdown */}
                          <div className="grid grid-cols-2 gap-3">
                            {criteria.subFactors.map((factor, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="font-medium text-sm">{factor.name}</div>
                                <div className="text-xs text-gray-500 mb-2">{factor.description}</div>
                                <div className="text-xs text-blue-600">Max: {factor.maxPoints} points</div>
                              </div>
                            ))}
                          </div>

                          {/* Notes */}
                          <div className="space-y-2">
                            <Label>Detailed Assessment Notes</Label>
                            <Textarea
                              placeholder={`Detailed notes for ${criteria.category.toLowerCase()}...`}
                              value={currentGrading[criteria.category.toLowerCase().replace(' ', '')]?.notes || ''}
                              onChange={(e) => {
                                const key = criteria.category.toLowerCase().replace(' ', '');
                                setCurrentGrading(prev => ({
                                  ...prev,
                                  [key]: { ...prev[key], notes: e.target.value }
                                }));
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Total Score Summary */}
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Total Score</div>
                        <div className="text-sm text-gray-600">Final assessment result</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          {calculateTotalScore()}/100
                        </div>
                        <Badge className={getGradeColor(getGradeFromScore(calculateTotalScore()))}>
                          {getGradeFromScore(calculateTotalScore())}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={calculateTotalScore()} className="mt-3" />
                  </CardContent>
                </Card>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGradingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsGradingDialogOpen(false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Grading
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
                <p className="text-sm font-medium text-gray-600">Total Products Graded</p>
                <p className="text-xl sm:text-2xl font-bold">{sampleProducts.filter(p => p.currentGrade !== 'TBD').length}</p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className="text-xl sm:text-2xl font-bold">A+</p>
                <p className="text-xs text-purple-600">92.3 avg score</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Museum Quality</p>
                <p className="text-xl sm:text-2xl font-bold">1</p>
                <p className="text-xs text-yellow-600">Super A+ specimens</p>
              </div>
              <Crown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Grading</p>
                <p className="text-xl sm:text-2xl font-bold">{sampleProducts.filter(p => p.status === 'awaiting_grading').length}</p>
                <p className="text-xs text-orange-600">Awaiting assessment</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="criteria">Grading Criteria</TabsTrigger>
          <TabsTrigger value="graders">Certified Graders</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Grading Status</CardTitle>
              <CardDescription>Track quality assessments and certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type & Origin</TableHead>
                    <TableHead>Current Grade</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Last Graded</TableHead>
                    <TableHead>Grader</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.arabicName}</div>
                          <div className="text-xs text-gray-500">{product.batchId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.type}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {product.origin}
                          </div>
                          <div className="text-sm text-gray-600">{product.age} aged</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.currentGrade !== 'TBD' ? (
                          <Badge className={getGradeColor(product.currentGrade)}>
                            {getGradeIcon(product.currentGrade)}
                            {product.currentGrade}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {product.gradeScore > 0 ? `${product.gradeScore}/100` : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.lastGraded || 'Not graded'}
                      </TableCell>
                      <TableCell>
                        {product.grader || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grading Criteria Tab */}
        <TabsContent value="criteria" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Criteria Details */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Grading Standards</CardTitle>
                <CardDescription>International quality assessment framework</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gradingCriteria.map((criteria) => {
                  const CriteriaIcon = criteria.icon;
                  return (
                    <div key={criteria.category} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CriteriaIcon className={`h-5 w-5 ${criteria.color}`} />
                          <h4 className="font-medium">{criteria.category}</h4>
                        </div>
                        <Badge variant="outline">{criteria.weight}%</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Maximum Score: {criteria.maxScore} points
                      </div>
                      <div className="space-y-2">
                        {criteria.subFactors.map((factor, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span>{factor.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {factor.maxPoints}pts
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Grading Scale */}
            <Card>
              <CardHeader>
                <CardTitle>Grading Scale & Classifications</CardTitle>
                <CardDescription>Quality grade definitions and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gradingScale.map((scale, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={scale.color}>
                        {getGradeIcon(scale.grade)}
                        {scale.grade}
                      </Badge>
                      <span className="text-sm font-medium">{scale.range} points</span>
                    </div>
                    <p className="text-sm text-gray-600">{scale.description}</p>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Grading Guidelines</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• All assessments must be conducted by certified graders</li>
                    <li>• Minimum 48-hour evaluation period for complex products</li>
                    <li>• Temperature-controlled environment required</li>
                    <li>• Multiple sample testing for consistency</li>
                    <li>• Documentation of all assessment stages</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Certified Graders Tab */}
        <TabsContent value="graders" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certified Quality Assessors</CardTitle>
              <CardDescription>Professional graders authorized for quality assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {certifiedGraders.map((grader) => (
                  <div key={grader.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{grader.name}</h4>
                        <p className="text-sm text-gray-600">{grader.certification}</p>
                      </div>
                      <Badge variant="outline">{grader.experience}</Badge>
                    </div>

                    <div className="text-sm">
                      <span className="font-medium">Specialization:</span>
                      <span className="ml-2 text-gray-600">{grader.specialization}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Reports
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Grader Certification Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div className="space-y-1">
                    <div>• Minimum 10 years industry experience</div>
                    <div>• Professional certification from recognized body</div>
                    <div>• Specialized training in assessment techniques</div>
                  </div>
                  <div className="space-y-1">
                    <div>• Cultural and traditional knowledge</div>
                    <div>• Annual recertification process</div>
                    <div>• Peer review and validation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Grading Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Grading Summary Report</CardTitle>
                <CardDescription>Overview of quality assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-bold text-purple-600">1</div>
                      <div className="text-sm text-purple-600">Super A+</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-bold text-blue-600">2</div>
                      <div className="text-sm text-blue-600">A+ Grade</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-600">0</div>
                      <div className="text-sm text-green-600">A Grade</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Score</span>
                      <span className="font-medium">92.3/100</span>
                    </div>
                    <Progress value={92.3} className="h-2" />
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Products Certified:</span>
                      <span>3/4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Review:</span>
                      <span>1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month:</span>
                      <span>+2 gradings</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export & Documentation</CardTitle>
                <CardDescription>Generate certificates and reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Quality Certificates (PDF)
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Grading Summary Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Excel Export (All Data)
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Photo Documentation
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Report Generation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last Generated:</span>
                      <span>2024-01-15</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Report Version:</span>
                      <span>v2.1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Format:</span>
                      <span>PDF + Digital</span>
                    </div>
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

export default PerfumeGradingPage;