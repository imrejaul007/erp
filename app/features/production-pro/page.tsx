'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Beaker,
  FileCheck,
  Wrench,
  GitBranch,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Package,
  Clock,
  TrendingUp,
  Target,
  Settings,
  Calendar
} from 'lucide-react';

export default function ProductionProPage() {
  const router = useRouter();

  const productionFeatures = [
    {
      id: 'recipe-management',
      title: 'Recipe Management',
      description: 'Manage product formulas and bill of materials',
      icon: Beaker,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/production-pro/recipes',
      status: 'active',
      features: [
        'Formula creation',
        'Ingredient tracking',
        'Version control',
        'Cost calculation',
        'Scaling recipes',
        'Batch sizing',
        'R&D tracking',
        'Recipe approval'
      ],
      metrics: {
        recipes: 48,
        activeFormulas: 32,
        avgIngredients: 8,
        costAccuracy: '98%'
      }
    },
    {
      id: 'quality-tests',
      title: 'Quality Control Tests',
      description: 'Define and track quality control procedures',
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/production-pro/qc-tests',
      status: 'active',
      features: [
        'Test templates',
        'Inspection checklists',
        'Pass/fail criteria',
        'Photo documentation',
        'Lab results',
        'Statistical analysis',
        'Trend monitoring',
        'Compliance reports'
      ],
      metrics: {
        testTemplates: 24,
        monthlyTests: 285,
        passRate: '96.5%',
        avgDuration: '25min'
      }
    },
    {
      id: 'equipment',
      title: 'Equipment Management',
      description: 'Track production equipment and maintenance',
      icon: Wrench,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/production-pro/equipment',
      status: 'active',
      features: [
        'Equipment registry',
        'Maintenance schedules',
        'Service history',
        'Calibration tracking',
        'Downtime logging',
        'Cost tracking',
        'Spare parts',
        'Performance metrics'
      ],
      metrics: {
        equipment: 28,
        utilization: '82%',
        downtime: '2.5%',
        maintenanceCost: 'AED 12K/mo'
      }
    },
    {
      id: 'traceability',
      title: 'Batch Traceability',
      description: 'Complete product traceability from raw material to finished product',
      icon: GitBranch,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/features/production-pro/traceability',
      status: 'active',
      features: [
        'Lot tracking',
        'Forward/backward trace',
        'Genealogy reports',
        'Material provenance',
        'Supply chain visibility',
        'Recall management',
        'Compliance documentation',
        'Audit trails'
      ],
      metrics: {
        activeBatches: 145,
        traceability: '100%',
        avgTraceTime: '5min',
        recalls: 0
      }
    },
    {
      id: 'production-planning',
      title: 'Production Planning',
      description: 'Plan and schedule production runs',
      icon: Calendar,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      path: '/features/production-pro/planning',
      status: 'active',
      features: [
        'Production scheduling',
        'Capacity planning',
        'Material requirements',
        'Work orders',
        'Resource allocation',
        'Lead time tracking',
        'Bottleneck analysis',
        'What-if scenarios'
      ],
      metrics: {
        monthlyBatches: 85,
        onTimeCompletion: '92%',
        capacityUtilization: '78%',
        avgLeadTime: '5 days'
      }
    },
    {
      id: 'waste-management',
      title: 'Waste Management',
      description: 'Track and minimize production waste',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      path: '/features/production-pro/waste',
      status: 'active',
      features: [
        'Waste tracking',
        'Waste categorization',
        'Cost analysis',
        'Reduction targets',
        'Yield monitoring',
        'Root cause analysis',
        'Improvement initiatives',
        'Environmental impact'
      ],
      metrics: {
        wasteRate: '3.2%',
        monthlyWaste: 'AED 15K',
        reduction: '-18% YoY',
        recyclingRate: '45%'
      }
    },
    {
      id: 'packaging',
      title: 'Packaging Management',
      description: 'Manage packaging materials and specifications',
      icon: Package,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/features/production-pro/packaging',
      status: 'active',
      features: [
        'Packaging specs',
        'Material tracking',
        'Label design',
        'Barcode generation',
        'Regulatory compliance',
        'Supplier management',
        'Cost optimization',
        'Quality checks'
      ],
      metrics: {
        packagingTypes: 18,
        monthlyCost: 'AED 45K',
        suppliers: 8,
        defectRate: '1.2%'
      }
    },
    {
      id: 'production-analytics',
      title: 'Production Analytics',
      description: 'Comprehensive production reporting and KPIs',
      icon: BarChart3,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      path: '/features/production-pro/analytics',
      status: 'active',
      features: [
        'Production metrics',
        'Efficiency analysis',
        'Cost tracking',
        'Quality trends',
        'OEE calculation',
        'Yield analysis',
        'Custom dashboards',
        'Export reports'
      ],
      metrics: {
        oee: '78%',
        avgYield: '94.5%',
        costPerUnit: 'AED 12.50',
        reports: 32
      }
    }
  ];

  const productionSummary = {
    activeBatches: 145,
    monthlyProduction: 2850,
    yieldRate: 94.5,
    qualityPassRate: 96.5,
    oee: 78,
    wasteRate: 3.2
  };

  const productionMetrics = [
    { metric: 'Overall Equipment Effectiveness (OEE)', current: 78, target: 85, status: 'good' },
    { metric: 'First Pass Yield', current: 94.5, target: 95, status: 'good' },
    { metric: 'On-Time Delivery', current: 92, target: 95, status: 'warning' },
    { metric: 'Quality Pass Rate', current: 96.5, target: 95, status: 'excellent' }
  ];

  const batchStatus = [
    { status: 'In Progress', count: 28, color: 'bg-blue-600' },
    { status: 'Quality Check', count: 12, color: 'bg-amber-600' },
    { status: 'Completed', count: 95, color: 'bg-green-600' },
    { status: 'On Hold', count: 5, color: 'bg-red-600' }
  ];

  const benefits = [
    {
      title: 'Quality Assurance',
      description: 'Ensure consistent product quality with standardized processes',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Traceability',
      description: 'Complete visibility from raw materials to finished products',
      icon: GitBranch,
      color: 'text-purple-600'
    },
    {
      title: 'Reduce Waste',
      description: 'Minimize waste and improve production efficiency',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Optimize Costs',
      description: 'Track and reduce production costs systematically',
      icon: TrendingUp,
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Beaker className="h-8 w-8 text-purple-600" />
            Production Pro
          </h1>
          <p className="text-muted-foreground">
            Recipe management, quality control, equipment tracking, and batch traceability
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Package className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{productionSummary.activeBatches}</div>
            <div className="text-sm text-gray-600">Active Batches</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold">{productionSummary.monthlyProduction}</div>
            <div className="text-sm text-gray-600">Monthly Units</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Target className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold">{productionSummary.yieldRate}%</div>
            <div className="text-sm text-gray-600">Yield Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold">{productionSummary.qualityPassRate}%</div>
            <div className="text-sm text-gray-600">Quality Pass</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Settings className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{productionSummary.oee}%</div>
            <div className="text-sm text-gray-600">OEE</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold">{productionSummary.wasteRate}%</div>
            <div className="text-sm text-gray-600">Waste Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Production Pro?</CardTitle>
          <CardDescription>Advanced production management for perfume manufacturing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="border rounded-lg p-4">
                  <Icon className={`h-8 w-8 ${benefit.color} mb-3`} />
                  <div className="font-semibold mb-1">{benefit.title}</div>
                  <div className="text-sm text-gray-600">{benefit.description}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Production Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Production Metrics</CardTitle>
          <CardDescription>Performance indicators and targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productionMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{metric.metric}</div>
                  <Badge className={
                    metric.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    metric.status === 'good' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }>
                    {metric.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <div className="text-sm text-gray-600">Current</div>
                    <div className="text-2xl font-bold text-blue-600">{metric.current}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Target</div>
                    <div className="text-2xl font-bold text-gray-600">{metric.target}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metric.status === 'excellent' ? 'bg-green-600' :
                      metric.status === 'good' ? 'bg-blue-600' :
                      'bg-amber-600'
                    }`}
                    style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Batch Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Batch Status</CardTitle>
          <CardDescription>Production batches by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {batchStatus.map((batch, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${batch.color}`}></div>
                  <div className="font-semibold">{batch.status}</div>
                </div>
                <div className="text-3xl font-bold">{batch.count}</div>
                <div className="text-sm text-gray-600">batches</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Total Active Batches</div>
              <div className="text-2xl font-bold text-blue-600">
                {batchStatus.reduce((sum, batch) => sum + batch.count, 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productionFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.id}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => router.push(feature.path)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <Badge className="bg-green-100 text-green-800">{feature.status}</Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Key Metrics:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(feature.metrics).map(([key, value], idx) => (
                      <div key={idx}>
                        <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Features:</div>
                  <div className="space-y-1">
                    {feature.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {feat}
                      </div>
                    ))}
                    {feature.features.length > 4 && (
                      <div className="text-sm text-blue-600 font-medium">
                        +{feature.features.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with Production Pro</CardTitle>
          <CardDescription>Set up advanced production management in 4 steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div className="font-semibold mb-1">Create Recipes</div>
              <div className="text-sm text-gray-600">Set up product formulas and BOMs</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <div className="font-semibold mb-1">Define QC Tests</div>
              <div className="text-sm text-gray-600">Create quality control procedures</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <div className="font-semibold mb-1">Register Equipment</div>
              <div className="text-sm text-gray-600">Add equipment and maintenance schedules</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-amber-600">4</span>
              </div>
              <div className="font-semibold mb-1">Start Production</div>
              <div className="text-sm text-gray-600">Create batches and track progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
