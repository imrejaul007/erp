import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schema for product creation
const ProductCreateSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  nameArabic: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().default('piece'),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  costPrice: z.number().min(0).optional(),
  stockQuantity: z.number().min(0).default(0),
  minStock: z.number().min(0).default(0),
  maxStock: z.number().min(0).optional(),
  weight: z.number().optional(),
  volume: z.number().optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
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
        { sku: { contains: search, mode: 'insensitive' } },
        { nameArabic: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (brandId) {
      whereClause.brandId = brandId;
    }

    if (isActive !== null && isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    // Fetch products with relations
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: {
            select: { id: true, name: true, nameArabic: true }
          },
          brand: {
            select: { id: true, name: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where: whereClause })
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

    // Check if SKU is unique within tenant
    const existingProduct = await prisma.product.findFirst({
      where: { sku: productData.sku, tenantId }
    });

    if (existingProduct) {
      return apiError('Product with this SKU already exists', 409);
    }

    // Verify category exists and belongs to tenant
    const category = await prisma.category.findFirst({
      where: { id: productData.categoryId, tenantId }
    });

    if (!category) {
      return apiError('Category not found', 404);
    }

    // Verify brand exists and belongs to tenant if provided
    if (productData.brandId) {
      const brand = await prisma.brand.findFirst({
        where: { id: productData.brandId, tenantId }
      });

      if (!brand) {
        return apiError('Brand not found', 404);
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        nameArabic: productData.nameArabic,
        sku: productData.sku,
        categoryId: productData.categoryId,
        brandId: productData.brandId,
        description: productData.description,
        unit: productData.unit,
        unitPrice: productData.unitPrice,
        costPrice: productData.costPrice,
        stockQuantity: productData.stockQuantity,
        minStock: productData.minStock,
        maxStock: productData.maxStock,
        weight: productData.weight,
        volume: productData.volume,
        images: productData.images ? JSON.stringify(productData.images) : null,
        tags: productData.tags ? JSON.stringify(productData.tags) : null,
        isActive: productData.isActive,
        isFeatured: productData.isFeatured,
        tenantId
      },
      include: {
        category: {
          select: { id: true, name: true, nameArabic: true }
        },
        brand: {
          select: { id: true, name: true }
        }
      }
    });

    return apiResponse(product, 201);

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error', 400, error.errors);
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
    const existingProduct = await prisma.product.findFirst({
      where: { id, tenantId }
    });

    if (!existingProduct) {
      return apiError('Product not found', 404);
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        images: updateData.images ? JSON.stringify(updateData.images) : undefined,
        tags: updateData.tags ? JSON.stringify(updateData.tags) : undefined
      },
      include: {
        category: {
          select: { id: true, name: true, nameArabic: true }
        },
        brand: {
          select: { id: true, name: true }
        }
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
    const product = await prisma.product.updateMany({
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
