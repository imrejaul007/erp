'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { UserPlus, Search, Clock, MapPin, Phone, Mail, Calendar, Users, TrendingUp, CheckCircle, Star,
  ArrowLeft} from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Mock data for walk-in customers
const walkInCustomers = [
  {
    id: 'WI-2024-001',
    name: 'Ahmed Al-Mansouri',
    phone: '+971 50 123 4567',
    email: 'ahmed.mansouri@email.ae',
    nationality: 'UAE',
    visitDate: '2024-10-01',
    visitTime: '14:30',
    purpose: 'Purchase',
    preferences: ['Oud', 'Amber'],
    purchaseAmount: 450.00,
    status: 'Completed',
    notes: 'Interested in premium oud collection',
    followUp: 'Send catalog via email',
    satisfaction: 5,
    referralSource: 'Walk-in',
  },
  {
    id: 'WI-2024-002',
    name: 'Sarah Mitchell',
    phone: '+971 55 987 6543',
    email: 'sarah.mitchell@email.ae',
    nationality: 'UK',
    visitDate: '2024-10-01',
    visitTime: '16:15',
    purpose: 'Browsing',
    preferences: ['Rose', 'Floral'],
    purchaseAmount: 0.00,
    status: 'No Purchase',
    notes: 'Tourist looking for authentic Middle Eastern fragrances',
    followUp: 'Send welcome offer',
    satisfaction: 4,
    referralSource: 'Tourism Board',
  },
  {
    id: 'WI-2024-003',
    name: 'Fatima Al-Zahra',
    phone: '+971 52 456 7890',
    email: 'fatima.zahra@email.ae',
    nationality: 'UAE',
    visitDate: '2024-10-01',
    visitTime: '18:45',
    purpose: 'Gift Purchase',
    preferences: ['Musk', 'Sandalwood'],
    purchaseAmount: 680.00,
    status: 'Completed',
    notes: 'Buying anniversary gift for husband',
    followUp: 'Anniversary reminder next year',
    satisfaction: 5,
    referralSource: 'Social Media',
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Completed': 'secondary',
    'No Purchase': 'outline',
    'In Progress': 'default',
    'Follow-up': 'outline',
  };

  const icons = {
    'Completed': CheckCircle,
    'No Purchase': Users,
    'In Progress': Clock,
    'Follow-up': Star,
  };

  const Icon = icons[status as keyof typeof icons] || Users;

  return (
    <Badge variant={variants[status] || 'outline'} className="gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
};

const getSatisfactionStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
    />
  ));
};

