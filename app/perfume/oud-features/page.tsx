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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Star,
  Award,
  Beaker,
  Thermometer,
  Clock,
  Droplets,
  Leaf,
  TreePine,
  Heart,
  Gift,
  Crown,
  Diamond,
  Zap,
  FlaskConical,
  TestTube,
  Calendar as CalendarIcon,
  Timer,
  Target,
  Layers,
  Scale,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
  MapPin,
  Building,
  Store,
  Truck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  BookOpen,
  Camera,
  FileText,
  Palette,
  Fingerprint,
  Wind,
  Sun,
  Moon,
  Cloud,
  Sparkles,
  Mountain,
  Waves
} from 'lucide-react';

const PerfumeOudFeatures = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [isDistillationModalOpen, setIsDistillationModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample oud & perfume data with specialized features
  const oudProducts = [
    {
      id: 'OUD001',
      name: 'Royal Cambodian Oud',
      type: 'premium_oud',
      origin: 'Cambodia - Pursat Province',
      grade: 'Super A+',
      gradeScore: 96,
      ageYears: 12,
      woodType: 'Aquilaria Crassna',
      harvestDate: '2012-03-15',
      distillationDate: '2012-04-20',
      distillationMethod: 'Traditional Steam',
      distiller: 'Master Ahmad Al-Attar',
      currentStock: 125,
      unit: 'tola',
      pricePerTola: 2500,
      aroma: {
        topNotes: ['Animalic', 'Barnyard', 'Smoky'],
        middleNotes: ['Honey', 'Leather', 'Dried Fruits'],
        baseNotes: ['Deep Wood', 'Resinous', 'Creamy']
      },
      qualityMetrics: {
        viscosity: 'Thick',
        color: 'Dark Brown',
        transparency: 'Clear',
        sillage: 'Excellent',
        longevity: '12+ hours'
      },
      certifications: ['Authentic Cambodian Origin', 'CITES Compliant', 'Lab Tested'],
      aging: {
        method: 'Underground Cellar',
        temperature: '18-22°C',
        humidity: '60-65%',
        containers: 'Traditional Clay Pots'
      }
    },
    {
      id: 'OUD002',
      name: 'Hindi Assam Vintage',
      type: 'vintage_oud',
      origin: 'India - Assam Region',
      grade: 'A+',
      gradeScore: 92,
      ageYears: 25,
      woodType: 'Aquilaria Malaccensis',
      harvestDate: '1999-09-10',
      distillationDate: '1999-11-15',
      distillationMethod: 'Clay Pot Hydro',
      distiller: 'Ustad Naseer Ali',
      currentStock: 48,
      unit: 'tola',
      pricePerTola: 4500,
      aroma: {
        topNotes: ['Metallic', 'Green', 'Fresh'],
        middleNotes: ['Floral', 'Rose', 'Jasmine'],
        baseNotes: ['Sweet Wood', 'Vanilla', 'Amber']
      },
      qualityMetrics: {
        viscosity: 'Medium-Thick',
        color: 'Golden Brown',
        transparency: 'Clear',
        sillage: 'Outstanding',
        longevity: '15+ hours'
      },
      certifications: ['Vintage Certification', 'Master Distiller Approved'],
      aging: {
        method: 'Natural Cave Aging',
        temperature: '16-20°C',
        humidity: '55-60%',
        containers: 'Aged Oak Barrels'
      }
    },
    {
      id: 'ATT001',
      name: 'Taif Rose Attar',
      type: 'floral_attar',
      origin: 'Saudi Arabia - Taif',
      grade: 'Premium',
      gradeScore: 88,
      ageYears: 3,
      baseOil: 'Sandalwood Oil',
      extractionDate: '2021-05-01',
      extractionMethod: 'Traditional Deg Bhapka',
      distiller: 'Al-Taif Rose Company',
      currentStock: 85,
      unit: 'tola',
      pricePerTola: 850,
      aroma: {
        topNotes: ['Fresh Rose', 'Green Leaves'],
        middleNotes: ['Damask Rose', 'Honey'],
        baseNotes: ['Sandalwood', 'Musk', 'Amber']
      },
      qualityMetrics: {
        viscosity: 'Light',
        color: 'Light Golden',
        transparency: 'Crystal Clear',
        sillage: 'Good',
        longevity: '8-10 hours'
      },
      certifications: ['Authentic Taif Rose', 'Organic Certified'],
      aging: {
        method: 'Room Temperature',
        temperature: '20-25°C',
        humidity: '40-50%',
        containers: 'Glass Bottles'
      }
    }
  ];

  const distillationBatches = [
    {
      id: 'DIST001',
      batchName: 'Cambodian Supreme Batch 2024-A',
      woodSource: 'Cambodia - Grade A+ Aquilaria',
      woodWeight: '50 kg',
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      duration: '15 days',
      method: 'Traditional Steam Distillation',
      distiller: 'Master Ahmad Al-Attar',
      expectedYield: '180-220ml',
      actualYield: '195ml',
      yieldPercentage: 87.5,
      status: 'completed',
      qualityGrade: 'Super A+',
      notes: 'Exceptional quality batch with strong barnyard opening and beautiful transformation',
      stages: [
        { stage: 'Preparation', duration: '2 days', status: 'completed' },
        { stage: 'First Distillation', duration: '5 days', status: 'completed' },
        { stage: 'Second Distillation', duration: '4 days', status: 'completed' },
        { stage: 'Third Distillation', duration: '3 days', status: 'completed' },
        { stage: 'Final Collection', duration: '1 day', status: 'completed' }
      ]
    },
    {
      id: 'DIST002',
      batchName: 'Hindi Assam Heritage 2024-B',
      woodSource: 'India - Premium Assam Wood',
      woodWeight: '35 kg',
      startDate: '2024-02-01',
      endDate: '2024-02-18',
      duration: '17 days',
      method: 'Clay Pot Hydro Distillation',
      distiller: 'Ustad Raheem Khan',
      expectedYield: '120-150ml',
      actualYield: '0ml',
      yieldPercentage: 0,
      status: 'in_progress',
      qualityGrade: 'TBD',
      notes: 'Slow and careful distillation for maximum quality extraction',
      stages: [
        { stage: 'Preparation', duration: '3 days', status: 'completed' },
        { stage: 'First Distillation', duration: '6 days', status: 'completed' },
        { stage: 'Second Distillation', duration: '5 days', status: 'in_progress' },
        { stage: 'Third Distillation', duration: '3 days', status: 'pending' },
        { stage: 'Final Collection', duration: '1 day', status: 'pending' }
      ]
    }
  ];

  const gradingCriteria = [
    {
      category: 'Aroma Quality',
      weight: 30,
      factors: ['Complexity', 'Uniqueness', 'Balance', 'Projection'],
      maxScore: 30
    },
    {
      category: 'Authenticity',
      weight: 25,
      factors: ['Origin Verification', 'Age Verification', 'Purity', 'Adulteration Check'],
      maxScore: 25
    },
    {
      category: 'Physical Properties',
      weight: 20,
      factors: ['Viscosity', 'Color', 'Clarity', 'Consistency'],
      maxScore: 20
    },
    {
      category: 'Performance',
      weight: 15,
      factors: ['Longevity', 'Sillage', 'Development', 'Dry-down'],
      maxScore: 15
    },
    {
      category: 'Rarity & Heritage',
      weight: 10,
      factors: ['Scarcity', 'Historical Significance', 'Distiller Reputation', 'Wood Source'],
      maxScore: 10
    }
  ];

  const agingPrograms = [
    {
      id: 'AGE001',
      productName: 'Royal Cambodian Oud',
      startDate: '2012-04-20',
      currentAge: '12 years',
      targetAge: '20 years',
      agingMethod: 'Underground Cellar',
      location: 'Climate Controlled Vault A',
      container: 'Traditional Clay Pot #15',
      conditions: {
        temperature: '19°C',
        humidity: '62%',
        airFlow: 'Minimal'
      },
      qualityChecks: [
        { date: '2022-04-20', grade: 'A+', notes: '10-year mark - Excellent development' },
        { date: '2023-04-20', grade: 'Super A+', notes: '11-year mark - Outstanding complexity' },
        { date: '2024-01-15', grade: 'Super A+', notes: '12-year mark - Premium quality maintained' }
      ]
    },
    {
      id: 'AGE002',
      productName: 'Hindi Assam Vintage',
      startDate: '1999-11-15',
      currentAge: '25 years',
      targetAge: '30 years',
      agingMethod: 'Natural Cave Aging',
      location: 'Heritage Cave B-7',
      container: 'Aged Oak Barrel #3',
      conditions: {
        temperature: '18°C',
        humidity: '58%',
        airFlow: 'Natural'
      },
      qualityChecks: [
        { date: '2019-11-15', grade: 'A+', notes: '20-year mark - Magnificent transformation' },
        { date: '2022-11-15', grade: 'A+', notes: '23-year mark - Legendary status achieved' },
        { date: '2024-01-15', grade: 'A+', notes: '25-year mark - Museum quality specimen' }
      ]
    }
  ];

  const culturalElements = {
    occasions: [
      { name: 'Eid Celebrations', products: ['Royal Cambodian Oud', 'Taif Rose Attar'], significance: 'Sacred festivities' },
      { name: 'Wedding Ceremonies', products: ['Hindi Assam Vintage', 'Jasmine Attar'], significance: 'Auspicious beginnings' },
      { name: 'Ramadan Nights', products: ['Spiritual Blend Oud', 'Musk Attar'], significance: 'Spiritual elevation' },
      { name: 'National Day UAE', products: ['UAE Heritage Blend', 'Desert Rose Attar'], significance: 'National pride' },
      { name: 'Hajj & Umrah', products: ['Makkah Oud', 'Zam Zam Attar'], significance: 'Pilgrimage sanctity' }
    ],
    aromatherapy: [
      { scent: 'Oud', benefits: ['Stress Relief', 'Meditation', 'Spiritual Connection'], usage: 'Evening prayer time' },
      { scent: 'Rose Attar', benefits: ['Emotional Balance', 'Love Enhancement', 'Peace'], usage: 'Family gatherings' },
      { scent: 'Sandalwood', benefits: ['Mental Clarity', 'Focus', 'Relaxation'], usage: 'Study and work' },
      { scent: 'Jasmine', benefits: ['Joy', 'Confidence', 'Sensuality'], usage: 'Special occasions' }
    ],
    traditions: [
      { practice: 'Oud Burning', description: 'Traditional incense burning for home purification' },
      { practice: 'Attar Application', description: 'Traditional oil application behind ears and wrists' },
      { practice: 'Scent Layering', description: 'Combining different attars for personal signature' },
      { practice: 'Gift Giving', description: 'Presenting premium oud as honored gifts' }
    ]
  };

  const seasonalRecommendations = [
    {
      season: 'Summer (June-September)',
      temperature: '35-45°C',
      humidity: '40-70%',
      recommendations: [
        { type: 'Light Attars', examples: ['Rose', 'Jasmine', 'Citrus Blend'], reason: 'Cooling effect in heat' },
        { type: 'Fresh Ouds', examples: ['Green Oud', 'Cambodian Light'], reason: 'Less overwhelming in humidity' }
      ]
    },
    {
      season: 'Winter (December-February)',
      temperature: '15-25°C',
      humidity: '30-50%',
      recommendations: [
        { type: 'Heavy Ouds', examples: ['Hindi Assam', 'Royal Cambodian'], reason: 'Rich warmth in cool weather' },
        { type: 'Resinous Blends', examples: ['Amber Oud', 'Frankincense Mix'], reason: 'Cozy and enveloping' }
      ]
    },
    {
      season: 'Spring/Autumn (March-May, October-November)',
      temperature: '20-30°C',
      humidity: '35-60%',
      recommendations: [
        { type: 'Balanced Ouds', examples: ['Malaysian Blend', 'Vintage Hindi'], reason: 'Perfect for mild weather' },
        { type: 'Floral Attars', examples: ['Taif Rose', 'Mogra', 'Kewda'], reason: 'Harmonious with nature' }
      ]
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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perfume & Oud Specialist Features</h1>
          <p className="text-gray-600">Advanced grading, distillation tracking, and UAE cultural integration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
          <Dialog open={isGradingModalOpen} onOpenChange={setIsGradingModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Award className="h-4 w-4 mr-2" />
                Grade Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Professional Oud/Attar Grading</DialogTitle>
                <DialogDescription>
                  Comprehensive quality assessment following international standards
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {gradingCriteria.map((criteria) => (
                  <div key={criteria.category} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{criteria.category}</h4>
                      <Badge variant="outline">{criteria.weight}% weight</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Score (0-{criteria.maxScore})</Label>
                        <Input type="number" max={criteria.maxScore} placeholder="0" />
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Input placeholder="Quality assessment notes" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <Label className="text-sm text-gray-500">Factors: {criteria.factors.join(', ')}</Label>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGradingModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsGradingModalOpen(false)}>
                  Save Grading
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isDistillationModalOpen} onOpenChange={setIsDistillationModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Distillation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Start New Distillation Batch</DialogTitle>
                <DialogDescription>
                  Configure a new traditional distillation process
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchName">Batch Name</Label>
                  <Input id="batchName" placeholder="Enter batch name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="woodSource">Wood Source</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wood origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cambodia_a">Cambodia - Grade A+</SelectItem>
                      <SelectItem value="india_assam">India - Assam Premium</SelectItem>
                      <SelectItem value="myanmar_a">Myanmar - Grade A</SelectItem>
                      <SelectItem value="laos_wild">Laos - Wild Harvest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="woodWeight">Wood Weight (kg)</Label>
                  <Input id="woodWeight" type="number" placeholder="Enter weight" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Distillation Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="steam">Traditional Steam</SelectItem>
                      <SelectItem value="hydro">Hydro Distillation</SelectItem>
                      <SelectItem value="clay_pot">Clay Pot Method</SelectItem>
                      <SelectItem value="copper">Copper Vessel</SelectItem>
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
                      <SelectItem value="ahmad">Master Ahmad Al-Attar</SelectItem>
                      <SelectItem value="raheem">Ustad Raheem Khan</SelectItem>
                      <SelectItem value="hassan">Master Hassan Ali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedYield">Expected Yield (ml)</Label>
                  <Input id="expectedYield" placeholder="Estimated output" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Initial Notes</Label>
                  <Textarea id="notes" placeholder="Wood quality, preparation notes, etc." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDistillationModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDistillationModalOpen(false)}>
                  Start Distillation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium Oud Stock</p>
                <p className="text-xl sm:text-2xl font-bold">{oudProducts.filter(p => p.type.includes('oud')).length}</p>
                <p className="text-xs text-purple-600">Super A+ grade available</p>
              </div>
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Distillations</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {distillationBatches.filter(b => b.status === 'in_progress').length}
                </p>
                <p className="text-xs text-blue-600">2 batches in progress</p>
              </div>
              <FlaskConical className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aging Products</p>
                <p className="text-xl sm:text-2xl font-bold">{agingPrograms.length}</p>
                <p className="text-xs text-green-600">Up to 25 years aging</p>
              </div>
              <Timer className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cultural Occasions</p>
                <p className="text-xl sm:text-2xl font-bold">{culturalElements.occasions.length}</p>
                <p className="text-xs text-orange-600">UAE heritage focused</p>
              </div>
              <Heart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="grading" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="grading">Grading</TabsTrigger>
          <TabsTrigger value="distillation">Distillation</TabsTrigger>
          <TabsTrigger value="aging">Aging</TabsTrigger>
          <TabsTrigger value="cultural">Cultural</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="aromatherapy">Aromatherapy</TabsTrigger>
          <TabsTrigger value="heritage">Heritage</TabsTrigger>
        </TabsList>

        {/* Grading Tab */}
        <TabsContent value="grading" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Product Quality Grading */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Premium Product Grading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {oudProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.origin}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getGradeColor(product.grade)}>
                              {getGradeIcon(product.grade)}
                              {product.grade}
                            </Badge>
                            <span className="text-sm font-medium">{product.gradeScore}/100</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">AED {product.pricePerTola}/tola</div>
                          <div className="text-sm text-gray-500">{product.currentStock} tola available</div>
                        </div>
                      </div>

                      <Progress value={product.gradeScore} className="h-2" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Age:</span>
                          <span className="ml-1">{product.ageYears} years</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Wood:</span>
                          <span className="ml-1">{product.woodType}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Method:</span>
                          <span className="ml-1">{product.distillationMethod}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Distiller:</span>
                          <span className="ml-1">{product.distiller}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Aroma Profile:</div>
                        <div className="space-y-1 text-xs">
                          <div><span className="font-medium">Top:</span> {product.aroma.topNotes.join(', ')}</div>
                          <div><span className="font-medium">Middle:</span> {product.aroma.middleNotes.join(', ')}</div>
                          <div><span className="font-medium">Base:</span> {product.aroma.baseNotes.join(', ')}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Re-grade
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Grading Criteria */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Grading Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gradingCriteria.map((criteria) => (
                    <div key={criteria.category} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{criteria.category}</h4>
                        <Badge variant="outline">{criteria.weight}%</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Max Score: {criteria.maxScore} points
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {criteria.factors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Grading Scale</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Super A+ (95-100)</span>
                      <span className="text-purple-600">Museum Quality</span>
                    </div>
                    <div className="flex justify-between">
                      <span>A+ (90-94)</span>
                      <span className="text-blue-600">Premium Collection</span>
                    </div>
                    <div className="flex justify-between">
                      <span>A (85-89)</span>
                      <span className="text-green-600">High Quality</span>
                    </div>
                    <div className="flex justify-between">
                      <span>B+ (80-84)</span>
                      <span className="text-yellow-600">Good Quality</span>
                    </div>
                    <div className="flex justify-between">
                      <span>B (75-79)</span>
                      <span className="text-orange-600">Standard</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality Metrics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Quality Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Viscosity</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Transparency</TableHead>
                    <TableHead>Sillage</TableHead>
                    <TableHead>Longevity</TableHead>
                    <TableHead>Certifications</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {oudProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(product.grade)}>
                          {product.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.qualityMetrics.viscosity}</TableCell>
                      <TableCell>{product.qualityMetrics.color}</TableCell>
                      <TableCell>{product.qualityMetrics.transparency}</TableCell>
                      <TableCell>{product.qualityMetrics.sillage}</TableCell>
                      <TableCell>{product.qualityMetrics.longevity}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {product.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs block">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distillation Tab */}
        <TabsContent value="distillation" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Active Distillation Batches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Active Distillation Batches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {distillationBatches.map((batch) => (
                    <div key={batch.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{batch.batchName}</h4>
                          <p className="text-sm text-gray-500">{batch.woodSource}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(batch.status)}>
                              {batch.status}
                            </Badge>
                            {batch.qualityGrade !== 'TBD' && (
                              <Badge className={getGradeColor(batch.qualityGrade)}>
                                {batch.qualityGrade}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{batch.duration}</div>
                          <div className="text-sm text-gray-500">
                            {batch.actualYield > 0 ? `${batch.actualYield}ml` : 'In Progress'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Wood Weight:</span>
                          <span className="ml-1">{batch.woodWeight}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Method:</span>
                          <span className="ml-1">{batch.method}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Distiller:</span>
                          <span className="ml-1">{batch.distiller}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Expected Yield:</span>
                          <span className="ml-1">{batch.expectedYield}</span>
                        </div>
                      </div>

                      {batch.actualYield > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Yield Efficiency</span>
                            <span>{batch.yieldPercentage}%</span>
                          </div>
                          <Progress value={batch.yieldPercentage} className="h-2" />
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Distillation Stages:</div>
                        <div className="grid grid-cols-5 gap-1">
                          {batch.stages.map((stage, index) => (
                            <div key={index} className="text-center">
                              <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                                stage.status === 'completed' ? 'bg-green-500' :
                                stage.status === 'in_progress' ? 'bg-blue-500' :
                                'bg-gray-300'
                              }`}></div>
                              <div className="text-xs">{stage.stage.split(' ')[0]}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <strong>Notes:</strong> {batch.notes}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Monitor
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distillation Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Traditional Distillation Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      method: 'Traditional Steam Distillation',
                      description: 'Classic method using steam to extract oils',
                      duration: '12-20 days',
                      yield: 'High',
                      quality: 'Excellent',
                      bestFor: 'Cambodian, Malaysian Oud'
                    },
                    {
                      method: 'Clay Pot Hydro Distillation',
                      description: 'Ancient technique using clay vessels',
                      duration: '15-25 days',
                      yield: 'Medium',
                      quality: 'Superior',
                      bestFor: 'Hindi Assam, Burma Oud'
                    },
                    {
                      method: 'Copper Vessel Method',
                      description: 'Modern approach with copper equipment',
                      duration: '10-15 days',
                      yield: 'High',
                      quality: 'Good',
                      bestFor: 'Commercial Production'
                    },
                    {
                      method: 'Cold Water Extraction',
                      description: 'Slow extraction for delicate materials',
                      duration: '20-30 days',
                      yield: 'Low',
                      quality: 'Premium',
                      bestFor: 'Vintage Wood, Rare Species'
                    }
                  ].map((method, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">{method.method}</h4>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500">Duration:</span> {method.duration}</div>
                        <div><span className="text-gray-500">Yield:</span> {method.yield}</div>
                        <div><span className="text-gray-500">Quality:</span> {method.quality}</div>
                        <div><span className="text-gray-500">Best For:</span> {method.bestFor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distillation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Distillation Process Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {distillationBatches[1].stages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stage.status === 'completed' ? 'bg-green-500 text-white' :
                      stage.status === 'in_progress' ? 'bg-blue-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{stage.stage}</h4>
                        <Badge className={getStatusColor(stage.status)}>
                          {stage.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Duration: {stage.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aging Tab */}
        <TabsContent value="aging" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Aging Programs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Active Aging Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agingPrograms.map((program) => (
                    <div key={program.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{program.productName}</h4>
                          <p className="text-sm text-gray-500">{program.agingMethod}</p>
                          <div className="text-sm text-blue-600">{program.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{program.currentAge}</div>
                          <div className="text-sm text-gray-500">
                            Target: {program.targetAge}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Aging Progress</span>
                          <span>
                            {((parseInt(program.currentAge) / parseInt(program.targetAge)) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={(parseInt(program.currentAge) / parseInt(program.targetAge)) * 100}
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-medium">{program.conditions.temperature}</div>
                          <div className="text-gray-500">Temperature</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-medium">{program.conditions.humidity}</div>
                          <div className="text-gray-500">Humidity</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <div className="font-medium">{program.conditions.airFlow}</div>
                          <div className="text-gray-500">Air Flow</div>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-500">Container:</span>
                        <span className="ml-1">{program.container}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium">Recent Quality Check:</div>
                        {program.qualityChecks.slice(-1).map((check, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            <Badge className={getGradeColor(check.grade)} variant="outline">
                              {check.grade}
                            </Badge>
                            <span className="ml-2">{check.date}</span>
                            <div className="mt-1">{check.notes}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          History
                        </Button>
                        <Button variant="outline" size="sm">
                          <TestTube className="h-4 w-4 mr-1" />
                          Quality Check
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Aging Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Optimal Aging Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      method: 'Underground Cellar',
                      temperature: '18-22°C',
                      humidity: '60-65%',
                      duration: '5-20 years',
                      bestFor: 'Cambodian, Malaysian Oud',
                      containers: 'Clay Pots, Glass'
                    },
                    {
                      method: 'Natural Cave Aging',
                      temperature: '16-20°C',
                      humidity: '55-60%',
                      duration: '10-30 years',
                      bestFor: 'Hindi Assam, Vintage Oud',
                      containers: 'Oak Barrels, Stone Vessels'
                    },
                    {
                      method: 'Climate Controlled Vault',
                      temperature: '20-24°C',
                      humidity: '50-55%',
                      duration: '3-15 years',
                      bestFor: 'Attars, Blended Oils',
                      containers: 'Glass Bottles, Crystal'
                    },
                    {
                      method: 'Traditional Buried Aging',
                      temperature: '15-18°C',
                      humidity: '65-70%',
                      duration: '15-50 years',
                      bestFor: 'Museum Quality Specimens',
                      containers: 'Sealed Clay Urns'
                    }
                  ].map((condition, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">{condition.method}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500">Temperature:</span> {condition.temperature}</div>
                        <div><span className="text-gray-500">Humidity:</span> {condition.humidity}</div>
                        <div><span className="text-gray-500">Duration:</span> {condition.duration}</div>
                        <div><span className="text-gray-500">Containers:</span> {condition.containers}</div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Best For:</span> {condition.bestFor}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Aging Quality History */}
          <Card>
            <CardHeader>
              <CardTitle>Aging Quality Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Current Age</TableHead>
                    <TableHead>Target Age</TableHead>
                    <TableHead>Current Grade</TableHead>
                    <TableHead>Last Check</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agingPrograms.map((program) => {
                    const progressPercentage = (parseInt(program.currentAge) / parseInt(program.targetAge)) * 100;
                    const lastCheck = program.qualityChecks[program.qualityChecks.length - 1];
                    return (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{program.productName}</TableCell>
                        <TableCell>{program.startDate}</TableCell>
                        <TableCell>{program.currentAge}</TableCell>
                        <TableCell>{program.targetAge}</TableCell>
                        <TableCell>
                          <Badge className={getGradeColor(lastCheck.grade)}>
                            {lastCheck.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>{lastCheck.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercentage} className="w-16 h-2" />
                            <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cultural Tab */}
        <TabsContent value="cultural" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Cultural Occasions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  UAE Cultural Occasions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {culturalElements.occasions.map((occasion, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div>
                        <h4 className="font-medium">{occasion.name}</h4>
                        <p className="text-sm text-gray-600">{occasion.significance}</p>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Recommended Products:</div>
                        <div className="flex flex-wrap gap-2">
                          {occasion.products.map((product, idx) => (
                            <Badge key={idx} variant="outline">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Gift className="h-4 w-4 mr-1" />
                          Create Bundle
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Guide
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traditional Practices */}
            <Card>
              <CardHeader>
                <CardTitle>Traditional Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {culturalElements.traditions.map((tradition, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">{tradition.practice}</h4>
                      <p className="text-sm text-gray-600">{tradition.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Cultural Guidelines</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Respect traditional application methods</li>
                    <li>• Understand religious and cultural significance</li>
                    <li>• Provide authentic origin stories</li>
                    <li>• Honor master distillers and heritage</li>
                    <li>• Educate customers on proper usage</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cultural Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>UAE Cultural Calendar & Fragrance Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { month: 'January', occasion: 'New Year Celebrations', fragrance: 'Fresh Attars, Light Ouds' },
                  { month: 'February', occasion: 'UAE National Heritage', fragrance: 'Traditional Oud Blends' },
                  { month: 'March', occasion: 'Spring Festivals', fragrance: 'Floral Attars, Rose Blends' },
                  { month: 'April', occasion: 'Ramadan Preparation', fragrance: 'Spiritual Ouds, Musk' },
                  { month: 'May', occasion: 'Eid Al-Fitr', fragrance: 'Premium Cambodian Oud' },
                  { month: 'June', occasion: 'Summer Gatherings', fragrance: 'Light Rose, Jasmine Attar' },
                  { month: 'July', occasion: 'Hajj Season', fragrance: 'Sacred Makkah Oud' },
                  { month: 'August', occasion: 'Family Reunions', fragrance: 'Vintage Hindi Assam' },
                  { month: 'September', occasion: 'Back to School', fragrance: 'Energizing Citrus Blends' },
                  { month: 'October', occasion: 'Wedding Season', fragrance: 'Luxury Oud Collections' },
                  { month: 'November', occasion: 'National Day UAE', fragrance: 'Heritage Oud Blends' },
                  { month: 'December', occasion: 'Winter Celebrations', fragrance: 'Warm Amber Ouds' }
                ].map((item, index) => (
                  <div key={index} className="border rounded-lg p-3 text-center">
                    <h4 className="font-medium">{item.month}</h4>
                    <div className="text-sm text-gray-600 my-2">{item.occasion}</div>
                    <Badge variant="outline" className="text-xs">
                      {item.fragrance}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Tab */}
        <TabsContent value="seasonal" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                UAE Seasonal Fragrance Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {seasonalRecommendations.map((season, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-lg">{season.season}</h4>
                      <div className="text-sm text-gray-500">
                        {season.temperature} • {season.humidity} humidity
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {season.recommendations.map((rec, idx) => (
                        <div key={idx} className="border rounded-lg p-3">
                          <h5 className="font-medium mb-2">{rec.type}</h5>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {rec.examples.map((example, exIdx) => (
                                <Badge key={exIdx} variant="outline" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">{rec.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Impact Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Weather Impact on Fragrance Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    condition: 'High Heat (40°C+)',
                    icon: <Sun className="h-5 w-5 text-orange-500" />,
                    effect: 'Accelerated evaporation',
                    recommendation: 'Apply less, choose lighter attars',
                    avoid: 'Heavy oud oils, alcohol-based perfumes'
                  },
                  {
                    condition: 'High Humidity (70%+)',
                    icon: <Cloud className="h-5 w-5 text-blue-500" />,
                    effect: 'Reduced projection',
                    recommendation: 'Use oil-based attars, apply to pulse points',
                    avoid: 'Aqueous solutions, over-application'
                  },
                  {
                    condition: 'Dry Air (30%)',
                    icon: <Wind className="h-5 w-5 text-yellow-500" />,
                    effect: 'Enhanced sillage',
                    recommendation: 'Perfect for all fragrance types',
                    avoid: 'Nothing specific, ideal conditions'
                  },
                  {
                    condition: 'Cool Weather (15-25°C)',
                    icon: <Moon className="h-5 w-5 text-purple-500" />,
                    effect: 'Better longevity',
                    recommendation: 'Heavy ouds, complex blends',
                    avoid: 'Light florals may seem weak'
                  },
                  {
                    condition: 'Sandstorm/Dust',
                    icon: <Mountain className="h-5 w-5 text-amber-500" />,
                    effect: 'Fragrance masking',
                    recommendation: 'Strong, penetrating scents',
                    avoid: 'Delicate, subtle fragrances'
                  },
                  {
                    condition: 'Coastal Areas',
                    icon: <Waves className="h-5 w-5 text-teal-500" />,
                    effect: 'Salt air interaction',
                    recommendation: 'Marine-compatible blends',
                    avoid: 'Very sweet compositions'
                  }
                ].map((guide, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      {guide.icon}
                      <h4 className="font-medium">{guide.condition}</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Effect:</strong> {guide.effect}</div>
                      <div><strong>Recommendation:</strong> {guide.recommendation}</div>
                      <div><strong>Avoid:</strong> {guide.avoid}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aromatherapy Tab */}
        <TabsContent value="aromatherapy" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Aromatherapy Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Traditional Aromatherapy Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {culturalElements.aromatherapy.map((therapy, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-medium">{therapy.scent}</h4>

                      <div>
                        <div className="text-sm font-medium mb-2">Benefits:</div>
                        <div className="flex flex-wrap gap-2">
                          {therapy.benefits.map((benefit, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">Best Used:</span>
                        <span className="ml-2 text-gray-600">{therapy.usage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wellness Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Wellness & Therapeutic Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      category: 'Stress & Anxiety Relief',
                      scents: ['Sandalwood Attar', 'Rose Oil', 'Lavender Blend'],
                      method: 'Apply to temples and wrists',
                      timing: 'Evening, before meditation'
                    },
                    {
                      category: 'Mental Clarity & Focus',
                      scents: ['Oud Cambodian', 'Rosemary Attar', 'Eucalyptus'],
                      method: 'Inhale directly or diffuse',
                      timing: 'Morning, during work'
                    },
                    {
                      category: 'Spiritual Connection',
                      scents: ['Sacred Oud', 'Frankincense', 'Myrrh Blend'],
                      method: 'Apply before prayer/meditation',
                      timing: 'Prayer times, spiritual practices'
                    },
                    {
                      category: 'Sleep & Relaxation',
                      scents: ['Chamomile Attar', 'Vanilla Oud', 'Jasmine'],
                      method: 'Apply to chest and pillow',
                      timing: 'Before bedtime'
                    },
                    {
                      category: 'Confidence & Energy',
                      scents: ['Hindi Assam Oud', 'Amber Blend', 'Musk'],
                      method: 'Apply to pulse points',
                      timing: 'Important meetings, events'
                    }
                  ].map((wellness, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">{wellness.category}</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Recommended Scents:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {wellness.scents.map((scent, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {scent}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div><span className="font-medium">Method:</span> {wellness.method}</div>
                        <div><span className="font-medium">Best Timing:</span> {wellness.timing}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Wellness Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Aromatherapy Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: 'Fajr (5:30 AM)', activity: 'Morning Prayer', scent: 'Sacred Oud, Sandalwood', purpose: 'Spiritual connection' },
                  { time: 'Sunrise (6:30 AM)', activity: 'Morning Energy', scent: 'Citrus Attar, Fresh Oud', purpose: 'Alertness and vitality' },
                  { time: 'Dhuhr (12:30 PM)', activity: 'Midday Prayer', scent: 'Rose Attar, Light Musk', purpose: 'Balance and peace' },
                  { time: 'Asr (3:30 PM)', activity: 'Afternoon Focus', scent: 'Oud Blend, Rosemary', purpose: 'Mental clarity' },
                  { time: 'Maghrib (6:30 PM)', activity: 'Evening Prayer', scent: 'Traditional Oud, Amber', purpose: 'Gratitude and reflection' },
                  { time: 'Isha (8:00 PM)', activity: 'Night Prayer', scent: 'Frankincense, Myrrh', purpose: 'Spiritual peace' },
                  { time: 'Before Sleep (10:00 PM)', activity: 'Rest Preparation', scent: 'Jasmine, Vanilla Oud', purpose: 'Relaxation and dreams' }
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="text-center min-w-20">
                      <div className="font-medium text-sm">{schedule.time}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{schedule.activity}</div>
                      <div className="text-sm text-gray-600">{schedule.scent}</div>
                    </div>
                    <div className="text-sm text-blue-600">
                      {schedule.purpose}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Heritage Tab */}
        <TabsContent value="heritage" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Master Distillers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Master Distillers Heritage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Master Ahmad Al-Attar',
                      origin: 'UAE - Al Ain',
                      experience: '35 years',
                      specialty: 'Cambodian Oud Distillation',
                      heritage: 'Third generation distiller',
                      signature: 'Royal Cambodian Collection',
                      achievements: ['UNESCO Recognition', 'Heritage Craftsman Award']
                    },
                    {
                      name: 'Ustad Raheem Khan',
                      origin: 'India - Assam',
                      experience: '42 years',
                      specialty: 'Hindi Assam Traditional Methods',
                      heritage: 'Family tradition since 1850',
                      signature: 'Vintage Hindi Collection',
                      achievements: ['Master Craftsman Certificate', 'Cultural Heritage Keeper']
                    },
                    {
                      name: 'Master Hassan Ali',
                      origin: 'Oman - Salalah',
                      experience: '28 years',
                      specialty: 'Frankincense & Omani Oud',
                      heritage: 'Royal court perfumer lineage',
                      signature: 'Sacred Frankincense Blends',
                      achievements: ['Royal Warrant', 'Heritage Preservation Award']
                    }
                  ].map((master, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{master.name}</h4>
                          <p className="text-sm text-gray-500">{master.origin}</p>
                        </div>
                        <Badge variant="outline">{master.experience}</Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Specialty:</span> {master.specialty}</div>
                        <div><span className="font-medium">Heritage:</span> {master.heritage}</div>
                        <div><span className="font-medium">Signature:</span> {master.signature}</div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">Achievements:</div>
                        <div className="flex flex-wrap gap-1">
                          {master.achievements.map((achievement, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Historical Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Oud & Attar Heritage Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { period: '3000 BCE', event: 'Ancient Egypt uses aromatic resins', region: 'Egypt & Middle East' },
                    { period: '1500 BCE', event: 'Oud mentioned in Sanskrit texts', region: 'India & Southeast Asia' },
                    { period: '500 CE', event: 'Islamic Golden Age perfumery', region: 'Arabian Peninsula' },
                    { period: '1200 CE', event: 'Distillation techniques refined', region: 'Persia & Arabia' },
                    { period: '1400 CE', event: 'Trade routes establish oud commerce', region: 'Silk Road' },
                    { period: '1700 CE', event: 'Royal courts adopt oud culture', region: 'Mughal Empire' },
                    { period: '1971', event: 'UAE formation, cultural preservation', region: 'United Arab Emirates' },
                    { period: '2020', event: 'Modern heritage revival programs', region: 'Global' }
                  ].map((timeline, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <div className="w-20 text-sm font-medium text-blue-600">
                        {timeline.period}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{timeline.event}</div>
                        <div className="text-sm text-gray-500">{timeline.region}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cultural Significance */}
          <Card>
            <CardHeader>
              <CardTitle>Cultural & Spiritual Significance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Religious Significance</h4>
                  <div className="space-y-3">
                    {[
                      { aspect: 'Islamic Tradition', description: 'Oud mentioned in Hadith as preferred by Prophet Muhammad (PBUH)' },
                      { aspect: 'Prayer Enhancement', description: 'Used before prayers for spiritual purification and focus' },
                      { aspect: 'Hajj & Umrah', description: 'Traditional application during pilgrimage rituals' },
                      { aspect: 'Ramadan Traditions', description: 'Evening application during iftar and tarawih prayers' }
                    ].map((item, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-3">
                        <div className="font-medium text-sm">{item.aspect}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Social & Cultural Role</h4>
                  <div className="space-y-3">
                    {[
                      { aspect: 'Hospitality', description: 'Offering oud to guests as sign of respect and welcome' },
                      { aspect: 'Celebrations', description: 'Essential element in weddings, Eid, and special occasions' },
                      { aspect: 'Status Symbol', description: 'Quality oud represents refinement and cultural appreciation' },
                      { aspect: 'Heritage Preservation', description: 'Maintaining traditional knowledge and practices' }
                    ].map((item, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-3">
                        <div className="font-medium text-sm">{item.aspect}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preservation Efforts */}
          <Card>
            <CardHeader>
              <CardTitle>UAE Heritage Preservation Initiatives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    initiative: 'UNESCO Recognition',
                    description: 'Traditional oud distillation techniques listed as intangible heritage',
                    status: 'Active',
                    impact: 'Global awareness'
                  },
                  {
                    initiative: 'Master Craftsman Program',
                    description: 'Training next generation of traditional distillers',
                    status: 'Ongoing',
                    impact: 'Knowledge transfer'
                  },
                  {
                    initiative: 'Cultural Documentation',
                    description: 'Recording traditional methods and oral histories',
                    status: 'Expanding',
                    impact: 'Historical preservation'
                  },
                  {
                    initiative: 'Youth Education',
                    description: 'School programs teaching traditional perfumery',
                    status: 'Growing',
                    impact: 'Cultural continuity'
                  },
                  {
                    initiative: 'International Exhibitions',
                    description: 'Showcasing UAE oud heritage globally',
                    status: 'Regular',
                    impact: 'Cultural diplomacy'
                  },
                  {
                    initiative: 'Research Partnerships',
                    description: 'Academic studies on traditional practices',
                    status: 'Active',
                    impact: 'Scientific validation'
                  }
                ].map((initiative, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">{initiative.initiative}</h4>
                    <p className="text-sm text-gray-600">{initiative.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{initiative.status}</Badge>
                      <span className="text-xs text-blue-600">{initiative.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerfumeOudFeatures;