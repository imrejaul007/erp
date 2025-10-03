'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, DollarSign, Package, User, CreditCard, Clock, CheckCircle,
  ArrowLeft} from 'lucide-react';

export default function LayawayPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');

  // Mock data
  const layawayOrders = [
    {
      id: 'LAY-001',
      customer: 'Ahmed Al Mansoori',
      product: 'Royal Oud Perfume 100ml',
      totalPrice: 1500.00,
      paidAmount: 500.00,
      remainingAmount: 1000.00,
      downPayment: 500.00,
      installments: 3,
      nextPaymentDate: '2024-02-15',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: 'LAY-002',
      customer: 'Fatima Hassan',
      product: 'Premium Oud Set',
      totalPrice: 3000.00,
      paidAmount: 3000.00,
      remainingAmount: 0.00,
      downPayment: 1000.00,
      installments: 2,
      nextPaymentDate: null,
      status: 'completed',
      createdAt: '2024-01-10',
    },
    {
      id: 'LAY-003',
      customer: 'Mohammed Ali',
      product: 'Oud Chips 500g',
      totalPrice: 2500.00,
      paidAmount: 500.00,
      remainingAmount: 2000.00,
      downPayment: 500.00,
      installments: 4,
      nextPaymentDate: '2024-02-20',
      status: 'overdue',
      createdAt: '2024-01-05',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = layawayOrders.filter((order) => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  return (
    <div className="space-y-6">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Layaway / Partial Payments
          </h1>
          <p className="text-gray-600 mt-2">
            Manage customer reservations and installment plans
          </p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
          <Package className="mr-2 h-4 w-4" />
          New Layaway Order
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {layawayOrders.filter((o) => o.status === 'active').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              AED {layawayOrders.filter((o) => o.status === 'active').reduce((sum, o) => sum + o.remainingAmount, 0).toFixed(2)} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {layawayOrders.reduce((sum, o) => sum + o.paidAmount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-gray-600 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {layawayOrders.filter((o) => o.status === 'overdue').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {layawayOrders.filter((o) => o.status === 'completed').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Layaway Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Layaway Orders</CardTitle>
          <CardDescription>Track and manage customer payment plans</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-amber-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Created on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">
                          AED {order.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Total Price</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{order.customer}</p>
                          <p className="text-xs text-gray-600">Customer</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{order.product}</p>
                          <p className="text-xs text-gray-600">Product</p>
                        </div>
                      </div>

                      {order.nextPaymentDate && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(order.nextPaymentDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-600">Next Payment</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment Progress</span>
                        <span className="font-medium">
                          {((order.paidAmount / order.totalPrice) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
                          style={{ width: `${(order.paidAmount / order.totalPrice) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 font-medium">
                          Paid: AED {order.paidAmount.toFixed(2)}
                        </span>
                        <span className="text-red-600 font-medium">
                          Remaining: AED {order.remainingAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    {order.status === 'active' && (
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Record Payment
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Payment History
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No {activeTab !== 'all' ? activeTab : ''} layaway orders found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
