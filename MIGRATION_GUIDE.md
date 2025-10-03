# Multi-Tenancy Migration Guide

**⚠️ CRITICAL: Read this entire guide before proceeding**

This guide will walk you through applying the multi-tenancy schema changes to your database.

---

## Prerequisites

- [x] Phase 1A Complete (schema updated, committed)
- [ ] Database backup created
- [ ] Database connection verified
- [ ] Downtime window scheduled (recommended)

---

## Option 1: Using Render Dashboard (RECOMMENDED)

### Step 1: Backup Your Database

1. Go to your Render Dashboard
2. Navigate to your PostgreSQL service
3. Click "Backups" tab
4. Create a manual backup
5. **Wait for backup to complete before proceeding**

### Step 2: Apply Migration via Render Shell

1. Go to your Render Web Service dashboard
2. Click "Shell" tab
3. Run these commands:

```bash
# Generate Prisma Client
npx prisma generate

# Create migration (this will analyze schema changes)
npx prisma migrate dev --name add_multi_tenancy

# This will:
# - Create migration files
# - Apply them to the database
# - Add tenantId columns to all 58 tables
```

**Expected output:**
```
✔ Prisma schema loaded
✔ Database schema synchronized
✔ Migration `add_multi_tenancy` created and applied successfully
```

### Step 3: Seed Default Tenant

Still in the Render Shell:

```bash
# Run tenant seed script
npm run db:seed:tenant
```

**Expected output:**
```
🚀 Starting Multi-Tenant Seed Script...

📦 Step 1: Creating Default Tenant...
✅ Default Tenant Created: Oud Palace (default-tenant-oud-palace)

🔄 Step 2: Updating existing records with default tenant ID...
✅ Updated X users
✅ Updated X customers
✅ Updated X products
...
🎉 Multi-Tenant Seed Complete!
```

### Step 4: Verify Migration

```bash
# Check database schema
npx prisma db pull

# View data in Prisma Studio
npx prisma studio
```

---

## Option 2: Local Development First (SAFEST)

### Step 1: Set Up Local PostgreSQL

```bash
# Install PostgreSQL (if not installed)
brew install postgresql@14  # macOS
# or sudo apt install postgresql  # Ubuntu

# Start PostgreSQL
brew services start postgresql

# Create local database
createdb oud_perfume_erp_local
```

### Step 2: Update .env.local

```env
DATABASE_URL="postgresql://localhost:5432/oud_perfume_erp_local"
```

### Step 3: Apply Migration Locally

```bash
# Generate Prisma Client
npx prisma generate

# Apply migration
npx prisma migrate dev --name add_multi_tenancy

# Seed default tenant
npm run db:seed:tenant
```

### Step 4: Test Locally

```bash
# Start dev server
npm run dev

# Test all features:
# - Login works
# - Dashboard loads
# - Products appear
# - POS works
# - Orders save
```

### Step 5: Apply to Production

Once verified locally, apply to production using **Option 1** above.

---

## Option 3: Direct Database Migration (ADVANCED)

If you have direct PostgreSQL access:

### Step 1: Backup

