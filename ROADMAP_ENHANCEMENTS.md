# 🚀 Oud & Perfume ERP - Enhancement Roadmap

## 📋 Current System Status
- ✅ **193 pages** - Fully functional
- ✅ **32 modules** - Production ready
- ✅ **Multi-tenant SaaS** - Operational
- ✅ **Platform admin** - Live

---

## 🎯 PHASE 1: Perfume & Oud Industry-Specific Features (HIGH PRIORITY)

### 1.1 Segregation Management Module ⭐⭐⭐
**Status**: Partially implemented, needs completion

**Pages to Add** (5 pages):
- `/production/segregation` - Main segregation dashboard
- `/production/segregation/new` - Create new segregation batch
- `/production/segregation/history` - Segregation history & tracking
- `/production/segregation/yields` - Yield analysis & reports
- `/production/segregation/wastage` - Wastage tracking & costs

**Features**:
- Track raw material → multiple outputs (Muri, Salla, Super, Custom grades)
- Automatic yield % calculation
- Segregation cost tracking per batch
- Wastage percentage & loss tracking
- Grade-wise pricing automation
- Batch-wise profitability analysis

**Database Models Needed**:
```prisma
model SegregationBatch {
  id              String   @id @default(cuid())
  batchNumber     String   @unique
  rawMaterial     Product  @relation(fields: [rawMaterialId], references: [id])
  rawMaterialId   String
  rawQuantity     Float
  rawCost         Float
  segregationDate DateTime
  laborCost       Float
  overheadCost    Float
  totalCost       Float
  outputs         SegregationOutput[]
  wastage         Float    // percentage
  wastageCost     Float
  status          SegregationStatus
  tenantId        String
  createdById     String
}

model SegregationOutput {
  id              String   @id @default(cuid())
  batch           SegregationBatch @relation(fields: [batchId], references: [id])
  batchId         String
  gradeName       String   // Muri, Salla, Super, Custom
  product         Product  @relation(fields: [productId], references: [id])
  productId       String
  quantity        Float
  yieldPercentage Float
  unitCost        Float    // auto-calculated
  sellingPrice    Float
  profitMargin    Float
}

enum SegregationStatus {
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

---

### 1.2 Distillation & Extraction Tracking ⭐⭐⭐
**Status**: Not implemented

**Pages to Add** (3 pages):
- `/production/distillation` - Distillation dashboard
- `/production/distillation/batches` - Batch management
- `/production/distillation/logs` - Process logs & yield tracking

**Features**:
- Track raw oud wood → extracted oil
- Distillation process logs (temperature, pressure, duration)
- Oil yield calculation & tracking
- Quality grade assignment
- Cost per ml calculation
- Batch expiry & aging tracking

**Database Models**:
```prisma
model DistillationBatch {
  id              String   @id @default(cuid())
  batchNumber     String   @unique
  rawWood         Product  @relation(fields: [rawWoodId], references: [id])
  rawWoodId       String
  woodWeight      Float    // in kg
  woodCost        Float
  distillationDate DateTime
  temperature     Float
  pressure        Float
  duration        Int      // in hours
  oilExtracted    Float    // in ml
  yieldPercentage Float    // auto-calculated
  qualityGrade    String   // A, B, C, D
  costPerMl       Float    // auto-calculated
  logs            DistillationLog[]
  status          DistillationStatus
  tenantId        String
}

model DistillationLog {
  id              String   @id @default(cuid())
  batch           DistillationBatch @relation(fields: [batchId], references: [id])
  batchId         String
  timestamp       DateTime
  temperature     Float
  pressure        Float
  notes           String?
  recordedBy      User     @relation(fields: [recordedById], references: [id])
  recordedById    String
}

