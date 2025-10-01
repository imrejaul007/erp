import React, { useState, useEffect } from 'react';
import {
  Plus,
  Minus,
  Trash2,
  Edit3,
  Tag,
  AlertTriangle,
  Package,
  Calculator,
  Percent,
  DollarSign
} from 'lucide-react';

const ShoppingCartComponent = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  currency = 'AED',
  touchMode = true
}) => {
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editDiscount, setEditDiscount] = useState('');
  const [showDiscountModal, setShowDiscountModal] = useState(null);
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' or 'fixed'

  // Reset editing state when cart changes
  useEffect(() => {
    setEditingItem(null);
    setShowDiscountModal(null);
  }, [cart]);

  const handleQuantityEdit = (index, item) => {
    setEditingItem(index);
    setEditQuantity(item.quantity.toString());
  };

  const saveQuantityEdit = (index) => {
    const newQuantity = parseInt(editQuantity, 10);
    if (newQuantity > 0 && !isNaN(newQuantity)) {
      onUpdateQuantity(index, newQuantity);
    }
    setEditingItem(null);
    setEditQuantity('');
  };

  const cancelQuantityEdit = () => {
    setEditingItem(null);
    setEditQuantity('');
  };

  const handleDiscountEdit = (index, item) => {
    setShowDiscountModal(index);
    setEditDiscount(item.discount?.toString() || '0');
    setDiscountType('fixed');
  };

  const saveDiscountEdit = (index) => {
    const discountValue = parseFloat(editDiscount) || 0;
    let finalDiscount = 0;

    if (discountType === 'percentage') {
      const itemTotal = cart[index].quantity * cart[index].unitPrice;
      finalDiscount = (itemTotal * discountValue) / 100;
    } else {
      finalDiscount = discountValue;
    }

    // Update the cart item with the new discount
    const updatedCart = cart.map((item, i) =>
      i === index ? { ...item, discount: Math.max(0, finalDiscount) } : item
    );

    // Call a callback to update the cart in the parent component
    if (onUpdateQuantity) {
      // Since we don't have a direct discount update callback, we'll use a workaround
      const event = new CustomEvent('updateCartDiscount', {
        detail: { index, discount: Math.max(0, finalDiscount) }
      });
      window.dispatchEvent(event);
    }

    setShowDiscountModal(null);
    setEditDiscount('');
  };

  const cancelDiscountEdit = () => {
    setShowDiscountModal(null);
    setEditDiscount('');
  };

  const getItemTotal = (item) => {
    const baseTotal = item.quantity * item.unitPrice;
    const discount = item.discount || 0;
    return Math.max(0, baseTotal - discount);
  };

  const getVatAmount = (item) => {
    const total = getItemTotal(item);
    return (total * (item.vatRate || 5)) / 100;
  };

  const formatPrice = (amount) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  const QuantityControls = ({ item, index }) => {
    if (editingItem === index) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={editQuantity}
            onChange={(e) => setEditQuantity(e.target.value)}
            onBlur={() => saveQuantityEdit(index)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') saveQuantityEdit(index);
              if (e.key === 'Escape') cancelQuantityEdit();
            }}
            className="w-16 px-2 py-1 text-center border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <button
            onClick={() => saveQuantityEdit(index)}
            className="text-green-600 hover:text-green-700"
          >
            ✓
          </button>
          <button
            onClick={cancelQuantityEdit}
            className="text-red-600 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
          className={`p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors ${
            touchMode ? 'w-8 h-8' : 'w-6 h-6'
          }`}
          disabled={item.quantity <= 1}
        >
          <Minus className={touchMode ? 'w-4 h-4' : 'w-3 h-3'} />
        </button>

        <button
          onClick={() => handleQuantityEdit(index, item)}
          className={`px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors ${
            touchMode ? 'text-base min-w-[3rem]' : 'text-sm min-w-[2.5rem]'
          }`}
        >
          {item.quantity}
        </button>

        <button
          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
          className={`p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors ${
            touchMode ? 'w-8 h-8' : 'w-6 h-6'
          }`}
        >
          <Plus className={touchMode ? 'w-4 h-4' : 'w-3 h-3'} />
        </button>
      </div>
    );
  };

  const DiscountModal = ({ item, index }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Apply Discount</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product: {item.name}
            </label>
            <div className="text-sm text-gray-500">
              Unit Price: {formatPrice(item.unitPrice)} × {item.quantity} = {formatPrice(item.quantity * item.unitPrice)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="percentage"
                  checked={discountType === 'percentage'}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="mr-2"
                />
                <span>Percentage (%)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="fixed"
                  checked={discountType === 'fixed'}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="mr-2"
                />
                <span>Fixed Amount ({currency})</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value
            </label>
            <div className="relative">
              <input
                type="number"
                value={editDiscount}
                onChange={(e) => setEditDiscount(e.target.value)}
                placeholder={discountType === 'percentage' ? 'Enter percentage' : `Enter amount in ${currency}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.01"
                min="0"
                max={discountType === 'percentage' ? '100' : item.quantity * item.unitPrice}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {discountType === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {editDiscount && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(item.quantity * item.unitPrice)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>
                    -{formatPrice(
                      discountType === 'percentage'
                        ? (item.quantity * item.unitPrice * parseFloat(editDiscount || 0)) / 100
                        : parseFloat(editDiscount || 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>
                    {formatPrice(
                      Math.max(0, item.quantity * item.unitPrice - (
                        discountType === 'percentage'
                          ? (item.quantity * item.unitPrice * parseFloat(editDiscount || 0)) / 100
                          : parseFloat(editDiscount || 0)
                      ))
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => saveDiscountEdit(index)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Apply Discount
          </button>
          <button
            onClick={cancelDiscountEdit}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const CartItem = ({ item, index }) => {
    const itemTotal = getItemTotal(item);
    const vatAmount = getVatAmount(item);
    const hasDiscount = (item.discount || 0) > 0;

    return (
      <div className={`p-4 bg-white border border-gray-200 rounded-lg space-y-3 ${
        touchMode ? 'min-h-[120px]' : 'min-h-[100px]'
      }`}>
        {/* Product Info */}
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 bg-gray-100 rounded overflow-hidden ${
            touchMode ? 'w-16 h-16' : 'w-12 h-12'
          }`}>
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className={touchMode ? 'w-6 h-6' : 'w-4 h-4'} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 truncate ${
              touchMode ? 'text-base' : 'text-sm'
            }`}>
              {item.name}
            </h3>
            <p className={`text-gray-500 truncate ${
              touchMode ? 'text-sm' : 'text-xs'
            }`}>
              {item.sku}
            </p>
            <div className={`flex items-center space-x-2 ${
              touchMode ? 'text-sm' : 'text-xs'
            }`}>
              <span className="text-gray-600">
                {formatPrice(item.unitPrice)} each
              </span>
              {item.vatRate > 0 && (
                <span className="text-gray-500">
                  VAT {item.vatRate}%
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onRemoveItem(index)}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity and Price Controls */}
        <div className="flex items-center justify-between">
          <QuantityControls item={item} index={index} />

          <div className="text-right">
            <div className={`font-semibold text-gray-900 ${
              touchMode ? 'text-base' : 'text-sm'
            }`}>
              {formatPrice(itemTotal)}
            </div>
            {hasDiscount && (
              <div className={`text-green-600 ${
                touchMode ? 'text-sm' : 'text-xs'
              }`}>
                Saved: {formatPrice(item.discount)}
              </div>
            )}
            {item.vatRate > 0 && (
              <div className={`text-gray-500 ${
                touchMode ? 'text-xs' : 'text-xs'
              }`}>
                VAT: {formatPrice(vatAmount)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleDiscountEdit(index, item)}
            className={`flex items-center space-x-1 px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded transition-colors ${
              touchMode ? 'text-sm' : 'text-xs'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>{hasDiscount ? 'Edit Discount' : 'Add Discount'}</span>
          </button>

          <button
            onClick={() => handleQuantityEdit(index, item)}
            className={`flex items-center space-x-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded transition-colors ${
              touchMode ? 'text-sm' : 'text-xs'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Qty</span>
          </button>
        </div>
      </div>
    );
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Package className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className={`font-medium mb-2 ${touchMode ? 'text-lg' : 'text-base'}`}>
          Your cart is empty
        </h3>
        <p className={`text-center ${touchMode ? 'text-base' : 'text-sm'}`}>
          Start adding products to begin a transaction
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cart.map((item, index) => (
        <CartItem key={item.id || index} item={item} index={index} />
      ))}

      {/* Discount Modal */}
      {showDiscountModal !== null && cart[showDiscountModal] && (
        <DiscountModal
          item={cart[showDiscountModal]}
          index={showDiscountModal}
        />
      )}

      {/* Cart Summary Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-800">
          <Calculator className="w-4 h-4" />
          <span className="text-sm font-medium">
            {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
          </span>
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Prices include applicable taxes and discounts
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartComponent;