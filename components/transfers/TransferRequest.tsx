'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  TransferRequestFormData,
  TransferPriority,
  Store,
  Product
} from '@/types/store';
import {
  ArrowRight,
  Plus,
  Minus,
  Package,
  Search,
  Calendar,
  AlertCircle,
  Truck,
  CheckCircle,
  ArrowLeft,
  Save,
  Send
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const transferSchema = z.object({
  fromStoreId: z.string().min(1, 'From store is required'),
  toStoreId: z.string().min(1, 'To store is required'),
  priority: z.nativeEnum(TransferPriority),
  notes: z.string().optional(),
  estimatedDelivery: z.date().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantityRequested: z.number().min(1, 'Quantity must be at least 1'),
    notes: z.string().optional()
  })).min(1, 'At least one item is required')
});

type TransferFormValues = z.infer<typeof transferSchema>;

interface TransferRequestProps {
  stores: Store[];
  products: Product[];
  onSubmit: (data: TransferRequestFormData) => Promise<void>;
  isLoading?: boolean;
}

const getPriorityColor = (priority: TransferPriority) => {
  switch (priority) {
    case TransferPriority.LOW:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case TransferPriority.NORMAL:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case TransferPriority.HIGH:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case TransferPriority.URGENT:
      return 'bg-red-100 text-red-800 border-red-200';
    case TransferPriority.EMERGENCY:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function TransferRequest({ stores, products, onSubmit, isLoading }: TransferRequestProps) {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromStoreId: '',
      toStoreId: '',
      priority: TransferPriority.NORMAL,
      notes: '',
      items: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  const watchedFromStore = form.watch('fromStoreId');
  const watchedToStore = form.watch('toStoreId');

  const availableStores = stores.filter(store => store.id !== watchedFromStore);
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  const handleSubmit = async (data: TransferFormValues) => {
    try {
      await onSubmit(data as TransferRequestFormData);
      toast.success('Transfer request created successfully');
      router.push('/transfers');
    } catch (error) {
      toast.error('Failed to create transfer request');
      console.error(error);
    }
  };

  const addProduct = (product: Product) => {
    const existingItemIndex = form.getValues('items').findIndex(
      item => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      const currentQuantity = form.getValues(`items.${existingItemIndex}.quantityRequested`);
      form.setValue(`items.${existingItemIndex}.quantityRequested`, currentQuantity + 1);
    } else {
      append({
        productId: product.id,
        quantityRequested: 1,
        notes: ''
      });
      setSelectedProducts(prev => [...prev, product]);
    }
    setIsProductDialogOpen(false);
  };

  const removeProduct = (index: number) => {
    const productId = form.getValues(`items.${index}.productId`);
    remove(index);
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const fromStore = stores.find(s => s.id === watchedFromStore);
  const toStore = stores.find(s => s.id === watchedToStore);

  const calculateTotalItems = () => {
    return form.getValues('items').reduce((sum, item) => sum + item.quantityRequested, 0);
  };

  const calculateEstimatedValue = () => {
    return form.getValues('items').reduce((sum, item) => {
      const product = getProductById(item.productId);
      return sum + (product ? product.costPrice * item.quantityRequested : 0);
    }, 0);
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Create Transfer Request</h1>
          <p className="text-muted-foreground">
            Request inventory transfer between store locations
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Transfer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Transfer Details
              </CardTitle>
              <CardDescription>
                Specify the source and destination stores for this transfer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fromStoreId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Store</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source store" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{store.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {store.code} • {store.city}
                                  </div>
                                </div>
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
                  name="toStoreId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Store</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination store" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableStores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{store.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {store.code} • {store.city}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {fromStore && toStore && (
                <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{fromStore.name}</div>
                      <div className="text-muted-foreground">{fromStore.city}, {fromStore.emirate}</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-medium">{toStore.name}</div>
                      <div className="text-muted-foreground">{toStore.city}, {toStore.emirate}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(TransferPriority).map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              <div className="flex items-center gap-2">
                                <Badge className={getPriorityColor(priority)}>
                                  {priority}
                                </Badge>
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
                  name="estimatedDelivery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Delivery Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            className="pl-9"
                            value={field.value ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
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
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any special instructions or notes for this transfer..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any additional information about this transfer request
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Transfer Items
                  </CardTitle>
                  <CardDescription>
                    Select products and quantities to transfer
                  </CardDescription>
                </div>
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Select Products</DialogTitle>
                      <DialogDescription>
                        Choose products to add to your transfer request
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search products..."
                          value={productSearchQuery}
                          onChange={(e) => setProductSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="grid gap-2">
                          {filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                              onClick={() => addProduct(product)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Package className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    SKU: {product.sku} • Stock: {product.stockQuantity}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">
                                  {new Intl.NumberFormat('en-AE', {
                                    style: 'currency',
                                    currency: 'AED'
                                  }).format(product.costPrice)}
                                </div>
                                <div className="text-sm text-muted-foreground">Cost Price</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length > 0 ? (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Cost</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => {
                        const product = getProductById(field.productId);
                        if (!product) return null;

                        return (
                          <TableRow key={field.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Package className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Available: {product.stockQuantity}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {product.sku}
                              </code>
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.quantityRequested`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="1"
                                        max={product.stockQuantity}
                                        className="w-20"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              {new Intl.NumberFormat('en-AE', {
                                style: 'currency',
                                currency: 'AED'
                              }).format(product.costPrice)}
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {new Intl.NumberFormat('en-AE', {
                                  style: 'currency',
                                  currency: 'AED'
                                }).format(product.costPrice * form.watch(`items.${index}.quantityRequested`))}
                              </span>
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.notes`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Optional notes"
                                        className="w-32"
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeProduct(index)}
                                className="h-8 w-8"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <Separator />

                  {/* Summary */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{fields.length}</div>
                          <p className="text-sm text-muted-foreground">Products</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{calculateTotalItems()}</div>
                          <p className="text-sm text-muted-foreground">Total Items</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-AE', {
                              style: 'currency',
                              currency: 'AED'
                            }).format(calculateEstimatedValue())}
                          </div>
                          <p className="text-sm text-muted-foreground">Estimated Value</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No items added</h3>
                  <p className="text-muted-foreground">
                    Add products to create your transfer request
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Warnings */}
          {watchedFromStore && watchedToStore && watchedFromStore === watchedToStore && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium text-orange-900">Invalid Transfer</h3>
                    <p className="text-sm text-orange-700">
                      Source and destination stores cannot be the same
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {fields.some((field, index) => {
            const product = getProductById(field.productId);
            const quantity = form.watch(`items.${index}.quantityRequested`);
            return product && quantity > product.stockQuantity;
          }) && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="font-medium text-red-900">Insufficient Stock</h3>
                    <p className="text-sm text-red-700">
                      Some items have quantities exceeding available stock
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Save as draft logic
                toast.info('Save as draft functionality coming soon');
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={isLoading || fields.length === 0}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Request
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}