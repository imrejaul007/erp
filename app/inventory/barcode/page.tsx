'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QrCode, Barcode, Printer, Download, Search, Package, Tag, Grid3x3, Copy, Camera, Scan,
  ArrowLeft} from 'lucide-react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import dynamic from 'next/dynamic';

// Dynamically import scanner to avoid SSR issues
const Html5QrcodePlugin = dynamic(
  () => import('@/components/barcode/Html5QrcodePlugin'),
  { ssr: false }
);

export default function BarcodeGeneratorPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [barcodeType, setBarcodeType] = useState('qr');
  const [labelSize, setLabelSize] = useState('medium');
  const [includePrice, setIncludePrice] = useState(true);
  const [includeInfo, setIncludeInfo] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [barcodeDataUrl, setBarcodeDataUrl] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const barcodeCanvasRef = useRef<HTMLCanvasElement>(null);

  const products = [
    {
      id: 'INV001',
      name: 'Premium Cambodian Oud Chips',
      sku: 'OUD-CAM-PREM-001',
      barcode: '8901234567890',
      price: 'AED 85',
      category: 'Raw Materials',
    },
    {
      id: 'INV003',
      name: 'Royal Oud Perfume 50ml',
      sku: 'PERF-ROYAL-50ML',
      barcode: '8901234567891',
      price: 'AED 280',
      category: 'Finished Products',
    },
    {
      id: 'INV002',
      name: 'Rose Essential Oil',
      sku: 'ESS-ROSE-001',
      barcode: '8901234567892',
      price: 'AED 25',
      category: 'Raw Materials',
    },
  ];

  const labelSizes = {
    small: { width: '40mm', height: '25mm', name: 'Small (40x25mm)' },
    medium: { width: '50mm', height: '30mm', name: 'Medium (50x30mm)' },
    large: { width: '70mm', height: '50mm', name: 'Large (70x50mm)' },
    shelf: { width: '100mm', height: '40mm', name: 'Shelf Label (100x40mm)' },
  };

  // Generate QR code when product changes
  useEffect(() => {
    if (selectedProduct) {
      const productData = JSON.stringify({
        id: selectedProduct.id,
        sku: selectedProduct.sku,
        name: selectedProduct.name,
        price: selectedProduct.price,
      });

      // Generate QR Code
      QRCode.toDataURL(productData, {
        width: 400,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).then(url => {
        setQrCodeDataUrl(url);
      });

      // Generate Barcode
      if (barcodeCanvasRef.current) {
        try {
          JsBarcode(barcodeCanvasRef.current, selectedProduct.barcode, {
            format: 'EAN13',
            width: 2,
            height: 100,
            displayValue: true,
          });
          setBarcodeDataUrl(barcodeCanvasRef.current.toDataURL());
        } catch (e) {
          console.error('Invalid barcode format:', e);
        }
      }
    }
  }, [selectedProduct]);

  const handlePrint = () => {
    if (!selectedProduct) {
      alert('Please select a product first');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const size = labelSizes[labelSize as keyof typeof labelSizes];
    const codeImage = barcodeType === 'qr' ? qrCodeDataUrl : barcodeDataUrl;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Labels - ${selectedProduct.name}</title>
          <style>
            @page {
              size: ${size.width} ${size.height};
              margin: 2mm;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .label {
              width: ${size.width};
              height: ${size.height};
              border: 1px dashed #999;
              page-break-after: always;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 3mm;
              box-sizing: border-box;
            }
            .code-image {
              max-width: 90%;
              height: auto;
              margin: 2mm 0;
            }
            .product-info {
              text-align: center;
              margin-top: 2mm;
              width: 100%;
            }
            .product-name {
              font-size: ${labelSize === 'small' ? '7pt' : labelSize === 'medium' ? '9pt' : '11pt'};
              font-weight: bold;
              margin: 1mm 0;
              word-wrap: break-word;
            }
            .product-sku {
              font-size: ${labelSize === 'small' ? '6pt' : labelSize === 'medium' ? '7pt' : '8pt'};
              color: #666;
              margin: 0.5mm 0;
            }
            .product-price {
              font-size: ${labelSize === 'small' ? '8pt' : labelSize === 'medium' ? '10pt' : '12pt'};
              font-weight: bold;
              color: #000;
              margin-top: 1mm;
            }
            @media print {
              .label {
                border: none;
              }
            }
          </style>
        </head>
        <body>
          ${Array(quantity).fill(0).map(() => `
            <div class="label">
              <img src="${codeImage}" class="code-image" />
              ${includeInfo ? `
                <div class="product-info">
                  <div class="product-name">${selectedProduct.name}</div>
                  <div class="product-sku">${selectedProduct.sku}</div>
                  ${includePrice ? `<div class="product-price">${selectedProduct.price}</div>` : ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    if (!selectedProduct) {
      alert('Please select a product first');
      return;
    }

    const dataUrl = barcodeType === 'qr' ? qrCodeDataUrl : barcodeDataUrl;
    const link = document.createElement('a');
    link.download = `${selectedProduct.sku}_${barcodeType}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleScanSuccess = (decodedText: string) => {
    try {
      // Try to parse as JSON (QR code)
      const data = JSON.parse(decodedText);
      const product = products.find(p => p.id === data.id || p.sku === data.sku);
      if (product) {
        setSelectedProduct(product);
        setShowScanner(false);
        alert(`Product found: ${product.name}`);
      }
    } catch {
      // Try to find by barcode number
      const product = products.find(p => p.barcode === decodedText);
      if (product) {
        setSelectedProduct(product);
        setShowScanner(false);
        alert(`Product found: ${product.name}`);
      } else {
        alert(`Scanned: ${decodedText}\nProduct not found in inventory`);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold">Barcode & QR Code System</h1>
          <p className="text-muted-foreground">Generate, print, and scan product labels</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/inventory')}>
          <Package className="mr-2 h-4 w-4" />
          Back to Inventory
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">
            <QrCode className="mr-2 h-4 w-4" />
            Generate & Print
          </TabsTrigger>
          <TabsTrigger value="scan">
            <Camera className="mr-2 h-4 w-4" />
            Scan Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Label Configuration</CardTitle>
                  <CardDescription>Customize your label settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Code Type</Label>
                    <Tabs value={barcodeType} onValueChange={setBarcodeType}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="qr">
                          <QrCode className="h-4 w-4 mr-2" />
                          QR Code
                        </TabsTrigger>
                        <TabsTrigger value="barcode">
                          <Barcode className="h-4 w-4 mr-2" />
                          Barcode
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <p className="text-xs text-muted-foreground">
                      {barcodeType === 'qr'
                        ? 'QR codes can store product data and be scanned by any smartphone'
                        : 'Standard EAN-13 barcode compatible with all retail scanners'
                      }
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Label Size</Label>
                    <Select value={labelSize} onValueChange={setLabelSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(labelSizes).map(([key, size]) => (
                          <SelectItem key={key} value={key}>{size.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Print Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Label Content</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeInfo"
                        checked={includeInfo}
                        onChange={(e) => setIncludeInfo(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="includeInfo" className="text-sm cursor-pointer">
                        Include product information
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includePrice"
                        checked={includePrice}
                        onChange={(e) => setIncludePrice(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="includePrice" className="text-sm cursor-pointer">
                        Include price
                      </label>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button className="w-full" onClick={handlePrint} disabled={!selectedProduct}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Labels
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleDownload} disabled={!selectedProduct}>
                      <Download className="mr-2 h-4 w-4" />
                      Download as PNG
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {selectedProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Selected Product</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="font-medium">{selectedProduct.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedProduct.sku}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedProduct.category}</Badge>
                      <Badge variant="outline">{selectedProduct.price}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Product Selection & Preview */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Product</CardTitle>
                  <CardDescription>Choose a product to generate scannable labels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search products by name or SKU..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className={`cursor-pointer transition-all ${
                          selectedProduct?.id === product.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{product.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {product.sku}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {product.category}
                                </Badge>
                              </div>
                              <p className="text-sm font-semibold text-green-600">{product.price}</p>
                            </div>
                            {barcodeType === 'qr' ? (
                              <QrCode className="h-10 w-10 text-gray-400" />
                            ) : (
                              <Barcode className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    Real scannable {barcodeType === 'qr' ? 'QR code' : 'barcode'} - {labelSizes[labelSize as keyof typeof labelSizes].name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedProduct ? (
                    <div className="flex justify-center p-8">
                      <div
                        className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center bg-white"
                        style={{
                          width: labelSizes[labelSize as keyof typeof labelSizes].width,
                          minHeight: labelSizes[labelSize as keyof typeof labelSizes].height,
                        }}
                      >
                        <div className="mb-3">
                          {barcodeType === 'qr' && qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt="QR Code" className={
                              labelSize === 'small' ? 'w-20 h-20' :
                              labelSize === 'medium' ? 'w-24 h-24' :
                              'w-32 h-32'
                            } />
                          ) : barcodeDataUrl ? (
                            <img src={barcodeDataUrl} alt="Barcode" className="max-w-full" />
                          ) : null}
                        </div>
                        {includeInfo && (
                          <div className="text-center space-y-1">
                            <p className={`font-semibold ${
                              labelSize === 'small' ? 'text-xs' :
                              labelSize === 'medium' ? 'text-sm' :
                              'text-base'
                            }`}>
                              {selectedProduct.name}
                            </p>
                            <p className={`text-gray-600 ${
                              labelSize === 'small' ? 'text-[10px]' :
                              labelSize === 'medium' ? 'text-xs' :
                              'text-sm'
                            }`}>
                              {selectedProduct.sku}
                            </p>
                            {includePrice && (
                              <p className={`font-bold text-green-600 ${
                                labelSize === 'small' ? 'text-xs' :
                                labelSize === 'medium' ? 'text-sm' :
                                'text-lg'
                              }`}>
                                {selectedProduct.price}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Tag className="h-16 w-16 mb-4" />
                      <p>Select a product to preview label</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Barcode or QR Code</CardTitle>
              <CardDescription>Use your device camera or barcode scanner to scan product codes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Compatible Devices:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Mobile phone cameras (iOS/Android)</li>
                  <li>✓ Webcams and laptop cameras</li>
                  <li>✓ USB barcode scanners</li>
                  <li>✓ Bluetooth barcode scanners</li>
                </ul>
              </div>

              {showScanner ? (
                <div className="space-y-4">
                  <Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={handleScanSuccess}
                  />
                  <Button variant="outline" className="w-full" onClick={() => setShowScanner(false)}>
                    Stop Scanner
                  </Button>
                </div>
              ) : (
                <Button className="w-full" size="lg" onClick={() => setShowScanner(true)}>
                  <Camera className="mr-2 h-5 w-5" />
                  Start Camera Scanner
                </Button>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Manual Entry</Label>
                <div className="flex gap-2">
                  <Input placeholder="Enter barcode or SKU number..." />
                  <Button>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedProduct && (
            <Card>
              <CardHeader>
                <CardTitle>Scanned Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <Package className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProduct.sku}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{selectedProduct.category}</Badge>
                      <Badge variant="outline" className="text-green-600">{selectedProduct.price}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => router.push(`/inventory/comprehensive?item=${selectedProduct.id}`)}>
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab('generate')}>
                      Print Label
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Hidden canvas for barcode generation */}
      <canvas ref={barcodeCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}
