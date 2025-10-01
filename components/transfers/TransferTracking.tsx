'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  TransferRequest,
  TransferStatus,
  TransferPriority,
  TransferTracking as TransferTrackingType
} from '@/types/store';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  Calendar,
  User,
  FileText,
  RefreshCw,
  Plus,
  ArrowRight,
  Copy,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

interface TransferTrackingProps {
  transfer: TransferRequest;
  trackingHistory: TransferTrackingType[];
  onUpdateStatus: (transferId: string, status: TransferStatus, location?: string, notes?: string) => Promise<void>;
  onUpdateTrackingNumber: (transferId: string, trackingNumber: string) => Promise<void>;
  onRefresh: () => void;
  canUpdateStatus?: boolean;
  isLoading?: boolean;
}

const getStatusColor = (status: TransferStatus) => {
  switch (status) {
    case TransferStatus.DRAFT:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case TransferStatus.PENDING_APPROVAL:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case TransferStatus.APPROVED:
      return 'bg-green-100 text-green-800 border-green-200';
    case TransferStatus.PICKING:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case TransferStatus.PACKED:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case TransferStatus.IN_TRANSIT:
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case TransferStatus.DELIVERED:
      return 'bg-green-100 text-green-800 border-green-200';
    case TransferStatus.RECEIVED:
      return 'bg-green-100 text-green-800 border-green-200';
    case TransferStatus.CANCELLED:
      return 'bg-red-100 text-red-800 border-red-200';
    case TransferStatus.PARTIAL:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: TransferStatus) => {
  switch (status) {
    case TransferStatus.DRAFT:
      return <FileText className="h-4 w-4" />;
    case TransferStatus.PENDING_APPROVAL:
      return <Clock className="h-4 w-4" />;
    case TransferStatus.APPROVED:
      return <CheckCircle className="h-4 w-4" />;
    case TransferStatus.PICKING:
      return <Package className="h-4 w-4" />;
    case TransferStatus.PACKED:
      return <Package className="h-4 w-4" />;
    case TransferStatus.IN_TRANSIT:
      return <Truck className="h-4 w-4" />;
    case TransferStatus.DELIVERED:
      return <CheckCircle className="h-4 w-4" />;
    case TransferStatus.RECEIVED:
      return <CheckCircle className="h-4 w-4" />;
    case TransferStatus.CANCELLED:
      return <AlertCircle className="h-4 w-4" />;
    case TransferStatus.PARTIAL:
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getProgressPercentage = (status: TransferStatus) => {
  switch (status) {
    case TransferStatus.DRAFT:
      return 0;
    case TransferStatus.PENDING_APPROVAL:
      return 10;
    case TransferStatus.APPROVED:
      return 20;
    case TransferStatus.PICKING:
      return 40;
    case TransferStatus.PACKED:
      return 60;
    case TransferStatus.IN_TRANSIT:
      return 80;
    case TransferStatus.DELIVERED:
    case TransferStatus.RECEIVED:
      return 100;
    case TransferStatus.CANCELLED:
      return 0;
    case TransferStatus.PARTIAL:
      return 90;
    default:
      return 0;
  }
};

const statusFlow = [
  TransferStatus.DRAFT,
  TransferStatus.PENDING_APPROVAL,
  TransferStatus.APPROVED,
  TransferStatus.PICKING,
  TransferStatus.PACKED,
  TransferStatus.IN_TRANSIT,
  TransferStatus.DELIVERED,
  TransferStatus.RECEIVED
];

export default function TransferTracking({
  transfer,
  trackingHistory,
  onUpdateStatus,
  onUpdateTrackingNumber,
  onRefresh,
  canUpdateStatus = false,
  isLoading
}: TransferTrackingProps) {
  const [newStatus, setNewStatus] = useState<TransferStatus>(transfer.status);
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState(transfer.trackingNumber || '');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);

  const handleStatusUpdate = async () => {
    try {
      await onUpdateStatus(transfer.id, newStatus, newLocation || undefined, newNotes || undefined);
      toast.success('Transfer status updated successfully');
      setIsUpdateDialogOpen(false);
      setNewLocation('');
      setNewNotes('');
      onRefresh();
    } catch (error) {
      toast.error('Failed to update transfer status');
      console.error(error);
    }
  };

  const handleTrackingNumberUpdate = async () => {
    try {
      await onUpdateTrackingNumber(transfer.id, trackingNumber);
      toast.success('Tracking number updated successfully');
      setIsTrackingDialogOpen(false);
      onRefresh();
    } catch (error) {
      toast.error('Failed to update tracking number');
      console.error(error);
    }
  };

  const copyTrackingNumber = () => {
    if (transfer.trackingNumber) {
      navigator.clipboard.writeText(transfer.trackingNumber);
      toast.success('Tracking number copied to clipboard');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const getEstimatedDeliveryStatus = () => {
    if (!transfer.estimatedDelivery) return null;

    const now = new Date();
    const estimated = new Date(transfer.estimatedDelivery);
    const diffTime = estimated.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600' };
    } else if (diffDays <= 2) {
      return { text: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: 'text-yellow-600' };
    } else {
      return { text: `Due in ${diffDays} days`, color: 'text-green-600' };
    }
  };

  const deliveryStatus = getEstimatedDeliveryStatus();

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
              {getStatusIcon(transfer.status)}
              <span className="ml-1">{transfer.status.replace('_', ' ')}</span>
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Track the progress of your inventory transfer
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          {canUpdateStatus && (
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Transfer Status</DialogTitle>
                  <DialogDescription>
                    Add a new status update to track the transfer progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">New Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as TransferStatus)}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      {statusFlow.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                      <option value={TransferStatus.CANCELLED}>CANCELLED</option>
                      <option value={TransferStatus.PARTIAL}>PARTIAL</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Location (Optional)</label>
                    <Input
                      placeholder="Current location or checkpoint"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <Textarea
                      placeholder="Additional information about this update..."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="mt-1 min-h-20"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleStatusUpdate} disabled={isLoading}>
                    Update Status
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Transfer Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{getProgressPercentage(transfer.status)}%</span>
            </div>
            <Progress value={getProgressPercentage(transfer.status)} className="h-2" />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Status:</span>
                  <Badge className={getStatusColor(transfer.status)}>
                    {transfer.status.replace('_', ' ')}
                  </Badge>
                </div>

                {transfer.trackingNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tracking Number:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {transfer.trackingNumber}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={copyTrackingNumber}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {!transfer.trackingNumber && canUpdateStatus && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tracking Number:</span>
                    <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-3 w-3" />
                          Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Tracking Number</DialogTitle>
                          <DialogDescription>
                            Enter the tracking number for this transfer
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Enter tracking number"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsTrackingDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleTrackingNumberUpdate}
                            disabled={!trackingNumber.trim() || isLoading}
                          >
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {transfer.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <div className="text-right">
                      <div className="font-medium">
                        {new Date(transfer.estimatedDelivery).toLocaleDateString()}
                      </div>
                      {deliveryStatus && (
                        <div className={`text-sm ${deliveryStatus.color}`}>
                          {deliveryStatus.text}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {transfer.actualDelivery && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actual Delivery:</span>
                    <span className="font-medium">
                      {new Date(transfer.actualDelivery).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Transfer Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="font-medium">{transfer.fromStore.name}</div>
              <div className="text-sm text-muted-foreground">{transfer.fromStore.code}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {transfer.fromStore.city}, {transfer.fromStore.emirate}
              </div>
              {transfer.fromStore.phone && (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {transfer.fromStore.phone}
                </div>
              )}
            </div>

            <div className="flex-1 px-4">
              <div className="flex items-center justify-center">
                <ArrowRight className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center mt-2">
                <div className="text-sm font-medium">
                  {Math.floor(Math.random() * 50) + 10} km
                </div>
                <div className="text-xs text-muted-foreground">Distance</div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="font-medium">{transfer.toStore.name}</div>
              <div className="text-sm text-muted-foreground">{transfer.toStore.code}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {transfer.toStore.city}, {transfer.toStore.emirate}
              </div>
              {transfer.toStore.phone && (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {transfer.toStore.phone}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Items Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{transfer.items.length}</div>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {transfer.items.reduce((sum, item) => sum + item.quantityRequested, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatCurrency(
                  transfer.items.reduce((sum, item) => sum + (item.unitCost * item.quantityRequested), 0)
                )}
              </div>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {transfer.shippingCost ? formatCurrency(transfer.shippingCost) : 'TBD'}
              </div>
              <p className="text-sm text-muted-foreground">Shipping Cost</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tracking History
          </CardTitle>
          <CardDescription>
            Complete timeline of transfer status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trackingHistory.length > 0 ? (
            <div className="space-y-4">
              {trackingHistory.map((tracking, index) => (
                <div key={tracking.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {getStatusIcon(tracking.status)}
                    </div>
                    {index < trackingHistory.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(tracking.status)}>
                          {tracking.status.replace('_', ' ')}
                        </Badge>
                        {tracking.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {tracking.location}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(tracking.timestamp).toLocaleString()}
                      </div>
                    </div>

                    {tracking.notes && (
                      <p className="text-sm text-muted-foreground mb-2">{tracking.notes}</p>
                    )}

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      Updated by {tracking.updatedBy.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No tracking history</h3>
              <p className="text-muted-foreground">
                Tracking updates will appear here as the transfer progresses
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer Items Details */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Shipped</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfer.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(item.unitCost)} each
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {item.product.sku}
                    </code>
                  </TableCell>
                  <TableCell>{item.quantityRequested}</TableCell>
                  <TableCell>
                    {item.quantityApproved !== undefined ? item.quantityApproved : '-'}
                  </TableCell>
                  <TableCell>
                    {item.quantityShipped !== undefined ? item.quantityShipped : '-'}
                  </TableCell>
                  <TableCell>
                    {item.quantityReceived !== undefined ? item.quantityReceived : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.quantityReceived !== undefined
                        ? item.quantityReceived === item.quantityRequested
                          ? 'Complete'
                          : item.quantityReceived > 0
                          ? 'Partial'
                          : 'Pending'
                        : 'In Progress'
                      }
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}