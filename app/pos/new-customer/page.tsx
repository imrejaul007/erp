'use client';

import React, { useState } from 'react';
import { UserPlus, Save, RefreshCw, MapPin, Phone, Mail, Calendar, Users, Heart, Gift, Star, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

export default function NewCustomerPage() {
  const [formData, setFormData] = useState({
    personalInfo: {
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      language: 'en',
    },
    contactInfo: {
      email: '',
      phone: '',
      alternatePhone: '',
      address: '',
      city: '',
      emirate: '',
      country: 'UAE',
      postalCode: '',
    },
    preferences: {
      fragranceTypes: [],
      priceRange: '',
      occasions: [],
      intensity: '',
      newsletter: false,
      smsMarketing: false,
    },
    loyaltyInfo: {
      joinLoyalty: true,
      referredBy: '',
      referralSource: '',
      specialOffers: true,
    },
    notes: '',
  });

  const fragranceTypes = [
    'Oud', 'Rose', 'Amber', 'Musk', 'Sandalwood', 'Jasmine',
    'Woody', 'Fresh', 'Oriental', 'Floral', 'Citrus', 'Spicy'
  ];

  const occasions = [
    'Daily Wear', 'Evening', 'Special Events', 'Work', 'Religious', 'Weddings'
  ];

  const emirates = [
    'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'
  ];

  const handleSubmit = async () => {
    try {
      const fullName = `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`.trim();

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: formData.contactInfo.email,
          phone: formData.contactInfo.phone,
          customerType: 'INDIVIDUAL',
          isVIP: false,
          dateOfBirth: formData.personalInfo.dateOfBirth || null,
          address: formData.contactInfo.address,
          emirate: formData.contactInfo.emirate,
          city: formData.contactInfo.city,
          loyaltyPoints: formData.loyaltyInfo.joinLoyalty ? 100 : 0, // Welcome bonus
          notes: formData.notes
        })
      });

      if (response.ok) {
        const customer = await response.json();
        alert(`Customer "${customer.name}" registered successfully! ${formData.loyaltyInfo.joinLoyalty ? 'Welcome bonus: 100 loyalty points!' : ''}`);
        handleReset();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to register customer'}`);
      }
    } catch (error) {
      console.error('Error registering customer:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      personalInfo: {
        title: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        language: 'en',
      },
      contactInfo: {
        email: '',
        phone: '',
        alternatePhone: '',
        address: '',
        city: '',
        emirate: '',
        country: 'UAE',
        postalCode: '',
      },
      preferences: {
        fragranceTypes: [],
        priceRange: '',
        occasions: [],
        intensity: '',
        newsletter: false,
        smsMarketing: false,
      },
      loyaltyInfo: {
        joinLoyalty: true,
        referredBy: '',
        referralSource: '',
        specialOffers: true,
      },
      notes: '',
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <UserPlus className="h-8 w-8 text-oud-600" />
            New Customer Registration
          </h1>
          <p className="text-muted-foreground mt-1">
            Create comprehensive customer profile for personalized service
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Form
          </Button>
          <Button className="bg-oud-600 hover:bg-oud-700" onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Register Customer
          </Button>
        </div>
      </div>

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>
            Complete customer details for enhanced service and personalization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="loyalty">Loyalty & Marketing</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Select value={formData.personalInfo.title} onValueChange={(value) =>
                    setFormData(prev => ({...prev, personalInfo: {...prev.personalInfo, title: value}}))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                      <SelectItem value="prof">Prof.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: {...prev.personalInfo, firstName: e.target.value}
                    }))}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: {...prev.personalInfo, lastName: e.target.value}
                    }))}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: {...prev.personalInfo, dateOfBirth: e.target.value}
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.personalInfo.gender}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      personalInfo: {...prev.personalInfo, gender: value}
                    }))}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select value={formData.personalInfo.nationality} onValueChange={(value) =>
                    setFormData(prev => ({...prev, personalInfo: {...prev.personalInfo, nationality: value}}))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uae">UAE</SelectItem>
                      <SelectItem value="saudi">Saudi Arabia</SelectItem>
                      <SelectItem value="kuwait">Kuwait</SelectItem>
                      <SelectItem value="qatar">Qatar</SelectItem>
                      <SelectItem value="oman">Oman</SelectItem>
                      <SelectItem value="bahrain">Bahrain</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="pakistan">Pakistan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select value={formData.personalInfo.language} onValueChange={(value) =>
                  setFormData(prev => ({...prev, personalInfo: {...prev.personalInfo, language: value}}))
                }>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="ur">Urdu</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contactInfo: {...prev.contactInfo, email: e.target.value}
                    }))}
                    placeholder="customer@email.ae"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contactInfo: {...prev.contactInfo, phone: e.target.value}
                    }))}
                    placeholder="+971 50 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    value={formData.contactInfo.alternatePhone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contactInfo: {...prev.contactInfo, alternatePhone: e.target.value}
                    }))}
                    placeholder="+971 4 XXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.contactInfo.postalCode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contactInfo: {...prev.contactInfo, postalCode: e.target.value}
                    }))}
                    placeholder="Postal/ZIP code"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.contactInfo.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: {...prev.contactInfo, address: e.target.value}
                  }))}
                  placeholder="Full address including building, street, area"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.contactInfo.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contactInfo: {...prev.contactInfo, city: e.target.value}
                    }))}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emirate">Emirate/State</Label>
                  <Select value={formData.contactInfo.emirate} onValueChange={(value) =>
                    setFormData(prev => ({...prev, contactInfo: {...prev.contactInfo, emirate: value}}))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emirate" />
                    </SelectTrigger>
                    <SelectContent>
                      {emirates.map((emirate) => (
                        <SelectItem key={emirate} value={emirate.toLowerCase().replace(/\s+/g, '-')}>
                          {emirate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.contactInfo.country} onValueChange={(value) =>
                    setFormData(prev => ({...prev, contactInfo: {...prev.contactInfo, country: value}}))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAE">United Arab Emirates</SelectItem>
                      <SelectItem value="SA">Saudi Arabia</SelectItem>
                      <SelectItem value="KW">Kuwait</SelectItem>
                      <SelectItem value="QA">Qatar</SelectItem>
                      <SelectItem value="OM">Oman</SelectItem>
                      <SelectItem value="BH">Bahrain</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Fragrance Preferences</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select preferred fragrance types</p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {fragranceTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={formData.preferences.fragranceTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  fragranceTypes: [...prev.preferences.fragranceTypes, type]
                                }
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  fragranceTypes: prev.preferences.fragranceTypes.filter(t => t !== type)
                                }
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={type} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range Preference</Label>
                    <Select value={formData.preferences.priceRange} onValueChange={(value) =>
                      setFormData(prev => ({...prev, preferences: {...prev.preferences, priceRange: value}}))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget (Under AED 200)</SelectItem>
                        <SelectItem value="mid-range">Mid-range (AED 200-500)</SelectItem>
                        <SelectItem value="premium">Premium (AED 500-1000)</SelectItem>
                        <SelectItem value="luxury">Luxury (Over AED 1000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intensity">Fragrance Intensity</Label>
                    <Select value={formData.preferences.intensity} onValueChange={(value) =>
                      setFormData(prev => ({...prev, preferences: {...prev.preferences, intensity: value}}))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select intensity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="strong">Strong</SelectItem>
                        <SelectItem value="very-strong">Very Strong</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Occasions</Label>
                  <p className="text-sm text-muted-foreground mb-3">When do you typically wear fragrances?</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {occasions.map((occasion) => (
                      <div key={occasion} className="flex items-center space-x-2">
                        <Checkbox
                          id={occasion}
                          checked={formData.preferences.occasions.includes(occasion)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  occasions: [...prev.preferences.occasions, occasion]
                                }
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  occasions: prev.preferences.occasions.filter(o => o !== occasion)
                                }
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={occasion} className="text-sm">{occasion}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="loyalty" className="space-y-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-oud-600" />
                      Loyalty Program
                    </CardTitle>
                    <CardDescription>
                      Join our loyalty program to earn points and exclusive benefits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="joinLoyalty"
                        checked={formData.loyaltyInfo.joinLoyalty}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          loyaltyInfo: {...prev.loyaltyInfo, joinLoyalty: checked}
                        }))}
                      />
                      <Label htmlFor="joinLoyalty">Enroll in Oud Palace Loyalty Program</Label>
                    </div>
                    {formData.loyaltyInfo.joinLoyalty && (
                      <div className="ml-6 p-3 bg-oud-50 rounded-lg">
                        <p className="text-sm text-oud-700">
                          Benefits include: Earn 1 point per AED spent • Birthday specials •
                          Exclusive access to new collections • Priority customer service
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-oud-600" />
                      Referral Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="referredBy">Referred By (Optional)</Label>
                        <Input
                          id="referredBy"
                          value={formData.loyaltyInfo.referredBy}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            loyaltyInfo: {...prev.loyaltyInfo, referredBy: e.target.value}
                          }))}
                          placeholder="Friend's name or customer ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referralSource">How did you hear about us?</Label>
                        <Select value={formData.loyaltyInfo.referralSource} onValueChange={(value) =>
                          setFormData(prev => ({...prev, loyaltyInfo: {...prev.loyaltyInfo, referralSource: value}}))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="friend">Friend/Family</SelectItem>
                            <SelectItem value="social-media">Social Media</SelectItem>
                            <SelectItem value="google">Google Search</SelectItem>
                            <SelectItem value="advertisement">Advertisement</SelectItem>
                            <SelectItem value="walk-by">Walking by store</SelectItem>
                            <SelectItem value="event">Event/Exhibition</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-oud-600" />
                      Marketing Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="newsletter"
                          checked={formData.preferences.newsletter}
                          onCheckedChange={(checked) => setFormData(prev => ({
                            ...prev,
                            preferences: {...prev.preferences, newsletter: checked}
                          }))}
                        />
                        <Label htmlFor="newsletter">
                          Subscribe to email newsletter (New arrivals, special offers)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="smsMarketing"
                          checked={formData.preferences.smsMarketing}
                          onCheckedChange={(checked) => setFormData(prev => ({
                            ...prev,
                            preferences: {...prev.preferences, smsMarketing: checked}
                          }))}
                        />
                        <Label htmlFor="smsMarketing">
                          Receive SMS notifications (Sales alerts, appointment reminders)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="specialOffers"
                          checked={formData.loyaltyInfo.specialOffers}
                          onCheckedChange={(checked) => setFormData(prev => ({
                            ...prev,
                            loyaltyInfo: {...prev.loyaltyInfo, specialOffers: checked}
                          }))}
                        />
                        <Label htmlFor="specialOffers">
                          Receive personalized offers based on preferences
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Any special requirements, allergies, or additional information"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Label className="font-medium">Customer Name:</Label>
              <p>{formData.personalInfo.title} {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
            </div>
            <div>
              <Label className="font-medium">Contact:</Label>
              <p>{formData.contactInfo.email}</p>
              <p>{formData.contactInfo.phone}</p>
            </div>
            <div>
              <Label className="font-medium">Preferences:</Label>
              <p>{formData.preferences.fragranceTypes.slice(0, 3).join(', ')}{formData.preferences.fragranceTypes.length > 3 ? '...' : ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}