import { z } from 'zod';

/**
 * Common validation schemas for reuse across the application
 */

// ============================================================================
// Basic Types
// ============================================================================

export const idSchema = z.string().min(1, 'ID is required');

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .toLowerCase();

export const phoneSchema = z
  .string()
  .regex(/^(\+971|00971|0)?[0-9]{9}$/, 'Invalid UAE phone number format')
  .transform(phone => {
    // Normalize UAE phone numbers to +971XXXXXXXXX format
    phone = phone.replace(/\s/g, '');
    if (phone.startsWith('00971')) return '+971' + phone.substring(5);
    if (phone.startsWith('971')) return '+' + phone;
    if (phone.startsWith('0')) return '+971' + phone.substring(1);
    if (phone.startsWith('+971')) return phone;
    return '+971' + phone;
  });

export const urlSchema = z.string().url('Invalid URL format');

export const currencySchema = z
  .enum(['AED', 'USD', 'EUR', 'GBP', 'SAR'])
  .default('AED');

export const decimalSchema = (min: number = 0, max: number = 999999999) =>
  z.number()
    .or(z.string().transform(Number))
    .pipe(z.number().min(min).max(max));

// ============================================================================
// Date/Time Validators
// ============================================================================

export const dateStringSchema = z
  .string()
  .refine(date => !isNaN(Date.parse(date)), 'Invalid date format');

export const dateRangeSchema = z.object({
  startDate: dateStringSchema,
  endDate: dateStringSchema,
}).refine(
  data => new Date(data.startDate) <= new Date(data.endDate),
  'End date must be after start date'
);

export const futureDateSchema = dateStringSchema.refine(
  date => new Date(date) > new Date(),
  'Date must be in the future'
);

export const pastDateSchema = dateStringSchema.refine(
  date => new Date(date) < new Date(),
  'Date must be in the past'
);

// ============================================================================
// Pagination & Sorting
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const searchSchema = z.object({
  search: z.string().optional(),
  searchFields: z.array(z.string()).optional(),
});

export const listQuerySchema = paginationSchema.merge(sortSchema).merge(searchSchema);

// ============================================================================
// Business Logic Validators
// ============================================================================

export const skuSchema = z
  .string()
  .min(3, 'SKU must be at least 3 characters')
  .max(50, 'SKU must be at most 50 characters')
  .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens')
  .transform(sku => sku.toUpperCase());

export const taxNumberSchema = z
  .string()
  .regex(/^[0-9]{15}$/, 'UAE Tax Registration Number must be 15 digits');

export const emiratesIdSchema = z
  .string()
  .regex(/^784-[0-9]{4}-[0-9]{7}-[0-9]$/, 'Invalid Emirates ID format (784-YYYY-NNNNNNN-N)');

export const poBoxSchema = z
  .string()
  .regex(/^P\.?O\.? ?Box:? ?\d+$/, 'Invalid PO Box format');

// ============================================================================
// Amount & Quantity Validators
// ============================================================================

export const positiveIntSchema = z.coerce.number().int().min(1, 'Must be a positive number');
export const nonNegativeIntSchema = z.coerce.number().int().min(0, 'Cannot be negative');

export const positiveDecimalSchema = z.coerce.number().positive('Must be a positive amount');
export const nonNegativeDecimalSchema = z.coerce.number().min(0, 'Cannot be negative');

export const percentageSchema = z.coerce.number().min(0).max(100, 'Percentage must be between 0 and 100');

export const stockQuantitySchema = z.coerce.number().int().min(0, 'Stock quantity cannot be negative');

export const priceSchema = z.coerce.number().positive('Price must be positive').max(999999, 'Price too large');

// ============================================================================
// User & Authentication Validators
// ============================================================================

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be at most 100 characters')
  .trim();

export const arabicNameSchema = z
  .string()
  .regex(/^[\u0600-\u06FF\s]+$/, 'Must contain only Arabic characters')
  .optional();

// ============================================================================
// Address Validators
// ============================================================================

export const emirateSchema = z.enum([
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
]);

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  area: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  emirate: emirateSchema,
  poBox: poBoxSchema.optional(),
  country: z.string().default('United Arab Emirates'),
});

// ============================================================================
// File Upload Validators
// ============================================================================

export const imageUrlSchema = z
  .string()
  .url('Invalid image URL')
  .refine(
    url => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url),
    'URL must point to an image file'
  );

export const fileUploadSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.string().regex(/^image\/(jpeg|png|gif|webp)$/, 'Only image files are allowed'),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate and parse request body with Zod schema
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error; // Will be handled by error handler
    }
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Validate query parameters with Zod schema
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries());
  return schema.parse(params);
}

/**
 * Validate path parameters with Zod schema
 */
export function validatePathParams<T>(
  params: Record<string, string>,
  schema: z.ZodSchema<T>
): T {
  return schema.parse(params);
}

/**
 * Create a validation schema for arrays with min/max length
 */
export function arraySchema<T>(
  itemSchema: z.ZodSchema<T>,
  minLength: number = 0,
  maxLength: number = 100
) {
  return z.array(itemSchema).min(minLength).max(maxLength);
}

/**
 * Make all fields optional except specified ones
 */
export function partialExcept<T extends z.ZodRawShape, K extends keyof T>(
  schema: z.ZodObject<T>,
  keys: K[]
): z.ZodObject<any> {
  const shape = schema.shape;
  const newShape: any = {};

  for (const key in shape) {
    if (keys.includes(key as K)) {
      newShape[key] = shape[key];
    } else {
      newShape[key] = shape[key].optional();
    }
  }

  return z.object(newShape);
}

/**
 * Validate tenant access - ensure resource belongs to tenant
 */
export function validateTenantAccess(
  resourceTenantId: string,
  requestTenantId: string
): void {
  if (resourceTenantId !== requestTenantId) {
    throw new Error('Cross-tenant access denied');
  }
}

/**
 * Sanitize string input - remove dangerous characters
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Validate and sanitize HTML content
 */
export const htmlContentSchema = z
  .string()
  .transform(sanitizeString)
  .refine(
    content => content.length > 0,
    'Content cannot be empty after sanitization'
  );
