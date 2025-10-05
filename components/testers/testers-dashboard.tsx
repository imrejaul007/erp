'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  RefreshCw,
  Beaker,
  Package,
  MapPin,
  Calendar,
  User,
  Edit,
  Trash2
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Tester {
  id: string
  perfumeName: string
  size: string
  quantity: number
  location: string
  assignedTo?: string
  status: 'available' | 'assigned' | 'returned' | 'damaged'
  assignedDate?: string
  returnDate?: string
  notes?: string
  createdAt: string
}

export default function TestersDashboard() {
  const [testers, setTesters] = useState<Tester[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    perfumeName: '',
    size: '',
    quantity: '',
    location: '',
    assignedTo: '',
    notes: ''
  })

  useEffect(() => {
    fetchTesters()
  }, [])

  const fetchTesters = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/testers')
      const data = await response.json()

      if (response.ok) {
        setTesters(data.testers || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch testers'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load testers'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddTester = async () => {
    try {
      const response = await fetch('/api/testers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity)
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Tester added successfully"
        })
        setIsAddDialogOpen(false)
        setFormData({
          perfumeName: '',
          size: '',
          quantity: '',
          location: '',
          assignedTo: '',
          notes: ''
        })
        fetchTesters()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to add tester'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to add tester'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning"> = {
      available: 'success',
      assigned: 'warning',
      returned: 'secondary',
      damaged: 'default'
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const stats = {
    total: testers.length,
    available: testers.filter(t => t.status === 'available').length,
    assigned: testers.filter(t => t.status === 'assigned').length,
    damaged: testers.filter(t => t.status === 'damaged').length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Beaker className="h-8 w-8 text-purple-600" />
            Testers Management
          </h1>
          <p className="text-muted-foreground">Track and manage perfume testers inventory</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Tester
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tester</DialogTitle>
                <DialogDescription>Enter tester details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Perfume Name</Label>
                  <Input
                    value={formData.perfumeName}
                    onChange={(e) => setFormData({ ...formData, perfumeName: e.target.value })}
                    placeholder="Enter perfume name"
                  />
                </div>
                <div>
                  <Label>Size</Label>
                  <Input
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g., 5ml, 10ml"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Store/branch location"
                  />
                </div>
                <div>
                  <Label>Assigned To (Optional)</Label>
                  <Input
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    placeholder="Sales person name"
                  />
                </div>
                <div>
                  <Label>Notes (Optional)</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
                <Button onClick={handleAddTester} className="w-full">
                  Add Tester
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={fetchTesters}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Testers</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <User className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Damaged</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.damaged}</div>
          </CardContent>
        </Card>
      </div>

      {/* Testers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Testers</CardTitle>
          <CardDescription>Manage your testers inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          ) : testers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Beaker className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No testers found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Perfume</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testers.map((tester) => (
                  <TableRow key={tester.id}>
                    <TableCell className="font-medium">{tester.perfumeName}</TableCell>
                    <TableCell>{tester.size}</TableCell>
                    <TableCell>{tester.quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {tester.location}
                      </div>
                    </TableCell>
                    <TableCell>{tester.assignedTo || '-'}</TableCell>
                    <TableCell>{getStatusBadge(tester.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(tester.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
