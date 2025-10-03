'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Plus,
  Save,
  Upload,
  Camera,
  Package,
  Beaker,
  Sparkles,
  Gift,
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator,
  Barcode,
  Hash,
  Tags,
  MapPin,
  Calendar,
  DollarSign,
  FileImage,
  Copy,
  RotateCcw,
  FileSpreadsheet,
  Download,
  Globe,
  Search,
  Loader2,
  FileText,
  Database,
  Link,
  Eye,
  Edit,
  X,
  Check,
  ArrowLeft} from 'lucide-react';

interface ProductFormData {
  // Basic Information
  name: string;
  nameArabic: string;
  sku: string;
  barcode: string;
  category: string;
  subcategory: string;
  productType: 'RAW_MATERIAL' | 'SEMI_FINISHED' | 'FINISHED_PRODUCT';
  brand: string;
  collection?: string;

  // Physical Properties
  size: number;
  unit: string;
  weight: number;
  density?: number;

  // Inventory Details
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  storageLocation: string;
  storageConditions: string;
  shelfLife: number; // months

  // Pricing
  costPerUnit: number;
  retailPrice: number;
  wholesalePrice: number;
  vipPrice: number;
  currency: string;
  taxRate: number;

  // Quality & Specifications
  grade: 'PREMIUM' | 'LUXURY' | 'STANDARD' | 'ECONOMY';
  origin?: string;
  purity?: number;
  moistureContent?: number;

  // Formula & Composition (for finished products)
  formulaId?: string;
  ingredients: string[];
  allergens: string[];

  // Packaging
  packagingType: string;
  packagingMaterial: string;
  packagingColor: string;
  packagingWeight: number;

  // Compliance & Certifications
  certifications: string[];
  isHalal: boolean;
  isOrganic: boolean;

  // Additional Information
  description: string;
  productionNotes: string;
  tags: string[];
  images: string[];
}

