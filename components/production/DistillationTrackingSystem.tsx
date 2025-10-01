'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Beaker,
  Thermometer,
  Droplet,
  Timer,
  Gauge,
  Wind,
  Eye,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  Camera,
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
  LineChart,
  Calendar,
  MapPin,
  Package
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

interface DistillationBatch {
  id: string
  batchNumber: string
  type: 'distillation' | 'maceration' | 'aging'
  rawMaterials: RawMaterial[]
  recipe: Recipe
  equipment: Equipment
  process: ProcessData
  environmental: EnvironmentalData
  quality: QualityMetrics
  status: 'preparing' | 'active' | 'monitoring' | 'cooling' | 'separating' | 'completed' | 'failed'
  operator: string
  startTime?: string
  endTime?: string
  estimatedDuration: number // hours
  actualDuration?: number // hours
  yield: YieldData
  notes: string[]
  createdAt: string
  updatedAt: string
}

interface RawMaterial {
  id: string
  name: string
  nameAr: string
  type: 'oud_chips' | 'oud_powder' | 'alcohol' | 'water' | 'carrier_oil' | 'essential_oil'
  quantity: number
  unit: string
  grade?: string
  origin?: string
  batchNumber?: string
  purity?: number
  notes?: string
}

interface Recipe {
  id: string
  name: string
  nameAr: string
  type: 'traditional' | 'modern' | 'hybrid'
  targetProduct: string
  steps: ProcessStep[]
  totalDuration: number
  expectedYield: number
  qualityTargets: QualityTargets
  notes?: string
}

interface ProcessStep {
  id: string
  name: string
  nameAr: string
  order: number
  duration: number // hours
  temperature: {
    min: number
    max: number
    target: number
  }
  pressure?: {
    min: number
    max: number
    target: number
  }
  agitation?: {
    speed: number // RPM
    pattern: 'continuous' | 'intermittent'
  }
  checkpoints: string[]
  criticalParameters: string[]
  instructions: string
  instructionsAr: string
}

interface Equipment {
  distillationUnit: {
    id: string
    name: string
    capacity: number // liters
    material: string
    status: 'available' | 'in_use' | 'maintenance' | 'cleaning'
    lastCalibration: string
    nextMaintenance: string
  }
  condenser: {
    id: string
    type: 'water_cooled' | 'air_cooled'
    efficiency: number
    temperature: number
  }
  heatingSystem: {
    type: 'electric' | 'gas' | 'steam'
    maxPower: number // kW
    currentPower: number
    efficiency: number
  }
  sensors: EquipmentSensor[]
}

interface EquipmentSensor {
  id: string
  type: 'temperature' | 'pressure' | 'humidity' | 'ph' | 'conductivity' | 'flow_rate'
  location: string
  unit: string
  currentValue: number
  minValue: number
  maxValue: number
  calibrationDate: string
  status: 'active' | 'warning' | 'error' | 'offline'
}

interface ProcessData {
  currentStep: number
  stepStartTime?: string
  stepDuration: number
  totalElapsed: number
  measurements: ProcessMeasurement[]
  events: ProcessEvent[]
  alarms: ProcessAlarm[]
  autoControl: {
    enabled: boolean
    temperatureControl: boolean
    pressureControl: boolean
    agitationControl: boolean
  }
}

interface ProcessMeasurement {
  timestamp: string
  step: number
  temperature: number
  pressure?: number
  ph?: number
  conductivity?: number
  flowRate?: number
  agitationSpeed?: number
  notes?: string
}

interface ProcessEvent {
  timestamp: string
  type: 'step_start' | 'step_end' | 'parameter_change' | 'operator_action' | 'alarm' | 'maintenance'
  description: string
  operator?: string
  parameters?: Record<string, any>
}

interface ProcessAlarm {
  id: string
  timestamp: string
  type: 'warning' | 'critical' | 'info'
  parameter: string
  currentValue: number
  threshold: number
  message: string
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
}

interface EnvironmentalData {
  ambientTemperature: number
  ambientHumidity: number
  barometricPressure: number
  airQuality: number
  noiseLevel: number
  vibrationLevel: number
  roomCleanliness: 'sterile' | 'clean' | 'acceptable' | 'poor'
  airflow: number // m/s
  lighting: number // lux
  readings: EnvironmentalReading[]
}

