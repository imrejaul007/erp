# 🌟 Oud & Perfume ERP - Complete System Documentation

## 📊 System Overview

**Oud & Perfume ERP** is a comprehensive, enterprise-grade, multi-tenant ERP system specifically designed for perfume and oud businesses. Built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

### 📈 System Statistics
- **Total Pages**: 188 pages
- **API Endpoints**: 85+ REST APIs
- **Main Modules**: 32 feature modules
- **Database Tables**: 50+ models
- **User Roles**: 11 roles + 4 platform admin roles
- **Multi-tenant**: Complete data isolation per company
- **Mobile Responsive**: PWA-ready with offline support

---

## 🎯 Core Architecture

### Multi-Tenant SaaS Platform

```
┌─────────────────────────────────────────┐
│  Platform Admin Dashboard               │
│  (Software Provider - YOU)              │
│  - Manage all client companies          │
│  - Create new tenants                   │
│  - View system-wide analytics           │
│  - Control billing & subscriptions      │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Tenant 1       │     │  Tenant 2       │
│  Company A      │     │  Company B      │
│  - 5 stores     │     │  - 3 stores     │
│  - 20 users     │     │  - 10 users     │
│  - 1000 products│     │  - 500 products │
└─────────────────┘     └─────────────────┘
(Complete data isolation - cannot see each other)
```

---

## 🔐 Authentication & Access Control

### User Roles (11 Roles)

1. **SUPER_ADMIN** - Complete system access
2. **ADMIN** - Full operational access
3. **SALES_STAFF** - POS and sales operations
4. **INVENTORY_STAFF** - Stock management
5. **WAREHOUSE_STAFF** - Warehouse operations
6. **PRODUCTION_STAFF** - Manufacturing processes
7. **PURCHASING_STAFF** - Procurement
8. **FINANCE_STAFF** - Financial operations
9. **HR_STAFF** - Human resources
10. **CUSTOMER_SERVICE** - Customer support
11. **USER** - Basic access

### Platform Admin Roles (4 Roles)

1. **PLATFORM_OWNER** - Full system access (YOU)
2. **PLATFORM_ADMIN** - Tenant management
3. **SUPPORT_AGENT** - Customer support
4. **DEVELOPER** - Technical maintenance

### Login Credentials

**Tenant User (Default Demo):**
- URL: `http://localhost:3000/login` or `https://oud-erp.onrender.com/login`
- Email: `admin@oudperfume.ae`
- Password: `admin123`

**Platform Admin:**
- URL: `http://localhost:3000/platform/login`
- Email: `platform@oudperfume.ae`
- Password: `platform123`

---

## 📦 Feature Modules (32 Modules)

### 1. 🏠 Dashboard & Analytics
**Location**: `/dashboard`

**Features:**
- Real-time business metrics
- Sales performance charts
- Inventory status overview
- Revenue tracking
- Top products & customers
- Recent activities feed
- Quick action buttons
- Mobile-responsive widgets

**Key Metrics:**
- Total revenue
- Products sold
- Active customers
- Low stock alerts
- Pending orders
- Daily/weekly/monthly trends

---

### 2. 🛍️ Point of Sale (POS)
**Location**: `/pos`, `/sales`

**Features:**
- **Multi-channel POS**: Retail, Wholesale, Corporate
- **Offline Mode**: Works without internet
- **Barcode Scanning**: Quick product lookup
- **Multi-payment**: Cash, Card, Split payments
- **Discounts & Promotions**: Automatic application
- **Gift Cards**: Issue and redeem
- **Layaway/Installments**: Payment plans
- **Returns & Exchanges**: Full refund management
- **Receipt Printing**: Thermal & A4 printers
- **Customer Selection**: Quick customer lookup
- **Tax Calculation**: Automatic VAT/tax

**POS Types:**
- `/sales/retail` - Walk-in customers
- `/sales/wholesale` - Bulk orders
- `/sales/corporate` - B2B sales
- `/sales/pos-offline` - Offline transactions
- `/sales/subscriptions` - Recurring orders

---

### 3. 📦 Inventory Management
**Location**: `/inventory`

