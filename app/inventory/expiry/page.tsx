'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, XCircle, Search, Download, Eye, Calendar } from 'lucide-react';

export default function ExpiryTrackingPage() {
  const router = useRouter();

  const expiringItems = [
    {
      id: 'INV002',
      name: 'Rose Essential Oil',
      sku: 'ESS-ROSE-001',
      batch: 'BGR2024-02-28',
      location: 'Dubai Mall Store',
      quantity: '100ml',
      expiryDate: '2027-02-28',
      daysUntilExpiry: 850,
      status: 'safe',
    },
    {
      id: 'INV015',
      name: 'Jasmine Absolute',
      sku: 'ESS-JAS-005',
      batch: 'IND2024-06-15',
      location: 'Central Warehouse',
      quantity: '75ml',
      expiryDate: '2025-06-15',
      daysUntilExpiry: 258,
      status: 'warning',
    },
    {
      id: 'INV023',
      name: 'Sandalwood Oil',
      sku: 'ESS-SAN-002',
      batch: 'IND2023-10-20',
      location: 'Main Production Facility',
      quantity: '50ml',
      expiryDate: '2024-10-20',
      daysUntilExpiry: 19,
      status: 'critical',
    },
    {
      id: 'INV034',
      name: 'Amber Extract',
      sku: 'ESS-AMB-001',
      batch: 'UAE2024-01-10',
      location: 'Sharjah Heritage Store',
      quantity: '30ml',
      expiryDate: '2024-10-05',
      daysUntilExpiry: 4,
      status: 'expired',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-orange-100 text-orange-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <Clock className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'expired': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expiry Tracking</h1>
          <p className="text-muted-foreground">Monitor product expiration dates and manage stock rotation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/reports/inventory')}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Safe Stock</p>
                <p className="text-2xl font-bold text-green-600">234</p>
                <p className="text-xs text-green-700">&gt;6 months</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Warning</p>
                <p className="text-2xl font-bold text-yellow-600">45</p>
                <p className="text-xs text-yellow-700">3-6 months</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Critical</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
                <p className="text-xs text-orange-700">&lt;3 months</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Expired</p>
                <p className="text-2xl font-bold text-red-600">3</p>
                <p className="text-xs text-red-700">Action required</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search items..." className="w-full" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="critical">Critical (&lt;3 months)</SelectItem>
            <SelectItem value="warning">Warning (3-6 months)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expiry Tracking</CardTitle>
          <CardDescription>Items requiring attention sorted by expiry date</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Details</TableHead>
                <TableHead>Batch Number</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Until Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiringItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.batch}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {item.expiryDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={
                      item.daysUntilExpiry < 0 ? 'text-red-600 font-bold' :
                      item.daysUntilExpiry < 90 ? 'text-orange-600 font-bold' :
                      item.daysUntilExpiry < 180 ? 'text-yellow-600' :
                      'text-green-600'
                    }>
                      {item.daysUntilExpiry < 0 ? 'EXPIRED' : `${item.daysUntilExpiry} days`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/inventory/comprehensive?item=${item.id}`)}>
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
