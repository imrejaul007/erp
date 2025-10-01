'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  StoreFormData,
  StoreType,
  UAEEmirate,
  UAE_CITIES,
  POPULAR_LOCATIONS,
  DaySchedule
} from '@/types/store';
import {
  MapPin,
  Clock,
  Settings,
  Store,
  Save,
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Globe,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const storeSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  code: z.string().min(2, 'Store code must be at least 2 characters').max(10, 'Store code must be at most 10 characters'),
  type: z.nativeEnum(StoreType),
  emirate: z.nativeEnum(UAEEmirate),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  managerId: z.string().optional(),
  parentStoreId: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  openingHours: z.object({
    monday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    tuesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    wednesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    thursday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    friday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    saturday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    }),
    sunday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    })
  }),
  settings: z.object({
    taxRate: z.number().min(0).max(100),
    currency: z.string().default('AED'),
    timezone: z.string().default('Asia/Dubai'),
    autoReplenishment: z.boolean().default(true),
    minStockThreshold: z.number().min(0).default(10),
    maxStockThreshold: z.number().min(0).default(1000),
    enableTransfers: z.boolean().default(true),
    requireTransferApproval: z.boolean().default(true),
    enablePriceSync: z.boolean().default(true),
    enablePromotionSync: z.boolean().default(true),
    emergencyContactEmail: z.string().email().optional().or(z.literal('')),
    notificationSettings: z.object({
      lowStockAlerts: z.boolean().default(true),
      transferAlerts: z.boolean().default(true),
      salesAlerts: z.boolean().default(true),
      emergencyAlerts: z.boolean().default(true),
      emailNotifications: z.boolean().default(true),
      smsNotifications: z.boolean().default(false)
    })
  })
});

type StoreFormValues = z.infer<typeof storeSchema>;

interface AddStoreProps {
  onSubmit: (data: StoreFormData) => Promise<void>;
  stores: any[]; // For parent store selection
  managers: any[]; // For manager selection
  isLoading?: boolean;
}

const defaultSchedule: DaySchedule = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '22:00'
};

const defaultOpeningHours = {
  monday: defaultSchedule,
  tuesday: defaultSchedule,
  wednesday: defaultSchedule,
  thursday: defaultSchedule,
  friday: { ...defaultSchedule, openTime: '14:00' }, // Friday prayer time consideration
  saturday: defaultSchedule,
  sunday: defaultSchedule
};