```bash
pg_dump -h dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com \
  -U oud_erp_user \
  -d oud_perfume_erp \
  > backup_before_multitenancy_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Generate Migration SQL

```bash
# This creates migration files without applying them
npx prisma migrate dev --create-only --name add_multi_tenancy
```

Migration files will be in: `prisma/migrations/XXXXXX_add_multi_tenancy/`

### Step 3: Review Migration SQL

```bash
cat prisma/migrations/*/migration.sql
```

Expected changes:
- CREATE TABLE "tenants" ...
- CREATE TABLE "tenant_subscriptions" ...
- CREATE TABLE "tenant_invoices" ...
- CREATE TABLE "tenant_api_keys" ...
- ALTER TABLE "users" ADD COLUMN "tenant_id" TEXT ...
- (Repeat for all 58 tables)

### Step 4: Apply Migration

```bash
# Apply migration to production
export DATABASE_URL="postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"

npx prisma migrate deploy
```

### Step 5: Seed Default Tenant

```bash
npm run db:seed:tenant
```

---

## Troubleshooting

### Error: "Foreign key constraint failed"

**Cause:** Some records don't have tenantId set

**Fix:**
```sql
-- Find tables with NULL tenant_id
SELECT 'users' as table_name, COUNT(*) as null_count
FROM users WHERE tenant_id IS NULL
UNION ALL
SELECT 'customers', COUNT(*) FROM customers WHERE tenant_id IS NULL
-- ... repeat for all tables
```

Then run seed script again:
```bash
npm run db:seed:tenant
```

### Error: "Column already exists"

**Cause:** Migration partially applied

**Fix:**
```bash
# Reset migration state
npx prisma migrate resolve --rolled-back add_multi_tenancy

# Re-apply
npx prisma migrate deploy
```

### Error: "Cannot connect to database"

**Cause:** DATABASE_URL not set or incorrect

**Fix:**
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Set it manually
export DATABASE_URL="postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
```

### Application doesn't start after migration

**Cause:** Prisma Client not regenerated

**Fix:**
```bash
npm run db:generate
npm run build
```

---

## Rollback Procedure

If something goes wrong:

### Option A: Restore from Backup (SAFEST)

1. Go to Render Dashboard → PostgreSQL → Backups
2. Select the backup you created before migration
3. Click "Restore"
4. Wait for restore to complete
5. Redeploy application

### Option B: Manual Rollback

```sql
-- Drop tenant tables
DROP TABLE IF EXISTS tenant_api_keys CASCADE;
DROP TABLE IF EXISTS tenant_invoices CASCADE;
DROP TABLE IF EXISTS tenant_subscriptions CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- Remove tenant_id columns (example for users table)
ALTER TABLE users DROP COLUMN IF EXISTS tenant_id;
-- Repeat for all 58 tables...
```

Then:
```bash
# Reset migrations
rm -rf prisma/migrations/*_add_multi_tenancy

# Regenerate from current database
npx prisma db pull
npx prisma generate
```

---

## Verification Checklist

After migration, verify these work:

- [ ] Application starts without errors
- [ ] Can log in
- [ ] Dashboard loads
- [ ] Products list shows data
- [ ] Can create new product
- [ ] POS terminal works
- [ ] Can complete a sale
- [ ] Orders appear in dashboard
- [ ] All existing data is visible
- [ ] No "tenantId" errors in console

---

## Post-Migration Steps

Once migration is successful:

### 1. Update Application Code

The migration only updates the **database schema**. You still need to:

- Update NextAuth to include tenantId in session
- Create tenant middleware for API routes
- Update all API endpoints to filter by tenantId
- Build signup/onboarding flow

See `PHASE_1A_COMPLETE.md` for next steps.

### 2. Test Multi-Tenant Isolation

Create a test tenant:

```sql
INSERT INTO tenants (
  id, name, slug, owner_name, owner_email, owner_phone,
  plan, status, is_active, created_at, updated_at, features
) VALUES (
  'test-tenant-123',
  'Test Merchant',
  'test-merchant',
  'Test Owner',
  'test@example.com',
  '+971-50-999-9999',
  'TRIAL',
  'TRIAL',
  true,
  NOW(),
  NOW(),
  '{"pos": true, "inventory": true}'::jsonb
);
```

Then verify:
- Test tenant can't see default tenant's data
- Default tenant can't see test tenant's data

### 3. Monitor for Issues

Watch logs for:
- "tenantId is required" errors
- Foreign key constraint errors
- Missing relation errors

---

## Support

If you encounter issues:

1. Check Render logs: Dashboard → Logs
2. Check database status: Dashboard → PostgreSQL → Metrics
3. Verify migration status:
   ```bash
   npx prisma migrate status
   ```

---

## Summary

**What the migration does:**
- ✅ Creates 4 new tenant tables
- ✅ Adds tenantId column to 58 existing tables
- ✅ Adds indexes for performance
- ✅ Creates default tenant
- ✅ Assigns all existing data to default tenant

**What it does NOT do:**
- ❌ Update application code
- ❌ Add tenant middleware
- ❌ Create signup flow
- ❌ Enable tenant switching

Those are Phase 2 tasks (code updates).

---

**Ready to proceed?**

Recommended order:
1. Create database backup ✅
2. Test locally first (Option 2)
3. Apply to production (Option 1)
4. Verify everything works
5. Proceed to Phase 2 (code updates)

**Estimated time:** 15-30 minutes
**Risk level:** Medium (database changes, but reversible with backup)

---

**Last Updated:** 2025-10-03
