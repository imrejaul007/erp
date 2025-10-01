'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  CreditCard,
  Star,
  Heart,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  UserPlus
} from 'lucide-react';
import { CustomerType, CustomerSegment, UAE_EMIRATES } from '@/types/crm';

interface CustomerFormData {
  customerType: CustomerType;
  segment: CustomerSegment;
  name: string;
  nameArabic: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  addressArabic: string;
  city: string;
  emirate: string;
  area: string;
  postalCode: string;
  country: string;
  companyName: string;
  tradeLicense: string;
  taxId: string;
  vatNumber: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  language: 'en' | 'ar';
  creditLimit: number;

  // Fragrance Preferences
  fragranceTypes: string[];
  preferredBrands: string[];
  priceRangeMin: number;
  priceRangeMax: number;
  occasions: string[];
  seasons: string[];
  notes: string;

  // Communication Preferences
  emailMarketing: boolean;
  smsMarketing: boolean;
  whatsappMarketing: boolean;
  birthdayOffers: boolean;
  restockAlerts: boolean;
}

const FRAGRANCE_TYPES = [
  'Oud', 'Attar', 'Perfume Oil', 'Eau de Parfum', 'Eau de Toilette',
  'Bakhoor', 'Musk', 'Amber', 'Rose', 'Sandalwood'
];

const LUXURY_BRANDS = [
  'Creed', 'Tom Ford', 'Maison Francis Kurkdjian', 'Amouage', 'Clive Christian',
  'By Kilian', 'Montale', 'Mancera', 'Ajmal', 'Rasasi', 'Swiss Arabian'
];

const OCCASIONS = [
  'Daily Wear', 'Office/Work', 'Evening/Night', 'Special Events',
  'Wedding/Formal', 'Religious/Cultural', 'Casual/Weekend', 'Travel'
];

const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter', 'All Seasons'];

const NATIONALITIES = [
  'Emirati', 'Saudi Arabian', 'Kuwaiti', 'Qatari', 'Omani', 'Bahraini',
  'Indian', 'Pakistani', 'Bangladeshi', 'Egyptian', 'Jordanian', 'Lebanese',
  'Syrian', 'Palestinian', 'British', 'American', 'Canadian', 'Australian',
  'French', 'German', 'Italian', 'Spanish', 'Other'
];

