'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Building,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Settings,
  Target,
  Zap,
  Archive,
  Percent,
  DollarSign,
  Package,
  ShoppingCart,
  FileText,
  Ship,
  Plane,
  Container,
  Users,
  Award,
  CreditCard,
  Banknote,
  Receipt,
  Calculator,
  Scale,
  Droplets,
  Gem,
  Factory,
  Store,
  Warning,
  Shield,
  CheckSquare,
  XCircle,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react';

// Comprehensive vendor database for UAE perfume & oud business
const vendorsDatabase = [
  {
    id: 'VEN001',
    vendorCode: 'ASIA-OUD-001',
    name: 'Asia Oud Trading LLC',
    nameArabic: 'شركة آسيا للعود التجارية ذ.م.م',
    type: 'Raw Materials',
    category: 'Premium Oud Supplier',
    status: 'Active',
    rating: 4.8,
    establishedYear: 2015,

    // Contact Information
    contactInfo: {
      primaryContact: 'Mr. Rajesh Kumar',
      title: 'Export Manager',
      email: 'rajesh@asiaoud.com',
      phone: '+91-9876543210',
      whatsapp: '+91-9876543210',
      website: 'www.asiaoud.com'
    },

    // Address Information
    addresses: [
      {
        type: 'Head Office',
        street: '123 Oud Market Street',
        area: 'Commercial District',
        city: 'Guwahati',
        state: 'Assam',
        country: 'India',
        postalCode: '781001',
        coordinates: { lat: 26.1445, lng: 91.7362 }
      },
      {
        type: 'Warehouse',
        street: '456 Storage Complex',
        area: 'Industrial Zone',
        city: 'Guwahati',
        state: 'Assam',
        country: 'India',
        postalCode: '781015'
      }
    ],

    // Business Information
    businessInfo: {
      registrationNumber: 'IND-LLC-2015-001',
      taxId: 'GSTIN-12345678901',
      businessLicense: 'BL-2015-ASSAM-001',
      exportLicense: 'EL-2015-IND-001',
      certifications: ['ISO 9001:2015', 'Organic Certification', 'Fair Trade'],
      insurancePolicy: 'INS-2024-001',
      insuranceAmount: 500000, // USD
      bankDetails: {
        bankName: 'State Bank of India',
        accountNumber: '1234567890',
        swiftCode: 'SBININBB123',
        iban: 'IN12SBIN0001234567890'
      }
    },

    // Product Categories & Specialties
    productCategories: [
      {
        category: 'Cambodian Oud',
        grades: ['Super Premium', 'Premium', 'Standard'],
        minOrderQuantity: 1, // kg
        leadTime: 15, // days
        priceRange: { min: 2500, max: 5000 }, // AED per kg
        qualityCertificate: true
      },
      {
        category: 'Indian Oud',
        grades: ['Premium', 'Standard'],
        minOrderQuantity: 2, // kg
        leadTime: 10, // days
        priceRange: { min: 1500, max: 3000 },
        qualityCertificate: true
      },
      {
        category: 'Vietnamese Oud',
        grades: ['Premium', 'Standard'],
        minOrderQuantity: 1, // kg
        leadTime: 20, // days
        priceRange: { min: 2000, max: 4000 },
        qualityCertificate: true
      }
    ],

    // Financial Terms
    paymentTerms: {
      creditDays: 45,
      paymentMethods: ['Bank Transfer', 'Letter of Credit', 'Western Union'],
      creditLimit: 100000, // AED
      currency: 'USD',
      discountTerms: '2/10 Net 45', // 2% discount if paid within 10 days
      lateFeeRate: 1.5 // % per month
    },

    // Shipping & Logistics
    shippingInfo: {
      incoterms: ['FOB', 'CIF', 'DDP'],
      preferredShipping: 'Air Freight',
      shippingPorts: ['Guwahati Airport', 'Kolkata Port'],
      estimatedTransitTime: 7, // days to UAE
      packagingStandards: 'Vacuum Sealed, Wooden Boxes',
      insuranceCoverage: true,
      trackingProvided: true
    },

    // Performance Metrics
    performance: {
      totalOrders: 156,
      totalValue: 2450000, // AED
      onTimeDelivery: 94.2, // %
      qualityScore: 4.7,
      returnRate: 0.5, // %
      responseTime: 4, // hours
      lastOrderDate: '2024-01-20',
      averageOrderValue: 15700,
      reliabilityScore: 4.8
    },

    // Documents & Compliance
    documents: [
      {
        type: 'Business License',
        number: 'BL-2015-ASSAM-001',
        issueDate: '2015-03-15',
        expiryDate: '2025-03-15',
        status: 'Valid',
        document: '/docs/business-license.pdf'
      },
      {
        type: 'Export License',
        number: 'EL-2015-IND-001',
        issueDate: '2015-04-01',
        expiryDate: '2025-04-01',
        status: 'Valid',
        document: '/docs/export-license.pdf'
      },
      {
        type: 'ISO Certificate',
        number: 'ISO-9001-2023',
        issueDate: '2023-01-15',
        expiryDate: '2026-01-15',
        status: 'Valid',
        document: '/docs/iso-certificate.pdf'
      }
    ],

    // Recent Activities
    recentActivity: [
      {
        date: '2024-01-20',
        type: 'Order Shipped',
        description: 'PO-2024-001 shipped via Air Freight',
        value: 25000,
        status: 'Completed'
      },
      {
        date: '2024-01-18',
        type: 'Quality Report',
        description: 'Quality inspection completed - Grade A+',
        status: 'Approved'
      },
      {
        date: '2024-01-15',
        type: 'Payment Received',
        description: 'Invoice INV-2024-001 payment received',
        value: 18500,
        status: 'Completed'
      }
    ],

    // Special Notes & Preferences
    notes: 'Excellent supplier for premium Cambodian oud. Consistent quality and reliable delivery. Offers competitive pricing for bulk orders. English and Hindi communication. Prefers advance payment for new varieties.',
    tags: ['Premium Supplier', 'Reliable', 'Quality Certified', 'Competitive Pricing', 'International'],

    // Risk Assessment
    riskAssessment: {
      financialRisk: 'Low',
      operationalRisk: 'Low',
      complianceRisk: 'Low',
      geopoliticalRisk: 'Medium',
      overallRisk: 'Low',
      lastAssessment: '2024-01-01',
      riskFactors: ['Currency fluctuation', 'Seasonal availability']
    }
  },

  {
    id: 'VEN002',
    vendorCode: 'BGR-ROSE-002',
    name: 'Bulgarian Rose Company Ltd',
    nameArabic: 'شركة الورد البلغاري المحدودة',
    type: 'Raw Materials',
    category: 'Rose & Floral Extracts',
    status: 'Active',
    rating: 4.6,
    establishedYear: 1998,

    contactInfo: {
      primaryContact: 'Ms. Elena Dimitrova',
      title: 'International Sales Manager',
      email: 'elena@bulgarianrose.com',
      phone: '+359-888-123456',
      whatsapp: '+359-888-123456',
      website: 'www.bulgarianrose.com'
    },

    addresses: [
      {
        type: 'Head Office',
        street: '15 Rose Valley Street',
        area: 'Rose Valley',
        city: 'Kazanlak',
        state: 'Stara Zagora',
        country: 'Bulgaria',
        postalCode: '6100'
      }
    ],

    businessInfo: {
      registrationNumber: 'BGR-LTD-1998-002',
      taxId: 'BG-123456789',
      businessLicense: 'BL-1998-BGR-002',
      exportLicense: 'EL-1998-EUR-002',
      certifications: ['EU Organic', 'ECOCERT', 'Fair Trade'],
      insurancePolicy: 'INS-2024-002',
      insuranceAmount: 750000, // EUR
      bankDetails: {
        bankName: 'UniCredit Bulbank',
        accountNumber: 'BG12UNCR70001234567890',
        swiftCode: 'UNCRBGSF',
        iban: 'BG12UNCR70001234567890'
      }
    },

    productCategories: [
      {
        category: 'Rose Petals - Dried',
        grades: ['Premium', 'Standard'],
        minOrderQuantity: 10, // kg
        leadTime: 14, // days
        priceRange: { min: 800, max: 1200 }, // AED per kg
        qualityCertificate: true
      },
      {
        category: 'Rose Oil - Distilled',
        grades: ['Extra Premium', 'Premium'],
        minOrderQuantity: 0.1, // kg
        leadTime: 21, // days
        priceRange: { min: 25000, max: 45000 }, // AED per kg
        qualityCertificate: true
      }
    ],

    paymentTerms: {
      creditDays: 30,
      paymentMethods: ['Bank Transfer', 'Letter of Credit'],
      creditLimit: 75000,
      currency: 'EUR',
      discountTerms: '2/15 Net 30',
      lateFeeRate: 2.0
    },

    shippingInfo: {
      incoterms: ['FOB', 'CIF'],
      preferredShipping: 'Sea Freight',
      shippingPorts: ['Varna Port', 'Burgas Port'],
      estimatedTransitTime: 21, // days to UAE
      packagingStandards: 'Food Grade Containers',
      insuranceCoverage: true,
      trackingProvided: true
    },

    performance: {
      totalOrders: 89,
      totalValue: 1850000,
      onTimeDelivery: 91.0,
      qualityScore: 4.5,
      returnRate: 1.2,
      responseTime: 6,
      lastOrderDate: '2024-01-15',
      averageOrderValue: 20800,
      reliabilityScore: 4.4
    },

    documents: [
      {
        type: 'EU Export License',
        number: 'EU-EL-1998-002',
        issueDate: '2023-01-01',
        expiryDate: '2025-12-31',
        status: 'Valid'
      },
      {
        type: 'Organic Certificate',
        number: 'ORG-BGR-2023',
        issueDate: '2023-06-01',
        expiryDate: '2024-06-01',
        status: 'Renewal Required'
      }
    ],

    recentActivity: [
      {
        date: '2024-01-15',
        type: 'Order Delivered',
        description: 'PO-2024-005 delivered successfully',
        value: 32000,
        status: 'Completed'
      }
    ],

    notes: 'Premium European supplier for rose products. Excellent for luxury attar production. Seasonal availability affects pricing. EU quality standards.',
    tags: ['European Supplier', 'Premium Quality', 'Organic Certified', 'Seasonal'],

    riskAssessment: {
      financialRisk: 'Low',
      operationalRisk: 'Medium',
      complianceRisk: 'Low',
      geopoliticalRisk: 'Low',
      overallRisk: 'Low',
      lastAssessment: '2024-01-01',
      riskFactors: ['Seasonal supply', 'Weather dependency']
    }
  },

  {
    id: 'VEN003',
    vendorCode: 'UAE-PACK-003',
    name: 'Emirates Packaging Solutions',
    nameArabic: 'حلول التعبئة والتغليف الإماراتية',
    type: 'Packaging & Supplies',
    category: 'Bottles & Packaging',
    status: 'Active',
    rating: 4.9,
    establishedYear: 2010,

    contactInfo: {
      primaryContact: 'Mr. Ahmed Al-Mansouri',
      title: 'Sales Director',
      email: 'ahmed@emiratespack.com',
      phone: '+971-4-1234567',
      whatsapp: '+971-50-1234567',
      website: 'www.emiratespack.com'
    },

    addresses: [
      {
        type: 'Head Office & Warehouse',
        street: 'Plot 123, Industrial Area 1',
        area: 'Al Qusais',
        city: 'Dubai',
        emirate: 'Dubai',
        country: 'UAE',
        postalCode: '00000'
      }
    ],

    businessInfo: {
      registrationNumber: 'UAE-LLC-2010-003',
      taxId: 'TRN-123456789012345',
      businessLicense: 'BL-2010-DXB-003',
      vatRegistration: 'VAT-UAE-123456789',
      certifications: ['ISO 9001:2015', 'FDA Approved'],
      insurancePolicy: 'INS-2024-003',
      insuranceAmount: 200000, // AED
      bankDetails: {
        bankName: 'Emirates NBD',
        accountNumber: 'AE12EBILAED1234567890',
        swiftCode: 'EBILAEAD',
        iban: 'AE12EBILAED1234567890'
      }
    },

    productCategories: [
      {
        category: 'Glass Bottles',
        grades: ['Premium Crystal', 'Standard Glass'],
        minOrderQuantity: 100, // pieces
        leadTime: 3, // days
        priceRange: { min: 15, max: 85 }, // AED per piece
        qualityCertificate: true
      },
      {
        category: 'Luxury Boxes',
        grades: ['Velvet', 'Leather', 'Wood'],
        minOrderQuantity: 50, // pieces
        leadTime: 5, // days
        priceRange: { min: 25, max: 150 }, // AED per piece
        qualityCertificate: false
      }
    ],

    paymentTerms: {
      creditDays: 30,
      paymentMethods: ['Bank Transfer', 'Cash', 'Cheque'],
      creditLimit: 50000,
      currency: 'AED',
      discountTerms: '2/10 Net 30',
      lateFeeRate: 1.0
    },

    shippingInfo: {
      incoterms: ['EXW', 'DAP'],
      preferredShipping: 'Local Delivery',
      shippingPorts: ['Dubai'],
      estimatedTransitTime: 1, // days
      packagingStandards: 'Protective Packaging',
      insuranceCoverage: true,
      trackingProvided: true
    },

    performance: {
      totalOrders: 245,
      totalValue: 850000,
      onTimeDelivery: 98.5,
      qualityScore: 4.8,
      returnRate: 0.2,
      responseTime: 2,
      lastOrderDate: '2024-01-22',
      averageOrderValue: 3470,
      reliabilityScore: 4.9
    },

    documents: [
      {
        type: 'UAE Trade License',
        number: 'TL-2010-DXB-003',
        issueDate: '2023-01-01',
        expiryDate: '2024-12-31',
        status: 'Valid'
      },
      {
        type: 'VAT Certificate',
        number: 'VAT-UAE-123456789',
        issueDate: '2018-01-01',
        expiryDate: 'Permanent',
        status: 'Valid'
      }
    ],

    recentActivity: [
      {
        date: '2024-01-22',
        type: 'Order Delivered',
        description: 'Luxury bottle set delivered same day',
        value: 4500,
        status: 'Completed'
      }
    ],

    notes: 'Excellent local supplier for all packaging needs. Fast delivery and competitive pricing. Custom packaging available. Arabic and English support.',
    tags: ['Local Supplier', 'Fast Delivery', 'Custom Packaging', 'Reliable'],

    riskAssessment: {
      financialRisk: 'Low',
      operationalRisk: 'Low',
      complianceRisk: 'Low',
      geopoliticalRisk: 'Low',
      overallRisk: 'Low',
      lastAssessment: '2024-01-01',
      riskFactors: ['Market competition']
    }
  }
];

