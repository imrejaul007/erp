import { NextRequest } from 'next/server'
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const conversionRequestSchema = z.object({
  value: z.number().min(0, 'Value must be non-negative'),
  fromUnit: z.string().min(1, 'From unit is required'),
  toUnit: z.string().min(1, 'To unit is required'),
  materialId: z.string().optional(),
  density: z.number().optional(),
})

const createConversionRuleSchema = z.object({
  fromUnit: z.string().min(1, 'From unit is required'),
  toUnit: z.string().min(1, 'To unit is required'),
  factor: z.number().min(0.0001, 'Factor must be greater than 0'),
  materialId: z.string().optional(),
  notes: z.string().optional(),
})

// Standard conversion factors
const STANDARD_CONVERSIONS: Record<string, Record<string, number>> = {
  // Weight conversions (base: grams)
  gram: {
    kilogram: 0.001,
    tola: 0.085735, // 1 tola = 11.66 grams
  },
  kilogram: {
    gram: 1000,
    tola: 85.735,
  },
  tola: {
    gram: 11.66,
    kilogram: 0.01166,
  },

  // Volume conversions (base: ml)
  ml: {
    liter: 0.001,
  },
  liter: {
    ml: 1000,
  },

  // Count conversions
  piece: {
    dozen: 0.0833,
  },
  dozen: {
    piece: 12,
  },
}

// Default densities for perfume materials (g/ml)
const MATERIAL_DENSITIES: Record<string, number> = {
  'alcohol': 0.8,
  'oud_oil': 0.85,
  'attar': 0.85,
  'perfume_oil': 0.9,
  'water': 1.0,
  'default': 0.85, // Default for perfume/oud materials
}

