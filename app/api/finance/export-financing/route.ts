import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Export Financing Documentation Schema
const exportFinancingSchema = z.object({
  shipmentId: z.string().min(1),
  documentType: z.enum([
    'commercial_invoice',
    'packing_list',
    'bill_of_lading',
    'certificate_of_origin',
    'insurance_certificate',
    'letter_of_credit',
    'export_license',
    'inspection_certificate',
    'fumigation_certificate',
    'health_certificate',
    'quality_certificate',
    'free_sale_certificate',
    'halal_certificate',
    'customs_declaration',
    'freight_invoice',
    'banking_documents'
  ]),
  financingType: z.enum([
    'letter_of_credit',
    'documentary_collection',
    'open_account',
    'advance_payment',
    'consignment',
    'export_factoring',
    'forfaiting',
    'export_credit_insurance'
  ]).optional(),
  currency: z.string().default('USD'),
  includeInsurance: z.boolean().default(true),
  urgentProcessing: z.boolean().default(false),
  destination: z.object({
    country: z.string(),
    port: z.string().optional(),
    customsCode: z.string().optional(),
  }),
  incoterms: z.enum(['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF']).default('FOB'),
});

// Letter of Credit Schema
const letterOfCreditSchema = z.object({
  lcNumber: z.string().min(1),
  issuingBank: z.string().min(1),
  beneficiary: z.string().min(1),
  applicant: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  latestShipmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  presentationPeriod: z.number().min(1).max(21).default(21), // Days after shipment
  partialShipments: z.boolean().default(false),
  transhipment: z.boolean().default(true),
  requiredDocuments: z.array(z.string()),
  specialInstructions: z.string().optional(),
  advisingBank: z.string().optional(),
  confirmingBank: z.string().optional(),
  restrictedToBank: z.boolean().default(false),
});

// Insurance Certificate Schema
const insuranceCertificateSchema = z.object({
  policyNumber: z.string().min(1),
  insuranceCompany: z.string().min(1),
  insuredAmount: z.number().positive(),
  currency: z.string().default('USD'),
  coverage: z.array(z.enum([
    'marine_cargo',
    'war_risks',
    'strikes_riots_civil_commotions',
    'theft_pilferage',
    'breakage',
    'contamination',
    'delay',
    'general_average',
    'salvage_charges'
  ])),
  deductible: z.number().min(0),
  voyage: z.object({
    from: z.string(),
    to: z.string(),
    via: z.array(z.string()).optional(),
  }),
  vesselName: z.string().optional(),
  containerNumber: z.string().optional(),
});

export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'generate_documents':
        return await generateExportDocuments(body);
      case 'create_letter_of_credit':
        return await createLetterOfCredit(body);
      case 'generate_insurance':
        return await generateInsuranceCertificate(body);
      case 'track_financing':
        return await trackFinancingStatus(body);
      case 'calculate_costs':
        return await calculateFinancingCosts(body);
      default:
        return apiError('Invalid action', 400);
    }
  } catch (error) {
    console.error('Export Financing error:', error);

    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    return apiError('Failed to process export financing request', 500);
  }
});

async function generateExportDocuments(requestData: any) {
  const validatedData = exportFinancingSchema.parse(requestData);
  const { shipmentId, documentType, financingType, currency, destination, incoterms } = validatedData;

  // Get shipment details
  const shipment = await getShipmentDetails(shipmentId);
  if (!shipment) {
    return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
  }

  let documentData;

  switch (documentType) {
    case 'commercial_invoice':
      documentData = await generateCommercialInvoice(shipment, currency, destination, incoterms);
      break;
    case 'packing_list':
      documentData = await generatePackingList(shipment, destination);
      break;
    case 'bill_of_lading':
      documentData = await generateBillOfLading(shipment, destination, incoterms);
      break;
    case 'certificate_of_origin':
      documentData = await generateCertificateOfOrigin(shipment, destination);
      break;
    case 'insurance_certificate':
      documentData = await generateDefaultInsuranceCertificate(shipment, currency);
      break;
    case 'letter_of_credit':
      documentData = await generateLCDocumentation(shipment, financingType);
      break;
    case 'export_license':
      documentData = await generateExportLicense(shipment, destination);
      break;
    case 'customs_declaration':
      documentData = await generateCustomsDeclaration(shipment, destination);
      break;
    case 'halal_certificate':
      documentData = await generateHalalCertificate(shipment, destination);
      break;
    default:
      return NextResponse.json({ error: 'Unsupported document type' }, { status: 400 });
  }

  // Store document in database
  // Note: ExportDocument model not yet implemented in schema - mock response
  const document = {
    id: `doc-${Date.now()}`,
    shipment_id: shipmentId,
    document_type: documentType,
    document_data: JSON.stringify(documentData),
    currency,
    destination_country: destination.country,
    financing_type: financingType,
    incoterms,
    status: 'GENERATED',
    created_by: 'mock-user',
    created_at: new Date(),
  };
  // const document = await prisma.exportDocument.create({
  //   data: {
  //     shipment_id: shipmentId,
  //     document_type: documentType,
  //     document_data: JSON.stringify(documentData),
  //     currency,
  //     destination_country: destination.country,
  //     financing_type: financingType,
  //     incoterms,
  //     status: 'GENERATED',
  //     created_by: session?.user?.email,
  //   },
  // });

  return NextResponse.json({
    documentId: document.id,
    documentType,
    shipmentId,
    data: documentData,
    downloadUrl: `/api/finance/export-financing/download/${document.id}`,
    status: 'generated',
    generatedAt: new Date().toISOString(),
  });
}

async function createLetterOfCredit(requestData: any) {
  const validatedData = letterOfCreditSchema.parse(requestData);

  // Note: LetterOfCredit model not yet implemented in schema - mock response
  const letterOfCredit = {
    id: `lc-${Date.now()}`,
    lc_number: validatedData.lcNumber,
    issuing_bank: validatedData.issuingBank,
    beneficiary: validatedData.beneficiary,
    applicant: validatedData.applicant,
    amount: validatedData.amount,
    currency: validatedData.currency,
    expiry_date: new Date(validatedData.expiryDate),
    latest_shipment_date: new Date(validatedData.latestShipmentDate),
    presentation_period: validatedData.presentationPeriod,
    partial_shipments: validatedData.partialShipments,
    transhipment: validatedData.transhipment,
    required_documents: validatedData.requiredDocuments,
    special_instructions: validatedData.specialInstructions,
    advising_bank: validatedData.advisingBank,
    confirming_bank: validatedData.confirmingBank,
    status: 'ACTIVE',
    created_by: 'mock-user',
  };
  // const letterOfCredit = await prisma.letterOfCredit.create({
  //   data: {
  //     lc_number: validatedData.lcNumber,
  //     issuing_bank: validatedData.issuingBank,
  //     beneficiary: validatedData.beneficiary,
  //     applicant: validatedData.applicant,
  //     amount: validatedData.amount,
  //     currency: validatedData.currency,
  //     expiry_date: new Date(validatedData.expiryDate),
  //     latest_shipment_date: new Date(validatedData.latestShipmentDate),
  //     presentation_period: validatedData.presentationPeriod,
  //     partial_shipments: validatedData.partialShipments,
  //     transhipment: validatedData.transhipment,
  //     required_documents: validatedData.requiredDocuments,
  //     special_instructions: validatedData.specialInstructions,
  //     advising_bank: validatedData.advisingBank,
  //     confirming_bank: validatedData.confirmingBank,
  //     status: 'ACTIVE',
  //     created_by: session?.user?.email,
  //   },
  // });

  // Generate LC documentation
  const lcDocumentation = {
    lcNumber: validatedData.lcNumber,
    amount: `${validatedData.currency} ${validatedData.amount?.toLocaleString() || "0"}`,
    issuingBank: validatedData.issuingBank,
    beneficiary: validatedData.beneficiary,
    applicant: validatedData.applicant,
    expiryDate: validatedData.expiryDate,
    latestShipmentDate: validatedData.latestShipmentDate,
    requiredDocuments: validatedData.requiredDocuments,
    terms: {
      partialShipments: validatedData.partialShipments ? 'Allowed' : 'Not Allowed',
      transhipment: validatedData.transhipment ? 'Allowed' : 'Not Allowed',
      presentationPeriod: `${validatedData.presentationPeriod} days after shipment date`,
    },
    compliance: {
      uccpRules: 'UCP 600',
      governingLaw: 'Laws of UAE',
      jurisdiction: 'UAE Courts',
    },
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    lcId: letterOfCredit.id,
    lcNumber: validatedData.lcNumber,
    documentation: lcDocumentation,
    status: 'created',
  });
}

async function generateInsuranceCertificate(requestData: any) {
  const validatedData = insuranceCertificateSchema.parse(requestData);

  // Note: InsuranceCertificate model not yet implemented in schema - mock response
  const certificate = {
    id: `ins-${Date.now()}`,
    policy_number: validatedData.policyNumber,
    insurance_company: validatedData.insuranceCompany,
    insured_amount: validatedData.insuredAmount,
    currency: validatedData.currency,
    coverage: validatedData.coverage,
    deductible: validatedData.deductible,
    voyage_from: validatedData.voyage.from,
    voyage_to: validatedData.voyage.to,
    voyage_via: validatedData.voyage.via,
    vessel_name: validatedData.vesselName,
    container_number: validatedData.containerNumber,
    status: 'ACTIVE',
    created_by: 'mock-user',
  };
  // const certificate = await prisma.insuranceCertificate.create({
  //   data: {
  //     policy_number: validatedData.policyNumber,
  //     insurance_company: validatedData.insuranceCompany,
  //     insured_amount: validatedData.insuredAmount,
  //     currency: validatedData.currency,
  //     coverage: validatedData.coverage,
  //     deductible: validatedData.deductible,
  //     voyage_from: validatedData.voyage.from,
  //     voyage_to: validatedData.voyage.to,
  //     voyage_via: validatedData.voyage.via,
  //     vessel_name: validatedData.vesselName,
  //     container_number: validatedData.containerNumber,
  //     status: 'ACTIVE',
  //     created_by: session?.user?.email,
  //   },
  // });

  const certificateData = {
    certificateNumber: `INS-${certificate.id}`,
    policyNumber: validatedData.policyNumber,
    insuranceCompany: validatedData.insuranceCompany,
    insuredAmount: `${validatedData.currency} ${validatedData.insuredAmount?.toLocaleString() || "0"}`,
    coverage: validatedData.coverage,
    voyage: validatedData.voyage,
    terms: {
      deductible: `${validatedData.currency} ${validatedData.deductible}`,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year
    },
    claims: {
      contactNumber: '+971-4-XXXXXXX',
      email: 'claims@insurance-company.ae',
      reportingPeriod: '24 hours from incident',
    },
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    certificateId: certificate.id,
    data: certificateData,
    status: 'generated',
  });
}

async function trackFinancingStatus(requestData: any) {
  const { shipmentId, lcNumber, referenceNumber } = requestData;

  let trackingData: any = {};

  // Note: ExportDocument and LetterOfCredit models not yet implemented - mock response
  if (shipmentId) {
    trackingData.shipment = {
      id: shipmentId,
      documents: [],
    };
    // const documents = await prisma.exportDocument.findMany({
    //   where: { shipment_id: shipmentId },
    //   orderBy: { created_at: 'desc' },
    // });

    // trackingData.shipment = {
    //   id: shipmentId,
    //   documents: documents.map(doc => ({
    //     type: doc.document_type,
    //     status: doc.status,
    //     createdAt: doc.created_at,
    //   })),
    // };
  }

  if (lcNumber) {
    trackingData.letterOfCredit = {
      number: lcNumber,
      status: 'ACTIVE',
      amount: 'USD 0',
      expiryDate: new Date(),
      daysToExpiry: 0,
    };
    // const lc = await prisma.letterOfCredit.findFirst({
    //   where: { lc_number: lcNumber },
    // });

    // if (lc) {
    //   trackingData.letterOfCredit = {
    //     number: lcNumber,
    //     status: lc.status,
    //     amount: `${lc.currency} ${Number(lc.amount)?.toLocaleString() || "0"}`,
    //     expiryDate: lc.expiry_date,
    //     daysToExpiry: Math.ceil((lc.expiry_date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    //   };
    // }
  }

  // Add payment tracking
  trackingData.payments = await getPaymentTracking(shipmentId, lcNumber);

  // Add compliance status
  trackingData.compliance = await getComplianceStatus(shipmentId);

  return NextResponse.json({
    reference: referenceNumber || shipmentId || lcNumber,
    tracking: trackingData,
    lastUpdated: new Date().toISOString(),
  });
}

async function calculateFinancingCosts(requestData: any) {
  const { shipmentValue, currency, financingType, destination, insurance, urgentProcessing } = requestData;

  const baseCosts = {
    documentationFee: 250,
    bankCharges: 150,
    courierFee: 75,
    handlingFee: 100,
  };

  let financingCosts: any = { ...baseCosts };

  // Calculate financing-specific costs
  switch (financingType) {
    case 'letter_of_credit':
      financingCosts.lcIssuanceFee = shipmentValue * 0.001; // 0.1% of shipment value
      financingCosts.lcConfirmationFee = shipmentValue * 0.0015; // 0.15% if confirmed
      financingCosts.amendmentFee = 100; // Per amendment
      break;
    case 'documentary_collection':
      financingCosts.collectionFee = Math.max(200, shipmentValue * 0.0005); // 0.05% min $200
      break;
    case 'export_factoring':
      financingCosts.factoringFee = shipmentValue * 0.02; // 2% of invoice value
      financingCosts.creditCheckFee = 150;
      break;
    case 'forfaiting':
      financingCosts.discountRate = shipmentValue * 0.05; // 5% annual discount rate
      break;
  }

  // Insurance costs
  if (insurance) {
    financingCosts.insurancePremium = shipmentValue * 0.002; // 0.2% of shipment value
  }

  // Destination-specific costs
  const destinationSurcharges = {
    'Africa': 150,
    'South America': 200,
    'Remote Locations': 300,
  };

  // Apply destination surcharge if applicable
  if (destinationSurcharges[destination.region]) {
    financingCosts.destinationSurcharge = destinationSurcharges[destination.region];
  }

  // Urgent processing surcharge
  if (urgentProcessing) {
    financingCosts.urgentProcessingSurcharge = Object.values(financingCosts).reduce((sum, cost) => sum + (cost || 0), 0) * 0.5; // 50% surcharge
  }

  const totalCost = Object.values(financingCosts).reduce((sum, cost) => sum + (cost || 0), 0);

  return NextResponse.json({
    shipmentValue,
    currency,
    financingType,
    breakdown: financingCosts,
    totalCost: Number(totalCost.toFixed(2)),
    costPercentage: Number(((totalCost / shipmentValue) * 100).toFixed(3)),
    recommendations: generateCostRecommendations(financingCosts, totalCost, shipmentValue),
    calculatedAt: new Date().toISOString(),
  });
}

// Helper functions for document generation
async function getShipmentDetails(shipmentId: string) {
  // In a real implementation, this would fetch from your shipments table
  return {
    id: shipmentId,
    invoiceNumber: `INV-${shipmentId}`,
    customer: {
      name: 'International Fragrance Importers LLC',
      address: '123 Trade Street, Dubai, UAE',
      email: 'imports@fragrance-importers.com',
    },
    items: [
      {
        description: 'Premium Oud Oil - Royal Collection',
        quantity: 50,
        unit: 'bottles',
        unitPrice: 250,
        totalValue: 12500,
        hsCode: '3301.29',
        countryOfOrigin: 'UAE',
      },
    ],
    totalValue: 12500,
    weight: 25.5,
    dimensions: { length: 100, width: 80, height: 60 },
    shippingDate: new Date().toISOString().split('T')[0],
  };
}

async function generateCommercialInvoice(shipment: any, currency: string, destination: any, incoterms: string) {
  return {
    invoiceNumber: shipment.invoiceNumber,
    date: new Date().toISOString().split('T')[0],
    seller: {
      name: 'Oud PMS Trading LLC',
      address: 'Dubai, United Arab Emirates',
      taxId: 'TRN: 100000000000003',
      email: 'exports@oudpms.com',
    },
    buyer: shipment.customer,
    shipment: {
      port: destination.port || 'Dubai Port',
      destination: destination.country,
      incoterms: incoterms,
      shippingDate: shipment.shippingDate,
    },
    items: shipment.items,
    totals: {
      subtotal: shipment.totalValue,
      currency: currency,
      total: shipment.totalValue,
    },
    declarations: {
      originCertificate: 'These goods are of UAE origin',
      exportDeclaration: 'This shipment is authorized for export from UAE',
      complianceCertificate: 'All items comply with destination country regulations',
    },
  };
}

async function generatePackingList(shipment: any, destination: any) {
  return {
    packingListNumber: `PL-${shipment.id}`,
    date: new Date().toISOString().split('T')[0],
    shipment: {
      invoiceNumber: shipment.invoiceNumber,
      destination: destination.country,
      totalPackages: 1,
      totalWeight: `${shipment.weight} kg`,
      totalVolume: `${shipment.dimensions.length * shipment.dimensions.width * shipment.dimensions.height / 1000000} CBM`,
    },
    packages: [
      {
        packageNumber: 1,
        type: 'Wooden Crate',
        dimensions: `${shipment.dimensions.length}x${shipment.dimensions.width}x${shipment.dimensions.height} cm`,
        weight: `${shipment.weight} kg`,
        contents: shipment.items,
      },
    ],
    handling: {
      specialInstructions: 'Handle with care - Fragile items',
      storageConditions: 'Store in cool, dry place',
      hazardous: false,
    },
  };
}

async function generateBillOfLading(shipment: any, destination: any, incoterms: string) {
  return {
    blNumber: `BL-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    shipper: {
      name: 'Oud PMS Trading LLC',
      address: 'Dubai, UAE',
    },
    consignee: shipment.customer,
    vessel: {
      name: 'MV Trade Express',
      voyage: 'TE-2024-001',
    },
    ports: {
      loading: 'Jebel Ali Port, Dubai',
      discharge: destination.port || 'Destination Port',
    },
    cargo: {
      description: 'Perfume and Oud Products',
      packages: 1,
      weight: `${shipment.weight} kg`,
      measurement: `${shipment.dimensions.length * shipment.dimensions.width * shipment.dimensions.height / 1000000} CBM`,
    },
    terms: {
      incoterms: incoterms,
      freightPayable: incoterms.includes('C') || incoterms.includes('D') ? 'Prepaid' : 'Collect',
    },
  };
}

async function generateCertificateOfOrigin(shipment: any, destination: any) {
  return {
    certificateNumber: `COO-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    exporter: {
      name: 'Oud PMS Trading LLC',
      address: 'Dubai, UAE',
    },
    consignee: shipment.customer,
    goods: shipment.items.map((item: any) => ({
      description: item.description,
      origin: item.countryOfOrigin,
      hsCode: item.hsCode,
      value: item.totalValue,
    })),
    declaration: 'I hereby certify that the goods described above are of UAE origin',
    chamberOfCommerce: {
      name: 'Dubai Chamber of Commerce',
      stamp: 'VERIFIED',
      date: new Date().toISOString().split('T')[0],
    },
  };
}

async function generateLCDocumentation(shipment: any, financingType: any) {
  return {
    lcType: financingType,
    shipment: shipment.id,
    amount: shipment.totalValue,
    documentation: 'Letter of Credit documentation for shipment',
  };
}

async function generateExportLicense(shipment: any, destination: any) {
  return {
    licenseNumber: `EL-${Date.now()}`,
    exporter: 'Oud PMS Trading LLC',
    destination: destination.country,
    products: shipment.items,
    validity: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
}

async function generateCustomsDeclaration(shipment: any, destination: any) {
  return {
    declarationNumber: `CD-${Date.now()}`,
    exporter: 'Oud PMS Trading LLC',
    destination: destination.country,
    items: shipment.items,
    totalValue: shipment.totalValue,
    customsCode: destination.customsCode || 'N/A',
  };
}

async function generateHalalCertificate(shipment: any, destination: any) {
  return {
    certificateNumber: `HALAL-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    certifyingBody: 'Emirates Authority for Standardization and Metrology (ESMA)',
    manufacturer: {
      name: 'Oud PMS Trading LLC',
      license: 'HL-2024-001',
    },
    products: shipment.items.map((item: any) => ({
      name: item.description,
      ingredients: 'Natural Oud Oil, Carrier Oil',
      halalStatus: 'CERTIFIED HALAL',
    })),
    validity: {
      from: new Date().toISOString().split('T')[0],
      to: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    declaration: 'The above products are certified Halal according to Islamic Sharia requirements',
  };
}

async function generateDefaultInsuranceCertificate(shipment: any, currency: string) {
  return {
    certificateNumber: `INS-${Date.now()}`,
    policyNumber: 'MC-2024-001',
    insuranceCompany: 'Dubai Islamic Insurance Company',
    insuredAmount: `${currency} ${(shipment.totalValue * 1.1)?.toLocaleString() || "0"}`, // 110% of shipment value
    coverage: ['marine_cargo', 'theft_pilferage', 'general_average'],
    voyage: {
      from: 'Dubai, UAE',
      to: 'Destination Port',
    },
    terms: {
      basis: 'Institute Cargo Clauses (A)',
      deductible: `${currency} 500`,
    },
    validity: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days
  };
}

// Additional helper functions
async function getPaymentTracking(shipmentId?: string, lcNumber?: string) {
  // In a real implementation, this would track payment status
  return {
    status: 'PENDING',
    method: 'Letter of Credit',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amountDue: 'USD 12,500',
  };
}

async function getComplianceStatus(shipmentId?: string) {
  return {
    documentsComplete: true,
    customsClearance: 'PENDING',
    exportLicense: 'APPROVED',
    destinationRequirements: 'VERIFIED',
    riskLevel: 'LOW',
  };
}

function generateCostRecommendations(costs: any, totalCost: number, shipmentValue: number) {
  const recommendations = [];

  if (totalCost / shipmentValue > 0.05) { // More than 5% of shipment value
    recommendations.push('Consider negotiating with banks for better rates due to high cost percentage');
  }

  if (costs.urgentProcessingSurcharge) {
    recommendations.push('Plan ahead to avoid urgent processing surcharges');
  }

  if (costs.lcIssuanceFee && costs.lcConfirmationFee) {
    recommendations.push('Consider unconfirmed LC to reduce costs');
  }

  return recommendations;
}

export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'document-templates') {
      return apiResponse(getDocumentTemplates());
    }

    if (action === 'financing-options') {
      return apiResponse(getFinancingOptions());
    }

    if (action === 'country-requirements') {
      const country = searchParams.get('country') || undefined;
      return apiResponse(getCountryRequirements(country));
    }

    return apiResponse({
      message: 'Export Financing Documentation API',
      availableDocuments: [
        'commercial_invoice',
        'packing_list',
        'bill_of_lading',
        'certificate_of_origin',
        'insurance_certificate',
        'letter_of_credit',
        'export_license',
        'halal_certificate',
        'customs_declaration',
      ],
      financingTypes: [
        'letter_of_credit',
        'documentary_collection',
        'open_account',
        'advance_payment',
        'export_factoring',
        'forfaiting',
      ],
    });
  } catch (error) {
    console.error('Export Financing GET error:', error);
    return apiError('Failed to process request', 500);
  }
});

function getDocumentTemplates() {
  return {
    commercial_invoice: {
      required_fields: ['seller', 'buyer', 'items', 'totals', 'incoterms'],
      optional_fields: ['shipping_marks', 'special_instructions'],
      format: 'PDF, Excel',
    },
    letter_of_credit: {
      required_fields: ['lc_number', 'issuing_bank', 'beneficiary', 'amount', 'expiry_date'],
      optional_fields: ['confirming_bank', 'special_instructions'],
      format: 'PDF, SWIFT MT700',
    },
    certificate_of_origin: {
      required_fields: ['exporter', 'consignee', 'goods', 'origin_country'],
      certifying_body: 'Chamber of Commerce',
      format: 'PDF with official stamp',
    },
  };
}

function getFinancingOptions() {
  return {
    letter_of_credit: {
      description: 'Bank guarantee for payment upon document presentation',
      cost: '0.1-0.15% of transaction value',
      risk: 'Low',
      timeline: '5-10 business days',
    },
    documentary_collection: {
      description: 'Bank handles document exchange for payment',
      cost: '0.05-0.1% of transaction value',
      risk: 'Medium',
      timeline: '3-7 business days',
    },
    export_factoring: {
      description: 'Immediate cash flow by selling receivables',
      cost: '1-3% of invoice value',
      risk: 'Low',
      timeline: '1-3 business days',
    },
    open_account: {
      description: 'Direct credit terms with buyer',
      cost: 'No bank charges',
      risk: 'High',
      timeline: 'Immediate',
    },
  };
}

function getCountryRequirements(country?: string) {
  const requirements = {
    'USA': {
      required_documents: ['commercial_invoice', 'packing_list', 'bill_of_lading'],
      special_requirements: ['FDA registration for cosmetics'],
      import_duties: '0-6.5% depending on product classification',
      processing_time: '3-5 business days',
    },
    'UK': {
      required_documents: ['commercial_invoice', 'packing_list', 'certificate_of_origin'],
      special_requirements: ['CPSR for cosmetic products'],
      import_duties: '0-4.2% + VAT 20%',
      processing_time: '2-4 business days',
    },
    'Saudi Arabia': {
      required_documents: ['commercial_invoice', 'packing_list', 'certificate_of_origin', 'halal_certificate'],
      special_requirements: ['SASO certification', 'Arabic labeling'],
      import_duties: '5-20% + VAT 15%',
      processing_time: '5-10 business days',
    },
  };

  return country ? (requirements as any)[country] || { error: 'Country requirements not found' } : requirements;
}