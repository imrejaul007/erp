# 🔵 Render Blueprint Deployment Guide

## 🎯 You're Using Render Blueprint

Since you're using a Blueprint, here's the specific guide for your setup.

---

## 📋 WHAT IS A RENDER BLUEPRINT?

A Blueprint is a `render.yaml` file that defines your infrastructure as code. It can:
- ✅ Create services automatically
- ✅ Define some environment variables
- ⚠️ But sensitive variables STILL need manual setup

---

## 🚀 STEP-BY-STEP GUIDE FOR BLUEPRINT

### Step 1: Find Your Render Services (1 minute)

1. Go to: **https://dashboard.render.com**
2. Login with your Render account
3. You should see:
   - **Web Service** (your Next.js app)
   - **PostgreSQL Database** (your database)

**Write down the Web Service name** (e.g., "oud-perfume-erp")

---

### Step 2: Find Your App URL (1 minute)

1. Click on your **Web Service**
2. At the top, you'll see the URL:
   - Example: `https://oud-perfume-erp.onrender.com`
   - OR: `https://oud-perfume-erp-xyz123.onrender.com`

**Copy this URL exactly!** You'll need it in the next steps.

---

### Step 3: Update Environment Variables (5 minutes)

Even with a Blueprint, some variables need manual setup:

#### 3.1 Go to Environment Variables

1. In your Web Service page
2. Click **"Environment"** in the left sidebar
3. You'll see existing variables from the Blueprint

#### 3.2 Find and Update These Variables

Look for these variables and update them:

---

##### Variable: NEXTAUTH_URL

**Current value** (probably):
```
http://localhost:3000   ❌ WRONG
```

**Update to** (use YOUR URL from Step 2):
```
https://oud-perfume-erp.onrender.com   ✅ CORRECT
```

**How to update**:
1. Find `NEXTAUTH_URL` in the list
2. Click the **pencil icon (Edit)**
3. Change value to your Render URL from Step 2
4. Must start with `https://` (not `http://`)
5. Must match your exact Render URL
6. No trailing slash

---

##### Variable: NEXT_PUBLIC_APP_URL

**Current value** (probably):
```
http://localhost:3000   ❌ WRONG
```

**Update to** (same as NEXTAUTH_URL):
```
https://oud-perfume-erp.onrender.com   ✅ CORRECT
```

---

##### Variable: NODE_ENV

**Current value** (might be):
```
development   ❌ WRONG
```

**Update to**:
```
production   ✅ CORRECT
```

---

##### Variable: DATABASE_URL

**Should already be set** by the Blueprint connecting to your PostgreSQL.

**Check it looks like**:
```
postgresql://username:password@host/database
```

**If missing**, get it from:
1. Go to your PostgreSQL service
2. Click "Info" tab
3. Copy "Internal Database URL"
4. Add to Web Service environment variables

---

##### Variable: NEXTAUTH_SECRET

**Might be missing or have placeholder**

**Set to**:
```
qHpm7fQyVhb1DisPoJ22di7iHLKpeZmSqLn8uvxa3ZI=
```

**Or generate new one**:
```bash
openssl rand -base64 32
```

---

### Step 4: Save Changes (1 minute)

1. After updating all variables, scroll down
2. Click **"Save Changes"** button
3. You'll see a banner: "Environment variables updated"

---

### Step 5: Trigger Manual Deploy (1 minute)

**IMPORTANT**: Changing environment variables doesn't auto-deploy!

1. At the top of the page, click **"Manual Deploy"** button
2. A dropdown appears:
   - Select **"Clear build cache & deploy"**
3. Click **"Deploy"**
4. Wait for deployment to complete

**Watch the logs**:
- Should say "Build succeeded"
- Should say "Deploy live"
- Usually takes 5-10 minutes

---

### Step 6: Wait for Deployment (5-10 minutes)

**What happens during deployment**:
```
Building...
  ↓
Running: npm install
  ↓
Running: prisma generate
  ↓
Running: prisma db push
  ↓
Running: next build
  ↓
Starting application
  ↓
✅ Live
```

**Wait until you see**: Green checkmark and "Live" status

---

### Step 7: Test Login (2 minutes)

1. **Open your Render URL** in browser:
   - Example: `https://oud-perfume-erp.onrender.com`