enum DistillationStatus {
  PREPARING
  IN_PROCESS
  COOLING
  COMPLETED
  FAILED
}
```

---

### 1.3 Blending Recipes Library ⭐⭐⭐
**Status**: Not implemented

**Pages to Add** (3 pages):
- `/production/recipes` - Recipe library
- `/production/recipes/create` - Create/edit recipes
- `/production/recipes/versions` - Version control & history

**Features**:
- Master formula storage with version control
- Ingredient proportions & ratios
- Cost calculation per recipe
- Batch size scaling (10ml → 100ml → 1L)
- Recipe duplication & variations
- Production instructions & notes
- Quality control checkpoints

**Database Models**:
```prisma
model BlendingRecipe {
  id              String   @id @default(cuid())
  name            String
  sku             String   @unique
  description     String?
  version         Int      @default(1)
  baseQuantity    Float    // e.g., 100ml
  baseUnit        String   // ml, gm, etc.
  ingredients     RecipeIngredient[]
  totalCost       Float    // auto-calculated
  sellingPrice    Float
  profitMargin    Float
  instructions    String?
  qualityChecks   String?  // JSON array of checkpoints
  status          RecipeStatus
  isActive        Boolean  @default(true)
  parentRecipe    BlendingRecipe? @relation("RecipeVersions", fields: [parentRecipeId], references: [id])
  parentRecipeId  String?
  versions        BlendingRecipe[] @relation("RecipeVersions")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  tenantId        String
}

model RecipeIngredient {
  id              String   @id @default(cuid())
  recipe          BlendingRecipe @relation(fields: [recipeId], references: [id])
  recipeId        String
  ingredient      Product  @relation(fields: [ingredientId], references: [id])
  ingredientId    String
  quantity        Float
  unit            String
  percentage      Float    // % of total
  cost            Float    // auto-calculated
  notes           String?
}

enum RecipeStatus {
  DRAFT
  TESTING
  APPROVED
  ARCHIVED
}
```

---

### 1.4 Aging & Maturation Module ⭐⭐
**Status**: Not implemented

**Pages to Add** (2 pages):
- `/production/aging` - Aging dashboard
- `/production/aging/batches` - Batch tracking & alerts

**Features**:
- Track batches in aging barrels/containers
- Date-based maturation alerts
- Aging duration tracking
- Quality improvement tracking
- Automatic status updates (aging → ready)
- Location tracking (barrel number, warehouse)

**Database Models**:
```prisma
model AgingBatch {
  id              String   @id @default(cuid())
  batchNumber     String   @unique
  product         Product  @relation(fields: [productId], references: [id])
  productId       String
  quantity        Float
  unit            String
  containerType   String   // Barrel, Tank, Bottle
  containerNumber String
  location        String
  startDate       DateTime
  targetDuration  Int      // in days
  expectedReady   DateTime // auto-calculated
  actualReady     DateTime?
  status          AgingStatus
  qualityBefore   String?
  qualityAfter    String?
  notes           String?
  tenantId        String
}

enum AgingStatus {
  AGING
  READY
  EXTRACTED
  DISCARDED
}
```

---

### 1.5 Tester/Demo Loss Tracking ⭐⭐
**Status**: Not implemented

**Pages to Add** (2 pages):
- `/inventory/testers` - Tester inventory
- `/sales/demos` - Demo usage tracking

**Features**:
- Separate tester inventory
- Auto-deduct from inventory when sample shown
- Track testers by location (store, staff, event)
- Demo-to-sale conversion tracking
- Cost of demos per month/store
- Tester refill alerts

**Database Models**:
```prisma
model TesterInventory {
  id              String   @id @default(cuid())
  product         Product  @relation(fields: [productId], references: [id])
  productId       String
  store           Store?   @relation(fields: [storeId], references: [id])
  storeId         String?
  staff           User?    @relation(fields: [staffId], references: [id])
  staffId         String?
  quantity        Float
  unit            String
  lastRefill      DateTime
  totalUsed       Float
  tenantId        String
}

model DemoLog {
  id              String   @id @default(cuid())
  product         Product  @relation(fields: [productId], references: [id])
  productId       String
  customer        Customer? @relation(fields: [customerId], references: [id])
  customerId      String?
  quantityUsed    Float
  demoDate        DateTime
  convertedToSale Boolean  @default(false)
  sale            Sale?    @relation(fields: [saleId], references: [id])
  saleId          String?
  staff           User     @relation(fields: [staffId], references: [id])
  staffId         String
  store           Store    @relation(fields: [storeId], references: [id])
  storeId         String
  notes           String?
  tenantId        String
}
```

---

### 1.6 Customer Feedback Integration ⭐⭐
**Status**: Not implemented

**Pages to Add** (2 pages):
- `/crm/feedback` - Feedback collection & analysis
- `/analytics/rejection-reasons` - Rejection analytics

**Features**:
- Track rejection reasons (too expensive, scent not preferred, etc.)
- Link feedback to products & customers
- Sentiment analysis dashboard
- Product improvement suggestions
- Feedback-driven pricing adjustments
- Most common objections report

**Database Models**:
```prisma
model CustomerFeedback {
  id              String   @id @default(cuid())
  customer        Customer @relation(fields: [customerId], references: [id])
  customerId      String
  product         Product? @relation(fields: [productId], references: [id])
  productId       String?
  feedbackType    FeedbackType
  rating          Int?     // 1-5 stars
  rejectionReason RejectionReason?
  comments        String?
  sentiment       Sentiment // Auto-detected: POSITIVE, NEUTRAL, NEGATIVE
  actionTaken     String?
  followUpDate    DateTime?
  feedbackDate    DateTime @default(now())
  staff           User     @relation(fields: [staffId], references: [id])
  staffId         String
  tenantId        String
}

