import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/production/bom/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const bom = await prisma.bom.findUnique({
      where: { id },
      include: {
        recipe: {
          include: {
            ingredients: {
              include: {
                material: {
                  include: {
                    category: true
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          }
        },
        items: {
          include: {
            material: {
              include: {
                category: true
              }
            }
          },
          orderBy: { material: { name: 'asc' } }
        }
      }
    });

    if (!bom) {
      return NextResponse.json(
        { success: false, error: 'BOM not found' },
        { status: 404 }
      );
    }

    // Calculate material availability
    const availabilityStatus = bom.items.map(item => ({
      materialId: item.materialId,
      materialName: item.material.name,
      required: item.quantity,
      available: item.material.currentStock,
      sufficient: item.material.currentStock >= item.quantity,
      shortfall: Math.max(0, item.quantity - item.material.currentStock)
    }));

    const canProduce = availabilityStatus.every(status => status.sufficient);
    const totalShortfallCost = availabilityStatus.reduce((sum, status) => {
      if (!status.sufficient) {
        const item = bom.items.find(i => i.materialId === status.materialId);
        return sum + (status.shortfall * (item?.unitCost || 0));
      }
      return sum;
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        ...bom,
        availabilityStatus,
        canProduce,
        totalShortfallCost,
        insufficientItems: availabilityStatus.filter(status => !status.sufficient).length
      }
    });

  } catch (error) {
    console.error('Error fetching BOM:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch BOM' },
      { status: 500 }
    );
  }
}

// DELETE /api/production/bom/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if BOM exists and is being used
    const bom = await prisma.bom.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            // Add production batch count when that relationship exists
          }
        }
      }
    });

    if (!bom) {
      return NextResponse.json(
        { success: false, error: 'BOM not found' },
        { status: 404 }
      );
    }

    // Delete BOM and items in transaction
    await prisma.$transaction(async (tx) => {
      // Delete BOM items first
      await tx.bomItem.deleteMany({
        where: { bomId: id }
      });

      // Delete BOM
      await tx.bom.delete({
        where: { id }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'BOM deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting BOM:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete BOM' },
      { status: 500 }
    );
  }
}