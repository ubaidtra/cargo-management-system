#!/usr/bin/env node

/**
 * Diagnose database connection issues
 */

const { PrismaClient } = require('@prisma/client');

console.log('🔍 Database Connection Diagnostics\n');
console.log('Current DATABASE_URL format:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
console.log('');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function diagnose() {
  try {
    console.log('Attempting connection...\n');
    await prisma.$connect();
    console.log('✅ SUCCESS: Connected to database!\n');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version() as version`;
    console.log('Database version:', result[0]?.version);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed\n');
    console.error('Error details:');
    console.error('- Code:', error.code || 'N/A');
    console.error('- Message:', error.message);
    
    if (error.meta) {
      console.error('- Meta:', JSON.stringify(error.meta, null, 2));
    }
    
    console.error('\n📋 Troubleshooting steps:');
    console.error('1. Verify your Supabase project is active (not paused)');
    console.error('2. Get the exact connection string from Supabase dashboard:');
    console.error('   https://supabase.com/dashboard/project/qfmvvzmzyvsaczatadpz/settings/database');
    console.error('3. Copy from "Connection string" → "URI" tab');
    console.error('4. Use: node scripts/setup-env-from-string.js "YOUR_CONNECTION_STRING"');
    console.error('\nCommon issues:');
    console.error('- Project is paused (free tier): Wake it up in dashboard');
    console.error('- Wrong password: Reset it in Supabase settings');
    console.error('- Network/firewall: Check if port 5432 is accessible');
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

diagnose();

