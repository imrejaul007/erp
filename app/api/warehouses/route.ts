import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const WarehouseCreateSchema = z.object({
  code: z.string().min(1, 'Warehouse code is required'),
  name: z.string().min(1, 'Warehouse name is required'),
  type: z.enum(['STANDARD', 'DISTRIBUTION', 'RETAIL', 'COLD_STORAGE', 'BONDED', 'CONSIGNMENT']).default('STANDARD'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  coordinates: z.object({
    lat: z.string(),
    lng: z.string(),
  }).optional(),
  manager: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  totalCapacity: z.number().positive().optional(),
  capacityUnit: z.string().default('cubic_meter'),
  hasClimateControl: z.boolean().default(false),
  hasSecurity: z.boolean().default(true),
  operatingHours: z.record(z.string()).optional(),
  notes: z.string().optional(),
});

/**
 * GET /api/warehouses - List all warehouses
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };

    if (type) where.type = type;
    if (isActive !== null) where.isActive = isActive === 'true';

    const warehouses = await prisma.warehouse.findMany({
      where,
      include: {
        stockLocations: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
        _count: {
          select: {
            stockLocations: true,
            outboundShipments: true,
            inboundShipments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(warehouses);
  } catch (error: any) {
    console.error('Error fetching warehouses:', error);
    return apiError(error.message || 'Failed to fetch warehouses', 500);
  }
});

/**
 * POST /api/warehouses - Create new warehouse
 */
export const POST = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = WarehouseCreateSchema.parse(body);

    // Check for duplicate warehouse code
    const existing = await prisma.warehouse.findFirst({
      where: { code: validated.code, tenantId },
    });

    if (existing) {
      return apiError('Warehouse with this code already exists', 400);
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        code: validated.code,
        name: validated.name,
        type: validated.type,
        address: validated.address,
        city: validated.city,
        country: validated.country,
        zipCode: validated.zipCode,
        coordinates: validated.coordinates || undefined,
        manager: validated.manager,
        phone: validated.phone,
        email: validated.email,
        totalCapacity: validated.totalCapacity,
        capacityUnit: validated.capacityUnit,
        hasClimateControl: validated.hasClimateControl,
        hasSecurity: validated.hasSecurity,
        operatingHours: validated.operatingHours || undefined,
        notes: validated.notes,
        isActive: true,
        usedCapacity: 0,
        tenantId,
      },
    });

    return apiResponse({
      message: 'Warehouse created successfully',
      warehouse,
    }, 201);
  } catch (error: any) {
    console.error('Error creating warehouse:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create warehouse', 500);
  }
});
