# Debug Product Creation Issues

**Date**: 2025-10-25

---

## 🔍 COMMON CAUSES OF PRODUCT CREATION FAILURES

### **1. Not Logged In** ⭐⭐⭐⭐⭐ (MOST COMMON)
**Problem**: The API requires authentication. If you're not logged in, it will fail.

**Solution**:
1. Make sure you're logged in to the system
2. Check if your session is still valid
3. Try logging out and logging back in

**How to Check**:
- Open browser console (F12)
- Go to Application > Cookies
- Look for `next-auth.session-token` cookie
- If missing or expired → You need to log in

---

### **2. Missing Required Fields**
**Problem**: The API requires certain fields to create a product.

**Required Fields**:
- ✅ `code` - Product code (unique)
- ✅ `name` - Product name
- ✅ `category` - Category name
- ✅ `sellingPrice` - Selling price

**Solution**:
Make sure all required fields are filled in the form.

---

### **3. Validation Errors**
**Problem**: Data doesn't pass validation rules.

**Common Issues**:
- Product code already exists
- SKU already exists
- Selling price is negative
- Name is less than 2 characters

**Solution**:
Check the error message - it will tell you exactly what's wrong.

---

## 🔧 HOW TO DEBUG

### **Step 1: Open Browser Console**
1. Press `F12` (or right-click → Inspect)
2. Go to "Console" tab
3. Try creating a product
4. Look for error messages in red

### **Step 2: Check Network Tab**
1. Press `F12`
2. Go to "Network" tab
3. Try creating a product
4. Look for `/api/products` request
5. Click on it to see:
   - Request headers
   - Request body (what was sent)
   - Response status (200, 400, 401, 500, etc.)
   - Response body (error message)

### **Step 3: Common Error Codes**

| Status Code | Meaning | Solution |
|------------|---------|----------|
| **401** | Not authenticated | Log in |
| **403** | Insufficient permissions | Check user role |
| **400** | Validation error | Check error message for details |
| **409** | Duplicate code/SKU | Use different code/SKU |
| **500** | Server error | Check server logs |

---

## 🐛 DEBUGGING SCRIPT

Run this to test product creation directly:

```bash
cd "/Users/rejaulkarim/Documents/Oud PMS"
node test-product-creation.mjs
```

This will test:
- ✅ Database connection
- ✅ Product creation with minimum fields
- ✅ Product creation with all fields
- ✅ Duplicate validation
- ✅ Update/delete operations

**If this works** → Problem is in frontend or authentication
**If this fails** → Problem is in database or API

---

## 🔍 WHAT TO CHECK IN BROWSER

### **1. Check if Logged In**
Open console and run:
```javascript
fetch('/api/auth/session')
  .then(r => r.json())
  .then(data => console.log('Session:', data))
```

**Expected Result**:
```json
{
  "user": {
    "id": "...",
    "email": "...",
    "role": "...",
    "tenantId": "..."
  }
}
```

**If you get `null`** → You're not logged in!

---

### **2. Test API Directly**
Open console and run:
```javascript
fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: `TEST-${Date.now()}`,
    name: 'Test Product',
    category: 'Test',
    sellingPrice: 100
  })
})
.then(r => r.json())
.then(data => console.log('Result:', data))
.catch(err => console.error('Error:', err))
```

**Expected Result** (Success):
```json
{
  "id": "prod-...",
  "code": "TEST-...",
  "name": "Test Product",
  ...
}
```

**Expected Result** (Error - Not Logged In):
```json
{
  "error": "Please log in"
}
```

**Expected Result** (Error - Validation):
```json
{
  "error": "Validation error: Product code is required"
}
```

---

## ✅ STEP-BY-STEP TROUBLESHOOTING

### **Step 1: Verify You're Logged In**
1. Go to login page: http://localhost:3000/auth/signin
2. Enter credentials
3. After login, you should see the dashboard
4. Try creating a product again

### **Step 2: Check Form Data**
Open console and add this before the fetch call in the form:
```javascript
console.log('Sending data:', productData);
```

Verify:
- ✅ `code` exists and is not empty
- ✅ `name` exists and is not empty
- ✅ `category` exists and is not empty
- ✅ `sellingPrice` is a number

### **Step 3: Check API Response**
Add this after the fetch call:
```javascript
console.log('API Response Status:', response.status);
console.log('API Response Data:', responseData);
```

Look for:
- Status 401 → Not logged in
- Status 400 → Validation error (check message)
- Status 409 → Duplicate code/SKU
- Status 500 → Server error

### **Step 4: Check Server Logs**
If running in development:
```bash
# Your terminal should show logs
# Look for error messages when you submit the form
```

---

## 🚨 MOST LIKELY ISSUE

**You're probably not logged in!**

**Quick Test**:
1. Open: http://localhost:3000/auth/signin
2. Log in with your credentials
3. Go back to product creation page
4. Try creating a product

**If it works** → That was the issue!
**If it still doesn't work** → Continue debugging with steps above

---

## 📋 WHAT TO SEND ME

If still not working, send me:

1. **Error Message**: Exact error text shown
2. **Console Errors**: Screenshot or copy from browser console
3. **Network Response**:
   - Go to Network tab
   - Find `/api/products` request
   - Send me the Response tab content
4. **Session Status**: Result of `/api/auth/session` check

---

## 💡 QUICK FIXES

### **Fix 1: Clear Cookies & Log In Again**
1. Press `F12`
2. Go to Application tab
3. Expand "Cookies"
4. Right-click on your site → Clear
5. Refresh page
6. Log in again

### **Fix 2: Use Private/Incognito Window**
1. Open private/incognito window
2. Go to your site
3. Log in
4. Try creating product

If it works in incognito → Your cookies/cache were corrupted

### **Fix 3: Restart Development Server**
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

---

## ✅ AFTER FIXING

Once product creation works, you should see:
1. ✅ Success message: "Product created successfully!"
2. ✅ Product appears in product list
3. ✅ Form resets to empty
4. ✅ No error messages

---

**Need more help? Tell me:**
1. Exact error message you see
2. Are you logged in?
3. What happens in browser console?
4. What status code does `/api/products` return?

I'll help you fix it! 🚀
