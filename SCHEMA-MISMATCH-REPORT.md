# Schema Mismatch Issues Report

## Critical Issues Found

The application has **widespread schema mismatch issues** similar to the authentication and profile bugs that were just fixed.

### Root Cause
Code is using **SINGULAR** model names (`prisma.user`, `prisma.product`) but the Prisma schema maps to **LOWERCASE PLURAL** table names (`prisma.users`, `prisma.products`).

---

## Issues by Feature

### ✅ FIXED - Authentication & Profile
- **Status**: FIXED ✅
- **Files Fixed**:
  - `lib/auth-simple.ts` - Fixed user model name and field mappings
  - `app/api/profile/route.ts` - Fixed user model name and field mappings
- **Impact**: Users can now login and update their profiles

---

### ❌ BROKEN - Categories Management

**Wrong Model Name**: `prisma.category` → Should be `prisma.categories`

**Affected Files**:
1. `app/api/categories/route.ts` (5 occurrences)
2. `app/api/products/route.ts` (1 occurrence)
3. `app/api/inventory/raw-materials/route.ts` (1 occurrence)
4. `app/api/inventory/raw-materials/[id]/route.ts` (1 occurrence)

**Impact**:
- ❌ Cannot create categories
- ❌ Cannot list categories
- ❌ Cannot update categories
- ❌ Product creation fails if category validation is used
- ❌ Category dropdown in product form will be empty

**User Experience**:
```
User tries to: Create a new category "Luxury Perfumes"
Error shown: "Cannot read properties of undefined (reading 'create')"
Data saved: NO ❌
```

---

### ❌ BROKEN - Brands Management

**Wrong Model Name**: `prisma.brand` → Should be `prisma.brands`

**Affected Files**:
1. `app/api/brands/route.ts` (3 occurrences)
2. `app/api/products/route.ts` (1 occurrence)

**Impact**:
- ❌ Cannot create brands
- ❌ Cannot list brands
- ❌ Cannot update brands
- ❌ Product creation fails if brand validation is used
- ❌ Brand dropdown in product form will be empty

**User Experience**:
```
User tries to: Create a new brand "Oud Palace Premium"
Error shown: "Cannot read properties of undefined (reading 'create')"
Data saved: NO ❌
```

---

### ❌ BROKEN - Products Management

**Wrong Model Name**: `prisma.product` → Should be `prisma.products`

**Affected Files**:
1. `app/api/products/route.ts` (11 occurrences)
2. `app/api/products/barcode/[barcode]/route.ts` (4 occurrences)
3. `app/api/stock-adjustments/route.ts` (2 occurrences)
4. `app/api/work-orders/auto-generate/route.ts` (1 occurrence)
5. `app/api/warehouses/[id]/stock/route.ts` (1 occurrence)
6. `app/api/purchase-orders/route.ts` (1 occurrence)
7. `app/api/sampling/sessions/route.ts` (2 occurrences)
8. `app/api/replenishment/route.ts` (2 occurrences)
9. `app/api/transfers/route.ts` (1 occurrence)
10. `app/api/reports/balance-sheet/route.ts` (1 occurrence)
11. `app/api/analytics/dashboard/route.ts` (1 occurrence)

**Impact**:
- ❌ Cannot create products
- ❌ Cannot list products
- ❌ Cannot update products
- ❌ Cannot search products by barcode
- ❌ Stock adjustments fail
- ❌ Purchase orders fail
- ❌ Inventory transfers fail
- ❌ Reports fail

**User Experience**:
```
User tries to: Create a new product "Burmese Oud Oil 50ml"
Error shown: "Error creating product: [object Object]"
Data saved: NO ❌
```

---

### ❌ BROKEN - Customers Management

**Wrong Model Name**: `prisma.customer` → Should be `prisma.customers`

**Affected Files**:
1. `app/api/customers/route.ts` (9 occurrences)
2. `app/api/sales/pos/transaction/route.ts` (1 occurrence)
3. `app/api/invoices/stats/route.ts` (1 occurrence)
4. `app/api/crm/analytics/route.ts` (6 occurrences)
5. `app/api/recurring-invoices/route.ts` (1 occurrence)
6. `app/api/installment-plans/route.ts` (1 occurrence)
7. `app/api/returns/route.ts` (1 occurrence)
8. `app/api/customer-portal/route.ts` (1 occurrence)
9. `app/api/support-tickets/route.ts` (1 occurrence)

**Impact**:
- ❌ Cannot create customers
- ❌ Cannot list customers
- ❌ Cannot update customers
- ❌ POS sales fail
- ❌ CRM analytics fail
- ❌ Customer invoices fail
- ❌ Customer portal access fails

**User Experience**:
```
User tries to: Add a new customer "Ahmed Al Mazrouei"
Error shown: "Failed to create customer"
Data saved: NO ❌
```

