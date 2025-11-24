# Fix Database Schema Error

## Problem
You're getting: "Unknown argument `isActive`" - This means the database schema needs to be updated.

## Solution Steps

### Step 1: Stop the Development Server
1. Go to the terminal where `npm run dev` is running
2. Press `Ctrl+C` to stop the server
3. Wait for it to fully stop

### Step 2: Update Prisma Client
```bash
npx prisma generate
```

### Step 3: Push Schema to Database
```bash
npx prisma db push
```

This will add:
- `isActive` field to User model
- `ActivityLog` model

### Step 4: Restart Development Server
```bash
npm run dev
```

## What This Does

After running these commands:
- ✅ Users will have `isActive` field (defaults to `true`)
- ✅ You can activate/deactivate accounts
- ✅ Activity logging will work
- ✅ All user management features will function properly

## Alternative: If Commands Still Fail

If you still get file lock errors:
1. Close all terminals/command prompts
2. Close VS Code/Cursor if it's running
3. Wait 10 seconds
4. Open a new terminal
5. Run the commands again

## Verification

After updating, try activating/deactivating a user again. It should work without errors!

