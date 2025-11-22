#!/usr/bin/env node

/**
 * Remove old admin user (username: admin) from database
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeOldAdmin() {
  try {
    console.log('🔍 Checking for old admin user...\n');

    // Check if old admin user exists
    const oldAdmin = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (oldAdmin) {
      console.log('⚠️  Found old admin user (username: admin)');
      console.log('   Removing old admin user...\n');
      
      await prisma.user.delete({
        where: { username: 'admin' },
      });
      
      console.log('✅ Old admin user removed successfully');
    } else {
      console.log('✅ No old admin user found (username: admin)');
    }

    // Verify new admin exists
    const newAdmin = await prisma.user.findUnique({
      where: { username: 'ubaidtra' },
    });

    if (newAdmin) {
      console.log('✅ New admin user confirmed (username: ubaidtra)');
    } else {
      console.log('⚠️  New admin user not found. Run: npm run seed');
    }

    console.log('\n✅ Cleanup completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

removeOldAdmin();

