'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Factory,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Pause,
  Square,
  Calendar,
  Thermometer,
  Droplets,
  Scale,
  Beaker,
  Flask,
  TestTube,
  Target,
  TrendingUp,
  BarChart3,
  Building,
  Eye,
  Edit,
  Trash2,
  Settings,
  Timer,
  Zap,
  Archive,
  Star,
  Crown,
  Gem,
  Percent,
  DollarSign,
  Package,
  Users,
  FileText,
  PieChart,
  Activity,
  Award,
  BookOpen,
  ChefHat,
  Layers
} from 'lucide-react';

// Recipe/Formula definitions for perfume and oud production
const productionRecipes = [
  {
    id: 'RECIPE001',
    name: 'Royal Oud Signature Blend',
    nameArabic: 'خلطة العود الملكي المميزة',
    type: 'Blending',
    category: 'Premium Oud',
    version: '2.1',
    status: 'active',
    lastUpdated: '2024-01-15',
    creator: 'Master Perfumer Ahmad',
    totalYield: 1000, // ml
    productionTime: 480, // minutes (8 hours)
    difficulty: 'Expert',
    qualityGrade: 'A+',
    costPerBatch: 4850,
    ingredients: [
      {
        id: 'RM001',
        name: 'Cambodian Oud Oil - Premium',
        nameArabic: 'زيت العود الكمبودي الفاخر',
        quantity: 450,
        unit: 'ml',
        percentage: 45,
        cost: 2250,
        supplier: 'Asia Oud Trading',
        qualityRequirement: 'A+',
        notes: 'Must be aged minimum 6 months'
      },
      {
        id: 'RM002',
        name: 'Rose Attar Concentrate',
        nameArabic: 'مركز عطر الورد',
        quantity: 150,
        unit: 'ml',
        percentage: 15,
        cost: 750,
        supplier: 'Bulgarian Rose Co.',
        qualityRequirement: 'A',
        notes: 'Fresh batch preferred'
      },
      {
        id: 'RM003',
        name: 'Sandalwood Base Oil',
        nameArabic: 'زيت الصندل الأساسي',
        quantity: 200,
        unit: 'ml',
        percentage: 20,
        cost: 600,
        supplier: 'Indian Sandalwood Ltd.',
        qualityRequirement: 'A',
        notes: 'Mysore sandalwood only'
      },
      {
        id: 'RM004',
        name: 'Carrier Oil - Jojoba',
        nameArabic: 'زيت الجوجوبا الحامل',
        quantity: 200,
        unit: 'ml',
        percentage: 20,
        cost: 120,
        supplier: 'Natural Oils UAE',
        qualityRequirement: 'Premium',
        notes: 'Cold-pressed organic'
      }
    ],
    productionSteps: [
      {
        step: 1,
        title: 'Preparation & Quality Check',
        titleArabic: 'التحضير وفحص الجودة',
        duration: 60,
        temperature: 'Room Temperature (20-25°C)',
        description: 'Inspect all ingredients for quality, check expiry dates, and verify authenticity certificates.',
        equipment: ['Digital Scale', 'Quality Testing Kit', 'pH Strips'],
        warnings: ['Ensure all oils are at room temperature', 'Check for any contamination'],
        qualityChecks: ['Visual inspection', 'Aroma assessment', 'Viscosity check']
      },
      {
        step: 2,
        title: 'Base Oil Preparation',
        titleArabic: 'تحضير الزيت الأساسي',
        duration: 90,
        temperature: '25-30°C',
        description: 'Gently warm carrier oils and sandalwood base to optimal blending temperature.',
        equipment: ['Heating Bath', 'Thermometer', 'Stirring Rod'],
        warnings: ['Do not exceed 30°C to preserve oil quality', 'Stir gently to avoid aeration'],
        qualityChecks: ['Temperature monitoring', 'Homogeneity check']
      },
      {
        step: 3,
        title: 'Premium Oil Integration',
        titleArabic: 'دمج الزيوت الفاخرة',
        duration: 120,
        temperature: '20-25°C',
        description: 'Slowly blend oud oil and rose attar into the base, maintaining temperature control.',
        equipment: ['Precision Mixer', 'Temperature Controller', 'Glass Vessels'],
        warnings: ['Add premium oils drop by drop', 'Monitor for any separation'],
        qualityChecks: ['Blend uniformity', 'Aroma balance', 'Color consistency']
      },
      {
        step: 4,
        title: 'Maturation Process',
        titleArabic: 'عملية النضج',
        duration: 180,
        temperature: '18-22°C',
        description: 'Allow the blend to mature and develop its full aroma profile.',
        equipment: ['Maturation Tanks', 'Climate Control', 'Aroma Testing Kit'],
        warnings: ['Maintain stable temperature', 'Minimize exposure to light'],
        qualityChecks: ['Periodic aroma assessment', 'Stability testing']
      },
      {
        step: 5,
        title: 'Final Quality Control & Packaging',
        titleArabic: 'مراقبة الجودة النهائية والتعبئة',
        duration: 30,
        temperature: 'Room Temperature',
        description: 'Final quality assessment, filtering if needed, and packaging in appropriate containers.',
        equipment: ['Fine Filters', 'Quality Lab', 'Packaging Equipment'],
        warnings: ['Handle with care to maintain quality', 'Use sterilized containers'],
        qualityChecks: ['Final aroma test', 'Visual clarity', 'Batch documentation']
      }
    ],
    qualityStandards: {
      aroma: 'Complex, balanced, long-lasting',
      color: 'Deep amber to dark brown',
      viscosity: 'Medium (15-25 cP)',
      clarity: 'Clear without sediment',
      shelfLife: '36 months',
      storage: 'Cool, dark place (15-25°C)'
    },
    expectedOutput: {
      totalVolume: 1000,
      unit: 'ml',
      wastePercentage: 2,
      qualityGrade: 'Premium',
      batchYield: 98
    },
    costs: {
      rawMaterials: 3720,
      labor: 850,
      overhead: 280,
      total: 4850,
      costPerMl: 4.85
    }
  },
  {
    id: 'RECIPE002',
    name: 'Traditional Bakhoor Mix',
    nameArabic: 'خلطة البخور التقليدية',
    type: 'Mixing',
    category: 'Bakhoor',
    version: '1.5',
    status: 'active',
    lastUpdated: '2024-01-20',
    creator: 'Traditional Master Hassan',
    totalYield: 5000, // grams
    productionTime: 360, // minutes (6 hours)
    difficulty: 'Intermediate',
    qualityGrade: 'A',
    costPerBatch: 2400,
    ingredients: [
      {
        id: 'RM005',
        name: 'Oud Chips - Assorted Grades',
        nameArabic: 'قطع العود - درجات متنوعة',
        quantity: 2000,
        unit: 'grams',
        percentage: 40,
        cost: 1200,
        supplier: 'Various Suppliers',
        qualityRequirement: 'Mixed A/B Grade',
        notes: 'Mix of different origins for complexity'
      },
      {
        id: 'RM006',
        name: 'Sandalwood Powder',
        nameArabic: 'مسحوق خشب الصندل',
        quantity: 1500,
        unit: 'grams',
        percentage: 30,
        cost: 450,
        supplier: 'Indian Sandalwood Ltd.',
        qualityRequirement: 'Fine Grade',
        notes: 'Finely ground, aromatic'
      },
      {
        id: 'RM007',
        name: 'Rose Petals - Dried',
        nameArabic: 'بتلات الورد المجففة',
        quantity: 750,
        unit: 'grams',
        percentage: 15,
        cost: 300,
        supplier: 'Bulgarian Rose Co.',
        qualityRequirement: 'Premium',
        notes: 'Properly dried, aromatic'
      },
      {
        id: 'RM008',
        name: 'Natural Binding Agent',
        nameArabic: 'المادة الرابطة الطبيعية',
        quantity: 500,
        unit: 'grams',
        percentage: 10,
        cost: 150,
        supplier: 'Natural Binders Co.',
        qualityRequirement: 'Food Grade',
        notes: 'Natural gum-based binder'
      },
      {
        id: 'RM009',
        name: 'Traditional Spices Mix',
        nameArabic: 'خلطة البهارات التقليدية',
        quantity: 250,
        unit: 'grams',
        percentage: 5,
        cost: 300,
        supplier: 'Spice Masters Dubai',
        qualityRequirement: 'Premium',
        notes: 'Cardamom, cinnamon, cloves blend'
      }
    ],
    productionSteps: [
      {
        step: 1,
        title: 'Material Preparation',
        titleArabic: 'تحضير المواد',
        duration: 60,
        temperature: 'Room Temperature',
        description: 'Sort and prepare all ingredients, ensuring proper sizing and quality.',
        equipment: ['Industrial Sieves', 'Weighing Scales', 'Mixing Bowls'],
        warnings: ['Check for foreign objects', 'Ensure uniform sizing'],
        qualityChecks: ['Size consistency', 'Quality grading', 'Moisture content']
      },
      {
        step: 2,
        title: 'Dry Mixing',
        titleArabic: 'الخلط الجاف',
        duration: 120,
        temperature: 'Room Temperature',
        description: 'Blend dry ingredients in specific order to achieve optimal distribution.',
        equipment: ['Industrial Mixer', 'Dust Control', 'Sampling Tools'],
        warnings: ['Minimize dust exposure', 'Maintain ingredient ratios'],
        qualityChecks: ['Blend uniformity', 'Color distribution', 'Aroma balance']
      },
      {
        step: 3,
        title: 'Moisture Addition & Binding',
        titleArabic: 'إضافة الرطوبة والربط',
        duration: 90,
        temperature: '25-30°C',
        description: 'Add binding agents and achieve optimal moisture content for molding.',
        equipment: ['Spray System', 'Moisture Meter', 'Paddle Mixer'],
        warnings: ['Control moisture carefully', 'Ensure even distribution'],
        qualityChecks: ['Moisture content (8-12%)', 'Binding effectiveness', 'Moldability']
      },
      {
        step: 4,
        title: 'Shaping & Molding',
        titleArabic: 'التشكيل والقولبة',
        duration: 60,
        temperature: 'Room Temperature',
        description: 'Shape the mixture into traditional bakhoor forms (cones, tablets, etc.).',
        equipment: ['Molding Presses', 'Shape Templates', 'Drying Racks'],
        warnings: ['Apply consistent pressure', 'Handle gently when removing'],
        qualityChecks: ['Shape consistency', 'Structural integrity', 'Surface quality']
      },
      {
        step: 5,
        title: 'Drying & Curing',
        titleArabic: 'التجفيف والمعالجة',
        duration: 30,
        temperature: '30-35°C',
        description: 'Controlled drying to achieve optimal moisture and hardness.',
        equipment: ['Drying Chambers', 'Air Circulation', 'Humidity Control'],
        warnings: ['Avoid rapid drying', 'Monitor for cracking'],
        qualityChecks: ['Moisture level (5-8%)', 'Hardness test', 'Aroma retention']
      }
    ],
    qualityStandards: {
      aroma: 'Rich, traditional, long-lasting',
      color: 'Natural brown variations',
      hardness: 'Firm but not brittle',
      burnQuality: 'Clean, steady burn',
      shelfLife: '24 months',
      storage: 'Dry place (humidity <60%)'
    },
    expectedOutput: {
      totalVolume: 5000,
      unit: 'grams',
      wastePercentage: 3,
      qualityGrade: 'Premium',
      batchYield: 97
    },
    costs: {
      rawMaterials: 2400,
      labor: 450,
      overhead: 150,
      total: 3000,
      costPerGram: 0.60
    }
  }
];

// Current production batches
const productionBatches = [
  {
    id: 'BATCH001',
    recipeId: 'RECIPE001',
    recipeName: 'Royal Oud Signature Blend',
    status: 'in_progress',
    currentStep: 3,
    totalSteps: 5,
    progress: 60,
    startDate: '2024-01-22',
    estimatedCompletion: '2024-01-22',
    assignedOperator: 'Ahmad Al-Kindi',
    facility: 'Production Lab A',
    batchSize: 1000,
    unit: 'ml',
    qualityScore: 9.2,
    notes: 'Running smoothly, all quality checks passed',
    alerts: [],
    actualCosts: 4650,
    timeElapsed: 300, // minutes
    timeRemaining: 180
  },
  {
    id: 'BATCH002',
    recipeId: 'RECIPE002',
    recipeName: 'Traditional Bakhoor Mix',
    status: 'completed',
    currentStep: 5,
    totalSteps: 5,
    progress: 100,
    startDate: '2024-01-21',
    completionDate: '2024-01-21',
    assignedOperator: 'Hassan Mohammed',
    facility: 'Bakhoor Workshop',
    batchSize: 5000,
    unit: 'grams',
    qualityScore: 9.5,
    notes: 'Excellent batch, above expected quality',
    alerts: [],
    actualCosts: 2950,
    finalYield: 4850, // grams
    wastePercentage: 3
  },
  {
    id: 'BATCH003',
    recipeId: 'RECIPE001',
    recipeName: 'Royal Oud Signature Blend',
    status: 'pending',
    currentStep: 0,
    totalSteps: 5,
    progress: 0,
    scheduledStart: '2024-01-23',
    estimatedCompletion: '2024-01-23',
    assignedOperator: 'Fatima Al-Zahra',
    facility: 'Production Lab B',
    batchSize: 1000,
    unit: 'ml',
    notes: 'Waiting for raw material RM002 delivery',
    alerts: ['Raw material shortage: Rose Attar Concentrate'],
    estimatedCosts: 4850
  }
];

