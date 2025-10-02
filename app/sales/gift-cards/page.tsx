'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Gift, Eye, Edit, Trash2, CreditCard, QrCode, Mail, Smartphone, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';

// Mock data for gift cards and vouchers
const giftCardsData = [
  {
    id: 'GC-2024-001',
    code: 'OUDGIFT2024001',
    type: 'Gift Card',
    amount: 500.00,
    balance: 350.00,
    status: 'Active',
    issueDate: '2024-09-15',
    expiryDate: '2024-12-15',
    purchasedBy: 'Ahmed Al-Mansouri',
    purchaserEmail: 'ahmed@email.ae',
    purchaserPhone: '+971 50 123 4567',
    recipientName: 'Fatima Hassan',
    recipientEmail: 'fatima@email.ae',
    recipientPhone: '+971 55 987 6543',
    message: 'Happy Birthday! Hope you find your perfect fragrance.',
    deliveryMethod: 'Email',
    usageHistory: [
      { date: '2024-09-20', amount: 150.00, order: 'ORD-2024-045', store: 'Main Store' }
    ],
    designTemplate: 'Birthday',
  },
  {
    id: 'VC-2024-001',
    code: 'LOYALTY20',
    type: 'Voucher',
    amount: 100.00,
    balance: 100.00,
    status: 'Active',
    issueDate: '2024-10-01',
    expiryDate: '2024-10-31',
    purchasedBy: 'System Generated',
    purchaserEmail: '',
    purchaserPhone: '',
    recipientName: 'Omar Al-Rashid',
    recipientEmail: 'omar@email.ae',
    recipientPhone: '+971 52 456 7890',
    message: 'Thank you for being a loyal customer!',
    deliveryMethod: 'SMS',
    usageHistory: [],
    designTemplate: 'Loyalty',
    restrictions: 'Minimum purchase AED 200',
  },
  {
    id: 'GC-2024-002',
    code: 'OUDGIFT2024002',
    type: 'Gift Card',
    amount: 1000.00,
    balance: 0.00,
    status: 'Redeemed',
    issueDate: '2024-08-10',
    expiryDate: '2024-11-10',
    purchasedBy: 'Corporate - Emirates Airlines',
    purchaserEmail: 'corporate@emirates.ae',
    purchaserPhone: '+971 4 295 5555',
    recipientName: 'Employee Gift',
    recipientEmail: '',
    recipientPhone: '',
    message: 'Employee appreciation gift from Emirates Airlines',
    deliveryMethod: 'Physical',
    usageHistory: [
      { date: '2024-08-25', amount: 450.00, order: 'ORD-2024-078', store: 'Main Store' },
      { date: '2024-09-10', amount: 320.00, order: 'ORD-2024-092', store: 'Mall Store' },
      { date: '2024-09-22', amount: 230.00, order: 'ORD-2024-105', store: 'Main Store' }
    ],
    designTemplate: 'Corporate',
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
    'Active': 'secondary',
    'Redeemed': 'outline',
    'Expired': 'destructive',
    'Cancelled': 'destructive',
    'Pending': 'default',
  };

  const icons = {
    'Active': CheckCircle,
    'Redeemed': CheckCircle,
    'Expired': AlertTriangle,
    'Cancelled': AlertTriangle,
    'Pending': Calendar,
  };

  const Icon = icons[status as keyof typeof icons] || CheckCircle;

  return (
    <Badge variant={variants[status] || 'outline'} className="gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
};

const getTypeBadge = (type: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Gift Card': 'default',
    'Voucher': 'secondary',
    'Promotional': 'outline',
  };

  return <Badge variant={variants[type] || 'outline'}>{type}</Badge>;
};

export default function GiftCardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedGiftCard, setSelectedGiftCard] = useState<typeof giftCardsData[0] | null>(null);
  const [isNewGiftCardDialogOpen, setIsNewGiftCardDialogOpen] = useState(false);

  const filteredGiftCards = giftCardsData.filter(giftCard => {
    const matchesSearch = giftCard.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         giftCard.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         giftCard.purchasedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         giftCard.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || giftCard.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || giftCard.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalIssued = giftCardsData.reduce((sum, gc) => sum + gc.amount, 0);
  const totalRedeemed = giftCardsData.reduce((sum, gc) => sum + (gc.amount - gc.balance), 0);
  const activeCards = giftCardsData.filter(gc => gc.status === 'Active').length;
  const pendingRedemption = giftCardsData.reduce((sum, gc) => sum + gc.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Gift className="h-8 w-8 text-oud-600" />
            Gift Cards & Vouchers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage gift cards, vouchers, and promotional codes
          </p>
        </div>
        <Dialog open={isNewGiftCardDialogOpen} onOpenChange={setIsNewGiftCardDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
              <Plus className="h-4 w-4" />
              Create Gift Card
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Gift Card</DialogTitle>
              <DialogDescription>
                Issue a new gift card or voucher
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gift-card">Gift Card</SelectItem>
                      <SelectItem value="voucher">Voucher</SelectItem>
                      <SelectItem value="promotional">Promotional Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (AED)</Label>
                  <Input id="amount" type="number" placeholder="500.00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaser-name">Purchaser Name</Label>
                  <Input id="purchaser-name" placeholder="Customer name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaser-email">Purchaser Email</Label>
                  <Input id="purchaser-email" type="email" placeholder="customer@email.ae" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient-name">Recipient Name</Label>
                  <Input id="recipient-name" placeholder="Gift recipient name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient-email">Recipient Email</Label>
                  <Input id="recipient-email" type="email" placeholder="recipient@email.ae" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input id="expiry-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-method">Delivery Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="physical">Physical Card</SelectItem>
                      <SelectItem value="digital">Digital Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="design-template">Design Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="eid">Eid Special</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="loyalty">Loyalty Reward</SelectItem>
                    <SelectItem value="generic">Generic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message</Label>
                <Textarea id="message" placeholder="Personal message for the recipient" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restrictions">Restrictions (optional)</Label>
                <Textarea id="restrictions" placeholder="Minimum purchase amount, product restrictions, etc." />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-send" />
                <Label htmlFor="auto-send">Send automatically to recipient</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewGiftCardDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-oud-600 hover:bg-oud-700">
                  Create Gift Card
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
            <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIssued)}</div>
            <p className="text-xs text-muted-foreground">
              All time gift cards issued
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redeemed</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRedeemed)}</div>
            <p className="text-xs text-muted-foreground">
              Used gift card value
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCards}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Redemption</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingRedemption)}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Cards</TabsTrigger>
          <TabsTrigger value="gift-cards">Gift Cards</TabsTrigger>
          <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Gift Card Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by code, recipient, or purchaser..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="gift card">Gift Cards</SelectItem>
                    <SelectItem value="voucher">Vouchers</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="redeemed">Redeemed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Gift Cards Table */}
          <Card>
            <CardHeader>
              <CardTitle>Gift Cards & Vouchers</CardTitle>
              <CardDescription>
                Manage all gift cards and vouchers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGiftCards.map((giftCard) => (
                      <TableRow key={giftCard.id}>
                        <TableCell className="font-mono text-sm">{giftCard.code}</TableCell>
                        <TableCell>{getTypeBadge(giftCard.type)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{giftCard.recipientName}</p>
                            <p className="text-sm text-muted-foreground">{giftCard.recipientEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(giftCard.amount)}</TableCell>
                        <TableCell className="font-medium text-oud-600">
                          {formatCurrency(giftCard.balance)}
                        </TableCell>
                        <TableCell>{getStatusBadge(giftCard.status)}</TableCell>
                        <TableCell>{giftCard.issueDate}</TableCell>
                        <TableCell>{giftCard.expiryDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedGiftCard(giftCard)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Mail className="h-4 w-4" />
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

        <TabsContent value="gift-cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gift Cards</CardTitle>
              <CardDescription>
                Traditional gift cards for monetary value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {giftCardsData.filter(gc => gc.type === 'Gift Card').map((giftCard) => (
                  <Card key={giftCard.id} className="relative">
                    <CardContent className="p-4">
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(giftCard.status)}
                      </div>
                      <div className="space-y-2 pr-16">
                        <h3 className="font-semibold font-mono text-sm">{giftCard.code}</h3>
                        <p className="text-sm text-muted-foreground">To: {giftCard.recipientName}</p>
                        <p className="text-sm text-muted-foreground">From: {giftCard.purchasedBy}</p>
                        <Separator />
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Original Value:</span>
                            <span className="font-medium">{formatCurrency(giftCard.amount)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Balance:</span>
                            <span className="font-medium text-oud-600">{formatCurrency(giftCard.balance)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Used:</span>
                            <span className="font-medium">{formatCurrency(giftCard.amount - giftCard.balance)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Expires:</span>
                            <span className="font-medium">{giftCard.expiryDate}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => setSelectedGiftCard(giftCard)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vouchers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vouchers & Promotional Codes</CardTitle>
              <CardDescription>
                Special offers and promotional vouchers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {giftCardsData.filter(gc => gc.type === 'Voucher').map((voucher) => (
                  <Card key={voucher.id} className="relative">
                    <CardContent className="p-4">
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(voucher.status)}
                      </div>
                      <div className="space-y-2 pr-16">
                        <h3 className="font-semibold font-mono text-sm">{voucher.code}</h3>
                        <p className="text-sm text-muted-foreground">For: {voucher.recipientName}</p>
                        <p className="text-sm text-muted-foreground">Template: {voucher.designTemplate}</p>
                        <Separator />
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Value:</span>
                            <span className="font-medium">{formatCurrency(voucher.amount)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Balance:</span>
                            <span className="font-medium text-oud-600">{formatCurrency(voucher.balance)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Expires:</span>
                            <span className="font-medium">{voucher.expiryDate}</span>
                          </div>
                          {voucher.restrictions && (
                            <div className="text-xs text-muted-foreground mt-2">
                              <p className="font-medium">Restrictions:</p>
                              <p>{voucher.restrictions}</p>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => setSelectedGiftCard(voucher)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Redemption Rates</CardTitle>
                <CardDescription>
                  Gift card usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Fully Redeemed</span>
                      <span>1 cards (33%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Partially Used</span>
                      <span>1 cards (33%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Unused</span>
                      <span>1 cards (33%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Templates</CardTitle>
                <CardDescription>
                  Most used gift card designs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Birthday', 'Corporate', 'Loyalty'].map((template) => {
                    const count = giftCardsData.filter(gc => gc.designTemplate === template).length;
                    const percentage = count > 0 ? (count / giftCardsData.length) * 100 : 0;
                    return (
                      <div key={template} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-oud-600" />
                          <span>{template}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{count} cards</p>
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

      {/* Gift Card Details Dialog */}
      {selectedGiftCard && (
        <Dialog open={!!selectedGiftCard} onOpenChange={() => setSelectedGiftCard(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Gift Card Details - {selectedGiftCard.code}
                {getStatusBadge(selectedGiftCard.status)}
              </DialogTitle>
              <DialogDescription>
                Complete information for this gift card
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm">{selectedGiftCard.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Design Template</Label>
                  <p className="text-sm">{selectedGiftCard.designTemplate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Purchased By</Label>
                  <p className="text-sm">{selectedGiftCard.purchasedBy}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Recipient</Label>
                  <p className="text-sm">{selectedGiftCard.recipientName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Issue Date</Label>
                  <p className="text-sm">{selectedGiftCard.issueDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Expiry Date</Label>
                  <p className="text-sm">{selectedGiftCard.expiryDate}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Original Amount:</span>
                  <span className="font-medium">{formatCurrency(selectedGiftCard.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Used Amount:</span>
                  <span className="font-medium">{formatCurrency(selectedGiftCard.amount - selectedGiftCard.balance)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Remaining Balance:</span>
                  <span className="text-oud-600">{formatCurrency(selectedGiftCard.balance)}</span>
                </div>
              </div>

              {selectedGiftCard.message && (
                <div>
                  <Label className="text-sm font-medium">Personal Message</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedGiftCard.message}</p>
                </div>
              )}

              {selectedGiftCard.restrictions && (
                <div>
                  <Label className="text-sm font-medium">Restrictions</Label>
                  <p className="text-sm bg-yellow-50 p-2 rounded border border-yellow-200">{selectedGiftCard.restrictions}</p>
                </div>
              )}

              {selectedGiftCard.usageHistory.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Usage History</Label>
                  <div className="mt-2 space-y-2">
                    {selectedGiftCard.usageHistory.map((usage, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <div>
                          <p className="text-sm font-medium">{usage.date}</p>
                          <p className="text-xs text-muted-foreground">
                            Order: {usage.order} • Store: {usage.store}
                          </p>
                        </div>
                        <p className="font-medium text-red-600">-{formatCurrency(usage.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Resend
                </Button>
                {selectedGiftCard.balance > 0 && (
                  <Button className="bg-oud-600 hover:bg-oud-700">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Redemption
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}