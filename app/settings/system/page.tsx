'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, Save, RefreshCw, DollarSign, Weight, Edit2, X, Check } from 'lucide-react';
import { unitConversions, currencyRates, type UnitConversion, type CurrencyRate } from '@/lib/settings';

export default function SystemSettingsPage() {
  const router = useRouter();
  const [units, setUnits] = useState<UnitConversion[]>(unitConversions);
  const [currencies, setCurrencies] = useState<CurrencyRate[]>(currencyRates);
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [editingCurrency, setEditingCurrency] = useState<string | null>(null);

  const handleUnitEdit = (id: string, newFactor: number) => {
    setUnits(units.map(u => u.id === id ? { ...u, factor: newFactor, to: `${newFactor} ${u.to.split(' ')[1]}` } : u));
    setEditingUnit(null);
  };

  const handleCurrencyEdit = (code: string, newRate: number) => {
    setCurrencies(currencies.map(c =>
      c.code === code ? { ...c, rateToAED: newRate, lastUpdated: new Date().toISOString() } : c
    ));
    setEditingCurrency(null);
  };

  const saveSettings = () => {
    // In a real app, this would save to database
    localStorage.setItem('unitConversions', JSON.stringify(units));
    localStorage.setItem('currencyRates', JSON.stringify(currencies));
    alert('Settings saved successfully! These rates will now be used throughout the application.');
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setUnits(unitConversions);
      setCurrencies(currencyRates);
      localStorage.removeItem('unitConversions');
      localStorage.removeItem('currencyRates');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600">
                Manage unit conversions and currency exchange rates used across the application
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="units" className="space-y-4">
        <TabsList>
          <TabsTrigger value="units" className="gap-2">
            <Weight className="h-4 w-4" />
            Unit Conversions
          </TabsTrigger>
          <TabsTrigger value="currency" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Currency Rates
          </TabsTrigger>
        </TabsList>

        {/* Unit Conversions Tab */}
        <TabsContent value="units" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unit Conversion Rates</CardTitle>
              <CardDescription>
                Manage weight and volume conversion factors used throughout the system (Raw Materials, Inventory, Production, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table className="table-modern">
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Conversion Factor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.map((unit) => (
                    <TableRow key={unit.id} className="group">
                      <TableCell className="font-medium text-gray-900 group-hover:text-gray-900">
                        {unit.from}
                      </TableCell>
                      <TableCell className="text-gray-900 group-hover:text-gray-900">
                        {unit.to}
                      </TableCell>
                      <TableCell className="text-gray-900 group-hover:text-gray-900">
                        {editingUnit === unit.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            defaultValue={unit.factor}
                            className="w-32"
                            id={`factor-${unit.id}`}
                            autoFocus
                          />
                        ) : (
                          <span className="font-semibold">{unit.factor}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-900 group-hover:text-gray-900">
                        <Badge variant="outline" className="capitalize">
                          {unit.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {unit.editable ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Editable
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            Fixed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {unit.editable && (
                          <div className="flex gap-2">
                            {editingUnit === unit.id ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const input = document.getElementById(`factor-${unit.id}`) as HTMLInputElement;
                                    handleUnitEdit(unit.id, parseFloat(input.value));
                                  }}
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingUnit(null)}
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingUnit(unit.id)}
                              >
                                <Edit2 className="h-4 w-4 text-gray-600" />
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Converter Tool */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Weight Converter</CardTitle>
              <CardDescription>Test your conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900">Value</Label>
                  <Input type="number" placeholder="100" id="convert-value" className="text-gray-900" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">From Unit</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900">
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="tola">Tola</option>
                    <option value="oz">Ounces (oz)</option>
                    <option value="lb">Pounds (lb)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">To Unit</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900">
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="tola">Tola</option>
                    <option value="oz">Ounces (oz)</option>
                    <option value="lb">Pounds (lb)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">Result</Label>
                  <Input type="text" placeholder="0.00" disabled className="bg-gray-50 font-semibold text-gray-900" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Currency Rates Tab */}
        <TabsContent value="currency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currency Exchange Rates</CardTitle>
              <CardDescription>
                Manage exchange rates relative to AED (UAE Dirham). These rates are used in Purchase Orders, Sales, Costing, and Financial Reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table className="table-modern">
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Rate to AED</TableHead>
                    <TableHead>Example</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencies.map((currency) => (
                    <TableRow key={currency.code} className="group">
                      <TableCell className="font-medium text-gray-900 group-hover:text-gray-900">
                        {currency.name}
                      </TableCell>
                      <TableCell className="text-gray-900 group-hover:text-gray-900">
                        <Badge variant="outline">{currency.code}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 group-hover:text-gray-900">
                        <span className="font-semibold text-lg">{currency.symbol}</span>
                      </TableCell>
                      <TableCell className="text-gray-900 group-hover:text-gray-900">
                        {editingCurrency === currency.code ? (
                          <Input
                            type="number"
                            step="0.0001"
                            defaultValue={currency.rateToAED}
                            className="w-32"
                            id={`rate-${currency.code}`}
                            autoFocus
                          />
                        ) : (
                          <span className="font-semibold">{currency.rateToAED.toFixed(4)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600 group-hover:text-gray-700">
                        <span className="text-xs">
                          1 AED = {(1 / currency.rateToAED).toFixed(4)} {currency.code}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 group-hover:text-gray-700">
                        <span className="text-xs">
                          {new Date(currency.lastUpdated).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {currency.code !== 'AED' && (
                          <div className="flex gap-2">
                            {editingCurrency === currency.code ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const input = document.getElementById(`rate-${currency.code}`) as HTMLInputElement;
                                    handleCurrencyEdit(currency.code, parseFloat(input.value));
                                  }}
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingCurrency(null)}
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingCurrency(currency.code)}
                              >
                                <Edit2 className="h-4 w-4 text-gray-600" />
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Currency Converter Tool */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Currency Converter</CardTitle>
              <CardDescription>Test your exchange rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900">Amount</Label>
                  <Input type="number" placeholder="1000" id="currency-value" className="text-gray-900" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">From Currency</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900">
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">To Currency</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900">
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">Result</Label>
                  <Input type="text" placeholder="0.00" disabled className="bg-gray-50 font-semibold text-gray-900" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