**Features:**
- **Product Management**: Add/edit/delete products
- **Category Management**: Hierarchical categories
- **Stock Tracking**: Real-time inventory levels
- **Stock Adjustments**: Manual corrections
- **Stock Transfers**: Between locations
- **Low Stock Alerts**: Automatic notifications
- **Barcode Management**: Generate & print barcodes
- **Batch Tracking**: Lot/batch numbers
- **Expiry Management**: Track shelf life
- **Multi-location**: Warehouse & store inventory
- **Stock Movement History**: Complete audit trail
- **Inventory Valuation**: FIFO/LIFO/Weighted avg

**Sub-modules:**
- `/inventory/products` - Product catalog
- `/inventory/categories` - Category tree
- `/inventory/stock-adjustment` - Manual adjustments
- `/inventory/stock-transfer` - Location transfers
- `/inventory/barcode` - Barcode scanner & generator
- `/inventory/batches` - Batch management
- `/inventory/low-stock` - Reorder alerts

---

### 4. 🏪 Multi-Location Management
**Location**: `/multi-location`

**Features:**
- **Store Management**: Multiple stores/warehouses
- **Location Hierarchy**: Main warehouse → branches
- **Store-specific Inventory**: Separate stock per location
- **Inter-store Transfers**: Stock movement
- **Location-based Pricing**: Different prices per store
- **Store Performance**: Individual analytics
- **User Assignment**: Staff per location
- **Opening/Closing**: Daily cash management

**Locations:**
- `/multi-location/stores` - Store list
- `/multi-location/transfers` - Transfer management
- `/multi-location/comparison` - Performance comparison

---

### 5. 👥 Customer Relationship Management (CRM)
**Location**: `/crm`, `/customers`

**Features:**
- **Customer Database**: Complete profiles
- **Segmentation**: VIP, Regular, Corporate
- **Loyalty Programs**: Points & rewards
- **Purchase History**: Complete order history
- **Communication Hub**: Email, SMS, WhatsApp
- **Birthday Reminders**: Automated wishes
- **Feedback Management**: Surveys & reviews
- **Complaint Tracking**: Support tickets
- **Corporate Accounts**: B2B management
- **Gift Registry**: Wedding/event registry
- **Customer Events**: VIP events & launches

**CRM Modules:**
- `/crm/comprehensive` - Full CRM dashboard
- `/crm/add-customer` - New customer form
- `/crm/loyalty` - Loyalty program
- `/crm/corporate` - Corporate clients
- `/crm/events` - Customer events
- `/crm/feedback` - Feedback system
- `/crm/gift-registry` - Gift registries
- `/customers` - Customer list

---

### 6. 👨‍💼 Suppliers & Procurement
**Location**: `/suppliers`, `/purchasing`

**Features:**
- **Supplier Management**: Vendor database
- **Purchase Orders**: PO creation & tracking
- **Receiving**: Goods receipt
- **Supplier Invoices**: Bill management
- **Payment Tracking**: Supplier payments
- **Supplier Performance**: Rating & analytics
- **Import Tracking**: International orders
- **Price Comparison**: Multi-supplier quotes
- **Contract Management**: Terms & agreements
- **Quality Control**: Inspection records

**Procurement:**
- `/suppliers` - Supplier list
- `/purchasing` - PO dashboard
- `/purchasing/create-order` - New PO
- `/purchasing/invoices` - Supplier bills
- `/purchasing/payments` - Payments
- `/purchasing/vendor-management` - Vendor details
- `/purchasing/import-tracking` - Import orders
- `/purchasing/reports` - Procurement reports

---

### 7. 🏭 Production Management
**Location**: `/production`

**Features:**
- **Perfume Production**: Complete workflow
- **Recipe Management**: Formulas & ingredients
- **Raw Materials**: Inventory tracking
- **Production Batches**: Batch processing
- **Quality Control**: Testing & approval
- **Packaging Management**: Bottling & labeling
- **Yield Reports**: Production efficiency
- **Cost Calculation**: Material + labor
- **R&D Lab**: New fragrance development
- **Segregation**: Failed batch management
- **Production Scheduling**: Capacity planning
- **Distillation Logs**: Oud processing

**Production Modules:**
- `/production` - Production dashboard
- `/production/perfume-production` - Perfume making
- `/production/recipes` - Formula management
- `/production/raw-material` - Materials inventory
- `/production/batches` - Batch tracking
- `/production/quality-control` - QC checks
- `/production/packaging` - Packaging
- `/production/yield-report` - Efficiency
- `/production/rd-experiments` - R&D lab
- `/production/scheduling` - Production schedule
- `/production/segregation` - Failed batches
- `/production/distillation` - Oud distillation

