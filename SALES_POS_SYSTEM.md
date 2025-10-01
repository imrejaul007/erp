# Oud PMS - Complete Sales & POS System

A comprehensive Sales & Point of Sale system designed specifically for Perfume & Oud retail businesses in the UAE market.

## 🚀 System Overview

This is a complete, production-ready Sales & POS system that includes:

### 📱 **POS Terminal** (`/components/pos/POSTerminal.jsx`)
- Modern touch-friendly interface optimized for tablets
- Real-time inventory integration
- Multi-currency support (AED focus)
- Integrated barcode scanning
- Customer lookup and loyalty management

### 🔍 **Barcode Scanner** (`/components/pos/BarcodeScanner.jsx`)
- Camera-based scanning using device camera
- USB scanner support for traditional hardware
- Manual barcode entry fallback
- QuaggaJS integration for multiple barcode formats

### 🛍️ **Product Search** (`/components/pos/ProductSearch.jsx`)
- Advanced filtering (category, brand, price, stock)
- Touch-optimized grid and list views
- Quick filter buttons for perfume categories
- Real-time search with debouncing

### 🛒 **Shopping Cart** (`/components/pos/ShoppingCartComponent.jsx`)
- Real-time cart updates
- Individual item discounts
- Quantity editing with touch controls
- VAT calculation display

### 💳 **Payment Processor** (`/components/pos/PaymentProcessor.jsx`)
- Multiple payment methods (cash, card, digital wallets)
- Loyalty points redemption
- Change calculation
- Payment validation

### 👥 **Customer Management** (`/components/pos/CustomerLookup.jsx`)
- Customer search and selection
- New customer creation
- Loyalty tier display
- Purchase history integration

## 🗄️ **Database Models**

### Sales Models (`/models/sales.js`)
- **SalesTransaction**: Complete transaction records
- **Return**: Return/refund management
- **Promotion**: Marketing campaigns and discounts
- **Loyalty**: Customer loyalty program

### Pricing Models (`/models/pricing.js`)
- **PricingTier**: Multi-tier pricing (retail, wholesale, B2B)
- **ProductPricing**: Product-specific pricing rules
- **ExchangeRate**: Multi-currency support
- **PriceRule**: Dynamic pricing automation

### Invoice Models (`/models/invoice.js`)
- **Invoice**: UAE VAT-compliant invoicing
- **InvoiceSequence**: Auto-numbering system
- **InvoiceTemplate**: Customizable templates

## ⚙️ **Core Services**

### 🧾 **Receipt Generator** (`/services/ReceiptGenerator.js`)
- PDF receipt generation with PDFKit
- Thermal receipt support (80mm)
- UAE VAT compliance with QR codes
- Email receipt functionality
- Multi-language support (English/Arabic)

### 💱 **Currency Service** (`/services/CurrencyService.js`)
- Multi-currency support (12 currencies)
- Real-time exchange rates from multiple APIs
- AED-focused with international support
- Currency-specific rounding rules
- Fallback rates for offline operation

### 🧮 **VAT Calculator** (`/services/VATCalculatorService.js`)
- UAE 5% VAT standard compliance
- Zero-rated and exempt category handling
- Line-item and transaction-level calculations
- VAT reporting and audit trails
- ZATCA QR code generation

### 🎯 **Promotions Engine** (`/services/PromotionsEngine.js`)
- Multiple promotion types:
  - Percentage discounts
  - Fixed amount discounts
  - Buy X Get Y offers
  - Bundle pricing
  - Tiered discounts
  - Loyalty-based promotions
- Automatic promotion matching
- Priority-based application
- Usage tracking and analytics

## 🌐 **API Routes** (`/routes/sales.js`)

### POS Operations
- `POST /api/sales/pos/transaction` - Create new sale
- `GET /api/sales/pos/transactions` - List transactions
- `POST /api/sales/pos/transaction/:id/receipt` - Generate receipt

### Invoice Management
- `POST /api/sales/invoices/from-transaction/:id` - Create invoice
- `GET /api/sales/invoices` - List invoices

### Promotions
- `POST /api/sales/promotions/applicable` - Get applicable promotions
- `POST /api/sales/promotions` - Create promotion

### Returns & Refunds
- `POST /api/sales/returns` - Create return
- `PATCH /api/sales/returns/:id/approve` - Approve return

### Reporting
- `GET /api/sales/reports/sales` - Sales analytics
- `GET /api/sales/reports/vat` - VAT reporting

## 🎯 **Key Features**

### UAE VAT Compliance
- 5% standard VAT rate
- Zero-rated exports and specific categories
- Exempt items (medical, education, financial)
- ZATCA-compliant QR codes on invoices
- Comprehensive VAT reporting

### Multi-Currency Support
- **Base Currency**: AED (UAE Dirham)
- **Supported**: USD, EUR, GBP, SAR, QAR, KWD, BHD, OMR, JPY, CNY, INR
- Real-time exchange rates with API integration
- Fallback rates for offline operation
- Currency-specific rounding (e.g., 5 fils for AED)

### Pricing Management
- **Retail**: Standard customer pricing
- **Wholesale**: Bulk pricing for resellers
- **VIP**: Premium customer discounts
- **Export**: International customer pricing
- **Staff**: Employee discounts
- Dynamic pricing based on rules
- Bulk pricing calculators

### Customer Loyalty System
- **5-Tier System**: Bronze, Silver, Gold, Platinum, Diamond
- **Point Earning**: 1% of purchase amount (100 AED = 100 points)
- **Point Redemption**: 10 points = 1 AED
- **Tier Benefits**: Percentage discounts based on tier
- **Complete Tracking**: Purchase history and point transactions

