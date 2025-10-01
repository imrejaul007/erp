import { z } from 'zod';
import { ProductStatus, UserRole, OrderStatus, PaymentStatus } from '@prisma/client';

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required').max(100),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().min(1, 'Brand is required'),
  costPrice: z.number().min(0, 'Cost price must be positive'),
  sellingPrice: z.number().min(0, 'Selling price must be positive'),
  retailPrice: z.number().min(0).optional(),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be non-negative'),
  minStockLevel: z.number().int().min(0, 'Minimum stock level must be non-negative'),
  maxStockLevel: z.number().int().min(0).optional(),
  reorderPoint: z.number().int().min(0).optional(),
  volume: z.number().min(0).optional(),
  concentration: z.string().optional(),
  longevity: z.string().optional(),
  sillage: z.string().optional(),
  seasonRecommend: z.array(z.string()).default([]),
  genderTarget: z.string().optional(),
  images: z.array(z.string()).default([]),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),
});

export const updateProductSchema = createProductSchema.partial();

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Brand validation schemas
export const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(100),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

export const updateBrandSchema = createBrandSchema.partial();

// Customer validation schemas
export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required').max(255),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  taxId: z.string().optional(),
  type: z.string().optional(),
  creditLimit: z.number().min(0).optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

// Supplier validation schemas
export const createSupplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required').max(255),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  taxId: z.string().optional(),
  contactPerson: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  paymentTerms: z.string().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

// Order validation schemas
export const createOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  discount: z.number().min(0).default(0),
});

export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  items: z.array(createOrderItemSchema).min(1, 'Order must have at least one item'),
  shippingAddress: z.string().optional(),
  shippingMethod: z.string().optional(),
  notes: z.string().optional(),
});

export const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  shippingAddress: z.string().optional(),
  shippingMethod: z.string().optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  image: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial();

// Auth validation schemas
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Query validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const productQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
});

export const orderQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  customerId: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const customerQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
});

// Type exports
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type CustomerQueryInput = z.infer<typeof customerQuerySchema>;