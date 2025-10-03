'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  Package,
  Users,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Download,
  Send,
  BarChart3,
} from 'lucide-react';

interface AffectedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
  quantity: number;
  purchaseDate: string;
  notified: boolean;
  refunded: boolean;
  returned: boolean;
}

interface BatchRecall {
  id: string;
  recallNumber: string;
  batchNumber: string;
  product: {
    name: string;
    sku: string;
    category: string;
  };
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  issueDate: string;
  quantityProduced: number;
  quantitySold: number;
  quantityInStock: number;
  affectedCustomers: AffectedCustomer[];
  status: 'identified' | 'notifying' | 'in_progress' | 'completed' | 'closed';
  complianceReports: {
    name: string;
    date: string;
    status: 'pending' | 'filed' | 'approved';
  }[];
  notes: string;
}

export default function BatchRecallPage() {
  const [activeTab, setActiveTab] = useState('active');

  // Mock data
  const recalls: BatchRecall[] = [
    {
      id: '1',
      recallNumber: 'RCL-2024-001',
      batchNumber: 'BATCH-2024-001',
      product: {
        name: 'Premium Oud Chips 100g',
        sku: 'OUD-PREM-100G',
        category: 'Raw Materials',
      },
      reason: 'Inconsistent quality - some chips not producing adequate smoke when burned',
      severity: 'medium',
      issueDate: '2024-01-20',
      quantityProduced: 500,
      quantitySold: 280,
      quantityInStock: 220,
      affectedCustomers: [
        {
          id: 'C1',
          name: 'Mohammed Ali',
          email: 'mohammed@example.com',
          phone: '+971503344556',
          orderNumber: 'ORD-2024-105',
          quantity: 2,
          purchaseDate: '2024-01-15',
          notified: true,
          refunded: false,
          returned: false,
        },
        {
          id: 'C2',
          name: 'Ahmed Hassan',
          email: 'ahmed.hassan@example.com',
          phone: '+971507788990',
          orderNumber: 'ORD-2024-112',
          quantity: 1,
          purchaseDate: '2024-01-18',
          notified: true,
          refunded: true,
          returned: true,
        },
        {
          id: 'C3',
          name: 'Fatima Abdullah',
          email: 'fatima@example.com',
          phone: '+971509988776',
          orderNumber: 'ORD-2024-118',
          quantity: 3,
          purchaseDate: '2024-01-19',
          notified: false,
          refunded: false,
          returned: false,
        },
      ],
      status: 'in_progress',
      complianceReports: [
        {
          name: 'UAE Quality Control Report',
          date: '2024-01-20',
          status: 'filed',
        },
        {
          name: 'Customer Notification Log',
          date: '2024-01-21',
          status: 'pending',
        },
      ],
      notes: 'Supplier quality issue identified. Source: Malaysian supplier batch #ML-2024-A. Investigating root cause with supplier.',
    },
    {
      id: '2',
      recallNumber: 'RCL-2024-002',
      batchNumber: 'BATCH-2023-345',
      product: {
        name: 'Rose Attar Perfume 50ml',
        sku: 'PERF-ROSE-50ML',
        category: 'Finished Goods',
      },
      reason: 'Packaging defect - cap seal not properly secured, potential leakage',
      severity: 'low',
      issueDate: '2024-01-10',
      quantityProduced: 200,
      quantitySold: 45,
      quantityInStock: 155,
      affectedCustomers: [
        {
          id: 'C4',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+971501122334',
          orderNumber: 'ORD-2024-095',
          quantity: 1,
          purchaseDate: '2024-01-08',
          notified: true,
          refunded: true,
          returned: true,
        },
      ],
      status: 'completed',
      complianceReports: [
        {
          name: 'Packaging Defect Report',
          date: '2024-01-10',
          status: 'approved',
        },
        {
          name: 'Corrective Action Plan',
          date: '2024-01-11',
          status: 'approved',
        },
      ],
      notes: 'Packaging supplier has been notified. All remaining stock re-sealed. Issue resolved.',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified':
        return 'bg-red-100 text-red-800';
      case 'notifying':
        return 'bg-orange-100 text-orange-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecalls = recalls.filter((recall) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['identified', 'notifying', 'in_progress'].includes(recall.status);
    return recall.status === activeTab;
  });

  const totalRecalls = recalls.length;
  const activeRecalls = recalls.filter((r) => ['identified', 'notifying', 'in_progress'].includes(r.status)).length;
  const totalAffectedCustomers = recalls.reduce((sum, r) => sum + r.affectedCustomers.length, 0);
  const totalAffectedUnits = recalls.reduce((sum, r) => sum + r.quantitySold, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            Batch Recall System
          </h1>
          <p className="text-gray-600 mt-2">
            Track quality issues, notify customers, and manage regulatory compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-rose-600">
            <Plus className="mr-2 h-4 w-4" />
            New Recall
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Recalls</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeRecalls}</div>
            <p className="text-xs text-gray-600 mt-1">of {totalRecalls} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affected Customers</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAffectedCustomers}</div>
            <p className="text-xs text-gray-600 mt-1">Require notification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affected Units</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAffectedUnits}</div>
            <p className="text-xs text-gray-600 mt-1">Sold units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recalls.reduce((sum, r) => sum + r.complianceReports.length, 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Filed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recall List */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Recalls</CardTitle>
          <CardDescription>All product recalls and quality issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredRecalls.map((recall) => {
                const notifiedCustomers = recall.affectedCustomers.filter((c) => c.notified).length;
                const refundedCustomers = recall.affectedCustomers.filter((c) => c.refunded).length;
                const returnedCustomers = recall.affectedCustomers.filter((c) => c.returned).length;

                return (
                  <Card key={recall.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{recall.product.name}</h3>
                            <Badge className={getStatusColor(recall.status)}>
                              {recall.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge className={getSeverityColor(recall.severity)}>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {recall.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Recall #{recall.recallNumber}</span>
                            <span>Batch #{recall.batchNumber}</span>
                            <span>SKU: {recall.product.sku}</span>
                            <span>Issued: {new Date(recall.issueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="bg-red-50 rounded-lg p-4 mb-4 border border-red-200">
                        <p className="text-sm font-medium text-red-900 mb-1">Recall Reason</p>
                        <p className="text-sm text-red-700">{recall.reason}</p>
                      </div>

                      {/* Quantity Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Produced</p>
                          <p className="text-lg font-bold">{recall.quantityProduced} units</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Sold (Affected)</p>
                          <p className="text-lg font-bold text-red-600">{recall.quantitySold} units</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">In Stock</p>
                          <p className="text-lg font-bold">{recall.quantityInStock} units</p>
                        </div>
                      </div>

                      {/* Affected Customers */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Affected Customers ({recall.affectedCustomers.length})
                          </p>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="outline">
                              {notifiedCustomers} / {recall.affectedCustomers.length} Notified
                            </Badge>
                            <Badge variant="outline">
                              {refundedCustomers} Refunded
                            </Badge>
                            <Badge variant="outline">
                              {returnedCustomers} Returned
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {recall.affectedCustomers.slice(0, 3).map((customer) => (
                            <div
                              key={customer.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{customer.name}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                                  <span>{customer.email}</span>
                                  <span>{customer.phone}</span>
                                  <span>Order: {customer.orderNumber}</span>
                                  <span>{customer.quantity} units</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {customer.notified ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Notified
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                                {customer.refunded && (
                                  <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>
                                )}
                                {customer.returned && (
                                  <Badge className="bg-purple-100 text-purple-800">Returned</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                          {recall.affectedCustomers.length > 3 && (
                            <p className="text-sm text-blue-600 font-medium text-center">
                              +{recall.affectedCustomers.length - 3} more customers
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Compliance Reports */}
                      {recall.complianceReports.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Compliance Reports ({recall.complianceReports.length})
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {recall.complianceReports.map((report, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium text-sm">{report.name}</p>
                                  <p className="text-xs text-gray-600">
                                    {new Date(report.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    report.status === 'approved'
                                      ? 'bg-green-100 text-green-800'
                                      : report.status === 'filed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }
                                >
                                  {report.status.toUpperCase()}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-1">Internal Notes</p>
                        <p className="text-sm text-blue-700">{recall.notes}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {recall.status !== 'completed' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-orange-500 to-red-600"
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Notify Customers
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="mr-2 h-4 w-4" />
                              Email Template
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Analytics
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Export Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredRecalls.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No batch recalls found in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
