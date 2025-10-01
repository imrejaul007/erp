import React, { useRef, useEffect } from 'react';
import {
  Download,
  Printer,
  Share2,
  Receipt,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  User,
  CreditCard,
  Gift,
  QrCode,
  CheckCircle
} from 'lucide-react';

const VATCompliantReceipt = ({
  transaction,
  onPrint,
  onDownload,
  onShare,
  onClose,
  format = 'a4' // 'a4' or 'thermal'
}) => {
  const receiptRef = useRef(null);

  // Store information
  const storeInfo = {
    name: 'Oud Premium Store',
    nameArabic: 'متجر العود المميز',
    address: 'Shop G-123, Dubai Mall, Ground Floor',
    addressArabic: 'محل ج-123، دبي مول، الطابق الأرضي',
    city: 'Dubai, UAE',
    cityArabic: 'دبي، الإمارات العربية المتحدة',
    phone: '+971 4 123 4567',
    email: 'info@oudpremium.ae',
    website: 'www.oudpremium.ae',
    vatNumber: 'TRN-100352966400003',
    crNumber: 'CN-1234567',
    licenseNumber: 'DED-123456789'
  };

  useEffect(() => {
    // Auto-generate QR code if not provided
    if (!transaction?.qrCode) {
      generateQRCode();
    }
  }, [transaction]);

  const generateQRCode = () => {
    // In a real implementation, this would generate an actual QR code image
    // For now, we'll simulate the QR code data
    const qrData = {
      seller: storeInfo.name,
      vatNumber: storeInfo.vatNumber,
      timestamp: transaction?.transactionDate || new Date().toISOString(),
      totalAmount: transaction?.grandTotal?.toFixed(2),
      vatAmount: transaction?.totalVat?.toFixed(2),
      receiptNumber: transaction?.receiptNumber
    };

    // Encode as base64 (this would be actual QR code in production)
    const qrString = JSON.stringify(qrData);
    return btoa(qrString);
  };

  const formatCurrency = (amount, currency = 'AED') => {
    return `${currency} ${amount?.toFixed(2) || '0.00'}`;
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('en-AE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: d.toLocaleTimeString('en-AE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    };
  };

  const getPaymentMethodDisplay = (method) => {
    const methods = {
      'cash': { en: 'Cash', ar: 'نقداً' },
      'card': { en: 'Card', ar: 'بطاقة' },
      'digital': { en: 'Digital Wallet', ar: 'محفظة رقمية' },
      'bank_transfer': { en: 'Bank Transfer', ar: 'حوالة بنكية' },
      'loyalty_points': { en: 'Loyalty Points', ar: 'نقاط الولاء' },
      'cheque': { en: 'Cheque', ar: 'شيك' }
    };
    return methods[method] || { en: method, ar: method };
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const printContent = receiptRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${transaction?.receiptNumber}</title>
            <style>
              @media print {
                @page {
                  size: ${format === 'thermal' ? '80mm 297mm' : 'A4'};
                  margin: ${format === 'thermal' ? '0' : '10mm'};
                }
                body {
                  font-family: Arial, sans-serif;
                  font-size: ${format === 'thermal' ? '12px' : '14px'};
                  margin: 0;
                  padding: ${format === 'thermal' ? '5mm' : '10mm'};
                }
                .no-print { display: none !important; }
                .receipt-container {
                  max-width: ${format === 'thermal' ? '70mm' : '100%'};
                  margin: 0 auto;
                }
                .qr-code {
                  width: ${format === 'thermal' ? '40mm' : '60mm'};
                  height: ${format === 'thermal' ? '40mm' : '60mm'};
                }
              }
              body { font-family: Arial, sans-serif; line-height: 1.4; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              .mb-2 { margin-bottom: 8px; }
              .mb-4 { margin-bottom: 16px; }
              .border-b { border-bottom: 1px solid #ccc; padding-bottom: 8px; }
              .grid { display: grid; }
              .grid-cols-2 { grid-template-columns: 1fr 1fr; }
              .gap-2 { gap: 8px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 4px; text-align: left; }
              th { border-bottom: 1px solid #ccc; }
              .bg-gray-50 { background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
    onPrint?.();
  };

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    const element = receiptRef.current;
    if (element) {
      // Use html2pdf or similar library to generate PDF
      console.log('Downloading PDF receipt...');
      onDownload?.();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Receipt - ${transaction?.receiptNumber}`,
        text: `Your purchase receipt from ${storeInfo.name}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy receipt details to clipboard
      const receiptText = `
Receipt: ${transaction?.receiptNumber}
Store: ${storeInfo.name}
Date: ${formatDateTime(transaction?.transactionDate).date}
Total: ${formatCurrency(transaction?.grandTotal, transaction?.currency)}
      `.trim();

      navigator.clipboard.writeText(receiptText);
      alert('Receipt details copied to clipboard');
    }
    onShare?.();
  };

  if (!transaction) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Receipt Data</h3>
        <p className="text-gray-500">Transaction data is not available</p>
      </div>
    );
  }

  const dateTime = formatDateTime(transaction.transactionDate);
  const paymentMethod = getPaymentMethodDisplay(transaction.paymentMethod);

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Action Buttons */}
      <div className="no-print bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">VAT Compliant Receipt</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Receipt Content */}
      <div ref={receiptRef} className="p-6 space-y-6">
        {/* Store Header */}
        <div className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{storeInfo.name}</h1>
          <h2 className="text-lg text-gray-700 mb-3" dir="rtl">{storeInfo.nameArabic}</h2>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{storeInfo.address}</span>
            </div>
            <div dir="rtl" className="text-gray-500">{storeInfo.addressArabic}</div>
            <div>{storeInfo.city}</div>
            <div dir="rtl" className="text-gray-500">{storeInfo.cityArabic}</div>

            <div className="flex items-center justify-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>{storeInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span>{storeInfo.email}</span>
              </div>
            </div>
          </div>

          {/* VAT Registration */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">VAT No:</span> {storeInfo.vatNumber}
              </div>
              <div>
                <span className="font-medium">CR No:</span> {storeInfo.crNumber}
              </div>
              <div>
                <span className="font-medium">License:</span> {storeInfo.licenseNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Transaction Details
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Receipt No:</span>
                <span className="font-mono font-medium">{transaction.receiptNumber}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{dateTime.date}</span>
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{dateTime.time}</span>
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Cashier:</span>
                <span className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{transaction.cashierId}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Customer & Payment
            </h3>

            <div className="space-y-2 text-sm">
              {transaction.customer && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span>{transaction.customer.name || transaction.customerId}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="flex items-center space-x-1">
                  <CreditCard className="w-3 h-3" />
                  <span>{paymentMethod.en}</span>
                </span>
              </div>

              {transaction.paymentDetails?.lastFourDigits && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Card:</span>
                  <span>****{transaction.paymentDetails.lastFourDigits}</span>
                </div>
              )}

              {transaction.loyaltyPointsEarned > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Points Earned:</span>
                  <span className="flex items-center space-x-1">
                    <Gift className="w-3 h-3" />
                    <span>{transaction.loyaltyPointsEarned}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Items Purchased
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-3">Item</th>
                  <th className="text-center py-2 px-3">Qty</th>
                  <th className="text-right py-2 px-3">Unit Price</th>
                  <th className="text-right py-2 px-3">VAT %</th>
                  <th className="text-right py-2 px-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {transaction.items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-3">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.arabicName && (
                          <div className="text-gray-500 text-xs" dir="rtl">{item.arabicName}</div>
                        )}
                        <div className="text-gray-500 text-xs">SKU: {item.sku}</div>
                      </div>
                    </td>
                    <td className="text-center py-2 px-3">{item.quantity}</td>
                    <td className="text-right py-2 px-3">
                      {formatCurrency(item.unitPrice, transaction.currency)}
                    </td>
                    <td className="text-center py-2 px-3">{item.vatRate}%</td>
                    <td className="text-right py-2 px-3 font-medium">
                      {formatCurrency(item.totalPrice, transaction.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Promotions */}
        {transaction.promotions && transaction.promotions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Promotions Applied
            </h3>
            <div className="bg-green-50 rounded-lg p-3">
              {transaction.promotions.map((promo, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-green-800 text-sm">{promo.name}</span>
                  <span className="text-green-600 font-medium">
                    -{formatCurrency(promo.discountAmount, transaction.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VAT Breakdown */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
            VAT Breakdown (UAE)
          </h3>

          <div className="bg-blue-50 rounded-lg p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-200">
                  <th className="text-left py-2">VAT Rate</th>
                  <th className="text-right py-2">Taxable Amount</th>
                  <th className="text-right py-2">VAT Amount</th>
                </tr>
              </thead>
              <tbody>
                {transaction.vatBreakdown?.map((vat, index) => (
                  <tr key={index}>
                    <td className="py-1">{vat.vatRate}%</td>
                    <td className="text-right py-1">
                      {formatCurrency(vat.taxableAmount, transaction.currency)}
                    </td>
                    <td className="text-right py-1">
                      {formatCurrency(vat.vatAmount, transaction.currency)}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td className="py-1">5%</td>
                    <td className="text-right py-1">
                      {formatCurrency(transaction.subtotal, transaction.currency)}
                    </td>
                    <td className="text-right py-1">
                      {formatCurrency(transaction.totalVat, transaction.currency)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-3 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Total Summary
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal (excl. VAT):</span>
              <span>{formatCurrency(transaction.subtotal, transaction.currency)}</span>
            </div>

            {transaction.totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Total Discount:</span>
                <span>-{formatCurrency(transaction.totalDiscount, transaction.currency)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>VAT ({transaction.vatBreakdown?.[0]?.vatRate || 5}%):</span>
              <span>{formatCurrency(transaction.totalVat, transaction.currency)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
              <span>Total Amount:</span>
              <span>{formatCurrency(transaction.grandTotal, transaction.currency)}</span>
            </div>

            {transaction.paymentDetails?.changeGiven > 0 && (
              <div className="flex justify-between text-sm text-blue-600">
                <span>Change Given:</span>
                <span>{formatCurrency(transaction.paymentDetails.changeGiven, transaction.currency)}</span>
              </div>
            )}
          </div>
        </div>

        {/* QR Code and Footer */}
        <div className="text-center space-y-4 border-t border-gray-200 pt-6">
          <div className="flex justify-center">
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <QrCode className="w-16 h-16 mx-auto mb-2 text-gray-400" />
              <div className="text-xs text-gray-500">ZATCA Compliant QR Code</div>
              <div className="text-xs text-gray-400 mt-1 font-mono break-all max-w-32">
                {transaction.qrCode || generateQRCode()}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>This receipt is VAT compliant as per UAE Federal Tax Authority requirements</span>
            </div>

            <div>
              For customer service: {storeInfo.phone} | {storeInfo.email}
            </div>

            <div>
              Visit us at {storeInfo.website}
            </div>

            <div className="font-medium pt-2">
              Thank you for shopping with us! | شكراً لك على التسوق معنا
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VATCompliantReceipt;