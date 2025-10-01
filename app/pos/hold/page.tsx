'use client';

import { useState } from 'react';
import { Pause, Play, Save, Clock, User, Package, DollarSign, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Mock data for held bills
const heldBills = [
  {
    id: 'HOLD-001',
    holdTime: '2024-10-01 14:30',
    customer: 'Ahmed Al-Mansouri',
    customerPhone: '+971 50 123 4567',
    items: [
      { name: 'Royal Oud Premium', quantity: 1, price: 450.00, total: 450.00 },
      { name: 'Rose Garden Collection', quantity: 2, price: 280.00, total: 560.00 },
    ],
    subtotal: 1010.00,
    discount: 50.50,
    tax: 47.98,
    total: 1007.48,
    holdReason: 'Customer checking with family',
    staffMember: 'Sarah Ahmad',
    priority: 'Normal',
    estimatedReturn: '2024-10-01 16:00',
    notes: 'Customer interested but wants to consult family about fragrance choice',
  },
  {
    id: 'HOLD-002',
    holdTime: '2024-10-01 15:45',
    customer: 'Fatima Hassan',
    customerPhone: '+971 55 987 6543',
    items: [
      { name: 'Amber Essence Deluxe', quantity: 1, price: 320.00, total: 320.00 },
      { name: 'Sandalwood Serenity', quantity: 1, price: 380.00, total: 380.00 },
    ],
    subtotal: 700.00,
    discount: 0,
    tax: 35.00,
    total: 735.00,
    holdReason: 'Payment method issue',
    staffMember: 'Omar Hassan',
    priority: 'High',
    estimatedReturn: '2024-10-01 17:30',
    notes: 'Customer needs to get cash from ATM, will return shortly',
  },
  {
    id: 'HOLD-003',
    holdTime: '2024-10-01 12:15',
    customer: 'Mohammed Saeed',
    customerPhone: '+971 52 456 7890',
    items: [
      { name: 'Musk Al-Haramain', quantity: 3, price: 220.00, total: 660.00 },
    ],
    subtotal: 660.00,
    discount: 66.00,
    tax: 29.70,
    total: 623.70,
    holdReason: 'Gift wrapping consultation',
    staffMember: 'Layla Al-Rashid',
    priority: 'Normal',
    estimatedReturn: '2024-10-01 18:00',
    notes: 'Customer wants special gift wrapping for wedding anniversary',
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

const formatTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const getTimeSinceHold = (holdTime: string): string => {
  const now = new Date();
  const hold = new Date(holdTime);
  const diffMs = now.getTime() - hold.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else {
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m ago`;
  }
};

const getPriorityBadge = (priority: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'High': 'destructive',
    'Normal': 'secondary',
    'Low': 'outline',
  };
  return <Badge variant={variants[priority] || 'secondary'}>{priority}</Badge>;
};

export default function HoldBillPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBill, setSelectedBill] = useState<typeof heldBills[0] | null>(null);
  const [isHoldDialogOpen, setIsHoldDialogOpen] = useState(false);
  const [currentBill] = useState({
    items: [
      { name: 'Royal Oud Premium', quantity: 1, price: 450.00, total: 450.00 },
      { name: 'Amber Essence', quantity: 1, price: 280.00, total: 280.00 },
    ],
    subtotal: 730.00,
    discount: 36.50,
    tax: 34.68,
    total: 728.18,
  });

  const filteredBills = heldBills.filter(bill => {
    const matchesSearch = bill.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || bill.priority.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalHeldBills = heldBills.length;
  const totalHeldValue = heldBills.reduce((sum, bill) => sum + bill.total, 0);
  const highPriorityBills = heldBills.filter(bill => bill.priority === 'High').length;

  const handleHoldBill = (holdData: any) => {
    console.log('Holding bill:', holdData);
    setIsHoldDialogOpen(false);
  };

  const handleResumeBill = (billId: string) => {
    console.log('Resuming bill:', billId);
    // Logic to resume the bill in POS
  };

  const handleDeleteBill = (billId: string) => {
    console.log('Deleting held bill:', billId);
    // Logic to delete the held bill
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Pause className="h-8 w-8 text-oud-600" />
            Hold & Resume Bills
          </h1>
          <p className="text-muted-foreground mt-1">
            Temporarily hold transactions and resume them later
          </p>
        </div>
        <Dialog open={isHoldDialogOpen} onOpenChange={setIsHoldDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
              <Pause className="h-4 w-4" />
              Hold Current Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Hold Current Bill</DialogTitle>
              <DialogDescription>
                Temporarily save the current transaction to resume later
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Current Bill Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Bill Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentBill.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.quantity}x {item.name}</span>
                        <span>{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-oud-600">{formatCurrency(currentBill.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hold Details Form */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input id="customer-name" placeholder="Enter customer name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">Phone Number</Label>
                    <Input id="customer-phone" placeholder="+971 50 123 4567" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hold-reason">Hold Reason</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer-consultation">Customer needs consultation</SelectItem>
                        <SelectItem value="payment-issue">Payment method issue</SelectItem>
                        <SelectItem value="gift-wrapping">Gift wrapping required</SelectItem>
                        <SelectItem value="family-consultation">Consulting with family</SelectItem>
                        <SelectItem value="price-check">Price verification needed</SelectItem>
                        <SelectItem value="inventory-check">Inventory verification</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated-return">Estimated Return Time</Label>
                  <Input id="estimated-return" type="datetime-local" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional information about the hold..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsHoldDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-oud-600 hover:bg-oud-700"
                  onClick={() => handleHoldBill({})}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Hold Bill
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
            <CardTitle className="text-sm font-medium">Held Bills</CardTitle>
            <Pause className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHeldBills}</div>
            <p className="text-xs text-muted-foreground">
              Currently on hold
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Held Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalHeldValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total transaction value
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityBills}</div>
            <p className="text-xs text-muted-foreground">
              Urgent transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Hold Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h 15m</div>
            <p className="text-xs text-muted-foreground">
              Average duration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="held-bills" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="held-bills">Held Bills</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="held-bills" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by customer name, phone, or bill ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="normal">Normal Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Held Bills Table */}
          <Card>
            <CardHeader>
              <CardTitle>Held Transactions</CardTitle>
              <CardDescription>
                All currently held bills awaiting completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Hold Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{bill.customer}</p>
                            <p className="text-sm text-muted-foreground">{bill.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{bill.items.length} items</TableCell>
                        <TableCell className="font-medium text-oud-600">
                          {formatCurrency(bill.total)}
                        </TableCell>
                        <TableCell>{formatTime(bill.holdTime)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getTimeSinceHold(bill.holdTime)}</Badge>
                        </TableCell>
                        <TableCell>{getPriorityBadge(bill.priority)}</TableCell>
                        <TableCell>{bill.staffMember}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedBill(bill)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="icon"
                              onClick={() => handleResumeBill(bill.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteBill(bill.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick Resume Buttons */}
            {heldBills.slice(0, 6).map((bill) => (
              <Card key={bill.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{bill.id}</h3>
                    {getPriorityBadge(bill.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{bill.customer}</p>
                  <p className="text-sm text-muted-foreground mb-2">{bill.customerPhone}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-oud-600">{formatCurrency(bill.total)}</span>
                    <span className="text-xs text-muted-foreground">{getTimeSinceHold(bill.holdTime)}</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleResumeBill(bill.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume Bill
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bill Details Dialog */}
      {selectedBill && (
        <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Held Bill Details - {selectedBill.id}
                {getPriorityBadge(selectedBill.priority)}
              </DialogTitle>
              <DialogDescription>
                Complete information for this held transaction
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm">{selectedBill.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedBill.customerPhone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Hold Time</Label>
                  <p className="text-sm">{selectedBill.holdTime}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm">{getTimeSinceHold(selectedBill.holdTime)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Staff Member</Label>
                  <p className="text-sm">{selectedBill.staffMember}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hold Reason</Label>
                  <p className="text-sm">{selectedBill.holdReason}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium">Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedBill.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} • {formatCurrency(item.price)} each
                        </p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedBill.subtotal)}</span>
                </div>
                {selectedBill.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedBill.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span>{formatCurrency(selectedBill.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-oud-600">{formatCurrency(selectedBill.total)}</span>
                </div>
              </div>
              {selectedBill.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedBill.notes}</p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedBill(null)}>
                  Close
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleResumeBill(selectedBill.id);
                    setSelectedBill(null);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume Bill
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}