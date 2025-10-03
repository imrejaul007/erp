# Phase 2: Multi-Tenancy Code Integration - COMPLETE ✅

**Status:** Authentication and middleware utilities ready

---

## What Was Accomplished

### 1. NextAuth Integration with Tenant Context

**File:** `lib/auth-simple.ts`

Added `tenantId` to authentication flow:
- ✅ JWT token includes `tenantId`
- ✅ Session includes `tenantId`
- ✅ Credentials provider returns `tenantId`
- ✅ OAuth providers fetch `tenantId` from database

**Changes Made:**
```typescript
// In authorize() - Line 61
return {
  id: user.id,
  email: user.email,
  name: user.name,
  image: user.image,
  role: user.role,
  tenantId: user.tenantId, // ← ADDED
};

// In jwt() callback - Line 83
token.tenantId = dbUser.tenantId; // ← ADDED

// In session() callback - Line 105
session.user.tenantId = token.tenantId as string | null; // ← ADDED
```

### 2. TypeScript Type Definitions

**File:** `types/next-auth.d.ts` (NEW)

Extended NextAuth types to include tenant information:
```typescript
declare module 'next-auth' {
  interface Session {
    user: {
      // ... existing fields
      tenantId?: string | null; // ← ADDED
    };
  }

  interface User {
    // ... existing fields
    tenantId?: string | null; // ← ADDED
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    // ... existing fields
    tenantId?: string | null; // ← ADDED
  }
}
```

### 3. Tenant Context Utilities

**File:** `lib/tenantContext.ts` (NEW)

Helper functions for server components and API routes:

| Function | Description | Returns | Use Case |
|----------|-------------|---------|----------|
| `getTenantId()` | Get tenant ID from session | `string \| null` | Optional tenant context |
| `requireTenantId()` | Get tenant ID or throw error | `string` | Required tenant context |
| `validateTenantAccess(tenantId)` | Check if user can access tenant | `boolean` | Authorization checks |
| `getTenantContext()` | Get full context (user + tenant) | `object \| null` | Complete user info |

**Usage Examples:**
```typescript
// In a Server Component
import { getTenantId, requireTenantId } from '@/lib/tenantContext';

// Optional tenant
const tenantId = await getTenantId();
if (tenantId) {
  // Show tenant-specific content
}

// Required tenant
const tenantId = await requireTenantId(); // Throws if no tenant
const products = await prisma.product.findMany({
  where: { tenantId }
});
```

### 4. API Middleware System

**File:** `lib/apiMiddleware.ts` (NEW)

Comprehensive middleware for API routes with automatic tenant enforcement:

#### Helper Functions:

**`apiResponse(data, status)`** - Consistent JSON responses
```typescript
return apiResponse({ products }, 200);
```

**`apiError(message, status)`** - Consistent error responses
```typescript
return apiError('Product not found', 404);
```

**`getAuthenticatedUser()`** - Get current user (no throw)
```typescript
const user = await getAuthenticatedUser();
if (!user) return apiError('Login required', 401);
```

**`requireAuth()`** - Require authentication (throws)
```typescript
const user = await requireAuth(); // Throws if not logged in
```

**`requireTenant()`** - Require tenant context (throws)
```typescript
const { tenantId, user } = await requireTenant();
// Verifies:
// - User is authenticated
// - User has tenantId
// - Tenant exists and is active
```

#### Route Wrappers:

**`withTenant(handler)`** - Wrap API route with tenant enforcement

**Before (old way):**
```typescript
export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { tenantId: session.user.tenantId } // Easy to forget!
  });

  return NextResponse.json(products);
}
```

**After (new way):**
```typescript
import { withTenant, apiResponse } from '@/lib/apiMiddleware';

export const GET = withTenant(async (req, { tenantId, user }) => {
  // tenantId is GUARANTEED to exist
  // tenant is GUARANTEED to be active
  const products = await prisma.product.findMany({
    where: { tenantId }
  });

  return apiResponse(products);
});
```

**Benefits:**
- ✅ Auto-validates authentication
- ✅ Auto-validates tenant exists and is active
- ✅ Auto-handles errors
- ✅ Consistent error messages
- ✅ TypeScript type safety
- ✅ Less boilerplate code

**`withAuth(handler)`** - Wrap API route with auth only (no tenant required)
```typescript
export const GET = withAuth(async (req, { user }) => {
  // User is authenticated but tenantId is optional
  // Useful for:
  // - Tenant selection pages
  // - Super admin endpoints
  // - Account settings
});
```

#### Role-Based Access Control:

**`hasRole(user, roles)`** - Check if user has role
```typescript
if (hasRole(user, 'SUPER_ADMIN')) {
  // Show admin features
}

if (hasRole(user, ['ADMIN', 'SUPER_ADMIN'])) {
  // Admin or super admin only
}
```

**`requireRole(user, roles)`** - Require role or throw
```typescript
export const DELETE = withTenant(async (req, { tenantId, user }) => {
  requireRole(user, 'SUPER_ADMIN'); // Throws if not super admin

  // Delete logic here
});
```

---

## How to Update Existing API Routes

### Step 1: Import the middleware

```typescript
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';
```

### Step 2: Wrap your handler

**Before:**
```typescript
export async function GET(request: NextRequest) {
  // Your code
}
```

**After:**
```typescript
export const GET = withTenant(async (req, { tenantId, user }) => {
  // Your code - tenantId guaranteed
});
```

### Step 3: Update queries to use tenantId

**Before:**
```typescript
const products = await prisma.product.findMany();
```

**After:**
```typescript
const products = await prisma.product.findMany({
  where: { tenantId }
});
```

### Step 4: Use consistent responses

**Before:**
```typescript
return NextResponse.json(products);
return NextResponse.json({ error: 'Not found' }, { status: 404 });
```

