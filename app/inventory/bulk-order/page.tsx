'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  Plus,
  Trash2,
  Upload,
  Download,
  Calculator,
  ShoppingCart,
  Truck,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  DollarSign,
  FileText,
  Save,
  Edit3,
  Eye
} from 'lucide-react';

interface BulkOrderItem {
  id: string;
  materialId: string;
  materialName: string;
  materialNameArabic: string;
  sku: string;
  currentStock: number;
  requestedQuantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier: string;
  leadTime: number; // days
  minimumOrderQuantity: number;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  notes?: string;
}

interface BulkOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  requestedBy: string;
  department: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  expectedDeliveryDate: string;
  totalItems: number;
  totalCost: number;
  currency: string;
  approvedBy?: string;
  approvalDate?: string;
  notes: string;
  items: BulkOrderItem[];
}

export default function BulkOrderPage() {
  const [orders, setOrders] = useState<BulkOrder[]>([
    {
      id: '1',
      orderNumber: 'BO-2024-001',
      orderDate: '2024-09-30',
      requestedBy: 'Ahmad Hassan',
      department: 'Production',
      status: 'PENDING_APPROVAL',
      priority: 'HIGH',
      expectedDeliveryDate: '2024-10-15',
      totalItems: 5,
      totalCost: 125000,
      currency: 'AED',
      notes: 'Urgent restock for Q4 production schedule',
      items: [
        {
          id: '1',
          materialId: 'MAT-001',
          materialName: 'Royal Oud Oil',
          materialNameArabic: 'زيت العود الملكي',
          sku: 'ROO-001',
          currentStock: 25,
          requestedQuantity: 500,
          unit: 'ml',
          unitCost: 450,
          totalCost: 225000,
          supplier: 'Cambodia Oud Traders',
          leadTime: 14,
          minimumOrderQuantity: 100,
          category: 'Oud Oil',
          priority: 'HIGH'
        }
      ]
    }
  ]);

  const [currentOrder, setCurrentOrder] = useState<BulkOrder | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderItems, setOrderItems] = useState<BulkOrderItem[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');

  const mockMaterials = [
    { id: 'MAT-001', name: 'Royal Oud Oil', nameArabic: 'زيت العود الملكي', sku: 'ROO-001', currentStock: 25, unit: 'ml', unitCost: 450, supplier: 'Cambodia Oud Traders', category: 'Oud Oil', minimumOrderQuantity: 100, leadTime: 14 },
    { id: 'MAT-002', name: 'Rose Petals Bulgarian', nameArabic: 'بتلات الورد البلغارية', sku: 'RPB-002', currentStock: 2.5, unit: 'kg', unitCost: 180, supplier: 'Bulgarian Rose Co.', category: 'Floral Materials', minimumOrderQuantity: 5, leadTime: 21 },
    { id: 'MAT-003', name: 'Saffron Threads', nameArabic: 'خيوط الزعفران', sku: 'SAF-003', currentStock: 0, unit: 'gram', unitCost: 12, supplier: 'Kashmir Saffron House', category: 'Spices', minimumOrderQuantity: 250, leadTime: 28 }
  ];

  const addItemToOrder = () => {
    const material = mockMaterials.find(m => m.id === selectedMaterial);
    if (!material) return;

    const newItem: BulkOrderItem = {
      id: Date.now().toString(),
      materialId: material.id,
      materialName: material.name,
      materialNameArabic: material.nameArabic,
      sku: material.sku,
      currentStock: material.currentStock,
      requestedQuantity: material.minimumOrderQuantity,
      unit: material.unit,
      unitCost: material.unitCost,
      totalCost: material.unitCost * material.minimumOrderQuantity,
      supplier: material.supplier,
      leadTime: material.leadTime,
      minimumOrderQuantity: material.minimumOrderQuantity,
      category: material.category,
      priority: 'MEDIUM'
    };

    setOrderItems(prev => [...prev, newItem]);
    setSelectedMaterial('');
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setOrderItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, requestedQuantity: quantity, totalCost: quantity * item.unitCost }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateOrderTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalCost, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'ORDERED': return 'bg-purple-100 text-purple-800';
      case 'PARTIALLY_RECEIVED': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Order Management</h1>
          <p className="text-gray-600">
            Create and manage bulk orders for raw materials and inventory restocking
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Order
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button
            onClick={() => setIsCreatingOrder(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Bulk Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-xs text-gray-500 mt-1">Pending & in progress</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">AED 890K</div>
            <p className="text-xs text-gray-500 mt-1">This quarter</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Lead Time</CardTitle>
            <Truck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">18 days</div>
            <p className="text-xs text-gray-500 mt-1">Average delivery time</p>
          </CardContent>
        </Card>
      </div>

      {isCreatingOrder ? (
        // Create New Order Form
        <div className="space-y-6">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2 text-amber-600" />
                Create New Bulk Order
              </CardTitle>
              <CardDescription>Add multiple items to create a comprehensive bulk order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Order Header Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="quality">Quality Control</SelectItem>
                        <SelectItem value="packaging">Packaging</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Order Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedDelivery">Expected Delivery</Label>
                    <Input type="date" />
                  </div>
                </div>

                {/* Add Items Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Add Items to Order</h3>
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1">
                      <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockMaterials.map(material => (
                            <SelectItem key={material.id} value={material.id}>
                              {material.name} - {material.sku} (Stock: {material.currentStock} {material.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addItemToOrder} disabled={!selectedMaterial}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  {/* Order Items Table */}
                  {orderItems.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Order Items ({orderItems.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Material</TableHead>
                              <TableHead>Current Stock</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Unit Cost</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Supplier</TableHead>
                              <TableHead>Lead Time</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orderItems.map(item => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{item.materialName}</div>
                                    <div className="text-sm text-gray-500">{item.materialNameArabic}</div>
                                    <div className="text-xs text-gray-400">SKU: {item.sku}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-center">
                                    <span className={`font-medium ${item.currentStock <= 0 ? 'text-red-600' : item.currentStock < item.minimumOrderQuantity ? 'text-orange-600' : 'text-green-600'}`}>
                                      {item.currentStock} {item.unit}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={item.requestedQuantity}
                                    onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                                    className="w-20"
                                    min={item.minimumOrderQuantity}
                                  />
                                  <div className="text-xs text-gray-500 mt-1">
                                    Min: {item.minimumOrderQuantity} {item.unit}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-right">
                                    <div className="font-medium">AED {item.unitCost}</div>
                                    <div className="text-xs text-gray-500">per {item.unit}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-right font-medium">
                                    AED {item.totalCost.toLocaleString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">{item.supplier}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-center">
                                    <span className="text-sm">{item.leadTime} days</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {/* Order Summary */}
                        <div className="mt-6 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">Total Items: {orderItems.length}</p>
                              <p className="text-sm text-gray-600">
                                Estimated Lead Time: {Math.max(...orderItems.map(item => item.leadTime))} days
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                AED {calculateOrderTotal().toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">Total Order Value</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Order Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any special instructions or notes for this bulk order..."
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreatingOrder(false);
                        setOrderItems([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        Save as Draft
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-amber-600 to-orange-600"
                        disabled={orderItems.length === 0}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit for Approval
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Orders List
        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-amber-600" />
              Bulk Orders
            </CardTitle>
            <CardDescription>
              Manage and track all bulk orders for inventory restocking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id} className="hover:bg-amber-50/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{order.requestedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>{order.department}</TableCell>
                    <TableCell>
                      <div className="text-center">
                        <span className="font-medium">{order.totalItems}</span>
                        <div className="text-xs text-gray-500">items</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <div className="font-medium">
                          {order.currency} {order.totalCost.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}