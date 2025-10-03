'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Plus,
  Repeat,
  Calendar,
  Package,
  DollarSign,
  User,
  TrendingUp,
  Clock,
  Pause,
  Play,
  X,
  Edit,
  Eye,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const subscriptions = [
    {
      id: 1,
      customerName: 'Ahmed Al Maktoum',
      customerEmail: 'ahmed@example.com',
      planName: 'Monthly Oud Collection',
      frequency: 'Monthly',
      products: ['Cambodian Oud 10ml', 'Hindi Oud 10ml'],
      price: 450,
      currency: 'AED',
      status: 'active',
      nextDelivery: '2025-11-05',
      startDate: '2025-01-05',
      deliveriesCompleted: 9,
      totalRevenue: 4050,
    },
    {
      id: 2,
      customerName: 'Fatima Hassan',
      customerEmail: 'fatima@example.com',
      planName: 'Premium Attar Quarterly',
      frequency: 'Quarterly',
      products: ['Rose Attar 12ml', 'Musk Attar 12ml', 'Amber Attar 12ml'],
      price: 850,
      currency: 'AED',
      status: 'active',
      nextDelivery: '2025-12-15',
      startDate: '2024-12-15',
      deliveriesCompleted: 3,
      totalRevenue: 2550,
    },
    {
      id: 3,
      customerName: 'Mohammed Ali',
      customerEmail: 'mohammed@example.com',
      planName: 'Weekly Bakhoor Box',
      frequency: 'Weekly',
      products: ['Assorted Bakhoor 50g'],
      price: 120,
      currency: 'AED',
      status: 'paused',
      nextDelivery: '2025-10-20',
      startDate: '2025-08-01',
      deliveriesCompleted: 8,
      totalRevenue: 960,
    },
    {
      id: 4,
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      planName: 'Bi-Weekly Perfume Discovery',
      frequency: 'Bi-Weekly',
      products: ['Sample Set - 5x2ml'],
      price: 180,
      currency: 'AED',
      status: 'active',
      nextDelivery: '2025-10-18',
      startDate: '2025-06-01',
      deliveriesCompleted: 10,
      totalRevenue: 1800,
    },
    {
      id: 5,
      customerName: 'Omar Khalifa',
      customerEmail: 'omar@example.com',
      planName: 'Annual VIP Collection',
      frequency: 'Yearly',
      products: ['Premium Collection Box'],
      price: 5000,
      currency: 'AED',
      status: 'active',
      nextDelivery: '2026-03-01',
      startDate: '2025-03-01',
      deliveriesCompleted: 0,
      totalRevenue: 5000,
    },
  ];

  const stats = [
    {
      label: 'Active Subscriptions',
      value: subscriptions.filter((s) => s.status === 'active').length,
      icon: Repeat,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Monthly Revenue',
      value: 'AED 1,600',
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Subscribers',
      value: subscriptions.length,
      icon: User,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Lifetime Value',
      value: 'AED 14.3K',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  const plans = [
    { name: 'Monthly Oud Collection', frequency: 'Monthly', subscribers: 12, price: 450 },
    { name: 'Premium Attar Quarterly', frequency: 'Quarterly', subscribers: 8, price: 850 },
    { name: 'Weekly Bakhoor Box', frequency: 'Weekly', subscribers: 5, price: 120 },
    { name: 'Bi-Weekly Perfume Discovery', frequency: 'Bi-Weekly', subscribers: 15, price: 180 },
    { name: 'Annual VIP Collection', frequency: 'Yearly', subscribers: 3, price: 5000 },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'Weekly':
        return '📅';
      case 'Bi-Weekly':
        return '📆';
      case 'Monthly':
        return '🗓️';
      case 'Quarterly':
        return '📊';
      case 'Yearly':
        return '🎯';
      default:
        return '🔄';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Repeat className="h-8 w-8 text-blue-600" />
              Subscription Orders
            </h1>
            <p className="text-muted-foreground">Manage recurring orders and subscription plans</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="luxury">
              <Plus className="h-4 w-4 mr-2" />
              Create Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Subscription</DialogTitle>
              <DialogDescription>
                Setup a recurring order for a customer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Customer</Label>
                <Input placeholder="Search customer..." />
              </div>
              <div className="space-y-2">
                <Label>Subscription Plan</Label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>Select a plan...</option>
                  {plans.map((plan, idx) => (
                    <option key={idx} value={plan.name}>
                      {plan.name} - AED {plan.price} ({plan.frequency})
                    </option>
                  ))}
                  <option>Custom Plan</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>Weekly</option>
                    <option>Bi-Weekly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Products</Label>
                <select multiple className="w-full border rounded-md px-3 py-2" size={4}>
                  <option>Cambodian Oud 10ml - AED 250</option>
                  <option>Hindi Oud 10ml - AED 200</option>
                  <option>Rose Attar 12ml - AED 180</option>
                  <option>Musk Attar 12ml - AED 160</option>
                  <option>Amber Attar 12ml - AED 140</option>
                  <option>Assorted Bakhoor 50g - AED 120</option>
                </select>
                <p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price per Delivery (AED)</Label>
                  <Input type="number" placeholder="450" />
                </div>
                <div className="space-y-2">
                  <Label>Discount (%)</Label>
                  <Input type="number" placeholder="10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Delivery Instructions</Label>
                <textarea
                  className="w-full border rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Special delivery instructions..."
                ></textarea>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Automatic Billing</p>
                <p className="text-xs text-blue-700 mt-1">
                  Customer will be charged automatically before each delivery
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="luxury" className="flex-1">
                Create Subscription
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="subscriptions">
        <TabsList>
          <TabsTrigger value="subscriptions">Active Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
        </TabsList>

        {/* Active Subscriptions */}
        <TabsContent value="subscriptions" className="space-y-4">
          {subscriptions.map((sub) => (
            <Card key={sub.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{sub.customerName}</h3>
                        <p className="text-sm text-muted-foreground">{sub.customerEmail}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-2xl">{getFrequencyIcon(sub.frequency)}</span>
                          <div>
                            <p className="font-medium">{sub.planName}</p>
                            <p className="text-sm text-muted-foreground">{sub.frequency} Delivery</p>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(sub.status)}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Products</p>
                  <div className="flex flex-wrap gap-2">
                    {sub.products.map((product, idx) => (
                      <Badge key={idx} variant="outline">
                        <Package className="h-3 w-3 mr-1" />
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-semibold">
                      {sub.currency} {sub.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Next Delivery</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(sub.nextDelivery).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deliveries</p>
                    <p className="font-semibold">{sub.deliveriesCompleted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="font-semibold text-green-600">
                      {sub.currency} {sub.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Since</p>
                    <p className="font-semibold">
                      {new Date(sub.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  {sub.status === 'active' && (
                    <Button variant="outline" size="sm">
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                  )}
                  {sub.status === 'paused' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      Resume
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Subscription Plans */}
        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Subscription Plans</CardTitle>
              <CardDescription>Manage your subscription offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{getFrequencyIcon(plan.frequency)}</div>
                      <div>
                        <h4 className="font-semibold text-lg">{plan.name}</h4>
                        <p className="text-sm text-muted-foreground">{plan.frequency} Delivery</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Subscribers</p>
                        <p className="font-semibold text-lg">{plan.subscribers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold text-lg text-green-600">AED {plan.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="luxury" className="w-full mt-6">
                <Plus className="h-4 w-4 mr-2" />
                Create New Plan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
