/**
 * Global search functionality across all modules
 * Provides fast, multi-entity search capabilities
 */

import { prisma } from '@/lib/database/prisma';

export interface SearchResult {
  id: string;
  type: 'product' | 'customer' | 'order' | 'user' | 'supplier';
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  metadata?: Record<string, any>;
}

export interface SearchOptions {
  tenantId: string;
  query: string;
  limit?: number;
  types?: SearchResult['type'][];
}

/**
 * Global search across all entities
 */
export async function globalSearch(options: SearchOptions): Promise<SearchResult[]> {
  const { tenantId, query, limit = 20, types } = options;

  if (!query || query.length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search products
  if (!types || types.includes('product')) {
    const products = await searchProducts(tenantId, searchTerm, limit);
    results.push(...products);
  }

  // Search customers
  if (!types || types.includes('customer')) {
    const customers = await searchCustomers(tenantId, searchTerm, limit);
    results.push(...customers);
  }

  // Search orders
  if (!types || types.includes('order')) {
    const orders = await searchOrders(tenantId, searchTerm, limit);
    results.push(...orders);
  }

  // Limit total results
  return results.slice(0, limit);
}

/**
 * Search products by name, SKU, or description
 */
async function searchProducts(
  tenantId: string,
  query: string,
  limit: number
): Promise<SearchResult[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        tenantId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        category: true,
        quantity: true,
      },
    });

    return products.map((product) => ({
      id: product.id,
      type: 'product' as const,
      title: product.name,
      subtitle: product.sku,
      description: `${product.category} - AED ${product.price} - Stock: ${product.quantity}`,
      url: `/inventory?product=${product.id}`,
      metadata: {
        price: product.price,
        quantity: product.quantity,
        category: product.category,
      },
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

/**
 * Search customers by name, email, or phone
 */
async function searchCustomers(
  tenantId: string,
  query: string,
  limit: number
): Promise<SearchResult[]> {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        tenantId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
      },
    });

    return customers.map((customer) => ({
      id: customer.id,
      type: 'customer' as const,
      title: customer.name,
      subtitle: customer.email || customer.phone || '',
      description: `${customer.type} Customer`,
      url: `/customers?id=${customer.id}`,
      metadata: {
        type: customer.type,
        email: customer.email,
        phone: customer.phone,
      },
    }));
  } catch (error) {
    console.error('Error searching customers:', error);
    return [];
  }
}

/**
 * Search orders by order ID or customer name
 */
async function searchOrders(
  tenantId: string,
  query: string,
  limit: number
): Promise<SearchResult[]> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        OR: [
          { id: { contains: query, mode: 'insensitive' } },
          {
            customer: {
              name: { contains: query, mode: 'insensitive' },
            },
          },
        ],
      },
      take: limit,
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => ({
      id: order.id,
      type: 'order' as const,
      title: `Order #${order.id.slice(0, 8)}`,
      subtitle: order.customer?.name || 'Walk-in Customer',
      description: `AED ${order.total} - ${order.status} - ${new Date(order.createdAt).toLocaleDateString()}`,
      url: `/sales?order=${order.id}`,
      metadata: {
        total: order.total,
        status: order.status,
        date: order.createdAt,
      },
    }));
  } catch (error) {
    console.error('Error searching orders:', error);
    return [];
  }
}

/**
 * Search suggestions / autocomplete
 */
export async function getSearchSuggestions(
  tenantId: string,
  query: string
): Promise<string[]> {
  if (!query || query.length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const suggestions: string[] = [];

  try {
    // Get product names
    const products = await prisma.product.findMany({
      where: {
        tenantId,
        name: { contains: searchTerm, mode: 'insensitive' },
      },
      take: 5,
      select: { name: true },
    });

    suggestions.push(...products.map((p) => p.name));

    // Get customer names
    const customers = await prisma.customer.findMany({
      where: {
        tenantId,
        name: { contains: searchTerm, mode: 'insensitive' },
      },
      take: 5,
      select: { name: true },
    });

    suggestions.push(...customers.map((c) => c.name));

    // Return unique suggestions
    return Array.from(new Set(suggestions)).slice(0, 10);
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
}

/**
 * Advanced search with filters
 */
export interface AdvancedSearchOptions extends SearchOptions {
  filters?: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
  sortBy?: 'relevance' | 'date' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export async function advancedSearch(
  options: AdvancedSearchOptions
): Promise<SearchResult[]> {
  // Implement advanced search with filters
  // This is a placeholder for future implementation
  return globalSearch(options);
}
