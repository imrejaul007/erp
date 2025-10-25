# Product API Usage Guide

**Date**: 2025-10-25
**Status**: FIXED ✅

---

## ✅ ISSUE RESOLVED

**Problem**: Product creation was showing error `"Error creating product: [object Object]"`

**Root Cause**: API endpoint was using incorrect field names that didn't match the database schema

**Solution**: Updated API endpoint to use correct field names from the actual database schema

---

## 📋 CORRECT PRODUCT FIELDS

Use these fields when creating/updating products:

### **Required Fields:**
- ✅ `code` - Product code (unique per tenant)
- ✅ `name` - Product name
- ✅ `category` - Category name (string, not ID)
- ✅ `sellingPrice` - Selling price

### **Optional Fields:**
- `nameAr` - Arabic name
- `description` - Product description
- `subcategory` - Subcategory name
- `baseUnit` - Unit of measurement (default: "piece")
- `costPrice` - Cost price (default: 0)
- `currency` - Currency code (default: "AED")
- `vatRate` - VAT rate (default: 5)
- `minStockLevel` - Minimum stock level (default: 0)
- `maxStockLevel` - Maximum stock level
- `shelfLife` - Shelf life in days
- `barcode` - Barcode number
- `sku` - SKU code (unique per tenant)
- `imageUrl` - Product image URL
- `isActive` - Active status (default: true)

---

## 🔧 API ENDPOINTS

### **1. Create Product**

**Endpoint**: `POST /api/products`