---

### 8. 💰 Financial Management
**Location**: `/finance`

**Features:**
- **Accounts Payable**: Supplier payments
- **Accounts Receivable**: Customer payments
- **Expense Tracking**: Operating costs
- **Petty Cash**: Cash management
- **Bank Reconciliation**: Statement matching
- **Financial Reports**: P&L, Balance Sheet
- **Budgeting**: Budget planning & variance
- **Tax Management**: VAT/GST tracking
- **Payroll Integration**: Salary payments
- **Invoice Management**: AR/AP invoices
- **Payment Gateway**: Online payments
- **Credit Management**: Credit limits

**Finance Modules:**
- `/finance` - Finance dashboard
- `/finance/accounts-payable` - Supplier payments
- `/finance/accounts-receivable` - Customer payments
- `/finance/expenses` - Expense tracking
- `/finance/petty-cash` - Cash register
- `/finance/bank-reconciliation` - Bank matching
- `/finance/payroll` - Salary management
- `/finance/budgeting` - Budget planning
- `/finance/financial-reports` - Reports
- `/finance/invoices` - Invoice management
- `/finance/tax` - Tax management
- `/finance/credits` - Credit notes

---

### 9. 👨‍💼 Human Resources (HR)
**Location**: `/hr`

**Features:**
- **Employee Management**: Staff database
- **Attendance Tracking**: Clock in/out
- **Leave Management**: Vacation & sick leave
- **Payroll Processing**: Salary calculation
- **Performance Reviews**: KPI tracking
- **Shift Scheduling**: Roster management
- **Training Programs**: Skill development
- **Recruitment**: Hiring workflow
- **Document Management**: Contracts & certificates

**HR Modules:**
- `/hr` - HR dashboard
- `/hr/employees` - Employee list
- `/hr/attendance` - Attendance system
- `/hr/leave` - Leave requests
- `/hr/payroll` - Payroll processing
- `/hr/performance` - Performance reviews
- `/hr/scheduling` - Shift management
- `/hr/training` - Training programs
- `/hr/recruitment` - Hiring
- `/hr/documents` - Document vault

---

### 10. 📊 Reports & Analytics
**Location**: `/reports`, `/analytics`

**Features:**
- **Sales Reports**: Revenue analysis
- **Inventory Reports**: Stock status
- **Profit & Loss**: Financial performance
- **Customer Analytics**: Behavior insights
- **Product Analytics**: Best/worst sellers
- **Staff Performance**: Sales by employee
- **Stock Movement**: In/out tracking
- **Wastage Reports**: Loss tracking
- **Tax Reports**: VAT/GST filing
- **Custom Reports**: Report builder
- **Export**: PDF, Excel, CSV
- **Scheduled Reports**: Automated delivery

**Report Types:**
- `/reports` - Reports hub
- `/reports/sales` - Sales analytics
- `/reports/inventory` - Stock reports
- `/reports/profitability` - P&L reports
- `/reports/analytics` - Advanced analytics
- `/reports/stock-movement` - Movement logs
- `/reports/wastage` - Loss reports
- `/analytics` - Analytics dashboard

---

### 11. 🌐 E-commerce Integration
**Location**: `/ecommerce`

**Features:**
- **Online Store**: Web storefront
- **Product Sync**: Auto inventory sync
- **Order Management**: Online orders
- **Shipping Integration**: Courier APIs
- **Payment Gateway**: Stripe, PayPal
- **Customer Portal**: Self-service
- **Review Management**: Product reviews
- **Promotions**: Discount campaigns
- **Abandoned Cart**: Recovery emails

**E-commerce:**
- `/ecommerce` - E-commerce dashboard
- `/ecommerce/online-orders` - Web orders
- `/ecommerce/shipping` - Shipment tracking
- `/ecommerce/promotions` - Marketing campaigns
- `/ecommerce/reviews` - Customer reviews
- `/customer-portal` - Customer self-service

---

### 12. 🎭 Events & Exhibitions
**Location**: `/events`

