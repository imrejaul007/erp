import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const InvoiceTemplateSchema = z.object({
  name: z.string().min(1),
  isDefault: z.boolean().default(false),
  logo: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email().optional(),
  companyWebsite: z.string().url().optional(),
  taxId: z.string().optional(),
  primaryColor: z.string().default('#000000'),
  secondaryColor: z.string().default('#666666'),
  accentColor: z.string().default('#0066cc'),
  layout: z.enum(['standard', 'compact', 'detailed']).default('standard'),
  showLogo: z.boolean().default(true),
  showQRCode: z.boolean().default(true),
  showWatermark: z.boolean().default(false),
  watermarkText: z.string().optional(),
  headerText: z.string().optional(),
  footerText: z.string().optional(),
  paymentInstructions: z.string().optional(),
  defaultTerms: z.string().optional(),
  defaultNotes: z.string().optional(),
});

// GET /api/invoice-templates - List all invoice templates
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const templates = await prisma.invoiceTemplate.findMany({
      where: { tenantId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return apiResponse({ templates });
  } catch (error: any) {
    console.error('Error fetching invoice templates:', error);
    return apiError(error.message || 'Failed to fetch invoice templates', 500);
  }
});

// POST /api/invoice-templates - Create invoice template
export const POST = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = InvoiceTemplateSchema.parse(body);

    // If setting as default, unset all other defaults
    if (validated.isDefault) {
      await prisma.invoiceTemplate.updateMany({
        where: { tenantId },
        data: { isDefault: false },
      });
    }

    const template = await prisma.invoiceTemplate.create({
      data: {
        ...validated,
        tenantId,
      },
    });

    return apiResponse({
      message: 'Invoice template created successfully',
      template,
    }, 201);
  } catch (error: any) {
    console.error('Error creating invoice template:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create invoice template', 500);
  }
});
