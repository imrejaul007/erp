# 🔐 Multi-Tenant Login & Access Control Guide

## Overview
Your Oud ERP system is built as a **Multi-Tenant SaaS** platform where multiple companies can use the same system with completely isolated data.

---

## 🏢 System Architecture

### Three Levels of Access:

```
┌─────────────────────────────────────────────────────────┐
│  LEVEL 1: PLATFORM LEVEL (Your Company)                │
│  ✓ Manage all client companies                         │
│  ✓ Create new tenants                                  │
│  ✓ System-wide monitoring                              │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  LEVEL 2: TENANT LEVEL (Client Companies)              │
│  ✓ Company A - Oud Palace Dubai                        │
│  ✓ Company B - Perfume House Abu Dhabi                 │
│  ✓ Company C - Luxury Fragrances LLC                   │
│  (Each has completely separate data)                    │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  LEVEL 3: USER LEVEL (Employees in each company)       │
│  ✓ Super Admin (Owner/CEO)                             │
│  ✓ Admin (Branch Manager)                              │
│  ✓ Staff (Sales, Inventory, etc.)                      │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 User Roles & Access Levels

### **Your Company (Platform Administrators)**

#### 1. **PLATFORM_ADMIN** (You - The Software Provider)
```
Login: platform@yourcompany.com
Access: ALL client companies
Can:
  ✓ Create new client companies (tenants)
  ✓ Manage all tenants
  ✓ View system-wide analytics
  ✓ Handle billing for all clients
  ✓ Technical support & maintenance
  ✓ Access any tenant's data (for support)
```

**Currently NOT implemented - needs to be added if you want this level**

---

### **Client Companies (Tenants)**

Each client company is a separate "Tenant" with their own:
- Database records (isolated)
- Users and staff
- Products and inventory
- Customers and orders
- Complete independence from other clients

#### Available Roles Per Tenant:

##### 1. **SUPER_ADMIN** (Company Owner/CEO)
```
Example: owner@oudpalace.ae
Access: Full control of their company
Can:
  ✓ Manage all settings
  ✓ Add/remove users
  ✓ View all reports
  ✓ Configure branding
  ✓ Manage all stores
  ✓ Full financial access
  ✓ Cannot see other companies' data
```

##### 2. **ADMIN** (Branch Manager)
```
Example: manager@oudpalace.ae
Access: Assigned store(s) management
Can:
  ✓ Manage assigned store operations
  ✓ View store reports
  ✓ Manage store staff
  ✓ Handle daily operations
  ✓ Cannot change company settings
```

##### 3. **SALES_STAFF** (POS User)
```
Example: sales1@oudpalace.ae
Access: Point of Sale operations
Can:
  ✓ Process sales
  ✓ Manage customers
  ✓ Handle returns
  ✓ View basic reports
  ✓ Cannot access inventory or finance
```

##### 4. **INVENTORY_STAFF** (Warehouse Staff)
```
Example: warehouse@oudpalace.ae
Access: Stock management
Can:
  ✓ Receive stock
  ✓ Transfer between stores
  ✓ Stock adjustments
  ✓ Cannot access sales or finance
```

##### 5. **PRODUCTION_STAFF** (Lab/Production)
```
Example: production@oudpalace.ae
Access: Manufacturing operations
Can:
  ✓ Create production batches
  ✓ Manage distillation
  ✓ Quality control
  ✓ Cannot access sales or finance
```

##### 6. **PROCUREMENT_OFFICER** (Purchase Officer)
```
Example: procurement@oudpalace.ae
Access: Supplier & Purchase management
Can:
  ✓ Create purchase orders
  ✓ Manage suppliers
  ✓ Track imports
  ✓ Cannot access sales
```

##### 7. **ACCOUNTANT** (Finance & Accounts)
```
Example: accounts@oudpalace.ae
Access: Financial operations
Can:
  ✓ Manage accounts
  ✓ Generate financial reports
  ✓ VAT returns
  ✓ Payroll processing
  ✓ Cannot access POS