**After:**
```typescript
return apiResponse(products);
return apiError('Product not found', 404);
```

---

## Example: Complete API Route Migration

### Before (Old Code):
```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-simple';
import { prisma } from '@/lib/database/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

### After (New Code):
```typescript
// app/api/products/route.ts
import { NextRequest } from 'next/server';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';
import { prisma } from '@/lib/database/prisma';

export const GET = withTenant(async (req, { tenantId, user }) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        tenantId, // ← ADDED: Tenant isolation
        isActive: true,
      },
      include: {
        category: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return apiError('Failed to fetch products', 500);
  }
});
```

**Lines of code:** 35 → 25 (-29% code)
**Benefits:** Automatic auth, tenant validation, consistent errors

---

## Testing the Changes

### 1. Test Authentication with Tenant

```bash
# Start dev server
npm run dev

# Login and check session
# In browser console:
fetch('/api/auth/session').then(r => r.json()).then(console.log)

# Should see:
{
  user: {
    id: "...",
    email: "...",
    tenantId: "default-tenant-oud-palace" // ← SHOULD BE PRESENT
  }
}
```

### 2. Test API Middleware

Create a test endpoint:
```typescript
// app/api/test-tenant/route.ts
import { withTenant, apiResponse } from '@/lib/apiMiddleware';

export const GET = withTenant(async (req, { tenantId, user }) => {
  return apiResponse({
    message: 'Tenant context working!',
    tenantId,
    userId: user.id,
    userEmail: user.email,
  });
});
```

Visit: `http://localhost:3000/api/test-tenant`

Expected response:
```json
{
  "message": "Tenant context working!",
  "tenantId": "default-tenant-oud-palace",
  "userId": "user-id",
  "userEmail": "user@example.com"
}
```

### 3. Test Tenant Isolation

If you have multiple tenants:
```typescript
// Should ONLY see products for current tenant
const products = await prisma.product.findMany({
  where: { tenantId }
});
```

---

## Security Checklist

After implementing:

- [ ] All API routes use `withTenant` or `withAuth`
- [ ] All database queries filter by `tenantId`
- [ ] No direct `prisma.model.findMany()` without `where: { tenantId }`
- [ ] File uploads include tenant folder structure
- [ ] No cross-tenant data leakage (test with 2 tenants)
- [ ] Session includes tenantId
- [ ] Inactive tenants are blocked from API access

---

## Next Steps (Phase 3)

Now that tenant context is in place, you can:

### 1. Update All API Routes (High Priority)
- Go through each file in `app/api/`
- Wrap with `withTenant`
- Add `tenantId` filter to queries
- ~50+ routes to update

### 2. Build Tenant Signup Flow
- Create `/signup` page
- Create `/api/tenants/provision` endpoint
- Email verification
- Welcome email
- Trial period tracking

### 3. Build Onboarding Wizard
- Multi-step form
- Business details
- Logo upload
- First store creation
- Team invitation

### 4. Subscription Management
- Plan selection page
- Payment integration (Stripe)
- Usage tracking
- Billing dashboard
- Invoice generation

### 5. Tenant Dashboard
- Subscription status
- Usage metrics (storage, API calls, users)
- Billing history
- Settings (branding, features)
- Team management

---

## Files Created/Modified in Phase 2

| File | Status | Description |
|------|--------|-------------|
| `lib/auth-simple.ts` | Modified | Added tenantId to JWT and session |
| `types/next-auth.d.ts` | Created | TypeScript type extensions |
| `lib/tenantContext.ts` | Created | Server-side tenant utilities |
| `lib/apiMiddleware.ts` | Created | API route middleware system |

---

## Breaking Changes

None! These changes are **backward compatible**:
- Existing code continues to work
- `tenantId` is optional in session
- No database changes required
- Can gradually migrate API routes

---

## Performance Considerations

### Indexes Already Added ✅
All tables have `@@index([tenantId])` for fast queries

### Query Performance
```sql
-- Fast (uses index)
SELECT * FROM products WHERE tenant_id = 'xxx';

-- Slow (no index, scans all rows)
SELECT * FROM products;
```

Always filter by `tenantId` first!

---

## Common Patterns

### Pattern 1: List resources for tenant
```typescript
export const GET = withTenant(async (req, { tenantId }) => {
  const items = await prisma.model.findMany({
    where: { tenantId }
  });
  return apiResponse(items);
});
```

### Pattern 2: Create resource for tenant
```typescript
export const POST = withTenant(async (req, { tenantId, user }) => {
  const body = await req.json();

  const item = await prisma.model.create({
    data: {
      ...body,
      tenantId, // ← ALWAYS include
      createdById: user.id,
    }
  });

  return apiResponse(item, 201);
});
```

### Pattern 3: Update resource (with tenant validation)
```typescript
export const PATCH = withTenant(async (req, { tenantId, user }) => {
  const { id } = await req.json();

  // Verify resource belongs to tenant
  const existing = await prisma.model.findFirst({
    where: { id, tenantId }
  });

  if (!existing) {
    return apiError('Not found or access denied', 404);
  }

  const updated = await prisma.model.update({
    where: { id },
    data: { /* updates */ }
  });

  return apiResponse(updated);
});
```

### Pattern 4: Delete resource (admin only)
```typescript
export const DELETE = withTenant(async (req, { tenantId, user }) => {
  requireRole(user, ['ADMIN', 'SUPER_ADMIN']);

  const { id } = await req.json();

  await prisma.model.delete({
    where: { id, tenantId }
  });

  return apiResponse({ success: true });
});
```

---

**STATUS:** Phase 2 Complete ✅
**Next:** Update API routes (Phase 3) or Build signup flow

**Last Updated:** 2025-10-03
