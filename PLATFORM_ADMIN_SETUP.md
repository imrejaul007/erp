# 🔐 Platform Admin Dashboard - Setup Guide

## Overview

The Platform Admin Dashboard allows you (the software provider) to manage all client companies (tenants) from a single interface.

---

## 🎯 Features

### ✅ What You Can Do:

1. **Tenant Management**
   - View all client companies
   - Create new tenants
   - Edit tenant details
   - Suspend/activate tenants
   - Delete tenants (dangerous!)

2. **Real-time Analytics**
   - Total tenants count
   - Active vs Trial vs Suspended
   - System-wide revenue tracking
   - Per-tenant statistics (users, stores, products, orders)

3. **Tenant Onboarding**
   - Create new client company with one click
   - Automatically creates:
     - Tenant record
     - Owner admin user
     - Default category
   - Generates login credentials

4. **Subscription Management**
   - Manage plans (Trial, Basic, Professional, Enterprise)
   - Set quotas (users, stores, products)
   - Track billing cycles
   - View subscription history

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  PLATFORM ADMIN (You)                                   │
│  ✓ Manage all client companies                         │
│  ✓ Create new tenants                                  │
│  ✓ View system-wide analytics                          │
│  ✓ Control billing and subscriptions                   │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  TENANTS (Client Companies)                             │
│  ├─ Company A - Oud Palace Dubai                       │
│  ├─ Company B - Perfume House Abu Dhabi                │
│  └─ Company C - Luxury Fragrances LLC                  │
│  (Each completely isolated, cannot see each other)      │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Step 1: Create Your Platform Admin Account

After deploying the schema changes, you need to create your platform admin account.

**Option A: Using Prisma Studio (Easiest)**

```bash
# Open Prisma Studio
npx prisma studio

# Go to PlatformAdmin table
# Click "+ Add record"
# Fill in:
Email: platform@oudperfume.ae
Password: (use bcrypt hash - see below)
Name: Platform Administrator
Phone: +971-50-0000000
Role: PLATFORM_OWNER
isActive: true
canManageTenants: true
canManageBilling: true
canViewAnalytics: true
canAccessAllData: true
```

**Generate Password Hash:**
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-secure-password', 10).then(console.log);"
```

**Option B: Using SQL**

```sql
INSERT INTO platform_admins (
  id,
  email,
  password,
  name,
  phone,
  role,
  "isActive",
  "canManageTenants",
  "canManageBilling",
  "canViewAnalytics",
  "canAccessAllData",
  "createdAt",
  "updatedAt"
) VALUES (
  'platform-admin-1',
  'platform@oudperfume.ae',
  '$2b$10$YourBcryptHashHere',  -- Use bcrypt hash
  'Platform Administrator',
  '+971-50-0000000',
  'PLATFORM_OWNER',
  true,
  true,
  true,
  true,
  true,
  NOW(),
  NOW()
);
```

---

### Step 2: Access Platform Dashboard

**Local Development:**
```
http://localhost:3000/platform/login
```

**Production:**
```
https://oud-erp.onrender.com/platform/login
```

**Login Credentials:**
- Email: `platform@oudperfume.ae`
- Password: `(your password from step 1)`

---

## 📊 Platform Dashboard Features

### Main Dashboard

**Stats Cards:**
- Total Tenants
- Active Tenants
- Trial Tenants
- Suspended Tenants
- Total Revenue (across all tenants)

**Tenant List:**
- Search by name or email
- Filter by status (All, Active, Trial, Suspended, Cancelled)
- View tenant details:
  - Owner email & phone
  - Number of users, stores, products
  - Total orders and revenue
  - Creation date

**Actions:**
- View Details
- Edit Tenant
- Create New Tenant

---

### Creating a New Tenant

Click **"New Tenant"** button and fill in:

**Required Fields:**
- Company Name (e.g., "Oud Palace Dubai")
- Arabic Name (optional)
- Owner Name
- Owner Email
- Owner Phone
- Initial Password (will be shown once)
- Plan (Trial, Basic, Professional, Enterprise)
- Business Type (Retail, Wholesale, Both, Production, Distribution)

**What Happens:**
1. Creates tenant record
2. Generates unique slug (e.g., "oud-palace-dubai")
3. Creates owner user with SUPER_ADMIN role
4. Creates default category
5. Sets up trial period (14 days)
6. Shows login credentials

**Important:** Copy the credentials and send them to the client!

---

## 🎭 Platform Admin Roles

### PLATFORM_OWNER (You)
- Full access to everything
- Can manage all tenants
- Can view/manage billing
- Can delete tenants
- Access all tenant data (use carefully!)

### PLATFORM_ADMIN
- Manage tenants
- View analytics
- Cannot delete tenants
- Cannot access tenant data directly

### SUPPORT_AGENT
- View-only access
- Help customers
- Cannot modify anything

### DEVELOPER
- Technical access for maintenance
- No tenant management

---

## 📋 Subscription Plans

### Trial (14 days)
- **Free**
- 1 store
- 5 users
- 500 products
- All basic features

### Basic
- **Recommended pricing: 299 AED/month**
- 1 store
- 5 users
- 500 products
- POS + Inventory + Customers

### Professional
- **Recommended pricing: 999 AED/month**
- 5 stores
- 20 users
- 5,000 products
- Everything in Basic +
- Production Management
- Multi-location

### Enterprise
- **Recommended pricing: Custom**
- Unlimited stores
- 100 users
- Unlimited products
- Everything in Professional +
- Event Management
- API Access
- Priority Support

---

## 🔒 Security Best Practices

### For You:
1. **Change default password immediately**
2. **Use strong, unique password**
3. **Enable 2FA** (when implemented)
4. **Don't share platform admin credentials**
5. **Create separate accounts for team members**

### For Clients:
1. Email them credentials securely
2. Ask them to change password on first login
3. Don't store their passwords
4. Use temporary initial passwords

---

## 🛠️ API Endpoints

All platform admin endpoints require Bearer token authentication.

### Authentication
```
POST /api/platform/auth/login
Body: { email, password }
Response: { token, admin }
```

### Tenant Management
```
GET  /api/platform/tenants
GET  /api/platform/tenants/:id
POST /api/platform/tenants
PATCH /api/platform/tenants/:id
DELETE /api/platform/tenants/:id
```

**Example: Create Tenant**
```bash
curl -X POST https://oud-erp.onrender.com/api/platform/tenants \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Oud Palace Dubai",
    "nameArabic": "قصر العود دبي",
    "ownerName": "Ahmed Al-Mansouri",
    "ownerEmail": "owner@oudpalace.ae",
    "ownerPhone": "+971-50-1234567",
    "ownerPassword": "secure-password",
    "plan": "PROFESSIONAL",
    "businessType": "RETAIL"
  }'
