'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ArrowRightLeft,
  Factory,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Scale,
  Droplets,
  Beaker,
  Layers,
  TrendingUp,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Calculator,
  Timer,
  FlaskConical,
  Users,
  ShoppingCart,
  Bell,
  Calendar,
  DollarSign,
  TrendingDown,
  Zap,
  Archive,
  Workflow
} from 'lucide-react';

// Advanced inventory data structure
const unitConversions = {
  weight: {
    gram: 1,
    tola: 11.66, // 1 tola = 11.66 grams
    ounce: 28.35, // 1 ounce = 28.35 grams
    kilogram: 1000, // 1 kg = 1000 grams
    pound: 453.592 // 1 pound = 453.592 grams
  },
  volume: {
    milliliter: 1,
    liter: 1000, // 1 liter = 1000 ml
    ounce_fluid: 29.5735, // 1 fl oz = 29.5735 ml
    tola_volume: 11.66 // Traditional tola volume equivalent
  }
};

// Customer types and pricing tiers
const customerTypes = {
  retail: {
    name: 'Retail Customer',
    nameArabic: 'عميل تجزئة',
    discount: 0,
    minOrderValue: 0,
    paymentTerms: 'Immediate',
    benefits: ['Standard warranty', 'Return policy']
  },
  wholesale: {
    name: 'Wholesale Partner',
    nameArabic: 'شريك الجملة',
    discount: 15, // 15% discount
    minOrderValue: 5000, // AED
    paymentTerms: '30 days',
    benefits: ['Volume discounts', 'Extended warranty', 'Priority support']
  },
  vip: {
    name: 'VIP Customer',
    nameArabic: 'عميل مميز',
    discount: 8, // 8% discount
    minOrderValue: 1000, // AED
    paymentTerms: '15 days',
    benefits: ['Personal consultation', 'Early access', 'Custom blending']
  },
  distributor: {
    name: 'Authorized Distributor',
    nameArabic: 'موزع معتمد',
    discount: 25, // 25% discount
    minOrderValue: 15000, // AED
    paymentTerms: '45 days',
    benefits: ['Exclusive territories', 'Marketing support', 'Training']
  },
  corporate: {
    name: 'Corporate Client',
    nameArabic: 'عميل مؤسسي',
    discount: 12, // 12% discount
    minOrderValue: 3000, // AED
    paymentTerms: '30 days',
    benefits: ['Bulk pricing', 'Corporate branding', 'Account management']
  }
};

// Dynamic pricing rules
const pricingRules = {
  volumeDiscounts: [
    { minQuantity: 10, maxQuantity: 49, discount: 5 }, // 5% for 10-49 pieces
    { minQuantity: 50, maxQuantity: 99, discount: 10 }, // 10% for 50-99 pieces
    { minQuantity: 100, maxQuantity: 199, discount: 15 }, // 15% for 100-199 pieces
    { minQuantity: 200, maxQuantity: 999, discount: 20 }, // 20% for 200-999 pieces
    { minQuantity: 1000, maxQuantity: 9999, discount: 25 } // 25% for 1000+ pieces
  ],
  seasonalPricing: {
    ramadan: {
      name: 'Ramadan Special',
      nameArabic: 'عرض رمضان',
      startDate: '2024-03-10',
      endDate: '2024-04-10',
      discount: 12,
      applicableItems: ['FIN001', 'FIN002'],
      minOrderValue: 500
    },
    eid: {
      name: 'Eid Celebration',
      nameArabic: 'عرض العيد',
      startDate: '2024-04-08',
      endDate: '2024-04-15',
      discount: 15,
      applicableItems: ['FIN001'],
      minOrderValue: 300
    },
    nationalDay: {
      name: 'UAE National Day',
      nameArabic: 'اليوم الوطني',
      startDate: '2024-12-01',
      endDate: '2024-12-03',
      discount: 20,
      applicableItems: ['FIN001', 'FIN002'],
      minOrderValue: 200
    }
  },
  currencyRates: {
    base: 'AED',
    rates: {
      USD: 3.67,
      EUR: 4.02,
      GBP: 4.65,
      SAR: 0.98,
      KWD: 12.10,
      QAR: 1.01,
      BHD: 9.74,
      OMR: 9.55
    },
    lastUpdated: '2024-09-30'
  },
  taxRates: {
    vat: {
      rate: 5, // 5% VAT in UAE
      applicable: true,
      exemptCustomerTypes: [], // No exemptions for VAT
      exemptItems: [] // No exempt items
    },
    importDuty: {
      rate: 4, // 4% import duty
      applicable: true,
      exemptOrigins: ['UAE'], // Local products exempt
      exemptItems: ['RAW001'] // Some raw materials exempt
    }
  }
};

// Advanced batch control and traceability system
const batchControlSystem = {
  batchNumbering: {
    format: '{ORIGIN}-{YEAR}-{SEQUENCE}', // e.g., CAM-2024-001
    sequences: {
      cambodia: 'CAM',
      india: 'IND',
      myanmar: 'MYN',
      uae: 'UAE',
      syria: 'SYR'
    },
    autoGenerate: true,
    includeQRCode: true,
    includeBarcode: true
  },
  traceabilityLevels: {
    raw: {
      required: ['origin', 'harvest_date', 'supplier', 'quality_grade', 'moisture_content'],
      optional: ['tree_age', 'soil_type', 'climate_conditions', 'harvest_method']
    },
    processing: {
      required: ['distillation_date', 'temperature', 'pressure', 'duration', 'operator'],
      optional: ['wood_preparation', 'water_source', 'fuel_type', 'vessel_type']
    },
    finished: {
      required: ['blend_date', 'ingredients', 'batch_yield', 'quality_test'],
      optional: ['aging_period', 'bottle_type', 'label_batch', 'packaging_date']
    }
  },
  qualityControl: {
    testTypes: [
      { id: 'aroma_profile', name: 'Aroma Profile', required: true, frequency: 'every_batch' },
      { id: 'color_analysis', name: 'Color Analysis', required: true, frequency: 'every_batch' },
      { id: 'density_test', name: 'Density Test', required: true, frequency: 'every_batch' },
      { id: 'ph_level', name: 'pH Level', required: false, frequency: 'weekly' },
      { id: 'viscosity', name: 'Viscosity', required: false, frequency: 'monthly' },
      { id: 'contamination', name: 'Contamination Check', required: true, frequency: 'every_batch' }
    ],
    grading: {
      royal: { minScore: 95, requirements: ['perfect_aroma', 'premium_color', 'zero_contamination'] },
      super: { minScore: 85, requirements: ['excellent_aroma', 'good_color', 'minimal_contamination'] },
      premium: { minScore: 75, requirements: ['good_aroma', 'acceptable_color', 'low_contamination'] },
      standard: { minScore: 60, requirements: ['basic_aroma', 'fair_color', 'acceptable_contamination'] }
    }
  },
  compliance: {
    uae_standards: {
      halal_certification: true,
      esma_compliance: true,
      customs_documentation: true,
      origin_certificate: true
    },
    international: {
      iso_standards: ['ISO 9001', 'ISO 22000'],
      organic_certification: false,
      fair_trade: false
    }
  }
};

// Batch tracking data with enhanced traceability
const batchTrackingData = [
  {
    id: 'BATCH_CAM_001',
    batchNumber: 'CAM-2024-001',
    qrCode: 'QR_CAM_2024_001_ABC123',
    barcode: '1234567890123',
    itemId: 'RAW001',
    itemName: 'Cambodian Oud Wood - Raw',
    status: 'active',
    currentLocation: 'LOC001',
    totalQuantity: 5.5,
    availableQuantity: 5.0,
    reservedQuantity: 0.5,
    unit: 'kilogram',
    createdDate: '2024-01-15',
    expiryDate: '2029-01-15',
    lastUpdated: '2024-09-30',

    // Origin and sourcing information
    origin: {
      country: 'Cambodia',
      region: 'Koh Kong Province',
      supplier: 'Al-Taiba Trading',
      harvestDate: '2024-01-10',
      treeAge: '25 years',
      harvestMethod: 'Sustainable cutting',
      soilType: 'Clay-rich forest soil',
      climateConditions: 'Tropical monsoon, 85% humidity'
    },

    // Quality information
    qualityData: {
      grade: 'Super',
      moistureContent: 12.5, // percentage
      density: 0.84, // g/cm³
      aromaProfile: {
        sweetness: 8.5,
        woodiness: 9.2,
        smokiness: 7.8,
        complexity: 9.0,
        overall: 8.8
      },
      colorAnalysis: {
        hue: 'Dark amber',
        saturation: 'High',
        clarity: 'Clear with natural patterns'
      },
      contaminationLevel: 0.1, // percentage
      overallScore: 88.5
    },

    // Compliance and certifications
    compliance: {
      halalCertified: true,
      halalCertNumber: 'HAL-UAE-2024-0156',
      originCertificate: 'OC-CAM-2024-001',
      customsDeclaration: 'CD-DXB-2024-0892',
      esmaCertificate: 'ESMA-2024-CAM-001',
      phytosanitaryCert: 'PS-CAM-2024-156'
    },

    // Processing history
    processHistory: [
      {
        date: '2024-01-15',
        action: 'goods_receipt',
        operator: 'Ahmed Al-Rashid',
        location: 'LOC001',
        notes: 'Initial receipt and quality inspection',
        documents: ['invoice_001', 'quality_cert_001']
      },
      {
        date: '2024-01-16',
        action: 'quality_test',
        operator: 'Dr. Sarah Ahmed',
        location: 'LOC003',
        notes: 'Comprehensive quality analysis completed',
        testResults: {
          aromaTest: 'passed',
          densityTest: 'passed',
          contaminationTest: 'passed'
        }
      },
      {
        date: '2024-02-01',
        action: 'aging_start',
        operator: 'Omar Saeed',
        location: 'LOC003',
        notes: 'Moved to aging room 1 for maturation',
        agingConditions: {
          temperature: '22-25°C',
          humidity: '60-65%',
          duration: '90 days'
        }
      }
    ],

    // Current storage conditions
    storageConditions: {
      temperature: 23.5, // Celsius
      humidity: 62.0, // percentage
      lightExposure: 'minimal',
      airCirculation: 'controlled',
      lastMonitored: '2024-09-30 14:30:00'
    },

    // Transformation tracking
    transformations: [
      {
        id: 'TRANS_001',
        date: '2024-03-15',
        type: 'segregation',
        inputQuantity: 1.0,
        inputUnit: 'kilogram',
        outputs: [
          { product: 'Oud Chips Premium', quantity: 300, unit: 'gram', newBatch: 'CAM-CHIP-2024-001' },
          { product: 'Oud Powder Grade A', quantity: 500, unit: 'gram', newBatch: 'CAM-PWD-2024-001' },
          { product: 'Oud Dust', quantity: 200, unit: 'gram', newBatch: 'CAM-DUST-2024-001' }
        ],
        wastage: 0.0,
        operator: 'Master Craftsman Ali',
        notes: 'High-quality segregation with minimal waste'
      }
    ],

    // Alerts and notifications
    alerts: [
      {
        id: 'ALERT_001',
        type: 'aging_complete',
        priority: 'medium',
        message: 'Aging period completed - ready for processing',
        date: '2024-04-15',
        acknowledged: true,
        acknowledgedBy: 'Omar Saeed',
        acknowledgedDate: '2024-04-15'
      }
    ]
  },
  {
    id: 'BATCH_DIST_005',
    batchNumber: 'DIST-2024-005',
    qrCode: 'QR_DIST_2024_005_XYZ789',
    barcode: '2345678901234',
    itemId: 'SEMI001',
    itemName: 'Oud Oil - Distilled',
    status: 'active',
    currentLocation: 'LOC003',
    totalQuantity: 250,
    availableQuantity: 200,
    reservedQuantity: 50,
    unit: 'milliliter',
    createdDate: '2024-02-01',
    expiryDate: '2027-02-01',
    lastUpdated: '2024-09-30',

    // Parent batch linkage
    parentBatches: ['CAM-2024-001'],

    // Distillation process data
    distillationData: {
      startDate: '2024-01-28',
      endDate: '2024-02-01',
      duration: '96 hours',
      temperature: {
        initial: 100,
        peak: 180,
        final: 120,
        unit: 'celsius'
      },
      pressure: '1.2 bar',
      waterUsed: 50, // liters
      fuelConsumption: '120 kg wood',
      vesselType: 'Traditional copper still',
      yield: 5.0, // percentage
      operator: 'Master Distiller Hassan',
      assistants: ['Ahmad Ali', 'Khalid Omar']
    },

    // Quality data for distilled oil
    qualityData: {
      grade: 'Premium',
      specificGravity: 0.92,
      refractiveIndex: 1.485,
      acidValue: 2.1,
      esterValue: 15.8,
      aromaProfile: {
        woody: 9.0,
        sweet: 7.5,
        smoky: 8.2,
        floral: 6.8,
        overall: 8.5
      },
      colorGrade: 'Dark amber with golden highlights',
      clarity: 'Crystal clear',
      overallScore: 92.3
    },

    // Enhanced storage for liquid products
    storageConditions: {
      temperature: 18.0, // Celsius - cooler for oils
      humidity: 45.0, // percentage - lower for oils
      lightExposure: 'none', // Dark storage
      containerType: 'amber glass',
      sealType: 'airtight',
      lastMonitored: '2024-09-30 15:45:00'
    },

    processHistory: [
      {
        date: '2024-01-28',
        action: 'distillation_start',
        operator: 'Master Distiller Hassan',
        location: 'LOC003',
        notes: 'Started distillation process with CAM-2024-001 raw material',
        inputMaterial: 'CAM-2024-001',
        inputQuantity: '5.0 kg'
      },
      {
        date: '2024-02-01',
        action: 'distillation_complete',
        operator: 'Master Distiller Hassan',
        location: 'LOC003',
        notes: 'Distillation completed successfully with 5% yield',
        outputQuantity: '250 ml',
        qualityGrade: 'Premium'
      },
      {
        date: '2024-02-02',
        action: 'quality_analysis',
        operator: 'Dr. Sarah Ahmed',
        location: 'LOC003',
        notes: 'Complete chemical and organoleptic analysis',
        testResults: {
          chemicalAnalysis: 'passed',
          aromaTesting: 'excellent',
          purityTest: 'passed'
        }
      }
    ]
  }
];

// Enhanced UAE-specific procurement and vendor management system
const procurementSystem = {
  uaeImportRegulations: {
    requiredDocuments: [
      { id: 'commercial_invoice', name: 'Commercial Invoice', required: true, authority: 'Customs' },
      { id: 'packing_list', name: 'Packing List', required: true, authority: 'Customs' },
      { id: 'bill_of_lading', name: 'Bill of Lading/AWB', required: true, authority: 'Shipping' },
      { id: 'certificate_of_origin', name: 'Certificate of Origin', required: true, authority: 'Chamber of Commerce' },
      { id: 'halal_certificate', name: 'Halal Certificate', required: true, authority: 'Islamic Authority' },
      { id: 'health_certificate', name: 'Health Certificate', required: false, authority: 'Health Ministry' },
      { id: 'phytosanitary', name: 'Phytosanitary Certificate', required: true, authority: 'Agriculture Ministry' },
      { id: 'cites_permit', name: 'CITES Permit', required: true, authority: 'CITES Authority' },
      { id: 'quality_certificate', name: 'Quality Certificate', required: false, authority: 'Testing Laboratory' }
    ],
    dutyRates: {
      raw_materials: { rate: 4, description: '4% import duty on raw oud materials' },
      essential_oils: { rate: 4, description: '4% import duty on essential oils' },
      finished_perfumes: { rate: 20, description: '20% import duty on finished perfumes' },
      packaging: { rate: 8, description: '8% import duty on packaging materials' },
      machinery: { rate: 0, description: '0% duty on production machinery' }
    },
    vatRate: 5, // 5% VAT in UAE
    clearanceTimeframes: {
      standard: '3-5 working days',
      expedited: '1-2 working days',
      complex: '7-14 working days'
    },
    ports: [
      { id: 'AEDXB', name: 'Dubai (Jebel Ali)', type: 'Sea/Air' },
      { id: 'AEAUH', name: 'Abu Dhabi', type: 'Sea/Air' },
      { id: 'AESHJ', name: 'Sharjah', type: 'Air' },
      { id: 'AEFUJ', name: 'Fujairah', type: 'Sea' }
    ]
  },
  vendorCategories: {
    international_suppliers: {
      name: 'International Suppliers',
      nameArabic: 'الموردين الدوليين',
      requirements: ['CITES permit', 'Halal certification', 'Quality certificates'],
      paymentTerms: ['LC', 'TT', 'DP'],
      leadTime: '30-60 days',
      minOrderValue: 10000 // AED
    },
    local_distributors: {
      name: 'Local Distributors',
      nameArabic: 'الموزعين المحليين',
      requirements: ['Trade license', 'VAT registration'],
      paymentTerms: ['30 days', '60 days', 'Cash'],
      leadTime: '3-7 days',
      minOrderValue: 1000 // AED
    },
    packaging_suppliers: {
      name: 'Packaging Suppliers',
      nameArabic: 'موردي التعبئة والتغليف',
      requirements: ['Quality certification', 'Food grade approval'],
      paymentTerms: ['30 days', 'COD'],
      leadTime: '7-14 days',
      minOrderValue: 500 // AED
    },
    equipment_vendors: {
      name: 'Equipment Vendors',
      nameArabic: 'موردي المعدات',
      requirements: ['Warranty', 'Installation support', 'Training'],
      paymentTerms: ['50% advance', 'LC'],
      leadTime: '60-120 days',
      minOrderValue: 25000 // AED
    }
  }
};

// Current purchase orders with UAE import tracking
const currentPurchaseOrders = [
  {
    id: 'PO-2024-001',
    poNumber: 'PO-UAE-2024-001',
    vendorId: 'SUP001',
    vendorName: 'Al-Taiba Trading LLC',
    status: 'customs_clearance',
    orderDate: '2024-09-15',
    expectedDelivery: '2024-10-05',
    totalValue: 85000, // AED
    currency: 'AED',
    incoterms: 'CIF Dubai',
    paymentTerms: '30 days',
    priority: 'high',
    items: [
      {
        id: 'RAW001',
        name: 'Cambodian Oud Wood - Raw',
        quantity: 10,
        unit: 'kilogram',
        unitPrice: 2500,
        totalPrice: 25000,
        specifications: 'Grade: Super, Moisture: <12%, Origin: Koh Kong Province'
      },
      {
        id: 'RAW002',
        name: 'Indian Oud Chips - Premium',
        quantity: 15,
        unit: 'kilogram',
        unitPrice: 1800,
        totalPrice: 27000,
        specifications: 'Grade: Premium, Size: 5-10mm, Origin: Assam'
      }
    ],
    importDetails: {
      portOfEntry: 'AEDXB',
      customsDeclaration: 'CD-DXB-2024-1156',
      trackingNumber: 'MSC-DXB-2024-8901',
      importDuty: 2080, // AED (4% of value)
      vat: 4354, // AED (5% of value + duty)
      clearanceAgent: 'Dubai Customs Clearance LLC',
      estimatedClearance: '2024-10-02',
      documentsStatus: {
        commercial_invoice: 'approved',
        packing_list: 'approved',
        bill_of_lading: 'approved',
        certificate_of_origin: 'approved',
        halal_certificate: 'pending',
        cites_permit: 'approved'
      }
    },
    approvalHistory: [
      { date: '2024-09-15', approver: 'Ahmed Al-Rashid', role: 'Procurement Manager', action: 'created' },
      { date: '2024-09-16', approver: 'Omar Hassan', role: 'Finance Manager', action: 'approved' },
      { date: '2024-09-16', approver: 'System', role: 'Auto', action: 'sent_to_vendor' },
      { date: '2024-09-18', approver: 'Al-Taiba Trading', role: 'Vendor', action: 'confirmed' },
      { date: '2024-09-25', approver: 'System', role: 'Auto', action: 'in_transit' },
      { date: '2024-09-30', approver: 'Customs Agent', role: 'Agent', action: 'customs_clearance' }
    ]
  },
  {
    id: 'PO-2024-002',
    poNumber: 'PO-UAE-2024-002',
    vendorId: 'SUP002',
    vendorName: 'European Essentials DMCC',
    status: 'confirmed',
    orderDate: '2024-09-28',
    expectedDelivery: '2024-10-12',
    totalValue: 15000, // EUR
    currency: 'EUR',
    incoterms: 'DDP Dubai',
    paymentTerms: 'Advance payment',
    priority: 'medium',
    items: [
      {
        id: 'ESS001',
        name: 'Bulgarian Rose Otto',
        quantity: 2,
        unit: 'liter',
        unitPrice: 4500,
        totalPrice: 9000,
        specifications: 'Concentration: 100%, Origin: Valley of Roses, Organic certified'
      },
      {
        id: 'ESS002',
        name: 'French Lavender Essential Oil',
        quantity: 5,
        unit: 'liter',
        unitPrice: 1200,
        totalPrice: 6000,
        specifications: 'Lavandula angustifolia, Steam distilled, Organic'
      }
    ],
    importDetails: {
      portOfEntry: 'AEDXB',
      customsDeclaration: null,
      trackingNumber: null,
      importDuty: 2205, // AED equivalent (4% of EUR value)
      vat: 2868, // AED equivalent (5%)
      clearanceAgent: 'Express Logistics UAE',
      estimatedClearance: '2024-10-13',
      documentsStatus: {
        commercial_invoice: 'prepared',
        packing_list: 'prepared',
        bill_of_lading: 'pending',
        certificate_of_origin: 'approved',
        halal_certificate: 'approved',
        organic_certificate: 'approved'
      }
    },
    approvalHistory: [
      { date: '2024-09-28', approver: 'Sarah Al-Zahra', role: 'Lab Manager', action: 'created' },
      { date: '2024-09-29', approver: 'Ahmed Al-Rashid', role: 'Procurement Manager', action: 'approved' },
      { date: '2024-09-29', approver: 'System', role: 'Auto', action: 'sent_to_vendor' },
      { date: '2024-09-30', approver: 'European Essentials', role: 'Vendor', action: 'confirmed' }
    ]
  },
  {
    id: 'PO-2024-003',
    poNumber: 'PO-UAE-2024-003',
    vendorId: 'SUP003',
    vendorName: 'Gulf Packaging Industries',
    status: 'delivered',
    orderDate: '2024-09-20',
    expectedDelivery: '2024-09-30',
    actualDelivery: '2024-09-29',
    totalValue: 12500, // AED
    currency: 'AED',
    incoterms: 'DDP',
    paymentTerms: '15 days',
    priority: 'low',
    items: [
      {
        id: 'PKG001',
        name: '12ml Crystal Bottles',
        quantity: 1000,
        unit: 'pieces',
        unitPrice: 8.5,
        totalPrice: 8500,
        specifications: 'Clear crystal, gold cap, 12ml capacity'
      },
      {
        id: 'PKG002',
        name: 'Luxury Gift Boxes',
        quantity: 500,
        unit: 'pieces',
        unitPrice: 8,
        totalPrice: 4000,
        specifications: 'Magnetic closure, gold foil, branded'
      }
    ],
    importDetails: null, // Local supplier
    approvalHistory: [
      { date: '2024-09-20', approver: 'Fatima Hassan', role: 'Store Manager', action: 'created' },
      { date: '2024-09-20', approver: 'Ahmed Al-Rashid', role: 'Procurement Manager', action: 'approved' },
      { date: '2024-09-21', approver: 'System', role: 'Auto', action: 'sent_to_vendor' },
      { date: '2024-09-22', approver: 'Gulf Packaging', role: 'Vendor', action: 'confirmed' },
      { date: '2024-09-29', approver: 'System', role: 'Auto', action: 'delivered' }
    ]
  }
];

// Production integration and material consumption system
const productionIntegration = {
  materialConsumptionTypes: {
    direct: {
      name: 'Direct Consumption',
      description: 'Materials directly used in production',
      autoDeduct: true,
      trackWastage: true
    },
    indirect: {
      name: 'Indirect Consumption',
      description: 'Supporting materials (packaging, labels)',
      autoDeduct: false,
      trackWastage: false
    },
    testing: {
      name: 'Quality Testing',
      description: 'Materials used for quality control testing',
      autoDeduct: true,
      trackWastage: false
    },
    sample: {
      name: 'Sample Production',
      description: 'Materials for sample/trial production',
      autoDeduct: true,
      trackWastage: true
    }
  },
  productionStages: {
    preparation: {
      name: 'Material Preparation',
      nameArabic: 'تحضير المواد',
      duration: '1-2 hours',
      materials: ['raw_materials', 'tools', 'containers'],
      wastageRate: 2 // 2% typical wastage
    },
    distillation: {
      name: 'Distillation Process',
      nameArabic: 'عملية التقطير',
      duration: '48-96 hours',
      materials: ['prepared_wood', 'water', 'fuel'],
      wastageRate: 5 // 5% typical wastage
    },
    separation: {
      name: 'Oil Separation',
      nameArabic: 'فصل الزيت',
      duration: '4-8 hours',
      materials: ['distilled_mixture', 'separation_agents'],
      wastageRate: 1 // 1% typical wastage
    },
    aging: {
      name: 'Aging Process',
      nameArabic: 'عملية النضج',
      duration: '30-365 days',
      materials: ['raw_oil', 'aging_containers'],
      wastageRate: 3 // 3% evaporation loss
    },
    blending: {
      name: 'Blending & Mixing',
      nameArabic: 'الخلط والمزج',
      duration: '2-4 hours',
      materials: ['base_oils', 'additives', 'carriers'],
      wastageRate: 1 // 1% mixing loss
    },
    packaging: {
      name: 'Packaging & Bottling',
      nameArabic: 'التعبئة والتغليف',
      duration: '1-2 hours',
      materials: ['finished_oil', 'bottles', 'labels', 'boxes'],
      wastageRate: 0.5 // 0.5% packaging loss
    }
  },
  automationRules: {
    stockReservation: {
      enabled: true,
      reserveOnProductionStart: true,
      reservationPeriod: 7, // days
      autoRelease: true
    },
    materialDeduction: {
      enabled: true,
      deductOnCompletion: true,
      includeWastage: true,
      requireApproval: false
    },
    qualityCheckTriggers: {
      autoCreateQCTasks: true,
      blockProductionOnFailure: true,
      notifyQCManager: true
    },
    inventoryAlerts: {
      lowStockWarning: true,
      stockoutPrevention: true,
      autoReorderSuggestion: true
    }
  }
};

