'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Users,
  Target,
  Send,
  MessageSquare,
  Calendar,
  Gift,
  BarChart3,
  Heart,
  Star,
  TrendingUp,
  Mail,
  Phone,
  CheckCircle,
  Award
} from 'lucide-react';

export default function AdvancedCRMPage() {
  const router = useRouter();

  const crmFeatures = [
    {
      id: 'segmentation',
      title: 'Customer Segmentation',
      description: 'Divide customers into targeted groups for personalized marketing',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/crm-advanced/segmentation',
      status: 'active',
      features: [
        'Demographic segmentation',
        'Behavioral segmentation',
        'Purchase history groups',
        'RFM analysis',
        'Custom criteria builder',
        'Dynamic segments',
        'Segment analytics',
        'Export & integration'
      ],
      metrics: {
        totalSegments: 24,
        avgSegmentSize: 118,
        topSegment: 'VIP Buyers',
        automation: '85%'
      }
    },
    {
      id: 'campaigns',
      title: 'Marketing Campaigns',
      description: 'Create and manage multi-channel marketing campaigns',
      icon: Send,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/crm-advanced/campaigns',
      status: 'active',
      features: [
        'Email campaigns',
        'SMS campaigns',
        'WhatsApp campaigns',
        'Push notifications',
        'Campaign templates',
        'A/B testing',
        'Scheduling',
        'Performance tracking'
      ],
      metrics: {
        activeCampaigns: 8,
        monthlyReach: '12.5K',
        avgOpenRate: '42.5%',
        conversion: '8.2%'
      }
    },
    {
      id: 'feedback',
      title: 'Customer Feedback',
      description: 'Collect and analyze customer feedback and reviews',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/crm-advanced/feedback',
      status: 'active',
      features: [
        'Feedback forms',
        'Product reviews',
        'NPS surveys',
        'CSAT scoring',
        'Sentiment analysis',
        'Response management',
        'Trend analysis',
        'Action triggers'
      ],
      metrics: {
        monthlyFeedback: 385,
        avgRating: 4.7,
        npsScore: 68,
        responseRate: '78%'
      }
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Schedule and manage customer appointments and consultations',
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/features/crm-advanced/appointments',
      status: 'active',
      features: [
        'Online booking',
        'Calendar management',
        'Staff scheduling',
        'Automated reminders',
        'Rescheduling',
        'No-show tracking',
        'Service packages',
        'Customer history'
      ],
      metrics: {
        monthlyBookings: 245,
        showUpRate: '92%',
        avgDuration: '45min',
        satisfaction: '4.8/5'
      }
    },
    {
      id: 'loyalty-advanced',
      title: 'Advanced Loyalty',
      description: 'Sophisticated loyalty program with tiers and rewards',
      icon: Gift,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/features/crm-advanced/loyalty',
      status: 'active',
      features: [
        'Multi-tier program',
        'Points system',
        'Rewards catalog',
        'Birthday rewards',
        'Referral bonuses',
        'Expiry management',
        'Member portal',
        'Analytics dashboard'
      ],
      metrics: {
        members: 2847,
        activeRate: '68%',
        avgLTV: 'AED 12.5K',
        redemptionRate: '42%'
      }
    },
    {
      id: 'customer-journey',
      title: 'Customer Journey',
      description: 'Map and optimize the complete customer lifecycle',
      icon: BarChart3,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      path: '/features/crm-advanced/journey',
      status: 'active',
      features: [
        'Journey mapping',
        'Touchpoint tracking',
        'Lifecycle stages',
        'Conversion funnels',
        'Drop-off analysis',
        'Automated workflows',
        'Personalization',
        'ROI tracking'
      ],
      metrics: {
        journeys: 12,
        avgTouchpoints: 8.5,
        conversionRate: '15.3%',
        churnRate: '12%'
      }
    },
    {
      id: 'customer-service',
      title: 'Customer Service',
      description: 'Ticketing system for customer support and issue resolution',
      icon: Phone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/crm-advanced/service',
      status: 'active',
      features: [
        'Ticket management',
        'Multi-channel support',
        'SLA tracking',
        'Knowledge base',
        'Canned responses',
        'Priority queues',
        'Team assignment',
        'Performance metrics'
      ],
      metrics: {
        monthlyTickets: 156,
        avgResolutionTime: '4.2h',
        firstResponseTime: '12min',
        satisfaction: '4.6/5'
      }
    },
    {
      id: 'vip-management',
      title: 'VIP Management',
      description: 'Dedicated tools for managing high-value customers',
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      path: '/features/crm-advanced/vip',
      status: 'active',
      features: [
        'VIP identification',
        'Personal account managers',
        'Exclusive offers',
        'Priority support',
        'Event invitations',
        'Custom pricing',
        'Relationship notes',
        'Spend tracking'
      ],
      metrics: {
        vipCustomers: 156,
        revenueShare: '45%',
        retentionRate: '94%',
        avgSpend: 'AED 45K'
      }
    }
  ];

  const crmSummary = {
    totalCustomers: 2847,
    activeCustomers: 1923,
    vipCustomers: 156,
    avgLifetimeValue: 12450,
    retentionRate: 68.2,
    satisfactionScore: 4.7
  };

  const segmentPerformance = [
    { segment: 'VIP Elite', customers: 156, revenue: 1950000, ltv: 12500, retention: 94 },
    { segment: 'Regular Loyal', customers: 684, revenue: 1420000, ltv: 2076, retention: 82 },
    { segment: 'Occasional', customers: 1083, revenue: 680000, ltv: 628, retention: 45 },
    { segment: 'New', customers: 924, revenue: 270000, ltv: 292, retention: 28 }
  ];

  const campaignResults = [
    { campaign: 'Ramadan Special', sent: 2500, opened: 1175, clicked: 285, converted: 42, roi: 4.5 },
    { campaign: 'VIP Anniversary', sent: 156, opened: 142, clicked: 98, converted: 28, roi: 8.2 },
    { campaign: 'New Product Launch', sent: 1800, opened: 720, clicked: 156, converted: 18, roi: 3.2 },
    { campaign: 'Win-Back Campaign', sent: 850, opened: 298, clicked: 68, converted: 12, roi: 2.1 }
  ];

  const benefits = [
    {
      title: 'Personalized Marketing',
      description: 'Target customers with relevant messages based on their behavior',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Increase Retention',
      description: 'Keep customers coming back with loyalty programs and engagement',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Better Insights',
      description: 'Understand customer behavior and preferences deeply',
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      title: 'Automated Workflows',
      description: 'Save time with automated campaigns and follow-ups',
      icon: CheckCircle,
      color: 'text-green-600'
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
            <Users className="h-8 w-8 text-pink-600" />
            Advanced CRM
          </h1>
          <p className="text-muted-foreground">
            Customer segmentation, campaigns, feedback, appointments, and loyalty programs
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{crmSummary.totalCustomers?.toLocaleString() || "0"}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Heart className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{crmSummary.activeCustomers?.toLocaleString() || "0"}</div>
            <div className="text-sm text-gray-600">Active Customers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Award className="h-8 w-8 text-yellow-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{crmSummary.vipCustomers}</div>
            <div className="text-sm text-gray-600">VIP Customers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">AED {(crmSummary.avgLifetimeValue / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Avg LTV</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{crmSummary.retentionRate}%</div>
            <div className="text-sm text-gray-600">Retention Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Star className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{crmSummary.satisfactionScore}</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Advanced CRM?</CardTitle>
          <CardDescription>Build stronger customer relationships and increase loyalty</CardDescription>
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

      {/* Segment Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segment Performance</CardTitle>
          <CardDescription>Revenue and retention by customer segment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {segmentPerformance.map((segment, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">{segment.segment}</div>
                    <div className="text-sm text-gray-600">{segment.customers} customers</div>
                  </div>
                  <Badge className={
                    segment.retention >= 90 ? 'bg-green-100 text-green-800' :
                    segment.retention >= 70 ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }>
                    {segment.retention}% Retention
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Revenue</div>
                    <div className="font-bold text-green-600">AED {(segment.revenue / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Avg LTV</div>
                    <div className="font-bold text-purple-600">AED {segment.ltv?.toLocaleString() || "0"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Per Customer</div>
                    <div className="font-bold">AED {Math.round(segment.revenue / segment.customers)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaign Results</CardTitle>
          <CardDescription>Performance of recent marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaignResults.map((campaign, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-lg">{campaign.campaign}</div>
                  <Badge className="bg-purple-100 text-purple-800">
                    {campaign.roi}x ROI
                  </Badge>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Sent</div>
                    <div className="font-bold">{campaign.sent?.toLocaleString() || "0"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Opened</div>
                    <div className="font-bold text-blue-600">
                      {campaign.opened} ({((campaign.opened / campaign.sent) * 100).toFixed(1)}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Clicked</div>
                    <div className="font-bold text-purple-600">
                      {campaign.clicked} ({((campaign.clicked / campaign.opened) * 100).toFixed(1)}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Converted</div>
                    <div className="font-bold text-green-600">
                      {campaign.converted} ({((campaign.converted / campaign.clicked) * 100).toFixed(1)}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">ROI</div>
                    <div className="font-bold text-amber-600">{campaign.roi}x</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CRM Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {crmFeatures.map((feature) => {
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
          <CardTitle>Getting Started with Advanced CRM</CardTitle>
          <CardDescription>Build better customer relationships in 4 steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div className="font-semibold mb-1">Import Customers</div>
              <div className="text-sm text-gray-600">Upload existing customer data and history</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <div className="font-semibold mb-1">Create Segments</div>
              <div className="text-sm text-gray-600">Organize customers into targeted groups</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <div className="font-semibold mb-1">Launch Campaigns</div>
              <div className="text-sm text-gray-600">Send personalized marketing messages</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-amber-600">4</span>
              </div>
              <div className="font-semibold mb-1">Measure & Optimize</div>
              <div className="text-sm text-gray-600">Track results and improve performance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
