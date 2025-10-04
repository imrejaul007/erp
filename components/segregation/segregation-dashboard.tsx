'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Boxes,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Target,
  Zap,
  Beaker,
  Droplets
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface SegregationBatch {
  id: string
  batchNumber: string
  rawMaterialId: string
  rawMaterial: {
    id: string
    name: string
    sku: string
  }
  quantity: number
  unit: string
  gradeA: number
  gradeB: number
  gradeC: number
  reject: number
  segregatedBy: string
  segregatedById: string
  segregationDate: Date
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  qualityScore: number
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

interface Stats {
  totalBatches: number
  pendingBatches: number
  inProgressBatches: number
  completedBatches: number
  totalQuantityProcessed: number
  avgGradeAPercentage: number
  avgQualityScore: number
}

export default function SegregationDashboard() {
  const [batches, setBatches] = useState<SegregationBatch[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<SegregationBatch | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    rawMaterialId: '',
    quantity: 0,
    unit: 'kg',
    gradeA: 0,
    gradeB: 0,
    gradeC: 0,
    reject: 0,
    status: 'PENDING' as const,
    notes: ''
  })

  useEffect(() => {
    fetchBatches()
    fetchStats()
  }, [statusFilter])

  const fetchBatches = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/segregation?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setBatches(data.batches || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch batches'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load segregation batches'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/segregation/stats')
      const data = await response.json()

      if (response.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/segregation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Batch ${data.batch.batchNumber} created successfully`
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchBatches()
        fetchStats()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to create batch'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create batch'
      })
    }
  }

  const handleUpdate = async () => {
    if (!selectedBatch) return

    try {
      const response = await fetch(`/api/segregation?batchId=${selectedBatch.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Batch updated successfully"
        })
        setIsEditDialogOpen(false)
        setSelectedBatch(null)
        resetForm()
        fetchBatches()
        fetchStats()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to update batch'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to update batch'
      })
    }
  }

  const handleDelete = async (batchId: string) => {
    if (!confirm('Are you sure you want to delete this batch?')) return

    try {
      const response = await fetch(`/api/segregation?batchId=${batchId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Batch deleted successfully"
        })
        fetchBatches()
        fetchStats()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to delete batch'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to delete batch'
      })
    }
  }

  const openEditDialog = (batch: SegregationBatch) => {
    setSelectedBatch(batch)
    setFormData({
      rawMaterialId: batch.rawMaterialId,
      quantity: batch.quantity,
      unit: batch.unit,
      gradeA: batch.gradeA,
      gradeB: batch.gradeB,
      gradeC: batch.gradeC,
      reject: batch.reject,
      status: batch.status,
      notes: batch.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      rawMaterialId: '',
      quantity: 0,
      unit: 'kg',
      gradeA: 0,
      gradeB: 0,
      gradeC: 0,
      reject: 0,
      status: 'PENDING',
      notes: ''
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any, icon: any }> = {
      PENDING: { variant: "secondary", icon: Clock },
      IN_PROGRESS: { variant: "default", icon: Zap },
      COMPLETED: { variant: "default", icon: CheckCircle },
      ON_HOLD: { variant: "destructive", icon: AlertTriangle }
    }

    const config = variants[status] || variants.PENDING
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const filteredBatches = batches.filter(batch =>
    batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.rawMaterial.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Boxes className="h-8 w-8" />
            Segregation & Grading
          </h1>
          <p className="text-muted-foreground">Manage raw material segregation and quality grading</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Segregation Batch</DialogTitle>
              <DialogDescription>Add a new raw material segregation batch</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rawMaterialId">Raw Material ID *</Label>
                  <Input
                    id="rawMaterialId"
                    value={formData.rawMaterialId}
                    onChange={(e) => setFormData({...formData, rawMaterialId: e.target.value})}
                    placeholder="Enter raw material ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Total Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="g">Grams (g)</SelectItem>
                      <SelectItem value="l">Liters (l)</SelectItem>
                      <SelectItem value="ml">Milliliters (ml)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gradeA">Grade A</Label>
                  <Input
                    id="gradeA"
                    type="number"
                    value={formData.gradeA}
                    onChange={(e) => setFormData({...formData, gradeA: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeB">Grade B</Label>
                  <Input
                    id="gradeB"
                    type="number"
                    value={formData.gradeB}
                    onChange={(e) => setFormData({...formData, gradeB: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeC">Grade C</Label>
                  <Input
                    id="gradeC"
                    type="number"
                    value={formData.gradeC}
                    onChange={(e) => setFormData({...formData, gradeC: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reject">Reject</Label>
                  <Input
                    id="reject"
                    type="number"
                    value={formData.reject}
                    onChange={(e) => setFormData({...formData, reject: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Batch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
              <Boxes className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBatches}</div>
              <p className="text-xs text-muted-foreground">All segregation batches</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedBatches}</div>
              <p className="text-xs text-muted-foreground">{stats.inProgressBatches} in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Grade A %</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgGradeAPercentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Quality metric</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgQualityScore.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by batch number or material..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="ON_HOLD">On Hold</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchBatches}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Segregation Batches</CardTitle>
          <CardDescription>Manage and track all segregation operations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Raw Material</TableHead>
                  <TableHead>Total Qty</TableHead>
                  <TableHead>Grade A</TableHead>
                  <TableHead>Grade B</TableHead>
                  <TableHead>Grade C</TableHead>
                  <TableHead>Reject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quality Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      No batches found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                      <TableCell>{batch.rawMaterial.name}</TableCell>
                      <TableCell>{batch.quantity} {batch.unit}</TableCell>
                      <TableCell className="text-green-600 font-semibold">{batch.gradeA} {batch.unit}</TableCell>
                      <TableCell className="text-blue-600">{batch.gradeB} {batch.unit}</TableCell>
                      <TableCell className="text-orange-600">{batch.gradeC} {batch.unit}</TableCell>
                      <TableCell className="text-red-600">{batch.reject} {batch.unit}</TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{batch.qualityScore.toFixed(1)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(batch)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(batch.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Segregation Batch</DialogTitle>
            <DialogDescription>Update batch information and grading results</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Total Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-gradeA">Grade A</Label>
                <Input
                  id="edit-gradeA"
                  type="number"
                  value={formData.gradeA}
                  onChange={(e) => setFormData({...formData, gradeA: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gradeB">Grade B</Label>
                <Input
                  id="edit-gradeB"
                  type="number"
                  value={formData.gradeB}
                  onChange={(e) => setFormData({...formData, gradeB: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gradeC">Grade C</Label>
                <Input
                  id="edit-gradeC"
                  type="number"
                  value={formData.gradeC}
                  onChange={(e) => setFormData({...formData, gradeC: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-reject">Reject</Label>
                <Input
                  id="edit-reject"
                  type="number"
                  value={formData.reject}
                  onChange={(e) => setFormData({...formData, reject: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