// Production Integration Utility Functions
const getProductionOrder = (orderId: string) => {
  return currentProductionOrders.find(order => order.id === orderId);
};

const calculateMaterialConsumption = (orderId: string, materialId: string) => {
  const order = getProductionOrder(orderId);
  if (!order) return null;

  const consumption = order.materialConsumption.find(mat => mat.materialId === materialId);
  if (!consumption) return null;

  const consumptionType = productionIntegration.materialConsumptionTypes[consumption.consumptionType];
  const stage = productionIntegration.productionStages[order.currentStage];

  const expectedWastage = (consumption.plannedQuantity * (stage?.wastageRate || 0)) / 100;
  const totalExpected = consumption.plannedQuantity + expectedWastage;

  return {
    ...consumption,
    expectedWastage,
    totalExpected,
    variance: consumption.actualQuantity ? consumption.actualQuantity - totalExpected : 0,
    efficiency: consumption.actualQuantity ? ((totalExpected - consumption.actualQuantity) / totalExpected * 100).toFixed(1) : 0,
    autoDeduct: consumptionType.autoDeduct,
    trackWastage: consumptionType.trackWastage
  };
};

const getProductionStageProgress = (orderId: string) => {
  const order = getProductionOrder(orderId);
  if (!order) return null;

  const allStages = Object.keys(productionIntegration.productionStages);
  const currentStageIndex = allStages.indexOf(order.currentStage);
  const progress = ((currentStageIndex + 1) / allStages.length) * 100;

  return {
    currentStage: order.currentStage,
    currentStageIndex,
    totalStages: allStages.length,
    progress: Math.round(progress),
    nextStage: currentStageIndex < allStages.length - 1 ? allStages[currentStageIndex + 1] : null,
    stageDetails: productionIntegration.productionStages[order.currentStage]
  };
};

const calculateInventoryImpact = (orderId: string) => {
  const order = getProductionOrder(orderId);
  if (!order) return null;

  const reservedMaterials = order.materialConsumption.map(mat => {
    const item = inventoryItems.find(inv => inv.id === mat.materialId);
    return {
      materialId: mat.materialId,
      materialName: item?.name || 'Unknown',
      plannedQuantity: mat.plannedQuantity,
      unit: mat.unit,
      currentStock: item?.currentStock || 0,
      reservedForProduction: mat.plannedQuantity,
      availableAfterReservation: (item?.currentStock || 0) - mat.plannedQuantity,
      impactLevel: ((item?.currentStock || 0) - mat.plannedQuantity) < (item?.minStockLevel || 0) ? 'critical' :
                   ((item?.currentStock || 0) - mat.plannedQuantity) < (item?.minStockLevel || 0) * 1.5 ? 'warning' : 'normal'
    };
  });

  return {
    orderId,
    productName: order.productName,
    reservedMaterials,
    totalMaterials: reservedMaterials.length,
    criticalItems: reservedMaterials.filter(mat => mat.impactLevel === 'critical').length,
    warningItems: reservedMaterials.filter(mat => mat.impactLevel === 'warning').length
  };
};

const getProductionEfficiency = (orderId: string) => {
  const order = getProductionOrder(orderId);
  if (!order) return null;

  const totalPlannedMaterials = order.materialConsumption.reduce((sum, mat) => sum + mat.plannedQuantity, 0);
  const totalActualMaterials = order.materialConsumption.reduce((sum, mat) => sum + (mat.actualQuantity || 0), 0);

  const efficiency = totalPlannedMaterials > 0 ? ((totalPlannedMaterials - totalActualMaterials) / totalPlannedMaterials * 100) : 0;
  const currentStage = productionIntegration.productionStages[order.currentStage];

  return {
    orderId,
    efficiency: efficiency.toFixed(1),
    totalPlannedMaterials,
    totalActualMaterials,
    variance: totalActualMaterials - totalPlannedMaterials,
    currentStageWastage: currentStage?.wastageRate || 0,
    status: efficiency > 5 ? 'excellent' : efficiency > 0 ? 'good' : efficiency < -10 ? 'poor' : 'normal'
  };
};

const simulateProductionImpact = (materialId: string, quantity: number, unit: string) => {
  const item = inventoryItems.find(inv => inv.id === materialId);
  if (!item) return null;

  const convertedQuantity = convertUnits(quantity, unit, item.stockUnit, 'weight');
  const newStock = item.currentStock - convertedQuantity;
  const stockStatus = getStockStatus(item, null, newStock);

  return {
    materialId,
    materialName: item.name,
    currentStock: item.currentStock,
    plannedConsumption: convertedQuantity,
    projectedStock: newStock,
    stockStatus,
    daysUntilStockout: newStock > 0 ? Math.floor(newStock / (convertedQuantity / 7)) : 0, // Assuming 7-day production cycle
    reorderRequired: newStock < item.minStockLevel,
    criticalLevel: newStock < item.minStockLevel * 0.5
  };
};

// Sales and POS Integration Utility Functions
const getSalesOrder = (orderId: string) => {
  return currentSalesOrders.find(order => order.id === orderId);
};

const calculateSalesInventoryImpact = (orderId: string) => {
  const order = getSalesOrder(orderId);
  if (!order) return null;

  const impactedItems = order.items.map(item => {
    const inventoryItem = inventoryItems.find(inv => inv.id === item.itemId);
    const locationStock = inventoryItem?.locationStock?.[item.locationId];

    return {
      itemId: item.itemId,
      itemName: item.itemName,
      orderQuantity: item.quantity,
      unit: item.unit,
      locationId: item.locationId,
      currentStock: locationStock?.currentStock || 0,
      reservedStock: item.stockImpact.reservedStock,
      deductedStock: item.stockImpact.deductedStock,
      remainingStock: item.stockImpact.remainingStock,
      stockStatus: item.stockImpact.stockStatus,
      minStockLevel: locationStock?.minStockLevel || 0,
      reorderRequired: item.stockImpact.remainingStock < (locationStock?.minStockLevel || 0),
      impactLevel: item.stockImpact.remainingStock <= salesIntegration.inventoryIntegration.lowStockThresholds.critical ? 'critical' :
                   item.stockImpact.remainingStock <= salesIntegration.inventoryIntegration.lowStockThresholds.warning ? 'warning' : 'normal'
    };
  });

  return {
    orderId,
    orderNumber: order.orderNumber,
    salesChannel: order.salesChannel,
    totalItems: impactedItems.length,
    impactedItems,
    criticalItems: impactedItems.filter(item => item.impactLevel === 'critical').length,
    warningItems: impactedItems.filter(item => item.impactLevel === 'warning').length,
    reorderItems: impactedItems.filter(item => item.reorderRequired).length
  };
};

const getPOSTerminalStatus = (terminalId: string) => {
  const terminal = salesIntegration.posTerminals[terminalId];
  if (!terminal) return null;

  const lastSyncTime = new Date(terminal.lastSync);
  const now = new Date();
  const minutesSinceSync = Math.floor((now.getTime() - lastSyncTime.getTime()) / (1000 * 60));

  return {
    ...terminal,
    minutesSinceSync,
    syncStatus: minutesSinceSync <= 5 ? 'current' : minutesSinceSync <= 15 ? 'warning' : 'error',
    locationName: storeLocations.find(loc => loc.id === terminal.location)?.name || 'Unknown'
  };
};

const calculateChannelPerformance = (channel: string, date: string = '2024-09-30') => {
  const metrics = salesAnalytics.dailyMetrics[date];
  if (!metrics) return null;

  const channelData = metrics.salesByChannel[channel];
  if (!channelData) return null;

  const channelConfig = salesIntegration.salesChannels[channel];

  return {
    channel,
    channelName: channelConfig.name,
    orders: channelData.orders,
    revenue: channelData.revenue,
    averageOrderValue: channelData.revenue / channelData.orders,
    percentOfTotalRevenue: (channelData.revenue / metrics.totalSales * 100).toFixed(1),
    percentOfTotalOrders: (channelData.orders / metrics.totalOrders * 100).toFixed(1),
    priceType: channelConfig.priceType,
    maxDiscount: channelConfig.maxDiscountPercent,
    loyaltyEnabled: channelConfig.loyaltyIntegration
  };
};

const simulateSaleImpact = (itemId: string, quantity: number, locationId: string, salesChannel: string) => {
  const item = inventoryItems.find(inv => inv.id === itemId);
  if (!item) return null;

  const locationStock = item.locationStock?.[locationId];
  if (!locationStock) return null;

  const channelConfig = salesIntegration.salesChannels[salesChannel];
  const stockThresholds = salesIntegration.inventoryIntegration.lowStockThresholds;

  const currentStock = locationStock.currentStock;
  const reservedStock = locationStock.reservedStock || 0;
  const availableStock = currentStock - reservedStock;

  // Check if sale is possible
  if (quantity > availableStock && !salesIntegration.inventoryIntegration.automationRules.allowBackorders) {
    return {
      itemId,
      itemName: item.name,
      saleAllowed: false,
      reason: 'Insufficient stock',
      requestedQuantity: quantity,
      availableQuantity: availableStock,
      currentStock,
      reservedStock
    };
  }

  // Calculate stock impact based on channel rules
  let reservedQuantity = 0;
  let deductedQuantity = 0;

  if (channelConfig.stockReservation) {
    reservedQuantity = quantity;
  } else {
    deductedQuantity = quantity;
  }

  const newReservedStock = reservedStock + reservedQuantity;
  const newCurrentStock = currentStock - deductedQuantity;
  const newAvailableStock = newCurrentStock - newReservedStock;

  const stockStatus = newAvailableStock <= stockThresholds.critical ? 'critical' :
                     newAvailableStock <= stockThresholds.warning ? 'warning' : 'normal';

  const willBlockFutureSales = stockStatus === 'critical' && salesIntegration.inventoryIntegration.automationRules.blockSalesOnZeroStock;

  return {
    itemId,
    itemName: item.name,
    saleAllowed: true,
    salesChannel,
    channelName: channelConfig.name,
    requestedQuantity: quantity,
    currentStock,
    projectedCurrentStock: newCurrentStock,
    reservedStock,
    projectedReservedStock: newReservedStock,
    availableStock,
    projectedAvailableStock: newAvailableStock,
    stockStatus,
    willBlockFutureSales,
    reorderRequired: newAvailableStock < locationStock.minStockLevel,
    estimatedStockoutDays: newAvailableStock > 0 ? Math.floor(newAvailableStock / (quantity / 30)) : 0, // 30-day average
    crossLocationOptions: salesIntegration.inventoryIntegration.automationRules.crossLocationFulfillment ?
      Object.keys(item.locationStock).filter(locId =>
        locId !== locationId &&
        item.locationStock[locId].availableStock >= quantity
      ).map(locId => ({
        locationId: locId,
        locationName: storeLocations.find(loc => loc.id === locId)?.name,
        availableStock: item.locationStock[locId].availableStock
      })) : []
  };
};

const getStockReservations = (locationId?: string) => {
  const reservations = currentSalesOrders
    .filter(order => order.status !== 'completed' && order.status !== 'cancelled')
    .flatMap(order =>
      order.items
        .filter(item => !locationId || item.locationId === locationId)
        .filter(item => item.stockImpact.reservedStock > 0)
        .map(item => ({
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerInfo.name,
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.stockImpact.reservedStock,
          unit: item.unit,
          locationId: item.locationId,
          locationName: storeLocations.find(loc => loc.id === item.locationId)?.name,
          salesChannel: order.salesChannel,
          orderDate: order.orderDate,
          reservationExpiry: getReservationExpiry(order.orderDate, order.salesChannel),
          autoRelease: salesIntegration.inventoryIntegration.reservationRules[order.salesChannel].autoRelease
        }))
    );

  return reservations;
};

const getReservationExpiry = (orderDate: string, salesChannel: string) => {
  const reservationRule = salesIntegration.inventoryIntegration.reservationRules[salesChannel];
  if (!reservationRule) return null;

  const orderDateTime = new Date(orderDate);
  const duration = reservationRule.duration;

  if (duration === '0 minutes') return orderDateTime;

  const [amount, unit] = duration.split(' ');
  const milliseconds = unit === 'minutes' ? parseInt(amount) * 60 * 1000 :
                      unit === 'hours' ? parseInt(amount) * 60 * 60 * 1000 :
                      parseInt(amount) * 24 * 60 * 60 * 1000; // days

  return new Date(orderDateTime.getTime() + milliseconds);
};

const getSalesChannelStats = () => {
  const stats = Object.keys(salesIntegration.salesChannels).map(channel => {
    const performance = calculateChannelPerformance(channel);
    const activeOrders = currentSalesOrders.filter(order =>
      order.salesChannel === channel &&
      order.status !== 'completed' &&
      order.status !== 'cancelled'
    ).length;

    return {
      channel,
      performance,
      activeOrders,
      activeReservations: getStockReservations().filter(res => res.salesChannel === channel).length
    };
  });

  return stats;
};

// Advanced Analytics Utility Functions
const calculateTurnoverRate = (itemId: string, period: 'monthly' | 'quarterly' | 'annual') => {
  const analytics = inventoryAnalytics.performanceMetrics.turnoverRates[itemId];
  if (!analytics) return null;

  return {
    rate: analytics[period],
    category: analytics.category,
    benchmark: period === 'annual' ? 6.0 : period === 'quarterly' ? 1.5 : 0.5,
    performance: analytics[period] >= (period === 'annual' ? 6.0 : period === 'quarterly' ? 1.5 : 0.5) ? 'above' : 'below'
  };
};

const getInventoryAging = () => {
  const aging = inventoryAnalytics.performanceMetrics.agingAnalysis;
  const total = Object.values(aging).reduce((sum, bucket) => sum + bucket.value, 0);

  return Object.entries(aging).map(([period, data]) => ({
    period,
    items: data.items,
    value: data.value,
    percentage: data.percentage,
    risk: period.includes('180+') ? 'high' : period.includes('91-180') ? 'medium' : 'low'
  }));
};

const getPredictiveDemand = (itemId: string, days: 30 | 60 | 90) => {
  const forecast = inventoryAnalytics.predictiveAnalytics.demandForecasting[itemId];
  if (!forecast) return null;

  const period = days === 30 ? 'next30Days' : days === 60 ? 'next60Days' : 'next90Days';
  const prediction = forecast[period];

  return {
    itemId,
    days,
    predicted: prediction.predicted,
    confidence: prediction.confidence,
    trend: prediction.trend,
    seasonalFactors: forecast.seasonalFactors,
    recommendation: prediction.confidence > 85 ? 'reliable' : prediction.confidence > 70 ? 'moderate' : 'uncertain'
  };
};

const getReorderRecommendations = () => {
  const recommendations = inventoryAnalytics.predictiveAnalytics.reorderOptimization;

  return Object.entries(recommendations).map(([itemId, data]) => {
    const item = inventoryItems.find(inv => inv.id === itemId);
    const daysUntilReorder = Math.max(0, Math.ceil((data.currentStock - data.optimalReorderPoint) / (data.currentStock / 30))); // 30-day consumption

    return {
      itemId,
      itemName: item?.name || 'Unknown',
      currentStock: data.currentStock,
      reorderPoint: data.optimalReorderPoint,
      optimalQuantity: data.optimalOrderQuantity,
      daysUntilReorder,
      urgency: daysUntilReorder <= 7 ? 'urgent' : daysUntilReorder <= 14 ? 'medium' : 'low',
      savings: data.costOptimization.savings,
      leadTime: data.leadTimeDays,
      safetyStock: data.safetyStockDays
    };
  });
};

const getStockoutPredictions = () => {
  const predictions = inventoryAnalytics.predictiveAnalytics.stockoutPrediction;

  return {
    criticalItems: predictions.criticalItems.map(item => ({
      ...item,
      urgency: item.daysToStockout <= 7 ? 'critical' : item.daysToStockout <= 14 ? 'high' : 'medium',
      preventiveAction: predictions.preventiveActions.find(action => action.itemId === item.itemId)
    })),
    totalAtRisk: predictions.criticalItems.length,
    totalPreventiveCost: predictions.preventiveActions.reduce((sum, action) => sum + action.cost, 0)
  };
};

const getQualityAnalysis = () => {
  const quality = inventoryAnalytics.qualityMetrics;

  return {
    overallGrade: quality.batchQuality.averageGrade,
    gradeDistribution: quality.batchQuality.gradeDistribution,
    qualityTrend: quality.batchQuality.qualityTrends.last_30_days.trend,
    defectAnalysis: {
      totalDefectRate: Object.values(quality.batchQuality.defectRates).reduce((sum, rate) => sum + rate, 0),
      breakdown: quality.batchQuality.defectRates,
      primaryCause: Object.entries(quality.batchQuality.defectRates)
        .sort(([,a], [,b]) => b - a)[0][0]
    },
    compliance: {
      overall: quality.complianceMetrics.overallCompliance,
      certifications: quality.complianceMetrics.certificationStatus,
      locationCompliance: quality.complianceMetrics.complianceByLocation
    }
  };
};

const getLocationEfficiency = (locationId?: string) => {
  const metrics = inventoryAnalytics.operationalMetrics;

  if (locationId) {
    const locationPerf = metrics.locationPerformance[locationId];
    const locationStock = inventoryAnalytics.performanceMetrics.valueAnalysis.valueByLocation[locationId];

    if (!locationPerf || !locationStock) return null;

    return {
      locationId,
      utilization: locationPerf.utilization,
      throughput: locationPerf.throughput,
      efficiency: locationPerf.efficiency,
      costPerSqm: locationPerf.costPerSqm,
      stockValue: locationStock.value,
      valuePercentage: locationStock.percentage,
      costEfficiency: (locationStock.value / locationPerf.costPerSqm).toFixed(0) // Value per cost
    };
  }

  // Return all locations
  return Object.keys(metrics.locationPerformance).map(locId =>
    getLocationEfficiency(locId)
  ).filter(Boolean);
};

const getCostOptimizationOpportunities = () => {
  const costs = inventoryAnalytics.operationalMetrics.costsAnalysis;
  const recommendations = inventoryAnalytics.alertsAndRecommendations.recommendations;

  const opportunities = [
    {
      category: 'Carrying Costs',
      current: costs.carryingCosts.annual,
      potential: costs.carryingCosts.annual * 0.85, // 15% reduction potential
      savings: costs.carryingCosts.annual * 0.15,
      actions: ['Optimize safety stock levels', 'Improve demand forecasting', 'Reduce slow-moving inventory']
    },
    {
      category: 'Ordering Costs',
      current: costs.orderingCosts.averageOrderCost * 12, // Annual estimate
      potential: costs.orderingCosts.averageOrderCost * 12 - costs.orderingCosts.frequencyOptimization.potential_savings,
      savings: costs.orderingCosts.frequencyOptimization.potential_savings,
      actions: ['Optimize order frequency to ' + costs.orderingCosts.frequencyOptimization.optimized_frequency]
    },
    {
      category: 'Stockout Prevention',
      current: costs.stockoutCosts.lostSales + costs.stockoutCosts.expeditedOrders,
      potential: (costs.stockoutCosts.lostSales + costs.stockoutCosts.expeditedOrders) * 0.7, // 30% reduction
      savings: (costs.stockoutCosts.lostSales + costs.stockoutCosts.expeditedOrders) * 0.3,
      actions: ['Improve demand forecasting', 'Optimize reorder points', 'Enhance supplier relationships']
    }
  ];

  const totalCurrentCost = opportunities.reduce((sum, opp) => sum + opp.current, 0);
  const totalSavings = opportunities.reduce((sum, opp) => sum + opp.savings, 0);

  return {
    opportunities,
    summary: {
      totalCurrentCost,
      totalSavings,
      savingsPercentage: (totalSavings / totalCurrentCost * 100).toFixed(1)
    },
    actionableRecommendations: recommendations.filter(rec => rec.savings).length
  };
};

const getAlertsDashboard = () => {
  const alerts = inventoryAnalytics.alertsAndRecommendations;

  return {
    criticalAlerts: alerts.criticalAlerts,
    recommendations: alerts.recommendations,
    insights: alerts.insights,
    summary: {
      totalAlerts: alerts.criticalAlerts.length,
      highSeverity: alerts.criticalAlerts.filter(alert => alert.severity === 'high').length,
      totalRecommendations: alerts.recommendations.length,
      totalSavings: alerts.recommendations.reduce((sum, rec) => sum + (rec.savings || 0), 0)
    }
  };
};

const generateInventoryHealthScore = () => {
  const turnover = Object.values(inventoryAnalytics.performanceMetrics.turnoverRates);
  const quality = inventoryAnalytics.qualityMetrics.batchQuality.qualityTrends.last_30_days.average;
  const accuracy = inventoryAnalytics.performanceMetrics.stockAccuracy.overallAccuracy;
  const compliance = inventoryAnalytics.qualityMetrics.complianceMetrics.overallCompliance;

  const avgTurnover = turnover.reduce((sum, item) => sum + item.annual, 0) / turnover.length;

  // Weighted scoring (out of 100)
  const turnoverScore = Math.min(100, (avgTurnover / 6.0) * 100 * 0.3); // 30% weight
  const qualityScore = (quality / 5.0) * 100 * 0.25; // 25% weight
  const accuracyScore = accuracy * 0.25; // 25% weight
  const complianceScore = compliance * 0.2; // 20% weight

  const overallScore = turnoverScore + qualityScore + accuracyScore + complianceScore;

  return {
    overallScore: Math.round(overallScore),
    breakdown: {
      turnover: Math.round(turnoverScore / 0.3),
      quality: Math.round(qualityScore / 0.25),
      accuracy: Math.round(accuracyScore / 0.25),
      compliance: Math.round(complianceScore / 0.2)
    },
    grade: overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : 'D',
    recommendations: overallScore < 80 ? [
      'Focus on slow-moving inventory optimization',
      'Improve quality control processes',
      'Enhance inventory accuracy procedures'
    ] : ['Maintain current performance levels', 'Monitor seasonal variations']
  };
};

// Perfume & Oud Specific Utility Functions
const calculateAgingAppreciation = (agingItemId: string) => {
  const item = agingInventory.find(aging => aging.id === agingItemId);
  if (!item) return null;

  const profile = perfumeOudSystem.agingProfiles[item.agingProfile];
  const monthsRemaining = item.targetAge - item.currentAge;
  const currentMultiplier = profile.agingStages[item.currentStage].value_multiplier;

  return {
    itemId: agingItemId,
    itemName: item.name,
    currentAge: item.currentAge,
    currentValue: item.currentValue,
    originalValue: item.originalValue,
    appreciationRate: item.appreciationRate,
    currentStage: item.currentStage,
    monthsToOptimal: Math.max(0, monthsRemaining),
    projectedFinalValue: item.projectedFinalValue,
    qualityScore: item.qualityScore,
    grade: item.grade,
    recommendations: monthsRemaining > 0 ? ['Continue aging for optimal value'] : ['Ready for blending or sale']
  };
};

const getBlendingProjectStatus = (projectId: string) => {
  const project = activeBlendingProjects.find(p => p.id === projectId);
  if (!project) return null;

  const profile = perfumeOudSystem.blendingProfiles[project.blendProfile];
  const progressPercentage = (project.currentDay / project.totalRestingDays) * 100;
  const daysRemaining = project.totalRestingDays - project.currentDay;

  const nextQualityCheck = profile.qualityCheckPoints.find(day =>
    day > project.currentDay && project.qualityCheckPoints.find(qc => qc.day === day && !qc.completed)
  );

  return {
    projectId,
    projectName: project.projectName,
    status: project.status,
    progress: Math.round(progressPercentage),
    daysRemaining: Math.max(0, daysRemaining),
    currentDay: project.currentDay,
    totalDays: project.totalRestingDays,
    masterBlender: project.masterBlender,
    nextQualityCheck: nextQualityCheck ? project.qualityCheckPoints.find(qc => qc.day === nextQualityCheck) : null,
    totalCost: project.totalCost,
    projectedValue: project.targetSellingPrice,
    projectedMargin: project.projectedMargin,
    expectedCompletion: project.expectedCompletion,
    marketRelease: project.marketRelease
  };
};

const convertTolaUnits = (amount: number, fromUnit: string, toUnit: string) => {
  const conversions = perfumeOudSystem.tolaUnitsSystem.conversionTable;

  if (fromUnit === 'tola' && toUnit === 'grams') {
    return amount * conversions['1_tola_to_grams'];
  } else if (fromUnit === 'grams' && toUnit === 'tola') {
    return amount / conversions['1_tola_to_grams'];
  } else if (fromUnit === 'tola' && toUnit === 'ounces') {
    return amount * conversions['1_tola_to_ounces'];
  } else if (fromUnit === 'kg' && toUnit === 'tola') {
    return amount * conversions['1_kg_to_tola'];
  }

  return amount; // Return original if conversion not found
};

const calculateTolaPrice = (materialType: string, pricePerGram: number) => {
  const tolaWeight = perfumeOudSystem.tolaUnitsSystem.standardTola.weight;
  const pricePerTola = pricePerGram * tolaWeight;

  return {
    pricePerTola: Math.round(pricePerTola),
    pricePerGram: pricePerGram,
    tolaWeight: tolaWeight,
    currency: 'AED',
    materialType
  };
};

const getQualityGrading = (score: number) => {
  const grading = perfumeOudSystem.qualityGrading.gradingScale;

  for (const [grade, details] of Object.entries(grading)) {
    const [min, max] = details.score.split('-').map(Number);
    if (score >= min && score <= max) {
      return {
        grade,
        arabicName: details.arabicName,
        score,
        multiplier: details.multiplier,
        category: grade.replace('_', ' ').toUpperCase()
      };
    }
  }

  return null;
};

const calculateSeasonalDemand = (productType: string, currentMonth: string) => {
  const month = currentMonth.toLowerCase();
  const factors = perfumeOudSystem.seasonalFactors;

  let multiplier = 1.0;
  let seasonalEvent = null;

  // Check wedding season
  if (factors.wedding_season.months.includes(month)) {
    multiplier = factors.wedding_season.demand_multiplier;
    seasonalEvent = 'wedding_season';
  }

  // Check summer climate
  if (factors.summer_climate.months.includes(month)) {
    multiplier = factors.summer_climate.demand_multiplier;
    seasonalEvent = 'summer_climate';
  }

  // Note: Ramadan and Eid would need current date calculation for accurate timing

  return {
    currentMonth: month,
    demandMultiplier: multiplier,
    seasonalEvent,
    recommendations: seasonalEvent ? factors[seasonalEvent].popular_products : [],
    preparationNeeded: seasonalEvent === 'wedding_season' ? 'Increase inventory for bulk orders' : null
  };
};

const getAgingInventorySummary = () => {
  const totalItems = agingInventory.length;
  const totalOriginalValue = agingInventory.reduce((sum, item) => sum + item.originalValue, 0);
  const totalCurrentValue = agingInventory.reduce((sum, item) => sum + item.currentValue, 0);
  const totalAppreciation = totalCurrentValue - totalOriginalValue;
  const averageAppreciation = (totalAppreciation / totalOriginalValue) * 100;

  const readyItems = agingInventory.filter(item => item.currentAge >= item.targetAge);
  const agingItems = agingInventory.filter(item => item.currentAge < item.targetAge);

  return {
    totalItems,
    readyItems: readyItems.length,
    stillAging: agingItems.length,
    totalOriginalValue,
    totalCurrentValue,
    totalAppreciation,
    averageAppreciationRate: Math.round(averageAppreciation),
    highestGradeItem: agingInventory.find(item => item.qualityScore === Math.max(...agingInventory.map(i => i.qualityScore))),
    nextReadyItem: agingItems.sort((a, b) => (a.targetAge - a.currentAge) - (b.targetAge - b.currentAge))[0]
  };
};

const getBlendingProjectsSummary = () => {
  const totalProjects = activeBlendingProjects.length;
  const activeProjects = activeBlendingProjects.filter(p => p.status !== 'completed');
  const totalInvestment = activeBlendingProjects.reduce((sum, p) => sum + p.totalCost, 0);
  const projectedRevenue = activeBlendingProjects.reduce((sum, p) => sum + p.targetSellingPrice, 0);
  const projectedProfit = projectedRevenue - totalInvestment;

  const nearCompletion = activeBlendingProjects.filter(p => {
    const daysRemaining = p.totalRestingDays - p.currentDay;
    return daysRemaining <= 7 && p.status !== 'completed';
  });

  return {
    totalProjects,
    activeProjects: activeProjects.length,
    completedProjects: totalProjects - activeProjects.length,
    totalInvestment,
    projectedRevenue,
    projectedProfit,
    projectedMargin: ((projectedProfit / totalInvestment) * 100).toFixed(1),
    nearCompletion: nearCompletion.length,
    nextCompletions: activeBlendingProjects
      .filter(p => p.status !== 'completed')
      .sort((a, b) => new Date(a.expectedCompletion).getTime() - new Date(b.expectedCompletion).getTime())
      .slice(0, 3)
  };
};

const evaluateBlendFormula = (formula: any, targetProfile: string) => {
  const profile = perfumeOudSystem.blendingProfiles[targetProfile];
  if (!profile) return null;

  const totalPercentage = Object.values(formula).reduce((sum: number, ingredient: any) => sum + ingredient.percentage, 0);
  const criticalIngredients = Object.entries(formula).filter(([key, ingredient]: [string, any]) =>
    profile.baseFormula[key]?.critical
  );

  const formulaValid = totalPercentage === 100 && criticalIngredients.length >= 2;

  return {
    targetProfile,
    formulaValid,
    totalPercentage,
    criticalIngredients: criticalIngredients.length,
    expectedYield: profile.expectedYield,
    restingPeriod: profile.restingPeriod,
    shelfLife: profile.shelfLife,
    priceCategory: profile.priceCategory,
    recommendations: formulaValid ?
      ['Formula is valid for production'] :
      ['Adjust percentages to total 100%', 'Ensure all critical ingredients are included']
  };
};

// Current production orders with material consumption tracking
const currentProductionOrders = [
  {
    id: 'PROD-2024-001',
    orderNumber: 'PROD-UAE-2024-001',
    productName: 'Royal Oud Premium - 12ml',
    targetQuantity: 100,
    targetUnit: 'pieces',
    status: 'in_progress',
    priority: 'high',
    startDate: '2024-09-28',
    expectedCompletion: '2024-10-15',
    currentStage: 'distillation',
    masterCraftsman: 'Ustaz Abdullah Al-Oudhi',
    location: 'LOC003', // Production Lab

    // Material consumption tracking
    materialRequirements: [
      {
        materialId: 'RAW001',
        materialName: 'Cambodian Oud Wood - Raw',
        plannedQuantity: 2.5,
        plannedUnit: 'kilogram',
        actualConsumed: 2.3,
        actualUnit: 'kilogram',
        wastage: 0.2,
        wastageReason: 'Normal processing loss',
        costPerUnit: 2500,
        totalCost: 5750,
        stage: 'preparation',
        consumptionDate: '2024-09-28',
        batchUsed: 'CAM-2024-001',
        qualityGrade: 'Super',
        inventoryImpact: {
          deductedFromLocation: 'LOC003',
          deductedFromBatch: 'CAM-2024-001',
          newStockLevel: 2.7, // Remaining after consumption
          automaticDeduction: true
        }
      },
      {
        materialId: 'UTIL001',
        materialName: 'Distillation Water - Purified',
        plannedQuantity: 50,
        plannedUnit: 'liter',
        actualConsumed: 48,
        actualUnit: 'liter',
        wastage: 2,
        wastageReason: 'Evaporation during process',
        costPerUnit: 2,
        totalCost: 100,
        stage: 'distillation',
        consumptionDate: '2024-09-29',
        batchUsed: 'WATER-2024-015'
      }
    ],

    // Production yield tracking
    yieldTracking: {
      expectedYield: 125, // ml of oil from 2.5kg wood
      currentYield: 0, // Still in process
      yieldRate: 0, // Will be calculated
      qualityGrade: 'pending',
      stage: 'distillation'
    },

    // Cost analysis
    costAnalysis: {
      materialCosts: 5850,
      laborCosts: 2400,
      overheadCosts: 800,
      totalCosts: 9050,
      costPerUnit: 90.50
    }
  },
  {
    id: 'PROD-2024-002',
    orderNumber: 'PROD-UAE-2024-002',
    productName: 'Rose Saffron Attar - 6ml',
    targetQuantity: 200,
    targetUnit: 'pieces',
    status: 'completed',
    priority: 'medium',
    startDate: '2024-09-15',
    expectedCompletion: '2024-09-25',
    actualCompletion: '2024-09-24',
    currentStage: 'completed',
    masterCraftsman: 'Ustaz Ahmad Al-Attari',
    location: 'LOC003',

    materialRequirements: [
      {
        materialId: 'ESS001',
        materialName: 'Bulgarian Rose Otto',
        plannedQuantity: 0.6,
        plannedUnit: 'liter',
        actualConsumed: 0.58,
        actualUnit: 'liter',
        wastage: 0.02,
        wastageReason: 'Transfer loss',
        costPerUnit: 4500,
        totalCost: 2610,
        stage: 'blending',
        consumptionDate: '2024-09-20',
        batchUsed: 'ROSE-2024-002',
        inventoryImpact: {
          deductedFromLocation: 'LOC003',
          deductedFromBatch: 'ROSE-2024-002',
          newStockLevel: 1.42, // Remaining after consumption
          automaticDeduction: true
        }
      }
    ],

    yieldTracking: {
      expectedYield: 1200, // ml total
      currentYield: 1180, // ml actual
      yieldRate: 98.3, // %
      qualityGrade: 'Premium',
      stage: 'completed'
    },

    costAnalysis: {
      materialCosts: 2610,
      laborCosts: 1600,
      overheadCosts: 400,
      totalCosts: 4610,
      costPerUnit: 23.05
    }
  }
];

// Sales and POS Integration System
const salesIntegration = {
  posTerminals: {
    'POS001': {
      name: 'Dubai Mall Store - Terminal 1',
      location: 'LOC002', // Dubai Mall Store
      type: 'retail',
      status: 'active',
      capabilities: ['payment', 'loyalty', 'returns', 'discounts'],
      realTimeSync: true,
      lastSync: '2024-09-30T14:30:00Z'
    },
    'POS002': {
      name: 'Abu Dhabi Store - Main Terminal',
      location: 'LOC005', // Abu Dhabi Branch
      type: 'retail',
      status: 'active',
      capabilities: ['payment', 'loyalty', 'returns', 'discounts', 'gift_cards'],
      realTimeSync: true,
      lastSync: '2024-09-30T14:28:00Z'
    },
    'POS003': {
      name: 'Warehouse A - Wholesale Terminal',
      location: 'LOC001', // Warehouse A
      type: 'wholesale',
      status: 'active',
      capabilities: ['payment', 'bulk_orders', 'credit_terms'],
      realTimeSync: true,
      lastSync: '2024-09-30T14:25:00Z'
    }
  },
  salesChannels: {
    retail: {
      name: 'Retail Stores',
      priceType: 'retail',
      allowDiscounts: true,
      maxDiscountPercent: 15,
      loyaltyIntegration: true,
      stockReservation: false, // Immediate stock deduction
      paymentMethods: ['cash', 'card', 'digital_wallet', 'gift_card']
    },
    wholesale: {
      name: 'Wholesale Sales',
      priceType: 'wholesale',
      allowDiscounts: true,
      maxDiscountPercent: 25,
      loyaltyIntegration: false,
      stockReservation: true, // Reserve for credit terms
      paymentMethods: ['bank_transfer', 'cheque', 'credit_terms']
    },
    online: {
      name: 'E-commerce',
      priceType: 'retail',
      allowDiscounts: true,
      maxDiscountPercent: 10,
      loyaltyIntegration: true,
      stockReservation: true, // Reserve until payment
      paymentMethods: ['card', 'digital_wallet', 'cod']
    },
    vip: {
      name: 'VIP & Corporate Sales',
      priceType: 'vip',
      allowDiscounts: true,
      maxDiscountPercent: 30,
      loyaltyIntegration: true,
      stockReservation: true,
      paymentMethods: ['bank_transfer', 'credit_terms', 'installments']
    }
  },
  inventoryIntegration: {
    stockUpdateMethods: {
      immediate: { name: 'Immediate Deduction', description: 'Stock reduced on sale completion', triggers: ['payment_confirmed'] },
      onShipment: { name: 'On Shipment', description: 'Stock reduced when shipped', triggers: ['shipment_created'] },
      onDelivery: { name: 'On Delivery', description: 'Stock reduced on delivery confirmation', triggers: ['delivery_confirmed'] }
    },
    reservationRules: {
      retail: { duration: '0 minutes', autoRelease: true },
      wholesale: { duration: '48 hours', autoRelease: true },
      online: { duration: '30 minutes', autoRelease: true },
      vip: { duration: '72 hours', autoRelease: false }
    },
    lowStockThresholds: {
      critical: 5, // Stop sales when stock ≤ 5
      warning: 15, // Show warning when stock ≤ 15
      normal: 50 // Normal operation when stock > 50
    },
    automationRules: {
      autoReorder: true,
      blockSalesOnZeroStock: true,
      allowBackorders: false,
      crossLocationFulfillment: true
    }
  }
};

// Current sales orders with real-time inventory impact
const currentSalesOrders = [
  {
    id: 'SO-2024-001',
    orderNumber: 'SO-UAE-2024-001',
    salesChannel: 'retail',
    posTerminal: 'POS001',
    customerInfo: {
      id: 'CUST-001',
      name: 'Ahmed Al Rashid',
      type: 'retail',
      loyaltyPoints: 2450,
      membershipLevel: 'gold',
      preferredLocation: 'LOC002'
    },
    orderDate: '2024-09-30',
    status: 'completed',
    items: [
      {
        itemId: 'FIN001',
        itemName: 'Royal Oud Premium - 12ml',
        quantity: 2,
        unit: 'piece',
        locationId: 'LOC002',
        priceType: 'retail',
        unitPrice: 450, // AED
        totalPrice: 900,
        discountPercent: 10,
        discountAmount: 90,
        netPrice: 810,
        stockImpact: {
          reservedStock: 0, // Already deducted
          deductedStock: 2,
          remainingStock: 48, // Updated stock after sale
          stockStatus: 'normal'
        },
        batchInfo: {
          batchNumber: 'ROY-2024-010',
          expiryDate: '2026-03-01',
          traceabilityCode: 'TC-ROY-2024-010-FIN'
        }
      }
    ],
    totals: {
      subtotal: 900,
      discounts: 90,
      vat: 40.5, // 5% VAT on net amount
      totalAmount: 850.5,
      paidAmount: 850.5,
      loyaltyPointsEarned: 43 // 5% of net amount
    },
    payment: {
      method: 'card',
      transactionId: 'TXN-20240930-001',
      timestamp: '2024-09-30T10:15:30Z',
      status: 'completed'
    },
    fulfillment: {
      type: 'immediate',
      status: 'completed',
      handedBy: 'Fatima Al-Zahra',
      completedAt: '2024-09-30T10:16:00Z'
    }
  },
  {
    id: 'SO-2024-002',
    orderNumber: 'SO-UAE-2024-002',
    salesChannel: 'wholesale',
    posTerminal: 'POS003',
    customerInfo: {
      id: 'CUST-W001',
      name: 'Emirates Perfume Trading LLC',
      type: 'wholesale',
      creditLimit: 50000,
      creditUsed: 15000,
      paymentTerms: '30 days',
      preferredLocation: 'LOC001'
    },
    orderDate: '2024-09-30',
    status: 'confirmed',
    items: [
      {
        itemId: 'SEM001',
        itemName: 'Oud Oil Distilled - Premium Grade',
        quantity: 500,
        unit: 'milliliter',
        locationId: 'LOC001',
        priceType: 'wholesale',
        unitPrice: 12, // AED per ml
        totalPrice: 6000,
        discountPercent: 15, // Volume discount
        discountAmount: 900,
        netPrice: 5100,
        stockImpact: {
          reservedStock: 500, // Reserved for wholesale order
          deductedStock: 0, // Will deduct on shipment
          remainingStock: 150, // Available after reservation
          stockStatus: 'warning' // Getting low
        },
        batchInfo: {
          batchNumber: 'DIST-2024-005',
          expiryDate: '2025-09-15',
          traceabilityCode: 'TC-DIST-2024-005-SEM'
        }
      }
    ],
    totals: {
      subtotal: 6000,
      discounts: 900,
      vat: 255, // 5% VAT
      totalAmount: 5355,
      paidAmount: 0, // Credit terms
      loyaltyPointsEarned: 0
    },
    payment: {
      method: 'credit_terms',
      creditTerms: '30 days',
      dueDate: '2024-10-30',
      status: 'pending'
    },
    fulfillment: {
      type: 'scheduled',
      status: 'preparing',
      scheduledDate: '2024-10-02',
      assignedTo: 'warehouse.team@oudpms.ae'
    }
  },
  {
    id: 'SO-2024-003',
    orderNumber: 'SO-UAE-2024-003',
    salesChannel: 'online',
    posTerminal: null, // Online order
    customerInfo: {
      id: 'CUST-ON001',
      name: 'Sarah Mohammed',
      type: 'retail',
      loyaltyPoints: 850,
      membershipLevel: 'silver',
      shippingAddress: 'Dubai Marina, Building 12, Apt 405',
      preferredLocation: null
    },
    orderDate: '2024-09-30',
    status: 'processing',
    items: [
      {
        itemId: 'FIN001',
        itemName: 'Royal Oud Premium - 12ml',
        quantity: 1,
        unit: 'piece',
        locationId: 'LOC002', // Fulfillment from Dubai Mall Store
        priceType: 'retail',
        unitPrice: 450,
        totalPrice: 450,
        discountPercent: 5, // Online discount
        discountAmount: 22.5,
        netPrice: 427.5,
        stockImpact: {
          reservedStock: 1, // Reserved for 30 minutes
          deductedStock: 0, // Will deduct on shipment
          remainingStock: 47, // Available after current reservation
          stockStatus: 'normal'
        },
        batchInfo: {
          batchNumber: 'ROY-2024-010',
          expiryDate: '2026-03-01',
          traceabilityCode: 'TC-ROY-2024-010-FIN'
        }
      }
    ],
    totals: {
      subtotal: 450,
      discounts: 22.5,
      shippingCost: 25,
      vat: 23.625, // 5% VAT on net + shipping
      totalAmount: 476.125,
      paidAmount: 476.125,
      loyaltyPointsEarned: 21
    },
    payment: {
      method: 'digital_wallet',
      transactionId: 'TXN-ONLINE-20240930-003',
      timestamp: '2024-09-30T14:22:15Z',
      status: 'completed'
    },
    fulfillment: {
      type: 'delivery',
      status: 'processing',
      estimatedDelivery: '2024-10-02',
      shippingMethod: 'express',
      trackingNumber: 'TRK-20240930-003'
    }
  }
];

// Sales analytics and performance tracking
const salesAnalytics = {
  dailyMetrics: {
    '2024-09-30': {
      totalSales: 7326.625, // AED
      totalOrders: 3,
      averageOrderValue: 2442.21,
      itemsSold: 503,
      topSellingItems: [
        { itemId: 'SEM001', quantity: 500, revenue: 5100 },
        { itemId: 'FIN001', quantity: 3, revenue: 1237.5 }
      ],
      salesByChannel: {
        retail: { orders: 1, revenue: 850.5 },
        wholesale: { orders: 1, revenue: 5355 },
        online: { orders: 1, revenue: 476.125 }
      },
      salesByLocation: {
        'LOC001': { orders: 1, revenue: 5355 },
        'LOC002': { orders: 2, revenue: 1326.625 }
      }
    }
  },
  inventoryImpact: {
    totalItemsReserved: 501,
    totalItemsDeducted: 2,
    stockWarnings: [
      { itemId: 'SEM001', currentStock: 150, reservedStock: 500, status: 'warning' }
    ],
    stockCritical: [],
    crossLocationFulfillments: 0
  },
  customerMetrics: {
    newCustomers: 1,
    returningCustomers: 2,
    loyaltyPointsAwarded: 64,
    membershipUpgrades: 0
  }
};

// Advanced Inventory Analytics and Reporting System
const inventoryAnalytics = {
  performanceMetrics: {
    turnoverRates: {
      'RAW001': { annual: 4.2, quarterly: 1.05, monthly: 0.35, category: 'Good' },
      'SEM001': { annual: 6.8, quarterly: 1.7, monthly: 0.57, category: 'Excellent' },
      'FIN001': { annual: 12.4, quarterly: 3.1, monthly: 1.03, category: 'Excellent' },
      'RAW002': { annual: 2.1, quarterly: 0.53, monthly: 0.18, category: 'Slow' }
    },
    agingAnalysis: {
      '0-30_days': { items: 45, value: 285000, percentage: 42 },
      '31-60_days': { items: 23, value: 145000, percentage: 24 },
      '61-90_days': { items: 18, value: 98000, percentage: 19 },
      '91-180_days': { items: 12, value: 67000, percentage: 12 },
      '180+_days': { items: 8, value: 23000, percentage: 3 }
    },
    stockAccuracy: {
      overallAccuracy: 96.8, // Percentage
      locationAccuracy: {
        'LOC001': 98.2,
        'LOC002': 96.5,
        'LOC003': 94.1,
        'LOC004': 97.8,
        'LOC005': 95.9
      },
      discrepancies: [
        { itemId: 'RAW001', locationId: 'LOC003', expected: 1500, actual: 1485, variance: -15, reason: 'production_consumption' },
        { itemId: 'SEM001', locationId: 'LOC001', expected: 650, actual: 655, variance: 5, reason: 'receiving_variance' }
      ]
    },
    valueAnalysis: {
      totalPortfolioValue: 2450000, // AED
      valueByCategory: {
        'Raw Material': { value: 985000, percentage: 40.2, items: 25 },
        'Semi-Finished': { value: 735000, percentage: 30.0, items: 18 },
        'Finished Goods': { value: 730000, percentage: 29.8, items: 32 }
      },
      valueByLocation: {
        'LOC001': { value: 1225000, percentage: 50.0 }, // Warehouse A
        'LOC002': { value: 490000, percentage: 20.0 },  // Dubai Mall Store
        'LOC003': { value: 367500, percentage: 15.0 },  // Production Lab
        'LOC004': { value: 245000, percentage: 10.0 },  // Quality Control
        'LOC005': { value: 122500, percentage: 5.0 }    // Abu Dhabi Branch
      },
      topValueItems: [
        { itemId: 'FIN001', name: 'Royal Oud Premium - 12ml', value: 187500, percentage: 7.7 },
        { itemId: 'RAW001', name: 'Cambodian Oud Wood - Raw', value: 165000, percentage: 6.7 },
        { itemId: 'SEM001', name: 'Oud Oil Distilled - Premium Grade', value: 156000, percentage: 6.4 }
      ]
    }
  },
  predictiveAnalytics: {
    demandForecasting: {
      'FIN001': {
        next30Days: { predicted: 85, confidence: 92, trend: 'increasing' },
        next60Days: { predicted: 165, confidence: 87, trend: 'stable' },
        next90Days: { predicted: 240, confidence: 82, trend: 'seasonal_peak' },
        seasonalFactors: { ramadan: 1.8, eid: 2.2, wedding_season: 1.4, winter: 0.9 }
      },
      'SEM001': {
        next30Days: { predicted: 320, confidence: 89, trend: 'stable' },
        next60Days: { predicted: 640, confidence: 84, trend: 'increasing' },
        next90Days: { predicted: 980, confidence: 79, trend: 'strong_growth' },
        seasonalFactors: { ramadan: 1.6, eid: 1.9, wedding_season: 1.7, winter: 1.1 }
      }
    },
    reorderOptimization: {
      'RAW001': {
        currentStock: 1500,
        optimalReorderPoint: 800,
        optimalOrderQuantity: 2000,
        leadTimeDays: 45,
        safetyStockDays: 14,
        costOptimization: { savings: 12500, reason: 'bulk_discount_tier_3' }
      },
      'SEM001': {
        currentStock: 650,
        optimalReorderPoint: 400,
        optimalOrderQuantity: 1000,
        leadTimeDays: 21,
        safetyStockDays: 7,
        costOptimization: { savings: 8500, reason: 'volume_consolidation' }
      }
    },
    stockoutPrediction: {
      criticalItems: [
        { itemId: 'RAW002', name: 'Rose Oil - Bulgarian', daysToStockout: 12, probability: 85, impact: 'high' },
        { itemId: 'SEM001', name: 'Oud Oil Distilled', daysToStockout: 18, probability: 72, impact: 'medium' }
      ],
      preventiveActions: [
        { itemId: 'RAW002', action: 'emergency_order', cost: 25000, timeframe: '5 days' },
        { itemId: 'SEM001', action: 'production_acceleration', cost: 15000, timeframe: '10 days' }
      ]
    }
  },
  qualityMetrics: {
    batchQuality: {
      averageGrade: 'A',
      gradeDistribution: {
        'Super': { batches: 15, percentage: 25 },
        'Premium': { batches: 28, percentage: 47 },
        'Commercial': { batches: 17, percentage: 28 }
      },
      qualityTrends: {
        'last_30_days': { average: 4.6, trend: 'improving' },
        'last_60_days': { average: 4.4, trend: 'stable' },
        'last_90_days': { average: 4.3, trend: 'stable' }
      },
      defectRates: {
        'production_defects': 2.1, // Percentage
        'supplier_defects': 1.8,
        'handling_damage': 0.5,
        'aging_issues': 0.3
      }
    },
    complianceMetrics: {
      overallCompliance: 94.2,
      certificationStatus: {
        'halal_certified': 89,
        'esma_approved': 91,
        'origin_verified': 97,
        'customs_cleared': 88
      },
      complianceByLocation: {
        'LOC001': 96.5, // Warehouse - highest standards
        'LOC002': 92.8, // Dubai Mall Store
        'LOC003': 98.1, // Production Lab - controlled environment
        'LOC004': 95.2, // Quality Control
        'LOC005': 90.4  // Abu Dhabi Branch
      }
    }
  },
  operationalMetrics: {
    efficiency: {
      receiptAccuracy: 98.5,
      putawayTime: { average: 24, target: 30, performance: 'excellent' }, // minutes
      pickingAccuracy: 99.2,
      cycleCountAccuracy: 96.8,
      orderFulfillmentTime: { average: 18, target: 24, performance: 'excellent' } // hours
    },
    costsAnalysis: {
      carryingCosts: {
        annual: 147000, // AED
        percentage: 6.0, // of inventory value
        breakdown: {
          storage: 45000,
          insurance: 24500,
          obsolescence: 36750,
          opportunity_cost: 40750
        }
      },
      orderingCosts: {
        averageOrderCost: 2500,
        frequencyOptimization: { potential_savings: 18000, optimized_frequency: 'bi-monthly' }
      },
      stockoutCosts: {
        lostSales: 34000,
        customerGoodwill: 12000,
        expeditedOrders: 8500
      }
    },
    locationPerformance: {
      'LOC001': { // Warehouse A
        utilization: 78,
        throughput: 'high',
        costPerSqm: 45,
        efficiency: 92
      },
      'LOC002': { // Dubai Mall Store
        utilization: 85,
        throughput: 'medium',
        costPerSqm: 150,
        efficiency: 88
      },
      'LOC003': { // Production Lab
        utilization: 72,
        throughput: 'specialized',
        costPerSqm: 95,
        efficiency: 95
      }
    }
  },
  alertsAndRecommendations: {
    criticalAlerts: [
      { type: 'stockout_risk', item: 'RAW002', severity: 'high', days: 12 },
      { type: 'overstock', item: 'RAW003', severity: 'medium', excess: 45 },
      { type: 'quality_decline', item: 'SEM002', severity: 'medium', trend: 'declining' }
    ],
    recommendations: [
      { type: 'reorder', item: 'RAW001', action: 'place_order', savings: 12500, urgency: 'medium' },
      { type: 'transfer', fromLocation: 'LOC001', toLocation: 'LOC002', item: 'FIN001', quantity: 20, reason: 'demand_balancing' },
      { type: 'promotion', item: 'RAW003', reason: 'slow_moving', discount: 15, expectedMovement: 35 }
    ],
    insights: [
      { category: 'efficiency', insight: 'Production Lab showing 15% improvement in batch quality', impact: 'positive' },
      { category: 'cost', insight: 'Bulk ordering can reduce costs by 8.5%', impact: 'savings' },
      { category: 'demand', insight: 'Seasonal demand pattern detected for premium items', impact: 'planning' }
    ]
  }
};

