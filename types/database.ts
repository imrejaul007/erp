import {
  Product,
  Category,
  Brand,
  Customer,
  Supplier,
  Order,
  OrderItem,
  User,
  StockMovement,
  UserRole,
  ProductStatus,
  OrderStatus,
  PaymentStatus,
  StockMovementType,
} from '@prisma/client';

// Extended types with relations
export interface ProductWithRelations extends Product {
  category: Category;
  brand: Brand;
  createdBy: User;
  orderItems?: OrderItem[];
  stockMovements?: StockMovement[];
}

export interface CategoryWithRelations extends Category {
  parent?: Category;
  children?: Category[];
  products?: Product[];
}

export interface CustomerWithRelations extends Customer {
  orders: Order[];
  createdBy: User;
}

export interface OrderWithRelations extends Order {
  customer: Customer;
  createdBy: User;
  orderItems: (OrderItem & {
    product: Product;
  })[];
}

export interface SupplierWithRelations extends Supplier {
  createdBy: User;
}

// Form data types
export interface ProductFormData {
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
  status: ProductStatus;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface CustomerFormData {
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

export interface OrderFormData {
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

// Filter and search types
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface OrderFilters {
  search?: string;
  customerId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Dashboard types
export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockItems: number;
  pendingOrders: number;
  monthlyRevenue: number;
  monthlyOrders: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

// Export all enum types
export {
  UserRole,
  ProductStatus,
  OrderStatus,
  PaymentStatus,
  StockMovementType,
};