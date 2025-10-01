import { create } from 'zustand';
import { ProductWithRelations, ProductFilters } from '@/types/database';

interface InventoryState {
  products: ProductWithRelations[];
  selectedProducts: Set<string>;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: ProductWithRelations[]) => void;
  addProduct: (product: ProductWithRelations) => void;
  updateProduct: (id: string, product: Partial<ProductWithRelations>) => void;
  removeProduct: (id: string) => void;

  // Selection
  selectProduct: (id: string) => void;
  deselectProduct: (id: string) => void;
  selectAllProducts: () => void;
  clearSelection: () => void;

  // Filters
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;

  // UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Computed
  getFilteredProducts: () => ProductWithRelations[];
  getLowStockProducts: () => ProductWithRelations[];
  getOutOfStockProducts: () => ProductWithRelations[];
  getTotalValue: () => number;
}

const defaultFilters: ProductFilters = {
  search: '',
  categoryId: '',
  brandId: '',
  status: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  inStock: undefined,
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: [],
  selectedProducts: new Set(),
  filters: defaultFilters,
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      ),
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
      selectedProducts: new Set(
        [...state.selectedProducts].filter((selectedId) => selectedId !== id)
      ),
    })),

  // Selection
  selectProduct: (id) =>
    set((state) => ({
      selectedProducts: new Set([...state.selectedProducts, id]),
    })),

  deselectProduct: (id) =>
    set((state) => {
      const newSelected = new Set(state.selectedProducts);
      newSelected.delete(id);
      return { selectedProducts: newSelected };
    }),

  selectAllProducts: () =>
    set((state) => ({
      selectedProducts: new Set(state.products.map((p) => p.id)),
    })),

  clearSelection: () => set({ selectedProducts: new Set() }),

  // Filters
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  // UI State
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Computed
  getFilteredProducts: () => {
    const { products, filters } = get();

    return products.filter((product) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.categoryId && product.categoryId !== filters.categoryId) {
        return false;
      }

      // Brand filter
      if (filters.brandId && product.brandId !== filters.brandId) {
        return false;
      }

      // Status filter
      if (filters.status && product.status !== filters.status) {
        return false;
      }

      // Price filters
      if (filters.minPrice && Number(product.sellingPrice) < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice && Number(product.sellingPrice) > filters.maxPrice) {
        return false;
      }

      // Stock filter
      if (filters.inStock !== undefined) {
        const inStock = product.stockQuantity > 0;
        if (filters.inStock !== inStock) return false;
      }

      return true;
    });
  },

  getLowStockProducts: () => {
    const { products } = get();
    return products.filter(
      (product) =>
        product.stockQuantity > 0 &&
        product.stockQuantity <= product.minStockLevel
    );
  },

  getOutOfStockProducts: () => {
    const { products } = get();
    return products.filter((product) => product.stockQuantity === 0);
  },

  getTotalValue: () => {
    const { products } = get();
    return products.reduce(
      (total, product) =>
        total + Number(product.costPrice) * product.stockQuantity,
      0
    );
  },
}));