'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Edit3,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Package,
  FileText,
  Eye,
  ArrowLeft} from 'lucide-react';

interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  productId: string;
  type: string;
  quantityBefore: number;
  quantityAfter: number;
  quantityChange: number;
  reason: string;
  description?: string | null;
  requiresApproval: boolean;
  approvedAt?: string | null;
  approvedBy?: string | null;
  costImpact?: number | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
    unit?: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

interface AdjustmentAnalytics {
  totalAdjustments: number;
  thisMonthAdjustments: number;
  pendingApprovals: number;
  highImpactAdjustments: number;
  totalCostImpact: number;
  thisMonthCostImpact: number;
  trends: {
    adjustments: number;
    costImpact: number;
  };
  byType: Array<{
    type: string;
    count: number;
    totalQuantityChange: number;
    totalCostImpact: number;
  }>;
  byReason: Array<{
    reason: string;
    count: number;
  }>;
}

export default function StockAdjustmentsPage() {
  const router = useRouter();
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdjustmentAnalytics>({
    totalAdjustments: 0,
    thisMonthAdjustments: 0,
    pendingApprovals: 0,
    highImpactAdjustments: 0,
    totalCostImpact: 0,
    thisMonthCostImpact: 0,
    trends: {
      adjustments: 0,
      costImpact: 0
    },
    byType: [],
    byReason: []
  });

  const [selectedAdjustment, setSelectedAdjustment] = useState<StockAdjustment | null>(null);
  const [isNewAdjustmentOpen, setIsNewAdjustmentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');

  const [newAdjustment, setNewAdjustment] = useState({
    productId: '',
    type: 'DECREASE',
    quantityChange: 0,
    reason: '',
    description: '',
    costImpact: 0,
    requiresApproval: false
  });

  useEffect(() => {
    fetchAdjustmentData();
  }, []);

  const fetchAdjustmentData = async () => {
    try {
      const [analyticsRes, adjustmentsRes] = await Promise.all([
        fetch('/api/stock-adjustments/analytics'),
        fetch('/api/stock-adjustments')
      ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.analytics || analytics);
      }

      if (adjustmentsRes.ok) {
        const adjustmentsData = await adjustmentsRes.json();
        setAdjustments(adjustmentsData || []);
      }
    } catch (error) {
      console.error('Error fetching adjustment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reasons = [
    { value: 'PHYSICAL_COUNT', label: 'Physical Count Discrepancy' },
    { value: 'DAMAGE', label: 'Damaged Goods' },
    { value: 'EXPIRY', label: 'Expired Products' },
    { value: 'THEFT', label: 'Theft/Loss' },
    { value: 'SYSTEM_ERROR', label: 'System Error' },
    { value: 'TRANSFER', label: 'Inter-location Transfer' },
    { value: 'PRODUCTION_USE', label: 'Production Consumption' },
    { value: 'SAMPLE', label: 'Sampling/Testing' },
    { value: 'OTHER', label: 'Other' }
  ];

  const statuses = ['PENDING', 'APPROVED', 'REJECTED'];

  const filteredAdjustments = adjustments.filter(adj => {
    const matchesSearch = adj.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adj.materialNameArabic.includes(searchTerm) ||
                         adj.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adj.adjustmentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || adj.status === statusFilter;
    const matchesReason = reasonFilter === 'all' || adj.reason === reasonFilter;

    return matchesSearch && matchesStatus && matchesReason;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdjustmentTypeColor = (type: string) => {
    switch (type) {
      case 'INCREASE': return 'text-green-600';
      case 'DECREASE': return 'text-red-600';
      case 'SET_QUANTITY': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const filteredAdjustments = adjustments.filter(adj => {
    const matchesSearch = adj.adjustmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adj.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adj.product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'PENDING' && adj.requiresApproval && !adj.approvedAt) ||
                         (statusFilter === 'APPROVED' && adj.approvedAt);

    const matchesReason = reasonFilter === 'all' || adj.reason === reasonFilter;

    return matchesSearch && matchesStatus && matchesReason;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Stock Adjustments</h1>
          <p className="text-gray-600">
            Manage inventory adjustments, physical count discrepancies, and stock corrections
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isNewAdjustmentOpen} onOpenChange={setIsNewAdjustmentOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Adjustment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Stock Adjustment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Select value={newAdjustment.materialId} onValueChange={(value) => setNewAdjustment(prev => ({...prev, materialId: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MAT-001">Royal Oud Oil</SelectItem>
                        <SelectItem value="MAT-002">Rose Petals Bulgarian</SelectItem>
                        <SelectItem value="MAT-003">Saffron Threads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adjustmentType">Adjustment Type</Label>
                    <Select value={newAdjustment.adjustmentType} onValueChange={(value: any) => setNewAdjustment(prev => ({...prev, adjustmentType: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INCREASE">Increase Stock</SelectItem>
                        <SelectItem value="DECREASE">Decrease Stock</SelectItem>
                        <SelectItem value="SET_QUANTITY">Set Exact Quantity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Adjustment Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newAdjustment.adjustmentQuantity}
                      onChange={(e) => setNewAdjustment(prev => ({...prev, adjustmentQuantity: parseFloat(e.target.value) || 0}))}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Select value={newAdjustment.reason} onValueChange={(value: any) => setNewAdjustment(prev => ({...prev, reason: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {reasons.map(reason => (
                          <SelectItem key={reason.value} value={reason.value}>{reason.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={newAdjustment.batchNumber}
                    onChange={(e) => setNewAdjustment(prev => ({...prev, batchNumber: e.target.value}))}
                    placeholder="Enter batch number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAdjustment.description}
                    onChange={(e) => setNewAdjustment(prev => ({...prev, description: e.target.value}))}
                    placeholder="Provide detailed reason for adjustment..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewAdjustmentOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                    <Save className="h-4 w-4 mr-2" />
                    Create Adjustment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Adjustments</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{analytics.thisMonthAdjustments}</div>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.trends.adjustments > 0 ? '+' : ''}{analytics.trends.adjustments}% vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{analytics.pendingApprovals}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cost Impact</CardTitle>
            {analytics.thisMonthCostImpact >= 0 ?
              <TrendingUp className="h-4 w-4 text-green-600" /> :
              <TrendingDown className="h-4 w-4 text-red-600" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold ${analytics.thisMonthCostImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              AED {Math.abs(analytics.thisMonthCostImpact).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">High Impact</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{analytics.highImpactAdjustments}</div>
            <p className="text-xs text-gray-500 mt-1">Above AED 1,000</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-amber-600" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by material name, SKU, or adjustment number..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-48">
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Reasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  {reasons.map(reason => (
                    <SelectItem key={reason.value} value={reason.value}>{reason.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adjustments Table */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit3 className="h-5 w-5 mr-2 text-amber-600" />
            Stock Adjustments
          </CardTitle>
          <CardDescription>
            Review and manage all inventory adjustments and corrections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Adjustment #</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Adjustment</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdjustments.map((adjustment) => (
                  <TableRow key={adjustment.id} className="hover:bg-amber-50/50">
                    <TableCell>
                      <div className="font-medium">{adjustment.adjustmentNumber}</div>
                      <div className="text-xs text-gray-500">by {adjustment.createdBy.name}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{adjustment.product.name}</div>
                        <div className="text-xs text-gray-400">SKU: {adjustment.product.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className={`font-medium ${getAdjustmentTypeColor(adjustment.type)}`}>
                          {adjustment.quantityChange >= 0 ? '+' : ''}{adjustment.quantityChange} {adjustment.product.unit || 'units'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {adjustment.quantityBefore} → {adjustment.quantityAfter} {adjustment.product.unit || 'units'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{adjustment.reason}</div>
                      {adjustment.description && (
                        <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">{adjustment.description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${
                        (adjustment.costImpact || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(adjustment.costImpact || 0) >= 0 ? '+' : ''}AED {Math.abs(Number(adjustment.costImpact || 0)).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(
                        adjustment.requiresApproval && !adjustment.approvedAt ? 'PENDING' : 'APPROVED'
                      )}>
                        {adjustment.requiresApproval && !adjustment.approvedAt ? 'PENDING' : 'APPROVED'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(adjustment.createdAt).toLocaleDateString()}
                      </div>
                      {adjustment.approvedAt && (
                        <div className="text-xs text-gray-500">
                          Approved: {new Date(adjustment.approvedAt).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAdjustment(adjustment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {adjustment.requiresApproval && !adjustment.approvedAt && (
                          <>
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Adjustment Details Modal */}
      {selectedAdjustment && (
        <Dialog open={!!selectedAdjustment} onOpenChange={() => setSelectedAdjustment(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Adjustment Details - {selectedAdjustment.adjustmentNumber}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Material Information</Label>
                  <div className="mt-2">
                    <p className="font-semibold">{selectedAdjustment.materialName}</p>
                    <p className="text-gray-600">{selectedAdjustment.materialNameArabic}</p>
                    <p className="text-sm text-gray-500">SKU: {selectedAdjustment.sku}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Stock Change</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span>Current Stock:</span>
                      <span className="font-medium">{selectedAdjustment.currentStock} {selectedAdjustment.unit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Adjustment:</span>
                      <span className={`font-medium ${getAdjustmentTypeColor(selectedAdjustment.adjustmentType)}`}>
                        {selectedAdjustment.adjustmentType === 'INCREASE' ? '+' : selectedAdjustment.adjustmentType === 'DECREASE' ? '-' : '='}
                        {Math.abs(selectedAdjustment.adjustmentQuantity)} {selectedAdjustment.unit}
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between items-center font-semibold">
                      <span>New Stock:</span>
                      <span>{selectedAdjustment.newStock} {selectedAdjustment.unit}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Cost Impact</Label>
                  <div className={`text-lg font-semibold mt-1 ${
                    selectedAdjustment.costImpact >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedAdjustment.costImpact >= 0 ? '+' : ''}{selectedAdjustment.costImpact?.toLocaleString() || "0"} {selectedAdjustment.currency}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Adjustment Details</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Reason:</span>
                      <span>{reasons.find(r => r.value === selectedAdjustment.reason)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{new Date(selectedAdjustment.adjustmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adjusted By:</span>
                      <span>{selectedAdjustment.adjustedBy}</span>
                    </div>
                    {selectedAdjustment.batchNumber && (
                      <div className="flex justify-between">
                        <span>Batch:</span>
                        <span>{selectedAdjustment.batchNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span>{selectedAdjustment.storageLocation}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-2">
                    <Badge className={getStatusColor(selectedAdjustment.status)}>
                      {selectedAdjustment.status}
                    </Badge>
                    {selectedAdjustment.approvedBy && (
                      <div className="text-sm text-gray-500 mt-1">
                        Approved by {selectedAdjustment.approvedBy} on {new Date(selectedAdjustment.approvalDate!).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                    {selectedAdjustment.description}
                  </p>
                </div>
                {selectedAdjustment.supportingDocuments.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Supporting Documents</Label>
                    <div className="mt-2 space-y-1">
                      {selectedAdjustment.supportingDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-blue-600 cursor-pointer hover:underline">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}