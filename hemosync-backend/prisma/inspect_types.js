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
  const types = await prisma.$queryRaw`
    SELECT "bloodType", count(*)::int as count 
    FROM "BloodUnit" 
    GROUP BY "bloodType"
  `;
  console.log('Distinct blood types in BloodUnit table:');
  console.log(types);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