enum FeedbackType {
  PURCHASE_FEEDBACK
  REJECTION
  COMPLAINT
  SUGGESTION
  COMPLIMENT
}

enum RejectionReason {
  TOO_EXPENSIVE
  SCENT_NOT_PREFERRED
  LOW_QUALITY
  PACKAGING_ISSUE
  AVAILABILITY_ISSUE
  COMPETITOR_PREFERRED
  OTHER
}

enum Sentiment {
  POSITIVE
  NEUTRAL
  NEGATIVE
}
```

---

## 🌍 PHASE 2: Operational & Business Features

### 2.1 Temporary/Pop-up Locations ⭐⭐⭐
**Status**: Not implemented

**Pages to Add** (4 pages):
- `/events/popup-locations` - Manage temporary locations
- `/events/exhibitions` - Exhibition management
- `/events/sales` - Event-wise sales tracking
- `/events/roi` - Event ROI analysis

**Features**:
- Create temporary locations (exhibitions, fairs, markets)
- Assign staff & inventory to events
- Track sales by event
- Calculate event ROI (revenue - (setup cost + inventory + staff))
- Event performance comparison
- Best-performing events ranking

**Database Models**:
```prisma
model PopupLocation {
  id              String   @id @default(cuid())
  name            String
  type            PopupType
  location        String
  startDate       DateTime
  endDate         DateTime
  setupCost       Float
  rentalCost      Float
  otherCosts      Float
  totalCost       Float    // auto-calculated
  assignedStaff   EventStaff[]
  inventory       EventInventory[]
  sales           Sale[]
  revenue         Float
  profit          Float    // auto-calculated
  roi             Float    // auto-calculated
  status          PopupStatus
  notes           String?
  tenantId        String
}

model EventStaff {
  id              String   @id @default(cuid())
  event           PopupLocation @relation(fields: [eventId], references: [id])
  eventId         String
  staff           User     @relation(fields: [staffId], references: [id])
  staffId         String
  role            String
  dailyCost       Float
}

model EventInventory {
  id              String   @id @default(cuid())
  event           PopupLocation @relation(fields: [eventId], references: [id])
  eventId         String
  product         Product  @relation(fields: [productId], references: [id])
  productId       String
  quantityAllocated Float
  quantitySold    Float
  quantityReturned Float
}

enum PopupType {
  EXHIBITION
  FAIR
  MARKET
  MALL_KIOSK
  FESTIVAL
  CORPORATE_EVENT
}

enum PopupStatus {
  PLANNED
  SETUP
  ACTIVE
  COMPLETED
  CANCELLED
}
```

---

### 2.2 Multi-Country Support ⭐⭐⭐
**Status**: Partially implemented (needs enhancement)

**Pages to Add** (3 pages):
- `/settings/countries` - Country configuration
- `/settings/tax-rules` - Country-specific tax rules
- `/settings/units` - Country-specific units (tola, ml, gm)

**Features**:
- Country-specific taxes (UAE VAT 5%, Saudi VAT 15%, EU VAT 20%)
- Country-specific units (tola in GCC, ml/gm elsewhere)
- Multi-currency with historical exchange rates
- Country-specific invoice formats
- Local compliance reports

**Database Models**:
```prisma
model CountryConfig {
  id              String   @id @default(cuid())
  countryCode     String   @unique // AE, SA, IN, etc.
  countryName     String
  currency        String
  taxName         String   // VAT, GST, etc.
  taxRate         Float
  defaultUnit     String   // tola, ml, gm
  invoiceFormat   String   // JSON template
  isActive        Boolean  @default(true)
  tenantId        String
}

