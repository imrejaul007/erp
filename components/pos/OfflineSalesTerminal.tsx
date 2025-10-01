'use client'

import React, { useState, useEffect, useReducer, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  CreditCard,
  Banknote,
  Wifi,
  WifiOff,
  RefreshCw,
  Receipt,
  Search,
  ScanLine,
  Plus,
  Minus,
  Trash2,
  Calculator,
  User,
  Phone,
  Mail,
  MapPin,
  Percent,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Printer,
  Send,
  Save,
  Database,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Product {
  id: string
  name: string
  nameAr: string
  sku: string
  price: number
  category: string
  stock: number
  unit: string
  taxRate: number
  barcode?: string
}

interface CartItem extends Product {
  quantity: number
  discount: number
  subtotal: number
}

interface Customer {
  id: string
  name: string
  nameAr: string
  phone: string
  email?: string
  address?: string
  loyaltyPoints: number
  discountPercentage: number
}

interface OfflineTransaction {
  id: string
  timestamp: string
  customerId?: string
  items: CartItem[]
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  paymentMethod: 'cash' | 'card' | 'transfer' | 'mixed'
  paymentDetails: any
  status: 'pending' | 'completed' | 'synced'
  notes?: string
}

type PaymentMethod = 'cash' | 'card' | 'transfer' | 'mixed'

interface SaleState {
  cart: CartItem[]
  customer: Customer | null
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  paymentMethod: PaymentMethod | null
  amountReceived: number
  change: number
}

type SaleAction =
  | { type: 'ADD_TO_CART'; product: Product; quantity: number }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'SET_CUSTOMER'; customer: Customer | null }
  | { type: 'SET_DISCOUNT'; productId: string; discount: number }
  | { type: 'SET_PAYMENT_METHOD'; method: PaymentMethod }
  | { type: 'SET_AMOUNT_RECEIVED'; amount: number }
  | { type: 'CLEAR_CART' }
  | { type: 'CALCULATE_TOTALS' }

const saleReducer = (state: SaleState, action: SaleAction): SaleState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.product.id)

      let newCart: CartItem[]
      if (existingItem) {
        newCart = state.cart.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + action.quantity }
            : item
        )
      } else {
        newCart = [...state.cart, {
          ...action.product,
          quantity: action.quantity,
          discount: 0,
          subtotal: action.product.price * action.quantity
        }]
      }

      return { ...state, cart: newCart }
    }

    case 'UPDATE_QUANTITY': {
      const newCart = state.cart.map(item =>
        item.id === action.productId
          ? { ...item, quantity: Math.max(0, action.quantity) }
          : item
      ).filter(item => item.quantity > 0)

      return { ...state, cart: newCart }
    }

    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.productId)
      return { ...state, cart: newCart }
    }

    case 'SET_CUSTOMER': {
      return { ...state, customer: action.customer }
    }

    case 'SET_DISCOUNT': {
      const newCart = state.cart.map(item =>
        item.id === action.productId
          ? { ...item, discount: action.discount }
          : item
      )
      return { ...state, cart: newCart }
    }

    case 'SET_PAYMENT_METHOD': {
      return { ...state, paymentMethod: action.method }
    }

    case 'SET_AMOUNT_RECEIVED': {
      const change = Math.max(0, action.amount - state.total)
      return { ...state, amountReceived: action.amount, change }
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        cart: [],
        customer: null,
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 0,
        paymentMethod: null,
        amountReceived: 0,
        change: 0
      }
    }

    case 'CALCULATE_TOTALS': {
      const subtotal = state.cart.reduce((sum, item) => {
        const itemSubtotal = (item.price * item.quantity) - (item.discount * item.quantity)
        return sum + itemSubtotal
      }, 0)

      const customerDiscount = state.customer ? (subtotal * state.customer.discountPercentage / 100) : 0
      const totalDiscount = state.cart.reduce((sum, item) => sum + (item.discount * item.quantity), 0) + customerDiscount

      const taxableAmount = subtotal - totalDiscount
      const taxAmount = state.cart.reduce((sum, item) => {
        const itemTaxableAmount = (item.price * item.quantity) - (item.discount * item.quantity)
        return sum + (itemTaxableAmount * item.taxRate / 100)
      }, 0)

      const total = taxableAmount + taxAmount
      const change = state.amountReceived > 0 ? Math.max(0, state.amountReceived - total) : 0

      return {
        ...state,
        subtotal,
        taxAmount,
        discountAmount: totalDiscount,
        total,
        change
      }
    }

    default:
      return state
  }
}

