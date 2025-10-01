# Supply Chain & Procurement System

## Overview

The Perfume & Oud ERP system now includes a comprehensive supply chain and procurement management system optimized for the perfume and oud industry. The system supports international suppliers from key regions (India, Cambodia, Myanmar for oud) and local UAE distributors, with full UAE customs and trade compliance.

## Key Features

### 1. Comprehensive Supplier Database
- **Local & International Suppliers**: Support for UAE local suppliers and international suppliers from India, Cambodia, Myanmar, and other regions
- **Supplier Classification**: Local, Regional, International, Manufacturer, Distributor, Agent
- **Performance Scoring**: Automated performance metrics (0-100 scale) based on delivery, quality, and service
- **Rating System**: 5-star rating system with detailed evaluations
- **Compliance Management**: Track certifications, licenses, and compliance status
- **Multi-language Support**: Arabic and English names for UAE market

**Location**: `/components/suppliers/SupplierManagement.tsx`, `/components/suppliers/SupplierDetails.tsx`

### 2. Purchase Orders & Approval Workflows
- **Automated PO Generation**: AI-powered suggestions based on reorder points and sales trends
- **Approval Workflows**: Multi-level approval process with configurable rules
- **Priority Management**: Low, Medium, High, Urgent priority levels
- **Order Types**: Regular, Urgent, Blanket orders, Long-term contracts
- **Real-time Status Tracking**: From draft to completion
- **Multi-currency Support**: AED, USD, EUR with automatic conversions

**Location**: `/components/purchase-orders/PurchaseOrderManagement.tsx`

### 3. Import/Export Documentation
- **HS Code Management**: Complete database of Harmonized System codes for perfume and oud materials
- **UAE Customs Compliance**: Built-in UAE customs requirements and documentation
- **CITES Integration**: Support for endangered species permits (essential for certain oud varieties)
- **Document Templates**: Commercial invoice, packing list, certificate of origin, import licenses
- **Duty Calculator**: Automatic calculation of UAE customs duties and VAT
- **Digital Document Storage**: Secure cloud storage for all trade documents

**Location**: `/components/customs/ImportExportDocuments.tsx`

### 4. AI-Powered Purchase Suggestions
- **Sales Trend Analysis**: Machine learning algorithms analyze sales patterns
- **Seasonal Forecasting**: Predicts demand for Ramadan, Eid, and other cultural seasons
- **Inventory Optimization**: Suggests optimal stock levels based on lead times
- **Market Intelligence**: Social media sentiment analysis for trending fragrances
- **Supplier Recommendations**: AI suggests best suppliers based on performance metrics
- **Cost Optimization**: Identifies opportunities for bulk discounts and better pricing

**Location**: `/components/procurement/PurchaseSuggestions.tsx`

### 5. Shipment & Delivery Tracking
- **Multi-carrier Support**: Integration with Aramex, DHL, FedEx, UPS, Emirates Post
- **Real-time Tracking**: Live shipment status updates from carriers
- **Customs Clearance Monitoring**: Track shipments through UAE customs
- **Delivery Performance**: Monitor on-time delivery rates and supplier performance
- **Exception Management**: Automated alerts for delays and issues
- **Document Tracking**: Track all shipping documents and customs paperwork

**Location**: `/components/shipments/ShipmentTracking.tsx`

### 6. Quality Control System
- **Incoming Inspection**: Systematic quality checks for all received materials
- **Material-specific Standards**: Different quality criteria for oud, essential oils, packaging
- **Visual, Fragrance, Chemical Testing**: Comprehensive quality assessment protocols
- **Grade Classification**: A-Premium, B-Standard, C-Basic, Rejected grades
- **Batch Tracking**: Full traceability from supplier to finished product
- **Quality Reports**: Detailed quality analytics and supplier scorecards

**Location**: `/components/quality/QualityControl.tsx`

