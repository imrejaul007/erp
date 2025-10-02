'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  Users,
  FileCheck,
  BarChart3,
  Globe,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Navigation
} from 'lucide-react';

export default function LogisticsPage() {
  const router = useRouter();

  const logisticsFeatures = [
    {
      id: 'route-planning',
      title: 'Route Planning & Optimization',
      description: 'AI-powered route optimization for efficient deliveries',
      icon: Navigation,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/logistics/routes',
      status: 'active',
      features: [
        'AI route optimization',
        'Real-time traffic data',
        'Multi-stop planning',
        'Driver assignment',
        'Time window constraints',
        'Fuel cost optimization',
        'Live GPS tracking',
        'Route history'
      ],
      metrics: {
        dailyRoutes: 45,
        avgStops: 12,
        fuelSavings: '18%',
        onTimeDelivery: '94%'
      }
    },
    {
      id: 'supplier-portal',
      title: 'Supplier Portal',
      description: 'Collaborative platform for supplier management',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/logistics/suppliers',
      status: 'active',
      features: [
        'Supplier profiles',
        'Performance tracking',
        'Order management',
        'Invoice processing',
        'Communication hub',
        'Document sharing',
        'Quality ratings',
        'Contract management'
      ],
      metrics: {
        activeSuppliers: 48,
        avgLeadTime: '12 days',
        onTimeRate: '89%',
        qualityScore: '4.5/5'
      }
    },
    {
      id: '3pl-integration',
      title: '3PL Integration',
      description: 'Connect with third-party logistics providers',
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/logistics/3pl',
      status: 'active',
      features: [
        'Multi-carrier support',
        'Rate comparison',
        'Label generation',
        'Tracking integration',
        'COD management',
        'Returns handling',
        'Performance analytics',
        'Cost optimization'
      ],
      metrics: {
        carriers: 6,
        monthlyShipments: 850,
        avgCost: 'AED 18',
        satisfaction: '4.6/5'
      }
    },
    {
      id: 'quality-control',
      title: 'Quality Control',
      description: 'Inspection and quality assurance workflows',
      icon: FileCheck,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/features/logistics/quality',
      status: 'active',
      features: [
        'Inspection checklists',
        'Photo documentation',
        'Pass/Fail criteria',
        'Batch testing',
        'Non-conformance reports',
        'Corrective actions',
        'Supplier feedback',
        'Quality metrics'
      ],
      metrics: {
        monthlyInspections: 285,
        passRate: '96.5%',
        avgInspectionTime: '15min',
        defectRate: '3.5%'
      }
    },
    {
      id: 'warehouse-management',
      title: 'Warehouse Management',
      description: 'Advanced warehouse operations and automation',
      icon: Package,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      path: '/features/logistics/warehouse',
      status: 'active',
      features: [
        'Bin location management',
        'Pick/pack workflows',
        'Cycle counting',
        'Barcode scanning',
        'Wave picking',
        'Space optimization',
        'Labor management',
        'Inventory accuracy'
      ],
      metrics: {
        locations: 1250,
        accuracy: '99.2%',
        pickRate: '85/hr',
        utilization: '78%'
      }
    },
    {
      id: 'international-shipping',
      title: 'International Shipping',
      description: 'Cross-border logistics and customs',
      icon: Globe,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      path: '/features/logistics/international',
      status: 'active',
      features: [
        'Customs documentation',
        'HS code management',
        'Duties calculation',
        'International carriers',
        'Country regulations',
        'Currency conversion',
        'Export compliance',
        'Shipping insurance'
      ],
      metrics: {
        countries: 28,
        monthlyShipments: 125,
        avgLeadTime: '8 days',
        customsClearance: '96%'
      }
    },
    {
      id: 'fleet-management',
      title: 'Fleet Management',
      description: 'Vehicle tracking and maintenance',
      icon: Truck,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      path: '/features/logistics/fleet',
      status: 'active',
      features: [
        'GPS tracking',
        'Maintenance scheduling',
        'Fuel monitoring',
        'Driver behavior',
        'Vehicle utilization',
        'Cost per mile',
        'Insurance tracking',
        'Accident reporting'
      ],
      metrics: {
        vehicles: 18,
        avgUtilization: '82%',
        fuelEfficiency: '12km/L',
        maintenanceCost: 'AED 2.5K/mo'
      }
    },
    {
      id: 'logistics-analytics',
      title: 'Logistics Analytics',
      description: 'Comprehensive supply chain reporting',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/logistics/analytics',
      status: 'active',
      features: [
        'Performance KPIs',
        'Cost analysis',
        'Lead time tracking',
        'Carrier comparison',
        'Inventory turnover',
        'Order fulfillment',
        'Supplier scorecards',
        'Custom reports'
      ],
      metrics: {
        reports: 24,
        dataPoints: '50K+',
        updateFrequency: 'Real-time',
        exportFormats: 5
      }
    }
  ];

  const logisticsSummary = {
    dailyShipments: 45,
    activeSuppliers: 48,
    onTimeDelivery: 94,
    avgLeadTime: 12,
    logisticsCost: 285000,
    fuelSavings: 18
  };

  const supplierPerformance = [
    { supplier: 'Al Oud Trading', rating: 4.8, onTime: 96, quality: 98, leadTime: 8, orders: 145 },
    { supplier: 'Emirates Fragrances', rating: 4.6, onTime: 92, quality: 96, leadTime: 10, orders: 128 },
    { supplier: 'Dubai Perfumes Co', rating: 4.4, onTime: 88, quality: 94, leadTime: 14, orders: 95 },
    { supplier: 'Arabian Essences', rating: 4.2, onTime: 85, quality: 92, leadTime: 16, orders: 78 }
  ];

  const deliveryMetrics = [
    { metric: 'On-Time Delivery', current: 94, target: 95, status: 'good' },
    { metric: 'Order Accuracy', current: 98.5, target: 99, status: 'good' },
    { metric: 'Damage Rate', current: 1.2, target: 2, status: 'excellent' },
    { metric: 'Customer Satisfaction', current: 4.7, target: 4.5, status: 'excellent' }
  ];

  const benefits = [
    {
      title: 'Optimize Routes',
      description: 'Save fuel and time with AI-powered route optimization',
      icon: Navigation,
      color: 'text-blue-600'
    },
    {
      title: 'Track Everything',
      description: 'Real-time visibility of shipments, fleet, and inventory',
      icon: MapPin,
      color: 'text-green-600'
    },
    {
      title: 'Reduce Costs',
      description: 'Lower logistics costs through automation and optimization',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Improve Quality',
      description: 'Ensure quality with inspection workflows and supplier ratings',
      icon: CheckCircle,
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Truck className="h-8 w-8 text-orange-600" />
            Supply Chain & Logistics
          </h1>
          <p className="text-muted-foreground">
            Route optimization, supplier portal, 3PL integration, and quality control
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-6">
            <Truck className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{logisticsSummary.dailyShipments}</div>
            <div className="text-sm text-gray-600">Daily Shipments</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{logisticsSummary.activeSuppliers}</div>
            <div className="text-sm text-gray-600">Active Suppliers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{logisticsSummary.onTimeDelivery}%</div>
            <div className="text-sm text-gray-600">On-Time Delivery</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Clock className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{logisticsSummary.avgLeadTime} days</div>
            <div className="text-sm text-gray-600">Avg Lead Time</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">AED {(logisticsSummary.logisticsCost / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Monthly Cost</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{logisticsSummary.fuelSavings}%</div>
            <div className="text-sm text-gray-600">Fuel Savings</div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Advanced Logistics?</CardTitle>
          <CardDescription>Streamline your supply chain operations</CardDescription>
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

      {/* Delivery Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{metric.metric}</div>
                  <Badge className={
                    metric.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {metric.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <div className="text-sm text-gray-600">Current</div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{metric.current}{metric.metric.includes('Rate') || metric.metric.includes('Delivery') ? '%' : ''}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Target</div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-600">{metric.target}{metric.metric.includes('Rate') || metric.metric.includes('Delivery') ? '%' : ''}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metric.status === 'excellent' ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Supplier Performance</CardTitle>
          <CardDescription>Ratings and metrics for key suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplierPerformance.map((supplier, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">{supplier.supplier}</div>
                    <div className="text-sm text-gray-600">{supplier.orders} orders completed</div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {supplier.rating}/5
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">On-Time</div>
                    <div className="font-bold text-green-600">{supplier.onTime}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Quality</div>
                    <div className="font-bold text-blue-600">{supplier.quality}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Lead Time</div>
                    <div className="font-bold text-purple-600">{supplier.leadTime} days</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Orders</div>
                    <div className="font-bold">{supplier.orders}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logistics Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {logisticsFeatures.map((feature) => {
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
          <CardTitle>Getting Started with Logistics</CardTitle>
          <CardDescription>Optimize your supply chain in 4 steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div className="font-semibold mb-1">Setup Suppliers</div>
              <div className="text-sm text-gray-600">Add your suppliers and configure preferences</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <div className="font-semibold mb-1">Connect Carriers</div>
              <div className="text-sm text-gray-600">Integrate with 3PL and shipping carriers</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <div className="font-semibold mb-1">Optimize Routes</div>
              <div className="text-sm text-gray-600">Set up delivery zones and route planning</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-amber-600">4</span>
              </div>
              <div className="font-semibold mb-1">Track & Improve</div>
              <div className="text-sm text-gray-600">Monitor performance and optimize operations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
