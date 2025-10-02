# 🚀 Render Deployment - Quick Start Guide

## Complete Deployment in 10 Minutes

This guide will help you deploy your Oud ERP with the Sampling System to Render.

---

## ⚡ Step 1: Prepare Your Repository (2 minutes)

### Check Git Status

```bash
cd "/Users/rejaulkarim/Documents/Oud PMS"
git status
```

### Commit Any Pending Changes

```bash
# Add all changes
git add .

# Commit with message
git commit -m "Add Sampling & Trial Management System with backend integration"

# Push to GitHub
git push origin main
```

### If Repository Doesn't Exist Yet

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit - Oud ERP with Sampling System"

# Create repository on GitHub
# Go to: https://github.com/new
# Name: oud-erp
# Keep private or public

# Add remote and push
git remote add origin https://github.com/YOUR-USERNAME/oud-erp.git
git branch -M main
git push -u origin main
```

---

## ⚡ Step 2: Deploy to Render (3 minutes)

### Option A: Using Blueprint (Recommended)

1. **Go to Render Dashboard**
   ```
   https://dashboard.render.com
   ```

2. **Create New Blueprint**
   - Click "New +" → "Blueprint"
   - Select "Deploy from a Git repository"
   - Connect your GitHub account
   - Select `oud-erp` repository
   - Click "Connect"

3. **Render Will Auto-Deploy**
   - Detects `render.yaml` configuration
   - Creates PostgreSQL database
   - Creates web service
   - Links them together
   - Runs build and deployment

### Option B: Manual Setup

If blueprint doesn't work, follow manual steps:

**Create Database:**
1. New + → PostgreSQL
2. Name: `oud-erp-db`
3. Database: `oud_perfume_erp`
4. Region: Choose closest
5. Plan: Free
6. Click "Create Database"
7. **Copy Internal Database URL**

**Create Web Service:**
1. New + → Web Service
2. Connect GitHub repository
3. Configure:
   - Name: `oud-erp`
   - Build Command: `npm install && npm run build:render`
   - Start Command: `npm run start`
   - Plan: Free

4. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<paste internal DB URL>
   NEXTAUTH_SECRET=<click Generate>
   NEXTAUTH_URL=https://oud-erp.onrender.com
   NEXT_PUBLIC_APP_URL=https://oud-erp.onrender.com
   NEXT_PUBLIC_APP_NAME=Oud & Perfume ERP
   ```

5. Click "Create Web Service"

---

## ⚡ Step 3: Monitor Deployment (5 minutes)

### Watch Build Logs

In Render dashboard, you'll see:

```
✓ Installing dependencies
✓ Generating Prisma Client
✓ Pushing database schema
  → Creating all tables (users, products, stores, etc.)
  → Creating sampling tables:
    - sampling_sessions
    - sampling_products
    - tester_stock
    - tester_refills
✓ Seeding database
  → Admin user created
  → Default branding configured
  → Sample data added
✓ Building Next.js application
✓ Deployment successful!
```

### Verify Tables Created

The following tables will be created automatically:

**Core Tables:**
- users, roles, permissions
- stores, products, customers
- sales, inventory, purchases

**Sampling System Tables:**
- `sampling_sessions` - All customer trial sessions
- `sampling_products` - Products tested per session
- `tester_stock` - Tester inventory levels
- `tester_refills` - Refill transaction history

### Access Your App

Once deployment completes:
```
URL: https://oud-erp.onrender.com
Login: admin@oudperfume.ae
Password: admin123
```

---

## ⚡ Step 4: Post-Deployment Setup (2 minutes)

### 1. Update NEXTAUTH_URL

In Render Dashboard → Your Service → Environment:

```bash
NEXTAUTH_URL=https://YOUR-ACTUAL-DOMAIN.onrender.com
NEXT_PUBLIC_APP_URL=https://YOUR-ACTUAL-DOMAIN.onrender.com
```

**Important:** Replace with your actual Render URL!

### 2. Change Admin Password

```
1. Login to https://your-app.onrender.com
2. Go to Settings → Profile
3. Change password from admin123
```

### 3. Configure Branding

```
1. Go to Settings → Branding
2. Update company name and logo URLs
3. Set brand colors
4. Configure invoice templates
```

---

## ✅ Verify Sampling System Works

### Test Database Connection

1. **Access Sampling Module:**
   ```
   https://your-app.onrender.com/sampling
   ```

2. **Check Dashboard Loads:**
   - Should see KPI cards (0 sessions initially)
   - Tabs for Sessions, Tester Stock, Analytics, Lost Sales

3. **Test Tester Stock:**
   - Go to "Tester Stock" tab
   - Should show empty table (no stock yet)
   - This confirms `tester_stock` table exists

