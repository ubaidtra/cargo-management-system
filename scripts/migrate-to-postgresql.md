# Migrate from SQLite to PostgreSQL

Follow these steps to migrate your database from SQLite to PostgreSQL:

## Step 1: Set up PostgreSQL Database

1. Sign up for a free PostgreSQL database:
   - [Supabase](https://supabase.com) - Free tier available
   - [Neon](https://neon.tech) - Free tier available
   - [Railway](https://railway.app) - Free tier available

2. Copy your PostgreSQL connection string (DATABASE_URL)

## Step 2: Update Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

## Step 3: Set Environment Variable

Create a `.env` file (or update existing):

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

## Step 4: Create Migration

```bash
npx prisma migrate dev --name migrate_to_postgresql
```

## Step 5: Generate Prisma Client

```bash
npx prisma generate
```

## Step 6: (Optional) Migrate Existing Data

If you have existing data in SQLite that you want to migrate:

1. Export data from SQLite:
   ```bash
   # Use a tool like sqlite3 to export data
   sqlite3 dev.db .dump > data.sql
   ```

2. Convert SQLite SQL to PostgreSQL format (manual editing may be required)

3. Import to PostgreSQL:
   ```bash
   psql $DATABASE_URL < data.sql
   ```

Or use a migration tool like [pgloader](https://pgloader.readthedocs.io/).

## Step 7: Verify Migration

```bash
npm run dev
# Test your application to ensure everything works
```

