import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingCart,
  Search,
  CreditCard,
  DollarSign,
  Smartphone,
  Printer,
  User,
  Settings,
  BarChart3,
  RefreshCw,
  X,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Calculator
} from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';
import ProductSearch from './ProductSearch';
import ShoppingCartComponent from './ShoppingCartComponent';
import PaymentProcessor from './PaymentProcessor';
import CustomerLookup from './CustomerLookup';

const POSTerminal = ({ storeId, cashierId }) => {
  const [currentView, setCurrentView] = useState('main');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [quickActionsPanelOpen, setQuickActionsPanelOpen] = useState(false);
  const [paymentProcessorOpen, setPaymentProcessorOpen] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [totalVat, setTotalVat] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [appliedPromotions, setAppliedPromotions] = useState([]);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [currency, setCurrency] = useState('AED');
  const [touchMode, setTouchMode] = useState(true);

  const posRef = useRef(null);

  // Calculate totals when cart changes
  useEffect(() => {
    calculateTotals();
  }, [cart, appliedPromotions, loyaltyDiscount]);

  const calculateTotals = () => {
    let newSubtotal = 0;
    let newTotalVat = 0;

    cart.forEach(item => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemDiscount = item.discount || 0;
      const discountedTotal = itemTotal - itemDiscount;

      newSubtotal += discountedTotal;

      // Calculate VAT (UAE standard 5%)
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
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    setAppliedPromotions([]);
    setLoyaltyDiscount(0);
  };

  const handleBarcodeScanned = async (barcode) => {
    try {
      const response = await fetch(`/api/products/barcode/${barcode}`);
      if (response.ok) {
        const product = await response.json();
        addToCart(product);
        setScannerActive(false);
      } else {
        // Product not found
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
        loyaltyPointsUsed: loyaltyDiscount > 0 ? Math.floor(loyaltyDiscount * 10) : 0, // Assuming 1 AED = 10 points
        loyaltyPointsEarned: Math.floor(grandTotal * 0.01 * 10) // 1% earning rate
      };

      const response = await fetch('/api/sales/pos/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      });

      if (response.ok) {
        const result = await response.json();
        // Print receipt and clear cart
        printReceipt(result.transaction);
        clearCart();
        setPaymentProcessorOpen(false);
        setCurrentView('main');

        // Show success message
        alert('Transaction completed successfully!');
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    }
  };

  const printReceipt = (transaction) => {
    // Implement receipt printing logic
    console.log('Printing receipt for transaction:', transaction);
  };

  const QuickActionsPanel = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
        <button
          onClick={() => setQuickActionsPanelOpen(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setScannerActive(true)}
          className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <Search className="w-8 h-8 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-blue-800">Scan Barcode</span>
        </button>

        <button
          onClick={() => setCurrentView('customer')}
          className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
        >
          <User className="w-8 h-8 text-green-600 mb-2" />
          <span className="text-sm font-medium text-green-800">Add Customer</span>
        </button>

        <button
          onClick={() => setCurrentView('discounts')}
          className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
        >
          <Calculator className="w-8 h-8 text-purple-600 mb-2" />
          <span className="text-sm font-medium text-purple-800">Apply Discount</span>
        </button>

        <button
          onClick={() => setCurrentView('returns')}
          className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-8 h-8 text-orange-600 mb-2" />
          <span className="text-sm font-medium text-orange-800">Returns</span>
        </button>
      </div>
    </div>
  );

  const CartSummary = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>{currency} {subtotal.toFixed(2)}</span>
        </div>

        {appliedPromotions.map((promo, index) => (
          <div key={index} className="flex justify-between text-green-600 text-sm">
            <span>{promo.name}:</span>
            <span>-{currency} {promo.discountAmount.toFixed(2)}</span>
          </div>
        ))}

        {loyaltyDiscount > 0 && (
          <div className="flex justify-between text-green-600 text-sm">
            <span>Loyalty Discount:</span>
            <span>-{currency} {loyaltyDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>VAT (5%):</span>
          <span>{currency} {totalVat.toFixed(2)}</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between text-xl font-bold text-gray-800">
          <span>Total:</span>
          <span>{currency} {grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={() => setPaymentProcessorOpen(true)}
          disabled={cart.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <CreditCard className="w-5 h-5" />
          <span>Process Payment</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setQuickActionsPanelOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Actions</span>
          </button>

          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 disabled:text-gray-400 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={posRef} className="h-screen bg-gray-50 flex">
      {/* Left Panel - Product Search and Categories */}
      <div className="flex-1 p-4 overflow-hidden">
        {currentView === 'main' && (
          <ProductSearch
            onProductSelect={addToCart}
            touchMode={touchMode}
            storeId={storeId}
          />
        )}

        {currentView === 'customer' && (
          <CustomerLookup
            onCustomerSelect={setCustomer}
            onClose={() => setCurrentView('main')}
          />
        )}
      </div>

      {/* Right Panel - Cart and Checkout */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Shopping Cart</span>
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Items: {cart.length}</span>
              <button
                onClick={() => setScannerActive(true)}
                className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {customer && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{customer.name}</span>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Loyalty Points: {customer.loyaltyPoints || 0}
              </div>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <ShoppingCartComponent
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            currency={currency}
            touchMode={touchMode}
          />
        </div>

        {/* Cart Summary and Checkout */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <CartSummary />
        </div>
      </div>

      {/* Modals and Overlays */}
      {scannerActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <BarcodeScanner
              onBarcodeScanned={handleBarcodeScanned}
              onClose={() => setScannerActive(false)}
            />
          </div>
        </div>
      )}

      {quickActionsPanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <QuickActionsPanel />
          </div>
        </div>
      )}

      {paymentProcessorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
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

      {/* Touch Mode Toggle (for development) */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setTouchMode(!touchMode)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-50 hover:opacity-100 transition-opacity"
        >
          {touchMode ? 'Touch Mode' : 'Mouse Mode'}
        </button>
      </div>
    </div>
  );
};

export default POSTerminal;