// Perfume & Oud Specific Features System
const perfumeOudSystem = {
  agingProfiles: {
    'cambodian_royal': {
      name: 'Cambodian Royal Oud',
      nameArabic: 'العود الكمبودي الملكي',
      optimalAgingPeriod: 36, // months
      agingStages: {
        young: { months: '0-6', characteristics: 'Sharp, medicinal notes', value_multiplier: 1.0 },
        developing: { months: '6-18', characteristics: 'Developing complexity', value_multiplier: 1.3 },
        mature: { months: '18-36', characteristics: 'Balanced, rich aroma', value_multiplier: 1.8 },
        vintage: { months: '36+', characteristics: 'Deep, complex, smooth', value_multiplier: 2.5 }
      },
      storageRequirements: {
        temperature: '18-22°C',
        humidity: '45-55%',
        airflow: 'minimal',
        container: 'sealed_glass',
        position: 'horizontal'
      },
      qualityFactors: {
        origin_purity: 0.25,
        aging_duration: 0.30,
        storage_conditions: 0.20,
        handling_care: 0.15,
        natural_oils: 0.10
      }
    },
    'rose_bulgarian': {
      name: 'Bulgarian Rose Oil',
      nameArabic: 'زيت الورد البلغاري',
      optimalAgingPeriod: 24,
      agingStages: {
        fresh: { months: '0-3', characteristics: 'Bright, floral burst', value_multiplier: 1.0 },
        settling: { months: '3-12', characteristics: 'Harmonizing notes', value_multiplier: 1.2 },
        matured: { months: '12-24', characteristics: 'Rich, full bouquet', value_multiplier: 1.6 },
        vintage: { months: '24+', characteristics: 'Luxurious, deep rose', value_multiplier: 2.0 }
      },
      storageRequirements: {
        temperature: '15-20°C',
        humidity: '40-50%',
        lightExposure: 'none',
        container: 'amber_glass',
        position: 'upright'
      }
    }
  },
  blendingProfiles: {
    'royal_signature': {
      name: 'Royal Signature Blend',
      nameArabic: 'خلطة الملكي المميزة',
      baseFormula: {
        'cambodian_oud': { percentage: 45, role: 'base_note', critical: true },
        'rose_bulgarian': { percentage: 25, role: 'heart_note', critical: true },
        'sandalwood_mysore': { percentage: 15, role: 'base_note', critical: false },
        'amber_white': { percentage: 10, role: 'base_note', critical: false },
        'carrier_oils': { percentage: 5, role: 'carrier', critical: true }
      },
      blendingMethod: 'cold_fusion',
      mixingSequence: ['carrier_oils', 'cambodian_oud', 'sandalwood_mysore', 'amber_white', 'rose_bulgarian'],
      restingPeriod: 21, // days
      qualityCheckPoints: [1, 7, 14, 21], // days after blending
      expectedYield: 95, // percentage
      shelfLife: 60, // months
      targetMarket: 'premium',
      priceCategory: 'luxury'
    },
    'oud_classic': {
      name: 'Classic Oud Pure',
      nameArabic: 'العود الكلاسيكي الخالص',
      baseFormula: {
        'cambodian_oud': { percentage: 70, role: 'primary', critical: true },
        'indian_oud': { percentage: 20, role: 'secondary', critical: true },
        'carrier_oils': { percentage: 10, role: 'carrier', critical: true }
      },
      blendingMethod: 'traditional_aging',
      mixingSequence: ['carrier_oils', 'indian_oud', 'cambodian_oud'],
      restingPeriod: 45,
      expectedYield: 98,
      shelfLife: 120,
      targetMarket: 'traditional',
      priceCategory: 'premium'
    }
  },
  tolaUnitsSystem: {
    standardTola: {
      weight: 11.664, // grams - traditional UAE/Indian tola
      type: 'weight',
      commonUse: 'precious_materials',
      arabicName: 'تولة'
    },
    volumeTola: {
      volume: 11.66, // ml - traditional volume equivalent
      type: 'volume',
      commonUse: 'liquid_perfumes',
      arabicName: 'تولة حجم'
    },
    conversionTable: {
      '1_tola_to_grams': 11.664,
      '1_tola_to_ounces': 0.4114,
      '1_tola_to_pounds': 0.0257,
      '10_tola_to_grams': 116.64,
      '1_kg_to_tola': 85.74,
      '1_pound_to_tola': 38.88
    },
    pricingInTola: {
      'premium_oud': { price_per_tola: 2500, currency: 'AED' },
      'royal_oud': { price_per_tola: 4200, currency: 'AED' },
      'vintage_oud': { price_per_tola: 8500, currency: 'AED' },
      'rose_oil': { price_per_tola: 1800, currency: 'AED' }
    }
  },
  qualityGrading: {
    gradingScale: {
      'super_plus': { score: '95-100', arabicName: 'ممتاز مضاعف', multiplier: 3.0 },
      'super': { score: '90-94', arabicName: 'ممتاز', multiplier: 2.5 },
      'premium': { score: '85-89', arabicName: 'فاخر', multiplier: 2.0 },
      'commercial': { score: '70-84', arabicName: 'تجاري', multiplier: 1.0 },
      'industrial': { score: '50-69', arabicName: 'صناعي', multiplier: 0.6 }
    },
    evaluationCriteria: {
      aroma_intensity: { weight: 0.25, max_score: 25 },
      aroma_complexity: { weight: 0.20, max_score: 20 },
      longevity: { weight: 0.20, max_score: 20 },
      sillage: { weight: 0.15, max_score: 15 },
      purity: { weight: 0.10, max_score: 10 },
      visual_clarity: { weight: 0.10, max_score: 10 }
    },
    gradingExperts: [
      { name: 'Ustaz Abdullah Al-Oudhi', expertise: 'traditional_oud', certifications: ['UAE_Master', 'International_Fragrance'] },
      { name: 'Perfumer Sarah Al-Zahra', expertise: 'modern_blends', certifications: ['IFRA_Certified', 'European_Perfumery'] }
    ]
  },
  productionTracking: {
    distillationProcess: {
      cambodian_oud: {
        process_type: 'steam_distillation',
        duration: '72-96 hours',
        temperature_range: '95-105°C',
        yield_expectation: '3-7ml per kg',
        quality_factors: ['wood_moisture', 'distillation_time', 'temperature_control'],
        stages: {
          preparation: { duration: '4 hours', description: 'Wood grinding and soaking' },
          heating: { duration: '12 hours', description: 'Gradual temperature increase' },
          distillation: { duration: '60-80 hours', description: 'Steam distillation process' },
          separation: { duration: '4 hours', description: 'Oil-water separation' },
          filtering: { duration: '2 hours', description: 'Fine filtration and purification' }
        }
      }
    },
    blendingProcess: {
      environment_requirements: {
        temperature: '20-22°C',
        humidity: '45-50%',
        cleanliness: 'pharmaceutical_grade',
        equipment: 'stainless_steel_only'
      },
      documentation: {
        batch_record: true,
        formula_security: 'encrypted',
        quality_approval: 'required',
        traceability: 'full_chain'
      }
    }
  },
  seasonalFactors: {
    ramadan: {
      demand_multiplier: 2.2,
      popular_products: ['oud_classic', 'rose_blends', 'musky_oriental'],
      preparation_period: '45 days before',
      peak_selling_days: 'last_10_days'
    },
    eid_celebrations: {
      demand_multiplier: 2.8,
      popular_products: ['royal_signature', 'premium_oud', 'gift_sets'],
      preparation_period: '60 days before',
      peak_selling_days: 'week_before_eid'
    },
    wedding_season: {
      months: ['october', 'november', 'december', 'february', 'march', 'april'],
      demand_multiplier: 1.6,
      popular_products: ['bridal_collection', 'couple_sets', 'luxury_blends'],
      bulk_orders: true
    },
    summer_climate: {
      months: ['june', 'july', 'august', 'september'],
      demand_multiplier: 0.7,
      popular_products: ['light_florals', 'citrus_blends', 'fresh_orientals'],
      storage_challenges: 'high_temperature'
    }
  }
};

// Current aging inventory with time-based appreciation
const agingInventory = [
  {
    id: 'AGING-001',
    baseItemId: 'RAW001', // Cambodian Oud Wood
    name: 'Cambodian Royal Oud - Aging Batch A1',
    nameArabic: 'العود الكمبودي الملكي - دفعة النضج أ١',
    agingProfile: 'cambodian_royal',
    startDate: '2022-01-15',
    currentAge: 33, // months
    targetAge: 36,
    currentStage: 'mature',
    originalWeight: 500, // grams
    currentWeight: 485, // natural evaporation
    weightLoss: 3.0, // percentage
    originalValue: 25000, // AED
    currentValue: 45000, // AED (appreciated due to aging)
    appreciationRate: 80, // percentage increase
    qualityScore: 92,
    grade: 'super',
    storageLocation: 'LOC004', // Quality Control - Climate Controlled
    storageConditions: {
      temperature: 20.5, // °C - current
      humidity: 48.0, // % - current
      lastInspection: '2024-09-28',
      nextInspection: '2024-10-28',
      conditionsCompliant: true
    },
    qualityHistory: [
      { date: '2022-01-15', score: 75, stage: 'young', notes: 'Sharp medicinal notes, raw character' },
      { date: '2022-07-15', score: 82, stage: 'developing', notes: 'Beginning complexity, mellowing harshness' },
      { date: '2023-07-15', score: 88, stage: 'mature', notes: 'Rich aroma developing, balanced character' },
      { date: '2024-09-15', score: 92, stage: 'mature', notes: 'Excellent complexity, smooth and rich' }
    ],
    marketDemand: 'high',
    reservedForBlending: false,
    estimatedCompletionDate: '2025-01-15',
    projectedFinalValue: 62500 // AED
  },
  {
    id: 'AGING-002',
    baseItemId: 'RAW002', // Rose Oil - Bulgarian
    name: 'Bulgarian Rose Oil - Vintage Batch R5',
    nameArabic: 'زيت الورد البلغاري - دفعة قديمة ر٥',
    agingProfile: 'rose_bulgarian',
    startDate: '2022-06-01',
    currentAge: 28, // months
    targetAge: 24, // already past optimal
    currentStage: 'vintage',
    originalWeight: 100, // ml
    currentWeight: 98, // minimal evaporation
    weightLoss: 2.0,
    originalValue: 8000, // AED
    currentValue: 16000, // AED
    appreciationRate: 100,
    qualityScore: 95,
    grade: 'super_plus',
    storageLocation: 'LOC004',
    storageConditions: {
      temperature: 18.0,
      humidity: 45.0,
      lastInspection: '2024-09-25',
      nextInspection: '2024-10-25',
      conditionsCompliant: true
    },
    qualityHistory: [
      { date: '2022-06-01', score: 78, stage: 'fresh', notes: 'Bright floral burst, very fresh' },
      { date: '2022-12-01', score: 85, stage: 'settling', notes: 'Notes harmonizing beautifully' },
      { date: '2023-06-01', score: 90, stage: 'matured', notes: 'Rich full bouquet achieved' },
      { date: '2024-06-01', score: 95, stage: 'vintage', notes: 'Luxurious deep rose, incredible depth' }
    ],
    marketDemand: 'extremely_high',
    reservedForBlending: true,
    reservedFor: 'royal_signature',
    estimatedCompletionDate: 'ready', // already past optimal aging
    projectedFinalValue: 16000 // already at peak
  }
];

// Active blending projects with formula tracking
const activeBlendingProjects = [
  {
    id: 'BLEND-2024-001',
    projectName: 'Royal Signature Blend - Batch RS24',
    projectNameArabic: 'خلطة الملكي المميزة - دفعة ر س٢٤',
    blendProfile: 'royal_signature',
    status: 'resting',
    startDate: '2024-09-15',
    expectedCompletion: '2024-10-06',
    currentDay: 15, // of resting period
    totalRestingDays: 21,
    masterBlender: 'Ustaz Abdullah Al-Oudhi',
    batchSize: 200, // ml
    formulaUsed: {
      'cambodian_oud': { planned: 90, actual: 90, source: 'AGING-001', cost: 4500 },
      'rose_bulgarian': { planned: 50, actual: 50, source: 'AGING-002', cost: 4000 },
      'sandalwood_mysore': { planned: 30, actual: 30, source: 'RAW003', cost: 600 },
      'amber_white': { planned: 20, actual: 20, source: 'RAW004', cost: 300 },
      'carrier_oils': { planned: 10, actual: 10, source: 'CAR001', cost: 50 }
    },
    qualityCheckPoints: [
      { day: 1, completed: true, score: 78, notes: 'Initial blend harsh, needs settling' },
      { day: 7, completed: true, score: 84, notes: 'Notes beginning to marry, showing promise' },
      { day: 14, completed: true, score: 89, notes: 'Excellent development, rich complexity' },
      { day: 21, completed: false, scheduled: '2024-10-06', notes: 'Final quality assessment pending' }
    ],
    expectedYield: 190, // ml (95% of 200ml)
    actualYield: null, // to be determined
    totalCost: 9450, // AED
    targetSellingPrice: 28000, // AED
    projectedMargin: 196, // percentage
    targetGrade: 'super',
    marketRelease: '2024-10-15'
  },
  {
    id: 'BLEND-2024-002',
    projectName: 'Oud Classic Pure - Batch OC24',
    projectNameArabic: 'العود الكلاسيكي الخالص - دفعة ع ك٢٤',
    blendProfile: 'oud_classic',
    status: 'blending',
    startDate: '2024-09-25',
    expectedCompletion: '2024-11-09',
    currentDay: 5,
    totalRestingDays: 45,
    masterBlender: 'Perfumer Sarah Al-Zahra',
    batchSize: 500,
    formulaUsed: {
      'cambodian_oud': { planned: 350, actual: 350, source: 'RAW001', cost: 8750 },
      'indian_oud': { planned: 100, actual: 100, source: 'RAW005', cost: 2000 },
      'carrier_oils': { planned: 50, actual: 50, source: 'CAR001', cost: 250 }
    },
    qualityCheckPoints: [
      { day: 1, completed: true, score: 82, notes: 'Strong traditional oud character' },
      { day: 7, completed: false, scheduled: '2024-10-02' },
      { day: 21, completed: false, scheduled: '2024-10-16' },
      { day: 45, completed: false, scheduled: '2024-11-09' }
    ],
    expectedYield: 490,
    actualYield: null,
    totalCost: 11000,
    targetSellingPrice: 24500,
    projectedMargin: 123,
    targetGrade: 'premium',
    marketRelease: '2024-11-20'
  }
];

// Enhanced multi-location inventory data structure
const inventoryItems = [
  {
    id: 'RAW001',
    name: 'Cambodian Oud Wood - Raw',
    nameArabic: 'عود كمبودي خام',
    category: 'Raw Material',
    type: 'Raw',
    grade: 'Super',
    origin: 'Cambodia',
    batchNumber: 'CAM-2024-001',
    purchaseDate: '2024-01-15',
    expiryDate: '2029-01-15',
    supplier: 'Al-Taiba Trading',
    purchaseCost: 2500, // AED per kg
    // Multi-location stock tracking
    locationStock: {
      'LOC001': { // Warehouse A
        currentStock: 3.5,
        reservedStock: 0.3,
        availableStock: 3.2,
        minStockLevel: 0.5,
        maxStockLevel: 5.0,
        lastUpdated: '2024-09-30',
        binLocation: 'A1-Section-1'
      },
      'LOC003': { // Production Lab
        currentStock: 2.0,
        reservedStock: 0.2,
        availableStock: 1.8,
        minStockLevel: 0.5,
        maxStockLevel: 3.0,
        lastUpdated: '2024-09-30',
        binLocation: 'PL-Raw-Storage'
      }
    },
    // Aggregated totals (calculated from locationStock)
    currentStock: 5.5,
    stockUnit: 'kilogram',
    reservedStock: 0.5,
    availableStock: 5.0,
    minStockLevel: 1.0,
    maxStockLevel: 10.0,
    location: 'Multiple Locations', // Updated to reflect multi-location
    serialNumbers: ['CAM001', 'CAM002', 'CAM003'],
    // Enhanced batch control integration
    batchControl: {
      primaryBatch: 'CAM-2024-001',
      subBatches: [],
      batchStatus: 'active',
      traceabilityCode: 'TC-CAM-2024-001-RAW',
      qualityGrade: 'Super',
      lastQualityCheck: '2024-09-28',
      nextQualityCheck: '2024-10-15',
      complianceCerts: ['HAL-UAE-2024-0156', 'ESMA-2024-CAM-001'],
      storageRequirements: {
        temperatureRange: '20-25°C',
        humidityRange: '60-65%',
        specialConditions: ['away_from_direct_light', 'proper_ventilation']
      }
    },
    // Enhanced multi-tier pricing system
    locationPricing: {
      'LOC001': {
        retail: 2800, // AED per kg
        wholesale: 2600,
        vip: 2750,
        distributor: 2400,
        corporate: 2700,
        basePrice: 2500,
        margin: 12, // 12% margin
        lastUpdated: '2024-09-30'
      },
      'LOC002': {
        retail: 3000, // Higher retail prices for premium location
        wholesale: 2700,
        vip: 2850,
        distributor: 2500,
        corporate: 2750,
        basePrice: 2500,
        margin: 20, // 20% margin for premium location
        lastUpdated: '2024-09-30'
      },
      'LOC003': {
        retail: 2500, // Production cost
        wholesale: 2500,
        vip: 2500,
        distributor: 2300,
        corporate: 2450,
        basePrice: 2300,
        margin: 8.7, // 8.7% margin for production
        lastUpdated: '2024-09-30'
      }
    },
    // Dynamic pricing features
    pricingFeatures: {
      volumeDiscountEligible: true,
      seasonalPricingEligible: true,
      loyaltyPointsEligible: false, // Raw materials don't earn points
      bundleEligible: false,
      currencyFlexible: true,
      negotiable: true, // Raw materials pricing can be negotiated
      priceValidityDays: 30 // Price valid for 30 days
    },
    conversionOptions: [
      { unit: 'gram', factor: 1000 },
      { unit: 'tola', factor: 85.76 }, // approx 85.76 tola per kg
      { unit: 'ounce', factor: 35.27 }
    ],
    transformations: [
      {
        type: 'segregation',
        outputs: [
          { name: 'Oud Chips Premium', percentage: 30, unit: 'gram' },
          { name: 'Oud Powder Grade A', percentage: 50, unit: 'gram' },
          { name: 'Oud Dust', percentage: 20, unit: 'gram' }
        ]
      }
    ],
    aging: {
      required: true,
      duration: 90, // days
      startDate: '2024-01-15',
      readyDate: '2024-04-15',
      status: 'Ready'
    }
  },
  {
    id: 'SEMI001',
    name: 'Oud Oil - Distilled',
    nameArabic: 'زيت العود المقطر',
    category: 'Semi-Finished',
    type: 'Semi-Finished',
    grade: 'Premium',
    origin: 'Cambodia',
    batchNumber: 'DIST-2024-005',
    purchaseDate: '2024-02-01',
    expiryDate: '2027-02-01',
    productionCost: 850, // AED per 100ml
    // Multi-location stock tracking
    locationStock: {
      'LOC003': { // Production Lab
        currentStock: 150,
        reservedStock: 30,
        availableStock: 120,
        minStockLevel: 30,
        maxStockLevel: 300,
        lastUpdated: '2024-09-30',
        binLocation: 'PL-Cold-Storage-A'
      },
      'LOC001': { // Warehouse A
        currentStock: 100,
        reservedStock: 20,
        availableStock: 80,
        minStockLevel: 20,
        maxStockLevel: 200,
        lastUpdated: '2024-09-30',
        binLocation: 'WH-Semi-Finished'
      }
    },
    // Aggregated totals
    currentStock: 250,
    stockUnit: 'milliliter',
    reservedStock: 50,
    availableStock: 200,
    minStockLevel: 50,
    maxStockLevel: 500,
    location: 'Multiple Locations',
    parentBatch: 'CAM-2024-001',
    // Enhanced batch control integration
    batchControl: {
      primaryBatch: 'DIST-2024-005',
      parentBatches: ['CAM-2024-001'],
      subBatches: [],
      batchStatus: 'active',
      traceabilityCode: 'TC-DIST-2024-005-SEMI',
      qualityGrade: 'Premium',
      lastQualityCheck: '2024-09-25',
      nextQualityCheck: '2024-10-10',
      complianceCerts: ['HAL-UAE-2024-0167', 'ESMA-2024-DIST-005'],
      distillationRecord: {
        masterDistiller: 'Hassan Al-Oudhi',
        distillationMethod: 'Traditional steam distillation',
        yield: '5.0%',
        distillationTime: '96 hours',
        fuelType: 'Agarwood charcoal'
      },
      storageRequirements: {
        temperatureRange: '15-20°C',
        humidityRange: '40-50%',
        specialConditions: ['dark_storage', 'amber_glass_container', 'nitrogen_blanketing']
      }
    },
    // Enhanced multi-tier pricing system
    locationPricing: {
      'LOC002': {
        retail: 12, // AED per ml for retail
        wholesale: 10,
        vip: 11,
        distributor: 9,
        corporate: 10.5,
        basePrice: 8.5,
        margin: 41, // 41% margin
        lastUpdated: '2024-09-30'
      },
      'LOC001': {
        retail: 11,
        wholesale: 9.5,
        vip: 10.5,
        distributor: 8.5,
        corporate: 10,
        basePrice: 8.5,
        margin: 29, // 29% margin
        lastUpdated: '2024-09-30'
      },
      'LOC003': {
        retail: 8.5, // Production cost per ml
        wholesale: 8.5,
        vip: 8.5,
        distributor: 7.5,
        corporate: 8,
        basePrice: 7.5,
        margin: 13, // 13% margin
        lastUpdated: '2024-09-30'
      }
    },
    // Dynamic pricing features
    pricingFeatures: {
      volumeDiscountEligible: true,
      seasonalPricingEligible: true,
      loyaltyPointsEligible: true,
      bundleEligible: true,
      currencyFlexible: true,
      negotiable: false, // Semi-finished pricing is fixed
      priceValidityDays: 15
    },
    conversionOptions: [
      { unit: 'milliliter', factor: 1 },
      { unit: 'tola', factor: 0.0858 }, // approx 0.0858 tola per ml
      { unit: 'ounce_fluid', factor: 0.0338 }
    ],
    transformations: [
      {
        type: 'blending',
        inputs: [
          { name: 'Oud Oil - Distilled', quantity: 50, unit: 'milliliter' },
          { name: 'Rose Otto', quantity: 10, unit: 'milliliter' },
          { name: 'Carrier Oil', quantity: 40, unit: 'milliliter' }
        ],
        outputs: [
          { name: 'Royal Oud Blend', quantity: 100, unit: 'milliliter' }
        ]
      }
    ]
  },
  {
    id: 'FIN001',
    name: 'Royal Oud Premium - 12ml',
    nameArabic: 'العود الملكي الفاخر - ١٢ مل',
    category: 'Finished Goods',
    type: 'Finished',
    grade: 'Royal',
    origin: 'UAE',
    batchNumber: 'ROY-2024-010',
    productionDate: '2024-03-01',
    expiryDate: '2026-03-01',
    productionCost: 85, // AED per bottle
    sellingPrice: 450,
    // Multi-location stock tracking
    locationStock: {
      'LOC001': { // Warehouse A
        currentStock: 80,
        reservedStock: 15,
        availableStock: 65,
        minStockLevel: 10,
        maxStockLevel: 100,
        lastUpdated: '2024-09-30',
        binLocation: 'WH-Finished-Premium'
      },
      'LOC002': { // Dubai Mall Store
        currentStock: 50,
        reservedStock: 8,
        availableStock: 42,
        minStockLevel: 5,
        maxStockLevel: 60,
        lastUpdated: '2024-09-30',
        binLocation: 'DM-Display-Premium'
      },
      'LOC003': { // Production Lab
        currentStock: 20,
        reservedStock: 2,
        availableStock: 18,
        minStockLevel: 5,
        maxStockLevel: 30,
        lastUpdated: '2024-09-30',
        binLocation: 'PL-Quality-Control'
      }
    },
    // Aggregated totals
    currentStock: 150,
    stockUnit: 'piece',
    reservedStock: 25,
    availableStock: 125,
    minStockLevel: 20,
    maxStockLevel: 200,
    location: 'Multiple Locations',
    parentBatches: ['DIST-2024-005', 'ROSE-2024-002'],
    // Enhanced batch control integration
    batchControl: {
      primaryBatch: 'ROY-2024-010',
      parentBatches: ['DIST-2024-005', 'ROSE-2024-002'],
      subBatches: [],
      batchStatus: 'active',
      traceabilityCode: 'TC-ROY-2024-010-FIN',
      qualityGrade: 'Royal',
      lastQualityCheck: '2024-09-29',
      nextQualityCheck: '2024-10-05',
      complianceCerts: ['HAL-UAE-2024-0178', 'ESMA-2024-ROY-010'],
      blendingRecord: {
        masterBlender: 'Ustaz Abdullah',
        blendingMethod: 'Traditional hand blending',
        blendRatio: {
          'DIST-2024-005': '60%',
          'ROSE-2024-002': '30%',
          'Carrier oils': '10%'
        },
        agingPeriod: '30 days',
        finalYield: '95%'
      },
      packagingDetails: {
        bottleType: '12ml Crystal with gold cap',
        labelBatch: 'LBL-2024-089',
        packagingDate: '2024-03-15',
        packagingOperator: 'Fatima Al-Zahra',
        qualitySealed: true
      },
      storageRequirements: {
        temperatureRange: '18-22°C',
        humidityRange: '45-55%',
        specialConditions: ['upright_storage', 'minimal_vibration', 'premium_display_area']
      }
    },
    packaging: {
      bottleType: '12ml Crystal',
      labelType: 'Gold Foil',
      boxType: 'Luxury Gift Box'
    },
    // Enhanced multi-tier pricing system
    locationPricing: {
      'LOC002': {
        retail: 450, // Premium retail price
        wholesale: 380,
        vip: 420,
        distributor: 350,
        corporate: 400,
        basePrice: 85,
        margin: 430, // 430% margin for premium location
        lastUpdated: '2024-09-30'
      },
      'LOC001': {
        retail: 420, // Warehouse pricing
        wholesale: 350,
        vip: 390,
        distributor: 320,
        corporate: 370,
        basePrice: 85,
        margin: 394, // 394% margin
        lastUpdated: '2024-09-30'
      },
      'LOC003': {
        retail: 85, // Production cost
        wholesale: 85,
        vip: 85,
        distributor: 75,
        corporate: 80,
        basePrice: 70,
        margin: 21, // 21% margin
        lastUpdated: '2024-09-30'
      },
      'LOC004': {
        retail: 430, // Mall of Emirates pricing
        wholesale: 365,
        vip: 400,
        distributor: 335,
        corporate: 385,
        basePrice: 85,
        margin: 406, // 406% margin
        lastUpdated: '2024-09-30'
      }
    },
    // Dynamic pricing features
    pricingFeatures: {
      volumeDiscountEligible: true,
      seasonalPricingEligible: true,
      loyaltyPointsEligible: true,
      bundleEligible: true,
      currencyFlexible: true,
      negotiable: false, // Finished goods pricing is fixed
      priceValidityDays: 7, // Prices change weekly
      loyaltyPointsEarned: 45, // Points earned per purchase
      bundleDiscountEligible: ['FIN002', 'SEMI001']
    }
  },
  // Additional inventory items with multi-location data
  {
    id: 'FIN002',
    name: 'Saffron Rose Blend - 6ml',
    nameArabic: 'خليط الزعفران والورد - ٦ مل',
    category: 'Finished Goods',
    type: 'Finished',
    grade: 'Premium',
    origin: 'UAE',
    batchNumber: 'SAF-2024-008',
    productionDate: '2024-02-15',
    expiryDate: '2026-02-15',
    productionCost: 45,
    sellingPrice: 220,
    locationStock: {
      'LOC002': {
        currentStock: 75,
        reservedStock: 10,
        availableStock: 65,
        minStockLevel: 15,
        maxStockLevel: 100,
        lastUpdated: '2024-09-30',
        binLocation: 'DM-Display-Regular'
      },
      'LOC001': {
        currentStock: 45,
        reservedStock: 5,
        availableStock: 40,
        minStockLevel: 10,
        maxStockLevel: 60,
        lastUpdated: '2024-09-30',
        binLocation: 'WH-Finished-Regular'
      }
    },
    currentStock: 120,
    stockUnit: 'piece',
    reservedStock: 15,
    availableStock: 105,
    minStockLevel: 25,
    maxStockLevel: 160,
    location: 'Multiple Locations',
    parentBatches: ['SAF-2024-003', 'ROSE-2024-002'],
    packaging: {
      bottleType: '6ml Amber',
      labelType: 'Standard',
      boxType: 'Gift Box'
    },
    locationPricing: {
      'LOC002': {
        retail: 220,
        wholesale: 180,
        vip: 200,
        distributor: 160,
        corporate: 190,
        basePrice: 45,
        margin: 389, // 389% margin
        lastUpdated: '2024-09-30'
      },
      'LOC001': {
        retail: 200,
        wholesale: 160,
        vip: 180,
        distributor: 140,
        corporate: 170,
        basePrice: 45,
        margin: 344, // 344% margin
        lastUpdated: '2024-09-30'
      },
      'LOC004': {
        retail: 210,
        wholesale: 170,
        vip: 190,
        distributor: 150,
        corporate: 180,
        basePrice: 45,
        margin: 367, // 367% margin
        lastUpdated: '2024-09-30'
      }
    },
    // Dynamic pricing features
    pricingFeatures: {
      volumeDiscountEligible: true,
      seasonalPricingEligible: true,
      loyaltyPointsEligible: true,
      bundleEligible: true,
      currencyFlexible: true,
      negotiable: false,
      priceValidityDays: 10,
      loyaltyPointsEarned: 22,
      bundleDiscountEligible: ['FIN001']
    },
    conversionOptions: [
      { unit: 'milliliter', factor: 6 },
      { unit: 'tola', factor: 0.515 }
    ],
    transformations: []
  }
];

