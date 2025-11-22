#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Checks if the project is ready for deployment
 */

const fs = require('fs');
const path = require('path');

const checks = [];
const errors = [];
const warnings = [];

// Check 1: Verify package.json exists and has required scripts
console.log('🔍 Running pre-deployment checks...\n');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check build script
  if (packageJson.scripts.build) {
    checks.push('✅ Build script found');
  } else {
    errors.push('❌ Build script missing in package.json');
  }
  
  // Check postinstall script
  if (packageJson.scripts.postinstall) {
    checks.push('✅ Postinstall script found');
  } else {
    warnings.push('⚠️  Postinstall script missing (recommended for Prisma)');
  }
  
  // Check dependencies
  if (packageJson.dependencies['@prisma/client'] && packageJson.dependencies['prisma']) {
    checks.push('✅ Prisma dependencies found');
  } else {
    errors.push('❌ Prisma dependencies missing');
  }
  
  if (packageJson.dependencies['next']) {
    checks.push('✅ Next.js dependency found');
  } else {
    errors.push('❌ Next.js dependency missing');
  }
} catch (e) {
  errors.push(`❌ Error reading package.json: ${e.message}`);
}

// Check 2: Verify Prisma schema exists
if (fs.existsSync('prisma/schema.prisma')) {
  checks.push('✅ Prisma schema found');
  
  // Check if using SQLite (warning for production)
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
  if (schema.includes('provider = "sqlite"')) {
    warnings.push('⚠️  Using SQLite - NOT recommended for production! Migrate to PostgreSQL.');
  } else if (schema.includes('provider = "postgresql"')) {
    checks.push('✅ Using PostgreSQL (production-ready)');
  }
} else {
  errors.push('❌ Prisma schema not found');
}

// Check 3: Verify next.config.mjs exists
if (fs.existsSync('next.config.mjs')) {
  checks.push('✅ Next.js config found');
} else {
  warnings.push('⚠️  next.config.mjs not found (optional but recommended)');
}

// Check 4: Verify .gitignore exists
if (fs.existsSync('.gitignore')) {
  checks.push('✅ .gitignore found');
} else {
  warnings.push('⚠️  .gitignore not found');
}

// Check 5: Verify environment variable documentation
if (fs.existsSync('DEPLOYMENT.md')) {
  checks.push('✅ Deployment documentation found');
} else {
  warnings.push('⚠️  DEPLOYMENT.md not found');
}

// Display results
console.log('Results:\n');
checks.forEach(check => console.log(check));
console.log('');

if (warnings.length > 0) {
  console.log('Warnings:');
  warnings.forEach(warning => console.log(warning));
  console.log('');
}

if (errors.length > 0) {
  console.log('Errors:');
  errors.forEach(error => console.log(error));
  console.log('');
  console.log('❌ Deployment checks failed. Please fix the errors above.');
  process.exit(1);
} else {
  console.log('✅ All critical checks passed!');
  if (warnings.length > 0) {
    console.log('⚠️  Please review warnings before deploying.');
  } else {
    console.log('🚀 Ready for deployment!');
  }
  process.exit(0);
}

