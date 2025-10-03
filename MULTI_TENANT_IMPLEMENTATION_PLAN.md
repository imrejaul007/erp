# Multi-Tenant SaaS Implementation Plan
## Oud Palace ERP - Complete Transformation Guide

---

## 🎯 OBJECTIVE
Transform the current single-tenant Oud Palace ERP into a **Multi-Tenant SaaS Platform** where each merchant (Tenant) has:
- Isolated, secure data
- Own admin account and user management
- Subscription-based access
- Custom branding and settings
- Complete data privacy

---

## 📋 ARCHITECTURE DECISION

### **Option Selected: Shared Database with Tenant ID (Row-Level Multi-Tenancy)**

**Why this approach:**
1. ✅ Cost-effective for initial launch
2. ✅ Easier database migrations
3. ✅ Simpler backup/restore operations
4. ✅ Better resource utilization
5. ✅ Can migrate to separate DBs later if needed

**Security measures:**
- Every table has `tenantId` field
- Row-Level Security (RLS) enforcement
- Middleware validates tenant context
- API endpoints filter by tenantId
- No cross-tenant data leakage

---

## 🗄️ DATABASE SCHEMA CHANGES

### 1. **New Core Models**

```prisma
model Tenant {
  id                String          @id @default(cuid())
  name              String          // "Oud Palace Dubai"
  nameArabic        String?
  slug              String          @unique // "oud-palace-dubai"
  domain            String?         @unique // custom domain

  // Business Info
  businessType      BusinessType    @default(RETAIL)
  tradeLicense      String?
  vatNumber         String?

  // Contact
  ownerName         String
  ownerEmail        String
  ownerPhone        String
  address           String?
  emirate           String?
  city              String?

  // Branding
  logoUrl           String?
  primaryColor      String?         @default("#FF6B35")
  secondaryColor    String?         @default("#004E89")

  // Subscription
  plan              SubscriptionPlan @default(TRIAL)
  planStartDate     DateTime        @default(now())
  planEndDate       DateTime?
  billingCycle      BillingCycle    @default(MONTHLY)
  maxUsers          Int             @default(5)
  maxStores         Int             @default(1)
  maxProducts       Int             @default(500)

  // Features
  features          Json            // {pos: true, production: false, events: true}

  // Status
  status            TenantStatus    @default(TRIAL)
  isActive          Boolean         @default(true)
  trialEndsAt       DateTime?
  suspendedAt       DateTime?
  suspensionReason  String?

  // Metrics
  totalSales        Decimal         @default(0) @db.Decimal(15, 2)
  totalOrders       Int             @default(0)
  activeUsers       Int             @default(0)
  storageUsed       BigInt          @default(0) // in bytes

  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  // Relations
  users             User[]
  customers         Customer[]
  products          Product[]
  stores            Store[]
  orders            Order[]
  subscriptions     Subscription[]
  invoices          Invoice[]
  apiKeys           ApiKey[]

  @@map("tenants")
}

model Subscription {
  id              String            @id @default(cuid())
  tenantId        String
  plan            SubscriptionPlan
  status          SubscriptionStatus @default(ACTIVE)
  startDate       DateTime          @default(now())
  endDate         DateTime?
  price           Decimal           @db.Decimal(10, 2)
  currency        String            @default("AED")
  billingCycle    BillingCycle
  autoRenew       Boolean           @default(true)

  // Payment
  lastBilledAt    DateTime?
  nextBillingDate DateTime?
  paymentMethod   String?

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  tenant          Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}

model Invoice {
  id              String          @id @default(cuid())
  tenantId        String
  invoiceNumber   String          @unique
  amount          Decimal         @db.Decimal(10, 2)
  currency        String          @default("AED")
  status          InvoiceStatus   @default(PENDING)
  dueDate         DateTime
  paidAt          DateTime?
  description     String?
  lineItems       Json            // Detailed breakdown

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  tenant          Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@map("invoices")
}

model ApiKey {
  id              String          @id @default(cuid())
  tenantId        String
  name            String
  key             String          @unique
  permissions     Json            // {read: true, write: false}
  lastUsedAt      DateTime?
  expiresAt       DateTime?
  isActive        Boolean         @default(true)

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  tenant          Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@map("api_keys")
}

// Enums
enum BusinessType {
  RETAIL
  WHOLESALE
  BOTH
  PRODUCTION
  DISTRIBUTION
}

enum SubscriptionPlan {
  TRIAL           // 14 days free
  BASIC           // 1 store, 5 users, POS + Inventory
  PROFESSIONAL    // 5 stores, 20 users, + Production
  ENTERPRISE      // Unlimited, + Events + API
}

enum BillingCycle {
  MONTHLY
  YEARLY
}

enum TenantStatus {
  TRIAL
  ACTIVE
  SUSPENDED
  CANCELLED
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  SUSPENDED
}

enum InvoiceStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}
```

### 2. **Add tenantId to ALL existing models**

Every existing model needs:
```prisma
tenantId    String
tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

@@index([tenantId]) // For query performance
```

**Models to update:**
- User
- Customer
- Product
- Store
- Order
- Supplier
- Category
- Brand
- StoreInventory
- Transfer
- PurchaseOrder
- ProductionBatch
- Recipe
- Material
- MarketingCampaign
- Employee
- GiftCard
- Discount
- (and ALL others...)

---

## 🔐 SECURITY IMPLEMENTATION

### 1. **Tenant Context Middleware**

```typescript
// middleware/tenantContext.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function getTenantFromRequest(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.tenantId) {
    throw new Error('Unauthorized: No tenant context');
  }

  return session.user.tenantId;
}

// Usage in every API route
export async function GET(request: NextRequest) {
  const tenantId = await getTenantFromRequest(request);

  // ALL queries MUST include tenantId
  const products = await prisma.product.findMany({
    where: { tenantId } // CRITICAL!
  });

  return NextResponse.json(products);
}
```

### 2. **Prisma Middleware (Global Tenant Filter)**

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Automatically inject tenantId in all queries
prisma.$use(async (params, next) => {
  const tenantId = getCurrentTenantId(); // from session/context

  if (!tenantId) {
    throw new Error('No tenant context');
  }

  // Add tenantId to where clause
  if (params.action === 'findMany' || params.action === 'findFirst') {
    params.args.where = {
      ...params.args.where,
      tenantId
    };
  }

  // Add tenantId to create/update
  if (params.action === 'create' || params.action === 'update') {
    params.args.data = {
      ...params.args.data,
      tenantId
    };
  }

  return next(params);
});
```

---

## 🚀 ONBOARDING FLOW

### **Merchant Registration Process**

1. **Sign Up Page** (`/signup`)
   - Business name
   - Owner name, email, phone
   - Password
   - Emirate/Country
   - Accept terms

2. **Auto-Provisioning**
   - Create Tenant record
   - Generate slug (oud-palace-dubai)
   - Create Admin user
   - Assign TRIAL plan (14 days)
   - Send welcome email

3. **Setup Wizard** (`/onboarding`)
   - Step 1: Business details (VAT, Trade License)
   - Step 2: Logo & branding colors
   - Step 3: Create first store location
   - Step 4: Add staff (optional)
   - Step 5: Import sample data (optional)

4. **Trial Period**
   - Full access to all features
   - Watermark: "Trial Mode"
   - Daily reminder emails
   - Upgrade prompts

5. **Subscription Selection**
   - Compare plans
   - Payment via Stripe/PayPal
   - Activate subscription

---

## 💳 BILLING & PAYMENTS

### **Subscription Plans**

| Plan | Price (AED/month) | Stores | Users | Products | Features |
|------|------------------|--------|-------|----------|----------|
| TRIAL | Free (14 days) | 1 | 3 | 100 | POS, Inventory |
| BASIC | 299 | 1 | 5 | 500 | + Finance, Reports |
| PROFESSIONAL | 999 | 5 | 20 | 5000 | + Production, Events |
| ENTERPRISE | 2499 | Unlimited | Unlimited | Unlimited | + API, Custom |

### **Payment Integration**
- Stripe for credit cards
- PayPal for UAE
- Manual bank transfer option
- Auto-invoice generation
- Email receipts

---

## 📊 TENANT DASHBOARD

Each tenant sees:
- Their company name & logo
- Their sales, inventory, staff
- Subscription status
- Usage metrics (storage, API calls)
- Billing history
- Settings panel

---

## 🛠️ MIGRATION STRATEGY

### **Phase 1: Database Schema Update**
1. Create Tenant, Subscription, Invoice models
2. Add tenantId to all existing models
3. Create migration scripts
4. Run migration (adds columns)

### **Phase 2: Seed Initial Tenant**
1. Create "Default Tenant" for existing data
2. Update all records with default tenantId
3. Test queries still work

### **Phase 3: Code Updates**
1. Update all API endpoints to use tenantId
2. Add tenant middleware
3. Update NextAuth to include tenantId
4. Test isolation (create test tenant)

### **Phase 4: UI Updates**
1. Add signup flow
2. Add onboarding wizard
3. Add subscription management
4. Add tenant settings page

### **Phase 5: Testing**
1. Create 2+ test tenants
2. Verify data isolation
3. Test CRUD operations
4. Load testing

### **Phase 6: Launch**
1. Deploy to production
2. Marketing campaign
3. Monitor signups
4. Support tickets

---

## 🔧 TECHNICAL IMPLEMENTATION STEPS

### **Step 1: Update Prisma Schema** (1-2 hours)
- Add Tenant, Subscription, Invoice models
- Add tenantId to all models
- Add indexes for performance

### **Step 2: Database Migration** (30 mins)
```bash
npx prisma migrate dev --name add_multi_tenancy
npx prisma generate
```

### **Step 3: Seed Default Tenant** (30 mins)
```typescript
// prisma/seed-tenant.ts
const defaultTenant = await prisma.tenant.create({
  data: {
    name: 'Oud Palace',
    slug: 'oud-palace-default',
    ownerEmail: 'admin@oudpalace.ae',
    plan: 'ENTERPRISE',
    status: 'ACTIVE'
  }
});

