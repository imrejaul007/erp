'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Eye,
  Nose,
  Zap,
  Crown,
  Star,
  Award,
  Circle,
  TreePine,
  MapPin,
  Calendar,
  Weight,
  Droplet,
  Thermometer,
  Timer,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Edit,
  Save,
  X,
  Check,
  Camera,
  Image,
  FileText,
  Download,
  Upload,
  AlertTriangle,
  Info,
  Settings,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

interface OudBatch {
  id: string
  batchNumber: string
  rawMaterial: {
    origin: string
    species: string
    age: number // years
    harvester: string
    harvestDate: string
    weight: number
    notes?: string
  }
  segregation: {
    inspector: string
    inspectionDate: string
    environment: {
      temperature: number
      humidity: number
      lighting: string
    }
    grades: {
      royal: OudGrade
      premium: OudGrade
      super: OudGrade
      regular: OudGrade
      reject: OudGrade
    }
    totalProcessed: number
    efficiency: number // percentage of usable oud
    notes?: string
  }
  qualityMetrics: {
    overallScore: number
    aromaProfile: AromaProfile
    visualInspection: VisualInspection
    physicalProperties: PhysicalProperties
  }
  status: 'raw' | 'inspecting' | 'segregated' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

interface OudGrade {
  weight: number
  percentage: number
  pricePerGram: number
  totalValue: number
  characteristics: string[]
  images?: string[]
  notes?: string
}

interface AromaProfile {
  intensity: number // 1-10
  complexity: number // 1-10
  sweetness: number // 1-10
  woodiness: number // 1-10
  smokiness: number // 1-10
  animalic: number // 1-10
  floral: number // 1-10
  spicy: number // 1-10
  notes: string[]
}

interface VisualInspection {
  color: string
  texture: string
  oilContent: number // percentage
  resinContent: number // percentage
  inclusions: string[]
  defects: string[]
  overallAppearance: number // 1-10
}

interface PhysicalProperties {
  density: number
  moisture: number // percentage
  hardness: number // 1-10
  elasticity: number // 1-10
  burnTest: {
    ignitionTime: number // seconds
    burnDuration: number // minutes
    ashColor: string
    smokeQuality: number // 1-10
  }
}

interface SegregationCriteria {
  grade: 'royal' | 'premium' | 'super' | 'regular'
  minScore: number
  characteristics: string[]
  priceRange: {
    min: number
    max: number
  }
  description: string
  descriptionAr: string
}

const OudSegregationSystem: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [batches, setBatches] = useState<OudBatch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string>('')
  const [activeInspection, setActiveInspection] = useState<OudBatch | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showNewBatchDialog, setShowNewBatchDialog] = useState(false)
  const [showInspectionDialog, setShowInspectionDialog] = useState(false)
  const [showCriteriaDialog, setShowCriteriaDialog] = useState(false)

  // Segregation criteria
  const segregationCriteria: SegregationCriteria[] = [
    {
      grade: 'royal',
      minScore: 90,
      characteristics: [
        'Deep, complex aroma',
        'Rich oil content (>15%)',
        'Perfect color consistency',
        'No visible defects',
        'Premium origin woods',
        'Aged 25+ years'
      ],
      priceRange: { min: 150, max: 300 },
      description: 'Highest quality oud with exceptional aroma and perfect appearance',
      descriptionAr: 'أعلى جودة عود مع رائحة استثنائية ومظهر مثالي'
    },
    {
      grade: 'premium',
      minScore: 75,
      characteristics: [
        'Strong, pleasant aroma',
        'Good oil content (10-15%)',
        'Good color uniformity',
        'Minor defects acceptable',
        'Quality origin woods',
        'Aged 15-25 years'
      ],
      priceRange: { min: 75, max: 150 },
      description: 'High quality oud with strong aroma and good characteristics',
      descriptionAr: 'عود عالي الجودة مع رائحة قوية وخصائص جيدة'
    },
    {
      grade: 'super',
      minScore: 60,
      characteristics: [
        'Moderate aroma',
        'Adequate oil content (5-10%)',
        'Acceptable color variation',
        'Some defects acceptable',
        'Standard origin woods',
        'Aged 10-15 years'
      ],
      priceRange: { min: 35, max: 75 },
      description: 'Good quality oud suitable for regular use',
      descriptionAr: 'عود جيد الجودة مناسب للاستخدام العادي'
    },
    {
      grade: 'regular',
      minScore: 40,
      characteristics: [
        'Basic aroma',
        'Low oil content (2-5%)',
        'Color variations acceptable',
        'Multiple defects acceptable',
        'Mixed origin woods',
        'Aged 5-10 years'
      ],
      priceRange: { min: 15, max: 35 },
      description: 'Basic quality oud for entry-level market',
      descriptionAr: 'عود جودة أساسية للسوق المبتدئ'
    }
  ]

  // Form state for new batch
  const [newBatch, setNewBatch] = useState({
    rawMaterial: {
      origin: '',
      species: '',
      age: '',
      harvester: '',
      harvestDate: '',
      weight: '',
      notes: ''
    }
  })

  // Inspection form state
  const [inspectionForm, setInspectionForm] = useState({
    inspector: '',
    environment: {
      temperature: '22',
      humidity: '45',
      lighting: 'natural'
    },
    aromaProfile: {
      intensity: 5,
      complexity: 5,
      sweetness: 5,
      woodiness: 5,
      smokiness: 5,
      animalic: 5,
      floral: 5,
      spicy: 5,
      notes: ['']
    },
    visualInspection: {
      color: '',
      texture: '',
      oilContent: '',
      resinContent: '',
      inclusions: [''],
      defects: [''],
      overallAppearance: 5
    },
    physicalProperties: {
      density: '',
      moisture: '',
      hardness: 5,
      elasticity: 5,
      burnTest: {
        ignitionTime: '',
        burnDuration: '',
        ashColor: '',
        smokeQuality: 5
      }
    },
    grades: {
      royal: { weight: '', notes: '' },
      premium: { weight: '', notes: '' },
      super: { weight: '', notes: '' },
      regular: { weight: '', notes: '' },
      reject: { weight: '', notes: '' }
    },
    notes: ''
  })

  // Mock data initialization
  useEffect(() => {
    const mockBatches: OudBatch[] = [
      {
        id: '1',
        batchNumber: 'OUD-2024-001',
        rawMaterial: {
          origin: 'Cambodia - Pursat Province',
          species: 'Aquilaria crassna',
          age: 28,
          harvester: 'Sok Pisey',
          harvestDate: '2024-01-15',
          weight: 2500,
          notes: 'Premium wild harvested from protected forest area'
        },
        segregation: {
          inspector: 'Ahmad Al-Oudhi',
          inspectionDate: '2024-01-20',
          environment: {
            temperature: 22,
            humidity: 45,
            lighting: 'natural'
          },
          grades: {
            royal: {
              weight: 125,
              percentage: 5,
              pricePerGram: 200,
              totalValue: 25000,
              characteristics: [
                'Deep complex aroma',
                'Rich oil content 18%',
                'Perfect dark brown color',
                'No defects'
              ]
            },
            premium: {
              weight: 375,
              percentage: 15,
              pricePerGram: 100,
              totalValue: 37500,
              characteristics: [
                'Strong pleasant aroma',
                'Good oil content 12%',
                'Uniform color'
              ]
            },
            super: {
              weight: 750,
              percentage: 30,
              pricePerGram: 50,
              totalValue: 37500,
              characteristics: [
                'Moderate aroma',
                'Adequate oil content 8%'
              ]
            },
            regular: {
              weight: 875,
              percentage: 35,
              pricePerGram: 25,
              totalValue: 21875,
              characteristics: [
                'Basic aroma',
                'Low oil content 4%'
              ]
            },
            reject: {
              weight: 375,
              percentage: 15,
              pricePerGram: 0,
              totalValue: 0,
              characteristics: [
                'No aroma',
                'Defects present'
              ]
            }
          },
          totalProcessed: 2500,
          efficiency: 85
        },
        qualityMetrics: {
          overallScore: 82,
          aromaProfile: {
            intensity: 8,
            complexity: 9,
            sweetness: 6,
            woodiness: 9,
            smokiness: 7,
            animalic: 5,
            floral: 4,
            spicy: 6,
            notes: ['Rich woody base', 'Complex sweet undertones', 'Mild barnyard notes']
          },
          visualInspection: {
            color: 'Dark brown with black streaks',
            texture: 'Dense and resinous',
            oilContent: 12,
            resinContent: 8,
            inclusions: ['Natural oil pockets'],
            defects: ['Minor surface cracks'],
            overallAppearance: 8
          },
          physicalProperties: {
            density: 0.85,
            moisture: 8.5,
            hardness: 7,
            elasticity: 6,
            burnTest: {
              ignitionTime: 3,
              burnDuration: 45,
              ashColor: 'Light gray',
              smokeQuality: 8
            }
          }
        },
        status: 'approved',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-20T16:30:00Z'
      }
    ]

    setBatches(mockBatches)
  }, [])

  const createNewBatch = () => {
    const batch: OudBatch = {
      id: Date.now().toString(),
      batchNumber: `OUD-${new Date().getFullYear()}-${String(batches.length + 1).padStart(3, '0')}`,
      rawMaterial: {
        origin: newBatch.rawMaterial.origin,
        species: newBatch.rawMaterial.species,
        age: parseInt(newBatch.rawMaterial.age) || 0,
        harvester: newBatch.rawMaterial.harvester,
        harvestDate: newBatch.rawMaterial.harvestDate,
        weight: parseFloat(newBatch.rawMaterial.weight) || 0,
        notes: newBatch.rawMaterial.notes
      },
      segregation: {
        inspector: '',
        inspectionDate: '',
        environment: { temperature: 22, humidity: 45, lighting: 'natural' },
        grades: {
          royal: { weight: 0, percentage: 0, pricePerGram: 0, totalValue: 0, characteristics: [] },
          premium: { weight: 0, percentage: 0, pricePerGram: 0, totalValue: 0, characteristics: [] },
          super: { weight: 0, percentage: 0, pricePerGram: 0, totalValue: 0, characteristics: [] },
          regular: { weight: 0, percentage: 0, pricePerGram: 0, totalValue: 0, characteristics: [] },
          reject: { weight: 0, percentage: 0, pricePerGram: 0, totalValue: 0, characteristics: [] }
        },
        totalProcessed: 0,
        efficiency: 0
      },
      qualityMetrics: {
        overallScore: 0,
        aromaProfile: {
          intensity: 0, complexity: 0, sweetness: 0, woodiness: 0,
          smokiness: 0, animalic: 0, floral: 0, spicy: 0, notes: []
        },
        visualInspection: {
          color: '', texture: '', oilContent: 0, resinContent: 0,
          inclusions: [], defects: [], overallAppearance: 0
        },
        physicalProperties: {
          density: 0, moisture: 0, hardness: 0, elasticity: 0,
          burnTest: { ignitionTime: 0, burnDuration: 0, ashColor: '', smokeQuality: 0 }
        }
      },
      status: 'raw',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setBatches(prev => [...prev, batch])
    setShowNewBatchDialog(false)
    setNewBatch({
      rawMaterial: {
        origin: '', species: '', age: '', harvester: '',
        harvestDate: '', weight: '', notes: ''
      }
    })
  }

  const startInspection = (batch: OudBatch) => {
    setActiveInspection(batch)
    setShowInspectionDialog(true)
  }

  const saveInspection = () => {
    if (!activeInspection) return

    // Calculate grades and overall score
    const aromaScore = (
      inspectionForm.aromaProfile.intensity +
      inspectionForm.aromaProfile.complexity +
      inspectionForm.aromaProfile.woodiness
    ) / 3

    const visualScore = (
      inspectionForm.visualInspection.overallAppearance +
      (inspectionForm.visualInspection.oilContent ? parseFloat(inspectionForm.visualInspection.oilContent) / 2 : 0)
    ) / 2

    const physicalScore = (
      inspectionForm.physicalProperties.hardness +
      inspectionForm.physicalProperties.elasticity +
      inspectionForm.physicalProperties.burnTest.smokeQuality
    ) / 3

    const overallScore = (aromaScore + visualScore + physicalScore) / 3 * 10

    // Calculate grade distribution
    const totalWeight = activeInspection.rawMaterial.weight
    const grades = { ...inspectionForm.grades }

    Object.keys(grades).forEach(grade => {
      const weight = parseFloat(grades[grade as keyof typeof grades].weight) || 0
      const percentage = (weight / totalWeight) * 100
      const criteria = segregationCriteria.find(c => c.grade === grade)
      const pricePerGram = criteria ? (criteria.priceRange.min + criteria.priceRange.max) / 2 : 0

      grades[grade as keyof typeof grades] = {
        weight,
        percentage,
        pricePerGram,
        totalValue: weight * pricePerGram,
        characteristics: criteria?.characteristics || [],
        notes: grades[grade as keyof typeof grades].notes
      }
    })

    const totalProcessed = Object.values(grades).reduce((sum, grade) => sum + grade.weight, 0)
    const efficiency = ((totalProcessed - grades.reject.weight) / totalProcessed) * 100

    const updatedBatch: OudBatch = {
      ...activeInspection,
      segregation: {
        inspector: inspectionForm.inspector,
        inspectionDate: new Date().toISOString().split('T')[0],
        environment: {
          temperature: parseFloat(inspectionForm.environment.temperature),
          humidity: parseFloat(inspectionForm.environment.humidity),
          lighting: inspectionForm.environment.lighting
        },
        grades,
        totalProcessed,
        efficiency,
        notes: inspectionForm.notes
      },
      qualityMetrics: {
        overallScore,
        aromaProfile: {
          ...inspectionForm.aromaProfile,
          notes: inspectionForm.aromaProfile.notes.filter(n => n.trim())
        },
        visualInspection: {
          ...inspectionForm.visualInspection,
          oilContent: parseFloat(inspectionForm.visualInspection.oilContent) || 0,
          resinContent: parseFloat(inspectionForm.visualInspection.resinContent) || 0,
          inclusions: inspectionForm.visualInspection.inclusions.filter(i => i.trim()),
          defects: inspectionForm.visualInspection.defects.filter(d => d.trim())
        },
        physicalProperties: {
          density: parseFloat(inspectionForm.physicalProperties.density) || 0,
          moisture: parseFloat(inspectionForm.physicalProperties.moisture) || 0,
          hardness: inspectionForm.physicalProperties.hardness,
          elasticity: inspectionForm.physicalProperties.elasticity,
          burnTest: {
            ignitionTime: parseFloat(inspectionForm.physicalProperties.burnTest.ignitionTime) || 0,
            burnDuration: parseFloat(inspectionForm.physicalProperties.burnTest.burnDuration) || 0,
            ashColor: inspectionForm.physicalProperties.burnTest.ashColor,
            smokeQuality: inspectionForm.physicalProperties.burnTest.smokeQuality
          }
        }
      },
      status: 'segregated',
      updatedAt: new Date().toISOString()
    }

    setBatches(prev => prev.map(b => b.id === activeInspection.id ? updatedBatch : b))
    setShowInspectionDialog(false)
    setActiveInspection(null)
  }

  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case 'royal': return <Crown className="h-4 w-4 text-yellow-600" />
      case 'premium': return <Star className="h-4 w-4 text-purple-600" />
      case 'super': return <Award className="h-4 w-4 text-blue-600" />
      case 'regular': return <Circle className="h-4 w-4 text-green-600" />
      default: return <X className="h-4 w-4 text-red-600" />
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'royal': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'super': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'regular': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'raw': return <Package className="h-4 w-4 text-gray-600" />
      case 'inspecting': return <Eye className="h-4 w-4 text-blue-600" />
      case 'segregated': return <Activity className="h-4 w-4 text-orange-600" />
      case 'approved': return <Check className="h-4 w-4 text-green-600" />
      case 'rejected': return <X className="h-4 w-4 text-red-600" />
      default: return <Circle className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.rawMaterial.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.rawMaterial.species.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalStats = {
    totalBatches: batches.length,
    totalWeight: batches.reduce((sum, batch) => sum + batch.rawMaterial.weight, 0),
    averageScore: batches.length > 0 ?
      batches.reduce((sum, batch) => sum + batch.qualityMetrics.overallScore, 0) / batches.length : 0,
    totalValue: batches.reduce((sum, batch) => {
      return sum + Object.values(batch.segregation.grades).reduce((gradeSum, grade) => gradeSum + grade.totalValue, 0)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TreePine className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold">
            {language === 'ar' ? 'نظام فصل وتصنيف العود' : 'Oud Segregation & Grading System'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
          >
            {language === 'ar' ? 'EN' : 'ع'}
          </Button>

          <Button onClick={() => setShowCriteriaDialog(true)} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'معايير التصنيف' : 'Grading Criteria'}
          </Button>

          <Button onClick={() => setShowNewBatchDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'دفعة جديدة' : 'New Batch'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي الدفعات' : 'Total Batches'}
                </p>
                <p className="text-2xl font-bold">{totalStats.totalBatches}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي الوزن' : 'Total Weight'}
                </p>
                <p className="text-2xl font-bold">{totalStats.totalWeight.toLocaleString()}g</p>
              </div>
              <Weight className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'متوسط النقاط' : 'Average Score'}
                </p>
                <p className="text-2xl font-bold">{totalStats.averageScore.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي القيمة' : 'Total Value'}
                </p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                    style: 'currency',
                    currency: 'AED',
                    maximumFractionDigits: 0
                  }).format(totalStats.totalValue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={language === 'ar' ? 'البحث عن الدفعات...' : 'Search batches...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                  <SelectItem value="raw">{language === 'ar' ? 'خام' : 'Raw'}</SelectItem>
                  <SelectItem value="inspecting">{language === 'ar' ? 'قيد الفحص' : 'Inspecting'}</SelectItem>
                  <SelectItem value="segregated">{language === 'ar' ? 'مفصول' : 'Segregated'}</SelectItem>
                  <SelectItem value="approved">{language === 'ar' ? 'موافق عليه' : 'Approved'}</SelectItem>
                  <SelectItem value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batches List */}
      <div className="space-y-4">
        {filteredBatches.map((batch) => (
          <Card key={batch.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(batch.status)}
                    <h3 className="text-lg font-semibold">{batch.batchNumber}</h3>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {batch.status}
                  </Badge>
                  {batch.qualityMetrics.overallScore > 0 && (
                    <Badge className="bg-blue-100 text-blue-800">
                      {batch.qualityMetrics.overallScore.toFixed(1)} pts
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  {batch.status === 'raw' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startInspection(batch)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'بدء الفحص' : 'Start Inspection'}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Raw Material Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    {language === 'ar' ? 'المنشأ:' : 'Origin:'}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{batch.rawMaterial.origin}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    {language === 'ar' ? 'النوع:' : 'Species:'}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <TreePine className="h-4 w-4 text-gray-400" />
                    <span className="italic">{batch.rawMaterial.species}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    {language === 'ar' ? 'العمر:' : 'Age:'}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{batch.rawMaterial.age} {language === 'ar' ? 'سنة' : 'years'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    {language === 'ar' ? 'الحاصد:' : 'Harvester:'}
                  </Label>
                  <div>{batch.rawMaterial.harvester}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    {language === 'ar' ? 'الوزن:' : 'Weight:'}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Weight className="h-4 w-4 text-gray-400" />
                    <span>{batch.rawMaterial.weight.toLocaleString()}g</span>
                  </div>
                </div>
              </div>

              {/* Segregation Results */}
              {batch.status !== 'raw' && batch.segregation.totalProcessed > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">
                    {language === 'ar' ? 'نتائج الفصل' : 'Segregation Results'}
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    {Object.entries(batch.segregation.grades).map(([grade, data]) => (
                      <Card key={grade} className={`border ${getGradeColor(grade)}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            {getGradeIcon(grade)}
                            <span className="text-sm font-medium capitalize">{grade}</span>
                          </div>
                          <div className="text-lg font-bold">{data.weight}g</div>
                          <div className="text-sm text-gray-600">{data.percentage.toFixed(1)}%</div>
                          <div className="text-sm font-medium">
                            {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                              style: 'currency',
                              currency: 'AED',
                              maximumFractionDigits: 0
                            }).format(data.totalValue)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-600">
                        {language === 'ar' ? 'المفتش:' : 'Inspector:'}
                      </Label>
                      <div>{batch.segregation.inspector}</div>
                    </div>
                    <div>
                      <Label className="text-gray-600">
                        {language === 'ar' ? 'تاريخ الفحص:' : 'Inspection Date:'}
                      </Label>
                      <div>{new Date(batch.segregation.inspectionDate).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-AE')}</div>
                    </div>
                    <div>
                      <Label className="text-gray-600">
                        {language === 'ar' ? 'الكفاءة:' : 'Efficiency:'}
                      </Label>
                      <div>{batch.segregation.efficiency.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBatches.length === 0 && (
        <div className="text-center py-12">
          <TreePine className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">
            {language === 'ar' ? 'لا توجد دفعات' : 'No batches found'}
          </p>
        </div>
      )}

      {/* New Batch Dialog */}
      <Dialog open={showNewBatchDialog} onOpenChange={setShowNewBatchDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'إنشاء دفعة جديدة' : 'Create New Batch'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'المنشأ' : 'Origin'}</Label>
                <Input
                  value={newBatch.rawMaterial.origin}
                  onChange={(e) => setNewBatch(prev => ({
                    ...prev,
                    rawMaterial: { ...prev.rawMaterial, origin: e.target.value }
                  }))}
                  placeholder="Cambodia - Pursat Province"
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'النوع' : 'Species'}</Label>
                <Input
                  value={newBatch.rawMaterial.species}
                  onChange={(e) => setNewBatch(prev => ({
                    ...prev,
                    rawMaterial: { ...prev.rawMaterial, species: e.target.value }
                  }))}
                  placeholder="Aquilaria crassna"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'العمر (سنوات)' : 'Age (years)'}</Label>
                <Input
                  type="number"
                  value={newBatch.rawMaterial.age}
                  onChange={(e) => setNewBatch(prev => ({
                    ...prev,
                    rawMaterial: { ...prev.rawMaterial, age: e.target.value }
                  }))}
                  placeholder="25"
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'الوزن (جرام)' : 'Weight (grams)'}</Label>
                <Input
                  type="number"
                  value={newBatch.rawMaterial.weight}
                  onChange={(e) => setNewBatch(prev => ({
                    ...prev,
                    rawMaterial: { ...prev.rawMaterial, weight: e.target.value }
                  }))}
                  placeholder="2500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'الحاصد' : 'Harvester'}</Label>
                <Input
                  value={newBatch.rawMaterial.harvester}
                  onChange={(e) => setNewBatch(prev => ({
                    ...prev,
                    rawMaterial: { ...prev.rawMaterial, harvester: e.target.value }
                  }))}
                  placeholder="Sok Pisey"
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'تاريخ الحصاد' : 'Harvest Date'}</Label>
                <Input
                  type="date"
                  value={newBatch.rawMaterial.harvestDate}
                  onChange={(e) => setNewBatch(prev => ({
                    ...prev,
                    rawMaterial: { ...prev.rawMaterial, harvestDate: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div>
              <Label>{language === 'ar' ? 'ملاحظات' : 'Notes'}</Label>
              <Textarea
                value={newBatch.rawMaterial.notes}
                onChange={(e) => setNewBatch(prev => ({
                  ...prev,
                  rawMaterial: { ...prev.rawMaterial, notes: e.target.value }
                }))}
                placeholder="Additional notes about the raw material..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewBatchDialog(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={createNewBatch}>
                <Save className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'إنشاء دفعة' : 'Create Batch'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Grading Criteria Dialog */}
      <Dialog open={showCriteriaDialog} onOpenChange={setShowCriteriaDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'معايير تصنيف العود' : 'Oud Grading Criteria'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {segregationCriteria.map((criteria) => (
              <Card key={criteria.grade} className={`border-2 ${getGradeColor(criteria.grade)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getGradeIcon(criteria.grade)}
                      <h3 className="text-lg font-semibold capitalize">{criteria.grade}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {language === 'ar' ? 'الحد الأدنى للنقاط:' : 'Min Score:'}
                      </div>
                      <div className="text-lg font-bold">{criteria.minScore}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'الوصف:' : 'Description:'}
                      </Label>
                      <p className="text-sm text-gray-700">
                        {language === 'ar' ? criteria.descriptionAr : criteria.description}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'نطاق السعر (درهم/جرام):' : 'Price Range (AED/gram):'}
                      </Label>
                      <div className="text-sm">
                        {criteria.priceRange.min} - {criteria.priceRange.max} AED
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2 block">
                      {language === 'ar' ? 'الخصائص المطلوبة:' : 'Required Characteristics:'}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {criteria.characteristics.map((char, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="h-3 w-3 text-green-600" />
                          <span className="text-sm">{char}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Inspection Dialog - This would be quite large, showing abbreviated version */}
      <Dialog open={showInspectionDialog} onOpenChange={setShowInspectionDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'فحص وتصنيف العود' : 'Oud Inspection & Grading'}
            </DialogTitle>
          </DialogHeader>

          {activeInspection && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>{language === 'ar' ? 'رقم الدفعة' : 'Batch Number'}</Label>
                  <Input value={activeInspection.batchNumber} disabled />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'المفتش' : 'Inspector'}</Label>
                  <Input
                    value={inspectionForm.inspector}
                    onChange={(e) => setInspectionForm(prev => ({
                      ...prev,
                      inspector: e.target.value
                    }))}
                    placeholder="Inspector name"
                  />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'الوزن الإجمالي' : 'Total Weight'}</Label>
                  <Input value={`${activeInspection.rawMaterial.weight}g`} disabled />
                </div>
              </div>

              {/* Grade Distribution */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ar' ? 'توزيع الدرجات' : 'Grade Distribution'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Object.entries(inspectionForm.grades).map(([grade, data]) => (
                    <Card key={grade} className={`border ${getGradeColor(grade)}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2">
                          {getGradeIcon(grade)}
                          <span className="text-sm font-medium capitalize">{grade}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <Label className="text-xs">
                            {language === 'ar' ? 'الوزن (جرام)' : 'Weight (g)'}
                          </Label>
                          <Input
                            type="number"
                            value={data.weight}
                            onChange={(e) => setInspectionForm(prev => ({
                              ...prev,
                              grades: {
                                ...prev.grades,
                                [grade]: { ...prev.grades[grade as keyof typeof prev.grades], weight: e.target.value }
                              }
                            }))}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">
                            {language === 'ar' ? 'ملاحظات' : 'Notes'}
                          </Label>
                          <Textarea
                            rows={2}
                            value={data.notes}
                            onChange={(e) => setInspectionForm(prev => ({
                              ...prev,
                              grades: {
                                ...prev.grades,
                                [grade]: { ...prev.grades[grade as keyof typeof prev.grades], notes: e.target.value }
                              }
                            }))}
                            placeholder="Grade notes..."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowInspectionDialog(false)}>
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={saveInspection}>
                  <Save className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'حفظ الفحص' : 'Save Inspection'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OudSegregationSystem