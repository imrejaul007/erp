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
  Calculator,
  Package,
  Plane,
  DollarSign,
  Percent,
  FileText,
  Save,
  Download,
} from 'lucide-react';

export default function LandedCostPage() {
  const router = useRouter();

  const [calculation, setCalculation] = useState({
    productCost: 10000,
    quantity: 100,
    currency: 'USD',
    exchangeRate: 3.67,
    freightCost: 500,
    insuranceCost: 150,
    customsDuty: 5,
    importTax: 5,
    handlingFees: 200,
    brokerageFees: 150,
    otherCosts: 100,
  });

  const calculateLandedCost = () => {
    const productCostAED = calculation.productCost * calculation.exchangeRate;
    const customsDutyAED = (productCostAED * calculation.customsDuty) / 100;
    const importTaxAED = (productCostAED * calculation.importTax) / 100;

    const totalCost =
      productCostAED +
      calculation.freightCost +
      calculation.insuranceCost +
      customsDutyAED +
      importTaxAED +
      calculation.handlingFees +
      calculation.brokerageFees +
      calculation.otherCosts;

    const landedCostPerUnit = totalCost / calculation.quantity;

    return {
      productCostAED,
      customsDutyAED,
      importTaxAED,
      totalCost,
      landedCostPerUnit,
    };
  };

  const result = calculateLandedCost();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calculator className="h-8 w-8 text-blue-600" />
              Landed Cost Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate true import costs including freight, duties, and taxes
            </p>
          </div>
        </div>
        <Button variant="luxury">
          <Save className="h-4 w-4 mr-2" />
          Save Calculation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cost Calculator</CardTitle>
              <CardDescription>Enter all costs to calculate landed cost per unit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Product Costs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product Cost</Label>
                    <Input
                      type="number"
                      value={calculation.productCost}
                      onChange={(e) =>
                        setCalculation({ ...calculation, productCost: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity (Units)</Label>
                    <Input
                      type="number"
                      value={calculation.quantity}
                      onChange={(e) =>
                        setCalculation({ ...calculation, quantity: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <select
                      className="w-full border rounded-md px-3 py-2"
                      value={calculation.currency}
                      onChange={(e) => setCalculation({ ...calculation, currency: e.target.value })}
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>INR</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Exchange Rate to AED</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={calculation.exchangeRate}
                      onChange={(e) =>
                        setCalculation({ ...calculation, exchangeRate: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Logistics Costs (AED)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Freight Cost</Label>
                    <Input
                      type="number"
                      value={calculation.freightCost}
                      onChange={(e) =>
                        setCalculation({ ...calculation, freightCost: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Insurance Cost</Label>
                    <Input
                      type="number"
                      value={calculation.insuranceCost}
                      onChange={(e) =>
                        setCalculation({ ...calculation, insuranceCost: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Duties & Taxes (%)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customs Duty (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={calculation.customsDuty}
                      onChange={(e) =>
                        setCalculation({ ...calculation, customsDuty: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Import Tax (VAT) (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={calculation.importTax}
                      onChange={(e) =>
                        setCalculation({ ...calculation, importTax: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="text-blue-900">Landed Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-2 border-blue-200">
                <p className="text-sm text-muted-foreground">Total Landed Cost</p>
                <p className="text-3xl font-bold text-blue-600">
                  AED {result.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-green-200">
                <p className="text-sm text-muted-foreground">Cost Per Unit</p>
                <p className="text-3xl font-bold text-green-600">
                  AED {result.landedCostPerUnit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