export default function AddCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState<CustomerFormData>({
    customerType: CustomerType.INDIVIDUAL,
    segment: CustomerSegment.REGULAR,
    name: '',
    nameArabic: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    addressArabic: '',
    city: '',
    emirate: '',
    area: '',
    postalCode: '',
    country: 'United Arab Emirates',
    companyName: '',
    tradeLicense: '',
    taxId: '',
    vatNumber: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    language: 'en',
    creditLimit: 0,
    fragranceTypes: [],
    preferredBrands: [],
    priceRangeMin: 0,
    priceRangeMax: 10000,
    occasions: [],
    seasons: [],
    notes: '',
    emailMarketing: true,
    smsMarketing: true,
    whatsappMarketing: true,
    birthdayOffers: true,
    restockAlerts: true,
  });

  const handleInputChange = (field: keyof CustomerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayToggle = (field: keyof CustomerFormData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    handleInputChange(field, newArray);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.customerType === CustomerType.CORPORATE) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required for corporate customers';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/crm/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const customer = await response.json();
        router.push(`/crm/customers/${customer.id}`);
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || 'Failed to create customer' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Customer</h1>
            <p className="text-gray-600 mt-1">Create a comprehensive customer profile</p>
          </div>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          UAE Market Focused
        </Badge>
      </div>

      {/* Error Alert */}
      {errors.submit && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{errors.submit}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Business Details
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Communication
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Type & Segment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerType">Customer Type *</Label>
                  <Select
                    value={formData.customerType}
                    onValueChange={(value) => handleInputChange('customerType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CustomerType.INDIVIDUAL}>Individual</SelectItem>
                      <SelectItem value={CustomerType.CORPORATE}>Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segment">Customer Segment</Label>
                  <Select
                    value={formData.segment}
                    onValueChange={(value) => handleInputChange('segment', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CustomerSegment.REGULAR}>Regular</SelectItem>
                      <SelectItem value={CustomerSegment.VIP}>VIP</SelectItem>
                      <SelectItem value={CustomerSegment.WHOLESALE}>Wholesale</SelectItem>
                      <SelectItem value={CustomerSegment.EXPORT}>Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter customer's full name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameArabic">Name in Arabic</Label>
                  <Input
                    id="nameArabic"
                    value={formData.nameArabic}
                    onChange={(e) => handleInputChange('nameArabic', e.target.value)}
                    placeholder="الاسم باللغة العربية"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+971 50 123 4567"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                    placeholder="+971 4 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="customer@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Personal Details */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => handleInputChange('nationality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {NATIONALITIES.map((nationality) => (
                        <SelectItem key={nationality} value={nationality}>
                          {nationality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => handleInputChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit (AED)</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => handleInputChange('creditLimit', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Details Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Business & Address Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Corporate Information */}
              {formData.customerType === CustomerType.CORPORATE && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Enter company name"
                      className={errors.companyName ? 'border-red-500' : ''}
                    />
                    {errors.companyName && (
                      <p className="text-sm text-red-600">{errors.companyName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="tradeLicense">Trade License</Label>
                      <Input
                        id="tradeLicense"
                        value={formData.tradeLicense}
                        onChange={(e) => handleInputChange('tradeLicense', e.target.value)}
                        placeholder="TL-123456"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        placeholder="TAX-123456"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vatNumber">VAT Number</Label>
                      <Input
                        id="vatNumber"
                        value={formData.vatNumber}
                        onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                        placeholder="100123456700003"
                      />
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Street address, building, apartment"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressArabic">Address in Arabic</Label>
                    <Textarea
                      id="addressArabic"
                      value={formData.addressArabic}
                      onChange={(e) => handleInputChange('addressArabic', e.target.value)}
                      placeholder="العنوان باللغة العربية"
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emirate">Emirate</Label>
                    <Select
                      value={formData.emirate}
                      onValueChange={(value) => handleInputChange('emirate', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select emirate" />
                      </SelectTrigger>
                      <SelectContent>
                        {UAE_EMIRATES.map((emirate) => (
                          <SelectItem key={emirate} value={emirate}>
                            {emirate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="Area/District"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="123456"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="United Arab Emirates"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Fragrance Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fragrance Types */}
              <div className="space-y-3">
                <Label>Preferred Fragrance Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {FRAGRANCE_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`fragrance-${type}`}
                        checked={formData.fragranceTypes.includes(type)}
                        onCheckedChange={() => handleArrayToggle('fragranceTypes', type)}
                      />
                      <Label htmlFor={`fragrance-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred Brands */}
              <div className="space-y-3">
                <Label>Preferred Brands</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {LUXURY_BRANDS.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={formData.preferredBrands.includes(brand)}
                        onCheckedChange={() => handleArrayToggle('preferredBrands', brand)}
                      />
                      <Label htmlFor={`brand-${brand}`} className="text-sm">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label>Price Range (AED)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="priceRangeMin">Minimum</Label>
                    <Input
                      id="priceRangeMin"
                      type="number"
                      value={formData.priceRangeMin}
                      onChange={(e) => handleInputChange('priceRangeMin', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceRangeMax">Maximum</Label>
                    <Input
                      id="priceRangeMax"
                      type="number"
                      value={formData.priceRangeMax}
                      onChange={(e) => handleInputChange('priceRangeMax', Number(e.target.value))}
                      placeholder="10000"
                    />
                  </div>
                </div>
              </div>

              {/* Occasions */}
              <div className="space-y-3">
                <Label>Preferred Occasions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {OCCASIONS.map((occasion) => (
                    <div key={occasion} className="flex items-center space-x-2">
                      <Checkbox
                        id={`occasion-${occasion}`}
                        checked={formData.occasions.includes(occasion)}
                        onCheckedChange={() => handleArrayToggle('occasions', occasion)}
                      />
                      <Label htmlFor={`occasion-${occasion}`} className="text-sm">
                        {occasion}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasons */}
              <div className="space-y-3">
                <Label>Seasonal Preferences</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {SEASONS.map((season) => (
                    <div key={season} className="flex items-center space-x-2">
                      <Checkbox
                        id={`season-${season}`}
                        checked={formData.seasons.includes(season)}
                        onCheckedChange={() => handleArrayToggle('seasons', season)}
                      />
                      <Label htmlFor={`season-${season}`} className="text-sm">
                        {season}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Special preferences, allergies, or additional information..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Communication Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Email Marketing</div>
                      <div className="text-sm text-gray-600">Receive promotional emails and offers</div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.emailMarketing}
                    onCheckedChange={(checked) => handleInputChange('emailMarketing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">SMS Marketing</div>
                      <div className="text-sm text-gray-600">Receive SMS notifications and offers</div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.smsMarketing}
                    onCheckedChange={(checked) => handleInputChange('smsMarketing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">WhatsApp Marketing</div>
                      <div className="text-sm text-gray-600">Receive WhatsApp messages and updates</div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.whatsappMarketing}
                    onCheckedChange={(checked) => handleInputChange('whatsappMarketing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Birthday Offers</div>
                      <div className="text-sm text-gray-600">Special offers on your birthday</div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.birthdayOffers}
                    onCheckedChange={(checked) => handleInputChange('birthdayOffers', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Restock Alerts</div>
                      <div className="text-sm text-gray-600">Notifications when favorite items are back in stock</div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.restockAlerts}
                    onCheckedChange={(checked) => handleInputChange('restockAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              // Save as draft logic
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </div>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Customer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}