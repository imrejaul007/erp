'use client'

import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Trash2,
  Package,
  DollarSign,
  Truck,
  Settings,
  Info,
  Calculator,
} from 'lucide-react'
import { UnitConverter } from './utils/unit-converter'
import type { CreateMaterialForm, MaterialGrade, AlternateUnit } from '@/types/inventory'

const materialFormSchema = z.object({
  name: z.string().min(1, 'Material name is required'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  categoryId: z.string().min(1, 'Category is required'),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  density: z.number().min(0.1, 'Density must be greater than 0.1').optional(),
  alternateUnits: z.array(z.object({
    unit: z.string(),
    factor: z.number().min(0.001, 'Factor must be greater than 0'),
    isDefault: z.boolean().optional(),
  })).optional(),
  costPerUnit: z.number().min(0, 'Cost per unit must be 0 or greater'),
  currency: z.string().default('USD'),
  minimumStock: z.number().min(0, 'Minimum stock must be 0 or greater'),
  maximumStock: z.number().min(0, 'Maximum stock must be 0 or greater').optional(),
  reorderLevel: z.number().min(0, 'Reorder level must be 0 or greater'),
  supplier: z.string().optional(),
  supplierCode: z.string().optional(),
  supplierPrice: z.number().min(0, 'Supplier price must be 0 or greater').optional(),
  grade: z.enum(['PREMIUM', 'STANDARD', 'ECONOMY', 'SPECIAL', 'ORGANIC', 'SYNTHETIC']),
  origin: z.string().optional(),
})

type FormData = z.infer<typeof materialFormSchema>

interface AddRawMaterialProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateMaterialForm) => Promise<void>
  editData?: CreateMaterialForm
  categories: Array<{ id: string; name: string }>
  suppliers?: string[]
}

const UNIT_OPTIONS = [
  { value: 'gram', label: 'Grams (g)', category: 'Weight' },
  { value: 'kilogram', label: 'Kilograms (kg)', category: 'Weight' },
  { value: 'tola', label: 'Tola', category: 'Weight' },
  { value: 'ml', label: 'Milliliters (ml)', category: 'Volume' },
  { value: 'liter', label: 'Liters (L)', category: 'Volume' },
  { value: 'piece', label: 'Pieces (pc)', category: 'Count' },
  { value: 'bottle', label: 'Bottles (btl)', category: 'Count' },
  { value: 'vial', label: 'Vials', category: 'Count' },
]

const GRADE_OPTIONS: { value: MaterialGrade; label: string; description: string }[] = [
  { value: 'PREMIUM', label: 'Premium', description: 'Highest quality, rare or exclusive materials' },
  { value: 'STANDARD', label: 'Standard', description: 'Regular commercial grade materials' },
  { value: 'ECONOMY', label: 'Economy', description: 'Budget-friendly options' },
  { value: 'SPECIAL', label: 'Special', description: 'Limited edition or seasonal materials' },
  { value: 'ORGANIC', label: 'Organic', description: 'Certified organic materials' },
  { value: 'SYNTHETIC', label: 'Synthetic', description: 'Lab-created or synthetic materials' },
]

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'AED', label: 'UAE Dirham (د.إ)', symbol: 'د.إ' },
  { value: 'SAR', label: 'Saudi Riyal (﷼)', symbol: '﷼' },
]

