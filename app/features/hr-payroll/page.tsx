'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  UserCheck,
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
  Award,
  Clock,
  Users,
  Target,
  CheckCircle,
  Briefcase,
  BarChart3
} from 'lucide-react';

export default function HRPayrollPage() {
  const router = useRouter();

  const hrFeatures = [
    {
      id: 'payroll',
      title: 'Payroll Processing',
      description: 'Automated payroll calculation and payment',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/hr-payroll/payroll',
      status: 'active',
      features: [
        'Salary calculation',
        'Tax deductions',
        'Overtime tracking',
        'Bonus management',
        'Payslip generation',
        'Bank transfers',
        'Multi-currency',
        'Audit trail'
      ],
      metrics: {
        employees: 87,
        monthlyPayroll: 'AED 425K',
        avgSalary: 'AED 4,885',
        processingTime: '2 hours'
      }
    },
    {
      id: 'leave-management',
      title: 'Leave Management',
      description: 'Track employee leave and time off',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/hr-payroll/leave',
      status: 'active',
      features: [
        'Leave requests',
        'Approval workflow',
        'Leave balance',
        'Calendar view',
        'Leave types',
        'Accrual rules',
        'Holiday calendar',
        'Leave reports'
      ],
      metrics: {
        pendingRequests: 5,
        avgLeaveBalance: '12 days',
        approvalTime: '1.2 days',
        leaveUtilization: '68%'
      }
    },
    {
      id: 'performance',
      title: 'Performance Management',
      description: 'Set goals and conduct performance reviews',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/hr-payroll/performance',
      status: 'active',
      features: [
        'Goal setting',
        'Performance reviews',
        '360-degree feedback',
        'Rating scales',
        'Review cycles',
        'Self-assessment',
        'Development plans',
        'Performance analytics'
      ],
      metrics: {
        activeGoals: 245,
        reviewsCompleted: '94%',
        avgRating: '4.2/5',
        nextReview: '15 days'
      }
    },
    {
      id: 'commission',
      title: 'Commission Management',
      description: 'Calculate and track sales commissions',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/features/hr-payroll/commission',
      status: 'active',
      features: [
        'Commission rules',
        'Tiered structures',
        'Sales tracking',
        'Auto-calculation',
        'Commission reports',
        'Payment schedules',
        'Target tracking',
        'Team commissions'
      ],
      metrics: {
        salesReps: 15,
        monthlyCommission: 'AED 85K',
        avgCommission: 'AED 5,667',
        achievementRate: '112%'
      }
    },
    {
      id: 'attendance',
      title: 'Attendance Tracking',
      description: 'Monitor employee attendance and punctuality',
      icon: Clock,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      path: '/features/hr-payroll/attendance',
      status: 'active',
      features: [
        'Clock in/out',
        'Biometric integration',
        'Shift management',
        'Late arrivals',
        'Overtime tracking',
        'Attendance reports',
        'Mobile check-in',
        'GPS verification'
      ],
      metrics: {
        avgAttendance: '96.5%',
        lateArrivals: '8/month',
        avgWorkHours: '8.2h/day',
        overtimeHours: '125/month'
      }
    },
    {
      id: 'recruitment',
      title: 'Recruitment',
      description: 'Manage hiring process from job posting to onboarding',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/features/hr-payroll/recruitment',
      status: 'active',
      features: [
        'Job postings',
        'Applicant tracking',
        'Interview scheduling',
        'Candidate evaluation',
        'Offer management',
        'Onboarding',
        'Document collection',
        'Recruitment analytics'
      ],
      metrics: {
        openPositions: 5,
        applicants: 127,
        avgTimeToHire: '18 days',
        offerAcceptance: '89%'
      }
    },
    {
      id: 'benefits',
      title: 'Benefits Management',
      description: 'Track employee benefits and entitlements',
      icon: Award,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      path: '/features/hr-payroll/benefits',
      status: 'active',
      features: [
        'Benefit plans',
        'Health insurance',
        'Retirement plans',
        'Allowances',
        'Gratuity calculation',
        'Benefit enrollment',
        'Cost tracking',
        'Employee portal'
      ],
      metrics: {
        benefitPlans: 8,
        enrollment: '87%',
        monthlyBenefits: 'AED 45K',
        satisfaction: '4.5/5'
      }
    },
    {
      id: 'documents',
      title: 'Document Management',
      description: 'Store and manage employee documents',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/hr-payroll/documents',
      status: 'active',
      features: [
        'Document storage',
        'Contract management',
        'Visa tracking',
        'Labor card',
        'Certificates',
        'Expiry alerts',
        'E-signatures',
        'Secure access'
      ],
      metrics: {
        documents: 1250,
        expiringDocs: 8,
        digitalSignatures: 245,
        storageUsed: '2.5GB'
      }
    }
  ];

  const hrSummary = {
    totalEmployees: 87,
    monthlyPayroll: 425000,
    avgSalary: 4885,
    turnoverRate: 8.5,
    employeeSatisfaction: 4.3,
    openPositions: 5
  };

  const departmentStats = [
    { department: 'Sales', employees: 25, avgSalary: 5200, turnover: 12, satisfaction: 4.2 },
    { department: 'Operations', employees: 32, avgSalary: 4500, turnover: 6, satisfaction: 4.4 },
    { department: 'Marketing', employees: 8, avgSalary: 5800, turnover: 10, satisfaction: 4.5 },
    { department: 'Finance', employees: 6, avgSalary: 6200, turnover: 4, satisfaction: 4.6 },
    { department: 'IT', employees: 5, avgSalary: 7500, turnover: 8, satisfaction: 4.3 },
    { department: 'HR', employees: 4, avgSalary: 5500, turnover: 5, satisfaction: 4.5 },
    { department: 'Administration', employees: 7, avgSalary: 4200, turnover: 7, satisfaction: 4.2 }
  ];

  const payrollBreakdown = [
    { category: 'Base Salary', amount: 325000, percentage: 76.5 },
    { category: 'Overtime', amount: 28000, percentage: 6.6 },
    { category: 'Bonuses', amount: 35000, percentage: 8.2 },
    { category: 'Allowances', amount: 37000, percentage: 8.7 }
  ];

  const benefits = [
    {
      title: 'Automate Payroll',
      description: 'Save time with automated salary calculations and payments',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Track Performance',
      description: 'Set goals and conduct regular performance reviews',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      title: 'Manage Leave',
      description: 'Streamline leave requests and approvals',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Stay Compliant',
      description: 'Ensure compliance with UAE labor laws',
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
            <UserCheck className="h-8 w-8 text-indigo-600" />
            HR & Payroll
          </h1>
          <p className="text-muted-foreground">
            Payroll processing, leave management, performance reviews, and employee benefits
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{hrSummary.totalEmployees}</div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold">AED {(hrSummary.monthlyPayroll / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Monthly Payroll</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold">AED {hrSummary.avgSalary}</div>
            <div className="text-sm text-gray-600">Avg Salary</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <BarChart3 className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold">{hrSummary.turnoverRate}%</div>
            <div className="text-sm text-gray-600">Turnover Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Award className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-2xl font-bold">{hrSummary.employeeSatisfaction}</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Briefcase className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{hrSummary.openPositions}</div>
            <div className="text-sm text-gray-600">Open Positions</div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why HR & Payroll?</CardTitle>
          <CardDescription>Streamline HR operations and employee management</CardDescription>
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

      {/* Department Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Department Statistics</CardTitle>
          <CardDescription>Employee count and metrics by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">{dept.department}</div>
                    <div className="text-sm text-gray-600">{dept.employees} employees</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {dept.satisfaction}/5 Satisfaction
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Avg Salary</div>
                    <div className="font-bold text-green-600">AED {dept.avgSalary?.toLocaleString() || "0"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Turnover</div>
                    <div className={`font-bold ${dept.turnover > 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {dept.turnover}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                    <div className="font-bold text-purple-600">{dept.satisfaction}/5</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payroll Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Breakdown</CardTitle>
          <CardDescription>Monthly payroll composition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrollBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold">{item.category}</div>
                    <div className="text-sm text-gray-600">AED {(item.amount / 1000).toFixed(0)}K</div>
                  </div>
                  <Badge variant="outline">{item.percentage}%</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-600"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg">Total Monthly Payroll</div>
                <div className="font-bold text-2xl text-green-600">
                  AED {(hrSummary.monthlyPayroll / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HR Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hrFeatures.map((feature) => {
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
          <CardTitle>Getting Started with HR & Payroll</CardTitle>
          <CardDescription>Set up complete HR management in 4 steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div className="font-semibold mb-1">Add Employees</div>
              <div className="text-sm text-gray-600">Import or add employee records and contracts</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <div className="font-semibold mb-1">Setup Payroll</div>
              <div className="text-sm text-gray-600">Configure salary structures and deductions</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <div className="font-semibold mb-1">Define Policies</div>
              <div className="text-sm text-gray-600">Set leave policies and benefits</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-amber-600">4</span>
              </div>
              <div className="font-semibold mb-1">Run Payroll</div>
              <div className="text-sm text-gray-600">Process monthly payroll and generate reports</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
