'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Gift,
  Heart,
  Users,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Share2,
  ShoppingCart,
  Star,
  ArrowLeft} from 'lucide-react';

interface RegistryItem {
  id: string;
  product: {
    name: string;
    sku: string;
    price: number;
    image?: string;
  };
  quantity: number;
  purchased: number;
  remaining: number;
  priority: 'high' | 'medium' | 'low';
}

interface GiftRegistry {
  id: string;
  registryNumber: string;
  type: 'wedding' | 'corporate' | 'birthday' | 'anniversary' | 'custom';
  title: string;
  creator: {
    name: string;
    email: string;
    phone: string;
  };
  eventDate: string;
  status: 'active' | 'completed' | 'expired';
  items: RegistryItem[];
  totalValue: number;
  purchasedValue: number;
  contributors: number;
  views: number;
  shareLink: string;
  giftWrap: boolean;
  personalizedMessage: string;
  bulkDiscount: number;
  createdDate: string;
}

export default function GiftRegistryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');

  // Mock data
  const registries: GiftRegistry[] = [
    {
      id: '1',
      registryNumber: 'REG-2024-001',
      type: 'wedding',
      title: 'Ahmed & Fatima Wedding Registry',
      creator: {
        name: 'Ahmed Al Mansoori',
        email: 'ahmed@example.com',
        phone: '+971501234567',
      },
      eventDate: '2024-03-15',
      status: 'active',
      items: [
        {
          id: 'I1',
          product: { name: 'Royal Oud Perfume 100ml', sku: 'PERF-ROYAL-100ML', price: 850 },
          quantity: 5,
          purchased: 3,
          remaining: 2,
          priority: 'high',
        },
        {
          id: 'I2',
          product: { name: 'Attar Gift Set (3pc)', sku: 'GIFT-ATTAR-3PC', price: 450 },
          quantity: 10,
          purchased: 6,
          remaining: 4,
          priority: 'high',
        },
        {
          id: 'I3',
          product: { name: 'Oud Incense Burner - Premium', sku: 'BURN-PREM-GOLD', price: 320 },
          quantity: 3,
          purchased: 2,
          remaining: 1,
          priority: 'medium',
        },
        {
          id: 'I4',
          product: { name: 'Decorative Oud Box', sku: 'BOX-DECOR-LG', price: 180 },
          quantity: 8,
          purchased: 0,
          remaining: 8,
          priority: 'low',
        },
      ],
      totalValue: 8750,
      purchasedValue: 5570,
      contributors: 9,
      views: 124,
      shareLink: 'https://oud-erp.com/registry/REG-2024-001',
      giftWrap: true,
      personalizedMessage: 'Thank you for celebrating our special day with us!',
      bulkDiscount: 15,
      createdDate: '2024-01-10',
    },
    {
      id: '2',
      registryNumber: 'REG-2024-002',
      type: 'corporate',
      title: 'XYZ Corporation - Client Appreciation Gifts',
      creator: {
        name: 'Sarah Johnson',
        email: 'sarah@xyzcorp.com',
        phone: '+971509876543',
      },
      eventDate: '2024-02-28',
      status: 'active',
      items: [
        {
          id: 'I5',
          product: { name: 'Executive Oud Gift Set', sku: 'CORP-EXEC-SET', price: 650 },
          quantity: 50,
          purchased: 25,
          remaining: 25,
          priority: 'high',
        },
        {
          id: 'I6',
          product: { name: 'Premium Business Card Holder', sku: 'ACC-CARD-PREM', price: 120 },
          quantity: 50,
          purchased: 50,
          remaining: 0,
          priority: 'high',
        },
      ],
      totalValue: 38500,
      purchasedValue: 22250,
      contributors: 1,
      views: 3,
      shareLink: 'https://oud-erp.com/registry/REG-2024-002',
      giftWrap: true,
      personalizedMessage: 'Premium corporate gifts for valued clients',
      bulkDiscount: 25,
      createdDate: '2024-01-15',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'wedding':
        return 'bg-pink-100 text-pink-800';
      case 'corporate':
        return 'bg-blue-100 text-blue-800';
      case 'birthday':
        return 'bg-yellow-100 text-yellow-800';
      case 'anniversary':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wedding':
        return '💍';
      case 'corporate':
        return '💼';
      case 'birthday':
        return '🎂';
      case 'anniversary':
        return '💝';
      default:
        return '🎁';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRegistries = registries.filter((reg) => {
    if (activeTab === 'all') return true;
    return reg.status === activeTab;
  });

  const totalRegistries = registries.length;
  const activeRegistries = registries.filter((r) => r.status === 'active').length;
  const totalValue = registries.reduce((sum, r) => sum + r.totalValue, 0);
  const purchasedValue = registries.reduce((sum, r) => sum + r.purchasedValue, 0);
  const completionRate = ((purchasedValue / totalValue) * 100).toFixed(1);

  return (
    <div className="space-y-6">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Gift Registry
          </h1>
          <p className="text-gray-600 mt-2">
            Wedding registries, corporate gifting, and bulk gift programs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-gradient-to-r from-pink-500 to-rose-600">
            <Plus className="mr-2 h-4 w-4" />
            Create Registry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Registries</CardTitle>
            <Gift className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRegistries}</div>
            <p className="text-xs text-gray-600 mt-1">of {totalRegistries} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalValue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">All registries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchased</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {purchasedValue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">{completionRate}% fulfilled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contributors</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registries.reduce((sum, r) => sum + r.contributors, 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Gift buyers</p>
          </CardContent>
        </Card>
      </div>

      {/* Registries List */}
      <Card>
        <CardHeader>
          <CardTitle>Gift Registries</CardTitle>
          <CardDescription>All gift registries and their fulfillment status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredRegistries.map((registry) => {
                const completionPercent = (
                  (registry.purchasedValue / registry.totalValue) *
                  100
                ).toFixed(1);
                const totalItems = registry.items.reduce((sum, i) => sum + i.quantity, 0);
                const purchasedItems = registry.items.reduce((sum, i) => sum + i.purchased, 0);

                return (
                  <Card key={registry.id} className="border-l-4 border-l-pink-500">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{registry.title}</h3>
                            <Badge className={getTypeColor(registry.type)}>
                              {getTypeIcon(registry.type)} {registry.type.toUpperCase()}
                            </Badge>
                            {registry.status === 'active' && (
                              <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                            )}
                            {registry.giftWrap && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Gift className="h-3 w-3 mr-1" />
                                Gift Wrap
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{registry.registryNumber}</span>
                            <span>{registry.creator.name}</span>
                            <span>Event: {new Date(registry.eventDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Completion</p>
                          <p className="text-2xl font-bold text-pink-600">{completionPercent}%</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Fulfillment Progress</span>
                          <span className="font-medium">
                            {purchasedItems} / {totalItems} items
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-600"
                            style={{ width: `${completionPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-green-600 font-medium">
                            Purchased: AED {registry.purchasedValue.toLocaleString()}
                          </span>
                          <span className="text-gray-600 font-medium">
                            Remaining: AED{' '}
                            {(registry.totalValue - registry.purchasedValue).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Total Items</p>
                          <p className="font-semibold">{registry.items.length} products</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Contributors</p>
                          <p className="font-semibold">{registry.contributors} people</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Registry Views</p>
                          <p className="font-semibold">{registry.views}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Bulk Discount</p>
                          <p className="font-semibold text-green-600">{registry.bulkDiscount}%</p>
                        </div>
                      </div>

                      {/* Registry Items */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Registry Items ({registry.items.length})
                        </p>
                        <div className="space-y-2">
                          {registry.items.slice(0, 4).map((item) => {
                            const itemPercent = (item.purchased / item.quantity) * 100;
                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium">{item.product.name}</p>
                                    <Badge className={getPriorityColor(item.priority)}>
                                      {item.priority}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {item.product.sku} · AED {item.product.price.toFixed(2)} each
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-pink-500"
                                        style={{ width: `${itemPercent}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-600 w-24 text-right">
                                      {item.purchased} / {item.quantity}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  {item.remaining > 0 ? (
                                    <Badge variant="outline">
                                      {item.remaining} remaining
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Complete
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {registry.items.length > 4 && (
                            <p className="text-sm text-blue-600 font-medium text-center">
                              +{registry.items.length - 4} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Personalized Message */}
                      {registry.personalizedMessage && (
                        <div className="bg-pink-50 rounded-lg p-4 mb-4 border border-pink-200">
                          <div className="flex items-start gap-2">
                            <Heart className="h-5 w-5 text-pink-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-pink-900">
                                Personal Message
                              </p>
                              <p className="text-sm text-pink-700">{registry.personalizedMessage}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-pink-500 to-rose-600"
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Registry
                        </Button>
                        <Button size="sm" variant="outline">
                          <Package className="mr-2 h-4 w-4" />
                          View All Items
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit Registry
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Download List
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredRegistries.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No gift registries found in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Popular Registry Items */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Registry Items</CardTitle>
          <CardDescription>Most requested products across all registries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Royal Oud Perfume 100ml', requests: 15, avgPrice: 850 },
              { name: 'Attar Gift Set (3pc)', requests: 12, avgPrice: 450 },
              { name: 'Executive Oud Gift Set', requests: 10, avgPrice: 650 },
              { name: 'Premium Incense Burner', requests: 8, avgPrice: 320 },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <Star className="h-4 w-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      AED {item.avgPrice.toFixed(2)} · {item.requests} registries
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{item.requests} requests</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
