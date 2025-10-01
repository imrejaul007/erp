'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ShoppingCart,
  Scan,
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  UserPlus,
  CreditCard,
  Smartphone,
  DollarSign,
  Receipt,
  Calculator,
  Package,
  Scale,
  Droplets,
  Star,
  Gift,
  Percent,
  TagIcon,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Key,
  Settings,
  Printer,
  Mail,
  MessageSquare
} from 'lucide-react';

// Enhanced product data with multi-unit support
const products = [
  {
    id: 'PRD001',
    name: 'Royal Oud Premium',
    nameArabic: 'العود الملكي الفاخر',
    category: 'Oud Oil',
    barcode: '8901234567890',
    basePrice: 850, // per 1ml
    units: [
      { name: 'ml', rate: 1, min: 0.1 },
      { name: 'tola', rate: 11.66, min: 0.1 }, // 1 tola = 11.66ml
      { name: 'gram', rate: 1, min: 0.1 },
      { name: 'oz', rate: 29.57, min: 0.1 }
    ],
    stock: 250,
    stockUnit: 'ml',
    vat: 5,
    image: '/placeholder-oud.jpg',
    isTester: false,
    isWeightBased: true
  },
  {
    id: 'PRD002',
    name: 'Rose Attar Deluxe',
    nameArabic: 'عطر الورد الفاخر',
    category: 'Attar',
    barcode: '8901234567891',
    basePrice: 450,
    units: [
      { name: 'ml', rate: 1, min: 0.5 },
      { name: 'tola', rate: 11.66, min: 0.1 }
    ],
    stock: 180,
    stockUnit: 'ml',
    vat: 5,
    image: '/placeholder-rose.jpg',
    isTester: false,
    isWeightBased: true
  },
  {
    id: 'PRD003',
    name: 'Oud Chips - Cambodian',
    nameArabic: 'عود كمبودي',
    category: 'Oud Chips',
    barcode: '8901234567892',
    basePrice: 120, // per gram
    units: [
      { name: 'gram', rate: 1, min: 1 },
      { name: 'tola', rate: 11.66, min: 0.1 },
      { name: 'kg', rate: 1000, min: 0.01 }
    ],
    stock: 500,
    stockUnit: 'gram',
    vat: 5,
    image: '/placeholder-chips.jpg',
    isTester: false,
    isWeightBased: true
  },
  {
    id: 'PRD004',
    name: 'Perfume Bottle 12ml',
    nameArabic: 'زجاجة عطر ١٢ مل',
    category: 'Accessories',
    barcode: '8901234567893',
    basePrice: 25,
    units: [
      { name: 'piece', rate: 1, min: 1 }
    ],
    stock: 100,
    stockUnit: 'piece',
    vat: 5,
    image: '/placeholder-bottle.jpg',
    isTester: false,
    isWeightBased: false
  }
];

// Customer database
const customers = [
  {
    id: 'CUST001',
    name: 'Ahmed Al-Rashid',
    nameArabic: 'أحمد الراشد',
    phone: '+971501234567',
    email: 'ahmed@email.com',
    type: 'VIP',
    loyaltyPoints: 1250,
    discountRate: 10,
    totalSpent: 15000
  },
  {
    id: 'CUST002',
    name: 'Fatima Hassan',
    nameArabic: 'فاطمة حسن',
    phone: '+971559876543',
    email: 'fatima@email.com',
    type: 'Premium',
    loyaltyPoints: 850,
    discountRate: 5,
    totalSpent: 8500
  }
];

// Promotion rules
const promotions = [
  {
    id: 'PROMO001',
    name: 'Ramadan Special',
    nameArabic: 'عرض رمضان',
    type: 'percentage',
    value: 15,
    minPurchase: 500,
    active: true,
    validUntil: '2024-04-30'
  },
  {
    id: 'PROMO002',
    name: 'Buy 2 Get 1',
    nameArabic: 'اشتري ٢ واحصل على ١',
    type: 'buy_x_get_y',
    buyQty: 2,
    getQty: 1,
    categoryFilter: 'Attar',
    active: true,
    validUntil: '2024-12-31'
  }
];

