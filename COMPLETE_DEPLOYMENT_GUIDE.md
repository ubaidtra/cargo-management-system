# Complete Step-by-Step Deployment Guide

This guide will walk you through creating a new GitHub repository and deploying your Cargo Management System.

---

## Part 1: Create New GitHub Repository

### Step 1: Go to GitHub
1. Open your web browser
2. Go to: **https://github.com**
3. **Sign in** to your GitHub account (or create one if you don't have it)

### Step 2: Create New Repository
1. Click the **"+"** icon in the top right corner
2. Select **"New repository"** from the dropdown menu

### Step 3: Configure Repository Settings
Fill in the repository details:

- **Repository name**: `cargo-management-system` (or any name you prefer)
- **Description**: `Cargo Management System built with Next.js and MongoDB`
- **Visibility**: 
  - Choose **Public** (free, anyone can see)
  - OR **Private** (only you can see, requires GitHub Pro for free private repos)
- **Initialize repository**: 
  - ❌ **DO NOT** check "Add a README file"
  - ❌ **DO NOT** check "Add .gitignore"
  - ❌ **DO NOT** check "Choose a license"
  - (We already have these files)

### Step 4: Create Repository
1. Click the green **"Create repository"** button
2. **IMPORTANT**: Copy the repository URL that appears
   - It will look like: `https://github.com/YOUR_USERNAME/cargo-management-system.git`
   - Or SSH: `git@github.com:YOUR_USERNAME/cargo-management-system.git`
   - **Save this URL** - you'll need it in the next steps

---

## Part 2: Connect Your Local Project to New GitHub Repository

### Step 5: Remove Old Remote (if exists)
Open your terminal/command prompt in the project folder and run:

```bash
# Check current remote
git remote -v

# Remove old remote (if it exists)
git remote remove origin
```

### Step 6: Add New Remote Repository
Replace `YOUR_USERNAME` and `REPOSITORY_NAME` with your actual values:

```bash
git remote add origin https://github.com/ubaidtra/cargo management system.git
```

**Example:**
```bash
git remote add origin https://github.com/ubaidtra/cargo-management-system.git
```

### Step 7: Verify Remote is Added
```bash
git remote -v
```

You should see your new repository URL listed.

---

## Part 3: Push Code to GitHub

### Step 8: Push to GitHub
Run this command:

```bash
git push -u origin main
```

### Step 9: Authentication

**If you're prompted for credentials:**

#### Option A: Personal Access Token (Recommended)
1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - **Note**: Give it a name like "Cargo Management Deploy"
   - **Expiration**: Choose 90 days or No expiration
   - **Select scopes**: Check `repo` (this gives full repository access)
   - Click **"Generate token"**
   - **IMPORTANT**: Copy the token immediately (you won't see it again!)

2. **Use the token:**
   - When prompted for **Username**: Enter your GitHub username
   - When prompted for **Password**: Paste the token (NOT your GitHub password)

#### Option B: GitHub Desktop (Easier)
1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. Open your project folder in GitHub Desktop
4. Click **"Publish repository"** button
5. Select your repository and click **"Publish"**

### Step 10: Verify Push Success
1. Go back to your GitHub repository page in the browser
2. **Refresh the page**
3. You should see all your files listed
4. You should see your commit: "Initial commit: Cargo Management System with MongoDB"

✅ **Congratulations! Your code is now on GitHub!**

---

## Part 4: Deploy to Vercel

### Step 11: Sign Up for Vercel
1. Go to: **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 12: Import Your Project
1. In Vercel dashboard, click **"Add New..."** button
2. Select **"Project"**
3. You'll see a list of your GitHub repositories
4. Find and click **"Import"** next to your `cargo-management-system` repository

### Step 13: Configure Project Settings

#### Basic Settings:
- **Project Name**: `cargo-management-system` (or keep default)
- **Framework Preset**: Should auto-detect "Next.js"
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (should be auto-filled)
- **Output Directory**: `.next` (should be auto-filled)
- **Install Command**: `npm install` (should be auto-filled)

#### Environment Variables (IMPORTANT!):
1. Click **"Environment Variables"** section
2. Click **"Add"** to add a new variable
3. Add your MongoDB connection string:
   - **Name**: `DATABASE_URL`
   - **Value**: `mongodb+srv://traubaid:ubaid281986@cluster0.cevggcp.mongodb.net/cargo_db?retryWrites=true&w=majority`
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
4. Click **"Save"**

### Step 14: Deploy
1. Click the big **"Deploy"** button
2. Wait for the deployment to complete (usually 2-3 minutes)
3. You'll see build logs in real-time
4. When it says **"Ready"**, your app is live! 🎉

### Step 15: Access Your Live Application
1. After deployment, Vercel will show you a URL like:
   - `https://cargo-management-system.vercel.app`
2. Click the URL or copy it
3. Your application is now live!

### Step 16: Test Your Application
1. Open your live URL
2. You should see your Cargo Management System homepage
3. Try logging in with:
   - **Username**: `ubaidtra`
   - **Password**: `trawally2025`

---

## Part 5: Post-Deployment Setup

### Step 17: Initialize Database on Production
After first deployment, you need to initialize the database:

**Option A: Using Vercel CLI (Recommended)**
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Link your project:
   ```bash
   vercel link
   ```
4. Run database setup:
   ```bash
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

**Option B: Using Vercel Dashboard**
1. Go to your project in Vercel dashboard
2. Click on **"Deployments"** tab
3. Click on the latest deployment
4. Click **"Redeploy"** (this will run the build again, which includes `prisma generate`)

**Note**: MongoDB collections are created automatically when you first use the app, but you may want to seed initial data.

### Step 18: Set Up Custom Domain (Optional)
1. In Vercel project settings, go to **"Domains"**
2. Add your custom domain (if you have one)
3. Follow DNS configuration instructions

---

## Troubleshooting

### Issue: "Can't push to GitHub"
**Solution:**
- Make sure you're using a Personal Access Token, not your password
- Verify your repository URL is correct
- Check that you have write access to the repository

### Issue: "Build failed on Vercel"
**Solutions:**
- Check build logs in Vercel dashboard
- Verify `DATABASE_URL` environment variable is set correctly
- Make sure MongoDB Atlas allows connections from Vercel IPs (use 0.0.0.0/0 in Network Access)

### Issue: "Database connection error"
**Solutions:**
- Verify `DATABASE_URL` is set in Vercel environment variables
- Check MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)
- Ensure MongoDB cluster is running (not paused)

### Issue: "Module not found" errors
**Solution:**
- Make sure `package.json` has all dependencies
- Vercel should run `npm install` automatically, but check build logs

---

## Quick Reference Commands

```bash
# Check git status
git status

# Check remote repository
git remote -v

# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git push -u origin main

# Check commits
git log --oneline

# View all branches
git branch -a
```

---

## Security Checklist

- ✅ `.env` file is NOT in repository (it's in `.gitignore`)
- ✅ Database password is in environment variables, not code
- ✅ Personal Access Token is kept secure
- ⚠️ Change default admin password after first login
- ⚠️ Consider using environment-specific MongoDB databases

---

## Next Steps After Deployment

1. **Test all features** on the live site
2. **Change admin password** from default
3. **Set up monitoring** (optional - Vercel provides basic analytics)
4. **Configure backups** for MongoDB (MongoDB Atlas provides automatic backups)
5. **Set up CI/CD** (already done via Vercel - auto-deploys on push)

---

## Support Resources

- **GitHub Help**: https://docs.github.com
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Next.js Docs**: https://nextjs.org/docs

---

**🎉 Congratulations! Your Cargo Management System is now live on the internet!**

