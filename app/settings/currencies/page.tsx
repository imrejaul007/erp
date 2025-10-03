'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Plus,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Edit,
  Trash2,
  Globe,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

export default function CurrenciesPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<any>(null);

  const currencies = [
    {
      id: 1,
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      exchangeRate: 1.0,
      isBase: true,
      isActive: true,
      lastUpdated: '2025-10-03 18:30:00',
      country: 'UAE',
    },
    {
      id: 2,
      code: 'SAR',
      name: 'Saudi Riyal',
      symbol: 'ر.س',
      exchangeRate: 1.02,
      isBase: false,
      isActive: true,
      lastUpdated: '2025-10-03 18:30:00',
      country: 'Saudi Arabia',
    },
    {
      id: 3,
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      exchangeRate: 3.67,
      isBase: false,
      isActive: true,
      lastUpdated: '2025-10-03 18:30:00',
      country: 'United States',
    },
    {
      id: 4,
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      exchangeRate: 4.02,
      isBase: false,
      isActive: true,
      lastUpdated: '2025-10-03 18:30:00',
      country: 'European Union',
    },
    {
      id: 5,
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
      exchangeRate: 0.044,
      isBase: false,
      isActive: true,
      lastUpdated: '2025-10-03 18:30:00',
      country: 'India',
    },
    {
      id: 6,
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      exchangeRate: 4.68,
      isBase: false,
      isActive: true,
      lastUpdated: '2025-10-03 18:30:00',
      country: 'United Kingdom',
    },
  ];

  const stats = [
    {
      label: 'Active Currencies',
      value: '6',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Base Currency',
      value: 'AED',
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Last Sync',
      value: '5 mins ago',
      icon: RefreshCw,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Auto-Update',
      value: 'Enabled',
      icon: CheckCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const handleEdit = (currency: any) => {
    setEditingCurrency(currency);
    setIsDialogOpen(true);
  };

  const handleUpdateRates = () => {
    alert('Fetching latest exchange rates from API...');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              Multi-Currency Management
            </h1>
            <p className="text-muted-foreground">Manage currencies and exchange rates</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUpdateRates}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Rates
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="luxury" onClick={() => setEditingCurrency(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Currency
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCurrency ? 'Edit Currency' : 'Add New Currency'}
                </DialogTitle>
                <DialogDescription>
                  Configure currency settings and exchange rates
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Currency Code</Label>
                    <Input placeholder="e.g., AED" />
                  </div>
                  <div className="space-y-2">
                    <Label>Symbol</Label>
                    <Input placeholder="e.g., د.إ" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Currency Name</Label>
                  <Input placeholder="e.g., UAE Dirham" />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input placeholder="e.g., United Arab Emirates" />
                </div>
                <div className="space-y-2">
                  <Label>Exchange Rate (to base currency)</Label>
                  <Input type="number" step="0.0001" placeholder="e.g., 1.0000" />
                  <p className="text-xs text-muted-foreground">
                    1 {editingCurrency?.code || 'XXX'} = ? AED
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Set as Base Currency</Label>
                  <Switch />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="luxury" className="flex-1">
                    {editingCurrency ? 'Update' : 'Add'} Currency
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Exchange Rate Settings</CardTitle>
          <CardDescription>Configure automatic exchange rate updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-Update Exchange Rates</p>
              <p className="text-sm text-muted-foreground">
                Automatically fetch rates from external API
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Update Frequency</p>
              <p className="text-sm text-muted-foreground">How often to sync exchange rates</p>
            </div>
            <select className="border rounded-md px-3 py-2">
              <option>Every Hour</option>
              <option>Every 6 Hours</option>
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Exchange Rate Provider</Label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>OpenExchangeRates</option>
              <option>XE.com API</option>
              <option>European Central Bank</option>
              <option>Manual Entry Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Currencies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Currencies</CardTitle>
          <CardDescription>Manage your accepted currencies and rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Currency</th>
                  <th className="text-left p-3 font-semibold">Code</th>
                  <th className="text-left p-3 font-semibold">Country</th>
                  <th className="text-right p-3 font-semibold">Exchange Rate</th>
                  <th className="text-center p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Last Updated</th>
                  <th className="text-right p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((currency) => (
                  <tr key={currency.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                          {currency.symbol}
                        </div>
                        <div>
                          <div className="font-semibold">{currency.name}</div>
                          {currency.isBase && (
                            <Badge variant="outline" className="mt-1">
                              Base Currency
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-semibold">{currency.code}</td>
                    <td className="p-3">{currency.country}</td>
                    <td className="p-3 text-right font-mono">
                      {currency.exchangeRate.toFixed(4)}
                    </td>
                    <td className="p-3 text-center">
                      {currency.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(currency.lastUpdated).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(currency)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {!currency.isBase && (
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Currency Converter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Currency Converter
          </CardTitle>
          <CardDescription>Convert between currencies using current rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" placeholder="100.00" defaultValue="100" />
            </div>
            <div className="space-y-2">
              <Label>From Currency</Label>
              <select className="w-full border rounded-md px-3 py-2">
                {currencies.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>To Currency</Label>
              <select className="w-full border rounded-md px-3 py-2">
                {currencies.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Result</p>
            <p className="text-3xl font-bold text-green-600">367.00 USD</p>
            <p className="text-sm text-muted-foreground mt-1">
              1 AED = 3.67 USD (as of Oct 3, 2025)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
