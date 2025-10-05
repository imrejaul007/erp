'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Download,
  RefreshCw,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  FileSpreadsheet,
  Database
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface DataExport {
  id: string
  exportType: string
  format: 'csv' | 'excel' | 'pdf' | 'json'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  fileSize?: number
  fileName?: string
  downloadUrl?: string
  requestedBy: string
  requestedAt: string
  completedAt?: string
  recordCount?: number
}

export default function DataExportsDashboard() {
  const [exports, setExports] = useState<DataExport[]>([])
  const [loading, setLoading] = useState(true)
  const [exportType, setExportType] = useState('products')
  const [exportFormat, setExportFormat] = useState('csv')

  useEffect(() => {
    fetchExports()
  }, [])

  const fetchExports = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/data-exports')
      const data = await response.json()

      if (response.ok) {
        setExports(data.exports || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch exports'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load exports'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExport = async () => {
    try {
      const response = await fetch('/api/data-exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exportType,
          format: exportFormat
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Export started successfully"
        })
        fetchExports()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to create export'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create export'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "success" | "warning", icon: React.ReactNode }> = {
      pending: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      processing: { variant: 'warning', icon: <RefreshCw className="h-3 w-3 animate-spin" /> },
      completed: { variant: 'success', icon: <CheckCircle className="h-3 w-3" /> },
      failed: { variant: 'default', icon: <XCircle className="h-3 w-3" /> }
    }
    const config = variants[status] || variants.pending
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getFormatIcon = (format: string) => {
    const icons: Record<string, React.ReactNode> = {
      csv: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
      excel: <FileSpreadsheet className="h-4 w-4 text-blue-600" />,
      pdf: <FileText className="h-4 w-4 text-red-600" />,
      json: <Database className="h-4 w-4 text-purple-600" />
    }
    return icons[format] || <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const stats = {
    total: exports.length,
    completed: exports.filter(e => e.status === 'completed').length,
    processing: exports.filter(e => e.status === 'processing').length,
    failed: exports.filter(e => e.status === 'failed').length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Download className="h-8 w-8 text-teal-600" />
            Data Exports
          </h1>
          <p className="text-muted-foreground">Export system data in various formats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchExports}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Export */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Export</CardTitle>
          <CardDescription>Select data type and format to export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="suppliers">Suppliers</SelectItem>
                  <SelectItem value="invoices">Invoices</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateExport}>
              <Download className="h-4 w-4 mr-2" />
              Create Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>View and download previous exports</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          ) : exports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Download className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No exports created yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Export Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Requested At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exports.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell className="font-medium">{exp.exportType.charAt(0).toUpperCase() + exp.exportType.slice(1)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFormatIcon(exp.format)}
                        <span className="uppercase">{exp.format}</span>
                      </div>
                    </TableCell>
                    <TableCell>{exp.recordCount?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{formatFileSize(exp.fileSize)}</TableCell>
                    <TableCell>{exp.requestedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(exp.requestedAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(exp.status)}</TableCell>
                    <TableCell>
                      {exp.status === 'completed' && exp.downloadUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={exp.downloadUrl} download>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        </Button>
                      )}
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
