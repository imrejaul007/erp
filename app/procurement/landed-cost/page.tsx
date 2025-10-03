'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Ship,
  DollarSign,
  Package,
  TrendingUp,
  Calculator,
  Plus,
  Download,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LandedCostCalculation {
  id: string;
  poNumber: string;
  supplier: string;
  product: string;
  origin: string;
  destination: string;
  quantity: number;
  unit: string;

  // Base costs
  productCost: number;

  // Shipping costs
  shippingCost: number;
  shippingMethod: string;

  // Customs & duties
  importDuty: number;
  importDutyRate: number;
  customsClearance: number;

  // Insurance
  insurance: number;
  insuranceRate: number;

  // Other costs
  handling: number;
  storage: number;
  otherFees: number;

  // Currency
  currency: string;
  exchangeRate: number;

  // Calculated
  totalLandedCost: number;
  costPerUnit: number;

  status: 'draft' | 'calculated' | 'completed';
  date: string;
}

export default function LandedCostPage() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [formData, setFormData] = useState({
    productCost: '',
    shippingCost: '',
    importDutyRate: '5',
    insuranceRate: '2',
    customsClearance: '',
    handling: '',
    storage: '',
    quantity: '',
    exchangeRate: '1',
  });

  // Mock data
  const calculations: LandedCostCalculation[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      supplier: 'Cambodian Oud Traders Ltd.',
      product: 'Premium Oud Wood Chips',
      origin: 'Phnom Penh, Cambodia',
      destination: 'Dubai, UAE',
      quantity: 500,
      unit: 'kg',

      productCost: 40000.0,

      shippingCost: 3500.0,
      shippingMethod: 'Air Freight',

      importDuty: 2200.0,
      importDutyRate: 5,
      customsClearance: 800.0,

      insurance: 880.0,
      insuranceRate: 2,

      handling: 500.0,
      storage: 300.0,
      otherFees: 250.0,

      currency: 'USD',
      exchangeRate: 3.67,

      totalLandedCost: 48430.0,
      costPerUnit: 96.86,

      status: 'completed',
      date: '2024-01-15',
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      supplier: 'Indian Attar House',
      product: 'Rose Absolute Oil',
      origin: 'Kannauj, India',
      destination: 'Dubai, UAE',
      quantity: 100,
      unit: 'liters',

      productCost: 25000.0,

      shippingCost: 1200.0,
      shippingMethod: 'Sea Freight',

      importDuty: 1300.0,
      importDutyRate: 5,
      customsClearance: 500.0,

      insurance: 520.0,
      insuranceRate: 2,

      handling: 300.0,
      storage: 200.0,
      otherFees: 150.0,

      currency: 'INR',
      exchangeRate: 0.044,

      totalLandedCost: 29170.0,
      costPerUnit: 291.70,

      status: 'calculated',
      date: '2024-01-18',
    },
  ];

  const calculateLandedCost = () => {
    const productCost = parseFloat(formData.productCost) || 0;
    const shippingCost = parseFloat(formData.shippingCost) || 0;
    const customsClearance = parseFloat(formData.customsClearance) || 0;
    const handling = parseFloat(formData.handling) || 0;
    const storage = parseFloat(formData.storage) || 0;
    const quantity = parseFloat(formData.quantity) || 1;
    const exchangeRate = parseFloat(formData.exchangeRate) || 1;
    const importDutyRate = parseFloat(formData.importDutyRate) || 0;
    const insuranceRate = parseFloat(formData.insuranceRate) || 0;

    const subtotal = productCost + shippingCost;
    const importDuty = (subtotal * importDutyRate) / 100;
    const insurance = (subtotal * insuranceRate) / 100;

    const totalLandedCost = (productCost + shippingCost + importDuty + customsClearance + insurance + handling + storage) * exchangeRate;
    const costPerUnit = totalLandedCost / quantity;

    return {
      productCost,
      shippingCost,
      importDuty,
      customsClearance,
      insurance,
      handling,
      storage,
      totalLandedCost,
      costPerUnit,
    };
  };

  const calculation = calculateLandedCost();

  const totalCalculations = calculations.length;
  const totalValue = calculations.reduce((sum, c) => sum + c.totalLandedCost, 0);
  const avgCostPerUnit = totalValue / calculations.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Landed Cost Calculator
          </h1>
          <p className="text-gray-600 mt-2">
            Calculate total import costs including duties, shipping, and fees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-500 to-cyan-600"
            onClick={() => setShowCalculator(!showCalculator)}
          >
            <Calculator className="mr-2 h-4 w-4" />
            New Calculation
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calculations</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalculations}</div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalValue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Total landed cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Unit</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {avgCostPerUnit.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">Average per unit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Ship className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculations.filter((c) => c.status === 'calculated').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">In transit</p>
          </CardContent>
        </Card>
      </div>

      {/* Calculator */}
      {showCalculator && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Landed Cost Calculator
            </CardTitle>
            <CardDescription>
              Calculate the total cost of importing goods including all fees and duties
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Base Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Product Cost (Base Price)</Label>
                <Input
                  type="number"
                  placeholder="Enter product cost..."
                  value={formData.productCost}
                  onChange={(e) => setFormData({ ...formData, productCost: e.target.value })}
                />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  placeholder="Enter quantity..."
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
            </div>

            {/* Shipping */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Ship className="h-5 w-5 text-blue-600" />
                Shipping Costs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Shipping Cost</Label>
                  <Input
                    type="number"
                    placeholder="Enter shipping cost..."
                    value={formData.shippingCost}
                    onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Shipping Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air">Air Freight</SelectItem>
                      <SelectItem value="sea">Sea Freight</SelectItem>
                      <SelectItem value="land">Land Transport</SelectItem>
                      <SelectItem value="express">Express Courier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Customs & Duties */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Customs & Duties
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Import Duty Rate (%)</Label>
                  <Input
                    type="number"
                    placeholder="Enter duty rate..."
                    value={formData.importDutyRate}
                    onChange={(e) =>
                      setFormData({ ...formData, importDutyRate: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Calculated: AED {calculation.importDuty.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label>Customs Clearance Fee</Label>
                  <Input
                    type="number"
                    placeholder="Enter clearance fee..."
                    value={formData.customsClearance}
                    onChange={(e) =>
                      setFormData({ ...formData, customsClearance: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-green-600" />
                Insurance & Risk
              </h3>
              <div>
                <Label>Insurance Rate (%)</Label>
                <Input
                  type="number"
                  placeholder="Enter insurance rate..."
                  value={formData.insuranceRate}
                  onChange={(e) => setFormData({ ...formData, insuranceRate: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Calculated: AED {calculation.insurance.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Additional Costs */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Additional Costs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Handling Fees</Label>
                  <Input
                    type="number"
                    placeholder="Handling..."
                    value={formData.handling}
                    onChange={(e) => setFormData({ ...formData, handling: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Storage Fees</Label>
                  <Input
                    type="number"
                    placeholder="Storage..."
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Exchange Rate</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Exchange rate..."
                    value={formData.exchangeRate}
                    onChange={(e) =>
                      setFormData({ ...formData, exchangeRate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="font-semibold text-lg mb-4 text-blue-900">Calculation Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-blue-700">Product Cost</p>
                  <p className="text-lg font-bold text-blue-900">
                    AED {calculation.productCost.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Shipping</p>
                  <p className="text-lg font-bold text-blue-900">
                    AED {calculation.shippingCost.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Import Duty</p>
                  <p className="text-lg font-bold text-blue-900">
                    AED {calculation.importDuty.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Insurance</p>
                  <p className="text-lg font-bold text-blue-900">
                    AED {calculation.insurance.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="border-t-2 border-blue-300 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Total Landed Cost</p>
                    <p className="text-3xl font-bold text-blue-900">
                      AED {calculation.totalLandedCost.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Cost Per Unit</p>
                    <p className="text-3xl font-bold text-blue-900">
                      AED {calculation.costPerUnit.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-600">
                <Plus className="mr-2 h-4 w-4" />
                Save Calculation
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Calculations */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Calculations</CardTitle>
          <CardDescription>Historical landed cost calculations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {calculations.map((calc) => (
            <Card key={calc.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{calc.product}</h3>
                      <Badge variant="outline">{calc.poNumber}</Badge>
                      <Badge
                        className={
                          calc.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }
                      >
                        {calc.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {calc.supplier} · {calc.origin} → {calc.destination}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Landed Cost</p>
                    <p className="text-2xl font-bold text-blue-600">
                      AED {calc.totalLandedCost.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Quantity</p>
                    <p className="font-semibold">
                      {calc.quantity} {calc.unit}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Product Cost</p>
                    <p className="font-semibold">AED {calc.productCost.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Shipping</p>
                    <p className="font-semibold">AED {calc.shippingCost.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Duties & Fees</p>
                    <p className="font-semibold">
                      AED {(calc.importDuty + calc.customsClearance).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Cost/Unit</p>
                    <p className="font-semibold text-blue-600">
                      AED {calc.costPerUnit.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
