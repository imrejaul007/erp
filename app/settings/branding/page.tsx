'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Palette, Building2, Image, FileText, Settings2, Globe, Languages,
  ArrowLeft} from 'lucide-react';
import { autoTranslate } from '@/lib/translate';

interface BrandingData {
  id?: string;
  companyName: string;
  companyNameAr?: string;
  tagline?: string;
  taglineAr?: string;
  logoUrl?: string;
  logoWhiteUrl?: string;
  faviconUrl?: string;
  loginBgUrl?: string;
  primaryColor: string;
  primaryHover: string;
  accentColor: string;
  bgLight: string;
  bgDark: string;
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  fontFamily: string;
  headingFont: string;
  fontSize: string;
  sidebarStyle: string;
  headerStyle: string;
  borderRadius: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  address?: string;
  city?: string;
  country: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  vatNumber?: string;
  tradeNumber?: string;
  licenseNumber?: string;
  invoicePrefix: string;
  receiptPrefix: string;
  orderPrefix: string;
  invoiceFooter?: string;
  invoiceFooterAr?: string;
  invoiceNotes?: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  currencySymbol: string;
  currencyPosition: string;
  decimalPlaces: number;
  showWhatsapp: boolean;
  showSocial: boolean;
  showVatNumber: boolean;
  showCompanyInfo: boolean;
  customCss?: string;
}

