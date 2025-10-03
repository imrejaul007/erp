'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RefreshCw,
  Package,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Download,
  Gift,
  Star,
  Truck,
  ArrowLeft} from 'lucide-react';

interface Subscription {
  id: string;
  subscriptionNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  products: {
    name: string;
    quantity: number;
    nextDelivery: string;
  }[];
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  monthlyValue: number;
  startDate: string;
  nextBillingDate: string;
  nextDeliveryDate: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  autoRenewal: boolean;
  deliveryAddress: string;
  totalOrders: number;
  lifetimeValue: number;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');

  // Mock data
  const subscriptions: Subscription[] = [
    {
      id: '1',
      subscriptionNumber: 'SUB-2024-001',
      customer: {
        name: 'Ahmed Al Mansoori',
        email: 'ahmed@example.com',
        phone: '+971501234567',
      },
      tier: 'platinum',
      products: [
        { name: 'Royal Oud 50ml', quantity: 1, nextDelivery: '2024-02-01' },
        { name: 'Premium Incense Set', quantity: 2, nextDelivery: '2024-02-01' },
      ],
      billingCycle: 'monthly',
      monthlyValue: 850.0,
      startDate: '2023-06-01',
      nextBillingDate: '2024-02-01',
      nextDeliveryDate: '2024-02-01',
      status: 'active',
      autoRenewal: true,
      deliveryAddress: 'Dubai Marina, Tower 1, Apt 1205',
      totalOrders: 8,
      lifetimeValue: 6800.0,
    },
    {
      id: '2',
      subscriptionNumber: 'SUB-2024-002',
      customer: {
        name: 'Fatima Hassan',
        email: 'fatima@example.com',
        phone: '+971509876543',
      },
      tier: 'gold',
      products: [
        { name: 'Attar Discovery Box', quantity: 1, nextDelivery: '2024-02-05' },
        { name: 'Oud Chips 100g', quantity: 1, nextDelivery: '2024-02-05' },
      ],
      billingCycle: 'monthly',
      monthlyValue: 450.0,
      startDate: '2023-09-15',
      nextBillingDate: '2024-02-15',
      nextDeliveryDate: '2024-02-05',
      status: 'active',
      autoRenewal: true,
      deliveryAddress: 'Abu Dhabi, Al Reem Island, Gate Tower',
      totalOrders: 5,
      lifetimeValue: 2250.0,
    },
    {
      id: '3',
      subscriptionNumber: 'SUB-2024-003',
      customer: {
        name: 'Mohammed Ali',
        email: 'mohammed@example.com',
        phone: '+971507654321',
      },
      tier: 'silver',
      products: [
        { name: 'Essential Oil Collection 30ml', quantity: 1, nextDelivery: '2024-02-10' },
      ],
      billingCycle: 'monthly',
      monthlyValue: 250.0,
      startDate: '2023-11-01',
      nextBillingDate: '2024-02-01',
      nextDeliveryDate: '2024-02-10',
      status: 'paused',
      autoRenewal: false,
      deliveryAddress: 'Sharjah, Al Majaz 2',
      totalOrders: 3,
      lifetimeValue: 750.0,
    },
    {
      id: '4',
      subscriptionNumber: 'SUB-2024-004',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+971503344556',
      },
      tier: 'bronze',
      products: [
        { name: 'Beginner Perfume Sampler', quantity: 1, nextDelivery: '2024-02-15' },
      ],
      billingCycle: 'monthly',
      monthlyValue: 150.0,
      startDate: '2024-01-01',
      nextBillingDate: '2024-02-01',
      nextDeliveryDate: '2024-02-15',
      status: 'active',
      autoRenewal: true,
      deliveryAddress: 'Dubai, JBR, Beach Residences',
      totalOrders: 1,
      lifetimeValue: 150.0,
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return '💎';
      case 'gold':
        return '🏆';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
      default:
        return '📦';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (activeTab === 'all') return true;
    return sub.status === activeTab;
  });

  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active').length;
  const monthlyRecurringRevenue = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + s.monthlyValue, 0);
  const totalLifetimeValue = subscriptions.reduce((sum, s) => sum + s.lifetimeValue, 0);
  const avgSubscriptionValue = monthlyRecurringRevenue / activeSubscriptions || 0;

  return (
    <div className="space-y-6">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Subscription Sales
          </h1>
          <p className="text-gray-600 mt-2">
            Monthly oud & perfume delivery club with recurring billing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-600">
            <Plus className="mr-2 h-4 w-4" />
            New Subscription
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <RefreshCw className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-gray-600 mt-1">of {totalSubscriptions} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {monthlyRecurringRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Subscription Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {avgSubscriptionValue.toFixed(0)}</div>
            <p className="text-xs text-gray-600 mt-1">Per customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Value</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalLifetimeValue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Tiers</CardTitle>
          <CardDescription>Distribution across membership levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['platinum', 'gold', 'silver', 'bronze'].map((tier) => {
              const count = subscriptions.filter((s) => s.tier === tier).length;
              const revenue = subscriptions
                .filter((s) => s.tier === tier && s.status === 'active')
                .reduce((sum, s) => sum + s.monthlyValue, 0);
              return (
                <Card key={tier} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getTierIcon(tier)}</span>
                      <Badge className={getTierColor(tier)}>
                        {tier.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">{count}</div>
                    <p className="text-sm text-gray-600">
                      AED {revenue.toLocaleString()}/mo
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>All subscription plans and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredSubscriptions.map((sub) => (
                <Card key={sub.id} className="border-l-4 border-l-violet-500">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{sub.customer.name}</h3>
                          <Badge className={getStatusColor(sub.status)}>
                            {sub.status.toUpperCase()}
                          </Badge>
                          <Badge className={getTierColor(sub.tier)}>
                            {getTierIcon(sub.tier)} {sub.tier.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{sub.billingCycle}</Badge>
                          {sub.autoRenewal && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Auto-Renew
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{sub.subscriptionNumber}</span>
                          <span>{sub.customer.email}</span>
                          <span>{sub.customer.phone}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Monthly Value</p>
                        <p className="text-2xl font-bold text-violet-600">
                          AED {sub.monthlyValue.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-semibold">
                          {new Date(sub.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="font-semibold">{sub.totalOrders}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Lifetime Value</p>
                        <p className="font-semibold">AED {sub.lifetimeValue.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Avg Order Value</p>
                        <p className="font-semibold">
                          AED {(sub.lifetimeValue / sub.totalOrders).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Subscription Products ({sub.products.length})
                      </p>
                      <div className="space-y-2">
                        {sub.products.map((product, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Next Delivery</p>
                              <p className="font-medium">
                                {new Date(product.nextDelivery).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Billing & Delivery */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <p className="font-medium text-blue-900">Next Billing</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {new Date(sub.nextBillingDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          AED {sub.monthlyValue.toFixed(2)} will be charged
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="h-5 w-5 text-green-600" />
                          <p className="font-medium text-green-900">Next Delivery</p>
                        </div>
                        <p className="text-2xl font-bold text-green-900">
                          {new Date(sub.nextDeliveryDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-green-700 mt-1">{sub.deliveryAddress}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {sub.status === 'active' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-violet-500 to-fuchsia-600"
                          >
                            <Gift className="mr-2 h-4 w-4" />
                            Process Delivery
                          </Button>
                          <Button size="sm" variant="outline">
                            <Clock className="mr-2 h-4 w-4" />
                            Pause Subscription
                          </Button>
                        </>
                      )}
                      {sub.status === 'paused' && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Resume Subscription
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Edit Details
                      </Button>
                      <Button size="sm" variant="outline">
                        View History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredSubscriptions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <RefreshCw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No subscriptions found in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Insights</CardTitle>
          <CardDescription>Performance metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Strong Retention</p>
              <p className="text-sm text-green-700">
                {((activeSubscriptions / totalSubscriptions) * 100).toFixed(0)}% subscription
                retention rate. Excellent customer loyalty!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Star className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-purple-900">Premium Tier Opportunity</p>
              <p className="text-sm text-purple-700">
                Silver & Bronze subscribers could be upsold to Gold tier with exclusive products.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Revenue Forecast</p>
              <p className="text-sm text-blue-700">
                Based on current subscriptions, projected annual recurring revenue: AED{' '}
                {(monthlyRecurringRevenue * 12).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
