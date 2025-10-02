'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Smartphone,
  ShoppingCart,
  Scan,
  BarChart3,
  Users,
  Package,
  Download,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Zap
} from 'lucide-react';

export default function MobileAppsPage() {
  const router = useRouter();

  const mobileApps = [
    {
      id: 'mobile-pos',
      title: 'Mobile POS',
      description: 'Full-featured point of sale on any mobile device',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/mobile/pos',
      status: 'available',
      downloads: '2.5K+',
      rating: 4.8,
      features: [
        'Process sales anywhere',
        'Accept payments (cash, card, digital)',
        'Customer lookup & management',
        'Real-time inventory sync',
        'Receipt printing & email',
        'Offline mode support',
        'Multi-currency support',
        'Sales reports & analytics'
      ],
      platforms: ['iOS', 'Android'],
      metrics: {
        dailyTransactions: 156,
        avgResponseTime: '1.2s',
        uptime: '99.8%',
        activeUsers: 45
      }
    },
    {
      id: 'warehouse-scanner',
      title: 'Warehouse Scanner',
      description: 'Barcode scanning app for inventory management',
      icon: Scan,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/mobile/scanner',
      status: 'available',
      downloads: '1.8K+',
      rating: 4.7,
      features: [
        'Fast barcode scanning',
        'Stock level updates',
        'Receive inventory',
        'Stock transfers',
        'Inventory audits',
        'Batch scanning',
        'Photo capture',
        'Location tracking'
      ],
      platforms: ['iOS', 'Android'],
      metrics: {
        dailyScans: 2450,
        avgScanTime: '0.8s',
        accuracy: '99.2%',
        activeUsers: 28
      }
    },
    {
      id: 'manager-dashboard',
      title: 'Manager Dashboard',
      description: 'Real-time business insights on the go',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/mobile/manager',
      status: 'available',
      downloads: '950+',
      rating: 4.9,
      features: [
        'Live sales dashboard',
        'Performance KPIs',
        'Staff management',
        'Approval workflows',
        'Alerts & notifications',
        'Reports on demand',
        'Multi-location view',
        'Secure access control'
      ],
      platforms: ['iOS', 'Android'],
      metrics: {
        dailyLogins: 32,
        avgSessionTime: '12m',
        reportViews: 185,
        activeManagers: 12
      }
    },
    {
      id: 'sales-rep',
      title: 'Sales Rep App',
      description: 'Field sales and customer relationship management',
      icon: Users,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/features/mobile/sales-rep',
      status: 'available',
      downloads: '680+',
      rating: 4.6,
      features: [
        'Customer visit tracking',
        'Order placement',
        'Product catalog',
        'Route optimization',
        'GPS check-in',
        'Photo documentation',
        'Commission tracking',
        'Lead management'
      ],
      platforms: ['iOS', 'Android'],
      metrics: {
        dailyVisits: 78,
        ordersPlaced: 42,
        avgOrderValue: 'AED 3,850',
        activeReps: 15
      }
    },
    {
      id: 'inventory-checker',
      title: 'Inventory Checker',
      description: 'Quick stock lookup and alerts',
      icon: Package,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      path: '/features/mobile/inventory-checker',
      status: 'available',
      downloads: '1.2K+',
      rating: 4.5,
      features: [
        'Quick stock search',
        'Low stock alerts',
        'Location finder',
        'Price lookup',
        'Reorder suggestions',
        'Transfer requests',
        'Movement history',
        'Expiry tracking'
      ],
      platforms: ['iOS', 'Android'],
      metrics: {
        dailyLookups: 845,
        avgLookupTime: '2.1s',
        alertsGenerated: 34,
        activeUsers: 52
      }
    },
    {
      id: 'customer-app',
      title: 'Customer App',
      description: 'Customer-facing mobile shopping experience',
      icon: Smartphone,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/features/mobile/customer-app',
      status: 'coming-soon',
      downloads: 'Coming Soon',
      rating: 0,
      features: [
        'Browse products',
        'Place orders',
        'Track deliveries',
        'Loyalty points',
        'Wishlist',
        'Push notifications',
        'Order history',
        'Customer support chat'
      ],
      platforms: ['iOS', 'Android'],
      metrics: {
        expectedLaunch: 'Q1 2025',
        betaUsers: 50,
        preRegistrations: 450,
        targetUsers: '5K+'
      }
    }
  ];

  const benefits = [
    {
      title: 'Work Anywhere',
      description: 'Manage your business from anywhere with full mobile functionality',
      icon: Zap,
      color: 'text-blue-600'
    },
    {
      title: 'Real-Time Sync',
      description: 'All data syncs instantly across all devices and locations',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Offline Support',
      description: 'Continue working even without internet connection',
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      title: 'Fast & Responsive',
      description: 'Native apps optimized for speed and performance',
      icon: Clock,
      color: 'text-amber-600'
    }
  ];

  const usageStats = {
    totalDownloads: 7800,
    activeDevices: 192,
    dailyTransactions: 2751,
    avgRating: 4.7,
    monthlyGrowth: 18.5
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Smartphone className="h-8 w-8 text-blue-600" />
            Mobile Apps
          </h1>
          <p className="text-muted-foreground">
            Mobile POS, warehouse scanner, manager dashboard, and field sales apps
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Download className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{usageStats.totalDownloads.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Downloads</div>
            <div className="text-xs text-green-600 mt-1">+{usageStats.monthlyGrowth}% this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Smartphone className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold">{usageStats.activeDevices}</div>
            <div className="text-sm text-gray-600">Active Devices</div>
            <div className="text-xs text-gray-500 mt-1">Currently in use</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold">{usageStats.dailyTransactions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Daily Transactions</div>
            <div className="text-xs text-gray-500 mt-1">Across all apps</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Star className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-2xl font-bold">{usageStats.avgRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="text-xs text-gray-500 mt-1">User feedback</div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Mobile Apps?</CardTitle>
          <CardDescription>Transform your business with mobile-first technology</CardDescription>
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

      {/* Mobile Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mobileApps.map((app) => {
          const Icon = app.icon;
          return (
            <Card
              key={app.id}
              className={`cursor-pointer hover:shadow-lg transition-all ${
                app.status === 'coming-soon' ? 'opacity-75' : ''
              }`}
              onClick={() => app.status === 'available' && router.push(app.path)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-3 rounded-lg ${app.bgColor}`}>
                    <Icon className={`h-6 w-6 ${app.color}`} />
                  </div>
                  <Badge className={
                    app.status === 'available' ? 'bg-green-100 text-green-800' :
                    'bg-amber-100 text-amber-800'
                  }>
                    {app.status === 'available' ? 'Available' : 'Coming Soon'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{app.title}</CardTitle>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {app.status === 'available' ? (
                  <>
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                      <div>
                        <div className="text-sm text-gray-600">Downloads</div>
                        <div className="font-bold">{app.downloads}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Rating</div>
                        <div className="font-bold flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          {app.rating}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Platforms</div>
                        <div className="font-bold">{app.platforms.join(' • ')}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Key Metrics:</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(app.metrics).map(([key, value], idx) => (
                          <div key={idx}>
                            <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                            <span className="font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Key Features:</div>
                      <div className="space-y-1">
                        {app.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {feature}
                          </div>
                        ))}
                        {app.features.length > 4 && (
                          <div className="text-sm text-blue-600 font-medium">
                            +{app.features.length - 4} more features
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4 pb-4 border-b">
                      <div className="text-sm text-gray-600 mb-2">Expected Launch</div>
                      <div className="font-bold text-lg">{app.metrics.expectedLaunch}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600">Beta Users</div>
                        <div className="font-bold">{app.metrics.betaUsers}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Pre-registered</div>
                        <div className="font-bold text-green-600">{app.metrics.preRegistrations}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Planned Features:</div>
                      <div className="space-y-1">
                        {app.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            {feature}
                          </div>
                        ))}
                        {app.features.length > 4 && (
                          <div className="text-sm text-blue-600 font-medium">
                            +{app.features.length - 4} more features
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Pre-Register Now
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>How to deploy mobile apps to your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div className="font-semibold mb-1">Download Apps</div>
              <div className="text-sm text-gray-600">Get apps from App Store or Google Play</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <div className="font-semibold mb-1">Configure Access</div>
              <div className="text-sm text-gray-600">Set up user accounts and permissions</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <div className="font-semibold mb-1">Train Your Team</div>
              <div className="text-sm text-gray-600">Provide training and documentation</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-amber-600">4</span>
              </div>
              <div className="font-semibold mb-1">Go Live</div>
              <div className="text-sm text-gray-600">Start using apps in daily operations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Download Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full bg-black hover:bg-gray-800">
                <Download className="h-4 w-4 mr-2" />
                Download on App Store
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Get it on Google Play
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="text-blue-600 cursor-pointer hover:underline">User Guides</div>
              <div className="text-blue-600 cursor-pointer hover:underline">Video Tutorials</div>
              <div className="text-blue-600 cursor-pointer hover:underline">FAQ</div>
              <div className="text-blue-600 cursor-pointer hover:underline">Troubleshooting</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="text-blue-600 cursor-pointer hover:underline">Contact Support</div>
              <div className="text-blue-600 cursor-pointer hover:underline">Submit Feedback</div>
              <div className="text-blue-600 cursor-pointer hover:underline">Report a Bug</div>
              <div className="text-blue-600 cursor-pointer hover:underline">Request a Feature</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
