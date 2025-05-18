const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('Connecting to database...');

    // Test if we can query the users table
    const userCount = await prisma.user.count();
    console.log('Successfully connected to database!');
    console.log(`Number of users in the database: ${userCount}`);

    // Test if we can query other tables
    const treeCount = await prisma.tree.count();
    console.log(`Number of trees in the database: ${treeCount}`);
  } catch (error) {
    console.error('Error connecting to database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