### 7. Supplier Portal
- **Self-service Portal**: Suppliers can view orders, invoices, and shipments
- **Real-time Communication**: Messaging system between buyers and suppliers
- **Document Sharing**: Secure document exchange platform
- **Performance Dashboard**: Suppliers can track their own performance metrics
- **Order Acknowledgment**: Electronic PO confirmation system
- **Invoice Management**: Digital invoice submission and tracking

**Location**: `/components/suppliers/SupplierPortal.tsx`

### 8. Procurement Analytics Dashboard
- **Spend Analysis**: Comprehensive spending analytics by category, supplier, time
- **Performance Metrics**: KPIs for procurement efficiency and supplier performance
- **Cost Savings Tracking**: Monitor achieved savings through negotiations and optimizations
- **Market Trends**: Industry insights and market intelligence
- **Risk Management**: Supplier risk assessment and mitigation strategies
- **ROI Analysis**: Return on investment for procurement initiatives

**Location**: `/components/procurement/ProcurementDashboard.tsx`

## Database Schema

### Core Models

#### Supplier Model
```prisma
model Supplier {
  id                  String               @id @default(cuid())
  code                String               @unique
  name                String
  nameAr              String?
  type                SupplierType
  category            String
  contactPerson       String?
  email               String?
  phone               String?

  // Performance Metrics
  performanceScore    Decimal              @default(0)
  rating              Decimal              @default(0)
  totalOrders         Int                  @default(0)
  onTimeDeliveries    Int                  @default(0)
  qualityScore        Decimal              @default(0)

  // Financial Terms
  paymentTerms        String?
  creditLimit         Decimal              @default(0)
  currency            String               @default("AED")

  // Compliance
  complianceStatus    ComplianceStatus     @default(PENDING)
  certifications      Json?

  // Relations
  purchaseOrders      PurchaseOrder[]
  supplierProducts    SupplierProduct[]
  evaluations         SupplierEvaluation[]
  shipments           Shipment[]
}
```

#### Purchase Order Model
```prisma
model PurchaseOrder {
  id                  String               @id @default(cuid())
  poNumber            String               @unique
  supplierId          String
  status              PurchaseOrderStatus  @default(DRAFT)
  priority            Priority             @default(MEDIUM)
  type                PurchaseOrderType    @default(REGULAR)

  // Financial
  subtotal            Decimal              @default(0)
  vatAmount           Decimal              @default(0)
  totalAmount         Decimal              @default(0)
  currency            String               @default("AED")

  // Relations
  supplier            Supplier
  items               PurchaseOrderItem[]
  receipts            GoodsReceipt[]
  shipments           Shipment[]
}
```

#### Shipment Model
```prisma
model Shipment {
  id                  String         @id @default(cuid())
  shipmentNo          String         @unique
  carrier             ShippingCarrier
  trackingNumber      String?
  status              ShipmentStatus

  // Import/Export Documentation
  hsCode              String?
  customsDeclaration  String?
  commercialInvoice   String?
  certificateOrigin   String?
  importLicense       String?

  // Relations
  trackingEvents      ShipmentTracking[]
  documents           ShipmentDocument[]
}
```

### Enums

```prisma
enum SupplierType {
  LOCAL           // UAE suppliers
  REGIONAL        // GCC suppliers
  INTERNATIONAL   // Global suppliers
  MANUFACTURER
  DISTRIBUTOR
  AGENT
}

enum PurchaseOrderStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  SENT
  ACKNOWLEDGED
  PARTIALLY_RECEIVED
  RECEIVED
  COMPLETED
  CANCELLED
}

enum ShippingCarrier {
  ARAMEX
  DHL
  FEDEX
  UPS
  EMIRATES_POST
  ROAD_TRANSPORT
  SEA_FREIGHT
  AIR_FREIGHT
  OTHER
}
```

## API Endpoints

