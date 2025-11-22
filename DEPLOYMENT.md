# Deployment Guide

This guide will help you deploy the Ubaid Cargo Management System to production.

## Database: MongoDB

This project uses **MongoDB** as the database, which is perfect for serverless deployments. MongoDB Atlas offers a free tier that works great with platforms like Vercel.

## Deployment Options

### Option 1: Deploy to Vercel (Recommended for Next.js)

#### Prerequisites
1. A GitHub/GitLab/Bitbucket account
2. A Vercel account (free tier available)
3. A MongoDB database (free option: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

#### Steps

1. **Set up MongoDB Database:**
   - Sign up for free MongoDB Atlas: https://www.mongodb.com/cloud/atlas
   - Create a free cluster (M0 tier)
   - Create a database user
   - Whitelist IP addresses (use 0.0.0.0/0 for Vercel or add Vercel IPs)
   - Get your connection string from "Connect" → "Connect your application"
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/cargo_db?retryWrites=true&w=majority`

2. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL`: Your MongoDB connection string
     - `NODE_ENV`: `production`
   - Click "Deploy"

4. **Initialize Database (after first deployment):**
   ```bash
   # MongoDB doesn't use migrations, use db push instead
   npx prisma db push
   npx prisma generate
   ```
   
   Or run these commands in Vercel's deployment logs or via Vercel CLI.

### Option 2: Deploy to Railway

1. **Sign up at [railway.app](https://railway.app)**
2. **Create a new project**
3. **Add PostgreSQL service** (Railway will provide the DATABASE_URL)
4. **Add your GitHub repository** as a service
5. **Set environment variables:**
   - `DATABASE_URL`: Provided by Railway PostgreSQL service
   - `NODE_ENV`: `production`
6. **Deploy**

### Option 3: Deploy to Traditional VPS/Server

If you prefer a traditional server deployment:

1. **Set up a VPS** (DigitalOcean, AWS EC2, etc.)
2. **Install Node.js** (v18 or higher)
3. **Set up PostgreSQL** on the server
4. **Clone your repository**
5. **Install dependencies:**
   ```bash
   npm install
   ```
6. **Set environment variables:**
   ```bash
   export DATABASE_URL="postgresql://user:password@localhost:5432/cargo_db"
   export NODE_ENV="production"
   ```
7. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```
8. **Build and start:**
   ```bash
   npm run build
   npm start
   ```
9. **Set up PM2 or similar** for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "cargo-cms" -- start
   pm2 save
   pm2 startup
   ```

## Environment Variables

Required environment variables for production:

- `DATABASE_URL`: MongoDB connection string (required for production)
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?options`
- `NODE_ENV`: Set to `production`

## Database Setup Steps

MongoDB doesn't use migrations like SQL databases. Instead:

1. **Push schema to database:**
   ```bash
   npx prisma db push
   ```

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Seed initial data (optional):**
   ```bash
   npm run seed
   ```

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] Application builds successfully
- [ ] Test login functionality
- [ ] Test cargo creation and receiving
- [ ] Verify admin dashboard access
- [ ] Check API endpoints are working
- [ ] Set up monitoring (optional)

## Troubleshooting

### Build fails with Prisma errors
- Ensure `DATABASE_URL` is set correctly
- Run `npx prisma generate` before building
- Check that migrations are up to date

### Database connection errors
- Verify `DATABASE_URL` format is correct
- Check database server is accessible
- Ensure database user has proper permissions

### 404 errors on routes
- Verify Next.js routing is configured correctly
- Check that API routes are in the `app/api` directory
- Ensure build completed successfully

## Support

For issues or questions, check:
- [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Vercel Documentation](https://vercel.com/docs)