// Production facilities
const productionFacilities = [
  {
    id: 'LAB001',
    name: 'Production Lab A',
    nameArabic: 'مختبر الإنتاج أ',
    type: 'Premium Oil Blending',
    capacity: '2000ml/day',
    status: 'active',
    currentBatch: 'BATCH001',
    equipment: ['Precision Mixers', 'Temperature Control', 'Quality Testing'],
    operators: ['Ahmad Al-Kindi', 'Sara Ahmed'],
    location: 'Main Factory - Floor 2'
  },
  {
    id: 'LAB002',
    name: 'Production Lab B',
    nameArabic: 'مختبر الإنتاج ب',
    type: 'Premium Oil Blending',
    capacity: '2000ml/day',
    status: 'available',
    currentBatch: null,
    equipment: ['Precision Mixers', 'Temperature Control', 'Quality Testing'],
    operators: ['Fatima Al-Zahra', 'Omar Hassan'],
    location: 'Main Factory - Floor 2'
  },
  {
    id: 'WORKSHOP001',
    name: 'Bakhoor Workshop',
    nameArabic: 'ورشة البخور',
    type: 'Bakhoor Production',
    capacity: '10kg/day',
    status: 'available',
    currentBatch: null,
    equipment: ['Industrial Mixers', 'Molding Presses', 'Drying Chambers'],
    operators: ['Hassan Mohammed', 'Khalid Rahman'],
    location: 'Main Factory - Floor 1'
  },
  {
    id: 'DIST001',
    name: 'Distillation Unit',
    nameArabic: 'وحدة التقطير',
    type: 'Oil Distillation',
    capacity: '500ml/day',
    status: 'maintenance',
    currentBatch: null,
    equipment: ['Steam Distillation', 'Condensers', 'Collection Vessels'],
    operators: ['Master Distiller Yusuf'],
    location: 'Specialized Wing'
  }
];

