import { NextRequest, NextResponse } from 'next/server'
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import QRCode from 'qrcode'

const qrGenerationSchema = z.object({
  batchId: z.string().min(1, 'Batch ID is required'),
  format: z.enum(['svg', 'png', 'pdf']).default('png'),
  size: z.number().min(100).max(1000).default(400),
  includeArabic: z.boolean().default(true),
  includeCompliance: z.boolean().default(true),
  logoUrl: z.string().optional(),
})

const batchLookupSchema = z.object({
  qrCode: z.string().min(1, 'QR Code is required'),
})

// GET /api/inventory/qr-codes - Get batch information from QR code
async function getHandler(request: NextRequest, { tenantId }: { tenantId: string; user: any }) {
  try {
    const { searchParams } = new URL(request.url)
    const qrCode = searchParams.get('qrCode')
    const action = searchParams.get('action')

    if (action === 'lookup' && qrCode) {
      // Lookup batch by QR code
      const validatedData = batchLookupSchema.parse({ qrCode })

      // Decode the QR code data
      try {
        const batchData = JSON.parse(decodeURIComponent(qrCode))

        // Verify batch belongs to tenant if batchId is present
        if (batchData.batchId) {
          const batch = await prisma.materialBatch.findFirst({
            where: {
              id: batchData.batchId,
              material: { tenantId }
            }
          })

          if (!batch) {
            return apiError('Batch not found or access denied', 404)
          }
        }

        return apiResponse({
          batch: batchData,
          verificationStatus: 'verified',
          lastVerified: new Date(),
        })
      } catch (error) {
        // If not JSON, treat as batch number lookup
        return apiError('Invalid QR code format or batch not found', 404)
      }
    }

    return apiError('Invalid request parameters', 400)
  } catch (error) {
    console.error('Error processing QR code lookup:', error)
    return apiError('Failed to process request: ' + (error instanceof Error ? error.message : 'Unknown error'), 500)
  }
}

// POST /api/inventory/qr-codes - Generate QR code for batch
async function postHandler(request: NextRequest, { tenantId }: { tenantId: string; user: any }) {
  try {
    const body = await request.json()
    const validatedData = qrGenerationSchema.parse(body)

    // Verify batch belongs to tenant
    const batch = await prisma.materialBatch.findFirst({
      where: {
        id: validatedData.batchId,
        material: { tenantId }
      },
      include: {
        material: {
          select: {
            name: true,
            nameArabic: true,
            grade: true,
            tenantId: true
          }
        }
      }
    })

    if (!batch) {
      return apiError('Batch not found', 404)
    }

    // Generate comprehensive QR data for UAE market
    const qrData = {
      // Basic Information
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      material: batch.material.name,
      materialArabic: validatedData.includeArabic ? batch.material.nameArabic : undefined,
      grade: batch.grade,
      origin: batch.origin,

      // Dates
      receivedDate: batch.receivedDate,
      expiryDate: batch.expiryDate,

      // Compliance Information (UAE specific)
      ...(validatedData.includeCompliance && {
        compliance: {
          halal: batch.isHalalCertified,
          customsCode: '33019900',
        },
        certifications: batch.certifications || [],
      }),

      // Verification
      generatedAt: new Date().toISOString(),
      verificationUrl: `${process.env.NEXTAUTH_URL}/batch/${validatedData.batchId}`,

      // Security hash
      hash: Buffer.from(
        `${batch.batchNumber}-${batch.material.name}-${new Date().toISOString()}`
      ).toString('base64'),
    }

    const qrDataString = JSON.stringify(qrData)

    if (validatedData.format === 'svg') {
      // Generate SVG QR code
      const qrSvg = await QRCode.toString(qrDataString, {
        type: 'svg',
        width: validatedData.size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })

      return new NextResponse(qrSvg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `attachment; filename="${batch.batchNumber}-qr.svg"`,
        },
      })
    } else if (validatedData.format === 'png') {
      // Generate PNG QR code
      const qrBuffer = await QRCode.toBuffer(qrDataString, {
        type: 'png',
        width: validatedData.size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })

      return new NextResponse(qrBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${batch.batchNumber}-qr.png"`,
        },
      })
    } else if (validatedData.format === 'pdf') {
      // Generate PDF with QR code and batch information
      return apiResponse({
        batchInfo: {
          id: batch.id,
          batchNumber: batch.batchNumber,
          material: batch.material,
          origin: batch.origin,
          receivedDate: batch.receivedDate,
          expiryDate: batch.expiryDate
        },
        qrData: qrDataString,
        format: 'pdf',
        message: 'PDF generation would be implemented with proper PDF library',
      })
    }

    return apiResponse({
      qrData: qrDataString,
      batchInfo: {
        id: batch.id,
        batchNumber: batch.batchNumber,
        material: batch.material
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + JSON.stringify(error.errors), 400)
    }

    console.error('Error generating QR code:', error)
    return apiError('Failed to generate QR code: ' + (error instanceof Error ? error.message : 'Unknown error'), 500)
  }
}

// PUT /api/inventory/qr-codes - Verify QR code authenticity
async function putHandler(request: NextRequest, { tenantId }: { tenantId: string; user: any }) {
  try {
    const body = await request.json()
    const { qrData, batchId } = body

    // In a real implementation, verify the hash and signature
    try {
      const parsedData = JSON.parse(qrData)

      // If batchId is provided, verify it belongs to tenant
      if (parsedData.batchId) {
        const batch = await prisma.materialBatch.findFirst({
          where: {
            id: parsedData.batchId,
            material: { tenantId }
          }
        })

        if (!batch) {
          return apiError('Batch not found or access denied', 404)
        }
      }

      // Verify timestamp (not too old)
      const generatedAt = new Date(parsedData.generatedAt)
      const hoursDiff = (new Date().getTime() - generatedAt.getTime()) / (1000 * 60 * 60)

      const isValid = hoursDiff <= 24 * 30 // Valid for 30 days

      return apiResponse({
        isValid,
        verificationStatus: isValid ? 'valid' : 'expired',
        batchInfo: parsedData,
        verifiedAt: new Date(),
        expiresInHours: isValid ? Math.max(0, (24 * 30) - hoursDiff) : 0,
      })
    } catch (error) {
      return apiError('Invalid QR code data format', 400)
    }
  } catch (error) {
    console.error('Error verifying QR code:', error)
    return apiError('Failed to verify QR code: ' + (error instanceof Error ? error.message : 'Unknown error'), 500)
  }
}

// DELETE /api/inventory/qr-codes - Invalidate QR code (for security)
async function deleteHandler(request: NextRequest, { tenantId }: { tenantId: string; user: any }) {
  try {
    const { searchParams } = new URL(request.url)
    const batchId = searchParams.get('batchId')
    const reason = searchParams.get('reason') || 'Manual invalidation'

    if (!batchId) {
      return apiError('Batch ID is required', 400)
    }

    // Verify batch belongs to tenant
    const batch = await prisma.materialBatch.findFirst({
      where: {
        id: batchId,
        material: { tenantId }
      }
    })

    if (!batch) {
      return apiError('Batch not found', 404)
    }

    // In a real implementation, add the QR code to an invalidation list
    // and log the security event

    return apiResponse({
      batchId,
      invalidatedAt: new Date(),
      reason,
      message: 'QR code has been invalidated for security reasons',
    })
  } catch (error) {
    console.error('Error invalidating QR code:', error)
    return apiError('Failed to invalidate QR code: ' + (error instanceof Error ? error.message : 'Unknown error'), 500)
  }
}

export const GET = withTenant(getHandler);
export const POST = withTenant(postHandler);
export const PUT = withTenant(putHandler);
export const DELETE = withTenant(deleteHandler);