**Features:**
- **Event Management**: Exhibitions, launches
- **Booth Inventory**: Event-specific stock
- **Event Sales**: Temporary POS
- **Lead Capture**: Customer acquisition
- **Event Analytics**: Performance tracking
- **Sampling Records**: Product samples
- **Event Expenses**: Cost tracking

**Events:**
- `/events` - Event calendar
- `/events/create` - New event
- `/events/booth-inventory` - Event stock
- `/events/sales` - Event transactions

---

### 13. 🧪 Sampling & Testers
**Location**: `/sampling`

**Features:**
- **Sampling Sessions**: Customer trials
- **Tester Management**: Tester bottles
- **Refill Tracking**: Tester refills
- **Sample Inventory**: Sample stock
- **Customer Preferences**: Scent profiles
- **Conversion Tracking**: Trial to purchase
- **Sampling Analytics**: Effectiveness

**Sampling:**
- `/sampling` - Sampling dashboard
- `/sampling/new-session` - New session
- `/sampling/testers` - Tester management
- `/sampling/refills` - Refill tracking

---

### 14. 📱 Customer Portal
**Location**: `/customer-portal`

**Features:**
- **Order History**: Past purchases
- **Loyalty Points**: Points balance
- **Wishlist**: Saved products
- **Address Book**: Delivery addresses
- **Reorder**: Quick reorder
- **Track Orders**: Shipment status
- **Profile Management**: Account settings

---

### 15. 🔔 Notifications
**Location**: `/notifications`

**Features:**
- **Push Notifications**: Real-time alerts
- **Email Notifications**: Order confirmations
- **SMS Alerts**: Low stock, payments
- **In-app Messages**: System notifications
- **Notification Center**: All alerts
- **Preferences**: Notification settings

---

### 16. ⚙️ Settings & Configuration
**Location**: `/settings`

**Features:**
- **Company Branding**: Logo, colors, themes
- **Tax Configuration**: VAT/GST setup
- **Currency Management**: Multi-currency
- **Language Settings**: Multilingual (EN/AR)
- **User Permissions**: Role-based access
- **System Preferences**: General settings
- **Loyalty Program**: Points configuration
- **Email Templates**: Customization
- **Theme Settings**: UI customization

**Settings:**
- `/settings` - Settings hub
- `/settings/branding` - Company branding
- `/settings/tax` - Tax configuration
- `/settings/currency` - Currency setup
- `/settings/language` - Language settings
- `/settings/permissions` - Access control
- `/settings/system` - System config
- `/settings/loyalty` - Loyalty setup
- `/settings/theme` - UI themes
- `/settings/countries` - Country settings
- `/settings/currencies` - Currency list

---

### 17. 📦 Subscription Management
**Location**: `/subscriptions`

**Features:**
- **Recurring Orders**: Auto-delivery
- **Subscription Plans**: Monthly/quarterly/yearly
- **Billing Cycles**: Automated billing
- **Subscription Analytics**: MRR/ARR tracking
- **Customer Portal**: Self-manage subscriptions
- **Pause/Resume**: Flexible management
- **Upgrade/Downgrade**: Plan changes

---

### 18. 🎁 Gift Cards & Vouchers
**Location**: `/sales/gift-cards`

**Features:**
- **Gift Card Issuance**: Generate cards
- **Balance Tracking**: Gift card balance
- **Redemption**: Apply to purchases
- **Voucher Codes**: Promotional codes
- **Expiry Management**: Validity tracking
- **Gift Card Reports**: Usage analytics

---

### 19. 💳 Layaway & Installments
**Location**: `/sales/layaway`

**Features:**
- **Layaway Plans**: Reserve & pay later
- **Installment Sales**: Monthly payments
- **Payment Schedules**: Due dates
- **Partial Payments**: Payment tracking
- **Completion Alerts**: Payment reminders
- **Layaway Reports**: Outstanding balances

---

### 20. 🚚 Procurement & Importing
**Location**: `/procurement`

**Features:**
- **Import Orders**: International sourcing
- **Customs Tracking**: Clearance status
- **Landed Cost**: Total cost calculation
- **Duty Management**: Import taxes
- **Shipping Documents**: BOL, invoices
- **Container Tracking**: Shipment status

---

### 21. 🎨 Perfume Features
**Location**: `/perfume`

