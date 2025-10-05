'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Factory, Droplets, FlaskConical, Package, ClipboardCheck, GitBranch,
  DollarSign, Weight, ArrowLeft, TrendingUp, Target,
  CheckCircle2, Activity, Clock, Boxes
} from 'lucide-react';

interface ProductionBatch {
  id: string;
  batchNumber: string;
  status: string;
  plannedQuantity: number;
  actualQuantity?: number;
  unit: string;
  startDate: string;
  endDate?: string;
  recipe?: {
    name: string;
    category?: string;
  };
  stats?: {
    yieldPercentage: number;
  };
}

interface ProductionSummary {
  activeBatches: number;
  completedToday: number;
  rawMaterialStock: number;
  oilExtracted: number;
  perfectsBlended: number;
  yieldRate: number;
  qcPassRate: number;
  productionCost: number;
}

export default function ProductionPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [productionSummary, setProductionSummary] = useState<ProductionSummary>({
    activeBatches: 0,
    completedToday: 0,
    rawMaterialStock: 0,
    oilExtracted: 0,
    perfectsBlended: 0,
    yieldRate: 0,
    qcPassRate: 0,
    productionCost: 0
  });

  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/production/batches?limit=100');
      const data = await response.json();

      if (data.success && data.data) {
        const allBatches = data.data.batches || [];
        setBatches(allBatches);

        // Calculate summary statistics
        const activeBatches = allBatches.filter(
          (b: ProductionBatch) => ['PLANNED', 'IN_PROGRESS', 'AGING'].includes(b.status)
        ).length;

        const today = new Date().toISOString().split('T')[0];
        const completedToday = allBatches.filter(
          (b: ProductionBatch) => b.status === 'COMPLETED' && b.endDate?.startsWith(today)
        ).length;

        // Calculate average yield rate
        const batchesWithYield = allBatches.filter(
          (b: ProductionBatch) => b.stats?.yieldPercentage
        );
        const avgYield = batchesWithYield.length > 0
          ? batchesWithYield.reduce((sum: number, b: ProductionBatch) => sum + (b.stats?.yieldPercentage || 0), 0) / batchesWithYield.length
          : 0;

        setProductionSummary({
          activeBatches,
          completedToday,
          rawMaterialStock: 0, // This would come from inventory API
          oilExtracted: 0, // Calculate from batches if needed
          perfectsBlended: allBatches.filter((b: ProductionBatch) => b.status === 'COMPLETED').length,
          yieldRate: avgYield,
          qcPassRate: 0, // Would come from QC API
          productionCost: 0 // Would come from cost tracking
        });
      }
    } catch (error) {
      console.error('Error fetching production data:', error);
    } finally {
      setLoading(false);
    }
  };

  const productionModules = [
    {
      id: 'raw-material',
      title: 'Raw Material Handling',
      icon: Weight,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/production/raw-material',
      status: 'active',
      description: 'Raw oud wood intake, conversion, moisture adjustment & supplier batch tagging',
      metrics: {
        stock: '2,450 kg',
        batches: 48,
        suppliers: 12,
        avgQuality: '8.5/10'
      },
      features: [
        'Weight tracking (kg/tola/g with auto-conversion)',
        'Moisture & dust loss adjustment (net weight)',
        'Supplier batch tagging & PO linking',
        'Initial segregation: size, density, resin quality',
        'Aroma profile classification',
        'Storage location mapping',
        'Batch receiving workflow',
        'Quality inspection on arrival'
      ]
    },
    {
      id: 'segregation',
      title: 'Segregation Process',
      icon: GitBranch,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/production/segregation',
      status: 'active',
      description: 'Grade sorting, quality-based segregation & multi-output batch tracking',
      metrics: {
        inProgress: 8,
        completed: 145,
        wastage: '3.2%',
        outputSKUs: 156
      },
      features: [
        'Grading by quality (Premium, A, B, C, Powder)',
        'Sorting by size (chips, powder, dust)',
        'Multi-output from single batch (automated SKU creation)',
        'Wastage tracking & weight loss recording',
        'Auto stock update after segregation',
        'Visual segregation workflow',
        'Before/after weight reconciliation',
        'Grade-specific pricing suggestions'
      ]
    },
    {
      id: 'oil-extraction',
      title: 'Oud Oil Extraction',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/production/oil-extraction',
      status: 'active',
      description: 'Distillation tracking, yield recording & multi-output management',
      metrics: {
        activeBatches: 5,
        monthlyYield: '145 ml',
        avgYield: '1.2 ml/kg',
        qcPass: '98%'
      },
      features: [
        'Distillation process tracking (hydro/steam)',
        'Batch tracking: raw → still → oil → residue',
        'Yield recording (kg wood → ml oil)',
        'Quality control (viscosity, aroma, purity %)',
        'Multi-output: Oil + Hydrosol + Residue',
        'Distillation time & temperature logs',
        'Equipment assignment & maintenance',
        'Cost per ml calculation'
      ]
    },
    {
      id: 'perfume-production',
      title: 'Perfume & Attar Production',
      icon: FlaskConical,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/production/perfume-production',
      status: 'active',
      description: 'Recipe management, blending, aging, filling & packaging workflow',
      metrics: {
        recipes: 85,
        batchesThisMonth: 42,
        aging: 15,
        bottled: 850
      },
      features: [
        'Recipe & BOM (Bill of Materials) management',
        'Batch tracking (production lot → bottles)',
        'Blending workflow with ingredient tracking',
        'Aging/maturation cycle tracking (days/weeks)',
        'Filling & packaging automation',
        'Yield calculation (raw ml → packaged units)',
        'Auto cost-per-unit calculation',
        'Multi-size bottling from single batch'
      ]
    },
    {
      id: 'quality-control',
      title: 'Quality Control',
      icon: ClipboardCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/production/quality-control',
      status: 'active',
      description: 'Multi-stage QC, lab tests, aroma profiling & batch approval',
      metrics: {
        testsToday: 28,
        passRate: '96.8%',
        pending: 12,
        rejected: 3
      },
      features: [
        'Multi-stage QC: Raw → Extract → Blend → Bottling',
        'Lab test results (purity %, alcohol %, IFRA)',
        'Aroma profiling with fragrance notes',
        'Batch approval/rejection workflow',
        'QC certificates (digital storage)',
        'Deviation tracking & corrective actions',
        'Tester sample management',
        'Compliance checklist (UAE regulations)'
      ]
    },
    {
      id: 'batch-management',
      title: 'Batch Management',
      icon: Boxes,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      path: '/production/batch-management',
      status: 'active',
      description: 'Lot numbers, expiry tracking, production scheduling & traceability',
      metrics: {
        active: 28,
        scheduled: 18,
        completed: 145,
        expired: 0
      },
      features: [
        'Lot numbers & batch codes generation',
        'Expiry date tracking (alcohol-based perfumes)',
        'Production calendar & scheduling',
        'Full traceability (raw → production → sales)',
        'Rework & adjustment tracking',
        'Multi-output batch management',
        'Batch genealogy (parent-child relationships)',
        'Integration with inventory & sales'
      ]
    },
    {
      id: 'packaging',
      title: 'Packaging & Segregation',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      path: '/production/packaging',
      status: 'active',
      description: 'Package type segregation, SKU creation & bundle management',
      metrics: {
        regular: 456,
        luxury: 128,
        testers: 85,
        samples: 245
      },
      features: [
        'Packaging segregation (Regular, Luxury, Tester, Sample)',
        'Auto SKU creation from same batch',
        'Pricing tiers (retail, wholesale, export)',
        'Bundle/Combo creation (Gift Sets)',
        'Packaging material tracking',
        'Barcode/QR label generation',
        'Box & carton packing',
        'Packaging cost allocation'
      ]
    },
    {
      id: 'costing-reports',
      title: 'Costing & Yield Reports',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      path: '/production/costing-reports',
      status: 'active',
      description: 'Cost breakdown, yield analysis & profitability tracking',
      metrics: {
        avgCost: 'AED 125/unit',
        yield: '94.5%',
        margin: '42.5%',
        reports: 28
      },
      features: [
        'Cost per batch & per unit breakdown',
        'Material, packaging, labor, overhead allocation',
        'Yield % tracking (input vs output)',
        'Wastage cost analysis',
        'Profitability per recipe/product line',
        'Supplier comparison (yield, cost, quality)',
        'Production efficiency metrics',
        'AI-based yield forecasting'
      ]
    }
  ];

  const activeBatches = batches
    .filter(b => ['PLANNED', 'IN_PROGRESS', 'AGING', 'QUALITY_CHECK'].includes(b.status))
    .slice(0, 5)
    .map(batch => ({
      batchNo: batch.batchNumber,
      type: batch.recipe?.category || 'Production',
      product: batch.recipe?.name || 'Unknown Product',
      stage: batch.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      progress: batch.stats?.yieldPercentage || (batch.actualQuantity && batch.plannedQuantity
        ? (batch.actualQuantity / batch.plannedQuantity) * 100
        : batch.status === 'PLANNED' ? 0 : batch.status === 'IN_PROGRESS' ? 50 : 75),
      startDate: new Date(batch.startDate).toISOString().split('T')[0],
      estimatedCompletion: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : 'TBD',
      status: 'on-track'
    }));

  const today = new Date().toISOString().split('T')[0];
  const todayProduction = batches
    .filter(b => b.startDate.startsWith(today) || b.endDate?.startsWith(today))
    .map(batch => ({
      product: batch.recipe?.name || 'Unknown Product',
      batches: 1,
      quantity: batch.actualQuantity || batch.plannedQuantity,
      value: batch.stats?.totalOutputValue || 0,
      status: batch.status === 'COMPLETED' ? 'completed' : 'in-progress'
    }));

  const benefits = [
    {
      icon: Target,
      title: 'Full Traceability',
      description: 'Track every gram from raw oud to finished perfume bottle'
    },
    {
      icon: TrendingUp,
      title: 'Maximize Yield',
      description: 'Monitor and optimize extraction & production yields'
    },
    {
      icon: DollarSign,
      title: 'Accurate Costing',
      description: 'Real-time cost tracking for materials, labor & overheads'
    },
    {
      icon: Activity,
      title: 'Quality Control',
      description: 'Multi-stage QC ensures premium product quality'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Production & Segregation</h1>
            <p className="text-muted-foreground">
              Complete production management from raw oud to finished perfumes
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {productionSummary.activeBatches} Active Batches
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Batches</CardDescription>
            <CardTitle className="text-3xl">
              {loading ? '...' : productionSummary.activeBatches}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              {loading ? 'Loading...' : `${productionSummary.completedToday} completed today`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Raw Material Stock</CardDescription>
            <CardTitle className="text-3xl">{productionSummary.rawMaterialStock?.toLocaleString() || "0"} kg</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Across all suppliers & grades
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Yield Rate</CardDescription>
            <CardTitle className="text-3xl">{productionSummary.yieldRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={productionSummary.yieldRate} className="mb-2" />
            <p className="text-xs text-green-600">
              QC Pass: {productionSummary.qcPassRate}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Production Cost (Month)</CardDescription>
            <CardTitle className="text-3xl">AED {(productionSummary.productionCost / 1000).toFixed(0)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {productionSummary.perfectsBlended} units produced
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Production & Segregation Management?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-3">
                <div className="flex-shrink-0">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active-batches">Active Batches</TabsTrigger>
          <TabsTrigger value="today">Today's Production</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Production Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productionModules.map((module) => (
              <Card
                key={module.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(module.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${module.bgColor}`}>
                      <module.icon className={`h-6 w-6 ${module.color}`} />
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {module.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(module.metrics).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </p>
                          <p className="text-sm font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(module.path);
                      }}
                    >
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active-batches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Production Batches</CardTitle>
              <CardDescription>Currently running batches across all production stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeBatches.map((batch) => (
                  <div key={batch.batchNo} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{batch.batchNo}</h3>
                          <Badge variant="outline">{batch.type}</Badge>
                          <Badge
                            variant={batch.status === 'on-track' ? 'default' : 'secondary'}
                            className={batch.status === 'on-track' ? 'bg-green-600' : 'bg-amber-600'}
                          >
                            {batch.status === 'on-track' ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {batch.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{batch.product}</p>
                        <p className="text-xs text-muted-foreground">
                          Stage: {batch.stage} • Started: {batch.startDate} • ETA: {batch.estimatedCompletion}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-bold text-primary">{batch.progress}%</p>
                      </div>
                    </div>
                    <Progress value={batch.progress} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Production Summary</CardTitle>
              <CardDescription>Completed and in-progress production today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayProduction.map((item) => (
                  <div key={item.product} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.product}</h3>
                        <Badge
                          variant={item.status === 'completed' ? 'default' : 'secondary'}
                          className={item.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.batches} batches • {item.quantity} units
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">AED {item.value?.toLocaleString() || "0"}</p>
                      <p className="text-xs text-muted-foreground">Est. value</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with Production Management</CardTitle>
          <CardDescription>Set up your end-to-end production workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Configure Raw Materials</h3>
                <p className="text-sm text-muted-foreground">
                  Set up oud types, suppliers, and quality grades
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Recipes & BOMs</h3>
                <p className="text-sm text-muted-foreground">
                  Define perfume recipes and production formulas
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Set Up QC Checkpoints</h3>
                <p className="text-sm text-muted-foreground">
                  Configure quality control stages and tests
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Start Production Batch</h3>
                <p className="text-sm text-muted-foreground">
                  Launch your first production batch and track progress
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
