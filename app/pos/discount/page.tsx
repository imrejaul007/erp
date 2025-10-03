'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Percent, Star, Gift, CreditCard, Calculator, Tag, Users, TrendingDown, Crown, Award,
  ArrowLeft} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

// Mock customer data with loyalty info
const mockCustomer = {
  id: 'CUST-001',
  name: 'Ahmed Al-Mansouri',
  email: 'ahmed@email.ae',
  phone: '+971 50 123 4567',
  loyaltyTier: 'Gold',
  loyaltyPoints: 2450,
  totalSpent: 15750.00,
  joinDate: '2023-06-15',
  lastVisit: '2024-09-28',
  purchaseHistory: 24,
  birthday: '1985-03-15',
  isVIP: true,
};

// Available discounts and offers
const availableDiscounts = [
  {
    id: 'DISC-001',
    type: 'Percentage',
    name: 'Gold Member Discount',
    value: 15,
    description: 'Exclusive 15% discount for Gold members',
    minPurchase: 500,
    maxDiscount: 500,
    applicable: true,
    autoApply: true,
  },
  {
    id: 'DISC-002',
    type: 'Fixed',
    name: 'Birthday Special',
    value: 100,
    description: 'AED 100 off for birthday month',
    minPurchase: 300,
    maxDiscount: 100,
    applicable: true,
    autoApply: false,
  },
  {
    id: 'DISC-003',
    type: 'Percentage',
    name: 'VIP Exclusive',
    value: 20,
    description: '20% off for VIP customers',
    minPurchase: 1000,
    maxDiscount: 1000,
    applicable: true,
    autoApply: false,
  },
  {
    id: 'DISC-004',
    type: 'BOGO',
    name: 'Buy 2 Get 1',
    value: 0,
    description: 'Buy 2 perfumes, get 1 free (lowest value)',
    minPurchase: 0,
    maxDiscount: 0,
    applicable: false,
    autoApply: false,
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

const getTierBadge = (tier: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Platinum': 'destructive',
    'Gold': 'default',
    'Silver': 'secondary',
    'Bronze': 'outline',
  };
  const icons = {
    'Platinum': Crown,
    'Gold': Award,
    'Silver': Star,
    'Bronze': Tag,
  };
  const Icon = icons[tier as keyof typeof icons] || Star;
  return (
    <Badge variant={variants[tier] || 'outline'} className="gap-1">
      <Icon className="h-3 w-3" />
      {tier}
    </Badge>
  );
};

export default function DiscountLoyaltyPage() {
  const router = useRouter();
  const [cartSubtotal] = useState(850.00);
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>(['DISC-001']);
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0);
  const [manualDiscountPercent, setManualDiscountPercent] = useState(0);
  const [manualDiscountFixed, setManualDiscountFixed] = useState(0);
  const [couponCode, setCouponCode] = useState('');

  const calculateDiscounts = () => {
    let totalDiscount = 0;
    let discountBreakdown = [];

    // Applied discount offers
    appliedDiscounts.forEach(discountId => {
      const discount = availableDiscounts.find(d => d.id === discountId);
      if (discount) {
        let discountAmount = 0;
        if (discount.type === 'Percentage') {
          discountAmount = Math.min((cartSubtotal * discount.value) / 100, discount.maxDiscount);
        } else if (discount.type === 'Fixed') {
          discountAmount = discount.value;
        }
        totalDiscount += discountAmount;
        discountBreakdown.push({ name: discount.name, amount: discountAmount });
      }
    });

    // Manual discounts
    if (manualDiscountPercent > 0) {
      const amount = (cartSubtotal * manualDiscountPercent) / 100;
      totalDiscount += amount;
      discountBreakdown.push({ name: `Manual ${manualDiscountPercent}%`, amount });
    }
    if (manualDiscountFixed > 0) {
      totalDiscount += manualDiscountFixed;
      discountBreakdown.push({ name: 'Manual Fixed', amount: manualDiscountFixed });
    }

    // Loyalty points (1 point = 1 AED)
    if (loyaltyPointsToUse > 0) {
      totalDiscount += loyaltyPointsToUse;
      discountBreakdown.push({ name: `Loyalty Points (${loyaltyPointsToUse})`, amount: loyaltyPointsToUse });
    }

    return { totalDiscount, discountBreakdown };
  };

  const { totalDiscount, discountBreakdown } = calculateDiscounts();
  const finalAmount = cartSubtotal - totalDiscount;
  const vatAmount = finalAmount * 0.05;
  const totalAmount = finalAmount + vatAmount;

  const toggleDiscount = (discountId: string) => {
    setAppliedDiscounts(prev =>
      prev.includes(discountId)
        ? prev.filter(id => id !== discountId)
        : [...prev, discountId]
    );
  };

  const maxLoyaltyPoints = Math.min(mockCustomer.loyaltyPoints, cartSubtotal * 0.5); // Max 50% of cart

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Percent className="h-8 w-8 text-oud-600" />
            Discounts & Loyalty
          </h1>
          <p className="text-muted-foreground mt-1">
            Apply discounts, loyalty benefits, and promotional offers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Customer Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{mockCustomer.name}</h3>
                  <p className="text-sm text-muted-foreground">{mockCustomer.email}</p>
                  <p className="text-sm text-muted-foreground">{mockCustomer.phone}</p>
                </div>
                <div className="text-right">
                  {getTierBadge(mockCustomer.loyaltyTier)}
                  {mockCustomer.isVIP && (
                    <Badge variant="destructive" className="ml-2">VIP</Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Loyalty Points</Label>
                  <p className="font-semibold text-oud-600">{mockCustomer.loyaltyPoints?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Spent</Label>
                  <p className="font-semibold">{formatCurrency(mockCustomer.totalSpent)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Purchases</Label>
                  <p className="font-semibold">{mockCustomer.purchaseHistory}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Member Since</Label>
                  <p className="font-semibold">{mockCustomer.joinDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cart Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Cart Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(cartSubtotal)}</span>
              </div>

              {discountBreakdown.map((discount, index) => (
                <div key={index} className="flex justify-between text-red-600">
                  <span className="text-sm">{discount.name}:</span>
                  <span className="text-sm">-{formatCurrency(discount.amount)}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between">
                <span>After Discounts:</span>
                <span className="font-medium">{formatCurrency(finalAmount)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>VAT (5%):</span>
                <span>{formatCurrency(vatAmount)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-oud-600">{formatCurrency(totalAmount)}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="text-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    You saved {formatCurrency(totalDiscount)}!
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discounts and Offers */}
      <Tabs defaultValue="available" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="available">Available Offers</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Points</TabsTrigger>
          <TabsTrigger value="manual">Manual Discount</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Discounts</CardTitle>
              <CardDescription>
                Discounts applicable to this customer and cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableDiscounts.map((discount) => (
                  <div
                    key={discount.id}
                    className={`p-4 border rounded-lg ${
                      !discount.applicable ? 'opacity-50 bg-gray-50' :
                      appliedDiscounts.includes(discount.id) ? 'border-oud-500 bg-oud-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{discount.name}</h4>
                          {discount.type === 'Percentage' && (
                            <Badge variant="outline">{discount.value}% OFF</Badge>
                          )}
                          {discount.type === 'Fixed' && (
                            <Badge variant="outline">{formatCurrency(discount.value)} OFF</Badge>
                          )}
                          {discount.type === 'BOGO' && (
                            <Badge variant="outline">BOGO</Badge>
                          )}
                          {discount.autoApply && (
                            <Badge variant="secondary">Auto-Applied</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{discount.description}</p>
                        {discount.minPurchase > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Min purchase: {formatCurrency(discount.minPurchase)}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <Switch
                          checked={appliedDiscounts.includes(discount.id)}
                          onCheckedChange={() => toggleDiscount(discount.id)}
                          disabled={!discount.applicable || discount.autoApply}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-oud-600" />
                Loyalty Points Redemption
              </CardTitle>
              <CardDescription>
                Use loyalty points to reduce your bill (1 point = AED 1)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-oud-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Available Points:</span>
                  <span className="text-xl sm:text-2xl font-bold text-oud-600">
                    {mockCustomer.loyaltyPoints?.toLocaleString() || "0"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Maximum usable: {maxLoyaltyPoints?.toLocaleString() || "0"} points (50% of cart)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loyalty-points">Points to Use</Label>
                <div className="flex gap-2">
                  <Input
                    id="loyalty-points"
                    type="number"
                    value={loyaltyPointsToUse}
                    onChange={(e) => setLoyaltyPointsToUse(Math.min(
                      parseInt(e.target.value) || 0,
                      maxLoyaltyPoints
                    ))}
                    max={maxLoyaltyPoints}
                    placeholder="Enter points"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setLoyaltyPointsToUse(maxLoyaltyPoints)}
                  >
                    Use Max
                  </Button>
                </div>
              </div>

              {loyaltyPointsToUse > 0 && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="text-sm">
                    Using <strong>{loyaltyPointsToUse?.toLocaleString() || "0"}</strong> points
                    = <strong>{formatCurrency(loyaltyPointsToUse)}</strong> discount
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Remaining points: {(mockCustomer.loyaltyPoints - loyaltyPointsToUse)?.toLocaleString() || "0"}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Points Earning</h4>
                <p className="text-sm text-muted-foreground">
                  This purchase will earn: <strong>{Math.floor(totalAmount / 5)}</strong> points
                  (1 point per AED 5 spent)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-oud-600" />
                Manual Discount
              </CardTitle>
              <CardDescription>
                Apply manual discounts (requires manager approval)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="percent-discount">Percentage Discount (%)</Label>
                  <Input
                    id="percent-discount"
                    type="number"
                    value={manualDiscountPercent}
                    onChange={(e) => setManualDiscountPercent(
                      Math.min(parseInt(e.target.value) || 0, 50)
                    )}
                    max={50}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">Maximum 50%</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fixed-discount">Fixed Amount (AED)</Label>
                  <Input
                    id="fixed-discount"
                    type="number"
                    value={manualDiscountFixed}
                    onChange={(e) => setManualDiscountFixed(
                      Math.min(parseInt(e.target.value) || 0, cartSubtotal * 0.5)
                    )}
                    max={cartSubtotal * 0.5}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum {formatCurrency(cartSubtotal * 0.5)}
                  </p>
                </div>
              </div>

              {(manualDiscountPercent > 0 || manualDiscountFixed > 0) && (
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Manager approval required</strong> for manual discounts
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-oud-600" />
                Coupon Code
              </CardTitle>
              <CardDescription>
                Apply promotional coupons and gift vouchers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                />
                <Button variant="outline">
                  Apply
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Gift Card/Voucher</h4>
                <div className="flex gap-2">
                  <Input placeholder="Enter gift card number" />
                  <Button variant="outline">
                    Check Balance
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-1">Available Coupons</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>• WELCOME10 - 10% off first purchase</p>
                  <p>• BIRTHDAY20 - AED 20 off birthday month</p>
                  <p>• LOYALTY15 - 15% off for loyalty members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}