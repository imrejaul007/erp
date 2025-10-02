'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Boxes, ArrowLeft, Package, Calendar, CheckCircle2, Clock, AlertCircle, TrendingUp
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BatchManagementPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('active');
  const [isNewBatchDialogOpen, setIsNewBatchDialogOpen] = useState(false);

  const batchSummary = {
    activeBatches: 28,
    scheduledBatches: 18,
    completedThisMonth: 145,
    expiredBatches: 0,
    avgLeadTime: 12.5,
    onTimeRate: 94.2
  };

  const activeBatches = [
    {
      batchNo: 'BATCH-OE-2024-0285',
      type: 'Oil Extraction',
      product: 'Premium Oud Oil',
      lotNumber: 'LOT-2024-0285',
      startDate: '2024-10-01',
      completionDate: '2024-10-05',
      expiryDate: 'N/A',
      quantity: 18.6,
      unit: 'ml',
      status: 'in-progress',
      progress: 65,
      genealogy: {
        parent: 'CAMOD-2024-085 (Raw Material)',
        children: ['Perfume batches pending']
      }
    },
    {
      batchNo: 'BATCH-PP-2024-0412',
      type: 'Perfume Production',
      product: 'Royal Oud Blend',
      lotNumber: 'LOT-2024-0412',
      startDate: '2024-09-25',
      completionDate: '2024-10-09',
      expiryDate: '2026-10-09',
      quantity: 100,
      unit: 'bottles',
      status: 'aging',
      progress: 80,
      genealogy: {
        parent: 'BATCH-OE-2024-0245 (Oud Oil)',
        children: ['Multi-size bottling pending']
      }
    }
  ];

  const scheduledBatches = [
    {
      batchNo: 'BATCH-SEG-2024-0210',
      type: 'Segregation',
      product: 'Vietnamese Oud Wood',
      scheduledDate: '2024-10-05',
      estimatedDuration: '2 days',
      priority: 'high',
      rawMaterial: 'VIET-2024-080 (120 kg)'
    },
    {
      batchNo: 'BATCH-PP-2024-0420',
      type: 'Perfume Production',
      product: 'Amber Rose Attar',
      scheduledDate: '2024-10-08',
      estimatedDuration: '21 days',
      priority: 'medium',
      rawMaterial: 'Pending oil extraction'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/production')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Batch Management</h1>
            <p className="text-muted-foreground">
              Lot numbers, expiry tracking, production scheduling & full traceability
            </p>
          </div>
        </div>
        <Dialog open={isNewBatchDialogOpen} onOpenChange={setIsNewBatchDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule New Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Production Batch</DialogTitle>
              <DialogDescription>
                Create a new batch with lot number and schedule production timeline
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:gap-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Batch Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch-type">Batch Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oil-extraction">Oil Extraction</SelectItem>
                        <SelectItem value="segregation">Segregation</SelectItem>
                        <SelectItem value="perfume-production">Perfume Production</SelectItem>
                        <SelectItem value="packaging">Packaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product">Product/Recipe</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="royal-oud">Royal Oud Blend</SelectItem>
                        <SelectItem value="premium-oil">Premium Oud Oil</SelectItem>
                        <SelectItem value="amber-rose">Amber Rose Attar</SelectItem>
                        <SelectItem value="sandalwood">Sandalwood Essence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lot & Tracking Numbers</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lot-number">Lot Number</Label>
                    <Input id="lot-number" placeholder="LOT-2024-0XXX (Auto-generated)" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-number">Batch Number</Label>
                    <Input id="batch-number" placeholder="BATCH-PP-2024-0XXX (Auto-generated)" disabled />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Schedule & Timeline</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Planned Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="completion-date">Estimated Completion</Label>
                    <Input id="completion-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Planned Quantity</Label>
                    <Input id="quantity" type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottles">Bottles</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="units">Units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Parent Batch (Traceability)</h3>
                <div className="space-y-2">
                  <Label htmlFor="parent-batch">Link to Parent Batch (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (New Raw Material)</SelectItem>
                      <SelectItem value="OE-2024-0245">BATCH-OE-2024-0245 (Oud Oil)</SelectItem>
                      <SelectItem value="SEG-2024-195">BATCH-SEG-2024-195 (Segregated Chips)</SelectItem>
                      <SelectItem value="CAMOD-2024-085">CAMOD-2024-085 (Raw Material)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Links this batch to its source material for full traceability
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Batch Notes (Optional)</Label>
                <Input id="notes" placeholder="Special instructions or notes..." />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsNewBatchDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setIsNewBatchDialogOpen(false);
                  // Handle form submission
                }}>
                  Schedule Batch
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Batches</CardDescription>
            <CardTitle className="text-3xl">{batchSummary.activeBatches}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600">
              {batchSummary.scheduledBatches} scheduled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed (Month)</CardDescription>
            <CardTitle className="text-3xl">{batchSummary.completedThisMonth}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              {batchSummary.expiredBatches} expired
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Lead Time</CardDescription>
            <CardTitle className="text-3xl">{batchSummary.avgLeadTime} days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              From start to completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>On-Time Rate</CardDescription>
            <CardTitle className="text-3xl">{batchSummary.onTimeRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={batchSummary.onTimeRate} className="mb-2" />
            <p className="text-xs text-green-600">
              Excellent performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="active">Active Batches</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="traceability">Traceability</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeBatches.map((batch) => (
            <Card key={batch.batchNo}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>{batch.batchNo}</CardTitle>
                      <Badge variant="outline">{batch.lotNumber}</Badge>
                      <Badge variant={batch.status === 'in-progress' ? 'default' : 'secondary'} className="bg-blue-600">
                        {batch.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {batch.product} • {batch.type}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-primary">{batch.progress}%</p>
                    <p className="text-xs text-muted-foreground">Progress</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={batch.progress} className="h-3" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                    <p className="font-semibold">{batch.quantity} {batch.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                    <p className="font-semibold">{batch.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Completion Date</p>
                    <p className="font-semibold">{batch.completionDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                    <p className="font-semibold">{batch.expiryDate}</p>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-sm mb-2">Batch Genealogy (Traceability):</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Parent:</span> {batch.genealogy.parent}</p>
                    <p><span className="text-muted-foreground">Children:</span> {batch.genealogy.children.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Production Batches</CardTitle>
              <CardDescription>Upcoming batches in production calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Raw Material</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledBatches.map((batch) => (
                    <TableRow key={batch.batchNo}>
                      <TableCell className="font-medium">{batch.batchNo}</TableCell>
                      <TableCell>{batch.type}</TableCell>
                      <TableCell>{batch.product}</TableCell>
                      <TableCell>{batch.scheduledDate}</TableCell>
                      <TableCell>{batch.estimatedDuration}</TableCell>
                      <TableCell>
                        <Badge variant={batch.priority === 'high' ? 'destructive' : 'secondary'}>
                          {batch.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{batch.rawMaterial}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traceability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Full Production Traceability</CardTitle>
              <CardDescription>Track products from raw material to final sale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 border-2 border-primary rounded-lg">
                  <h3 className="font-semibold mb-4">Example: Royal Oud Premium 50ml - Bottle #0412-045</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-semibold">Raw Material</p>
                        <p className="text-sm text-muted-foreground">CAMOD-2024-085 • Cambodian Oud Wood • Supplier: Premium Oud Traders • Received: 2024-09-28</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-semibold">Segregation</p>
                        <p className="text-sm text-muted-foreground">SEG-2024-195 • Graded to Premium Chips (8.5kg) • 2024-10-01</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-semibold">Oil Extraction</p>
                        <p className="text-sm text-muted-foreground">OE-2024-0245 • Hydro Distillation • Yield: 10.2ml • QC Pass: 98.5% • 2024-09-20</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">4</span>
                      </div>
                      <div>
                        <p className="font-semibold">Perfume Blending</p>
                        <p className="text-sm text-muted-foreground">PP-2024-0412 • Royal Oud Blend Recipe v2.3 • Aging: 14 days • 2024-09-25</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">5</span>
                      </div>
                      <div>
                        <p className="font-semibold">Bottling & Packaging</p>
                        <p className="text-sm text-muted-foreground">PKG-2024-0412 • 100 units (50ml) • Luxury packaging • 2024-10-09</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">6</span>
                      </div>
                      <div>
                        <p className="font-semibold">Quality Certificate</p>
                        <p className="text-sm text-muted-foreground">QC-2024-0412 • Overall Score: 98.5% • Certified by Dr. Sarah Al-Mansoori</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Management Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Lot Number Generation</h3>
                <p className="text-xs text-muted-foreground">
                  Automatic unique lot numbers for every batch
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Expiry Date Tracking</h3>
                <p className="text-xs text-muted-foreground">
                  Automatic alerts for alcohol-based perfume expiry
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Full Traceability</h3>
                <p className="text-xs text-muted-foreground">
                  Track from raw material to sales with batch genealogy
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Production Scheduling</h3>
                <p className="text-xs text-muted-foreground">
                  Calendar view with automated planning and alerts
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
