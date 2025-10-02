'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
  Calendar,
  User,
  Receipt
} from 'lucide-react';

export default function ShiftReportPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('current');

  const currentShift = {
    id: 'SHIFT-2024-10-01-001',
    cashier: 'POS User',
    startTime: '2024-10-01 09:00:00',
    endTime: null,
    status: 'active',
    openingCash: 1000,
  };

  const salesSummary = {
    totalSales: 15,
    totalRevenue: 25840,
    cash: 12450,
    card: 10390,
    digital: 3000,
    avgTransactionValue: 1722.67,
    highestSale: 4850,
    lowestSale: 450,
  };

  const paymentBreakdown = [
    { method: 'Cash', count: 8, amount: 12450, percentage: 48.2 },
    { method: 'Credit Card', count: 5, amount: 10390, percentage: 40.2 },
    { method: 'Digital Wallet', count: 2, amount: 3000, percentage: 11.6 },
  ];

  const recentTransactions = [
    { id: 'TXN-001', time: '14:30', customer: 'Ahmed Al-Rashid', items: 3, amount: 4850, payment: 'Card', status: 'completed' },
    { id: 'TXN-002', time: '14:15', customer: 'Walk-in', items: 2, amount: 3200, payment: 'Cash', status: 'completed' },
    { id: 'TXN-003', time: '13:45', customer: 'Fatima Hassan', items: 1, amount: 2750, payment: 'Card', status: 'completed' },
    { id: 'TXN-004', time: '13:20', customer: 'Walk-in', items: 4, amount: 1850, payment: 'Cash', status: 'completed' },
    { id: 'TXN-005', time: '12:55', customer: 'Mohammed Ali', items: 2, amount: 3400, payment: 'Digital', status: 'completed' },
  ];

  const topProducts = [
    { name: 'Royal Oud Premium', qty: 8, amount: 8500 },
    { name: 'Rose Attar Deluxe', qty: 6, amount: 4200 },
    { name: 'Oud Chips - Cambodian', qty: 5, amount: 3800 },
    { name: 'Amber Musk Perfume', qty: 4, amount: 2400 },
    { name: 'Wooden Burner Set', qty: 3, amount: 1200 },
  ];

  const cashMovements = [
    { time: '09:00', type: 'Opening Balance', amount: 1000, balance: 1000 },
    { time: '10:30', type: 'Sale - Cash', amount: 850, balance: 1850 },
    { time: '11:15', type: 'Sale - Cash', amount: 1200, balance: 3050 },
    { time: '12:00', type: 'Cash Drop', amount: -2000, balance: 1050 },
    { time: '13:45', type: 'Sale - Cash', amount: 3200, balance: 4250 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8 text-amber-600" />
            Shift Report
          </h1>
          <p className="text-muted-foreground">View and manage shift transactions and cash flow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Shift Info Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Current Shift Details</CardTitle>
              <CardDescription>{currentShift.id}</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Cashier</div>
              <div className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                {currentShift.cashier}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Start Time</div>
              <div className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                {new Date(currentShift.startTime).toLocaleTimeString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Duration</div>
              <div className="font-semibold">5 hours 30 minutes</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Opening Cash</div>
              <div className="font-semibold text-green-600">AED {currentShift.openingCash?.toLocaleString() || "0"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{salesSummary.totalSales}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ShoppingCart className="h-3 w-3" />
              transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              AED {salesSummary.totalRevenue?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +15% vs yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              AED {salesSummary.avgTransactionValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Cash in Register</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              AED {(currentShift.openingCash + salesSummary.cash)?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Opening: AED {currentShift.openingCash}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Shift</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="cash">Cash Movements</TabsTrigger>
        </TabsList>

        {/* Current Shift Tab */}
        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Breakdown</CardTitle>
              <CardDescription>Sales distribution by payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentBreakdown.map((payment) => (
                    <TableRow key={payment.method}>
                      <TableCell className="font-medium">{payment.method}</TableCell>
                      <TableCell>{payment.count}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        AED {payment.amount?.toLocaleString() || "0"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.percentage}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>All transactions in current shift</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">{txn.id}</TableCell>
                      <TableCell>{txn.time}</TableCell>
                      <TableCell>{txn.customer}</TableCell>
                      <TableCell>{txn.items}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{txn.payment}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        AED {txn.amount?.toLocaleString() || "0"}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{txn.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performers in current shift</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.qty} units sold</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        AED {product.amount?.toLocaleString() || "0"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Movements Tab */}
        <TabsContent value="cash">
          <Card>
            <CardHeader>
              <CardTitle>Cash Movements</CardTitle>
              <CardDescription>All cash register activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashMovements.map((movement, index) => (
                    <TableRow key={index}>
                      <TableCell>{movement.time}</TableCell>
                      <TableCell className="font-medium">{movement.type}</TableCell>
                      <TableCell>
                        <span className={movement.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {movement.amount > 0 ? '+' : ''}AED {Math.abs(movement.amount)?.toLocaleString() || "0"}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">
                        AED {movement.balance?.toLocaleString() || "0"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Close Shift Button */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Ready to close your shift?</h3>
              <p className="text-sm text-gray-600">
                Review all transactions and cash before closing the shift
              </p>
            </div>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Receipt className="h-4 w-4 mr-2" />
              Close Shift
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
