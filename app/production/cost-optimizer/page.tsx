'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Download,
  RefreshCw,
  Lightbulb,
  Calculator,
  BarChart3,
  Package,
  Settings,
  Target
} from 'lucide-react';

interface CostAnalysis {
  id: string;
  productName: string;
  batchSize: number;
  currentCost: number;
  optimizedCost: number;
  savings: number;
  savingsPercentage: number;
  recommendations: string[];
  status: 'high_priority' | 'medium_priority' | 'low_priority' | 'optimized';
  materialCosts: {
    rawMaterials: number;
    packaging: number;
    labor: number;
    overhead: number;
  };
  optimizationPotential: {
    supplierChange: number;
    bulkDiscount: number;
    processEfficiency: number;
    wastageReduction: number;
  };
}

interface Supplier {
  id: string;
  name: string;
  rating: number;
  pricePerUnit: number;
  minOrderQty: number;
  leadTime: string;
  savings: number;
}

export default function CostOptimizerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<CostAnalysis | null>(null);

  // Mock data for cost analyses
  const costAnalyses: CostAnalysis[] = [
    {
      id: 'CA-001',
      productName: 'Royal Cambodian Oud Oil',
      batchSize: 100,
      currentCost: 45000,
      optimizedCost: 38500,
      savings: 6500,
      savingsPercentage: 14.4,
      status: 'high_priority',
      recommendations: [
        'Switch to Supplier B for agarwood chips (12% cost reduction)',
        'Increase batch size to 150 units for bulk discount (8% savings)',
        'Optimize distillation time to reduce energy costs (5% savings)',
        'Reduce packaging material waste (3% savings)'
      ],
      materialCosts: {
        rawMaterials: 32000,
        packaging: 5000,
        labor: 4500,
        overhead: 3500
      },
      optimizationPotential: {
        supplierChange: 3840,
        bulkDiscount: 1800,
        processEfficiency: 600,
        wastageReduction: 260
      }
    },
    {
      id: 'CA-002',
      productName: 'Taif Rose Attar',
      batchSize: 200,
      currentCost: 28000,
      optimizedCost: 25200,
      savings: 2800,
      savingsPercentage: 10.0,
      status: 'medium_priority',
      recommendations: [
        'Negotiate better pricing with current rose supplier (7% savings)',
        'Reduce labor hours through process automation (4% savings)',
        'Optimize bottle ordering quantity (2% savings)'
      ],
      materialCosts: {
        rawMaterials: 18000,
        packaging: 4000,
        labor: 3500,
        overhead: 2500
      },
      optimizationPotential: {
        supplierChange: 1260,
        bulkDiscount: 560,
        processEfficiency: 700,
        wastageReduction: 280
      }
    },
    {
      id: 'CA-003',
      productName: 'Hindi Black Oud',
      batchSize: 50,
      currentCost: 65000,
      optimizedCost: 59800,
      savings: 5200,
      savingsPercentage: 8.0,
      status: 'high_priority',
      recommendations: [
        'Source premium agarwood from new verified supplier (6% savings)',
        'Consolidate shipments to reduce import costs (3% savings)',
        'Improve extraction efficiency (2% savings)'
      ],
      materialCosts: {
        rawMaterials: 52000,
        packaging: 4500,
        labor: 5000,
        overhead: 3500
      },
      optimizationPotential: {
        supplierChange: 3120,
        bulkDiscount: 1300,
        processEfficiency: 520,
        wastageReduction: 260
      }
    },
    {
      id: 'CA-004',
      productName: 'Amber Musk Blend',
      batchSize: 300,
      currentCost: 15000,
      optimizedCost: 14400,
      savings: 600,
      savingsPercentage: 4.0,
      status: 'low_priority',
      recommendations: [
        'Minor packaging optimization possible (3% savings)',
        'Slight process improvement opportunity (1% savings)'
      ],
      materialCosts: {
        rawMaterials: 9000,
        packaging: 2500,
        labor: 2000,
        overhead: 1500
      },
      optimizationPotential: {
        supplierChange: 270,
        bulkDiscount: 150,
        processEfficiency: 120,
        wastageReduction: 60
      }
    },
    {
      id: 'CA-005',
      productName: 'Jasmine Essential Oil',
      batchSize: 150,
      currentCost: 18500,
      optimizedCost: 18500,
      savings: 0,
      savingsPercentage: 0,
      status: 'optimized',
      recommendations: [
        'Already optimized - no significant savings identified',
        'Continue monitoring for future opportunities'
      ],
      materialCosts: {
        rawMaterials: 12000,
        packaging: 2500,
        labor: 2500,
        overhead: 1500
      },
      optimizationPotential: {
        supplierChange: 0,
        bulkDiscount: 0,
        processEfficiency: 0,
        wastageReduction: 0
      }
    }
  ];

  // Alternative suppliers
  const alternativeSuppliers: Supplier[] = [
    {
      id: 'SUP-001',
      name: 'Premium Agarwood Traders LLC',
      rating: 4.8,
      pricePerUnit: 285,
      minOrderQty: 50,
      leadTime: '2-3 weeks',
      savings: 3840
    },
    {
      id: 'SUP-002',
      name: 'Global Fragrance Materials',
      rating: 4.5,
      pricePerUnit: 295,
      minOrderQty: 30,
      leadTime: '3-4 weeks',
      savings: 2560
    },
    {
      id: 'SUP-003',
      name: 'Oriental Scents Import Co.',
      rating: 4.2,
      pricePerUnit: 305,
      minOrderQty: 25,
      leadTime: '4-5 weeks',
      savings: 1280
    }
  ];

  const filteredAnalyses = costAnalyses.filter(analysis =>
    analysis.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analysis.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPotentialSavings = costAnalyses.reduce((sum, analysis) => sum + analysis.savings, 0);
  const avgSavingsPercentage = costAnalyses.reduce((sum, analysis) => sum + analysis.savingsPercentage, 0) / costAnalyses.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high_priority': return 'bg-red-100 text-red-700';
      case 'medium_priority': return 'bg-yellow-100 text-yellow-700';
      case 'low_priority': return 'bg-blue-100 text-blue-700';
      case 'optimized': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'high_priority': return 'High Priority';
      case 'medium_priority': return 'Medium Priority';
      case 'low_priority': return 'Low Priority';
      case 'optimized': return 'Optimized';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Production Cost Optimizer
          </h1>
          <p className="text-gray-600 mt-1">AI-powered cost analysis and optimization recommendations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Analysis
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Potential Savings</p>
                <p className="text-2xl font-bold text-gray-900">AED {totalPotentialSavings.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">Per batch production cycle</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Savings Potential</p>
                <p className="text-2xl font-bold text-gray-900">{avgSavingsPercentage.toFixed(1)}%</p>
                <p className="text-xs text-blue-600 mt-1">Across all products</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {costAnalyses.filter(a => a.status === 'high_priority').length}
                </p>
                <p className="text-xs text-red-600 mt-1">Require immediate action</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">{costAnalyses.length}</p>
                <p className="text-xs text-purple-600 mt-1">Active production items</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by product name or analysis ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cost Analyses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Cost Analysis Overview
          </CardTitle>
          <CardDescription>Detailed cost breakdown and optimization opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Batch Size</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Current Cost</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Optimized Cost</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Savings</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{analysis.productName}</div>
                      <div className="text-sm text-gray-500">{analysis.id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">{analysis.batchSize} units</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-medium text-gray-900">AED {analysis.currentCost.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-medium text-green-600">AED {analysis.optimizedCost.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-green-600">AED {analysis.savings.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">{analysis.savingsPercentage}% reduction</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge className={getStatusColor(analysis.status)}>
                        {getStatusLabel(analysis.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Modal */}
      {selectedAnalysis && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-gray-900">{selectedAnalysis.productName} - Detailed Analysis</CardTitle>
                <CardDescription>Cost breakdown and optimization recommendations</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAnalysis(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="breakdown" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
                <TabsTrigger value="optimization">Optimization</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="suppliers">Alternative Suppliers</TabsTrigger>
              </TabsList>

              <TabsContent value="breakdown" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Cost Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Raw Materials</span>
                      <span className="font-semibold text-gray-900">AED {selectedAnalysis.materialCosts.rawMaterials.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Packaging</span>
                      <span className="font-semibold text-gray-900">AED {selectedAnalysis.materialCosts.packaging.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Labor</span>
                      <span className="font-semibold text-gray-900">AED {selectedAnalysis.materialCosts.labor.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Overhead</span>
                      <span className="font-semibold text-gray-900">AED {selectedAnalysis.materialCosts.overhead.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border-2 border-blue-300">
                      <span className="font-bold text-gray-900">Total Current Cost</span>
                      <span className="font-bold text-xl text-gray-900">AED {selectedAnalysis.currentCost.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="optimization" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Optimization Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Supplier Change Savings</span>
                      </div>
                      <span className="font-semibold text-green-600">AED {selectedAnalysis.optimizationPotential.supplierChange.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Bulk Discount Potential</span>
                      </div>
                      <span className="font-semibold text-green-600">AED {selectedAnalysis.optimizationPotential.bulkDiscount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Process Efficiency Gains</span>
                      </div>
                      <span className="font-semibold text-green-600">AED {selectedAnalysis.optimizationPotential.processEfficiency.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Wastage Reduction</span>
                      </div>
                      <span className="font-semibold text-green-600">AED {selectedAnalysis.optimizationPotential.wastageReduction.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-300">
                      <span className="font-bold text-gray-900">Total Potential Savings</span>
                      <span className="font-bold text-xl text-green-600">AED {selectedAnalysis.savings.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      AI-Powered Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedAnalysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-900">{rec}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Target className="h-6 w-6 text-green-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Projected Impact</h4>
                        <p className="text-sm text-gray-700">
                          Implementing all recommendations could reduce production costs by{' '}
                          <span className="font-bold text-green-600">
                            AED {selectedAnalysis.savings.toLocaleString()} ({selectedAnalysis.savingsPercentage}%)
                          </span>
                          {' '}per batch, resulting in annual savings of approximately{' '}
                          <span className="font-bold text-green-600">
                            AED {(selectedAnalysis.savings * 12).toLocaleString()}
                          </span>
                          {' '}(assuming monthly production).
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suppliers" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alternative Suppliers</CardTitle>
                    <CardDescription>Verified suppliers with better pricing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alternativeSuppliers.map((supplier) => (
                        <div key={supplier.id} className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < Math.floor(supplier.rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">{supplier.rating}/5.0</span>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">
                              Save AED {supplier.savings.toLocaleString()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                            <div>
                              <span className="text-gray-600">Price/Unit:</span>
                              <p className="font-semibold text-gray-900">AED {supplier.pricePerUnit}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Min Order:</span>
                              <p className="font-semibold text-gray-900">{supplier.minOrderQty} units</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Lead Time:</span>
                              <p className="font-semibold text-gray-900">{supplier.leadTime}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-3">
                            Request Quote
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
