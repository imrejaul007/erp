'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, ShoppingBag, Gift, Star, Calendar, Download, MessageSquare, Heart, Crown } from 'lucide-react';

export default function CustomerPortalPage() {
  const [customerCode, setCustomerCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock customer data
  const customer = {
    name: 'Ahmed Al-Mansoori',
    nameArabic: 'أحمد المنصوري',
    email: 'ahmed@example.com',
    phone: '+971-50-123-4567',
    segment: 'VIP',
    tier: 'GOLD',
    loyaltyPoints: 15000,
    joinDate: '2023-01-15',
    totalSpent: 125000,
    orders: 48,
  };

  const orders = [
    { id: 'ORD-2024-0156', date: '2024-09-28', items: 3, total: 2850, status: 'Delivered' },
    { id: 'ORD-2024-0142', date: '2024-09-15', items: 2, total: 1680, status: 'Delivered' },
    { id: 'ORD-2024-0128', date: '2024-09-01', items: 5, total: 4250, status: 'Delivered' },
  ];

  const rewards = [
    { name: '10% Off Next Purchase', points: 5000, available: true },
    { name: 'Free Shipping', points: 2000, available: true },
    { name: 'Luxury Gift Box', points: 3000, available: true },
    { name: 'VIP Event Invitation', points: 10000, available: true },
    { name: 'Exclusive Oud Sample', points: 1500, available: true },
  ];

  const handleLogin = () => {
    if (customerCode) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Customer Portal</CardTitle>
            <CardDescription>Access your account, orders, and loyalty rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Code or Phone Number</label>
              <Input
                placeholder="Enter your customer code"
                value={customerCode}
                onChange={(e) => setCustomerCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button className="w-full" size="lg" onClick={handleLogin}>
              Access Portal
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have a customer code? Visit our store or{' '}
              <a href="/crm/add-customer" className="text-blue-600 hover:underline">
                register online
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{customer.name}</h1>
                <Badge className="bg-yellow-400 text-yellow-900">
                  <Crown className="w-3 h-3 mr-1" />
                  {customer.tier}
                </Badge>
                <Badge className="bg-purple-400 text-purple-900">{customer.segment}</Badge>
              </div>
              <p className="text-blue-100">{customer.nameArabic}</p>
              <p className="text-blue-100">{customer.email} • {customer.phone}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{customer.loyaltyPoints?.toLocaleString() || "0"}</div>
              <div className="text-blue-100">Loyalty Points</div>
              <Button variant="secondary" size="sm" className="mt-2">
                <Gift className="w-4 h-4 mr-2" />
                Redeem
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-xl sm:text-2xl font-bold">{customer.orders}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-xl sm:text-2xl font-bold">AED {(customer.totalSpent / 1000).toFixed(1)}K</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-xl sm:text-2xl font-bold">{new Date(customer.joinDate).getFullYear()}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">VIP Status</p>
                  <p className="text-xl sm:text-2xl font-bold">{customer.tier}</p>
                </div>
                <Crown className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="w-4 h-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="support">
              <MessageSquare className="w-4 h-4 mr-2" />
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.items} items</TableCell>
                        <TableCell>AED {order.total?.toLocaleString() || "0"}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="w-3 h-3 mr-1" />
                              Invoice
                            </Button>
                            <Button variant="outline" size="sm">Details</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>Redeem your loyalty points for exclusive rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.map((reward, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{reward.name}</h3>
                            <p className="text-sm text-muted-foreground">{reward.points?.toLocaleString() || "0"} points</p>
                          </div>
                          <Gift className="h-8 w-8 text-purple-500" />
                        </div>
                        <Button
                          className="w-full"
                          disabled={customer.loyaltyPoints < reward.points}
                        >
                          {customer.loyaltyPoints >= reward.points ? 'Redeem Now' : 'Not Enough Points'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>Your saved items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground">Your wishlist is empty</p>
                  <Button className="mt-4">Browse Products</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Customer Support</CardTitle>
                <CardDescription>Get help with your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <MessageSquare className="h-8 w-8 text-blue-500 mb-2" />
                        <h3 className="font-semibold mb-2">Live Chat</h3>
                        <p className="text-sm text-muted-foreground mb-4">Chat with our support team</p>
                        <Button className="w-full">Start Chat</Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <MessageSquare className="h-8 w-8 text-green-500 mb-2" />
                        <h3 className="font-semibold mb-2">WhatsApp</h3>
                        <p className="text-sm text-muted-foreground mb-4">Message us on WhatsApp</p>
                        <Button className="w-full" variant="outline">Send Message</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
