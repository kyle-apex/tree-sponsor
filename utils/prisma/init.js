const { PrismaClient } = require('@prisma/client');
     // Check if prisma instance exists in global scope for hot reloading
const globalForPrisma = global;
console.log('globalForPrisma.prisma', !!globalForPrisma.prisma);
const prisma = globalForPrisma.prisma || new PrismaClient();
//if (process.env.NODE_ENV !== 'production') 
globalForPrisma.prisma = prisma;
module.exports = { prisma };
