# 🔧 Environment Variables - Manual Setup Required on Render

## ⚠️ IMPORTANT: Environment Variables Are NOT Automatic

### What You Need to Understand:

1. ❌ **`.env.local`** file → Only works on your LOCAL computer
2. ❌ **`.env.production`** file → Just a TEMPLATE, NOT used by Render
3. ✅ **Render Dashboard** → You MUST manually add variables here

---

## 🎯 THE PROBLEM

Your Render deployment is currently using **wrong or missing** environment variables.

### Current State (Likely):
- Either using default values
- Or missing variables completely
- Or pointing to localhost (won't work in production)

---

## ✅ MANUAL SETUP REQUIRED

You MUST go to Render Dashboard and manually add each variable.

### Step-by-Step Instructions:

#### 1. Find Your Render App URL First

1. Go to: https://dashboard.render.com
2. Click on your web service (Oud Perfume ERP)
3. Look at the top - you'll see your URL like:
   - `oud-perfume-erp.onrender.com`
   - OR `your-app-123.onrender.com`
   - Write this down!

#### 2. Go to Environment Tab

1. In your web service, click **"Environment"** in the left sidebar
2. You'll see a list of environment variables

#### 3. Add/Update Each Variable Manually

Click **"Add Environment Variable"** or **Edit existing ones**.

Add these ONE BY ONE:

---

### ✅ REQUIRED VARIABLES (Add These)

#### Variable 1: DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp
```
**Note**: This should already exist if you set up PostgreSQL on Render

---

#### Variable 2: NEXTAUTH_URL ⚠️ CRITICAL
```
Key: NEXTAUTH_URL
Value: https://YOUR-ACTUAL-APP-URL.onrender.com
```

**EXAMPLE**: If your URL is `oud-perfume-erp.onrender.com`:
```
Value: https://oud-perfume-erp.onrender.com
```

**⚠️ IMPORTANT**:
- Must start with `https://` (not `http://`)
- Must match your EXACT Render URL
- No trailing slash
- No localhost!

---

#### Variable 3: NEXTAUTH_SECRET
```
Key: NEXTAUTH_SECRET
Value: qHpm7fQyVhb1DisPoJ22di7iHLKpeZmSqLn8uvxa3ZI=
```
**Note**: This is a secure random string for session encryption

---

#### Variable 4: NEXT_PUBLIC_APP_URL ⚠️ CRITICAL
```
Key: NEXT_PUBLIC_APP_URL
Value: https://YOUR-ACTUAL-APP-URL.onrender.com
```

**EXAMPLE**: If your URL is `oud-perfume-erp.onrender.com`:
```
Value: https://oud-perfume-erp.onrender.com
```

**⚠️ IMPORTANT**: Must match NEXTAUTH_URL exactly!

---

#### Variable 5: NEXT_PUBLIC_APP_NAME
```
Key: NEXT_PUBLIC_APP_NAME
Value: Oud & Perfume ERP
```

---

#### Variable 6: NODE_ENV
```
Key: NODE_ENV
Value: production
```
**Note**: Must be exactly `production` (lowercase, no quotes)

---

#### Variable 7: NEXT_PUBLIC_ENABLE_ANALYTICS
```
Key: NEXT_PUBLIC_ENABLE_ANALYTICS
Value: false
```

---

#### Variable 8: NEXT_PUBLIC_ENABLE_NOTIFICATIONS
```
Key: NEXT_PUBLIC_ENABLE_NOTIFICATIONS
Value: true
```

---

### 4. Save Changes

After adding all variables:
1. Click **"Save Changes"** button
2. Render will show a banner saying changes will apply on next deploy

---

### 5. Trigger Deployment

**IMPORTANT**: Changing environment variables does NOT automatically redeploy!

You MUST trigger a new deployment:

1. Scroll to top of the page
2. Click **"Manual Deploy"** button (top right)
3. Select **"Clear build cache & deploy"**
4. Click **"Deploy"**
5. Wait 5-10 minutes for deployment to complete

---

## 🔍 HOW TO VERIFY

### Check Current Variables:

1. Go to Render Dashboard → Your Service → Environment
2. Look at the list of variables
3. Check each one matches the values above

### Common Mistakes:

❌ **Wrong**: `NEXTAUTH_URL=http://localhost:3000`
✅ **Correct**: `NEXTAUTH_URL=https://oud-perfume-erp.onrender.com`

❌ **Wrong**: `NODE_ENV=development`
✅ **Correct**: `NODE_ENV=production`

❌ **Wrong**: `NEXTAUTH_URL=https://oud-perfume-erp.onrender.com/`
✅ **Correct**: `NEXTAUTH_URL=https://oud-perfume-erp.onrender.com` (no trailing slash)

---

## 📸 VISUAL GUIDE

### What Render Environment Tab Looks Like:

```
┌─────────────────────────────────────────────────┐
│  Environment Variables                           │
├─────────────────────────────────────────────────┤
│                                                  │
│  [Add Environment Variable]                      │
│                                                  │
│  DATABASE_URL                                    │
│  postgresql://oud_erp_user:****@dpg-...         │
│  [Edit] [Delete]                                 │
│                                                  │
│  NEXTAUTH_URL                                    │
│  https://oud-perfume-erp.onrender.com           │
│  [Edit] [Delete]                                 │
│                                                  │
│  NEXTAUTH_SECRET                                 │
│  qHpm7fQyVhb1Dis****                            │
│  [Edit] [Delete]                                 │
│                                                  │
│  ... (more variables)                            │
│                                                  │
│  [Save Changes]                                  │
└─────────────────────────────────────────────────┘
```

---

## 🎯 COMPLETE CHECKLIST

Use this to verify you did everything:

### Before Starting:
- [ ] I found my Render app URL
- [ ] I wrote down the exact URL
- [ ] I'm logged into Render Dashboard

### Adding Variables:
- [ ] Added/Updated DATABASE_URL
- [ ] Added/Updated NEXTAUTH_URL (with MY URL, not localhost)
- [ ] Added/Updated NEXTAUTH_SECRET
- [ ] Added/Updated NEXT_PUBLIC_APP_URL (with MY URL)
- [ ] Added/Updated NEXT_PUBLIC_APP_NAME
- [ ] Added/Updated NODE_ENV (set to "production")
- [ ] Added/Updated NEXT_PUBLIC_ENABLE_ANALYTICS
- [ ] Added/Updated NEXT_PUBLIC_ENABLE_NOTIFICATIONS

### After Adding:
- [ ] Clicked "Save Changes"
- [ ] Clicked "Manual Deploy"
- [ ] Selected "Clear build cache & deploy"
- [ ] Waited for deployment to complete (green checkmark)

### Testing:
- [ ] Visited my Render URL
- [ ] Can see login page
- [ ] Can login with admin@oudpalace.ae / admin123
- [ ] Can see dashboard
- [ ] Can create product → it saves
- [ ] Can refresh page → product still there

---

## 🚨 COMMON QUESTIONS

### Q: Why don't environment variables update automatically?
**A**: For security! Environment variables often contain secrets. Render requires manual configuration to prevent accidental exposure.

### Q: Will pushing .env.production to GitHub update Render?
**A**: NO! Files in your repository are NOT used for environment variables. You MUST set them in Render Dashboard.

### Q: Can I import environment variables?
**A**: No, Render requires manual entry for security. Each variable must be added one by one.

### Q: What if I forget a variable?
**A**: The app might not work correctly. Check Render logs for errors like "NEXTAUTH_URL is not defined".

### Q: Do I need to redeploy after changing variables?
**A**: YES! Always trigger a new deployment after changing environment variables.

---

## 🔍 HOW TO CHECK IF VARIABLES ARE SET

### Method 1: Render Dashboard
1. Go to Environment tab
2. Look at the list
3. Each variable should be visible (values may be masked for secrets)

### Method 2: Render Shell
1. Go to your service
2. Click "Shell" tab
3. Run: `echo $NEXTAUTH_URL`
4. Should show your Render URL

### Method 3: Check Logs
1. Go to "Logs" tab
2. Look for errors like:
   - "NEXTAUTH_URL is not defined"
   - "Invalid URL"
   - These mean variables are wrong/missing

---

## ⚡ QUICK REFERENCE

### Your Configuration:

```env
DATABASE_URL=postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp

NEXTAUTH_URL=https://[YOUR-APP-URL].onrender.com
NEXTAUTH_SECRET=qHpm7fQyVhb1DisPoJ22di7iHLKpeZmSqLn8uvxa3ZI=

NEXT_PUBLIC_APP_URL=https://[YOUR-APP-URL].onrender.com
NEXT_PUBLIC_APP_NAME=Oud & Perfume ERP

NODE_ENV=production

NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

**Replace `[YOUR-APP-URL]` with your actual Render app name!**

---

## 📞 STILL STUCK?

### If you can't find your Render URL:
1. Go to Render Dashboard
2. Click your service
3. Look at the very top - URL is displayed prominently
4. Example: `https://oud-perfume-erp.onrender.com`

### If login still fails after setting variables:
1. Check Render logs for errors
2. Verify NEXTAUTH_URL exactly matches your URL
3. Make sure you redeployed after changing variables
4. Try clearing browser cache and cookies
5. Try different browser

---

**Created**: October 20, 2025
**Action**: MANUAL SETUP REQUIRED
**Time**: 10 minutes
**Difficulty**: Easy (just follow steps)
