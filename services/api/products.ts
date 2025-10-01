import { apiClient } from './base';
import {
  ProductQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  ApiResponse,
} from '@/types/api';
import { ProductWithRelations, PaginatedResponse } from '@/types/database';

export const productsAPI = {
  // Get all products with pagination and filters
  getProducts: (params?: ProductQueryParams): Promise<ApiResponse<PaginatedResponse<ProductWithRelations>>> => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    return apiClient.get(`/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get single product by ID
  getProduct: (id: string): Promise<ApiResponse<ProductWithRelations>> => {
    return apiClient.get(`/products/${id}`);
  },

  // Create new product
  createProduct: (data: CreateProductRequest): Promise<ApiResponse<ProductWithRelations>> => {
    return apiClient.post('/products', data);
  },

  // Update product
  updateProduct: (id: string, data: UpdateProductRequest): Promise<ApiResponse<ProductWithRelations>> => {
    return apiClient.put(`/products/${id}`, data);
  },

  // Delete product
  deleteProduct: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/products/${id}`);
  },

  // Bulk delete products
  bulkDeleteProducts: (ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> => {
    return apiClient.post('/products/bulk-delete', { ids });
  },

  // Update stock
  updateStock: (id: string, quantity: number, type: 'increase' | 'decrease'): Promise<ApiResponse<ProductWithRelations>> => {
    return apiClient.post(`/products/${id}/stock`, { quantity, type });
  },

  // Get low stock products
  getLowStockProducts: (): Promise<ApiResponse<ProductWithRelations[]>> => {
    return apiClient.get('/products/low-stock');
  },

  // Get out of stock products
  getOutOfStockProducts: (): Promise<ApiResponse<ProductWithRelations[]>> => {
    return apiClient.get('/products/out-of-stock');
  },

  // Import products from CSV
  importProducts: (file: File): Promise<ApiResponse<{ processedCount: number; errors: any[] }>> => {
    const formData = new FormData();
    formData.append('file', file);

    return fetch('/api/products/import', {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  },

  // Export products to CSV
  exportProducts: (params?: ProductQueryParams): Promise<Blob> => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    return fetch(`/api/products/export${queryString ? `?${queryString}` : ''}`)
      .then(res => res.blob());
  },
};