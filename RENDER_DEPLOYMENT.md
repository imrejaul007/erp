# 🚀 Render Deployment Guide - Oud ERP

Complete guide to deploy your Oud ERP system on Render with PostgreSQL database.

---

## 📋 Prerequisites

- GitHub account
- Render account (free tier available)
- Git installed locally

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Push Code to GitHub

```bash
# Initialize git repository
cd "/Users/rejaulkarim/Documents/Oud PMS"
git init

# Create .gitignore (already exists)
# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Oud ERP with branding system"

# Create GitHub repository
# Go to: https://github.com/new
# Repository name: oud-erp
# Keep it private or public (your choice)

# Add remote and push
git remote add origin https://github.com/YOUR-USERNAME/oud-erp.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Sign up or log in

2. **Create New Blueprint**
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the `oud-erp` repository
   - Click "Connect"

3. **Render will automatically:**
   - Detect `render.yaml`
   - Create PostgreSQL database
   - Create web service
   - Link them together
   - Deploy your app

4. **Set Environment Variables**
   After blueprint creation, go to your web service settings and add:

   ```bash
   NEXTAUTH_URL=https://your-app-name.onrender.com
   NEXTAUTH_SECRET=<click "Generate" button>
   ```

5. **Wait for Deployment**
   - Initial deployment takes 5-10 minutes
   - Database will be created and seeded automatically
   - You'll see build logs in real-time

6. **Access Your App**
   - URL will be: `https://your-app-name.onrender.com`
   - Login with: `admin@oudperfume.ae` / `admin123`

---

## 📝 Manual Deployment (Alternative)

If you prefer manual setup:

### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name:** `oud-erp-db`
   - **Database:** `oud_perfume_erp`
   - **User:** `oud_erp_user`
   - **Region:** Choose closest to you
   - **Plan:** Free
4. Click "Create Database"
5. Copy the **Internal Database URL** (starts with `postgres://`)

### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `oud-erp`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build:render`
   - **Start Command:** `npm run start`
   - **Plan:** Free

4. Click "Advanced" → Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<paste Internal Database URL from Step 1>
   NEXTAUTH_URL=https://your-app-name.onrender.com
   NEXTAUTH_SECRET=<click Generate>
   NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
   NEXT_PUBLIC_APP_NAME=Oud & Perfume ERP
   ```

5. Click "Create Web Service"

---

## 🔧 What Happens During Deployment

### Build Process (`npm run build:render`)

1. **Install Dependencies** - All npm packages
2. **Generate Prisma Client** - Database ORM
3. **Push Database Schema** - Create all tables
4. **Seed Database** - Add initial data:
   - Default branding
   - Admin user (admin@oudperfume.ae / admin123)
   - 4 roles (Admin, Manager, Sales, Inventory)
   - 10 permissions
   - 2 stores (Main Store, Warehouse)
   - 3 raw materials
   - 2 products
   - Sample customer & supplier
   - Chart of accounts
   - Loyalty program
5. **Build Next.js** - Optimize for production

### What Gets Created

| Item | Details |
|------|---------|
| **Database** | PostgreSQL with all tables |
| **Admin User** | Email: admin@oudperfume.ae, Password: admin123 |
| **Stores** | Main Store - Dubai, Main Warehouse |
| **Products** | Luxury Oud Perfume, Rose Attar |
| **Raw Materials** | Oud Oil, Rose Oil, Perfumer Alcohol |
| **Roles** | Admin, Manager, Sales, Inventory |
| **Branding** | Default company branding configured |

---

## 🌐 Post-Deployment Setup

### 1. Change Admin Password

```bash
# After first login, go to:
https://your-app.onrender.com/settings/profile
# Change password from admin123 to something secure
```

### 2. Configure Branding

```bash
# Visit branding page:
https://your-app.onrender.com/settings/branding

# Update:
- Company name and logo
- Brand colors
- Contact information
- Invoice templates
```

### 3. Upload Logos

Since file upload isn't built-in yet, use:

**Option A: Cloudinary (Recommended)**
1. Sign up at https://cloudinary.com (free)
2. Upload your logos
3. Copy URLs
4. Paste in Branding settings

**Option B: ImgBB**
1. Go to https://imgbb.com
2. Upload images
3. Get direct links
4. Use in branding

### 4. Add Your Data

- **Products:** `/inventory/add-products` (CSV import supported)
- **Customers:** `/crm/add-customer`
- **Suppliers:** `/purchasing/vendor-management`
- **Stores:** `/settings/stores`

---

## 🔒 Security Configuration

### 1. Update Environment Variables

In Render dashboard → Your Service → Environment:

```bash
# Generate a strong secret
NEXTAUTH_SECRET=<use strong random string>

