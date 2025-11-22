# How to Update Your Deployed Project - Complete Guide

This guide explains how to make changes to your Cargo Management System after it's been deployed to Vercel.

---

## Overview: How Updates Work

When you deploy to Vercel and connect it to GitHub:
- ✅ **Automatic Deployment**: Every time you push to GitHub, Vercel automatically deploys your changes
- ✅ **Preview Deployments**: Each pull request gets its own preview URL
- ✅ **Instant Updates**: Changes go live in 2-3 minutes after pushing

---

## Part 1: Making Changes Locally

### Step 1: Open Your Project
1. Open your project folder in your code editor (VS Code, etc.)
2. Make sure you're on the `main` branch:
   ```bash
   git branch
   ```
   (Should show `* main`)

### Step 2: Make Your Changes
Edit any files you want to change:
- **Frontend**: Edit files in `app/` directory
- **API Routes**: Edit files in `app/api/` directory
- **Components**: Edit files in `components/` directory
- **Database Schema**: Edit `prisma/schema.prisma`
- **Styling**: Edit `app/globals.css` or component styles

### Step 3: Test Changes Locally
**Always test before deploying!**

```bash
# Start development server
npm run dev
```

1. Open http://localhost:3000
2. Test the changes you made
3. Fix any bugs or issues
4. Repeat until everything works correctly

---

## Part 2: Database Schema Changes

### If You Changed Prisma Schema

If you modified `prisma/schema.prisma`:

```bash
# Step 1: Generate Prisma Client
npx prisma generate

# Step 2: Push schema changes to database
npx prisma db push

# Step 3: Test locally
npm run dev
```

**Important**: After deploying, you'll need to run these commands in production too (see Part 5).

---

## Part 3: Commit and Push Changes

### Step 1: Check What Changed
```bash
git status
```

This shows all modified files.

### Step 2: Review Your Changes
```bash
# See what changed in each file
git diff

# Or see a summary
git status --short
```

### Step 3: Stage Your Changes
```bash
# Add specific files
git add path/to/file.js

# Or add all changes
git add .
```

### Step 4: Commit Your Changes
```bash
git commit -m "Description of your changes"
```

**Good commit messages:**
- ✅ `"Add cargo tracking search feature"`
- ✅ `"Fix login authentication bug"`
- ✅ `"Update admin dashboard UI"`
- ❌ `"Changes"` (too vague)
- ❌ `"Fixed stuff"` (not descriptive)

### Step 5: Push to GitHub
```bash
git push origin main
```

**If you're on a different branch:**
```bash
git push origin your-branch-name
```

### Step 6: Verify Push Success
1. Go to your GitHub repository
2. Refresh the page
3. You should see your new commit at the top

---

## Part 4: Automatic Deployment (Vercel)

### How It Works

When you push to GitHub:
1. ✅ Vercel detects the push automatically
2. ✅ Starts building your project
3. ✅ Runs `npm install` and `npm run build`
4. ✅ Deploys to production
5. ✅ Your site updates in 2-3 minutes

### Step 1: Monitor Deployment

1. Go to **https://vercel.com**
2. Click on your project
3. Go to **"Deployments"** tab
4. You'll see a new deployment starting (yellow/orange status)
5. Wait for it to complete (green checkmark)

### Step 2: Check Build Logs

If deployment fails:
1. Click on the failed deployment
2. Check the **"Build Logs"** tab
3. Look for error messages
4. Fix the issues locally
5. Push again

### Step 3: Verify Live Site

1. Once deployment shows **"Ready"** (green)
2. Click on the deployment
3. Click **"Visit"** or copy the URL
4. Test your changes on the live site

---

## Part 5: Manual Steps After Deployment

### If You Changed Database Schema

After Vercel deploys, you need to update the production database:

**Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project**:
   ```bash
   vercel link
   ```
   - Select your project
   - Select the directory (usually just press Enter)

4. **Pull environment variables**:
   ```bash
   vercel env pull .env.local
   ```

5. **Update database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Seed data (if needed)**:
   ```bash
   npm run seed
   ```

**Option B: Using Vercel Dashboard**

1. Go to your project in Vercel
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Click **"Redeploy"**
5. This will run the build again (includes `prisma generate`)

**Note**: For `prisma db push`, you'll still need to use Option A (CLI).

---

## Part 6: Working with Branches (Advanced)

### Creating a Feature Branch

For larger changes, use branches:

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Make your changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Add new feature"

