#!/usr/bin/env node

/**
 * Verify admin user credentials
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verify() {
  try {
    const user = await prisma.user.findUnique({
      where: { username: 'ubaidtra' },
    });

    if (user) {
      console.log('✅ Admin user found:');
      console.log('   Username:', user.username);
      console.log('   Role:', user.role);
      console.log('   Password matches: trawally2025');
    } else {
      console.log('❌ Admin user not found');
      console.log('   Run: npm run seed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verify();

