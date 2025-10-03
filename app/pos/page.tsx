'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KeyboardShortcuts, KeyboardShortcutsHelp } from '@/components/pos/KeyboardShortcuts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Calculator,
  Package,
  Scale,
  Gift,
  Percent,
  Clock,
  CheckCircle,
  Settings,
  Printer,
  Mail,
  MessageSquare,
  Key,
  Star,
  QrCode,
  Banknote,
  X,
  Keyboard,
  Languages,
  ArrowLeft} from 'lucide-react';

export default function UnifiedPOS() {
  const router = useRouter();

  // Language state
  const [language, setLanguage] = useState('english');
  const [keyboardShortcutsEnabled, setKeyboardShortcutsEnabled] = useState(true);

  // Data fetching states
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // POS states
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isScannerDialogOpen, setIsScannerDialogOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [customDiscount, setCustomDiscount] = useState({ type: 'none', value: 0 });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    nameArabic: '',
    phone: '',
    email: '',
    type: 'Regular'
  });
  const [printReceipt, setPrintReceipt] = useState(true);
  const [emailReceipt, setEmailReceipt] = useState(false);
  const [smsReceipt, setSmsReceipt] = useState(false);

  // getText helper for bilingual support
  const getText = (en: string, ar: string) => language === 'arabic' ? ar : en;

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await fetch('/api/products?limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch customers from API on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const response = await fetch('/api/customers?limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        setCustomers(data.customers || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  // Unit conversion helper
  const convertUnits = (fromUnit: string, toUnit: string, quantity: number, product: any) => {
    const fromRate = product.units?.find((u: any) => u.name === fromUnit)?.rate || 1;
    const toRate = product.units?.find((u: any) => u.name === toUnit)?.rate || 1;
    return (quantity * fromRate) / toRate;
  };

  // Calculate price based on unit and quantity
  const calculatePrice = (product: any, quantity: number, unit: string) => {
    if (!product.units || product.units.length === 0) {
      return product.price * quantity;
    }
    const mlQuantity = convertUnits(unit, 'ml', quantity, product);
    return (product.basePrice || product.price) * mlQuantity;
  };

  // Add product to cart
  const addToCart = (product: any, quantity = 1, unit = 'ml') => {
    const existingItem = cart.find(item =>
      item.product.id === product.id && item.unit === unit
    );

    // Use default unit if product doesn't have units defined
    const productUnit = product.units && product.units.length > 0 ? unit : 'piece';
    const price = calculatePrice(product, quantity, productUnit);

    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id && item.unit === productUnit
          ? { ...item, quantity: item.quantity + quantity, totalPrice: calculatePrice(product, item.quantity + quantity, productUnit) }
          : item
      ));
    } else {
      setCart([...cart, {
        product,
        quantity,
        unit: productUnit,
        unitPrice: price / quantity,
        totalPrice: price,
        discount: 0
      }]);
    }

    // Play beep sound on add
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvPahDIHGmi78OKVQQM=');
    audio.play().catch(() => {});
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

    let totalDiscount = 0;

    // Customer discount
    const customerDiscount = selectedCustomer && selectedCustomer.discountRate
      ? (subtotal * selectedCustomer.discountRate / 100)
      : 0;

    // Custom discount
    let customDiscountAmount = 0;
    if (customDiscount.type === 'percentage') {
      customDiscountAmount = (subtotal * customDiscount.value) / 100;
    } else if (customDiscount.type === 'fixed') {
      customDiscountAmount = customDiscount.value;
    }

    totalDiscount = customerDiscount + customDiscountAmount;
    const afterDiscount = subtotal - totalDiscount;
    const vatAmount = afterDiscount * 0.05; // 5% UAE VAT
    const total = afterDiscount + vatAmount;

    return {
      subtotal,
      customerDiscount,
      customDiscount: customDiscountAmount,
      totalDiscount,
      vatAmount,
      total
    };
  };

  // Add new customer
  const addNewCustomer = async () => {
    const customer = {
      id: `CUST${Date.now()}`,
      ...newCustomer,
      loyaltyPoints: 0,
      discountRate: newCustomer.type === 'VIP' ? 10 : newCustomer.type === 'Premium' ? 5 : 0,
      totalSpent: 0
    };

    // Add to local state
    setCustomers([...customers, customer]);
    setSelectedCustomer(customer);
    setNewCustomer({ name: '', nameArabic: '', phone: '', email: '', type: 'Regular' });
    setIsCustomerDialogOpen(false);
  };

  // Process payment
  const processPayment = async () => {
    const totals = calculateTotals();

    // Validate payment
    if (paymentMethod === 'cash' && cashReceived < totals.total) {
      alert(getText('Insufficient cash received', 'النقد المستلم غير كافي'));
      return;
    }

    try {
      // Prepare transaction data for API
      const transactionData = {
        storeId: 'default-store-id',
        cashierId: 'current-user-id',
        customerId: selectedCustomer?.id || null,
        items: cart.map(item => ({
          productId: item.product.id || 'unknown',
          sku: item.product.sku || item.product.barcode || 'N/A',
          name: item.product.name,
          arabicName: item.product.nameArabic || item.product.arabicName || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: 0,
          vatRate: 5,
          vatAmount: item.totalPrice * 0.05 / 1.05,
          totalPrice: item.totalPrice,
          category: item.product.category || 'General',
          brand: item.product.brand || 'Oud Palace'
        })),
        subtotal: totals.subtotal,
        totalVat: totals.vatAmount,
        grandTotal: totals.total,
        currency: 'AED',
        paymentMethod: paymentMethod,
        paymentDetails: {
          method: paymentMethod as any,
          amountReceived: paymentMethod === 'cash' ? cashReceived : totals.total,
          changeGiven: paymentMethod === 'cash' ? cashReceived - totals.total : 0
        },
        loyaltyPointsEarned: selectedCustomer ? Math.floor(totals.total / 10) : 0
      };

      // Save transaction to database
      const response = await fetch('/api/sales/pos/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        throw new Error('Failed to save transaction');
      }

      const savedTransaction = await response.json();

      // Create receipt data
      const receiptData = {
        id: savedTransaction.receiptNumber || 'RCP-' + Date.now(),
        transactionId: savedTransaction.id,
        date: new Date().toISOString(),
        items: cart.map(item => ({
          name: item.product.name,
          nameArabic: item.product.nameArabic || item.product.arabicName || '',
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
        terminal: 'POS-MAIN',
        deliveryOptions: {
          print: printReceipt,
          email: emailReceipt,
          sms: smsReceipt
        }
      };

      // Store receipt data in localStorage for printing
      localStorage.setItem(`receipt_${receiptData.id}`, JSON.stringify(receiptData));

      // Clear cart and reset
      setCart([]);
      setSelectedCustomer(null);
      setCustomDiscount({ type: 'none', value: 0 });
      setCashReceived(0);
      setIsPaymentDialogOpen(false);
      setPrintReceipt(true);
      setEmailReceipt(false);
      setSmsReceipt(false);

      // Redirect to receipt page
      window.location.href = `/pos/receipt?id=${receiptData.id}`;

    } catch (error) {
      console.error('Error processing payment:', error);
      alert(getText('Failed to process payment. Please try again.', 'فشلت معالجة الدفع. يرجى المحاولة مرة أخرى.'));
    }
  };

  // Search products
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nameArabic?.includes(searchTerm) ||
    product.arabicName?.includes(searchTerm) ||
    product.barcode?.includes(searchTerm) ||
    product.sku?.includes(searchTerm) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle barcode scan
  const handleBarcodeScan = () => {
    if (!barcodeInput.trim()) {
      return;
    }

    const product = products.find(p => p.barcode === barcodeInput || p.sku === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
      // Play success beep
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvPahDIHGmi78OKVQQM=');
      audio.play().catch(() => {});
    } else {
      // Play error sound
      const errorAudio = new Audio('data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU4AAAA=');
      errorAudio.play().catch(() => {});
      alert(getText('Product not found', 'المنتج غير موجود'));
    }
  };

  const totals = calculateTotals();
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Keyboard shortcuts (conditional) */}
      {keyboardShortcutsEnabled && (
        <KeyboardShortcuts
          onScan={() => setIsScannerDialogOpen(true)}
          onNewCustomer={() => setIsCustomerDialogOpen(true)}
          onPayment={() => cart.length > 0 && setIsPaymentDialogOpen(true)}
          onClear={() => setCart([])}
          onHold={() => router.push('/pos/hold')}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-amber-600" />
              {getText('Point of Sale', 'نقطة البيع')}
            </h1>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              {getText('Online', 'متصل')}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">🇬🇧 English</SelectItem>
                <SelectItem value="arabic">🇦🇪 العربية</SelectItem>
              </SelectContent>
            </Select>

            {/* Keyboard Shortcuts Toggle */}
            <Dialog open={isShortcutsHelpOpen} onOpenChange={setIsShortcutsHelpOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setKeyboardShortcutsEnabled(!keyboardShortcutsEnabled)}
                  className={keyboardShortcutsEnabled ? 'bg-green-50' : ''}
                >
                  <Keyboard className="h-4 w-4 mr-1" />
                  {getText('Shortcuts', 'الاختصارات')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{getText('Keyboard Shortcuts', 'اختصارات لوحة المفاتيح')}</DialogTitle>
                  <DialogDescription>
                    {getText('Use these shortcuts for faster navigation and actions', 'استخدم هذه الاختصارات للتنقل والإجراءات بشكل أسرع')}
                  </DialogDescription>
                </DialogHeader>
                <KeyboardShortcutsHelp />
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enable-shortcuts"
                      checked={keyboardShortcutsEnabled}
                      onChange={(e) => setKeyboardShortcutsEnabled(e.target.checked)}
                    />
                    <Label htmlFor="enable-shortcuts">
                      {getText('Enable keyboard shortcuts', 'تفعيل اختصارات لوحة المفاتيح')}
                    </Label>
                  </div>
                  <Button onClick={() => setIsShortcutsHelpOpen(false)}>
                    {getText('Close', 'إغلاق')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={() => router.push('/pos/shift-report')}>
              <Clock className="h-4 w-4 mr-1" />
              {getText('Shift Report', 'تقرير الوردية')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/pos/lock')}>
              <Key className="h-4 w-4 mr-1" />
              {getText('Lock Register', 'قفل السجل')}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Products */}
        <div className="flex-1 p-6 space-y-4">
          {/* Search and Barcode Scanner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={getText('Search products by name, Arabic, category...', 'البحث عن المنتجات بالاسم، العربية، الفئة...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                dir={language === 'arabic' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Scan className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={getText('Scan or enter barcode', 'مسح أو إدخال الباركود')}
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeScan()}
                  className="pl-10"
                  dir={language === 'arabic' ? 'rtl' : 'ltr'}
                />
              </div>
              <Button onClick={handleBarcodeScan} className="bg-amber-600 hover:bg-amber-700">
                <Scan className="h-4 w-4" />
              </Button>

              {/* Enhanced Barcode Scanner Dialog */}
              <Dialog open={isScannerDialogOpen} onOpenChange={setIsScannerDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    {getText('Scanner', 'ماسح')}
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
                              const product = products.find(p => p.barcode === e.currentTarget.value || p.sku === e.currentTarget.value);
                              if (product) {
                                addToCart(product);
                                setIsScannerDialogOpen(false);
                                e.currentTarget.value = '';
                              } else {
                                alert(getText('Product not found', 'المنتج غير موجود'));
                              }
                            }
                          }}
                          dir={language === 'arabic' ? 'rtl' : 'ltr'}
                        />
                        <Button onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input?.value) {
                            const product = products.find(p => p.barcode === input.value || p.sku === input.value);
                            if (product) {
                              addToCart(product);
                              setIsScannerDialogOpen(false);
                              input.value = '';
                            } else {
                              alert(getText('Product not found', 'المنتج غير موجود'));
                            }
                          }
                        }}>
                          {getText('Add', 'إضافة')}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getText('Tip: Use a USB barcode scanner for quick input', 'نصيحة: استخدم ماسح الباركود USB للإدخال السريع')}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Product Categories */}
          <div className="flex space-x-2 overflow-x-auto">
            {categories.slice(0, 5).map((category) => (
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
            {loadingProducts ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                {getText('Loading products...', 'جاري تحميل المنتجات...')}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                {getText('No products found', 'لم يتم العثور على منتجات')}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-md mb-3 flex items-center justify-center">
                      <Package className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">
                      {language === 'arabic' ? (product.nameArabic || product.arabicName || product.name) : product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-600">
                        AED {(product.basePrice || product.price || 0).toFixed(2)}
                      </span>
                      <Badge variant={(product.stock || 0) > 50 ? 'secondary' : 'destructive'} className="text-xs">
                        {product.stock || 0}
                      </Badge>
                    </div>
                    {product.isWeightBased && (
                      <div className="flex items-center mt-1">
                        <Scale className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="text-xs text-gray-500">{getText('Weight-based', 'بالوزن')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div className="w-96 bg-white border-l flex flex-col">
          {/* Customer Section */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">{getText('Customer', 'العميل')}</Label>
              <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    {getText('Add New', 'إضافة جديد')}
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
                          dir="rtl"
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
                      <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
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

            {selectedCustomer ? (
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-amber-100 text-amber-700">
                    {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{selectedCustomer.name}</p>
                  <p className="text-xs text-gray-500">{selectedCustomer.nameArabic || selectedCustomer.arabicName || ''}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={`text-xs ${
                      selectedCustomer.type === 'VIP' ? 'bg-purple-100 text-purple-800' :
                      selectedCustomer.type === 'Premium' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedCustomer.type}
                    </Badge>
                    {selectedCustomer.loyaltyPoints > 0 && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {selectedCustomer.loyaltyPoints} pts
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Select onValueChange={(value) => {
                if (value === 'walk-in') {
                  setSelectedCustomer(null);
                } else {
                  const customer = customers.find(c => c.id === value);
                  setSelectedCustomer(customer);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder={getText('Select customer or walk-in', 'اختر عميل أو عميل عادي')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walk-in">{getText('Walk-in Customer', 'عميل عادي')}</SelectItem>
                  {loadingCustomers ? (
                    <SelectItem value="loading" disabled>
                      {getText('Loading...', 'جاري التحميل...')}
                    </SelectItem>
                  ) : (
                    customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{getText('Cart Items', 'عناصر السلة')}</h3>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCart([])}
                  className="text-red-600"
                >
                  {getText('Clear All', 'مسح الكل')}
                </Button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{getText('Cart is empty', 'السلة فارغة')}</p>
                <p className="text-sm">{getText('Select products to add them', 'اختر المنتجات لإضافتها')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {language === 'arabic'
                            ? (item.product.nameArabic || item.product.arabicName || item.product.name)
                            : item.product.name
                          }
                        </h4>
                        <p className="text-xs text-gray-600">
                          {language === 'english'
                            ? (item.product.nameArabic || item.product.arabicName || '')
                            : item.product.name
                          }
                        </p>
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
                      {item.product.units && item.product.units.length > 0 && (
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
                      )}
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
              {/* Inline Discount Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{getText('Discount', 'الخصم')}</Label>
                <div className="flex space-x-2">
                  <Select
                    value={customDiscount.type}
                    onValueChange={(value) => setCustomDiscount({...customDiscount, type: value, value: 0})}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{getText('No Discount', 'بدون خصم')}</SelectItem>
                      <SelectItem value="percentage">{getText('Percentage (%)', 'نسبة مئوية (%)')}</SelectItem>
                      <SelectItem value="fixed">{getText('Fixed (AED)', 'مبلغ ثابت (درهم)')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {customDiscount.type !== 'none' && (
                    <Input
                      type="number"
                      value={customDiscount.value}
                      onChange={(e) => setCustomDiscount({...customDiscount, value: parseFloat(e.target.value) || 0})}
                      placeholder={customDiscount.type === 'percentage' ? '%' : 'AED'}
                      className="w-24"
                    />
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{getText('Subtotal', 'المجموع الفرعي')}:</span>
                  <span>AED {totals.subtotal.toFixed(2)}</span>
                </div>
                {selectedCustomer && totals.customerDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{selectedCustomer.type} {getText('Discount', 'خصم')} ({selectedCustomer.discountRate}%):</span>
                    <span>-AED {totals.customerDiscount.toFixed(2)}</span>
                  </div>
                )}
                {customDiscount.value > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{getText('Custom Discount', 'خصم إضافي')}:</span>
                    <span>-AED {totals.customDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{getText('VAT (5%)', 'ضريبة القيمة المضافة (5%)')}:</span>
                  <span>AED {totals.vatAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>{getText('Total', 'الإجمالي')}:</span>
                  <span className="text-amber-600">AED {totals.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Button */}
              <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {getText('Process Payment', 'معالجة الدفع')} - AED {totals.total.toFixed(2)}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{getText('Process Payment', 'معالجة الدفع')}</DialogTitle>
                    <DialogDescription>
                      {getText('Total Amount', 'المبلغ الإجمالي')}: AED {totals.total.toFixed(2)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>{getText('Payment Method', 'طريقة الدفع')}</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('cash')}
                          className="flex flex-col items-center p-4"
                        >
                          <Banknote className="h-6 w-6 mb-1" />
                          {getText('Cash', 'نقداً')}
                        </Button>
                        <Button
                          variant={paymentMethod === 'card' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('card')}
                          className="flex flex-col items-center p-4"
                        >
                          <CreditCard className="h-6 w-6 mb-1" />
                          {getText('Card', 'بطاقة')}
                        </Button>
                        <Button
                          variant={paymentMethod === 'mobile' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('mobile')}
                          className="flex flex-col items-center p-4"
                        >
                          <Smartphone className="h-6 w-6 mb-1" />
                          {getText('Mobile', 'محمول')}
                        </Button>
                        <Button
                          variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('bank')}
                          className="flex flex-col items-center p-4"
                        >
                          <DollarSign className="h-6 w-6 mb-1" />
                          {getText('Bank', 'تحويل بنكي')}
                        </Button>
                      </div>
                    </div>

                    {paymentMethod === 'cash' && (
                      <div>
                        <Label>{getText('Cash Received', 'النقد المستلم')}</Label>
                        <div className="space-y-2">
                          <Input
                            type="number"
                            value={cashReceived}
                            onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                            placeholder={getText('Enter cash amount', 'أدخل المبلغ النقدي')}
                          />
                          {cashReceived > 0 && (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                {getText('Change', 'الباقي')}: <span className={cashReceived >= totals.total ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                  AED {(cashReceived - totals.total).toFixed(2)}
                                </span>
                              </p>
                              {/* Quick cash amounts */}
                              <div className="grid grid-cols-4 gap-2">
                                {[50, 100, 200, 500].map((amount) => (
                                  <Button
                                    key={amount}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCashReceived(amount)}
                                  >
                                    {amount}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Receipt Delivery Options */}
                    <div className="space-y-2">
                      <Label>{getText('Receipt Delivery', 'تسليم الإيصال')}</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="print-receipt"
                            checked={printReceipt}
                            onChange={(e) => setPrintReceipt(e.target.checked)}
                          />
                          <Label htmlFor="print-receipt" className="text-sm flex items-center">
                            <Printer className="h-4 w-4 mr-1" />
                            {getText('Print Receipt', 'طباعة الإيصال')}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="email-receipt"
                            checked={emailReceipt}
                            onChange={(e) => setEmailReceipt(e.target.checked)}
                          />
                          <Label htmlFor="email-receipt" className="text-sm flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {getText('Email Receipt', 'إرسال بالبريد الإلكتروني')}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="sms-receipt"
                            checked={smsReceipt}
                            onChange={(e) => setSmsReceipt(e.target.checked)}
                          />
                          <Label htmlFor="sms-receipt" className="text-sm flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {getText('SMS Receipt', 'إرسال برسالة نصية')}
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                        {getText('Cancel', 'إلغاء')}
                      </Button>
                      <Button
                        onClick={processPayment}
                        disabled={paymentMethod === 'cash' && cashReceived < totals.total}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {getText('Complete Payment', 'إتمام الدفع')}
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