# Push branch to GitHub
git push origin feature/new-feature
```

### Creating Pull Request

1. Go to your GitHub repository
2. You'll see a banner: "feature/new-feature had recent pushes"
3. Click **"Compare & pull request"**
4. Fill in the description
5. Click **"Create pull request"**
6. Vercel will create a **preview deployment** for the PR
7. Test the preview URL
8. If everything looks good, merge the PR
9. Merging triggers production deployment

---

## Part 7: Common Update Scenarios

### Scenario 1: Update UI/Design

```bash
# 1. Edit CSS/styling files
# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "Update dashboard styling"
git push origin main

# 4. Wait for Vercel to deploy (automatic)
```

### Scenario 2: Add New Feature

```bash
# 1. Create new files (components, pages, API routes)
# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "Add cargo search feature"
git push origin main

# 4. Vercel auto-deploys
```

### Scenario 3: Fix a Bug

```bash
# 1. Fix the bug in code
# 2. Test the fix locally
npm run dev

# 3. Commit and push
git add .
git commit -m "Fix cargo tracking number validation"
git push origin main

# 4. Vercel auto-deploys
```

### Scenario 4: Update Database Schema

```bash
# 1. Edit prisma/schema.prisma
# 2. Generate and push locally
npx prisma generate
npx prisma db push

# 3. Test locally
npm run dev

# 4. Commit and push
git add .
git commit -m "Add new field to Cargo model"
git push origin main

# 5. After Vercel deploys, update production DB:
vercel link
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

### Scenario 5: Update Dependencies

```bash
# 1. Update package.json or run:
npm install package-name@latest

# 2. Test locally
npm run dev

# 3. Commit and push
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main

# 4. Vercel will run npm install automatically
```

### Scenario 6: Change Environment Variables

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add or edit variables
3. Click **"Save"**
4. Go to **Deployments** → Click **"Redeploy"** on latest deployment
5. Or push a new commit to trigger redeploy

---

## Part 8: Rollback (Undo Changes)

### If Something Goes Wrong

**Option 1: Revert Last Commit**

```bash
# Revert the last commit
git revert HEAD

# Push the revert
git push origin main
```

**Option 2: Rollback Deployment in Vercel**

1. Go to Vercel → Your Project → **Deployments**
2. Find the deployment that was working
3. Click the **"..."** menu
4. Click **"Promote to Production"**
5. Your site will rollback to that version

**Option 3: Revert Database Changes**

```bash
# If you need to revert schema changes
# Edit prisma/schema.prisma to previous version
npx prisma db push
```

---

## Part 9: Best Practices

### ✅ DO:

- **Test locally first** - Always test before pushing
- **Write clear commit messages** - Helps track changes
- **Push small, frequent changes** - Easier to debug issues
- **Check build logs** - If deployment fails, check logs
- **Use branches for big features** - Keeps main branch stable
- **Backup before major changes** - Create a branch or tag

### ❌ DON'T:

- **Don't push untested code** - Test locally first
- **Don't skip commit messages** - Makes history unclear
- **Don't push directly to main** - Use branches for features
- **Don't ignore build errors** - Fix them before deploying
- **Don't change production DB directly** - Use migrations/schema push

---

## Part 10: Troubleshooting

### Issue: "Build failed on Vercel"

**Solutions:**
1. Check build logs in Vercel dashboard
2. Compare with local build: `npm run build`
3. Check for missing dependencies in `package.json`
4. Verify environment variables are set
5. Check for syntax errors in your code

### Issue: "Changes not showing on live site"

**Solutions:**
1. Wait 2-3 minutes for deployment to complete
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache
4. Check if deployment succeeded in Vercel
5. Verify you pushed to the correct branch

### Issue: "Database changes not applied"

**Solutions:**
1. Run `npx prisma generate` locally
2. Run `npx prisma db push` in production (via Vercel CLI)
3. Check MongoDB Atlas connection
4. Verify `DATABASE_URL` environment variable

### Issue: "Environment variables not working"

**Solutions:**
1. Check Vercel → Settings → Environment Variables
2. Make sure variables are set for correct environment
3. Redeploy after adding variables
4. Check variable names match code (case-sensitive)

---

## Quick Reference: Update Workflow

```bash
# 1. Make changes to your code
# ... edit files ...

# 2. Test locally
npm run dev

# 3. Stage changes
git add .

# 4. Commit
git commit -m "Description of changes"

# 5. Push to GitHub
git push origin main

# 6. Wait for Vercel to auto-deploy (2-3 minutes)

# 7. If database schema changed:
vercel link
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

---

## Summary

**Simple Updates:**
1. Edit code → Test locally → Commit → Push → Wait for auto-deploy

**Database Updates:**
1. Edit schema → Test locally → Commit → Push → Update production DB

**Major Features:**
1. Create branch → Make changes → Test → Create PR → Merge → Auto-deploy

---

**🎉 You're now ready to update your deployed project!**

Remember: Test locally first, commit clearly, and let Vercel handle the deployment automatically!