2. **You should see**:
   - Login page or Home page
   - NO localhost errors
   - NO redirect to localhost

3. **Click Login or go to**: `/auth/signin`

4. **Login with**:
   - Email: `admin@oudpalace.ae`
   - Password: `admin123`

5. **Expected result**:
   - ✅ Successfully logged in
   - ✅ See dashboard
   - ✅ See your name in top-right corner

---

### Step 8: Test Data Saving (3 minutes)

#### Test 1: Create Product

1. **Navigate**: Products → Add Product
2. **Fill in**:
   - Name: `Test Product Blueprint`
   - SKU: `BLUEPRINT-001`
   - Category: Select any
   - Price: `100`
3. **Click**: Save
4. **Expected**:
   - ✅ Success message
   - ✅ Product appears in product list
5. **Press F5** (refresh page)
6. **Expected**:
   - ✅ Product still there!

#### Test 2: Create Customer

1. **Navigate**: Customers → Add Customer
2. **Fill in**:
   - Name: `Test Customer Blueprint`
   - Email: `test@blueprint.com`
   - Phone: `+971501234567`
3. **Click**: Save
4. **Expected**:
   - ✅ Success message
   - ✅ Customer appears in customer list
5. **Press F5** (refresh page)
6. **Expected**:
   - ✅ Customer still there!

---

## 🎉 SUCCESS INDICATORS

### ✅ Everything is Working When:

1. ✅ Can visit Render URL (no localhost redirect)
2. ✅ Can see login page
3. ✅ Can login successfully
4. ✅ Dashboard loads after login
5. ✅ Can create product → It appears
6. ✅ Refresh page → Product still there
7. ✅ Can create customer → It appears
8. ✅ Refresh page → Customer still there
9. ✅ Close browser → Reopen → Login → Data still there

**If ALL above work** → 🎊 **DATA IS SAVING!**

---

## 🐛 TROUBLESHOOTING FOR BLUEPRINT

### Issue 1: "Redirects to localhost after login"

**Cause**: NEXTAUTH_URL still pointing to localhost

**Fix**:
1. Go to Environment variables
2. Update NEXTAUTH_URL to your Render URL
3. Must be `https://your-app.onrender.com`
4. Save and redeploy

---

### Issue 2: "Cannot login - Invalid credentials"

**Cause**: Database not seeded with admin user

**Fix via Render Shell**:
1. Go to your Web Service
2. Click **"Shell"** tab (might need to scroll down in sidebar)
3. Wait for shell to open
4. Run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Seed database
npm run db:seed
npm run db:seed:platform

# Check if user exists
npx prisma studio
```

5. Wait 30 seconds
6. Try login again

---

### Issue 3: "Database connection error"

**Cause**: DATABASE_URL not set or wrong

**Fix**:
1. Go to PostgreSQL service
2. Click "Info" tab
3. Copy "Internal Database URL"
4. Go to Web Service → Environment
5. Update or add DATABASE_URL variable
6. Save and redeploy

---

### Issue 4: "Build fails"

**Cause**: Missing dependencies or environment variables

**Fix**:
1. Check Render logs for specific error
2. Common issues:
   - Missing DATABASE_URL
   - Prisma generation failed
   - TypeScript errors

**If Prisma fails**:
```bash
# In Render Shell
npx prisma generate
npx prisma db push --accept-data-loss
```

---

### Issue 5: "Data saves but disappears"

**Cause**: Using wrong database

**Check**:
1. Verify DATABASE_URL points to your PostgreSQL on Render
2. Should NOT be localhost
3. Should start with `postgresql://`

**Verify data in database**:
1. Go to PostgreSQL service
2. Click "Connect" → "External Connection"
3. Use provided connection string
4. Run: `SELECT * FROM products;`
5. Should see your data

---

## 📊 BLUEPRINT-SPECIFIC NOTES

### What render.yaml Defines

Your `render.yaml` file defines:
- Service type (web)
- Build command
- Start command
- Environment variables (some)
- Database connection

### What You Still Need to Do Manually

Even with Blueprint:
- ⚠️ Update NEXTAUTH_URL to production URL
- ⚠️ Update NEXT_PUBLIC_APP_URL to production URL
- ⚠️ Set NODE_ENV to production
- ⚠️ Verify DATABASE_URL is correct
- ⚠️ Trigger manual deploy after changes

---

## 🔄 RE-DEPLOYING WITH BLUEPRINT

### For Code Changes:
```
1. Make code changes locally
2. Commit to git: git commit -m "changes"
3. Push to GitHub: git push
4. Render auto-deploys ✅
```

### For Environment Variable Changes:
```
1. Update variables in Render Dashboard
2. Click "Manual Deploy"
3. Wait for deployment
```

### To Update Blueprint:
```
1. Edit render.yaml file
2. Commit and push to GitHub
3. Render applies changes automatically
```

---

## 🎯 QUICK REFERENCE

### Your Blueprint Environment Variables Checklist:

- [ ] NEXTAUTH_URL = `https://[your-app].onrender.com`
- [ ] NEXT_PUBLIC_APP_URL = `https://[your-app].onrender.com`
- [ ] NODE_ENV = `production`
- [ ] DATABASE_URL = `postgresql://...` (from PostgreSQL service)
- [ ] NEXTAUTH_SECRET = `qHpm7fQyVhb1DisPoJ22di7iHLKpeZmSqLn8uvxa3ZI=`

### After Updating:
- [ ] Clicked "Save Changes"
- [ ] Clicked "Manual Deploy"
- [ ] Waited for "Live" status
- [ ] Tested login
- [ ] Tested data saving

---

## 🚀 BLUEPRINT DEPLOYMENT FLOW

```
1. You push code to GitHub
   ↓
2. Render detects change (via Blueprint)
   ↓
3. Render builds application
   - npm install
   - prisma generate
   - prisma db push
   - next build
   ↓
4. Render starts application
   - next start
   ↓
5. Application uses environment variables
   - From Render Dashboard (manual)
   - From render.yaml (automatic)
   ↓
6. ✅ Application LIVE
```

---

## 📱 VISUAL GUIDE

### Render Dashboard Layout:

```
┌─────────────────────────────────────────┐
│  Dashboard                               │
├─────────────────────────────────────────┤
│                                          │
│  Services:                               │
│  ┌──────────────────────────────────┐  │
│  │ 🌐 oud-perfume-erp (Web Service) │  │
│  │    https://oud-perfume-erp...    │  │ ← Click this
│  └──────────────────────────────────┘  │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │ 🗄️ PostgreSQL Database           │  │
│  └──────────────────────────────────┘  │
│                                          │
└─────────────────────────────────────────┘

After clicking Web Service:

┌─────────────────────────────────────────┐
│  oud-perfume-erp                         │
│  https://oud-perfume-erp.onrender.com   │ ← Your URL
├─────────────────────────────────────────┤
│  [Manual Deploy ▼]  [Settings]          │
├─────────────────────────────────────────┤
│                                          │
│  Sidebar:                                │
│  • Events                                │
│  • Logs                                  │
│  • Environment      ← Click this        │
│  • Shell                                 │
│  • Metrics                               │
│  • Settings                              │
│                                          │
└─────────────────────────────────────────┘
```

---

## ✅ FINAL CHECKLIST

Complete these in order:

1. [ ] Found my Web Service on Render Dashboard
2. [ ] Noted my Render URL (https://...)
3. [ ] Went to Environment tab
4. [ ] Updated NEXTAUTH_URL to my Render URL
5. [ ] Updated NEXT_PUBLIC_APP_URL to my Render URL
6. [ ] Set NODE_ENV to "production"
7. [ ] Verified DATABASE_URL exists
8. [ ] Verified NEXTAUTH_SECRET exists
9. [ ] Clicked "Save Changes"
10. [ ] Clicked "Manual Deploy"
11. [ ] Selected "Clear build cache & deploy"
12. [ ] Waited for deployment to complete
13. [ ] Visited my Render URL
14. [ ] Successfully logged in
15. [ ] Created test product → Saved ✅
16. [ ] Refreshed page → Product still there ✅
17. [ ] Created test customer → Saved ✅
18. [ ] Refreshed page → Customer still there ✅

**If all checked** → 🎉 **SUCCESS! Data is saving!**

---

**Created**: October 20, 2025
**For**: Render Blueprint Deployments
**Time**: 15 minutes total
