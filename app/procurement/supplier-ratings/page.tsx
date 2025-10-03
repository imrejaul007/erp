'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Plus,
  Download,
  BarChart3,
  Award,
  ThumbsUp,
  ArrowLeft} from 'lucide-react';

interface SupplierMetrics {
  qualityScore: number;
  deliveryScore: number;
  pricingScore: number;
  reliabilityScore: number;
  overallScore: number;
}

interface Supplier {
  id: string;
  name: string;
  country: string;
  category: string;
  metrics: SupplierMetrics;
  totalOrders: number;
  onTimeDeliveries: number;
  qualityIssues: number;
  lastOrderDate: string;
  totalSpent: number;
  avgLeadTime: number;
  rating: 'excellent' | 'good' | 'average' | 'poor';
  preferred: boolean;
  certifications: string[];
  notes: string;
}

export default function SupplierRatingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  // Mock data
  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'Cambodian Oud Traders Ltd.',
      country: 'Cambodia',
      category: 'Raw Materials - Oud',
      metrics: {
        qualityScore: 95,
        deliveryScore: 92,
        pricingScore: 88,
        reliabilityScore: 96,
        overallScore: 92.8,
      },
      totalOrders: 45,
      onTimeDeliveries: 42,
      qualityIssues: 1,
      lastOrderDate: '2024-01-15',
      totalSpent: 245000,
      avgLeadTime: 21,
      rating: 'excellent',
      preferred: true,
      certifications: ['ISO 9001', 'Organic Certified', 'Fair Trade'],
      notes: 'Consistent premium quality. Best source for Grade A+ oud wood.',
    },
    {
      id: '2',
      name: 'Indian Attar House',
      country: 'India',
      category: 'Essential Oils & Attars',
      metrics: {
        qualityScore: 88,
        deliveryScore: 85,
        pricingScore: 92,
        reliabilityScore: 90,
        overallScore: 88.8,
      },
      totalOrders: 62,
      onTimeDeliveries: 55,
      qualityIssues: 3,
      lastOrderDate: '2024-01-18',
      totalSpent: 128000,
      avgLeadTime: 14,
      rating: 'good',
      preferred: true,
      certifications: ['GMP Certified', 'IFRA Compliant'],
      notes: 'Competitive pricing. Occasional delays during monsoon season.',
    },
    {
      id: '3',
      name: 'Emirates Packaging Solutions',
      country: 'UAE',
      category: 'Packaging Materials',
      metrics: {
        qualityScore: 82,
        deliveryScore: 95,
        pricingScore: 78,
        reliabilityScore: 88,
        overallScore: 85.8,
      },
      totalOrders: 38,
      onTimeDeliveries: 36,
      qualityIssues: 2,
      lastOrderDate: '2024-01-20',
      totalSpent: 85000,
      avgLeadTime: 5,
      rating: 'good',
      preferred: false,
      certifications: ['FSC Certified'],
      notes: 'Fast local delivery. Premium pricing but worth it for urgent orders.',
    },
    {
      id: '4',
      name: 'Malaysian Agarwood Exports',
      country: 'Malaysia',
      category: 'Raw Materials - Oud',
      metrics: {
        qualityScore: 72,
        deliveryScore: 68,
        pricingScore: 85,
        reliabilityScore: 70,
        overallScore: 73.8,
      },
      totalOrders: 18,
      onTimeDeliveries: 12,
      qualityIssues: 5,
      lastOrderDate: '2023-12-10',
      totalSpent: 65000,
      avgLeadTime: 28,
      rating: 'average',
      preferred: false,
      certifications: [],
      notes: 'Inconsistent quality. Use only for Grade B products. Consider alternatives.',
    },
  ];

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'average':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredSuppliers = suppliers.filter((sup) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'preferred') return sup.preferred;
    return sup.rating === activeTab;
  });

  const totalSuppliers = suppliers.length;
  const preferredSuppliers = suppliers.filter((s) => s.preferred).length;
  const excellentSuppliers = suppliers.filter((s) => s.rating === 'excellent').length;
  const avgOverallScore =
    suppliers.reduce((sum, s) => sum + s.metrics.overallScore, 0) / suppliers.length;

  return (
    <div className="space-y-6">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Supplier Rating System
          </h1>
          <p className="text-gray-600 mt-2">
            Evaluate suppliers on quality, delivery, pricing, and reliability
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-indigo-500 to-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Package className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-gray-600 mt-1">{preferredSuppliers} preferred</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Overall Score</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOverallScore.toFixed(1)}</div>
            <div className="flex items-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(avgOverallScore / 20)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excellent Rated</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{excellentSuppliers}</div>
            <p className="text-xs text-gray-600 mt-1">
              {((excellentSuppliers / totalSuppliers) * 100).toFixed(0)}% of suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Procurement</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {suppliers.reduce((sum, s) => sum + s.totalSpent, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers List */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance</CardTitle>
          <CardDescription>Detailed ratings and metrics for all suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="preferred">Preferred</TabsTrigger>
              <TabsTrigger value="excellent">Excellent</TabsTrigger>
              <TabsTrigger value="good">Good</TabsTrigger>
              <TabsTrigger value="average">Average</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredSuppliers.map((supplier) => {
                const onTimePercent = (
                  (supplier.onTimeDeliveries / supplier.totalOrders) *
                  100
                ).toFixed(0);

                return (
                  <Card key={supplier.id} className="border-l-4 border-l-indigo-500">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{supplier.name}</h3>
                            <Badge className={getRatingColor(supplier.rating)}>
                              {supplier.rating.toUpperCase()}
                            </Badge>
                            {supplier.preferred && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Award className="h-3 w-3 mr-1" />
                                Preferred
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{supplier.country}</span>
                            <span>{supplier.category}</span>
                            <span>{supplier.totalOrders} orders</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Overall Score</p>
                          <p
                            className={`text-3xl font-bold ${getScoreColor(
                              supplier.metrics.overallScore
                            )}`}
                          >
                            {supplier.metrics.overallScore.toFixed(1)}
                          </p>
                          <div className="flex items-center gap-0.5 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(supplier.metrics.overallScore / 20)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {[
                          { label: 'Quality', score: supplier.metrics.qualityScore },
                          { label: 'Delivery', score: supplier.metrics.deliveryScore },
                          { label: 'Pricing', score: supplier.metrics.pricingScore },
                          { label: 'Reliability', score: supplier.metrics.reliabilityScore },
                        ].map((metric) => (
                          <div key={metric.label} className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                            <div className="flex items-center justify-between mb-2">
                              <p
                                className={`text-xl font-bold ${getScoreColor(metric.score)}`}
                              >
                                {metric.score}
                              </p>
                              <span className="text-xs text-gray-600">/100</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getScoreBg(metric.score)}`}
                                style={{ width: `${metric.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <p className="text-sm text-blue-900 font-medium">Lead Time</p>
                          </div>
                          <p className="text-lg font-bold text-blue-900">
                            {supplier.avgLeadTime} days
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-900 font-medium">On-Time</p>
                          </div>
                          <p className="text-lg font-bold text-green-900">{onTimePercent}%</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="h-4 w-4 text-purple-600" />
                            <p className="text-sm text-purple-900 font-medium">Total Spent</p>
                          </div>
                          <p className="text-lg font-bold text-purple-900">
                            AED {(supplier.totalSpent / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div
                          className={`rounded-lg p-3 border ${
                            supplier.qualityIssues === 0
                              ? 'bg-green-50 border-green-200'
                              : supplier.qualityIssues <= 2
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle
                              className={`h-4 w-4 ${
                                supplier.qualityIssues === 0
                                  ? 'text-green-600'
                                  : supplier.qualityIssues <= 2
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}
                            />
                            <p
                              className={`text-sm font-medium ${
                                supplier.qualityIssues === 0
                                  ? 'text-green-900'
                                  : supplier.qualityIssues <= 2
                                  ? 'text-yellow-900'
                                  : 'text-red-900'
                              }`}
                            >
                              Issues
                            </p>
                          </div>
                          <p
                            className={`text-lg font-bold ${
                              supplier.qualityIssues === 0
                                ? 'text-green-900'
                                : supplier.qualityIssues <= 2
                                ? 'text-yellow-900'
                                : 'text-red-900'
                            }`}
                          >
                            {supplier.qualityIssues}
                          </p>
                        </div>
                      </div>

                      {/* Certifications */}
                      {supplier.certifications.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Certifications
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {supplier.certifications.map((cert, idx) => (
                              <Badge key={idx} className="bg-indigo-100 text-indigo-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-1">Supplier Notes</p>
                        <p className="text-sm text-blue-700">{supplier.notes}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-indigo-500 to-blue-600"
                        >
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          Place Order
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Analytics
                        </Button>
                        <Button size="sm" variant="outline">
                          Update Rating
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Supplier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredSuppliers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No suppliers found in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Auto-suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Procurement Recommendations</CardTitle>
          <CardDescription>AI-powered supplier suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <ThumbsUp className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Recommended: Cambodian Oud Traders</p>
              <p className="text-sm text-green-700">
                For premium oud orders. Excellent quality (95/100) and high reliability. Best
                choice for Grade A+ products.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">
                Review: Malaysian Agarwood Exports
              </p>
              <p className="text-sm text-yellow-700">
                Quality score declined to 72/100 with 5 issues. Consider finding alternative
                supplier for critical orders.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Cost Optimization</p>
              <p className="text-sm text-blue-700">
                Indian Attar House offers 8% better pricing than competitors with good quality
                (88/100). Increase order volume for bulk discounts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
