'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Settings, Printer, Receipt, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function POSSettingsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('general');

  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'Oud Palace - Dubai Mall',
    terminalId: 'POS-MAIN',
    currency: 'AED',
    taxRate: '5',
    roundingMode: 'nearest',
    defaultPayment: 'cash',
  });

  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    showArabic: true,
    showBarcode: true,
    showVAT: true,
    footerMessage: 'Thank you for your business!',
    footerMessageArabic: 'شكراً لتعاملكم معنا',
    printAutomatically: true,
    emailReceipt: false,
    smsReceipt: false,
  });

  const [printerSettings, setPrinterSettings] = useState({
    printerName: 'Thermal Printer TP-80',
    paperSize: '80mm',
    printSpeed: 'fast',
    testPrint: false,
  });

  const [discountSettings, setDiscountSettings] = useState({
    allowDiscount: true,
    maxDiscountPercent: '20',
    requireManagerApproval: true,
    approvalThreshold: '100',
  });

  const handleSaveSettings = (settingType: string) => {
    toast.success(`${settingType} settings saved successfully`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-amber-600" />
            POS Settings
          </h1>
          <p className="text-muted-foreground">Configure point of sale system preferences</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="receipt">Receipt</TabsTrigger>
          <TabsTrigger value="printer">Printer</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic POS configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={generalSettings.storeName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, storeName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terminalId">Terminal ID</Label>
                  <Input
                    id="terminalId"
                    value={generalSettings.terminalId}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, terminalId: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={generalSettings.taxRate}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, taxRate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roundingMode">Price Rounding</Label>
                  <Select
                    value={generalSettings.roundingMode}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, roundingMode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nearest">Nearest (0.05)</SelectItem>
                      <SelectItem value="up">Round Up</SelectItem>
                      <SelectItem value="down">Round Down</SelectItem>
                      <SelectItem value="none">No Rounding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultPayment">Default Payment Method</Label>
                  <Select
                    value={generalSettings.defaultPayment}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, defaultPayment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="digital">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('General')} className="bg-amber-600 hover:bg-amber-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipt Settings */}
        <TabsContent value="receipt">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Receipt Configuration
              </CardTitle>
              <CardDescription>Customize receipt appearance and content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="showLogo">Show Company Logo</Label>
                    <div className="text-sm text-gray-500">Display logo on printed receipts</div>
                  </div>
                  <Switch
                    id="showLogo"
                    checked={receiptSettings.showLogo}
                    onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, showLogo: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="showArabic">Show Arabic Text</Label>
                    <div className="text-sm text-gray-500">Include Arabic translations</div>
                  </div>
                  <Switch
                    id="showArabic"
                    checked={receiptSettings.showArabic}
                    onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, showArabic: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="showBarcode">Show Barcode</Label>
                    <div className="text-sm text-gray-500">Print receipt barcode</div>
                  </div>
                  <Switch
                    id="showBarcode"
                    checked={receiptSettings.showBarcode}
                    onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, showBarcode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="showVAT">Show VAT Breakdown</Label>
                    <div className="text-sm text-gray-500">Display VAT amount separately</div>
                  </div>
                  <Switch
                    id="showVAT"
                    checked={receiptSettings.showVAT}
                    onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, showVAT: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="printAutomatically">Print Automatically</Label>
                    <div className="text-sm text-gray-500">Auto-print after payment</div>
                  </div>
                  <Switch
                    id="printAutomatically"
                    checked={receiptSettings.printAutomatically}
                    onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, printAutomatically: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailReceipt">Email Receipt Option</Label>
                    <div className="text-sm text-gray-500">Allow email receipts</div>
                  </div>
                  <Switch
                    id="emailReceipt"
                    checked={receiptSettings.emailReceipt}
                    onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, emailReceipt: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsReceipt">SMS Receipt Option</Label>
                    <div className="text-sm text-gray-500">Allow SMS receipts</div>
                  </div>
                  <Switch
                    id="smsReceipt"
                    checked={receiptSettings.smsReceipt}
                    onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, smsReceipt: checked })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="footerMessage">Footer Message (English)</Label>
                  <Input
                    id="footerMessage"
                    value={receiptSettings.footerMessage}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, footerMessage: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerMessageArabic">Footer Message (Arabic)</Label>
                  <Input
                    id="footerMessageArabic"
                    value={receiptSettings.footerMessageArabic}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, footerMessageArabic: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Receipt')} className="bg-amber-600 hover:bg-amber-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Printer Settings */}
        <TabsContent value="printer">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Printer Configuration
              </CardTitle>
              <CardDescription>Configure receipt printer settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="printerName">Printer Name</Label>
                  <Input
                    id="printerName"
                    value={printerSettings.printerName}
                    onChange={(e) => setPrinterSettings({ ...printerSettings, printerName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paperSize">Paper Size</Label>
                  <Select
                    value={printerSettings.paperSize}
                    onValueChange={(value) => setPrinterSettings({ ...printerSettings, paperSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80mm">80mm (Standard)</SelectItem>
                      <SelectItem value="58mm">58mm (Compact)</SelectItem>
                      <SelectItem value="A4">A4 (Full Page)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printSpeed">Print Speed</Label>
                  <Select
                    value={printerSettings.printSpeed}
                    onValueChange={(value) => setPrinterSettings({ ...printerSettings, printSpeed: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">Fast</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="slow">Slow (High Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => handleSaveSettings('Printer')} className="bg-amber-600 hover:bg-amber-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => toast.success('Test receipt sent to printer')}>
                  <Printer className="h-4 w-4 mr-2" />
                  Test Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discount Settings */}
        <TabsContent value="discounts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Discount Settings
              </CardTitle>
              <CardDescription>Configure discount rules and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowDiscount">Allow Discounts</Label>
                    <div className="text-sm text-gray-500">Enable discount feature in POS</div>
                  </div>
                  <Switch
                    id="allowDiscount"
                    checked={discountSettings.allowDiscount}
                    onCheckedChange={(checked) => setDiscountSettings({ ...discountSettings, allowDiscount: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDiscountPercent">Maximum Discount (%)</Label>
                  <Input
                    id="maxDiscountPercent"
                    type="number"
                    value={discountSettings.maxDiscountPercent}
                    onChange={(e) => setDiscountSettings({ ...discountSettings, maxDiscountPercent: e.target.value })}
                    disabled={!discountSettings.allowDiscount}
                  />
                  <div className="text-sm text-gray-500">
                    Maximum discount percentage allowed without approval
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireManagerApproval">Require Manager Approval</Label>
                    <div className="text-sm text-gray-500">For discounts above threshold</div>
                  </div>
                  <Switch
                    id="requireManagerApproval"
                    checked={discountSettings.requireManagerApproval}
                    onCheckedChange={(checked) => setDiscountSettings({ ...discountSettings, requireManagerApproval: checked })}
                    disabled={!discountSettings.allowDiscount}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvalThreshold">Approval Threshold (AED)</Label>
                  <Input
                    id="approvalThreshold"
                    type="number"
                    value={discountSettings.approvalThreshold}
                    onChange={(e) => setDiscountSettings({ ...discountSettings, approvalThreshold: e.target.value })}
                    disabled={!discountSettings.allowDiscount || !discountSettings.requireManagerApproval}
                  />
                  <div className="text-sm text-gray-500">
                    Discount amounts above this require manager approval
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Discount')} className="bg-amber-600 hover:bg-amber-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
