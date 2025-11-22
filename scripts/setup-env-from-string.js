#!/usr/bin/env node

/**
 * Setup .env file from Supabase connection string
 * Usage: node scripts/setup-env-from-string.js "postgresql://..."
 */

const fs = require('fs');
const path = require('path');

const connectionString = process.argv[2];

if (!connectionString) {
  console.log('❌ Please provide the connection string from Supabase dashboard');
  console.log('\nUsage: node scripts/setup-env-from-string.js "postgresql://..."');
  console.log('\nTo get your connection string:');
  console.log('1. Go to: https://supabase.com/dashboard/project/qfmvvzmzyvsaczatadpz/settings/database');
  console.log('2. Copy the connection string from "Connection string" → "URI" tab');
  console.log('3. Run this script with that connection string\n');
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

// For production/serverless, add pgbouncer params if not present
let finalConnectionString = connectionString.trim();
if (!finalConnectionString.includes('pgbouncer') && !finalConnectionString.includes('connection_limit')) {
  // Add pgbouncer params for serverless compatibility
  const separator = finalConnectionString.includes('?') ? '&' : '?';
  finalConnectionString += `${separator}pgbouncer=true&connection_limit=1`;
}

envContent += `DATABASE_URL="${finalConnectionString}"\n`;

if (!envContent.includes('NODE_ENV=')) {
  envContent += 'NODE_ENV=development\n';
}

fs.writeFileSync(envPath, envContent);
console.log('✅ Created/updated .env file\n');
console.log('Next steps:');
console.log('1. Run: npx prisma generate');
console.log('2. Run: npx prisma migrate dev --name migrate_to_postgresql');
console.log('3. Test: node scripts/test-connection.js\n');