model ExchangeRate {
  id              String   @id @default(cuid())
  fromCurrency    String
  toCurrency      String
  rate            Float
  effectiveDate   DateTime
  tenantId        String
}
```

---

### 2.3 Wholesale vs Retail Management ⭐⭐
**Status**: Not implemented

**Pages to Add** (3 pages):
- `/wholesale/orders` - Wholesale order management
- `/wholesale/customers` - Wholesale customer management
- `/wholesale/pricing` - Wholesale price lists

**Features**:
- Separate workflows for wholesale vs retail
- Wholesale-specific price lists
- Bulk order discounts
- Minimum order quantities (MOQ)
- Wholesale customer credit limits
- Wholesale-specific invoices

---

### 2.4 Franchise/Distributor Management ⭐⭐
**Status**: Not implemented

**Pages to Add** (4 pages):
- `/franchise/partners` - Franchise/distributor directory
- `/franchise/orders` - Partner orders
- `/franchise/commissions` - Commission tracking
- `/franchise/performance` - Partner performance

**Features**:
- Franchise/distributor profiles
- Territory management
- Commission calculation
- Stock allocation to partners
- Partner performance metrics
- Royalty tracking

---

## 💰 PHASE 3: Advanced Finance & Compliance

### 3.1 Costing Engine ⭐⭐⭐
**Status**: Not implemented

**Features**:
- Automatic product cost calculation:
  - Raw material cost
  - Segregation cost
  - Labor cost
  - Packaging cost
  - Logistics cost
  - Overhead allocation
- Real-time cost updates
- Historical cost tracking
- Cost variance analysis

---

### 3.2 IFRS & Local Compliance Reports ⭐⭐
**Status**: Not implemented

**Pages to Add** (2 pages):
- `/reports/compliance` - Compliance reports
- `/reports/ifrs` - IFRS reports

**Features**:
- UAE VAT returns
- KSA Zakat reports
- India GST returns
- IFRS financial statements
- Automated tax filing prep

---

### 3.3 Integrated Payment Gateways ⭐⭐⭐
**Status**: Not implemented

**Features**:
- Stripe integration
- PayTabs (Middle East)
- Razorpay (India)
- Payment link generation
- QR code payments
- Split payments

---

### 3.4 Credit/Debit Notes ⭐⭐
**Status**: Not implemented

**Pages to Add** (2 pages):
- `/finance/credit-notes` - Credit note management
- `/finance/debit-notes` - Debit note management

**Features**:
- Credit notes for returns
- Debit notes for disputes
- Adjustment tracking
- Automatic account updates

---

## 👥 PHASE 4: HR & Staff Performance

### 4.1 Sales Staff Leaderboard ⭐⭐⭐
**Status**: Not implemented

**Pages to Add** (1 page):
- `/hr/leaderboard` - Staff performance leaderboard

**Features**:
- Daily/weekly/monthly sales rankings
- Commission calculations
- Top performers highlights
- Performance trends
- Gamification (badges, levels)

---

### 4.2 Event Staff Tracking ⭐
**Status**: Not implemented

**Features**:
- Assign staff to pop-up/exhibition
- Track staff attendance at events
- Event-wise staff performance

---

### 4.3 Training & Certification ⭐
**Status**: Not implemented

**Pages to Add** (2 pages):
- `/hr/training` - Training programs
- `/hr/certifications` - Staff certifications

**Features**:
- Perfume blending training
- QC team certifications
- Sales training modules
- Skill tracking

---

## 🤖 PHASE 5: AI & Automation

### 5.1 AI Forecasting ⭐⭐⭐
**Status**: Not implemented

**Pages to Add** (2 pages):
- `/analytics/forecasting` - AI demand forecasting
- `/analytics/trends` - Trend analysis

**Features**:
- Predict demand based on:
  - Season (Ramadan, weddings, winter)
  - Historical sales trends
  - Market conditions
- Automatic reorder suggestions
- Stock optimization

---

### 5.2 Smart Reorder Suggestions ⭐⭐⭐
**Status**: Not implemented

**Features**:
- Auto-generate purchase orders when stock low
- Smart reorder points based on sales velocity
- Supplier selection based on:
  - Price
  - Lead time
  - Quality history

---

### 5.3 Customer Recommendation Engine ⭐⭐
**Status**: Not implemented

**Features**:
- Product recommendations based on:
  - Past purchases
  - Similar customers
  - Trending products
- Personalized marketing

---

### 5.4 Auto Marketing Triggers ⭐⭐
**Status**: Not implemented

**Features**:
- Auto email/SMS if customer inactive for 3 months
- Birthday/anniversary offers
- Abandoned cart reminders
- New product alerts to interested customers

---

## 🔧 PHASE 6: Technical / SaaS Features

### 6.1 White-Labeling ⭐⭐⭐
**Status**: Not implemented

**Pages to Add** (1 page):
- `/settings/branding` - Enhanced branding controls

**Features**:
- Custom logo upload
- Color scheme customization
- Custom invoices with merchant branding
- Email template customization
- Custom domain support

---

### 6.2 Custom Domain Support ⭐⭐
**Status**: Not implemented

**Features**:
- Client runs ERP on their subdomain (client.yourdomain.com)
- SSL certificate automation
- DNS configuration guide

---

### 6.3 Advanced Audit Trail ⭐⭐
**Status**: Partially implemented

**Features**:
- Downloadable audit logs (PDF/Excel)
- Compliance-ready reports
- User activity timeline
- Data change history

---

### 6.4 Data Export & Migration ⭐
**Status**: Not implemented

**Features**:
- Export all data (CSV, Excel, JSON)
- Import from other ERPs
- Bulk data upload templates
- Migration wizard

---

### 6.5 Offline Mode for POS ⭐⭐⭐
**Status**: Partially implemented (PWA ready, needs offline sync)

**Features**:
- Full offline POS functionality
- Local cache with IndexedDB
- Auto-sync when internet available
- Conflict resolution

---

## 📊 SUMMARY

### Total New Pages to Add: **~45 pages**
### Total New Database Models: **~25 models**

### Priority Breakdown:

**🔥 MUST HAVE (Phase 1 & 2):**
- Segregation Management (5 pages)
- Distillation Tracking (3 pages)
- Blending Recipes (3 pages)
- Pop-up Locations (4 pages)
- Multi-Country Support (3 pages)
- **Total: 18 pages**

**⭐ HIGH VALUE (Phase 3 & 4):**
- Costing Engine
- Sales Leaderboard (1 page)
- Payment Gateway Integration
- Tester Tracking (2 pages)
- **Total: ~8 pages**

**🚀 INNOVATION (Phase 5):**
- AI Forecasting (2 pages)
- Smart Reorder
- Customer Recommendations
- Auto Marketing
- **Total: ~5 pages**

**🔧 PLATFORM (Phase 6):**
- White-labeling (1 page)
- Advanced Audit
- Data Migration
- Offline POS
- **Total: ~3 pages**

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

### **Sprint 1 (Week 1-2): Core Perfume Features**
1. Segregation Management (5 pages) ✅
2. Blending Recipes (3 pages) ✅

### **Sprint 2 (Week 3-4): Production**
3. Distillation Tracking (3 pages) ✅
4. Aging Module (2 pages) ✅

### **Sprint 3 (Week 5-6): Business Operations**
5. Pop-up Locations (4 pages) ✅
6. Multi-Country Support (3 pages) ✅

### **Sprint 4 (Week 7-8): Sales & Marketing**
7. Tester Tracking (2 pages) ✅
8. Customer Feedback (2 pages) ✅
9. Sales Leaderboard (1 page) ✅

### **Sprint 5 (Week 9-10): Finance**
10. Costing Engine ✅
11. Payment Integration ✅
12. Credit/Debit Notes (2 pages) ✅

### **Sprint 6 (Week 11-12): AI & Automation**
13. AI Forecasting (2 pages) ✅
14. Smart Reorder ✅
15. Auto Marketing ✅

### **Sprint 7 (Week 13-14): Platform Features**
16. White-labeling (1 page) ✅
17. Offline POS ✅
18. Data Migration ✅

---

## 📈 FINAL SYSTEM SIZE (After All Enhancements)

- **Total Pages**: 193 + 45 = **238 pages**
- **Total Modules**: 32 + 12 = **44 modules**
- **Total Database Models**: 50 + 25 = **75 models**
- **Market Position**: **Industry-leading perfume & oud ERP**

---

**Created**: 2025-01-04
**Next Review**: After Phase 1 completion