```

##### 8. **HR_MANAGER** (Human Resources)
```
Example: hr@oudpalace.ae
Access: Staff management
Can:
  ✓ Manage employees
  ✓ Track attendance
  ✓ Process payroll
  ✓ Cannot access sales or inventory
```

##### 9. **EVENT_STAFF** (Exhibition/Event POS)
```
Example: event1@oudpalace.ae
Access: Temporary event sales
Can:
  ✓ Process sales at events
  ✓ Limited inventory view
  ✓ Basic customer management
```

##### 10. **EVENT_MANAGER** (Event Coordinator)
```
Example: eventmgr@oudpalace.ae
Access: Event management
Can:
  ✓ Manage event staff
  ✓ View event profitability
  ✓ Event reports
```

##### 11. **AUDITOR** (Read-Only Access)
```
Example: auditor@oudpalace.ae
Access: View-only for compliance
Can:
  ✓ View all records
  ✓ Generate reports
  ✗ Cannot modify anything
```

---

## 🔄 How Login Works

### **Current Setup (Single Tenant Per Database)**

```
1. User visits: https://oud-erp.onrender.com
2. Clicks "Sign In"
3. Enters email and password
4. System checks:
   - Is user valid?
   - Which tenant do they belong to?
   - What role do they have?
5. Redirects to dashboard
6. All data is filtered by tenantId automatically
```

### **Login Credentials Format**

Each client company should use their own domain in emails:

```bash
# Company A: Oud Palace Dubai
owner@oudpalace.ae          # Super Admin
manager@oudpalace.ae        # Branch Manager
sales1@oudpalace.ae         # Sales Staff
warehouse@oudpalace.ae      # Inventory Staff

# Company B: Perfume House Abu Dhabi
owner@perfumehouse.ae       # Super Admin
manager@perfumehouse.ae     # Branch Manager
sales1@perfumehouse.ae      # Sales Staff

# Company C: Luxury Fragrances LLC
owner@luxuryfragrances.ae   # Super Admin
...
```

---

## 🏗️ Current vs Needed Setup

### **What You Have Now:**
✅ Multi-tenant database structure
✅ User roles defined
✅ Login system working
✅ Data isolation by tenantId
✅ Role-based access control

### **What's Missing for Multiple Companies:**

#### Option 1: **Subdomain-Based Multi-Tenancy** (Recommended)
```
https://oudpalace.oud-erp.com       → Company A
https://perfumehouse.oud-erp.com    → Company B
https://luxuryfragrances.oud-erp.com → Company C
```

**Advantages:**
- Each company has their own URL
- Professional appearance
- Easy to manage
- Clear separation

**Implementation Needed:**
1. Add subdomain detection in middleware
2. Map subdomain to tenantId
3. Configure DNS wildcards
4. Update authentication flow

#### Option 2: **Single Domain with Company Selection** (Simpler)
```
https://oud-erp.onrender.com

Login Page:
┌─────────────────────────────┐
│  Email: sales1@oudpalace.ae │
│  Password: ******           │
│  [Sign In]                  │
└─────────────────────────────┘

System detects company from email domain
```

**Advantages:**
- No subdomain configuration needed
- Works with current setup
- Simpler deployment

**Current Status:** ✅ Already implemented!

#### Option 3: **Company Code at Login** (Enterprise)
```
Login Page:
┌─────────────────────────────┐
│  Company Code: OUDPAL       │
│  Email: sales1              │
│  Password: ******           │
│  [Sign In]                  │
└─────────────────────────────┘
```

**Advantages:**
- Very clear tenant selection
- Works for companies without custom emails
- Common in enterprise software

**Implementation Needed:**
1. Add company code to Tenant model
2. Update login form
3. Modify authentication flow

---

## 📝 How to Onboard a New Client Company

### Step 1: Create Tenant (Company)

**Currently:** Run this script or use Prisma Studio

```typescript
// Create new tenant
const newTenant = await prisma.tenant.create({
  data: {
    name: "Oud Palace Dubai",
    nameArabic: "قصر العود دبي",
    email: "info@oudpalace.ae",
    phone: "+971-4-1234567",
    address: "Dubai Mall, Downtown Dubai",
    isActive: true,

    // Branding
    branding: {
      create: {
        primaryColor: "#8B4513",
        secondaryColor: "#D4AF37",
        logoUrl: "https://...",
        companyNameEnglish: "Oud Palace Dubai",
        companyNameArabic: "قصر العود دبي"
      }
    }
  }
});
```

### Step 2: Create Super Admin for That Company

```typescript
const adminUser = await prisma.user.create({
  data: {
    email: "owner@oudpalace.ae",
    password: await bcrypt.hash("secure-password", 10),
    name: "Ahmed Al-Mansouri",
    role: "SUPER_ADMIN",
    tenantId: newTenant.id,
    isActive: true
  }
});
```

### Step 3: Send Login Credentials

```
Email to: owner@oudpalace.ae