---

### ❌ BROKEN - Stores Management

**Wrong Model Name**: `prisma.store` → Should be `prisma.stores`

**Affected Files**:
1. `app/api/stores/route.ts` (6 occurrences)
2. `app/api/purchase-orders/route.ts` (1 occurrence)
3. `app/api/sales/pos/transaction/route.ts` (1 occurrence)
4. `app/api/sampling/sessions/route.ts` (1 occurrence)
5. `app/api/replenishment/route.ts` (2 occurrences)
6. `app/api/transfers/route.ts` (2 occurrences)
7. `app/api/inventory/multi-location/route.ts` (3 occurrences)
8. `app/api/finance/profit-analysis/route.ts` (1 occurrence)
9. `app/api/orders/route.ts` (1 occurrence)

**Impact**:
- ❌ Cannot create stores
- ❌ Cannot list stores
- ❌ Cannot update stores
- ❌ Multi-location inventory fails
- ❌ Store transfers fail
- ❌ POS transactions fail
- ❌ Store profit analysis fails

**User Experience**:
```
User tries to: Create a new store "Dubai Mall Branch"
Error shown: "Failed to create store"
Data saved: NO ❌
```

---

### ❌ BROKEN - Users Management (Partial)

**Wrong Model Name**: `prisma.user` → Should be `prisma.users`

**Affected Files** (excluding already fixed auth files):
1. `app/api/sampling/sessions/route.ts` (1 occurrence - staff lookup)
2. Other employee/staff management features

**Impact**:
- ❌ Staff assignment in sampling sessions may fail
- ❌ Employee lookups may fail in various features

---

## Summary Statistics

| Feature | Wrong Model | Correct Model | Files Affected | Status |
|---------|-------------|---------------|----------------|--------|
| Users/Auth | `prisma.user` | `prisma.users` | 2 | ✅ FIXED |
| Categories | `prisma.category` | `prisma.categories` | 4 | ❌ BROKEN |
| Brands | `prisma.brand` | `prisma.brands` | 2 | ❌ BROKEN |
| Products | `prisma.product` | `prisma.products` | 11+ | ❌ BROKEN |
| Customers | `prisma.customer` | `prisma.customers` | 9+ | ❌ BROKEN |
| Stores | `prisma.store` | `prisma.stores` | 9+ | ❌ BROKEN |

**Total Files Needing Fixes**: ~40+ files
**Total Code Changes Needed**: ~100+ occurrences

---

## Additional Schema Mismatch Issues

### Field Name Mismatches

Similar to the profile issue, there may be other field name mismatches:

1. **Users Table**:
   - ❌ `user.name` (doesn't exist) → ✅ `user.firstName + user.lastName`
   - ❌ `user.image` (doesn't exist) → ✅ `user.avatar`
   - ❌ `user.role` (doesn't exist) → ✅ Default to 'USER' or check user_roles table
   - ❌ `user.address` (doesn't exist) → ✅ Field not in schema

2. **Products Table**:
   - Need to verify field names match between code and schema

3. **Other Tables**:
   - Need systematic verification of all field names

---

## Recommended Fix Priority

### Phase 1 - CRITICAL (Fix Immediately)
1. ✅ Authentication (DONE)
2. ✅ Profile Updates (DONE)
3. ❌ **Products Management** - Core feature, blocking inventory
4. ❌ **Categories & Brands** - Required for products
5. ❌ **Customers Management** - Core feature, blocking sales

### Phase 2 - HIGH (Fix Soon)
6. ❌ Stores Management - Needed for multi-location
7. ❌ Sales/POS - Critical for revenue
8. ❌ Inventory Management

### Phase 3 - MEDIUM (Fix Later)
9. ❌ Reports & Analytics
10. ❌ CRM Features
11. ❌ Advanced Features

---

## How to Verify After Fix

For each feature, test:

1. **Create**: Try creating a new record
2. **List**: View the list page
3. **Update**: Edit an existing record
4. **Delete**: Remove a record
5. **Persistence**: Refresh page, verify data still exists

---

## Current System Health

### Working Features ✅
- Login/Signup
- Profile updates
- Basic navigation
- Database seeded with initial data

### Broken Features ❌
- Product creation/management
- Category creation/management
- Brand creation/management
- Customer creation/management
- Store creation/management
- POS sales
- Inventory management
- Most reports and analytics

---

## Next Steps

1. Fix categories and brands (required for products)
2. Fix products management
3. Fix customers management
4. Test each fix with live database
5. Deploy fixes incrementally
6. Verify on production

---

**Generated**: 2025-10-22
**Issue Type**: Schema Mismatch (Model Names)
**Severity**: CRITICAL - Blocking core functionality
**Root Cause**: Code uses singular model names, schema uses lowercase plural table names
