'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Trash2,
  Plus,
  Calendar as CalendarIcon,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Package,
  Download
} from 'lucide-react';
import { WastageRecord, ProductionBatch } from '@/types/production';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface WastageTrackingProps {
  wastageRecords: WastageRecord[];
  batches: ProductionBatch[];
  onCreateWastageRecord: (record: Omit<WastageRecord, 'id' | 'createdAt'>) => void;
  onDeleteWastageRecord: (id: string) => void;
}

const WastageTracking: React.FC<WastageTrackingProps> = ({
  wastageRecords,
  batches,
  onCreateWastageRecord,
  onDeleteWastageRecord
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [wastageData, setWastageData] = useState({
    batchId: '',
    materialId: '',
    quantity: 0,
    unit: 'ml',
    reason: '',
    cost: 0,
    recordedAt: new Date(),
    notes: ''
  });

  // Predefined wastage reasons
  const wastageReasons = [
    'Material Spill',
    'Equipment Malfunction',
    'Quality Failure',
    'Overproduction',
    'Contamination',
    'Expired Material',
    'Process Error',
    'Equipment Cleaning',
    'Testing/Sampling',
    'Packaging Defect',
    'Transportation Damage',
    'Other'
  ];

  const resetForm = () => {
    setWastageData({
      batchId: '',
      materialId: '',
      quantity: 0,
      unit: 'ml',
      reason: '',
      cost: 0,
      recordedAt: new Date(),
      notes: ''
    });
  };

  const handleCreateWastage = () => {
    if (!wastageData.quantity || !wastageData.reason) return;

    onCreateWastageRecord({
      batchId: wastageData.batchId || undefined,
      materialId: wastageData.materialId || undefined,
      quantity: wastageData.quantity,
      unit: wastageData.unit,
      reason: wastageData.reason,
      cost: wastageData.cost,
      recordedAt: wastageData.recordedAt,
      notes: wastageData.notes || undefined
    });

    setIsCreateOpen(false);
    resetForm();
  };

  // Calculate statistics
  const currentMonth = new Date();
  const lastMonth = subMonths(currentMonth, 1);

  const thisMonthRecords = wastageRecords.filter(record =>
    new Date(record.recordedAt) >= startOfMonth(currentMonth) &&
    new Date(record.recordedAt) <= endOfMonth(currentMonth)
  );

  const lastMonthRecords = wastageRecords.filter(record =>
    new Date(record.recordedAt) >= startOfMonth(lastMonth) &&
    new Date(record.recordedAt) <= endOfMonth(lastMonth)
  );

  const stats = {
    totalRecords: wastageRecords.length,
    totalCost: wastageRecords.reduce((sum, record) => sum + record.cost, 0),
    thisMonthCost: thisMonthRecords.reduce((sum, record) => sum + record.cost, 0),
    lastMonthCost: lastMonthRecords.reduce((sum, record) => sum + record.cost, 0),
    topReasons: wastageRecords.reduce((acc, record) => {
      acc[record.reason] = (acc[record.reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    averageCostPerRecord: wastageRecords.length > 0
      ? wastageRecords.reduce((sum, record) => sum + record.cost, 0) / wastageRecords.length
      : 0
  };

  const costChange = stats.lastMonthCost > 0
    ? ((stats.thisMonthCost - stats.lastMonthCost) / stats.lastMonthCost) * 100
    : 0;

  const topReasonsArray = Object.entries(stats.topReasons)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Group records by date for trending
  const recordsByDate = wastageRecords.reduce((acc, record) => {
    const date = format(new Date(record.recordedAt), 'MMM dd');
    acc[date] = (acc[date] || 0) + record.cost;
    return acc;
  }, {} as Record<string, number>);

  const exportWastageData = () => {
    const headers = ['Date', 'Batch', 'Reason', 'Quantity', 'Unit', 'Cost', 'Notes'];
    const csvData = [
      headers.join(','),
      ...wastageRecords.map(record => [
        format(new Date(record.recordedAt), 'yyyy-MM-dd'),
        record.batch?.batchNumber || 'N/A',
        record.reason,
        record.quantity,
        record.unit,
        record.cost.toFixed(2),
        `"${record.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wastage-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Wastage Tracking</h2>
          <p className="text-gray-600">Monitor and analyze production waste</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportWastageData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Record Wastage
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Wastage</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Batch Selection (Optional) */}
                <div>
                  <Label>Associated Batch (Optional)</Label>
                  <Select
                    value={wastageData.batchId}
                    onValueChange={(value) => setWastageData(prev => ({ ...prev, batchId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch if applicable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific batch</SelectItem>
                      {batches.map(batch => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.batchNumber} - {batch.recipe?.name || 'Custom batch'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity and Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={wastageData.quantity}
                      onChange={(e) =>
                        setWastageData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select
                      value={wastageData.unit}
                      onValueChange={(value) => setWastageData(prev => ({ ...prev, unit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="liters">L</SelectItem>
                        <SelectItem value="grams">g</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="pieces">pcs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <Label>Reason *</Label>
                  <Select
                    value={wastageData.reason}
                    onValueChange={(value) => setWastageData(prev => ({ ...prev, reason: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason for wastage" />
                    </SelectTrigger>
                    <SelectContent>
                      {wastageReasons.map(reason => (
                        <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cost */}
                <div>
                  <Label>Estimated Cost</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={wastageData.cost}
                    onChange={(e) =>
                      setWastageData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="0.00"
                  />
                </div>

                {/* Date */}
                <div>
                  <Label>Date Occurred</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(wastageData.recordedAt, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={wastageData.recordedAt}
                        onSelect={(date) =>
                          setWastageData(prev => ({ ...prev, recordedAt: date || new Date() }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Notes */}
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={wastageData.notes}
                    onChange={(e) => setWastageData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional details about the wastage..."
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateWastage}>
                    Record Wastage
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">${stats.thisMonthCost.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {costChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
                  )}
                  <span className={`text-sm ${costChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.abs(costChange).toFixed(1)}%
                  </span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg per Record</p>
                <p className="text-2xl font-bold">${stats.averageCostPerRecord.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="records" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="records">Wastage Records</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="records">
              <WastageRecordsTable
                records={wastageRecords}
                batches={batches}
                onDeleteRecord={onDeleteWastageRecord}
              />
            </TabsContent>

            <TabsContent value="analysis">
              <WastageAnalysis
                records={wastageRecords}
                topReasons={topReasonsArray}
                stats={stats}
              />
            </TabsContent>

            <TabsContent value="trends">
              <WastageTrends
                recordsByDate={recordsByDate}
                thisMonthCost={stats.thisMonthCost}
                lastMonthCost={stats.lastMonthCost}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Wastage Records Table
interface WastageRecordsTableProps {
  records: WastageRecord[];
  batches: ProductionBatch[];
  onDeleteRecord: (id: string) => void;
}

const WastageRecordsTable: React.FC<WastageRecordsTableProps> = ({
  records,
  batches,
  onDeleteRecord
}) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No wastage records found
              </TableCell>
            </TableRow>
          ) : (
            records
              .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
              .map(record => {
                const batch = batches.find(b => b.id === record.batchId);
                return (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{format(new Date(record.recordedAt), 'MMM dd, yyyy')}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(record.recordedAt), 'HH:mm')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {batch ? (
                        <div>
                          <p className="font-medium">{batch.batchNumber}</p>
                          <p className="text-sm text-gray-600">
                            {batch.recipe?.name || 'Custom batch'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-500">General wastage</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={record.reason === 'Quality Failure' ? 'destructive' : 'outline'}
                      >
                        {record.reason}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.quantity} {record.unit}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-red-600">${record.cost.toFixed(2)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm max-w-xs truncate">
                        {record.notes || 'No notes'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteRecord(record.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Wastage Analysis Component
interface WastageAnalysisProps {
  records: WastageRecord[];
  topReasons: [string, number][];
  stats: any;
}

const WastageAnalysis: React.FC<WastageAnalysisProps> = ({
  records,
  topReasons,
  stats
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Reasons */}
      <Card>
        <CardHeader>
          <CardTitle>Top Wastage Reasons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topReasons.map(([reason, count]) => {
              const percentage = (count / stats.totalRecords) * 100;
              return (
                <div key={reason} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{reason}</span>
                    <span className="text-sm text-gray-600">{count} records</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {percentage.toFixed(1)}% of total wastage
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">This Month</p>
                <p className="text-sm text-gray-600">{format(new Date(), 'MMMM yyyy')}</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                ${stats.thisMonthCost.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Last Month</p>
                <p className="text-sm text-gray-600">{format(subMonths(new Date(), 1), 'MMMM yyyy')}</p>
              </div>
              <p className="text-2xl font-bold text-gray-600">
                ${stats.lastMonthCost.toFixed(2)}
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                {stats.thisMonthCost > stats.lastMonthCost ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">
                      Wastage increased by ${(stats.thisMonthCost - stats.lastMonthCost).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
                    <span className="text-green-600">
                      Wastage reduced by ${(stats.lastMonthCost - stats.thisMonthCost).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Wastage Trends Component
interface WastageTrendsProps {
  recordsByDate: Record<string, number>;
  thisMonthCost: number;
  lastMonthCost: number;
}

const WastageTrends: React.FC<WastageTrendsProps> = ({
  recordsByDate,
  thisMonthCost,
  lastMonthCost
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wastage Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Month-over-Month Change</p>
              <div className="flex items-center justify-center gap-2">
                {thisMonthCost > lastMonthCost ? (
                  <>
                    <TrendingUp className="w-6 h-6 text-red-500" />
                    <span className="text-2xl font-bold text-red-600">
                      +{(((thisMonthCost - lastMonthCost) / lastMonthCost) * 100).toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-6 h-6 text-green-500 rotate-180" />
                    <span className="text-2xl font-bold text-green-600">
                      -{(((lastMonthCost - thisMonthCost) / lastMonthCost) * 100).toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Recent Daily Wastage Costs</h4>
              <div className="space-y-2">
                {Object.entries(recordsByDate)
                  .slice(-7)
                  .map(([date, cost]) => (
                    <div key={date} className="flex justify-between items-center">
                      <span>{date}</span>
                      <span className="font-medium">${cost.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {thisMonthCost > lastMonthCost ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Increasing Wastage Detected</p>
                    <p className="text-sm text-red-700">
                      Consider reviewing production processes and quality control measures.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 rotate-180" />
                  <div>
                    <p className="font-medium text-green-800">Good Progress</p>
                    <p className="text-sm text-green-700">
                      Wastage is decreasing. Continue current practices.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Regular equipment maintenance and staff training can help reduce wastage significantly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WastageTracking;