// Purchase Orders with enhanced tracking
const purchaseOrders = [
  {
    id: 'PO-2024-001',
    vendorId: 'VEN001',
    vendorName: 'Asia Oud Trading LLC',
    orderDate: '2024-01-15',
    expectedDelivery: '2024-01-30',
    status: 'In Transit',
    priority: 'High',
    totalAmount: 28500,
    currency: 'USD',

    items: [
      {
        productCode: 'CAM-OUD-PREM-001',
        description: 'Cambodian Oud - Premium Grade',
        quantity: 5,
        unit: 'kg',
        unitPrice: 4500,
        totalPrice: 22500,
        specifications: 'Grade A+, Vacuum Sealed'
      },
      {
        productCode: 'IND-OUD-STD-002',
        description: 'Indian Oud - Standard Grade',
        quantity: 3,
        unit: 'kg',
        unitPrice: 2000,
        totalPrice: 6000,
        specifications: 'Grade A, Traditional Packaging'
      }
    ],

    shipping: {
      method: 'Air Freight',
      trackingNumber: 'AF-2024-001-ASIA',
      carrier: 'Emirates SkyCargo',
      origin: 'Guwahati, India',
      destination: 'Dubai, UAE',
      estimatedTransitDays: 7,
      currentLocation: 'Dubai Airport - Customs',
      lastUpdate: '2024-01-25'
    },

    customs: {
      customsDeclaration: 'CD-2024-001',
      hsCode: '3301.29.90',
      dutyRate: 5, // %
      dutyAmount: 1425,
      vatRate: 5, // %
      vatAmount: 1425,
      totalTaxes: 2850,
      clearanceStatus: 'Under Review',
      expectedClearance: '2024-01-26'
    },

    quality: {
      inspectionRequired: true,
      inspectionDate: null,
      inspector: 'Quality Team Alpha',
      qualityGrade: null,
      notes: 'Awaiting customs clearance for inspection'
    },

    payment: {
      terms: '30% Advance, 70% on Delivery',
      advancePaid: 8550,
      balanceDue: 19950,
      paymentStatus: 'Advance Paid',
      dueDate: '2024-02-01'
    }
  },

  {
    id: 'PO-2024-002',
    vendorId: 'VEN002',
    vendorName: 'Bulgarian Rose Company Ltd',
    orderDate: '2024-01-10',
    expectedDelivery: '2024-02-05',
    status: 'Confirmed',
    priority: 'Medium',
    totalAmount: 15750,
    currency: 'EUR',

    items: [
      {
        productCode: 'BGR-ROSE-PETALS-001',
        description: 'Bulgarian Rose Petals - Premium',
        quantity: 15,
        unit: 'kg',
        unitPrice: 950,
        totalPrice: 14250,
        specifications: 'Organic, Dried, Food Grade'
      },
      {
        productCode: 'BGR-ROSE-OIL-001',
        description: 'Bulgarian Rose Oil - Extra Premium',
        quantity: 0.05,
        unit: 'kg',
        unitPrice: 30000,
        totalPrice: 1500,
        specifications: 'Pure Distilled, Certified'
      }
    ],

    shipping: {
      method: 'Sea Freight',
      trackingNumber: 'SF-2024-002-BGR',
      carrier: 'Mediterranean Shipping',
      origin: 'Varna Port, Bulgaria',
      destination: 'Jebel Ali Port, Dubai',
      estimatedTransitDays: 21,
      currentLocation: 'In Transit - Mediterranean Sea',
      lastUpdate: '2024-01-20'
    },

    customs: {
      customsDeclaration: 'CD-2024-002',
      hsCode: '3301.90.00',
      dutyRate: 5,
      dutyAmount: 788,
      vatRate: 5,
      vatAmount: 788,
      totalTaxes: 1576,
      clearanceStatus: 'Pending Arrival',
      expectedClearance: '2024-02-06'
    },

    quality: {
      inspectionRequired: true,
      inspectionDate: null,
      inspector: 'Quality Team Beta',
      qualityGrade: null,
      notes: 'Schedule inspection upon arrival'
    },

    payment: {
      terms: 'Letter of Credit',
      advancePaid: 0,
      balanceDue: 15750,
      paymentStatus: 'LC Issued',
      dueDate: '2024-02-10'
    }
  }
];