interface EnvironmentalReading {
  timestamp: string
  temperature: number
  humidity: number
  pressure: number
  airQuality: number
  notes?: string
}

interface QualityMetrics {
  aromaProfile: {
    intensity: number
    complexity: number
    purity: number
    notes: string[]
  }
  physicalProperties: {
    color: string
    clarity: number
    viscosity: number
    density: number
    ph?: number
  }
  chemicalAnalysis: {
    alcoholContent?: number
    essentialOilContent?: number
    waterContent?: number
    impurities?: number
    purity?: number
  }
  overallScore: number
  certificationStatus: 'pending' | 'approved' | 'rejected' | 'requires_retest'
  certifiedBy?: string
  certificationDate?: string
  notes?: string
}

interface QualityTargets {
  aromaIntensity: { min: number; max: number }
  purity: { min: number }
  color: string[]
  clarity: { min: number }
  alcoholContent?: { min: number; max: number }
  yield: { min: number; max: number }
}

interface YieldData {
  expected: number // ml
  actual?: number // ml
  efficiency?: number // percentage
  waste?: number // ml
  byproducts?: {
    name: string
    quantity: number
    unit: string
  }[]
}

const DistillationTrackingSystem: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [batches, setBatches] = useState<DistillationBatch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string>('')
  const [activeView, setActiveView] = useState<'overview' | 'monitor' | 'analysis'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showNewBatchDialog, setShowNewBatchDialog] = useState(false)
  const [showRecipeDialog, setShowRecipeDialog] = useState(false)
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(false)

  // Form states
  const [newBatchForm, setNewBatchForm] = useState({
    type: 'distillation' as const,
    rawMaterials: [{ name: '', type: 'oud_chips' as const, quantity: '', unit: 'kg' }],
    recipe: '',
    operator: '',
    estimatedDuration: '',
    notes: ''
  })

  // Mock data initialization
  useEffect(() => {
    const mockBatches: DistillationBatch[] = [
      {
        id: '1',
        batchNumber: 'DIST-2024-001',
        type: 'distillation',
        rawMaterials: [
          {
            id: '1',
            name: 'Premium Oud Chips',
            nameAr: 'رقائق العود الممتازة',
            type: 'oud_chips',
            quantity: 5,
            unit: 'kg',
            grade: 'premium',
            origin: 'Cambodia',
            batchNumber: 'OUD-2024-001'
          },
          {
            id: '2',
            name: 'Distilled Water',
            nameAr: 'ماء مقطر',
            type: 'water',
            quantity: 50,
            unit: 'liter',
            purity: 99.9
          }
        ],
        recipe: {
          id: '1',
          name: 'Traditional Oud Distillation',
          nameAr: 'تقطير العود التقليدي',
          type: 'traditional',
          targetProduct: 'Oud Oil',
          steps: [
            {
              id: '1',
              name: 'Soaking',
              nameAr: 'النقع',
              order: 1,
              duration: 24,
              temperature: { min: 20, max: 25, target: 22 },
              checkpoints: ['Material saturation', 'Water clarity'],
              criticalParameters: ['Temperature', 'Time'],
              instructions: 'Soak oud chips in distilled water for 24 hours',
              instructionsAr: 'انقع رقائق العود في الماء المقطر لمدة 24 ساعة'
            },
            {
              id: '2',
              name: 'Primary Distillation',
              nameAr: 'التقطير الأولي',
              order: 2,
              duration: 72,
              temperature: { min: 95, max: 100, target: 98 },
              pressure: { min: 1, max: 1.2, target: 1.1 },
              agitation: { speed: 50, pattern: 'intermittent' },
              checkpoints: ['Steam quality', 'Condensation rate', 'Color development'],
              criticalParameters: ['Temperature', 'Pressure', 'Agitation'],
              instructions: 'Maintain steady distillation with controlled heating',
              instructionsAr: 'حافظ على التقطير المستمر مع التدفئة المحكومة'
            }
          ],
          totalDuration: 96,
          expectedYield: 15,
          qualityTargets: {
            aromaIntensity: { min: 7, max: 10 },
            purity: { min: 95 },
            color: ['Dark amber', 'Deep brown'],
            clarity: { min: 8 },
            yield: { min: 10, max: 20 }
          }
        },
        equipment: {
          distillationUnit: {
            id: 'DU-001',
            name: 'Traditional Copper Still',
            capacity: 100,
            material: 'Copper',
            status: 'in_use',
            lastCalibration: '2024-01-01',
            nextMaintenance: '2024-03-01'
          },
          condenser: {
            id: 'CD-001',
            type: 'water_cooled',
            efficiency: 95,
            temperature: 15
          },
          heatingSystem: {
            type: 'electric',
            maxPower: 10,
            currentPower: 7.5,
            efficiency: 90
          },
          sensors: [
            {
              id: 'TS-001',
              type: 'temperature',
              location: 'Main vessel',
              unit: '°C',
              currentValue: 98.2,
              minValue: 0,
              maxValue: 150,
              calibrationDate: '2024-01-01',
              status: 'active'
            },
            {
              id: 'PS-001',
              type: 'pressure',
              location: 'Main vessel',
              unit: 'bar',
              currentValue: 1.08,
              minValue: 0,
              maxValue: 2,
              calibrationDate: '2024-01-01',
              status: 'active'
            }
          ]
        },
        process: {
          currentStep: 2,
          stepStartTime: '2024-01-15T10:00:00Z',
          stepDuration: 48,
          totalElapsed: 72,
          measurements: [
            {
              timestamp: '2024-01-17T14:00:00Z',
              step: 2,
              temperature: 98.2,
              pressure: 1.08,
              agitationSpeed: 50
            }
          ],
          events: [
            {
              timestamp: '2024-01-15T08:00:00Z',
              type: 'step_start',
              description: 'Started soaking phase',
              operator: 'Ahmad Al-Khatib'
            },
            {
              timestamp: '2024-01-16T08:00:00Z',
              type: 'step_end',
              description: 'Completed soaking phase',
              operator: 'Ahmad Al-Khatib'
            },
            {
              timestamp: '2024-01-16T10:00:00Z',
              type: 'step_start',
              description: 'Started primary distillation',
              operator: 'Ahmad Al-Khatib'
            }
          ],
          alarms: [],
          autoControl: {
            enabled: true,
            temperatureControl: true,
            pressureControl: true,
            agitationControl: false
          }
        },
        environmental: {
          ambientTemperature: 24,
          ambientHumidity: 45,
          barometricPressure: 1013,
          airQuality: 85,
          noiseLevel: 45,
          vibrationLevel: 0.2,
          roomCleanliness: 'clean',
          airflow: 0.5,
          lighting: 800,
          readings: [
            {
              timestamp: '2024-01-17T14:00:00Z',
              temperature: 24,
              humidity: 45,
              pressure: 1013,
              airQuality: 85
            }
          ]
        },
        quality: {
          aromaProfile: {
            intensity: 8,
            complexity: 7,
            purity: 9,
            notes: ['Rich woody base', 'Complex sweet undertones']
          },
          physicalProperties: {
            color: 'Dark amber',
            clarity: 9,
            viscosity: 2.5,
            density: 0.98,
            ph: 6.8
          },
          chemicalAnalysis: {
            essentialOilContent: 95,
            waterContent: 3,
            impurities: 2,
            purity: 98
          },
          overallScore: 88,
          certificationStatus: 'pending'
        },
        status: 'active',
        operator: 'Ahmad Al-Khatib',
        startTime: '2024-01-15T08:00:00Z',
        estimatedDuration: 96,
        actualDuration: 72,
        yield: {
          expected: 15,
          actual: 12,
          efficiency: 80,
          waste: 1,
          byproducts: [
            { name: 'Oud water', quantity: 2, unit: 'liter' }
          ]
        },
        notes: ['High quality raw material', 'Optimal environmental conditions'],
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-17T14:00:00Z'
      }
    ]

    setBatches(mockBatches)
  }, [])

  // Real-time monitoring simulation
  useEffect(() => {
    if (!realTimeMonitoring) return

    const interval = setInterval(() => {
      setBatches(prev => prev.map(batch => {
        if (batch.status === 'active') {
          const currentTime = new Date()
          const newMeasurement: ProcessMeasurement = {
            timestamp: currentTime.toISOString(),
            step: batch.process.currentStep,
            temperature: 98 + Math.random() * 2 - 1, // ±1°C variation
            pressure: 1.08 + Math.random() * 0.04 - 0.02, // ±0.02 bar variation
            agitationSpeed: 50
          }

          return {
            ...batch,
            process: {
              ...batch.process,
              measurements: [...batch.process.measurements.slice(-50), newMeasurement],
              totalElapsed: batch.process.totalElapsed + 0.1
            },
            environmental: {
              ...batch.environmental,
              readings: [...batch.environmental.readings.slice(-50), {
                timestamp: currentTime.toISOString(),
                temperature: 24 + Math.random() * 2 - 1,
                humidity: 45 + Math.random() * 5 - 2.5,
                pressure: 1013 + Math.random() * 2 - 1,
                airQuality: 85 + Math.random() * 5 - 2.5
              }]
            },
            updatedAt: currentTime.toISOString()
          }
        }
        return batch
      }))
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [realTimeMonitoring])

  const createNewBatch = () => {
    const batch: DistillationBatch = {
      id: Date.now().toString(),
      batchNumber: `${newBatchForm.type.toUpperCase()}-${new Date().getFullYear()}-${String(batches.length + 1).padStart(3, '0')}`,
      type: newBatchForm.type,
      rawMaterials: newBatchForm.rawMaterials.map((rm, index) => ({
        id: `rm-${index}`,
        name: rm.name,
        nameAr: rm.name,
        type: rm.type,
        quantity: parseFloat(rm.quantity) || 0,
        unit: rm.unit
      })),
      recipe: {
        id: 'recipe-1',
        name: 'Custom Recipe',
        nameAr: 'وصفة مخصصة',
        type: 'modern',
        targetProduct: 'Custom Product',
        steps: [],
        totalDuration: parseFloat(newBatchForm.estimatedDuration) || 24,
        expectedYield: 10,
        qualityTargets: {
          aromaIntensity: { min: 5, max: 10 },
          purity: { min: 90 },
          color: ['Light', 'Medium', 'Dark'],
          clarity: { min: 7 },
          yield: { min: 5, max: 15 }
        }
      },
      equipment: {
        distillationUnit: {
          id: 'DU-001',
          name: 'Standard Unit',
          capacity: 50,
          material: 'Stainless Steel',
          status: 'available',
          lastCalibration: new Date().toISOString().split('T')[0],
          nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        condenser: {
          id: 'CD-001',
          type: 'water_cooled',
          efficiency: 90,
          temperature: 20
        },
        heatingSystem: {
          type: 'electric',
          maxPower: 5,
          currentPower: 0,
          efficiency: 85
        },
        sensors: []
      },
      process: {
        currentStep: 0,
        stepDuration: 0,
        totalElapsed: 0,
        measurements: [],
        events: [],
        alarms: [],
        autoControl: {
          enabled: false,
          temperatureControl: false,
          pressureControl: false,
          agitationControl: false
        }
      },
      environmental: {
        ambientTemperature: 22,
        ambientHumidity: 50,
        barometricPressure: 1013,
        airQuality: 80,
        noiseLevel: 40,
        vibrationLevel: 0.1,
        roomCleanliness: 'clean',
        airflow: 0.3,
        lighting: 600,
        readings: []
      },
      quality: {
        aromaProfile: {
          intensity: 0,
          complexity: 0,
          purity: 0,
          notes: []
        },
        physicalProperties: {
          color: '',
          clarity: 0,
          viscosity: 0,
          density: 0
        },
        chemicalAnalysis: {},
        overallScore: 0,
        certificationStatus: 'pending'
      },
      status: 'preparing',
      operator: newBatchForm.operator,
      estimatedDuration: parseFloat(newBatchForm.estimatedDuration) || 24,
      yield: {
        expected: 10
      },
      notes: newBatchForm.notes ? [newBatchForm.notes] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setBatches(prev => [...prev, batch])
    setShowNewBatchDialog(false)
    setNewBatchForm({
      type: 'distillation',
      rawMaterials: [{ name: '', type: 'oud_chips', quantity: '', unit: 'kg' }],
      recipe: '',
      operator: '',
      estimatedDuration: '',
      notes: ''
    })
  }

  const startBatch = (batchId: string) => {
    setBatches(prev => prev.map(batch =>
      batch.id === batchId
        ? {
            ...batch,
            status: 'active',
            startTime: new Date().toISOString(),
            process: {
              ...batch.process,
              currentStep: 1,
              stepStartTime: new Date().toISOString(),
              events: [...batch.process.events, {
                timestamp: new Date().toISOString(),
                type: 'step_start',
                description: 'Batch started',
                operator: batch.operator
              }]
            }
          }
        : batch
    ))
  }

  const pauseBatch = (batchId: string) => {
    setBatches(prev => prev.map(batch =>
      batch.id === batchId
        ? {
            ...batch,
            status: 'monitoring',
            process: {
              ...batch.process,
              events: [...batch.process.events, {
                timestamp: new Date().toISOString(),
                type: 'operator_action',
                description: 'Batch paused',
                operator: batch.operator
              }]
            }
          }
        : batch
    ))
  }

  const stopBatch = (batchId: string) => {
    setBatches(prev => prev.map(batch =>
      batch.id === batchId
        ? {
            ...batch,
            status: 'completed',
            endTime: new Date().toISOString(),
            actualDuration: batch.process.totalElapsed,
            process: {
              ...batch.process,
              events: [...batch.process.events, {
                timestamp: new Date().toISOString(),
                type: 'step_end',
                description: 'Batch completed',
                operator: batch.operator
              }]
            }
          }
        : batch
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return <Settings className="h-4 w-4 text-gray-600" />
      case 'active': return <Play className="h-4 w-4 text-green-600" />
      case 'monitoring': return <Eye className="h-4 w-4 text-blue-600" />
      case 'cooling': return <Thermometer className="h-4 w-4 text-blue-400" />
      case 'separating': return <Droplet className="h-4 w-4 text-purple-600" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed': return <X className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-gray-100 text-gray-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'monitoring': return 'bg-blue-100 text-blue-800'
      case 'cooling': return 'bg-blue-50 text-blue-700'
      case 'separating': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'distillation': return <Beaker className="h-4 w-4 text-blue-600" />
      case 'maceration': return <Timer className="h-4 w-4 text-green-600" />
      case 'aging': return <Clock className="h-4 w-4 text-amber-600" />
      default: return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.recipe.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter
    const matchesType = typeFilter === 'all' || batch.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const activeBatches = batches.filter(b => ['active', 'monitoring'].includes(b.status))
  const selectedBatchData = batches.find(b => b.id === selectedBatch)

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Beaker className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">
            {language === 'ar' ? 'نظام تتبع التقطير والنقع' : 'Distillation & Maceration Tracking'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={realTimeMonitoring}
              onCheckedChange={setRealTimeMonitoring}
              id="monitoring"
            />
            <Label htmlFor="monitoring" className="text-sm">
              {language === 'ar' ? 'مراقبة فورية' : 'Real-time'}
            </Label>
            {realTimeMonitoring && (
              <Badge className="bg-green-100 text-green-800 animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
          >
            {language === 'ar' ? 'EN' : 'ع'}
          </Button>

          <Button onClick={() => setShowNewBatchDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'دفعة جديدة' : 'New Batch'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي الدفعات' : 'Total Batches'}
                </p>
                <p className="text-2xl font-bold">{batches.length}</p>
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
                  {language === 'ar' ? 'نشطة' : 'Active'}
                </p>
                <p className="text-2xl font-bold text-green-600">{activeBatches.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'مكتملة' : 'Completed'}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {batches.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'متوسط الكفاءة' : 'Avg Efficiency'}
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {batches.length > 0
                    ? Math.round(batches.reduce((sum, b) => sum + (b.yield.efficiency || 0), 0) / batches.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="monitor">
            {language === 'ar' ? 'المراقبة' : 'Monitor'}
          </TabsTrigger>
          <TabsTrigger value="analysis">
            {language === 'ar' ? 'التحليل' : 'Analysis'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <Card>
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
                <div className="sm:w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                      <SelectItem value="preparing">{language === 'ar' ? 'التحضير' : 'Preparing'}</SelectItem>
                      <SelectItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                      <SelectItem value="monitoring">{language === 'ar' ? 'مراقبة' : 'Monitoring'}</SelectItem>
                      <SelectItem value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
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
                      <SelectItem value="distillation">{language === 'ar' ? 'تقطير' : 'Distillation'}</SelectItem>
                      <SelectItem value="maceration">{language === 'ar' ? 'نقع' : 'Maceration'}</SelectItem>
                      <SelectItem value="aging">{language === 'ar' ? 'تعتيق' : 'Aging'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Batches List */}
          <div className="space-y-4">
            {filteredBatches.map((batch) => (
              <Card key={batch.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(batch.type)}
                        <h3 className="text-lg font-semibold">{batch.batchNumber}</h3>
                      </div>
                      <Badge variant="outline" className={getStatusColor(batch.status)}>
                        {getStatusIcon(batch.status)}
                        <span className="ml-1 capitalize">{batch.status}</span>
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {batch.type}
                      </Badge>
                    </div>

                    <div className="flex space-x-2">
                      {batch.status === 'preparing' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startBatch(batch.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {language === 'ar' ? 'بدء' : 'Start'}
                        </Button>
                      )}
                      {batch.status === 'active' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pauseBatch(batch.id)}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            {language === 'ar' ? 'إيقاف' : 'Pause'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => stopBatch(batch.id)}
                          >
                            <Square className="h-4 w-4 mr-2" />
                            {language === 'ar' ? 'إنهاء' : 'Stop'}
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBatch(batch.id)
                          setActiveView('monitor')
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Batch Info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {language === 'ar' ? 'الوصفة:' : 'Recipe:'}
                      </Label>
                      <div>{language === 'ar' ? batch.recipe.nameAr : batch.recipe.name}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {language === 'ar' ? 'المشغل:' : 'Operator:'}
                      </Label>
                      <div>{batch.operator}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {language === 'ar' ? 'المدة المتوقعة:' : 'Est. Duration:'}
                      </Label>
                      <div>{batch.estimatedDuration}h</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {language === 'ar' ? 'العائد المتوقع:' : 'Expected Yield:'}
                      </Label>
                      <div>{batch.yield.expected}ml</div>
                    </div>
                  </div>

                  {/* Progress */}
                  {batch.status === 'active' && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm font-medium">
                          {language === 'ar' ? 'التقدم:' : 'Progress:'}
                        </Label>
                        <span className="text-sm text-gray-600">
                          {Math.round((batch.process.totalElapsed / batch.estimatedDuration) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(batch.process.totalElapsed / batch.estimatedDuration) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{batch.process.totalElapsed.toFixed(1)}h elapsed</span>
                        <span>{(batch.estimatedDuration - batch.process.totalElapsed).toFixed(1)}h remaining</span>
                      </div>
                    </div>
                  )}

                  {/* Current Conditions */}
                  {['active', 'monitoring'].includes(batch.status) && batch.process.measurements.length > 0 && (
                    <div className="border-t pt-4">
                      <Label className="text-sm font-medium mb-2 block">
                        {language === 'ar' ? 'الظروف الحالية:' : 'Current Conditions:'}
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span>
                            {batch.process.measurements[batch.process.measurements.length - 1]?.temperature?.toFixed(1)}°C
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Gauge className="h-4 w-4 text-blue-500" />
                          <span>
                            {batch.process.measurements[batch.process.measurements.length - 1]?.pressure?.toFixed(2)} bar
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wind className="h-4 w-4 text-green-500" />
                          <span>{batch.environmental.ambientHumidity}% RH</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-purple-500" />
                          <span>Step {batch.process.currentStep}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Alarms */}
                  {batch.process.alarms.length > 0 && (
                    <div className="border-t pt-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {batch.process.alarms.length} active alarm(s)
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBatches.length === 0 && (
            <div className="text-center py-12">
              <Beaker className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">
                {language === 'ar' ? 'لا توجد دفعات' : 'No batches found'}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Monitor Tab */}
        <TabsContent value="monitor" className="space-y-6">
          {selectedBatchData ? (
            <div className="space-y-6">
              {/* Batch Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(selectedBatchData.type)}
                      <h2 className="text-xl font-semibold">{selectedBatchData.batchNumber}</h2>
                      <Badge className={getStatusColor(selectedBatchData.status)}>
                        {getStatusIcon(selectedBatchData.status)}
                        <span className="ml-1 capitalize">{selectedBatchData.status}</span>
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select batch..." />
                        </SelectTrigger>
                        <SelectContent>
                          {batches.map((batch) => (
                            <SelectItem key={batch.id} value={batch.id}>
                              {batch.batchNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Real-time Monitoring Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Process Parameters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Gauge className="h-5 w-5" />
                      <span>{language === 'ar' ? 'معايير العملية' : 'Process Parameters'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedBatchData.process.measurements.length > 0 ? (
                      <div className="space-y-4">
                        {(() => {
                          const latest = selectedBatchData.process.measurements[selectedBatchData.process.measurements.length - 1]
                          return (
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                  <Thermometer className="h-8 w-8 mx-auto mb-2 text-red-500" />
                                  <div className="text-2xl font-bold text-red-700">
                                    {latest.temperature?.toFixed(1)}°C
                                  </div>
                                  <div className="text-sm text-gray-600">Temperature</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                  <Gauge className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                                  <div className="text-2xl font-bold text-blue-700">
                                    {latest.pressure?.toFixed(2)} bar
                                  </div>
                                  <div className="text-sm text-gray-600">Pressure</div>
                                </div>
                              </div>

                              {latest.agitationSpeed && (
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                  <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                  <div className="text-2xl font-bold text-green-700">
                                    {latest.agitationSpeed} RPM
                                  </div>
                                  <div className="text-sm text-gray-600">Agitation Speed</div>
                                </div>
                              )}
                            </>
                          )
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {language === 'ar' ? 'لا توجد قياسات' : 'No measurements available'}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Environmental Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Wind className="h-5 w-5" />
                      <span>{language === 'ar' ? 'الظروف البيئية' : 'Environmental Conditions'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Thermometer className="h-6 w-6 mx-auto mb-1 text-orange-500" />
                        <div className="text-lg font-bold text-orange-700">
                          {selectedBatchData.environmental.ambientTemperature}°C
                        </div>
                        <div className="text-xs text-gray-600">Ambient Temp</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Droplet className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                        <div className="text-lg font-bold text-blue-700">
                          {selectedBatchData.environmental.ambientHumidity}%
                        </div>
                        <div className="text-xs text-gray-600">Humidity</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Wind className="h-6 w-6 mx-auto mb-1 text-green-500" />
                        <div className="text-lg font-bold text-green-700">
                          {selectedBatchData.environmental.airflow} m/s
                        </div>
                        <div className="text-xs text-gray-600">Airflow</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Eye className="h-6 w-6 mx-auto mb-1 text-purple-500" />
                        <div className="text-lg font-bold text-purple-700">
                          {selectedBatchData.environmental.airQuality}
                        </div>
                        <div className="text-xs text-gray-600">Air Quality</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Process Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{language === 'ar' ? 'الجدول الزمني للعملية' : 'Process Timeline'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedBatchData.process.events.slice(-10).reverse().map((event, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {event.description}
                              </p>
                              {event.operator && (
                                <p className="text-xs text-gray-600">
                                  {language === 'ar' ? 'المشغل:' : 'Operator:'} {event.operator}
                                </p>
                              )}
                            </div>
                            <time className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleString(language === 'ar' ? 'ar-AE' : 'en-AE')}
                            </time>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Eye className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'ar' ? 'اختر دفعة للمراقبة' : 'Select a Batch to Monitor'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'ar'
                    ? 'اختر دفعة من القائمة أعلاه لعرض تفاصيل المراقبة'
                    : 'Choose a batch from the overview tab to view monitoring details'}
                </p>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="w-64 mx-auto">
                    <SelectValue placeholder="Select batch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.batchNumber} - {batch.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>{language === 'ar' ? 'تحليل الأداء' : 'Performance Analysis'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {batches.filter(b => b.status === 'completed').length > 0
                      ? Math.round(batches
                          .filter(b => b.status === 'completed')
                          .reduce((sum, b) => sum + (b.yield.efficiency || 0), 0) /
                          batches.filter(b => b.status === 'completed').length)
                      : 0}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {language === 'ar' ? 'متوسط الكفاءة' : 'Average Efficiency'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {batches.filter(b => b.status === 'completed').length > 0
                      ? Math.round(batches
                          .filter(b => b.status === 'completed')
                          .reduce((sum, b) => sum + (b.actualDuration || 0), 0) /
                          batches.filter(b => b.status === 'completed').length * 10) / 10
                      : 0}h
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {language === 'ar' ? 'متوسط المدة' : 'Average Duration'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {batches.filter(b => b.status === 'completed').length > 0
                      ? Math.round(batches
                          .filter(b => b.status === 'completed')
                          .reduce((sum, b) => sum + b.quality.overallScore, 0) /
                          batches.filter(b => b.status === 'completed').length)
                      : 0}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {language === 'ar' ? 'متوسط الجودة' : 'Average Quality'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                <Label>{language === 'ar' ? 'نوع العملية' : 'Process Type'}</Label>
                <Select value={newBatchForm.type} onValueChange={(value: any) => setNewBatchForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distillation">{language === 'ar' ? 'تقطير' : 'Distillation'}</SelectItem>
                    <SelectItem value="maceration">{language === 'ar' ? 'نقع' : 'Maceration'}</SelectItem>
                    <SelectItem value="aging">{language === 'ar' ? 'تعتيق' : 'Aging'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'ar' ? 'المشغل' : 'Operator'}</Label>
                <Input
                  value={newBatchForm.operator}
                  onChange={(e) => setNewBatchForm(prev => ({ ...prev, operator: e.target.value }))}
                  placeholder="Operator name"
                />
              </div>
            </div>

            <div>
              <Label>{language === 'ar' ? 'المدة المتوقعة (ساعات)' : 'Estimated Duration (hours)'}</Label>
              <Input
                type="number"
                value={newBatchForm.estimatedDuration}
                onChange={(e) => setNewBatchForm(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                placeholder="24"
              />
            </div>

            <div>
              <Label>{language === 'ar' ? 'المواد الخام' : 'Raw Materials'}</Label>
              <div className="space-y-2">
                {newBatchForm.rawMaterials.map((material, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="Material name"
                      value={material.name}
                      onChange={(e) => {
                        const updated = [...newBatchForm.rawMaterials]
                        updated[index].name = e.target.value
                        setNewBatchForm(prev => ({ ...prev, rawMaterials: updated }))
                      }}
                    />
                    <Select value={material.type} onValueChange={(value: any) => {
                      const updated = [...newBatchForm.rawMaterials]
                      updated[index].type = value
                      setNewBatchForm(prev => ({ ...prev, rawMaterials: updated }))
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oud_chips">Oud Chips</SelectItem>
                        <SelectItem value="oud_powder">Oud Powder</SelectItem>
                        <SelectItem value="alcohol">Alcohol</SelectItem>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="carrier_oil">Carrier Oil</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={material.quantity}
                      onChange={(e) => {
                        const updated = [...newBatchForm.rawMaterials]
                        updated[index].quantity = e.target.value
                        setNewBatchForm(prev => ({ ...prev, rawMaterials: updated }))
                      }}
                    />
                    <Select value={material.unit} onValueChange={(value) => {
                      const updated = [...newBatchForm.rawMaterials]
                      updated[index].unit = value
                      setNewBatchForm(prev => ({ ...prev, rawMaterials: updated }))
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="liter">L</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewBatchForm(prev => ({
                    ...prev,
                    rawMaterials: [...prev.rawMaterials, { name: '', type: 'oud_chips', quantity: '', unit: 'kg' }]
                  }))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'إضافة مادة' : 'Add Material'}
                </Button>
              </div>
            </div>

            <div>
              <Label>{language === 'ar' ? 'ملاحظات' : 'Notes'}</Label>
              <Textarea
                value={newBatchForm.notes}
                onChange={(e) => setNewBatchForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about the batch..."
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
    </div>
  )
}

export default DistillationTrackingSystem