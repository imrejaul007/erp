'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Plug, Database, Cloud, ShoppingCart, CreditCard, Truck, MessageSquare, BarChart3,
  ArrowLeft, TrendingUp, Target, CheckCircle2, Activity, Zap, Link2
} from 'lucide-react';

export default function IntegrationsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const integrationSummary = {
    activeIntegrations: 24,
    dataSync: 15600,
    apiCalls: 125000,
    uptime: 99.8,
    connectedApps: 18,
    webhooksActive: 45,
    lastSync: '2 mins ago',
    syncErrors: 3
  };

  const integrationFeatures = [
    {
      id: 'ecommerce',
      title: 'E-Commerce Platforms',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/integrations/ecommerce',
      status: 'active',
      description: 'Connect to online marketplaces and shopping platforms',
      metrics: {
        platforms: 6,
        orders: 3456,
        syncRate: 98.5,
        revenue: 425000
      },
      partners: [
        { name: 'Noon', logo: '🌙', status: 'active', orders: 1245 },
        { name: 'Amazon.ae', logo: '📦', status: 'active', orders: 856 },
        { name: 'Namshi', logo: '👗', status: 'active', orders: 645 },
        { name: 'Mumzworld', logo: '👶', status: 'active', orders: 412 },
        { name: 'Dubizzle', logo: '🏪', status: 'active', orders: 198 },
        { name: 'Custom Store', logo: '🛒', status: 'active', orders: 100 }
      ],
      features: [
        'Real-time inventory sync across all platforms',
        'Automatic order import and fulfillment',
        'Unified product catalog management',
        'Price and stock level synchronization',
        'Multi-currency support (AED, USD, EUR)',
        'Customer data integration',
        'Return and refund processing',
        'Performance analytics per channel'
      ]
    },
    {
      id: 'payments',
      title: 'Payment Gateways',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/integrations/payments',
      status: 'active',
      description: 'Accept payments through multiple gateways',
      metrics: {
        gateways: 8,
        transactions: 8456,
        success: 97.8,
        volume: 1245000
      },
      partners: [
        { name: 'Stripe', logo: '💳', status: 'active', transactions: 3456 },
        { name: 'PayPal', logo: '💰', status: 'active', transactions: 2145 },
        { name: 'Telr', logo: '🏦', status: 'active', transactions: 1245 },
        { name: 'Network Intl', logo: '🌐', status: 'active', transactions: 856 },
        { name: 'Tabby (BNPL)', logo: '🐱', status: 'active', transactions: 456 },
        { name: 'Tamara (BNPL)', logo: '🌴', status: 'active', transactions: 298 }
      ],
      features: [
        'Multiple payment methods (card, wallet, BNPL)',
        'Secure PCI-DSS compliant processing',
        '3D Secure authentication',
        'Automatic payment reconciliation',
        'Refund and chargeback management',
        'Recurring billing support',
        'Multi-currency processing',
        'Real-time transaction notifications'
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping & Logistics',
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      path: '/features/integrations/shipping',
      status: 'active',
      description: 'Integrate with courier and logistics providers',
      metrics: {
        providers: 6,
        shipments: 2847,
        onTime: 94.5,
        avgDelivery: 2.3
      },
      partners: [
        { name: 'Aramex', logo: '📮', status: 'active', shipments: 1245 },
        { name: 'Fetchr', logo: '🚚', status: 'active', shipments: 856 },
        { name: 'Smsa Express', logo: '⚡', status: 'active', shipments: 456 },
        { name: 'DHL', logo: '🌍', status: 'active', shipments: 198 },
        { name: 'FedEx', logo: '✈️', status: 'active', shipments: 92 },
        { name: 'Emirates Post', logo: '🇦🇪', status: 'active', shipments: 0 }
      ],
      features: [
        'Automatic shipping label generation',
        'Real-time tracking updates',
        'Rate comparison across providers',
        'Bulk shipment processing',
        'Delivery confirmation notifications',
        'Cash on delivery (COD) support',
        'International shipping support',
        'Returns and reverse logistics'
      ]
    },
    {
      id: 'messaging',
      title: 'Messaging & Communication',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/integrations/messaging',
      status: 'active',
      description: 'SMS, WhatsApp, and email communication platforms',
      metrics: {
        channels: 5,
        messages: 15600,
        delivered: 98.2,
        response: 12.5
      },
      partners: [
        { name: 'WhatsApp Business', logo: '💬', status: 'active', messages: 8456 },
        { name: 'Twilio SMS', logo: '📱', status: 'active', messages: 4280 },
        { name: 'SendGrid Email', logo: '📧', status: 'active', messages: 2145 },
        { name: 'Mailchimp', logo: '📬', status: 'active', messages: 545 },
        { name: 'Interakt', logo: '🤝', status: 'active', messages: 174 }
      ],
      features: [
        'WhatsApp Business API integration',
        'Bulk SMS campaigns',
        'Transactional email delivery',
        'Marketing automation',
        'Two-way conversation support',
        'Template message management',
        'Delivery and read receipts',
        'Multi-language support (English/Arabic)'
      ]
    },
    {
      id: 'accounting',
      title: 'Accounting & Finance',
      icon: Database,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      path: '/features/integrations/accounting',
      status: 'active',
      description: 'Sync with accounting and bookkeeping software',
      metrics: {
        systems: 4,
        transactions: 12500,
        accuracy: 99.5,
        reconciled: 98.8
      },
      partners: [
        { name: 'Zoho Books', logo: '📚', status: 'active', sync: 'daily' },
        { name: 'QuickBooks', logo: '💼', status: 'active', sync: 'daily' },
        { name: 'Xero', logo: '📊', status: 'active', sync: 'daily' },
        { name: 'Tally', logo: '🧮', status: 'active', sync: 'daily' }
      ],
      features: [
        'Automatic invoice and receipt sync',
        'Bank transaction reconciliation',
        'Chart of accounts mapping',
        'Tax calculation and reporting',
        'Expense tracking integration',
        'Multi-currency accounting',
        'Financial statement generation',
        'Audit trail maintenance'
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & BI Tools',
      icon: BarChart3,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
      path: '/features/integrations/analytics',
      status: 'active',
      description: 'Connect to business intelligence and analytics platforms',
      metrics: {
        tools: 4,
        reports: 856,
        queries: 25600,
        users: 28
      },
      partners: [
        { name: 'Google Analytics', logo: '📈', status: 'active', events: 125600 },
        { name: 'Power BI', logo: '📊', status: 'active', reports: 456 },
        { name: 'Tableau', logo: '📉', status: 'active', dashboards: 28 },
        { name: 'Metabase', logo: '🔍', status: 'active', queries: 2145 }
      ],
      features: [
        'Real-time data export',
        'Custom report generation',
        'KPI dashboard integration',
        'Automated data pipelines',
        'SQL query support',
        'Scheduled report delivery',
        'Data visualization tools',
        'Cross-platform analytics'
      ]
    },
    {
      id: 'social',
      title: 'Social Media',
      icon: Link2,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/features/integrations/social',
      status: 'active',
      description: 'Integrate with social media platforms for marketing',
      metrics: {
        platforms: 5,
        followers: 28500,
        engagement: 6.8,
        posts: 156
      },
      partners: [
        { name: 'Instagram', logo: '📷', status: 'active', followers: 15600 },
        { name: 'Facebook', logo: '👥', status: 'active', followers: 9200 },
        { name: 'TikTok', logo: '🎵', status: 'active', followers: 2400 },
        { name: 'Snapchat', logo: '👻', status: 'active', followers: 1100 },
        { name: 'Twitter/X', logo: '🐦', status: 'active', followers: 200 }
      ],
      features: [
        'Instagram Shopping catalog sync',
        'Facebook Shop integration',
        'Social media post scheduling',
        'Product tagging in posts',
        'Comment and message management',
        'Social commerce analytics',
        'Influencer collaboration tracking',
        'Ad campaign integration'
      ]
    },
    {
      id: 'api',
      title: 'Custom API & Webhooks',
      icon: Cloud,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      path: '/features/integrations/api',
      status: 'active',
      description: 'Build custom integrations with REST API',
      metrics: {
        endpoints: 85,
        calls: 125000,
        uptime: 99.8,
        webhooks: 45
      },
      partners: [
        { name: 'REST API', logo: '🔌', status: 'active', version: 'v2.1' },
        { name: 'GraphQL', logo: '⚡', status: 'beta', version: 'v1.0' },
        { name: 'Webhooks', logo: '🪝', status: 'active', active: 45 },
        { name: 'Zapier', logo: '⚙️', status: 'active', zaps: 28 }
      ],
      features: [
        'RESTful API with JSON responses',
        'OAuth 2.0 authentication',
        'Rate limiting and throttling',
        'Comprehensive API documentation',
        'Webhook event notifications',
        'Sandbox environment for testing',
        'API key management',
        'Developer dashboard and logs'
      ]
    }
  ];

  const syncStatus = [
    {
      integration: 'Noon Marketplace',
      type: 'E-Commerce',
      lastSync: '2 mins ago',
      status: 'success',
      records: 1245,
      nextSync: '30 mins'
    },
    {
      integration: 'Stripe Payments',
      type: 'Payment',
      lastSync: '5 mins ago',
      status: 'success',
      records: 856,
      nextSync: '15 mins'
    },
    {
      integration: 'Aramex Shipping',
      type: 'Logistics',
      lastSync: '8 mins ago',
      status: 'success',
      records: 245,
      nextSync: '1 hour'
    },
    {
      integration: 'WhatsApp Business',
      type: 'Messaging',
      lastSync: '1 min ago',
      status: 'success',
      records: 456,
      nextSync: '10 mins'
    },
    {
      integration: 'Zoho Books',
      type: 'Accounting',
      lastSync: '15 mins ago',
      status: 'warning',
      records: 1240,
      nextSync: '1 hour'
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Seamless Sync',
      description: 'Real-time data synchronization across all platforms'
    },
    {
      icon: Target,
      title: 'Centralized Control',
      description: 'Manage all integrations from one unified dashboard'
    },
    {
      icon: TrendingUp,
      title: 'Scale Easily',
      description: 'Add new channels and platforms as your business grows'
    },
    {
      icon: Activity,
      title: 'Monitor Performance',
      description: 'Track integration health and sync status in real-time'
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
            <h1 className="text-3xl font-bold">Integrations & API</h1>
            <p className="text-muted-foreground">
              Connect with third-party platforms and build custom integrations
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {integrationSummary.activeIntegrations} Active
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Integrations</CardDescription>
            <CardTitle className="text-3xl">{integrationSummary.activeIntegrations}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {integrationSummary.connectedApps} connected apps
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>API Calls (Today)</CardDescription>
            <CardTitle className="text-3xl">{(integrationSummary.apiCalls / 1000).toFixed(0)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              {integrationSummary.uptime}% uptime
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Data Synced</CardDescription>
            <CardTitle className="text-3xl">{integrationSummary.dataSync?.toLocaleString() || "0"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Last sync: {integrationSummary.lastSync}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Webhooks</CardDescription>
            <CardTitle className="text-3xl">{integrationSummary.webhooksActive}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-600">
              {integrationSummary.syncErrors} sync errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Integrations?</CardTitle>
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
          <TabsTrigger value="sync">Sync Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrationFeatures.map((feature) => (
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
                          <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-lg font-semibold">
                            {typeof value === 'number' && value > 100 ? value?.toLocaleString() || "0" : value}
                            {key.includes('Rate') || key.includes('success') || key.includes('accuracy') || key.includes('reconciled') || key.includes('onTime') || key.includes('syncRate') || key.includes('delivered') || key.includes('response') || key.includes('engagement') ? '%' : ''}
                            {key.includes('avgDelivery') ? ' days' : ''}
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

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Status</CardTitle>
              <CardDescription>Monitor integration synchronization status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncStatus.map((sync) => (
                  <div key={sync.integration} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{sync.integration}</h3>
                        <Badge
                          variant={sync.status === 'success' ? 'default' : 'secondary'}
                          className={sync.status === 'success' ? 'bg-green-600' : 'bg-amber-600'}
                        >
                          {sync.status === 'success' ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <Activity className="h-3 w-3 mr-1" />
                          )}
                          {sync.status}
                        </Badge>
                        <Badge variant="outline">{sync.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last sync: {sync.lastSync} • {sync.records?.toLocaleString() || "0"} records • Next: {sync.nextSync}
                      </p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Sync Now
                      </Button>
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
          <CardDescription>Set up your integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Choose Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Select the platform you want to connect
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Authenticate</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your account with secure OAuth
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Configure Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Set sync preferences and mapping rules
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Start Syncing</h3>
                <p className="text-sm text-muted-foreground">
                  Enable integration and monitor sync status
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
