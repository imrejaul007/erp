import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schema for product creation
const ProductCreateSchema = z.object({
  code: z.string().min(1, 'Product code is required'),
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  baseUnit: z.string().default('piece'),
  costPrice: z.number().min(0).default(0),
  sellingPrice: z.number().min(0, 'Selling price must be non-negative'),
  currency: z.string().default('AED'),
  vatRate: z.number().min(0).default(5),
  minStockLevel: z.number().min(0).default(0),
  maxStockLevel: z.number().min(0).optional(),
  shelfLife: z.number().int().optional(),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true)
});

// GET /api/products - List all products
export const GET = withTenant(async (req, { tenantId, user }) => {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const categoryId = url.searchParams.get('categoryId');
    const brandId = url.searchParams.get('brandId');
    const isActive = url.searchParams.get('isActive');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Build where clause with tenantId
    const whereClause: any = { tenantId };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      whereClause.category = categoryId;
    }

    if (isActive !== null && isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.products.count({ where: whereClause })
    ]);

    return apiResponse({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error: any) {
    console.error('Error fetching products:', error);
    return apiError(error.message || 'Failed to fetch products', 500);
  }
});

// POST /api/products - Create new product
export const POST = withTenant(async (req, { tenantId, user }) => {
  try {
    // Check permissions
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(user.role)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const productData = ProductCreateSchema.parse(body);

    // Check if code is unique within tenant
    const existingProduct = await prisma.products.findFirst({
      where: { code: productData.code, tenantId }
    });

    if (existingProduct) {
      return apiError('Product with this code already exists', 409);
    }

    // Check if SKU is unique within tenant (if provided)
    if (productData.sku) {
      const existingBySku = await prisma.products.findFirst({
        where: { sku: productData.sku, tenantId }
      });

      if (existingBySku) {
        return apiError('Product with this SKU already exists', 409);
      }
    }

    // Create product
    const product = await prisma.products.create({
      data: {
        id: `prod-${Date.now()}`,
        code: productData.code,
        name: productData.name,
        nameAr: productData.nameAr,
        description: productData.description,
        category: productData.category,
        subcategory: productData.subcategory,
        baseUnit: productData.baseUnit,
        costPrice: productData.costPrice,
        sellingPrice: productData.sellingPrice,
        currency: productData.currency,
        vatRate: productData.vatRate,
        minStockLevel: productData.minStockLevel,
        maxStockLevel: productData.maxStockLevel,
        shelfLife: productData.shelfLife,
        barcode: productData.barcode,
        sku: productData.sku,
        imageUrl: productData.imageUrl,
        isActive: productData.isActive,
        tenantId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return apiResponse(product, 201);

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error creating product:', error);
    return apiError(error.message || 'Failed to create product', 500);
  }
});

// PUT /api/products - Update product
export const PUT = withTenant(async (req, { tenantId, user }) => {
  try {
    // Check permissions
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(user.role)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return apiError('Product ID is required', 400);
    }

    // Check if product exists and belongs to tenant
    const existingProduct = await prisma.products.findFirst({
      where: { id, tenantId }
    });

    if (!existingProduct) {
      return apiError('Product not found', 404);
    }

    // Update product
    const product = await prisma.products.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return apiResponse(product);

  } catch (error: any) {
    console.error('Error updating product:', error);
    return apiError(error.message || 'Failed to update product', 500);
  }
});

// DELETE /api/products - Delete product (soft delete)
export const DELETE = withTenant(async (req, { tenantId, user }) => {
  try {
    // Check permissions
    if (!['OWNER', 'ADMIN'].includes(user.role)) {
      return apiError('Insufficient permissions', 403);
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return apiError('Product ID is required', 400);
    }

    // Soft delete by setting isActive to false (with tenant check)
    const product = await prisma.products.updateMany({
      where: { id, tenantId },
      data: { isActive: false }
    });

    if (product.count === 0) {
      return apiError('Product not found', 404);
    }

    return apiResponse({
      message: 'Product deleted successfully',
      product
    });

  } catch (error: any) {
    console.error('Error deleting product:', error);
    return apiError(error.message || 'Failed to delete product', 500);
  }
});
