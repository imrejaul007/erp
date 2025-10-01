'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Users, Phone, Mail, MapPin, Calendar, Star, Gift, TrendingUp, UserCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { DatePicker } from '@/components/ui/date-picker';

// Mock customer data
const customers = [
  {
    id: 'CUST001',
    name: 'Ahmed Al-Mansouri',
    email: 'ahmed.mansouri@email.com',
    phone: '+971 50 123 4567',
    address: 'Dubai Marina, Dubai, UAE',
    joinDate: '2023-01-15',
    lastOrder: '2024-09-28',
    totalOrders: 24,
    totalSpent: 12450.00,
    loyaltyPoints: 1245,
    status: 'VIP',
    preferredCategories: ['Oud', 'Amber'],
    birthday: '1985-03-22',
    avatar: null,
  },
  {
    id: 'CUST002',
    name: 'Fatima Hassan',
    email: 'fatima.hassan@email.com',
    phone: '+971 55 987 6543',
    address: 'Jumeirah, Dubai, UAE',
    joinDate: '2023-06-10',
    lastOrder: '2024-09-25',
    totalOrders: 18,
    totalSpent: 8750.00,
    loyaltyPoints: 875,
    status: 'Premium',
    preferredCategories: ['Rose', 'Floral'],
    birthday: '1990-07-15',
    avatar: null,
  },
  {
    id: 'CUST003',
    name: 'Mohammed Saeed',
    email: 'mohammed.saeed@email.com',
    phone: '+971 52 456 7890',
    address: 'Al Ain, UAE',
    joinDate: '2023-12-01',
    lastOrder: '2024-09-20',
    totalOrders: 8,
    totalSpent: 3200.00,
    loyaltyPoints: 320,
    status: 'Regular',
    preferredCategories: ['Sandalwood', 'Musk'],
    birthday: '1988-11-03',
    avatar: null,
  },
  {
    id: 'CUST004',
    name: 'Aisha Al-Zahra',
    email: 'aisha.zahra@email.com',
    phone: '+971 56 234 5678',
    address: 'Abu Dhabi, UAE',
    joinDate: '2024-02-14',
    lastOrder: '2024-09-30',
    totalOrders: 12,
    totalSpent: 5460.00,
    loyaltyPoints: 546,
    status: 'Premium',
    preferredCategories: ['Jasmine', 'Rose'],
    birthday: '1992-12-25',
    avatar: null,
  },
];

// Mock purchase history
const purchaseHistory = [
  {
    id: 'ORD-2024-001',
    customerId: 'CUST001',
    date: '2024-09-28',
    items: [
      { name: 'Royal Oud Premium', quantity: 1, price: 450.00 },
      { name: 'Amber Essence Deluxe', quantity: 2, price: 320.00 },
    ],
    total: 1090.00,
    status: 'Delivered',
  },
  {
    id: 'ORD-2024-002',
    customerId: 'CUST002',
    date: '2024-09-25',
    items: [
      { name: 'Rose Garden Collection', quantity: 1, price: 280.00 },
    ],
    total: 280.00,
    status: 'Delivered',
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string } } = {
    'VIP': { variant: 'default', className: 'bg-amber-500 text-white' },
    'Premium': { variant: 'default', className: 'bg-purple-500 text-white' },
    'Regular': { variant: 'secondary' },
    'Inactive': { variant: 'outline' },
  };
  const config = variants[status] || { variant: 'outline' };
  return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
};

const getCustomerInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [isCustomerDetailDialogOpen, setIsCustomerDetailDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || customer.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const openCustomerDetail = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setIsCustomerDetailDialogOpen(true);
  };

  const customerPurchases = selectedCustomer
    ? purchaseHistory.filter(purchase => purchase.customerId === selectedCustomer.id)
    : [];

  const loyaltyProgress = selectedCustomer ? (selectedCustomer.loyaltyPoints % 1000) / 10 : 0;
  const nextRewardThreshold = selectedCustomer ? Math.ceil(selectedCustomer.loyaltyPoints / 1000) * 1000 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-oud-600" />
            Customer Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer relationships, loyalty programs, and purchase history
          </p>
        </div>
        <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer profile with contact and preference information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Full Name</Label>
                  <Input id="customer-name" placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input id="customer-email" type="email" placeholder="customer@email.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input id="customer-phone" placeholder="+971 50 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label>Birthday</Label>
                  <DatePicker placeholder="Select birthday" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-address">Address</Label>
                <Textarea id="customer-address" placeholder="Customer address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-preferences">Preferred Categories</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferences" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oud">Oud</SelectItem>
                    <SelectItem value="amber">Amber</SelectItem>
                    <SelectItem value="rose">Rose</SelectItem>
                    <SelectItem value="musk">Musk</SelectItem>
                    <SelectItem value="sandalwood">Sandalwood</SelectItem>
                    <SelectItem value="jasmine">Jasmine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewCustomerDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewCustomerDialogOpen(false)}>
                  Add Customer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === 'VIP').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Premium tier members
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Recently joined
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                customers.reduce((sum, c) => sum + c.totalSpent, 0) /
                customers.reduce((sum, c) => sum + c.totalOrders, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Customer List</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>
                View and manage all customer information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Cards */}
              <div className="grid gap-4">
                {filteredCustomers.map((customer) => (
                  <Card
                    key={customer.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openCustomerDetail(customer)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={customer.avatar || undefined} />
                            <AvatarFallback className="bg-oud-100 text-oud-600">
                              {getCustomerInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{customer.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {customer.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(customer.status)}
                          <div className="mt-2 text-sm text-muted-foreground">
                            <div>{customer.totalOrders} orders</div>
                            <div className="font-medium text-oud-600">
                              {formatCurrency(customer.totalSpent)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Joined:</span>
                          <div className="font-medium">{customer.joinDate}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Order:</span>
                          <div className="font-medium">{customer.lastOrder}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Loyalty Points:</span>
                          <div className="font-medium flex items-center gap-1">
                            <Gift className="h-3 w-3 text-oud-600" />
                            {customer.loyaltyPoints}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Preferences:</span>
                          <div className="font-medium">{customer.preferredCategories.join(', ')}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Loyalty Program Overview</CardTitle>
                <CardDescription>
                  Track customer loyalty points and rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers
                    .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
                    .slice(0, 10)
                    .map((customer, index) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-oud-100 rounded-full flex items-center justify-center text-sm font-medium text-oud-600">
                            {index + 1}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-oud-100 text-oud-600">
                              {getCustomerInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-oud-600" />
                            <span className="font-bold text-oud-600">{customer.loyaltyPoints}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(customer.totalSpent)} spent
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loyalty Tiers</CardTitle>
                <CardDescription>
                  Customer status benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="font-medium">Regular</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">0 - 999 points</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 1% cashback on purchases</li>
                    <li>• Birthday discount</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">Premium</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">1,000 - 4,999 points</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 2% cashback on purchases</li>
                    <li>• Priority customer service</li>
                    <li>• Exclusive previews</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="font-medium">VIP</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">5,000+ points</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 5% cashback on purchases</li>
                    <li>• Free shipping</li>
                    <li>• Personal consultation</li>
                    <li>• Exclusive events</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Distribution</CardTitle>
                <CardDescription>
                  Customer segments by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Customer analytics chart</p>
                    <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
                <CardDescription>
                  Top customers by total spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 5)
                    .map((customer, index) => (
                      <div key={customer.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-oud-100 rounded-full flex items-center justify-center text-sm font-medium text-oud-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {customer.totalOrders} orders
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-oud-600">
                            {formatCurrency(customer.totalSpent)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Avg: {formatCurrency(customer.totalSpent / customer.totalOrders)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Customer Detail Dialog */}
      <Dialog open={isCustomerDetailDialogOpen} onOpenChange={setIsCustomerDetailDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-oud-100 text-oud-600">
                      {getCustomerInitials(selectedCustomer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      {selectedCustomer.name}
                      {getStatusBadge(selectedCustomer.status)}
                    </div>
                    <p className="text-sm text-muted-foreground font-normal">
                      Customer since {selectedCustomer.joinDate}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-6">
                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{selectedCustomer.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Birthday: {selectedCustomer.birthday}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Loyalty Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Current Points:</span>
                        <div className="flex items-center gap-1">
                          <Gift className="h-4 w-4 text-oud-600" />
                          <span className="font-bold text-oud-600">{selectedCustomer.loyaltyPoints}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to next reward:</span>
                          <span>{nextRewardThreshold - selectedCustomer.loyaltyPoints} points needed</span>
                        </div>
                        <Progress value={loyaltyProgress} className="w-full" />
                      </div>
                      <div className="pt-2">
                        <span className="text-sm text-muted-foreground">Preferred Categories:</span>
                        <div className="flex gap-1 mt-1">
                          {selectedCustomer.preferredCategories.map(category => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Purchase Statistics */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-oud-600">{selectedCustomer.totalOrders}</div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-oud-600">
                        {formatCurrency(selectedCustomer.totalSpent)}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-oud-600">
                        {formatCurrency(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                      </div>
                      <p className="text-sm text-muted-foreground">Average Order</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Purchases */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Purchases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customerPurchases.length > 0 ? (
                      <div className="space-y-3">
                        {customerPurchases.map((purchase) => (
                          <div key={purchase.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">Order {purchase.id}</p>
                                <p className="text-sm text-muted-foreground">{purchase.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-oud-600">{formatCurrency(purchase.total)}</p>
                                <Badge variant="secondary">{purchase.status}</Badge>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {purchase.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.name} × {item.quantity}</span>
                                  <span>{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No recent purchases found
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}