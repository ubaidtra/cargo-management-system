# MongoDB Setup Guide

## Overview

Your project has been configured to use MongoDB instead of PostgreSQL. MongoDB is a NoSQL database that works great with serverless platforms and doesn't require migrations.

## Prerequisites

You'll need a MongoDB database. Free options include:

1. **MongoDB Atlas** (Recommended) - https://www.mongodb.com/cloud/atlas
   - Free tier: 512MB storage
   - Easy setup
   - Works great with serverless

2. **Railway** - https://railway.app
   - Free tier available
   - Easy MongoDB setup

3. **MongoDB Local** (for development only)
   - Install MongoDB locally

## Setup Steps

### Option 1: MongoDB Atlas (Recommended)

1. **Sign up for MongoDB Atlas**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Cluster**
   - Choose "Free" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"
   - Wait 3-5 minutes for cluster to be created

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server IP addresses
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cargo_db?retryWrites=true&w=majority`

6. **Set Up Environment Variable**
   ```bash
   npm run setup-mongodb "YOUR_CONNECTION_STRING"
   ```
   
   Or manually create `.env`:
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cargo_db?retryWrites=true&w=majority"
   NODE_ENV=development
   ```

### Option 2: Railway

1. Sign up at https://railway.app
2. Create new project
3. Add MongoDB service
4. Copy the connection string from the MongoDB service
5. Set it as `DATABASE_URL` in your `.env` file

## After Setup

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Push Schema to Database**
   ```bash
   npx prisma db push
   ```
   
   Note: MongoDB doesn't use migrations. `db push` syncs your schema.

3. **Seed Initial Data (Optional)**
   ```bash
   node scripts/seed-mongodb.js
   ```

4. **Test Connection**
   ```bash
   npm run test-db
   ```

## Connection String Format

MongoDB connection strings follow this format:

```
mongodb+srv://username:password@cluster.mongodb.net/database_name?options
```

Or for local MongoDB:

```
mongodb://localhost:27017/cargo_db
```

## Important Notes

- **No Migrations**: MongoDB is schema-less, so we use `prisma db push` instead of migrations
- **String IDs**: MongoDB uses ObjectId strings instead of integers
- **Collections**: Prisma automatically creates collections (tables) when you push the schema
- **Indexes**: Unique constraints create indexes automatically

## Troubleshooting

### Connection Timeout
- Check your IP is whitelisted in MongoDB Atlas
- Verify username/password are correct
- Check network connectivity

### Authentication Failed
- Verify username and password in connection string
- Make sure user has proper permissions

### Database Not Found
- MongoDB creates databases automatically when you write data
- Make sure database name is in connection string

## For Production Deployment

When deploying to Vercel or other platforms:

1. Add `DATABASE_URL` as an environment variable
2. Use the connection string with your production database
3. Make sure to whitelist the platform's IP addresses (or use 0.0.0.0/0 for MongoDB Atlas)

## Next Steps

After setting up MongoDB:
- Run `npx prisma generate`
- Run `npx prisma db push`
- Start your app: `npm run dev`

