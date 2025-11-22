# How to Get Your Supabase Connection String

## Step-by-Step Instructions

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/qfmvvzmzyvsaczatadpz

2. **Check if Project is Active**
   - If you see "Paused" or "Restore" button, click it to wake up your project
   - Free tier projects pause after inactivity

3. **Navigate to Database Settings**
   - Click on **Settings** (gear icon) in the left sidebar
   - Click on **Database** in the settings menu

4. **Get Connection String**
   - Scroll down to **Connection string** section
   - Click on the **URI** tab (not Session mode or Transaction mode)
   - You'll see a connection string like:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - **OR** the direct connection:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```

5. **Copy the Connection String**
   - Click the copy button or select and copy the entire string
   - It should include your password already embedded

6. **Set It Up**
   ```bash
   node scripts/setup-env-from-string.js "YOUR_CONNECTION_STRING_HERE"
   ```

## Alternative: Manual Setup

If you prefer to set it up manually:

1. Create/edit `.env` file in project root
2. Add:
   ```env
   DATABASE_URL="YOUR_CONNECTION_STRING_FROM_SUPABASE"
   NODE_ENV=development
   ```
3. Make sure the connection string is in quotes

## After Setting Up

Run these commands:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name migrate_to_postgresql

# Test connection
node scripts/diagnose-connection.js
```

## Still Having Issues?

- Make sure your project is not paused
- Verify your database password is correct
- Try resetting your database password in Supabase settings
- Check Supabase status page for any outages

