'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Filter, Download, Eye, Edit, Mail, Phone, MessageSquare, Star, Crown, Gift, TrendingUp,
  ArrowLeft} from 'lucide-react';

export default function ComprehensiveCRMPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  const customers = [
    {
      id: 'C001',
      name: 'Ahmed Al-Mansoori',
      email: 'ahmed@example.com',
      phone: '+971-50-123-4567',
      segment: 'VIP',
      tier: 'GOLD',
      loyaltyPoints: 15000,
      totalSpent: 125000,
      orders: 48,
      lastOrder: '2024-09-28',
    },
    {
      id: 'C002',
      name: 'Fatima Al-Zahra',
      email: 'fatima@example.com',
      phone: '+971-50-234-5678',
      segment: 'Regular',
      tier: 'SILVER',
      loyaltyPoints: 8500,
      totalSpent: 65000,
      orders: 32,
      lastOrder: '2024-09-30',
    },
    {
      id: 'C003',
      name: 'Mohammed Hassan',
      email: 'mohammed@example.com',
      phone: '+971-50-345-6789',
      segment: 'VIP',
      tier: 'PLATINUM',
      loyaltyPoints: 25000,
      totalSpent: 185000,
      orders: 67,
      lastOrder: '2024-10-01',
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BRONZE': return 'bg-orange-100 text-orange-800';
      case 'SILVER': return 'bg-gray-100 text-gray-800';
      case 'GOLD': return 'bg-yellow-100 text-yellow-800';
      case 'PLATINUM': return 'bg-purple-100 text-purple-800';
      case 'DIAMOND': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Regular': return 'bg-blue-100 text-blue-800';
      case 'Wholesale': return 'bg-green-100 text-green-800';
      case 'Tourist': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold">Comprehensive Customer Database</h1>
          <p className="text-muted-foreground">Complete customer information and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/reports/customers')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/crm/add-customer')}>
            <Users className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-xl sm:text-2xl font-bold">1,234</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VIP Customers</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">156</p>
              </div>
              <Crown className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Loyalty Points</p>
                <p className="text-xl sm:text-2xl font-bold">2.5M</p>
              </div>
              <Gift className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Customer Value</p>
                <p className="text-xl sm:text-2xl font-bold">AED 8.5K</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>View and manage all customer information</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/crm/segments/vip')}>
                <Crown className="h-4 w-4 mr-2" />
                VIP
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/crm/segments/regular')}>
                <Star className="h-4 w-4 mr-2" />
                Regular
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/crm/segments/tourist')}>
                <Users className="h-4 w-4 mr-2" />
                Tourist
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="wholesale">Wholesale</SelectItem>
                <SelectItem value="tourist">Tourist</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Loyalty Points</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSegmentColor(customer.segment)}>
                      {customer.segment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTierColor(customer.tier)}>
                      {customer.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Gift className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{customer.loyaltyPoints?.toLocaleString() || "0"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">AED {(customer.totalSpent / 1000).toFixed(1)}K</span>
                  </TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/crm/purchase-history?customer=${customer.id}`)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/crm/add-customer?edit=${customer.id}`)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/crm/campaigns?customer=${customer.id}`)}>
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
