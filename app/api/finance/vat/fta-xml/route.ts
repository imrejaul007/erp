import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// FTA XML Export schema
const ftaXmlSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/),
  format: z.enum(['xml', 'json']).default('xml'),
  includeZeroRated: z.boolean().default(true),
  includeExempt: z.boolean().default(true),
  includeSupplies: z.boolean().default(true),
  includePurchases: z.boolean().default(true),
});

// Generate FTA compliant XML report
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      period: searchParams.get('period'),
      format: searchParams.get('format') || 'xml',
      includeZeroRated: searchParams.get('includeZeroRated') !== 'false',
      includeExempt: searchParams.get('includeExempt') !== 'false',
      includeSupplies: searchParams.get('includeSupplies') !== 'false',
      includePurchases: searchParams.get('includePurchases') !== 'false',
    };

    if (!params.period) {
      return apiError('Period is required (YYYY-MM format)', 400);
    }

    const validatedParams = ftaXmlSchema.parse(params);

    // Get VAT return data for the period
    const vatReturnData = await getVATReturnData(tenantId, validatedParams.period);

    if (!vatReturnData) {
      return apiError('No VAT return found for this period', 404);
    }

    // Get company information
    const companyInfo = await getCompanyInformation();

    // Generate FTA XML
    const ftaXmlContent = await generateFTAXML(vatReturnData, companyInfo, validatedParams);

    if (validatedParams.format === 'json') {
      return apiResponse({
        success: true,
        data: {
          period: validatedParams.period,
          xmlContent: ftaXmlContent,
          companyInfo,
          vatReturnData,
          generatedAt: new Date().toISOString(),
        },
      });
    }

    // Return XML file for download
    return new NextResponse(ftaXmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="FTA_VAT_Return_${validatedParams.period}.xml"`,
      },
    });
  } catch (error) {
    console.error('FTA XML Export error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to generate FTA XML report', 500);
  }
});

// Validate FTA XML format
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const { period, xmlContent } = body;

    if (!period || !xmlContent) {
      return apiError('Period and XML content are required', 400);
    }

    // Validate XML structure
    const validationResult = await validateFTAXML(xmlContent);

    if (!validationResult.isValid) {
      return apiError('XML validation failed: ' + validationResult.errors.join(', '), 400);
    }

    // Save validated XML for audit trail
    const xmlId = generateId();
    await prisma.$executeRaw`
      INSERT INTO fta_xml_submissions (
        id, tenant_id, period, xml_content, validation_status, validation_errors,
        generated_at, generated_by, status
      ) VALUES (
        ${xmlId}, ${tenantId}, ${period}, ${xmlContent}, 'valid', null,
        ${new Date()}, ${user.id}, 'draft'
      )
    `;

    return apiResponse({
      success: true,
      data: {
        id: xmlId,
        period,
        validationStatus: 'valid',
        isValid: true,
      },
      message: 'FTA XML validated successfully',
    });
  } catch (error) {
    console.error('FTA XML Validation error:', error);
    return apiError('Failed to validate FTA XML', 500);
  }
});

// Helper functions
async function getVATReturnData(tenantId: string, period: string) {
  const vatReturn = await prisma.vATRecord.findFirst({
    where: {
      tenantId,
      period,
      description: 'VAT Return',
      status: 'ACTIVE',
    },
  });

  if (!vatReturn) return null;

  // Get detailed VAT transactions for the period
  const vatTransactions = await prisma.vATRecord.findMany({
    where: {
      tenantId,
      period,
      status: 'ACTIVE',
      description: { not: 'VAT Return' },
    },
    orderBy: {
      recordDate: 'asc',
    },
  });

  // Categorize transactions
  const supplies = vatTransactions.filter(t => t.type === 'OUTPUT');
  const purchases = vatTransactions.filter(t => t.type === 'INPUT');

  // Calculate totals
  const standardSupplies = supplies.filter(s => s.vatRate === 5);
  const zeroRatedSupplies = supplies.filter(s => s.vatRate === 0 && !s.description.includes('exempt'));
  const exemptSupplies = supplies.filter(s => s.description.includes('exempt'));

  const standardPurchases = purchases.filter(p => p.vatRate === 5 && !p.description.includes('reverse charge'));
  const reverseChargePurchases = purchases.filter(p => p.description.includes('reverse charge'));

  return {
    period,
    returnId: vatReturn.id,
    returnNo: vatReturn.recordNo,
    filedDate: vatReturn.recordDate,
    supplies: {
      standard: {
        items: standardSupplies,
        totalAmount: standardSupplies.reduce((sum, item) => sum + Number(item.amount), 0),
        totalVAT: standardSupplies.reduce((sum, item) => sum + Number(item.vatAmount), 0),
      },
      zeroRated: {
        items: zeroRatedSupplies,
        totalAmount: zeroRatedSupplies.reduce((sum, item) => sum + Number(item.amount), 0),
        totalVAT: 0,
      },
      exempt: {
        items: exemptSupplies,
        totalAmount: exemptSupplies.reduce((sum, item) => sum + Number(item.amount), 0),
        totalVAT: 0,
      },
    },
    purchases: {
      standard: {
        items: standardPurchases,
        totalAmount: standardPurchases.reduce((sum, item) => sum + Number(item.amount), 0),
        totalVAT: standardPurchases.reduce((sum, item) => sum + Number(item.vatAmount), 0),
      },
      reverseCharge: {
        items: reverseChargePurchases,
        totalAmount: reverseChargePurchases.reduce((sum, item) => sum + Number(item.amount), 0),
        totalVAT: reverseChargePurchases.reduce((sum, item) => sum + Number(item.vatAmount), 0),
      },
    },
  };
}

async function getCompanyInformation() {
  // In production, this would come from a company settings table
  return {
    trn: process.env.COMPANY_TRN || '123456789012345',
    name: 'Perfume & Oud Trading LLC',
    nameArabic: 'شركة العطور والعود للتجارة ذ.م.م',
    address: {
      street: 'Business Bay',
      city: 'Dubai',
      country: 'United Arab Emirates',
      poBox: 'P.O. Box 12345',
    },
    contact: {
      email: 'finance@perfume-oud.ae',
      phone: '+971-4-1234567',
      fax: '+971-4-1234568',
    },
    businessActivity: 'Perfume and Oud Trading',
    establishmentDate: '2020-01-01',
  };
}

async function generateFTAXML(vatReturnData: any, companyInfo: any, params: any): Promise<string> {
  const period = vatReturnData.period;
  const [year, month] = period.split('-');

  // Calculate net VAT due
  const outputVAT = vatReturnData.supplies.standard.totalVAT;
  const inputVAT = vatReturnData.purchases.standard.totalVAT;
  const reverseChargeVAT = vatReturnData.purchases.reverseCharge.totalVAT;
  const netVATDue = outputVAT - inputVAT + reverseChargeVAT;

  // Generate FTA compliant XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<VATReturn xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns="urn:ae:gov:fta:vat:return:1.0"
           xsi:schemaLocation="urn:ae:gov:fta:vat:return:1.0 VATReturn.xsd">

  <Header>
    <TRN>${companyInfo.trn}</TRN>
    <TaxAgent>false</TaxAgent>
    <BusinessName>${escapeXml(companyInfo.name)}</BusinessName>
    <BusinessNameArabic>${escapeXml(companyInfo.nameArabic)}</BusinessNameArabic>
    <PeriodStart>${year}-${month.padStart(2, '0')}-01</PeriodStart>
    <PeriodEnd>${getLastDayOfMonth(year, month)}</PeriodEnd>
    <Currency>AED</Currency>
    <ReturnType>Original</ReturnType>
    <FilingDate>${vatReturnData.filedDate.toISOString().split('T')[0]}</FilingDate>
  </Header>

  <TaxableSupplies>
    <StandardRatedSupplies>
      <TotalValue>${vatReturnData.supplies.standard.totalAmount.toFixed(2)}</TotalValue>
      <TotalVATAmount>${vatReturnData.supplies.standard.totalVAT.toFixed(2)}</TotalVATAmount>
    </StandardRatedSupplies>`;

  if (params.includeZeroRated) {
    xml += `
    <ZeroRatedSupplies>
      <TotalValue>${vatReturnData.supplies.zeroRated.totalAmount.toFixed(2)}</TotalValue>
    </ZeroRatedSupplies>`;
  }

  if (params.includeExempt) {
    xml += `
    <ExemptSupplies>
      <TotalValue>${vatReturnData.supplies.exempt.totalAmount.toFixed(2)}</TotalValue>
    </ExemptSupplies>`;
  }

  xml += `
  </TaxableSupplies>

  <InputVAT>
    <StandardRatedPurchases>
      <TotalValue>${vatReturnData.purchases.standard.totalAmount.toFixed(2)}</TotalValue>
      <TotalVATAmount>${vatReturnData.purchases.standard.totalVAT.toFixed(2)}</TotalVATAmount>
    </StandardRatedPurchases>
    <ReverseChargePurchases>
      <TotalValue>${vatReturnData.purchases.reverseCharge.totalAmount.toFixed(2)}</TotalValue>
      <TotalVATAmount>${vatReturnData.purchases.reverseCharge.totalVAT.toFixed(2)}</TotalVATAmount>
    </ReverseChargePurchases>
  </InputVAT>

  <VATSummary>
    <TotalOutputVAT>${outputVAT.toFixed(2)}</TotalOutputVAT>
    <TotalInputVAT>${inputVAT.toFixed(2)}</TotalInputVAT>
    <NetVATDue>${netVATDue.toFixed(2)}</NetVATDue>
    <VATRate>5.00</VATRate>
  </VATSummary>

  <Declaration>
    <DeclarationText>I declare that the information given in this return is true and complete.</DeclarationText>
    <DeclarantName>${escapeXml(companyInfo.name)}</DeclarantName>
    <DeclarantTRN>${companyInfo.trn}</DeclarantTRN>
    <DeclarationDate>${new Date().toISOString().split('T')[0]}</DeclarationDate>
  </Declaration>

</VATReturn>`;

  return xml;
}

