'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  Store,
  MapPin,
  User,
  DollarSign,
  Calendar,
  TrendingUp,
  Phone,
  Mail
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Franchise {
  id: string
  name: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  location: string
  address: string
  contractStartDate: string
  contractEndDate: string
  monthlyFee: number
  royaltyPercentage: number
  status: 'active' | 'pending' | 'suspended' | 'terminated'
  monthlyRevenue?: number
  createdAt: string
}

export default function FranchisesDashboard() {
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    location: '',
    address: '',
    contractStartDate: '',
    contractEndDate: '',
    monthlyFee: '',
    royaltyPercentage: ''
  })

  useEffect(() => {
    fetchFranchises()
  }, [])

  const fetchFranchises = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/franchises')
      const data = await response.json()

      if (response.ok) {
        setFranchises(data.franchises || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch franchises'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load franchises'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddFranchise = async () => {
    try {
      const response = await fetch('/api/franchises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monthlyFee: parseFloat(formData.monthlyFee),
          royaltyPercentage: parseFloat(formData.royaltyPercentage)
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Franchise added successfully"
        })
        setIsAddDialogOpen(false)
        setFormData({
          name: '',
          ownerName: '',
          ownerEmail: '',
          ownerPhone: '',
          location: '',
          address: '',
          contractStartDate: '',
          contractEndDate: '',
          monthlyFee: '',
          royaltyPercentage: ''
        })
        fetchFranchises()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to add franchise'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to add franchise'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning"> = {
      active: 'success',
      pending: 'warning',
      suspended: 'secondary',
      terminated: 'default'
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const stats = {
    total: franchises.length,
    active: franchises.filter(f => f.status === 'active').length,
    pending: franchises.filter(f => f.status === 'pending').length,
    totalRevenue: franchises.reduce((sum, f) => sum + (f.monthlyRevenue || 0), 0)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="h-8 w-8 text-indigo-600" />
            Franchises Management
          </h1>
          <p className="text-muted-foreground">Manage your franchise locations and partners</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Franchise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Franchise</DialogTitle>
                <DialogDescription>Register a new franchise location</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Franchise Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Oud Dubai Mall"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Owner Name</Label>
                    <Input
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Owner name"
                    />
                  </div>
                  <div>
                    <Label>Owner Email</Label>
                    <Input
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                      placeholder="owner@example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label>Owner Phone</Label>
                  <Input
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Location (City)</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Dubai, Abu Dhabi, etc."
                    />
                  </div>
                  <div>
                    <Label>Full Address</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street address"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contract Start Date</Label>
                    <Input
                      type="date"
                      value={formData.contractStartDate}
                      onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Contract End Date</Label>
                    <Input
                      type="date"
                      value={formData.contractEndDate}
                      onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Monthly Fee (AED)</Label>
                    <Input
                      type="number"
                      value={formData.monthlyFee}
                      onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label>Royalty Percentage (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.royaltyPercentage}
                      onChange={(e) => setFormData({ ...formData, royaltyPercentage: e.target.value })}
                      placeholder="5.0"
                    />
                  </div>
                </div>
                <Button onClick={handleAddFranchise} className="w-full">
                  Add Franchise
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={fetchFranchises}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Franchises</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Franchises Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Franchises</CardTitle>
          <CardDescription>Manage franchise locations and contracts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          ) : franchises.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Store className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No franchises registered</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Franchise Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contract Period</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {franchises.map((franchise) => (
                  <TableRow key={franchise.id}>
                    <TableCell className="font-medium">{franchise.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {franchise.ownerName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {franchise.ownerEmail}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {franchise.ownerPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {franchise.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(franchise.contractStartDate).toLocaleDateString()} - {new Date(franchise.contractEndDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>AED {franchise.monthlyFee.toLocaleString()}/mo</div>
                        <div className="text-muted-foreground">{franchise.royaltyPercentage}% royalty</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(franchise.status)}</TableCell>
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
