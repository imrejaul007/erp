'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyboardShortcuts } from '@/components/pos/KeyboardShortcuts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  QrCode,
  CreditCard,
  Banknote,
  Smartphone,
  Gift,
  Percent,
  Calculator,
  Printer,
  Mail,
  MessageSquare,
  User,
  UserPlus,
  Clock,
  Receipt,
  Settings,
  Languages,
  Heart,
  Star,
  Delete,
  Edit,
  Save,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  Hash,
  DollarSign,
  Package,
  Scale
} from 'lucide-react';

const POSTerminal = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [discountType, setDiscountType] = useState('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [language, setLanguage] = useState('en');
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    nameArabic: '',
    phone: '',
    email: '',
    type: 'Regular'
  });

  // Enhanced product data with multi-unit support
  const products = [
    {
      id: 'OUD001',
      name: 'Royal Cambodian Oud',
      nameArabic: 'عود كمبودي ملكي',
      basePrice: 2500, // per 1ml
      units: [
        { name: 'ml', rate: 1, min: 0.1 },
        { name: 'tola', rate: 11.66, min: 0.1 }, // 1 tola = 11.66ml
        { name: 'gram', rate: 1, min: 0.1 },
        { name: 'oz', rate: 29.57, min: 0.1 }
      ],
      stock: 45,
      stockUnit: 'ml',
      category: 'Premium Oud',
      barcode: '1234567890123',
      image: '/api/placeholder/100/100',
      isWeightBased: true
    },
    {
      id: 'ATT001',
      name: 'Taif Rose Attar',
      nameArabic: 'عطر الورد الطائفي',
      basePrice: 850,
      units: [
        { name: 'ml', rate: 1, min: 0.5 },
        { name: 'tola', rate: 11.66, min: 0.1 }
      ],
      stock: 32,
      stockUnit: 'ml',
      category: 'Attar',
      barcode: '1234567890124',
      image: '/api/placeholder/100/100',
      isWeightBased: true
    },
    {
      id: 'PER001',
      name: 'Arabian Nights Perfume',
      nameArabic: 'عطر ليالي العرب',
      basePrice: 450,
      units: [
        { name: 'ml', rate: 1, min: 0.5 },
        { name: 'tola', rate: 11.66, min: 0.1 },
        { name: 'oz', rate: 29.57, min: 0.1 }
      ],
      stock: 67,
      stockUnit: 'ml',
      category: 'Perfume',
      barcode: '1234567890125',
      image: '/api/placeholder/100/100',
      isWeightBased: true
    },
    {
      id: 'GIF001',
      name: 'Luxury Gift Set',
      nameArabic: 'طقم هدايا فاخر',
      basePrice: 1200,
      units: [
        { name: 'piece', rate: 1, min: 1 }
      ],
      stock: 15,
      stockUnit: 'piece',
      category: 'Gift Set',
      barcode: '1234567890126',
      image: '/api/placeholder/100/100',
      isWeightBased: false
    }
  ];

  const customers = [
    {
      id: 'CUST001',
      name: 'Ahmed Al-Rashid',
      phone: '+971501234567',
      email: 'ahmed@example.com',
      type: 'VIP',
      loyaltyPoints: 2500,
      totalSpent: 15600
    },
    {
      id: 'CUST002',
      name: 'Fatima Al-Zahra',
      phone: '+971502345678',
      email: 'fatima@example.com',
      type: 'Premium',
      loyaltyPoints: 1200,
      totalSpent: 8900
    }
  ];

  // Unit conversion helper
  const convertUnits = (fromUnit, toUnit, quantity, product) => {
    const fromRate = product.units.find(u => u.name === fromUnit)?.rate || 1;
    const toRate = product.units.find(u => u.name === toUnit)?.rate || 1;
    return (quantity * fromRate) / toRate;
  };

  // Calculate price based on unit and quantity
  const calculatePrice = (product, quantity, unit) => {
    const mlQuantity = convertUnits(unit, 'ml', quantity, product);
    return product.basePrice * mlQuantity;
  };

  const addToCart = (product, quantity = 1, unit = 'ml') => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item =>
        item.id === product.id && item.unit === unit
      );

      const price = calculatePrice(product, quantity, unit);

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.unit === unit
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: calculatePrice(product, item.quantity + quantity, unit)
              }
            : item
        );
      } else {
        return [...prevCart, {
          ...product,
          quantity,
          unit,
          unitPrice: price / quantity,
          totalPrice: price
        }];
      }
    });
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
    } else {
      setCart(prevCart =>
        prevCart.map((item, i) =>
          i === index
            ? {
                ...item,
                quantity: newQuantity,
                totalPrice: calculatePrice(item, newQuantity, item.unit)
              }
            : item
        )
      );
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percentage') {
      return (subtotal * discountValue) / 100;
    } else if (discountType === 'fixed') {
      return discountValue;
    }
    return 0;
  };

  const calculateVAT = () => {
    const subtotalAfterDiscount = calculateSubtotal() - calculateDiscount();
    return subtotalAfterDiscount * 0.05; // 5% UAE VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateVAT();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.nameArabic.includes(searchQuery) ||
    product.barcode.includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearCart = () => {
    setCart([]);
    setCurrentCustomer(null);
    setDiscountType('none');
    setDiscountValue(0);
  };

  const handleScanSuccess = (decodedText: string) => {
    // Find product by barcode
    const product = products.find(p => p.barcode === decodedText);
    if (product) {
      addToCart(product);
      setIsScannerOpen(false);
      // Show success feedback
      alert(`Product scanned: ${product.name}`);
    } else {
      alert(`Barcode not found: ${decodedText}`);
    }
  };

  const getText = (en, ar) => language === 'ar' ? ar : en;

  // Add new customer
  const addNewCustomer = () => {
    const customer = {
      id: `CUST${Date.now()}`,
      ...newCustomer,
      loyaltyPoints: 0,
      totalSpent: 0
    };
    customers.push(customer);
    setCurrentCustomer(customer);
    setNewCustomer({ name: '', nameArabic: '', phone: '', email: '', type: 'Regular' });
    setIsNewCustomerModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <KeyboardShortcuts
        onScan={() => setIsScannerOpen(true)}
        onNewCustomer={() => setIsNewCustomerModalOpen(true)}
        onPayment={() => cart.length > 0 && setIsPaymentModalOpen(true)}
        onClear={clearCart}
        onHold={() => router.push('/pos/hold')}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getText('POS Terminal', 'نقطة البيع')}
            </h1>
            <p className="text-gray-600">
              {getText('Multi-language Point of Sale System', 'نظام نقطة البيع متعدد اللغات')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="ar">🇦🇪 العربية</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => router.push('/pos')}>
              <Settings className="h-4 w-4 mr-2" />
              {getText('Settings', 'الإعدادات')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={getText('Search by name, barcode, or category...', 'البحث بالاسم أو الباركود أو الفئة...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <QrCode className="h-4 w-4 mr-2" />
                        {getText('Scan', 'مسح')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{getText('Scan Product Barcode/QR Code', 'مسح باركود/رمز المنتج')}</DialogTitle>
                        <DialogDescription>
                          {getText('Point camera at product barcode or QR code', 'وجه الكاميرا إلى الباركود أو رمز QR للمنتج')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-900">
                            {getText(
                              'You can also use a handheld barcode scanner or enter the code manually below',
                              'يمكنك أيضًا استخدام ماسح الباركود المحمول أو إدخال الرمز يدويًا أدناه'
                            )}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>{getText('Manual Barcode Entry', 'إدخال الباركود يدويًا')}</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder={getText('Enter barcode number...', 'أدخل رقم الباركود...')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                  handleScanSuccess(e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <Button onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              if (input?.value) {
                                handleScanSuccess(input.value);
                                input.value = '';
                              }
                            }}>
                              {getText('Add', 'إضافة')}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {getText('Tip: Use a USB barcode scanner for quick input', 'نصيحة: استخدم ماسح الباركود USB للإدخال السريع')}
                          </p>
                        </div>

                        <Separator />

                        <div className="text-center py-4">
                          <Button variant="outline" onClick={() => router.push('/inventory/barcode')}>
                            <QrCode className="h-4 w-4 mr-2" />
                            {getText('Open Full Scanner', 'فتح الماسح الكامل')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm leading-tight">
                          {language === 'ar' ? product.nameArabic : product.name}
                        </h4>
                        <p className="text-xs text-gray-500">{product.category}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-green-600">
                            AED {product.basePrice}
                          </span>
                          <span className="text-xs text-gray-500">
                            /ml
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {getText('Stock', 'المخزون')}: {product.stock} {product.stockUnit}
                        </div>
                        {product.isWeightBased && (
                          <div className="flex items-center mt-1">
                            <Scale className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="text-xs text-gray-500">Weight-based</span>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => addToCart(product)}
                        className="w-full"
                        size="sm"
                        disabled={product.stock === 0}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {getText('Add', 'إضافة')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="space-y-6">
            {/* Customer Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {getText('Customer', 'العميل')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentCustomer ? (
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{currentCustomer.name}</div>
                        <div className="text-sm text-gray-500">{currentCustomer.phone}</div>
                        <Badge className="text-xs mt-1" variant={currentCustomer.type === 'VIP' ? 'default' : 'secondary'}>
                          {currentCustomer.type}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentCustomer(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setCurrentCustomer({ id: 'walk-in', name: 'Walk-in Customer', nameArabic: 'عميل عادي', phone: '', type: 'Walk-in', loyaltyPoints: 0 })}
                      >
                        <User className="h-4 w-4 mr-1" />
                        {getText('Walk-in Customer', 'عميل عادي')}
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Search className="h-4 w-4 mr-1" />
                              {getText('Find', 'بحث')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{getText('Select Customer', 'اختيار العميل')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              {customers.map((customer) => (
                                <div
                                  key={customer.id}
                                  className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                  onClick={() => {
                                    setCurrentCustomer(customer);
                                    setLoyaltyPoints(customer.loyaltyPoints);
                                    setIsCustomerModalOpen(false);
                                  }}
                                >
                                  <div>
                                    <div className="font-medium">{customer.name}</div>
                                    <div className="text-sm text-gray-500">{customer.phone}</div>
                                    <div className="text-xs text-blue-600">
                                      {getText('Points', 'النقاط')}: {customer.loyaltyPoints}
                                    </div>
                                  </div>
                                  <Badge variant={customer.type === 'VIP' ? 'default' : 'secondary'}>
                                    {customer.type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={isNewCustomerModalOpen} onOpenChange={setIsNewCustomerModalOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <UserPlus className="h-4 w-4 mr-1" />
                              {getText('New', 'جديد')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{getText('Add New Customer', 'إضافة عميل جديد')}</DialogTitle>
                              <DialogDescription>
                                {getText('Create a new customer profile for loyalty tracking', 'إنشاء ملف عميل جديد لتتبع الولاء')}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>{getText('Name', 'الاسم')}</Label>
                                  <Input
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                    placeholder={getText('Full name', 'الاسم الكامل')}
                                  />
                                </div>
                                <div>
                                  <Label>{getText('Name (Arabic)', 'الاسم بالعربية')}</Label>
                                  <Input
                                    value={newCustomer.nameArabic}
                                    onChange={(e) => setNewCustomer({...newCustomer, nameArabic: e.target.value})}
                                    placeholder="الاسم بالعربية"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>{getText('Phone', 'الهاتف')}</Label>
                                  <Input
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                                    placeholder="+971 50 xxx xxxx"
                                  />
                                </div>
                                <div>
                                  <Label>{getText('Email', 'البريد الإلكتروني')}</Label>
                                  <Input
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                                    placeholder="email@domain.com"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>{getText('Customer Type', 'نوع العميل')}</Label>
                                <Select value={newCustomer.type} onValueChange={(value) => setNewCustomer({...newCustomer, type: value})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Regular">{getText('Regular', 'عادي')}</SelectItem>
                                    <SelectItem value="Premium">{getText('Premium (5% discount)', 'مميز (خصم 5%)')}</SelectItem>
                                    <SelectItem value="VIP">{getText('VIP (10% discount)', 'VIP (خصم 10%)')}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsNewCustomerModalOpen(false)}>
                                  {getText('Cancel', 'إلغاء')}
                                </Button>
                                <Button onClick={addNewCustomer}>
                                  {getText('Add Customer', 'إضافة عميل')}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {getText('Cart', 'السلة')}
                  </div>
                  <Badge variant="outline">{cart.length} {getText('items', 'عنصر')}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {getText('Cart is empty', 'السلة فارغة')}
                    </div>
                  ) : (
                    cart.map((item, index) => (
                      <div key={`${item.id}-${item.unit}-${index}`} className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {language === 'ar' ? item.nameArabic : item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              AED {item.unitPrice.toFixed(2)}/{item.unit}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(index)}
                            className="text-red-600 p-1"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(index, item.quantity - (item.unit === 'piece' ? 1 : 0.1))}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              value={item.quantity}
                              onChange={(e) => updateQuantity(index, parseFloat(e.target.value) || 0)}
                              className="w-16 h-6 text-center text-xs"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(index, item.quantity + (item.unit === 'piece' ? 1 : 0.1))}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Select value={item.unit} onValueChange={(unit) => {
                            const newPrice = calculatePrice(item, item.quantity, unit);
                            setCart(cart.map((cartItem, i) =>
                              i === index ? { ...cartItem, unit, totalPrice: newPrice, unitPrice: newPrice / item.quantity } : cartItem
                            ));
                          }}>
                            <SelectTrigger className="w-20 h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {item.units.map((unit) => (
                                <SelectItem key={unit.name} value={unit.name}>
                                  {unit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            {item.quantity} × AED {item.unitPrice.toFixed(2)}
                          </span>
                          <span className="font-bold">
                            AED {item.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Discounts & Loyalty */}
            {cart.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    {getText('Discounts & Loyalty', 'الخصومات والولاء')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={discountType} onValueChange={setDiscountType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{getText('No Discount', 'بدون خصم')}</SelectItem>
                        <SelectItem value="percentage">{getText('Percentage', 'نسبة مئوية')}</SelectItem>
                        <SelectItem value="fixed">{getText('Fixed Amount', 'مبلغ ثابت')}</SelectItem>
                        <SelectItem value="loyalty">{getText('Loyalty Points', 'نقاط الولاء')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {discountType !== 'none' && discountType !== 'loyalty' && (
                      <Input
                        type="number"
                        placeholder={discountType === 'percentage' ? '%' : 'AED'}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                      />
                    )}
                  </div>

                  {currentCustomer && (
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{getText('Available Points', 'النقاط المتاحة')}</span>
                      </div>
                      <span className="font-medium text-blue-600">{loyaltyPoints}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Total Summary */}
            {cart.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    {getText('Order Summary', 'ملخص الطلب')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{getText('Subtotal', 'المجموع الفرعي')}</span>
                      <span>AED {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>{getText('Discount', 'الخصم')}</span>
                        <span>-AED {calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{getText('VAT (5%)', 'ضريبة القيمة المضافة (5%)')}</span>
                      <span>AED {calculateVAT().toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>{getText('Total', 'الإجمالي')}</span>
                      <span>AED {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-3">
                    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          <CreditCard className="h-5 w-5 mr-2" />
                          {getText('Process Payment', 'معالجة الدفع')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{getText('Payment Method', 'طريقة الدفع')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant={selectedPaymentMethod === 'cash' ? 'default' : 'outline'}
                              onClick={() => setSelectedPaymentMethod('cash')}
                              className="flex flex-col items-center p-6"
                            >
                              <Banknote className="h-8 w-8 mb-2" />
                              {getText('Cash', 'نقداً')}
                            </Button>
                            <Button
                              variant={selectedPaymentMethod === 'card' ? 'default' : 'outline'}
                              onClick={() => setSelectedPaymentMethod('card')}
                              className="flex flex-col items-center p-6"
                            >
                              <CreditCard className="h-8 w-8 mb-2" />
                              {getText('Card', 'بطاقة')}
                            </Button>
                            <Button
                              variant={selectedPaymentMethod === 'digital' ? 'default' : 'outline'}
                              onClick={() => setSelectedPaymentMethod('digital')}
                              className="flex flex-col items-center p-6"
                            >
                              <Smartphone className="h-8 w-8 mb-2" />
                              {getText('Digital', 'رقمي')}
                            </Button>
                            <Button
                              variant={selectedPaymentMethod === 'split' ? 'default' : 'outline'}
                              onClick={() => setSelectedPaymentMethod('split')}
                              className="flex flex-col items-center p-6"
                            >
                              <DollarSign className="h-8 w-8 mb-2" />
                              {getText('Split', 'مقسم')}
                            </Button>
                          </div>
                          <div className="text-center text-2xl font-bold">
                            AED {calculateTotal().toFixed(2)}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                            {getText('Cancel', 'إلغاء')}
                          </Button>
                          <Button onClick={() => {
                            // Process payment logic here
                            const receiptData = {
                              id: 'RCP-' + Date.now(),
                              date: new Date().toISOString(),
                              items: cart.map(item => ({
                                name: item.name,
                                nameArabic: item.nameArabic,
                                quantity: item.quantity,
                                unit: item.unit,
                                unitPrice: item.unitPrice,
                                totalPrice: item.totalPrice
                              })),
                              customer: currentCustomer,
                              payment: {
                                method: selectedPaymentMethod,
                                subtotal: calculateSubtotal(),
                                customerDiscount: currentCustomer?.type === 'VIP' ? calculateSubtotal() * 0.1 :
                                                 currentCustomer?.type === 'Premium' ? calculateSubtotal() * 0.05 : 0,
                                customDiscount: calculateDiscount(),
                                vatAmount: calculateVAT(),
                                total: calculateTotal(),
                                cashReceived: selectedPaymentMethod === 'cash' ? calculateTotal() + 100 : 0,
                                change: selectedPaymentMethod === 'cash' ? 100 : 0
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
                              cashier: 'Terminal User',
                              terminal: 'POS-TERMINAL'
                            };

                            // Store receipt data in localStorage
                            localStorage.setItem(`receipt_${receiptData.id}`, JSON.stringify(receiptData));

                            // Update customer loyalty points if applicable
                            if (currentCustomer && currentCustomer.id !== 'walk-in') {
                              const pointsEarned = Math.floor(calculateTotal() / 10);
                              currentCustomer.loyaltyPoints += pointsEarned;
                            }

                            // Redirect to receipt page
                            window.location.href = `/pos/receipt?id=${receiptData.id}`;

                            setIsPaymentModalOpen(false);
                            clearCart();
                          }}>
                            {getText('Complete Payment', 'إتمام الدفع')}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push('/pos/hold')}>
                        <Clock className="h-4 w-4 mr-1" />
                        {getText('Hold', 'تعليق')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => router.push('/pos/receipt')}>
                        <Printer className="h-4 w-4 mr-1" />
                        {getText('Print', 'طباعة')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearCart}>
                        <X className="h-4 w-4 mr-1" />
                        {getText('Clear', 'مسح')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSTerminal;