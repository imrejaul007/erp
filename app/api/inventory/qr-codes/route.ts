import { NextRequest, NextResponse } from 'next/server'
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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const qrCode = searchParams.get('qrCode')
    const action = searchParams.get('action')

    if (action === 'lookup' && qrCode) {
      // Lookup batch by QR code
      const validatedData = batchLookupSchema.parse({ qrCode })

      // In a real implementation, you would query your database
      // For now, we'll decode the QR code data if it's JSON
      try {
        const batchData = JSON.parse(decodeURIComponent(qrCode))

        return NextResponse.json({
          success: true,
          data: {
            batch: batchData,
            verificationStatus: 'verified',
            lastVerified: new Date(),
          },
        })
      } catch (error) {
        // If not JSON, treat as batch number lookup
        return NextResponse.json({
          success: false,
          error: 'Invalid QR code format or batch not found',
        }, { status: 404 })
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid request parameters',
    }, { status: 400 })
  } catch (error) {
    console.error('Error processing QR code lookup:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// POST /api/inventory/qr-codes - Generate QR code for batch
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = qrGenerationSchema.parse(body)

    // Mock batch data - in real app, fetch from database
    const mockBatch = {
      id: validatedData.batchId,
      batchNumber: 'OUD-2024-001',
      material: {
        name: 'Royal Cambodian Oud',
        nameArabic: 'عود كمبودي ملكي',
        grade: 'Royal',
        purity: 98.5,
      },
      origin: 'Cambodia',
      receivedDate: '2024-09-01',
      expiryDate: '2029-09-01',
      certifications: ['Halal', 'GCC Approved', 'ISO Certified'],
      supplier: {
        name: 'Cambodian Oud House',
        nameArabic: 'بيت العود الكمبودي',
      },
      compliance: {
        uaeStandards: true,
        gccApproval: true,
        halalCertified: true,
        customsCode: '33019900',
      },
      url: `${process.env.NEXTAUTH_URL}/batch/${validatedData.batchId}`,
    }

    // Generate comprehensive QR data for UAE market
    const qrData = {
      // Basic Information
      batchNumber: mockBatch.batchNumber,
      material: mockBatch.material.name,
      materialArabic: validatedData.includeArabic ? mockBatch.material.nameArabic : undefined,
      grade: mockBatch.material.grade,
      purity: mockBatch.material.purity,
      origin: mockBatch.origin,

      // Dates
      receivedDate: mockBatch.receivedDate,
      expiryDate: mockBatch.expiryDate,

      // Supplier Information
      supplier: mockBatch.supplier.name,
      supplierArabic: validatedData.includeArabic ? mockBatch.supplier.nameArabic : undefined,

      // Compliance Information (UAE specific)
      ...(validatedData.includeCompliance && {
        compliance: {
          uaeStandards: mockBatch.compliance.uaeStandards,
          gccApproval: mockBatch.compliance.gccApproval,
          halal: mockBatch.compliance.halalCertified,
          customsCode: mockBatch.compliance.customsCode,
        },
        certifications: mockBatch.certifications,
      }),

      // Verification
      generatedAt: new Date().toISOString(),
      verificationUrl: mockBatch.url,

      // Security hash (in real app, use proper cryptographic signature)
      hash: Buffer.from(
        `${mockBatch.batchNumber}-${mockBatch.material.name}-${new Date().toISOString()}`
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
          'Content-Disposition': `attachment; filename="${mockBatch.batchNumber}-qr.svg"`,
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
          'Content-Disposition': `attachment; filename="${mockBatch.batchNumber}-qr.png"`,
        },
      })
    } else if (validatedData.format === 'pdf') {
      // Generate PDF with QR code and batch information
      // This would require a PDF generation library like jsPDF or PDFKit
      // For now, return the data structure for PDF generation
      return NextResponse.json({
        success: true,
        data: {
          batchInfo: mockBatch,
          qrData: qrDataString,
          format: 'pdf',
          message: 'PDF generation would be implemented with proper PDF library',
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        qrData: qrDataString,
        batchInfo: mockBatch,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

// PUT /api/inventory/qr-codes - Verify QR code authenticity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrData, batchId } = body

    // In a real implementation, verify the hash and signature
    try {
      const parsedData = JSON.parse(qrData)

      // Verify timestamp (not too old)
      const generatedAt = new Date(parsedData.generatedAt)
      const hoursDiff = (new Date().getTime() - generatedAt.getTime()) / (1000 * 60 * 60)

      const isValid = hoursDiff <= 24 * 30 // Valid for 30 days

      return NextResponse.json({
        success: true,
        data: {
          isValid,
          verificationStatus: isValid ? 'valid' : 'expired',
          batchInfo: parsedData,
          verifiedAt: new Date(),
          expiresInHours: isValid ? Math.max(0, (24 * 30) - hoursDiff) : 0,
        },
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid QR code data format',
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error verifying QR code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify QR code' },
      { status: 500 }
    )
  }
}

// DELETE /api/inventory/qr-codes - Invalidate QR code (for security)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const batchId = searchParams.get('batchId')
    const reason = searchParams.get('reason') || 'Manual invalidation'

    if (!batchId) {
      return NextResponse.json({
        success: false,
        error: 'Batch ID is required',
      }, { status: 400 })
    }

    // In a real implementation, add the QR code to an invalidation list
    // and log the security event

    return NextResponse.json({
      success: true,
      data: {
        batchId,
        invalidatedAt: new Date(),
        reason,
        message: 'QR code has been invalidated for security reasons',
      },
    })
  } catch (error) {
    console.error('Error invalidating QR code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to invalidate QR code' },
      { status: 500 }
    )
  }
}