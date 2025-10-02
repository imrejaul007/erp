'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  Droplet,
  Flame,
  ShoppingCart,
  XCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  AlertTriangle,
  Target
} from 'lucide-react';

// Sample data
const samplingSessions = [
  {
    id: 'SMP001',
    customerName: 'Ahmed Al Mansouri',
    customerType: 'Walk-in',
    date: '2024-10-02',
    time: '10:30 AM',
    productsShown: 5,
    productsTested: 3,
    testerUsed: '15ml',
    outcome: 'purchased',
    saleAmount: 850,
    staff: 'Fatima Hassan',
    location: 'Dubai Mall',
    feedback: null
  },
  {
    id: 'SMP002',
    customerName: 'Sarah Ahmed (Anonymous)',
    customerType: 'Walk-in',
    date: '2024-10-02',
    time: '11:15 AM',
    productsShown: 8,
    productsTested: 5,
    testerUsed: '25ml + 2g oud',
    outcome: 'not_purchased',
    saleAmount: 0,
    staff: 'Mohammed Ali',
    location: 'Dubai Mall',
    feedback: 'Price too high'
  },
  {
    id: 'SMP003',
    customerName: 'Khalid Rahman',
    customerType: 'Returning',
    date: '2024-10-02',
    time: '02:45 PM',
    productsShown: 3,
    productsTested: 2,
    testerUsed: '10ml',
    outcome: 'purchased',
    saleAmount: 1200,
    staff: 'Fatima Hassan',
    location: 'Dubai Mall',
    feedback: null
  },
  {
    id: 'SMP004',
    customerName: 'Anonymous Customer',
    customerType: 'Walk-in',
    date: '2024-10-01',
    time: '04:20 PM',
    productsShown: 6,
    productsTested: 4,
    testerUsed: '20ml + 3g oud',
    outcome: 'not_purchased',
    saleAmount: 0,
    staff: 'Mohammed Ali',
    location: 'Dubai Mall',
    feedback: 'Will decide later'
  }
];

const testerStockItems = [
  {
    id: 'TST001',
    productName: 'Royal Oud - Premium',
    productCode: 'RO-001',
    testerSize: '100ml',
    currentStock: 45,
    minLevel: 20,
    usageThisMonth: 155,
    conversionRate: 35,
    lastRefilled: '2024-09-28',
    status: 'good'
  },
  {
    id: 'TST002',
    productName: 'Cambodian Oud Chips',
    productCode: 'CO-003',
    testerSize: '50g',
    currentStock: 12,
    minLevel: 15,
    usageThisMonth: 88,
    conversionRate: 28,
    lastRefilled: '2024-09-25',
    status: 'low'
  },
  {
    id: 'TST003',
    productName: 'Rose Attar Supreme',
    productCode: 'RA-002',
    testerSize: '50ml',
    currentStock: 8,
    minLevel: 10,
    usageThisMonth: 92,
    conversionRate: 42,
    lastRefilled: '2024-09-20',
    status: 'critical'
  },
  {
    id: 'TST004',
    productName: 'Musk Al Haramain',
    productCode: 'MH-005',
    testerSize: '100ml',
    currentStock: 68,
    minLevel: 20,
    usageThisMonth: 72,
    conversionRate: 38,
    lastRefilled: '2024-09-30',
    status: 'good'
  }
];

const conversionStats = {
  totalSessions: 156,
  totalPurchased: 54,
  totalNotPurchased: 102,
  conversionRate: 34.6,
  avgSampleUsage: '18ml',
  totalRevenue: 45800,
  testerCost: 2340,
  roi: 1857
};

const lostSaleReasons = [
  { reason: 'Price too high', count: 38, percentage: 37.3 },
  { reason: "Didn't like fragrance", count: 24, percentage: 23.5 },
  { reason: 'Will decide later', count: 18, percentage: 17.6 },
  { reason: 'Found better elsewhere', count: 12, percentage: 11.8 },
  { reason: 'Wanted different size', count: 10, percentage: 9.8 }
];