// Enhanced store locations with multi-location capabilities
const storeLocations = [
  {
    id: 'LOC001',
    name: 'Warehouse A',
    nameArabic: 'مستودع أ',
    type: 'Warehouse',
    address: 'Jebel Ali Free Zone, Dubai',
    capacity: '1000 sqm',
    manager: 'Ahmed Al-Rashid',
    phone: '+971 4 881 2000',
    email: 'ahmed.rashid@oudpms.ae',
    operatingHours: '24/7',
    timezone: 'Asia/Dubai',
    coordinates: { lat: 25.012, lng: 55.133 },
    isActive: true,
    allowTransferFrom: true,
    allowTransferTo: true,
    autoReorderEnabled: true,
    lastStockCount: '2024-09-25',
    costCenter: 'WH-001',
    binLocations: [
      'A1-Section-1', 'A1-Section-2', 'A2-Section-1',
      'WH-Semi-Finished', 'WH-Finished-Premium', 'WH-Finished-Regular'
    ]
  },
  {
    id: 'LOC002',
    name: 'Dubai Mall Store',
    nameArabic: 'متجر دبي مول',
    type: 'Retail',
    address: 'Dubai Mall, Level 2, Dubai',
    capacity: '50 sqm',
    manager: 'Fatima Hassan',
    phone: '+971 4 339 9111',
    email: 'fatima.hassan@oudpms.ae',
    operatingHours: '10:00 - 22:00',
    timezone: 'Asia/Dubai',
    coordinates: { lat: 25.198, lng: 55.276 },
    isActive: true,
    allowTransferFrom: true,
    allowTransferTo: true,
    autoReorderEnabled: true,
    lastStockCount: '2024-09-28',
    costCenter: 'RT-001',
    binLocations: [
      'DM-Display-Premium', 'DM-Display-Regular', 'DM-Storage-Back',
      'DM-Counter-A', 'DM-Counter-B'
    ],
    salesMetrics: {
      monthlyTarget: 50000, // AED
      currentMonthSales: 38500,
      averageTransactionValue: 285,
      footfallCount: 1250
    }
  },
  {
    id: 'LOC003',
    name: 'Production Lab',
    nameArabic: 'مختبر الإنتاج',
    type: 'Production',
    address: 'Al Qusais Industrial, Dubai',
    capacity: '200 sqm',
    manager: 'Omar Saeed',
    phone: '+971 4 267 8900',
    email: 'omar.saeed@oudpms.ae',
    operatingHours: '08:00 - 18:00',
    timezone: 'Asia/Dubai',
    coordinates: { lat: 25.298, lng: 55.394 },
    isActive: true,
    allowTransferFrom: true,
    allowTransferTo: false, // Production doesn't receive regular transfers
    autoReorderEnabled: false, // Manual control for production
    lastStockCount: '2024-09-26',
    costCenter: 'PR-001',
    binLocations: [
      'PL-Raw-Storage', 'PL-Cold-Storage-A', 'PL-Cold-Storage-B',
      'PL-Quality-Control', 'PL-Aging-Room-1', 'PL-Aging-Room-2'
    ],
    productionMetrics: {
      monthlyCapacity: 500, // liters
      currentMonthProduction: 320,
      efficiencyRate: 94.5,
      qualityScore: 98.2
    }
  },
  {
    id: 'LOC004',
    name: 'Mall of Emirates Store',
    nameArabic: 'متجر مول الإمارات',
    type: 'Retail',
    address: 'Mall of Emirates, Level 1, Dubai',
    capacity: '35 sqm',
    manager: 'Aisha Al-Mansoori',
    phone: '+971 4 341 4000',
    email: 'aisha.mansoori@oudpms.ae',
    operatingHours: '10:00 - 23:00',
    timezone: 'Asia/Dubai',
    coordinates: { lat: 25.118, lng: 55.200 },
    isActive: true,
    allowTransferFrom: true,
    allowTransferTo: true,
    autoReorderEnabled: true,
    lastStockCount: '2024-09-29',
    costCenter: 'RT-002',
    binLocations: [
      'ME-Display-A', 'ME-Display-B', 'ME-Storage'
    ],
    salesMetrics: {
      monthlyTarget: 35000,
      currentMonthSales: 28900,
      averageTransactionValue: 220,
      footfallCount: 980
    }
  },
  {
    id: 'LOC005',
    name: 'Abu Dhabi Warehouse',
    nameArabic: 'مستودع أبوظبي',
    type: 'Warehouse',
    address: 'Mussafah Industrial, Abu Dhabi',
    capacity: '800 sqm',
    manager: 'Khalid Al-Zaabi',
    phone: '+971 2 550 1200',
    email: 'khalid.zaabi@oudpms.ae',
    operatingHours: '07:00 - 19:00',
    timezone: 'Asia/Dubai',
    coordinates: { lat: 24.347, lng: 54.503 },
    isActive: true,
    allowTransferFrom: true,
    allowTransferTo: true,
    autoReorderEnabled: true,
    lastStockCount: '2024-09-27',
    costCenter: 'WH-002',
    binLocations: [
      'AD-A1', 'AD-A2', 'AD-B1', 'AD-Finished'
    ]
  }
];

// Enhanced stock movements with multi-location transfers
const stockMovements = [
  {
    id: 'MOV001',
    date: '2024-09-30',
    type: 'Goods Receipt',
    item: 'Cambodian Oud Wood - Raw',
    quantity: 2.5,
    unit: 'kilogram',
    fromLocation: 'Supplier',
    toLocation: 'Warehouse A',
    reference: 'PO-2024-089',
    operator: 'Ahmed Al-Rashid',
    cost: 6250
  },
  {
    id: 'MOV002',
    date: '2024-09-29',
    type: 'Production Issue',
    item: 'Oud Oil - Distilled',
    quantity: 100,
    unit: 'milliliter',
    fromLocation: 'Production Lab',
    toLocation: 'Finished Goods',
    reference: 'PROD-2024-045',
    operator: 'Omar Saeed',
    notes: 'Used for Royal Oud Blend production'
  },
  {
    id: 'MOV003',
    date: '2024-09-28',
    type: 'Store Transfer',
    item: 'Royal Oud Premium - 12ml',
    quantity: 20,
    unit: 'piece',
    fromLocation: 'Warehouse A',
    toLocation: 'Dubai Mall Store',
    reference: 'TRF-2024-112',
    operator: 'Fatima Hassan',
    status: 'Completed',
    transferCost: 25, // AED for transportation
    requestedBy: 'fatima.hassan@oudpms.ae',
    approvedBy: 'ahmed.rashid@oudpms.ae',
    requestDate: '2024-09-27',
    approvalDate: '2024-09-27',
    shippedDate: '2024-09-28',
    receivedDate: '2024-09-28',
    trackingNumber: 'TRK-2024-112',
    fromBinLocation: 'WH-Finished-Premium',
    toBinLocation: 'DM-Display-Premium'
  },
  {
    id: 'MOV004',
    date: '2024-09-29',
    type: 'Inter-Store Transfer',
    item: 'Saffron Rose Blend - 6ml',
    quantity: 15,
    unit: 'piece',
    fromLocation: 'Dubai Mall Store',
    toLocation: 'Mall of Emirates Store',
    reference: 'TRF-2024-113',
    operator: 'Aisha Al-Mansoori',
    status: 'In Transit',
    transferCost: 15,
    requestedBy: 'aisha.mansoori@oudpms.ae',
    approvedBy: 'fatima.hassan@oudpms.ae',
    requestDate: '2024-09-29',
    approvalDate: '2024-09-29',
    shippedDate: '2024-09-29',
    expectedDelivery: '2024-09-30',
    trackingNumber: 'TRK-2024-113',
    fromBinLocation: 'DM-Display-Regular',
    toBinLocation: 'ME-Display-A'
  },
  {
    id: 'MOV005',
    date: '2024-09-30',
    type: 'Emergency Transfer',
    item: 'Royal Oud Premium - 12ml',
    quantity: 5,
    unit: 'piece',
    fromLocation: 'Production Lab',
    toLocation: 'Dubai Mall Store',
    reference: 'EMG-2024-008',
    operator: 'Omar Saeed',
    status: 'Pending Approval',
    transferCost: 35, // Higher cost for emergency
    requestedBy: 'fatima.hassan@oudpms.ae',
    requestDate: '2024-09-30',
    priority: 'High',
    reason: 'Stock out - high demand customer',
    fromBinLocation: 'PL-Quality-Control',
    toBinLocation: 'DM-Counter-A'
  }
];

// Transfer requests and workflow
const transferRequests = [
  {
    id: 'REQ001',
    requestDate: '2024-09-30',
    requestedBy: 'aisha.mansoori@oudpms.ae',
    fromLocation: 'LOC001', // Warehouse A
    toLocation: 'LOC004', // Mall of Emirates
    items: [
      {
        itemId: 'FIN001',
        itemName: 'Royal Oud Premium - 12ml',
        requestedQuantity: 10,
        unit: 'piece',
        reason: 'Low stock - weekend promotion'
      },
      {
        itemId: 'FIN002',
        itemName: 'Saffron Rose Blend - 6ml',
        requestedQuantity: 8,
        unit: 'piece',
        reason: 'Customer pre-orders'
      }
    ],
    status: 'Pending Manager Approval',
    priority: 'Medium',
    expectedDeliveryDate: '2024-10-01',
    totalEstimatedCost: 45,
    justification: 'Anticipating high weekend sales due to promotional campaign',
    managerComments: null,
    approvalRequired: true
  },
  {
    id: 'REQ002',
    requestDate: '2024-09-29',
    requestedBy: 'fatima.hassan@oudpms.ae',
    fromLocation: 'LOC005', // Abu Dhabi Warehouse
    toLocation: 'LOC002', // Dubai Mall Store
    items: [
      {
        itemId: 'SEMI001',
        itemName: 'Oud Oil - Distilled',
        requestedQuantity: 50,
        unit: 'milliliter',
        reason: 'Custom order preparation'
      }
    ],
    status: 'Approved',
    priority: 'High',
    expectedDeliveryDate: '2024-09-30',
    totalEstimatedCost: 85,
    justification: 'High-value customer custom blend order',
    approvedBy: 'khalid.zaabi@oudpms.ae',
    approvalDate: '2024-09-29',
    managerComments: 'Approved - priority customer order'
  }
];

// Procurement data
const procurementItems = [
  {
    id: 'PROC001',
    item: 'Cambodian Oud Wood - Raw',
    currentStock: 5.5,
    minStock: 1.0,
    maxStock: 10.0,
    averageUsage: 0.5, // kg per month
    leadTime: 14, // days
    suggestedQuantity: 4.5,
    supplier: 'Al-Taiba Trading',
    lastPrice: 2500, // AED per kg
    status: 'Normal',
    priority: 'Medium'
  },
  {
    id: 'PROC002',
    item: 'Rose Otto Essential Oil',
    currentStock: 25,
    minStock: 50,
    maxStock: 200,
    averageUsage: 15, // ml per month
    leadTime: 21, // days
    suggestedQuantity: 125,
    supplier: 'Bulgarian Rose Co.',
    lastPrice: 45, // AED per ml
    status: 'Low Stock',
    priority: 'High'
  },
  {
    id: 'PROC003',
    item: '12ml Crystal Bottles',
    currentStock: 150,
    minStock: 100,
    maxStock: 500,
    averageUsage: 80, // pieces per month
    leadTime: 7, // days
    suggestedQuantity: 250,
    supplier: 'Gulf Packaging LLC',
    lastPrice: 3.5, // AED per piece
    status: 'Normal',
    priority: 'Low'
  }
];

// Suppliers data
const suppliers = [
  {
    id: 'SUP001',
    name: 'Al-Taiba Trading',
    nameArabic: 'شركة الطيبة للتجارة',
    contact: '+971 4 123 4567',
    email: 'info@altaiba.ae',
    address: 'Deira, Dubai, UAE',
    rating: 4.8,
    products: ['Raw Oud Wood', 'Oud Chips', 'Traditional Materials'],
    leadTime: '14 days',
    paymentTerms: '30 days',
    reliability: 'Excellent'
  },
  {
    id: 'SUP002',
    name: 'Bulgarian Rose Co.',
    nameArabic: 'شركة الورد البلغاري',
    contact: '+359 2 987 6543',
    email: 'export@bulgarianrose.bg',
    address: 'Sofia, Bulgaria',
    rating: 4.9,
    products: ['Rose Otto', 'Lavender Oil', 'European Essentials'],
    leadTime: '21 days',
    paymentTerms: 'Advance payment',
    reliability: 'Excellent'
  },
  {
    id: 'SUP003',
    name: 'Gulf Packaging LLC',
    nameArabic: 'شركة الخليج للتعبئة والتغليف',
    contact: '+971 6 555 0123',
    email: 'sales@gulfpack.ae',
    address: 'Sharjah, UAE',
    rating: 4.3,
    products: ['Glass Bottles', 'Labels', 'Packaging Materials'],
    leadTime: '7 days',
    paymentTerms: '15 days',
    reliability: 'Good'
  }
];

export default function AdvancedInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [isTransformDialogOpen, setIsTransformDialogOpen] = useState(false);
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [isConversionDialogOpen, setIsConversionDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isLocationDetailsDialogOpen, setIsLocationDetailsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'consolidated' | 'by-location'>('consolidated');
  const [selectedLocationDetails, setSelectedLocationDetails] = useState<any>(null);

  // Unit conversion function
  const convertUnits = (quantity: number, fromUnit: string, toUnit: string, conversionType: 'weight' | 'volume') => {
    const conversions = unitConversions[conversionType];
    if (!conversions[fromUnit] || !conversions[toUnit]) return quantity;

    const baseQuantity = quantity * conversions[fromUnit];
    return baseQuantity / conversions[toUnit];
  };

  // Calculate stock value (enhanced for multi-location)
  const calculateStockValue = (item: any, locationId?: string) => {
    const cost = item.purchaseCost || item.productionCost || 0;

    if (locationId && item.locationStock && item.locationStock[locationId]) {
      return item.locationStock[locationId].currentStock * cost;
    }

    return item.currentStock * cost;
  };

  // Calculate total stock value across all locations
  const calculateTotalStockValue = (item: any) => {
    if (!item.locationStock) {
      return calculateStockValue(item);
    }

    const cost = item.purchaseCost || item.productionCost || 0;
    return Object.values(item.locationStock).reduce((total: number, location: any) => {
      return total + (location.currentStock * cost);
    }, 0);
  };

  // Get stock status (enhanced for multi-location)
  const getStockStatus = (item: any, locationId?: string) => {
    let currentStock, minStock, maxStock;

    if (locationId && item.locationStock && item.locationStock[locationId]) {
      const locationData = item.locationStock[locationId];
      currentStock = locationData.currentStock;
      minStock = locationData.minStockLevel;
      maxStock = locationData.maxStockLevel;
    } else {
      currentStock = item.currentStock;
      minStock = item.minStockLevel;
      maxStock = item.maxStockLevel;
    }

    if (currentStock <= minStock) return 'low';
    if (currentStock >= maxStock) return 'high';
    return 'normal';
  };

  // Enhanced location-specific pricing with all customer types
  const getLocationPrice = (item: any, locationId: string, priceType: 'retail' | 'wholesale' | 'vip' | 'distributor' | 'corporate' = 'retail') => {
    if (item.locationPricing && item.locationPricing[locationId]) {
      return item.locationPricing[locationId][priceType] || item.sellingPrice || 0;
    }
    return item.sellingPrice || 0;
  };

  // Calculate dynamic price with all applicable discounts
  const calculateDynamicPrice = (item: any, locationId: string, customerType: string, quantity: number = 1, currency: string = 'AED') => {
    let basePrice = getLocationPrice(item, locationId, customerType as any);

    // Apply customer type discount
    if (customerTypes[customerType]) {
      const customerDiscount = customerTypes[customerType].discount;
      basePrice = basePrice * (1 - customerDiscount / 100);
    }

    // Apply volume discounts if eligible
    if (item.pricingFeatures?.volumeDiscountEligible) {
      const volumeDiscount = pricingRules.volumeDiscounts.find(rule =>
        quantity >= rule.minQuantity && quantity <= rule.maxQuantity
      );
      if (volumeDiscount) {
        basePrice = basePrice * (1 - volumeDiscount.discount / 100);
      }
    }

    // Apply seasonal pricing if applicable
    if (item.pricingFeatures?.seasonalPricingEligible) {
      const today = new Date();
      const activeSeason = Object.values(pricingRules.seasonalPricing).find(season => {
        const startDate = new Date(season.startDate);
        const endDate = new Date(season.endDate);
        return today >= startDate && today <= endDate && season.applicableItems.includes(item.id);
      });
      if (activeSeason) {
        basePrice = basePrice * (1 - activeSeason.discount / 100);
      }
    }

    // Apply VAT
    const vatAmount = basePrice * (pricingRules.taxRates.vat.rate / 100);
    const finalPrice = basePrice + vatAmount;

    // Convert currency if needed
    if (currency !== 'AED' && pricingRules.currencyRates.rates[currency]) {
      return finalPrice / pricingRules.currencyRates.rates[currency];
    }

    return finalPrice;
  };

  // Calculate loyalty points earned
  const calculateLoyaltyPoints = (item: any, totalAmount: number) => {
    if (!item.pricingFeatures?.loyaltyPointsEligible) return 0;

    // 1 point per AED spent, with bonus points for specific items
    let points = Math.floor(totalAmount);

    if (item.pricingFeatures.loyaltyPointsEarned) {
      points += item.pricingFeatures.loyaltyPointsEarned;
    }

    return points;
  };

  // Get pricing matrix for an item across all locations and customer types
  const getPricingMatrix = (item: any) => {
    const matrix = {};

    Object.keys(item.locationPricing || {}).forEach(locationId => {
      const location = storeLocations.find(loc => loc.id === locationId);
      if (!location) return;

      matrix[locationId] = {
        locationName: location.name,
        pricing: {}
      };

      Object.keys(customerTypes).forEach(customerType => {
        matrix[locationId].pricing[customerType] = {
          basePrice: getLocationPrice(item, locationId, customerType as any),
          withVAT: calculateDynamicPrice(item, locationId, customerType, 1),
          volumeDiscount10: calculateDynamicPrice(item, locationId, customerType, 10),
          volumeDiscount50: calculateDynamicPrice(item, locationId, customerType, 50),
          volumeDiscount100: calculateDynamicPrice(item, locationId, customerType, 100)
        };
      });
    });

    return matrix;
  };

  // Check if bundle discount applies
  const checkBundleDiscount = (items: any[], quantities: number[]) => {
    // Simple bundle logic: if buying 2+ eligible items together, 5% discount
    const eligibleItems = items.filter(item => item.pricingFeatures?.bundleEligible);

    if (eligibleItems.length >= 2) {
      return {
        applicable: true,
        discount: 5, // 5% bundle discount
        description: 'Multi-item bundle discount'
      };
    }

    return { applicable: false, discount: 0, description: '' };
  };

  // Get margin analysis
  const getMarginAnalysis = (item: any, locationId: string) => {
    const locationPricing = item.locationPricing?.[locationId];
    if (!locationPricing) return null;

    const basePrice = locationPricing.basePrice || 0;
    const retailPrice = locationPricing.retail || 0;
    const wholesalePrice = locationPricing.wholesale || 0;

    return {
      basePrice,
      retailPrice,
      wholesalePrice,
      retailMargin: basePrice ? ((retailPrice - basePrice) / basePrice * 100).toFixed(1) : 0,
      wholesaleMargin: basePrice ? ((wholesalePrice - basePrice) / basePrice * 100).toFixed(1) : 0,
      marginPercentage: locationPricing.margin || 0
    };
  };

  // Advanced batch control and traceability functions
  const generateBatchNumber = (origin: string, year: number = new Date().getFullYear()) => {
    const originCode = batchControlSystem.batchNumbering.sequences[origin.toLowerCase()] || 'UNK';
    const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `${originCode}-${year}-${sequence}`;
  };

  const generateQRCode = (batchNumber: string) => {
    const timestamp = new Date().getTime().toString(36);
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `QR_${batchNumber.replace(/-/g, '_')}_${randomSuffix}`;
  };

  const getBatchTraceability = (batchNumber: string) => {
    return batchTrackingData.find(batch => batch.batchNumber === batchNumber);
  };

  const getBatchHierarchy = (batchNumber: string) => {
    const batch = getBatchTraceability(batchNumber);
    if (!batch) return null;

    const parentBatches = batch.parentBatches || [];
    const childBatches = batchTrackingData.filter(b =>
      b.parentBatches && b.parentBatches.includes(batchNumber)
    );

    return {
      batch,
      parents: parentBatches.map(parentBatch => getBatchTraceability(parentBatch)).filter(Boolean),
      children: childBatches
    };
  };

  const getQualityStatus = (item: any) => {
    const batchControl = item.batchControl;
    if (!batchControl) return { status: 'unknown', color: 'gray' };

    const lastCheck = new Date(batchControl.lastQualityCheck);
    const nextCheck = new Date(batchControl.nextQualityCheck);
    const now = new Date();
    const daysUntilNextCheck = Math.ceil((nextCheck.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (daysUntilNextCheck < 0) {
      return { status: 'overdue', color: 'red', message: `Quality check overdue by ${Math.abs(daysUntilNextCheck)} days` };
    } else if (daysUntilNextCheck <= 3) {
      return { status: 'due_soon', color: 'orange', message: `Quality check due in ${daysUntilNextCheck} days` };
    } else {
      return { status: 'current', color: 'green', message: `Next check in ${daysUntilNextCheck} days` };
    }
  };

  const getComplianceStatus = (item: any) => {
    const batchControl = item.batchControl;
    if (!batchControl || !batchControl.complianceCerts) {
      return { status: 'incomplete', count: 0, total: 4 };
    }

    const requiredCerts = ['halal', 'esma', 'origin', 'customs'];
    const currentCerts = batchControl.complianceCerts.length;
    const totalRequired = requiredCerts.length;

    if (currentCerts >= totalRequired) {
      return { status: 'compliant', count: currentCerts, total: totalRequired };
    } else if (currentCerts > 0) {
      return { status: 'partial', count: currentCerts, total: totalRequired };
    } else {
      return { status: 'non_compliant', count: 0, total: totalRequired };
    }
  };

  const calculateBatchAge = (item: any) => {
    const batchControl = item.batchControl;
    if (!batchControl) return null;

    const createdDate = new Date(item.purchaseDate || item.productionDate || Date.now());
    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));

    return {
      days: ageInDays,
      months: Math.floor(ageInDays / 30),
      years: Math.floor(ageInDays / 365),
      formatted: ageInDays > 365 ? `${Math.floor(ageInDays / 365)}y ${Math.floor((ageInDays % 365) / 30)}m` :
                 ageInDays > 30 ? `${Math.floor(ageInDays / 30)}m ${ageInDays % 30}d` :
                 `${ageInDays}d`
    };
  };

  const getStorageCompliance = (item: any, locationId: string) => {
    const batchControl = item.batchControl;
    const locationData = item.locationStock?.[locationId];

    if (!batchControl || !batchControl.storageRequirements) {
      return { status: 'unknown', issues: ['No storage requirements defined'] };
    }

    const requirements = batchControl.storageRequirements;
    const issues = [];

    // In a real system, you would check actual environmental conditions
    // For demo purposes, we'll simulate some conditions
    const simulatedConditions = {
      temperature: 22.5,
      humidity: 58.0,
      lightExposure: 'minimal',
      ventilation: 'adequate'
    };

    // Check temperature compliance
    const tempRange = requirements.temperatureRange.split('-').map(t => parseFloat(t));
    if (simulatedConditions.temperature < tempRange[0] || simulatedConditions.temperature > tempRange[1]) {
      issues.push(`Temperature ${simulatedConditions.temperature}°C outside range ${requirements.temperatureRange}`);
    }

    // Check humidity compliance
    const humidityRange = requirements.humidityRange.split('-').map(h => parseFloat(h));
    if (simulatedConditions.humidity < humidityRange[0] || simulatedConditions.humidity > humidityRange[1]) {
      issues.push(`Humidity ${simulatedConditions.humidity}% outside range ${requirements.humidityRange}`);
    }

    return {
      status: issues.length === 0 ? 'compliant' : 'non_compliant',
      issues,
      conditions: simulatedConditions
    };
  };

  // Enhanced procurement utility functions
  const calculateImportCosts = (orderValue: number, currency: string, category: string) => {
    // Convert to AED if needed
    let aedValue = orderValue;
    if (currency === 'EUR') aedValue = orderValue * 4.02;
    if (currency === 'USD') aedValue = orderValue * 3.67;

    const dutyRate = procurementSystem.uaeImportRegulations.dutyRates[category]?.rate || 4;
    const importDuty = (aedValue * dutyRate) / 100;
    const vat = ((aedValue + importDuty) * procurementSystem.uaeImportRegulations.vatRate) / 100;
    const totalImportCost = aedValue + importDuty + vat;

    return {
      orderValue: aedValue,
      importDuty,
      vat,
      totalCost: totalImportCost,
      dutyRate,
      vatRate: procurementSystem.uaeImportRegulations.vatRate
    };
  };

  const getPurchaseOrderStatus = (poId: string) => {
    return currentPurchaseOrders.find(po => po.id === poId);
  };

  const getVendorPerformance = (vendorId: string) => {
    const vendorOrders = currentPurchaseOrders.filter(po => po.vendorId === vendorId);
    const totalOrders = vendorOrders.length;
    const deliveredOnTime = vendorOrders.filter(po =>
      po.status === 'delivered' && po.actualDelivery <= po.expectedDelivery
    ).length;
    const averageDeliveryTime = vendorOrders
      .filter(po => po.actualDelivery)
      .reduce((sum, po) => {
        const ordered = new Date(po.orderDate);
        const delivered = new Date(po.actualDelivery);
        return sum + (delivered.getTime() - ordered.getTime()) / (1000 * 3600 * 24);
      }, 0) / Math.max(vendorOrders.filter(po => po.actualDelivery).length, 1);

    return {
      totalOrders,
      onTimeDeliveryRate: totalOrders > 0 ? (deliveredOnTime / totalOrders * 100).toFixed(1) : 0,
      averageDeliveryTime: averageDeliveryTime.toFixed(1),
      totalValue: vendorOrders.reduce((sum, po) => sum + po.totalValue, 0)
    };
  };

  const getDocumentComplianceStatus = (po: any) => {
    if (!po.importDetails) return { status: 'local', completeness: 100 };

    const requiredDocs = procurementSystem.uaeImportRegulations.requiredDocuments;
    const poDocsStatus = po.importDetails.documentsStatus;
    const totalRequired = requiredDocs.filter(doc => doc.required).length;
    const approved = Object.values(poDocsStatus).filter(status => status === 'approved').length;
    const completeness = (approved / totalRequired * 100).toFixed(1);

    return {
      status: completeness == 100 ? 'complete' : completeness >= 75 ? 'mostly_complete' : 'incomplete',
      completeness: parseFloat(completeness),
      approved,
      totalRequired
    };
  };

  // Get items for specific location
  const getItemsForLocation = (locationId: string) => {
    return inventoryItems.filter(item => {
      if (!item.locationStock) return false;
      return item.locationStock[locationId] && item.locationStock[locationId].currentStock > 0;
    });
  };

  // Calculate location stock summary
  const getLocationStockSummary = (locationId: string) => {
    const locationItems = getItemsForLocation(locationId);
    const totalValue = locationItems.reduce((sum, item) => sum + calculateStockValue(item, locationId), 0);
    const lowStockItems = locationItems.filter(item => getStockStatus(item, locationId) === 'low').length;

    return {
      totalItems: locationItems.length,
      totalValue,
      lowStockItems,
      location: storeLocations.find(loc => loc.id === locationId)
    };
  };

  // Check if transfer is allowed between locations
  const canTransferBetween = (fromLocationId: string, toLocationId: string) => {
    const fromLocation = storeLocations.find(loc => loc.id === fromLocationId);
    const toLocation = storeLocations.find(loc => loc.id === toLocationId);

    return fromLocation?.allowTransferFrom && toLocation?.allowTransferTo;
  };

  // Enhanced filter items for multi-location view
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.nameArabic.includes(searchTerm) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

    // Enhanced location filtering for multi-location support
    let matchesLocation = true;
    if (filterLocation !== 'all') {
      if (item.locationStock) {
        matchesLocation = Object.keys(item.locationStock).some(locationId => {
          const location = storeLocations.find(loc => loc.id === locationId);
          return location?.name.includes(filterLocation) && item.locationStock[locationId].currentStock > 0;
        });
      } else {
        matchesLocation = item.location.includes(filterLocation);
      }
    }

    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Get items formatted for location-specific view
  const getLocationSpecificItems = () => {
    if (selectedLocation === 'all') return filteredItems;

    return filteredItems.filter(item => {
      if (!item.locationStock) return false;
      return item.locationStock[selectedLocation] && item.locationStock[selectedLocation].currentStock > 0;
    }).map(item => ({
      ...item,
      // Override with location-specific data
      currentStock: item.locationStock[selectedLocation]?.currentStock || 0,
      reservedStock: item.locationStock[selectedLocation]?.reservedStock || 0,
      availableStock: item.locationStock[selectedLocation]?.availableStock || 0,
      minStockLevel: item.locationStock[selectedLocation]?.minStockLevel || 0,
      maxStockLevel: item.locationStock[selectedLocation]?.maxStockLevel || 0,
      location: storeLocations.find(loc => loc.id === selectedLocation)?.name || 'Unknown',
      binLocation: item.locationStock[selectedLocation]?.binLocation || 'N/A'
    }));
  };

  // Get the items to display based on view mode
  const displayItems = viewMode === 'by-location' ? getLocationSpecificItems() : filteredItems;

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Multi-Location Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Package className="h-8 w-8 text-amber-600" />
              Multi-Location Inventory Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive inventory across {storeLocations.length} locations with inter-store transfers, location-specific pricing, and real-time stock tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  Transfer Stock
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync All
            </Button>
            <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Multi-Location View Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">View Mode:</span>
              <Select value={viewMode} onValueChange={(value: 'consolidated' | 'by-location') => setViewMode(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consolidated">Consolidated View</SelectItem>
                  <SelectItem value="by-location">By Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {viewMode === 'by-location' && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Location:</span>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {storeLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name} ({location.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              {storeLocations.filter(loc => loc.isActive).length} Active Locations
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              {transferRequests.filter(req => req.status === 'Pending Manager Approval').length} Pending Transfers
            </Badge>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats with Multi-Location Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {storeLocations.length} locations
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {inventoryItems.reduce((sum, item) => sum + calculateTotalStockValue(item), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Multi-location valuation
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storeLocations.reduce((total, location) => {
                return total + getItemsForLocation(location.id).filter(item =>
                  getStockStatus(item, location.id) === 'low'
                ).length;
              }, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all locations
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeLocations.filter(loc => loc.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              {storeLocations.filter(loc => loc.type === 'Retail').length} retail, {storeLocations.filter(loc => loc.type === 'Warehouse').length} warehouse
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transferRequests.filter(req =>
                req.status === 'Pending Manager Approval' || req.status === 'Approved'
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {stockMovements.filter(mov => mov.status === 'In Transit').length} in transit
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aging Ready</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventoryItems.filter(item => item.aging?.status === 'Ready').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for production
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="batches">Batch Control</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="transformations">Transform</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="sales">Sales & POS</TabsTrigger>
          <TabsTrigger value="perfume-oud">Perfume & Oud</TabsTrigger>
        </TabsList>

        {/* Inventory Items Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>
                    Multi-unit inventory with batch tracking and conversions
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isConversionDialogOpen} onOpenChange={setIsConversionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Calculator className="h-4 w-4 mr-1" />
                        Unit Converter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Unit Conversion Calculator</DialogTitle>
                        <DialogDescription>
                          Convert between different units used in perfume and oud business
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>From</Label>
                            <div className="flex space-x-2">
                              <Input type="number" placeholder="Quantity" />
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="gram">Gram</SelectItem>
                                  <SelectItem value="tola">Tola</SelectItem>
                                  <SelectItem value="ounce">Ounce</SelectItem>
                                  <SelectItem value="kilogram">Kilogram</SelectItem>
                                  <SelectItem value="milliliter">Milliliter</SelectItem>
                                  <SelectItem value="liter">Liter</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label>To</Label>
                            <div className="flex space-x-2">
                              <Input type="number" placeholder="Result" readOnly />
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="gram">Gram</SelectItem>
                                  <SelectItem value="tola">Tola</SelectItem>
                                  <SelectItem value="ounce">Ounce</SelectItem>
                                  <SelectItem value="kilogram">Kilogram</SelectItem>
                                  <SelectItem value="milliliter">Milliliter</SelectItem>
                                  <SelectItem value="liter">Liter</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-2">Conversion Reference:</h4>
                          <div className="text-sm space-y-1">
                            <div>1 Tola = 11.66 Grams</div>
                            <div>1 Ounce = 28.35 Grams</div>
                            <div>1 Kilogram = 1000 Grams</div>
                            <div>1 Liter = 1000 Milliliters</div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, Arabic, batch number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Raw Material">Raw Material</SelectItem>
                    <SelectItem value="Semi-Finished">Semi-Finished</SelectItem>
                    <SelectItem value="Finished Goods">Finished Goods</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {storeLocations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Enhanced Inventory Table with Multi-Location Support */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Details</TableHead>
                      <TableHead>Batch Info</TableHead>
                      <TableHead>Stock Status</TableHead>
                      <TableHead>{viewMode === 'by-location' && selectedLocation !== 'all' ? 'Bin Location' : 'Locations'}</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayItems.map((item) => {
                      const stockStatus = viewMode === 'by-location' && selectedLocation !== 'all'
                        ? getStockStatus(item, selectedLocation)
                        : getStockStatus(item);
                      const stockValue = viewMode === 'by-location' && selectedLocation !== 'all'
                        ? calculateStockValue(item, selectedLocation)
                        : calculateTotalStockValue(item);

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600">{item.nameArabic}</div>
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-amber-100 text-amber-800">
                                  {item.category}
                                </Badge>
                                <Badge variant="outline">
                                  Grade {item.grade}
                                </Badge>
                                <Badge variant="outline">
                                  {item.origin}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2 text-sm">
                              {/* Batch Number with QR Code indicator */}
                              <div className="flex items-center gap-2">
                                <span><strong>Batch:</strong> {item.batchNumber}</span>
                                {item.batchControl?.traceabilityCode && (
                                  <Badge variant="outline" className="text-xs">
                                    <Package className="h-3 w-3 mr-1" />
                                    QR
                                  </Badge>
                                )}
                              </div>

                              {/* Date and Expiry */}
                              <div><strong>Date:</strong> {item.purchaseDate || item.productionDate}</div>
                              {item.expiryDate && (
                                <div><strong>Expires:</strong> {item.expiryDate}</div>
                              )}

                              {/* Quality Status */}
                              {(() => {
                                const qualityStatus = getQualityStatus(item);
                                return (
                                  <Badge className={qualityStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                                                  qualityStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                                                  'bg-red-100 text-red-800'}>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    {qualityStatus.status === 'current' ? 'QC Current' :
                                     qualityStatus.status === 'due_soon' ? 'QC Due Soon' :
                                     'QC Overdue'}
                                  </Badge>
                                );
                              })()}

                              {/* Compliance Status */}
                              {(() => {
                                const compliance = getComplianceStatus(item);
                                return (
                                  <Badge className={compliance.status === 'compliant' ? 'bg-blue-100 text-blue-800' :
                                                  compliance.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                                  'bg-red-100 text-red-800'}>
                                    <Archive className="h-3 w-3 mr-1" />
                                    {compliance.count}/{compliance.total} Certs
                                  </Badge>
                                );
                              })()}

                              {/* Aging Status */}
                              {item.aging && (
                                <Badge className={item.aging.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                                  <Timer className="h-3 w-3 mr-1" />
                                  {item.aging.status}
                                </Badge>
                              )}

                              {/* Batch Age */}
                              {(() => {
                                const age = calculateBatchAge(item);
                                return age ? (
                                  <div className="text-xs text-gray-600">
                                    Age: {age.formatted}
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {item.currentStock} {item.stockUnit}
                                </span>
                                <Badge className={
                                  stockStatus === 'low' ? 'bg-red-100 text-red-800' :
                                  stockStatus === 'high' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }>
                                  {stockStatus === 'low' ? 'Low Stock' :
                                   stockStatus === 'high' ? 'Overstock' : 'Normal'}
                                </Badge>
                              </div>
                              {item.reservedStock > 0 && (
                                <div className="text-sm text-gray-600">
                                  Reserved: {item.reservedStock} {item.stockUnit}
                                </div>
                              )}
                              <div className="text-sm text-gray-600">
                                Available: {item.availableStock} {item.stockUnit}
                              </div>
                              {/* Unit Conversions */}
                              <div className="text-xs text-gray-500">
                                {item.conversionOptions?.map((conversion, idx) => (
                                  <div key={idx}>
                                    ≈ {(item.currentStock * conversion.factor).toFixed(2)} {conversion.unit}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {viewMode === 'by-location' && selectedLocation !== 'all' ? (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">{item.binLocation || 'N/A'}</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {item.locationStock ? (
                                  Object.entries(item.locationStock).map(([locationId, locationData]: [string, any]) => {
                                    const location = storeLocations.find(loc => loc.id === locationId);
                                    if (!location || locationData.currentStock === 0) return null;

                                    return (
                                      <div key={locationId} className="flex items-center justify-between text-xs p-1 bg-gray-50 rounded">
                                        <div className="flex items-center space-x-1">
                                          <MapPin className="h-3 w-3 text-gray-400" />
                                          <span>{location.name}</span>
                                        </div>
                                        <span className="font-medium text-blue-600">
                                          {locationData.currentStock} {item.stockUnit}
                                        </span>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3 text-gray-400" />
                                    <span className="text-sm">{item.location}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {viewMode === 'by-location' && selectedLocation !== 'all' ? (
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Retail:</span>
                                  <span className="font-medium">AED {getLocationPrice(item, selectedLocation, 'retail').toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Wholesale:</span>
                                  <span className="font-medium">AED {getLocationPrice(item, selectedLocation, 'wholesale').toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">VIP:</span>
                                  <span className="font-medium">AED {getLocationPrice(item, selectedLocation, 'vip').toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Corporate:</span>
                                  <span className="font-medium">AED {getLocationPrice(item, selectedLocation, 'corporate').toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Distributor:</span>
                                  <span className="font-medium">AED {getLocationPrice(item, selectedLocation, 'distributor').toLocaleString()}</span>
                                </div>
                                <div className="text-xs text-green-600 mt-1">
                                  Margin: {getMarginAnalysis(item, selectedLocation)?.retailMargin || 0}%
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm">
                                <div className="font-medium">From AED {Math.min(...Object.values(item.locationPricing || {}).map((loc: any) => loc.retail || 0)).toLocaleString()}</div>
                                <div className="text-gray-600 text-xs">5-tier pricing • {Object.keys(item.locationPricing || {}).length} locations</div>
                                <div className="text-xs text-blue-600">
                                  {item.pricingFeatures?.volumeDiscountEligible && '📊 Volume discounts'}
                                  {item.pricingFeatures?.seasonalPricingEligible && ' 🎯 Seasonal pricing'}
                                  {item.pricingFeatures?.loyaltyPointsEligible && ' ⭐ Loyalty points'}
                                </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">AED {stockValue.toLocaleString()}</div>
                              <div className="text-gray-600">
                                @ AED {(item.purchaseCost || item.productionCost || 0).toLocaleString()}/{item.stockUnit}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsTransferDialogOpen(true);
                                }}
                                title="Transfer Stock"
                              >
                                <ArrowRightLeft className="h-3 w-3" />
                              </Button>
                              {item.batchControl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    // Open batch traceability dialog
                                  }}
                                  title="View Batch Traceability"
                                >
                                  <Package className="h-3 w-3" />
                                </Button>
                              )}
                              {item.transformations && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setIsTransformDialogOpen(true);
                                  }}
                                >
                                  <FlaskConical className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Batch Control & Traceability Tab */}
        <TabsContent value="batches" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Batch Overview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-amber-600" />
                    Batch Control & Traceability
                  </CardTitle>
                  <CardDescription>
                    Comprehensive batch tracking from origin to finished product with full traceability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Active Batches Overview */}
                    <div>
                      <h4 className="font-medium mb-4">Active Batches</h4>
                      <div className="space-y-3">
                        {batchTrackingData.map((batch) => {
                          const qualityStatus = getQualityStatus({ batchControl: { lastQualityCheck: '2024-09-25', nextQualityCheck: '2024-10-10' } });
                          const compliance = getComplianceStatus({ batchControl: { complianceCerts: ['HAL-UAE-2024-0156', 'ESMA-2024-CAM-001'] } });

                          return (
                            <Card key={batch.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="font-medium text-lg">{batch.batchNumber}</div>
                                    <Badge className="bg-blue-100 text-blue-800">{batch.status}</Badge>
                                    <Badge variant="outline">{batch.qrCode}</Badge>
                                  </div>
                                  <div className="text-sm text-gray-600 mb-2">{batch.itemName}</div>

                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">Quantity:</span>
                                      <span className="font-medium ml-2">{batch.totalQuantity} {batch.unit}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Location:</span>
                                      <span className="font-medium ml-2">
                                        {storeLocations.find(loc => loc.id === batch.currentLocation)?.name || 'Unknown'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Created:</span>
                                      <span className="font-medium ml-2">{batch.createdDate}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Grade:</span>
                                      <span className="font-medium ml-2">{batch.qualityData?.grade || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Quality and Compliance Status */}
                              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">Quality Status</div>
                                  <Badge className={qualityStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                                                  qualityStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                                                  'bg-red-100 text-red-800'}>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    {qualityStatus.status === 'current' ? 'Current' :
                                     qualityStatus.status === 'due_soon' ? 'Due Soon' : 'Overdue'}
                                  </Badge>
                                  {batch.qualityData?.overallScore && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      Score: {batch.qualityData.overallScore}/100
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">Compliance</div>
                                  <Badge className={compliance.status === 'compliant' ? 'bg-blue-100 text-blue-800' :
                                                  compliance.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                                  'bg-red-100 text-red-800'}>
                                    <Archive className="h-3 w-3 mr-1" />
                                    {compliance.count}/{compliance.total} Certs
                                  </Badge>
                                  {batch.compliance && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      Halal: {batch.compliance.halalCertified ? '✓' : '✗'}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Traceability Chain */}
                              {batch.parentBatches && batch.parentBatches.length > 0 && (
                                <div className="mt-3 pt-3 border-t">
                                  <div className="text-xs text-gray-600 mb-2">Traceability Chain:</div>
                                  <div className="flex items-center space-x-2 text-xs">
                                    {batch.parentBatches.map((parentBatch, idx) => (
                                      <div key={idx} className="flex items-center">
                                        <Badge variant="outline" className="text-xs">{parentBatch}</Badge>
                                        {idx < batch.parentBatches.length - 1 && (
                                          <ArrowRightLeft className="h-3 w-3 mx-1 text-gray-400" />
                                        )}
                                      </div>
                                    ))}
                                    <ArrowRightLeft className="h-3 w-3 mx-1 text-gray-400" />
                                    <Badge className="bg-amber-100 text-amber-800 text-xs">{batch.batchNumber}</Badge>
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex space-x-2 mt-4">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Full Trace
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-3 w-3 mr-1" />
                                  QR Code
                                </Button>
                                <Button size="sm" variant="outline">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  QC Test
                                </Button>
                                {batch.status === 'active' && (
                                  <Button size="sm" variant="outline">
                                    <FlaskConical className="h-3 w-3 mr-1" />
                                    Transform
                                  </Button>
                                )}
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    {/* Batch Creation Workflow */}
                    <div>
                      <h4 className="font-medium mb-4">Create New Batch</h4>
                      <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Item Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select item" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="raw">Raw Material</SelectItem>
                                <SelectItem value="semi">Semi-Finished</SelectItem>
                                <SelectItem value="finished">Finished Product</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Origin/Source</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select origin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cambodia">Cambodia</SelectItem>
                                <SelectItem value="india">India</SelectItem>
                                <SelectItem value="myanmar">Myanmar</SelectItem>
                                <SelectItem value="uae">UAE</SelectItem>
                                <SelectItem value="syria">Syria</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Quantity</Label>
                            <Input type="number" placeholder="0.00" />
                          </div>
                          <div>
                            <Label>Unit</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gram">Gram</SelectItem>
                                <SelectItem value="kilogram">Kilogram</SelectItem>
                                <SelectItem value="tola">Tola</SelectItem>
                                <SelectItem value="milliliter">Milliliter</SelectItem>
                                <SelectItem value="piece">Piece</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mb-4">
                          <Label>Initial Location</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {storeLocations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full bg-amber-600 hover:bg-amber-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Batch with QR Code
                        </Button>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Batch Control Tools */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Batch Control Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Package className="h-4 w-4 mr-2" />
                      Generate Batch Number
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Batch Genealogy
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Quality Control
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Compliance Check
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      QR Code Labels
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Batch Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quality Control Summary */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">QC Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tests Due Today:</span>
                      <Badge className="bg-orange-100 text-orange-800">3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overdue Tests:</span>
                      <Badge className="bg-red-100 text-red-800">1</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passed This Week:</span>
                      <Badge className="bg-green-100 text-green-800">15</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Score:</span>
                      <span className="font-medium">89.2/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Status */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Compliance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Halal Certified:</span>
                      <Badge className="bg-green-100 text-green-800">98%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ESMA Approved:</span>
                      <Badge className="bg-green-100 text-green-800">95%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Origin Verified:</span>
                      <Badge className="bg-blue-100 text-blue-800">100%</Badge>
                    </div>
                    <div className="text-xs text-gray-600 mt-3">
                      Next audit: December 15, 2024
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Batch Traceability Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Batch Traceability Matrix</CardTitle>
              <CardDescription>
                Complete origin-to-shelf tracking with quality and compliance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Batch Number</th>
                      <th className="text-left p-2">Item</th>
                      <th className="text-left p-2">Origin</th>
                      <th className="text-left p-2">Quality Grade</th>
                      <th className="text-left p-2">QC Status</th>
                      <th className="text-left p-2">Compliance</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchTrackingData.map((batch) => (
                      <tr key={batch.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="font-medium">{batch.batchNumber}</div>
                          <div className="text-xs text-gray-600">{batch.qrCode}</div>
                        </td>
                        <td className="p-2">
                          <div>{batch.itemName}</div>
                          <div className="text-xs text-gray-600">{batch.totalQuantity} {batch.unit}</div>
                        </td>
                        <td className="p-2">
                          <div>{batch.origin?.country || 'N/A'}</div>
                          <div className="text-xs text-gray-600">{batch.origin?.region || ''}</div>
                        </td>
                        <td className="p-2">
                          <Badge className="bg-amber-100 text-amber-800">
                            {batch.qualityData?.grade || 'N/A'}
                          </Badge>
                          {batch.qualityData?.overallScore && (
                            <div className="text-xs text-gray-600 mt-1">
                              {batch.qualityData.overallScore}/100
                            </div>
                          )}
                        </td>
                        <td className="p-2">
                          <Badge className="bg-green-100 text-green-800">Current</Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex flex-col space-y-1">
                            {batch.compliance?.halalCertified && (
                              <Badge variant="outline" className="text-xs">Halal</Badge>
                            )}
                            {batch.compliance?.originCertificate && (
                              <Badge variant="outline" className="text-xs">Origin</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          {storeLocations.find(loc => loc.id === batch.currentLocation)?.name || 'Unknown'}
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comprehensive Pricing Management Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pricing Overview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                    Multi-Tier Pricing System
                  </CardTitle>
                  <CardDescription>
                    Comprehensive pricing across customer types, locations, and dynamic rules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Customer Type Pricing */}
                    <div>
                      <h4 className="font-medium mb-4">Customer Tier Pricing</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(customerTypes).map(([key, customerType]) => (
                          <Card key={key} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="font-medium">{customerType.name}</div>
                                <div className="text-sm text-gray-600">{customerType.nameArabic}</div>
                              </div>
                              <Badge className={key === 'retail' ? 'bg-blue-100 text-blue-800' :
                                              key === 'wholesale' ? 'bg-green-100 text-green-800' :
                                              key === 'vip' ? 'bg-purple-100 text-purple-800' :
                                              key === 'distributor' ? 'bg-orange-100 text-orange-800' :
                                              'bg-gray-100 text-gray-800'}>
                                {customerType.discount}% off
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Min Order:</span>
                                <span className="font-medium">AED {customerType.minOrderValue.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Payment Terms:</span>
                                <span className="font-medium">{customerType.paymentTerms}</span>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="text-xs text-gray-600 mb-1">Benefits:</div>
                              <div className="flex flex-wrap gap-1">
                                {customerType.benefits.map((benefit, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Volume Discounts */}
                    <div>
                      <h4 className="font-medium mb-4">Volume Discount Tiers</h4>
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {pricingRules.volumeDiscounts.map((tier, idx) => (
                            <div key={idx} className="text-center">
                              <div className="text-lg font-bold text-green-600">{tier.discount}%</div>
                              <div className="text-sm text-gray-600">
                                {tier.minQuantity}-{tier.maxQuantity} pcs
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Seasonal Pricing */}
                    <div>
                      <h4 className="font-medium mb-4">Seasonal Promotions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(pricingRules.seasonalPricing).map(([key, season]) => (
                          <Card key={key} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{season.name}</div>
                              <Badge className="bg-red-100 text-red-800">{season.discount}% off</Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">{season.nameArabic}</div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Period:</span>
                                <span>{season.startDate} to {season.endDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Min Order:</span>
                                <span>AED {season.minOrderValue}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Items:</span>
                                <span>{season.applicableItems.length} products</span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Currency Support */}
                    <div>
                      <h4 className="font-medium mb-4">Multi-Currency Support</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {Object.entries(pricingRules.currencyRates.rates).map(([currency, rate]) => (
                            <div key={currency} className="flex justify-between">
                              <span className="font-medium">{currency}:</span>
                              <span>{rate} AED</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          Last updated: {pricingRules.currencyRates.lastUpdated}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Tools */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pricing Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Select Item</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose product" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Location</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {storeLocations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Customer Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Customer tier" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(customerTypes).map(([key, type]) => (
                            <SelectItem key={key} value={key}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Quantity</Label>
                      <Input type="number" placeholder="1" defaultValue="1" />
                    </div>

                    <div>
                      <Label>Currency</Label>
                      <Select defaultValue="AED">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED">AED</SelectItem>
                          {Object.keys(pricingRules.currencyRates.rates).map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full bg-amber-600 hover:bg-amber-700">
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Price
                    </Button>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Final Price:</div>
                      <div className="text-xl font-bold text-green-600">AED 450.00</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Includes 5% VAT • Base: AED 400 • Discount: 10%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Quick Actions */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Pricing Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Update Prices
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Customer Tiers
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Setup Promotions
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Pricing Analytics
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Price List
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tax Information */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Tax Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">UAE VAT:</span>
                      <span className="font-medium">{pricingRules.taxRates.vat.rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Import Duty:</span>
                      <span className="font-medium">{pricingRules.taxRates.importDuty.rate}%</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      VAT applies to all sales. Import duty exempt for UAE-origin products.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pricing Matrix Table */}
          <Card>
            <CardHeader>
              <CardTitle>Location-Customer Pricing Matrix</CardTitle>
              <CardDescription>
                Compare pricing across all locations and customer tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Select Product:</Label>
                  <Select defaultValue="FIN001">
                    <SelectTrigger className="w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sample pricing matrix for Royal Oud Premium */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Location</th>
                        <th className="text-right p-2">Retail</th>
                        <th className="text-right p-2">Wholesale</th>
                        <th className="text-right p-2">VIP</th>
                        <th className="text-right p-2">Corporate</th>
                        <th className="text-right p-2">Distributor</th>
                        <th className="text-right p-2">Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeLocations.slice(0, 3).map((location) => {
                        const sampleItem = inventoryItems[2]; // Royal Oud Premium
                        const locationPricing = sampleItem.locationPricing?.[location.id];
                        if (!locationPricing) return null;

                        return (
                          <tr key={location.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{location.name}</td>
                            <td className="p-2 text-right">AED {locationPricing.retail}</td>
                            <td className="p-2 text-right">AED {locationPricing.wholesale}</td>
                            <td className="p-2 text-right">AED {locationPricing.vip}</td>
                            <td className="p-2 text-right">AED {locationPricing.corporate}</td>
                            <td className="p-2 text-right">AED {locationPricing.distributor}</td>
                            <td className="p-2 text-right text-green-600">{locationPricing.margin}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Transfers Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transfer Requests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRightLeft className="h-5 w-5 text-amber-600" />
                      Transfer Requests
                    </CardTitle>
                    <CardDescription>
                      Manage inter-location stock transfer requests and approvals
                    </CardDescription>
                  </div>
                  <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
                    <Plus className="h-4 w-4" />
                    New Request
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transferRequests.map((request) => (
                    <div key={request.id} className={`p-4 border rounded-lg ${
                      request.status === 'Pending Manager Approval' ? 'border-orange-200 bg-orange-50' :
                      request.status === 'Approved' ? 'border-green-200 bg-green-50' :
                      'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium">{request.id}</div>
                          <div className="text-sm text-gray-600">
                            {storeLocations.find(loc => loc.id === request.fromLocation)?.name} → {storeLocations.find(loc => loc.id === request.toLocation)?.name}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            request.priority === 'High' ? 'bg-red-100 text-red-800' :
                            request.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {request.priority}
                          </Badge>
                          <Badge variant="outline">
                            {request.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {request.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm p-2 bg-white rounded border">
                            <span>{item.itemName}</span>
                            <span className="font-medium">{item.requestedQuantity} {item.unit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Requested by:</span>
                          <div className="font-medium">{request.requestedBy}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Expected delivery:</span>
                          <div className="font-medium">{request.expectedDeliveryDate}</div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <strong>Justification:</strong> {request.justification}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Est. Cost: AED {request.totalEstimatedCost}
                        </span>
                        <div className="space-x-2">
                          {request.status === 'Pending Manager Approval' && (
                            <>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                                <X className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                            </>
                          )}
                          {request.status === 'Approved' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Truck className="h-3 w-3 mr-1" />
                              Process Transfer
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Transfer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-600" />
                  Quick Transfer
                </CardTitle>
                <CardDescription>
                  Create instant transfers between locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>From Location</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {storeLocations.filter(loc => loc.allowTransferFrom).map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>To Location</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {storeLocations.filter(loc => loc.allowTransferTo).map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Select Item</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose item to transfer" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Quantity</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Reason</Label>
                    <Textarea placeholder="Reason for transfer..." />
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      Save as Draft
                    </Button>
                    <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                      Submit Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transfer Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Monthly Transfers</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {stockMovements.filter(mov => mov.type.includes('Transfer')).length}
                  </div>
                  <div className="text-sm text-blue-600">+15% vs last month</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Avg Transfer Time</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">2.3 days</div>
                  <div className="text-sm text-orange-600">Within SLA</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Transfer Cost</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">AED 890</div>
                  <div className="text-sm text-green-600">-8% vs last month</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">98.5%</div>
                  <div className="text-sm text-purple-600">Above target</div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Movements Tab */}
        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Stock Movements</CardTitle>
                  <CardDescription>
                    Track all inventory movements and transactions
                  </CardDescription>
                </div>
                <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Record Movement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Record Stock Movement</DialogTitle>
                      <DialogDescription>
                        Record goods receipt, issue, transfer, or adjustment
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Movement Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="receipt">Goods Receipt</SelectItem>
                              <SelectItem value="issue">Goods Issue</SelectItem>
                              <SelectItem value="transfer">Store Transfer</SelectItem>
                              <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                              <SelectItem value="production">Production Use</SelectItem>
                              <SelectItem value="wastage">Wastage/Shrinkage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Item</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {inventoryItems.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Quantity</Label>
                          <Input type="number" placeholder="0.00" />
                        </div>
                        <div>
                          <Label>Unit</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gram">Gram</SelectItem>
                              <SelectItem value="tola">Tola</SelectItem>
                              <SelectItem value="milliliter">Milliliter</SelectItem>
                              <SelectItem value="piece">Piece</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Cost (AED)</Label>
                          <Input type="number" placeholder="0.00" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>From Location</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="From" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="supplier">Supplier</SelectItem>
                              {storeLocations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>To Location</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="To" />
                            </SelectTrigger>
                            <SelectContent>
                              {storeLocations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Reference/Notes</Label>
                        <Textarea placeholder="Purchase order, production batch, or other reference" />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsMovementDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsMovementDialogOpen(false)}>
                          Record Movement
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>From → To</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Operator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>{movement.date}</TableCell>
                        <TableCell>
                          <Badge className={
                            movement.type === 'Goods Receipt' ? 'bg-green-100 text-green-800' :
                            movement.type === 'Production Issue' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }>
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{movement.item}</TableCell>
                        <TableCell>
                          {movement.quantity} {movement.unit}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{movement.fromLocation}</span>
                            <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{movement.toLocation}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{movement.reference}</div>
                            {movement.notes && (
                              <div className="text-sm text-gray-600">{movement.notes}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{movement.operator}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transformations Tab */}
        <TabsContent value="transformations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Raw → Finished Goods Transformations</CardTitle>
              <CardDescription>
                Manage product transformations and multi-output processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Example Transformation Flows:</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-blue-100 text-blue-800">Raw Oud (1 kg)</Badge>
                      <ArrowRightLeft className="h-4 w-4" />
                      <div className="flex space-x-2">
                        <Badge className="bg-green-100 text-green-800">Chips (300g)</Badge>
                        <Badge className="bg-green-100 text-green-800">Powder (500g)</Badge>
                        <Badge className="bg-green-100 text-green-800">Dust (200g)</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-green-100 text-green-800">Powder (500g)</Badge>
                      <ArrowRightLeft className="h-4 w-4" />
                      <Badge className="bg-purple-100 text-purple-800">Oud Oil (50ml)</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        <Badge className="bg-purple-100 text-purple-800">Oud Oil (50ml)</Badge>
                        <Badge className="bg-pink-100 text-pink-800">Rose Oil (10ml)</Badge>
                        <Badge className="bg-gray-100 text-gray-800">Carrier (40ml)</Badge>
                      </div>
                      <ArrowRightLeft className="h-4 w-4" />
                      <Badge className="bg-amber-100 text-amber-800">Royal Blend (100ml)</Badge>
                    </div>
                  </div>
                </div>

                {/* Transformation Dialog */}
                <Dialog open={isTransformDialogOpen} onOpenChange={setIsTransformDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Factory className="h-4 w-4 mr-2" />
                      Start New Transformation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Product Transformation</DialogTitle>
                      <DialogDescription>
                        Transform raw materials into semi-finished or finished goods
                      </DialogDescription>
                    </DialogHeader>
                    {selectedItem && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Source Item:</h4>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">{selectedItem.name}</span>
                            <Badge>{selectedItem.category}</Badge>
                            <span>Available: {selectedItem.availableStock} {selectedItem.stockUnit}</span>
                          </div>
                        </div>

                        {selectedItem.transformations?.map((transformation: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-4">
                              {transformation.type === 'segregation' ? 'Segregation Process' : 'Blending Process'}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label className="text-sm font-medium">Input Quantity</Label>
                                <div className="flex space-x-2 mt-2">
                                  <Input type="number" placeholder="Quantity" />
                                  <span className="flex items-center px-3 text-sm border rounded">
                                    {selectedItem.stockUnit}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Expected Outputs</Label>
                                <div className="space-y-2 mt-2">
                                  {transformation.outputs?.map((output: any, outputIndex: number) => (
                                    <div key={outputIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                      <span className="text-sm">{output.name}</span>
                                      <span className="text-sm font-medium">
                                        {output.percentage}% ({output.unit})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-2">
                              <Button variant="outline">
                                Calculate Output
                              </Button>
                              <Button>
                                Execute Transformation
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {/* Production Integration Workflows */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Factory className="h-5 w-5 text-blue-600" />
                    Production Integration Workflows
                  </h3>
                  <div className="space-y-6">

                    {/* Active Production Orders */}
                    <div>
                      <h4 className="font-medium mb-3">Active Production Orders</h4>
                      <div className="space-y-3">
                        {currentProductionOrders.map((order) => {
                          const progress = getProductionStageProgress(order.id);
                          const efficiency = getProductionEfficiency(order.id);
                          const impact = calculateInventoryImpact(order.id);

                          return (
                            <Card key={order.id} className="p-4">
                              <div className="space-y-4">
                                {/* Order Header */}
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Badge className={`${
                                        order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {order.status.replace('_', ' ').toUpperCase()}
                                      </Badge>
                                      <Badge variant="outline">{order.priority.toUpperCase()}</Badge>
                                    </div>
                                    <h5 className="font-medium mt-1">{order.productName}</h5>
                                    <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-semibold">{order.targetQuantity} {order.targetUnit}</div>
                                    <p className="text-sm text-gray-600">Target Production</p>
                                  </div>
                                </div>

                                {/* Production Progress */}
                                {progress && (
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium">Production Progress</span>
                                      <span className="text-sm text-gray-600">{progress.progress}% Complete</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress.progress}%` }}
                                      ></div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-sm">
                                      <span className="text-gray-600">
                                        Current: {progress.stageDetails.nameArabic}
                                      </span>
                                      {progress.nextStage && (
                                        <span className="text-blue-600">
                                          Next: {productionIntegration.productionStages[progress.nextStage].nameArabic}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Material Consumption */}
                                <div>
                                  <h6 className="font-medium mb-2 flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Material Consumption & Inventory Impact
                                  </h6>
                                  <div className="space-y-2">
                                    {impact?.reservedMaterials.map((material) => (
                                      <div key={material.materialId} className="flex items-center justify-between p-2 bg-white rounded border">
                                        <div className="flex items-center gap-3">
                                          <div className={`w-3 h-3 rounded-full ${
                                            material.impactLevel === 'critical' ? 'bg-red-500' :
                                            material.impactLevel === 'warning' ? 'bg-yellow-500' :
                                            'bg-green-500'
                                          }`}></div>
                                          <span className="text-sm font-medium">{material.materialName}</span>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-sm">
                                            {material.plannedQuantity} {material.unit} reserved
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            {material.availableAfterReservation} {material.unit} remaining
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Production Efficiency */}
                                {efficiency && (
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                      <span className="text-sm font-medium">Production Efficiency</span>
                                      <p className="text-xs text-gray-600">Material utilization vs planned</p>
                                    </div>
                                    <div className="text-right">
                                      <div className={`text-lg font-semibold ${
                                        efficiency.status === 'excellent' ? 'text-green-600' :
                                        efficiency.status === 'good' ? 'text-blue-600' :
                                        efficiency.status === 'poor' ? 'text-red-600' :
                                        'text-gray-600'
                                      }`}>
                                        {efficiency.efficiency}%
                                      </div>
                                      <div className="text-xs text-gray-600 capitalize">
                                        {efficiency.status}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Timeline */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                  <span>Started: {new Date(order.startDate).toLocaleDateString()}</span>
                                  <span>Expected: {new Date(order.expectedCompletion).toLocaleDateString()}</span>
                                  <span>Craftsman: {order.masterCraftsman}</span>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    {/* Production Stage Overview */}
                    <div>
                      <h4 className="font-medium mb-3">Production Stages & Inventory Impact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(productionIntegration.productionStages).map(([stageKey, stage]) => (
                          <Card key={stageKey} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium capitalize">{stageKey.replace('_', ' ')}</h5>
                                <Badge variant="outline">{stage.wastageRate}% Wastage</Badge>
                              </div>
                              <div className="text-sm text-gray-600">{stage.nameArabic}</div>
                              <div className="text-sm">
                                <div className="flex justify-between">
                                  <span>Duration:</span>
                                  <span className="font-medium">{stage.duration}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Material Efficiency:</span>
                                  <span className={`font-medium ${stage.wastageRate <= 3 ? 'text-green-600' : stage.wastageRate <= 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {100 - stage.wastageRate}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div
                                    className={`h-1 rounded-full ${stage.wastageRate <= 3 ? 'bg-green-500' : stage.wastageRate <= 7 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${100 - stage.wastageRate}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Material Consumption Types */}
                    <div>
                      <h4 className="font-medium mb-3">Material Consumption Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(productionIntegration.materialConsumptionTypes).map(([typeKey, type]) => (
                          <Card key={typeKey} className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">{type.name}</h5>
                                <div className="flex gap-2">
                                  {type.autoDeduct && (
                                    <Badge className="bg-blue-100 text-blue-800 text-xs">Auto Deduct</Badge>
                                  )}
                                  {type.trackWastage && (
                                    <Badge className="bg-orange-100 text-orange-800 text-xs">Track Wastage</Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{type.description}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Automation Rules Status */}
                    <div>
                      <h4 className="font-medium mb-3">Production Automation Rules</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${productionIntegration.automationRules.stockReservation.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium">Stock Reservation</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {productionIntegration.automationRules.stockReservation.reservationPeriod} days auto-reserve
                          </p>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${productionIntegration.automationRules.materialDeduction.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium">Auto Deduction</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {productionIntegration.automationRules.materialDeduction.includeWastage ? 'Include' : 'Exclude'} wastage
                          </p>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${productionIntegration.automationRules.qualityCheckTriggers.autoCreateQCTasks ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium">QC Automation</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Auto-create quality tasks
                          </p>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${productionIntegration.automationRules.inventoryAlerts.lowStockWarning ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium">Stock Alerts</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Real-time monitoring
                          </p>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Procurement & Vendor Management Tab */}
        <TabsContent value="procurement" className="space-y-4">
          {/* UAE Import Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-600" />
                UAE Import & Procurement Dashboard
              </CardTitle>
              <CardDescription>
                Real-time tracking of purchase orders, customs clearance, and vendor performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Active POs</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {currentPurchaseOrders.filter(po => !['delivered', 'cancelled'].includes(po.status)).length}
                  </div>
                  <div className="text-sm text-blue-600">
                    AED {currentPurchaseOrders.filter(po => !['delivered', 'cancelled'].includes(po.status)).reduce((sum, po) => sum + (po.currency === 'AED' ? po.totalValue : po.totalValue * 3.67), 0).toLocaleString()}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">In Customs</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {currentPurchaseOrders.filter(po => po.status === 'customs_clearance').length}
                  </div>
                  <div className="text-sm text-orange-600">Clearance pending</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Delivered This Month</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {currentPurchaseOrders.filter(po => po.status === 'delivered').length}
                  </div>
                  <div className="text-sm text-green-600">100% on time</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Import Duties Paid</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">AED 4,434</div>
                  <div className="text-sm text-purple-600">This month</div>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Purchase Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  Active Purchase Orders
                </CardTitle>
                <CardDescription>
                  Real-time tracking with UAE customs clearance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPurchaseOrders.filter(po => !['delivered', 'cancelled'].includes(po.status)).map((po) => {
                    const compliance = getDocumentComplianceStatus(po);

                    return (
                      <Card key={po.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-medium">{po.poNumber}</div>
                            <div className="text-sm text-gray-600">{po.vendorName}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={po.priority === 'high' ? 'bg-red-100 text-red-800' :
                                            po.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                                            'bg-green-100 text-green-800'}>
                              {po.priority}
                            </Badge>
                            <Badge className={po.status === 'customs_clearance' ? 'bg-yellow-100 text-yellow-800' :
                                            po.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                            po.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'}>
                              {po.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Order Date:</span>
                            <div className="font-medium">{po.orderDate}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Expected:</span>
                            <div className="font-medium">{po.expectedDelivery}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Value:</span>
                            <div className="font-medium">{po.currency} {po.totalValue.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Items:</span>
                            <div className="font-medium">{po.items.length} line items</div>
                          </div>
                        </div>

                        {/* Import Details */}
                        {po.importDetails && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <div className="text-xs font-medium text-blue-800 mb-2">Import Status</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">Port:</span>
                                <span className="font-medium ml-1">{po.importDetails.portOfEntry}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Customs:</span>
                                <span className="font-medium ml-1">{po.importDetails.customsDeclaration || 'Pending'}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Duty:</span>
                                <span className="font-medium ml-1">AED {po.importDetails.importDuty}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">VAT:</span>
                                <span className="font-medium ml-1">AED {po.importDetails.vat}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="text-xs text-gray-600 mb-1">Documents:</div>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(po.importDetails.documentsStatus).map(([doc, status]) => (
                                  <Badge key={doc} variant="outline" className={`text-xs ${
                                    status === 'approved' ? 'border-green-500 text-green-700' :
                                    status === 'pending' ? 'border-orange-500 text-orange-700' :
                                    'border-gray-500 text-gray-700'
                                  }`}>
                                    {doc.replace('_', ' ')}: {status}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Documents
                          </Button>
                          {po.importDetails?.trackingNumber && (
                            <Button size="sm" variant="outline">
                              <Truck className="h-3 w-3 mr-1" />
                              Track
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}

                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Purchase Order
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* UAE Import Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-amber-600" />
                  UAE Import Requirements
                </CardTitle>
                <CardDescription>
                  Regulatory compliance for perfume & oud imports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Required Documents */}
                  <div>
                    <h4 className="font-medium mb-3">Required Documents</h4>
                    <div className="space-y-2">
                      {procurementSystem.uaeImportRegulations.requiredDocuments.filter(doc => doc.required).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="text-sm font-medium">{doc.name}</div>
                            <div className="text-xs text-gray-600">{doc.authority}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duty Rates */}
                  <div>
                    <h4 className="font-medium mb-3">Import Duty Rates</h4>
                    <div className="space-y-2">
                      {Object.entries(procurementSystem.uaeImportRegulations.dutyRates).map(([category, info]) => (
                        <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="text-sm font-medium capitalize">{category.replace('_', ' ')}</div>
                            <div className="text-xs text-gray-600">{info.description}</div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">{info.rate}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* UAE Ports */}
                  <div>
                    <h4 className="font-medium mb-3">Entry Ports</h4>
                    <div className="space-y-2">
                      {procurementSystem.uaeImportRegulations.ports.map((port) => (
                        <div key={port.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="text-sm font-medium">{port.name}</div>
                            <div className="text-xs text-gray-600">{port.id}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">{port.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clearance Timeframes */}
                  <div>
                    <h4 className="font-medium mb-3">Clearance Timeframes</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-xs text-green-600">Standard</div>
                        <div className="text-sm font-medium">{procurementSystem.uaeImportRegulations.clearanceTimeframes.standard}</div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <div className="text-xs text-blue-600">Expedited</div>
                        <div className="text-sm font-medium">{procurementSystem.uaeImportRegulations.clearanceTimeframes.expedited}</div>
                      </div>
                      <div className="p-2 bg-orange-50 rounded">
                        <div className="text-xs text-orange-600">Complex</div>
                        <div className="text-sm font-medium">{procurementSystem.uaeImportRegulations.clearanceTimeframes.complex}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Procurement Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Procurement Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Pending Orders</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">7</div>
                  <div className="text-sm text-gray-500">AED 45,230</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Monthly Spend</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">AED 89,450</div>
                  <div className="text-sm text-green-600">+12% vs last month</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Avg Lead Time</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">14 days</div>
                  <div className="text-sm text-orange-600">-2 days improved</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Active Suppliers</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">12</div>
                  <div className="text-sm text-purple-600">Avg rating 4.6★</div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Location Overview Cards */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-amber-600" />
                    Store Locations & Warehouses
                  </CardTitle>
                  <CardDescription>
                    Comprehensive multi-location inventory management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {storeLocations.map((location) => {
                      const locationSummary = getLocationStockSummary(location.id);

                      return (
                        <Card key={location.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => {
                                setSelectedLocationDetails(location);
                                setIsLocationDetailsDialogOpen(true);
                              }}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{location.name}</h3>
                                <Badge className={
                                  location.type === 'Warehouse' ? 'bg-blue-100 text-blue-800' :
                                  location.type === 'Retail' ? 'bg-green-100 text-green-800' :
                                  'bg-purple-100 text-purple-800'
                                }>
                                  {location.type}
                                </Badge>
                                <Badge className={location.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {location.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{location.nameArabic}</p>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-3 w-3 text-gray-400" />
                                    <span>{location.address}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Users className="h-3 w-3 text-gray-400" />
                                    <span>{location.manager}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <span>{location.operatingHours}</span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <Package className="h-3 w-3 text-gray-400" />
                                    <span>Capacity: {location.capacity}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Archive className="h-3 w-3 text-gray-400" />
                                    <span>Items: {locationSummary.totalItems}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="h-3 w-3 text-gray-400" />
                                    <span>Value: AED {locationSummary.totalValue.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Location Performance Indicators */}
                          <div className="mt-4 pt-3 border-t">
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-4">
                                {locationSummary.lowStockItems > 0 && (
                                  <Badge className="bg-red-100 text-red-800">
                                    {locationSummary.lowStockItems} Low Stock
                                  </Badge>
                                )}
                                {location.type === 'Retail' && location.salesMetrics && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    {((location.salesMetrics.currentMonthSales / location.salesMetrics.monthlyTarget) * 100).toFixed(0)}% Target
                                  </Badge>
                                )}
                                {location.type === 'Production' && location.productionMetrics && (
                                  <Badge className="bg-purple-100 text-purple-800">
                                    {location.productionMetrics.efficiencyRate}% Efficiency
                                  </Badge>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                                <Button size="sm" variant="outline">
                                  <ArrowRightLeft className="h-3 w-3 mr-1" />
                                  Transfer
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Location Quick Stats */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Location Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Top Performing Location */}
                    <div>
                      <h4 className="font-medium mb-2">Top Value Location</h4>
                      {(() => {
                        const topLocation = storeLocations.reduce((top, location) => {
                          const summary = getLocationStockSummary(location.id);
                          const topSummary = getLocationStockSummary(top.id);
                          return summary.totalValue > topSummary.totalValue ? location : top;
                        });
                        const summary = getLocationStockSummary(topLocation.id);

                        return (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="font-medium">{topLocation.name}</div>
                            <div className="text-sm text-green-600">AED {summary.totalValue.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">{summary.totalItems} items</div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Locations Needing Attention */}
                    <div>
                      <h4 className="font-medium mb-2">Attention Needed</h4>
                      <div className="space-y-2">
                        {storeLocations.map(location => {
                          const summary = getLocationStockSummary(location.id);
                          if (summary.lowStockItems === 0) return null;

                          return (
                            <div key={location.id} className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                              <div className="font-medium">{location.name}</div>
                              <div className="text-red-600">{summary.lowStockItems} low stock items</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Location Types Distribution */}
                    <div>
                      <h4 className="font-medium mb-2">Location Types</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Retail Stores</span>
                          <span className="font-medium">{storeLocations.filter(loc => loc.type === 'Retail').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Warehouses</span>
                          <span className="font-medium">{storeLocations.filter(loc => loc.type === 'Warehouse').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Production</span>
                          <span className="font-medium">{storeLocations.filter(loc => loc.type === 'Production').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Location
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Bulk Transfer
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Location Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Location Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {/* Advanced Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Total Stock Value</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                AED {inventoryItems.reduce((sum, item) => sum + calculateStockValue(item), 0).toLocaleString()}
              </div>
              <div className="text-sm text-green-600">+8.5% vs last month</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Inventory Turnover</span>
              </div>
              <div className="text-2xl font-bold mt-1">4.2x</div>
              <div className="text-sm text-blue-600">Above industry avg</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600">Avg Days on Hand</span>
              </div>
              <div className="text-2xl font-bold mt-1">87 days</div>
              <div className="text-sm text-orange-600">Within target range</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Archive className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">Dead Stock Value</span>
              </div>
              <div className="text-2xl font-bold mt-1">AED 2,340</div>
              <div className="text-sm text-purple-600">1.2% of total</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Value by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                  Stock Value Analysis
                </CardTitle>
                <CardDescription>Breakdown by product categories and stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Raw Material', 'Semi-Finished', 'Finished Goods'].map((category) => {
                    const categoryItems = inventoryItems.filter(item => item.category === category);
                    const totalValue = categoryItems.reduce((sum, item) => sum + calculateStockValue(item), 0);
                    const percentage = (totalValue / inventoryItems.reduce((sum, item) => sum + calculateStockValue(item), 0)) * 100;

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{category}</span>
                          <span>AED {totalValue.toLocaleString()}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="text-sm text-gray-600">
                          {categoryItems.length} items ({percentage.toFixed(1)}% of total value)
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <h4 className="font-medium">Stock Valuation Methods</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 border rounded">
                      <div className="font-medium">FIFO</div>
                      <div className="text-gray-600">AED 890,450</div>
                    </div>
                    <div className="text-center p-2 border rounded">
                      <div className="font-medium">LIFO</div>
                      <div className="text-gray-600">AED 885,230</div>
                    </div>
                    <div className="text-center p-2 border rounded">
                      <div className="font-medium">Weighted Avg</div>
                      <div className="text-gray-600">AED 887,840</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Movement Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  Movement & Aging Analysis
                </CardTitle>
                <CardDescription>Track stock velocity and aging patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Stock Movement Velocity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fast Moving (>10 units/month)</span>
                        <span className="font-medium text-green-600">
                          {inventoryItems.filter(item =>
                            (item.currentStock - item.availableStock) > 10
                          ).length} items
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Medium Moving (5-10 units/month)</span>
                        <span className="font-medium text-orange-600">
                          {inventoryItems.filter(item =>
                            (item.currentStock - item.availableStock) >= 5 &&
                            (item.currentStock - item.availableStock) <= 10
                          ).length} items
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Slow Moving (<5 units/month)</span>
                        <span className="font-medium text-red-600">
                          {inventoryItems.filter(item =>
                            (item.currentStock - item.availableStock) < 5
                          ).length} items
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Aging Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>0-90 days</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-green-200 rounded">
                            <div className="w-3/4 h-2 bg-green-500 rounded"></div>
                          </div>
                          <span className="text-green-600 font-medium">75%</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>91-180 days</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-orange-200 rounded">
                            <div className="w-1/4 h-2 bg-orange-500 rounded"></div>
                          </div>
                          <span className="text-orange-600 font-medium">20%</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>180+ days (Dead Stock)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-red-200 rounded">
                            <div className="w-1/12 h-2 bg-red-500 rounded"></div>
                          </div>
                          <span className="text-red-600 font-medium">5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Perfume/Oud Specific Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-amber-600" />
                  Perfume & Oud Analytics
                </CardTitle>
                <CardDescription>Industry-specific inventory metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Aging Status Summary</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                        <span className="text-sm">Ready for Production</span>
                        <Badge className="bg-green-100 text-green-800">
                          {inventoryItems.filter(item => item.aging?.status === 'Ready').length} batches
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded">
                        <span className="text-sm">In Aging Process</span>
                        <Badge className="bg-orange-100 text-orange-800">
                          {inventoryItems.filter(item => item.aging && item.aging.status !== 'Ready').length} batches
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Grade Distribution</h4>
                    <div className="space-y-2">
                      {['Royal', 'Super', 'Premium', 'Standard'].map((grade) => {
                        const gradeItems = inventoryItems.filter(item => item.grade === grade);
                        const count = gradeItems.length;

                        return (
                          <div key={grade} className="flex justify-between text-sm">
                            <span>{grade} Grade</span>
                            <span className="font-medium">{count} items</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Origin Analysis</h4>
                    <div className="space-y-2">
                      {['Cambodia', 'UAE', 'India', 'Myanmar'].map((origin) => {
                        const originItems = inventoryItems.filter(item => item.origin === origin);
                        const totalValue = originItems.reduce((sum, item) => sum + calculateStockValue(item), 0);

                        return (
                          <div key={origin} className="flex justify-between text-sm">
                            <span>{origin}</span>
                            <span className="font-medium">AED {totalValue.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Items & Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-600" />
                  Action Items & Alerts
                </CardTitle>
                <CardDescription>Urgent actions and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Low Stock Alerts */}
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Low Stock Alerts</h4>
                    <div className="space-y-2">
                      {inventoryItems.filter(item => getStockStatus(item) === 'low').map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div>
                            <div className="font-medium text-red-900">{item.name}</div>
                            <div className="text-sm text-red-700">
                              Stock: {item.currentStock} {item.stockUnit} (Min: {item.minStockLevel})
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Reorder
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aging Complete */}
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">Ready for Production</h4>
                    <div className="space-y-2">
                      {inventoryItems.filter(item => item.aging?.status === 'Ready').map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div>
                            <div className="font-medium text-green-900">{item.name}</div>
                            <div className="text-sm text-green-700">
                              Aging complete - Ready for production
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Workflow className="h-3 w-3 mr-1" />
                            Use in Production
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expiry Warnings */}
                  <div>
                    <h4 className="font-medium mb-2 text-orange-600">Expiry Warnings</h4>
                    <div className="space-y-2">
                      {inventoryItems.filter(item => {
                        if (!item.expiryDate) return false;
                        const today = new Date();
                        const expiry = new Date(item.expiryDate);
                        const daysDiff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
                        return daysDiff <= 90 && daysDiff > 0;
                      }).map((item) => {
                        const today = new Date();
                        const expiry = new Date(item.expiryDate);
                        const daysDiff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

                        return (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div>
                              <div className="font-medium text-orange-900">{item.name}</div>
                              <div className="text-sm text-orange-700">
                                Expires in {daysDiff} days ({item.expiryDate})
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Zap className="h-3 w-3 mr-1" />
                              Priority Use
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales and POS Integration Tab */}
        <TabsContent value="sales" className="space-y-4">
          {/* Sales Overview Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Today's Sales</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                AED {salesAnalytics.dailyMetrics['2024-09-30'].totalSales.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">
                {salesAnalytics.dailyMetrics['2024-09-30'].totalOrders} orders
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600">Items Reserved</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {salesAnalytics.inventoryImpact.totalItemsReserved}
              </div>
              <div className="text-sm text-orange-600">
                Stock reservations
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Active POS</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {Object.values(salesIntegration.posTerminals).filter(pos => pos.status === 'active').length}
              </div>
              <div className="text-sm text-blue-600">
                Terminals online
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-gray-600">Stock Warnings</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {salesAnalytics.inventoryImpact.stockWarnings.length}
              </div>
              <div className="text-sm text-red-600">
                Low stock alerts
              </div>
            </Card>
          </div>

          {/* POS Terminals Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-blue-600" />
                POS Terminals Status
              </CardTitle>
              <CardDescription>
                Real-time status of all POS terminals and their inventory sync
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(salesIntegration.posTerminals).map(([terminalId, terminal]) => {
                  const status = getPOSTerminalStatus(terminalId);
                  return (
                    <Card key={terminalId} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            status.syncStatus === 'current' ? 'bg-green-500' :
                            status.syncStatus === 'warning' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <div>
                            <h4 className="font-medium">{terminal.name}</h4>
                            <p className="text-sm text-gray-600">{status.locationName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-2 mb-2">
                            <Badge className={`${
                              terminal.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {terminal.status}
                            </Badge>
                            <Badge variant="outline">{terminal.type}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Last sync: {status.minutesSinceSync}m ago
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {terminal.capabilities.map(capability => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Sales Channel Performance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Sales Channel Performance
              </CardTitle>
              <CardDescription>
                Performance metrics across different sales channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getSalesChannelStats().map(channelStat => (
                  <Card key={channelStat.channel} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{channelStat.performance?.channelName}</h4>
                        <Badge variant="outline">{channelStat.performance?.priceType}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Revenue:</span>
                          <span className="font-medium">AED {channelStat.performance?.revenue?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Orders:</span>
                          <span className="font-medium">{channelStat.performance?.orders}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Avg Order:</span>
                          <span className="font-medium">AED {channelStat.performance?.averageOrderValue?.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active Orders:</span>
                          <span className="font-medium">{channelStat.activeOrders}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Reservations:</span>
                          <span className="font-medium">{channelStat.activeReservations}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Revenue Share:</span>
                          <span className="font-medium">{channelStat.performance?.percentOfTotalRevenue}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${channelStat.performance?.percentOfTotalRevenue}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Sales Orders */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                Active Sales Orders & Inventory Impact
              </CardTitle>
              <CardDescription>
                Current sales orders and their real-time impact on inventory levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSalesOrders.filter(order => order.status !== 'completed' && order.status !== 'cancelled').map(order => {
                  const impact = calculateSalesInventoryImpact(order.id);
                  return (
                    <Card key={order.id} className="p-4">
                      <div className="space-y-4">
                        {/* Order Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">{order.salesChannel}</Badge>
                              {order.posTerminal && (
                                <Badge variant="outline">{salesIntegration.posTerminals[order.posTerminal]?.name}</Badge>
                              )}
                            </div>
                            <h4 className="font-medium mt-1">Order #{order.orderNumber}</h4>
                            <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">AED {order.totals.totalAmount}</div>
                            <p className="text-sm text-gray-600">{order.orderDate}</p>
                          </div>
                        </div>

                        {/* Inventory Impact */}
                        <div>
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Inventory Impact
                          </h5>
                          <div className="space-y-2">
                            {impact?.impactedItems.map(item => (
                              <div key={item.itemId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    item.impactLevel === 'critical' ? 'bg-red-500' :
                                    item.impactLevel === 'warning' ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}></div>
                                  <span className="text-sm font-medium">{item.itemName}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm">
                                    {item.reservedStock > 0 ? `${item.reservedStock} reserved` : `${item.deductedStock} sold`}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {item.remainingStock} remaining
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex gap-4 text-sm">
                            <span>Items: {impact?.totalItems}</span>
                            {impact?.criticalItems > 0 && (
                              <span className="text-red-600">Critical: {impact?.criticalItems}</span>
                            )}
                            {impact?.warningItems > 0 && (
                              <span className="text-yellow-600">Warning: {impact?.warningItems}</span>
                            )}
                            {impact?.reorderItems > 0 && (
                              <span className="text-orange-600">Reorder: {impact?.reorderItems}</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.fulfillment.type} fulfillment
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stock Reservations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Active Stock Reservations
              </CardTitle>
              <CardDescription>
                Items currently reserved for pending sales orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getStockReservations().map((reservation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{reservation.salesChannel}</Badge>
                      <div>
                        <div className="font-medium">{reservation.itemName}</div>
                        <div className="text-sm text-gray-600">
                          Order #{reservation.orderNumber} - {reservation.customerName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{reservation.quantity} {reservation.unit}</div>
                      <div className="text-sm text-gray-600">
                        {reservation.locationName}
                      </div>
                      {reservation.reservationExpiry && (
                        <div className="text-xs text-orange-600">
                          Expires: {reservation.reservationExpiry.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {getStockReservations().length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No active stock reservations
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Perfume & Oud Specialized Features Tab */}
        <TabsContent value="perfume-oud" className="space-y-4">
          {/* Specialized Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-gray-600">Aging Inventory</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {getAgingInventorySummary().totalItems}
              </div>
              <div className="text-sm text-amber-600">
                AED {getAgingInventorySummary().totalCurrentValue.toLocaleString()} value
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Beaker className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">Active Blends</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {getBlendingProjectsSummary().activeProjects}
              </div>
              <div className="text-sm text-purple-600">
                {getBlendingProjectsSummary().projectedMargin}% margin
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Appreciation</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {getAgingInventorySummary().averageAppreciationRate}%
              </div>
              <div className="text-sm text-green-600">
                AED {getAgingInventorySummary().totalAppreciation.toLocaleString()} gained
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Scale className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Tola System</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {convertTolaUnits(1, 'tola', 'grams').toFixed(2)}g
              </div>
              <div className="text-sm text-blue-600">
                Per tola (تولة)
              </div>
            </Card>
          </div>

          {/* Aging Inventory Management */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Aging Inventory Management
              </CardTitle>
              <CardDescription>
                Time-based appreciation tracking for premium oud and perfume materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agingInventory.map(item => {
                  const appreciation = calculateAgingAppreciation(item.id);
                  return (
                    <Card key={item.id} className="p-4">
                      <div className="space-y-4">
                        {/* Item Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.nameArabic}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge className={`${
                                item.grade === 'super_plus' ? 'bg-gold-100 text-gold-800' :
                                item.grade === 'super' ? 'bg-purple-100 text-purple-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {getQualityGrading(item.qualityScore)?.category}
                              </Badge>
                              <Badge variant="outline">{item.currentStage}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-green-600">
                              AED {item.currentValue.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              +{item.appreciationRate}% appreciation
                            </div>
                          </div>
                        </div>

                        {/* Aging Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Aging Progress</span>
                            <span className="text-sm text-gray-600">
                              {item.currentAge} / {item.targetAge} months
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (item.currentAge / item.targetAge) * 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-gray-600">
                              Started: {new Date(item.startDate).toLocaleDateString()}
                            </span>
                            <span className={`${appreciation?.monthsToOptimal > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                              {appreciation?.monthsToOptimal > 0 ?
                                `${appreciation.monthsToOptimal} months remaining` :
                                'Ready for use'}
                            </span>
                          </div>
                        </div>

                        {/* Storage Conditions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium">{item.storageConditions.temperature}°C</div>
                            <div className="text-gray-600">Temperature</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium">{item.storageConditions.humidity}%</div>
                            <div className="text-gray-600">Humidity</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium">{item.qualityScore}/100</div>
                            <div className="text-gray-600">Quality Score</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium">{item.currentWeight}g</div>
                            <div className="text-gray-600">Current Weight</div>
                          </div>
                        </div>

                        {/* Value Projection */}
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                          <div>
                            <span className="text-sm font-medium">Projected Final Value</span>
                            <p className="text-xs text-gray-600">At optimal aging completion</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              AED {item.projectedFinalValue.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-600">
                              +{Math.round(((item.projectedFinalValue - item.originalValue) / item.originalValue) * 100)}% total
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active Blending Projects */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-purple-600" />
                Active Blending Projects
              </CardTitle>
              <CardDescription>
                Perfume blending projects with formula tracking and quality control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeBlendingProjects.map(project => {
                  const status = getBlendingProjectStatus(project.id);
                  return (
                    <Card key={project.id} className="p-4">
                      <div className="space-y-4">
                        {/* Project Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{project.projectName}</h4>
                            <p className="text-sm text-gray-600 mt-1">{project.projectNameArabic}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge className={`${
                                project.status === 'resting' ? 'bg-blue-100 text-blue-800' :
                                project.status === 'blending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {project.status.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">{project.masterBlender}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">
                              AED {project.targetSellingPrice.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {project.projectedMargin}% margin
                            </div>
                          </div>
                        </div>

                        {/* Blending Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Resting Progress</span>
                            <span className="text-sm text-gray-600">
                              Day {project.currentDay} of {project.totalRestingDays}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${status.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-gray-600">
                              Started: {new Date(project.startDate).toLocaleDateString()}
                            </span>
                            <span className="text-purple-600">
                              {status.daysRemaining} days remaining
                            </span>
                          </div>
                        </div>

                        {/* Formula Breakdown */}
                        <div>
                          <h5 className="font-medium mb-2">Formula Composition</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(project.formulaUsed).map(([ingredient, details]) => (
                              <div key={ingredient} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                                <span className="capitalize">{ingredient.replace('_', ' ')}</span>
                                <div className="text-right">
                                  <div className="font-medium">{details.actual}ml</div>
                                  <div className="text-xs text-gray-600">AED {details.cost}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quality Tracking */}
                        <div>
                          <h5 className="font-medium mb-2">Quality Check Points</h5>
                          <div className="space-y-2">
                            {project.qualityCheckPoints.map((qc, index) => (
                              <div key={index} className={`flex items-center justify-between p-2 rounded ${
                                qc.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                              }`}>
                                <div className="flex items-center gap-2">
                                  {qc.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-gray-400" />
                                  )}
                                  <span className="text-sm">Day {qc.day}</span>
                                </div>
                                <div className="text-right text-sm">
                                  {qc.completed ? (
                                    <div>
                                      <span className="font-medium">Score: {qc.score}/100</span>
                                      <p className="text-xs text-gray-600">{qc.notes}</p>
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">
                                      {qc.scheduled ? `Scheduled: ${qc.scheduled}` : 'Pending'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Project Summary */}
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                          <div>
                            <span className="text-sm font-medium">Batch Size: {project.batchSize}ml</span>
                            <p className="text-xs text-gray-600">Expected yield: {project.expectedYield}ml</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">Total Cost: AED {project.totalCost.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">Market release: {project.marketRelease}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tola Units & Pricing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Tola Units System
                </CardTitle>
                <CardDescription>
                  Traditional Middle Eastern measurement system (تولة)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Conversion Reference */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-lg font-semibold">11.664g</div>
                      <div className="text-sm text-gray-600">1 Tola (Weight)</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-lg font-semibold">11.66ml</div>
                      <div className="text-sm text-gray-600">1 Tola (Volume)</div>
                    </div>
                  </div>

                  {/* Quick Conversions */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Quick Conversions</h4>
                    {[
                      { from: 1, fromUnit: 'kg', to: 85.74, toUnit: 'tola' },
                      { from: 10, fromUnit: 'tola', to: 116.64, toUnit: 'grams' },
                      { from: 1, fromUnit: 'tola', to: 0.4114, toUnit: 'ounces' }
                    ].map((conversion, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span>{conversion.from} {conversion.fromUnit}</span>
                        <span>=</span>
                        <span className="font-medium">{conversion.to} {conversion.toUnit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Market Pricing in Tola */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Current Market Prices (per Tola)</h4>
                    {Object.entries(perfumeOudSystem.tolaUnitsSystem.pricingInTola).map(([material, pricing]) => (
                      <div key={material} className="flex justify-between items-center p-2 border rounded">
                        <span className="capitalize text-sm">{material.replace('_', ' ')}</span>
                        <span className="font-medium">AED {pricing.price_per_tola.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Quality Grading System
                </CardTitle>
                <CardDescription>
                  Professional perfume and oud quality assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Grading Scale */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Quality Grades</h4>
                    {Object.entries(perfumeOudSystem.qualityGrading.gradingScale).map(([grade, details]) => (
                      <div key={grade} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <span className="font-medium capitalize">{grade.replace('_', ' ')}</span>
                          <p className="text-xs text-gray-600">{details.arabicName}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{details.score}</div>
                          <div className="text-xs text-gray-600">{details.multiplier}x value</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Evaluation Criteria */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Evaluation Criteria</h4>
                    {Object.entries(perfumeOudSystem.qualityGrading.evaluationCriteria).map(([criteria, details]) => (
                      <div key={criteria} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{criteria.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-600 h-2 rounded-full"
                              style={{ width: `${(details.weight * 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{(details.weight * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certified Graders */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Certified Graders</h4>
                    {perfumeOudSystem.qualityGrading.gradingExperts.map((expert, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="font-medium">{expert.name}</div>
                        <div className="text-gray-600 capitalize">{expert.expertise.replace('_', ' ')}</div>
                        <div className="text-xs text-gray-500">
                          {expert.certifications.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seasonal Demand Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Seasonal Demand Patterns
              </CardTitle>
              <CardDescription>
                Cultural and seasonal factors affecting perfume and oud demand in UAE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(perfumeOudSystem.seasonalFactors).map(([season, data]) => (
                  <Card key={season} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium capitalize">{season.replace('_', ' ')}</h4>
                        <Badge className={`${
                          data.demand_multiplier >= 2.0 ? 'bg-red-100 text-red-800' :
                          data.demand_multiplier >= 1.5 ? 'bg-orange-100 text-orange-800' :
                          data.demand_multiplier >= 1.0 ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {data.demand_multiplier}x
                        </Badge>
                      </div>

                      <div className="text-sm space-y-2">
                        {data.months && (
                          <div>
                            <span className="font-medium">Months:</span>
                            <p className="text-gray-600 capitalize">
                              {data.months.join(', ')}
                            </p>
                          </div>
                        )}

                        {data.preparation_period && (
                          <div>
                            <span className="font-medium">Prep Period:</span>
                            <p className="text-gray-600">{data.preparation_period}</p>
                          </div>
                        )}

                        {data.popular_products && (
                          <div>
                            <span className="font-medium">Popular Products:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {data.popular_products.slice(0, 2).map(product => (
                                <Badge key={product} variant="outline" className="text-xs">
                                  {product.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inter-Location Stock Transfer</DialogTitle>
            <DialogDescription>
              Transfer inventory between locations with full audit trail
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Selected Item:</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{selectedItem.name}</div>
                    <div className="text-sm text-gray-600">{selectedItem.nameArabic}</div>
                  </div>
                  <Badge>{selectedItem.category}</Badge>
                </div>
              </div>

              {selectedItem.locationStock && (
                <div>
                  <h4 className="font-medium mb-3">Current Stock by Location:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedItem.locationStock).map(([locationId, locationData]: [string, any]) => {
                      const location = storeLocations.find(loc => loc.id === locationId);
                      if (!location) return null;

                      return (
                        <div key={locationId} className="p-3 border rounded-lg">
                          <div className="font-medium text-sm">{location.name}</div>
                          <div className="text-xs text-gray-600 mb-2">{locationData.binLocation}</div>
                          <div className="flex justify-between">
                            <span className="text-sm">Available:</span>
                            <span className="font-medium">{locationData.availableStock} {selectedItem.stockUnit}</span>
                          </div>
                          {locationData.reservedStock > 0 && (
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Reserved:</span>
                              <span>{locationData.reservedStock} {selectedItem.stockUnit}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedItem.locationStock && Object.keys(selectedItem.locationStock).map(locationId => {
                        const location = storeLocations.find(loc => loc.id === locationId);
                        const locationData = selectedItem.locationStock[locationId];

                        if (!location || !location.allowTransferFrom || locationData.availableStock === 0) return null;

                        return (
                          <SelectItem key={locationId} value={locationId}>
                            {location.name} (Available: {locationData.availableStock} {selectedItem.stockUnit})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>To Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeLocations.filter(loc => loc.allowTransferTo).map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Expected Cost (AED)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
              </div>

              <div>
                <Label>Reason for Transfer</Label>
                <Textarea placeholder="Describe the reason for this transfer..." />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Transfer Process:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>1. Request submitted for manager approval</div>
                  <div>2. Stock reserved at source location</div>
                  <div>3. Transportation arranged upon approval</div>
                  <div>4. Stock updated upon delivery confirmation</div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Submit Transfer Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Location Details Dialog */}
      <Dialog open={isLocationDetailsDialogOpen} onOpenChange={setIsLocationDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Location Details</DialogTitle>
            <DialogDescription>
              Comprehensive location information and inventory
            </DialogDescription>
          </DialogHeader>
          {selectedLocationDetails && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Location Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedLocationDetails.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arabic Name:</span>
                        <span className="font-medium">{selectedLocationDetails.nameArabic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedLocationDetails.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Manager:</span>
                        <span className="font-medium">{selectedLocationDetails.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedLocationDetails.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Operating Hours:</span>
                        <span className="font-medium">{selectedLocationDetails.operatingHours}</span>
                      </div>
                    </div>
                  </div>

                  {selectedLocationDetails.salesMetrics && (
                    <div>
                      <h4 className="font-medium mb-2">Sales Performance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Target:</span>
                          <span className="font-medium">AED {selectedLocationDetails.salesMetrics.monthlyTarget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Sales:</span>
                          <span className="font-medium">AED {selectedLocationDetails.salesMetrics.currentMonthSales.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Transaction:</span>
                          <span className="font-medium">AED {selectedLocationDetails.salesMetrics.averageTransactionValue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Footfall:</span>
                          <span className="font-medium">{selectedLocationDetails.salesMetrics.footfallCount}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Inventory Summary</h4>
                  <div className="space-y-3">
                    {getItemsForLocation(selectedLocationDetails.id).map(item => {
                      const locationData = item.locationStock[selectedLocationDetails.id];

                      return (
                        <div key={item.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-sm">{item.name}</div>
                            <Badge className={getStockStatus(item, selectedLocationDetails.id) === 'low' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                              {getStockStatus(item, selectedLocationDetails.id)}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 mb-2">{locationData.binLocation}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span>Current:</span>
                              <span className="font-medium">{locationData.currentStock} {item.stockUnit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Available:</span>
                              <span className="font-medium">{locationData.availableStock} {item.stockUnit}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsLocationDetailsDialogOpen(false)}>
                  Close
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Generate Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}