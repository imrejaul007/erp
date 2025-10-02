'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Shield, FileCheck, Users, Lock, AlertTriangle, FileText, Clock, BookOpen,
  ArrowLeft, TrendingUp, Target, DollarSign, CheckCircle2, XCircle, Activity
} from 'lucide-react';

export default function CompliancePage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const complianceSummary = {
    complianceScore: 94.5,
    activeAudits: 3,
    pendingActions: 8,
    documentsExpiring: 12,
    certifications: 15,
    policyReviews: 28,
    incidentsYTD: 2,
    lastAuditDate: '2024-09-15'
  };

  const complianceFeatures = [
    {
      id: 'regulations',
      title: 'UAE Regulatory Compliance',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/compliance/regulations',
      status: 'active',
      description: 'Stay compliant with UAE business, tax, and industry regulations',
      metrics: {
        regulations: 28,
        compliant: 26,
        inProgress: 2,
        score: 92.8
      },
      features: [
        'UAE Commercial Companies Law compliance',
        'VAT (5%) compliance and reporting',
        'Economic Substance Regulations (ESR)',
        'Anti-Money Laundering (AML) requirements',
        'Data Protection Law compliance',
        'Consumer Protection regulations',
        'Free Zone specific regulations',
        'Automated regulatory updates tracking'
      ]
    },
    {
      id: 'gdpr',
      title: 'Data Protection & Privacy',
      icon: Lock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/compliance/gdpr',
      status: 'active',
      description: 'GDPR and UAE data protection compliance management',
      metrics: {
        policies: 12,
        dataSubjects: 2847,
        requests: 5,
        responseTime: 4.2
      },
      features: [
        'GDPR compliance framework',
        'UAE Data Protection Law adherence',
        'Customer consent management',
        'Right to access and erasure',
        'Data breach notification system',
        'Privacy policy generator',
        'Cookie consent management',
        'Third-party data processor tracking'
      ]
    },
    {
      id: 'labor',
      title: 'Labor Law Compliance',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/compliance/labor',
      status: 'active',
      description: 'UAE labor law compliance and HR regulations',
      metrics: {
        employees: 87,
        contractsValid: 85,
        violations: 0,
        auditsYear: 2
      },
      features: [
        'UAE Labor Law compliance tracking',
        'Employment contract management',
        'Wage Protection System (WPS) integration',
        'End of Service Benefits calculation',
        'Working hours and overtime tracking',
        'Leave entitlement compliance',
        'Workplace safety regulations',
        'Emiratization quota monitoring'
      ]
    },
    {
      id: 'financial',
      title: 'Financial Compliance',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      path: '/features/compliance/financial',
      status: 'active',
      description: 'Financial reporting and accounting standards compliance',
      metrics: {
        standards: 8,
        reports: 156,
        accuracy: 99.2,
        auditReady: true
      },
      features: [
        'IFRS (International Financial Reporting Standards)',
        'UAE Accounting Standards',
        'Audit trail maintenance',
        'Financial statement preparation',
        'Internal controls framework',
        'Anti-fraud measures',
        'Related party transactions tracking',
        'External audit preparation'
      ]
    },
    {
      id: 'health',
      title: 'Health & Safety',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      path: '/features/compliance/health',
      status: 'active',
      description: 'Workplace health and safety compliance',
      metrics: {
        incidents: 0,
        inspections: 24,
        trainingHours: 348,
        certifications: 12
      },
      features: [
        'UAE Occupational Safety & Health standards',
        'Safety incident reporting',
        'Risk assessment and mitigation',
        'Safety equipment tracking',
        'Employee safety training',
        'Emergency response procedures',
        'Safety inspection scheduling',
        'MSDS (Material Safety Data Sheets) management'
      ]
    },
    {
      id: 'documents',
      title: 'Document Management',
      icon: FileCheck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      path: '/features/compliance/documents',
      status: 'active',
      description: 'Compliance document storage and lifecycle management',
      metrics: {
        documents: 1245,
        expiring: 12,
        archived: 456,
        avgAge: 18
      },
      features: [
        'Centralized document repository',
        'Document expiry alerts',
        'Version control and audit trail',
        'Digital signature support',
        'Access control and permissions',
        'Automatic archival policies',
        'Document templates library',
        'Search and retrieval system'
      ]
    },
    {
      id: 'audit',
      title: 'Audit Management',
      icon: Target,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
      path: '/features/compliance/audit',
      status: 'active',
      description: 'Internal and external audit planning and tracking',
      metrics: {
        activeAudits: 3,
        completed: 8,
        findings: 15,
        resolved: 13
      },
      features: [
        'Audit planning and scheduling',
        'Audit checklist management',
        'Finding and observation tracking',
        'Corrective action plans',
        'Follow-up and verification',
        'Audit report generation',
        'Risk-based audit approach',
        'Continuous monitoring'
      ]
    },
    {
      id: 'training',
      title: 'Compliance Training',
      icon: BookOpen,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/features/compliance/training',
      status: 'active',
      description: 'Employee compliance training and certification tracking',
      metrics: {
        courses: 28,
        enrolled: 87,
        completion: 92.5,
        hours: 1248
      },
      features: [
        'Mandatory compliance training',
        'Training course library',
        'Quiz and assessment tools',
        'Certification tracking',
        'Training schedule management',
        'Completion reports',
        'Automatic reminders for renewals',
        'Multi-language support'
      ]
    }
  ];

  const regulatoryCompliance = [
    {
      category: 'Tax & VAT',
      regulations: 8,
      status: 'compliant',
      score: 98.5,
      lastReview: '2024-09-20',
      nextReview: '2024-12-20'
    },
    {
      category: 'Labor Law',
      regulations: 12,
      status: 'compliant',
      score: 96.2,
      lastReview: '2024-08-15',
      nextReview: '2024-11-15'
    },
    {
      category: 'Data Protection',
      regulations: 6,
      status: 'in-progress',
      score: 88.5,
      lastReview: '2024-09-01',
      nextReview: '2024-10-15'
    },
    {
      category: 'Health & Safety',
      regulations: 10,
      status: 'compliant',
      score: 94.0,
      lastReview: '2024-09-10',
      nextReview: '2024-12-10'
    },
    {
      category: 'Financial Reporting',
      regulations: 5,
      status: 'compliant',
      score: 99.0,
      lastReview: '2024-09-25',
      nextReview: '2024-12-25'
    },
    {
      category: 'Consumer Protection',
      regulations: 4,
      status: 'in-progress',
      score: 90.0,
      lastReview: '2024-08-20',
      nextReview: '2024-11-01'
    }
  ];

  const pendingActions = [
    {
      action: 'Update Privacy Policy for new data collection',
      priority: 'high',
      dueDate: '2024-10-15',
      assignedTo: 'Legal Team',
      category: 'Data Protection'
    },
    {
      action: 'Complete Q3 Labor Law compliance review',
      priority: 'high',
      dueDate: '2024-10-10',
      assignedTo: 'HR Department',
      category: 'Labor Law'
    },
    {
      action: 'Renew Trade License',
      priority: 'critical',
      dueDate: '2024-10-05',
      assignedTo: 'Admin',
      category: 'Business License'
    },
    {
      action: 'Conduct Fire Safety Drill',
      priority: 'medium',
      dueDate: '2024-10-20',
      assignedTo: 'Operations',
      category: 'Health & Safety'
    },
    {
      action: 'Submit ESR Notification',
      priority: 'high',
      dueDate: '2024-10-12',
      assignedTo: 'Finance',
      category: 'Tax & VAT'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Risk Mitigation',
      description: 'Reduce legal and financial risks with proactive compliance'
    },
    {
      icon: CheckCircle2,
      title: 'Audit Ready',
      description: 'Always prepared for internal and external audits'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Track compliance status across all areas in real-time'
    },
    {
      icon: Clock,
      title: 'Automated Alerts',
      description: 'Never miss deadlines with automatic notifications'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/features')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Compliance & Governance</h1>
            <p className="text-muted-foreground">
              Stay compliant with UAE regulations and industry standards
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {complianceSummary.complianceScore}% Compliant
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliance Score</CardDescription>
            <CardTitle className="text-3xl">{complianceSummary.complianceScore}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={complianceSummary.complianceScore} className="mb-2" />
            <p className="text-xs text-green-600">
              Excellent standing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Actions</CardDescription>
            <CardTitle className="text-3xl">{complianceSummary.pendingActions}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {complianceSummary.activeAudits} active audits
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Certifications</CardDescription>
            <CardTitle className="text-3xl">{complianceSummary.certifications}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-600">
              {complianceSummary.documentsExpiring} expiring soon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Incidents YTD</CardDescription>
            <CardTitle className="text-3xl">{complianceSummary.incidentsYTD}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              {complianceSummary.policyReviews} policy reviews completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Compliance Management?</CardTitle>
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
          <TabsTrigger value="regulations">Regulations</TabsTrigger>
          <TabsTrigger value="actions">Pending Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complianceFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(feature.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(feature.metrics).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground capitalize">{key}</p>
                          <p className="text-lg font-semibold">
                            {typeof value === 'boolean'
                              ? (value ? 'Yes' : 'No')
                              : typeof value === 'number' && value > 100
                                ? value.toLocaleString()
                                : value}
                            {key.includes('score') || key.includes('Rate') ? '%' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regulations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance Status</CardTitle>
              <CardDescription>Track compliance across all regulatory areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regulatoryCompliance.map((reg) => (
                  <div key={reg.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{reg.category}</h3>
                          <Badge
                            variant={reg.status === 'compliant' ? 'default' : 'secondary'}
                            className={reg.status === 'compliant' ? 'bg-green-600' : 'bg-amber-600'}
                          >
                            {reg.status === 'compliant' ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {reg.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {reg.regulations} regulations | Last reviewed: {reg.lastReview} | Next: {reg.nextReview}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{reg.score}%</p>
                      </div>
                    </div>
                    <Progress value={reg.score} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Compliance Actions</CardTitle>
              <CardDescription>Tasks requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingActions.map((action, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{action.action}</h3>
                        <Badge
                          variant="outline"
                          className={
                            action.priority === 'critical'
                              ? 'text-red-600 border-red-600'
                              : action.priority === 'high'
                                ? 'text-orange-600 border-orange-600'
                                : 'text-blue-600 border-blue-600'
                          }
                        >
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {action.category} • Assigned to: {action.assignedTo}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{action.dueDate}</p>
                      <p className="text-xs text-muted-foreground">Due date</p>
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
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Set up your compliance management system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Complete Compliance Audit</h3>
                <p className="text-sm text-muted-foreground">
                  Assess current compliance status across all areas
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Upload Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Import licenses, certifications, and compliance documents
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Set Up Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Configure expiry alerts and renewal reminders
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Train Your Team</h3>
                <p className="text-sm text-muted-foreground">
                  Enroll employees in compliance training programs
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