export function AddRawMaterial({
  open,
  onOpenChange,
  onSubmit,
  editData,
  categories,
  suppliers = [],
}: AddRawMaterialProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showUnitConverter, setShowUnitConverter] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: editData || {
      name: '',
      description: '',
      sku: '',
      categoryId: '',
      unitOfMeasure: 'gram',
      density: undefined,
      alternateUnits: [],
      costPerUnit: 0,
      currency: 'USD',
      minimumStock: 0,
      maximumStock: undefined,
      reorderLevel: 0,
      supplier: '',
      supplierCode: '',
      supplierPrice: undefined,
      grade: 'STANDARD',
      origin: '',
    },
  })

  const { fields: alternateUnitFields, append: addAlternateUnit, remove: removeAlternateUnit } = useFieldArray({
    control: form.control,
    name: 'alternateUnits',
  })

  // Auto-generate SKU
  const generateSKU = () => {
    const name = form.getValues('name')
    const category = categories.find(c => c.id === form.getValues('categoryId'))?.name

    if (name && category) {
      const namePart = name.slice(0, 3).toUpperCase()
      const categoryPart = category.slice(0, 3).toUpperCase()
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase()
      const sku = `${categoryPart}-${namePart}-${randomPart}`
      form.setValue('sku', sku)
    }
  }

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data as CreateMaterialForm)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get selected currency symbol
  const selectedCurrency = CURRENCY_OPTIONS.find(c => c.value === form.watch('currency'))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {editData ? 'Edit Raw Material' : 'Add New Raw Material'}
          </DialogTitle>
          <DialogDescription>
            Create a new raw material entry with detailed specifications, pricing, and inventory settings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="units">Units & Pricing</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="supplier">Supplier</TabsTrigger>
              </TabsList>

              {/* Basic Information */}
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                    <CardDescription>
                      Enter the basic details for your raw material
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Oud Oil Cambodia"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU *</FormLabel>
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input
                                  placeholder="e.g., OUD-CAM-001"
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={generateSKU}
                                disabled={!form.watch('name') || !form.watch('categoryId')}
                              >
                                Generate
                              </Button>
                            </div>
                            <FormDescription>
                              Unique identifier for this material
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {GRADE_OPTIONS.map((grade) => (
                                  <SelectItem key={grade.value} value={grade.value}>
                                    <div>
                                      <div>{grade.label}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {grade.description}
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

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Detailed description of the material, its properties, usage notes..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origin/Source</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Cambodia, India, synthetic"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Country or source of the material
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Units & Pricing */}
              <TabsContent value="units" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Units & Pricing
                    </CardTitle>
                    <CardDescription>
                      Configure units of measurement and pricing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="unitOfMeasure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Unit *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(
                                  UNIT_OPTIONS.reduce((acc, unit) => {
                                    if (!acc[unit.category]) acc[unit.category] = []
                                    acc[unit.category].push(unit)
                                    return acc
                                  }, {} as Record<string, typeof UNIT_OPTIONS>)
                                ).map(([category, units]) => (
                                  <div key={category}>
                                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                                      {category}
                                    </div>
                                    {units.map((unit) => (
                                      <SelectItem key={unit.value} value={unit.value}>
                                        {unit.label}
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="density"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Density (g/ml)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="e.g., 0.85"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormDescription>
                              Required for volume to weight conversions
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Unit Converter */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-converter"
                        checked={showUnitConverter}
                        onCheckedChange={setShowUnitConverter}
                      />
                      <Label htmlFor="show-converter">Show Unit Converter</Label>
                    </div>

                    {showUnitConverter && (
                      <UnitConverter
                        density={form.watch('density') || 0.85}
                        showMaterialSpecific={false}
                        defaultFromUnit={form.watch('unitOfMeasure')}
                      />
                    )}

                    {/* Alternate Units */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Alternate Units</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addAlternateUnit({ unit: '', factor: 1 })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Unit
                        </Button>
                      </div>

                      {alternateUnitFields.map((field, index) => (
                        <div key={field.id} className="flex items-end space-x-2">
                          <div className="flex-1">
                            <Select
                              value={form.watch(`alternateUnits.${index}.unit`)}
                              onValueChange={(value) => form.setValue(`alternateUnits.${index}.unit`, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {UNIT_OPTIONS.map((unit) => (
                                  <SelectItem key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              step="0.0001"
                              placeholder="Conversion factor"
                              {...form.register(`alternateUnits.${index}.factor`, { valueAsNumber: true })}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeAlternateUnit(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CURRENCY_OPTIONS.map((currency) => (
                                  <SelectItem key={currency.value} value={currency.value}>
                                    {currency.label}
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
                        name="costPerUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost per Unit *</FormLabel>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">
                                {selectedCurrency?.symbol || '$'}
                              </span>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  className="pl-8"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                            </div>
                            <FormDescription>
                              Cost per {form.watch('unitOfMeasure') || 'unit'}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inventory Settings */}
              <TabsContent value="inventory" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Inventory Management</CardTitle>
                    <CardDescription>
                      Set up stock levels and reorder points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="minimumStock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Stock *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormDescription>
                              Safety stock level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reorderLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reorder Level *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormDescription>
                              Trigger reorder alerts
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maximumStock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Stock</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Optional"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum inventory level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Stock levels help you maintain optimal inventory. Set reorder level higher than minimum stock
                        to allow time for procurement.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Supplier Information */}
              <TabsContent value="supplier" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Supplier Information
                    </CardTitle>
                    <CardDescription>
                      Configure supplier details and pricing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="supplier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supplier</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select or enter supplier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {suppliers.map((supplier) => (
                                  <SelectItem key={supplier} value={supplier}>
                                    {supplier}
                                  </SelectItem>
                                ))}
                                <SelectItem value="__new__">+ Add New Supplier</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="supplierCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supplier Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Supplier's product code"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              How supplier identifies this material
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="supplierPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supplier Price</FormLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                              {selectedCurrency?.symbol || '$'}
                            </span>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-8"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Latest purchase price from supplier
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? 'Saving...' : editData ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}