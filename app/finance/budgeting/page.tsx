'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Calendar,
  Plus,
  Download,
  BarChart3,
  PieChart,
  Target,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BudgetCategory {
  id: string;
  name: string;
  department: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: 'under' | 'on_track' | 'over' | 'warning';
  subcategories?: {
    name: string;
    budgeted: number;
    actual: number;
  }[];
}

interface Budget {
  id: string;
  name: string;
  period: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalActual: number;
  totalVariance: number;
  status: 'draft' | 'active' | 'completed';
  categories: BudgetCategory[];
}

export default function BudgetingPage() {
  const [activeTab, setActiveTab] = useState('current');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-Q1');

  // Mock data
  const budgets: Budget[] = [
    {
      id: '1',
      name: '2024 Q1 Budget',
      period: '2024-Q1',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      totalBudget: 500000.0,
      totalActual: 425000.0,
      totalVariance: 75000.0,
      status: 'active',
      categories: [
        {
          id: 'C1',
          name: 'Raw Materials',
          department: 'Production',
          budgeted: 150000.0,
          actual: 145000.0,
          variance: 5000.0,
          variancePercent: 3.3,
          status: 'under',
          subcategories: [
            { name: 'Oud Wood', budgeted: 80000, actual: 78000 },
            { name: 'Essential Oils', budgeted: 40000, actual: 38000 },
            { name: 'Packaging', budgeted: 30000, actual: 29000 },
          ],
        },
        {
          id: 'C2',
          name: 'Marketing & Advertising',
          department: 'Marketing',
          budgeted: 80000.0,
          actual: 92000.0,
          variance: -12000.0,
          variancePercent: -15.0,
          status: 'over',
          subcategories: [
            { name: 'Social Media Ads', budgeted: 30000, actual: 38000 },
            { name: 'Events & Exhibitions', budgeted: 40000, actual: 44000 },
            { name: 'Content Creation', budgeted: 10000, actual: 10000 },
          ],
        },
        {
          id: 'C3',
          name: 'Staff Salaries',
          department: 'HR',
          budgeted: 120000.0,
          actual: 120000.0,
          variance: 0,
          variancePercent: 0,
          status: 'on_track',
          subcategories: [
            { name: 'Sales Team', budgeted: 50000, actual: 50000 },
            { name: 'Production Team', budgeted: 40000, actual: 40000 },
            { name: 'Admin & Support', budgeted: 30000, actual: 30000 },
          ],
        },
        {
          id: 'C4',
          name: 'Operations & Logistics',
          department: 'Operations',
          budgeted: 60000.0,
          actual: 55000.0,
          variance: 5000.0,
          variancePercent: 8.3,
          status: 'under',
          subcategories: [
            { name: 'Shipping & Delivery', budgeted: 25000, actual: 22000 },
            { name: 'Warehouse Rent', budgeted: 20000, actual: 20000 },
            { name: 'Utilities', budgeted: 15000, actual: 13000 },
          ],
        },
        {
          id: 'C5',
          name: 'R&D and Innovation',
          department: 'Production',
          budgeted: 40000.0,
          actual: 38000.0,
          variance: 2000.0,
          variancePercent: 5.0,
          status: 'on_track',
          subcategories: [
            { name: 'Fragrance Experiments', budgeted: 20000, actual: 18000 },
            { name: 'Quality Testing', budgeted: 15000, actual: 15000 },
            { name: 'Lab Equipment', budgeted: 5000, actual: 5000 },
          ],
        },
        {
          id: 'C6',
          name: 'IT & Software',
          department: 'IT',
          budgeted: 25000.0,
          actual: 28000.0,
          variance: -3000.0,
          variancePercent: -12.0,
          status: 'warning',
          subcategories: [
            { name: 'ERP System', budgeted: 10000, actual: 12000 },
            { name: 'Website & E-commerce', budgeted: 10000, actual: 11000 },
            { name: 'Cloud Services', budgeted: 5000, actual: 5000 },
          ],
        },
        {
          id: 'C7',
          name: 'Contingency Fund',
          department: 'Finance',
          budgeted: 25000.0,
          actual: 10000.0,
          variance: 15000.0,
          variancePercent: 60.0,
          status: 'under',
          subcategories: [],
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under':
        return 'bg-green-100 text-green-800';
      case 'on_track':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'over':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'over':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const currentBudget = budgets[0];
  const utilizationRate = ((currentBudget.totalActual / currentBudget.totalBudget) * 100).toFixed(1);
  const overBudgetCount = currentBudget.categories.filter((c) => c.status === 'over').length;
  const onTrackCount = currentBudget.categories.filter((c) => c.status === 'on_track').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Budgeting & Forecasting
          </h1>
          <p className="text-gray-600 mt-2">
            Plan budgets, track spending, and analyze variance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
            <Plus className="mr-2 h-4 w-4" />
            New Budget
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select period..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-Q1">2024 Q1 (Jan - Mar)</SelectItem>
                <SelectItem value="2024-Q2">2024 Q2 (Apr - Jun)</SelectItem>
                <SelectItem value="2024-Q3">2024 Q3 (Jul - Sep)</SelectItem>
                <SelectItem value="2024-Q4">2024 Q4 (Oct - Dec)</SelectItem>
                <SelectItem value="2024-Annual">2024 Annual</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(currentBudget.startDate).toLocaleDateString()} -{' '}
                {new Date(currentBudget.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {currentBudget.totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">{selectedPeriod}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {currentBudget.totalActual.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">{utilizationRate}% utilized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              AED {currentBudget.totalVariance.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">Under budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <PieChart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentBudget.categories.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              {onTrackCount} on track, {overBudgetCount} over
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
          <CardDescription>Overall budget utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Budget Utilization</span>
              <span className="font-medium">{utilizationRate}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
                style={{ width: `${utilizationRate}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">
                Actual: AED {currentBudget.totalActual.toLocaleString()}
              </span>
              <span className="text-gray-600 font-medium">
                Budget: AED {currentBudget.totalBudget.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
          <CardDescription>Departmental budget allocation and variance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="current">Current Period</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="history">Historical</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {currentBudget.categories.map((category) => (
                <Card key={category.id} className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          <Badge className={getStatusColor(category.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(category.status)}
                              {category.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </Badge>
                          <Badge variant="outline">{category.department}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Variance</p>
                        <p
                          className={`text-2xl font-bold ${
                            category.variance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {category.variance >= 0 ? '+' : ''}
                          AED {Math.abs(category.variance).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {category.variancePercent >= 0 ? '+' : ''}
                          {category.variancePercent.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Budget vs Actual */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Budgeted</p>
                        <p className="text-2xl font-bold">
                          AED {category.budgeted.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Actual</p>
                        <p className="text-2xl font-bold">
                          AED {category.actual.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Utilization</span>
                        <span className="font-medium">
                          {((category.actual / category.budgeted) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            category.status === 'over'
                              ? 'bg-gradient-to-r from-red-500 to-orange-600'
                              : category.status === 'warning'
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                          }`}
                          style={{
                            width: `${Math.min((category.actual / category.budgeted) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Subcategories */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Breakdown</p>
                        {category.subcategories.map((sub, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{sub.name}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span>Budget: AED {sub.budgeted.toLocaleString()}</span>
                                <span>Actual: AED {sub.actual.toLocaleString()}</span>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                sub.actual <= sub.budgeted
                                  ? 'text-green-700'
                                  : 'text-red-700'
                              }
                            >
                              {sub.actual <= sub.budgeted ? 'Under' : 'Over'} by AED{' '}
                              {Math.abs(sub.budgeted - sub.actual).toLocaleString()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-emerald-500 to-teal-600"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Adjust Budget
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Insights</CardTitle>
          <CardDescription>AI-powered recommendations and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Marketing Over Budget</p>
              <p className="text-sm text-red-700">
                Marketing & Advertising is 15% over budget. Consider reallocating from
                Contingency Fund or reviewing campaign ROI.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">IT Budget Warning</p>
              <p className="text-sm text-yellow-700">
                IT & Software spending is 12% above forecast. Monitor closely for Q2.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Operations Efficiency</p>
              <p className="text-sm text-green-700">
                Operations & Logistics is 8.3% under budget. Excellent cost management!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Forecast for Q2</p>
              <p className="text-sm text-blue-700">
                Based on current trends, projected spend for Q2: AED 430,000 (86% utilization)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