async function validateFTAXML(xmlContent: string) {
  try {
    // Basic XML structure validation
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

    const errors = [];

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      errors.push('Invalid XML format');
    }

    // Check required elements
    const requiredElements = [
      'Header/TRN',
      'Header/BusinessName',
      'Header/PeriodStart',
      'Header/PeriodEnd',
      'TaxableSupplies/StandardRatedSupplies/TotalValue',
      'TaxableSupplies/StandardRatedSupplies/TotalVATAmount',
      'InputVAT/StandardRatedPurchases/TotalValue',
      'InputVAT/StandardRatedPurchases/TotalVATAmount',
      'VATSummary/NetVATDue',
    ];

    for (const element of requiredElements) {
      const xpath = element.split('/').join(' > ');
      if (!xmlDoc.querySelector(xpath)) {
        errors.push(`Missing required element: ${element}`);
      }
    }

    // Validate TRN format (15 digits)
    const trn = xmlDoc.querySelector('Header > TRN')?.textContent;
    if (trn && !/^\d{15}$/.test(trn)) {
      errors.push('TRN must be exactly 15 digits');
    }

    // Validate date formats
    const periodStart = xmlDoc.querySelector('Header > PeriodStart')?.textContent;
    const periodEnd = xmlDoc.querySelector('Header > PeriodEnd')?.textContent;

    if (periodStart && !/^\d{4}-\d{2}-\d{2}$/.test(periodStart)) {
      errors.push('Invalid PeriodStart date format (YYYY-MM-DD required)');
    }

    if (periodEnd && !/^\d{4}-\d{2}-\d{2}$/.test(periodEnd)) {
      errors.push('Invalid PeriodEnd date format (YYYY-MM-DD required)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [(error as Error).message],
    };
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getLastDayOfMonth(year: string, month: string): string {
  const date = new Date(parseInt(year), parseInt(month), 0);
  return date.toISOString().split('T')[0];
}

function generateId(): string {
  return `fta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}