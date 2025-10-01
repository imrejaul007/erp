'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TestTube,
  Nose,
  Eye,
  Calendar,
  User,
  Star,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Target,
  Palette,
  Droplet,
  Thermometer,
  Wind,
  Users,
  FileText,
  Download,
  Upload,
  Save,
  Plus,
  Edit,
  X,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Share2,
  Camera,
  Tag,
  Package,
  Timer,
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
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

interface TestingSample {
  id: string
  sampleCode: string
  name: string
  nameAr: string
  type: 'new_formula' | 'batch_quality' | 'competitor_analysis' | 'customer_request' | 'r_and_d'
  sourceProduct?: {
    id: string
    name: string
    batchNumber: string
    productionDate: string
  }
  formula?: {
    id: string
    name: string
    version: string
    components: FormulaComponent[]
  }
  physicalProperties: PhysicalProperties
  testingProtocol: TestingProtocol
  evaluations: SampleEvaluation[]
  status: 'pending' | 'testing' | 'evaluation' | 'approved' | 'rejected' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requestedBy: string
  assignedTo: string[]
  createdAt: string
  updatedAt: string
  dueDate?: string
  notes: string[]
}

interface FormulaComponent {
  id: string
  name: string
  nameAr: string
  type: 'base_note' | 'middle_note' | 'top_note' | 'solvent' | 'fixative' | 'modifier'
  concentration: number // percentage
  supplier?: string
  grade?: string
  notes?: string
}

interface PhysicalProperties {
  volume: number // ml
  color: string
  clarity: number // 1-10
  viscosity: number // cP
  density: number // g/ml
  ph?: number
  flashPoint?: number // °C
  appearance: string
  texture: string
  images?: string[]
  measurements: {
    measuredBy: string
    measuredAt: string
    environment: {
      temperature: number
      humidity: number
      lighting: string
    }
  }
}

interface TestingProtocol {
  id: string
  name: string
  nameAr: string
  type: 'olfactory' | 'stability' | 'compatibility' | 'longevity' | 'projection' | 'comprehensive'
  duration: number // hours
  phases: TestingPhase[]
  evaluators: Evaluator[]
  environment: {
    temperature: { min: number; max: number; optimal: number }
    humidity: { min: number; max: number; optimal: number }
    lighting: string
    ventilation: string
  }
  instructions: string
  instructionsAr: string
}

interface TestingPhase {
  id: string
  name: string
  nameAr: string
  order: number
  duration: number // minutes
  timing: 'immediate' | 'after_application' | 'drydown' | 'far_drydown'
  evaluationCriteria: EvaluationCriteria[]
  notes?: string
}

interface EvaluationCriteria {
  id: string
  category: 'intensity' | 'projection' | 'longevity' | 'complexity' | 'balance' | 'character' | 'quality'
  name: string
  nameAr: string
  weight: number // percentage importance
  scaleType: 'numeric' | 'descriptive' | 'binary'
  scale: {
    min: number
    max: number
    labels?: string[]
    labelsAr?: string[]
  }
  description: string
  descriptionAr: string
}

interface Evaluator {
  id: string
  name: string
  nameAr: string
  role: 'perfumer' | 'evaluator' | 'customer' | 'expert' | 'focus_group'
  experience: number // years
  specialization?: string[]
  certifications?: string[]
  contactInfo?: {
    email: string
    phone: string
  }
  availability: {
    days: string[]
    timeSlots: string[]
  }
}

interface SampleEvaluation {
  id: string
  evaluatorId: string
  evaluatedAt: string
  phase: string
  environment: {
    temperature: number
    humidity: number
    lighting: string
    mood: string
    fatigue: number // 1-10
  }
  scores: EvaluationScore[]
  overallRating: number
  recommendations: string[]
  issues: string[]
  strengths: string[]
  improvements: string[]
  willingness: {
    toRecommend: number // 1-10
    toPurchase: number // 1-10
    toUseDaily: number // 1-10
  }
  comparison?: {
    referenceProduct: string
    preference: 'sample' | 'reference' | 'equal'
    reasoning: string
  }
  notes: string
  notesAr: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
}