export default function BrandingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const [branding, setBranding] = useState<BrandingData>({
    companyName: 'Oud & Perfume ERP',
    primaryColor: '#d97706',
    primaryHover: '#b45309',
    accentColor: '#92400e',
    bgLight: '#fffbeb',
    bgDark: '#1f2937',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textLight: '#ffffff',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6',
    fontFamily: 'Inter',
    headingFont: 'Inter',
    fontSize: 'medium',
    sidebarStyle: 'light',
    headerStyle: 'light',
    borderRadius: 'medium',
    country: 'UAE',
    invoicePrefix: 'INV',
    receiptPrefix: 'RCP',
    orderPrefix: 'ORD',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'AED',
    currencySymbol: 'AED',
    currencyPosition: 'before',
    decimalPlaces: 2,
    showWhatsapp: true,
    showSocial: true,
    showVatNumber: true,
    showCompanyInfo: true,
  });

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      const response = await fetch('/api/branding');
      const result = await response.json();

      if (result.success && result.data) {
        setBranding(result.data);
      }
    } catch (error) {
      console.error('Error fetching branding:', error);
      toast({
        title: 'Error',
        description: 'Failed to load branding settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/branding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Branding settings saved successfully',
        });
        // Reload to apply changes
        window.location.reload();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving branding:', error);
      toast({
        title: 'Error',
        description: 'Failed to save branding settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof BrandingData, value: any) => {
    setBranding((prev) => ({ ...prev, [field]: value }));
  };

  const handleAutoTranslate = async (sourceField: keyof BrandingData, targetField: keyof BrandingData) => {
    const sourceValue = branding[sourceField];

    if (!sourceValue || typeof sourceValue !== 'string') {
      toast({
        title: 'Error',
        description: 'Please enter text in the English field first',
        variant: 'destructive',
      });
      return;
    }

    setTranslating(targetField as string);
    try {
      const translated = await autoTranslate(sourceValue);
      handleChange(targetField, translated);
      toast({
        title: 'Success',
        description: 'Text translated successfully',
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to translate text. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setTranslating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold">Branding & Customization</h1>
          <p className="text-muted-foreground">Customize your ERP's look and feel</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="company" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company">
            <Building2 className="h-4 w-4 mr-2" />
            Company
          </TabsTrigger>
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="logos">
            <Image className="h-4 w-4 mr-2" />
            Logos
          </TabsTrigger>
          <TabsTrigger value="invoice">
            <FileText className="h-4 w-4 mr-2" />
            Invoice
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings2 className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="social">
            <Globe className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
        </TabsList>

        {/* Company Info Tab */}
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic company details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (English)</Label>
                  <Input
                    id="companyName"
                    value={branding.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyNameAr" className="flex items-center justify-between">
                    <span>Company Name (Arabic)</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAutoTranslate('companyName', 'companyNameAr')}
                      disabled={translating === 'companyNameAr'}
                      className="h-6 px-2 text-xs"
                    >
                      {translating === 'companyNameAr' ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Languages className="h-3 w-3 mr-1" />
                          Auto
                        </>
                      )}
                    </Button>
                  </Label>
                  <Input
                    id="companyNameAr"
                    value={branding.companyNameAr || ''}
                    onChange={(e) => handleChange('companyNameAr', e.target.value)}
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline (English)</Label>
                  <Input
                    id="tagline"
                    value={branding.tagline || ''}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taglineAr" className="flex items-center justify-between">
                    <span>Tagline (Arabic)</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAutoTranslate('tagline', 'taglineAr')}
                      disabled={translating === 'taglineAr'}
                      className="h-6 px-2 text-xs"
                    >
                      {translating === 'taglineAr' ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Languages className="h-3 w-3 mr-1" />
                          Auto
                        </>
                      )}
                    </Button>
                  </Label>
                  <Input
                    id="taglineAr"
                    value={branding.taglineAr || ''}
                    onChange={(e) => handleChange('taglineAr', e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={branding.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={branding.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={branding.whatsapp || ''}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={branding.website || ''}
                    onChange={(e) => handleChange('website', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input
                    id="vatNumber"
                    value={branding.vatNumber || ''}
                    onChange={(e) => handleChange('vatNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tradeNumber">Trade License</Label>
                  <Input
                    id="tradeNumber"
                    value={branding.tradeNumber || ''}
                    onChange={(e) => handleChange('tradeNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={branding.licenseNumber || ''}
                    onChange={(e) => handleChange('licenseNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={branding.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={branding.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={branding.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Customize your brand colors and theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Primary Colors</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={branding.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        value={branding.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryHover">Primary Hover</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryHover"
                        type="color"
                        value={branding.primaryHover}
                        onChange={(e) => handleChange('primaryHover', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        value={branding.primaryHover}
                        onChange={(e) => handleChange('primaryHover', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={branding.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        value={branding.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Background Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bgLight">Light Background</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bgLight"
                        type="color"
                        value={branding.bgLight}
                        onChange={(e) => handleChange('bgLight', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        value={branding.bgLight}
                        onChange={(e) => handleChange('bgLight', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bgDark">Dark Background</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bgDark"
                        type="color"
                        value={branding.bgDark}
                        onChange={(e) => handleChange('bgDark', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        value={branding.bgDark}
                        onChange={(e) => handleChange('bgDark', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Status Colors</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="successColor">Success</Label>
                    <div className="flex gap-2">
                      <Input
                        id="successColor"
                        type="color"
                        value={branding.successColor}
                        onChange={(e) => handleChange('successColor', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        value={branding.successColor}
                        onChange={(e) => handleChange('successColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warningColor">Warning</Label>
                    <div className="flex gap-2">
                      <Input
                        id="warningColor"
                        type="color"
                        value={branding.warningColor}
                        onChange={(e) => handleChange('warningColor', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        value={branding.warningColor}
                        onChange={(e) => handleChange('warningColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="errorColor">Error</Label>
                    <div className="flex gap-2">
                      <Input
                        id="errorColor"
                        type="color"
                        value={branding.errorColor}
                        onChange={(e) => handleChange('errorColor', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        value={branding.errorColor}
                        onChange={(e) => handleChange('errorColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="infoColor">Info</Label>
                    <div className="flex gap-2">
                      <Input
                        id="infoColor"
                        type="color"
                        value={branding.infoColor}
                        onChange={(e) => handleChange('infoColor', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        value={branding.infoColor}
                        onChange={(e) => handleChange('infoColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Layout Style</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sidebarStyle">Sidebar Style</Label>
                    <Select value={branding.sidebarStyle} onValueChange={(value) => handleChange('sidebarStyle', value)}>
                      <SelectTrigger id="sidebarStyle">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="colored">Colored</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headerStyle">Header Style</Label>
                    <Select value={branding.headerStyle} onValueChange={(value) => handleChange('headerStyle', value)}>
                      <SelectTrigger id="headerStyle">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="colored">Colored</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="borderRadius">Border Radius</Label>
                    <Select value={branding.borderRadius} onValueChange={(value) => handleChange('borderRadius', value)}>
                      <SelectTrigger id="borderRadius">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logos Tab */}
        <TabsContent value="logos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logos & Images</CardTitle>
              <CardDescription>Upload your logos and brand images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Main Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={branding.logoUrl || ''}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  {branding.logoUrl && (
                    <div className="mt-2 p-4 border rounded-md bg-white">
                      <img src={branding.logoUrl} alt="Logo" className="h-16 object-contain" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoWhiteUrl">White Logo URL (for dark backgrounds)</Label>
                  <Input
                    id="logoWhiteUrl"
                    value={branding.logoWhiteUrl || ''}
                    onChange={(e) => handleChange('logoWhiteUrl', e.target.value)}
                    placeholder="https://example.com/logo-white.png"
                  />
                  {branding.logoWhiteUrl && (
                    <div className="mt-2 p-4 border rounded-md bg-gray-800">
                      <img src={branding.logoWhiteUrl} alt="White Logo" className="h-16 object-contain" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <Input
                    id="faviconUrl"
                    value={branding.faviconUrl || ''}
                    onChange={(e) => handleChange('faviconUrl', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginBgUrl">Login Background URL</Label>
                  <Input
                    id="loginBgUrl"
                    value={branding.loginBgUrl || ''}
                    onChange={(e) => handleChange('loginBgUrl', e.target.value)}
                    placeholder="https://example.com/login-bg.jpg"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: Upload your images to a CDN or cloud storage (e.g., Cloudinary) and paste the URLs here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice Tab */}
        <TabsContent value="invoice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice & Receipt Settings</CardTitle>
              <CardDescription>Customize invoice and receipt templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={branding.invoicePrefix}
                    onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiptPrefix">Receipt Prefix</Label>
                  <Input
                    id="receiptPrefix"
                    value={branding.receiptPrefix}
                    onChange={(e) => handleChange('receiptPrefix', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderPrefix">Order Prefix</Label>
                  <Input
                    id="orderPrefix"
                    value={branding.orderPrefix}
                    onChange={(e) => handleChange('orderPrefix', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceFooter">Invoice Footer (English)</Label>
                <Textarea
                  id="invoiceFooter"
                  value={branding.invoiceFooter || ''}
                  onChange={(e) => handleChange('invoiceFooter', e.target.value)}
                  rows={3}
                  placeholder="Thank you for your business!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceFooterAr" className="flex items-center justify-between">
                  <span>Invoice Footer (Arabic)</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAutoTranslate('invoiceFooter', 'invoiceFooterAr')}
                    disabled={translating === 'invoiceFooterAr'}
                    className="h-6 px-2 text-xs"
                  >
                    {translating === 'invoiceFooterAr' ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Languages className="h-3 w-3 mr-1" />
                        Auto
                      </>
                    )}
                  </Button>
                </Label>
                <Textarea
                  id="invoiceFooterAr"
                  value={branding.invoiceFooterAr || ''}
                  onChange={(e) => handleChange('invoiceFooterAr', e.target.value)}
                  rows={3}
                  dir="rtl"
                  placeholder="شكرا لك على عملك!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNotes">Invoice Notes</Label>
                <Textarea
                  id="invoiceNotes"
                  value={branding.invoiceNotes || ''}
                  onChange={(e) => handleChange('invoiceNotes', e.target.value)}
                  rows={3}
                  placeholder="Terms and conditions..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system defaults and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={branding.dateFormat} onValueChange={(value) => handleChange('dateFormat', value)}>
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select value={branding.timeFormat} onValueChange={(value) => handleChange('timeFormat', value)}>
                    <SelectTrigger id="timeFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 Hour</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={branding.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currencySymbol">Currency Symbol</Label>
                  <Input
                    id="currencySymbol"
                    value={branding.currencySymbol}
                    onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decimalPlaces">Decimal Places</Label>
                  <Input
                    id="decimalPlaces"
                    type="number"
                    value={branding.decimalPlaces}
                    onChange={(e) => handleChange('decimalPlaces', parseInt(e.target.value))}
                    min={0}
                    max={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select value={branding.fontFamily} onValueChange={(value) => handleChange('fontFamily', value)}>
                    <SelectTrigger id="fontFamily">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select value={branding.fontSize} onValueChange={(value) => handleChange('fontSize', value)}>
                    <SelectTrigger id="fontSize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Display Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showWhatsapp">Show WhatsApp</Label>
                    <Switch
                      id="showWhatsapp"
                      checked={branding.showWhatsapp}
                      onCheckedChange={(checked) => handleChange('showWhatsapp', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showSocial">Show Social Media Links</Label>
                    <Switch
                      id="showSocial"
                      checked={branding.showSocial}
                      onCheckedChange={(checked) => handleChange('showSocial', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showVatNumber">Show VAT Number</Label>
                    <Switch
                      id="showVatNumber"
                      checked={branding.showVatNumber}
                      onCheckedChange={(checked) => handleChange('showVatNumber', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showCompanyInfo">Show Company Info</Label>
                    <Switch
                      id="showCompanyInfo"
                      checked={branding.showCompanyInfo}
                      onCheckedChange={(checked) => handleChange('showCompanyInfo', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  value={branding.customCss || ''}
                  onChange={(e) => handleChange('customCss', e.target.value)}
                  rows={6}
                  placeholder=".my-custom-class { color: red; }"
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Advanced: Add custom CSS to override default styles. Use with caution.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Add your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl">Facebook</Label>
                  <Input
                    id="facebookUrl"
                    value={branding.facebookUrl || ''}
                    onChange={(e) => handleChange('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">Instagram</Label>
                  <Input
                    id="instagramUrl"
                    value={branding.instagramUrl || ''}
                    onChange={(e) => handleChange('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterUrl">Twitter / X</Label>
                  <Input
                    id="twitterUrl"
                    value={branding.twitterUrl || ''}
                    onChange={(e) => handleChange('twitterUrl', e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn</Label>
                  <Input
                    id="linkedinUrl"
                    value={branding.linkedinUrl || ''}
                    onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
