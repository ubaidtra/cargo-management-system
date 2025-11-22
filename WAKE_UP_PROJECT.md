# Wake Up Your Supabase Project

## The Issue
Your Supabase project appears to be **paused**. Free tier projects automatically pause after 7 days of inactivity to save resources.

## How to Wake It Up

### Step 1: Go to Your Project Dashboard
Visit: https://supabase.com/dashboard/project/qfmvvzmzyvsaczatadpz

### Step 2: Look for "Paused" Status
- You'll see a banner or message saying the project is paused
- Look for a **"Restore"** or **"Resume"** button

### Step 3: Restore the Project
- Click the **"Restore"** or **"Resume"** button
- Wait 1-2 minutes for the project to become active
- You'll see a loading indicator

### Step 4: Verify It's Active
- The dashboard should show "Active" status
- No more "Paused" messages

## After Project is Active

### Get Your Connection String

1. Go to: **Settings** → **Database**
2. Scroll to **"Connection string"** section
3. Click the **"URI"** tab
4. You'll see a connection string that looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

5. **Copy the ENTIRE string** (it includes your password)

### Set It Up

Run this command with the FULL connection string:

```bash
npm run setup-env "postgresql://postgres:YOUR_PASSWORD@db.qfmvvzmzyvsaczatadpz.supabase.co:5432/postgres"
```

Or use the script:

```bash
node scripts/setup-env-from-string.js "YOUR_FULL_CONNECTION_STRING"
```

## Important Notes

- **qfmvvzmzyvsaczatadpz** is your project reference, NOT the connection string
- The connection string must include: `postgresql://`, username, password, host, port, and database name
- The password in the connection string is already URL-encoded by Supabase

## Still Having Issues?

If you can't find the "Restore" button or the project won't wake up:
1. Check your Supabase account status
2. Verify you have access to the project
3. Try refreshing the dashboard page
4. Contact Supabase support if needed

