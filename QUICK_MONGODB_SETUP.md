# Quick MongoDB Setup

## Get Your MongoDB Connection String (2 minutes)

### Step 1: Sign Up / Login
Go to: https://www.mongodb.com/cloud/atlas/register

### Step 2: Create Free Cluster
1. Click "Build a Database"
2. Choose **FREE** (M0) tier
3. Select a cloud provider and region (closest to you)
4. Click "Create"
5. Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username (e.g., `cargo_admin`)
5. Enter password (save it!)
6. Set privileges to "Atlas admin"
7. Click "Add User"

### Step 4: Whitelist IP Addresses
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Replace `<username>` and `<password>` with your actual credentials
6. Add database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cargo_db?retryWrites=true&w=majority`

### Step 6: Set It Up
```bash
npm run setup-mongodb "YOUR_CONNECTION_STRING_HERE"
```

Then continue with:
```bash
npm run db:push
npm run seed
npm run test-db
```

## Example Connection String Format

```
mongodb+srv://cargo_admin:MyPassword123@cluster0.abc123.mongodb.net/cargo_db?retryWrites=true&w=majority
```

Replace:
- `cargo_admin` → Your username
- `MyPassword123` → Your password  
- `cluster0.abc123` → Your cluster name
- `cargo_db` → Database name (you can change this)

