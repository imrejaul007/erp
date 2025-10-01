// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// API Request types
export interface CreateProductRequest {
  name: string;
  description?: string;
  sku: string;
  categoryId: string;
  brandId: string;
  costPrice: number;
  sellingPrice: number;
  retailPrice?: number;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  volume?: number;
  concentration?: string;
  longevity?: string;
  sillage?: string;
  seasonRecommend: string[];
  genderTarget?: string;
  images: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  type?: string;
  creditLimit?: number;
}

export interface CreateOrderRequest {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
  shippingAddress?: string;
  shippingMethod?: string;
  notes?: string;
}

// Query parameters
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  customerId?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Upload types
export interface FileUploadResponse {
  url: string;
  publicId?: string;
  filename: string;
  size: number;
}

export interface BulkImportResponse {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors?: Array<{
    row: number;
    message: string;
  }>;
}