// GET /api/inventory/conversions - Convert units
async function getHandler(request: NextRequest, { tenantId }: { tenantId: string; user: any }) {
  try {
    const { searchParams } = new URL(request.url)

    const value = parseFloat(searchParams.get('value') || '0')
    const fromUnit = searchParams.get('fromUnit') || ''
    const toUnit = searchParams.get('toUnit') || ''
    const materialId = searchParams.get('materialId') || undefined
    const density = parseFloat(searchParams.get('density') || '0') || undefined

    const validatedData = conversionRequestSchema.parse({
      value,
      fromUnit,
      toUnit,
      materialId,
      density,
    })

    if (validatedData.fromUnit === validatedData.toUnit) {
      return apiResponse({
        originalValue: validatedData.value,
        convertedValue: validatedData.value,
        fromUnit: validatedData.fromUnit,
        toUnit: validatedData.toUnit,
        factor: 1,
        method: 'direct',
        formula: `${validatedData.value} ${validatedData.fromUnit} = ${validatedData.value} ${validatedData.toUnit}`,
      })
    }

    let conversionFactor: number | null = null
    let method = 'standard'
    let notes = ''

    // 1. Try material-specific conversion first
    if (validatedData.materialId) {
      // Verify material belongs to tenant
      const material = await prisma.material.findFirst({
        where: {
          id: validatedData.materialId,
          tenantId
        }
      })

      if (!material) {
        return apiError('Material not found', 404)
      }

      const materialConversion = await prisma.unitConversion.findFirst({
        where: {
          fromUnit: validatedData.fromUnit,
          toUnit: validatedData.toUnit,
          materialId: validatedData.materialId,
          material: { tenantId }
        },
      })

      if (materialConversion) {
        conversionFactor = materialConversion.factor
        method = 'material_specific'
        notes = materialConversion.notes || ''
      }
    }

    // 2. Try standard conversion
    if (conversionFactor === null) {
      conversionFactor = STANDARD_CONVERSIONS[validatedData.fromUnit]?.[validatedData.toUnit]

      // Try reverse conversion
      if (conversionFactor === null) {
        const reverseConversion = STANDARD_CONVERSIONS[validatedData.toUnit]?.[validatedData.fromUnit]
        if (reverseConversion) {
          conversionFactor = 1 / reverseConversion
        }
      }
    }

    // 3. Try density-based conversion for volume <-> weight
    if (conversionFactor === null) {
      const useDensity = validatedData.density || MATERIAL_DENSITIES.default

      // Volume to weight (ml to grams)
      if (validatedData.fromUnit === 'ml' && validatedData.toUnit === 'gram') {
        conversionFactor = useDensity
        method = 'density'
        notes = `Using density: ${useDensity} g/ml`
      }
      // Weight to volume (grams to ml)
      else if (validatedData.fromUnit === 'gram' && validatedData.toUnit === 'ml') {
        conversionFactor = 1 / useDensity
        method = 'density'
        notes = `Using density: ${useDensity} g/ml`
      }
      // ml to tola (through grams)
      else if (validatedData.fromUnit === 'ml' && validatedData.toUnit === 'tola') {
        conversionFactor = (useDensity * 0.085735) // ml -> g -> tola
        method = 'density_compound'
        notes = `ml → g (density: ${useDensity}) → tola`
      }
      // tola to ml (through grams)
      else if (validatedData.fromUnit === 'tola' && validatedData.toUnit === 'ml') {
        conversionFactor = (11.66 / useDensity) // tola -> g -> ml
        method = 'density_compound'
        notes = `tola → g → ml (density: ${useDensity})`
      }
    }

    // 4. Check for compound conversions (e.g., tola to liter)
    if (conversionFactor === null) {
      // Try to find a path through intermediate units
      const intermediateUnits = ['gram', 'ml']

      for (const intermediate of intermediateUnits) {
        const factor1 = STANDARD_CONVERSIONS[validatedData.fromUnit]?.[intermediate] ||
                       (STANDARD_CONVERSIONS[intermediate]?.[validatedData.fromUnit] ?
                        1 / STANDARD_CONVERSIONS[intermediate][validatedData.fromUnit] : null)

        const factor2 = STANDARD_CONVERSIONS[intermediate]?.[validatedData.toUnit] ||
                       (STANDARD_CONVERSIONS[validatedData.toUnit]?.[intermediate] ?
                        1 / STANDARD_CONVERSIONS[validatedData.toUnit][intermediate] : null)

        if (factor1 && factor2) {
          conversionFactor = factor1 * factor2
          method = 'compound'
          notes = `${validatedData.fromUnit} → ${intermediate} → ${validatedData.toUnit}`
          break
        }
      }
    }

    if (conversionFactor === null) {
      return apiError(
        `No conversion available from ${validatedData.fromUnit} to ${validatedData.toUnit}. Available conversions from ${validatedData.fromUnit}: ${Object.keys(STANDARD_CONVERSIONS[validatedData.fromUnit] || {}).join(', ')}`,
        400
      )
    }

    const convertedValue = validatedData.value * conversionFactor
    const formula = `${validatedData.value} ${validatedData.fromUnit} × ${conversionFactor} = ${convertedValue.toFixed(4)} ${validatedData.toUnit}`

    return apiResponse({
      originalValue: validatedData.value,
      convertedValue,
      fromUnit: validatedData.fromUnit,
      toUnit: validatedData.toUnit,
      factor: conversionFactor,
      method,
      formula,
      notes,
      accuracy: method === 'material_specific' ? 'high' : method === 'standard' ? 'high' : 'estimated',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + JSON.stringify(error.errors), 400)
    }

    console.error('Error performing conversion:', error)
    return apiError('Failed to perform conversion: ' + (error instanceof Error ? error.message : 'Unknown error'), 500)
  }
}