export default function ProductionManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [isNewRecipeDialogOpen, setIsNewRecipeDialogOpen] = useState(false);
  const [isNewBatchDialogOpen, setIsNewBatchDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Calculate production statistics
  const calculateProductionStats = () => {
    const totalBatches = productionBatches.length;
    const activeBatches = productionBatches.filter(b => b.status === 'in_progress').length;
    const completedBatches = productionBatches.filter(b => b.status === 'completed').length;
    const pendingBatches = productionBatches.filter(b => b.status === 'pending').length;

    const totalValue = productionBatches.reduce((sum, batch) => {
      return sum + (batch.actualCosts || batch.estimatedCosts || 0);
    }, 0);

    const avgQualityScore = productionBatches
      .filter(b => b.qualityScore)
      .reduce((sum, batch) => sum + batch.qualityScore, 0) /
      productionBatches.filter(b => b.qualityScore).length;

    const activeFacilities = productionFacilities.filter(f => f.status === 'active').length;

    return {
      totalBatches,
      activeBatches,
      completedBatches,
      pendingBatches,
      totalValue,
      avgQualityScore: avgQualityScore || 0,
      activeFacilities,
      totalFacilities: productionFacilities.length
    };
  };

  const stats = calculateProductionStats();

  // Get status color for badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'in_progress':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      case 'available':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render recipe card
  const renderRecipeCard = (recipe: any) => (
    <Card key={recipe.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedRecipe(recipe)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-sm">{recipe.name}</h3>
              <Badge variant="outline" className="text-xs">
                v{recipe.version}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">{recipe.nameArabic}</p>
            <p className="text-xs text-gray-500">{recipe.category}</p>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(recipe.status)} variant="secondary">
              {recipe.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Yield:</span>
            <span className="font-medium">{recipe.totalYield} {recipe.totalYield > 1000 ? 'ml' : 'g'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{Math.floor(recipe.productionTime / 60)}h {recipe.productionTime % 60}m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cost/Batch:</span>
            <span className="font-medium text-green-600">AED {recipe.costPerBatch.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Difficulty:</span>
            <Badge variant="outline" className="text-xs">
              {recipe.difficulty === 'Expert' && <Crown className="h-2 w-2 mr-1" />}
              {recipe.difficulty === 'Intermediate' && <Star className="h-2 w-2 mr-1" />}
              {recipe.difficulty}
            </Badge>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 pt-2 border-t">
          <span className="text-xs text-gray-500">{recipe.creator}</span>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render batch card
  const renderBatchCard = (batch: any) => (
    <Card key={batch.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedBatch(batch)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-sm">{batch.recipeName}</h3>
              <Badge className={getStatusColor(batch.status)} variant="secondary">
                {batch.status}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">{batch.id}</p>
            <p className="text-xs text-gray-500">{batch.facility}</p>
          </div>
          <div className="text-right">
            {batch.status === 'in_progress' && (
              <div className="text-xs">
                <Progress value={batch.progress} className="w-16 h-2 mb-1" />
                <span className="text-gray-600">{batch.progress}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Batch Size:</span>
            <span className="font-medium">{batch.batchSize} {batch.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Operator:</span>
            <span className="font-medium">{batch.assignedOperator}</span>
          </div>
          {batch.qualityScore && (
            <div className="flex justify-between">
              <span className="text-gray-600">Quality Score:</span>
              <span className="font-medium text-amber-600">{batch.qualityScore}/10</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Cost:</span>
            <span className="font-medium text-green-600">
              AED {(batch.actualCosts || batch.estimatedCosts).toLocaleString()}
            </span>
          </div>
          {batch.status === 'in_progress' && batch.timeRemaining && (
            <div className="flex justify-between">
              <span className="text-gray-600">Time Remaining:</span>
              <span className="font-medium text-blue-600">
                {Math.floor(batch.timeRemaining / 60)}h {batch.timeRemaining % 60}m
              </span>
            </div>
          )}
        </div>

        {batch.alerts && batch.alerts.length > 0 && (
          <div className="mt-3 pt-2 border-t">
            {batch.alerts.map((alert: string, index: number) => (
              <div key={index} className="flex items-center text-xs text-orange-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {alert}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-3 pt-2 border-t">
          <span className="text-xs text-gray-500">
            {batch.status === 'completed' ? batch.completionDate :
             batch.status === 'in_progress' ? `Started ${batch.startDate}` :
             `Scheduled ${batch.scheduledStart}`}
          </span>
          <div className="flex space-x-1">
            {batch.status === 'in_progress' && (
              <>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Pause className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Square className="h-3 w-3" />
                </Button>
              </>
            )}
            {batch.status === 'pending' && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Play className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Factory className="h-6 w-6 mr-2 text-orange-600" />
              Production Management
            </h1>
            <Badge className="bg-orange-100 text-orange-800">
              <Activity className="h-3 w-3 mr-1" />
              {stats.activeBatches} Active Batches
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Dialog open={isNewBatchDialogOpen} onOpenChange={setIsNewBatchDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-1" />
                  New Batch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Production Batch</DialogTitle>
                  <DialogDescription>
                    Create a new production batch from an existing recipe
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Select Recipe</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a recipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {productionRecipes.map(recipe => (
                          <SelectItem key={recipe.id} value={recipe.id}>
                            {recipe.name} (v{recipe.version})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Batch Size</Label>
                      <Input type="number" placeholder="1000" />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="ml" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="grams">grams</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Assign Operator</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahmad">Ahmad Al-Kindi</SelectItem>
                        <SelectItem value="fatima">Fatima Al-Zahra</SelectItem>
                        <SelectItem value="hassan">Hassan Mohammed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Production Facility</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {productionFacilities.filter(f => f.status === 'available').map(facility => (
                          <SelectItem key={facility.id} value={facility.id}>
                            {facility.name} - {facility.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewBatchDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsNewBatchDialogOpen(false)}>
                      Start Production
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Batches</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.activeBatches}</p>
                  <p className="text-xs text-gray-500">of {stats.totalBatches} total</p>
                </div>
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Production Value</p>
                  <p className="text-2xl font-bold text-green-600">AED {stats.totalValue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">current batches</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Quality</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.avgQualityScore.toFixed(1)}/10</p>
                  <p className="text-xs text-gray-500">quality score</p>
                </div>
                <Award className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Facilities</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.activeFacilities}</p>
                  <p className="text-xs text-gray-500">of {stats.totalFacilities} total</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Production Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="batches">Production Batches ({productionBatches.length})</TabsTrigger>
            <TabsTrigger value="recipes">Recipes & Formulas ({productionRecipes.length})</TabsTrigger>
            <TabsTrigger value="facilities">Facilities ({productionFacilities.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Active Production Batches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productionBatches.filter(b => b.status === 'in_progress').map(batch => (
                      <div key={batch.id} className="border rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-sm">{batch.recipeName}</h4>
                          <Badge className={getStatusColor(batch.status)} variant="secondary">
                            Step {batch.currentStep}/{batch.totalSteps}
                          </Badge>
                        </div>
                        <Progress value={batch.progress} className="mb-2" />
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{batch.assignedOperator}</span>
                          <span>{Math.floor(batch.timeRemaining / 60)}h {batch.timeRemaining % 60}m remaining</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Facility Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {productionFacilities.map(facility => (
                      <div key={facility.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <h4 className="font-medium text-sm">{facility.name}</h4>
                          <p className="text-xs text-gray-600">{facility.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(facility.status)} variant="secondary">
                            {facility.status}
                          </Badge>
                          {facility.currentBatch && (
                            <p className="text-xs text-gray-600 mt-1">{facility.currentBatch}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="batches" className="mt-6">
            <div className="mb-4 flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search batches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productionBatches
                .filter(batch =>
                  (statusFilter === 'all' || batch.status === statusFilter) &&
                  (searchTerm === '' ||
                   batch.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   batch.assignedOperator.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                )
                .map(renderBatchCard)}
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isNewRecipeDialogOpen} onOpenChange={setIsNewRecipeDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    New Recipe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Recipe</DialogTitle>
                    <DialogDescription>
                      Create a new production recipe or formula
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Recipe Name</Label>
                        <Input placeholder="Recipe name" />
                      </div>
                      <div>
                        <Label>Arabic Name</Label>
                        <Input placeholder="الاسم بالعربية" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oud">Premium Oud</SelectItem>
                            <SelectItem value="attar">Attar</SelectItem>
                            <SelectItem value="bakhoor">Bakhoor</SelectItem>
                            <SelectItem value="blend">Custom Blend</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Production type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blending">Blending</SelectItem>
                            <SelectItem value="distillation">Distillation</SelectItem>
                            <SelectItem value="mixing">Mixing</SelectItem>
                            <SelectItem value="aging">Aging</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea placeholder="Recipe description and notes..." />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsNewRecipeDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsNewRecipeDialogOpen(false)}>
                        Create Recipe
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productionRecipes
                .filter(recipe =>
                  searchTerm === '' ||
                  recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  recipe.nameArabic.includes(searchTerm) ||
                  recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(renderRecipeCard)}
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productionFacilities.map(facility => (
                <Card key={facility.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{facility.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">{facility.nameArabic}</p>
                        <p className="text-xs text-gray-500">{facility.type}</p>
                      </div>
                      <Badge className={getStatusColor(facility.status)} variant="secondary">
                        {facility.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium">{facility.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{facility.location}</span>
                      </div>
                      {facility.currentBatch && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Batch:</span>
                          <span className="font-medium text-orange-600">{facility.currentBatch}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t">
                      <p className="text-xs text-gray-600 mb-1">Operators:</p>
                      <div className="flex flex-wrap gap-1">
                        {facility.operators.map((operator, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {operator}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t">
                      <p className="text-xs text-gray-600 mb-1">Equipment:</p>
                      <div className="flex flex-wrap gap-1">
                        {facility.equipment.slice(0, 2).map((equipment, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {equipment}
                          </Badge>
                        ))}
                        {facility.equipment.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{facility.equipment.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recipe Detail Dialog */}
      {selectedRecipe && (
        <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                {selectedRecipe.name} (v{selectedRecipe.version})
              </DialogTitle>
              <DialogDescription>
                {selectedRecipe.nameArabic} • {selectedRecipe.category}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="steps">Production Steps</TabsTrigger>
                <TabsTrigger value="quality">Quality Standards</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Recipe Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span>{selectedRecipe.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span>{selectedRecipe.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <Badge variant="outline">{selectedRecipe.difficulty}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Creator:</span>
                        <span>{selectedRecipe.creator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>{selectedRecipe.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Production Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Yield:</span>
                        <span className="font-medium">{selectedRecipe.totalYield} {selectedRecipe.totalYield > 1000 ? 'ml' : 'g'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Production Time:</span>
                        <span className="font-medium">{Math.floor(selectedRecipe.productionTime / 60)}h {selectedRecipe.productionTime % 60}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost per Batch:</span>
                        <span className="font-medium text-green-600">AED {selectedRecipe.costPerBatch.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Grade:</span>
                        <Badge variant="outline">{selectedRecipe.qualityGrade}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingredient</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRecipe.ingredients.map((ingredient: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <span className="font-medium">{ingredient.name}</span>
                            <p className="text-xs text-gray-600">{ingredient.nameArabic}</p>
                          </div>
                        </TableCell>
                        <TableCell>{ingredient.quantity} {ingredient.unit}</TableCell>
                        <TableCell>{ingredient.percentage}%</TableCell>
                        <TableCell>AED {ingredient.cost}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ingredient.qualityRequirement}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{ingredient.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="steps" className="mt-4">
                <div className="space-y-4">
                  {selectedRecipe.productionSteps.map((step: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{step.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{step.titleArabic}</p>
                            <p className="text-sm mb-3">{step.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="font-medium">Duration:</span> {step.duration} minutes
                              </div>
                              <div>
                                <span className="font-medium">Temperature:</span> {step.temperature}
                              </div>
                              <div>
                                <span className="font-medium">Equipment:</span> {step.equipment.join(', ')}
                              </div>
                            </div>

                            {step.warnings.length > 0 && (
                              <div className="mt-3 p-2 bg-yellow-50 rounded">
                                <p className="text-xs font-medium text-yellow-800 mb-1">Warnings:</p>
                                <ul className="text-xs text-yellow-700 list-disc list-inside">
                                  {step.warnings.map((warning: string, wIndex: number) => (
                                    <li key={wIndex}>{warning}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="mt-3 p-2 bg-green-50 rounded">
                              <p className="text-xs font-medium text-green-800 mb-1">Quality Checks:</p>
                              <ul className="text-xs text-green-700 list-disc list-inside">
                                {step.qualityChecks.map((check: string, cIndex: number) => (
                                  <li key={cIndex}>{check}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="quality" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Quality Standards</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedRecipe.qualityStandards).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Expected Output</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Volume:</span>
                        <span className="font-medium">{selectedRecipe.expectedOutput.totalVolume} {selectedRecipe.expectedOutput.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Batch Yield:</span>
                        <span className="font-medium">{selectedRecipe.expectedOutput.batchYield}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Waste Percentage:</span>
                        <span className="font-medium">{selectedRecipe.expectedOutput.wastePercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Grade:</span>
                        <Badge variant="outline">{selectedRecipe.expectedOutput.qualityGrade}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedRecipe(null)}>
                Close
              </Button>
              <Button>
                Start Production
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Batch Detail Dialog */}
      {selectedBatch && (
        <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                {selectedBatch.recipeName} - {selectedBatch.id}
              </DialogTitle>
              <DialogDescription>
                Production batch details and progress tracking
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Batch Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(selectedBatch.status)} variant="secondary">
                      {selectedBatch.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span className="font-medium">{selectedBatch.progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Step:</span>
                    <span className="font-medium">{selectedBatch.currentStep}/{selectedBatch.totalSteps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Batch Size:</span>
                    <span className="font-medium">{selectedBatch.batchSize} {selectedBatch.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operator:</span>
                    <span className="font-medium">{selectedBatch.assignedOperator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Facility:</span>
                    <span className="font-medium">{selectedBatch.facility}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Timeline & Costs</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span className="font-medium">{selectedBatch.startDate || selectedBatch.scheduledStart}</span>
                  </div>
                  {selectedBatch.estimatedCompletion && (
                    <div className="flex justify-between">
                      <span>Est. Completion:</span>
                      <span className="font-medium">{selectedBatch.estimatedCompletion}</span>
                    </div>
                  )}
                  {selectedBatch.completionDate && (
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-medium">{selectedBatch.completionDate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium text-green-600">
                      AED {(selectedBatch.actualCosts || selectedBatch.estimatedCosts).toLocaleString()}
                    </span>
                  </div>
                  {selectedBatch.qualityScore && (
                    <div className="flex justify-between">
                      <span>Quality Score:</span>
                      <span className="font-medium text-amber-600">{selectedBatch.qualityScore}/10</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedBatch.status === 'in_progress' && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Production Progress</h4>
                <Progress value={selectedBatch.progress} className="mb-2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Step {selectedBatch.currentStep} of {selectedBatch.totalSteps}</span>
                  <span>{selectedBatch.timeRemaining ? `${Math.floor(selectedBatch.timeRemaining / 60)}h ${selectedBatch.timeRemaining % 60}m remaining` : ''}</span>
                </div>
              </div>
            )}

            {selectedBatch.notes && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Notes</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedBatch.notes}</p>
              </div>
            )}

            {selectedBatch.alerts && selectedBatch.alerts.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Alerts</h4>
                <div className="space-y-2">
                  {selectedBatch.alerts.map((alert: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {alert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedBatch(null)}>
                Close
              </Button>
              {selectedBatch.status === 'in_progress' && (
                <>
                  <Button variant="outline">
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                  <Button variant="destructive">
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                </>
              )}
              {selectedBatch.status === 'pending' && (
                <Button>
                  <Play className="h-4 w-4 mr-1" />
                  Start Production
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}