import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const categoryId = url.searchParams.get('categoryId');
    const brandId = url.searchParams.get('brandId');
    const isActive = url.searchParams.get('isActive');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Build where clause
    const whereClause: any = {};

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

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const productData = ProductCreateSchema.parse(body);

    // Check if SKU is unique
    const existingProduct = await prisma.product.findUnique({
      where: { sku: productData.sku }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 409 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Verify brand exists if provided
    if (productData.brandId) {
      const brand = await prisma.brand.findUnique({
        where: { id: productData.brandId }
      });

      if (!brand) {
        return NextResponse.json(
          { error: 'Brand not found' },
          { status: 404 }
        );
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
        isFeatured: productData.isFeatured
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

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products - Update product
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
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

    return NextResponse.json(product);

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products - Delete product (soft delete)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json({
      message: 'Product deleted successfully',
      product
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