// POST /api/inventory/conversions - Create custom conversion rule
async function postHandler(request: NextRequest, { tenantId }: { tenantId: string; user: any }) {
  try {
    const body = await request.json()
    const validatedData = createConversionRuleSchema.parse(body)

    // Validate material exists if materialId provided
    if (validatedData.materialId) {
      const material = await prisma.material.findFirst({
        where: {
          id: validatedData.materialId,
          tenantId
        },
      })

      if (!material) {
        return apiError('Material not found', 404)
      }
    }

    // Check if conversion rule already exists
    const existingConversion = await prisma.unitConversion.findFirst({
      where: {
        fromUnit: validatedData.fromUnit,
        toUnit: validatedData.toUnit,
        materialId: validatedData.materialId || null,
        ...(validatedData.materialId && {
          material: { tenantId }
        })
      },
    })

    if (existingConversion) {
      return apiError('Conversion rule already exists', 400)
    }

    // Create conversion rule
    const conversion = await prisma.unitConversion.create({
      data: validatedData,
      include: {
        material: {
          select: {
            id: true,
            name: true,
            sku: true,
            tenantId: true
          }
        },
      },
    })

    // Verify tenant if material-specific
    if (conversion.material && conversion.material.tenantId !== tenantId) {
      return apiError('Tenant mismatch', 403)
    }

    return apiResponse({
      ...conversion,
      material: conversion.material ? {
        id: conversion.material.id,
        name: conversion.material.name,
        sku: conversion.material.sku
      } : null
    }, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + JSON.stringify(error.errors), 400)
    }

    console.error('Error creating conversion rule:', error)
    return apiError('Failed to create conversion rule: ' + (error instanceof Error ? error.message : 'Unknown error'), 500)
  }
}

// PUT /api/inventory/conversions - Get all conversion rules
async function putHandler(request: NextRequest, { tenantId }: { tenantId: string; user: any }) {
  try {
    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('materialId') || undefined

    const where: any = {}

    if (materialId) {
      // Verify material belongs to tenant
      const material = await prisma.material.findFirst({
        where: {
          id: materialId,
          tenantId
        }
      })

      if (!material) {
        return apiError('Material not found', 404)
      }

      where.OR = [
        {
          materialId,
          material: { tenantId }
        },
        { materialId: null }, // Include global rules
      ]
    } else {
      // Only show global rules or rules for materials belonging to this tenant
      where.OR = [
        { materialId: null },
        { material: { tenantId } }
      ]
    }

    const conversions = await prisma.unitConversion.findMany({
      where,
      include: {
        material: {
          select: {
            id: true,
            name: true,
            sku: true,
            tenantId: true
          },
        },
      },
      orderBy: [
        { materialId: 'asc' }, // Material-specific first
        { fromUnit: 'asc' },
        { toUnit: 'asc' },
      ],
    })

    // Filter out any that don't belong to tenant (extra safety)
    const filteredConversions = conversions.filter(c =>
      !c.material || c.material.tenantId === tenantId
    )

    // Group by material
    const groupedConversions = filteredConversions.reduce((acc, conversion) => {
      const key = conversion.materialId || 'global'
      if (!acc[key]) {
        acc[key] = {
          materialId: conversion.materialId,
          material: conversion.material ? {
            id: conversion.material.id,
            name: conversion.material.name,
            sku: conversion.material.sku
          } : null,
          conversions: [],
        }
      }
      acc[key].conversions.push({
        id: conversion.id,
        fromUnit: conversion.fromUnit,
        toUnit: conversion.toUnit,
        factor: conversion.factor,
        notes: conversion.notes,
      })
      return acc
    }, {} as Record<string, any>)

    return apiResponse({
      grouped: groupedConversions,
      total: filteredConversions.length,
      standardUnits: Object.keys(STANDARD_CONVERSIONS),
      supportedConversions: STANDARD_CONVERSIONS,
    })
  } catch (error) {
    console.error('Error fetching conversion rules:', error)
    return apiError('Failed to fetch conversion rules: ' + (error instanceof Error ? error.message : 'Unknown error'), 500)
  }
}

export const GET = withTenant(getHandler);
export const POST = withTenant(postHandler);
export const PUT = withTenant(putHandler);