**Features:**
- **Fragrance Notes**: Top, middle, base
- **Concentration Types**: EDP, EDT, Cologne
- **Bottle Sizes**: Multiple SKUs
- **Collection Management**: Product lines
- **Seasonal Products**: Limited editions
- **Customization**: Personalized perfumes
- **Scent Families**: Classification

---

### 22. 🌍 Platform Admin Dashboard
**Location**: `/platform`

**Features (For Software Provider):**
- **Tenant Management**: Create/edit clients
- **System Analytics**: All tenants overview
- **Billing Management**: Subscription billing
- **User Analytics**: Usage statistics
- **Tenant Onboarding**: One-click setup
- **Support Dashboard**: Customer support
- **System Health**: Server monitoring
- **Revenue Tracking**: MRR/ARR

**Platform Admin:**
- `/platform/login` - Admin login
- `/platform/dashboard` - Admin dashboard
- `/platform/tenants` - Tenant list
- `/platform/analytics` - System analytics
- `/platform/billing` - Billing management

---

## 🗄️ Database Models (50+ Tables)

### Core Models
1. **Tenant** - Multi-tenant companies
2. **User** - System users
3. **PlatformAdmin** - Platform administrators
4. **Store** - Physical/online locations
5. **Product** - Product catalog
6. **Category** - Product categories
7. **Customer** - Customer database
8. **Supplier** - Vendor database
9. **Order** - Sales orders
10. **OrderItem** - Order line items

### Inventory Models
11. **StockMovement** - Stock transactions
12. **Transfer** - Inter-location transfers
13. **Batch** - Production batches
14. **ProductionBatch** - Manufacturing
15. **RawMaterial** - Production materials
16. **Recipe** - Perfume formulas
17. **Segregation** - Failed batches

### Financial Models
18. **Payment** - Payment transactions
19. **Expense** - Operating expenses
20. **PettyCash** - Cash management
21. **BankAccount** - Bank accounts
22. **BankReconciliation** - Statement matching
23. **Invoice** - AR/AP invoices
24. **CreditNote** - Credit memos

### CRM Models
25. **CustomerSegment** - Customer grouping
26. **LoyaltyProgram** - Loyalty schemes
27. **LoyaltyTransaction** - Points transactions
28. **CustomerComplaint** - Support tickets
29. **Feedback** - Customer reviews
30. **GiftRegistry** - Event registries
31. **CorporateAccount** - B2B accounts

### Procurement Models
32. **PurchaseOrder** - Purchase orders
33. **PurchaseOrderItem** - PO line items
34. **GoodsReceipt** - Goods receiving
35. **SupplierInvoice** - Supplier bills
36. **ImportOrder** - International orders

### HR Models
37. **Employee** - Staff database
38. **Attendance** - Clock in/out
39. **Leave** - Leave requests
40. **PayrollRecord** - Salary records
41. **PerformanceReview** - KPI tracking
42. **ShiftSchedule** - Roster

### Subscription Models
43. **Subscription** - Recurring orders
44. **SubscriptionPlan** - Plan types
45. **GiftCard** - Gift cards
46. **Voucher** - Promotional codes

### Event Models
47. **Event** - Events & exhibitions
48. **BoothInventory** - Event stock
49. **SamplingSession** - Sampling sessions
50. **TesterRefill** - Tester management

---

## 🔌 API Endpoints (85+ APIs)

### Authentication APIs
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get session
- `POST /api/platform/auth/login` - Platform admin login