export default function AddStore({ onSubmit, stores, managers, isLoading }: AddStoreProps) {
  const router = useRouter();
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [popularLocations, setPopularLocations] = useState<any[]>([]);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      code: '',
      type: StoreType.OUTLET,
      emirate: UAEEmirate.DUBAI,
      city: '',
      address: '',
      phone: '',
      email: '',
      openingHours: defaultOpeningHours,
      settings: {
        taxRate: 5,
        currency: 'AED',
        timezone: 'Asia/Dubai',
        autoReplenishment: true,
        minStockThreshold: 10,
        maxStockThreshold: 1000,
        enableTransfers: true,
        requireTransferApproval: true,
        enablePriceSync: true,
        enablePromotionSync: true,
        emergencyContactEmail: '',
        notificationSettings: {
          lowStockAlerts: true,
          transferAlerts: true,
          salesAlerts: true,
          emergencyAlerts: true,
          emailNotifications: true,
          smsNotifications: false
        }
      }
    }
  });

  const watchedEmirate = form.watch('emirate');

  useEffect(() => {
    if (watchedEmirate && UAE_CITIES[watchedEmirate]) {
      setAvailableCities(UAE_CITIES[watchedEmirate]);
      setPopularLocations(
        POPULAR_LOCATIONS.filter(location => location.emirate === watchedEmirate)
      );
    }
  }, [watchedEmirate]);

  const handleSubmit = async (data: StoreFormValues) => {
    try {
      await onSubmit(data as StoreFormData);
      toast.success('Store created successfully');
      router.push('/stores');
    } catch (error) {
      toast.error('Failed to create store');
      console.error(error);
    }
  };

  const fillFromPopularLocation = (location: any) => {
    form.setValue('city', location.city);
    form.setValue('address', location.name);
    if (location.coordinates) {
      form.setValue('coordinates', location.coordinates);
    }
  };

  const generateStoreCode = () => {
    const emirateCode = form.getValues('emirate').substring(0, 3).toUpperCase();
    const typeCode = form.getValues('type').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    const code = `${emirateCode}${typeCode}${randomNum}`;
    form.setValue('code', code);
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Store</h1>
          <p className="text-muted-foreground">
            Create a new store location in your network
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the basic details for your new store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dubai Mall Store" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Code</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="DUBOUT001" {...field} />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={generateStoreCode}
                          >
                            Generate
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Unique identifier for this store
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select store type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(StoreType).map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                {type.replace('_', ' ')}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentStoreId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Store (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent store" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">No parent store</SelectItem>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.name} ({store.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                            <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                            +971
                          </div>
                          <Input
                            placeholder="50 123 4567"
                            className="rounded-l-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="store@company.com"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="managerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Manager</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select store manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No manager assigned</SelectItem>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {manager.name} ({manager.email})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
              <CardDescription>
                Specify the location details for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="emirate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emirate</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select emirate" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(UAEEmirate).map((emirate) => (
                            <SelectItem key={emirate} value={emirate}>
                              {emirate.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City/Area</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {popularLocations.length > 0 && (
                <div>
                  <FormLabel>Popular Locations</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {popularLocations.map((location, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => fillFromPopularLocation(location)}
                      >
                        {location.name}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Click on a popular location to auto-fill address details
                  </FormDescription>
                </div>
              )}

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Complete address including building name, street, and landmarks"
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Opening Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Opening Hours
              </CardTitle>
              <CardDescription>
                Set the operating hours for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {days.map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24">
                    <FormLabel className="capitalize">{day}</FormLabel>
                  </div>

                  <FormField
                    control={form.control}
                    name={`openingHours.${day}.isOpen`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch(`openingHours.${day}.isOpen`) && (
                    <>
                      <FormField
                        control={form.control}
                        name={`openingHours.${day}.openTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} className="w-32" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <span className="text-muted-foreground">to</span>

                      <FormField
                        control={form.control}
                        name={`openingHours.${day}.closeTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} className="w-32" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {!form.watch(`openingHours.${day}.isOpen`) && (
                    <span className="text-muted-foreground">Closed</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Store Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Store Settings
              </CardTitle>
              <CardDescription>
                Configure operational settings for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="settings.taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.minStockThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Stock Threshold</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.maxStockThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Stock Threshold</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Inventory & Transfer Settings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="settings.autoReplenishment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Auto Replenishment</FormLabel>
                          <FormDescription>
                            Automatically create replenishment orders
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.enableTransfers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Transfers</FormLabel>
                          <FormDescription>
                            Allow inventory transfers to/from this store
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.requireTransferApproval"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Transfer Approval Required</FormLabel>
                          <FormDescription>
                            Require approval for transfer requests
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.enablePriceSync"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Price Sync</FormLabel>
                          <FormDescription>
                            Sync pricing updates across stores
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Settings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="settings.notificationSettings.lowStockAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Low Stock Alerts</FormLabel>
                          <FormDescription>
                            Get notified when stock is low
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.notificationSettings.transferAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Transfer Alerts</FormLabel>
                          <FormDescription>
                            Get notified about transfer updates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.notificationSettings.emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email Notifications</FormLabel>
                          <FormDescription>
                            Send notifications via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.notificationSettings.smsNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">SMS Notifications</FormLabel>
                          <FormDescription>
                            Send notifications via SMS
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              Create Store
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}