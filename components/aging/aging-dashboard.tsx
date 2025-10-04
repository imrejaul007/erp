'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Wine,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface AgingBatch {
  id: string
  batchNumber: string
  productId: string
  product?: {
    id: string
    name: string
    sku: string
  }
  quantity: number
  unit: string
  containerType: string
  location: string
  startDate: Date
  targetDuration: number
  durationUnit: string
  readyDate: Date
  daysRemaining: number
  status: 'AGING' | 'READY' | 'HARVESTED' | 'OVERDUE'
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

interface Stats {
  totalBatches: number
  agingBatches: number
  readySoon: number
  overdueBatches: number
  avgDuration: number
}

export default function AgingDashboard() {
  const [batches, setBatches] = useState<AgingBatch[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<AgingBatch | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    unit: 'L',
    containerType: 'Oak Barrel',
    location: '',
    targetDuration: 0,
    durationUnit: 'days',
    status: 'AGING' as const,
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

      const response = await fetch(`/api/aging?${params.toString()}`)
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
        description: 'Failed to load aging batches'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/aging/stats')
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
      const response = await fetch('/api/aging', {
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
      const response = await fetch(`/api/aging/${selectedBatch.id}`, {
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
      const response = await fetch(`/api/aging/${batchId}`, {
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

  const openEditDialog = (batch: AgingBatch) => {
    setSelectedBatch(batch)
    setFormData({
      productId: batch.productId,
      quantity: batch.quantity,
      unit: batch.unit,
      containerType: batch.containerType,
      location: batch.location,
      targetDuration: batch.targetDuration,
      durationUnit: batch.durationUnit,
      status: batch.status,
      notes: batch.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: 0,
      unit: 'L',
      containerType: 'Oak Barrel',
      location: '',
      targetDuration: 0,
      durationUnit: 'days',
      status: 'AGING',
      notes: ''
    })
  }

  const getStatusBadge = (status: string, daysRemaining: number) => {
    if (status === 'OVERDUE') {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          OVERDUE
        </Badge>
      )
    }
    if (status === 'READY') {
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          READY
        </Badge>
      )
    }
    if (status === 'HARVESTED') {
      return (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          HARVESTED
        </Badge>
      )
    }
    return (
      <Badge variant="default" className="gap-1">
        <Clock className="h-3 w-3" />
        AGING
      </Badge>
    )
  }

  const filteredBatches = batches.filter(batch =>
    batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (batch.product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wine className="h-8 w-8" />
            Aging & Maturation
          </h1>
          <p className="text-muted-foreground">Track aging batches and maturation progress</p>
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
              <DialogTitle>Create Aging Batch</DialogTitle>
              <DialogDescription>Start a new aging/maturation batch</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">Product ID *</Label>
                  <Input
                    id="productId"
                    value={formData.productId}
                    onChange={(e) => setFormData({...formData, productId: e.target.value})}
                    placeholder="Enter product ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
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
                      <SelectItem value="L">Liters (L)</SelectItem>
                      <SelectItem value="ml">Milliliters (ml)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="g">Grams (g)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="containerType">Container Type</Label>
                  <Select value={formData.containerType} onValueChange={(value) => setFormData({...formData, containerType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oak Barrel">Oak Barrel</SelectItem>
                      <SelectItem value="Steel Tank">Steel Tank</SelectItem>
                      <SelectItem value="Glass Bottle">Glass Bottle</SelectItem>
                      <SelectItem value="Ceramic Jar">Ceramic Jar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Warehouse A, Section 3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetDuration">Target Duration</Label>
                  <Input
                    id="targetDuration"
                    type="number"
                    value={formData.targetDuration}
                    onChange={(e) => setFormData({...formData, targetDuration: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationUnit">Duration Unit</Label>
                  <Select value={formData.durationUnit} onValueChange={(value) => setFormData({...formData, durationUnit: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Wine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBatches}</div>
              <p className="text-xs text-muted-foreground">All aging batches</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently Aging</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.agingBatches}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready Soon</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.readySoon}</div>
              <p className="text-xs text-muted-foreground">Within 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgDuration.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Days average</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by batch, product, or location..."
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
            <SelectItem value="AGING">Aging</SelectItem>
            <SelectItem value="READY">Ready</SelectItem>
            <SelectItem value="HARVESTED">Harvested</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchBatches}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Aging Batches</CardTitle>
          <CardDescription>Monitor all maturation batches</CardDescription>
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
                  <TableHead>Batch #</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Container</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Ready Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No batches found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                      <TableCell>{batch.product?.name || batch.productId}</TableCell>
                      <TableCell>{batch.quantity} {batch.unit}</TableCell>
                      <TableCell>{batch.containerType}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {batch.location}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(batch.readyDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={batch.daysRemaining < 0 ? "destructive" : batch.daysRemaining <= 7 ? "default" : "secondary"}>
                          {batch.daysRemaining < 0 ? `${Math.abs(batch.daysRemaining)} overdue` : `${batch.daysRemaining} days`}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(batch.status, batch.daysRemaining)}</TableCell>
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
            <DialogTitle>Edit Aging Batch</DialogTitle>
            <DialogDescription>Update batch information and status</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-containerType">Container Type</Label>
                <Select value={formData.containerType} onValueChange={(value) => setFormData({...formData, containerType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oak Barrel">Oak Barrel</SelectItem>
                    <SelectItem value="Steel Tank">Steel Tank</SelectItem>
                    <SelectItem value="Glass Bottle">Glass Bottle</SelectItem>
                    <SelectItem value="Ceramic Jar">Ceramic Jar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGING">Aging</SelectItem>
                  <SelectItem value="READY">Ready</SelectItem>
                  <SelectItem value="HARVESTED">Harvested</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                </SelectContent>
              </Select>
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
