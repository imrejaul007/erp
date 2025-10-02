'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Printer,
  Mail,
  MessageSquare,
  Download,
  Share2,
  ArrowLeft,
  Copy,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Receipt,
  Star,
  Heart
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function ReceiptPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiptRef = useRef<HTMLDivElement>(null);

  // Get receipt data from URL params or localStorage
  const [receiptData, setReceiptData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get receipt data from URL params first, then localStorage
    const receiptId = searchParams.get('id');
    const storedReceipt = localStorage.getItem(`receipt_${receiptId}`);

    if (storedReceipt) {
      setReceiptData(JSON.parse(storedReceipt));
    } else {
      // Generate sample receipt data if none found
      setReceiptData(generateSampleReceipt());
    }
    setLoading(false);
  }, [searchParams]);

  const generateSampleReceipt = () => {
    return {
      id: 'RCP-' + Date.now(),
      date: new Date().toISOString(),
      items: [
        {
          name: 'Royal Cambodian Oud',
          nameArabic: 'عود كمبودي ملكي',
          quantity: 0.5,
          unit: 'tola',
          unitPrice: 214.15,
          totalPrice: 107.075
        },
        {
          name: 'Taif Rose Attar',
          nameArabic: 'عطر الورد الطائفي',
          quantity: 1,
          unit: 'ml',
          unitPrice: 850,
          totalPrice: 850
        }
      ],
      customer: {
        name: 'Ahmed Al-Rashid',
        nameArabic: 'أحمد الراشد',
        phone: '+971 50 123 4567',
        type: 'VIP',
        loyaltyPoints: 1250
      },
      payment: {
        method: 'cash',
        subtotal: 957.075,
        customerDiscount: 95.71, // 10% VIP discount
        customDiscount: 0,
        vatAmount: 43.07,
        total: 904.37,
        cashReceived: 1000,
        change: 95.63
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
      cashier: 'Admin User',
      terminal: 'POS-001'
    };
  };

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${receiptData.id}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              margin: 0;
              padding: 20px;
              font-size: 12px;
              line-height: 1.4;
            }
            .receipt-container {
              max-width: 300px;
              margin: 0 auto;
              background: white;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .mb-2 { margin-bottom: 8px; }
            .mb-4 { margin-bottom: 16px; }
            .border-t { border-top: 1px dashed #000; padding-top: 8px; }
            .border-b { border-bottom: 1px dashed #000; padding-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 2px 0; }
            .item-row td { border-bottom: 1px dotted #ccc; }
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleEmailShare = () => {
    const subject = `Receipt ${receiptData.id} - Oud Palace`;
    const body = `Dear ${receiptData.customer.name},

Thank you for your purchase at Oud Palace!

Receipt Details:
- Receipt ID: ${receiptData.id}
- Date: ${new Date(receiptData.date).toLocaleDateString()}
- Total Amount: AED ${receiptData.payment.total.toFixed(2)}

You can view your full receipt at: ${window.location.href}

Best regards,
Oud Palace Team`;

    const mailtoLink = `mailto:${receiptData.customer.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleWhatsAppShare = () => {
    const message = `🧾 *Receipt from Oud Palace*

Receipt ID: ${receiptData.id}
Date: ${new Date(receiptData.date).toLocaleDateString()}
Total: AED ${receiptData.payment.total.toFixed(2)}

Thank you for your purchase! 🌹

View full receipt: ${window.location.href}`;

    const whatsappLink = `https://wa.me/${receiptData.customer.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Receipt link copied to clipboard!');
  };

  const handleDownloadPDF = () => {
    // In a real app, you would generate a PDF here
    alert('PDF download functionality would be implemented here with a library like jsPDF or react-pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-4 sm:p-6 text-center">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Receipt Not Found</h2>
            <p className="text-gray-600 mb-4">The receipt you're looking for doesn't exist or has expired.</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to POS
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Successful</h1>
              <p className="text-gray-600">Receipt ID: {receiptData.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Payment Complete
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Receipt Display */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Receipt Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={receiptRef} className="receipt-container bg-white p-6 border rounded-lg">
                  {/* Store Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-amber-600 mb-1">{receiptData.store.name}</h2>
                    <p className="text-lg text-gray-600 mb-2">{receiptData.store.nameArabic}</p>
                    <p className="text-sm text-gray-600">{receiptData.store.address}</p>
                    <p className="text-sm text-gray-600">{receiptData.store.addressArabic}</p>
                    <p className="text-sm text-gray-600">Tel: {receiptData.store.phone}</p>
                    <p className="text-sm text-gray-600">VAT: {receiptData.store.vatNumber}</p>
                  </div>

                  <Separator className="my-4" />

                  {/* Receipt Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p><strong>Receipt:</strong> {receiptData.id}</p>
                      <p><strong>Date:</strong> {new Date(receiptData.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {new Date(receiptData.date).toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <p><strong>Cashier:</strong> {receiptData.cashier}</p>
                      <p><strong>Terminal:</strong> {receiptData.terminal}</p>
                      <p><strong>Payment:</strong> {receiptData.payment.method.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  {receiptData.customer && (
                    <>
                      <Separator className="my-4" />
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Customer Information
                        </h4>
                        <p className="text-sm">{receiptData.customer.name}</p>
                        <p className="text-sm text-gray-600">{receiptData.customer.nameArabic}</p>
                        <p className="text-sm">{receiptData.customer.phone}</p>
                        <div className="flex items-center mt-1">
                          <Badge className={`text-xs ${
                            receiptData.customer.type === 'VIP' ? 'bg-purple-100 text-purple-800' :
                            receiptData.customer.type === 'Premium' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {receiptData.customer.type}
                          </Badge>
                          <span className="text-xs text-gray-500 ml-2 flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {receiptData.customer.loyaltyPoints} pts
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  <Separator className="my-4" />

                  {/* Items */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-3">Items Purchased</h4>
                    <div className="space-y-2">
                      {receiptData.items.map((item: any, index: number) => (
                        <div key={index} className="border-b border-dashed pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-gray-600">{item.nameArabic}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} {item.unit} × AED {item.unitPrice.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">AED {item.totalPrice.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>AED {receiptData.payment.subtotal.toFixed(2)}</span>
                    </div>
                    {receiptData.payment.customerDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>{receiptData.customer.type} Discount:</span>
                        <span>-AED {receiptData.payment.customerDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {receiptData.payment.customDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Additional Discount:</span>
                        <span>-AED {receiptData.payment.customDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>VAT (5%):</span>
                      <span>AED {receiptData.payment.vatAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-amber-600">AED {receiptData.payment.total.toFixed(2)}</span>
                    </div>

                    {receiptData.payment.method === 'cash' && (
                      <>
                        <div className="flex justify-between">
                          <span>Cash Received:</span>
                          <span>AED {receiptData.payment.cashReceived.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Change:</span>
                          <span>AED {receiptData.payment.change.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Footer */}
                  <div className="text-center text-xs text-gray-600">
                    <p className="mb-2">Thank you for shopping with us!</p>
                    <p className="mb-1">شكراً لتسوقكم معنا</p>
                    <p>For inquiries: {receiptData.store.email}</p>
                    <p className="mt-2">Follow us for exclusive offers</p>
                    <div className="flex justify-center items-center mt-2">
                      <QrCode className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Receipt
                </CardTitle>
                <CardDescription>
                  Print or share this receipt with the customer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handlePrint} className="w-full" variant="default">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>

                <Button onClick={handleEmailShare} className="w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send via Email
                </Button>

                <Button onClick={handleWhatsAppShare} className="w-full" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Share via WhatsApp
                </Button>

                <Button onClick={handleDownloadPDF} className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>

                <Button onClick={handleCopyLink} className="w-full" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <Badge variant="outline">
                      {receiptData.payment.method.charAt(0).toUpperCase() + receiptData.payment.method.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="font-bold text-amber-600">AED {receiptData.payment.total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date & Time:</span>
                    <span className="text-sm">{new Date(receiptData.date)?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info Card */}
            {receiptData.customer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{receiptData.customer.name}</p>
                    <p className="text-sm text-gray-600">{receiptData.customer.nameArabic}</p>
                    <p className="text-sm flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {receiptData.customer.phone}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${
                        receiptData.customer.type === 'VIP' ? 'bg-purple-100 text-purple-800' :
                        receiptData.customer.type === 'Premium' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {receiptData.customer.type}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {receiptData.customer.loyaltyPoints} pts
                      </span>
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
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
      <ReceiptPageContent />
    </Suspense>
  );
}