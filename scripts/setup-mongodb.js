#!/usr/bin/env node

/**
 * MongoDB Setup Helper Script
 * Usage: node scripts/setup-mongodb.js "mongodb+srv://..."
 */

const fs = require('fs');
const path = require('path');

const connectionString = process.argv[2];

if (!connectionString) {
  console.log('❌ Please provide MongoDB connection string');
  console.log('\nUsage: node scripts/setup-mongodb.js "mongodb+srv://..."');
  console.log('\nTo get your connection string:');
  console.log('1. MongoDB Atlas: Database → Connect → Connect your application');
  console.log('2. Copy the connection string');
  console.log('3. Replace <password> with your actual password');
  console.log('4. Add database name: ...mongodb.net/cargo_db?...');
  console.log('\nExample:');
  console.log('mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cargo_db?retryWrites=true&w=majority\n');
  process.exit(1);
}

const envPath = path.join(process.cwd(), '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  
  // Remove old DATABASE_URL if exists
  envContent = envContent.split('\n')
    .filter(line => !line.trim().startsWith('DATABASE_URL='))
    .join('\n');
}

// Add new DATABASE_URL
if (envContent && !envContent.endsWith('\n')) {
  envContent += '\n';
}

envContent += `DATABASE_URL="${connectionString.trim()}"\n`;

if (!envContent.includes('NODE_ENV=')) {
  envContent += 'NODE_ENV=development\n';
}

fs.writeFileSync(envPath, envContent);
console.log('✅ Created/updated .env file with MongoDB connection string\n');

console.log('Next steps:');
console.log('1. Run: npx prisma generate');
console.log('2. Run: npx prisma db push');
console.log('3. Test: npm run test-db\n');

