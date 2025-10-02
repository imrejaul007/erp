'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  DollarSign,
  Wallet,
  TrendingUp,
  FileText,
  CreditCard,
  PieChart,
  Target,
  Calculator,
  Calendar,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

export default function FinanceAdvancedPage() {
  const router = useRouter();

  const financeFeatures = [
    {
      id: 'petty-cash',
      title: 'Petty Cash Management',
      description: 'Track and manage petty cash across locations',
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/finance-advanced/petty-cash',
      status: 'active',
      features: [
        'Multiple cash boxes',
        'Expense tracking',
        'Approval workflows',
        'Reconciliation',
        'Receipt capture',
        'Reimbursements',
        'Category tracking',
        'Audit trail'
      ],
      metrics: {
        cashBoxes: 8,
        monthlyExpenses: 'AED 12.5K',
        avgTransaction: 'AED 125',
        reconciliationRate: '98%'
      }
    },
    {
      id: 'budgets',
      title: 'Budget Planning',
      description: 'Create and monitor departmental budgets',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/finance-advanced/budgets',
      status: 'active',
      features: [
        'Budget creation',
        'Department allocation',
        'Variance analysis',
        'Approval process',
        'Monthly tracking',
        'Forecast vs actual',
        'Budget alerts',
        'Rolling forecasts'
      ],
      metrics: {
        totalBudget: 'AED 2.5M',
        departments: 8,
        utilization: '72%',
        variance: '+5%'
      }
    },
    {
      id: 'forecasting',
      title: 'Financial Forecasting',
      description: 'Predict future financial performance',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/finance-advanced/forecasting',
      status: 'active',
      features: [
        'Revenue forecasting',
        'Expense projections',
        'Cash flow prediction',
        'Scenario planning',
        'Trend analysis',
        'What-if analysis',
        'Historical comparison',
        'Confidence intervals'
      ],
      metrics: {
        accuracy: '91%',
        forecastPeriod: '12 months',
        scenarios: 4,
        updateFrequency: 'Weekly'
      }
    },
    {
      id: 'credit-management',
      title: 'Credit Management',
      description: 'Manage customer credit limits and terms',
      icon: CreditCard,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/features/finance-advanced/credit',
      status: 'active',
      features: [
        'Credit limits',
        'Payment terms',
        'Credit checks',
        'Aging reports',
        'Collections',
        'Credit notes',
        'Risk assessment',
        'Payment reminders'
      ],
      metrics: {
        creditCustomers: 245,
        totalCredit: 'AED 850K',
        avgDSO: '32 days',
        collectionRate: '94%'
      }
    },
    {
      id: 'financial-reports',
      title: 'Advanced Reporting',
      description: 'Comprehensive financial statements and analysis',
      icon: FileText,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      path: '/features/finance-advanced/reports',
      status: 'active',
      features: [
        'P&L statements',
        'Balance sheets',
        'Cash flow statements',
        'Trial balance',
        'General ledger',
        'Custom reports',
        'Ratio analysis',
        'Export options'
      ],
      metrics: {
        reportTypes: 24,
        monthlyReports: 85,
        scheduledReports: 12,
        exportFormats: 5
      }
    },
    {
      id: 'cost-centers',
      title: 'Cost Center Analysis',
      description: 'Track costs by department and project',
      icon: PieChart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/features/finance-advanced/cost-centers',
      status: 'active',
      features: [
        'Cost center setup',
        'Expense allocation',
        'Profitability analysis',
        'Cross-charging',
        'Project costing',
        'Overhead allocation',
        'Performance metrics',
        'Comparative analysis'
      ],
      metrics: {
        costCenters: 15,
        projects: 8,
        avgMargin: '33%',
        topPerformer: 'Sales'
      }
    },
    {
      id: 'bank-reconciliation',
      title: 'Bank Reconciliation',
      description: 'Automated bank statement matching',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/finance-advanced/reconciliation',
      status: 'active',
      features: [
        'Auto-matching',
        'Bank feeds',
        'Multi-bank support',
        'Exception handling',
        'Approval workflow',
        'Audit trail',
        'Reconciliation reports',
        'Outstanding items'
      ],
      metrics: {
        bankAccounts: 6,
        autoMatchRate: '87%',
        avgTime: '15min',
        lastReconciled: 'Today'
      }
    },
    {
      id: 'tax-management',
      title: 'Tax Management',
      description: 'VAT and tax compliance tools',
      icon: Calculator,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      path: '/features/finance-advanced/tax',
      status: 'active',
      features: [
        'VAT calculation',
        'Tax returns',
        'Compliance tracking',
        'Tax reports',
        'Reverse charge',
        'Tax codes',
        'Exemptions',
        'Audit support'
      ],
      metrics: {
        monthlyVAT: 'AED 45K',
        complianceRate: '100%',
        filings: 'On-time',
        taxCodes: 12
      }
    }
  ];

  const financeSummary = {
    monthlyRevenue: 4325000,
    monthlyExpenses: 2463500,
    netProfit: 1861500,
    cashBalance: 2850000,
    accountsReceivable: 850000,
    accountsPayable: 620000
  };

  const budgetPerformance = [
    { department: 'Sales & Marketing', budget: 450000, spent: 385000, variance: -14.4, status: 'good' },
    { department: 'Operations', budget: 680000, spent: 720000, variance: 5.9, status: 'warning' },
    { department: 'Administration', budget: 280000, spent: 265000, variance: -5.4, status: 'good' },
    { department: 'IT', budget: 150000, spent: 158000, variance: 5.3, status: 'warning' }
  ];

  const cashFlowForecast = [
    { month: 'Nov 2024', inflow: 1250000, outflow: 850000, net: 400000, balance: 3250000 },
    { month: 'Dec 2024', inflow: 1450000, outflow: 920000, net: 530000, balance: 3780000 },
    { month: 'Jan 2025', inflow: 950000, outflow: 780000, net: 170000, balance: 3950000 },
    { month: 'Feb 2025', inflow: 1080000, outflow: 820000, net: 260000, balance: 4210000 }
  ];

  const benefits = [
    {
      title: 'Better Control',
      description: 'Tight control over finances with real-time visibility',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Accurate Forecasting',
      description: 'Predict future performance with AI-powered forecasts',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Reduce Costs',
      description: 'Identify cost savings and optimize spending',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Compliance',
      description: 'Stay compliant with tax and regulatory requirements',
      icon: CheckCircle,
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
            <DollarSign className="h-8 w-8 text-green-600" />
            Finance Pro
          </h1>
          <p className="text-muted-foreground">
            Advanced financial management, budgeting, forecasting, and credit management
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">AED {(financeSummary.monthlyRevenue / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-gray-600">Revenue</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FileText className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold text-red-600">AED {(financeSummary.monthlyExpenses / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-gray-600">Expenses</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">AED {(financeSummary.netProfit / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-gray-600">Net Profit</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Wallet className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold">AED {(financeSummary.cashBalance / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-gray-600">Cash Balance</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold">AED {(financeSummary.accountsReceivable / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Receivables</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <AlertTriangle className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-2xl font-bold">AED {(financeSummary.accountsPayable / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Payables</div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Finance Pro?</CardTitle>
          <CardDescription>Advanced tools for financial excellence</CardDescription>
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

      {/* Budget Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Performance by Department</CardTitle>
          <CardDescription>Budget vs actual spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetPerformance.map((dept, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-lg">{dept.department}</div>
                  <Badge className={
                    dept.status === 'good' ? 'bg-green-100 text-green-800' :
                    'bg-amber-100 text-amber-800'
                  }>
                    {dept.variance > 0 ? '+' : ''}{dept.variance.toFixed(1)}% variance
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div>
                    <div className="text-sm text-gray-600">Budget</div>
                    <div className="font-bold">AED {(dept.budget / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Spent</div>
                    <div className={`font-bold ${
                      dept.spent > dept.budget ? 'text-red-600' : 'text-green-600'
                    }`}>
                      AED {(dept.spent / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Remaining</div>
                    <div className={`font-bold ${
                      dept.budget - dept.spent > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      AED {((dept.budget - dept.spent) / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      dept.spent > dept.budget ? 'bg-red-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min((dept.spent / dept.budget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Forecast</CardTitle>
          <CardDescription>Projected cash position for next 4 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cashFlowForecast.map((forecast, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">{forecast.month}</div>
                    <div className="text-sm text-gray-600">
                      Net: <span className={`font-semibold ${
                        forecast.net > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        AED {(forecast.net / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Ending Balance</div>
                    <div className="text-xl font-bold text-blue-600">
                      AED {(forecast.balance / 1000000).toFixed(2)}M
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Inflow</div>
                    <div className="font-bold text-green-600">AED {(forecast.inflow / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Outflow</div>
                    <div className="font-bold text-red-600">AED {(forecast.outflow / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Finance Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financeFeatures.map((feature) => {
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
          <CardTitle>Getting Started with Finance Pro</CardTitle>
          <CardDescription>Set up advanced financial management in 4 steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div className="font-semibold mb-1">Chart of Accounts</div>
              <div className="text-sm text-gray-600">Set up your account structure</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <div className="font-semibold mb-1">Create Budgets</div>
              <div className="text-sm text-gray-600">Define department budgets and goals</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <div className="font-semibold mb-1">Connect Banks</div>
              <div className="text-sm text-gray-600">Link bank accounts for reconciliation</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-amber-600">4</span>
              </div>
              <div className="font-semibold mb-1">Monitor & Report</div>
              <div className="text-sm text-gray-600">Track performance and generate reports</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
