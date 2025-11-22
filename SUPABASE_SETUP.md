# Supabase Database Setup Guide

## Your Supabase Project Information

- **Project URL**: https://qfmvvzmzyvsaczatadpz.supabase.co
- **Project Reference**: `qfmvvzmzyvsaczatadpz`

## Step 1: Get Your Database Connection String

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qfmvvzmzyvsaczatadpz
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection string** section
4. Select **URI** tab
5. Copy the connection string (it will look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.qfmvvzmzyvsaczatadpz.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password (if you don't know it, you can reset it in the same settings page)

## Step 2: Set Up Environment Variables

Create a `.env` file in the root of your project (if it doesn't exist):

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.qfmvvzmzyvsaczatadpz.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
NODE_ENV=development
```

**Important Notes:**
- Replace `YOUR_PASSWORD` with your actual database password
- The `?pgbouncer=true&connection_limit=1` parameters are recommended for serverless environments (like Vercel)
- For local development, you can use the direct connection string without pgbouncer

## Step 3: Run Database Migrations

After setting up the DATABASE_URL, run:

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name migrate_to_postgresql
```

## Step 4: Verify Connection

Test the connection:

```bash
node scripts/verify-db.js
```

## Step 5: For Production Deployment (Vercel)

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string (use the pgbouncer version for serverless)
   - **Environment**: Production, Preview, Development (select all)

## Connection String Formats

### Direct Connection (for local development)
```
postgresql://postgres:YOUR_PASSWORD@db.qfmvvzmzyvsaczatadpz.supabase.co:5432/postgres
```

### Connection Pooling (recommended for serverless/production)
```
postgresql://postgres:YOUR_PASSWORD@db.qfmvvzmzyvsaczatadpz.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

## Security Notes

⚠️ **Never commit your `.env` file to Git!** It's already in `.gitignore`.

⚠️ **Never share your database password publicly!**

⚠️ The API key you provided is the anon/public key, which is safe to use in client-side code. The database password is different and should be kept secret.

## Troubleshooting

### Connection Refused
- Verify your database password is correct
- Check if your IP is allowed (Supabase allows all IPs by default, but check if you have restrictions)

### Migration Errors
- Ensure Prisma schema is updated to use PostgreSQL
- Make sure DATABASE_URL is set correctly
- Try running `npx prisma migrate reset` (WARNING: This will delete all data)

### SSL Connection Required
If you get SSL errors, add `?sslmode=require` to your connection string:
```
postgresql://postgres:YOUR_PASSWORD@db.qfmvvzmzyvsaczatadpz.supabase.co:5432/postgres?sslmode=require
```