```

---

## 📈 Monitoring & Analytics

### Metrics You Can Track:
- Total number of tenants
- Growth rate (new tenants per month)
- Churn rate (cancelled tenants)
- Revenue per tenant
- Average order value per tenant
- Most active tenants
- Tenants approaching limits

### Future Enhancements:
- Email notifications for trial expiry
- Automated billing
- Usage-based pricing
- Tenant health scores
- Predictive churn analysis

---

## 🔄 Typical Workflow

### Onboarding a New Client:

1. **Receive inquiry from potential client**
   - Get business details
   - Understand their needs
   - Recommend suitable plan

2. **Create tenant via Platform Dashboard**
   - Fill in company details
   - Select appropriate plan
   - Set initial quotas
   - Generate credentials

3. **Send credentials to client**
   ```
   Subject: Welcome to Oud & Perfume ERP!

   Dear [Client],

   Your ERP system is ready!

   Login URL: https://oud-erp.onrender.com/login
   Email: owner@clientcompany.ae
   Password: [secure-password]

   Please change your password after first login.

   Support: support@yourcompany.com

   Best regards,
   Your Company Team
   ```

4. **Client logs in and sets up their system**
   - Changes password
   - Configures branding
   - Adds stores
   - Adds products
   - Invites staff

5. **Monitor usage and provide support**
   - Check their progress
   - Offer training
   - Answer questions
   - Upgrade plan if needed

---

## 🐛 Troubleshooting

### Can't Login to Platform Dashboard
- Check email/password
- Verify account is active
- Check database directly via Prisma Studio

### Tenant Creation Fails
- Email already exists? Check users table
- Database connection issue? Check DATABASE_URL
- Missing fields? Review error message

### Token Expired
- Tokens expire after 8 hours
- Login again to get new token
- Consider increasing expiry time in production

---

## 🎯 Next Steps

### Must-Do:
- [ ] Create your platform admin account
- [ ] Test login to platform dashboard
- [ ] Create a test tenant
- [ ] Test client login with test tenant

### Nice-to-Have:
- [ ] Set up email notifications
- [ ] Implement billing integration
- [ ] Add 2FA for platform admins
- [ ] Create automated reporting
- [ ] Build client signup page

---

## 📞 Support

For issues with the Platform Admin system, contact your development team.

**Platform Admin Access:**
- Login: https://oud-erp.onrender.com/platform/login
- Email: platform@oudperfume.ae

**Client Access:**
- Login: https://oud-erp.onrender.com/login
- Each client has their own email

---

## ⚠️ Important Notes

1. **Platform Admin vs Tenant Admin**
   - Platform Admin: YOU (software provider)
   - Tenant Admin: Your CLIENTS (company owners)
   - Never confuse the two!

2. **Data Isolation**
   - Each tenant's data is completely separate
   - Tenants cannot see each other
   - You can see all tenants (use responsibly)

3. **Billing**
   - Currently manual - you need to invoice clients
   - Future: Automated billing with Stripe/payment gateway

4. **Backups**
   - Render.com handles PostgreSQL backups
   - Download backups regularly for safety
   - Test restore process

---

**Ready to start managing your SaaS platform!** 🚀
