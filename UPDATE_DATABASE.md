# Database Update Instructions

## Issue: "Failed to create user" Error

This error occurs because the database schema needs to be updated with the new fields and models.

## Solution: Update Database Schema

Follow these steps to update your database:

### Step 1: Stop the Development Server

If your development server is running (npm run dev), stop it first:
- Press `Ctrl+C` in the terminal where the server is running
- Or close the terminal window

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

This updates the Prisma client to match your schema.

### Step 3: Push Schema Changes to Database

```bash
npx prisma db push
```

This will update your MongoDB database with:
- `isActive` field added to User model
- New `ActivityLog` model created

### Step 4: Restart Development Server

```bash
npm run dev
```

## Verification

After updating, try creating a user again. The following features should now work:
- ✅ Create admin/operator accounts
- ✅ Activate/deactivate accounts
- ✅ Reset passwords
- ✅ View activity logs

## Troubleshooting

### If you get "EPERM" or file lock errors:
1. Make sure the dev server is completely stopped
2. Close any other programs that might be using the database
3. Try running the commands again

### If you get connection errors:
1. Check your `.env` file has the correct `DATABASE_URL`
2. Verify your MongoDB connection is working
3. Run: `node scripts/test-connection.js`

### If errors persist:
Check the console/terminal for detailed error messages and share them for further assistance.