export default function SamplingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('sessions');

  const getOutcomeColor = (outcome: string) => {
    return outcome === 'purchased' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sampling & Trial Management</h1>
          <p className="text-gray-600 mt-1">Track customer trials, tester usage, and conversion analytics</p>
        </div>
        <Button
          onClick={() => router.push('/sampling/new-session')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Sampling Session
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover-dark cursor-pointer transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{conversionStats.totalSessions}</p>
                <p className="text-sm text-gray-500 mt-1">This month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-dark cursor-pointer transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{conversionStats.conversionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-600">+5.2% vs last month</p>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-dark cursor-pointer transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tester ROI</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{conversionStats.roi}%</p>
                <p className="text-sm text-gray-500 mt-1">AED {conversionStats.testerCost} cost</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-dark cursor-pointer transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue from Trials</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">AED {conversionStats.totalRevenue?.toLocaleString() || "0"}</p>
                <p className="text-sm text-gray-500 mt-1">{conversionStats.totalPurchased} conversions</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <ShoppingCart className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sessions">Sampling Sessions</TabsTrigger>
          <TabsTrigger value="tester-stock">Tester Stock</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
          <TabsTrigger value="lost-sales">Lost Sale Analysis</TabsTrigger>
        </TabsList>

        {/* Sampling Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-gray-900">Recent Sampling Sessions</CardTitle>
                  <CardDescription className="text-gray-600">Track all customer trial sessions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search sessions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {samplingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/sampling/session/${session.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{session.customerName}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {session.id}
                          </Badge>
                          <Badge className={getOutcomeColor(session.outcome)}>
                            {session.outcome === 'purchased' ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Purchased
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Not Purchased
                              </>
                            )}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Date & Time</p>
                            <p className="text-gray-900 font-medium">{session.date} {session.time}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Products Tested</p>
                            <p className="text-gray-900 font-medium">{session.productsTested} of {session.productsShown}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Tester Used</p>
                            <p className="text-gray-900 font-medium">{session.testerUsed}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Staff</p>
                            <p className="text-gray-900 font-medium">{session.staff}</p>
                          </div>
                        </div>
                        {session.outcome === 'purchased' && (
                          <div className="mt-3 flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-green-600" />
                            <p className="text-sm font-medium text-green-600">
                              Sale: AED {session.saleAmount}
                            </p>
                          </div>
                        )}
                        {session.feedback && (
                          <div className="mt-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <p className="text-sm text-amber-600">
                              Reason: {session.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tester Stock Tab */}
        <TabsContent value="tester-stock" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-gray-900">Tester Stock Levels</CardTitle>
                  <CardDescription className="text-gray-600">Monitor and manage tester inventory</CardDescription>
                </div>
                <Button variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Refill Tester
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testerStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                          <Badge variant="secondary" className="text-xs">{item.productCode}</Badge>
                          <Badge className={getStockStatusColor(item.status)}>
                            {item.status === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {item.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Tester Size: {item.testerSize}</p>
                      </div>
                      <Button size="sm" variant="outline">Refill</Button>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Current Stock</p>
                        <p className="text-lg font-bold text-gray-900">{item.currentStock}ml</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Min Level</p>
                        <p className="text-gray-900 font-medium">{item.minLevel}ml</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Used This Month</p>
                        <p className="text-gray-900 font-medium">{item.usageThisMonth}ml</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Conversion Rate</p>
                        <p className="text-gray-900 font-medium">{item.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Refilled</p>
                        <p className="text-gray-900 font-medium">{item.lastRefilled}</p>
                      </div>
                    </div>
                    {/* Stock Level Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.status === 'critical' ? 'bg-red-600' :
                            item.status === 'low' ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${(item.currentStock / item.testerSize.replace(/\D/g, '')) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Conversion Funnel</CardTitle>
                <CardDescription className="text-gray-600">Trial to purchase journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Total Sessions</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{conversionStats.totalSessions}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Purchased</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{conversionStats.totalPurchased}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-gray-900">Not Purchased</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{conversionStats.totalNotPurchased}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Tester ROI Analysis</CardTitle>
                <CardDescription className="text-gray-600">Return on tester investment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Tester Cost</span>
                    <span className="text-xl font-bold text-gray-900">AED {conversionStats.testerCost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue Generated</span>
                    <span className="text-xl font-bold text-green-600">AED {conversionStats.totalRevenue?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-gray-900 font-medium">ROI</span>
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">{conversionStats.roi}%</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    For every AED 1 spent on testers, you earn AED {(conversionStats.roi / 100).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lost Sales Analysis Tab */}
        <TabsContent value="lost-sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Lost Sale Reasons Analysis</CardTitle>
              <CardDescription className="text-gray-600">Why customers didn't purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lostSaleReasons.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-medium">{item.reason}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{item.count} cases</span>
                        <span className="text-gray-900 font-bold">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900">Top Insight</h4>
                    <p className="text-sm text-amber-800 mt-1">
                      37.3% of lost sales are due to pricing. Consider offering mid-range alternatives or bundle deals.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
