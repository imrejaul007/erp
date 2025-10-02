# PostgreSQL Database Setup Guide

## Prerequisites

This Oud Perfume ERP system requires PostgreSQL for data persistence.

## Installation Options

### Option 1: Using Docker (Recommended)

```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name oud-postgres \
  -e POSTGRES_USER=oudadmin \
  -e POSTGRES_PASSWORD=oud2024secure \
  -e POSTGRES_DB=oud_perfume_erp \
  -p 5432:5432 \
  -d postgres:15

# Verify it's running
docker ps
```

### Option 2: Using Homebrew (macOS)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database and user
psql postgres
CREATE USER oudadmin WITH PASSWORD 'oud2024secure';
CREATE DATABASE oud_perfume_erp OWNER oudadmin;
GRANT ALL PRIVILEGES ON DATABASE oud_perfume_erp TO oudadmin;
\q
```

### Option 3: Using PostgreSQL Installer

Download from: https://www.postgresql.org/download/

## Configure Database Connection

1. Update your `.env.local` file:

```env
DATABASE_URL="postgresql://oudadmin:oud2024secure@localhost:5432/oud_perfume_erp"
```

2. Initialize Prisma:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name initial_setup

# Optional: Seed database with sample data
npx prisma db seed
```

## Verify Connection

```bash
# Check database connection
npx prisma db pull

# Open Prisma Studio to view data
npx prisma studio
```

## Database Schema

The system includes the following main tables:
- Users (authentication)
- Products (inventory)
- Customers (CRM)
- Orders (sales)
- Purchases (purchasing)
- Vendors (supplier management)
- Transactions (financial records)

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running: `docker ps` or `brew services list`
- Check port 5432 is not in use: `lsof -i :5432`

### Permission Denied
- Verify user credentials in DATABASE_URL
- Check database user has proper permissions

### Migration Errors
- Reset database: `npx prisma migrate reset`
- Force deploy: `npx prisma migrate deploy`

## Next Steps

After database setup:
1. Run `npm run dev` to start the development server
2. Navigate to http://localhost:3000
3. The system will automatically connect to PostgreSQL
4. All settings and data will persist across refreshes

## Alternative: SQLite for Testing

If you prefer to test without installing PostgreSQL:

```env
DATABASE_URL="file:./dev.db"
```

Then run:
```bash
npx prisma migrate dev --name init
```

Note: SQLite has limitations and is not recommended for production.