4. **Test Session Creation:**
   - Click "New Session" button
   - Form should load correctly
   - This confirms all tables are ready

### Create Test Session

1. **Add Tester Stock First:**
   ```
   - Go to Inventory → Add Products
   - Add a test product (if not exists)
   - Go to Sampling → Tester Stock tab
   - Click "Refill Stock"
   - Select product, add 100ml from purchase
   - Save
   ```

2. **Create Test Session:**
   ```
   - Click "New Session"
   - Customer: Mark as anonymous
   - Add product to test
   - Quantity: 5ml
   - Outcome: Not Purchased
   - Reason: Will decide later
   - Save
   ```

3. **Verify Everything Works:**
   - ✅ Session appears in Sessions tab
   - ✅ Tester stock reduced by 5ml
   - ✅ Analytics updated
   - ✅ Lost sale reason recorded

---

## 🎯 What You Have Now

### Live Production System

- ✅ **Full ERP System** running on Render
- ✅ **PostgreSQL Database** with all data
- ✅ **Sampling System** fully integrated
- ✅ **SSL Certificate** auto-provisioned
- ✅ **Auto-deployment** from GitHub
- ✅ **Health monitoring** enabled

### Sampling Features Ready

- ✅ Create sampling sessions
- ✅ Track tester usage
- ✅ Automatic stock deduction
- ✅ Customer conversion tracking
- ✅ Lost sale analysis
- ✅ Staff performance metrics
- ✅ ROI calculations
- ✅ Tester refill management

### API Endpoints Live

```bash
# Session Management
POST   /api/sampling/sessions       # Create session
GET    /api/sampling/sessions       # Get sessions

# Analytics
GET    /api/sampling/analytics      # Get analytics data

# Tester Stock
GET    /api/inventory/tester-stock  # View stock
PUT    /api/inventory/tester-stock  # Update min levels
POST   /api/inventory/refill-tester # Refill stock

# Health Check
GET    /api/health                  # System health
```

---

## 🔄 Making Updates

### Auto-Deploy from GitHub

Any push to `main` branch auto-deploys:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Render automatically rebuilds and deploys
```

### Manual Deploy

In Render Dashboard:
1. Go to your service
2. Click "Manual Deploy"
3. Select "Deploy latest commit"

---

## 🐛 Troubleshooting

### Build Failed?

**Check logs for:**
```
- Database connection timeout → Wait and retry
- Missing env variables → Add in Render dashboard
- Node version error → Already set in package.json
```

### Database Tables Missing?

**Run manually:**
```bash
# In Render Shell (Dashboard → Shell tab)
npx prisma db push
npx prisma db seed
```

### Can't Login?

**Reset admin password:**
```bash
# In Render Shell
npx prisma studio
# Opens Prisma Studio to edit user directly
```

### Sampling System Not Working?

**Verify tables exist:**
```bash
# In Render Shell
npx prisma studio

# Check these tables exist:
- sampling_sessions
- sampling_products
- tester_stock
- tester_refills
```

---

## 💰 Costs

### Free Tier (First 90 Days)

- Web Service: **$0/month**
- PostgreSQL: **$0/month** (first 90 days)
- Total: **$0/month**

**After 90 days:**
- PostgreSQL: **$7/month** (required)
- Web Service: Still free (with limitations)

### Recommended Paid Plan

- Web Service: **$7/month** (always-on, no spin down)
- PostgreSQL: **$7/month**
- Total: **$14/month**

---

## 📞 Support

### Issues During Deployment?

1. **Check Render Status:**
   ```
   https://status.render.com
   ```

2. **Review Build Logs:**
   - Dashboard → Your Service → Events

3. **Test Database Connection:**
   ```
   https://your-app.onrender.com/api/health
   ```

4. **Community Help:**
   ```
   https://community.render.com
   ```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render blueprint deployed (or manual setup complete)
- [ ] Database created successfully
- [ ] Build completed without errors
- [ ] App accessible at Render URL
- [ ] Can login with admin credentials
- [ ] Admin password changed
- [ ] Branding configured
- [ ] Sampling module accessible
- [ ] Test session created successfully
- [ ] Tester stock working
- [ ] Analytics showing data

---

## 🎉 You're Live!

Your Oud ERP with Sampling System is now running in production!

**Access:**
- App: `https://your-app.onrender.com`
- Login: `admin@oudperfume.ae` / `your-new-password`

**Start Using:**
1. ✅ Add your products
2. ✅ Set up tester stock
3. ✅ Create sampling sessions
4. ✅ Track conversions
5. ✅ Analyze performance

**Need Full Guide?**
See: `/RENDER_DEPLOYMENT.md` for detailed documentation

---

**Deployment Time:** ~10 minutes
**Status:** Production Ready ✅
**System:** Oud ERP + Sampling & Trial Management