const OfflineSalesTerminal: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [offlineTransactions, setOfflineTransactions] = useState<OfflineTransaction[]>([])
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)

  const initialState: SaleState = {
    cart: [],
    customer: null,
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 0,
    paymentMethod: null,
    amountReceived: 0,
    change: 0
  }

  const [saleState, dispatch] = useReducer(saleReducer, initialState)

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Royal Cambodian Oud Oil',
        nameAr: 'زيت العود الكمبودي الملكي',
        sku: 'RCO-001',
        price: 2500,
        category: 'oud_oil',
        stock: 150,
        unit: 'ml',
        taxRate: 5,
        barcode: '1234567890123'
      },
      {
        id: '2',
        name: 'Premium Hindi Oud Chips',
        nameAr: 'رقائق العود الهندي الممتاز',
        sku: 'PHC-002',
        price: 1800,
        category: 'oud_chips',
        stock: 25,
        unit: 'tola',
        taxRate: 5
      },
      {
        id: '3',
        name: 'Rose Attar',
        nameAr: 'عطر الورد',
        sku: 'RA-003',
        price: 450,
        category: 'attar',
        stock: 75,
        unit: 'ml',
        taxRate: 5
      }
    ]

    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'Ahmed Al Maktoum',
        nameAr: 'أحمد آل مكتوم',
        phone: '+971501234567',
        email: 'ahmed@example.com',
        address: 'Dubai, UAE',
        loyaltyPoints: 1250,
        discountPercentage: 10
      },
      {
        id: '2',
        name: 'Fatima Al Zahra',
        nameAr: 'فاطمة الزهراء',
        phone: '+971509876543',
        loyaltyPoints: 850,
        discountPercentage: 5
      }
    ]

    setProducts(mockProducts)
    setCustomers(mockCustomers)

    // Load offline transactions from localStorage
    const savedTransactions = localStorage.getItem('offlineTransactions')
    if (savedTransactions) {
      setOfflineTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  // Network status monitoring
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // Auto-calculate totals when cart changes
  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' })
  }, [saleState.cart, saleState.customer, saleState.amountReceived])

  // Save offline transactions to localStorage
  useEffect(() => {
    localStorage.setItem('offlineTransactions', JSON.stringify(offlineTransactions))
  }, [offlineTransactions])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nameAr.includes(searchTerm) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  )

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (product.stock >= quantity) {
      dispatch({ type: 'ADD_TO_CART', product, quantity })
    }
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId })
  }, [])

  const setDiscount = useCallback((productId: string, discount: number) => {
    dispatch({ type: 'SET_DISCOUNT', productId, discount })
  }, [])

  const selectCustomer = useCallback((customer: Customer) => {
    dispatch({ type: 'SET_CUSTOMER', customer })
    setShowCustomerDialog(false)
  }, [])

  const completeSale = async () => {
    if (saleState.cart.length === 0 || !saleState.paymentMethod) return

    const transaction: OfflineTransaction = {
      id: `TXN-${Date.now()}`,
      timestamp: new Date().toISOString(),
      customerId: saleState.customer?.id,
      items: [...saleState.cart],
      subtotal: saleState.subtotal,
      taxAmount: saleState.taxAmount,
      discountAmount: saleState.discountAmount,
      total: saleState.total,
      paymentMethod: saleState.paymentMethod,
      paymentDetails: {
        amountReceived: saleState.amountReceived,
        change: saleState.change
      },
      status: isOnline ? 'completed' : 'pending'
    }

    // Add to offline transactions
    setOfflineTransactions(prev => [...prev, transaction])

    // Update inventory locally
    const updatedProducts = products.map(product => {
      const cartItem = saleState.cart.find(item => item.id === product.id)
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity }
      }
      return product
    })
    setProducts(updatedProducts)

    // Clear cart
    dispatch({ type: 'CLEAR_CART' })
    setShowPaymentDialog(false)

    // If online, attempt to sync immediately
    if (isOnline) {
      await syncTransaction(transaction)
    }
  }

  const syncTransaction = async (transaction: OfflineTransaction) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update transaction status
      setOfflineTransactions(prev =>
        prev.map(t => t.id === transaction.id ? { ...t, status: 'synced' } : t)
      )

      return true
    } catch (error) {
      console.error('Sync failed:', error)
      return false
    }
  }

  const syncAllTransactions = async () => {
    if (!isOnline) return

    setSyncStatus('syncing')
    const pendingTransactions = offlineTransactions.filter(t => t.status === 'pending')

    try {
      for (const transaction of pendingTransactions) {
        await syncTransaction(transaction)
      }
      setSyncStatus('success')
      setTimeout(() => setSyncStatus('idle'), 3000)
    } catch (error) {
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 5000)
    }
  }

  const printReceipt = (transaction: OfflineTransaction) => {
    // Implement receipt printing logic
    console.log('Printing receipt for transaction:', transaction.id)
  }

  const pendingTransactionsCount = offlineTransactions.filter(t => t.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-bold">
              {language === 'ar' ? 'نقطة البيع' : 'Point of Sale'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
            >
              {language === 'ar' ? 'EN' : 'ع'}
            </Button>

            {/* Network Status */}
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? (language === 'ar' ? 'متصل' : 'Online') : (language === 'ar' ? 'غير متصل' : 'Offline')}
              </span>
            </div>

            {/* Sync Button */}
            {pendingTransactionsCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={syncAllTransactions}
                disabled={!isOnline || syncStatus === 'syncing'}
                className="bg-orange-50 border-orange-200"
              >
                {syncStatus === 'syncing' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                <span className="ml-1 text-xs">{pendingTransactionsCount}</span>
              </Button>
            )}

            {/* Transaction History */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTransactionHistory(true)}
            >
              <Receipt className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Alerts */}
        {!isOnline && (
          <Alert className="mx-4 mb-2 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar'
                ? 'وضع عدم الاتصال - المعاملات سيتم مزامنتها عند عودة الاتصال'
                : 'Offline mode - Transactions will sync when connection is restored'}
            </AlertDescription>
          </Alert>
        )}

        {syncStatus === 'success' && (
          <Alert className="mx-4 mb-2 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar' ? 'تمت مزامنة جميع المعاملات بنجاح' : 'All transactions synced successfully'}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Product Selection (Left Panel) */}
        <div className="flex-1 p-4 lg:border-r">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={language === 'ar' ? 'البحث عن المنتجات أو مسح الباركود...' : 'Search products or scan barcode...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setIsScanning(!isScanning)}
            >
              <ScanLine className="h-4 w-4" />
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate text-sm">
                        {language === 'ar' ? product.nameAr : product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">SKU: {product.sku}</p>
                      <Badge variant="outline" className="text-xs">
                        {product.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                          style: 'currency',
                          currency: 'AED'
                        }).format(product.price)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {language === 'ar' ? 'المخزون:' : 'Stock:'} {product.stock} {product.unit}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }}
                      disabled={product.stock === 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart and Checkout (Right Panel) */}
        <div className="w-full lg:w-96 bg-white p-4 flex flex-col">
          {/* Customer Selection */}
          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowCustomerDialog(true)}
            >
              <User className="h-4 w-4 mr-2" />
              {saleState.customer
                ? (language === 'ar' ? saleState.customer.nameAr : saleState.customer.name)
                : (language === 'ar' ? 'اختيار العميل' : 'Select Customer')
              }
            </Button>
            {saleState.customer && (
              <div className="mt-2 text-sm text-gray-600">
                <div>{language === 'ar' ? 'النقاط:' : 'Points:'} {saleState.customer.loyaltyPoints}</div>
                <div>{language === 'ar' ? 'خصم:' : 'Discount:'} {saleState.customer.discountPercentage}%</div>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mb-4">
            <h3 className="font-semibold mb-2">
              {language === 'ar' ? 'عربة التسوق' : 'Cart'} ({saleState.cart.length})
            </h3>

            {saleState.cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>{language === 'ar' ? 'العربة فارغة' : 'Cart is empty'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {saleState.cart.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {language === 'ar' ? item.nameAr : item.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                            style: 'currency',
                            currency: 'AED'
                          }).format(item.price)} / {item.unit}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold">
                          {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                            style: 'currency',
                            currency: 'AED'
                          }).format(item.price * item.quantity - item.discount * item.quantity)}
                        </div>
                      </div>
                    </div>

                    {/* Discount Input */}
                    <div className="mt-2 flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Discount per unit"
                        className="text-xs"
                        value={item.discount || ''}
                        onChange={(e) => setDiscount(item.id, parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span>
                  {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                    style: 'currency',
                    currency: 'AED'
                  }).format(saleState.subtotal)}
                </span>
              </div>

              {saleState.discountAmount > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>{language === 'ar' ? 'إجمالي الخصم:' : 'Total Discount:'}</span>
                  <span>
                    -{new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                      style: 'currency',
                      currency: 'AED'
                    }).format(saleState.discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{language === 'ar' ? 'ضريبة القيمة المضافة:' : 'VAT:'}</span>
                <span>
                  {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                    style: 'currency',
                    currency: 'AED'
                  }).format(saleState.taxAmount)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>{language === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
                <span className="text-purple-600">
                  {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                    style: 'currency',
                    currency: 'AED'
                  }).format(saleState.total)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full mt-4"
              size="lg"
              onClick={() => setShowPaymentDialog(true)}
              disabled={saleState.cart.length === 0}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {language === 'ar' ? 'الدفع' : 'Checkout'}
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Selection Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'اختيار العميل' : 'Select Customer'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              {customers.map((customer) => (
                <Card
                  key={customer.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => selectCustomer(customer)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          {language === 'ar' ? customer.nameAr : customer.name}
                        </h4>
                        <p className="text-sm text-gray-600">{customer.phone}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {customer.loyaltyPoints} {language === 'ar' ? 'نقطة' : 'pts'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {customer.discountPercentage}% {language === 'ar' ? 'خصم' : 'discount'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => selectCustomer(null!)}
            >
              {language === 'ar' ? 'عميل عادي' : 'Walk-in Customer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'معالجة الدفع' : 'Process Payment'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Total Amount */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                  style: 'currency',
                  currency: 'AED'
                }).format(saleState.total)}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'المبلغ المطلوب' : 'Amount Due'}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <Label>{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={saleState.paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => dispatch({ type: 'SET_PAYMENT_METHOD', method: 'cash' })}
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'نقداً' : 'Cash'}
                </Button>
                <Button
                  variant={saleState.paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => dispatch({ type: 'SET_PAYMENT_METHOD', method: 'card' })}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'بطاقة' : 'Card'}
                </Button>
                <Button
                  variant={saleState.paymentMethod === 'transfer' ? 'default' : 'outline'}
                  onClick={() => dispatch({ type: 'SET_PAYMENT_METHOD', method: 'transfer' })}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'تحويل' : 'Transfer'}
                </Button>
                <Button
                  variant={saleState.paymentMethod === 'mixed' ? 'default' : 'outline'}
                  onClick={() => dispatch({ type: 'SET_PAYMENT_METHOD', method: 'mixed' })}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'مختلط' : 'Mixed'}
                </Button>
              </div>
            </div>

            {/* Cash Payment */}
            {saleState.paymentMethod === 'cash' && (
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'المبلغ المستلم' : 'Amount Received'}</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={saleState.amountReceived || ''}
                  onChange={(e) => dispatch({
                    type: 'SET_AMOUNT_RECEIVED',
                    amount: parseFloat(e.target.value) || 0
                  })}
                />
                {saleState.change > 0 && (
                  <div className="p-2 bg-green-50 rounded text-green-700">
                    {language === 'ar' ? 'الباقي:' : 'Change:'} {' '}
                    {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                      style: 'currency',
                      currency: 'AED'
                    }).format(saleState.change)}
                  </div>
                )}
              </div>
            )}

            {/* Complete Sale Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={completeSale}
              disabled={!saleState.paymentMethod || (saleState.paymentMethod === 'cash' && saleState.amountReceived < saleState.total)}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {language === 'ar' ? 'إتمام البيع' : 'Complete Sale'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction History Dialog */}
      <Dialog open={showTransactionHistory} onOpenChange={setShowTransactionHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'تاريخ المعاملات' : 'Transaction History'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {offlineTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>{language === 'ar' ? 'لا توجد معاملات' : 'No transactions found'}</p>
              </div>
            ) : (
              offlineTransactions.slice().reverse().map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{transaction.id}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.timestamp).toLocaleString(language === 'ar' ? 'ar-AE' : 'en-AE')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            transaction.status === 'synced' ? 'default' :
                            transaction.status === 'completed' ? 'secondary' : 'destructive'
                          }
                        >
                          {transaction.status === 'synced' ? (language === 'ar' ? 'متزامن' : 'Synced') :
                           transaction.status === 'completed' ? (language === 'ar' ? 'مكتمل' : 'Completed') :
                           (language === 'ar' ? 'معلق' : 'Pending')}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => printReceipt(transaction)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>{language === 'ar' ? 'عدد العناصر:' : 'Items:'}</span>
                        <span>{transaction.items.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'ar' ? 'طريقة الدفع:' : 'Payment:'}</span>
                        <span>{transaction.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>{language === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
                        <span className="text-purple-600">
                          {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
                            style: 'currency',
                            currency: 'AED'
                          }).format(transaction.total)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OfflineSalesTerminal