// Import regulations and compliance
const importRegulations = {
  uae: {
    requiredDocuments: [
      'Commercial Invoice',
      'Packing List',
      'Bill of Lading/Airway Bill',
      'Certificate of Origin',
      'Quality Certificate',
      'Import License (if applicable)',
      'Insurance Certificate'
    ],
    prohibitedItems: [
      'Synthetic fragrances without approval',
      'Alcohol-based products >24% alcohol',
      'Endangered species derivatives'
    ],
    dutyRates: {
      'Essential Oils': 5,
      'Raw Materials': 5,
      'Packaging Materials': 5,
      'Finished Cosmetics': 5
    },
    vatRate: 5,
    customsProcedure: [
      'Submit customs declaration',
      'Pay duties and VAT',
      'Physical inspection (if required)',
      'Quality inspection',
      'Release goods'
    ]
  }
};

export default function PurchasingVendorManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [isNewVendorDialogOpen, setIsNewVendorDialogOpen] = useState(false);
  const [isNewPODialogOpen, setIsNewPODialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorTypeFilter, setVendorTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendors, setVendors] = useState<any[]>(vendorsDatabase);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/suppliers?limit=100');
        if (response.ok) {
          const data = await response.json();
          if (data.suppliers && data.suppliers.length > 0) {
            setVendors(data.suppliers);
          }
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // Calculate purchasing statistics
  const calculatePurchasingStats = () => {
    const totalVendors = vendors.length;
    const activeVendors = vendors.filter((v: any) => v.isActive || v.status === 'Active').length;
    const totalPOs = purchaseOrders.length;
    const pendingPOs = purchaseOrders.filter(po => po.status !== 'Delivered').length;

    const totalPOValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
    const avgVendorRating = vendors.reduce((sum: number, vendor: any) => sum + (vendor.performanceScore || vendor.rating || 0), 0) / (totalVendors || 1);
    const onTimeDelivery = vendors.reduce((sum: number, vendor: any) => sum + (vendor.onTimeDeliveryRate || vendor.performance?.onTimeDelivery || 0), 0) / (totalVendors || 1);

    return {
      totalVendors,
      activeVendors,
      totalPOs,
      pendingPOs,
      totalPOValue,
      avgVendorRating,
      onTimeDelivery
    };
  };

  const stats = calculatePurchasingStats();

  // Get status color for badges
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'delivered':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'in transit':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'under review':
      case 'customs':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter vendors
  const getFilteredVendors = () => {
    return vendorsDatabase.filter(vendor => {
      const matchesSearch = searchTerm === '' ||
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.nameArabic.includes(searchTerm) ||
        vendor.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = vendorTypeFilter === 'all' || vendor.type.toLowerCase() === vendorTypeFilter;
      const matchesStatus = statusFilter === 'all' || vendor.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  };

  // Render vendor card
  const renderVendorCard = (vendor: any) => (
    <Card key={vendor.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-sm">{vendor.name}</h3>
              <div className="flex items-center space-x-1">
                {[...Array(Math.floor(vendor.rating))].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                ))}
                <span className="text-xs text-gray-500">({vendor.rating})</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">{vendor.nameArabic}</p>
            <p className="text-xs text-gray-500">{vendor.category}</p>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(vendor.status)} variant="secondary">
              {vendor.status}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">{vendor.vendorCode}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Orders:</span>
            <span className="font-medium">{vendor.performance.totalOrders}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Value:</span>
            <span className="font-medium text-green-600">AED {vendor.performance.totalValue?.toLocaleString() || "0"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">On-time Delivery:</span>
            <span className="font-medium">{vendor.performance.onTimeDelivery}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quality Score:</span>
            <span className="font-medium text-amber-600">{vendor.performance.qualityScore}/5</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Globe className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">{vendor.addresses[0].country}</span>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); setSelectedVendor(vendor); }}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); alert('Edit vendor: ' + vendor.name); }}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); router.push('/purchasing/create-order?vendor=' + vendor.id); }}>
              <ShoppingCart className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render purchase order card
  const renderPOCard = (po: any) => (
    <Card key={po.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPO(po)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-sm">{po.id}</h3>
              <Badge variant="outline" className={`text-xs ${po.priority === 'High' ? 'border-red-300 text-red-800' : po.priority === 'Medium' ? 'border-yellow-300 text-yellow-800' : 'border-green-300 text-green-800'}`}>
                {po.priority}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">{po.vendorName}</p>
            <p className="text-xs text-gray-500">{po.items.length} items</p>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(po.status)} variant="secondary">
              {po.status}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">{po.currency} {po.totalAmount?.toLocaleString() || "0"}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium">{po.orderDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Expected Delivery:</span>
            <span className="font-medium">{po.expectedDelivery}</span>
          </div>
          {po.shipping && (
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">{po.shipping.method}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Status:</span>
            <span className="font-medium">{po.payment.paymentStatus}</span>
          </div>
        </div>

        {po.shipping?.trackingNumber && (
          <div className="mt-3 pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Truck className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-gray-600">Tracking: {po.shipping.trackingNumber}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{po.shipping.currentLocation}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-3 pt-2 border-t">
          <span className="text-xs text-gray-500">Last update: {po.shipping?.lastUpdate || po.orderDate}</span>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); setSelectedPO(po); }}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); router.push('/purchasing/create-order?edit=' + po.id); }}>
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Truck className="h-6 w-6 mr-2 text-blue-600" />
              Purchasing & Vendor Management
            </h1>
            <Badge className="bg-blue-100 text-blue-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              {stats.activeVendors} Active Vendors
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/purchasing/reports')}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/purchasing/reports')}>
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
            <Dialog open={isNewVendorDialogOpen} onOpenChange={setIsNewVendorDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Vendor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                  <DialogDescription>
                    Create a comprehensive vendor profile for purchasing management
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vendor Name *</Label>
                      <Input placeholder="Company name" />
                    </div>
                    <div>
                      <Label>Arabic Name</Label>
                      <Input placeholder="الاسم بالعربية" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vendor Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="raw_materials">Raw Materials</SelectItem>
                          <SelectItem value="packaging">Packaging & Supplies</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input placeholder="e.g., Oud Supplier, Packaging" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Contact Person</Label>
                      <Input placeholder="Primary contact name" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" placeholder="contact@vendor.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Phone</Label>
                      <Input placeholder="+XXX-XXX-XXXX" />
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uae">UAE</SelectItem>
                          <SelectItem value="india">India</SelectItem>
                          <SelectItem value="bulgaria">Bulgaria</SelectItem>
                          <SelectItem value="cambodia">Cambodia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Textarea placeholder="Complete vendor address..." />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewVendorDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsNewVendorDialogOpen(false)}>
                      Create Vendor
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Vendors</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalVendors}</p>
                  <p className="text-xs text-gray-500">{stats.activeVendors} active</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Purchase Orders</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.totalPOs}</p>
                  <p className="text-xs text-gray-500">{stats.pendingPOs} pending</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total PO Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">AED {stats.totalPOValue?.toLocaleString() || "0"}</p>
                  <p className="text-xs text-gray-500">current orders</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Performance</p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.avgVendorRating.toFixed(1)}/5.0</p>
                  <p className="text-xs text-gray-500">{stats.onTimeDelivery.toFixed(1)}% on-time</p>
                </div>
                <Award className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vendors/orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={vendorTypeFilter} onValueChange={setVendorTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="raw materials">Raw Materials</SelectItem>
                  <SelectItem value="packaging & supplies">Packaging & Supplies</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Vendors ({vendorsDatabase.length})</TabsTrigger>
            <TabsTrigger value="orders">Purchase Orders ({purchaseOrders.length})</TabsTrigger>
            <TabsTrigger value="imports">Import Tracking</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Recent Purchase Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {purchaseOrders.slice(0, 3).map(po => (
                      <div key={po.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <h4 className="font-medium text-sm">{po.id}</h4>
                          <p className="text-xs text-gray-600">{po.vendorName}</p>
                          <p className="text-xs text-gray-500">{po.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{po.currency} {po.totalAmount?.toLocaleString() || "0"}</p>
                          <p className="text-xs text-gray-500">{po.expectedDelivery}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Top Performing Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vendorsDatabase
                      .sort((a, b) => b.performance.reliabilityScore - a.performance.reliabilityScore)
                      .slice(0, 3)
                      .map(vendor => (
                        <div key={vendor.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <h4 className="font-medium text-sm">{vendor.name}</h4>
                            <p className="text-xs text-gray-600">{vendor.category}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(Math.floor(vendor.rating))].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                              ))}
                              <span className="text-xs text-gray-500">({vendor.rating})</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{vendor.performance.onTimeDelivery}%</p>
                            <p className="text-xs text-gray-500">On-time delivery</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Ship className="h-5 w-5 mr-2" />
                    Shipments in Transit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {purchaseOrders.filter(po => po.status === 'In Transit').map(po => (
                      <div key={po.id} className="p-3 border rounded">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-sm">{po.id}</h4>
                          <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                            {po.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{po.shipping?.currentLocation}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Tracking: {po.shipping?.trackingNumber}</span>
                          <span>ETA: {po.expectedDelivery}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Alerts & Actions Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Document Renewal Required</span>
                      </div>
                      <p className="text-xs text-yellow-700 ml-6">Bulgarian Rose Company - Organic Certificate expires in 30 days</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Payment Due</span>
                      </div>
                      <p className="text-xs text-blue-700 ml-6">PO-2024-001 - Balance payment due in 5 days</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Quality Inspection Scheduled</span>
                      </div>
                      <p className="text-xs text-green-700 ml-6">PO-2024-001 - Inspection scheduled for tomorrow</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="mt-6">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Vendor Directory</h3>
              <Dialog open={isNewVendorDialogOpen} onOpenChange={setIsNewVendorDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Vendor
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredVendors().map(renderVendorCard)}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Purchase Orders</h3>
              <Dialog open={isNewPODialogOpen} onOpenChange={setIsNewPODialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Create PO
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>
                      Create a new purchase order for vendor
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Select Vendor</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose vendor" />
                          </SelectTrigger>
                          <SelectContent>
                            {vendorsDatabase.map(vendor => (
                              <SelectItem key={vendor.id} value={vendor.id}>
                                {vendor.name} - {vendor.category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Expected Delivery Date</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AED">AED</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea placeholder="Special instructions, quality requirements..." />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsNewPODialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsNewPODialogOpen(false)}>
                        Create Order
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchaseOrders.map(renderPOCard)}
            </div>
          </TabsContent>

          <TabsContent value="imports" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Ship className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">2</p>
                    <p className="text-sm text-gray-600">In Transit</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Package className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-sm text-gray-600">At Customs</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl font-bold text-green-600">5</p>
                    <p className="text-sm text-gray-600">Cleared</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl font-bold text-red-600">0</p>
                    <p className="text-sm text-gray-600">Issues</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Import Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Tracking Number</TableHead>
                        <TableHead>Current Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>ETA</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseOrders.map(po => (
                        <TableRow key={po.id}>
                          <TableCell className="font-medium">{po.id}</TableCell>
                          <TableCell>{po.vendorName}</TableCell>
                          <TableCell>{po.shipping?.trackingNumber || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(po.status)} variant="secondary">
                              {po.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{po.shipping?.currentLocation || 'N/A'}</TableCell>
                          <TableCell>{po.expectedDelivery}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    UAE Import Regulations Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Required Documents</h4>
                      <div className="space-y-2">
                        {importRegulations.uae.requiredDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Duty Rates</h4>
                      <div className="space-y-2">
                        {Object.entries(importRegulations.uae.dutyRates).map(([category, rate]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-sm">{category}:</span>
                            <Badge variant="outline">{rate}%</Badge>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">UAE VAT:</span>
                          <Badge variant="outline">{importRegulations.uae.vatRate}%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vendor Compliance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Business License</TableHead>
                        <TableHead>Export License</TableHead>
                        <TableHead>Quality Certificates</TableHead>
                        <TableHead>Insurance</TableHead>
                        <TableHead>Overall Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorsDatabase.map(vendor => (
                        <TableRow key={vendor.id}>
                          <TableCell className="font-medium">{vendor.name}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800" variant="secondary">
                              Valid
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800" variant="secondary">
                              Valid
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800" variant="secondary">
                              {vendor.businessInfo.certifications.length} Active
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800" variant="secondary">
                              Covered
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800" variant="secondary">
                              Compliant
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Vendor Detail Dialog */}
      {selectedVendor && (
        <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                {selectedVendor.name} - {selectedVendor.vendorCode}
              </DialogTitle>
              <DialogDescription>
                {selectedVendor.nameArabic} • {selectedVendor.category}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Vendor Name:</span>
                        <span className="font-medium">{selectedVendor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arabic Name:</span>
                        <span className="font-medium">{selectedVendor.nameArabic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vendor Code:</span>
                        <span className="font-medium">{selectedVendor.vendorCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{selectedVendor.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium">{selectedVendor.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(Math.floor(selectedVendor.rating))].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                          ))}
                          <span className="text-xs">({selectedVendor.rating})</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Established:</span>
                        <span className="font-medium">{selectedVendor.establishedYear}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Primary Contact:</span>
                        <span className="font-medium">{selectedVendor.contactInfo.primaryContact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Title:</span>
                        <span className="font-medium">{selectedVendor.contactInfo.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-medium">{selectedVendor.contactInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-medium">{selectedVendor.contactInfo.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WhatsApp:</span>
                        <span className="font-medium">{selectedVendor.contactInfo.whatsapp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Website:</span>
                        <span className="font-medium">{selectedVendor.contactInfo.website}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Addresses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedVendor.addresses.map((address: any, index: number) => (
                      <div key={index} className="p-3 border rounded">
                        <Badge variant="outline" className="mb-2">{address.type}</Badge>
                        <p className="text-sm">{address.street}</p>
                        <p className="text-sm">{address.area}, {address.city}</p>
                        <p className="text-sm">{address.state && `${address.state}, `}{address.country} {address.postalCode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="products" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Product Categories & Pricing</h4>
                  {selectedVendor.productCategories.map((category: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">{category.category}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Grades:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {category.grades.map((grade: string, gradeIndex: number) => (
                                <Badge key={gradeIndex} variant="outline" className="text-xs">
                                  {grade}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Min Order:</span>
                            <p className="font-medium">{category.minOrderQuantity} {category.category.includes('Oil') ? 'kg' : 'units'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Lead Time:</span>
                            <p className="font-medium">{category.leadTime} days</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Price Range:</span>
                            <p className="font-medium">AED {category.priceRange.min} - {category.priceRange.max}</p>
                          </div>
                        </div>
                        {category.qualityCertificate && (
                          <div className="mt-2">
                            <Badge className="bg-green-100 text-green-800" variant="secondary">
                              <Shield className="h-3 w-3 mr-1" />
                              Quality Certified
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Orders:</span>
                        <span className="font-bold text-blue-600">{selectedVendor.performance.totalOrders}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Value:</span>
                        <span className="font-bold text-green-600">AED {selectedVendor.performance.totalValue?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Order Value:</span>
                        <span className="font-bold">AED {selectedVendor.performance.averageOrderValue?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Last Order:</span>
                        <span className="font-medium">{selectedVendor.performance.lastOrderDate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Quality & Reliability</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>On-time Delivery:</span>
                          <span>{selectedVendor.performance.onTimeDelivery}%</span>
                        </div>
                        <Progress value={selectedVendor.performance.onTimeDelivery} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quality Score:</span>
                          <span>{selectedVendor.performance.qualityScore}/5.0</span>
                        </div>
                        <Progress value={selectedVendor.performance.qualityScore * 20} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Reliability Score:</span>
                          <span>{selectedVendor.performance.reliabilityScore}/5.0</span>
                        </div>
                        <Progress value={selectedVendor.performance.reliabilityScore * 20} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Return Rate:</span>
                        <span className="font-medium">{selectedVendor.performance.returnRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Response Time:</span>
                        <span className="font-medium">{selectedVendor.performance.responseTime} hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Recent Activity</h4>
                  {selectedVendor.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <h5 className="font-medium text-sm">{activity.type}</h5>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(activity.status)} variant="secondary">
                          {activity.status}
                        </Badge>
                        {activity.value && (
                          <p className="text-sm font-medium text-green-600 mt-1">AED {activity.value?.toLocaleString() || "0"}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Business Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedVendor.documents.map((doc: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-sm">{doc.type}</h5>
                            <Badge className={getStatusColor(doc.status)} variant="secondary">
                              {doc.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Number:</span>
                              <span className="font-medium">{doc.number}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Issue Date:</span>
                              <span className="font-medium">{doc.issueDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Expiry Date:</span>
                              <span className="font-medium">{doc.expiryDate}</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button variant="outline" size="sm" className="w-full">
                              <FileText className="h-3 w-3 mr-1" />
                              View Document
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Payment Terms</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Credit Days:</span>
                        <span className="font-medium">{selectedVendor.paymentTerms.creditDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credit Limit:</span>
                        <span className="font-medium">{selectedVendor.paymentTerms.currency} {selectedVendor.paymentTerms.creditLimit?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Currency:</span>
                        <span className="font-medium">{selectedVendor.paymentTerms.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount Terms:</span>
                        <span className="font-medium">{selectedVendor.paymentTerms.discountTerms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Late Fee Rate:</span>
                        <span className="font-medium">{selectedVendor.paymentTerms.lateFeeRate}% per month</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Banking Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Bank Name:</span>
                        <span className="font-medium">{selectedVendor.businessInfo.bankDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Account Number:</span>
                        <span className="font-medium">{selectedVendor.businessInfo.bankDetails.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SWIFT Code:</span>
                        <span className="font-medium">{selectedVendor.businessInfo.bankDetails.swiftCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IBAN:</span>
                        <span className="font-medium">{selectedVendor.businessInfo.bankDetails.iban}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Risk Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {Object.entries(selectedVendor.riskAssessment).filter(([key, value]) => !Array.isArray(value) && key !== 'lastAssessment').map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <Badge
                            className={`${
                              value === 'Low' ? 'bg-green-100 text-green-800' :
                              value === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                            variant="secondary"
                          >
                            {value as string}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="text-sm font-medium">Risk Factors:</span>
                      <div className="mt-1 space-y-1">
                        {selectedVendor.riskAssessment.riskFactors.map((factor: string, index: number) => (
                          <div key={index} className="text-xs text-gray-600">• {factor}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedVendor(null)}>
                Close
              </Button>
              <Button variant="outline" onClick={() => alert('Edit vendor: ' + selectedVendor.name)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit Vendor
              </Button>
              <Button onClick={() => router.push('/purchasing/create-order?vendor=' + selectedVendor.id)}>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Create Purchase Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Purchase Order Detail Dialog */}
      {selectedPO && (
        <Dialog open={!!selectedPO} onOpenChange={() => setSelectedPO(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {selectedPO.id} - Purchase Order Details
              </DialogTitle>
              <DialogDescription>
                {selectedPO.vendorName} • {selectedPO.currency} {selectedPO.totalAmount?.toLocaleString() || "0"}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Tracking</TabsTrigger>
                <TabsTrigger value="payment">Payment & Finance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Order ID:</span>
                        <span className="font-medium">{selectedPO.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vendor:</span>
                        <span className="font-medium">{selectedPO.vendorName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order Date:</span>
                        <span className="font-medium">{selectedPO.orderDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Delivery:</span>
                        <span className="font-medium">{selectedPO.expectedDelivery}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className={getStatusColor(selectedPO.status)} variant="secondary">
                          {selectedPO.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <Badge variant="outline" className={`${
                          selectedPO.priority === 'High' ? 'border-red-300 text-red-800' :
                          selectedPO.priority === 'Medium' ? 'border-yellow-300 text-yellow-800' :
                          'border-green-300 text-green-800'
                        }`}>
                          {selectedPO.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Financial Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-bold text-green-600">{selectedPO.currency} {selectedPO.totalAmount?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Currency:</span>
                        <span className="font-medium">{selectedPO.currency}</span>
                      </div>
                      {selectedPO.customs && (
                        <>
                          <div className="flex justify-between">
                            <span>Duty Amount:</span>
                            <span className="font-medium">AED {selectedPO.customs.dutyAmount?.toLocaleString() || "0"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>VAT Amount:</span>
                            <span className="font-medium">AED {selectedPO.customs.vatAmount?.toLocaleString() || "0"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Taxes:</span>
                            <span className="font-medium">AED {selectedPO.customs.totalTaxes?.toLocaleString() || "0"}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="items" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Specifications</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPO.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.productCode}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity} {item.unit}</TableCell>
                        <TableCell>{selectedPO.currency} {item.unitPrice?.toLocaleString() || "0"}</TableCell>
                        <TableCell>{selectedPO.currency} {item.totalPrice?.toLocaleString() || "0"}</TableCell>
                        <TableCell className="text-xs">{item.specifications}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="shipping" className="mt-4">
                <div className="space-y-4 sm:space-y-6">
                  {selectedPO.shipping && (
                    <div>
                      <h4 className="font-semibold mb-3">Shipping Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Method:</span>
                            <span className="font-medium">{selectedPO.shipping.method}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Carrier:</span>
                            <span className="font-medium">{selectedPO.shipping.carrier}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tracking Number:</span>
                            <span className="font-medium">{selectedPO.shipping.trackingNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Origin:</span>
                            <span className="font-medium">{selectedPO.shipping.origin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Destination:</span>
                            <span className="font-medium">{selectedPO.shipping.destination}</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Transit Time:</span>
                            <span className="font-medium">{selectedPO.shipping.estimatedTransitDays} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Location:</span>
                            <span className="font-medium">{selectedPO.shipping.currentLocation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Update:</span>
                            <span className="font-medium">{selectedPO.shipping.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPO.customs && (
                    <div>
                      <h4 className="font-semibold mb-3">Customs Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Declaration No:</span>
                            <span className="font-medium">{selectedPO.customs.customsDeclaration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>HS Code:</span>
                            <span className="font-medium">{selectedPO.customs.hsCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Clearance Status:</span>
                            <Badge className={getStatusColor(selectedPO.customs.clearanceStatus)} variant="secondary">
                              {selectedPO.customs.clearanceStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Duty Rate:</span>
                            <span className="font-medium">{selectedPO.customs.dutyRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>VAT Rate:</span>
                            <span className="font-medium">{selectedPO.customs.vatRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expected Clearance:</span>
                            <span className="font-medium">{selectedPO.customs.expectedClearance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPO.quality && (
                    <div>
                      <h4 className="font-semibold mb-3">Quality Control</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Inspection Required:</span>
                          <span className="font-medium">{selectedPO.quality.inspectionRequired ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inspector:</span>
                          <span className="font-medium">{selectedPO.quality.inspector}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inspection Date:</span>
                          <span className="font-medium">{selectedPO.quality.inspectionDate || 'Not scheduled'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality Grade:</span>
                          <span className="font-medium">{selectedPO.quality.qualityGrade || 'Pending'}</span>
                        </div>
                        {selectedPO.quality.notes && (
                          <div className="mt-2">
                            <span className="text-gray-600">Notes:</span>
                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{selectedPO.quality.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="payment" className="mt-4">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Payment Terms & Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Payment Terms:</span>
                          <span className="font-medium">{selectedPO.payment.terms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Status:</span>
                          <Badge className={getStatusColor(selectedPO.payment.paymentStatus)} variant="secondary">
                            {selectedPO.payment.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Due Date:</span>
                          <span className="font-medium">{selectedPO.payment.dueDate}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Advance Paid:</span>
                          <span className="font-medium text-green-600">{selectedPO.currency} {selectedPO.payment.advancePaid?.toLocaleString() || "0"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Balance Due:</span>
                          <span className="font-medium text-orange-600">{selectedPO.currency} {selectedPO.payment.balanceDue?.toLocaleString() || "0"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Payment Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Payment Progress:</span>
                        <span>{((selectedPO.payment.advancePaid / selectedPO.totalAmount) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(selectedPO.payment.advancePaid / selectedPO.totalAmount) * 100} />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Paid: {selectedPO.currency} {selectedPO.payment.advancePaid?.toLocaleString() || "0"}</span>
                        <span>Total: {selectedPO.currency} {selectedPO.totalAmount?.toLocaleString() || "0"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedPO(null)}>
                Close
              </Button>
              <Button variant="outline" onClick={() => router.push('/purchasing/create-order?edit=' + selectedPO.id)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit Order
              </Button>
              <Button onClick={() => alert('Update status for PO: ' + selectedPO.id)}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Update Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}