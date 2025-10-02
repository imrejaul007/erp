'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = params.id as string;

  // Mock data - in production this would be fetched based on locationId
  const [formData, setFormData] = useState({
    name: 'Dubai Mall Flagship',
    nameArabic: 'فرع دبي مول الرئيسي',
    type: 'flagship',
    address: 'Dubai Mall, Ground Floor, Unit GF-123',
    emirate: 'Dubai',
    city: 'Dubai',
    phone: '+971-4-123-4567',
    email: 'dubaimall@oudpalace.ae',
    manager: 'Ahmed Al-Rashid',
    openingTime: '09:00',
    closingTime: '22:00',
    targetRevenue: '800000',
    maxStaff: '12',
    notes: 'Flagship store with premium customer experience. High foot traffic area.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Location updated successfully!');
    router.push(`/multi-location/view/${locationId}`);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Edit Location
          </h1>
          <p className="text-muted-foreground">Update store location details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
            <CardDescription>Update the details for this store location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Dubai Mall Flagship"
                  required
                />
              </div>

              {/* Store Name (Arabic) */}
              <div className="space-y-2">
                <Label htmlFor="nameArabic">Store Name (Arabic)</Label>
                <Input
                  id="nameArabic"
                  value={formData.nameArabic}
                  onChange={(e) => handleChange('nameArabic', e.target.value)}
                  placeholder="فرع دبي مول الرئيسي"
                  dir="rtl"
                />
              </div>

              {/* Store Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Store Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flagship">Flagship Store</SelectItem>
                    <SelectItem value="premium">Premium Store</SelectItem>
                    <SelectItem value="standard">Standard Store</SelectItem>
                    <SelectItem value="outlet">Outlet Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Emirate */}
              <div className="space-y-2">
                <Label htmlFor="emirate">Emirate *</Label>
                <Select value={formData.emirate} onValueChange={(value) => handleChange('emirate', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dubai">Dubai</SelectItem>
                    <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                    <SelectItem value="Sharjah">Sharjah</SelectItem>
                    <SelectItem value="Ajman">Ajman</SelectItem>
                    <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                    <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                    <SelectItem value="Fujairah">Fujairah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Dubai"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Dubai Mall, Ground Floor, Unit GF-123"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+971-4-123-4567"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="dubaimall@oudpalace.ae"
                />
              </div>

              {/* Manager */}
              <div className="space-y-2">
                <Label htmlFor="manager">Store Manager *</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => handleChange('manager', e.target.value)}
                  placeholder="Ahmed Al-Rashid"
                  required
                />
              </div>

              {/* Opening Time */}
              <div className="space-y-2">
                <Label htmlFor="openingTime">Opening Time *</Label>
                <Input
                  id="openingTime"
                  type="time"
                  value={formData.openingTime}
                  onChange={(e) => handleChange('openingTime', e.target.value)}
                  required
                />
              </div>

              {/* Closing Time */}
              <div className="space-y-2">
                <Label htmlFor="closingTime">Closing Time *</Label>
                <Input
                  id="closingTime"
                  type="time"
                  value={formData.closingTime}
                  onChange={(e) => handleChange('closingTime', e.target.value)}
                  required
                />
              </div>

              {/* Target Revenue */}
              <div className="space-y-2">
                <Label htmlFor="targetRevenue">Monthly Target Revenue (AED)</Label>
                <Input
                  id="targetRevenue"
                  type="number"
                  value={formData.targetRevenue}
                  onChange={(e) => handleChange('targetRevenue', e.target.value)}
                  placeholder="800000"
                />
              </div>

              {/* Max Staff */}
              <div className="space-y-2">
                <Label htmlFor="maxStaff">Maximum Staff Capacity</Label>
                <Input
                  id="maxStaff"
                  type="number"
                  value={formData.maxStaff}
                  onChange={(e) => handleChange('maxStaff', e.target.value)}
                  placeholder="12"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Additional information about this location"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
