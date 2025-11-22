const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const dbUrl = process.env.DATABASE_URL || '';
    // Mask password in connection string
    const maskedUrl = dbUrl.replace(/(mongodb\+srv?:\/\/[^:]+:)([^@]+)(@.+)/, '$1****$3');
    console.log('DATABASE_URL:', maskedUrl);
    console.log('');
    
    await prisma.$connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    // Try a simple query (MongoDB compatible)
    const userCount = await prisma.user.count();
    const cargoCount = await prisma.cargo.count();
    console.log(`✅ Query test successful:`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Cargo: ${cargoCount}`);
    
    await prisma.$disconnect();
    console.log('\n✅ Database connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error('Error code:', error.code || 'N/A');
    console.error('Error message:', error.message);
    if (error.meta) {
      console.error('Meta:', JSON.stringify(error.meta, null, 2));
    }
    
    console.error('\n📋 Troubleshooting:');
    console.error('1. Verify DATABASE_URL is set correctly in .env');
    console.error('2. Check MongoDB connection string format');
    console.error('3. Ensure MongoDB cluster is running (if Atlas)');
    console.error('4. Verify IP whitelist (if using MongoDB Atlas)');
    console.error('5. Check username/password are correct');
    
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
}

testConnection();