### Promotions & Discounts
- **Percentage Discounts**: % off products or categories
- **Fixed Amount**: Flat discount values
- **Buy X Get Y**: Quantity-based promotions
- **Bundle Deals**: Multi-product packages
- **Tiered Pricing**: Volume-based discounts
- **Seasonal Campaigns**: Time-limited offers
- **Customer Segmentation**: Targeted promotions

### Payment Processing
- **Cash**: With change calculation
- **Credit/Debit Cards**: Integration-ready
- **Digital Wallets**: Apple Pay, Google Pay, Samsung Pay
- **Bank Transfer**: Direct bank payments
- **Loyalty Points**: Point redemption
- **Split Payments**: Multiple payment methods per transaction

### Receipt & Invoice Generation
- **Thermal Receipts**: 80mm thermal printer support
- **A4 Receipts**: Standard paper receipts
- **Tax Invoices**: UAE VAT-compliant invoices
- **PDF Export**: Digital receipt delivery
- **Email Integration**: Automatic receipt delivery
- **QR Codes**: UAE ZATCA compliance

### Real-time Features
- **Inventory Updates**: Live stock level adjustments
- **Currency Rates**: Real-time exchange rate updates
- **Promotion Matching**: Automatic discount application
- **Loyalty Tracking**: Real-time point calculations
- **Multi-store Sync**: Centralized data management

## 📊 **Analytics & Reporting**

### Sales Reports
- Daily, weekly, monthly sales analysis
- Product performance tracking
- Customer purchase patterns
- Store comparison (multi-location)
- Cashier performance metrics

### VAT Reports
- UAE VAT return format compliance
- Rate-wise VAT breakdown
- Exempt and zero-rated tracking
- Complete audit trails
- ZATCA reporting format

### Customer Analytics
- Loyalty program performance
- Customer lifetime value
- Purchase frequency analysis
- Tier distribution and growth
- Retention metrics

### Inventory Reports
- Real-time stock levels
- Movement history and trends
- Reorder point alerts
- Inventory valuation
- Slow-moving item identification

## 🔒 **Security & Compliance**

### Data Security
- JWT-based authentication
- Role-based access control
- Audit logging for all transactions
- Data encryption for sensitive information
- Secure payment processing

### UAE Regulatory Compliance
- VAT registration number integration
- Tax invoice legal requirements
- 5-year record retention compliance
- Digital signature capabilities
- ZATCA QR code standards

### Business Compliance
- Multi-language support (English/Arabic)
- Islamic calendar integration
- Regional currency handling
- Local business practices
- Cultural considerations for perfume/oud industry

## 🚀 **Technology Stack**

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **PDF Generation**: PDFKit for receipts/invoices
- **QR Codes**: UAE VAT compliance
- **Currency APIs**: Multiple providers with fallback

### Frontend
- **Framework**: React.js with functional components
- **Icons**: Lucide React icon library
- **UI**: Touch-optimized responsive design
- **State Management**: React hooks with context
- **Real-time**: WebSocket integration ready

### Infrastructure
- **Deployment**: Docker-ready containerization
- **Scaling**: Microservice architecture support
- **Monitoring**: Error tracking and performance metrics
- **Backup**: Automated database backups
- **Caching**: Redis integration for performance

## 📱 **Mobile & Touch Optimization**

### Touch Interface
- Large, finger-friendly buttons
- Gesture support (swipe, pinch, tap)
- Visual feedback for interactions
- Optimized for tablet screens
- Responsive design for various screen sizes

### Mobile Features
- Camera barcode scanning
- Offline operation capabilities
- Touch-friendly number pads
- Swipe navigation
- Voice command integration ready

## 🔄 **Integration Capabilities**

### E-commerce Integration
- Online store synchronization
- Inventory level synchronization
- Order import/export
- Customer data synchronization
- Pricing consistency

### Third-party Integrations
- Payment gateway APIs
- Accounting software integration
- Email marketing platforms
- SMS notification services
- Business intelligence tools

### API Architecture
- RESTful API design
- Webhook support
- Rate limiting
- API versioning
- Comprehensive documentation

## 📈 **Performance & Scalability**

### Optimization Features
- Database indexing for fast queries
- Caching for frequently accessed data
- Lazy loading for large datasets
- Image optimization for product photos
- Compressed responses

### Scalability
- Horizontal scaling support
- Load balancing ready
- Database sharding capabilities
- CDN integration for assets
- Microservice architecture

## 🛠️ **Installation & Setup**

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Configure MongoDB connection
# Edit .env with your settings

# Start development server
npm run dev

# For production
npm run build
npm start
```

## 🎯 **Business Benefits**

### For Perfume & Oud Retailers
- **Industry-Specific**: Designed for perfume/oud business needs
- **Cultural Awareness**: Arabic language and cultural considerations
- **Regional Compliance**: UAE VAT and business law compliance
- **Multi-Store**: Support for chain operations
- **Luxury Focus**: Premium customer experience features

### Operational Efficiency
- **Fast Checkout**: Optimized POS workflow
- **Inventory Management**: Real-time stock tracking
- **Customer Retention**: Comprehensive loyalty program
- **Financial Control**: Detailed reporting and analytics
- **Staff Training**: Intuitive, easy-to-use interface

### Growth Support
- **Scalable Architecture**: Grows with your business
- **Multi-Currency**: International expansion ready
- **E-commerce Ready**: Online store integration
- **Analytics**: Data-driven business decisions
- **Automation**: Reduced manual processes

This complete Sales & POS system provides everything needed to run a modern perfume and oud retail business in the UAE, with full VAT compliance, multi-currency support, and comprehensive customer management features.