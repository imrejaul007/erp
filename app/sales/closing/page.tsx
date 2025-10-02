'use client';

import React, { useState } from 'react';
import { Clock, DollarSign, CreditCard, Banknote, Calculator, FileText, CheckCircle, AlertTriangle, Lock, Unlock, Calendar, Users, Package, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Mock data for daily sales closing
const todaySalesData = {
  date: '2024-10-01',
  shift: 'Full Day',
  openingTime: '09:00 AM',
  closingTime: '10:00 PM',
  cashier: 'Sarah Ahmad',
  supervisor: 'Manager Ali',
  status: 'Open',

  // Cash register data
  openingCash: 1000.00,
  expectedClosingCash: 2450.00,
  actualCash: 0.00, // To be entered during closing
  cashVariance: 0.00,

  // Sales breakdown
  totalSales: 12450.00,
  totalTransactions: 28,
  averageTransaction: 444.64,

  // Payment methods
  paymentMethods: [
    { method: 'Cash', amount: 3200.00, count: 8, percentage: 25.7 },
    { method: 'Credit Card', amount: 5800.00, count: 12, percentage: 46.6 },
    { method: 'Debit Card', amount: 2150.00, count: 5, percentage: 17.3 },
    { method: 'Bank Transfer', amount: 1300.00, count: 3, percentage: 10.4 },
  ],

  // Product categories
  categorySales: [
    { category: 'Oud', amount: 6800.00, count: 12, percentage: 54.6 },
    { category: 'Rose', amount: 2400.00, count: 7, percentage: 19.3 },
    { category: 'Amber', amount: 1800.00, count: 5, percentage: 14.5 },
    { category: 'Musk', amount: 1450.00, count: 4, percentage: 11.6 },
  ],

  // Discounts and adjustments
  totalDiscounts: 850.00,
  voucherRedemptions: 320.00,
  returns: 180.00,
  exchanges: 90.00,

  // VAT breakdown
  vatAmount: 622.50,
  taxExemptSales: 0.00,

  // Staff and operations
  staffHours: 26,
  customerCount: 45,
  loyaltySignups: 3,

  // Issues and notes
  voids: 2,
  voidAmount: 125.00,
  noSales: 0,
  systemDowntime: 0,
  notes: '',
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Open': 'default',
    'Closed': 'secondary',
    'Pending': 'outline',
    'Discrepancy': 'destructive',
  };

  const icons = {
    'Open': Unlock,
    'Closed': Lock,
    'Pending': Clock,
    'Discrepancy': AlertTriangle,
  };

  const Icon = icons[status as keyof typeof icons] || Clock;

  return (
    <Badge variant={variants[status] || 'outline'} className="gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
};

export default function SalesClosingPage() {
  const [actualCash, setActualCash] = useState('');
  const [closingNotes, setClosingNotes] = useState('');
  const [isClosingDialogOpen, setIsClosingDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2024-10-01');

  const cashVariance = actualCash ? parseFloat(actualCash) - todaySalesData.expectedClosingCash : 0;
  const closingProgress = actualCash ? 75 : 25; // Mock progress based on cash entry

  const handleClosingProcess = () => {
    // Here you would process the closing
    console.log('Processing sales closing:', {
      actualCash: parseFloat(actualCash),
      variance: cashVariance,
      notes: closingNotes
    });
    setIsClosingDialogOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-8 w-8 text-oud-600" />
            Daily Sales Closing
          </h1>
          <p className="text-muted-foreground mt-1">
            End-of-day procedures and cash reconciliation
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isClosingDialogOpen} onOpenChange={setIsClosingDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 bg-oud-600 hover:bg-oud-700"
                disabled={todaySalesData.status === 'Closed'}
              >
                <Lock className="h-4 w-4" />
                Close Day
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Status Banner */}
      <Card className="border-l-4 border-l-oud-500">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-semibold">Today's Status</h3>
                <p className="text-sm text-muted-foreground">
                  {todaySalesData.date} • {todaySalesData.shift} • Cashier: {todaySalesData.cashier}
                </p>
              </div>
              {getStatusBadge(todaySalesData.status)}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Closing Progress</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={closingProgress} className="w-32" />
                <span className="text-sm font-medium">{closingProgress}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(todaySalesData.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              {todaySalesData.totalTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Cash</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(todaySalesData.expectedClosingCash)}</div>
            <p className="text-xs text-muted-foreground">
              Opening: {formatCurrency(todaySalesData.openingCash)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VAT Collected</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(todaySalesData.vatAmount)}</div>
            <p className="text-xs text-muted-foreground">
              5% VAT on sales
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers Served</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{todaySalesData.customerCount}</div>
            <p className="text-xs text-muted-foreground">
              {todaySalesData.loyaltySignups} new loyalty members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="products">Product Sales</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
          <TabsTrigger value="reconciliation">Cash Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Summary</CardTitle>
                <CardDescription>Today's performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Gross Sales:</span>
                  <span className="font-medium">{formatCurrency(todaySalesData.totalSales + todaySalesData.totalDiscounts)}</span>
                </div>
                <div className="flex justify-between items-center text-red-600">
                  <span>Total Discounts:</span>
                  <span className="font-medium">-{formatCurrency(todaySalesData.totalDiscounts)}</span>
                </div>
                <div className="flex justify-between items-center text-red-600">
                  <span>Returns:</span>
                  <span className="font-medium">-{formatCurrency(todaySalesData.returns)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Net Sales:</span>
                  <span className="text-oud-600">{formatCurrency(todaySalesData.totalSales)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span>VAT (5%):</span>
                  <span className="font-medium">{formatCurrency(todaySalesData.vatAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Transaction:</span>
                  <span className="font-medium">{formatCurrency(todaySalesData.averageTransaction)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Summary</CardTitle>
                <CardDescription>Today's operational metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Opening Time:</span>
                  <span className="font-medium">{todaySalesData.openingTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Current Time:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Staff Hours:</span>
                  <span className="font-medium">{todaySalesData.staffHours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>System Downtime:</span>
                  <span className="font-medium">{todaySalesData.systemDowntime} minutes</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span>Void Transactions:</span>
                  <span className="font-medium">{todaySalesData.voids} ({formatCurrency(todaySalesData.voidAmount)})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>No Sales:</span>
                  <span className="font-medium">{todaySalesData.noSales}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Breakdown</CardTitle>
              <CardDescription>Analysis of payment methods used today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySalesData.paymentMethods.map((payment) => (
                  <div key={payment.method} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-oud-600" />
                        <span className="font-medium">{payment.method}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-muted-foreground">{payment.count} transactions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={payment.percentage} className="flex-1" />
                      <span className="text-sm font-medium">{payment.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Category Performance</CardTitle>
              <CardDescription>Sales breakdown by product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySalesData.categorySales.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-oud-600" />
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(category.amount)}</p>
                        <p className="text-sm text-muted-foreground">{category.count} items sold</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={category.percentage} className="flex-1" />
                      <span className="text-sm font-medium">{category.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Adjustments</CardTitle>
              <CardDescription>Discounts, returns, and other adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Discounts Applied</Label>
                    <div className="text-xl sm:text-2xl font-bold text-red-600">-{formatCurrency(todaySalesData.totalDiscounts)}</div>
                    <p className="text-sm text-muted-foreground">Manual discounts and promotions</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Voucher Redemptions</Label>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">-{formatCurrency(todaySalesData.voucherRedemptions)}</div>
                    <p className="text-sm text-muted-foreground">Gift cards and vouchers used</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Returns Processed</Label>
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">-{formatCurrency(todaySalesData.returns)}</div>
                    <p className="text-sm text-muted-foreground">Customer returns</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Exchanges</Label>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">{formatCurrency(todaySalesData.exchanges)}</div>
                    <p className="text-sm text-muted-foreground">Product exchanges</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Reconciliation</CardTitle>
              <CardDescription>Compare expected vs actual cash</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Opening Cash</Label>
                  <div className="text-xl font-bold">{formatCurrency(todaySalesData.openingCash)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Cash Sales</Label>
                  <div className="text-xl font-bold">+{formatCurrency(todaySalesData.paymentMethods.find(p => p.method === 'Cash')?.amount || 0)}</div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Expected Closing Cash</Label>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{formatCurrency(todaySalesData.expectedClosingCash)}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="actual-cash">Actual Cash Count *</Label>
                <Input
                  id="actual-cash"
                  type="number"
                  step="0.01"
                  placeholder="Enter actual cash amount"
                  value={actualCash}
                  onChange={(e) => setActualCash(e.target.value)}
                />
              </div>
              {actualCash && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Cash Variance</Label>
                  <div className={`text-xl sm:text-2xl font-bold ${cashVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {cashVariance >= 0 ? '+' : ''}{formatCurrency(cashVariance)}
                  </div>
                  {Math.abs(cashVariance) > 10 && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Large variance detected - please verify count</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Closing Process Dialog */}
      <Dialog open={isClosingDialogOpen} onOpenChange={setIsClosingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Daily Sales Closing</DialogTitle>
            <DialogDescription>
              Finalize today's sales and prepare for next business day
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Date</Label>
                <p className="text-sm">{todaySalesData.date}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Cashier</Label>
                <p className="text-sm">{todaySalesData.cashier}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Final Cash Count (Required)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter final cash count"
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
              />
              {actualCash && (
                <div className="flex justify-between text-sm">
                  <span>Expected: {formatCurrency(todaySalesData.expectedClosingCash)}</span>
                  <span className={cashVariance >= 0 ? 'text-green-600' : 'text-red-600'}>
                    Variance: {cashVariance >= 0 ? '+' : ''}{formatCurrency(cashVariance)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Closing Notes</Label>
              <Textarea
                placeholder="Any issues, discrepancies, or notes about today's operations..."
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Summary</Label>
              <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Sales:</span>
                  <span className="font-medium">{formatCurrency(todaySalesData.totalSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Transactions:</span>
                  <span className="font-medium">{todaySalesData.totalTransactions}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT Collected:</span>
                  <span className="font-medium">{formatCurrency(todaySalesData.vatAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customers Served:</span>
                  <span className="font-medium">{todaySalesData.customerCount}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsClosingDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-oud-600 hover:bg-oud-700"
                onClick={handleClosingProcess}
                disabled={!actualCash}
              >
                <Lock className="h-4 w-4 mr-2" />
                Complete Closing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}