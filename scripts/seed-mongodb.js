#!/usr/bin/env node

/**
 * Seed MongoDB with initial data
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Seeding MongoDB database...\n');

    // Check if pricing config exists
    const existingPricing = await prisma.pricingConfig.findFirst();
    if (!existingPricing) {
      await prisma.pricingConfig.create({
        data: {
          baseCost: 10.0,
          costPerKg: 5.0,
        },
      });
      console.log('✅ Created default pricing configuration');
    } else {
      console.log('ℹ️  Pricing configuration already exists');
    }

    // Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'ubaidtra' },
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          username: 'ubaidtra',
          password: 'trawally2025',
          role: 'ADMIN',
        },
      });
      console.log('✅ Created default admin user (username: ubaidtra, password: trawally2025)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

