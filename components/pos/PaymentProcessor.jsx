import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  DollarSign,
  Smartphone,
  Banknote,
  FileText,
  Gift,
  X,
  Check,
  AlertCircle,
  Calculator,
  Wallet,
  Building2,
  QrCode,
  Receipt
} from 'lucide-react';

const PaymentProcessor = ({
  total,
  currency = 'AED',
  onPaymentComplete,
  onClose,
  customer,
  cart
}) => {
  const [selectedMethod, setSelectedMethod] = useState('cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [changeAmount, setChangeAmount] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: ''
  });
  const [digitalWallet, setDigitalWallet] = useState({
    type: '',
    phoneNumber: '',
    transactionId: ''
  });
  const [bankTransfer, setBankTransfer] = useState({
    bankName: '',
    accountNumber: '',
    referenceNumber: ''
  });
  const [loyaltyPayment, setLoyaltyPayment] = useState({
    pointsToUse: 0,
    remainingAmount: total
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('method'); // 'method', 'details', 'confirmation'
  const [splitPayment, setSplitPayment] = useState(false);
  const [splitMethods, setSplitMethods] = useState([]);

  const amountInputRef = useRef(null);

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash',
      icon: Banknote,
      color: 'green',
      description: 'Pay with cash'
    },
    {
      id: 'card',
      name: 'Card',
      icon: CreditCard,
      color: 'blue',
      description: 'Credit/Debit card'
    },
    {
      id: 'digital',
      name: 'Digital Wallet',
      icon: Smartphone,
      color: 'purple',
      description: 'Apple Pay, Google Pay, etc.'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: Building2,
      color: 'indigo',
      description: 'Direct bank transfer'
    },
    {
      id: 'loyalty_points',
      name: 'Loyalty Points',
      icon: Gift,
      color: 'orange',
      description: 'Redeem loyalty points',
      disabled: !customer || (customer.loyaltyPoints || 0) < 10
    },
    {
      id: 'cheque',
      name: 'Cheque',
      icon: FileText,
      color: 'gray',
      description: 'Bank cheque payment'
    }
  ];

  const digitalWallets = [
    { id: 'apple_pay', name: 'Apple Pay', icon: '🍎' },
    { id: 'google_pay', name: 'Google Pay', icon: '💳' },
    { id: 'samsung_pay', name: 'Samsung Pay', icon: '📱' },
    { id: 'paypal', name: 'PayPal', icon: '💰' },
    { id: 'alipay', name: 'Alipay', icon: '🅰️' },
    { id: 'we_chat_pay', name: 'WeChat Pay', icon: '💬' }
  ];

  useEffect(() => {
    if (selectedMethod === 'cash' && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [selectedMethod]);

  useEffect(() => {
    const amount = parseFloat(paymentAmount) || 0;
    if (selectedMethod === 'cash') {
      setChangeAmount(Math.max(0, amount - total));
    } else {
      setChangeAmount(0);
    }
  }, [paymentAmount, total, selectedMethod]);

  const handleAmountInput = (value) => {
    setPaymentAmount(value);
    setError('');
  };

  const handleQuickAmount = (amount) => {
    setPaymentAmount(amount.toString());
  };

  const validatePayment = () => {
    setError('');

    switch (selectedMethod) {
      case 'cash':
        const cashAmount = parseFloat(paymentAmount) || 0;
        if (cashAmount < total) {
          setError('Insufficient cash amount');
          return false;
        }
        break;

      case 'card':
        if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
          setError('Invalid card number');
          return false;
        }
        if (!cardDetails.expiryDate || !cardDetails.cvv) {
          setError('Please fill all card details');
          return false;
        }
        break;

      case 'digital':
        if (!digitalWallet.type) {
          setError('Please select a digital wallet');
          return false;
        }
        break;

      case 'bank_transfer':
        if (!bankTransfer.referenceNumber) {
          setError('Bank reference number is required');
          return false;
        }
        break;

      case 'loyalty_points':
        if (loyaltyPayment.pointsToUse <= 0) {
          setError('Please specify points to use');
          return false;
        }
        if (loyaltyPayment.pointsToUse > (customer?.loyaltyPoints || 0)) {
          setError('Insufficient loyalty points');
          return false;
        }
        break;

      case 'cheque':
        // Add cheque validation here
        break;
    }

    return true;
  };

  const processPayment = async () => {
    if (!validatePayment()) return;

    setProcessing(true);
    setError('');

    try {
      let paymentDetails = {};

      switch (selectedMethod) {
        case 'cash':
          paymentDetails = {
            amountReceived: parseFloat(paymentAmount),
            changeGiven: changeAmount
          };
          break;

        case 'card':
          // In a real implementation, you would integrate with a payment processor here
          paymentDetails = {
            cardType: 'visa', // Would be detected from card number
            lastFourDigits: cardDetails.cardNumber.slice(-4),
            approvalCode: generateApprovalCode()
          };
          break;

        case 'digital':
          paymentDetails = {
            digitalWallet: digitalWallet.type,
            transactionId: digitalWallet.transactionId || generateTransactionId()
          };
          break;

        case 'bank_transfer':
          paymentDetails = {
            bankReference: bankTransfer.referenceNumber,
            bankName: bankTransfer.bankName
          };
          break;

        case 'loyalty_points':
          paymentDetails = {
            pointsUsed: loyaltyPayment.pointsToUse,
            pointsValue: loyaltyPayment.pointsToUse / 10 // Assuming 10 points = 1 AED
          };
          break;
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call the completion callback
      onPaymentComplete({
        method: selectedMethod,
        amount: total,
        details: paymentDetails
      });

    } catch (error) {
      console.error('Payment processing error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const generateApprovalCode = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
  };

  const CashPayment = () => {
    const quickAmounts = [
      total,
      Math.ceil(total / 10) * 10, // Round up to nearest 10
      Math.ceil(total / 50) * 50, // Round up to nearest 50
      Math.ceil(total / 100) * 100 // Round up to nearest 100
    ].filter((amount, index, arr) => arr.indexOf(amount) === index); // Remove duplicates

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Received
          </label>
          <input
            ref={amountInputRef}
            type="number"
            value={paymentAmount}
            onChange={(e) => handleAmountInput(e.target.value)}
            placeholder="Enter amount received"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            step="0.01"
            min={total}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Amounts
          </label>
          <div className="grid grid-cols-2 gap-2">
            {quickAmounts.map((amount, index) => (
              <button
                key={index}
                onClick={() => handleQuickAmount(amount)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors text-sm font-medium"
              >
                {currency} {amount.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        {changeAmount > 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Change: {currency} {changeAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CardPayment = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <input
          type="text"
          value={cardDetails.cardNumber}
          onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
          placeholder="1234 5678 9012 3456"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength="19"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={cardDetails.expiryDate}
            onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
            placeholder="MM/YY"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength="5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={cardDetails.cvv}
            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
            placeholder="123"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength="4"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardDetails.holderName}
          onChange={(e) => setCardDetails({...cardDetails, holderName: e.target.value})}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const DigitalWalletPayment = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Digital Wallet
        </label>
        <div className="grid grid-cols-2 gap-3">
          {digitalWallets.map(wallet => (
            <button
              key={wallet.id}
              onClick={() => setDigitalWallet({...digitalWallet, type: wallet.id})}
              className={`p-4 border rounded-lg transition-colors ${
                digitalWallet.type === wallet.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-2">{wallet.icon}</div>
              <div className="text-sm font-medium">{wallet.name}</div>
            </button>
          ))}
        </div>
      </div>

      {digitalWallet.type && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <QrCode className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-800">
              {digitalWallets.find(w => w.id === digitalWallet.type)?.name} Payment
            </span>
          </div>
          <p className="text-sm text-purple-700">
            Please complete the payment on your device and enter the transaction ID below.
          </p>
          <input
            type="text"
            value={digitalWallet.transactionId}
            onChange={(e) => setDigitalWallet({...digitalWallet, transactionId: e.target.value})}
            placeholder="Transaction ID (optional)"
            className="w-full mt-3 px-3 py-2 border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  );

  const LoyaltyPointsPayment = () => {
    const availablePoints = customer?.loyaltyPoints || 0;
    const pointValue = 0.1; // 1 point = 0.1 AED
    const maxPointsUsable = Math.min(availablePoints, Math.floor(total / pointValue));

    return (
      <div className="space-y-4">
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-medium text-orange-800 mb-2">Loyalty Points Available</h4>
          <div className="text-2xl font-bold text-orange-600">
            {availablePoints.toLocaleString()} points
          </div>
          <div className="text-sm text-orange-700">
            Value: {currency} {(availablePoints * pointValue).toFixed(2)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points to Use (1 point = {currency} {pointValue})
          </label>
          <input
            type="number"
            value={loyaltyPayment.pointsToUse}
            onChange={(e) => {
              const points = Math.min(parseInt(e.target.value) || 0, maxPointsUsable);
              setLoyaltyPayment({
                pointsToUse: points,
                remainingAmount: Math.max(0, total - (points * pointValue))
              });
            }}
            max={maxPointsUsable}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLoyaltyPayment({
              pointsToUse: Math.floor(maxPointsUsable / 4),
              remainingAmount: total - (Math.floor(maxPointsUsable / 4) * pointValue)
            })}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            Use 25%
          </button>
          <button
            onClick={() => setLoyaltyPayment({
              pointsToUse: Math.floor(maxPointsUsable / 2),
              remainingAmount: total - (Math.floor(maxPointsUsable / 2) * pointValue)
            })}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            Use 50%
          </button>
        </div>

        {loyaltyPayment.remainingAmount > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="text-sm text-yellow-800">
              Remaining amount: {currency} {loyaltyPayment.remainingAmount.toFixed(2)}
            </div>
            <div className="text-xs text-yellow-600 mt-1">
              You'll need to pay the remaining amount with another method
            </div>
          </div>
        )}
      </div>
    );
  };

  const PaymentMethodSelection = () => (
    <div className="grid grid-cols-2 gap-4">
      {paymentMethods.map(method => {
        const IconComponent = method.icon;
        const isDisabled = method.disabled;

        return (
          <button
            key={method.id}
            onClick={() => !isDisabled && setSelectedMethod(method.id)}
            disabled={isDisabled}
            className={`p-6 border-2 rounded-lg transition-all ${
              selectedMethod === method.id
                ? `border-${method.color}-500 bg-${method.color}-50`
                : isDisabled
                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <IconComponent className={`w-8 h-8 mx-auto mb-3 ${
              selectedMethod === method.id
                ? `text-${method.color}-600`
                : isDisabled
                ? 'text-gray-400'
                : 'text-gray-500'
            }`} />
            <div className="font-medium text-gray-900">{method.name}</div>
            <div className="text-xs text-gray-500 mt-1">{method.description}</div>
          </button>
        );
      })}
    </div>
  );

  const renderPaymentDetails = () => {
    switch (selectedMethod) {
      case 'cash':
        return <CashPayment />;
      case 'card':
        return <CardPayment />;
      case 'digital':
        return <DigitalWalletPayment />;
      case 'loyalty_points':
        return <LoyaltyPointsPayment />;
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Payment details for {selectedMethod} coming soon...
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Process Payment</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Total Amount */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-blue-600 mb-1">Total Amount</div>
          <div className="text-3xl font-bold text-blue-800">
            {currency} {total.toFixed(2)}
          </div>
          {customer && (
            <div className="text-sm text-blue-600 mt-2">
              Customer: {customer.name}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Select Payment Method</h3>
        <PaymentMethodSelection />
      </div>

      {/* Payment Details */}
      {selectedMethod && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Details</h3>
          {renderPaymentDetails()}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={processPayment}
          disabled={processing || !selectedMethod}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Receipt className="w-5 h-5" />
              <span>Complete Payment</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentProcessor;