# Database Setup Guide

## PostgreSQL Installation & Setup

### macOS

#### 1. Install PostgreSQL

```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15
```

#### 2. Create Database

```bash
# Create database
createdb oud_perfume_erp

# Verify database exists
psql -l
```

### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb oud_perfume_erp
```

### Windows

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. Use pgAdmin or command line to create database `oud_perfume_erp`

## Database Configuration

### 1. Update Environment Variables

Create or update `.env.local` file in the project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/oud_perfume_erp"
```

Replace `username` and `password` with your PostgreSQL credentials.

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run Migrations

```bash
# Create and apply migration
npx prisma migrate dev --name add_sampling_tables

# This will:
# - Create the sampling_sessions table
# - Create the sampling_products table
# - Create the tester_stock table
# - Create the tester_refills table
# - Add necessary relations
```

### 4. (Optional) Seed Database

If you want to add sample data for testing:

```bash
npx prisma db seed
```

## Verify Setup

### 1. Check Database Connection

```bash
npx prisma studio
```

This will open Prisma Studio in your browser where you can view and manage your database.

### 2. Test API Endpoints

Once the database is running, you can test the sampling endpoints:

**Create Session:**
```bash
curl -X POST http://localhost:3000/api/sampling/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "anonymous": false,
      "name": "John Doe",
      "phone": "+971501234567"
    },
    "testedProducts": [
      {
        "productId": "prod_123",
        "productName": "Oud Royal",
        "productCode": "OUD001",
        "productType": "oud",
        "quantityUsed": 2.5,
        "unit": "ml",
        "costPerUnit": 10,
        "totalCost": 25
      }
    ],
    "outcome": "purchased",
    "saleAmount": 500,
    "storeId": "store_123",
    "staffId": "staff_123"
  }'
```

**Get Sessions:**
```bash
curl http://localhost:3000/api/sampling/sessions
```

**Get Analytics:**
```bash
curl http://localhost:3000/api/sampling/analytics
```

**Get Tester Stock:**
```bash
curl http://localhost:3000/api/inventory/tester-stock
```

## Database Schema

### Sampling Sessions Table

Stores all customer sampling/trial sessions:

- Session details (number, date, time)
- Customer information (name, phone, email, type)
- Outcome (purchased/not purchased)
- Sale amount (if purchased)
- Reason for not purchasing (if applicable)
- Notes

### Sampling Products Table

Tracks which products were tested in each session:

- Product details (ID, name, code, type)
- Quantity used
- Cost per unit
- Total cost

### Tester Stock Table

Maintains tester inventory levels:

- Current stock quantity
- Minimum level threshold
- Unit of measurement
- Last refill date and amount
- Monthly usage tracking

### Tester Refills Table

Records all tester stock refills:

- Refill quantity
- Source (main inventory or purchase)
- Cost
- Refilled by (staff member)
- Date and notes

## Troubleshooting

### Database Connection Error

If you see `Can't reach database server at localhost:5432`:

1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list | grep postgresql

   # Linux
   sudo systemctl status postgresql
   ```

2. Start PostgreSQL if it's not running:
   ```bash
   # macOS
   brew services start postgresql@15

   # Linux
   sudo systemctl start postgresql
   ```

### Migration Errors

If migration fails:

1. Reset the database:
   ```bash
   npx prisma migrate reset
   ```

2. Run migrations again:
   ```bash
   npx prisma migrate dev
   ```

### Permission Issues

If you encounter permission errors:

```bash
# Grant permissions to your user
sudo -u postgres psql
postgres=# GRANT ALL PRIVILEGES ON DATABASE oud_perfume_erp TO your_username;
postgres=# \q
```

## Production Deployment

For production, use a managed PostgreSQL service like:

- **AWS RDS**
- **Google Cloud SQL**
- **Heroku Postgres**
- **DigitalOcean Managed Databases**
- **Supabase**
- **Neon**

Update `DATABASE_URL` in your production environment variables to point to the production database.

## Backup & Restore

### Backup

```bash
pg_dump oud_perfume_erp > backup.sql
```

### Restore

```bash
psql oud_perfume_erp < backup.sql
```

## Support

For issues with database setup, check:

1. PostgreSQL logs
2. Prisma logs
3. Application console output
4. DATABASE_URL environment variable

---

**Version**: 1.0.0
**Last Updated**: October 2024
**System**: Oud Perfume ERP - Sampling Module
