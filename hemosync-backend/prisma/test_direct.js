require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  const c = await prisma.user.count();
  console.log('Count via DIRECT_URL:', c);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
