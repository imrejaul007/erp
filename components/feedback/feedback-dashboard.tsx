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
  MessageSquare,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Star,
  ThumbsUp,
  ThumbsDown,
  Meh,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface CustomerFeedback {
  id: string
  customerId: string
  customerName: string
  productId: string | null
  productName: string | null
  rating: number
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  category: string
  feedback: string
  wasRejected: boolean
  rejectionReason: string | null
  actionRequired: boolean
  actionTaken: string | null
  createdAt: Date
  updatedAt: Date
}

interface Stats {
  totalFeedback: number
  positiveFeedback: number
  neutralFeedback: number
  negativeFeedback: number
  actionRequiredCount: number
  avgRating: number
  rejectionRate: number
}

export default function FeedbackDashboard() {
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sentimentFilter, setSentimentFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    productId: '',
    rating: 5,
    sentiment: 'POSITIVE' as const,
    category: 'Product Quality',
    feedback: '',
    wasRejected: false,
    rejectionReason: '',
    actionRequired: false,
    actionTaken: ''
  })

  useEffect(() => {
    fetchFeedbacks()
    fetchStats()
  }, [sentimentFilter])

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (sentimentFilter && sentimentFilter !== 'all') {
        params.append('sentiment', sentimentFilter)
      }

      const response = await fetch(`/api/feedback?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setFeedbacks(data.feedbacks || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch feedbacks'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load customer feedback'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/feedback/stats')
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
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feedback created successfully"
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchFeedbacks()
        fetchStats()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to create feedback'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create feedback'
      })
    }
  }

  const handleUpdate = async () => {
    if (!selectedFeedback) return

    try {
      const response = await fetch(`/api/feedback/${selectedFeedback.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feedback updated successfully"
        })
        setIsEditDialogOpen(false)
        setSelectedFeedback(null)
        resetForm()
        fetchFeedbacks()
        fetchStats()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to update feedback'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to update feedback'
      })
    }
  }

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return

    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feedback deleted successfully"
        })
        fetchFeedbacks()
        fetchStats()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to delete feedback'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to delete feedback'
      })
    }
  }

  const openEditDialog = (feedback: CustomerFeedback) => {
    setSelectedFeedback(feedback)
    setFormData({
      customerId: feedback.customerId,
      customerName: feedback.customerName,
      productId: feedback.productId || '',
      rating: feedback.rating,
      sentiment: feedback.sentiment,
      category: feedback.category,
      feedback: feedback.feedback,
      wasRejected: feedback.wasRejected,
      rejectionReason: feedback.rejectionReason || '',
      actionRequired: feedback.actionRequired,
      actionTaken: feedback.actionTaken || ''
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      customerId: '',
      customerName: '',
      productId: '',
      rating: 5,
      sentiment: 'POSITIVE',
      category: 'Product Quality',
      feedback: '',
      wasRejected: false,
      rejectionReason: '',
      actionRequired: false,
      actionTaken: ''
    })
  }

  const getSentimentBadge = (sentiment: string) => {
    const variants: Record<string, { variant: any, icon: any, color: string }> = {
      POSITIVE: { variant: "default", icon: ThumbsUp, color: "text-green-600" },
      NEUTRAL: { variant: "secondary", icon: Meh, color: "text-gray-600" },
      NEGATIVE: { variant: "destructive", icon: ThumbsDown, color: "text-red-600" }
    }

    const config = variants[sentiment] || variants.NEUTRAL
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {sentiment}
      </Badge>
    )
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (feedback.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Customer Feedback
          </h1>
          <p className="text-muted-foreground">Manage and analyze customer feedback and reviews</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Customer Feedback</DialogTitle>
              <DialogDescription>Record new customer feedback or review</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer ID *</Label>
                  <Input
                    id="customerId"
                    value={formData.customerId}
                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                    placeholder="Enter customer ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="Customer name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    value={formData.productId}
                    onChange={(e) => setFormData({...formData, productId: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product Quality">Product Quality</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Delivery">Delivery</SelectItem>
                      <SelectItem value="Packaging">Packaging</SelectItem>
                      <SelectItem value="Pricing">Pricing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sentiment">Sentiment</Label>
                  <Select value={formData.sentiment} onValueChange={(value: any) => setFormData({...formData, sentiment: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POSITIVE">Positive</SelectItem>
                      <SelectItem value="NEUTRAL">Neutral</SelectItem>
                      <SelectItem value="NEGATIVE">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wasRejected">Rejection?</Label>
                  <Select value={formData.wasRejected.toString()} onValueChange={(value) => setFormData({...formData, wasRejected: value === 'true'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback *</Label>
                <Textarea
                  id="feedback"
                  value={formData.feedback}
                  onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                  placeholder="Customer feedback details"
                  rows={3}
                />
              </div>
              {formData.wasRejected && (
                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Rejection Reason</Label>
                  <Input
                    id="rejectionReason"
                    value={formData.rejectionReason}
                    onChange={(e) => setFormData({...formData, rejectionReason: e.target.value})}
                    placeholder="Why was the product rejected?"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.actionRequired}
                    onChange={(e) => setFormData({...formData, actionRequired: e.target.checked})}
                  />
                  Action Required
                </Label>
              </div>
              {formData.actionRequired && (
                <div className="space-y-2">
                  <Label htmlFor="actionTaken">Action Taken</Label>
                  <Textarea
                    id="actionTaken"
                    value={formData.actionTaken}
                    onChange={(e) => setFormData({...formData, actionTaken: e.target.value})}
                    placeholder="What action was taken?"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Add Feedback</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedback}</div>
              <p className="text-xs text-muted-foreground">All customer reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive</CardTitle>
              <ThumbsUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.positiveFeedback}</div>
              <p className="text-xs text-muted-foreground">{stats.negativeFeedback} negative</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}/5</div>
              <p className="text-xs text-muted-foreground">Overall satisfaction</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Action Required</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.actionRequiredCount}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, product, or feedback..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiment</SelectItem>
            <SelectItem value="POSITIVE">Positive</SelectItem>
            <SelectItem value="NEUTRAL">Neutral</SelectItem>
            <SelectItem value="NEGATIVE">Negative</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchFeedbacks}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback</CardTitle>
          <CardDescription>All customer reviews and feedback</CardDescription>
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No feedback found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFeedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell className="font-medium">{feedback.customerName}</TableCell>
                      <TableCell>{feedback.productName || '-'}</TableCell>
                      <TableCell>{renderStars(feedback.rating)}</TableCell>
                      <TableCell>{getSentimentBadge(feedback.sentiment)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{feedback.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{feedback.feedback}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {feedback.wasRejected && (
                            <Badge variant="destructive" className="text-xs">Rejected</Badge>
                          )}
                          {feedback.actionRequired && (
                            <Badge variant="default" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Action
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(feedback)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(feedback.id)}>
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
            <DialogTitle>Edit Customer Feedback</DialogTitle>
            <DialogDescription>Update feedback details and resolution</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-rating">Rating</Label>
                <Input
                  id="edit-rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sentiment">Sentiment</Label>
                <Select value={formData.sentiment} onValueChange={(value: any) => setFormData({...formData, sentiment: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POSITIVE">Positive</SelectItem>
                    <SelectItem value="NEUTRAL">Neutral</SelectItem>
                    <SelectItem value="NEGATIVE">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product Quality">Product Quality</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Packaging">Packaging</SelectItem>
                    <SelectItem value="Pricing">Pricing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-feedback">Feedback</Label>
              <Textarea
                id="edit-feedback"
                value={formData.feedback}
                onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.actionRequired}
                  onChange={(e) => setFormData({...formData, actionRequired: e.target.checked})}
                />
                Action Required
              </Label>
            </div>
            {formData.actionRequired && (
              <div className="space-y-2">
                <Label htmlFor="edit-actionTaken">Action Taken</Label>
                <Textarea
                  id="edit-actionTaken"
                  value={formData.actionTaken}
                  onChange={(e) => setFormData({...formData, actionTaken: e.target.value})}
                  placeholder="What action was taken?"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