**Headers**:
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN"
}
```

**Request Body**:
```json
{
  "code": "PERF-001",
  "name": "Arabian Oud Perfume",
  "nameAr": "عطر عود عربي",
  "category": "Perfumes",
  "subcategory": "Oud",
  "description": "Premium Arabian oud perfume with long-lasting fragrance",
  "baseUnit": "bottle",
  "costPrice": 80,
  "sellingPrice": 150,
  "currency": "AED",
  "vatRate": 5,
  "minStockLevel": 10,
  "maxStockLevel": 100,
  "shelfLife": 730,
  "barcode": "1234567890123",
  "sku": "PERF-OUD-001",
  "imageUrl": "https://example.com/images/oud-perfume.jpg",
  "isActive": true
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "prod-1735085403893",
    "code": "PERF-001",
    "name": "Arabian Oud Perfume",
    "nameAr": "عطر عود عربي",
    "category": "Perfumes",
    "subcategory": "Oud",
    "description": "Premium Arabian oud perfume with long-lasting fragrance",
    "baseUnit": "bottle",
    "costPrice": 80,
    "sellingPrice": 150,
    "currency": "AED",
    "vatRate": 5,
    "minStockLevel": 10,
    "maxStockLevel": 100,
    "shelfLife": 730,
    "barcode": "1234567890123",
    "sku": "PERF-OUD-001",
    "imageUrl": "https://example.com/images/oud-perfume.jpg",
    "isActive": true,
    "tenantId": "tenant-id",
    "createdAt": "2025-10-25T10:30:03.893Z",
    "updatedAt": "2025-10-25T10:30:03.893Z"
  }
}
```

---

### **2. Get All Products**

**Endpoint**: `GET /api/products`

**Query Parameters**:
- `search` - Search by name, code, SKU, or Arabic name
- `categoryId` - Filter by category
- `isActive` - Filter by active status (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Example**:
```
GET /api/products?search=oud&isActive=true&page=1&limit=10
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-1735085403893",
        "code": "PERF-001",
        "name": "Arabian Oud Perfume",
        "category": "Perfumes",
        "sellingPrice": 150,
        "isActive": true,
        ...
      }
    ],
    "pagination": {
      "total": 18,
      "pages": 2,
      "currentPage": 1,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### **3. Update Product**

**Endpoint**: `PUT /api/products`

**Request Body**:
```json
{
  "id": "prod-1735085403893",
  "name": "Premium Arabian Oud Perfume",
  "sellingPrice": 180,
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "prod-1735085403893",
    "code": "PERF-001",
    "name": "Premium Arabian Oud Perfume",
    "sellingPrice": 180,
    "description": "Updated description",
    "updatedAt": "2025-10-25T10:35:00.000Z",
    ...
  }
}
```

---

### **4. Delete Product** (Soft Delete)

**Endpoint**: `DELETE /api/products`

**Request Body**:
```json
{
  "id": "prod-1735085403893"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Product deleted successfully",
    "product": {
      "count": 1
    }
  }
}
```

---

## 📝 JAVASCRIPT EXAMPLES

### **Using Fetch API:**

```javascript
// Create Product
async function createProduct(productData) {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: 'PERF-001',
        name: 'Arabian Oud Perfume',
        category: 'Perfumes',
        sellingPrice: 150,
        costPrice: 80,
        baseUnit: 'bottle',
        minStockLevel: 10
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Product created:', result.data);
      return result.data;
    } else {
      console.error('Error:', result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

// Get Products
async function getProducts(search = '', page = 1) {
  try {
    const response = await fetch(`/api/products?search=${search}&page=${page}&limit=50`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

// Update Product
async function updateProduct(id, updates) {
  try {
    const response = await fetch('/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...updates
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Product updated:', result.data);
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

// Delete Product
async function deleteProduct(id) {
  try {
    const response = await fetch('/api/products', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Product deleted successfully');
      return true;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}
```

---

## ✅ VALIDATION RULES

### **Product Code:**
- Required
- Minimum 1 character
- Must be unique per tenant

### **Product Name:**
- Required
- Minimum 2 characters

### **Category:**
- Required
- Minimum 1 character

### **Selling Price:**
- Required
- Must be non-negative (>= 0)

### **Cost Price:**
- Optional
- Must be non-negative (>= 0)
- Defaults to 0

### **VAT Rate:**
- Optional
- Must be non-negative (>= 0)
- Defaults to 5

### **Stock Levels:**
- Optional
- Must be non-negative (>= 0)
- Defaults to 0

### **Shelf Life:**
- Optional
- Must be an integer (whole number)
- Measured in days

### **SKU:**
- Optional
- Must be unique per tenant if provided

---

## 🚨 COMMON ERRORS

### **Error: "Product code is required"**
**Solution**: Add `code` field to request body

### **Error: "Product with this code already exists"**
**Solution**: Use a unique product code or update existing product

### **Error: "Product with this SKU already exists"**
**Solution**: Use a unique SKU or leave SKU field empty

### **Error: "Validation error: Selling price must be non-negative"**
**Solution**: Ensure `sellingPrice` is >= 0

### **Error: "Insufficient permissions"**
**Solution**: User role must be OWNER, ADMIN, MANAGER, or INVENTORY

---

## ✅ WHAT WAS FIXED

### **Before (Broken):**
```json
{
  "categoryId": "cat-123",        ❌ Wrong field
  "brandId": "brand-123",         ❌ Doesn't exist
  "unitPrice": 150,               ❌ Wrong field name
  "stockQuantity": 100,           ❌ Doesn't exist
  "nameArabic": "test"            ❌ Wrong field name
}
```

### **After (Working):**
```json
{
  "code": "PERF-001",             ✅ Correct
  "name": "Arabian Oud",          ✅ Correct
  "category": "Perfumes",         ✅ Correct (string, not ID)
  "sellingPrice": 150,            ✅ Correct
  "nameAr": "عطر عود"             ✅ Correct
}
```

---

## 🎉 RESULT

**Product creation now works correctly!** ✅

You can now:
- ✅ Create products with correct field names
- ✅ Get proper error messages (not "[object Object]")
- ✅ Update products successfully
- ✅ Delete products (soft delete)
- ✅ Search and filter products

---

**Last Updated**: 2025-10-25
**Status**: FIXED ✅
**Changes Committed**: YES ✅
**Changes Pushed**: YES ✅
