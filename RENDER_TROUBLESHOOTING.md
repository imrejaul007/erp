# 🔧 Render Deployment Troubleshooting

## Your Current Status

✅ **Database Created:** `oud-erp-db` is running
❌ **Web Service Failed:** Need to fix deployment

---

## Quick Fix Steps

### Step 1: Retry Deployment (Try This First)

1. Go to your failed web service in Render dashboard
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Watch the build logs

**This often fixes the issue!**

---

### Step 2: Create New Web Service (If Retry Fails)

Since your database is already working, create a new web service:

#### A. Get Database Connection String

1. Go to your `oud-erp-db` database in Render
2. Find **"Internal Database URL"**
3. Copy it (looks like: `postgresql://oud_erp_user:xxx@xxx.internal:5432/oud_perfume_erp`)

#### B. Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select **"Build and deploy from a Git repository"**
3. Choose: `imrejaul007/erp`
4. Configure:

```
Name: oud-erp-app
Region: oregon (same as database)
Branch: main
Build Command: npm install && npm run build:render
Start Command: npm run start
Plan: Free
```

5. Add Environment Variables (click "Advanced"):

```bash
NODE_ENV=production
DATABASE_URL=<paste your Internal Database URL>
NEXTAUTH_URL=https://oud-erp-app.onrender.com
NEXTAUTH_SECRET=<click Generate>
NEXT_PUBLIC_APP_URL=https://oud-erp-app.onrender.com
NEXT_PUBLIC_APP_NAME=Oud & Perfume ERP
```

6. Click **"Create Web Service"**

---

## Common Build Errors & Solutions

### Error 1: "Build timed out"

**Solution:** The simplified build command should fix this.

If still failing, upgrade to paid plan ($7/month) for more build time.

### Error 2: "Can't reach database server"

**Cause:** Using External URL instead of Internal URL

**Solution:**
- Use **Internal Database URL** (not External)
- Internal URL looks like: `xxx.internal:5432`
- External URL looks like: `xxx.oregon-postgres.render.com`

### Error 3: "Prisma migration failed"

**Solution:** The build uses `prisma db push` which should work.

If it fails, we can manually run migrations after deployment.

### Error 4: "Module not found" or "Dependency error"

**Solution:**
1. Check that `package.json` is committed to Git
2. Try clearing build cache
3. Verify Node version (should be ≥18.17.0)

### Error 5: "Out of memory"

**Solution:**
- Free tier has 512MB RAM
- Upgrade to Starter plan ($7/month) with 2GB RAM

---

## Simplified Build (No Seed Data)

The latest push includes a simplified build that:
- ✅ Installs dependencies
- ✅ Generates Prisma client
- ✅ Creates database tables
- ✅ Builds Next.js
- ⚠️ **Skips seeding** (we'll add admin user manually)

This should deploy faster and avoid timeout issues.

### After Deployment: Add Admin User Manually

Once the app deploys, create admin user:

1. Go to Render Shell (Dashboard → Your Service → Shell)
2. Run:

```bash
npx prisma studio
```

3. This opens Prisma Studio where you can manually create the admin user:
   - Email: `admin@oudperfume.ae`
   - Password: `admin123` (hashed with bcrypt)
   - Role: `ADMIN`

**Or** we can create a seed endpoint you can call once after deployment.

---

## Alternative: Deploy Without Blueprint

If blueprints keep failing, manual deployment is more reliable:

### Manual Deployment Steps:

1. ✅ **Database Created** (you already have this!)
2. ⏳ **Create Web Service** (follow Step 2 above)
3. ✅ **Connect them** (via DATABASE_URL env var)

This gives you full control and is easier to debug.

---

## Check Build Logs

Always check the build logs to see the exact error:

1. Go to your web service
2. Click **"Logs"** or **"Events"**
3. Look for:
   - `Error:` messages
   - `Failed at` messages
   - Build command output

**Share the error message and I can help fix it!**

---

## Still Having Issues?

### Share These Details:

1. **Error message** from build logs
2. **Which step** is failing (npm install, prisma, build, start)
3. **Screenshot** of the error (if helpful)

### Quick Checks:

- [ ] Database is running and shows "Available"
- [ ] Using **Internal Database URL** (not External)
- [ ] Environment variables are set correctly
- [ ] Repository has latest code (check GitHub)
- [ ] Node version specified in package.json (≥18.17.0)

---

## Success Criteria

When deployment works, you should see:

```
✓ Build complete
✓ Starting server
✓ Health check passed
✓ Deploy live
```

Then you can access:
```
https://your-app.onrender.com
```

---

## Next Steps After Successful Deployment

1. Test health endpoint: `https://your-app.onrender.com/api/health`
2. Create admin user (via Prisma Studio or seed endpoint)
3. Login and test
4. Configure branding
5. Start using the app!

---

**Need more help? Share the error message and I'll help you fix it! 🚀**