### Product APIs
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/categories` - List categories

### Order APIs
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order
- `PUT /api/orders/:id` - Update order
- `POST /api/orders/:id/payment` - Process payment
- `POST /api/orders/:id/refund` - Process refund

### Customer APIs
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer
- `PUT /api/customers/:id` - Update customer
- `GET /api/customers/:id/orders` - Customer orders
- `GET /api/customers/:id/loyalty` - Loyalty points

### Inventory APIs
- `GET /api/inventory` - Stock levels
- `POST /api/inventory/adjust` - Stock adjustment
- `POST /api/inventory/transfer` - Transfer stock
- `GET /api/inventory/movements` - Stock history
- `GET /api/inventory/low-stock` - Low stock alerts

### Financial APIs
- `GET /api/payments` - Payment list
- `POST /api/payments` - Process payment
- `GET /api/expenses` - Expense list
- `POST /api/expenses` - Create expense
- `GET /api/reports/financial` - Financial reports

### Platform Admin APIs
- `GET /api/platform/tenants` - List tenants
- `POST /api/platform/tenants` - Create tenant
- `GET /api/platform/tenants/:id` - Get tenant
- `PATCH /api/platform/tenants/:id` - Update tenant
- `DELETE /api/platform/tenants/:id` - Delete tenant
- `GET /api/platform/analytics` - System analytics

---

## 🎨 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Oud Theme
- **UI Components**: Shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **State**: Zustand + React Query
- **Animation**: Framer Motion

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes (REST)
- **Database**: PostgreSQL (Render.com)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Password**: bcrypt

### Infrastructure
- **Hosting**: Render.com (Auto-deploy)
- **Database**: PostgreSQL (Render)
- **File Storage**: Cloudinary (images)
- **CDN**: Vercel Edge Network
- **SSL**: Automatic HTTPS

### Developer Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Git**: GitHub (version control)
- **CI/CD**: Render auto-deploy on push

---

## 📱 Mobile & PWA Features

### Progressive Web App (PWA)
- ✅ Installable on mobile/desktop
- ✅ Offline mode support
- ✅ Push notifications
- ✅ Background sync
- ✅ App-like experience
- ✅ Home screen icon
- ✅ Splash screen

### Mobile Optimizations
- Responsive design (mobile-first)
- Touch-friendly UI
- Swipe gestures
- Mobile POS interface
- Barcode scanner (camera)
- Offline cart
- Quick actions

---

## 🌍 Internationalization

### Languages Supported
- 🇬🇧 English (Primary)
- 🇦🇪 Arabic (RTL support ready)

### Localization Features
- Multi-language UI
- RTL layout support
- Currency formatting (AED, USD, EUR, etc.)
- Date/time formatting
- Number formatting
- Translated product names

---

## 🔒 Security Features

### Authentication
- JWT tokens (Platform Admin)
- Session-based auth (Tenant users)
- Password hashing (bcrypt)
- Role-based access control (RBAC)
- Multi-factor authentication (Ready)
- Session management

### Data Security
- Multi-tenant data isolation
- Row-level security
- SQL injection prevention (Prisma)
- XSS protection
- CSRF tokens
- HTTPS encryption
- Secure headers

### Audit & Compliance
- Activity logging
- Change tracking
- User audit trail
- Data export (GDPR)
- Data retention policies
- Backup & recovery

---

## 📊 Subscription Plans

### Trial (14 days FREE)
- 1 store
- 5 users
- 500 products
- All basic features
- Email support

### Basic - 299 AED/month
- 1 store
- 5 users
- 500 products
- POS + Inventory
- Customer management
- Basic reports

### Professional - 999 AED/month
- 5 stores
- 20 users
- 5,000 products
- Production management
- Multi-location
- Advanced reports
- API access

### Enterprise - Custom Pricing
- Unlimited stores
- 100 users
- Unlimited products
- Event management
- Dedicated support
- Custom integrations
- White-label option

---

## 🚀 Deployment

### Production URL
```
https://oud-erp.onrender.com
```

### Local Development
```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed database
npm run db:seed
npm run db:seed:platform

# Run development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Build & Deploy
```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Render (automatic on git push)
git push origin main
```

---

## 📞 Support & Maintenance

### Platform Admin Access
- **Login**: https://oud-erp.onrender.com/platform/login
- **Email**: platform@oudperfume.ae
- **Password**: platform123 (Change after first login!)

### Tenant Demo Access
- **Login**: https://oud-erp.onrender.com/login
- **Email**: admin@oudperfume.ae
- **Password**: admin123

### Database Management
- **Prisma Studio**: `npm run db:studio`
- **Migrations**: `npm run db:migrate`
- **Seed Data**: `npm run db:seed`

---

## 🎯 Key Business Processes

### 1. **Tenant Onboarding** (For Software Provider)
```
Login to Platform → Create New Tenant →
Auto-creates: Tenant + Owner + Default Category →
Send credentials to client → Client logs in →
Client customizes branding → Start using system
```

### 2. **Daily Operations** (For Tenant Users)
```
Login → Clock in (if HR enabled) →
Check dashboard for alerts →
Process POS sales →
Manage inventory →
Handle customer requests →
Close day & reconcile cash
```