export default function POSPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [customDiscount, setCustomDiscount] = useState({ type: 'percentage', value: 0 });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    nameArabic: '',
    phone: '',
    email: '',
    type: 'Regular'
  });

  // Unit conversion helper
  const convertUnits = (fromUnit: string, toUnit: string, quantity: number, product: any) => {
    const fromRate = product.units.find((u: any) => u.name === fromUnit)?.rate || 1;
    const toRate = product.units.find((u: any) => u.name === toUnit)?.rate || 1;
    return (quantity * fromRate) / toRate;
  };

  // Calculate price based on unit and quantity
  const calculatePrice = (product: any, quantity: number, unit: string) => {
    const mlQuantity = convertUnits(unit, 'ml', quantity, product);
    return product.basePrice * mlQuantity;
  };

  // Add product to cart
  const addToCart = (product: any, quantity = 1, unit = 'ml') => {
    const existingItem = cart.find(item =>
      item.product.id === product.id && item.unit === unit
    );

    const price = calculatePrice(product, quantity, unit);

    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id && item.unit === unit
          ? { ...item, quantity: item.quantity + quantity, totalPrice: calculatePrice(product, item.quantity + quantity, unit) }
          : item
      ));
    } else {
      setCart([...cart, {
        product,
        quantity,
        unit,
        unitPrice: price / quantity,
        totalPrice: price,
        discount: 0
      }]);
    }
  };

  // Update cart item quantity
  const updateCartItem = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCart(cart.map((item, i) =>
      i === index
        ? {
            ...item,
            quantity,
            totalPrice: calculatePrice(item.product, quantity, item.unit)
          }
        : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice - item.discount, 0);
    const customerDiscount = selectedCustomer ? (subtotal * selectedCustomer.discountRate / 100) : 0;
    const totalDiscount = customerDiscount + customDiscount.value;
    const afterDiscount = subtotal - totalDiscount;
    const vatAmount = afterDiscount * 0.05; // 5% UAE VAT
    const total = afterDiscount + vatAmount;

    return {
      subtotal,
      customerDiscount,
      customDiscount: customDiscount.value,
      totalDiscount,
      vatAmount,
      total
    };
  };

  // Add new customer
  const addNewCustomer = () => {
    const customer = {
      id: `CUST${Date.now()}`,
      ...newCustomer,
      loyaltyPoints: 0,
      discountRate: newCustomer.type === 'VIP' ? 10 : newCustomer.type === 'Premium' ? 5 : 0,
      totalSpent: 0
    };
    customers.push(customer);
    setSelectedCustomer(customer);
    setNewCustomer({ name: '', nameArabic: '', phone: '', email: '', type: 'Regular' });
    setIsCustomerDialogOpen(false);
  };

  // Process payment
  const processPayment = () => {
    const totals = calculateTotals();

    // Create receipt data
    const receiptData = {
      id: 'RCP-' + Date.now(),
      date: new Date().toISOString(),
      items: cart.map(item => ({
        name: item.product.name,
        nameArabic: item.product.nameArabic,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      })),
      customer: selectedCustomer,
      payment: {
        method: paymentMethod,
        subtotal: totals.subtotal,
        customerDiscount: totals.customerDiscount,
        customDiscount: totals.customDiscount,
        vatAmount: totals.vatAmount,
        total: totals.total,
        cashReceived: cashReceived,
        change: paymentMethod === 'cash' ? cashReceived - totals.total : 0
      },
      store: {
        name: 'Oud Palace',
        nameArabic: 'قصر العود',
        address: 'Gold Souq, Dubai, UAE',
        addressArabic: 'سوق الذهب، دبي، الإمارات العربية المتحدة',
        phone: '+971 4 XXX XXXX',
        email: 'info@oudpalace.ae',
        vatNumber: 'VAT123456789',
        tradeLicense: 'TL123456'
      },
      cashier: 'POS User',
      terminal: 'POS-MAIN'
    };

    // Store receipt data in localStorage
    localStorage.setItem(`receipt_${receiptData.id}`, JSON.stringify(receiptData));

    // Update customer loyalty points
    if (selectedCustomer) {
      const pointsEarned = Math.floor(totals.total / 10); // 1 point per AED 10
      selectedCustomer.loyaltyPoints += pointsEarned;
      selectedCustomer.totalSpent += totals.total;
    }

    // Clear cart and reset
    setCart([]);
    setSelectedCustomer(null);
    setCustomDiscount({ type: 'percentage', value: 0 });
    setCashReceived(0);
    setIsPaymentDialogOpen(false);

    // Redirect to receipt page
    window.location.href = `/pos/receipt?id=${receiptData.id}`;
  };

  // Search products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nameArabic.includes(searchTerm) ||
    product.barcode.includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle barcode scan
  const handleBarcodeScan = () => {
    const product = products.find(p => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      alert('Product not found');
    }
  };

  const totals = calculateTotals();
  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-amber-600" />
              Point of Sale
            </h1>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-1" />
              Shift Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <Key className="h-4 w-4 mr-1" />
              Lock Register
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Products */}
        <div className="flex-1 p-6 space-y-4">
          {/* Search and Barcode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name, Arabic, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Scan className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Scan or enter barcode"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeScan()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleBarcodeScan}>
                <Scan className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Categories */}
          <div className="flex space-x-2 overflow-x-auto">
            {['All', 'Oud Oil', 'Attar', 'Oud Chips', 'Accessories'].map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-300px)] overflow-y-auto">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-md mb-3 flex items-center justify-center">
                    <Package className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">{product.nameArabic}</p>
                  <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-600">
                      AED {product.basePrice}/ml
                    </span>
                    <Badge variant={product.stock > 50 ? 'secondary' : 'destructive'} className="text-xs">
                      {product.stock} {product.stockUnit}
                    </Badge>
                  </div>
                  {product.isWeightBased && (
                    <div className="flex items-center mt-1">
                      <Scale className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="text-xs text-gray-500">Weight-based</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div className="w-96 bg-white border-l flex flex-col">
          {/* Customer Section */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Customer</Label>
              <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                      Create a new customer profile for loyalty tracking
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <Label>Name (Arabic)</Label>
                        <Input
                          value={newCustomer.nameArabic}
                          onChange={(e) => setNewCustomer({...newCustomer, nameArabic: e.target.value})}
                          placeholder="الاسم بالعربية"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                          placeholder="+971 50 xxx xxxx"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                          placeholder="email@domain.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Customer Type</Label>
                      <Select value={newCustomer.type} onValueChange={(value) => setNewCustomer({...newCustomer, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Premium">Premium (5% discount)</SelectItem>
                          <SelectItem value="VIP">VIP (10% discount)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addNewCustomer}>
                        Add Customer
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {selectedCustomer ? (
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-amber-100 text-amber-700">
                    {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{selectedCustomer.name}</p>
                  <p className="text-xs text-gray-500">{selectedCustomer.nameArabic}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={`text-xs ${
                      selectedCustomer.type === 'VIP' ? 'bg-purple-100 text-purple-800' :
                      selectedCustomer.type === 'Premium' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedCustomer.type}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      {selectedCustomer.loyaltyPoints} pts
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                >
                  ×
                </Button>
              </div>
            ) : (
              <Select onValueChange={(value) => {
                const customer = customers.find(c => c.id === value);
                setSelectedCustomer(customer);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer or walk-in" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Cart Items</h3>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCart([])}
                  className="text-red-600"
                >
                  Clear All
                </Button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Cart is empty</p>
                <p className="text-sm">Select products to add them</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-600">{item.product.nameArabic}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(index)}
                        className="text-red-600 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(index, item.quantity - (item.unit === 'piece' ? 1 : 0.1))}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          value={item.quantity}
                          onChange={(e) => updateCartItem(index, parseFloat(e.target.value) || 0)}
                          className="w-16 h-6 text-center text-xs"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(index, item.quantity + (item.unit === 'piece' ? 1 : 0.1))}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Select value={item.unit} onValueChange={(unit) => {
                        const newPrice = calculatePrice(item.product, item.quantity, unit);
                        setCart(cart.map((cartItem, i) =>
                          i === index ? { ...cartItem, unit, totalPrice: newPrice, unitPrice: newPrice / item.quantity } : cartItem
                        ));
                      }}>
                        <SelectTrigger className="w-20 h-6 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.product.units.map((unit: any) => (
                            <SelectItem key={unit.name} value={unit.name}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        AED {item.unitPrice.toFixed(2)}/{item.unit}
                      </span>
                      <span className="font-bold">
                        AED {item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary & Checkout */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Discount Button */}
              <div className="flex space-x-2">
                <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Percent className="h-4 w-4 mr-1" />
                      Discount
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply Discount</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Discount Type</Label>
                        <Select value={customDiscount.type} onValueChange={(value) => setCustomDiscount({...customDiscount, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount (AED)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Discount Value</Label>
                        <Input
                          type="number"
                          value={customDiscount.value}
                          onChange={(e) => setCustomDiscount({...customDiscount, value: parseFloat(e.target.value) || 0})}
                          placeholder="Enter discount value"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDiscountDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsDiscountDialogOpen(false)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" className="flex-1">
                  <Gift className="h-4 w-4 mr-1" />
                  Promo
                </Button>
              </div>

              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>AED {totals.subtotal.toFixed(2)}</span>
                </div>
                {selectedCustomer && totals.customerDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{selectedCustomer.type} Discount ({selectedCustomer.discountRate}%):</span>
                    <span>-AED {totals.customerDiscount.toFixed(2)}</span>
                  </div>
                )}
                {customDiscount.value > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Custom Discount:</span>
                    <span>-AED {customDiscount.value.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>VAT (5%):</span>
                  <span>AED {totals.vatAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-amber-600">AED {totals.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Button */}
              <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payment - AED {totals.total.toFixed(2)}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Process Payment</DialogTitle>
                    <DialogDescription>
                      Total Amount: AED {totals.total.toFixed(2)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="mobile">Mobile Payment</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {paymentMethod === 'cash' && (
                      <div>
                        <Label>Cash Received</Label>
                        <Input
                          type="number"
                          value={cashReceived}
                          onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                          placeholder="Enter cash amount"
                        />
                        {cashReceived > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Change: AED {(cashReceived - totals.total).toFixed(2)}
                          </p>
                        )}
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="print-receipt" defaultChecked />
                        <Label htmlFor="print-receipt" className="text-sm">Print Receipt</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-receipt" />
                        <Label htmlFor="email-receipt" className="text-sm">Email Receipt</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="sms-receipt" />
                        <Label htmlFor="sms-receipt" className="text-sm">SMS Receipt</Label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={processPayment}
                        disabled={paymentMethod === 'cash' && cashReceived < totals.total}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete Payment
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}