interface EvaluationScore {
  criteriaId: string
  value: number
  description?: string
  confidence: number // 1-10
  notes?: string
}

interface TestingSession {
  id: string
  name: string
  date: string
  time: string
  duration: number // hours
  location: string
  facilitator: string
  samples: string[] // sample IDs
  evaluators: string[] // evaluator IDs
  type: 'individual' | 'group' | 'blind' | 'comparative'
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  protocol: string
  results: {
    completed: boolean
    summary?: string
    keyFindings?: string[]
    nextSteps?: string[]
  }
  notes: string[]
}

const PerfumeTestingSamplesSystem: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [samples, setSamples] = useState<TestingSample[]>([])
  const [evaluators, setEvaluators] = useState<Evaluator[]>([])
  const [testingSessions, setTestingSessions] = useState<TestingSession[]>([])
  const [selectedSample, setSelectedSample] = useState<string>('')
  const [activeView, setActiveView] = useState<'samples' | 'evaluations' | 'sessions' | 'analytics'>('samples')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showNewSampleDialog, setShowNewSampleDialog] = useState(false)
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false)
  const [showSessionDialog, setShowSessionDialog] = useState(false)

  // Form states
  const [newSampleForm, setNewSampleForm] = useState({
    name: '',
    nameAr: '',
    type: 'new_formula' as const,
    sourceProductId: '',
    volume: '',
    color: '',
    appearance: '',
    requestedBy: '',
    assignedTo: [''],
    priority: 'medium' as const,
    dueDate: '',
    notes: ''
  })

  const [evaluationForm, setEvaluationForm] = useState({
    evaluatorId: '',
    phase: '',
    environment: {
      temperature: '22',
      humidity: '50',
      lighting: 'natural',
      mood: 'neutral',
      fatigue: '1'
    },
    scores: [] as any[],
    overallRating: '5',
    recommendations: [''],
    issues: [''],
    strengths: [''],
    improvements: [''],
    willingness: {
      toRecommend: '5',
      toPurchase: '5',
      toUseDaily: '5'
    },
    notes: '',
    notesAr: ''
  })

  // Mock data initialization
  useEffect(() => {
    const mockEvaluators: Evaluator[] = [
      {
        id: '1',
        name: 'Dr. Sarah Al-Mansouri',
        nameAr: 'د. سارة المنصوري',
        role: 'perfumer',
        experience: 15,
        specialization: ['Oud', 'Oriental fragrances', 'Traditional blending'],
        certifications: ['Master Perfumer - ISIPCA', 'Oud Specialist Certificate'],
        contactInfo: { email: 'sarah@example.com', phone: '+971501234567' },
        availability: {
          days: ['Monday', 'Wednesday', 'Friday'],
          timeSlots: ['09:00-12:00', '14:00-17:00']
        }
      },
      {
        id: '2',
        name: 'Ahmed Al-Khatib',
        nameAr: 'أحمد الخطيب',
        role: 'expert',
        experience: 20,
        specialization: ['Quality control', 'Chemical analysis', 'Stability testing'],
        certifications: ['Fragrance Chemistry Diploma', 'ISO Quality Assessor'],
        contactInfo: { email: 'ahmed@example.com', phone: '+971509876543' },
        availability: {
          days: ['Tuesday', 'Thursday', 'Saturday'],
          timeSlots: ['08:00-11:00', '13:00-16:00']
        }
      }
    ]

    const mockSamples: TestingSample[] = [
      {
        id: '1',
        sampleCode: 'TS-2024-001',
        name: 'Royal Oud Blend V2.1',
        nameAr: 'خلطة العود الملكية النسخة 2.1',
        type: 'new_formula',
        sourceProduct: {
          id: 'PRD-001',
          name: 'Royal Oud Oil',
          batchNumber: 'BCH-2024-001',
          productionDate: '2024-01-15'
        },
        formula: {
          id: 'FRM-001',
          name: 'Royal Oud Blend',
          version: '2.1',
          components: [
            {
              id: 'c1',
              name: 'Cambodian Oud',
              nameAr: 'العود الكمبودي',
              type: 'base_note',
              concentration: 35,
              supplier: 'Premium Oud Co.',
              grade: 'Royal'
            },
            {
              id: 'c2',
              name: 'Rose Attar',
              nameAr: 'عطر الورد',
              type: 'middle_note',
              concentration: 20,
              supplier: 'Rose Valley',
              grade: 'Premium'
            },
            {
              id: 'c3',
              name: 'Sandalwood Oil',
              nameAr: 'زيت الصندل',
              type: 'base_note',
              concentration: 15,
              supplier: 'Mysore Sandal',
              grade: 'Premium'
            }
          ]
        },
        physicalProperties: {
          volume: 10,
          color: 'Dark amber',
          clarity: 9,
          viscosity: 2.5,
          density: 0.98,
          ph: 6.8,
          flashPoint: 65,
          appearance: 'Clear, viscous liquid',
          texture: 'Smooth, oily',
          measurements: {
            measuredBy: 'Lab Technician',
            measuredAt: '2024-01-20T10:00:00Z',
            environment: {
              temperature: 22,
              humidity: 45,
              lighting: 'Laboratory standard'
            }
          }
        },
        testingProtocol: {
          id: 'TP-001',
          name: 'Comprehensive Oud Evaluation',
          nameAr: 'تقييم العود الشامل',
          type: 'comprehensive',
          duration: 8,
          phases: [
            {
              id: 'p1',
              name: 'Initial Assessment',
              nameAr: 'التقييم الأولي',
              order: 1,
              duration: 15,
              timing: 'immediate',
              evaluationCriteria: [
                {
                  id: 'c1',
                  category: 'intensity',
                  name: 'Initial Intensity',
                  nameAr: 'الكثافة الأولية',
                  weight: 20,
                  scaleType: 'numeric',
                  scale: { min: 1, max: 10 },
                  description: 'Rate the initial fragrance intensity',
                  descriptionAr: 'قم بتقييم كثافة العطر الأولية'
                }
              ]
            }
          ],
          evaluators: mockEvaluators,
          environment: {
            temperature: { min: 20, max: 25, optimal: 22 },
            humidity: { min: 40, max: 60, optimal: 50 },
            lighting: 'Natural daylight',
            ventilation: 'Controlled air circulation'
          },
          instructions: 'Follow standard olfactory evaluation protocol',
          instructionsAr: 'اتبع بروتوكول التقييم الشمي المعياري'
        },
        evaluations: [
          {
            id: 'e1',
            evaluatorId: '1',
            evaluatedAt: '2024-01-21T14:00:00Z',
            phase: 'p1',
            environment: {
              temperature: 22,
              humidity: 48,
              lighting: 'natural',
              mood: 'focused',
              fatigue: 2
            },
            scores: [
              {
                criteriaId: 'c1',
                value: 8,
                confidence: 9,
                notes: 'Strong, well-balanced initial impression'
              }
            ],
            overallRating: 8.5,
            recommendations: ['Excellent base formula', 'Consider slight adjustment to top notes'],
            issues: ['Minor projection issue in first 10 minutes'],
            strengths: ['Rich oud character', 'Good longevity potential', 'Premium quality feel'],
            improvements: ['Enhance initial projection', 'Add more complexity to opening'],
            willingness: {
              toRecommend: 9,
              toPurchase: 8,
              toUseDaily: 7
            },
            notes: 'Promising formula with traditional oud character. Shows good potential for luxury market.',
            notesAr: 'تركيبة واعدة بطابع العود التقليدي. تظهر إمكانية جيدة للسوق الفاخر.',
            status: 'submitted'
          }
        ],
        status: 'evaluation',
        priority: 'high',
        requestedBy: 'R&D Team',
        assignedTo: ['Dr. Sarah Al-Mansouri', 'Ahmed Al-Khatib'],
        createdAt: '2024-01-20T08:00:00Z',
        updatedAt: '2024-01-21T14:30:00Z',
        dueDate: '2024-01-25',
        notes: ['High priority product for Q1 launch', 'Customer feedback incorporated in v2.1']
      }
    ]

    const mockSessions: TestingSession[] = [
      {
        id: '1',
        name: 'Royal Oud Series Evaluation',
        date: '2024-01-25',
        time: '14:00',
        duration: 3,
        location: 'Evaluation Lab A',
        facilitator: 'Dr. Sarah Al-Mansouri',
        samples: ['1'],
        evaluators: ['1', '2'],
        type: 'group',
        status: 'scheduled',
        protocol: 'TP-001',
        results: {
          completed: false
        },
        notes: ['Focus on longevity and projection', 'Compare with market benchmark']
      }
    ]

    setSamples(mockSamples)
    setEvaluators(mockEvaluators)
    setTestingSessions(mockSessions)
  }, [])

  const createNewSample = () => {
    const sample: TestingSample = {
      id: Date.now().toString(),
      sampleCode: `TS-${new Date().getFullYear()}-${String(samples.length + 1).padStart(3, '0')}`,
      name: newSampleForm.name,
      nameAr: newSampleForm.nameAr,
      type: newSampleForm.type,
      physicalProperties: {
        volume: parseFloat(newSampleForm.volume) || 10,
        color: newSampleForm.color,
        clarity: 8,
        viscosity: 2.0,
        density: 0.95,
        appearance: newSampleForm.appearance,
        texture: 'Smooth',
        measurements: {
          measuredBy: 'System',
          measuredAt: new Date().toISOString(),
          environment: {
            temperature: 22,
            humidity: 50,
            lighting: 'Standard'
          }
        }
      },
      testingProtocol: {
        id: 'TP-STANDARD',
        name: 'Standard Evaluation',
        nameAr: 'التقييم المعياري',
        type: 'olfactory',
        duration: 4,
        phases: [],
        evaluators: evaluators.filter(e => newSampleForm.assignedTo.includes(e.name)),
        environment: {
          temperature: { min: 20, max: 25, optimal: 22 },
          humidity: { min: 40, max: 60, optimal: 50 },
          lighting: 'Natural daylight',
          ventilation: 'Controlled'
        },
        instructions: 'Standard olfactory evaluation',
        instructionsAr: 'التقييم الشمي المعياري'
      },
      evaluations: [],
      status: 'pending',
      priority: newSampleForm.priority,
      requestedBy: newSampleForm.requestedBy,
      assignedTo: newSampleForm.assignedTo.filter(a => a.trim()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: newSampleForm.dueDate,
      notes: newSampleForm.notes ? [newSampleForm.notes] : []
    }

    setSamples(prev => [...prev, sample])
    setShowNewSampleDialog(false)
    setNewSampleForm({
      name: '', nameAr: '', type: 'new_formula', sourceProductId: '',
      volume: '', color: '', appearance: '', requestedBy: '',
      assignedTo: [''], priority: 'medium', dueDate: '', notes: ''
    })
  }

  const submitEvaluation = () => {
    if (!selectedSample) return

    const evaluation: SampleEvaluation = {
      id: Date.now().toString(),
      evaluatorId: evaluationForm.evaluatorId,
      evaluatedAt: new Date().toISOString(),
      phase: evaluationForm.phase,
      environment: {
        temperature: parseFloat(evaluationForm.environment.temperature),
        humidity: parseFloat(evaluationForm.environment.humidity),
        lighting: evaluationForm.environment.lighting,
        mood: evaluationForm.environment.mood,
        fatigue: parseFloat(evaluationForm.environment.fatigue)
      },
      scores: evaluationForm.scores,
      overallRating: parseFloat(evaluationForm.overallRating),
      recommendations: evaluationForm.recommendations.filter(r => r.trim()),
      issues: evaluationForm.issues.filter(i => i.trim()),
      strengths: evaluationForm.strengths.filter(s => s.trim()),
      improvements: evaluationForm.improvements.filter(i => i.trim()),
      willingness: {
        toRecommend: parseFloat(evaluationForm.willingness.toRecommend),
        toPurchase: parseFloat(evaluationForm.willingness.toPurchase),
        toUseDaily: parseFloat(evaluationForm.willingness.toUseDaily)
      },
      notes: evaluationForm.notes,
      notesAr: evaluationForm.notesAr,
      status: 'submitted'
    }

    setSamples(prev => prev.map(sample =>
      sample.id === selectedSample
        ? { ...sample, evaluations: [...sample.evaluations, evaluation], status: 'evaluation' }
        : sample
    ))

    setShowEvaluationDialog(false)
    setEvaluationForm({
      evaluatorId: '', phase: '',
      environment: { temperature: '22', humidity: '50', lighting: 'natural', mood: 'neutral', fatigue: '1' },
      scores: [], overallRating: '5',
      recommendations: [''], issues: [''], strengths: [''], improvements: [''],
      willingness: { toRecommend: '5', toPurchase: '5', toUseDaily: '5' },
      notes: '', notesAr: ''
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'testing': return <TestTube className="h-4 w-4 text-blue-600" />
      case 'evaluation': return <Eye className="h-4 w-4 text-purple-600" />
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <X className="h-4 w-4 text-red-600" />
      case 'on_hold': return <Timer className="h-4 w-4 text-gray-600" />
      default: return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'testing': return 'bg-blue-100 text-blue-800'
      case 'evaluation': return 'bg-purple-100 text-purple-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'on_hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_formula': return <TestTube className="h-4 w-4 text-blue-600" />
      case 'batch_quality': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'competitor_analysis': return <BarChart3 className="h-4 w-4 text-purple-600" />
      case 'customer_request': return <Users className="h-4 w-4 text-orange-600" />
      case 'r_and_d': return <Activity className="h-4 w-4 text-red-600" />
      default: return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.nameAr.includes(searchTerm) ||
                         sample.sampleCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || sample.status === statusFilter
    const matchesType = typeFilter === 'all' || sample.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || sample.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const sampleStats = {
    total: samples.length,
    pending: samples.filter(s => s.status === 'pending').length,
    testing: samples.filter(s => s.status === 'testing').length,
    evaluation: samples.filter(s => s.status === 'evaluation').length,
    approved: samples.filter(s => s.status === 'approved').length,
    avgRating: samples.length > 0 ?
      samples.reduce((sum, s) => {
        const avgEval = s.evaluations.length > 0 ?
          s.evaluations.reduce((evalSum, e) => evalSum + e.overallRating, 0) / s.evaluations.length : 0
        return sum + avgEval
      }, 0) / samples.length : 0
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TestTube className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold">
            {language === 'ar' ? 'نظام إدارة عينات اختبار العطور' : 'Perfume Testing Samples Management'}
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

          <Button onClick={() => setShowSessionDialog(true)} variant="outline">
            <Users className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'جلسة جديدة' : 'New Session'}
          </Button>

          <Button onClick={() => setShowNewSampleDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'عينة جديدة' : 'New Sample'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sampleStats.total}</div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'إجمالي العينات' : 'Total Samples'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{sampleStats.pending}</div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'معلقة' : 'Pending'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sampleStats.testing}</div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'قيد الاختبار' : 'Testing'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{sampleStats.evaluation}</div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'قيد التقييم' : 'Evaluation'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sampleStats.approved}</div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'موافق عليها' : 'Approved'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{sampleStats.avgRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'متوسط التقييم' : 'Avg Rating'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="samples">
            {language === 'ar' ? 'العينات' : 'Samples'}
          </TabsTrigger>
          <TabsTrigger value="evaluations">
            {language === 'ar' ? 'التقييمات' : 'Evaluations'}
          </TabsTrigger>
          <TabsTrigger value="sessions">
            {language === 'ar' ? 'الجلسات' : 'Sessions'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {language === 'ar' ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
        </TabsList>

        {/* Samples Tab */}
        <TabsContent value="samples" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={language === 'ar' ? 'البحث عن العينات...' : 'Search samples...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                      <SelectItem value="pending">{language === 'ar' ? 'معلقة' : 'Pending'}</SelectItem>
                      <SelectItem value="testing">{language === 'ar' ? 'اختبار' : 'Testing'}</SelectItem>
                      <SelectItem value="evaluation">{language === 'ar' ? 'تقييم' : 'Evaluation'}</SelectItem>
                      <SelectItem value="approved">{language === 'ar' ? 'موافق' : 'Approved'}</SelectItem>
                      <SelectItem value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:w-40">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                      <SelectItem value="new_formula">{language === 'ar' ? 'تركيبة جديدة' : 'New Formula'}</SelectItem>
                      <SelectItem value="batch_quality">{language === 'ar' ? 'جودة الدفعة' : 'Batch Quality'}</SelectItem>
                      <SelectItem value="competitor_analysis">{language === 'ar' ? 'تحليل المنافسين' : 'Competitor Analysis'}</SelectItem>
                      <SelectItem value="customer_request">{language === 'ar' ? 'طلب عميل' : 'Customer Request'}</SelectItem>
                      <SelectItem value="r_and_d">{language === 'ar' ? 'بحث وتطوير' : 'R&D'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:w-32">
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ar' ? 'جميع الأولويات' : 'All Priorities'}</SelectItem>
                      <SelectItem value="low">{language === 'ar' ? 'منخفض' : 'Low'}</SelectItem>
                      <SelectItem value="medium">{language === 'ar' ? 'متوسط' : 'Medium'}</SelectItem>
                      <SelectItem value="high">{language === 'ar' ? 'عالي' : 'High'}</SelectItem>
                      <SelectItem value="urgent">{language === 'ar' ? 'عاجل' : 'Urgent'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Samples List */}
          <div className="space-y-4">
            {filteredSamples.map((sample) => (
              <Card key={sample.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(sample.type)}
                        <h3 className="text-lg font-semibold">{sample.sampleCode}</h3>
                      </div>
                      <Badge variant="outline" className={getStatusColor(sample.status)}>
                        {getStatusIcon(sample.status)}
                        <span className="ml-1 capitalize">{sample.status}</span>
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(sample.priority)}>
                        {sample.priority}
                      </Badge>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSample(sample.id)
                          setShowEvaluationDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'تقييم' : 'Evaluate'}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Sample Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {language === 'ar' ? 'الاسم:' : 'Name:'}
                      </Label>
                      <div className="font-medium">
                        {language === 'ar' ? sample.nameAr : sample.name}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {language === 'ar' ? 'طلب من:' : 'Requested by:'}
                      </Label>
                      <div>{sample.requestedBy}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {language === 'ar' ? 'تاريخ الاستحقاق:' : 'Due Date:'}
                      </Label>
                      <div>
                        {sample.dueDate
                          ? new Date(sample.dueDate).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-AE')
                          : 'Not set'}
                      </div>
                    </div>
                  </div>

                  {/* Physical Properties */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Droplet className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-semibold">{sample.physicalProperties.volume}ml</div>
                      <div className="text-xs text-gray-600">Volume</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Palette className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                      <div className="text-sm font-semibold">{sample.physicalProperties.color}</div>
                      <div className="text-xs text-gray-600">Color</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Eye className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <div className="text-sm font-semibold">{sample.physicalProperties.clarity}/10</div>
                      <div className="text-xs text-gray-600">Clarity</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Activity className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                      <div className="text-sm font-semibold">{sample.physicalProperties.viscosity} cP</div>
                      <div className="text-xs text-gray-600">Viscosity</div>
                    </div>
                  </div>

                  {/* Assigned Evaluators */}
                  <div className="mb-4">
                    <Label className="text-sm font-medium text-gray-600 mb-2 block">
                      {language === 'ar' ? 'المقيمون المعينون:' : 'Assigned Evaluators:'}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {sample.assignedTo.map((evaluator, index) => (
                        <Badge key={index} variant="outline">
                          <User className="h-3 w-3 mr-1" />
                          {evaluator}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Evaluations Summary */}
                  {sample.evaluations.length > 0 && (
                    <div className="border-t pt-4">
                      <Label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'ملخص التقييمات:' : 'Evaluations Summary:'}
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {sample.evaluations.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            {language === 'ar' ? 'التقييمات' : 'Evaluations'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {sample.evaluations.length > 0
                              ? (sample.evaluations.reduce((sum, e) => sum + e.overallRating, 0) / sample.evaluations.length).toFixed(1)
                              : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {sample.evaluations.length > 0
                              ? (sample.evaluations.reduce((sum, e) => sum + e.willingness.toRecommend, 0) / sample.evaluations.length).toFixed(1)
                              : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {language === 'ar' ? 'الاستعداد للتوصية' : 'Willingness to Recommend'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSamples.length === 0 && (
            <div className="text-center py-12">
              <TestTube className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">
                {language === 'ar' ? 'لا توجد عينات' : 'No samples found'}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Other tabs would be implemented similarly... */}
        <TabsContent value="evaluations" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Eye className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                {language === 'ar' ? 'قريباً' : 'Coming Soon'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'صفحة التقييمات قيد التطوير'
                  : 'Evaluations page is under development'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                {language === 'ar' ? 'قريباً' : 'Coming Soon'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'صفحة جلسات الاختبار قيد التطوير'
                  : 'Testing sessions page is under development'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                {language === 'ar' ? 'قريباً' : 'Coming Soon'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'صفحة التحليلات قيد التطوير'
                  : 'Analytics page is under development'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Sample Dialog */}
      <Dialog open={showNewSampleDialog} onOpenChange={setShowNewSampleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'إنشاء عينة جديدة' : 'Create New Sample'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'اسم العينة' : 'Sample Name'}</Label>
                <Input
                  value={newSampleForm.name}
                  onChange={(e) => setNewSampleForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Sample name"
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}</Label>
                <Input
                  value={newSampleForm.nameAr}
                  onChange={(e) => setNewSampleForm(prev => ({ ...prev, nameAr: e.target.value }))}
                  placeholder="اسم العينة"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>{language === 'ar' ? 'نوع العينة' : 'Sample Type'}</Label>
                <Select value={newSampleForm.type} onValueChange={(value: any) => setNewSampleForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_formula">{language === 'ar' ? 'تركيبة جديدة' : 'New Formula'}</SelectItem>
                    <SelectItem value="batch_quality">{language === 'ar' ? 'جودة الدفعة' : 'Batch Quality'}</SelectItem>
                    <SelectItem value="competitor_analysis">{language === 'ar' ? 'تحليل منافسين' : 'Competitor Analysis'}</SelectItem>
                    <SelectItem value="customer_request">{language === 'ar' ? 'طلب عميل' : 'Customer Request'}</SelectItem>
                    <SelectItem value="r_and_d">{language === 'ar' ? 'بحث وتطوير' : 'R&D'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'ar' ? 'الأولوية' : 'Priority'}</Label>
                <Select value={newSampleForm.priority} onValueChange={(value: any) => setNewSampleForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{language === 'ar' ? 'منخفض' : 'Low'}</SelectItem>
                    <SelectItem value="medium">{language === 'ar' ? 'متوسط' : 'Medium'}</SelectItem>
                    <SelectItem value="high">{language === 'ar' ? 'عالي' : 'High'}</SelectItem>
                    <SelectItem value="urgent">{language === 'ar' ? 'عاجل' : 'Urgent'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'ar' ? 'الحجم (مل)' : 'Volume (ml)'}</Label>
                <Input
                  type="number"
                  value={newSampleForm.volume}
                  onChange={(e) => setNewSampleForm(prev => ({ ...prev, volume: e.target.value }))}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'اللون' : 'Color'}</Label>
                <Input
                  value={newSampleForm.color}
                  onChange={(e) => setNewSampleForm(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="Clear amber"
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'المظهر' : 'Appearance'}</Label>
                <Input
                  value={newSampleForm.appearance}
                  onChange={(e) => setNewSampleForm(prev => ({ ...prev, appearance: e.target.value }))}
                  placeholder="Clear liquid"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'طلب من' : 'Requested By'}</Label>
                <Input
                  value={newSampleForm.requestedBy}
                  onChange={(e) => setNewSampleForm(prev => ({ ...prev, requestedBy: e.target.value }))}
                  placeholder="R&D Team"
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</Label>
                <Input
                  type="date"
                  value={newSampleForm.dueDate}
                  onChange={(e) => setNewSampleForm(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>{language === 'ar' ? 'المقيمون المعينون' : 'Assigned Evaluators'}</Label>
              <div className="space-y-2">
                {newSampleForm.assignedTo.map((evaluator, index) => (
                  <div key={index} className="flex space-x-2">
                    <Select value={evaluator} onValueChange={(value) => {
                      const updated = [...newSampleForm.assignedTo]
                      updated[index] = value
                      setNewSampleForm(prev => ({ ...prev, assignedTo: updated }))
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select evaluator..." />
                      </SelectTrigger>
                      <SelectContent>
                        {evaluators.map((eval) => (
                          <SelectItem key={eval.id} value={eval.name}>
                            {language === 'ar' ? eval.nameAr : eval.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = newSampleForm.assignedTo.filter((_, i) => i !== index)
                          setNewSampleForm(prev => ({ ...prev, assignedTo: updated }))
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewSampleForm(prev => ({
                    ...prev,
                    assignedTo: [...prev.assignedTo, '']
                  }))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'إضافة مقيم' : 'Add Evaluator'}
                </Button>
              </div>
            </div>

            <div>
              <Label>{language === 'ar' ? 'ملاحظات' : 'Notes'}</Label>
              <Textarea
                value={newSampleForm.notes}
                onChange={(e) => setNewSampleForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about the sample..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewSampleDialog(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={createNewSample}>
                <Save className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'إنشاء عينة' : 'Create Sample'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Evaluation Dialog */}
      <Dialog open={showEvaluationDialog} onOpenChange={setShowEvaluationDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'تقييم العينة' : 'Sample Evaluation'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'المقيم' : 'Evaluator'}</Label>
                <Select value={evaluationForm.evaluatorId} onValueChange={(value) => setEvaluationForm(prev => ({ ...prev, evaluatorId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select evaluator..." />
                  </SelectTrigger>
                  <SelectContent>
                    {evaluators.map((evaluator) => (
                      <SelectItem key={evaluator.id} value={evaluator.id}>
                        {language === 'ar' ? evaluator.nameAr : evaluator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'ar' ? 'مرحلة التقييم' : 'Evaluation Phase'}</Label>
                <Select value={evaluationForm.phase} onValueChange={(value) => setEvaluationForm(prev => ({ ...prev, phase: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial">{language === 'ar' ? 'أولي' : 'Initial'}</SelectItem>
                    <SelectItem value="drydown">{language === 'ar' ? 'جفاف' : 'Drydown'}</SelectItem>
                    <SelectItem value="final">{language === 'ar' ? 'نهائي' : 'Final'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>{language === 'ar' ? 'التقييم العام (1-10)' : 'Overall Rating (1-10)'}</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={evaluationForm.overallRating}
                onChange={(e) => setEvaluationForm(prev => ({ ...prev, overallRating: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>{language === 'ar' ? 'الاستعداد للتوصية' : 'Willingness to Recommend'}</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={evaluationForm.willingness.toRecommend}
                  onChange={(e) => setEvaluationForm(prev => ({
                    ...prev,
                    willingness: { ...prev.willingness, toRecommend: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'الاستعداد للشراء' : 'Willingness to Purchase'}</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={evaluationForm.willingness.toPurchase}
                  onChange={(e) => setEvaluationForm(prev => ({
                    ...prev,
                    willingness: { ...prev.willingness, toPurchase: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'الاستعداد للاستخدام اليومي' : 'Willingness to Use Daily'}</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={evaluationForm.willingness.toUseDaily}
                  onChange={(e) => setEvaluationForm(prev => ({
                    ...prev,
                    willingness: { ...prev.willingness, toUseDaily: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div>
              <Label>{language === 'ar' ? 'ملاحظات التقييم' : 'Evaluation Notes'}</Label>
              <Textarea
                value={evaluationForm.notes}
                onChange={(e) => setEvaluationForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Detailed evaluation notes..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEvaluationDialog(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={submitEvaluation}>
                <Save className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'حفظ التقييم' : 'Submit Evaluation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PerfumeTestingSamplesSystem