// Update all existing records
await prisma.user.updateMany({
  data: { tenantId: defaultTenant.id }
});
// ... repeat for all models
```

### **Step 4: Update API Routes** (2-3 hours)
- Add getTenantId() to every endpoint
- Filter all queries by tenantId
- Test each endpoint

### **Step 5: Update NextAuth** (1 hour)
```typescript
// pages/api/auth/[...nextauth]/route.ts
callbacks: {
  session: async ({ session, token }) => {
    if (session.user) {
      session.user.tenantId = token.tenantId;
      session.user.role = token.role;
    }
    return session;
  },
  jwt: async ({ token, user }) => {
    if (user) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { tenant: true }
      });
      token.tenantId = dbUser.tenantId;
      token.role = dbUser.role;
    }
    return token;
  }
}
```

### **Step 6: Create Signup Flow** (2 hours)
- `/signup` page
- Tenant creation API
- Email verification
- Welcome email

### **Step 7: Create Onboarding** (3 hours)
- Multi-step wizard
- Business setup
- Branding upload
- First store creation

### **Step 8: Add Subscription Management** (3 hours)
- Plan selection page
- Payment integration
- Usage tracking
- Billing dashboard

---

## ⚠️ CRITICAL SECURITY CHECKLIST

- [ ] Every API endpoint checks tenantId
- [ ] No cross-tenant data queries possible
- [ ] Prisma middleware enforces tenant filter
- [ ] Session includes tenantId
- [ ] File uploads are tenant-scoped
- [ ] Audit logs track tenant context
- [ ] Database backups are tenant-separable
- [ ] Admin panel has tenant switcher (for support)
- [ ] API rate limiting per tenant
- [ ] Data export respects tenant boundary

---

## 📈 SUCCESS METRICS

- **Technical**: 0 cross-tenant data leaks in testing
- **Business**: 50+ merchants onboarded in 3 months
- **Performance**: <200ms API response time
- **Uptime**: 99.9% availability
- **Support**: <4 hour response time

---

## 🎓 LEARNING RESOURCES

- [Building Multi-Tenant Apps with Prisma](https://www.prisma.io/docs/guides/database/multi-tenancy)
- [NextAuth with Tenancy](https://next-auth.js.org/tutorials/securing-pages-and-api-routes)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)

---

## 📞 SUPPORT & ROLLBACK PLAN

**If issues arise:**
1. Keep backup of pre-migration database
2. Can rollback migration with `prisma migrate reset`
3. Test tenant isolation thoroughly before production
4. Have support team trained on multi-tenancy

---

**STATUS:** Ready for implementation
**ESTIMATED TIME:** 15-20 hours total
**RISK LEVEL:** Medium (major architectural change)
**REWARD:** Transform into sellable SaaS product

---

END OF PLAN