export default function AddProductPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    nameArabic: '',
    sku: '',
    barcode: '',
    category: '',
    subcategory: '',
    productType: 'FINISHED_PRODUCT',
    brand: 'Oud Palace',
    collection: '',
    size: 0,
    unit: 'ml',
    weight: 0,
    minimumStock: 0,
    maximumStock: 0,
    reorderLevel: 0,
    storageLocation: '',
    storageConditions: '',
    shelfLife: 36,
    costPerUnit: 0,
    retailPrice: 0,
    wholesalePrice: 0,
    vipPrice: 0,
    currency: 'AED',
    taxRate: 5,
    grade: 'STANDARD',
    ingredients: [],
    allergens: [],
    packagingType: '',
    packagingMaterial: '',
    packagingColor: '',
    packagingWeight: 0,
    certifications: [],
    isHalal: false,
    isOrganic: false,
    description: '',
    productionNotes: '',
    tags: [],
    images: []
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [newAllergen, setNewAllergen] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bulk upload states
  const [uploadMode, setUploadMode] = useState<'manual' | 'bulk' | 'webscrape'>('manual');
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedProducts, setUploadedProducts] = useState<ProductFormData[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('auto');
  const [detectedPlatform, setDetectedPlatform] = useState<string>('');

  // Web scraping states
  const [scrapingUrl, setScrapingUrl] = useState('');
  const [scrapedData, setScrapedData] = useState<Partial<ProductFormData> | null>(null);
  const [isScrapingData, setIsScrapingData] = useState(false);
  const [scrapingError, setScrapingError] = useState('');

  // Product editing states
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);

  // Imported products tracking
  const [importedProducts, setImportedProducts] = useState<ProductFormData[]>([]);
  const [showImportedProducts, setShowImportedProducts] = useState(false);

  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const categories = [
    { value: 'perfume', label: 'Perfume', subcategories: ['Eau de Parfum', 'Eau de Toilette', 'Parfum Extract', 'Body Spray'] },
    { value: 'attar', label: 'Attar', subcategories: ['Traditional Attar', 'Modern Attar', 'Oil-based Perfume'] },
    { value: 'oud', label: 'Oud', subcategories: ['Oud Oil', 'Oud Chips', 'Oud Powder', 'Oud Incense'] },
    { value: 'raw_material', label: 'Raw Material', subcategories: ['Essential Oils', 'Absolutes', 'Aromatic Chemicals', 'Carriers'] },
    { value: 'packaging', label: 'Packaging', subcategories: ['Bottles', 'Caps', 'Boxes', 'Labels'] },
    { value: 'gift_set', label: 'Gift Set', subcategories: ['Perfume Sets', 'Attar Sets', 'Mixed Sets'] }
  ];

  const units = [
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'gram', label: 'Grams (g)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'tola', label: 'Tola' },
    { value: 'liter', label: 'Liters (L)' },
    { value: 'piece', label: 'Pieces' },
    { value: 'bottle', label: 'Bottles' },
    { value: 'vial', label: 'Vials' }
  ];

  const storageLocations = [
    'Warehouse A-1-A', 'Warehouse A-1-B', 'Warehouse A-1-C',
    'Warehouse A-2-A', 'Warehouse A-2-B', 'Warehouse A-2-C',
    'Cold Storage A-1', 'Cold Storage A-2',
    'Climate Control C-1', 'Climate Control C-2',
    'Quality Lab B-1', 'Quality Lab B-2',
    'Finished Goods F-1', 'Finished Goods F-2'
  ];

  const commonCertifications = [
    'Halal Certified', 'UAE Quality Mark', 'ISO 9001', 'Natural Product',
    'Organic Certified', 'Cruelty Free', 'Vegan Friendly', 'IFRA Compliant'
  ];

  // Platform configurations for different e-commerce exports
  const platformConfigs = {
    auto: { name: 'Auto-detect', icon: '🔍' },
    woocommerce: {
      name: 'WooCommerce',
      icon: '🛒',
      fields: {
        name: ['Name', 'Product name', 'Title', 'Product title'],
        sku: ['SKU', 'Product SKU', 'sku'],
        price: ['Regular price', 'Sale price', 'Price', 'Cost'],
        description: ['Description', 'Short description', 'Product description'],
        category: ['Categories', 'Product categories', 'Category'],
        stock: ['Stock', 'Stock quantity', 'Quantity', 'In stock?', 'In stock']
      }
    },
    shopify: {
      name: 'Shopify',
      icon: '🛍️',
      fields: {
        name: ['Title', 'Product Title', 'Name'],
        sku: ['Variant SKU', 'SKU', 'Handle'],
        price: ['Variant Price', 'Price', 'Compare At Price'],
        description: ['Body (HTML)', 'Description'],
        category: ['Product Type', 'Tags', 'Vendor'],
        stock: ['Variant Inventory Qty', 'Inventory Quantity']
      }
    },
    amazon: {
      name: 'Amazon',
      icon: '📦',
      fields: {
        name: ['Product Name', 'Title', 'Item Name'],
        sku: ['SKU', 'ASIN', 'Product ID'],
        price: ['Price', 'List Price', 'Your Price'],
        description: ['Product Description', 'Description'],
        category: ['Product Type', 'Category', 'Browse Node'],
        stock: ['Quantity', 'Available Quantity']
      }
    },
    noon: {
      name: 'Noon',
      icon: '🌙',
      fields: {
        name: ['Product Name', 'Title', 'Name'],
        sku: ['SKU', 'Product Code', 'Item Code'],
        price: ['Price', 'Selling Price', 'MRP'],
        description: ['Description', 'Product Description'],
        category: ['Category', 'Product Category', 'Department'],
        stock: ['Stock Quantity', 'Available Stock', 'Inventory']
      }
    },
    magento: {
      name: 'Magento',
      icon: '🏪',
      fields: {
        name: ['name', 'Product Name', 'Title'],
        sku: ['sku', 'SKU', 'Product SKU'],
        price: ['price', 'Price', 'Final Price'],
        description: ['description', 'Short Description'],
        category: ['categories', 'Category Names'],
        stock: ['qty', 'Stock Quantity']
      }
    },
    prestashop: {
      name: 'PrestaShop',
      icon: '🏬',
      fields: {
        name: ['Name', 'Product name', 'name'],
        sku: ['Reference', 'SKU', 'reference'],
        price: ['Price tax excluded', 'Price', 'price'],
        description: ['Description', 'Short description'],
        category: ['Categories', 'Category'],
        stock: ['Quantity', 'Stock', 'quantity']
      }
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i !== ingredient)
    }));
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen.trim()]
      }));
      setNewAllergen('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const generateSKU = () => {
    const category = formData.category.substring(0, 3).toUpperCase();
    const size = formData.size.toString();
    const unit = formData.unit.substring(0, 2).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${category}-${size}${unit}-${random}`;
  };

  const generateBarcode = (type: 'EAN13' | 'UPC' | 'CODE128' = 'EAN13') => {
    if (type === 'EAN13') {
      // Generate EAN-13 barcode (13 digits)
      // Country code (first 3 digits) - 784 for UAE
      const countryCode = '784';
      // Manufacturer code (next 4-6 digits)
      const manufacturerCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      // Product code (next 3-5 digits)
      const productCode = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

      // Calculate check digit
      const digits = (countryCode + manufacturerCode + productCode).split('').map(Number);
      let sum = 0;
      for (let i = 0; i < digits.length; i++) {
        sum += digits[i] * (i % 2 === 0 ? 1 : 3);
      }
      const checkDigit = (10 - (sum % 10)) % 10;

      return countryCode + manufacturerCode + productCode + checkDigit;
    } else if (type === 'UPC') {
      // Generate UPC-A barcode (12 digits)
      const manufacturerCode = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
      const productCode = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

      const digits = (manufacturerCode + productCode).split('').map(Number);
      let sum = 0;
      for (let i = 0; i < digits.length; i++) {
        sum += digits[i] * (i % 2 === 0 ? 3 : 1);
      }
      const checkDigit = (10 - (sum % 10)) % 10;

      return manufacturerCode + productCode + checkDigit;
    } else {
      // CODE128 - alphanumeric
      const prefix = 'OUD';
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      return `${prefix}${timestamp}${random}`;
    }
  };

  const calculatePricing = () => {
    const basePrice = formData.costPerUnit;
    const markup = formData.grade === 'PREMIUM' ? 2.5 :
                  formData.grade === 'LUXURY' ? 3.0 :
                  formData.grade === 'STANDARD' ? 2.0 : 1.5;

    const retailPrice = Math.round(basePrice * markup);
    const wholesalePrice = Math.round(retailPrice * 0.8);
    const vipPrice = Math.round(retailPrice * 0.9);

    setFormData(prev => ({
      ...prev,
      retailPrice,
      wholesalePrice,
      vipPrice
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';
        break;
      case 2: // Physical Properties
        if (formData.size <= 0) newErrors.size = 'Size must be greater than 0';
        if (!formData.unit) newErrors.unit = 'Unit is required';
        if (formData.weight <= 0) newErrors.weight = 'Weight must be greater than 0';
        break;
      case 3: // Inventory & Storage
        if (formData.minimumStock < 0) newErrors.minimumStock = 'Minimum stock cannot be negative';
        if (formData.maximumStock <= formData.minimumStock) newErrors.maximumStock = 'Maximum stock must be greater than minimum stock';
        if (formData.reorderLevel < formData.minimumStock) newErrors.reorderLevel = 'Reorder level should be at least minimum stock';
        if (!formData.storageLocation) newErrors.storageLocation = 'Storage location is required';
        break;
      case 4: // Pricing
        if (formData.costPerUnit <= 0) newErrors.costPerUnit = 'Cost per unit must be greater than 0';
        if (formData.retailPrice <= formData.costPerUnit) newErrors.retailPrice = 'Retail price must be greater than cost';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // First, get or create the category
      let categoryId = '';
      try {
        // Try to find existing category
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();

        let existingCategory = categoriesData.categories?.find(
          (cat: any) => cat.name.toLowerCase() === formData.category.toLowerCase()
        );

        if (!existingCategory) {
          // Create new category
          const createCategoryResponse = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.category || 'General',
              description: `Auto-created category for ${formData.category}`
            })
          });
          const newCategory = await createCategoryResponse.json();
          categoryId = newCategory.id;
        } else {
          categoryId = existingCategory.id;
        }
      } catch (error) {
        console.error('Error handling category:', error);
        throw new Error('Failed to process category');
      }

      // Get or create brand if specified
      let brandId = undefined;
      if (formData.brand && formData.brand !== '') {
        try {
          const brandsResponse = await fetch('/api/brands');
          const brandsData = await brandsResponse.json();

          let existingBrand = brandsData.brands?.find(
            (brand: any) => brand.name.toLowerCase() === formData.brand.toLowerCase()
          );

          if (!existingBrand) {
            const createBrandResponse = await fetch('/api/brands', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: formData.brand,
                description: `Auto-created brand for ${formData.brand}`
              })
            });
            const newBrand = await createBrandResponse.json();
            brandId = newBrand.id;
          } else {
            brandId = existingBrand.id;
          }
        } catch (error) {
          console.error('Error handling brand:', error);
          // Continue without brand if it fails
        }
      }

      // Create the product
      const productResponse = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          nameArabic: formData.nameArabic,
          sku: formData.sku || `SKU-${Date.now()}`,
          barcode: formData.barcode || null,
          categoryId: categoryId,
          brandId: brandId,
          description: formData.description,
          unit: formData.unit,
          unitPrice: formData.retailPrice,
          costPrice: formData.costPerUnit,
          stockQuantity: 0, // Start with 0, add via inventory
          minStock: formData.minimumStock,
          maxStock: formData.maximumStock,
          weight: formData.weight,
          volume: formData.size,
          images: formData.images,
          tags: formData.tags,
          isActive: true,
          isFeatured: false
        })
      });

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const newProduct = await productResponse.json();

      // Add to imported products list
      setImportedProducts(prev => [...prev, formData]);
      setShowImportedProducts(true);

      alert(`Product "${newProduct.name}" created successfully! SKU: ${newProduct.sku}`);

      // Reset form
      setCurrentStep(1);
      setFormData({
        name: '',
        nameArabic: '',
        sku: '',
        barcode: '',
        category: '',
        subcategory: '',
        productType: 'FINISHED_PRODUCT',
        brand: 'Oud Palace',
        collection: '',
        size: 0,
        unit: 'ml',
        weight: 0,
        minimumStock: 0,
        maximumStock: 0,
        reorderLevel: 0,
        storageLocation: '',
        storageConditions: '',
        shelfLife: 36,
        costPerUnit: 0,
        retailPrice: 0,
        wholesalePrice: 0,
        vipPrice: 0,
        currency: 'AED',
        taxRate: 5,
        grade: 'STANDARD',
        ingredients: [],
        allergens: [],
        packagingType: '',
        packagingMaterial: '',
        packagingColor: '',
        packagingWeight: 0,
        certifications: [],
        isHalal: false,
        isOrganic: false,
        description: '',
        productionNotes: '',
        tags: [],
        images: []
      });
    } catch (error) {
      console.error('Error creating product:', error);
      alert(`Error creating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excel template download function
  const downloadExcelTemplate = () => {
    const template = [
      [
        'Product Name*', 'Arabic Name', 'SKU*', 'Barcode', 'Category*', 'Subcategory*',
        'Product Type', 'Brand', 'Collection', 'Size*', 'Unit*', 'Weight*',
        'Min Stock*', 'Max Stock*', 'Reorder Level*', 'Storage Location*', 'Storage Conditions',
        'Shelf Life (months)', 'Cost Per Unit*', 'Retail Price*', 'Wholesale Price', 'VIP Price',
        'Currency', 'Tax Rate %', 'Grade', 'Origin', 'Density', 'Purity %', 'Moisture %',
        'Ingredients', 'Allergens', 'Packaging Type', 'Packaging Material', 'Packaging Color',
        'Packaging Weight', 'Certifications', 'Is Halal', 'Is Organic', 'Description',
        'Production Notes', 'Tags'
      ],
      [
        'Royal Oud Supreme', 'العود الملكي الفاخر', 'OUD-12ML-001', '1234567890123',
        'oud', 'Oud Oil', 'FINISHED_PRODUCT', 'Oud Palace', 'Royal Collection',
        '12', 'ml', '350', '50', '500', '75', 'Warehouse A-1-A',
        'Cool, dry place away from sunlight', '36', '180', '450', '350', '400',
        'AED', '5', 'PREMIUM', 'Cambodia', '0.85', '98.5', '0.2',
        'Oud Oil, Carrier Oil', 'None', 'Luxury Bottle', 'Crystal Glass', 'Gold',
        '200', 'Halal Certified, UAE Quality Mark', 'TRUE', 'FALSE',
        'Premium Cambodian oud oil with exceptional fragrance', 'Handle with care',
        'luxury, premium, oud, fragrance'
      ]
    ];

    const csvContent = template.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'product_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Platform detection function
  const detectPlatform = (headers: string[]): string => {
    const headerStr = headers.join('|').toLowerCase();

    // WooCommerce signatures
    if (headerStr.includes('regular price') || headerStr.includes('woocommerce') ||
        (headerStr.includes('sku') && headerStr.includes('stock')) ||
        (headerStr.includes('sale price') && headerStr.includes('categories')) ||
        headerStr.includes('short description') ||
        headerStr.includes('in stock?') ||
        (headerStr.includes('type') && headerStr.includes('published') && headerStr.includes('name'))) {
      return 'woocommerce';
    }

    // Shopify signatures
    if (headerStr.includes('variant sku') || headerStr.includes('variant price') ||
        headerStr.includes('body (html)') || headerStr.includes('handle')) {
      return 'shopify';
    }

    // Amazon signatures
    if (headerStr.includes('asin') || headerStr.includes('browse node') ||
        headerStr.includes('your price') || headerStr.includes('list price')) {
      return 'amazon';
    }

    // Noon signatures
    if (headerStr.includes('noon') || headerStr.includes('product code') ||
        headerStr.includes('mrp') || headerStr.includes('selling price')) {
      return 'noon';
    }

    // Magento signatures
    if (headerStr.includes('final price') || headerStr.includes('categories') ||
        (headerStr.includes('sku') && headerStr.includes('qty'))) {
      return 'magento';
    }

    // PrestaShop signatures
    if (headerStr.includes('reference') || headerStr.includes('price tax excluded') ||
        headerStr.includes('prestashop')) {
      return 'prestashop';
    }

    return 'custom';
  };

  // Smart field mapping function
  const mapFieldValue = (platform: string, fieldType: string, headers: string[], values: string[]): any => {
    const config = platformConfigs[platform as keyof typeof platformConfigs];
    if (!config || !config.fields) {
      console.log(`No config found for platform: ${platform}`);
      return '';
    }

    const possibleFields = config.fields[fieldType as keyof typeof config.fields] || [];
    console.log(`Mapping ${fieldType} for ${platform}. Possible fields:`, possibleFields);

    for (const possibleField of possibleFields) {
      const headerIndex = headers.findIndex(h =>
        h.toLowerCase().includes(possibleField.toLowerCase()) ||
        possibleField.toLowerCase().includes(h.toLowerCase())
      );

      if (headerIndex !== -1 && values[headerIndex]) {
        console.log(`Found ${fieldType}: ${possibleField} -> ${values[headerIndex]} (index: ${headerIndex})`);
        return values[headerIndex];
      }
    }

    console.log(`No mapping found for ${fieldType} on platform ${platform}`);
    return '';
  };

  // Enhanced bulk upload handler
  const handleBulkUpload = async (file: File) => {
    if (!file) return;

    setBulkUploadFile(file);
    setIsProcessingUpload(true);
    setUploadProgress(0);
    setUploadErrors([]);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

      // Debug: Log headers
      console.log('CSV Headers:', headers);

      // Detect platform if auto-detect is selected
      let platformToUse = selectedPlatform;
      if (selectedPlatform === 'auto') {
        platformToUse = detectPlatform(headers);
        console.log('Detected platform:', platformToUse);
        setDetectedPlatform(platformToUse);
      }

      console.log('Using platform:', platformToUse);

      const products: ProductFormData[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        setUploadProgress((i / lines.length) * 100);

        try {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          const product: any = {};

          // Smart mapping based on platform
          if (platformToUse !== 'custom') {
            product.name = mapFieldValue(platformToUse, 'name', headers, values);
            product.sku = mapFieldValue(platformToUse, 'sku', headers, values) || generateSKU() + `-${i}`;
            const price = mapFieldValue(platformToUse, 'price', headers, values);
            product.retailPrice = parseFloat(price?.replace(/[^\d.,]/g, '') || '0') || 0;
            product.description = mapFieldValue(platformToUse, 'description', headers, values);
            product.category = mapFieldValue(platformToUse, 'category', headers, values) || 'perfume';
            const stock = mapFieldValue(platformToUse, 'stock', headers, values);
            product.minimumStock = Math.max(parseInt(stock || '10'), 10);
            product.maximumStock = Math.max(product.minimumStock * 10, 100);

            // Set standard defaults for platform imports
            product.nameArabic = '';
            product.barcode = '';
            product.subcategory = 'Eau de Parfum';
            product.productType = 'FINISHED_PRODUCT';
            product.brand = product.name?.split(' ')[0] || 'Unknown';
            product.collection = '';
            product.size = 50;
            product.unit = 'ml';
            product.weight = 100;
            product.reorderLevel = Math.floor(product.minimumStock * 1.5);
            product.storageLocation = 'Warehouse A-1-A';
            product.storageConditions = 'Store in cool, dry place';
            product.shelfLife = 36;
            product.costPerUnit = product.retailPrice * 0.6;
            product.wholesalePrice = product.retailPrice * 0.8;
            product.vipPrice = product.retailPrice * 0.9;
            product.currency = 'AED';
            product.taxRate = 5;
            product.grade = 'STANDARD';
            product.ingredients = [];
            product.allergens = [];
            product.packagingType = '';
            product.packagingMaterial = '';
            product.packagingColor = '';
            product.packagingWeight = 0;
            product.certifications = [];
            product.isHalal = false;
            product.isOrganic = false;
            product.productionNotes = `Imported from ${platformConfigs[platformToUse as keyof typeof platformConfigs]?.name || 'platform'}`;
            product.tags = ['imported', platformToUse];
            product.images = [];
          } else {
            // Fallback to original manual mapping
            headers.forEach((header, index) => {
              const value = values[index] || '';

              switch (header) {
                case 'Product Name*':
                case 'Product Name':
                case 'Name':
                case 'Title':
                  product.name = value;
                  break;
              case 'Arabic Name':
                product.nameArabic = value;
                break;
              case 'SKU*':
                product.sku = value;
                break;
              case 'Barcode':
                product.barcode = value;
                break;
              case 'Category*':
                product.category = value;
                break;
              case 'Subcategory*':
                product.subcategory = value;
                break;
              case 'Product Type':
                product.productType = value || 'FINISHED_PRODUCT';
                break;
              case 'Brand':
                product.brand = value || 'Oud Palace';
                break;
              case 'Collection':
                product.collection = value;
                break;
              case 'Size*':
                product.size = parseFloat(value) || 0;
                break;
              case 'Unit*':
                product.unit = value || 'ml';
                break;
              case 'Weight*':
                product.weight = parseFloat(value) || 0;
                break;
              case 'Min Stock*':
                product.minimumStock = parseInt(value) || 0;
                break;
              case 'Max Stock*':
                product.maximumStock = parseInt(value) || 0;
                break;
              case 'Reorder Level*':
                product.reorderLevel = parseInt(value) || 0;
                break;
              case 'Storage Location*':
                product.storageLocation = value;
                break;
              case 'Storage Conditions':
                product.storageConditions = value;
                break;
              case 'Shelf Life (months)':
                product.shelfLife = parseInt(value) || 36;
                break;
              case 'Cost Per Unit*':
                product.costPerUnit = parseFloat(value) || 0;
                break;
              case 'Retail Price*':
                product.retailPrice = parseFloat(value) || 0;
                break;
              case 'Wholesale Price':
                product.wholesalePrice = parseFloat(value) || 0;
                break;
              case 'VIP Price':
                product.vipPrice = parseFloat(value) || 0;
                break;
              case 'Currency':
                product.currency = value || 'AED';
                break;
              case 'Tax Rate %':
                product.taxRate = parseFloat(value) || 5;
                break;
              case 'Grade':
                product.grade = value || 'STANDARD';
                break;
              case 'Origin':
                product.origin = value;
                break;
              case 'Density':
                product.density = value ? parseFloat(value) : undefined;
                break;
              case 'Purity %':
                product.purity = value ? parseFloat(value) : undefined;
                break;
              case 'Moisture %':
                product.moistureContent = value ? parseFloat(value) : undefined;
                break;
              case 'Ingredients':
                product.ingredients = value ? value.split(',').map(i => i.trim()) : [];
                break;
              case 'Allergens':
                product.allergens = value ? value.split(',').map(a => a.trim()) : [];
                break;
              case 'Packaging Type':
                product.packagingType = value;
                break;
              case 'Packaging Material':
                product.packagingMaterial = value;
                break;
              case 'Packaging Color':
                product.packagingColor = value;
                break;
              case 'Packaging Weight':
                product.packagingWeight = parseInt(value) || 0;
                break;
              case 'Certifications':
                product.certifications = value ? value.split(',').map(c => c.trim()) : [];
                break;
              case 'Is Halal':
                product.isHalal = value.toLowerCase() === 'true';
                break;
              case 'Is Organic':
                product.isOrganic = value.toLowerCase() === 'true';
                break;
              case 'Description':
                product.description = value;
                break;
              case 'Production Notes':
                product.productionNotes = value;
                break;
              case 'Tags':
                product.tags = value ? value.split(',').map(t => t.trim()) : [];
                break;
            }
          });
          }

          // Set default values for missing fields
          product.images = [];

          // Validate required fields
          if (!product.name || !product.sku || !product.category || !product.subcategory) {
            errors.push(`Row ${i + 1}: Missing required fields`);
            continue;
          }

          products.push(product as ProductFormData);
        } catch (error) {
          errors.push(`Row ${i + 1}: Error parsing data - ${error}`);
        }
      }

      setUploadedProducts(products);
      setUploadErrors(errors);
      setUploadProgress(100);

      if (products.length > 0) {
        alert(`Successfully processed ${products.length} products${errors.length > 0 ? ` with ${errors.length} errors` : ''}`);
      } else {
        alert('No valid products found in the file');
      }
    } catch (error) {
      setUploadErrors([`File processing error: ${error}`]);
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // Web scraping function
  const scrapeProductData = async () => {
    if (!scrapingUrl.trim()) {
      setScrapingError('Please enter a valid URL');
      return;
    }

    setIsScrapingData(true);
    setScrapingError('');

    try {
      // Call the real scraping API
      const response = await fetch('/api/scrape-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: scrapingUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to scrape products');
      }

      if (result.success && result.products && result.products.length > 0) {
        // Convert scraped products to our format and add to uploaded products list
        const scrapedProducts = result.products.map((product: any, index: number) => ({
          name: product.name || '',
          nameArabic: '',
          sku: product.sku || generateSKU() + `-${index}`,
          barcode: '',
          category: 'perfume',
          subcategory: 'Eau de Parfum',
          productType: 'FINISHED_PRODUCT' as const,
          brand: product.brand || 'Unknown',
          collection: '',
          size: 50,
          unit: 'ml',
          weight: 100,
          minimumStock: 10,
          maximumStock: 100,
          reorderLevel: 25,
          storageLocation: 'Warehouse A-1-A',
          storageConditions: 'Store in cool, dry place',
          shelfLife: 36,
          costPerUnit: parseFloat(product.price?.replace(/[^0-9.]/g, '') || '0') * 0.6 || 0,
          retailPrice: parseFloat(product.price?.replace(/[^0-9.]/g, '') || '0') || 0,
          wholesalePrice: 0,
          vipPrice: 0,
          currency: 'AED',
          taxRate: 5,
          grade: 'STANDARD' as const,
          origin: '',
          purity: undefined,
          density: undefined,
          moistureContent: undefined,
          ingredients: [],
          allergens: [],
          packagingType: '',
          packagingMaterial: '',
          packagingColor: '',
          packagingWeight: 0,
          certifications: [],
          isHalal: false,
          isOrganic: false,
          description: product.description || '',
          productionNotes: '',
          tags: ['scraped', 'imported'],
          images: product.imageUrl ? [product.imageUrl] : []
        }));

        setUploadedProducts(scrapedProducts);

        // If single product, also fill the form
        if (scrapedProducts.length === 1) {
          const product = scrapedProducts[0];
          setFormData(prev => ({
            ...prev,
            ...product
          }));
        }

        alert(`Successfully scraped ${scrapedProducts.length} products from ${result.siteType} site!`);
      } else {
        throw new Error('No products found on this page. Please try a different URL or product listing page.');
      }
    } catch (error) {
      console.error('Scraping error:', error);
      setScrapingError(error instanceof Error ? error.message : 'Failed to scrape product data. Please check the URL and try again.');
    } finally {
      setIsScrapingData(false);
    }
  };

  // Process bulk uploaded products
  const processBulkProducts = async () => {
    if (uploadedProducts.length === 0) return;

    setIsSubmitting(true);
    try {
      // Simulate bulk processing
      for (let i = 0; i < uploadedProducts.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUploadProgress(((i + 1) / uploadedProducts.length) * 100);
      }

      // Save imported products for viewing
      setImportedProducts([...uploadedProducts]);
      setShowImportedProducts(true);

      alert(`Successfully created ${uploadedProducts.length} products!`);

      // Reset bulk upload state
      setUploadedProducts([]);
      setBulkUploadFile(null);
      setUploadProgress(0);
      setUploadMode('manual');
    } catch (error) {
      alert('Error processing bulk products. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Product editing functions
  const startEditingProduct = (index: number) => {
    setEditingIndex(index);
    setEditingProduct({ ...uploadedProducts[index] });
  };

  const cancelEditingProduct = () => {
    setEditingIndex(null);
    setEditingProduct(null);
  };

  const saveEditingProduct = () => {
    if (editingIndex !== null && editingProduct) {
      const updatedProducts = [...uploadedProducts];
      updatedProducts[editingIndex] = editingProduct;
      setUploadedProducts(updatedProducts);
      setEditingIndex(null);
      setEditingProduct(null);
    }
  };

  const deleteProduct = (index: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = uploadedProducts.filter((_, i) => i !== index);
      setUploadedProducts(updatedProducts);
    }
  };

  const updateEditingProduct = (field: keyof ProductFormData, value: any) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Basic Information
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Royal Oud Supreme"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameArabic">Arabic Name</Label>
                <Input
                  id="nameArabic"
                  value={formData.nameArabic}
                  onChange={(e) => handleInputChange('nameArabic', e.target.value)}
                  placeholder="الاسم بالعربية"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Product SKU"
                    className={errors.sku ? 'border-red-500' : ''}
                  />
                  <Button variant="outline" onClick={() => handleInputChange('sku', generateSKU())}>
                    <Calculator className="h-4 w-4" />
                  </Button>
                </div>
                {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <div className="flex space-x-2">
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                    placeholder="Product barcode (manual or auto-generate)"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Calculator className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleInputChange('barcode', generateBarcode('EAN13'))}>
                        <Barcode className="h-4 w-4 mr-2" />
                        Generate EAN-13 (UAE)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleInputChange('barcode', generateBarcode('UPC'))}>
                        <Barcode className="h-4 w-4 mr-2" />
                        Generate UPC-A
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleInputChange('barcode', generateBarcode('CODE128'))}>
                        <Hash className="h-4 w-4 mr-2" />
                        Generate CODE128
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the calculator button to auto-generate a barcode
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    handleInputChange('category', value);
                    handleInputChange('subcategory', ''); // Reset subcategory
                  }}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory *</Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => handleInputChange('subcategory', value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger className={errors.subcategory ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && categories
                      .find(c => c.value === formData.category)
                      ?.subcategories.map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.subcategory && <p className="text-sm text-red-500">{errors.subcategory}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type</Label>
                <Select
                  value={formData.productType}
                  onValueChange={(value: any) => handleInputChange('productType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RAW_MATERIAL">Raw Material</SelectItem>
                    <SelectItem value="SEMI_FINISHED">Semi-Finished</SelectItem>
                    <SelectItem value="FINISHED_PRODUCT">Finished Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Brand name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collection">Collection</Label>
                <Input
                  id="collection"
                  value={formData.collection}
                  onChange={(e) => handleInputChange('collection', e.target.value)}
                  placeholder="Product collection"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed product description..."
                rows={3}
              />
            </div>
          </div>
        );

      case 2: // Physical Properties
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Size/Volume *</Label>
                <Input
                  id="size"
                  type="number"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', parseFloat(e.target.value) || 0)}
                  placeholder="100"
                  className={errors.size ? 'border-red-500' : ''}
                />
                {errors.size && <p className="text-sm text-red-500">{errors.size}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit of Measure *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleInputChange('unit', value)}
                >
                  <SelectTrigger className={errors.unit ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (grams) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  placeholder="350"
                  className={errors.weight ? 'border-red-500' : ''}
                />
                {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Quality Grade</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value: any) => handleInputChange('grade', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ECONOMY">Economy</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                    <SelectItem value="LUXURY">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origin/Source</Label>
                <Input
                  id="origin"
                  value={formData.origin || ''}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="e.g., Cambodia, India, Bulgaria"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="density">Density (g/ml)</Label>
                <Input
                  id="density"
                  type="number"
                  step="0.01"
                  value={formData.density || ''}
                  onChange={(e) => handleInputChange('density', parseFloat(e.target.value) || undefined)}
                  placeholder="0.85"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purity">Purity (%)</Label>
                <Input
                  id="purity"
                  type="number"
                  step="0.1"
                  value={formData.purity || ''}
                  onChange={(e) => handleInputChange('purity', parseFloat(e.target.value) || undefined)}
                  placeholder="98.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moistureContent">Moisture Content (%)</Label>
              <Input
                id="moistureContent"
                type="number"
                step="0.1"
                value={formData.moistureContent || ''}
                onChange={(e) => handleInputChange('moistureContent', parseFloat(e.target.value) || undefined)}
                placeholder="0.2"
              />
            </div>
          </div>
        );

      case 3: // Inventory & Storage
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumStock">Minimum Stock *</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  value={formData.minimumStock}
                  onChange={(e) => handleInputChange('minimumStock', parseInt(e.target.value) || 0)}
                  placeholder="50"
                  className={errors.minimumStock ? 'border-red-500' : ''}
                />
                {errors.minimumStock && <p className="text-sm text-red-500">{errors.minimumStock}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maximumStock">Maximum Stock *</Label>
                <Input
                  id="maximumStock"
                  type="number"
                  value={formData.maximumStock}
                  onChange={(e) => handleInputChange('maximumStock', parseInt(e.target.value) || 0)}
                  placeholder="500"
                  className={errors.maximumStock ? 'border-red-500' : ''}
                />
                {errors.maximumStock && <p className="text-sm text-red-500">{errors.maximumStock}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder Level *</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => handleInputChange('reorderLevel', parseInt(e.target.value) || 0)}
                  placeholder="75"
                  className={errors.reorderLevel ? 'border-red-500' : ''}
                />
                {errors.reorderLevel && <p className="text-sm text-red-500">{errors.reorderLevel}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storageLocation">Storage Location *</Label>
                <Select
                  value={formData.storageLocation}
                  onValueChange={(value) => handleInputChange('storageLocation', value)}
                >
                  <SelectTrigger className={errors.storageLocation ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select storage location" />
                  </SelectTrigger>
                  <SelectContent>
                    {storageLocations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.storageLocation && <p className="text-sm text-red-500">{errors.storageLocation}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shelfLife">Shelf Life (months)</Label>
                <Input
                  id="shelfLife"
                  type="number"
                  value={formData.shelfLife}
                  onChange={(e) => handleInputChange('shelfLife', parseInt(e.target.value) || 36)}
                  placeholder="36"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageConditions">Storage Conditions</Label>
              <Textarea
                id="storageConditions"
                value={formData.storageConditions}
                onChange={(e) => handleInputChange('storageConditions', e.target.value)}
                placeholder="Store in cool, dry place away from direct sunlight. Temperature: 15-25°C, Humidity: <60%"
                rows={3}
              />
            </div>
          </div>
        );

      case 4: // Pricing
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPerUnit">Cost per Unit *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="costPerUnit"
                    type="number"
                    step="0.01"
                    value={formData.costPerUnit}
                    onChange={(e) => handleInputChange('costPerUnit', parseFloat(e.target.value) || 0)}
                    placeholder="180.00"
                    className={errors.costPerUnit ? 'border-red-500' : ''}
                  />
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleInputChange('currency', value)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.costPerUnit && <p className="text-sm text-red-500">{errors.costPerUnit}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">VAT Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  value={formData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 5)}
                  placeholder="5.0"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={calculatePricing}>
                <Calculator className="h-4 w-4 mr-2" />
                Auto-Calculate Pricing
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retailPrice">Retail Price *</Label>
                <Input
                  id="retailPrice"
                  type="number"
                  step="0.01"
                  value={formData.retailPrice}
                  onChange={(e) => handleInputChange('retailPrice', parseFloat(e.target.value) || 0)}
                  placeholder="450.00"
                  className={errors.retailPrice ? 'border-red-500' : ''}
                />
                {errors.retailPrice && <p className="text-sm text-red-500">{errors.retailPrice}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="wholesalePrice">Wholesale Price</Label>
                <Input
                  id="wholesalePrice"
                  type="number"
                  step="0.01"
                  value={formData.wholesalePrice}
                  onChange={(e) => handleInputChange('wholesalePrice', parseFloat(e.target.value) || 0)}
                  placeholder="350.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vipPrice">VIP Price</Label>
                <Input
                  id="vipPrice"
                  type="number"
                  step="0.01"
                  value={formData.vipPrice}
                  onChange={(e) => handleInputChange('vipPrice', parseFloat(e.target.value) || 0)}
                  placeholder="400.00"
                />
              </div>
            </div>

            {formData.costPerUnit > 0 && formData.retailPrice > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Pricing Analysis</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Margin:</span>
                    <span className="font-medium ml-2">
                      {(((formData.retailPrice - formData.costPerUnit) / formData.retailPrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-600">Markup:</span>
                    <span className="font-medium ml-2">
                      {((formData.retailPrice / formData.costPerUnit - 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-600">Profit:</span>
                    <span className="font-medium ml-2">
                      {formData.currency} {(formData.retailPrice - formData.costPerUnit).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5: // Composition & Compliance
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Main Ingredients</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Add ingredient"
                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                  />
                  <Button variant="outline" onClick={addIngredient}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeIngredient(ingredient)}>
                      {ingredient} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Allergens</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={newAllergen}
                    onChange={(e) => setNewAllergen(e.target.value)}
                    placeholder="Add allergen"
                    onKeyPress={(e) => e.key === 'Enter' && addAllergen()}
                  />
                  <Button variant="outline" onClick={addAllergen}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allergens.map((allergen, index) => (
                    <Badge key={index} variant="destructive" className="cursor-pointer" onClick={() => removeAllergen(allergen)}>
                      {allergen} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Certifications</Label>
              <div className="grid grid-cols-2 gap-2">
                {commonCertifications.map((cert) => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert}
                      checked={formData.certifications.includes(cert)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('certifications', [...formData.certifications, cert]);
                        } else {
                          handleInputChange('certifications', formData.certifications.filter(c => c !== cert));
                        }
                      }}
                    />
                    <Label htmlFor={cert} className="text-sm">{cert}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isHalal"
                  checked={formData.isHalal}
                  onCheckedChange={(checked) => handleInputChange('isHalal', checked)}
                />
                <Label htmlFor="isHalal">Halal Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOrganic"
                  checked={formData.isOrganic}
                  onCheckedChange={(checked) => handleInputChange('isOrganic', checked)}
                />
                <Label htmlFor="isOrganic">Organic Product</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productionNotes">Production Notes</Label>
              <Textarea
                id="productionNotes"
                value={formData.productionNotes}
                onChange={(e) => handleInputChange('productionNotes', e.target.value)}
                placeholder="Special production instructions, quality control notes, etc."
                rows={3}
              />
            </div>
          </div>
        );

      case 6: // Packaging & Final Details
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="packagingType">Packaging Type</Label>
                <Input
                  id="packagingType"
                  value={formData.packagingType}
                  onChange={(e) => handleInputChange('packagingType', e.target.value)}
                  placeholder="e.g., Luxury Bottle, Standard Bottle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packagingMaterial">Packaging Material</Label>
                <Input
                  id="packagingMaterial"
                  value={formData.packagingMaterial}
                  onChange={(e) => handleInputChange('packagingMaterial', e.target.value)}
                  placeholder="e.g., Crystal Glass, Plastic"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packagingColor">Packaging Color</Label>
                <Input
                  id="packagingColor"
                  value={formData.packagingColor}
                  onChange={(e) => handleInputChange('packagingColor', e.target.value)}
                  placeholder="e.g., Gold, Silver, Transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packagingWeight">Packaging Weight (grams)</Label>
                <Input
                  id="packagingWeight"
                  type="number"
                  value={formData.packagingWeight}
                  onChange={(e) => handleInputChange('packagingWeight', parseInt(e.target.value) || 0)}
                  placeholder="350"
                />
              </div>
            </div>

            <div>
              <Label>Product Tags</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    <Tags className="h-3 w-3 mr-1" />
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-2">
                  <FileImage className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500">Drag and drop images here, or click to select</p>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-yellow-800">Review Your Product Information</h4>
                  <p className="text-sm text-yellow-700">
                    Please review all the information you've entered before submitting.
                    Once created, some fields may require administrative approval to modify.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    'Basic Information',
    'Physical Properties',
    'Inventory & Storage',
    'Pricing',
    'Composition & Compliance',
    'Packaging & Final Details'
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Add Products</h1>
          <p className="text-gray-600">
            Create product entries manually, upload in bulk, or scrape from websites
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={downloadExcelTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy from Existing
          </Button>
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Form
          </Button>
        </div>
      </div>

      {/* Upload Mode Selection */}
      <Tabs value={uploadMode} onValueChange={(value: any) => setUploadMode(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Manual Entry</span>
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center space-x-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Bulk Upload</span>
          </TabsTrigger>
          <TabsTrigger value="webscrape" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Web Scraping</span>
          </TabsTrigger>
        </TabsList>

        {/* Manual Entry Tab */}
        <TabsContent value="manual" className="space-y-4 sm:space-y-6">

      {/* Progress Bar */}
      <Card className="border-amber-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
            </CardTitle>
            <span className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Form Content */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            {currentStep === 1 && <Package className="h-5 w-5 mr-2 text-amber-600" />}
            {currentStep === 2 && <Beaker className="h-5 w-5 mr-2 text-amber-600" />}
            {currentStep === 3 && <MapPin className="h-5 w-5 mr-2 text-amber-600" />}
            {currentStep === 4 && <DollarSign className="h-5 w-5 mr-2 text-amber-600" />}
            {currentStep === 5 && <Sparkles className="h-5 w-5 mr-2 text-amber-600" />}
            {currentStep === 6 && <Gift className="h-5 w-5 mr-2 text-amber-600" />}
            {stepTitles[currentStep - 1]}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Enter basic product information and classification'}
            {currentStep === 2 && 'Define physical properties and quality specifications'}
            {currentStep === 3 && 'Set inventory levels and storage requirements'}
            {currentStep === 4 && 'Configure pricing structure and cost analysis'}
            {currentStep === 5 && 'Define composition, ingredients, and compliance requirements'}
            {currentStep === 6 && 'Add packaging details, tags, and finalize the product'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Product
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Bulk Upload Tab */}
        <TabsContent value="bulk" className="space-y-4 sm:space-y-6">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-600" />
                Bulk Product Upload
              </CardTitle>
              <CardDescription>
                Upload multiple products at once using an Excel/CSV file. Download the template to ensure proper formatting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Template Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-2">Supported Formats</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      We support product exports from major e-commerce platforms:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-600 mb-3">
                      <div>🛒 WooCommerce exports</div>
                      <div>🛍️ Shopify CSV exports</div>
                      <div>📦 Amazon inventory files</div>
                      <div>🌙 Noon marketplace data</div>
                      <div>🏪 Magento product exports</div>
                      <div>🏬 PrestaShop CSV files</div>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Or download our Excel template for manual data entry:
                    </p>
                    <Button onClick={downloadExcelTemplate} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Excel Template
                    </Button>
                  </div>
                </div>
              </div>

              {/* Platform Selection */}
              <div className="space-y-4">
                <Label>Select Platform Format</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(platformConfigs).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={selectedPlatform === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPlatform(key)}
                      className="h-auto p-3 flex flex-col items-center gap-2"
                    >
                      <span className="text-lg">{config.icon}</span>
                      <span className="text-xs">{config.name}</span>
                    </Button>
                  ))}
                </div>
                {selectedPlatform === 'auto' && (
                  <p className="text-sm text-blue-600">
                    🔍 Auto-detect will analyze your file headers to determine the platform format
                  </p>
                )}
                {detectedPlatform && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      ✅ Detected format: <strong>{platformConfigs[detectedPlatform as keyof typeof platformConfigs]?.name}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <Label>Upload Product File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your Excel/CSV file here
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports .csv, .xlsx, .xls files up to 10MB
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('bulk-upload-input')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                      <input
                        id="bulk-upload-input"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleBulkUpload(file);
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {isProcessingUpload && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing file...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* Upload Results */}
              {uploadedProducts.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">
                        File Processed Successfully
                      </h4>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Found {uploadedProducts.length} valid products ready for import
                    </p>
                  </div>

                  {/* Product Preview */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Product Preview</h4>
                    <div className="max-h-64 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uploadedProducts.slice(0, 10).map((product, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {editingIndex === index ? (
                                  <Input
                                    value={editingProduct?.name || ''}
                                    onChange={(e) => updateEditingProduct('name', e.target.value)}
                                    className="min-w-[150px]"
                                  />
                                ) : (
                                  product.name
                                )}
                              </TableCell>
                              <TableCell>
                                {editingIndex === index ? (
                                  <Input
                                    value={editingProduct?.sku || ''}
                                    onChange={(e) => updateEditingProduct('sku', e.target.value)}
                                    className="min-w-[100px]"
                                  />
                                ) : (
                                  product.sku
                                )}
                              </TableCell>
                              <TableCell>
                                {editingIndex === index ? (
                                  <Select
                                    value={editingProduct?.category || ''}
                                    onValueChange={(value) => updateEditingProduct('category', value)}
                                  >
                                    <SelectTrigger className="min-w-[120px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  product.category
                                )}
                              </TableCell>
                              <TableCell>
                                {editingIndex === index ? (
                                  <Input
                                    type="number"
                                    value={editingProduct?.retailPrice || 0}
                                    onChange={(e) => updateEditingProduct('retailPrice', parseFloat(e.target.value) || 0)}
                                    className="min-w-[80px]"
                                  />
                                ) : (
                                  `${product.currency} ${product.retailPrice}`
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  {editingIndex === index ? (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={saveEditingProduct}
                                      >
                                        <Check className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelEditingProduct}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => startEditingProduct(index)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => deleteProduct(index)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {uploadedProducts.length > 10 && (
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          ... and {uploadedProducts.length - 10} more products
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Import Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={processBulkProducts}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Products...
                        </>
                      ) : (
                        <>
                          <Database className="h-4 w-4 mr-2" />
                          Import {uploadedProducts.length} Products
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Upload Errors */}
              {uploadErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="font-medium text-red-900">Import Errors</h4>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {uploadErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-700">
                        • {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Web Scraping Tab */}
        <TabsContent value="webscrape" className="space-y-4 sm:space-y-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-purple-600" />
                Web Scraping
              </CardTitle>
              <CardDescription>
                Automatically extract product information from e-commerce websites and fill missing fields manually.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="scraping-url">Product URL</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="scraping-url"
                      value={scrapingUrl}
                      onChange={(e) => setScrapingUrl(e.target.value)}
                      placeholder="https://example-store.com/product-page"
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={scrapeProductData}
                    disabled={isScrapingData || !scrapingUrl.trim()}
                  >
                    {isScrapingData ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scraping...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Extract Data
                      </>
                    )}
                  </Button>
                </div>
                {scrapingError && (
                  <p className="text-sm text-red-500">{scrapingError}</p>
                )}
              </div>

              {/* Supported Sites */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900 mb-2">Supported Sites</h4>
                    <p className="text-sm text-purple-700 mb-2">
                      Our scraper works best with these popular perfume and fragrance websites:
                    </p>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Fragrantica.com</li>
                      <li>• Parfumo.net</li>
                      <li>• Sephora.com</li>
                      <li>• Ulta.com</li>
                      <li>• Most e-commerce product pages</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Scraped Products Preview */}
              {uploadedProducts.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">
                        Products Extracted Successfully
                      </h4>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Found {uploadedProducts.length} products. You can edit any product details below before importing.
                    </p>
                  </div>

                  {/* Product Preview with Editing */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Extracted Products - Click Edit to Modify
                    </h4>
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uploadedProducts.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {editingIndex === index ? (
                                  <Input
                                    value={editingProduct?.name || ''}
                                    onChange={(e) => updateEditingProduct('name', e.target.value)}
                                    className="min-w-[150px]"
                                  />
                                ) : (
                                  product.name
                                )}
                              </TableCell>
                              <TableCell>
                                {editingIndex === index ? (
                                  <Input
                                    value={editingProduct?.sku || ''}
                                    onChange={(e) => updateEditingProduct('sku', e.target.value)}
                                    className="min-w-[100px]"
                                  />
                                ) : (
                                  product.sku
                                )}
                              </TableCell>
                              <TableCell>
                                {editingIndex === index ? (
                                  <Select
                                    value={editingProduct?.category || ''}
                                    onValueChange={(value) => updateEditingProduct('category', value)}
                                  >
                                    <SelectTrigger className="min-w-[120px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  product.category
                                )}
                              </TableCell>
                              <TableCell>
                                {editingIndex === index ? (
                                  <Input
                                    type="number"
                                    value={editingProduct?.retailPrice || 0}
                                    onChange={(e) => updateEditingProduct('retailPrice', parseFloat(e.target.value) || 0)}
                                    className="min-w-[80px]"
                                  />
                                ) : (
                                  `${product.currency} ${product.retailPrice}`
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  {editingIndex === index ? (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={saveEditingProduct}
                                      >
                                        <Check className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelEditingProduct}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => startEditingProduct(index)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => deleteProduct(index)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Import Actions */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setUploadedProducts([])}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                    <Button
                      onClick={processBulkProducts}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Products...
                        </>
                      ) : (
                        <>
                          <Database className="h-4 w-4 mr-2" />
                          Import {uploadedProducts.length} Products
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Single Product Scraped Data Preview (for single product sites) */}
              {scrapedData && uploadedProducts.length === 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">
                        Data Extracted Successfully
                      </h4>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Product information has been automatically filled. Review and complete any missing fields below.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Extracted Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{scrapedData.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Brand:</span>
                        <span className="ml-2 font-medium">{scrapedData.brand}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium">{scrapedData.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <span className="ml-2 font-medium">{scrapedData.currency} {scrapedData.retailPrice}</span>
                      </div>
                      {scrapedData.description && (
                        <div className="col-span-2">
                          <span className="text-gray-600">Description:</span>
                          <p className="ml-2 text-gray-800 mt-1">{scrapedData.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Switch to Manual Mode */}
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setUploadMode('manual')}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Complete Product Details
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Imported Products Section */}
      {showImportedProducts && importedProducts.length > 0 && (
        <Card className="border-green-100 mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                <CardTitle className="text-green-900">Recently Imported Products</CardTitle>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/inventory', '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All Inventory
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImportedProducts(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              Successfully imported {importedProducts.length} products. You can now view and manage them in your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{product.brand || 'N/A'}</TableCell>
                      <TableCell className="font-medium">
                        {product.currency} {product.retailPrice}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          Min: {product.minimumStock} | Max: {product.maximumStock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Imported
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Total: {importedProducts.length} products imported successfully
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImportedProducts([]);
                    setShowImportedProducts(false);
                  }}
                >
                  Clear History
                </Button>
                <Button
                  onClick={() => window.open('/inventory', '_blank')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Manage Inventory
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}