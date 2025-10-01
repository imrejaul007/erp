import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '@/services/api';
import { useUIStore } from '@/store/ui';
import { ProductQueryParams, CreateProductRequest, UpdateProductRequest } from '@/types/api';
import { ProductWithRelations } from '@/types/database';

// Products hooks
export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsAPI.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsAPI.createProduct(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addNotification({
        type: 'success',
        title: 'Product Created',
        message: 'Product has been created successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create product.',
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productsAPI.updateProduct(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      addNotification({
        type: 'success',
        title: 'Product Updated',
        message: 'Product has been updated successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update product.',
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => productsAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addNotification({
        type: 'success',
        title: 'Product Deleted',
        message: 'Product has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete product.',
      });
    },
  });
};

export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (ids: string[]) => productsAPI.bulkDeleteProducts(ids),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addNotification({
        type: 'success',
        title: 'Products Deleted',
        message: `${response.data?.deletedCount || 0} products have been deleted successfully.`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete products.',
      });
    },
  });
};

export const useLowStockProducts = () => {
  return useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: () => productsAPI.getLowStockProducts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOutOfStockProducts = () => {
  return useQuery({
    queryKey: ['products', 'out-of-stock'],
    queryFn: () => productsAPI.getOutOfStockProducts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Generic data fetching hook
export const useApiData = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
  }
) => {
  return useQuery({
    queryKey,
    queryFn,
    enabled: options?.enabled,
    staleTime: options?.staleTime || 5 * 60 * 1000,
    refetchInterval: options?.refetchInterval,
  });
};

// Local storage hook
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

// Debounced search hook
export const useDebouncedSearch = (initialValue: string = '', delay: number = 300) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
  };
};