#!/usr/bin/env node

/**
 * Supabase Setup Helper Script
 * Helps configure the project for Supabase PostgreSQL database
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🚀 Supabase Database Setup\n');
  console.log('Your Supabase Project: qfmvvzmzyvsaczatadpz\n');
  
  // Check for password in command line args or environment variable
  let password = process.argv[2] || process.env.SUPABASE_DB_PASSWORD;
  let usePoolingBool = true; // Default to pooling
  
  if (!password) {
    console.log('To get your database password:');
    console.log('1. Go to: https://supabase.com/dashboard/project/qfmvvzmzyvsaczatadpz');
    console.log('2. Navigate to Settings → Database');
    console.log('3. Find your database password (or reset it if needed)\n');
    
    password = await question('Enter your database password: ');
    
    if (!password || password.trim() === '') {
      console.log('❌ Password is required. Exiting.');
      console.log('\nAlternatively, run: npm run setup-supabase -- YOUR_PASSWORD');
      console.log('Or set: SUPABASE_DB_PASSWORD=YOUR_PASSWORD npm run setup-supabase\n');
      process.exit(1);
    }
    
    const usePooling = await question('Use connection pooling? (recommended for production) [Y/n]: ');
    usePoolingBool = usePooling.toLowerCase() !== 'n';
  } else {
    console.log('✅ Using password from command line argument or environment variable\n');
  }
  
  let connectionString;
  if (usePoolingBool) {
    connectionString = `postgresql://postgres:${password}@db.qfmvvzmzyvsaczatadpz.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1`;
  } else {
    connectionString = `postgresql://postgres:${password}@db.qfmvvzmzyvsaczatadpz.supabase.co:5432/postgres`;
  }
  
  // Check if .env exists
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if DATABASE_URL already exists
    if (envContent.includes('DATABASE_URL=')) {
      const overwrite = await question('DATABASE_URL already exists in .env. Overwrite? [y/N]: ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Cancelled. Exiting.');
        process.exit(0);
      }
      
      // Remove old DATABASE_URL line
      envContent = envContent.split('\n')
        .filter(line => !line.trim().startsWith('DATABASE_URL='))
        .join('\n');
    }
  }
  
  // Add DATABASE_URL
  if (envContent && !envContent.endsWith('\n')) {
    envContent += '\n';
  }
  envContent += `DATABASE_URL="${connectionString}"\n`;
  
  if (!envContent.includes('NODE_ENV=')) {
    envContent += 'NODE_ENV=development\n';
  }
  
  // Write .env file
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Created/updated .env file with DATABASE_URL\n');
  
  console.log('Next steps:');
  console.log('1. Run: npx prisma generate');
  console.log('2. Run: npx prisma migrate dev --name migrate_to_postgresql');
  console.log('3. Test: node scripts/verify-db.js\n');
  
  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

