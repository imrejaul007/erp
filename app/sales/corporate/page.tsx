'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Building, Eye, Edit, Trash2, Crown, Users, TrendingUp, Calendar, Award, CreditCard, FileText } from 'lucide-react';
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

// Mock data for corporate orders
const corporateOrders = [
  {
    id: 'CORP-2024-001',
    company: 'Emirates Airlines',
    division: 'First Class Amenities',
    contact: 'Layla Al-Maktoum',
    email: 'layla.almaktoum@emirates.ae',
    phone: '+971 4 295 5555',
    trn: '100555666777888',
    contractNumber: 'EK-AMN-2024-001',
    tier: 'Platinum',
    items: [
      { name: 'Royal Oud Premium - Custom Blend', quantity: 500, price: 420.00, unit: 'bottle', discount: 25 },
      { name: 'Signature Rose Collection', quantity: 300, price: 260.00, unit: 'bottle', discount: 20 },
      { name: 'Premium Gift Sets', quantity: 100, price: 650.00, unit: 'set', discount: 15 }
    ],
    subtotal: 343000.00,
    discount: 76300.00,
    discountedSubtotal: 266700.00,
    vat: 13335.00,
    total: 280035.00,
    status: 'Contract Signed',
    paymentMethod: 'Corporate Account',
    paymentTerms: 'Net 60',
    date: '2024-09-25',
    deliveryDate: '2024-11-01',
    contractDuration: '12 months',
    priority: 'Platinum',
    notes: 'Exclusive blend for First Class cabins. Monthly delivery schedule.',
    accountManager: 'Sarah Ahmad',
  },
  {
    id: 'CORP-2024-002',
    company: 'Burj Al Arab Hotel',
    division: 'Guest Services',
    contact: 'Ahmed Al-Rashid',
    email: 'ahmed.rashid@jumeirah.ae',
    phone: '+971 4 301 7777',
    trn: '100777888999000',
    contractNumber: 'BAA-GS-2024-002',
    tier: 'Gold',
    items: [
      { name: 'Luxury Oud Collection', quantity: 200, price: 480.00, unit: 'bottle', discount: 20 },
      { name: 'Amber Signature Line', quantity: 150, price: 350.00, unit: 'bottle', discount: 18 },
      { name: 'Welcome Gift Sets', quantity: 50, price: 850.00, unit: 'set', discount: 15 }
    ],
    subtotal: 191000.00,
    discount: 35590.00,
    discountedSubtotal: 155410.00,
    vat: 7770.50,
    total: 163180.50,
    status: 'In Negotiation',
    paymentMethod: 'Letter of Credit',
    paymentTerms: 'Net 45',
    date: '2024-09-20',
    deliveryDate: '2024-10-20',
    contractDuration: '24 months',
    priority: 'Gold',
    notes: 'Premium suite amenities and guest welcome gifts.',
    accountManager: 'Mohammed Hassan',
  },
  {
    id: 'CORP-2024-003',
    company: 'Dubai International Airport',
    division: 'Duty Free Operations',
    contact: 'Fatima Al-Zahra',
    email: 'fatima.zahra@dubaiairports.ae',
    phone: '+971 4 224 5555',
    trn: '100999000111222',
    contractNumber: 'DXB-DF-2024-003',
    tier: 'Silver',
    items: [
      { name: 'Travel Size Perfume Collection', quantity: 1000, price: 85.00, unit: 'bottle', discount: 30 },
      { name: 'Miniature Gift Sets', quantity: 500, price: 120.00, unit: 'set', discount: 25 }
    ],
    subtotal: 145000.00,
    discount: 37750.00,
    discountedSubtotal: 107250.00,
    vat: 5362.50,
    total: 112612.50,
    status: 'Active Contract',
    paymentMethod: 'Bank Transfer',
    paymentTerms: 'Net 30',
    date: '2024-09-15',
    deliveryDate: '2024-10-15',
    contractDuration: '36 months',
    priority: 'Silver',
    notes: 'Duty-free retail exclusive products.',
    accountManager: 'Omar Al-Mansouri',
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
    'Contract Signed': 'secondary',
    'In Negotiation': 'default',
    'Active Contract': 'secondary',
    'Pending Approval': 'outline',
    'Cancelled': 'destructive',
  };
  return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
};

const getTierBadge = (tier: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Platinum': 'destructive',
    'Gold': 'default',
    'Silver': 'secondary',
    'Bronze': 'outline',
  };
  const icons = {
    'Platinum': Crown,
    'Gold': Award,
    'Silver': Award,
    'Bronze': Award,
  };
  const Icon = icons[tier as keyof typeof icons] || Award;

  return (
    <Badge variant={variants[tier] || 'outline'} className="gap-1">
      <Icon className="h-3 w-3" />
      {tier}
    </Badge>
  );
};

export default function CorporateOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof corporateOrders[0] | null>(null);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);

  const filteredOrders = corporateOrders.filter(order => {
    const matchesSearch = order.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const totalContractValue = corporateOrders.reduce((sum, order) => sum + order.total, 0);
  const totalDiscount = corporateOrders.reduce((sum, order) => sum + order.discount, 0);
  const activeContracts = corporateOrders.filter(order => order.status === 'Active Contract').length;
  const corporateClients = new Set(corporateOrders.map(order => order.company)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building className="h-8 w-8 text-oud-600" />
            Corporate Client Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage enterprise contracts and corporate partnerships
          </p>
        </div>
        <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
              <Plus className="h-4 w-4" />
              New Corporate Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Corporate Contract</DialogTitle>
              <DialogDescription>
                Establish a new contract with a corporate client
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Enter company name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">Division/Department</Label>
                  <Input id="division" placeholder="Business division" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Person</Label>
                  <Input id="contact" placeholder="Primary contact name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-manager">Account Manager</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign account manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Ahmad</SelectItem>
                      <SelectItem value="mohammed">Mohammed Hassan</SelectItem>
                      <SelectItem value="omar">Omar Al-Mansouri</SelectItem>
                      <SelectItem value="layla">Layla Al-Rashid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="company@domain.ae" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+971 4 XXX XXXX" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trn">TRN (Tax Registration Number)</Label>
                  <Input id="trn" placeholder="100123456789012" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tier">Client Tier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contract-duration">Contract Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6-months">6 months</SelectItem>
                      <SelectItem value="12-months">12 months</SelectItem>
                      <SelectItem value="24-months">24 months</SelectItem>
                      <SelectItem value="36-months">36 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net-30">Net 30</SelectItem>
                      <SelectItem value="net-45">Net 45</SelectItem>
                      <SelectItem value="net-60">Net 60</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Contract Notes</Label>
                <Textarea id="notes" placeholder="Special terms, conditions, or requirements" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewOrderDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-oud-600 hover:bg-oud-700">
                  Create Contract
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contract Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalContractValue)}</div>
            <p className="text-xs text-muted-foreground">
              Active and signed contracts
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enterprise Discounts</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDiscount)}</div>
            <p className="text-xs text-muted-foreground">
              Volume discounts provided
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corporate Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{corporateClients}</div>
            <p className="text-xs text-muted-foreground">
              Enterprise partners
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="contracts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contracts">Contract Management</TabsTrigger>
          <TabsTrigger value="clients">Corporate Clients</TabsTrigger>
          <TabsTrigger value="analytics">Enterprise Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by company, contact, or contract number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="contract signed">Contract Signed</SelectItem>
                    <SelectItem value="negotiation">In Negotiation</SelectItem>
                    <SelectItem value="active">Active Contract</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contracts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Corporate Contracts</CardTitle>
              <CardDescription>
                Manage and track all corporate contracts and partnerships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Contract Value</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Account Manager</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p>{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.contractNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.company}</p>
                            <p className="text-sm text-muted-foreground">{order.division}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.contact}</p>
                            <p className="text-sm text-muted-foreground">{order.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getTierBadge(order.tier)}</TableCell>
                        <TableCell className="font-medium text-oud-600">
                          {formatCurrency(order.total)}
                        </TableCell>
                        <TableCell className="text-red-600">
                          -{formatCurrency(order.discount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.contractDuration}</TableCell>
                        <TableCell>{order.accountManager}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Corporate Client Portfolio</CardTitle>
              <CardDescription>
                Overview of enterprise clients and their tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(new Set(corporateOrders.map(order => order.company))).map((company) => {
                  const clientOrders = corporateOrders.filter(order => order.company === company);
                  const totalValue = clientOrders.reduce((sum, order) => sum + order.total, 0);
                  const client = clientOrders[0];

                  return (
                    <Card key={company} className="relative">
                      <CardContent className="p-4">
                        <div className="absolute top-2 right-2">
                          {getTierBadge(client.tier)}
                        </div>
                        <div className="space-y-2 pr-16">
                          <h3 className="font-semibold">{company}</h3>
                          <p className="text-sm text-muted-foreground">{client.division}</p>
                          <p className="text-sm text-muted-foreground">{client.contact}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                          <Separator />
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Contracts:</span>
                              <span className="font-medium">{clientOrders.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Total Value:</span>
                              <span className="font-medium text-oud-600">{formatCurrency(totalValue)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Account Manager:</span>
                              <span className="font-medium">{client.accountManager}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Payment Terms:</span>
                              <span className="font-medium">{client.paymentTerms}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Tier Distribution</CardTitle>
                <CardDescription>
                  Breakdown of clients by tier level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Platinum', 'Gold', 'Silver', 'Bronze'].map((tier) => {
                    const count = corporateOrders.filter(order => order.tier === tier).length;
                    const percentage = count > 0 ? (count / corporateOrders.length) * 100 : 0;
                    const colors = {
                      'Platinum': 'bg-purple-500',
                      'Gold': 'bg-yellow-500',
                      'Silver': 'bg-gray-500',
                      'Bronze': 'bg-orange-500'
                    };
                    return (
                      <div key={tier} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="flex items-center gap-2">
                            <Crown className="h-4 w-4" />
                            {tier}
                          </span>
                          <span>{count} clients ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${colors[tier as keyof typeof colors]} h-2 rounded-full`}
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
                <CardTitle>Contract Status Overview</CardTitle>
                <CardDescription>
                  Status distribution of corporate contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Contract Signed', 'Active Contract', 'In Negotiation'].map((status) => {
                    const count = corporateOrders.filter(order => order.status === status).length;
                    const percentage = count > 0 ? (count / corporateOrders.length) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-oud-600" />
                          <span>{status}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{count} contracts</p>
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
      </Tabs>

      {/* Contract Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Corporate Contract Details - {selectedOrder.id}
                {getTierBadge(selectedOrder.tier)}
              </DialogTitle>
              <DialogDescription>
                Complete information for this corporate contract
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="text-sm">{selectedOrder.company}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Division</Label>
                  <p className="text-sm">{selectedOrder.division}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Contact Person</Label>
                  <p className="text-sm">{selectedOrder.contact}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Account Manager</Label>
                  <p className="text-sm">{selectedOrder.accountManager}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Contract Number</Label>
                  <p className="text-sm font-mono">{selectedOrder.contractNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contract Duration</Label>
                  <p className="text-sm">{selectedOrder.contractDuration}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium">Contract Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} {item.unit} • Unit Price: {formatCurrency(item.price)} • Discount: {item.discount}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price * item.quantity * (1 - item.discount / 100))}</p>
                        <p className="text-sm text-red-600">-{formatCurrency(item.price * item.quantity * item.discount / 100)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Enterprise Discount:</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discounted Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.discountedSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (5%):</span>
                  <span>{formatCurrency(selectedOrder.vat)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Contract Value:</span>
                  <span className="text-oud-600">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
              {selectedOrder.notes && (
                <div>
                  <Label className="text-sm font-medium">Contract Notes</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}