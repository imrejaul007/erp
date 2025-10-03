/**
 * API input validation schemas using Zod
 * Provides type-safe validation for all API endpoints
 */

import { z } from 'zod';

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),

  // Search
  search: z.object({
    q: z.string().min(1).max(100).optional(),
  }),

  // Date range
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),

  // UUID
  uuid: z.string().uuid(),

  // MongoDB ObjectId
  objectId: z.string().regex(/^[0-9a-fA-F]{24}$/),

  // Email
  email: z.string().email(),

  // Phone
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),

  // Currency amount
  amount: z.number().positive().finite(),

  // Percentage
  percentage: z.number().min(0).max(100),
};

/**
 * User schemas
 */
export const userSchemas = {
  create: z.object({
    email: commonSchemas.email,
    name: z.string().min(1).max(100),
    password: z.string().min(8).max(100),
    role: z.enum(['OWNER', 'MANAGER', 'ACCOUNTANT', 'SALES_STAFF', 'INVENTORY_STAFF', 'USER']),
  }),

  update: z.object({
    name: z.string().min(1).max(100).optional(),
    email: commonSchemas.email.optional(),
    role: z.enum(['OWNER', 'MANAGER', 'ACCOUNTANT', 'SALES_STAFF', 'INVENTORY_STAFF', 'USER']).optional(),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(100),
  }),
};

/**
 * Product/Inventory schemas
 */
export const inventorySchemas = {
  createProduct: z.object({
    name: z.string().min(1).max(200),
    sku: z.string().min(1).max(100),
    category: z.string().min(1).max(100),
    type: z.enum(['RAW_MATERIAL', 'SEMI_FINISHED', 'FINISHED_GOOD']),
    price: commonSchemas.amount,
    cost: commonSchemas.amount.optional(),
    quantity: z.number().int().min(0),
    unit: z.string().min(1).max(50),
    minStock: z.number().int().min(0).optional(),
    maxStock: z.number().int().min(0).optional(),
    description: z.string().max(1000).optional(),
  }),

  updateProduct: z.object({
    name: z.string().min(1).max(200).optional(),
    price: commonSchemas.amount.optional(),
    cost: commonSchemas.amount.optional(),
    quantity: z.number().int().min(0).optional(),
    minStock: z.number().int().min(0).optional(),
    maxStock: z.number().int().min(0).optional(),
    description: z.string().max(1000).optional(),
  }),

  adjustment: z.object({
    productId: z.string().min(1),
    quantity: z.number().int(),
    reason: z.string().min(1).max(500),
    notes: z.string().max(1000).optional(),
  }),

  transfer: z.object({
    productId: z.string().min(1),
    fromLocation: z.string().min(1),
    toLocation: z.string().min(1),
    quantity: z.number().int().positive(),
    notes: z.string().max(1000).optional(),
  }),
};

/**
 * Customer schemas
 */
export const customerSchemas = {
  create: z.object({
    name: z.string().min(1).max(200),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone.optional(),
    type: z.enum(['VIP', 'REGULAR', 'TOURIST', 'CORPORATE']),
    address: z.string().max(500).optional(),
    city: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    notes: z.string().max(1000).optional(),
  }),

  update: z.object({
    name: z.string().min(1).max(200).optional(),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone.optional(),
    type: z.enum(['VIP', 'REGULAR', 'TOURIST', 'CORPORATE']).optional(),
    address: z.string().max(500).optional(),
    city: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    notes: z.string().max(1000).optional(),
  }),
};

/**
 * Sales/Order schemas
 */
export const salesSchemas = {
  createOrder: z.object({
    customerId: z.string().optional(),
    items: z.array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        price: commonSchemas.amount,
        discount: commonSchemas.percentage.optional(),
      })
    ).min(1),
    paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'WALLET', 'GIFT_CARD']),
    notes: z.string().max(1000).optional(),
    discount: commonSchemas.amount.optional(),
  }),

  return: z.object({
    orderId: z.string().min(1),
    items: z.array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        reason: z.string().min(1).max(500),
      })
    ).min(1),
    refundMethod: z.enum(['CASH', 'CARD', 'STORE_CREDIT']),
  }),
};

/**
 * Finance schemas
 */
export const financeSchemas = {
  transaction: z.object({
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(1).max(100),
    amount: commonSchemas.amount,
    date: z.string().datetime(),
    description: z.string().max(500),
    paymentMethod: z.string().max(50).optional(),
    reference: z.string().max(100).optional(),
  }),

  expense: z.object({
    category: z.string().min(1).max(100),
    amount: commonSchemas.amount,
    date: z.string().datetime(),
    vendor: z.string().max(200).optional(),
    description: z.string().max(500),
    receipt: z.string().url().optional(),
  }),
};

/**
 * Validation helper to validate request body
 */
export function validateRequest<T>(schema: z.ZodType<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

/**
 * Validation helper for query parameters
 */
export function validateQuery<T>(schema: z.ZodType<T>, query: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(query);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

/**
 * Format Zod errors for API response
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });

  return formatted;
}
