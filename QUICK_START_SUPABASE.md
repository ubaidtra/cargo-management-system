# Quick Start: Connect to Supabase

## Your Supabase Project
- **Project URL**: https://qfmvvzmzyvsaczatadpz.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/qfmvvzmzyvsaczatadpz

## Quick Setup (3 Steps)

### Step 1: Get Your Database Password

1. Go to: https://supabase.com/dashboard/project/qfmvvzmzyvsaczatadpz/settings/database
2. Find the **Database password** section
3. If you don't know it, click **Reset database password** and save the new password

### Step 2: Run Setup Script

```bash
npm run setup-supabase
```

This will prompt you for your database password and create the `.env` file automatically.

**OR** manually create `.env` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.qfmvvzmzyvsaczatadpz.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
NODE_ENV=development
```

Replace `YOUR_PASSWORD` with your actual database password.

### Step 3: Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npm run migrate -- --name migrate_to_postgresql
```

### Step 4: Verify Connection

```bash
node scripts/verify-db.js
```

## For Production Deployment

When deploying to Vercel or other platforms, add this environment variable:

**Name**: `DATABASE_URL`  
**Value**: `postgresql://postgres:YOUR_PASSWORD@db.qfmvvzmzyvsaczatadpz.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1`

⚠️ **Important**: Use the connection pooling version (`?pgbouncer=true&connection_limit=1`) for serverless platforms like Vercel.

## Need Help?

See `SUPABASE_SETUP.md` for detailed instructions and troubleshooting.

