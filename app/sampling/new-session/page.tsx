'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSamplingSession } from '@/lib/services/sampling-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Search,
  Plus,
  Trash2,
  Save,
  Droplet,
  Flame,
  Package,
  ShoppingCart,
  XCircle,
  DollarSign,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

// Sample products for testing
const availableProducts = [
  {
    id: 'PRD001',
    name: 'Royal Oud - Premium',
    code: 'RO-001',
    type: 'perfume',
    testerStock: 45,
    unit: 'ml',
    pricePerUnit: 15
  },
  {
    id: 'PRD002',
    name: 'Cambodian Oud Chips',
    code: 'CO-003',
    type: 'oud',
    testerStock: 12,
    unit: 'g',
    pricePerUnit: 25
  },
  {
    id: 'PRD003',
    name: 'Rose Attar Supreme',
    code: 'RA-002',
    type: 'attar',
    testerStock: 8,
    unit: 'ml',
    pricePerUnit: 20
  },
  {
    id: 'PRD004',
    name: 'Musk Al Haramain',
    code: 'MH-005',
    type: 'perfume',
    testerStock: 68,
    unit: 'ml',
    pricePerUnit: 12
  },
  {
    id: 'PRD005',
    name: 'Hindi Oud Superior',
    code: 'HO-008',
    type: 'oud',
    testerStock: 25,
    unit: 'g',
    pricePerUnit: 30
  },
  {
    id: 'PRD006',
    name: 'Amber Essence Deluxe',
    code: 'AE-004',
    type: 'attar',
    testerStock: 15,
    unit: 'ml',
    pricePerUnit: 18
  }
];

const notPurchaseReasons = [
  'Price too high',
  "Didn't like fragrance",
  'Will decide later',
  'Found better option elsewhere',
  'Wanted different packaging/size',
  'Stock not available',
  'Need more time to think',
  'Other (specify in notes)'
];

interface TestedProduct {
  productId: string;
  productName: string;
  productCode: string;
  type: string;
  quantityUsed: number;
  unit: string;
  cost: number;
}