Subject: Welcome to Oud & Perfume ERP

Dear Ahmed,

Your ERP system is ready!

Login URL: https://oud-erp.onrender.com/login
Email: owner@oudpalace.ae
Temporary Password: secure-password

Please change your password after first login.

Best regards,
Your Company Team
```

### Step 4: Client Sets Up Their System

The client's Super Admin can now:
1. Login
2. Configure branding
3. Add stores
4. Add products
5. Create staff accounts
6. Start using the system

---

## 🔒 Data Isolation

### How It Works:

Every database query automatically includes the tenant filter:

```typescript
// When a user logs in, we get their tenantId
const session = {
  user: {
    id: "user123",
    email: "sales1@oudpalace.ae",
    tenantId: "tenant_oudpalace",  // ← This is key!
    role: "SALES_STAFF"
  }
}

// All queries include tenantId
const products = await prisma.product.findMany({
  where: {
    tenantId: session.user.tenantId  // ← Automatic filtering
  }
});

// A user from Company A CANNOT see Company B's data
// Even if they try to hack the API!
```

### Security Middleware:

```typescript
// Every API route checks:
1. Is user authenticated?
2. Get their tenantId
3. Filter all data by that tenantId
4. User can ONLY see their company's data
```

---

## 🎯 Your Access (Software Provider)

### Current Situation:
You can access the database directly using:
- **Prisma Studio**: View/edit any tenant's data
- **Database Admin**: Full PostgreSQL access
- **Application**: Create a super-user account

### Recommended Setup:

Create a special "Platform Admin" system:

```typescript
// Add to schema.prisma
model PlatformAdmin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("PLATFORM_ADMIN")
  canAccessAllTenants Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Login as platform admin
platform-admin@yourcompany.com

// Can:
- View list of all tenants
- Create new tenants
- Impersonate any tenant for support
- View system-wide analytics
- Manage billing
```

---

## 📊 Summary Table

| **Level** | **Who** | **Access** | **Can See** |
|-----------|---------|------------|-------------|
| **Platform Admin** | You (Software Provider) | All tenants | Everything (all companies) |
| **SUPER_ADMIN** | Company Owner | Their company only | All their company data |
| **ADMIN** | Branch Manager | Assigned store(s) | Store-level data |
| **Staff Roles** | Employees | Limited by role | Role-specific data |

---

## 🚀 Next Steps

### For Current Demo/Testing:
✅ Works now with single login: `admin@oudperfume.ae`

### For Production (Multiple Companies):

1. **Add Company Onboarding Page** (for you to create new tenants)
2. **Automate Tenant Creation** (signup form or admin panel)
3. **Add Billing System** (optional - charge per company)
4. **Email Notifications** (welcome emails, invoices)
5. **Platform Admin Dashboard** (see all companies)

### Would You Like Me To:

- [ ] Create a tenant onboarding form?
- [ ] Add platform admin system?
- [ ] Set up subdomain routing?
- [ ] Create company signup page?
- [ ] Add billing/subscription system?

---

## 📞 Current Login for Testing

**Default Account:**
```
URL: https://oud-erp.onrender.com/login
Email: admin@oudperfume.ae
Password: admin123
```

This account is for "Oud Perfume" tenant (created during seed).

To add more companies, you need to:
1. Create tenant in database
2. Create admin user for that tenant
3. They login with their own credentials
4. Data is completely separate!

---

**Need help implementing any of these features?** Let me know which option you prefer!