### Suppliers
- `GET /api/suppliers` - List suppliers with filtering and pagination
- `POST /api/suppliers` - Create new supplier
- `GET /api/suppliers/[id]` - Get supplier details
- `PUT /api/suppliers/[id]` - Update supplier
- `DELETE /api/suppliers/[id]` - Deactivate supplier

### Purchase Orders
- `GET /api/purchase-orders` - List purchase orders
- `POST /api/purchase-orders` - Create new purchase order
- `GET /api/purchase-orders/[id]` - Get PO details
- `PUT /api/purchase-orders/[id]` - Update purchase order
- `POST /api/purchase-orders/[id]/approve` - Approve purchase order

### Shipments
- `GET /api/shipments` - List shipments
- `POST /api/shipments/track` - Track shipment by number
- `GET /api/shipments/[id]/documents` - Get shipment documents

### Quality Control
- `GET /api/quality-checks` - List quality checks
- `POST /api/quality-checks` - Create quality check
- `PUT /api/quality-checks/[id]` - Update quality check results

## UAE-Specific Features

### Customs Compliance
- **HS Code Database**: Complete UAE HS code classification for perfumes and oud
- **Duty Calculator**: Automatic UAE customs duty and VAT calculation
- **CITES Support**: Required permits for endangered oud species
- **UAE Standards**: Compliance with UAE quality and safety standards

### Cultural Considerations
- **Arabic Language Support**: Bilingual interface and documentation
- **Islamic Calendar**: Support for Hijri dates and Islamic holidays
- **Ramadan Planning**: Special inventory planning for Ramadan season
- **Local Suppliers**: Priority support for UAE-based suppliers

### Currency & Payments
- **AED Primary**: UAE Dirham as default currency
- **Multi-currency**: Support for USD, EUR, INR for international suppliers
- **Islamic Finance**: Sharia-compliant payment terms and structures
- **Local Banking**: Integration with UAE banking systems

## Integration Points

### External Systems
1. **Carrier APIs**: Real-time tracking integration
2. **UAE Customs**: Electronic customs declaration system
3. **Banking**: Payment processing and foreign exchange
4. **ERP Systems**: Integration with existing business systems

### Internal Modules
1. **Inventory Management**: Automatic stock updates
2. **Finance**: Cost accounting and payment processing
3. **Production**: Material requirement planning
4. **Sales**: Demand forecasting integration

## Performance Metrics

### Supplier KPIs
- On-time delivery rate
- Quality score (0-100)
- Response time (hours)
- Cost competitiveness
- Compliance status

### Procurement KPIs
- Cost savings achieved
- Purchase order cycle time
- Supplier diversity
- Risk mitigation effectiveness
- Process automation rate

## Security & Compliance

### Data Protection
- Encrypted data storage
- Secure API communications
- Role-based access control
- Audit trail logging

### Regulatory Compliance
- UAE VAT compliance
- International trade regulations
- CITES compliance for endangered species
- Industry-specific quality standards

## Future Enhancements

1. **Blockchain Integration**: Supply chain transparency and traceability
2. **IoT Sensors**: Real-time shipment monitoring
3. **Advanced AI**: Predictive analytics and demand planning
4. **Mobile Apps**: Mobile applications for suppliers and field staff
5. **Sustainability Tracking**: Environmental impact monitoring

## Installation & Setup

1. **Database Migration**: Run Prisma migrations to create supply chain tables
2. **Seed Data**: Import initial supplier and HS code data
3. **Configuration**: Set up carrier API keys and customs integration
4. **Testing**: Verify all integrations and workflows
5. **Training**: User training on new procurement processes

## Support & Documentation

- **User Manual**: Comprehensive user guide for all features
- **API Documentation**: Complete API reference with examples
- **Training Videos**: Step-by-step tutorial videos
- **Support Portal**: 24/7 support for technical issues
- **Best Practices**: Industry-specific procurement guidelines

This supply chain system transforms the perfume and oud business operations with modern, automated, and compliant procurement processes optimized for the UAE market and international trade requirements.