export default function NewSamplingSessionPage() {
  const router = useRouter();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerType, setCustomerType] = useState('walk-in');

  const [testedProducts, setTestedProducts] = useState<TestedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [outcome, setOutcome] = useState<'purchased' | 'not_purchased' | null>(null);
  const [saleAmount, setSaleAmount] = useState('');
  const [notPurchaseReason, setNotPurchaseReason] = useState('');
  const [notes, setNotes] = useState('');
  const [staff, setStaff] = useState('');

  const addProduct = (product: typeof availableProducts[0]) => {
    const existing = testedProducts.find(p => p.productId === product.id);
    if (!existing) {
      setTestedProducts([...testedProducts, {
        productId: product.id,
        productName: product.name,
        productCode: product.code,
        type: product.type,
        quantityUsed: 0,
        unit: product.unit,
        cost: 0
      }]);
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    const product = availableProducts.find(p => p.id === productId);
    if (!product) return;

    setTestedProducts(testedProducts.map(p =>
      p.productId === productId
        ? { ...p, quantityUsed: quantity, cost: quantity * product.pricePerUnit }
        : p
    ));
  };

  const removeProduct = (productId: string) => {
    setTestedProducts(testedProducts.filter(p => p.productId !== productId));
  };

  const totalTesterCost = testedProducts.reduce((sum, p) => sum + p.cost, 0);

  const handleSave = async () => {
    // Validation
    if (!isAnonymous && (!customerName || !customerPhone)) {
      alert('Please enter customer details or mark as anonymous');
      return;
    }

    if (testedProducts.length === 0) {
      alert('Please add at least one product tested');
      return;
    }

    if (!outcome) {
      alert('Please select the outcome (Purchased or Not Purchased)');
      return;
    }

    if (outcome === 'purchased' && !saleAmount) {
      alert('Please enter the sale amount');
      return;
    }

    if (outcome === 'not_purchased' && !notPurchaseReason) {
      alert('Please select the reason for not purchasing');
      return;
    }

    if (!staff) {
      alert('Please select the staff member');
      return;
    }

    try {
      // Create sampling session and auto-deduct tester stock
      const sessionData = {
        customer: isAnonymous ? { anonymous: true } : {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          type: customerType
        },
        testedProducts,
        totalTesterCost,
        outcome,
        saleAmount: outcome === 'purchased' ? parseFloat(saleAmount) : 0,
        notPurchaseReason: outcome === 'not_purchased' ? notPurchaseReason : undefined,
        notes,
        staff,
        location: 'Dubai Mall', // In production, get from user's location context
        timestamp: new Date().toISOString()
      };

      await createSamplingSession(sessionData);

      alert('Sampling session saved successfully! Tester stock has been deducted.');

      // Redirect to sessions list
      router.push('/sampling');
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving session. Please try again.');
    }
  };

  const filteredProducts = availableProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'perfume': return <Droplet className="h-4 w-4" />;
      case 'oud': return <Flame className="h-4 w-4" />;
      case 'attar': return <Package className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/sampling')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Sampling Session</h1>
          <p className="text-gray-600 mt-1">Record customer trial and track conversion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer & Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Customer Information</CardTitle>
                  <CardDescription className="text-gray-600">Walk-in or returning customer details</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-gray-600">Anonymous</Label>
                  <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isAnonymous ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-900">Customer Name *</Label>
                      <Input
                        placeholder="Enter customer name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-900">Customer Type</Label>
                      <Select value={customerType} onValueChange={setCustomerType}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="walk-in">Walk-in</SelectItem>
                          <SelectItem value="returning">Returning Customer</SelectItem>
                          <SelectItem value="vip">VIP Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-900">Phone Number *</Label>
                      <Input
                        placeholder="+971 50 XXX XXXX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-900">Email (Optional)</Label>
                      <Input
                        type="email"
                        placeholder="customer@email.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <User className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Anonymous walk-in customer</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products Tested */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Products Shown & Tested</CardTitle>
              <CardDescription className="text-gray-600">Add products and track tester usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search & Add Products */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products to add..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Product Search Results */}
              {searchTerm && (
                <div className="border rounded-lg p-2 max-h-48 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => addProduct(product)}
                    >
                      <div className="flex items-center gap-2">
                        {getProductIcon(product.type)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.code} • Tester: {product.testerStock}{product.unit}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Products */}
              <Separator />
              <div className="space-y-3">
                {testedProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No products added yet</p>
                    <p className="text-sm">Search and add products above</p>
                  </div>
                ) : (
                  testedProducts.map(product => (
                    <div key={product.productId} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getProductIcon(product.type)}
                          <div>
                            <p className="font-medium text-gray-900">{product.productName}</p>
                            <p className="text-xs text-gray-500">{product.productCode}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeProduct(product.productId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <Label className="text-gray-600 text-sm">Quantity Used:</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={product.quantityUsed || ''}
                          onChange={(e) => updateProductQuantity(product.productId, parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                        <span className="text-sm text-gray-600">{product.unit}</span>
                        <span className="text-sm text-gray-600 ml-auto">
                          Cost: AED {product.cost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Outcome */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Session Outcome</CardTitle>
              <CardDescription className="text-gray-600">Did the customer make a purchase?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    outcome === 'purchased'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setOutcome('purchased')}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className={`h-6 w-6 ${outcome === 'purchased' ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <p className={`font-semibold ${outcome === 'purchased' ? 'text-green-900' : 'text-gray-900'}`}>
                        Purchased
                      </p>
                      <p className="text-sm text-gray-600">Customer made a purchase</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    outcome === 'not_purchased'
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                  onClick={() => setOutcome('not_purchased')}
                >
                  <div className="flex items-center gap-3">
                    <XCircle className={`h-6 w-6 ${outcome === 'not_purchased' ? 'text-red-600' : 'text-gray-400'}`} />
                    <div>
                      <p className={`font-semibold ${outcome === 'not_purchased' ? 'text-red-900' : 'text-gray-900'}`}>
                        Not Purchased
                      </p>
                      <p className="text-sm text-gray-600">Customer didn't buy</p>
                    </div>
                  </div>
                </div>
              </div>

              {outcome === 'purchased' && (
                <div>
                  <Label className="text-gray-900">Sale Amount (AED) *</Label>
                  <div className="relative mt-2">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={saleAmount}
                      onChange={(e) => setSaleAmount(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              {outcome === 'not_purchased' && (
                <div>
                  <Label className="text-gray-900">Reason for Not Purchasing *</Label>
                  <Select value={notPurchaseReason} onValueChange={setNotPurchaseReason}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      {notPurchaseReasons.map(reason => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Additional Notes</CardTitle>
              <CardDescription className="text-gray-600">Record any additional observations</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Customer preferences, specific requests, follow-up notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-gray-900">Session Summary</CardTitle>
              <CardDescription className="text-gray-600">Overview of this trial session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-900">Staff Member *</Label>
                <Select value={staff} onValueChange={setStaff}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select staff..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fatima-hassan">Fatima Hassan</SelectItem>
                    <SelectItem value="mohammed-ali">Mohammed Ali</SelectItem>
                    <SelectItem value="aisha-ahmed">Aisha Ahmed</SelectItem>
                    <SelectItem value="omar-khalid">Omar Khalid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Products Tested:</span>
                  <span className="font-semibold text-gray-900">{testedProducts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tester Cost:</span>
                  <span className="font-semibold text-gray-900">AED {totalTesterCost.toFixed(2)}</span>
                </div>
                {outcome === 'purchased' && saleAmount && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sale Amount:</span>
                      <span className="font-semibold text-green-600">AED {parseFloat(saleAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-900 font-medium">ROI:</span>
                      <span className="font-bold text-blue-600">
                        {totalTesterCost > 0
                          ? `${((parseFloat(saleAmount) / totalTesterCost - 1) * 100).toFixed(0)}%`
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Button
                  onClick={handleSave}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Session
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/sampling')}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>

              {outcome && (
                <div className={`p-3 rounded-lg ${
                  outcome === 'purchased' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center gap-2">
                    {outcome === 'purchased' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      outcome === 'purchased' ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {outcome === 'purchased' ? 'Conversion Successful' : 'Opportunity Lost'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
