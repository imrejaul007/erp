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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  DollarSign,
  Percent,
  TrendingUp,
  Building
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Country {
  id: string
  countryName: string
  countryCode: string
  currency: string
  currencySymbol: string
  taxRate: number
  vatRate: number
  status: 'ACTIVE' | 'INACTIVE'
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

interface ExchangeRate {
  id: string
  fromCurrency: string
  toCurrency: string
  rate: number
  effectiveDate: Date
  createdAt: Date
  updatedAt: Date
}

interface Stats {
  totalCountries: number
  activeCountries: number
  totalCurrencies: number
  latestRateUpdate: string
}

export default function CountriesDashboard() {
  const [countries, setCountries] = useState<Country[]>([])
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateCountryDialogOpen, setIsCreateCountryDialogOpen] = useState(false)
  const [isEditCountryDialogOpen, setIsEditCountryDialogOpen] = useState(false)
  const [isCreateRateDialogOpen, setIsCreateRateDialogOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  // Form state for countries
  const [countryFormData, setCountryFormData] = useState({
    countryName: '',
    countryCode: '',
    currency: 'USD',
    currencySymbol: '$',
    taxRate: 0,
    vatRate: 0,
    status: 'ACTIVE' as const,
    notes: ''
  })

  // Form state for exchange rates
  const [rateFormData, setRateFormData] = useState({
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    rate: 0
  })

  useEffect(() => {
    fetchCountries()
    fetchExchangeRates()
  }, [statusFilter])

  const fetchCountries = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/countries?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setCountries(data.countries || [])
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch countries'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load countries'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('/api/exchange-rates')
      const data = await response.json()

      if (response.ok) {
        setExchangeRates(data.rates || [])
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
    }
  }

  const handleCreateCountry = async () => {
    try {
      const response = await fetch('/api/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(countryFormData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Country ${data.country.countryName} created successfully`
        })
        setIsCreateCountryDialogOpen(false)
        resetCountryForm()
        fetchCountries()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to create country'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create country'
      })
    }
  }

  const handleUpdateCountry = async () => {
    if (!selectedCountry) return

    try {
      const response = await fetch(`/api/countries?countryId=${selectedCountry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(countryFormData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Country updated successfully"
        })
        setIsEditCountryDialogOpen(false)
        setSelectedCountry(null)
        resetCountryForm()
        fetchCountries()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to update country'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to update country'
      })
    }
  }

  const handleDeleteCountry = async (countryId: string) => {
    if (!confirm('Are you sure you want to delete this country?')) return

    try {
      const response = await fetch(`/api/countries?countryId=${countryId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Country deleted successfully"
        })
        fetchCountries()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to delete country'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to delete country'
      })
    }
  }

  const handleCreateRate = async () => {
    try {
      const response = await fetch('/api/exchange-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rateFormData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Exchange rate created successfully"
        })
        setIsCreateRateDialogOpen(false)
        resetRateForm()
        fetchExchangeRates()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to create exchange rate'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create exchange rate'
      })
    }
  }

  const openEditCountryDialog = (country: Country) => {
    setSelectedCountry(country)
    setCountryFormData({
      countryName: country.countryName,
      countryCode: country.countryCode,
      currency: country.currency,
      currencySymbol: country.currencySymbol,
      taxRate: country.taxRate,
      vatRate: country.vatRate,
      status: country.status,
      notes: country.notes || ''
    })
    setIsEditCountryDialogOpen(true)
  }

  const resetCountryForm = () => {
    setCountryFormData({
      countryName: '',
      countryCode: '',
      currency: 'USD',
      currencySymbol: '$',
      taxRate: 0,
      vatRate: 0,
      status: 'ACTIVE',
      notes: ''
    })
  }

  const resetRateForm = () => {
    setRateFormData({
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      rate: 0
    })
  }

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE'
      ? <Badge variant="default">ACTIVE</Badge>
      : <Badge variant="secondary">INACTIVE</Badge>
  }

  const filteredCountries = countries.filter(country =>
    country.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.countryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8" />
            Multi-Country Configuration
          </h1>
          <p className="text-muted-foreground">Manage countries, currencies, taxes, and exchange rates</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateRateDialogOpen} onOpenChange={setIsCreateRateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => resetRateForm()}>
                <DollarSign className="h-4 w-4 mr-2" />
                Add Rate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Exchange Rate</DialogTitle>
                <DialogDescription>Create a new currency exchange rate</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromCurrency">From Currency</Label>
                    <Input
                      id="fromCurrency"
                      value={rateFormData.fromCurrency}
                      onChange={(e) => setRateFormData({...rateFormData, fromCurrency: e.target.value})}
                      placeholder="e.g., USD"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="toCurrency">To Currency</Label>
                    <Input
                      id="toCurrency"
                      value={rateFormData.toCurrency}
                      onChange={(e) => setRateFormData({...rateFormData, toCurrency: e.target.value})}
                      placeholder="e.g., EUR"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Exchange Rate</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.0001"
                    value={rateFormData.rate}
                    onChange={(e) => setRateFormData({...rateFormData, rate: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateRateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateRate}>Add Rate</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateCountryDialogOpen} onOpenChange={setIsCreateCountryDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetCountryForm()}>
                <Plus className="h-4 w-4 mr-2" />
                New Country
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Country Configuration</DialogTitle>
                <DialogDescription>Configure a new country for the system</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="countryName">Country Name *</Label>
                    <Input
                      id="countryName"
                      value={countryFormData.countryName}
                      onChange={(e) => setCountryFormData({...countryFormData, countryName: e.target.value})}
                      placeholder="e.g., United Arab Emirates"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countryCode">Country Code *</Label>
                    <Input
                      id="countryCode"
                      value={countryFormData.countryCode}
                      onChange={(e) => setCountryFormData({...countryFormData, countryCode: e.target.value})}
                      placeholder="e.g., AE"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency Code</Label>
                    <Input
                      id="currency"
                      value={countryFormData.currency}
                      onChange={(e) => setCountryFormData({...countryFormData, currency: e.target.value})}
                      placeholder="e.g., AED"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currencySymbol">Currency Symbol</Label>
                    <Input
                      id="currencySymbol"
                      value={countryFormData.currencySymbol}
                      onChange={(e) => setCountryFormData({...countryFormData, currencySymbol: e.target.value})}
                      placeholder="e.g., د.إ"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.01"
                      value={countryFormData.taxRate}
                      onChange={(e) => setCountryFormData({...countryFormData, taxRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatRate">VAT Rate (%)</Label>
                    <Input
                      id="vatRate"
                      type="number"
                      step="0.01"
                      value={countryFormData.vatRate}
                      onChange={(e) => setCountryFormData({...countryFormData, vatRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={countryFormData.status} onValueChange={(value: any) => setCountryFormData({...countryFormData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={countryFormData.notes}
                    onChange={(e) => setCountryFormData({...countryFormData, notes: e.target.value})}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateCountryDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateCountry}>Create Country</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Countries</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCountries}</div>
              <p className="text-xs text-muted-foreground">Configured markets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Countries</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCountries}</div>
              <p className="text-xs text-muted-foreground">Currently trading</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currencies</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCurrencies}</div>
              <p className="text-xs text-muted-foreground">Managed currencies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Rate Update</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.latestRateUpdate || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">Latest exchange rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="countries">
        <TabsList>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
        </TabsList>

        {/* Countries Tab */}
        <TabsContent value="countries" className="space-y-4">
          {/* Filters and Search */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by country, code, or currency..."
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchCountries}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Countries Table */}
          <Card>
            <CardHeader>
              <CardTitle>Country Configurations</CardTitle>
              <CardDescription>Manage all country settings</CardDescription>
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
                      <TableHead>Country</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Tax Rate</TableHead>
                      <TableHead>VAT Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCountries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No countries found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCountries.map((country) => (
                        <TableRow key={country.id}>
                          <TableCell className="font-medium">{country.countryName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{country.countryCode}</Badge>
                          </TableCell>
                          <TableCell>
                            {country.currencySymbol} {country.currency}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              {country.taxRate}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              {country.vatRate}%
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(country.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditCountryDialog(country)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteCountry(country.id)}>
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
        </TabsContent>

        {/* Exchange Rates Tab */}
        <TabsContent value="rates">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Rates</CardTitle>
              <CardDescription>Manage currency conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From Currency</TableHead>
                    <TableHead>To Currency</TableHead>
                    <TableHead>Exchange Rate</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exchangeRates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No exchange rates configured
                      </TableCell>
                    </TableRow>
                  ) : (
                    exchangeRates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell className="font-medium">{rate.fromCurrency}</TableCell>
                        <TableCell className="font-medium">{rate.toCurrency}</TableCell>
                        <TableCell className="font-mono">{rate.rate.toFixed(4)}</TableCell>
                        <TableCell>{new Date(rate.effectiveDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(rate.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Country Dialog */}
      <Dialog open={isEditCountryDialogOpen} onOpenChange={setIsEditCountryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Country Configuration</DialogTitle>
            <DialogDescription>Update country settings</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-countryName">Country Name</Label>
                <Input
                  id="edit-countryName"
                  value={countryFormData.countryName}
                  onChange={(e) => setCountryFormData({...countryFormData, countryName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-countryCode">Country Code</Label>
                <Input
                  id="edit-countryCode"
                  value={countryFormData.countryCode}
                  onChange={(e) => setCountryFormData({...countryFormData, countryCode: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-currency">Currency Code</Label>
                <Input
                  id="edit-currency"
                  value={countryFormData.currency}
                  onChange={(e) => setCountryFormData({...countryFormData, currency: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-currencySymbol">Currency Symbol</Label>
                <Input
                  id="edit-currencySymbol"
                  value={countryFormData.currencySymbol}
                  onChange={(e) => setCountryFormData({...countryFormData, currencySymbol: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-taxRate">Tax Rate (%)</Label>
                <Input
                  id="edit-taxRate"
                  type="number"
                  step="0.01"
                  value={countryFormData.taxRate}
                  onChange={(e) => setCountryFormData({...countryFormData, taxRate: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vatRate">VAT Rate (%)</Label>
                <Input
                  id="edit-vatRate"
                  type="number"
                  step="0.01"
                  value={countryFormData.vatRate}
                  onChange={(e) => setCountryFormData({...countryFormData, vatRate: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={countryFormData.status} onValueChange={(value: any) => setCountryFormData({...countryFormData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={countryFormData.notes}
                onChange={(e) => setCountryFormData({...countryFormData, notes: e.target.value})}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCountryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCountry}>Update Country</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
