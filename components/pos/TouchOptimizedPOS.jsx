import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShoppingCart,
  Search,
  CreditCard,
  DollarSign,
  User,
  Settings,
  RefreshCw,
  X,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Calculator,
  Grid,
  List,
  Star,
  Gift,
  Phone,
  Mail,
  Package,
  Scan,
  Menu,
  Home,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Wifi,
  WifiOff,
  Battery,
  Volume2,
  Maximize,
  Minimize
} from 'lucide-react';

// Import existing components
import BarcodeScanner from './BarcodeScanner';
import ProductSearch from './ProductSearch';
import PaymentProcessor from './PaymentProcessor';
import CustomerLookup from './CustomerLookup';
import VATCompliantReceipt from './VATCompliantReceipt';

const TouchOptimizedPOS = ({
  storeId,
  cashierId,
  isTabletMode = true,
  orientation = 'landscape' // 'portrait' or 'landscape'
}) => {
  // Core state
  const [currentView, setCurrentView] = useState('main');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [currency, setCurrency] = useState('AED');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // UI state
  const [touchMode, setTouchMode] = useState(isTabletMode);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickPadOpen, setQuickPadOpen] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [paymentProcessorOpen, setPaymentProcessorOpen] = useState(false);
  const [customerLookupOpen, setCustomerLookupOpen] = useState(false);
  const [receiptViewOpen, setReceiptViewOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  // Calculation state
  const [subtotal, setSubtotal] = useState(0);
  const [totalVat, setTotalVat] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [appliedPromotions, setAppliedPromotions] = useState([]);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);

  // Touch interaction state
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Refs
  const posRef = useRef(null);
  const audioRef = useRef(null);

  // Keyboard shortcuts for tablets with external keyboards
  const shortcuts = {
    'F1': () => setScannerActive(true),
    'F2': () => setCustomerLookupOpen(true),
    'F3': () => setPaymentProcessorOpen(true),
    'F4': () => clearCart(),
    'Escape': () => {
      setScannerActive(false);
      setPaymentProcessorOpen(false);
      setCustomerLookupOpen(false);
    },
    'Enter': () => {
      if (cart.length > 0) setPaymentProcessorOpen(true);
    }
  };

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cart]);

  // Calculate totals when cart changes
  useEffect(() => {
    calculateTotals();
  }, [cart, appliedPromotions, loyaltyDiscount]);

  // Touch feedback sound
  const playTouchSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {}); // Ignore autoplay restrictions
    }
  }, []);

  // Haptic feedback for supported devices
  const hapticFeedback = useCallback((intensity = 'medium') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 25,
        heavy: 50
      };
      navigator.vibrate(patterns[intensity] || 25);
    }
  }, []);

  const calculateTotals = () => {
    let newSubtotal = 0;
    let newTotalVat = 0;

    cart.forEach(item => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemDiscount = item.discount || 0;
      const discountedTotal = itemTotal - itemDiscount;

      newSubtotal += discountedTotal;

      // Calculate VAT
      if (item.vatRate > 0) {
        newTotalVat += (discountedTotal * item.vatRate) / 100;
      }
    });

    // Apply promotions
    let promotionDiscount = 0;
    appliedPromotions.forEach(promo => {
      promotionDiscount += promo.discountAmount || 0;
    });

    newSubtotal -= promotionDiscount;
    newSubtotal -= loyaltyDiscount;

    const newGrandTotal = newSubtotal + newTotalVat;

    setSubtotal(Math.max(0, newSubtotal));
    setTotalVat(newTotalVat);
    setGrandTotal(Math.max(0, newGrandTotal));
  };

  const addToCart = (product, quantity = 1) => {
    playTouchSound();
    hapticFeedback('light');

    const existingItemIndex = cart.findIndex(item => item.sku === product.sku);

    if (existingItemIndex >= 0) {
      updateQuantity(existingItemIndex, cart[existingItemIndex].quantity + quantity);
    } else {
      const newItem = {
        id: Date.now(),
        productId: product._id,
        sku: product.sku,
        name: product.name,
        arabicName: product.arabicName,
        quantity: quantity,
        unitPrice: product.retailPrice || product.basePrice,
        discount: 0,
        vatRate: product.vatRate || 5,
        image: product.images?.[0],
        category: product.category,
        brand: product.brand
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }

    const updatedCart = cart.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const removeFromCart = (index) => {
    hapticFeedback('medium');
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const clearCart = () => {
    hapticFeedback('heavy');
    setCart([]);
    setCustomer(null);
    setAppliedPromotions([]);
    setLoyaltyDiscount(0);
    setSelectedItems(new Set());
  };

  const handleBarcodeScanned = async (barcode) => {
    try {
      const response = await fetch(`/api/products/barcode/${barcode}`);
      if (response.ok) {
        const data = await response.json();
        addToCart(data.product);
        setScannerActive(false);
      } else {
        alert('Product not found');
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      alert('Error scanning barcode');
    }
  };

  const processPayment = async (paymentData) => {
    try {
      const transactionData = {
        storeId,
        cashierId,
        customerId: customer?._id,
        items: cart.map(item => ({
          productId: item.productId,
          sku: item.sku,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          vatAmount: (item.quantity * item.unitPrice * item.vatRate) / 100,
          totalPrice: item.quantity * item.unitPrice - item.discount
        })),
        subtotal,
        totalVat,
        grandTotal,
        currency,
        paymentMethod: paymentData.method,
        paymentDetails: paymentData.details,
        promotionsApplied: appliedPromotions,
        loyaltyPointsUsed: loyaltyDiscount > 0 ? Math.floor(loyaltyDiscount * 10) : 0,
        loyaltyPointsEarned: Math.floor(grandTotal * 0.01 * 10)
      };

      const response = await fetch('/api/sales/pos/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (response.ok) {
        const result = await response.json();
        setLastTransaction(result.transaction);
        clearCart();
        setPaymentProcessorOpen(false);
        setReceiptViewOpen(true);
        hapticFeedback('heavy');
        alert('Transaction completed successfully!');
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    }
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(false);

    // Start long press timer
    const timer = setTimeout(() => {
      hapticFeedback('heavy');
      // Handle long press action
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchMove = (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);

    if (deltaX > 10 || deltaY > 10) {
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setIsDragging(false);
  };

  // Status bar component
  const StatusBar = () => (
    <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleTimeString('en-AE', {
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>

        <div className="flex items-center space-x-1">
          <User className="w-4 h-4" />
          <span>{cashierId}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Battery className="w-4 h-4" />
          <span>95%</span>
        </div>

        {cart.length > 0 && (
          <div className="flex items-center space-x-1">
            <ShoppingCart className="w-4 h-4" />
            <span>{cart.length} items</span>
          </div>
        )}
      </div>
    </div>
  );

  // Quick actions panel for touch interface
  const QuickActionsPanel = () => (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all ${
      quickPadOpen ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => { setScannerActive(true); setQuickPadOpen(false); }}
            className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Scan className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-800">Scan</span>
            <span className="text-xs text-blue-600">F1</span>
          </button>

          <button
            onClick={() => { setCustomerLookupOpen(true); setQuickPadOpen(false); }}
            className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
          >
            <User className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-800">Customer</span>
            <span className="text-xs text-green-600">F2</span>
          </button>

          <button
            onClick={() => {
              if (cart.length > 0) {
                setPaymentProcessorOpen(true);
                setQuickPadOpen(false);
              }
            }}
            disabled={cart.length === 0}
            className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 disabled:bg-gray-50 rounded-xl transition-colors"
          >
            <CreditCard className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-800">Payment</span>
            <span className="text-xs text-purple-600">F3</span>
          </button>

          <button
            onClick={() => { clearCart(); setQuickPadOpen(false); }}
            disabled={cart.length === 0}
            className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 disabled:bg-gray-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-8 h-8 text-red-600 mb-2" />
            <span className="text-sm font-medium text-red-800">Clear</span>
            <span className="text-xs text-red-600">F4</span>
          </button>
        </div>

        <button
          onClick={() => setQuickPadOpen(false)}
          className="w-full mt-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );

  // Enhanced cart item component for touch
  const TouchCartItem = ({ item, index }) => {
    const [isSelected, setIsSelected] = useState(selectedItems.has(index));

    const handleItemTap = () => {
      playTouchSound();
      hapticFeedback('light');

      const newSelected = new Set(selectedItems);
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
      setSelectedItems(newSelected);
      setIsSelected(!isSelected);
    };

    return (
      <div
        onClick={handleItemTap}
        className={`p-4 rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-lg truncate">{item.name}</h3>
            <p className="text-gray-500 text-sm truncate">{item.sku}</p>
            <div className="flex items-center mt-2 space-x-4">
              <span className="text-lg font-semibold text-gray-900">
                {currency} {item.unitPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                VAT {item.vatRate}%
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(index, Math.max(1, item.quantity - 1));
                }}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>

              <span className="w-12 text-center text-xl font-semibold bg-blue-50 py-2 px-3 rounded-lg">
                {item.quantity}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(index, item.quantity + 1);
                }}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {currency} {(item.quantity * item.unitPrice).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main layout component
  const MainLayout = () => (
    <div className="h-screen flex flex-col bg-gray-50">
      <StatusBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Product Search Panel */}
        <div className="flex-1 p-4 overflow-hidden">
          <ProductSearch
            onProductSelect={addToCart}
            touchMode={touchMode}
            storeId={storeId}
          />
        </div>

        {/* Cart Panel */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <ShoppingCart className="w-6 h-6" />
                <span>Cart</span>
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium text-gray-600">
                  {cart.length} items
                </span>
              </div>
            </div>

            {customer && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">{customer.name}</span>
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  Loyalty Points: {customer.loyaltyPoints || 0}
                </div>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ShoppingCart className="w-16 h-16 mb-4 text-gray-300" />
                <h3 className="text-xl font-medium mb-2">Cart is empty</h3>
                <p className="text-center">Start adding products to begin a transaction</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <TouchCartItem key={item.id || index} item={item} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>{currency} {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-lg">
                  <span>VAT (5%):</span>
                  <span>{currency} {totalVat.toFixed(2)}</span>
                </div>

                <hr className="border-gray-300" />

                <div className="flex justify-between text-2xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span>{currency} {grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setPaymentProcessorOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 text-lg"
                >
                  <CreditCard className="w-6 h-6" />
                  <span>Process Payment</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCustomerLookupOpen(true)}
                    className="bg-green-100 hover:bg-green-200 text-green-800 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                  >
                    <User className="w-5 h-5" />
                    <span>Customer</span>
                  </button>

                  <button
                    onClick={clearCart}
                    className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setQuickPadOpen(!quickPadOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-all"
      >
        {quickPadOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>

      <QuickActionsPanel />
    </div>
  );

  return (
    <div
      ref={posRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="select-none"
    >
      {/* Hidden audio for touch feedback */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/click.mp3" type="audio/mpeg" />
      </audio>

      <MainLayout />

      {/* Modals */}
      {scannerActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <BarcodeScanner
              onBarcodeScanned={handleBarcodeScanned}
              onClose={() => setScannerActive(false)}
            />
          </div>
        </div>
      )}

      {customerLookupOpen && (
        <CustomerLookup
          onCustomerSelect={(customer) => {
            setCustomer(customer);
            setCustomerLookupOpen(false);
          }}
          onClose={() => setCustomerLookupOpen(false)}
        />
      )}

      {paymentProcessorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <PaymentProcessor
              total={grandTotal}
              currency={currency}
              onPaymentComplete={processPayment}
              onClose={() => setPaymentProcessorOpen(false)}
              customer={customer}
              cart={cart}
            />
          </div>
        </div>
      )}

      {receiptViewOpen && lastTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <VATCompliantReceipt
              transaction={lastTransaction}
              onClose={() => setReceiptViewOpen(false)}
              format="a4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TouchOptimizedPOS;