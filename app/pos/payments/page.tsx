'use client';

import React, { useState } from 'react';
import { CreditCard, Banknote, Smartphone, Globe, QrCode, Receipt, CheckCircle, AlertTriangle, Calculator, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const mockOrder = {
  subtotal: 850.00,
  discount: 85.00,
  afterDiscount: 765.00,
  vat: 38.25,
  total: 803.25,
  loyaltyPointsEarned: 161,
};

const paymentMethods = [
  {
    id: 'cash',
    name: 'Cash',
    icon: Banknote,
    description: 'Cash payment in AED',
    available: true,
    processingFee: 0,
  },
  {
    id: 'credit-card',
    name: 'Credit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, AMEX',
    available: true,
    processingFee: 0,
  },
  {
    id: 'debit-card',
    name: 'Debit Card',
    icon: CreditCard,
    description: 'Bank debit cards',
    available: true,
    processingFee: 0,
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    icon: Smartphone,
    description: 'Contactless payment',
    available: true,
    processingFee: 0,
  },
  {
    id: 'samsung-pay',
    name: 'Samsung Pay',
    icon: Smartphone,
    description: 'Samsung contactless payment',
    available: true,
    processingFee: 0,
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    icon: Globe,
    description: 'Direct bank transfer',
    available: true,
    processingFee: 0,
  },
  {
    id: 'uae-pass',
    name: 'UAE Pass',
    icon: QrCode,
    description: 'UAE government digital payment',
    available: true,
    processingFee: 0,
  },
  {
    id: 'alipay',
    name: 'Alipay',
    icon: QrCode,
    description: 'Chinese payment system',
    available: true,
    processingFee: 0,
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

export default function PaymentsPage() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [splitPayment, setSplitPayment] = useState(false);
  const [paymentSplits, setPaymentSplits] = useState([
    { method: '', amount: 0 }
  ]);
  const [cashReceived, setCashReceived] = useState(0);
  const [installments, setInstallments] = useState(1);
  const [tipAmount, setTipAmount] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);

  const totalWithTip = mockOrder.total + tipAmount;
  const cashChange = cashReceived > totalWithTip ? cashReceived - totalWithTip : 0;
  const splitTotal = paymentSplits.reduce((sum, split) => sum + split.amount, 0);
  const remainingAmount = totalWithTip - splitTotal;

  const handlePayment = async () => {
    setProcessingPayment(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessingPayment(false);
    console.log('Payment processed successfully');
  };

  const addPaymentSplit = () => {
    setPaymentSplits([...paymentSplits, { method: '', amount: 0 }]);
  };

  const updatePaymentSplit = (index: number, field: string, value: any) => {
    const updated = paymentSplits.map((split, i) =>
      i === index ? { ...split, [field]: value } : split
    );
    setPaymentSplits(updated);
  };

  const removePaymentSplit = (index: number) => {
    setPaymentSplits(paymentSplits.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-oud-600" />
            Payment Processing
          </h1>
          <p className="text-muted-foreground mt-1">
            Multiple payment options and split payment support
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(mockOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Discount:</span>
              <span>-{formatCurrency(mockOrder.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span>After Discount:</span>
              <span>{formatCurrency(mockOrder.afterDiscount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT (5%):</span>
              <span>{formatCurrency(mockOrder.vat)}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Order Total:</span>
              <span>{formatCurrency(mockOrder.total)}</span>
            </div>

            {tipAmount > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Tip:</span>
                  <span>+{formatCurrency(tipAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total with Tip:</span>
                  <span className="text-oud-600">{formatCurrency(totalWithTip)}</span>
                </div>
              </>
            )}

            <Separator />

            <div className="text-center text-sm text-muted-foreground">
              <p>Customer will earn <strong>{mockOrder.loyaltyPointsEarned}</strong> loyalty points</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Select payment method and process transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="single" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single">Single Payment</TabsTrigger>
                <TabsTrigger value="split">Split Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-4">
                {/* Single Payment Method Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedMethod === method.id
                            ? 'border-oud-500 bg-oud-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => method.available && setSelectedMethod(method.id)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <Icon className="h-8 w-8 mb-2 text-oud-600" />
                          <h3 className="font-medium">{method.name}</h3>
                          <p className="text-xs text-muted-foreground">{method.description}</p>
                          {method.processingFee > 0 && (
                            <Badge variant="outline" className="mt-1">
                              +{formatCurrency(method.processingFee)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment Details Based on Selected Method */}
                {selectedMethod === 'cash' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Cash Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cash-received">Cash Received (AED)</Label>
                        <Input
                          id="cash-received"
                          type="number"
                          step="0.01"
                          value={cashReceived}
                          onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                          placeholder="Enter amount received"
                        />
                      </div>
                      {cashReceived > 0 && (
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between mb-2">
                            <span>Amount Due:</span>
                            <span className="font-medium">{formatCurrency(totalWithTip)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span>Cash Received:</span>
                            <span className="font-medium">{formatCurrency(cashReceived)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-bold">
                            <span>Change:</span>
                            <span className={cashChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(cashChange)}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {(selectedMethod === 'credit-card' || selectedMethod === 'debit-card') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Installment Options</Label>
                        <RadioGroup
                          value={installments.toString()}
                          onValueChange={(value) => setInstallments(parseInt(value))}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="installment-1" />
                            <Label htmlFor="installment-1">Full Payment</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="installment-3" />
                            <Label htmlFor="installment-3">3 Months (0% interest)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6" id="installment-6" />
                            <Label htmlFor="installment-6">6 Months (0% interest)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="12" id="installment-12" />
                            <Label htmlFor="installment-12">12 Months (0% interest)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {installments > 1 && (
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-sm">
                            Monthly payment: <strong>{formatCurrency(totalWithTip / installments)}</strong>
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Tip Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Optional Tip</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant={tipAmount === mockOrder.total * 0.1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTipAmount(mockOrder.total * 0.1)}
                      >
                        10%
                      </Button>
                      <Button
                        variant={tipAmount === mockOrder.total * 0.15 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTipAmount(mockOrder.total * 0.15)}
                      >
                        15%
                      </Button>
                      <Button
                        variant={tipAmount === mockOrder.total * 0.2 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTipAmount(mockOrder.total * 0.2)}
                      >
                        20%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTipAmount(0)}
                      >
                        No Tip
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-tip">Custom Tip Amount</Label>
                      <Input
                        id="custom-tip"
                        type="number"
                        step="0.01"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                        placeholder="Enter custom tip amount"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="split" className="space-y-4">
                {/* Split Payment */}
                <div className="space-y-4">
                  {paymentSplits.map((split, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Payment Method {index + 1}</Label>
                            <select
                              className="w-full p-2 border rounded-md"
                              value={split.method}
                              onChange={(e) => updatePaymentSplit(index, 'method', e.target.value)}
                            >
                              <option value="">Select method</option>
                              {paymentMethods.map((method) => (
                                <option key={method.id} value={method.id}>
                                  {method.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={split.amount}
                              onChange={(e) => updatePaymentSplit(index, 'amount', parseFloat(e.target.value) || 0)}
                              placeholder="Enter amount"
                            />
                          </div>
                          <div className="flex items-end">
                            {paymentSplits.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removePaymentSplit(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={addPaymentSplit}>
                      Add Payment Method
                    </Button>
                    <div className="text-right">
                      <p className="text-sm">Split Total: {formatCurrency(splitTotal)}</p>
                      <p className="text-sm font-medium">
                        Remaining: {formatCurrency(remainingAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Process Payment Button */}
            <div className="flex justify-end">
              <Button
                className="bg-oud-600 hover:bg-oud-700"
                size="lg"
                onClick={handlePayment}
                disabled={
                  processingPayment ||
                  (!selectedMethod && !splitPayment) ||
                  (selectedMethod === 'cash' && cashReceived < totalWithTip) ||
                  (splitPayment && Math.abs(remainingAmount) > 0.01)
                }
              >
                {processingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Process Payment {formatCurrency(totalWithTip)}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status */}
      {processingPayment && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oud-600"></div>
              <span className="text-lg font-medium">Processing payment...</span>
            </div>
            <p className="text-center text-muted-foreground mt-2">
              Please wait while we process your transaction
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}