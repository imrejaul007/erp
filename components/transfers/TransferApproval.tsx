'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  TransferRequest,
  TransferStatus,
  TransferPriority,
  TransferItem
} from '@/types/store';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Package,
  ArrowRight,
  User,
  Calendar,
  FileText,
  Edit,
  Truck,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

interface TransferApprovalProps {
  transfer: TransferRequest;
  onApprove: (transferId: string, approvedItems: { itemId: string; approvedQuantity: number }[], notes?: string) => Promise<void>;
  onReject: (transferId: string, reason: string) => Promise<void>;
  onRequestModification: (transferId: string, feedback: string) => Promise<void>;
  isLoading?: boolean;
  canApprove?: boolean;
}

const getStatusColor = (status: TransferStatus) => {
  switch (status) {
    case TransferStatus.PENDING_APPROVAL:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case TransferStatus.APPROVED:
      return 'bg-green-100 text-green-800 border-green-200';
    case TransferStatus.REJECTED:
      return 'bg-red-100 text-red-800 border-red-200';
    case TransferStatus.IN_TRANSIT:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case TransferStatus.DELIVERED:
      return 'bg-green-100 text-green-800 border-green-200';
    case TransferStatus.CANCELLED:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: TransferPriority) => {
  switch (priority) {
    case TransferPriority.LOW:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case TransferPriority.NORMAL:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case TransferPriority.HIGH:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case TransferPriority.URGENT:
      return 'bg-red-100 text-red-800 border-red-200';
    case TransferPriority.EMERGENCY:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function TransferApproval({
  transfer,
  onApprove,
  onReject,
  onRequestModification,
  isLoading,
  canApprove = true
}: TransferApprovalProps) {
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [modificationFeedback, setModificationFeedback] = useState('');
  const [editedQuantities, setEditedQuantities] = useState<Record<string, number>>({});
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [isModificationDialogOpen, setIsModificationDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setEditedQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const getApprovedQuantity = (item: TransferItem) => {
    return editedQuantities[item.id] ?? item.quantityRequested;
  };

  const handleApprove = async () => {
    try {
      const approvedItems = transfer.items.map(item => ({
        itemId: item.id,
        approvedQuantity: getApprovedQuantity(item)
      }));

      await onApprove(transfer.id, approvedItems, approvalNotes || undefined);
      toast.success('Transfer request approved successfully');
      setIsApprovalDialogOpen(false);
    } catch (error) {
      toast.error('Failed to approve transfer request');
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      await onReject(transfer.id, rejectionReason);
      toast.success('Transfer request rejected');
      setIsRejectionDialogOpen(false);
    } catch (error) {
      toast.error('Failed to reject transfer request');
      console.error(error);
    }
  };

  const handleRequestModification = async () => {
    try {
      await onRequestModification(transfer.id, modificationFeedback);
      toast.success('Modification request sent');
      setIsModificationDialogOpen(false);
    } catch (error) {
      toast.error('Failed to send modification request');
      console.error(error);
    }
  };

  const calculateTotalValue = () => {
    return transfer.items.reduce((sum, item) => {
      const quantity = getApprovedQuantity(item);
      return sum + (item.unitCost * quantity);
    }, 0);
  };

  const calculateTotalItems = () => {
    return transfer.items.reduce((sum, item) => {
      return sum + getApprovedQuantity(item);
    }, 0);
  };

  const hasQuantityChanges = () => {
    return transfer.items.some(item => {
      const approvedQuantity = getApprovedQuantity(item);
      return approvedQuantity !== item.quantityRequested;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Transfer #{transfer.transferNumber}
            </h1>
            <Badge className={getStatusColor(transfer.status)}>
              {transfer.status.replace('_', ' ')}
            </Badge>
            <Badge className={getPriorityColor(transfer.priority)}>
              {transfer.priority}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Review and approve this transfer request
          </p>
        </div>

        {canApprove && transfer.status === TransferStatus.PENDING_APPROVAL && (
          <div className="flex gap-2">
            <Dialog open={isModificationDialogOpen} onOpenChange={setIsModificationDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Request Changes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Modifications</DialogTitle>
                  <DialogDescription>
                    Provide feedback to the requester about what needs to be changed
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe what modifications are needed..."
                    value={modificationFeedback}
                    onChange={(e) => setModificationFeedback(e.target.value)}
                    className="min-h-20"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsModificationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRequestModification}
                    disabled={!modificationFeedback.trim()}
                  >
                    Send Feedback
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Transfer Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Please provide a reason for rejection.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-20"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReject}
                    disabled={!rejectionReason.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject Transfer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Approve Transfer Request</DialogTitle>
                  <DialogDescription>
                    Review the details and confirm your approval
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {hasQuantityChanges() && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-900">Quantity Changes Detected</span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        You have modified some quantities. The transfer will be approved with these changes.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{transfer.items.length}</div>
                      <p className="text-sm text-muted-foreground">Products</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{calculateTotalItems()}</div>
                      <p className="text-sm text-muted-foreground">Total Items</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(calculateTotalValue())}</div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Approval notes (optional)..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="min-h-20"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsApprovalDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Transfer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Transfer Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Transfer Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="font-medium">{transfer.fromStore.name}</div>
                <div className="text-sm text-muted-foreground">{transfer.fromStore.code}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {transfer.fromStore.city}
                </div>
              </div>

              <ArrowRight className="h-8 w-8 text-muted-foreground" />

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="font-medium">{transfer.toStore.name}</div>
                <div className="text-sm text-muted-foreground">{transfer.toStore.code}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {transfer.toStore.city}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requested By:</span>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{transfer.requestedBy.name}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Request Date:</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  {new Date(transfer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Priority:</span>
              <Badge className={getPriorityColor(transfer.priority)}>
                {transfer.priority}
              </Badge>
            </div>

            {transfer.estimatedDelivery && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Delivery:</span>
                <span className="font-medium">
                  {new Date(transfer.estimatedDelivery).toLocaleDateString()}
                </span>
              </div>
            )}

            {transfer.notes && (
              <div>
                <span className="text-muted-foreground">Notes:</span>
                <p className="mt-1 text-sm bg-muted p-2 rounded">{transfer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transfer Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Transfer Items
          </CardTitle>
          <CardDescription>
            Review and modify quantities if needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Available</TableHead>
                {canApprove && transfer.status === TransferStatus.PENDING_APPROVAL && (
                  <TableHead>Approved Qty</TableHead>
                )}
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfer.items.map((item) => {
                const approvedQty = getApprovedQuantity(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Category: {item.product.category?.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {item.product.sku}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{item.quantityRequested}</span>
                    </TableCell>
                    <TableCell>
                      <span className={item.product.stockQuantity >= item.quantityRequested
                        ? "text-green-600"
                        : "text-red-600"
                      }>
                        {item.product.stockQuantity}
                      </span>
                    </TableCell>
                    {canApprove && transfer.status === TransferStatus.PENDING_APPROVAL && (
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={Math.min(item.quantityRequested, item.product.stockQuantity)}
                          value={approvedQty}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      {formatCurrency(item.unitCost)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrency(item.unitCost * approvedQty)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.notes ? (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.notes}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Separator className="my-4" />

          {/* Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{transfer.items.length}</div>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateTotalItems()}</div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCurrency(calculateTotalValue())}</div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    transfer.items.every(item => item.product.stockQuantity >= getApprovedQuantity(item))
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {transfer.items.every(item => item.product.stockQuantity >= getApprovedQuantity(item))
                      ? 'Available'
                      : 'Shortage'
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">Stock Status</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stock Warnings */}
          {transfer.items.some(item => item.product.stockQuantity < getApprovedQuantity(item)) && (
            <Card className="mt-4 border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="font-medium text-red-900">Stock Shortage Warning</h3>
                    <p className="text-sm text-red-700">
                      Some items have insufficient stock at the source store.
                      Consider reducing quantities or sourcing from alternative locations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Approval History */}
      {transfer.approvedBy && (
        <Card>
          <CardHeader>
            <CardTitle>Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Approved by {transfer.approvedBy.name}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(transfer.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}