export default function WalkInCustomersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof walkInCustomers[0] | null>(null);
  const [isNewWalkInDialogOpen, setIsNewWalkInDialogOpen] = useState(false);

  const filteredCustomers = walkInCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const todayVisits = walkInCustomers.filter(c => c.visitDate === '2024-10-01').length;
  const todayPurchases = walkInCustomers.filter(c => c.visitDate === '2024-10-01' && c.purchaseAmount > 0).length;
  const todayRevenue = walkInCustomers
    .filter(c => c.visitDate === '2024-10-01')
    .reduce((sum, c) => sum + c.purchaseAmount, 0);
  const conversionRate = todayVisits > 0 ? (todayPurchases / todayVisits * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-oud-600" />
            Walk-in Customer Registration
          </h1>
          <p className="text-muted-foreground mt-1">
            Register and track walk-in customers for better service
          </p>
        </div>
        <Dialog open={isNewWalkInDialogOpen} onOpenChange={setIsNewWalkInDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
              <UserPlus className="h-4 w-4" />
              Register Walk-in
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Register Walk-in Customer</DialogTitle>
              <DialogDescription>
                Capture walk-in customer information for personalized service
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name *</Label>
                  <Input id="customer-name" placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+971 50 123 4567" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input id="email" type="email" placeholder="customer@email.ae" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uae">UAE</SelectItem>
                      <SelectItem value="saudi">Saudi Arabia</SelectItem>
                      <SelectItem value="kuwait">Kuwait</SelectItem>
                      <SelectItem value="qatar">Qatar</SelectItem>
                      <SelectItem value="oman">Oman</SelectItem>
                      <SelectItem value="bahrain">Bahrain</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="pakistan">Pakistan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Visit Purpose</Label>
                <RadioGroup defaultValue="browsing" className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="browsing" id="browsing" />
                    <Label htmlFor="browsing">Browsing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="purchase" id="purchase" />
                    <Label htmlFor="purchase">Specific Purchase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gift" id="gift" />
                    <Label htmlFor="gift">Gift Purchase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="consultation" id="consultation" />
                    <Label htmlFor="consultation">Consultation</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral-source">How did you hear about us?</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select referral source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="google">Google Search</SelectItem>
                    <SelectItem value="friend-referral">Friend Referral</SelectItem>
                    <SelectItem value="tourism-board">Tourism Board</SelectItem>
                    <SelectItem value="advertisement">Advertisement</SelectItem>
                    <SelectItem value="event">Event/Exhibition</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences">Fragrance Preferences</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Oud', 'Rose', 'Amber', 'Musk', 'Sandalwood', 'Floral', 'Woody', 'Fresh', 'Oriental'].map((pref) => (
                    <label key={pref} className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{pref}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Customer preferences, requirements, or observations" />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewWalkInDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-oud-600 hover:bg-oud-700">
                  Register Customer
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
            <CardTitle className="text-sm font-medium">Today's Visits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{todayVisits}</div>
            <p className="text-xs text-muted-foreground">
              Walk-in customers today
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{todayPurchases}</div>
            <p className="text-xs text-muted-foreground">
              Customers who purchased
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Visit to purchase ratio
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Walk-in Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(todayRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From walk-in customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today's Visits</TabsTrigger>
          <TabsTrigger value="all">All Walk-ins</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Walk-in Customers</CardTitle>
              <CardDescription>
                Customers who visited the store today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walkInCustomers.filter(c => c.visitDate === '2024-10-01').map((customer) => (
                  <Card key={customer.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{customer.name}</h3>
                            {getStatusBadge(customer.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{customer.visitTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{customer.phone}</span>
                            </div>
                            <span>Purpose: {customer.purpose}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Satisfaction:</span>
                            <div className="flex">{getSatisfactionStars(customer.satisfaction)}</div>
                          </div>
                          <p className="text-sm">
                            <strong>Preferences:</strong> {customer.preferences.join(', ')}
                          </p>
                          {customer.notes && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Notes:</strong> {customer.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-oud-600">
                            {customer.purchaseAmount > 0 ? formatCurrency(customer.purchaseAmount) : 'No Purchase'}
                          </p>
                          <p className="text-sm text-muted-foreground">{customer.nationality}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Walk-in Customer Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, phone, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed Purchase</SelectItem>
                    <SelectItem value="no purchase">No Purchase</SelectItem>
                    <SelectItem value="follow-up">Needs Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Walk-in Customers Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Walk-in Customers</CardTitle>
              <CardDescription>
                Complete history of walk-in customer visits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Visit Date</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Preferences</TableHead>
                      <TableHead>Purchase</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Satisfaction</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.nationality}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{customer.phone}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{customer.visitDate}</p>
                            <p className="text-sm text-muted-foreground">{customer.visitTime}</p>
                          </div>
                        </TableCell>
                        <TableCell>{customer.purpose}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {customer.preferences.slice(0, 2).map((pref) => (
                              <Badge key={pref} variant="outline" className="text-xs">
                                {pref}
                              </Badge>
                            ))}
                            {customer.preferences.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{customer.preferences.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {customer.purchaseAmount > 0
                            ? formatCurrency(customer.purchaseAmount)
                            : '-'
                          }
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>
                          <div className="flex">{getSatisfactionStars(customer.satisfaction)}</div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Visit Purposes</CardTitle>
                <CardDescription>
                  Breakdown of why customers visit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Purchase', 'Browsing', 'Gift Purchase', 'Consultation'].map((purpose) => {
                    const count = walkInCustomers.filter(c => c.purpose === purpose).length;
                    const percentage = count > 0 ? (count / walkInCustomers.length) * 100 : 0;
                    return (
                      <div key={purpose} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{purpose}</span>
                          <span>{count} visits ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-oud-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Preferences</CardTitle>
                <CardDescription>
                  Most requested fragrance types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Oud', 'Rose', 'Amber', 'Musk', 'Sandalwood'].map((pref) => {
                    const count = walkInCustomers.filter(c => c.preferences.includes(pref)).length;
                    const percentage = count > 0 ? (count / walkInCustomers.length) * 100 : 0;
                    return (
                      <div key={pref} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{pref}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{count} customers</p>
                          <p className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="follow-up" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Required</CardTitle>
              <CardDescription>
                Customers who need follow-up actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walkInCustomers.filter(c => c.followUp && c.followUp !== '').map((customer) => (
                  <Card key={customer.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Visited on {customer.visitDate} at {customer.visitTime}
                          </p>
                          <p className="text-sm">
                            <strong>Follow-up Action:</strong> {customer.followUp}
                          </p>
                          <p className="text-sm">
                            <strong>Notes:</strong> {customer.notes}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Mark Complete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Walk-in Customer Details
                {getStatusBadge(selectedCustomer.status)}
              </DialogTitle>
              <DialogDescription>
                Complete information for this walk-in customer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer Name</Label>
                  <p className="text-sm">{selectedCustomer.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nationality</Label>
                  <p className="text-sm">{selectedCustomer.nationality}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedCustomer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Visit Date & Time</Label>
                  <p className="text-sm">{selectedCustomer.visitDate} at {selectedCustomer.visitTime}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Visit Purpose</Label>
                  <p className="text-sm">{selectedCustomer.purpose}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium">Fragrance Preferences</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedCustomer.preferences.map((pref) => (
                    <Badge key={pref} variant="outline">{pref}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Purchase Amount</Label>
                  <p className="text-sm font-bold text-oud-600">
                    {selectedCustomer.purchaseAmount > 0
                      ? formatCurrency(selectedCustomer.purchaseAmount)
                      : 'No Purchase'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Satisfaction Rating</Label>
                  <div className="flex mt-1">{getSatisfactionStars(selectedCustomer.satisfaction)}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Referral Source</Label>
                <p className="text-sm">{selectedCustomer.referralSource}</p>
              </div>
              {selectedCustomer.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedCustomer.notes}</p>
                </div>
              )}
              {selectedCustomer.followUp && (
                <div>
                  <Label className="text-sm font-medium">Follow-up Action</Label>
                  <p className="text-sm bg-blue-50 p-2 rounded border border-blue-200">{selectedCustomer.followUp}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}