### 3. **Product Flow**
```
Create Product → Set pricing →
Assign category → Upload images →
Add to inventory → Display in POS →
Sell to customer → Auto stock deduction →
Reorder when low → Receive stock → Repeat
```

### 4. **Order Flow**
```
Customer selects products → Add to cart →
Apply discounts → Select payment method →
Process payment → Generate receipt →
Update inventory → Record in reports →
Customer gets receipt & loyalty points
```

### 5. **Production Flow**
```
Create recipe → Source raw materials →
Create production batch → Assign staff →
Quality control → Approve/reject →
Package finished goods → Add to inventory →
Track yield & costs
```

---

## 📈 Success Metrics & KPIs

### Sales Metrics
- Daily/Monthly/Yearly revenue
- Average transaction value
- Sales per employee
- Top-selling products
- Customer acquisition cost
- Customer lifetime value

### Operational Metrics
- Inventory turnover ratio
- Stock accuracy
- Order fulfillment time
- Production yield %
- Supplier delivery time
- Customer satisfaction score

### Financial Metrics
- Gross profit margin
- Net profit margin
- Operating expenses ratio
- Return on investment (ROI)
- Cash flow status
- Accounts receivable aging

---

## 🔮 Roadmap & Future Enhancements

### Phase 1 (Completed) ✅
- ✅ Core ERP functionality
- ✅ Multi-tenant architecture
- ✅ Platform admin dashboard
- ✅ 188 pages built
- ✅ Database & API complete
- ✅ Production deployment

### Phase 2 (Next)
- 🔄 Email notifications
- 🔄 SMS integration
- 🔄 Payment gateway (Stripe)
- 🔄 Shipping API integration
- 🔄 Advanced analytics
- 🔄 2FA authentication

### Phase 3 (Future)
- 📋 Mobile apps (iOS/Android)
- 📋 AI-powered forecasting
- 📋 Blockchain for authenticity
- 📋 AR product visualization
- 📋 Voice ordering
- 📋 WhatsApp Business integration

---

## 💡 Best Practices

### For Platform Admins
1. Change default passwords immediately
2. Create separate admin accounts for team
3. Monitor tenant usage regularly
4. Set up automated backups
5. Review security logs weekly
6. Keep system updated

### For Tenant Users
1. Use strong passwords
2. Assign roles properly
3. Regular inventory audits
4. Daily cash reconciliation
5. Review reports weekly
6. Train staff on system

---

## 🎓 Training Resources

### User Guides
- Platform Admin Guide: `PLATFORM_ADMIN_SETUP.md`
- Tenant Setup Guide: Available in settings
- POS Training: In-app tutorials
- Video Tutorials: Coming soon

### API Documentation
- REST API docs: Available on request
- Webhook docs: Available on request
- Integration guides: Coming soon

---

## 🏆 Why Choose This ERP?

### ✅ Comprehensive
- 32 modules covering all business needs
- 188 pages of functionality
- 85+ API endpoints
- 50+ database tables

### ✅ Modern Technology
- Built with latest Next.js 14
- TypeScript for reliability
- PostgreSQL for scalability
- PWA for mobile access

### ✅ Business-Specific
- Designed for perfume industry
- Oud-specific features
- Production management
- Fragrance classification

### ✅ Multi-Tenant SaaS
- Serve multiple clients
- Complete data isolation
- Central management
- Automated billing

### ✅ Scalable
- Handle unlimited products
- Support multiple stores
- Concurrent users
- Cloud infrastructure

### ✅ Secure
- Enterprise-grade security
- Role-based access
- Audit trails
- Data encryption

---

## 📧 Contact & Support

**Technical Support:**
- Email: support@oudperfume.ae
- Documentation: In-app help center

**Business Inquiries:**
- Email: sales@oudperfume.ae
- Demo: https://oud-erp.onrender.com

**Platform Admin:**
- Dashboard: https://oud-erp.onrender.com/platform
- Emergency: Check system logs

---

## 📄 License

**Copyright © 2024 Oud & Perfume ERP**
- All rights reserved
- Enterprise license
- SaaS platform

---

**🚀 Your complete perfume business management solution - from raw materials to customer delight!**

*Built with ❤️ using Next.js, TypeScript, Prisma & PostgreSQL*
