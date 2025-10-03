'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, Plus, Search, Download, Eye, CheckCircle, Clock, XCircle, Truck, Package,
  ArrowLeft} from 'lucide-react';

export default function StockTransfersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  const transfers = [
    {
      id: 'TR-001',
      date: '2024-10-01',
      item: 'Premium Cambodian Oud Chips',
      quantity: '50g',
      from: 'Central Warehouse',
      to: 'Dubai Mall Store',
      status: 'completed',
      requestedBy: 'Ahmed Al-Mansoori',
    },
    {
      id: 'TR-002',
      date: '2024-10-01',
      item: 'Rose Essential Oil',
      quantity: '25ml',
      from: 'Main Production Facility',
      to: 'Sharjah Heritage Store',
      status: 'in_transit',
      requestedBy: 'Fatima Al-Zahra',
    },
    {
      id: 'TR-003',
      date: '2024-09-30',
      item: 'Royal Oud Perfume 50ml',
      quantity: '10 pieces',
      from: 'Central Warehouse',
      to: 'Dubai Mall Store',
      status: 'pending',
      requestedBy: 'Ahmed Al-Mansoori',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold">Stock Transfers</h1>
          <p className="text-muted-foreground">Manage inventory transfers between locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/reports/inventory')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/inventory/adjustments')}>
            <Plus className="mr-2 h-4 w-4" />
            New Transfer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transfers</p>
                <p className="text-xl sm:text-2xl font-bold">156</p>
              </div>
              <ArrowUpDown className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">12</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">8</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">136</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transfers..." className="w-full" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transfers</CardTitle>
          <CardDescription>Track all stock movements between locations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.id}</TableCell>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell>{transfer.item}</TableCell>
                  <TableCell>{transfer.quantity}</TableCell>
                  <TableCell>{transfer.from}</TableCell>
                  <TableCell>{transfer.to}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transfer.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(transfer.status)}
                        {transfer.status.replace('_', ' ')}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>{transfer.requestedBy}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => alert('View transfer: ' + transfer.id)}>
                      <Eye className="h-3 w-3" />
                    </Button>
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
