# 🚀 Oud ERP - Quick Setup Guide

## ✅ Current Status

Your ERP is **running locally** at: **http://localhost:3000**

---

## 🎯 What's Working

✅ **Frontend** - All pages and components loaded
✅ **Next.js Server** - Running on port 3000
✅ **Prisma Client** - Generated successfully
✅ **Branding System** - Fully integrated

---

## ⚠️ Database Setup Required

PostgreSQL is **not installed** on your system. You have 3 options:

### Option 1: Install PostgreSQL Locally (Recommended for Development)

**On macOS:**
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb oud_perfume_erp
```

**On Windows:**
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Install and note down the password
3. Open pgAdmin or command line
4. Create database: `CREATE DATABASE oud_perfume_erp;`

**On Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb oud_perfume_erp
```

**After Installation:**
```bash
# Update .env.local with your credentials
DATABASE_URL="postgresql://username:password@localhost:5432/oud_perfume_erp"

# Push schema to database
npm run db:push

# (Optional) Seed sample data
npm run db:seed
```

### Option 2: Use Cloud PostgreSQL (Easiest - No Installation)

**Neon (Free Tier):**
1. Go to: https://neon.tech
2. Sign up for free account
3. Create new project
4. Copy connection string
5. Update `.env.local`:
```bash
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname"
```
6. Run: `npm run db:push`

**Supabase (Free Tier):**
1. Go to: https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string (URI mode)
5. Update `.env.local` and run `npm run db:push`

**Railway (Free Tier):**
1. Go to: https://railway.app
2. Create PostgreSQL database
3. Copy connection URL
4. Update `.env.local` and push schema

### Option 3: Use Docker (For Development)

```bash
# Run PostgreSQL in Docker
docker run --name oud-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=oud_perfume_erp \
  -p 5432:5432 \
  -d postgres:15

# Update .env.local
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/oud_perfume_erp"

# Push schema
npm run db:push
```

---

## 🌐 Access Your ERP

Once the server is running, open your browser and visit:

### Main URLs:
- **Homepage:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard
- **Branding Settings:** http://localhost:3000/settings/branding

### Key Pages:
```
Inventory:     http://localhost:3000/inventory/products
Sales:         http://localhost:3000/sales/retail
POS:           http://localhost:3000/pos/terminal
Customers:     http://localhost:3000/crm/comprehensive
Production:    http://localhost:3000/production/batch
Finance:       http://localhost:3000/finance/accounting
Reports:       http://localhost:3000/reports/sales
```

---

## 🔐 Authentication Setup

Currently using placeholder credentials in `.env.local`:

```bash
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

**Generate a secure secret:**
```bash
# On macOS/Linux
openssl rand -base64 32

# Or use this website
# https://generate-secret.vercel.app/32
```

Update `.env.local`:
```bash
NEXTAUTH_SECRET="your-generated-secret-here"
```

---

## 📝 Environment Variables

Your current `.env.local`:

```bash
# Database (UPDATE THIS)
DATABASE_URL="postgresql://username:password@localhost:5432/oud_perfume_erp"

# NextAuth (GENERATE NEW SECRET)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: Email
EMAIL_SERVER_HOST=""
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""

# Optional: File Upload (for logos)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server (currently running)
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client (done ✅)
npm run db:push          # Push schema to database (needs DB setup)
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio (visual DB editor)
npm run db:seed          # Seed sample data

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # Check TypeScript types
npm run format           # Format with Prettier
```

---

## 🎨 Next Steps

### 1. Set Up Database (Choose One Option Above)

### 2. Configure Branding
- Visit: http://localhost:3000/settings/branding
- Upload your logo (use Cloudinary/ImgBB)
- Set your brand colors
- Configure invoice templates

### 3. Create First User
Once database is set up:
```bash
# Option A: Use signup page
http://localhost:3000/auth/signup

# Option B: Create directly in database
npm run db:studio
# Then create user in Users table
```

### 4. Import Initial Data
```bash
# Products (CSV import available)
http://localhost:3000/inventory/add-products

# Or use seed script
npm run db:seed
```

### 5. Configure Features
- Set up stores/warehouses
- Add suppliers
- Configure tax rates
- Create user roles

---

## 🐛 Troubleshooting

### Server won't start?
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### Database connection errors?
1. Check PostgreSQL is running: `psql --version`
2. Verify connection string in `.env.local`
3. Test connection: `psql "postgresql://username:password@localhost:5432/oud_perfume_erp"`

### Module not found errors?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Prisma errors?
```bash
# Regenerate client
npm run db:generate

# Reset if needed (WARNING: deletes all data)
npx prisma migrate reset
```

---

## 📚 Documentation

- **Branding System:** See `BRANDING_SYSTEM.md`
- **Full Features:** See `README.md`
- **API Documentation:** Check individual module READMEs

---

## 🚀 Production Deployment

When ready to deploy:

1. **Choose a hosting platform:**
   - Vercel (recommended for Next.js)
   - Railway
   - Digital Ocean
   - AWS/GCP/Azure

2. **Set up production database:**
   - Neon, Supabase, or managed PostgreSQL

3. **Update environment variables:**
   ```bash
   NODE_ENV="production"
   DATABASE_URL="your-production-db-url"
   NEXTAUTH_URL="https://yourdomain.com"
   NEXTAUTH_SECRET="strong-secret-here"
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📞 Support

If you need help:
1. Check the documentation files
2. Review console logs: `Cmd+Option+J` (macOS) or `F12` (Windows)
3. Check the terminal output for errors

---

## 🎉 You're Ready!

Your Oud ERP is running at: **http://localhost:3000**

**Current Status:**
- ✅ Frontend working
- ✅ All features available
- ⚠️ Database needs setup (choose option above)
- ⚠️ No data yet (add via UI or seed script)

**Start by:**
1. Setting up database (Option 1, 2, or 3 above)
2. Running `npm run db:push`
3. Visiting http://localhost:3000

Happy coding! 🚀