# Update URLs
NEXTAUTH_URL=https://your-actual-domain.com
NEXT_PUBLIC_APP_URL=https://your-actual-domain.com
```

### 2. Configure OAuth (Optional)

**Google OAuth:**
1. Go to: https://console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Add to Render environment:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### 3. Database Backups

Render Free tier includes:
- ✅ Daily backups (last 7 days)
- ✅ Point-in-time recovery

For manual backup:
```bash
# Connect to database
# Get credentials from Render dashboard
pg_dump -h <host> -U <user> -d <database> > backup.sql
```

---

## 📊 Monitoring

### Health Check

Your app includes a health endpoint:
```
https://your-app.onrender.com/api/health
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-01T12:00:00.000Z",
  "database": "connected",
  "service": "oud-erp"
}
```

### Render Dashboard

Monitor in real-time:
- CPU usage
- Memory usage
- Response times
- Error rates
- Deploy history

---

## 🚀 Custom Domain (Optional)

### Add Your Domain

1. Go to Render Dashboard → Your Service → Settings
2. Click "Add Custom Domain"
3. Enter: `yourdomain.com`
4. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: @
   Value: your-app.onrender.com
   ```
5. Wait for DNS propagation (5-30 minutes)
6. Render auto-provisions SSL certificate

### Update Environment Variables

```bash
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🐛 Troubleshooting

### Build Fails

**Check logs in Render dashboard:**
```bash
# Common issues:
1. Missing environment variables
2. Database connection timeout
3. Node version mismatch
```

**Solutions:**
```bash
# Add to package.json if needed
"engines": {
  "node": ">=18.17.0"
}
```

### Database Connection Error

```bash
# Verify DATABASE_URL is set correctly
# Should be: postgres://user:pass@host/database

# Check database is running in Render dashboard
```

### App Crashes After Deploy

```bash
# Check logs: Render Dashboard → Events tab
# Look for:
- Missing environment variables
- Database migration errors
- Memory issues (upgrade plan if needed)
```

### Slow Performance

Free tier limitations:
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Takes 30-60 seconds to wake up
- ⚠️ 512MB RAM

**Solutions:**
1. Upgrade to Starter plan ($7/month)
2. Keep alive with cron job
3. Use external monitoring (UptimeRobot)

---

## 💰 Pricing

### Free Tier (Current Setup)

| Service | Specs | Cost |
|---------|-------|------|
| Web Service | 512MB RAM, 0.1 CPU | $0 |
| PostgreSQL | 1GB storage, shared CPU | $0 |
| **Total** | | **$0/month** |

**Limitations:**
- Spins down after inactivity
- 90 days free database (then $7/month)
- Limited resources

### Recommended Starter

| Service | Specs | Cost |
|---------|-------|------|
| Web Service | 2GB RAM, 1 CPU | $7/month |
| PostgreSQL | 1GB storage | $7/month |
| **Total** | | **$14/month** |

**Benefits:**
- Always-on (no spin down)
- Better performance
- 14-day backups

---

## 📈 Scaling

### Upgrade Path

1. **More Traffic?**
   - Upgrade web service to 4GB RAM ($25/month)
   - Add Redis for caching

2. **More Data?**
   - Upgrade database to 10GB ($20/month)
   - Enable connection pooling

3. **Multiple Regions?**
   - Deploy to multiple regions
   - Use load balancer

---

## 🔄 Updates & Redeployment

### Auto-Deploy

Render watches your GitHub repo:
```bash
# Any push to main branch triggers auto-deploy
git add .
git commit -m "Update feature"
git push origin main

# Render automatically rebuilds and deploys
```

### Manual Deploy

In Render Dashboard:
1. Go to your service
2. Click "Manual Deploy" → "Deploy latest commit"

### Rollback

If something breaks:
1. Go to Render Dashboard → Events
2. Find previous successful deploy
3. Click "Rollback to this version"

---

## 📞 Support

### Render Support
- Docs: https://render.com/docs
- Status: https://status.render.com
- Community: https://community.render.com

### App Issues
- Check logs in Render dashboard
- Review health endpoint: `/api/health`
- Check database connectivity

---

## ✅ Deployment Checklist

Before going live:

- [ ] Code pushed to GitHub
- [ ] Render blueprint deployed
- [ ] Database created and seeded
- [ ] Environment variables set
- [ ] Admin password changed
- [ ] Branding configured
- [ ] SSL certificate active
- [ ] Health check passing
- [ ] Custom domain configured (optional)
- [ ] Backups enabled
- [ ] Monitoring set up

---

## 🎉 You're Live!

Your Oud ERP is now running in production on Render!

**Access your app:**
- URL: `https://your-app-name.onrender.com`
- Login: `admin@oudperfume.ae` / `admin123`

**Next steps:**
1. Change admin password
2. Configure branding
3. Add your products and data
4. Invite your team
5. Start selling! 🚀

---

**Need help?** Check the logs in Render dashboard or review this guide.
