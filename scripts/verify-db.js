const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

async function main() {
  console.log('Verifying database connection...');
  try {
    const userCount = await prisma.user.count();
    const cargoCount = await prisma.cargo.count();
    console.log(`Success! Database connected.`);
    console.log(`Users: ${userCount}`);
    console.log(`Cargo: ${cargoCount}`);
  } catch (e) {
    console.error('Database verification failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
